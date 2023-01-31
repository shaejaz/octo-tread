import { Stack, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage, setSearchText } from '../../../services/search-query'
import { RootState } from '../../../services/store'
import { LanguageSelection } from './LanguageSelection'

export function SearchFilters() {
  const dispatch = useDispatch()

  const searchText = useSelector((state: RootState) => state.searchquery.searchText)
  const searchLanguages = useSelector((state: RootState) => state.searchquery.language)

  return (
    <Stack direction='row' alignItems='center'>
      <TextField
        placeholder='Search text'
        value={searchText}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          dispatch(setSearchText(event.target.value))
        }
      />

      <LanguageSelection
        selected={searchLanguages ?? []}
        languages={['Javascript', 'Ruby', 'C++']}
        handleLanguageClick={(s) => dispatch(setLanguage(s))}
      />
    </Stack>
  )
}
