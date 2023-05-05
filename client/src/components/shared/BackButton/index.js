import { useNavigate } from 'react-router-dom'
import { ArrowHookUpLeft } from '@styled-icons/fluentui-system-regular/ArrowHookUpLeft'

const BackButton = () => {

    let history = useNavigate()

    const clickBack = () => {
        history(-1)
    }

    return (
        <div>
            <ArrowHookUpLeft type="button" className='back-button' onClick={clickBack} />
        </div>
    )
}

export default BackButton;
