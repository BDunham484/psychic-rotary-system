import { TextSortAscending } from '@styled-icons/fluentui-system-filled/TextSortAscending';
import { Search } from '@styled-icons/bootstrap/Search'

const SortFilterBar = ({ setSortOrSearch, setVenueName }) => {

    const venueAZClickHandler = () => {
        setVenueName('');
        setSortOrSearch('venue')
    }

    const artistAZClickHandler = () => {
        setVenueName('');
        setSortOrSearch('artist')
    }

    const venueSearchClickHandler = () => {
        setVenueName('');
        setSortOrSearch('search')
    }

    return (
        <div className="sortFilterContainer">
            <button className={'venue-az sort-buttons'} onClick={venueAZClickHandler}>
                Venue <TextSortAscending className={'sortIcon'} />
            </button>

            <button className={'artist-az sort-buttons'} onClick={artistAZClickHandler}>
                Artist <TextSortAscending className={'sortIcon'} />
            </button>
            
            <button className={'venue-dropdown sort-buttons'} onClick={venueSearchClickHandler}>
                Venue <Search className={'sortIcon'} />
            </button>
        </div>
    )
}

export default SortFilterBar;
