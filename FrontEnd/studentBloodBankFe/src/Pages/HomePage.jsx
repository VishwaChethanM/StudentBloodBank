import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundImg.jpg";
import foregroundImage from "../assets/Homepage.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const navbarHeight = "70px"; // Adjust according to Navbar height

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      {/* Background Image with Blur Effect */}
      <div style={styles.background}></div>

      {/* Overlay for Better Readability */}
      <div style={styles.overlay}></div>

      {/* Main Content */}
      <div style={styles.contentContainer}>
        {/* Left Side - Text Content */}
        <div style={styles.textContainer}>
          <h1 style={styles.heading}>Welcome to Blood Bank</h1>
          <p style={styles.paragraph}>
            Your one-stop solution for blood donations and requests.
          </p>
          <button style={styles.button} onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>

        {/* Right Side - Image (Moves below text on smaller screens) */}
        <div style={styles.imageContainer}>
          <img src={foregroundImage} alt="Blood Donation" style={styles.image} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowX: "hidden", // Prevents horizontal scrolling
    width: "100%",
  },
  background: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "blur(5px)", // Apply blur effect
    zIndex: -1,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.3)", // Dark overlay
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    textAlign: "left",
    paddingTop: "190px", // Space for Navbar
    display: "flex",
    flexDirection: "row", // Default: Side-by-side
    alignItems: "center",
    justifyContent: "space-between",
    color: "#fff",
    position: "relative",
    zIndex: 1,
    width: "100%",
    padding: "10% 10%",
    flexWrap: "wrap", // Wrap content when needed
  },
  textContainer: {
    width: "50%",
    minWidth: "300px",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  paragraph: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  button: {
    padding: "12px 20px",
    fontSize: "1.2rem",
    borderRadius: "8px",
    border: "none",
    background: "#ff512f",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  },
  imageContainer: {
    width: "50%",
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    order: 2, // Moves below text on smaller screens
  },
  image: {
    width: "100%",
    maxWidth: "750px",
    borderRadius: "10px",
  },
  footer: {
    background: "linear-gradient(to right, #ff512f, #dd2476)",
    color: "#fff",
    padding: "15px 0",
    textAlign: "center",
    width: "100%",
    position: "relative",
    bottom: 0,
    fontSize: "0.9rem",
  },
};

export default HomePage;
