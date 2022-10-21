//import the schema constructor and the model function from Mongoose
const { Schema, model } = require('mongoose');

//create the schema for the model using the Schema constructor and outline the fields
const concertSchema = new Schema(
    {
        date: {
            type: Date,
            // required: true
        },
        artists: {
            type: [String]
        },
        event: {
            type: String
        },
        headliner: {
            type: String
        },
        support: {
            type: String
        },
        price: {
            type: Number
        },
        time: {
            type: Number
        },
        venue: {
            type: String
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zip: {
            type: Number
        }
    }
);

//create the Concert model using the concertSchema
const Concert = model('Concert', concertSchema);

//export the Concert model
module.exports = Concert;