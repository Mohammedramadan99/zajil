import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function BasicSelect({ items, value, handleChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Business</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Business"
        size="small"
        variant="standard"
        onChange={handleChange}>
        {items?.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {" "}
            {item.name}{" "}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default BasicSelect;
