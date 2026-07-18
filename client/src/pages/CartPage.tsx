import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import { Trash2, Plus, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'

const CartPage = () => {
  const { token } = useAuth()

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart'),
    enabled: !!token
  })

  const cart = cartData?.data?.cart

  if (!token) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Please login to view your cart</h2>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return <div className="skeleton h-96" />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <div key={item._id} className="card flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                {item.product?.images?.[0] ? (
                  <img src={item.product.images[0]} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-gray-400 text-xs">No Image</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold dark:text-white">{item.product?.name}</h3>
                <p className="text-primary-600 font-bold">${item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center dark:text-white">{item.quantity}</span>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="card h-fit">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium dark:text-white">${cart.subtotal.toFixed(2)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${cart.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-3 dark:text-white">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn btn-primary w-full">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage
