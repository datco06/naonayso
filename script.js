/* ============================================================
   NÃO NẢY SỐ — script.js
   Cấu trúc:
   1. State (biến toàn cục)
   2. Dữ liệu (Topics & Questions)
   3. Setup & Render (Home)
   4. Leaderboard Logic
   5. Game Logic (Load, Timer, Combo, Level)
   6. Hành động game (Đúng / Sai / Lộ / Tiếp)
   7. Kết thúc game & Helpers
============================================================ */

/* ============================================================
   1. STATE — biến toàn cục
============================================================ */
let questions    = [];   
let currentQ     = 0;   
let baseTime     = 30;  
let timeLeft     = 30;  
let timerInterval = null;
let score        = 0;
let correctCount = 0;
let revealed     = false; 

// New features state
let playerName   = "";
let currentCombo = 0;
let maxCombo     = 0;
let gameLevel    = 1;
let currentLevelTime = 30;

// Hint system
let hintsAvailable = 0;  // số gợi ý hiện có
let hintUsed       = false; // đã dùng gợi ý câu này chưa

/* ============================================================
   2. DỮ LIỆU (Topics & Questions)
============================================================ */
const TOPICS = [
  {
    id: 'duoihinh',
    icon: '🖼️',
    name: 'Đuổi Hình Bắt Chữ',
    questions: [
      { img: 'img/1.png', answer: 'BÁO CÁO', hint: 'Gợi ý: Một con vật và một loại giấy', emoji: '🦊', wrongs: 'CÁO BÁO, TIN TỨC' },
      { img: 'img/2.png', answer: 'BA HOA', hint: 'Gợi ý: Số lượng và thực vật', emoji: '🌸', wrongs: 'HOA BA, ĐA HOA' },
      { img: 'img/3.png', answer: 'CUNG CẦU', hint: 'Gợi ý: Vũ khí và công trình', emoji: '🏹', wrongs: 'CẦU CUNG, BẮN CẦU' },
      { img: 'img/4.png', answer: 'CA DAO', hint: 'Gợi ý: Vật đựng nước và vũ khí', emoji: '🔪', wrongs: 'DAO CA, CẮT CỐC' },
      { img: 'img/5.png', answer: 'CÂN BẰNG', hint: 'Gợi ý: Đo lường và trạng thái', emoji: '⚖️', wrongs: 'BẰNG CÂN, CÂN ĐO' },
      { img: 'img/6.png', answer: 'MẬT MÃ', hint: 'Gợi ý: Đồ ngọt và động vật', emoji: '🍯', wrongs: 'MÃ MẬT, ONG NGỰA' },
      { img: 'img/7.png', answer: 'NEO ĐƠN', hint: 'Gợi ý: Tàu thuyền và giấy tờ', emoji: '⚓', wrongs: 'ĐƠN NEO, TÀU ĐƠN' },
      { img: 'img/8.png', answer: 'KHẨU CUNG', hint: 'Gợi ý: Bộ phận cơ thể và vũ khí', emoji: '👄', wrongs: 'CUNG KHẨU, MIỆNG BẮN' },
      { img: 'img/9.png', answer: 'GIẤY BẠC', hint: 'Gợi ý: Vật liệu và kim loại', emoji: '🧻', wrongs: 'BẠC GIẤY, TIỀN GIẤY' },
      { img: 'img/10.png', answer: 'RỒNG RẮN LÊN MÂY', hint: 'Gợi ý: Trò chơi dân gian', emoji: '🐍', wrongs: '', type: 'input', time: 60 },
      { img: 'img/11.png', answer: 'KÉO CO', hint: 'Gợi ý: Trò chơi tập thể', emoji: '🪢', wrongs: '', type: 'input', time: 60 },
      { img: 'img/12.png', answer: 'Ô ĂN QUAN', hint: 'Gợi ý: Trò chơi dân gian với ô và hạt', emoji: '🔵', wrongs: '', type: 'input', time: 60 },
      { img: 'img/13.png', answer: 'MẤY ĐỜI BÁNH ĐÚC CÓ XƯƠNG', hint: 'Gợi ý: Tục ngữ dân gian', emoji: '📜', wrongs: '', type: 'input', time: 60 },
      { img: 'img/14.png', answer: 'HỘT VỊT LỘN', hint: 'Gợi ý: Món ăn dân dã từ trứng', emoji: '🥚', wrongs: '', type: 'input', time: 60 },
      { img: 'img/15.png', answer: 'CHÂN GÀ SỐT THÁI', hint: 'Gợi ý: Món ăn vặt cay chua ngọt', emoji: '🍗', wrongs: '', type: 'input', time: 60 },
      { img: 'img/16.png', answer: 'THỊT KHO TÀU', hint: 'Gợi ý: Món kho đậm đà truyền thống', emoji: '🥩', wrongs: '', type: 'input', time: 60 },
      { img: 'img/17.png', answer: 'XOÀI SẤY DẺO', hint: 'Gợi ý: Đặc sản trái cây sấy', emoji: '🥭', wrongs: '', type: 'input', time: 60 },
      { img: 'img/18.png', answer: 'BÔNG LAN TRỨNG MUỐI', hint: 'Gợi ý: Bánh ngọt thơm béo mặn', emoji: '🎂', wrongs: '', type: 'input', time: 60 },
      { img: 'img/19.png', answer: 'NỘM ĐU ĐỦ', hint: 'Gợi ý: Món trộn chua cay từ trái cây', emoji: '🥗', wrongs: '', type: 'input', time: 60 },
      { img: 'img/20.png', answer: 'BÁNH GIÒ', hint: 'Gợi ý: Bánh gói lá, nhân thịt', emoji: '🫔', wrongs: '', type: 'input', time: 60 },
      { img: 'img/21.png', answer: 'CƠM LAM', hint: 'Gợi ý: Cơm nấu trong ống tre', emoji: '🎋', wrongs: '', type: 'input', time: 60 }
    ]
  },
  {
    id: 'marketing',
    icon: '📈',
    name: 'Marketing',
    questions: [
      { img: '', answer: 'DIGITAL MARKETING', hint: 'Chiến lược trên nền tảng số', emoji: '📱', wrongs: 'TRUYỀN THÔNG, CONTENT CREATOR, SEO' },
      { img: '', answer: 'CONTENT CREATOR',   hint: 'Người tạo nội dung',          emoji: '🎬', wrongs: 'COPYWRITER, TIKTOKER, DESIGNER' },
      { img: '', answer: 'SEO',               hint: 'Tối ưu công cụ tìm kiếm',     emoji: '🔍', wrongs: 'SEM, GOOGLE ADS, FACEBOOK ADS' },
      { img: '', answer: 'VIRAL',             hint: 'Lan truyền chóng mặt',        emoji: '🦠', wrongs: 'TRENDING, VIRUS, HOT SEARCH' },
      { img: '', answer: 'BRANDING',          hint: 'Xây dựng thương hiệu',        emoji: '🎨', wrongs: 'MARKETING, DESIGN, LOGO' }
    ]
  },
  {
    id: 'it',
    icon: '💻',
    name: 'Lập trình',
    questions: [
      { img: '', answer: 'FRONTEND',    hint: 'Giao diện người dùng',        emoji: '🎨', wrongs: 'BACKEND, FULLSTACK, DEVOPS' },
      { img: '', answer: 'BACKEND',     hint: 'Xử lý logic, cơ sở dữ liệu',  emoji: '⚙️', wrongs: 'FRONTEND, UI/UX, DATABASE' },
      { img: '', answer: 'BUG',         hint: 'Lỗi phần mềm',                emoji: '🐛', wrongs: 'FEATURE, VIRUS, GLITCH' },
      { img: '', answer: 'DATABASE',    hint: 'Nơi lưu trữ dữ liệu',         emoji: '🗄️', wrongs: 'SERVER, CLOUD, EXCEL' },
      { img: '', answer: 'ALGORITHM',   hint: 'Thuật toán giải quyết VĐ',    emoji: '🧠', wrongs: 'FLOWCHART, LOGIC, DATA TYPE' }
    ]
  },
  {
    id: 'genz',
    icon: '🔥',
    name: 'Từ khóa GenZ',
    questions: [
      { img: '', answer: 'FLEX',        hint: 'Khoe khoang sương sương',     emoji: '💪', wrongs: 'TỰ CAO, SIÊNG NĂNG, KIÊU NGẠO' },
      { img: '', answer: 'THAO TÚNG TÂM LÝ', hint: 'Điều khiển suy nghĩ',    emoji: '😵', wrongs: 'LỪA ĐẢO, GỌI HỒN, NÓI DỐI' },
      { img: '', answer: 'TRẦM CẢM',    hint: 'Mệt mỏi, áp lực',             emoji: '🌧️', wrongs: 'ĐAU ĐẦU, KIỆT SỨC, BUỒN NGỦ' },
      { img: '', answer: 'LEM TÌM',     hint: 'Cách nói lái của một cụm từ', emoji: '💕', wrongs: 'TRÁI TIM, YÊU ĐƯƠNG, HẸN HÒ' },
      { img: '', answer: 'ĂN NÓI XÀ LƠ',hint: 'Nói chuyện tào lao',          emoji: '🗣️', wrongs: 'NÓI NHIỀU, LẮM MỒM, THẢ THÍNH' }
    ]
  }
];

