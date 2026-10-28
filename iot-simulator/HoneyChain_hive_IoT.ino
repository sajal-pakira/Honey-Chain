#include <WiFi.h>
#include <WebServer.h>
#include <Update.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <DHT.h>
#include <HX711.h>
#include <driver/i2s.h>
#include "arduinoFFT.h"
#include <time.h>

const char* ssid = "PRIYANSHU";
const char* password = "Priyanshu@1988";

WebServer server(80);

// ==================== PIN CONFIGURATIONS ====================
#define DHTPIN 18
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

const int LOADCELL_DOUT_PIN = 4;
const int LOADCELL_SCK_PIN = 16;
HX711 scale;

const int GPS_RX_PIN = 33; 
const int GPS_TX_PIN = 32;
TinyGPSPlus gps;
HardwareSerial gpsSerial(1); 

#define I2S_SCK 2
#define I2S_WS  15
#define I2S_SD  17
#define I2S_PORT I2S_NUM_0

#define SAMPLE_RATE 16000
const uint16_t samples = 2048; 
double vReal[samples];
double vImag[samples];
int32_t sBuffer[samples];
const int32_t MIN_VOLUME = 150000; 
const double FREQ_MULTIPLIER = 1.5; 

ArduinoFFT<double> FFT = ArduinoFFT<double>(vReal, vImag, samples, SAMPLE_RATE);

float latest_weight = 0.0;
double latest_scaled_freq = 0.0;
float latest_temp = 0.0;
float latest_hum = 0.0;

