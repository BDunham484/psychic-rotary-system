import ApproveDeny from "../ApproveDeny/ApproveDeny";

const ReceivedRequests = ({ user }) => {
    console.log(user.receivedCount);
    return (
        <div>
            <div className="friend-list-container">
                {user.receivedCount <= 5 ? (
                    <div>
                        {user.receivedRequests.map((request, index) => (
                            <div key={index} className="names display-flex">
                                <div className="name">{request.username}</div>
                                <ApproveDeny senderId={request._id} senderName={request.username} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="friend-list styled-scrollbars">
                        {user.receivedRequests.map((request, index) => (
                            <div key={index} className="names display-flex">
                                <div className="name">{request.username}</div>
                                <ApproveDeny senderId={request._id} senderName={request.username} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReceivedRequests;
