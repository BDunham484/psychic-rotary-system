import { TextSortAscending } from '@styled-icons/fluentui-system-filled/TextSortAscending';
import { TextSortDescending } from '@styled-icons/fluentui-system-filled/TextSortDescending';
import { Search } from '@styled-icons/bootstrap/Search'

const SortFilterBar = ({ setSortOrSearch, setIsAsc, isAsc }) => {

    const venueAZClickHandler = () => {
        setSortOrSearch('venue');
        setIsAsc(prev => !prev);
    };

    const artistAZClickHandler = () => {
        setSortOrSearch('artist');
        setIsAsc(prev => !prev);
    };

    const venueSearchClickHandler = () => {
        setSortOrSearch('search');
    };

    return (
        <div className='sortFilterContainer'>
            <button className={'venue-az sort-buttons'} onClick={venueAZClickHandler}>
                Venue {isAsc ? <TextSortAscending className='sortIcon' /> : <TextSortDescending className='sortIcon' />}
            </button>

            <button className={'artist-az sort-buttons'} onClick={artistAZClickHandler}>
                Artist {isAsc ? <TextSortAscending className='sortIcon' /> : <TextSortDescending className='sortIcon' />}
            </button>
            
            <button className={'venue-dropdown sort-buttons'} onClick={venueSearchClickHandler}>
                Venue <Search className='sortIcon' />
            </button>
        </div>
    );
};

export default SortFilterBar;
