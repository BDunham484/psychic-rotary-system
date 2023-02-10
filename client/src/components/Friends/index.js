import RequestBlockInput from "../RequestBlockInput";
import PendingRequests from "../PendingRequests";
import FriendList from "../FriendList";
import BlockedFriends from "../BlockedFriends";


const Friends = ({ userParam, user }) => {

    return (
        <div className="profile-friends-card">
            <RequestBlockInput userParam={userParam} user={user} />
            <PendingRequests user={user} />
            <FriendList user={user} />
            <BlockedFriends user={user} />
        </div>
    )
}

export default Friends

