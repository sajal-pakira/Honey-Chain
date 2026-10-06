"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import MobileNav from "@/components/MobileNav";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Factory,
  Hexagon,
  MapPin,
  PackageCheck,
  QrCode,
  Search,
  ShieldCheck,
  Sprout,
  Truck,
} from "lucide-react";

import {
  getBatches,
  getBatch,
  type BatchDetails,
} from "@/lib/batch-api";

/* ============================================================
   TYPES
============================================================ */

type LanguageKey = "en" | "bn" | "hi";

type TraceabilityCopy = {
  honeyChain: string;
  hiveIntelligence: string;

  dashboard: string;
  hives: string;
  honeyBatches: string;
  supplyChain: string;
  traceability: string;

  traceabilityActive: string;
  blockchainReady: string;

  honeyVerification: string;
  verifyHoney: string;
  verifyDescription: string;

  searchPlaceholder: string;
  searchResults: string;
  batchesFound: string;

  batch: string;
  selectedBatch: string;
  loading: string;
  loadingDetails: string;

  harvestDate: string;
  quantity: string;
  honeyType: string;
  floralSource: string;
  status: string;
  hiveOrigin: string;

  unknown: string;
  notAvailable: string;
  noBatches: string;
  noMatches: string;
  noMatchesDescription: string;

  supplyChainJourney: string;
  journeyDescription: string;

  harvest: string;
  processing: string;
  packaging: string;
  shipment: string;
  delivery: string;

  blockchainProof: string;
  blockchainDescription: string;
  cryptographicProof: string;
  transaction: string;
  verifiedOnChain: string;
  notVerifiedOnChain: string;
  pendingVerification: string;
  viewTransaction: string;

  origin: string;
  hiveCode: string;
  device: string;
  beekeeper: string;
  apiary: string;

  consumerVerification: string;
  consumerDescription: string;
  honeyPassport: string;
  viewPassport: string;
  openBatch: string;

  eventsRecorded: string;
  event: string;
  events: string;

  refresh: string;
  selectBatch: string;
};

/* ============================================================
   TRANSLATIONS
============================================================ */

