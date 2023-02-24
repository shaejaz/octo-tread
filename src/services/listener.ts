import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'
import { generateQueryFn } from './search-query'
import { graphQlApiTest } from './api'

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
    const q = generateQueryFn(state, state.datesToFetch[state.datesToFetch.length - 1])

    listenerApi.dispatch(
      graphQlApiTest.endpoints.SearchRepositories.initiate({
        q: q,
        reposfirst: state.itemsPerPage,
      }),
    )
  },
})
