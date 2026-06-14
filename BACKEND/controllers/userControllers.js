const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

// @description    Register a new user
// @route          POST /api/user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // 1. Check if all fields are provided
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all required fields");
  }

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 3. Create the user in the database
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  // 4. If successful, send back user data + token
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

// @description    Authenticate user & get token (Login)
// @route          POST /api/user/login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // If user exists AND the password matches (using the method we wrote in userModel)
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @description    Get or Search all users
// @route          GET /api/user?search=
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // Find users matching the keyword, but do NOT include the currently logged-in user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };