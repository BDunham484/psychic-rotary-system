// import cron from 'node-cron';
const cron = require('node-cron');
// import { users } from '../schemas/resolvers';
const users = require('../schemas/resolvers')


cron.schedule('* * * * *', () => {
    console.log('CRON JOB IS RUNNING');
    users();
});