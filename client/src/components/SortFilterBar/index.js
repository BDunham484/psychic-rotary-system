import { TextSortAscending } from '@styled-icons/fluentui-system-filled/TextSortAscending';
import { Search } from '@styled-icons/bootstrap/Search'

const SortFilterBar = () => {
    return (
        <div className="sortFilterContainer">
            <button className={'venue-az sort-buttons'}>Venue <TextSortAscending className={'sortIcon'}/></button>
            <button className={'artist-az sort-buttons'}>Artist <TextSortAscending className={'sortIcon'}/></button>
            <button className={'venue-dropdown sort-buttons'}>Venue <Search className={'sortIcon'} /></button>
        </div>
    )
}

export default SortFilterBar;
