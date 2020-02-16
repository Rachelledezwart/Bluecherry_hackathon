// Include libraries
#include <Wire.h>
#include "SSD1306Wire.h"
#include <MPU6050_tockn.h>
#include <WiFi.h>
#include <PubSubClient.h>

// Define piezobuzzer constants
#define PIEZO_CHANNEL 0
#define MAX_PIEZO_FREQUENCY 2000
#define PIEZO_RESOLUTION 8
#define PIEZO_PIN 27

#define silencePiezo() ledcWriteTone(PIEZO_CHANNEL, 0)
#define dclear() display.clear()
#define ddrawLogBuffer() display.drawLogBuffer(0, 0)
#define dblit() display.display()

// Define MQTT constants
#define MQTT_SERIAL_PUBLISH_CH "hz/bluecherry/backstory"
#define MQTT_SERIAL_RECEIVER_CH "hz/bluecherry/backstory-rec"
#define MQTT_CLIENT_ID "deboiiiii"
#define MQTT_SERVER "192.168.1.29"
#define MQTT_PORT 1883

// Bitmap constants
#define BITMAP_WIDTH 16
#define BITMAP_HEIGHT 20

// Wifi credentials
const char* ssid     = "Schuur De Vier Ambachten";
const char* password = "gratiswifi";

// Traffic target
const char* host = "192.168.1.29";
const int httpPort = 80;

// Initialize display on address 0x3c, SDA==25 and SCL == 26
SSD1306Wire display(0x3c, 25, 26);
MPU6050 mpu6050(Wire);
int lives=0;
int score=0;

// Letters
static const unsigned char PROGMEM letter_s[] =
{
    B00000000, B00000000,
    B00000011, B11000000,
    B00001111, B11110000,
    B00011100, B00111000,
    B00111000, B00011000,
    B00110000, B00000000,
    B00110000, B00000000,
    B00111000, B00000000,
    B00011100, B00000000,
    B00000111, B10000000,
    B00000001, B11100000,
    B00000000, B00111000,
    B00000000, B00011100,
    B00000000, B00001100,
    B00000000, B00001100,
    B00011000, B00011100,
    B00011100, B00111000,
    B00001111, B11110000,
    B00000011, B11000000,
    B00000000, B00000000
};

static const unsigned char PROGMEM letter_l[] =
{
    B00000000, B00000000,
    B00000000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011000, B00000000,
    B00011111, B11111000,
    B00011111, B11111000,
    B00000000, B00000000,
    B00000000, B00000000
};

static const unsigned char PROGMEM letter_colon[] =
{
    B00000000, B00000000,
    B00000000, B00000000,
    B00000000, B00000000,
    B00000011, B10000000,
    B00000011, B10000000,
    B00000011, B10000000,
    B00000000, B00000000,
    B00000000, B00000000,
    B00000000, B00000000,
    B00000000, B00000000,
    B00000000, B00000000,
    B00000000, B00000000,
    B00000000, B00000000,
    B00000000, B00000000,
    B00000011, B10000000,
    B00000011, B10000000,
    B00000011, B10000000,
    B00000000, B00000000,
    B00000000, B00000000,
    B00000000, B00000000
};

