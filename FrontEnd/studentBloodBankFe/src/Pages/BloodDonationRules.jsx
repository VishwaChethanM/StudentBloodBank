import React from "react";

const BloodDonationRules = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Blood Donation Rules</h1>
      
      <div style={styles.rulesContainer}>
        <div style={styles.rulesCard}>
          <h2 style={styles.subHeading}>Eligibility Criteria</h2>
          <ul style={styles.list}>
            <li>Must be between 18-65 years old.</li>
            <li>Minimum weight of 50 kg (110 lbs).</li>
            <li>Should be in good health without any infections.</li>
            <li>No recent surgeries or blood transfusions in the past 6 months.</li>
            <li>Must not have donated blood in the last 90 days.</li>
          </ul>
        </div>
        
        <div style={styles.rulesCard}>
          <h2 style={styles.subHeading}>Donation Process</h2>
          <ul style={styles.list}>
            <li>Register at the nearest blood donation center.</li>
            <li>Undergo a quick health checkup.</li>
            <li>Donate blood (takes around 10-15 minutes).</li>
            <li>Rest for a few minutes and have refreshments.</li>
            <li>Avoid heavy lifting and stay hydrated for the next 24 hours.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px 20px",
    background: "linear-gradient(to right, #ff512f, #dd2476)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  heading: {
    fontSize: "2.8rem",
    marginBottom: "30px",
    fontWeight: "bold",
  },
  rulesContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  rulesCard: {
    background: "rgba(255, 255, 255, 0.3)",
    padding: "25px",
    borderRadius: "15px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    maxWidth: "550px",
    width: "100%",
  },
  subHeading: {
    fontSize: "1.8rem",
    marginBottom: "15px",
    fontWeight: "600",
  },
  list: {
    textAlign: "left",
    paddingLeft: "25px",
    fontSize: "1.2rem",
    lineHeight: "1.6",
  },
};

export default BloodDonationRules;
