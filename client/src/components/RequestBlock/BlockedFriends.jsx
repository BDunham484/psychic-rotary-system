// @ts-ignore
import styles from './RequestBlock.module.css';
import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { UNBLOCK_USER } from '../../utils/mutations';
import { Blocked } from '@styled-icons/octicons/Blocked';
import Expander from '../shared/Expander';
import SkeletonFriendListItem from '../Friends/SkeletonFriendListItem';
import Switch from 'react-switch';
import { Check } from '@styled-icons/fa-solid/Check';

const BlockedFriends = ({ user }) => {
    const [expand, setExpand] = useState(false);
    const [blockSwitch, setBlockSwitch] = useState(true);
    const [blockSwitchId, setBlockSwitchId] = useState(null);
    const {
        blockedFriendsWrapper,
        pendingRequestsWrapper,
        requestListScroll,
        styledScrollbars,
        names,
        name,
        blockedListIcons,
        requestListOptionsWrapper,
        approveIcon,
    } = styles;

    const [unblockUser] = useMutation(UNBLOCK_USER);

    const arrayLength = useMemo(() => {
        if (user?.blockedCount <= 5) {
            return 5 - user?.blockedCount
        } else {
            return 0;
        }
    }, [user?.blockedCount]);

    const subArray = [];

    if (arrayLength > 0) {
        for (let i = 0; i < arrayLength; i++) {
            subArray.push({ 'skeleton': i });
        };
    }

    let blockedUsers = [
        ...user?.blockedUsers,
        ...subArray,
    ];

    const handleBlockSwitch = useCallback((blockId) => {
        blockSwitch ? setBlockSwitch(false) : setBlockSwitch(true)
        blockSwitch ? setBlockSwitchId(blockId) : setBlockSwitchId(null);
    }, [blockSwitch]);

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
        <div id={pendingRequestsWrapper}>
            {/* // changelog-start */}
            <div className={user.blockedCount > 5 ? `${requestListScroll} ${styledScrollbars}` : ''}>
                {blockedUsers?.map((block, index) => {
                    if (!!block?._id) {
                        return (
                            <div key={block._id}>
                                <div className={names}>
                                    <p>**********</p>
                                    <Switch
                                        onChange={() => handleBlockSwitch(block._id)}
                                        checked={!blockSwitch && blockSwitchId === block._id}
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
                                {(!blockSwitch && blockSwitchId === block._id) &&
                                    <div>
                                        {(user?.blockedUsers.some(x => x._id === block._id)) &&
                                            <div className={requestListOptionsWrapper}>
                                                <p>
                                                    Unblock: {block?.username}
                                                </p>
                                                <Check className={approveIcon} onClick={() => handleUnblock(block._id)} />
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
            {/* {user.blockedCount > 0 &&
                <div>
                    <Expander expand={expand} setExpand={setExpand} />
                    <h3>Blocked</h3>
                    <div>{user.blockedCount}</div>
                </div>
            }
            {expand &&
                <div>
                    {user.blockedCount <= 5 ? (
                        <div>
                            {user.blockedUsers.map((blocked, index) => (
                                <div key={index} className={`${names} display-flex`}>
                                    <Link className={name} to={`/profile/${blocked.username}`}>
                                        {blocked.username}
                                    </Link>
                                    <Blocked className={blockedListIcons} onClick={() => handleUnblock(blocked._id)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='blocked-list styled-scrollbars'>
                            {user.blockedUsers.map((blocked, index) => (
                                <div key={index} className={`${names} display-flex`}>
                                    <Link className={name} to={`/profile/${blocked.username}`}>
                                        {blocked.username}
                                    </Link>
                                    <Blocked className={blockedListIcons} onClick={() => handleUnblock(blocked._id)} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            } */}
            {/* // changelog-end */}
        </div>
    )
}

export default BlockedFriends
