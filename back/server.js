import { WebSocketServer } from 'ws';
import { EventEmitter } from "../utils/eventEmitter.js";
import { Game } from "../game.js";

const eventEmitter = new EventEmitter()
const game = new Game(eventEmitter)
await game.start()

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  game.eventEmitter.addEventListener('update', () => {
    const message = {
      type: 'event',
      eventName: 'update'
    }
    ws.send(JSON.stringify(message));
  })

  ws.on('message', async function message(data) {
    const action = JSON.parse(data)
    const result = await game[action.procedure]()
    const response = {
      procedure: action.procedure,
      result,
      type: 'response'
    }
    ws.send(JSON.stringify(response))
  });

  // ws.remoteProcedureCall('something');
});
