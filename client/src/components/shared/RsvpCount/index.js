

const RsvpCount = ({ count }) => {

    return (
        <div className="rsvp-counts" >
            {count > 0 && 
                <>
                    {count} Going
                </>
            }
        </div>
    )
}

export default RsvpCount
