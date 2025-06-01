const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
dotenv = require("dotenv").config();
const { generateReferralCode } = require("../utils/referralUtils");

// for reset and forget password
const sendEmail = require("../utils/sendEmail");

// USER REGISTRATION -------------------------------------------------------------------------------------------
/**
 * Registers a new user in the system.
 *
 * This function handles the registration process by validating the input fields,
 * checking for existing users, validating t
 * 
 * he referral code, hashing the password,
 * and saving the new user to the database.
 *
 * @param {Object} req - The request object containing user registration data.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<void>} - A promise that resolves when the registration process is complete.
 *
 * @throws {Error} - Throws an error if there is a server issue during the registration process.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password || !referralCode) {
      return res.status(400).json({ error: "All fields including referralCode are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Validate referralCode against LEFT or RIGHT
    const parent = await User.findOne({
      $or: [
        { referralCodeLeft: referralCode },
        { referralCodeRight: referralCode }
      ]
    });

    if (!parent) {
      return res.status(400).json({ error: "Invalid referral code" });
    }

    const newUser = new User({
      name,
      email,
      password, // Will be hashed in pre-save hook
      referralCodeLeft: generateReferralCode(),
      referralCodeRight: generateReferralCode(),
      parentId: parent._id
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};


// USER LOGIN -------------------------------------------------------------------------------------------
/**
 * Logs in an existing user.
 *
 * This function handles the login process by validating the input fields,
 * checking for the user in the database, and verifying the password.
 *
 * @param {Object} req - The request object containing user login data.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 *
 * @throws {Error} - Throws an error if there is a server issue during the login process.
 */

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Just return the token; API Gateway will set the cookie
  res.json({ token, expiresIn: "1d" });
};

// USER FORGOT PASSWORD -------------------------------------------------------------------------------------------

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password request for:", email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    console.log("Reset token generated for user:", user._id);

    // Send email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`;
    const message = `
      <p>You requested a password reset for your account.</p>
      <p>Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message
    });

    console.log("Password reset email sent to:", user.email);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
/**
 * Handles the forgot password process.
 *
 * This function generates a reset token, saves it to the user's record,
 * and sends an email with the reset link to the user.
 *
 * @param {Object} req - The request object containing user email.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<void>} - A promise that resolves when the forgot password process is complete.
 *
 * @throws {Error} - Throws an error if there is a server issue during the forgot password process.
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    // Send email

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this because you requested a password reset.\n
Please click the following link to reset your password:\n
http://localhost:5000/api/auth/reset/${resetToken}\n\n
If you did not request this, please ignore this email.`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// USER RESET PASSWORD -------------------------------------------------------------------------------------------

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, id } = req.query;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    _id: id,
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been reset" });
};
/**
 * Handles the password reset process.
 *
 * This function verifies the reset token, updates the user's password,
 * and clears the reset token and expiration time.
 *
 * @param {Object} req - The request object containing reset token and new password.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<void>} - A promise that resolves when the password reset process is complete.
 *
 * @throws {Error} - Throws an error if there is a server issue during the password reset process.
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = password; // will be hashed in pre-save hook
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// USER PROFILE -------------------------------------------------------------------------------------------
/**
 * Retrieves the profile of the logged-in user.
 *
 * This function fetches the user's profile information from the database
 * and returns it in the response.
 *
 * @param {Object} req - The request object containing user ID from JWT.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<void>} - A promise that resolves when the profile retrieval process is complete.
 *
 * @throws {Error} - Throws an error if there is a server issue during the profile retrieval process.
 */
// User Service
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate('parentId', 'name email')
      .populate('leftUser rightUser', 'name email')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Structure the response
    const responseData = {
      basicInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      },
      kycDetails: {
        panNumber: user.panNumber,
        aadharNumber: user.aadharNumber,
        country: user.country
      },
      bankDetails: user.bankDetails,
      referralInfo: {
        parentId: user.parentId,
        referralCodeLeft: user.referralCodeLeft,
        referralCodeRight: user.referralCodeRight,
        leftUser: user.leftUser,
        rightUser: user.rightUser,
        isRootSponsor: user.isRootSponsor
      },
      systemInfo: {
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      },
      uiSettings: {
        profileViewState: user.uiSettings?.profileViewState || 'view'
      }
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// USER UPDATE PROFILE -------------------------------------------------------------------------------------------
/**
 * Updates the profile of the logged-in user.
 *
 * This function validates the input fields, updates the user's profile information
 * in the database, and returns the updated profile in the response.
 *
 * @param {Object} req - The request object containing user ID from JWT and updated profile data.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<void>} - A promise that resolves when the profile update process is complete.
 *
 * @throws {Error} - Throws an error if there is a server issue during the profile update process.
 */
exports.updateProfile = async (req, res) => {
  try {
    const forbiddenFields = ["_id", "referralCode", "referralCodeLeft", "referralCodeRight",
     "parentId", "isAdmin", "isRootSponsor", "leftUser", "rightUser"];
    const updates = { ...req.body };

    // Prevent overwriting restricted fields
    forbiddenFields.forEach(field => delete updates[field]);

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

     if ("password" in req.body) {
      return res.status(400).json({ message: "Use change password route to update password." });
    }

    // Special handling for nested bankDetails
    if (updates.bankDetails) {
      user.bankDetails = {
        ...user.bankDetails.toObject(), // ensure plain object
        ...updates.bankDetails,
      };
      delete updates.bankDetails;
    }

    // Assign other fields
    Object.assign(user, updates);

    await user.save();
    res.json({ message: "Profile updated", user: user.toObject() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// CHANGE PASSWORD -------------------------------------------------------------------------------------------
/**
 * Changes the password of the logged-in user.
 *
 * This function validates the input fields, checks the current password,
 * updates the user's password in the database, and returns a success message.
 *
 * @param {Object} req - The request object containing user ID from JWT and new password data.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<void>} - A promise that resolves when the password change process is complete.
 *
 * @throws {Error} - Throws an error if there is a server issue during the password change process.
 */

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({ message: "New password cannot be same as current password" });
    }

    user.password = newPassword; // will be hashed via mongoose pre-save
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
