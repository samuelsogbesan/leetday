const { database } = require("./firebase-auth");

/**
 * Fetches a designated number of unseen problems from the database.
 * A problem is "unseen" if it has not been used in the calendar already.
 * @param quantity the number of problems to return.
 * @return At most "quantity" number of unseen problems. May return some seen problems if there are less than "quantity" unseen problems left.
 */
const queryFreshProblems = (quantity) =>
  database.ref("/problems").orderByValue().limitToFirst(quantity).get()
  .then(res => res.toJSON())
  .catch(err => console.log(err));

/**
 * Marks the input problem as seen in the database.
 * @param {*} problemStub the stub of the seen problem.
 */
const markSeen = (problemStub) =>
  database.ref(`/problems/${problemStub}`).set(true);

/**
 * Returns the number of problems in the database.
 * @return the number of problems in the database.
 */
const count = () => database.ref("/problems").once("value", data => console.log(Object.keys(data.val()).length));

module.exports = {
  queryFreshProblems,
  markSeen,
};
