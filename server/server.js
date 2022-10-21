//import express.js package
const express = require('express');
//import ApolloServer
const { ApolloServer } = require('apollo-server-express');
//import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
//import database connection to MongoDB via Mongoose
const db = require('./config/connection');
// const { type } = require('os');
//import Auth middleware
const { authMiddleware } = require('./utils/auth');

const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.austinchronicle.com/events/music/2022-10-21/'

//set environment variable
const PORT = process.env.PORT || 3001;
//create a new Apollo server and pass in our schema data
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});
//instantiate the server
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: false }));
//parse incoming JSON data
app.use(express.json());

axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const events = [];
            $('.list-item', html).each(function() {
                const artists = $(this).find('h2').text()
                const description = $(this).find('.description').text()
                const dateTime = $(this).find('.date-time').text()
                const venue = $(this).find('.venue').text()
                events.push({
                    artists,
                    description,
                    dateTime,
                    venue
                })
            })
            console.log('events scraper!!!!!');
            console.log(events);
            return events;
        }).catch(err => console.log(err));



//create a new instance of an Apollo server with the GraphQl schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    //integrate our Apollo server with the Express application as middleware
    server.applyMiddleware({ app });

    //establish connection to server via the listen() method
    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
};

//call the async function to start the server
startApolloServer(typeDefs, resolvers);

