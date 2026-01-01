import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/AdminDashboard";
import Alert from "./pages/Alert";
import BloodDonationRules from "./pages/BloodDonationRules";
import ContactPage from "./pages/ContactPage";
import DonationHistory from "./Pages/DonationHistory";
import DonorRegistration from "./pages/DonorRegistration";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ManageDonations from "./pages/ManageDonations";
import ManageRequest from "./pages/ManageRequest";
import ManageUsers from "./pages/ManageUsers";
import RegisterForm from "./pages/RegisterForm";
import RequestBlood from "./Pages/RequestBlood";
import StudentDashboard from "./Pages/StudentDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserDetails from "./Pages/UserDetails";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Dashboard Routes Based on Roles */}
        <Route element={<PrivateRoute allowedRoles={[1]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={[2]} />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={[3]} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Protected Routes for Logged-In Users (Any Role) */}
        <Route element={<PrivateRoute />}>
        <Route path="/userdetails/:id" element={<UserDetails />} />
        <Route path="/request-blood" element={<RequestBlood />} />
          <Route path="/donation-history" element={<DonationHistory />} />
          <Route path="/donor-registration" element={<DonorRegistration />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/manage-requests" element={<ManageRequest />} />
          <Route path="/manage-donations" element={<ManageDonations />} />
          <Route path="/blood-donation-rules" element={<BloodDonationRules />} />
          <Route path="/alert" element={<Alert />} />
        </Route>

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={
          <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
            <h2> Unauthorized Access</h2>
          </div>
        } />

        {/* Fallback Route */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
