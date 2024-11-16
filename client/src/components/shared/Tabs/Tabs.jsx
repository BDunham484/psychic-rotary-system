import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// @ts-ignore
import styles from './Tabs.module.css';

const Tabs = ({
    tabs,
    customStyles,
}) => {
    const [activeTab, setActiveTab] = useState(0);
    const [fade, setFade] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');
    const [sliderStyle, setSliderStyle] = useState({});
    // Store references to each tab button
    const tabRefs = useRef([]);
    const {
        tabsContainer,
        tabs: tabsStyles,
        active,
        slider,
        fadeOut,
        fadeIn,
    } = styles;
    const [tabContentStyles, setTabContentStyles] = useState(undefined);
    const [buttonStyles, setButtonStyles] = useState(undefined);
    const {
        parentId,
        customTabButton,
        activeProfileTab,
        activeListTab,
        activeRequestTab,
        activeBlockTab,
        customTabContent,
    } = customStyles;

    const updateSlider = useCallback((activeTab) => {
        if (tabRefs.current[activeTab]) {
            const { offsetLeft, offsetWidth } = tabRefs.current[activeTab];
            setSliderStyle({
                left: offsetLeft,
                width: offsetWidth,
            });
        }
    }, []);

    // Delay updateSlider() call to give DOM time to "settle"
    // If not, the initial offset values returned are incorrect
    useEffect(() => {
        const timer = setTimeout(() => {
            updateSlider(activeTab);
        }, 50);
        return () => clearTimeout(timer);
    }, [activeTab]);

    // Set component specific custom styles
    useEffect(() => {
        if (customTabButton) {
            setButtonStyles(customTabButton);
        }

        if (customTabContent) {
            setTabContentStyles(customTabContent);
        }
    }, [customTabButton, customTabContent]);

    const handleTabClick = useCallback((index) => {
        if (index !== activeTab) {
            // Start fade out
            setFade(true);
            // Set direction based on tab index
            setSlideDirection(index > activeTab ? 'slideRight' : 'slideLeft');
            // Start fade in
            setFade(false);
            setTimeout(() => {
                // Change tab after slide transition
                setActiveTab(index);
            }, 300);
        }
    }, [activeTab]);

    const activeTabStyle = useMemo(() => {
        let testStyles = active;
        if (parentId === 'ProfileFriends') {
            if (activeListTab && (activeTab === 0)) {
                testStyles = activeListTab;
            } else if (activeRequestTab && (activeTab === 1)) {
                testStyles = activeRequestTab;
            }
            if (activeBlockTab && (activeTab === 2)) {
                testStyles = activeBlockTab;
            }
        } else if (parentId === 'Profile') {
            testStyles = activeProfileTab;
        }

        return testStyles;
    }, [parentId, activeTab]);

    return (
        <div className={tabsContainer}>
            <div className={tabsStyles}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        // Assign ref to each tab button
                        ref={(el) => (tabRefs.current[index] = el)}
                        className={`${buttonStyles} ${activeTab === index ? activeTabStyle : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        <h2>{tab.label}</h2>
                    </button>
                ))}
                <div className={slider} style={sliderStyle}></div>
            </div>
            <div className={`
                ${tabContentStyles}
                ${fade ? fadeOut : fadeIn}
                ${styles[slideDirection]}
                `}
                // Reset slide direction after animation
                onAnimationEnd={() => setSlideDirection('')}
            >
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
