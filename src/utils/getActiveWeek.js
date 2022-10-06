import { add, isAfter, isBefore } from 'date-fns';

const daysToAddForNextMonday = (day) => (day === 0 ? 1 : 8 - day);

export function getActiveWeek(weekData) {
  const weeks = Number(weekData.amountOfWeeks);
  const dateWorkout = weekData?.newWorkoutDate?.toDate();
  const day = dateWorkout?.getDay();
  const daysToAdd = daysToAddForNextMonday(day);

  let activeWeekFound = 1;

  let currentWeek = add(dateWorkout || new Date(), { days: daysToAdd });
  while (activeWeekFound <= weeks) {
    const startDate = new Date(currentWeek);
    const endDate = add(startDate, { days: 6 });

    const currentDate = new Date();
    if (isAfter(currentDate, startDate) && isBefore(currentDate, endDate)) {
      return activeWeekFound;
    }

    currentWeek = add(currentWeek, { days: 7 * activeWeekFound });
    activeWeekFound += 1;
  }
  return activeWeekFound;
}
