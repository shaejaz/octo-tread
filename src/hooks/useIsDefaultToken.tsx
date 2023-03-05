import { defaultToken } from '@octotread/services/auth'
import { RootState } from '@octotread/services/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useIsDefaultTokenSet = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  const isDefault = useMemo(() => token === defaultToken, [token])

  return isDefault
}
