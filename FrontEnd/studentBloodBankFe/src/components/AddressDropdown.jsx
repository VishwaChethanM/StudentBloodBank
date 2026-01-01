import { useState, useEffect } from "react";
import axios from "axios";

const AddressDropdown = ({ onAddressSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // REPLACE line 18 in AddressDropdown.jsx with this:
const response = await axios.get('http://localhost:5005/api/AddressMaster/GetAddressDetails');
        const validAddresses = response.data.filter(address => address.addressId !== 0);
        
        setAddresses(validAddresses);

        // Extract unique localities
        const uniqueLocalities = [...new Set(validAddresses.map(address => address.locality))];
        setLocalities(uniqueLocalities);
      } catch (error) {
        console.error("Error fetching addresses:", error.response || error);
        setError("Failed to load addresses. Please try again.");
      }
    };

    fetchAddresses();
  }, []);

  // Handle Locality Change
  const handleLocalityChange = (e) => {
    const locality = e.target.value;
    setSelectedLocality(locality);
    setSelectedArea(""); // Reset area when locality changes

    // Filter areas based on selected locality
    const filteredAreas = addresses
      .filter(address => address.locality === locality)
      .map(address => address.area);
    
    setAreas([...new Set(filteredAreas)]);
  };

  // Handle Area Change
  const handleAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);

    // Find the selected address ID
    const selectedAddress = addresses.find(address => address.locality === selectedLocality && address.area === area);
    if (selectedAddress && onAddressSelect) {
      onAddressSelect(selectedAddress.addressId);
    }
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={styles.label}>Select Locality:</label>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <select style={styles.select} value={selectedLocality} onChange={handleLocalityChange}>
        <option value="">Select a Locality</option>
        {localities.map((locality, index) => (
          <option key={index} value={locality}>{locality}</option>
        ))}
      </select>

      <label style={styles.label}>Select Area:</label>
      <select style={styles.select} value={selectedArea} onChange={handleAreaChange} disabled={!selectedLocality || areas.length === 0}>
        <option value="">Select an Area</option>
        {areas.map((area, index) => (
          <option key={index} value={area}>{area}</option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold"
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    marginBottom: "10px",
    boxSizing: "border-box"
  }
};

export default AddressDropdown;
