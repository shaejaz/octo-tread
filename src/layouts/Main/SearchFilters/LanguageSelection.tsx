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
    if (selected && selected.length) {
      props.handleLanguageClick(selected)
    }
  }, [selected])

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id='languages'>Languages</InputLabel>
      <Select
        labelId='languages'
        multiple
        value={selected}
        onChange={(event: SelectChangeEvent<typeof selected>) => {
          const {
            target: { value },
          } = event

          setSelected(typeof value === 'string' ? value.split(',') : value)
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
