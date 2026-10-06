"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  ArrowLeft,
  Cpu,
  Droplets,
  MapPin,
  Radio,
  Scale,
  Thermometer,
  Waves,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getHives, getHiveReadings } from "@/lib/api";
import LanguageSelector from "@/components/LanguageSelector";
import MobileNav from "@/components/MobileNav";
import { useLanguage } from "@/components/LanguageProvider";

interface Hive {
  id: string;
  hive_code: string;
  apiary_id: string;
  esp32_device_id?: string;
  status: string;
}

interface SensorReading {
  id: number;
  hive_id: string;
  temperature_c?: number;
  humidity_percent?: number;
  hive_weight_kg?: number;
  sound_level?: number;
  latitude?: number;
  longitude?: number;
  recorded_at: string;
}

interface HivePageProps {
  params: Promise<{
    id: string;
  }>;
}

/* =============================================================
   PAGE TRANSLATIONS
============================================================= */

const pageTranslations = {
  en: {
    honeyChain: "HoneyChain",
    hiveIntelligence: "Hive Intelligence",

    backToHives: "Back to hives",
    hiveNotFound: "Hive not found",
    unableToLoad: "Unable to load the requested hive telemetry.",

    refresh: "Refresh",

    deviceOnline: "Device Online",
    deviceOffline: "Device Offline",

    liveDescription:
      "Live telemetry and historical environmental data from this HoneyChain-connected hive.",

    device: "Device",
    status: "Status",
    unassigned: "Unassigned",

    currentTelemetry: "Current telemetry",

    temperature: "Temperature",
    humidity: "Humidity",
    weight: "Weight",
    acoustic: "Acoustic",

    historicalTemperature: "Historical temperature readings",
    historicalHumidity: "Historical humidity readings",
    recordedHiveWeight: "Recorded hive weight",
    rawAcoustic: "Raw acoustic sensor readings",

    hiveWeight: "Hive weight",
    acousticActivity: "Acoustic activity",

    hiveLocation: "Hive location",
    gpsCoordinates: "GPS coordinates",
    latitude: "Latitude",
    longitude: "Longitude",
    noGps: "No GPS data available.",

    deviceInformation: "Device information",
    hiveId: "Hive ID",
    apiaryId: "Apiary ID",
    esp32: "ESP32",
    notAssigned: "Not assigned",
    lastReading: "Last reading",
    noReading: "No reading",

    latestTelemetryReceived: "Latest telemetry received",
    reading: "READING",

    waitingForTelemetry: "Waiting for telemetry history",

    unableToLoadTelemetry: "Unable to load hive telemetry.",
  },

  bn: {
    honeyChain: "HoneyChain",
    hiveIntelligence: "হাইভ ইন্টেলিজেন্স",

    backToHives: "হাইভগুলিতে ফিরে যান",
    hiveNotFound: "হাইভ পাওয়া যায়নি",
    unableToLoad: "অনুরোধ করা হাইভের টেলিমেট্রি লোড করা যাচ্ছে না।",

    refresh: "রিফ্রেশ",

    deviceOnline: "ডিভাইস অনলাইন",
    deviceOffline: "ডিভাইস অফলাইন",

    liveDescription:
      "এই HoneyChain-সংযুক্ত হাইভের লাইভ টেলিমেট্রি এবং ঐতিহাসিক পরিবেশগত ডেটা।",

    device: "ডিভাইস",
    status: "স্ট্যাটাস",
    unassigned: "অ্যাসাইন করা নেই",

    currentTelemetry: "বর্তমান টেলিমেট্রি",

    temperature: "তাপমাত্রা",
    humidity: "আর্দ্রতা",
    weight: "ওজন",
    acoustic: "অ্যাকোস্টিক",

    historicalTemperature: "ঐতিহাসিক তাপমাত্রার রিডিং",
    historicalHumidity: "ঐতিহাসিক আর্দ্রতার রিডিং",
    recordedHiveWeight: "রেকর্ড করা হাইভের ওজন",
    rawAcoustic: "র’ অ্যাকোস্টিক সেন্সর রিডিং",

    hiveWeight: "হাইভের ওজন",
    acousticActivity: "অ্যাকোস্টিক কার্যকলাপ",

    hiveLocation: "হাইভের অবস্থান",
    gpsCoordinates: "GPS কোঅর্ডিনেট",
    latitude: "অক্ষাংশ",
    longitude: "দ্রাঘিমাংশ",
    noGps: "কোনও GPS ডেটা পাওয়া যায়নি।",

    deviceInformation: "ডিভাইসের তথ্য",
    hiveId: "হাইভ ID",
    apiaryId: "এপিয়ারি ID",
    esp32: "ESP32",
    notAssigned: "অ্যাসাইন করা নেই",
    lastReading: "শেষ রিডিং",
    noReading: "কোনও রিডিং নেই",

    latestTelemetryReceived: "সর্বশেষ টেলিমেট্রি পাওয়া গেছে",
    reading: "রিডিং",

    waitingForTelemetry: "টেলিমেট্রি ইতিহাসের জন্য অপেক্ষা করা হচ্ছে",

    unableToLoadTelemetry: "হাইভ টেলিমেট্রি লোড করা যাচ্ছে না।",
  },

  hi: {
    honeyChain: "HoneyChain",
    hiveIntelligence: "हाइव इंटेलिजेंस",

    backToHives: "हाइव्स पर वापस जाएँ",
    hiveNotFound: "हाइव नहीं मिला",
    unableToLoad: "अनुरोधित हाइव का टेलीमेट्री लोड नहीं किया जा सका।",

    refresh: "रिफ्रेश",

    deviceOnline: "डिवाइस ऑनलाइन",
    deviceOffline: "डिवाइस ऑफलाइन",

    liveDescription:
      "इस HoneyChain-कनेक्टेड हाइव का लाइव टेलीमेट्री और ऐतिहासिक पर्यावरणीय डेटा।",

    device: "डिवाइस",
    status: "स्थिति",
    unassigned: "असाइन नहीं किया गया",

    currentTelemetry: "वर्तमान टेलीमेट्री",

    temperature: "तापमान",
    humidity: "नमी",
    weight: "वजन",
    acoustic: "अकॉस्टिक",

    historicalTemperature: "ऐतिहासिक तापमान रीडिंग",
    historicalHumidity: "ऐतिहासिक नमी रीडिंग",
    recordedHiveWeight: "रिकॉर्ड किया गया हाइव वजन",
    rawAcoustic: "रॉ अकॉस्टिक सेंसर रीडिंग",

    hiveWeight: "हाइव वजन",
    acousticActivity: "अकॉस्टिक गतिविधि",

    hiveLocation: "हाइव का स्थान",
    gpsCoordinates: "GPS निर्देशांक",
    latitude: "अक्षांश",
    longitude: "देशांतर",
    noGps: "कोई GPS डेटा उपलब्ध नहीं है।",

    deviceInformation: "डिवाइस की जानकारी",
    hiveId: "हाइव ID",
    apiaryId: "एपियरी ID",
    esp32: "ESP32",
    notAssigned: "असाइन नहीं किया गया",
    lastReading: "अंतिम रीडिंग",
    noReading: "कोई रीडिंग नहीं",

    latestTelemetryReceived: "नवीनतम टेलीमेट्री प्राप्त हुई",
    reading: "रीडिंग",

    waitingForTelemetry: "टेलीमेट्री इतिहास की प्रतीक्षा की जा रही है",

    unableToLoadTelemetry: "हाइव टेलीमेट्री लोड नहीं किया जा सका।",
  },
} as const;