// Numbers
static const unsigned char PROGMEM number_0[] =
{
  0x1f, 0xf8,
  0x10, 0x08,
  0x72, 0x4e,
  0xc0, 0x03,
  0x87, 0xe1,
  0xac, 0x35,
  0x88, 0x11,
  0x88, 0x11,
  0xa8, 0x15,
  0x88, 0x11,
  0x88, 0x11,
  0xa8, 0x15,
  0x88, 0x11,
  0x88, 0x11,
  0xac, 0x35,
  0x87, 0xe1,
  0xc0, 0x03,
  0x72, 0x4e,
  0x10, 0x08,
  0x1f, 0xf8
};
static const unsigned char PROGMEM number_1[] =
{
  0x0f, 0xf8,
  0x10, 0x08,
  0x24, 0x88,
  0x40, 0x08,
  0x93, 0x08,
  0x45, 0x48,
  0x29, 0x08,
  0x11, 0x08,
  0x01, 0x48,
  0x01, 0x08,
  0x01, 0x08,
  0x01, 0x48,
  0x01, 0x08,
  0x01, 0x08,
  0x01, 0x48,
  0x1f, 0x0f,
  0x10, 0x01,
  0x12, 0x49,
  0x10, 0x01,
  0x1f, 0xff
};
static const unsigned char PROGMEM number_2[] =
{
  0x0f, 0xe0,
  0x10, 0x10,
  0x21, 0x08,
  0x50, 0x04,
  0x83, 0xa2,
  0x44, 0x81,
  0x29, 0x81,
  0x12, 0x09,
  0x04, 0x01,
  0x08, 0x41,
  0x10, 0x06,
  0x22, 0x18,
  0x40, 0x60,
  0x80, 0x80,
  0x89, 0x00,
  0x83, 0xff,
  0x80, 0x01,
  0x88, 0x89,
  0x80, 0x01,
  0xff, 0xff
};
static const unsigned char PROGMEM number_3[] =
{
  0x1f, 0xe0,
  0x20, 0x10,
  0x49, 0x08,
  0x80, 0x24,
  0xa3, 0x82,
  0x84, 0x49,
  0x88, 0x21,
  0xf0, 0x41,
  0x00, 0x92,
  0x01, 0x04,
  0x01, 0x48,
  0x01, 0x04,
  0xf8, 0x92,
  0x88, 0x41,
  0xa8, 0x25,
  0x84, 0x41,
  0x83, 0x92,
  0x48, 0x04,
  0x30, 0x08,
  0x1f, 0xf0
};
static const unsigned char PROGMEM number_4[] =
{
  0xfc, 0x3f,
  0x84, 0x21,
  0xa4, 0x25,
  0x84, 0x21,
  0x84, 0x21,
  0x84, 0x21,
  0xa7, 0xe5,
  0x80, 0x01,
  0x80, 0x01,
  0xa2, 0x21,
  0x80, 0x01,
  0xff, 0xe1,
  0x00, 0x25,
  0x00, 0x21,
  0x00, 0x21,
  0x00, 0x21,
  0x00, 0x21,
  0x00, 0x25,
  0x00, 0x21,
  0x00, 0x3f
};
static const unsigned char PROGMEM number_5[] =
{
  0xff, 0xff,
  0x80, 0x01,
  0x88, 0x89,
  0x80, 0x01,
  0x87, 0xff,
  0xa4, 0x00,
  0x87, 0xf0,
  0x80, 0x08,
  0x82, 0x04,
  0x80, 0x12,
  0xff, 0xc1,
  0x00, 0x21,
  0x00, 0x15,
  0xf8, 0x11,
  0x88, 0x21,
  0x87, 0xc5,
  0x90, 0x01,
  0x81, 0x11,
  0x40, 0x02,
  0x3f, 0xfc
};
static const unsigned char PROGMEM number_6[] =
{
  0x1f, 0xf8,
  0x20, 0x04,
  0x44, 0x42,
  0x80, 0x09,
  0x87, 0xe1,
  0x88, 0x11,
  0xa8, 0x0f,
  0x88, 0x00,
  0x8b, 0xf0,
  0xac, 0x08,
  0x89, 0x24,
  0x80, 0x02,
  0xa1, 0xc1,
  0x82, 0x29,
  0x82, 0x21,
  0x91, 0xc1,
  0x80, 0x09,
  0x44, 0x42,
  0x20, 0x04,
  0x1f, 0xf8
};
static const unsigned char PROGMEM number_7[] =
{
  0xff, 0xff,
  0x80, 0x01,
  0x91, 0x09,
  0x80, 0x01,
  0x80, 0x01,
  0xff, 0xe1,
  0x00, 0x25,
  0x00, 0x41,
  0x00, 0x81,
  0x01, 0x12,
  0x02, 0x04,
  0x04, 0x88,
  0x08, 0x10,
  0x10, 0x20,
  0x24, 0x40,
  0x40, 0x80,
  0x41, 0x00,
  0x4a, 0x00,
  0x42, 0x00,
  0x7e, 0x00
};
static const unsigned char PROGMEM number_8[] =
{
  0x1f, 0xf8,
  0x20, 0x04,
  0x42, 0x22,
  0x80, 0x01,
  0x93, 0xc5,
  0x84, 0x21,
  0x84, 0x21,
  0xa4, 0x25,
  0x83, 0xc1,
  0x40, 0x02,
  0x28, 0x94,
  0x20, 0x04,
  0x40, 0x02,
  0x93, 0xc9,
  0x84, 0x21,
  0x84, 0x21,
  0x93, 0xc9,
  0x40, 0x02,
  0x20, 0x04,
  0x1f, 0xf8
};
static const unsigned char PROGMEM number_9[] =
{
  0x1f, 0xf8,
  0x20, 0x04,
  0x42, 0x22,
  0x80, 0x01,
  0x97, 0xe1,
  0x84, 0x21,
  0x84, 0x25,
  0x97, 0xe1,
  0x80, 0x01,
  0x81, 0x09,
  0x40, 0x01,
  0x3f, 0xf1,
  0x00, 0x11,
  0xf8, 0x15,
  0x84, 0x21,
  0x93, 0xc1,
  0x40, 0x12,
  0x24, 0x84,
  0x10, 0x08,
  0x0f, 0xf0
};

