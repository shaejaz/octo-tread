import { Autocomplete, Button, Stack, TextField } from '@mui/material'
import { useLazyGetAllQuery, useLazyGetPopularQuery } from '@octotread/services/api/rest/languages'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  value: string[]
  handleValueChange: (s: string[]) => void
}

export function LanguageSelection(props: Props) {
  const [open, setOpen] = useState(false)
  const [isAllLanguages, setIsAllLanguages] = useState(false)

  const [triggerGetAll, resultGetAll] = useLazyGetAllQuery()
  const [triggerGetPopular, resultGetPopular] = useLazyGetPopularQuery()

  const getLanguage = (key: string) => {
    return isAllLanguages ? resultGetAll.data?.[key] : resultGetPopular.data?.[key]
  }

  const optionsToDisplay = useMemo(
    () => Object.keys((isAllLanguages ? resultGetAll.data : resultGetPopular.data) || {}),
    [isAllLanguages, resultGetAll.data, resultGetPopular.data],
  )

  const _value = useMemo(() => {
    if (optionsToDisplay) {
      return optionsToDisplay.filter((i) => props.value.some((n) => n === getLanguage(i)?.slug))
    }
    return []
  }, [props.value, optionsToDisplay])

  useEffect(() => {
    triggerGetPopular()
  }, [])

  useEffect(() => {
    if (isAllLanguages) {
      triggerGetAll()
    }
  }, [isAllLanguages])

  return (
    <Stack direction='row'>
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
        renderInput={(params) => (
          <TextField
            {...params}
            label='Languages'
            InputProps={{
              ...params.InputProps,
              endAdornment: <>{params.InputProps.endAdornment}</>,
            }}
          />
        )}
      />

      <Button onClick={() => setIsAllLanguages(true)}>Get All</Button>
    </Stack>
  )
}
