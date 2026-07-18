import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  isVerified: boolean
  address?: {
    street: string
    city: string
    country: string
  }
  phone?: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,
}

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { name: string; email: string; password: string }) => {
    const response = await axios.post('/api/auth/register', credentials)
    return response.data
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post('/api/auth/login', credentials)
    return response.data
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string) => {
    const response = await axios.post('/api/auth/refresh-token', { refreshToken })
    return response.data
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post('/api/auth/logout')
  return {}
})

export const getMe = createAsyncThunk('auth/getMe', async () => {
  const response = await axios.get('/api/auth/me')
  return response.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
    },
    logoutUser: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Registration failed'
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
  },
})

export const { clearError, setCredentials, logoutUser } = authSlice.actions
export default authSlice.reducer
