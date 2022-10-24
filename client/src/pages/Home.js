import { useQuery } from '@apollo/client';
import { GET_TODAYS_CONCERTS } from '../utils/queries';

const Home = () => {
    //use useQuery hook to make query request
    const { loading, data } = useQuery(GET_TODAYS_CONCERTS);

    const concerts = data?.concerts || [];
    console.log(concerts)

    return (
        <div className="page-wrapper">
            <h1>HOME PAGE</h1>
            <div>

            </div>
        </div>
    )
}

export default Home;