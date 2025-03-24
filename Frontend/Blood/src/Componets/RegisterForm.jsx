import React, { useState } from 'react';
import CollegeDropdown from './CollegeDropdown';
import AddressDropdown from './AddressDropdown';
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    bloodGroup: '',
    contact: '',
    role: '',
    addressId: '',
    collegeid: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressSelect = (addressId) => {
    setFormData(prev => ({ ...prev, addressId }));
  };

  const handleCollegeSelect = (collegeid) => {
    setFormData(prev => ({ ...prev, collegeid }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('https://localhost:7140/api/UserMaster/PostDetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (res.ok) {
          alert('User registered successfully!');
          setFormData({
            userName: '',
            email: '',
            password: '',
            bloodGroup: '',
            contact: '',
            role: '',
            addressId: '',
            collegeid: ''
          });
        } else {
          return res.text().then(msg => { throw new Error(msg); });
        }
      })
      .catch(error => alert(`Error: ${error.message}`));
  };

  return (
    <form onSubmit={handleSubmit} className="register-form-container">
      <h2>Register</h2>
      <input
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        placeholder="User Name"
        className="register-input"
        required
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="register-input"
        required
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="register-input"
        required
      />

      {/* Blood Group Dropdown */}
      <select
        name="bloodGroup"
        value={formData.bloodGroup}
        onChange={handleChange}
        className="register-input"
        required
      >
        <option value="">Select Blood Group</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>

      <input
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        placeholder="Contact  (+91**********)"
        className="register-input"
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="register-input"
        >
        <option value="">Select Your role</option>
        <option value={1}>User</option>
        <option value={2}>Admin</option>
        <option value={3}>Donor</option>

      </select>

      <div className="register-dropdown">
        <AddressDropdown onSelect={handleAddressSelect} />
      </div>
      <div className="register-dropdown">
        <CollegeDropdown onSelect={handleCollegeSelect} />
      </div>

      <button type="submit" className="register-button">
        Register
      </button>
    </form>

  );
};
export default RegisterForm;
