import { MenuItem, TextFieldProps } from '@mui/material'
import { Input } from '@octotread/components/Input'
import { DateRange } from '@octotread/models/dateRange'

interface Props {
  value: DateRange
  handleChange: (n: DateRange) => void
  containerProps?: TextFieldProps
}

export function TimeFilter(props: Props) {
  return (
    <Input
      select
      label='Date range'
      defaultValue={props.value}
      onChange={(event) => props.handleChange(event.target.value as DateRange)}
      {...props.containerProps}
    >
      <MenuItem value='daily'>Daily</MenuItem>
      <MenuItem value='weekly'>Weekly</MenuItem>
      <MenuItem value='monthly'>Monthly</MenuItem>
    </Input>
  )
}
