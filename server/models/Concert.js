//import the schema constructor and the model function from Mongoose
const { Schema, model } = require('mongoose');

//create the schema for the model using the Schema constructor and outline the fields
const concertSchema = new Schema(
    {
        artists: {
            type: String
        },
        artistsLink: {
            type: String
        },
        description: {
            type: String
        },
        dateTime: {
            type: String
        },
        venue: {
            type: String
        },
        address: {
            type: String
        }
    }
);

//create the Concert model using the concertSchema
const Concert = model('Concert', concertSchema);

//export the Concert model
module.exports = Concert;