import { Game } from "./game";
import { EventEmitter } from "./utils/eventEmitter";

describe('game tests', () => {
  let game;

  beforeEach(() => {
    const eventEmitter = new EventEmitter()
    game = new Game(eventEmitter)
    game.eventEmitter.addEventListener('update', () => {
    })
  })

  afterEach(async () => {
    await game.stop()
  })
  it('should set gridSize', async () => {
    game.setSettings({
      gridSize: {
        rows: 4,
        columns: 5
      }
    })

    const settings = await game.getSettings()
    const gridSize = settings.gridSize

    expect(gridSize.rows).toBe(4)
    expect(gridSize.columns).toBe(5)
  });

  it('should start initial game.', async () => {
    let status = await game.getStatus()

    expect(status).toBe('pending')

    await game.start()

    status = await game.getStatus()

    expect(status).toBe('in-process')
  })

  it('game units should have unique coordinates', async () => {
    game.setSettings({ gridSize: { rows: 1, columns: 3 } })

    await game.start()

    const player1 = await game.getPlayer1()
    const player2 = await game.getPlayer2()
    const google = await game.getGoogle()

    const units = [ player1, player2, google ]
    const coordinates = units.map(u => u.position)
    const uniqueCoordinates = Array.from(new Set(coordinates.map(obj => JSON.stringify(obj))), str => JSON.parse(str));
    expect(uniqueCoordinates.length).toBe(units.length)
  })

  it('should check google position after jump', async () => {
    game.setSettings({ gridSize: { rows: 1, columns: 4 }, googleJumpInterval: 1000 })
    await game.start()
    let google = await game.getGoogle()
    const prevPosition = google.position.clone()
    await delay(1500)
    google = await game.getGoogle()
    expect(google.position.equal(prevPosition)).toBeFalsy()
  })

  it('should catch google by player1 or player2 for one row', async () => {
    for (let i = 0; i < 10; i++) {
      const eventEmitter = new EventEmitter()
      game = new Game(eventEmitter)
      game.eventEmitter.addEventListener('update', () => {
      })
      await game.setSettings({
        gridSize: { rows: 1, columns: 3 }, googleJumpInterval: 2000
      })

      await game.start()
      let google = await game.getGoogle()
      const player1 = await game.getPlayer1()
      const player2 = await game.getPlayer2()

      const deltaForPlayer1 = google.position.x - player1.position.x

      const prevGooglePosition = google.position.clone()

      if (Math.abs(deltaForPlayer1) === 2) {
        const deltaForPlayer2 = google.position.x - player2.position.x
        if (deltaForPlayer2 > 0) game.movePlayer2Right()
        else game.movePlayer2Left()

        const score = await game.getScore()

        expect(score[1].points).toBe(0)
        expect(score[2].points).toBe(1)
      } else {
        if (deltaForPlayer1 > 0) game.movePlayer1Right()
        else game.movePlayer1Left()

        const score = await game.getScore()

        expect(score[1].points).toBe(1)
        expect(score[2].points).toBe(0)
      }

      google = await game.getGoogle()

      expect(google.position.equal(prevGooglePosition)).toBeFalsy()
    }
  })

  it('should catch google by player1 or player2 for one column', async () => {
    for (let i = 0; i < 10; i++) {
      const eventEmitter = new EventEmitter()
      game = new Game(eventEmitter)
      game.eventEmitter.addEventListener('update', () => {
      })
      await game.setSettings({
        gridSize: { rows: 3, columns: 1 }, googleJumpInterval: 2000
      })

      await game.start()

      let google = await game.getGoogle()
      const player1 = await game.getPlayer1()
      const player2 = await game.getPlayer2()

      const deltaForPlayer1 = google.position.y - player1.position.y

      const prevGooglePosition = google.position.clone()

      if (Math.abs(deltaForPlayer1) === 2) {
        const deltaForPlayer2 = google.position.y - player2.position.y
        if (deltaForPlayer2 > 0) game.movePlayer2Down()
        else game.movePlayer2Up()

        const score = await game.getScore()

        expect(score[1].points).toBe(0)
        expect(score[2].points).toBe(1)
      } else {
        if (deltaForPlayer1 > 0) game.movePlayer1Down()
        else game.movePlayer1Up()

        const score = await game.getScore()

        expect(score[1].points).toBe(1)
        expect(score[2].points).toBe(0)
      }

      google = await game.getGoogle()

      expect(google.position.equal(prevGooglePosition)).toBeFalsy()
    }
  })

  it('should finish the game when necessary points are scored', async () => {
    await game.setSettings({
      gridSize: { rows: 3, columns: 1 }, googleJumpInterval: 2000, pointsToWin: 5
    })
    await game.start()
    const settings = await game.getSettings()
    const score = await game.getScore()

    do {
      const google = await game.getGoogle()
      const player1 = await game.getPlayer1()
      const player2 = await game.getPlayer2()

      const deltaForPlayer1 = google.position.y - player1.position.y

      if (Math.abs(deltaForPlayer1) === 2) {
        const deltaForPlayer2 = google.position.y - player2.position.y
        if (deltaForPlayer2 > 0) game.movePlayer2Down()
        else game.movePlayer2Up()
      } else {
        if (deltaForPlayer1 > 0) game.movePlayer1Down()
        else game.movePlayer1Up()
      }
    } while (score[1].points !== settings.pointsToWin && score[2].points !== settings.pointsToWin)

    const google = await game.getGoogle()
    const status = await game.getStatus()

    expect(status).toBe('finished')
    expect(google.position).toEqual({ x: 0, y: 0 })
  });
})

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
