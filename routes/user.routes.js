const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

router.get("/users", (req, res) => {
  if (!req.query.ids) {
    User.find()
      .then((users) => {
        const newUsers = users.map((user) => {
          const { email, username, birthdate, _id } = user;

          return { email, username, birthdate, _id };
        });

        res.json(newUsers);
      })
      .catch((err) => {
        res.json(err);
      });
  } else {
    User.find({ _id: req.query.ids })
      .then((users) => {
        const newUsers = users.map((user) => {
          const { email, username, birthdate, _id } = user;

          return { email, username, birthdate, _id };
        });

        res.json(newUsers);
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
    .then((user) => {
      const { email, username, birthdate, _id } = user;

      const newUser = { email, username, birthdate, _id };

      res.status(200).json(newUser);
    })
    .catch((error) => res.json(error));
});

module.exports = router;
