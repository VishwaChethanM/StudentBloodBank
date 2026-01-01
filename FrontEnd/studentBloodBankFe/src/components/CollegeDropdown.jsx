import { useState, useEffect } from "react";
import axios from "axios";

const CollegeDropdown = ({ addressId,onCollegeSelect }) => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");

  useEffect(() => {
    if (addressId) {
      axios.get("http://localhost:5005/api/CollegeMaster/GetCollegeDetails")
        .then(response => {
          const filteredColleges = response.data.filter(college => college.addressId === addressId);
          setColleges(filteredColleges);
        })
        .catch(error => console.error("Error fetching colleges:", error));
    }
  }, [addressId]);

  const handleCollegeChange = (e) => {
    const selectedCollegeId = e.target.value ? parseInt(e.target.value) : null;
    console.log("Selected College ID:", selectedCollegeId);
    setSelectedCollege(selectedCollegeId);
    onCollegeSelect(selectedCollegeId);
    if (onCollegeSelect) { // ✅ Check if onCollegeSelect is defined before calling
      onCollegeSelect(selectedCollegeId);
    }
  };
  

  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        Select College:
      </label>
      <select
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px"
        }}
        value={selectedCollege}
        onChange={handleCollegeChange}
        disabled={colleges.length === 0}
      >
        <option value="">Select a College</option>
        {colleges.map(college => (
          <option key={college.collegeID} value={college.collegeID}>
            {college.collegeName} ({college.locality} - {college.area})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CollegeDropdown;
