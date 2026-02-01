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

      <MenuItem component={Link} href="/about" onClick={onClose}>
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
