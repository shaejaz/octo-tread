import { Icon, IconProps } from '@iconify/react'
import { Stack, Typography, TypographyProps, useTheme } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  message: string | ReactNode
  typographyProps?: TypographyProps
  iconProps?: Partial<IconProps>
}

export const Error = (props: Props) => {
  const theme = useTheme()

  return (
    <Stack direction='column' alignItems='center' spacing={1}>
      <Icon
        icon='material-symbols:error-outline'
        height={70}
        width={70}
        color={theme.palette.error.main}
        {...props.iconProps}
      />

      {typeof props.message === 'string' ? (
        <Typography variant='h4' {...props.typographyProps}>
          {props.message}
        </Typography>
      ) : (
        props.message
      )}
    </Stack>
  )
}
