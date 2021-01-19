/**
 * Converts the problem difficulty to a string. Useful for displaying difficulty in a user-friendly way.
 * @param {*} level a value between 1 ('EASY') and 3 ('HARD') that represents the problem difficulty.
 */
const difficultyFromLevel = (level) => {
  const output = '';
  switch (level) {
    case 1:
      output = 'EASY';
      break;
    case 2:
      output = 'MEDIUM';
      break;
    case 3:
      output = 'HARD';
      break;
    default:
      return new Error('Paramater "level" out of range (1-3)');
  }

  return output;
}

module.exports = difficultyFromLevel;
