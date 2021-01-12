/**
 * Base Event Object
 * @see https://developers.google.com/calendar/v3/reference/events
 * @returns The Event Object (Not a Class Instance)
 */
const Event = () => {
  return ({
    'summary': 'LeetDay I_DAY 🌟 (I_DIFFICULTY) Train your Skills Daily!🚦',
    'location': 'Online',
    'description': 'Every day is a #LeetDay! \nhttps://www.leetcode.com/problems/I_STUB',
    'start': {
      'date': null,
      'timeZone': 'Europe/London',
    },
    'end': {
      'date': null,
      'timeZone': 'Europe/London',
    },
    'colorId': 7,
    'status': 'confirmed',
    'visibility': 'public',
    'source': {
      'title': 'LeetCode Problem Statement',
      'url': 'https://leetcode.com/problems/I_STUB/',
    },
    'guestsCanModify': false,
  });
}

module.exports = Event;
