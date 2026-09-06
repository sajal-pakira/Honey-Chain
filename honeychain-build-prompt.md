# HoneyChain — Master Build Prompt (Google Antigravity)

## PROJECT OVERVIEW

Build **HoneyChain** — a blockchain-based honey traceability and smart
beekeeping management platform for SIH 2026 (Problem Statement 26021,
Ministry of MSME / KVIC). The system proves honey authenticity via
QR-code verification, secures batch data on a blockchain ledger, monitors
hive health via IoT + AI, and — the core differentiator — enforces a
blockchain-anchored royalty mechanism so rural beekeepers get provable,
traceable compensation when their honey is resold downstream at a markup.

Build this as a **monorepo** with clearly separated services so each part
can be developed, run, and demoed independently.

---

## CORE PRINCIPLE (do not lose this while building)

This is not just "scan QR → see data." The product's differentiator is:

> Every batch has a permanent, on-chain "producer of record." Every
> downstream resale (processor → brand → retailer) must reference that
> same batch ID, making the value gap between farm-gate price and shelf
> price publicly visible, auditable, and owed back to the beekeeper.

All modules should reinforce this — the QR page, the smart contract, and
the beekeeper app all need to make this loop visible and demoable.

---

## MONOREPO STRUCTURE

```
honeychain/
├── contracts/            # Solidity smart contracts + deployment scripts
├── backend/               # FastAPI backend
├── mobile-app/            # React Native beekeeper app
├── consumer-web/          # Next.js QR verification page (consumer-facing)
├── admin-dashboard/        # Next.js KVIC admin dashboard
├── iot-simulator/          # Python/Node script simulating ESP32 sensor + TEE attestation
├── ai-models/             # Disease detection + productivity prediction models
└── docs/                  # Architecture diagram, README, pitch assets
```

---

## 1. SMART CONTRACT LAYER (`/contracts`)

**Stack:** Solidity ^0.8.x, Hardhat, deploy target Polygon Amoy testnet.

Build a contract `HoneyBatchRegistry.sol` with:

- `anchorBatch(bytes32 batchHash, string calldata batchId)` — anchors a
  new batch. Must revert if `batchId` already exists. Emits
  `BatchAnchored(batchId, batchHash, anchoredBy, timestamp)`.
- `verifyBatch(string calldata batchId) view returns (bytes32 batchHash, address anchoredBy, uint256 anchoredAt)`
  — free lookup for the QR page / anyone verifying a batch.
- `claimBatch(bytes32 batchHash, address claimant, uint256 quantitySold, uint256 priceSold)`
  — called by any downstream reseller (processor/brand) claiming a batch
  for resale. Must permanently link `claimant → original beekeeper → sale price`.
  Emits `BatchClaimed(batchId, claimant, quantitySold, priceSold, timestamp)`.
- `getRoyaltyOwed(bytes32 batchHash) view returns (uint256 amountOwed)`
  — computes owed royalty based on an agreed percentage (make this a
  configurable constant, e.g. 15%) applied to cumulative `priceSold`
  values claimed against that batch.
- No upgradability, no OpenZeppelin dependency, minimal access control
  beyond duplicate/misuse prevention — this is a prototype, not
  production infra.
- Add NatSpec comments on every function in plain English (judges may
  read the code directly).

**Also produce:**
- A Hardhat deployment script targeting Polygon Amoy.
- A Node.js/ethers.js script that: takes a sample batch JSON (beekeeper
  name, harvest date, apiary location, floral source, quantity, lab
  test), computes a deterministic keccak256 hash, calls `anchorBatch`,
  then simulates a `claimBatch` at a markup price, then calls
  `getRoyaltyOwed` and prints the result plus the Polygonscan Amoy
  explorer links for both transactions.
- A short `README.md` in `/contracts` explaining in plain language what
  the contract proves and why only hashes (not raw data) are stored
  on-chain.

---

## 2. BACKEND (`/backend`)

**Stack:** FastAPI, Python, PostgreSQL (structured data), MongoDB or
Postgres time-series table (sensor logs), AWS S3 or local storage stub
for batch photos/lab reports, JWT auth.

Services to implement as separate routers:

1. **Batch/QR service**
   - `POST /batches` — beekeeper submits a new harvest batch (beekeeper
     ID, hive ID, harvest date, GPS location, floral source, quantity,
     photos, lab test data or "pending" status).
   - Computes the canonical JSON hash for the batch, calls the deployed
     smart contract's `anchorBatch` via web3.py, stores the returned tx
     hash alongside the record.
   - `GET /batches/{batch_id}` — returns full batch record + on-chain
     proof, used by the consumer QR page.
   - `POST /batches/{batch_id}/claim` — records a downstream resale
     claim, calls `claimBatch` on-chain.
   - `GET /batches/{batch_id}/royalty` — calls `getRoyaltyOwed` and
     returns the current amount owed to the beekeeper.

