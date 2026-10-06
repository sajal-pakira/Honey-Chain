"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

import {
  Activity,
  ArrowRight,
  Boxes,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { getHealth } from "@/lib/api";
import { Pinyon_Script, Inter } from "next/font/google";

/* -------------------------------------------------------------------------- */
/* FONTS                                                                      */
/* -------------------------------------------------------------------------- */

const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

/* -------------------------------------------------------------------------- */
/* HOME                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    getHealth()
      .then(() => {
        setBackendStatus("Connected");
      })
      .catch(() => {
        setBackendStatus("Offline");
      });
  }, []);

  return (
    <main className="hc-home relative min-h-screen overflow-hidden bg-[#080808] text-white">

      {/* ================================================================== */}
      {/* BACKGROUND                                                         */}
      {/* ================================================================== */}

      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/honey-hero.jpg')",
        }}
      />

      {/* Main image overlay */}
      <div className="hc-hero-overlay pointer-events-none absolute inset-0 bg-black/55" />

      {/* Text readability gradient */}
      <div className="hc-hero-gradient pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15" />

      {/* Bottom fade */}
      <div className="hc-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#080808] to-transparent" />

      {/* ================================================================== */}
      {/* CONTENT                                                            */}
      {/* ================================================================== */}

      <div className="relative z-10">

        {/* ================================================================ */}
        {/* NAVIGATION                                                        */}
        {/* ================================================================ */}

        <nav className="hc-nav border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            {/* ------------------------------------------------------------ */}
            {/* LOGO                                                         */}
            {/* ------------------------------------------------------------ */}

            <div className="flex items-center gap-3">

              <div className="hc-logo-box flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
                <Boxes size={17} />
              </div>

              <span className="hc-nav-text text-sm font-semibold tracking-tight">
                HoneyChain
              </span>

            </div>

            {/* ------------------------------------------------------------ */}
            {/* RIGHT SIDE                                                   */}
            {/* ------------------------------------------------------------ */}

            <div className="flex items-center gap-3">

              {/* API STATUS */}
              <div className="hc-api flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md">

                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    backendStatus === "Connected"
                      ? "bg-emerald-400"
                      : backendStatus === "Offline"
                      ? "bg-red-400"
                      : "bg-yellow-400"
                  }`}
                />

                API {backendStatus}

              </div>

              {/* THEME TOGGLE */}
              <ThemeToggle />

            </div>

          </div>
        </nav>

        {/* ================================================================ */}
        {/* HERO                                                              */}
        {/* ================================================================ */}

        <section className="mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-28">

          <div className="max-w-4xl">

            {/* ------------------------------------------------------------ */}
            {/* BADGE                                                        */}
            {/* ------------------------------------------------------------ */}

            <div className="hc-badge mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md">

              <Sparkles size={13} />

              Transparent honey supply chain

            </div>

            {/* ------------------------------------------------------------ */}
            {/* HERO TITLE                                                   */}
            {/* ------------------------------------------------------------ */}

            <h1 className="leading-[0.92] tracking-[-0.045em]">

              {/* Main title */}
              <span
                className={`hc-hero-main ${inter.className} block text-5xl font-light text-white sm:text-7xl lg:text-8xl`}
              >
                From hive
              </span>

              {/* Script title */}
              <span
                className={`hc-hero-script ${pinyon.className} mt-2 block text-6xl font-normal text-white/80 sm:text-8xl lg:text-[7.5rem]`}
              >
                to blockchain.
              </span>

            </h1>

            {/* ------------------------------------------------------------ */}
            {/* DESCRIPTION                                                  */}
            {/* ------------------------------------------------------------ */}

            <p className="hc-description mt-10 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
              HoneyChain connects real-world hive data,
              honey batches and supply-chain events into
              one verifiable digital trail.
            </p>

            {/* ------------------------------------------------------------ */}
            {/* BUTTONS                                                      */}
            {/* ------------------------------------------------------------ */}

            <div className="mt-9 flex flex-wrap gap-3">

              {/* Dashboard */}
              <a
                href="/dashboard"
                className="hc-primary-button group flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Open Dashboard

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              {/* Hives */}
              <a
                href="/hives"
                className="hc-secondary-button rounded-lg border border-white/15 bg-black/25 px-5 py-3 text-sm text-white/75 backdrop-blur-md transition hover:bg-white/10"
              >
                Explore Hives
              </a>

            </div>

          </div>

        </section>

        {/* ================================================================ */}
        {/* SYSTEM OVERVIEW                                                  */}
        {/* ================================================================ */}

        <section className="hc-features border-y border-white/10 bg-black/25 backdrop-blur-md">

          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            {/* LIVE HIVE DATA */}
            <Feature
              icon={<Activity size={18} />}
              title="Live Hive Data"
              description="Temperature, humidity, weight and acoustic activity."
            />

            {/* BATCH TRACEABILITY */}
            <Feature
              icon={<Boxes size={18} />}
              title="Batch Traceability"
              description="Follow honey from harvest through processing and delivery."
            />

            {/* VERIFIABLE ORIGIN */}
            <Feature
              icon={<ShieldCheck size={18} />}
              title="Verifiable Origin"
              description="Give every honey batch a cryptographically verifiable identity."
            />

          </div>

        </section>

        {/* ================================================================ */}
        {/* FOOTER                                                            */}
        {/* ================================================================ */}

        <footer className="hc-footer mx-auto max-w-7xl px-6 py-10 text-xs text-white/30">
          HoneyChain · IoT × Blockchain × Traceability
        </footer>

      </div>

    </main>
  );
}

/* ========================================================================== */
/* FEATURE COMPONENT                                                          */
/* ========================================================================== */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8">

      {/* ICON */}
      <div className="hc-feature-icon mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70">
        {icon}
      </div>

      {/* TITLE */}
      <h3 className="hc-feature-title text-sm font-medium">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="hc-feature-description mt-2 max-w-xs text-sm leading-6 text-white/40">
        {description}
      </p>

    </div>
  );
}