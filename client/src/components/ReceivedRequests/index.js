import ApproveDeny from "../ApproveDeny";

const ReceivedRequests = ({ user }) => {
    return (
        <div>
            {/* RECEIVED REQUESTS */}
            {/* {user.receivedCount > 0 &&
                <div className="sent-received">RECEIVED</div>
            } */}
            {/* RECEIVER - APPROVE/DENY */}
            <div className="friend-list-container">
                {user.receivedRequests.map((request, index) => (
                    <div key={index} className="names display-flex">
                        <div className="name">{request.username}</div>
                        <ApproveDeny senderId={request._id} senderName={request.username} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReceivedRequests;
