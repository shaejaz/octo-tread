import { Button, Stack, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { SearchQueryState, generateDateRangeObj, resetQuery } from '../../../services/search-query'
import { RootState } from '../../../services/store'
import { LanguageSelection } from './LanguageSelection'
import { StarsFilters } from './StarsFilter'
import { TimeFilter } from './TimeFilter'
import { TopicFilter } from './TopicFilter'
import { useState } from 'react'

type SearchFilterOption = Pick<
  SearchQueryState,
  'dateRange' | 'language' | 'searchText' | 'stars' | 'topics'
>

export function SearchFilters() {
  const dispatch = useDispatch()

  const searchText = useSelector((state: RootState) => state.searchquery.searchText)
  const searchLanguages = useSelector((state: RootState) => state.searchquery.language)
  const searchStars = useSelector((state: RootState) => state.searchquery.stars)
  const searchDateRange = useSelector((state: RootState) => state.searchquery.dateRange)
  const searchTopics = useSelector((state: RootState) => state.searchquery.topics)

  const [preApplySettings, setPreApplySettings] = useState<SearchFilterOption>({
    searchText: searchText,
    language: searchLanguages,
    stars: searchStars,
    dateRange: searchDateRange,
    topics: searchTopics,
  })

  const handleApplyClick = () => {
    dispatch(
      resetQuery({
        state: preApplySettings,
        newDateObj: generateDateRangeObj(preApplySettings.dateRange),
      }),
    )
  }

  return (
    // TODO: Convert to use forms for validation and dirty checking
    <Stack direction='column' spacing={1}>
      <Stack direction='row' alignItems='center' spacing={2}>
        <TextField
          label='Search text'
          value={preApplySettings.searchText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPreApplySettings((s) => ({ ...s, searchText: event.target.value }))
          }
        />

        <LanguageSelection
          selected={preApplySettings.language ?? []}
          // TODO: Get languages from github repo/API
          languages={['Javascript', 'Ruby', 'C++']}
          handleLanguageClick={(l) => setPreApplySettings((s) => ({ ...s, language: l }))}
        />

        <StarsFilters
          stars={preApplySettings.stars}
          handleChange={(n) => setPreApplySettings((s) => ({ ...s, stars: n }))}
        />

        <TopicFilter
          value={preApplySettings.topics}
          handleValueChange={(v) =>
            setPreApplySettings((s) => ({ ...s, topics: v.map((i) => i.name) }))
          }
        />

        <TimeFilter
          value={preApplySettings.dateRange}
          handleChange={(v) => setPreApplySettings((s) => ({ ...s, dateRange: v }))}
        />
      </Stack>

      <Button onClick={handleApplyClick}>Apply</Button>
    </Stack>
  )
}
