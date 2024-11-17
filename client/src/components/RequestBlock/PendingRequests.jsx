// @ts-ignore
import styles from './RequestBlock.module.css';
import { useCallback, useMemo, useState } from "react";
import SentReceived from "./SentReceived";
import Expander from "../shared/Expander";
import SkeletonFriendListItem from '../Friends/SkeletonFriendListItem';
import Switch from 'react-switch';
import { Send } from '@styled-icons/bootstrap/Send';
import { CallReceived } from '@styled-icons/material-twotone/CallReceived';
import { useMutation } from '@apollo/client'
import {
    CANCEL_FRIEND_REQUEST,
    ACCEPT_FRIEND_REQUEST,
    DECLINE_FRIEND_REQUEST,
} from '../../utils/mutations'
import { Cancel } from '@styled-icons/material-outlined/Cancel';
import { Check } from '@styled-icons/fa-solid/Check';
import { Xmark } from '@styled-icons/fa-solid/Xmark';

const PendingRequests = ({ user }) => {
    const [expand, setExpand] = useState(false);
    const [isSent, setIsSent] = useState(true);
    const [requestSwitch, setRequestSwitch] = useState(true);
    const [requestSwitchId, setRequestSwitchId] = useState(null);
    const {
        pendingRequestsWrapper,
        pendingRequestHeader,
        subTitle,
        requestCount,
        requestListScroll,
        styledScrollbars,
        names,
        requestListOptionsWrapper,
        requestBlockIcon,
        requestStartWrapper,
        cancelIcon,
        approveIcon,
        denyIcon,
    } = styles;

    const [cancelRequest] = useMutation(CANCEL_FRIEND_REQUEST);
    const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
    const [declineRequest] = useMutation(DECLINE_FRIEND_REQUEST);

    const arrayLength = useMemo(() => {
        if (user?.requestCount <= 5) {
            return 5 - user?.requestCount
        } else {
            return 0;
        }
    }, [user?.friendCount]);

    const subArray = [];

    if (arrayLength > 0) {
        for (let i = 0; i < arrayLength; i++) {
            subArray.push({ 'skeleton': i });
        }
    }

    let usersRequests = [
        ...user?.sentRequests,
        ...user?.receivedRequests,
        ...subArray,
    ];

    const handleFriendSwitch = useCallback((requestId) => {
        requestSwitch ? setRequestSwitch(false) : setRequestSwitch(true)
        requestSwitch ? setRequestSwitchId(requestId) : setRequestSwitchId(null);
    }, [requestSwitch]);

    const setRequestIcon = useCallback((requestId) => {
        if (user?.sentRequests.find(x => x._id === requestId)) {
            return <Send className={requestBlockIcon} />
        } else if (user?.receivedRequests.find(x => x._id === requestId)) {
            return <CallReceived className={requestBlockIcon} />
        }
    }, [user?.sentRequests, user?.receivedRequests]);

    const handleCancel = async (friendId, friendName) => {
        console.log('handleCancel Clicked: ' + friendId + ' | ' + friendName);
        try {
            await cancelRequest({
                variables: {
                    friendId: friendId,
                    friendName: friendName
                }
            });
        } catch (e) {
            console.error(e);
        };
    };

    const handleDeny = async (senderId, senderName) => {
        console.log('handleDeny: ' + senderId + ' | ' + senderName);
        try {
            await declineRequest({
                variables: { 
                    senderId: senderId,
                    senderName: senderName
                }
            })
        } catch (err) {
            console.error(err);
        }
    }

    const handleApprove = async (senderId, senderName) => {
        console.log('handleApprove: ' + senderId + ' | ' + senderName);
        try {
            await acceptRequest({
                variables: {
                    senderId: senderId,
                    senderName: senderName
                }
            }) 
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div id={pendingRequestsWrapper}>
            {/* // changelog-start */}
            <div className={user.requestCount > 5 ? `${requestListScroll} ${styledScrollbars}` : ''}>
                {usersRequests.map((request, index) => {
                    if (!!request?._id) {
                        return (
                            <div key={request._id}>
                                <div className={names}>
                                    <div className={requestStartWrapper}>
                                        {setRequestIcon(request?._id)}
                                        <p>{request?.username}</p>
                                    </div>
                                    <Switch
                                        onChange={() => handleFriendSwitch(request._id)}
                                        checked={!requestSwitch && requestSwitchId === request._id}
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
                                {(!requestSwitch && requestSwitchId === request._id) &&
                                    <div>
                                        {(user?.sentRequests.some(x => x._id === request._id)) &&
                                            <div className={requestListOptionsWrapper}>
                                                <p>
                                                    Cancel Request
                                                </p>
                                                <Cancel className={cancelIcon} onClick={() => handleCancel(request._id, request.username)} />
                                            </div>
                                        }
                                        {(user?.receivedRequests.find(x => x._id === request._id)) &&
                                            <div className={requestListOptionsWrapper}>
                                                <p>
                                                    Approve
                                                </p>
                                                <Check className={approveIcon} onClick={() => handleApprove(request._id, request.username )} />
                                                <p>
                                                    Deny
                                                </p>
                                                <Xmark className={denyIcon} onClick={() => handleDeny(request._id, request.username)} />
                                            </div>
                                        }
                                    </div>
                                }
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
