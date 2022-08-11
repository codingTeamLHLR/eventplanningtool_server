const router = require("express").Router();
const mongoose = require("mongoose");

const Event = require("../models/Event.model");
const Poll = require("../models/Poll.model");

//Create a new event
router.post("/events", (req, res, next) => {
  const { name, date, location, participants, organizers, image } = req.body;
  const userId = req.payload._id;

  const allParticipants = [{ user: userId, status: "accepted" }];

  if (participants) {
    participants.forEach((participant) => {
      allParticipants.push({ user: participant });
    });
  }

  const allOrganizers = [userId];
  if (organizers) {
    allOrganizers.push(...organizers);
  }

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

  Event.find({ "participants.user": { $in: userId } })
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
    .populate("polls organizers")
    .populate({
      path: "participants",
      populate: { path: "user" },
    })
    .then((event) => res.status(200).json(event))
    .catch((error) => res.json(error));
});

//Update specific event (protected for organizers)
router.put("/events/:eventId", (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.payload._id;
  const { name, date, location, participants, organizers, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const allParticipants = [];
  const newParticipants = [...participants];

  Event.findById(eventId)
    .then((event) => {
      if (!event.organizers.includes(userId)) {
        throw new Error("No permission to edit this event");
      }

      event.participants.forEach((prevParticipant) => {
        const search = JSON.stringify(prevParticipant.user).replaceAll('"', "");

        if (participants.includes(search)) {
          allParticipants.push({
            user: search,
            status: prevParticipant.status,
          });
          newParticipants.splice(newParticipants.indexOf(search), 1);
        }
      });

      newParticipants.forEach((newParticipant) =>
        allParticipants.push({ user: newParticipant })
      );

      return Event.findByIdAndUpdate(
        eventId,
        {
          name,
          date,
          location,
          participants: allParticipants,
          organizers,
          image,
        },
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
      return Poll.deleteMany({ _id: { $in: deletedEvent.polls } });
    })
    .then((response) => {
      res.json({ message: `Event with ${eventId} is removed successfully.` });
    })
    .catch((error) => res.status(400).json({ message: error.message }));
});

router.put("/events/:eventId/status", (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.payload._id;
  const { status } = req.body;

  Event.findOneAndUpdate(
    { eventId, "participants.user": { $in: userId } },
    { $set: { "participants.$.status": status } },
    { returnDocument: "after" }
  )
    .then((updatedEvent) => {
      res.json(updatedEvent);
      console.log(updatedEvent);
    })
    .catch((error) => res.json(error));
});

module.exports = router;
