import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import {
    ADD_FRIEND,
    SEND_FRIEND_REQUEST,
    CANCEL_FRIEND_REQUEST,
    UNBLOCK_USER
} from "../../utils/mutations";
import { QUERY_USER } from "../../utils/queries";
import { Link } from "react-router-dom";
import { Cancel } from '@styled-icons/typicons/Cancel'
import { Blocked } from '@styled-icons/octicons/Blocked'
import ApproveDeny from '../ApproveDeny';
import FriendListOptions from "../FriendListOptions";
import BlockedFriends from "../BlockedFriends";

const Friends = ({ userParam, user }) => {
    console.log(user);

    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [friend, setFriend] = useState(false);
    const [pending, setPending] = useState(false)

    //destructure mutation functions 
    const [addFriend, { err }] = useMutation(ADD_FRIEND);
    const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);
    const [cancelRequest] = useMutation(CANCEL_FRIEND_REQUEST);
    const [unblockUser] = useMutation(UNBLOCK_USER);

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
    //handler for friend request text input
    const handleTextChange = (e) => {
        if (text === '' || pending) {
            console.log('I SHOULD BE DISABLED');
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        }
        setText(e.target.value)
    }
    //onSubmit handler to add a friend by user input
    const handleSubmit = async (friendId, friendName, blockedArr) => {
        console.log('handleSubmit clicked: ' + friendId + ' | ' + friendName);
        // event.preventDefault();
        const blockedBoolArr = blockedArr.map((blockedUser) => {
            if (friendId === blockedUser._id) {
                return true;
            };
            return false
        });
        const isBlocked = blockedBoolArr.some(block => block === true);

        if (isBlocked) {
            console.log('blocked');
        } else if (!friendName) {
            console.log('user not found');
            //setFriend to true display conditional messaging
            setFriend(true);
        } else {
            try {
                await sendRequest({
                    variables: {
                        friendId: friendId,
                        friendName: friendName
                    }
                })
            } catch (e) {
                console.error(e);
            }
        }
        //reset input
        setText('');
    }
    //handler to cancel a sent friend request
    const handleCancel = async (friendId, friendName) => {
        console.log('handleCancel Clicked: ' + friendId + ' | ' + friendName);
        try {
            await cancelRequest({
                variables: {
                    friendId: friendId,
                    friendName: friendName
                }
            });
        } catch (e) {
            console.error(e);
        };
    };
    //handler to unblock a user
    const handleUnblock = async (blockedId) => {
        console.log('handleUnblock Clicked: ' + blockedId);
        try {
            await unblockUser({
                variables: {
                    blockedId: blockedId
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    //capture the name of the friend the user wishes to send a request to via state set by the request input. Used to submit the friend request handler: submitHanlder
    const friendName = text;
    console.log(friendName);
    //query user if user inputs text value in 'add friend' input
    const userdata = useQuery(QUERY_USER, {
        variables: { username: text }
    });
    //capture the _id of the friend the user wishes to send a request to via QUERY_USER above.  Used in handlers related to friend requests.
    const friendId = userdata?.data?.user?._id || '';
    console.log(friendId);
    const blockedArr = userdata?.data?.user?.blockedUsers || [];
    const sentFriendRequestsArr = user?.sentRequests || [];
    //array of boolean responses based off whether the name entered into the friend request input is already in the user's sentRequest field
    const sentBoolArr = sentFriendRequestsArr.map((request) => {
        if (friendName === request.username) {
            return true;
        };
        return false
    });
    //if there is a true response in sentBoolArr save to variable stillPending.  Use stillPending to conditionally display content
    const stillPending = sentBoolArr.some(request => request === true);
    useEffect(() => {
        if (stillPending) {
            setPending(stillPending);
        }
    }, [stillPending])

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
                <form className="form-card">
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
                    {stillPending ? (
                        <div>
                            <div id="already-sent-button">Already Sent</div>
                        </div>
                    ) : (
                        <div>
                            <button className="form-card-button" type="button" disabled={btnDisabled} onClick={() => { handleSubmit(friendId, friendName, blockedArr) }} >Send Request</button>
                        </div>
                    )
                    }
                </form>
            }
            {err && <div>An Error has occurred.</div>}

            {/* PENDING REQUESTS */}
            {user.requestCount > 0 &&
                <div className="profile-friends-list-header">
                    <h2>Pending Requests</h2>
                    <div>Total : {user.requestCount}</div>
                </div>
            }
            {user.sentCount > 0 &&
                <div>SENT</div>
            }
            {/* SENDER - CANCEL */}
            <div className="friend-list-container">
                {user.sentRequests.map((request, index) => (
                    <div key={index} className="names display-flex">
                        <div>{request.username}</div>
                        <Cancel className="cancel" onClick={() => handleCancel(request._id, request.username)} />
                    </div>
                ))}
            </div>

            {/* RECEIVED REQUESTS */}
            {user.receivedCount > 0 &&
                <div>RECEIVED</div>
            }
            {/* RECEIVER - APPROVE/DENY */}
            <div className="friend-list-container">
                {user.receivedRequests.map((request, index) => (
                    <div key={index} className="names display-flex">
                        <div>{request.username}</div>
                        <ApproveDeny senderId={request._id} senderName={request.username} />
                    </div>
                ))}
            </div>

            {/* FRIENDS LIST */}
            {user.friendCount > 0 &&
                <div className="profile-friends-list-header">
                    <h2>Friends</h2>
                    <div>Total : {user.friendCount}</div>
                </div>
            }
            <div className="friend-list-container">
                <div>
                    {user.friends.map((friend, index) => (
                        <div key={index} className="names display-flex">
                            <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
                            <FriendListOptions friendId={friend._id} />
                        </div>
                    ))}
                </div>
            </div>

            {/* BLOCKED FRIENDS LIST */}
            <BlockedFriends user={user} />
            {user.blockedCount > 0 &&
                <div className="profile-friends-list-header">
                    <h2>Blocked</h2>
                    <div>Total : {user.blockedCount}</div>
                </div>
            }
            <div>
                {user.blockedUsers.map((blocked, index) => (
                    <div key={index} className="names display-flex">
                        <Link to={`/profile/${blocked.username}`}>
                            {blocked.username}
                        </Link>
                        <Blocked className="friend-list-icons" onClick={() => handleUnblock(blocked._id)} />
                    </div>
                ))}
            </div>



        </div>
    )
}

export default Friends

// NOTES: MAKE SURE THAT WHEN A FRIEND REQUEST IS SENT IT CHECKS TO MAKE SURE THAT CONTEXT.USER ISN'T IN THE REQUESTING USERS BLOCKED USER LIST
