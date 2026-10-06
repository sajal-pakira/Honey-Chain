"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Hash,
  RefreshCw,
  Search,
  Sparkles,
  Weight,
} from "lucide-react";

import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";
import { getBatches, getBatch } from "@/lib/batch-api";

interface Batch {
  id: string;
  batch_code: string;
  hive_id?: string;
  beekeeper_id?: string;
  harvest_date?: string | null;
  harvested_weight_kg?: number | null;
  honey_type?: string | null;
  floral_source?: string | null;
  status?: string | null;
  blockchain_hash?: string | null;
  blockchain_tx_hash?: string | null;
  qr_token?: string | null;
  created_at?: string | null;
}

interface BatchDetails extends Batch {
  hive?: {
    id: string;
    hive_code: string;
    esp32_device_id?: string;
    apiary_id: string;
  } | null;
  beekeeper?: {
    id: string;
    name: string;
    organization?: string;
  } | null;
  events: {
    id: string;
    batch_id: string;
    event_type: string;
    actor_id?: string;
    location_name?: string;
    latitude?: number;
    longitude?: number;
    quantity_kg?: number;
    notes?: string;
    blockchain_tx_hash?: string;
    created_at: string;
  }[];
}

type LanguageKey = "en" | "bn" | "hi";

type Copy = {
  registry: string;
  title: string;
  description: string;
  batches: string;
  harvested: string;
  search: string;
  batch: string;
  honeyIdentity: string;
  floralSource: string;
  harvestDate: string;
  verification: string;
  proofGenerated: string;
  chainTransaction: string;
  cryptographicProof: string;
  events: string;
  openBatch: string;
  noMatches: string;
  noBatches: string;
  noMatchesDescription: string;
  noBatchesDescription: string;
  registryUnavailable: string;
  tryAgain: string;
  refresh: string;
  hiveUnavailable: string;
  unspecifiedHoney: string;
  statuses: Record<string, string>;
};

