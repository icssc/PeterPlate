"use client";

import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import type { EventInfo } from "./card/event-card";
import EventDrawerContent from "./event-drawer-content";

interface EventDetailsDrawerProps {
  selectedEventData: EventInfo | null;
  selectedDayEvents: EventInfo[];
  onClose: () => void;
}

const EventDetailsDrawer = ({
  selectedEventData,
  selectedDayEvents,
  onClose,
}: EventDetailsDrawerProps) => {
  const open = Boolean(selectedEventData) || selectedDayEvents.length > 0;

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
      <div className="relative w-full h-full flex flex-col overflow-y-auto">
        {open && (
          <button
            type="button"
            className="absolute top-3 right-4 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur rounded-full p-1 shadow hover:bg-white dark:hover:bg-zinc-800 transition-colors"
            onClick={onClose}
          >
            <CloseIcon
              className="text-zinc-600 dark:text-zinc-300"
              fontSize="small"
            />
          </button>
        )}

        {selectedEventData ? (
          <EventDrawerContent {...selectedEventData} />
        ) : selectedDayEvents.length === 1 ? (
          <EventDrawerContent {...selectedDayEvents[0]} />
        ) : (
          <div className="flex flex-col gap-4 p-4 pt-12 pb-10">
            {selectedDayEvents.map((event, idx) => (
              <div
                key={`event-drawer-${event.name}-${idx}`}
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
