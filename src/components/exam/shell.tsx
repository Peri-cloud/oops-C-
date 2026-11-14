"use client";

import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Bell,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

const ICONS = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BookOpen, label: "Courses" },
  { icon: ClipboardList, label: "Tests" },
  { icon: Bell, label: "Notifications" },
  { icon: ShoppingCart, label: "Store" },
];

const BOTTOM_ICONS = [Settings, LogOut];

/** The slim dark navigation sidebar used by iamneo (bg #060D1A). */
export function NeoSidebar({ active = "Tests" }: { active?: string }) {
  return (
    <aside
      className="hidden sm:flex w-[72px] shrink-0 flex-col items-center bg-[var(--neo-dark)] py-3 z-20"
      aria-label="iamneo navigation"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-white/20 bg-white p-1">
        <span className="text-[8px] font-bold leading-tight tracking-tight text-[#022277]">MSEC</span>
      </div>
      <nav className="flex flex-1 flex-col items-center gap-1">
        {ICONS.map(({ icon: Icon, label }) => {
          const isActive = label === active;
          return (
            <button
              key={label}
              title={label}
              className={`flex h-14 w-full flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? "bg-gradient-to-br from-[var(--neo-primary)] to-[var(--neo-primary)]/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
              <span className="text-[8px] leading-none">{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="flex flex-col items-center gap-2 pb-2">
        {BOTTOM_ICONS.map((Icon, i) => (
          <button key={i} className="text-white/60 hover:text-white" title={i === 0 ? "Settings" : "Log out"}>
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </aside>
  );
}

/** Approximation of the iamneo wordmark (blue aperture mark + lowercase name). */
export function IamneoLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 select-none">
      <svg width="26" height="26" viewBox="0 0 40 40" aria-hidden>
        <polygon points="20,3 34.7,11.5 34.7,28.5 20,37 5.3,28.5 5.3,11.5" fill="var(--neo-primary)" />
        <polygon points="20,10 28.7,15 28.7,25 20,30 11.3,25 11.3,15" fill="#fff" />
        <polygon
          points="20,14.5 24.7,17.2 24.7,22.8 20,25.5 15.3,22.8 15.3,17.2"
          fill="var(--neo-primary)"
        />
      </svg>
      <span
        className={`text-[20px] font-semibold leading-none tracking-tight ${
          dark ? "text-white" : "text-[#121212]"
        }`}
      >
        iamneo
      </span>
    </div>
  );
}

/** College monogram where the real page shows the MSEC logo image. */
export function CollegeLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-md border border-[var(--neo-border)] bg-white"
      style={{ width: size, height: size }}
      title="MSEC"
    >
      <div className="flex flex-col items-center leading-none">
        <span className="text-[9px] font-bold text-[#022277]">MSEC</span>
        <span className="mt-0.5 text-[6px] font-medium text-[var(--neo-text)]">Chennai</span>
      </div>
    </div>
  );
}
