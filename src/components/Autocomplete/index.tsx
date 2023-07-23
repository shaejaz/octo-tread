import { Autocomplete as MuiAutocomplete, AutocompleteProps, Stack, useTheme } from '@mui/material'
import { Input, InputProps } from '@octotread/components/Input'
import { ReactNode } from 'react'
import { Loading } from '@octotread/components/Loading'

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type Props<T> = PartialBy<AutocompleteProps<T, true, false, false>, 'renderInput'> & {
  customInputProps?: InputProps
  renderHeader?: ReactNode
}

export function Autocomplete<T>(props: Props<T>) {
  const { customInputProps, renderHeader, options, loading, ...rest } = props
  const headerOptions = [{ header: true } as T, ...options]

  const theme = useTheme()

  return (
    <MuiAutocomplete
      options={headerOptions}
      renderInput={(params) => (
        <Input
          {...params}
          {...customInputProps}
          InputProps={{
            ...params.InputProps,
            endAdornment: <>{params.InputProps.endAdornment}</>,
          }}
          InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
          sx={{ '& .MuiInputBase-root': { backgroundColor: theme.palette.background.paper } }}
        />
      )}
      renderOption={(optionProps, option, state) => {
        if ((option as { header: boolean })['header']) {
          return (
            <>
              {renderHeader}
              {loading && (
                <Stack
                  direction='row'
                  justifyContent='center'
                  alignItems='center'
                  data-testid='loading-container'
                >
                  <Loading width={50} height={50} />
                </Stack>
              )}
            </>
          )
        } else {
          if (loading) {
            return <></>
          }

          return props.renderOption ? (
            props.renderOption(optionProps, option, state)
          ) : (
            <li {...optionProps}>
              {(props.getOptionLabel ? props.getOptionLabel(option) : option) as ReactNode}
            </li>
          )
        }
      }}
      {...rest}
    />
  )
}
