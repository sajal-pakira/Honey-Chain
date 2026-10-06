"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import MobileNav from "@/components/MobileNav";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronRight,
  Cpu,
  ExternalLink,
  Globe2,
  Hexagon,
  Info,
  Languages,
  Leaf,
  Link2,
  MapPin,
  Package,
  Radio,
  RefreshCw,
  Settings as SettingsIcon,
  ShieldCheck,
  Thermometer,
  UserRound,
  Wifi,
  XCircle,
} from "lucide-react";

import { getHives } from "@/lib/api";

/* ============================================================
   TYPES
============================================================ */

type LanguageKey = "en" | "bn" | "hi";

type SettingsCopy = {
  settings: string;
  preferences: string;
  system: string;
  account: string;
  notifications: string;
  about: string;

  honeyChain: string;
  hiveIntelligence: string;

  dashboard: string;
  hives: string;
  honeyBatches: string;
  supplyChain: string;
  traceability: string;

  language: string;
  languageDescription: string;

  english: string;
  bengali: string;
  hindi: string;

  notificationsTitle: string;
  notificationsDescription: string;

  telemetryAlerts: string;
  telemetryAlertsDescription: string;

  batchUpdates: string;
  batchUpdatesDescription: string;

  systemAlerts: string;
  systemAlertsDescription: string;

  preferencesSaved: string;

  apiStatus: string;
  apiStatusDescription: string;
  connected: string;
  unavailable: string;

  hiveNetwork: string;
  hiveNetworkDescription: string;
  registeredHives: string;
  activeHives: string;
  connectedDevices: string;

  blockchain: string;
  blockchainDescription: string;
  network: string;
  contract: string;
  sepolia: string;
  viewContract: string;

  accountTitle: string;
  accountDescription: string;
  beekeeperConsole: string;
  backendManaged: string;

  application: string;
  version: string;
  platform: string;
  platformValue: string;

  refresh: string;
  refreshing: string;

  operational: string;
  attentionRequired: string;

  celsius: string;
  kilograms: string;

  dataSource: string;
  liveBackendData: string;

  noHives: string;
};

/* ============================================================
   TRANSLATIONS
============================================================ */

