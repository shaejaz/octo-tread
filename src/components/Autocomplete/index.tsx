import { Autocomplete as MuiAutocomplete, AutocompleteProps, TextFieldProps } from '@mui/material'
import { Input } from '@octotread/components/Input'
import { ReactNode } from 'react'

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type Props<T> = PartialBy<AutocompleteProps<T, true, false, false>, 'renderInput'> & {
  customInputProps?: TextFieldProps
  renderHeader?: ReactNode
}

export function Autocomplete<T>(props: Props<T>) {
  const { customInputProps, renderHeader, options, ...rest } = props
  let headerOptions = options

  if (renderHeader) {
    headerOptions = [{ header: true } as T, ...options]
  }

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
        />
      )}
      renderOption={(optionProps, option, state) => {
        if ((option as { header: boolean })['header']) {
          return <>{renderHeader}</>
        } else {
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
