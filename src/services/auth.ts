import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  token: string
}

const initialState: AuthState = {
  token: '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',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
  },
})

export const { setToken } = authSlice.actions

export default authSlice.reducer
