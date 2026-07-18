const mongoose = require('mongoose');

const savedPCBuildSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a build name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  components: {
    cpu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    motherboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    gpu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    ram: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    ssd: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    hdd: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    psu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    cpuCooler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    }
  },
  totalWattage: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  compatibility: {
    isCompatible: {
      type: Boolean,
      default: true
    },
    issues: [{
      type: String
    }]
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
savedPCBuildSchema.pre('save', async function(next) {
  const Product = require('./Product');
  
  let totalWattage = 0;
  let totalPrice = 0;
  const issues = [];
  
  // Get CPU
  if (this.components.cpu) {
    const cpu = await Product.findById(this.components.cpu);
    if (cpu) {
      totalWattage += cpu.tdp || 65;
      totalPrice += cpu.price;
    }
  }
  
  // Get GPU
  if (this.components.gpu) {
    const gpu = await Product.findById(this.components.gpu);
    if (gpu) {
      totalWattage += gpu.tdp || 150;
      totalPrice += gpu.price;
    }
  }
  
  // Get Motherboard
  if (this.components.motherboard) {
    const motherboard = await Product.findById(this.components.motherboard);
    if (motherboard) {
      totalPrice += motherboard.price;
      
      // Check CPU socket compatibility
      if (this.components.cpu) {
        const cpu = await Product.findById(this.components.cpu);
        if (cpu && cpu.socket !== motherboard.socket) {
          issues.push(`CPU socket ${cpu.socket} is not compatible with motherboard socket ${motherboard.socket}`);
        }
      }
      
      // Check RAM compatibility
      if (this.components.ram && this.components.ram.length > 0) {
        const ram = await Product.findById(this.components.ram[0]);
        if (ram && ram.ramType !== motherboard.ramType) {
          issues.push(`RAM type ${ram.ramType} is not compatible with motherboard RAM type ${motherboard.ramType}`);
        }
        
        if (this.components.ram.length > motherboard.ramSlots) {
          issues.push(`Too many RAM sticks. Motherboard has only ${motherboard.ramSlots} slots`);
        }
      }
    }
  }
  
  // Get RAM
  for (const ramId of this.components.ram || []) {
    const ram = await Product.findById(ramId);
    if (ram) {
      totalWattage += ram.tdp || 5;
      totalPrice += ram.price;
    }
  }
  
  // Get SSD
  for (const ssdId of this.components.ssd || []) {
    const ssd = await Product.findById(ssdId);
    if (ssd) {
      totalWattage += ssd.tdp || 5;
      totalPrice += ssd.price;
    }
  }
  
  // Get HDD
  for (const hddId of this.components.hdd || []) {
    const hdd = await Product.findById(hddId);
    if (hdd) {
      totalWattage += hdd.tdp || 10;
      totalPrice += hdd.price;
    }
  }
  
  // Get PSU
  if (this.components.psu) {
    const psu = await Product.findById(this.components.psu);
    if (psu) {
      totalPrice += psu.price;
      
      // Check if PSU has enough wattage (add 20% buffer)
      const requiredWattage = totalWattage * 1.2;
      if (psu.wattage < requiredWattage) {
        issues.push(`PSU wattage (${psu.wattage}W) is insufficient. Required: ${Math.ceil(requiredWattage)}W`);
      }
    }
  } else {
    issues.push('No PSU selected');
  }
  
  // Get CPU Cooler
  if (this.components.cpuCooler) {
    const cpuCooler = await Product.findById(this.components.cpuCooler);
    if (cpuCooler) {
      totalWattage += cpuCooler.tdp || 5;
      totalPrice += cpuCooler.price;
    }
  }
  
  // Get Case
  if (this.components.case) {
    const pcCase = await Product.findById(this.components.case);
    if (pcCase) {
      totalPrice += pcCase.price;
      
      // Check motherboard form factor compatibility
      if (this.components.motherboard) {
        const motherboard = await Product.findById(this.components.motherboard);
        if (motherboard && motherboard.formFactor !== pcCase.formFactor) {
          issues.push(`Motherboard form factor ${motherboard.formFactor} may not fit in case ${pcCase.formFactor}`);
        }
      }
    }
  }
  
  this.totalWattage = totalWattage;
  this.totalPrice = totalPrice;
  this.compatibility.isCompatible = issues.length === 0;
  this.compatibility.issues = issues;
  
  next();
});

module.exports = mongoose.model('SavedPCBuild', savedPCBuildSchema);
