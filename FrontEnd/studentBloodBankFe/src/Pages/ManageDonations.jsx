import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);

  // Fetch donations from API
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://localhost:5268/api/DonorMaster/GetAllDonors");
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
      alert("Failed to load donations.");
    }
  };

  // Update availability status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.post(`http://localhost:5005/api/DonorMaster/UpdateAvailability/${id}`, {
        status: newStatus,
      });

      // Update UI
      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation.id === id ? { ...donation, availabilityStatus: newStatus } : donation
        )
      );

      alert("Availability status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Manage Donations</h1>
      <div style={styles.donationList}>
        {donations.map((donation) => (
          <div key={donation.id} style={styles.donationCard}>
            <p><strong>Donor ID:</strong> {donation.donorId}</p>
            <p><strong>Last Donation Date:</strong> {donation.lastDonationDate}</p>
            <p><strong>Age:</strong> {donation.age}</p>
            <p><strong>Status:</strong> {donation.availabilityStatus}</p>

            {donation.availabilityStatus === "Not Available" && (
              <button
                style={{ ...styles.button, background: "#4CAF50" }}
                onClick={() => handleStatusChange(donation.id, "Available")}
              >
                Mark as Available
              </button>
            )}

            {donation.availabilityStatus === "Available" && (
              <button
                style={{ ...styles.button, background: "#f44336" }}
                onClick={() => handleStatusChange(donation.id, "Not Available")}
              >
                Mark as Not Available
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px 20px",
    background: "linear-gradient(to right, #1e3c72, #2a5298)",
    minHeight: "100vh",
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
  donationList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  donationCard: {
    background: "rgba(255, 255, 255, 0.2)",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    backdropFilter: "blur(5px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    width: "300px",
    margin: "0 auto",
    color: "#fff",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default ManageDonations;
