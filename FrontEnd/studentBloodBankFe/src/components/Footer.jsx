import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3>Contact Us</h3>
          <p>Email: support@bloodbank.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 123 Blood Drive, City, Country</p>
        </div>
        
        <div style={styles.section}>
          <h3>Follow Us</h3>
          <div style={styles.socialIcons}>
            <a href="#" style={styles.icon}>📘</a>
            <a href="#" style={styles.icon}>🐦</a>
            <a href="#" style={styles.icon}>📸</a>
          </div>
        </div>
        
        <div style={styles.section}>
          <h3>Quick Links</h3>
          <Link to="/privacy-policy" style={styles.link}>Privacy Policy</Link>
          <Link to="/terms" style={styles.link}>Terms of Service</Link>
        </div>
      </div>
      <div style={styles.copyright}>
        &copy; {new Date().getFullYear()} Blood Bank. All Rights Reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "linear-gradient(to right, #ff512f, #dd2476)",
    color: "#fff",
    padding: "10px 0", // Reduced padding for smaller height
    textAlign: "center",
    width: "100%", // Matches Navbar width
    position: "relative",
    bottom: 0,
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    padding: "0 20px",
  },
  section: {
    marginBottom: "10px", // Reduced spacing for compact look
  },
  socialIcons: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  icon: {
    fontSize: "1.3rem", // Slightly reduced icon size
    textDecoration: "none",
    color: "#fff",
    transition: "0.3s",
  },
  link: {
    display: "block",
    color: "#fff",
    textDecoration: "none",
    marginTop: "3px", // Reduced margin for compact view
  },
  copyright: {
    marginTop: "10px",
    fontSize: "0.8rem",
  },
};

export default Footer;
