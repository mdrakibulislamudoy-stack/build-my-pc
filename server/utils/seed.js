require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedUsers = async () => {
  await User.deleteMany();

  const adminPassword = 'admin123';
  const userPassword = 'user123';

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@buildmypc.com',
    password: adminPassword,
    role: 'admin',
    isVerified: true
  });

  const users = await User.create([
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      phone: '1234567890',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      },
      isVerified: true
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPassword,
      phone: '0987654321',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA'
      },
      isVerified: true
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: userPassword,
      isVerified: true
    },
    {
      name: 'Alice Williams',
      email: 'alice@example.com',
      password: userPassword,
      isVerified: true
    },
    {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      password: userPassword,
      isVerified: true
    },
    {
      name: 'Diana Prince',
      email: 'diana@example.com',
      password: userPassword,
      isVerified: true
    },
    {
      name: 'Eve Anderson',
      email: 'eve@example.com',
      password: userPassword,
      isVerified: true
    },
    {
      name: 'Frank Miller',
      email: 'frank@example.com',
      password: userPassword,
      isVerified: true
    },
    {
      name: 'Grace Lee',
      email: 'grace@example.com',
      password: userPassword,
      isVerified: true
    },
    {
      name: 'Henry Davis',
      email: 'henry@example.com',
      password: userPassword,
      isVerified: true
    }
  ]);

  console.log('Users seeded');
  return { admin, users };
};

const seedCategories = async () => {
  await Category.deleteMany();

  const categories = await Category.create([
    { name: 'Processors', description: 'CPUs from Intel and AMD', image: '' },
    { name: 'Motherboards', description: 'Motherboards for all form factors', image: '' },
    { name: 'Graphics Cards', description: 'GPUs from NVIDIA and AMD', image: '' },
    { name: 'Memory', description: 'RAM modules', image: '' },
    { name: 'Storage', description: 'SSDs and HDDs', image: '' },
    { name: 'Power Supplies', description: 'PSUs for all builds', image: '' },
    { name: 'CPU Coolers', description: 'Air and liquid coolers', image: '' },
    { name: 'Cases', description: 'PC cases in various sizes', image: '' },
    { name: 'Monitors', description: 'Gaming and professional monitors', image: '' },
    { name: 'Peripherals', description: 'Keyboards, mice, and accessories', image: '' }
  ]);

  console.log('Categories seeded');
  return categories;
};

