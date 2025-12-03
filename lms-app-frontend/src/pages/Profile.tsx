// src/pages/Profile.tsx
import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import "./Profile.css";

const Profile: React.FC = () => {
  const { email, name } = useContext(UserContext);

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle profile picture change
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle password save
  const handleSave = () => {
    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      setSuccess("");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }
    // Optionally: validate alphanumeric or minimum length
    setError("");
    setSuccess("Password updated successfully!");
    setPassword("");
    setConfirmPassword("");

    // TODO: Call API to update password in backend
    console.log("Password updated:", password);
  };

  return (
    <div className="body-container profile-wrapper">
      <h2 className="profile-title">User Profile</h2>

      <div className="profile-card">
        <div className="field">
          <span>Name</span>
          <input type="text" value={name} disabled />
        </div>

        <div className="field">
          <span>Email Address</span>
          <input type="email" value={email} disabled />
        </div>

        <div className="field">
          <span>Profile Picture</span>
          <input type="file" accept="image/*" onChange={handlePictureChange} />
          {profilePic && <img src={profilePic} alt="Profile" className="profile-pic-preview" />}
        </div>

        <div className="field">
          <span>New Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="field">
          <span>Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button className="btn-primary profile-save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;