const CONFETTI_COLORS = ['#00f5d4', '#ff006e', '#ffd60a', '#7209b7', '#ffffff', '#ff4d00'];

const BLUR_STEPS = [
  { pct: 100, cls: 'blur-20' },
  { pct: 80,  cls: 'blur-15' },
  { pct: 60,  cls: 'blur-10' },
  { pct: 40,  cls: 'blur-6'  },
  { pct: 20,  cls: 'blur-3'  },
  { pct: 5,   cls: 'blur-0'  },
];

/* ============================================================
   3. SETUP & RENDER (HOME)
============================================================ */
function init() {
  const topic = TOPICS.find(t => t.id === 'duoihinh');
  if (topic) {
    questions = JSON.parse(JSON.stringify(topic.questions));
  }
}

function renderTopics() {
  const grid = document.getElementById('topicGrid');
  grid.innerHTML = TOPICS.map(t => `
    <div class="topic-card" onclick="loadTopic('${t.id}')">
      <div class="topic-emoji">${t.icon}</div>
      <div class="topic-name">${t.name}</div>
      <div class="topic-count">${t.questions.length} câu hỏi</div>
    </div>
  `).join('');
}

function loadTopic(id) {
  const topic = TOPICS.find(t => t.id === id);
  if (topic) {
    questions = JSON.parse(JSON.stringify(topic.questions));
    renderQList();
    showToast(`✅ Đã nạp bộ câu hỏi: ${topic.name}`);
  }
}

