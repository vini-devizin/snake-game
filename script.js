const screen = document.querySelector('#screen'); // pegando o elemento canvas
const ctx = screen.getContext('2d'); // pegando o contexto
const size = 30; // tamanho de cada quadrado
let direction, loopId; // variaveis vazias
const scoreText = document.querySelector('#score'); // pegando a pontuação
const finalScore = document.querySelector('#final-score > span'); // pegando a pontuação final
const restartScreen = document.querySelector('#restarte'); // pegando a tela de reiniciar
const restartButton = document.querySelector('#restart'); //  pegandoo o butão de reiniciar
const initPos = { x: 270, y: 210 } // posição inicial
let snake = [initPos]; // array que contem a posição inicial

function randomNum(max, min) { // gera um numero aleatorio
  return Math.round(Math.random() * (max - min) + min);
}

function randomPos(tam) { // gera uma posição aleatoria
  const num = randomNum(0, 600 - size);
  return Math.round(num / tam) * tam;
}

function randomColor() { // gera uma cor aleatoria
  const red = randomNum(0, 255);
  const green = randomNum(0, 255);
  const blue = randomNum(0, 255);
  return `rgb(${red}, ${green}, ${blue})`;
}

const food = { // objeto com a posição e cor da comida usando as funções anteriores
  x: randomPos(size), // posição x
  y: randomPos(size), // posição y
  color: randomColor() // cor
}

function drawFood() { // desenha a comida
  const { x, y, color } = food;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
}

function drawSnake() { // desenha a cobra
  ctx.fillStyle = 'green'; // cor da cobra
  snake.forEach((position, index) => {
    if (index == snake.length - 1) { // identifica se é a cabeça da cobra
      ctx.fillStyle = '#49bf40';
    }
    ctx.fillRect(position.x, position.y, size, size);
  })
}

function moveSnake() { // move a cobra
  if (!direction) { return null } // se não houver direção, retorna null
  const head = snake[snake.length - 1]; // pegando a posição da cabeça da cobra
  snake.shift();
  if (direction == 'right') {
    snake.push({ x: head.x + size, y: head.y });
  }
  if (direction == 'left') {
    snake.push({ x: head.x - size, y: head.y });
  }
  if (direction == 'down') {
    snake.push({ x: head.x, y: head.y + size });
  }
  if (direction == 'up') {
    snake.push({ x: head.x, y: head.y - size })
  }
}

function checkEat() { // verifica se a cobra comeu a comida
  const head = snake[snake.length - 1];
  if (head.x == food.x && head.y == food.y) {
    snake.push(head);
    let x = randomPos(size); // gera uma nova posição x
    let y = randomPos(size); // gera uma nova posição y
    while (snake.find((position) => position.x == x && position.y == y)) { // verifica se a nova posição é igual a uma posição da cobra, evitando que a comida seja gerada em cima da cobra
      x = randomPos(size); // gera a posição denovo
      y = randomPos(size); // a mesma coisa da linha acima
    }
    food.x = x; // atualiza a posição da comida
    food.y = y; // a mesma coisa da linha acima
    food.color = randomColor(); // atualiza a cor da comida
    updateScore(); // chama uma função que ainda iremos ver
  }
}

function checkCollision() { // verifica se a colisão da cobra
  const head = snake[snake.length - 1];
  const limit = screen.width - size; // limite da tela
  const wallCollision = head.x < 0 || head.x > limit || head.y < 0 || head.y > limit; // verifica se a cobra colidiu com a borda
  const selfCollision = snake.slice(0, snake.length - 1).some(position => { // verifica se a cobra colidiu com ela mesma
    return position.x === head.x && position.y === head.y;
  });
  if (wallCollision || selfCollision) { // se essa condição for atendida:
    gameOver() // chama a função de game over
  }
}

function gameOver() { // função para quando o jogador perder
  direction = undefined; // faz a cobra parar
  finalScore.innerText = scoreText.innerText;
  restartScreen.style.display = 'flex'; // faz com que a tela de reiniciar apareça
}

function updateScore() { // atualiza a pontuação
  scoreText.innerHTML = parseInt(scoreText.innerHTML) + 10;
}

function gameLoop() { // faz com que todas aquelas funções sejam executadas infinitamente
  clearInterval(loopId)
  ctx.clearRect(0, 0, screen.width, screen.height);
  drawFood();
  moveSnake();
  drawSnake();
  checkCollision();
  checkEat();
  loopId = setTimeout(() => {
    gameLoop()
  }, 300)
}


gameLoop()

document.addEventListener("keydown", ({ key }) => { // detecta quando uma tecla é pressionada
  if (key == "ArrowRight" && direction != "left") {
    direction = 'right';
  }
  if (key == "ArrowLeft" && direction != "right") {
    direction = 'left';
  }
  if (key == "ArrowDown" && direction != "up") {
    direction = 'down';
  }
  if (key == "ArrowUp" && direction != "down") {
    direction = 'up';
  }
})

restartButton.addEventListener('click', () => { // faz com que o jogador reinicie o jogo quando clicar no botão de reiniciar
  scoreText.innerHTML = 0;
  restartScreen.style.display = 'none';
  snake = [initPos];
})

// detalhe, quando o jogador perde ele ainda consegue se mexer