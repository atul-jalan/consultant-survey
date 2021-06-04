const model = ({ answers }) => {
    let counter = 0;

  // one
  if (answers[0][0] == 1) {
    counter += 0.125;
  } else if (answers[0][1] == 1) {
    counter += 0.375;
  } else if (answers[0][2] == 1) {
    counter += 0.375;
  } else if (answers[0][3] == 1) {
    counter += 0.125;
  }

  // two
  if (answers[1][0] == 1) {
    counter += 0.25;
  } else if (answers[1][1] == 1) {
    counter += 0.25;
  } else if (answers[1][2] == 1) {
    counter += 0.125;
  } else if (answers[1][3] == 1) {
    counter += 0.375;
  }

  // three
  if (answers[2][0] == 1) {
    counter += 0.75 * 3;
  } else if (answers[2][1] == 1) {
    counter += 0.25 * 3;
  }

  // four
  if (answers[3][0] == 1) {
    counter += 0.625 * 3;
  } else if (answers[3][1] == 1) {
    counter += 0.375 * 3;
  }

  // five
  if (answers[4][0] == 1) {
    counter += 0.875 * 3;
  } else if (answers[4][1] == 1) {
    counter += 0.125 * 3;
  }

  // six
  if (answers[5][0] == 1) {
    counter += 0.125;
  } else if (answers[5][1] == 1) {
    counter += 0.25;
  } else if (answers[5][2] == 1) {
    counter += 0.25;
  } else if (answers[5][3] == 1) {
    counter += 0.375;
  }

  // seven
  if (answers[6][0] == 1) {
    counter += 0.125 * 2;
  } else if (answers[6][1] == 1) {
    counter += 0.25 * 2;
  } else if (answers[6][2] == 1) {
    counter += 0.625 * 2;
  }

  // eight
  if (answers[7][0] == 1) {
    counter += 0.375;
  } else if (answers[7][1] == 1) {
    counter += 0.35;
  } else if (answers[7][2] == 1) {
    counter += 0.35;
  } else if (answers[7][3] == 1) {
    counter += 0.125;
  }

  counter = counter / 15;

  // being a northwestern student automatically adds a 15% chance of you being a consultant
  counter += 0.15;

  return counter * 100;
}

export default model;