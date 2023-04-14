import { TextSortAscending } from '@styled-icons/fluentui-system-filled/TextSortAscending';
import { Search } from '@styled-icons/bootstrap/Search'

const SortFilterBar = ({ sortOrSearch, setSortOrSearch }) => {
    return (
        <div className="sortFilterContainer">
            <button className={'venue-az sort-buttons'} onClick={() => {setSortOrSearch('venue')}}>
                Venue <TextSortAscending className={'sortIcon'} />
            </button>
            <button className={'artist-az sort-buttons'} onClick={() => {setSortOrSearch('artist')}}>
                Artist <TextSortAscending className={'sortIcon'} />
            </button>
            <button className={'venue-dropdown sort-buttons'} onClick={() => {setSortOrSearch('search')}}>
                Venue <Search className={'sortIcon'} />
            </button>
        </div>
    )
}

export default SortFilterBar;
