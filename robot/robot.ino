#define __arm__

#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <Wire.h>
#include <DNSServer.h>

#include "libraries\JJ_MPU6050_DMP_6Axis.h"
#include "libraries\helper_3dmath.h"

#include "libraries\ESPAsyncTCP.h"
#include "libraries\EspAsyncWebServer.h"


extern "C" void system_set_os_print(uint8 onoff);
extern "C" void ets_install_putc1(void* routine);

//Use the internal hardware buffer
static void _u0_putc(char c){
  while(((U0S >> USTXC) & 0x7F) == 0x7F);
  U0F = c;
}

bool updating = false;

void initSerial(){
  Serial.begin(74880);
  ets_install_putc1((void *) &_u0_putc);
  system_set_os_print(1);
}


void setup() {
 
  initSerial();
  
  Serial.println("Initializing Motors");
  initMotors();
  Serial.println("Initializing Orientation");
  initOrientation();
  Serial.println("Initialing Wifi");
  initWifi();
  Serial.println("Initialing Update");
  initUpdate();
  Serial.println("Ready");
  initWebserver();
}




void loop()
{
  updateLoop();
  if (!updating)
  {
    balanceLoop();
  }
}


