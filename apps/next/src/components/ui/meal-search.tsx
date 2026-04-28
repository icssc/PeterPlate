"use client";

import { Add, Close, Search } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  Fab,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import SearchMealCard from "@/components/ui/card/search-meal-card";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// had to add tailwind colors in here to refernece for mui sx props
const colors = {
  sky100: "#e0f2fe", // sky-100
  sky200: "#bae6fd", // sky-200
  sky500: "#0ea5e9", // sky-500
  sky600: "#0284c7", // sky-600
  sky700: "#0369a1", // sky-700
  sky800: "#075985", // sky-800
  slate500: "#64748b", // slate-500
} as const;

export interface AvailableDish {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string | null;
}

export interface SuggestedMeal {
  id: string;
  dishId: string;
  dishName: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  userId: string;
  eatenAt: Date;
}

interface MealSearchDialogProps {
  availableDishes: AvailableDish[];
  suggestedMeals: SuggestedMeal[];
  onAdd: (dishId: string, dishName: string, servings: number) => void;
}

//card list, searches through availableDishes (only dishes today at anteatery/brandwine)

function MealList({
  query,
  availableDishes,
  suggestedMeals,
  onAdd,
}: {
  query: string;
  availableDishes: AvailableDish[];
  suggestedMeals: SuggestedMeal[];
  onAdd: (dishId: string, dishName: string, servings: number) => void;
}) {
  const showSearch = query.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!showSearch) return [];
    const lower = query.toLowerCase();
    return availableDishes.filter((d) => d.name.toLowerCase().includes(lower));
  }, [query, availableDishes, showSearch]);

  if (showSearch) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">
            Search Results...
          </span>
          <div className="flex-1 h-px bg-sky-100" />
        </div>

        {searchResults.length === 0 ? (
          <p className="text-zinc-400 text-sm py-6 text-center">
            No dishes found matching &quot;{query}&quot;.
          </p>
        ) : (
          searchResults.map((dish) => (
            <div key={dish.id} className="!w-full">
              <SearchMealCard
                meal={{
                  id: dish.id,
                  dishId: dish.id,
                  dishName: dish.name,
                  servings: 1,
                  calories: dish.calories,
                  protein: dish.protein,
                  carbs: dish.carbs,
                  fat: dish.fat,
                  userId: "",
                  eatenAt: new Date(),
                }}
                dish={{
                  id: dish.id,
                  name: dish.name,
                  imageUrl: dish.imageUrl,
                }}
                onAdd={(meal, servings) =>
                  onAdd(meal.dishId ?? "", meal.dishName ?? "", servings)
                }
              />
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-sky-100" />
      </div>

      {suggestedMeals.length === 0 ? (
        <p className="text-zinc-400 text-sm py-6 text-center">
          Log a dish for it to appear here!
        </p>
      ) : (
        suggestedMeals.map((meal) => (
          <div key={meal.dishId} className="!w-full">
            <SearchMealCard
              meal={meal}
              onAdd={(meal, servings) =>
                onAdd(meal.dishId ?? "", meal.dishName ?? "", servings)
              }
            />
          </div>
        ))
      )}
    </div>
  );
}

function SearchBar({
  query,
  onChange,
}: {
  query: string;
  onChange: (v: string) => void;
}) {
  return (
    <TextField
      autoFocus
      fullWidth
      variant="outlined"
      placeholder="Search meals..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: colors.slate500 }} />
          </InputAdornment>
        ),
        sx: {
          backgroundColor: "white",
          borderRadius: "12px",
          "& fieldset": { borderColor: colors.sky200 },
          "&:hover fieldset": { borderColor: colors.sky500 },
          "&.Mui-focused fieldset": { borderColor: colors.sky600 },
        },
      }}
    />
  );
}

// desktop dialog:
// TODO: for some reason, there is a lot of white space on the desktop component despite trying to alter the padding and sx width props
function DesktopMealSearchDialog({
  availableDishes,
  suggestedMeals,
  onAdd,
  open,
  onClose,
}: MealSearchDialogProps & { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      sx={{
        "& .MuiDialog-container": {
          alignItems: "center",
          justifyContent: "center",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          width: "420px",
          maxWidth: "420px",
          margin: "auto",
        },
      }}
    >
      {/* sky-100 header — X inline with search bar, no extra top space */}
      <DialogTitle
        sx={{
          backgroundColor: colors.sky100,
          padding: "12px",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar query={query} onChange={setQuery} />
          </div>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close search"
            sx={{ color: colors.sky700, flexShrink: 0 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>

      {/* Scrollable list — no bottom close button on desktop */}
      <DialogContent
        sx={{ padding: "8 !important", overflowY: "auto", flexGrow: 1 }}
      >
        <MealList
          query={query}
          availableDishes={availableDishes}
          suggestedMeals={suggestedMeals}
          onAdd={onAdd}
        />
      </DialogContent>
    </Dialog>
  );
}

// mobile drawer

function MobileMealSearchDrawer({
  availableDishes,
  suggestedMeals,
  onAdd,
  open,
  onClose,
}: MealSearchDialogProps & { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <div className="bg-sky-100 px-4 pt-3 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar query={query} onChange={setQuery} />
          </div>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close search"
            sx={{ color: colors.sky700, flexShrink: 0 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <MealList
          query={query}
          availableDishes={availableDishes}
          suggestedMeals={suggestedMeals}
          onAdd={onAdd}
        />
      </div>

      <div className="flex justify-end px-4 py-3 border-t border-zinc-100 flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="bg-sky-700 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-sky-800 transition-colors"
        >
          Close
        </button>
      </div>
    </Drawer>
  );
}

// plus button that renders dialog/drawer

export default function MealSearchDialog(props: MealSearchDialogProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <Fab
        size="large"
        aria-label="Search meals"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 80,
          right: 32,
          backgroundColor: colors.sky700,
          "&:hover": { backgroundColor: colors.sky800 },
          color: "white",
          zIndex: 50,
        }}
      >
        <Add fontSize="large" />
      </Fab>

      {isDesktop ? (
        <DesktopMealSearchDialog
          {...props}
          open={open}
          onClose={() => setOpen(false)}
        />
      ) : (
        <MobileMealSearchDrawer
          {...props}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
