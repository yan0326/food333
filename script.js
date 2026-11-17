// 1. 經典大富翁 24 格順時針路徑（從右下角 GO 出發繞一圈）
const boardData = [
  // 右下角落：起點 GO
  { id: 0, name: "起點 GO", icon: "🚩", type: "special", side: "corner", isGo: true, grid: "7 / 7" },

  // 下排（由右往左）：棕色組 & 淺藍組
  { id: 1, name: "滷肉飯", icon: "🍚", type: "restaurant", side: "bottom", color: "#8b5a2b", grid: "7 / 6", owner: null },
  { id: 2, name: "陽春麵", icon: "🍜", type: "restaurant", side: "bottom", color: "#8b5a2b", grid: "7 / 5", owner: null },
  { id: 3, name: "蛋餅豆漿", icon: "🥞", type: "restaurant", side: "bottom", color: "#38bdf8", grid: "7 / 4", owner: null },
  { id: 4, name: "飯糰早餐", icon: "🍙", type: "restaurant", side: "bottom", color: "#38bdf8", grid: "7 / 3", owner: null },
  { id: 5, name: "水煎包", icon: "🥟", type: "restaurant", side: "bottom", color: "#38bdf8", grid: "7 / 2", owner: null },

  // 左下角落
  { id: 6, name: "美食廣場", icon: "🤤", type: "special", side: "corner", grid: "7 / 1" },

  // 左排（由下往上）：粉紅組 & 橘色組
  { id: 7, name: "珍珠奶茶", icon: "🧋", type: "restaurant", side: "left", color: "#ec4899", grid: "6 / 1", owner: null },
  { id: 8, name: "雞排炸物", icon: "🍗", type: "restaurant", side: "left", color: "#ec4899", grid: "5 / 1", owner: null },
  { id: 9, name: "日式拉麵", icon: "🍥", type: "restaurant", side: "left", color: "#f97316", grid: "4 / 1", owner: null },
  { id: 10, name: "咖哩飯", icon: "🍛", type: "restaurant", side: "left", color: "#f97316", grid: "3 / 1", owner: null },
  { id: 11, name: "丼飯定食", icon: "🍱", type: "restaurant", side: "left", color: "#f97316", grid: "2 / 1", owner: null },

  // 左上角落
  { id: 12, name: "免費吃喝", icon: "🎪", type: "special", side: "corner", grid: "1 / 1" },

  // 上排（由左往右）：紅色組 & 黃色組
  { id: 13, name: "美式漢堡", icon: "🍔", type: "restaurant", side: "top", color: "#ef4444", grid: "1 / 2", owner: null },
  { id: 14, name: "義大利麵", icon: "🍝", type: "restaurant", side: "top", color: "#ef4444", grid: "1 / 3", owner: null },
  { id: 15, name: "韓式炸雞", icon: "🍖", type: "restaurant", side: "top", color: "#eab308", grid: "1 / 4", owner: null },
  { id: 16, name: "石鍋拌飯", icon: "🍲", type: "restaurant", side: "top", color: "#eab308", grid: "1 / 5", owner: null },
  { id: 17, name: "部隊鍋", icon: "🥘", type: "restaurant", side: "top", color: "#eab308", grid: "1 / 6", owner: null },

  // 右上角落
  { id: 18, name: "宵夜特區", icon: "🌙", type: "special", side: "corner", grid: "1 / 7" },

  // 右排（由上往下）：綠色組 & 深藍高級地段組
  { id: 19, name: "泰式料理", icon: "🥗", type: "restaurant", side: "right", color: "#10b981", grid: "2 / 7", owner: null },
  { id: 20, name: "港式飲茶", icon: "🫖", type: "restaurant", side: "right", color: "#10b981", grid: "3 / 7", owner: null },
  { id: 21, name: "火鍋吃到飽", icon: "🫕", type: "restaurant", side: "right", color: "#1d4ed8", grid: "4 / 7", owner: null },
  { id: 22, name: "燒肉和牛", icon: "🥩", type: "restaurant", side: "right", color: "#1d4ed8", grid: "5 / 7", owner: null },
  { id: 23, name: "日式壽司", icon: "🍣", type: "restaurant", side: "right", color: "#1d4ed8", grid: "6 / 7", owner: null }
];

// ==========================================
// 歷史推薦資料庫（LocalStorage 持久化）
// ==========================================
const STORAGE_KEY = "food_monopoly_records_v1";
let foodRecords = loadRecords();
let activeTab = "ranking"; // "ranking" | "all"
let selectedCategory = "all";

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(foodRecords));
}

