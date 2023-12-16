import React, { useState } from "react";
import SectionForm from "./SectionForm";
import SeatLayout from "./SeatLayout";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import PageHeader from "../../admin/components/PageHeader/PageHeader";

const RoomSections = () => {
  const theme = useTheme();
  const [sections, setSections] = useState([]);
  const [sectionsCount, setSectionsCount] = useState(1);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [markAs,setMarkAs] = useState("")

  const handleSectionSave = (section) => {
    setSections([...sections, section]);
    setCurrentSectionIndex(sections.length);
  };

  const handleSeatToggle = (row, col, isSelected) => {
    const updatedSections = [...sections];
    const currentSection = updatedSections[currentSectionIndex];
    currentSection.seats = currentSection.seats || {};
    currentSection.seats[`${row}-${col}`] = isSelected;

    setSections(updatedSections);
  };

  const handleFinish = () => {
    console.log("All sections saved:", sections);
  };
  const handleBulkSeatToggle = (selectedSeats) => {
    console.log("Selected seats:", selectedSeats);
  };
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
        paddingBlock: 2,
      }}>
      <Container sx={{ pb: 20 }}>
        <PageHeader title={"Event Room"} subTitle={"Designing The Room"} />
        <SectionForm onSave={handleSectionSave} />
        <Stack direction="row" alignItems={"center"} spacing={2}>
          <Typography>Mark As</Typography>
          <ButtonGroup>
            <Button variant={markAs === "empty" ? "contained" : "outlined"} onClick={() => setMarkAs("empty")} color="secondary">
              empty
            </Button>
            <Button variant={markAs === "Seat" ? "contained" : "outlined"} onClick={() => setMarkAs("Seat")} color="success">
              Seat
            </Button>
          </ButtonGroup>
        </Stack>
        {sections.map((section, index) => (
          <div key={index}>
            {/* <h3>Section {index + 1}</h3>
            <p>Name: {section.sectionName}</p>
            <p>Rows: {section.rows}</p>
            <p>Columns: {section.columns}</p> */}
            <SeatLayout
              rows={section.rows}
              columns={section.columns}
              onSeatToggle={handleSeatToggle}
              onBulkSeatToggle={handleBulkSeatToggle}
            />
          </div>
        ))}
      </Container>
    </Box>
  );
};

export default RoomSections;
