import { Autocomplete, TextField, debounce } from '@mui/material'
import { Topic } from '@octotread/models/topic'
import { TopicSearchQuery, useLazySearchTopicQuery } from '@octotread/services/api'
import { useState, useEffect, useMemo } from 'react'

const defaultTopicQuery: TopicSearchQuery = {
  featured: true,
}

interface Props {
  value: string[]
  handleValueChange: (v: string[]) => void
}

export function TopicFilter(props: Props) {
  const [searchValue, setSearchValue] = useState('')
  const [open, setOpen] = useState(false)

  const [trigger, result] = useLazySearchTopicQuery()

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

  const _value = useMemo(() => {
    if (result.data) {
      return result.data.items.filter((i) => props.value.some((n) => n === i.name))
    }
    return []
  }, [props.value, result.data])

  useEffect(() => {
    if (open && searchValue === '') {
      trigger({ q: defaultTopicQuery })
    }
  }, [open, searchValue, trigger])

  useEffect(() => {
    if (searchValue === '') return
    debouncedTrigger({ input: searchValue })
  }, [debouncedTrigger, searchValue])

  return (
    <Autocomplete
      disablePortal
      multiple
      id='topics-search-list'
      value={_value}
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
        props.handleValueChange(newValue.map((i) => i.name))
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.display_name || option.name}
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
      // TODO: Add topic logos
    />
  )
}
