let video;
let model;
let isModelLoaded = false;
let currentAnimal;
let score = 0;
let resultMessage = "";
let showNextQuestionTime = 0;
let remainingAnimals = [];
let isWaiting = false; // 狀態鎖，防止多次觸發下一題

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // 初始化動物清單
  remainingAnimals = getAnimalList();
  currentAnimal = getNextAnimal();

  // 載入 Handtrack.js 模型
  handTrack.load().then((loadedModel) => {
    model = loadedModel;
    isModelLoaded = true;
    console.log("Handtrack.js 模型已載入");
  });
}

function draw() {
  background(220);

  // 翻轉鏡頭影像
  push();
  translate(width, 0); // 將畫布的原點移到右上角
  scale(-1, 1); // 水平翻轉影像
  image(video, 0, 0); // 繪製翻轉後的影像
  pop();

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
  if (isModelLoaded) {
    detectHandGesture();
  }
}

function detectHandGesture() {
  if (isWaiting) return; // 如果正在等待，直接返回，避免多次觸發

  model.detect(video.elt).then((predictions) => {
    let leftHandDetected = false;
    let rightHandDetected = false;

    predictions.forEach((prediction) => {
      if (prediction.label === "open") {
        const centerX = prediction.bbox[0] + prediction.bbox[2] / 2;
        const centerY = prediction.bbox[1] + prediction.bbox[3] / 2;

        if (centerX < width / 2) {
          // 左手
          leftHandDetected = true;
          fill(255, 0, 0);
          ellipse(centerX, centerY, 20, 20);
        } else {
          // 右手
          rightHandDetected = true;
          fill(0, 0, 255);
          ellipse(centerX, centerY, 20, 20);
        }
      }
    });

    if (leftHandDetected) {
      checkClassification("A");
    } else if (rightHandDetected) {
      checkClassification("B");
    }
  });
}

function checkClassification(category) {
  if (isWaiting) return; // 如果正在等待，直接返回

  let correct = false;

  if (category === "A" && currentAnimal.category === "A") {
    correct = true;
  } else if (category === "B" && currentAnimal.category === "B") {
    correct = true;
  }

  if (correct) {
    score++;
    resultMessage = "正確!";
  } else {
    resultMessage = "錯誤!";
  }

  if (resultMessage) {
    isWaiting = true; // 啟動狀態鎖
    showNextQuestionTime = millis() + 5000; // 5 秒後顯示下一題
    setTimeout(() => {
      if (remainingAnimals.length > 0) {
        currentAnimal = getNextAnimal();
      }
      resultMessage = "";
      isWaiting = false; // 解鎖狀態鎖
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
