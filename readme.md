# Game Table #
## A suite of ways to choose a board game ##

[Game Table](http://gametableapp.herokuapp.com/) is a simple application that uses the API from [boardgamegeek.com](http://www.boardgamegeek.com) to help board game groups choose what game to play on a given night.

## How Game Table works ##

Given a BGG username the user's collection can be filtered down by player count, duration, and genre. The app then helps the users choose one game to play using a number of possible methods:

* Random: Picks a random game from the list.
* Nominate-Random: Users nominate games and then a random one is chosen.
* Eliminate: Users take turns removing games from the list until only one game remains.
* Vote: Users nominate games and then vote on them. Most votes wins.
* Nominate-Rank: Users nominate games and then vote on them in a series of votes which increase in value.
* Bracket: Users choose between two games at a time until only one game remains.

The live site for Game Table can be found at [Game Table](http://gametableapp.herokuapp.com/).

## How Game Table was made ##

This project was built using [AngularJS](https://angularjs.org/) and [Sass](http://sass-lang.com/). [Grunt](http://gruntjs.com/) was used to automate the build process. Testing was done using [Mocha](https://mochajs.org/), [Chai](http://chaijs.com/) and [Karma](https://karma-runner.github.io/0.13/index.html).

## How to work on Game Table yourself ##

If you would like to fork and work on your own version you will find that all of the working files are in the src folder.

To get up and running by using the following steps.
1. [Install git](http://git-scm.com)
2. [Install Node](http://nodejs.org)
3. [Install Grunt](http://gruntjs.com)
4. Clone Game Table to your own system
5. Navigate to the root directory of your clone and run `npm install`
6. Edit away, have fun
7. Run grunt in the root directory to build your changes from the src directory to the build directory
8. The `index.html` file in the build directory is the main html file for the site

[Game Table](http://gametableapp.herokuapp.com/) was built by Matt Grosso ([mattgrosso@gmail.com](mailto:mattgrosso@gmail.com)) as his final project for the front-end engineering class at [The Iron Yard](https://www.theironyard.com/), DC. Enjoy!
