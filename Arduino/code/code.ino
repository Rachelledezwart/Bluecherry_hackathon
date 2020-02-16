// Include libraries
#include <Wire.h>
#include <MPU6050_tockn.h>
#include <WiFi.h>
#include <PubSubClient.h>

#include "bitmaps.h"
#include "display.h"

// Define piezobuzzer constants
#define PIEZO_CHANNEL 0
#define MAX_PIEZO_FREQUENCY 2000
#define PIEZO_RESOLUTION 8
#define PIEZO_PIN 27

#define silencePiezo() ledcWriteTone(PIEZO_CHANNEL, 0)

// Define MQTT constants
#define MQTT_SERIAL_PUBLISH_CH "hz/bluecherry/backstory"
#define MQTT_SERIAL_RECEIVER_CH "hz/bluecherry/backstory-rec"
#define MQTT_CLIENT_ID "deboiiiii"
#define MQTT_SERVER "192.168.1.29"
#define MQTT_PORT 1883

// Wifi credentials
const char* ssid     = "Schuur De Vier Ambachten";
const char* password = "gratiswifi";

// Traffic target
const char* host = "192.168.1.29";
const int httpPort = 80;

MPU6050 mpu6050(Wire);
int lives=0;
int score=0;

// Music
static const unsigned int PROGMEM music_death[] = { 658, 0, 621, 658, 0, 880, 0, 0, 880, 553, 0, 0, 588, 0, 0, 220, 0, 0, 184 };
static const unsigned int PROGMEM music_lifeup[] = { 658, 782, 1316, 1045, 1177, 1575 };

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

/*void ddrawPixel(int x, int y, int color) {
    dsetPixel(x, y, color); // TODO: OK EVAN
}*/

void callback(char* topic, byte *payload, unsigned int length) {
    if (length != 8) return;
    char rScore[5] = "";
    char rLives[4] = "";
    for(int i = 0; i < 4; i++){
        rScore[i] = (char)payload[i];
    }
    for(int i = 0; i < 3; i++){
        rLives[i]= (char)payload[i+5];
    }
    rScore[4] = 0x00;
    rLives[3] = 0x00;
    int newLives = String(rLives).toInt();
    int newScore = String(rScore).toInt();

    if (newLives > lives) {
      // Play gain life
      size_t len = sizeof(music_lifeup)/sizeof(music_lifeup[0]);
      
      for (int i = 0; i < len; i++) {
        ledcWriteTone(PIEZO_CHANNEL, music_lifeup[i]);
        delay(60);
        silencePiezo();
        delay(60);
      }
    } else if (newLives < lives) {
      // Play lose life
      for (int i = 0; i < 4; i++) {
        ledcWriteTone(PIEZO_CHANNEL, 867);
        delay(15);
        silencePiezo();
        delay(15);
      }
      
      if (newLives == 0 && lives > 0) {
        // Play dead
        delay(100);
        lose();
      }
    }

    if (newScore > score) {
      // Play gain score
      ledcWriteTone(PIEZO_CHANNEL, 867);
      delay(50);
      silencePiezo();
      delay(15);
      
      ledcWriteTone(PIEZO_CHANNEL, 1575);
      delay(50);
      silencePiezo();
    }

    lives = newLives;
    score = newScore;
    
    dclear();
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

void lose() {
  dclear();
  dprint("               S ");
  for (int i = String(score).length(); i < 4; i++)
    dprint("0");
  dprintln(String(score).c_str());
  for (int i = 0; i < 4; i++)
    dprintln("");
  drawBitmap(image_death, 0, 0, 128, 44);
  
  size_t len = sizeof(music_death)/sizeof(music_death[0]);
  
  for (int i = 0; i < len; i++) {
    if (music_death[i] == 0) {
      delay(100);
      continue;
    }
    ledcWriteTone(PIEZO_CHANNEL, music_death[i]);
    delay(50);
    silencePiezo();
    delay(50);
  }
  while(digitalRead(0)) {
    if(!psclient.connected()){
      reconnect();
    }
    delay(100);
  }
  psclient.publish(MQTT_SERIAL_PUBLISH_CH, "OwO");
}

void setup() {
    // Init piezo
    setupPiezo();

    // Init serial connection
    Serial.begin(9600);

    // Init display
    dinit();
    // Contrast - how bright the screen ought to be
    dsetContrast(255);
    // Clear
    dclear();
    // Good to set, makes life easier
    dflipScreenVertically();
    // Create buffer for saving screen contents
    dsetLogBuffer(5, 30);

    dprintln("Booting...");

    dprint("Connecting to WiFi");

    mpu6050.begin();
    mpu6050.calcGyroOffsets(true);
    WiFi.begin(ssid, password);

    // Print dots until connected
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        dprint(".");
    }

    dprintln("[OK]");
    psclientSetup();

    //pinBeeps();

    dclear();
}



