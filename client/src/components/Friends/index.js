import { useState } from "react";
import RequestBlockInput from "../RequestBlockInput";
import PendingRequests from "../PendingRequests";
import FriendList from "../FriendList";
import BlockedFriends from "../BlockedFriends";


const Friends = ({ userParam, user }) => {

    const [inputSwitched, setInputSwitched] = useState(true);

    return (
        <div className="profile-friends-card">
            <RequestBlockInput userParam={userParam} user={user} inputSwitched={inputSwitched} setInputSwitched={setInputSwitched} />
            <PendingRequests user={user} />
            <FriendList user={user} />
            {!inputSwitched && 
            <BlockedFriends user={user} />
            }
        </div>
    )
}

export default Friends

