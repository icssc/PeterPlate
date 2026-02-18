"use client";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import EventDialogContent from "./event-dialog-content";
import EventDrawerContent from "./event-drawer-content";
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
  // Logic props
  isDesktop: boolean;
  viewMode: string;
  isLoading?: boolean;
  error?: any;

  // Data props
  currentDate: Date;
  calendarEvents: any[];
  selectedEventData: any | null;

  // Handlers
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectEvent: (event: any) => void;
  onCloseDetails: () => void;
}

const CalendarView = ({
  isDesktop,
  viewMode,
  isLoading,
  error,
  currentDate,
  calendarEvents,
  selectedEventData,
  onPreviousMonth,
  onNextMonth,
  onSelectEvent,
  onCloseDetails,
}: CalendarViewProps) => {
  if (isLoading || error || viewMode !== "calendar") return null;

  return (
    <div className="border-2 border-sky-700 p-4 rounded-lg">
      {/* CUSTOM TOOLBAR */}
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

      {/* MAIN CALENDAR */}
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

      {/* DESKTOP MODAL */}
      {isDesktop && (
        <Dialog
          open={Boolean(selectedEventData)}
          onClose={onCloseDetails}
          maxWidth={false}
          slotProps={{
            paper: {
              sx: {
                width: "570px",
                maxWidth: "90vw",
                borderRadius: "6px",
                overflow: "hidden",
              },
            },
          }}
        >
          {selectedEventData && (
            <EventDialogContent
              {...selectedEventData}
              key={`${selectedEventData.startTime}|${selectedEventData.endTime}`}
            />
          )}
        </Dialog>
      )}

      {/* MOBILE DRAWER */}
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={Boolean(selectedEventData)}
          onClose={onCloseDetails}
          sx={{
            "& .MuiDrawer-paper": {
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              height: "auto",
            },
          }}
        >
          {selectedEventData && <EventDrawerContent {...selectedEventData} />}
        </Drawer>
      )}
    </div>
  );
};

export default CalendarView;
