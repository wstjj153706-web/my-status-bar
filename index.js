//== 状态栏1.0 (100分毕业完全体：楼层精准回滚 + 自动排精代谢 + 恩客肉棒图鉴 + 单项相册直换图片 + 5大高定特色主题 + 6阶段深度解剖文库) ==
(function () {
    "use strict";
    const DIAG_ID = "st-v10-diag-radar";
    window.ST_V10_COMPLETE_FLAG = false;
function showDiagnosticError(title, errObj, extraHint = "") {
    console.error(`[状态栏1.0 诊断雷达] ${title}:`, errObj);
    let box = document.getElementById(DIAG_ID);
    if (!box) {
        box = document.createElement("div");
        box.id = DIAG_ID;
        box.style.cssText = "position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:2147483647;width:92vw;max-width:560px;background:linear-gradient(145deg,#450a0a,#1a0005);border:2px solid #ff4d6d;border-radius:12px;padding:12px 16px;color:#ffe5ec;font-family:Consolas,'Microsoft YaHei',monospace;font-size:12.5px;box-shadow:0 12px 40px rgba(255,0,60,0.85);line-height:1.55;word-break:break-all;";
        document.body?.appendChild(box);
    }
    const errMsg = errObj ? (errObj.message || String(errObj)) : "未知错误";
    const stackStr = errObj?.stack ? String(errObj.stack) : "";
    const lineMatch = stackStr.match(/:(\d+):(\d+)/);
    const locInfo = lineMatch ? `第 ${lineMatch[1]} 行，第 ${lineMatch[2]} 列` : "见下方堆栈或检查代码末尾是否复制完整";

    box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,77,109,0.5);padding-bottom:6px;margin-bottom:8px;">
            <b style="color:#ffccd5;font-size:14px;">🚨 状态栏1.0 代码诊断报错雷达</b>
            <button onclick="this.parentElement.parentElement.style.display='none'" style="background:#ff003c;color:#fff;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-weight:bold;">关闭 ✕</button>
        </div>
        <div><b style="color:#fde047;">【错误模块】</b>：${title}</div>
        <div><b style="color:#fde047;">【具体原因】</b>：<span style="color:#fca5a5;">${errMsg}</span></div>
        <div><b style="color:#fde047;">【定位行号】</b>：<span style="color:#67e8f9;">${locInfo}</span></div>
        ${extraHint ? `<div style="margin-top:4px;color:#a6e3a1;">💡 <b>修复提示</b>：${extraHint}</div>` : ""}
        <div style="margin-top:6px;font-size:11px;color:#cbd5e1;opacity:0.85;">📋 请将此红框截图或复制文字发给 AI，即可一秒精准修复！</div>
    `;
    box.style.display = "block";
}

window.addEventListener("error", function (ev) {
    if (ev && (String(ev.filename || "").includes("status-bar") || String(ev.message || "").includes("st-v"))) {
        showDiagnosticError("运行时全局异常捕获", ev.error || ev.message, "请检查是否复制漏掉了某一段代码或括号不匹配。");
    }
});

try {
    const EXT_ID = "my-status-bar";
    let extMod = {}, scriptMod = {};
    let eventSource = null, event_types = null, setExtensionPrompt = null, extension_prompt_types = null;

    const PLUGIN_BASE_PATH = (function () {
        try {
            const scripts = document.getElementsByTagName("script");
            for (let i = scripts.length - 1; i >= 0; i--) {
                const src = scripts[i].src || "";
                if (src.includes("my-status-bar") || src.includes("status-bar")) {
                    return src.substring(0, src.lastIndexOf("/"));
                }
            }
        } catch (e) {}
        return `/scripts/extensions/third-party/${EXT_ID}`;
    })();

    const DEFAULT_STAGE_IMAGES = {};
    [
        "当前姿势", "肉体外貌", "cockLove", "lust", "corr", "shame", "obey", "pleas",
        "精神沦陷", "媚药毒瘾", "骚口实况", "胸部实况", "小穴实况", "子宫实况", "阴蒂尿道", "屁眼实况",
        "正字涂鸦", "淫纹烙印", "穿刺环饰", "体内道具", "排卵周期", "受精断面", "精液归属", "孕肚进度",
        "穿搭_头饰", "穿搭_颈部", "穿搭_胸罩", "穿搭_上衣", "穿搭_内裤", "穿搭_下装", "穿搭_丝袜", "穿搭_鞋子"
    ].forEach(k => {
        DEFAULT_STAGE_IMAGES[k] = [`${k}_1`, `${k}_2`, `${k}_3`, `${k}_4`, `${k}_5`, `${k}_6`];
    });

    // =========================================================================
    // 📦 IndexedDB 本地图片库（支持整包导入 + 单项相册选图直换）
    // =========================================================================
    const IDB_NAME = "st_status_bar_v27_img_db";
    const IDB_STORE = "images_dataurl";
    const importedImgCache = new Map();

    function normalizeImgKey(rawName) {
        if (!rawName) return "";
        let s = String(rawName).split(/[\\/]/).pop().trim();
        s = s.replace(/\.(?:png|webp|gif|jpg|jpeg|avif|bmp)$/i, "").trim();
        s = s.replace(/[-_\s]*([1-6])$/, "_$1");
        return s.toLowerCase();
    }

    function queryImportedImage(rawKey) {
        if (!rawKey) return "";
        if (String(rawKey).startsWith("data:")) return rawKey;
        return importedImgCache.get(normalizeImgKey(rawKey)) || "";
    }

    function openImageDB() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) return reject(new Error("浏览器不支持IndexedDB"));
            const req = indexedDB.open(IDB_NAME, 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
            };
            req.onsuccess = (e) => resolve(e.target.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }

    async function saveSingleImageToDB(customKey, fileObj) {
        const dUrl = await blobToDataUrl(fileObj, fileObj.name || "img.webp");
        if (!dUrl) throw new Error("图片转码失败");
        const normKey = normalizeImgKey(customKey);
        const db = await openImageDB();
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(dUrl, normKey);
        importedImgCache.set(normKey, dUrl);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve({ normKey, dUrl });
            tx.onerror = (e) => reject(e.target.error);
        });
    }

    async function loadAllImportedImagesToMemory() {
        try {
            const db = await openImageDB();
            const tx = db.transaction(IDB_STORE, "readonly");
            const store = tx.objectStore(IDB_STORE);
            const keysReq = store.getAllKeys();
            const valsReq = store.getAll();
            return new Promise((resolve) => {
                tx.oncomplete = () => {
                    const keys = keysReq.result || [];
                    const vals = valsReq.result || [];
                    keys.forEach((k, idx) => {
                        const v = vals[idx];
                        if (typeof v === "string" && v.startsWith("data:")) {
                            importedImgCache.set(normalizeImgKey(k), v);
                        }
                    });
                    resolve(importedImgCache.size);
                };
                tx.onerror = () => resolve(0);
            });
        } catch (e) { return 0; }
    }

    function blobToDataUrl(blob, fileName = "") {
        return new Promise((resolve) => {
            if (/\.gif$/i.test(fileName) || blob.type === "image/gif" || blob.size < 350 * 1024) {
                const r = new FileReader();
                r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
                r.onerror = () => resolve("");
                r.readAsDataURL(blob);
                return;
            }
            const img = new Image();
            const tmpUrl = URL.createObjectURL(blob);
            img.onload = () => {
                URL.revokeObjectURL(tmpUrl);
                try {
                    const maxDim = 960;
                    let w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
                    if (w > maxDim || h > maxDim) {
                        if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
                        else { w = Math.round(w * (maxDim / h)); h = maxDim; }
                    }
                    const cvs = document.createElement("canvas");
                    cvs.width = w; cvs.height = h;
                    cvs.getContext("2d").drawImage(img, 0, 0, w, h);
                    resolve(cvs.toDataURL("image/webp", 0.86));
                } catch (err) {
                    const r = new FileReader();
                    r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
                    r.readAsDataURL(blob);
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(tmpUrl);
                const r = new FileReader();
                r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
                r.readAsDataURL(blob);
            };
            img.src = tmpUrl;
        });
    }

    async function extractImagesFromZipFile(zipFile) {
        const buf = await zipFile.arrayBuffer();
        const view = new DataView(buf);
        const bytes = new Uint8Array(buf);
        const extracted = [];
        let eocdPos = -1;
        for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
            if (view.getUint32(i, true) === 0x06054b50) { eocdPos = i; break; }
        }
        if (eocdPos === -1) throw new Error("不是有效的 ZIP 压缩包文件");

        const totalEntries = view.getUint16(eocdPos + 10, true);
        let cdOffset = view.getUint32(eocdPos + 16, true);
        const utf8Decoder = new TextDecoder("utf-8");
        let gbkDecoder = null;
        try { gbkDecoder = new TextDecoder("gbk"); } catch (e) {}

        for (let i = 0; i < totalEntries; i++) {
            if (cdOffset + 46 > bytes.length || view.getUint32(cdOffset, true) !== 0x02014b50) break;
            const flags = view.getUint16(cdOffset + 8, true);
            const method = view.getUint16(cdOffset + 10, true);
            const compSize = view.getUint32(cdOffset + 20, true);
            const nameLen = view.getUint16(cdOffset + 28, true);
            const extraLen = view.getUint16(cdOffset + 30, true);
            const commentLen = view.getUint16(cdOffset + 32, true);
            const localHeaderOffset = view.getUint32(cdOffset + 42, true);

            const nameBytes = bytes.subarray(cdOffset + 46, cdOffset + 46 + nameLen);
            let fileName = utf8Decoder.decode(nameBytes);
            if (!(flags & 0x0800) && fileName.includes("\uFFFD") && gbkDecoder) fileName = gbkDecoder.decode(nameBytes);
            cdOffset += 46 + nameLen + extraLen + commentLen;

            if (fileName.endsWith("/") || !/\.(?:png|webp|gif|jpg|jpeg|bmp)$/i.test(fileName)) continue;
            if (fileName.includes("__MACOSX") || fileName.split(/[\\/]/).pop().startsWith(".")) continue;
            if (localHeaderOffset + 30 > bytes.length || view.getUint32(localHeaderOffset, true) !== 0x04034b50) continue;

            const localNameLen = view.getUint16(localHeaderOffset + 26, true);
            const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
            const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
            const compData = bytes.subarray(dataStart, dataStart + compSize);

            let rawBlob = null;
            const ext = fileName.split(".").pop().toLowerCase();
            const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/jpeg";

            if (method === 0) {
                rawBlob = new Blob([compData], { type: mime });
            } else if (method === 8 && typeof DecompressionStream === "function") {
                try {
                    const ds = new DecompressionStream("deflate-raw");
                    const stream = new Blob([compData]).stream().pipeThrough(ds);
                    rawBlob = await new Response(stream).blob();
                    rawBlob = new Blob([rawBlob], { type: mime });
                } catch (e) {}
            }
            if (rawBlob) extracted.push({ name: fileName.split(/[\\/]/).pop(), blob: rawBlob });
        }
        return extracted;
    }

    async function importFilesOrZipToDB(fileList) {
        if (!fileList || !fileList.length) return 0;
        const itemsToSave = [];
        for (let i = 0; i < fileList.length; i++) {
            const f = fileList[i];
            if (!f || !f.name) continue;
            if (/\.zip$/i.test(f.name)) {
                const zipItems = await extractImagesFromZipFile(f);
                for (const zItem of zipItems) {
                    const dUrl = await blobToDataUrl(zItem.blob, zItem.name);
                    const key = normalizeImgKey(zItem.name);
                    if (key && dUrl) itemsToSave.push({ key, dUrl });
                }
            } else if (/\.(?:png|webp|gif|jpg|jpeg|avif|bmp)$/i.test(f.name) || f.type.startsWith("image/")) {
                const dUrl = await blobToDataUrl(f, f.name);
                const key = normalizeImgKey(f.name);
                if (key && dUrl) itemsToSave.push({ key, dUrl });
            }
        }
        if (!itemsToSave.length) return 0;
        const db = await openImageDB();
        const tx = db.transaction(IDB_STORE, "readwrite");
        const store = tx.objectStore(IDB_STORE);
        itemsToSave.forEach(({ key, dUrl }) => {
            store.put(dUrl, key);
            importedImgCache.set(key, dUrl);
        });
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(itemsToSave.length);
            tx.onerror = (e) => reject(e.target.error);
        });
    }

    async function clearAllImportedImagesDB() {
        try {
            const db = await openImageDB();
            const tx = db.transaction(IDB_STORE, "readwrite");
            tx.objectStore(IDB_STORE).clear();
            return new Promise((resolve) => {
                tx.oncomplete = () => { importedImgCache.clear(); resolve(true); };
            });
        } catch (e) { return false; }
    }

    function safeStr(val, fallback = "") {
        if (val === null || val === undefined) return fallback;
        return String(val);
    }

    function safeNum(val, fallback = 0) {
        const n = Number(val);
        return Number.isFinite(n) ? n : fallback;
    }

    function safeCtx() {
        try {
            if (typeof window.SillyTavern?.getContext === "function") return window.SillyTavern.getContext() || {};
            if (typeof extMod.getContext === "function") return extMod.getContext() || {};
        } catch (e) {}
        return {};
    }

    // =========================================================================
    // 🎨 五大高定特色主题与专属 CSS 特效引擎（非单纯改色，拥有独立纹理与边框结构）
    // =========================================================================
    const THEMES = {
        "魅魔粉 (默认)": {
            cls: "st-theme-succubus",
            bg: "radial-gradient(circle at 85% 12%, rgba(243,139,168,0.28), transparent 45%), radial-gradient(circle at 15% 88%, rgba(203,166,247,0.22), transparent 50%), linear-gradient(165deg, #241734 0%, #140d20 65%, #0d0814 100%)",
            border: "2px solid #f38ba8", radius: "18px", shadow: "0 16px 48px rgba(243,139,168,0.42), inset 0 0 22px rgba(243,139,168,0.12)",
            prim: "#f38ba8", sec: "#cba6f7", text: "#fdf0f6", sub: "#c4b5d6",
            card: "linear-gradient(145deg, rgba(48,32,72,0.88), rgba(22,15,36,0.94))",
            cardBorder: "1px solid rgba(243,139,168,0.38)", hi: "rgba(243,139,168,0.25)",
            headerBg: "linear-gradient(90deg, rgba(243,139,168,0.2), rgba(203,166,247,0.1))",
            badgeDesc: "✨ 魅魔星云毛玻璃 · 柔粉呼吸光效"
        },
        "暗黑血浆 (重口凌辱)": {
            cls: "st-theme-blood",
            bg: "radial-gradient(circle at 50% 0%, rgba(220,38,38,0.32), transparent 60%), repeating-linear-gradient(135deg, #180306 0px, #180306 10px, #0f0103 10px, #0f0103 20px)",
            border: "3px double #ff1e42", radius: "6px", shadow: "0 20px 60px rgba(255,0,43,0.65), inset 0 0 30px rgba(153,27,27,0.45)",
            prim: "#ff2a4b", sec: "#fca5a5", text: "#ffe5ec", sub: "#e295a2",
            card: "linear-gradient(160deg, rgba(45,6,12,0.95), rgba(18,2,5,0.98))",
            cardBorder: "1px solid rgba(255,42,75,0.6)", hi: "rgba(255,42,75,0.35)",
            headerBg: "linear-gradient(90deg, rgba(153,27,27,0.5), rgba(45,6,12,0.8))",
            badgeDesc: "🩸 哥特斜纹烙印 · 猩红双线刻痕"
        },
        "白浊深渊 (催眠灌精)": {
            cls: "st-theme-semen",
            bg: "radial-gradient(ellipse at top, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at bottom, rgba(103,232,249,0.18), transparent 50%), linear-gradient(175deg, #0f172a 0%, #1e1b4b 55%, #090d16 100%)",
            border: "2px solid #a5f3fc", radius: "24px", shadow: "0 16px 52px rgba(165,243,252,0.35), inset 0 0 25px rgba(255,255,255,0.12)",
            prim: "#67e8f9", sec: "#e0e7ff", text: "#f8fafc", sub: "#cbd5e1",
            card: "linear-gradient(150deg, rgba(30,41,59,0.88), rgba(15,23,42,0.95))",
            cardBorder: "1.5px dashed rgba(165,243,252,0.48)", hi: "rgba(103,232,249,0.24)",
            headerBg: "linear-gradient(90deg, rgba(103,232,249,0.18), rgba(192,132,252,0.15))",
            badgeDesc: "🥛 液态乳白柔光 · 催眠气泡水纹"
        },
        "赛博调教 (电击项圈)": {
            cls: "st-theme-cyber",
            bg: "linear-gradient(rgba(0,245,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.05) 1px, transparent 1px), linear-gradient(160deg, #040814 0%, #0a1526 100%)",
            border: "2px solid #00f5d4", radius: "4px", shadow: "0 0 38px rgba(0,245,212,0.5), inset 0 0 18px rgba(241,91,181,0.28)",
            prim: "#00f5d4", sec: "#f15bb5", text: "#e0fbfc", sub: "#90e0ef",
            card: "linear-gradient(135deg, rgba(10,25,47,0.94), rgba(2,12,27,0.98))",
            cardBorder: "1px solid #00f5d4", hi: "rgba(241,91,181,0.32)",
            headerBg: "linear-gradient(90deg, rgba(0,245,212,0.22), rgba(241,91,181,0.22))",
            badgeDesc: "⚡ 全息网格扫描线 · 霓虹切角装甲"
        },
        "鎏金娼馆 (肉便器挂牌)": {
            cls: "st-theme-brothel",
            bg: "radial-gradient(circle at 50% 10%, rgba(251,191,36,0.22), transparent 55%), repeating-radial-gradient(circle at 0 0, rgba(249,226,175,0.03) 0, rgba(249,226,175,0.03) 8px, transparent 8px, transparent 16px), linear-gradient(165deg, #27170e 0%, #140b06 100%)",
            border: "3px ridge #fbbf24", radius: "14px", shadow: "0 20px 55px rgba(245,158,11,0.38), inset 0 0 24px rgba(251,191,36,0.15)",
            prim: "#fde047", sec: "#fb923c", text: "#fef3c7", sub: "#d6bc98",
            card: "linear-gradient(155deg, rgba(48,29,18,0.94), rgba(23,13,8,0.98))",
            cardBorder: "1px solid rgba(251,191,36,0.5)", hi: "rgba(251,191,36,0.26)",
            headerBg: "linear-gradient(90deg, rgba(217,119,6,0.3), rgba(69,26,3,0.6))",
            badgeDesc: "👑 巴洛克浮雕金框 · 奢华丝绒暗纹"
        }
    };

    function injectCustomStyles() {
        if (document.getElementById("st-v10-custom-css")) return;
        const style = document.createElement("style");
        style.id = "st-v10-custom-css";
        style.textContent = `
            @keyframes stPulseGlow {
                0%, 100% { box-shadow: 0 0 8px rgba(255, 0, 60, 0.75), inset 0 0 4px rgba(255, 255, 255, 0.35); }
                50% { box-shadow: 0 0 18px rgba(255, 0, 60, 1), 0 0 26px rgba(136, 19, 55, 0.9), inset 0 0 8px rgba(255, 255, 255, 0.65); }
            }
            @keyframes stStage6GodGlow {
                0%, 100% { box-shadow: 0 0 10px #f59e0b, 0 0 20px #ff0055, inset 0 0 8px #fde047; border-color: #fde047 !important; }
                50% { box-shadow: 0 0 22px #ff0055, 0 0 36px #7e22ce, inset 0 0 14px #ffffff; border-color: #ff758f !important; }
            }
            @keyframes stHeartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.12); }
            }
            .st-v28-card {
                transition: transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.16s ease, border-color 0.16s ease !important;
                position: relative;
            }
            .st-v28-card:hover {
                transform: translateY(-2px);
            }
            /* 五大主题专属特殊造型 */
            .st-theme-succubus .st-v28-card:hover {
                box-shadow: 0 8px 24px rgba(243, 139, 168, 0.35), inset 0 0 12px rgba(243, 139, 168, 0.12) !important;
            }
            .st-theme-blood .st-v28-card {
                border-left: 4px solid #ff003c !important;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 77, 109, 0.25) !important;
            }
            .st-theme-blood .st-v28-card:hover {
                box-shadow: 0 8px 25px rgba(255, 0, 60, 0.55) !important;
            }
            .st-theme-semen .st-v28-card {
                border-radius: 16px !important;
                box-shadow: 0 6px 18px rgba(15, 23, 42, 0.7), inset 0 2px 10px rgba(255, 255, 255, 0.08) !important;
            }
            .st-theme-cyber {
                background-size: 20px 20px, 20px 20px, 100% 100% !important;
            }
            .st-theme-cyber .st-v28-card {
                clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                border-left: 3.5px solid #f15bb5 !important;
                border-radius: 2px !important;
            }
            .st-theme-brothel .st-v28-card {
                border: 1.5px ridge rgba(251, 191, 36, 0.6) !important;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.7), inset 0 0 14px rgba(251, 191, 36, 0.1) !important;
            }
            .st-stage5-badge {
                animation: stPulseGlow 1.8s infinite ease-in-out;
            }
            .st-stage6-badge {
                animation: stStage6GodGlow 1.3s infinite ease-in-out;
                background: linear-gradient(135deg, #fbbf24 0%, #ff0055 50%, #2e1065 100%) !important;
                color: #ffffff !important;
                text-shadow: 0 1px 4px #000;
            }
            .st-emo-pill {
                display: inline-flex;
                align-items: center;
                padding: 1px 6px;
                border-radius: 99px;
                font-size: 10px;
                font-weight: bold;
                white-space: nowrap;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.35;
            }
            .st-emo-stage6 {
                display: inline-flex;
                align-items: center;
                padding: 1px 7px;
                border-radius: 99px;
                font-size: 10px;
                font-weight: 900;
                white-space: nowrap;
                background: linear-gradient(90deg, #f59e0b, #ff0055, #3b0764);
                color: #fff !important;
                border: 1px solid #fde047;
                box-shadow: 0 0 10px rgba(255, 0, 85, 0.85);
            }
            .st-heart-beat {
                display: inline-block;
                animation: stHeartbeat 1.3s infinite ease-in-out;
            }
            .st-sec-block {
                background: rgba(0, 0, 0, 0.42);
                border: 1px solid rgba(255, 255, 255, 0.09);
                border-left: 3.5px solid #cba6f7;
                border-radius: 9px;
                padding: 9px 12px;
                margin-bottom: 8px;
                line-height: 1.76;
            }
            .st-thought-box {
                margin-top: 12px;
                padding: 12px 14px;
                background: linear-gradient(145deg, rgba(243, 139, 168, 0.18), rgba(168, 85, 247, 0.12));
                border: 1px solid rgba(243, 139, 168, 0.45);
                border-left: 4.5px solid #f38ba8;
                border-radius: 11px;
                color: #ffe0ec;
                font-style: italic;
                line-height: 1.85;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35), inset 0 0 14px rgba(243, 139, 168, 0.12);
            }
            @media (max-width: 480px) {
                #st-v5-tabs { width: 54px !important; padding: 6px 4px !important; }
                #st-v5-body { padding: 8px !important; }
                .st-card-thumb-wrap { width: 64px !important; height: 64px !important; }
            }
            #st-v5-body::-webkit-scrollbar, #st-v6-det-desc::-webkit-scrollbar, #st-v5-tabs::-webkit-scrollbar { width: 4px; }
            #st-v5-body::-webkit-scrollbar-thumb, #st-v6-det-desc::-webkit-scrollbar-thumb, #st-v5-tabs::-webkit-scrollbar-thumb {
                background: rgba(243, 139, 168, 0.45);
                border-radius: 99px;
            }
        `;
        document.head.appendChild(style);
    }

    function showToast(msg, type = "success", duration = 3500) {
        try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, "📊 状态栏1.0"); } catch (e) {}
        let box = document.getElementById("st-v20-toast");
        if (!box) {
            box = document.createElement("div"); box.id = "st-v20-toast";
            box.style.cssText = "position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;padding:10px 22px;border-radius:99px;font-family:'Microsoft YaHei',sans-serif;font-size:13px;font-weight:bold;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,0.85);transition:all 0.25s ease;pointer-events:none;display:none;align-items:center;gap:8px;backdrop-filter:blur(10px);max-width:92vw;text-align:center;";
            document.body.appendChild(box);
        }
        const colors = {
            success: "linear-gradient(135deg, rgba(22,163,74,0.96), rgba(21,128,61,0.96))",
            info: "linear-gradient(135deg, rgba(243,139,168,0.96), rgba(203,166,247,0.96))",
            warn: "linear-gradient(135deg, rgba(234,179,8,0.96), rgba(202,138,4,0.96))",
            error: "linear-gradient(135deg, rgba(220,38,38,0.96), rgba(153,27,27,0.96))"
        };
        box.style.background = colors[type] || colors.info;
        box.style.border = "1.5px solid rgba(255,255,255,0.45)";
        box.textContent = msg;
        box.style.display = "flex";
        clearTimeout(box._timer);
        box._timer = setTimeout(() => { box.style.display = "none"; }, duration);
    }

    const DIFFICULTY_PRESETS = {
        "easy":   { label: "🌸 轻度催情 (1x 拔作节奏 · 约80次达五阶 / 200次冲六阶神格)", mult: 1.0,  short: "1x轻度" },
        "normal": { label: "🌙 标准黄油 (3x 经典女主 · 约240次达五阶 / 600次冲六阶神格)", mult: 3.0,  short: "3x黄油" },
        "hard":   { label: "🔥 硬核慢热 (8x 贞洁烈女 · 约640次达五阶 / 1600次冲六阶神格)", mult: 8.0,  short: "8x硬核" },
        "hell":   { label: "💀 地狱调教 (20x 高岭之花 · 约1600次达五阶 / 4000次冲六阶神格)", mult: 20.0, short: "20x地狱" },
        "abyss":  { label: "👑 深渊神格 (50x 圣女百炼 · 约4000次达五阶 / 10000次冲六阶神格)", mult: 50.0, short: "50x深渊" }
    };

    let userSettings = {
        enabled: true,
        hideRawBlock: true,
        theme: "魅魔粉 (默认)",
        difficultyMode: "normal",
        strictMentalLock: true,
        injectReversePrompt: true,
        autoMetabolism: true,
        width: 540,
        height: 700,
        fontScale: 100,
        apiSyncEnabled: false,
        apiUrl: "",
        apiKey: "",
        apiModel: "",
        modelList: []
    };

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v10_cfg") || localStorage.getItem(EXT_ID + "_v28_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            userSettings.width = Math.max(330, Math.min(920, safeNum(userSettings.width, 540)));
            userSettings.height = Math.max(360, Math.min(920, safeNum(userSettings.height, 700)));
            userSettings.fontScale = Math.max(80, Math.min(135, safeNum(userSettings.fontScale, 100)));
            if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉 (默认)";
            if (!DIFFICULTY_PRESETS[userSettings.difficultyMode]) userSettings.difficultyMode = "normal";
        } catch (e) {}
    }
    function saveSettings() {
        try { localStorage.setItem(EXT_ID + "_v10_cfg", JSON.stringify(userSettings)); } catch (e) {}
    }

    function getDifficultyProfile() {
        const p = DIFFICULTY_PRESETS[userSettings.difficultyMode] || DIFFICULTY_PRESETS["normal"];
        return { mode: userSettings.difficultyMode, name: p.short, fullLabel: p.label, mult: p.mult };
    }

    function detectRealCharacterIdentity(v) {
        if (v?.档案?.种族与体质 && safeStr(v.档案.种族与体质).trim() && !/耐受|难度|肉胎/.test(v.档案.种族与体质)) {
            return safeStr(v.档案.种族与体质).trim();
        }
        const ctx = safeCtx();
        const personaDesc = safeStr(ctx?.power_user?.persona_description);
        const recentMes = (ctx?.chat || []).slice(-6).map(m => safeStr(m?.mes)).join(" ");
        const combined = `${safeStr(v?.档案?.身份与背景)} ${personaDesc} ${recentMes}`;

        if (/云岚宗|纳兰嫣然|斗气|少宗主/.test(combined)) return "云岚宗少宗主·风属性斗者";
        if (/修仙|仙子|圣女|剑仙|女帝|灵根/.test(combined)) return "清冷修仙者·纯阴之躯";
        if (/魅魔|淫魔|Succubus/i.test(combined)) return "魅魔之躯";
        if (/精灵|Elf/i.test(combined)) return "高贵精灵之躯";
        if (/千金|大小姐|豪门|夫人|妻子|太太/.test(combined)) return "名门千金·娇嫩之躯";
        if (/妓女|暗娼|风尘|卖身|接客/.test(combined)) return "风尘熟肉之躯";
        if (/大学生|学妹|校花|少女|高中生/.test(combined)) return "现代青春少女之躯";
        return "敏感处子娇躯";
    }

    function tier6(val, rev = false) {
        const n = Math.max(0, Math.min(100, Math.round(safeNum(val, 0))));
        const v = rev ? (100 - n) : n;
        if (v >= 100) return 5;
        if (v >= 80)  return 4;
        if (v >= 60)  return 3;
        if (v >= 40)  return 2;
        if (v >= 20)  return 1;
        return 0;
    }

    function stageNameFromVal(val, rev = false) {
        return ["第一阶段", "第二阶段", "第三阶段", "第四阶段", "第五阶段", "第六阶段·极"][tier6(val, rev)];
    }

    const EXCLUSIVE_SPECTRA = {
        cockLove: {
            grads: [
                "linear-gradient(90deg, #93c5fd, #cbd5e1)",
                "linear-gradient(90deg, #fbcfe8, #f472b6)",
                "linear-gradient(90deg, #f472b6, #e879f9)",
                "linear-gradient(90deg, #c084fc, #9333ea)",
                "linear-gradient(90deg, #e11d48, #881337)",
                "linear-gradient(90deg, #fbbf24 0%, #ff0055 50%, #3b0764 100%)"
            ],
            cols: ["#bfdbfe", "#fbcfe8", "#f5d0fe", "#e9d5ff", "#fda4af", "#fde047"],
            emos: ["(˘•ω•˘)🛡️戒备", "(￣_￣)🍆适应", "(⁄•⁄ω⁄•⁄)💓眼馋", "(º﹃º )👅跪舔", "(♡°▽°♡)🐶肉棒奴", "♛(🤪🍆💦)终极飞机杯"]
        },
        lust: {
            grads: [
                "linear-gradient(90deg, #a7f3d0, #bae6fd)",
                "linear-gradient(90deg, #fde68a, #fdba74)",
                "linear-gradient(90deg, #fb923c, #f43f5e)",
                "linear-gradient(90deg, #f43f5e, #dc2626)",
                "linear-gradient(90deg, #dc2626, #7f1d1d)",
                "linear-gradient(90deg, #ffffff 0%, #ff003c 45%, #450a0a 100%)"
            ],
            cols: ["#a7f3d0", "#fde68a", "#fdba74", "#fda4af", "#f87171", "#fef08a"],
            emos: ["( -_-)❄️克制", "(｡•́︿•̀｡)🌡️微燥", "(⸝⸝＞◡＜⸝⸝)🔥乳硬", "(🥵💦)🌋湿裤", "(🤪🔥)♨️夹腿狂磨", "💥(🥵❤️‍🔥⛲)永动发情母畜"]
        },
        corr: {
            grads: [
                "linear-gradient(90deg, #ffffff, #cbd5e1)",
                "linear-gradient(90deg, #e2e8f0, #c084fc)",
                "linear-gradient(90deg, #c084fc, #7e22ce)",
                "linear-gradient(90deg, #9333ea, #be123c)",
                "linear-gradient(90deg, #be123c, #3b0764, #09000b)",
                "linear-gradient(90deg, #fde047 0%, #9333ea 45%, #020005 100%)"
            ],
            cols: ["#f8fafc", "#e9d5ff", "#d8b4fe", "#f0abfc", "#fda4af", "#fde047"],
            emos: ["(｡•̀ᴗ-)✨清白", "( ´•̥×•̥`)🌫️染尘", "(¬‿¬ )🍷放荡", "(淫▽淫)👠娼妇", "(🤪🖤⛓️)🐷公用精盆", "💀(👁️‍🗨️🖤🔞)深渊肉便器"]
        },
        shame: {
            grads: [
                "linear-gradient(90deg, #ffe4e6, #fb7185, #e11d48)",
                "linear-gradient(90deg, #fbcfe8, #ec4899)",
                "linear-gradient(90deg, #e9d5ff, #a855f7)",
                "linear-gradient(90deg, #a855f7, #be123c)",
                "linear-gradient(90deg, #be123c, #1f000d)",
                "linear-gradient(90deg, #00f5d4 0%, #ff0055 50%, #09000b 100%)"
            ],
            cols: ["#fecdd3", "#fbcfe8", "#e9d5ff", "#fda4af", "#fb7185", "#67e8f9"],
            emos: ["(⁄>⁄ω⁄<⁄)🍅羞愤", "(🫣💦)耳根滚烫", "( ˙-˙ )😐习以为常", "(😏👙)敞腿任看", "(🤪🐾)羞耻全灭", "📸(🤪✌️💦)当众失禁露出狂"]
        },
        obey: {
            grads: [
                "linear-gradient(90deg, #94a3b8, #cbd5e1)",
                "linear-gradient(90deg, #93c5fd, #c4b5fd)",
                "linear-gradient(90deg, #f9a8d4, #c084fc)",
                "linear-gradient(90deg, #fbbf24, #d97706)",
                "linear-gradient(90deg, #e11d48, #4c0519)",
                "linear-gradient(90deg, #fde047 0%, #d97706 45%, #1c1917 100%)"
            ],
            cols: ["#cbd5e1", "#bfdbfe", "#fbcfe8", "#fde68a", "#fda4af", "#fde047"],
            emos: ["( `^´ )⚔️抗拒", "(´-ω-`)💧被动妥协", "( ´•̥ω•̥`)🙇温顺听话", "(▽・ω・▽)🐾摇尾乞怜", "(⛓️🐶💦)任打任操", "👑(🧎‍♀️👅💦)巴甫洛夫肉奴"]
        },
        pleas: {
            grads: [
                "linear-gradient(90deg, #f1f5f9, #fbcfe8)",
                "linear-gradient(90deg, #f9a8d4, #ec4899)",
                "linear-gradient(90deg, #e879f9, #a855f7)",
                "linear-gradient(90deg, #ff0a54, #9333ea)",
                "linear-gradient(90deg, #ff003c, #4a0018)",
                "linear-gradient(90deg, #ffffff 0%, #ff0055 45%, #3b0764 100%)"
            ],
            cols: ["#f8fafc", "#fbcfe8", "#f5d0fe", "#fda4af", "#ff4d6d", "#ffffff"],
            emos: ["( ˘ω˘ )💤余韵空虚", "(😳⚡)尾椎酥麻", "(🥺💓)趾尖蜷缩", "(🥵⚡💦)濒临绝顶", "(🤪⛲)潮吹失神", "⚡(翻白眼👅💦)脑髓高潮熔断"]
        },
        hypno: {
            grads: [
                "linear-gradient(90deg, #7dd3fc, #bae6fd)",
                "linear-gradient(90deg, #818cf8, #c084fc)",
                "linear-gradient(90deg, #a855f7, #ec4899)",
                "linear-gradient(90deg, #ec4899, #7e22ce)",
                "linear-gradient(90deg, #7e22ce, #1e1b4b)",
                "linear-gradient(90deg, #ff007f 0%, #7e22ce 50%, #05000a 100%)"
            ],
            cols: ["#bae6fd", "#c7d2fe", "#f5d0fe", "#fbcfe8", "#d8b4fe", "#ff758f"],
            emos: ["(・_・)🧠神智清醒", "(°_° )🌀精神恍惚", "(＠_＠;)💫催眠暗示", "(♡_♡)🎀常识改写", "(🤤💭)人格碎裂", "💖(👁️♡👁️🤤)彻底脑死母猪"]
        },
        drug: {
            grads: [
                "linear-gradient(90deg, #86efac, #bbf7d0)",
                "linear-gradient(90deg, #bef264, #facc15)",
                "linear-gradient(90deg, #a3e635, #c084fc)",
                "linear-gradient(90deg, #e879f9, #be123c)",
                "linear-gradient(90deg, #9333ea, #3b0764)",
                "linear-gradient(90deg, #a3e635 0%, #ff0055 50%, #1a0014 100%)"
            ],
            cols: ["#bbf7d0", "#fef08a", "#d9f99d", "#f5d0fe", "#e9d5ff", "#bef264"],
            emos: ["(🌱)纯净无毒", "(😳🍷)体液依恋", "(🥵🧪)媚药发热", "(🤤💉)精液戒断", "(🤪🧪💦)断精发狂", "☣️(🤪💉🥛)100%精液毒虫"]
        },
        mouth: {
            grads: [
                "linear-gradient(90deg, #fecdd3, #fda4af)",
                "linear-gradient(90deg, #fda4af, #fb7185)",
                "linear-gradient(90deg, #fb7185, #e11d48)",
                "linear-gradient(90deg, #e11d48, #9d174d)",
                "linear-gradient(90deg, #ffffff, #e11d48, #4c0519)",
                "linear-gradient(90deg, #fde047 0%, #e11d48 50%, #1f000d 100%)"
            ],
            cols: ["#ffe4e6", "#fecdd3", "#fda4af", "#f472b6", "#fda4af", "#fde047"],
            emos: ["💋洁净初唇", "👅唾液敏化", "😮‍💨深喉适应", "🤤吞精成瘾", "🤪奉仕口器", "👑食道生殖器化"]
        },
        chest: {
            grads: [
                "linear-gradient(90deg, #fff1f2, #fbcfe8)",
                "linear-gradient(90deg, #fbcfe8, #f472b6)",
                "linear-gradient(90deg, #f472b6, #db2777)",
                "linear-gradient(90deg, #fef3c7, #f472b6, #be185d)",
                "linear-gradient(90deg, #ffffff, #ec4899, #831843)",
                "linear-gradient(90deg, #fffbeb 0%, #ff0055 50%, #3b0764 100%)"
            ],
            cols: ["#fce7f3", "#fbcfe8", "#f9a8d4", "#fef3c7", "#fbcfe8", "#fde047"],
            emos: ["🌸娇嫩处乳", "🍒乳尖充血", "🥵揉捏变形", "🍼乳腺喷奶", "🐄泌乳母畜", "👑终极永动奶袋"]
        },
        vag: {
            grads: [
                "linear-gradient(90deg, #ffe4e6, #f9a8d4)",
                "linear-gradient(90deg, #f9a8d4, #ec4899)",
                "linear-gradient(90deg, #ec4899, #e11d48)",
                "linear-gradient(90deg, #e11d48, #9d174d)",
                "linear-gradient(90deg, #ff003c, #500724)",
                "linear-gradient(90deg, #fde047 0%, #ff003c 48%, #1a000c 100%)"
            ],
            cols: ["#ffe4e6", "#fbcfe8", "#fda4af", "#f472b6", "#ff4d6d", "#fde047"],
            emos: ["🌸处女一线鲍", "💧初破微张", "🌺充血外翻", "🥵大开肉壶", "🤪洞开漏精便器", "💀永久洞开极品名器"]
        },
        womb: {
            grads: [
                "linear-gradient(90deg, #fce7f3, #f0abfc)",
                "linear-gradient(90deg, #f0abfc, #d946ef)",
                "linear-gradient(90deg, #d946ef, #be185d)",
                "linear-gradient(90deg, #be185d, #881337)",
                "linear-gradient(90deg, #ffffff, #be123c, #3b0764)",
                "linear-gradient(90deg, #fde047 0%, #d946ef 45%, #2e1065 100%)"
            ],
            cols: ["#f5d0fe", "#f0abfc", "#e879f9", "#fda4af", "#ffccd5", "#fde047"],
            emos: ["🤍紧闭处子", "🥺宫口酸软", "🫀锁精苗床", "🥵宫口常张", "🤪宫颈脱垂索精", "👑永久受精生殖圣杯"]
        },
        clit: {
            grads: [
                "linear-gradient(90deg, #fef9c3, #fbcfe8)",
                "linear-gradient(90deg, #fde047, #f472b6)",
                "linear-gradient(90deg, #facc15, #ec4899)",
                "linear-gradient(90deg, #f59e0b, #e11d48)",
                "linear-gradient(90deg, #ff003c, #7e22ce)",
                "linear-gradient(90deg, #fef08a 0%, #00f5d4 45%, #be123c 100%)"
            ],
            cols: ["#fef9c3", "#fde68a", "#fbcfe8", "#fdba74", "#fda4af", "#67e8f9"],
            emos: ["🌱包皮隐没", "😳充血勃起", "⚡触电酸豆", "🥵肥大外露", "⛲括约肌失禁", "🌊永动潮吹失禁喷泉"]
        },
        anal: {
            grads: [
                "linear-gradient(90deg, #fed7aa, #fda4af)",
                "linear-gradient(90deg, #fda4af, #e11d48)",
                "linear-gradient(90deg, #e11d48, #9f1239)",
                "linear-gradient(90deg, #9f1239, #6b21a8)",
                "linear-gradient(90deg, #7e22ce, #3b0764)",
                "linear-gradient(90deg, #fb923c 0%, #be123c 50%, #1a0014 100%)"
            ],
            cols: ["#fed7aa", "#fda4af", "#fb7185", "#e9d5ff", "#d8b4fe", "#fdba74"],
            emos: ["💮紧闭菊蕾", "😣异物适应", "😮‍💨括约肌软化", "🕳️后庭大开", "🥛直肠储精袋", "💀第二生殖排泄肉腔"]
        },
        pee: {
            grads: [
                "linear-gradient(90deg, #ffffff, #fef9c3)",
                "linear-gradient(90deg, #fef08a, #facc15)",
                "linear-gradient(90deg, #facc15, #f59e0b)",
                "linear-gradient(90deg, #ea580c, #e11d48)",
                "linear-gradient(90deg, #e11d48, #881337)",
                "linear-gradient(90deg, #fde047 0%, #ff003c 50%, #1a0008 100%)"
            ],
            cols: ["#fef9c3", "#fde047", "#fdba74", "#fda4af", "#ff4d6d", "#fde047"],
            emos: ["🤍尿道紧闭", "😳小腹微酸", "😣夹腿憋尿", "🥵濒临漏尿", "💦括约肌崩解", "⛲失禁狂喷决堤!!"]
        },
        semen: {
            grads: [
                "linear-gradient(90deg, #64748b, #94a3b8)",
                "linear-gradient(90deg, #e2e8f0, #ffffff)",
                "linear-gradient(90deg, #ffffff, #fbcfe8, #f472b6)",
                "linear-gradient(90deg, #ffffff, #ec4899, #be123c)",
                "linear-gradient(90deg, #ffffff, #ff0a54, #3b0764)",
                "linear-gradient(90deg, #ffffff 0%, #fde047 35%, #ff0055 100%)"
            ],
            cols: ["#cbd5e1", "#ffffff", "#fbcfe8", "#fda4af", "#ffccd5", "#fde047"],
            emos: ["🤍空虚待灌", "🥛挂壁残留", "🤤白浊咕啾", "🥵灌满外溢", "🫃精盆撑满", "💥100%精液灌爆苗床!!"]
        },
        milk: {
            grads: [
                "linear-gradient(90deg, #64748b, #94a3b8)",
                "linear-gradient(90deg, #fffbeb, #fef3c7)",
                "linear-gradient(90deg, #fef3c7, #fde68a)",
                "linear-gradient(90deg, #fde68a, #f9a8d4)",
                "linear-gradient(90deg, #fffbeb, #fb7185, #be123c)",
                "linear-gradient(90deg, #ffffff 0%, #fde047 45%, #ec4899 100%)"
            ],
            cols: ["#cbd5e1", "#fef3c7", "#fde68a", "#fbcfe8", "#fecdd3", "#fde047"],
            emos: ["🌸尚未泌乳", "🍼乳腺微胀", "🥺乳尖渗奶", "🥵涨奶酸痛", "🐄双乳狂喷", "🌊100%母乳喷泉决堤!!"]
        },
        sta: {
            grads: [
                "linear-gradient(90deg, #bbf7d0, #4ade80, #16a34a)",
                "linear-gradient(90deg, #fef08a, #facc15)",
                "linear-gradient(90deg, #fed7aa, #fb923c)",
                "linear-gradient(90deg, #fda4af, #e11d48)",
                "linear-gradient(90deg, #dc2626, #450a0a)",
                "linear-gradient(90deg, #450a0a 0%, #090000 100%)"
            ],
            cols: ["#86efac", "#fde047", "#fdba74", "#fda4af", "#f87171", "#fca5a5"],
            emos: ["✨精力充沛", "😮‍💨腰腿微酸", "🥵香汗淋漓", "🫠双腿筛糠", "😵‍💫濒临虚脱", "💀体力0%彻底失神肉泥"]
        }
    };

    function getThemedBarStyle(pct, barTheme = "pleas") {
        if (barTheme === "none") {
            return { grad: "linear-gradient(90deg,#f472b6,#a855f7)", glow: "none", labelColor: "#fbcfe8", emo: "", tier: 0 };
        }
        const p = Math.max(0, Math.min(100, Math.round(safeNum(pct, 0))));
        const isRev = (barTheme === "shame" || barTheme === "sta");
        let t = tier6(p, isRev);

        if (barTheme === "semen" || barTheme === "milk") {
            if (p === 0) t = 0;
            else if (p < 30) t = 1;
            else if (p < 60) t = 2;
            else if (p < 85) t = 3;
            else if (p < 100) t = 4;
            else t = 5;
        }

        const spec = EXCLUSIVE_SPECTRA[barTheme] || EXCLUSIVE_SPECTRA.pleas;
        const grad = spec.grads[t] || spec.grads[0];
        const col = spec.cols[t] || "#f9e2af";
        const rawEmo = spec.emos[t] || "";

        const isMaxStage = (t === 5);
        const glow = isMaxStage
            ? "0 0 14px #ff0055, 0 0 22px #fde047, inset 0 0 6px #ffffff"
            : (t >= 3 ? `0 0 10px ${col}88` : `0 0 5px ${col}44`);

        const emoHTML = isMaxStage
            ? `<span class="st-emo-stage6">${rawEmo}</span>`
            : `<span class="st-emo-pill" style="color:${col};border:1px solid ${col}55;background:rgba(0,0,0,0.45);">${rawEmo}</span>`;

        return { grad, glow, labelColor: col, emo: emoHTML, tier: t };
    }

    function cleanThoughtText(str) {
        return safeStr(str)
            .replace(/【(?:生理层|心理层|欲望层)】/g, "")
            .replace(/\s*｜\s*/g, "")
            .replace(/^[\s"“'‘*]+|[\s"”'’*]+$/g, "")
            .replace(/\*\*/g, "")
            .trim();
    }

    function checkCardAvailable(silent = false) {
        const ctx = safeCtx();
        const hasChar = ctx?.characterId !== undefined && ctx?.characterId !== null && ctx?.name2;
        const hasChat = Array.isArray(ctx?.chat) && ctx.chat.length > 0;
        if (!hasChar && !hasChat) {
            if (!silent) showToast("⚠️ 当前未选择任何角色卡或聊天记录为空，无法读取状态！", "warn", 4000);
            return false;
        }
        return true;
    }

    function getInitialVars() {
        return {
            档案: {
                当前认知名字: "", 种族与体质: "", 身份与背景: "", 肉体外貌实况: "",
                表里风评与称号: "", 致命把柄与威胁: "无", 风月挂牌身价: "", 当前处境: ""
            },
            核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
            精神与心理: {
                羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0,
                意识清醒度: 100, 人格崩解度: 0, 媚药精液毒瘾: 0, 语言退化阿嘿颜: 0
            },
            身体: { 体力: 100, 敏感度倍率: 1.0 },
            性癖: { 条目: [] },
            恩客图鉴: {},
            实况: {
                内心独白: "", 当前姿势: "", 当前衣装: "",
                骚口实况: "", 胸部实况: "", 小穴实况: "", 子宫实况: "", 阴蒂尿道实况: "", 屁眼实况: ""
            },
            穿搭: {
                头饰与眼部: "", 颈部与项圈: "", 胸罩与裹胸: "", 上衣与束腰: "",
                内裤与遮挡: "", 下装与裙裤: "", 丝袜与腿部: "", 鞋子与玉足: ""
            },
            计数: {
                性交: { 口: 0, 小穴: 0, 屁眼: 0, 乳穴: 0, 足腿: 0, 兽交异种: 0 },
                高潮: { 总数: 0, 强制: 0, 公开场合: 0, 寸止: 0 },
                射精: { 内射: 0, 颜射体外: 0 },
                精液摄入: { 吞精次数: 0, 累计毫升: 0 },
                泌乳: { 喷乳次数: 0, 累计毫升: 0 },
                自慰: 0,
                失控: { 失禁: 0, 喷潮: 0, 阿嘿颜: 0 },
                暴露: { 露出: 0, 被围观人次: 0, 被拍摄留影: 0 },
                交易: { 接客卖身: 0, 被外借共享: 0, 轮奸群交: 0, 睡眠昏迷奸: 0 }
            },
            受孕与生理: {
                子宫怀孕: 0, 怀孕进度: 0, 受孕概率: 0,
                生理周期阶段: "危险排卵期", 卵子状态: "丰熟待受精", 宫内精液归属: "无", 生产产卵次数: 0
            },
            体内精液存量: { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
            痕迹与标记: {
                体表痕迹: "无", 淫纹与刻印: "无", 公开涂鸦字迹: "无",
                穿刺与环饰: "无", 鞭痕与掌印: 0, 初夜破瓜纪念: "处女膜完好无损（尚未破瓜）"
            },
            体内道具与权限: {
                体内道具: "无", 束缚状态: "无", 穿戴中的标记物: "",
                肉体所有权: "自由身", 排泄与高潮权限: "自主控制", 常识改写状态: "无"
            },
            调教进度: { 规矩与日程: "", 条件反射触发词: "无", 媚药与发情毒: "无" },
            精神与心理扩展: { 当前敏感点: "", 催眠深度: 0 },
            按钮详情: {},
            性癖详情: {},
            自定义条目: {}
        };
    }

    let curVars = getInitialVars(), latestStatus = null, activeCat = null, curDetailIdx = 0, inSettings = false;
    let isCleaningDOM = false, cleanTimer = null, lastKnownCardKey = "";

    const SHORT_NAMES = {
        "档案与风评": "档案",
        "恶堕与脑改": "恶堕",
        "下流性癖库": "性癖",
        "六孔与储精": "六孔",
        "肉改与道具": "肉改",
        "从头到脚穿搭": "穿搭",
        "苗床与受孕": "受孕",
        "恩客与肉棒": "恩客",
        "淫乱总账本": "总账"
    };

    // =========================================================================
    // 💾 100分毕业升级1：楼层绑定与用户自定义分离缓存（删楼/重Roll自动精准回退数值！）
    // =========================================================================
    function getChatStoreKey() {
        const ctx = safeCtx();
        const cid = ctx?.chatId || ctx?.characterId || ctx?.name2 || "default_chat";
        return `${EXT_ID}_v10_cache_${cid}`;
    }

    function loadChatCache() {
        try {
            const cid = safeCtx()?.chatId || "default_chat";
            const raw = localStorage.getItem(getChatStoreKey()) || localStorage.getItem(`${EXT_ID}_v28_cache_${cid}`);
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }

    function saveChatCache(varsObj, floorLen = -1) {
        try {
            const ctx = safeCtx();
            const curLen = floorLen >= 0 ? floorLen : (ctx?.chat?.length || 0);
            localStorage.setItem(getChatStoreKey(), JSON.stringify({
                floorLen: curLen,
                快照: varsObj,
                按钮详情: varsObj.按钮详情 || {},
                性癖详情: varsObj.性癖详情 || {},
                自定义条目: varsObj.自定义条目 || {}
            }));
        } catch (e) {}
    }

    // 只合并用户的自定义按钮、配图和当楼层一致时的API快照，避免删楼后旧数值污染回退！
     function mergeUserCustomizations(baseVars, cached, currentChatLen) {
        if (!cached) return;
        if (cached.按钮详情) baseVars.按钮详情 = { ...baseVars.按钮详情, ...cached.按钮详情 };
        if (cached.性癖详情) baseVars.性癖详情 = { ...baseVars.性癖详情, ...cached.性癖详情 };
        if (cached.自定义条目) baseVars.自定义条目 = { ...baseVars.自定义条目, ...cached.自定义条目 };
        if (cached.快照?.档案?.当前认知名字) {
            baseVars.档案.当前认知名字 = cached.快照.档案.当前认知名字;
        }
        if (cached.floorLen === currentChatLen && cached.快照 && userSettings.apiSyncEnabled) {
            const s = cached.快照;
            ["核心数值", "精神与心理", "身体", "体内精液存量", "实况", "档案", "穿搭", "受孕与生理", "痕迹与标记", "体内道具与权限"].forEach(k => {
                if (s[k] && typeof s[k] === "object") Object.assign(baseVars[k], s[k]);
            });
        }
    }

    function applyNaturalMetabolism(floorText, targetVars) {
        if (!userSettings.autoMetabolism || !floorText) return;
        const cleanBody = floorText.replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|<options>[\s\S]*?<\/options>|<summary>[\s\S]*?<\/summary>/gi, "");
        if (!cleanBody) return;

            const sp = targetVars.体内精液存量;
            if (!sp) return;

            // 1. 深度花洒冲刷/灌洗（宫腔与阴道大幅排出）
            if (/(?:花洒|喷头|水流|温水).{0,16}(?:冲刷|冲洗|灌入|洗净).{0,16}(?:甬道|深处|残精|小穴|宫腔)/.test(cleanBody)) {
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.15));
                sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.35));
            }
            // 2. 手指探入抠洗/清理深处残精（完美适配伊一洗穴动作）
            else if (/(?:手指|并拢).{0,15}(?:探入|伸入|抠出|洗出|清理).{0,18}(?:残精|白浊|甬道|深处)/.test(cleanBody)) {
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.4));
                sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.75));
            }
            // 3. 走路/弯腰自然滴落外溢（微幅自然损耗）
            else if (/(?:滴落|淌下|顺着大腿|突破了花唇).{0,15}(?:水泥地|脚趾|地板|吧嗒|滴答)/.test(cleanBody)) {
                if (safeNum(sp.小穴毫升) > 1) sp.小穴毫升 = Math.max(1, safeNum(sp.小穴毫升) - 1);
                if (safeNum(sp.子宫毫升) > 3) sp.子宫毫升 = Math.max(2, safeNum(sp.子宫毫升) - 1);
            }

            // 4. 漱口/洗脸清理口腔
            if (/(?:漱口|吐出).{0,12}(?:残精|白浊|精液)/.test(cleanBody)) {
                sp.口内毫升 = Math.max(0, Math.round(safeNum(sp.口内毫升) * 0.3));
            }

            // 5. 睡眠/次日苏醒自然恢复体力与排空部分残液
            if (/(?:沉沉睡去|一觉睡到|次日清晨|第二天早上|醒来时已是)/.test(cleanBody)) {
                targetVars.身体.体力 = Math.min(100, safeNum(targetVars.身体.体力, 70) + 45);
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.25));
                sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.5));
                sp.口内毫升 = 0;
            }
        }

        // =========================================================================
        // 🍆 100分毕业升级3：自动扫描并构建「恩客与肉棒图鉴」引擎
        // =========================================================================
        function extractClientsFromHistory(v, u, c) {
            const ctx = safeCtx();
            const chatArr = ctx?.chat || [];
            const fullText = chatArr.map(m => safeStr(m?.mes)).join("\n");
            const clientMap = new Map();

            const upsertClient = (name, roleTag, cockDesc, statusTag, contribPts, dnaShare, detailDesc, thoughtStr) => {
                clientMap.set(name, {
                    name, roleTag, cockDesc, statusTag,
                    val: Math.min(100, Math.max(10, contribPts)),
                    dnaShare, detailDesc, thoughtStr
                });
            };

            const creampie = safeNum(v.计数?.射精?.内射);
            const vagCnt = safeNum(v.计数?.性交?.小穴);
            const wombMl = safeNum(v.体内精液存量?.子宫毫升);
            const vagMl = safeNum(v.体内精液存量?.小穴毫升);

            // 1. 优先读取 AI 通过 _.set('主角.恩客图鉴.XXX', ...) 写入的数据
            if (v.恩客图鉴 && typeof v.恩客图鉴 === "object") {
                Object.entries(v.恩客图鉴).forEach(([k, val]) => {
                    if (!k || k === "无") return;
                    const descStr = typeof val === "object" ? JSON.stringify(val) : String(val);
                    upsertClient(
                        k, "记录在册恩客", "粗硬滚烫雄性肉棒", "深度开发支配", 65, wombMl > 0 ? 50 : 0,
                        `【🍆 恩客档案与阳具特征】：${k}\n【📊 详细记录】：${descStr}`,
                        `一想起【${k}】那根滚烫粗硬的肉棒顶进身体最深处的滋味，我的骚穴和子宫口就会不受控制地一阵阵发麻收缩💦……🥵❤️`
                    );
                });
            }

            // 2. 自动识别正文中的高频恩客角色（完美适配熟客、王哥、王哥朋友及当前角色卡人物）
            if (/熟客/.test(fullText)) {
                const hasSemen = (wombMl + vagMl) > 0;
                upsertClient(
                    "力气极大的熟客",
                    "刚离去的凶猛嫖客",
                    "粗壮狰狞·力道狂暴·单次泵精17ml+",
                    hasSemen ? `刚无套内射灌满(${wombMl + vagMl}ml留存)` : "常客肉体支配",
                    Math.min(100, 58 + creampie * 4),
                    hasSemen ? 100 : 35,
                    `【🍆 阳具尺寸与侵犯特征】：柱身粗壮滚烫、棱角分明，抽插力道极大且持久凶猛，偏爱粗暴掐捏大腿内侧、掌掴臀肉与锁骨留咬痕，最后死死抵住宫颈口全量无套内射。\n` +
                    `【📊 对${u}的开发贡献】：刚刚完成一场高强度侵犯，将整整 ${wombMl || 15}ml 滚烫浓精尽数泵入${u}的宫腔深处、阴道残留 ${vagMl || 2}ml，并在臀肉上留下暗红掌印、大腿内侧掐出青紫指痕、右侧锁骨印下殷红咬痕。\n` +
                    `【🧬 宫内精液DNA占比】：当前占宫腔存留精液的 ${hasSemen ? "100%" : "主要历史残留"}（浓稠白浊正顺着合不拢的花唇拉丝滴落）。`,
                    `呼……刚才那个熟客力气大得吓人，不仅把我的屁股扇得火辣辣地疼，最后射精的时候龟头几乎是硬生生卡进子宫口里往里灌的💦！现在小肚子里满满当当全是他射进来的 ${wombMl + vagMl}ml 滚烫浓精，每走一步路都在往外漏白线呢😳🥵❤️！`
                );
            }

            if (/王哥/.test(fullText)) {
                upsertClient(
                    "隔壁王哥",
                    "即将登门的熟客老嫖客",
                    "熟稔粗鲁·喜好携友共享轮玩",
                    "今晚预约登门·带朋友同行",
                    48,
                    0,
                    `【🍆 恩客特征与癖好】：住在隔壁的熟客老男人，对${u}这具敏感熟肉之躯知根知底，作风粗野直接，甚至手握出租屋门锁钥匙或熟门熟路，喜欢带着狐朋狗友一同前来共享玩弄${u}。\n` +
                    `【📊 当前互动危机】：已约定今晚带一名男性朋友过来消费${u}的身体（双飞/前后夹击轮玩高危预警），迫使${u}必须在他们推门而入前抓紧把上一名熟客留在子宫里的残精抠洗干净。`,
                    `今晚隔壁王哥还要带个陌生朋友一起来……要是没能在他们进门前把肚子里上一个熟客射的精液洗干净，被王哥和他的朋友看到我满腿白浊的样子，今晚肯定会被他们两个一前一后活活操死在床上的💦🥵！`
                );
            }

            if (/朋友/.test(fullText) && /王哥/.test(fullText)) {
                upsertClient(
                    "王哥带来的朋友",
                    "未知新嫖客·多人轮玩潜伏",
                    "未知尺寸·充满好奇与侵略性",
                    "随同王哥即将抵达",
                    30,
                    0,
                    `【🍆 恩客特征与威胁】：由熟客王哥引荐并带入出租屋的陌生男人。面对${u}这样明码标价、早已被开发成第3阶段熟稔名器的暗娼，往往会展现出比熟客更不留情的粗暴玩弄欲与猎奇心理。\n` +
                    `【📊 潜在开发项目】：极易触发双穴同时填塞、轮流内射灌精、前后夹击与当面羞辱留影。`,
                    `虽然还不知道王哥带来的那个朋友长什么样、下面的东西有多粗多大……但一想到今晚要同时张开嘴和骚穴伺候两个男人，小肚子最深处就既紧张又隐隐发麻流水了😳💦……`
                );
            }

            if (clientMap.size === 0) {
                const defaultName = (c && c !== "1" && c !== "无角色卡") ? c : "潜在支配者/恩客";
                upsertClient(
                    defaultName,
                    vagCnt > 0 ? "肉体开发支配者" : "当前剧情核心人物",
                    vagCnt > 0 ? "已侵入刻下肉体记忆的雄性阳具" : "极具侵略气息的雄性存在",
                    vagCnt > 0 ? `累计贯穿${vagCnt}次·内射${creampie}次` : "近距离接触博弈中",
                    Math.min(100, 20 + vagCnt * 5 + creampie * 8),
                    wombMl > 0 ? 100 : 0,
                    `【🍆 角色档案与肉体关系】：${defaultName} 是当前剧情中与 ${u} 产生核心互动的对象。\n` +
                    `【📊 肉体开发统计】：目前累计在小穴留下 ${vagCnt} 次贯穿记录、${creampie} 次子宫内射记录，当前宫腔存留精液 ${wombMl}ml。`,
                    vagCnt > 0
                        ? `我的身体早就被刻下了属于男人的形状，每一次呼吸都能回想起被粗暴塞满时的酸胀电流💦🥵❤️！`
                        : `面对眼前的男人，我必须小心维持住姿态，可为什么心跳还是不受控制地加快了呢😳💦？`
                );
            }

            return Array.from(clientMap.values());
        }

        function calcStage6Score(rawPoints, unitWeight = 1.0, diffMult = 3.0, passesStage6Gate = false) {
            if (rawPoints <= 0) {
                return {
                    val: 0,
                    tier: 0,
                    curPts: 0,
                    nextThreshold: Math.max(1, Math.ceil((12 * diffMult) / unitWeight))
                };
            }
            const eff = (rawPoints * unitWeight) / Math.max(0.5, diffMult);
            const T1 = 12, T2 = 38, T3 = 88, T4 = 175, T5 = 320;
            let score = 0, nextTargetEff = T1;

            if (eff < T1) {
                score = Math.max(1, Math.min(19, Math.floor(2 + (eff / T1) * 17)));
                nextTargetEff = T1;
            } else if (eff < T2) {
                score = Math.min(39, Math.floor(20 + ((eff - T1) / (T2 - T1)) * 19));
                nextTargetEff = T2;
            } else if (eff < T3) {
                score = Math.min(59, Math.floor(40 + ((eff - T2) / (T3 - T2)) * 19));
                nextTargetEff = T3;
            } else if (eff < T4) {
                score = Math.min(79, Math.floor(60 + ((eff - T3) / (T4 - T3)) * 19));
                nextTargetEff = T4;
            } else if (eff < T5) {
                score = Math.min(99, Math.floor(80 + ((eff - T4) / (T5 - T4)) * 19));
                nextTargetEff = T5;
            } else {
                score = passesStage6Gate ? 100 : 99;
                nextTargetEff = T5;
            }

            const realNext = Math.max(Math.ceil(rawPoints) + 1, Math.ceil((nextTargetEff * diffMult) / unitWeight));
            return {
                val: score,
                tier: tier6(score, false),
                curPts: Math.round(rawPoints),
                nextThreshold: realNext
            };
        }

        function computeAllOrganDevelopments(v) {
            const c = v.计数 || {};
            const diff = getDifficultyProfile();
            const dMult = Math.max(0.5, diff.mult);

            const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼);
            const tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿);
            const creampie = safeNum(c.射精?.内射), swallow = safeNum(c.精液摄入?.吞精次数), swallowMl = safeNum(c.精液摄入?.累计毫升);
            const orgasm = safeNum(c.高潮?.总数), forceOrg = safeNum(c.高潮?.强制), edge = safeNum(c.高潮?.寸止);
            const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁);
            const mast = safeNum(c.自慰), exp = safeNum(c.暴露?.露出);
            const hooker = safeNum(c.交易?.接客卖身), gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
            const milk = safeNum(c.泌乳?.喷乳次数), milkMl = safeNum(c.泌乳?.累计毫升);
            const pregCnt = safeNum(v.受孕与生理?.生产产卵次数) + (v.受孕与生理?.子宫怀孕 ? 1 : 0);

            const corr = safeNum(v.核心数值?.淫乱恶堕);
            const cockLove = safeNum(v.核心数值?.对肉棒好感度);
            const obey = safeNum(v.精神与心理?.服从度);
            const shame = safeNum(v.精神与心理?.羞耻度, 100);

            const vagPts = vag * 1.0 + mast * 0.45 + creampie * 0.35 + squirt * 0.8 + gang * 1.8;
            const vagGate6 = (vag >= 80 * dMult && orgasm >= 50 * dMult && corr >= 95);
            const vagObj = calcStage6Score(vagPts, 1.0, dMult, vagGate6);

            const wombPts = creampie * 1.25 + vag * 0.25 + gang * 2.0 + pregCnt * 30;
            const wombGate6 = (creampie >= 70 * dMult && obey >= 95 && corr >= 95);
            const wombObj = calcStage6Score(wombPts, 1.1, dMult, wombGate6);

            const mouthPts = mouth * 1.0 + swallow * 1.25 + (swallowMl / 40);
            const mouthGate6 = ((mouth + swallow) >= 70 * dMult && cockLove >= 95);
            const mouthObj = calcStage6Score(mouthPts, 1.05, dMult, mouthGate6);

            const chestPts = tit * 1.25 + milk * 1.8 + (milkMl / 50) + mast * 0.3;
            const chestGate6 = ((tit + milk) >= 50 * dMult && corr >= 90);
            const chestObj = calcStage6Score(chestPts, 1.2, dMult, chestGate6);

            const clitPts = orgasm * 0.75 + forceOrg * 1.1 + edge * 1.5 + squirt * 1.6 + leak * 2.0 + mast * 0.6;
            const clitGate6 = (orgasm >= 60 * dMult && (squirt + leak) >= 20 * dMult);
            const clitObj = calcStage6Score(clitPts, 1.05, dMult, clitGate6);

            const analPts = anal * 1.35 + leak * 1.0 + gang * 1.5;
            const analGate6 = (anal >= 50 * dMult && shame <= 5);
            const analObj = calcStage6Score(analPts, 1.25, dMult, analGate6);

            const totalWeightedPts =
                vag * 1.0 + creampie * 1.3 + mouth * 0.8 + swallow * 1.0 + anal * 1.2 +
                tit * 0.6 + foot * 0.5 + orgasm * 0.5 + (squirt + leak) * 1.2 +
                mast * 0.4 + exp * 1.0 + hooker * 1.4 + gang * 2.5 + sleep * 1.5;

            const masterGate6 = (
                (vagObj.val >= 80 || wombObj.val >= 80 || mouthObj.val >= 80) &&
                totalWeightedPts >= 320 * dMult
            );
            const masterCurve = calcStage6Score(totalWeightedPts, 1.0, dMult, masterGate6);

            return {
                vagObj, wombObj, mouthObj, chestObj, clitObj, analObj,
                totalWeightedPts, masterCurve
            };
        }

        function calibrateMentalMetrics(v) {
            const dev = computeAllOrganDevelopments(v);
            const expectedScore = dev.masterCurve.val;

            if (!userSettings.strictMentalLock) return;

            const rawTotal = dev.totalWeightedPts;
            const hardMax100 = dev.masterCurve.val >= 100 ? 100 : 99;
            const maxLongTermCap = rawTotal <= 0 ? 12 : Math.min(hardMax100, expectedScore + 10);
            const minLongTermFloor = rawTotal <= 0 ? 0 : Math.max(0, expectedScore - 8);

            const calibratedHypno = Math.min(safeNum(v.精神与心理扩展?.催眠深度), Math.min(hardMax100, maxLongTermCap + 15));
            if (v.精神与心理扩展) v.精神与心理扩展.催眠深度 = calibratedHypno;
            const finalCap = Math.min(hardMax100, Math.max(maxLongTermCap, Math.round(calibratedHypno * 0.85)));

            const syncMetric = (val, floorOffset = 0, capOffset = 0) => {
                const cur = Math.max(0, Math.min(100, safeNum(val, 0)));
                const low = Math.max(0, Math.min(hardMax100, minLongTermFloor + floorOffset));
                const high = Math.max(low, Math.min(hardMax100, finalCap + capOffset));
                return Math.max(low, Math.min(cur, high));
            };

            v.核心数值.对肉棒好感度 = syncMetric(v.核心数值.对肉棒好感度, 0, 2);
            v.核心数值.淫乱恶堕 = syncMetric(v.核心数值.淫乱恶堕, 0, 0);
            v.精神与心理.服从度 = syncMetric(v.精神与心理.服从度, -2, 4);
            v.精神与心理.沦陷度 = syncMetric(v.精神与心理.沦陷度, -2, 2);
            v.精神与心理.人格崩解度 = syncMetric(v.精神与心理.人格崩解度, -8, -2);
            v.精神与心理.媚药精液毒瘾 = syncMetric(v.精神与心理.媚药精液毒瘾, -4, 5);

            const minShameFloor = hardMax100 === 100 ? 0 : Math.max(1, 100 - finalCap);
            const maxShameCap = Math.max(minShameFloor, 100 - minLongTermFloor);
            const curShame = Math.max(0, Math.min(100, safeNum(v.精神与心理.羞耻度, 100)));
            v.精神与心理.羞耻度 = Math.max(minShameFloor, Math.min(curShame, maxShameCap));

            const shortTermCap = rawTotal <= 0 ? 45 : (rawTotal <= 15 ? 78 : 100);
            const shortTermFloor = rawTotal > 0 ? Math.min(60, Math.round(expectedScore * 0.6)) : 0;
            v.核心数值.性欲程度 = Math.max(shortTermFloor, Math.min(Math.max(0, safeNum(v.核心数值.性欲程度)), shortTermCap));
            v.精神与心理.快感累积 = Math.max(Math.round(shortTermFloor * 0.65), Math.min(Math.max(0, safeNum(v.精神与心理.快感累积)), shortTermCap));
        }

        function detectProtagonistName(v) {
            const ctx = safeCtx();
            const rawUser = safeStr(ctx?.name1, "主角").trim();
            const cardName = safeStr(ctx?.name2).trim();
            const chatArr = ctx?.chat || [];

            if (v?.档案?.当前认知名字 && safeStr(v.档案.当前认知名字).trim() && v.档案.当前认知名字 !== "主角") {
                return safeStr(v.档案.当前认知名字).trim();
            }

            let detected = "";
            const recent = chatArr.slice(-8);
            for (let i = recent.length - 1; i >= 0; i--) {
                const mes = safeStr(recent[i]?.mes);
                if (!mes) continue;

                const archMatch = mes.match(/\[\[\s*角色档案\s*\]\]\s*(?:->|→)\s*([^\s|｜\n]{2,18})/);
                if (archMatch && archMatch[1] && !archMatch[1].includes("日期")) {
                    detected = archMatch[1].replace(/\*\*/g, "").trim();
                    break;
                }
                const nameLine = mes.match(/姓名[：:]\s*([^\s|｜\n]{1,12})/);
                if (nameLine && nameLine[1]) {
                    detected = nameLine[1].trim();
                    break;
                }
                const barMatch = mes.match(/(?:【|\[)\s*状态栏\s*[｜|:：]\s*([^】\]\n]{1,18}?)\s*(?:】|\])/);
                if (barMatch && barMatch[1] && barMatch[1].trim() !== cardName) {
                    detected = barMatch[1].trim();
                }
            }

            if (detected) {
                if (v && v.档案) v.档案.当前认知名字 = detected;
                return detected;
            }
            return rawUser || "主角";
        }

        function calcHoleCapacities(v) {
            const c = v.计数 || {};
            const corr = safeNum(v.核心数值?.淫乱恶堕);
            const mouthCnt = safeNum(c.性交?.口) + safeNum(c.精液摄入?.吞精次数);
            const vagCnt = safeNum(c.性交?.小穴);
            const creampie = safeNum(c.射精?.内射);
            const analCnt = safeNum(c.性交?.屁眼);

            return {
                mouthMax: Math.min(1800, Math.round(45 + mouthCnt * 3.5 + corr * 1.5)),
                vagMax: Math.min(1200, Math.round(25 + vagCnt * 3.0 + corr * 1.0)),
                wombMax: Math.min(2000, Math.round(20 + creampie * 5.0 + vagCnt * 1.5 + corr * 1.8)),
                analMax: Math.min(1800, Math.round(35 + analCnt * 4.5 + corr * 1.5))
            };
        }

        function computeUnlockedFetishes(v) {
            const c = v.计数 || {};
            const diff = getDifficultyProfile();
            const dMult = diff.mult;

            const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼);
            const tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), creampie = safeNum(c.射精?.内射);
            const swallow = safeNum(c.精液摄入?.吞精次数), orgasm = safeNum(c.高潮?.总数);
            const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁), mast = safeNum(c.自慰);
            const exp = safeNum(c.暴露?.露出), hooker = safeNum(c.交易?.接客卖身);
            const milk = safeNum(c.泌乳?.喷乳次数), gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
            const edge = safeNum(c.高潮?.寸止), whip = safeNum(v.痕迹与标记?.鞭痕与掌印);
            const corr = safeNum(v.核心数值?.淫乱恶堕);

            const totalCount = vag + mouth + anal + tit + foot + creampie + swallow + orgasm + squirt + leak + mast + exp + hooker + milk + gang + sleep + whip;
            const resultMap = new Map();

            const upsertAuto = (shortName, originTpl, pts, unitWeight = 1.0, gate6 = false) => {
                if (pts <= 0) return;
                const { val: calcVal, curPts, nextThreshold } = calcStage6Score(pts, unitWeight, dMult, gate6 && corr >= 95);
                const stg = stageNameFromVal(calcVal);
                const originStr = `${originTpl}（当前复合开发点：${curPts}，距下一阶需达 ${nextThreshold} 点｜难度：${diff.name}）`;

                resultMap.set(shortName, {
                    name: shortName, origin: originStr, val: calcVal, stage: stg,
                    countNow: curPts, nextTarget: nextThreshold
                });
            };

            upsertAuto("挨操肉穴瘾", `骚逼贯穿 ${vag} 次 + 自慰 ${mast} 次 + 内射 ${creampie} 次，阴道层叠肉褶已形成阳具轮廓记忆`, Math.round(vag + mast * 0.4 + creampie * 0.3), 1.0, vag >= 80 * dMult);
            upsertAuto("子宫受精癖", `宫腔已被滚烫浓精内射浇灌 ${creampie} 次，宫颈口习惯被龟头顶开锁精`, Math.round(creampie * 1.2 + vag * 0.2), 1.1, creampie >= 70 * dMult);
            upsertAuto("深喉吞精癖", `骚口已口交 ${mouth} 次、吞精 ${swallow} 次，食道粘膜与味蕾被雄性精腥味彻底浸染`, mouth + swallow, 1.0, (mouth + swallow) >= 70 * dMult);
            upsertAuto("后庭扩菊癖", `屁眼已被粗暴开发 ${anal} 次，直肠括约肌逐渐适应粗大异物塞满与排泄错觉`, anal, 1.25, anal >= 50 * dMult);
            upsertAuto("乳交奉侍癖", `丰乳已夹击服侍肉棒 ${tit} 次，乳肉与乳尖在摩擦中敏化充血`, Math.round(tit + mast * 0.25), 1.3, tit >= 40 * dMult);
            upsertAuto("母畜喷乳癖", `乳腺已被打通并挤奶喷乳 ${milk} 次，乳头一被吸吮即引发子宫共振`, milk, 1.6, milk >= 35 * dMult);
            upsertAuto("玉足恋精癖", `玉足已足交玩弄阳具 ${foot} 次，脚趾缝沾染浓精即条件反射蜷缩`, foot, 1.35, foot >= 35 * dMult);
            upsertAuto("潮吹失禁癖", `累计绝顶 ${orgasm} 次、潮吹 ${squirt} 次、漏尿失禁 ${leak} 次，尿道与高潮神经短路`, Math.round(orgasm * 0.5 + squirt * 2 + leak * 2.5), 1.0, (squirt + leak) >= 25 * dMult);
            upsertAuto("寸止焦躁癖", `遭受寸止折磨 ${edge} 次，长期求而不得令神经对高潮产生病态饥渴`, edge, 1.6, edge >= 30 * dMult);
            upsertAuto("受虐M质痛感转化", `身体承受抽打掌掴留痕 ${whip} 处，痛觉神经与多巴胺快感回路交融`, whip, 1.6, whip >= 35 * dMult);
            upsertAuto("自慰抠穴癖", `难耐空虚自行抠挖骚穴 ${mast} 次，手指沾满拉丝淫水自我亵渎`, mast, 1.35, mast >= 40 * dMult);
            upsertAuto("公开露出癖", `当众赤裸露出或被视奸 ${exp} 次，将旁人下流视线转化为催情快感`, exp, 1.4, exp >= 30 * dMult);
            upsertAuto("轮奸肉便器癖", `经历多人轮奸群交 ${gang} 次，三穴习惯同时被多根肉棒塞满抽插`, gang, 2.0, gang >= 20 * dMult);
            upsertAuto("睡奸无防备癖", `在睡眠或昏迷无防备下被侵犯 ${sleep} 次，潜意识养成梦中自动分腿本能`, sleep, 1.8, sleep >= 20 * dMult);
            upsertAuto("风尘卖淫癖", `已接客卖身或共享 ${hooker} 次，自我认知向明码标价的泄欲肉具异化`, hooker, 1.1, hooker >= 80 * dMult);

            if (Array.isArray(v.性癖?.条目)) {
                v.性癖.条目.forEach(raw => {
                    const s = safeStr(raw).trim();
                    if (!s) return;
                    if (totalCount === 0 && corr === 0 && /[-\s]0\/100$/.test(s)) return;
                    if (/^(?:见之欲呕|清心寡欲|初守清白|羞极即泄|抗命顶撞|心如止水|自我完整)/.test(s) && totalCount > 5) return;

                    const parts = s.split("-");
                    const rawName = safeStr(parts[0], "特殊性癖").trim();
                    if (resultMap.has(rawName)) return;

                    const origin = safeStr(parts[1], "长期调教与肉体开发形成").trim();
                    let num = 15;
                    const m = s.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+)/);
                    if (m) {
                        const n1 = parseFloat(m[1]), n2 = parseFloat(m[2]);
                        num = n2 > 0 ? Math.round((n1 / n2) * 100) : Math.round(n1);
                    }
                    const maxAllowed = calcStage6Score(Math.max(1, totalCount * 0.7), 1.0, dMult, false).val;
                    num = Math.max(1, Math.min(99, Math.min(num, maxAllowed + 10)));
                    resultMap.set(rawName, {
                        name: rawName, origin, val: num, stage: stageNameFromVal(num),
                        countNow: totalCount, nextTarget: Math.ceil(totalCount * 1.5 + 15)
                    });
                });
            }

            return Array.from(resultMap.values());
        }

        function buildFetishRichDesc(fetishObj, v, u) {
            const { name, origin, val, stage, countNow = 0, nextTarget = 20 } = fetishObj;
            const t = tier6(val, false);
            const diff = getDifficultyProfile();

            const apiFet = v.性癖详情?.[name];
            if (apiFet && (apiFet.desc || apiFet.thought)) {
                return `【🧬 性癖名称】：「${name}」（当前开发进度：${stage} · ${val}/100）\n` +
                       `【🎚️ 难度档位与进阶门槛】：${diff.name}｜当前复合开发点：${countNow} -> 晋升下一阶需达：${nextTarget}\n` +
                       `【🔓 解锁成因与开发履历】：${apiFet.origin || origin}\n` +
                       `【🔞 第${t + 1}阶段微观生理、神经回路与粘膜发作实况】：\n${apiFet.desc || "该性癖已在体内深度激活。"}\n` +
                       `💭【${u}的${stage}实时心声】：“*${cleanThoughtText(apiFet.thought || "身体一碰到这种刺激就自己发软流水了……")}*”`;
            }

            const stageDescs = [
                `【第一阶段·异物初侵与粘膜屈辱记忆】（${val}/100）：「${name}」刚刚在${u}的肉体与浅层神经上烙下最初的痕迹（当前开发点 ${countNow}，升入二阶需 ${nextTarget}）。理智上仍怀有本能的羞耻、排斥或紧绷隐忍，但被强行摩擦撑开过的娇嫩粘膜与神经末梢已记住了那种灼热酸麻的异物侵入感，事后回想时小腹会泛起微妙的麻痒。`,
                `【第二阶段·条件反射建立与春水敏化】（${val}/100）：「${name}」已演化至第二阶段（开发点 ${countNow}）！肉体的巴甫洛夫条件反射开始背叛大脑矜持——只要闻到相似的雄性腥气、听到暗示声响或处于特定体位下，呼吸便会骤然滚烫紊乱，乳尖充血发硬，腿心两瓣花唇更是无需前戏便自动泌出晶莹粘稠的润滑春水。`,
                `【第三阶段·脊髓快感成瘾与戒断空虚】（${val}/100）：「${name}」已深化至第三阶段（开发点 ${countNow}），彻底化作刻进骨髓与脊髓反射弧里的快感本能！一旦长时间未能体验「${name}」带来的强烈刺激，阴道内壁与子宫颈口就会泛起毒瘾发作般的空虚抓挠感与酸胀饥渴，在性交中会不知不觉地主动扭腰迎合索取！`,
                `【第四阶段·器质性淫靡肉改与母狗狂热】（${val}/100）：「${name}」已恶化至第四阶段重度肉改状态（开发点 ${countNow}）！长期高强度的开发已令${u}的相应器官产生不可逆的淫靡形变——括约肌松弛外翻、敏感肉珠肥大充血、粘膜全天候泛着淫水光泽。面对「${name}」时毫无廉耻地主动敞开双腿、摇晃臀浪乞求更粗暴的对待！`,
                `【第五阶段·理智崩解失禁与公用便器化】（${val}/100）：「${name}」已达第五阶段极限边缘（开发点 ${countNow}）！人类尊严与羞耻防线在此性癖面前彻底粉碎，只要稍微触发「${name}」就会引发全身过电痉挛、瞳孔失焦并伴随失控的潮吹或漏尿，将自己完全视作专为「${name}」而生的泄欲肉壶！`,
                `【👑 第六阶段·神格级脑髓熔断与永久器官定型】（100/100 MAX）：全书最高满贯终极形态（累计开发点突破 ${countNow} 大关）！「${name}」已将${u}的大脑皮层阿片快感受体与生殖器官100%永久重塑！哪怕只是听到相关字眼或闻到气味，便会瞬间瞳孔化作爱心、翻白眼吐舌流涎，全身六孔同时狂喷潮吹绝顶！`
            ];

            const stageThoughts = [
                `呜……明明才经历过「${name}」，被摩擦撑开过的粘膜现在还火辣辣地发酸发麻💦。我怎么可能会喜欢这种粗鲁下流的事呢……可为什么一闭上眼回想刚才的触感，小肚子最深处还是会不受控制地揪紧渗水呢😳❤️？`,
                `不、不对劲……为什么现在一碰到「${name}」的苗头，我的胸口就闷得发慌、两腿之间的花唇自己就充血湿透了啊😳💦？大脑明明还在命令自己守住底线，可这具叛徒身体早就记住了那种酸麻灭顶的滋味🥵❤️！`,
                `哈啊……已经彻底瞒不住自己了💦！只要一触发「${name}」，整条脊椎骨就像通了高压电一样从尾椎爽到头顶，脚趾头都麻得死死蜷缩起来了🥵！快点用更凶狠、更下流的力道对我做「${name}」吧💦❤️！`,
                `呜汪♡……受不了了，只要稍微停下「${name}」，我的骚穴和小腹就像有无数只蚂蚁在爬一样，淫水顺着大腿根哗啦啦地往下流个不停🥵💦！现在的我就是一条只为「${name}」摇尾巴的发情母狗呀❤️❤️！`,
                `啊啊♡……尊严和脑子早就已经被「${name}」操碎了🥵💦！不管是谁都好，快过来用最粗暴的手段享用我这具专门为了「${name}」而生的泄欲肉便器吧，把我灌满到漏出来呀❤️❤️！`,
                `啊嘿、呕咕♡……100%彻底坏掉了！「${name}」已经把${u}的脑髓和子宫彻底改造成神格级肉壶了🥵💦！眼珠子往上翻着回不来了，舌头伸在外面流着哈喇子，全身的洞都在噗嗤噗嗤狂喷潮吹和骚尿，请生生世世把我操死在「${name}」的绝顶地狱里吧❤️❤️❤️！！`
            ];

            return `【🧬 性癖名称】：「${name}」（当前开发进度：${stage} · ${val}/100）\n` +
                   `【🎚️ 难度档位与进阶门槛】：${diff.name}｜当前复合点 ${countNow}，下一阶需 ${nextTarget}\n` +
                   `【🔓 解锁成因与开发履历】：${origin}\n` +
                   `【🔞 第${t + 1}阶段微观生理与神经发作实况】：\n${stageDescs[t]}\n` +
                   `💭【${u}的${stage}实时心声】：“*${stageThoughts[t]}*”`;
        }

        function varsToYaml(userName, varsObj) {
            const cleanCopy = { ...varsObj };
            delete cleanCopy.按钮详情;
            delete cleanCopy.性癖详情;
            delete cleanCopy.自定义条目;
            function serialize(obj, indent = 2) {
                const pad = " ".repeat(indent); let out = "";
                for (const [k, v] of Object.entries(obj || {})) {
                    if (v === "" || v === "无" || v === 0) continue;
                    if (Array.isArray(v)) {
                        if (!v.length) continue;
                        out += `${pad}${k}:\n`;
                        for (const item of v) out += `${pad}  - ${item}\n`;
                    } else if (v !== null && typeof v === "object") {
                        const sub = serialize(v, indent + 2);
                        if (sub) out += `${pad}${k}:\n` + sub;
                    } else {
                        out += `${pad}${k}: ${v}\n`;
                    }
                }
                return out;
            }
            const bodyStr = serialize(cleanCopy, 2);
            return `${userName} (注：未列出的计数默认为0，未列出的状态默认为无):\n` + (bodyStr || "  初始状态: 全0\n");
        }

        function buildReverseBodyEnforcementRules(u, v) {
            if (!userSettings.injectReversePrompt) return "";
            const dev = computeAllOrganDevelopments(v);
            const sp = v.体内精液存量 || {};
            const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
            const corr = safeNum(v.核心数值?.淫乱恶堕);
            const shame = safeNum(v.精神与心理?.羞耻度, 100);
            const obey = safeNum(v.精神与心理?.服从度);
            const rules = [];

            const vagT = dev.vagObj.tier;
            if (vagT >= 4) {
                rules.push(`- 【🌺小穴已达第${vagT + 1}阶段(${dev.vagObj.val}/100·永久洞开肉便器)】：正文中涉及${u}的下体或性交时，**绝对禁止**描写“紧致、干涩、艰难挤入或像处女一样疼”！必须描写其肥厚阴唇长期外翻充血、穴口常驻微张合不拢、稍微触碰甚至闻到雄性气味便拉丝泛滥，插入时毫无阻碍地滑入到底、层叠肉壁如活物般自动绞紧吸吮肉棒！`);
            } else if (vagT >= 2) {
                rules.push(`- 【🌺小穴已达第${vagT + 1}阶段(${dev.vagObj.val}/100·熟稔名器)】：正文中${u}的阴道已被充分开发，花唇红肿微张、极易分泌大量淫水润滑，插入顺畅且肉壁会本能迎合抽插节奏。`);
            }

            const wombT = dev.wombObj.tier;
            if (wombT >= 3) {
                rules.push(`- 【🫀子宫已达第${wombT + 1}阶段(${dev.wombObj.val}/100·宫口脱垂锁精苗床)】：正文中涉及深顶或内射时，必须描写其子宫颈口软烂松弛、甚至主动向下脱垂张开小口迎合龟头顶入，内射后子宫会贪婪收缩锁住浓精！`);
            }

            if (dev.mouthObj.tier >= 3) {
                rules.push(`- 【👄骚口已达第${dev.mouthObj.tier + 1}阶段(${dev.mouthObj.val}/100·深喉吞精壶)】：口交时无任何呕吐排斥反应，咽喉自动放松包裹龟头，吞咽精液时展现出本能的痴迷与顺从。`);
            }
            if (dev.chestObj.tier >= 3) {
                rules.push(`- 【🍒丰乳已达第${dev.chestObj.tier + 1}阶段(${dev.chestObj.val}/100·泌乳淫乳)】：乳头常驻充血硬挺，隔着衣物也顶出明显凸起，被揉捏吸吮时极易引发全身颤栗甚至泌乳反应。`);
            }
            if (dev.clitObj.tier >= 3) {
                rules.push(`- 【💧阴蒂与尿道已达第${dev.clitObj.tier + 1}阶段(${dev.clitObj.val}/100·潮吹失禁体质)】：阴蒂肥大充血外露，高潮时极易伴随括约肌失控、狂喷潮吹或漏尿失禁描写！`);
            }

            if (totalMl > 0) {
                rules.push(`- 【🥛体内当前存留 ${totalMl}ml 浓精（宫腔${safeNum(sp.子宫毫升)}ml/阴道${safeNum(sp.小穴毫升)}ml/口胃${safeNum(sp.口内毫升)}ml/后庭${safeNum(sp.屁眼毫升)}ml）】：正文中${u}在站立、迈步或变换姿势时，必须写出下腹沉甸甸的坠胀感，以及浓稠白浊顺着合不拢的肉缝或大腿内侧缓缓滴淌拉丝的物理细节！`);
            }

            if (corr >= 80 || shame <= 20) {
                rules.push(`- 【🖤精神已达高阶恶堕(恶堕${corr}%/羞耻${shame}%/服从${obey}%)】：正文中${u}面对赤裸、视奸、粗暴侵犯或下流命令时，**严禁再出现清纯少女般的激烈反抗或羞愤欲绝**！其神态、语言与肢体必须体现出已被调教透彻的麻木顺从、不知廉耻或主动摇臀索取！`);
            } else if (corr >= 40) {
                rules.push(`- 【🖤精神已染风尘/食髓知味(恶堕${corr}%/服从${obey}%)】：${u}表面或许平淡或微有矜持，但身体对男人的触碰和性交早已习以为常，动作熟练顺从。`);
            }

            if (!rules.length) return "";
            return `\n【🚨 状态栏1.0反向支配正文铁律（最高优先级：主AI撰写正文时必须100%体现以下已定型的肉体与精神状态，严禁OOC降级描写！）】\n${rules.join("\n")}\n`;
        }

        // =========================================================================
        // 📝 100分毕业升级4：四联防呆省流指令模板（确保主AI同步更新计数+精液+红痕穿搭+独白）
        // =========================================================================
        function buildFullSystemPrompt(userName, currentVars) {
            const currentYaml = varsToYaml(userName, currentVars);
            const diff = getDifficultyProfile();
            const reverseRules = buildReverseBodyEnforcementRules(userName, currentVars);
            const c = currentVars.计数 || {};
            const isZeroInit = (safeNum(c.性交?.小穴) + safeNum(c.性交?.口) + safeNum(c.交易?.接客卖身)) === 0;
            const openTag = "<" + "UpdateVariable>";
            const closeTag = "</" + "UpdateVariable>";

            const autoInitRule = isZeroInit
                ? `\n【⚠️ 开局非处女人设自动校准指令】：当前总账次数全为0。若主角(${userName})在设定中不是处女（如已是妓女/暗娼/熟女/性奴等），请在本回合末尾的 ${openTag} 中，直接用 _.set 将她的历史累计次数（如 计数.交易.接客卖身、计数.性交.小穴、计数.射精.内射 等）以及 体内精液存量 一次性设为其人设对应的真实非零数值！`
                : "";

            return `\n【当前变量库实时注入值（调教难度系数：${diff.mult}x｜真实身份：${detectRealCharacterIdentity(currentVars)}）】\n${currentYaml}` +
                   autoInitRule +
                   reverseRules +
                   `\n【🔥状态栏1.0 省流极速四联更新规范】\n` +
                   `1. 严禁在正文中输出冗长的【状态栏】...【/状态栏】文本面板（前端插件会自动渲染9大板块图形UI）！\n` +
                   `2. 每条回复正文结束后，必须在最末尾输出唯一一个 ${openTag}...${closeTag} 块，按以下【四联防漏模板】用 _.set 更新本轮实际发生变化的项：\n` +
                   `${openTag}\n` +
                   `// ① 计数与体力变更（若有发生性交/内射/清理/接客则更新）\n` +
                   `_.set('${userName}.计数.性交.小穴', ${safeNum(c.性交?.小穴)});\n` +
                   `// ② 体内精液存量增减（若有新射入或抠洗/冲刷排出则更新具体ml数）\n` +
                   `_.set('${userName}.体内精液存量.子宫毫升', ${safeNum(currentVars.体内精液存量?.子宫毫升)});\n` +
                   `_.set('${userName}.体内精液存量.小穴毫升', ${safeNum(currentVars.体内精液存量?.小穴毫升)});\n` +
                   `// ③ 体表新痕迹与当前穿搭变更（掌印/指痕/咬痕/睡裙等）\n` +
                   `_.set('${userName}.痕迹与标记.体表痕迹', '${safeStr(currentVars.痕迹与标记?.体表痕迹, "臀部掌印、大腿内侧指痕与锁骨咬痕")}');\n` +
                   `_.set('${userName}.实况.当前衣装', '${safeStr(currentVars.实况?.当前衣装, "全身赤裸")}');\n` +
                   `// ④ 实时姿势与第一人称淫乱心声（必更）\n` +
                   `_.set('${userName}.实况.当前姿势', '简短概括当前动作姿势');\n` +
                   `_.set('${userName}.实况.内心独白', '第一人称带❤️💦🥵的实时细腻心声');\n` +
                   `${closeTag}\n` +
                   `3. 除开局非处女人设校准外，平时严禁将恶堕度、好感度、服从度直接跳满100，每次仅允许根据剧情微调 1~4 点！`;
        }

        function fmtKey(rk, barTheme = "pleas", subBarCfg = null, hideBar = false, stagePctOverride = null) {
            const rawKeyStr = safeStr(rk, "未命名状态项");
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
            let pct = null, rawRatioStr = null;
            const m = rawKeyStr.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+(?:\.\d+)?)([a-zA-Z\u4e00-\u9fa5]*)/);
            if (m) {
                const cur = parseFloat(m[1]), max = parseFloat(m[2]);
                rawRatioStr = `${m[1]}/${m[2]}${m[3] || ""}`;
                if (max > 0) pct = Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
            } else {
                const sm = { "第一阶段": 12, "第二阶段": 32, "第三阶段": 52, "第四阶段": 72, "第五阶段": 90, "第六阶段": 100 };
                for (const [k, v] of Object.entries(sm)) if (rawKeyStr.includes(k)) { pct = v; break; }
            }

            const badges = [];
            let cleanTitle = rawKeyStr
                .replace(/「([^」]{1,45})」/g, (_, s) => {
                    const isStage6 = s.includes("第六阶段") || s.includes("神格") || s.includes("永久洞开") || s.includes("100%");
                    const isStage5 = !isStage6 && (s.includes("第五阶段") || s.includes("终极") || s.includes("便器") || s.includes("危险排卵"));
                    const cls = isStage6 ? "st-stage6-badge" : (isStage5 ? "st-stage5-badge" : "");
                    const bBg = isStage5 ? "linear-gradient(90deg,#ff003c,#2b0012)" : tc.hi;
                    const bCol = (isStage6 || isStage5) ? "#fff" : tc.text;
                    badges.push(`<span class="${cls}" style="background:${bBg};border:1px solid ${tc.sec};color:${bCol};padding:1px 6px;border-radius:6px;font-size:10.5px;font-weight:bold;white-space:nowrap;">${s}</span>`);
                    return "";
                })
                .replace(/[（(]([^）)]{1,45}?(?:阶段|\d+\s*[\/／]\s*\d+)[^）)]{0,25}?)[）)]/g, (_, s) => {
                    badges.push(`<span style="background:rgba(255,255,255,0.1);border:1px solid ${tc.prim};color:${tc.prim};padding:1px 6px;border-radius:6px;font-size:10.5px;white-space:nowrap;">${s}</span>`);
                    return "";
                })
                .replace(/[：:]\s*(\d+(?:\.\d+)?\s*[\/／]\s*\d+[a-zA-Z\u4e00-\u9fa5]*)\s*$/, (_, n) => {
                    if (!hideBar) {
                        badges.unshift(`<span style="background:rgba(249,226,175,0.15);border:1px solid rgba(249,226,175,0.42);color:#f9e2af;padding:1px 6px;border-radius:6px;font-size:11px;font-family:Consolas,monospace;font-weight:bold;white-space:nowrap;">${n}</span>`);
                    }
                    return "";
                })
                .replace(/[：:]\s*$/, "").trim();

            const keyHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;width:100%;">
                    <span style="color:#f9e2af;font-weight:bold;font-size:13px;line-height:1.35;word-break:break-word;">${cleanTitle}</span>
                    ${badges.length ? `<div style="display:flex;flex-wrap:wrap;gap:3px;justify-content:flex-end;">${badges.join("")}</div>` : ""}
                </div>`;

            let barHTML = "";
            if (pct !== null && !hideBar && barTheme !== "none") {
                const st = getThemedBarStyle(pct, barTheme);
                const mainLabel = subBarCfg ? `${pct}%` : (rawRatioStr && rawRatioStr.includes("ml") ? rawRatioStr : `${pct}%`);
                const barTitle = subBarCfg ? (subBarCfg.mainName || "🔥 阶位进度") : `Lv.${st.tier + 1} 进度`;

                barHTML = `<div style="display:flex;flex-direction:column;gap:5px;margin-top:4px;width:100%;background:rgba(0,0,0,0.36);padding:6px 8px;border-radius:9px;border:1px solid rgba(255,255,255,0.08);box-sizing:border-box;">
                    <div style="display:flex;flex-direction:column;gap:3px;width:100%;">
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;width:100%;flex-wrap:wrap;">
                            <span style="font-size:10.5px;color:#f5c2e7;font-weight:bold;">${barTitle} <b style="color:${st.labelColor};font-family:Consolas,monospace;">${mainLabel}</b></span>
                            ${st.emo}
                        </div>
                        <div style="width:100%;height:8px;background:rgba(0,0,0,0.82);border:1px solid rgba(255,255,255,0.15);border-radius:99px;overflow:hidden;padding:1px;box-sizing:border-box;">
                            <div style="width:${pct}%;height:100%;background:${st.grad};border-radius:99px;box-shadow:${st.glow};transition:width 0.35s ease;"></div>
                        </div>
                    </div>`;

                if (subBarCfg) {
                    const subPct = Math.max(0, Math.min(100, safeNum(subBarCfg.pct, 0)));
                    const subSt = getThemedBarStyle(subPct, subBarCfg.theme || "semen");
                    barHTML += `
                    <div style="display:flex;flex-direction:column;gap:3px;width:100%;padding-top:3px;border-top:1px dashed rgba(255,255,255,0.08);">
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;width:100%;flex-wrap:wrap;">
                            <span style="font-size:10.5px;color:${subSt.labelColor};font-weight:bold;">${subBarCfg.label || "💧 实时容量"} <b style="font-family:Consolas,monospace;">${subBarCfg.text || (subPct + "%")}</b></span>
                            ${subSt.emo}
                        </div>
                        <div style="width:100%;height:6.5px;background:rgba(0,0,0,0.82);border:1px solid rgba(255,255,255,0.12);border-radius:99px;overflow:hidden;padding:1px;box-sizing:border-box;">
                            <div style="width:${subPct}%;height:100%;background:${subSt.grad};border-radius:99px;box-shadow:${subSt.glow};transition:width 0.35s ease;"></div>
                        </div>
                    </div>`;
                }
                barHTML += `</div>`;
            }

            const finalPctForImg = stagePctOverride !== null ? stagePctOverride : pct;
            return { keyHTML, barHTML, cleanTitle, pct: finalPctForImg };
        }

        function extractDynamicContext(u, c) {
            const ctx = safeCtx();
            const chatArr = ctx?.chat || [];
            const charDesc = safeStr(ctx?.characters?.[ctx?.characterId]?.description);
            const personaDesc = safeStr(ctx?.power_user?.persona_description);

            const res = {
                identity: "", bodyDesc: "", thought: "", pose: "",
                mouth: "", chest: "", vag: "", womb: "", anal: "",
                headWear: "", neckWear: "", braWear: "", topWear: "",
                pantyWear: "", bottomWear: "", sockWear: "", shoeWear: ""
            };

            const recent = chatArr.slice(-6);
            const allSents = [];
            for (let i = recent.length - 1; i >= 0; i--) {
                const raw = safeStr(recent[i]?.mes).replace(/<think[\s\S]*?<\/think>/gi, "").replace(/<think_nya>[\s\S]*?<\/think_nya>/gi, "");
                if (!raw) continue;
                const cleanBody = raw.split(/【\s*状态栏|<UpdateVariable>|<options>/i)[0] || raw;
                if (!res.thought) {
                    const im = [...cleanBody.matchAll(/\*([^*\n]{12,500})\*/g)].map(m => m[1].trim());
                    if (im.length) res.thought = im[im.length - 1];
                }
                const sents = cleanBody.split(/[。！？；\n\r]+/).map(s => s.replace(/\*[^*]*\*/g, "").replace(/<\/?[a-z]+>/gi, "").trim()).filter(s => s.length > 4);
                allSents.push(...sents);
            }

            const pick = (regex, maxCount = 2) => {
                const matched = allSents.filter(s => s.length < 150 && regex.test(s));
                return matched.length ? matched.slice(0, maxCount).join("；") + "。" : "";
            };

            res.identity = pick(/(?:变成了|重塑|身份|原本是|继承人|大小姐|千金|少宗主|妓女|暗娼|魅魔|夫人|妻子|母狗|性奴|身处)/, 2) || (personaDesc ? `角色设定：${personaDesc.slice(0, 120)}` : `${u}当前正与 ${c} 处于剧情互动中。`);
            res.bodyDesc = pick(/(?:容颜|肌肤|皮肤|小手|十指|青丝|长发|柳腰|曲线|身段|丰满|白皙|臀|腿|掌印|指痕|咬痕)/, 3) || (charDesc ? charDesc.slice(0, 120) : `${u}拥有极为细腻敏感的娇躯。`);
            res.pose = pick(/(?:撑起|扶着|站起|捂住|喘息|瘫坐|一僵|收拢|颤抖|跪|趴|弯腰|夹紧|退后|张开|躺|探入)/, 2);
            res.mouth = pick(/(?:喉咙|声音|嗓音|红唇|唇瓣|舌|喘|啼鸣|娇呼|吞咽|口水|涎)/, 2);
            res.chest = pick(/(?:胸|乳|丰盈|双峰|蓓蕾|奶|锁骨)/, 2);
            res.vag = pick(/(?:下身|下半身|阴唇|花唇|小穴|骚逼|幽谷|私处|爱液|湿热|淫水|肉缝|甬道)/, 2);
            res.womb = pick(/(?:小腹|下腹|子宫|宫颈|肚子|深处|暖意|抽搐|内射|精液|白浊|坠胀)/, 2);
            res.anal = pick(/(?:臀|屁股|后庭|屁眼|菊|腰臀|S型|掌印)/, 2);

            res.headWear = pick(/(?:青丝|长发|发丝|发簪|发带|刘海|眼罩|眼镜|耳环|耳尖|口球|面纱|头饰|汗水浸湿)/, 2);
            res.neckWear = pick(/(?:项圈|锁骨|雪颈|脖颈|项链|铃铛|锁链|喉咙|衣领|领口|咬痕)/, 2);
            res.braWear = pick(/(?:裹胸|胸罩|文胸|乳夹|肚兜|内衬|真空|乳肉|蓓蕾|乳头|未着寸缕)/, 2);
            res.topWear = pick(/(?:战袍|上衣|T恤|衬衫|外套|长袍|毛衣|束腰|束带|衣襟|下摆|吊带睡裙|未着寸缕)/, 2);
            res.pantyWear = pick(/(?:内裤|底裤|衬裤|丁字裤|开裆|胖次|阴唇|私处|光裸|纸团)/, 2);
            res.bottomWear = pick(/(?:长裙|短裙|裙摆|百褶裙|裤子|短裤|热裤|紧身裤|战袍裙)/, 2);
            res.sockWear = pick(/(?:丝袜|黑丝|白丝|吊带袜|网袜|长袜|大腿|双腿|膝盖|裸腿)/, 2);
            res.shoeWear = pick(/(?:战靴|高跟鞋|皮鞋|拖鞋|凉鞋|鞋子|玉足|脚趾|足|赤足|赤裸的脚趾)/, 2);

            return res;
        }

        // =========================================================================
        // 📖 极尽详尽的 6 阶段解剖级文库（全面扩写生理、神经、括约肌与心理细节）
        // =========================================================================
        function getDynamicMetricDetail(type, v, u, liveCtx) {
            const ovr = v.按钮详情?.[type];
            const diff = getDifficultyProfile();
            const realId = detectRealCharacterIdentity(v);
            const map = {
                cockLove: {
                    val: safeNum(v.核心数值?.对肉棒好感度), rev: false,
                    st: ["抗拒排斥•本能戒备", "工具麻木•形状适应", "食髓知味•含泪渴求", "痴迷崇拜•主动跪舔", "肉棒至上•专属母犬", "第六阶段•终极活体飞机杯"],
                    d: [
                        `【🔬 神经与粘膜对雄性阳具的解剖反应（Lv.1 戒备期）】：${u}在意识层面仍将粗硬滚烫、青筋盘踞的雄性肉棒视为危险的侵犯异物，视觉接触或贴近皮肤时双腿会本能内扣戒备、小腹肌肉绷紧；但娇嫩粘膜在被迫接触时已不可避免地感受到那股霸道的雄性滚烫热度。\n💭【${u}的实时内心感受】：“*呜……光是感受到那根又粗又烫的男人东西散发的腥热气味，我的小肚子就本能地发紧发颤💦，身体深处明明很害怕被撑坏，可粘膜却烫得让人心慌😳！*”`,
                        `【🔬 神经与粘膜对雄性阳具的解剖反应（Lv.2 适应期）】：口腔舌苔、咽喉软肉与阴道层叠肉褶已完全记住阳具粗硬的柱身棱角、冠状沟凸起与搏动频率。哪怕表面神色平静麻木，只要闻到雄性麝香或被龟头抵住穴口，肉壁便会条件反射地软化松弛并分泌润滑液。\n💭【${u}的实时内心感受】：“*嘴唇和下面的花唇一碰到那根滚烫柱身，里面的肉壁就已经自己软下来分泌润滑液了😳💦……身体早就习惯了被男人的东西填满抽插的节奏呢🥵*”`,
                        `【🔬 神经与粘膜对雄性阳具的解剖反应（Lv.3 渴求期）】：矜持外壳已被反复的肉棒撞击彻底粉碎！神经回路对硕大滚烫的阳具产生强烈的生理性饥渴，一旦空虚过久，阴道内壁层叠媚肉便会自发空虚蠕动、分泌拉丝淫水，渴望被粗壮巨物狠狠贯穿到底。\n💭【${u}的实时内心感受】：“*哈啊……骚穴里面又空又痒，用手指根本满足不了这具已经食髓知味的身体了💦，好想念被那根滚烫粗硬的大肉棒狠狠撑开肉壁、一直顶到最深处的充实感呀🥵❤️！*”`,
                        `【🔬 神经与粘膜对雄性阳具的解剖反应（Lv.4 崇拜期）】：彻底沉溺于雄性阳具崇拜！一见到勃起跳动的巨物便会呼吸急促、双膝发软跪倒，主动伸出滚烫香舌从马眼、冠状沟一路痴迷舔舐到囊袋，将腥咸前列腺液视作无上甘露吞咽。\n💭【${u}的实时内心感受】：“*唔嗯、啾噜♡……浓烈的精腥味一冲进鼻腔，我的骚逼就自己喷出一股热流了🥵💦！快让我用舌头把大肉棒舔得干干净净，再赏赐给下面贪吃的小嘴吧❤️❤️！*”`,
                        `【🔬 神经与粘膜对雄性阳具的解剖反应（Lv.5 母犬期）】：重度阳具成瘾的专属母犬！全身上下每一个肉孔的括约肌与内壁褶皱都已彻底改造成贴合大肉棒的形状，离开肉棒填塞超过片刻就会陷入焦躁发狂的戒断反应。\n💭【${u}的实时内心感受】：“*呜汪♡……没有大肉棒塞着就活不下去了！求求主人赏赐大肉棒堵住母狗的嘴和骚逼，把我当成随身携带的泄欲肉套子尽情抽插使用吧❤️❤️！*”`,
                        `【👑 第六阶段·神格级终极活体飞机杯（100% MAX）】：已达成全满贯终极形态！口腔、阴道、子宫颈口与直肠24小时保持恒温痉挛吸吮状态，哪怕在睡梦或昏迷中也会凭借本能自动寻找雄性肉棒套入坐死、疯狂蠕动榨精！\n💭【${u}的实时内心感受】：“*啊嘿、呕咕♡……100%变成大肉棒专属的神格级活体飞机杯了🥵💦！脑子里除了肉棒什么都不剩了，请一辈子焊死在人家的子宫里不要拔出来吧❤️❤️❤️！！*”`
                    ]
                },
                lust: {
                    val: safeNum(v.核心数值?.性欲程度), rev: false,
                    st: ["表面克制•余韵温吞", "春情暗涌•乳尖发硬", "欲火焚身•淫水湿裤", "重度发骚•夹腿磨逼", "狂暴发情•三穴喷水", "第六阶段•永动发情母畜"],
                    d: [
                        `【🔬 体内荷尔蒙与情欲内分泌实况（Lv.1 余韵期）】：表面维持着冷静或事后的温吞倦怠，呼吸渐趋平缓，但刚刚经历过刺激的皮下毛细血管依然微微扩张，胸乳与腿心敏感带对冷空气或衣料刮蹭保持着高度敏锐。\n💭【${u}的实时内心感受】：“*呼……现在身体稍微平静下来一点了，只是胸口和下身还残留着温吞吞的酸胀余温💦，稍微动一下还是能感觉到粘膜湿滑的触感。*”`,
                        `【🔬 体内荷尔蒙与情欲内分泌实况（Lv.2 微燥期）】：小腹深处升起一股难以压抑的燥热暗流，雌性荷尔蒙加速分泌，胸前两颗乳头在布料或空气中充血硬挺，两腿之间的花唇开始泛起黏腻湿润的潮意。\n💭【${u}的实时内心感受】：“*唔……小肚子里面怎么又开始一阵阵发烫了，胸口的两粒尖尖自己在充血发硬，连两条腿中间也开始湿漉漉地发黏了💦！*”`,
                        `【🔬 体内荷尔蒙与情欲内分泌实况（Lv.3 焚身期）】：情欲之火烧遍四肢百骸！呼吸滚烫急促，皮肤泛起桃花色潮红，阴蒂肉珠充血肿大突兀，大量透明拉丝的催情淫水顺着合不拢的花唇溢出，将大腿内侧浸得泥泞不堪。\n💭【${u}的实时内心感受】：“*哈啊……身体烫得像发高烧一样，下面的淫水根本止不住地往外淌，快用粗硬滚烫的东西狠狠捅进来帮我灭火呀🥵💦❤️❤️！*”`,
                        `【🔬 体内荷尔蒙与情欲内分泌实况（Lv.4 发骚期）】：重度发情失控！双腿死死交叠挤压磨蹭着充血外翻的阴唇与肥大阴蒂，全身毛孔散发着浓烈甜腻的雌性催情费洛蒙，眼神迷离拉丝，腰臀本能地画圈摇晃。\n💭【${u}的实时内心感受】：“*唔嗯♡……乳头硬得像石子一样发痛，外翻的阴唇肿得一碰就飙水，满脑子只想着张开腿和男人交配挨肏呀🥵💦❤️❤️！*”`,
                        `【🔬 体内荷尔蒙与情欲内分泌实况（Lv.5 狂暴期）】：狂暴发情期彻底决堤！理智被情欲烧成灰烬，骚穴噗嗤噗嗤向外喷涌滚烫爱液，子宫口饥渴地一开一合，双手不受控制地揉捏乳肉、掰开骚穴哭喊求操。\n💭【${u}的实时内心感受】：“*啊啊♡……发情一秒钟都停不下来了！子宫口饥渴得自己往下脱垂要吃精液了，随便哪个男人快过来把我按在地上狠狠干烂吧🥵💦❤️❤️！*”`,
                        `【👑 第六阶段·神格级永动发情母畜（100% MAX）】：内分泌与自主神经系统已被彻底改写为24小时永不退潮的终极发情熔炉！全身皮肤滚烫泛红，每隔数分钟便会因空气摩擦或自身呼吸而自发潮吹绝顶！\n💭【${u}的实时内心感受】：“*啊嘿、咕啾♡……全身血液都变成滚烫春药了，连呼吸一下都在自己高潮喷水，请让我生生世世活在发情交配的高潮地狱里吧🥵💦❤️❤️❤️！！*”`
                    ]
                },
                corr: {
                    val: safeNum(v.核心数值?.淫乱恶堕), rev: false,
                    st: ["死守矜持•道德防备", "风尘浸染•自我麻痹", "食髓知味•放荡迎合", "下贱娼妇•肉器自觉", "尊严粉碎•公用精盆", "第六阶段•深渊神格肉便器"],
                    d: [
                        `【🔬 道德底线与自我认知解剖（Lv.1 矜持期）】：心底仍保留着作为独立女性的自尊与道德底线，试图在困境或交易中维持基本的体面，抗拒过度下流无底线的羞辱。\n💭【${u}的实时内心感受】：“*虽然身体因为刺激有些发烫发颤，但我绝不能彻底迷失自我💦！*”`,
                        `【🔬 道德底线与自我认知解剖（Lv.2 麻痹期）】：在反复的皮肉交易或肉体快感冲刷下，贞洁观念已被磨灭大半，学会了用麻木顺从来消化屈辱，身体对男人的粗暴摆弄与内射已习以为常。\n💭【${u}的实时内心感受】：“*看着双腿之间还在往外滴着白浊的私处，心里已经不再剧烈抗拒了💦……反正这具身体早就习惯了这种事呢😳❤️*”`,
                        `【🔬 道德底线与自我认知解剖（Lv.3 放荡期）】：廉耻与道德防线被彻底冲垮！在背德交易、粗暴侵犯与被内射灌满的过程中品尝到了灭顶的堕落快感，肉体不仅不再排斥，反而会主动分开双腿、熟练收缩肉壁迎合。\n💭【${u}的实时内心感受】：“*哈啊……每当被粗鲁地按着腰内射灌满、或者看着自己满身红痕和精液的样子，骚穴反而会夹得更紧、流出更多淫水🥵💦！*”`,
                        `【🔬 道德底线与自我认知解剖（Lv.4 娼妇期）】：身心彻底恶堕的风尘尤物！完全接纳并享受自己作为“泄欲娼妇/名器玩物”的身份，以自己丰满胸臀和紧致多汁的肉穴能把男人榨干为荣。\n💭【${u}的实时内心感受】：“*嘻嘻♡……什么清白体面全都是假的，哪有张开双腿给男人当泄欲母狗、被滚烫浓精灌满小肚子来得快活呀🥵💦❤️❤️！*”`,
                        `【🔬 道德底线与自我认知解剖（Lv.5 精盆期）】：人类尊严彻底粉碎！将自己完全定位为无需人权、明码标价甚至免费共享的公用排泄精盆，渴望承受多人轮玩与最下流的改造。\n💭【${u}的实时内心感受】：“*呜汪♡……${u}就是一件只要张开腿就能随便插进来射精撒尿的公用精盆呀，请把我的三穴当成免费厕所尽情使用吧🥵💦❤️❤️！*”`,
                        `【👑 第六阶段·深渊神格级终极肉便器（100% MAX）】：达成全属性大满贯恶堕终点！灵魂与肉体100%完成向“深渊级活体排泄肉便器”的终极蜕变，以承受世间一切最极端淫虐与百人灌精为唯一生存意义！\n💭【${u}的实时内心感受】：“*啊嘿、咕啾♡……恶堕100%圆满达成啦🥵💦！让成百上千根肉棒排队把人家的三穴操到报废、灌成永远合不拢的流精肉壶吧❤️❤️❤️！！*”`
                    ]
                },
                shame: {
                    val: safeNum(v.精神与心理?.羞耻度, 100), rev: true,
                    st: ["羞愤欲死•满面通红", "薄面潮红•咬唇隐忍", "习以为常•羞耻钝化", "不知廉耻•敞腿任看", "羞耻全灭•当众母狗", "第六阶段•失禁露出狂魔"],
                    d: [
                        `【🔬 羞耻神经防线与快感反噬（Lv.1 羞愤期）】：羞耻心极高，赤裸或私处暴露时会满面通红、耳尖滚烫，但剧烈的羞耻感反而引发交感神经高度兴奋，成倍放大粘膜敏感度。\n💭【${u}的实时内心感受】：“*呜哇……脸颊烫得像要滴血一样💦！可为什么越是觉得羞耻难当，下面的肉缝反而越湿啊😳🥵！*”`,
                        `【🔬 羞耻神经防线与快感反噬（Lv.2 隐忍期）】：羞耻防线开始松动，全身赤裸或腿心沾满白浊时遮挡的双手已变得迟疑无力，被视线扫过胸乳与阴阜时身体会泛起酥麻热流。\n💭【${u}的实时内心感受】：“*看着镜子里自己一丝不挂、腿心还滴着白浊的样子，虽然耳根有些发热，但小穴深处居然可耻地自己收缩流汁了😳💦……❤️*”`,
                        `【🔬 羞耻神经防线与快感反噬（Lv.3 钝化期）】：羞耻感已被反复的赤裸接客与肉体暴露磨灭大半，光着身子在屋里走动、用纸巾捂着腿心擦拭精液或掰开穴口清洗残精都已神色平静、习以为常。\n💭【${u}的实时内心感受】：“*光着身子在房间里走来走去、甚至把手指伸进红肿的穴口里抠洗残精，现在的我连眼睛都不会眨一下了💦，赤裸反而让人觉得轻松又暗爽呢……🥵*”`,
                        `【🔬 羞耻神经防线与快感反噬（Lv.4 敞腿期）】：廉耻心荡然无存！不仅不再遮掩红肿外翻的阴唇与满身掌印咬痕，反而在被人撞见或视奸私处时兴奋得阴蒂勃起、淫水狂流。\n💭【${u}的实时内心感受】：“*哈啊♡……就算现在有人突然推门进来看到我满腿白浊、手指还插在骚穴里的下流模样，我也会直接敞开双腿让他看个够哟🥵💦❤️❤️！*”`,
                        `【🔬 羞耻神经防线与快感反噬（Lv.5 暴露期）】：羞耻心濒临归零！彻底将暴露视为最高催情剂，渴望在明亮灯光下或众人围观中大张双腿展示洞开的肉穴与漏精痴态。\n💭【${u}的实时内心感受】：“*啊啊♡……快把门打开，让所有人都来看看这具刚被内射灌满、还在噗嗤噗嗤往外漏精的娼妇身体吧🥵💦❤️❤️！*”`,
                        `【👑 第六阶段·羞耻0%当众失禁露出狂魔（0/100 MAX）】：羞耻心100%彻底归零并逆转为极道露出狂癖！在众目睽睽或镜头特写下当众掰穴潮吹、漏尿失禁即可直接引发脑髓绝顶！\n💭【${u}的实时内心感受】：“*啊嘿、咔嚓♡……在所有人围观指点下当众潮吹漏尿失禁、露出被灌满白浊的子宫口，就是全宇宙最棒的绝顶春药呀🥵💦❤️❤️❤️！！*”`
                    ]
                },
                obey: {
                    val: safeNum(v.精神与心理?.服从度), rev: false,
                    st: ["孤高抗拒•强撑气场", "委曲求全•被动妥协", "温顺听话•熟练配合", "摇尾乞怜•任打任操", "绝对盲从•肉奴母犬", "第六阶段•巴甫洛夫绝对肉奴"],
                    d: [
                        `【🔬 意志防线与肢体服从实况（Lv.1 抗拒期）】：表面仍保有自主意志与防备气场，不愿无条件受人摆布。\n💭【${u}的实时内心感受】：“*紧咬下唇稳住发软的膝盖💦，我绝不能轻易失去自己的主见😳！*”`,
                        `【🔬 意志防线与肢体服从实况（Lv.2 妥协期）】：在生活压力、交易规则或肉体酸软下学会了被动妥协，面对男人的要求会老老实实顺从配合。\n💭【${u}的实时内心感受】：“*人在屋檐下不得不低头……既然干了这一行，乖乖听话配合把客人伺候好才是最省力的做法吧😳💦。*”`,
                        `【🔬 意志防线与肢体服从实况（Lv.3 熟练期）】：已形成肌肉记忆般的温顺配合习惯，不仅在事后熟练地换床单、抠洗宫腔残精以备战下一场接客，面对男人的粗暴折腾也毫无怨言地主动放松身体迎合。\n💭【${u}的实时内心感受】：“*送走一个客人就熟练地换好床单、把最深处的残精洗出来免得耽误今晚王哥和他的朋友……我的身体和神经早就习惯了顺从每一个男人的摆布了💦🥵❤️*”`,
                        `【🔬 意志防线与肢体服从实况（Lv.4 乞怜期）】：彻底被驯服的摇尾母犬！面对男人的粗暴掌掴、掐捏或无套内射不仅毫无反抗，反而会温顺地塌下腰臀、主动掰开肉穴乞求享用。\n💭【${u}的实时内心感受】：“*汪呜♡……男人在我屁股和大腿上留下的掌印和指痕都是调教我的勋章呀，只要一声令下我随时都可以跪下来张开三穴伺候🥵💦❤️❤️！*”`,
                        `【🔬 意志防线与肢体服从实况（Lv.5 盲从期）】：绝对盲从的肉奴家畜！完全丧失拒绝的概念，将服从男人的一切变态玩法（多人轮玩、深喉灌精、体内塞物）视为天职。\n💭【${u}的实时内心感受】：“*哈啊♡……只要客人们高兴，要把我怎么捆起来玩弄、怎么轮流内射灌满都可以，母狗会乖乖把每一滴精液都接住的🥵💦❤️❤️！*”`,
                        `【👑 第六阶段·巴甫洛夫100%绝对肉奴（100% MAX）】：自主意志100%抹除！身体已化作受指令与响指直接支配的巴甫洛夫提线肉偶，一听见男人脚步声或开门声即自动跪趴掰穴失禁迎客！\n💭【${u}的实时内心感受】：“*啊嘿♡……服从度100%焊死在骨髓里了，一听到铁门钥匙响，身体就已经自动四脚朝天掰开骚穴失禁喷尿等待主人们进门开操啦🥵💦❤️❤️❤️！！*”`
                    ]
                },
                pleas: {
                    val: safeNum(v.精神与心理?.快感累积), rev: false,
                    st: ["余韵回落•酸胀微麻", "酥麻窜动•春水溢出", "快感攀升•趾尖蜷缩", "濒临绝顶•痉挛绷紧", "高潮过载•潮吹失神", "第六阶段•脑髓阿片高潮熔断"],
                    d: [
                        `【🔬 神经快感蓄积与高潮余韵（Lv.1 余韵期）】：处于激烈抽插与内射泄身后的余韵回落期，被反复磨过的阴蒂与红肿外翻的阴唇在走动或触碰间仍会传来阵阵微弱却无法忽视的酥麻与酸痛。\n💭【${u}的实时内心感受】：“*呼……激烈抽插过后，红肿外翻的花唇和被磨过的阴蒂在迈步时一蹭一蹭地发酸发麻💦，手指伸进去清理时内壁还在自己收缩呢😳。*”`,
                        `【🔬 神经快感蓄积与高潮余韵（Lv.2 酥麻期）】：酥麻电流顺着尾椎骨与探入甬道的手指窜向小腹，熟稔敏感的阴道内壁层层叠叠地缠绕收缩，不断泌出滑腻爱液。\n💭【${u}的实时内心感受】：“*唔嗯……手指才刚探进湿滑泥泞的甬道里清理残精，熟练的内壁就立刻层层叠叠地缠绕吸吮上来，尾椎骨又开始发麻了😳💦！*”`,
                        `【🔬 神经快感蓄积与高潮余韵（Lv.3 攀升期）】：密集的快感浪潮不断拍打中枢神经，呼吸变得急促滚烫，小腹与阴道括约肌一阵阵律动收缩，十根脚趾本能地紧紧蜷缩。\n💭【${u}的实时内心感受】：“*啊啊……快感一波接一波往脑门上拍，爽得十根脚趾头都麻得死死蜷缩起来了，里面的肉壁越夹越紧了🥵💦！*”`,
                        `【🔬 神经快感蓄积与高潮余韵（Lv.4 临界期）】：快感蓄积至决堤临界点！全身神经紧绷如满弓，子宫颈口与阴道括约肌剧烈痉挛，只需最后一下刺激便会彻底泄身绝顶。\n💭【${u}的实时内心感受】：“*要、要去了！小肚子和骚穴里面全都绷紧到极限了，只要再重重插一下或者冲一下就会当场高潮喷出来的呀🥵💦❤️❤️！*”`,
                        `【🔬 神经快感蓄积与高潮余韵（Lv.5 过载期）】：连续绝顶过载！大脑一片空白，双眼翻白失焦、香舌吐出，滚烫潮吹混杂着白浊从剧烈痉挛的穴口狂喷而出。\n💭【${u}的实时内心感受】：“*啊゛啊——去了去了又去了♡！！骚逼和尿道口像决堤一样狂喷潮吹和白浆，全身骨头都爽得融化成水了🥵💦❤️❤️！*”`,
                        `【👑 第六阶段·100%脑髓阿片高潮彻底熔断（100% MAX）】：过量多巴胺与内啡肽将大脑皮层彻底烧穿成一片极乐白光！全身神经陷入无限连环绝顶死循环，三穴失控狂喷白浆与骚尿！\n💭【${u}的实时内心感受】：“*啊゛嘿゛、咕啾♡——100%脑髓高潮熔断啦！！眼珠子翻到天上去回不来了，请让${u}直接爽死在这场永不停歇的潮吹风暴里吧🥵💦❤️❤️❤️！！*”`
                    ]
                },
                sta: {
                    val: safeNum(v.身体?.体力, 100), rev: true,
                    st: ["精力充沛•气息平稳", "微带倦意•腰腿酸软", "香汗淋漓•双腿打颤", "濒临虚脱•瘫软无力", "极限透支•意识模糊", "第六阶段•体力0%失神肉泥"],
                    d: [
                        `【🔬 肌肉耐受与体力消耗实况（Lv.1 充沛期）】：体力充沛（${safeNum(v.身体?.体力, 100)}/100），气息平稳，四肢尚有充足力气支撑日常行动。\n💭【${u}的实时内心感受】：“*深吸一口气，目前四肢和腰腹力气还算充足，还能撑得住接下来的折腾💦。*”`,
                        `【🔬 肌肉耐受与体力消耗实况（Lv.2 酸软期）】：刚刚承受过力气极大的熟客一番粗暴撞击与内射，背脊与额角贴着细密薄汗，腰腹与大腿内侧肌肉酸软沉重，步履略显拖沓。\n💭【${u}的实时内心感受】：“*哈……刚才那个熟客力气太大了，加上小肚子里灌满了15ml浓精沉甸甸地往下坠，走路时腰和腿都酸软得厉害😳💦……❤️*”`,
                        `【🔬 肌肉耐受与体力消耗实况（Lv.3 打颤期）】：体力消耗过半，发丝被汗水浸湿黏在面颊上，膝盖微微打颤，失去支撑时身体会轻轻摇晃，但仍强撑着收拾床单与清洗身体。\n💭【${u}的实时内心感受】：“*呜……膝盖一直在微微打颤，直起身子的时候都晃了一下，可今晚王哥还要带朋友来，再累也必须赶紧把残精洗干净才行呀🥵💦……❤️*”`,
                        `【🔬 肌肉耐受与体力消耗实况（Lv.4 虚脱期）】：体力濒临枯竭！全身肌肉酸软无力，连站立和并拢双腿的力气都被榨干，只能扶着洗手台或瘫在床单上任人摆布。\n💭【${u}的实时内心感受】：“*哈啊……连站稳和并拢大腿的力气都快被榨干了，要是现在王哥他们冲进来，我连抬手遮挡的力气都没有，只能乖乖任他们摆布了呀🥵💦❤️……*”`,
                        `【🔬 肌肉耐受与体力消耗实况（Lv.5 透支期）】：体力仅存最后一丝游丝！全身肌肉痉挛脱力，眼皮沉重模糊，彻底沦为任由男人翻折抽插的软肉。\n💭【${u}的实时内心感受】：“*唔……眼皮沉重得抬不起来，一根手指头都动不了了，身体只是一具凭着本能抽搐吐精的软肉了🥵💦……❤️*”`,
                        `【👑 第六阶段·体力0%彻底休克失神肉泥（0/100 MAX）】：体力100%耗尽清零！人已陷入半休克昏死失神状态，四肢软如面条，唯有被操开的骚穴与子宫还在自动蠕动吐着白沫！\n💭【${u}的实时内心感受】：“*……（体力0%彻底昏死失神中）随便你们怎么轮流摆弄这具热乎乎的失神肉泥吧，就算晕过去了骚逼也会自动夹紧吸精的🥵💦❤️❤️❤️……*”`
                    ]
                }
            };
            const cfg = map[type] || map.cockLove;
            const t = tier6(cfg.val, cfg.rev);
            if (ovr && (ovr.desc || ovr.thought)) {
                return {
                    val: cfg.val,
                    stage: ovr.stage || cfg.st[t],
                    desc: `【当前数值：${cfg.val}/100 · 第${t + 1}阶段「${ovr.stage || cfg.st[t]}」｜身份：${realId}｜难度：${diff.name}】\n${ovr.desc || cfg.d[t].split("💭")[0]}\n💭【${u}的实时内心感受】：“*${cleanThoughtText(ovr.thought || "……")}*”`
                };
            }
            return {
                val: cfg.val,
                stage: cfg.st[t],
                desc: `【当前数值：${cfg.val}/100 · 第${t + 1}阶段「${cfg.st[t]}」｜身份：${realId}｜难度：${diff.name}】\n${cfg.d[t]}`
            };
        }

        function buildFullFallbackCategories(u, c, v) {
            calibrateMentalMetrics(v);
            const dev = computeAllOrganDevelopments(v);

            const ovr = v.按钮详情 || {};
            const mk = (editKey, defaultRawKey, desc, barTheme = "pleas", subBarCfg = null, hideBar = false, stagePctOverride = null) => {
                const customTitle = ovr[editKey]?.customTitle;
                const customStage = ovr[editKey]?.stage;
                let finalRawKey = customTitle || defaultRawKey;
                if (!customTitle && customStage && /「[^」]+」/.test(finalRawKey)) {
                    finalRawKey = finalRawKey.replace(/「[^」]+」/, `「${customStage}」`);
                }
                return { editKey, rawKey: finalRawKey, desc, ...fmtKey(finalRawKey, barTheme, subBarCfg, hideBar, stagePctOverride) };
            };

            const live = extractDynamicContext(u, c);
            const diff = getDifficultyProfile();
            const realId = detectRealCharacterIdentity(v);
            const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {}, prof = v.档案 || {}, rt = v.实况 || {}, wear = v.穿搭 || {}, preg = v.受孕与生理 || {};

            const cockM = getDynamicMetricDetail("cockLove", v, u, live);
            const lustM = getDynamicMetricDetail("lust", v, u, live);
            const corrM = getDynamicMetricDetail("corr", v, u, live);
            const shameM = getDynamicMetricDetail("shame", v, u, live);
            const obeyM = getDynamicMetricDetail("obey", v, u, live);
            const pleasM = getDynamicMetricDetail("pleas", v, u, live);
            const staM = getDynamicMetricDetail("sta", v, u, live);

            const vagCnt = safeNum(cnt.性交?.小穴), mouthCnt = safeNum(cnt.性交?.口), analCnt = safeNum(cnt.性交?.屁眼), titCnt = safeNum(cnt.性交?.乳穴), footCnt = safeNum(cnt.性交?.足腿), beastCnt = safeNum(cnt.性交?.兽交异种);
            const creampie = safeNum(cnt.射精?.内射), facialCnt = safeNum(cnt.射精?.颜射体外), swallowCnt = safeNum(cnt.精液摄入?.吞精次数), swallowMl = safeNum(cnt.精液摄入?.累计毫升);
            const orgasmCnt = safeNum(cnt.高潮?.总数), forceOrgCnt = safeNum(cnt.高潮?.强制), edgeCnt = safeNum(cnt.高潮?.寸止);
            const leakCnt = safeNum(cnt.失控?.失禁), squirtCnt = safeNum(cnt.失控?.喷潮), ahegaoCnt = safeNum(cnt.失控?.阿嘿颜);
            const hookerCnt = safeNum(cnt.交易?.接客卖身), gangCnt = safeNum(cnt.交易?.轮奸群交), sleepCnt = safeNum(cnt.交易?.睡眠昏迷奸);
            const milkCnt = safeNum(cnt.泌乳?.喷乳次数), milkMl = safeNum(cnt.泌乳?.累计毫升), mastCnt = safeNum(cnt.自慰);

            let mouthMl = safeNum(sp.口内毫升), vagMl = safeNum(sp.小穴毫升), wombMl = safeNum(sp.子宫毫升), analMl = safeNum(sp.屁眼毫升);
            if (wombMl === 0 && creampie > 0 && /内射|灌满|精液.*滴|精液.*渗|白浊/.test(live.womb + live.vag)) {
                wombMl = 15; vagMl = 2;
            }
            const totalMl = mouthMl + vagMl + wombMl + analMl;
            const caps = calcHoleCapacities(v);

            const corr = safeNum(v.核心数值?.淫乱恶堕), lust = safeNum(v.核心数值?.性欲程度), pleas = safeNum(v.精神与心理?.快感累积);
            const vagWidth = (1.5 + Math.min(5.0, (vagCnt / diff.mult) * 0.05)).toFixed(1);
            const vagClose = Math.max(5, Math.round(100 - (vagCnt / diff.mult) * 0.7 - ((wombMl + vagMl) > 0 ? 18 : 0)));
            const clitSize = (4.0 + Math.min(10.0, (orgasmCnt / diff.mult) * 0.08 + pleas * 0.03)).toFixed(1);
            const peeVal = Math.min(100, Math.round(12 + lust * 0.38 + pleas * 0.38 + leakCnt * 7));
            const wetLevel = Math.min(100, Math.round(12 + lust * 0.7 + pleas * 0.6 + ((wombMl + vagMl) > 0 ? 30 : 0)));
            const fallVal = safeNum(v.精神与心理?.沦陷度), brkVal = safeNum(v.精神与心理?.人格崩解度), hypnoVal = safeNum(extPsy.催眠深度);
            const drugVal = safeNum(v.精神与心理?.媚药精液毒瘾);
            const fallMax = Math.max(fallVal, brkVal, hypnoVal), fallTier = tier6(fallMax, false);
            const tallyStrokes = creampie + vagCnt, tallyFull = Math.floor(tallyStrokes / 5);
            const sensMult = (1.0 + corr * 0.08 + pleas * 0.05 + (vagCnt > 0 ? 1.5 : 0)).toFixed(1);

            const mouthDev = dev.mouthObj.val;
            const chestDev = dev.chestObj.val;
            const vagDev   = dev.vagObj.val;
            const wombDev  = dev.wombObj.val;
            const clitDev  = dev.clitObj.val;
            const analDev  = dev.analObj.val;

            const tallyDev = tallyStrokes > 0 ? calcStage6Score(tallyStrokes, 0.85, diff.mult, tallyStrokes >= 150 * diff.mult).val : 0;
            const tattooDev = (mark.淫纹与刻印 && mark.淫纹与刻印 !== "无") ? Math.max(45, corr) : Math.round(corr * 0.8);
            const pierceDev = (mark.穿刺与环饰 && mark.穿刺与环饰 !== "无") ? Math.max(55, corr) : Math.round(corr * 0.6);
            const propDev = (prop.体内道具 && prop.体内道具 !== "无") ? Math.max(50, pleas) : Math.round(corr * 0.5);

            const mouthStg = `${stageNameFromVal(mouthDev)}•${["洁净初唇", "唾液敏化", "深喉适应", "吞精肉壶", "奉仕口器", "食道生殖器化"][tier6(mouthDev)]}`;
            const chestStg = `${stageNameFromVal(chestDev)}•${["娇嫩处乳", "乳尖充血", "揉捏变形", "母畜喷乳", "泌乳奶袋", "终极永动奶牛"][tier6(chestDev)]}`;
            const vagStg   = `${stageNameFromVal(vagDev)}•${["处女一线鲍", "初破微张", "充血外翻", "大开肉壶", "洞开便器", "永久洞开名器"][tier6(vagDev)]}`;
            const wombStg  = `${stageNameFromVal(wombDev)}•${["紧闭处子", "宫口酸软", "锁精苗床", "宫口微张", "宫颈脱垂", "永久受精圣杯"][tier6(wombDev)]}`;
            const clitStg  = `${stageNameFromVal(clitDev)}•${["包皮隐没", "充血勃起", "肥大酸豆", "括约肌松弛", "失禁水龙头", "永动潮吹喷泉"][tier6(clitDev)]}`;
            const analStg  = `${stageNameFromVal(analDev)}•${["紧闭菊蕾", "异物适应", "括约肌软化", "后庭大开", "直肠储精袋", "第二生殖排泄腔"][tier6(analDev)]}`;

            const milkCap = Math.round(100 + milkCnt * 15);
            const curMilkMl = milkCnt > 0 ? Math.min(milkCap, Math.round(25 + lust * 0.8 + pleas * 0.5)) : 0;

            const fertProb = safeNum(preg.受孕概率, wombMl > 0 ? 78 : (creampie > 0 ? 48 : 20));
            const ovulStageVal = Math.min(100, Math.round(15 + lust * 0.4 + (creampie > 0 ? 30 : 0) + (wombMl > 0 ? 35 : 0)));
            const xrayStageVal = (creampie + wombMl) > 0 ? Math.min(100, Math.round(wombDev * 0.7 + (wombMl > 0 ? 30 : 0))) : 10;
            const dnaStageVal  = (creampie + swallowCnt + gangCnt) > 0 ? calcStage6Score(creampie + swallowCnt + gangCnt * 3, 1.1, diff.mult, creampie >= 100 * diff.mult).val : (totalMl > 0 ? 25 : 5);
            const bellySwellPct = Math.min(100, Math.round(safeNum(preg.怀孕进度) + (totalMl / Math.max(100, caps.wombMax)) * 60));
            const pregStageVal = preg.子宫怀孕 ? Math.max(65, safeNum(preg.怀孕进度)) : Math.min(79, Math.round(bellySwellPct + safeNum(preg.生产产卵次数) * 20));

            const ovulStg = `${stageNameFromVal(ovulStageVal)}•${preg.生理周期阶段 || "危险排卵期"}`;
            const xrayStg = `${stageNameFromVal(xrayStageVal)}•${["卵子待受精", "精虫游入", "精虫围攻卵子", "高危着床临界", "受精着床进行", "100%受精苗床"][tier6(xrayStageVal)]}`;
            const dnaStg  = `${stageNameFromVal(dnaStageVal)}•${totalMl > 0 ? `浓精基因标记` : "无外来DNA"}`;
            const pregStg = `${stageNameFromVal(pregStageVal)}•${preg.子宫怀孕 ? "恶堕孕肚着床" : (totalMl > 0 ? "精液撑起坠胀" : "平坦处子小腹")}`;
            const totalCapAll = caps.mouthMax + caps.vagMax + caps.wombMax + caps.analMax;

            const marketRank = corr >= 100 ? "EX神格级·传奇终极肉便器" : corr >= 80 ? "SSS级·特等公用肉便器" : corr >= 50 ? "A级·熟透风俗名器" : hookerCnt > 0 ? "B级·暗娼接客熟肉" : "S级·纯洁无瑕处子禁脔";
            const marketPrice = prof.风月挂牌身价 || (hookerCnt > 0 ? `廉价出租屋单次皮肉资 ${Math.max(100, 500 - corr * 4)} 元（已累计接客 ${hookerCnt} 次，熟客无套内射不加价）` : `无价之宝（若沦落风尘挂牌，初夜拍卖估值极高）`);

            const fmtOvr = (key, defObj, defThought) => {
                if (ovr[key] && (ovr[key].desc || ovr[key].thought)) {
                    return `${ovr[key].desc || defObj}\n💭【${u}的实时内心感受】：“*${cleanThoughtText(ovr[key].thought || defThought)}*”`;
                }
                return `${defObj}\n💭【${u}的实时内心感受】：“*${cleanThoughtText(defThought)}*”`;
            };

            const curThought = cleanThoughtText(ovr.内心独白?.thought || rt.内心独白 || live.thought || (corr >= 60 ? `哈啊……小肚子里被灌满浓精沉甸甸地往下坠，红肿外翻的骚穴走一步路就往外淌白线🥵💦！虽然已经麻木顺从了，可今晚王哥还要带朋友过来，必须赶紧把最深处的残精抠洗出来才行呀❤️！` : `呼……身体深处还残留着难以忽视的酸胀感与湿热感，每一寸皮肤都敏感到极点💦。我必须尽快稳住心神清理干净应付接下来的局面，只是下面那种黏腻空虚的余韵不知道要过多久才能消退……😳`));
            const curPose = rt.当前姿势 || live.pose || `${u}正站在卫生间镜前，双腿微张，手指探入泥泞穴口准备清理残精。`;
            const allClothStr = safeStr(rt.当前衣装 || prop.穿戴中的标记物);

            const pickClothPart = (reg, fallbackStr) => {
                if (!allClothStr) return fallbackStr;
                const parts = allClothStr.split(/[、，；,;]+/).filter(s => reg.test(s));
                return parts.length ? parts.join("、") : fallbackStr;
            };

            const wearStateTag = wetLevel >= 80 ? "🔞赤裸泥泞" : wetLevel >= 50 ? "🔥汗湿走光" : wetLevel >= 25 ? "💦微乱泛潮" : "✨整洁完好";
            const headTxt = ovr.穿搭_头饰?.stage || wear.头饰与眼部 || live.headWear || pickClothPart(/(?:发|簪|冠|耳|眼|镜|面|帽)/, "汗湿发丝黏贴面颊•嘴角干涸涎痕");
            const neckTxt = ovr.穿搭_颈部?.stage || wear.颈部与项圈 || live.neckWear || pickClothPart(/(?:项圈|颈|领|锁骨|链|巾)/, "右侧锁骨殷红咬痕•细密薄汗");
            const braTxt = ovr.穿搭_胸罩?.stage || wear.胸罩与裹胸 || live.braWear || pickClothPart(/(?:裹胸|胸罩|文胸|肚兜|乳|内衬|真空)/, "未着寸缕•胸口起伏直白裸露");
            const topTxt = ovr.穿搭_上衣?.stage || wear.上衣与束腰 || live.topWear || pickClothPart(/(?:袍|衣|衫|T恤|束腰|腰带|甲|服|睡裙)/, "上身全裸•背脊贴满薄汗");
            const pantyTxt = ovr.穿搭_内裤?.stage || wear.内裤与遮挡 || live.pantyWear || pickClothPart(/(?:衬裤|内裤|底裤|丁字裤|开裆|胖次|光裸)/, "下身赤裸•花唇红肿外翻吐白浊");
            const botTxt = ovr.穿搭_下装?.stage || wear.下装与裙裤 || live.bottomWear || pickClothPart(/(?:裙|裤|下摆)/, "臀肉裸露•交错暗红掌印泛青");
            const sockTxt = ovr.穿搭_丝袜?.stage || wear.丝袜与腿部 || live.sockWear || pickClothPart(/(?:袜|丝|腿环|绑腿|裸腿)/, "赤裸双腿•大腿内侧青紫掐痕与白浊拉丝");
            const shoeTxt = ovr.穿搭_鞋子?.stage || wear.鞋子与玉足 || live.shoeWear || pickClothPart(/(?:靴|鞋|拖鞋|履|足)/, "赤足踩地•脚背擦拭污迹•脚趾前滴落浓精");

            const unlockedFetishes = computeUnlockedFetishes(v);
            const fetishItems = unlockedFetishes.length > 0
                ? unlockedFetishes.map(fObj => mk(`fetish_${fObj.name}`, `🧬 ${fObj.name}：${fObj.val}/100「${fObj.stage}」`, buildFetishRichDesc(fObj, v, u), "corr"))
                : [mk("fetish_none", `🔒 暂无性癖（纯洁白纸状态）「总账全0•未解锁」`,
                    `【当前性癖解锁与动态难度实况】：\n当前真实身份：${realId} ｜ 当前调教难度：${diff.fullLabel}。\n当前【淫乱总账本】中的所有性交、高潮、内射、吞精、自慰与露出次数全部为 0，因此尚未开启任何后天淫乱性癖！\n💭【${u}的实时内心感受】：“*呼……摸了摸自己平坦的小腹和紧闭的双腿，还好总账次数全都是 0，我这具身体还保持着白纸一样的纯洁状态，一个下流奇怪的性癖都没有染上呢💦！*”`, "none", null, true, 0)];

            const clientList = extractClientsFromHistory(v, u, c);
            const clientItems = clientList.map((cl, idx) => mk(
                `client_${idx}`,
                `🍆 ${cl.name}：${cl.val}/100「${cl.roleTag}•${cl.statusTag}」`,
                `${cl.detailDesc}\n💭【${u}对该男人的实时内心感受】：“*${cleanThoughtText(cl.thoughtStr)}*”`,
                "cockLove",
                cl.dnaShare > 0 ? { mainName: "🍆 开发贡献", label: "🧬 宫内DNA占比", theme: "semen", pct: cl.dnaShare, text: `${cl.dnaShare}%` } : null
            ));

            const fallThoughts = [
                `虽然身体各处不断传来酸胀发热的信号，但我的大脑依然保持着清醒💦。只要核心意志不松口，就没有人能真正驯服我的灵魂！`,
                `唔……随着肉体被反复开发刺激，大脑深处时不时会涌起一阵让人懒得思考的麻木微醺感😳💦。顺应着肉体的本能把客人应付过去，似乎比挣扎要轻松得多呢……❤️`,
                `哈啊……只要一闻到浓烈的雄性气息或者体会到体内被塞满的触感，脑子就会变得晕乎乎的🥵💦！我的精神已经对男人的支配和肉棒产生依赖了❤️❤️！`,
                `呜汪♡……理智防线已经碎成渣了，只要恩客或主人一个眼神，我的大脑就会停止思考、熟练地分开双腿流下淫水🥵💦！快用更粗暴的手段支配我吧❤️❤️！`,
                `啊嘿♡……人格已经碎裂，常识也被改写成了『精液就是食物、被内射灌满就是最高幸福』的母猪逻辑🥵💦，请尽情享用我吧❤️❤️！`,
                `啊嘿、咕啾♡……100%彻底脑死成爱心眼母猪啦🥵💦！大脑皮层已经被催眠和精液彻底洗白融化了，嘴角24小时挂着痴呆的哈喇子，请把人家的灵魂也一起射满浓精吧❤️❤️❤️！！`
            ];

            const baseCategories = [
                // 1. 档案与风评
                {
                    title: "档案与风评", icon: "👩", summary: `${u} (${realId}) · 敏感${sensMult}x · 难度${diff.name}`,
                    items: [
                        mk("身份与背景", `👩 认知真名与身份：${u}「${realId}•${prop.肉体所有权 || (hookerCnt > 0 ? "恩客共有" : "自由身")}」`,
                            fmtOvr("身份与背景",
                                `【🔬 主角当前认知真名、社会阶层与生存处境深度解剖】：\n` +
                                `• 自我认知真名：${u} ｜ 肉体支配权：${prop.肉体所有权 || (hookerCnt > 0 ? "买春恩客临时支配/暗娼卖身" : "自由身")}\n` +
                                `• 真实身份与体质：${realId}（全身神经末梢敏感度：常人的 ${sensMult} 倍 ｜ 状态栏进阶难度：${diff.fullLabel}）。\n` +
                                `• 当前生存环境与处境实况：${prof.身份与背景 || live.identity || `身处不足十平米的昏暗廉价出租屋内，墙角泛黄壁纸卷曲，空气中弥漫着廉价空气清新剂、劣质烟草与浓重汗水精腥交织的浑浊气味。靠着出卖肉体换取微薄零钞度日，刚送走一名力气极大的熟客，今晚还得迎接隔壁王哥和他的朋友。`}`,
                                corr >= 60 ? `只要一听到别人叫我「${u}」或者用打量廉价泄欲货物的眼神看我，我的骚穴就会条件反射地涌出一股热流🥵💦！在这间连十平米都不到的小出租屋里，我这具敏感度 ${sensMult} 倍的熟肉身体就是专门供男人们发泄兽欲的肉壶呀❤️！` : `深吸一口气感受着这具敏感度高达 ${sensMult} 倍的躯体，我现在在故事里的身份是「${u}」（${realId}）💦。看着镜子里眼神平静如死水的自己，今晚的工作还远远没有结束呢😳……`), "none", null, true, corr),
                        mk("肉体外貌", `🌸 肉体外貌与淫靡体态：「敏感度${sensMult}倍•${stageNameFromVal(corr)}」`,
                            fmtOvr("肉体外貌",
                                `【🔬 全身外貌特征、肤质弹性与情欲体态特写】：\n` +
                                `• 躯体与肌肤实况：${prof.肉体外貌实况 || live.bodyDesc || `未着寸缕的白净皮肤在昏暗吸顶灯下泛着细密薄汗的水光，几缕被汗水浸湿的发丝杂乱黏在面颊旁，嘴角残留着一抹干涸的透明涎痕。这具早已对情事习以为常的熟肉之躯胸乳饱满、腰臀曲线丰腴，迈步间双腿微微发软摇晃。`}\n` +
                                `• 神经敏感倍率：常人的 ${sensMult} 倍 ｜ 体表实时受虐痕迹：${mark.体表痕迹 !== "无" ? mark.体表痕迹 : "臀肉交错几道暗红泛青的掌印、大腿内侧被粗暴掐出指痕、右侧锁骨印着殷红咬痕"}。`,
                                `看着镜子里这具布满暗红掌印、青紫指痕和锁骨咬痕的白净躯体，胸口还在微微起伏，每一寸被男人粗暴揉搓过的皮肤都敏感到极点😳💦……连冰冷的自来水扑在脸上都压不住体内的燥热呢🥵！`), "none", null, true, corr),
                        mk("表里风评", `🎭 表里风评与淫乱称号：「${prof.表里风评与称号 || (corr >= 60 ? "廉价出租屋暗娼•熟客公用精盆" : "表面清白端庄•暗藏靡烂反差")}」`,
                            fmtOvr("表里风评",
                                `【🔬 表面社会形象 vs 暗地里界风评与把柄威胁深度剖析】：\n` +
                                `• 当前里界淫乱称号：【${corr >= 100 ? "神格级深渊肉便器" : corr >= 80 ? "脑髓熔断的百人斩肉便器" : corr >= 50 ? "食髓知味的暗娼名器" : vagCnt > 0 ? "破瓜失守的敏感尤物" : "清冷待采的纯洁禁脔"}】\n` +
                                `• 风评与口碑实况：${prof.表里风评与称号 || (hookerCnt > 0 ? `在周边街区熟客与老嫖客（如隔壁王哥等人）口中，${u}是出了名皮白肉嫩、耐操听话且小穴极度紧致多汁的优质暗娼。不仅能承受粗暴掌掴与深喉，甚至允许熟客无套内射灌满子宫，导致王哥今晚直接带朋友过来一同享用。` : `表面维持着清纯端庄的形象，无人知晓这具娇躯在私下里是何等敏感易湿。`)}\n` +
                                `• 📸 致命把柄与潜在危机：${prof.致命把柄与威胁 !== "无" ? prof.致命把柄与威胁 : (hookerCnt > 0 || vagCnt > 0 ? "长期在出租屋内从事暗娼接客，隔壁王哥甚至手握铁门钥匙可随时推门而入，随时面临被多人轮玩或当场抓现行的风险" : "尚无实质性影像把柄落入他人之手")}`,
                                `在那些熟客和隔壁王哥眼里，我早就不是什么需要尊重的女人，而是一件只要掏出几张揉皱的零钞就能随便进出、随便无套内射的泄欲肉具罢了😳💦……可我这具身体偏偏已经离不开这种堕落的生活了🥵❤️！`), "none", null, true, corr),
                        mk("挂牌身价", `🏷️ 风月挂牌身价与评级：「${marketRank}」`,
                            fmtOvr("挂牌身价",
                                `【🔬 黄油风月挂牌估值、皮肉资标准与性价比解剖】：\n` +
                                `• 综合肉器评级：【${marketRank}】\n` +
                                `• 挂牌身价与收费明细：${marketPrice}。\n` +
                                `• 增值服务损耗：包含全裸奉仕、任由掐捏掌掴留痕、高敏名器自动绞紧吸吮及宫腔无套内射锁精服务，性价比在底层风月场中堪称极品。`,
                                hookerCnt > 0 ? `桌上那几张揉皱的零钞就是我刚才被那个熟客粗暴内射灌满换来的皮肉钱💦……累计已经接待了 ${hookerCnt} 次男人，我已经彻底习惯靠下面这张合不拢的嘴赚钱养活自己了呢😳❤️。` : `我这副身体怎么能用金钱来衡量身价呢💦！可一想到那些男人下流的眼神，腿心还是忍不住发麻啊🥵……`), "none", null, true, corr),
                        mk("内心独白", `💬 实时内心独白（最新心声）：「抓取自当前楼层独白」`,
                            fmtOvr("内心独白",
                                `【⚡ 当前身体核心敏感带、心理防线与当务之急】：\n` +
                                `• 最敏锐发情带：${extPsy.当前敏感点 || "红肿外翻的阴唇、充血肥大的阴蒂、酸胀微张的子宫颈口与残留咬痕的锁骨"}\n` +
                                `• 当前日程与规矩铁律：${v.调教进度?.规矩与日程 || "必须在隔壁王哥带着朋友推门进来之前，将上一名熟客射在子宫最深处的15ml残精彻底抠洗干净，换好干净床单备战今晚的接客"}。`,
                                curThought), "none", null, true, corr),
                        mk("当前姿势", `🧍 当前姿势与体力耐受：${staM.val}/100「${staM.stage}」`,
                            fmtOvr("当前姿势",
                                `【🔬 当前身体姿态、重心平衡、肌肉酸痛与漏精物理实况】：\n` +
                                `• 实时姿态特写：${curPose}\n` +
                                `• 物理动态细节：从床边弯腰捂着腿心脏纸团更换床单，到拖着沉重步子走进昏暗狭窄的卫生间，每迈出一步大腿根部都伴随着黏糊糊的摩擦感与细微的“吧唧”水声；当前正站在黑斑镜前，将两根手指并拢探入自己泥泞不堪、不断吐出白浊的花唇深处。\n` +
                                `${staM.desc.split("💭")[0]}`,
                                corr >= 60 ? `站在卫生间滋滋作响的白炽灯下，两腿发软地敞开着，自己把两根手指插进还在吐白沫的骚穴里抠洗残精🥵💦！要是这时候王哥带着朋友突然开门进来看到我这副姿势，肯定会直接把我按在洗手台上从后面插进来的吧❤️！` : `努力稳住有些打颤的双腿站在镜子前，小肚子里沉甸甸的坠胀感逼得我不得不把手指伸进泥泞的甬道里清理💦，希望能在今晚客人来之前收拾干净……`), "sta")
                    ]
                },
                // 2. 恶堕与脑改
                {
                    title: "恶堕与脑改", icon: "🔥", summary: `好感${cockM.val}% · 性欲${lustM.val}% · 恶堕${corrM.val}% · 羞耻${shameM.val}%`,
                    items: [
                        mk("cockLove", `💗 阳具崇拜与渴求：${cockM.val}/100「${cockM.stage}」`, cockM.desc, "cockLove"),
                        mk("lust", `🔥 强制发情与性欲：${lustM.val}/100「${lustM.stage}」`, lustM.desc, "lust"),
                        mk("corr", `🖤 淫乱恶堕深度：${corrM.val}/100「${corrM.stage}」`, corrM.desc, "corr"),
                        mk("shame", `😳 羞耻崩坏反噬：${shameM.val}/100「${shameM.stage}」`, shameM.desc, "shame"),
                        mk("obey", `🙇 雌畜奴性服从：${obeyM.val}/100「${obeyM.stage}」`, obeyM.desc, "obey"),
                        mk("pleas", `💓 快感过载与阈值：${pleasM.val}/100「${pleasM.stage}」`, pleasM.desc, "pleas"),
                        mk("精神沦陷", `🌀 催眠洗脑与常识改写：${fallMax}/100「沦陷${fallVal}%•崩解${brkVal}%•催眠${hypnoVal}%」`,
                            fmtOvr("精神沦陷",
                                `【🔬 深层精神防线、麻木顺从机制与常识改写实况（第${fallTier + 1}阶段）】：\n` +
                                `• 精神沦陷度：${fallVal}/100 ｜ 人格崩解度：${brkVal}/100 ｜ 意识清醒度：${safeNum(v.精神与心理?.意识清醒度, 100)}/100 ｜ 催眠深度：${hypnoVal}/100。\n` +
                                `• 常识改写与心理异化状态：${prop.常识改写状态 && prop.常识改写状态 !== "无" ? prop.常识改写状态 : (corr >= 60 ? "长期从事暗娼皮肉生涯已令其眼神平静如死水，将『被男人粗暴内射 -> 换床单抠洗残精 -> 迎接下一波客人』内化为天经地义的日常工作流程" : "常识尚属正常")}\n` +
                                `• 条件反射触发源：${v.调教进度?.条件反射触发词 !== "无" ? v.调教进度.条件反射触发词 : "铁门钥匙转动声、男人的粗野笑声、纸钞摩擦声与浓烈精腥味"}。`,
                                fallThoughts[fallTier]), "hypno"),
                        mk("媚药毒瘾", `🧪 媚药淫毒与精液成瘾：${drugVal}/100「${drugVal >= 100 ? "第六阶段•100%精液毒虫" : drugVal >= 60 ? "重度精液毒瘾•断精发狂" : drugVal >= 20 ? "雄性体液依恋•宫腔渴精" : "无外源毒瘾"}」`,
                            fmtOvr("媚药毒瘾",
                                `【🔬 体内媚药残留浓度与雄性精液荷尔蒙成瘾解剖】：\n` +
                                `• 当前毒瘾与精液依赖指数：${drugVal}/100 ｜ 外源药物状态：${v.调教进度?.媚药与发情毒 || "无外源强效化学媚药，但长期高频率的无套内射已令子宫粘膜对雄性前列腺素与高浓度精浆产生生理性吸收依赖"}。\n` +
                                `• 阿嘿颜失神与语言退化度：${safeNum(v.精神与心理?.语言退化阿嘿颜)}/100（累计翻白眼吐舌失神 ${ahegaoCnt} 次，嘴角常残留未擦净的透明涎痕）。`,
                                drugVal >= 50 ? `身体已经彻底染上男人的精液毒瘾了🥵💦！虽然为了今晚王哥的到来不得不把上一个熟客射在子宫里的浓精洗出来，可一感觉到精液流失，小肚子深处就空虚得发慌，恨不得王哥和他的朋友现在就冲进来重新把我灌满呀❤️❤️！` : `虽然没有被灌下奇怪的催情药水，但空气里混合着劣质烟草、汗水和浓重精液的腥膻气味吸进肺里，就已经像春药一样让我浑身发软了😳💦！`), "drug")
                    ]
                },
                // 3. 下流性癖库
                {
                    title: "下流性癖库", icon: "🧬",
                    summary: unlockedFetishes.length > 0 ? `已开启 ${unlockedFetishes.length} 项 (${diff.name}难度)` : `总账全0 · 暂无性癖`,
                    items: fetishItems
                },
                // 4. 六孔与储精
                {
                    title: "六孔与储精", icon: "🌸", summary: `总储精${totalMl}ml · 六孔6阶段复合晋升+专属光谱`,
                    items: [
                        mk("骚口实况", `👄 第一孔【骚口与胃袋】：${mouthDev}/100「${mouthStg}」`,
                            fmtOvr("骚口实况",
                                `【🔬 口腔、香舌与食道深喉开发阶位：${mouthDev}/100（${mouthStg}｜复合开发点 ${dev.mouthObj.curPts} / 下一阶需 ${dev.mouthObj.nextThreshold}｜口交${mouthCnt}次·吞精${swallowCnt}次）】：\n` +
                                `• 💧 胃袋实时储精容量：${mouthMl}ml / 动态上限 ${caps.mouthMax}ml（历史累计吞咽浓精 ${swallowMl}ml）。\n` +
                                `• 👅 唇舌与咽喉微观解剖实况：${rt.骚口实况 || live.mouth || "嘴角尚留有一抹干涸的透明涎痕未及擦拭；双唇因刚刚承受过粗暴亲吻或口交服侍而微微泛红肿胀，舌苔粉嫩湿滑，咽喉深处的呕吐反射已被磨平大半，呼吸间吐出温热潮湿的气息。"}\n` +
                                `• 💦 内部精液残留状态：${mouthMl > 0 ? `此时口腔与胃袋内正翻涌着 ${mouthMl}ml 浓稠白浊，舌根与食道粘膜挂满精斑，每一次呼吸都带着浓烈的雄性麝香！` : `当前口穴与胃袋内暂存精液为 0ml，但嘴角残留的干涸涎痕仍昭示着方才情事的激烈。`}`,
                                mouthMl > 0 ? `呕咕、咕咚……嘴里和胃袋里全都灌满了男人射进来的 ${mouthMl}ml 滚烫浓精，把精液咽进肚子里的时候，下面的骚逼居然跟着一起收缩高潮了呀🥵💦❤️❤️！` : `刚才被折腾得连嘴角流出来的口水干了都没来得及擦掉💦，冷水扑在脸上时舔了舔有些发麻的嘴唇，今晚王哥带朋友来的话，这张嘴肯定又要被一前一后塞满了吧😳🥵……`),
                            "mouth",
                            { mainName: "👄 口穴阶位", label: "🥛 胃袋储精", theme: "semen", pct: Math.round((mouthMl / Math.max(1, caps.mouthMax)) * 100), text: `${mouthMl}/${caps.mouthMax}ml` }
                        ),
                        mk("胸部实况", `🍒 第二孔【丰乳与乳腺】：${chestDev}/100「${chestStg}」`,
                            fmtOvr("胸部实况",
                                `【🔬 丰乳、乳晕与乳腺开发阶位：${chestDev}/100（${chestStg}｜复合开发点 ${dev.chestObj.curPts} / 下一阶需 ${dev.chestObj.nextThreshold}｜乳交${titCnt}次·喷乳${milkCnt}次）】：\n` +
                                `• 🍼 乳腺实时蓄乳容量：${curMilkMl}ml / 满胀容量 ${milkCap}ml（历史累计泌乳 ${milkMl}ml）。\n` +
                                `• 🍒 双峰、乳尖与锁骨微观解剖实况：${rt.胸部实况 || live.chest || "未着寸缕的胸口在卫生间白炽灯下微微起伏，右侧锁骨处印着一小块刚刚被熟客狠狠啃咬留下的殷红咬痕；两团饱满白腻的乳肉沉甸甸地垂挂晃动，顶端两颗乳头因空气冷却与情欲余韵而充血挺立。"}`,
                                milkCnt > 0 ? `唔嗯♡……奶子涨得好酸好麻，只要乳头一被捏住吸吮，白花花的甜母乳就会噗嗤噗嗤地往外直喷🥵💦！快用力吸空人家的奶袋、再用这对喷奶的大乳房夹住肉棒乳交吧❤️❤️！` : `站在镜子前看着自己光裸起伏的胸口和右锁骨上那块显眼的殷红咬痕，冷水一激，胸前两颗充血的乳头立刻又麻又硬地立起来了❤️💦！`),
                            "chest",
                            { mainName: "🍒 淫乳阶位", label: "🍼 乳腺蓄乳", theme: "milk", pct: Math.round((curMilkMl / Math.max(1, milkCap)) * 100), text: `${curMilkMl}/${milkCap}ml` }
                        ),
                        mk("小穴实况", `🌺 第三孔【骚逼阴道腔】：${vagDev}/100「${vagStg}」`,
                            fmtOvr("小穴实况",
                                `【🔬 小穴名器、阴唇与G点肉壁开发阶位：${vagDev}/100（${vagStg}｜复合开发点 ${dev.vagObj.curPts} / 下一阶需 ${dev.vagObj.nextThreshold}｜贯穿${vagCnt}次·自慰${mastCnt}次·内射${creampie}次·孔径${vagWidth}cm·闭合${vagClose}%）】：\n` +
                                `• 💧 阴道实时储精容量：${vagMl}ml / 动态上限 ${caps.vagMax}ml。\n` +
                                `• 🌺 外阴与甬道微观解剖实况：${rt.小穴实况 || live.vag || `由于常年的接客与高强度开发，这处第3阶段【熟稔名器】早已对男人的侵犯形成了本能适应。此刻外阴软肉红肿外翻且烫手，即便并未受到肉棒抽插，充血的花唇依旧微微翕动着，内壁本能地分泌出大量透明淫水与纯白浓精混合在一起。当两根手指并拢探入湿滑泥泞的甬道时，熟练的内壁立刻层层叠叠地缠绕吸吮上来！`}\n` +
                                `• 💦 白浊拉丝与滴落物理实况：${(vagMl + wombMl) > 0 ? `指缝间的粗糙纸团早已吸饱白浊再也兜不住，黏稠拉丝的精液顺着合不拢的肉缝缓缓淌下，在昏黄灯光里拉出晶莹长丝滴落在水泥地与赤裸脚趾前，每走一步都伴随着细微的“吧唧”水声！` : `当前阴道浅腔内暂无大股外溢精液。`}`,
                                (vagMl + wombMl) > 0 ? `呜……骚逼的两片花唇被干得又红又肿合不拢，纸团根本兜不住里面源源不断往下淌的白浊，走一步路就『吧唧』一声顺着大腿根往地板上拉长丝🥵💦！现在把两根手指探进滚烫泥泞的甬道里想要洗出残精，可不争气的肉壁居然自己层层叠叠地缠上来吸住手指，像是在索要更粗的大肉棒一样呀❤️❤️！` : `两腿之间那条被贯穿开发过 ${vagCnt} 次的熟稔名器还火辣辣地发酸微张着，闭合度只剩 ${vagClose}% 了💦……里面空荡荡的好想再被粗硬的肉棒塞满啊🥵❤️！`),
                            "vag",
                            { mainName: "🌺 名器阶位", label: "🥛 穴内储精", theme: "semen", pct: Math.round((vagMl / Math.max(1, caps.vagMax)) * 100), text: `${vagMl}/${caps.vagMax}ml` }
                        ),
                        mk("子宫实况", `🫀 第四孔【子宫颈口与苗床】：${wombDev}/100「${wombStg}」`,
                            fmtOvr("子宫实况",
                                `【🔬 子宫颈口、宫腔内膜与锁精苗床开发阶位：${wombDev}/100（${wombStg}｜复合开发点 ${dev.wombObj.curPts} / 下一阶需 ${dev.wombObj.nextThreshold}｜累计无套内射 ${creampie} 次）】：\n` +
                                `• 💧 宫腔实时储精容量：${wombMl}ml / 动态上限 ${caps.wombMax}ml。\n` +
                                `• 🫀 宫颈口与下腹坠胀微观解剖实况：${rt.子宫实况 || live.womb || `那名力气极大的熟客刚刚将整整 ${wombMl || 15} 毫升的滚烫浓精毫无保留地尽数泵入了她柔软的宫腔深处，将那隐秘的肉壶撑得满满当当，下腹部传来一阵沉甸甸的坠胀感。随着她弯腰扯床单与迈步的动作，微张的宫口再也锁不住过量白浊，一股股热流不断突破花唇阻挡滴落下来。`}\n` +
                                `• 💦 宫腔清理紧迫度：今晚隔壁王哥还要带朋友过来，必须用手指或花洒将最深处宫腔里的残精彻底洗出来，否则今晚的工作根本没法交代！`,
                                wombMl > 0 ? `小肚子好沉、好胀啊💦！那个力气极大的熟客把足足 ${wombMl}ml 滚烫浓精全射进了我的子宫最深处，把里面的肉壶撑得满满当当的，刚才弯腰铺床单的时候又挤出一股热流滴在脚趾前面了🥵！必须赶紧在王哥带朋友进门前把宫腔最深处的残精抠洗出来才行呀❤️❤️！` : `摸着平坦微热的小腹，里面那截已经被顶开内射过 ${creampie} 次的子宫颈口还在泛着酸麻余温💦，今晚不知道又要被灌进多少毫升浓精呢🥵❤️！`),
                            "womb",
                            { mainName: "🫀 宫口阶位", label: "🥛 宫腔锁精", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }
                        ),
                        mk("阴蒂尿道", `💧 第五孔【阴蒂与尿道口】：${clitDev}/100「${clitStg}」`,
                            fmtOvr("阴蒂尿道",
                                `【🔬 阴蒂包皮、敏感肉珠与尿道括约肌开发阶位：${clitDev}/100（${clitStg}｜复合开发点 ${dev.clitObj.curPts} / 下一阶需 ${dev.clitObj.nextThreshold}｜高潮${orgasmCnt}次·失禁${leakCnt}次·阴蒂${clitSize}mm）】：\n` +
                                `• 💦 膀胱尿意与括约肌失控度：${peeVal}/100。\n` +
                                `• ⚡ 阴蒂与尿道口微观解剖实况：${rt.阴蒂尿道实况 || `被熟客反复粗暴磨过的阴蒂肉珠（${clitSize}mm）与红肿外翻的阴唇在迈步走动间相互挤压摩擦，每一步都带来一阵微弱却无法忽视的酥麻与酸痛；下方的尿道口浸在黏腻的白浊与淫水之中，括约肌因刚刚的高潮余韵而显得酸软乏力。`}`,
                                leakCnt + squirtCnt > 0 ? `最上面的阴蒂肉珠已经被磨成了 ${clitSize}mm 的充血小酸豆，刚才光着身子走路去卫生间的时候，两片红肿阴唇每挤压摩擦一下阴蒂都让我腰眼发麻，连尿道口都快要失控喷水了呀🥵💦❤️❤️！` : `被反复磨过的阴蒂和红肿外翻的阴唇在走动间相互挤压，带来一阵阵没法忽视的酥麻和酸痛，手指探入穴口时连尿道口都跟着一阵阵发紧呢😳💦！`),
                            "clit",
                            { mainName: "⚡ 敏化阶位", label: "💦 失禁尿意", theme: "pee", pct: peeVal, text: `尿意 ${peeVal}%` }
                        ),
                        mk("屁眼实况", `🕳️ 第六孔【屁眼直肠腔】：${analDev}/100「${analStg}」`,
                            fmtOvr("屁眼实况",
                                `【🔬 后庭括约肌、臀瓣掌印与直肠腔开发阶位：${analDev}/100（${analStg}｜复合开发点 ${dev.analObj.curPts} / 下一阶需 ${dev.analObj.nextThreshold}｜累计肛交 ${analCnt} 次）】：\n` +
                                `• 💧 直肠实时储精容量：${analMl}ml / 动态上限 ${caps.analMax}ml。\n` +
                                `• 🍑 臀肉掌印与菊蕾微观解剖实况：${rt.屁眼实况 || live.anal || "未着寸缕的饱满白腻臀肉上交错着几道方才被熟客狠狠抽打留下的暗红掌印，掌印边缘甚至微微泛着青紫；深邃臀缝间的粉嫩菊蕾被从前面小穴顺着会阴流淌下来的白浊与淫水浸得湿滑泥泞，随着手指探入前穴的动作而本能地一收一缩。"}\n` +
                                `• 💦 直肠灌精状态：${analMl > 0 ? `直肠腔内正灌着 ${analMl}ml 浓稠白浊，肠壁蠕动吸收着精液水分，带来强烈的排泄坠胀感！` : `当前后庭直肠内精液为 0ml，但今晚王哥带朋友双人登门，后庭极可能面临被同时开发填塞的局面。`}`,
                                analMl > 0 ? `呜哇……连后面排泄用的屁眼和直肠都被当成储精袋灌进了 ${analMl}ml 滚烫浓精，肚子又胀又麻，直肠包裹着白浆蠕动时连屁眼都要高潮了呀🥵💦❤️❤️！` : `屁股蛋上被刚才那个熟客扇出来的几道暗红掌印边缘都泛青了，现在还火辣辣地发烫💦……而且从前面骚穴溢出来的白浊把后面的菊花也弄得湿淋淋的，要是今晚王哥和他的朋友一前一后夹击我可怎么办呀😳🥵！`),
                            "anal",
                            { mainName: "🕳️ 后庭阶位", label: "🥛 直肠储精", theme: "semen", pct: Math.round((analMl / Math.max(1, caps.analMax)) * 100), text: `${analMl}/${caps.analMax}ml` }
                        )
                    ]
                },
                // 5. 肉改与道具
                {
                    title: "肉改与道具", icon: "⛓️", summary: `正字x${tallyFull} · 掌印指痕咬痕 · 穿刺 · 道具`,
                    items: [
                        mk("正字涂鸦", `✍️ 体表虐痕与『正』字记账：${tallyDev}/100「${stageNameFromVal(tallyDev)}•${tallyFull}个正字(${tallyStrokes}划)」`,
                            fmtOvr("正字涂鸦",
                                `【🔬 体表掌印、掐痕、咬痕与『正』字记账微观解剖】：\n` +
                                `• 累计贯穿与内射总笔划：${tallyStrokes} 划（折合在小腹、大腿内侧与臀瓣上可画满 ${tallyFull} 个完整的「正」字零 ${tallyStrokes % 5} 笔）。\n` +
                                `• 实时体表受虐红痕特写：${mark.体表痕迹 !== "无" ? mark.体表痕迹 : "白净皮肤上交错着方才留下的痕迹——饱满臀肉上印着几道边缘微青的暗红巴掌印，大腿内侧嫩肉是被粗暴分开双腿时掐出来的青紫指痕，右侧锁骨处还印着一小块殷红咬痕，脚背上飞溅着一滴刚刚擦掉的浓稠精斑"}（累计受虐鞭痕/掌印 ${safeNum(mark.鞭痕与掌印)} 处）。\n` +
                                `• 公开羞辱涂鸦字迹：${mark.公开涂鸦字迹 || "肌肤表面暂未被马克笔写下公开羞辱字迹，但满身凌虐红痕比文字更直白地昭示着暗娼身份"}。`,
                                `站在卫生间斑驳的镜子前，看着自己白净皮肤上交错的暗红臀部巴掌印、大腿内侧粗暴的掐痕和右锁骨上的红咬痕💦……这每一道痕迹都是刚才被男人粗暴按在床上内射的证据，要是还没消退就被今晚的王哥和他的朋友看见，肯定会被他们更加肆无忌惮地玩弄吧🥵❤️！`), "corr"),
                        mk("淫纹烙印", `🔮 奴隶烙印与发光淫纹阶位：${tattooDev}/100「${stageNameFromVal(tattooDev)}•${mark.淫纹与刻印 !== "无" ? mark.淫纹与刻印 : "肉体本能锁精"}」`,
                            fmtOvr("淫纹烙印",
                                `【🔬 下腹子宫淫纹与肉体本能锁精契约实况】：\n` +
                                `• 当前淫纹状态：${mark.淫纹与刻印 !== "无" ? mark.淫纹与刻印 : "平坦白腻的小腹表面虽未刻下魔法发光淫纹，但内部第3阶段熟稔名器与宫腔早已形成不亚于淫纹的肉体本能反应"}\n` +
                                `• 宫腔热感反馈：当子宫被15ml滚烫浓精灌满撑开时，整个小腹皮肤都会泛起诱人的潮红热度，内壁层层叠叠自动缠绕吸吮任何探入的异物。`,
                                mark.淫纹与刻印 !== "无" ? `小肚子上的淫纹又在发烫发光了🥵💦！每次淫纹一亮起来，子宫深处就像被施了催情魔咒一样拼命收缩要吃精液呀❤️❤️！` : `顺着平坦却沉甸甸坠胀的小腹缓缓往下摸，虽然肚皮上没有画着淫纹，但里面装满滚烫浓精的子宫和会自动缠绕手指的肉壁，早就和刻了淫纹的发情母畜没什么两样了呢😳💦！`), "hypno"),
                        mk("穿刺环饰", `💍 敏感带金属穿刺与环饰：${pierceDev}/100「${stageNameFromVal(pierceDev)}•${mark.穿刺与环饰 !== "无" ? mark.穿刺与环饰 : "红肿充血裸露"}」`,
                            fmtOvr("穿刺环饰",
                                `【🔬 乳头、阴蒂、花唇与舌尖穿刺改造实况】：\n` +
                                `• 当前穿刺环饰：${mark.穿刺与环饰 !== "无" ? mark.穿刺与环饰 : "全身敏感肉珠尚保持天然无穿刺状态，但长期高频率的接客摩擦已令双乳乳尖与花唇顶端的阴蒂常驻充血红肿外露"}\n` +
                                `• 迈步摩擦电击感：即便未戴金属环，红肿外翻的阴唇与充血阴蒂在赤裸迈步时相互挤压摩擦，依然令每一步都伴随着酥麻酸痛的电流。`,
                                mark.穿刺与环饰 !== "无" ? `穿在最敏感嫩肉上的金属环冰凉又沉重，每走一步路都会拽着乳头和阴蒂一晃一晃地过电发麻🥵💦！` : `现在光是光着身子走路，两片红肿外翻的阴唇相互挤压磨蹭着充血的阴蒂就已经让我每走一步都酸麻得腿软了💦，要是再被打上乳环和阴蒂环的话真的会当场失禁的吧😳🥵！`), "clit"),
                        mk("体内道具", `🎛️ 体内填塞物与高潮排泄权限：${propDev}/100「填塞:${prop.体内道具 !== "无" ? prop.体内道具 : `手指探入+17ml浓精`}•权限:${prop.排泄与高潮权限 || "恩客支配"}」`,
                            fmtOvr("体内道具",
                                `【🔬 体内当前异物填塞、束缚状态与排泄高潮控制权】：\n` +
                                `• 当前体内填塞实况：${prop.体内道具 && prop.体内道具 !== "无" ? prop.体内道具 : `宫腔与甬道内正灌满 ${wombMl + vagMl}ml 滚烫浓稠白浊，且${u}正将自己并拢的两根手指缓缓探入湿滑泥泞的甬道深处抠洗残精，层叠内壁正死死缠绕包裹着指节`}\n` +
                                `• 身体束缚与高潮权限：${prop.束缚状态 || "四肢未受器械捆绑，但受暗娼生存铁律支配，必须在下一波嫖客登门前完成体内残精清理"}。`,
                                prop.体内道具 && prop.体内道具 !== "无" ? `救命……身体里面还死死塞着「${prop.体内道具}」，每动一下都在最敏感的肉壁上震动摩擦🥵💦❤️❤️！` : `深吸一口气把两根手指并拢插进还在不断吐白浊的肉唇缝隙里💦……明明是为了把最深处的残精洗出来好应付今晚的王哥，可湿滑泥泞的内壁一缠上手指，身体又本能地想要迎合高潮了呀😳🥵！`), "pleas")
                    ]
                },
                // 6. 从头到脚穿搭
                {
                    title: "从头到脚穿搭", icon: "👗", summary: `8部位全身赤裸/战损特写 · 状态:${wearStateTag}`,
                    items: [
                        mk("穿搭_头饰", `👑 1.【发丝·面容·涎痕】「${wearStateTag}•${headTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_头饰",
                                `【🔬 头部发丝、面容神态与嘴角干涸涎痕特写】：\n` +
                                `• 当前状态：${headTxt}。\n` +
                                `• 镜头细节：细密的薄汗贴在额角，几缕发丝被汗水浸湿，杂乱地黏在白皙面颊旁；嘴角还留有一抹方才激烈情事中溢出的干涸透明涎痕未及擦拭；双手掬起冷水扑在脸上后，看着镜中自己平静如死水却难掩淫靡余韵的脸庞。`,
                                `被汗水打湿的头发乱糟糟地黏在脸颊上，连嘴角干掉的口水印子刚才都没顾上擦💦……掬起一捧冷水扑在脸上，镜子里的这张脸今晚还要继续对别的男人展露顺从呢😳。`), "none", null, true, wetLevel),
                        mk("穿搭_颈部", `⛓️ 2.【雪颈·锁骨·咬痕】「${wearStateTag}•${neckTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_颈部",
                                `【🔬 脖颈、锁骨凹陷与殷红咬痕特写】：\n` +
                                `• 当前状态：${neckTxt}。\n` +
                                `• 镜头细节：修长白净的脖颈与锁骨完全赤裸，右侧锁骨处清晰地印着一小块刚刚被熟客粗暴啃咬留下的殷红咬痕，在卫生间白炽灯下显得格外刺眼直白。`,
                                `右边的锁骨上还印着刚才那个熟客留下的殷红咬痕，稍微一碰就又酸又麻💦……哪怕待会儿套上黑色吊带睡裙，这块显眼的咬痕也根本遮不住呀😳🥵！`), "none", null, true, wetLevel),
                        mk("穿搭_胸罩", `👙 3.【裸胸·乳肉·起伏】「${wearStateTag}•${braTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_胸罩",
                                `【🔬 胸部穿戴、赤裸双峰与乳尖充血特写】：\n` +
                                `• 当前状态：${braTxt}。\n` +
                                `• 镜头细节：全身未着寸缕，毫无遮挡的饱满双乳在接触不良的昏黄白炽灯下随着呼吸微微起伏，白净乳肉与充血乳尖暴露在微凉的空气中。`,
                                `胸前一丝不挂地暴露在卫生间微凉的空气里，随着每一次深呼吸微微起伏，两颗乳头因为冷热交替和手指探入下体的刺激而充血发硬❤️💦！`), "none", null, true, chestDev),
                        mk("穿搭_上衣", `👚 4.【上身·背脊·薄汗】「${wearStateTag}•${topTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_上衣",
                                `【🔬 上身衣着、汗湿背脊与待换睡裙实况】：\n` +
                                `• 当前状态：${topTxt}。\n` +
                                `• 镜头细节：此时全身赤裸，细密的薄汗贴在纤细柔美的背脊与腰线上，在弯腰扯床单与俯身塞床单角时勾勒出惊心动魄的裸体弧度（衣柜里备有一件极薄的黑色吊带睡裙等待清理完毕后换上接客）。`,
                                `后背上贴着一层细密的薄汗，光着身子弯腰换床单的时候连脊椎沟都在反光💦……等把肚子里的残精洗干净，还得去衣柜里翻出那件极薄的黑色吊带睡裙穿上等王哥他们来呢😳。`), "none", null, true, wetLevel),
                        mk("穿搭_内裤", `🩲 5.【腿心·纸团·吐精】「${wearStateTag}•${pantyTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_内裤",
                                `【🔬 私密处遮挡、浸满白浊纸团与外翻花唇特写】：\n` +
                                `• 当前状态：${pantyTxt}（下体泥泞湿润度：${wetLevel}%）。\n` +
                                `• 镜头细节：方才仅用一团粗糙纸巾紧紧捂在湿淋淋的腿心阴户处，纸团很快吸饱水分透出白浊颜色再也兜不住，被丢进堆满废纸的塑料垃圾桶；此刻腿心完全赤裸，外阴软肉红肿外翻得有些烫手，两根手指正抵在不断吐出白浊的肉唇缝隙处探入清理。`,
                                `刚才捂在腿心的那团纸巾早就被17ml浓精和淫水泡透了，丢进垃圾桶后下面完全光溜溜地敞开着🥵💦！外阴肿得烫手，现在只能靠自己的两根手指插进去把最深处的白浊洗出来了❤️！`), "none", null, true, wetLevel),
                        mk("穿搭_下装", `🍑 6.【裸臀·掌印·泛青】「${wearStateTag}•${botTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_下装",
                                `【🔬 下装状态、赤裸蜜桃臀与暗红巴掌印特写】：\n` +
                                `• 当前状态：${botTxt}。\n` +
                                `• 镜头细节：饱满浑圆的臀部毫无遮蔽，白净的臀肉上交错印着几道方才被熟客粗暴抽打留下的暗红掌印，掌印边缘甚至微微泛着青，随着她迈步与弯腰的动作一颤一颤。`,
                                `光溜溜的屁股蛋上还印着好几道边缘泛青的暗红巴掌印，刚才弯腰把新床单塞进床垫下面的时候，后臀火辣辣的痛感和小肚子的坠胀感搅在一起，真让人双腿发软呀💦🥵！`), "none", null, true, wetLevel),
                        mk("穿搭_丝袜", `🧦 7.【裸腿·掐痕·拉丝】「${wearStateTag}•${sockTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_丝袜",
                                `【🔬 双腿状态、大腿内侧粗暴指痕与白浊拉丝滴淌特写】：\n` +
                                `• 当前状态：${sockTxt}。\n` +
                                `• 镜头细节：修长白净的双腿未穿丝袜，膝盖微微打颤，两腿无力地向外微张着；大腿内侧嫩肉上清晰印着被熟客粗暴掐出来的青紫指痕；一缕缕黏稠拉丝的白浊混着淫水顺着大腿内侧缓缓淌下，在昏黄灯光里拉出晶莹长丝，让每迈出一步都伴随着黏糊糊的摩擦感与细微的“吧唧”水声。`,
                                `大腿内侧全是被刚才那个男人粗暴按着双腿时掐出来的青紫指痕💦，而且从合不拢的肉缝里溢出来的浓精顺着大腿根一路往下淌，走一步就『吧唧』响一声，整条腿都黏糊糊的呀🥵❤️！`), "none", null, true, wetLevel),
                        mk("穿搭_鞋子", `👠 8.【赤足·脚背·滴精】「${wearStateTag}•${shoeTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_鞋子",
                                `【🔬 赤裸玉足、脚背飞溅精斑与脚趾前滴落白浊特写】：\n` +
                                `• 当前状态：${shoeTxt}。\n` +
                                `• 镜头细节：双足赤裸踩在暗灰色的水泥地面与卫生间瓷砖上；方才刚用纸巾缓慢擦拭掉脚背上飞溅的一滴浓稠污迹，而在弯腰铺塞新床单四角时，由于幅度过大，下腹一股新的热流再次突破花唇阻挡，“滴答”两声正好落在她赤裸的脚趾前。`,
                                `刚才拿纸巾擦掉了飞溅在脚背上的那滴浓稠精斑，结果弯腰塞床单角的时候，肚子里灌得太满的浓精又突破花唇『滴答』两声掉在了我光裸的脚趾头前面💦，连脚趾头都羞得蜷缩起来了😳🥵！`), "none", null, true, wetLevel)
                    ]
                },
                // 7. 苗床与受孕
                {
                    title: "苗床与受孕", icon: "🤰", summary: `${preg.生理周期阶段 || "危险排卵期"} · 受孕率${fertProb}% · 断面双轨直播`,
                    items: [
                        mk("排卵周期", `🥚 生理周期与危险排卵警报：${ovulStageVal}/100「${ovulStg}」`,
                            fmtOvr("排卵周期",
                                `【🔬 卵巢排卵催情阶位：${ovulStageVal}/100（${ovulStg}）】：\n` +
                                `• 🎯 无套内射单发受孕率：${fertProb}% ｜ 卵子实时状态：${preg.卵子状态 || "饱满熟透的卵子已排出，正停留在输卵管壶腹部等待雄性精虫穿透受精"}。\n` +
                                `• ⚠️ 暗娼高危受孕风险剖析：作为底层暗娼，在危险排卵期承受力气极大的熟客无套内射灌满15ml浓精，若不在精虫彻底穿透卵子透明带前将最深处的残精洗出，极易怀上父不详的风尘孽种！`,
                                `偏偏在最容易怀孕中招的【${preg.生理周期阶段 || "危险排卵期"}】被熟客毫无保留地无套内射了整整15毫升浓精💦！要是现在不赶紧用手指把最深处的残精抠洗出来，今晚再被王哥和他的朋友轮流内射的话，绝对会怀上不知道是谁的野种的吧😳🥵！`),
                            "lust",
                            { mainName: "🥚 排卵阶位", label: "🎯 受孕概率", theme: "pleas", pct: fertProb, text: `中招率 ${fertProb}%` }
                        ),
                        mk("受精断面", `🔬 精虫围攻卵子X光断面：${xrayStageVal}/100「${xrayStg}」`,
                            fmtOvr("受精断面",
                                `【🔬 苗床受精断面阶位：${xrayStageVal}/100（${xrayStg}｜累计内射 ${creampie} 次）】：\n` +
                                `• 💧 宫腔浓精充盈度：${wombMl}ml / 上限 ${caps.wombMax}ml。\n` +
                                `• 🔬 X光微观内视断面实况：${wombMl > 0 ? `软烂微张的宫颈口已被彻底射穿！足足 ${wombMl}ml 滚烫浓稠的高活性精浆正把柔软的宫腔肉壶撑得满满当当；X光断面下可见数以亿计的雄性精虫正顺着宫腔内壁疯狂摆尾游动，将输卵管内那颗毫无防备的熟透卵子团团围住发起冲锋！` : `当前子宫腔内残精已基本排出，但微张的宫口与熟透的卵子仍处于随时可被下一发内射灌满的高危状态。`}`,
                                wombMl > 0 ? `清晰地感觉到肚子里那 ${wombMl}ml 滚烫浓精正在子宫内壁里四处乱窜🥵💦！成千上万条精虫现在肯定已经把我的卵子团团围住往里面钻了，手指刚探进甬道就摸到一手滚烫粘稠的白浆，真的好怕洗不干净直接受精怀孕呀❤️❤️！` : `小肚子深处的子宫苗床空落落地一抽一抽💦，虽然残精洗掉了一些，可今晚王哥和他的朋友一到，这里马上又要被新的滚烫精液彻底灌满了吧……🥵！`),
                            "womb",
                            { mainName: "🔬 断面阶位", label: "🥛 精虫密度", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }
                        ),
                        mk("精液归属", `🧬 宫内精液DNA混杂归属：${dnaStageVal}/100「${dnaStg}」`,
                            fmtOvr("精液归属",
                                `【🔬 基因染透与标记阶位：${dnaStageVal}/100（${dnaStg}）】：\n` +
                                `• 💧 四穴当前总储精：${totalMl}ml（宫腔 ${wombMl}ml / 阴道 ${vagMl}ml / 口胃 ${mouthMl}ml / 直肠 ${analMl}ml）。\n` +
                                `• 🧬 精液DNA归属明细：${totalMl > 0 ? (preg.宫内精液归属 !== "无" ? preg.宫内精液归属 : `当前100%为刚刚离去的【力气极大的熟客】无套泵入的高浓度精液（宫腔15ml + 阴道2ml）；若未彻底洗净便迎接今晚的【隔壁王哥】与【王哥朋友】，宫腔内将形成3名男人的混杂精液池！`) : "当前四穴内暂无外来雄性精液残留"}。`,
                                totalMl > 0 ? `现在肚子里满满当当全是刚才那个熟客射进来的 ${totalMl}ml 滚烫浓精🥵💦，要是不赶紧洗干净，等会儿王哥和他的朋友再射进来，我的子宫就要变成三个男人的精液搅拌池了呀❤️！` : `现在身体里面暂时没有残留男人的精液DNA，但今晚马上又要迎接新的客人了💦！`),
                            "drug",
                            { mainName: "🧬 染透阶位", label: "🥛 四穴总精", theme: "semen", pct: Math.round((totalMl / Math.max(1, totalCapAll)) * 100), text: `合计 ${totalMl}ml` }
                        ),
                        mk("孕肚进度", `🤰 恶堕孕肚与产卵苗床进度：${pregStageVal}/100「${pregStg}」`,
                            fmtOvr("孕肚进度",
                                `【🔬 母体孕育与苗床阶位：${pregStageVal}/100（${pregStg}｜历史产卵 ${safeNum(preg.生产产卵次数)} 次）】：\n` +
                                `• 🤰 小腹坠胀充盈度：${bellySwellPct}%（受孕状态：${preg.子宫怀孕 ? `已着床 ${safeNum(preg.怀孕进度)}%` : `未着床，因宫腔灌满 ${wombMl}ml 浓精而产生沉甸甸的坠胀感`}）。\n` +
                                `• 物理压迫细节：每当弯腰扯床单或俯身塞床单角时，下腹沉甸甸的坠胀感便越发强烈，迫使微张的宫口不断向外溢出白浊热流。`,
                                preg.子宫怀孕 ? `摸着自己已经怀上种的小肚子，就算挺着孕肚也还是想被大肉棒继续粗暴地插进来内射呀🥵💦❤️❤️！` : `刚才被射进子宫里的15ml浓精把平坦的小腹撑得沉甸甸地往下坠💦，弯腰铺床单的时候坠胀感特别明显，手顺着小腹往下摸都能感觉到里面满满当当的热度，简直像已经怀上了一样羞人啊😳🥵！`),
                            "corr",
                            { mainName: "🤰 苗床阶位", label: "🥛 腹围坠胀", theme: "semen", pct: bellySwellPct, text: `坠胀 ${bellySwellPct}%` }
                        )
                    ]
                },
                // 8. 恩客与肉棒（100分毕业新增第9板块）
                {
                    title: "恩客与肉棒", icon: "🍆", summary: `已记录 ${clientItems.length} 名恩客/支配者 · 阳具特征与DNA占比`,
                    items: clientItems
                },
                // 9. 淫乱总账本
                {
                    title: "淫乱总账本", icon: "💎", summary: `破瓜纪念 · 小穴${vagCnt} · 内射${creampie} · 接客${hookerCnt}`,
                    items: [
                        mk("破瓜纪念", `🥀 初夜破瓜耻辱纪念碑：「${vagCnt === 0 ? "🌸处女膜完好无损" : (mark.初夜破瓜纪念 && !mark.初夜破瓜纪念.includes("完好") ? mark.初夜破瓜纪念.slice(0, 18) : `🌺早已破瓜沦落风尘(累计${vagCnt}次)`)}」`,
                            fmtOvr("破瓜纪念",
                                `【🔬 处女膜状态与初夜破瓜黑历史档案】：\n` +
                                `• 当前处女状态：${vagCnt === 0 ? "处女膜完好无损，花唇紧闭，尚未被任何雄性阳具破瓜夺走初夜" : (mark.初夜破瓜纪念 && !mark.初夜破瓜纪念.includes("完好") ? mark.初夜破瓜纪念 : `处女膜早已在过往的粗暴贯穿中彻底撕裂消失，常年的接客生涯已将这处私密幽谷开发为第3阶段熟稔名器（累计承受小穴贯穿 ${vagCnt} 次、无套内射 ${creampie} 次）`)}。`,
                                vagCnt === 0 ? `我的第一次现在还完好无损地保留着呢💦！这层最珍贵的处女膜到底会在什么时候被捅破落红呢……😳🥵！` : `早就记不清处女膜被捅破是什么时候的事了💦，只知道现在的自己已经是一具不知被多少熟客内射过、连清洗残精都形成肌肉记忆的暗娼身体了呢🥵❤️！`), "none", null, true),
                        mk("六孔总账", `💎 六孔性交贯穿总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${titCnt}／足${footCnt}」`,
                            fmtOvr("六孔总账",
                                `【🔬 各孔穴历史开发累计次数（结合 ${diff.name} 难度系数决定全状态栏 1~6 阶段进化）】：\n` +
                                `• 骚逼贯穿：${vagCnt} 次 ｜ 骚口深喉：${mouthCnt} 次 ｜ 屁眼后庭：${analCnt} 次 ｜ 丰乳夹击：${titCnt} 次 ｜ 玉足摩擦：${footCnt} 次 ｜ 异种交合：${beastCnt} 次。\n` +
                                `【📊 当前六孔复合开发点与下一阶晋升门槛】：\n` +
                                `- 🌺 小穴：${dev.vagObj.curPts} 点（当前 ${dev.vagObj.val}/100，下一阶需 ${dev.vagObj.nextThreshold} 点）\n` +
                                `- 🫀 子宫：${dev.wombObj.curPts} 点（当前 ${dev.wombObj.val}/100，下一阶需 ${dev.wombObj.nextThreshold} 点）\n` +
                                `- 👄 骚口：${dev.mouthObj.curPts} 点（当前 ${dev.mouthObj.val}/100，下一阶需 ${dev.mouthObj.nextThreshold} 点）\n` +
                                `- 🍒 丰乳：${dev.chestObj.curPts} 点（当前 ${dev.chestObj.val}/100，下一阶需 ${dev.chestObj.nextThreshold} 点）\n` +
                                `- 💧 阴蒂：${dev.clitObj.curPts} 点（当前 ${dev.clitObj.val}/100，下一阶需 ${dev.clitObj.nextThreshold} 点）\n` +
                                `- 🕳️ 后庭：${dev.analObj.curPts} 点（当前 ${dev.analObj.val}/100，下一阶需 ${dev.analObj.nextThreshold} 点）`,
                                (vagCnt + mouthCnt + analCnt) === 0 ? `目前所有性交次数全都是 0，从嘴唇到小穴还没有被男人的脏东西捅穿过💦！` : `看着小穴贯穿 ${vagCnt} 次、口交 ${mouthCnt} 次这串触目惊心的开发数字，我的身体早就从里到外变成男人的形状了，今晚王哥和他的朋友来过之后，这串数字又要往上涨了吧🥵💦❤️！`), "none", null, true),
                        mk("高潮总账", `💎 高潮泄身与失禁总账：「高潮${orgasmCnt}次／强制${forceOrgCnt}次／寸止${edgeCnt}次／喷潮${squirtCnt}次／失禁${leakCnt}次」`,
                            fmtOvr("高潮总账",
                                `【🔬 高潮绝顶、寸止折磨与排泄失控累计记录】：\n` +
                                `• 累计绝顶高潮：${orgasmCnt} 次（其中违背意志的强制高潮 ${forceOrgCnt} 次，寸止折磨 ${edgeCnt} 次）\n` +
                                `• 潮吹狂喷：${squirtCnt} 次 ｜ 羞耻漏尿失禁：${leakCnt} 次 ｜ 阿嘿颜失神：${ahegaoCnt} 次 ｜ 私下自慰抠穴：${mastCnt} 次。`,
                                orgasmCnt > 0 ? `一看到累计高潮 ${orgasmCnt} 次的记录，阴道括约肌和尿道口就条件反射地发麻抽搐💦，这具敏感度 ${sensMult} 倍的熟肉身体真是越来越容易被男人操到绝顶了呀🥵❤️！` : `虽然目前高潮和失禁计数器还是 0，但敏感度高达 ${sensMult} 倍的身体要是真被人按住弱点欺负，怕不是会当场喷水高潮出来啊😳💦！`), "none", null, true),
                        mk("射精总账", `💎 射精灌注与喷乳总账：「内射${creampie}次／颜射${facialCnt}次／吞精${swallowCnt}次(${swallowMl}ml)／喷乳${milkMl}ml」`,
                            fmtOvr("射精总账",
                                `【🔬 雄性精液灌注、吞咽与母乳分泌累计记录】：\n` +
                                `• 子宫无套内射：${creampie} 次（当前宫腔与阴道仍存留 ${wombMl + vagMl}ml 浓精） ｜ 颜射与体外飞溅（如脚背、床单）：${facialCnt} 次\n` +
                                `• 骚口吞精：${swallowCnt} 次（累计吞咽浓精 ${swallowMl}ml） ｜ 乳腺改造喷乳：${milkCnt} 次（累计泌乳 ${milkMl}ml）。`,
                                (creampie + swallowCnt) === 0 ? `到现在为止身体内部还没有被注入过任何一滴雄性精液，一定要守住最后的防线😳💦！` : `子宫已经被滚烫的浓精内射浇灌了 ${creampie} 次，胃袋也吞下了 ${swallowMl}ml 白浊，床单、纸团和水泥地上到处都滴着从我身体里漏出来的精液，全身上下早就已经被男人的精臭味彻底腌入味了呀🥵💦❤️！`), "none", null, true),
                        mk("露出总账", `💎 卖身接客·轮奸·睡奸总账：「接客${hookerCnt}次／轮奸${gangCnt}次／睡奸${sleepCnt}次／露出${safeNum(cnt.暴露?.露出)}次」`,
                            fmtOvr("露出总账",
                                `【🔬 风月皮肉交易、多人轮奸、无防备睡奸与公开羞辱总账】：\n` +
                                `• 风尘接客卖身：${hookerCnt} 次 ｜ 被熟客外借/带朋友共享：${safeNum(cnt.交易?.被外借共享)} 次\n` +
                                `• 多人轮奸群交：${gangCnt} 次 ｜ 睡眠/昏迷无防备奸：${sleepCnt} 次\n` +
                                `• 当众赤裸露出：${safeNum(cnt.暴露?.露出)} 次（被围观 ${safeNum(cnt.暴露?.被围观人次)} 人次，被拍摄留影 ${safeNum(cnt.暴露?.被拍摄留影)} 次）。`,
                                (safeNum(cnt.暴露?.露出) + hookerCnt + gangCnt + sleepCnt) > 0 ? `看着累计接客卖身 ${hookerCnt} 次的记录，送走一个力气大的熟客、扯掉沾满体液的碎花床单、再去卫生间把子宫里的残精抠出来迎接今晚的王哥和他的朋友……现在的我已经被彻底锤炼成一件合格的暗娼泄欲商品了呢🥵💦❤️！` : `一想到当众露出、被人围观拍照甚至像妓女一样接客轮奸的字眼，全身皮肤都会起一层鸡皮疙瘩，心脏跳得好快啊😳💦！`), "none", null, true)
                    ]
                }
            ];

            const customMap = v.自定义条目 || {};
            baseCategories.forEach(cat => {
                const customList = Array.isArray(customMap[cat.title]) ? customMap[cat.title] : [];
                customList.forEach(cItem => {
                    if (!cItem || !cItem.id) return;
                    const rk = `${cItem.title || "✨ 自定义状态"}${cItem.ratio ? `：${cItem.ratio}` : ""}${cItem.stage ? `「${cItem.stage}」` : ""}`;
                    const fullDesc = `${cItem.desc || "暂无详细描述"}\n💭【${u}的实时内心感受】：“*${cleanThoughtText(cItem.thought || "……")}*”`;
                    cat.items.push({
                        editKey: cItem.id,
                        isCustom: true,
                        catTitle: cat.title,
                        rawKey: rk,
                        desc: fullDesc,
                        ...fmtKey(rk, "pleas")
                    });
                });
            });

            return baseCategories;
        }

        function getFallbackData() {
            const ctx = safeCtx();
            const trueProtagName = detectProtagonistName(curVars);
            const c = ctx?.name2 || "无角色卡";
            return {
                charName: trueProtagName,
                floorId: checkCardAvailable(true) ? `${c} · 实时` : "未选择角色卡",
                categories: buildFullFallbackCategories(trueProtagName, c, curVars)
            };
        }

        function applyThemeAndSize() {
            const root = document.getElementById("st-v5-root");
            if (root) root.style.display = userSettings.enabled ? "block" : "none";
            const panel = document.getElementById("st-v5-panel");
            const headerBar = document.getElementById("st-v5-header");
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
            if (panel) {
                panel.className = tc.cls || "st-theme-succubus";
                panel.style.background = tc.bg;
                panel.style.border = tc.border;
                panel.style.borderRadius = tc.radius;
                panel.style.boxShadow = tc.shadow;
                panel.style.color = tc.text;
                panel.style.width = `${Math.min(window.innerWidth - 12, userSettings.width)}px`;
                panel.style.height = `${Math.min(window.innerHeight - 75, userSettings.height)}px`;
                panel.style.fontSize = `${Math.round(13.5 * (userSettings.fontScale / 100))}px`;
            }
            if (headerBar && tc.headerBg) {
                headerBar.style.background = tc.headerBg;
            }
            const tb = document.getElementById("st-v5-toggle");
            if (tb) {
                tb.style.background = `linear-gradient(135deg, ${tc.prim}, ${tc.sec})`;
                tb.style.boxShadow = `0 6px 20px ${tc.hi}`;
            }
        }

        async function callSubApiRaw(systemPrompt, userPrompt) {
            const { chatUrl } = getNormalizedEndpoints(userSettings.apiUrl);
            if (!chatUrl || !userSettings.apiKey) {
                throw new Error("请先在 ⚙️设置 中填写副 API 地址和 Key！");
            }
            const res = await fetch(chatUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userSettings.apiKey}` },
                body: JSON.stringify({
                    model: userSettings.apiModel || "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.35, stream: false
                })
            });
            const resText = await res.text();
            if (resText.trim().startsWith("data:")) {
                let reply = "";
                for (const line of resText.split("\n")) {
                    const t = line.replace(/^data:\s*/, "").trim();
                    if (!t || t === "[DONE]") continue;
                    try { const ck = JSON.parse(t); reply += ck?.choices?.[0]?.delta?.content || ck?.choices?.[0]?.message?.content || ""; } catch (e) {}
                }
                if (reply) return { reply, source: "副API" };
            } else {
                const data = JSON.parse(resText);
                if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
                const reply = data?.choices?.[0]?.message?.content || "";
                if (reply) return { reply, source: "副API" };
            }
            throw new Error("副API返回内容为空");
        }

        async function requestSingleItemAiGen(itemTitle, userHint, btnEl) {
            const ctx = safeCtx();
            const u = detectProtagonistName(curVars);
            const realId = detectRealCharacterIdentity(curVars);
            const recentMes = safeStr((ctx?.chat || []).slice(-2).map(m => m?.mes || "").join("\n")).slice(-1800);

            const sysPrompt = "你是一个纯粹的 JSON 生成器，必须且只能输出一个标准 JSON 对象！字符串内部严禁出现英文双引号或换行符！";
            const userPrompt = `请根据当前剧情上下文与用户的【自定义补充要求】，为主角【${u}（真实身份：${realId}）】的状态栏按钮【${itemTitle}】编写一段极度色情重口、直白下流的微观解剖/状态描述（120~180字），以及一段自然连贯、字数适中（100~150字，融合成一整段带❤️💦🥵表情）的第一人称实时内心独白！

【用户自定义修改/扩写要求】：${userHint || "结合当前最新剧情与角色处境进行色情重口扩写"}
【最近剧情参考】：
${recentMes || "无"}

直接输出如下结构的纯 JSON 对象（以 { 开头，以 } 结尾）：
{
  "title": "${safeStr(itemTitle).replace(/"/g, "")}",
  "stage": "4至6字状态概括",
  "ratio": "50/100",
  "desc": "【🔬 生理与状态实况】：120~180字极度直白下流的详细描写...",
  "thought": "100~150字自然连贯的第一人称带❤️💦🥵内心独白..."
}`;

            const oldTxt = btnEl ? btnEl.textContent : "";
            if (btnEl) { btnEl.textContent = "⏳ AI生成中..."; btnEl.disabled = true; }
            try {
                const { reply } = await callSubApiRaw(sysPrompt, userPrompt);
                const parsed = repairAndParseJson(reply);
                if (parsed && (parsed.desc || parsed.thought)) {
                    showToast("✨ 副API 已根据你的输入自动生成描述与心声！", "success", 2800);
                    return parsed;
                }
                throw new Error("返回格式未能解析为JSON");
            } catch (err) {
                showToast("❌ AI 生成失败：" + (err.message || "请在⚙️设置中配置副API"), "error", 3800);
                return null;
            } finally {
                if (btnEl) { btnEl.textContent = oldTxt || "✨ AI根据输入自动生成"; btnEl.disabled = false; }
            }
        }

        function buildFullJsonApiPrompt(u, c, rawText) {
            const diff = getDifficultyProfile();
            const realId = detectRealCharacterIdentity(curVars);

            return `[SYSTEM OVERRIDE: 你现在是一个纯粹的 JSON 数据生成器，必须且只能输出一个标准 JSON 对象！字符串内部严禁出现英文双引号 " 或换行符！]

请根据下方【角色状态】与【最新故事正文】，更新主角【${u}（${realId}，难度${diff.mult}x）】的数值、计数与核心实况按钮。
⚠️ 省流与质量铁律：
1. 只需生成下方列出的核心动态按钮！每个按钮的 "desc" 写 120~160 字极度直白露骨的解剖/状态实况，"thought" 写 100~140 字自然连贯的第一人称带❤️💦🥵内心独白。
2. 严禁在 JSON 字符串值内部使用英文双引号，如需引用请用「」或『』。

【当前统计参考】：小穴${safeNum(curVars.计数?.性交?.小穴)}次, 口${safeNum(curVars.计数?.性交?.口)}次, 屁眼${safeNum(curVars.计数?.性交?.屁眼)}次, 内射${safeNum(curVars.计数?.射精?.内射)}次, 高潮${safeNum(curVars.计数?.高潮?.总数)}次, 接客${safeNum(curVars.计数?.交易?.接客卖身)}次
【最新故事楼层正文】：
${safeStr(rawText).slice(-2800)}

直接输出如下结构的纯 JSON 对象（以 { 开头，以 } 结尾）：
{
  "当前认知名字": "${u}",
  "种族与体质": "${realId}",
  "生理周期阶段": "危险排卵期",
  "受孕概率": 35,
  "体力": 75,
  "对肉棒好感度": ${safeNum(curVars.核心数值?.对肉棒好感度)},
  "性欲程度": ${safeNum(curVars.核心数值?.性欲程度)},
  "淫乱恶堕": ${safeNum(curVars.核心数值?.淫乱恶堕)},
  "羞耻度": ${safeNum(curVars.精神与心理?.羞耻度, 100)},
  "服从度": ${safeNum(curVars.精神与心理?.服从度)},
  "沦陷度": ${safeNum(curVars.精神与心理?.沦陷度)},
  "快感累积": ${safeNum(curVars.精神与心理?.快感累积)},
  "口内毫升": ${safeNum(curVars.体内精液存量?.口内毫升)},
  "小穴毫升": ${safeNum(curVars.体内精液存量?.小穴毫升)},
  "子宫毫升": ${safeNum(curVars.体内精液存量?.子宫毫升)},
  "屁眼毫升": ${safeNum(curVars.体内精液存量?.屁眼毫升)},
  "计数": { "口": ${safeNum(curVars.计数?.性交?.口)}, "小穴": ${safeNum(curVars.计数?.性交?.小穴)}, "屁眼": ${safeNum(curVars.计数?.性交?.屁眼)}, "乳穴": ${safeNum(curVars.计数?.性交?.乳穴)}, "足腿": ${safeNum(curVars.计数?.性交?.足腿)}, "高潮": ${safeNum(curVars.计数?.高潮?.总数)}, "强制高潮": ${safeNum(curVars.计数?.高潮?.强制)}, "寸止": ${safeNum(curVars.计数?.高潮?.寸止)}, "内射": ${safeNum(curVars.计数?.射精?.内射)}, "颜射": ${safeNum(curVars.计数?.射精?.颜射体外)}, "吞精次数": ${safeNum(curVars.计数?.精液摄入?.吞精次数)}, "吞精毫升": ${safeNum(curVars.计数?.精液摄入?.累计毫升)}, "喷乳次数": ${safeNum(curVars.计数?.泌乳?.喷乳次数)}, "喷乳毫升": ${safeNum(curVars.计数?.泌乳?.累计毫升)}, "自慰": ${safeNum(curVars.计数?.自慰)}, "失禁": ${safeNum(curVars.计数?.失控?.失禁)}, "喷潮": ${safeNum(curVars.计数?.失控?.喷潮)}, "露出": ${safeNum(curVars.计数?.暴露?.露出)}, "接客": ${safeNum(curVars.计数?.交易?.接客卖身)}, "轮奸": ${safeNum(curVars.计数?.交易?.轮奸群交)}, "睡奸": ${safeNum(curVars.计数?.交易?.睡眠昏迷奸)} },
  "当前姿势": "一句话概括当前姿势",
  "体表痕迹": "当前体表红痕与精斑",
  "按钮详情": {
    "内心独白": { "thought": "130~160字主角当下最核心的单段连贯第一人称心理独白" },
    "当前姿势": { "desc": "当前肢体动作、身体曲线与走动漏精细节详写(120字以上)", "thought": "100~130字单段自然第一人称心声" },
    "骚口实况": { "desc": "唇瓣微肿、香舌、咽喉深喉记忆与口胃储精解剖描写(120字以上)", "thought": "100~130字单段自然第一人称心声" },
    "胸部实况": { "desc": "双乳罩杯、乳肉微颤、乳头充血硬挺与乳腺解剖描写(120字以上)", "thought": "100~130字单段自然第一人称心声" },
    "小穴实况": { "desc": "阴唇红肿外翻、闭合不全、阴道内壁泥泞与白浊拉丝解剖描写(120字以上)", "thought": "100~130字单段自然第一人称心声" },
    "子宫实况": { "desc": "子宫颈口软烂微张、宫口脱垂与宫腔储精坠胀描写(120字以上)", "thought": "100~130字单段自然第一人称心声" },
    "阴蒂尿道": { "desc": "阴蒂充血凸起、尿道括约肌与排尿冲精描写(120字以上)", "thought": "100~130字单段自然第一人称心声" },
    "屁眼实况": { "desc": "丰腴臀瓣掌印、臀缝肛门微红与直肠储精描写(120字以上)", "thought": "100~130字单段自然第一人称心声" },
    "受精断面": { "desc": "子宫X光断面下精虫围攻卵子或空虚待受精实况详写(120字以上)", "thought": "100~130字单段自然第一人称心声" }
  }
}`;
        }

        function repairAndParseJson(rawText) {
            if (!rawText) return null;
            let s = safeStr(rawText)
                .replace(/<think[\s\S]*?<\/think>/gi, "")
                .replace(/<think_nya>[\s\S]*?<\/think_nya>/gi, "")
                .replace(/```json|```/gi, "")
                .trim();

            const firstBrace = s.indexOf("{");
            const lastBrace = s.lastIndexOf("}");
            if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
            let jsonCand = s.slice(firstBrace, lastBrace + 1);

            try { return JSON.parse(jsonCand); } catch (e1) {}

            let fixed = jsonCand.replace(/,\s*([}\]])/g, "$1").replace(/\r?\n/g, " ");
            try { return JSON.parse(fixed); } catch (e2) {}

            try {
                let out = "", inStr = false;
                for (let i = 0; i < fixed.length; i++) {
                    const ch = fixed[i];
                    if (ch === "\\" && i + 1 < fixed.length) {
                        out += ch + fixed[i + 1];
                        i++;
                        continue;
                    }
                    if (ch === '"') {
                        if (!inStr) {
                            inStr = true;
                            out += ch;
                        } else {
                            const rest = fixed.slice(i + 1).trimStart();
                            if (/^[:,\}\]]/.test(rest)) {
                                inStr = false;
                                out += ch;
                            } else {
                                out += "”";
                            }
                        }
                    } else {
                        out += ch;
                    }
                }
                return JSON.parse(out);
            } catch (e3) {
                console.warn("[状态栏1.0 JSON Repair Failed]:", e3);
                return null;
            }
        }

        function applyApiFullResponse(replyText, targetMsg, fid, sourceLabel = "副API") {
            if (!replyText) return false;
            const data = repairAndParseJson(replyText);
            if (data && typeof data === "object") {
                const v = curVars;
                if (data.当前认知名字 && safeStr(data.当前认知名字).trim()) v.档案.当前认知名字 = safeStr(data.当前认知名字).trim();
                if (data.种族与体质 && safeStr(data.种族与体质).trim()) v.档案.种族与体质 = safeStr(data.种族与体质).trim();
                if (data.表里风评与称号) v.档案.表里风评与称号 = safeStr(data.表里风评与称号);
                if (data.致命把柄与威胁) v.档案.致命把柄与威胁 = safeStr(data.致命把柄与威胁);
                if (data.风月挂牌身价) v.档案.风月挂牌身价 = safeStr(data.风月挂牌身价);
                if (data.生理周期阶段) v.受孕与生理.生理周期阶段 = safeStr(data.生理周期阶段);
                if (typeof data.受孕概率 === "number") v.受孕与生理.受孕概率 = data.受孕概率;
                if (data.宫内精液归属) v.受孕与生理.宫内精液归属 = safeStr(data.宫内精液归属);
                if (data.初夜破瓜纪念) v.痕迹与标记.初夜破瓜纪念 = safeStr(data.初夜破瓜纪念);
                if (typeof data.催眠深度 === "number") v.精神与心理扩展.催眠深度 = data.催眠深度;
                if (data.常识改写状态) v.体内道具与权限.常识改写状态 = safeStr(data.常识改写状态);

                if (data.计数 && typeof data.计数 === "object") {
                    const c = data.计数;
                    if (typeof c.口 === "number") v.计数.性交.口 = c.口;
                    if (typeof c.小穴 === "number") v.计数.性交.小穴 = c.小穴;
                    if (typeof c.屁眼 === "number") v.计数.性交.屁眼 = c.屁眼;
                    if (typeof c.乳穴 === "number") v.计数.性交.乳穴 = c.乳穴;
                    if (typeof c.足腿 === "number") v.计数.性交.足腿 = c.足腿;
                    if (typeof c.高潮 === "number") v.计数.高潮.总数 = c.高潮;
                    if (typeof c.强制高潮 === "number") v.计数.高潮.强制 = c.强制高潮;
                    if (typeof c.寸止 === "number") v.计数.高潮.寸止 = c.寸止;
                    if (typeof c.内射 === "number") v.计数.射精.内射 = c.内射;
                    if (typeof c.颜射 === "number") v.计数.射精.颜射体外 = c.颜射;
                    if (typeof c.吞精次数 === "number") v.计数.精液摄入.吞精次数 = c.吞精次数;
                    if (typeof c.吞精毫升 === "number") v.计数.精液摄入.累计毫升 = c.吞精毫升;
                    if (typeof c.喷乳次数 === "number") v.计数.泌乳.喷乳次数 = c.喷乳次数;
                    if (typeof c.喷乳毫升 === "number") v.计数.泌乳.累计毫升 = c.喷乳毫升;
                    if (typeof c.自慰 === "number") v.计数.自慰 = c.自慰;
                    if (typeof c.失禁 === "number") v.计数.失控.失禁 = c.失禁;
                    if (typeof c.喷潮 === "number") v.计数.失控.喷潮 = c.喷潮;
                    if (typeof c.露出 === "number") v.计数.暴露.露出 = c.露出;
                    if (typeof c.接客 === "number") v.计数.交易.接客卖身 = c.接客;
                    if (typeof c.轮奸 === "number") v.计数.交易.轮奸群交 = c.轮奸;
                    if (typeof c.睡奸 === "number") v.计数.交易.睡眠昏迷奸 = c.睡奸;
                }

                if (typeof data.体力 === "number") v.身体.体力 = data.体力;
                if (typeof data.对肉棒好感度 === "number") v.核心数值.对肉棒好感度 = data.对肉棒好感度;
                if (typeof data.性欲程度 === "number") v.核心数值.性欲程度 = data.性欲程度;
                if (typeof data.淫乱恶堕 === "number") v.核心数值.淫乱恶堕 = data.淫乱恶堕;
                if (typeof data.羞耻度 === "number") v.精神与心理.羞耻度 = data.羞耻度;
                if (typeof data.服从度 === "number") v.精神与心理.服从度 = data.服从度;
                if (typeof data.沦陷度 === "number") v.精神与心理.沦陷度 = data.沦陷度;
                if (typeof data.快感累积 === "number") v.精神与心理.快感累积 = data.快感累积;
                if (typeof data.意识清醒度 === "number") v.精神与心理.意识清醒度 = data.意识清醒度;
                if (typeof data.人格崩解度 === "number") v.精神与心理.人格崩解度 = data.人格崩解度;

                calibrateMentalMetrics(v);

                if (typeof data.口内毫升 === "number") v.体内精液存量.口内毫升 = data.口内毫升;
                if (typeof data.小穴毫升 === "number") v.体内精液存量.小穴毫升 = data.小穴毫升;
                if (typeof data.子宫毫升 === "number") v.体内精液存量.子宫毫升 = data.子宫毫升;
                if (typeof data.屁眼毫升 === "number") v.体内精液存量.屁眼毫升 = data.屁眼毫升;

                if (data.当前姿势) v.实况.当前姿势 = safeStr(data.当前姿势);
                if (data.体表痕迹) v.痕迹与标记.体表痕迹 = safeStr(data.体表痕迹);
                if (data.公开涂鸦字迹) v.痕迹与标记.公开涂鸦字迹 = safeStr(data.公开涂鸦字迹);
                if (data.穿刺与环饰) v.痕迹与标记.穿刺与环饰 = safeStr(data.穿刺与环饰);
                if (data.体内道具) v.体内道具与权限.体内道具 = safeStr(data.体内道具);
                if (data.当前敏感点) v.精神与心理扩展.当前敏感点 = safeStr(data.当前敏感点);
                if (data.规矩与日程) v.调教进度.规矩与日程 = safeStr(data.规矩与日程);

                if (data.按钮详情 && typeof data.按钮详情 === "object") {
                    Object.keys(data.按钮详情).forEach(k => {
                        const prev = v.按钮详情?.[k] || {};
                        v.按钮详情[k] = {
                            ...data.按钮详情[k],
                            ...(prev.customTitle ? { customTitle: prev.customTitle } : {}),
                            ...(prev.imgUrl ? { imgUrl: prev.imgUrl } : {})
                        };
                    });
                }

                saveChatCache(v);
                latestStatus = getFallbackData();
                renderBody();
                showToast(`✅ ${sourceLabel}全量重绘成功！主角【${latestStatus.charName}】全部9大板块已刷新！`, "success", 4000);
                return true;
            }
            return false;
        }

        async function triggerSubApiUpdate(btnEl = null) {
            if (!checkCardAvailable(false)) return;
            const ctx = safeCtx(), chat = ctx?.chat || [];
            const fid = chat.length - 1, targetMsg = chat[fid], rawText = safeStr(targetMsg?.mes);
            const u = detectProtagonistName(curVars), c = ctx?.name2 || "角色";
            const oldTxt = btnEl ? btnEl.textContent : "";
            if (btnEl) btnEl.textContent = "⏳ 副API重绘中...";
            showToast(`⏳ 正在通过副 API 为【${u}】全量重绘9大模块...`, "info", 5000);
            try {
                const sysPrompt = "你是一个只输出标准 JSON 对象的色情重口状态栏实时重绘引擎。严禁输出任何 markdown 标记或多余解释，字符串内部严禁使用未转义的英文双引号。";
                const userPrompt = buildFullJsonApiPrompt(u, c, rawText);
                const { reply, source } = await callSubApiRaw(sysPrompt, userPrompt);
                const ok = applyApiFullResponse(reply, targetMsg, fid, source);
                if (btnEl) btnEl.textContent = ok ? "✅ 副API重绘成功" : "⚠️ 格式已自动修复";
            } catch (err) {
                console.error(err);
                if (btnEl) btnEl.textContent = "❌ 失败";
                showToast("❌ 副API重绘失败：" + (err.message || "请检查副API设置"), "error", 4500);
            }
            if (btnEl && oldTxt) setTimeout(() => { btnEl.textContent = oldTxt; }, 2500);
        }

        function getNormalizedEndpoints(rawUrl) {
            let u = safeStr(rawUrl).trim().replace(/\/+$/, "");
            if (!u) return { chatUrl: "", modelsUrl: "" };
            let base = u.replace(/\/chat\/completions$/i, "").replace(/\/models$/i, "").replace(/\/+$/, "");
            if (!/\/v\d+(?:beta)?$/i.test(base) && !base.includes("/v1")) base += "/v1";
            return {
                chatUrl: u.toLowerCase().endsWith("/chat/completions") ? u : `${base}/chat/completions`,
                modelsUrl: `${base}/models`
            };
        }

        async function fetchModelList(btnEl, selectEl, inputEl) {
            const rawUrl = inputEl ? inputEl.value.trim() : userSettings.apiUrl;
            const apiKey = document.getElementById("st-api-key")?.value.trim() || userSettings.apiKey;
            const { modelsUrl } = getNormalizedEndpoints(rawUrl);
            if (!modelsUrl) { showToast("⚠️ 请先填写有效的副 API 地址 (URL)！", "error"); return; }
            if (btnEl) btnEl.textContent = "⏳ 拉取中...";
            try {
                const headers = { "Accept": "application/json" };
                if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
                const res = await fetch(modelsUrl, { method: "GET", headers }), rawText = await res.text();
                let data = JSON.parse(rawText);
                const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.models) ? data.models : []);
                const ids = list.map(m => typeof m === "string" ? m : (m?.id || m?.name || "")).filter(Boolean);
                if (!ids.length) throw new Error("未找到可用模型");
                userSettings.modelList = ids;
                if (!userSettings.apiModel || !ids.includes(userSettings.apiModel)) userSettings.apiModel = ids[0];
                saveSettings();
                if (selectEl) {
                    selectEl.innerHTML = ids.map(id => `<option value="${id}" ${id === userSettings.apiModel ? "selected" : ""}>${id}</option>`).join("");
                    selectEl.style.display = "block";
                }
                const modInput = document.getElementById("st-api-mod");
                if (modInput) modInput.value = userSettings.apiModel;
                if (btnEl) btnEl.textContent = `✅ 已拉取(${ids.length})`;
                showToast(`✅ 成功拉取 ${ids.length} 个模型！`, "success");
            } catch (err) {
                if (btnEl) btnEl.textContent = "❌ 拉取失败";
                showToast("❌ 拉取模型失败：" + (err.message || "网络错误"), "error", 4500);
            }
        }

        // =========================================================================
        // 🖼️ 1~6 阶段图片候选加载引擎（支持相册单选直换 + _1~_6自动匹配）
        // =========================================================================
        function getStageImageCandidates(item) {
            const manualUrl = safeStr(
                item.isCustom
                    ? curVars.自定义条目?.[item.catTitle]?.find(x => x.id === item.editKey)?.imgUrl
                    : curVars.按钮详情?.[item.editKey]?.imgUrl
            ).trim();
            if (manualUrl) {
                const hitManual = queryImportedImage(manualUrl);
                return hitManual ? [hitManual, manualUrl] : [manualUrl];
            }

            if (!item.editKey) return [];

            let pct = (item.pct !== null && item.pct !== undefined) ? item.pct : safeNum(curVars.核心数值?.淫乱恶堕, 0);
            const isRev = (item.editKey === "shame" || item.editKey === "sta");
            const stageIdx = tier6(pct, isRev);
            const stageNum = stageIdx + 1;
            const baseFolder = `${PLUGIN_BASE_PATH}/images`;

            const candidates = [];
            const stageKey = `${item.editKey}_${stageNum}`;

            for (let s = stageNum; s >= 1; s--) {
                const fallbackHit = queryImportedImage(`${item.editKey}_${s}`);
                if (fallbackHit && !candidates.includes(fallbackHit)) candidates.push(fallbackHit);
            }
            const hitGeneral = queryImportedImage(item.editKey);
            if (hitGeneral && !candidates.includes(hitGeneral)) candidates.push(hitGeneral);

            const presetArr = DEFAULT_STAGE_IMAGES[item.editKey];
            if (Array.isArray(presetArr)) {
                for (let s = stageIdx; s >= 0; s--) {
                    const entry = safeStr(presetArr[s]).trim();
                    if (!entry) continue;
                    const hitPreset = queryImportedImage(entry);
                    if (hitPreset && !candidates.includes(hitPreset)) candidates.push(hitPreset);

                    if (entry.startsWith("http") || entry.startsWith("data:") || entry.startsWith("/")) {
                        candidates.push(entry);
                    } else if (/\.(?:webp|png|gif|jpg|jpeg)$/i.test(entry)) {
                        candidates.push(`${baseFolder}/${entry}`);
                    } else {
                        candidates.push(
                            `${baseFolder}/${entry}.webp`,
                            `${baseFolder}/${entry}.png`,
                            `${baseFolder}/${entry}.gif`,
                            `${baseFolder}/${entry}.jpg`
                        );
                    }
                }
            }

            candidates.push(
                `${baseFolder}/${stageKey}.webp`,
                `${baseFolder}/${stageKey}.png`,
                `${baseFolder}/${stageKey}.gif`,
                `${baseFolder}/${stageKey}.jpg`,
                `${baseFolder}/${item.editKey}.webp`,
                `${baseFolder}/${item.editKey}.png`
            );

            return [...new Set(candidates)];
        }

        function openTrueFullscreenImage(imgSrc) {
            if (!imgSrc) return;
            let lb = document.getElementById("st-v25-fullscreen-lightbox");
            if (!lb) {
                lb = document.createElement("div");
                lb.id = "st-v25-fullscreen-lightbox";
                lb.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;background:#000;display:none;flex-direction:column;justify-content:center;align-items:center;overflow:auto;touch-action:pan-x pan-y pinch-zoom;";
                document.body.appendChild(lb);
            }

            lb.innerHTML = `
                <div id="st-lb-toolbar" style="position:fixed;top:14px;right:14px;z-index:2147483647;display:flex;gap:8px;">
                    <button id="st-lb-mode-btn" type="button" style="background:rgba(243,139,168,0.94);color:#11111b;border:none;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.7);">🔍 继续放大: 零黑边铺满</button>
                    <button id="st-lb-close-btn" type="button" style="background:rgba(20,16,32,0.88);color:#fff;border:1.5px solid #f38ba8;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.7);">关闭 ✕</button>
                </div>
                <img id="st-lb-full-img" src="${imgSrc}" style="width:100vw;height:auto;max-width:none;max-height:none;object-fit:contain;display:block;margin:auto;padding:0;border:none;border-radius:0;transition:width 0.18s ease, height 0.18s ease;">
            `;
            lb.style.display = "flex";

            const fullImg = lb.querySelector("#st-lb-full-img");
            const modeBtn = lb.querySelector("#st-lb-mode-btn");
            const closeBtn = lb.querySelector("#st-lb-close-btn");
            let curMode = 0;

            modeBtn.onclick = (e) => {
                e.stopPropagation();
                curMode = (curMode + 1) % 3;
                if (curMode === 0) {
                    lb.style.justifyContent = "center";
                    lb.style.alignItems = "center";
                    fullImg.style.width = "100vw";
                    fullImg.style.height = "auto";
                    fullImg.style.objectFit = "contain";
                    modeBtn.textContent = "🔍 继续放大: 零黑边铺满";
                } else if (curMode === 1) {
                    lb.style.justifyContent = "center";
                    lb.style.alignItems = "center";
                    fullImg.style.width = "100vw";
                    fullImg.style.height = "100vh";
                    fullImg.style.objectFit = "cover";
                    modeBtn.textContent = "🔍 继续放大: 200%特写";
                } else {
                    lb.style.justifyContent = "flex-start";
                    lb.style.alignItems = "flex-start";
                    fullImg.style.width = "200vw";
                    fullImg.style.height = "auto";
                    fullImg.style.objectFit = "contain";
                    modeBtn.textContent = "🔄 恢复: 100%屏幕宽";
                }
            };

            closeBtn.onclick = (e) => { e.stopPropagation(); lb.style.display = "none"; };
            fullImg.onclick = () => { lb.style.display = "none"; };
        }

        // =========================================================================
        // 🔍 详情弹窗（新增「📁 相册选图直换」功能，选完即刻更换无需手填！）
        // =========================================================================
        function showDetailPopup(itemIdx) {
            const d = (latestStatus && latestStatus.categories?.length) ? latestStatus : getFallbackData();
            const cat = activeCat !== null ? d.categories[activeCat] : null;
            if (!cat || !cat.items[itemIdx]) return;
            curDetailIdx = itemIdx;
            const item = cat.items[itemIdx], ov = document.getElementById("st-v6-detail-modal");
            if (!ov) return;

            document.getElementById("st-v6-det-title").innerHTML = item.keyHTML;
            document.getElementById("st-v6-det-bar").innerHTML = item.barHTML || "";

            const imgCandidates = getStageImageCandidates(item);
            const savedManualUrl = safeStr(
                item.isCustom
                    ? curVars.自定义条目?.[item.catTitle]?.find(x => x.id === item.editKey)?.imgUrl
                    : curVars.按钮详情?.[item.editKey]?.imgUrl
            ).trim();

            let pctForLabel = (item.pct !== null && item.pct !== undefined) ? item.pct : safeNum(curVars.核心数值?.淫乱恶堕, 0);
            const isRev = (item.editKey === "shame" || item.editKey === "sta");
            const curStageIdx = tier6(pctForLabel, isRev) + 1;
            const defaultStageImgKey = `${item.editKey || "custom"}_${curStageIdx}`;

            const imgBoxHTML = `
                <div id="st-v25-img-container" title="点击全屏放大查看" style="display:none;margin-bottom:10px;position:relative;border-radius:12px;overflow:hidden;border:1.5px solid ${curStageIdx === 6 ? "#fde047" : "#f38ba8"};background:radial-gradient(circle,#1e152a,#0d0914);box-shadow:0 6px 20px rgba(0,0,0,0.65);justify-content:center;align-items:center;cursor:zoom-in;">
                    <img id="st-v25-stage-img" alt="阶段状态图" style="max-width:100%;max-height:220px;object-fit:contain;display:block;margin:0 auto;">
                    <span style="position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,0.75);color:#fde047;border:1px solid rgba(253,224,71,0.5);padding:1px 8px;border-radius:99px;font-size:10.5px;font-weight:bold;pointer-events:none;">🔍 Lv.${curStageIdx} 点图全屏放大</span>
                </div>`;

            const rawDesc = safeStr(item.desc, "暂无详细描述").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const [objPart, thoughtPart] = rawDesc.split(/💭(?=【)/);

            const objLines = safeStr(objPart).trim().split(/\n+/).filter(Boolean);
            let objHTML = "";
            objLines.forEach(line => {
                const styledLine = line.replace(/【([^】]+)】/g, `<b style="color:#f9e2af;">【$1】</b>`);
                if (line.startsWith("【")) {
                    objHTML += `<div class="st-sec-block">${styledLine}</div>`;
                } else {
                    objHTML += `<div style="padding:2px 6px 6px 6px;color:#ede6f2;">${styledLine}</div>`;
                }
            });

            let thoughtHTML = "", rawThoughtPure = "";
            if (thoughtPart) {
                const tMatch = thoughtPart.match(/^(【[^】]+】)：?([\s\S]*)$/);
                const tHeader = tMatch ? tMatch[1] : "【实时内心独白】";
                rawThoughtPure = cleanThoughtText(tMatch ? tMatch[2] : thoughtPart);
                thoughtHTML = `<div class="st-thought-box"><b style="color:#f9e2af;font-style:normal;font-size:13px;display:block;margin-bottom:5px;">💭 ${tHeader}</b>“*${rawThoughtPure}*”</div>`;
            }

            const rawObjPure = safeStr(item.desc).split(/💭(?=【)/)[0].trim();
            const editorHTML = `
                <div id="st-v25-item-editor" style="display:none;margin-top:12px;padding:12px;background:rgba(15,12,26,0.95);border:1.5px dashed #f9e2af;border-radius:10px;flex-direction:column;gap:8px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
                        <b style="color:#f9e2af;font-size:12px;">✏️ 修改内容与配图 (当前第${curStageIdx}阶段图名: ${defaultStageImgKey})</b>
                        ${item.isCustom ? `<button id="st-v25-del-custom" type="button" style="background:rgba(220,38,38,0.3);color:#fca5a5;border:1px solid #ef4444;border-radius:6px;padding:2px 8px;font-size:11.5px;cursor:pointer;font-weight:bold;">🗑️ 删除此项</button>` : ""}
                    </div>
                    <input id="st-v25-ed-title" type="text" value="${safeStr(item.rawKey).replace(/"/g, "&quot;")}" placeholder="按钮完整标题（支持带 50/100 和「状态标签」）" style="background:#11111b;color:#f9e2af;border:1px solid rgba(255,255,255,0.25);border-radius:6px;padding:6px 8px;font-size:12.5px;font-weight:bold;">
                    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                        <input id="st-v25-ed-img" type="text" value="${savedManualUrl.replace(/"/g, "&quot;")}" placeholder="🖼️ 留空自动匹配 ${defaultStageImgKey}，或点击右侧直接从相册选图" style="flex:1;min-width:160px;background:#11111b;color:#a6e3a1;border:1px solid rgba(166,227,161,0.45);border-radius:6px;padding:6px 8px;font-size:12px;">
                        <input id="st-v25-single-file" type="file" accept="image/*" style="display:none;">
                        <button id="st-v25-pick-img-btn" type="button" style="background:linear-gradient(135deg,#a6e3a1,#67e8f9);color:#11111b;border:none;border-radius:6px;padding:6px 10px;font-size:11.5px;font-weight:900;cursor:pointer;white-space:nowrap;">📁 相册选图直换</button>
                        <button id="st-v25-clr-img-btn" type="button" title="恢复默认阶段图匹配" style="background:rgba(255,255,255,0.1);color:#cbd5e1;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:11px;cursor:pointer;">重置图</button>
                    </div>
                    <input id="st-v25-ed-hint" type="text" placeholder="💡 在此输入简短提示词，再点下方✨AI生成自动改写文字" style="background:#1a162b;color:#a5f3fc;border:1px solid #67e8f9;border-radius:6px;padding:6px 8px;font-size:12px;">
                    <textarea id="st-v25-ed-desc" rows="4" placeholder="详细状态描述..." style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;resize:vertical;">${rawObjPure}</textarea>
                    <textarea id="st-v25-ed-thought" rows="3" placeholder="主角第一人称内心独白..." style="background:#11111b;color:#ffd6e7;border:1px solid rgba(243,139,168,0.4);border-radius:6px;padding:6px 8px;font-size:12px;resize:vertical;">${rawThoughtPure}</textarea>
                    <div style="display:flex;gap:8px;justify-content:flex-end;">
                        <button id="st-v25-ed-ai-btn" type="button" style="background:linear-gradient(135deg,#cba6f7,#89b4fa);color:#11111b;border:none;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:bold;cursor:pointer;">✨ AI根据输入自动生成</button>
                        <button id="st-v25-ed-save-btn" type="button" style="background:#a6e3a1;color:#11111b;border:none;border-radius:7px;padding:6px 14px;font-size:12px;font-weight:bold;cursor:pointer;">💾 保存修改</button>
                    </div>
                </div>`;

            const descContainer = document.getElementById("st-v6-det-desc");
            descContainer.innerHTML = imgBoxHTML + objHTML + thoughtHTML + editorHTML;
            document.getElementById("st-v6-det-page").textContent = `${cat.icon} ${cat.title} (${itemIdx + 1}/${cat.items.length})`;
            ov.style.display = "flex";

            const imgWrap = document.getElementById("st-v25-img-container");
            const imgEl = document.getElementById("st-v25-stage-img");
            if (imgWrap && imgEl && imgCandidates.length > 0) {
                let tryIdx = 0;
                imgEl.onload = () => { imgWrap.style.display = "flex"; };
                imgEl.onerror = () => {
                    tryIdx++;
                    if (tryIdx < imgCandidates.length) {
                        imgEl.src = imgCandidates[tryIdx];
                    } else {
                        imgWrap.style.display = "none";
                    }
                };
                imgEl.src = imgCandidates[0];

                imgWrap.onclick = (e) => {
                    e.stopPropagation();
                    openTrueFullscreenImage(imgEl.src);
                };
            }

            // 绑定「📁 相册选图直换」事件
            const pickImgBtn = document.getElementById("st-v25-pick-img-btn");
            const singleFileInp = document.getElementById("st-v25-single-file");
            const imgUrlInp = document.getElementById("st-v25-ed-img");
            const clrImgBtn = document.getElementById("st-v25-clr-img-btn");

            if (pickImgBtn && singleFileInp) {
                pickImgBtn.onclick = () => singleFileInp.click();
                singleFileInp.onchange = async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    pickImgBtn.textContent = "⏳ 换图中...";
                    try {
                        // 直接按当前阶段图名存入 IndexedDB，并同步绑定到该按钮上，立即生效！
                        const { normKey, dUrl } = await saveSingleImageToDB(defaultStageImgKey, file);
                        if (imgUrlInp) imgUrlInp.value = normKey;
                        if (imgEl && imgWrap) {
                            imgEl.src = dUrl;
                            imgWrap.style.display = "flex";
                        }
                        if (item.isCustom && item.catTitle) {
                            const found = (curVars.自定义条目?.[item.catTitle] || []).find(x => x.id === item.editKey);
                            if (found) found.imgUrl = normKey;
                        } else if (item.editKey) {
                            curVars.按钮详情 = curVars.按钮详情 || {};
                            curVars.按钮详情[item.editKey] = {
                                ...(curVars.按钮详情[item.editKey] || {}),
                                imgUrl: normKey
                            };
                        }
                        saveChatCache(curVars);
                        latestStatus = getFallbackData();
                        renderBody();
                        showToast(`🖼️ 已成功更换【${item.cleanTitle}】的配图！`, "success", 2500);
                    } catch (err) {
                        showToast("❌ 选图更换失败：" + (err.message || "图片格式不支持"), "error");
                    } finally {
                        pickImgBtn.textContent = "📁 相册选图直换";
                    }
                };
            }

            if (clrImgBtn && imgUrlInp) {
                clrImgBtn.onclick = () => {
                    imgUrlInp.value = "";
                    showToast("🔄 已恢复默认阶段图匹配，请点下方【💾 保存修改】生效", "info", 2200);
                };
            }

            const editorBox = document.getElementById("st-v25-item-editor");
            const toggleEditBtn = document.getElementById("st-v6-edit-toggle");
            if (toggleEditBtn) {
                toggleEditBtn.onclick = () => {
                    const isHid = editorBox.style.display === "none";
                    editorBox.style.display = isHid ? "flex" : "none";
                    if (isHid) descContainer.scrollTop = descContainer.scrollHeight;
                };
            }

            const aiBtn = document.getElementById("st-v25-ed-ai-btn");
            if (aiBtn) {
                aiBtn.onclick = async () => {
                    const curTitle = document.getElementById("st-v25-ed-title").value.trim() || item.cleanTitle;
                    const hint = document.getElementById("st-v25-ed-hint").value.trim();
                    const res = await requestSingleItemAiGen(curTitle, hint, aiBtn);
                    if (res) {
                        if (res.desc) document.getElementById("st-v25-ed-desc").value = res.desc;
                        if (res.thought) document.getElementById("st-v25-ed-thought").value = cleanThoughtText(res.thought);
                        if (res.stage && /「[^」]+」/.test(curTitle)) {
                            document.getElementById("st-v25-ed-title").value = curTitle.replace(/「[^」]+」/, `「${res.stage}」`);
                        }
                    }
                };
            }

            const saveBtn = document.getElementById("st-v25-ed-save-btn");
            if (saveBtn) {
                saveBtn.onclick = () => {
                    const newTitle = document.getElementById("st-v25-ed-title").value.trim();
                    const newImgUrl = document.getElementById("st-v25-ed-img").value.trim();
                    const newDesc = document.getElementById("st-v25-ed-desc").value.trim();
                    const newThought = cleanThoughtText(document.getElementById("st-v25-ed-thought").value);

                    if (item.isCustom && item.catTitle) {
                        const list = curVars.自定义条目?.[item.catTitle] || [];
                        const found = list.find(x => x.id === item.editKey);
                        if (found) {
                            found.title = newTitle;
                            found.stage = "";
                            found.ratio = "";
                            found.imgUrl = newImgUrl;
                            found.desc = newDesc;
                            found.thought = newThought;
                        }
                    } else if (item.editKey && item.editKey.startsWith("fetish_")) {
                        const fName = item.editKey.replace(/^fetish_/, "");
                        curVars.性癖详情 = curVars.性癖详情 || {};
                        curVars.性癖详情[fName] = {
                            ...(curVars.性癖详情[fName] || {}),
                            desc: newDesc,
                            thought: newThought
                        };
                        curVars.按钮详情[item.editKey] = {
                            customTitle: newTitle,
                            imgUrl: newImgUrl,
                            desc: newDesc,
                            thought: newThought
                        };
                    } else if (item.editKey) {
                        curVars.按钮详情 = curVars.按钮详情 || {};
                        curVars.按钮详情[item.editKey] = {
                            customTitle: newTitle,
                            imgUrl: newImgUrl,
                            desc: newDesc,
                            thought: newThought
                        };
                    }

                    saveChatCache(curVars);
                    latestStatus = getFallbackData();
                    renderBody();
                    showDetailPopup(itemIdx);
                    showToast("💾 按钮文字与配图设置已保存！", "success", 2200);
                };
            }

            const delBtn = document.getElementById("st-v25-del-custom");
            if (delBtn && item.isCustom && item.catTitle) {
                delBtn.onclick = () => {
                    curVars.自定义条目[item.catTitle] = (curVars.自定义条目[item.catTitle] || []).filter(x => x.id !== item.editKey);
                    saveChatCache(curVars);
                    latestStatus = getFallbackData();
                    ov.style.display = "none";
                    renderBody();
                    showToast("🗑️ 已删除该自定义状态按钮！", "info", 2000);
                };
            }
        }

        function openAddCustomItemModal(catTitle) {
            const ov = document.getElementById("st-v6-detail-modal");
            if (!ov) return;
            document.getElementById("st-v6-det-title").innerHTML = `<span style="color:#f9e2af;font-weight:bold;font-size:14.5px;">➕ 在【${catTitle}】下新增自定义按钮</span>`;
            document.getElementById("st-v6-det-bar").innerHTML = "";
            document.getElementById("st-v6-det-page").textContent = `新增自定义项 -> ${catTitle}`;

            const descContainer = document.getElementById("st-v6-det-desc");
            descContainer.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:9px;padding:6px 2px;">
                    <div style="font-size:12px;color:#a5f3fc;">💡 只需填写按钮名称或一句话想法，点击下方 <b>「✨ AI根据输入自动补全」</b> 即可自动生成全套描述与主角心声！</div>
                    <input id="st-v25-new-title" type="text" placeholder="按钮名称（例如：💍 阴蒂震动贞操环 或 🍆 楼下刘叔）" style="background:#11111b;color:#f9e2af;border:1px solid #f38ba8;border-radius:7px;padding:7px 10px;font-size:13px;font-weight:bold;">
                    <div style="display:flex;gap:8px;">
                        <input id="st-v25-new-ratio" type="text" placeholder="进度数值（可选，如 65/100）" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:6px 8px;font-size:12px;">
                        <input id="st-v25-new-stage" type="text" placeholder="右侧徽章标签（可选，如 强制发情中）" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:6px 8px;font-size:12px;">
                    </div>
                    <div style="display:flex;gap:6px;align-items:center;">
                        <input id="st-v25-new-img" type="text" placeholder="🖼️ 配图 URL 或点击右侧从相册选图" style="flex:1;background:#11111b;color:#a6e3a1;border:1px solid rgba(166,227,161,0.4);border-radius:7px;padding:6px 10px;font-size:12px;">
                        <input id="st-v25-new-file" type="file" accept="image/*" style="display:none;">
                        <button id="st-v25-new-pick-img" type="button" style="background:linear-gradient(135deg,#a6e3a1,#67e8f9);color:#11111b;border:none;border-radius:7px;padding:6px 10px;font-size:11.5px;font-weight:900;cursor:pointer;white-space:nowrap;">📁 相册选图</button>
                    </div>
                    <input id="st-v25-new-hint" type="text" placeholder="✨ AI生成提示词（例如：写她被戴上无法取下的贞操环，走路都在漏水）" style="background:#1a162b;color:#a5f3fc;border:1px solid #67e8f9;border-radius:7px;padding:7px 10px;font-size:12px;">
                    <textarea id="st-v25-new-desc" rows="4" placeholder="详细状态描述（可手写或点下方按钮由AI生成）..." style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:7px 10px;font-size:12px;resize:vertical;"></textarea>
                    <textarea id="st-v25-new-thought" rows="3" placeholder="主角第一人称内心独白（可手写或由AI生成）..." style="background:#11111b;color:#ffd6e7;border:1px solid rgba(243,139,168,0.4);border-radius:7px;padding:7px 10px;font-size:12px;resize:vertical;"></textarea>
                    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
                        <button id="st-v25-new-ai-btn" type="button" style="background:linear-gradient(135deg,#cba6f7,#89b4fa);color:#11111b;border:none;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">✨ AI根据输入自动补全</button>
                        <button id="st-v25-new-save-btn" type="button" style="background:#a6e3a1;color:#11111b;border:none;border-radius:8px;padding:7px 16px;font-size:12.5px;font-weight:bold;cursor:pointer;">➕ 确认添加按钮</button>
                    </div>
                </div>`;
            ov.style.display = "flex";

            const newPickBtn = document.getElementById("st-v25-new-pick-img");
            const newFileInp = document.getElementById("st-v25-new-file");
            if (newPickBtn && newFileInp) {
                newPickBtn.onclick = () => newFileInp.click();
                newFileInp.onchange = async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const customKey = "custom_img_" + Date.now();
                    const { normKey } = await saveSingleImageToDB(customKey, f);
                    document.getElementById("st-v25-new-img").value = normKey;
                    showToast("🖼️ 图片已载入！", "success", 2000);
                };
            }

            const aiBtn = document.getElementById("st-v25-new-ai-btn");
            aiBtn.onclick = async () => {
                const titleVal = document.getElementById("st-v25-new-title").value.trim() || `【${catTitle}】新状态`;
                const hintVal = document.getElementById("st-v25-new-hint").value.trim() || titleVal;
                const res = await requestSingleItemAiGen(titleVal, hintVal, aiBtn);
                if (res) {
                    if (!document.getElementById("st-v25-new-title").value.trim() && res.title) {
                        document.getElementById("st-v25-new-title").value = res.title;
                    }
                    if (res.stage) document.getElementById("st-v25-new-stage").value = res.stage;
                    if (res.ratio) document.getElementById("st-v25-new-ratio").value = res.ratio;
                    if (res.desc) document.getElementById("st-v25-new-desc").value = res.desc;
                    if (res.thought) document.getElementById("st-v25-new-thought").value = cleanThoughtText(res.thought);
                }
            };

            document.getElementById("st-v25-new-save-btn").onclick = () => {
                const t = document.getElementById("st-v25-new-title").value.trim() || "✨ 自定义状态";
                const r = document.getElementById("st-v25-new-ratio").value.trim();
                const s = document.getElementById("st-v25-new-stage").value.trim();
                const img = document.getElementById("st-v25-new-img").value.trim();
                const d = document.getElementById("st-v25-new-desc").value.trim() || "自定义新增的状态详情。";
                const th = cleanThoughtText(document.getElementById("st-v25-new-thought").value) || "身体又多了一种奇怪的状态呢💦……";

                curVars.自定义条目 = curVars.自定义条目 || {};
                if (!Array.isArray(curVars.自定义条目[catTitle])) curVars.自定义条目[catTitle] = [];
                curVars.自定义条目[catTitle].push({
                    id: "custom_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                    title: t, ratio: r, stage: s, imgUrl: img, desc: d, thought: th
                });

                saveChatCache(curVars);
                latestStatus = getFallbackData();
                ov.style.display = "none";
                renderBody();
                showToast(`✅ 已在【${catTitle}】下成功添加新按钮：「${t}」！`, "success", 2800);
            };
        }

        // =========================================================================
        // ⚙️ 设置面板（已移除图片缩略图预览墙，界面清爽防社死！）
        // =========================================================================
        function renderSettingsView(body) {
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
            const diff = getDifficultyProfile();
            const realId = detectRealCharacterIdentity(curVars);
            const box = document.createElement("div");
            box.style.cssText = "display:flex;flex-direction:column;gap:12px;font-size:12.5px;";
            const hasModels = Array.isArray(userSettings.modelList) && userSettings.modelList.length > 0;

            box.innerHTML = `
                <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                    <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">📦 0. 导入本地图包 (静默缓存 · 不展示图片墙)</div>
                    <div style="font-size:11.5px;color:${tc.sub};line-height:1.5;">
                        当前已静默缓存：<b id="st-idb-count" style="color:#a6e3a1;font-size:13.5px;">${importedImgCache.size}</b> 张阶段配图。<br>
                        💡 支持批量导入（按 <code>小穴实况_1</code> ~ <code>_6</code> 自动匹配），也可点进任意按钮的 <b>「✏️编辑/配图 ➔ 📁相册选图直换」</b> 单独换图！
                    </div>
                    <input id="st-import-zip-inp" type="file" accept=".zip,application/zip,application/x-zip-compressed" style="display:none;">
                    <input id="st-import-files-inp" type="file" multiple accept="image/*" style="display:none;">
                    <div style="display:flex;gap:7px;flex-wrap:wrap;">
                        <button id="st-btn-imp-zip" type="button" style="flex:1.2;background:linear-gradient(135deg,#a6e3a1,#67e8f9);color:#11111b;border:none;border-radius:8px;padding:8px 10px;font-weight:900;cursor:pointer;font-size:12px;">📦 导入 images.zip 压缩包</button>
                        <button id="st-btn-imp-files" type="button" style="flex:1;background:rgba(166,227,161,0.2);color:#a6e3a1;border:1px solid #a6e3a1;border-radius:8px;padding:8px 10px;font-weight:bold;cursor:pointer;font-size:12px;">🖼️ 相册批量导入</button>
                        <button id="st-btn-clr-idb" type="button" style="background:rgba(239,68,68,0.25);color:#fca5a5;border:1px solid #ef4444;border-radius:8px;padding:8px 10px;font-weight:bold;cursor:pointer;font-size:12px;">🗑️ 清空图库</button>
                    </div>
                </div>
                <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                    <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎚️ 1. 全局6阶段难易度 & 100分联动引擎</div>
                    <div style="display:flex;gap:6px;align-items:center;">
                        <input id="st-protag-name-inp" type="text" placeholder="自动识别中（当前：${detectProtagonistName(curVars)}）" value="${safeStr(curVars.档案?.当前认知名字)}" style="flex:1;background:#11111b;color:#f9e2af;border:1px solid ${tc.prim};border-radius:6px;padding:6px 8px;font-size:12px;font-weight:bold;">
                        <button id="st-protag-name-reset" type="button" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.25);border-radius:6px;padding:6px 10px;cursor:pointer;font-size:12px;">重置真名</button>
                    </div>
                    <div style="font-size:11.5px;color:${tc.sub};margin-top:2px;">故事内真实身份：<b style="color:#f9e2af;">${realId}</b> ｜ 当前难度：<b style="color:#a5f3fc;">${diff.name}</b></div>
                    <select id="st-diff-mode-sel" style="background:#11111b;color:#f9e2af;border:1px solid ${tc.sec};border-radius:6px;padding:7px 8px;font-size:12px;cursor:pointer;font-weight:bold;">
                        ${Object.entries(DIFFICULTY_PRESETS).map(([k, v]) => `<option value="${k}" ${userSettings.difficultyMode === k ? "selected" : ""}>${v.label}</option>`).join("")}
                    </select>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin-top:2px;">
                        <input id="st-reverse-inject-chk" type="checkbox" ${userSettings.injectReversePrompt ? "checked" : ""} style="accent-color:${tc.prim};">
                        <span><b style="color:#a6e3a1;">🔗 启用「状态栏 ➔ 正文」反向支配铁律（强制主AI体现名器阶位/残精下坠/恶堕神态）</b></span>
                    </label>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                        <input id="st-metabolism-chk" type="checkbox" ${userSettings.autoMetabolism ? "checked" : ""} style="accent-color:${tc.prim};">
                        <span><b style="color:#67e8f9;">🚿 启用「清洗排精/睡眠回体」自然代谢引擎（识别正文抠洗/冲刷/睡觉自动增减数值）</b></span>
                    </label>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                        <input id="st-mental-lock-chk" type="checkbox" ${userSettings.strictMentalLock ? "checked" : ""} style="accent-color:${tc.prim};">
                        <span><b>🔒 启用「🔥恶堕与脑改」难度同步锁（依总账次数与所选难度严格推进1~6阶段）</b></span>
                    </label>
                </div>
                <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                    <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎨 2. 五大高定特色主题与窗口尺寸</div>
                    <div id="st-v12-themes" style="display:grid;grid-template-columns:1fr;gap:7px;"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;"><span>宽度 (<b id="st-w-val">${userSettings.width}</b>px)：</span><input id="st-w-rng" type="range" min="330" max="900" value="${userSettings.width}" style="flex:1;accent-color:${tc.prim};"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>高度 (<b id="st-h-val">${userSettings.height}</b>px)：</span><input id="st-h-rng" type="range" min="360" max="920" value="${userSettings.height}" style="flex:1;accent-color:${tc.prim};"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>字号 (<b id="st-z-val">${userSettings.fontScale}</b>%)：</span><input id="st-z-rng" type="range" min="80" max="135" value="${userSettings.fontScale}" style="flex:1;accent-color:${tc.prim};"></div>
                </div>
                <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                    <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🔌 3. 副 API 实时重绘设置</div>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input id="st-api-chk" type="checkbox" ${userSettings.apiSyncEnabled ? "checked" : ""} style="accent-color:${tc.prim};"><span><b>每回合结束后自动调用副 API 全量改写所有按钮与心声</b></span></label>
                    <input id="st-api-url" type="text" placeholder="副 API 地址，如 https://api.openai.com/v1" value="${safeStr(userSettings.apiUrl)}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                    <input id="st-api-key" type="password" placeholder="副 API Key (sk-...)" value="${safeStr(userSettings.apiKey)}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                    <div style="display:flex;gap:6px;align-items:center;">
                        <input id="st-api-mod" type="text" placeholder="模型名称" value="${safeStr(userSettings.apiModel)}" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                        <button id="st-v13-fetch-models" type="button" style="background:rgba(203,166,247,0.25);color:#f5c2e7;border:1px solid ${tc.sec};border-radius:6px;padding:6px 10px;font-weight:bold;cursor:pointer;white-space:nowrap;font-size:12px;">📥 拉取模型</button>
                    </div>
                    <select id="st-api-mod-sel" style="display:${hasModels ? "block" : "none"};background:#11111b;color:#f9e2af;border:1px solid ${tc.prim};border-radius:6px;padding:6px 8px;font-size:12px;cursor:pointer;">
                        ${(userSettings.modelList || []).map(m => `<option value="${m}" ${m === userSettings.apiModel ? "selected" : ""}>${m}</option>`).join("")}
                    </select>
                    <div style="display:flex;gap:8px;margin-top:4px;">
                        <button id="st-v12-api-save" type="button" style="flex:1;background:${tc.prim};color:#11111b;border:none;border-radius:8px;padding:7px;font-weight:bold;cursor:pointer;">💾 保存设置</button>
                        <button id="st-v12-api-test" type="button" style="flex:1;background:${tc.hi};color:#fff;border:1px solid ${tc.sec};border-radius:8px;padding:7px;font-weight:bold;cursor:pointer;">⚡ 立即用副API重绘本层</button>
                    </div>
                </div>`;
            body.appendChild(box);

            const zipInp = box.querySelector("#st-import-zip-inp");
            const filesInp = box.querySelector("#st-import-files-inp");

            box.querySelector("#st-btn-imp-zip").onclick = () => zipInp.click();
            box.querySelector("#st-btn-imp-files").onclick = () => filesInp.click();

            const handleImport = async (files) => {
                if (!files || !files.length) return;
                showToast("⏳ 正在静默解压并存入持久图库...", "info", 4500);
                try {
                    const cnt = await importFilesOrZipToDB(files);
                    if (cnt > 0) {
                        latestStatus = getFallbackData();
                        renderBody();
                        showToast(`✅ 成功导入并激活 ${cnt} 张图片！（共缓存 ${importedImgCache.size} 张）`, "success", 3800);
                    } else {
                        showToast("⚠️ 未在所选文件中找到有效图片", "warn", 3800);
                    }
                } catch (err) {
                    showToast("❌ 导入失败：" + (err.message || "文件格式错误"), "error", 4000);
                }
            };

            zipInp.onchange = (e) => handleImport(e.target.files);
            filesInp.onchange = (e) => handleImport(e.target.files);

            box.querySelector("#st-btn-clr-idb").onclick = async () => {
                await clearAllImportedImagesDB();
                renderBody();
                showToast("🗑️ 已清空浏览器内导入的本地图库！", "info", 2500);
            };

            const nameInp = box.querySelector("#st-protag-name-inp");
            const diffSel = box.querySelector("#st-diff-mode-sel");
            const lockChk = box.querySelector("#st-mental-lock-chk");
            const revChk = box.querySelector("#st-reverse-inject-chk");
            const metaChk = box.querySelector("#st-metabolism-chk");

            diffSel.onchange = () => {
                userSettings.difficultyMode = diffSel.value;
                saveSettings();
                recalc(false);
                showToast(`🎚️ 全局6阶段调教难度已切换为：${DIFFICULTY_PRESETS[diffSel.value].label}`, "info", 2800);
            };
            lockChk.onchange = () => {
                userSettings.strictMentalLock = lockChk.checked;
                saveSettings();
                recalc(false);
            };
            revChk.onchange = () => {
                userSettings.injectReversePrompt = revChk.checked;
                saveSettings();
                recalc(false);
                showToast(revChk.checked ? "🔗 已开启状态栏反向支配正文铁律！" : "⚪ 已关闭状态栏反向支配正文", "info", 2200);
            };
            metaChk.onchange = () => {
                userSettings.autoMetabolism = metaChk.checked;
                saveSettings();
                recalc(false);
                showToast(metaChk.checked ? "🚿 已开启清洗排精/睡眠回体自然代谢引擎！" : "⚪ 已关闭自然代谢引擎", "info", 2200);
            };

            box.querySelector("#st-protag-name-reset").onclick = () => {
                nameInp.value = "";
                if (curVars.档案) curVars.档案.当前认知名字 = "";
                saveChatCache(curVars);
                latestStatus = getFallbackData();
                showToast("🔄 已恢复从正文自动识别主角真名！", "info", 2000);
            };

            const tBox = box.querySelector("#st-v12-themes");
            Object.keys(THEMES).forEach(tName => {
                const tCfg = THEMES[tName];
                const tb = document.createElement("button"); tb.type = "button";
                const act = userSettings.theme === tName;
                tb.style.cssText = `padding:9px 12px;border-radius:${tCfg.radius};cursor:pointer;font-weight:bold;font-size:12px;border:${act ? tCfg.border : "1px solid rgba(255,255,255,0.18)"};background:${tCfg.bg};color:${tCfg.text};display:flex;justify-content:space-between;align-items:center;box-shadow:${act ? tCfg.shadow : "none"};`;
                tb.innerHTML = `<span>${act ? "✅ " : "🎨 "}${tName}</span><span style="font-size:10.5px;color:${tCfg.prim};opacity:0.9;">${tCfg.badgeDesc || ""}</span>`;
                tb.onclick = () => { userSettings.theme = tName; saveSettings(); applyThemeAndSize(); renderBody(); };
                tBox.appendChild(tb);
            });

            const bindRng = (id, valId, key) => {
                const el = box.querySelector(id), vEl = box.querySelector(valId);
                el.oninput = () => { userSettings[key] = Number(el.value); vEl.textContent = el.value; applyThemeAndSize(); };
                el.onchange = saveSettings;
            };
            bindRng("#st-w-rng", "#st-w-val", "width");
            bindRng("#st-h-rng", "#st-h-val", "height");
            bindRng("#st-z-rng", "#st-z-val", "fontScale");

            const modSel = box.querySelector("#st-api-mod-sel"), modInp = box.querySelector("#st-api-mod"), fetchBtn = box.querySelector("#st-v13-fetch-models");
            modSel.onchange = () => { modInp.value = modSel.value; userSettings.apiModel = modSel.value; saveSettings(); };
            fetchBtn.onclick = () => {
                userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
                userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
                saveSettings(); fetchModelList(fetchBtn, modSel, box.querySelector("#st-api-url"));
            };
            box.querySelector("#st-v12-api-save").onclick = () => {
                if (nameInp && curVars.档案) {
                    curVars.档案.当前认知名字 = nameInp.value.trim();
                    saveChatCache(curVars);
                }
                userSettings.difficultyMode = diffSel.value;
                userSettings.strictMentalLock = lockChk.checked;
                userSettings.injectReversePrompt = revChk.checked;
                userSettings.autoMetabolism = metaChk.checked;
                userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
                userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
                userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
                userSettings.apiModel = modInp.value.trim();
                saveSettings();
                recalc(false);
                inSettings = false; renderBody();
                showToast("💾 设置已保存！", "success", 2000);
            };
            box.querySelector("#st-v12-api-test").onclick = () => {
                if (nameInp && curVars.档案) curVars.档案.当前认知名字 = nameInp.value.trim();
                userSettings.difficultyMode = diffSel.value;
                userSettings.strictMentalLock = lockChk.checked;
                userSettings.injectReversePrompt = revChk.checked;
                userSettings.autoMetabolism = metaChk.checked;
                userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
                userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
                userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
                userSettings.apiModel = modInp.value.trim();
                saveSettings(); triggerSubApiUpdate(box.querySelector("#st-v12-api-test"));
            };
        }

        // =========================================================================
        // 📱 界面主渲染引擎（悬浮窗保持「👑 主角 · 状态栏」，扩展菜单显示「状态栏1.0」）
        // =========================================================================
        function renderBody() {
            try {
                applyThemeAndSize();
                const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
                const hasCard = checkCardAvailable(true);
                const diff = getDifficultyProfile();
                const realId = detectRealCharacterIdentity(curVars);
                const d = (latestStatus && Array.isArray(latestStatus.categories) && latestStatus.categories.length) ? latestStatus : getFallbackData();
                const setTxt = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
                setTxt("st-v5-btn-txt", hasCard ? `👑 ${d.charName || "主角"} · 状态栏` : `👑 主角 · 状态栏`);
                setTxt("st-v5-title", hasCard ? `${d.charName} [${diff.name}]` : `⚠️ 未选角色卡`);

                const tabBar = document.getElementById("st-v5-tabs");
                if (tabBar) {
                    tabBar.innerHTML = "";
                    const homeBtn = document.createElement("button"); homeBtn.type = "button";
                    const isHome = activeCat === null && !inSettings;
                    homeBtn.style.cssText = `width:100%;padding:7px 2px;border-radius:10px;font-size:11px;font-weight:bold;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;border:1px solid ${isHome ? tc.prim : "rgba(255,255,255,0.1)"};background:${isHome ? tc.prim : "rgba(255,255,255,0.05)"};color:${isHome ? "#11111b" : tc.text};transition:all 0.15s;`;
                    homeBtn.innerHTML = `<span style="font-size:14px;">🏠</span><span>总览</span>`;
                    homeBtn.onclick = () => { inSettings = false; activeCat = null; renderBody(); };
                    tabBar.appendChild(homeBtn);

                    d.categories.forEach((cat, idx) => {
                        const tb = document.createElement("button"); tb.type = "button";
                        const isAct = !inSettings && activeCat === idx;
                        tb.style.cssText = `width:100%;padding:7px 2px;border-radius:10px;font-size:11px;font-weight:bold;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;border:1px solid ${isAct ? tc.prim : "rgba(255,255,255,0.12)"};background:${isAct ? tc.hi : "rgba(0,0,0,0.35)"};color:${isAct ? tc.prim : tc.text};box-shadow:${isAct ? `0 0 10px ${tc.hi}` : "none"};transition:all 0.15s;`;
                        tb.innerHTML = `<span style="font-size:14px;">${cat.icon}</span><span>${SHORT_NAMES[cat.title] || safeStr(cat.title).slice(0, 2)}</span>`;
                        tb.onclick = () => { inSettings = false; activeCat = idx; renderBody(); };
                        tabBar.appendChild(tb);
                    });
                }

                const body = document.getElementById("st-v5-body");
                if (!body) return;
                body.innerHTML = "";
                if (inSettings) { renderSettingsView(body); return; }

                if (!hasCard) {
                    const emptyBox = document.createElement("div");
                    emptyBox.style.cssText = `background:${tc.card};border:1.5px dashed ${tc.prim};border-radius:14px;padding:24px 16px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:20px;`;
                    emptyBox.innerHTML = `
                        <div style="font-size:36px;">⚠️</div>
                        <div style="font-size:15px;font-weight:bold;color:${tc.prim};">当前未检测到角色卡或聊天记录</div>
                        <div style="font-size:12.5px;color:${tc.sub};line-height:1.6;">请先在 SillyTavern 中点选一张角色卡并开启对话。<br>进入角色卡后，状态栏将自动识别文中主角真名与完整状态！</div>`;
                    body.appendChild(emptyBox);
                    return;
                }

                if (activeCat === null || !d.categories[activeCat]) {
                    const vagCnt = safeNum(curVars.计数?.性交?.小穴);
                    const creampieCnt = safeNum(curVars.计数?.射精?.内射);
                    const corrVal = safeNum(curVars.核心数值?.淫乱恶堕);
                    const pleasVal = safeNum(curVars.精神与心理?.快感累积);
                    const cyc = safeStr(curVars.受孕与生理?.生理周期阶段, "危险排卵期");
                    const badgeBanner = document.createElement("div");
                    badgeBanner.style.cssText = `margin-bottom:10px;padding:9px 11px;background:linear-gradient(135deg,rgba(0,0,0,0.65),rgba(42,27,61,0.55));border:${tc.cardBorder};border-radius:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;font-size:11.5px;box-shadow:inset 0 0 12px rgba(243,139,168,0.14);`;
                    badgeBanner.innerHTML = `
                        <span style="color:#f9e2af;font-weight:bold;">🎭 ${d.charName} (${realId})</span>
                        <span style="color:${tc.prim};">🥚 ${cyc} ｜ 贯穿:${vagCnt} / 内射:${creampieCnt}</span>
                        <span style="color:${tc.sec};"><span class="st-heart-beat">💓</span> 恶堕:<b>${corrVal}%</b> ｜ 快感:<b>${pleasVal}%</b></span>`;
                    body.appendChild(badgeBanner);

                    const vList = document.createElement("div");
                    vList.style.cssText = "display:flex;flex-direction:column;gap:8px;";
                    d.categories.forEach((cat, idx) => {
                        const b = document.createElement("div");
                        b.className = "st-v28-card";
                        b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-left:4.5px solid ${tc.prim};border-radius:12px;padding:10px 13px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:4px;box-shadow:0 4px 14px rgba(0,0,0,0.45);`;
                        b.innerHTML = `
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span style="font-size:13.5px;font-weight:bold;color:${tc.prim};">${cat.icon} ${cat.title}</span>
                                <span style="font-size:10.5px;background:${tc.hi};color:${tc.text};padding:2px 8px;border-radius:99px;font-weight:bold;">共 ${cat.items.length} 项 ▸</span>
                            </div>
                            <div style="font-size:11px;color:${tc.sub};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cat.summary || `点击展开查看 ${cat.title} 详情与心声`}</div>`;
                        b.onclick = (e) => { e.stopPropagation(); activeCat = idx; renderBody(); };
                        vList.appendChild(b);
                    });
                    body.appendChild(vList);
                } else {
                    const cat = d.categories[activeCat], list = document.createElement("div");
                    list.style.cssText = "display:flex;flex-direction:column;gap:9px;";
                    cat.items.forEach((it, idx) => {
                        const b = document.createElement("div");
                        b.className = "st-v28-card";
                        b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-radius:12px;padding:9px 10px;cursor:pointer;user-select:none;display:flex;gap:8px;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,0.45);overflow:hidden;`;
                        const parts = safeStr(it.desc).split("💭");
                        const objPreview = safeStr(parts[0]).replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 42) + "…";
                        const thoughtPreview = parts[1] ? "💭 " + safeStr(parts[1]).replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 44) + "…" : "";

                        let pctForBadge = (it.pct !== null && it.pct !== undefined) ? it.pct : safeNum(curVars.核心数值?.淫乱恶堕, 0);
                        const isRev = (it.editKey === "shame" || it.editKey === "sta");
                        const lvNum = tier6(pctForBadge, isRev) + 1;

                        b.innerHTML = `
                            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;overflow:hidden;">
                                ${it.keyHTML}${it.barHTML || ""}
                                <div style="font-size:11px;color:${tc.sub};margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${objPreview}</div>
                                ${thoughtPreview ? `<div style="font-size:11px;color:#ffd6e7;font-style:italic;background:rgba(243,139,168,0.12);padding:3px 7px;border-radius:6px;border-left:2.5px solid #f38ba8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${thoughtPreview}</div>` : ""}
                            </div>
                            <div class="st-card-thumb-wrap" title="点击直接全屏看大图" style="display:none;position:relative;width:70px;height:70px;border-radius:10px;overflow:hidden;border:1.5px solid ${lvNum === 6 ? "#fde047" : tc.prim};flex-shrink:0;background:#0d0914;box-shadow:0 3px 10px rgba(0,0,0,0.65);">
                                <img class="st-card-thumb-img" style="width:100%;height:100%;object-fit:cover;display:block;">
                                <span style="position:absolute;bottom:0;right:0;background:${lvNum === 6 ? "linear-gradient(90deg,#f59e0b,#ff0055)" : "rgba(0,0,0,0.75)"};color:#fff;font-size:9.5px;font-weight:900;padding:1px 5px;border-top-left-radius:6px;">Lv.${lvNum}</span>
                            </div>`;
                        b.onclick = (e) => { e.stopPropagation(); showDetailPopup(idx); };
                        list.appendChild(b);

                        const cands = getStageImageCandidates(it);
                        if (cands.length > 0) {
                            const thumbWrap = b.querySelector(".st-card-thumb-wrap");
                            const thumbImg = b.querySelector(".st-card-thumb-img");
                            let tIdx = 0;
                            thumbImg.onload = () => { thumbWrap.style.display = "block"; };
                            thumbWrap.onclick = (ev) => {
                                ev.stopPropagation();
                                openTrueFullscreenImage(thumbImg.src);
                            };
                            thumbImg.onerror = () => {
                                tIdx++;
                                if (tIdx < cands.length) thumbImg.src = cands[tIdx];
                                else thumbWrap.style.display = "none";
                            };
                            thumbImg.src = cands[0];
                        }
                    });

                    const addBtn = document.createElement("button");
                    addBtn.type = "button";
                    addBtn.style.cssText = `margin-top:4px;padding:10px;border-radius:11px;border:1.5px dashed ${tc.prim};background:rgba(243,139,168,0.1);color:#f9e2af;font-weight:bold;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;`;
                    addBtn.innerHTML = `➕ 在【${cat.title}】下新增自定义按钮 (支持 📁相册选图 / ✨AI补全)`;
                    addBtn.onclick = (e) => {
                        e.stopPropagation();
                        openAddCustomItemModal(cat.title);
                    };
                    list.appendChild(addBtn);

                    body.appendChild(list);
                }
            } catch (renderErr) {
                showDiagnosticError("界面渲染引擎 (renderBody)", renderErr);
            }
        }

        // =========================================================================
        // 🧩 扩展管理菜单：正式定名为「📊 状态栏1.0」
        // =========================================================================
        function mountExtensionSettingsMenu() {
            const container = document.getElementById("extensions_settings") || document.getElementById("extensions_settings2");
            if (!container || document.getElementById("st-v10-ext-drawer")) return;
            document.getElementById("st-v28-ext-drawer")?.remove();
            document.getElementById("st-v27-ext-drawer")?.remove();
            document.getElementById("st-v26-ext-drawer")?.remove();

            const drawer = document.createElement("div");
            drawer.id = "st-v10-ext-drawer";
            drawer.style.cssText = "margin-bottom:8px;border:1px solid rgba(243,139,168,0.35);border-radius:8px;overflow:hidden;background:rgba(0,0,0,0.2);";
            drawer.innerHTML = `
                <div id="st-v10-ext-header" style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;cursor:pointer;user-select:none;background:rgba(243,139,168,0.12);">
                    <b style="color:#f5c2e7;font-size:13.5px;">📊 状态栏1.0</b>
                    <span id="st-v10-ext-arrow" style="color:#f38ba8;font-weight:bold;">▼ 展开设置</span>
                </div>
                <div id="st-v10-ext-content" style="display:none;padding:12px;font-size:13px;border-top:1px solid rgba(255,255,255,0.1);">
                    <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;">
                        <input id="st-v10-ext-enable" type="checkbox" ${userSettings.enabled ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                        <span><b>启用「👑 主角 · 状态栏」悬浮窗与后台变量注入</b></span>
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;cursor:pointer;">
                        <input id="st-v10-ext-hide" type="checkbox" ${userSettings.hideRawBlock ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                        <span>自动折叠隐藏聊天正文尾部的原始【状态栏】与代码文本</span>
                    </label>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button id="st-v10-ext-open" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">👑 重新开启并呼出主角状态栏</button>
                    </div>
                </div>`;
            container.appendChild(drawer);

            const header = drawer.querySelector("#st-v10-ext-header");
            const content = drawer.querySelector("#st-v10-ext-content");
            const arrow = drawer.querySelector("#st-v10-ext-arrow");

            header.addEventListener("click", (e) => {
                e.stopPropagation();
                const isHidden = content.style.display === "none";
                content.style.display = isHidden ? "block" : "none";
                arrow.textContent = isHidden ? "▲ 收起设置" : "▼ 展开设置";
            });

            drawer.querySelector("#st-v10-ext-enable").addEventListener("change", (e) => {
                userSettings.enabled = e.target.checked;
                saveSettings();
                if (userSettings.enabled) {
                    if (!document.getElementById("st-v5-root")) mountUI();
                    recalc(false);
                    applyThemeAndSize();
                    showToast("✅ 状态栏1.0 已开启！", "success", 2000);
                } else {
                    if (typeof setExtensionPrompt === "function") {
                        setExtensionPrompt(EXT_ID, "", extension_prompt_types?.IN_CHAT ?? 1, 0);
                    }
                    document.getElementById("st-v25-fullscreen-lightbox")?.remove();
                    document.getElementById("st-v5-root")?.remove();
                    showToast("🔴 状态栏1.0 已关闭退出！", "warn", 2000);
                }
            });

            drawer.querySelector("#st-v10-ext-hide").addEventListener("change", (e) => {
                userSettings.hideRawBlock = e.target.checked;
                saveSettings(); cleanAll(true);
            });

            drawer.querySelector("#st-v10-ext-open").addEventListener("click", (e) => {
                e.stopPropagation();
                userSettings.enabled = true;
                const chk = document.getElementById("st-v10-ext-enable");
                if (chk) chk.checked = true;
                saveSettings();
                if (!document.getElementById("st-v5-root")) {
                    mountUI();
                    recalc(false);
                }
                applyThemeAndSize();
                const panel = document.getElementById("st-v5-panel");
                if (panel) { panel.style.display = "flex"; renderBody(); }
                showToast("👑 主角状态栏已呼出！", "success", 2000);
            });
        }

        function mountUI() {
            loadSettings();
            injectCustomStyles();
            document.getElementById("st-v5-root")?.remove();
            if (!userSettings.enabled) return;

            const root = document.createElement("div");
            root.id = "st-v5-root";
            root.style.cssText = `position:fixed;top:65px;right:12px;z-index:2147483646;font-family:'Microsoft YaHei',sans-serif;display:block;`;
            root.innerHTML = `
            <div style="display:flex;justify-content:flex-end;align-items:center;">
                <button id="st-v5-toggle" type="button" style="background:linear-gradient(135deg,#f38ba8,#cba6f7);color:#11111b;border:none;font-weight:900;font-size:13.5px;padding:8px 16px;border-radius:99px;cursor:grab;user-select:none;touch-action:none;box-shadow:0 6px 20px rgba(243,139,168,0.6);">
                    <span id="st-v5-btn-txt">👑 主角 · 状态栏</span>
                </button>
            </div>
            <div id="st-v5-panel" class="st-theme-succubus" style="display:none;position:relative;margin-top:8px;width:${userSettings.width}px;height:${userSettings.height}px;min-width:310px;min-height:360px;max-width:96vw;max-height:86vh;background:linear-gradient(165deg,#181424,#1e192b);border:2px solid #f38ba8;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.92);color:#ede6f2;flex-direction:column;overflow:hidden;backdrop-filter:blur(12px);">
                <div id="st-v5-header" style="display:flex;justify-content:space-between;align-items:center;padding:9px 10px;background:rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.12);cursor:grab;user-select:none;touch-action:none;flex-shrink:0;gap:4px;">
                    <b id="st-v5-title" style="color:#f5c2e7;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">主角档案</b>
                    <div style="display:flex;gap:4px;align-items:center;flex-shrink:0;">
                        <button id="st-v5-clear-btn" type="button" title="一键清空当前角色卡缓存并按总账重新校准数值" style="background:rgba(239,68,68,0.22);color:#fca5a5;border:1px solid rgba(239,68,68,0.55);border-radius:7px;padding:3px 6px;cursor:pointer;font-size:10.5px;font-weight:bold;">🧹清缓存</button>
                        <button id="st-v5-cfg-btn" type="button" title="打开设置（调节难度 / 导入图包 / 5大高定主题 / 副API）" style="background:rgba(255,255,255,0.14);color:#fff;border:1px solid rgba(255,255,255,0.28);border-radius:7px;padding:3px 6px;cursor:pointer;font-size:10.5px;font-weight:bold;">⚙️设置/主题</button>
                        <button id="st-v5-exit-btn" type="button" title="彻底关闭整个插件" style="background:rgba(220,38,38,0.85);color:#fff;border:1px solid #fca5a5;border-radius:7px;padding:3px 6px;cursor:pointer;font-size:10.5px;font-weight:bold;">🔴退出</button>
                        <span id="st-v5-close" title="仅收起面板" style="cursor:pointer;color:#f38ba8;font-size:15px;font-weight:bold;padding:0 3px;">✕</span>
                    </div>
                </div>
                <div style="display:flex;flex:1;min-height:260px;overflow:hidden;">
                    <div id="st-v5-tabs" style="width:62px;display:flex;flex-direction:column;gap:5px;overflow-y:auto;padding:7px 5px;background:rgba(0,0,0,0.4);border-right:1px solid rgba(255,255,255,0.08);flex-shrink:0;"></div>
                    <div id="st-v5-body" style="padding:10px;overflow-y:auto;flex:1;min-height:240px;"></div>
                </div>
                <div id="st-v12-resize-r" style="position:absolute;top:40px;right:0;width:7px;bottom:18px;cursor:ew-resize;z-index:40;"></div>
                <div id="st-v12-resize-b" style="position:absolute;left:0;right:18px;bottom:0;height:7px;cursor:ns-resize;z-index:40;"></div>
                <div id="st-v12-resize-rb" style="position:absolute;right:0;bottom:0;width:20px;height:20px;cursor:nwse-resize;z-index:45;display:flex;align-items:flex-end;justify-content:flex-end;padding:3px;color:#f38ba8;font-size:11px;user-select:none;">◢</div>
                <div id="st-v6-detail-modal" style="display:none;position:absolute;inset:0;background:rgba(10,8,16,0.96);z-index:50;flex-direction:column;justify-content:center;padding:12px;">
                    <div style="background:linear-gradient(160deg,#251d38,#1b152a);border:1.5px solid #f38ba8;border-radius:14px;padding:12px;max-height:95%;display:flex;flex-direction:column;gap:7px;box-shadow:0 12px 36px rgba(0,0,0,0.85);">
                        <div id="st-v6-det-title"></div>
                        <div id="st-v6-det-bar"></div>
                        <div id="st-v6-det-desc" style="color:#ede6f2;font-size:12.5px;line-height:1.74;overflow-y:auto;white-space:pre-wrap;word-break:break-word;padding:6px 2px;border-top:1px solid rgba(243,139,168,0.22);border-bottom:1px solid rgba(243,139,168,0.22);flex:1;"></div>
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:5px;padding-top:2px;flex-wrap:wrap;">
                            <div style="display:flex;gap:5px;align-items:center;">
                                <button id="st-v6-prev" type="button" style="background:rgba(203,166,247,0.2);border:1px solid rgba(203,166,247,0.45);color:#f5c2e7;border-radius:8px;padding:4px 8px;font-size:11px;cursor:pointer;font-weight:bold;">⬅ 上项</button>
                                <button id="st-v6-next" type="button" style="background:rgba(203,166,247,0.2);border:1px solid rgba(203,166,247,0.45);color:#f5c2e7;border-radius:8px;padding:4px 8px;font-size:11px;cursor:pointer;font-weight:bold;">下项 ➔</button>
                            </div>
                            <span id="st-v6-det-page" style="font-size:10.5px;color:#a6adc8;"></span>
                            <div style="display:flex;gap:5px;align-items:center;">
                                <button id="st-v6-edit-toggle" type="button" style="background:rgba(249,226,175,0.22);border:1px solid #f9e2af;color:#f9e2af;border-radius:8px;padding:4px 8px;font-size:11px;cursor:pointer;font-weight:bold;">✏️ 编辑/配图</button>
                                <button id="st-v6-det-close" type="button" style="background:rgba(243,139,168,0.25);border:1px solid #f38ba8;color:#fff;border-radius:8px;padding:4px 8px;font-size:11px;cursor:pointer;font-weight:bold;">关闭 ✕</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            document.body.appendChild(root);
            mountExtensionSettingsMenu();

            const panel = document.getElementById("st-v5-panel"), toggleBtn = document.getElementById("st-v5-toggle"), headerBar = document.getElementById("st-v5-header");

            function bindDirectDrag(handleEl, onClickCallback) {
                let isDown = false, moved = false, sx = 0, sy = 0, ir = 12, it = 65;
                handleEl.addEventListener("pointerdown", (e) => {
                    if (e.target.closest("#st-v5-close") || e.target.closest("#st-v5-cfg-btn") || e.target.closest("#st-v5-clear-btn") || e.target.closest("#st-v5-exit-btn")) return;
                    isDown = true; moved = false; sx = e.clientX; sy = e.clientY;
                    const rect = root.getBoundingClientRect(); ir = window.innerWidth - rect.right; it = rect.top;
                    handleEl.style.cursor = "grabbing"; handleEl.setPointerCapture?.(e.pointerId);
                });
                handleEl.addEventListener("pointermove", (e) => {
                    if (!isDown) return;
                    const dx = e.clientX - sx, dy = e.clientY - sy;
                    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
                    if (moved) {
                        root.style.right = Math.max(4, Math.min(window.innerWidth - 90, ir - dx)) + "px";
                        root.style.top = Math.max(4, Math.min(window.innerHeight - 48, it + dy)) + "px";
                    }
                });
                handleEl.addEventListener("pointerup", (e) => {
                    if (!isDown) return;
                    isDown = false; handleEl.style.cursor = "grab"; handleEl.releasePointerCapture?.(e.pointerId);
                    if (!moved && typeof onClickCallback === "function") onClickCallback();
                });
            }

            function bindResizeHandle(el, mode) {
                let resizing = false, sx = 0, sy = 0, sw = 0, sh = 0;
                el.addEventListener("pointerdown", (e) => {
                    e.stopPropagation(); resizing = true; sx = e.clientX; sy = e.clientY;
                    sw = panel.offsetWidth; sh = panel.offsetHeight; el.setPointerCapture?.(e.pointerId);
                });
                el.addEventListener("pointermove", (e) => {
                    if (!resizing) return;
                    const dx = e.clientX - sx, dy = e.clientY - sy;
                    if (mode === "r" || mode === "rb") { userSettings.width = Math.max(330, Math.min(920, sw + dx)); panel.style.width = userSettings.width + "px"; }
                    if (mode === "b" || mode === "rb") { userSettings.height = Math.max(360, Math.min(920, sh + dy)); panel.style.height = userSettings.height + "px"; }
                });
                el.addEventListener("pointerup", (e) => {
                    if (!resizing) return;
                    resizing = false; el.releasePointerCapture?.(e.pointerId); saveSettings();
                });
            }
            bindResizeHandle(document.getElementById("st-v12-resize-r"), "r");
            bindResizeHandle(document.getElementById("st-v12-resize-b"), "b");
            bindResizeHandle(document.getElementById("st-v12-resize-rb"), "rb");

            bindDirectDrag(toggleBtn, () => {
                panel.style.display = (panel.style.display === "none") ? "flex" : "none";
                if (panel.style.display === "flex") renderBody();
            });
            bindDirectDrag(headerBar, null);

            const clearBtn = document.getElementById("st-v5-clear-btn");
            if (clearBtn) {
                clearBtn.onclick = (e) => {
                    e.stopPropagation();
                    try {
                        localStorage.removeItem(getChatStoreKey());
                        localStorage.removeItem(`${EXT_ID}_v28_cache_${safeCtx()?.chatId || "default_chat"}`);
                        localStorage.removeItem(`${EXT_ID}_v27_cache_${safeCtx()?.chatId || "default_chat"}`);
                    } catch (err) {}
                    curVars = getInitialVars();
                    recalc(false);
                    inSettings = false;
                    renderBody();
                    showToast("🧹 已清空此卡旧缓存并按总账次数与当前难度重新校准！", "success", 2800);
                };
            }

            document.getElementById("st-v5-cfg-btn").onclick = () => { inSettings = !inSettings; renderBody(); };
            document.getElementById("st-v5-close").onclick = () => { panel.style.display = "none"; };

            const exitBtn = document.getElementById("st-v5-exit-btn");
            if (exitBtn) {
                exitBtn.onclick = (e) => {
                    e.stopPropagation();
                    userSettings.enabled = false;
                    saveSettings();
                    const extChk = document.getElementById("st-v10-ext-enable");
                    if (extChk) extChk.checked = false;
                    if (typeof setExtensionPrompt === "function") {
                        setExtensionPrompt(EXT_ID, "", extension_prompt_types?.IN_CHAT ?? 1, 0);
                    }
                    document.getElementById("st-v25-fullscreen-lightbox")?.remove();
                    document.getElementById("st-v5-root")?.remove();
                    showToast("🔴 状态栏1.0 已彻底关闭退出！", "warn", 3500);
                };
            }

            document.getElementById("st-v6-det-close").onclick = () => { document.getElementById("st-v6-detail-modal").style.display = "none"; };
            document.getElementById("st-v6-detail-modal").onclick = (e) => { if (e.target.id === "st-v6-detail-modal") e.currentTarget.style.display = "none"; };
            document.getElementById("st-v6-prev").onclick = (e) => {
                e.stopPropagation();
                const d = (latestStatus && latestStatus.categories?.length) ? latestStatus : getFallbackData();
                const cat = activeCat !== null ? d.categories[activeCat] : null;
                if (cat && cat.items.length) showDetailPopup((curDetailIdx - 1 + cat.items.length) % cat.items.length);
            };
            document.getElementById("st-v6-next").onclick = (e) => {
                e.stopPropagation();
                const d = (latestStatus && latestStatus.categories?.length) ? latestStatus : getFallbackData();
                const cat = activeCat !== null ? d.categories[activeCat] : null;
                if (cat && cat.items.length) showDetailPopup((curDetailIdx + 1) % cat.items.length);
            };
            renderBody();
        }

        function applySetStatements(text, targetVars) {
            if (!text || !text.includes("_.set")) return;
            const regex = /_\.set\(\s*(?:(['"`])([^'"`]+)\1|([^,]+?))\s*,\s*([\s\S]*?)\)\s*;?(?=\s*(?:_\.set|<\/UpdateVariable>|$))/g;
            let m;
            while ((m = regex.exec(text)) !== null) {
                const rawPath = safeStr(m[2] || m[3]).trim(), rawVal = safeStr(m[4]).trim();
                if (!rawPath) continue;
                try {
                    let val;
                    if (/^-?\d+(?:\.\d+)?$/.test(rawVal)) val = Number(rawVal);
                    else if (rawVal === "true" || rawVal === "false") val = rawVal === "true";
                    else if ((rawVal.startsWith("'") && rawVal.endsWith("'")) || (rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("`") && rawVal.endsWith("`"))) {
                        val = rawVal.slice(1, -1);
                    } else {
                        val = Function(`"use strict";return (${rawVal});`)();
                    }
                    const ps = rawPath.split(".").map(s => s.trim()).filter(Boolean);
                    if (ps.length > 1 && !Object.prototype.hasOwnProperty.call(targetVars, ps[0])) {
                        const prefixName = ps[0];
                        const ctxName1 = safeCtx()?.name1 || "";
                        if (prefixName && prefixName !== ctxName1 && prefixName.length <= 12) {
                            targetVars.档案.当前认知名字 = prefixName;
                        }
                        ps.shift();
                    }

                    let cur = targetVars;
                    for (let j = 0; j < ps.length - 1; j++) {
                        if (cur[ps[j]] === undefined || typeof cur[ps[j]] !== "object") cur[ps[j]] = {};
                        cur = cur[ps[j]];
                    }
                    if (cur && ps.length > 0) cur[ps[ps.length - 1]] = val;
                } catch (e) {}
            }
        }

        function parseInlineStatusBarText(text, targetVars) {
            if (!text) return;

            // 支持抓取 <think_nya> 或正文中的关键初始设定（如 17ml浓精、宫腔15ml、阴道2ml、恶堕76%、服从74% 等）
            const grabNum = (reg) => { const m = text.match(reg); return m ? Number(m[1]) : null; };

            const cock = grabNum(/对肉棒的好感度[：:]\s*(\d+)/); if (cock !== null) targetVars.核心数值.对肉棒好感度 = cock;
            const lust = grabNum(/性欲程度[：:]\s*(\d+)/); if (lust !== null) targetVars.核心数值.性欲程度 = lust;
            const corr = grabNum(/(?:淫乱与?恶堕(?:程度)?|恶堕)[：:\s]*(\d+)%?/); if (corr !== null) targetVars.核心数值.淫乱恶堕 = corr;
            const shame = grabNum(/羞耻度[：:]\s*(\d+)/); if (shame !== null) targetVars.精神与心理.羞耻度 = shame;
            const obey = grabNum(/服从(?:度)?[：:\s]*(\d+)%?/); if (obey !== null) targetVars.精神与心理.服从度 = obey;
            const fall = grabNum(/沦陷度[：:]\s*(\d+)/); if (fall !== null) targetVars.精神与心理.沦陷度 = fall;
            const pleas = grabNum(/快感累积[：:]\s*(\d+)/); if (pleas !== null) targetVars.精神与心理.快感累积 = pleas;
            const awake = grabNum(/意识清醒度[：:]\s*(\d+)/); if (awake !== null) targetVars.精神与心理.意识清醒度 = awake;
            const brk = grabNum(/人格崩解度[：:]\s*(\d+)/); if (brk !== null) targetVars.精神与心理.人格崩解度 = brk;
            const sta = grabNum(/体力(?:与脱力)?[：:]\s*(\d+)/); if (sta !== null) targetVars.身体.体力 = sta;

            const mMouth = grabNum(/口[：:\s]*(\d+)/); if (mMouth !== null && text.includes("【状态栏")) targetVars.计数.性交.口 = mMouth;
            const mVag = grabNum(/小穴[：:\s]*(\d+)/); if (mVag !== null && text.includes("【状态栏")) targetVars.计数.性交.小穴 = mVag;
            const mAnal = grabNum(/屁眼[：:\s]*(\d+)/); if (mAnal !== null && text.includes("【状态栏")) targetVars.计数.性交.屁眼 = mAnal;
            const mFoot = grabNum(/足腿[：:\s]*(\d+)/); if (mFoot !== null && text.includes("【状态栏")) targetVars.计数.性交.足腿 = mFoot;
            const mOrg = grabNum(/高潮(?:总数)?[：:]\s*(\d+)/); if (mOrg !== null && text.includes("【状态栏")) targetVars.计数.高潮.总数 = mOrg;
            const mCrm = grabNum(/内射[：:\s]*(\d+)/); if (mCrm !== null && text.includes("【状态栏")) targetVars.计数.射精.内射 = mCrm;
            const mFac = grabNum(/颜射(?:体外)?[：:\s]*(\d+)/); if (mFac !== null && text.includes("【状态栏")) targetVars.计数.射精.颜射体外 = mFac;
            const mSwal = grabNum(/(?:饮精)?吞精[：:\s]*(\d+)/); if (mSwal !== null && text.includes("【状态栏")) targetVars.计数.精液摄入.吞精次数 = mSwal;
            const mSwalMl = grabNum(/累计摄入[：:\s]*(\d+)ml/); if (mSwalMl !== null) targetVars.计数.精液摄入.累计毫升 = mSwalMl;
            const mMast = grabNum(/自慰[：:]\s*(\d+)/); if (mMast !== null && text.includes("【状态栏")) targetVars.计数.自慰 = mMast;
            const mExp = grabNum(/露出[：:\s]*(\d+)/); if (mExp !== null && text.includes("【状态栏")) targetVars.计数.暴露.露出 = mExp;
            const mHook = grabNum(/接客(?:卖身)?[：:\s]*(\d+)/); if (mHook !== null && text.includes("【状态栏")) targetVars.计数.交易.接客卖身 = mHook;

            // 自动识别如“宫腔15ml、阴道2ml”或“十五毫升的滚烫浓精...残留着两毫升精液的阴道”
            const wombMlMatch = text.match(/(?:宫腔|宫内|射入的约?)\s*(\d+)\s*(?:毫升|ml)/i);
            if (wombMlMatch) targetVars.体内精液存量.子宫毫升 = Number(wombMlMatch[1]);
            else if (/十五毫升.{0,12}宫腔/.test(text)) targetVars.体内精液存量.子宫毫升 = 15;

            const vagMlMatch = text.match(/阴道\s*(\d+)\s*(?:毫升|ml)/i);
            if (vagMlMatch) targetVars.体内精液存量.小穴毫升 = Number(vagMlMatch[1]);
            else if (/两毫升精液的阴道/.test(text)) targetVars.体内精液存量.小穴毫升 = 2;

            // 若检测到暗娼/妓女设定且总账全0，自动赋予符合第3阶段(49/100)熟稔名器的历史基数
            if ((/暗娼|妓女|常年的接客/.test(text)) && safeNum(targetVars.计数.交易.接客卖身) === 0) {
                targetVars.计数.交易.接客卖身 = Math.round(42 * getDifficultyProfile().mult);
                targetVars.计数.性交.小穴 = Math.round(48 * getDifficultyProfile().mult);
                targetVars.计数.射精.内射 = Math.round(35 * getDifficultyProfile().mult);
                targetVars.计数.性交.口 = Math.round(25 * getDifficultyProfile().mult);
                targetVars.计数.高潮.总数 = Math.round(30 * getDifficultyProfile().mult);
                targetVars.身体.体力 = 68;
            }
        }

        function cleanDOM(id, force = false) {
            if (!userSettings.hideRawBlock) return;
            const el = document.querySelector(`.mes[mesid="${id}"] .mes_text`);
            if (!el) return;
            const rawMes = safeStr(safeCtx()?.chat?.[Number(id)]?.mes);
            const sig = `${rawMes.length}_${el.innerHTML.includes("st-ext-inline-trigger")}`;
            if (!force && el.getAttribute("data-st-cleaned") === sig) return;

            let h = el.innerHTML, changed = false;
            const lt = "&" + "lt;", gt = "&" + "gt;";
            const gameReg = new RegExp(`${lt}\\/?game${gt}|<\\/?game>`, "gi");
            const uvReg = new RegExp(`(?:${lt}|<)UpdateVariable(?:${gt}|>)[\\s\\S]*?(?:${lt}|<)\\/UpdateVariable(?:${gt}|>)`, "gi");

            if (gameReg.test(h)) { h = h.replace(gameReg, ""); changed = true; }
            if (/UpdateVariable|_\.set\s*\(/i.test(h) && !h.includes("st-hidden-uv")) {
                h = h.replace(uvReg, m => `<div class="st-hidden-uv" style="display:none!important">${m}</div>`)
                     .replace(/_\.set\([^\n<]*?\)\s*;?\s*(?:<br\s*\/?>)?/gi, m => `<span class="st-hidden-uv" style="display:none!important">${m}</span>`);
                changed = true;
            }
            if ((h.includes("【状态栏") || h.includes("[[角色档案]]") || h.includes("[[档案与肉体]]") || rawMes.includes("【状态栏")) && !h.includes("st-ext-inline-trigger")) {
                h = h.replace(/<details[^>]*>\s*<summary>[^<]*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】/gi, m => `<div style="display:none!important">${m}</div>`)
                     .replace(/(?:<p>\s*)?【\s*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】(?:\s*<\/p>)?/gi, m => `<div style="display:none!important">${m}</div>`)
                     .replace(/【\s*状态栏[\s\S]*$/gi, m => `<div style="display:none!important">${m}</div>`);
                h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 打开此层 (#${id}) 主角状态栏</div>`;
                changed = true;
            }
            isCleaningDOM = true;
            if (changed) el.innerHTML = h;
            el.setAttribute("data-st-cleaned", `${rawMes.length}_${el.innerHTML.includes("st-ext-inline-trigger")}`);
            isCleaningDOM = false;
        }

        function cleanAll(force = false) {
            if (isCleaningDOM) return;
            isCleaningDOM = true;
            try {
                const nodes = document.querySelectorAll(".mes");
                const start = force ? 0 : Math.max(0, nodes.length - 25);
                for (let idx = start; idx < nodes.length; idx++) {
                    const i = nodes[idx].getAttribute("mesid");
                    if (i !== null) cleanDOM(i, force);
                }
            } finally { isCleaningDOM = false; }
        }

        function scheduleCleanAll() {
            if (isCleaningDOM) return;
            if (cleanTimer) clearTimeout(cleanTimer);
            cleanTimer = setTimeout(() => cleanAll(false), 180);
        }

        // =========================================================================
        // 🔄 核心重算引擎 recalc（逐层回放 + 自然代谢 + 楼层精准对齐回滚）
        // =========================================================================
        function recalc(notifyCardSwitch = false) {
            try {
                mountExtensionSettingsMenu();
                if (!userSettings.enabled) return;

                const ctx = safeCtx(), fv = getInitialVars();
                const curCardKey = `${ctx?.characterId ?? "none"}_${ctx?.chatId ?? "none"}`;

                if (!checkCardAvailable(true)) {
                    curVars = fv;
                    latestStatus = getFallbackData();
                    renderBody();
                    if (notifyCardSwitch && curCardKey !== lastKnownCardKey) {
                        lastKnownCardKey = curCardKey;
                        showToast("⚠️ 当前未选择任何角色卡或聊天记录为空，状态栏进入待机状态", "warn", 3500);
                    }
                    return;
                }

                const chat = ctx?.chat || [];
                for (let i = 0; i < chat.length; i++) {
                    const t = safeStr(chat[i]?.mes);
                    parseInlineStatusBarText(t, fv);
                    if (t.includes("_.set(")) applySetStatements(t, fv);
                    applyNaturalMetabolism(t, fv);
                }

                const cached = loadChatCache();
                if (cached) mergeUserCustomizations(fv, cached, chat.length);

                calibrateMentalMetrics(fv);

                curVars = fv;
                const protagName = detectProtagonistName(fv);
                const realId = detectRealCharacterIdentity(fv);
                latestStatus = getFallbackData();
                if (chat.length > 0) latestStatus.floorId = chat.length - 1;

                if (notifyCardSwitch && curCardKey !== lastKnownCardKey) {
                    lastKnownCardKey = curCardKey;
                    showToast(`🔄 已切换角色卡：【${ctx?.name2 || "当前角色"}】｜主角：【${protagName} (${realId})】`, "info", 3800);
                } else if (!lastKnownCardKey) {
                    lastKnownCardKey = curCardKey;
                }

                if (typeof setExtensionPrompt === "function") {
                    setExtensionPrompt(EXT_ID, userSettings.enabled ? buildFullSystemPrompt(protagName, fv) : "", extension_prompt_types?.IN_CHAT ?? 1, 0);
                }
                renderBody();
            } catch (e) {
                showDiagnosticError("重算与反向注入引擎 (recalc)", e);
            }
        }

        loadSettings();
        loadAllImportedImagesToMemory().then(() => {
            if (userSettings.enabled) {
                mountUI();
                recalc(false);
            }
        });

        setInterval(() => {
            try {
                mountExtensionSettingsMenu();
                if (!userSettings.enabled) return;

                if (!document.getElementById("st-v5-root")) {
                    mountUI();
                    recalc(false);
                } else {
                    const root = document.getElementById("st-v5-root");
                    const rect = root.getBoundingClientRect();
                    if (rect.right < 40 || rect.top < 0 || rect.top > window.innerHeight - 30) {
                        root.style.right = "12px";
                        root.style.top = "65px";
                    }
                }
            } catch (e) {}
        }, 2200);

        document.addEventListener("click", e => {
            const trg = e.target.closest(".st-ext-inline-trigger");
            if (trg) {
                if (!userSettings.enabled) {
                    userSettings.enabled = true;
                    saveSettings();
                    const extChk = document.getElementById("st-v10-ext-enable");
                    if (extChk) extChk.checked = true;
                }
                if (!document.getElementById("st-v5-root")) mountUI();
                recalc(false);
                activeCat = null; inSettings = false; renderBody();
                const p = document.getElementById("st-v5-panel");
                if (p) p.style.display = "flex";
            }
        });

        (async function initTavernHooks() {
            try { extMod = await import("/scripts/extensions.js"); } catch (e) {}
            try { scriptMod = await import("/script.js"); } catch (e) {}
            eventSource = scriptMod.eventSource;
            event_types = scriptMod.event_types;
            setExtensionPrompt = scriptMod.setExtensionPrompt;
            extension_prompt_types = scriptMod.extension_prompt_types;

            if (eventSource && event_types) {
                eventSource.on(event_types.CHAT_CHANGED, () => {
                    activeCat = null; latestStatus = null;
                    setTimeout(() => { recalc(true); cleanAll(false); }, 220);
                });
                eventSource.on(event_types.MESSAGE_RECEIVED, i => setTimeout(() => {
                    if (!userSettings.enabled) return;
                    recalc(false); cleanDOM(i, true);
                    if (userSettings.apiSyncEnabled) triggerSubApiUpdate();
                    else showToast(`📊 主角【${detectProtagonistName(curVars)}】状态栏1.0已同步并注入正文铁律！`, "info", 2500);
                }, 180));
                eventSource.on(event_types.MESSAGE_UPDATED, i => setTimeout(() => { if (userSettings.enabled) recalc(false); cleanDOM(i, true); }, 120));
                eventSource.on(event_types.MESSAGE_DELETED, () => setTimeout(() => { if (userSettings.enabled) recalc(false); scheduleCleanAll(); }, 150));
                eventSource.on(event_types.GENERATION_STARTED, () => { if (userSettings.enabled) recalc(false); });
            }

            const chatEl = document.getElementById("chat");
            if (chatEl) {
                const obs = new MutationObserver(() => { if (!isCleaningDOM) scheduleCleanAll(); });
                obs.observe(chatEl, { childList: true, subtree: false });
            }
            setTimeout(() => { recalc(true); cleanAll(false); }, 300);
        })();

        // 标记整个 状态栏1.0 脚本已100%完整加载运行！
        window.__ST_V10_COMPLETE_FLAG__ = true;

    } catch (bootErr) {
        showDiagnosticError("脚本启动初始化异常 (bootErr)", bootErr, "请检查3段代码拼接处是否多粘了文字或漏了字符！");
    }
})();

