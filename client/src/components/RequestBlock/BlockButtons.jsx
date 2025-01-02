// @ts-ignore
import styles from './RequestBlock.module.css';
import { useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { BLOCK_USER } from '../../utils/mutations';

const BlockButtons = (
    {
        user,
        friendName,
        friendId,
        btnDisabled,
        setBtnDisabled,
        setNoDice,
        setText,
    }
) => {
    const [blockUser] = useMutation(BLOCK_USER);
    const {
        formDiv,
        alreadyDidTheThing,
        formBlockButton,
    } = styles;

    const handleBlockSubmit = async (friendId, friendName) => {        
        if (!friendName) {
            setNoDice(true);
        } else {
            try {
                await blockUser({
                    variables: {
                        blockedId: friendId
                    }
                })
            } catch (err) {
                console.log(err);
            };
        };
        setText('');
    };

    const alreadyBlocked = user?.blockedUsers.find(user => user._id === friendId);

    useMemo(() => {
        if (!!alreadyBlocked) {
            setBtnDisabled(true);
        }
    }, [alreadyBlocked]);

    return (
        <>
            {alreadyBlocked ? (
                <div className={formDiv}>
                    <div className={alreadyDidTheThing}>Already Blocked</div>
                </div>
            ) : (
                <div className={formDiv}>
                    <button
                        id={formBlockButton}
                        type='button'
                        disabled={btnDisabled}
                        onClick={() => {handleBlockSubmit(friendId, friendName)}}
                    >
                        Block User
                    </button>
                </div>
            )}
        </>
    )
}

export default BlockButtons;
