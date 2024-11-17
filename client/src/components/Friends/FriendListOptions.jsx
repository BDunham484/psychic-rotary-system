// @ts-ignore
import styles from './styles/Friends.module.css';
import { useMutation } from '@apollo/client';
import {
    REMOVE_FRIEND,
    BLOCK_USER
} from '../../utils/mutations';
import { Delete } from '@styled-icons/fluentui-system-filled/Delete';
import { Blocked } from '@styled-icons/icomoon/Blocked';

const FriendListOptions = ({ friendId }) => {
    const {
        friendListDeleteIcon,
        friendListIcons,
        friendListOptions,
        optionsWrapper,
    } = styles;
    const [removeFriend] = useMutation(REMOVE_FRIEND);
    const [blockUser] = useMutation(BLOCK_USER);

    // Handler to remove friend from friend list
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
        <div id={friendListOptions}>
            <div className={optionsWrapper}>
                <p>
                    Block
                </p>
                <Blocked className={friendListIcons} onClick={() => handleBlock(friendId)} />
            </div>
            <div className={optionsWrapper}>
                <p>
                    Delete
                </p>
                <Delete className={friendListDeleteIcon} onClick={() => handleRemove(friendId)} />
            </div>
        </div>
    )
}

export default FriendListOptions
