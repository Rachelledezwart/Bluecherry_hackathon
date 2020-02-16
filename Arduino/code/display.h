#include "SSD1306Wire.h"

void dinit();
void dclear();
void ddrawLogBuffer();
void dblit();
void dprintln(const char* line);
void dprintln(char* line);
void dprint(const char* line);
void dprint(char* line);
void dsetPixelColor(int x, int y, OLEDDISPLAY_COLOR color);
void dsetContrast(int contrast);
void dflipScreenVertically();
void dsetLogBuffer(int lines, int width);
void drawBitmap(const unsigned char* bitmap, int _x, int _y);
void drawBitmap(const unsigned char* bitmap, int _x, int _y, int width, int height);
