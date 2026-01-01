import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Get user ID from sessionStorage & convert it to a number
  const userId = parseInt(sessionStorage.getItem("userId"), 10);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5005/api/UserMaster/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUser(data);
        setUpdatedUser({
          userName: data.Name, // ✅ Ensure correct property names
          email: data.Email,
          bloodGroup: data.BloodGroup,
          phone: data.Contact,
          address: data.Locality, // Assuming Locality is the address field
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, [userId]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // ✅ Save updated user details
  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/UserMaster/UpdateUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      const data = await response.json();
      setUser(data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-heading">User Profile</h1>
      <div className="profile-card">
        {error && <p className="error-message">{error}</p>}

        {isEditing ? (
          <>
            <input className="profile-input" type="text" name="userName" value={updatedUser.userName} onChange={handleChange} />
            <input className="profile-input" type="email" name="email" value={updatedUser.email} onChange={handleChange} />
            <input className="profile-input" type="text" name="bloodGroup" value={updatedUser.bloodGroup} onChange={handleChange} />
            <input className="profile-input" type="text" name="phone" value={updatedUser.phone} onChange={handleChange} />
            <input className="profile-input" type="text" name="address" value={updatedUser.address} onChange={handleChange} />

            <button className="profile-button" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button className="profile-button cancel" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.Name}</p>
            <p><strong>Email:</strong> {user.Email}</p>
            <p><strong>Blood Group:</strong> {user.BloodGroup}</p>
            <p><strong>Phone:</strong> {user.Contact}</p>
            <p><strong>Address:</strong> {user.Locality}</p>

            <button className="profile-button" onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
