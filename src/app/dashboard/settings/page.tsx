"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const supabase = createClient();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
          Settings
        </h1>
        <p className="text-warm-gray text-sm font-body mt-1">
          Manage your account settings.
        </p>
      </div>

      {/* Change Password */}
      <div className="bg-warm-white rounded-2xl border border-border-light p-6 md:p-8">
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-6">
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="new-password" className="block text-xs font-medium text-charcoal-light mb-1.5 font-body">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30 focus:border-deep-green transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-medium text-charcoal-light mb-1.5 font-body">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30 focus:border-deep-green transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs font-body bg-red-50 rounded-lg p-2">{error}</p>
          )}
          {message && (
            <p className="text-emerald-600 text-xs font-body bg-emerald-50 rounded-lg p-2">✓ {message}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-deep-green hover:bg-deep-green-light text-white font-semibold text-sm font-body transition-all disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Sign Out */}
      <div className="bg-warm-white rounded-2xl border border-border-light p-6 md:p-8">
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-2">
          Sign Out
        </h2>
        <p className="text-warm-gray text-sm font-body mb-4">
          Sign out of your TapDine dashboard on this device.
        </p>
        <button
          onClick={handleSignOut}
          className="px-6 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm font-body hover:bg-red-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
