import React from "react";

const Alert = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div style={{ ...styles.alert, ...styles[type] }}>
      {message}
      <button onClick={onClose} style={styles.closeButton}>✖</button>
    </div>
  );
};

const styles = {
  alert: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 20px",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "250px",
    maxWidth: "350px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  success: {
    background: "#28a745",
  },
  error: {
    background: "#dc3545",
  },
  info: {
    background: "#17a2b8",
  },
  closeButton: {
    marginLeft: "10px",
    border: "none",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Alert;
