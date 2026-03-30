import { Button, Dialog, Typography } from "@mui/material";
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
        <div className="grid gap-2 pb-6 dark:bg-[#303035]">
          <Typography
            variant="h6"
            fontWeight={600}
            color="primary"
            className="px-5 pt-6"
          >
            {name} Ingredients
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            className="px-5 max-h-48 overflow-y-scroll"
          >
            {ingredients}
          </Typography>
        </div>
      </Dialog>
    </>
  );
}
