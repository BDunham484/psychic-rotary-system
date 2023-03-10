import { useState } from "react";
import FriendListNames from "../FriendListNames";
import FriendSearch from "../FriendSearch";
import Expander from "../shared/Expander";
import Switch from 'react-switch';
import { Search } from "@styled-icons/bootstrap/Search";

const FriendList = ({ user }) => {
    // set state for friends options display switch
    const [friendSwitch, setFriendSwitch] = useState(true);
    // set state for expander icon to hide/display friendlist names
    const [expand, setExpand] = useState(false);
    // set state for search icon to hide/display search input
    const [search, setSearch] = useState(false);

    // switch handler to hide/display friend list options
    const handleFriendSwitch = () => {
        friendSwitch ? setFriendSwitch(false) : setFriendSwitch(true)
    }
    // handler to hide/display friend search input
    const handleFriendSearch = () => {
        search ? setSearch(false) : setSearch(true);
    }

    return (
        <div>
            {user.friendCount > 0 &&
                <div className="profile-friends-sub-header">
                    <Expander expand={expand} setExpand={setExpand} />
                    <h3 className="friends-sub-titles">Friends</h3>
                    <div className="friends-sub-titles totals"> {user.friendCount}</div>
                </div>
            }
            {expand && 
                <div>
                    <div className="profile-friends-sub-header">
                        <Search className="friend-list-icons" onClick={handleFriendSearch} />
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
                        <FriendSearch user={user} friendSwitch={friendSwitch} />

                    }
                    <FriendListNames user={user} friendSwitch={friendSwitch} />
                </div>
            }
        </div>
    )
}

export default FriendList;