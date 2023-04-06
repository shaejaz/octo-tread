import { Icon } from '@iconify/react'
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from '@mui/material'

const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiFormLabel-root': {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    position: 'relative',
    transform: 'scale(1)',
  },
  '& legend': {
    maxWidth: '0',
  },
}))

export type InputProps = TextFieldProps & {
  tooltipText?: string
}

export const Input = (props: InputProps) => {
  const { helperText, error, label, tooltipText, ...rest } = props

  const theme = useTheme()

  return (
    <StyledInput
      {...rest}
      error={error}
      helperText={''}
      InputLabelProps={{
        ...props.InputLabelProps,
        shrink: true,
      }}
      InputProps={{
        ...props.InputProps,
        endAdornment: error && (
          <InputAdornment position='end'>
            {/* TODO: adjust tooltip styles */}
            <Tooltip title={helperText}>
              <IconButton disableRipple edge='end'>
                <Icon
                  icon='material-symbols:error-outline-rounded'
                  color={theme.palette.error.main}
                />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
      label={
        <Stack direction='row' alignItems='center' spacing={1}>
          <Typography>{label}</Typography>

          {tooltipText !== undefined && (
            <Tooltip title={tooltipText} placement='right'>
              <Icon icon='material-symbols:info-outline' />
            </Tooltip>
          )}
        </Stack>
      }
    />
  )
}
