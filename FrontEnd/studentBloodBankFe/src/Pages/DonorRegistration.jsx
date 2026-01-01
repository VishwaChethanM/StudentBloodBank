import React, { useState, useEffect } from "react";

const DonorRegistration = () => {
  const [formData, setFormData] = useState({
    userId: "",  // Auto-filled from login
    bloodGroup: "",
    age: "",
    lastDonationDate: "",
    availabilityStatus: true,
  });

  const [eligibilityMessage, setEligibilityMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch User ID from Authentication Context, Local Storage, or API
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser && storedUser.userId) {
      setFormData((prevData) => ({ ...prevData, userId: storedUser.userId }));
    } else {
      setError("User not logged in. Please log in first.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const checkEligibility = (date) => {
    if (!date) return "Please enter a valid date.";
    const lastDonation = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - lastDonation);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 90 ? "Eligible to donate." : `Not eligible. Must wait ${90 - diffDays} more days.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEligibilityMessage("");

    const eligibility = checkEligibility(formData.lastDonationDate);
    setEligibilityMessage(eligibility);

    if (!eligibility.includes("Eligible")) return;

    try {
      const response = await fetch("http://localhost:5268/api/DonorMaster/SaveDonor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.userId ? parseInt(formData.userId) : null,
          bloodGroup: formData.bloodGroup,
          age: parseInt(formData.age),
          lastDonationDate: formData.lastDonationDate || null,
          availabilityStatus: formData.availabilityStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ ...formData, bloodGroup: "", age: "", lastDonationDate: "", availabilityStatus: true });
      } else {
        setError(data.message || "Failed to register donor.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Donor Registration</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* User ID (Auto-filled) */}
        <input
          type="text"
          name="userId"
          value={formData.userId}
          readOnly
          style={{ ...styles.input, background: "#ccc" }} // Read-only styling
        />

        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required style={styles.input}>
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="date"
          name="lastDonationDate"
          value={formData.lastDonationDate}
          onChange={handleChange}
          style={styles.input}
        />
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="availabilityStatus"
            checked={formData.availabilityStatus}
            onChange={handleChange}
          />
          Available for Donation
        </label>
        <button type="submit" style={styles.button}>Register</button>
        {eligibilityMessage && <p style={styles.eligibilityMessage}>{eligibilityMessage}</p>}
        {submitted && <p style={styles.successMessage}>Registration successful!</p>}
        {error && <p style={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px 20px",
    background: "linear-gradient(to right, #1e3c72, #2a5298)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    color: "#fff",
    fontSize: "2.5rem",
    marginBottom: "20px",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    background: "rgba(255, 255, 255, 0.15)", // Glass effect
    padding: "30px",
    borderRadius: "15px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    width: "100%",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    fontSize: "1rem",
    background: "rgba(255, 255, 255, 0.3)",
    color: "#fff",
    textAlign: "center",
    outline: "none",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
    transition: "0.3s ease-in-out",
  },
  inputFocus: {
    border: "2px solid #fff",
  },
  checkboxLabel: {
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1rem",
  },
  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
    transition: "0.3s",
    textTransform: "uppercase",
    boxShadow: "0 5px 15px rgba(255, 75, 43, 0.3)",
  },
  buttonHover: {
    background: "linear-gradient(to right, #ff4b2b, #ff416c)",
    transform: "scale(1.05)",
  },
  eligibilityMessage: {
    color: "#fff",
    marginTop: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  successMessage: {
    color: "#4CAF50",
    marginTop: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    background: "#fff",
    padding: "8px",
    borderRadius: "5px",
  },
  errorMessage: {
    color: "#ff4d4d",
    marginTop: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    background: "#fff",
    padding: "8px",
    borderRadius: "5px",
  },
};


export default DonorRegistration;
