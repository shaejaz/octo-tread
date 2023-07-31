import { useEffect, useMemo, useState } from 'react'
import { GridLayout } from '@octotread/components/RepoGrid'
import { useSelector } from 'react-redux'
import { RootState } from '@octotread/services/store'
import { Box, Button, Stack, useTheme } from '@mui/material'
import { SearchRepositoryResult, useLazySearchRepositoriesQuery } from '@octotread/services/api'
import { getCursor } from '@octotread/utils/cursor'
import { useGenerateQueryString } from 'hooks/useGenerateQueryString'
import { RepoGroupDateHeader } from '../RepoGroupDateHeader'
import { Pagination } from '@octotread/components/Pagination'
import { Error } from '@octotread/components/Error'
import { Loading } from '@octotread/components/Loading'
import { DateStartEnd } from '@octotread/models/dateStartEnd'

interface Props {
  dateStartEnd: DateStartEnd
  handleNextClick: () => void
  isLast: boolean
}

type Result = ReturnType<typeof useLazySearchRepositoriesQuery>[1]

function getResultData(result: Result) {
  return result?.data as unknown as SearchRepositoryResult
}

export function RepoGroup(props: Props) {
  const { dateStartEnd, handleNextClick, isLast } = props

  const [page, setPage] = useState(1)
  const [trigger, result] = useLazySearchRepositoriesQuery()

  const theme = useTheme()

  const queryString = useGenerateQueryString(dateStartEnd)
  const itemsPerPage = useSelector((state: RootState) => state.searchquery.itemsPerPage)

  const numPages = useMemo(() => {
    return Math.ceil(getResultData(result)?.repositoryCount / itemsPerPage)
  }, [result, itemsPerPage])

  useEffect(() => {
    trigger({
      q: queryString,
      reposfirst: itemsPerPage,
      after: page ? getCursor((page - 1) * itemsPerPage) : undefined,
    })
  }, [page, queryString, itemsPerPage, trigger])

  const handlePageChange = (value: number) => {
    setPage(value)
  }

  return (
    <Stack direction='column' alignItems='center' spacing={3} width='100%'>
      {result.isLoading ? (
        <Loading />
      ) : (
        <>
          <RepoGroupDateHeader dateStartEnd={props.dateStartEnd} />

          {result.isError && <Error message='Error in fetching repositories' />}

          {getResultData(result)?.repositories.length < 1 && !result.isError && (
            <Error message='No repositories found' iconProps={{ color: theme.palette.info.main }} />
          )}

          {(page === 1 || !result.isError) && getResultData(result)?.repositories.length > 0 && (
            <>
              <Box width='100%'>
                <GridLayout
                  repos={getResultData(result)?.repositories}
                  loading={result.isFetching && !result.isLoading}
                />
              </Box>

              <Box sx={{ marginX: 'auto' }}>
                <Pagination
                  currentPage={page}
                  numPages={numPages}
                  handlePageChange={handlePageChange}
                />
              </Box>
            </>
          )}

          {isLast && !result.isLoading && (
            <Button variant='contained' onClick={handleNextClick} sx={{ px: 3 }}>
              Load next
            </Button>
          )}
        </>
      )}
    </Stack>
  )
}
