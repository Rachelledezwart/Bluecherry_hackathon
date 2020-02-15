#define PIEZO_CHANNEL 0
#define PIEZO_FREQUENCY 8
#define PIEZO_PIN 27
#include <Wire.h>
#include "SSD1306Wire.h"
#include <WiFi.h>
const char* ssid     = "Schuur De Vier Ambachten";
const char* password = "gratiswifi";
const int httpPort = 80;
const char* host = "192.168.1.29";

SSD1306Wire display(0x3c,25,26);

void pinautomaatboi(){
  for (int i=0; i<3; i++) {
        ledcWriteTone(PIEZO_CHANNEL, 1000);
        delay(90);
        ledcWriteTone(PIEZO_CHANNEL, 0);
        delay(40);
    }
}


void setup() {
    ledcSetup(PIEZO_CHANNEL, 2000, PIEZO_FREQUENCY);
    ledcAttachPin(PIEZO_PIN, 0);
    Serial.begin(9600);
    display.init();
    display.setContrast(255);
    display.clear();
    display.flipScreenVertically();
    display.setLogBuffer(5, 30);
    display.println("[OK]");
    display.display();
    
    display.print("Connecting to WiFi");
    display.drawLogBuffer(0, 0);
    display.display();

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        display.print(".");
        display.drawLogBuffer(0, 0);
        display.display();
    }

    display.println("[OK]");
    display.drawLogBuffer(0, 0);
    display.display();

    WiFiClient client;
    String url = "/";
    if (!client.connect(host, httpPort)) {
        Serial.println("connection failed");
        return;
    }
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: close\r\n\r\n");
    
    //pinautomaatboi();
}



void loop() {
  
  }
