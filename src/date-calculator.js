'use strict';

const prompt = require('prompt');
const moment = require('moment');
const dateCalculator = require('../lib/date-calculator');

const schema = {
    properties: {
        fromDate: {
            description: 'From Date',
            message: 'Format: dd/mm/yyyy, ex: 31/01/2018',
            pattern: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
            required: true
        },
        toDate: {
            description: 'To Date',
            message: 'Format: dd/mm/yyyy, ex: 31/01/2018',
            pattern: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
            required: true
        }
    }
};

prompt.start();
prompt.get(schema, function (err, result) {
    console.log('\n');
    console.log('Command-line input received:');
    console.log('  from date: ' + result.fromDate);
    console.log('  to date: ' + result.toDate);
    console.log('\n');
    console.log('Date elapsed: ' + dateCalculator(result.fromDate, result.toDate));
    let fromDateInSeconds = moment(result.fromDate, "DD/MM/YYYY").unix();
    let toDateInSeconds = moment(result.toDate, "DD/MM/YYYY").subtract(1, 'day').unix();
    console.log('Validation: ' + ((toDateInSeconds-fromDateInSeconds)/60/60/24));
});
