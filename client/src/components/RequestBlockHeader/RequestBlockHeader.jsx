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
                        <h3 className='friends-sub-titles'>Request</h3>
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
                        <h3 className="unSwitched">Block</h3>
                    </>
                ) : (
                    <>
                        <h3 className="unSwitched">Request</h3>
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
                        <h3 className='friends-sub-titles'>Block</h3>
                    </>
                )}
            </div>
        </div>
    )
}

export default RequestBlockHeader;
