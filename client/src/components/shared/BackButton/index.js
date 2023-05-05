import { useNavigate } from 'react-router-dom'

const BackButton = () => {
    let history = useNavigate()

    const clickBack = () => {
        console.log('BACKBUTTONCLICKED')
        history(-1)
    }

    return (
        <div>
            <button type="button" onClick={clickBack}>BACK</button>
        </div>
    )
}

export default BackButton;