const pageTranslations: Record<LanguageKey, TraceabilityCopy> = {
  en: {
    honeyChain: "HoneyChain",
    hiveIntelligence: "Hive Intelligence",

    dashboard: "Dashboard",
    hives: "Hives",
    honeyBatches: "Honey Batches",
    supplyChain: "Supply Chain",
    traceability: "Traceability",

    traceabilityActive: "Traceability active",
    blockchainReady: "Blockchain-ready traceability",

    honeyVerification: "Honey verification",
    verifyHoney: "Verify your honey.",
    verifyDescription:
      "Follow a honey batch from its hive origin through every recorded supply-chain event.",

    searchPlaceholder: "Search batch, hive, honey...",
    searchResults: "Search results",
    batchesFound: "batches found",

    batch: "Batch",
    selectedBatch: "Selected batch",
    loading: "Loading traceability data...",
    loadingDetails: "Loading batch details...",

    harvestDate: "Harvest date",
    quantity: "Quantity",
    honeyType: "Honey type",
    floralSource: "Floral source",
    status: "Status",
    hiveOrigin: "Hive origin",

    unknown: "Unknown",
    notAvailable: "Not available",
    noBatches: "No honey batches available.",
    noMatches: "No matching batches.",
    noMatchesDescription:
      "Try another batch code, hive, honey type, floral source, or status.",

    supplyChainJourney: "Supply-chain journey",
    journeyDescription:
      "Recorded progression of this honey batch from harvest to delivery.",

    harvest: "Harvest",
    processing: "Processing",
    packaging: "Packaging",
    shipment: "Shipment",
    delivery: "Delivery",

    blockchainProof: "Blockchain proof",
    blockchainDescription:
      "Cryptographic proof associated with this batch and its blockchain registration.",
    cryptographicProof: "Cryptographic proof",
    transaction: "Transaction",
    verifiedOnChain: "Recorded on Ethereum Sepolia",
    notVerifiedOnChain: "Blockchain transaction unavailable",
    pendingVerification: "Verification pending",
    viewTransaction: "View transaction",

    origin: "Origin",
    hiveCode: "Hive code",
    device: "Device",
    beekeeper: "Beekeeper",
    apiary: "Apiary",

    consumerVerification: "Consumer verification",
    consumerDescription:
      "Open the public Honey Passport to verify this batch's origin and traceability.",
    honeyPassport: "Honey Passport",
    viewPassport: "View passport",
    openBatch: "Open batch",

    eventsRecorded: "Events recorded",
    event: "event",
    events: "events",

    refresh: "Refresh",
    selectBatch: "Select a batch",
  },

  bn: {
    honeyChain: "HoneyChain",
    hiveIntelligence: "হাইভ ইন্টেলিজেন্স",

    dashboard: "ড্যাশবোর্ড",
    hives: "হাইভ",
    honeyBatches: "হানি ব্যাচ",
    supplyChain: "সাপ্লাই চেইন",
    traceability: "ট্রেসেবিলিটি",

    traceabilityActive: "ট্রেসেবিলিটি সক্রিয়",
    blockchainReady: "ব্লকচেইন-রেডি ট্রেসেবিলিটি",

    honeyVerification: "মধু যাচাইকরণ",
    verifyHoney: "আপনার মধু যাচাই করুন।",
    verifyDescription:
      "হাইভের উৎস থেকে রেকর্ড করা প্রতিটি সাপ্লাই-চেইন ইভেন্ট পর্যন্ত একটি মধুর ব্যাচ অনুসরণ করুন।",

    searchPlaceholder: "ব্যাচ, হাইভ, মধু খুঁজুন...",
    searchResults: "সার্চ রেজাল্ট",
    batchesFound: "টি ব্যাচ পাওয়া গেছে",

    batch: "ব্যাচ",
    selectedBatch: "নির্বাচিত ব্যাচ",
    loading: "ট্রেসেবিলিটি ডেটা লোড হচ্ছে...",
    loadingDetails: "ব্যাচের বিস্তারিত লোড হচ্ছে...",

    harvestDate: "হার্ভেস্টের তারিখ",
    quantity: "পরিমাণ",
    honeyType: "মধুর ধরন",
    floralSource: "ফ্লোরাল সোর্স",
    status: "স্ট্যাটাস",
    hiveOrigin: "হাইভের উৎস",

    unknown: "অজানা",
    notAvailable: "পাওয়া যায়নি",
    noBatches: "কোনও হানি ব্যাচ পাওয়া যায়নি।",
    noMatches: "কোনও মিল পাওয়া যায়নি।",
    noMatchesDescription:
      "অন্য ব্যাচ কোড, হাইভ, মধুর ধরন, ফুলের উৎস বা স্ট্যাটাস চেষ্টা করুন।",

    supplyChainJourney: "সাপ্লাই-চেইন যাত্রা",
    journeyDescription:
      "হার্ভেস্ট থেকে ডেলিভারি পর্যন্ত এই মধুর ব্যাচের রেকর্ড করা অগ্রগতি।",

    harvest: "হার্ভেস্ট",
    processing: "প্রসেসিং",
    packaging: "প্যাকেজিং",
    shipment: "শিপমেন্ট",
    delivery: "ডেলিভারি",

    blockchainProof: "ব্লকচেইন প্রুফ",
    blockchainDescription:
      "এই ব্যাচ এবং এর ব্লকচেইন রেজিস্ট্রেশনের সাথে যুক্ত ক্রিপ্টোগ্রাফিক প্রুফ।",
    cryptographicProof: "ক্রিপ্টোগ্রাফিক প্রুফ",
    transaction: "ট্রানজ্যাকশন",
    verifiedOnChain: "Ethereum Sepolia-তে রেকর্ড করা",
    notVerifiedOnChain: "ব্লকচেইন ট্রানজ্যাকশন পাওয়া যায়নি",
    pendingVerification: "ভেরিফিকেশন চলছে",
    viewTransaction: "ট্রানজ্যাকশন দেখুন",

    origin: "উৎস",
    hiveCode: "হাইভ কোড",
    device: "ডিভাইস",
    beekeeper: "বীকিপার",
    apiary: "এপিয়ারি",

    consumerVerification: "কনজিউমার ভেরিফিকেশন",
    consumerDescription:
      "এই ব্যাচের উৎস এবং ট্রেসেবিলিটি যাচাই করতে পাবলিক Honey Passport খুলুন।",
    honeyPassport: "Honey Passport",
    viewPassport: "পাসপোর্ট দেখুন",
    openBatch: "ব্যাচ খুলুন",

    eventsRecorded: "রেকর্ড করা ইভেন্ট",
    event: "ইভেন্ট",
    events: "ইভেন্ট",

    refresh: "রিফ্রেশ",
    selectBatch: "একটি ব্যাচ নির্বাচন করুন",
  },

  hi: {
    honeyChain: "HoneyChain",
    hiveIntelligence: "Hive Intelligence",

    dashboard: "डैशबोर्ड",
    hives: "हाइव्स",
    honeyBatches: "हनी बैच",
    supplyChain: "सप्लाई चेन",
    traceability: "ट्रेसेबिलिटी",

    traceabilityActive: "ट्रेसेबिलिटी सक्रिय",
    blockchainReady: "ब्लॉकचेन-रेडी ट्रेसेबिलिटी",

    honeyVerification: "हनी वेरिफिकेशन",
    verifyHoney: "अपने शहद को सत्यापित करें।",
    verifyDescription:
      "हाइव के स्रोत से लेकर रिकॉर्ड किए गए हर सप्लाई-चेन इवेंट तक हनी बैच को ट्रैक करें।",

    searchPlaceholder: "बैच, हाइव, शहद खोजें...",
    searchResults: "सर्च रिजल्ट",
    batchesFound: "बैच मिले",

    batch: "बैच",
    selectedBatch: "चयनित बैच",
    loading: "ट्रेसेबिलिटी डेटा लोड हो रहा है...",
    loadingDetails: "बैच विवरण लोड हो रहा है...",

    harvestDate: "हार्वेस्ट तारीख",
    quantity: "मात्रा",
    honeyType: "शहद का प्रकार",
    floralSource: "फ्लोरल सोर्स",
    status: "स्टेटस",
    hiveOrigin: "हाइव स्रोत",

    unknown: "अज्ञात",
    notAvailable: "उपलब्ध नहीं",
    noBatches: "कोई हनी बैच उपलब्ध नहीं है।",
    noMatches: "कोई मैच नहीं मिला।",
    noMatchesDescription:
      "दूसरा बैच कोड, हाइव, शहद प्रकार, फ्लोरल सोर्स या स्टेटस आज़माएँ।",

    supplyChainJourney: "सप्लाई-चेन यात्रा",
    journeyDescription:
      "हार्वेस्ट से डिलीवरी तक इस हनी बैच की रिकॉर्ड की गई प्रगति।",

    harvest: "हार्वेस्ट",
    processing: "प्रोसेसिंग",
    packaging: "पैकेजिंग",
    shipment: "शिपमेंट",
    delivery: "डिलीवरी",

    blockchainProof: "ब्लॉकचेन प्रूफ",
    blockchainDescription:
      "इस बैच और इसके ब्लॉकचेन रजिस्ट्रेशन से जुड़ा क्रिप्टोग्राफिक प्रूफ।",
    cryptographicProof: "क्रिप्टोग्राफिक प्रूफ",
    transaction: "ट्रांजैक्शन",
    verifiedOnChain: "Ethereum Sepolia पर रिकॉर्ड किया गया",
    notVerifiedOnChain: "ब्लॉकचेन ट्रांजैक्शन उपलब्ध नहीं",
    pendingVerification: "वेरिफिकेशन लंबित",
    viewTransaction: "ट्रांजैक्शन देखें",

    origin: "स्रोत",
    hiveCode: "हाइव कोड",
    device: "डिवाइस",
    beekeeper: "बीकीपर",
    apiary: "एपियरी",

    consumerVerification: "कंज्यूमर वेरिफिकेशन",
    consumerDescription:
      "इस बैच के स्रोत और ट्रेसेबिलिटी को सत्यापित करने के लिए सार्वजनिक Honey Passport खोलें।",
    honeyPassport: "Honey Passport",
    viewPassport: "पासपोर्ट देखें",
    openBatch: "बैच खोलें",

    eventsRecorded: "रिकॉर्ड किए गए इवेंट",
    event: "इवेंट",
    events: "इवेंट",

    refresh: "रिफ्रेश",
    selectBatch: "एक बैच चुनें",
  },
};

