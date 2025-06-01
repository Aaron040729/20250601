let video;
let poseNet;
let currentQuestion;
let answer = null;
let handRaised = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);

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
}

function modelReady() {
  console.log('PoseNet Model Loaded');
}

function gotPoses(poses) {
  if (poses.length > 0) {
    const pose = poses[0].pose;

    // Detect raised hand (e.g., right wrist higher than right elbow)
    const rightWrist = pose.rightWrist;
    const rightElbow = pose.rightElbow;

    if (rightWrist.y < rightElbow.y) {
      if (!handRaised) {
        handRaised = true;
        answer = detectHandNumber(pose);
      }
    } else {
      handRaised = false;
    }
  }
}

function detectHandNumber(pose) {
  // Simplified logic: Use the y-coordinates of fingers to determine the number
  const landmarks = [
    pose.rightWrist,
    pose.rightIndex,
    pose.rightMiddle,
    pose.rightRing,
    pose.rightPinky,
  ];

  let count = 0;
  for (let i = 1; i < landmarks.length; i++) {
    if (landmarks[i].y < landmarks[0].y) {
      count++;
    }
  }
  return count; // Return the number of raised fingers
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
