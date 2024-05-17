import { GameRemoteProxy as Game } from "./gameRemoteProxy.js";
import { EventEmitter } from "./utils/eventEmitter.js";

const eventEmitter = new EventEmitter()
const game = new Game(eventEmitter)

const results = document.createElement('div')
document.body.append(results)

const table = document.createElement('table')
document.body.append(table)

let renderCounter = 0

const render = async (counter) => {
  table.innerHTML = ''
  results.innerHTML = ''

  const score = await game.getScore()
  if (counter < renderCounter) return
  console.log(score)
  const settings = await game.getSettings()
  console.log(settings)
  const player1 = await game.getPlayer1()
  console.log(player1)
  const player2 = await game.getPlayer2()
  console.log(player2)
  const google = await game.getGoogle()
  console.log(google)

  const firstPlayerResult = document.createElement('p')
  firstPlayerResult.innerHTML = `Player 1: ${ score[1].points }`
  results.append(firstPlayerResult)

  const secondPlayerResult = document.createElement('p')
  secondPlayerResult.innerHTML = `Player 2: ${ score[2].points }`
  results.append(secondPlayerResult)

  for (let y = 1; y <= settings.gridSize.rows; y++) {
    const row = document.createElement('tr');
    for (let x = 1; x <= settings.gridSize.columns; x++) {
      const cell = document.createElement('td');

      if (player1.position.x === x && player1.position.y === y) {
        const firstPlayer = document.createElement('img')
        firstPlayer.src = 'assets/player_one.svg'
        firstPlayer.alt = 'first player'

        cell.append(firstPlayer)
      } else if (player2.position.x === x && player2.position.y === y) {
        const secondPlayer = document.createElement('img')
        secondPlayer.src = 'assets/player_two.svg'
        secondPlayer.alt = 'second player'

        cell.append(secondPlayer)
      } else if (google.position.x === x && google.position.y === y) {
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

game.eventEmitter.addEventListener('update', () => {
  renderCounter++
  render(renderCounter)
})
await game.start()
render(renderCounter)

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
