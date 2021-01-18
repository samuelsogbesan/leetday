const database = require('./firebase-auth').database;
const fetch = require('node-fetch');

/**
 * Queries LeetCode API for their problemset
 * @returns a Promise returning the set of all problems.
 */
const fetchProblems = async () => fetch('https://leetcode.com/api/problems/all/')
  .then(res => res.json())
  .then(json => json.stat_status_pairs)
  .catch(err => console.log(err))

/**
 * Adds all missing problems to the database.
 * @returns true iff the operation was successful.
 */
const populateDatabase = async () => {
  const ROOT = 'problems';
  const problems = await fetchProblems();

  problems.forEach(async (problem) => {
    const query = `${ROOT}/${problem.stat.question__title_slug}`;

    try {
      const recordExists = await database.ref(query)
        .get()
        .then(res => res.exists());

      if (!recordExists) await database.ref(query).set(false);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  });
}

module.exports = populateDatabase;
