import { getItem } from '@octotread/utils/localstorage'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// export const defaultToken = import.meta.env.VITE_GITHUB_KEY

export const tokenKey = 'token'
export const oauthTokenKey = 'oauthToken'

export interface AuthState {
  token: string
  oauthToken: string
}

const initialState: AuthState = {
  token: getItem(tokenKey) || '',
  oauthToken: getItem(oauthTokenKey) || '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setOauthToken: (state, action: PayloadAction<string>) => {
      state.oauthToken = action.payload
    },
  },
})

export const { setToken, setOauthToken } = authSlice.actions

export default authSlice.reducer
