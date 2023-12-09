// RoomSquare.js

import React, { useState } from "react";
import { createSelectable } from "react-selectable-fast";

const RoomSquare = ({ selectableRef, squareData, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(squareData.option);
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    const newOption = prompt('Select an option: seat, theater, empty');
    setSelectedOption(newOption);
    onSelect(squareData.id, newOption);
  };

  return (
    <div
      ref={selectableRef}
      className={`room-square ${selectedOption} ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
      onMouseDown={() => setIsSelected(true)}
      onMouseUp={() => setIsSelected(false)}
    >
      <span>{squareData.id}</span>
    </div>
  );
};

export default createSelectable(RoomSquare);
