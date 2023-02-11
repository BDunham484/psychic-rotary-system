import Switch from 'react-switch';

const RequestBlockHeader = ({ inputSwitched, setInputSwitched }) => {

    const handleInputSwitch = () => {
        inputSwitched ? setInputSwitched(false) : setInputSwitched(true)
    };

    return (
        <div>
<div className="display-flex">
                {inputSwitched ? (
                    <>
                        <h2>Request</h2>
                        <label>
                            <Switch
                                onChange={handleInputSwitch}
                                checked={inputSwitched}
                                offColor={'#525050'}
                                onColor={'#525050'}
                                offHandleColor={'#383737'}
                                onHandleColor={'#383737'}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow={'#eee3d0'}
                                activeBoxShadow={'#eee3d0'}
                            />
                        </label>
                        <h2 className="unSwitched">Block</h2>
                    </>
                ) : (
                    <>
                        <h2 className="unSwitched">Request</h2>
                        <label>
                            <Switch
                                onChange={handleInputSwitch}
                                checked={inputSwitched}
                                offColor={'#525050'}
                                onColor={'#525050'}
                                offHandleColor={'#383737'}
                                onHandleColor={'#383737'}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow={'#eee3d0'}
                                activeBoxShadow={'#eee3d0'}
                            />
                        </label>
                        <h2>Block</h2>
                    </>
                )}
            </div>
        </div>
    )
}

export default RequestBlockHeader;
