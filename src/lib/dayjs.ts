import dayjs from "dayjs";
import "dayjs/locale/de"; // import locale
import weekOfYear from "dayjs/plugin/weekOfYear"; // import plugin

dayjs.extend(weekOfYear); // use plugin
dayjs.locale("de");
