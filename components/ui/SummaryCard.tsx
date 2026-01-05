type Frequency = "one-time" | "monthly";

function formatMoney(n: number) {
  return "$" + n.toFixed(2);
}

export default function SummaryCard({
  amount,
  coverFees,
  fee,
  total,
  frequency,
  step,
}: {
  amount: number;
  coverFees: boolean;
  fee: number;
  total: number;
  frequency: Frequency;
  step: 1 | 2 | 3;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
      <div className="text-xs uppercase tracking-[.18em] text-white/60">Summary</div>
      <div className="mt-2 text-lg font-semibold">
        {formatMoney(amount)} {frequency === "monthly" ? "/mo" : "one-time"}
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <Row label="Donation" value={formatMoney(amount)} />
        <Row label="Cover fees" value={coverFees ? formatMoney(fee) : formatMoney(0)} />
        <div className="border-t border-white/10 pt-2">
          <Row label="Total today" value={formatMoney(total)} strong />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
        {step === 1 && "Next: add details, then review and complete."}
        {step === 2 && "You’re close — review the total, then submit."}
        {step === 3 && "Ready to complete. Keep the button near the summary for confidence."}
      </div>
    </div>
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
