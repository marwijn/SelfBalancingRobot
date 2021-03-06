const int steppersEnablePin = 15;
const int stepperStepPin[] = {0, 5};
const int stepperDirPin[] = {2, 4};

volatile unsigned int MotorTime[] = {0, 0};
volatile unsigned int MotorCount[] = {0, 0};
int16_t MotorSpeed[] = {0, 0};

int16_t getMotorSpeed(int motor)
{
  return MotorSpeed[motor];
}

void ICACHE_RAM_ATTR timerHandler (void)
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
    digitalWrite(stepperDirPin[motor], (motor == 0) ? HIGH : HIGH);
  }
  else
  {
    timer_period = -160000 / speed; // 160 kHz interrupts
    digitalWrite(stepperDirPin[motor], (motor == 0) ? LOW : LOW);
  }
  if (timer_period > 65535)   // Check for minimun speed (maximun period without overflow)
  {
    timer_period = -1;
  }
  MotorTime[motor] = timer_period;
}

void enableMotors(bool enable)
{
  if (enable)
  {
    digitalWrite(steppersEnablePin, LOW);
  }
  else
  {
    digitalWrite(steppersEnablePin, HIGH);
  }
}

extern "C"
{
  void NmiTimSetFunc (void(*)(void));
}

void initMotors()
{
  digitalWrite(steppersEnablePin, HIGH);
  pinMode(steppersEnablePin, OUTPUT);
  for (int i = 0; i < 2; i++)
  {
    pinMode(stepperStepPin[i], OUTPUT);
    pinMode(stepperDirPin[i], OUTPUT);
  }
  RTC_REG_WRITE(FRC1_CTRL_ADDRESS, BIT6 |  BIT7 );
  ETS_FRC_TIMER1_NMI_INTR_ATTACH(timerHandler);

  TM1_EDGE_INT_ENABLE();
  ETS_FRC1_INTR_ENABLE();

  RTC_REG_WRITE(FRC1_LOAD_ADDRESS, 1000);
}

