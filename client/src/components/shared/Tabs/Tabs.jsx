import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import styles from './Tabs.module.css';

const Tabs = ({
    tabs,
    customStyles = {
        customTabButton: undefined,
        activeListTab: undefined,
        activeRequestTab: undefined,
        activeBlockTab: undefined,
        customTabContent: undefined,
    },
}) => {
    // const [activeTab, setActiveTab] = useState(1);
    const [activeTab, setActiveTab] = useState(0);
    const [fade, setFade] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');
    const [sliderStyle, setSliderStyle] = useState({});
    const tabRefs = useRef([]); // Store references to each tab button
    const {
        tabsContainer,
        tabs: tabsStyles,
        active,
        tabButton,
        slider,
        tabContent,
        fadeOut,
        fadeIn,
    } = styles;
    const [tabContentStyles, setTabContentStyles] = useState(tabContent);
    const [buttonStyles, setButtonStyles] = useState(tabButton);
    // const [activeTabState, setActiveTabState] = useState(0);
    const {
        customTabButton,
        activeListTab,
        activeRequestTab,
        activeBlockTab,
        customTabContent,
    } = customStyles;

    useEffect(() => {
        // Position the slider based on the active tab
        if (tabRefs.current[activeTab]) {
            const { offsetLeft, offsetWidth } = tabRefs.current[activeTab];
            setSliderStyle({
                left: offsetLeft,
                width: offsetWidth,
            });
        }
    }, [activeTab]);

    useEffect(() => {
        if (customTabButton) {
            setButtonStyles(customTabButton);
        }

        if (customTabContent) {
            setTabContentStyles(customTabContent);
        }

        // if ((tabs.label?.includes('Friends'))) {
        //     console.log('👾👾👾👾 activeTab: ', activeTab);
        //     console.log('👾👾👾👾 (tabs.label.includes(Friends)): ', (tabs.label.includes('Friends')));
        //     console.log(' ');
        //     setTabContentStyles(customTabContent)
        // }
    }, [customTabButton, customTabContent]);

    const handleTabClick = (index) => {
        if (index !== activeTab) {
            setFade(true); // Start fade out
            setSlideDirection(index > activeTab ? 'slideRight' : 'slideLeft'); // Set direction based on tab index
            setFade(false); // Start fade in
            setTimeout(() => {
                setActiveTab(index); // Change tab after slide transition
            }, 300);
        }
    };

    return (
        <div className={tabsContainer}>
            <div className={tabsStyles}>
                {tabs.map((tab, index) => {
                    let testStyles = active;
                    if (activeListTab && (activeTab === 0)) {
                        testStyles = activeListTab;
                    } else if (activeRequestTab && (activeTab === 1)) {
                        testStyles = activeRequestTab;
                    }
                    if (activeBlockTab && (activeTab === 2)) {
                        testStyles = activeBlockTab;
                    }

                    return (
                        <button
                            key={index}
                            ref={(el) => (tabRefs.current[index] = el)} // Assign ref to each tab button
                            // changelog-start
                            className={`${buttonStyles} ${activeTab === index ? testStyles : ''}`}
                            // className={`${styles.tabButton} ${activeTab === index ? styles.active : ''}`}
                            // changelog-end
                            onClick={() => handleTabClick(index)}
                        >
                            <h2>{tab.label}</h2>
                        </button>
                    )
                })}
                <div className={slider} style={sliderStyle}></div>
            </div>
            <div className={`
                ${tabContentStyles}
                ${fade ? fadeOut : fadeIn}
                ${styles[slideDirection]}
                `}
                onAnimationEnd={() => setSlideDirection('')} // Reset slide direction after animation
            >
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
