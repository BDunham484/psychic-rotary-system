// @ts-ignore
import styles from './styles/Friends.module.css';
import { useMutation } from '@apollo/client';
import {
    REMOVE_FRIEND,
    BLOCK_USER
} from '../../utils/mutations';
import { OctagonFill } from '@styled-icons/bootstrap/OctagonFill'
import { UserMinus } from '@styled-icons/icomoon/UserMinus'


const FriendListOptions = ({ friendId }) => {
    const {
        friendListIcons,
        friendListOptions,
        optionsWrapper,
    } = styles;
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

    // changelog-start
    return (
        <div id={friendListOptions}>
            <div className={optionsWrapper}>
                <p>
                    Block
                </p>
                <OctagonFill className={friendListIcons} onClick={() => handleBlock(friendId)} />
            </div>
            <div className={optionsWrapper}>
                <p>
                    Delete
                </p>
                <UserMinus className={friendListIcons} onClick={() => handleRemove(friendId)} />
            </div>
        </div>
    )
    // return (
    //     <div>
    //         <OctagonFill className={friendListIcons} onClick={() => handleBlock(friendId)} />
    //         <UserMinus className={friendListIcons} onClick={() => handleRemove(friendId)} />
    //     </div>
    // )
    // changelog-end
}

export default FriendListOptions
