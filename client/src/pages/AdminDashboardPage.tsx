import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import { Users, ShoppingCart, Package, DollarSign } from 'lucide-react'

const AdminDashboardPage = () => {
  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/dashboard')
  })

  const stats = statsData?.data?.stats || {}

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold dark:text-white">${stats.totalRevenue?.toFixed(2) || '0'}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold dark:text-white">{stats.totalOrders || 0}</p>
            </div>
            <ShoppingCart className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold dark:text-white">{stats.totalUsers || 0}</p>
            </div>
            <Users className="w-10 h-10 text-purple-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold dark:text-white">{stats.totalProducts || 0}</p>
            </div>
            <Package className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-outline">Add Product</button>
          <button className="btn btn-outline">Manage Users</button>
          <button className="btn btn-outline">View Orders</button>
          <button className="btn btn-outline">Manage Coupons</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Orders</h2>
          <p className="text-gray-600 dark:text-gray-400">Recent orders will appear here</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Top Products</h2>
          <p className="text-gray-600 dark:text-gray-400">Top performing products will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
