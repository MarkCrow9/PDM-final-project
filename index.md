# Homebound

Homebound is a 2d platformer designed to be played using arduino as the player controller. With this, the user inputs commands to their arduino using the code provided by the final_project_arduino folder. The commands run from the arduino (this project was built using an Arduino Uno although any Arduino product should work fine) to p5js where the character receives them and moves accordingly. The objecttive of the game is to collect all of the collectibles and reach the end of the level. 


## Narrattive 

The story of Homebound follows a lost dog trying to return home. In order to do so the dog must collect memories of his family and home by visiting places with importance to him. As he collects more and more memories, his recollection of his home and his family will beome clearer until eventually he remembers his way home. Through future updates the do will meet people on his journey who recognize him and joke with him about past memories.


## Images and video of The Project

![image](https://user-images.githubusercontent.com/60494831/168262793-d12fb671-185a-403f-8c26-02bb128ba58a.png)
![image](https://user-images.githubusercontent.com/60494831/168263190-b9857613-891e-49f4-9e8b-39513bc64ac0.png)
![image](https://user-images.githubusercontent.com/60494831/168263350-5c4bfd17-099e-422f-bae0-31bee90e4957.png)

### Video Link
https://www.youtube.com/watch?v=7LfqOjjz04w


## Information for Setup
My version of the project was built on Arduino Uno, though this may not be required I would recommend also using the same. The setup requires 4 pushbuttons, 4 10K resistors, 1 LED, and the resistor that you arduino recommends for LEDs. Start by setting up the buttons with the button you want to move left attached to pin 13, up to pin 12, down to pin 8, and left to pin 7. Attach the LED to pin 2 and the Arduino is setup. Next, find the serial port on your device using any serial communicator of your choice and change the variable "portName" in sketch.js to match your serial port name exactly. After this, upload the arduino files to your arduino and the project should be good to go.


## Thoughts of future development
Future developments of the project will include introducing levels, fixing gravity, and further fleshing the story out. 
