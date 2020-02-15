// Include libraries
#include <Wire.h>
#include "SSD1306Wire.h"
#include <WiFi.h>

// Define piezobuzzer constants
#define PIEZO_CHANNEL 0
#define PIEZO_FREQUENCY 8
#define PIEZO_PIN 27

// Wifi credentials
const char* ssid     = "Schuur De Vier Ambachten";
const char* password = "gratiswifi";

// Traffic target
const char* host = "192.168.1.29";
const int httpPort = 80;

// Inialiseren van display op adres 0x3c, SDA==25 en SCL == 26
SSD1306Wire display(0x3c, 25, 26);

void setupPiezo() {
    ledcSetup(PIEZO_CHANNEL, 2000, PIEZO_FREQUENCY);
    ledcAttachPin(PIEZO_PIN, 0);
}

void pinBeeps() {
    // Beep drie maal
    for (int i=0; i<3; i++) {
        ledcWriteTone(PIEZO_CHANNEL, 1000);
        delay(90);
        ledcWriteTone(PIEZO_CHANNEL, 0);
        delay(40);
    }
}

void dprintln(char* line) {
    display.println(line);
    display.drawLogBuffer(0, 0);
    display.display();
}

void dprint(char* line) {
    display.print(line);
    display.drawLogBuffer(0, 0);
    display.display();
}

void setup() {
    // Opzetten piezo
    setupPiezo();

    // Seriele connectie opzetten
    Serial.begin(9600);

    // Init display
    display.init();
    // Kleurcontrast - hoe fel staat het scherm
    display.setContrast(255);
    // Clear
    display.clear();
    // Goed om zetten
    display.flipScreenVertically();
    // Buffer aanmaken voor tekst contents scherm
    display.setLogBuffer(5, 30);

    dprintln("[ok]");
    
    dprint("Connecting to ");
    dprintln(ssid);

    WiFi.begin(ssid, password);

    // Print dots until connected
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        dprint(".");
    }

    dprintln("");
    dprintln("WiFi connected");

    // TCP Client
    WiFiClient client;

    // Path to connect to
    String url = "/";
    // Connect to host on port
    if (!client.connect(host, httpPort)) {
        dprintln("Connection failed");
        return;
    }
    // Send HTTP packet
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: close\r\n\r\n");
    
    pinBeeps();
}



void loop() {}
