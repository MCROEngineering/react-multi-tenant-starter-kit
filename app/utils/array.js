/* eslint-disable import/prefer-default-export, no-param-reassign */

export function shuffle(array) {
  const len = array.length;

  for (let i = len - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
