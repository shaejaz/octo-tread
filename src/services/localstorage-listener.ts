import { createListenerMiddleware, addListener, isAnyOf } from '@reduxjs/toolkit'
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'
import { oauthTokenKey, setOauthToken, setToken, tokenKey } from './auth'
import { setItem } from '@octotread/utils/localstorage'

export const localStorageListener = createListenerMiddleware()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAppListening = localStorageListener.startListening as AppStartListening

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>

startAppListening({
  matcher: isAnyOf(setToken, setOauthToken),
  effect: async (action) => {
    if (action.type === setToken.type) {
      setItem(tokenKey, action.payload)
    }

    if (action.type === setOauthToken.type) {
      setItem(oauthTokenKey, action.payload)
    }
  },
})
