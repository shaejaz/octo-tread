import { RootState } from '@octotread/services/store'
import { GenerateQueryState } from '@octotread/utils/generateQuery'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useQueryState = () => {
  const state = useSelector((state: RootState) => state.searchquery)

  const queryState: GenerateQueryState = useMemo(() => {
    return {
      searchText: state.searchText,
      language: state.language,
      topics: state.topics,
      stars: state.stars,
      sort: state.sort,
    }
  }, [state.searchText, state.language, state.topics, state.stars, state.sort])

  return queryState
}
