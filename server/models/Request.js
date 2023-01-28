//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');


//create the schema for the model using the Schema constructor and outline the fields
const requestSchema = new Schema(
    {
        senderId: 
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
        receiverId: 
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
    }
);

//create the Invite model using the inviteSchema
const Request = model('Request', requestSchema);

//export the Guess schema
module.exports = Request;