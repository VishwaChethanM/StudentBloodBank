import React, { useState, useEffect } from "react";

const DonorProfile = () => {
  const [user, setUser] = useState(null);
  const [availability, setAvailability] = useState(true);

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    if (loggedInUser && loggedInUser.role === 3) { // ✅ Only Donors (Role 3)
      setUser(loggedInUser);
    } else {
      window.location.href = "/not-authorized"; // Redirect Non-Donors
    }
  }, []);

  const updateAvailability = async () => {
    const response = await fetch(`/api/DonorMaster/UpdateAvailability`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.userId, availabilityStatus: availability }),
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <div>
      <h1>Donor Profile</h1>
      {user && (
        <>
          <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
          <p><strong>Last Donation Date:</strong> {user.lastDonationDate}</p>
          <label>
            Available: <input type="checkbox" checked={availability} onChange={() => setAvailability(!availability)} />
          </label>
          <button onClick={updateAvailability}>Update Availability</button>
        </>
      )}
    </div>
  );
};

export default DonorProfile;
