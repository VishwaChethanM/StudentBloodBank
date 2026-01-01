import { useEffect, useState } from "react";
import axios from "axios";

const DonationHistory = () => {
    const [userId, setUserId] = useState(null);
    const [donationHistory, setDonationHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eligibilityStatus, setEligibilityStatus] = useState("Calculating...");

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        const storedToken = sessionStorage.getItem("token");

        if (storedUser && storedToken) {
            const user = JSON.parse(storedUser);
            setUserId(user.userId);
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        } else {
            console.warn("User is not logged in! Redirecting to login...");
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchDonationHistory(userId);
        }
    }, [userId]);

    const fetchDonationHistory = async (id) => {
        try {
            setLoading(true);
            console.log(`Fetching donation history for userId: ${id}`);

            const response = await axios.get(`http://localhost:5268/api/DonationHistory/GetUserDonations/${id}`, {
                timeout: 1000,
            });

            console.log("API Response:", response.data);
            setDonationHistory(response.data);
            calculateEligibility(response.data);
        } catch (err) {
            console.error("Error fetching donation history:", err);
            setError(err.response?.data?.message || "Failed to load donation history. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const calculateEligibility = (history) => {
        if (!history || history.length === 0) {
            setEligibilityStatus("Eligible Now");
            return;
        }

        const sortedHistory = history.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
        const lastDonationDate = new Date(sortedHistory[0].donationDate);
        const currentDate = new Date();
        const diffDays = Math.floor((currentDate - lastDonationDate) / (1000 * 60 * 60 * 24));

        const eligibilityDays = 90 - diffDays;
        if (eligibilityDays <= 0) {
            setEligibilityStatus("Eligible Now");
        } else {
            setEligibilityStatus(`Eligible in ${eligibilityDays} days`);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Donation History</h2>
            <p style={styles.eligibility}>Eligibility Status: <strong>{eligibilityStatus}</strong></p>
            {loading ? (
                <p style={styles.loadingText}>Loading donation history...</p>
            ) : error ? (
                <p style={styles.errorText}>{error}</p>
            ) : donationHistory.length > 0 ? (
                <ul style={styles.list}>
                    {donationHistory.map((donation) => (
                        <li key={donation.donationID} style={styles.listItem}>
                            <strong>{donation.bloodGroup}</strong> - {new Date(donation.donationDate).toLocaleDateString()} ({donation.status})
                            <br />
                            Donated by: {donation.userName}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={styles.noDataText}>No donation history found.</p>
            )}
        </div>
    );
};

const styles = {
    container: { textAlign: "center", marginTop: "20px", padding: "20px" },
    heading: { color: "#ff4d4d", fontSize: "2rem", marginBottom: "15px", textTransform: "uppercase" },
    eligibility: { fontSize: "1.3rem", color: "#333", marginBottom: "15px" },
    loadingText: { color: "#555", fontSize: "1.2rem" },
    errorText: { color: "red", fontWeight: "bold", fontSize: "1.1rem" },
    list: { listStyleType: "none", padding: 0 },
    listItem: { background: "#ffe6e6", padding: "10px", margin: "5px 0", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold" },
    noDataText: { fontSize: "1.2rem", color: "#777" },
};

export default DonationHistory;