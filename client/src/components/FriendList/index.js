import { useState } from "react";
import { Link } from "react-router-dom";
import FriendListOptions from "../FriendListOptions";
import Switch from 'react-switch';

const FriendList = ({ user }) => {

    const [friendSwitch, setFriendSwitch] = useState(true);

    const handleFriendSwitch = () => {
        friendSwitch ? setFriendSwitch(false) : setFriendSwitch(true)
    }
    // const userFriendNamesArr = [];
    const userFriends = user.friends;
    // userFriends.map((friend) => {
    //     userFriendNamesArr.push(friend.username);
    // });
    // const friendNamesArr = userFriendNamesArr.sort();
    // console.log(friendNamesArr);

    console.log(userFriends);
    userFriends.sort(function (a, b) {
        if (a.username < b.username) {
            return -1;
        }
        if (a.username > b.username) {
            return 1;
        }
        return 0;
    });
    console.log(userFriends);

    return (
        <div>
            {user.friendCount > 0 &&
                <div className="profile-friends-sub-header">
                    <div className="display-flex">
                        <h3 className="friends-sub-titles">Your Friends: </h3>
                        <div className="friends-sub-titles"> {user.friendCount}</div>
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
                </div>
            }
            <div className="friend-list-container">
                {user.friendCount <= 5 ? (
                    <div>
                        {/* {friendNamesArr.map((friend, index) => (
                            <div key={index} className="names display-flex">
                                <Link className="name" to={`/profile/${friend}`}>{friend}</Link>
                                {!friendSwitch &&
                                    <FriendListOptions friendId={friend._id} />
                                }
                            </div>
                        ))} */}
                        {user.friends.map((friend, index) => (
                            <div key={index} className="names display-flex">
                                <Link className="name" to={`/profile/${friend.username}`}>{friend.username}</Link>
                                {!friendSwitch &&
                                    <FriendListOptions friendId={friend._id} />
                                }
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="friend-list styled-scrollbars">
                    {user.friends.map((friend, index) => (
                        <div key={index} className="names display-flex">
                            <Link className="name" to={`/profile/${friend.username}`}>{friend.username}</Link>
                            {!friendSwitch &&
                                <FriendListOptions friendId={friend._id} />
                            }
                        </div>
                    ))}
                </div>
                )}

            </div>
        </div>
    )
}

export default FriendList;