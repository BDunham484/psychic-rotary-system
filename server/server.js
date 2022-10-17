//import express.js package
const express = require('express');
//import database connection to MongoDB via Mongoose
const db = require('./config/connection');

//set environment variable
const PORT = process.env.PORT || 3001;
//instantiate the server
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: false }));
//parse incoming JSON data
app.use(express.json());

//establish connection to server via the listen() method
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});