import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { DateRange } from '../../../services/search-query'

interface Props {
  value: DateRange
  handleChange: (n: DateRange) => void
}

export function TimeFilter(props: Props) {
  return (
    <FormControl sx={{ width: 300 }}>
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
