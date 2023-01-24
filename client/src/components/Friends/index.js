import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { ADD_FRIEND } from "../../utils/mutations";
import { QUERY_USER } from "../../utils/queries";
import { Link } from "react-router-dom";

const Friends = ({ userParam, user }) => {
    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [friend, setFriend] = useState(false);


    //destructure mutation function 
    const [addFriend, { err }] = useMutation(ADD_FRIEND);

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
    const handleSubmit = async (friendId, event) => {
        // event.preventDefault();
        console.log("EVENT: " + event)
        console.log("ID: " + friendId)

        if (!friendId) {
            console.log('user not found');
            setFriend(true);
        } else {
            try {
                await addFriend({
                    variables: { id: friendId }
                });
            } catch (e) {
                console.error(e)
            }
        }
    }

    //query user if use inputs text value in 'add friend' input
    const userdata = useQuery(QUERY_USER, {
        variables: { username: text }
    })
    const userId = userdata?.data?.user?._id || '';

    if (userId) {
        console.log("USERNAME: " + text)
        console.log("USER ID: " + userId)
    }

    return (
        <div className="profile-friends-card">
            <div className="profile-friends-card-header">
                <h2>Add Friends</h2>
            </div>
            {userParam &&
                <button onClick={handleClick}>
                    Add Friend
                </button>
            }
            {!userParam &&
                <form className="form-card" onSubmit={() => { handleSubmit(userId) }}>
                    <div>
                        <input
                            onChange={handleTextChange}
                            type="text"
                            placeholder="Add Friend"
                            value={text}
                        />
                    </div>
                    {friend &&
                        <div>USER NOT FOUND</div>
                    }
                    <div>
                        <button type="submit" disabled={btnDisabled}>Add Friend</button>
                    </div>
                </form>
            }
            {err && <div>An Error has occurred.</div>}

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
