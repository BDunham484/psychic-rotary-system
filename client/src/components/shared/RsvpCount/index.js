

const RsvpCount = ({ count }) => {

    return (
        <div className="rsvp-counts" >
            {count > 0 && 
                <>
                    {count}
                </>
            }
        </div>
    )
}

export default RsvpCount
