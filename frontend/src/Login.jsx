// Login.jsx
import React from "react";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/auth/start"; // Atlassian OAuth
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome to the Dashboard</h2>
        <p style={styles.message}>
          Please login with your Atlassian account to continue.
        </p>
        <button style={styles.button} onClick={handleLogin}>
          Login with Atlassian
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f5f7",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px 30px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "360px",
  },
  title: {
    marginBottom: "16px",
    color: "#172B4D",
    fontSize: "22px",
  },
  message: {
    marginBottom: "24px",
    color: "#5E6C84",
    fontSize: "14px",
  },
  button: {
    backgroundColor: "#0052CC", // Atlassian blue
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};
