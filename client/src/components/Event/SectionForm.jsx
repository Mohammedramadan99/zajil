import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const SectionForm = ({ onSave,selectedSeat,row,col }) => {
  const [sectionName, setSectionName] = useState("");
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);

  const handleSave = () => {
    // Validate that all fields are filled
    if (sectionName && rows > 0 && columns > 0) {
      onSave({ sectionName, rows, columns });
    } else {
      alert("Please enter valid values for all fields.");
    }
  };

  return (
    <div>
      <form>
        <Box marginBottom={2} sx={{ maxWidth: 500, margin: "auto" }} component={"legend"}>
          <Typography sx={{fontSize:12,mb:1}}>Add new section</Typography>
          <TextField
            name="sectionName"
            label="SectionName"
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
          />
          <Stack direction={"row"} spacing={2}>
            <TextField
              name="rows"
              label="Rows"
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value, 10))}
              sx={{ width: "100%", mb: 2 }}
            />
            <TextField
              name="columns"
              label="Columns"
              type="number"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value, 10))}
              sx={{ width: "100%", mb: 2 }}
            />
            <Button variant="contained" onClick={handleSave}>Add</Button>
          </Stack>
        </Box>
      </form>
    </div>
  );
};

export default SectionForm;
