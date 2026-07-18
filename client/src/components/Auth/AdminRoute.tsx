import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { token, user } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute
