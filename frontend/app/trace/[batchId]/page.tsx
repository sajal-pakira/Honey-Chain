"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Hexagon,
  MapPin,
  ShieldCheck,
  Sprout,
  Weight,
} from "lucide-react";

import {
  BatchDetails,
  getBatch,
  verifyBatchOnChain,
} from "@/lib/batch-api";

import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

const steps = [
  "harvest",
  "processing",
  "packaging",
  "shipment",
  "delivery",
] as const;

type LanguageKey = "en" | "bn" | "hi";

type TranslationSet = {
  publicVerification: string;
  verifiedPassport: string;
  registeredMessage: string;

  rawHoney: string;
  notRecorded: string;

  origin: string;
  traceability: string;
  traceabilityDescription: string;

  hive: string;
  esp32Device: string;
  beekeeper: string;
  organization: string;
  harvestQuantity: string;
  harvestDate: string;

  harvest: string;
  processing: string;
  packaging: string;
  shipment: string;
  delivery: string;

  notRecordedYet: string;
  kgRecorded: string;
  transaction: string;

  cryptographicProof: string;
  proofDescription: string;
  sha256: string;

  verifyingBlockchain: string;
  blockchainVerified: string;
  blockchainVerifiedDescription: string;
  blockchainFailed: string;
  blockchainFailedDescription: string;
  ethereumSepolia: string;

  poweredBy: string;
  batchId: string;

  back: string;
  honeyChain: string;

  verificationUnavailable: string;
  invalidBatch: string;
  batchNotFound: string;
  unableToVerifyEthereum: string;
};

const translations: Record<LanguageKey, TranslationSet> = {
  en: {
    publicVerification: "Public verification",
    verifiedPassport: "Verified Honey Passport",
    registeredMessage:
      "This batch is registered in the HoneyChain traceability system.",

    rawHoney: "Raw Honey",
    notRecorded: "Not recorded",

    origin: "Origin",
    traceability: "Traceability",
    traceabilityDescription:
      "Every recorded custody transition appears below.",

    hive: "Hive",
    esp32Device: "ESP32 Device",
    beekeeper: "Beekeeper",
    organization: "Organization",
    harvestQuantity: "Harvest quantity",
    harvestDate: "Harvest date",

    harvest: "Harvest",
    processing: "Processing",
    packaging: "Packaging",
    shipment: "Shipment",
    delivery: "Delivery",

    notRecordedYet: "Not recorded yet",
    kgRecorded: "kg recorded",
    transaction: "Transaction",

    cryptographicProof: "Cryptographic proof",
    proofDescription:
      "This proof identifies the registered batch record.",
    sha256: "SHA-256",

    verifyingBlockchain: "Verifying blockchain proof...",
    blockchainVerified: "Blockchain proof verified",
    blockchainVerifiedDescription:
      "The SHA-256 proof matches the record stored on Ethereum Sepolia.",
    blockchainFailed: "Blockchain verification failed",
    blockchainFailedDescription:
      "The stored proof could not be verified.",
    ethereumSepolia: "Ethereum Sepolia",

    poweredBy: "Powered by HoneyChain",
    batchId: "Batch ID",

    back: "Back to HoneyChain",
    honeyChain: "HoneyChain",

    verificationUnavailable: "Verification unavailable",
    invalidBatch: "Invalid batch ID.",
    batchNotFound: "Batch could not be found.",
    unableToVerifyEthereum:
      "Unable to verify against Ethereum.",
  },

  bn: {
    publicVerification: "সর্বজনীন যাচাই",
    verifiedPassport: "যাচাইকৃত Honey Passport",
    registeredMessage:
      "এই ব্যাচটি HoneyChain ট্রেসেবিলিটি সিস্টেমে নিবন্ধিত।",

    rawHoney: "কাঁচা মধু",
    notRecorded: "রেকর্ড করা নেই",

    origin: "উৎস",
    traceability: "ট্রেসেবিলিটি",
    traceabilityDescription:
      "রেকর্ড করা প্রতিটি সরবরাহ ও মালিকানা পরিবর্তন নিচে দেখানো হয়েছে।",

    hive: "মৌচাক",
    esp32Device: "ESP32 ডিভাইস",
    beekeeper: "মৌমাছি পালনকারী",
    organization: "প্রতিষ্ঠান",
    harvestQuantity: "সংগ্রহের পরিমাণ",
    harvestDate: "সংগ্রহের তারিখ",

    harvest: "সংগ্রহ",
    processing: "প্রক্রিয়াকরণ",
    packaging: "প্যাকেজিং",
    shipment: "শিপমেন্ট",
    delivery: "ডেলিভারি",

    notRecordedYet: "এখনও রেকর্ড করা হয়নি",
    kgRecorded: "কেজি রেকর্ড করা হয়েছে",
    transaction: "লেনদেন",

    cryptographicProof: "ক্রিপ্টোগ্রাফিক প্রমাণ",
    proofDescription:
      "এই প্রমাণটি নিবন্ধিত ব্যাচ রেকর্ডকে শনাক্ত করে।",
    sha256: "SHA-256",

    verifyingBlockchain: "ব্লকচেইন প্রমাণ যাচাই করা হচ্ছে...",
    blockchainVerified: "ব্লকচেইন প্রমাণ যাচাই হয়েছে",
    blockchainVerifiedDescription:
      "SHA-256 প্রমাণটি Ethereum Sepolia-তে সংরক্ষিত রেকর্ডের সঙ্গে মিলে গেছে।",
    blockchainFailed: "ব্লকচেইন যাচাই ব্যর্থ",
    blockchainFailedDescription:
      "সংরক্ষিত প্রমাণটি যাচাই করা যায়নি।",
    ethereumSepolia: "Ethereum Sepolia",

    poweredBy: "HoneyChain দ্বারা পরিচালিত",
    batchId: "ব্যাচ ID",

    back: "HoneyChain-এ ফিরে যান",
    honeyChain: "HoneyChain",

    verificationUnavailable: "যাচাই করা সম্ভব নয়",
    invalidBatch: "ব্যাচ ID সঠিক নয়।",
    batchNotFound: "ব্যাচটি খুঁজে পাওয়া যায়নি।",
    unableToVerifyEthereum:
      "Ethereum-এর সঙ্গে যাচাই করা যায়নি।",
  },

  hi: {
    publicVerification: "सार्वजनिक सत्यापन",
    verifiedPassport: "सत्यापित Honey Passport",
    registeredMessage:
      "यह बैच HoneyChain ट्रेसेबिलिटी सिस्टम में पंजीकृत है।",

    rawHoney: "कच्चा शहद",
    notRecorded: "रिकॉर्ड नहीं किया गया",

    origin: "उत्पत्ति",
    traceability: "ट्रेसेबिलिटी",
    traceabilityDescription:
      "रिकॉर्ड किए गए प्रत्येक कस्टडी ट्रांज़िशन को नीचे दिखाया गया है।",

    hive: "मधुमक्खी का छत्ता",
    esp32Device: "ESP32 डिवाइस",
    beekeeper: "मधुमक्खी पालक",
    organization: "संगठन",
    harvestQuantity: "संग्रह मात्रा",
    harvestDate: "संग्रह तिथि",

    harvest: "संग्रह",
    processing: "प्रोसेसिंग",
    packaging: "पैकेजिंग",
    shipment: "शिपमेंट",
    delivery: "डिलीवरी",

    notRecordedYet: "अभी रिकॉर्ड नहीं किया गया",
    kgRecorded: "किग्रा रिकॉर्ड किया गया",
    transaction: "ट्रांज़ैक्शन",

    cryptographicProof: "क्रिप्टोग्राफिक प्रमाण",
    proofDescription:
      "यह प्रमाण पंजीकृत बैच रिकॉर्ड की पहचान करता है।",
    sha256: "SHA-256",

    verifyingBlockchain: "ब्लॉकचेन प्रमाण सत्यापित किया जा रहा है...",
    blockchainVerified: "ब्लॉकचेन प्रमाण सत्यापित",
    blockchainVerifiedDescription:
      "SHA-256 प्रमाण Ethereum Sepolia पर संग्रहीत रिकॉर्ड से मेल खाता है।",
    blockchainFailed: "ब्लॉकचेन सत्यापन विफल",
    blockchainFailedDescription:
      "संग्रहीत प्रमाण को सत्यापित नहीं किया जा सका।",
    ethereumSepolia: "Ethereum Sepolia",

    poweredBy: "HoneyChain द्वारा संचालित",
    batchId: "बैच ID",

    back: "HoneyChain पर वापस जाएँ",
    honeyChain: "HoneyChain",

    verificationUnavailable: "सत्यापन उपलब्ध नहीं",
    invalidBatch: "अमान्य बैच ID।",
    batchNotFound: "बैच नहीं मिला।",
    unableToVerifyEthereum:
      "Ethereum के विरुद्ध सत्यापन नहीं हो सका।",
  },
};

