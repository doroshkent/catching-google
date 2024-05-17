export class GameRemoteProxy {

  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter
  }

  async start() {
    this.ws = new WebSocket('ws://localhost:3001');
    this.api = new Api(this.ws)
    
    this.ws.addEventListener('message',  (wsEvent) => {
      const message = JSON.parse(wsEvent.data)
      if (message.type !== 'event') {
        return
      }
      this.eventEmitter.emit(message.eventName);
    })
    
    return new Promise((res) => {
      this.ws.addEventListener('open', res)
    })
  }

  async stop() {
  }

  movePlayer1Right() {
    this.api.remoteProcedureCall("movePlayer1Right")
  }

  movePlayer1Left() {
    this.api.remoteProcedureCall("movePlayer1Left")
  }

  movePlayer1Up() {
    this.api.remoteProcedureCall("movePlayer1Up")
  }

  movePlayer1Down() {
    this.api.remoteProcedureCall("movePlayer1Down")
  }

  movePlayer2Right() {
    this.api.remoteProcedureCall("movePlayer2Right")
  }

  movePlayer2Left() {
    this.api.remoteProcedureCall("movePlayer2Left")
  }

  movePlayer2Up() {
    this.api.remoteProcedureCall("movePlayer2Up")
  }

  movePlayer2Down() {
    this.api.remoteProcedureCall("movePlayer2Down")
  }

  async getSettings() {
    return this.api.remoteProcedureCall("getSettings")
  }

  async setSettings(newSettings) {
  }

  async getStatus() {
    return this.api.remoteProcedureCall("setSettings")
  }

  async getPlayer1() {
    return this.api.remoteProcedureCall("getPlayer1")
  }

  async getPlayer2() {
    return this.api.remoteProcedureCall("getPlayer2")
  }

  async getGoogle() {
    return this.api.remoteProcedureCall("getGoogle")
  }

  async getScore() {
    return  this.api.remoteProcedureCall("getScore")
  }
}

class Api {
  #resolvers = {}

  constructor(ws) {
    this.ws = ws

    this.ws.addEventListener('message', (event) => {
      const resultAction = JSON.parse(event.data)

      if (this.#resolvers[resultAction.procedure]?.length) {
        this.#resolvers[resultAction.procedure].shift()(resultAction.result)
      }
    })
  }

  remoteProcedureCall(procedureName) {
    return new Promise((res) => {
      this.ws.send(JSON.stringify({
        procedure: procedureName
      }))

      if (!this.#resolvers[procedureName]) {
        this.#resolvers[procedureName] = []
      }

      this.#resolvers[procedureName].push(res)
    })
  }
}
