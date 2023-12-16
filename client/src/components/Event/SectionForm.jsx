import React, { useState } from 'react';

const SectionForm = ({ onSave }) => {
  const [sectionName, setSectionName] = useState('');
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);

  const handleSave = () => {
    // Validate that all fields are filled
    if (sectionName && rows > 0 && columns > 0) {
      onSave({ sectionName, rows, columns });
    } else {
      alert('Please enter valid values for all fields.');
    }
  };

  return (
    <div>
      <h2>Set the Size of a Section</h2>
      <form>
        <label>
          Section Name:
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Rows:
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value, 10))}
          />
        </label>
        <br />
        <label>
          Columns:
          <input
            type="number"
            value={columns}
            onChange={(e) => setColumns(parseInt(e.target.value, 10))}
          />
        </label>
        <br />
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
};

export default SectionForm;
