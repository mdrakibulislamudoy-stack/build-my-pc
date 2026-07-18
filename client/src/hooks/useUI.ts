import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { toggleDarkMode, toggleMobileMenu } from '../store/slices/uiSlice'

type UIActions = {
  toggleDarkMode: () => void
  toggleMobileMenu: () => void
}

export const useUI = (): RootState['ui'] & UIActions => {
  const dispatch = useDispatch()
  const ui = useSelector((state: RootState) => state.ui)

  return {
    ...ui,
    toggleDarkMode: () => dispatch(toggleDarkMode()),
    toggleMobileMenu: () => dispatch(toggleMobileMenu()),
  }
}
