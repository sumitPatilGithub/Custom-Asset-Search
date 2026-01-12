import React from "react";

const AuthErrorCard = ({ message }) => {
  const handleLogin = () => {
 window.location.href = "https://s2ssupport-sandbox.atlassian.net/servicedesk/customer/user/profile" // your Atlassian login endpoint
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>Session Expired</h2>
        <p style={styles.message}>
          {message || "Your session has expired. Please login again."}
        </p>

        <button style={styles.button} onClick={handleLogin}>
          Login with Atlassian
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f5f7",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "8px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  title: {
    marginBottom: "12px",
    color: "#172B4D",
  },
  message: {
    marginBottom: "24px",
    color: "#5E6C84",
  },
  button: {
    backgroundColor: "#0052CC", // Atlassian blue
    color: "#ffffff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default AuthErrorCard;
