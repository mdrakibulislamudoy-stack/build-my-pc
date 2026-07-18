import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart } from 'lucide-react'

const ProductsPage = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', search, category, sortBy],
    queryFn: () => api.get('/products', {
      params: { search, category, sort: sortBy }
    })
  })

  const products = productsData?.data?.products || []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Products</h1>
      
      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            <option value="">All Categories</option>
            <option value="cpu">Processors</option>
            <option value="gpu">Graphics Cards</option>
            <option value="motherboard">Motherboards</option>
            <option value="ram">Memory</option>
            <option value="ssd">Storage</option>
            <option value="psu">Power Supplies</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-48 mb-4" />
              <div className="skeleton h-4 mb-2" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Link key={product._id} to={`/products/${product._id}`} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 mb-4 flex items-center justify-center">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-gray-400">No Image</div>
                )}
              </div>
              <h3 className="font-semibold mb-2 dark:text-white line-clamp-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  {product.isOnSale && product.salePrice ? (
                    <>
                      <span className="text-lg font-bold text-primary-600">${product.salePrice}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${product.price}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-primary-600">${product.price}</span>
                  )}
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage
