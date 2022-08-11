const router = require("express").Router();
const mongoose = require("mongoose");

const Poll = require("../models/Poll.model");
const Event = require("../models/Event.model");

//Create a new poll
router.post("/polls", (req, res, next) => {
  const { title, description, optionNames, participants, eventId } = req.body;
  const userId = req.payload._id;

  let options = [];

  optionNames.forEach((name) => {
    options = [...options, { name: name }];
  });

  const allParticipants = [{ user: userId }];
  if (participants) {
    participants.forEach((participant) => {
      allParticipants.push({ user: participant });
    });
  }
console.log(allParticipants)
  Poll.create({
    title,
    description,
    options,
    participants: allParticipants,
    event: eventId,
    owner: userId,
  })
    .then((poll) => {
      return Event.findByIdAndUpdate(eventId, { $push: { polls: poll._id } });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//Get all polls
router.get("/polls", (req, res, next) => {
  const userId = req.payload._id;

  Poll.find({
    $or: [{ "participants.user": { $in: userId } }, { owner: { $in: userId } }],
  })
    .then((polls) => res.json(polls))
    .catch((err) => res.json(err));
});

//Get specific poll
router.get("/polls/:pollId", (req, res, next) => {
  const { pollId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Poll.findById(pollId)
    .then((poll) => res.status(200).json(poll))
    .catch((error) => res.json(error));
});

//Update specific poll
router.put("/polls/:pollId", (req, res, next) => {
  const { pollId } = req.params;
  const { status, newVotes, optionId, voted } = req.body;
  const userId = req.payload._id;
console.log(pollId)
  console.log(req.body)
  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  if (status) {
    Poll.findByIdAndUpdate(pollId, { status }, { returnDocument: "after" })
      .then((updatedPoll) => res.json(updatedPoll))
      .catch((error) => res.json(error));
  }

  if (newVotes && voted) {
    const updateVotes = new Promise((resolve, reject) => {
      Poll.findOneAndUpdate(
        { _id: pollId, "options._id": { $in: optionId } },
        { $set: { "options.$.votes": newVotes } },
        { returnDocument: "after" }
      )
      .then((updatedPoll) => resolve(updatedPoll))
      .catch(error => reject(error));

    });
    
    const updateParticipant = new Promise((resolve, reject) => {
      Poll.findOneAndUpdate(
        { _id: pollId, "participants.user": userId },
        { $set: { "participants.$.voted": voted } },
        { returnDocument: "after" }
      )
      .then((updatedPoll) => resolve(updatedPoll))
      .catch(error => reject(error));
    });

    Promise.all([updateVotes, updateParticipant])
      .then((response) => {
        console.log(response)
        res.json(response)})
      .catch((error) => {
        console.log(error)
        res.json(error)});
  }
});

//Delete specific poll
router.delete("/polls/:pollId", (req, res, next) => {
  const { pollId } = req.params;
  const { eventId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.findByIdAndUpdate(eventId, { $pull: { polls: pollId } })
    .then((response) => {
      return Poll.findByIdAndRemove(pollId);
    })
    .then((response) => {
      res.json({ message: `Poll with ${pollId} is removed successfully.` });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
