// --- DDWFLY POST BANK LITE CORE LOGIC ---

let postBankData = []; // Menyimpan data draf artikel
let internalLinksData = []; // Menyimpan data internal link
let highCpcNicheDataLocal = []; // Menyimpan data niche CPC tinggi
let activeTab = 'posts'; // Default tab

// 1. Fungsi Ganti Halaman (Section)
function switchSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
    }
}

// Fungsi Ganti Tab (Sub-Section)
function switchTab(tabId) {
    activeTab = tabId;

    // UI Update Buttons
    const tabPostsBtn = document.getElementById('tab-posts');
    const tabLinksBtn = document.getElementById('tab-links');
    const tabNicheBtn = document.getElementById('tab-niche');

    // Hide all containers
    document.getElementById('posts-container').style.display = 'none';
    document.getElementById('links-container').style.display = 'none';
    document.getElementById('niche-container').style.display = 'none';

    // Reset buttons
    tabPostsBtn.classList.remove('active');
    tabLinksBtn.classList.remove('active');
    tabNicheBtn.classList.remove('active');

    if (tabId === 'posts') {
        tabPostsBtn.classList.add('active');
        document.getElementById('posts-container').style.display = 'block';
        switchSection('posts-container');
    } else if (tabId === 'links') {
        tabLinksBtn.classList.add('active');
        document.getElementById('links-container').style.display = 'block';
        switchSection('links-container');
    } else if (tabId === 'niche') {
        tabNicheBtn.classList.add('active');
        document.getElementById('niche-container').style.display = 'block';
        switchSection('niche-container');
    }

    // Reset search input when switching
    document.getElementById('post-search').value = '';
    filterData();
}

