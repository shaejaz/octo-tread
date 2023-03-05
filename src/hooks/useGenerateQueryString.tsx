import { generateQueryString } from '@octotread/utils/generateQuery'
import { useQueryState } from './useQueryState'
import { DateStartEnd } from '@octotread/models/dateStartEnd'

export const useGenerateQueryString = (dateStartEnd: DateStartEnd) => {
  const queryState = useQueryState()

  return generateQueryString(queryState, dateStartEnd)
}
