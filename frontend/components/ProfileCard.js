import { useEffect, useState, useRef } from "react";
import Image from "next/image";
// import api from "../../utils/api";
import { useRouter } from "next/router";

import {
  fetchProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,
  changePassword,
  changeTransactionPassword,
} from "../utils/profileService";

const ProfileCard = ({ user: propUser }) => {
  const router = useRouter();
  // Initial user data
  const initialUserData = {
    basicInfo: {
      name: propUser?.name || "",
      email: propUser?.email || "",
      country: propUser?.country || "India",
      phone: propUser?.phone || "",
      panNumber: propUser?.panNumber || "",
      aadharNumber: propUser?.aadharNumber || "",
      avatar: propUser?.avatar || null,
      referralCodeLeft: propUser?.referralCodeLeft || "",
      referralCodeRight: propUser?.referralCodeRight || "",
    },
    bankDetails: {
      accountNumber: propUser?.bankDetails?.accountNumber || "",
      ifscCode: propUser?.bankDetails?.ifscCode || "",
      bankName: propUser?.bankDetails?.bankName || "",
      accountHolderName: propUser?.bankDetails?.accountHolderName || "",
    },
    uiSettings: {
      profileViewState: "view",
    },
  };

  // State initialization
  const [user, setUser] = useState(initialUserData);
  const [formData, setFormData] = useState({
    ...initialUserData.basicInfo,
    bankDetails: { ...initialUserData.bankDetails },
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    currentTransactionPassword: "",
    newTransactionPassword: "",
    confirmTransactionPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Load saved data on component mount and when propUser changes  // Load profile data from backend
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profileData = await fetchProfile();

        if (profileData) {
          setUser({
            basicInfo: {
              name: profileData.basicInfo?.name || "",
              email: profileData.basicInfo?.email || "",
              country: profileData.basicInfo?.country || "India",
              phone: profileData.basicInfo?.phone || "",
              panNumber: profileData.basicInfo?.panNumber || "",
              aadharNumber: profileData.basicInfo?.aadharNumber || "",
              avatar: profileData.basicInfo?.avatar || null,
              referralCodeLeft: profileData.referralInfo?.referralCodeLeft || "",
              referralCodeRight: profileData.referralInfo?.referralCodeRight || "",
            },
            bankDetails: {
              accountNumber: profileData.bankDetails?.accountNumber || "",
              ifscCode: profileData.bankDetails?.ifscCode || "",
              bankName: profileData.bankDetails?.bankName || "",
              accountHolderName:
                profileData.bankDetails?.accountHolderName || "",
            },
            uiSettings: {
              profileViewState:
                profileData.uiSettings?.profileViewState || "view",
            },
          });

          setFormData({
            ...profileData.basicInfo,
            bankDetails: { ...profileData.bankDetails },
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            currentTransactionPassword: "",
            newTransactionPassword: "",
            confirmTransactionPassword: "",
          });

          setIsEditing(profileData.uiSettings?.profileViewState === "edit");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [propUser]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("bankDetails.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle avatar image upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (e.g., PNG, JPEG).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const updatedUser = { ...user, avatar: reader.result };
        setUser(updatedUser);
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
        localStorage.setItem("userProfileData", JSON.stringify(updatedUser));
      };
      reader.onerror = () => {
        alert("Error reading the image file.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete avatar handler
  const handleDeleteAvatar = () => {
    const updatedUser = { ...user, avatar: null };
    setUser(updatedUser);
    setFormData((prev) => ({ ...prev, avatar: null }));
    localStorage.setItem("userProfileData", JSON.stringify(updatedUser));
  };

  // Trigger file input click
  const handleAvatarButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Handle password changes if provided
    if (formData.newPassword && formData.currentPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match!');
      }
      
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
    }

    // Handle transaction password changes if provided
    

    // Prepare profile data for update (excluding password fields)
    const profileUpdateData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      panNumber: formData.panNumber,
      aadharNumber: formData.aadharNumber,
      bankDetails: {
        accountNumber: formData.bankDetails.accountNumber,
        ifscCode: formData.bankDetails.ifscCode,
        bankName: formData.bankDetails.bankName,
        accountHolderName: formData.bankDetails.accountHolderName
      }
    };

    // Update profile data
    const updatedUser = await updateProfile(profileUpdateData);

    // Update state with new data
    setUser(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        name: updatedUser.name || formData.name,
        email: updatedUser.email || formData.email,
        phone: updatedUser.phone || formData.phone,
        country: updatedUser.country || formData.country,
        panNumber: updatedUser.panNumber || formData.panNumber,
        aadharNumber: updatedUser.aadharNumber || formData.aadharNumber
      },
      bankDetails: updatedUser.bankDetails || formData.bankDetails,
      uiSettings: {
        profileViewState: 'view'
      }
    }));

    setIsEditing(false);
    window.dispatchEvent(new Event('profile-updated'));
  } catch (err) {
    setError(err.message || 'Failed to update profile');
  } finally {
    setLoading(false);
  }
};

  // Switch to edit mode
  const handleEdit = () => {
    // Reset form data to current user data when entering edit mode
    setFormData({
      ...user.basicInfo,
      bankDetails: { ...user.bankDetails },
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      currentTransactionPassword: "",
      newTransactionPassword: "",
      confirmTransactionPassword: "",
    });
    setIsEditing(true);
  };

  // Common input style
  const inputStyle = {
    border: "2px solid #E0E0E0",
    borderRadius: "8px",
    color: "#0A2463",
    backgroundColor: "#F5F5F5",
    transition: "all 0.3s",
  };

  // Common button style
  const buttonStyle = {
    background: "linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)",
    color: "white",
    borderRadius: "8px",
    transition: "all 0.3s",
    border: "none",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(58, 134, 255, 0.4)",
  };

  return (
    <div
      className="card mb-4 shadow-sm"
      style={{
        borderRadius: "12px",
        border: "none",
        backgroundColor: "white",
        boxShadow: "0 10px 25px rgba(58, 134, 255, 0.2)",
      }}
    >
      <div className="card-body p-4">
        {/* Avatar Section */}
        <div className="text-center mb-4">
          <div className="d-flex justify-content-center mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "#3A86FF",
                color: "white",
                fontSize: "40px",
              }}
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="User Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  width={120}
                  height={120}
                />
              ) : (
                user.basicInfo.name?.charAt(0) || "U"
              )}
            </div>
          </div>

          <h5
            className="fw-bold mb-1"
            style={{
              color: "#0A2463",
              textShadow: "1px 1px 2px rgba(58, 134, 255, 0.2)",
            }}
          >
            {user.basicInfo.name || "User Name"}
          </h5>
          <p className="text-muted mb-2">{user.basicInfo.country || "India"}</p>
          <p className="text-muted mb-3">
            {user.basicInfo.email || "user@example.com"}
          </p>

          <div className="d-flex gap-2 justify-content-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <button
              className="btn btn-sm px-4 py-2"
              style={{
                border: "2px solid #3A86FF",
                color: "#3A86FF",
                borderRadius: "8px",
                fontWeight: "500",
                transition: "all 0.3s",
                backgroundColor: "transparent",
              }}
              onClick={handleAvatarButtonClick}
              disabled={loading}
            >
              Change Avatar
            </button>
            {user.avatar && (
              <button
                className="btn btn-sm px-4 py-2"
                style={{
                  border: "2px solid #FF3A6C",
                  color: "#FF3A6C",
                  borderRadius: "8px",
                  fontWeight: "500",
                  transition: "all 0.3s",
                  backgroundColor: "transparent",
                }}
                onClick={handleDeleteAvatar}
                disabled={loading}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5
                className="mb-0"
                style={{
                  color: "#0A2463",
                  fontWeight: "600",
                }}
              >
                Basic Information
              </h5>
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-sm px-4 py-2"
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#3A86FF",
                  }}
                  onClick={handleEdit}
                  disabled={loading}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm px-4 py-2"
                    style={{
                      border: "2px solid #E0E0E0",
                      color: "#757575",
                      borderRadius: "8px",
                      fontWeight: "500",
                      transition: "all 0.3s",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm px-4 py-2"
                    style={buttonStyle}
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <hr style={{ borderColor: "#E0E0E0" }} />

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="row g-3">
              <div className="col-md-6">
                <label
                  htmlFor="name"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true} // Email should not be editable
                  style={{
                    ...inputStyle,
                    backgroundColor: "#EEEEEE",
                    cursor: "not-allowed",
                  }}
                  required
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="phone"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="country"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Country
                </label>
                <select
                  className="form-select"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  style={inputStyle}
                  required
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="Brazil">Brazil</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="panNumber"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  PAN Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  style={inputStyle}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="aadharNumber"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Aadhar Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="mb-4">
            <h5
              className="mb-3"
              style={{
                color: "#0A2463",
                fontWeight: "600",
              }}
            >
              Bank Details
            </h5>
            <hr style={{ borderColor: "#E0E0E0" }} />
            <div className="row g-3">
              <div className="col-md-6">
                <label
                  htmlFor="bankDetails.accountNumber"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Account Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bankDetails.accountNumber"
                  name="bankDetails.accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  style={inputStyle}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="bankDetails.ifscCode"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  IFSC Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bankDetails.ifscCode"
                  name="bankDetails.ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  style={inputStyle}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="bankDetails.bankName"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bankDetails.bankName"
                  name="bankDetails.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  style={inputStyle}
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="bankDetails.accountHolderName"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Account Holder Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bankDetails.accountHolderName"
                  name="bankDetails.accountHolderName"
                  value={formData.bankDetails.accountHolderName}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Password Change Section - Only visible in edit mode */}
          {isEditing && (
            <div className="mb-4">
              <h5
                className="mb-3"
                style={{
                  color: "#0A2463",
                  fontWeight: "600",
                }}
              >
                Change Password
              </h5>
              <hr style={{ borderColor: "#E0E0E0" }} />
              <div className="row g-3">
                <div className="col-md-4">
                  <label
                    htmlFor="currentPassword"
                    className="form-label"
                    style={{ color: "#0A2463", fontWeight: "500" }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div className="col-md-4">
                  <label
                    htmlFor="newPassword"
                    className="form-label"
                    style={{ color: "#0A2463", fontWeight: "500" }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div className="col-md-4">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label"
                    style={{ color: "#0A2463", fontWeight: "500" }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Transaction Password Change Section - Only visible in edit mode */}
          {isEditing && (
            <div className="mb-4">
              <h5
                className="mb-3"
                style={{
                  color: "#0A2463",
                  fontWeight: "600",
                }}
              >
                Change Transaction Password
              </h5>
              <hr style={{ borderColor: "#E0E0E0" }} />
              <div className="row g-3">
                <div className="col-md-4">
                  <label
                    htmlFor="currentTransactionPassword"
                    className="form-label"
                    style={{ color: "#0A2463", fontWeight: "500" }}
                  >
                    Current Transaction Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentTransactionPassword"
                    name="currentTransactionPassword"
                    value={formData.currentTransactionPassword}
                    onChange={handleChange}
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div className="col-md-4">
                  <label
                    htmlFor="newTransactionPassword"
                    className="form-label"
                    style={{ color: "#0A2463", fontWeight: "500" }}
                  >
                    New Transaction Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newTransactionPassword"
                    name="newTransactionPassword"
                    value={formData.newTransactionPassword}
                    onChange={handleChange}
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div className="col-md-4">
                  <label
                    htmlFor="confirmTransactionPassword"
                    className="form-label"
                    style={{ color: "#0A2463", fontWeight: "500" }}
                  >
                    Confirm New Transaction Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmTransactionPassword"
                    name="confirmTransactionPassword"
                    value={formData.confirmTransactionPassword}
                    onChange={handleChange}
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Referral Codes Section */}
          <div className="mb-4">
            <h5
              className="mb-3"
              style={{
                color: "#0A2463",
                fontWeight: "600",
              }}
            >
              Referral Codes
            </h5>
            <hr style={{ borderColor: "#E0E0E0" }} />
            <div className="row g-3">
              <div className="col-md-6">
                <label
                  htmlFor="referralCodeLeft"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Left Referral Code
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="referralCodeLeft"
                    value={user.basicInfo.referralCodeLeft}
                    readOnly
                    style={{
                      ...inputStyle,
                      backgroundColor: "#EEEEEE",
                      cursor: "not-allowed",
                    }}
                  />
                  <button
                    className="btn"
                    type="button"
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#3A86FF",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        user.basicInfo.referralCodeLeft
                      );
                      alert("Referral code copied to clipboard!");
                    }}
                  >
                    <i className="bi bi-clipboard"></i> Copy
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="referralCodeRight"
                  className="form-label"
                  style={{ color: "#0A2463", fontWeight: "500" }}
                >
                  Right Referral Code
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="referralCodeRight"
                    value={user.basicInfo.referralCodeRight}
                    readOnly
                    style={{
                      ...inputStyle,
                      backgroundColor: "#EEEEEE",
                      cursor: "not-allowed",
                    }}
                  />
                  <button
                    className="btn"
                    type="button"
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#3A86FF",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        user.basicInfo.referralCodeRight
                      );
                      alert("Referral code copied to clipboard!");
                    }}
                  >
                    <i className="bi bi-clipboard"></i> Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCard;
