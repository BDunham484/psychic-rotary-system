//import the schema constructor and the model function from Mongoose
const { Schema, model } = require('mongoose');

//create the schema for the model using the Schema constructor and outline the fields
const concertSchema = new Schema(
    {
        date: {
            type: Date,
            required: true
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
        }
    }
);

//create the Concert model using the concertSchema
const User = model('Concert', concertSchema);

//export the Concert model
module.exports = Concert;