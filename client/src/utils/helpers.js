export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Concert dates are stored as midnight UTC of the venue's calendar day. Build the
// local-midnight Date from the *UTC* Y/M/D so consumers' local getDate()/getMonth()
// render the correct calendar day in any timezone (no off-by-one in UTC-negative zones).
export const toLocalMidnight = (isoString) => {
    const d = new Date(isoString);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

export const getTodaysDate = () => {
    const date = new Date().toDateString();
    return date;
}

export const formatConcertDate = (isoString) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getUTCDay()]} ${months[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2, '0')} ${date.getUTCFullYear()}`;
};

export const getSkeletonArray = (count, total) => {
    const subArray = [];
    let arrayLength = 0;

    if (count <= total) {
        arrayLength = total - count;
    }

    if (arrayLength > 0) {
        for (let i = 0; i < arrayLength; i++) {
            subArray.push({ 'skeleton': i });
        };
    }

    return subArray;
};

export const concertSlug = (customId) => {
    if (!customId || typeof customId === 'string') return customId || '';
    return [customId.headliner, customId.date, customId.venue]
        .join('')
        .split(/[,.'"\s]+/)
        .join('');
};

export const deriveFriendship = (me, targetId) => {
    if (!me || !targetId) return 'none';
    if (me.blockedUsers?.some(u => u._id === targetId)) return 'blocked';
    if (me.friends?.some(u => u._id === targetId))      return 'friend';
    if (me.sentRequests?.some(u => u._id === targetId)) return 'requested';
    return 'none';
};

