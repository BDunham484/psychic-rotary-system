import { useState } from "react";
import FriendListNames from "../FriendListNames";
import FriendSearch from "../FriendSearch";
import Expander from "../shared/Expander";
import Switch from 'react-switch';
import { Search } from "@styled-icons/bootstrap/Search";

const FriendList = ({ user }) => {
    // set state for friends options display switch
    const [friendSwitch, setFriendSwitch] = useState(true);
    const [expand, setExpand] = useState(false);
    const [search, setSearch] = useState(false);

    // switch handler
    const handleFriendSwitch = () => {
        friendSwitch ? setFriendSwitch(false) : setFriendSwitch(true)
    }

    const handleFriendSearch = () => {
        search ? setSearch(false) : setSearch(true);
    }

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
                        <Search className="friend-list-icons" onClick={handleFriendSearch}/>
                        {/* <h3>Options</h3> */}
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
                    {search && 
                    <FriendSearch user={user} />
                    
                    }
                    <FriendListNames user={user} friendSwitch={friendSwitch} />
                </div>
            )}
        </div>
    )
}

export default FriendList;