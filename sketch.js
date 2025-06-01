let video;
let handX = 0;
let handY = 0;
let leftHandX = 0;
let leftHandY = 0;
let rightHandX = 0;
let rightHandY = 0;
let currentAnimal;
let categories = ["Bird", "Mammal", "Insect"];
let score = 0;

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

  // 顯示當前生物
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(`Animal: ${currentAnimal.name}`, width / 2, 30);
  text(`Score: ${score}`, width / 2, 60);

  // 偵測手勢
  detectHandGesture();

  // 畫出手的位置
  drawHandPosition();

  // 判斷是否將生物掃入分類區
  checkClassification();
}

function detectHandGesture() {
  video.loadPixels();
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
      }
    }
  }

  if (count > 0) {
    handX = totalX / count;
    handY = totalY / count;

    // 假設左右手分別在畫布的左半部和右半部
    if (handX < width / 2) {
      leftHandX = handX;
      leftHandY = handY;
    } else {
      rightHandX = handX;
      rightHandY = handY;
    }
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
  // 如果左手掃入左側分類區
  if (leftHandY < height && leftHandX < width / 2) {
    if (currentAnimal.category === "A") {
      score++;
      currentAnimal = getNextAnimal();
    }
  }

  // 如果右手掃入右側分類區
  if (rightHandY < height && rightHandX > width / 2) {
    if (currentAnimal.category === "B") {
      score++;
      currentAnimal = getNextAnimal();
    }
  }
}

function getNextAnimal() {
  const animals = [
    { name: "Eagle", category: "A" }, // A: Bird
    { name: "Tiger", category: "B" }, // B: Mammal
    { name: "Butterfly", category: "A" }, // A: Insect
    { name: "Dolphin", category: "B" }, // B: Mammal
    { name: "Sparrow", category: "A" }, // A: Bird
  ];
  return random(animals);
}
