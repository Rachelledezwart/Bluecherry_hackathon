#define PIEZO_CHANNEL 0
#define PIEZO_RESOLUTION 8
#define PIEZO_PIN 27

void setup() {
    ledcSetup(PIEZO_CHANNEL, 2000, PIEZO_RESOLUTION);
    ledcAttachPin(PIEZO_PIN, 0);

    for (int i = 0; i < 3; i++) {
        ledcWriteTone(PIEZO_CHANNEL, 1000);
        delay(90);
        ledcWriteTone(PIEZO_CHANNEL, 0);
        delay(40);
    }
}

void loop() {}
