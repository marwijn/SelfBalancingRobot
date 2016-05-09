#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <Wire.h>
#include "JJ_MPU6050_DMP_6Axis.h"
#include "helper_3dmath.h"

const int steppersEnablePin = 15;
const int stepperStepPin[] = {0, 5};
const int stepperDirPin[] = {2, 4};

const char* ssid = "Sitecom0E50B3";
const char* password = "4NDSF3V4B4W9";

#define MAX_ACCEL 7

#define RAD2GRAD 57.2957795
#define GRAD2RAD 0.01745329251994329576923690768489

MPU6050 mpu;

volatile unsigned int MotorTime[] = {0, 0};
volatile unsigned int MotorCount[] = {0, 0};
int16_t MotorSpeed[] = {0, 0};


void ICACHE_RAM_ATTR handler (void)
{
  for (int i = 0; i < 2; i++)
  {
    MotorCount[i]++;
    if (MotorCount[i] >= MotorTime[i])
    {
      MotorCount[i] = 0;
      GPOS = (1 << stepperStepPin[i]);
    }

    else
    {
      GPOC = (1 << stepperStepPin[i]);
    }
  }
  timer0_write(ESP.getCycleCount() + 1000);
}


void setMotorSpeed(int motor, int16_t tspeed)
{
  unsigned long timer_period;
  int16_t speed;

  // Limit max speed?

  // WE LIMIT MAX ACCELERATION of the motors
  if ((MotorSpeed[motor] - tspeed) > MAX_ACCEL)
    MotorSpeed[motor] -= MAX_ACCEL;
  else if ((MotorSpeed[motor] - tspeed) < -MAX_ACCEL)
    MotorSpeed[motor] += MAX_ACCEL;
  else
    MotorSpeed[motor] = tspeed;

  speed = MotorSpeed[motor] * 46;

  if (speed == 0)
  {
    timer_period = -1;
  }
  else if (speed > 0)
  {
    timer_period = 160000 / speed; // 160 kHz interrupts
    digitalWrite(stepperDirPin[motor], LOW);
  }
  else
  {
    timer_period = -160000 / speed; // 160 kHz interrupts
    digitalWrite(stepperDirPin[motor], HIGH);
  }
  if (timer_period > 65535)   // Check for minimun speed (maximun period without overflow)
  { timer_period = -1;
  }
  MotorTime[motor] = timer_period;
}


void setup() {

  digitalWrite(steppersEnablePin, HIGH);
  pinMode(steppersEnablePin, OUTPUT);
  for (int i = 0; i < 2; i++)
  {
    pinMode(stepperStepPin[i], OUTPUT);
    pinMode(stepperDirPin[i], OUTPUT);
  }

  Serial.begin(74880);
  Serial.println("starting");

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




  Wire.begin(16, 14);
  GPF16 = GP16FFS(GPFFS_GPIO(16)); // function GPIO
  GPC16 = 0;  // ?
  GP16E &= ~1; // set to input
  GPF16 &= ~(1 << GP16FPD); // no pull down
  GP16O &= ~1; // set low

  mpu.setClockSource(MPU6050_CLOCK_PLL_ZGYRO);
  mpu.setFullScaleGyroRange(MPU6050_GYRO_FS_2000);
  mpu.setFullScaleAccelRange(MPU6050_ACCEL_FS_2);
  mpu.setDLPFMode(MPU6050_DLPF_BW_10);  //10,20,42,98,188  // Default factor for BROBOT:10
  mpu.setRate(4);   // 0=1khz 1=500hz, 2=333hz, 3=250hz 4=200hz
  mpu.setSleepEnabled(false);

  delay(1500);
  Serial.println("Initializing DMP...");
  uint8_t devStatus = mpu.dmpInitialize();
  if (devStatus == 0) {
    // turn on the DMP, now that it's ready
    Serial.println("Enabling DMP...");
    mpu.setDMPEnabled(true);

  }
  else { // ERROR!
    // 1 = initial memory load failed
    // 2 = DMP configuration updates failed
    // (if it's going to break, usually the code will be 1)
    Serial.print("DMP Initialization failed (code ");
    Serial.print(devStatus);
    Serial.println(")");
    ESP.reset();
  }



  Serial.println("Booting");




  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Connection Failed! Rebooting...");
    delay(5000);
    ESP.restart();
  }

  // Port defaults to 8266
  // ArduinoOTA.setPort(8266);

  // Hostname defaults to esp8266-[ChipID]
  // ArduinoOTA.setHostname("myesp8266");
  // No authentication by default
  // ArduinoOTA.setPassword((const char *)"123");

  ArduinoOTA.onStart([]() {
    Serial.println("Start");
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR) Serial.println("End Failed");
  });
  ArduinoOTA.begin();

  Serial.println("Ready");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  noInterrupts();
  timer0_isr_init();
  timer0_attachInterrupt(handler);

  timer0_write(ESP.getCycleCount() + 1000);
  interrupts(); //- See more at: http://www.esp8266.com/viewtopic.php?f=8&t=4865#sthash.yInuRMPB.dpuf
  delay(15000);

}



float dmpGetPhi() {
  static uint8_t fifoBuffer[18];
  static Quaternion q;
  mpu.getFIFOBytes(fifoBuffer, 18); // We only read the quaternion
  mpu.dmpGetQuaternion(&q, fifoBuffer);
  //mpu.resetFIFO();  // We always reset FIFO

  //return( asin(-2*(q.x * q.z - q.w * q.y)) * 180/M_PI); //roll
  //return Phi angle (robot orientation) from quaternion DMP output
  return (atan2(2 * (q.y * q.z + q.w * q.x), -( q.w * q.w - q.x * q.x - q.y * q.y + q.z * q.z)) * RAD2GRAD);
}

