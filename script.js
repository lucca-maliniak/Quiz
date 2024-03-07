let category = document.querySelector("[category]")
let nQuestions = document.querySelector("[nQuestions]")
let difficulty = document.querySelector("[difficulty]")
const startGameBtn = document.querySelector("[startGame]")
const mainSection = document.querySelector("[mainSection]")
const buttonRestartQuiz = document.createElement('button')

let quantQuestoes = 0
let selectedCategory = 0
let currentScore = 0
let highScore = 0
let index = 0
let jsonAntigo
let correctAnswer
let randomQuestions
let jsonAPI

function setData(type, e) {
    if(type == 'category') selectedCategory = e.target.value
    else if (type == 'questions') quantQuestoes = e.target.value
    else difficulty = e.target.value
}

async function loadData(categories) {
    const url = `https://opentdb.com/api_category.php`
    const response = await fetch(url)
    const json = await response.json()
    json.trivia_categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = cat.id
        option.textContent = cat.name
        categories.appendChild(option)
    })
}

async function fetchAPI() {
    quantQuestoes > 50 ? alert("Erro! :(\nNúmero de questões no máximo até 50") : ''
    quantQuestoes = quantQuestoes == 0 ? 10 : quantQuestoes  
    const url = `https://opentdb.com/api.php?amount=${quantQuestoes}&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`
    const response = await fetch(url)
    const json = await response.json()
    return json
}

function startGame(jsonAPI) {
    if(jsonAPI) {
        jsonAntigo = jsonAPI
    }
    randomQuestions = jsonAntigo.results[index]["incorrect_answers"]
    correctAnswer = jsonAntigo.results[index].correct_answer
    randomQuestions.push(correctAnswer)
    randomQuestions.forEach(e => e.replaceAll(/[&]|[']/gm, ""))
    randomQuestions = randomQuestions.sort()
    mainSection.innerHTML = `
    <div class="game-main">
        <div class="info-game">
            <div class="currentQuestion">
                Question ${index + 1}/${quantQuestoes}    
            </div>
            <div class="currentScore" currentScore>
                Current Score: ${currentScore}
            </div>
            <div class="highScore" highScore>
                High Score: ${highScore} 
            </div>
        </div>
        <div class="info-question" infoQuestion>    
            <span class="title-question">${jsonAntigo.results[index].question}</span>
            <button class="btnAnswer" onclick="answerVerify(this, '${correctAnswer}')" buttonResp>${randomQuestions[0]}</button>
            <button class="btnAnswer" onclick="answerVerify(this, '${correctAnswer}')" buttonResp>${randomQuestions[1]}</button>
            <button class="btnAnswer" onclick="answerVerify(this, '${correctAnswer}')" buttonResp>${randomQuestions[2]}</button>
            <button class="btnAnswer" onclick="answerVerify(this, '${correctAnswer}')" buttonResp>${randomQuestions[3]}</button>
        </div>
    </div>
    `
}

function answerVerify(answer, correctAnswer) {
    const arrayButtons = Array.from(document.querySelectorAll('[buttonResp]'))

    if(answer.textContent === correctAnswer) {
        currentScore += 1000
        answer.style.backgroundColor = '#00bb00'
        setTimeout(() => {
            index++
            startGame()
        }, 1000)
        
    } 

    if(answer.textContent !== correctAnswer) {
        answer.style.backgroundColor = '#bb0000'
        for(let i = 0; i < arrayButtons.length; i++) {
            if(arrayButtons[i].textContent === correctAnswer) {
                arrayButtons[i].style.backgroundColor = '#00bb00'
            }
        }
        let wrongAnswer = `<span class="alertWrongAnswer">Wrong! The correct answer was: ${correctAnswer}</span>`
        mainSection.innerHTML += wrongAnswer
        setTimeout(() => {
            index++
            startGame()
        }, 1000)
    }

    if((index + 1) == quantQuestoes) {
        // final do jogo 
        setTimeout(() => {
            setFinishScreen()
        }, 1000)
    }
}

function setFinishScreen() {
    const highScoreLabel = document.querySelector("[highScore]")
    const currentScoreLabel = document.querySelector("[currentScore]")
    const highScoreReturn = setHighScore()

    currentScoreLabel.innerHTML = `Current Score: ${currentScore}`
    highScoreLabel.innerHTML = `High Score: ${highScoreReturn}` 

    mainSection.innerHTML = `
    <div class="game-finished">
        <div class="final-info">
            <div class="finalScore" currentScore>
                Current Score: ${currentScore}
            </div>
            <div class="finalScore" highScore>
                High Score: ${highScore}
            </div>
            <span class="title-finish">Quiz Finished!</span>
            <button class="buttonRestartGame" onclick="restartGame()">Restart Quiz</button>
        </div>
    </div>
    `
    mainSection.style.height = "35vh"
    mainSection.style.width = "30vw"
}

function setHighScore() {
    return highScore = currentScore > highScore ? currentScore : highScore
}

function restartGame() {
    mainSection.style.height = "50vh"
    mainSection.style.width = "30vw"

    mainSection.innerHTML = `
        <div class="category">
            <label for="Category" class="title">Choose a Category: <span style="color: red;">*</span></label>
            <select class="category-types" required category>
                <option value="" class="type">Any Category</option>
            </select>
        </div>
        <div class="nQuestions">
            <label for="nQuestions" class="title">Number of Questions: <span style="color: red;">*</span></label>
            <input type="number" class="nQuestions-input" min="1" max="50" value="10" required nQuestions>
        </div>
        <div class="difficulty">
            <label for="difficulty" class="title">Select Difficulty: <span style="color: red;">*</span></label>
            <select class="difficulty-type" required difficulty>
                <option value="" class="type" >Any Difficulty</option>
                <option value="easy" class="type" >Easy</option>
                <option value="medium" class="type" >Medium</option>
                <option value="hard" class="type" >Hard</option>
            </select>
        </div>
        <div class="button-area">
            <button type="submit" class="button-start" startGame>Start Game</button>
        </div>
    `
    const categoryNovo = document.querySelector('[category]')
    setTimeout(() => {
        loadData(categoryNovo)
    }, 1000)
    categoryNovo.addEventListener('change', e => setData('category', e))
}

async function gameOn() {
    index = 0
    let jsonFetchAPI = await fetchAPI()
    startGame(jsonFetchAPI)
}

window.addEventListener('load', loadData(category))
category.addEventListener('change', e => setData('category', e))
nQuestions.addEventListener('change', e => setData('questions', e))
difficulty.addEventListener('change', e => setData('difficulty', e))

startGameBtn.addEventListener('click', async e => {
    gameOn()
})




