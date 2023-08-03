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
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'

interface Props {
  containerProps?: BoxProps
  value: string[]
  handleValueChange: (s: string[]) => void
}

// eslint-disable-next-line react/display-name
export const LanguageSelection = forwardRef((props: Props, ref) => {
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
    <Box {...props.containerProps} ref={ref}>
      <Autocomplete
        disablePortal
        multiple
        id='languages-search-list'
        value={props.value}
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
})