// 2. 全螢幕彩帶特效系統
const fxCanvas = document.getElementById("fx-canvas");
const fxCtx = fxCanvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener("resize", () => {
  resizeCanvas();
  positionAllTokens(false);
});
resizeCanvas();

function launchConfetti() {
  const colors = ["#ef4444", "#10b981", "#3b82f6", "#eab308", "#ec4899"];
  for (let i = 0; i < 65; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1
    });
  }
}

function animateConfetti() {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  particles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35;
    p.life -= 0.018;
    fxCtx.globalAlpha = Math.max(0, p.life);
    fxCtx.fillStyle = p.color;
    fxCtx.fillRect(p.x, p.y, p.size, p.size);
    if (p.life <= 0) particles.splice(idx, 1);
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// 3. 遊戲狀態與玩家資料
const playerColors = ["#ef4444", "#2563eb", "#059669", "#7c3aed"];
let players = [
  { id: 0, name: "玩家 1", color: playerColors[0], pos: 0 },
  { id: 1, name: "玩家 2", color: playerColors[1], pos: 0 }
];
let currentPlayerIdx = 0;
let isMoving = false;
let rollCounter = 0;
let currentModalMode = null;

// 3D 骰子對應 1~6 點的旋轉角度
const faceRotations = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 0, y: 180 }
};

// 初始化經典環狀棋盤與棋子
function initGame() {
  const boardEl = document.getElementById("board");
  boardEl.querySelectorAll(".tile").forEach(el => el.remove());

  const selectEl = document.getElementById("category-select");
  selectEl.innerHTML = `<option value="all">🌟 全部美食總排行</option>`;

  boardData.forEach(tile => {
    const div = document.createElement("div");
    div.className = `tile side-${tile.side} ${tile.isGo ? "corner-go" : ""}`;
    div.id = `tile-${tile.id}`;
    div.style.gridArea = tile.grid;

    if (tile.type === "restaurant") {
      div.style.cursor = "pointer";
      div.title = `點擊查看「${tile.name}」排行榜`;
      div.innerHTML = `
        <div class="tile-color-bar" style="background:${tile.color}"></div>
        <div class="tile-body">
          <div class="tile-icon">${tile.icon}</div>
          <div class="tile-name">${tile.name}</div>
        </div>
      `;
      div.addEventListener("click", () => {
        switchToCategoryRanking(String(tile.id));
      });

      const opt = document.createElement("option");
      opt.value = String(tile.id);
      opt.textContent = `${tile.icon} ${tile.name} 排行榜`;
      selectEl.appendChild(opt);
    } else {
      div.innerHTML = `
        <div class="tile-body">
          <div class="tile-icon">${tile.icon}</div>
          <div class="tile-name">${tile.name}</div>
          ${tile.isGo ? `<span class="go-arrow">←</span>` : ""}
        </div>
      `;
    }

    boardEl.appendChild(div);
  });

  renderPlayerStatus();
  renderTokens();
  renderWall();
}

function renderPlayerStatus() {
  const statusEl = document.getElementById("player-status");
  statusEl.innerHTML = players.map((p, idx) => `
    <span class="player-pill ${idx === currentPlayerIdx ? "active" : ""}" style="background:${p.color}">
      ${p.name}
    </span>
  `).join("");
}

function renderTokens() {
  const layer = document.getElementById("token-layer");
  layer.innerHTML = "";
  players.forEach((p, idx) => {
    const token = document.createElement("div");
    token.className = "player-token";
    token.id = `token-${p.id}`;
    token.style.backgroundColor = p.color;
    token.textContent = `P${idx + 1}`;
    layer.appendChild(token);
  });
  positionAllTokens(false);
}

// 計算棋子在棋盤上的精準像素座標並平滑移動
function positionAllTokens(animateHop = false) {
  const baseOffsets = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 }
  ];

  players.forEach((p, idx) => {
    const tileEl = document.getElementById(`tile-${p.pos}`);
    const tokenEl = document.getElementById(`token-${p.id}`);
    if (!tileEl || !tokenEl) return;

    const spread = Math.min(tileEl.offsetWidth, tileEl.offsetHeight) * 0.2;
    const centerX = tileEl.offsetLeft + tileEl.offsetWidth / 2 + baseOffsets[idx].x * spread;
    const centerY = tileEl.offsetTop + tileEl.offsetHeight / 2 + baseOffsets[idx].y * spread;

    tokenEl.style.left = `${centerX}px`;
    tokenEl.style.top = `${centerY}px`;

    if (animateHop && idx === currentPlayerIdx) {
      tokenEl.classList.remove("hopping");
      void tokenEl.offsetWidth;
      tokenEl.classList.add("hopping");
    }
  });
}

