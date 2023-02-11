import { useMutation } from "@apollo/client";
import { ADD_FRIEND } from "../../utils/mutations";
import RequestBlockHeader from "../RequestBlockHeader";
import RequestBlockForm from "../RequestBlockForm";

const FriendRequestInput = ({ userParam, user, inputSwitched, setInputSwitched }) => {

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
        <div>
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

export default FriendRequestInput;

