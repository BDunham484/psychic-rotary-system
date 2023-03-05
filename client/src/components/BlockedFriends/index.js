import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { UNBLOCK_USER } from "../../utils/mutations";
import { Blocked } from '@styled-icons/octicons/Blocked';
import Expander from "../shared/Expander";

const BlockedFriends = ({ user }) => {

    const [expand, setExpand] = useState(false);

    const [unblockUser] = useMutation(UNBLOCK_USER);

    //handler to unblock a user
    const handleUnblock = async (blockedId) => {
        console.log('handleUnblock Clicked: ' + blockedId);
        try {
            await unblockUser({
                variables: {
                    blockedId: blockedId
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    console.log('blockedCount: ' + user.blockedCount)

    return (
        <>
            {user.blockedCount > 0 &&
                <div className="profile-friends-sub-header">
                    <Expander expand={expand} setExpand={setExpand} />
                    <h3 className="friends-sub-titles">Blocked</h3>
                    <div className="totals">{user.blockedCount}</div>
                </div>
            }
            {expand &&
                <div>
                    {user.blockedCount <= 5 ? (
                        <div>
                            {user.blockedUsers.map((blocked, index) => (
                                <div key={index} className="names display-flex">
                                    <Link className="name" to={`/profile/${blocked.username}`}>
                                        {blocked.username}
                                    </Link>
                                    <Blocked className="friend-list-icons" onClick={() => handleUnblock(blocked._id)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="blocked-list styled-scrollbars">
                            {user.blockedUsers.map((blocked, index) => (
                                <div key={index} className="names display-flex">
                                    <Link className="name" to={`/profile/${blocked.username}`}>
                                        {blocked.username}
                                    </Link>
                                    <Blocked className="friend-list-icons" onClick={() => handleUnblock(blocked._id)} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            }
        </>
    )
}

export default BlockedFriends
