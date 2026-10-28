"use client";

import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import type { EventWithType } from "@/app/events/page";
import EventDrawerContent from "./event-drawer-content";

interface EventDetailsDrawerProps {
  selectedEventData: EventWithType | null;
  selectedDayEvents: EventWithType[];
  onClose: () => void;
}

const EventDetailsDrawer = ({
  selectedEventData,
  selectedDayEvents,
  onClose,
}: EventDetailsDrawerProps) => {
  const open = Boolean(selectedEventData) || selectedDayEvents.length > 0;
  const isList = !selectedEventData && selectedDayEvents.length > 1;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          height: "auto",
          maxHeight: "90vh",
          backgroundColor: selectedDayEvents.length === 1 ? "white" : "#f8fafc",
        },
      }}
      className="dark:[&_.MuiDrawer-paper]:!bg-zinc-950"
    >
      {open && (
        <button
          type="button"
          aria-label="Close"
          className="absolute top-4 right-2 z-50 text-zinc-600 dark:text-zinc-300"
          onClick={onClose}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </button>
      )}

      {/* Scroll below the X so it stays put */}
      <div
        className={`w-full flex flex-col overflow-y-auto ${isList ? "mt-12" : ""}`}
      >
        {selectedEventData ? (
          <EventDrawerContent {...selectedEventData} />
        ) : selectedDayEvents.length === 1 ? (
          <EventDrawerContent {...selectedDayEvents[0]} />
        ) : (
          <div className="flex flex-col gap-4 px-4 pb-10">
            {selectedDayEvents.map((event, idx) => (
              <div
                key={`event-drawer-${event.title}-${idx}`}
                className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-800"
              >
                <EventDrawerContent {...event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default EventDetailsDrawer;
