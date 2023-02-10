import { useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { QUERY_USER } from "../../utils/queries";
import { ADD_FRIEND, SEND_FRIEND_REQUEST } from "../../utils/mutations";
import Switch from 'react-switch';

const FriendRequestInput = ({ userParam, user }) => {

    const [text, setText] = useState('');
    const [pending, setPending] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [friend, setFriend] = useState(false);
    const [switched, setSwitched] = useState(true);


    const [addFriend] = useMutation(ADD_FRIEND);
    const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);

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
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        }
        setText(e.target.value)
    }

    //onSubmit handler to add a friend by user input
    const handleSubmit = async (friendId, friendName, blockedArr, userId) => {
        console.log('handleSubmit clicked: ' + friendId + ' | ' + friendName);
        // event.preventDefault();
        const blockedBoolArr = blockedArr.map((blockedUser) => {
            if (userId === blockedUser._id) {
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
            };
        }
        //reset input
        setText('');
    }

    //capture the name of the friend the user wishes to send a request to via state set by the request input. Used to submit the friend request handler: submitHanlder
    const friendName = text;
    console.log(friendName);

    //query user if user inputs text value in 'add friend' input
    const { loading, data: userdata, startPolling, stopPolling } = useQuery(QUERY_USER, {
        variables: { username: text }
    });

    useEffect(() => {
        if (loading) {
            console.log('Loading user query...');
        } else {
            //runs the query every second
            startPolling(1000);
            return () => {
                stopPolling()
            };
        }
    })
    //capture the _id of the friend the user wishes to send a request to via QUERY_USER above.  Used in handlers related to friend requests.
    const friendId = userdata?.user?._id || '';
    console.log(friendId);
    const userId = user._id;
    const blockedArr = userdata?.user?.blockedUsers || [];
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

    const handleSwitch = () => {
        switched ? setSwitched(false) : setSwitched(true)
    };

    return (
        <div>
            <div className="profile-friends-card-header">
                {switched ? (
                    <>
                        <h2>Request</h2>
                        <label>
                            <Switch
                                onChange={handleSwitch}
                                checked={switched}
                                offColor={'#525050'}
                                onColor={'#525050'}
                                offHandleColor={'#383737'}
                                onHandleColor={'#383737'}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow={'#eee3d0'}
                                activeBoxShadow={'#eee3d0'}
                            />
                        </label>
                        <h2 className="unSwitched">Block</h2>
                    </>
                ) : (
                    <>
                        <h2 className="unSwitched">Request</h2>
                        <label>
                            <Switch
                                onChange={handleSwitch}
                                checked={switched}
                                offColor={'#525050'}
                                onColor={'#525050'}
                                offHandleColor={'#383737'}
                                onHandleColor={'#383737'}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow={'#eee3d0'}
                                activeBoxShadow={'#eee3d0'}
                            />
                        </label>
                        <h2>Block</h2>
                    </>
                )}
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
                    {switched ?
                        stillPending ? (
                            <div>
                                <div id="already-sent-button">Already Sent</div>
                            </div>
                        ) : (
                            <div>
                                <button className="form-card-button" type="button" disabled={btnDisabled} onClick={() => { handleSubmit(friendId, friendName, blockedArr, userId) }} >Send Request</button>
                            </div>
                        )
                        :
                        <div>
                            <div id="form-block-button">Block User</div>
                        </div>
                    }
                    {/* {stillPending ? (
                        <div>
                            <div id="already-sent-button">Already Sent</div>
                        </div>
                    ) : (
                        <div>
                            <button className="form-card-button" type="button" disabled={btnDisabled} onClick={() => { handleSubmit(friendId, friendName, blockedArr, userId) }} >Send Request</button>
                        </div>
                    )
                    } */}
                </form>
            }
        </div>
    )
}

export default FriendRequestInput;
