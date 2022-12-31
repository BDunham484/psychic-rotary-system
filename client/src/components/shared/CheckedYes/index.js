import { CheckCircleFill } from '@styled-icons/bootstrap/CheckCircleFill';

const CheckedYes = () => {

    const handleClick = () => {
        console.log('CheckedYes click handler has been clicked')
    }

    return (
        <>
            <CheckCircleFill className='rsvp-yes' onClick={() => handleClick()} />
        </>
    )
}

export default CheckedYes
