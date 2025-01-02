import { useMutation } from '@apollo/client'
import { CANCEL_FRIEND_REQUEST } from '../../utils/mutations'
import { Cancel } from '@styled-icons/typicons/Cancel'

const SentRequests = ({ user }) => {

    const [cancelRequest] = useMutation(CANCEL_FRIEND_REQUEST);

    //handler to cancel a sent friend request
    const handleCancel = async (friendId, friendName) => {
        console.log('handleCancel Clicked: ' + friendId + ' | ' + friendName);
        try {
            await cancelRequest({
                variables: {
                    friendId: friendId,
                    friendName: friendName
                }
            });
        } catch (e) {
            console.error(e);
        };
    };

    return (
        <div>
            <div className='friend-list-container'>
                {user.sentCount <= 5 ? (
                    <div>
                        {user.sentRequests.map((request, index) => (
                            <div key={index} className='names display-flex'>
                                <div className='name'>{request.username}</div>
                                <Cancel className='cancel' onClick={() => handleCancel(request._id, request.username)} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='friend-list styled-scrollbars'>
                        {user.sentRequests.map((request, index) => (
                            <div key={index} className='names display-flex'>
                                <div className='name'>{request.username}</div>
                                <Cancel className='cancel' onClick={() => handleCancel(request._id, request.username)} />
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default SentRequests
