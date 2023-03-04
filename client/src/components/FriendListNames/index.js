import { Link } from "react-router-dom";
import FriendListOptions from "../FriendListOptions";


const FriendListNames = ({ user, friendSwitch }) => {

    let userFriendsArr = [...user.friends];
    // sort the objects in the user's friends array in alphabetical order based off usernames
    userFriendsArr.sort(function (a, b) {
        if (a.username < b.username) {
            return -1;
        }
        if (a.username > b.username) {
            return 1;
        }
        return 0;
    });

    return (
        <div>
            <div className="friend-list-container">
                {user.friendCount <= 5 ? (
                    <div>
                        {userFriendsArr.map((friend, index) => (
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
                        {userFriendsArr.map((friend, index) => (
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

export default FriendListNames;
