const router = require("express").Router();
const mongoose = require('mongoose');

const Event = require('../models/Event.model');
const Thread = require('../models/Thread.model');
const Poll = require('../models/Poll.model');

//Create a new event
router.post('/events', (req, res, next) => {
    const { name, date, location, participants, organizers } = req.body;
  
    Event
        .create({ 
            name, 
            date, 
            location, 
            participants, 
            threads: [], 
            polls: [], 
            organizers //default current one??? or in frontend
        })
        .then(response => res.json(response))
        .catch(err => res.json(err));
  });

//Get all events
router.get('/events', (req, res, next) => {
    Event.find()
        .then(events => res.json(events))
        .catch(err => res.json(err));
});

//Get specific event
router.get('/events/:eventId', (req, res, next) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    
    Event.findById(eventId)
        .populate('threads polls')
        .then(event => res.status(200).json(event))
        .catch(error => res.json(error));
});

//Update specific event
router.put('/events/:eventId', (req, res, next) => {
    const { eventId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
   
    Event.findByIdAndUpdate(eventId, req.body, { returnDocument: 'after' })
        .then((updatedEvent) => res.json(updatedEvent))
        .catch(error => res.json(error));
  });

  //Delete specific event
  router.delete('/events/:eventId', (req, res, next) => {
    const { eventId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Event.findByIdAndRemove(eventId)
        .then(deletedEvent => {
            
            const deleteThreads = Thread.deleteMany({ _id: { $in: deletedEvent.threads } });
            const deletePolls = Poll.deleteMany({ _id: { $in: deletedEvent.polls } });
        return Promise.all([deleteThreads, deletePolls])
        })
        .then((response) => {
            console.log(response)
            res.json({ message: `Event with ${eventId} is removed successfully.` })
        })
        .catch(error => res.json(error));
  });


module.exports = router;

