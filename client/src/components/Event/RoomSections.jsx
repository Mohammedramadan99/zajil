import React, { useState } from "react";
import SectionForm from "./SectionForm";
import SeatLayout from "./SeatLayout";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import PageHeader from "../../admin/components/PageHeader/PageHeader";
import UniSlider from "../common/Slider/Slider";
import NoDataMsg from "../common/NoDataMsg/NoDataMsg";
import CloseIcon from "@mui/icons-material/Close";

const RoomSections = () => {
  const theme = useTheme();
  const [sections, setSections] = useState([]);
  const [sectionsCount, setSectionsCount] = useState(1);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [sectionsGap, setSectionsGap] = useState(10);
  const [seatStatus, setSeatStatus] = useState({});
  const [markAs, setMarkAs] = useState("");

  const handleSectionSave = (section) => {
    // Initialize the "items" property as a 2D array
    const items = Array.from({ length: section.rows }, () =>
      Array.from({ length: section.columns }, () => 1)
    );
  
    // Add the "items" property to the section
    section.items = items;
    section.id = Math.floor(Math.random() * 100000000000) + 1;
  
    // Update the sections state
    setSections([...sections, section]);
    // setCurrentSectionIndex(sections.length);
  
    // Merge the new seat statuses with the existing ones
    setSeatStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus };
      for (let row = 1; row <= section.rows; row++) {
        for (let col = 1; col <= section.columns; col++) {
          const seatKey = `${row}-${col}`;
          if (!(seatKey in updatedStatus)) {
            updatedStatus[seatKey] = 1; // Set the default status for seats to 1
          }
        }
      }
      return updatedStatus;
    });
  };
  

  const handleSeatToggle = (row, col, isSelected) => {
    const updatedSections = [...sections];
    console.log({ updatedSections });
    console.log({ currentSectionIndex });
    console.log("problem", updatedSections[currentSectionIndex]);
    const currentSection = updatedSections[currentSectionIndex];
    currentSection.items = currentSection?.items || {};
    currentSection.items[`${row}-${col}`] = isSelected;

    setSections(updatedSections);
  };

  const handleBulkSeatToggle = (selectedSeats) => {
    console.log("Selected seats:", selectedSeats);
  };
  const handleDeleteSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
    setCurrentSectionIndex(Math.min(index, updatedSections.length - 1));
  };
  console.log("sections", sections);
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
        <Stack
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            textAlign: "center",
          }}>
          <UniSlider
            sectionsGap={sectionsGap}
            setSectionsGap={setSectionsGap}
            title={"Space between sections"}
          />
        </Stack>
        <Stack direction="row" alignItems={"center"} spacing={2} mb={5}>
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
        <Stack
          direction="row"
          mt={2}
          columnGap={sectionsGap}
          rowGap={10}
          sx={{
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
          {sections.map((section, index) => (
            <Box key={index} sx={{ borderTop: `1px solid #888` }}>
              <Typography
                sx={{ transform: "translate(21px,-10px)", fontWeight: 300 }}>
                Section {section.sectionName}
              </Typography>
              <SeatLayout
                rows={section.rows}
                columns={section.columns}
                section={section}
                onSeatToggle={handleSeatToggle}
                onBulkSeatToggle={handleBulkSeatToggle}
                markAs={markAs}
                selectedSeat={selectedSeat}
                setSelectedSeat={setSelectedSeat}
                sectionsGap={sectionsGap}
                setSectionsGap={setSectionsGap}
                sections={sections}
                setSections={setSections}
                currentSectionIndex={currentSectionIndex}
                setCurrentSectionIndex={setCurrentSectionIndex}
                seatStatus={seatStatus}
                setSeatStatus={setSeatStatus}
              />
              <Stack mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => handleDeleteSection(index)}
                  color="error"
                  size="small"
                  sx={{ margin: "auto" }}>
                  <CloseIcon />
                </Button>
              </Stack>
            </Box>
          ))}
          {sections.length === 0 && (
            <NoDataMsg msg={"No Sections Yet in the room"} />
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default RoomSections;

// TODO add remove section
// TODO in the meeting: 1. display the sections array and the items of each section. 2. i will send the sections-gap to the backend
