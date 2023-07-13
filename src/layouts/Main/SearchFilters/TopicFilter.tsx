import { Icon } from '@iconify/react'
import {
  Box,
  BoxProps,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  Tooltip,
  Typography,
  debounce,
} from '@mui/material'
import { Autocomplete } from '@octotread/components/Autocomplete'
import { Topic } from '@octotread/models/topic'
import { TopicSearchQuery, useLazySearchTopicQuery } from '@octotread/services/api'
import { useState, useEffect, useMemo, useCallback } from 'react'

const defaultTopicQuery: TopicSearchQuery = {
  featured: true,
  curated: true,
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
  const [featured, setFeatured] = useState(defaultTopicQuery.featured)
  const [curated, setCurated] = useState(defaultTopicQuery.curated)

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
      debounce((request: { input: TopicSearchQuery; callback: (v?: Topic[]) => void }) => {
        const query: TopicSearchQuery = request.input

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

    debouncedTrigger({
      input: { text: searchValue, featured, curated },
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
  }, [debouncedTrigger, values, searchValue, featured, curated])

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
          tooltipText: 'Topics that the owner has attached to the repository',
        }}
        renderHeader={
          <Stack direction='column' px={2} py={1}>
            <FormGroup>
              <Stack direction='row' spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={featured}
                      onChange={(val) => setFeatured(val.target.checked)}
                    />
                  }
                  label={
                    <Stack direction='row' alignItems='center' spacing={0.5}>
                      <Typography>Featured</Typography>

                      <Tooltip title='Topics featured by GitHub' placement='right'>
                        <Icon icon='material-symbols:info-outline' />
                      </Tooltip>
                    </Stack>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={curated}
                      onChange={(val) => setCurated(val.target.checked)}
                    />
                  }
                  label={
                    <Stack direction='row' alignItems='center' spacing={0.5}>
                      <Typography>Curated</Typography>

                      <Tooltip title='Topics curated by GitHub' placement='right'>
                        <Icon icon='material-symbols:info-outline' />
                      </Tooltip>
                    </Stack>
                  }
                />
              </Stack>
            </FormGroup>

            <Divider />
          </Stack>
        }
        // TODO: Add topic logos
      />
    </Box>
  )
}
