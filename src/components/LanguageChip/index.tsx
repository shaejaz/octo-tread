import { Chip, ChipProps } from '@mui/material'

type LanguageChipProps = ChipProps & {
  name: string
  languageColor: string
}

export const LanguageChip = (props: LanguageChipProps) => {
  const { name, languageColor, ...rest } = props

  return <Chip size='small' {...rest} label={name} />
}
