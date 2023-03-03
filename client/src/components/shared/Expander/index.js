import { ExpandLess } from "@styled-icons/material-rounded/ExpandLess";
import { ExpandMore } from "@styled-icons/material-sharp/ExpandMore";

const Expander = ({ expand, setExpand }) => {

    const handleExpand = () => {
        expand ? setExpand(false) : setExpand(true)
    }

    return (
        <div>
            {!expand ? (
                <ExpandMore className="chevron" onClick={handleExpand} />
            ) : (
                <ExpandLess className="chevron" onClick={handleExpand} />
            )}
        </div>
    )
}

export default Expander;
