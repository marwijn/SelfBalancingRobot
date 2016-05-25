MPU6050 mpu;

void resetI2C()
{
  digitalWrite(16, LOW);
  pinMode (16, INPUT);
  digitalWrite (14, LOW);
  pinMode (14, OUTPUT);
  while (digitalRead(16) == LOW)
  {
    pinMode(14, OUTPUT);
    digitalWrite(14, LOW);
    yield();
    pinMode(14, INPUT);
    Serial.println("retrying");
  }
  pinMode(16, OUTPUT);
  yield();
  pinMode(16, INPUT);
}

void initWire()
{
  Wire.begin(16, 14);
  Wire.setClock(400000L);

  // On my board SDA is connected to pin 16, which is not supported by the ESP library
  // to fix this I changed in AppData\Local\Arduino15\packages\esp8266\hardware\esp8266\2.2.0\cores\esp8266.core_esp8266_si2c.c :

  //#define SDA_LOW()   (GPES = (1 << twi_sda)) //Enable SDA (becomes output and since GPO is 0 for the pin, it will pull the line low)
  //#define SDA_HIGH()  (GPEC = (1 << twi_sda)) //Disable SDA (becomes input and since it has pullup it will go high)
  //#define SDA_READ()  ((GPI & (1 << twi_sda)) != 0)
  //
  //to:
  //
  //#define SDA_LOW()   (GP16E |= 1)
  //#define SDA_HIGH()  (GP16E &= ~1)
  // #define SDA_READ()  (GP16I & 0x01)
  // and need to following register settings:
  GPF16 = GP16FFS(GPFFS_GPIO(16)); // function GPIO
  GPC16 = 0;  // ?
  GP16E &= ~1; // set to input
  GPF16 &= ~(1 << GP16FPD); // no pull down
  GP16O &= ~1; // set low
}

int  initOrientation()
{
  initWire();

  mpu.setClockSource(MPU6050_CLOCK_PLL_ZGYRO);
  mpu.setFullScaleGyroRange(MPU6050_GYRO_FS_2000);
  mpu.setFullScaleAccelRange(MPU6050_ACCEL_FS_2);
  mpu.setDLPFMode(MPU6050_DLPF_BW_10);  //10,20,42,98,188  // Default factor for BROBOT:10
  mpu.setRate(4);   // 0=1khz 1=500hz, 2=333hz, 3=250hz 4=200hz
  mpu.setSleepEnabled(false);

  delay(1500);
  Serial.println("Initializing DMP...");
  uint8_t devStatus = mpu.dmpInitialize();
  if (devStatus == 0)
  {
    // turn on the DMP, now that it's ready
    Serial.println("Enabling DMP...");
    mpu.setDMPEnabled(true);
  }
  else
  { // ERROR!
    // 1 = initial memory load failed
    // 2 = DMP configuration updates failed
    // (if it's going to break, usually the code will be 1)
    Serial.print("DMP Initialization failed (code ");
    Serial.print(devStatus);
    Serial.println(")");
    ESP.reset();
  }
}


bool dmpGetNewPhi(float* phi)
{
  int fifoCount = mpu.getFIFOCount();
  if (fifoCount > 18)
  {
    mpu.resetFIFO();
    Serial.println("Fifo reset");
    return false;
  }
  if (fifoCount < 18)
  {
    return false;
  }
  uint8_t fifoBuffer[18];
  Quaternion q;
  mpu.getFIFOBytes(fifoBuffer, 18); // We only read the quaternion
  mpu.dmpGetQuaternion(&q, fifoBuffer);
  *phi = (atan2(2 * (q.y * q.z + q.w * q.x), -( q.w * q.w - q.x * q.x - q.y * q.y + q.z * q.z)) * RAD2GRAD);
  return true;
}