const seedProducts = async (categories) => {
  await Product.deleteMany();

  const categoryMap = {
    'Processors': categories.find(c => c.name === 'Processors')._id,
    'Motherboards': categories.find(c => c.name === 'Motherboards')._id,
    'Graphics Cards': categories.find(c => c.name === 'Graphics Cards')._id,
    'Memory': categories.find(c => c.name === 'Memory')._id,
    'Storage': categories.find(c => c.name === 'Storage')._id,
    'Power Supplies': categories.find(c => c.name === 'Power Supplies')._id,
    'CPU Coolers': categories.find(c => c.name === 'CPU Coolers')._id,
    'Cases': categories.find(c => c.name === 'Cases')._id,
    'Monitors': categories.find(c => c.name === 'Monitors')._id,
    'Peripherals': categories.find(c => c.name === 'Peripherals')._id
  };

  const products = [
    // Processors
    {
      name: 'Intel Core i9-14900K',
      description: '24-core (8P+16E) processor, 32 threads, up to 6.0 GHz',
      category: categoryMap['Processors'],
      brand: 'Intel',
      stock: 25,
      images: ['https://example.com/i9-14900k.jpg'],
      specifications: {
        'Cores': '24 (8P+16E)',
        'Threads': '32',
        'Base Clock': '3.2 GHz',
        'Boost Clock': '6.0 GHz',
        'Cache': '36 MB',
        'TDP': '125W'
      },
      pcComponentType: 'cpu',
      socket: 'LGA1700',
      tdp: 125,
      price: 589.99,
      featured: true,
      bestSeller: true
    },
    {
      name: 'Intel Core i7-14700K',
      description: '20-core (8P+12E) processor, 28 threads, up to 5.6 GHz',
      category: categoryMap['Processors'],
      brand: 'Intel',
      stock: 30,
      images: ['https://example.com/i7-14700k.jpg'],
      specifications: {
        'Cores': '20 (8P+12E)',
        'Threads': '28',
        'Base Clock': '3.4 GHz',
        'Boost Clock': '5.6 GHz',
        'Cache': '33 MB',
        'TDP': '125W'
      },
      pcComponentType: 'cpu',
      socket: 'LGA1700',
      tdp: 125,
      price: 409.99,
      featured: true
    },
    {
      name: 'Intel Core i5-14600K',
      description: '14-core (6P+8E) processor, 20 threads, up to 5.3 GHz',
      category: categoryMap['Processors'],
      brand: 'Intel',
      stock: 45,
      images: ['https://example.com/i5-14600k.jpg'],
      specifications: {
        'Cores': '14 (6P+8E)',
        'Threads': '20',
        'Base Clock': '3.5 GHz',
        'Boost Clock': '5.3 GHz',
        'Cache': '24 MB',
        'TDP': '125W'
      },
      pcComponentType: 'cpu',
      socket: 'LGA1700',
      tdp: 125,
      price: 319.99,
      bestSeller: true
    },
    {
      name: 'AMD Ryzen 9 7950X',
      description: '16-core processor, 32 threads, up to 5.7 GHz',
      category: categoryMap['Processors'],
      brand: 'AMD',
      stock: 20,
      images: ['https://example.com/ryzen9-7950x.jpg'],
      specifications: {
        'Cores': '16',
        'Threads': '32',
        'Base Clock': '4.5 GHz',
        'Boost Clock': '5.7 GHz',
        'Cache': '80 MB',
        'TDP': '170W'
      },
      pcComponentType: 'cpu',
      socket: 'AM5',
      tdp: 170,
      price: 549.99,
      featured: true,
      newArrival: true
    },
    {
      name: 'AMD Ryzen 7 7800X3D',
      description: '8-core processor, 16 threads, up to 5.0 GHz, 96MB 3D V-Cache',
      category: categoryMap['Processors'],
      brand: 'AMD',
      stock: 35,
      images: ['https://example.com/ryzen7-7800x3d.jpg'],
      specifications: {
        'Cores': '8',
        'Threads': '16',
        'Base Clock': '4.2 GHz',
        'Boost Clock': '5.0 GHz',
        'Cache': '96 MB',
        'TDP': '120W'
      },
      pcComponentType: 'cpu',
      socket: 'AM5',
      tdp: 120,
      price: 449.99,
      bestSeller: true
    },
    {
      name: 'AMD Ryzen 5 7600X',
      description: '6-core processor, 12 threads, up to 5.3 GHz',
      category: categoryMap['Processors'],
      brand: 'AMD',
      stock: 50,
      images: ['https://example.com/ryzen5-7600x.jpg'],
      specifications: {
        'Cores': '6',
        'Threads': '12',
        'Base Clock': '4.7 GHz',
        'Boost Clock': '5.3 GHz',
        'Cache': '38 MB',
        'TDP': '105W'
      },
      pcComponentType: 'cpu',
      socket: 'AM5',
      tdp: 105,
      price: 249.99
    },
    // Motherboards
    {
      name: 'ASUS ROG Maximus Z790 Hero',
      description: 'Intel Z790 ATX motherboard, DDR5, WiFi 6E',
      category: categoryMap['Motherboards'],
      brand: 'ASUS',
      stock: 15,
      images: ['https://example.com/maximus-z790.jpg'],
      specifications: {
        'Chipset': 'Z790',
        'Form Factor': 'ATX',
        'Memory': 'DDR5-7200',
        'Memory Slots': '4',
        'Max Memory': '192 GB',
        'PCIe': 'PCIe 5.0',
        'M.2 Slots': '5'
      },
      pcComponentType: 'motherboard',
      socket: 'LGA1700',
      ramType: 'DDR5',
      ramSlots: 4,
      maxRam: 192,
      formFactor: 'ATX',
      price: 599.99,
      featured: true
    },
    {
      name: 'MSI MPG Z790 Carbon WiFi',
      description: 'Intel Z790 ATX motherboard, DDR5, WiFi 6E',
      category: categoryMap['Motherboards'],
      brand: 'MSI',
      stock: 20,
      images: ['https://example.com/mpg-z790.jpg'],
      specifications: {
        'Chipset': 'Z790',
        'Form Factor': 'ATX',
        'Memory': 'DDR5-6800',
        'Memory Slots': '4',
        'Max Memory': '128 GB',
        'PCIe': 'PCIe 5.0',
        'M.2 Slots': '4'
      },
      pcComponentType: 'motherboard',
      socket: 'LGA1700',
      ramType: 'DDR5',
      ramSlots: 4,
      maxRam: 128,
      formFactor: 'ATX',
      price: 449.99,
      bestSeller: true
    },
    {
      name: 'Gigabyte B760 AORUS Elite AX',
      description: 'Intel B760 ATX motherboard, DDR5, WiFi 6',
      category: categoryMap['Motherboards'],
      brand: 'Gigabyte',
      stock: 30,
      images: ['https://example.com/b760-aorus.jpg'],
      specifications: {
        'Chipset': 'B760',
        'Form Factor': 'ATX',
        'Memory': 'DDR5-6600',
        'Memory Slots': '4',
        'Max Memory': '128 GB',
        'PCIe': 'PCIe 4.0',
        'M.2 Slots': '3'
      },
      pcComponentType: 'motherboard',
      socket: 'LGA1700',
      ramType: 'DDR5',
      ramSlots: 4,
      maxRam: 128,
      formFactor: 'ATX',
      price: 229.99
    },
    {
      name: 'ASUS ROG Crosshair X670E Hero',
      description: 'AMD X670E ATX motherboard, DDR5, WiFi 6E',
      category: categoryMap['Motherboards'],
      brand: 'ASUS',
      stock: 12,
      images: ['https://example.com/crosshair-x670e.jpg'],
      specifications: {
        'Chipset': 'X670E',
        'Form Factor': 'ATX',
        'Memory': 'DDR5-6400',
        'Memory Slots': '4',
        'Max Memory': '128 GB',
        'PCIe': 'PCIe 5.0',
        'M.2 Slots': '4'
      },
      pcComponentType: 'motherboard',
      socket: 'AM5',
      ramType: 'DDR5',
      ramSlots: 4,
      maxRam: 128,
      formFactor: 'ATX',
      price: 699.99,
      featured: true,
      newArrival: true
    },
    {
      name: 'MSI B650 Tomahawk WiFi',
      description: 'AMD B650 ATX motherboard, DDR5, WiFi 6',
      category: categoryMap['Motherboards'],
      brand: 'MSI',
      stock: 25,
      images: ['https://example.com/b650-tomahawk.jpg'],
      specifications: {
        'Chipset': 'B650',
        'Form Factor': 'ATX',
        'Memory': 'DDR5-6400',
        'Memory Slots': '4',
        'Max Memory': '128 GB',
        'PCIe': 'PCIe 4.0',
        'M.2 Slots': '3'
      },
      pcComponentType: 'motherboard',
      socket: 'AM5',
      ramType: 'DDR5',
      ramSlots: 4,
      maxRam: 128,
      formFactor: 'ATX',
      price: 219.99,
      bestSeller: true
    },
    // Graphics Cards
    {
      name: 'NVIDIA GeForce RTX 4090',
      description: '24GB GDDR6X, 16384 CUDA cores, DLSS 3',
      category: categoryMap['Graphics Cards'],
      brand: 'NVIDIA',
      stock: 10,
      images: ['https://example.com/rtx4090.jpg'],
      specifications: {
        'VRAM': '24 GB GDDR6X',
        'CUDA Cores': '16384',
        'Base Clock': '2235 MHz',
        'Boost Clock': '2520 MHz',
        'Memory Speed': '21 Gbps',
        'TDP': '450W'
      },
      pcComponentType: 'gpu',
      tdp: 450,
      price: 1599.99,
      featured: true,
      bestSeller: true
    },
    {
      name: 'NVIDIA GeForce RTX 4080 Super',
      description: '16GB GDDR6X, 10240 CUDA cores, DLSS 3',
      category: categoryMap['Graphics Cards'],
      brand: 'NVIDIA',
      stock: 18,
      images: ['https://example.com/rtx4080s.jpg'],
      specifications: {
        'VRAM': '16 GB GDDR6X',
        'CUDA Cores': '10240',
        'Base Clock': '2290 MHz',
        'Boost Clock': '2550 MHz',
        'Memory Speed': '23 Gbps',
        'TDP': '320W'
      },
      pcComponentType: 'gpu',
      tdp: 320,
      price: 999.99,
      featured: true
    },
    {
      name: 'NVIDIA GeForce RTX 4070 Ti Super',
      description: '16GB GDDR6X, 8448 CUDA cores, DLSS 3',
      category: categoryMap['Graphics Cards'],
      brand: 'NVIDIA',
      stock: 25,
      images: ['https://example.com/rtx4070tis.jpg'],
      specifications: {
        'VRAM': '16 GB GDDR6X',
        'CUDA Cores': '8448',
        'Base Clock': '2340 MHz',
        'Boost Clock': '2610 MHz',
        'Memory Speed': '21 Gbps',
        'TDP': '285W'
      },
      pcComponentType: 'gpu',
      tdp: 285,
      price: 799.99,
      newArrival: true
    },
    {
      name: 'NVIDIA GeForce RTX 4070',
      description: '12GB GDDR6X, 5888 CUDA cores, DLSS 3',
      category: categoryMap['Graphics Cards'],
      brand: 'NVIDIA',
      stock: 35,
      images: ['https://example.com/rtx4070.jpg'],
      specifications: {
        'VRAM': '12 GB GDDR6X',
        'CUDA Cores': '5888',
        'Base Clock': '1920 MHz',
        'Boost Clock': '2475 MHz',
        'Memory Speed': '21 Gbps',
        'TDP': '200W'
      },
      pcComponentType: 'gpu',
      tdp: 200,
      price: 599.99,
      bestSeller: true
    },
    {
      name: 'AMD Radeon RX 7900 XTX',
      description: '24GB GDDR6, 6144 stream processors, FSR 3',
      category: categoryMap['Graphics Cards'],
      brand: 'AMD',
      stock: 15,
      images: ['https://example.com/rx7900xtx.jpg'],
      specifications: {
        'VRAM': '24 GB GDDR6',
        'Stream Processors': '6144',
        'Base Clock': '1900 MHz',
        'Boost Clock': '2500 MHz',
        'Memory Speed': '20 Gbps',
        'TDP': '355W'
      },
      pcComponentType: 'gpu',
      tdp: 355,
      price: 999.99,
      featured: true
    },
    {
      name: 'AMD Radeon RX 7800 XT',
      description: '16GB GDDR6, 3840 stream processors, FSR 3',
      category: categoryMap['Graphics Cards'],
      brand: 'AMD',
      stock: 30,
      images: ['https://example.com/rx7800xt.jpg'],
      specifications: {
        'VRAM': '16 GB GDDR6',
        'Stream Processors': '3840',
        'Base Clock': '1295 MHz',
        'Boost Clock': '2430 MHz',
        'Memory Speed': '19.5 Gbps',
        'TDP': '263W'
      },
      pcComponentType: 'gpu',
      tdp: 263,
      price: 499.99
    },
    // Memory
    {
      name: 'Corsair Vengeance DDR5 32GB (2x16GB)',
      description: 'DDR5-6000 CL30, low profile heatspreader',
      category: categoryMap['Memory'],
      brand: 'Corsair',
      stock: 50,
      images: ['https://example.com/corsair-ddr5.jpg'],
      specifications: {
        'Capacity': '32 GB (2x16GB)',
        'Type': 'DDR5',
        'Speed': '6000 MHz',
        'Latency': 'CL30',
        'Voltage': '1.35V'
      },
      pcComponentType: 'ram',
      ramType: 'DDR5',
      tdp: 5,
      price: 129.99,
      bestSeller: true
    },
    {
      name: 'G.Skill Trident Z5 RGB DDR5 32GB (2x16GB)',
      description: 'DDR5-6400 CL32, RGB lighting',
      category: categoryMap['Memory'],
      brand: 'G.Skill',
      stock: 40,
      images: ['https://example.com/trident-z5.jpg'],
      specifications: {
        'Capacity': '32 GB (2x16GB)',
        'Type': 'DDR5',
        'Speed': '6400 MHz',
        'Latency': 'CL32',
        'Voltage': '1.35V'
      },
      pcComponentType: 'ram',
      ramType: 'DDR5',
      tdp: 5,
      price: 149.99,
      featured: true
    },
    {
      name: 'Kingston Fury Beast DDR5 64GB (2x32GB)',
      description: 'DDR5-5600 CL36, high capacity kit',
      category: categoryMap['Memory'],
      brand: 'Kingston',
      stock: 25,
      images: ['https://example.com/fury-beast.jpg'],
      specifications: {
        'Capacity': '64 GB (2x32GB)',
        'Type': 'DDR5',
        'Speed': '5600 MHz',
        'Latency': 'CL36',
        'Voltage': '1.25V'
      },
      pcComponentType: 'ram',
      ramType: 'DDR5',
      tdp: 8,
      price: 219.99
    },
    {
      name: 'Corsair Vengeance DDR4 32GB (2x16GB)',
      description: 'DDR4-3600 CL18, compatible with older systems',
      category: categoryMap['Memory'],
      brand: 'Corsair',
      stock: 60,
      images: ['https://example.com/corsair-ddr4.jpg'],
      specifications: {
        'Capacity': '32 GB (2x16GB)',
        'Type': 'DDR4',
        'Speed': '3600 MHz',
        'Latency': 'CL18',
        'Voltage': '1.35V'
      },
      pcComponentType: 'ram',
      ramType: 'DDR4',
      tdp: 5,
      price: 89.99
    },
    // Storage
    {
      name: 'Samsung 990 Pro 2TB NVMe SSD',
      description: 'PCIe 4.0, 7450 MB/s read, 6900 MB/s write',
      category: categoryMap['Storage'],
      brand: 'Samsung',
      stock: 40,
      images: ['https://example.com/990pro.jpg'],
      specifications: {
        'Capacity': '2 TB',
        'Interface': 'PCIe 4.0 NVMe',
        'Read Speed': '7450 MB/s',
        'Write Speed': '6900 MB/s',
        'Form Factor': 'M.2 2280'
      },
      pcComponentType: 'ssd',
      tdp: 5,
      price: 179.99,
      featured: true,
      bestSeller: true
    },
    {
      name: 'WD Black SN850X 1TB NVMe SSD',
      description: 'PCIe 4.0, 7300 MB/s read, 6300 MB/s write',
      category: categoryMap['Storage'],
      brand: 'Western Digital',
      stock: 55,
      images: ['https://example.com/sn850x.jpg'],
      specifications: {
        'Capacity': '1 TB',
        'Interface': 'PCIe 4.0 NVMe',
        'Read Speed': '7300 MB/s',
        'Write Speed': '6300 MB/s',
        'Form Factor': 'M.2 2280'
      },
      pcComponentType: 'ssd',
      tdp: 5,
      price: 119.99,
      bestSeller: true
    },
    {
      name: 'Crucial T700 4TB NVMe SSD',
      description: 'PCIe 5.0, 12400 MB/s read, 12600 MB/s write',
      category: categoryMap['Storage'],
      brand: 'Crucial',
      stock: 20,
      images: ['https://example.com/t700.jpg'],
      specifications: {
        'Capacity': '4 TB',
        'Interface': 'PCIe 5.0 NVMe',
        'Read Speed': '12400 MB/s',
        'Write Speed': '12600 MB/s',
        'Form Factor': 'M.2 2280'
      },
      pcComponentType: 'ssd',
      tdp: 8,
      price: 499.99,
      newArrival: true
    },
    {
      name: 'Seagate Barracuda 4TB HDD',
      description: '7200 RPM, 256MB cache, SATA 6Gb/s',
      category: categoryMap['Storage'],
      brand: 'Seagate',
      stock: 45,
      images: ['https://example.com/barracuda.jpg'],
      specifications: {
        'Capacity': '4 TB',
        'Interface': 'SATA 6Gb/s',
        'RPM': '7200',
        'Cache': '256 MB',
        'Form Factor': '3.5 inch'
      },
      pcComponentType: 'hdd',
      tdp: 10,
      price: 89.99
    },
    {
      name: 'WD Blue 2TB HDD',
      description: '5400 RPM, 256MB cache, SATA 6Gb/s',
      category: categoryMap['Storage'],
      brand: 'Western Digital',
      stock: 50,
      images: ['https://example.com/wdblue.jpg'],
      specifications: {
        'Capacity': '2 TB',
        'Interface': 'SATA 6Gb/s',
        'RPM': '5400',
        'Cache': '256 MB',
        'Form Factor': '3.5 inch'
      },
      pcComponentType: 'hdd',
      tdp: 8,
      price: 59.99
    },
    // Power Supplies
    {
      name: 'Corsair RM1000x 1000W PSU',
      description: '80+ Gold, fully modular, ATX 3.0',
      category: categoryMap['Power Supplies'],
      brand: 'Corsair',
      stock: 30,
      images: ['https://example.com/rm1000x.jpg'],
      specifications: {
        'Wattage': '1000W',
        'Efficiency': '80+ Gold',
        'Modular': 'Fully Modular',
        'ATX Version': 'ATX 3.0',
        'PCIe 5.0': 'Native Support'
      },
      pcComponentType: 'psu',
      wattage: 1000,
      tdp: 0,
      price: 189.99,
      featured: true,
      bestSeller: true
    },
    {
      name: 'EVGA SuperNOVA 850 G6',
      description: '80+ Gold, fully modular, ATX 3.0',
      category: categoryMap['Power Supplies'],
      brand: 'EVGA',
      stock: 35,
      images: ['https://example.com/supernova850.jpg'],
      specifications: {
        'Wattage': '850W',
        'Efficiency': '80+ Gold',
        'Modular': 'Fully Modular',
        'ATX Version': 'ATX 3.0',
        'PCIe 5.0': 'Native Support'
      },
      pcComponentType: 'psu',
      wattage: 850,
      tdp: 0,
      price: 149.99
    },
    {
      name: 'Seasonic Focus GX-750',
      description: '80+ Gold, fully modular, 10-year warranty',
      category: categoryMap['Power Supplies'],
      brand: 'Seasonic',
      stock: 40,
      images: ['https://example.com/focus-gx750.jpg'],
      specifications: {
        'Wattage': '750W',
        'Efficiency': '80+ Gold',
        'Modular': 'Fully Modular',
        'ATX Version': 'ATX 2.52',
        'Warranty': '10 Years'
      },
      pcComponentType: 'psu',
      wattage: 750,
      tdp: 0,
      price: 129.99
    },
    {
      name: 'Corsair RM750e 750W PSU',
      description: '80+ Gold, fully modular, ATX 3.0',
      category: categoryMap['Power Supplies'],
      brand: 'Corsair',
      stock: 45,
      images: ['https://example.com/rm750e.jpg'],
      specifications: {
        'Wattage': '750W',
        'Efficiency': '80+ Gold',
        'Modular': 'Fully Modular',
        'ATX Version': 'ATX 3.0',
        'PCIe 5.0': 'Native Support'
      },
      pcComponentType: 'psu',
      wattage: 750,
      tdp: 0,
      price: 119.99
    },
    // CPU Coolers
    {
      name: 'Noctua NH-D15',
      description: 'Dual tower air cooler, 140mm fans, quiet operation',
      category: categoryMap['CPU Coolers'],
      brand: 'Noctua',
      stock: 35,
      images: ['https://example.com/nh-d15.jpg'],
      specifications: {
        'Type': 'Air Cooler',
        'Fans': '2x 140mm',
        'TDP': '250W',
        'Height': '165mm',
        'Noise': '24.6 dBA'
      },
      pcComponentType: 'cpu-cooler',
      tdp: 5,
      price: 99.99,
      featured: true,
      bestSeller: true
    },
    {
      name: 'Corsair iCUE H150i Elite',
      description: '360mm AIO liquid cooler, RGB fans',
      category: categoryMap['CPU Coolers'],
      brand: 'Corsair',
      stock: 25,
      images: ['https://example.com/h150i.jpg'],
      specifications: {
        'Type': 'Liquid AIO',
        'Radiator': '360mm',
        'Fans': '3x 120mm',
        'TDP': '350W',
        'RGB': 'Yes'
      },
      pcComponentType: 'cpu-cooler',
      tdp: 15,
      price: 199.99,
      featured: true
    },
    {
      name: 'NZXT Kraken X63',
      description: '280mm AIO liquid cooler, LCD display',
      category: categoryMap['CPU Coolers'],
      brand: 'NZXT',
      stock: 20,
      images: ['https://example.com/kraken-x63.jpg'],
      specifications: {
        'Type': 'Liquid AIO',
        'Radiator': '280mm',
        'Fans': '2x 140mm',
        'TDP': '300W',
        'Display': 'LCD'
      },
      pcComponentType: 'cpu-cooler',
      tdp: 15,
      price: 249.99,
      newArrival: true
    },
    {
      name: 'be quiet! Dark Rock Pro 5',
      description: 'Dual tower air cooler, silent operation',
      category: categoryMap['CPU Coolers'],
      brand: 'be quiet!',
      stock: 30,
      images: ['https://example.com/dark-rock-pro5.jpg'],
      specifications: {
        'Type': 'Air Cooler',
        'Fans': '2x 135mm',
        'TDP': '270W',
        'Height': '163mm',
        'Noise': '24.3 dBA'
      },
      pcComponentType: 'cpu-cooler',
      tdp: 5,
      price: 89.99
    },
    // Cases
    {
      name: 'Lian Li O11 Dynamic EVO',
      description: 'Dual chamber mid-tower, tempered glass, RGB ready',
      category: categoryMap['Cases'],
      brand: 'Lian Li',
      stock: 25,
      images: ['https://example.com/o11-evo.jpg'],
      specifications: {
        'Form Factor': 'Mid Tower',
        'Motherboard': 'ATX, mATX, ITX',
        'GPU Length': '420mm',
        'CPU Cooler Height': '167mm',
        'Fans': 'Up to 9x 120mm'
      },
      pcComponentType: 'case',
      formFactor: 'ATX',
      tdp: 0,
      price: 169.99,
      featured: true,
      bestSeller: true
    },
    {
      name: 'NZXT H7 Flow',
      description: 'High airflow mid-tower, mesh front panel',
      category: categoryMap['Cases'],
      brand: 'NZXT',
      stock: 30,
      images: ['https://example.com/h7-flow.jpg'],
      specifications: {
        'Form Factor': 'Mid Tower',
        'Motherboard': 'ATX, mATX, ITX',
        'GPU Length': '400mm',
        'CPU Cooler Height': '185mm',
        'Fans': 'Up to 7x 120mm'
      },
      pcComponentType: 'case',
      formFactor: 'ATX',
      tdp: 0,
      price: 129.99,
      bestSeller: true
    },
    {
      name: 'Corsair 4000D Airflow',
      description: 'High airflow mid-tower, minimalist design',
      category: categoryMap['Cases'],
      brand: 'Corsair',
      stock: 40,
      images: ['https://example.com/4000d.jpg'],
      specifications: {
        'Form Factor': 'Mid Tower',
        'Motherboard': 'ATX, mATX, ITX',
        'GPU Length': '360mm',
        'CPU Cooler Height': '170mm',
        'Fans': 'Up to 6x 120mm'
      },
      pcComponentType: 'case',
      formFactor: 'ATX',
      tdp: 0,
      price: 94.99
    },
    {
      name: 'Fractal Design Torrent',
      description: 'Open front mid-tower, extreme airflow',
      category: categoryMap['Cases'],
      brand: 'Fractal Design',
      stock: 20,
      images: ['https://example.com/torrent.jpg'],
      specifications: {
        'Form Factor': 'Mid Tower',
        'Motherboard': 'ATX, mATX, ITX',
        'GPU Length': '461mm',
        'CPU Cooler Height': '188mm',
        'Fans': 'Up to 9x 120mm'
      },
      pcComponentType: 'case',
      formFactor: 'ATX',
      tdp: 0,
      price: 189.99,
      newArrival: true
    },
    // Monitors
    {
      name: 'ASUS ROG Swift PG27AQN',
      description: '27" 360Hz 1440p IPS, 1ms, G-Sync',
      category: categoryMap['Monitors'],
      brand: 'ASUS',
      stock: 15,
      images: ['https://example.com/pg27aqn.jpg'],
      specifications: {
        'Size': '27 inch',
        'Resolution': '2560x1440',
        'Refresh Rate': '360Hz',
        'Response Time': '1ms',
        'Panel': 'IPS',
        'Sync': 'G-Sync'
      },
      pcComponentType: 'other',
      price: 799.99,
      featured: true
    },
    {
      name: 'LG UltraGear 27GP850',
      description: '27" 165Hz 1440p IPS, 1ms, G-Sync Compatible',
      category: categoryMap['Monitors'],
      brand: 'LG',
      stock: 25,
      images: ['https://example.com/27gp850.jpg'],
      specifications: {
        'Size': '27 inch',
        'Resolution': '2560x1440',
        'Refresh Rate': '165Hz',
        'Response Time': '1ms',
        'Panel': 'IPS',
        'Sync': 'G-Sync Compatible'
      },
      pcComponentType: 'other',
      price: 399.99,
      bestSeller: true
    },
    {
      name: 'Samsung Odyssey G7',
      description: '32" 240Hz 1440p VA, 1ms, 1000R curved',
      category: categoryMap['Monitors'],
      brand: 'Samsung',
      stock: 20,
      images: ['https://example.com/odyssey-g7.jpg'],
      specifications: {
        'Size': '32 inch',
        'Resolution': '2560x1440',
        'Refresh Rate': '240Hz',
        'Response Time': '1ms',
        'Panel': 'VA',
        'Curvature': '1000R'
      },
      pcComponentType: 'other',
      price: 549.99,
      featured: true
    },
    // Peripherals
    {
      name: 'Logitech G Pro X Superlight',
      description: 'Ultra-light wireless gaming mouse, 25,600 DPI',
      category: categoryMap['Peripherals'],
      brand: 'Logitech',
      stock: 40,
      images: ['https://example.com/gprox.jpg'],
      specifications: {
        'Type': 'Wireless Mouse',
        'DPI': '25,600',
        'Weight': '63g',
        'Buttons': '5',
        'Battery': '70 hours'
      },
      pcComponentType: 'other',
      price: 159.99,
      bestSeller: true
    },
    {
      name: 'Razer DeathAdder V3 Pro',
      description: 'Wireless gaming mouse, 30,000 DPI, optical switches',
      category: categoryMap['Peripherals'],
      brand: 'Razer',
      stock: 35,
      images: ['https://example.com/deathadder-v3.jpg'],
      specifications: {
        'Type': 'Wireless Mouse',
        'DPI': '30,000',
        'Weight': '64g',
        'Buttons': '8',
        'Battery': '90 hours'
      },
      pcComponentType: 'other',
      price: 159.99,
      newArrival: true
    },
    {
      name: 'Keychron Q1 Pro',
      description: 'Wireless mechanical keyboard, QMK/VIA support',
      category: categoryMap['Peripherals'],
      brand: 'Keychron',
      stock: 30,
      images: ['https://example.com/q1pro.jpg'],
      specifications: {
        'Type': 'Wireless Mechanical',
        'Layout': '75%',
        'Switch': 'Hot-swappable',
        'Connection': 'Bluetooth 5.2 + 2.4GHz'
      },
      pcComponentType: 'other',
      price: 199.99,
      featured: true
    },
    {
      name: 'SteelSeries Apex Pro TKL',
      description: 'Mechanical keyboard, OmniPoint adjustable switches',
      category: categoryMap['Peripherals'],
      brand: 'SteelSeries',
      stock: 25,
      images: ['https://example.com/apex-pro.jpg'],
      specifications: {
        'Type': 'Mechanical',
        'Layout': 'TKL',
        'Switch': 'OmniPoint',
        'Actuation': 'Adjustable 0.4-3.6mm'
      },
      pcComponentType: 'other',
      price: 179.99
    }
  ];

  await Product.insertMany(products);
  console.log('Products seeded');
  return products;
};

