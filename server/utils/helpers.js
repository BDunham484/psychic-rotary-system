module.exports = {
    getTodaysDate: () => {
        const date = new Date().toDateString();
        return date;
    },
    dbConcertUpdater: async (arr) => {
        await Promise.all(arr.map(async (dailyArr) => {
            console.log('DAILYARR');
            console.log(dailyArr);
            await Promise.all(dailyArr.map(async (concert) => {
                console.log('CONCERT WITHIN UPDATER MAP');
                console.log(concert);
                try {
                    await addConcert({
                        variables: { ...concert }
                    })
                } catch (e) {
                    console.error(e)
                }
            }))
        }))
    }



};