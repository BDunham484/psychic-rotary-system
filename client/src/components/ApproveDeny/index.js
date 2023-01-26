import { useMutation } from '@apollo/client';
import {
    ACCEPT_FRIEND_REQUEST,
    DECLINE_FRIEND_REQUEST
} from '../../utils/mutations';
import { UserCheck } from '@styled-icons/icomoon/UserCheck';
import { UserMinus } from '@styled-icons/icomoon/UserMinus'

const ApproveDeny = ({ senderUsername }) => {
    
    const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
    const [declineRequest] = useMutation(DECLINE_FRIEND_REQUEST);

    const handleDeny = async () => {
        console.log('handleDeny');
        try {
            await declineRequest({
                variables: { username: senderUsername }
            })
        } catch (e) {
            console.error(e);
        }
    }

    const handleApprove = () => {
        console.log('handleApprove');
    }

    return (
        <div>
            <UserCheck className='approve' onClick={() => handleApprove(senderUsername)} />
            <UserMinus className='deny' onClick={() => handleDeny(senderUsername)} />
        </div>
    )
}

export default ApproveDeny

// NOTES: need to figure out why I can't query user and get all of the new data from the receivedRequest User field
