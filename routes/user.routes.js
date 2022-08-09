const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

router.get("/users", (req, res) => {
  console.log("req.query iiiiiis:");
  console.log(req.query);
  console.log(req.query.ids);

  if (!req.query.ids) {
    User.find()
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.json(err);
      });
  } else {
    User.find({ _id: req.query.ids })
      .then((user) => {
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
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findById(userId)
    .then((user) => res.status(200).json(user))
    .catch((error) => res.json(error));
});

module.exports = router;
