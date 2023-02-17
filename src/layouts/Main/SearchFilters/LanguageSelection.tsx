import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface Props {
  languages: string[]
  selected: string[]
  handleLanguageClick: (s: string[]) => void
}

export function LanguageSelection(props: Props) {
  const [selected, setSelected] = useState<string[]>(props.selected)

  useEffect(() => {
    if (selected) {
      props.handleLanguageClick(selected)
    }
  }, [selected])

  return (
    <FormControl>
      <InputLabel id='languages'>Languages</InputLabel>
      <Select
        labelId='languages'
        multiple
        value={selected}
        onChange={(event: SelectChangeEvent<typeof selected>) => {
          const {
            target: { value },
          } = event

          const v = typeof value === 'string' ? value.split(',') : value === undefined ? [] : value
          setSelected(v)
        }}
        input={<OutlinedInput label='Languages' />}
        renderValue={(s) => s.join(', ')}
      >
        {props.languages.map((l, idx) => (
          <MenuItem key={idx} value={l}>
            <Checkbox checked={selected.indexOf(l) > -1} />
            <ListItemText primary={l} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
