const Coupon = require('../models/Coupon');

const getCoupons = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(query);

    res.json({
      success: true,
      count: coupons.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      coupons
    });
  } catch (error) {
    next(error);
  }
};

const getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({ success: false, message: 'Coupon is expired or inactive' });
    }

    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    Object.assign(coupon, req.body);
    await coupon.save();

    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    await coupon.deleteOne();

    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
