import { Link } from "react-router-dom";
import FriendListOptions from "../FriendListOptions";

const FriendList = ({ user }) => {
    return (
        <div>
            {user.friendCount > 0 &&
                <div className="profile-friends-list-header">
                    <h2>Friends</h2>
                    <div>Total : {user.friendCount}</div>
                </div>
            }
            <div className="friend-list-container">
                <div>
                    {user.friends.map((friend, index) => (
                        <div key={index} className="names display-flex">
                            <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
                            <FriendListOptions friendId={friend._id} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FriendList;