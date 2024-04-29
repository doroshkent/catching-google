import { Game } from "./game";

describe('game tests', () => {
  it('should set gridSize', () => {
    const game = new Game()

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
    const game = new Game()

    expect(game.status).toBe('pending')

    await game.start()

    expect(game.status).toBe('in-process')
  })

  it('game units should have unique coordinates', async () => {
    const game = new Game()

    game.settings = { gridSize: { rows: 1, columns: 3 } }

    await game.start()

    const units = [ game.player1, game.player2, game.google ]
    const coordinates = units.map(u => u.position)
    const uniqueCoordinates = Array.from(new Set(coordinates.map(obj => JSON.stringify(obj))), str => JSON.parse(str));
    expect(uniqueCoordinates.length).toBe(units.length)
  })

  it('should check google position after jump', async () => {
    const game = new Game()
    game.settings = { gridSize: { rows: 1, columns: 3 }, googleJumpInterval: 1000 }
    await game.start()
    const prevPosition = game.google.position.clone()
    delay(1500).then(() => expect(game.google.position.equal(prevPosition)).toBeFalsy())
  })

  it('should catch google by player1 or player2 for one row', async () => {
    for (let i = 0; i < 10; i++) {
      const game = new Game()
      game.settings = {
        gridSize: { rows: 1, columns: 3 }, googleJumpInterval: 2000
      }

      await game.start()
      // possible start positions
      // p1 g p2 / p1 p2 g / p2 p1 g / p2 g p1 / g p1 p2 / g p2 p1
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
})

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
