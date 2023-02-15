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
    return currentState.searchquery.datesToFetch !== previousState.searchquery.datesToFetch
  },
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState().searchquery
    listenerApi.dispatch(
      searchApi.endpoints.search.initiate({
        obj: state,
        dateRange: state.datesToFetch[state.datesToFetch.length - 1],
      }),
    )
  },
})
