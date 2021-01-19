const between = require("../util/randInt");
const { database } = require("./firebase-auth");

/**
 * Fetches a designated number of unseen problems from the database.
 * A problem is "unseen" if it has not been used in the calendar already.
 * @param quantity the number of problems to return.
 * @return At most "quantity" number of unseen problems. May return some seen problems if there are less than "quantity" unseen problems left.
 * @todo update query to grab random questions between quantity and length of database.
 */
const queryFreshProblems = async (quantity) => {
  const allFreshProblems = await database.ref('/problems')
    .orderByValue()
    .startAt(1)
    .endAt(3)
    .get()
    .then(res => res.toJSON());

  const problemStubs = Object.keys(allFreshProblems);
  const numberOfFreshProblems = problemStubs.length;

  if (numberOfFreshProblems < quantity) return allFreshProblems;

  const problems = {};
  const seen = new Set();

  for (var i = 0; i < quantity; i++) {
    var randomIndex = between(0, numberOfFreshProblems);
    while (seen.has(randomIndex)) randomIndex = between(0, numberOfFreshProblems);

    problems[problemStubs[randomIndex]] = allFreshProblems[problemStubs[randomIndex]];
    seen.add(randomIndex);
  }

  return problems;
}

/**
 * Marks the input problem as seen in the database.
 * @param {*} problemStub the stub of the seen problem.
 */
const markSeen = (problemStub) =>
  database.ref(`/problems/${problemStub}`).set(0);

/**
 * Returns the number of problems in the database.
 * @return the number of problems in the database.
 */
const count = () => database.ref("/problems").once("value", data => console.log(Object.keys(data.val()).length));

module.exports = {
  queryFreshProblems,
  markSeen,
};