2. **IoT ingestion + analytics service**
   - `POST /sensors/{hive_id}/reading` — accepts sensor payloads
     (temperature, humidity, weight, timestamp, TEE attestation
     signature). Validates the attestation signature before accepting
     the reading.
   - `GET /hives/{hive_id}/health-score` — returns a computed colony
     health score derived from recent sensor trends (weight trend =
     nectar flow rate; temp/humidity deviation = stress/disease signal).
   - `GET /hives/{hive_id}/productivity-forecast` — returns a basic
     regression-based yield forecast.

3. **Disease detection service**
   - `POST /disease-detection/analyze` — accepts a hive frame image,
     runs it through the AI model (see AI section), returns detected
     condition (e.g. varroa mite, foulbrood, healthy) with confidence
     score.

4. **Auth + user service**
   - JWT-based auth for beekeepers and KVIC admin roles.
   - Device ID logging on batch submission for basic fraud-pattern
     detection (e.g. flag impossible patterns like two harvests from
     different states in the same hour).

Include a `requirements.txt`, `.env.example` for config (DB URL, JWT
secret, blockchain RPC URL, contract address), and a `docker-compose.yml`
that spins up the API + Postgres together for easy local demo setup.

---

## 3. CONSUMER QR VERIFICATION PAGE (`/consumer-web`)

**Stack:** Next.js (App Router), Tailwind CSS. Deployable to Vercel with
zero config.

- Dynamic route `/verify/[batchId]`.
- On load, fetches batch data from the backend (`GET /batches/{batch_id}`)
  — falls back to hardcoded mock data if the backend isn't running, so
  the page is demoable standalone.
- **Structure (single scrollable page, mobile-first):**
  1. Verdict-first hero: immediate, confident authenticity confirmation
     (not a data table) — this is the emotional payoff of the scan.
  2. Origin story: beekeeper name/photo, apiary location on a simple map,
     harvest date, floral source.
  3. Quality: lab purity/moisture result, verified/pending status.
  4. Blockchain proof: truncated tx hash, network name, tappable link to
     the public Polygon Amoy explorer — framed as "check it yourself,"
     not decoration.
  5. Royalty transparency panel: shows the beekeeper's royalty owed
     (pulled from `getRoyaltyOwed`) — this is the differentiator panel,
     make it visually distinct from the rest.
  6. Footer: KVIC / Ministry of MSME attribution line.
- One considered transition/animation moving from "verdict" to "proof"
  sections — smooth, physical-feeling (spring/ease-out), not generic
  fade-in-on-scroll or bouncy cards. Respect `prefers-reduced-motion`.
- **Design direction:** ground palette in raw honey / rural apiculture —
  warm amber/gold + deep umber/walnut tones, 4–5 committed hex values.
  Avoid generic SaaS trust-badge aesthetics (no cream+terracotta default,
  no neon-on-black, no green circular checkmark badges, no ALL-CAPS
  eyebrows, no "→" arrows, no middle-dot meta text). One strong display
  typeface for the verdict moment, one clean body face.
- Fully responsive, accessible (visible focus states, alt text, contrast).

---

## 4. BEEKEEPER MOBILE APP (`/mobile-app`) — React Native

**Stack:** React Native (Expo preferred for fast demo setup), React
Navigation, Axios/fetch for API calls, expo-location for GPS,
expo-image-picker for photo capture.

**Screens:**

1. **Login/Onboarding** — simple phone-number or beekeeper-ID based auth
   (JWT), local language toggle if time permits.
2. **Home/Dashboard** — hive list, latest sensor readings summary
   (pulled from backend), colony health score badge per hive, quick
   "New Harvest" action button.
3. **Harvest Entry Form** — the "4–5 taps max" form:
   - Hive/apiary selector (dropdown)
   - Auto-captured GPS location + timestamp
   - Floral source (dropdown: mustard, litchi, multifloral, etc.)
   - Quantity harvested (numeric input)
   - Photo capture (extraction proof)
   - Lab test fields (optional — "pending verification" if blank)
   - Submit → calls `POST /batches`, shows the returned batch ID + QR
     code generated for that batch (use a QR-generation library,
     e.g. `react-native-qrcode-svg`) so the beekeeper can print/attach
     it to the jar immediately.
4. **Hive Inspection Log** — structured (not free-text) form: colony
   strength, queen sighted (yes/no), brood pattern, manual disease/pest
   flag, treatment/feeding log entry.
