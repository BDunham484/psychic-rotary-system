import { CheckCircleFill } from '@styled-icons/bootstrap/CheckCircleFill';
import { XCircleFill } from '@styled-icons/bootstrap/XCircleFill';
import { QuestionCircleFill } from '@styled-icons/bootstrap/QuestionCircleFill';

const index = () => {
    return (
        <div className='rsvp-container'>
            <CheckCircleFill className='rsvp-yes'/>
            <XCircleFill className='rsvp-no'/>
            <QuestionCircleFill className='rsvp-maybe' />
        </div>
    )
}

export default index
