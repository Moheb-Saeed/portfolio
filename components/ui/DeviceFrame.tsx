import type { ReactNode } from "react";

export type Device = "macbook" | "ipad" | "iphone";

type DeviceFrameProps = {
  device: Device;
  children: ReactNode;
};

/**
 * Pure-CSS device chrome. Elevation on dark = borders + lighter surfaces,
 * no shadows. Bezel padding uses % of width so the chrome scales with the
 * frame at any rendered size.
 */
export function DeviceFrame({ device, children }: DeviceFrameProps) {
  if (device === "macbook") {
    return (
      <div className="select-none">
        {/* Lid: bezel with camera dot */}
        <div className="relative rounded-t-lg border border-border bg-surface p-[1.1%] pt-[2.4%]">
          <span
            aria-hidden
            className="absolute left-1/2 top-[1%] size-1 -translate-x-1/2 rounded-full bg-bg"
          />
          <div className="overflow-hidden rounded-[3px]">{children}</div>
        </div>
        {/* Base: wider than the lid, with a thumb notch */}
        <div className="relative -mx-[3%] h-2 rounded-b-lg border border-t-0 border-border bg-surface-2 sm:h-2.5">
          <span
            aria-hidden
            className="absolute left-1/2 top-0 h-1/2 w-[13%] -translate-x-1/2 rounded-b-md bg-bg/50"
          />
        </div>
      </div>
    );
  }

  if (device === "ipad") {
    return (
      <div className="select-none rounded-2xl border border-border bg-surface p-[3.5%]">
        <div className="overflow-hidden rounded-md">{children}</div>
      </div>
    );
  }

  // iphone
  return (
    <div className="relative select-none rounded-3xl border border-border bg-surface p-[3.5%]">
      {/* Dynamic Island */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[3%] z-20 h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-bg"
      />
      <div className="overflow-hidden rounded-[18px]">{children}</div>
    </div>
  );
}
