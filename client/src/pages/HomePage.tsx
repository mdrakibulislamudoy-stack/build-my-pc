import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cpu, Monitor, ShoppingCart, Zap, Shield, Truck } from 'lucide-react'

const MotionH1 = motion.h1 as any
const MotionP = motion.p as any
const MotionDiv = motion.div as any

const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <MotionH1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            Build Your Dream PC
          </MotionH1>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 opacity-90"
          >
            Premium components, expert guidance, and competitive prices
          </MotionP>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            <Link to="/products" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Browse Products
            </Link>
            <Link to="/pc-builder" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Start Building
            </Link>
          </MotionDiv>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Cpu, title: 'Expert Compatibility', description: 'Our PC Builder ensures all components work together perfectly' },
            { icon: Shield, title: 'Quality Guaranteed', description: 'Only authentic products from trusted brands' },
            { icon: Truck, title: 'Fast Shipping', description: 'Quick delivery with careful packaging' },
            { icon: Zap, title: 'Best Prices', description: 'Competitive pricing on all components' },
            { icon: ShoppingCart, title: 'Easy Checkout', description: 'Secure payment options and smooth checkout process' },
            { icon: Monitor, title: 'Expert Support', description: 'Technical support from PC building experts' },
          ].map((feature, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </MotionDiv>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Processors', icon: Cpu, link: '/products?componentType=cpu' },
            { name: 'Graphics Cards', icon: Monitor, link: '/products?componentType=gpu' },
            { name: 'Motherboards', icon: Cpu, link: '/products?componentType=motherboard' },
            { name: 'Memory', icon: Zap, link: '/products?componentType=ram' },
            { name: 'Storage', icon: Shield, link: '/products?componentType=ssd' },
            { name: 'Power Supplies', icon: Zap, link: '/products?componentType=psu' },
            { name: 'CPU Coolers', icon: Cpu, link: '/products?componentType=cpu-cooler' },
            { name: 'Cases', icon: Monitor, link: '/products?componentType=case' },
          ].map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="card hover:shadow-lg transition-shadow group"
            >
              <category.icon className="w-12 h-12 mb-4 text-primary-600 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold dark:text-white">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16 rounded-2xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Build Your PC?</h2>
        <p className="text-xl mb-8 opacity-90">Use our PC Builder to create your perfect custom build</p>
        <Link to="/pc-builder" className="btn bg-white text-primary-600 hover:bg-gray-100">
          Start Building Now
        </Link>
      </section>
    </div>
  )
}

export default HomePage
