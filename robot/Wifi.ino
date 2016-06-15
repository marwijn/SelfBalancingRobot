const char* ssid = "Marwijn";
const char* password = "MaMoCoQu";

const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1);
DNSServer dnsServer;

void initWifi()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);


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