/* ============================================================
   JOURNEY
============================================================ */

const journeySteps = [
  {
    key: "harvest",
    icon: Sprout,
  },
  {
    key: "processing",
    icon: Factory,
  },
  {
    key: "packaging",
    icon: PackageCheck,
  },
  {
    key: "shipment",
    icon: Truck,
  },
  {
    key: "delivery",
    icon: MapPin,
  },
] as const;

/* ============================================================
   HELPERS
============================================================ */

function normalizeLanguage(value: string | undefined): LanguageKey {
  if (value === "bn" || value === "hi") {
    return value;
  }

  return "en";
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusIndex(status?: string | null): number {
  const normalized = status?.toLowerCase();

  if (!normalized) {
    return 0;
  }

  const index = journeySteps.findIndex(
    (step) => step.key === normalized
  );

  if (index >= 0) {
    return index;
  }

  if (normalized === "harvested") {
    return 0;
  }

  if (normalized === "packaged") {
    return 2;
  }

  if (normalized === "shipped") {
    return 3;
  }

  if (normalized === "delivered" || normalized === "verified") {
    return 4;
  }

  return 0;
}

function getStepLabel(
  key: string,
  copy: TraceabilityCopy
): string {
  switch (key) {
    case "harvest":
      return copy.harvest;
    case "processing":
      return copy.processing;
    case "packaging":
      return copy.packaging;
    case "shipment":
      return copy.shipment;
    case "delivery":
      return copy.delivery;
    default:
      return key;
  }
}

function getStatusLabel(
  status: string | null | undefined,
  copy: TraceabilityCopy
): string {
  if (!status) {
    return copy.unknown;
  }

  switch (status.toLowerCase()) {
    case "harvest":
    case "harvested":
      return copy.harvest;

    case "processing":
      return copy.processing;

    case "packaging":
    case "packaged":
      return copy.packaging;

    case "shipment":
    case "shipped":
      return copy.shipment;

    case "delivery":
    case "delivered":
      return copy.delivery;

    case "verified":
      return "Verified";

    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function NavLink({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition ${
        active
          ? "bg-[#F1C75B] text-[#2C261D]"
          : "text-[#665E54] hover:bg-[#F0E9DD] hover:text-[#292621]"
      }`}
    >
      {label}
    </Link>
  );
}

function InfoItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#817568]">
        {label}
      </p>

      <p
        className={`mt-1.5 break-words text-sm font-medium text-[#302B25] ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#E4DCCD] bg-[#FFFDF8] p-5">
      <div className="h-4 w-28 rounded bg-[#E8E0D2]" />
      <div className="mt-4 h-7 w-40 rounded bg-[#E8E0D2]" />
      <div className="mt-3 h-3 w-full rounded bg-[#EEE7DC]" />
      <div className="mt-2 h-3 w-2/3 rounded bg-[#EEE7DC]" />
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function TraceabilityPage() {
  const { language } = useLanguage();

  const currentLanguage = normalizeLanguage(language);
  const copy = pageTranslations[currentLanguage];

  const [batches, setBatches] = useState<BatchDetails[]>([]);
  const [selectedBatch, setSelectedBatch] =
    useState<BatchDetails | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  /* ----------------------------------------------------------
     LOAD BATCHES
  ---------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const data = await getBatches();

        if (cancelled) {
          return;
        }

        const safeBatches = Array.isArray(data) ? data : [];

        setBatches(safeBatches);

        if (safeBatches.length > 0) {
          await loadBatchDetails(
            safeBatches[0].id,
            cancelled
          );
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load traceability data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ----------------------------------------------------------
     LOAD SINGLE BATCH
  ---------------------------------------------------------- */

  async function loadBatchDetails(
    batchId: string,
    cancelled = false
  ) {
    if (!batchId) {
      return;
    }

    try {
      setLoadingDetails(true);
      setError("");

      const data = await getBatch(batchId);

      if (!cancelled) {
        setSelectedBatch(data);
      }
    } catch (err) {
      console.error(err);

      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load batch details."
        );
      }
    } finally {
      if (!cancelled) {
        setLoadingDetails(false);
      }
    }
  }

  async function handleSelectBatch(batchId: string) {
    await loadBatchDetails(batchId);
  }

  /* ----------------------------------------------------------
     SEARCH
  ---------------------------------------------------------- */

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return batches;
    }

    return batches.filter((batch) => {
      return (
        batch.batch_code
          ?.toLowerCase()
          .includes(query) ||
        batch.honey_type
          ?.toLowerCase()
          .includes(query) ||
        batch.floral_source
          ?.toLowerCase()
          .includes(query) ||
        batch.hive?.hive_code
          ?.toLowerCase()
          .includes(query) ||
        batch.status
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [batches, search]);

  const currentStep = selectedBatch
    ? getStatusIndex(selectedBatch.status)
    : 0;

  const eventCount = Array.isArray(selectedBatch?.events)
    ? selectedBatch.events.length
    : 0;

  const transactionHash =
    selectedBatch?.blockchain_tx_hash ?? "";

  const blockchainHash =
    selectedBatch?.blockchain_hash ?? "";

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#292621]">
      <MobileNav />

      {/* ======================================================
          DESKTOP NAV
      ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#E4DCCD] bg-[#FBF8F1] px-5 py-6 lg:flex lg:flex-col">
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

        <nav className="mt-10 space-y-1.5">
          <NavLink
            href="/dashboard"
            label={copy.dashboard}
          />

          <NavLink
            href="/hives"
            label={copy.hives}
          />

          <NavLink
            href="/batches"
            label={copy.honeyBatches}
          />

          <NavLink
            href="/supply-chain"
            label={copy.supplyChain}
          />

          <NavLink
            href="/traceability"
            label={copy.traceability}
            active
          />
        </nav>

        <div className="mt-auto">
          <div className="rounded-2xl border border-[#E4DCCD] bg-[#F5EFE5] p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-[#51493F]">
                {copy.traceabilityActive}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#817568]">
              {copy.blockchainReady}
            </p>
          </div>
        </div>
      </aside>

      {/* ======================================================
          DESKTOP HEADER
      ====================================================== */}

      <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-[#E4DCCD] bg-[#F7F3EA]/95 px-6 backdrop-blur-sm lg:flex lg:ml-64">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A4781C]">
            {copy.traceability}
          </p>

          <h1 className="mt-0.5 text-lg font-semibold text-[#292621]">
            {copy.honeyVerification}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />

          <div className="flex items-center gap-2 rounded-full border border-[#E4DCCD] bg-[#FFFDF8] px-3 py-1.5">
            <ShieldCheck
              size={15}
              className="text-[#A4781C]"
            />

            <span className="text-xs font-medium text-[#61584D]">
              {copy.traceabilityActive}
            </span>
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <section className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {/* Page heading */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A4781C]">
                {copy.traceability}
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#292621] sm:text-4xl">
                {copy.verifyHoney}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F665B]">
                {copy.verifyDescription}
              </p>
            </div>

            {/* Search */}

            <div className="relative w-full lg:w-80">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8174]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchPlaceholder}
                className="h-12 w-full rounded-xl border border-[#DED4C5] bg-[#FFFDF8] pl-11 pr-4 text-sm text-[#292621] outline-none transition placeholder:text-[#9A9084] focus:border-[#C69A3B] focus:ring-2 focus:ring-[#C69A3B]/15"
              />
            </div>
          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  if (selectedBatch?.id) {
                    handleSelectBatch(selectedBatch.id);
                  }
                }}
                className="min-h-10 shrink-0 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                {copy.refresh}
              </button>
            </div>
          )}

          {/* ==================================================
              BATCH SELECTOR
          ================================================== */}

          <section className="mt-6 rounded-2xl border border-[#E4DCCD] bg-[#FFFDF8] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#302B25]">
                  {copy.searchResults}
                </h3>

                <p className="mt-1 text-xs text-[#817568]">
                  {filteredBatches.length} {copy.batchesFound}
                </p>
              </div>

              <div className="text-xs text-[#817568]">
                {selectedBatch
                  ? `${copy.selectedBatch}: ${selectedBatch.batch_code}`
                  : copy.selectBatch}
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {loading ? (
                <>
                  <div className="h-11 w-36 shrink-0 animate-pulse rounded-xl bg-[#EEE7DC]" />
                  <div className="h-11 w-36 shrink-0 animate-pulse rounded-xl bg-[#EEE7DC]" />
                  <div className="h-11 w-36 shrink-0 animate-pulse rounded-xl bg-[#EEE7DC]" />
                </>
              ) : filteredBatches.length === 0 ? (
                <div className="w-full rounded-xl border border-dashed border-[#DCCFBE] bg-[#FAF6EE] px-4 py-5">
                  <p className="text-sm font-semibold text-[#51493F]">
                    {copy.noMatches}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#817568]">
                    {copy.noMatchesDescription}
                  </p>
                </div>
              ) : (
                filteredBatches.map((batch) => {
                  const active =
                    selectedBatch?.id === batch.id;

                  return (
                    <button
                      key={batch.id}
                      type="button"
                      onClick={() =>
                        handleSelectBatch(batch.id)
                      }
                      className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 transition ${
                        active
                          ? "border-[#D2A43E] bg-[#FFF3CC] text-[#3D321D]"
                          : "border-[#E3D9CA] bg-[#FBF8F1] text-[#5E554A] hover:border-[#D2C3AF] hover:bg-[#F7F0E4]"
                      }`}
                    >
                      <span className="text-sm font-semibold">
                        {batch.batch_code}
                      </span>

                      {batch.status && (
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium">
                          {getStatusLabel(
                            batch.status,
                            copy
                          )}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* ==================================================
              SELECTED BATCH
          ================================================== */}

          {loadingDetails && !selectedBatch ? (
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <LoadingCard />
              </div>

              <LoadingCard />
            </div>
          ) : !selectedBatch ? (
            <section className="mt-6 rounded-2xl border border-dashed border-[#DCCFBE] bg-[#FFFDF8] p-8 text-center">
              <Hexagon
                size={32}
                className="mx-auto text-[#A88B58]"
              />

              <h3 className="mt-4 text-base font-semibold text-[#302B25]">
                {copy.noBatches}
              </h3>
            </section>
          ) : (
            <>
              {/* ==================================================
                  BATCH HERO
              ================================================== */}

              <section className="mt-6 rounded-2xl border border-[#E2D7C8] bg-[#FFFDF8] p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#F7E8B8] px-2.5 py-1 text-xs font-semibold text-[#6C5219]">
                        {copy.batch}
                      </span>

                      <span className="rounded-full border border-[#D9CCBA] bg-[#FAF6EE] px-2.5 py-1 text-xs font-medium text-[#665C50]">
                        {getStatusLabel(
                          selectedBatch.status,
                          copy
                        )}
                      </span>
                    </div>

                    <h3 className="mt-3 break-all text-2xl font-semibold tracking-tight text-[#292621] sm:text-3xl">
                      {selectedBatch.batch_code}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71675B]">
                      {selectedBatch.honey_type ||
                        copy.notAvailable}
                      {selectedBatch.floral_source
                        ? ` · ${selectedBatch.floral_source}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/batches/${selectedBatch.id}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#DCD1C2] bg-white px-4 text-sm font-semibold text-[#40382F] hover:bg-[#F8F3EB]"
                    >
                      {copy.openBatch}

                      <ArrowRight size={15} />
                    </Link>

                    <Link
                      href={`/trace/${selectedBatch.id}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2F2921] px-4 text-sm font-semibold text-white hover:bg-[#443A2E]"
                    >
                      <QrCode size={15} />

                      {copy.viewPassport}
                    </Link>
                  </div>
                </div>

                {/* Metrics */}

                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                    <InfoItem
                      label={copy.harvestDate}
                      value={formatDate(
                        selectedBatch.harvest_date
                      )}
                    />
                  </div>

                  <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                    <InfoItem
                      label={copy.quantity}
                      value={
                        selectedBatch.harvested_weight_kg !=
                        null
                          ? `${selectedBatch.harvested_weight_kg} kg`
                          : "—"
                      }
                    />
                  </div>

                  <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                    <InfoItem
                      label={copy.honeyType}
                      value={
                        selectedBatch.honey_type ||
                        copy.notAvailable
                      }
                    />
                  </div>

                  <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                    <InfoItem
                      label={copy.floralSource}
                      value={
                        selectedBatch.floral_source ||
                        copy.notAvailable
                      }
                    />
                  </div>
                </div>
              </section>

              {/* ==================================================
                  MAIN GRID
              ================================================== */}

              <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
                {/* LEFT / MAIN */}

                <div className="space-y-5 xl:col-span-2">
                  {/* ==================================================
                      JOURNEY
                  ================================================== */}

                  <section className="rounded-2xl border border-[#E4DCCD] bg-[#FFFDF8] p-5">
                    <div>
                      <h3 className="text-base font-semibold text-[#302B25]">
                        {copy.supplyChainJourney}
                      </h3>

                      <p className="mt-1 text-sm text-[#817568]">
                        {copy.journeyDescription}
                      </p>
                    </div>

                    <div className="mt-6">
                      <div className="grid grid-cols-5 gap-1">
                        {journeySteps.map(
                          (step, index) => {
                            const Icon = step.icon;
                            const completed =
                              index <= currentStep;
                            const current =
                              index === currentStep;

                            return (
                              <div
                                key={step.key}
                                className="relative flex min-w-0 flex-col items-center"
                              >
                                {index > 0 && (
                                  <div
                                    className={`absolute right-1/2 top-5 -z-0 h-0.5 w-full ${
                                      index <= currentStep
                                        ? "bg-[#D3A63F]"
                                        : "bg-[#E2D9CC]"
                                    }`}
                                  />
                                )}

                                <div
                                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border ${
                                    completed
                                      ? "border-[#D3A63F] bg-[#F5D878] text-[#4C3B18]"
                                      : "border-[#DED4C7] bg-[#F5F0E8] text-[#938879]"
                                  } ${
                                    current
                                      ? "ring-4 ring-[#F3E5BC]"
                                      : ""
                                  }`}
                                >
                                  {completed ? (
                                    <CheckCircle2
                                      size={18}
                                    />
                                  ) : (
                                    <Icon size={17} />
                                  )}
                                </div>

                                <span
                                  className={`mt-2 text-center text-[11px] font-semibold leading-4 sm:text-xs ${
                                    completed
                                      ? "text-[#51452F]"
                                      : "text-[#8B8073]"
                                  }`}
                                >
                                  {getStepLabel(
                                    step.key,
                                    copy
                                  )}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Event list */}

                    {eventCount > 0 && (
                      <div className="mt-7 border-t border-[#E9E0D4] pt-5">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-[#40382F]">
                            {copy.eventsRecorded}
                          </h4>

                          <span className="text-xs text-[#817568]">
                            {eventCount}{" "}
                            {eventCount === 1
                              ? copy.event
                              : copy.events}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {selectedBatch.events
                            .slice(0, 8)
                            .map((event) => (
                              <div
                                key={event.id}
                                className="flex gap-3 rounded-xl border border-[#E9E0D4] bg-[#FBF8F1] p-3"
                              >
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3E7C8] text-[#8B691E]">
                                  <Clock3 size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm font-semibold capitalize text-[#40382F]">
                                      {event.event_type ||
                                        copy.event}
                                    </p>

                                    <span className="text-xs text-[#8A7E71]">
                                      {formatDate(
                                        event.created_at
                                      )}
                                    </span>
                                  </div>

                                  {event.location_name && (
                                    <p className="mt-1 text-xs text-[#817568]">
                                      {event.location_name}
                                    </p>
                                  )}

                                  {event.notes && (
                                    <p className="mt-1 text-xs leading-5 text-[#6F665B]">
                                      {event.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* ==================================================
                      BLOCKCHAIN
                  ================================================== */}

                  <section className="rounded-2xl border border-[#E4DCCD] bg-[#FFFDF8] p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEE8DF] text-[#5D554C]">
                        <ShieldCheck size={20} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-[#302B25]">
                          {copy.blockchainProof}
                        </h3>

                        <p className="mt-1 text-sm leading-5 text-[#817568]">
                          {copy.blockchainDescription}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3">
                      <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                        <InfoItem
                          label={copy.cryptographicProof}
                          value={
                            blockchainHash ||
                            copy.notAvailable
                          }
                          mono
                        />
                      </div>

                      <div className="rounded-xl border border-[#E7DED1] bg-[#FBF8F1] p-3.5">
                        <InfoItem
                          label={copy.transaction}
                          value={
                            transactionHash ||
                            copy.notAvailable
                          }
                          mono
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#DDE8DD] bg-[#F3F8F2] p-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2
                          size={17}
                          className="shrink-0 text-emerald-600"
                        />

                        <span className="text-sm font-semibold text-[#405440]">
                          {transactionHash
                            ? copy.verifiedOnChain
                            : copy.notVerifiedOnChain}
                        </span>
                      </div>

                      {transactionHash && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#CFE0CF] bg-white px-3 text-xs font-semibold text-[#486348] hover:bg-[#F7FBF6]"
                        >
                          {copy.viewTransaction}

                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </section>
                </div>

                {/* RIGHT */}

                <div className="space-y-5">
                  {/* ==================================================
                      ORIGIN
                  ================================================== */}

                  <section className="rounded-2xl border border-[#E4DCCD] bg-[#FFFDF8] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E5B7] text-[#785A18]">
                        <Sprout size={19} />
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-[#302B25]">
                          {copy.origin}
                        </h3>

                        <p className="mt-0.5 text-xs text-[#817568]">
                          {copy.hiveOrigin}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      <InfoItem
                        label={copy.hiveCode}
                        value={
                          selectedBatch.hive?.hive_code ||
                          copy.notAvailable
                        }
                      />

                      <InfoItem
                        label={copy.device}
                        value={
                          selectedBatch.hive
                            ?.esp32_device_id ||
                          copy.notAvailable
                        }
                      />

                      <InfoItem
                        label={copy.apiary}
                        value={
                          selectedBatch.hive?.apiary_id ||
                          copy.notAvailable
                        }
                        mono
                      />

                      <InfoItem
                        label={copy.beekeeper}
                        value={
                          selectedBatch.beekeeper?.name ||
                          copy.notAvailable
                        }
                      />

                      {selectedBatch.beekeeper
                        ?.organization && (
                        <InfoItem
                          label="Organization"
                          value={
                            selectedBatch.beekeeper
                              .organization
                          }
                        />
                      )}
                    </div>
                  </section>

                  {/* ==================================================
                      CONSUMER VERIFICATION
                  ================================================== */}

                  <section className="rounded-2xl border border-[#DCCFAD] bg-[#FBF5E4] p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1D47E] text-[#604A18]">
                        <QrCode size={20} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-[#3E341F]">
                          {copy.consumerVerification}
                        </h3>

                        <p className="mt-1 text-sm leading-5 text-[#756544]">
                          {copy.consumerDescription}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-[#E5D8B7] bg-[#FFFDF8] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8B723D]">
                        {copy.honeyPassport}
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold text-[#40382F]">
                        {selectedBatch.batch_code}
                      </p>

                      <Link
                        href={`/trace/${selectedBatch.id}`}
                        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F2921] px-4 text-sm font-semibold text-white hover:bg-[#443A2E]"
                      >
                        {copy.viewPassport}

                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}