// 擲 3D 雙骰
const rollBtn = document.getElementById("roll-btn");
rollBtn.addEventListener("click", async () => {
  if (isMoving) return;
  isMoving = true;
  rollBtn.disabled = true;
  rollCounter++;

  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const totalSteps = d1 + d2;

  spin3DDice("cube-1", d1, rollCounter);
  spin3DDice("cube-2", d2, rollCounter + 1);

  const player = players[currentPlayerIdx];
  document.getElementById("dice-result").textContent = `${player.name} 擲出 ${d1} + ${d2} = ${totalSteps} 步！`;

  await new Promise(r => setTimeout(r, 900));

  await movePlayerSteps(player, totalSteps);
  handleLanding(player);
});

function spin3DDice(cubeId, targetFace, spinSeed) {
  const cube = document.getElementById(cubeId);
  const rot = faceRotations[targetFace];
  const extraSpins = (spinSeed % 2 === 0 ? 720 : 1080);
  cube.style.transform = `rotateX(${rot.x + extraSpins}deg) rotateY(${rot.y + extraSpins}deg)`;
}

async function movePlayerSteps(player, steps) {
  const dir = steps >= 0 ? 1 : -1;
  const count = Math.abs(steps);

  for (let i = 0; i < count; i++) {
    player.pos = (player.pos + dir + boardData.length) % boardData.length;
    positionAllTokens(true);
    await new Promise(r => setTimeout(r, 250));
  }

  const landedTile = document.getElementById(`tile-${player.pos}`);
  landedTile.classList.remove("tile-landed");
  void landedTile.offsetWidth;
  landedTile.classList.add("tile-landed");
}

// 處理踩中格子事件（聯動自動切換右側排行榜）
function handleLanding(player) {
  const tile = boardData[player.pos];

  if (tile.type === "restaurant") {
    switchToCategoryRanking(String(tile.id));

    if (tile.owner === null) {
      openCheckinModal("buy", tile, `${player.name}，寫下「${tile.name}」的推薦餐點與評論即可佔領！`);
    } else if (tile.owner === player.id) {
      openEventModal(tile.icon, "自家地盤", `回到你佔領的【${tile.name}】，不用寫評論直接開吃！`);
    } else {
      const ownerName = players[tile.owner].name;
      openCheckinModal("toll", tile, `踩到 ${ownerName} 的地盤！請寫下「${tile.name}」的推薦餐點與評論付過路費！`);
    }
  } else {
    switchToCategoryRanking("all");
    openEventModal(tile.icon, tile.name, "安全休息站，隨心挑選想吃的料理！");
  }
}

// 開啟買地 / 過路費推薦彈窗
function openCheckinModal(mode, tile, desc) {
  currentModalMode = mode;

  document.getElementById("modal-hero").textContent = tile.icon;
  document.getElementById("modal-badge").textContent = mode === "buy" ? "🚩 佔領地盤" : "💸 支付過路費";
  document.getElementById("modal-title").textContent = tile.name;
  document.getElementById("modal-desc").textContent = desc;

  const ranked = getRankedItems(String(tile.id));
  const hintEl = document.getElementById("modal-top-hint");
  if (ranked.length > 0) {
    const top1 = ranked[0];
    hintEl.innerHTML = `👑 目前【${tile.name}】榜首：<strong>${escapeHTML(top1.foodName)}</strong>（累積 ${top1.count} 次推薦 / ${top1.likes} 👍）`;
    hintEl.classList.remove("hidden");
  } else {
    hintEl.classList.add("hidden");
  }

  const form = document.getElementById("checkin-form");
  form.reset();
  form.classList.remove("hidden");
  document.getElementById("event-actions").classList.add("hidden");
  document.getElementById("skip-btn").style.display = mode === "toll" ? "none" : "inline-block";

  document.getElementById("modal-overlay").classList.remove("hidden");
}

function openEventModal(icon, title, desc) {
  document.getElementById("modal-hero").textContent = icon;
  document.getElementById("modal-badge").textContent = "✨ 角落休息站";
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-desc").textContent = desc;

  document.getElementById("modal-top-hint").classList.add("hidden");
  document.getElementById("checkin-form").classList.add("hidden");
  document.getElementById("event-actions").classList.remove("hidden");
  document.getElementById("modal-overlay").classList.remove("hidden");
}

