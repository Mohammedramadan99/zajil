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
  const [selectedSeat, setSelectedSeat] = useState(null);

  const [markAs, setMarkAs] = useState("");

  const handleSectionSave = (section) => {
    // Initialize the "items" property as a 2D array
    const items = Array.from({ length: section.rows }, () =>
      Array.from({ length: section.columns }, () => 1)
    );

    // Add the "items" property to the section
    section.items = items;
    // section.items = items;
    section.id = Math.floor(Math.random() * 100000000000) + 1;

    // Update the sections state
    setSections([...sections, section]);
    setCurrentSectionIndex(sections.length);
  };

  const handleSeatToggle = (row, col, isSelected) => {
    const updatedSections = [...sections];
    console.log({updatedSections})
    console.log({currentSectionIndex})
    console.log("problem",updatedSections[currentSectionIndex])
    const currentSection = updatedSections[currentSectionIndex];
    currentSection.items = currentSection?.items || {};
    currentSection.items[`${row}-${col}`] = isSelected;

    setSections(updatedSections);

    console.log(
      "🚀 ~ file: RoomSections.jsx:39 ~ handleSeatToggle ~ setSections:",
      sections
    );
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
            <Button
              variant={markAs === "-1" ? "contained" : "outlined"}
              onClick={() => setMarkAs("-1")}
              color="secondary">
              empty
            </Button>
            <Button
              variant={markAs === "1" ? "contained" : "outlined"}
              onClick={() => setMarkAs("1")}
              color="success">
              Seat
            </Button>
            <Button
              variant={markAs === "0" ? "contained" : "outlined"}
              onClick={() => setMarkAs("0")}
              color="warning">
              Stage
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
              section={section}
              onSeatToggle={handleSeatToggle}
              onBulkSeatToggle={handleBulkSeatToggle}
              markAs={markAs}
              selectedSeat={selectedSeat}
              setSelectedSeat={setSelectedSeat}
              sections={sections}
              setSections={setSections}
              currentSectionIndex={currentSectionIndex}
              setCurrentSectionIndex={setCurrentSectionIndex}
            />
          </div>
        ))}
      </Container>
    </Box>
  );
};

export default RoomSections;
