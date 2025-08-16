// controllers/auth-controller.js
const User = require("../models/auth-models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  let errors = [];
  if (!name) errors.push({ field: "name", message: "Name is required" });
  if (!email) errors.push({ field: "email", message: "Email is required" });
  if (!password) errors.push({ field: "password", message: "Password is required" });

  if (errors.length > 0) return res.status(400).json(errors);

  try {
    const emailExists = await User.emailIfExists(email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser(name, email, hashedPassword);

    res.status(201).json({ message: "User has been created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.emailIfExists(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Change to true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/auth-controller.js
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only secure in prod
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };

