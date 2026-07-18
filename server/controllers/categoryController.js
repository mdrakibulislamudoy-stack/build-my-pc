const Category = require('../models/Category');
const Product = require('../models/Product');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name')
      .sort({ name: 1 });

    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name');

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate('parent', 'name');

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    Object.assign(category, req.body);
    await category.save();

    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category with products' 
      });
    }

    await category.deleteOne();

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
