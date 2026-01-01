import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([
    { id: 1, date: "2024-02-15", bloodGroup: "A+", status: "Completed" },
    { id: 2, date: "2024-03-05", bloodGroup: "O-", status: "Completed" },
    { id: 3, date: "2024-03-20", bloodGroup: "B+", status: "Pending" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarHeading}>User Dashboard</h2>
        <ul style={styles.sidebarMenu}>
          <li style={styles.sidebarItem} onClick={() => navigate("/profile")}>Profile</li>
          <li style={styles.sidebarItem} onClick={() => navigate("/request-blood")}>Request Blood</li>
          <li style={styles.sidebarItem} onClick={() => navigate("/donation-history")}>Donation History</li>
          <li style={styles.sidebarItem} onClick={handleLogout}>Logout</li>
        </ul>
      </div>
      <div style={styles.mainContent}>
        <h1 style={styles.heading}>Donation History & Analysis</h1>
        <h2 style={styles.subHeading}>Past Blood Donations</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Blood Group</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.date}</td>
                <td>{donation.bloodGroup}</td>
                <td>{donation.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: "250px",
    background: "linear-gradient(to bottom, #16A085, #27AE60)",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 10px rgba(0, 0, 0, 0.2)",
  },
  sidebarHeading: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: "#ECF0F1",
  },
  sidebarMenu: {
    listStyle: "none",
    padding: 0,
  },
  sidebarItem: {
    padding: "12px 0",
    cursor: "pointer",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "0.3s",
  },
  mainContent: {
    flex: 1,
    textAlign: "center",
    padding: "50px 20px",
    background: "linear-gradient(to right,rgb(247, 79, 79), #27AE60)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    color: "#fff",
    fontSize: "2.5rem",
    marginBottom: "20px",
  },
  subHeading: {
    color: "#fff",
    fontSize: "2rem",
    marginBottom: "10px",
  },
  table: {
    width: "80%",
    borderCollapse: "collapse",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  th: {
    background: "#16A085",
    color: "white",
    padding: "12px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
  },
};

export default UserDashboard;
