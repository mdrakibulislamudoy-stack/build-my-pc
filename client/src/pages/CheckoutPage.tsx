import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    paymentMethod: 'cod',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.post('/orders', {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
      })
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Checkout</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold dark:text-white">Shipping Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <h2 className="text-xl font-semibold dark:text-white">Payment Method</h2>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600"
              />
              <span className="dark:text-white">Cash on Delivery</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={formData.paymentMethod === 'stripe'}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600"
              />
              <span className="dark:text-white">Credit/Debit Card (Stripe)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