// ==================== WEB DASHBOARD HTML ====================
const char* dashboardHtml = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>HoneyChain IoT - Command Center</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      background-color: #121212;
      color: #e0e0e0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-align: center;
      margin: 0;
      padding: 20px;
    }
    h1 { color: #ff9800; margin-bottom: 5px; }
    .subtitle { color: #888; margin-bottom: 30px; font-size: 14px; }
    
    .grid-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto 30px auto;
    }
    .card {
      background: #1e1e1e;
      border: 1px solid #333;
      border-top: 4px solid #ff9800;
      border-radius: 12px;
      padding: 20px;
      width: 220px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }
    .card h3 { color: #ffb74d; margin-top: 0; font-size: 15px; }
    .value { font-size: 22px; font-weight: bold; color: #fff; margin-top: 10px; }
    
    .charts-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      max-width: 1000px;
      margin: 0 auto 30px auto;
    }
    .chart-container {
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 20px;
      width: 440px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }
    
    .ota-container {
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
    }
    input[type="file"] { color: #bbb; margin-bottom: 10px; }
    input[type="submit"] {
      background-color: #ff9800;
      color: #121212;
      font-weight: bold;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }
    input[type="submit"]:hover { background-color: #ffa726; }
  </style>
</head>
<body>

  <h1>HoneyChain IoT</h1>
  <div class="subtitle">Advanced Apiculture Telemetry Hub</div>

  <div class="grid-container">
    <div class="card">
      <h3>Load / Weight</h3>
      <div class="value" id="weight">-- g</div>
    </div>
    <div class="card">
      <h3>Microphone Pitch</h3>
      <div class="value" id="mic">-- Hz</div>
    </div>
    <div class="card">
      <h3>Temperature</h3>
      <div class="value" id="temp">-- &deg;C</div>
    </div>
    <div class="card">
      <h3>Humidity</h3>
      <div class="value" id="hum">-- %</div>
    </div>
    <div class="card">
      <h3>GPS Location</h3>
      <div class="value" id="gps" style="font-size: 13px;">Searching...</div>
    </div>
    <div class="card">
      <h3>Satellites</h3>
      <div class="value" id="sat">0</div>
    </div>
  </div>

  <div class="charts-wrapper">
    <div class="chart-container">
      <h3 style="color: #ffb74d; margin-top:0;">Load / Weight Trend</h3>
      <canvas id="weightChart" width="400" height="220"></canvas>
    </div>
    <div class="chart-container">
      <h3 style="color: #ffb74d; margin-top:0;">Microphone Pitch Trend</h3>
      <canvas id="micChart" width="400" height="220"></canvas>
    </div>
  </div>

  <div class="ota-container">
    <h3 style="color: #ffb74d; margin-top:0;">Wireless Firmware Update (WebOTA)</h3>
    <form method='POST' action='/update' enctype='multipart/form-data'>
      <input type='file' name='update'><br>
      <input type='submit' value='Upload & Update'>
    </form>
  </div>

  <script>
    const weightCtx = document.getElementById('weightChart').getContext('2d');
    const weightChart = new Chart(weightCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Weight (g)',
          borderColor: '#ff9800',
          backgroundColor: 'transparent',
          data: [],
          borderWidth: 2.5,
          tension: 0, // Makes steady flat lines crisp and solid
          fill: false // Removes area fill under the line
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { grid: { color: '#222' }, ticks: { color: '#888' } },
          y: { 
            grid: { color: '#222' }, 
            ticks: { color: '#888' },
            beginAtZero: true,
            grace: '10%' // Adds clean spacing padding at the top/bottom of Y-axis
          }
        },
        plugins: { legend: { labels: { color: '#ccc' } } }
      }
    });

    const micCtx = document.getElementById('micChart').getContext('2d');
    const micChart = new Chart(micCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Pitch (Hz)',
          borderColor: '#00e676',
          backgroundColor: 'rgba(0, 230, 118, 0.05)',
          data: [],
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { grid: { color: '#222' }, ticks: { color: '#888' } },
          y: { grid: { color: '#222' }, ticks: { color: '#888' }, beginAtZero: true }
        },
        plugins: { legend: { labels: { color: '#ccc' } } }
      }
    });

    setInterval(async () => {
      try {
        let response = await fetch('/data');
        let data = await response.json();

        document.getElementById('weight').innerText = data.weight + " g";
        document.getElementById('mic').innerText = data.mic + " Hz";
        document.getElementById('temp').innerText = data.temp + " °C";
        document.getElementById('hum').innerText = data.hum + " %";
        document.getElementById('sat').innerText = data.sat;
        
        if(data.lat !== 0 && data.lng !== 0) {
          document.getElementById('gps').innerText = data.lat.toFixed(4) + ", " + data.lng.toFixed(4);
        } else {
          document.getElementById('gps').innerText = "22.9534° N, 88.3759° E";
        }

        let timeStr = new Date().toLocaleTimeString();
        
        if (weightChart.data.labels.length > 15) {
          weightChart.data.labels.shift();
          weightChart.data.datasets[0].data.shift();
        }
        weightChart.data.labels.push(timeStr);
        weightChart.data.datasets[0].data.push(data.weight);
        weightChart.update();

        if (micChart.data.labels.length > 15) {
          micChart.data.labels.shift();
          micChart.data.datasets[0].data.shift();
        }
        micChart.data.labels.push(timeStr);
        micChart.data.datasets[0].data.push(data.mic);
        micChart.update();

      } catch (err) {
        console.error("Fetch error:", err);
      }
    }, 2000);
  </script>

</body>
</html>
)rawliteral";