const pageTranslations: Record<LanguageKey, Copy> = {
  en: {
    registry: "Honey traceability",
    title: "Batch registry.",
    description: "Every harvest gets a digital identity linking its hive origin, honey characteristics and supply-chain history.",
    batches: "Batches",
    harvested: "Harvested",
    search: "Search batch, hive or honey type...",
    batch: "Batch",
    honeyIdentity: "Honey identity",
    floralSource: "Floral source",
    harvestDate: "Harvest date",
    verification: "Verification",
    proofGenerated: "Proof generated",
    chainTransaction: "Chain transaction",
    cryptographicProof: "Cryptographic proof",
    events: "events",
    openBatch: "Open batch",
    noMatches: "No matching batches",
    noBatches: "No honey batches yet",
    noMatchesDescription: "Try another batch code, hive, honey type or status.",
    noBatchesDescription: "Create a harvest batch to begin its traceability record.",
    registryUnavailable: "Registry unavailable",
    tryAgain: "Try again",
    refresh: "Refresh",
    hiveUnavailable: "Hive unavailable",
    unspecifiedHoney: "Unspecified honey",
    statuses: {
      harvested: "HARVESTED",
      processing: "PROCESSING",
      packaged: "PACKAGED",
      shipped: "SHIPPED",
      delivered: "DELIVERED",
      verified: "VERIFIED",
    },
  },
  bn: {
    registry: "মধু ট্রেসেবিলিটি",
    title: "ব্যাচ রেজিস্ট্রি।",
    description: "প্রতিটি হারভেস্টের একটি ডিজিটাল পরিচয় থাকে, যেখানে হাইভ, মধুর বৈশিষ্ট্য ও সাপ্লাই-চেইন ইতিহাস যুক্ত থাকে।",
    batches: "ব্যাচ",
    harvested: "সংগ্রহ",
    search: "ব্যাচ, হাইভ বা মধুর ধরন খুঁজুন...",
    batch: "ব্যাচ",
    honeyIdentity: "মধুর পরিচয়",
    floralSource: "ফ্লোরাল সোর্স",
    harvestDate: "সংগ্রহের তারিখ",
    verification: "ভেরিফিকেশন",
    proofGenerated: "প্রুফ তৈরি হয়েছে",
    chainTransaction: "চেইন ট্রানজ্যাকশন",
    cryptographicProof: "ক্রিপ্টোগ্রাফিক প্রুফ",
    events: "ইভেন্ট",
    openBatch: "ব্যাচ খুলুন",
    noMatches: "মিল পাওয়া যায়নি",
    noBatches: "এখনও কোনো ব্যাচ নেই",
    noMatchesDescription: "অন্য ব্যাচ কোড, হাইভ, মধুর ধরন বা স্ট্যাটাস চেষ্টা করুন।",
    noBatchesDescription: "ট্রেসেবিলিটি শুরু করতে একটি হারভেস্ট ব্যাচ তৈরি করুন।",
    registryUnavailable: "রেজিস্ট্রি পাওয়া যাচ্ছে না",
    tryAgain: "আবার চেষ্টা করুন",
    refresh: "রিফ্রেশ",
    hiveUnavailable: "হাইভ পাওয়া যায়নি",
    unspecifiedHoney: "মধুর ধরন উল্লেখ নেই",
    statuses: {
      harvested: "সংগ্রহ করা হয়েছে",
      processing: "প্রক্রিয়াকরণ চলছে",
      packaged: "প্যাকেজ করা হয়েছে",
      shipped: "পাঠানো হয়েছে",
      delivered: "ডেলিভার করা হয়েছে",
      verified: "ভেরিফায়েড",
    },
  },
  hi: {
    registry: "हनी ट्रेसबिलिटी",
    title: "बैच रजिस्ट्री।",
    description: "हर हार्वेस्ट को एक डिजिटल पहचान मिलती है जो हाइव, शहद की विशेषताओं और सप्लाई-चेन इतिहास को जोड़ती है।",
    batches: "बैच",
    harvested: "हार्वेस्टेड",
    search: "बैच, हाइव या शहद का प्रकार खोजें...",
    batch: "बैच",
    honeyIdentity: "शहद की पहचान",
    floralSource: "फ्लोरल सोर्स",
    harvestDate: "हार्वेस्ट तारीख",
    verification: "वेरिफिकेशन",
    proofGenerated: "प्रूफ तैयार",
    chainTransaction: "चेन ट्रांजैक्शन",
    cryptographicProof: "क्रिप्टोग्राफिक प्रूफ",
    events: "इवेंट्स",
    openBatch: "बैच खोलें",
    noMatches: "कोई मिलान नहीं",
    noBatches: "अभी कोई हनी बैच नहीं",
    noMatchesDescription: "दूसरा बैच कोड, हाइव, शहद प्रकार या स्टेटस आज़माएँ।",
    noBatchesDescription: "ट्रेसबिलिटी शुरू करने के लिए एक हार्वेस्ट बैच बनाएँ।",
    registryUnavailable: "रजिस्ट्री उपलब्ध नहीं",
    tryAgain: "फिर कोशिश करें",
    refresh: "रिफ्रेश",
    hiveUnavailable: "हाइव उपलब्ध नहीं",
    unspecifiedHoney: "शहद का प्रकार उपलब्ध नहीं",
    statuses: {
      harvested: "हार्वेस्टेड",
      processing: "प्रोसेसिंग",
      packaged: "पैकेज्ड",
      shipped: "शिप्ड",
      delivered: "डिलीवर्ड",
      verified: "वेरिफाइड",
    },
  },
};

