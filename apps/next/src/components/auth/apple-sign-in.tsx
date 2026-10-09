"use client";

import { Apple as AppleIcon } from "@mui/icons-material";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Provider } from "@/lib/auth-types";
import { cn } from "@/utils/tw";
import { SignInButton } from "./sign-in-button";

interface AppleSignInButtonProps {
  fullWidth?: boolean;
}

/**
 * Sign in with Apple button (Apple HIG black/white styles only).
 * https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple
 */
export function AppleSignInButton({ fullWidth }: AppleSignInButtonProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <SignInButton
      icon={<AppleIcon sx={{ fontSize: 18 }} />}
      provider={Provider.Apple}
      fullWidth={fullWidth}
      className={cn(
        "border-0 shadow",
        isDark
          ? "bg-white text-black hover:bg-[#f5f5f5]"
          : "bg-black text-white hover:bg-[#1a1a1a]",
      )}
    />
  );
}
