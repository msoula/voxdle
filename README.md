<img align="right" src="https://i.imgur.com/YH44Vbg.png" height="200" width="200">

# Voxdle

Voxdle is a French/English is a clone of [Wordle](https://www.nytimes.com/games/wordle/index.html), a word game created in 2021 by Josh Wardle ([@powerlanguish](https://twitter.com/powerlanguish)).

Voxdle offers the possibility to play Wordle with your microphone instead of the keyboard. To do so, it uses the features of the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) currently available :
* on computer with Chrome, Edge and Safari\* browsers;
* on mobile phone with Chrome Android, Safari\* on iOS, and Samsung Internet\*.

\*So says the documentation, we've never been able to test Voxdle on these applications and would be pleased to have your feedback.

For users who do not use these browsers, there is still the possibility to play Voxdle normally.

## Why?

I started to get interested in voice recognition on the web in the last few weeks and I quickly looked for application ideas. The recent popularity of Wordle among my friends made me want to transpose its gameplay into voice command mode.

Originally, I wanted to allow players to spell words directly, but speech interpretation gave me random results depending on the browser or the platform I used. After considering using the radio alphabet for a while, I finally settled on a solution that requires the player to precede each letter of the word to be tested with the phrase "*The letter ...*". This indicator places the interpreter in the expectation of the reading of a letter in the message.

It happens that the interpreter gives incorrect or distorted results compared to what was really pronounced. This depends on the context of the capture. In order to improve the recognition of letters, I have configured the interpreter with [gramograms](https://en.wikipedia.org/wiki/Gramogram) for each letter of the alphabet to be spelled. A gramogram is a group of letters which, when pronounced, form a sound reminiscent of a word. For instance:

* The letter "*C*" when pronunced may sounds like the word "*sea*"
* The letter "*T*" when pronunced may sounds like the word "*tee*"
* The letter "*Y*" when pronunced may sounds like the word "*why*"

## How to play?

<img align="right" src="https://i.imgur.com/uZaYn0a.png" height="237" width="200">

The public release of the game can be found here: https://voxdle.u2042.com

### Starting capture

To activate the microphone capture, simply click on the microphone icon at the top of the game interface.

### Vocal controls

A dialog box will show you every vocal controls when starting the capture:

* **the letter W** : to add a new letter W
* **confirm** (or **validate**) : to confirm the current word
* **correct** (or **cancel**) : to correct the current word
* **erase** : to erase the current word
* **check** : to check the game status
* **stop** : to stop the capture

Capture will automatically stop if no activity is registered for 30 secondes.

### Vocal synthesis

Enabling **echo mode** while capture is on, you'll get enable vocal synthesis feature that will inform your progress.

## Words list

### English words list

The list of every English words was downloaded from : https://gist.github.com/cfreshman/cdcdf777450c5b5301e439061d29694c

The list of every English wordles was downloaded from : https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b

### French words list

The list of every French words was downloaded from : https://github.com/lorenbrichter/Words.

The list of every French wordles was established by me :)

## Inspirations

* [Wordle](https://www.nytimes.com/games/wordle/index.html), original game by ([@powerlanguish](https://twitter.com/powerlanguish)),
* [Le Mot](https://wordle.louan.me/), French clone by ([@louanben](https://twitter.com/louanben)),
* [MOTDLE](https://motdle.herokuapp.com/), French clone that implements French diacritics by Renaud Bédard ([@renaudbedard](https://twitter.com/louanben/renaudbedard)).

## Used assets

### Sounds

* `bong_001.ogg` from [Interface sounds package](https://www.kenney.nl/assets/interface-sounds) by [Kenney](https://www.kenney.nl/)
* `drop_002.ogg` from [Interface sounds package](https://www.kenney.nl/assets/interface-sounds) by [Kenney](https://www.kenney.nl/)
* `error_006.ogg` from [Interface sounds package](https://www.kenney.nl/assets/interface-sounds) by [Kenney](https://www.kenney.nl/)
* `message_006.ogg` from [Interface sounds package](https://www.kenney.nl/assets/interface-sounds) by [Kenney](https://www.kenney.nl/)
* `switch_003.ogg` from [Interface sounds package](https://www.kenney.nl/assets/interface-sounds) by [Kenney](https://www.kenney.nl/)
* `jingles_SAX07.ogg` from [Music Jingles package](https://www.kenney.nl/assets/music-jingles) by [Kenney](https://www.kenney.nl/)
* `jingles_SAX10.ogg` from [Music Jingles package](https://www.kenney.nl/assets/music-jingles) by [Kenney](https://www.kenney.nl/)
* `jingles_STEEL00.ogg` from [Music Jingles package](https://www.kenney.nl/assets/music-jingles) by [Kenney](https://www.kenney.nl/)
* `jingles_STEEL16.ogg` from [Music Jingles package](https://www.kenney.nl/assets/music-jingles) by [Kenney](https://www.kenney.nl/)
