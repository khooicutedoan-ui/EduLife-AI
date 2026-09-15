/* =============================================
   EduLife AI – script.js
   STEMPETITION 2027 – Challenge 5: Future Technology
   ============================================= */

'use strict';

// ============================================================
// 0. KHỞI ĐỘNG – đánh dấu JS đã sẵn sàng để CSS animation hoạt động
// ============================================================
document.body.classList.add('js-ready');

// ============================================================
// 1. DARK / LIGHT MODE
// ============================================================
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('edulife-theme', theme);
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-sun';
    themeToggle.title   = 'Chuyển sang chế độ sáng';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
    themeToggle.title   = 'Chuyển sang chế độ tối';
  }
}

const savedTheme = localStorage.getItem('edulife-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================================
// 2. NAVBAR – scroll effect + hamburger + active link
// ============================================================
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let currentSection = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) currentSection = sec.id;
  });
  navLinkEls.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === currentSection);
  });
}

document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 3. SCROLL ANIMATIONS (IntersectionObserver)
// ============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(
        (entry.target.parentElement || document.body)
          .querySelectorAll('[data-animate]:not(.animated)')
      );
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('animated'), idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ============================================================
// 4. ANIMATED COUNTERS (hero stats)
// ============================================================
function animateCount(el, target, duration = 1400) {
  let current = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target, parseInt(entry.target.getAttribute('data-count'), 10));
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

// ============================================================
// 5. STAT BAR ANIMATION (problems section)
// ============================================================
const barSection = document.querySelector('.stat-bar-list');
if (barSection) {
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
        barObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  barObs.observe(barSection);
}

// ============================================================
// 6. DEMO TABS
// ============================================================
document.querySelectorAll('.demo-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.demo-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.demo-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.getAttribute('data-tab'));
    if (panel) panel.classList.add('active');
  });
});

// ============================================================
// 7. IMPACT TABS
// ============================================================
document.querySelectorAll('.impact-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.impact-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.impact-tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('impact-' + btn.getAttribute('data-impact'));
    if (target) target.classList.add('active');
  });
});

// ============================================================
// 8. DEMO TOOL 1 – STUDY PLANNER (AI Mô Phỏng)
// ============================================================
const SUBJECT_COLORS = {
  'Toán': '#6366f1', 'Lý': '#06b6d4', 'Hóa': '#10b981',
  'Văn':  '#a855f7', 'Anh': '#f59e0b', 'Sinh': '#ec4899',
  'Sử':   '#ef4444', 'Địa': '#14b8a6', 'GDCD': '#8b5cf6',
  'Tin':  '#3b82f6'
};

const DAY_ABBR = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const TIPS_BY_GOAL = {
  on_thi:    [
    'Ôn lại công thức Toán và Lý mỗi buổi sáng trong 15 phút.',
    'Làm ít nhất 1 đề thi thử mỗi tuần để làm quen với áp lực.',
    'Dành riêng buổi tối Chủ nhật để ôn lại toàn bộ kiến thức trong tuần.',
    'Sử dụng kỹ thuật Pomodoro: học 25 phút, nghỉ 5 phút.',
    'Viết tắt công thức ra giấy nhỏ và ôn vào mọi lúc rảnh.'
  ],
  cai_thien: [
    'Tập trung vào điểm yếu: dành 40% thời gian cho môn học yếu nhất.',
    'Ghi chú lại những lỗi sai thường gặp và ôn lại mỗi tuần.',
    'Hỏi thầy cô hoặc bạn bè ngay khi không hiểu bài, đừng để dồn.',
    'Mỗi môn nên ôn đều đặn thay vì nhồi nhét trước khi thi.',
    'Theo dõi điểm số mỗi tuần để thấy sự tiến bộ rõ ràng.'
  ],
  co_ban:    [
    'Đọc trước bài mới 10 phút trước khi lên lớp để tiếp thu tốt hơn.',
    'Tóm tắt bài học bằng sơ đồ tư duy sau mỗi buổi học.',
    'Đừng bỏ qua bài tập về nhà – đây là nền tảng quan trọng nhất.',
    'Học theo nhóm 2–3 người để giải thích cho nhau giúp nhớ lâu hơn.',
    'Đảm bảo ngủ đủ 8 tiếng để não bộ xử lý kiến thức hiệu quả.'
  ],
  nang_cao:  [
    'Tìm kiếm bài tập nâng cao trên các trang web học thuật.',
    'Tham gia các câu lạc bộ STEM hoặc Olympiad để thách thức bản thân.',
    'Đọc thêm sách tham khảo ngoài sách giáo khoa.',
    'Thực hành giải bài theo nhiều cách khác nhau để tư duy linh hoạt.',
    'Theo dõi các kênh học thuật uy tín như Khan Academy, MIT OpenCourseWare.'
  ]
};

