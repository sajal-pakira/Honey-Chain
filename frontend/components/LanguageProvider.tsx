"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "hi" | "en" | "bn";

const translations = {
  hi: {
    // Common
    dashboard: "डैशबोर्ड",
    hives: "मधुमक्खी के छत्ते",
    honeyBatches: "शहद बैच",
    supplyChain: "सप्लाई चेन",
    traceability: "ट्रेसबिलिटी",
    settings: "सेटिंग्स",
    refresh: "रीफ्रेश",
    viewHive: "छत्ता देखें",
    viewDetails: "विवरण देखें",
    online: "ऑनलाइन",
    offline: "ऑफलाइन",

    // Hives
    connectedApiaries: "जुड़े हुए मधुमक्खी पालन केंद्र",
    hiveIntelligence: "मधुमक्खी के छत्ते की जानकारी",
    hiveDescription:
      "HoneyChain से जुड़े ESP32 डिवाइस से छत्ते का वास्तविक समय डेटा।",
    network: "नेटवर्क",
    hive: "छत्ता",
    temperature: "तापमान",
    humidity: "नमी",
    weight: "वज़न",
    acoustic: "ध्वनि स्तर",
    gpsPosition: "GPS स्थान",
    latitude: "अक्षांश",
    longitude: "देशांतर",
    lastTelemetry: "अंतिम डेटा",
    waitingForData: "डेटा की प्रतीक्षा",
    gpsUnavailable: "GPS उपलब्ध नहीं है",
    deviceNotAssigned: "डिवाइस असाइन नहीं है",
    noConnectedHives: "कोई जुड़ा हुआ छत्ता नहीं है",
    registerHive:
      "डेटा प्राप्त करना शुरू करने के लिए ESP32 वाला छत्ता रजिस्टर करें।",

    // Status
    hivesOnline: "छत्ते ऑनलाइन",
    hiveOnline: "छत्ता ऑनलाइन",

    // Errors
    apiError: "HoneyChain API से कनेक्ट नहीं हो पा रहा है।",
    tryAgain: "फिर से कोशिश करें",

    // Language
    language: "भाषा",
    english: "English",
    hindi: "हिंदी",
    bengali: "বাংলা",
  },

  en: {
    dashboard: "Dashboard",
    hives: "Hives",
    honeyBatches: "Honey Batches",
    supplyChain: "Supply Chain",
    traceability: "Traceability",
    settings: "Settings",
    refresh: "Refresh",
    viewHive: "View hive",
    viewDetails: "View details",
    online: "ONLINE",
    offline: "OFFLINE",

    connectedApiaries: "Connected Apiaries",
    hiveIntelligence: "Hive intelligence.",
    hiveDescription:
      "Real-time hive data collected from HoneyChain-connected ESP32 devices.",
    network: "Network",
    hive: "Hive",
    temperature: "Temperature",
    humidity: "Humidity",
    weight: "Weight",
    acoustic: "Acoustic",
    gpsPosition: "GPS Position",
    latitude: "Latitude",
    longitude: "Longitude",
    lastTelemetry: "Last telemetry",
    waitingForData: "Waiting for data",
    gpsUnavailable: "GPS unavailable",
    deviceNotAssigned: "DEVICE NOT ASSIGNED",
    noConnectedHives: "No connected hives",
    registerHive:
      "Register an ESP32-powered hive to start receiving telemetry.",

    hivesOnline: "hives online",
    hiveOnline: "hive online",

    apiError: "Unable to connect to the HoneyChain API.",
    tryAgain: "Try again",

    language: "Language",
    english: "English",
    hindi: "हिंदी",
    bengali: "বাংলা",
  },

  bn: {
    dashboard: "ড্যাশবোর্ড",
    hives: "মৌচাক",
    honeyBatches: "মধুর ব্যাচ",
    supplyChain: "সাপ্লাই চেইন",
    traceability: "ট্রেসেবিলিটি",
    settings: "সেটিংস",
    refresh: "রিফ্রেশ",
    viewHive: "মৌচাক দেখুন",
    viewDetails: "বিস্তারিত দেখুন",
    online: "অনলাইন",
    offline: "অফলাইন",

    connectedApiaries: "সংযুক্ত মৌমাছি পালন কেন্দ্র",
    hiveIntelligence: "মৌচাকের তথ্য",
    hiveDescription:
      "HoneyChain-এর সাথে যুক্ত ESP32 ডিভাইস থেকে মৌচাকের রিয়েল-টাইম তথ্য।",
    network: "নেটওয়ার্ক",
    hive: "মৌচাক",
    temperature: "তাপমাত্রা",
    humidity: "আর্দ্রতা",
    weight: "ওজন",
    acoustic: "শব্দের মাত্রা",
    gpsPosition: "GPS অবস্থান",
    latitude: "অক্ষাংশ",
    longitude: "দ্রাঘিমাংশ",
    lastTelemetry: "সর্বশেষ তথ্য",
    waitingForData: "তথ্যের অপেক্ষায়",
    gpsUnavailable: "GPS উপলব্ধ নেই",
    deviceNotAssigned: "ডিভাইস অ্যাসাইন করা নেই",
    noConnectedHives: "কোনও সংযুক্ত মৌচাক নেই",
    registerHive:
      "তথ্য পাওয়া শুরু করতে একটি ESP32-যুক্ত মৌচাক রেজিস্টার করুন।",

    hivesOnline: "টি মৌচাক অনলাইন",
    hiveOnline: "টি মৌচাক অনলাইন",

    apiError: "HoneyChain API-তে সংযোগ করা যাচ্ছে না।",
    tryAgain: "আবার চেষ্টা করুন",

    language: "ভাষা",
    english: "English",
    hindi: "हिंदी",
    bengali: "বাংলা",
  },
};

type TranslationKey = keyof typeof translations.hi;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hindi is the default language.
  const [language, setLanguageState] =
    useState<Language>("hi");

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "honeychain-language"
    ) as Language | null;

    if (
      savedLanguage === "hi" ||
      savedLanguage === "en" ||
      savedLanguage === "bn"
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem(
      "honeychain-language",
      nextLanguage
    );
  };

  const t = (key: TranslationKey) => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}