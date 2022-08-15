# Rumble - your eventplanningtool 

## Intro

Say goodbye to hundreds of different whatsapp chats and exploding messages and discussions. See and plan all your events in one place with your friends and decide on details based on votings (Do you want red wine or white wine?) or even plan a private poll for deciding ona gift for the amazing host of the event you are attending. 

## Used Technologies 

The application is built based on the MERN stack (MongoDB, Express, React and Node.JS). The SPA frontend built with React consists of multiple views and implements all CRUD actions by communicating with a REST API backend built with ExpressJS, MongoDB and Mongoose.

This is the backend repository of the application. Check out the frontend repository here:
https://github.com/codingTeamLHLR/eventplanningtool_client

## Demo 

Check out our app here (and please not that it is designed for mobile): 
https://eventplanningtool.netlify.app/events

### How to run the app on local

Environment variables needed: 

- PORT=5005
- TOKEN_SECRET
- ORIGIN=http://localhost:3000

For using picture upload, you need a cloudinary account and set the above mentioned variables.

Run `npm run dev` to run the node.js application
