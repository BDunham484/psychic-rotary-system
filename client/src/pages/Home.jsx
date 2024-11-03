import { useContext, useState } from "react";
import ConcertsVenueAZ from '../components/ConcertsVenueAZ/ConcertsVenueAZ';
import ConcertsArtistsAZ from '../components/ConcertsArtistsAZ/ConcertsArtistsAZ';
import { ConcertContext } from '../utils/GlobalState'
import UtilityBar from '../components/UtilityBar/UtilityBar';
import SortFilterBar from '../components/SortFilterBar/SortFilterBar';
import VenueSearch from "../components/VenueSearch/VenueSearch";


const Home = () => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isAsc, setIsAsc] = useState(true);

  const { date, sortOrSearch, setSortOrSearch  } = useContext(ConcertContext);

  return (
    <div id='home-wrapper'>
      <UtilityBar optionsOpen={optionsOpen} setOptionsOpen={setOptionsOpen} />
      {optionsOpen &&
        <SortFilterBar setSortOrSearch={setSortOrSearch} setIsAsc={setIsAsc} isAsc={isAsc}/>
      }
      <div className={optionsOpen ? 'wrapperOptions' : 'wrapper'}>
        <div className={`home-page-wrapper`}>
          
            <div>
              {sortOrSearch === 'venue' &&
                <ConcertsVenueAZ date={date} isAsc={isAsc} />
              }
              {sortOrSearch === 'artist' &&
                <ConcertsArtistsAZ date={date} isAsc={isAsc} />
              }
              {sortOrSearch === 'search' &&
                <VenueSearch />
              }
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
