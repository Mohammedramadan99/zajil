import React, { useState } from 'react';
import SectionForm from './SectionForm';
import SeatLayout from './SeatLayout';

const RoomSections = () => {
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const handleSectionSave = (section) => {
    setSections([...sections, section]);
    setCurrentSectionIndex(sections.length);
  };

  const handleSeatToggle = (row, col, isSelected) => {
    // Update the seat status in the current section
    const updatedSections = [...sections];
    const currentSection = updatedSections[currentSectionIndex];
    currentSection.seats = currentSection.seats || {};
    currentSection.seats[`${row}-${col}`] = isSelected;

    setSections(updatedSections);
  };

  

  const handleFinish = () => {
    // Send all section information to the backend or perform any necessary actions
    console.log('All sections saved:', sections);
  };
  const handleBulkSeatToggle = (selectedSeats) => {
    // Do something with the selected seats, e.g., update the UI or send to the backend
    console.log('Selected seats:', selectedSeats);
  };
  return (
    <div>
      <h1>Admin Panel</h1>
      {sections.map((section, index) => (
        <div key={index}>
          <h3>Section {index + 1}</h3>
          <p>Name: {section.sectionName}</p>
          <p>Rows: {section.rows}</p>
          <p>Columns: {section.columns}</p>
          <SeatLayout
            rows={section.rows}
            columns={section.columns}
            onSeatToggle={handleSeatToggle}
            onBulkSeatToggle={handleBulkSeatToggle}
          />
        </div>
      ))}
      <SectionForm onSave={handleSectionSave} />
      <button type="button" onClick={handleFinish}>
        Finish
      </button>
    </div>
  );
};

export default RoomSections;