function normalizeLanguage(value: unknown): LanguageKey {
  if (value === "bn" || value === "hi") {
    return value;
  }

  return "en";
}

export default function TracePage() {
  /*
   * IMPORTANT:
   * The project's LanguageContextType does not expose `lang`.
   *
   * We intentionally don't destructure `lang` here.
   * The page remains compatible with the existing provider.
   */
  const languageContext = useLanguage() as unknown as {
    language?: unknown;
    locale?: unknown;
    currentLanguage?: unknown;
    selectedLanguage?: unknown;
  };

  const languageValue =
    languageContext.language ??
    languageContext.locale ??
    languageContext.currentLanguage ??
    languageContext.selectedLanguage ??
    "en";

  const language = normalizeLanguage(languageValue);

  const t = translations[language];

  const [batch, setBatch] = useState<BatchDetails | null>(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  const [blockchainVerified, setBlockchainVerified] =
    useState<boolean | null>(null);

  const [
    blockchainVerificationLoading,
    setBlockchainVerificationLoading,
  ] = useState(true);

  const [
    blockchainVerificationReason,
    setBlockchainVerificationReason,
  ] = useState("");

  useEffect(() => {
    const pathname = window.location.pathname;

    const parts = pathname
      .split("/")
      .filter(Boolean);

    const batchId = parts[1];

    if (!batchId) {
      setError(t.invalidBatch);
      setLoading(false);
      setBlockchainVerificationLoading(false);
      return;
    }

    let cancelled = false;

    async function loadBatch() {
      try {
        const data = await getBatch(batchId);

        if (cancelled) return;

        setBatch(data);
        setLoading(false);

        try {
          setBlockchainVerificationLoading(true);

          const verification =
            await verifyBatchOnChain(batchId);

          if (cancelled) return;

          setBlockchainVerified(
            Boolean(verification.verified)
          );

          setBlockchainVerificationReason(
            verification.reason || ""
          );
        } catch (verificationError) {
          if (cancelled) return;

          console.error(
            "HoneyChain blockchain verification error:",
            verificationError
          );

          setBlockchainVerified(false);

          setBlockchainVerificationReason(
            t.unableToVerifyEthereum
          );
        } finally {
          if (!cancelled) {
            setBlockchainVerificationLoading(false);
          }
        }
      } catch (err) {
        if (cancelled) return;

        console.error(
          "HoneyChain trace error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : t.batchNotFound
        );

        setLoading(false);
        setBlockchainVerificationLoading(false);
      }
    }

    loadBatch();

    return () => {
      cancelled = true;
    };
  }, [
    t.invalidBatch,
    t.unableToVerifyEthereum,
    t.batchNotFound,
  ]);

  const completed = useMemo(() => {
    return new Set(
      (batch?.events ?? []).map((event) =>
        event.event_type.toLowerCase()
      )
    );
  }, [batch?.events]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main
        className="min-h-screen bg-[#F7F3EA] text-[#292621]"
        style={pageFont}
      >
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-5">
          <div className="w-full rounded-2xl border border-[#E2D8C7] bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF3D6]">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E7D8B9] border-t-[#B66A00]" />
            </div>

            <p className="mt-4 text-base font-medium text-[#403A34]">
              {t.verifyingBlockchain}
            </p>

            <p className="mt-1 text-sm text-[#756B5F]">
              HoneyChain
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !batch) {
    return (
      <main
        className="min-h-screen bg-[#F7F3EA] text-[#292621]"
        style={pageFont}
      >
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-5">
          <div className="w-full rounded-2xl border border-[#E2D8C7] bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0EE] text-[#B42318]">
              <ShieldCheck size={23} />
            </div>

            <h1 className="mt-5 text-xl font-semibold text-[#292621]">
              {t.verificationUnavailable}
            </h1>

            <p className="mt-2 break-words text-sm leading-6 text-[#756B5F]">
              {error || t.batchNotFound}
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#292621] px-4 text-sm font-medium text-white transition hover:bg-[#403A34]"
            >
              <ArrowLeft size={17} />
              {t.back}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const txUrl = batch.blockchain_tx_hash
    ? `https://sepolia.etherscan.io/tx/${batch.blockchain_tx_hash}`
    : null;

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#292621]"
      style={pageFont}
    >
      {/* HEADER */}

      <header className="border-b border-[#E3D8C7] bg-[#F7F3EA]">
        <div className="mx-auto flex min-h-[68px] max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-[#403A34] transition hover:text-[#A86600]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#292621] text-[#F8C85B]">
              <Hexagon size={17} />
            </div>

            <span>{t.honeyChain}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-[#DCCFB9] bg-white px-3 py-1.5 text-[11px] font-medium text-[#6D645A] sm:flex">
              <ShieldCheck size={13} />
              {t.publicVerification}
            </div>

            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-3xl px-4 pb-12 pt-5 sm:px-6 sm:pt-7">
        <Link
          href="/batches"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-sm font-medium text-[#6D645A] transition hover:text-[#A86600]"
        >
          <ArrowLeft size={16} />
          {t.back}
        </Link>

        {/* VERIFIED HEADER */}

        <section className="mt-5 rounded-2xl border border-[#DCD5C8] bg-white p-5 shadow-sm sm:p-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#B9DEC8] bg-[#EDF8F1] text-[#16834B]">
              <CheckCircle2
                size={28}
                strokeWidth={1.8}
              />
            </div>

            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#16834B]">
              {t.verifiedPassport}
            </p>

            <h1 className="mt-2 break-all font-mono text-2xl font-semibold tracking-tight text-[#292621] sm:text-3xl">
              {batch.batch_code}
            </h1>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#756B5F]">
              {t.registeredMessage}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Tag
                value={
                  batch.honey_type ||
                  t.rawHoney
                }
              />

              {batch.floral_source && (
                <Tag
                  value={batch.floral_source}
                />
              )}

              <Tag
                value={`${Number(
                  batch.harvested_weight_kg
                ).toFixed(2)} kg`}
              />
            </div>
          </div>
        </section>

        {/* ORIGIN */}

        <section className="mt-4 rounded-2xl border border-[#DCD5C8] bg-white p-5 shadow-sm sm:p-6">
          <SectionTitle
            icon={<Sprout size={17} />}
            title={t.origin}
          />

          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3">
            <Info
              icon={<Hexagon size={14} />}
              label={t.hive}
              value={
                batch.hive?.hive_code ||
                t.notRecorded
              }
            />

            <Info
              label={t.esp32Device}
              value={
                batch.hive?.esp32_device_id ||
                t.notRecorded
              }
            />

            <Info
              label={t.beekeeper}
              value={
                batch.beekeeper?.name ||
                t.notRecorded
              }
            />

            <Info
              label={t.organization}
              value={
                batch.beekeeper?.organization ||
                t.notRecorded
              }
            />

            <Info
              icon={<Weight size={14} />}
              label={t.harvestQuantity}
              value={`${Number(
                batch.harvested_weight_kg
              ).toFixed(2)} kg`}
            />

            <Info
              label={t.harvestDate}
              value={formatDate(
                batch.harvest_date
              )}
            />
          </div>
        </section>

        {/* TRACEABILITY */}

        <section className="mt-4 rounded-2xl border border-[#DCD5C8] bg-white p-5 shadow-sm sm:p-6">
          <SectionTitle
            icon={<ShieldCheck size={17} />}
            title={t.traceability}
          />

          <p className="mt-2 text-sm leading-5 text-[#756B5F]">
            {t.traceabilityDescription}
          </p>

          <div className="mt-6">
            {steps.map((step, index) => {
              const event =
                batch.events?.find(
                  (item) =>
                    item.event_type.toLowerCase() ===
                    step
                );

              const done =
                completed.has(step);

              return (
                <div
                  key={step}
                  className="flex gap-3.5"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                        done
                          ? "border-[#B9DEC8] bg-[#EDF8F1] text-[#16834B]"
                          : "border-[#DDD5C8] bg-[#F8F5EF] text-[#A39A8F]"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Clock3 size={15} />
                      )}
                    </div>

                    {index <
                      steps.length - 1 && (
                      <div className="my-1 h-14 w-px bg-[#E5DED2]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-6">
                    <p
                      className={`text-sm font-semibold ${
                        done
                          ? "text-[#403A34]"
                          : "text-[#A39A8F]"
                      }`}
                    >
                      {getStepLabel(step, t)}
                    </p>

                    {event ? (
                      <div className="mt-1.5 space-y-1.5">
                        <p className="text-sm text-[#756B5F]">
                          {formatDate(
                            event.created_at
                          )}
                        </p>

                        {event.location_name && (
                          <p className="flex items-center gap-1.5 text-sm text-[#756B5F]">
                            <MapPin
                              size={14}
                              className="shrink-0"
                            />

                            <span className="break-words">
                              {event.location_name}
                            </span>
                          </p>
                        )}

                        {event.quantity_kg !==
                          undefined &&
                          event.quantity_kg !==
                            null && (
                            <p className="text-sm font-medium text-[#5F574E]">
                              {Number(
                                event.quantity_kg
                              ).toFixed(2)}{" "}
                              {t.kgRecorded}
                            </p>
                          )}

                        {event.notes && (
                          <p className="break-words text-sm leading-5 text-[#756B5F]">
                            {event.notes}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-[#AAA197]">
                        {t.notRecordedYet}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BLOCKCHAIN */}

        <section className="mt-4 rounded-2xl border border-[#DCD5C8] bg-white p-5 shadow-sm sm:p-6">
          <SectionTitle
            icon={<ShieldCheck size={17} />}
            title={t.cryptographicProof}
          />

          <p className="mt-2 text-sm leading-5 text-[#756B5F]">
            {t.proofDescription}
          </p>

          <div className="mt-5 rounded-xl border border-[#E5DED2] bg-[#F8F5EF] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A7F72]">
              {t.sha256}
            </p>

            <p className="mt-2 break-all font-mono text-xs leading-5 text-[#A86600]">
              {batch.blockchain_hash ||
                t.notRecorded}
            </p>
          </div>

          <div className="mt-4">
            {blockchainVerificationLoading ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#E5D5B5] bg-[#FFF9EC] p-4 text-sm font-medium text-[#9A6100]">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E9DDBF] border-t-[#B66A00]" />
                {t.verifyingBlockchain}
              </div>
            ) : blockchainVerified ? (
              <div className="rounded-xl border border-[#B9DEC8] bg-[#EDF8F1] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#16834B]">
                  <CheckCircle2 size={17} />
                  {t.blockchainVerified}
                </div>

                <p className="mt-2 text-sm leading-5 text-[#4F6B59]">
                  {t.blockchainVerifiedDescription}
                </p>

                {batch.blockchain_tx_hash && (
                  <div className="mt-4 border-t border-[#CFE7D7] pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#66816F]">
                      {t.transaction}
                    </p>

                    <p className="mt-1 break-all font-mono text-xs leading-5 text-[#52665A]">
                      {batch.blockchain_tx_hash}
                    </p>

                    {txUrl && (
                      <a
                        href={txUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#B9DEC8] bg-white px-3 text-sm font-medium text-[#16834B] transition hover:bg-[#F7FCF9]"
                      >
                        {t.ethereumSepolia}
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-[#E8C8C3] bg-[#FFF3F1] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#B42318]">
                  <ShieldCheck size={17} />
                  {t.blockchainFailed}
                </div>

                <p className="mt-2 text-sm leading-5 text-[#7A4A45]">
                  {blockchainVerificationReason ||
                    t.blockchainFailedDescription}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}

        <footer className="px-2 pb-5 pt-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A39A8F]">
            {t.poweredBy}
          </p>

          <p className="mt-2 text-xs text-[#AAA197]">
            {t.batchId}:{" "}
            <span className="break-all font-mono">
              {batch.id}
            </span>
          </p>
        </footer>
      </div>
    </main>
  );
}

/* =========================================================
   HELPERS
========================================================= */

const pageFont = {
  fontFamily:
    'system-ui, "Segoe UI", "Noto Sans Bengali", "Noto Sans Devanagari", "Noto Sans", sans-serif',
};

function getStepLabel(
  step: (typeof steps)[number],
  t: TranslationSet
) {
  const labels: Record<
    (typeof steps)[number],
    string
  > = {
    harvest: t.harvest,
    processing: t.processing,
    packaging: t.packaging,
    shipment: t.shipment,
    delivery: t.delivery,
  };

  return labels[step];
}

function formatDate(
  date: string | null | undefined
) {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#B66A00]">
        {icon}
      </span>

      <h2 className="text-base font-semibold text-[#403A34]">
        {title}
      </h2>
    </div>
  );
}

/* =========================================================
   TAG
========================================================= */

function Tag({
  value,
}: {
  value: string;
}) {
  return (
    <span className="max-w-full break-words rounded-full border border-[#DED5C7] bg-[#FAF7F1] px-3 py-1.5 text-xs font-medium text-[#655C52]">
      {value}
    </span>
  );
}

/* =========================================================
   INFO
========================================================= */

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A7F72]">
        {icon}

        <span className="truncate">
          {label}
        </span>
      </div>

      <p className="mt-1.5 break-words text-sm font-medium leading-5 text-[#403A34]">
        {value}
      </p>
    </div>
  );
}