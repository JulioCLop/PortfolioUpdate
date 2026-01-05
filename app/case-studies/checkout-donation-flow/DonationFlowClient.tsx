"use client";

import React, { useEffect, useMemo, useState } from "react";
import TrustBar from "@/components/ui/TrustBar";
import Stepper from "@/components/ui/Stepper";
import Field from "@/components/ui/Field";
import SummaryCard from "@/components/ui/SummaryCard";

type Frequency = "one-time" | "monthly";
type Step = 1 | 2 | 3;

type FormState = {
  amount: number;
  frequency: Frequency;
  name: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  coverFees: boolean;
  note: string;
};

const DEFAULT: FormState = {
  amount: 50,
  frequency: "one-time",
  name: "",
  email: "",
  phone: "",
  address1: "",
  city: "",
  state: "",
  zip: "",
  coverFees: true,
  note: "",
};

const PRESETS = [25, 50, 100, 250];

function clampMoney(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n * 100) / 100);
}

function formatMoney(n: number) {
  return "$" + n.toFixed(2);
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isUSZip(v: string) {
  return /^\d{5}(-\d{4})?$/.test(v.trim());
}

function normalizePhone(v: string) {
  const digits = v.replace(/[^\d]/g, "").slice(0, 10);
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  if (digits.length <= 3) return a;
  if (digits.length <= 6) return `(${a}) ${b}`;
  return `(${a}) ${b}-${c}`;
}

function calcFeeCover(amount: number) {
  // Example "cover fees" model (2.9% + $0.30)
  const fee = amount * 0.029 + 0.3;
  return Math.round(fee * 100) / 100;
}

export default function DonationFlowClient() {
  const [step, setStep] = useState<Step>(1);
  const [state, setState] = useState<FormState>(DEFAULT);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Restore saved state
  useEffect(() => {
    try {
      const raw = localStorage.getItem("donation_flow_v1");
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
  }, []);

  // Save state
  useEffect(() => {
    try {
      localStorage.setItem("donation_flow_v1", JSON.stringify(state));
    } catch {}
  }, [state]);

  const fee = useMemo(() => calcFeeCover(state.amount), [state.amount]);
  const total = useMemo(
    () => clampMoney(state.amount + (state.coverFees ? fee : 0)),
    [state.amount, state.coverFees, fee]
  );

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    // Step 1 validations
    if (state.amount <= 0) e.amount = "Enter an amount greater than $0.";

    // Step 2 validations
    if (!state.name.trim()) e.name = "Name is required.";
    if (!state.email.trim() || !isEmail(state.email)) e.email = "Enter a valid email.";
    if (state.phone.trim() && normalizePhone(state.phone).replace(/[^\d]/g, "").length < 10)
      e.phone = "Enter a 10-digit phone number.";

    // Optional address validations (still helpful)
    if (state.zip.trim() && !isUSZip(state.zip)) e.zip = "Enter a valid ZIP code.";

    return e;
  }, [state]);

  function markTouched(key: keyof FormState) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((p) => ({ ...p, [key]: value }));
  }

  function canProceedFromStep1() {
    return !errors.amount;
  }
  function canProceedFromStep2() {
    return !errors.name && !errors.email && !errors.phone && !errors.zip;
  }

  async function submit() {
    setSubmitting(true);

    // Fake API delay
    await new Promise((r) => setTimeout(r, 900));

    setSubmitting(false);
    setSuccess(true);

    // Optional: clear saved state after success
    try {
      localStorage.removeItem("donation_flow_v1");
    } catch {}
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#070A12] text-white">
        <div className="mx-auto max-w-[1100px] px-4 py-10">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[.18em] text-white/60">Case Study #01</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">High-Conversion Checkout / Donation Flow</h1>
              <p className="mt-2 text-white/70">Premium, friction-free completion flow with trust + validation.</p>
            </div>
          </header>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,.55)]">
            <div className="flex flex-col items-start gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,.15)]" />
                Payment complete (demo)
              </div>
              <h2 className="text-2xl font-semibold">Thank you. You’re all set.</h2>
              <p className="max-w-[70ch] text-white/70">
                This is a front-end demo. In production you’d send the payload to Stripe (PaymentIntent) or your processor and
                confirm the payment before showing success.
              </p>

              <button
                onClick={() => {
                  setSuccess(false);
                  setStep(1);
                  setState(DEFAULT);
                  setTouched({});
                }}
                className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10"
              >
                Make another donation
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-20 [mask-image:radial-gradient(520px_420px_at_50%_20%,black_45%,transparent_80%)]">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-8 md:py-10 relative">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[.18em] text-white/60">Case Study #01</div>
            <h1 className="mt-2 text-[clamp(28px,3.2vw,40px)] font-semibold tracking-tight">
              High-Conversion Checkout / Donation Flow
            </h1>
            <p className="mt-2 max-w-[72ch] text-white/70">
              Lead Front-End • UX + validation + trust signals • Mobile-first completion flow.
            </p>
          </div>

          <div className="flex gap-2">
            <a
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10"
              href="#demo"
            >
              Live Demo ↗
            </a>
            <a
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10"
              href="#case"
            >
              Open Case Study →
            </a>
          </div>
        </header>

        {/* Trust bar */}
        <div className="mt-5">
          <TrustBar />
        </div>

        {/* Layout */}
        <div id="demo" className="mt-5 grid gap-4 lg:grid-cols-12">
          {/* Form */}
          <section className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6 shadow-[0_30px_80px_rgba(0,0,0,.55)]">
            <Stepper step={step} />

            {step === 1 && (
              <div className="mt-5">
                <h2 className="text-lg font-semibold">Choose your amount</h2>
                <p className="mt-1 text-sm text-white/70">Clear hierarchy. One decision at a time.</p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PRESETS.map((amt) => {
                    const active = state.amount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => set("amount", amt)}
                        className={[
                          "rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                          active
                            ? "border-cyan-300/40 bg-cyan-300/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10",
                        ].join(" ")}
                      >
                        {formatMoney(amt)}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 grid gap-2">
                  <Field
                    label="Custom amount"
                    hint="Use whole dollars or cents. Example: 32.50"
                    error={touched.amount ? errors.amount : undefined}
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">$</span>
                      <input
                        value={String(state.amount)}
                        onChange={(e) => set("amount", clampMoney(Number(e.target.value)))}
                        onBlur={() => markTouched("amount")}
                        inputMode="decimal"
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-8 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
                        aria-invalid={!!errors.amount}
                      />
                    </div>
                  </Field>

                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-sm">
                      <div className="font-medium">Make it recurring</div>
                      <div className="text-white/65 text-xs">Monthly gives predictable support.</div>
                    </div>
                    <div className="flex gap-2">
                      <Toggle
                        active={state.frequency === "one-time"}
                        onClick={() => set("frequency", "one-time")}
                        label="One-time"
                      />
                      <Toggle
                        active={state.frequency === "monthly"}
                        onClick={() => set("frequency", "monthly")}
                        label="Monthly"
                      />
                    </div>
                  </div>

                  <label className="mt-1 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <input
                      type="checkbox"
                      checked={state.coverFees}
                      onChange={(e) => set("coverFees", e.target.checked)}
                      className="mt-1 h-4 w-4 accent-cyan-300"
                    />
                    <div className="text-sm">
                      <div className="font-medium">Cover processing fees</div>
                      <div className="text-white/65 text-xs">
                        Adds {formatMoney(fee)} so we receive the full {formatMoney(state.amount)}.
                      </div>
                    </div>
                  </label>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="text-sm text-white/70">
                    Total today: <span className="font-semibold text-white">{formatMoney(total)}</span>
                  </div>
                  <button
                    type="button"
                    disabled={!canProceedFromStep1()}
                    onClick={() => setStep(2)}
                    className={[
                      "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      canProceedFromStep1()
                        ? "border border-cyan-300/40 bg-gradient-to-r from-cyan-400/80 to-violet-500/60 hover:shadow-[0_18px_50px_rgba(34,211,238,.18)]"
                        : "border border-white/10 bg-white/5 text-white/40 cursor-not-allowed",
                    ].join(" ")}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-5">
                <h2 className="text-lg font-semibold">Your details</h2>
                <p className="mt-1 text-sm text-white/70">Error-proof inputs. Clear feedback. No surprises.</p>

                <div className="mt-4 grid gap-3">
                  <Field label="Full name" error={touched.name ? errors.name : undefined}>
                    <input
                      value={state.name}
                      onChange={(e) => set("name", e.target.value)}
                      onBlur={() => markTouched("name")}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
                      autoComplete="name"
                    />
                  </Field>

                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Email" error={touched.email ? errors.email : undefined}>
                      <input
                        value={state.email}
                        onChange={(e) => set("email", e.target.value)}
                        onBlur={() => markTouched("email")}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </Field>

                    <Field label="Phone (optional)" error={touched.phone ? errors.phone : undefined}>
                      <input
                        value={state.phone}
                        onChange={(e) => set("phone", normalizePhone(e.target.value))}
                        onBlur={() => markTouched("phone")}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Address (optional)">
                      <input
                        value={state.address1}
                        onChange={(e) => set("address1", e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
                        autoComplete="street-address"
                      />
                    </Field>

                    <Field label="City (optional)">
                      <input
                        value={state.city}
                        onChange={(e) => set("city", e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
                        autoComplete="address-level2"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <Field label="State (optional)">
                      <input
                        value={state.state}
                        onChange={(e) => set("state", e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
                        autoComplete="address-level1"
                      />
                    </Field>

                    <Field label="ZIP (optional)" error={touched.zip ? errors.zip : undefined}>
                      <input
                        value={state.zip}
                        onChange={(e) => set("zip", e.target.value)}
                        onBlur={() => markTouched("zip")}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
                        inputMode="numeric"
                        autoComplete="postal-code"
                      />
                    </Field>

                    <Field label="Note (optional)">
                      <input
                        value={state.note}
                        onChange={(e) => set("note", e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
                      />
                    </Field>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // touch required fields to show errors
                      setTouched((p) => ({ ...p, name: true, email: true, phone: true, zip: true }));
                      if (canProceedFromStep2()) setStep(3);
                    }}
                    className={[
                      "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      canProceedFromStep2()
                        ? "border border-cyan-300/40 bg-gradient-to-r from-cyan-400/80 to-violet-500/60 hover:shadow-[0_18px_50px_rgba(34,211,238,.18)]"
                        : "border border-white/10 bg-white/5 text-white/40 cursor-not-allowed",
                    ].join(" ")}
                  >
                    Review →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-5">
                <h2 className="text-lg font-semibold">Review + complete</h2>
                <p className="mt-1 text-sm text-white/70">Last step. Clear summary. No surprise totals.</p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">
                        {formatMoney(state.amount)} {state.frequency === "monthly" ? "per month" : "one-time"}
                      </div>
                      <div className="text-xs text-white/65">
                        Donor: {state.name} • {state.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/65">Total today</div>
                      <div className="text-xl font-semibold">{formatMoney(total)}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-white/75">
                    <Row label="Donation" value={formatMoney(state.amount)} />
                    <Row label="Cover fees" value={state.coverFees ? formatMoney(fee) : formatMoney(0)} />
                    <div className="border-t border-white/10 pt-2">
                      <Row label="Total" value={formatMoney(total)} strong />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold">Secure payment (demo UI)</div>
                    <p className="mt-1 text-sm text-white/70">
                      In production you’d use Stripe Elements or your processor here.
                      This UI focuses on trust signals + completion flow.
                    </p>
                    <div className="mt-3 grid gap-2 md:grid-cols-3">
                      <FakeInput label="Card number" placeholder="4242 4242 4242 4242" />
                      <FakeInput label="MM/YY" placeholder="12/34" />
                      <FakeInput label="CVC" placeholder="123" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={submit}
                    className={[
                      "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      submitting
                        ? "border border-white/10 bg-white/5 text-white/50"
                        : "border border-cyan-300/40 bg-gradient-to-r from-cyan-400/80 to-violet-500/60 hover:shadow-[0_18px_50px_rgba(34,211,238,.18)]",
                    ].join(" ")}
                  >
                    {submitting ? "Processing..." : "Complete donation"}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Summary */}
          <aside className="lg:col-span-5">
            <SummaryCard
              amount={state.amount}
              coverFees={state.coverFees}
              fee={fee}
              total={total}
              frequency={state.frequency}
              step={step}
            />

            <div id="case" className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80">
                UX • Performance • Accessibility • Forms
              </div>

              <h3 className="mt-3 text-base font-semibold">Why this converts</h3>
              <ul className="mt-2 space-y-2 text-sm text-white/70">
                <li>• One decision per screen → less cognitive load.</li>
                <li>• Inline validation with clear recovery → fewer form abandons.</li>
                <li>• Trust bar + secure language near action → higher completion.</li>
                <li>• Mobile-first spacing + large hit targets → fewer mis-taps.</li>
              </ul>

              <div className="mt-4 text-xs text-white/55">
                Tip: Connect Stripe by replacing the “Secure payment (demo UI)” block with Stripe Elements.
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-6 px-1 text-xs text-white/55">
          © {new Date().getFullYear()} • High-Conversion Checkout / Donation Flow • Case Study #01
        </footer>
      </div>
    </main>
  );
}

function Toggle({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border px-3 py-2 text-xs font-semibold transition",
        active ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-white/5 hover:bg-white/10",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={strong ? "font-semibold text-white" : "text-white/70"}>{label}</span>
      <span className={strong ? "font-semibold text-white" : "text-white/80"}>{value}</span>
    </div>
  );
}

function FakeInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/70">{label}</span>
      <input
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-cyan-300/40 focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]"
      />
    </label>
  );
}
