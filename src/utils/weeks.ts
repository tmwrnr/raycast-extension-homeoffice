import dayjs, { Dayjs } from "dayjs";
import { Day, Week } from "../types";
import { compare, groupBy } from "./array";
import { getHolidaysForYear, getHolidaysForYears, Holiday } from "./holidays";

export async function getWeeks(): Promise<Week[]> {
  const start = dayjs();
  const end = start.add(2, "w").day(5).hour(23).minute(59);

  const publicHolidays =
    start.year() === end.year()
      ? await getHolidaysForYear(start.year())
      : await getHolidaysForYears([start.year(), end.year()]);

  const days: Day[] = [];
  let currentDay = start.clone();
  while (currentDay.isBefore(end)) {
    if (!isWeekend(currentDay) && !isHoliday(currentDay, publicHolidays)) {
      days.push({
        date: currentDay.toDate(),
        dateString: currentDay.format("YYYY-MM-DD"),
        dateLabel: currentDay.format("DD.MM.YY"),
        label: currentDay.format("dddd"),
        calendarWeek: currentDay.week(),
      });
    }
    currentDay = currentDay.add(1, "day");
  }

  return Object.entries(groupBy(days, "calendarWeek"))
    .sort((a, b) => compare(a[1][0], b[1][0], "date"))
    .map(([calendarWeek, days]) => {
      const week = parseInt(calendarWeek);
      const label = dayjs().week() === week ? "Diese Woche" : `KW ${calendarWeek}`;
      return {
        calendarWeek: week,
        label,
        days,
      };
    });
}

function isHoliday(date: Dayjs, holidays: Holiday[]): boolean {
  return holidays.find((holiday) => dayjs(holiday.date).isSame(date, "day")) !== undefined;
}

function isWeekend(date: Dayjs): boolean {
  return date.day() === 0 || date.day() === 6;
}
