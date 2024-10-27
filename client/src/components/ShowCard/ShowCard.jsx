
const ShowCard = ({ id = undefined, children }) => {
    return (
        <div id={id} className='show-card'>
            {children}
        </div>
    )
};

export default ShowCard;
