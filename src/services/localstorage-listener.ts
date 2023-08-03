import { createListenerMiddleware, addListener, isAnyOf } from '@reduxjs/toolkit'
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'
import { oauthTokenKey, setOauthToken, setToken, tokenKey } from './auth'
import { setItem } from '@octotread/utils/localstorage'
import {
  resetQuery,
  searchQueryKey,
  setDateRange,
  setLanguage,
  setSearchText,
  setStars,
  setTopics,
} from './search-query'

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>

export const tokenLocalStorageListener = createListenerMiddleware()

export const startAppListening = tokenLocalStorageListener.startListening as AppStartListening

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

export const searchQueryLocalStorageListener = createListenerMiddleware()

export const startSearchQueryListening =
  searchQueryLocalStorageListener.startListening as AppStartListening

startSearchQueryListening({
  matcher: isAnyOf(setSearchText, setLanguage, setStars, setDateRange, setTopics, resetQuery),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState().searchquery

    setItem(searchQueryKey, JSON.stringify(state))
  },
})
