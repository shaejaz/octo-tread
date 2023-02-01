import { TextField } from '@mui/material'

interface Props {
  stars: number
  handleChange: (n: number) => void
}

export function StarsFilters(props: Props) {
  return (
    <TextField
      placeholder='Min stars'
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      value={props.stars}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
          props.handleChange(0)
        } else {
          props.handleChange(parseInt(event.target.value, 10))
        }
      }}
    />
  )
}
