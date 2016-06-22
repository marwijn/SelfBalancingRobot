

void textMessageReceived(char* data, int length)
{
  
}

void binaryMessageReceived(char* data, int length)
{
  setSpeed((signed char)data[0], (signed char) data[1]);
}