// 送出推薦餐點與評論
document.getElementById("checkin-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const player = players[currentPlayerIdx];
  const tile = boardData[player.pos];
  const foodName = document.getElementById("food-name").value.trim();
  const foodComment = document.getElementById("food-comment").value.trim();

  if (currentModalMode === "buy") {
    tile.owner = player.id;
    stampOwnerOnTile(tile.id, player);
  }

  const newRecord = {
    id: Date.now(),
    tileId: tile.id,
    categoryName: tile.name,
    categoryIcon: tile.icon,
    foodName: foodName,
    comment: foodComment,
    playerName: player.name,
    playerColor: player.color,
    mode: currentModalMode,
    likes: 1,
    timestamp: new Date().toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
  };

  foodRecords.unshift(newRecord);
  saveRecords();

  launchConfetti();
  switchToCategoryRanking(String(tile.id));

  document.getElementById("modal-overlay").classList.add("hidden");
  nextTurn();
});

function stampOwnerOnTile(tileId, player) {
  const tileEl = document.getElementById(`tile-${tileId}`);
  const oldStamp = tileEl.querySelector(".owner-stamp");
  if (oldStamp) oldStamp.remove();

  const stamp = document.createElement("span");
  stamp.className = "owner-stamp";
  stamp.style.backgroundColor = player.color;
  stamp.textContent = player.name;
  tileEl.appendChild(stamp);
}

document.getElementById("skip-btn").addEventListener("click", () => {
  document.getElementById("modal-overlay").classList.add("hidden");
  nextTurn();
});

document.getElementById("confirm-event-btn").addEventListener("click", () => {
  document.getElementById("modal-overlay").classList.add("hidden");
  nextTurn();
});

function nextTurn() {
  currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
  isMoving = false;
  rollBtn.disabled = false;
  renderPlayerStatus();
  document.getElementById("dice-result").textContent = `輪到 ${players[currentPlayerIdx].name}`;
}

function switchToCategoryRanking(catId) {
  activeTab = "ranking";
  selectedCategory = catId;
  document.getElementById("tab-ranking").classList.add("active");
  document.getElementById("tab-all").classList.remove("active");
  document.getElementById("category-bar").classList.remove("hidden");
  document.getElementById("category-select").value = catId;
  renderWall();
}

