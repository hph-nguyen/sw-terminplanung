import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { RRule } from "rrule";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const numberToWeekday = (num) => {
  const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  return weekdays[num] || null;
};

export const formatTimeRange = (anfangszeit, dauer) => {
  const startTime = dayjs().hour(anfangszeit.split(":")[0]).minute(anfangszeit.split(":")[1]);
  const endTime = startTime.add(dauer, "minute").format("HH:mm");
  return `${startTime.format("HH:mm")} - ${endTime}`;
};

export const dauerBerechnung = (von, bis) => {
  const startTime = dayjs(von, "HH:mm");
  const endTime = dayjs(bis, "HH:mm");
  return endTime.diff(startTime, "minute");
};

export const formatDauerZuEndzeit = (anfangszeit, dauer) => {
  const startTime = dayjs().hour(anfangszeit.split(":")[0]).minute(anfangszeit.split(":")[1]);
  return startTime.add(dauer, "minute").format("HH:mm");
};

export const generateRecurringEvents = (event, exdates = []) => {
  const { id, start, end, resourceId, weekday, rhythmus, dauer, originalEvent } = event;

  let interval = rhythmus === "VZ" || rhythmus === "VZ2" ? 2 : 1;

  const weekdayMap = {
    0: RRule.MO,
    1: RRule.TU,
    2: RRule.WE,
    3: RRule.TH,
    4: RRule.FR,
    5: RRule.SA,
    6: RRule.SU,
  };

  const exdateStrings = new Set(exdates.map((d) => dayjs(d).format("YYYY-MM-DD")));

  const parsedWeekday = parseInt(weekday, 10);
  if (!Object.prototype.hasOwnProperty.call(weekdayMap, parsedWeekday)) {
    console.error("Invalid weekday:", weekday);
    return [];
  }

  if (end <= start) {
    console.error("End date must be after start date");
    return [];
  }

  const tz = "Europe/Berlin";

  const startDate = dayjs(start).tz(tz, true);
  const endDate = dayjs(end).tz(tz, true);

  const findDSTTransitions = (start, end) => {
    let transitions = [];
    let current = start;

    while (current.isBefore(end)) {
      const offset1 = current.utcOffset();
      const offset2 = current.add(1, "day").utcOffset();

      if (offset1 !== offset2) {
        transitions.push(current.add(1, "day").startOf("day"));
      }
      current = current.add(1, "day");
    }

    return transitions;
  };

  const transitionDates = findDSTTransitions(startDate, endDate);

  let periods = [];
  let lastStart = startDate;

  transitionDates.forEach((transition) => {
    if (lastStart.isBefore(transition)) {
      periods.push({ from: lastStart, to: transition.subtract(1, "day").endOf("day") });
    }
    lastStart = transition;
  });

  if (lastStart.isBefore(endDate)) {
    periods.push({ from: lastStart, to: endDate });
  }

  let allEvents = [];

  periods.forEach(({ from, to }) => {
    const rule = new RRule({
      freq: RRule.WEEKLY,
      dtstart: from.toDate(),
      until: to.toDate(),
      byweekday: weekdayMap[parsedWeekday],
      interval: interval,
    });

    const dates = rule.all();

    allEvents = allEvents.concat(
      dates
        .filter((date) => !exdateStrings.has(dayjs(date).format("YYYY-MM-DD")))
        .map((date) => {
          const eventStart = dayjs.tz(date, tz).hour(startDate.hour()).minute(startDate.minute());
          const eventEnd = eventStart.add(dauer, "minute");

          return {
            start: eventStart.toDate(),
            end: eventEnd.toDate(),
            data: {
              appointment: {
                id,
                color: originalEvent.color,
                time: `${eventStart.format("HH:mm")} - ${eventEnd.format("HH:mm")}`,
                details: originalEvent.details,
                rhythmus: rhythmus,
              },
            },
            isDraggable: true,
            resourceId,
          };
        })
    );
  });

  return allEvents;
};
