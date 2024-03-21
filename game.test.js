const { Game } = require('./game')

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

  it('should start initial game.', () => {
    const game = new Game()

    game.start()

    expect(game.status).toBe('in-process')
  })

  it('game units should have unique coordinates', () => {
    const game = new Game()

    game.settings = {gridSize: {rows: 1, columns: 3}}

    game.start()

    const units = [game.player1, game.player2, game.google]
    const coordinates = units.map(unit => unit.position)
    const uniqueCoordinates = [...new Set(coordinates)]
    expect(uniqueCoordinates.length).toBe(units.length)
  })
})
