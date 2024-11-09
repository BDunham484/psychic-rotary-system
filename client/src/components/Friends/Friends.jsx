// @ts-ignore
import styles from './styles/Friends.module.css';
import { useState, useEffect } from "react";
import FriendList from "./FriendList";
import FriendSearch from "./FriendSearch";
// import Expander from "../shared/Expander";
import Switch from 'react-switch';

const Friends = ({ user }) => {
    const [friendSwitch, setFriendSwitch] = useState(true);
    const [expand, setExpand] = useState(false);
    const {
        friendListWrapper,
        profileFriendsSubHeader,
        friendsSubTitles,
        friendCount,
        friendListIcons
    } = styles;

    // switch handler to hide/display friend list options
    const handleFriendSwitch = () => {
        friendSwitch ? setFriendSwitch(false) : setFriendSwitch(true)
    }

    useEffect(() => {
        if (user.friendCount === 0) {
            setExpand(false);
        }
    }, [user])

    console.log('user: ', user);


    return (
        <div id={`${friendListWrapper} display-flex`}>
            {/* <div className={profileFriendsSubHeader}>
                <div className={friendsSubTitles}>
                    {`Total: ${user.friendCount}`}
                </div>
                <Switch
                    onChange={handleFriendSwitch}
                    checked={friendSwitch}
                    offColor={'#525050'}
                    onColor={'#525050'}
                    offHandleColor={'#383737'}
                    onHandleColor={'#383737'}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow={'#eee3d0'}
                    activeBoxShadow={'#eee3d0'}
                />
            </div> */}
            <FriendSearch user={user} />
            <FriendList user={user} />
        </div>
    )
}

export default Friends;