import SentRequests from "../SentRequests";
import ReceivedRequests from "../ReceivedRequests";

const PendingRequests = ({ user }) => {
    return (
        <div>
            {user.requestCount > 0 &&
                <div className="profile-friends-list-header">
                    <h2>Pending Requests</h2>
                    <div>Total : {user.requestCount}</div>
                </div>
            }
            <SentRequests user={user} />
            <ReceivedRequests user={user} />
        </div>
    )
}

export default PendingRequests;
