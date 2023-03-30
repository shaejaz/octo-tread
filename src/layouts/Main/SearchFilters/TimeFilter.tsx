import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { DateRange } from '@octotread/models/dateRange'

interface Props {
  value: DateRange
  handleChange: (n: DateRange) => void
  containerProps?: FormControlProps
}

export function TimeFilter(props: Props) {
  return (
    <FormControl {...props.containerProps}>
      <InputLabel id='date-range-select-label'>Date range</InputLabel>
      <Select
        id='date-range-select'
        labelId='date-range-select-label'
        label='Date range'
        value={props.value}
        onChange={(event: SelectChangeEvent<DateRange>) =>
          props.handleChange(event.target.value as DateRange)
        }
      >
        <MenuItem value='daily'>Daily</MenuItem>
        <MenuItem value='weekly'>Weekly</MenuItem>
        <MenuItem value='monthly'>Monthly</MenuItem>
      </Select>
    </FormControl>
  )
}
