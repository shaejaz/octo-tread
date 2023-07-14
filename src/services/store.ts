import { listenerMiddleware } from './listener'
import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { enhancedGraphQlApi, restApi } from './api'
import authReducer from './auth'
import searchQueryReducer from './search-query'
import uiReducer from './ui'

export const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) =>
  configureStore({
    reducer: {
      [enhancedGraphQlApi.reducerPath]: enhancedGraphQlApi.reducer,
      [restApi.reducerPath]: restApi.reducer,
      auth: authReducer,
      searchquery: searchQueryReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(enhancedGraphQlApi.middleware)
        .concat(restApi.middleware),
    ...options,
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
