import { Box, BoxProps, Button } from '@mui/material'
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
  const [isAllLanguages, setIsAllLanguages] = useState(false)

  const [triggerGetAll, resultGetAll] = useLazyGetAllQuery()
  const [triggerGetPopular, resultGetPopular] = useLazyGetPopularQuery()

  const getLanguage = useCallback(
    (key: string) => {
      return isAllLanguages ? resultGetAll.data?.[key] : resultGetPopular.data?.[key]
    },
    [isAllLanguages, resultGetAll.data, resultGetPopular.data],
  )

  const optionsToDisplay = useMemo(
    () => Object.keys((isAllLanguages ? resultGetAll.data : resultGetPopular.data) || {}),
    [isAllLanguages, resultGetAll.data, resultGetPopular.data],
  )

  const _value = useMemo(() => {
    if (optionsToDisplay) {
      return optionsToDisplay.filter((i) => props.value.some((n) => n === getLanguage(i)?.slug))
    }
    return []
  }, [props.value, optionsToDisplay, getLanguage])

  useEffect(() => {
    triggerGetPopular()
  }, [triggerGetPopular])

  useEffect(() => {
    if (isAllLanguages) {
      triggerGetAll()
    }
  }, [isAllLanguages, triggerGetAll])

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
        loading={resultGetAll.isLoading || resultGetPopular.isLoading}
        customInputProps={{
          placeholder: 'Select languages',
          label: 'Languages',
        }}
        renderHeader={
          <Box px={2} py={1}>
            <Button onClick={() => setIsAllLanguages(true)} sx={{ width: '100%' }}>
              Get All
            </Button>
          </Box>
        }
      />
    </Box>
  )
}
