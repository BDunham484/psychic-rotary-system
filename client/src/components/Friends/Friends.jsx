import { useState } from "react";
import RequestBlock from "../RequestBlock/RequestBlock";
import PendingRequests from "../PendingRequests";
import FriendList from "../FriendList";
import BlockedFriends from "../BlockedFriends";


const Friends = ({ userParam, user }) => {

    const [inputSwitched, setInputSwitched] = useState(true);

    return (
        <div className="profile-friends-card">
            <div className="profile-friends-card-header" >
                <h2>Friends</h2>
            </div>
            <RequestBlock userParam={userParam} user={user} inputSwitched={inputSwitched} setInputSwitched={setInputSwitched} />
            {inputSwitched &&
                <>
                    <PendingRequests user={user} />
                    <FriendList user={user} />
                </>

            }
            {!inputSwitched &&
                <BlockedFriends user={user} />
            }
        </div>
    )
}

export default Friends

