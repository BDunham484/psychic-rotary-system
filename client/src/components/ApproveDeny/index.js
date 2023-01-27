import { useMutation } from '@apollo/client';
import {
    ACCEPT_FRIEND_REQUEST,
    DECLINE_FRIEND_REQUEST
} from '../../utils/mutations';
import { UserCheck } from '@styled-icons/icomoon/UserCheck';
import { UserMinus } from '@styled-icons/icomoon/UserMinus'

const ApproveDeny = ({ senderUsername, eventId, senderId, receiverId }) => {
    
    const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
    const [declineRequest] = useMutation(DECLINE_FRIEND_REQUEST);

    const handleDeny = async (senderUsername, eventId) => {
        console.log('handleDeny');
        try {
            await declineRequest({
                variables: { 
                    username: senderUsername, 
                    eventId: eventId
                }
            })
        } catch (e) {
            console.error(e);
        }
    }

    const handleApprove = async (senderUsername, eventId, senderId, receiverId) => {
        console.log('handleApprove: ' + senderUsername, eventId, senderId, receiverId);
        try {
            await acceptRequest({
                variables: {
                    username: senderUsername,
                    eventId: eventId,
                    senderId: senderId,
                    receiverId: receiverId
                }
            }) 
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div>
            <UserCheck className='approve' onClick={() => handleApprove(senderUsername, eventId, senderId, receiverId)} />
            <UserMinus className='deny' onClick={() => handleDeny(senderUsername, eventId)} />
        </div>
    )
}

export default ApproveDeny

// NOTES: need to figure out why I can't query user and get all of the new data from the receivedRequest User field
