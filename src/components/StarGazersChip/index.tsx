import { Icon } from '@iconify/react'
import { Chip, ChipProps } from '@mui/material'

type StarGazersChipProps = ChipProps & {
  stars: number
}

export const StarGazersChip = (props: StarGazersChipProps) => (
  <Chip
    {...props}
    icon={<Icon icon='ic:round-star' width='20' height='20' />}
    label={props.stars}
  />
)
