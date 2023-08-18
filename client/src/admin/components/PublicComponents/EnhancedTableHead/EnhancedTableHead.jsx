import React from "react";
import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { useTheme } from "@emotion/react";

const EnhancedTableHead = ({
  headers = [],
  orderBy = "_id",
  order = "asc",
  onSortClick,
}) => {
  const theme = useTheme()
  const createSortHandler = (property) => {
    return (e) => {
      onSortClick(e, property);
    };
  };
  return (
    <TableHead sx={{background:theme.palette.background.alt,width:"100%"}}>
      <TableRow>
        {headers.map((header) => (
          <TableCell key={header.id}>
            <TableSortLabel
              active={header.id === orderBy}
              direction={header.id === orderBy ? order : "asc"}
              onClick={createSortHandler(header.id)}>
              {header.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
export default EnhancedTableHead;
