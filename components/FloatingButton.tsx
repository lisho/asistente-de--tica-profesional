import React from "react";

const FloatingButton: React.FC = () => (
  <a
    href="https://deontofeedback.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 1000,
      background: "#2563eb",
      color: "#fff",
      padding: "16px 24px",
      borderRadius: "50px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      textDecoration: "none",
      fontWeight: "bold"
    }}
  >
    Feedback
  </a>
);

export default FloatingButton;
