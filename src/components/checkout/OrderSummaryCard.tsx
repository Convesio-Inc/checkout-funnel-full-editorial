import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LockIcon } from "lucide-react";
import { SecurityBadges } from "@/components/checkout/SecurityBadges";
import { type Bundle } from "@/components/checkout/bundles";

function formatDollars(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

export interface OrderSummaryCardProps {
  selectedBundle: Bundle;
  /** When true the Pay button is non-interactive. Defaults to false. */
  payDisabled?: boolean;
  /** When true the button shows a spinner and stays disabled. */
  payLoading?: boolean;
}

export function OrderSummaryCard({
  selectedBundle,
  payDisabled = false,
  payLoading = false,
}: OrderSummaryCardProps) {
  const disabled = payDisabled || payLoading;

  const [ctaState, setCtaState] = useState<"idle" | "busy" | "done">("idle");
  const prevLoading = useRef(false);

  useEffect(() => {
    if (payLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCtaState("busy");
      prevLoading.current = true;
    } else if (prevLoading.current) {
      prevLoading.current = false;
      setCtaState("done");
      const t = setTimeout(() => setCtaState("idle"), 2000);
      return () => clearTimeout(t);
    }
  }, [payLoading]);

  const totalFormatted = formatDollars(selectedBundle.totalAmountMinor);
  const lineLabel = `${selectedBundle.bottleCount} × Vitamin Essentials Pack`;

  return (
    <div data-section="order-summary" className="border-t border-[#e0d9cc] pt-4 mt-2">
      {/* Line items */}
      <div className="flex justify-between text-[12px] text-[#555] py-1">
        <span>
          {lineLabel}{" "}
          <span className="text-[#aaa] text-[10px]">(one-time)</span>
        </span>
        <span>{totalFormatted}</span>
      </div>
      <div className="flex justify-between text-[12px] text-[#555] py-1">
        <span>Shipping</span>
        <span className="text-[#3a6a4a] font-semibold">FREE</span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-start pt-2.5 mt-1 border-t border-[#e8e0d4]">
        <span className="text-[15px] font-bold text-[#1a3028]">Total Today</span>
        <div className="text-right">
          <div className="text-[15px] font-bold text-[#1a3028]">
            {totalFormatted}
          </div>
          <div className="text-[10px] text-[#aaa]">USD · billed once</div>
        </div>
      </div>

      {/* CTA */}
      <Button
        data-slot="cta-primary"
        data-state={ctaState}
        type="submit"
        disabled={disabled}
        aria-disabled={disabled}
        className="pay-cta mt-3 w-full h-[50px] rounded-[8px] border-0 bg-[#c8620a] text-[13px] font-extrabold tracking-[0.1em] text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="cta-main flex items-center gap-1.5">
          <LockIcon className="w-3.5 h-3.5 shrink-0" />
          RUSH MY ORDER — {totalFormatted} →
        </span>

        <span className="cta-overlay cta-overlay-busy">
          <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
          <span className="text-sm tracking-[0.02em]">Placing your order…</span>
        </span>

        <span className="cta-overlay cta-overlay-done">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="cta-checkmark" d="M5 12.5l4 4 10-10" />
          </svg>
          <span className="text-sm tracking-[0.02em]">Order confirmed</span>
        </span>
      </Button>

      <p className="text-[10px] text-[#999] text-center mt-2">
        Secure 256-bit SSL encryption · You won't be charged until you click above
      </p>

      <div className="mt-3">
        <SecurityBadges />
      </div>

      <p
        data-slot="cta-footnote"
        className="text-[9px] text-[#aaa] text-center mt-3 leading-[1.5]"
      >
        By placing this order you agree to our Terms of Sale and refund policy.
        Demo checkout — no real charges are made.
      </p>
    </div>
  );
}
