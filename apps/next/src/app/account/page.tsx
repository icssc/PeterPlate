"use client";

import { useState } from "react";

export default function MyAccountPage() {
  // Dummy state variables
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("peter_plate_user");
  const [newUsername, setNewUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleCreateAccount = () => {
    console.log("Creating account with:", newUsername);
    // Placeholder for creating new account
    setIsLoggedIn(true);
    setUsername(newUsername);
  };

  const handlePasswordReset = () => {
    console.log("Resetting password...");
    // Placeholder for real password update logic
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-semibold mb-4">My Account</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
        Manage your PeterPlate account details here.
      </p>

      <div className="space-y-6">
        {/* Username Section */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Username</h2>
          <p className="text-xs text-neutral-500">
            This is the name shown in your ratings and favorites.
          </p>

          {isLoggedIn ? (
            // Logged in - show username (read-only)
            <input
              type="text"
              value={username}
              readOnly
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-3 py-2 text-sm cursor-not-allowed"
            />
          ) : (
            // Logged out - enter username
            <input
              type="text"
              placeholder="Enter username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
            />
          )}
        </section>

        {/* Password Section */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Password</h2>
          <p className="text-xs text-neutral-500">
            {isLoggedIn
              ? "Update your password to keep your account secure."
              : "Set a password to create your account."}
          </p>

          {isLoggedIn ? (
            // Logged-in password reset
            <div className="space-y-2">
              {/* TODO: Replace these inputs with MUI inputs */}
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handlePasswordReset}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save changes
              </button>
            </div>
          ) : (
            // Logged-out account creation fields
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Create password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleCreateAccount}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create Account
              </button>
            </div>
          )}
        </section>

        {/* Debug button just for testing change in UI */}
        {/* TODO: Remove */}
        <button
          type="button"
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="text-xs text-blue-600 underline mt-4"
        >
          Toggle Login State (debug)
        </button>
      </div>
    </div>
  );
}
