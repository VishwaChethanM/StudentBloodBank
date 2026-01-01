import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = sessionStorage.getItem("adminId") || 1; // fallback id

    axios.get(`http://localhost:5005/api/UserMaster/${adminId}`)
      .then((response) => setAdminProfile(response.data))
      .catch((error) => console.error("Error fetching admin details:", error));

    axios.get("http://localhost:5005/api/Admin/Users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.dashboardContainer}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarHeading}>Admin Panel</h2>
        <ul style={styles.sidebarMenu}>
          <li style={styles.sidebarItem} onClick={() => navigate("/manage-users")}>Manage Users</li>
          <li style={styles.sidebarItem} onClick={() => navigate("/manage-requests")}>Accept/Reject Blood Requests</li>
          <li style={styles.sidebarItem} onClick={() => navigate("/manage-donations")}>Manage Donations</li>
          <li style={styles.sidebarItem} onClick={() => navigate("/donation-history")}>Reports & Analytics</li>
          <li style={{ ...styles.sidebarItem, background: "#ff4b5c" }} onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      <main style={styles.mainContent}>
        {adminProfile ? (
          <h1 style={styles.heading}>Welcome, {adminProfile.name}</h1>
        ) : (
          <h1 style={styles.heading}>Loading Admin Details...</h1>
        )}

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>{users.length}</h2>
            <p style={styles.statText}>Total Users</p>
          </div>
          {/* Future cards can go here */}
        </div>
      </main>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
  },
  sidebar: {
    width: "260px",
    background: "rgba(0, 0, 50, 0.9)",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    borderTopRightRadius: "20px",
    borderBottomRightRadius: "20px",
    boxShadow: "2px 0px 10px rgba(0,0,0,0.3)",
  },
  sidebarHeading: {
    fontSize: "2rem",
    marginBottom: "30px",
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "2px solid #fff",
    paddingBottom: "10px",
  },
  sidebarMenu: {
    listStyleType: "none",
    padding: 0,
    marginTop: "30px",
  },
  sidebarItem: {
    padding: "15px 20px",
    margin: "10px 0",
    borderRadius: "12px",
    cursor: "pointer",
    background: "rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    fontSize: "1.1rem",
    fontWeight: "500",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    padding: "50px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    overflowY: "auto",
  },
  heading: {
    fontSize: "2.8rem",
    marginBottom: "40px",
    background: "linear-gradient(to right, #ff512f, #dd2476)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  statsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "30px",
    width: "100%",
    maxWidth: "1000px",
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.2)",
    padding: "40px 30px",
    borderRadius: "20px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
    transition: "transform 0.3s ease, background 0.3s ease",
    width: "280px",
    cursor: "pointer",
  },
  statNumber: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  statText: {
    fontSize: "1.2rem",
    letterSpacing: "1px",
  },
};

export default AdminDashboard;
