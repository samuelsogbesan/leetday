const functions = require("firebase-functions");
const populateDatabase = require("./firebase/populateDatabase");
const { addEventsToCalendar } = require('./calendar/calendar');
const query = require("./firebase/queryDatabase");

/**
 * Main Job Reponsible for checking updating database with new problems as well as adding these events to calendar.
 * @todo account for if the drawn problems are premium only
 * @todo take more problem data, including difficulty, like dislike ratio and maybe even problem description
 * @todo if i have a solution to this problem, i should add it to the database (could do an automatic integration as a firebase function)
 * so that it can be added to the bio potentially
 */

exports.Job = functions.pubsub.schedule('0 0 * * *').onRun(async () => {
  try {
    // Contacts LeetCodes API to update database. Makes external API call, should be used once a day
    await populateDatabase();
    // Queries events and adds to calendar. This should be separated.
    // TODO: Separate this out more. Separate the conversion from problem to event
    const events = await query.queryFreshProblems(3);
    await addEventsToCalendar(events);
  } catch (err) {
    console.log(err);
  }
});
