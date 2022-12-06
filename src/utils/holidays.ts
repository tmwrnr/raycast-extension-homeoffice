import { Cache } from "@raycast/api";
import fetch from "node-fetch";

import { sortBy } from "../utils/array";

const cache = new Cache();

type HolidayName =
  | "Neujahrstag"
  | "Karfreitag"
  | "Ostermontag"
  | "Tag der Arbeit"
  | "Christi Himmelfahrt"
  | "Pfingstmontag"
  | "Fronleichnam"
  | "Tag der Deutschen Einheit"
  | "Weihnachten"
  | "1. Weihnachtstag"
  | "2. Weihnachtstag"
  | "Silvester";
type HolidayDto = {
  datum: string;
  hinweis: string;
};

export type Holiday = {
  name: HolidayName;
  date: string;
};

export async function getHolidaysForYear(year: number): Promise<Holiday[]> {
  if (cache.has(year.toString())) {
    return JSON.parse(cache.get(year.toString()) as string);
  }

  const response = await fetch(`https://feiertage-api.de/api/?jahr=${year}&nur_land=HE`, {
    method: "GET",
  });
  if (!response.ok) return [];
  const data = (await response.json()) as Record<HolidayName, HolidayDto>;

  const holidays: Holiday[] = [
    ...Object.entries(data).map(([name, value]) => ({
      name: name as HolidayName,
      date: value.datum,
    })),
    { name: "Weihnachten", date: `${year}-12-24` },
    { name: "Silvester", date: `${year}-12-31` },
  ];

  sortBy(holidays, "date", "asc");
  cache.set(year.toString(), JSON.stringify(holidays));
  return holidays;
}

export async function getHolidaysForYears(years: number[]): Promise<Holiday[]> {
  return (await Promise.all(years.sort().map(getHolidaysForYear))).flat();
}
