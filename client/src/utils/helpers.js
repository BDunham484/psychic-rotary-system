export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const getTodaysDate = () => {
    const date = new Date().toDateString();
    return date;
}

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

