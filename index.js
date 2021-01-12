const Event = require('./Event');
const calendar = require('./calendar-auth');
const colours = require('./colours.json');
const populateDatabase = require('./populateDatabase');
const schedule = require('node-schedule');
const query = require('./queryDatabase');

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
 * Creates an Event Object.
 * @param stub the problem stub.
 * @param eventDifficulty. the difficulty of the problem.
 * @returns the event object.
 */
const createEvent = (stub, eventDifficulty) => {
  const event = Event();
  // Grab Date in yyyy-mm-dd format
  const allDay = new Date().toJSON().split('T')[0];

  event.start.date = allDay;
  event.end.date = allDay;

  event.summary = event.summary.replace('I_DIFFICULTY', eventDifficulty);
  event.description = event.description.replace('I_STUB', stub);
  event.source.url = event.source.url.replace('I_STUB', stub);
  event.summary = event.summary.replace('I_DAY', getDayOfYear());
  event.colorId = colours[eventDifficulty];

  return event;
}

/**
 * Adds an event to calendar.
 * @param {*} event the event to add to the calendar.
 * @throws if the object is malformed or the operation fails.
 */
const addEventToCalendar = (event) =>
  calendar.events.insert({
    calendarId: '9hbbf9sjnqls0mfhep9ded5pd4@group.calendar.google.com',
    resource: event,
  })
  .then(res => true)
  .catch(err => {
    console.log(err);
    return false
  });

/**
 * Adds several events to LeetCode Calendar.
 * TODO: replace easy with problem difficulty.
 * @param the events to be added.
 */
const addEventsToCalendar = async (events) => {
  try {
    Object.keys(events).forEach(async (problem) => {
      const event = createEvent(problem, 'EASY');
      await addEventToCalendar(event)
        .then(_ => query.markSeen(problem))
        .catch(err => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }

  return true;
}

/**
 * Main Job Reponsible for checking updating database with new problems as well as adding these events to calendar.
 * @todo account for if the drawn problems are premium only
 * @todo take more problem data, including difficulty, like dislike ratio and maybe even problem description
 * @todo if i have a solution to this problem, i should add it to the database (could do an automatic integration as a firebase function)
 * so that it can be added to the bio potentially
 */
const Job = async () => {
  try {
    // Contacts LeetCodes API to update database. Makes external API call, should be used once a day
    await populateDatabase();
    // Queries events and adds to calendar. This should be separated.
    // TODO: Separate this out more. Separate the conversion from problem to event
    const events = await query.queryFreshProblems(3);
    await addEventsToCalendar(events);
  } catch (err) {
    console.log(err);
  } finally {
    console.log('JOB COMPLETE');
  }
}

// Run Job at 00:00 everyday.
const LAUNCH_AT = {
  hour: 15,
  minute: 39,
}
schedule.scheduleJob(LAUNCH_AT, Job);
