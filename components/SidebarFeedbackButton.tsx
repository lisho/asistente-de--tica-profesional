import React from "react";

const SidebarFeedbackButton: React.FC = () => (
  <a
    href="https://deontofeedback.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full mt-2 mb-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-center transition"
    style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
  >
    Feedback
  </a>
);

export default SidebarFeedbackButton;
