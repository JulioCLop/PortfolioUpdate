import React from "react";

export default function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/70">{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-rose-300">{error}</span>
      ) : hint ? (
        <span className="text-xs text-white/50">{hint}</span>
      ) : null}
    </label>
  );
}
