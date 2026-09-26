// app.js — logic dùng chung cho trang chủ, trang mục lục và trang đọc chương.
// Toàn bộ dữ liệu tiểu thuyết nằm trong data/novels.json

async function loadNovels() {
  const res = await fetch('data/novels.json');
  if (!res.ok) throw new Error('Không tải được data/novels.json');
  const data = await res.json();
  return data.novels || [];
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Trang chủ ----
async function renderHome() {
  const shelf = document.getElementById('shelf');
  try {
    const novels = await loadNovels();
    if (novels.length === 0) {
      shelf.innerHTML = '<div class="empty-state">Chưa có tiểu thuyết nào. Thêm một mục vào data/novels.json để bắt đầu.</div>';
      return;
    }
    shelf.innerHTML = novels.map(n => `
      <a class="book" href="novel.html?slug=${encodeURIComponent(n.slug)}">
        <div class="book__spine" style="background:${n.cover_color || '#3B5D50'}">
          <span class="book__title">${escapeHtml(n.title)}</span>
          <span class="book__author">${escapeHtml(n.author || '')}</span>
        </div>
        <div class="book__meta">${(n.chapters || []).length} chương</div>
        ${n.status ? `<div class="book__status">${escapeHtml(n.status)}</div>` : ''}
      </a>
    `).join('');
  } catch (err) {
    shelf.innerHTML = `<div class="error-state">${escapeHtml(err.message)}</div>`;
  }
}

// ---- Trang mục lục tiểu thuyết ----
async function renderNovel() {
  const slug = getParam('slug');
  const root = document.getElementById('novel-root');
  try {
    const novels = await loadNovels();
    const novel = novels.find(n => n.slug === slug);
    if (!novel) {
      root.innerHTML = '<div class="error-state">Không tìm thấy tiểu thuyết này.</div>';
      return;
    }
    document.title = novel.title;
    root.innerHTML = `
      <div class="novel-header">
        <h1 class="novel-title">${escapeHtml(novel.title)}</h1>
        <div class="novel-author">${escapeHtml(novel.author || '')}${novel.status ? ' · ' + escapeHtml(novel.status) : ''}</div>
        <p class="novel-desc">${escapeHtml(novel.description || '')}</p>
      </div>
      <h2 class="toc-heading">Mục lục</h2>
      <ul class="toc-list">
        ${(novel.chapters || []).map(c => `
          <li>
            <a href="chapter.html?slug=${encodeURIComponent(novel.slug)}&ch=${c.id}">
              <span class="toc-list__num">${String(c.id).padStart(2, '0')}</span>
              <span class="toc-list__title">${escapeHtml(c.title)}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    `;
  } catch (err) {
    root.innerHTML = `<div class="error-state">${escapeHtml(err.message)}</div>`;
  }
}

// ---- Trang đọc chương ----
async function renderChapter() {
  const slug = getParam('slug');
  const chId = Number(getParam('ch'));
  const root = document.getElementById('chapter-root');
  try {
    const novels = await loadNovels();
    const novel = novels.find(n => n.slug === slug);
    if (!novel) {
      root.innerHTML = '<div class="error-state">Không tìm thấy tiểu thuyết này.</div>';
      return;
    }
    const chapters = novel.chapters || [];
    const idx = chapters.findIndex(c => c.id === chId);
    const chapter = chapters[idx];
    if (!chapter) {
      root.innerHTML = '<div class="error-state">Không tìm thấy chương này.</div>';
      return;
    }
    document.title = `${chapter.title} — ${novel.title}`;

    const prev = chapters[idx - 1];
    const next = chapters[idx + 1];

    const textRes = await fetch(`data/chapters/${chapter.file}`);
    const text = textRes.ok ? await textRes.text() : 'Không tải được nội dung chương.';
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).map(p => `<p>${escapeHtml(p.trim())}</p>`).join('');

    root.innerHTML = `
      <nav class="reader-nav">
        <a href="novel.html?slug=${encodeURIComponent(novel.slug)}">← ${escapeHtml(novel.title)}</a>
        <a href="index.html">Thư viện</a>
      </nav>
      <div class="chapter-eyebrow">${escapeHtml(novel.title)}</div>
      <h1 class="chapter-title">${escapeHtml(chapter.title)}</h1>
      <div class="chapter-body">${paragraphs}</div>
      <div class="reader-footer-nav">
        <a class="${prev ? '' : 'is-disabled'}" href="${prev ? `chapter.html?slug=${encodeURIComponent(novel.slug)}&ch=${prev.id}` : '#'}">← Chương trước</a>
        <a class="${next ? '' : 'is-disabled'}" href="${next ? `chapter.html?slug=${encodeURIComponent(novel.slug)}&ch=${next.id}` : '#'}">Chương sau →</a>
      </div>
    `;
  } catch (err) {
    root.innerHTML = `<div class="error-state">${escapeHtml(err.message)}</div>`;
  }
}
