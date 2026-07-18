import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ResetPasswordPage = () => {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await api.put(`/auth/reset-password/${token}`, { password })
      toast.success('Password reset successful!')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to reset password. The link may be expired.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="text-center mt-6 dark:text-white">
          <Link to="/login" className="text-primary-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPasswordPage
