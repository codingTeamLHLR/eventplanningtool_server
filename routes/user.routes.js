const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

router.get("/users", (req, res) => {
  if (!req.query.ids) {
    User.find()
<<<<<<< HEAD
      .then((users) => {
        const newUsers = users.map((user) => {
          const { email, username, birthdate, _id } = user;

          return { email, username, birthdate, _id };
        });

        res.json(newUsers);
=======
      .select({ username: 1, image: 1, birthdate: 1, _id: 1 })
      .then((user) => {
        res.json(user);
>>>>>>> e72ebddb4833eaa3ec0353a55b23a88dc6488b52
      })
      .catch((err) => {
        res.json(err);
      });
  } else {
    User.find({ _id: req.query.ids })
<<<<<<< HEAD
      .then((users) => {
        const newUsers = users.map((user) => {
          const { email, username, birthdate, _id } = user;

          return { email, username, birthdate, _id };
        });

        res.json(newUsers);
=======
      .select({ username: 1, image: 1, birthdate: 1, _id: 1 })
      .then((user) => {
        console.log(user);
        res.json(user);
>>>>>>> e72ebddb4833eaa3ec0353a55b23a88dc6488b52
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
<<<<<<< HEAD
    .then((user) => {
      const { email, username, birthdate, _id } = user;

      const newUser = { email, username, birthdate, _id };

      res.status(200).json(newUser);
=======
    .select({ username: 1, image: 1, birthdate: 1, _id: 1 })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => res.json(error));
});

router.put("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const { username, image, birthdate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndUpdate(
    userId,
    { username, image, birthdate },
    { returnDocument: "after" }
  )
    .then((updatedUser) => res.json(updatedUser))
    .catch((error) => res.json(error));
});

router.delete("/users/:userId", (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  //UPDATE EVENTS ?

  User.findByIdAndRemove(userId)
    .then((response) => {
      res.json({ message: `User with ${userId} is removed successfully.` });
>>>>>>> e72ebddb4833eaa3ec0353a55b23a88dc6488b52
    })
    .catch((error) => res.json(error));
});

module.exports = router;
