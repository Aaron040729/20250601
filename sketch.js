let video;
let currentQuestion;
let answer = null;
let handRaised = false;
let handX = 0;
let handY = 0;

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
  drawHandPosition();
}

function detectHandGesture() {
  // 使用影像來偵測手的位置
  video.loadPixels();
  let handDetected = false;
  let totalX = 0;
  let totalY = 0;
  let count = 0;

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      // 偵測膚色範圍 (簡單的 RGB 範圍判斷)
      if (r > 150 && g > 100 && g < 180 && b < 100) {
        totalX += x;
        totalY += y;
        count++;
        handDetected = true;
      }
    }
  }

  if (handDetected && count > 0) {
    handX = totalX / count;
    handY = totalY / count;

    // 偵測手是否舉起（手在畫布上半部）
    if (handY < height / 2) {
      if (!handRaised) {
        handRaised = true;
        answer = floor(map(handX, 0, width, 1, 5)); // 將 X 座標映射到 1 到 5
      }
    } else {
      handRaised = false;
    }
  }
}

function drawHandPosition() {
  // 畫出手的位置
  fill(255, 0, 0);
  ellipse(handX, handY, 20, 20); // 畫出手的位置
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
