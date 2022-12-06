import { Application } from "@raycast/api";

export type Day = {
  label: string;
  dateString: string;
  dateLabel: string;
  date: Date;
  calendarWeek: number;
};

export type Week = {
  label: string;
  calendarWeek: number;
  days: Day[];
};

export type SelectedDaysPerWeek = Record<string, Set<string>>;

export type Preferences = {
  app: Application;
  homeOfficeDays: string;
  subject: string;
  to: string;
  name: string;
};
