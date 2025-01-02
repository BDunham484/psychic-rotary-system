// @ts-ignore
import styles from './RequestBlock.module.css';
import { useMutation } from '@apollo/client';
import { ADD_FRIEND } from '../../utils/mutations';
import RequestBlockHeader from './RequestBlockHeader';
import RequestBlockForm from './RequestBlockForm';

const RequestBlock = ({ userParam, user, inputSwitched, setInputSwitched }) => {
    const {
        requestBlockWrapper,
    } = styles;
    const [addFriend] = useMutation(ADD_FRIEND);

    //onClick handler for add friend
    const handleClick = async () => {
        try {
            await addFriend({
                variables: { id: user._id }
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={requestBlockWrapper}>
            <RequestBlockHeader inputSwitched={inputSwitched} setInputSwitched={setInputSwitched} />
            {userParam &&
                <button onClick={handleClick}>
                    Add Friend
                </button>
            }
            <RequestBlockForm userParam={userParam} inputSwitched={inputSwitched} user={user} />
        </div>
    )
}

export default RequestBlock;

