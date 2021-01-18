const colours = require('../util/colours.json');

/**
 * Calculates the current day of the year
 * @returns the current day of the year
 */
const getDayOfYear = () => {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}

/**
 * Base Event Object
 * @see https://developers.google.com/calendar/v3/reference/events
 * @returns The Event Object (Not a Class Instance)
 */
const Event = ({stub, eventDifficulty}) => {
  const dayOfYear = getDayOfYear();
  const allDay = new Date().toJSON().split('T')[0];
  return ({
    'summary': `LeetDay ${dayOfYear} 🌟 ${eventDifficulty} Train your Skills Daily!🚦`,
    'location': 'Online',
    'description': `Every day is a #LeetDay! \nhttps://www.leetcode.com/problems/${stub}`,
    'start': {
      'date': allDay,
      'timeZone': 'Europe/London',
    },
    'end': {
      'date': allDay,
      'timeZone': 'Europe/London',
    },
    'colorId': colours[eventDifficulty],
    'status': 'confirmed',
    'visibility': 'public',
    'source': {
      'title': 'LeetCode Problem Statement',
      'url': `https://leetcode.com/problems/${stub}/`,
    },
    'guestsCanModify': false,
  });
}

module.exports = Event;
