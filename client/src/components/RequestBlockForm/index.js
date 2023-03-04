import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_USER } from "../../utils/queries";
import RequestButtons from "../RequestButtons";
import BlockButtons from "../BlockButtons";

const RequestBlockForm = ({ userParam, inputSwitched, user }) => {

    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [friend, setFriend] = useState(false);
    console.log('is btn disbaled?: ' + btnDisabled);
    console.log('text: ' + text);

    //query user if user inputs text value in 'add friend' input
    const { loading, data: inputData, startPolling, stopPolling } = useQuery(QUERY_USER, {
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

    //handler for friend request text input
    const handleTextChange = (e) => {
        setText(e.target.value)

        if (text === '') {
            setBtnDisabled(true)
            setFriend(false)
        } else {
            setBtnDisabled(false)
        };
    };

    //capture the name of the friend the user wishes to send a request to via state set by the request input. Used to submit the friend request handler: submitHandler
    const friendName = text;
    console.log(friendName);
    const friendId = inputData?.user?._id || '';
    console.log(friendId);

    return (
        <div>
            {!userParam &&
                <form className="form-card">
                    <div className="form-input-wrapper">
                        <input
                            onChange={handleTextChange}
                            type="text"
                            placeholder="Username"
                            value={text}
                            className="profile-friends-card-input"
                        />
                    </div>
                    {friend &&
                        <div>USER NOT FOUND</div>
                    }
                    {inputSwitched ?
                        <RequestButtons
                            user={user}
                            inputData={inputData}
                            friendName={friendName}
                            friendId={friendId}
                            btnDisabled={btnDisabled}
                            setBtnDisabled={setBtnDisabled}
                            setFriend={setFriend}
                            setText={setText}
                        />
                        :
                        <BlockButtons
                            user={user}
                            friendName={friendName}
                            friendId={friendId}
                            btnDisabled={btnDisabled}
                            setBtnDisabled={setBtnDisabled}
                            setFriend={setFriend}
                            setText={setText}
                        />
                    }
                </form>
            }
        </div>
    )
}

export default RequestBlockForm;
