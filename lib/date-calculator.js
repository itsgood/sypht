'use strict';

const moment = require('moment');
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function dateCalculator(fromDate, toDate) {
    let fromDay, fromMonth, fromYear, toDay, toMonth, toYear;
    [fromDay, fromMonth, fromYear] = fromDate.split('/').map(num => parseInt(num, 10));
    [toDay, toMonth, toYear] = toDate.split('/').map(num => parseInt(num, 10));

    let fromYearInDay = elapsedDaysSince1901(fromYear);
    let toYearInDay = elapsedDaysSince1901(toYear);

    let fromMonthInDay = elapsedDaysSinceJan(fromMonth, fromYear);
    let toMonthInDay = elapsedDaysSinceJan(toMonth, toYear);

    let elapsedDays = (toYearInDay+toMonthInDay+toDay) - (fromYearInDay+fromMonthInDay+fromDay) - 1;

    return elapsedDays;
}

function leapyear(year)
{
    return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
}

function elapsedDaysSince1901(year) {
    let d = 0;
    for (let y=1901; y<year; y++) {
        d += (leapyear(y) ? 366 : 365);
    }
    return d;
}


function elapsedDaysSinceJan(month, year) {
    let d = 0;
    for (let m=1; m<month; m++) {
        d += (leapyear(year) && m == 2 ? 29 : daysInMonth[m-1]);
    }
    return d;
}

module.exports = dateCalculator;