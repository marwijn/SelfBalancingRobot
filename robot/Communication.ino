


void textMessageReceived(char* data, int length)
{
  if (length > 254) return;
  
  char message[255];
  strncpy(message, data, length);
  message[length] = 0;
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(message);
  const char* command = root["command"];
  if (strcmp(command, "setWifiSettings") == 0)
  {
    setWifiSettings(root);
  }
  
}

void binaryMessageReceived(char* data, int length)
{
  setSpeed((signed char)data[0], (signed char) data[1]);
}

void setWifiSettings(JsonObject& json)
{
  const char* ssid = json["ssid"];
  const char* password = json["password"];
  setWifiSettings(ssid, password);
}




