// @ts-ignore
import styles from './styles/Friends.module.css';

const SkeletonFriendListItem = () => {
    const {
        skeletonShowCard,
        skeletonLine,
    } = styles;
    return (
        <div>
            <div className={skeletonShowCard}>
                <div className={skeletonLine}></div>
            </div>
        </div>
    );
};

export default SkeletonFriendListItem;
