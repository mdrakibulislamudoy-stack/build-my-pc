import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  product: string
  quantity: number
  price: number
}

interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
}

interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload
    },
    clearCart: (state) => {
      state.cart = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
})

export const { setCart, clearCart, setError } = cartSlice.actions
export default cartSlice.reducer