function loadDemo() {
  loadTopic('duoihinh');
}

function clearQuestions() {
  questions = [{ img: '', answer: '', hint: '', emoji: '🧠', wrongs: '' }];
  renderQList();
  showToast('🗑 Đã xóa toàn bộ câu hỏi!');
}

function renderQList() {
  const list = document.getElementById('qList');
  document.getElementById('qCountBadge').textContent = `${questions.length} câu`;
  list.innerHTML = '';

  questions.forEach((q, i) => {
    list.innerHTML += `
      <div class="q-item" id="qitem-${i}">
        <div class="q-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="q-inputs">
          <div class="q-label">🖼 Hình ảnh (URL hoặc upload)</div>
          <div class="upload-row">
            <input class="q-img-input" id="imgurl-${i}" placeholder="Dán link ảnh vào đây..." value="${q.img || ''}" oninput="updateQ(${i}, 'img', this.value)" />
            <span class="or-text">hoặc</span>
            <label class="file-upload-btn">
              📁 Upload <input type="file" accept="image/*" onchange="handleUpload(${i}, this)" />
            </label>
            <img class="img-preview-thumb" id="thumb-${i}" src="${q.img || ''}" style="display:${q.img && q.img.length>5 ? 'block' : 'none'}" />
          </div>
          
          <div class="q-label">💬 Emoji / Hint / ✅ Đáp án đúng</div>
          <div style="display:flex; gap:8px;">
            <input class="q-ans-input" style="width:60px" placeholder="🧠" value="${q.emoji || ''}" oninput="updateQ(${i}, 'emoji', this.value)" />
            <input class="q-ans-input" placeholder="Gợi ý ngắn..." value="${q.hint || ''}" oninput="updateQ(${i}, 'hint', this.value)" />
            <input class="q-ans-input" style="flex:1; border-color:var(--neon)" placeholder="Đáp án chính xác..." value="${q.answer || ''}" oninput="updateQ(${i}, 'answer', this.value)" />
          </div>
          
          <div class="q-label">❌ Các đáp án sai (cách nhau dấu phẩy, bỏ trống tự động sinh)</div>
          <input class="q-ans-input" placeholder="VD: Đáp án sai 1, Đáp án sai 2, Đáp án sai 3" value="${q.wrongs || ''}" oninput="updateQ(${i}, 'wrongs', this.value)" />
        </div>
        <button class="btn-del" onclick="deleteQ(${i})">✕</button>
      </div>
    `;
  });
}

