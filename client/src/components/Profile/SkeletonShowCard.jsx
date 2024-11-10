// @ts-ignore
import styles from './Profile.module.css';

const SkeletonShowCard = () => {
    const {
        skeletonShowCard,
        skeletonImage,
        skeletonTitle,
        skeletonLine,
    } = styles;
    return (
        <div>
            <div className={skeletonShowCard}>
                <div className={skeletonImage}></div>
                <div className={skeletonTitle}></div>
                <div className={skeletonLine}></div>
                <div className={skeletonLine}></div>
                <div className={skeletonLine}></div>
            </div>
        </div>
    );
};

export default SkeletonShowCard;
