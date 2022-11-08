import { useParams } from "react-router-dom";

const Show = () => {
    const { artists } = useParams();
    console.log(artists);


    return (
        <div className='page-wrapper'>
            Show
        </div>
    )
}

export default Show;