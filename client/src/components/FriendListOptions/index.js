import { useMutation } from '@apollo/client';
import { 
    REMOVE_FRIEND,
    BLOCK_USER
} from '../../utils/mutations';
// import { Blocked } from '@styled-icons/octicons/Blocked'
import { OctagonFill } from '@styled-icons/bootstrap/OctagonFill'
import { UserMinus } from '@styled-icons/icomoon/UserMinus'


const FriendListOptions = ({ friendId }) => {

    const [removeFriend] = useMutation(REMOVE_FRIEND);
    const [blockUser] = useMutation(BLOCK_USER);

    //handler to remove friend from friend list
    const handleRemove = async (friendId) => {
        console.log('handleRemove Clicked: ' + friendId);
        try {
            await removeFriend({
                variables: {
                    friendId: friendId
                }
            });
        } catch (e) {
            console.error(e);
        };
    };

    const handleBlock = async (blockedId) => {
        console.log('handleBlock: ' + blockedId);
        try {
            await blockUser({
                variables: {
                    blockedId: blockedId
                }
            });
        } catch (e) {
            console.error(e);
        };

        try {
            await removeFriend({
                variables: {
                    friendId: blockedId
                }
            });
        } catch (e) {
            console.error(e);
        };
    };

    return (
        <div>
            <OctagonFill className='friend-list-icons' onClick={() => handleBlock(friendId)} />
            <UserMinus className="friend-list-icons" onClick={() => handleRemove(friendId)} />
        </div>
    )
}

export default FriendListOptions
