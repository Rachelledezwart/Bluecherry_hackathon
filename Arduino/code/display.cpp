#include "SSD1306Wire.h"

// Bitmap constants
#define BITMAP_WIDTH 16
#define BITMAP_HEIGHT 20

// Initialize display on address 0x3c, SDA==25 and SCL == 26
SSD1306Wire display(0x3c, 25, 26);

void dinit() {
  display.init();
}
void dclear() {
  display.clear();
}
void ddrawLogBuffer() {
  display.drawLogBuffer(0, 0);
}
void dblit() {
  display.display();
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
void dsetPixelColor(int x, int y, OLEDDISPLAY_COLOR color) {
    display.setPixelColor(x, y, color);
}
void dsetContrast(int contrast) {
  display.setContrast(contrast);
}
void dflipScreenVertically() {
  display.flipScreenVertically();
}
void dsetLogBuffer(int lines, int width) {
  display.setLogBuffer(lines, width);
}
void drawBitmap(const unsigned char* bitmap, int _x, int _y, int width, int height) {
    for (int y=0; y<height; y++) {
        for (int x=0; x<width/8; x++) {
          for(int b=0; b<8;b++){
            if((bitmap[(width/8)*y+x]&(0x80>>b))>0)
              dsetPixelColor(b+8*x+_x, y+15+_y, WHITE);
          }
        }
    }
    dblit();
}
void drawBitmap(const unsigned char* bitmap, int _x, int _y) {
  drawBitmap(bitmap, _x, _y, BITMAP_WIDTH, BITMAP_HEIGHT);
}
