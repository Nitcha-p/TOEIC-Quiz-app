const questions = [
    {
        question: "Discrepancy",
        answers: [
            { text: "ความขัดแย้ง", correct: true},
            { text: "ความมั่นคง", correct: false},
            { text: "ความสับสน", correct: false},
            { text: "ความสมดุล", correct: false},
        ]
    },
    {
        question: "Jeopardy",
        answers: [
            { text: "ความมั่งคั่ง", correct: false},
            { text: "การเสี่ยงอันตราย", correct: true},
            { text: "ความสมบูรณ์", correct: false},
            { text: "ความสบาย", correct: false},
        ]
    },
    {
        question: "Apparel",
        answers: [
            { text: "อาหาร", correct: false},
            { text: "ยานพาหนะ", correct: false},
            { text: "เครื่องแต่งกาย", correct: true},
            { text: "เครื่องประดับ", correct: false},
        ]
    },
    {
        question: "Prospective",
        answers: [
            { text: "ที่สับสน", correct: false},
            { text: "ที่ผิดพลาด", correct: false},
            { text: "ที่ไม่สามารถเชื่อถือได้", correct: false},
            { text: "ที่คาดหวังไว้", correct: true},
        ]
    },
    {
        question: "Tenant",
        answers: [
            { text: "ผู้เช่า", correct: true},
            { text: "นายจ้าง", correct: false},
            { text: "ผู้เดินทาง", correct: false},
            { text: "ผู้ให้เช่า", correct: false},
        ]
    },
    {
        question: "Testimonial",
        answers: [
            { text: "ความท้าทาย", correct: false},
            { text: "คำรับรอง", correct: true},
            { text: "การสาธิต", correct: false},
            { text: "การแสดงผล", correct: false},
        ]
    },
    {
        question: "Virtue",
        answers: [
            { text: "ความโชคร้าย", correct: false},
            { text: "ความตื่นเต้น", correct: false},
            { text: "คุณธรรม", correct: true},
            { text: "ความสะดวกสบาย", correct: false},
        ]
    },
    {
        question: "Insulate",
        answers: [
            { text: "เปิดเผย", correct: false},
            { text: "แยกออก", correct: false},
            { text: "ระบายอากาศ", correct: false},
            { text: "ป้องกันความร้อนหรือไฟฟ้า", correct: true},
        ]
    },
    {
        question: "Attest",
        answers: [
            { text: "รับรอง", correct: true},
            { text: "ระงับ", correct: false},
            { text: "ล้มเหลว", correct: false},
            { text: "ประณาม", correct: false},
        ]
    },
    {
        question: "Commemorate",
        answers: [
            { text: "รำลึกถึง", correct: true},
            { text: "ทำลาย", correct: false},
            { text: "หลีกเลี่ยง", correct: false},
            { text: "ประชุม", correct: false},
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const quizContainer = document.querySelector(".quiz");
const playerForm = document.getElementById("player-form");
const playerInfo = document.getElementById("player-info");

let currentQuestionIndex = 0;
let score = 0;
let playerData = {};

//Handle player form submission
playerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    playerData.username = document.getElementById("username").value;
    playerData.email = document.getElementById("email").value;
    
    playerInfo.style.display = "none";
    quizContainer.style.display = "block";
    
    startQuiz();
});

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){
    resetStage();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetStage(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}
function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }
    else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });  
    nextButton.style.display = "block";  
}
function showScore(){
    resetStage();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";

    //Save the result to Google Sheets
    saveToGoogleSheets();
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }
    else{
        startQuiz();
    }
});

function saveToGoogleSheets() {
    const data = {
        username: playerData.username,
        email: playerData.email,
        score: score,
        submissionDate: new Date().toLocaleString()
    };

    //Send a POST request to Google Apps Script web app
    fetch('https://script.google.com/macros/s/AKfycbzDyx5jONnu80FdIpS5N2a1TpeqvVUP7IvaEQ_Jo3za3DBO78uIdE32lPx4fGQZjj7v/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        console.log("Data saved successfully");
    }).catch(error => {
        console.error("Error:", error);
    })
}