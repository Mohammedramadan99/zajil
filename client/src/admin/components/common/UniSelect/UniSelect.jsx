import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box } from "@mui/material";

export default function UniSelect({
  name,
  items,
  selectTitle,
  value,
  setValue,
  handleChange,
  size = "medium",
  cstStyle,
}) {

  return (
    <Box component="div" sx={{ minWidth: 120,...cstStyle }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label"> {selectTitle} </InputLabel>
        <Select
          name={name}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={selectTitle}
          onChange={handleChange}
          size={size}
          >
          {items?.map((item, i) => (
            <MenuItem key={i} value={item.value}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
