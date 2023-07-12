import styled from '@emotion/styled'
import { Stack, Pagination as MUIPagination } from '@mui/material'

const CustomPagination = styled(MUIPagination)(({ theme }) => ({
  '& .Mui-selected': {
    color: theme.palette.primary.contrastText,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
  },
}))

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
      <CustomPagination count={props.numPages} page={props.currentPage} onChange={handleChange} />
    </Stack>
  )
}
