/**
 * Shared control styling. Buttons take the 6px input radius — the manual gives
 * exactly four radii (6 inputs, 10 cards, 18 panels, full pills) and a control
 * is an input, not a card.
 *
 * Padding is 24/12 off the 4px scale, which also puts every control at 48px
 * tall — comfortably over the 44px touch-target floor.
 *
 * Hover is a colour change only. The look is "structured, quiet, technical", so
 * controls don't lift or scale; the devices in the Work section are the one
 * place where motion is part of the point.
 */

const base =
  "inline-flex items-center justify-center rounded-input px-6 py-3 text-small font-semibold transition-colors duration-200";

export const btnPrimary = `${base} bg-accent-solid text-on-accent hover:bg-accent-strong`;

export const btnSecondary = `${base} border border-line bg-raised text-ink hover:border-accent hover:text-accent`;
