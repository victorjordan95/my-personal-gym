import { add, isAfter, isBefore } from 'date-fns';

export function getActiveWeek(weekData) {
  const weeks = Number(weekData.amountOfWeeks);
  const dateWorkout = weekData?.newWorkoutDate?.toDate();
  let activeWeekFound = 1;

  let currentWeek = dateWorkout;
  while (activeWeekFound <= weeks) {
    const startDate = new Date(currentWeek);
    const endDate = add(startDate, { days: 6 });

    const currentDate = new Date();
    if (isAfter(currentDate, startDate) && isBefore(currentDate, endDate)) {
      // setActiveWeek(activeWeekFound);
      return activeWeekFound;
    }

    currentWeek = add(dateWorkout, {
      days: 7 * activeWeekFound,
    });
    activeWeekFound += 1;
  }
  return activeWeekFound;
}
