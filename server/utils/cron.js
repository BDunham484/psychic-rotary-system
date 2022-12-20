const cron = require('node-cron');
const { getTodaysDate, dbConcertUpdater } = require('./helpers');
const { concertsForDatabase } = require('./scraper');


cron.schedule('* * * * *', () => {
    console.log('CRON JOB IS RUNNING');
    const date = getTodaysDate();
    console.log(date);
    concertsForDatabase(date);
    console.log(concertData);
});