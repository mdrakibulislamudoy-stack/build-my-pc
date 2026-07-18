import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import WishlistPage from './pages/WishlistPage'
import PCBuilderPage from './pages/PCBuilderPage'
import SavedBuildsPage from './pages/SavedBuildsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AdminRoute from './components/Auth/AdminRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } />
              <Route path="/pc-builder" element={<PCBuilderPage />} />
              <Route path="/saved-builds" element={
                <ProtectedRoute>
                  <SavedBuildsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </Router>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
