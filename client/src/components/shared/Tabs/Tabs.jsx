import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import styles from './Tabs.module.css';

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [fade, setFade] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');
    const [sliderStyle, setSliderStyle] = useState({});
    const tabRefs = useRef([]); // Store references to each tab button

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
        <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        ref={(el) => (tabRefs.current[index] = el)} // Assign ref to each tab button
                        className={`${styles.tabButton} ${activeTab === index ? styles.active : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        <h2>{tab.label}</h2>
                    </button>
                ))}
                <div className={styles.slider} style={sliderStyle}></div>
            </div>
            <div className={`
                ${styles.tabContent}
                ${fade ? styles.fadeOut : styles.fadeIn}
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
