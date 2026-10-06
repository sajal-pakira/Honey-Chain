

# 🍯 HoneyChain

> **From hive to blockchain.**

HoneyChain is an IoT + Blockchain based honey traceability platform designed to connect the physical journey of honey with a tamper-evident digital record.

The platform combines **IoT hive monitoring, honey batch management, supply-chain traceability, blockchain verification, QR-based consumer verification, and multilingual accessibility** into one system.

---

## 🚀 What is HoneyChain?

Honey production involves multiple stages:

**Hive → Harvest → Processing → Packaging → Shipment → Consumer**

During this journey, information about the origin and handling of honey can become fragmented.

HoneyChain creates a digital identity for each honey batch and connects it to:

- The originating hive
- Hive telemetry
- Apiary location
- Harvest information
- Supply-chain events
- Blockchain proof
- QR-based consumer verification

This allows the journey of a honey batch to be traced from its origin to the final consumer.

---

# 🎯 Problem

Traditional honey supply chains can make it difficult for consumers and stakeholders to verify:

- Where the honey came from
- Which hive produced it
- When it was harvested
- How much honey was harvested
- Where it was processed
- How it moved through the supply chain
- Whether the recorded information was altered

HoneyChain addresses this by connecting **physical hive data with a digital traceability layer**.

---

# 💡 Our Solution

HoneyChain creates a complete digital trail:

```text
        🐝 HIVE
          │
          ↓
    📡 IoT TELEMETRY
          │
          ↓
     🍯 HONEY BATCH
          │
          ↓
    🔄 SUPPLY CHAIN
          │
          ↓
     ⛓️ BLOCKCHAIN
          │
          ↓
       🔐 PROOF
          │
          ↓
       QR CODE
          │
          ↓
   📱 HONEY PASSPORT
          │
          ↓
      CONSUMER
```

---

# ✨ Key Features

## 🐝 1. IoT Hive Monitoring

HoneyChain connects individual hives to the platform through ESP32-based IoT hardware.

The system can collect:

- 🌡️ Temperature
- 💧 Humidity
- ⚖️ Hive weight
- 🎙️ Acoustic activity
- 📍 GPS location

Each hive has its own identity and connected device.

Example:

```text
Hive
HIVE-001

Device
ESP32-HC-001

Status
Active
```

### Dashboard

![HoneyChain Dashboard](screenshots/dashboard.png)

---

# 📊 2. Hive Telemetry

Each hive has a dedicated monitoring page showing the latest telemetry and historical readings.

The platform visualizes:

- Temperature trends
- Humidity trends
- Hive weight
- Acoustic activity
- GPS information
- Last telemetry update

![Hive Monitoring](screenshots/hive-monitoring.png)

---

# 🍯 3. Digital Honey Batches

When honey is harvested, HoneyChain creates a unique digital batch.

Example:

```text
Batch ID
HC-2026-0001

Hive
HIVE-001

Harvested Weight
7.4 kg

Status
Harvested
```

Each batch can contain:

- Unique batch code
- Origin hive
- Beekeeper
- Harvest date
- Harvested quantity
- Honey type
- Floral source
- Blockchain proof
- Supply-chain events
- QR verification token

![Honey Batch](screenshots/honey-batch.png)

---

# 🔄 4. End-to-End Supply Chain Traceability

HoneyChain tracks the journey of a batch across multiple stages.

```text
🌱 HARVEST
     ↓
🏭 PROCESSING
     ↓
📦 PACKAGING
     ↓
🚚 SHIPMENT
     ↓
🏪 DELIVERY
```

Each event can contain information such as:

- Event type
- Actor
- Location
- Quantity
- Timestamp
- Notes
- Blockchain transaction information

![Supply Chain](screenshots/supply-chain.png)

---

# ⛓️ 5. Blockchain Verification

HoneyChain uses blockchain as an integrity layer for honey batch records.

A cryptographic proof is generated for the batch and registered on the Ethereum Sepolia network.

### Blockchain Network

```text
Network
Ethereum Sepolia

Smart Contract
HoneyChain Registry

Contract
0x894C573ff2EccF881CE9db7074e4C7E096889401
```

The system can verify whether the batch information matches the registered blockchain proof.

### Why Blockchain?

The database handles the application's operational data, while blockchain provides an independent verification layer for the batch's integrity.

![Blockchain Verification](screenshots/blockchain-verification.png)

---

# 🔐 6. Cryptographic Batch Proof

Every blockchain-enabled batch can contain:

```text
Blockchain Hash
        +
Blockchain Transaction Hash
        +
Verification Status
```

This creates a verifiable connection between the HoneyChain batch and its blockchain record.

Example:

```text
Batch
HC-2026-0001

Proof
SHA-256 / cryptographic proof

Blockchain
Ethereum Sepolia

Status
✓ Verified
```

---

# 📱 7. QR-Based Honey Passport

Every honey batch can be associated with a QR verification flow.

The consumer can scan the QR code on the honey package and access the digital Honey Passport.

