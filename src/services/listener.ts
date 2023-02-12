// listenerMiddleware.ts
import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from './store'
import { searchApi } from './api/search'

export const listenerMiddleware = createListenerMiddleware()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAppListening = listenerMiddleware.startListening as AppStartListening

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>

startAppListening({
  predicate: (action, currentState, previousState) => {
    return (
      currentState.searchquery.pagination.currentPage !==
        previousState.searchquery.pagination.currentPage ||
      currentState.searchquery.createdLast !== previousState.searchquery.createdLast
    )
  },
  effect: async (action, listenerApi) => {
    const query = listenerApi.getState().searchquery.query
    const pagination = listenerApi.getState().searchquery.pagination
    listenerApi.dispatch(
      searchApi.endpoints.search.initiate({
        q: query ?? '',
        startCursor: pagination.currentPageBase64,
      }),
    )
  },
})
