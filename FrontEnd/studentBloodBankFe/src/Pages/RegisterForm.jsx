import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CollegeDropdown from "../components/CollegeDropdown";
import AddressDropdown from "../components/AddressDropdown";
import { motion } from "framer-motion";
import "../styles/RegisterForm.css";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    bloodGroup: "",
    contact: "",
    role: "",
    addressId: "",
    collegeid: null,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressSelect = (addressId) => {
    setFormData((prev) => ({ ...prev, addressId: parseInt(addressId) || "" }));
  };

  const handleCollegeSelect = (collegeid) => {
    console.log("Updating college ID:", collegeid); // Debugging log
    setFormData((prev) => ({ ...prev, collegeid: collegeid ? parseInt(collegeid) : null }));
  };

  // Hash password using SHA256 before sending to API
  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const finalData = {
      ...formData,
      password: formData.password, // Remove hashPassword function
      role: parseInt(formData.role, 10),
      addressId: formData.addressId ? parseInt(formData.addressId) : null,
      collegeid: formData.role === "3" ? formData.collegeid : null,
    };
  
  
    console.log("Final data being sent:", finalData);
  
    try {
      const response = await fetch("http://localhost:5005/api/UserMaster/PostDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
  
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
  
      let message;
      try {
        message = await response.json(); // Try parsing JSON
      } catch (error) {
        message = { message: "Unexpected response from the server." };
      }
  
      if (response.ok) {
        alert("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        alert(`Error: ${message.message || "Registration failed."}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Network error. Check API URL and CORS policy.");
    }
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="register-form-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 className="register-heading" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
        Register
      </motion.h2>

      <input name="userName" value={formData.userName} onChange={handleChange} placeholder="User Name" className="register-input full-width" required />
      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="register-input full-width" required />
      <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="register-input full-width" required />
      
      <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="register-input full-width" required>
        <option value="">Select Blood Group</option>
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
          <option key={group} value={group}>{group}</option>
        ))}
      </select>
      
      <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" className="register-input full-width" required />
      
      <select name="role" value={formData.role} onChange={handleChange} className="register-input full-width" required>
        <option value="">Select Role</option>
        <option value="2">User</option>
        <option value="3">Student</option>
      </select>
      
      <div className="register-dropdown full-width">
        <AddressDropdown onAddressSelect={handleAddressSelect} />
      </div>

      {formData.role === "3" && (
        <div className="register-dropdown full-width">
          <CollegeDropdown addressId={formData.addressId} onCollegeSelect={handleCollegeSelect} />
        </div>
      )}

      <motion.button className="register-button full-width" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="submit">
        Register
      </motion.button>
      
      <p className="login-text">Already registered? <span className="login-link" onClick={() => navigate("/login")}>Login here</span></p>
    </motion.form>
  );
};

export default RegisterForm;
