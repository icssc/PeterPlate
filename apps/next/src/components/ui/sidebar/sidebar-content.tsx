// "use client";

// import Link from "next/link";
// import {
//   Avatar,
//   Box,
//   Button,
//   Chip,
//   Divider,
//   MenuItem,
//   Stack,
//   Typography,
// } from "@mui/material";
// import { LogOut, Info, Pencil } from "lucide-react";
// import { useSession, signOut } from "@/utils/auth-client";
// import { ThemeToggle } from "./theme-toggle";

// interface ProfileMenuContentProps {
//   onClose: () => void;
// }

// export default function ProfileMenuContent({
//   onClose,
// }: ProfileMenuContentProps): JSX.Element {
//   const { data: session } = useSession();
//   const user = session?.user;

//   const handleSignOut = async () => {
//     await signOut();
//     window.location.href = "/";
//   };

//   // if (!user) return <Box p={2}>Not signed in</Box>;

//   return (
//     <Box p={1}>
//       {/* User header */}
//       <Stack direction="row" spacing={2} alignItems="center">
//         <Avatar
//           src={user?.image || "/peter.webp"}
//           sx={{ width: 48, height: 48 }}
//         />
//         <Box>
//           <Typography fontWeight={600}>{user?.name || "Test User"}</Typography>
//           <Typography variant="body2" color="text.secondary">
//             {user?.email || "test_email@gmail.com"}
//           </Typography>
//         </Box>
//       </Stack>

//       <Divider sx={{ my: 2 }} />

//       {/* Dietary Preferences */}
//       <Typography fontWeight={600} mb={1}>
//         Dietary Preferences
//       </Typography>

//       <Typography variant="body2" color="text.secondary">
//         Restrictions:
//       </Typography>
//       <Stack direction="row" spacing={1} my={1}>
//         <Chip label="Kosher" variant="outlined" />
//       </Stack>

//       <Typography variant="body2" color="text.secondary">
//         Allergies:
//       </Typography>
//       <Stack direction="row" spacing={1} my={1}>
//         <Chip label="Tree Nuts" variant="outlined" />
//         <Chip label="Soy" variant="outlined" />
//       </Stack>

//       <Divider sx={{ my: 2 }} />

//       {/* Appearance */}
//       <Typography fontWeight={600} mb={1}>
//         Appearance
//       </Typography>
//       <ThemeToggle />

//       <Divider sx={{ my: 2 }} />

//       {/* Actions */}
//       <MenuItem component={Link} href="/account" onClick={onClose}>
//         <Pencil size={18} style={{ marginRight: 12 }} />
//         Edit Preferences
//       </MenuItem>

//       <MenuItem component={Link} href="/about" onClick={onClose}>
//         <Info size={18} style={{ marginRight: 12 }} />
//         About PeterPlate
//       </MenuItem>

//       <Divider sx={{ my: 2 }} />

//       {/* Sign out */}
//       <Button
//         fullWidth
//         variant="contained"
//         startIcon={<LogOut size={18} />}
//         onClick={handleSignOut}
//       >
//         Sign Out
//       </Button>
//     </Box>
//   );
// }

// "use client";

// import Link from "next/link";
// import { LogOut, Info, Pencil, Sun, Monitor, Moon, MessageSquare } from "lucide-react";
// import { useSession, signOut } from "@/utils/auth-client";
// import { useState } from "react";

// interface ProfileMenuContentProps {
//   onClose: () => void;
// }

// export default function ProfileMenuContent({
//   onClose,
// }: ProfileMenuContentProps): JSX.Element {
//   const { data: session } = useSession();
//   const user = session?.user;
//   const [themeMode, setThemeMode] = useState<string>("device");

//   const handleSignOut = async () => {
//     await signOut();
//     window.location.href = "/";
//   };

//   return (
//     <div className="w-[480px] max-w-[calc(100vw-32px)] bg-white dark:bg-gray-900">
//       {/* User header */}
//       <div className="px-6 pt-6 pb-4">
//         <div className="flex items-center gap-4">
//           <img
//             src={user?.image || "/peter.webp"}
//             alt="Profile"
//             className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
//           />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
//               {user?.name || "Test User"}
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               {user?.email || "test_email@gmail.com"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-gray-200 dark:border-gray-700" />

//       {/* Dietary Preferences */}
//       <div className="px-6 py-5">
//         <h3 className="text-[0.95rem] font-semibold text-gray-900 dark:text-white mb-4">
//           Dietary Preferences
//         </h3>

//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//           Restrictions:
//         </p>
//         <div className="flex flex-wrap gap-2 mb-4">
//           <span className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
//             Kosher
//           </span>
//         </div>

//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//           Allergies:
//         </p>
//         <div className="flex flex-wrap gap-2">
//           <span className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
//             Tree Nuts
//           </span>
//           <span className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
//             Soy
//           </span>
//         </div>
//       </div>

//       <div className="border-t border-gray-200 dark:border-gray-700" />

//       {/* Appearance */}
//       <div className="px-6 py-5">
//         <h3 className="text-[0.95rem] font-semibold text-blue-600 dark:text-blue-400 mb-4">
//           Appearance
//         </h3>
        
//         <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
//           <button
//             onClick={() => setThemeMode("light")}
//             className={`flex-1 flex items-center justify-center gap-2 py-3 text-[0.95rem] font-medium transition-colors ${
//               themeMode === "light"
//                 ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
//                 : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
//             }`}
//           >
//             <Sun size={18} />
//             Light
//           </button>
          
//           <div className="w-px bg-gray-300 dark:bg-gray-600" />
          
//           <button
//             onClick={() => setThemeMode("device")}
//             className={`flex-1 flex items-center justify-center gap-2 py-3 text-[0.95rem] font-medium transition-colors ${
//               themeMode === "device"
//                 ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
//                 : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
//             }`}
//           >
//             <Monitor size={18} />
//             Device
//           </button>
          
//           <div className="w-px bg-gray-300 dark:bg-gray-600" />
          
//           <button
//             onClick={() => setThemeMode("dark")}
//             className={`flex-1 flex items-center justify-center gap-2 py-3 text-[0.95rem] font-medium transition-colors ${
//               themeMode === "dark"
//                 ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
//                 : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
//             }`}
//           >
//             <Moon size={18} />
//             Dark
//           </button>
//         </div>
//       </div>

//       <div className="border-t border-gray-200 dark:border-gray-700" />

//       {/* Menu Items */}
//       <div className="px-4 py-2">
//         <Link
//           href="/account"
//           onClick={onClose}
//           className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
//         >
//           <Pencil size={20} />
//           <span className="font-medium">Edit Preferences</span>
//         </Link>

//         <Link
//           href="/feedback"
//           onClick={onClose}
//           className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
//         >
//           <MessageSquare size={20} />
//           <span className="font-medium">Feedback</span>
//         </Link>

//         <Link
//           href="/about"
//           onClick={onClose}
//           className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
//         >
//           <Info size={20} />
//           <span className="font-medium">About PeterPlate</span>
//         </Link>
//       </div>

//       <div className="border-t border-gray-200 dark:border-gray-700" />

//       {/* Sign out */}
//       <div className="px-6 py-5">
//         <button
//           onClick={handleSignOut}
//           className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-none"
//         >
//           <LogOut size={18} />
//           Sign Out
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { LogOut, Info, Pencil, Sun, Monitor, Moon, MessageSquare, X } from "lucide-react";
import { useSession, signOut } from "@/utils/auth-client";
import { useState } from "react";

interface ProfileMenuContentProps {
  onClose: () => void;
}

export default function ProfileMenuContent({
  onClose,
}: ProfileMenuContentProps): JSX.Element {
  const { data: session } = useSession();
  const user = session?.user;
  const [themeMode, setThemeMode] = useState<string>("dark");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="w-full max-w-[600px] rounded-2xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-7">
        <div className="flex items-center gap-4">
          <img
            src={user?.image || "/peter.webp"}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {user?.name || "Peter Anteater"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || "panteater@uci.edu"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={18} />
        </button>
      </div>

      {/* Dietary Preferences */}
      <div className="px-6 pt-7">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
          Dietary Preferences
        </h3>

        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Restrictions:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="rounded-lg border border-blue-500 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
            Kosher
          </span>
        </div>

        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Allergies:
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg border border-blue-500 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
            Tree Nuts
          </span>
          <span className="rounded-lg border border-blue-500 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
            Soy
          </span>
        </div>
      </div>

      {/* Appearance */}
      <div className="px-6 pt-7">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
          Appearance
        </h3>

        <div className="flex rounded-xl border border-blue-500 overflow-hidden">
          <ThemeButton
            active={themeMode === "light"}
            onClick={() => setThemeMode("light")}
            icon={<Sun size={18} />}
            label="Light"
          />
          <ThemeButton
            active={themeMode === "device"}
            onClick={() => setThemeMode("device")}
            icon={<Monitor size={18} />}
            label="Device"
          />
          <ThemeButton
            active={themeMode === "dark"}
            onClick={() => setThemeMode("dark")}
            icon={<Moon size={18} />}
            label="Dark"
          />
        </div>
      </div>

      {/* Links */}
      <div className="px-4 pt-6 space-y-1">
          <MenuLink href="/feedback" onClick={onClose} icon={<MessageSquare size={20} />}>
          Feedback
        </MenuLink>
        <MenuLink href="/account" onClick={onClose} icon={<Pencil size={20} />}>
          Edit Preferences
        </MenuLink>
        <MenuLink href="/about" onClick={onClose} icon={<Info size={20} />}>
          About PeterPlate
        </MenuLink>
      </div>

      {/* Sign out */}
      <div className="px-6 py-7">
        <button
          onClick={handleSignOut}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <span className="inline-flex items-center gap-2">
            <LogOut size={18} />
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}

function ThemeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-blue-600 hover:bg-blue-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MenuLink({
  href,
  onClick,
  icon,
  children,
}: {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 rounded-xl px-4 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
}
