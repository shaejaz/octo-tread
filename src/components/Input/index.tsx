import { Icon } from '@iconify/react'
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
  formLabelClasses,
  inputLabelClasses,
  outlinedInputClasses,
  styled,
  typographyClasses,
  useTheme,
} from '@mui/material'
import { forwardRef } from 'react'

const StyledInput = styled(TextField)(({ theme }) => ({
  [`& .${formLabelClasses.root} `]: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    position: 'relative',
    transform: 'scale(1)',
  },
  [`& .${inputLabelClasses.focused}`]: {
    [`& .${typographyClasses.root}`]: {
      color: theme.palette.primaryText.primary,
    },
    [`& .iconify`]: {
      color: theme.palette.primaryText.primary,
    },
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: theme.palette.primaryText.primary,
    },
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    borderWidth: '2px',
  },
  [`& .${outlinedInputClasses.input}`]: {
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  '& legend': {
    maxWidth: '0',
  },
}))

export type InputProps = TextFieldProps & {
  tooltipText?: string
}

// eslint-disable-next-line react/display-name
export const Input = forwardRef((props: InputProps, ref) => {
  const { helperText, error, label, tooltipText, ...rest } = props

  const theme = useTheme()

  return (
    <StyledInput
      ref={ref}
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
            <Tooltip title={helperText}>
              <IconButton disableRipple data-testid='icon-container' edge='end'>
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
      label={
        <Stack direction='row' alignItems='center' spacing={1}>
          <Typography>{label}</Typography>

          {tooltipText !== undefined && (
            <Tooltip title={tooltipText} placement='right'>
              <Box>
                <Icon icon='material-symbols:info-outline' />
              </Box>
            </Tooltip>
          )}
        </Stack>
      }
    />
  )
})
