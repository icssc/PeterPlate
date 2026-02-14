"use client";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface CalendarViewProps {
  currentDate: Date;
  calendarEvents: any[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectEvent: (event: any) => void;
}

const CalendarView = ({
  currentDate,
  calendarEvents,
  onPreviousMonth,
  onNextMonth,
  onSelectEvent,
}: CalendarViewProps) => {
  return (
    <div className="border-2 border-sky-700 p-4 rounded-lg">
      <div className="flex items-center justify-center">
        <div className="text-center flex items-center justify-center text-sky-700 font-medium">
          <ArrowBackIosIcon
            className="mb-6 mr-4 cursor-pointer"
            onClick={onPreviousMonth}
          />
          <span className="inline-block mb-6 text-3xl">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <ArrowForwardIosIcon
            className={`mb-6 ml-4 ${
              moment(currentDate).isSameOrAfter(moment(), "month")
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={onNextMonth}
          />
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        date={currentDate}
        onNavigate={() => {}}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        defaultView="month"
        views={["month"]}
        toolbar={false}
        selectable
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
};

export default CalendarView;
