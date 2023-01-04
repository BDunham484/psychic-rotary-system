import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { XCircle } from '@styled-icons/bootstrap/XCircle';
import { CANCEL_RSVP_NO } from '../../../utils/mutations';

const index = ({ concertId }) => {
    return (
        <div>
            <XCircle className='rsvp-no' />
        </div>
    )
}

export default index
