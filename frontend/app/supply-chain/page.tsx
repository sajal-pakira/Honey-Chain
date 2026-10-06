"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Factory,
  Hash,
  Hexagon,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Sprout,
  Truck,
  WalletCards,
  X,
} from "lucide-react";

import { BatchDetails, getBatch, getBatches } from "@/lib/batch-api";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

/* ================================================================
   TYPES
================================================================ */

type LanguageKey = "en" | "bn" | "hi";

type TranslationSet = {
  supplyChain: string;
  title: string;
  description: string;

  back: string;
  search: string;
  clearSearch: string;

  trackedBatches: string;
  recordedEvents: string;
  currentStatus: string;

  honeyBatches: string;
  selectBatch: string;
  noBatches: string;
  noBatchesText: string;
  selectHoneyBatch: string;
  selectHoneyBatchText: string;

  batch: string;
  honey: string;
  hive: string;
  quantity: string;
  harvest: string;
  harvestDate: string;
  floralSource: string;
  originHive: string;

  journey: string;
  lifecycle: string;
  event: string;
  events: string;

  immutableHistory: string;
  noEvents: string;

  blockchainProof: string;
  cryptographicIdentity: string;
  proofGenerated: string;
  noProof: string;
  chainTransaction: string;

  hiveOrigin: string;
  sourceOfBatch: string;
  device: string;
  batchQuantity: string;

  consumerVerification: string;
  publicPassport: string;
  openVerification: string;

  details: string;
  current: string;
  pending: string;
  completed: string;

  location: string;
  actor: string;
  notes: string;

  status: {
    harvested: string;
    processing: string;
    packaged: string;
    shipped: string;
    delivered: string;
  };

  steps: {
    harvest: string;
    processing: string;
    packaging: string;
    shipment: string;
    delivery: string;
  };
};

const steps = [
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
    icon: Package,
  },
  {
    key: "shipment",
    icon: Truck,
  },
  {
    key: "delivery",
    icon: CheckCircle2,
  },
] as const;

const statusOrder = [
  "harvested",
  "processing",
  "packaged",
  "shipped",
  "delivered",
];

/* ================================================================
   TRANSLATIONS
================================================================ */

