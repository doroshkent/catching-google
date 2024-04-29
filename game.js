export class Game {
  #settings = { gridSize: { rows: 3, columns: 3 }, googleJumpInterval: 2000, pointsToWin: 5 }
  #status = 'pending' // 'pending' | 'in-process' | 'finished' | 'paused' | 'stopped'
  #player1
  #player2
  #google
  #score = {
    1: { points: 0 },
    2: { points: 0 }
  }
  #movingGoogleIntervalId

  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter
  }

  async start() {
    if (this.#status === 'pending') {
      this.#status = 'in-process'
    }
    this.#createUnits()
    this.eventEmitter.emit('update')
    this.#runMovingGoogleInterval()
  }

  async stop() {
    clearInterval(this.#movingGoogleIntervalId)
    this.#status = 'stopped';
  }

  async #finishGame() {
    clearInterval(this.#movingGoogleIntervalId)
    this.#google = new Google(new Position({ x: 0, y: 0 }))
    this.#status = 'finished';
  }

  #runMovingGoogleInterval() {
    this.#movingGoogleIntervalId = setInterval(() => {
      this.#moveGoogle()
    }, this.#settings.googleJumpInterval)
  }

  #createUnits() {
    const positions = [];
    const maxGridWidth = this.#settings.gridSize.columns
    const maxGridHeight = this.#settings.gridSize.rows

    const createPlayer = (playerNumber) => {
      const position = new Position(Position.getNotCrossedPosition(
        positions,
        maxGridWidth,
        maxGridHeight));
      positions.push(position);
      return new Player(playerNumber, position);
    }

    this.#player1 = createPlayer(1)
    this.#player2 = createPlayer(2)

    const googlePosition = new Position(Position.getNotCrossedPosition(
      positions,
      maxGridWidth,
      maxGridHeight))

    this.#google = new Google(googlePosition)
  }

  #checkBorders(player, delta) {
    const boundaryCheck = (newPosition, limit) => {
      return newPosition < 1 || newPosition > limit;
    }

    let newPosition = player.position.clone();

    if (delta.x) {
      newPosition.x += delta.x;
      return boundaryCheck(newPosition.x, this.#settings.gridSize.columns);
    }

    newPosition.y += delta.y;
    return boundaryCheck(newPosition.y, this.#settings.gridSize.rows);
  }

  #checkOtherPlayer(movingPlayer, otherPlayer, delta) {
    let newPosition = movingPlayer.position.clone()
    if (delta.x) newPosition.x += delta.x
    if (delta.y) newPosition.y += delta.y

    return newPosition.equal(otherPlayer.position)
  }

  async #checkGoogleCatching(player) {
    if (player.position.equal(this.#google.position)) {
      this.#score[player.playerNumber].points += 1
      if (this.#score[player.playerNumber].points === this.#settings.pointsToWin) {
        this.eventEmitter.emit('update')
        await this.#finishGame()
      } else {
        clearInterval(this.#movingGoogleIntervalId)
        this.#moveGoogle()
        this.#runMovingGoogleInterval()
      }
    }
  }

  #moveGoogle() {
    const googlePosition = new Position(Position.getNotCrossedPosition(
      [ this.#player1.position, this.#player2.position, this.#google.position ],
      this.#settings.gridSize.columns,
      this.#settings.gridSize.rows))

    this.#google = new Google(googlePosition)
    this.eventEmitter.emit('update')
  }

  #movePlayer(player, otherPlayer, delta) {
    const isBorder = this.#checkBorders(player, delta)
    if (isBorder) return

    const isOtherPlayer = this.#checkOtherPlayer(player, otherPlayer, delta)
    if (isOtherPlayer) return;

    if (delta.x) player.position.x += delta.x
    if (delta.y) player.position.y += delta.y
    
    this.eventEmitter.emit('update')
    this.#checkGoogleCatching(player, delta)
  }

  movePlayer1Right() {
    const delta = { x: 1 }
    this.#movePlayer(this.#player1, this.#player2, delta)
  }

  movePlayer1Left() {
    const delta = { x: -1 }
    this.#movePlayer(this.#player1, this.#player2, delta)
  }

  movePlayer1Up() {
    const delta = { y: -1 }
    this.#movePlayer(this.#player1, this.#player2, delta)
  }

  movePlayer1Down() {
    const delta = { y: 1 }
    this.#movePlayer(this.#player1, this.#player2, delta)
  }

  movePlayer2Right() {
    const delta = { x: 1 }
    this.#movePlayer(this.#player2, this.#player1, delta)
  }

  movePlayer2Left() {
    const delta = { x: -1 }
    this.#movePlayer(this.#player2, this.#player1, delta)
  }

  movePlayer2Up() {
    const delta = { y: -1 }
    this.#movePlayer(this.#player2, this.#player1, delta)
  }

  movePlayer2Down() {
    const delta = { y: 1 }
    this.#movePlayer(this.#player2, this.#player1, delta)
  }

  get settings() {
    return this.#settings
  }

  set settings(newSettings) {
    this.#settings = newSettings
  }

  get status() {
    return this.#status
  }

  get player1() {
    return this.#player1
  }

  get player2() {
    return this.#player2
  }

  get google() {
    return this.#google
  }

  get score() {
    return this.#score
  }
}

class Unit {
  constructor(position) {
    this.position = position
  }
}

class Player extends Unit {
  constructor(playerNumber, position) {
    super(position)
    this.playerNumber = playerNumber
  }
}

class Google extends Unit {
  constructor(position) {
    super(position)
  }
}

class NumberUtil {
  static getRandomNumber(max) {
    return Math.floor(1 + Math.random() * max);
  }
}

class Position {
  constructor(position) {
    this.x = position.x
    this.y = position.y
  }

  static getNotCrossedPosition(coordinates, maxX, maxY) {
    let x, y

    do {
      x = NumberUtil.getRandomNumber(maxX)
      y = NumberUtil.getRandomNumber(maxY)
    } while (
      coordinates.some(
        (c) => c.x === x && c.y === y
      ))

    return { x, y }
  }

  clone() {
    return new Position({ x: this.x, y: this.y });
  }

  equal(otherPosition) {
    return this.x === otherPosition.x && this.y === otherPosition.y;
  }
}
