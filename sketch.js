function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
let objs = [];
let objsNum = 100;

const palette = [
  "#fbf8cc",
  "#ffcfd2",
  "#f1c0e8",
  "#a3c4f3",
  "#c0f9ecff",
  "#e0a8ffff",
  // 新增調色
  "#ffd6a5",
  "#ffd1dc",
  "#bde0fe",
  "#c7f9cc",
  "#f7b267",
  "#9ad3bc",
  "#c9c9ff"
];

// 修改選單項目陣列：在 測驗卷筆記 下新增 作品筆記
let menuItems = ["作品一", "第一單元講義", "測驗系統", "測驗卷筆記", "作品筆記", "淡江大學", "關閉作品"];
let subMenuItems = {
  "淡江大學": ["教育科技系"]
};
let subMenuLinks = {
  "教育科技系": "https://et.tku.edu.tw/"
};
let showSubMenu = false;
let hoveredMenuItem = "";

let menuW = 0;
let menuH = 0;
let menuPadding = 20;
let menuItemHeight = 36;
let selectedMenu = -1;

// 新增：背景顏色陣列與目前索引（擴充為較淺但仍偏暗的色系）
let bgColors = [
  "#1f2937", // 石板灰
  "#243a4a", // 暗藍灰
  "#35505f", // 灰藍綠
  "#3b4b58", // 中等灰藍
  "#2c3e4a", // 深石板
  "#2f4f4f", // 深灰綠
  "#405868", // 柔和藍灰
  "#4a5a6a", // 中等藍灰
  "#35566a", // 青藍
  "#25414b", // 暗青
  "#2b3b42"  // 暗鋼藍
];
let bgIndex = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);
  frameRate(60);
  noFill();

  // 使用目前背景顏色
  background(bgColors[bgIndex]);

  for (let i = 0; i < objsNum; i++) {
    objs.push(new Obj(i));
  }
}

function draw() {
  blendMode(BLEND);
  background(bgColors[bgIndex]);

  // 在背景中央加入文字
  push();
  fill(255);  // 白色文字
  textSize(48);  // 文字大小
  textAlign(CENTER, CENTER);  // 文字置中對齊
  text('淡江大學', width/2, height/2);
  
  // 新增：在淡江大學下方加入學生資訊
  textSize(24);
  text('羅紫芸414730217', width/2, height/2 + 60);
  pop();

  // 新增左側半透明選單
  drawMenu();

  blendMode(SCREEN);

  for (let i = 0; i < objs.length; i++) {
    objs[i].move();
    objs[i].display();
  }
}

// 新增函式：畫選單
function drawMenu() {
  push();
  rectMode(CORNER);
  noStroke();
  textSize(20);
  textAlign(LEFT, TOP);

  let upperW = min(width * 0.2, 300);
  let maxTextW = 0;
  for (let i = 0; i < menuItems.length; i++) {
    let w = textWidth(menuItems[i]);
    if (w > maxTextW) maxTextW = w;
  }

  let computedW = maxTextW + menuPadding * 2;
  menuW = constrain(computedW, 80, upperW);
  let menuVisible = mouseX <= 100;

  // 計算總選單高度，如果子選單顯示則增加高度
  menuH = menuPadding * 2 + menuItems.length * menuItemHeight;
  let totalMenuHeight = menuH;
  if (showSubMenu && hoveredMenuItem === "淡江大學") {
    totalMenuHeight += menuItemHeight; // 為子選單增加高度
  }

  if (!menuVisible) {
    menuW = 0;
    showSubMenu = false;
    pop();
    return;
  }

  // 繪製主選單背景
  fill(255, 220);
  rect(0, 0, menuW, totalMenuHeight);

  // 繪製主選單項目
  for (let i = 0; i < menuItems.length; i++) {
    let y = menuPadding + i * menuItemHeight;
    
    // 如果目前項目是淡江大學且有子選單顯示，則調整後續項目的位置
    if (i > menuItems.indexOf("淡江大學") && showSubMenu && hoveredMenuItem === "淡江大學") {
      y += menuItemHeight; // 為子選單騰出空間
    }
    
    // 檢查滑鼠懸停
    if (mouseX <= menuW && mouseY >= y && mouseY <= y + menuItemHeight) {
      hoveredMenuItem = menuItems[i];
      if (subMenuItems[hoveredMenuItem]) {
        showSubMenu = true;
      }
    }

    // 繪製選單項目
    if (i === selectedMenu) {
      fill(0, 100);
      rect(menuPadding - 8, y - 4, menuW - menuPadding * 2 + 16, menuItemHeight);
      fill(255);
    } else {
      fill(0, 200);
    }
    text(menuItems[i], menuPadding, y);

    // 在淡江大學下方繪製子選單
    if (menuItems[i] === "淡江大學" && showSubMenu && hoveredMenuItem === "淡江大學") {
      let subY = y + menuItemHeight;
      let subItems = subMenuItems[hoveredMenuItem];
      
      fill(0, 200);
      for (let subItem of subItems) {
        if (mouseX <= menuW && mouseY >= subY && mouseY <= subY + menuItemHeight) {
          fill(0, 100);
          rect(menuPadding - 8, subY - 4, menuW - menuPadding * 2 + 16, menuItemHeight);
          fill(0, 200);
        }
        text(subItem, menuPadding, subY);
        subY += menuItemHeight;
      }
    }
  }
  pop();
}

