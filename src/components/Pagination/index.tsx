import { Stack, Pagination as MUIPagination, styled } from '@mui/material'

const CustomPagination = styled(MUIPagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },

  '& .MuiPaginationItem-root.Mui-selected': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,

    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
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
