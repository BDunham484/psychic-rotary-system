import { TextSortAscending } from '@styled-icons/fluentui-system-filled/TextSortAscending';
import { Search } from '@styled-icons/bootstrap/Search'

const SortFilterBar = ({ setSortOrSearch }) => {

    const venueAZClickHandler = () => {
        setSortOrSearch('venue')
    }

    const artistAZClickHandler = () => {
        setSortOrSearch('artist')
    }

    const venueSearchClickHandler = () => {
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
