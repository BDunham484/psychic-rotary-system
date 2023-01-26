import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import {
    ADD_FRIEND,
    SEND_FRIEND_REQUEST,
    CANCEL_FRIEND_REQUEST,
    ACCEPT_FRIEND_REQUEST,
    DECLINE_FRIEND_REQUEST
} from "../../utils/mutations";
import { QUERY_USER } from "../../utils/queries";
import { Link } from "react-router-dom";
import { Cancel } from '@styled-icons/typicons/Cancel'
import  ApproveDeny  from '../ApproveDeny';

const Friends = ({ userParam, user }) => {
    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [friend, setFriend] = useState(false);

    //destructure mutation function 
    const [addFriend, { err }] = useMutation(ADD_FRIEND);
    const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);
    const [cancelRequest] = useMutation(CANCEL_FRIEND_REQUEST);
    const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
    const [declineRequest] = useMutation(DECLINE_FRIEND_REQUEST);

    

    //onClick handler for add friend
    const handleClick = async () => {
        try {
            await addFriend({
                variables: { id: user._id }
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleTextChange = (e) => {
        if (text === '') {
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        }
        setText(e.target.value)
    }


    //onSubmit handler to add a friend by user input
    const handleSubmit = async (friendName, friendId, event) => {
        // event.preventDefault();
        console.log("EVENT: " + event)
        console.log("FRIEND NAME: " + friendName)
        console.log('FRIEND ID: ' + friendId);
        if (!friendName) {
            console.log('user not found');
            //setFriend to true display conditional messaging
            setFriend(true);
        } else {
            // try {
            //     await addFriend({
            //         variables: { id: friendId }
            //     });
            // } catch (e) {
            //     console.error(e)
            // }
            try {
                await sendRequest({
                    variables: { 
                        username: friendName,
                        receiverId: friendId
                    }
                })
            } catch (e) {
                console.error(e);
            }
        }
    }

    const handleCancel = async (username) => {
        console.log('handleCancel Clicked: ' + username);
        try {
            await cancelRequest({
                variables: { username: username }
            });
        } catch (e) {
            console.error(e);
        }
    }

    const sentRequestArrLength = user.sentRequests.length;
    const receivedRequestsArrLength = user.receivedRequests.length;

    const friendName = text;
    console.log(friendName);

    //query user if use inputs text value in 'add friend' input
    const userdata = useQuery(QUERY_USER, {
        variables: { username: text }
    })
    const friendId = userdata?.data?.user?._id || '';
    console.log(friendId);
    const openRequests = userdata?.data?.user?.openRequests || [];

    const acceptedArr = openRequests.map((request) => {
        if (request.senderUsername === user.username) {
            return request.accepted
        } else return 'wrong request';
    })

    const notAccepted = acceptedArr.some(request => request === false);

    return (
        <div className="profile-friends-card">
            <div className="profile-friends-card-header">
                <h2>Friend Requests</h2>
            </div>
            {userParam &&
                <button onClick={handleClick}>
                    Add Friend
                </button>
            }
            {!userParam &&
                <form className="form-card" onSubmit={() => { handleSubmit(friendName, friendId) }}>
                    <div>
                        <input
                            onChange={handleTextChange}
                            type="text"
                            placeholder="Username"
                            value={text}
                        />
                    </div>
                    {friend &&
                        <div>USER NOT FOUND</div>
                    }
                    {notAccepted &&
                        <div>Request Pending</div>
                    }
                    <div>
                        <button type="submit" disabled={btnDisabled}>Send Request</button>
                    </div>
                </form>
            }
            {err && <div>An Error has occurred.</div>}

{/* PENDING REQUESTS */}
            <div className="profile-friends-list-header">
                <h2>Pending Requests</h2>
                <div>Total : {user.requestCount}</div>
            </div>
            {sentRequestArrLength > 0 && 
                <div>SENT</div>
            }
            <div className="friend-list-container">
                {user.sentRequests.map((request, index) => (
                    <div key={index} className="names display-flex">
                        <div>{request.receiverUsername}</div>
                        <Cancel className="cancel" onClick={() => handleCancel(request.receiverUsername)} />
                    </div>
                ))}
            </div>

            {receivedRequestsArrLength > 0 && 
                <div>RECEIVED</div>
            }
            <div className="friend-list-container">
                {user.receivedRequests.map((request, index) => (
                    <div key={index} className="names display-flex">
                        <div>{request.senderUsername}</div>
                        <ApproveDeny senderUsername={request.senderUsername} />
                    </div>
                ))}
            </div>

{/* FRIENDS LIST */}
            <div className="profile-friends-list-header">
                <h2>Friends</h2>
                <div>Total : {user.friendCount}</div>
            </div>
            <div className="friend-list-container">
                <div>
                    {user.friends.map((friend, index) => (
                        <div key={index} className="names">
                            <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Friends

// TODO
// 1. Hide pending request section if there are no pending request names in sentRequest User field
