import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

const AboutPage = () => {
  const [donors, setDonors] = useState(0);
  const [requests, setRequests] = useState(0);
  const [hospitals, setHospitals] = useState(0);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const animateCounters = (setter, target) => {
      let count = 0;
      const interval = setInterval(() => {
        count += Math.ceil(target / 50);
        if (count >= target) {
          count = target;
          clearInterval(interval);
        }
        setter(count);
      }, 30);
    };

    animateCounters(setDonors, 5000);
    animateCounters(setRequests, 12000);
    animateCounters(setHospitals, 300);
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Back to Home Button */}
      <button onClick={() => navigate("/")} style={styles.backButton}>
        ← Back to Home
      </button>

      <div style={styles.aboutContainer}>
        <div style={styles.aboutContent}>
          <h1 style={styles.heading}>About Our Blood Bank</h1>
          <p style={styles.paragraph}>
            We are dedicated to saving lives by connecting blood donors with those in need.
            Our mission is to ensure a stable and safe blood supply for hospitals and emergency cases.
          </p>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>{donors}+</h2>
            <p style={styles.statText}>Registered Donors</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>{requests}+</h2>
            <p style={styles.statText}>Blood Requests Fulfilled</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>{hospitals}+</h2>
            <p style={styles.statText}>Hospitals Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
    paddingTop: "200px",
    position: "relative",
  },
  backButton: {
    position: "fixed", // Always visible
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
  aboutContainer: {
    textAlign: "center",
    padding: "50px 20px",
    flex: 1, // Allows the content to expand
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  aboutContent: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "20px",
    maxWidth: "600px",
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
  },
  statsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "40px",
    flexWrap: "wrap",
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.2)",
    padding: "20px",
    borderRadius: "15px",
    width: "180px",
    textAlign: "center",
    backdropFilter: "blur(5px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  statNumber: {
    color: "#fff",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  statText: {
    color: "#f1f1f1",
    fontSize: "1rem",
  },
};

export default AboutPage;
