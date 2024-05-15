import { GameRemoteProxy as Game } from "./gameRemoteProxy.js";
import { EventEmitter } from "./utils/eventEmitter.js";

const start = async () => {
  const eventEmitter = new EventEmitter()
  const game = new Game(eventEmitter)
  
  const results = document.createElement('div')
  document.body.append(results)

  const table = document.createElement('table')
  document.body.append(table)

  const render = () => {
    table.innerHTML = ''
    results.innerHTML = ''

    const firstPlayerResult = document.createElement('p')
    firstPlayerResult.innerHTML = `Player 1: ${game.score[1].points}`
    results.append(firstPlayerResult)

    const secondPlayerResult = document.createElement('p')
    secondPlayerResult.innerHTML = `Player 2: ${game.score[2].points}`
    results.append(secondPlayerResult)
    
    for (let y = 1; y <= game.settings.gridSize.rows; y++) {
      const row = document.createElement('tr');
      for (let x = 1; x <= game.settings.gridSize.columns; x++) {
        const cell = document.createElement('td');

        if (game.player1.position.x === x && game.player1.position.y === y) {
          const firstPlayer = document.createElement('img')
          firstPlayer.src = 'assets/player_one.svg'
          firstPlayer.alt = 'first player'

          cell.append(firstPlayer)
        } else if (game.player2.position.x === x && game.player2.position.y === y) {
          const secondPlayer = document.createElement('img')
          secondPlayer.src = 'assets/player_two.svg'
          secondPlayer.alt = 'second player'

          cell.append(secondPlayer)
        } else if (game.google.position.x === x && game.google.position.y === y) {
          const google = document.createElement('img')
          google.src = 'assets/google.svg'
          google.alt = 'google'

          cell.append(google)
        }
        row.append(cell);
      }
      table.append(row);
    }
  }

  game.eventEmitter.addEventListener('update', render)
  await game.start()
  
  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowUp':
        game.movePlayer1Up()
        break
      case 'ArrowDown': 
        game.movePlayer1Down()
        break
      case 'ArrowRight': 
        game.movePlayer1Right()
        break
      case 'ArrowLeft':
        game.movePlayer1Left()
        break
      case 'KeyW': 
        game.movePlayer2Up()
        break
      case 'KeyS':
        game.movePlayer2Down()
        break
      case 'KeyA':
        game.movePlayer2Left()
        break
      case 'KeyD':
        game.movePlayer2Right()
        break
    }
  })
}

start()