const translations: Record<LanguageKey, TranslationSet> = {
  en: {
    supplyChain: "Supply chain",
    title: "From hive to consumer.",
    description:
      "Follow every recorded movement of your honey batches across the supply chain.",

    back: "Dashboard",
    search: "Search batch, hive or honey type...",
    clearSearch: "Clear search",

    trackedBatches: "Tracked batches",
    recordedEvents: "Recorded events",
    currentStatus: "Current status",

    honeyBatches: "Honey batches",
    selectBatch: "Select a batch to inspect",
    noBatches: "No batches found",
    noBatchesText: "Try a different search.",
    selectHoneyBatch: "Select a honey batch",
    selectHoneyBatchText:
      "Choose a batch to view its supply-chain journey.",

    batch: "Batch",
    honey: "Honey",
    hive: "Hive",
    quantity: "Quantity",
    harvest: "Harvest",
    harvestDate: "Harvest date",
    floralSource: "Floral source",
    originHive: "Origin hive",

    journey: "Supply-chain journey",
    lifecycle: "Recorded lifecycle of",
    event: "event",
    events: "events",

    immutableHistory: "Supply-chain event history",
    noEvents: "No events recorded yet",

    blockchainProof: "Blockchain proof",
    cryptographicIdentity: "Cryptographic batch identity",
    proofGenerated: "SHA-256 proof generated",
    noProof: "No proof generated",
    chainTransaction: "Chain transaction",

    hiveOrigin: "Hive origin",
    sourceOfBatch: "Source of this batch",
    device: "Device",
    batchQuantity: "Batch quantity",

    consumerVerification: "Consumer verification",
    publicPassport: "Public Honey Passport available",
    openVerification: "Open verification",

    details: "Details",
    current: "Current",
    pending: "Pending",
    completed: "Completed",

    location: "Location",
    actor: "Actor",
    notes: "Notes",

    status: {
      harvested: "Harvested",
      processing: "Processing",
      packaged: "Packaged",
      shipped: "Shipped",
      delivered: "Delivered",
    },

    steps: {
      harvest: "Harvest",
      processing: "Processing",
      packaging: "Packaging",
      shipment: "Shipment",
      delivery: "Delivery",
    },
  },

  bn: {
    supplyChain: "সাপ্লাই চেইন",
    title: "হাইভ থেকে ভোক্তার কাছে।",
    description:
      "সাপ্লাই চেইনে আপনার মধুর প্রতিটি রেকর্ড করা গতিবিধি অনুসরণ করুন।",

    back: "ড্যাশবোর্ড",
    search: "ব্যাচ, হাইভ বা মধুর ধরন খুঁজুন...",
    clearSearch: "সার্চ মুছুন",

    trackedBatches: "ট্র্যাক করা ব্যাচ",
    recordedEvents: "রেকর্ড করা ইভেন্ট",
    currentStatus: "বর্তমান স্ট্যাটাস",

    honeyBatches: "মধুর ব্যাচ",
    selectBatch: "একটি ব্যাচ নির্বাচন করুন",
    noBatches: "কোনও ব্যাচ পাওয়া যায়নি",
    noBatchesText: "অন্য কিছু দিয়ে সার্চ করুন।",
    selectHoneyBatch: "একটি মধুর ব্যাচ নির্বাচন করুন",
    selectHoneyBatchText:
      "সাপ্লাই-চেইন যাত্রা দেখতে একটি ব্যাচ নির্বাচন করুন।",

    batch: "ব্যাচ",
    honey: "মধু",
    hive: "হাইভ",
    quantity: "পরিমাণ",
    harvest: "সংগ্রহ",
    harvestDate: "সংগ্রহের তারিখ",
    floralSource: "ফ্লোরাল উৎস",
    originHive: "উৎস হাইভ",

    journey: "সাপ্লাই-চেইন যাত্রা",
    lifecycle: "রেকর্ড করা জীবনচক্র",
    event: "ইভেন্ট",
    events: "ইভেন্ট",

    immutableHistory: "সাপ্লাই-চেইন ইভেন্ট ইতিহাস",
    noEvents: "এখনও কোনও ইভেন্ট রেকর্ড নেই",

    blockchainProof: "ব্লকচেইন প্রুফ",
    cryptographicIdentity: "ক্রিপ্টোগ্রাফিক ব্যাচ পরিচয়",
    proofGenerated: "SHA-256 প্রুফ তৈরি হয়েছে",
    noProof: "কোনও প্রুফ তৈরি হয়নি",
    chainTransaction: "চেইন ট্রানজ্যাকশন",

    hiveOrigin: "হাইভের উৎস",
    sourceOfBatch: "এই ব্যাচের উৎস",
    device: "ডিভাইস",
    batchQuantity: "ব্যাচের পরিমাণ",

    consumerVerification: "ভোক্তা যাচাই",
    publicPassport: "পাবলিক হানি পাসপোর্ট উপলব্ধ",
    openVerification: "ভেরিফিকেশন খুলুন",

    details: "বিস্তারিত",
    current: "বর্তমান",
    pending: "অপেক্ষমাণ",
    completed: "সম্পন্ন",

    location: "স্থান",
    actor: "দায়িত্বপ্রাপ্ত",
    notes: "নোট",

    status: {
      harvested: "সংগ্রহ করা হয়েছে",
      processing: "প্রক্রিয়াকরণ",
      packaged: "প্যাকেজ করা হয়েছে",
      shipped: "শিপ করা হয়েছে",
      delivered: "ডেলিভার হয়েছে",
    },

    steps: {
      harvest: "সংগ্রহ",
      processing: "প্রক্রিয়াকরণ",
      packaging: "প্যাকেজিং",
      shipment: "শিপমেন্ট",
      delivery: "ডেলিভারি",
    },
  },

  hi: {
    supplyChain: "सप्लाई चेन",
    title: "हाइव से कंज़्यूमर तक।",
    description:
      "सप्लाई चेन में आपके हनी बैच की हर रिकॉर्ड की गई गतिविधि देखें।",

    back: "डैशबोर्ड",
    search: "बैच, हाइव या शहद का प्रकार खोजें...",
    clearSearch: "सर्च साफ़ करें",

    trackedBatches: "ट्रैक किए गए बैच",
    recordedEvents: "रिकॉर्डेड इवेंट",
    currentStatus: "वर्तमान स्थिति",

    honeyBatches: "हनी बैच",
    selectBatch: "बैच चुनें",
    noBatches: "कोई बैच नहीं मिला",
    noBatchesText: "कोई दूसरा सर्च प्रयास करें।",
    selectHoneyBatch: "हनी बैच चुनें",
    selectHoneyBatchText:
      "सप्लाई-चेन यात्रा देखने के लिए बैच चुनें।",

    batch: "बैच",
    honey: "शहद",
    hive: "हाइव",
    quantity: "मात्रा",
    harvest: "हार्वेस्ट",
    harvestDate: "हार्वेस्ट तिथि",
    floralSource: "फ्लोरल स्रोत",
    originHive: "मूल हाइव",

    journey: "सप्लाई-चेन यात्रा",
    lifecycle: "रिकॉर्ड किया गया जीवनचक्र",
    event: "इवेंट",
    events: "इवेंट",

    immutableHistory: "सप्लाई-चेन इवेंट इतिहास",
    noEvents: "अभी कोई इवेंट रिकॉर्ड नहीं है",

    blockchainProof: "ब्लॉकचेन प्रूफ",
    cryptographicIdentity: "क्रिप्टोग्राफिक बैच पहचान",
    proofGenerated: "SHA-256 प्रूफ जनरेट हुआ",
    noProof: "कोई प्रूफ जनरेट नहीं हुआ",
    chainTransaction: "चेन ट्रांज़ैक्शन",

    hiveOrigin: "हाइव स्रोत",
    sourceOfBatch: "इस बैच का स्रोत",
    device: "डिवाइस",
    batchQuantity: "बैच मात्रा",

    consumerVerification: "कंज़्यूमर सत्यापन",
    publicPassport: "पब्लिक हनी पासपोर्ट उपलब्ध",
    openVerification: "सत्यापन खोलें",

    details: "विवरण",
    current: "वर्तमान",
    pending: "लंबित",
    completed: "पूर्ण",

    location: "स्थान",
    actor: "जिम्मेदार व्यक्ति",
    notes: "नोट्स",

    status: {
      harvested: "हार्वेस्टेड",
      processing: "प्रोसेसिंग",
      packaged: "पैकेज्ड",
      shipped: "शिप्ड",
      delivered: "डिलीवर्ड",
    },

    steps: {
      harvest: "हार्वेस्ट",
      processing: "प्रोसेसिंग",
      packaging: "पैकेजिंग",
      shipment: "शिपमेंट",
      delivery: "डिलीवरी",
    },
  },
};

