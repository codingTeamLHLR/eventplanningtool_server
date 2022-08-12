const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

router.get("/users", (req, res) => {
  if (!req.query.ids) {
    User.find()
      .select({ username: 1, image: 1, _id: 1 })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.json(err);
      });
  } else {
    User.find({ _id: req.query.ids })
      .select({ username: 1, image: 1, _id: 1 })
      .then((user) => {
        console.log(user);
        res.json(user);
      })
      .catch((err) => {
        res.json(err);
      });
  }
});

router.get("/users/:userId", (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ errorMessage: "Specified id is not valid" });
    return;
  }

  User.findById(userId)
    .select({ username: 1, image: 1, _id: 1 })
    .then((user) => {
      console.log(user);
      res.json(user);
    })
    .catch((error) => res.json(error));
});

router.put("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const { username, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ errorMessage: "Specified id is not valid" });
    return;
  }

  User.findByIdAndUpdate(
    userId,
    { username, image },
    { returnDocument: "after" }
  )
    .then((updatedUser) => res.json(updatedUser))
    .catch((error) => res.json(error));
});

router.delete("/users/:userId", (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ errorMessage: "Specified id is not valid" });
    return;
  }

  //UPDATE EVENTS ?

  User.findByIdAndRemove(userId)
    .then((response) => {
      res.json({ message: `User with ${userId} is removed successfully.` });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
