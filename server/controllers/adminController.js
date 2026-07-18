const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const topProducts = await Product.find()
      .sort({ soldCount: -1 })
      .limit(5);

    // Monthly revenue for the last 6 months
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        totalUsers,
        totalProducts
      },
      recentOrders,
      topProducts,
      monthlyRevenue
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block admin user' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

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

const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  blockUser,
  changeUserRole,
  getAllOrders,
  getAllProducts,
  getAllCategories,
  getAllCoupons
};
