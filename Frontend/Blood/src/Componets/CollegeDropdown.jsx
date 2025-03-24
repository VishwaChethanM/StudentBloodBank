import React, { useEffect, useState } from 'react';

const CollegeDropdown = ({ onSelect }) => {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7140/api/CollegeMaster/GetCollegeDetails')
      .then(response => response.json())
      .then(data => setColleges(data))
      .catch(error => console.error('Error fetching colleges:', error));
  }, []);

  return (
    <select onChange={(e) => onSelect(e.target.value)} className="p-2 rounded border">
      <option value="">Select College</option>
      {colleges.map(college => (
        <option key={college.collegeID} value={college.collegeID}>
          {college.collegeName} ({college.locality}, {college.area})
        </option>
      ))}
    </select>
  );
};

export default CollegeDropdown;
