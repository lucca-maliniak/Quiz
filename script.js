let category = document.querySelector("[category]")
let nQuestions = document.querySelector("[nQuestions]")
let difficulty = document.querySelector("[difficulty]")
const startGameBtn = document.querySelector("[startGame]")
const mainSection = document.querySelector("[mainSection]")
let quantQuestoes = 0
let currentScore = 0
let highScore = 0
let jsonAPI

function setData(type, e) {
    if(type == 'category') category = e.target.value
    else if (type == 'questions') quantQuestoes = e.target.value
    else difficulty = e.target.value
}

async function loadData() {
    const url = `https://opentdb.com/api_category.php`
    const response = await fetch(url)
    const json = await response.json()
    json.trivia_categories.forEach(cat => {
        const option = document.createElement('option')
        option.value = cat.id
        option.textContent = cat.name
        category.appendChild(option)
    })
}

async function startGame() {
    quantQuestoes = quantQuestoes == 0 ? 10 : quantQuestoes  
    try {
        const url = `https://opentdb.com/api.php?amount=${quantQuestoes}&category=${category}&difficulty=${difficulty}&type=multiple`
        const response = await fetch(url)
        const json = await response.json()
        let randomQuestions = json.results[0].incorrect_answers
        let correctAnswer = json.results[0].correct_answer
        randomQuestions.push(correctAnswer)
        randomQuestions = randomQuestions.sort()
        mainSection.innerHTML = `
        <div class="game-main">
            <div class="info-game">
                <div class="currentQuestion">
                    Question ${0 + 1}/${quantQuestoes}    
                </div>
                <div class="currentScore">
                    Current Score: ${currentScore}
                </div>
                <div class="highScore">
                    High Score: ${highScore}
                </div>
            </div>
            <div class="info-question">    
                <span class="title-question">${json.results[0].question}</span>
                <button class="btnAnswer" onclick="answerVerify(this, '${correctAnswer}')" buttonResp>${randomQuestions[0]}</button>
                <button class="btnAnswer" onclick="answerVerify(this, '${correctAnswer}')" buttonResp>${randomQuestions[0 + 1]}</button>
                <button class="btnAnswer" onclick="answerVerify(this, '${correctAnswer}')" buttonResp>${randomQuestions[0 + 2]}</button>
                <button class="btnAnswer" onclick="answerVerify(this, '${correctAnswer}')" buttonResp>${randomQuestions[0 + 3]}</button>
            </div>
        </div>
        `
    } catch (e) {
        console.error("Ocorreu um erro! :( \n" + e)
    }
}

function answerVerify(answer, correctAnswer) {
    const arrayButtons = Array.from(document.querySelectorAll('[buttonResp]'))
    if(answer.textContent === correctAnswer) {
        currentScore += 1000
        answer.style.backgroundColor = '#00dd00'
    } else {
        answer.style.backgroundColor = '#dd0000'
        for(let i = 0; i < arrayButtons.length; i++) {
            if(arrayButtons[i].textContent === correctAnswer) {
                arrayButtons[i].style.backgroundColor = '#00dd00'
            }
        }
    }
}

window.addEventListener('load', loadData)
category.addEventListener('change', e => setData('category', e))
nQuestions.addEventListener('change', e => setData('questions', e))
difficulty.addEventListener('change', e => setData('difficulty', e))
startGameBtn.addEventListener('click', startGame)




