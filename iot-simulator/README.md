# HoneyChain IoT — ESP32 Smart Apiculture Firmware & Command Center

## Overview

The **HoneyChain IoT** firmware acts as the edge telemetry node for smart beehives (developed for SIH 2026 Problem Statement 26021, Ministry of MSME / KVIC). This module monitors critical colony health indicators, performs real-time audio analysis using Fast Fourier Transform (FFT) for acoustic swarm/health detection, tracks GPS locations, and hosts an embedded web dashboard with Over-The-Air (OTA) firmware updates.

---

## Key Features & Functionality

* **Environmental Monitoring**: Interfaces with a DHT22 sensor to track internal hive temperature and humidity.


* **Precision Weight Tracking**: Utilizes an HX711 load cell amplifier connected to a 10kg load sensor to monitor honey harvest yields and hive health trends.


* **Acoustic Colony Analysis (FFT)**: Captures audio data through an I2S digital microphone interface and processes raw signals via the `arduinoFFT` library to evaluate pitch and frequency changes associated with bee activity.


* **Geolocation Services**: Integrates a NEO-6M GPS module via Hardware Serial to track exact hive deployment coordinates and satellite counts.


* **Embedded Web Dashboard**: Hosts a responsive, dark-themed command center featuring real-time cards and historical trend charts built with Chart.js.


* **WebOTA Updates**: Supports wireless firmware updates directly through the local web interface without requiring physical reconnection.



---

## 🔌 Hardware & Pin Connections

Board: **ESP32 (WROOM-32 dev board)**, powered over USB-C.

| Component | Module Pin | ESP32 Pin | Notes |
|---|---|---|---|
| **DHT22** (temperature & humidity) | VCC | 3V3 | |
| | DATA | GPIO 18 | `DHTPIN` |
| | GND | GND | |
| **HX711** (load cell amplifier) | VCC | 3V3 | 5V also works |
| | DT / DOUT | GPIO 4 | `LOADCELL_DOUT_PIN` |
| | SCK | GPIO 16 | `LOADCELL_SCK_PIN` |
| | GND | GND | |
| **Load cell** (strain gauge) | Red / Black / White / Green | HX711 E+ / E− / A− / A+ | Connects to the HX711, not the ESP32 |
| **GPS module** (NEO-6M) | VCC | 3V3 | 5V also works |
| | TX | GPIO 33 | `GPS_RX_PIN` (GPS TX → ESP32 RX) |
| | RX | GPIO 32 | `GPS_TX_PIN` (GPS RX → ESP32 TX) |
| | GND | GND | |
| **GPS antenna** | u.FL cable | GPS module u.FL socket | No ESP32 pin |
| **I2S microphone** (INMP441) | VDD | 3V3 | |
| | SCK / BCLK | GPIO 2 | `I2S_SCK` |
| | WS / LRCL | GPIO 15 | `I2S_WS` |
| | SD / DOUT | GPIO 17 | `I2S_SD` |
| | L/R | GND | Selects the left channel, as used in code |
| | GND | GND | |

### Notes

- All components share a common **GND**.
- The GPS TX/RX lines are crossed: module TX goes to the ESP32 receive pin, and module RX goes to the ESP32 transmit pin.
- GPIO 2 and GPIO 15 are ESP32 strapping pins. If the board fails to boot or flash with the microphone attached, disconnect the mic's SCK and WS wires, upload, then reconnect them.


---

## Dashboard Interface

The embedded web server serves a responsive control panel that automatically polls `/data` every 2 seconds to update:

1. **Telemetry Cards**: Live values for Weight, Microphone Pitch, Temperature, Humidity, GPS Coordinates, and Satellites.


2. **Trend Graphs**: Real-time line charts tracking **Load / Weight Trend** and **Microphone Pitch Trend**.


3. **WebOTA Portal**: File upload utility allowing seamless firmware flashing over Wi-Fi.



---

## Getting Started

1. **Prerequisites**: Install the Arduino IDE with the ESP32 board package enabled, along with dependencies: `DHT sensor library`, `HX711 Arduino library`, `TinyGPSPlus`, and `arduinoFFT`.
2. **Configuration**: Update the `ssid` and `password` variables in the sketch to match your local network.


3. **Compilation & Flash**: Upload `HoneyChain_ESP32_TEE.ino` to your ESP32 module.


4. **Access Command Center**: Open the Serial Monitor to retrieve the local IP address, then navigate to `http://<ESP32_IP>` in your browser.
