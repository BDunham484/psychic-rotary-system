import spinner from '../assets/cubes.GIF';

const Spinner = () => {
    return <img src={spinner} alt="Loading..." style={{
        // width: '100px',
        margin: 'auto',
        display: 'block',
        paddingTop: '25px'
    }}/>
}

export default Spinner
