// @ts-ignore
import styles from './Profile.module.css';

const SkeletonShowCard = () => {
    return (
        <div>
            <div className={styles.skeletonShowCard}>
                <div className={styles.skeletonImage}></div>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonLine}></div>
                <div className={styles.skeletonLine}></div>
                <div className={styles.skeletonLine}></div>
            </div>
        </div>
    );
};

export default SkeletonShowCard;
