import React, { useState } from "react";
import { Modal, Button, IconButton, Grid } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import "./Style.scss"; // Import your CSS file for styling

const SeatLayout = ({ rows, columns, onSeatToggle, onBulkSeatToggle }) => {
  const [seatStatus, setSeatStatus] = useState({}); // Object to store seat status
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSeatClick = (row, col) => {
    const seatKey = `${row}-${col}`;
    setSelectedSeat(seatKey);
    onSeatToggle(row, col, !seatStatus[seatKey]); // Toggle the seat status
    setSeatStatus((prevStatus) => ({
      ...prevStatus,
      [seatKey]: !prevStatus[seatKey],
    }));
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
    <div>
      <div className="grid-container">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Grid container key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Grid item key={colIndex}>
                <IconButton
                  onClick={() => handleSeatClick(rowIndex + 1, colIndex + 1)}
                  className={`${
                    seatStatus[`${rowIndex + 1}-${colIndex + 1}`] ? "selected" : ""
                  }`}
                  sx={{ marginY: 1, marginX: 1 }}
                >
                  <EventSeatIcon />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        ))}
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="modal-content">
          <h2>Set Status for Selected Seat</h2>
          <form>
            <label htmlFor="statusSelect">Select Status:</label>
            <select
              id="statusSelect"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
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
    </div>
  );
};

export default SeatLayout;
