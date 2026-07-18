import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const OrdersPage = () => {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders')
  })

  const orders = ordersData?.data?.orders || []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">My Orders</h1>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card skeleton h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold dark:text-white">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">{order.items.length} items</span>
                <span className="font-bold text-primary-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