function addQuestion() {
  questions.push({ img: '', answer: '', hint: '', emoji: '🧠', wrongs: '' });
  renderQList();
  document.getElementById('qList').scrollTop = 99999;
}

function deleteQ(i) {
  if (questions.length <= 1) {
    showToast('❗ Cần ít nhất 1 câu hỏi!');
    return;
  }
  questions.splice(i, 1);
  renderQList();
}

function updateQ(i, field, val) {
  questions[i][field] = val;
}

function handleUpload(i, input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    questions[i].img = e.target.result;
    const thumb = document.getElementById(`thumb-${i}`);
    const urlInput = document.getElementById(`imgurl-${i}`);
    if (thumb) { thumb.src = e.target.result; thumb.style.display = 'block'; }
    if (urlInput) { urlInput.value = '[Ảnh đã upload]'; }
    showToast('✅ Đã upload ảnh!');
  };
  reader.readAsDataURL(file);
}

function changeTime(delta) {
  baseTime = Math.max(5, Math.min(120, baseTime + delta));
  document.getElementById('timeDisplay').textContent = baseTime;
  updateLevelInfo();
}

function updateLevelInfo() {
  const badge = document.getElementById('levelBadge');
  const desc = document.getElementById('levelDesc');
  if (baseTime >= 30) {
    badge.textContent = '🌟 CẤP 1 — KHỞI ĐỘNG';
    desc.textContent = 'Thời gian thoải mái · Hình rõ dần';
  } else if (baseTime >= 15) {
    badge.textContent = '🔥 CẤP 2 — TĂNG TỐC';
    desc.textContent = 'Thử thách phản xạ · Thời gian ngắn';
  } else {
    badge.textContent = '⚡ CẤP 3 — THẦN TỐC';
    desc.textContent = 'Siêu khó · Hình ảnh mờ ảo';
  }
}

/* ============================================================
   4. LEADERBOARD LOGIC (Supabase)
============================================================ */

// Khởi tạo Supabase client (dùng biến từ supabase-config.js)
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let leaderboardData = [];

async function loadLeaderboardData() {
  try {
    const { data, error } = await db
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(200);

    if (error) throw error;
    leaderboardData = data || [];
  } catch (err) {
    console.error('Supabase load error:', err);
    leaderboardData = [];
  }
}

async function saveLeaderboardData(entry) {
  try {
    const { error } = await db
      .from('leaderboard')
      .insert([{
        name:      entry.name,
        score:     entry.score,
        correct:   entry.correct,
        total:     entry.total,
        max_combo: entry.maxCombo,
        date:      entry.date
      }]);

    if (error) throw error;
  } catch (err) {
    console.error('Supabase save error:', err);
  }
}