function buildWeekPlan(subjects, hoursPerDay, weakSubject) {
  const subjectList = subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);
  if (subjectList.length === 0) return null;
  const hoursNum = Math.max(1, Math.min(12, parseInt(hoursPerDay) || 3));

  const weights = {};
  subjectList.forEach(s => {
    weights[s] = s.toLowerCase() === (weakSubject || '').toLowerCase() ? 2 : 1;
  });
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const sessions = {};
  subjectList.forEach(s => {
    sessions[s] = Math.max(1, Math.round((weights[s] / totalWeight) * hoursNum * 7 * 60 / 45));
  });

  const week = Array.from({ length: 7 }, () => []);
  let pool = [];
  Object.entries(sessions).forEach(([subj, count]) => {
    for (let i = 0; i < count; i++) pool.push(subj);
  });

  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Tính maxPerDay dựa trên số giờ thực tế, không giới hạn cứng ở 3
  const maxPerDay = Math.max(3, Math.ceil(pool.length / 7));
  let dayIdx = 0;
  let safeGuard = 0; // chống vòng lặp vô tận
  pool.forEach(subj => {
    safeGuard = 0;
    while (week[dayIdx].length >= maxPerDay && safeGuard < 7) {
      dayIdx = (dayIdx + 1) % 7;
      safeGuard++;
    }
    week[dayIdx].push(subj);
    dayIdx = (dayIdx + 1) % 7;
  });

  return { week, hoursNum };
}

function renderWeekPlan(planData) {
  const timeslots = ['07:00–08:30', '14:00–15:30', '19:00–20:30'];
  let html = '<div class="plan-week">';
  planData.week.forEach((day, i) => {
    html += `<div class="plan-day"><div class="plan-day-name">${DAY_ABBR[i]}</div><div class="plan-day-items">`;
    if (day.length === 0) {
      html += `<span style="font-size:0.72rem;color:var(--text-muted)">Nghỉ 🌿</span>`;
    } else {
      day.forEach((subj, idx) => {
        const color = SUBJECT_COLORS[subj] || '#6366f1';
        html += `<span class="plan-subject" style="background:${color};">${subj}</span>
                 <span class="plan-time">${timeslots[idx] || ''}</span>`;
      });
    }
    html += `</div></div>`;
  });
  html += '</div>';
  html += `<div style="display:flex;gap:16px;flex-wrap:wrap;padding:14px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:12px;">
    <span style="font-size:0.88rem;color:var(--text-secondary);">⏱ <strong>${planData.hoursNum}h/ngày</strong></span>
    <span style="font-size:0.88rem;color:var(--text-secondary);">📅 <strong>7 ngày/tuần</strong></span>
    <span style="font-size:0.88rem;color:var(--text-secondary);">📚 <strong>${[...new Set(planData.week.flat())].length} môn</strong></span>
  </div>`;
  return html;
}

document.getElementById('generatePlan').addEventListener('click', () => {
  const subjects    = document.getElementById('subjectsInput').value;
  const hours       = document.getElementById('hoursInput').value;
  const goal        = document.getElementById('goalInput').value;
  const weakSubject = document.getElementById('weakSubject').value.trim();

  if (!subjects.trim()) {
    alert('Vui lòng nhập ít nhất một môn học!');
    return;
  }

  const btn = document.getElementById('generatePlan');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tạo kế hoạch...';
  btn.disabled  = true;

  setTimeout(() => {
    const planData = buildWeekPlan(subjects, hours, weakSubject);
    if (!planData) {
      alert('Không thể tạo kế hoạch. Kiểm tra lại dữ liệu nhập.');
      btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Tạo kế hoạch học tập';
      btn.disabled  = false;
      return;
    }

    document.getElementById('planContent').innerHTML = renderWeekPlan(planData);

    const tips = TIPS_BY_GOAL[goal] || TIPS_BY_GOAL['co_ban'];
    document.getElementById('planTips').innerHTML = tips.map(t => `<li>${t}</li>`).join('');

    const resultEl = document.getElementById('planResult');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Tạo kế hoạch học tập';
    btn.disabled  = false;
  }, 900);
});

// ============================================================
// 9. DEMO TOOL 2 – TASK MANAGER
// ============================================================
let tasks      = JSON.parse(localStorage.getItem('edulife-tasks') || '[]');
let taskFilter = 'all';

// Đặt ngày mặc định = ngày mai
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById('taskDeadline').value = tomorrow.toISOString().split('T')[0];

// Dữ liệu mẫu nếu chưa có
if (tasks.length === 0) {
  tasks = [
    { id: 1, name: 'Làm bài tập Toán trang 45–48',        subject: 'Toán', deadline: daysLater(1), priority: 'high',   done: false },
    { id: 2, name: 'Ôn lại định luật Newton',              subject: 'Lý',   deadline: daysLater(2), priority: 'medium', done: false },
    { id: 3, name: 'Soạn bài "Chiếc thuyền ngoài xa"',    subject: 'Văn',  deadline: daysLater(3), priority: 'medium', done: true  },
    { id: 4, name: 'Học từ vựng Unit 5 Tiếng Anh',        subject: 'Anh',  deadline: daysLater(1), priority: 'low',    done: false },
    { id: 5, name: 'Làm thí nghiệm Hóa bài 12',           subject: 'Hóa',  deadline: daysLater(5), priority: 'high',   done: false },
  ];
  saveTasks();
}

