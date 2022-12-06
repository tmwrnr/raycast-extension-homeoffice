import { getPreferenceValues } from "@raycast/api";
import { exec } from "child_process";
import dayjs from "dayjs";
import { Preferences, SelectedDaysPerWeek } from "../types";

export const openMail = (body: string) => {
  const { app, subject, to } = getPreferenceValues<Preferences>();
  exec(`open -a "${app.name}.app"  "mailto:${to}?subject=${subject}&body=${encodeURIComponent(body)}"`);
};

export const getMailBody = (selected: SelectedDaysPerWeek): string => {
  const { name } = getPreferenceValues<Preferences>();

  const body = Object.entries(selected)
    .filter(([_, days]) => days.size > 0)
    .map(([calendarWeek, days]) =>
      [`KW ${calendarWeek}:`, ...Array.from(days).map((day) => `  - ${dayjs(day).format("dddd, DD.MM.YY")}`)].join("\n")
    )
    .join("\n\n");

  return `Hallo zusammen,

ich würde gerne an den folgenden Tagen Homeoffice machen:

${body}

Viele Grüße
${name}`;
};
