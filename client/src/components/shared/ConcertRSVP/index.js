import { useContext } from 'react';
import { ConcertContext } from '../../../utils/GlobalState';
import { CheckCircleFill } from '@styled-icons/bootstrap/CheckCircleFill';
import { XCircleFill } from '@styled-icons/bootstrap/XCircleFill';
import { QuestionCircleFill } from '@styled-icons/bootstrap/QuestionCircleFill';

const ConcertRSVP = ({ concertId }) => {

    const { user } = useContext(ConcertContext);

    console.log('USER IN CONCERTRSVP');
    console.log(user);

    return (
        <div className='rsvp-container'>
            <CheckCircleFill className='rsvp-yes'/>
            <XCircleFill className='rsvp-no'/>
            <QuestionCircleFill className='rsvp-maybe' />
        </div>
    )
}

export default ConcertRSVP
