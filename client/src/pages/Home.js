import { useContext, useState } from "react";
import ConcertsVenueAZ from '../components/ConcertsVenueAZ';
import ConcertsArtistsAZ from '../components/ConcertsArtistsAZ';
import { ConcertContext } from '../utils/GlobalState'
import UtilityBar from '../components/UtilityBar';
import SortFilterBar from '../components/SortFilterBar';
import VenueSearch from "../components/VenueSearch";


const Home = () => {
  const { date, sortOrSearch, setSortOrSearch  } = useContext(ConcertContext);

  const [optionsOpen, setOptionsOpen] = useState(false);

  return (
    <>
      <UtilityBar optionsOpen={optionsOpen} setOptionsOpen={setOptionsOpen} />
      {optionsOpen &&
        <SortFilterBar setSortOrSearch={setSortOrSearch} />
      }
      <div className={optionsOpen ? 'wrapperOptions' : 'wrapper'}>
        <div className={`home-page-wrapper`}>
          
            <div>
              {sortOrSearch === 'venue' &&
                <ConcertsVenueAZ date={date} />
              }
              {sortOrSearch === 'artist' &&
                <ConcertsArtistsAZ date={date} />
              }
              {sortOrSearch === 'search' &&
                <VenueSearch />
              }
            </div>
        </div>
      </div>
    </>
  );
};

export default Home;
