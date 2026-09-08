"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  FileCheck,
  ChevronLeft,
  Coins,
  TrendingUp,
  Percent,
} from "lucide-react";
import { MOCK_BATCHES } from "../../../lib/mockData";

export default function VerifyBatchPage() {
  const params = useParams();
  const rawBatchId = params?.batchId ? decodeURIComponent(params.batchId) : "BATCH-2026-KVIC-001";

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiveFromBackend, setIsLiveFromBackend] = useState(false);

  useEffect(() => {
    async function fetchBatchData() {
      setLoading(true);
      try {
        
        const res = await fetch(`http://localhost:8000/batches/${encodeURIComponent(rawBatchId)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setBatch(data);
          setIsLiveFromBackend(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        
      }

      
      const matchedMock = MOCK_BATCHES[rawBatchId] || MOCK_BATCHES["BATCH-2026-KVIC-001"];
      setBatch(matchedMock);
      setIsLiveFromBackend(false);
      setLoading(false);
    }

    fetchBatchData();
  }, [rawBatchId]);

  if (loading || !batch) {
    return (
      <div className="min-h-screen honey-hero-mesh flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full verdict-seal-badge flex items-center justify-center animate-pulse text-2xl">
            🍯
          </div>
          <p className="mt-4 font-serif text-lg text-amber-950 font-medium">
            Verifying cryptographic ledger proof...
          </p>
          <p className="font-mono text-xs text-amber-800/60 mt-1">
            Querying Polygon Amoy block headers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen honey-hero-mesh pb-20 selection:bg-amber-200">
      
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-amber-900/10 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-amber-950 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-2 py-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>HoneyChain Scanner</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-mono text-[11px] text-amber-950">
              {batch.blockchain.network}
            </span>
          </div>
        </div>
      </header>

      
      <main className="max-w-xl mx-auto px-4 pt-6 space-y-6">

       
        <section
          aria-labelledby="verdict-heading"
          className="relative overflow-hidden rounded-3xl bg-white/90 p-7 shadow-xl border border-amber-300/80 animate-verdict-reveal"
        >
          
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl verdict-seal-badge flex items-center justify-center text-3xl shadow-md">
              🍯
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Authentic Honey</span>
              </span>
              <span className="block font-mono text-[11px] text-amber-900/60 mt-1">
                {batch.batchId}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <h1
              id="verdict-heading"
              className="font-serif text-3xl font-extrabold text-[#24140D] tracking-tight leading-tight"
            >
              {batch.verdictHeadline}
            </h1>
            <p className="mt-2 text-sm text-amber-950/80 leading-relaxed">
              {batch.verdictSubline}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs text-amber-900/70">
            <span>Khadi Honey Quality Protocol</span>
            <span className="font-mono font-medium text-amber-950">
              Anchored {batch.harvest.date}
            </span>
          </div>
        </section>

        
        <section
          aria-labelledby="origin-heading"
          className="rounded-3xl bg-white/85 p-6 shadow-md border border-amber-200/70 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CF840E]" />
              <h2
                id="origin-heading"
                className="font-serif text-lg font-bold text-[#24140D]"
              >
                Origin & Producer of Record
              </h2>
            </div>
            <span className="font-mono text-[11px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
              Permanent On-Chain Link
            </span>
          </div>

          
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-amber-100 font-serif text-xl font-bold border-2 border-amber-200 shadow-inner">
              {batch.beekeeper.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-[#24140D]">
                {batch.beekeeper.name}
              </h3>
              <p className="text-xs text-amber-950/80">
                {batch.beekeeper.cooperative}
              </p>
              <p className="font-mono text-[11px] text-amber-900/60 mt-0.5">
                KVIC Reg: {batch.beekeeper.id} ({batch.beekeeper.experienceYears} years apiculture)
              </p>
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-amber-200/60">
              <span className="flex items-center space-x-1 text-[11px] text-amber-900/70">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Floral Source</span>
              </span>
              <p className="font-medium text-xs text-[#24140D] mt-1 font-serif">
                {batch.harvest.floralSource}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-amber-200/60">
              <span className="flex items-center space-x-1 text-[11px] text-amber-900/70">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Harvest Date</span>
              </span>
              <p className="font-medium text-xs text-[#24140D] mt-1 font-mono">
                {batch.harvest.date}
              </p>
            </div>
          </div>

          
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-amber-200/60 flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-amber-800 mt-0.5 shrink-0" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-[#24140D]">
                {batch.harvest.apiary}
              </p>
              <p className="text-amber-900/70 mt-0.5">
                {batch.beekeeper.region}
              </p>
              <p className="font-mono text-[10px] text-amber-800/70 mt-1">
                GPS: {batch.harvest.coordinates.lat.toFixed(4)}° N, {batch.harvest.coordinates.lng.toFixed(4)}° E
              </p>
            </div>
          </div>
        </section>

       
        <section
          aria-labelledby="quality-heading"
          className="rounded-3xl bg-white/85 p-6 shadow-md border border-amber-200/70 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-800" />
              <h2
                id="quality-heading"
                className="font-serif text-lg font-bold text-[#24140D]"
              >
                Laboratory Analysis & Purity
              </h2>
            </div>
            <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {batch.quality.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-amber-200/60 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-900/60">
                Purity Score
              </span>
              <p className="text-xl font-bold font-mono text-emerald-800 mt-0.5">
                {batch.quality.purityScore}%
              </p>
              <span className="text-[10px] text-amber-900/60">Target &gt; 98.0%</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-amber-200/60 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-900/60">
                Moisture
              </span>
              <p className="text-xl font-bold font-mono text-[#24140D] mt-0.5">
                {batch.quality.moisture}%
              </p>
              <span className="text-[10px] text-amber-900/60">FSSAI Limit &lt; 20%</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-amber-200/60 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-900/60">
                C4 Corn/Cane Sugars
              </span>
              <p className="text-sm font-bold font-mono text-emerald-800 mt-1">
                {batch.quality.c4Sugar}
              </p>
              <span className="text-[10px] text-amber-900/60">Zero Adulteration</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-amber-900/70 border-t border-amber-900/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>Certified by: {batch.quality.labName}</span>
            <span className="font-mono text-[11px] text-amber-950">
              Cert #{batch.quality.certificateNumber}
            </span>
          </div>
        </section>

        
        <section
          aria-labelledby="blockchain-heading"
          className="rounded-3xl bg-white/85 p-6 shadow-md border border-amber-200/70 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#CF840E]" />
              <h2
                id="blockchain-heading"
                className="font-serif text-lg font-bold text-[#24140D]"
              >
                Blockchain Ledger Proof
              </h2>
            </div>
            <span className="font-mono text-[11px] text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
              Immutable
            </span>
          </div>

          <p className="text-xs text-amber-950/80 leading-relaxed">
            Every harvest batch is cryptographically hashed and permanently registered on the public Polygon ledger. You don&apos;t have to take our word for it — verify the proof directly on the explorer.
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-amber-200/60">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-900/60 block mb-1">
                Batch Cryptographic Hash (Keccak-256)
              </span>
              <span className="font-mono text-xs text-[#24140D] break-all select-all">
                {batch.blockchain.batchHash}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-amber-200/60">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-900/60 block mb-1">
                Transaction Hash
              </span>
              <span className="font-mono text-xs text-amber-900 break-all select-all">
                {batch.blockchain.txHash}
              </span>
            </div>
          </div>

          <a
            href={batch.blockchain.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-950 font-mono text-xs flex items-center justify-center space-x-2 border border-amber-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <span>Verify on Polygonscan Amoy Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

        
        <section
          aria-labelledby="royalty-heading"
          className="rounded-3xl royalty-accent-card p-6 text-[#FAF7F2] shadow-2xl relative overflow-hidden"
        >
          
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#EBA818]/15 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-amber-400/20 pb-4">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-[#FDECB5]" />
              <h2
                id="royalty-heading"
                className="font-serif text-xl font-bold text-[#FDECB5]"
              >
                Fair-Trade Value Gap & Royalty
              </h2>
            </div>
            <span className="font-mono text-xs font-bold text-[#EBA818] bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/40">
              15% On-Chain Share
            </span>
          </div>

          <p className="mt-3 text-xs text-amber-100/80 leading-relaxed">
            Unlike opaque commercial honey chains where farmers receive a fraction of retail prices, HoneyChain binds downstream resales to this batch ID, automatically returning a fair royalty to the rural beekeeper.
          </p>

          
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-black/30 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/70 block">
                Farm-Gate Base Price
              </span>
              <p className="text-2xl font-bold font-mono text-amber-200 mt-1">
                ₹{batch.royalty.farmGatePriceINR}
                <span className="text-xs font-normal text-amber-300/60"> /kg</span>
              </p>
              <span className="text-[10px] text-amber-200/60 mt-0.5 block">
                Procurement at Apiary
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-amber-500/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/70 block">
                Retail Shelf Price
              </span>
              <p className="text-2xl font-bold font-mono text-[#FDECB5] mt-1">
                ₹{batch.royalty.shelfPriceINR}
                <span className="text-xs font-normal text-amber-300/60"> /kg</span>
              </p>
              <span className="text-[10px] text-amber-200/60 mt-0.5 block">
                Consumer Supermarket
              </span>
            </div>
          </div>

          
          <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-serif text-amber-100 block">
                Downstream Value Gap
              </span>
              <span className="text-[11px] text-amber-300/70">
                Shelf markup absorbed in transit
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono text-[#FDECB5]">
                ₹{batch.royalty.valueGapINR} /kg
              </span>
            </div>
          </div>

          
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-600/30 to-amber-700/20 border border-[#EBA818]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-amber-100 uppercase font-mono">
                  Royalty Owed to {batch.beekeeper.name}
                </span>
              </div>
              <span className="font-mono text-xs text-amber-300">
                {batch.royalty.royaltyPercentage}% of gross resale
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-mono text-[#FDECB5]">
                  ₹{batch.royalty.totalRoyaltyOwedINR.toLocaleString()}
                </span>
                <span className="text-xs text-amber-200/80 ml-2 font-mono">
                  (₹{batch.royalty.royaltyPerKgINR}/kg)
                </span>
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                On-Chain Traceable
              </span>
            </div>
          </div>

          
          {batch.royalty.resaleHistory && batch.royalty.resaleHistory.length > 0 && (
            <div className="mt-4 pt-3 border-t border-amber-400/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/70 block mb-2">
                Downstream Resale Audit Trail
              </span>
              <div className="space-y-2">
                {batch.royalty.resaleHistory.map((claim, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-black/20 text-xs flex items-center justify-between border border-amber-500/10"
                  >
                    <div>
                      <p className="font-semibold text-amber-100">{claim.stage}</p>
                      <p className="font-mono text-[10px] text-amber-300/60">
                        {claim.date} · {claim.quantityKg} kg
                      </p>
                    </div>
                    <span className="font-mono text-amber-200 font-medium">
                      ₹{claim.unitPriceINR}/kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        
        <footer className="pt-6 border-t border-amber-900/10 text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-serif font-semibold text-amber-950">
            <span>Khadi and Village Industries Commission (KVIC)</span>
          </div>
          <p className="text-xs text-amber-900/70">
            Ministry of Micro, Small & Medium Enterprises · Government of India
          </p>
          <p className="font-mono text-[10px] text-amber-800/60">
            National Honey Mission · HoneyChain Protocol (SIH 2026 PS 26021)
          </p>
        </footer>
      </main>
    </div>
  );
}