/* ================================================================
   HELPERS
================================================================ */

function getStatusIndex(status: string) {
  return statusOrder.indexOf(status);
}

function formatDate(
  value?: string | null,
  language: LanguageKey = "en"
) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat(
      language === "bn"
        ? "bn-BD"
        : language === "hi"
          ? "hi-IN"
          : "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(value));
  } catch {
    return "—";
  }
}

function formatDateTime(
  value?: string | null,
  language: LanguageKey = "en"
) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat(
      language === "bn"
        ? "bn-BD"
        : language === "hi"
          ? "hi-IN"
          : "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(new Date(value));
  } catch {
    return "—";
  }
}

function getTransactionUrl(value?: string | null) {
  if (!value) return null;

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `https://sepolia.etherscan.io/tx/${value}`;
}

function getStatusLabel(
  status: string,
  t: TranslationSet
) {
  const key = status as keyof TranslationSet["status"];

  return (
    t.status[key] ??
    (status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "—")
  );
}

function getEventLabel(
  eventType: string,
  t: TranslationSet
) {
  const key = eventType as keyof TranslationSet["steps"];

  return (
    t.steps[key] ??
    (eventType
      ? eventType.charAt(0).toUpperCase() +
        eventType.slice(1)
      : "—")
  );
}

/* ================================================================
   MAIN PAGE
================================================================ */

