import { useMutation } from '@apollo/client';
import {
    ACCEPT_FRIEND_REQUEST,
    DECLINE_FRIEND_REQUEST
} from '../../utils/mutations';
import { UserCheck } from '@styled-icons/icomoon/UserCheck';
import { UserMinus } from '@styled-icons/icomoon/UserMinus'

const ApproveDeny = ({ senderId, senderName }) => {
    
    const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
    const [declineRequest] = useMutation(DECLINE_FRIEND_REQUEST);

    const handleDeny = async (senderId, senderName) => {
        console.log('handleDeny: ' + senderId + ' | ' + senderName);
        try {
            await declineRequest({
                variables: { 
                    senderId: senderId,
                    senderName: senderName
                }
            })
        } catch (err) {
            console.error(err);
        }
    }

    const handleApprove = async (senderId, senderName) => {
        console.log('handleApprove: ' + senderId + ' | ' + senderName);
        try {
            await acceptRequest({
                variables: {
                    senderId: senderId,
                    senderName: senderName
                }
            }) 
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div>
            <UserCheck className='approve' onClick={() => handleApprove(senderId, senderName )} />
            <UserMinus className='deny' onClick={() => handleDeny(senderId, senderName)} />
        </div>
    )
}

export default ApproveDeny


