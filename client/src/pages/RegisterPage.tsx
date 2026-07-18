import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { register } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }) as any)
      toast.success('Registration successful!')
      navigate('/')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-6 dark:text-white">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
