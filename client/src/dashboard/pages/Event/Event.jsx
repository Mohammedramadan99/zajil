import React, { useState } from "react";
import { Paper } from "@mui/material";
import RoomDynamicSize from "../../../components/Event/RoomDesign";
import RoomSections from "../../../components/Event/RoomSections";

function Event() {
  return (
    <Paper>
      <RoomSections />
    </Paper>
  );
}

export default Event;
