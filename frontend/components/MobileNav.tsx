"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Hexagon,
  LayoutDashboard,
  MapPin,
  Menu,
  Package,
  Settings,
  X,
} from "lucide-react";


const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Hives",
    href: "/hives",
    icon: Hexagon,
  },
  {
    label: "Honey Batches",
    href: "/batches",
    icon: Package,
  },
  {
    label: "Supply Chain",
    href: "/supply-chain",
    icon: Box,
  },
  {
    label: "Traceability",
    href: "/traceability",
    icon: MapPin,
  },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* ============================================================
          MOBILE TOP NAVBAR
          ============================================================ */}

      <div
        className="
          fixed
          left-0
          right-0
          top-0
          z-[60]
          flex
          h-16
          items-center
          justify-between
          border-b
          border-white/10
          bg-black/35
          px-4
          backdrop-blur-xl
          lg:hidden
        "
      >
        {/* MENU */}

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-black/25
            text-white
            backdrop-blur-xl
            transition
            hover:border-amber-400/40
            hover:text-amber-400
          "
        >
          <Menu size={21} strokeWidth={1.8} />
        </button>

        {/* LOGO */}

        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5"
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-amber-400
              text-black
            "
          >
            <Hexagon size={19} />
          </div>

          <div className="leading-none">
            <div className="text-sm font-semibold tracking-tight text-white">
              HoneyChain
            </div>

            <div className="mt-1 text-[9px] text-white/40">
              Hive Intelligence
            </div>
          </div>
        </Link>

        {/* THEME */}

        
      </div>

      {/* ============================================================
          OVERLAY
          ============================================================ */}

      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-[70]
            bg-black/55
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* ============================================================
          MOBILE DRAWER
          ============================================================ */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-[80]
          flex
          h-full
          w-[285px]
          flex-col
          border-r
          border-white/10
          bg-[#0b0b0b]/95
          p-5
          shadow-2xl
          backdrop-blur-2xl
          transition-transform
          duration-300
          ease-out
          lg:hidden
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* DRAWER HEADER */}

        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-amber-400
                text-black
              "
            >
              <Hexagon size={20} />
            </div>

            <div>
              <h1 className="font-semibold tracking-tight text-white">
                HoneyChain
              </h1>

              <p className="text-[11px] text-white/40">
                Hive Intelligence
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-white/10
              text-white/60
              transition
              hover:border-white/20
              hover:text-white
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="mt-10 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(
                  `${item.href}/`
                ));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  transition-all
                  ${
                    active
                      ? "bg-amber-400/10 text-amber-400"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                  }
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SECTION */}

        <div className="mt-auto">
          {/* SETTINGS */}

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              text-white/50
              transition
              hover:bg-white/[0.04]
              hover:text-white
            "
          >
            <Settings
              size={18}
              strokeWidth={1.8}
            />

            <span>Settings</span>
          </Link>

          <div className="mt-3">
            
          </div>

          {/* SYSTEM */}

          <div
            className="
              mt-4
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              p-4
            "
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs text-white/60">
                System operational
              </span>
            </div>

            <p className="mt-2 text-[11px] text-white/30">
              IoT network connected
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}