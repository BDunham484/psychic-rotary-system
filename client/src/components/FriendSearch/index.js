import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "@styled-icons/bootstrap/Search";


const FriendSearch = ({ user }) => {
    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState('');
    const [found, setFound] = useState(false);



    //handler for friend request text input
    const handleTextChange = (e) => {
        setText(e.target.value)

        if (text === '') {
            setBtnDisabled(true)
            // setFriend(false)
        } else {
            setBtnDisabled(false)
        };
    };

    console.log(text);
    console.log(user.friends);

    const handleSearch = (event) => {
        event.preventDefault();
        console.log('SEARCH BUTTON CLICKED')
        console.log(text);

        if (user.friendCount > 0) {
            const friendBoolArr = user.friends.map((friend) => {
                if (friend.username === text) {
                    return true;
                } else {
                    return false;
                }
            });
            const isFriend = friendBoolArr.some(friend => friend === true);
            if (isFriend) {
                setResult(text);
                setFound(true);
                console.log(found);
            } else {
                setResult('Username Not Found');
                setFound(false);
                console.log(found);
            }
        }
        setText('');
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
                        <Link className="name" to={`/profile/${result}`}>{result}</Link>
                    ) : (
                        <div>{result}</div>
                    )}
                </div>
            }


        </div>
    )
}

export default FriendSearch
