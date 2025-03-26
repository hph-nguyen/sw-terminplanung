import { RRule } from "rrule";

const Benutzerverwaltung = () => {
  const rule = new RRule({
    freq: RRule.WEEKLY,
    dtstart: new Date(Date.UTC(2025, 2, 12, 12, 3, 0)),
    until: new Date(Date.UTC(2025, 4, 21, 12, 3, 0)),
    byweekday: RRule.WE,
  });

  // Generate recurring dates
  const dates = rule.all();

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-2">Test RRULE Recurring Events</h2>
      <ul className="list-disc pl-5">
        {dates.map((date, index) => (
          <li key={index}>{date.toISOString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default Benutzerverwaltung;
