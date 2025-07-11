import React, { useState } from "react";
import { Modal, Button, IconButton, Grid, Box, Stack } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import stage1 from "../../assets/images/icons/stage1.png";
import stage2 from "../../assets/images/icons/stage2.png";
import "./Style.scss"; // Import your CSS file for styling

const SeatLayout = ({
  rows,
  columns,
  section,
  onSeatToggle,
  onBulkSeatToggle,
  markAs,
  selectedSeat,
  setSelectedSeat,
  sections,
  setSections,
  currentSectionIndex,
  setCurrentSectionIndex,
  seatStatus,
  setSeatStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSeatClick = (row, col) => {
    const seatKey = `${row}-${col}`;
    setSelectedSeat(seatKey);
  
    // Find the index of the current section based on the seat's ID
    const currSectionIndex = sections.findIndex((item) => item.id === section.id);
    setCurrentSectionIndex(currSectionIndex);
  
    // Use the "items" array to determine the type of the clicked seat
    const seatType = sections[currSectionIndex]?.items[row - 1][col - 1];
  
    // Update the "items" array of the current section to reflect the selected value
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const currentSection = updatedSections[currSectionIndex];
  
      if (currentSection) {
        const updatedItems = currentSection.items.map((rowArray, rowIndex) =>
          rowArray.map((colValue, colIndex) =>
            rowIndex === row - 1 && colIndex === col - 1 ? +markAs : colValue
          )
        );
  
        currentSection.items = updatedItems;
      }
  
      return updatedSections;
    });
  
    // Delayed update to ensure currentSectionIndex is updated
    setTimeout(() => {
      onSeatToggle(row, col, seatType !== markAs);
      setSeatStatus((prevStatus) => ({
        ...prevStatus,
        [seatKey]: markAs,
      }));
    }, 0);
  };
  
  const handleOpenModal = (status) => {
    setIsModalOpen(true);
    setSelectedStatus(status);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSetStatus = () => {
    if (selectedSeat) {
      const [row, col] = selectedSeat.split("-").map(Number);
      onBulkSeatToggle(row, row, col, col, selectedStatus);
      setSeatStatus((prevStatus) => ({
        ...prevStatus,
        [selectedSeat]: selectedStatus === "occupied",
      }));
    }
    setSelectedSeat(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Stack>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Grid container key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Grid item key={colIndex}>
                <IconButton
                  onClick={() => handleSeatClick(rowIndex + 1, colIndex + 1)}
                  className={`${
                    section.items[rowIndex]?.[colIndex] === 1 ? "selected" : ""
                  }`}
                  sx={{ marginY: 1, marginX: 1 }}>
                  {section.items[rowIndex]?.[colIndex] === 1 ? (
                    <EventSeatIcon />
                  ) : section.items[rowIndex]?.[colIndex] === 0 ? (
                    <img src={stage1} alt="stage1" width={19} />
                  ) : section.items[rowIndex]?.[colIndex] === -1 ? (
                    <EventSeatIcon sx={{ color: "transparent" }} />
                  ) : (
                    <EventSeatIcon sx={{ color: "white" }} />
                  )}
                </IconButton>
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="modal-content">
          <h2>Set Status for Selected Seat</h2>
          <form>
            <label htmlFor="statusSelect">Select Status:</label>
            <select
              id="statusSelect"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="occupied">Occupied</option>
              <option value="empty">Empty</option>
            </select>
            <Button type="button" onClick={handleSetStatus}>
              Set Status
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default SeatLayout;
