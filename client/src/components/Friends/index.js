import FriendRequestInput from "../FriendRequestInput";
import PendingRequests from "../PendingRequests";
import FriendList from "../FriendList";
import BlockedFriends from "../BlockedFriends";


const Friends = ({ userParam, user }) => {

    return (
        <div className="profile-friends-card">
            <FriendRequestInput userParam={userParam} user={user} />
            <PendingRequests user={user} />
            <FriendList user={user} />
            <BlockedFriends user={user} />
        </div>
    )
}

export default Friends

