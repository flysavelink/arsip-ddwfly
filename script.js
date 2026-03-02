// --- DDWFLY POST BANK LITE CORE LOGIC ---

let postBankData = []; // Menyimpan data draf artikel
let internalLinksData = []; // Menyimpan data internal link
let highCpcNicheDataLocal = []; // Menyimpan data niche CPC tinggi
let activeTab = 'posts'; // Default tab
let currentOpenedArticleUrl = ''; // Menyimpan URL artikel yang sedang dilihat

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
    const modalView = document.getElementById('modal-post-viewer');
    const modalHook = document.getElementById('modal-hook-viewer');
    const modalLinkedIn = document.getElementById('modal-linkedin-viewer');
    const modalPinterest = document.getElementById('modal-pinterest-viewer');

    if (modalType === 'post-viewer' && modalView) {
        modalView.style.display = 'none';
    } else if (modalType === 'hook-viewer' && modalHook) {
        modalHook.style.display = 'none';
    } else if (modalType === 'linkedin-viewer' && modalLinkedIn) {
        modalLinkedIn.style.display = 'none';
    } else if (modalType === 'pinterest-viewer' && modalPinterest) {
        modalPinterest.style.display = 'none';
    }
}

// 2.1 Fungsi Hook Medium
function openHookModal() {
    if (!currentOpenedArticleUrl) return;
    const article = postBankData.find(a => a.url === currentOpenedArticleUrl);
    if (!article) return;

    const hookContent = document.getElementById('hook-content');
    if (hookContent) {
        hookContent.innerText = generateMediumHook(article);
        const modal = document.getElementById('modal-hook-viewer');
        if (modal) modal.style.display = 'flex';
    }
}

function generateMediumHook(article) {
    const title = article.title;
    const url = article.url;
    const meta = article.meta_description || "Informasi terbaru dari ddwfly.com";

    return `(Dikutip dari ddwfly.com)\n\n# ${title}\n\nJujurly, sebagai orang yang sudah lama berkecimpung di dunia informasi digital, saya merasa topik ini sangat krusial untuk kita bahas di tahun 2026. Banyak orang yang masih bingung bagaimana memulai atau menghadapi tantangan di bidang ini.\n\n${meta}\n\nSaya sudah merangkum panduan lengkapnya secara mendalam, santai, dan profesional (Edisi Lihlas) yang bisa Sobat baca langsung sekarang juga.\n\nBaca selengkapnya di sini:\n👉 ${url}\n\nSemoga bermanfaat, dan mari kita diskusi lebih lanjut!\n#ddwfly #LihlasReview #BlogIndonesia #SEO2026`;
}

function copyHookContent() {
    const content = document.getElementById('hook-content').innerText;
    copyToClipboard(content);
    closeModal('hook-viewer');
}

// 2.2 Fungsi Hook LinkedIn
function openLinkedInModal() {
    if (!currentOpenedArticleUrl) return;
    const article = postBankData.find(a => a.url === currentOpenedArticleUrl);
    if (!article) return;

    const linkedinContent = document.getElementById('linkedin-content');
    if (linkedinContent) {
        linkedinContent.innerText = generateLinkedInHook(article);
        const modal = document.getElementById('modal-linkedin-viewer');
        if (modal) modal.style.display = 'flex';
    }
}

function generateLinkedInHook(article) {
    const title = article.title;
    const url = article.url;
    const labels = article.labels ? article.labels.join(', ') : 'Professional';
    const meta = article.meta_description || "Update insight terbaru untuk industri Anda di 2026.";

    return `Menarik untuk mengamati bagaimana lanskap ${labels} berkembang pesat di awal tahun 2026 ini.\n\nSaya baru saja mendalami sebuah topik krusial: "${title}".\n\nBeberapa poin penting yang saya temukan:\n✅ Relevansi di era teknologi terbaru\n✅ Langkah strategis untuk efisiensi\n✅ Insight yang sering dilewatkan banyak profesional\n\n"${meta}"\n\nBagi rekan-rekan yang ingin diskusi lebih lanjut atau butuh panduan teknisnya, silakan cek ringkasan lengkap yang saya tulis di ddwfly.com berikut ini.\n\nLink Insight:\n🔗 ${url}\n\nMari kita terus bertumbuh dan berbagi manfaat.\n#LinkedInInsight #ProfessionalUpdate2026 #IndustryInsight #ddwfly #LihlasExpert`;
}

