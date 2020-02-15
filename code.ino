// Include libraries
#include <Wire.h>
#include "SSD1306Wire.h"
#include <WiFi.h>
#include <PubSubClient.h>

// Define piezobuzzer constants
#define PIEZO_CHANNEL 0
#define MAX_PIEZO_FREQUENCY 2000
#define PIEZO_RESOLUTION 8
#define PIEZO_PIN 27

#define silencePiezo() ledcWriteTone(PIEZO_CHANNEL, 0)
#define dclear() display.clear()
#define ddrawLogBuffer display.drawLogBuffer(0, 0)
#define dblit display.display()

// Define MQTT constants
#define MQTT_SERIAL_PUBLISH_CH "bluecherry/backstory"
#define MQTT_SERIAL_RECEIVER_CH "bluecherry/backstory-rec"
#define MQTT_CLIENT_ID "deboiiiii"
#define MQTT_SERVER "broker.hivemq.com"
#define MQTT_PORT 1883

// Wifi credentials
const char* ssid     = "Schuur De Vier Ambachten";
const char* password = "gratiswifi";

// Traffic target
const char* host = "192.168.1.29";
const int httpPort = 80;

// Initialize display on address 0x3c, SDA==25 and SCL == 26
SSD1306Wire display(0x3c, 25, 26);

// Initialize TCP client and PubSubClient for MQTT
WiFiClient client;
PubSubClient psclient(client);

// Initalize pieze
void setupPiezo() {
    ledcSetup(PIEZO_CHANNEL, MAX_PIEZO_FREQUENCY, PIEZO_RESOLUTION);
    ledcAttachPin(PIEZO_PIN, 0);
}

void pinBeeps() {
    // Beep thrice
    for (int i = 0; i < 3; i++) {
        ledcWriteTone(PIEZO_CHANNEL, 1000);
        delay(90);
        silencePiezo();
        delay(40);
    }
}

void dprintln(const char* line) {
    dclear();
    display.println(line);
    ddrawLogBuffer();
    dblit();
}
void dprintln(char* line) {
    dclear();
    display.println(line);
    ddrawLogBuffer();
    dblit();
}
void dprint(const char* line) {
    dclear();
    display.print(line);
    ddrawLogBuffer();
    dblit();
}
void dprint(char* line) {
    dclear();
    display.print(line);
    ddrawLogBuffer();
    dblit();
}

void callback(char* topic, byte *payload, unsigned int length) {
    char recv[255] = "";
    for(int i = 0; i < length; i++){
        recv[i] = (char)payload[i];
    }
    dprintln(recv);
}

void reconnect() {
    while(!psclient.connected()) {
        dprint("Connecting MQTT...");
        if(psclient.connect(MQTT_CLIENT_ID)){
            dprintln("[OK]");
            psclient.publish(MQTT_SERIAL_PUBLISH_CH,"OwO");
            psclient.subscribe(MQTT_SERIAL_RECEIVER_CH);
        } else {
            dprintln("[FAIL]");
            delay(5000);
        }
    }
}

void psclientSetup(){
    psclient.setServer(MQTT_SERVER,MQTT_PORT);
    psclient.setCallback(callback);
    reconnect();
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

    dprintln("Booting...");

    dprint("Connecting to WiFi");

    WiFi.begin(ssid, password);

    // Print dots until connected
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        dprint(".");
    }

    dprintln("[OK]");

    // Path to connect to
    String url = "/";
    psclientSetup();

    //pinBeeps();
}



void loop() {
    if(!psclient.connected()){
        reconnect();
    }
    psclient.loop();
    psclient.publish(MQTT_SERIAL_PUBLISH_CH,"OwO");
    delay(500);
}
