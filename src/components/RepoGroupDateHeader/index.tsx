import { useMemo } from 'react'
import { Typography } from '@mui/material'
import { format, fromUnixTime } from 'date-fns'
import { DateStartEnd } from '@octotread/models/dateStartEnd'

interface Props {
  dateStartEnd: DateStartEnd
}

export function RepoGroupDateHeader(props: Props) {
  const header = useMemo(() => {
    const start = format(fromUnixTime(props.dateStartEnd.end), 'do MMM')
    const end = format(fromUnixTime(props.dateStartEnd.start), 'do MMM')
    const year = format(fromUnixTime(props.dateStartEnd.start), 'yyyy')

    return `${end} - ${start}, ${year}`
  }, [props.dateStartEnd])

  return <Typography variant='h4'>{header}</Typography>
}
