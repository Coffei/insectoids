# Insectoids - Optometric game

<p align="center">
	<img src="https://raw.githubusercontent.com/Coffei/insectoids/master/assets/icon.png" alt="Insectoids" height="200" />
</p>

Simple Android game written in [React Native Game
Engine](https://github.com/bberak/react-native-game-engine). It is a simple catch 'em up game where
you have to catch as many insects as you can. The game is intended for kids with eye disorders, the
background is intentionally difficult on the eyes and forces the eyes to "work more" and therefore
helps to exercise them.

The game uses [React Native](https://facebook.github.io/react-native/) and [Expo](https://expo.io/)
which make writing and building the app a breeze.

## How did it go?

Writing the game was quite simple. The game logic consists of a bunch of systems in
`src/game/systems.tsx`. Graphics is mostly the background and the sprites, which are stored as
animated GIFs. Developing and building was crazy simple with Expo, no need to install any Android
stuff locally.

Sadly, the game does not perform well on older hardware. Works great on my Motorola One Vision, but
there are noticeable lags on Samsung Galaxy Tab A. It's partially because of the GIF animation,
removing that helps, but there are still lags from time to time even without animation.

## What about the health benefits?

First a disclaimer, I am NOT a doctor, nor have I discussed this app with one. However, this game
uses basic principles that are used in professional optometric games. Unfortunately, these games
are not available for purchase or are quite expensive, so I decided to write something similar.
