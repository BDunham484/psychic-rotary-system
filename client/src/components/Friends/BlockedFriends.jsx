// @ts-ignore
import styles from './styles/Friends.module.css';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { UNBLOCK_USER } from '../../utils/mutations';
import { Blocked } from '@styled-icons/octicons/Blocked';
import Expander from '../shared/Expander';

const BlockedFriends = ({ user }) => {
    const [expand, setExpand] = useState(false);
    const {
        blockedFriendsWrapper,
        profileFriendsSubHeader,
        friendsSubTitle,
        friendCount,
        names,
        name,
        friendListIcons,
    } = styles;

    const [unblockUser] = useMutation(UNBLOCK_USER);

    //handler to unblock a user
    const handleUnblock = async (blockedId) => {
        console.log('handleUnblock Clicked: ' + blockedId);
        try {
            await unblockUser({
                variables: {
                    blockedId: blockedId
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    console.log('blockedCount: ' + user.blockedCount)

    return (
        <div id={blockedFriendsWrapper}>
            {user.blockedCount > 0 &&
                <div className={profileFriendsSubHeader}>
                    <Expander expand={expand} setExpand={setExpand} />
                    <h3 className={friendsSubTitle}>Blocked</h3>
                    <div className={friendCount}>{user.blockedCount}</div>
                </div>
            }
            {expand &&
                <div>
                    {user.blockedCount <= 5 ? (
                        <div>
                            {user.blockedUsers.map((blocked, index) => (
                                <div key={index} className={`${names} display-flex`}>
                                    <Link className={name} to={`/profile/${blocked.username}`}>
                                        {blocked.username}
                                    </Link>
                                    <Blocked className={friendListIcons} onClick={() => handleUnblock(blocked._id)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='blocked-list styled-scrollbars'>
                            {user.blockedUsers.map((blocked, index) => (
                                <div key={index} className={`${names} display-flex`}>
                                    <Link className={name} to={`/profile/${blocked.username}`}>
                                        {blocked.username}
                                    </Link>
                                    <Blocked className={friendListIcons} onClick={() => handleUnblock(blocked._id)} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default BlockedFriends
