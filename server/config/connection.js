//import mongoose
const mongoose = require('mongoose');

//if environment variable, MONGODB_URI exists, connect to it.  Else, connect to local MongoDB server's database
const uri = process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI
    : 'mongodb://localhost/psychic_db';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

//export the database connection
module.exports = mongoose.connection;