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

const Friends = ({ userParam, user }) => {
    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [friend, setFriend] = useState(false);

    //destructure mutation function 
    const [addFriend, { err }] = useMutation(ADD_FRIEND);
    const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);

    const pendingRequests = user.sentRequests;
    // console.log(pendingRequests);

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
    const handleSubmit = async (friendName, event) => {
        // event.preventDefault();
        console.log("EVENT: " + event)
        console.log("ID: " + friendName)

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
                    variables: { username: friendName }
                })
            } catch (e) {
                console.error(e);
            }
        }
    }

    const friendName = text;
    console.log(friendName);

    //query user if use inputs text value in 'add friend' input
    const userdata = useQuery(QUERY_USER, {
        variables: { username: text }
    })
    // const friendId = userdata?.data?.user?._id || '';
    const openRequests = userdata?.data?.user?.openRequests || [];
    console.log(openRequests);

    const acceptedArr = openRequests.map((request) => {
        if (request.senderUsername === user.username) {
            return request.accepted
        } else return 'wrong request';
    })

    const notAccepted = acceptedArr.some(request => request === false);

    console.log(notAccepted);

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
                <form className="form-card" onSubmit={() => { handleSubmit(friendName) }}>
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


            <div className="profile-friends-list-header">
                <h2>Pending Requests</h2>
                <div>Total : {user.requestCount}</div>
            </div>
            <div className="friend-list-container">
                {pendingRequests.map((request, index) => (
                    <div key={index} className="names">
                        <div>{request.receiverUsername}</div>
                    </div>
                ))}
            </div>


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
