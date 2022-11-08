import { useQuery } from "@apollo/client";
import { GET_TODAYS_CONCERTS } from "../utils/queries";
import { getTodaysDate } from "../utils/helpers";
import TodaysConcerts from "../components/TodaysConcerts";

const Home = () => {
  //use useQuery hook to make query request
  const { loading, data } = useQuery(GET_TODAYS_CONCERTS);

  const concerts = data?.concerts || [];
  //get todays date with imported helper function
  var date = getTodaysDate();

  return (
    <div className="page-wrapper">
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* <h1 className='todays-date'>{date}</h1> */}
            <TodaysConcerts concerts={concerts} date={date} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
