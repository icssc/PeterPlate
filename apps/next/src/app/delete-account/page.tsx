"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { type ReactNode, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { useSnackbarStore } from "@/context/useSnackbar";
import { getSignInUrl } from "@/lib/auth-actions";
import { SESSION_FRESH_AGE } from "@/lib/auth-constants";
import { Provider } from "@/lib/auth-types";
import { authClient, signOut, useSession } from "@/utils/auth-client";

export default function DeleteAccountPage() {
  return (
    <Suspense>
      <DeleteAccount />
    </Suspense>
  );
}

function DeleteAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const { showSnackbar } = useSnackbarStore();
  const [isWorking, setIsWorking] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending || isWorking) return;

    if (!session) {
      showSnackbar("Login to delete your account!", "error");
      router.push("/");
    }
  }, [session, isPending, isWorking, router, showSnackbar]);

  const handleSignInAgain = async () => {
    setError(null);
    setIsWorking(true);
    try {
      const { data: accounts } = await authClient.listAccounts();
      const provider = accounts?.[0]?.accountId.startsWith("apple_")
        ? Provider.Apple
        : Provider.Google;
      window.location.href = await getSignInUrl(provider, {
        returnUrl: "/delete-account?step=confirm",
        // Skips auth.icssc.club's saved session so the user really signs in.
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

    setIsDeleted(true);
    window.alert("Your account has been deleted.");
    await signOut();
  };

  if (isPending || (!session && !isDeleted)) return null;

  // Only offer deletion right after signing in again from this page.
  const isConfirmStep =
    searchParams.get("step") === "confirm" &&
    !!session &&
    Date.now() - new Date(session.session.createdAt).getTime() <
      SESSION_FRESH_AGE * 1000;

  let content: ReactNode;
  if (isDeleted) {
    content = <p>Your account has been deleted.</p>;
  } else if (!isConfirmStep) {
    content = (
      <>
        <p>To delete your account, sign in again to confirm it&apos;s you.</p>
        <Button onClick={handleSignInAgain} disabled={isWorking}>
          Sign In Again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Cancel</Link>
        </Button>
      </>
    );
  } else {
    content = (
      <>
        <p>
          This permanently deletes the PeterPlate account for{" "}
          <span className="font-semibold">{session?.user.email}</span>,
          including your ratings, favorites, logged meals, and preferences. This
          can&apos;t be undone.
        </p>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isWorking}
        >
          Delete Account
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Cancel</Link>
        </Button>
      </>
    );
  }

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-6 text-gray-900 dark:border-zinc-700 dark:bg-[var(--surface-elevated)] dark:text-zinc-200">
        <h1 className="text-2xl font-bold text-sky-700 dark:text-blue-300">
          Delete Account
        </h1>
        {content}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
