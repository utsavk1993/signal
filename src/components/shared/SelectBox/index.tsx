import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectBoxProps {
  label: string;
  value: string;
  handleChange: (event: SelectChangeEvent) => void;
  items: Array<{ value: string; label: string }>;
}

const SelectBox: React.FC<SelectBoxProps> = ({ label, value, handleChange, items }: SelectBoxProps) => {
  const labelId = label.toLowerCase();

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          id={labelId}
          value={value}
          label={label}
          onChange={handleChange}
        >
          {
            items.map((item) => (
              <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
}

export default SelectBox;
