/**
 * ThankYouHeader
 * -----------------------------------------------------------------------------
 * Full-width card at the top of the thank-you page. Renders the brand row and
 * a centered confirmation block.
 *
 * The confirmation block adapts to the checkout state:
 *   - "succeeded"           green check icon + confirmed heading/subheading.
 *   - "pending"/"verifying" subtle muted spinner + "finalising" copy. Used
 *                           while the worker re-checks the payment status
 *                           (e.g. async webhook review). Keeps the same card
 *                           chrome so the layout doesn't jump when the
 *                           terminal status comes in.
 *
 * Markers:
 *   - root                    data-section="thank-you-header"
 *   - brand logo              data-slot="brand-icon"
 *   - brand name              data-slot="brand-name"
 *   - confirmation icon wrap  data-slot="confirmation-icon"
 *   - heading                 data-slot="confirmation-heading"
 *   - subheading              data-slot="confirmation-subheading"
 *   - status attribute        data-status="succeeded|pending|verifying"
 * -----------------------------------------------------------------------------
 */

import { Spinner } from "@/components/ui/spinner";

interface BrandConfig {
  name: string;
  icon: { src: string; alt: string };
}

export type ThankYouHeaderStatus = "verifying" | "pending" | "succeeded";

export interface ThankYouHeaderProps {
  brand: BrandConfig;
  heading: string;
  subheading: string;
  /** Defaults to "succeeded" for backwards compatibility. */
  status?: ThankYouHeaderStatus;
  /** Optional override for the heading when status !== "succeeded". */
  pendingHeading?: string;
  /** Optional override for the subheading when status !== "succeeded". */
  pendingSubheading?: string;
}

const DEFAULT_PENDING_HEADING = "Finalising your order…";
const DEFAULT_PENDING_SUBHEADING =
  "Your payment is going through a final review. This page will update automatically — no need to refresh.";
const DEFAULT_VERIFYING_SUBHEADING =
  "Just a moment while we confirm your order.";

export function ThankYouHeader({
  brand,
  heading,
  subheading,
  status = "succeeded",
  pendingHeading,
  pendingSubheading,
}: ThankYouHeaderProps) {
  const isSucceeded = status === "succeeded";

  const resolvedHeading = isSucceeded
    ? heading
    : (pendingHeading ?? DEFAULT_PENDING_HEADING);

  const resolvedSubheading = isSucceeded
    ? subheading
    : (pendingSubheading ??
      (status === "verifying"
        ? DEFAULT_VERIFYING_SUBHEADING
        : DEFAULT_PENDING_SUBHEADING));

  return (
    <>
      <div data-section="thank-you-brand-header" className="flex items-center justify-between py-4 border-b border-line">
        <img
          data-slot="brand-icon"
          src={brand.icon.src}
          alt={brand.icon.alt}
          className="h-8 w-8 shrink-0 border border-line object-cover"
        />
        <span
          data-slot="brand-name"
          className="smallcaps text-[10px] text-ink3"
        >
          {brand.name}
        </span>
      </div>

      <div data-section="thank-you-header" data-status={status} className="py-10 text-center border-b border-line">
        <div
          data-slot="confirmation-icon"
          aria-hidden="true"
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center"
        >
          {isSucceeded ? (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="23" stroke="#1b3326" strokeWidth="0.8"/>
              <path d="M14 24l7 7 13-13" stroke="#1b3326" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <Spinner className="h-7 w-7 text-ink3" />
          )}
        </div>
        <h1
          data-slot="confirmation-heading"
          className="serif text-[38px] leading-none text-ink"
        >
          {resolvedHeading}
        </h1>
        <p
          data-slot="confirmation-subheading"
          className="mt-3 text-[13.5px] text-ink2 max-w-[52ch] mx-auto"
        >
          {resolvedSubheading}
        </p>
      </div>
    </>
  );
}
