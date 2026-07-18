import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  isDarkMode: boolean
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
}

const initialState: UIState = {
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  isSidebarOpen: false,
  isMobileMenuOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
      localStorage.setItem('darkMode', state.isDarkMode.toString())
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload
      localStorage.setItem('darkMode', action.payload.toString())
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false
    },
  },
})

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  closeSidebar,
  toggleMobileMenu,
  closeMobileMenu,
} = uiSlice.actions

export default uiSlice.reducer
