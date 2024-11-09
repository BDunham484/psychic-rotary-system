// @ts-ignore
import styles from './styles/Friends.module.css';
import { useState } from "react";
import RequestBlock from "../RequestBlock/RequestBlock";
import PendingRequests from "./PendingRequests";
import Friends from './Friends';
import BlockedFriends from "./BlockedFriends";

const ProfileFriends = ({ userParam, user }) => {
    const [inputSwitched, setInputSwitched] = useState(true);
    const {
        friendsWrapper,
        requestBlockWrapper,
    } = styles;

    return (
        <div id={friendsWrapper}>
            <Friends user={user} />
            <div id={requestBlockWrapper}>
                <RequestBlock userParam={userParam} user={user} inputSwitched={inputSwitched} setInputSwitched={setInputSwitched} />
                {inputSwitched &&
                    <PendingRequests user={user} />
                }
                {!inputSwitched &&
                    <BlockedFriends user={user} />
                }
            </div>
        </div>
    )
}

export default ProfileFriends;

