import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'

const WishlistPage = () => {
  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/users/wishlist')
  })

  const wishlist = wishlistData?.data?.wishlist || []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">My Wishlist</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card skeleton h-64" />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="card text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your wishlist is empty</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product: any) => (
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
                <span className="text-lg font-bold text-primary-600">${product.price}</span>
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

export default WishlistPage
