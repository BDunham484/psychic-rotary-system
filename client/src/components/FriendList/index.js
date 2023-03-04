import { useState } from "react";
import FriendListNames from "../FriendListNames";
// import { Link } from "react-router-dom";
// import FriendListOptions from "../FriendListOptions";
import Expander from "../shared/Expander";
import Switch from 'react-switch';

const FriendList = ({ user }) => {
    // set state for friends options display switch
    const [friendSwitch, setFriendSwitch] = useState(true);
    const [expand, setExpand] = useState(false);

    // switch handler
    const handleFriendSwitch = () => {
        friendSwitch ? setFriendSwitch(false) : setFriendSwitch(true)
    }

    // let userFriendsArr = [...user.friends];
    // // sort the objects in the user's friends array in alphabetical order based off usernames
    // userFriendsArr.sort(function (a, b) {
    //     if (a.username < b.username) {
    //         return -1;
    //     }
    //     if (a.username > b.username) {
    //         return 1;
    //     }
    //     return 0;
    // });

    return (
        <div>
            {user.friendCount > 0 &&
                <div className="profile-friends-sub-header">
                    {/* <div className="display-flex"> */}
                    <Expander expand={expand} setExpand={setExpand} />
                    <h3 className="friends-sub-titles">Your Friends </h3>
                    <div className="friends-sub-titles"> {user.friendCount}</div>
                    {/* </div> */}
                </div>
            }
            {!expand ? (
                <></>
            ) : (
                <div>
                    <div className="profile-friends-sub-header">
                        <h3>Options</h3>
                        <Switch
                            onChange={handleFriendSwitch}
                            checked={friendSwitch}
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

                    <FriendListNames user={user} friendSwitch={friendSwitch} />
                </div>
            )}
        </div>
    )
}

export default FriendList;