"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Hash,
  MapPin,
  QrCode,
  ShieldCheck,
  Circle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { BatchDetails, getBatch } from "@/lib/batch-api";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

const steps = [
  "harvest",
  "processing",
  "packaging",
  "shipment",
  "delivery",
] as const;

const copy = {
  en: {
    back: "Honey batches",
    loading: "Loading batch…",
    failed: "Failed to load batch.",
    batch: "Batch",
    rawHoney: "Raw Honey",
    floralSource: "Floral source",
    notRecorded: "Not recorded",
    harvested: "Harvested",
    harvestDate: "Harvest date",
    quantity: "Quantity",
    hive: "Hive",
    apiary: "Apiary",
    supplyChain: "Supply chain",
    custodyText: "Every recorded custody transition for this batch.",
    consumerView: "Consumer view",
    recorded: "Recorded",
    notRecordedYet: "Not recorded yet",
    actor: "Actor",
    location: "Location",
    notes: "Notes",
    blockchain: "Blockchain proof",
    proofText: "Canonical proof hash stored for this batch.",
    noProof: "No proof hash available",
    transaction: "View transaction",
    passport: "Honey Passport",
    scanText: "Scan to verify this batch",
    origin: "Origin",
    beekeeper: "Beekeeper",
    organization: "Organization",
    device: "ESP32 device",
    verification: "Verification",
    verified: "Verified",
    pending: "Pending",
    event: "event",
    events: "events",
    openConsumer: "Open consumer verification",
  },

  bn: {
    back: "মধুর ব্যাচ",
    loading: "ব্যাচ লোড হচ্ছে…",
    failed: "ব্যাচ লোড করা যায়নি।",
    batch: "ব্যাচ",
    rawHoney: "কাঁচা মধু",
    floralSource: "ফ্লোরাল উৎস",
    notRecorded: "রেকর্ড নেই",
    harvested: "সংগ্রহ",
    harvestDate: "সংগ্রহের তারিখ",
    quantity: "পরিমাণ",
    hive: "মৌচাক",
    apiary: "এপিয়ারি",
    supplyChain: "সাপ্লাই চেইন",
    custodyText: "এই ব্যাচের প্রতিটি রেকর্ড করা হস্তান্তর।",
    consumerView: "ভোক্তা ভিউ",
    recorded: "রেকর্ড করা",
    notRecordedYet: "এখনও রেকর্ড নেই",
    actor: "দায়িত্বপ্রাপ্ত",
    location: "স্থান",
    notes: "নোট",
    blockchain: "ব্লকচেইন প্রুফ",
    proofText: "এই ব্যাচের ক্যানোনিক্যাল প্রুফ হ্যাশ।",
    noProof: "কোনও প্রুফ হ্যাশ নেই",
    transaction: "ট্রানজ্যাকশন দেখুন",
    passport: "হানি পাসপোর্ট",
    scanText: "ব্যাচ যাচাই করতে স্ক্যান করুন",
    origin: "উৎস",
    beekeeper: "মৌচাষী",
    organization: "প্রতিষ্ঠান",
    device: "ESP32 ডিভাইস",
    verification: "যাচাই",
    verified: "যাচাইকৃত",
    pending: "অপেক্ষমাণ",
    event: "ইভেন্ট",
    events: "ইভেন্ট",
    openConsumer: "ভোক্তা যাচাই খুলুন",
  },

  hi: {
    back: "हनी बैच",
    loading: "बैच लोड हो रहा है…",
    failed: "बैच लोड नहीं किया जा सका।",
    batch: "बैच",
    rawHoney: "कच्चा शहद",
    floralSource: "फ्लोरल स्रोत",
    notRecorded: "रिकॉर्ड नहीं है",
    harvested: "हार्वेस्टेड",
    harvestDate: "हार्वेस्ट तिथि",
    quantity: "मात्रा",
    hive: "हाइव",
    apiary: "एपियरी",
    supplyChain: "सप्लाई चेन",
    custodyText: "इस बैच के लिए दर्ज की गई हर कस्टडी ट्रांज़िशन।",
    consumerView: "कंज़्यूमर व्यू",
    recorded: "रिकॉर्डेड",
    notRecordedYet: "अभी रिकॉर्ड नहीं है",
    actor: "जिम्मेदार व्यक्ति",
    location: "स्थान",
    notes: "नोट्स",
    blockchain: "ब्लॉकचेन प्रूफ",
    proofText: "इस बैच का कैनोनिकल प्रूफ हैश।",
    noProof: "कोई प्रूफ हैश उपलब्ध नहीं",
    transaction: "ट्रांज़ैक्शन देखें",
    passport: "हनी पासपोर्ट",
    scanText: "बैच सत्यापित करने के लिए स्कैन करें",
    origin: "स्रोत",
    beekeeper: "मधुमक्खी पालक",
    organization: "संगठन",
    device: "ESP32 डिवाइस",
    verification: "सत्यापन",
    verified: "सत्यापित",
    pending: "लंबित",
    event: "इवेंट",
    events: "इवेंट",
    openConsumer: "कंज़्यूमर सत्यापन खोलें",
  },
} as const;