const translations: Record<LanguageKey, SettingsCopy> = {
  en: {
    settings: "Settings",
    preferences: "Preferences",
    system: "System",
    account: "Account",
    notifications: "Notifications",
    about: "About",

    honeyChain: "HoneyChain",
    hiveIntelligence: "Hive Intelligence",

    dashboard: "Dashboard",
    hives: "Hives",
    honeyBatches: "Honey Batches",
    supplyChain: "Supply Chain",
    traceability: "Traceability",

    language: "Language",
    languageDescription:
      "Choose the language used across the HoneyChain interface.",

    english: "English",
    bengali: "বাংলা",
    hindi: "हिन्दी",

    notificationsTitle: "Notification preferences",
    notificationsDescription:
      "Choose which browser-side HoneyChain notifications you want enabled.",

    telemetryAlerts: "Telemetry alerts",
    telemetryAlertsDescription:
      "Receive alerts when hive telemetry needs attention.",

    batchUpdates: "Batch updates",
    batchUpdatesDescription:
      "Show notifications for important honey-batch workflow changes.",

    systemAlerts: "System alerts",
    systemAlertsDescription:
      "Show important API, device, or system status alerts.",

    preferencesSaved: "Preference saved",

    apiStatus: "API status",
    apiStatusDescription:
      "Current connection to the HoneyChain backend.",

    connected: "Connected",
    unavailable: "Unavailable",

    hiveNetwork: "Hive network",
    hiveNetworkDescription:
      "Current registered hive and device information.",

    registeredHives: "Registered hives",
    activeHives: "Active hives",
    connectedDevices: "Connected devices",

    blockchain: "Blockchain",
    blockchainDescription:
      "HoneyChain blockchain registry configuration.",

    network: "Network",
    contract: "Contract",
    sepolia: "Ethereum Sepolia",
    viewContract: "View contract",

    accountTitle: "Account & workspace",
    accountDescription:
      "Your beekeeper account and organization information are managed by the HoneyChain backend.",
    beekeeperConsole: "Beekeeper Console",
    backendManaged: "Managed by backend",

    application: "Application",
    version: "Version",
    platform: "Platform",
    platformValue: "Web application",

    refresh: "Refresh status",
    refreshing: "Refreshing...",

    operational: "Operational",
    attentionRequired: "Attention required",

    celsius: "°C",
    kilograms: "kg",

    dataSource: "Data source",
    liveBackendData: "Live backend data",

    noHives: "No registered hives",
  },

  bn: {
    settings: "সেটিংস",
    preferences: "পছন্দ",
    system: "সিস্টেম",
    account: "অ্যাকাউন্ট",
    notifications: "নোটিফিকেশন",
    about: "সম্পর্কে",

    honeyChain: "HoneyChain",
    hiveIntelligence: "হাইভ ইন্টেলিজেন্স",

    dashboard: "ড্যাশবোর্ড",
    hives: "হাইভ",
    honeyBatches: "হানি ব্যাচ",
    supplyChain: "সাপ্লাই চেইন",
    traceability: "ট্রেসেবিলিটি",

    language: "ভাষা",
    languageDescription:
      "HoneyChain ইন্টারফেসে ব্যবহৃত ভাষা নির্বাচন করুন।",

    english: "English",
    bengali: "বাংলা",
    hindi: "हिन्दी",

    notificationsTitle: "নোটিফিকেশন পছন্দ",
    notificationsDescription:
      "HoneyChain-এর কোন ব্রাউজার নোটিফিকেশন চালু থাকবে তা নির্বাচন করুন।",

    telemetryAlerts: "টেলিমেট্রি অ্যালার্ট",
    telemetryAlertsDescription:
      "হাইভের টেলিমেট্রিতে সমস্যা হলে অ্যালার্ট দেখান।",

    batchUpdates: "ব্যাচ আপডেট",
    batchUpdatesDescription:
      "গুরুত্বপূর্ণ হানি ব্যাচ পরিবর্তনের নোটিফিকেশন দেখান।",

    systemAlerts: "সিস্টেম অ্যালার্ট",
    systemAlertsDescription:
      "API, ডিভাইস বা সিস্টেম স্ট্যাটাসের গুরুত্বপূর্ণ অ্যালার্ট দেখান।",

    preferencesSaved: "পছন্দ সংরক্ষিত হয়েছে",

    apiStatus: "API স্ট্যাটাস",
    apiStatusDescription:
      "HoneyChain backend-এর বর্তমান কানেকশন।",

    connected: "কানেক্টেড",
    unavailable: "অনুপলব্ধ",

    hiveNetwork: "হাইভ নেটওয়ার্ক",
    hiveNetworkDescription:
      "বর্তমান রেজিস্টার করা হাইভ এবং ডিভাইসের তথ্য।",

    registeredHives: "রেজিস্টার করা হাইভ",
    activeHives: "অ্যাক্টিভ হাইভ",
    connectedDevices: "কানেক্টেড ডিভাইস",

    blockchain: "ব্লকচেইন",
    blockchainDescription:
      "HoneyChain blockchain registry configuration।",

    network: "নেটওয়ার্ক",
    contract: "কনট্র্যাক্ট",
    sepolia: "Ethereum Sepolia",
    viewContract: "কনট্র্যাক্ট দেখুন",

    accountTitle: "অ্যাকাউন্ট ও ওয়ার্কস্পেস",
    accountDescription:
      "আপনার beekeeper account এবং organization তথ্য HoneyChain backend দ্বারা পরিচালিত হয়।",
    beekeeperConsole: "বীকিপার কনসোল",
    backendManaged: "Backend দ্বারা পরিচালিত",

    application: "অ্যাপ্লিকেশন",
    version: "ভার্সন",
    platform: "প্ল্যাটফর্ম",
    platformValue: "ওয়েব অ্যাপ্লিকেশন",

    refresh: "স্ট্যাটাস রিফ্রেশ",
    refreshing: "রিফ্রেশ হচ্ছে...",

    operational: "অপারেশনাল",
    attentionRequired: "মনোযোগ প্রয়োজন",

    celsius: "°C",
    kilograms: "kg",

    dataSource: "ডেটা সোর্স",
    liveBackendData: "লাইভ backend data",

    noHives: "কোনও রেজিস্টার করা হাইভ নেই",
  },

  hi: {
    settings: "सेटिंग्स",
    preferences: "प्राथमिकताएँ",
    system: "सिस्टम",
    account: "अकाउंट",
    notifications: "नोटिफिकेशन",
    about: "अबाउट",

    honeyChain: "HoneyChain",
    hiveIntelligence: "Hive Intelligence",

    dashboard: "डैशबोर्ड",
    hives: "हाइव्स",
    honeyBatches: "हनी बैच",
    supplyChain: "सप्लाई चेन",
    traceability: "ट्रेसेबिलिटी",

    language: "भाषा",
    languageDescription:
      "HoneyChain इंटरफेस में इस्तेमाल होने वाली भाषा चुनें।",

    english: "English",
    bengali: "বাংলা",
    hindi: "हिन्दी",

    notificationsTitle: "नोटिफिकेशन प्राथमिकताएँ",
    notificationsDescription:
      "चुनें कि HoneyChain के कौन से ब्राउज़र नोटिफिकेशन सक्रिय रहें।",

    telemetryAlerts: "टेलीमेट्री अलर्ट",
    telemetryAlertsDescription:
      "हाइव टेलीमेट्री में समस्या होने पर अलर्ट दिखाएँ।",

    batchUpdates: "बैच अपडेट",
    batchUpdatesDescription:
      "महत्वपूर्ण हनी बैच बदलावों के नोटिफिकेशन दिखाएँ।",

    systemAlerts: "सिस्टम अलर्ट",
    systemAlertsDescription:
      "API, डिवाइस या सिस्टम स्टेटस के महत्वपूर्ण अलर्ट दिखाएँ।",

    preferencesSaved: "प्राथमिकता सेव हो गई",

    apiStatus: "API स्टेटस",
    apiStatusDescription:
      "HoneyChain backend का वर्तमान कनेक्शन।",

    connected: "कनेक्टेड",
    unavailable: "उपलब्ध नहीं",

    hiveNetwork: "हाइव नेटवर्क",
    hiveNetworkDescription:
      "वर्तमान रजिस्टर्ड हाइव और डिवाइस की जानकारी।",

    registeredHives: "रजिस्टर्ड हाइव्स",
    activeHives: "एक्टिव हाइव्स",
    connectedDevices: "कनेक्टेड डिवाइस",

    blockchain: "ब्लॉकचेन",
    blockchainDescription:
      "HoneyChain blockchain registry configuration।",

    network: "नेटवर्क",
    contract: "कॉन्ट्रैक्ट",
    sepolia: "Ethereum Sepolia",
    viewContract: "कॉन्ट्रैक्ट देखें",

    accountTitle: "अकाउंट और वर्कस्पेस",
    accountDescription:
      "आपकी beekeeper account और organization जानकारी HoneyChain backend द्वारा मैनेज की जाती है।",
    beekeeperConsole: "बीकीपर कंसोल",
    backendManaged: "Backend द्वारा मैनेज किया गया",

    application: "एप्लिकेशन",
    version: "वर्जन",
    platform: "प्लेटफॉर्म",
    platformValue: "वेब एप्लिकेशन",

    refresh: "स्टेटस रिफ्रेश",
    refreshing: "रिफ्रेश हो रहा है...",

    operational: "ऑपरेशनल",
    attentionRequired: "ध्यान आवश्यक",

    celsius: "°C",
    kilograms: "kg",

    dataSource: "डेटा सोर्स",
    liveBackendData: "लाइव backend data",

    noHives: "कोई रजिस्टर्ड हाइव नहीं है",
  },
};

