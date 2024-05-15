import { WebSocketServer } from 'ws';
import { EventEmitter } from "../utils/eventEmitter.js";
import { Game } from "../game.js";

const eventEmitter = new EventEmitter()
const game = new Game(eventEmitter)
game.eventEmitter.addEventListener('update', () => {})
await game.start()

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    ws.send(JSON.stringify(game))
  });

  // ws.send('something');
});
