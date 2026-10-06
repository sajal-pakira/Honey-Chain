"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import MobileNav from "@/components/MobileNav";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

import {
  Activity,
  ArrowUpRight,
  Box,
  ChevronRight,
  Droplets,
  Hexagon,
  LayoutDashboard,
  MapPin,
  Package,
  Scale,
  Settings,
  Thermometer,
  Volume2,
  Wifi,
} from "lucide-react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getHiveReadings, getHives } from "@/lib/api";
import type { Hive, SensorReading } from "@/types";

export default function DashboardPage() {
  const { language, t } = useLanguage();

  const [hives, setHives] = useState<Hive[]>([]);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Dashboard-specific translations.
   * The global language system still controls the active language.
   */
  const d = {
    hi: {
      console: "बीकीपर कंसोल",
      apiConnected: "API कनेक्टेड",
      overview: "एपियरी अवलोकन",
      liveTelemetry: "आपके जुड़े हुए छत्तों का लाइव डेटा।",
      liveMonitoring: "लाइव मॉनिटरिंग",

      connectedHives: "जुड़े हुए छत्ते",
      registeredDevices: "रजिस्टर्ड डिवाइस",
      latestReading: "नवीनतम रीडिंग",
      loadCellReading: "लोड-सेल रीडिंग",
      sensorActivity: "सेंसर गतिविधि",

      latestTelemetry: "नवीनतम डेटा प्राप्त हुआ",
      temperatureHistory: "तापमान इतिहास",
      temperatureValues: "रिकॉर्ड किए गए तापमान मान",
      humidityHistory: "नमी इतिहास",
      humidityDht: "DHT22 से प्राप्त सापेक्ष नमी",

      hiveNetwork: "छत्ता नेटवर्क",
      connectedDevices: "जुड़े हुए डिवाइस",
      noHives: "कोई छत्ता रजिस्टर्ड नहीं है।",
      active: "सक्रिय",
      esp32Device: "ESP32 डिवाइस",

      hiveLocation: "छत्ते का स्थान",
      latestGps: "नवीनतम GPS डेटा",
      gpsCoordinates:
        "छत्ते के GPS मॉड्यूल द्वारा भेजे गए निर्देशांक।",
      noGps: "GPS डेटा उपलब्ध नहीं है",

      honeyBatches: "शहद बैच",
      batchRecords: "बैच रिकॉर्ड उपलब्ध",
      traceability: "ट्रेसेबिलिटी",
      consumerVerification: "उपभोक्ता सत्यापन",
      ready: "तैयार",
      latestWeight: "नवीनतम वज़न",
      loadCellTelemetry: "लोड-सेल टेलीमेट्री",

      systemOperational: "सिस्टम चालू है",
      iotConnected: "IoT नेटवर्क कनेक्टेड",

      loadingTelemetry: "टेलीमेट्री लोड हो रही है...",
      noReadings: "अभी कोई सेंसर रीडिंग नहीं है",
      unable: "HoneyChain डेटा लोड नहीं किया जा सका।",

      temperature: "तापमान",
      humidity: "नमी",
      weight: "वज़न",
      acoustic: "ध्वनि",
      hive: "छत्ता",
      supplyChain: "सप्लाई चेन",
      settings: "सेटिंग्स",
      dashboard: "डैशबोर्ड",
      batches: "शहद बैच",
    },

    en: {
      console: "Beekeeper Console",
      apiConnected: "API Connected",
      overview: "Apiary Overview",
      liveTelemetry: "Live telemetry from your connected hives.",
      liveMonitoring: "Live monitoring",

      connectedHives: "Connected Hives",
      registeredDevices: "Registered devices",
      latestReading: "Latest reading",
      loadCellReading: "Load-cell reading",
      sensorActivity: "Sensor activity",

      latestTelemetry: "Latest telemetry received",
      temperatureHistory: "Temperature history",
      temperatureValues: "Recorded temperature values",
      humidityHistory: "Humidity history",
      humidityDht: "Relative humidity from DHT22",

      hiveNetwork: "Hive network",
      connectedDevices: "Connected devices",
      noHives: "No hives registered.",
      active: "Active",
      esp32Device: "ESP32 device",

      hiveLocation: "Hive location",
      latestGps: "Latest GPS telemetry",
      gpsCoordinates:
        "Coordinates reported by the hive GPS module.",
      noGps: "No GPS data available",

      honeyBatches: "Honey batches",
      batchRecords: "Batch records available",
      traceability: "Traceability",
      consumerVerification: "Consumer verification",
      ready: "Ready",
      latestWeight: "Latest weight",
      loadCellTelemetry: "Load-cell telemetry",

      systemOperational: "System operational",
      iotConnected: "IoT network connected",

      loadingTelemetry: "Loading telemetry...",
      noReadings: "No sensor readings yet",
      unable: "Unable to load HoneyChain data.",

      temperature: "Temperature",
      humidity: "Humidity",
      weight: "Weight",
      acoustic: "Acoustic",
      hive: "Hive",
      supplyChain: "Supply Chain",
      settings: "Settings",
      dashboard: "Dashboard",
      batches: "Honey Batches",
    },

    bn: {
      console: "মৌমাছি পালনকারী কনসোল",
      apiConnected: "API সংযুক্ত",
      overview: "মৌচাকের সারাংশ",
      liveTelemetry: "সংযুক্ত মৌচাকগুলির রিয়েল-টাইম তথ্য।",
      liveMonitoring: "লাইভ মনিটরিং",

      connectedHives: "সংযুক্ত মৌচাক",
      registeredDevices: "রেজিস্টার করা ডিভাইস",
      latestReading: "সর্বশেষ রিডিং",
      loadCellReading: "লোড-সেল রিডিং",
      sensorActivity: "সেন্সর কার্যকলাপ",

      latestTelemetry: "সর্বশেষ টেলিমেট্রি পাওয়া গেছে",
      temperatureHistory: "তাপমাত্রার ইতিহাস",
      temperatureValues: "রেকর্ড করা তাপমাত্রার মান",
      humidityHistory: "আর্দ্রতার ইতিহাস",
      humidityDht: "DHT22 থেকে পাওয়া আপেক্ষিক আর্দ্রতা",

      hiveNetwork: "মৌচাক নেটওয়ার্ক",
      connectedDevices: "সংযুক্ত ডিভাইস",
      noHives: "কোনও মৌচাক রেজিস্টার করা নেই।",
      active: "সক্রিয়",
      esp32Device: "ESP32 ডিভাইস",

      hiveLocation: "মৌচাকের অবস্থান",
      latestGps: "সর্বশেষ GPS তথ্য",
      gpsCoordinates:
        "মৌচাকের GPS মডিউল থেকে পাওয়া স্থানাঙ্ক।",
      noGps: "কোনও GPS তথ্য নেই",

      honeyBatches: "মধুর ব্যাচ",
      batchRecords: "ব্যাচ রেকর্ড উপলব্ধ",
      traceability: "ট্রেসেবিলিটি",
      consumerVerification: "ভোক্তা যাচাইকরণ",
      ready: "প্রস্তুত",
      latestWeight: "সর্বশেষ ওজন",
      loadCellTelemetry: "লোড-সেল টেলিমেট্রি",

      systemOperational: "সিস্টেম সচল",
      iotConnected: "IoT নেটওয়ার্ক সংযুক্ত",

      loadingTelemetry: "টেলিমেট্রি লোড হচ্ছে...",
      noReadings: "এখনও কোনও সেন্সর রিডিং নেই",
      unable: "HoneyChain-এর তথ্য লোড করা যায়নি।",

      temperature: "তাপমাত্রা",
      humidity: "আর্দ্রতা",
      weight: "ওজন",
      acoustic: "শব্দ",
      hive: "মৌচাক",
      supplyChain: "সাপ্লাই চেইন",
      settings: "সেটিংস",
      dashboard: "ড্যাশবোর্ড",
      batches: "মধুর ব্যাচ",
    },
  }[language];

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const hiveData = await getHives();
        setHives(hiveData);

        if (hiveData.length > 0) {
          const readingData = await getHiveReadings(
            hiveData[0].id
          );

          setReadings(readingData);
        } else {
          setReadings([]);
        }
      } catch (err) {
        console.error(err);
        setError(d.unable);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [d.unable]);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (language === "hi") {
      if (hour >= 5 && hour < 12) return "सुप्रभात";
      if (hour >= 12 && hour < 17) return "नमस्कार";
      if (hour >= 17 && hour < 21) return "शुभ संध्या";
      return "शुभ रात्रि";
    }

    if (language === "bn") {
      if (hour >= 5 && hour < 12) return "সুপ্রভাত";
      if (hour >= 12 && hour < 17) return "শুভ অপরাহ্ন";
      if (hour >= 17 && hour < 21) return "শুভ সন্ধ্যা";
      return "শুভ রাত্রি";
    }

    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";

    return "Good night";
  };

  const latest = readings[0];

  const chartData = useMemo(() => {
    return [...readings].reverse().map((reading) => ({
      time: new Date(
        reading.recorded_at
      ).toLocaleTimeString(
        language === "hi"
          ? "hi-IN"
          : language === "bn"
            ? "bn-IN"
            : "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),

      temperature: reading.temperature_c ?? null,
      humidity: reading.humidity_percent ?? null,
      weight: reading.hive_weight_kg ?? null,
    }));
  }, [readings, language]);

  const latestRecorded = latest
    ? new Date(latest.recorded_at).toLocaleString(
        language === "hi"
          ? "hi-IN"
          : language === "bn"
            ? "bn-IN"
            : "en-IN"
      )
    : d.noReadings;

  return (
    <main className="min-h-screen bg-[#F3F0E8] text-[#29251F]">
      {/* SUBTLE BACKGROUND */}

      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08]"
        style={{
          backgroundImage: "url('/honey-bg.jpg')",
        }}
      />

      <div className="fixed inset-0 bg-[#F3F0E8]/90" />

      {/* CONTENT */}

      <div className="relative z-10 flex min-h-screen">
        {/* SIDEBAR */}

        <aside className="hidden w-64 border-r border-[#DDD5C7] bg-[#F8F5EE] p-5 lg:flex lg:flex-col">
          {/* LOGO */}

          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C78300] text-white">
              <Hexagon size={21} />
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[#29251F]">
                HoneyChain
              </h1>

              <p className="mt-0.5 text-base text-[#71695E]">
                {t("hiveIntelligence")}
              </p>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="mt-10 space-y-1.5">
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label={d.dashboard}
              href="/dashboard"
              active
            />

            <SidebarItem
              icon={<Hexagon size={18} />}
              label={t("hives")}
              href="/hives"
            />

            <SidebarItem
              icon={<Package size={18} />}
              label={d.batches}
              href="/batches"
            />

            <SidebarItem
              icon={<Box size={18} />}
              label={d.supplyChain}
              href="/supply-chain"
            />

            <SidebarItem
              icon={<MapPin size={18} />}
              label={t("traceability")}
              href="/traceability"
            />
          </nav>

          {/* SIDEBAR BOTTOM */}

          <div className="mt-auto">
            <SidebarItem
              icon={<Settings size={18} />}
              label={d.settings}
              href="/settings"
            />

            <div className="mt-5 rounded-xl border border-[#DDD5C7] bg-[#FFFDF8] p-4">
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#3C8054]" />

                <span className="text-base font-medium text-[#4F4941]">
                  {d.systemOperational}
                </span>
              </div>

              <p className="mt-2 text-base text-[#71695E]">
                {d.iotConnected}
              </p>
            </div>
          </div>
        </aside>

        <MobileNav />

        {/* MAIN */}

        <section className="flex-1 pt-16 lg:pt-0">
          {/* TOP BAR */}

          <header className="flex min-h-20 items-center justify-between border-b border-[#DDD5C7] bg-[#F8F5EE] px-5 py-4 lg:px-10">
            <div>
              <p className="text-base font-semibold uppercase tracking-[0.12em] text-[#A86500]">
                {d.console}
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#29251F] sm:text-2xl">
                {getGreeting()}, Soham
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* LANGUAGE */}

              <LanguageSelector />

              {/* API */}

              <div className="hidden items-center gap-2 rounded-full border border-[#DDD5C7] bg-[#FFFDF8] px-4 py-2.5 text-base font-medium text-[#5F574D] sm:flex">
                <Wifi size={15} />
                {d.apiConnected}
              </div>

              {/* PROFILE */}

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C78300] text-base font-semibold text-white">
                S
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}

          <div className="p-5 sm:p-6 lg:p-10">
            {/* PAGE HEADER */}

            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#29251F] sm:text-3xl">
                  {d.overview}
                </h3>

                <p className="mt-2 text-base text-[#655E53]">
                  {d.liveTelemetry}
                </p>
              </div>

              <div className="flex items-center gap-2 text-base font-medium text-[#655E53]">
                <Activity size={16} />
                {d.liveMonitoring}
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-base font-medium text-red-700">
                {error}
              </div>
            )}

            {/* STAT CARDS */}

            <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 xl:grid-cols-5">
              <StatCard
                title={d.connectedHives}
                value={loading ? "—" : hives.length}
                subtitle={d.registeredDevices}
                icon={<Hexagon size={20} />}
              />

              <StatCard
                title={d.temperature}
                value={
                  latest?.temperature_c != null
                    ? `${latest.temperature_c.toFixed(1)}°C`
                    : "—"
                }
                subtitle={d.latestReading}
                icon={<Thermometer size={20} />}
              />

              <StatCard
                title={d.humidity}
                value={
                  latest?.humidity_percent != null
                    ? `${latest.humidity_percent.toFixed(1)}%`
                    : "—"
                }
                subtitle={d.latestReading}
                icon={<Droplets size={20} />}
              />

              <StatCard
                title={d.weight}
                value={
                  latest?.hive_weight_kg != null
                    ? `${latest.hive_weight_kg.toFixed(2)} kg`
                    : "—"
                }
                subtitle={d.loadCellReading}
                icon={<Scale size={20} />}
              />

              <StatCard
                title={d.acoustic}
                value={
                  latest?.sound_level != null
                    ? latest.sound_level.toFixed(1)
                    : "—"
                }
                subtitle={d.sensorActivity}
                icon={<Volume2 size={20} />}
              />
            </div>

            {/* LATEST TELEMETRY */}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DDD5C7] bg-[#FFFDF8] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[#3C8054]" />

                <span className="text-base font-medium text-[#4F4941]">
                  {d.latestTelemetry}
                </span>
              </div>

              <span className="font-mono text-base text-[#71695E]">
                {latestRecorded}
              </span>
            </div>

            {/* CHARTS */}

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              {/* TEMPERATURE */}

              <ChartCard
                title={d.temperatureHistory}
                subtitle={d.temperatureValues}
              >
                {chartData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart data={chartData}>
                      <CartesianGrid
                        stroke="#E4DED3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="time"
                        tick={{
                          fill: "#655E53",
                          fontSize: 14,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fill: "#655E53",
                          fontSize: 14,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#FFFDF8",
                          border: "1px solid #DDD5C7",
                          borderRadius: "10px",
                          color: "#29251F",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="temperature"
                        name={d.temperature}
                        stroke="#C78300"
                        strokeWidth={2.5}
                        dot
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart
                    loading={loading}
                    loadingText={d.loadingTelemetry}
                    emptyText={d.noReadings}
                  />
                )}
              </ChartCard>

              {/* HUMIDITY */}

              <ChartCard
                title={d.humidityHistory}
                subtitle={d.humidityDht}
              >
                {chartData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart data={chartData}>
                      <CartesianGrid
                        stroke="#E4DED3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="time"
                        tick={{
                          fill: "#655E53",
                          fontSize: 14,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        domain={[0, 100]}
                        tick={{
                          fill: "#655E53",
                          fontSize: 14,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#FFFDF8",
                          border: "1px solid #DDD5C7",
                          borderRadius: "10px",
                          color: "#29251F",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="humidity"
                        name={d.humidity}
                        stroke="#4B83C4"
                        strokeWidth={2.5}
                        dot
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart
                    loading={loading}
                    loadingText={d.loadingTelemetry}
                    emptyText={d.noReadings}
                  />
                )}
              </ChartCard>
            </div>

            {/* LOWER GRID */}

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
              {/* HIVE NETWORK */}

              <div className="rounded-2xl border border-[#DDD5C7] bg-[#FFFDF8] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-[#29251F]">
                      {d.hiveNetwork}
                    </p>

                    <p className="mt-1 text-base text-[#71695E]">
                      {d.connectedDevices}
                    </p>
                  </div>

                  <Hexagon
                    size={19}
                    className="text-[#A86500]"
                  />
                </div>

                <div className="mt-6 space-y-3">
                  {hives.length === 0 && !loading && (
                    <p className="text-base text-[#71695E]">
                      {d.noHives}
                    </p>
                  )}

                  {hives.map((hive) => (
                    <Link
                      href={`/hives/${hive.id}`}
                      key={hive.id}
                      className="group flex items-center justify-between rounded-xl border border-[#E3DCCE] bg-[#FAF8F2] p-4 transition hover:border-[#C78300]/50 hover:bg-[#FFF8E8]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C78300]/10 text-[#A86500]">
                          <Hexagon size={18} />
                        </div>

                        <div>
                          <p className="text-base font-semibold text-[#29251F]">
                            {hive.hive_code}
                          </p>

                          <p className="mt-1 text-base text-[#71695E]">
                            {hive.esp32_device_id ||
                              d.esp32Device}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-base font-medium text-[#3C8054]">
                          <div className="h-2 w-2 rounded-full bg-[#3C8054]" />
                          {d.active}
                        </div>

                        <ChevronRight
                          size={17}
                          className="text-[#9A8E7D] transition group-hover:text-[#4F4941]"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* LOCATION */}

              <div className="rounded-2xl border border-[#DDD5C7] bg-[#FFFDF8] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-[#29251F]">
                      {d.hiveLocation}
                    </p>

                    <p className="mt-1 text-base text-[#71695E]">
                      {d.latestGps}
                    </p>
                  </div>

                  <MapPin
                    size={19}
                    className="text-[#A86500]"
                  />
                </div>

                {latest?.latitude != null &&
                latest?.longitude != null ? (
                  <div className="mt-6">
                    <div className="flex h-40 items-center justify-center rounded-xl border border-[#DDD5C7] bg-[#F7F4EC]">
                      <div className="text-center">
                        <MapPin
                          size={30}
                          className="mx-auto text-[#A86500]"
                        />

                        <p className="mt-3 font-mono text-base font-medium text-[#3F3A34]">
                          {latest.latitude.toFixed(4)}
                        </p>

                        <p className="font-mono text-base text-[#655E53]">
                          {latest.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-base text-[#71695E]">
                      {d.gpsCoordinates}
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 flex h-40 items-center justify-center rounded-xl border border-[#DDD5C7] bg-[#F7F4EC] text-base font-medium text-[#71695E]">
                    {d.noGps}
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM CARDS */}

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <MiniCard
                icon={<Package size={19} />}
                title={d.honeyBatches}
                value="1"
                description={d.batchRecords}
                href="/batches"
              />

              <MiniCard
                icon={<MapPin size={19} />}
                title={d.traceability}
                value={d.ready}
                description={d.consumerVerification}
                href="/batches"
              />

              <MiniCard
                icon={<Scale size={19} />}
                title={d.latestWeight}
                value={
                  latest?.hive_weight_kg != null
                    ? `${latest.hive_weight_kg.toFixed(2)} kg`
                    : "—"
                }
                description={d.loadCellTelemetry}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ==========================================================================
   SIDEBAR ITEM
========================================================================== */

function SidebarItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition ${
        active
          ? "bg-[#C78300]/10 text-[#A86500]"
          : "text-[#655E53] hover:bg-[#EEE8DC] hover:text-[#29251F]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

/* ==========================================================================
   STAT CARD
========================================================================== */

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#DDD5C7] bg-[#FFFDF8] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-base font-semibold text-[#655E53]">
          {title}
        </span>

        <div className="shrink-0 text-[#A86500]">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-2xl font-semibold tracking-tight text-[#29251F] sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 text-base text-[#71695E]">
        {subtitle}
      </p>
    </div>
  );
}

/* ==========================================================================
   CHART CARD
========================================================================== */

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#DDD5C7] bg-[#FFFDF8] p-5 sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-[#29251F]">
            {title}
          </p>

          <p className="mt-1 text-base text-[#71695E]">
            {subtitle}
          </p>
        </div>

        <div className="rounded-lg border border-[#DDD5C7] bg-[#F7F4EC] p-2 text-[#655E53]">
          <ArrowUpRight size={17} />
        </div>
      </div>

      <div className="h-[260px] sm:h-[300px]">
        {children}
      </div>
    </div>
  );
}

/* ==========================================================================
   EMPTY CHART
========================================================================== */

function EmptyChart({
  loading,
  loadingText,
  emptyText,
}: {
  loading: boolean;
  loadingText: string;
  emptyText: string;
}) {
  return (
    <div className="flex h-full items-center justify-center text-base font-medium text-[#71695E]">
      {loading ? loadingText : emptyText}
    </div>
  );
}

/* ==========================================================================
   MINI CARD
========================================================================== */

function MiniCard({
  icon,
  title,
  value,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-[#DDD5C7] bg-[#FFFDF8] p-5 transition hover:border-[#C78300]/50 hover:bg-[#FFFCF5]">
      <div className="flex items-center gap-3 text-[#655E53]">
        {icon}

        <span className="text-base font-semibold">
          {title}
        </span>
      </div>

      <p className="mt-5 text-xl font-semibold text-[#29251F]">
        {value}
      </p>

      <p className="mt-2 text-base text-[#71695E]">
        {description}
      </p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}