// @ts-ignore
import styles from './VenueSearch.module.css';
import { useState } from "react";
import ShowCard from "../ShowCard/ShowCard";
import { Link } from "react-router-dom";
import { Search } from "@styled-icons/bootstrap/Search";

const VenueSearchInput = ({ venues }) => {
    // set state for input text
    const [text, setText] = useState('');
    // set state for search button 
    const [btnDisabled, setBtnDisabled] = useState(true);
    // set state for showing results of search after form submission
    const [showResult, setShowResult] = useState(false);
    // set state on whether the search input is found in the user's friends list
    const [found, setFound] = useState(false);
    // set state for the result of the search
    const [result, setResult] = useState('');
    const [matches, setMatches] = useState([]);
    const {
        venueName,
        venueSearchForm,
        venueSearchInputWrapper,
        venueSearchInputLabel,
        searchIcon,
        venueSearchInput,
        venueSearchButton,
        venueSearchListItems,
        names,
        borderBottom,
    } = styles;

    //handler for friend search text input
    const handleTextChange = (e) => {
        setText(e.target.value)

        if (e.target.value === '') {
            setBtnDisabled(true)
            setShowResult(false)
            setFound(false)
        } else {
            setBtnDisabled(false)
            setShowResult(true)
            setFound(true)
            setResult(text)
        };

        const results = venues.filter(venue => {
            if (e.target.value === '') {
                return venues
            }

            return venue.toLowerCase().includes(e.target.value.toLowerCase())
        })

        setMatches([results[0], results[1], results[2]])

        let noMatch = ['No matches'];

        if (results[0] === undefined && results[1] === undefined) {
            setShowResult(false)
            setMatches(noMatch)
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();

        let lowerCaseVenues = venues.map((venue) => venue.toLowerCase())
        let lowerCaseText = text.toLowerCase().trim();

        if (lowerCaseVenues.includes(lowerCaseText)) {
            let index = lowerCaseVenues.indexOf(lowerCaseText)
            setResult(venues[index]);
            setFound(true);
        } else {
            setResult('Venue Not Found');
            setFound(false);
        }

        setText('')
        setShowResult(true);
    }

    return (
        <div>
            <form className={venueSearchForm} onSubmit={handleSearch}>
                <div className={venueSearchInputWrapper}>
                    <label className={venueSearchInputLabel}>
                    <Search className={searchIcon} />
                    <input
                        onChange={handleTextChange}
                        type="text"
                        placeholder="Venue"
                        value={text}
                        className={venueSearchInput}
                    />
                    <button
                        disabled={btnDisabled}
                        className={venueSearchButton}
                        type="submit" >
                            Search
                    </button>
                    </label>
                </div>
                {showResult &&
                    <>
                        {found ? (
                            matches.map((match, index) => (
                                match &&
                                <ShowCard key={index}>
                                    <div className={venueSearchListItems}>
                                        {match === 'No matches' ? (
                                            <span className={venueName}>{match}</span>
                                        ) : (
                                            <Link to={`/venue/${match}}`} state={{ venueName: match }}>
                                                <span className={venueName} >{match}</span>
                                            </Link>
                                        )}
                                    </div>
                                </ShowCard>
                            ))
                        ) : (
                            <div className={names}>{result}</div>
                        )}
                        <div className={borderBottom}></div>
                    </>
                }
            </form>
        </div>
    )
}

export default VenueSearchInput;
