import { useQuery } from "@apollo/client";
import { GET_TODAYS_CONCERTS } from "../utils/queries";
import { getTodaysDate } from "../utils/helpers";
import TodaysConcerts from "../components/TodaysConcerts";

const Home = () => {
  const test = 'testy mctesterson and the testes'
  //use useQuery hook to make query request
  const { loading, data } = useQuery(GET_TODAYS_CONCERTS, {
    variables: { test }
  });

  const concerts = data?.concerts || [];
  //get todays date with imported helper function
  var today = getTodaysDate();
  

  return (
    <div className="page-wrapper">
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* <h1 className='todays-date'>{date}</h1> */}
            <TodaysConcerts concerts={concerts} today={today} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
