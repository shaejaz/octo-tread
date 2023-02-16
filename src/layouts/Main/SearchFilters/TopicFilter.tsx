import { Autocomplete, TextField, debounce } from '@mui/material'
import { Topic, TopicSearchQuery, useLazySearchQuery } from '../../../services/api/topics'
import { useState, useEffect, useMemo } from 'react'

const defaultTopicQuery: TopicSearchQuery = {
  featured: true,
}

interface Props {
  value: Topic[]
  handleValueChange: (v: Topic[]) => void
}

export function TopicFilter(props: Props) {
  const [searchValue, setSearchValue] = useState('')
  const [open, setOpen] = useState(false)

  const [trigger, result] = useLazySearchQuery()

  const debouncedTrigger = useMemo(
    () =>
      debounce((request: { input: string }) => {
        const query: TopicSearchQuery = {
          text: request.input,
          featured: true,
        }

        trigger({ q: query })
      }, 400),
    [trigger],
  )

  useEffect(() => {
    if (open && searchValue === '') {
      trigger({ q: defaultTopicQuery })
    }
  }, [open])

  useEffect(() => {
    if (searchValue === '') return
    debouncedTrigger({ input: searchValue })
  }, [debouncedTrigger, searchValue])

  return (
    <Autocomplete
      disablePortal
      multiple
      id='topics-search-list'
      value={props.value}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      onInputChange={(event, newInputValue) => {
        setSearchValue(newInputValue)
      }}
      onChange={(event: unknown, newValue: Topic[]) => {
        props.handleValueChange(newValue)
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.display_name}
      options={result.data?.items || []}
      filterOptions={(x) => x}
      loading={result.isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Topics'
          InputProps={{
            ...params.InputProps,
            endAdornment: <>{params.InputProps.endAdornment}</>,
          }}
        />
      )}
      // TODO: Add additional filtering for featured/curated etc.
    />
  )
}
