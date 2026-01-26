// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import {
//   Box,
//   Drawer,
//   Typography,
//   Avatar,
//   IconButton,
//   Divider,
//   Stack,
// } from "@mui/material";
// import SidebarButton from "./sidebar-button";
// import SidebarDivider from "./sidebar-divider";
// import { Settings2, CalendarFold, LogOut, House, Info, Pin, Trophy, StarIcon, Heart, Star, User, NotebookPen, Carrot } from "lucide-react";
// import { useSession, signOut } from "@/utils/auth-client"; // BetterAuth React hook
// import { GoogleSignInButton } from "@/components/auth/google-sign-in";
// import { ThemeToggle } from "./theme-toggle";

// interface SidebarContentProps {
//   open: boolean;
//   onClose: () => void;
// }

// /**
//  * `SidebarContent` is a presentational component that renders the main content
//  * displayed within the application's sidebar.
//  *
//  * It includes:
//  * - A header section with the application logo and title.
//  * - Navigation links using {@link SidebarButton} and section separators using {@link SidebarDivider}.
//  * - A user profile section at the bottom with an avatar, user details, and a logout button.
//  * @returns {JSX.Element} The rendered content for the sidebar.
//  */
// export default function SidebarContent({
//   open,
//   onClose,
// }: SidebarContentProps): JSX.Element {
//   // Get session data using BetterAuth's React hook
//   const { data: session, isPending } = useSession();
//   const user = session?.user;

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Sign out error:", error);
//     }
//   };

//   return (
//     <Drawer anchor="right" open={open} onClose={onClose}>
//       <Box className="flex h-full w-[280px] flex-col justify-between p-4">
//         {/* Top */}
//         <Stack className="space-y-2">
//           {/* Header */}
//           <Stack direction="row" className="items-center gap-3">
//             <Image
//               src="/ZotMeal-Logo.webp"
//               width={32}
//               height={32}
//               alt="ZotMeal Logo"
//             />

//             <Typography variant="h6" className="font-semibold">
//               ZotMeal{" "}
//               <Typography
//                 component="span"
//                 variant="body2"
//                 className="text-gray-500"
//               >
//                 v0.1 (preview)
//               </Typography>
//             </Typography>
//           </Stack>

//           <Divider className="my-2" />

//           <SidebarDivider title="Account" />

//           <SidebarButton
//             Icon={User}
//             title="My Account"
//             href="/account"
//             onClose={onClose}
//           />
//         </Stack>

//         {/* Bottom */}
//         <Stack className="space-y-2">
//           <ThemeToggle />
//           {!isPending && !user && <GoogleSignInButton />}

//           {!isPending && user && (
//             <Box className="flex items-center justify-between rounded-md p-2 hover:bg-gray-100">
//               <Stack direction="row" className="items-center gap-3">
//                 <Avatar
//                   src={user.image || "/peter.webp"}
//                   alt={user.name || "User"}
//                   variant="rounded"
//                   className="h-10 w-10"
//                 >
//                   {user.name?.[0]?.toUpperCase() ||
//                     user.email?.[0]?.toUpperCase() ||
//                     "U"}
//                 </Avatar>

//                 <Box>
//                   <Typography className="font-semibold leading-tight">
//                     {user.name || "User"}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     className="text-gray-500"
//                   >
//                     {user.email || ""}
//                   </Typography>
//                 </Box>
//               </Stack>

//               <IconButton
//                 onClick={handleSignOut}
//                 aria-label="Log out"
//                 size="small"
//                 className="hover:bg-gray-200"
//               >
//                 <LogOut size={18} />
//               </IconButton>
//             </Box>
//           )}
//         </Stack>
//       </Box>
//     </Drawer>
//   );
// }
"use client";

import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { LogOut, Info, Pencil } from "lucide-react";
import { useSession, signOut } from "@/utils/auth-client";
import { ThemeToggle } from "./theme-toggle";

interface ProfileMenuContentProps {
  onClose: () => void;
}

export default function ProfileMenuContent({
  onClose,
}: ProfileMenuContentProps): JSX.Element {
  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  // if (!user) return <Box p={2}>Not signed in</Box>;

  return (
    <Box p={1}>
      {/* User header */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={user?.image || "/peter.webp"}
          sx={{ width: 48, height: 48 }}
        />
        <Box>
          <Typography fontWeight={600}>{user?.name || "Test User"}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || "test_email@gmail.com"}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Dietary Preferences */}
      <Typography fontWeight={600} mb={1}>
        Dietary Preferences
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Restrictions:
      </Typography>
      <Stack direction="row" spacing={1} my={1}>
        <Chip label="Kosher" variant="outlined" />
      </Stack>

      <Typography variant="body2" color="text.secondary">
        Allergies:
      </Typography>
      <Stack direction="row" spacing={1} my={1}>
        <Chip label="Tree Nuts" variant="outlined" />
        <Chip label="Soy" variant="outlined" />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Appearance */}
      <Typography fontWeight={600} mb={1}>
        Appearance
      </Typography>
      <ThemeToggle />

      <Divider sx={{ my: 2 }} />

      {/* Actions */}
      <MenuItem component={Link} href="/account" onClick={onClose}>
        <Pencil size={18} style={{ marginRight: 12 }} />
        Edit Preferences
      </MenuItem>

      <MenuItem onClick={onClose}>
        <Info size={18} style={{ marginRight: 12 }} />
        About PeterPlate
      </MenuItem>

      <Divider sx={{ my: 2 }} />

      {/* Sign out */}
      <Button
        fullWidth
        variant="contained"
        startIcon={<LogOut size={18} />}
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </Box>
  );
}
