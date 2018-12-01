/*
ПРАВИЛА ИГРЫ:

- В игре 2 игрока, которые ходят по очереди. Начинает игру Игрок 1. 
- Во время своего хода игрок бросает кубик столько раз сколько захочет. Результат каждого броска добавляется в текущий счет
- Если во время своего хода игроку выпадает единица на одном из кубиков, ход переходит другому игроку
- Для того, чтобы набрать очки общего счета, игрок должен нажать холдировать. При этом очки текущего счета переходят в общий счет, а ход к другому игроку.
- Побеждает тот игрок, чей общий счет достигнет или превысит указанный в поле победный счет. По умолчанию 100 очков.
*/


var scores, roundScore, activePlayer, gamePlaying, looseScore, lastDice, popup, closeBtn;

//POPUP 
setTimeout(() => {
  popup = document.getElementById('popup-rules');
  closeBtn = document.querySelector('.closeBtn');

  popup.style.display = 'block';

  closeBtn.addEventListener('click', function() {
    popup.style.display = 'none';
  });
  window.addEventListener('click', function(e) {
    if(e.target == popup) {
      popup.style.display = 'none';
    }
  });
}, 1200);



init();

document.querySelector(".btn-roll").addEventListener("click", function() {
  if (gamePlaying) {
    var dice1 = Math.floor(Math.random() * 6) + 1; 
    var dice2 = Math.floor(Math.random() * 6) + 1; 
    document.getElementById('dice-1').style.display = 'block';
    document.getElementById('dice-2').style.display = 'block';
    document.getElementById('dice-1').src = "dice-" + dice1 + ".png";
    document.getElementById('dice-2').src = "dice-" + dice2 + ".png";
    //меняем значение атрибута scr тем самым меняем изображение в зависимости от выпавшего числа
    
    if (dice1 !== 1 && dice2 !== 1) {
        //ДОБАВЛЯЕМ СЧЕТ
        roundScore += dice1 + dice2;
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else {
        //СЛЕДУЩИЙ ИГРОК
        nextPlayer();
    }
  }
});

document.querySelector(".btn-hold").addEventListener("click", function() {
  if (gamePlaying) {
    //добавляем текущий счет в общий счет
    scores[activePlayer] += roundScore;
    //обновляем интерфейс
    document.querySelector("#score-" + activePlayer).textContent =
      scores[activePlayer];

        //БЕРЕМ ЗНАЧЕНИЕ ИЗ ФОРМЫ/////
        var input = document.querySelector('.final-score').value;
        /////////////////////
        winningScore
        ///проверяем есть ли данные в переменной/////
        if(input) {
            var winningScore = input;
        } else {
            winningScore = 100;
        }

        ////////////////

    // приверяем, победил ли игрок
    if (scores[activePlayer] >= 100) {
      //меняем имя игрока на "Победитель"!
      document.querySelector("#name-" + activePlayer).textContent = "Победитель!";
      //скрываем игральный кубик
      document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

      //убирвем класс active у игроков
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");

      //добавляем вспомогательный класс победившему игроку
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
         gamePlaying = false;
    } else {
      nextPlayer();
    }
  }
});

// выбираем html элемент по классу => присваиваем ему тип события => добавляем функцию, которая будет вызвана при срабатывания события

//переход хода другому игроку
function nextPlayer() {
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  roundScore = 0; //обнудяем счет раунда

  document.getElementById("current-0").textContent = 0;
  document.getElementById("current-1").textContent = 0;
  //обнудяем счет раунда в html

  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
  //если у html элемента есть класс active, он его убирает и наоборот

  document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
}

//НОВАЯ ИГРА

document.querySelector(".btn-new").addEventListener("click", init);


//НАЧАЛО ИГРЫ

function init() {
  scores = [0, 0]; //текущий счет обоих игроков

  roundScore = 0; //счет раунда до холдирования

  activePlayer = 0; // активный игрок 0 - игрок1 | 1 - игрок2

  gamePlaying = true;

  document.getElementById('dice-1').style.display = 'block';
  document.getElementById('dice-2').style.display = 'block';
  
  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  document.querySelector("#name-0").textContent = "Игрок 1";
  document.querySelector("#name-1").textContent = "Игрок 2";

  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");

  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");

  document.querySelector(".player-0-panel").classList.add("active");
}

//////////////////////////////////////////////////////////




