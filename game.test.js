import { Game } from "./game";

describe('game tests', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  })

  afterEach(async () => {
    await game.stop()
  })
  it('should set gridSize', () => {
    game.settings = ({
      gridSize: {
        rows: 4,
        columns: 5
      }
    })

    const gridSize = game.settings.gridSize

    expect(gridSize.rows).toBe(4)
    expect(gridSize.columns).toBe(5)
  });

  it('should start initial game.', async () => {
    expect(game.status).toBe('pending')

    await game.start()

    expect(game.status).toBe('in-process')
  })

  it('game units should have unique coordinates', async () => {
    game.settings = { gridSize: { rows: 1, columns: 3 } }

    await game.start()

    const units = [ game.player1, game.player2, game.google ]
    const coordinates = units.map(u => u.position)
    const uniqueCoordinates = Array.from(new Set(coordinates.map(obj => JSON.stringify(obj))), str => JSON.parse(str));
    expect(uniqueCoordinates.length).toBe(units.length)
  })

  it('should check google position after jump', async () => {
    game.settings = { gridSize: { rows: 1, columns: 3 }, googleJumpInterval: 1000 }
    await game.start()
    const prevPosition = game.google.position.clone()
    delay(1500).then(() => expect(game.google.position.equal(prevPosition)).toBeFalsy())
  })

  it('should catch google by player1 or player2 for one row', async () => {
    for (let i = 0; i < 10; i++) {
      const game = new Game();
      game.settings = {
        gridSize: { rows: 1, columns: 3 }, googleJumpInterval: 2000
      }

      await game.start()

      const deltaForPlayer1 = game.google.position.x - game.player1.position.x

      const prevGooglePosition = game.google.position.clone()

      if (Math.abs(deltaForPlayer1) === 2) {
        const deltaForPlayer2 = game.google.position.x - game.player2.position.x
        if (deltaForPlayer2 > 0) game.movePlayer2Right()
        else game.movePlayer2Left()

        expect(game.score[1].points).toBe(0)
        expect(game.score[2].points).toBe(1)
      } else {
        if (deltaForPlayer1 > 0) game.movePlayer1Right()
        else game.movePlayer1Left()

        expect(game.score[1].points).toBe(1)
        expect(game.score[2].points).toBe(0)
      }

      expect(game.google.position.equal(prevGooglePosition)).toBeFalsy()
    }
  })

  it('should catch google by player1 or player2 for one column', async () => {
    for (let i = 0; i < 10; i++) {
      const game = new Game();
      game.settings = {
        gridSize: { rows: 3, columns: 1 }, googleJumpInterval: 2000
      }

      await game.start()

      const deltaForPlayer1 = game.google.position.y - game.player1.position.y

      const prevGooglePosition = game.google.position.clone()

      if (Math.abs(deltaForPlayer1) === 2) {
        const deltaForPlayer2 = game.google.position.y - game.player2.position.y
        if (deltaForPlayer2 > 0) game.movePlayer2Down()
        else game.movePlayer2Up()

        expect(game.score[1].points).toBe(0)
        expect(game.score[2].points).toBe(1)
      } else {
        if (deltaForPlayer1 > 0) game.movePlayer1Down()
        else game.movePlayer1Up()

        expect(game.score[1].points).toBe(1)
        expect(game.score[2].points).toBe(0)
      }

      expect(game.google.position.equal(prevGooglePosition)).toBeFalsy()
    }
  })

  it('should finish the game when necessary points are scored', async () => {
    game.settings = {
      gridSize: { rows: 3, columns: 1 }, googleJumpInterval: 2000, pointsToWin: 5
    }
    await game.start()
    do {
      const deltaForPlayer1 = game.google.position.y - game.player1.position.y

      if (Math.abs(deltaForPlayer1) === 2) {
        const deltaForPlayer2 = game.google.position.y - game.player2.position.y
        if (deltaForPlayer2 > 0) game.movePlayer2Down()
        else game.movePlayer2Up()
      } else {
        if (deltaForPlayer1 > 0) game.movePlayer1Down()
        else game.movePlayer1Up()
      }
    } while (game.score[1].points !== game.settings.pointsToWin && game.score[2].points !== game.settings.pointsToWin)

    expect(game.status).toBe('finished')
    expect(game.google.position).toEqual({x: 0, y: 0})
  });
})

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
