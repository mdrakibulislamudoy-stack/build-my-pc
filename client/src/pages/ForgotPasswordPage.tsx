import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setIsSubmitted(true)
      toast.success('Password reset email sent!')
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Check Your Email</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent a password reset link to your email. Please check your inbox.
          </p>
          <Link to="/login" className="btn btn-primary">
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-center mt-6 dark:text-white">
          Remember your password?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
