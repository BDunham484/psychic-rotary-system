import { PlusSquareFill } from '@styled-icons/bootstrap/PlusSquareFill';
// import { SquaredMinus } from '@styled-icons/entypo/SquaredMinus';

const PlusMinusButton = ({ concertId }) => {
    const handleClick = (id) => {
        console.log(id)
    }

    return (
        <>
            <PlusSquareFill className="plus-sign" onClick={() => handleClick(concertId)} />
        </>
    )
}

export default PlusMinusButton
