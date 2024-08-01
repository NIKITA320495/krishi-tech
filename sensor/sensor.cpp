//Compatible with the Arduino IDE 1.0
//Library version:1.1
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

void setup()
{
  pinMode(A0,INPUT);
  pinMode(8,INPUT);
  lcd.init();                      // initialize the lcd 
  // Print a message to the LCD.
  lcd.backlight();

}


void loop()
{ 
  int soil=analogRead(A1);
  soil = map(soil, 0, 500, 0,100);
  int temp = analogRead(A0);
  temp = map(temp, 0, 500, 0,100);
  
  lcd.setCursor(0,0);
  lcd.print("temp:");
  lcd.setCursor(5,0);
  lcd.print(temp);
  lcd.setCursor(0,1);
  lcd.print("moist:");
  lcd.setCursor(8,1);
  lcd.print(soil);
  
}