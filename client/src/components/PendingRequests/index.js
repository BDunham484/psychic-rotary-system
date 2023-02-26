import { useState } from "react";
import SentRequests from "../SentRequests";
import ReceivedRequests from "../ReceivedRequests";
import Switch from 'react-switch';

const PendingRequests = ({ user }) => {

    const [requestSwitch, setRequestSwitch] = useState(true);

    const handleRequestSwitch = () => {
        requestSwitch ? setRequestSwitch(false) : setRequestSwitch(true)
    }

    return (
        <div>
            {user.requestCount > 0 &&
                <>
                    <div className="profile-friends-sub-header">
                        <h2 className="friends-sub-titles">Pending Requests</h2>
                        <div className="totals">{user.requestCount}</div>
                    </div>

                    {(user.sentCount > 0 && user.receivedCount === 0) &&
                        <>
                            <div className='sent-received'>SENT</div>
                            <SentRequests user={user} />
                        </>

                    }

                    {(user.sentCount === 0 && user.receivedCount > 0) &&
                        <>
                            <div className="sent-received">RECEIVED</div>
                            <ReceivedRequests user={user} />
                        </>
                    }

                    {(user.sentCount > 0 && user.receivedCount > 0) &&
                        requestSwitch ? (
                        <>
                            <div className="profile-friends-sub-header">
                                <div className='friends-sub-titles'>SENT</div>
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
                                <div className="unSwitched">RECEIVED</div>
                            </div>
                            <SentRequests user={user} />
                        </>
                    ) : (
                        <>
                            <div className="profile-friends-sub-header">
                                <div className='unSwitched'>SENT</div>
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
                                <div className="friends-sub-titles">RECEIVED</div>
                            </div>
                            <ReceivedRequests user={user} />
                        </>
                    )
                    }


                </>
            }
        </div>
    )
}

export default PendingRequests;
