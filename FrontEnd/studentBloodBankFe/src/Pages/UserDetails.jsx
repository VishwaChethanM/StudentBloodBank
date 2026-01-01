import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddressDropdown from "../components/AddressDropdown";
import CollegeDropdown from "../components/CollegeDropdown";
export default function UserDetails() {
    const id = sessionStorage.getItem("userId");
    const navigate = useNavigate();
   
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedCollegeId, setSelectedCollegeId] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect to login if not authenticated
            return;
        }
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`https://localhost:5268/api/UserMaster/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setFormData(response.data);
            setSelectedAddressId(response.data.addressId);
            setSelectedCollegeId(response.data.collegeId);
        } catch (err) {
            setError("Failed to fetch user details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const updatedData = { 
                UserId: id, 
                UserName: formData.Name,
                Email: formData.Email,
                BloodGroup: formData.BloodGroup,
                Contact: formData.Contact,
                AddressId: selectedAddressId,
                CollegeId: selectedCollegeId,
                Password: formData.Password || ""
            };

            const response = await axios.put(
                `https://localhost:5005/api/UserMaster/UpdateUser/${id}`,
                updatedData,
                {
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                }
            );

            setIsEditing(false);
            fetchUserDetails();
        } catch (err) {
            setError(err.response?.data?.title || "Failed to update user details.");
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>;
    if (error) return <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{error}</div>;

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                {isEditing ? (
                    <>
                        <input type="text" name="Name" value={formData.Name} onChange={handleChange} style={styles.input} placeholder="Name" />
                        <input type="email" name="Email" value={formData.Email} onChange={handleChange} style={styles.input} placeholder="Email" />
                        <select name="BloodGroup" value={formData.BloodGroup} onChange={handleChange} style={styles.input}>
                            <option value="">Select Blood Group</option>
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                        <input type="text" name="Contact" value={formData.Contact} onChange={handleChange} style={styles.input} placeholder="Contact" />
                        <AddressDropdown onAddressSelect={setSelectedAddressId} />
                        <CollegeDropdown addressId={selectedAddressId} onCollegeSelect={setSelectedCollegeId} />
                        <button onClick={handleUpdate} style={styles.button}>Save</button>
                        <button onClick={() => setIsEditing(false)} style={{ ...styles.button, backgroundColor: "#6c757d" }}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h2 style={styles.heading}>{user.Name}</h2>
                        <p style={styles.text}>{user.Email}</p>
                        <div style={styles.details}>
                            <p><strong>User ID:</strong> {user.UserId}</p>
                            <p><strong>Blood Group:</strong> {user.BloodGroup}</p>
                            <p><strong>Contact:</strong> {user.Contact}</p>
                            <p><strong>Locality:</strong> {user.Locality}</p>
                            <p><strong>Area:</strong> {user.Area}</p>
                            <p><strong>College:</strong> {user.CollegeName}</p>
                            <p><strong>Registered On:</strong> {new Date(user.CreatedDate).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => setIsEditing(true)} style={styles.button}>Edit</button>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: "500px", margin: "20px auto", padding: "20px" },
    box: { backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", border: "1px solid #ddd" },
    heading: { fontSize: "20px", fontWeight: "bold", color: "#333" },
    text: { color: "#777" },
    details: { marginTop: "15px", textAlign: "left" },
    input: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", marginBottom: "10px" },
    button: { backgroundColor: "#007bff", color: "white", padding: "10px 15px", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px", fontSize: "16px" }
};
