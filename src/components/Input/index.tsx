import { Icon } from '@iconify/react'
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
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

export const Input = (props: TextFieldProps) => {
  const { helperText, error, ...rest } = props

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
        ...props.InputProps,
      }}
    />
  )
}
