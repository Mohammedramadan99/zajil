import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({ options, onChange, value }) {
  return (
    <div>
      <FormControl sx={{ minWidth: 80, width: "100%" }}>
        <InputLabel id="demo-simple-select-autowidth-label">Gender</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          name="gender"
          value={value}
          onChange={onChange}
          autoWidth={false}
          label="Gender">

          {options?.map((option, i) => (
            <MenuItem
              key={i}
              value={option}
              sx={{ textTransform: "capitalize" }}>
              <span style={{textTransform:"capitalize"}}>{option}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
