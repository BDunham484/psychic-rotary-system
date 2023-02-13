import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { UNBLOCK_USER } from "../../utils/mutations";
import { Blocked } from '@styled-icons/octicons/Blocked';

const BlockedFriends = ({ user }) => {

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

    return (
        <>
            {user.blockedCount > 0 &&
                <div className="profile-friends-sub-header">
                    <h2>Blocked</h2>
                    <div>Total : {user.blockedCount}</div>
                </div>
            }
            <div>
                {user.blockedUsers.map((blocked, index) => (
                    <div key={index} className="names display-flex">
                        <Link to={`/profile/${blocked.username}`}>
                            {blocked.username}
                        </Link>
                        <Blocked className="friend-list-icons" onClick={() => handleUnblock(blocked._id)} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default BlockedFriends
