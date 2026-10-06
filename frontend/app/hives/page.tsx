"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/components/LanguageProvider";
import LanguageSelector from "@/components/LanguageSelector";
import MobileNav from "@/components/MobileNav";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Droplets,
  MapPin,
  Radio,
  Scale,
  Thermometer,
  Waves,
} from "lucide-react";

import { getHives, getHiveReadings } from "@/lib/api";

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

export default function HivesPage() {
  const { t } = useLanguage();

  const [hives, setHives] = useState<Hive[]>([]);
  const [readings, setReadings] = useState<Record<string, SensorReading>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHives();
  }, []);

  async function loadHives() {
    try {
      setLoading(true);
      setError("");

      const hiveData = await getHives();
      setHives(hiveData);

      const results = await Promise.all(
        hiveData.map(async (hive) => {
          try {
            const data = await getHiveReadings(hive.id);

            if (!data || data.length === 0) {
              return [hive.id, null] as const;
            }

            return [hive.id, data[0]] as const;
          } catch {
            return [hive.id, null] as const;
          }
        })
      );

      const map: Record<string, SensorReading> = {};

      for (const [hiveId, reading] of results) {
        if (reading) {
          map[hiveId] = reading;
        }
      }

      setReadings(map);
    } catch (err) {
      console.error(err);
      setError(t("apiError"));
    } finally {
      setLoading(false);
    }
  }

  const onlineCount = hives.filter(
    (hive) => hive.status?.toLowerCase() === "active"
  ).length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#292621]">
      <MobileNav />

      {/* Desktop navigation */}
      <nav className="sticky top-0 z-40 border-b border-[#E5DDCF] bg-[#F7F3EA]/95">
        <div className="mx-auto flex min-h-[58px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <a
              href="/dashboard"
              aria-label="Back to dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDD3C2] bg-white text-[#655D52] transition hover:border-[#C88718] hover:bg-[#FFF8E8] hover:text-[#A86600]"
            >
              <ArrowLeft size={17} />
            </a>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight text-[#292621] sm:text-base">
                HoneyChain
              </div>

              <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#817667]">
                IoT Network
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSelector />

            <button
              type="button"
              onClick={loadHives}
              disabled={loading}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#DDD3C2] bg-white px-3 text-sm font-medium text-[#655D52] transition hover:border-[#C88718] hover:bg-[#FFF8E8] hover:text-[#A86600] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
            >
              <Activity
                size={15}
                className={loading ? "animate-spin" : ""}
              />

              <span className="hidden sm:inline">
                {t("refresh")}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="relative">
        <section className="mx-auto max-w-7xl px-4 pb-14 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:pt-8">
          {/* Compact hero */}
          <div className="mb-6 flex flex-col gap-5 sm:mb-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#C88718]" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#A86600]">
                  {t("connectedApiaries")}
                </span>
              </div>

              <h1 className="text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#292621] sm:text-4xl lg:text-5xl">
                {t("hiveIntelligence")}
              </h1>

              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-[#665D52] sm:text-[15px] sm:leading-6">
                {t("hiveDescription")}
              </p>
            </div>

            {/* Compact network status */}
            <div className="w-full shrink-0 rounded-2xl border border-[#E1D8C9] bg-white px-4 py-3 shadow-sm sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4ED] text-[#2F7D4A]">
                  <Radio size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#817667]">
                    {t("network")}
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-[#34302B] sm:text-base">
                    {onlineCount}{" "}
                    {onlineCount === 1
                      ? t("hiveOnline")
                      : t("hivesOnline")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="min-h-[350px] animate-pulse rounded-2xl border border-[#E4DBCC] bg-white"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-red-700">
                    {error}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#74695D]">
                    Please check the backend connection and try again.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadHives}
                  className="flex min-h-[44px] items-center justify-center rounded-xl border border-[#DDD3C2] bg-[#FFF9ED] px-5 text-sm font-medium text-[#5F574D] transition hover:border-[#C88718] hover:bg-[#FFF4D9] hover:text-[#A86600]"
                >
                  {t("tryAgain")}
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && hives.length === 0 && (
            <div className="rounded-2xl border border-[#E1D8C9] bg-white px-5 py-12 text-center shadow-sm sm:px-8 sm:py-14">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5EFE2] text-[#817667]">
                <Radio size={21} />
              </div>

              <h2 className="text-xl font-semibold text-[#292621]">
                {t("noConnectedHives")}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#74695D]">
                {t("registerHive")}
              </p>
            </div>
          )}

          {/* Hive grid */}
          {!loading && !error && hives.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {hives.map((hive) => (
                <HiveCard
                  key={hive.id}
                  hive={hive}
                  reading={readings[hive.id]}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* =============================================================
   HIVE CARD
============================================================= */

function HiveCard({
  hive,
  reading,
}: {
  hive: Hive;
  reading?: SensorReading;
}) {
  const { t } = useLanguage();

  const online = hive.status?.toLowerCase() === "active";

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E1D8C9] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Card header */}
      <div className="border-b border-[#E9E1D5] px-4 py-4 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#817667]">
                {t("hive")}
              </span>

              <span className="h-px w-3 bg-[#D8CCBA]" />

              <span className="font-mono text-[10px] text-[#978A78]">
                {hive.apiary_id?.slice(0, 8) || "--------"}
              </span>
            </div>

            <h2 className="truncate text-xl font-semibold tracking-tight text-[#292621] sm:text-[22px]">
              {hive.hive_code}
            </h2>

            <p className="mt-1 truncate font-mono text-[11px] text-[#817667]">
              {hive.esp32_device_id || t("deviceNotAssigned")}
            </p>
          </div>

          {/* Status */}
          <div
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 ${
              online
                ? "border-[#B9D8C2] bg-[#F0F8F2]"
                : "border-[#E1D8C9] bg-[#F6F2EA]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                online ? "bg-[#2F7D4A]" : "bg-[#9D9282]"
              }`}
            />

            <span
              className={`text-[11px] font-semibold ${
                online ? "text-[#2F7D4A]" : "text-[#817667]"
              }`}
            >
              {online ? t("online") : t("offline")}
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div className="px-4 py-4 sm:px-5 sm:py-4">
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#E1D8C9]">
          <Telemetry
            icon={<Thermometer size={15} />}
            label={t("temperature")}
            value={
              reading?.temperature_c !== undefined
                ? `${reading.temperature_c.toFixed(1)}°C`
                : "—"
            }
          />

          <Telemetry
            icon={<Droplets size={15} />}
            label={t("humidity")}
            value={
              reading?.humidity_percent !== undefined
                ? `${reading.humidity_percent.toFixed(1)}%`
                : "—"
            }
          />

          <Telemetry
            icon={<Scale size={15} />}
            label={t("weight")}
            value={
              reading?.hive_weight_kg !== undefined
                ? `${reading.hive_weight_kg.toFixed(1)} kg`
                : "—"
            }
          />

          <Telemetry
            icon={<Waves size={15} />}
            label={t("acoustic")}
            value={
              reading?.sound_level !== undefined
                ? reading.sound_level.toFixed(1)
                : "—"
            }
          />
        </div>

        {/* Lower information area */}
        <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
          {/* GPS */}
          <div className="rounded-xl border border-[#E1D8C9] bg-[#FBF8F1] p-3.5">
            <div className="flex items-center gap-2">
              <MapPin
                size={15}
                className="shrink-0 text-[#A86600]"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#817667]">
                {t("gpsPosition")}
              </span>
            </div>

            {reading?.latitude !== undefined &&
            reading?.longitude !== undefined ? (
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#978A78]">
                    {t("latitude")}
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-[#403A34]">
                    {reading.latitude.toFixed(5)}
                  </p>
                </div>

                <div className="border-l border-[#DED4C4] pl-2.5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#978A78]">
                    {t("longitude")}
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-[#403A34]">
                    {reading.longitude.toFixed(5)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-[#817667]">
                {t("gpsUnavailable")}
              </p>
            )}
          </div>

          {/* Last telemetry */}
          <div className="rounded-xl border border-[#E1D8C9] bg-white p-3.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#978A78]">
              {t("lastTelemetry")}
            </p>

            <p className="mt-1.5 text-xs leading-5 text-[#665D52]">
              {reading
                ? formatDate(reading.recorded_at)
                : t("waitingForData")}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3">
          <a
            href={`/hives/${hive.id}`}
            className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-[#D9CEBC] bg-[#FFF9ED] px-4 text-sm font-medium text-[#5F574D] transition hover:border-[#C88718] hover:bg-[#FFF3D7] hover:text-[#A86600]"
          >
            {t("viewHive")}

            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}

/* =============================================================
   TELEMETRY ITEM
============================================================= */

function Telemetry({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 border-b border-r border-[#E1D8C9] bg-white p-3 last:border-r-0 sm:p-3.5">
      <div className="flex items-center gap-1.5 text-[#817667]">
        {icon}

        <span className="truncate text-[10px] font-semibold uppercase tracking-[0.05em]">
          {label}
        </span>
      </div>

      <p className="mt-1.5 break-words text-lg font-semibold tracking-tight text-[#292621] sm:text-xl">
        {value}
      </p>
    </div>
  );
}

/* =============================================================
   DATE FORMATTER
============================================================= */

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleString("en-IN", {
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