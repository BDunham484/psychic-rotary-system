import { useMutation } from '@apollo/client';
import { REMOVE_FRIEND } from '../../utils/mutations';
import { Adblock } from '@styled-icons/simple-icons/Adblock'
import { UserMinus } from '@styled-icons/icomoon/UserMinus'


const FriendListOptions = ({ friendId }) => {

    const [removeFriend] = useMutation(REMOVE_FRIEND);

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

    return (
        <div>
            <Adblock className='friend-list-icons' />
            <UserMinus className="friend-list-icons" onClick={() => handleRemove(friendId)} />
        </div>
    )
}

export default FriendListOptions
