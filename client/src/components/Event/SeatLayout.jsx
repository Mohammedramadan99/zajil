import React, { useState, useRef } from "react";
import { Modal, Button } from "@mui/material";
import "./Style.scss"; // Import your CSS file for styling
// ...

const SeatLayout = ({ rows, columns, onSeatToggle, onBulkSeatToggle }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isSettingStatus, setIsSettingStatus] = useState(false);
    const startSeatRef = useRef(null);
  
    const handleSeatClick = (row, col) => {
      const seatKey = `${row}-${col}`;
      const isSelected = selectedSeats.includes(seatKey);
      const updatedSeats = isSelected
        ? selectedSeats.filter((seat) => seat !== seatKey)
        : [...selectedSeats, seatKey];
  
      setSelectedSeats(updatedSeats);
      onSeatToggle(row, col, !isSelected);
    };
  
    const handlePointerDown = (row, col) => {
      if (!isModalOpen && !isSettingStatus) {
        startSeatRef.current = { row, col };
      }
    };
  
    const handlePointerUp = () => {
      if (!isModalOpen && !isSettingStatus) {
        const { row: startRow, col: startCol } = startSeatRef.current || {};
        const { row: endRow, col: endCol } = selectedSeats.reduce(
          (acc, seat) => {
            const [row, col] = seat.split("-").map(Number);
            return {
              row: Math.max(acc.row, row),
              col: Math.max(acc.col, col),
            };
          },
          { row: 0, col: 0 }
        );
  
        onBulkSeatToggle(startRow, endRow, startCol, endCol, selectedStatus);
  
        setSelectedSeats([]);
        startSeatRef.current = null;
        setIsSettingStatus(true); // Enter "setting status" mode
      }
    };
  
    const handlePointerMove = (row, col) => {
      if (!isModalOpen && !isSettingStatus && startSeatRef.current) {
        const { row: startRow, col: startCol } = startSeatRef.current;
        const newSelectedSeats = [];
  
        for (let i = Math.min(startRow, row); i <= Math.max(startRow, row); i++) {
          for (let j = Math.min(startCol, col); j <= Math.max(startCol, col); j++) {
            newSelectedSeats.push(`${i}-${j}`);
          }
        }
  
        setSelectedSeats(newSelectedSeats);
      }
    };
  
    const handleOpenModal = (status) => {
      setIsModalOpen(true);
      setSelectedStatus(status);
      setIsSettingStatus(false); // Exit "setting status" mode
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  
    React.useEffect(() => {
      if (selectedSeats.length > 0) {
        handleOpenModal(selectedStatus);
      }
    }, [selectedSeats, selectedStatus]);
  
    return (
      <div>
        <h3>Seat Layout</h3>
        <div className="grid-container" onPointerUp={handlePointerUp}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  onPointerDown={() => handlePointerDown(rowIndex + 1, colIndex + 1)}
                  onPointerMove={() => handlePointerMove(rowIndex + 1, colIndex + 1)}
                  onClick={() => handleSeatClick(rowIndex + 1, colIndex + 1)}
                  className={`grid-cell ${
                    selectedSeats.includes(`${rowIndex + 1}-${colIndex + 1}`) && !isSettingStatus
                      ? `selected`
                      : ""
                  }`}
                >
                  {`${rowIndex + 1}-${colIndex + 1}`}
                </div>
              ))}
            </div>
          ))}
        </div>
  
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div className="modal-content">
            <h2>Set Status for Selected Seats</h2>
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
              <Button type="button" onClick={handleCloseModal}>
                Close
              </Button>
            </form>
          </div>
        </Modal>
      </div>
    );
  };
  
  export default SeatLayout;
  