function mousePressed() {
  if (menuW > 0 && mouseX <= menuW && mouseY >= 0) {
    if (mouseY <= menuH) {
      let idx = Math.floor((mouseY - menuPadding) / menuItemHeight);
      if (idx >= 0 && idx < menuItems.length) {
        selectedMenu = idx;
        let selectedItem = menuItems[idx];

        if (selectedItem === "淡江大學") {
          loadOrShowIframe('https://www.tku.edu.tw/');
        } else if (selectedItem === "作品一") {
          loadOrShowIframe('https://luoluo960127-commits.github.io/20251014_2/');
        } else if (selectedItem === "第一單元講義") {
          loadOrShowIframe('https://hackmd.io/@4-xTnaJnSJ63zQwJoyuXRw/S1veKdJ3el');
        } else if (selectedItem === "測驗系統") {
          loadOrShowIframe('https://luoluo960127-commits.github.io/1104/');
        } else if (selectedItem === "測驗卷筆記") {
          loadOrShowIframe('https://hackmd.io/@4-xTnaJnSJ63zQwJoyuXRw/ryOYqywk-g');
        } else if (selectedItem === "作品筆記") {
          loadOrShowIframe('https://hackmd.io/@4-xTnaJnSJ63zQwJoyuXRw/Sy_jBxwJZe');
        } else if (selectedItem === "關閉作品") {
          let existing = document.getElementById('externalFrame');
          if (existing) existing.remove();
          selectedMenu = -1;
        }
      }
    }

    // 子選單點擊處理（若有保留）
    // 檢查子選單點擊（教育科技系）
    if (showSubMenu && hoveredMenuItem === "淡江大學") {
      let subMenuY = tkuY + menuItemHeight;
      if (mouseY >= subMenuY && mouseY <= subMenuY + menuItemHeight) {
        loadOrShowIframe('https://www.et.tku.edu.tw/Front/AboutET/10908111/Page.aspx?id=Iomt%2FIEQZrc=/');
        return;
      }
    }
  }
  
  bgIndex = (bgIndex + 1) % bgColors.length;
}

// 輔助函式：建立或顯示 iframe（寬為 80vw）
function loadOrShowIframe(url) {
  let existing = document.getElementById('externalFrame');
  if (!existing) {
    let iframe = document.createElement('iframe');
    iframe.id = 'externalFrame';
    iframe.src = url;
    
    // 基本樣式設定
    iframe.style.position = 'fixed';
    iframe.style.left = '50%';
    iframe.style.top = '50%';
    iframe.style.transform = 'translate(-50%, -50%)';
    iframe.style.width = '80vw';
    iframe.style.height = '80vh';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    
    // 新增滾動設定
    iframe.style.overflow = 'auto';  // 允許內容滾動
    iframe.scrolling = 'yes';  // 確保 iframe 可以滾動
    
    document.body.appendChild(iframe);
  } else {
    existing.style.display = 'block';
    existing.src = url;
    
    // 更新現有 iframe 的滾動設定
    existing.style.overflow = 'auto';
    existing.scrolling = 'yes';
    
    // 更新其他樣式
    existing.style.position = 'fixed';
    existing.style.left = '50%';
    existing.style.top = '50%';
    existing.style.transform = 'translate(-50%, -50%)';
    existing.style.margin = '0';
    existing.style.padding = '0';
  }
}

class Obj {
  constructor(tmpIndex) {
    this.index = tmpIndex;
    this.startX = random(width);
    this.init();
    this.goalX = this.startX + this.rangeX;
  }

  init() {
    this.rangeX = random([
      5, 5, 5, 5, 5, 5, 10, 10, 10, 20, 20, 100, 100, 100, 100, 200, 300
    ]);
    this.step = map(this.rangeX, 5, 200, 5, 30); //random(1, 20);
    this.strWeight = random(3, 30);
    this.c = color(random(palette));
    if (this.rangeX < 100) {
      this.c.setAlpha(150);
    }
    this.isOut = random(100) < 10 ? true : false;
  }

  move() {
    this.startX += this.step;
    this.goalX = this.startX + this.rangeX;

    if (this.startX > width) {
      this.init();
      this.startX = -this.rangeX;
      this.goalX = this.startX + this.rangeX;
    }
  }

  display() {
    strokeWeight(this.strWeight);
    stroke(this.c);
    noFill();
    beginShape();
    for (let x = this.startX; x <= this.goalX; x++) {
      let y = map(
        noise(
          x * 0.001,
          this.isOut ? this.index * 0.025 : this.index * 0.005,
          frameCount * 0.003
        ),
        0,
        1,
        -height * 0.25,
        height * 1.25
      );
      vertex(x, y);
    }
    endShape();
  }
}