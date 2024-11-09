// @ts-ignore
import styles from './styles/Friends.module.css';
import { useState } from "react";
import { Link } from "react-router-dom";
import FriendListOptions from "./FriendListOptions";
import { Search } from "@styled-icons/bootstrap/Search";
import Switch from 'react-switch';
import { Delete } from '@styled-icons/typicons/Delete';


const FriendSearch = ({ user }) => {
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
    const [friendSwitch, setFriendSwitch] = useState(true);
    const [friendSwitchId, setFriendSwitchId] = useState(null);

    const {
        friendSearchInputWrapper,
        clearResult,
        friendInputLabel,
        friendSearchInput,
        foundWrapper,
        friendSearchButton,
        friendSearchResults,
        friendSearchResultOptionsWrapper,
        name,
        friendSearchIcon,
    } = styles;

    //handler for friend search text input
    const handleTextChange = (e) => {
        setText(e.target.value)

        if (text === '') {
            setBtnDisabled(true)
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

    const handleClearResult = () => {
        setShowResult(false);
        setResult('');
    };

    const handleFriendSwitch = (friendId) => {
        friendSwitch ? setFriendSwitch(false) : setFriendSwitch(true)
        friendSwitch ? setFriendSwitchId(friendId) : setFriendSwitchId(null);
    }


    return (
        <div>
            <form onSubmit={handleSearch} className={showResult ? foundWrapper : friendSearchInputWrapper}>
                <label id={friendInputLabel}>
                    <Search className={friendSearchIcon} />
                    <input
                        onChange={handleTextChange}
                        type="text"
                        placeholder="Username"
                        value={text}
                        className={friendSearchInput}
                    />
                    <button className={friendSearchButton} type="submit" >Search</button>
                </label>
            </form>
            {showResult &&
                <div>
                    {found ? (
                        <>
                            <div className={friendSearchResults}>
                                <Delete className={clearResult} onClick={handleClearResult}/>
                                <Link to={`/profile/${result}`}>{result}</Link>
                                <Switch
                                    onChange={() => handleFriendSwitch(friendId)}
                                    checked={!friendSwitch && friendSwitchId === friendId}
                                    offColor={'#525050'}
                                    onColor={'#525050'}
                                    offHandleColor={'#383737'}
                                    onHandleColor={'#383737'}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow={'#eee3d0'}
                                    activeBoxShadow={'#eee3d0'}
                                />
                            </div>
                            {(!friendSwitch && friendSwitchId === friendId) &&
                                <div className={friendSearchResultOptionsWrapper}>
                                    <FriendListOptions friendId={friendId} />
                                </div>
                            }
                        </>
                    ) : (
                        <div className={friendSearchResults}>{result}</div>
                    )}
                </div>
            }
        </div>
    )
}

export default FriendSearch