void i2s_init() {
  i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_I2S),
    .intr_alloc_flags = 0,
    .dma_buf_count = 4,
    .dma_buf_len = 512,
    .use_apll = false
  };

  i2s_pin_config_t pin_config = {
    .bck_io_num = I2S_SCK,
    .ws_io_num = I2S_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = I2S_SD
  };

  i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pin_config);
  i2s_zero_dma_buffer(I2S_PORT);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n==========================================");
  Serial.println("  HoneyChain IoT - Starting Initialization");
  Serial.println("==========================================");

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi SSID: ");
  Serial.println(ssid);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    attempts++;
    if (attempts > 40) {
      Serial.println("\n[ERROR] Failed to connect to Wi-Fi. Please check SSID and Password!");
      break;
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[SUCCESS] ESP32 Connected to Network!");
    Serial.print("Local IP Address: http://");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("[WARNING] Continuing without active Wi-Fi connection...");
  }
  Serial.println("==========================================\n");

  Serial.println("Initializing Sensors & Peripherals...");
  dht.begin();
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(-217.0); 
  scale.tare();

  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  i2s_init();

  configTime(19800, 0, "pool.ntp.org", "time.nist.gov");
  
  server.on("/", HTTP_GET, []() {
    server.send(200, "text/html", dashboardHtml);
  });

  server.on("/data", HTTP_GET, []() {
    String json = "{";
    json += "\"weight\":" + String(latest_weight, 1) + ",";
    json += "\"mic\":" + String(latest_scaled_freq, 1) + ",";
    json += "\"temp\":" + String(latest_temp, 1) + ",";
    json += "\"hum\":" + String(latest_hum, 1) + ",";
    json += "\"lat\":" + String(gps.location.isValid() ? gps.location.lat() : 22.9534, 6) + ",";
    json += "\"lng\":" + String(gps.location.isValid() ? gps.location.lng() : 88.3759, 6) + ",";
    json += "\"sat\":" + String(gps.satellites.value());
    json += "}";

    server.send(200, "application/json", json);
  });

  server.on("/update", HTTP_POST, []() {
    server.sendHeader("Connection", "close");
    server.send(200, "text/html", Update.hasError() ? "UPDATE FAILED" : "UPDATE SUCCESS! Rebooting...");
    ESP.restart();
  }, []() {
    HTTPUpload& upload = server.upload();
    if (upload.status == UPLOAD_FILE_START) {
      if (!Update.begin(UPDATE_SIZE_UNKNOWN)) Update.printError(Serial);
    } else if (upload.status == UPLOAD_FILE_WRITE) {
      Update.write(upload.buf, upload.currentSize);
    } else if (upload.status == UPLOAD_FILE_END) {
      Update.end(true);
    }
  });

  server.begin();
  Serial.println("Web server started successfully!");
}

void loop() {
  server.handleClient();

  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  latest_temp = dht.readTemperature();
  latest_hum = dht.readHumidity();
  if (isnan(latest_temp)) latest_temp = 0.0;
  if (isnan(latest_hum)) latest_hum = 0.0;

  latest_weight = scale.is_ready() ? scale.get_units(5) : 0.0;
  if (latest_weight < 0) latest_weight = 0.0;

  size_t total_bytes_read = 0;
  while (total_bytes_read < sizeof(sBuffer)) {
    size_t chunk_read = 0;
    i2s_read(I2S_PORT, ((uint8_t*)sBuffer) + total_bytes_read, sizeof(sBuffer) - total_bytes_read, &chunk_read, portMAX_DELAY);
    total_bytes_read += chunk_read;
  }
  
  int32_t peak_amplitude = 0;
  for (int i = 0; i < samples; i++) {
    int32_t raw_sample = sBuffer[i] >> 8; 
    vReal[i] = (double)raw_sample; 
    vImag[i] = 0.0;                       
    if (abs(raw_sample) > peak_amplitude) {
      peak_amplitude = abs(raw_sample);
    }
  }

  if (peak_amplitude >= MIN_VOLUME) {
    FFT.windowing(FFTWindow::Hamming, FFTDirection::Forward); 
    FFT.compute(FFTDirection::Forward);                                   
    FFT.complexToMagnitude(); 
    vReal[0] = 0.0;                       

    double raw_peak_frequency = FFT.majorPeak();
    latest_scaled_freq = raw_peak_frequency * FREQ_MULTIPLIER;
  } else {
    latest_scaled_freq = 0.0;
  }

  delay(50); 
}