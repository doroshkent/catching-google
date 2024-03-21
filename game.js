class Game {
  #settings = { gridSize: { rows: 3, columns: 3 } }
  #status = 'pending'
  #player1
  #player2
  #google

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

  #createUnits() {
    const positions = [];
    const maxWidth = this.#settings.gridSize.rows
    const maxHeight = this.#settings.gridSize.columns

    const createPlayer = (playerNumber) => {
      const position = new Position(Position.getNotCrossedPosition(
        positions,
        maxWidth,
        maxHeight));
      positions.push(position);
      return new Player(playerNumber, position);
    }

    const googlePosition = new Position(new Position(Position.getNotCrossedPosition(
      positions,
      maxWidth,
      maxHeight)))

    this.#player1 = createPlayer(1)
    this.#player2 = createPlayer(2)
    this.#google = new Google(googlePosition)
  }

  start() {
    if (this.#status === 'pending') {
      this.#status = 'in-process'
    }
    this.#createUnits()
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
  constructor(obj) {
    this.x = obj.x
    this.y = obj.y
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
}

module.exports = {
  Game
}
