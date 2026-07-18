import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { login } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const resultAction = await dispatch(login(formData) as any)
      unwrapResult(resultAction)
      toast.success('Login successful!')
      navigate('/admin')
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-6 dark:text-white">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
