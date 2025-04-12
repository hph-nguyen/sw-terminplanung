import { Calendar as BigCalendar, dayjsLocalizer } from "react-big-calendar";
// import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/de";

dayjs.locale("de");

const localizer = dayjsLocalizer(dayjs);

export default function Calendar(props) {
  return <BigCalendar {...props} localizer={localizer} culture="de" />;
}
