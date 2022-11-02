# All The Cards - Backend

![All The Cards](atc-logo.png)

## Introduction

We present to you, yet another Magic: The Gathering online library. All The Cards allows users to explore, create, and share decks, custom cards, and favorites. This repo is specific to the backend for querying and handling of various requests.

## Features\Requests

Again, this is just the backend. This would not necessarily contain any features but instead the requests listed below.

### `Feature Requests:`
#### `/api/features/random/art`
This returns a random art_crop image from any given card in the 71k catalog.
#### `/api/features/recent/decks`
This returns the six most recently created decks as a list of JSONs.
#### `/api/features/editor/decks`
This returns either a message or an error from the uploaded deck.
#### `/api/features/editor/retrieve`
This returns either a formatted deck JSON or an error from the requested deckID.

### `Card Requests:`
#### `/api/get/card/id=`
This returns a card JSON based on the requested cardID.

#### `/api/search/card/query=`
This returns a list of limited-data card JSONs based on the search term that is given.

#### `/api/search/card/adv/query=?`
This returns a list of limited-data card JSONs based on the search and filter terms that are given.

### `Deck Requests:`
#### `/api/get/deck/id=`
This returns a deck JSON based on the requested deckID.
#### `/api/search/deck/query=`
This returns a list of deck JSONs based on the search term that is given.
#### `/api/get/decks/user_id=`
This returns a list of deck JSONs based on the author (userID) that is given.

### `User Requests:`
#### `/api/get/user/id=`
This returns a user JSON based on the requested userID.
#### `/api/search/user/query=`
This returns a list of user JSONs based on the search term that is given.

## Technologies

This project is coded in JavaScript, using a [NodeJS](https://nodejs.org/en/) variant. This project also utilizes [Supabase](https://supabase.com/) for the tables pertaining to the catalog of data. The catalog of data is courtesy of [Scryfall API](https://scryfall.com/docs/api).

## Installation

To run this project, you will need to have [NodeJS](https://nodejs.org/en/) installed on your system. Unzip the folder, open PowerShell or Bash in that folder, and run `npm install`. Then you can run `npm start` to execute the backend. Most of the requests are `POST` methods. [Postman](https://www.postman.com/) is best suited for sending requests.

## Development Setup

The URL is [http://localhost:5000](http://localhost:5000) for Postman. Many of the requests can be found above in this document.

## License

All The Cards is unofficial Fan Content permitted under the [Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy). This project is not sponsered/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.

## Contributers

`Frontend` Tanner Hawkins\
`Frontend` Michael Lanctot\
`Backend` Jamier Singleton\
`Frontend` Noah Stephenson

## Project Status

`Pre-Alpha` Stage Development.
