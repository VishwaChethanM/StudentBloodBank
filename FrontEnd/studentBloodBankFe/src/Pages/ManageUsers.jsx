import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/UserMaster/GetUserDetails");
      console.log("Fetched users:", response.data);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleUserAction = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5268/api/UserMaster/UpdateUser/${id}`, {
        status: newStatus,
      });
      if (response.status === 200 || response.status === 204) { // 204 No Content is also common for successful PUT
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            // Ensure this uses userId for comparison as well if your local state objects are consistent
            user.userId === id ? { ...user, status: newStatus } : user
          )
        );
        console.log(`User ${id} updated to ${newStatus}`);
      } else {
        // If status is not 200/204 but still a response was received
        console.error("Failed to update user status. Server response status:", response.status);
        console.error("Server response data:", response.data);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      // Log the detailed error response from the server
      if (error.response) {
        console.error("Server responded with error status:", error.response.status);
        console.error("Server error data:", error.response.data);
        console.error("Server error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        console.error("No response received from server. Request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
      }
    }
  };

  // Filter counts
  const activeUsers = users.filter(user => user.status?.toLowerCase() === "active").length;
  const pendingUsers = users.filter(user => user.status?.toLowerCase() === "pending").length;
  const removedUsers = users.filter(user => user.status?.toLowerCase() === "removed").length;

  const filteredUsers = users.filter(user => {
    if (filter === "All") return true;
    return user.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Manage Users</h1>

      <div style={styles.statsContainer}>
        <div style={{ ...styles.statCard, background: "#4CAF50" }}>
          <h2>{activeUsers}</h2>
          <p>Active Users</p>
        </div>
        <div style={{ ...styles.statCard, background: "#FFA500" }}>
          <h2>{pendingUsers}</h2>
          <p>Pending Users</p>
        </div>
        <div style={{ ...styles.statCard, background: "#FF4B5C" }}>
          <h2>{removedUsers}</h2>
          <p>Removed Users</p>
        </div>
      </div>

      <div style={styles.filterButtons}>
        {["All", "Active", "Pending", "Removed"].map((status) => (
          <button
            key={status}
            style={{
              ...styles.filterButton,
              backgroundColor: filter === status ? "#ffffff" : "transparent",
              color: filter === status ? "#1e3c72" : "#ffffff",
              fontWeight: filter === status ? "bold" : "normal",
            }}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <h2 style={{ color: "white", marginTop: "20px" }}>Loading users...</h2>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Blood Group</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              // CORRECTED: Use user.userId for the key prop
              <tr key={user.userId}>
                <td style={styles.td}>{user.userName}</td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>{user.bloodGroup}</td>
                <td style={styles.td}>{user.contact}</td>
                <td style={styles.td}>
                  {user.status?.toLowerCase() === "pending" && (
                    <button
                      style={{ ...styles.button, background: "#4CAF50" }}
                      // CORRECTED: Pass user.userId to handleUserAction
                      onClick={() => handleUserAction(user.userId, "Active")}
                    >
                      Approve
                    </button>
                  )}
                  {user.status?.toLowerCase() !== "removed" && (
                    <button
                      style={{ ...styles.button, background: "#FF4B5C" }}
                      // CORRECTED: Pass user.userId to handleUserAction
                      onClick={() => handleUserAction(user.userId, "Removed")}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    color: "#ffffff",
    fontSize: "2.8rem",
    marginBottom: "20px",
    fontWeight: "700",
    letterSpacing: "1px",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  statCard: {
    padding: "20px 30px",
    borderRadius: "20px",
    color: "#fff",
    width: "220px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
    transition: "transform 0.3s",
  },
  filterButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  filterButton: {
    padding: "10px 20px",
    borderRadius: "30px",
    border: "2px solid white",
    background: "transparent",
    color: "#ffffff",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  table: {
    width: "95%",
    maxWidth: "1100px",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    background: "transparent",
    marginTop: "10px",
  },
  th: {
    background: "rgba(0, 0, 50, 0.9)",
    color: "#ffffff",
    padding: "14px 20px",
    fontSize: "1.05rem",
    borderRadius: "10px 10px 0 0",
  },
  td: {
    padding: "14px 20px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
    color: "#e0e0e0",
    fontSize: "1rem",
    borderBottom: "2px solid transparent",
    borderRadius: "10px",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    fontSize: "0.95rem",
    margin: "5px",
    color: "#ffffff",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default ManageUsers;