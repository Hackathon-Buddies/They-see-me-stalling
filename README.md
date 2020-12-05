# Driving simulator - They see me stallin' 24hr Hackathon project #

* This project had too high goals for the amount of time available to complete, so we apologise for the bugs.
* Somehow we still won 3rd place at the 2020 University of Surrey Hackathon https://devpost.com/software/they-see-me-stalling-14jfv8

## Project goals ##

Help people practice their team working skills while also practicing to drive a manual car.
<br>
The idea is that there will be 4 players, each controlling a different part of the car: 
* Direction Manager -> Left-Right movements
* Pedals Controller -> Clutch, Brake, Gas
* Gears Lead -> Change gears, up/down
* Clutch Supervisor -> Help with the clutch and coordinate the others

### Project achievements ###

* Created some fun animations for the main menu
* Multiplayer functionality with Node.JS, Socket.io and Heroku (a little buggy due to the lack of time.)
* In-game collision detection with spawnable objects (used to work much better.)
* Game logic covering shifting gears, moving left and right, pressing the pedals and a speedometer, all working closely to simulating a real manual car 
* The car can stall if the gear is too high or too low for the current speed. 
* Stalling will quickly decrease the speed of the car making players lose control until they match the gear again. 
* Stalling also creates a smoke effect on the car to simulate how a learner driver feels like.
* Three driving lanes and some side road trees animation to simulate higher speeds.

### Running the project locally ###

* Run 'npm install' within the client and server folders to install requirements.
* Run 'npm run start' within both folders again to run the project and server on localhost.
* Enjoy ?

### Notes ###

* Select all roles from the same browser window and start the game, you can control all pedals.
* The multiplayer functionality and collision detection is not working properly, so if you want to test the controls, you will have to do a bit of a workaround.
* Press and hold on the clutch and move the mouse away before releasing to simulate it being held down while pressing the gears up/down. No clutch -> no gears control
* Then click on the clutch again to release it and be able to speed up. Clutch down -> no gas control


