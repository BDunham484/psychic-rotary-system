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

    //handler for friend request text input
    const handleTextChange = (e) => {
        setText(e.target.value)

        if (text === '') {
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        };
    };

    //capture the name of the friend the user wishes to send a request to via state set by the request input. Used to submit the friend request handler: submitHanlder
    const friendName = text;
    console.log(friendName);
    const friendId = userdata?.user?._id || '';
    console.log(friendId);
    const userId = user._id;

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
                        />
                    </div>
                    {friend &&
                        <div>USER NOT FOUND</div>
                    }
                    {inputSwitched ?
                        <RequestButtons 
                            user={user}
                            userId={userId}
                            userdata={userdata}
                            friendName={friendName}
                            friendId={friendId}
                            setBtnDisabled={setBtnDisabled}
                            btnDisabled={btnDisabled}
                            setFriend={setFriend}
                            setText={setText}
                        />
                        :
                        <BlockButtons
                            user={user} 
                            friendId={friendId} 
                            btnDisabled={btnDisabled} 
                            setBtnDisabled={setBtnDisabled} 
                            setFriend={setFriend} 
                            setText={setText} 
                            friendName={friendName}
                            userId={userId} 
                        />
                    }
                </form>
            }
        </div>
    )
}

export default RequestBlockForm;