/* ============================================================
   CONSTANTS
============================================================ */

const CONTRACT_ADDRESS =
  "0x894C573ff2EccF881CE9db7074e4C7E096889401";

const APP_VERSION = "1.0.0";

/* ============================================================
   HELPERS
============================================================ */

function normalizeLanguage(value: string | undefined): LanguageKey {
  if (value === "bn" || value === "hi") {
    return value;
  }

  return "en";
}

/* ============================================================
   NAV ITEM
============================================================ */

function NavItem({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition ${
        active
          ? "bg-[#F1C75B] text-[#2C261D]"
          : "text-[#665E54] hover:bg-[#F0E9DD] hover:text-[#292621]"
      }`}
    >
      {icon}

      <span>{label}</span>
    </Link>
  );
}

/* ============================================================
   SECTION
============================================================ */

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E4DCCD] bg-[#FFFDF8] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4E6BF] text-[#77591C]">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[#302B25]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm leading-5 text-[#817568]">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

/* ============================================================
   SETTING ROW
============================================================ */

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#ECE4D8] py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[#40382F]">
          {title}
        </h3>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#817568]">
          {description}
        </p>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ============================================================
   TOGGLE
============================================================ */

function Toggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onChange}
      className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${
        enabled ? "bg-[#D5A83D]" : "bg-[#D7D0C5]"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ============================================================
   STATUS PILL
============================================================ */

function StatusPill({
  connected,
  copy,
}: {
  connected: boolean;
  copy: SettingsCopy;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        connected
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          connected ? "bg-emerald-500" : "bg-red-500"
        }`}
      />

      {connected ? copy.connected : copy.unavailable}
    </span>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function SettingsPage() {
  const { language, t } = useLanguage();

  const currentLanguage = normalizeLanguage(language);
  const copy = translations[currentLanguage];

  const [hiveCount, setHiveCount] = useState(0);
  const [activeHiveCount, setActiveHiveCount] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);

  const [apiConnected, setApiConnected] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [telemetryAlerts, setTelemetryAlerts] = useState(true);
  const [batchUpdates, setBatchUpdates] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  const [savedMessage, setSavedMessage] = useState(false);

  /* ----------------------------------------------------------
     LOAD LOCAL PREFERENCES
  ---------------------------------------------------------- */

  useEffect(() => {
    try {
      const savedTelemetry = localStorage.getItem(
        "honeychain.telemetryAlerts"
      );

      const savedBatch = localStorage.getItem(
        "honeychain.batchUpdates"
      );

      const savedSystem = localStorage.getItem(
        "honeychain.systemAlerts"
      );

      if (savedTelemetry !== null) {
        setTelemetryAlerts(savedTelemetry === "true");
      }

      if (savedBatch !== null) {
        setBatchUpdates(savedBatch === "true");
      }

      if (savedSystem !== null) {
        setSystemAlerts(savedSystem === "true");
      }
    } catch {
      // Local storage may be unavailable in restricted browsers.
    }
  }, []);

  /* ----------------------------------------------------------
     LOAD SYSTEM STATUS
  ---------------------------------------------------------- */

  async function loadSystemStatus() {
    try {
      setLoadingStatus(true);

      const hives = await getHives();

      const safeHives = Array.isArray(hives) ? hives : [];

      const active = safeHives.filter(
        (hive) =>
          hive.status?.toLowerCase() === "active"
      );

      const devices = new Set(
        safeHives
          .map((hive) => hive.esp32_device_id)
          .filter(Boolean)
      );

      setHiveCount(safeHives.length);
      setActiveHiveCount(active.length);
      setDeviceCount(devices.size);
      setApiConnected(true);
    } catch (error) {
      console.error(
        "Unable to load HoneyChain system status:",
        error
      );

      setApiConnected(false);
    } finally {
      setLoadingStatus(false);
    }
  }

  useEffect(() => {
    loadSystemStatus();
  }, []);

  /* ----------------------------------------------------------
     PREFERENCES
  ---------------------------------------------------------- */

  function savePreference(
    key: string,
    value: boolean
  ) {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      // Ignore storage errors.
    }

    setSavedMessage(true);

    window.setTimeout(() => {
      setSavedMessage(false);
    }, 1800);
  }

  function updateTelemetryAlerts() {
    const next = !telemetryAlerts;

    setTelemetryAlerts(next);

    savePreference(
      "honeychain.telemetryAlerts",
      next
    );
  }

  function updateBatchUpdates() {
    const next = !batchUpdates;

    setBatchUpdates(next);

    savePreference(
      "honeychain.batchUpdates",
      next
    );
  }

  function updateSystemAlerts() {
    const next = !systemAlerts;

    setSystemAlerts(next);

    savePreference(
      "honeychain.systemAlerts",
      next
    );
  }

  const systemOperational = useMemo(() => {
    return apiConnected && activeHiveCount >= 0;
  }, [apiConnected, activeHiveCount]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#292621]">
      {/* ======================================================
          MOBILE NAV
      ====================================================== */}

      <MobileNav />

      {/* ======================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#E4DCCD] bg-[#FBF8F1] px-5 py-6 lg:flex lg:flex-col">
        {/* Logo */}

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1C75B] text-[#2C261D]">
            <Hexagon size={21} />
          </div>

          <div className="min-w-0">
            <div className="font-semibold tracking-tight">
              {copy.honeyChain}
            </div>

            <div className="text-xs text-[#817568]">
              {copy.hiveIntelligence}
            </div>
          </div>
        </Link>

        {/* Navigation */}

        <nav className="mt-10 space-y-1.5">
          <NavItem
            href="/dashboard"
            label={t("dashboard")}
            icon={<Activity size={18} />}
          />

          <NavItem
            href="/hives"
            label={t("hives")}
            icon={<Hexagon size={18} />}
          />

          <NavItem
            href="/batches"
            label={t("honeyBatches")}
            icon={<Package size={18} />}
          />

          <NavItem
            href="/supply-chain"
            label={t("supplyChain")}
            icon={<Link2 size={18} />}
          />

          <NavItem
            href="/traceability"
            label={t("traceability")}
            icon={<MapPin size={18} />}
          />
        </nav>

        <div className="mt-auto">
          <NavItem
            href="/settings"
            label={copy.settings}
            icon={<SettingsIcon size={18} />}
            active
          />

          <div className="mt-5 rounded-2xl border border-[#E4DCCD] bg-[#F5EFE5] p-4">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  systemOperational
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />

              <span className="text-xs font-medium text-[#51493F]">
                {systemOperational
                  ? copy.operational
                  : copy.attentionRequired}
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-[#817568]">
              {copy.dataSource}: {copy.liveBackendData}
            </p>
          </div>
        </div>
      </aside>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <section className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        {/* Desktop header */}

        <header className="hidden h-16 items-center justify-between border-b border-[#E4DCCD] bg-[#F7F3EA]/95 px-6 backdrop-blur-sm lg:flex">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A4781C]">
              {copy.settings}
            </p>

            <h1 className="mt-0.5 text-lg font-semibold text-[#292621]">
              {copy.preferences}
            </h1>
          </div>

          <LanguageSelector />
        </header>

        {/* Content */}

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {/* Mobile heading */}

          <div className="lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A4781C]">
              {copy.settings}
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#292621]">
              {copy.preferences}
            </h1>
          </div>

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#E4DCCD] bg-[#FFFDF8] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1C75B] text-[#2C261D]">
                <SettingsIcon size={21} />
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[#292621]">
                  {copy.settings}
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-5 text-[#817568]">
                  {copy.hiveIntelligence}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusPill
                connected={apiConnected}
                copy={copy}
              />

              <button
                type="button"
                onClick={loadSystemStatus}
                disabled={loadingStatus}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#DDD3C4] bg-white px-3.5 text-sm font-semibold text-[#51493F] transition hover:bg-[#F8F3EB] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={15}
                  className={
                    loadingStatus
                      ? "animate-spin"
                      : ""
                  }
                />

                <span className="hidden sm:inline">
                  {loadingStatus
                    ? copy.refreshing
                    : copy.refresh}
                </span>
              </button>
            </div>
          </div>

          {/* ==================================================
              SAVED MESSAGE
          ================================================== */}

          {savedMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={16} />

              {copy.preferencesSaved}
            </div>
          )}

          {/* ==================================================
              GRID
          ================================================== */}

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {/* ==================================================
                LANGUAGE
            ================================================== */}

            <SettingsSection
              icon={<Languages size={19} />}
              title={copy.language}
              description={copy.languageDescription}
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div
                  className={`rounded-xl border p-3 ${
                    currentLanguage === "en"
                      ? "border-[#D4A842] bg-[#FFF4D3]"
                      : "border-[#E6DED2] bg-[#FBF8F1]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe2 size={16} />

                    <span className="text-sm font-semibold">
                      {copy.english}
                    </span>
                  </div>

                  {currentLanguage === "en" && (
                    <p className="mt-1 text-[11px] text-[#7A6533]">
                      Active
                    </p>
                  )}
                </div>

                <div
                  className={`rounded-xl border p-3 ${
                    currentLanguage === "bn"
                      ? "border-[#D4A842] bg-[#FFF4D3]"
                      : "border-[#E6DED2] bg-[#FBF8F1]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe2 size={16} />

                    <span className="text-sm font-semibold">
                      {copy.bengali}
                    </span>
                  </div>

                  {currentLanguage === "bn" && (
                    <p className="mt-1 text-[11px] text-[#7A6533]">
                      Active
                    </p>
                  )}
                </div>

                <div
                  className={`rounded-xl border p-3 ${
                    currentLanguage === "hi"
                      ? "border-[#D4A842] bg-[#FFF4D3]"
                      : "border-[#E6DED2] bg-[#FBF8F1]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe2 size={16} />

                    <span className="text-sm font-semibold">
                      {copy.hindi}
                    </span>
                  </div>

                  {currentLanguage === "hi" && (
                    <p className="mt-1 text-[11px] text-[#7A6533]">
                      Active
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#817568]">
                      {copy.language}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#40382F]">
                      {currentLanguage === "en"
                        ? copy.english
                        : currentLanguage === "bn"
                          ? copy.bengali
                          : copy.hindi}
                    </p>
                  </div>

                  <LanguageSelector />
                </div>
              </div>
            </SettingsSection>

            {/* ==================================================
                NOTIFICATIONS
            ================================================== */}

            <SettingsSection
              icon={<Bell size={19} />}
              title={copy.notificationsTitle}
              description={copy.notificationsDescription}
            >
              <div>
                <SettingRow
                  title={copy.telemetryAlerts}
                  description={
                    copy.telemetryAlertsDescription
                  }
                >
                  <Toggle
                    enabled={telemetryAlerts}
                    onChange={updateTelemetryAlerts}
                    label={copy.telemetryAlerts}
                  />
                </SettingRow>

                <SettingRow
                  title={copy.batchUpdates}
                  description={
                    copy.batchUpdatesDescription
                  }
                >
                  <Toggle
                    enabled={batchUpdates}
                    onChange={updateBatchUpdates}
                    label={copy.batchUpdates}
                  />
                </SettingRow>

                <SettingRow
                  title={copy.systemAlerts}
                  description={
                    copy.systemAlertsDescription
                  }
                >
                  <Toggle
                    enabled={systemAlerts}
                    onChange={updateSystemAlerts}
                    label={copy.systemAlerts}
                  />
                </SettingRow>
              </div>
            </SettingsSection>

            {/* ==================================================
                API STATUS
            ================================================== */}

            <SettingsSection
              icon={<Wifi size={19} />}
              title={copy.apiStatus}
              description={copy.apiStatusDescription}
            >
              <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        apiConnected
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {apiConnected ? (
                        <CheckCircle2 size={19} />
                      ) : (
                        <XCircle size={19} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#40382F]">
                        HoneyChain API
                      </p>

                      <p className="mt-1 truncate text-xs text-[#817568]">
                        {apiConnected
                          ? copy.connected
                          : copy.unavailable}
                      </p>
                    </div>
                  </div>

                  <StatusPill
                    connected={apiConnected}
                    copy={copy}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                  <p className="text-xs text-[#817568]">
                    {copy.dataSource}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#40382F]">
                    {copy.liveBackendData}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                  <p className="text-xs text-[#817568]">
                    {copy.platform}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#40382F]">
                    {copy.platformValue}
                  </p>
                </div>
              </div>
            </SettingsSection>

            {/* ==================================================
                HIVE NETWORK
            ================================================== */}

            <SettingsSection
              icon={<Radio size={19} />}
              title={copy.hiveNetwork}
              description={copy.hiveNetworkDescription}
            >
              <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-3">
                <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-4">
                  <div className="flex items-center gap-2 text-[#817568]">
                    <Hexagon size={15} />

                    <span className="text-xs">
                      {copy.registeredHives}
                    </span>
                  </div>

                  <p className="mt-2 text-2xl font-semibold text-[#302B25]">
                    {loadingStatus ? "—" : hiveCount}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-4">
                  <div className="flex items-center gap-2 text-[#817568]">
                    <Activity size={15} />

                    <span className="text-xs">
                      {copy.activeHives}
                    </span>
                  </div>

                  <p className="mt-2 text-2xl font-semibold text-[#302B25]">
                    {loadingStatus
                      ? "—"
                      : activeHiveCount}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-4">
                  <div className="flex items-center gap-2 text-[#817568]">
                    <Cpu size={15} />

                    <span className="text-xs">
                      {copy.connectedDevices}
                    </span>
                  </div>

                  <p className="mt-2 text-2xl font-semibold text-[#302B25]">
                    {loadingStatus ? "—" : deviceCount}
                  </p>
                </div>
              </div>

              {!loadingStatus && hiveCount === 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#E6DED2] bg-[#FBF8F1] px-3.5 py-3 text-xs text-[#817568]">
                  <Info size={15} />

                  {copy.noHives}
                </div>
              )}
            </SettingsSection>

            {/* ==================================================
                BLOCKCHAIN
            ================================================== */}

            <SettingsSection
              icon={<ShieldCheck size={19} />}
              title={copy.blockchain}
              description={copy.blockchainDescription}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEE8DF] text-[#5D554C]">
                      <Globe2 size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-[#817568]">
                        {copy.network}
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-[#40382F]">
                        {copy.sepolia}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    Active
                  </span>
                </div>

                <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                  <p className="text-xs text-[#817568]">
                    {copy.contract}
                  </p>

                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <code className="break-all rounded-lg bg-white px-2.5 py-2 font-mono text-[11px] text-[#5E554A]">
                      {CONTRACT_ADDRESS}
                    </code>

                    <a
                      href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#DCD1C2] bg-white px-3 text-xs font-semibold text-[#51493F] hover:bg-[#F8F3EB]"
                    >
                      {copy.viewContract}

                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* ==================================================
                ACCOUNT
            ================================================== */}

            <SettingsSection
              icon={<UserRound size={19} />}
              title={copy.accountTitle}
              description={copy.accountDescription}
            >
              <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F1C75B] font-semibold text-[#2C261D]">
                    S
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#40382F]">
                      {copy.beekeeperConsole}
                    </p>

                    <p className="mt-1 text-xs text-[#817568]">
                      {copy.backendManaged}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#E3D9CA] bg-white px-3 py-2.5 text-xs text-[#817568]">
                  <ShieldCheck size={14} />

                  {copy.accountDescription}
                </div>
              </div>
            </SettingsSection>

            {/* ==================================================
                ABOUT
            ================================================== */}

            <SettingsSection
              icon={<Info size={19} />}
              title={copy.about}
              description="HoneyChain platform information."
            >
              <div className="divide-y divide-[#E9E0D4] rounded-xl border border-[#E7DED1] bg-[#FBF8F1]">
                <div className="flex items-center justify-between gap-4 p-3.5">
                  <span className="text-sm text-[#817568]">
                    {copy.application}
                  </span>

                  <span className="text-sm font-semibold text-[#40382F]">
                    HoneyChain
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-3.5">
                  <span className="text-sm text-[#817568]">
                    {copy.version}
                  </span>

                  <span className="font-mono text-xs font-semibold text-[#40382F]">
                    v{APP_VERSION}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-3.5">
                  <span className="text-sm text-[#817568]">
                    {copy.platform}
                  </span>

                  <span className="text-sm font-semibold text-[#40382F]">
                    {copy.platformValue}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-3.5">
                  <span className="text-sm text-[#817568]">
                    {copy.network}
                  </span>

                  <span className="text-sm font-semibold text-[#40382F]">
                    {copy.sepolia}
                  </span>
                </div>
              </div>
            </SettingsSection>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="mt-5 flex flex-col gap-2 border-t border-[#E4DCCD] pt-5 text-xs text-[#817568] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Leaf size={14} className="text-[#A4781C]" />

              <span>HoneyChain</span>
            </div>

            <div className="flex items-center gap-3">
              <span>
                {copy.version} {APP_VERSION}
              </span>

              <span>·</span>

              <span>{copy.sepolia}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}