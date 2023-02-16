import { listenerMiddleware } from './listener'
import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { graphQlApi } from './api'
import authReducer from './auth'
import searchQueryReducer from './search-query'

export const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) =>
  configureStore({
    reducer: {
      [graphQlApi.reducerPath]: graphQlApi.reducer,
      auth: authReducer,
      searchquery: searchQueryReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(graphQlApi.middleware),
    ...options,
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
