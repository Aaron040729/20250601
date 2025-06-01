let video;
let currentQuestion;
let answer = null;
let handRaised = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  currentQuestion = getNextQuestion();
}

function draw() {
  background(220);
  image(video, 0, 0);

  fill(0);
  textSize(24);
  text(`Question: ${currentQuestion.question}`, 10, 30);

  if (answer !== null) {
    text(`Your Answer: ${answer}`, 10, 60);
    if (checkAnswer(currentQuestion, answer)) {
      text('Correct!', 10, 90);
      currentQuestion = getNextQuestion();
      answer = null;
    } else {
      text('Try Again!', 10, 90);
    }
  }

  detectHandGesture();
}

function detectHandGesture() {
  // 偵測手勢的邏輯（簡化版）
  // 假設玩家的手在畫面中央，並根據手的高度來模擬手勢數字
  let handX = mouseX; // 模擬手的位置（用滑鼠代替）
  let handY = mouseY;

  fill(255, 0, 0);
  ellipse(handX, handY, 20, 20); // 畫出手的位置

  // 偵測手是否舉起（手在畫布上半部）
  if (handY < height / 2) {
    if (!handRaised) {
      handRaised = true;
      answer = floor(map(handX, 0, width, 0, 10)); // 根據 X 座標模擬手勢數字
    }
  } else {
    handRaised = false;
  }
}

function checkAnswer(question, playerAnswer) {
  return question.answer === playerAnswer;
}

function getNextQuestion() {
  const num1 = floor(random(1, 6));
  const num2 = floor(random(1, 6));
  const isAddition = random() > 0.5;

  return {
    question: isAddition ? `${num1} + ${num2}` : `${num1} - ${num2}`,
    answer: isAddition ? num1 + num2 : num1 - num2,
  };
}
