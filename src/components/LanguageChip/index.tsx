import { Chip, ChipProps } from '@mui/material'

type LanguageChipProps = ChipProps & {
  name: string
  languageColor: string
}

export const LanguageChip = (props: LanguageChipProps) => {
  const { name, languageColor, ...rest } = props

  return (
    <Chip
      {...rest}
      label={name}
      size='small'
      sx={{ border: languageColor ? `2px solid ${languageColor}` : 'none' }}
    />
  )
}
