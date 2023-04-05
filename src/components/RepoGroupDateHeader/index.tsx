import { useMemo } from 'react'
import { Typography } from '@mui/material'
import { format, fromUnixTime } from 'date-fns'
import { DateStartEnd } from '@octotread/models/dateStartEnd'

interface Props {
  dateStartEnd: DateStartEnd
}

export function RepoGroupDateHeader(props: Props) {
  const header = useMemo(() => {
    const start = format(fromUnixTime(props.dateStartEnd.end), 'do MMM, yyyy')
    const end = format(fromUnixTime(props.dateStartEnd.start), 'do MMM, yyyy')

    return `${end} - ${start}`
  }, [props.dateStartEnd])

  return <Typography variant='h4'>{header}</Typography>
}
