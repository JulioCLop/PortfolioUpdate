export default function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Amount" },
    { n: 2, label: "Details" },
    { n: 3, label: "Review" },
  ] as const;

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const active = step === s.n;
        const done = step > s.n;
        return (
          <div key={s.n} className="flex items-center gap-2">
            <div
              className={[
                "flex h-9 w-9 items-center justify-center rounded-2xl border text-sm font-semibold",
                done
                  ? "border-emerald-400/30 bg-emerald-400/10"
                  : active
                  ? "border-cyan-300/40 bg-cyan-300/10"
                  : "border-white/10 bg-white/5 text-white/60",
              ].join(" ")}
            >
              {s.n}
            </div>
            <div className={active ? "text-sm font-semibold" : "text-sm text-white/60"}>{s.label}</div>
            {i < steps.length - 1 ? <div className="h-px w-6 bg-white/10" /> : null}
          </div>
        );
      })}
    </div>
  );
}
