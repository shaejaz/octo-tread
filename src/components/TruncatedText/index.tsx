import { Typography, TypographyProps, styled } from '@mui/material'

interface TruncatedTextProps extends TypographyProps {
  lines: number
}

export const TruncatedText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lines',
})<TruncatedTextProps>(({ lines }) => ({
  display: '-webkit-box',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  '-moz-box-orient': 'vertical',
  '-webkit-line-clamp': String(lines),
}))
