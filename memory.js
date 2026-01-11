const gameState = {
  level: 1,
  gridSize: 3,
  totalCells:9,
  minPreview: 2,
  maxPreview: 4,
  previewCount: 3,
  previewTime: 1500,
  correctCells: [],
  selectedCells: [],
  score: 0,
  inputLocked: true
};



function createGrid(size) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }
}


function pickRandomCells(count, total) {
  const selected = new Set();

  while (selected.size < count) {
    const idx = Math.floor(Math.random() * total);
    selected.add(idx);
  }

  return Array.from(selected);
}

function getRandomPreviewCount() {
  const min = gameState.minPreview;
  const max = Math.min(gameState.maxPreview, gameState.totalCells);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setupPreview() {
  gameState.previewCount = getRandomPreviewCount();
  gameState.correctCells = pickRandomCells(gameState.previewCount, gameState.totalCells);
}


function showPreview() {
  setupPreview();
  gameState.inputLocked = true;

  const cells = document.querySelectorAll(".cell");

  gameState.correctCells.forEach(i => {
    cells[i].classList.add("revealed");
  });

  setTimeout(() => {
    gameState.correctCells.forEach(i => {
      cells[i].classList.remove("revealed");
    });
    gameState.inputLocked = false;
  }, gameState.previewTime);
}


function showToast(message, color = "#2563eb") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.background = color;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}



function attachSelectedCells() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      if (gameState.inputLocked) return;
      if (gameState.selectedCells.includes(index)) return;

      gameState.selectedCells.push(index);

      if (gameState.correctCells.includes(index)) {
        cell.classList.add("correct");
      } else {
        cell.classList.add("wrong");
        showToast("Wrong cell!", "#dc2626");
        gameState.inputLocked = true;
        setTimeout(() => {
          gameOver();
        }, 1000);

        return;
      }

      if (gameState.selectedCells.length === gameState.correctCells.length) {
        showToast("Level Complete!", "#16a34a");
        gameState.inputLocked = true;

        setTimeout(() => {
          nextLevel();
        }, 1510);

      }
    });
  });
}


function nextLevelSetUp() {
  gameState.selectedCells = [];
  gameState.inputLocked = true;
  const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
      cell.classList.remove("correct", "wrong");
    });
  gameState.level += 1;
  document.getElementById("level").textContent = `${gameState.level}`;
  gameState.correctCells = [];
  gameState.score += 10;
  document.getElementById("score").textContent = `${gameState.score}`;
  gameState.maxPreview = Math.min(
    gameState.maxPreview + 1,
    gameState.totalCells - 1
  );

  if (gameState.level % 3 === 0) {
    gameState.gridSize += 1;
    gameState.totalCells = gameState.gridSize * gameState.gridSize;
  }
  if (gameState.gridSize === 5) {
    gameState.gridSize = 5;
    gameState.totalCells = gameState.gridSize * gameState.gridSize;
  }

  gameState.previewTime = Math.max(500, gameState.previewTime - 80);

}

function nextLevel() {
  // שלב 1: עדכון נתונים (בלי UI)
  nextLevelSetUp();

  // שלב 2: לוח ריק (אחרי שה־toast נעלם)
  createGrid(gameState.gridSize);
  attachSelectedCells();

  // שלב 3: פאוזה קטנה לפני preview
  setTimeout(() => {
    showPreview();
  }, 400);
}


function gameOver() {
  gameState.inputLocked = true;

  showToast(`Game Over! Final Score: ${gameState.score}`, "#b91c1c");

  setTimeout(() => {
    gameState.level = 1;
    gameState.gridSize = 3;
    gameState.totalCells = 9;
    gameState.minPreview = 2;
    gameState.maxPreview = 4;
    gameState.previewTime = 1500;
    gameState.score = 0;
    gameState.selectedCells = [];
    gameState.correctCells = [];

    document.getElementById("level").textContent = gameState.level;
    document.getElementById("score").textContent = gameState.score;

    createGrid(gameState.gridSize);
    attachSelectedCells();
  }, 1500);
}





createGrid(gameState.gridSize);
document.getElementById("startBtn").addEventListener("click", () => {
  showPreview();
  attachSelectedCells();
});