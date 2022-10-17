//import mongoose
const mongoose = require('mongoose');

//if environment variable, MONGODB_URI exists, connect to it.  Else, connect to local MongoDB server's database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0:27017/psychic_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

//export the database connection
module.exports = mongoose.connection;