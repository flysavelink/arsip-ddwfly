const fs = require('fs');

const POSTS_JSON = 'd:/LIHLAS/ddwfly_Blog_Planner/PUBLIK/post_bank.json';
const POSTS_JS = 'd:/LIHLAS/ddwfly_Blog_Planner/PUBLIK/post_bank.js';
const LINKS_JSON = 'd:/LIHLAS/ddwfly_Blog_Planner/PUBLIK/internal_links.json';
const LINKS_JS = 'd:/LIHLAS/ddwfly_Blog_Planner/PUBLIK/internal_links.js';
const HTML_FILE = 'd:/LIHLAS/ddwfly_Blog_Planner/PUBLIK/generated_post_html.txt';

const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');

const newPost = {
    "date": "2026-03-14",
    "title": "Kredit Pemilikan Rumah Tanpa DP 2026: Strategi Cerdas Punya Rumah Meski Gaji UMR!",
    "labels": ["Finance", "KPR", "Properti"],
    "url": "https://www.ddwfly.com/2026/03/kredit-pemilikan-rumah-tanpa-dp.html",
    "meta_description": "Panduan lengkap KPR tanpa DP (Down Payment) 2026. Lihlas bongkar syarat, trik pengajuan, dan risiko tersembunyi agar gajimu aman.",
    "content_html": htmlContent
};

const newLink = {
    "title": newPost.title,
    "url": newPost.url,
    "labels": newPost.labels
};

function updateJson(path, entry) {
    let rawData = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
    let data = JSON.parse(rawData);
    data.unshift(entry);
    fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf8');
}

function updateJs(path, varName, jsonPath) {
    let rawData = fs.readFileSync(jsonPath, 'utf8').replace(/^\uFEFF/, '');
    let data = JSON.parse(rawData);
    const content = `var ${varName} = ${JSON.stringify(data, null, 4)};`;
    fs.writeFileSync(path, content, 'utf8');
}

updateJson(POSTS_JSON, newPost);
updateJs(POSTS_JS, 'globalPostBank', POSTS_JSON);

updateJson(LINKS_JSON, newLink);
updateJs(LINKS_JS, 'globalInternalLinks', LINKS_JSON);

console.log("Database synced successfully!");
