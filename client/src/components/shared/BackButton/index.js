import { useNavigate } from 'react-router-dom'
import { Back } from '@styled-icons/entypo/Back'

const BackButton = () => {
    let history = useNavigate()

    const clickBack = () => {
        console.log('BACKBUTTONCLICKED')
        history(-1)
    }

    return (
        <div>
            <Back type="button" className='back-button' onClick={clickBack} />
            {/* <button type="button" onClick={clickBack}>BACK</button> */}
        </div>
    )
}

export default BackButton;