```text
🍯 PHYSICAL HONEY
       │
       ↓
    QR CODE
       │
       ↓
HONEY PASSPORT
       │
       ├── Origin
       ├── Hive
       ├── Harvest
       ├── Processing
       ├── Packaging
       ├── Shipment
       └── Blockchain Verification
```

![QR Code](screenshots/qr-code.png)

---

# 🍯 8. Honey Passport

The Honey Passport is the consumer-facing traceability interface.

It presents the technical supply-chain information in a simple format.

Consumers can see:

### Origin

```text
Hive
HIVE-001

Apiary
Registered Apiary

Location
GPS coordinates
```

### Traceability

```text
✓ Harvest
✓ Processing
✓ Packaging
✓ Shipment
✓ Delivery
```

### Blockchain

```text
✓ Blockchain Verified
Ethereum Sepolia
```

![Honey Passport](screenshots/honey-passport.png)

---

# 🌐 9. Multilingual Interface

HoneyChain is designed for accessibility beyond English-speaking users.

The interface supports:

🇬🇧 **English**

🇮🇳 **বাংলা / Bengali**

🇮🇳 **हिन्दी / Hindi**

The language selector allows users to switch the interface language.

This makes the system more practical for local beekeepers and consumers.

![English Interface](screenshots/language-english.png)

![Bengali Interface](screenshots/language-bengali.png)

![Hindi Interface](screenshots/language-hindi.png)

---

# 📍 10. Hive Origin & GPS

HoneyChain associates the honey batch with its originating hive and apiary.

Telemetry can include:

```text
Latitude
23.520400

Longitude
87.311900
```

This provides geographical context for the origin of the honey.

![Hive Location](screenshots/gps-origin.png)

---

# 📈 11. Historical Telemetry

HoneyChain doesn't only display the latest sensor value.

Historical telemetry can be visualized to understand changes over time.

Example:

```text
Temperature
      ↗
     ↗
────↗──────── Time

Humidity
    ↘
     ↘
──────↘────── Time
```

This allows the beekeeper to monitor hive conditions over time.

---

# 🏗️ System Architecture

```text
                    HONEYCHAIN
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ↓               ↓                ↓
    IoT Layer       Application       Blockchain
        │               │                │
      ESP32          Next.js         Ethereum
        │               │             Sepolia
   ┌────┼────┐          │                │
   │    │    │          │                │
 Temp Humidity Weight   │                │
   │    │    │          │                │
   └────┼────┘          │                │
        │               │                │
        ↓               ↓                ↓
     Telemetry      FastAPI API     Smart Contract
                        │                │
                        ↓                │
                 PostgreSQL/Supabase    │
                        │                │
                        └────────┬───────┘
                                 ↓
                         Honey Traceability
                                 │
                                 ↓
                          QR Honey Passport
                                 │
                                 ↓
                              Consumer
```

---

# 🔄 Complete Data Flow

```text
ESP32 + Sensors
       │
       ↓
Hive Telemetry
       │
       ↓
FastAPI Backend
       │
       ↓
PostgreSQL / Supabase
       │
       ↓
Honey Batch Creation
       │
       ↓
Supply Chain Events
       │
       ↓
Cryptographic Proof
       │
       ↓
Ethereum Sepolia
       │
       ↓
Blockchain Verification
       │
       ↓
QR Code
       │
       ↓
Consumer Honey Passport
```

---

# 🧩 Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide Icons
- QR Code generation

## Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- PostgreSQL
- Supabase
- Uvicorn

## Blockchain

- Solidity
- Ethereum
- Ethereum Sepolia
- Hardhat
- Web3.py
- Ethers.js
- OpenZeppelin

## IoT

- ESP32
- DHT22 / AM2302
- HX711
- 10 kg Load Cell
- INMP441 MEMS microphone
- GPS module

---

# 📂 Project Structure

```text
Honey-Chain/
│
├── backend/
│   └── app/
│       ├── api/
│       ├── core/
│       ├── models/
│       ├── schemas/
│       └── services/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
│
├── blockchain/
│   ├── contracts/
│   ├── scripts/
│   └── test/
│
├── database/
│
├── firmware/
│
└── README.md
```

---

# 🎥 Demo

## Software + Blockchain Demo

The software demonstration covers:

```text
Dashboard
   ↓
Hive Monitoring
   ↓
Honey Batch
   ↓
Supply Chain
   ↓
Blockchain Proof
   ↓
QR Code
   ↓
Honey Passport
   ↓
Multilingual Interface
```

> 📌 Add the final project demonstration video here.

```text
[🎥 HoneyChain Demo Video]
```

---

# 🐝 Hardware Demonstration

The physical IoT hardware demonstration is presented separately.

The hardware layer includes:

```text
ESP32
 │
 ├── DHT22
 │
 ├── HX711 + Load Cell
 │
 ├── INMP441
 │
 └── GPS
```

The hardware demo focuses on the physical sensing and telemetry generation.

The software demo focuses on how that telemetry becomes part of the HoneyChain traceability system.

---

# 📸 Product Screenshots

## Landing Page

![Landing Page](screenshots/landing.png)

---

## Dashboard

![Dashboard](screenshots/dashboard.png)

