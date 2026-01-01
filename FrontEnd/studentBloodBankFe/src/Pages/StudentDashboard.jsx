import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import DonationHistory from "./DonationHistory";

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        const storedToken = sessionStorage.getItem("token");

        if (!storedUser || !storedToken) {
            navigate("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser?.userId) {
                navigate("/login");
                return;
            }

            fetchUserDetails(parsedUser.userId, storedToken);
        } catch (err) {
            console.error("Error parsing stored user:", err);
            navigate("/login");
        }
    }, [navigate]);

    const fetchUserDetails = async (userId, token) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5005/api/UserMaster/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(response.data);
        } catch (err) {
            console.error("Error fetching user details:", err);
            setError("Failed to load user details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const calculateEligibility = (lastDonationDate) => {
        if (!lastDonationDate) return "Not Available";

        const lastDate = new Date(lastDonationDate);
        const today = new Date();
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        const eligibilityDays = 56 - diffDays;

        return eligibilityDays <= 0 ? "Eligible Now" : `Eligible in ${eligibilityDays} days`;
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
                <h1>Student Blood Bank Dashboard</h1>

                {loading ? (
                    <p>Loading user data...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : user && (
                    <div>
                        <h2>{user.Name}</h2>
                        <p><strong>Blood Group:</strong> {user.BloodGroup || "N/A"}</p>
                        <p><strong>Eligibility:</strong> {calculateEligibility(user.lastDonationDate)}</p>

                        <button 
                            onClick={() => navigate(`/userdetails/${user.userId}`)} 
                            style={{ marginTop: "10px", padding: "8px 12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
                        >
                            View Full Details
                        </button>
                    </div>
                )}

                {user && <DonationHistory userId={user.userId} />}
            </div>
        </div>
    );
};

export default StudentDashboard;