function getPageCopy(language: string) {
  if (language === "bn") return pageTranslations.bn;
  if (language === "hi") return pageTranslations.hi;
  return pageTranslations.en;
}

/* =============================================================
   MAIN PAGE
============================================================= */

export default function HiveDetailsPage({ params }: HivePageProps) {
  const { language } = useLanguage();
  const d = getPageCopy(language);

  const [hiveId, setHiveId] = useState("");
  const [hive, setHive] = useState<Hive | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    params.then(({ id }) => {
      if (cancelled) return;

      setHiveId(id);
      loadHive(id);
    });

    return () => {
      cancelled = true;
    };
  }, [params]);

  async function loadHive(id: string) {
    if (!id) {
      setError(d.hiveNotFound);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [hiveData, readingData] = await Promise.all([
        getHives(),
        getHiveReadings(id),
      ]);

      const selectedHive = hiveData.find(
        (item: Hive) => item.id === id
      );

      if (!selectedHive) {
        setError(d.hiveNotFound);
        return;
      }

      setHive(selectedHive);

      const sortedReadings = [...readingData].sort(
        (a: SensorReading, b: SensorReading) =>
          new Date(a.recorded_at).getTime() -
          new Date(b.recorded_at).getTime()
      );

      setReadings(sortedReadings);
    } catch (err) {
      console.error(err);
      setError(d.unableToLoadTelemetry);
    } finally {
      setLoading(false);
    }
  }

  const latest = readings[readings.length - 1];

  const chartData = useMemo(() => {
    const locale =
      language === "bn"
        ? "bn-IN"
        : language === "hi"
          ? "hi-IN"
          : "en-IN";

    return readings.map((reading) => ({
      time: formatChartTime(reading.recorded_at, locale),
      temperature: reading.temperature_c ?? null,
      humidity: reading.humidity_percent ?? null,
      weight: reading.hive_weight_kg ?? null,
      acoustic: reading.sound_level ?? null,
    }));
  }, [readings, language]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !hive) {
    return (
      <main className="min-h-screen bg-[#F7F3EA] text-[#292621]">
        <MobileNav />

        <nav className="border-b border-[#E5DDCF] bg-[#F7F3EA]">
          <div className="mx-auto flex min-h-[64px] max-w-7xl items-center px-4 sm:px-6">
            <a
              href="/hives"
              aria-label={d.backToHives}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDD3C2] bg-white text-[#655D52] transition hover:border-[#C88718] hover:bg-[#FFF8E8] hover:text-[#A86600]"
            >
              <ArrowLeft size={18} />
            </a>

            <div className="ml-3">
              <p className="text-sm font-semibold">
                {d.honeyChain}
              </p>

              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#817667]">
                {d.hiveIntelligence}
              </p>
            </div>
          </div>
        </nav>

        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
          <div className="w-full max-w-md rounded-2xl border border-[#E1D8C9] bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF3D7] text-[#A86600]">
              <Radio size={20} />
            </div>

            <h1 className="mt-5 text-xl font-semibold text-[#292621]">
              {error || d.hiveNotFound}
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#665D52]">
              {d.unableToLoad}
            </p>

            <a
              href="/hives"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#D9CEBC] bg-[#FFF9ED] px-5 text-sm font-medium text-[#5F574D] transition hover:border-[#C88718] hover:bg-[#FFF3D7] hover:text-[#A86600]"
            >
              {d.backToHives}
            </a>
          </div>
        </div>
      </main>
    );
  }

  const isOnline = hive.status?.toLowerCase() === "active";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#292621]">
      <MobileNav />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[#E5DDCF] bg-[#F7F3EA]/95">
        <div className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <a
              href="/hives"
              aria-label={d.backToHives}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DDD3C2] bg-white text-[#655D52] transition hover:border-[#C88718] hover:bg-[#FFF8E8] hover:text-[#A86600]"
            >
              <ArrowLeft size={18} />
            </a>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-[#292621] sm:text-base">
                {d.honeyChain}
              </p>

              <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.14em] text-[#817667] sm:text-sm">
                {d.hiveIntelligence}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSelector />

            <button
              type="button"
              onClick={() => loadHive(hiveId)}
              disabled={loading}
              className="flex h-11 items-center gap-2 rounded-xl border border-[#DDD3C2] bg-white px-3 text-sm font-medium text-[#655D52] transition hover:border-[#C88718] hover:bg-[#FFF8E8] hover:text-[#A86600] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
            >
              <Activity
                size={16}
                className={loading ? "animate-spin" : ""}
              />

              <span className="hidden sm:inline">
                {d.refresh}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:pt-14">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isOnline
                    ? "bg-[#2F7D4A]"
                    : "bg-[#A79B89]"
                }`}
              />

              <span
                className={`text-sm font-semibold uppercase tracking-[0.12em] ${
                  isOnline
                    ? "text-[#2F7D4A]"
                    : "text-[#817667]"
                }`}
              >
                {isOnline
                  ? d.deviceOnline
                  : d.deviceOffline}
              </span>
            </div>

            <h1 className="break-words text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#292621] sm:text-5xl lg:text-6xl">
              {hive.hive_code}
            </h1>

            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#5F574D] sm:text-base sm:leading-7">
              {d.liveDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <InfoPill
              icon={<Cpu size={16} />}
              label={d.device}
              value={hive.esp32_device_id || d.unassigned}
            />

            <InfoPill
              icon={<Radio size={16} />}
              label={d.status}
              value={hive.status}
            />
          </div>
        </div>

        {/* Current telemetry */}
        <div className="mb-8">
          <SectionLabel text={d.currentTelemetry} />

          <div className="mt-4 grid grid-cols-1 gap-4 min-[390px]:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={<Thermometer size={19} />}
              label={d.temperature}
              value={
                latest?.temperature_c !== undefined
                  ? `${latest.temperature_c.toFixed(1)}°C`
                  : "—"
              }
            />

            <MetricCard
              icon={<Droplets size={19} />}
              label={d.humidity}
              value={
                latest?.humidity_percent !== undefined
                  ? `${latest.humidity_percent.toFixed(1)}%`
                  : "—"
              }
            />

            <MetricCard
              icon={<Scale size={19} />}
              label={d.weight}
              value={
                latest?.hive_weight_kg !== undefined
                  ? `${latest.hive_weight_kg.toFixed(1)} kg`
                  : "—"
              }
            />

            <MetricCard
              icon={<Waves size={19} />}
              label={d.acoustic}
              value={
                latest?.sound_level !== undefined
                  ? latest.sound_level.toFixed(1)
                  : "—"
              }
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard
            title={d.temperature}
            subtitle={d.historicalTemperature}
            unit="°C"
            data={chartData}
            dataKey="temperature"
            type="temperature"
            emptyText={d.waitingForTelemetry}
          />

          <ChartCard
            title={d.humidity}
            subtitle={d.historicalHumidity}
            unit="%"
            data={chartData}
            dataKey="humidity"
            type="humidity"
            emptyText={d.waitingForTelemetry}
          />

          <ChartCard
            title={d.hiveWeight}
            subtitle={d.recordedHiveWeight}
            unit="kg"
            data={chartData}
            dataKey="weight"
            type="weight"
            emptyText={d.waitingForTelemetry}
          />

          <ChartCard
            title={d.acousticActivity}
            subtitle={d.rawAcoustic}
            unit="RAW"
            data={chartData}
            dataKey="acoustic"
            type="acoustic"
            emptyText={d.waitingForTelemetry}
          />
        </div>

        {/* Location + Device */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Location */}
          <div className="rounded-2xl border border-[#E1D8C9] bg-white p-5 shadow-sm sm:p-6">
            <SectionLabel text={d.hiveLocation} />

            <div className="mt-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF3D7] text-[#A86600]">
                <MapPin size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#817667]">
                  {d.gpsCoordinates}
                </p>

                {latest?.latitude !== undefined &&
                latest?.longitude !== undefined ? (
                  <div className="mt-4 grid grid-cols-1 gap-4 min-[390px]:grid-cols-2">
                    <Coordinate
                      label={d.latitude}
                      value={latest.latitude.toFixed(6)}
                    />

                    <Coordinate
                      label={d.longitude}
                      value={latest.longitude.toFixed(6)}
                    />
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[#665D52]">
                    {d.noGps}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Device */}
          <div className="rounded-2xl border border-[#E1D8C9] bg-white p-5 shadow-sm sm:p-6">
            <SectionLabel text={d.deviceInformation} />

            <div className="mt-6 grid grid-cols-1 gap-5 min-[390px]:grid-cols-2">
              <DeviceField
                label={d.hiveId}
                value={hive.id}
                mono
              />

              <DeviceField
                label={d.apiaryId}
                value={hive.apiary_id}
                mono
              />

              <DeviceField
                label={d.esp32}
                value={hive.esp32_device_id || d.notAssigned}
                mono
              />

              <DeviceField
                label={d.lastReading}
                value={
                  latest
                    ? formatDate(
                        latest.recorded_at,
                        language === "bn"
                          ? "bn-IN"
                          : language === "hi"
                            ? "hi-IN"
                            : "en-IN"
                      )
                    : d.noReading
                }
              />
            </div>
          </div>
        </div>

        {/* Last update */}
        {latest && (
          <div className="mt-6 flex flex-col gap-3 border-t border-[#E1D8C9] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#2F7D4A]" />

              <p className="text-sm text-[#665D52]">
                {d.latestTelemetryReceived}{" "}
                <span className="font-medium text-[#403A34]">
                  {formatDate(
                    latest.recorded_at,
                    language === "bn"
                      ? "bn-IN"
                      : language === "hi"
                        ? "hi-IN"
                        : "en-IN"
                  )}
                </span>
              </p>
            </div>

            <p className="font-mono text-sm text-[#817667]">
              {d.reading} #{latest.id}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

/* =============================================================
   SECTION LABEL
============================================================= */

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-6 bg-[#C88718]" />

      <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#74695D]">
        {text}
      </span>
    </div>
  );
}

/* =============================================================
   METRIC CARD
============================================================= */

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E1D8C9] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2 text-[#74695D]">
        {icon}

        <span className="text-sm font-semibold uppercase tracking-[0.07em]">
          {label}
        </span>
      </div>

      <p className="mt-4 break-words text-2xl font-semibold tracking-tight text-[#292621] sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

/* =============================================================
   CHART CARD
============================================================= */

function ChartCard({
  title,
  subtitle,
  unit,
  data,
  dataKey,
  type,
  emptyText,
}: {
  title: string;
  subtitle: string;
  unit: string;
  data: {
    time: string;
    temperature: number | null;
    humidity: number | null;
    weight: number | null;
    acoustic: number | null;
  }[];
  dataKey:
    | "temperature"
    | "humidity"
    | "weight"
    | "acoustic";
  type: string;
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E1D8C9] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[#292621] sm:text-lg">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-5 text-[#74695D]">
            {subtitle}
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-[#E1D8C9] bg-[#FBF8F1] px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#74695D]">
          {unit || "RAW"}
        </div>
      </div>

      <div className="mt-5 h-[250px] w-full sm:h-[280px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 8,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${type}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#C88718"
                    stopOpacity={0.2}
                  />

                  <stop
                    offset="100%"
                    stopColor="#C88718"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#ECE5D9"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{
                  fill: "#74695D",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
                minTickGap={25}
              />

              <YAxis
                tick={{
                  fill: "#74695D",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
                width={42}
              />

              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #E1D8C9",
                  borderRadius: "12px",
                  color: "#292621",
                  fontSize: "13px",
                  boxShadow:
                    "0 8px 24px rgba(70, 52, 20, 0.08)",
                }}
                labelStyle={{
                  color: "#74695D",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
                itemStyle={{
                  color: "#A86600",
                  fontSize: "13px",
                }}
              />

              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="#C88718"
                strokeWidth={2}
                fill={`url(#gradient-${type})`}
                connectNulls
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#C88718",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#DDD3C2] bg-[#FBF8F1]">
            <p className="px-4 text-center text-sm text-[#74695D]">
              {emptyText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =============================================================
   INFO PILL
============================================================= */

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[44px] max-w-full items-center gap-3 rounded-xl border border-[#DDD3C2] bg-white px-3.5 py-2.5 shadow-sm sm:px-4">
      <span className="shrink-0 text-[#A86600]">
        {icon}
      </span>

      <div className="min-w-0">
        <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#74695D]">
          {label}
        </span>

        <span className="break-all font-mono text-sm text-[#403A34]">
          {value}
        </span>
      </div>
    </div>
  );
}

/* =============================================================
   COORDINATE
============================================================= */

function Coordinate({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#E5DDCF] bg-[#FBF8F1] p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#817667]">
        {label}
      </p>

      <p className="mt-1.5 break-all font-mono text-sm text-[#403A34]">
        {value}
      </p>
    </div>
  );
}

/* =============================================================
   DEVICE FIELD
============================================================= */

function DeviceField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[#E5DDCF] bg-[#FBF8F1] p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#817667]">
        {label}
      </p>

      <p
        className={`mt-2 break-all text-sm text-[#403A34] ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =============================================================
   LOADING
============================================================= */

function LoadingState() {
  const { language } = useLanguage();
  const d = getPageCopy(language);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#292621]">
      <MobileNav />

      <nav className="border-b border-[#E5DDCF] bg-[#F7F3EA]">
        <div className="mx-auto flex min-h-[64px] max-w-7xl items-center px-4 sm:px-6">
          <div className="h-11 w-11 animate-pulse rounded-full bg-[#E8E0D2]" />

          <div className="ml-3">
            <div className="h-4 w-28 animate-pulse rounded bg-[#E8E0D2]" />

            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-[#EDE6DA]" />
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="h-3 w-24 animate-pulse rounded bg-[#E8E0D2]" />

        <div className="mt-5 h-12 w-56 max-w-full animate-pulse rounded-xl bg-[#E8E0D2] sm:h-16 sm:w-72" />

        <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-[#EDE6DA]" />

        <div className="mt-8 grid grid-cols-1 gap-4 min-[390px]:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-[#E1D8C9] bg-white"
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[350px] animate-pulse rounded-2xl border border-[#E1D8C9] bg-white"
            />
          ))}
        </div>

        <p className="sr-only">{d.hiveIntelligence}</p>
      </section>
    </main>
  );
}

/* =============================================================
   FORMATTERS
============================================================= */

function formatChartTime(
  date: string,
  locale = "en-IN"
) {
  try {
    return new Date(date).toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
}

function formatDate(
  date: string,
  locale = "en-IN"
) {
  try {
    return new Date(date).toLocaleString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
}