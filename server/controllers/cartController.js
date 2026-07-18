const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const getCart = async (req, res, next) => {
  try {
    let cart;

    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    } else if (req.query.guestId) {
      cart = await Cart.findOne({ guestId: req.query.guestId }).populate('items.product');
    }

    if (!cart) {
      return res.json({ success: true, cart: { items: [], subtotal: 0, discount: 0, total: 0 } });
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, guestId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
      }
    } else {
      cart = await Cart.findOne({ guestId });
      if (!cart) {
        cart = await Cart.create({ guestId, items: [] });
      }
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId, quantity } = req.body;

    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
    } else if (req.body.guestId) {
      cart = await Cart.findOne({ guestId: req.body.guestId });
    }

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { itemId, guestId } = req.body;

    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
    } else {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    await cart.populate('items.product');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
    } else if (req.body.guestId) {
      cart = await Cart.findOne({ guestId: req.body.guestId });
    }

    if (cart) {
      cart.items = [];
      cart.coupon = null;
      cart.discount = 0;
      await cart.save();
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const { code, guestId } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({ success: false, message: 'Coupon is expired or inactive' });
    }

    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
    } else {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Check minimum purchase
    if (cart.subtotal < coupon.minPurchase) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum purchase of $${coupon.minPurchase} required` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cart.subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    cart.coupon = coupon._id;
    cart.discount = discount;
    await cart.save();
    await cart.populate('items.product coupon');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const removeCoupon = async (req, res, next) => {
  try {
    const { guestId } = req.body;

    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
    } else {
      cart = await Cart.findOne({ guestId });
    }

    if (cart) {
      cart.coupon = null;
      cart.discount = 0;
      await cart.save();
      await cart.populate('items.product');
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const mergeGuestCart = async (req, res, next) => {
  try {
    const { guestId } = req.body;

    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart) {
      return res.json({ success: true, message: 'No guest cart to merge' });
    }

    let userCart = await Cart.findOne({ user: req.user.id });
    if (!userCart) {
      guestCart.user = req.user.id;
      guestCart.guestId = null;
      await guestCart.save();
      await guestCart.populate('items.product');
      return res.json({ success: true, cart: guestCart });
    }

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        item => item.product.toString() === guestItem.product.toString()
      );

      if (existingItemIndex > -1) {
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    await guestCart.deleteOne();
    await userCart.save();
    await userCart.populate('items.product');

    res.json({ success: true, cart: userCart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  mergeGuestCart
};
