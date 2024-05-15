export class GameRemoteProxy {

  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter
    this.ws = new WebSocket('ws://localhost:3001');
  }

  async start() {
  }

  async stop() {
  }

  movePlayer1Right() {
    this.ws.send('hi')
  }

  movePlayer1Left() {
  }

  movePlayer1Up() {
  }

  movePlayer1Down() {
  }

  movePlayer2Right() {
  }

  movePlayer2Left() {
  }

  movePlayer2Up() {
  }

  movePlayer2Down() {
  }

  async getSettings() {

  }

  async setSettings(newSettings) {

  }

  async getStatus() {

  }

  async getPlayer1() {

  }

  async getPlayer2() {

  }

  async getGoogle() {

  }

  async getScore() {

  }
}
