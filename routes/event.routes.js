const router = require("express").Router();
const mongoose = require("mongoose");

const Event = require("../models/Event.model");
const Thread = require("../models/Thread.model");
const Poll = require("../models/Poll.model");

//Create a new event
router.post("/events", (req, res, next) => {
  const { name, date, location, participants, organizers, image } = req.body;
  const userId = req.payload._id;

  const allParticipants = [userId, ...participants];
  const allOrganizers = [userId, ...organizers];

  if (name === "") {
    return res
      .status(400)
      .json({ errorMessage: "Please provide a name for your event." });
  }

  Event.create({
    name,
    date,
    location,
    participants: allParticipants,
    threads: [],
    polls: [],
    organizers: allOrganizers,
    image,
  })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//Get all events as participant or organizer
router.get("/events", (req, res, next) => {
  const userId = req.payload._id;

  Event.find({ participants: { $in: userId } })
    .then((events) => res.json(events))
    .catch((err) => res.json(err));
});

//Get specific event
router.get("/events/:eventId", (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.findById(eventId)
    .populate("threads polls participants organizers")
    .then((event) => res.status(200).json(event))
    .catch((error) => res.json(error));
});

//Update specific event (protected for organizers)
router.put("/events/:eventId", (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.payload._id;
  const { name, date, location, participants, organizers, image } = req.body;
  const allParticipants = [userId, ...participants];
  const allOrganizers = [userId, ...organizers];

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.findById(eventId)
    .then((event) => {
      if (!event.organizers.includes(userId)) {
        throw new Error("No permission to edit this event");
      }
      return Event.findByIdAndUpdate(
        eventId,
        { name, date, location, allParticipants, allOrganizers, image },
        { returnDocument: "after" }
      );
    })
    .then((updatedEvent) => res.json(updatedEvent))
    .catch((error) => res.status(400).json({ message: error.message }));
});

//Delete specific event (protected for organizers)
router.delete("/events/:eventId", (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.payload._id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.findById(eventId)
    .then((event) => {
      if (!event.organizers.includes(userId)) {
        throw new Error("No permission to delete this event");
      }
      return Event.findByIdAndRemove(eventId);
    })
    .then((deletedEvent) => {
      const deleteThreads = Thread.deleteMany({
        _id: { $in: deletedEvent.threads },
      });
      const deletePolls = Poll.deleteMany({ _id: { $in: deletedEvent.polls } });

      return Promise.all([deleteThreads, deletePolls]);
    })
    .then((response) => {
      res.json({ message: `Event with ${eventId} is removed successfully.` });
    })
    .catch((error) => res.status(400).json({ message: error.message }));
});

module.exports = router;
