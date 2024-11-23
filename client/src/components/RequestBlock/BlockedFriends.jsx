// @ts-ignore
import styles from './RequestBlock.module.css';
import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UNBLOCK_USER } from '../../utils/mutations';
import SkeletonFriendListItem from '../Friends/SkeletonFriendListItem';
import Switch from 'react-switch';
import { Check } from '@styled-icons/fa-solid/Check';
import { getSkeletonArray } from '../../utils/helpers';

const BlockedFriends = ({ user }) => {
    const [blockSwitch, setBlockSwitch] = useState(true);
    const [blockSwitchId, setBlockSwitchId] = useState(null);
    const {
        listWrapper,
        requestListScroll,
        styledScrollbars,
        names,
        requestListOptionsWrapper,
        approveIcon,
    } = styles;

    const [unblockUser] = useMutation(UNBLOCK_USER);

    const skeletons = getSkeletonArray(user?.blockedCount, 5);

    let blockedUsers = [
        ...user?.blockedUsers,
        ...skeletons,
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
        <div className={listWrapper}>
            <div className={user.blockedCount > 5 ? `${requestListScroll} ${styledScrollbars}` : ''}>
                {blockedUsers?.map((block, index) => {
                    if (!!block?._id) {
                        return (
                            <div key={block._id}>
                                <div className={names}>
                                    <p>{block?.username}</p>
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
                                                    Unblock 
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
        </div>
    )
}

export default BlockedFriends
