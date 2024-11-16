// @ts-ignore
import styles from './RequestBlock.module.css';
import { useMemo, useState } from "react";
import SentReceived from "./SentReceived";
import Expander from "../shared/Expander";
import SkeletonFriendListItem from '../Friends/SkeletonFriendListItem';

const PendingRequests = ({ user }) => {
    const [expand, setExpand] = useState(false);
    const {
        pendingRequestsWrapper,
        pendingRequestHeader,
        subTitle,
        requestCount,
        requestListScroll,
        styledScrollbars,
        names,
    } = styles;

    // changelog-start
    const arrayLength = useMemo(() => {
        if (user?.requestCount < 5) {
            return 5 - user?.requestCount
        } else {
            return 0;
        }
    }, [user?.friendCount]);

    const subArray = [];

    if (arrayLength > 0) {
        for (let i = 0; i < arrayLength; i++) {
            subArray.push({ 'skeleton': i});
        }
    }

    let usersRequests = [
        ...user?.sentRequests,
        ...user?.receivedRequests,
        ...subArray,
    ];

    console.log('👾👾👾👾 usersRequests: ', usersRequests);
    console.log(' ');
    // changelog-end

    return (
        <div id={pendingRequestsWrapper}>
            {/* // changelog-start */}
            <div className={user.requestCount > 5 ? `${requestListScroll} ${styledScrollbars}` : ''}>
                {usersRequests.map((request, index) => {
                    if (!!request?._id) {
                        return (
                            <div key={request._id}>
                                <div className={names}>
                                    {request?.username}
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <SkeletonFriendListItem />
                            </div>
                        )
                    }
                })}
            </div>
            {/* {user.requestCount > 0 &&
                <>
                    <div className={pendingRequestHeader}>
                        <Expander expand={expand} setExpand={setExpand} />
                        <div className="display-flex">
                            <h2 className={subTitle}>Requests</h2>
                            <div className={`${subTitle} ${requestCount}`}>{user.requestCount}</div>
                        </div>
                    </div>
                    {expand &&
                        <SentReceived user={user} />
                    }
                </>
            } */}
            {/* // changelog-end */}
        </div>
    )
}

export default PendingRequests;
