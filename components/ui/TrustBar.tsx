export default function TrustBar() {
  return (
    <div className="grid gap-2 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-3 md:gap-3">
      <Item title="Secure checkout" desc="Encrypted transmission + safe processing." />
      <Item title="Fast on mobile" desc="Large tap targets + minimal friction." />
      <Item title="Accessible forms" desc="Clear labels, errors, and keyboard flow." />
    </div>
  );
}

function Item({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-white/65">{desc}</div>
    </div>
  );
}
