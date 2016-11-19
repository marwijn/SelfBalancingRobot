
#define MAX_ACCEL 8

#define RAD2GRAD 57.2957795
#define GRAD2RAD 0.01745329251994329576923690768489

#define ITERM_MAX_ERROR 25   // Iterm windup constants for PI control //40
#define ITERM_MAX 5000       // 5000
float PID_errorSum = 0;
float throttle = 0;
float steering = 0;

// PI controller implementation (Proportional, integral). DT is in miliseconds
float speedPIControl(float DT, float input, float setPoint,  float Kp, float Ki)
{
 // setPoint = 50;
  float error;
  float output;

  error = setPoint - input;
  PID_errorSum += constrain(error, -ITERM_MAX_ERROR, ITERM_MAX_ERROR);
  PID_errorSum = constrain(PID_errorSum, -ITERM_MAX, ITERM_MAX);

  //Serial.println(PID_errorSum);
  Ki = 0.04;
  Kp = 0.15;
  
  output = Kp * error + Ki * PID_errorSum * DT * 0.001; // DT is in miliseconds...

  static int debugCount = 0;
  
  debugCount++;
  if (debugCount > 1000)
  {
    String msg = String("") + input + " " + setPoint + " " + PID_errorSum + " "  + output;
    SendDebugMessage(msg);
    debugCount = 0;
  }
    
    

  
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
  output = Kp * error + (0 * (setPoint - setPointOld) - Kd * (input - PID_errorOld2)) / DT;
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

#define KP_THROTTLE 0.07 //0.07    
#define KI_THROTTLE 0.04   
bool down = true;

void balanceLoop()
{
  float newPhi;
  if (dmpGetNewPhi(&newPhi))
  {
    angle_adjusted_Old = angle_adjusted;
    // Get new orientation angle from IMU (MPU6050)
    angle_adjusted = newPhi;
    //Serial.println(angle_adjusted);
    if (fabs(angle_adjusted) > 70 | ((fabs(angle_adjusted) > 10) && down))
    {
      //Serial.println("Robot down");
      setMotorSpeed(0, 0);
      setMotorSpeed(1, 0);
      enableMotors(false);
      PID_errorOld = 0;
      PID_errorOld2 = 0;
      setPointOld = 0;
      PID_errorSum = 0;
      control_output = 0;
      estimated_speed_filtered = 0;
      throttle = 0;
      steering = 0;
      down = true;
    }
    else
    {
      Serial.print("Robot Up ");
      int dt = 5;
      // We calculate the estimated robot speed:
      // Estimated_Speed = angular_velocity_of_stepper_motors(combined) - angular_velocity_of_robot(angle measured by IMU)
      actual_robot_speed_Old = actual_robot_speed;
      actual_robot_speed = (getMotorSpeed(0) + getMotorSpeed(1)) / 2; // Positive: forward

      int16_t angular_velocity = (angle_adjusted - angle_adjusted_Old) * 90.0; // 90 is an empirical extracted factor to adjust for real units
      int16_t estimated_speed = -actual_robot_speed_Old - angular_velocity;     // We use robot_speed(t-1) or (t-2) to compensate the delay

      if (down) estimated_speed = 0;
      
      estimated_speed_filtered = estimated_speed_filtered * 0.95 + (float)estimated_speed * 0.05;  // low pass filter on estimated speed


      // SPEED CONTROL: This is a PI controller.
      //    input:user throttle, variable: estimated robot speed, output: target robot angle to get the desired speed
      float target_angle = speedPIControl(dt, estimated_speed_filtered, throttle, KP_THROTTLE /*Kp_thr*/, KI_THROTTLE /*Ki_thr*/);
      target_angle = constrain(target_angle, -6, 6); // limited output
      //target_angle = 0;
      // Stability control: This is a PD controller.
      //    input: robot target angle(from SPEED CONTROL), variable: robot angle, output: Motor speed
      //    We integrate the output (sumatory), so the output is really the motor acceleration, not motor speed.
      control_output += stabilityPDControl(dt, angle_adjusted, target_angle, KP/*Kp*/, KD/*Kd*/);
      control_output = constrain(control_output, -MAX_CONTROL_OUTPUT, MAX_CONTROL_OUTPUT); // Limit max output from control
      Serial.print(control_output);
      // The steering part from the user is injected directly on the output
      float motor1 = control_output + steering;
      float motor2 = control_output - steering;

      // Limit max speed (control output)
      motor1 = constrain(motor1, -MAX_CONTROL_OUTPUT, MAX_CONTROL_OUTPUT);
      motor2 = constrain(motor2, -MAX_CONTROL_OUTPUT, MAX_CONTROL_OUTPUT);

      Serial.print(" ");
      Serial.println(motor1);
      
      enableMotors(true);
      setMotorSpeed(0, motor1);
      setMotorSpeed(1, motor2);
      down = false;
    }
  }
}

void setSpeed (signed char speed, signed char steer)
{
  //Serial.print("new speed: ");
  //Serial.println(speed);
  throttle = speed*4;
  steering = steer/2;
  String msg = String("") + throttle + " " + steering;
  SendDebugMessage(msg);
}

