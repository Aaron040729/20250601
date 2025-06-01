let video;
let leftHandX = 0,
  leftHandY = 0;
let rightHandX = 0,
  rightHandY = 0;
let currentAnimal;
let score = 0;
let resultMessage = "";
let showNextQuestionTime = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  currentAnimal = getNextAnimal();
}

function draw() {
  background(220);
  image(video, 0, 0);

  // 畫出分類區
  fill(200, 100, 100, 150);
  rect(0, 0, width / 2, height); // 左側分類區 (A)
  fill(100, 100, 200, 150);
  rect(width / 2, 0, width / 2, height); // 右側分類區 (B)

  // 顯示分類標籤
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("鳥類與昆蟲", width / 4, 20); // 左側標籤
  text("哺乳類", (3 * width) / 4, 20); // 右側標籤

  // 顯示當前生物
  textSize(24);
  text(`生物: ${currentAnimal.name}`, width / 2, 50);
  text(`分數: ${score}`, width / 2, 80);

  // 顯示結果訊息
  if (resultMessage) {
    textSize(32);
    text(resultMessage, width / 2, height / 2);
  }

  // 偵測手勢
  detectHandGesture();

  // 畫出手的位置
  drawHandPosition();

  // 判斷是否將生物掃入分類區
  if (millis() > showNextQuestionTime) {
    checkClassification();
  }
}

function detectHandGesture() {
  video.loadPixels();
  let totalLeftX = 0,
    totalLeftY = 0,
    leftCount = 0;
  let totalRightX = 0,
    totalRightY = 0,
    rightCount = 0;

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      // 偵測膚色範圍 (避免偵測到臉部)
      if (r > 150 && g > 100 && g < 180 && b < 100) {
        if (x < width / 2) {
          // 左手
          totalLeftX += x;
          totalLeftY += y;
          leftCount++;
        } else {
          // 右手
          totalRightX += x;
          totalRightY += y;
          rightCount++;
        }
      }
    }
  }

  if (leftCount > 0) {
    leftHandX = totalLeftX / leftCount;
    leftHandY = totalLeftY / leftCount;
  }

  if (rightCount > 0) {
    rightHandX = totalRightX / rightCount;
    rightHandY = totalRightY / rightCount;
  }
}

function drawHandPosition() {
  // 畫出左手的位置
  fill(255, 0, 0);
  ellipse(leftHandX, leftHandY, 20, 20);

  // 畫出右手的位置
  fill(0, 0, 255);
  ellipse(rightHandX, rightHandY, 20, 20);
}

function checkClassification() {
  let correct = false;

  // 如果左手掃入左側分類區
  if (leftHandY < height && leftHandX < width / 2) {
    if (currentAnimal.category === "A") {
      correct = true;
    }
  }

  // 如果右手掃入右側分類區
  if (rightHandY < height && rightHandX > width / 2) {
    if (currentAnimal.category === "B") {
      correct = true;
    }
  }

  if (correct) {
    score++;
    resultMessage = "正確!";
  } else if (leftHandX < width / 2 || rightHandX > width / 2) {
    resultMessage = "錯誤!";
  }

  if (resultMessage) {
    showNextQuestionTime = millis() + 5000; // 5 秒後顯示下一題
    setTimeout(() => {
      currentAnimal = getNextAnimal();
      resultMessage = "";
    }, 5000);
  }
}

function getNextAnimal() {
  const animals = [
    { name: "老鷹", category: "A" }, // A: 鳥類
    { name: "老虎", category: "B" }, // B: 哺乳類
    { name: "蝴蝶", category: "A" }, // A: 昆蟲
    { name: "海豚", category: "B" }, // B: 哺乳類
    { name: "麻雀", category: "A" }, // A: 鳥類
  ];
  return random(animals);
}
