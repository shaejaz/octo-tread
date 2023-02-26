import { TextField } from '@mui/material'

interface Props {
  num: number
  handleChange: (n: number) => void
}

export function RepoPerPage(props: Props) {
  return (
    <TextField
      placeholder='Number of repositories per page'
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      value={props.num}
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