// 2. Fungsi Modal (Viewer)
function openModal(modalType) {
    const modal = document.getElementById('modal-post-viewer');
    if (modalType === 'post-viewer' && modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalType) {
    const modal = document.getElementById('modal-post-viewer');
    if (modalType === 'post-viewer' && modal) {
        modal.style.display = 'none';
    }
}

// 3. Load Data
async function loadAllData() {
    await loadPostBank();
    await loadInternalLinks();
    await loadHighCpcNiche();
}

async function loadPostBank() {
    const statusEl = document.getElementById('post-status');
    if (!statusEl) return;
    statusEl.innerHTML = '<i class="bi bi-cpu spin"></i> Memuat gudang draf...';

    const deletedUrls = JSON.parse(localStorage.getItem('ddwfly_deleted_urls') || '[]');

    try {
        const response = await fetch('post_bank.json?t=' + new Date().getTime());
        const data = await response.json();
        // Sortir: Tanggal terbaru di atas
        data.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        postBankData = data.filter(item => !deletedUrls.includes(item.url));

        renderPostBank(postBankData);
        statusEl.innerHTML = `<i class="bi bi-check-circle-fill"></i> Connected! <b>${postBankData.length} artikel</b> siap dipublish.`;
    } catch (err) {
        console.warn("Fetch post_bank gagal, menggunakan mode offline...");
        if (typeof offlinePostData !== 'undefined' && offlinePostData.length > 0) {
            // Sortir offline data juga
            offlinePostData.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
            postBankData = offlinePostData.filter(item => !deletedUrls.includes(item.url));
            renderPostBank(postBankData);
            statusEl.innerHTML = `<i class="bi bi-shield-check"></i> Offline Secure! <b>${postBankData.length} draf</b> terbaca (Gudang Lokal).`;
        } else {
            statusEl.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Gudang draf masih kosong nih, Pak.';
        }
    }
}

async function loadInternalLinks() {
    const statusEl = document.getElementById('link-status');
    if (!statusEl) return;
    statusEl.innerHTML = '<i class="bi bi-cpu spin"></i> Memuat database link...';

    const deletedUrls = JSON.parse(localStorage.getItem('ddwfly_deleted_urls') || '[]');

    try {
        const response = await fetch('internal_links.json?t=' + new Date().getTime());
        const data = await response.json();
        // Urutan link mengikuti file JSON (yang terbaru sudah di atas)
        internalLinksData = data.filter(item => !deletedUrls.includes(item.url));

        renderInternalLinks(internalLinksData);
        statusEl.innerHTML = `<i class="bi bi-link-45deg"></i> Database Link: <b>${internalLinksData.length} item</b> tersedia.`;
    } catch (err) {
        console.warn("Fetch links gagal, menggunakan mode offline...");
        if (typeof offlineLinksData !== 'undefined' && offlineLinksData.length > 0) {
            // Urutan link mengikuti file JSON (yang terbaru sudah di atas)
            internalLinksData = [...offlineLinksData].filter(item => !deletedUrls.includes(item.url));
            renderInternalLinks(internalLinksData);
            statusEl.innerHTML = `<i class="bi bi-link-45deg"></i> Offline Mode: <b>${internalLinksData.length} link</b> aktif.`;
        } else {
            statusEl.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Database link kosong.';
        }
    }
}

async function loadHighCpcNiche() {
    const statusEl = document.getElementById('niche-status');
    if (!statusEl) return;
    statusEl.innerHTML = '<i class="bi bi-cpu spin"></i> Memuat data niche...';

    try {
        const response = await fetch('high_cpc_niche.json?t=' + new Date().getTime());
        highCpcNicheDataLocal = await response.json();
        renderHighCpcNiche(highCpcNicheDataLocal);
        statusEl.innerHTML = `<i class="bi bi-gem"></i> Terdeteksi <b>${highCpcNicheDataLocal.length} Niche Golden</b> dengan CPC tinggi.`;
    } catch (err) {

        if (typeof highCpcNicheData !== 'undefined') {
            highCpcNicheDataLocal = highCpcNicheData;
            renderHighCpcNiche(highCpcNicheDataLocal);
            statusEl.innerHTML = `<i class="bi bi-gem"></i> Mode Offline: Memuat data niche internal.`;
        } else {
            statusEl.innerHTML = 'Data niche CPC tinggi gagal dimuat.';
        }
    }
}

// 4. Render Tabel
function renderPostBank(data) {
    const listBody = document.getElementById('post-list-body');
    if (!listBody) return;
    listBody.innerHTML = '';

    if (!data || data.length === 0) {
        listBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 4rem; color: var(--text-dim); opacity: 0.5;">Belum ada artikel yang tersimpan. Ayo buat satu!</td></tr>';
        return;
    }

    data.forEach((article, index) => {
        const row = document.createElement('tr');
        const safeMeta = (article.meta_description || '').replace(/['"`]/g, '').replace(/\s+/g, ' ').trim();
        const safeLabels = (Array.isArray(article.labels) ? article.labels.join(', ') : (article.labels || '')).replace(/['"`]/g, '').replace(/\s+/g, ' ').trim();

        row.innerHTML = `
            <td class="date-cell"><i class="bi bi-calendar3"></i> ${article.date || '---'}</td>
            <td class="title-cell">${article.title}</td>
            <td class="label-cell">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 0.75rem; background: rgba(124, 77, 255, 0.1); color: var(--accent); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(124, 77, 255, 0.2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${safeLabels || 'No Label'}
                    </span>
                    <button class="btn btn-ghost" style="padding: 4px; font-size: 0.7rem;" onclick="copyToClipboard('${safeLabels}')" title="Salin Label">
                        <i class="bi bi-tags"></i>
                    </button>
                </div>
            </td>
            <td class="meta-cell">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; font-size: 0.85rem;" title="${safeMeta}">
                        ${article.meta_description || 'No description...'}
                    </span>
                    <button class="btn btn-ghost" style="padding: 4px; font-size: 0.7rem;" onclick="copyToClipboard('${safeMeta}')" title="Salin Meta">
                        <i class="bi bi-clipboard-plus"></i>
                    </button>
                </div>
            </td>
            <td>
                <div class="action-wrapper">
                    <button class="btn-view" onclick="viewArticle('${article.url}')">
                        <i class="bi bi-eye-fill"></i> LIHAT
                    </button>
                    <button class="btn-delete" onclick="deleteArticle('${article.url}')" title="Hapus Permanen">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </div>
            </td>
        `;
        listBody.appendChild(row);
    });
}

function deleteArticle(articleUrl) {
    const article = postBankData.find(a => a.url === articleUrl);
    if (!article) return;

    if (confirm(`Sobat yakin mau hapus artikel "${article.title}"?\nLink di database juga akan otomatis terhapus.`)) {
        let deletedUrls = JSON.parse(localStorage.getItem('ddwfly_deleted_urls') || '[]');
        if (!deletedUrls.includes(articleUrl)) {
            deletedUrls.push(articleUrl);
            localStorage.setItem('ddwfly_deleted_urls', JSON.stringify(deletedUrls));
        }

        postBankData = postBankData.filter(a => a.url !== articleUrl);
        internalLinksData = internalLinksData.filter(link => link.url !== articleUrl);

        filterData(); // Refresh UI while respecting search
        renderInternalLinks(internalLinksData);
        copyToClipboard('Siyapp! Artikel dan link sudah terhapus secara lokal.');
    }
}

function renderInternalLinks(data) {
    const listBody = document.getElementById('link-list-body');
    if (!listBody) return;
    listBody.innerHTML = '';

    if (!data || data.length === 0) {
        listBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 4rem; color: var(--text-dim); opacity: 0.5;">Database link internal kosong.</td></tr>';
        return;
    }

    data.forEach((link) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="title-cell" style="color: var(--accent); font-weight: 500;">${link.title}</td>
            <td class="meta-cell" style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; background: rgba(0,210,255,0.03); border-radius: 8px; padding: 0.4rem 0.8rem; border: 1px solid rgba(0,210,255,0.1);">
                <a href="${link.url}" target="_blank" style="color: var(--accent); text-decoration: none; display: flex; align-items: center; gap: 5px;">
                    <i class="bi bi-box-arrow-up-right" style="font-size: 0.7rem;"></i> ${link.url}
                </a>
            </td>
            <td style="text-align: center;">
                <button class="btn btn-ghost" style="padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.8rem; color: var(--accent); border-color: rgba(0,210,255,0.2);" onclick="copyToClipboard('${link.url}')">
                    <i class="bi bi-clipboard"></i> SALIN
                </button>
            </td>
        `;
        listBody.appendChild(row);
    });
}

function renderHighCpcNiche(data) {
    const listBody = document.getElementById('niche-list-body');
    if (!listBody) return;
    listBody.innerHTML = '';

    const usedKeywords = JSON.parse(localStorage.getItem('ddwfly_used_keywords') || '[]');

    data.forEach((item) => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid rgba(255,255,255,0.03)';

        row.innerHTML = `
            <td class="title-cell" style="padding: 1.2rem 1rem; vertical-align: top;">
                <div style="font-weight: 800; font-size: 1.1rem; color: #fff; margin-bottom: 10px;">${item.topic}</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                    <span style="background: var(--accent); color: #fff; font-size: 0.6rem; font-weight: 900; padding: 2px 5px; border-radius: 4px; text-transform: uppercase;">Labels</span>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px; flex: 1;">
                        ${item.labels.split(',').map(label => `<span style="font-size: 0.7rem; color: var(--text-dim); background: rgba(255,255,255,0.03); padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); white-space: nowrap;">${label.trim()}</span>`).join('')}
                    </div>
                    <button class="btn-ghost" style="padding: 2px 4px; font-size: 0.7rem; color: var(--accent);" onclick="copyToClipboard('${item.labels}')" title="Salin Semua Label">
                        <i class="bi bi-tags"></i>
                    </button>
                </div>
            </td>
            <td style="padding: 1.2rem 1rem; vertical-align: top; width: 140px;">
                <div style="color: var(--success); font-weight: 800; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">${item.cpc}</div>
                <div style="font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; margin-top: 4px; letter-spacing: 1px;">E-value</div>
            </td>
            <td class="meta-cell" style="padding: 1.2rem 1rem; min-width: 300px; vertical-align: top;">
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${item.keywords.map(kw => {
            // Cek apakah sudah ada di bank draf atau ditandai manual
            const existsInBank = postBankData.some(a => a.title.toLowerCase().includes(kw.toLowerCase()));
            const isUsed = usedKeywords.includes(kw) || existsInBank;

            return `
                            <div style="display: flex; align-items: stretch; border-radius: 6px; overflow: hidden; border: 1px solid ${isUsed ? 'var(--success)' : 'rgba(255,255,255,0.08)'}; background: ${isUsed ? 'rgba(0, 230, 118, 0.03)' : 'rgba(255,255,255,0.02)'};">
                                <button class="btn btn-ghost" 
                                        style="flex: 1; text-align: left; justify-content: flex-start; padding: 6px 12px; font-size: 0.8rem; border: none; color: ${isUsed ? 'var(--success)' : 'var(--text-main)'}; ${isUsed ? 'text-decoration: line-through; opacity: 0.6;' : ''}" 
                                        onclick="copyToClipboard('/write-post ${kw}')">
                                    <i class="bi ${isUsed ? 'bi-check-all' : 'bi-pencil-square'}" style="margin-right: 8px; color: ${isUsed ? 'var(--success)' : 'var(--accent)'};"></i> ${kw}
                                </button>
                                <button onclick="toggleKeywordStatus('${kw.replace(/'/g, "\\'")}')" 
                                        style="width: 32px; border: none; border-left: 1px solid ${isUsed ? 'var(--success)' : 'rgba(255,255,255,0.08)'}; background: ${isUsed ? 'var(--success)' : 'transparent'}; color: ${isUsed ? '#fff' : 'var(--text-dim)'}; cursor: pointer;">
                                    <i class="bi bi-check-lg" style="font-size: 0.8rem;"></i>
                                </button>
                            </div>
                        `;
        }).join('')}
                </div>
            </td>

            <td style="padding: 1.2rem 1rem; text-align: center; vertical-align: top; width: 80px;">
                <button class="btn btn-ghost" style="width: 38px; height: 38px; border-radius: 10px; font-size: 1rem;" onclick="copyToClipboard('${item.topic}')" title="Salin Judul Topik">
                    <i class="bi bi-clipboard-pulse"></i>
                </button>
            </td>
        `;
        listBody.appendChild(row);
    });
}

// Fungsi Baru: Toggle Status Kata kunci ( Checklist Permanen )
function toggleKeywordStatus(keyword) {
    let usedKeywords = JSON.parse(localStorage.getItem('ddwfly_used_keywords') || '[]');
    let statusMsg = "";

    if (usedKeywords.includes(keyword)) {
        // Jika sudah ada, hapus (uncheck)
        usedKeywords = usedKeywords.filter(kw => kw !== keyword);
        statusMsg = "🔄 Status: Belum Selesai.";
    } else {
        // Jika belum ada, tambahkan
        usedKeywords.push(keyword);
        statusMsg = "✅ Berhasil: Ditandai Selesai!";
    }

    localStorage.setItem('ddwfly_used_keywords', JSON.stringify(usedKeywords));
    showToast(statusMsg);
    renderHighCpcNiche(highCpcNicheDataLocal);
}

// 5. Fitur Cari
function filterData() {
    const term = document.getElementById('post-search').value.toLowerCase();

    if (activeTab === 'posts') {
        const filtered = postBankData.filter(art =>
            art.title.toLowerCase().includes(term) ||
            (art.meta_description && art.meta_description.toLowerCase().includes(term))
        );
        renderPostBank(filtered);
    } else if (activeTab === 'links') {
        const filtered = internalLinksData.filter(link =>
            link.title.toLowerCase().includes(term) ||
            link.url.toLowerCase().includes(term)
        );
        renderInternalLinks(filtered);
    } else {
        const filtered = highCpcNicheDataLocal.filter(nic =>
            nic.topic.toLowerCase().includes(term) ||
            nic.category.toLowerCase().includes(term) ||
            nic.keywords.some(k => k.toLowerCase().includes(term))
        );
        renderHighCpcNiche(filtered);
    }
}

// 6. Lihat Isi Artikel
function viewArticle(articleUrl) {
    const article = postBankData.find(a => a.url === articleUrl);
    if (!article) return;
    const modalTitle = document.getElementById('viewer-title');
    const modalContent = document.getElementById('viewer-content');
    if (modalTitle && modalContent) {
        modalTitle.innerText = article.title;

        // Show actual content vs placeholder content alert
        if (article.content_html.trim().startsWith('<!--') && article.content_html.length < 100) {
            modalContent.innerHTML = `<div style="padding: 4rem 2rem; text-align: center; color: #636e72;">
                <i class="bi bi-cone-striped" style="font-size: 4rem; color: #00d2ff; margin-bottom: 1rem; display: block;"></i>
                <h3 style="color: #2d3436; margin-bottom: 0.8rem; font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.5rem;">Belum Ada Konten Utuh</h3>
                <p style="font-family: 'Inter', sans-serif; margin-bottom: 1.5rem;">Artikel ini hanya berisi HTML Placeholder <code>${article.content_html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>.</p>
                <p style="font-family: 'Inter', sans-serif;">Silakan hasilkan artikel utuhnya menggunakan AI dengan perintah:<br><br>
                <b style="background: rgba(138,43,226,0.1); color: #8a2be2; padding: 10px 20px; border-radius: 8px; font-size: 1.1rem;">/write-post ${article.title}</b></p>
            </div>`;
        } else {
            modalContent.innerHTML = article.content_html;
        }

        openModal('post-viewer');
    }
}

// 7. Utility
function showToast(message) {
    const alertBox = document.createElement('div');
    alertBox.style.cssText = 'position: fixed; bottom: 2rem; right: 2rem; background: var(--success); color: white; padding: 1rem 2rem; border-radius: 12px; z-index: 10000; font-weight: 700; box-shadow: 0 10px 30px rgba(0,230,118,0.3); animation: slideUp 0.3s ease;';
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => alertBox.remove(), 300);
    }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ Berhasil disalin ke clipboard!');
    });
}

function copyViewerContent() {
    const content = document.getElementById('viewer-content').innerHTML;
    copyToClipboard(content);
}

// 8. Pengaturan
function saveApiKey() {
    const key = document.getElementById('api-key-input').value;
    if (key) localStorage.setItem('ddwfly_api_key', key);
    copyToClipboard('Siyapp! Pengaturan tersimpan aman.');
    switchTab('posts');
}

// Start Application
window.onload = () => {
    loadAllData();
    const savedKey = localStorage.getItem('ddwfly_api_key');
    if (savedKey) {
        document.getElementById('api-key-input').value = savedKey;
    }
};