function copyLinkedInContent() {
    const content = document.getElementById('linkedin-content').innerText;
    copyToClipboard(content);
    closeModal('linkedin-viewer');
}

// 2.3 Fungsi Hook Pinterest
function openPinterestModal() {
    if (!currentOpenedArticleUrl) return;
    const article = postBankData.find(a => a.url === currentOpenedArticleUrl);
    if (!article) return;

    const pinterestContent = document.getElementById('pinterest-content');
    if (pinterestContent) {
        pinterestContent.innerText = generatePinterestHook(article);
        const modal = document.getElementById('modal-pinterest-viewer');
        if (modal) modal.style.display = 'flex';
    }
}

function generatePinterestHook(article) {
    const title = article.title;
    const url = article.url;
    const meta = article.meta_description || "Panduan visual terbaru untuk inspirasi harian Anda.";
    const tags = article.labels ? article.labels.map(l => `#${l.replace(/\s+/g, '')}`).join(' ') : '#Inspirasi';

    return `📍 ${title}\n\n${meta}\n\n💾 Simpan pin ini untuk referensi nanti! Cek panduan lengkapnya untuk detail dan tips lebih mendalam.\n\nBaca selengkapnya di sini:\n🔗 ${url}\n\n#ddwfly #LihlasReview #PinterestTips #BlogIndonesia ${tags}`;
}

