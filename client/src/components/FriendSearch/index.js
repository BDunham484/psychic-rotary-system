import { useState } from "react";
import { Search } from "@styled-icons/bootstrap/Search";


const FriendSearch = ({ user }) => {
    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState('');



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
            user.friends.map((friend) => {
                if (friend.username === text) {
                    setResult(text);
                } else {
                    setResult('User Not Found');
                }
            })
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
                    {result}
                </div>
            }


        </div>
    )
}

export default FriendSearch
