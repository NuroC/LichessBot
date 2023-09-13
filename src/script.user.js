// ==UserScript==
// @name         Lichess Bot
// @description  Fully automated lichess bot
// @author       NuroC, t0gepi
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/NuroC/stockfish.js/stockfish.js
// ==/UserScript==

let chessEngine;
let moves = [];
let bestMove;
let webSocketWrapper = null;

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
}

function interceptWebSocket() {
    let webSocket = window.WebSocket;
    const webSocketProxy = new Proxy(webSocket, {
        construct: function (target, args) {
            let wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                let message = JSON.parse(event.data);
                console.log(message)
                if (message.d && typeof message.d.fen === "string") {
                    if(message.t && message.t == "move" && message.d.uci) {
                        if(message.d.castle) {
                            moves.push(message.d.castle.king[0] + message.d.castle.king[1]);
                        }
                        else{
                            moves.push(message.d.uci);
                        }
                    }
                    if(typeof message.v === "number") {
                        calculateMove();
                    }
                }
            });
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

function calculateMove() {
    chessEngine.postMessage("position startpos moves " + moves.join(' '));
    chessEngine.postMessage("go depth 6");
}

function setupChessEngineOnMessage() {
    chessEngine.onmessage = function (event) {
        if (event && event.includes("bestmove")) {
            bestMove = event.split(" ")[1];
            webSocketWrapper.send(JSON.stringify({
                t: "move",
                d: { u: bestMove, b: 1, l: 100, a: 1 }
            }));
        }
    };
}

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
