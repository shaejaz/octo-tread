import { Stack, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setDateRange, setLanguage, setSearchText, setStars } from '../../../services/search-query'
import { RootState } from '../../../services/store'
import { LanguageSelection } from './LanguageSelection'
import { StarsFilters } from './StarsFilter'
import { TimeFilter } from './TimeFilter'

export function SearchFilters() {
  const dispatch = useDispatch()

  const searchText = useSelector((state: RootState) => state.searchquery.searchText)
  const searchLanguages = useSelector((state: RootState) => state.searchquery.language)
  const searchStars = useSelector((state: RootState) => state.searchquery.stars)
  const searchDateRange = useSelector((state: RootState) => state.searchquery.dateRange)

  return (
    <Stack direction='row' alignItems='center' gap={2}>
      <TextField
        label='Search text'
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

      <StarsFilters stars={searchStars} handleChange={(n) => dispatch(setStars(n))} />

      <TimeFilter
        value={searchDateRange ?? 'weekly'}
        handleChange={(v) => dispatch(setDateRange(v))}
      />
    </Stack>
  )
}