function copyPinterestContent() {
    const content = document.getElementById('pinterest-content').innerText;
    copyToClipboard(content);
    closeModal('pinterest-viewer');
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
        listBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 4rem; color: var(--text-dim); opacity: 0.5;">Belum ada artikel yang tersimpan. Ayo buat satu!</td></tr>';
        return;
    }

    data.forEach((article) => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid rgba(255,255,255,0.03)';

        const safeMeta = (article.meta_description || '').replace(/['"`]/g, '').replace(/\s+/g, ' ').trim();
        const rawLabels = Array.isArray(article.labels) ? article.labels.join(', ') : (article.labels || '');
        const safeLabels = rawLabels.replace(/['"`]/g, '').replace(/\s+/g, ' ').trim();

        row.innerHTML = `
            <td style="padding: 1.5rem 1rem; vertical-align: top; width: 13%;">
                <div style="font-size: 0.8rem; color: var(--text-dim); font-weight: 500; display: flex; align-items: center; gap: 6px;">
                    <i class="bi bi-calendar3" style="font-size: 0.75rem;"></i> ${article.date || '---'}
                </div>
            </td>
            <td style="padding: 1.5rem 1rem; vertical-align: top; width: 27%;">
                <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); line-height: 1.4;">${article.title}</div>
            </td>
            <td style="padding: 1.5rem 1rem; vertical-align: top; width: 15%;">
                <div style="display: flex; align-items: flex-start; gap: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 5px; flex: 1;">
                        ${rawLabels.split(',').map(label => `<span class="badge" style="font-size: 0.6rem; padding: 3px 8px; border-radius: 6px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); width: fit-content; display: block;">${label.trim()}</span>`).join('')}
                    </div>
                    <button class="btn btn-icon btn-ghost" style="width: 28px; height: 28px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);" onclick="copyToClipboard('${safeLabels}')" title="Salin Label">
                        <i class="bi bi-tags" style="font-size: 0.8rem;"></i>
                    </button>
                </div>
            </td>
            <td style="padding: 1.5rem 1rem; vertical-align: top; width: 35%;">
                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 12px;">
                    <div style="flex: 1; font-size: 0.8rem; color: var(--text-dim); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        ${article.meta_description || 'No description available...'}
                    </div>
                    <button class="btn btn-icon btn-ghost" style="width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); flex-shrink: 0;" onclick="copyToClipboard('${safeMeta}')" title="Salin Meta Description">
                        <i class="bi bi-clipboard2-check" style="font-size: 0.85rem;"></i>
                    </button>
                </div>
            </td>
            <td style="padding: 1.5rem 1rem; text-align: center; vertical-align: top; width: 10%;">
                <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                    <button class="btn btn-primary" style="padding: 8px 0; width: 100%; font-size: 0.75rem; border-radius: 8px;" onclick="viewArticle('${article.url}')">
                        <i class="bi bi-eye"></i> BUKA
                    </button>
                    <button class="btn btn-ghost" style="padding: 6px 0; width: 100%; font-size: 0.75rem; border-radius: 8px; border-color: rgba(255, 68, 68, 0.2); color: #ff4444;" onclick="deleteArticle('${article.url}')">
                        <i class="bi bi-trash3"></i> Hapus
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
        row.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
        row.innerHTML = `
            <td style="padding: 1.5rem 1rem; vertical-align: middle;">
                <div style="color: var(--text-main); font-weight: 600; font-size: 0.95rem;">${link.title}</div>
            </td>
            <td style="padding: 1.5rem 1rem; vertical-align: middle; word-break: break-all;">
                <a href="${link.url}" target="_blank" style="color: var(--accent); text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; opacity: 0.8;">
                    <i class="bi bi-link-45deg" style="font-size: 1.1rem;"></i> <span>${link.url}</span>
                </a>
            </td>
            <td style="padding: 1.5rem 1rem; text-align: center; vertical-align: middle;">
                <button class="btn btn-icon btn-ghost" style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);" onclick="copyToClipboard('${link.url}')" title="Salin URL">
                    <i class="bi bi-clipboard" style="font-size: 1rem;"></i>
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
            <!-- KOLOM 1: TOPIK -->
            <td style="vertical-align: top; padding: 1.5rem 1rem; width: 18%;">
                <div class="gold-text" style="font-size: 1.1rem; line-height: 1.4; font-weight: 800; letter-spacing: -0.2px;">${item.topic}</div>
            </td>

            <!-- KOLOM 2: LABEL -->
            <td style="vertical-align: top; padding: 1.5rem 1rem; width: 12%;">
                <div style="display: flex; align-items: flex-start; gap: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 6px; flex: 1;">
                        ${item.labels.split(',').map(label => `<span class="badge" style="font-size: 0.6rem; padding: 4px 10px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); width: fit-content; display: block;">${label.trim()}</span>`).join('')}
                    </div>
                    <button class="btn btn-icon btn-ghost" style="width: 32px; height: 32px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);" onclick="copyToClipboard('${item.labels}')" title="Salin Label">
                        <i class="bi bi-folder-symlink" style="font-size: 0.9rem;"></i>
                    </button>
                </div>
            </td>

            <!-- KOLOM 3: CPC -->
            <td style="vertical-align: top; padding: 1.5rem 1rem; width: 18%; text-align: center;">
                <div class="cpc-badge-premium" style="display: flex; flex-direction: column; width: 100%; padding: 14px 10px; gap: 6px; border-radius: 16px; border: 1px solid rgba(255, 215, 0, 0.2); background: linear-gradient(145deg, rgba(255, 215, 0, 0.08), rgba(255, 215, 0, 0.02));">
                    <div style="font-size: 1.2rem; font-weight: 950; color: #ffd700; text-shadow: 0 2px 10px rgba(255, 215, 0, 0.2);">
                        <i class="bi bi-currency-dollar"></i> ${item.cpc}
                    </div>
                    <div style="font-size: 0.55rem; color: rgba(255, 215, 0, 0.6); text-transform: uppercase; font-weight: 800; letter-spacing: 2px;">Value Est.</div>
                </div>
            </td>

            <!-- KOLOM 4: KATA KUNCI -->
            <td style="vertical-align: top; padding: 1.5rem 1rem; width: 44%;">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${item.keywords.map(kw => {
            const existsInBank = postBankData.some(a => a.title.toLowerCase().includes(kw.toLowerCase()));
            const isUsed = usedKeywords.includes(kw) || existsInBank;

            return `
                            <div class="keyword-pill ${isUsed ? 'used' : ''}" style="border-radius: 12px; border: 1px solid ${isUsed ? 'rgba(0, 255, 163, 0.3)' : 'rgba(255,255,255,0.08)'}; background: ${isUsed ? 'rgba(0, 255, 163, 0.05)' : 'rgba(255,255,255,0.02)'}; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <div class="kw-icon" style="width: 36px; min-width: 36px; display: flex; align-items: center; justify-content: center; background: ${isUsed ? 'rgba(0, 255, 163, 0.1)' : 'rgba(255,255,255,0.03)'}; border-right: 1px solid ${isUsed ? 'rgba(0, 255, 163, 0.2)' : 'rgba(255,255,255,0.08)'}; color: ${isUsed ? 'var(--success)' : 'var(--accent)'};">
                                    <i class="bi ${isUsed ? 'bi-patch-check-fill' : 'bi-lightning-charge-fill'}" style="font-size: 0.9rem;"></i>
                                </div>
                                <button class="btn btn-ghost" 
                                        style="flex: 1; text-align: left; justify-content: flex-start; padding: 10px 15px; font-size: 0.85rem; border: none; font-weight: 600; color: ${isUsed ? 'var(--success)' : 'var(--text-main)'}; ${isUsed ? 'text-decoration: line-through; opacity: 0.6;' : ''}" 
                                        onclick="copyToClipboard('/write-post ${kw}')" title="Gunakan Keyword">
                                    ${kw}
                                </button>
                                <button onclick="toggleKeywordStatus('${kw.replace(/'/g, "\\'")}')" 
                                        style="width: 42px; border: none; border-left: 1px solid ${isUsed ? 'rgba(0, 255, 163, 0.2)' : 'rgba(255,255,255,0.08)'}; background: transparent; color: ${isUsed ? 'var(--success)' : 'var(--text-dim)'}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
                                    <i class="bi ${isUsed ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus-fill'}" style="font-size: 1rem;"></i>
                                </button>
                            </div>
                        `;
        }).join('')}
                </div>
            </td>

            <!-- KOLOM 5: AKSI -->
            <td style="text-align: center; vertical-align: top; padding: 1.5rem 1rem; width: 8%;">
                <button class="btn btn-icon btn-ghost" style="border-radius: 14px; width: 48px; height: 48px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 15px rgba(0,0,0,0.2);" onclick="copyToClipboard('${item.topic}')" title="Salin Judul Topik">
                    <i class="bi bi-cloud-arrow-down-fill" style="font-size: 1.2rem;"></i>
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
    currentOpenedArticleUrl = articleUrl;
    const article = postBankData.find(a => a.url === articleUrl);
    if (!article) return;
    const modalTitle = document.getElementById('viewer-title');
    const modalContent = document.getElementById('viewer-content');
    if (modalTitle && modalContent) {
        modalTitle.innerText = article.title;

        // Show actual content vs placeholder content alert
        if (article.content_html.trim().startsWith('<!--') && article.content_html.length < 100) {
            modalContent.innerHTML = `< div style = "padding: 4rem 2rem; text-align: center; color: #636e72;" >
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
    // Premium Toast Design
    alertBox.style.cssText = `
        position: fixed;
        bottom: 2.5rem;
        right: 2.5rem;
        background: rgba(10, 10, 15, 0.9);
        color: var(--success);
        padding: 1.2rem 2.5rem;
        border-radius: 20px;
        z-index: 10000;
        font-weight: 800;
        backdrop-filter: blur(15px);
        border: 1px solid var(--success);
        box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0, 255, 163, 0.2);
        animation: toastIn 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        display: flex;
        align-items: center;
        gap: 12px;
        letter-spacing: 0.5px;
    `;
    alertBox.innerHTML = `<i class="bi bi-check2-circle" style="font-size: 1.2rem;"></i> <span>${message}</span>`;

    // Keyframe adjustment via style tag if not present
    if (!document.getElementById('toast-anim')) {
        const style = document.createElement('style');
        style.id = 'toast-anim';
        style.innerHTML = `
            @keyframes toastIn {
                from { opacity: 0; transform: translateY(20px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translateY(10px) scale(0.95)';
        alertBox.style.transition = 'all 0.4s ease';
        setTimeout(() => alertBox.remove(), 400);
    }, 2500);
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
