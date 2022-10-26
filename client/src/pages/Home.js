import { useQuery } from '@apollo/client';
import { GET_TODAYS_CONCERTS } from '../utils/queries';
import TodaysConcerts from '../components/TodaysConcerts';

const Home = () => {
    //use useQuery hook to make query request
    const { loading, data } = useQuery(GET_TODAYS_CONCERTS);

    const concerts = data?.concerts || [];
    // console.log('HOME CONCERTS!!!!!!!!!');
    // console.log(concerts[1].dateTime)
    // if (concerts.length) {
        // const date = concerts[1].dateTime;
        // console.log(date);
    // }
    

    return (
        <div className="page-wrapper">
            
            <div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        {/* <h1 className='todays-date'>{date}</h1> */}
                        <TodaysConcerts concerts={concerts} date={concerts[2].dateTime}/>
                    </>
                    
                    
                )}
            </div>
        </div>
    )
}

export default Home;