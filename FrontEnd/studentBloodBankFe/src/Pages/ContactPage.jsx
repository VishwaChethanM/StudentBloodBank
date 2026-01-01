import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

const ContactPage = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div style={styles.contactContainer}>
      {/* Back to Home Button */}
      <button onClick={() => navigate("/")} style={styles.backButton}>
        ← Back to Home
      </button>

      <div style={styles.contactContent}>
        <h1 style={styles.heading}>Contact Us</h1>
        <p style={styles.paragraph}>We’d love to hear from you! Reach out to us for any queries or support.</p>
        
        <div style={styles.detailsContainer}>
          <div style={styles.detailBox}>
            <h2 style={styles.detailHeading}>📍 Our Location</h2>
            <p style={styles.detailText}>123 Blood Bank Street, City Name, Country</p>
          </div>
          
          <div style={styles.detailBox}>
            <h2 style={styles.detailHeading}>📞 Call Us</h2>
            <p style={styles.detailText}>+123 456 7890</p>
          </div>
          
          <div style={styles.detailBox}>
            <h2 style={styles.detailHeading}>📧 Email Us</h2>
            <p style={styles.detailText}>support@bloodbank.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  contactContainer: {
    textAlign: "center",
    padding: "50px 20px",
    background: "linear-gradient(to right, #ff4b2b, #ff416c)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "fixed", // Fix button position
    top: "20px",
    left: "20px",
    padding: "12px 18px",
    fontSize: "1rem",
    fontWeight: "bold",
    background: "#fff", // High contrast color
    color: "#ff4b2b",
    border: "2px solid #ff4b2b",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
    transition: "0.3s ease-in-out",
    zIndex: 1000, // Ensures it's above everything
  },
  contactContent: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "20px",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
  heading: {
    color: "#fff",
    fontSize: "2.5rem",
  },
  paragraph: {
    fontSize: "1.2rem",
    color: "#f1f1f1",
    marginBottom: "20px",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  detailBox: {
    background: "rgba(255, 255, 255, 0.2)",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    backdropFilter: "blur(5px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  detailHeading: {
    color: "#fff",
    fontSize: "1.5rem",
  },
  detailText: {
    color: "#f1f1f1",
    fontSize: "1.2rem",
  },
};

export default ContactPage;