// Bootiful images
static const unsigned char PROGMEM image_death[] =
{
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x01, 0xe0, 0x41, 0x9b, 0x8c, 0x82, 0xee, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0xa1, 0x6a, 0x12, 0xc6, 0x89, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x02, 0x71, 0x11, 0x0b, 0x92, 0x6c, 0xee, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x03, 0xf0, 0x01, 0x23, 0xf9, 0x0a, 0x12, 0x38, 0x89, 0x00, 0x0f, 0xc0, 0x00, 0x00,
  0x00, 0x00, 0x7f, 0xff, 0x00, 0xc4, 0x05, 0x0b, 0x8c, 0x10, 0xe9, 0x00, 0xff, 0xfe, 0x00, 0x00,
  0x00, 0x00, 0xff, 0x3f, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0xfc, 0x7f, 0x00, 0x00,
  0x00, 0x07, 0xe0, 0x03, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0f, 0xc0, 0x07, 0xe0, 0x00,
  0x00, 0x0f, 0xc0, 0x00, 0x7c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1e, 0x00, 0x03, 0xf0, 0x00,
  0x00, 0x1e, 0x00, 0x00, 0x1e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x38, 0x00, 0x00, 0x78, 0x00,
  0x00, 0x3c, 0x00, 0x00, 0x0e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x70, 0x00, 0x00, 0x1c, 0x00,
  0x00, 0x70, 0xfe, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x60, 0x00, 0xfe, 0x1e, 0x00,
  0x00, 0x73, 0xff, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe0, 0x00, 0xff, 0x8e, 0x00,
  0x00, 0xe3, 0xff, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe0, 0x01, 0xff, 0x87, 0x00,
  0x00, 0xe3, 0xff, 0x80, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc0, 0x01, 0xff, 0x87, 0x00,
  0x00, 0xc3, 0xff, 0x81, 0xc3, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc3, 0x81, 0xff, 0x83, 0x00,
  0x00, 0xc3, 0xff, 0x87, 0xe3, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc3, 0xe1, 0xff, 0x83, 0x00,
  0x00, 0xc3, 0xff, 0x87, 0xe3, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc3, 0xe1, 0xff, 0x83, 0x00,
  0x00, 0xc3, 0xff, 0x87, 0xe3, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc3, 0xe1, 0xff, 0x83, 0x00,
  0x00, 0xc1, 0xff, 0x07, 0xe3, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc3, 0xe0, 0xff, 0x03, 0x00,
  0x00, 0xc0, 0xfe, 0x03, 0x83, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe0, 0x00, 0x1e, 0x03, 0x00,
  0x00, 0xc0, 0x78, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x60, 0x00, 0x00, 0x07, 0x00,
  0x00, 0xe0, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x70, 0x00, 0x00, 0x0f, 0x00,
  0x00, 0xf8, 0x00, 0x00, 0x0e, 0x34, 0x00, 0x00, 0x00, 0x00, 0x16, 0x38, 0x00, 0x00, 0x3f, 0x00,
  0x00, 0x7c, 0x00, 0x00, 0x3e, 0x1c, 0x00, 0x00, 0x00, 0x00, 0x1c, 0x3e, 0x00, 0x00, 0x7c, 0x00,
  0x0d, 0x1f, 0x80, 0x01, 0xfc, 0x78, 0x00, 0x00, 0x00, 0x00, 0x0f, 0x1f, 0x80, 0x01, 0xf1, 0xe0,
  0x07, 0x0f, 0x80, 0x01, 0xf0, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x09, 0x87, 0x80, 0x01, 0xe0, 0xc0,
  0x0e, 0x07, 0x00, 0x01, 0xe1, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x87, 0x80, 0x00, 0xc0, 0xf0,
  0x13, 0xc6, 0x00, 0x00, 0xf1, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe7, 0x03, 0x00, 0xc7, 0x90,
  0x00, 0x66, 0x18, 0xc0, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x67, 0x87, 0x38, 0xc4, 0x00,
  0x00, 0x67, 0x3c, 0xe1, 0xf6, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x13, 0xff, 0x3f, 0xc4, 0x00,
  0x00, 0x67, 0xfd, 0xff, 0xcc, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1c, 0xff, 0xff, 0xcc, 0x00,
  0x00, 0x33, 0xff, 0xff, 0x1c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x06, 0x3b, 0xf0, 0x38, 0x00,
  0x00, 0x1c, 0x0f, 0x8c, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x80, 0xc0, 0x60, 0x00,
  0x00, 0x04, 0x07, 0x01, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xdf, 0xff, 0x80, 0x00,
  0x00, 0x01, 0xff, 0xfb, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1f, 0xff, 0x80, 0x00,
  0x00, 0x01, 0x0f, 0x1c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0xe0, 0x00, 0x00,
  0x00, 0x00, 0xfe, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0xff, 0x00, 0x00,
  0x00, 0x01, 0xcf, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0xff, 0x00, 0x00,
  0x00, 0x00, 0x7f, 0xa0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x7e, 0x00, 0x00,
  0x00, 0x00, 0xce, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xfd, 0x00, 0x00,
  0x00, 0x01, 0x3d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xba, 0x00, 0x00,
  0x00, 0x00, 0x5d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00,
  0x00, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00
};


