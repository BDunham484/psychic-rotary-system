import { useState } from "react";
import { Link } from "react-router-dom";
// import { Search } from "@styled-icons/bootstrap/Search";
import FriendListOptions from "../FriendListOptions";


const FriendSearch = ({ user, friendSwitch }) => {
    // set state for input text
    const [text, setText] = useState('');
    // set state for search button 
    const [btnDisabled, setBtnDisabled] = useState(true);
    // set state for showing results of search after form submission
    const [showResult, setShowResult] = useState(false);
    // set state for the result of the search
    const [result, setResult] = useState('');
    // set state on whether the search input is found in the user's friends list
    const [found, setFound] = useState(false);
    // set state for the userId of the friend being searched for
    const [friendId, setFriendId] = useState('');
    console.log('is btn disbaled?: ' + btnDisabled);


    //handler for friend search text input
    const handleTextChange = (e) => {
        setText(e.target.value)

        if (text === '') {
            setBtnDisabled(true)
            // setFriend(false)
        } else {
            setBtnDisabled(false)
        };
    };

    // handler for search form submission
    const handleSearch = (event) => {
        event.preventDefault();
        // if there is anyone to search for run some code
        if (user.friendCount > 0) {
            // map through user's friends list and if the search input text matches with a username in the list, set state for that friends's userId and return true for that index in friendBoolArr
            const friendBoolArr = user.friends.map((friend) => {
                if (friend.username === text) {
                    setFriendId(friend._id)
                    return true;
                } else {
                    return false;
                }
            });
            // if there is an index in friendBoolArr with a value of true then set the search input text as the result state and set the found state to true.  Else...
            const isFriend = friendBoolArr.some(friend => friend === true);
            if (isFriend) {
                setResult(text);
                setFound(true);
            } else {
                setResult('Username Not Found');
                setFound(false);
            }
        }

        // if there is noone in the friends list reset the text input
        setText('');
        // set state to show result of friend search
        setShowResult(true);
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <div className="friend-search-input-wrapper">
                    <input
                        onChange={handleTextChange}
                        type="text"
                        placeholder="Username"
                        value={text}
                        className="friend-search-input"
                    />
                    <button className="friend-search-button" type="submit" >Search</button>
                </div>
            </form>
            {showResult &&
                <div className="names">
                    {found ? (
                        <div className="display-flex">
                            <Link className="name" to={`/profile/${result}`}>{result}</Link>

                        {!friendSwitch &&
                            <FriendListOptions friendId={friendId} />
                        }
                        </div>
                    ) : (
                        <div>{result}</div>
                    )}
                </div>
            }
        </div>
    )
}

export default FriendSearch
