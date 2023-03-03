import { useState } from "react";
import SentReceived from "../SentReceived";
import Expander from "../shared/Expander";
// import { ExpandLess } from "@styled-icons/material-rounded/ExpandLess";
// import { ExpandMore } from "@styled-icons/material-sharp/ExpandMore";

const PendingRequests = ({ user }) => {

    const [expand, setExpand] = useState(false);

    // const handleExpand = () => {
    //     expand ? setExpand(false) : setExpand(true)
    // }

    return (
        <div>
            {user.requestCount > 0 &&
                <>
                    <div className="profile-friends-sub-header">
                        <Expander expand={expand} setExpand={setExpand} />
                        {/* {!expand ? (
                            <ExpandMore className="chevron" onClick={handleExpand} />
                        ) : (
                            <ExpandLess className="chevron" onClick={handleExpand} />
                        )} */}
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
