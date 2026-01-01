import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const response = await axios.post("http://localhost:5005/api/Login", { email, password });

        if (response.status === 200 && response.data?.token) {
            const { token, user } = response.data;

            // Store data in sessionStorage instead of localStorage
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("userId", user.userId); 

            // Navigate based on user role
            if (user.role === 1) {
                window.location.href = "/admin-dashboard";
            } else if (user.role === 3) {
                window.location.href = "/student-dashboard";
            } else if (user.role === 2) {
                window.location.href = "/user-dashboard";
            } else {
                window.location.href = "/";
            }
        } else {
            setError("Invalid credentials or missing token in the response.");
        }
    } catch (error) {
        setError(error.response?.data?.message || "Login failed. Please check your email and password.");
    } finally {
        setLoading(false);
    }
};


  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleLogin}>
          {error && <p style={styles.errorMessage}>{error}</p>}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.registerText}>
          Not registered yet?
          <span style={styles.registerLink} onClick={() => window.location.href = "/register"}> Sign Up</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "white",
  },
  box: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "400px",
    border: "2px solid #ff4d4d",
  },
  heading: {
    color: "#ff4d4d",
    fontSize: "2rem",
    marginBottom: "20px",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "2px solid #ff4d4d",
    fontSize: "1rem",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #ff4d4d, darkred)",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
    textTransform: "uppercase",
    transition: "0.3s",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  registerText: {
    marginTop: "15px",
    fontSize: "1rem",
    color: "#333",
  },
  registerLink: {
    color: "#ff4d4d",
    fontWeight: "bold",
    marginLeft: "5px",
    cursor: "pointer",
    textDecoration: "underline",
  },
  errorMessage: {
    color: "white",
    background: "#ff4d4d",
    padding: "10px",
    borderRadius: "5px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
};

export default Login;