export default function SupplyChainPage() {
  const { language } = useLanguage();

  const lang: LanguageKey =
    language === "bn" || language === "hi"
      ? language
      : "en";

  const t: TranslationSet = translations[lang];

  const [batches, setBatches] = useState<BatchDetails[]>([]);
  const [selectedBatch, setSelectedBatch] =
    useState<BatchDetails | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] =
    useState(false);
  const [error, setError] = useState("");

  /* ==============================================================
     LOAD BATCHES
  ============================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadBatches() {
      try {
        setLoading(true);
        setError("");

        const data = await getBatches();

        const details = await Promise.all(
          data.map(async (batch) => {
            try {
              return await getBatch(batch.id);
            } catch {
              return batch as BatchDetails;
            }
          })
        );

        if (cancelled) return;

        setBatches(details);

        if (details.length > 0) {
          setSelectedBatch(details[0]);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            "Unable to load supply-chain data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBatches();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==============================================================
     FILTER
  ============================================================== */

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return batches;

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
        batch.status
          ?.toLowerCase()
          .includes(query) ||
        batch.hive?.hive_code
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [batches, search]);

  /* ==============================================================
     SELECT BATCH
  ============================================================== */

  async function selectBatch(batch: BatchDetails) {
    if (selectedBatch?.id === batch.id) return;

    try {
      setDetailLoading(true);

      const details = await getBatch(batch.id);

      setSelectedBatch(details);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }

  /* ==============================================================
     DERIVED DATA
  ============================================================== */

  const currentIndex = selectedBatch
    ? getStatusIndex(selectedBatch.status)
    : 0;

  const safeCurrentIndex =
    currentIndex < 0 ? 0 : currentIndex;

  const completedEvents =
    selectedBatch?.events?.length ?? 0;

  const totalEvents = batches.reduce(
    (sum, batch) =>
      sum + (batch.events?.length ?? 0),
    0
  );

  const transactionUrl = getTransactionUrl(
    selectedBatch?.blockchain_tx_hash
  );

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#292621]"
      style={{
        fontFamily:
          'system-ui, "Segoe UI", "Noto Sans Bengali", "Noto Sans Devanagari", "Noto Sans", sans-serif',
      }}
    >
      {/* ==========================================================
          HEADER
      ========================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#E4DAC9] bg-[#F7F3EA]/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#DCD1BF] bg-white text-[#5F574E] shadow-sm transition hover:border-[#C88616] hover:bg-[#FFF8E8]"
            aria-label={t.back}
          >
            <ArrowLeft size={19} />
          </Link>

          <div className="min-w-0 flex-1 px-2">
            <p className="truncate text-[15px] font-bold text-[#292621]">
              HoneyChain
            </p>

            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A7064]">
              {t.supplyChain}
            </p>
          </div>

          <LanguageSelector />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        {/* ========================================================
            PAGE TITLE
        ======================================================== */}

        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#80766B]">
            <Link
              href="/dashboard"
              className="hover:text-[#A86600]"
            >
              {t.back}
            </Link>

            <ChevronRight size={14} />

            <span className="text-[#A86600]">
              {t.supplyChain}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-[30px] font-bold tracking-tight text-[#292621] sm:text-4xl">
                {t.title}
              </h1>

              <p className="mt-2 max-w-2xl text-[15px] leading-6 text-[#665E55]">
                {t.description}
              </p>
            </div>

            <div className="relative w-full lg:w-[330px]">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8074]"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder={t.search}
                className="min-h-11 w-full rounded-xl border border-[#DDD2C1] bg-white py-2.5 pl-10 pr-10 text-[14px] font-medium text-[#292621] outline-none shadow-sm placeholder:text-[#968C80] focus:border-[#C88616] focus:ring-2 focus:ring-[#C88616]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label={t.clearSearch}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#766C61] hover:bg-[#F4EEE3]"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            SUMMARY
        ======================================================== */}

        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3">
          <SummaryCard
            label={t.trackedBatches}
            value={loading ? "—" : batches.length}
            icon={<Package size={18} />}
          />

          <SummaryCard
            label={t.recordedEvents}
            value={loading ? "—" : totalEvents}
            icon={<Clock3 size={18} />}
          />

          <SummaryCard
            label={t.currentStatus}
            value={
              selectedBatch
                ? getStatusLabel(
                    selectedBatch.status,
                    t
                  )
                : "—"
            }
            icon={<ShieldCheck size={18} />}
          />
        </div>

        {/* ========================================================
            ERROR
        ======================================================== */}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ========================================================
            MAIN GRID
        ======================================================== */}

        <div className="mt-5 grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          {/* ======================================================
              BATCH LIST
          ====================================================== */}

          <section className="rounded-2xl border border-[#E0D6C6] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[#292621]">
                  {t.honeyBatches}
                </h2>

                <p className="mt-0.5 text-[13px] text-[#7A7065]">
                  {t.selectBatch}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4D8] text-[#A86600]">
                <Box size={18} />
              </div>
            </div>

            <div className="space-y-2.5">
              {loading ? (
                [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[92px] animate-pulse rounded-xl bg-[#F4EFE7]"
                  />
                ))
              ) : filteredBatches.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#DDD3C4] bg-[#FBF9F5] p-6 text-center">
                  <Package
                    size={24}
                    className="mx-auto text-[#B4A99C]"
                  />

                  <p className="mt-3 text-[14px] font-semibold text-[#4C453E]">
                    {t.noBatches}
                  </p>

                  <p className="mt-1 text-[13px] text-[#81776C]">
                    {t.noBatchesText}
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
                        selectBatch(batch)
                      }
                      className={`group w-full rounded-xl border p-3.5 text-left transition ${
                        active
                          ? "border-[#D8A62D] bg-[#FFF8E8] shadow-sm"
                          : "border-[#E5DED3] bg-[#FBF9F5] hover:border-[#D8CCBB] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p
                            className={`font-mono text-[15px] font-bold ${
                              active
                                ? "text-[#9A5D00]"
                                : "text-[#35302C]"
                            }`}
                          >
                            {batch.batch_code}
                          </p>

                          <p className="mt-1 truncate text-[13px] text-[#756B60]">
                            {batch.honey_type ||
                              t.honey}
                            {" · "}
                            {batch.floral_source ||
                              "—"}
                          </p>
                        </div>

                        <ChevronRight
                          size={16}
                          className={`mt-0.5 shrink-0 ${
                            active
                              ? "text-[#A86600]"
                              : "text-[#A79D91]"
                          }`}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-[13px] font-medium text-[#6F665D]">
                          {batch.harvested_weight_kg !=
                          null
                            ? `${batch.harvested_weight_kg.toFixed(
                                1
                              )} kg`
                            : "—"}
                        </span>

                        <StatusPill
                          status={batch.status}
                          translations={t}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* ======================================================
              SELECTED BATCH
          ====================================================== */}

          <section
            className={`min-w-0 transition-opacity ${
              detailLoading
                ? "opacity-60"
                : "opacity-100"
            }`}
          >
            {!selectedBatch ? (
              <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-[#E0D6C6] bg-white p-8 text-center shadow-sm">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4D8] text-[#A86600]">
                    <Package size={24} />
                  </div>

                  <h3 className="mt-4 text-[17px] font-bold text-[#3A342F]">
                    {t.selectHoneyBatch}
                  </h3>

                  <p className="mt-2 max-w-sm text-[14px] leading-6 text-[#756B60]">
                    {t.selectHoneyBatchText}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* ==================================================
                    BATCH HEADER
                ================================================== */}

                <section className="rounded-2xl border border-[#E0D6C6] bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF4D8] text-[#A86600]">
                          <Package size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-mono text-[18px] font-bold text-[#292621]">
                            {selectedBatch.batch_code}
                          </p>

                          <p className="mt-0.5 text-[13px] text-[#756B60]">
                            {selectedBatch.honey_type ||
                              t.honey}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill
                        status={
                          selectedBatch.status
                        }
                        large
                        translations={t}
                      />

                      <Link
                        href={`/batches/${selectedBatch.id}`}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-[#DDD3C4] bg-white px-3 text-[13px] font-semibold text-[#625A51] hover:border-[#C88616] hover:bg-[#FFF9EB]"
                      >
                        {t.details}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <InfoItem
                      label={t.originHive}
                      value={
                        selectedBatch.hive
                          ?.hive_code || "—"
                      }
                    />

                    <InfoItem
                      label={t.harvestDate}
                      value={formatDate(
                        selectedBatch.harvest_date,
                        lang
                      )}
                    />

                    <InfoItem
                      label={t.quantity}
                      value={
                        selectedBatch.harvested_weight_kg !=
                        null
                          ? `${selectedBatch.harvested_weight_kg.toFixed(
                              2
                            )} kg`
                          : "—"
                      }
                    />

                    <InfoItem
                      label={t.floralSource}
                      value={
                        selectedBatch.floral_source ||
                        "—"
                      }
                    />
                  </div>
                </section>

                {/* ==================================================
                    JOURNEY
                ================================================== */}

                <section className="rounded-2xl border border-[#E0D6C6] bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-[17px] font-bold text-[#292621]">
                        {t.journey}
                      </h2>

                      <p className="mt-0.5 text-[13px] text-[#776E64]">
                        {t.lifecycle}{" "}
                        {selectedBatch.batch_code}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#756B60]">
                      <Clock3 size={15} />

                      {completedEvents}{" "}
                      {completedEvents === 1
                        ? t.event
                        : t.events}
                    </div>
                  </div>

                  {/* DESKTOP STEPPER */}

                  <div className="mt-8 hidden md:block">
                    <div className="relative">
                      <div className="absolute left-[10%] right-[10%] top-5 h-px bg-[#E7DED1]" />

                      <div
                        className="absolute left-[10%] top-5 h-px bg-[#C88616] transition-all duration-500"
                        style={{
                          width:
                            safeCurrentIndex === 0
                              ? "0%"
                              : `${
                                  (safeCurrentIndex /
                                    (steps.length -
                                      1)) *
                                  80
                                }%`,
                        }}
                      />

                      <div className="relative grid grid-cols-5">
                        {steps.map(
                          (step, index) => {
                            const Icon =
                              step.icon;

                            const completed =
                              index <=
                              safeCurrentIndex;

                            const active =
                              index ===
                              safeCurrentIndex;

                            return (
                              <div
                                key={step.key}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                                    completed
                                      ? "border-[#D7A12A] bg-[#FFF4D8] text-[#A86600]"
                                      : "border-[#DDD5C9] bg-[#FAF8F4] text-[#A79D92]"
                                  } ${
                                    active
                                      ? "ring-4 ring-[#F8E9C2]"
                                      : ""
                                  }`}
                                >
                                  <Icon size={17} />
                                </div>

                                <p
                                  className={`mt-3 text-[13px] font-semibold ${
                                    completed
                                      ? "text-[#4A423A]"
                                      : "text-[#91877B]"
                                  }`}
                                >
                                  {t.steps[
                                    step.key
                                  ]}
                                </p>

                                <p className="mt-0.5 text-[11px] text-[#948A7F]">
                                  {completed
                                    ? active
                                      ? t.current
                                      : t.completed
                                    : t.pending}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MOBILE STEPPER */}

                  <div className="mt-6 space-y-2.5 md:hidden">
                    {steps.map((step, index) => {
                      const Icon = step.icon;

                      const completed =
                        index <= safeCurrentIndex;

                      const active =
                        index === safeCurrentIndex;

                      return (
                        <div
                          key={step.key}
                          className="flex items-center gap-3 rounded-xl border border-[#ECE5DA] bg-[#FBF9F5] px-3.5 py-3"
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                              completed
                                ? "border-[#D7A12A] bg-[#FFF4D8] text-[#A86600]"
                                : "border-[#DDD5C9] bg-white text-[#A79D92]"
                            }`}
                          >
                            <Icon size={16} />
                          </div>

                          <span
                            className={`text-[14px] font-semibold ${
                              completed
                                ? "text-[#494139]"
                                : "text-[#8D8377]"
                            }`}
                          >
                            {t.steps[step.key]}
                          </span>

                          {active && (
                            <span className="ml-auto rounded-full bg-[#FFF0C8] px-2.5 py-1 text-[11px] font-bold text-[#9A5D00]">
                              {t.current}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* ==================================================
                    EVENTS + BLOCKCHAIN
                ================================================== */}

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
                  {/* EVENTS */}

                  <section className="rounded-2xl border border-[#E0D6C6] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-[17px] font-bold text-[#292621]">
                          {t.recordedEvents}
                        </h2>

                        <p className="mt-0.5 text-[13px] text-[#776E64]">
                          {t.immutableHistory}
                        </p>
                      </div>

                      <Clock3
                        size={18}
                        className="text-[#A86600]"
                      />
                    </div>

                    <div className="mt-6">
                      {selectedBatch.events?.length ? (
                        <div className="space-y-0">
                          {selectedBatch.events.map(
                            (event, index) => {
                              const last =
                                index ===
                                selectedBatch
                                  .events.length -
                                  1;

                              return (
                                <div
                                  key={event.id}
                                  className="relative flex gap-3.5"
                                >
                                  {!last && (
                                    <div className="absolute bottom-0 left-[15px] top-8 w-px bg-[#E7DED1]" />
                                  )}

                                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B8E4CE] bg-[#EEFFF5] text-[#138A59]">
                                    <CheckCircle2
                                      size={15}
                                    />
                                  </div>

                                  <div
                                    className={`min-w-0 flex-1 ${
                                      last
                                        ? "pb-0"
                                        : "pb-7"
                                    }`}
                                  >
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                      <p className="text-[14px] font-bold capitalize text-[#403932]">
                                        {getEventLabel(
                                          event.event_type,
                                          t
                                        )}
                                      </p>

                                      <span className="text-[12px] font-medium text-[#8A8074]">
                                        {formatDateTime(
                                          event.created_at,
                                          lang
                                        )}
                                      </span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[#70675E]">
                                      {event.location_name && (
                                        <span className="flex items-center gap-1.5">
                                          <MapPin
                                            size={13}
                                            className="text-[#A86600]"
                                          />

                                          {
                                            event.location_name
                                          }
                                        </span>
                                      )}

                                      {event.quantity_kg !=
                                        null && (
                                        <span>
                                          {t.quantity}:{" "}
                                          <strong className="text-[#4D453E]">
                                            {event.quantity_kg.toFixed(
                                              2
                                            )}{" "}
                                            kg
                                          </strong>
                                        </span>
                                      )}

                                      {event.actor_id && (
                                        <span className="break-all">
                                          {t.actor}:{" "}
                                          <strong className="font-mono text-[12px] text-[#4D453E]">
                                            {event.actor_id}
                                          </strong>
                                        </span>
                                      )}
                                    </div>

                                    {event.notes && (
                                      <p className="mt-2 rounded-lg bg-[#FAF7F1] px-3 py-2 text-[13px] leading-5 text-[#6E655B]">
                                        <strong className="text-[#4A423A]">
                                          {t.notes}:
                                        </strong>{" "}
                                        {event.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-[#DDD3C4] bg-[#FBF9F5] p-6 text-center">
                          <Clock3
                            size={24}
                            className="mx-auto text-[#B5AA9D]"
                          />

                          <p className="mt-3 text-[14px] font-semibold text-[#625A51]">
                            {t.noEvents}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* BLOCKCHAIN + ORIGIN */}

                  <div className="space-y-5">
                    <section className="rounded-2xl border border-[#E0D6C6] bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-[17px] font-bold text-[#292621]">
                            {t.blockchainProof}
                          </h2>

                          <p className="mt-0.5 text-[13px] text-[#776E64]">
                            {t.cryptographicIdentity}
                          </p>
                        </div>

                        <ShieldCheck
                          size={19}
                          className="text-[#138A59]"
                        />
                      </div>

                      <div className="mt-4 rounded-xl border border-[#E5DDD1] bg-[#FAF8F4] p-4">
                        <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#766C61]">
                          <Hash size={14} />
                          SHA-256
                        </div>

                        <p className="break-all font-mono text-[12px] leading-5 text-[#4C453E]">
                          {selectedBatch.blockchain_hash ||
                            t.noProof}
                        </p>
                      </div>

                      {selectedBatch.blockchain_hash && (
                        <div className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-[#138A59]">
                          <CheckCircle2 size={15} />
                          {t.proofGenerated}
                        </div>
                      )}

                      {selectedBatch.blockchain_tx_hash && (
                        <div className="mt-4 border-t border-[#EEE7DC] pt-4">
                          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#81776C]">
                            {t.chainTransaction}
                          </p>

                          <p className="mt-1 break-all font-mono text-[11px] leading-5 text-[#71685E]">
                            {
                              selectedBatch.blockchain_tx_hash
                            }
                          </p>

                          {transactionUrl && (
                            <a
                              href={transactionUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#DDD3C4] bg-white px-3.5 text-[13px] font-semibold text-[#9A5D00] hover:border-[#C88616] hover:bg-[#FFF8E8]"
                            >
                              {t.chainTransaction}
                              <ExternalLink
                                size={14}
                              />
                            </a>
                          )}
                        </div>
                      )}
                    </section>

                    {/* ORIGIN */}

                    <section className="rounded-2xl border border-[#E0D6C6] bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4D8] text-[#A86600]">
                          <Hexagon size={18} />
                        </div>

                        <div>
                          <h2 className="text-[16px] font-bold text-[#292621]">
                            {t.hiveOrigin}
                          </h2>

                          <p className="text-[12px] text-[#7C7267]">
                            {t.sourceOfBatch}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <DetailRow
                          label={t.hive}
                          value={
                            selectedBatch.hive
                              ?.hive_code || "—"
                          }
                        />

                        <DetailRow
                          label={t.device}
                          value={
                            selectedBatch.hive
                              ?.esp32_device_id ||
                            "—"
                          }
                        />

                        <DetailRow
                          label={t.batchQuantity}
                          value={
                            selectedBatch.harvested_weight_kg !=
                            null
                              ? `${selectedBatch.harvested_weight_kg.toFixed(
                                  2
                                )} kg`
                              : "—"
                          }
                        />

                        <DetailRow
                          label={t.harvestDate}
                          value={formatDate(
                            selectedBatch.harvest_date,
                            lang
                          )}
                        />
                      </div>
                    </section>
                  </div>
                </div>

                {/* ==================================================
                    CONSUMER VERIFICATION
                ================================================== */}

                <section className="flex flex-col gap-4 rounded-2xl border border-[#E0D6C6] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF4D8] text-[#A86600]">
                      <WalletCards size={18} />
                    </div>

                    <div>
                      <p className="text-[14px] font-bold text-[#3D3731]">
                        {t.consumerVerification}
                      </p>

                      <p className="mt-0.5 text-[12px] text-[#7A7065]">
                        {t.publicPassport}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/trace/${selectedBatch.id}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#292621] px-5 text-[13px] font-semibold text-white transition hover:bg-[#403B35]"
                  >
                    {t.openVerification}
                    <ExternalLink size={14} />
                  </Link>
                </section>
              </div>
            )}
          </section>
        </div>

        {/* ========================================================
            FOOTER
        ======================================================== */}

        <div className="mt-7">
          <Link
            href="/dashboard"
            className="inline-flex min-h-10 items-center gap-2 text-[13px] font-medium text-[#81776C] hover:text-[#A86600]"
          >
            <ArrowLeft size={15} />
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ================================================================
   COMPONENTS
================================================================ */

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E0D6C6] bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold text-[#756B60]">
          {label}
        </p>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF4D8] text-[#A86600]">
          {icon}
        </div>
      </div>

      <p className="mt-3 truncate text-[22px] font-bold tracking-tight text-[#292621]">
        {value}
      </p>
    </div>
  );
}

function StatusPill({
  status,
  large = false,
  translations: t,
}: {
  status: string;
  large?: boolean;
  translations: TranslationSet;
}) {
  const label = getStatusLabel(status, t);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#E8C96C] bg-[#FFF9E8] font-semibold text-[#9A5D00] ${
        large
          ? "px-3 py-1.5 text-[12px]"
          : "px-2.5 py-1 text-[11px]"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#C88616]" />
      {label}
    </span>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[#E8E0D5] bg-[#FBF9F5] px-3.5 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#81776C]">
        {label}
      </p>

      <p className="mt-1 truncate text-[14px] font-semibold text-[#413A34]">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#EEE7DC] pb-3 last:border-0 last:pb-0">
      <span className="shrink-0 text-[13px] font-medium text-[#7A7065]">
        {label}
      </span>

      <span className="max-w-[62%] break-words text-right text-[13px] font-semibold text-[#443D36]">
        {value}
      </span>
    </div>
  );
}