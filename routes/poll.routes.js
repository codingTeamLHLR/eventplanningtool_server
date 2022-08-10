const router = require("express").Router();
const mongoose = require("mongoose");

const Poll = require("../models/Poll.model");
const Event = require("../models/Event.model");

//Create a new poll
router.post("/polls", (req, res, next) => {
  const { title, optionNames, participants, eventId } = req.body;
  const userId = req.payload._id;

  let options = [];
  
  optionNames.forEach(name => {
    options = [...options, {name: name}];
  });

  const allParticipants = [userId]
  if(participants){
    allParticipants.push(...participants);
}

  Poll.create({
    title,
    options,
    participants: allParticipants,
    event: eventId,
    owner: userId
  })
    .then((poll) => {
      console.log("poll", poll)
      return Event.findByIdAndUpdate(eventId, { $push: { polls: poll._id } });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//Get all polls
router.get("/polls", (req, res, next) => {
  const userId = req.payload._id;

  Poll.find({ participants: { $in: userId }})
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
  const { status, newVotes, optionId} = req.body;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  if(status){
  Poll.findByIdAndUpdate(pollId, {status}, { returnDocument: "after" })
    .then((updatedPoll) => res.json(updatedPoll))
    .catch((error) => res.json(error));
  }
  if(newVotes){
    Poll.findOneAndUpdate({pollId, 'options._id':{ $in: optionId }}, {$set: {"options.$.votes": newVotes}}, { returnDocument: "after" })
    .then((updatedPoll) => {
      res.json(updatedPoll)
      console.log(updatedPoll)
    })
      .catch((error) => res.json(error));
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
