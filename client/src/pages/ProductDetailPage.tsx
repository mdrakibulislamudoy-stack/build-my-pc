import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import { ShoppingCart, Heart, Star } from 'lucide-react'

const ProductDetailPage = () => {
  const { id } = useParams()

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`)
  })

  const product = productData?.data?.product

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton h-96" />
          <div className="space-y-4">
            <div className="skeleton h-8" />
            <div className="skeleton h-4" />
            <div className="skeleton h-4" />
            <div className="skeleton h-12" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="card">
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-gray-400">No Image</div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4 dark:text-white">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              ({product.numReviews} reviews)
            </span>
          </div>

          <div className="mb-6">
            {product.isOnSale && product.salePrice ? (
              <>
                <span className="text-3xl font-bold text-primary-600">${product.salePrice}</span>
                <span className="text-xl text-gray-500 line-through ml-2">${product.price}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary-600">${product.price}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 dark:text-white">Specifications</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600 last:border-0">
                    <span className="text-gray-600 dark:text-gray-400">{key}</span>
                    <span className="font-medium dark:text-white">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button className="btn btn-primary flex-1 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button className="btn btn-outline">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
