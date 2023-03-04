import { useState } from "react";
import SentReceived from "../SentReceived";
import Expander from "../shared/Expander";

const PendingRequests = ({ user }) => {

    const [expand, setExpand] = useState(false);

    return (
        <div>
            {user.requestCount > 0 &&
                <>
                    <div className="profile-friends-sub-header">
                        <Expander expand={expand} setExpand={setExpand} />
                        <h2 className="friends-sub-titles">Pending Requests</h2>
                        <div className="totals">{user.requestCount}</div>
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
