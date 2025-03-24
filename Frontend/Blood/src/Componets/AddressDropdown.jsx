import React, { useEffect, useState } from 'react';
const AddressDropdown = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7140/api/AddressMaster/GetAddressDetails')
      .then(response => response.json())
      .then(data => setAddresses(data))
      .catch(error => console.error('Error fetching addresses:', error));
  }, []);

  return (
    <select onChange={(e) => onSelect(e.target.value)} className="p-2 rounded border">
      <option value="">Select Address</option>
      {addresses.map(address => (
        <option key={address.addressId} value={address.addressId}>
          {address.locality}, {address.area}
        </option>
      ))}
    </select>
  );
};

export default AddressDropdown;
