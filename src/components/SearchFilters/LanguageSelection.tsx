import {
  Box,
  BoxProps,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material'
import { Autocomplete } from '@octotread/components/Autocomplete'
import { useLazyGetAllQuery, useLazyGetPopularQuery } from '@octotread/services/api/rest/languages'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface Props {
  containerProps?: BoxProps
  value: string[]
  handleValueChange: (s: string[]) => void
}

export function LanguageSelection(props: Props) {
  const [open, setOpen] = useState(false)
  const [languagesSelection, setLanguagesSelection] = useState<'popular' | 'all'>('popular')

  const [triggerGetAll, resultGetAll] = useLazyGetAllQuery()
  const [triggerGetPopular, resultGetPopular] = useLazyGetPopularQuery()

  const getLanguage = useCallback(
    (key: string) => {
      return languagesSelection === 'all' ? resultGetAll.data?.[key] : resultGetPopular.data?.[key]
    },
    [languagesSelection, resultGetAll.data, resultGetPopular.data],
  )

  const optionsToDisplay = useMemo(
    () =>
      Object.keys((languagesSelection === 'all' ? resultGetAll.data : resultGetPopular.data) || {}),
    [languagesSelection, resultGetAll.data, resultGetPopular.data],
  )

  const _value = useMemo(() => {
    if (optionsToDisplay) {
      return optionsToDisplay.filter((i) => props.value.some((n) => n === getLanguage(i)?.slug))
    }
    return []
  }, [props.value, optionsToDisplay, getLanguage])

  useEffect(() => {
    if (languagesSelection === 'all') {
      triggerGetAll()
    } else {
      triggerGetPopular()
    }
  }, [languagesSelection, triggerGetAll, triggerGetPopular])

  const handleLanguageSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguagesSelection(event.target.value as 'popular' | 'all')
  }

  return (
    <Box {...props.containerProps}>
      <Autocomplete
        disablePortal
        multiple
        id='languages-search-list'
        value={_value}
        open={open}
        onOpen={() => {
          setOpen(true)
        }}
        onClose={() => {
          setOpen(false)
        }}
        onChange={(event, newValue) => {
          props.handleValueChange(
            newValue.map((i) => getLanguage(i)?.slug).filter((i) => i !== undefined) as string[],
          )
        }}
        isOptionEqualToValue={(option, value) =>
          getLanguage(option)?.slug === getLanguage(value)?.slug
        }
        options={optionsToDisplay}
        loading={resultGetAll.isFetching || resultGetPopular.isFetching}
        customInputProps={{
          placeholder: 'Select languages',
          label: 'Languages',
        }}
        renderHeader={
          <Stack direction='column' px={2} py={1}>
            <FormControl>
              <FormLabel id='language-selection-group'>Select which languages to search</FormLabel>
              <RadioGroup
                name='language-selection-group'
                row
                value={languagesSelection}
                onChange={handleLanguageSelectionChange}
              >
                <FormControlLabel value='all' control={<Radio />} label='All' />
                <FormControlLabel value='popular' control={<Radio />} label='Popular' />
              </RadioGroup>
            </FormControl>

            <Divider />
          </Stack>
        }
      />
    </Box>
  )
}
