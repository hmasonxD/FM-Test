import React, { useState } from "react";
import axios from "axios";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handlePasswordChange = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.message);
      setSuccess(true);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error changing password:", error.response.data.error);
        setError(error.response.data.error);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      {success && <div style={{ color: "green" }}>Change successful!</div>}
      <div>
        <label htmlFor="currentPassword">Current Password:</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button onClick={handlePasswordChange}>Change Password</button>
    </div>
  );
};

export default ChangePassword;
