// @ts-ignore
import styles from './styles/Friends.module.css';
import { Link } from "react-router-dom";
import FriendListOptions from "./FriendListOptions";
import Switch from 'react-switch';
import { useMemo, useState } from 'react';
import SkeletonFriendListItem from './SkeletonFriendListItem';

const FriendList = ({ user }) => {
    const [friendSwitch, setFriendSwitch] = useState(true);
    const [friendSwitchId, setFriendSwitchId] = useState(null);
    const {
        friendListContainer,
        friendListScroll,
        styledScrollbars,
        names,
        friendListOptionsWrapper,
    } = styles;

    const arrayLength = useMemo(() => {
        if (user?.friendCount < 8) {
            return 8 - user?.friendCount
        } else {
            return 0;
        }
    }, [user?.friendCount]);

    const subArray = [];

    if (arrayLength > 0) {
        for (let i = 0; i < arrayLength; i++) {
            subArray.push({ 'skeleton': i});
        }
    }

    let usersFriends = [
        ...user.friends,
        ...subArray,
    ];

    // Sort 
    usersFriends.sort(function (a, b) {
        if (a.username < b.username) {
            return -1;
        }
        if (a.username > b.username) {
            return 1;
        }
        return 0;
    });

    const handleFriendSwitch = (friendId) => {
        friendSwitch ? setFriendSwitch(false) : setFriendSwitch(true)
        friendSwitch ? setFriendSwitchId(friendId) : setFriendSwitchId(null);
    }

    return (
        <div>
            <div className={friendListContainer}>
                <div className={user.friendCount > 8 ? `${friendListScroll} ${styledScrollbars}` : ''}>
                    {usersFriends.map((friend, index) => {
                        if (!!friend?._id) {
                            return (
                                <div key={friend._id}>
                                    <div className={names}>
                                        <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
                                        <Switch
                                            onChange={() => handleFriendSwitch(friend._id)}
                                            checked={!friendSwitch && friendSwitchId === friend._id}
                                            offColor={'#525050'}
                                            onColor={'#525050'}
                                            offHandleColor={'#383737'}
                                            onHandleColor={'#383737'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow={'#eee3d0'}
                                            activeBoxShadow={'#eee3d0'}
                                        />
                                    </div>
                                    {(!friendSwitch && friendSwitchId === friend._id) &&
                                        <div className={friendListOptionsWrapper}>
                                            <FriendListOptions friendId={friend._id} />
                                        </div>
                                    }
                                </div>
                            )
                        } else {
                            return (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <SkeletonFriendListItem />
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}

export default FriendList;
