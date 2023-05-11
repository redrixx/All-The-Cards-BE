# All The Cards - Backend

![All The Cards](atc-logo.png)

## Introduction

We present to you, yet another Magic: The Gathering online library. All The Cards allows users to explore, create, and share decks, custom cards, and favorites. This repo is specific to the backend for querying and handling of various requests.

## Requests

Again, this is just the backend. This would not necessarily contain any features but instead the requests listed below.

### Feature Requests
| Method | Route | Parameter(s) | Parameter Type(s) | Returns |
| --- | --- | --- | --- | --- |
| **POST** | `/api/features/random/art` | - | - | IMAGE URL
| **POST** | `/api/features/recent/decks` | - | - | [[decksLTD](#deck-limited-json)]
| **POST** | `/api/features/topthree/decks` | deckID | HEADER | [[decksLTD](#deck-limited-json)]
| **POST** | `/api/features/editor/decks` | [payload](#deck-editor-payload) | BODY | MESSAGE or ERROR
| **POST** | `/api/features/editor/cards` | art_crop, png, [card-payload](#card-editor-payload) | MULTIPART/FORM-DATA | MESSAGE or ERROR
| **DELETE** | `/api/features/editor/delete` | token, deckID | HEADER | MESSAGE or ERROR
| **DELETE** | `/api/features/editor/card-delete` | token, cardID | HEADER | MESSAGE or ERROR

### Card Requests
| Method | Route | Parameter(s) | Parameter Type(s) | Returns |
| --- | --- | --- | --- | --- |
| **POST** | `/api/get/card/id=queryCard` | queryCard | URL | [card](#card-json)
| **POST** | `/api/search/card/query=queryText` | queryText | URL | [[cardsLTD](#card-limited-json)]
| **POST** | `/api/search/card/adv/query=?advancedQueryText` | [advancedQueryText](#advanced-search) | PARAMS | [[cardsLTD](#card-limited-json)]

### Deck Requests
| Method | Route | Parameter(s) | Parameter Type(s) | Returns |
| --- | --- | --- | --- | --- |
| **POST** | `/api/get/deck/id=queryDeck` | queryDeck | URL | [deck](#deck-json)
| **POST** | `/api/search/deck/query=queryText` | queryText | URL | [[decksLTD](#deck-limited-json)]
| **POST** | `/api/get/decks/user_id=queryUser` | queryUser | URL | [[decksLTD](#deck-limited-json)]

### User Requests
| Method | Route | Parameter(s) | Parameter Type(s) | Returns |
| --- | --- | --- | --- | --- |
| **POST** | `/api/get/user/id=queryUser` | queryUser | URL | [user](#user-json)
| **POST** | `/api/search/user/query=queryText` | queryText | URL | [[users](#user-json)]
| **POST** | `/api/get/cards/user_id=queryUser` | queryUser | URL | [[cardsLTD](#card-limited-json)]
| **POST** | `/api/features/user/favorite` | token, deckID/cardID | HEADER, BODY | [[users](#user-json)]

### Object Examples
#### Card JSON
<details>

```json
{
	"id": "d1129585-6d59-4217-9404-747a100f1e8c",
	"oracle_id": "d4a3c9a5-3c91-4135-a19d-98eb5bcf5e00",
	"multiverse_ids": "[3355]",
	"mtgo_id": "7213",
	"mtgo_foil_id": "7214",
	"tcgplayer_id": "5184",
	"cardmarket_id": "8135",
	"name": "Prismatic Lace",
	"lang": "en",
	"released_at": "10/8/1996 0:00",
	"scryfall_uri": "https://scryfall.com/card/mir/84/prismatic-lace?utm_source=api",
	"layout": "normal",
	"image_uris": {
		"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925",
		"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925",
		"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925",
		"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.png?1562721925",
		"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925",
		"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925"
	},
	"mana_cost": "{U}",
	"cmc": "1",
	"type_one": "Instant",
	"subtype_one": null,
	"type_two": null,
	"subtype_two": null,
	"oracle_text": "Target permanent becomes the color or colors of your choice. (This effect lasts indefinitely.)",
	"power": null,
	"toughness": null,
	"colors": "['U']",
	"color_identity": "['U']",
	"keywords": "[]",
	"legalities": {
		"standard": "not_legal",
		"future": "not_legal",
		"historic": "not_legal",
		"gladiator": "not_legal",
		"pioneer": "not_legal",
		"explorer": "not_legal",
		"modern": "not_legal",
		"legacy": "legal",
		"pauper": "not_legal",
		"vintage": "legal",
		"penny": "not_legal",
		"commander": "legal",
		"brawl": "not_legal",
		"historicbrawl": "not_legal",
		"alchemy": "not_legal",
		"paupercommander": "not_legal",
		"duel": "legal",
		"oldschool": "not_legal",
		"premodern": "legal"
	},
	"games": "['paper', 'mtgo']",
	"reserved": "true",
	"foil": "false",
	"nonfoil": "true",
	"finishes": "['nonfoil']",
	"oversized": "false",
	"promo": "false",
	"reprint": "false",
	"variation": "false",
	"set_id": "5f06acf3-8123-4a78-b2e7-089b0b775a4a",
	"set_shorthand": "mir",
	"set_name": "Mirage",
	"set_type": "expansion",
	"scryfall_set_uri": "https://scryfall.com/sets/mir?utm_source=api",
	"rulings_uri": "https://api.scryfall.com/cards/d1129585-6d59-4217-9404-747a100f1e8c/rulings",
	"prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3Ad4a3c9a5-3c91-4135-a19d-98eb5bcf5e00&unique=prints",
	"collector_number": "84",
	"digital": "false",
	"rarity": "rare",
	"flavor_text": null,
	"card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
	"artist": "David O'Connor",
	"artist_ids": "['bd8dcf6f-4ab3-4854-bfb0-f2e21610fc16']",
	"illustration_id": "54207fb1-8017-4fc4-80c9-e4ce5d8fcdde",
	"border_color": "black",
	"frame": "1997",
	"full_art": "false",
	"textless": "false",
	"booster": "true",
	"story_spotlight": "false",
	"edhrec_rank": "14256",
	"penny_rank": null,
	"prices": {
		"usd": "1.04",
		"usd_foil": null,
		"usd_etched": null,
		"eur": "1.84",
		"eur_foil": null,
		"tix": "0.32"
	},
	"related_uris": {
		"gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=3355",
		"tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Prismatic+Lace&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
		"tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Prismatic+Lace&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
		"edhrec": "https://edhrec.com/route/?cc=Prismatic+Lace"
	},
	"promo_types": null,
	"arena_id": null,
	"security_stamp": null,
	"produced_mana": null,
	"watermark": null,
	"frame_effects": null,
	"loyalty": null,
	"printed_name": null,
	"card_faces": null,
	"tcgplayer_etched_id": null,
	"color_indicator": null,
	"life_modifier": null,
	"hand_modifier": null,
	"printed_type_line": null,
	"printed_text": null,
	"content_warning": null,
	"flavor_name": null,
	"variation_of": null,
	"favorites": 0
}
```

</details>

#### Deck JSON
<details>

```json
{
	"deck_id": "4e331898-c5d5-4b63-9771-0e103832c33e",
	"created": "2022-09-19T22:29:56.59",
	"name": "Deck The Halls",
	"description": "A cool new deck description. Wicked bro.",
	"tags": [
		"angels are trash",
		"goblins forever"
	],
	"format": "future",
	"cover_art": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/9/2/92fb453e-6cbe-48c6-98ef-86069791c341.jpg?1562926055",
	"cover_card": {
		"id": "92fb453e-6cbe-48c6-98ef-86069791c341",
		"oracle_id": "d04356f1-0e1a-4689-8e54-f88c4c6dd936",
		"multiverse_ids": "[376432]",
		"mtgo_id": "51278",
		"mtgo_foil_id": "51279",
		"tcgplayer_id": "72206",
		"cardmarket_id": "264933",
		"name": "Nivix Guildmage",
		"lang": "en",
		"released_at": "11/1/2013 0:00",
		"scryfall_uri": "https://scryfall.com/card/c13/202/nivix-guildmage?utm_source=api",
		"layout": "normal",
		"image_uris": {
			"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/9/2/92fb453e-6cbe-48c6-98ef-86069791c341.jpg?1562926055",
			"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/9/2/92fb453e-6cbe-48c6-98ef-86069791c341.jpg?1562926055",
			"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/9/2/92fb453e-6cbe-48c6-98ef-86069791c341.jpg?1562926055",
			"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/9/2/92fb453e-6cbe-48c6-98ef-86069791c341.png?1562926055",
			"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/9/2/92fb453e-6cbe-48c6-98ef-86069791c341.jpg?1562926055",
			"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/9/2/92fb453e-6cbe-48c6-98ef-86069791c341.jpg?1562926055"
		},
		"mana_cost": "{U}{R}",
		"cmc": "2",
		"type_one": "Creature",
		"subtype_one": "Human Wizard",
		"type_two": null,
		"subtype_two": null,
		"oracle_text": "{1}{U}{R}: Draw a card, then discard a card.\n{2}{U}{R}: Copy target instant or sorcery spell you control. You may choose new targets for the copy.",
		"power": "2",
		"toughness": "2",
		"colors": "['R', 'U']",
		"color_identity": "['R', 'U']",
		"keywords": "[]",
		"legalities": {
			"standard": "not_legal",
			"future": "not_legal",
			"historic": "not_legal",
			"gladiator": "not_legal",
			"pioneer": "legal",
			"explorer": "not_legal",
			"modern": "legal",
			"legacy": "legal",
			"pauper": "not_legal",
			"vintage": "legal",
			"penny": "legal",
			"commander": "legal",
			"brawl": "not_legal",
			"historicbrawl": "not_legal",
			"alchemy": "not_legal",
			"paupercommander": "restricted",
			"duel": "legal",
			"oldschool": "not_legal",
			"premodern": "not_legal"
		},
		"games": "['paper', 'mtgo']",
		"reserved": "false",
		"foil": "false",
		"nonfoil": "true",
		"finishes": "['nonfoil']",
		"oversized": "false",
		"promo": "false",
		"reprint": "true",
		"variation": "false",
		"set_id": "c62e6d4f-af8c-4f27-9bc8-361291890146",
		"set_shorthand": "c13",
		"set_name": "Commander 2013",
		"set_type": "commander",
		"scryfall_set_uri": "https://scryfall.com/sets/c13?utm_source=api",
		"rulings_uri": "https://api.scryfall.com/cards/92fb453e-6cbe-48c6-98ef-86069791c341/rulings",
		"prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3Ad04356f1-0e1a-4689-8e54-f88c4c6dd936&unique=prints",
		"collector_number": "202",
		"digital": "false",
		"rarity": "uncommon",
		"flavor_text": "\"The only action worth taking is one with an unknown outcome.\"",
		"card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
		"artist": "Scott M. Fischer",
		"artist_ids": "['23b0cf43-3e43-44c6-8329-96446eca5bce']",
		"illustration_id": "a0f57176-1208-4971-8268-bca5117d95bf",
		"border_color": "black",
		"frame": "2003",
		"full_art": "false",
		"textless": "false",
		"booster": "false",
		"story_spotlight": "false",
		"edhrec_rank": "7577",
		"penny_rank": "10916",
		"prices": {
			"usd": "0.18",
			"usd_foil": null,
			"usd_etched": null,
			"eur": "0.10",
			"eur_foil": null,
			"tix": "0.03"
		},
		"related_uris": {
			"gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=376432",
			"tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Nivix+Guildmage&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
			"tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Nivix+Guildmage&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
			"edhrec": "https://edhrec.com/route/?cc=Nivix+Guildmage"
		},
		"promo_types": null,
		"arena_id": null,
		"security_stamp": null,
		"produced_mana": null,
		"watermark": null,
		"frame_effects": null,
		"loyalty": null,
		"printed_name": null,
		"card_faces": null,
		"tcgplayer_etched_id": null,
		"color_indicator": null,
		"life_modifier": null,
		"hand_modifier": null,
		"printed_type_line": null,
		"printed_text": null,
		"content_warning": null,
		"flavor_name": null,
		"variation_of": null
	},
	"commander": {
		"id": "76cde4a6-128d-447f-9659-ceb3b345ed33",
		"oracle_id": "393e5331-4456-4ba3-b410-bb630bb053db",
		"multiverse_ids": "[370379]",
		"mtgo_id": "48832",
		"mtgo_foil_id": "48833",
		"tcgplayer_id": "68268",
		"cardmarket_id": "261950",
		"name": "Knight of the Reliquary",
		"lang": "en",
		"released_at": "6/7/2013 0:00",
		"scryfall_uri": "https://scryfall.com/card/mma/178/knight-of-the-reliquary?utm_source=api",
		"layout": "normal",
		"image_uris": {
			"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818",
			"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818",
			"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818",
			"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.png?1561967818",
			"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818",
			"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818"
		},
		"mana_cost": "{1}{G}{W}",
		"cmc": "3",
		"type_one": "Creature",
		"subtype_one": "Human Knight",
		"type_two": null,
		"subtype_two": null,
		"oracle_text": "Knight of the Reliquary gets +1/+1 for each land card in your graveyard.\n{T}, Sacrifice a Forest or Plains: Search your library for a land card, put it onto the battlefield, then shuffle.",
		"power": "2",
		"toughness": "2",
		"colors": "['G', 'W']",
		"color_identity": "['G', 'W']",
		"keywords": "[]",
		"legalities": {
			"standard": "not_legal",
			"future": "not_legal",
			"historic": "legal",
			"gladiator": "legal",
			"pioneer": "not_legal",
			"explorer": "not_legal",
			"modern": "legal",
			"legacy": "legal",
			"pauper": "not_legal",
			"vintage": "legal",
			"penny": "legal",
			"commander": "legal",
			"brawl": "not_legal",
			"historicbrawl": "legal",
			"alchemy": "not_legal",
			"paupercommander": "not_legal",
			"duel": "legal",
			"oldschool": "not_legal",
			"premodern": "not_legal"
		},
		"games": "['paper', 'mtgo']",
		"reserved": "false",
		"foil": "true",
		"nonfoil": "true",
		"finishes": "['nonfoil', 'foil']",
		"oversized": "false",
		"promo": "false",
		"reprint": "true",
		"variation": "false",
		"set_id": "0b7020f2-336d-4706-9ce6-f6710b9ebd5c",
		"set_shorthand": "mma",
		"set_name": "Modern Masters",
		"set_type": "masters",
		"scryfall_set_uri": "https://scryfall.com/sets/mma?utm_source=api",
		"rulings_uri": "https://api.scryfall.com/cards/76cde4a6-128d-447f-9659-ceb3b345ed33/rulings",
		"prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A393e5331-4456-4ba3-b410-bb630bb053db&unique=prints",
		"collector_number": "178",
		"digital": "false",
		"rarity": "rare",
		"flavor_text": "\"Knowledge of Bant's landscape and ruins is a weapon that the invaders can't comprehend.\"\n�Elspeth",
		"card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
		"artist": "Michael Komarck",
		"artist_ids": "['96a53b95-fe5f-4fbb-9411-ccf4ee150aca']",
		"illustration_id": "c50ccc82-f856-4fcb-b560-b20b39dea7e7",
		"border_color": "black",
		"frame": "2003",
		"full_art": "false",
		"textless": "false",
		"booster": "true",
		"story_spotlight": "false",
		"edhrec_rank": "3955",
		"penny_rank": "1639",
		"prices": {
			"usd": "1.67",
			"usd_foil": "5.35",
			"usd_etched": null,
			"eur": "2.84",
			"eur_foil": "4.20",
			"tix": "0.06"
		},
		"related_uris": {
			"gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=370379",
			"tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Knight+of+the+Reliquary&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
			"tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Knight+of+the+Reliquary&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
			"edhrec": "https://edhrec.com/route/?cc=Knight+of+the+Reliquary"
		},
		"promo_types": null,
		"arena_id": null,
		"security_stamp": null,
		"produced_mana": null,
		"watermark": null,
		"frame_effects": null,
		"loyalty": null,
		"printed_name": null,
		"card_faces": null,
		"tcgplayer_etched_id": null,
		"color_indicator": null,
		"life_modifier": null,
		"hand_modifier": null,
		"printed_type_line": null,
		"printed_text": null,
		"content_warning": null,
		"flavor_name": null,
		"variation_of": null
	},
	"isValid": true,
	"user_name": "redrixx",
	"user_id": "6a0cd1d6-1278-45d0-aa0e-419ae50add06",
	"favorites": 4,
	"cards": [
		{
			"id": "1a0d277e-cf88-4492-9f8b-1434acbfebc8",
			"oracle_id": "5b8be856-c08d-4356-925d-fce843565189",
			"multiverse_ids": "[]",
			"mtgo_id": null,
			"mtgo_foil_id": null,
			"tcgplayer_id": "263479",
			"cardmarket_id": "609591",
			"name": "Hidetsugu Consumes All // Vessel of the All-Consuming",
			"lang": "en",
			"released_at": "2/18/2022 0:00",
			"scryfall_uri": "https://scryfall.com/card/pneo/221s/hidetsugu-consumes-all-vessel-of-the-all-consuming?utm_source=api",
			"layout": "transform",
			"image_uris": null,
			"mana_cost": null,
			"cmc": "3",
			"type_one": "Enchantment",
			"subtype_one": "Saga",
			"type_two": "Enchantment Creature",
			"subtype_two": "Ogre Shaman",
			"oracle_text": null,
			"power": null,
			"toughness": null,
			"colors": null,
			"color_identity": "['B', 'R']",
			"keywords": "['Transform', 'Trample']",
			"legalities": {
				"standard": "legal",
				"future": "legal",
				"historic": "legal",
				"gladiator": "legal",
				"pioneer": "legal",
				"explorer": "legal",
				"modern": "legal",
				"legacy": "legal",
				"pauper": "not_legal",
				"vintage": "legal",
				"penny": "not_legal",
				"commander": "legal",
				"brawl": "legal",
				"historicbrawl": "legal",
				"alchemy": "legal",
				"paupercommander": "not_legal",
				"duel": "legal",
				"oldschool": "not_legal",
				"premodern": "not_legal"
			},
			"games": "['paper']",
			"reserved": "false",
			"foil": "true",
			"nonfoil": "false",
			"finishes": "['foil']",
			"oversized": "false",
			"promo": "true",
			"reprint": "true",
			"variation": "false",
			"set_id": "b3161020-d74f-48cc-bc9d-d7233e64e524",
			"set_shorthand": "pneo",
			"set_name": "Kamigawa: Neon Dynasty Promos",
			"set_type": "promo",
			"scryfall_set_uri": "https://scryfall.com/sets/pneo?utm_source=api",
			"rulings_uri": "https://api.scryfall.com/cards/1a0d277e-cf88-4492-9f8b-1434acbfebc8/rulings",
			"prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A5b8be856-c08d-4356-925d-fce843565189&unique=prints",
			"collector_number": "221s",
			"digital": "false",
			"rarity": "mythic",
			"flavor_text": null,
			"card_back_id": null,
			"artist": "Chris Cold",
			"artist_ids": "['2622d22b-3fd8-4831-9b2b-adc5fac01b85']",
			"illustration_id": null,
			"border_color": "black",
			"frame": "2015",
			"full_art": "false",
			"textless": "false",
			"booster": "false",
			"story_spotlight": "false",
			"edhrec_rank": "9578",
			"penny_rank": null,
			"prices": {
				"usd": null,
				"usd_foil": "9.78",
				"usd_etched": null,
				"eur": null,
				"eur_foil": "5.85",
				"tix": null
			},
			"related_uris": {
				"tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Hidetsugu+Consumes+All+%2F%2F+Vessel+of+the+All-Consuming&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Hidetsugu+Consumes+All+%2F%2F+Vessel+of+the+All-Consuming&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"edhrec": "https://edhrec.com/route/?cc=Hidetsugu+Consumes+All"
			},
			"promo_types": "['prerelease', 'datestamped']",
			"arena_id": null,
			"security_stamp": "oval",
			"produced_mana": null,
			"watermark": null,
			"frame_effects": null,
			"loyalty": null,
			"printed_name": null,
			"card_faces": [
				{
					"object": "card_face",
					"name": "Hidetsugu Consumes All",
					"mana_cost": "{1}{B}{R}",
					"type_line": "Enchantment — Saga",
					"oracle_text": "(As this Saga enters and after your draw step, add a lore counter.)\nI — Destroy each nonland permanent with mana value 1 or less.\nII — Exile all graveyards.\nIII — Exile this Saga, then return it to the battlefield transformed under your control.",
					"colors": [
						"B",
						"R"
					],
					"artist": "Chris Cold",
					"artist_id": "2622d22b-3fd8-4831-9b2b-adc5fac01b85",
					"illustration_id": "5b6d60b8-66e6-40ac-b923-f77c9c102dc8",
					"image_uris": {
						"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391",
						"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391",
						"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391",
						"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.png?1644863391",
						"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391",
						"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391"
					}
				},
				{
					"object": "card_face",
					"name": "Vessel of the All-Consuming",
					"flavor_name": "",
					"mana_cost": "",
					"type_line": "Enchantment Creature — Ogre Shaman",
					"oracle_text": "Trample\nWhenever Vessel of the All-Consuming deals damage, put a +1/+1 counter on it.\nWhenever Vessel of the All-Consuming deals damage to a player, if it has dealt 10 or more damage to that player this turn, they lose the game.",
					"colors": [
						"B",
						"R"
					],
					"color_indicator": [
						"B",
						"R"
					],
					"power": "3",
					"toughness": "3",
					"artist": "Chris Cold",
					"artist_id": "2622d22b-3fd8-4831-9b2b-adc5fac01b85",
					"illustration_id": "6c9f08cc-2c52-40aa-afcf-f9eeb726f495",
					"image_uris": {
						"small": "https://c1.scryfall.com/file/scryfall-cards/small/back/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391",
						"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/back/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391",
						"large": "https://c1.scryfall.com/file/scryfall-cards/large/back/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391",
						"png": "https://c1.scryfall.com/file/scryfall-cards/png/back/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.png?1644863391",
						"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/back/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391",
						"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/back/1/a/1a0d277e-cf88-4492-9f8b-1434acbfebc8.jpg?1644863391"
					}
				}
			],
			"tcgplayer_etched_id": null,
			"color_indicator": null,
			"life_modifier": null,
			"hand_modifier": null,
			"printed_type_line": null,
			"printed_text": null,
			"content_warning": null,
			"flavor_name": null,
			"variation_of": null
		},
		{
			"id": "1c000d66-500f-4a3b-bb6f-13a56f303869",
			"oracle_id": "e2b152ea-82d5-465e-8e13-3d62aacd6692",
			"multiverse_ids": "[]",
			"mtgo_id": null,
			"mtgo_foil_id": null,
			"tcgplayer_id": "137161",
			"cardmarket_id": "298998",
			"name": "Reason // Believe",
			"lang": "en",
			"released_at": "7/14/2017 0:00",
			"scryfall_uri": "https://scryfall.com/card/phou/154s/reason-believe?utm_source=api",
			"layout": "split",
			"image_uris": {
				"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/1/c/1c000d66-500f-4a3b-bb6f-13a56f303869.jpg?1562230647",
				"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/c/1c000d66-500f-4a3b-bb6f-13a56f303869.jpg?1562230647",
				"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/1/c/1c000d66-500f-4a3b-bb6f-13a56f303869.jpg?1562230647",
				"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/1/c/1c000d66-500f-4a3b-bb6f-13a56f303869.png?1562230647",
				"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/1/c/1c000d66-500f-4a3b-bb6f-13a56f303869.jpg?1562230647",
				"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/1/c/1c000d66-500f-4a3b-bb6f-13a56f303869.jpg?1562230647"
			},
			"mana_cost": "{U} // {4}{G}",
			"cmc": "6",
			"type_one": "Sorcery",
			"subtype_one": null,
			"type_two": "Sorcery",
			"subtype_two": null,
			"oracle_text": null,
			"power": null,
			"toughness": null,
			"colors": "['G', 'U']",
			"color_identity": "['G', 'U']",
			"keywords": "['Aftermath', 'Scry']",
			"legalities": {
				"standard": "not_legal",
				"future": "not_legal",
				"historic": "legal",
				"gladiator": "legal",
				"pioneer": "legal",
				"explorer": "legal",
				"modern": "legal",
				"legacy": "legal",
				"pauper": "not_legal",
				"vintage": "legal",
				"penny": "not_legal",
				"commander": "legal",
				"brawl": "not_legal",
				"historicbrawl": "legal",
				"alchemy": "not_legal",
				"paupercommander": "not_legal",
				"duel": "legal",
				"oldschool": "not_legal",
				"premodern": "not_legal"
			},
			"games": "['paper']",
			"reserved": "false",
			"foil": "true",
			"nonfoil": "false",
			"finishes": "['foil']",
			"oversized": "false",
			"promo": "true",
			"reprint": "true",
			"variation": "false",
			"set_id": "220548b3-7b6a-43e0-a423-8eefe7feb1a0",
			"set_shorthand": "phou",
			"set_name": "Hour of Devastation Promos",
			"set_type": "promo",
			"scryfall_set_uri": "https://scryfall.com/sets/phou?utm_source=api",
			"rulings_uri": "https://api.scryfall.com/cards/1c000d66-500f-4a3b-bb6f-13a56f303869/rulings",
			"prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3Ae2b152ea-82d5-465e-8e13-3d62aacd6692&unique=prints",
			"collector_number": "154s",
			"digital": "false",
			"rarity": "rare",
			"flavor_text": null,
			"card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
			"artist": "Daarken",
			"artist_ids": "['e607a0d4-fc12-4c01-9e3f-501f5269b9cb']",
			"illustration_id": "e2feab71-6a93-4041-9208-4a17c7c4b376",
			"border_color": "black",
			"frame": "2015",
			"full_art": "false",
			"textless": "false",
			"booster": "false",
			"story_spotlight": "false",
			"edhrec_rank": "10037",
			"penny_rank": "4977",
			"prices": {
				"usd": null,
				"usd_foil": "0.44",
				"usd_etched": null,
				"eur": null,
				"eur_foil": "0.49",
				"tix": null
			},
			"related_uris": {
				"tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Reason+%2F%2F+Believe&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Reason+%2F%2F+Believe&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"edhrec": "https://edhrec.com/route/?cc=Reason+%2F%2F+Believe"
			},
			"promo_types": "['setpromo', 'prerelease', 'datestamped']",
			"arena_id": null,
			"security_stamp": "oval",
			"produced_mana": null,
			"watermark": null,
			"frame_effects": null,
			"loyalty": null,
			"printed_name": null,
			"card_faces": [
				{
					"object": "card_face",
					"name": "Reason",
					"mana_cost": "{U}",
					"type_line": "Sorcery",
					"oracle_text": "Scry 3.",
					"artist": "Daarken",
					"artist_id": "e607a0d4-fc12-4c01-9e3f-501f5269b9cb",
					"illustration_id": "e2feab71-6a93-4041-9208-4a17c7c4b376"
				},
				{
					"object": "card_face",
					"name": "Believe",
					"flavor_name": "",
					"mana_cost": "{4}{G}",
					"type_line": "Sorcery",
					"oracle_text": "Aftermath (Cast this spell only from your graveyard. Then exile it.)\nLook at the top card of your library. You may put it onto the battlefield if it's a creature card. If you don't, put it into your hand.",
					"artist": "Daarken",
					"artist_id": "e607a0d4-fc12-4c01-9e3f-501f5269b9cb"
				}
			],
			"tcgplayer_etched_id": null,
			"color_indicator": null,
			"life_modifier": null,
			"hand_modifier": null,
			"printed_type_line": null,
			"printed_text": null,
			"content_warning": null,
			"flavor_name": null,
			"variation_of": null
		},
		{
			"id": "76cde4a6-128d-447f-9659-ceb3b345ed33",
			"oracle_id": "393e5331-4456-4ba3-b410-bb630bb053db",
			"multiverse_ids": "[370379]",
			"mtgo_id": "48832",
			"mtgo_foil_id": "48833",
			"tcgplayer_id": "68268",
			"cardmarket_id": "261950",
			"name": "Knight of the Reliquary",
			"lang": "en",
			"released_at": "6/7/2013 0:00",
			"scryfall_uri": "https://scryfall.com/card/mma/178/knight-of-the-reliquary?utm_source=api",
			"layout": "normal",
			"image_uris": {
				"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818",
				"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818",
				"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818",
				"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.png?1561967818",
				"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818",
				"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/7/6/76cde4a6-128d-447f-9659-ceb3b345ed33.jpg?1561967818"
			},
			"mana_cost": "{1}{G}{W}",
			"cmc": "3",
			"type_one": "Creature",
			"subtype_one": "Human Knight",
			"type_two": null,
			"subtype_two": null,
			"oracle_text": "Knight of the Reliquary gets +1/+1 for each land card in your graveyard.\n{T}, Sacrifice a Forest or Plains: Search your library for a land card, put it onto the battlefield, then shuffle.",
			"power": "2",
			"toughness": "2",
			"colors": "['G', 'W']",
			"color_identity": "['G', 'W']",
			"keywords": "[]",
			"legalities": {
				"standard": "not_legal",
				"future": "not_legal",
				"historic": "legal",
				"gladiator": "legal",
				"pioneer": "not_legal",
				"explorer": "not_legal",
				"modern": "legal",
				"legacy": "legal",
				"pauper": "not_legal",
				"vintage": "legal",
				"penny": "legal",
				"commander": "legal",
				"brawl": "not_legal",
				"historicbrawl": "legal",
				"alchemy": "not_legal",
				"paupercommander": "not_legal",
				"duel": "legal",
				"oldschool": "not_legal",
				"premodern": "not_legal"
			},
			"games": "['paper', 'mtgo']",
			"reserved": "false",
			"foil": "true",
			"nonfoil": "true",
			"finishes": "['nonfoil', 'foil']",
			"oversized": "false",
			"promo": "false",
			"reprint": "true",
			"variation": "false",
			"set_id": "0b7020f2-336d-4706-9ce6-f6710b9ebd5c",
			"set_shorthand": "mma",
			"set_name": "Modern Masters",
			"set_type": "masters",
			"scryfall_set_uri": "https://scryfall.com/sets/mma?utm_source=api",
			"rulings_uri": "https://api.scryfall.com/cards/76cde4a6-128d-447f-9659-ceb3b345ed33/rulings",
			"prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A393e5331-4456-4ba3-b410-bb630bb053db&unique=prints",
			"collector_number": "178",
			"digital": "false",
			"rarity": "rare",
			"flavor_text": "\"Knowledge of Bant's landscape and ruins is a weapon that the invaders can't comprehend.\"\n�Elspeth",
			"card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
			"artist": "Michael Komarck",
			"artist_ids": "['96a53b95-fe5f-4fbb-9411-ccf4ee150aca']",
			"illustration_id": "c50ccc82-f856-4fcb-b560-b20b39dea7e7",
			"border_color": "black",
			"frame": "2003",
			"full_art": "false",
			"textless": "false",
			"booster": "true",
			"story_spotlight": "false",
			"edhrec_rank": "3955",
			"penny_rank": "1639",
			"prices": {
				"usd": "1.67",
				"usd_foil": "5.35",
				"usd_etched": null,
				"eur": "2.84",
				"eur_foil": "4.20",
				"tix": "0.06"
			},
			"related_uris": {
				"gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=370379",
				"tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Knight+of+the+Reliquary&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Knight+of+the+Reliquary&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"edhrec": "https://edhrec.com/route/?cc=Knight+of+the+Reliquary"
			},
			"promo_types": null,
			"arena_id": null,
			"security_stamp": null,
			"produced_mana": null,
			"watermark": null,
			"frame_effects": null,
			"loyalty": null,
			"printed_name": null,
			"card_faces": null,
			"tcgplayer_etched_id": null,
			"color_indicator": null,
			"life_modifier": null,
			"hand_modifier": null,
			"printed_type_line": null,
			"printed_text": null,
			"content_warning": null,
			"flavor_name": null,
			"variation_of": null
		},
		{
			"id": "934936d1-f470-47fa-ac28-344020c9fc76",
			"oracle_id": "d8a552ca-2c7b-410e-bd7e-1bb81465277a",
			"multiverse_ids": "[48399]",
			"mtgo_id": "20131",
			"mtgo_foil_id": "20132",
			"tcgplayer_id": "11487",
			"cardmarket_id": "173",
			"name": "Galvanic Key",
			"lang": "en",
			"released_at": "10/2/2003 0:00",
			"scryfall_uri": "https://scryfall.com/card/mrd/173/galvanic-key?utm_source=api",
			"layout": "normal",
			"image_uris": {
				"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/9/3/934936d1-f470-47fa-ac28-344020c9fc76.jpg?1562151443",
				"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/9/3/934936d1-f470-47fa-ac28-344020c9fc76.jpg?1562151443",
				"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/9/3/934936d1-f470-47fa-ac28-344020c9fc76.jpg?1562151443",
				"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/9/3/934936d1-f470-47fa-ac28-344020c9fc76.png?1562151443",
				"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/9/3/934936d1-f470-47fa-ac28-344020c9fc76.jpg?1562151443",
				"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/9/3/934936d1-f470-47fa-ac28-344020c9fc76.jpg?1562151443"
			},
			"mana_cost": "{2}",
			"cmc": "2",
			"type_one": "Artifact",
			"subtype_one": null,
			"type_two": null,
			"subtype_two": null,
			"oracle_text": "Flash\n{3}, {T}: Untap target artifact.",
			"power": null,
			"toughness": null,
			"colors": "[]",
			"color_identity": "[]",
			"keywords": "['Flash']",
			"legalities": {
				"standard": "not_legal",
				"future": "not_legal",
				"historic": "not_legal",
				"gladiator": "not_legal",
				"pioneer": "not_legal",
				"explorer": "not_legal",
				"modern": "legal",
				"legacy": "legal",
				"pauper": "legal",
				"vintage": "legal",
				"penny": "legal",
				"commander": "legal",
				"brawl": "not_legal",
				"historicbrawl": "not_legal",
				"alchemy": "not_legal",
				"paupercommander": "legal",
				"duel": "legal",
				"oldschool": "not_legal",
				"premodern": "not_legal"
			},
			"games": "['paper', 'mtgo']",
			"reserved": "false",
			"foil": "true",
			"nonfoil": "true",
			"finishes": "['nonfoil', 'foil']",
			"oversized": "false",
			"promo": "false",
			"reprint": "false",
			"variation": "false",
			"set_id": "1d4f90ba-8d4a-4ee5-bc2f-e2d6bffe4955",
			"set_shorthand": "mrd",
			"set_name": "Mirrodin",
			"set_type": "expansion",
			"scryfall_set_uri": "https://scryfall.com/sets/mrd?utm_source=api",
			"rulings_uri": "https://api.scryfall.com/cards/934936d1-f470-47fa-ac28-344020c9fc76/rulings",
			"prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3Ad8a552ca-2c7b-410e-bd7e-1bb81465277a&unique=prints",
			"collector_number": "173",
			"digital": "false",
			"rarity": "common",
			"flavor_text": "A solution in search of a problem.",
			"card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
			"artist": "Tony Szczudlo",
			"artist_ids": "['1952c90b-a5a7-4328-9f7c-e11064f59daf']",
			"illustration_id": "c8e44404-00ff-4af5-be40-7ee641a43932",
			"border_color": "black",
			"frame": "2003",
			"full_art": "false",
			"textless": "false",
			"booster": "true",
			"story_spotlight": "false",
			"edhrec_rank": "14236",
			"penny_rank": "9291",
			"prices": {
				"usd": "0.10",
				"usd_foil": "0.34",
				"usd_etched": null,
				"eur": "0.05",
				"eur_foil": "0.20",
				"tix": "0.02"
			},
			"related_uris": {
				"gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=48399",
				"tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Galvanic+Key&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Galvanic+Key&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"edhrec": "https://edhrec.com/route/?cc=Galvanic+Key"
			},
			"promo_types": null,
			"arena_id": null,
			"security_stamp": null,
			"produced_mana": null,
			"watermark": null,
			"frame_effects": null,
			"loyalty": null,
			"printed_name": null,
			"card_faces": null,
			"tcgplayer_etched_id": null,
			"color_indicator": null,
			"life_modifier": null,
			"hand_modifier": null,
			"printed_type_line": null,
			"printed_text": null,
			"content_warning": null,
			"flavor_name": null,
			"variation_of": null
		},
		{
			"id": "fac52739-7245-4a1c-9fee-5523d63378fd",
			"oracle_id": "0e83fba6-6a94-4c58-8ef1-d866732d5eb4",
			"multiverse_ids": "[]",
			"mtgo_id": null,
			"mtgo_foil_id": null,
			"tcgplayer_id": null,
			"cardmarket_id": null,
			"name": "Racers' Ring // Racers' Ring",
			"lang": "en",
			"released_at": "4/29/2022 0:00",
			"scryfall_uri": "https://scryfall.com/card/asnc/80s/racers-ring-racers-ring?utm_source=api",
			"layout": "art_series",
			"image_uris": null,
			"mana_cost": null,
			"cmc": "0",
			"type_one": "Card",
			"subtype_one": null,
			"type_two": "Card",
			"subtype_two": null,
			"oracle_text": null,
			"power": null,
			"toughness": null,
			"colors": null,
			"color_identity": "[]",
			"keywords": "[]",
			"legalities": {
				"standard": "not_legal",
				"future": "not_legal",
				"historic": "not_legal",
				"gladiator": "not_legal",
				"pioneer": "not_legal",
				"explorer": "not_legal",
				"modern": "not_legal",
				"legacy": "not_legal",
				"pauper": "not_legal",
				"vintage": "not_legal",
				"penny": "not_legal",
				"commander": "not_legal",
				"brawl": "not_legal",
				"historicbrawl": "not_legal",
				"alchemy": "not_legal",
				"paupercommander": "not_legal",
				"duel": "not_legal",
				"oldschool": "not_legal",
				"premodern": "not_legal"
			},
			"games": "['paper']",
			"reserved": "false",
			"foil": "true",
			"nonfoil": "true",
			"finishes": "['nonfoil', 'foil']",
			"oversized": "false",
			"promo": "false",
			"reprint": "false",
			"variation": "false",
			"set_id": "32d16b44-d39f-42af-80d8-470700c7259c",
			"set_shorthand": "asnc",
			"set_name": "New Capenna Art Series",
			"set_type": "memorabilia",
			"scryfall_set_uri": "https://scryfall.com/sets/asnc?utm_source=api",
			"rulings_uri": "https://api.scryfall.com/cards/fac52739-7245-4a1c-9fee-5523d63378fd/rulings",
			"prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A0e83fba6-6a94-4c58-8ef1-d866732d5eb4&unique=prints",
			"collector_number": "80s",
			"digital": "false",
			"rarity": "common",
			"flavor_text": null,
			"card_back_id": null,
			"artist": null,
			"artist_ids": null,
			"illustration_id": null,
			"border_color": "borderless",
			"frame": "2015",
			"full_art": "false",
			"textless": "false",
			"booster": "false",
			"story_spotlight": "false",
			"edhrec_rank": null,
			"penny_rank": null,
			"prices": {
				"usd": null,
				"usd_foil": null,
				"usd_etched": null,
				"eur": null,
				"eur_foil": null,
				"tix": null
			},
			"related_uris": {
				"tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Racers%27+Ring+%2F%2F+Racers%27+Ring&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Racers%27+Ring+%2F%2F+Racers%27+Ring&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"edhrec": "https://edhrec.com/route/?cc=Racers%27+Ring"
			},
			"promo_types": "['stamped']",
			"arena_id": null,
			"security_stamp": null,
			"produced_mana": null,
			"watermark": null,
			"frame_effects": null,
			"loyalty": null,
			"printed_name": null,
			"card_faces": [
				{
					"object": "card_face",
					"name": "Racers' Ring",
					"mana_cost": "",
					"type_line": "Card",
					"oracle_text": "",
					"colors": [],
					"image_uris": {
						"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759",
						"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759",
						"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759",
						"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.png?1650432759",
						"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759",
						"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759"
					}
				},
				{
					"object": "card_face",
					"name": "Racers' Ring",
					"flavor_name": "",
					"mana_cost": "",
					"type_line": "Card",
					"oracle_text": "",
					"colors": [],
					"image_uris": {
						"small": "https://c1.scryfall.com/file/scryfall-cards/small/back/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759",
						"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/back/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759",
						"large": "https://c1.scryfall.com/file/scryfall-cards/large/back/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759",
						"png": "https://c1.scryfall.com/file/scryfall-cards/png/back/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.png?1650432759",
						"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/back/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759",
						"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/back/f/a/fac52739-7245-4a1c-9fee-5523d63378fd.jpg?1650432759"
					}
				}
			],
			"tcgplayer_etched_id": null,
			"color_indicator": null,
			"life_modifier": null,
			"hand_modifier": null,
			"printed_type_line": null,
			"printed_text": null,
			"content_warning": null,
			"flavor_name": null,
			"variation_of": null
		},
		{
			"id": "feb4b39f-d309-49ba-b427-240b7fdc1099",
			"oracle_id": "2f8243a4-f347-4e18-9094-570b34df903b",
			"multiverse_ids": "[452976]",
			"mtgo_id": "69849",
			"mtgo_foil_id": null,
			"tcgplayer_id": "176835",
			"cardmarket_id": "364229",
			"name": "Flower // Flourish",
			"lang": "en",
			"released_at": "10/5/2018 0:00",
			"scryfall_uri": "https://scryfall.com/card/grn/226/flower-flourish?utm_source=api",
			"layout": "split",
			"image_uris": {
				"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/f/e/feb4b39f-d309-49ba-b427-240b7fdc1099.jpg?1572893991",
				"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/f/e/feb4b39f-d309-49ba-b427-240b7fdc1099.jpg?1572893991",
				"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/f/e/feb4b39f-d309-49ba-b427-240b7fdc1099.jpg?1572893991",
				"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/f/e/feb4b39f-d309-49ba-b427-240b7fdc1099.png?1572893991",
				"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/f/e/feb4b39f-d309-49ba-b427-240b7fdc1099.jpg?1572893991",
				"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/f/e/feb4b39f-d309-49ba-b427-240b7fdc1099.jpg?1572893991"
			},
			"mana_cost": "{G/W} // {4}{G}{W}",
			"cmc": "7",
			"type_one": "Sorcery",
			"subtype_one": null,
			"type_two": "Sorcery",
			"subtype_two": null,
			"oracle_text": null,
			"power": null,
			"toughness": null,
			"colors": "['G', 'W']",
			"color_identity": "['G', 'W']",
			"keywords": "[]",
			"legalities": {
				"standard": "not_legal",
				"future": "not_legal",
				"historic": "legal",
				"gladiator": "legal",
				"pioneer": "legal",
				"explorer": "legal",
				"modern": "legal",
				"legacy": "legal",
				"pauper": "not_legal",
				"vintage": "legal",
				"penny": "not_legal",
				"commander": "legal",
				"brawl": "not_legal",
				"historicbrawl": "legal",
				"alchemy": "not_legal",
				"paupercommander": "not_legal",
				"duel": "legal",
				"oldschool": "not_legal",
				"premodern": "not_legal"
			},
			"games": "['arena', 'paper', 'mtgo']",
			"reserved": "false",
			"foil": "true",
			"nonfoil": "true",
			"finishes": "['nonfoil', 'foil']",
			"oversized": "false",
			"promo": "false",
			"reprint": "false",
			"variation": "false",
			"set_id": "597c6d4a-8212-4903-a6af-12c4ae9e13f0",
			"set_shorthand": "grn",
			"set_name": "Guilds of Ravnica",
			"set_type": "expansion",
			"scryfall_set_uri": "https://scryfall.com/sets/grn?utm_source=api",
			"rulings_uri": "https://api.scryfall.com/cards/feb4b39f-d309-49ba-b427-240b7fdc1099/rulings",
			"prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A2f8243a4-f347-4e18-9094-570b34df903b&unique=prints",
			"collector_number": "226",
			"digital": "false",
			"rarity": "uncommon",
			"flavor_text": null,
			"card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
			"artist": "Dmitry Burmak",
			"artist_ids": "['9872f5c0-274a-48ce-a9ad-6f0d5654e29c']",
			"illustration_id": "8cde54b1-601f-4d32-a80a-1e14d0dc6550",
			"border_color": "black",
			"frame": "2015",
			"full_art": "false",
			"textless": "false",
			"booster": "true",
			"story_spotlight": "false",
			"edhrec_rank": "10338",
			"penny_rank": "3171",
			"prices": {
				"usd": "0.05",
				"usd_foil": "0.24",
				"usd_etched": null,
				"eur": "0.10",
				"eur_foil": "0.14",
				"tix": "0.03"
			},
			"related_uris": {
				"gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=452976",
				"tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Flower+%2F%2F+Flourish&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Flower+%2F%2F+Flourish&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
				"edhrec": "https://edhrec.com/route/?cc=Flower+%2F%2F+Flourish"
			},
			"promo_types": null,
			"arena_id": "68697",
			"security_stamp": null,
			"produced_mana": null,
			"watermark": null,
			"frame_effects": null,
			"loyalty": null,
			"printed_name": null,
			"card_faces": [
				{
					"object": "card_face",
					"name": "Flower",
					"mana_cost": "{G/W}",
					"type_line": "Sorcery",
					"oracle_text": "Search your library for a basic Forest or Plains card, reveal it, put it into your hand, then shuffle.",
					"watermark": "selesnya",
					"artist": "Dmitry Burmak",
					"artist_id": "9872f5c0-274a-48ce-a9ad-6f0d5654e29c",
					"illustration_id": "8cde54b1-601f-4d32-a80a-1e14d0dc6550"
				},
				{
					"object": "card_face",
					"name": "Flourish",
					"flavor_name": "",
					"mana_cost": "{4}{G}{W}",
					"type_line": "Sorcery",
					"oracle_text": "Creatures you control get +2/+2 until end of turn.",
					"watermark": "selesnya",
					"artist": "Dmitry Burmak",
					"artist_id": "9872f5c0-274a-48ce-a9ad-6f0d5654e29c"
				}
			],
			"tcgplayer_etched_id": null,
			"color_indicator": null,
			"life_modifier": null,
			"hand_modifier": null,
			"printed_type_line": null,
			"printed_text": null,
			"content_warning": null,
			"flavor_name": null,
			"variation_of": null
		}
	]
}
```

</details>

#### Card Limited JSON
<details>

```json
{
	"id": "d1129585-6d59-4217-9404-747a100f1e8c",
	"name": "Prismatic Lace",
	"artist": "David O'Connor",
	"border_color": "black",
	"card_faces": null,
	"cmc": "1",
	"color_identity": "['U']",
	"colors": "['U']",
	"digital": "false",
	"finishes": "['nonfoil']",
	"flavor_text": null,
	"frame": "1997",
	"frame_effects": null,
	"full_art": "false",
	"games": "['paper', 'mtgo']",
	"image_uris": {
		"small": "https://c1.scryfall.com/file/scryfall-cards/small/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925",
		"normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925",
		"large": "https://c1.scryfall.com/file/scryfall-cards/large/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925",
		"png": "https://c1.scryfall.com/file/scryfall-cards/png/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.png?1562721925",
		"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925",
		"border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/d/1/d1129585-6d59-4217-9404-747a100f1e8c.jpg?1562721925"
	},
	"lang": "en",
	"layout": "normal",
	"legalities": {
		"standard": "not_legal",
		"future": "not_legal",
		"historic": "not_legal",
		"gladiator": "not_legal",
		"pioneer": "not_legal",
		"explorer": "not_legal",
		"modern": "not_legal",
		"legacy": "legal",
		"pauper": "not_legal",
		"vintage": "legal",
		"penny": "not_legal",
		"commander": "legal",
		"brawl": "not_legal",
		"historicbrawl": "not_legal",
		"alchemy": "not_legal",
		"paupercommander": "not_legal",
		"duel": "legal",
		"oldschool": "not_legal",
		"premodern": "legal"
	},
	"mana_cost": "{U}",
	"oracle_text": "Target permanent becomes the color or colors of your choice. (This effect lasts indefinitely.)",
	"power": null,
	"prices": {
		"usd": "1.57",
		"usd_foil": null,
		"usd_etched": null,
		"eur": "2.25",
		"eur_foil": null,
		"tix": "0.35"
	},
	"produced_mana": null,
	"promo": "false",
	"rarity": "rare",
	"released_at": "10/8/1996 0:00",
	"set_name": "Mirage",
	"set_shorthand": "mir",
	"set_type": "expansion",
	"toughness": null,
	"type_one": "Instant",
	"type_two": null,
	"subtype_one": null,
	"subtype_two": null,
	"mtgo_id": "7213",
	"tcgplayer_id": "5184"
}
```

</details>

#### Deck Limited JSON
<details>

```json
{
	"id": "fe8fff8c-a5ba-474c-9776-525b6670051f",
	"name": "Ramos: Friendship Is Magic",
	"user_id": "anonymous",
	"cover_art": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/e/f/ef44324a-32bd-47e9-8fd9-258ba668de53.jpg?1661391998",
	"created": "2022-11-10T22:39:28.747",
	"format": "vintage",
	"description": "A deck about Ramos, Dragon Engine, and all of his many friends. Dakkon is kinna messed up.",
	"tags": [],
	"commander": null,
	"isValid": false,
	"containsCustom": false,
	"user_name": "anonymous"
}
```

</details>

#### User JSON
<details>

```json
{
	"id": "6a0cd1d6-1278-45d0-aa0e-419ae50add06",
	"username": "redrixx",
	"avatar": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/9/2/92fb453e-6cbe-48c6-98ef-86069791c341.jpg?1562926055",
	"bio": "ATC Developer.",
	"name": "Jamier Singleton",
	"location": "Monroe, LA",
	"favorites": {
		"cards": [
			"79324f73-25cd-477a-b4f0-fd3e1319e451",
			"41b6381f-4ff8-49e9-bf00-cfe32851318b",
			"custom-da77525f-88f5-44d3-a978-7345c05bfb0a"
		],
		"decks": [
			"0c1d393f-31d5-4234-b867-0c03a81f22a4",
			"4e331898-c5d5-4b63-9771-0e103832c33e",
			"a1d043b5-80a4-4e6c-b00c-cab6b204f64a",
			"7e8956d7-178b-4066-a88a-05a260adc4ec",
			"846797a4-4c90-4055-9949-25a6d90c48b8",
			"86ea3e31-b766-4a2c-9f76-d869dd2387bc"
		]
	}
}
```

</details>

#### Card Editor Payload
<details>

```json
{
   "id":"",
   "author":"",
   "border_color":"black",
   "cmc":"3",
   "color_identity":"['B']",
   "colors":"['B']",
   "flavor_text":"A tasteful display of text...",
   "frame":"2022",
   "frame_effects":null,
   "image_uris":{
      "png":null,
      "art_crop":null
   },
   "mana_cost":"{5}{U}{U}",
   "name":"Ace of Redrixx",
   "oracle_text":"Many wonders to behold about this one. It's custom.",
   "power":"5",
   "produced_mana":"2",
   "rarity":"mythic rare",
   "subtype_one":"Immortal",
   "toughness":"4",
   "type_one":"Legendary Artifact"
}
```

</details>

#### Deck Editor Payload
<details>

```json
{
	"deckID": "4e331898-c5d5-4b63-9771-0e103832c33e",
	"authorID": "6a0cd1d6-1278-45d0-aa0e-419ae50add06",
	"coverCard": "92fb453e-6cbe-48c6-98ef-86069791c341",
	"description": "A cool new deck description. Wicked bro.",
	"formatTag": "future",
	"title": "Deck The Halls",
	"tags": [
		"angels are trash",
		"goblins forever"
	],
	"commander": "76cde4a6-128d-447f-9659-ceb3b345ed33",
	"isValid": true,
	"cards": [
		"feb4b39f-d309-49ba-b427-240b7fdc1099",
		"fac52739-7245-4a1c-9fee-5523d63378fd",
		"934936d1-f470-47fa-ac28-344020c9fc76",
		"1c000d66-500f-4a3b-bb6f-13a56f303869",
		"1a0d277e-cf88-4492-9f8b-1434acbfebc8",
		"76cde4a6-128d-447f-9659-ceb3b345ed33"
	]
}
```
</details>

#### Advanced Search
<details>

```js
query=?artist=*&cmc=*&color_identity=*&colors=*&flavor_text=*&legalities=*&name=*&oracle_text=*&power=*&rarity=*&set_name=*&set_shorthand=*&subtype_=*&toughness=*&type=*
```
</details>

## Technologies

This project is coded in JavaScript, using a [NodeJS](https://nodejs.org/en/) variant. This project also utilizes [Supabase](https://supabase.com/) for the tables pertaining to the catalog of data. The catalog of data is courtesy of [Scryfall API](https://scryfall.com/docs/api).

## Installation

To run this project, you will need to have [NodeJS](https://nodejs.org/en/) installed on your system. Unzip the folder, open PowerShell or Bash in that folder, and run `npm install`. Then you can run `npm start` to execute the backend. Most of the requests are `POST` methods. [Postman](https://www.postman.com/) is best suited for sending requests.

## Development Setup

The URL is [http://localhost:5000](http://localhost:5000) for Postman. Many of the requests can be found above in this document.

## License

All The Cards is unofficial Fan Content permitted under the [Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy). This project is not sponsered/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast.\
©Wizards of the Coast LLC.

## Contributers

`Frontend` Tanner Hawkins\
`Frontend` Michael Lanctot\
`Backend` Jamier Singleton\
`Frontend` Noah Stephenson

## Project Status

`Beta` Stage Development.