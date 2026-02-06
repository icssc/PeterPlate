import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./shadcn/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./shadcn/hover-card";

/**
 * Props for the {@link Contributor} component.
 */
interface ContributorProps {
  /**
   * The full name of the contributor.
   */
  name: string;
  /**
   * The GitHub username of the contributor.
   */
  username: string;
  /**
   * The URL to the contributor's profile picture.
   */
  profileSrc: string;
  /**
   * A short biography or description of the contributor.
   */
  bio: string;
  contributions: number;
}

/**
 * Renders a contributor's avatar that, on hover, displays a card with more details
 * including their name, GitHub username (linked), profile picture, and bio.
 * @param {ContributorProps} props - The properties for the contributor display.
 * @returns {JSX.Element} The rendered contributor component with hover card functionality.
 */
export default function Contributor({
  name,
  username,
  profileSrc,
  bio,
  contributions,
}: ContributorProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <HoverCard>
        <HoverCardTrigger>
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={profileSrc} className="rounded-full" />
            <AvatarFallback>
              {username.slice(0, 2).toWellFormed()}
            </AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent>
          <a
            href={`https://github.com/${username}`}
            className="flex flex-col gap-2"
          >
            <div className="flex gap-2 items-start">
              <Avatar className="h-12 w-12 rounded-full">
                <AvatarImage src={profileSrc} className="rounded-full" />
                <AvatarFallback>
                  {username.slice(0, 2).toWellFormed()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2">
                  <p className="font-bold hover:underline">{name}</p>
                  <p className="text-sm text-green-500">+{contributions}</p>
                </div>
                <p className="flex gap-1 text-sm items-center text-zinc-500">
                  <AccountCircleOutlinedIcon fontSize="small" />
                  {username}
                </p>
              </div>
            </div>
            <p className="text-sm">{bio}</p>
          </a>
        </HoverCardContent>
      </HoverCard>
    );
  else
    return (
      <Dialog>
        <DialogTrigger>
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={profileSrc} className="rounded-full" />
            <AvatarFallback>
              {username.slice(0, 2).toWellFormed()}
            </AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent className="p-5 w-72 rounded-md">
          <DialogTitle hidden>{username}</DialogTitle>
          <a
            href={`https://github.com/${username}`}
            className="flex flex-col gap-2"
          >
            <div className="flex gap-2 items-start">
              <Avatar className="h-12 w-12 rounded-full">
                <AvatarImage src={profileSrc} className="rounded-full" />
                <AvatarFallback>
                  {username.slice(0, 2).toWellFormed()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2">
                  <p className="font-bold hover:underline">{name}</p>
                  <p className="text-sm text-green-500">+{contributions}</p>
                </div>
                <p className="flex gap-1 text-sm items-center text-zinc-500">
                  <AccountCircleOutlinedIcon fontSize="small" />
                  {username}
                </p>
              </div>
            </div>
          </a>
          <p className="text-sm">{bio}</p>
        </DialogContent>
      </Dialog>
    );
}
