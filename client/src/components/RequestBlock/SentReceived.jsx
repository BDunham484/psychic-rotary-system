import { useState } from "react";
import SentRequests from "./SentRequest";
import ReceivedRequests from "./ReceivedRequests";
import Switch from 'react-switch';

const SentReceived = ({ user }) => {
    const [requestSwitch, setRequestSwitch] = useState(true);

    const handleRequestSwitch = () => {
        requestSwitch ? setRequestSwitch(false) : setRequestSwitch(true)
    }

    return (
        <div>
            {/* if the sent request count is > 0 and the received count is equal to zero, display SentRequests only */}
            {(user.sentCount > 0 && user.receivedCount === 0) &&
                <>
                    <div className='sent-received'>SENT</div>
                    <SentRequests user={user} />
                </>
            }
            {/* if the received request count is > 0 and the sent count is equal to zero, display ReceivedRequest only */}
            {(user.sentCount === 0 && user.receivedCount > 0) &&
                <>
                    <div className="sent-received">RECEIVED</div>
                    <ReceivedRequests user={user} />
                </>
            }
            {/* if both sent and received request counts are greater than zero, display both with a switch */}
            {!(user.sentCount > 0 && user.receivedCount > 0) ? (
                <></>
            ) : (
                requestSwitch ? (
                    <>
                        <div className="profile-friends-sub-header">
                            <div className='friends-sub-titles'>Sent</div>
                            <Switch
                                onChange={handleRequestSwitch}
                                checked={requestSwitch}
                                offColor={'#525050'}
                                onColor={'#525050'}
                                offHandleColor={'#383737'}
                                onHandleColor={'#383737'}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow={'#eee3d0'}
                                activeBoxShadow={'#eee3d0'}
                            />
                            <div className="unSwitched">Received</div>
                        </div>
                        <SentRequests user={user} />
                    </>
                ) : (
                    <>
                        <div className="profile-friends-sub-header">
                            <div className='unSwitched'>Sent</div>
                            <Switch
                                onChange={handleRequestSwitch}
                                checked={requestSwitch}
                                offColor={'#525050'}
                                onColor={'#525050'}
                                offHandleColor={'#383737'}
                                onHandleColor={'#383737'}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow={'#eee3d0'}
                                activeBoxShadow={'#eee3d0'}
                            />
                            <div className="friends-sub-titles">Received</div>
                        </div>
                        <ReceivedRequests user={user} />
                    </>
                )
            )}
        </div>

    )
}

export default SentReceived;
