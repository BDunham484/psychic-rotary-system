import { useState } from "react";
import ShowCard from "../ShowCard";

const VenueSearchInput = ({ venues, setVenueName }) => {
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

    const venueClickHandler = (e) => {
        e.preventDefault();
        let venueName = e.target.textContent
        setVenueName(venueName);
    }

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

        setMatches(results[0])

        let noMatch = 'No matches';

        if (results[0] === undefined) {
            // setShowResult(false)
            // setFound(false)
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
            <form onSubmit={handleSearch}>
                <div className="friend-search-input-wrapper">
                    <input
                        onChange={handleTextChange}
                        type="text"
                        placeholder="Venue Name"
                        value={text}
                        className="friend-search-input"
                    />
                    <button disabled={btnDisabled} className="friend-search-button" type="submit" >Search</button>
                </div>
            </form>
            {showResult &&
                <>
                    {found ? (
                        <ShowCard>
                            <div id="show-card-data">
                                {matches === 'No matches' ? (
                                    <span className="venue-name">{matches}</span>
                                ) : (
                                    <span className="venue-name" onClick={venueClickHandler}>{matches}</span>
                                )}
                                {/* <span className="venue-name" onClick={venueClickHandler}>{result}</span> */}
                            </div>
                        </ShowCard>
                    ) : (
                        <div className="names">{result}</div>
                    )}
                </>
            }
        </div>
    )
}

export default VenueSearchInput;
