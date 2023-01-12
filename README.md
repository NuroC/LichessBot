# LichessBot
A fully working 2023 Lichess auto-play Bot!

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/XFq0I-s405A/0.jpg)](https://www.youtube.com/watch?v=XFq0I-s405A)

## How to use
1. Go to [./src/script.user.js](./src/script.user.js) and copy paste the code into a new Tampermonkey script.
2. Go to [lichess.org](https://lichess.org) and create a new game.
3. After you joined, it should automatically start playing.

The bot will not make the first move, so you have to make the first move.

If you're black, you don't have to do anything, the bot will make the first move.

## How does it work?

By using the open source stockfish engine, the bot will calculate the best move for the current position and send it to the server.

I am intercepting the websocket traffic, and send the best move to the server.

## Resources
- [lichess.org](https://lichess.org)
- [stockfish](https://stockfishchess.org/)
- [stockfish.js](https://github.com/nmrugg/stockfish.js/)
- [Tampermonkey](https://www.tampermonkey.net/)


**DISCLAIMER: I am not responsible for any bans you might get.**

There is an anticheat system on lichess, and it is very likely that you will get banned if you use this bot.

This bot was made for educational purposes only, and to have fun with it or whatsoever.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.