void loop() {
    int char_offset_x = 2;
    int char_offset_y = 2;
  
    if(!psclient.connected()){
        reconnect();
    }
    psclient.loop();
    drawBitmap(letter_l,char_offset_x,char_offset_y);
    drawBitmap(letter_s,char_offset_x,20 + 2 * char_offset_y);
    drawBitmap(letter_colon, 14, char_offset_y);
    drawBitmap(letter_colon, 14, 20 + 2 * char_offset_y);

    String convLives = String(lives).c_str();
    for(int i=0; i<convLives.length(); i++){
      int index = String(convLives[i]).toInt();
      switch(index){
         case 0: drawBitmap(number_0,28+(16+char_offset_x)*i, char_offset_y); break;
         case 1: drawBitmap(number_1,28+(16+char_offset_x)*i, char_offset_y); break;
         case 2: drawBitmap(number_2,28+(16+char_offset_x)*i, char_offset_y); break;
         case 3: drawBitmap(number_3,28+(16+char_offset_x)*i, char_offset_y); break;
         case 4: drawBitmap(number_4,28+(16+char_offset_x)*i, char_offset_y); break;
         case 5: drawBitmap(number_5,28+(16+char_offset_x)*i, char_offset_y); break;
         case 6: drawBitmap(number_6,28+(16+char_offset_x)*i, char_offset_y); break;
         case 7: drawBitmap(number_7,28+(16+char_offset_x)*i, char_offset_y); break;
         case 8: drawBitmap(number_8,28+(16+char_offset_x)*i, char_offset_y); break;
         case 9: drawBitmap(number_9,28+(16+char_offset_x)*i, char_offset_y); break;
      }
    }
    String convScore = String(score).c_str();
    for(int i=0; i<convScore.length(); i++){
      int index2 = String(convScore[i]).toInt();
      switch(index2){
         case 0: drawBitmap(number_0,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
         case 1: drawBitmap(number_1,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
         case 2: drawBitmap(number_2,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
         case 3: drawBitmap(number_3,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
         case 4: drawBitmap(number_4,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
         case 5: drawBitmap(number_5,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
         case 6: drawBitmap(number_6,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
         case 7: drawBitmap(number_7,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
         case 8: drawBitmap(number_8,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
         case 9: drawBitmap(number_9,28+(16+char_offset_x)*i, 20 + 2 * char_offset_y); break;
      }
    }
    
    mpu6050.update();
    char buf[100];
    String xcomp = String(mpu6050.getGyroX()).c_str();
    String ycomp = String(mpu6050.getGyroY()).c_str();
    strcpy(buf, xcomp.c_str());
    strcat(buf, ",");
    strcat(buf, ycomp.c_str());
    strcat(buf, ",");
    strcat(buf, String(!digitalRead(0)).c_str()); //fire pressed
    psclient.publish(MQTT_SERIAL_PUBLISH_CH,buf);
    delay(100);
}
