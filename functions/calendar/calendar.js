const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const {client_id, client_secret, refresh_token, calendar_id} = require('../credentials/calendar-config.json');
const query = require('../firebase/queryDatabase');
const Event = require('./Event');

const oAuth2Client = new OAuth2(
  client_id, 
  client_secret
);

oAuth2Client.setCredentials({
  refresh_token: refresh_token
});

const calendar = google.calendar({
  version: 'v3',
  auth: oAuth2Client,
});

/**
 * Adds an event to calendar.
 * @param {*} event the event to add to the calendar.
 * @throws if the object is malformed or the operation fails.
 */
const addEventToCalendar = (event) =>
  calendar.events.insert({
    calendarId: calendar_id,
    resource: event,
  })
  .then(res => true)
  .catch(err => {
    console.log(err);
    return false;
  });

/**
 * Adds several events to LeetCode Calendar.
 * TODO: replace easy with problem difficulty.
 * @param the events to be added.
 */
const addEventsToCalendar = async (events) => {
  try {
    Object.keys(events).forEach(async (problem) => {
      const event = Event({stub: problem, eventDifficulty: events[problem]});
      await addEventToCalendar(event)
        .then(_ => query.markSeen(problem))
        .catch(err => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }

  return true;
}

const deleteEvent = (calendarId, eventId) =>
  calendar.events.delete({calendarId, eventId})
    .catch(err => console.log(err));

const clearCalendar = (calendarId) =>
  calendar.events.list({calendarId})
    .then(data => data.data.items)
    .then(events => events.forEach(event => {
      setTimeout(() => deleteEvent(calendarId, event.id), 4000);
      console.log('deleted '+event.id);
    }))
    .catch(err => console.log(err));

module.exports = {calendar, addEventToCalendar, addEventsToCalendar, clearCalendar, deleteEvent};
