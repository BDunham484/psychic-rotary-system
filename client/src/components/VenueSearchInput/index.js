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

    const venueClickHandler = (e) => {
        e.preventDefault();
        let venueName = e.target.textContent
        setVenueName(venueName);
    }

    //handler for friend search text input
    const handleTextChange = (e) => {
        setText(e.target.value)

        if (text === '') {
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        };
    };

    const handleSearch = (event) => {
        event.preventDefault();

        if (venues.includes(text)) {
            setResult(text);
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
                    <button className="friend-search-button" type="submit" >Search</button>
                </div>
            </form>
            {showResult &&
                <>
                    {found ? (
                        <ShowCard>
                            <div id="show-card-data">
                                <span className="venue-name" onClick={venueClickHandler}>{result}</span>
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
