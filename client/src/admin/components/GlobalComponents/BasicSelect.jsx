import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({
  options,
  onChange,
  value,
  name,
  label,
  helperText,
  error,
}) {
  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id="demo-simple-select-autowidth-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        name={name}
        value={value}
        onChange={onChange}
        autoWidth={false}
        label={label}
        error={error}>
        {options?.map((option, i) => (
          <MenuItem key={i} value={option} sx={{ textTransform: "capitalize" }}>
            <span style={{ textTransform: "capitalize" }}>
              {option.includes("_") ? option.replace(/_/g, " ") : option}
            </span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