// Music
static const unsigned int PROGMEM music_death[] = { 658, 0, 621, 658, 0, 880, 0, 0, 880, 553, 0, 0, 588, 0, 0, 220, 0, 0, 184 };
static const unsigned int PROGMEM music_lifeup[] = { 658, 782, 1316, 1045, 1177, 1575 };

void drawBitmap(const unsigned char* bitmap, int _x, int _y) {
  drawBitmap(bitmap, _x, _y, BITMAP_WIDTH, BITMAP_HEIGHT);
}


void drawBitmap(const unsigned char* bitmap, int _x, int _y, int width, int height) {
    for (int y=0; y<height; y++) {
        for (int x=0; x<width/8; x++) {
          for(int b=0; b<8;b++){
            if((bitmap[(width/8)*y+x]&(0x80>>b))>0)
              display.setPixelColor(b+8*x+_x, y+15+_y, WHITE);
          }
        }
    }
    dblit();
}

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
/*void ddrawPixel(int x, int y, int color) {
    display.setPixel(x, y, color); // TODO: OK EVAN
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
    display.init();
    // Contrast - how bright the screen ought to be
    display.setContrast(255);
    // Clear
    display.clear();
    // Good to set, makes life easier
    display.flipScreenVertically();
    // Create buffer for saving screen contents
    display.setLogBuffer(5, 30);

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

    display.clear();
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
    strcat(buf, String(!digitalRead(0)).c_str()); //fire pressed. Unpressed == HIGH, Pressed == LOW
    psclient.publish(MQTT_SERIAL_PUBLISH_CH,buf);
    delay(100);
}
