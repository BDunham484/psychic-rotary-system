// @ts-ignore
import styles from './RequestBlock.module.css';
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SEND_FRIEND_REQUEST } from "../../utils/mutations";

const RequestButtons = (
    {
        user,
        inputData,
        friendName,
        friendId,
        btnDisabled,
        setBtnDisabled,
        setNoDice,
        setText
    }
) => {
    const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);

    const userId = user._id
    const sentFriendRequestsArr = user?.sentRequests || [];
    const userBlockedArr = inputData?.user?.blockedUsers || [];

    const {
        formDiv,
        alreadyDidTheThing,
        formRequestButton,
    } = styles;

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
            //setNoDice to true display conditional messaging
            setNoDice(true);
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

    //array of boolean responses based off whether the name entered into the friend request input is already in the user's sentRequest field
    const sentBoolArr = sentFriendRequestsArr.map((request) => {
        if (friendName === request.username) {
            return true;
        };
        return false
    });

    //if there is a true response in sentBoolArr save true to variable stillPending else false.  Use stillPending to conditionally display request buttons
    const stillPending = sentBoolArr.some(request => request === true);

    useEffect(() => {
        if (stillPending) {
            setBtnDisabled(stillPending)
        }
    })

    return (
        <>
            {stillPending ? (
                <div className={formDiv}>
                    <div className={alreadyDidTheThing}>Already Sent</div>
                </div>
            ) : (
                <div className={formDiv}>
                    <button
                        className={formRequestButton}
                        type="button"
                        disabled={btnDisabled}
                        onClick={() => { handleRequestSubmit(friendId, friendName, userBlockedArr, userId) }}
                    >
                        Send Request
                    </button>
                </div>
            )}
        </>
    )
}

export default RequestButtons;
