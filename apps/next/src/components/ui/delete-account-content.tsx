"use client";

import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@mui/material";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { getSignInUrl } from "@/lib/auth-actions";
import { SESSION_FRESH_AGE } from "@/lib/auth-constants";
import { Provider } from "@/lib/auth-types";
import { authClient, signOut, useSession } from "@/utils/auth-client";

// Added to the return URL so the dialog reopens at the confirm step after signing in again.
export const DELETE_ACCOUNT_CONFIRM_PARAM = "deleteAccount";

type DeleteAccountContentProps = {
  onClose: () => void;
};

export default function DeleteAccountContent({
  onClose,
}: DeleteAccountContentProps) {
  const { data: session } = useSession();
  const [confirmRequested, setConfirmRequested] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(DELETE_ACCOUNT_CONFIRM_PARAM)) return;
    url.searchParams.delete(DELETE_ACCOUNT_CONFIRM_PARAM);
    window.history.replaceState(null, "", url);
    setConfirmRequested(true);
  }, []);

  const handleSignInAgain = async () => {
    setError(null);
    setIsWorking(true);
    try {
      const { data: accounts } = await authClient.listAccounts();
      const provider = accounts?.[0]?.accountId.startsWith("apple_")
        ? Provider.Apple
        : Provider.Google;
      const returnUrl = new URL(window.location.href);
      returnUrl.searchParams.set(DELETE_ACCOUNT_CONFIRM_PARAM, "confirm");
      window.location.href = await getSignInUrl(provider, {
        returnUrl: returnUrl.pathname + returnUrl.search,
        authorizationUrlParams: { prompt: "consent" },
      });
    } catch (signInError) {
      console.error("Error signing in again", signInError);
      posthog.captureException(signInError);
      setError("Couldn't start sign-in. Please try again.");
      setIsWorking(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsWorking(true);
    const { error: deleteError } = await authClient.deleteUser();
    if (deleteError) {
      console.error("Error deleting account", deleteError);
      setError("Couldn't delete your account. Please try again.");
      setIsWorking(false);
      return;
    }

    window.alert("Your account has been deleted.");
    await signOut();
  };

  // Only offer deletion right after signing in again from this dialog.
  const isConfirmStep =
    confirmRequested &&
    !!session &&
    Date.now() - new Date(session.session.createdAt).getTime() <
      SESSION_FRESH_AGE * 1000;

  const sectionHeading =
    "font-poppins text-[24px] font-bold leading-[36px] text-[var(--primary-accent-hex)] dark:text-[var(--primary-accent-light)]";
  const sectionDescription =
    "font-poppins text-[14px] font-normal leading-[21px] text-[var(--text-muted-soft)] dark:text-white";
  const buttonBase =
    "font-poppins text-[14px] font-medium leading-[26px] tracking-[0.46px] !flex !items-center !justify-center !rounded-[8px] !h-[49px] !w-full !min-w-0 md:!w-auto md:!min-w-[81.4px] md:!px-4";

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col bg-white dark:bg-[var(--surface-dialog)] pb-[22px]">
      <div className="w-full shrink-0 rounded-t-[12px] flex flex-row items-center gap-3 pl-[18px] pr-4 pt-4 pb-4 md:flex-col md:items-center md:gap-0 md:pt-4 md:pb-0 md:pl-0 md:pr-0 md:h-[122px] bg-white dark:bg-[var(--surface-dialog)] md:bg-[var(--primary-accent-hex)] md:dark:border-b-[3px] md:dark:border-b-[var(--button-disabled-bg)]">
        <div
          className="flex !h-10 !w-10 flex-shrink-0 items-center justify-center rounded-full !p-2 bg-[rgba(0,105,168,0.12)] dark:bg-[rgba(142,197,255,0.12)] md:bg-white/20 md:dark:bg-white/10"
          aria-hidden
        >
          <DeleteIcon
            className="!h-6 !w-6 flex-shrink-0 text-[var(--primary-accent-hex)] dark:text-[var(--primary-accent-light)] md:!text-white"
            style={{ width: 24, height: 24 }}
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-0 min-w-0 md:items-center">
          <p className="font-poppins text-[16px] font-bold leading-[42px] text-[var(--primary-accent-hex)] dark:text-[var(--primary-accent-light)] md:text-white -mt-1">
            Delete your account
          </p>
          <p className="font-poppins text-[14px] font-normal leading-[21px] text-[var(--text-muted-soft)] dark:text-white md:text-white -mt-2">
            This can&apos;t be undone
          </p>
        </div>
      </div>

      <div className="px-[18px] pt-2 pb-[29.5px]">
        <h2 className={sectionHeading}>
          {isConfirmStep ? "Are you sure?" : "Delete Account"}
        </h2>
        <p className={`${sectionDescription} mt-1`}>
          This permanently deletes the PeterPlate account for{" "}
          <span className="font-semibold">{session?.user.email}</span>,
          including your ratings, favorites, logged meals, and preferences.
        </p>
        {!isConfirmStep && (
          <p className={`${sectionDescription} mt-2`}>
            To continue, sign in again to confirm it&apos;s you.
          </p>
        )}
        {error && (
          <p
            className="font-poppins text-[14px] leading-[21px] mt-2 text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <footer className="shrink-0 w-full px-[18px] grid grid-cols-2 gap-[7px] h-[49px] md:mx-auto md:w-[464px] md:px-0 md:flex md:justify-between md:items-center md:gap-0 bg-white dark:bg-[var(--surface-dialog)] rounded-b-[12px]">
        <Button
          variant="outlined"
          size="small"
          disabled={isWorking}
          onClick={onClose}
          className={`${buttonBase} !border-2 !border-[var(--border-input)] !bg-white !text-black hover:!bg-gray-50 dark:!border-2 dark:!border-[var(--primary-accent-light)] dark:!bg-transparent dark:!text-white dark:hover:!bg-[rgba(142,197,255,0.08)] dark:!shadow-[0_1px_8px_0_rgba(0,0,0,0.12),0_3px_4px_0_rgba(0,0,0,0.14),0_3px_3px_-2px_rgba(0,0,0,0.2)]`}
        >
          Cancel
        </Button>
        {isConfirmStep ? (
          <Button
            variant="contained"
            color="error"
            size="small"
            disabled={isWorking}
            onClick={handleDelete}
            className={buttonBase}
          >
            Delete Account
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            disabled={isWorking}
            onClick={handleSignInAgain}
            className={`${buttonBase} !bg-[var(--primary-accent-hex)] !text-white dark:!border-2 dark:!border-[var(--accent-border)] dark:!bg-[var(--primary-accent-light)] dark:!text-black dark:hover:!bg-[var(--accent-hover)] dark:hover:!border-[var(--accent-border)]`}
          >
            Sign In Again
          </Button>
        )}
      </footer>
    </div>
  );
}
