let video;
let leftHandX = 0,
  leftHandY = 0;
let rightHandX = 0,
  rightHandY = 0;
let currentAnimal;
let score = 0;
let resultMessage = "";
let showNextQuestionTime = 0;
let remainingAnimals = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // 初始化動物清單
  remainingAnimals = getAnimalList();
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

  // 顯示當前生物或結束訊息
  if (remainingAnimals.length === 0) {
    textSize(32);
    text("恭喜玩家全部答對！", width / 2, height / 2);
    noLoop(); // 停止遊戲
    return;
  }

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

  for (let y = video.height / 2; y < video.height; y++) { // 只偵測畫布下半部
    for (let x = 0; x < video.width; x++) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      // 更精確的膚色範圍
      if (r > 150 && r < 200 && g > 100 && g < 170 && b > 50 && b < 120) {
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

  // 過濾過大的區域（可能是臉部）
  const maxHandSize = 500; // 假設手部像素數量不超過 500
  if (leftCount > 0 && leftCount < maxHandSize) {
    leftHandX = totalLeftX / leftCount;
    leftHandY = totalLeftY / leftCount;
  } else {
    leftHandX = -1; // 表示未偵測到左手
    leftHandY = -1;
  }

  if (rightCount > 0 && rightCount < maxHandSize) {
    rightHandX = totalRightX / rightCount;
    rightHandY = totalRightY / rightCount;
  } else {
    rightHandX = -1; // 表示未偵測到右手
    rightHandY = -1;
  }
}

function drawHandPosition() {
  // 畫出左手的位置
  if (leftHandX >= 0 && leftHandY >= 0) {
    fill(255, 0, 0);
    ellipse(leftHandX, leftHandY, 20, 20);
  }

  // 畫出右手的位置
  if (rightHandX >= 0 && rightHandY >= 0) {
    fill(0, 0, 255);
    ellipse(rightHandX, rightHandY, 20, 20);
  }
}

function checkClassification() {
  let correct = false;

  // 如果左手掃入左側分類區
  if (leftHandY >= 0 && leftHandY < height && leftHandX >= 0 && leftHandX < width / 2) {
    if (currentAnimal.category === "A") {
      correct = true;
    }
  }

  // 如果右手掃入右側分類區
  if (rightHandY >= 0 && rightHandY < height && rightHandX >= width / 2 && rightHandX < width) {
    if (currentAnimal.category === "B") {
      correct = true;
    }
  }

  if (correct) {
    score++;
    resultMessage = "正確!";
  } else if (
    (leftHandX >= 0 && leftHandX < width / 2) ||
    (rightHandX >= width / 2 && rightHandX < width)
  ) {
    resultMessage = "錯誤!";
  }

  if (resultMessage) {
    showNextQuestionTime = millis() + 5000; // 5 秒後顯示下一題
    setTimeout(() => {
      if (remainingAnimals.length > 0) {
        currentAnimal = getNextAnimal();
      }
      resultMessage = "";
    }, 5000);
  }
}

function getNextAnimal() {
  return remainingAnimals.splice(floor(random(remainingAnimals.length)), 1)[0];
}

function getAnimalList() {
  return [
    { name: "老鷹", category: "A" }, // A: 鳥類
    { name: "老虎", category: "B" }, // B: 哺乳類
    { name: "蝴蝶", category: "A" }, // A: 昆蟲
    { name: "海豚", category: "B" }, // B: 哺乳類
    { name: "麻雀", category: "A" }, // A: 鳥類
    { name: "企鵝", category: "A" }, // A: 鳥類
    { name: "獅子", category: "B" }, // B: 哺乳類
    { name: "蜜蜂", category: "A" }, // A: 昆蟲
    { name: "蝙蝠", category: "B" }, // B: 哺乳類
    { name: "孔雀", category: "A" }, // A: 鳥類
    { name: "袋鼠", category: "B" }, // B: 哺乳類
    { name: "螞蟻", category: "A" }, // A: 昆蟲
    { name: "鯨魚", category: "B" }, // B: 哺乳類
    { name: "鴿子", category: "A" }, // A: 鳥類
    { name: "狐狸", category: "B" }, // B: 哺乳類
    { name: "蜻蜓", category: "A" }, // A: 昆蟲
    { name: "熊貓", category: "B" }, // B: 哺乳類
    { name: "鷹", category: "A" }, // A: 鳥類
    { name: "狼", category: "B" }, // B: 哺乳類
    { name: "螢火蟲", category: "A" }, // A: 昆蟲
    { name: "斑馬", category: "B" }, // B: 哺乳類
    { name: "鸚鵡", category: "A" }, // A: 鳥類
    { name: "蝗蟲", category: "A" }, // A: 昆蟲
    { name: "黑熊", category: "B" }, // B: 哺乳類
    { name: "鴨子", category: "A" }, // A: 鳥類
  ];
}