function daysLater(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function saveTasks() {
  localStorage.setItem('edulife-tasks', JSON.stringify(tasks));
}

function formatDeadline(dateStr) {
  if (!dateStr) return '';
  const d     = new Date(dateStr + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff  = Math.round((d - today) / 86400000);
  if (diff < 0)   return `<span style="color:var(--danger)">Quá hạn ${Math.abs(diff)} ngày</span>`;
  if (diff === 0) return `<span style="color:var(--warning)">Hôm nay</span>`;
  if (diff === 1) return `<span style="color:var(--warning)">Ngày mai</span>`;
  return `Còn ${diff} ngày`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderTasks() {
  const listEl    = document.getElementById('taskList');
  const summaryEl = document.getElementById('taskSummary');

  let filtered = tasks;
  if (taskFilter === 'pending') filtered = tasks.filter(t => !t.done);
  if (taskFilter === 'done')    filtered = tasks.filter(t => t.done);

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="task-empty">
      <i class="fa-solid fa-inbox"></i>
      <p>${taskFilter === 'done' ? 'Chưa có nhiệm vụ nào hoàn thành.' : 'Không có nhiệm vụ nào. Thêm ngay!'}</p>
    </div>`;
  } else {
    listEl.innerHTML = filtered.map(task => `
      <div class="task-item ${task.done ? 'done' : ''}" data-id="${task.id}">
        <div class="task-check ${task.done ? 'checked' : ''}" onclick="toggleTask(${task.id})">
          ${task.done ? '<i class="fa-solid fa-check"></i>' : ''}
        </div>
        <span class="task-name">${escapeHtml(task.name)}</span>
        <div class="task-meta">
          <span class="task-subject">${escapeHtml(task.subject)}</span>
          <span class="task-deadline">${formatDeadline(task.deadline)}</span>
          <span class="task-priority-dot priority-${task.priority}"></span>
        </div>
        <button class="task-delete" onclick="deleteTask(${task.id})" title="Xóa">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `).join('');
  }

  const total  = tasks.length;
  const done   = tasks.filter(t => t.done).length;
  const pct    = total > 0 ? Math.round(done / total * 100) : 0;
  const overdue = tasks.filter(t => {
    if (t.done) return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(t.deadline + 'T00:00:00') < today;
  }).length;

  summaryEl.innerHTML = `
    <span>📋 Tổng: <strong>${total}</strong></span>
    <span>✅ Hoàn thành: <strong>${done}</strong></span>
    <span>⏳ Còn lại: <strong>${total - done}</strong></span>
    ${overdue > 0 ? `<span style="color:var(--danger)">⚠️ Quá hạn: <strong>${overdue}</strong></span>` : ''}
    <span style="margin-left:auto;">Tiến độ: <strong>${pct}%</strong></span>
  `;
}

// expose to onclick attributes
window.toggleTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (task) { task.done = !task.done; saveTasks(); renderTasks(); }
};

window.deleteTask = function(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
};

document.getElementById('addTaskBtn').addEventListener('click', () => {
  const name     = document.getElementById('taskName').value.trim();
  const deadline = document.getElementById('taskDeadline').value;
  const priority = document.getElementById('taskPriority').value;
  const subject  = document.getElementById('taskSubject').value;

  if (!name) {
    const inp = document.getElementById('taskName');
    inp.focus();
    inp.style.borderColor = 'var(--danger)';
    setTimeout(() => { inp.style.borderColor = ''; }, 1500);
    return;
  }

  tasks.unshift({ id: Date.now(), name, subject, deadline, priority, done: false });
  saveTasks();
  renderTasks();
  document.getElementById('taskName').value = '';

  taskFilter = 'all';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    taskFilter = btn.getAttribute('data-filter');
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTasks();
  });
});

renderTasks();

// ============================================================
// 10. DEMO TOOL 3 – Q&A CHATBOT (AI Mô Phỏng)
// ============================================================
const QA_BANK = [
  {
    keywords: ['toán', 'học toán'],
    answer: `<p><strong>📐 Phương pháp học Toán hiệu quả:</strong></p>
<ul>
<li><strong>Hiểu thay vì học thuộc:</strong> Nắm bản chất công thức, không học cơ học.</li>
<li><strong>Luyện tập đều đặn:</strong> Giải 5–10 bài mỗi ngày, tăng dần độ khó.</li>
<li><strong>Sổ lỗi sai:</strong> Ghi lại lỗi thường gặp và ôn lại hàng tuần.</li>
<li><strong>Học theo chủ đề:</strong> Xong 1 dạng rồi mới sang dạng khác.</li>
<li><strong>Sơ đồ tư duy:</strong> Vẽ mindmap tổng hợp kiến thức từng chương.</li>
</ul>
<p>⚡ <em>Mẹo:</em> Học Toán vào buổi sáng khi não tỉnh táo nhất sẽ hiệu quả hơn 30%.</p>`
  },
  {
    keywords: ['ghi nhớ', 'nhớ bài', 'học thuộc', 'nhớ lâu'],
    answer: `<p><strong>🧠 Kỹ thuật ghi nhớ bài hiệu quả:</strong></p>
<ul>
<li><strong>Lặp lại ngắt quãng:</strong> Ôn sau 1 ngày, 3 ngày, 7 ngày, 21 ngày.</li>
<li><strong>Kỹ thuật Feynman:</strong> Giải thích lại kiến thức như đang dạy người khác.</li>
<li><strong>Gắn với hình ảnh:</strong> Vẽ sơ đồ, dùng màu sắc, tạo liên tưởng vui.</li>
<li><strong>Ngủ đủ giấc:</strong> Não củng cố ký ức khi ngủ – thiếu ngủ giảm 40% khả năng nhớ.</li>
<li><strong>Tự kiểm tra:</strong> Tự đặt câu hỏi và trả lời thay vì chỉ đọc lại bài.</li>
</ul>`
  },
  {
    keywords: ['thời gian', 'quản lý thời gian', 'sắp xếp', 'lịch học'],
    answer: `<p><strong>⏰ Quản lý thời gian học tập thông minh:</strong></p>
<ul>
<li><strong>Ma trận Eisenhower:</strong> Phân loại theo Quan trọng/Khẩn cấp.</li>
<li><strong>Kỹ thuật Pomodoro:</strong> Học 25 phút → nghỉ 5 phút → sau 4 chu kỳ nghỉ 20 phút.</li>
<li><strong>Lập kế hoạch tối hôm trước:</strong> Viết 3 việc quan trọng nhất cho ngày mai.</li>
<li><strong>Không đa nhiệm:</strong> Làm xong 1 việc trước khi chuyển sang việc khác.</li>
<li><strong>Tắt thông báo:</strong> Bị ngắt quãng mất ~23 phút để tập trung lại.</li>
</ul>
<p>💡 Dùng tab <strong>"Lập Kế Hoạch"</strong> để EduLife AI tạo lịch học cá nhân hóa cho bạn!</p>`
  },
  {
    keywords: ['năng lượng', 'bảo toàn năng lượng', 'định luật', 'vật lý', 'lý'],
    answer: `<p><strong>⚡ Định luật Bảo toàn Năng lượng (Vật lý):</strong></p>
<p><em>"Năng lượng không tự sinh ra cũng không tự mất đi, nó chỉ chuyển hóa từ dạng này sang dạng khác."</em></p>
<ul>
<li><strong>Công thức:</strong> E₁ = E₂ (tổng năng lượng trước = sau)</li>
<li><strong>Ví dụ:</strong> Quả bóng rơi: Thế năng → Động năng</li>
<li><strong>Ví dụ:</strong> Đèn điện: Điện năng → Quang năng + Nhiệt năng</li>
</ul>`
  },
  {
    keywords: ['stress', 'căng thẳng', 'áp lực', 'lo lắng', 'mệt'],
    answer: `<p><strong>😌 Cách giảm căng thẳng học tập:</strong></p>
<ul>
<li><strong>Thở sâu 4-7-8:</strong> Hít 4s → giữ 7s → thở ra 8s. Lặp 3 lần.</li>
<li><strong>Vận động 10 phút:</strong> Đi bộ, nhảy nhẹ để giải phóng endorphin.</li>
<li><strong>Chia nhỏ nhiệm vụ:</strong> Không nghĩ "ôn cả kỳ", chỉ nghĩ "học xong bài 1 hôm nay".</li>
<li><strong>Nói chuyện:</strong> Chia sẻ với bạn bè hoặc gia đình.</li>
<li><strong>Ngủ đủ 7–8 tiếng:</strong> Không gì thay thế được giấc ngủ.</li>
</ul>`
  },
  {
    keywords: ['tiếng anh', 'anh văn', 'học anh'],
    answer: `<p><strong>🌍 Phương pháp học Tiếng Anh hiệu quả:</strong></p>
<ul>
<li><strong>Học từ trong ngữ cảnh:</strong> Học từ vựng trong câu hoàn chỉnh.</li>
<li><strong>Nghe 15–30 phút/ngày:</strong> Podcast, phim có phụ đề tiếng Anh.</li>
<li><strong>Đọc sách tiếng Anh:</strong> Bắt đầu từ cấp độ phù hợp.</li>
<li><strong>Nói to khi học:</strong> Luyện phát âm, tự ghi âm và nhận xét.</li>
<li><strong>Flashcard (Anki):</strong> Ôn từ vựng bằng spaced repetition.</li>
</ul>`
  },
  {
    keywords: ['hóa học', 'học hóa', 'hóa'],
    answer: `<p><strong>⚗️ Phương pháp học Hóa học hiệu quả:</strong></p>
<ul>
<li><strong>Hiểu bảng tuần hoàn:</strong> Nắm xu hướng tính chất là chìa khóa.</li>
<li><strong>Cân bằng phương trình:</strong> Luyện hàng ngày theo từng loại phản ứng.</li>
<li><strong>Liên kết thực tế:</strong> Muối ăn là NaCl, gỉ sắt là Fe₂O₃.</li>
<li><strong>Sơ đồ chuyển hóa:</strong> Vẽ sơ đồ quan hệ giữa các chất.</li>
</ul>`
  },
  {
    keywords: ['văn học', 'học văn', 'văn', 'ngữ văn'],
    answer: `<p><strong>📝 Phương pháp học Ngữ Văn hiệu quả:</strong></p>
<ul>
<li><strong>Đọc tác phẩm gốc:</strong> Cảm nhận thực sự mới viết hay được.</li>
<li><strong>Lập dàn ý trước:</strong> Bố cục chặt chẽ quyết định 50% điểm bài văn.</li>
<li><strong>Học thuộc dẫn chứng:</strong> 5–7 câu thơ hay cho mỗi tác phẩm.</li>
<li><strong>Phân tích nghệ thuật:</strong> Chú ý biện pháp tu từ, nhịp điệu.</li>
</ul>`
  },
  {
    keywords: ['ai', 'trí tuệ nhân tạo', 'chatgpt', 'dùng ai'],
    answer: `<p><strong>🤖 Cách sử dụng AI đúng trong học tập:</strong></p>
<ul>
<li><strong>Để hiểu, không để chép:</strong> Hỏi AI giải thích, rồi tự viết lại.</li>
<li><strong>Kiểm tra lại:</strong> AI có thể sai – đối chiếu với sách giáo khoa.</li>
<li><strong>Dùng để luyện tập:</strong> Nhờ AI ra đề bài và hỏi ngược lại bạn.</li>
<li><strong>Không lạm dụng:</strong> Tự làm trước, chỉ hỏi AI khi thực sự bí.</li>
</ul>`
  },
  {
    keywords: ['ngủ', 'giấc ngủ', 'ngủ sớm', 'sức khỏe'],
    answer: `<p><strong>😴 Giấc ngủ và học tập:</strong></p>
<ul>
<li><strong>Cần 8–9 tiếng/đêm</strong> để não củng cố ký ức hiệu quả.</li>
<li><strong>Ngủ trước 23:00:</strong> Hormone tái tạo não mạnh nhất từ 22:00–02:00.</li>
<li><strong>Ngủ trưa 20 phút:</strong> Tăng 35% sức tập trung buổi chiều.</li>
<li><strong>Tránh điện thoại trước ngủ:</strong> Ánh sáng xanh ức chế melatonin.</li>
</ul>`
  }
];

function normalize(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function findAnswer(question) {
  const q = normalize(question);
  let bestMatch = null, bestScore = 0;

  for (const item of QA_BANK) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(normalize(kw))) score++;
    }
    if (score > bestScore) { bestScore = score; bestMatch = item; }
  }

  if (bestMatch && bestScore > 0) return bestMatch.answer;

  return `<p>Cảm ơn câu hỏi về: <strong>"${escapeHtml(question)}"</strong></p>
<p>Đây là <strong>Bản Mô Phỏng AI</strong> với ngân hàng câu hỏi giới hạn. Tôi có thể tư vấn về:</p>
<ul>
<li>📐 Phương pháp học Toán, Lý, Hóa, Văn, Anh</li>
<li>🧠 Kỹ thuật ghi nhớ và học tập hiệu quả</li>
<li>⏰ Quản lý thời gian, lập kế hoạch</li>
<li>😌 Giảm stress và xây dựng thói quen tốt</li>
</ul>
<p>Phiên bản đầy đủ sẽ tích hợp AI thật để trả lời mọi câu hỏi! 🚀</p>`;
}

function appendMessage(text, type) {
  const chat = document.getElementById('qaChat');
  const div  = document.createElement('div');
  div.className = `chat-msg ${type === 'user' ? 'user-msg' : 'bot-msg'}`;
  div.innerHTML = `
    <div class="msg-avatar">
      <i class="fa-solid ${type === 'user' ? 'fa-user' : 'fa-brain'}"></i>
    </div>
    <div class="msg-bubble">${type === 'user' ? escapeHtml(text) : text}</div>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function appendTyping() {
  const chat = document.getElementById('qaChat');
  const div  = document.createElement('div');
  div.className = 'chat-msg bot-msg';
  div.innerHTML = `
    <div class="msg-avatar"><i class="fa-solid fa-brain"></i></div>
    <div class="msg-bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
    </div>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function sendQuestion(question) {
  if (!question.trim()) return;
  appendMessage(question, 'user');
  document.getElementById('qaInput').value = '';
  const typingEl = appendTyping();
  setTimeout(() => {
    typingEl.remove();
    appendMessage(findAnswer(question), 'bot');
  }, 600 + Math.random() * 700);
}

document.getElementById('qaSendBtn').addEventListener('click', () => {
  const q = document.getElementById('qaInput').value.trim();
  if (q) sendQuestion(q);
});

document.getElementById('qaInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const q = document.getElementById('qaInput').value.trim();
    if (q) sendQuestion(q);
  }
});

document.querySelectorAll('.quick-q').forEach(btn => {
  btn.addEventListener('click', () => sendQuestion(btn.getAttribute('data-q')));
});

// ============================================================
// 11. SMOOTH SCROLL cho anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// ============================================================
// 12. KHỞI ĐỘNG
// ============================================================
window.dispatchEvent(new Event('scroll'));

// Thêm style highlight ngày hôm nay trong kế hoạch
const s = document.createElement('style');
s.textContent = `.plan-today { border: 2px solid var(--primary) !important; box-shadow: 0 0 16px rgba(99,102,241,0.3); }`;
document.head.appendChild(s);

console.log('%c EduLife AI 🚀 ', 'background:#6366f1;color:#fff;font-size:14px;padding:6px 12px;border-radius:4px;');
console.log('%c STEMPETITION 2027 – Challenge 5: Future Technology', 'color:#a855f7;font-size:12px;');


// ============================================================
// 13. EDULIFE AI ASSISTANT – Kết nối OpenAI API thật
// ============================================================

(function () {
  'use strict';

  /* ----------------------------------------------------------
     CẤU HÌNH
  ---------------------------------------------------------- */
  const API_BASE        = 'http://localhost:3000';
  const API_CHAT_URL    = `${API_BASE}/api/chat`;
  const API_STATUS_URL  = `${API_BASE}/api/status`;
  const MAX_HISTORY     = 20;   // Số tin nhắn tối đa giữ trong lịch sử
  const STATUS_INTERVAL = 30000; // Kiểm tra trạng thái server mỗi 30s

  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */
  let conversationHistory = []; // [{role: 'user'|'assistant', content: '...'}]
  let isWaitingResponse   = false;
  let statusCheckTimer    = null;
  let serverOnline        = false;

  /* ----------------------------------------------------------
     DOM ELEMENTS
  ---------------------------------------------------------- */
  const chatWindow       = document.getElementById('aiChatWindow');
  const inputField       = document.getElementById('aiInput');
  const sendBtn          = document.getElementById('aiSendBtn');
  const clearBtn         = document.getElementById('aiClearBtn');
  const charCount        = document.getElementById('aiCharCount');
  const statusDot        = document.getElementById('aiStatusDot');
  const statusText       = document.getElementById('aiStatusText');
  const configWarning    = document.getElementById('aiConfigWarning');
  const configWarningTxt = document.getElementById('aiConfigWarningText');
  const retryBtn         = document.getElementById('aiRetryBtn');
  const suggestions      = document.getElementById('aiSuggestions');

  // Nếu các element chưa tồn tại (tab chưa render) thì bỏ qua
  if (!chatWindow || !inputField) return;

  /* ----------------------------------------------------------
     TIỆN ÍCH – Escape HTML để hiển thị tin nhắn user an toàn
  ---------------------------------------------------------- */
  function safeEscape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ----------------------------------------------------------
     TIỆN ÍCH – Render Markdown đơn giản từ response AI
     (bold, italic, code, list, header, xuống dòng)
  ---------------------------------------------------------- */
  function renderMarkdown(text) {
    return text
      // Escape HTML trước
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers (### ## #)
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
      .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
      // Bold và Italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,         '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Unordered list
      .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>(\n|$))+/g, '<ul>$&</ul>')
      // Ordered list
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // Dòng trống → paragraph
      .replace(/\n\n+/g, '</p><p>')
      // Xuống dòng đơn
      .replace(/\n/g, '<br>')
      // Bọc vào paragraph
      .replace(/^(.+)$/, '<p>$1</p>');
  }

  /* ----------------------------------------------------------
     TIỆN ÍCH – Lấy thời gian hiện tại dạng HH:mm
  ---------------------------------------------------------- */
  function getNow() {
    return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  /* ----------------------------------------------------------
     CẬP NHẬT TRẠNG THÁI HEADER
  ---------------------------------------------------------- */
  function setStatus(state, message) {
    if (!statusDot || !statusText) return;
    statusDot.className = 'ai-status-dot ' + state; // 'online' | 'offline' | 'loading' | ''
    statusText.textContent = message;
  }

  /* ----------------------------------------------------------
     HIỂN THỊ / ẨN CẢNH BÁO CẤU HÌNH
  ---------------------------------------------------------- */
  function showConfigWarning(message) {
    if (!configWarning) return;
    if (configWarningTxt) configWarningTxt.textContent = message;
    configWarning.style.display = 'flex';
    serverOnline = false;
  }

  function hideConfigWarning() {
    if (!configWarning) return;
    configWarning.style.display = 'none';
    serverOnline = true;
  }

  /* ----------------------------------------------------------
     THÊM TIN NHẮN VÀO KHUNG CHAT
  ---------------------------------------------------------- */
  function appendMessage(role, htmlContent, time) {
    const isBot = (role === 'bot' || role === 'assistant');
    const msgEl = document.createElement('div');
    msgEl.className = `ai-msg ${isBot ? 'ai-msg-bot' : 'ai-msg-user'}`;
    msgEl.innerHTML = `
      <div class="ai-msg-avatar ${isBot ? 'bot' : 'user'}">
        <i class="fa-solid ${isBot ? 'fa-robot' : 'fa-user'}"></i>
      </div>
      <div class="ai-msg-content">
        <div class="ai-msg-bubble">${htmlContent}</div>
        <span class="ai-msg-time">${time || getNow()}</span>
      </div>
    `;
    chatWindow.appendChild(msgEl);
    scrollToBottom();
    return msgEl;
  }

  /* ----------------------------------------------------------
     HIỂN THỊ "AI đang suy nghĩ..."
  ---------------------------------------------------------- */
  function appendTypingIndicator() {
    const msgEl = document.createElement('div');
    msgEl.className = 'ai-msg ai-msg-bot';
    msgEl.id = 'aiTypingIndicator';
    msgEl.innerHTML = `
      <div class="ai-msg-avatar bot">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="ai-msg-content">
        <div class="ai-typing-indicator">
          <span class="ai-typing-text">AI đang suy nghĩ</span>
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
        </div>
      </div>
    `;
    chatWindow.appendChild(msgEl);
    scrollToBottom();
    return msgEl;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('aiTypingIndicator');
    if (el) el.remove();
  }

  /* ----------------------------------------------------------
     CUỘN XUỐNG CUỐI KHUNG CHAT
  ---------------------------------------------------------- */
  function scrollToBottom() {
    chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
  }

  /* ----------------------------------------------------------
     BẬT / TẮT TRẠNG THÁI ĐANG GỬI
  ---------------------------------------------------------- */
  function setWaiting(waiting) {
    isWaitingResponse = waiting;
    if (sendBtn) {
      sendBtn.disabled = waiting;
      sendBtn.innerHTML = waiting
        ? '<i class="fa-solid fa-spinner fa-spin"></i>'
        : '<i class="fa-solid fa-paper-plane"></i>';
    }
    if (inputField) inputField.disabled = waiting;
    // Disable các nút gợi ý khi đang chờ
    document.querySelectorAll('.ai-suggest-btn').forEach(b => { b.disabled = waiting; });
  }

  /* ----------------------------------------------------------
     KIỂM TRA TRẠNG THÁI SERVER
  ---------------------------------------------------------- */
  async function checkServerStatus(showResult = true) {
    setStatus('loading', 'Đang kết nối...');
    try {
      const res = await fetch(API_STATUS_URL, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data.apiKeyConfigured) {
        setStatus('offline', 'Chưa cấu hình API key');
        showConfigWarning('Server đang chạy nhưng chưa có OPENAI_API_KEY. Xem hướng dẫn trong file .env.example.');
        return false;
      }

      setStatus('online', `Sẵn sàng – ${data.model || 'gpt-4o-mini'}`);
      hideConfigWarning();
      return true;

    } catch (err) {
      setStatus('offline', 'Không kết nối được server');
      if (showResult) {
        showConfigWarning(
          'Không tìm thấy backend server tại localhost:3000. ' +
          'Hãy chạy lệnh "node server.js" trong thư mục dự án.'
        );
      }
      return false;
    }
  }

  /* ----------------------------------------------------------
     GỬI TIN NHẮN ĐẾN API
  ---------------------------------------------------------- */
  async function sendMessage(userText) {
    const trimmed = userText.trim();
    if (!trimmed || isWaitingResponse) return;

    // Ẩn gợi ý sau lần hỏi đầu tiên
    if (suggestions) suggestions.style.display = 'none';

    // Hiển thị tin nhắn user
    appendMessage('user', safeEscape(trimmed));

    // Thêm vào lịch sử
    conversationHistory.push({ role: 'user', content: trimmed });
    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    }

    // Reset input
    if (inputField) {
      inputField.value = '';
      inputField.style.height = 'auto';
      updateCharCount('');
    }

    // Bắt đầu chờ
    setWaiting(true);
    const typingEl = appendTypingIndicator();

    try {
      const response = await fetch(API_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
        signal: AbortSignal.timeout(60000) // timeout 60s
      });

      removeTypingIndicator();

      const data = await response.json();

      if (!response.ok) {
        // Lỗi từ backend
        const errMsg = getErrorMessage(data.error, data.message);
        appendMessage('bot', `<p>⚠️ ${safeEscape(errMsg)}</p>`);

        // Nếu lỗi server/key, cập nhật trạng thái
        if (['no_api_key', 'invalid_api_key', 'quota_exceeded'].includes(data.error)) {
          setStatus('offline', 'Lỗi cấu hình API');
          showConfigWarning(data.message || 'Lỗi cấu hình API key.');
        }
        return;
      }

      const reply = data.reply;
      if (!reply) throw new Error('Phản hồi trống từ server.');

      // Thêm câu trả lời vào lịch sử
      conversationHistory.push({ role: 'assistant', content: reply });

      // Hiển thị câu trả lời (render markdown)
      appendMessage('bot', renderMarkdown(reply));
      setStatus('online', 'Sẵn sàng');

    } catch (err) {
      removeTypingIndicator();

      let errMsg = 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.';
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        errMsg = 'Yêu cầu quá thời gian chờ (60s). Có thể do mạng chậm hoặc câu hỏi quá phức tạp.';
      } else if (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        errMsg = 'Không thể kết nối đến server. Hãy đảm bảo đã chạy "node server.js".';
        setStatus('offline', 'Mất kết nối server');
        showConfigWarning('Mất kết nối. Khởi động lại backend rồi nhấn "Thử lại".');
      }

      appendMessage('bot', `<p>❌ ${safeEscape(errMsg)}</p>`);
    } finally {
      setWaiting(false);
    }
  }

  /* ----------------------------------------------------------
     ÁNH XẠ MÃ LỖI → THÔNG BÁO THÂN THIỆN
  ---------------------------------------------------------- */
  function getErrorMessage(errorCode, serverMessage) {
    const map = {
      no_api_key:       'Chưa cấu hình API key. Tạo file .env và thêm OPENAI_API_KEY.',
      invalid_api_key:  'API key không hợp lệ. Kiểm tra lại key tại platform.openai.com/api-keys.',
      rate_limit:       'Gửi quá nhiều yêu cầu. Vui lòng chờ vài phút rồi thử lại.',
      quota_exceeded:   'Tài khoản OpenAI hết quota. Kiểm tra billing tại platform.openai.com.',
      network_error:    'Server không kết nối được đến OpenAI. Kiểm tra kết nối internet của máy chủ.',
      empty_message:    'Tin nhắn không được để trống.',
      message_too_long: 'Câu hỏi quá dài (tối đa 2000 ký tự).',
      server_error:     'Lỗi server nội bộ. Vui lòng thử lại sau.',
    };
    return map[errorCode] || serverMessage || 'Đã xảy ra lỗi không xác định.';
  }

  /* ----------------------------------------------------------
     XÓA CUỘC TRÒ CHUYỆN
  ---------------------------------------------------------- */
  function clearConversation() {
    conversationHistory = [];

    // Xóa toàn bộ tin nhắn, giữ lại welcome message
    while (chatWindow.firstChild) chatWindow.removeChild(chatWindow.firstChild);

    // Thêm lại tin nhắn chào
    const welcomeEl = document.createElement('div');
    welcomeEl.className = 'ai-msg ai-msg-bot';
    welcomeEl.id = 'aiWelcomeMsg';
    welcomeEl.innerHTML = `
      <div class="ai-msg-avatar bot"><i class="fa-solid fa-robot"></i></div>
      <div class="ai-msg-content">
        <div class="ai-msg-bubble">
          <p>Cuộc trò chuyện đã được xóa. Hãy bắt đầu câu hỏi mới nhé! 🎓</p>
        </div>
        <span class="ai-msg-time">${getNow()}</span>
      </div>
    `;
    chatWindow.appendChild(welcomeEl);

    // Hiện lại gợi ý
    if (suggestions) suggestions.style.display = '';
  }

  /* ----------------------------------------------------------
     CẬP NHẬT ĐẾM KÝ TỰ
  ---------------------------------------------------------- */
  function updateCharCount(text) {
    if (!charCount) return;
    const len = text.length;
    charCount.textContent = `${len}/2000`;
    charCount.className = 'ai-char-count';
    if (len > 1800) charCount.classList.add('limit');
    else if (len > 1500) charCount.classList.add('warn');
  }

  /* ----------------------------------------------------------
     TỰ ĐỘNG RESIZE TEXTAREA
  ---------------------------------------------------------- */
  function autoResizeTextarea() {
    if (!inputField) return;
    inputField.style.height = 'auto';
    const maxH = 120;
    inputField.style.height = Math.min(inputField.scrollHeight, maxH) + 'px';
  }

  /* ----------------------------------------------------------
     GẮN SỰ KIỆN
  ---------------------------------------------------------- */

  // Nút Gửi
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const text = inputField ? inputField.value.trim() : '';
      if (text) sendMessage(text);
    });
  }

  // Phím Enter (gửi) / Shift+Enter (xuống dòng)
  if (inputField) {
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = inputField.value.trim();
        if (text && !isWaitingResponse) sendMessage(text);
      }
    });

    inputField.addEventListener('input', () => {
      updateCharCount(inputField.value);
      autoResizeTextarea();
    });
  }

  // Nút Xóa chat
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (conversationHistory.length === 0) return;
      if (confirm('Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện này không?')) {
        clearConversation();
      }
    });
  }

  // Nút Thử lại (retry kết nối)
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      retryBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang thử...';
      checkServerStatus(true).then(() => {
        retryBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Thử lại';
      });
    });
  }

  // Các nút câu hỏi gợi ý
  document.querySelectorAll('.ai-suggest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-q');
      if (q && !isWaitingResponse) {
        if (inputField) inputField.value = q;
        sendMessage(q);
      }
    });
  });

  // Khi chuyển sang Tab AI Assistant → kiểm tra server
  document.querySelectorAll('.demo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.getAttribute('data-tab') === 'ai-assistant') {
        checkServerStatus(true);
      }
    });
  });

  /* ----------------------------------------------------------
     KIỂM TRA ĐỊNH KỲ (chỉ khi tab đang active)
  ---------------------------------------------------------- */
  function startPeriodicCheck() {
    if (statusCheckTimer) clearInterval(statusCheckTimer);
    statusCheckTimer = setInterval(() => {
      const activeTab = document.querySelector('.demo-tab.active');
      if (activeTab && activeTab.getAttribute('data-tab') === 'ai-assistant') {
        checkServerStatus(false);
      }
    }, STATUS_INTERVAL);
  }

  /* ----------------------------------------------------------
     KHỞI ĐỘNG – Kiểm tra server khi load trang
  ---------------------------------------------------------- */
  // Kiểm tra ngay nếu URL chứa #demo, hoặc sau khi DOM ổn định
  setTimeout(() => {
    checkServerStatus(true);
    startPeriodicCheck();
  }, 800);

  console.log('%c EduLife AI Assistant v1.0 ✅ ', 'background:#10b981;color:#fff;font-size:12px;padding:4px 8px;border-radius:4px;');
})();
