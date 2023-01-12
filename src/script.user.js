// ==UserScript==
// @name         Lichess Bot
// @description  Fully automated lichess bot
// @author       Nuro
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/NuroC/stockfish.js/stockfish.js
// ==/UserScript==

let chessEngine;
let currentFen = "";
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
                if (message.d && typeof message.d.fen === "string" && typeof message.v === "number") {
                    currentFen = message.d.fen;

                    let isWhitesTurn = message.v % 2 == 0;
                    if (isWhitesTurn) {
                        currentFen += " w";
                    } else {
                        currentFen += " b";
                    }
                    calculateMove();
                }
            });
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

function calculateMove() {
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage("go depth 1");
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