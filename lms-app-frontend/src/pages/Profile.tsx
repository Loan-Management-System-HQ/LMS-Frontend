import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Profile.css";

const Profile: React.FC = () => {
  const { email } = useContext(UserContext);
  const [profilePic, setProfilePic] = useState<string | null>(null);
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

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setSuccess("Password updated successfully!");
      // TODO: Call API to update password in backend
      console.log("Password updated:", values.password);
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
    },
  });

  return (
    <div className="body-container profile-wrapper">
      <h2 className="profile-title">User Profile</h2>

      <div className="profile-card">
        <div className="field">
          <span>Name</span>
          <input type="text" value={""} disabled />
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

        <form onSubmit={formik.handleSubmit}>
          <div className="field">
            <span>New Password</span>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter new password"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="error-text">{formik.errors.password}</p>
            ) : null}
          </div>

          <div className="field">
            <span>Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm new password"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="error-text">{formik.errors.confirmPassword}</p>
            ) : null}
          </div>

          {success && <p className="success-text">{success}</p>}

          <button
            type="submit"
            className="btn-primary profile-save-btn"
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
