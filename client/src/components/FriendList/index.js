import { useState } from "react";
import { Link } from "react-router-dom";
import FriendListOptions from "../FriendListOptions";
import Switch from 'react-switch';

const FriendList = ({ user }) => {

    const [friendSwitch, setFriendSwitch] = useState(true);

    const handleFriendSwitch = () => {
        friendSwitch ? setFriendSwitch(false) : setFriendSwitch(true)
    }

    return (
        <div>
            {user.friendCount > 0 &&
                <div className="profile-friends-sub-header">
                    <h2 className="friends-sub-titles">Friends List:</h2>
                    <div className="totals"> {user.friendCount}</div>
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
                </div>
            }
            <div className="friend-list-container">
                <div>
                    {user.friends.map((friend, index) => (
                        <div key={index} className="names display-flex">
                            <Link className="name" to={`/profile/${friend.username}`}>{friend.username}</Link>
                            {!friendSwitch && 
                            <FriendListOptions friendId={friend._id} />
                            }
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FriendList;