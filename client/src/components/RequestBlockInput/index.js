import { useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { QUERY_USER } from "../../utils/queries";
import { ADD_FRIEND, SEND_FRIEND_REQUEST, BLOCK_USER } from "../../utils/mutations";
import Switch from 'react-switch';

const FriendRequestInput = ({ userParam, user, inputSwitched, setInputSwitched }) => {

    const [text, setText] = useState('');
    // const [pending, setPending] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [friend, setFriend] = useState(false);
    // const [inputSwitched, setInputSwitched] = useState(true);
    // const [blocked, setBlocked] = useState(false);
    console.log('is btn disbaled?: ' + btnDisabled);
    console.log('text: ' + text);


    const [addFriend] = useMutation(ADD_FRIEND);
    const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);
    const [blockUser] = useMutation(BLOCK_USER);

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
        setText(e.target.value)

        if (text === '') {
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        };
    };

    //onSubmit handler to add a friend by user input
    const handleRequestSubmit = async (friendId, friendName, userBlockedArr, userId) => {
        console.log('handleRequestSubmit clicked: ' + friendId + ' | ' + friendName);
        // event.preventDefault();
        const blockedBoolArr = userBlockedArr.map((blockedUser) => {
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
        };
        //reset input
        setText('');
    };

    const handleBlockSubmit = async (friendId, friendName, userId) => {
        console.log('handleBlockSubmit clicked: ' + friendId + ' | ' + userId);
        // event.preventDefault();
        const blockedBoolArr = meBlockedArr.map((blockedUser) => {
            if (friendId === blockedUser._id) {
                return true;
            };
            return false
        });
        const isBlocked = blockedBoolArr.some(block => block === true);
        if (isBlocked) {
            console.log('Already Blocked');
        } else if (!friendName) {
            console.log('user not found');
            //setFriend to true display conditional messaging
            setFriend(true);
        } else {
            try {
                await blockUser({
                    variables: {
                        blockedId: friendId
                    }
                })
            } catch (e) {
                console.error(e);
            };
        };
        //reset input
        setText('');
    };

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
    const userBlockedArr = userdata?.user?.blockedUsers || [];
    const meBlockedArr = user?.blockedUsers || [];
    const sentFriendRequestsArr = user?.sentRequests || [];

    //array of boolean responses based off whether the name entered into the block user input is already in the user's blockedUsers field
    const blockBoolArr = meBlockedArr.map((blocked) => {
        if (friendId === blocked._id) {
            return true
        };
        return false
    });

    //array of boolean responses based off whether the name entered into the friend request input is already in the user's sentRequest field
    const sentBoolArr = sentFriendRequestsArr.map((request) => {
        if (friendName === request.username) {
            return true;
        };
        return false
    });

    //if there is a true response in blockBoolArr save to variable alreadyBlocked.  Use alreadyBlocked to conditionally display content
    const alreadyBlocked = blockBoolArr.some(block => block === true);

    //if there is a true response in sentBoolArr save to variable stillPending.  Use stillPending to conditionally display content
    const stillPending = sentBoolArr.some(request => request === true);

    useEffect(() => {
        if (stillPending) {
            setBtnDisabled(stillPending);
        }

        if (alreadyBlocked) {
            setBtnDisabled(alreadyBlocked);
        }

    }, [stillPending, alreadyBlocked])

    const handleInputSwitch = () => {
        inputSwitched ? setInputSwitched(false) : setInputSwitched(true)
    };

    return (
        <div>
            <div className="profile-friends-card-header">
                {inputSwitched ? (
                    <>
                        <h2>Request</h2>
                        <label>
                            <Switch
                                onChange={handleInputSwitch}
                                checked={inputSwitched}
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
                                onChange={handleInputSwitch}
                                checked={inputSwitched}
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
                    <div className="form-input-wrapper">
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
                    {inputSwitched ?
                        stillPending ? (
                            <div className="form-div">
                                <div className="already-sent-blocked-button">Already Sent</div>
                            </div>
                        ) : (
                            <div className="form-div">
                                <button className="form-card-button" type="button" disabled={btnDisabled} onClick={() => { handleRequestSubmit(friendId, friendName, userBlockedArr, userId) }} >Send Request</button>
                            </div>
                        )
                        :
                        alreadyBlocked ? (
                            <div className="form-div">
                                <div className='already-sent-blocked-button'>Blocked</div>
                            </div>
                        ) : (
                            <div className="form-div">
                                <button id="form-block-button" type="button" disabled={btnDisabled} onClick={() => {
                                    handleBlockSubmit(friendId, friendName, userId)
                                }} >Block User</button>
                            </div>
                        )
                    }
                </form>
            }
        </div>
    )
}

export default FriendRequestInput;