5. **Royalty Tracker screen** — pulls `GET /batches/{batch_id}/royalty`
   for all of the beekeeper's batches, shows cumulative amount owed
   across resales. This screen embodies the core value proposition —
   make it prominent in the nav, not buried.
6. **Disease Alert screen** — shows AI disease-detection results from
   recent hive photo submissions, with a plain-language explanation and
   recommended action.

**Design:** icon-heavy, minimal typing, large touch targets — must work
for a user with a basic Android phone and limited literacy. Reuse the
same warm amber/umber palette as the consumer web page for brand
consistency across the ecosystem.

---

## 5. KVIC ADMIN DASHBOARD (`/admin-dashboard`)

**Stack:** Next.js, Tailwind CSS, Chart.js or Recharts for data viz.

- Map view of beekeeping clusters (can use mock/sample coordinates).
- Productivity charts across clusters (yield trends, using data from the
  productivity-forecast endpoint or sample data).
- Colony health monitoring feed — aggregated health scores across hives.
- Disease alert feed — recent AI-flagged disease detections across the
  network, sortable by severity/region.
- Royalty flow overview — aggregate view of total royalties
  tracked/owed across all beekeepers in the system, reinforcing the
  livelihood-impact narrative for judges.
- Can run entirely on mock/sample data if backend integration time is
  short — structure API calls so real data is a drop-in swap.

---

## 6. IoT + TEE SIMULATION (`/iot-simulator`)

**Stack:** Python or Node.js script (since real ESP32 hardware may not
be available for every hive).

- Simulates sensor readings (temperature, humidity, hive weight) on a
  realistic schedule (every 5–15 min equivalent, sped up for demo).
- Simulates a **TEE attestation step**: before "transmitting" each
  reading, sign it with a private key held only in the simulated secure
  enclave context (clearly commented as representing ARM TrustZone
  attestation), and attach the signature to the payload.
- Posts the signed payload to the backend's
  `POST /sensors/{hive_id}/reading` endpoint, matching the schema a real
  ESP32 firmware would use — so real hardware is a drop-in replacement
  later.
- If actual ESP32 + DHT22 + HX711 hardware is available, also provide
  Arduino/C++ firmware that reads real sensors and posts to the same
  endpoint/schema, with a note on where hardware-level TEE (ARM
  TrustZone) would sit in a production version.

---

## 7. AI MODELS (`/ai-models`)

**Stack:** Python, TensorFlow or PyTorch, TFLite export for on-device
inference feasibility.

- **Disease detection model:** image classifier (transfer learning on
  MobileNet or similar lightweight architecture) trained/fine-tuned to
  distinguish healthy hive frames vs. varroa mite / foulbrood
  indicators. If a labeled dataset isn't available, use a public
  bee-disease image dataset or clearly note where synthetic/placeholder
  training data was used, so this is honestly represented in the demo.
- **Productivity prediction model:** basic regression model (weight
  trend + weather/environmental data as features) predicting expected
  yield. Synthetic time-series data is acceptable for prototype scope.
- Expose both models via a simple inference script or FastAPI endpoint
  the backend can call.

---

## 8. DOCUMENTATION (`/docs`)

- `architecture-diagram` — layered diagram: Hive edge (sensors + TEE +
  camera + beekeeper app) → Backend (FastAPI services) → Data + ledger
  (Postgres/IPFS + blockchain) → Consumer QR page + KVIC admin
  dashboard, both reading from the same backend.
- `README.md` at repo root — project overview, problem statement
  reference (PS ID 26021), setup instructions per module, and the core
  royalty-mechanism explanation in plain language for judges reading the
  code directly.
- `demo-script.md` — the exact live-demo sequence: (1) anchor a batch as
  the beekeeper, (2) claim/resell it as a brand at a markup, (3) query
  royalty owed from an unrelated wallet/session to prove public
  verifiability, (4) scan the resulting QR code to show the full
  consumer-facing proof chain.

---

## GLOBAL CONSTRAINTS

- Keep every module runnable independently with mock data — no single
  module's failure (e.g. blockchain RPC down, hardware unavailable)
  should block the rest of the demo.
- Prioritize build order: (1) smart contract + deploy script, (2)
  consumer QR page with mock data, (3) backend batch/QR service wired to
  the real contract, (4) royalty tracker end-to-end (anchor → claim →
  query), (5) beekeeper app, (6) IoT simulator + AI models, (7) admin
  dashboard.
- Use consistent visual language (same color palette, typography) across
  consumer-web, mobile-app, and admin-dashboard so the whole ecosystem
  reads as one coherent product, not disconnected demos.
- Every service should have a `.env.example` and a one-command local run
  path (`docker-compose up`, `npm run dev`, `npx expo start`, etc.)
  documented in its own README.
