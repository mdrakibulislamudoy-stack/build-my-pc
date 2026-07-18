const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const SavedPCBuild = require('../models/SavedPCBuild');
const Notification = require('../models/Notification');

const createOrder = async (req, res, next) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      couponCode,
      pcBuildId,
      notes
    } = req.body;

    let cart;
    let items = [];
    let subtotal = 0;

    // Check if ordering a PC build
    if (pcBuildId) {
      const pcBuild = await SavedPCBuild.findById(pcBuildId).populate('components.cpu components.motherboard components.gpu components.ram components.ssd components.hdd components.psu components.cpuCooler components.case');
      
      if (!pcBuild || pcBuild.user.toString() !== req.user.id) {
        return res.status(404).json({ success: false, message: 'PC build not found' });
      }

      if (!pcBuild.compatibility.isCompatible) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot order incompatible PC build',
          issues: pcBuild.compatibility.issues
        });
      }

      // Convert PC build to order items
      const componentMap = {
        cpu: pcBuild.components.cpu,
        motherboard: pcBuild.components.motherboard,
        gpu: pcBuild.components.gpu,
        psu: pcBuild.components.psu,
        cpuCooler: pcBuild.components.cpuCooler,
        case: pcBuild.components.case
      };

      for (const [key, component] of Object.entries(componentMap)) {
        if (component) {
          items.push({
            product: component._id,
            name: component.name,
            image: component.images[0] || '',
            quantity: 1,
            price: component.price
          });
          subtotal += component.price;
        }
      }

      for (const ram of pcBuild.components.ram || []) {
        items.push({
          product: ram._id,
          name: ram.name,
          image: ram.images[0] || '',
          quantity: 1,
          price: ram.price
        });
        subtotal += ram.price;
      }

      for (const ssd of pcBuild.components.ssd || []) {
        items.push({
          product: ssd._id,
          name: ssd.name,
          image: ssd.images[0] || '',
          quantity: 1,
          price: ssd.price
        });
        subtotal += ssd.price;
      }

      for (const hdd of pcBuild.components.hdd || []) {
        items.push({
          product: hdd._id,
          name: hdd.name,
          image: hdd.images[0] || '',
          quantity: 1,
          price: hdd.price
        });
        subtotal += hdd.price;
      }
    } else {
      // Regular cart order
      cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      items = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0] || '',
        quantity: item.quantity,
        price: item.price
      }));

      subtotal = cart.subtotal;
    }

    // Check stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.name}` 
        });
      }
    }

    // Calculate totals
    let discount = 0;
    let coupon = null;

    if (couponCode) {
      const couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (couponDoc && couponDoc.isValid()) {
        if (couponDoc.discountType === 'percentage') {
          discount = (subtotal * couponDoc.discountValue) / 100;
          if (couponDoc.maxDiscount && discount > couponDoc.maxDiscount) {
            discount = couponDoc.maxDiscount;
          }
        } else {
          discount = couponDoc.discountValue;
        }
        coupon = couponDoc._id;
        couponDoc.usedCount += 1;
        await couponDoc.save();
      }
    }

    const shippingCost = subtotal > 500 ? 0 : 20;
    const tax = subtotal * 0.1;
    const total = subtotal + shippingCost + tax - discount;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items,
      pcBuild: pcBuildId || null,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      discount,
      coupon,
      total,
      notes: notes || '',
      statusHistory: [{ status: 'pending', timestamp: Date.now() }]
    });

    // Update product stock and sold count
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity }
      });
    }

    // Clear cart if not a PC build order
    if (!pcBuildId && cart) {
      cart.items = [];
      cart.coupon = null;
      cart.discount = 0;
      await cart.save();
    }

    // Add to user's order history
    await require('../models/User').findByIdAndUpdate(req.user.id, {
      $push: { orderHistory: order._id }
    });

    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'order',
      title: 'Order Placed Successfully',
      message: `Your order ${order.orderNumber} has been placed successfully.`,
      link: `/orders/${order._id}`
    });

    await order.populate('items.product');

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('pcBuild');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: Date.now(),
      note: note || ''
    });

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (status === 'cancelled') {
      order.isCancelled = true;
      order.cancelledAt = Date.now();
      order.cancellationReason = note || '';

      // Restore stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity }
        });
      }
    }

    await order.save();

    // Create notification
    await Notification.create({
      user: order.user,
      type: 'order',
      title: `Order Status Updated`,
      message: `Your order ${order.orderNumber} status has been updated to ${status}.`,
      link: `/orders/${order._id}`
    });

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel shipped or delivered orders' 
      });
    }

    order.status = 'cancelled';
    order.isCancelled = true;
    order.cancelledAt = Date.now();
    order.cancellationReason = reason || '';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: Date.now(),
      note: reason || ''
    });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity }
      });
    }

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
