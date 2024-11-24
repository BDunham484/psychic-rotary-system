// @ts-ignore
import styles from './RequestBlock.module.css';
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_USER } from "../../utils/queries";
import RequestButtons from "./RquestButtons";
import BlockButtons from "./BlockButtons";
import FormCard from "../shared/FormCard/FormCard";
import { Send } from '@styled-icons/bootstrap/Send';
import { Blocked } from '@styled-icons/icomoon/Blocked';

const RequestBlockForm = ({ userParam, inputSwitched, user }) => {
    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [noDice, setNoDice] = useState(false);
    const {
        requestBlockForm,
        formInputWrapper,
        profileFriendsCardInput,
        requestBlockIcon,
        inputLabel,
    } = styles;

    //query user if user inputs text value in 'add friend' input
    const { loading, data: inputData, startPolling, stopPolling } = useQuery(QUERY_USER, {
        variables: { username: text }
    });

    useEffect(() => {
        if (!loading) {
            startPolling(1000);
            return () => {
                stopPolling()
            };
        }
    }, [loading]);

    //handler for friend request text input
    const handleTextChange = (e) => {
        setText(e.target.value)

        if (text === '') {
            setBtnDisabled(true)
            setNoDice(false)
        } else {
            setBtnDisabled(false)
        };
    };

    // Capture the name of the friend the user wishes to send a request to via state set by the request input. Used to submit the friend request handler: submitHandler
    const friendName = text;
    const friendId = inputData?.user?._id || '';

    return (
        <div>
            {!userParam &&
                <FormCard>
                    <form className={requestBlockForm}>
                        <label className={inputLabel}>
                            {inputSwitched ?
                                <Send className={requestBlockIcon} /> :
                                <Blocked className={requestBlockIcon} />
                            }
                            <input
                                onChange={handleTextChange}
                                type="text"
                                placeholder="Username"
                                value={text}
                                className={profileFriendsCardInput}
                            />
                        </label>
                        {noDice &&
                            <div>No Dice</div>
                        }
                        {inputSwitched ?
                            <RequestButtons
                                user={user}
                                inputData={inputData}
                                friendName={friendName}
                                friendId={friendId}
                                btnDisabled={btnDisabled}
                                setBtnDisabled={setBtnDisabled}
                                setNoDice={setNoDice}
                                setText={setText}
                            />
                            :
                            <BlockButtons
                                user={user}
                                friendName={friendName}
                                friendId={friendId}
                                btnDisabled={btnDisabled}
                                setBtnDisabled={setBtnDisabled}
                                setNoDice={setNoDice}
                                setText={setText}
                            />
                        }
                    </form>
                </FormCard>
            }
        </div>
    )
}

export default RequestBlockForm;
