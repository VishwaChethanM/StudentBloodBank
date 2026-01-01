import React, { useState, useEffect } from "react";
import axios from "axios";

// Simple Modal Component for alerts and confirmations
const CustomModal = ({ message, onConfirm, onCancel, type }) => {
  if (!message) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <p style={modalStyles.message}>{message}</p>
        {type === "confirm" ? (
          <div style={modalStyles.buttonContainer}>
            <button style={modalStyles.confirmButton} onClick={onConfirm}>
              Confirm
            </button>
            <button style={modalStyles.cancelButton} onClick={onCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <div style={modalStyles.buttonContainer}>
            <button style={modalStyles.okButton} onClick={onConfirm}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    maxWidth: "400px",
    width: "90%",
    animation: "fadeIn 0.3s ease-out",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    color: "#333",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  confirmButton: {
    padding: "10px 25px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#e60000",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  cancelButton: {
    padding: "10px 25px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
    color: "#333",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  okButton: {
    padding: "10px 25px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    type: "alert", // 'alert' or 'confirm'
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5268/api/UserMaster/GetUserDetails");
      // Assuming 'GetUserDetailsDto' now includes a 'Status' property
      // If not, you'll need to modify your C# DTO and stored procedure.
      // For demonstration, let's assume a default status if not present.
      const usersWithStatus = response.data.map(user => ({
        ...user,
        // Default status if not provided by backend, adjust as per your actual data
        status: user.status || (user.role === "Donor" ? "Active" : "Pending") // Example default
      }));
      setUsers(usersWithStatus);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please ensure the backend is running and accessible.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper to calculate counts based on a 'status' field
  const getCounts = () => {
    const active = users.filter(user => user.status === "Active").length;
    const pending = users.filter(user => user.status === "Pending").length;
    const removed = users.filter(user => user.status === "Removed").length; // Assuming 'Removed' status for soft deletes
    return { active, pending, removed };
  };

  const { active, pending, removed } = getCounts();

  // Show modal
  const showModal = (message, type, onConfirm, onCancel = () => {}) => {
    setModal({ isOpen: true, message, type, onConfirm, onCancel });
  };

  // Close modal
  const closeModal = () => {
    setModal({ isOpen: false, message: "", type: "alert", onConfirm: () => {}, onCancel: () => {} });
  };

  // Handle Approve/Remove actions
  const handleUserAction = async (id, actionType) => {
    try {
      if (actionType === "Approved") {
        const userToUpdate = users.find(u => u.userId === id);
        if (!userToUpdate) {
          showModal("User not found for approval.", "alert", closeModal);
          return;
        }

        // Construct updatedUserData to match UserMaster properties expected by sp_UpdateUserProfile
        // Ensure all required fields for UserMaster are present.
        // If UserMaster has a non-nullable 'Password' field, and it's not included here,
        // the backend model binding will fail. You might need to make Password nullable
        // in your C# UserMaster model, or fetch the existing password hash if needed.
        const updatedUserData = {
          userId: userToUpdate.userId, // Although in URL, often good to include in body
          userName: userToUpdate.userName,
          email: userToUpdate.email,
          bloodGroup: userToUpdate.bloodGroup,
          contact: userToUpdate.contact, // Maps to @Phone in sp_UpdateUserProfile
          addressId: userToUpdate.addressId, // Maps to @Address in sp_UpdateUserProfile
          role: userToUpdate.role, // Include if UserMaster requires it and it's not changing
          collegeid: userToUpdate.collegeid, // Include if UserMaster requires it
          createdDateTime: userToUpdate.createdDateTime, // Include if UserMaster requires it
          // If you intend to update the 'status' in the database via sp_UpdateUserProfile,
          // ensure UserMaster has a 'Status' property and sp_UpdateUserProfile processes it.
          // For now, I'm setting it to 'Active' for UI update.
          status: "Active" // This is for local UI update and if backend can handle it
        };

        console.log("Sending data for approval:", updatedUserData); // Log the payload

        // Use axios.put as your C# controller has [HttpPut("UpdateUser/{id}")]
        await axios.put(`http://localhost:5268/api/UserMaster/UpdateUser/${id}`, updatedUserData);

        // Update UI locally
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.userId === id ? { ...u, status: "Active" } : u // Update status to 'Active'
          )
        );
        showModal("User approved successfully!", "alert", closeModal);

      } else if (actionType === "Removed") {
        showModal(
          "Are you sure you want to permanently remove this user?",
          "confirm",
          async () => {
            closeModal(); // Close confirmation modal first
            try {
              // Call the DELETE endpoint for removal
              await axios.delete(`http://localhost:5005/api/UserMaster/DeleteUser/${id}`);

              // Update UI locally by filtering out the removed user
              setUsers((prevUsers) => prevUsers.filter((u) => u.userId !== id));
              showModal("User removed successfully!", "alert", closeModal);
            } catch (innerErr) {
              console.error(`Error deleting user ID ${id}:`, innerErr);
              if (innerErr.response) {
                showModal(`Failed to remove user: ${innerErr.response.data || innerErr.response.statusText}`, "alert", closeModal);
              } else if (innerErr.request) {
                showModal("Failed to remove user: No response from server. Check network.", "alert", closeModal);
              } else {
                showModal("Failed to remove user: An unexpected error occurred.", "alert", closeModal);
              }
            }
          },
          closeModal // On cancel, just close the modal
        );
      }
    } catch (err) {
      console.error(`Error performing action (${actionType}) for user ID ${id}:`, err);
      if (err.response) {
        // Log the full error response from the server for debugging
        console.error("Server response:", err.response.data);
        showModal(`Failed to perform action: ${err.response.data?.message || err.response.statusText}`, "alert", closeModal);
      } else if (err.request) {
        showModal("Failed to perform action: No response from server. Check network.", "alert", closeModal);
      } else {
        showModal("Failed to perform action: An unexpected error occurred.", "alert", closeModal);
      }
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Manage Users</h1>

      {/* Summary Cards for User Counts */}
      <div style={styles.summaryCards}>
        <div style={{ ...styles.card, background: '#4CAF50' }}>
          <p style={styles.cardCount}>{active}</p>
          <p style={styles.cardTitle}>Active Users</p>
        </div>
        <div style={{ ...styles.card, background: '#FFC107' }}>
          <p style={styles.cardCount}>{pending}</p>
          <p style={styles.cardTitle}>Pending Users</p>
        </div>
        <div style={{ ...styles.card, background: '#e60000' }}>
          <p style={styles.cardCount}>{removed}</p>
          <p style={styles.cardTitle}>Removed Users</p>
        </div>
      </div>

      {/* User List */}
      <div style={styles.userList}>
        {users.length === 0 ? (
          <p style={styles.noUsersMessage}>No users to display.</p>
        ) : (
          users.map((user) => (
            <div key={user.userId} style={styles.userCard}>
              <p><strong>Name:</strong> {user.userName}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
              <p><strong>Contact:</strong> {user.contact}</p>
              {/* Display user status if available */}
              {user.status && <p><strong>Status:</strong> {user.status}</p>}

              {/* Conditional rendering for Approve/Remove buttons */}
              {user.status !== "Active" && user.status !== "Removed" && (
                <button
                  style={{ ...styles.button, background: "#4CAF50" }}
                  onClick={() => handleUserAction(user.userId, "Approved")}
                >
                  Approve
                </button>
              )}
              {user.status !== "Removed" && ( // Only show remove if not already removed
                <button
                  style={{ ...styles.button, background: "#e60000" }}
                  onClick={() => handleUserAction(user.userId, "Removed")}
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Custom Modal */}
      {modal.isOpen && (
        <CustomModal
          message={modal.message}
          type={modal.type}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif", // Using Inter font
  },
  heading: {
    color: "#fff",
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "30px",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
  },
  summaryCards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "40px",
    width: "100%",
    maxWidth: "900px",
    flexWrap: "wrap", // Allow cards to wrap on smaller screens
  },
  card: {
    padding: "25px",
    borderRadius: "15px",
    color: "#fff",
    flex: 1,
    minWidth: "200px",
    margin: "10px", // Add margin for spacing on wrap
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)", // For Safari
    border: "1px solid rgba(255, 255, 255, 0.18)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "translateY(-5px)",
    },
  },
  cardCount: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "0",
  },
  cardTitle: {
    fontSize: "1.2rem",
    margin: "0",
    opacity: "0.8",
  },
  userList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
    width: "100%",
    maxWidth: "1200px",
  },
  userCard: {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "20px",
    padding: "20px",
    width: "280px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    textAlign: "left",
    color: "#fff",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "translateY(-5px)",
    },
  },
  button: {
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    margin: "10px 5px 0 0",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    "&:hover": {
        transform: "scale(1.05)",
    },
  },
  loading: {
    color: "#fff",
    fontSize: "1.5rem",
    marginTop: "100px",
  },
  error: {
    color: "#ffdddd",
    backgroundColor: "#e60000",
    padding: "15px",
    borderRadius: "10px",
    fontSize: "1.2rem",
    marginTop: "50px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  noUsersMessage: {
    color: "#fff",
    fontSize: "1.2rem",
    marginTop: "50px",
  }
};

export default ManageUsers;