/**
 * SecurityBadges
 * -----------------------------------------------------------------------------
 * Four-column text-only trust grid matching the reference Trust() component.
 * No icons — each badge has a smallcaps key and a light text-ink2 value.
 *
 * Marker: data-section="trust-badges"
 * -----------------------------------------------------------------------------
 */

const BADGES: { k: string; v: string }[] = [
  { k: "SSL / TLS 1.3",     v: "256-bit · encrypted" },
  { k: "PCI DSS",           v: "Level 1 compliant" },
  { k: "Verified Merchant", v: "Since 2019" },
  { k: "Privacy Guard",     v: "No data resale" },
];

export function SecurityBadges() {
  return (
    <div
      data-section="trust-badges"
      className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 pt-6 border-t border-line"
    >
      {BADGES.map((b) => (
        <div key={b.k} className="leading-tight">
          <div className="smallcaps text-[10px] text-ink3">{b.k}</div>
          <div className="text-[12px] text-ink2 mt-1 font-light">{b.v}</div>
        </div>
      ))}
    </div>
  );
}