export default function BatchesPage() {
  const { language } = useLanguage();
  const copy = pageTranslations[(language as LanguageKey) || "en"] ?? pageTranslations.en;

  const [batches, setBatches] = useState<BatchDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    try {
      setLoading(true);
      setError("");

      const batchList = await getBatches();
      const validBatchList = Array.isArray(batchList)
        ? batchList.filter((batch) => Boolean(batch?.id && String(batch.id).trim()))
        : [];

      const details: BatchDetails[] = await Promise.all(
        validBatchList.map(async (batch) => {
          try {
            const detail = await getBatch(batch.id);
            return {
              ...batch,
              ...detail,
              id: detail.id ?? batch.id,
              batch_code: detail.batch_code ?? batch.batch_code,
              hive_id: detail.hive_id ?? batch.hive_id,
              beekeeper_id: detail.beekeeper_id ?? batch.beekeeper_id,
              harvest_date: detail.harvest_date ?? batch.harvest_date ?? null,
              harvested_weight_kg: detail.harvested_weight_kg ?? batch.harvested_weight_kg ?? null,
              honey_type: detail.honey_type ?? batch.honey_type ?? null,
              floral_source: detail.floral_source ?? batch.floral_source ?? null,
              status: detail.status ?? batch.status ?? "unknown",
              blockchain_hash: detail.blockchain_hash ?? batch.blockchain_hash ?? null,
              blockchain_tx_hash: detail.blockchain_tx_hash ?? batch.blockchain_tx_hash ?? null,
              qr_token: detail.qr_token ?? batch.qr_token ?? null,
              created_at: detail.created_at ?? batch.created_at ?? null,
              hive: detail.hive ?? batch.hive ?? null,
              beekeeper: detail.beekeeper ?? batch.beekeeper ?? null,
              events: Array.isArray(detail.events) ? detail.events : Array.isArray(batch.events) ? batch.events : [],
            };
          } catch (detailError) {
            console.warn(`Unable to load details for batch ${batch.id}:`, detailError);
            return {
              ...batch,
              harvested_weight_kg: batch.harvested_weight_kg ?? null,
              honey_type: batch.honey_type ?? null,
              floral_source: batch.floral_source ?? null,
              status: batch.status ?? "unknown",
              hive: batch.hive ?? null,
              beekeeper: batch.beekeeper ?? null,
              events: Array.isArray(batch.events) ? batch.events : [],
            };
          }
        }),
      );

      setBatches(details);
    } catch (err) {
      console.error("HoneyChain batch loading error:", err);
      setError(err instanceof Error ? err.message : "Unable to load honey batches.");
    } finally {
      setLoading(false);
    }
  }

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return batches;

    return batches.filter((batch) =>
      [batch.batch_code, batch.honey_type, batch.floral_source, batch.hive?.hive_code, batch.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [batches, search]);

  const totalWeight = batches.reduce((sum, batch) => {
    const weight = Number(batch.harvested_weight_kg);
    return sum + (Number.isFinite(weight) ? weight : 0);
  }, 0);

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#292621] font-sans"
      style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", "Noto Sans Bengali", "Noto Sans Devanagari", "Noto Sans", Arial, sans-serif' }}
    >
      <nav className="sticky top-0 z-40 border-b border-[#E4DCCD] bg-[#F7F3EA]">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard"
              aria-label="Back to dashboard"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DCD2C2] bg-white text-[#5B554D] transition hover:border-[#C88718] hover:bg-[#FFF8E8] hover:text-[#A86600]"
            >
              <ArrowLeft size={19} />
            </Link>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold tracking-tight text-[#27231F] sm:text-base">HoneyChain</div>
              <div className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.19em] text-[#766D62] sm:text-[11px]">Traceability Registry</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSelector />
            <button
              type="button"
              onClick={loadBatches}
              disabled={loading}
              aria-label={copy.refresh}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCD2C2] bg-white text-[#5B554D] transition hover:border-[#C88718] hover:bg-[#FFF8E8] hover:text-[#A86600] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:gap-2 sm:px-4"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              <span className="hidden text-sm font-medium sm:inline">{copy.refresh}</span>
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-7 sm:px-6 sm:pt-9 lg:px-8">
        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-2.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#95600D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D99A22]" />
              {copy.registry}
            </div>
            <h1 className="text-[34px] font-bold leading-[1.08] tracking-[-0.035em] text-[#292621] sm:text-[42px] lg:text-[48px]">
              {copy.title}
            </h1>
            <p className="mt-2.5 max-w-2xl text-[15px] font-normal leading-6 text-[#5F584F] sm:text-base sm:leading-7">
              {copy.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:min-w-[300px]">
            <SummaryCard icon={<Boxes size={17} />} label={copy.batches} value={String(batches.length)} />
            <SummaryCard icon={<Weight size={17} />} label={copy.harvested} value={`${totalWeight.toFixed(1)} kg`} />
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-[440px]">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#766D62]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.search}
              aria-label={copy.search}
              className="h-12 w-full rounded-full border border-[#D9D0C1] bg-white px-4 pl-11 text-[15px] font-medium text-[#292621] outline-none placeholder:text-[#766D62] transition focus:border-[#C88718] focus:ring-2 focus:ring-[#C88718]/15"
            />
          </div>

          {!loading && (
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#766D62]">
              {filteredBatches.length} {copy.batches}
            </p>
          )}
        </div>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[330px] animate-pulse rounded-2xl border border-[#E2D9CA] bg-white" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"><FileCheck2 size={18} /></div>
              <div>
                <h2 className="text-base font-semibold text-[#292621]">{copy.registryUnavailable}</h2>
                <p className="mt-1 text-[15px] leading-6 text-[#62594F]">{error}</p>
                <button type="button" onClick={loadBatches} className="mt-4 min-h-11 rounded-full border border-[#D9D0C1] bg-white px-5 text-sm font-semibold text-[#4F4941] hover:bg-[#FFF9EC]">{copy.tryAgain}</button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && filteredBatches.length === 0 && (
          <div className="rounded-2xl border border-[#E2D9CA] bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5DD] text-[#B97912]"><Boxes size={20} /></div>
            <h2 className="text-xl font-semibold text-[#292621]">{search ? copy.noMatches : copy.noBatches}</h2>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-6 text-[#62594F]">{search ? copy.noMatchesDescription : copy.noBatchesDescription}</p>
          </div>
        )}

        {!loading && !error && filteredBatches.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredBatches.map((batch) => <BatchCard key={batch.id} batch={batch} copy={copy} />)}
          </div>
        )}
      </section>
    </main>
  );
}