async function filterLeaderboard(filter) {
  document.querySelectorAll('.lb-filter-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(filter === 'all' ? 'filterAll' : filter === 'today' ? 'filterToday' : 'filterWeek').classList.add('active');

  await loadLeaderboardData();

  const now = new Date();
  let filtered = leaderboardData.filter(entry => {
    const d = new Date(entry.date);
    if (filter === 'today') {
      return d.toDateString() === now.toDateString();
    } else if (filter === 'week') {
      const diffDays = Math.ceil(Math.abs(now - d) / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    return true;
  });

  // max_combo field từ Supabase -> chuyển về maxCombo cho render
  filtered = filtered.map(e => ({ ...e, maxCombo: e.maxCombo ?? e.max_combo ?? 0 }));
  filtered.sort((a, b) => b.score - a.score || b.maxCombo - a.maxCombo);
  renderLeaderboardTable(filtered);
}

function renderLeaderboardTable(data) {
  const tbody = document.getElementById('lbBody');
  const empty = document.getElementById('lbEmpty');
  const table = document.getElementById('lbTable');

  if (data.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    table.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  table.style.display = 'table';
  
  tbody.innerHTML = data.slice(0, 10).map((p, i) => {
    let rankBadge = '';
    if (i === 0) rankBadge = '<span class="rank-badge rank-1">TOP 1</span>';
    else if (i === 1) rankBadge = '<span class="rank-badge rank-2">TOP 2</span>';
    else if (i === 2) rankBadge = '<span class="rank-badge rank-3">TOP 3</span>';

    return `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${p.name}</strong> ${rankBadge}</td>
        <td>${p.score}</td>
        <td>${p.correct}/${p.total}</td>
        <td>🔥 ${p.maxCombo}</td>
        <td style="font-size:12px; color:#888;">${new Date(p.date).toLocaleDateString('vi-VN')}</td>
      </tr>
    `;
  }).join('');
}





/* ============================================================
   5. GAME LOGIC (Load, Timer, Combo, Level)
============================================================ */
function startGame() {
  const valid = questions.filter(q => q.answer && q.answer.trim());
  if (valid.length === 0) {
    showToast('❗ Cần ít nhất 1 câu có đáp án!');
    return;
  }
  questions = valid;

  const nameInput = document.getElementById('playerNameInput').value.trim();
  playerName = nameInput || "Người chơi Ẩn Danh";
  document.getElementById('gamePlayerName').textContent = playerName;

  currentQ       = 0;
  score          = 0;
  correctCount   = 0;
  currentCombo   = 0;
  maxCombo       = 0;
  hintsAvailable = 0;
  hintUsed       = false;

  document.getElementById('scoreVal').textContent = '0';
  document.getElementById('bonusVal').textContent = '+0';
  updateComboUI();
  updateHintUI();

  showScreen('game');
  setupDots();
  loadQuestion();
}

function calculateCurrentLevelTime() {
  gameLevel = Math.floor(currentQ / 3) + 1;
  const q = questions[currentQ];
  currentLevelTime = (q && q.time) ? q.time : 30;
  
  document.getElementById('gameLevelLabel').textContent = `CẤP ${gameLevel}`;
  return currentLevelTime;
}

function setupDots() {
  const dotsEl = document.getElementById('qDots');
  dotsEl.innerHTML = questions.map((_, i) => `<div class="q-dot" id="dot-${i}"></div>`).join('');
  document.getElementById('qTotal').textContent = questions.length;
}

function loadQuestion() {
  revealed  = false;
  hintUsed  = false;
  const q = questions[currentQ];

  // Ẩn/reset hint box
  const hintBox = document.getElementById('hintBox');
  if (hintBox) {
    hintBox.classList.remove('visible');
    hintBox.querySelector('.hint-text').textContent = '';
  }
  updateHintUI();

  calculateCurrentLevelTime();

  document.getElementById('qCurrent').textContent = currentQ + 1;

  questions.forEach((_, i) => {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) dot.className = 'q-dot' + (i < currentQ ? ' done' : i === currentQ ? ' current' : '');
  });

  document.getElementById('revealOverlay').classList.remove('show');
  document.getElementById('imgPanel').classList.remove('revealed');

  const img = document.getElementById('gameImg');
  const placeholder = document.getElementById('imgPlaceholder');

  if (q.img && q.img.length > 5) {
    img.src = q.img;
    img.style.display = 'block';
    img.className = 'game-img';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
    placeholder.style.filter = 'brightness(0.6)';
    placeholder.innerHTML = `<span style="font-size:80px">${q.emoji || '🧠'}</span><span class="img-placeholder-text">ĐOÁN TỪ KHÓA</span>`;
  }

  if (q.type === 'input') {
    document.querySelector('.game-arena').classList.add('input-mode');
    generateInputBox(q);
    setStatus('⌨️ Nhập đáp án và nhấn Enter!', 'rgba(255,255,255,0.6)');
  } else {
    document.querySelector('.game-arena').classList.remove('input-mode');
    generateMCQOptions(q);
    setStatus('⏳ Hãy chọn đáp án đúng!', 'rgba(255,255,255,0.6)');
  }
  startTimer();
}

/* ---- Dạng nhập đáp án tự do ---- */
function normalizeAnswer(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

function generateInputBox(q) {
  const mcqGrid = document.getElementById('mcqGrid');
  if (!mcqGrid) return;
  mcqGrid.innerHTML = `
    <div class="input-answer-wrap" id="inputAnswerWrap">
      <input
        class="input-answer-field"
        id="answerInput"
        type="text"
        placeholder="Nhập đáp án..."
        autocomplete="off"
        autofocus
        onkeydown="handleInputKey(event)"
      />
      <button class="btn-submit-answer" id="btnSubmitAnswer" onclick="checkInput()">
        ✅ Xác nhận
      </button>
    </div>
  `;
  mcqGrid.style.pointerEvents = 'auto';
  setTimeout(() => { const inp = document.getElementById('answerInput'); if(inp) inp.focus(); }, 100);
}

function handleInputKey(e) {
  if (e.key === 'Enter') checkInput();
}

function checkInput() {
  if (revealed) return;
  const inp = document.getElementById('answerInput');
  if (!inp) return;
  const userVal = inp.value;
  const q = questions[currentQ];
  const isCorrect = normalizeAnswer(userVal) === normalizeAnswer(q.answer);

  // Vô hiệu hóa input
  inp.disabled = true;
  const btn = document.getElementById('btnSubmitAnswer');
  if (btn) btn.disabled = true;

  if (isCorrect) {
    inp.style.borderColor = 'var(--neon)';
    inp.style.color = 'var(--neon)';
    markCorrect(true);
  } else {
    inp.style.borderColor = 'var(--hot)';
    inp.style.color = 'var(--hot)';
    markWrong(true);
  }

  triggerReveal(isCorrect ? '🎉' : '❌');
  setTimeout(() => nextQuestion(), 2500);
}

function generateMCQOptions(q) {
  let options = [q.answer];
  
  // Lấy các đáp án sai được nhập thủ công
  if (q.wrongs && q.wrongs.trim()) {
     let w = q.wrongs.split(',').map(s => s.trim()).filter(s => s);
     options.push(...w);
  }
  
  // Tự động sinh thêm đáp án sai từ các câu hỏi khác nếu chưa đủ 4
  let allAnswers = questions.map(x => x.answer).filter(x => x !== q.answer);
  allAnswers.sort(() => Math.random() - 0.5); // shuffle
  
  while(options.length < 3) {
      if(allAnswers.length > 0) {
          let picked = allAnswers.pop();
          if(!options.includes(picked)) options.push(picked);
      } else {
          // Fallback generic
          options.push("Đáp án " + Math.floor(Math.random()*1000));
      }
  }
  
  // Giữ tối đa 3 options và xáo trộn
  options = options.slice(0, 3);
  options.sort(() => Math.random() - 0.5);
  
  q.currentOptions = options;
  q.correctIndex = options.indexOf(q.answer);

  // Render ra HTML
  const mcqGrid = document.getElementById('mcqGrid');
  if(mcqGrid) {
    mcqGrid.innerHTML = options.map((opt, i) => {
       const letter = ['A', 'B', 'C'][i];
       return `<button class="btn-mcq" id="btn-mcq-${i}" onclick="selectAnswer(${i})">
                 <span class="mcq-letter">${letter}</span> 
                 <span style="flex:1">${opt}</span>
               </button>`;
    }).join('');
    mcqGrid.style.pointerEvents = 'auto'; // Cho phép bấm
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = currentLevelTime;
  updateTimebar(100);

  timerInterval = setInterval(() => {
    timeLeft--;
    const pct = (timeLeft / currentLevelTime) * 100;

    updateTimebar(pct);
    updateBlur(pct);

    const wrap = document.getElementById('timebarWrap');
    if (pct < 25) wrap.classList.add('timebar-danger');
    else          wrap.classList.remove('timebar-danger');

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

function updateTimebar(pct) {
  document.getElementById('timebarFill').style.width = pct + '%';
  document.getElementById('timebarLabel').textContent = Math.max(0, timeLeft) + 's';

  const fill = document.getElementById('timebarFill');
  if (pct > 50)      fill.style.background = 'linear-gradient(90deg, var(--neon), var(--gold))';
  else if (pct > 25) fill.style.background = 'linear-gradient(90deg, var(--gold), #ff4d00)';
  else               fill.style.background = 'linear-gradient(90deg, var(--hot), #ff0000)';
}

function updateBlur(pct) {
  document.getElementById('bonusVal').textContent = '+' + calcBonus(pct);
}

function calcBonus(pct) {
  let baseBonus = 10;
  if (pct > 80) baseBonus = 100;
  else if (pct > 60) baseBonus = 75;
  else if (pct > 40) baseBonus = 50;
  else if (pct > 20) baseBonus = 25;
  
  const comboMultiplier = 1 + (currentCombo * 0.2); 
  return Math.floor(baseBonus * comboMultiplier);
}

function clearBlur() {
  // Ảnh luôn rõ nên không cần xóa mờ
}

function timeUp() {
  if (revealed) return;
  currentCombo = 0;
  updateComboUI();
  setStatus('⏰ Hết giờ! Chuyển sang câu tiếp theo...', 'var(--hot)');
  clearBlur();
  
  const q = questions[currentQ];
  const mcqGrid = document.getElementById('mcqGrid');
  if(mcqGrid) {
      mcqGrid.style.pointerEvents = 'none';
      const btnCorrect = document.getElementById(`btn-mcq-${q.correctIndex}`);
      if(btnCorrect) btnCorrect.classList.add('correct');
  }
  
  triggerReveal('⏰');

  setTimeout(() => {
     nextQuestion();
  }, 2500);
}

function updateComboUI() {
  const comboEl = document.getElementById('comboCount');
  comboEl.textContent = `×${currentCombo}`;
  
  if (currentCombo > 0) {
    comboEl.classList.remove('combo-anim');
    void comboEl.offsetWidth; 
    comboEl.classList.add('combo-anim');
  }
  
  if (currentCombo > maxCombo) {
    maxCombo = currentCombo;
  }
}

/* ============================================================
   6. HÀNH ĐỘNG GAME (Trắc nghiệm)
============================================================ */
function selectAnswer(idx) {
  if (revealed) return;
  
  const q = questions[currentQ];
  const isCorrect = (idx === q.correctIndex);
  
  const mcqGrid = document.getElementById('mcqGrid');
  if (mcqGrid) mcqGrid.style.pointerEvents = 'none'; 
  
  // Highlight
  document.getElementById(`btn-mcq-${q.correctIndex}`).classList.add('correct');
  if (!isCorrect) {
     document.getElementById(`btn-mcq-${idx}`).classList.add('wrong');
  }

  if (isCorrect) {
     markCorrect(true);
  } else {
     markWrong(true);
  }
  
  triggerReveal(isCorrect ? '🎉' : '❌');

  // Tự động chuyển câu sau 2.5s
  setTimeout(() => {
     nextQuestion();
  }, 2500);
}

function markCorrect(fromMCQ = false) {
  if (revealed && !fromMCQ) return;

  clearInterval(timerInterval);
  const pct = (timeLeft / currentLevelTime) * 100;
  
  currentCombo++;
  updateComboUI();

  // Tặng gợi ý mỗi 4 lần đúng liên tiếp
  if (currentCombo % 4 === 0) {
    hintsAvailable++;
    updateHintUI();
    showToast(`💡 Chúc mừng! Bạn nhận được 1 gợi ý! (Còn: ${hintsAvailable})`);
  }
  
  const bonus = calcBonus(pct);
  score += bonus;
  correctCount += 1;

  document.getElementById('scoreVal').textContent = score;
  let comboText = currentCombo > 1 ? ` 🔥 <span style="color:var(--gold)">COMBO ×${currentCombo}</span>` : '';
  
  setStatus(`🎉 <strong style="color:var(--neon)">ĐÚNG RỒI!</strong> +${bonus} điểm${comboText}`, 'var(--neon)');
  
  fireConfetti(60 + (currentCombo * 10)); 
  clearBlur();
}

function markWrong(fromMCQ = false) {
  if (revealed && !fromMCQ) return;

  clearInterval(timerInterval);
  currentCombo = 0;
  updateComboUI();

  const panel = document.getElementById('imgPanel');
  panel.classList.add('wrong-flash');
  setTimeout(() => panel.classList.remove('wrong-flash'), 500);

  setStatus('❌ Sai rồi! Mất Combo. Chuyển sang câu tiếp theo...', 'var(--hot)');
  clearBlur();
}

function useHint() {
  if (hintsAvailable <= 0) {
    showToast('❗ Bạn chưa có gợi ý! Đúng 4 lần liên tiếp để nhận gợi ý.');
    return;
  }
  if (hintUsed) {
    showToast('💡 Đã dùng gợi ý cho câu này rồi!');
    return;
  }
  if (revealed) return;

  hintUsed = true;
  hintsAvailable--;
  updateHintUI();

  const q = questions[currentQ];
  const hintBox = document.getElementById('hintBox');
  const hintText = document.getElementById('hintText');
  if (hintBox && hintText) {
    hintText.textContent = q.hint || 'Không có gợi ý cho câu này.';
    hintBox.classList.add('visible');
  }
}

function updateHintUI() {
  const btn = document.getElementById('btnHint');
  const badge = document.getElementById('hintBadge');
  if (!btn || !badge) return;

  badge.textContent = hintsAvailable;

  if (hintsAvailable > 0 && !revealed) {
    btn.classList.remove('hint-disabled');
    btn.classList.add('hint-ready');
  } else {
    btn.classList.remove('hint-ready');
    btn.classList.add('hint-disabled');
  }
}

function triggerReveal(emoji) {
  revealed = true;
  const q = questions[currentQ];
  document.getElementById('revealEmoji').textContent = emoji;
  document.getElementById('revealAnswer').textContent = q.answer.toUpperCase();
  document.getElementById('revealOverlay').classList.add('show');
  document.getElementById('imgPanel').classList.add('revealed');
}

function nextQuestion() {
  if (currentQ < questions.length - 1) {
    currentQ++;
    document.getElementById('revealOverlay').classList.remove('show');
    setTimeout(loadQuestion, 300);
  } else {
    endGame();
  }
}

function exitGame() {
  clearInterval(timerInterval);
  goHome();
}

/* ============================================================
   7. KẾT THÚC GAME & HELPERS
============================================================ */
function endGame() {
  clearInterval(timerInterval);
  showScreen('results');

  document.getElementById('rTotal').textContent = questions.length;
  document.getElementById('rCorrect').textContent = correctCount;
  document.getElementById('rScore').textContent = score;
  document.getElementById('rMaxCombo').textContent = maxCombo;
  // Auto-save to Supabase
  if (score > 0 || correctCount > 0) {
    const entry = {
      name:     playerName,
      score:    score,
      correct:  correctCount,
      total:    questions.length,
      maxCombo: maxCombo,
      date:     new Date().toISOString()
    };
    saveLeaderboardData(entry);
  }
  const pct = Math.round((correctCount / questions.length) * 100);
  const msgs = [
    [90, '🔥 THIÊN TÀI! Não nảy số đỉnh của đỉnh!'],
    [70, '⚡ SIÊU PHẢN XẠ! Cả lớp nể phục rồi!'],
    [50, '👏 Không tệ! Lần sau sẽ nhanh hơn!'],
    [0,  '💪 Cứ thử lại! Não cần warming up thôi!']
  ];
  const msg = msgs.find(([threshold]) => pct >= threshold);
  document.getElementById('resultSubtitle').textContent = msg[1];
  
  const rankBadge = document.getElementById('rankBadgeResult');
  if(pct >= 90) rankBadge.innerHTML = '<span class="rank-badge rank-1" style="font-size:16px; padding:6px 12px;">🏆 XẾP HẠNG: HUYỀN THOẠI</span>';
  else if(pct >= 70) rankBadge.innerHTML = '<span class="rank-badge rank-2" style="font-size:16px; padding:6px 12px;">🌟 XẾP HẠNG: CAO THỦ</span>';
  else if(pct >= 40) rankBadge.innerHTML = '<span class="rank-badge rank-3" style="font-size:16px; padding:6px 12px;">💪 XẾP HẠNG: TINH ANH</span>';
  else rankBadge.innerHTML = '<span style="color:var(--hot)">XẾP HẠNG: TẬP SỰ</span>';

  fireConfetti(120);
}

function restartGame() {
  currentQ      = 0;
  score         = 0;
  correctCount  = 0;
  currentCombo  = 0;
  maxCombo      = 0;
  hintsAvailable = 0;
  hintUsed      = false;

  document.getElementById('scoreVal').textContent = '0';
  document.getElementById('bonusVal').textContent = '+0';
  updateComboUI();
  updateHintUI();

  showScreen('game');
  setupDots();
  loadQuestion();
}

function goHome() {
  clearInterval(timerInterval);
  showScreen('home');
  renderQList();
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  window.scrollTo(0, 0);
  
  if(name === 'leaderboard') {
    filterLeaderboard('all');
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function setStatus(html, color) {
  const el = document.getElementById('statusMsg');
  el.innerHTML = html;
  el.style.color = color;
}

function fireConfetti(count = 60) {
  const box = document.getElementById('confettiBox');
  box.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const x = Math.random() * 100;
    const size = 6 + Math.random() * 10;
    const duration = 1.5 + Math.random() * 2;
    const delay = Math.random() * 1.2;
    const isCircle = Math.random() > 0.5;

    el.style.cssText = `left: ${x}vw; background: ${color}; width: ${size}px; height: ${size}px; border-radius: ${isCircle ? '50%' : '2px'}; animation: confettiFall ${duration}s ${delay}s ease-in forwards;`;
    box.appendChild(el);
  }
  setTimeout(() => { box.innerHTML = ''; }, 4000);
}

init();
