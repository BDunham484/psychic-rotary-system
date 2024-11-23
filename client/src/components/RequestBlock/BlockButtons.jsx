// @ts-ignore
import styles from './RequestBlock.module.css';
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { BLOCK_USER } from "../../utils/mutations";

const BlockButtons = (
    { 
    user, 
    friendName, 
    friendId, 
    btnDisabled, 
    setBtnDisabled, 
    setFriend, 
    setText 
    }
) => {
    const [blockUser] = useMutation(BLOCK_USER);
    const {
        formDiv,
        alreadySentBlockedButton,
        formBlockButton,
    } = styles;

    const userId = user._id;
    const meBlockedArr = user?.blockedUsers || [];

    const handleBlockSubmit = async (friendId, friendName, userId) => {
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
        setText('');
    };

    //array of boolean responses based off whether the name entered into the block user input is already in the user's blockedUsers field
    const blockBoolArr = meBlockedArr.map((blocked) => {
        if (friendId === blocked._id) {
            return true
        };
        return false
    });

    //if there is a true response in blockBoolArr save to variable alreadyBlocked.  Use alreadyBlocked to conditionally display content
    const alreadyBlocked = blockBoolArr.some(block => block === true)

    useEffect(() => {
        if (alreadyBlocked) {
            setBtnDisabled(alreadyBlocked);
        }
    })

    return (
        <>
            {alreadyBlocked ? (
                <div className={formDiv}>
                    <div className={alreadySentBlockedButton}>Blocked</div>
                </div>
            ) : (
                <div className={formDiv}>
                    <button id={formBlockButton} type="button" disabled={btnDisabled} onClick={() => {
                        handleBlockSubmit(friendId, friendName, userId)
                    }} >Block User</button>
                </div>
            )}
        </>
    )
}

export default BlockButtons;
