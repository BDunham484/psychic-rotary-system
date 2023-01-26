//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');


//create the schema for the model using the Schema constructor and outline the fields
const requestSchema = new Schema(
    {
        senderId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        senderUsername: {
            type: String
        },
        receiverId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        receiverUsername: {
            type: String
        },
        accepted: {
            type: Boolean
        }
    }
);

//create the Invite model using the inviteSchema
const Request = model('Invite', requestSchema);

//export the Guess schema
module.exports = Request;