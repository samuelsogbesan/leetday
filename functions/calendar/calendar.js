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
 * @param events an array of events to be added.
 */
const addEventsToCalendar = async (events) => {
  var currentEvent = 0;
  const interval = setInterval(async function(){
    if (currentEvent >= events.length) {
      clearInterval(interval);
    } else {
      var event = events[currentEvent++];
      await addEventToCalendar(event)
      .then(_ => query.markSeen(event.stub))
      .catch(err => console.log(err));
    }
  }, 4000);
}

const deleteEvent = (calendarId, eventId) =>
  calendar.events.delete({calendarId, eventId})
    .catch(err => console.log(err));

/**
 * Clear the specified calendar.
 * @param {*} calendarId calendar to be cleared
 * @throws a TypeError at the end of the loop. I am unsure why this happens!
 */
const clearCalendar = (calendarId) =>
  calendar.events.list({calendarId})
    .then(data => data.data.items)
    .then(events => {
      console.log(`Deleting ${events.length} events.`);
      var currentEvent = 0;

      const interval = setInterval(async function() {
        if (currentEvent >= events.length) {
          clearInterval(interval);
          return;
        }
        console.log(`Deleting ${events[currentEvent].id}`);
        try {
          await deleteEvent(calendarId, events[currentEvent++].id);
          console.log(`deleted ${events[currentEvent].id}`);
        } catch (err) {
          console.log(err);
        }
      }, 2000);
    })
    .catch(err => console.log(err));

module.exports = {calendar, addEventToCalendar, addEventsToCalendar, clearCalendar, deleteEvent};
