import { FavoriteBorder, Favorite as FavoriteIcon } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useUserStore } from "@/context/useUserStore";
import { cn } from "@/utils/tw";

interface FavoriteProps {
  dishId: string;
  isFavorited?: boolean;
  favoriteDisabled?: boolean;
  onToggleFavorite?: (dishId: string, currentlyFavorite: boolean) => void;
}

export default function Favorite({
  dishId,
  isFavorited,
  favoriteDisabled,
  onToggleFavorite,
}: FavoriteProps) {
  const userId = useUserStore((state) => state.userId);

  const handleFavoriteClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (favoriteDisabled || !onToggleFavorite) return;
    onToggleFavorite(dishId, Boolean(isFavorited));
  };

  return (
    <button
      type="button"
      aria-label={
        isFavorited ? "Remove meal from favorites" : "Add meal to favorites"
      }
      aria-pressed={isFavorited}
      disabled={favoriteDisabled}
      onClick={handleFavoriteClick}
      className={cn(
        "rounded-full p-1 transition group",
        favoriteDisabled && "opacity-60",
      )}
    >
      {!userId && (
        <Tooltip title="Login to favorite dishes!" placement="top">
          <FavoriteBorder className="w-6 h-6 fill-zinc-300 dark:fill-zinc-600" />
        </Tooltip>
      )}
      {userId && !isFavorited && (
        <FavoriteBorder
          className={cn(
            "w-6 h-6 fill-zinc-500",
            !favoriteDisabled &&
              "group-hover:fill-red-500 dark:group-hover:fill-red-700",
          )}
        />
      )}
      {userId && isFavorited && (
        <FavoriteIcon
          className="w-6 h-6 fill-red-500 group-hover:fill-red-400 
          dark:fill-red-700 dark:group-hover:fill-red-500"
        />
      )}
    </button>
  );
}
