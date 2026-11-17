"use client";

import { Button, DialogContent } from "@mui/material";

export default function DeleteRatingDialogContent({
  cancel,
  handleDelete,
}: {
  cancel: () => void;
  handleDelete: (e: React.MouseEvent) => Promise<void>;
}) {
  return (
    <DialogContent
      sx={{
        padding: "30px 20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      <p className="text-center">Delete this rating?</p>
      <div className="flex flex-row justify-center gap-5">
        <Button
          variant={"contained"}
          className="whitespace-nowrap"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          variant={"outlined"}
          className="whitespace-nowrap"
          onClick={cancel}
        >
          Cancel
        </Button>
      </div>
    </DialogContent>
  );
}
