import { Stack, Pagination as MUIPagination } from '@mui/material'

interface Props {
  currentPage: number
  numPages: number
  handlePageChange: (i: number) => void
}

export function Pagination(props: Props) {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    props.handlePageChange(value)
  }

  return (
    <Stack spacing={2}>
      <MUIPagination count={props.numPages} page={props.currentPage} onChange={handleChange} />
    </Stack>
  )
}
