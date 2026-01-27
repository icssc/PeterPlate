import { Dialog, Button } from "@mui/material";
import { useState } from "react";

interface IngredientsDialogProps {
  name: string;
  ingredients: string;
}

export default function IngredientsDialog({
  name,
  ingredients,
}: IngredientsDialogProps): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        className="w-full whitespace-nowrap border-input hover:bg-accent hover:text-accent-foreground text-sm font-medium h-8 rounded-md normal-case"
        sx={{
          borderColor: "hsl(var(--input))",
          color: "inherit",
          "&:hover": {
            borderColor: "hsl(var(--input))",
            backgroundColor: "hsl(var(--accent))",
          },
        }}
        onClick={handleOpen}
      >
        Show All Ingredients
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <div className="grid gap-2 pb-6">
          <h2 className="text-lg font-semibold leading-none tracking-tight px-5 pt-6">
            {name} Ingredients
          </h2>
          <p className="px-5 text-sm max-h-48 overflow-y-scroll">
            {ingredients}
          </p>
        </div>
      </Dialog>
    </>
  );
}
