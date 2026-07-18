const SavedPCBuild = require('../models/SavedPCBuild');
const Product = require('../models/Product');

const getCompatibleComponents = async (req, res, next) => {
  try {
    const { componentType, socket, ramType, formFactor, wattage } = req.query;

    const query = { 
      pcComponentType: componentType,
      isActive: true 
    };

    if (socket) query.socket = socket;
    if (ramType) query.ramType = ramType;
    if (formFactor) query.formFactor = formFactor;
    if (wattage) query.wattage = { $gte: parseInt(wattage) };

    const components = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ price: 1 });

    res.json({ success: true, components });
  } catch (error) {
    next(error);
  }
};

const checkCompatibility = async (req, res, next) => {
  try {
    const { components } = req.body;

    const issues = [];
    const warnings = [];

    // Get all products
    const products = {};
    for (const [key, productId] of Object.entries(components)) {
      if (productId) {
        products[key] = await Product.findById(productId);
      }
    }

    // Check CPU and Motherboard socket compatibility
    if (products.cpu && products.motherboard) {
      if (products.cpu.socket !== products.motherboard.socket) {
        issues.push(`CPU socket ${products.cpu.socket} is not compatible with motherboard socket ${products.motherboard.socket}`);
      }
    }

    // Check RAM and Motherboard compatibility
    if (products.ram && products.motherboard) {
      const ram = Array.isArray(products.ram) ? products.ram[0] : products.ram;
      if (ram && ram.ramType !== products.motherboard.ramType) {
        issues.push(`RAM type ${ram.ramType} is not compatible with motherboard RAM type ${products.motherboard.ramType}`);
      }

      const ramCount = Array.isArray(products.ram) ? products.ram.length : 1;
      if (ramCount > products.motherboard.ramSlots) {
        issues.push(`Too many RAM sticks. Motherboard has only ${products.motherboard.ramSlots} slots`);
      }
    }

    // Check Case and Motherboard form factor
    if (products.case && products.motherboard) {
      if (products.motherboard.formFactor !== products.case.formFactor) {
        warnings.push(`Motherboard form factor ${products.motherboard.formFactor} may not fit in case ${products.case.formFactor}`);
      }
    }

    // Check PSU wattage
    if (products.psu) {
      let totalWattage = 0;

      if (products.cpu) totalWattage += products.cpu.tdp || 65;
      if (products.gpu) totalWattage += products.gpu.tdp || 150;
      if (products.ram) {
        const ramArray = Array.isArray(products.ram) ? products.ram : [products.ram];
        ramArray.forEach(ram => totalWattage += ram.tdp || 5);
      }
      if (products.ssd) {
        const ssdArray = Array.isArray(products.ssd) ? products.ssd : [products.ssd];
        ssdArray.forEach(ssd => totalWattage += ssd.tdp || 5);
      }
      if (products.hdd) {
        const hddArray = Array.isArray(products.hdd) ? products.hdd : [products.hdd];
        hddArray.forEach(hdd => totalWattage += hdd.tdp || 10);
      }
      if (products.cpuCooler) totalWattage += products.cpuCooler.tdp || 5;

      const requiredWattage = totalWattage * 1.2; // 20% buffer
      if (products.psu.wattage < requiredWattage) {
        issues.push(`PSU wattage (${products.psu.wattage}W) is insufficient. Required: ${Math.ceil(requiredWattage)}W`);
      }
    } else {
      issues.push('No PSU selected');
    }

    // Calculate totals
    let totalPrice = 0;
    let totalWattage = 0;

    for (const [key, product] of Object.entries(products)) {
      if (product) {
        if (Array.isArray(product)) {
          product.forEach(p => {
            totalPrice += p.price;
            totalWattage += p.tdp || 10;
          });
        } else {
          totalPrice += product.price;
          totalWattage += product.tdp || 10;
        }
      }
    }

    res.json({
      success: true,
      isCompatible: issues.length === 0,
      issues,
      warnings,
      totalWattage,
      totalPrice
    });
  } catch (error) {
    next(error);
  }
};

const savePCBuild = async (req, res, next) => {
  try {
    const { name, description, components } = req.body;

    const build = await SavedPCBuild.create({
      user: req.user.id,
      name,
      description,
      components
    });

    await build.populate('components.cpu components.motherboard components.gpu components.ram components.ssd components.hdd components.psu components.cpuCooler components.case');

    res.status(201).json({ success: true, build });
  } catch (error) {
    next(error);
  }
};

const getSavedBuilds = async (req, res, next) => {
  try {
    const builds = await SavedPCBuild.find({ user: req.user.id })
      .populate('components.cpu components.motherboard components.gpu components.ram components.ssd components.hdd components.psu components.cpuCooler components.case')
      .sort({ createdAt: -1 });

    res.json({ success: true, builds });
  } catch (error) {
    next(error);
  }
};

const getSavedBuildById = async (req, res, next) => {
  try {
    const build = await SavedPCBuild.findById(req.params.id)
      .populate('components.cpu components.motherboard components.gpu components.ram components.ssd components.hdd components.psu components.cpuCooler components.case')
      .populate('user', 'name avatar');

    if (!build) {
      return res.status(404).json({ success: false, message: 'Build not found' });
    }

    // Check if user owns the build or it's public
    if (build.user.toString() !== req.user.id && !build.isPublic) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Increment view count
    build.views += 1;
    await build.save();

    res.json({ success: true, build });
  } catch (error) {
    next(error);
  }
};

const updateSavedBuild = async (req, res, next) => {
  try {
    const build = await SavedPCBuild.findById(req.params.id);

    if (!build) {
      return res.status(404).json({ success: false, message: 'Build not found' });
    }

    if (build.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, description, components, isPublic } = req.body;

    if (name) build.name = name;
    if (description) build.description = description;
    if (components) build.components = components;
    if (isPublic !== undefined) build.isPublic = isPublic;

    await build.save();
    await build.populate('components.cpu components.motherboard components.gpu components.ram components.ssd components.hdd components.psu components.cpuCooler components.case');

    res.json({ success: true, build });
  } catch (error) {
    next(error);
  }
};

const deleteSavedBuild = async (req, res, next) => {
  try {
    const build = await SavedPCBuild.findById(req.params.id);

    if (!build) {
      return res.status(404).json({ success: false, message: 'Build not found' });
    }

    if (build.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await build.deleteOne();

    res.json({ success: true, message: 'Build deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getPublicBuilds = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const builds = await SavedPCBuild.find({ isPublic: true })
      .populate('user', 'name avatar')
      .populate('components.cpu components.motherboard components.gpu')
      .sort({ likes: -1, views: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SavedPCBuild.countDocuments({ isPublic: true });

    res.json({
      success: true,
      count: builds.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      builds
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompatibleComponents,
  checkCompatibility,
  savePCBuild,
  getSavedBuilds,
  getSavedBuildById,
  updateSavedBuild,
  deleteSavedBuild,
  getPublicBuilds
};
