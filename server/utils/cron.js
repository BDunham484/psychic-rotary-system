var cron = require('node-cron');

cron.schedule('* * * * *', () => {
    console.log('CRON JOB IS RUNNING');
})