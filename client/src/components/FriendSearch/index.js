import { useState } from "react";
import { Search } from "@styled-icons/bootstrap/Search";


const FriendSearch = () => {
    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);



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

    return (
        <div>
            <form>
                <div className="friend-search-input-wrapper">
                    <input
                        onChange={handleTextChange}
                        type="text"
                        placeholder="Username"
                        value={text}
                        className="friend-search-input"
                    />
                    <button className="friend-search-button">Search</button>
                </div>
            </form>

        </div>
    )
}

export default FriendSearch
