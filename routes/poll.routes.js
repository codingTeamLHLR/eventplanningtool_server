const router = require("express").Router();
const mongoose = require('mongoose');

const Poll = require('../models/Poll.model');

//Create a new poll
router.post('/polls', (req, res, next) => {
    const { title, options, participants, event } = req.body;
  
    Poll
        .create({ 
            title, 
            options, 
            participants, 
            event
        })
        .then(response => res.json(response))
        .catch(err => res.json(err));
  });

//Get all polls
router.get('/polls', (req, res, next) => {
    Poll.find()
        .then(polls => res.json(polls))
        .catch(err => res.json(err));
});

//Get specific poll
router.get('/polls/:pollId', (req, res, next) => {
    const { pollId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    
    Poll.findById(pollId)
        .then(poll => res.status(200).json(poll))
        .catch(error => res.json(error));
});

//Update specific poll
router.put('/polls/:pollId', (req, res, next) => {
    const { pollId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(pollId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
   
    Poll.findByIdAndUpdate(pollId, req.body, { returnDocument: 'after' })
        .then((updatedPoll) => res.json(updatedPoll))
        .catch(error => res.json(error));
  });

  //Delete specific poll   -- protect?? 
  router.delete('/polls/:pollId', (req, res, next) => {
    const { pollId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    
    Poll.findByIdAndRemove(pollId)
        .then((response) => {
            res.json({ message: `Poll with ${pollId} is removed successfully.` })
        })
    .catch(error => res.json(error));
  });


module.exports = router;

