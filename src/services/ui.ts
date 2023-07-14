import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  scrolledDown: boolean
  toolbarHovered: boolean
}

const initialState: UIState = {
  scrolledDown: false,
  toolbarHovered: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setScrolledDown: (state, action: PayloadAction<boolean>) => {
      state.scrolledDown = action.payload
    },
    setToolbarHovered: (state, action: PayloadAction<boolean>) => {
      state.toolbarHovered = action.payload
    },
  },
})

export const { setScrolledDown, setToolbarHovered } = uiSlice.actions

export default uiSlice.reducer
