import { Action, ActionPanel, Icon, List, openExtensionPreferences } from "@raycast/api";
import { useEffect, useState } from "react";

import "./lib/dayjs";
import { Day, SelectedDaysPerWeek, Week } from "./types";
import { getMailBody, openMail } from "./utils/mail";
import { getWeeks } from "./utils/weeks";

export default function Command() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selected, setSelected] = useState<SelectedDaysPerWeek>({});

  useEffect(() => {
    getWeeks().then((data) => {
      setSelected(data.reduce((obj, week) => ({ ...obj, [week.calendarWeek]: new Set() }), {}));
      setWeeks(data);
    });
  }, []);

  const handleToggle = (day: Day) =>
    setSelected((prev) => {
      const week = selected[day.calendarWeek] ?? new Set();
      if (week.has(day.dateString)) {
        week.delete(day.dateString);
      } else if (week.size < 2) {
        week.add(day.dateString);
      }
      return {
        ...prev,
        [day.calendarWeek]: week,
      };
    });

  const handleOpenMail = () => openMail(getMailBody(selected));

  return (
    <List isLoading={weeks.length === 0}>
      {weeks.map((week) => (
        <List.Section key={week.calendarWeek} title={week.label}>
          {week.days.map((day) => (
            <DayItem
              key={day.dateString}
              day={day}
              isSelected={selected[day.calendarWeek].has(day.dateString)}
              isWeekFull={selected[day.calendarWeek].size === 2}
              onToggle={handleToggle}
              onOpenMail={handleOpenMail}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

type Props = {
  day: Day;
  isSelected: boolean;
  isWeekFull: boolean;
  onToggle: (day: Day) => void;
  onOpenMail: () => void;
};

const DayItem: React.FC<Props> = ({ day, isSelected, isWeekFull, onToggle, onOpenMail }) => {
  return (
    <List.Item
      title={day.label}
      subtitle={day.dateLabel}
      key={day.dateString}
      icon={isSelected ? Icon.CheckCircle : isWeekFull ? Icon.XMarkCircleFilled : Icon.Circle}
      actions={
        <ActionPanel>
          <Action
            icon={Icon.Checkmark}
            title={isSelected ? "Tag entfernen" : "Tag auswählen"}
            onAction={() => onToggle(day)}
          />
          <Action title="Öffne E-Mail" onAction={onOpenMail} />
          <Action title="Öffne Extension Einstellungen" onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
};
