import "./globals.css";

export const metadata = {
  title: "HoneyChain — Authenticity & Fair-Trade Verification",
  description:
    "Verify honey harvest authenticity on Polygon Amoy blockchain and inspect fair-trade beekeeper royalty transparency under KVIC & Ministry of MSME.",
  keywords: ["HoneyChain", "KVIC", "Honey Mission", "Blockchain Traceability", "Beekeeping", "Authentic Honey"],
  authors: [{ name: "HoneyChain Consortium / KVIC" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#24140D] antialiased selection:bg-amber-200 selection:text-[#24140D]">
        {children}
      </body>
    </html>
  );
}
