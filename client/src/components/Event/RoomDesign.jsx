// RoomDynamicSize.js

import React, { useState, useEffect } from "react";
import { SelectableGroup } from "react-selectable-fast";
import RoomSquare from "./RoomSquare";
import { Box, Button, Stack } from "@mui/material";
import "./RoomDesign.scss";

const RoomDynamicSize = () => {
  const [roomLayout, setRoomLayout] = useState([]);
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);

  useEffect(() => {
    initializeRoomLayout();
  }, [rows, columns]);

  const initializeRoomLayout = () => {
    const initialLayout = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: columns }, (_, colIndex) => ({
        id: rowIndex * columns + colIndex + 1,
        option: "empty",
      }))
    );
    setRoomLayout(initialLayout);
  };

  const handleAddRow = () => {
    setRows((prevRows) => prevRows + 1);
  };

  const handleRemoveRow = () => {
    if (rows > 1) {
      setRows((prevRows) => prevRows - 1);
    }
  };

  const handleAddColumn = () => {
    setColumns((prevCols) => prevCols + 1);
  };

  const handleRemoveColumn = () => {
    if (columns > 1) {
      setColumns((prevCols) => prevCols - 1);
    }
  };

  const handleSquareClick = (squareId, selectedOption) => {
    const updatedLayout = roomLayout.map((row) =>
      row.map((square) =>
        square.id === squareId ? { ...square, option: selectedOption } : square
      )
    );
    setRoomLayout(updatedLayout);
  };

  const handleSelectionFinish = (selectedItems) => {
    // Handle the selection of multiple squares here
    console.log("Selected squares:", selectedItems);
  };

  return (
    <Box>
      <Stack direction={"row"}>
        <Button onClick={handleAddRow}>Add Column</Button>
        <Button onClick={handleRemoveRow}>Remove Column</Button>
        <Button onClick={handleAddColumn}>Add Row</Button>
        <Button onClick={handleRemoveColumn}>Remove Row</Button>
      </Stack>

      <SelectableGroup
        className="room-design"
        enableDeselect
        tolerance={0}
        onSelectionFinish={handleSelectionFinish}
      >
        {roomLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="room-row">
            {row.map((square) => (
              <RoomSquare
                key={square.id}
                squareData={square}
                onSelect={handleSquareClick}
              />
            ))}
          </div>
        ))}
      </SelectableGroup>
    </Box>
  );
};

export default RoomDynamicSize;
