function isValidDate(year, month, day) {
  // Define the number of days per month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    daysInMonth[1] = 29;
  }
  // Check if the date is valid
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    return false;
  }
  return true;
}

module.exports = isValidDate;
