import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, User, Menu, Moon, Sun } from 'lucide-react'
import { useUI } from '../../hooks/useUI'
import { useAuth } from '../../hooks/useAuth'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode, toggleDarkMode, isMobileMenuOpen, toggleMobileMenu } = useUI()
  const { user } = useAuth()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PC</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Build My PC</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Products
              </Link>
              <Link to="/pc-builder" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                PC Builder
              </Link>
              <Link to="/saved-builds" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Saved Builds
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link to="/cart" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
              </Link>

              {user ? (
                <Link to="/profile" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary text-sm"
                >
                  Login
                </Link>
              )}

              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Products
              </Link>
              <Link to="/pc-builder" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                PC Builder
              </Link>
              <Link to="/saved-builds" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Saved Builds
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Build My PC</h3>
              <p className="text-gray-400">Your one-stop shop for all PC components and custom PC building needs.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products" className="hover:text-white">Products</Link></li>
                <li><Link to="/pc-builder" className="hover:text-white">PC Builder</Link></li>
                <li><Link to="/saved-builds" className="hover:text-white">Saved Builds</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/profile" className="hover:text-white">My Account</Link></li>
                <li><Link to="/orders" className="hover:text-white">Order Tracking</Link></li>
                <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe for exclusive deals and updates.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary-500"
                />
                <button className="btn btn-primary rounded-l-none">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Build My PC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
