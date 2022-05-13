// Youtube link: https://youtu.be/7LfqOjjz04w

#include "PDMSerial.h"
// #include <PDMSerial.h>   // use if PDMSerial is in your libraries folder

PDMSerial pdm;

const int buttonPin1 = 13;
const int buttonPin2 = 12;
const int buttonPin3 = 8;
const int buttonPin4 = 7;
const int outPin = 2; // a digital output pin

int sensorData = 0;

int buttonState1 = 0; // variable for reading the pushbutton status
int buttonState2 = 0;
int buttonState3 = 0;
int buttonState4 = 0;

void setup()
{
  // put your setup code here, to run once:

  // Input setup – add more inputs if desired
  pinMode(buttonPin1, INPUT);
  pinMode(buttonPin2, INPUT);
  pinMode(buttonPin3, INPUT);
  pinMode(buttonPin4, INPUT);
  pinMode(outPin, OUTPUT);

  Serial.begin(9600);
}

void loop()
{
  buttonState1 = digitalRead(buttonPin1);
  buttonState2 = digitalRead(buttonPin2);
  buttonState3 = digitalRead(buttonPin3);
  buttonState4 = digitalRead(buttonPin4);

  pdm.transmitSensor("button1", buttonState1);

  pdm.transmitSensor("button2", buttonState2);
  pdm.transmitSensor("end");
  pdm.transmitSensor("button3", buttonState3);

  pdm.transmitSensor("button4", buttonState4);
  pdm.transmitSensor("end");

  boolean newData = pdm.checkSerial();

  if (newData)
  {
    if (pdm.getName().equals(String("mem")))
    {
      if (pdm.getValue() == 1)
      {
        digitalWrite(outPin, HIGH);
        delay(200);
        digitalWrite(outPin, LOW);
      }
      else if (pdm.getValue() == 2)
      {
        digitalWrite(outPin, HIGH);
        delay(200);
        digitalWrite(outPin, LOW);
        delay(200);
        digitalWrite(outPin, HIGH);
        delay(200);
        digitalWrite(outPin, LOW);
      }
      else if (pdm.getValue() == 3)
      {
        digitalWrite(outPin, HIGH);
      }
      else if (pdm.getValue() == 0)
      {
        digitalWrite(outPin, LOW);
      }
    }
  }
}
