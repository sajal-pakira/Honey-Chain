"use client";

import { Globe2 } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-full border border-[#E9DFCC] bg-white/75 px-3 py-2 backdrop-blur-xl">
        <Globe2
          size={14}
          className="text-[#A86500]"
        />

        <select
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value as "hi" | "en" | "bn"
            )
          }
          aria-label="Select language"
          className="cursor-pointer appearance-none bg-transparent pr-1 text-xs font-medium text-[#4A433B] outline-none"
        >
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>
    </div>
  );
}