const seedCoupons = async () => {
  await Coupon.deleteMany();

  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const coupons = await Coupon.create([
    {
      code: 'WELCOME10',
      description: 'Welcome discount for new customers',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 100,
      maxDiscount: 50,
      userLimit: 1,
      startDate: now,
      endDate: nextMonth,
      isActive: true
    },
    {
      code: 'SAVE20',
      description: 'Save 20% on orders over $200',
      discountType: 'percentage',
      discountValue: 20,
      minPurchase: 200,
      maxDiscount: 100,
      userLimit: 3,
      startDate: now,
      endDate: nextMonth,
      isActive: true
    },
    {
      code: 'FLAT50',
      description: 'Flat $50 off on orders over $500',
      discountType: 'fixed',
      discountValue: 50,
      minPurchase: 500,
      userLimit: 2,
      startDate: now,
      endDate: nextMonth,
      isActive: true
    },
    {
      code: 'PCBUILD100',
      description: '$100 off complete PC builds',
      discountType: 'fixed',
      discountValue: 100,
      minPurchase: 1000,
      userLimit: 1,
      startDate: now,
      endDate: nextMonth,
      isActive: true
    }
  ]);

  console.log('Coupons seeded');
  return coupons;
};

const seed = async () => {
  try {
    await connectDB();
    
    console.log('Seeding data...');
    await seedUsers();
    const categories = await seedCategories();
    await seedProducts(categories);
    await seedCoupons();
    
    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seed();
