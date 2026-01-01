import { useEffect, useState } from "react";
import axios from "axios";

export default function RequestBlood() {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    bloodGroup: "",
    hospitalId: "",
    contact: "",
    urgencyLevel: "",
  });
  const [message, setMessage] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [bloodGroups] = useState(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  if (!loggedInUser) {
    window.location.href = "/login";
    return null;
  }

  const userId = loggedInUser.userId;

  useEffect(() => {
    fetchRequests();
    fetchHospitals();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/BloodRequest/GetAll");
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/Hospital/GetAll");
      setHospitals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setHospitals([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const requestData = {
      userId,
      bloodGroup: newRequest.bloodGroup,
      hospitalId: Number(newRequest.hospitalId),
      contact: newRequest.contact.trim(),
      urgencyLevel: newRequest.urgencyLevel,
    };

    try {
      await axios.post("http://localhost:5268/api/BloodRequest/Create", requestData, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage({ type: "success", text: "Blood request submitted successfully!" });
      fetchRequests();
      setNewRequest({ bloodGroup: "", hospitalId: "", contact: "", urgencyLevel: "" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to submit request. Please try again." });
      console.error("Error submitting request:", error);
    }
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "20px auto",
      padding: "20px",
      background: "#ffffff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      fontFamily: "Arial, sans-serif",
    },
    title: { textAlign: "center", color: "#333" },
    message: (type) => ({
      padding: "10px",
      marginBottom: "15px",
      textAlign: "center",
      borderRadius: "4px",
      fontSize: "14px",
      background: type === "success" ? "#dff0d8" : "#f2dede",
      color: type === "success" ? "#3c763d" : "#a94442",
      border: type === "success" ? "1px solid #d6e9c6" : "1px solid #ebccd1",
    }),
    formContainer: {
      border: "1px solid #ddd",
      padding: "15px",
      borderRadius: "6px",
      background: "#f9f9f9",
      marginBottom: "20px",
    },
    inputField: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
    },
    submitBtn: {
      background: "#d9534f",
      color: "#fff",
      border: "none",
      padding: "12px",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "4px",
      width: "100%",
      transition: "background 0.3s",
    },
    submitBtnHover: { background: "#c9302c" },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    thTd: {
      border: "1px solid #ddd",
      padding: "10px",
      textAlign: "left",
    },
    th: {
      background: "#d9534f",
      color: "white",
    },
    trEven: {
      background: "#f9f9f9",
    },
    trHover: {
      background: "#f1f1f1",
    },
    noRequests: {
      textAlign: "center",
      fontWeight: "bold",
      padding: "15px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Blood Requests</h1>

      {message && <div style={styles.message(message.type)}>{message.text}</div>}

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <select
            style={styles.inputField}
            value={newRequest.bloodGroup}
            onChange={(e) => setNewRequest({ ...newRequest, bloodGroup: e.target.value })}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group, index) => (
              <option key={index} value={group}>{group}</option>
            ))}
          </select>

          <select
            style={styles.inputField}
            value={newRequest.hospitalId}
            onChange={(e) => setNewRequest({ ...newRequest, hospitalId: parseInt(e.target.value) })}
            required
          >
            <option value="">Select Hospital</option>
            {hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <option key={hospital.hospitalId} value={hospital.hospitalId}>
                  {hospital.hospitalName}
                </option>
              ))
            ) : (
              <option disabled>No hospitals available</option>
            )}
          </select>

          <input
            style={styles.inputField}
            type="text"
            placeholder="Contact"
            value={newRequest.contact}
            onChange={(e) => setNewRequest({ ...newRequest, contact: e.target.value })}
            required
          />

          <select
            style={styles.inputField}
            value={newRequest.urgencyLevel}
            onChange={(e) => setNewRequest({ ...newRequest, urgencyLevel: e.target.value })}
            required
          >
            <option value="">Select Urgency Level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button type="submit" style={styles.submitBtn}>Request Blood</button>
        </form>
      </div>

      <h2 style={styles.title}>Your Requests</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>Blood Group</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Hospital</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Urgency</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((req, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.trEven : null}>
                <td style={styles.thTd}>{req.bloodGroup}</td>
                <td style={styles.thTd}>{req.hospitalName}</td>
                <td style={styles.thTd}>{req.urgencyLevel}</td>
                <td style={styles.thTd}>{req.requestStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={styles.noRequests}>No blood requests available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