---

## Hive Monitoring

![Hive Monitoring](screenshots/hive-monitoring.png)

---

## Honey Batches

![Honey Batches](screenshots/batches.png)

---

## Supply Chain

![Supply Chain](screenshots/supply-chain.png)

---

## Blockchain Verification

![Blockchain](screenshots/blockchain.png)

---

## Honey Passport

![Honey Passport](screenshots/honey-passport.png)

---

## Multilingual Interface

![Multilingual](screenshots/multilingual.png)

---

# 🧪 Current Demonstration Data

The current demonstration environment includes a connected hive with telemetry such as:

```text
Hive
HIVE-001

Device
ESP32-HC-001

Temperature
34.0 °C

Humidity
68.5 %

Hive Weight
7.4 kg

Acoustic Activity
34.0

GPS
23.520400, 87.311900
```

> These values are demonstration telemetry from the current development environment and are not intended to represent calibrated production measurements.

---

# ⛓️ Blockchain Deployment

HoneyChain's smart contract is deployed on:

```text
Ethereum Sepolia Test Network
```

Contract:

```text
0x894C573ff2EccF881CE9db7074e4C7E096889401
```

A successful transaction has also been verified on Sepolia.

> Add your Etherscan contract/transaction link here.

---

# ⚙️ Running Locally

## 1. Clone the repository

```bash
git clone https://github.com/sajal-pakira/Honey-Chain.git
cd Honey-Chain
```

---

## 2. Backend

```powershell
cd backend
..\venv\Scripts\activate
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## 4. Blockchain

The blockchain project is located in:

```text
blockchain/
```

The project uses Hardhat for smart-contract development and deployment.

---

# 🔐 Environment Variables

Sensitive credentials should never be committed to GitHub.

Create the appropriate `.env` files locally using the provided examples.

Example:

```text
.env.example
```

Do not commit:

```text
.env
.env.local
private keys
database passwords
API secrets
wallet credentials
```

---

# 🛡️ Security Design

HoneyChain separates the responsibilities of the application database and blockchain layer.

### Database

Used for:

- Users
- Apiaries
- Hives
- Sensor readings
- Honey batches
- Supply-chain events

### Blockchain

Used for:

- Batch registration
- Cryptographic integrity
- Blockchain verification

This keeps high-volume operational data off-chain while using blockchain where immutability and independent verification provide the most value.

---

# 🌍 Why HoneyChain?

HoneyChain combines several technologies into one traceability platform:

```text
IoT
+
Cloud Database
+
REST APIs
+
Supply Chain
+
Blockchain
+
QR Verification
+
Multilingual UX
```

Instead of treating these as separate systems, HoneyChain connects them into one continuous product journey.

---

# 🏆 Hackathon Demo Highlights

The key demonstration points are:

### 01 — IoT

Real hive telemetry enters the system.

### 02 — Digital Identity

A hive is associated with a unique honey batch.

### 03 — Traceability

The batch is tracked through the supply chain.

### 04 — Blockchain

A cryptographic proof is registered on Ethereum Sepolia.

### 05 — Verification

The blockchain record can be independently verified.

### 06 — Consumer Access

A QR code opens the Honey Passport.

### 07 — Accessibility

The platform supports English, Bengali and Hindi.

---

# 🔮 Future Scope

Potential future improvements include:

- Secure beekeeper registration and authentication
- IoT device provisioning and pairing
- Automated device authentication
- Large-scale multi-apiary management
- Advanced hive health analytics
- Automated anomaly detection
- Production blockchain deployment
- On-chain supply-chain event anchoring
- Mobile application
- Advanced consumer analytics
- Production cloud deployment
- Hardware fleet management

---

# 👥 Team

### HoneyChain

**Project:** HoneyChain  
**Domain:** IoT + Blockchain + Supply Chain Traceability

Built for demonstrating how physical honey production data can be connected to a verifiable digital supply chain.

---

# 📜 License

Add the project's license here.

---

<p align="center">

### 🍯 HoneyChain

**From hive to blockchain.**

</p>
```

## One change I'd make before you commit this README

Create this folder:

```text
Honey-Chain/
└── screenshots/
```

Then put your screenshots inside it with names matching the README:

```text
screenshots/
├── landing.png
├── dashboard.png
├── hive-monitoring.png
├── honey-batch.png
├── batches.png
├── supply-chain.png
├── blockchain.png
├── blockchain-verification.png
├── qr-code.png
├── honey-passport.png
├── language-english.png
├── language-bengali.png
├── language-hindi.png
├── multilingual.png
└── gps-origin.png
```

**Don't try to fill all of them.** For the final GitHub repo, I'd prioritize about **8 screenshots**:

1. Landing
2. Dashboard
3. Hive monitoring
4. Batch
5. Supply chain
6. Blockchain verification
7. Honey Passport
8. Bengali/Hindi multilingual view

That will make the repository look like a **finished product**, rather than a collection of source code.

And importantly, the README explicitly separates your **hardware demonstration** from the **software + blockchain demonstration**, which matches how you're presenting the project in the video.
