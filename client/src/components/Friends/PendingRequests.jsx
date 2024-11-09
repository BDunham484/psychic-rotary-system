// @ts-ignore
import styles from './styles/Friends.module.css';
import { useState } from "react";
import SentReceived from "../SentReceived";
import Expander from "../shared/Expander";

const PendingRequests = ({ user }) => {
    const [expand, setExpand] = useState(false);
    const {
        pendingRequestsWrapper,
        profileFriendsSubHeader,
        friendsSubTitle,
        friendCount,
    } = styles;

    return (
        <div id={pendingRequestsWrapper}>
            {user.requestCount > 0 &&
                <>
                    <div className={profileFriendsSubHeader}>
                        <Expander expand={expand} setExpand={setExpand} />
                        <div className="display-flex">
                            <h2 className={friendsSubTitle}>Requests</h2>
                            <div className={`${friendsSubTitle} ${friendCount}`}>{user.requestCount}</div>
                        </div>
                    </div>
                    {!expand ? (
                        <></>
                    ) : (
                        <SentReceived user={user} />
                    )}
                </>
            }
        </div>
    )
}

export default PendingRequests;
