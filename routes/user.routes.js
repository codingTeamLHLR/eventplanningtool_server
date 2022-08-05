const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

router.get("/users", (req, res) => {
    User.find()
        .then(user => {
            res.json(user);
        })
        .catch(err => {res.json(err)})
});

router.get("/users/:userId", (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    User.findById(userId)
        .then(user => res.status(200).json(user))
        .catch(error => res.json(error));
});

module.exports = router;