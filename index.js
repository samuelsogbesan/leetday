const Event = require('./Event');
const calendar = require('./calendar-auth');
const populateDatabase = require('./populateDatabase');
const schedule = require('node-schedule');
const query = require('./queryDatabase');

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
      const event = Event({stub: problem, eventDifficulty: 'EASY'});
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
  hour: 0,
  minute: 0,
}

schedule.scheduleJob(LAUNCH_AT, Job);