function getCopy(language: string) {
  if (language === "bn") return copy.bn;
  if (language === "hi") return copy.hi;
  return copy.en;
}

function prettyStep(step: string, language: string) {
  const labels = {
    en: {
      harvest: "Harvest",
      processing: "Processing",
      packaging: "Packaging",
      shipment: "Shipment",
      delivery: "Delivery",
    },

    bn: {
      harvest: "সংগ্রহ",
      processing: "প্রক্রিয়াকরণ",
      packaging: "প্যাকেজিং",
      shipment: "শিপমেন্ট",
      delivery: "ডেলিভারি",
    },

    hi: {
      harvest: "हार्वेस्ट",
      processing: "प्रोसेसिंग",
      packaging: "पैकेजिंग",
      shipment: "शिपमेंट",
      delivery: "डिलीवरी",
    },
  } as const;

  const lang =
    language === "bn" || language === "hi" ? language : "en";

  return (
    labels[lang][
      step as keyof (typeof labels)[typeof lang]
    ] ?? step
  );
}

function formatDate(value?: string | null, language = "en") {
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

function formatDateTime(value: string, language = "en") {
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

function transactionUrl(value?: string | null) {
  if (!value) return null;

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `https://sepolia.etherscan.io/tx/${value}`;
}

export default function BatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { language } = useLanguage();
  const d = getCopy(language);

  const [batch, setBatch] = useState<BatchDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getBatch(id);

        if (!cancelled) {
          setBatch(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : d.failed
          );
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id, d.failed]);

  const verifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/trace/${
          batch?.id ?? id
        }`
      : `/trace/${batch?.id ?? id}`;

  const completed = useMemo(
    () =>
      new Set(
        (batch?.events ?? []).map(
          (event) => event.event_type
        )
      ),
    [batch?.events]
  );

  void completed;

  if (error) {
    return (
      <main
        className="min-h-screen bg-[#F7F3EA] px-5 py-8 text-[#292621]"
        style={{
          fontFamily:
            'system-ui, "Segoe UI", "Noto Sans Bengali", "Noto Sans Devanagari", "Noto Sans", sans-serif',
        }}
      >
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E2D8C7] bg-white p-6 shadow-sm">
          <p className="text-base font-semibold">
            {error}
          </p>

          <Link
            href="/batches"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#292621] px-4 text-sm font-medium text-white"
          >
            <ArrowLeft size={17} />
            {d.back}
          </Link>
        </div>
      </main>
    );
  }

  if (!batch) {
    return (
      <main
        className="min-h-screen bg-[#F7F3EA] px-5 py-8 text-[#292621]"
        style={{
          fontFamily:
            'system-ui, "Segoe UI", "Noto Sans Bengali", "Noto Sans Devanagari", "Noto Sans", sans-serif',
        }}
      >
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E2D8C7] bg-white p-6 shadow-sm">
          <div className="h-4 w-32 animate-pulse rounded bg-[#E8E0D3]" />

          <div className="mt-4 h-8 w-64 animate-pulse rounded bg-[#E8E0D3]" />

          <p className="mt-5 text-sm text-[#756B5F]">
            {d.loading}
          </p>
        </div>
      </main>
    );
  }

  const txUrl = transactionUrl(
    batch.blockchain_tx_hash
  );

  const eventCount = batch.events?.length ?? 0;

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#292621]"
      style={{
        fontFamily:
          'system-ui, "Segoe UI", "Noto Sans Bengali", "Noto Sans Devanagari", "Noto Sans", sans-serif',
      }}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-[#E4DAC9] bg-[#F7F3EA]/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-[68px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/batches"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#DCD1BF] bg-white text-[#5F574E] transition hover:border-[#C88616] hover:bg-[#FFF8E8]"
            aria-label={d.back}
          >
            <ArrowLeft size={19} />
          </Link>

          <div className="min-w-0 flex-1 px-2">
            <p className="truncate text-[15px] font-semibold text-[#292621]">
              HoneyChain
            </p>

            <p className="truncate text-[11px] font-medium uppercase tracking-[0.16em] text-[#7A7064]">
              {d.batch}
            </p>
          </div>

          <LanguageSelector />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        {/* TOP ACTIONS */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/batches"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-sm font-medium text-[#6D645A] hover:text-[#A86600]"
          >
            <ArrowLeft size={16} />
            {d.back}
          </Link>

          <Link
            href={`/trace/${batch.id}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#DCCFB9] bg-white px-3.5 text-sm font-medium text-[#514A42] shadow-sm hover:border-[#C88616]"
          >
            {d.consumerView}
            <ExternalLink size={15} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* MAIN */}
          <section className="min-w-0 space-y-5">
            {/* BATCH OVERVIEW */}
            <section className="rounded-2xl border border-[#E0D6C6] bg-white shadow-sm">
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9B5E00]">
                        {d.batch}
                      </span>

                      <span className="rounded-full border border-[#E7C96D] bg-[#FFFBF0] px-3 py-1 text-[12px] font-semibold capitalize text-[#9B5E00]">
                        {batch.status || d.pending}
                      </span>
                    </div>

                    <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-[#292621] sm:text-3xl">
                      {batch.batch_code}
                    </h1>

                    <p className="mt-1.5 text-base font-medium text-[#514A42]">
                      {batch.honey_type || d.rawHoney}
                    </p>

                    <p className="mt-1 text-sm text-[#70675D]">
                      {d.floralSource}:{" "}
                      <span className="font-medium text-[#514A42]">
                        {batch.floral_source ||
                          d.notRecorded}
                      </span>
                    </p>
                  </div>
                </div>

                {/* METRICS */}
                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <Metric
                    label={d.harvestDate}
                    value={formatDate(
                      batch.harvest_date,
                      language
                    )}
                  />

                  <Metric
                    label={d.quantity}
                    value={
                      batch.harvested_weight_kg != null
                        ? `${batch.harvested_weight_kg.toFixed(
                            2
                          )} kg`
                        : "—"
                    }
                  />

                  <Metric
                    label={d.hive}
                    value={
                      batch.hive?.hive_code || "—"
                    }
                  />

                  <Metric
                    label={d.apiary}
                    value={
                      batch.hive?.apiary_id
                        ? batch.hive.apiary_id.slice(0, 8)
                        : "—"
                    }
                  />
                </div>
              </div>
            </section>

            {/* SUPPLY CHAIN */}
            <section className="rounded-2xl border border-[#E0D6C6] bg-white shadow-sm">
              <div className="border-b border-[#ECE4D7] px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#292621]">
                      {d.supplyChain}
                    </h2>

                    <p className="mt-0.5 text-sm text-[#746B61]">
                      {d.custodyText}
                    </p>
                  </div>

                  <span className="text-sm font-medium text-[#756B60]">
                    {eventCount}{" "}
                    {eventCount === 1
                      ? d.event
                      : d.events}
                  </span>
                </div>
              </div>

              <div className="px-5 py-4 sm:px-6">
                <div className="divide-y divide-[#EEE7DC]">
                  {steps.map((step, index) => {
                    const event =
                      batch.events.find(
                        (item) =>
                          item.event_type === step
                      );

                    const done = Boolean(event);

                    return (
                      <div
                        key={step}
                        className="flex gap-3.5 py-4 first:pt-1 last:pb-1"
                      >
                        {/* STEP ICON */}
                        <div className="flex w-7 shrink-0 flex-col items-center">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                              done
                                ? "border-[#9AD9BD] bg-[#ECFFF5] text-[#138A59]"
                                : "border-[#DCD4C7] bg-[#FAF8F3] text-[#9B9185]"
                            }`}
                          >
                            {done ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <Circle size={13} />
                            )}
                          </div>

                          {index <
                            steps.length - 1 && (
                            <div className="mt-1 h-full min-h-5 w-px bg-[#E8E0D4]" />
                          )}
                        </div>

                        {/* STEP CONTENT */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-[15px] font-semibold text-[#35302B]">
                              {prettyStep(
                                step,
                                language
                              )}
                            </h3>

                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                done
                                  ? "bg-[#ECFFF5] text-[#138A59]"
                                  : "bg-[#F3EFE8] text-[#81776C]"
                              }`}
                            >
                              {done
                                ? d.recorded
                                : d.pending}
                            </span>
                          </div>

                          {event ? (
                            <div className="mt-2 space-y-1.5 text-sm text-[#625A51]">
                              <p>
                                <span className="font-semibold text-[#4C453E]">
                                  {d.actor}:
                                </span>{" "}
                                {event.actor_id ||
                                  "—"}
                              </p>

                              {event.location_name && (
                                <p className="flex items-center gap-1.5">
                                  <MapPin
                                    size={14}
                                    className="shrink-0 text-[#A86600]"
                                  />

                                  <span className="break-words">
                                    {
                                      event.location_name
                                    }
                                  </span>
                                </p>
                              )}

                              {event.quantity_kg !=
                                null && (
                                <p>
                                  <span className="font-semibold text-[#4C453E]">
                                    {d.quantity}:
                                  </span>{" "}
                                  {event.quantity_kg.toFixed(
                                    2
                                  )}{" "}
                                  kg
                                </p>
                              )}

                              {event.notes && (
                                <p>
                                  <span className="font-semibold text-[#4C453E]">
                                    {d.notes}:
                                  </span>{" "}
                                  {event.notes}
                                </p>
                              )}

                              <p className="text-[13px] text-[#80766B]">
                                {formatDateTime(
                                  event.created_at,
                                  language
                                )}
                              </p>
                            </div>
                          ) : (
                            <p className="mt-1.5 text-sm text-[#857B70]">
                              {d.notRecordedYet}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* BLOCKCHAIN */}
            <section className="rounded-2xl border border-[#E0D6C6] bg-white shadow-sm">
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F8FF] text-[#456B9B]">
                    <ShieldCheck size={20} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-[#292621]">
                      {d.blockchain}
                    </h2>

                    <p className="mt-0.5 text-sm text-[#746B61]">
                      {d.proofText}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#E4DCCF] bg-[#FAF8F3] p-4">
                  <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#756B60]">
                    <Hash size={14} />
                    {d.verification}
                  </div>

                  <p className="break-all font-mono text-[13px] leading-6 text-[#4E4943]">
                    {batch.blockchain_hash ||
                      d.noProof}
                  </p>
                </div>

                {txUrl && (
                  <a
                    href={txUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#D9CEBD] bg-white px-3.5 text-sm font-semibold text-[#9A5D00] hover:border-[#C88616] hover:bg-[#FFF8E8]"
                  >
                    {d.transaction}
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </section>
          </section>

          {/* RIGHT RAIL */}
          <aside className="space-y-5 lg:sticky lg:top-[88px] lg:self-start">
            {/* QR */}
            <section className="rounded-2xl border border-[#E0D6C6] bg-white p-5 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <QrCode
                  size={18}
                  className="text-[#A86600]"
                />

                <h2 className="text-base font-bold text-[#292621]">
                  {d.passport}
                </h2>
              </div>

              <p className="mt-1 text-sm text-[#746B61]">
                {d.scanText}
              </p>

              <div className="mx-auto mt-4 w-fit rounded-xl border border-[#E5DDD1] bg-white p-3">
                <QRCodeSVG
                  value={verifyUrl}
                  size={190}
                  includeMargin
                />
              </div>

              <Link
                href={`/trace/${batch.id}`}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#292621] px-4 text-sm font-semibold text-white hover:bg-[#403B35]"
              >
                {d.openConsumer}
              </Link>
            </section>

            {/* ORIGIN */}
            <section className="rounded-2xl border border-[#E0D6C6] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={18}
                  className="text-[#138A59]"
                />

                <h2 className="text-base font-bold text-[#292621]">
                  {d.origin}
                </h2>
              </div>

              <div className="mt-4 divide-y divide-[#EEE7DC]">
                <InfoRow
                  label={d.beekeeper}
                  value={
                    batch.beekeeper?.name || "—"
                  }
                />

                <InfoRow
                  label={d.organization}
                  value={
                    batch.beekeeper?.organization ||
                    "—"
                  }
                />

                <InfoRow
                  label={d.hive}
                  value={
                    batch.hive?.hive_code || "—"
                  }
                />

                <InfoRow
                  label={d.device}
                  value={
                    batch.hive?.esp32_device_id ||
                    "—"
                  }
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[#E6DED2] bg-[#FBF9F5] px-3.5 py-3">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7C7267]">
        {label}
      </p>

      <p className="mt-1 truncate text-[15px] font-semibold text-[#37312C]">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="shrink-0 text-[13px] font-medium text-[#7A7065]">
        {label}
      </dt>

      <dd className="min-w-0 break-words text-right text-[14px] font-semibold text-[#413A34]">
        {value}
      </dd>
    </div>
  );
}