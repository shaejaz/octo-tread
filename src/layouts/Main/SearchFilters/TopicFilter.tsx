import {
  Box,
  BoxProps,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  debounce,
} from '@mui/material'
import { Autocomplete } from '@octotread/components/Autocomplete'
import { Topic } from '@octotread/models/topic'
import { TopicSearchQuery, useLazySearchTopicQuery } from '@octotread/services/api'
import { useState, useEffect, useMemo, useCallback } from 'react'

const defaultTopicQuery: TopicSearchQuery = {
  featured: true,
}

interface Props {
  handleValueChange: (v: string[]) => void
  containerProps?: BoxProps
}

export function TopicFilter(props: Props) {
  const [searchValue, setSearchValue] = useState('')
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<Topic[]>([])
  const [values, setValues] = useState<Topic[]>([])

  const [trigger, result] = useLazySearchTopicQuery()

  const unwrappedTrigger = useCallback(
    async (q: TopicSearchQuery, callback: (v?: Topic[]) => void) => {
      const res = await trigger({ q }).unwrap()
      return callback(res.items)
    },
    [trigger],
  )

  const debouncedTrigger = useMemo(
    () =>
      debounce((request: { input: string; callback: (v?: Topic[]) => void }) => {
        const query: TopicSearchQuery = {
          text: request.input,
          featured: true,
        }

        unwrappedTrigger(query, request.callback)
      }, 400),
    [unwrappedTrigger],
  )

  useEffect(() => {
    if (open && searchValue === '') {
      unwrappedTrigger(defaultTopicQuery, (res) => {
        setOptions(res || [])
      })
    }
    // TODO: possibly replace useEffect usage in this component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, unwrappedTrigger])

  useEffect(() => {
    let active = true

    if (searchValue === '') {
      setOptions(values)
      return undefined
    }

    debouncedTrigger({
      input: searchValue,
      callback: (res) => {
        if (active) {
          let newOptions: Topic[] = []

          if (res) {
            newOptions = res
          }

          setOptions(newOptions)
        }
      },
    })

    return () => {
      active = false
    }
  }, [debouncedTrigger, values, searchValue])

  return (
    <Box {...props.containerProps}>
      <Autocomplete
        disablePortal
        multiple
        id='topics-search-list'
        value={values}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onInputChange={(event, newInputValue) => {
          setSearchValue(newInputValue)
        }}
        onChange={(event: unknown, newValue: Topic[]) => {
          setValues(newValue)
          props.handleValueChange(newValue.map((i) => i.name))
        }}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.display_name || option.name}
        options={options}
        filterOptions={(x) => x}
        loading={result.isFetching}
        customInputProps={{
          placeholder: 'Select topics',
          label: 'Topics',
        }}
        renderHeader={
          <Stack direction='column' px={2} py={1}>
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label='Featured' />
            </FormGroup>
          </Stack>
        }
        // TODO: Add additional filtering for featured/curated etc.
        // TODO: Add topic logos
      />
    </Box>
  )
}
