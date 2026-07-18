const Product = require('../models/Product');
const Category = require('../models/Category');

const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Brand filter
    if (req.query.brand) {
      query.brand = { $in: req.query.brand.split(',') };
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.minRating) {
      query.ratings = { $gte: parseFloat(req.query.minRating) };
    }

    // Availability filter
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // PC Component type filter
    if (req.query.componentType) {
      query.pcComponentType = req.query.componentType;
    }

    // Featured, New Arrival, Best Seller
    if (req.query.featured === 'true') query.featured = true;
    if (req.query.newArrival === 'true') query.newArrival = true;
    if (req.query.bestSeller === 'true') query.bestSeller = true;

    // Active products only
    query.isActive = true;

    // Sorting
    let sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort;
      if (sortField === 'price-asc') sort = { price: 1 };
      else if (sortField === 'price-desc') sort = { price: -1 };
      else if (sortField === 'rating') sort = { ratings: -1 };
      else if (sortField === 'newest') sort = { createdAt: -1 };
      else if (sortField === 'name') sort = { name: 1 };
    } else {
      sort = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

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

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    // Update category product count
    await Category.findByIdAndUpdate(product.category, {
      $inc: { productCount: 1 }
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const oldCategory = product.category;
    Object.assign(product, req.body);
    await product.save();

    // Update category counts if category changed
    if (oldCategory.toString() !== product.category.toString()) {
      await Category.findByIdAndUpdate(oldCategory, { $inc: { productCount: -1 } });
      await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update category product count
    await Category.findByIdAndUpdate(product.category, {
      $inc: { productCount: -1 }
    });

    await product.deleteOne();

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ newArrival: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ bestSeller: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ soldCount: -1 })
      .limit(8);

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
      .populate('category', 'name slug')
      .limit(6);

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find({ category: category._id, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ category: category._id, isActive: true });

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

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getRelatedProducts,
  getProductsByCategory
};
