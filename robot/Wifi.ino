const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1);
DNSServer dnsServer;

struct WifiSettings
{
  char ssid [33];
  char password [33];
};

void initWifi()
{
  EEPROM.begin(4095);
  WifiSettings settings;
  EEPROM.get(0, settings);
  settings.ssid[32] = 0;
  settings.password[32] = 0;
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(settings.ssid, settings.password);

  if (WiFi.waitForConnectResult() != WL_CONNECTED)
  {
    WiFi.mode(WIFI_AP);
    WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
    WiFi.softAP("DNSServer CaptivePortal example");

    dnsServer.start(DNS_PORT, "*", apIP);
  }

  if (!MDNS.begin("esp8266"))
  {
    Serial.println("Error setting up MDNS responder!");
  }
  else
  {
    MDNS.addService("http", "tcp", 80);
    Serial.println("mDNS responder started");
  }
}

void setWifiSettings(const char* ssid, const char* password)
{
  if (ssid != NULL && password != NULL && strlen(ssid) < 33 && strlen(password) < 33)
  {
    WifiSettings settings;
    strcpy (settings.ssid, ssid);
    strcpy (settings.password, password);
    EEPROM.put(0, settings);
    EEPROM.commit();
  }
}