function getRankedItems(catId) {
  const filtered = catId === "all"
    ? foodRecords
    : foodRecords.filter(r => String(r.tileId) === String(catId));

  const map = new Map();

  filtered.forEach(rec => {
    const normalizedName = rec.foodName.trim().toLowerCase();
    const key = `${rec.tileId}__${normalizedName}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        tileId: rec.tileId,
        categoryName: rec.categoryName,
        categoryIcon: rec.categoryIcon,
        foodName: rec.foodName.trim(),
        count: 0,
        likes: 0,
        comments: [],
        latestRecordId: rec.id
      });
    }

    const item = map.get(key);
    item.count += 1;
    item.likes += (rec.likes || 0);
    item.comments.push({
      playerName: rec.playerName,
      playerColor: rec.playerColor,
      text: rec.comment,
      timestamp: rec.timestamp
    });
  });

  return Array.from(map.values()).sort((a, b) => {
    const scoreA = a.count * 2 + a.likes;
    const scoreB = b.count * 2 + b.likes;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return b.likes - a.likes;
  });
}

function renderWall() {
  const feedList = document.getElementById("feed-list");
  const titleEl = document.getElementById("wall-title");
  const subtitleEl = document.getElementById("wall-subtitle");
  const countBadge = document.getElementById("checkin-count");

  if (activeTab === "ranking") {
    const rankedItems = getRankedItems(selectedCategory);

    if (selectedCategory === "all") {
      titleEl.textContent = "🏆 總體美食排行榜";
      subtitleEl.textContent = "綜合所有分類的推薦次數與按讚人氣";
    } else {
      const tile = boardData.find(t => String(t.id) === String(selectedCategory));
      titleEl.textContent = `${tile.icon} ${tile.name} 排行榜`;
      subtitleEl.textContent = `所有玩家推薦過的「${tile.name}」人氣排名`;
    }

    countBadge.textContent = `${rankedItems.length} 家上榜`;

    if (rankedItems.length === 0) {
      feedList.innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">🍽️</div>
          <p>這個分類還沒有人推薦過！<br>快擲骰踩中它來搶下第 1 名寶座吧！</p>
        </div>`;
      return;
    }

    feedList.innerHTML = rankedItems.map((item, idx) => {
      const rank = idx + 1;
      const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
      const rankClass = rank <= 3 ? `rank-${rank}` : "";

      const commentsHtml = item.comments.slice(0, 3).map(c => `
        <div class="rank-comment-item">
          <span class="comment-author" style="color:${c.playerColor}">${escapeHTML(c.playerName)}：</span>
          <span>${escapeHTML(c.text)}</span>
        </div>
      `).join("");

      return `
        <div class="rank-card ${rankClass}">
          <div class="rank-header">
            <div class="rank-medal">${medal}</div>
            <div class="rank-info">
              <div class="rank-food-name">
                ${escapeHTML(item.foodName)}
                ${selectedCategory === "all" ? `<span class="cat-tag">${item.categoryIcon} ${item.categoryName}</span>` : ""}
              </div>
              <div class="rank-stats">
                <span>🔥 ${item.count} 次推薦</span>
                <span>•</span>
                <span>👍 ${item.likes} 人推爆</span>
              </div>
            </div>
            <button class="upvote-btn" onclick="upvoteRecord(${item.latestRecordId})" title="我也推這家！">
              👍 +1
            </button>
          </div>
          <div class="rank-comments-box">
            ${commentsHtml}
          </div>
        </div>
      `;
    }).join("");

  } else {
    titleEl.textContent = "💬 全部歷史推薦紀錄";
    subtitleEl.textContent = `共累積 ${foodRecords.length} 筆真實遊玩推薦`;
    countBadge.textContent = `${foodRecords.length} 筆`;

    if (foodRecords.length === 0) {
      feedList.innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">📝</div>
          <p>目前還沒有任何歷史紀錄，快開始遊戲吧！</p>
        </div>`;
      return;
    }

    feedList.innerHTML = foodRecords.map(rec => {
      const badgeText = rec.mode === "buy" ? "🚩 蓋章買地" : "💸 過路費推薦";
      return `
        <div class="feed-card">
          <div style="display:flex; justify-content:space-between; font-size:12.5px; color:#94a3b8;">
            <strong style="color:${rec.playerColor}">${escapeHTML(rec.playerName)}</strong>
            <span>${badgeText}・${rec.categoryIcon} ${rec.categoryName}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
            <p style="font-weight:800; font-size:15px; color:#f8fafc;">🍽️ ${escapeHTML(rec.foodName)}</p>
            <button class="upvote-btn" onclick="upvoteRecord(${rec.id})">👍 ${rec.likes || 0}</button>
          </div>
          <div class="feed-comment">💬 ${escapeHTML(rec.comment)}</div>
          <div style="text-align:right; font-size:11px; color:#64748b; margin-top:6px;">${rec.timestamp || ""}</div>
        </div>
      `;
    }).join("");
  }
}

window.upvoteRecord = function (recordId) {
  const target = foodRecords.find(r => r.id === recordId);
  if (target) {
    target.likes = (target.likes || 0) + 1;
    saveRecords();
    renderWall();
  }
};

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.getElementById("tab-ranking").addEventListener("click", () => {
  activeTab = "ranking";
  document.getElementById("tab-ranking").classList.add("active");
  document.getElementById("tab-all").classList.remove("active");
  document.getElementById("category-bar").classList.remove("hidden");
  renderWall();
});

document.getElementById("tab-all").addEventListener("click", () => {
  activeTab = "all";
  document.getElementById("tab-all").classList.add("active");
  document.getElementById("tab-ranking").classList.remove("active");
  document.getElementById("category-bar").classList.add("hidden");
  renderWall();
});

document.getElementById("category-select").addEventListener("change", (e) => {
  selectedCategory = e.target.value;
  renderWall();
});

// 頂部功能按鈕
document.getElementById("add-player-btn").addEventListener("click", () => {
  if (players.length >= 4) return alert("最多支援 4 位玩家！");
  const idx = players.length;
  players.push({ id: idx, name: `玩家 ${idx + 1}`, color: playerColors[idx], pos: 0 });
  renderPlayerStatus();
  renderTokens();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  boardData.forEach(t => { if (t.type === "restaurant") t.owner = null; });
  players.forEach(p => p.pos = 0);
  currentPlayerIdx = 0;
  isMoving = false;
  rollBtn.disabled = false;
  document.getElementById("dice-result").textContent = "輪到 玩家 1";
  switchToCategoryRanking("all");
  initGame();
});

document.getElementById("clear-history-btn").addEventListener("click", () => {
  if (confirm("確定要清空所有曾經累積的美食排行榜紀錄嗎？此動作無法復原！")) {
    foodRecords = [];
    saveRecords();
    renderWall();
  }
});

// 監聽棋盤尺寸變化，即時重新對齊棋子座標
new ResizeObserver(() => {
  positionAllTokens(false);
}).observe(document.getElementById("board"));

// 啟動遊戲
initGame();