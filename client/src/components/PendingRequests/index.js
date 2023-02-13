import SentRequests from "../SentRequests";
import ReceivedRequests from "../ReceivedRequests";

const PendingRequests = ({ user }) => {
    return (
        <div>
            {user.requestCount > 0 &&
                <div className="profile-friends-sub-header">
                    <h2 className="friends-sub-titles">Pending Requests</h2>
                    <div className="totals">{user.requestCount}</div>
                </div>
            }
            <SentRequests user={user} />
            <ReceivedRequests user={user} />
        </div>
    )
}

export default PendingRequests;