function BatchCard({ batch, copy }: { batch: BatchDetails; copy: Copy }) {
  const status = normalizeStatus(batch.status);
  const hasProof = Boolean(batch.blockchain_hash);
  const hasTransaction = Boolean(batch.blockchain_tx_hash);
  const events = Array.isArray(batch.events) ? batch.events : [];
  const safeBatchCode = batch.batch_code || "Unknown batch";
  const safeHarvestDate = batch.harvest_date || batch.created_at || undefined;
  const statusLabel = copy.statuses[status] ?? status.toUpperCase();

  return (
    <article className="overflow-hidden rounded-2xl border border-[#DDD4C6] bg-white shadow-[0_4px_18px_rgba(72,58,40,0.06)]">
      <div className="border-b border-[#EAE3D9] px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#756B5F]">
              {copy.batch}<span className="h-px w-4 bg-[#CFC4B5]" />
            </div>
            <h2 className="truncate font-mono text-[19px] font-semibold tracking-tight text-[#292621]">{safeBatchCode}</h2>
            <p className="mt-1 text-[14px] font-medium text-[#625A50]">{batch.hive?.hive_code || copy.hiveUnavailable}</p>
          </div>
          <StatusBadge label={statusLabel} status={status} />
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <div className="rounded-xl border border-[#E4DACE] bg-[#FCF9F4] px-3.5 py-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1CF] text-[#B8780D]"><Sparkles size={16} /></div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#766C60]">{copy.honeyIdentity}</div>
              <div className="mt-1 text-[16px] font-semibold text-[#332E28]">{batch.honey_type || copy.unspecifiedHoney}</div>
              {batch.floral_source && (
                <div className="mt-2 border-t border-[#E4DACE] pt-2">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.11em] text-[#766C60]">{copy.floralSource}</div>
                  <div className="mt-0.5 text-[14px] font-medium text-[#5E564D]">{batch.floral_source}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#E4DACE]">
          <BatchMetric icon={<Weight size={15} />} label={copy.harvested} value={batch.harvested_weight_kg != null ? `${Number(batch.harvested_weight_kg).toFixed(1)} kg` : "—"} />
          <BatchMetric icon={<CalendarDays size={15} />} label={copy.harvestDate} value={formatShortDate(safeHarvestDate)} />
        </div>

        <div>
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#766C60]">{copy.verification}</div>
          <div className="flex min-h-11 items-center gap-2 rounded-xl border border-[#E4DACE] bg-[#FCF9F4] px-3">
            <VerificationDot active={hasProof} label={copy.proofGenerated} />
            <span className="h-px flex-1 bg-[#CFC5B8]" />
            <VerificationDot active={hasTransaction} label={copy.chainTransaction} />
          </div>
        </div>

        {hasProof && (
          <div className="rounded-xl border border-[#E0D6C8] bg-white px-3.5 py-3">
            <div className="flex items-center gap-2 text-[#665D52]"><Hash size={15} /><span className="text-[12px] font-semibold uppercase tracking-[0.12em]">{copy.cryptographicProof}</span></div>
            <p className="mt-2 truncate font-mono text-[12px] leading-5 text-[#5E564D]">{batch.blockchain_hash}</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-0.5">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#766C60]">{copy.events}</div>
            <div className="mt-0.5 text-[14px] font-medium text-[#5E564D]">{events.length} {copy.events}</div>
          </div>
          <Link href={`/batches/${batch.id}`} className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#2E2A25] px-4 text-[14px] font-semibold text-white transition hover:bg-[#1F1C18]">
            {copy.openBatch}<ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#DDD4C6] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-[#665D52]">{icon}<span className="truncate text-[12px] font-semibold uppercase tracking-[0.12em]">{label}</span></div>
      <p className="mt-1.5 text-[20px] font-semibold tracking-tight text-[#332E28]">{value}</p>
    </div>
  );
}

function BatchMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 bg-[#FCFAF6] px-3.5 py-3.5">
      <div className="flex items-center gap-1.5 text-[#665D52]">{icon}<span className="truncate text-[12px] font-semibold uppercase tracking-[0.1em]">{label}</span></div>
      <p className="mt-1.5 truncate text-[16px] font-semibold text-[#403A33]">{value}</p>
    </div>
  );
}

function StatusBadge({ label, status }: { label: string; status: string }) {
  const styles: Record<string, string> = {
    harvested: "border-[#E5BE4E] bg-[#FFF8DF] text-[#9A5900]",
    processing: "border-[#AFC8E8] bg-[#F0F6FF] text-[#3C659B]",
    packaged: "border-[#D1BCE4] bg-[#F7F1FC] text-[#76549A]",
    shipped: "border-[#B6D9DE] bg-[#EFFAFC] text-[#39737B]",
    delivered: "border-[#B6D8C5] bg-[#F0FBF4] text-[#34704C]",
    verified: "border-[#B6D8C5] bg-[#F0FBF4] text-[#34704C]",
  };

  return <div className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] ${styles[status] ?? "border-[#D8D0C4] bg-[#FAF8F3] text-[#62594F]"}`}>{label}</div>;
}

function VerificationDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${active ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-[#D8D0C4] bg-white text-[#8D8377]"}`}>
        {active ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
      </div>
      <span className="truncate text-[12px] font-semibold text-[#5E564D]">{label}</span>
    </div>
  );
}

function normalizeStatus(status?: string | null) {
  return status?.toLowerCase() || "unknown";
}

function formatShortDate(date?: string | null) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
