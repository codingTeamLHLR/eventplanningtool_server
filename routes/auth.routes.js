const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware");
const createToken = require("../services/createToken");

router.post("/signup", (req, res) => {
  const { email, password, username, image } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (email === "" || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ errorMessage: "Provide a valid email address." });
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (password === "" || !passwordRegex.test(password)) {
    return res.status(400).json({
      errorMessage:
        "The password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  if (username === "") {
    return res.status(400).json({ errorMessage: "Please provide a username" });
  }

  User.findOne({ email }).then((found) => {
    if (found) {
      return res.status(400).json({ errorMessage: "This email already exists." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          email,
          password: hashedPassword,
          username,
          image,
        });
      })
      .then((user) => {
        const { email, username, _id, image } = user;

        const newUser = { email, username, _id, image };

        const authToken = createToken(user);

        return res.status(200).json({ user: newUser, authToken: authToken });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "") {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your email." });
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (password === "" || !passwordRegex.test(password)) {
    return res.status(400).json({
      errorMessage:
        "The password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          errorMessage: "This email does not exist, please signup first.",
        });
      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "Wrong credentials." });
        }

        const authToken = createToken(user);

        return res.status(200).json({ authToken: authToken });
      });
    })

    .catch((err) => {
      next(err);
    });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.json(req.payload);
});

module.exports = router;
