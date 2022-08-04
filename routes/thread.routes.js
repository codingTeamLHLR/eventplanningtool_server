const router = require("express").Router();
const mongoose = require('mongoose');

const Thread = require('../models/Thread.model');


//Create a new threads
router.post('/threads', (req, res, next) => {
    const { title, messages, participants, event } = req.body;
  
    Thread
        .create({ 
            title, 
            messages, 
            participants, 
            event
        })
        .then(response => res.json(response))
        .catch(err => res.json(err));
  });

//Get all threads
router.get('/threads', (req, res, next) => {
    Thread.find()
        .then(threads => res.json(threads))
        .catch(err => res.json(err));
});

//Get specific thread
router.get('/threads/:threadId', (req, res, next) => {
    const { threadId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(threadId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    
    Thread.findById(threadId)
        .then(thread => res.status(200).json(thread))
        .catch(error => res.json(error));
});

//Update specific thread
router.put('/threads/:threadId', (req, res, next) => {
    const { threadId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(threadId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
   
    Thread.findByIdAndUpdate(threadId, req.body, { returnDocument: 'after' })
        .then((updatedThread) => res.json(updatedThread))
        .catch(error => res.json(error));
  });

  //Delete specific thread   -- protect?? 
  router.delete('/threads/:threadId', (req, res, next) => {
    const { threadId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(threadId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    
    Thread.findByIdAndRemove(threadId)
        .then((response) => {
            res.json({ message: `Thread with ${threadId} is removed successfully.` })
        })
    .catch(error => res.json(error));
  });


module.exports = router;

