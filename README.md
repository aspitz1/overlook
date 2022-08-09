# Overlook - Hotel Management Tool
**[PROJECT SPEC](https://frontend.turing.edu/projects/overlook.html)**
<br>
**[GITHUB LINK](https://github.com/aspitz1/overlook)**
# Tech Stack 
* HTML
* JavaScript
* Fetch API
* Sass
* Chai
* Web-Pack
# How to Run
This application is built to run off of a server that you can run locally. 
* The repo for the server can be found here: [overlook-api](https://github.com/turingschool-examples/overlook-api)

Follow the direction provided in the repo to install the local server.
<br>
When that is done, clone down this repo and run these commands:
* `npm install`
* `npm start`
* navigate to ` http://localhost:8080/` in you browser
# What Overlook Does
Overlook is a hotel booking app simulation. It is a simply styled tool that walks you through booking a room as a customer and as a manager. 
# Features 
* Login page where you would log in as a customer
    * login name: `customer<any number between 1-50>` (example: `customer23`)
    * password: `overlook2021`
* Dashboard that displays information based on Customer or Manager
    * Customer dash displays:
        * Future bookings with option to cancel
        * Past bookings
        * Total spent on past bookings
    * Manager dash displays:
        * Total number of unavailable rooms
        * Total number of available  rooms
        * Percent of rooms booked
* Both Customer and Manager can book rooms filtering by date and room type

**Customer View**
<br>
![Customer gif](/src/images/overlook-customer.gif)

**Manager View**
<br>
![Manager gif](/src/images/overlook-manager.gif)
# Project Wins
* Updated the DOM in a way that took asynchronous functions into account
* Followed TDD
* Stuck to MVP in order to finish on time without too much stress
* Used CSS Grid successfully 
* Continued to progress with learning SASS
# What Was Learned
* Consider setting a stronger style guide in the future that creates more reusable layouts
* Use `createElement/appendChild` vs `innerHTML`
* Use an array of images that correspond with room types to display with available rooms
* Consider using routing to make the site more accessible
# Contributors 
* [Anna Spitz](https://github.com/aspitz1)