#define ITERM_MAX_ERROR 25   // Iterm windup constants for PI control //40
#define ITERM_MAX 8000       // 5000
float PID_errorSum = 0;
// PI controller implementation (Proportional, integral). DT is in miliseconds
float speedPIControl(float DT, float input, float setPoint,  float Kp, float Ki)
{
  float error;
  float output;

  error = setPoint - input;
  PID_errorSum += constrain(error, -ITERM_MAX_ERROR, ITERM_MAX_ERROR);
  PID_errorSum = constrain(PID_errorSum, -ITERM_MAX, ITERM_MAX);

  //Serial.println(PID_errorSum);

  output = Kp * error + Ki * PID_errorSum * DT * 0.001; // DT is in miliseconds...
  return (output);
}

#define KP 0.19
#define KD 28
float PID_errorOld = 0;
float PID_errorOld2 = 0;
float setPointOld = 0;
// PD controller implementation(Proportional, derivative). DT is in miliseconds
float stabilityPDControl(float DT, float input, float setPoint,  float Kp, float Kd)
{
  float error;
  float output;

  error = setPoint - input;

  // Kd is implemented in two parts
  //    The biggest one using only the input (sensor) part not the SetPoint input-input(t-2)
  //    And the second using the setpoint to make it a bit more agressive   setPoint-setPoint(t-1)
  output = Kp * error + (Kd * (setPoint - setPointOld) - Kd * (input - PID_errorOld2)) / DT;
  //Serial.print(Kd*(error-PID_errorOld));Serial.print("\t");
  PID_errorOld2 = PID_errorOld;
  PID_errorOld = input;  // error for Kd is only the input component
  setPointOld = setPoint;
  return (output);
}


int16_t actual_robot_speed = 0;        // overall robot speed (measured from steppers speed)
int16_t actual_robot_speed_Old = 0;
float estimated_speed_filtered = 0;    // Estimated robot speed
// Angle of the robot (used for stability control)
float angle_adjusted = 0;
float angle_adjusted_Old = 0;
float control_output = 0;

#define MAX_CONTROL_OUTPUT 500

#define KP_THROTTLE 0.07    
#define KI_THROTTLE 0.04   
#define KP 0.19         
#define KD 28   

void loop()
{
  ArduinoOTA.handle();
  int fifoCount = mpu.getFIFOCount();
  if (fifoCount > 18)
  {
    mpu.resetFIFO();
    Serial.println("Fifo reset");
  }
  if (fifoCount == 18 )
  {
    angle_adjusted_Old = angle_adjusted;
    // Get new orientation angle from IMU (MPU6050)
    angle_adjusted = dmpGetPhi();
    Serial.println(angle_adjusted);
    if (fabs(angle_adjusted) > 25)
    {
      Serial.println("Robot down");
      setMotorSpeed(0, 0);
      setMotorSpeed(1, 0);
      digitalWrite(steppersEnablePin, HIGH);
      PID_errorOld = 0;
      PID_errorOld2 = 0;
      setPointOld = 0;
      PID_errorSum = 0;
      control_output = 0;
    }
    else
    {
      Serial.print("Robot Up ");
      int dt = 5;
      // We calculate the estimated robot speed:
      // Estimated_Speed = angular_velocity_of_stepper_motors(combined) - angular_velocity_of_robot(angle measured by IMU)
      actual_robot_speed_Old = actual_robot_speed;
      actual_robot_speed = (MotorSpeed[0] + MotorSpeed[1]) / 2; // Positive: forward

      int16_t angular_velocity = (angle_adjusted - angle_adjusted_Old) * 90.0; // 90 is an empirical extracted factor to adjust for real units
      int16_t estimated_speed = -actual_robot_speed_Old - angular_velocity;     // We use robot_speed(t-1) or (t-2) to compensate the delay
      estimated_speed_filtered = estimated_speed_filtered * 0.95 + (float)estimated_speed * 0.05;  // low pass filter on estimated speed


      // SPEED CONTROL: This is a PI controller.
      //    input:user throttle, variable: estimated robot speed, output: target robot angle to get the desired speed
      float target_angle = speedPIControl(dt, estimated_speed_filtered, 0 /*throttle*/, KP_THROTTLE /*Kp_thr*/, KI_THROTTLE /*Ki_thr*/);
      target_angle = constrain(target_angle, -7, 7); // limited output
      //target_angle = 0;
      // Stability control: This is a PD controller.
      //    input: robot target angle(from SPEED CONTROL), variable: robot angle, output: Motor speed
      //    We integrate the output (sumatory), so the output is really the motor acceleration, not motor speed.
      control_output += stabilityPDControl(dt, angle_adjusted, target_angle, KP/*Kp*/, KD/*Kd*/);
      control_output = constrain(control_output, -MAX_CONTROL_OUTPUT, MAX_CONTROL_OUTPUT); // Limit max output from control
      Serial.print(control_output);
      float steering = 0.0;
      // The steering part from the user is injected directly on the output
      float motor1 = control_output + steering;
      float motor2 = control_output - steering;

      // Limit max speed (control output)
      motor1 = constrain(motor1, -MAX_CONTROL_OUTPUT, MAX_CONTROL_OUTPUT);
      motor2 = constrain(motor2, -MAX_CONTROL_OUTPUT, MAX_CONTROL_OUTPUT);

      Serial.print(" ");
      Serial.println(motor1);

      digitalWrite(steppersEnablePin, LOW);  // Motors enable
      setMotorSpeed(0, motor1);
      setMotorSpeed(1, motor2);

    }
  }
}


