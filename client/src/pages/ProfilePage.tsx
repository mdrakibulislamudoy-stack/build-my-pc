import { useDispatch } from 'react-redux'
import { logoutUser } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { User, LogOut, MapPin, Phone } from 'lucide-react'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">My Profile</h1>
      
      <div className="card mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">{user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <MapPin className="w-5 h-5" />
            <span>
              {user?.address ? `${user.address.street}, ${user.address.city}, ${user.address.country}` : 'No address set'}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <Phone className="w-5 h-5" />
            <span>{user?.phone || 'No phone number'}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="btn btn-outline w-full flex items-center justify-center space-x-2"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  )
}

export default ProfilePage
