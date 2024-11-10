// @ts-ignore
import styles from './styles/Friends.module.css';
import { useMemo, useState } from "react";
import RequestBlock from "../RequestBlock/RequestBlock";
import PendingRequests from "./PendingRequests";
import Friends from './Friends';
import BlockedFriends from "./BlockedFriends";
import Tabs from '../shared/Tabs/Tabs';
import { User } from '@styled-icons/fa-solid/User';
import { UserPlus } from '@styled-icons/fa-solid/UserPlus';
import { UserXmark } from '@styled-icons/fa-solid/UserXmark';
import RequestBlockForm from '../RequestBlockForm';


const ProfileFriends = ({ userParam, user }) => {
    const [inputSwitched, setInputSwitched] = useState(true);
    const {
        friendsWrapper,
        requestBlockWrapper,
        tabButton,
        activeListTab,
        activeRequestTab,
        activeBlockTab,
        tabContent,
        tabWrapper,
    } = styles;

    const customTabStyles = useMemo(() => {
        return {
            customTabButton: tabButton,
            activeListTab: activeListTab,
            activeRequestTab: activeRequestTab,
            activeBlockTab: activeBlockTab,
            customTabContent: tabContent,
        }
    }, [tabButton, activeListTab, activeRequestTab, activeBlockTab, tabContent]);

    const tabData = [
        {
            label: <User />,
            content:
                <div>
                    {/* <Friends user={user} customStyles={}/> */}
                    <Friends user={user} />
                </div>
        },
        {
            label: <UserPlus />,
            content:
                <div>
                    <RequestBlockForm userParam={userParam} inputSwitched={true} user={user} />
                    <PendingRequests user={user} />
                </div>
        },
        {
            label: <UserXmark />,
            content:
                <div>
                    <RequestBlockForm userParam={userParam} inputSwitched={false} user={user} />
                    <BlockedFriends user={user} />
                </div>
        },
    ];

    return (
        <>
            <div className={tabWrapper}>
                <Tabs tabs={tabData} customStyles={customTabStyles} />
            </div>
            <div id={friendsWrapper}>
                {/* <Tabs tabs={tabData} customStyles={customTabStyles}/> */}
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
        </>
    )
}

export default ProfileFriends;

