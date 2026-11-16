// == 状态栏1.1 (全器质崩坏畸变·终极完整增强版) ==
(function () {
    "use strict";
    const DIAG_ID = "st-v10-diag-radar";
    window.ST_V10_COMPLETE_FLAG = false;

    function showDiagnosticError(title, errObj, extraHint = "") {
        console.error(`[状态栏1.1] ${title}:`, errObj);
        let box = document.getElementById(DIAG_ID);
        if (!box) {
            box = document.createElement("div");
            box.id = DIAG_ID;
            box.style.cssText = "position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:2147483647;width:92vw;max-width:540px;background:linear-gradient(145deg,#450a0a,#1a0005);border:2px solid #ff4d6d;border-radius:12px;padding:12px 16px;color:#ffe5ec;font-family:Consolas,'Microsoft YaHei',monospace;font-size:12.5px;box-shadow:0 12px 40px rgba(255,0,60,0.85);line-height:1.55;word-break:break-all;";
            document.body?.appendChild(box);
        }
        const errMsg = errObj ? (errObj.message || String(errObj)) : "未知错误";
        const stackStr = errObj?.stack ? String(errObj.stack) : "";
        const lineMatch = stackStr.match(/:(\d+):(\d+)/);
        const locInfo = lineMatch ? `第 ${lineMatch[1]} 行，第 ${lineMatch[2]} 列` : "请检查代码末尾是否完整";

        box.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,77,109,0.5);padding:0 0 6px 0;margin-bottom:8px;">
                <b style="color:#ffccd5;font-size:14px;">🚨 状态栏1.1 异常提示</b>
                <button onclick="this.parentElement.parentElement.style.display='none'" style="background:#ff003c;color:#fff;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-weight:bold;">✕</button>
            </div>
            <div><b style="color:#fde047;">模块</b>：${title}</div>
            <div><b style="color:#fde047;">原因</b>：<span style="color:#fca5a5;">${errMsg}</span></div>
            <div><b style="color:#fde047;">位置</b>：<span style="color:#67e8f9;">${locInfo}</span></div>
            ${extraHint ? `<div style="margin-top:4px;color:#a6e3a1;">💡 ${extraHint}</div>` : ""}
        `;
        box.style.display = "block";
    }

    window.addEventListener("error", function (ev) {
        if (ev && (String(ev.filename || "").includes("status-bar") || String(ev.message || "").includes("st-v"))) {
            showDiagnosticError("运行时异常", ev.error || ev.message);
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
        // 📦 IndexedDB 本地图片库
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
                if (!window.indexedDB) return reject(new Error("不支持IndexedDB"));
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

        async function saveRawEntriesToImageDB(entriesObj) {
            if (!entriesObj || typeof entriesObj !== "object") return 0;
            const entries = Object.entries(entriesObj).filter(([k, v]) => k && typeof v === "string" && v.startsWith("data:"));
            if (!entries.length) return 0;
            const db = await openImageDB();
            const tx = db.transaction(IDB_STORE, "readwrite");
            const store = tx.objectStore(IDB_STORE);
            entries.forEach(([k, v]) => {
                const nk = normalizeImgKey(k);
                store.put(v, nk);
                importedImgCache.set(nk, v);
            });
            return new Promise((resolve) => {
                tx.oncomplete = () => resolve(entries.length);
                tx.onerror = () => resolve(0);
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
            if (eocdPos === -1) throw new Error("无效的 ZIP 文件");

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
        // 🎨 五大高定特色主题 + Lv.5/Lv.6 器质崩坏视觉污染特效 + CSS级 UpdateVariable 隐形
        // =========================================================================
        const THEMES = {
            "魅魔粉": {
                cls: "st-theme-succubus",
                bg: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26 38 C26 38 14 28 14 19 C14 14 19 11 26 17 C33 11 38 14 38 19 C38 28 26 38 26 38 Z' fill='none' stroke='rgba(243,139,168,0.08)' stroke-width='1.5'/%3E%3C/svg%3E"), radial-gradient(circle at 85% 12%, rgba(243,139,168,0.28), transparent 45%), linear-gradient(165deg, #261538 0%, #140b20 70%, #0b0612 100%)`,
                border: "2px solid #f38ba8", radius: "20px", shadow: "0 16px 48px rgba(243,139,168,0.45), inset 0 0 24px rgba(243,139,168,0.16)",
                prim: "#f38ba8", sec: "#cba6f7", text: "#fdf0f6", sub: "#d2bede",
                card: "linear-gradient(145deg, rgba(52,28,76,0.88), rgba(22,12,36,0.94))",
                cardBorder: "1.5px solid rgba(243,139,168,0.42)", hi: "rgba(243,139,168,0.26)",
                headerBg: "linear-gradient(90deg, rgba(243,139,168,0.28), rgba(203,166,247,0.12))",
                deco: "❦ 魅魔桃心暗纹"
            },
            "暗黑血浆": {
                cls: "st-theme-blood",
                bg: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L40 20 M20 0 L20 40 M10 10 L30 30 M30 10 L10 30' stroke='rgba(255,30,66,0.07)' stroke-width='1'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 0%, rgba(220,38,38,0.38), transparent 60%), linear-gradient(170deg, #1f0308 0%, #0d0103 100%)`,
                border: "3px double #ff1e42", radius: "4px", shadow: "0 20px 60px rgba(255,0,43,0.7), inset 0 0 34px rgba(153,27,27,0.55)",
                prim: "#ff2a4b", sec: "#fca5a5", text: "#ffe5ec", sub: "#e295a2",
                card: "linear-gradient(160deg, rgba(50,6,14,0.95), rgba(18,2,5,0.98))",
                cardBorder: "1px solid rgba(255,42,75,0.65)", hi: "rgba(255,42,75,0.35)",
                headerBg: "linear-gradient(90deg, rgba(153,27,27,0.6), rgba(35,4,9,0.85))",
                deco: "🩸 荆棘血十字纹"
            },
            "白浊深渊": {
                cls: "st-theme-semen",
                bg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='18' cy='18' r='6' fill='rgba(255,255,255,0.06)'/%3E%3Ccircle cx='46' cy='38' r='9' fill='rgba(165,243,252,0.05)'/%3E%3Ccircle cx='28' cy='48' r='4' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E"), radial-gradient(ellipse at top, rgba(255,255,255,0.24), transparent 55%), linear-gradient(175deg, #0f172a 0%, #1e1b4b 58%, #090d16 100%)`,
                border: "2.5px solid #a5f3fc", radius: "26px", shadow: "0 16px 52px rgba(165,243,252,0.4), inset 0 0 28px rgba(255,255,255,0.18)",
                prim: "#67e8f9", sec: "#e0e7ff", text: "#f8fafc", sub: "#cbd5e1",
                card: "linear-gradient(150deg, rgba(30,41,59,0.9), rgba(15,23,42,0.96))",
                cardBorder: "1.5px dashed rgba(165,243,252,0.52)", hi: "rgba(103,232,249,0.26)",
                headerBg: "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(103,232,249,0.18))",
                deco: "🥛 浓白挂壁流体"
            },
            "赛博调教": {
                cls: "st-theme-cyber",
                bg: `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 18 L36 18 M18 0 L18 36' stroke='rgba(0,245,212,0.08)' stroke-width='1'/%3E%3Crect x='15' y='15' width='6' height='6' fill='none' stroke='rgba(241,91,181,0.12)'/%3E%3C/svg%3E"), linear-gradient(160deg, #030712 0%, #0b162c 100%)`,
                border: "2px solid #00f5d4", radius: "2px", shadow: "0 0 40px rgba(0,245,212,0.55), inset 0 0 20px rgba(241,91,181,0.3)",
                prim: "#00f5d4", sec: "#f15bb5", text: "#e0fbfc", sub: "#90e0ef",
                card: "linear-gradient(135deg, rgba(10,25,47,0.95), rgba(2,12,27,0.98))",
                cardBorder: "1px solid #00f5d4", hi: "rgba(241,91,181,0.34)",
                headerBg: "linear-gradient(90deg, rgba(0,245,212,0.26), rgba(241,91,181,0.26))",
                deco: "⚡ 霓虹机甲切角"
            },
            "鎏金娼馆": {
                cls: "st-theme-brothel",
                bg: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 4 L44 24 L24 44 L4 24 Z' fill='none' stroke='rgba(251,191,36,0.08)' stroke-width='1.2'/%3E%3Ccircle cx='24' cy='24' r='5' fill='none' stroke='rgba(251,191,36,0.08)'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 8%, rgba(251,191,36,0.26), transparent 55%), linear-gradient(165deg, #29160c 0%, #120804 100%)`,
                border: "3px ridge #fbbf24", radius: "14px", shadow: "0 20px 55px rgba(245,158,11,0.45), inset 0 0 26px rgba(251,191,36,0.18)",
                prim: "#fde047", sec: "#fb923c", text: "#fef3c7", sub: "#dfc4a0",
                card: "linear-gradient(155deg, rgba(52,30,16,0.94), rgba(24,12,6,0.98))",
                cardBorder: "1.5px ridge rgba(251,191,36,0.58)", hi: "rgba(251,191,36,0.28)",
                headerBg: "linear-gradient(90deg, rgba(217,119,6,0.38), rgba(69,26,3,0.7))",
                deco: "👑 巴洛克金菱纹"
            }
        };

        function injectCustomStyles() {
            if (document.getElementById("st-v10-custom-css")) return;
            const style = document.createElement("style");
            style.id = "st-v10-custom-css";
            style.textContent = `
                /* 手机端流式生成前置隐藏：一旦出现 UpdateVariable 标签立即隐形 */
                UpdateVariable, updatevariable, .st-hidden-uv {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                }
                @keyframes stPulseGlow {
                    0%, 100% { box-shadow: 0 0 8px rgba(255, 0, 60, 0.75), inset 0 0 4px rgba(255, 255, 255, 0.35); }
                    50% { box-shadow: 0 0 18px rgba(255, 0, 60, 1), 0 0 26px rgba(136, 19, 55, 0.9), inset 0 0 8px rgba(255, 255, 255, 0.65); }
                }
                @keyframes stStage6GodGlow {
                    0%, 100% { box-shadow: 0 0 10px #f59e0b, 0 0 20px #ff0055, inset 0 0 8px #fde047; border-color: #fde047 !important; }
                    50% { box-shadow: 0 0 22px #ff0055, 0 0 36px #7e22ce, inset 0 0 14px #ffffff; border-color: #ff758f !important; }
                }
                @keyframes stCorruptCardPulse {
                    0%, 100% { border-color: #ff0055 !important; box-shadow: 0 0 14px rgba(255, 0, 85, 0.55), inset 0 0 18px rgba(153, 27, 27, 0.45) !important; }
                    50% { border-color: #fde047 !important; box-shadow: 0 0 24px rgba(255, 0, 85, 0.9), inset 0 0 28px rgba(220, 38, 38, 0.75) !important; }
                }
                @keyframes stHeartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.12); }
                }
                .st-v28-card {
                    transition: transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.16s ease, border-color 0.16s ease !important;
                    position: relative;
                }
                .st-v28-card:hover { transform: translateY(-2px); }

                /* 阶段5(重口崩坏)与阶段6(彻底畸变)卡片专属视觉污染背景 */
                .st-corrupted-card-lv5 {
                    background-image: radial-gradient(circle at 92% 15%, rgba(225, 29, 72, 0.28), transparent 48%), linear-gradient(155deg, rgba(69, 10, 20, 0.92), rgba(24, 6, 14, 0.96)) !important;
                    border-left: 4.5px solid #ff0055 !important;
                    box-shadow: 0 6px 20px rgba(225, 29, 72, 0.4), inset 0 0 15px rgba(225, 29, 72, 0.22) !important;
                }
                .st-corrupted-card-lv6 {
                    background-image: url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0 Q10 18 8 28 Q6 36 12 44 M28 0 Q32 14 26 26 Q22 36 30 44' fill='none' stroke='rgba(255,0,85,0.14)' stroke-width='2'/%3E%3C/svg%3E"), radial-gradient(circle at 85% 20%, rgba(255, 0, 85, 0.38), transparent 55%), linear-gradient(160deg, rgba(76, 5, 25, 0.96), rgba(15, 2, 8, 0.99)) !important;
                    animation: stCorruptCardPulse 2.2s infinite ease-in-out !important;
                }

                /* 1. 魅魔粉专属蕾丝桃心浮雕 */
                .st-theme-succubus .st-v28-card {
                    border-radius: 14px !important;
                    box-shadow: 0 6px 16px rgba(18, 8, 30, 0.65), inset 0 0 12px rgba(243, 139, 168, 0.1) !important;
                }
                .st-theme-succubus .st-v28-card::after {
                    content: "❦";
                    position: absolute;
                    top: 4px;
                    right: 8px;
                    font-size: 12px;
                    color: rgba(243, 139, 168, 0.28);
                    pointer-events: none;
                }

                /* 2. 暗黑血浆专属哥特猩红刻痕 */
                .st-theme-blood .st-v28-card {
                    border-left: 4.5px solid #ff003c !important;
                    border-right: 2px solid #7f1d1d !important;
                    border-radius: 3px !important;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.88), inset 0 1px 0 rgba(255, 77, 109, 0.3) !important;
                }
                .st-theme-blood .st-v28-card::after {
                    content: "🩸";
                    position: absolute;
                    top: 4px;
                    right: 7px;
                    font-size: 10px;
                    opacity: 0.35;
                    pointer-events: none;
                }

                /* 3. 白浊深渊专属乳白挂壁圆润水滴框 */
                .st-theme-semen .st-v28-card {
                    border-radius: 20px !important;
                    border-top: 2.5px solid rgba(255, 255, 255, 0.55) !important;
                    box-shadow: 0 8px 22px rgba(9, 13, 22, 0.8), inset 0 4px 12px rgba(255, 255, 255, 0.12) !important;
                }
                .st-theme-semen .st-v28-card::after {
                    content: "💧";
                    position: absolute;
                    top: 5px;
                    right: 9px;
                    font-size: 10px;
                    opacity: 0.35;
                    pointer-events: none;
                }

                /* 4. 赛博调教专属装甲切角与霓虹双色光边 */
                .st-theme-cyber {
                    box-shadow: 0 0 35px rgba(0, 245, 212, 0.5), inset 0 0 20px rgba(241, 91, 181, 0.35) !important;
                }
                .st-theme-cyber .st-v28-card {
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                    border-left: 4px solid #f15bb5 !important;
                    border-right: 2px solid #00f5d4 !important;
                    border-radius: 0 !important;
                    box-shadow: 0 0 14px rgba(0, 245, 212, 0.25) !important;
                }
                .st-theme-cyber .st-v28-card::after {
                    content: "⚡";
                    position: absolute;
                    top: 4px;
                    right: 8px;
                    font-size: 10px;
                    color: rgba(0, 245, 212, 0.4);
                    pointer-events: none;
                }

                /* 5. 鎏金娼馆专属巴洛克浮雕金框 */
                .st-theme-brothel .st-v28-card {
                    border: 2px ridge rgba(251, 191, 36, 0.72) !important;
                    border-radius: 10px !important;
                    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.8), inset 0 0 16px rgba(251, 191, 36, 0.14) !important;
                }
                .st-theme-brothel .st-v28-card::after {
                    content: "❖";
                    position: absolute;
                    top: 4px;
                    right: 8px;
                    font-size: 11px;
                    color: rgba(253, 224, 71, 0.35);
                    pointer-events: none;
                }

                .st-stage5-badge { animation: stPulseGlow 1.8s infinite ease-in-out; }
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
                .st-heart-beat { display: inline-block; animation: stHeartbeat 1.3s infinite ease-in-out; }
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

        function showToast(msg, type = "success", duration = 3000) {
            try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, "📊 状态栏1.1"); } catch (e) {}
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
            "easy":   { label: "🌸 轻度催情 (1x)", mult: 1.0,  short: "1x轻度" },
            "normal": { label: "🌙 标准黄油 (3x)", mult: 3.0,  short: "3x标准" },
            "hard":   { label: "🔥 硬核慢热 (8x)", mult: 8.0,  short: "8x硬核" },
            "hell":   { label: "💀 地狱调教 (20x)", mult: 20.0, short: "20x地狱" },
            "abyss":  { label: "👑 深渊神格 (50x)", mult: 50.0, short: "50x深渊" }
        };

        let userSettings = {
            enabled: true,
            hideRawBlock: true,
            theme: "魅魔粉",
            difficultyMode: "normal",
            worldBreakMode: "auto",
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
                const oldThemeMap = {
                    "魅魔粉 (默认)": "魅魔粉",
                    "暗黑血浆 (重口凌辱)": "暗黑血浆",
                    "白浊深渊 (催眠灌精)": "白浊深渊",
                    "赛博调教 (电击项圈)": "赛博调教",
                    "鎏金娼馆 (肉便器挂牌)": "鎏金娼馆"
                };
                if (oldThemeMap[userSettings.theme]) userSettings.theme = oldThemeMap[userSettings.theme];
                if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉";
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

            if (/修仙|仙子|圣女|剑仙|女帝|灵根|少宗主/.test(combined)) return "修真者";
            if (/魅魔|Succubus/i.test(combined)) return "魅魔之躯";
            if (/精灵|Elf/i.test(combined)) return "精灵之躯";
            if (/千金|大小姐|豪门|夫人|妻子|太太/.test(combined)) return "名门千金";
            if (/大学生|学妹|学姐|校花|学生/.test(combined)) return "在校学生";
            if (/少女|女生/.test(combined)) return "年轻少女";
            return "普通人类";
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

        // =========================================================================
        // 🌈 崩坏畸变全光谱：Lv.1 完好如初 ➡️ Lv.6 彻底崩坏畸变
        // =========================================================================
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
                emos: ["(˘•ω•˘)🛡️戒备排斥", "(￣_￣)🍆粘膜适应", "(⁄•⁄ω⁄•⁄)💓空虚渴求", "(º﹃º )👅跪舔崇拜", "(♡°▽°♡)🐶断根戒断", "♛(🤪🍆💀)脑干阳具寄生"]
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
                emos: ["( -_-)❄️清心克制", "(｡•́︿•̀｡)🌡️春情微燥", "(⸝⸝＞◡＜⸝⸝)🔥欲火焚身", "(🥵💦)🌋重度发骚", "(🤪🔥)♨️狂暴发情", "💥(🥵❤️‍🔥💀)下丘脑烧毁"]
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
                emos: ["(｡•̀ᴗ-)✨完好清白", "( ´•̥×•̥`)🌫️初度染尘", "(¬‿¬ )🍷食髓知味", "(淫▽淫)👠放荡娼妇", "(🤪🖤⛓️)🐷公用精盆", "💀(👁️‍🗨️🖤🔞)彻底崩坏肉坑"]
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
                emos: ["(⁄>⁄ω⁄<⁄)🍅羞愤自持", "(🫣💦)耳根滚烫", "( ˙-˙ )😐习以为常", "(😏👙)敞腿任看", "(🤪🐾)羞耻全灭", "📸(🤪✌️💀)羞耻神经坏死"]
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
                emos: ["( `^´ )⚔️孤高自主", "(´-ω-`)💧被动妥协", "( ´•̥ω•̥`)🙇温顺配合", "(▽・ω・▽)🐾摇尾乞怜", "(⛓️🐶💦)绝对盲从", "👑(🧎‍♀️👅💀)前额叶切除木偶"]
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
                emos: ["( ˘ω˘ )💤神思清明", "(😳⚡)尾椎微麻", "(🥺💓)趾尖蜷缩", "(🥵⚡💦)濒临绝顶", "(🤪⛲)潮吹失神", "⚡(翻白眼👅💀)多巴胺烧穿熔断"]
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
                emos: ["(・_・)🧠理智完好", "(°_° )🌀浅层恍惚", "(＠_＠;)💫催眠暗示", "(♡_♡)🎀常识改写", "(🤤💭)人格碎裂", "💖(👁️♡👁️💀)脑实质海绵化痴呆"]
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
                emos: ["(🌱)纯净无毒", "(😳🍷)微醺依恋", "(🥵🧪)药力发热", "(🤤💉)精液戒断", "(🤪🧪💦)断精发狂", "☣️(🤪💉💀)脑脊液毒化母猪"]
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
                emos: ["💋洁净初唇", "👅唇肿涎溢", "😮‍💨咽喉松弛", "🤤颚骨半脱臼", "🤪食道肉壶化", "💀口腔排泄器畸变"]
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
                emos: ["🌸娇嫩处乳", "🍒乳尖肥大", "🥵乳晕黑紫扩张", "🍼乳腺失控漏奶", "🐄下垂巨乳奶袋", "💀崩坏泌乳肉囊"]
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
                emos: ["🌸紧致初鲍", "💧初破红肿", "🌺外翻黑木耳", "🥵括约肌松弛洞开", "🤪肉壁脱垂漏精壶", "💀彻底崩坏烂肉洞"]
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
                emos: ["🤍紧闭处子", "🥺宫口充血微松", "🫀宫口扩张锁精", "🥵宫腔肥大下坠", "🤪宫颈重度脱垂", "💀外翻脱垂死肉苗床"]
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
                emos: ["🌱包皮隐没", "😳充血外露", "⚡阴蒂肥大勃起", "🥵尿道扩张漏尿", "⛲阴蒂肉棒化失禁", "💀括约肌坏死漏尿狂"]
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
                emos: ["💮紧闭菊蕾", "😣裂伤红肿", "😮‍💨褶皱磨平松弛", "🕳️后庭空洞不合", "🥛直肠翻肉轻度脱肛", "💀重度脱肛崩坏排泄腔"]
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
                emos: ["🤍尿道紧闭", "😳小腹微酸", "😣夹腿憋尿", "🥵濒临漏尿", "💦括约肌崩解", "⛲24h失禁滴尿"]
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
                emos: ["🤍无残留", "🥛微量挂壁", "🤤白浊咕啾", "🥵灌满外溢", "🫃精盆撑满", "💥灌爆撑裂苗床"]
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
                emos: ["🌸未泌乳", "🍼乳腺微胀", "🥺乳尖渗奶", "🥵涨奶酸痛", "🐄双乳狂喷", "🌊失禁浊乳喷泉"]
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
                emos: ["✨亭亭玉立", "😮‍💨腰腿酸软", "🥵膝软外八不合", "🫠双腿痉挛瘫软", "😵‍💫髋骨脱臼爬行", "💀四肢废用肉垫"]
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
                if (!silent) showToast("⚠️ 当前未选择任何角色卡或聊天记录为空！", "warn", 3500);
                return false;
            }
            return true;
        }

        function getInitialVars() {
            return {
                档案: {
                    手动锁定真名: "",
                    当前认知名字: "",
                    原身旧名: "",
                    种族与体质: "",
                    身份与背景: "",
                    肉体外貌实况: "",
                    表里风评与称号: "",
                    致命把柄与威胁: "无",
                    风月挂牌身价: "",
                    当前处境: ""
                },
                核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
                精神与心理: {
                    羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0,
                    意识清醒度: 100, 人格崩解度: 0, 媚药精液毒瘾: 0, 语言退化阿嘿颜: 0
                },
                身体: { 体力: 100, 敏感度倍率: 1.0 },
                性癖: { 条目: [] },
                恩客图鉴: {},
                已屏蔽恩客: [],
                历史最高崩坏度: {},
                上帝强制锁定: {},
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
                    生理周期阶段: "正常生理期", 卵子状态: "未排卵", 宫内精液归属: "无", 生产产卵次数: 0
                },
                体内精液存量: { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
                痕迹与标记: {
                    体表痕迹: "无", 淫纹与刻印: "无", 公开涂鸦字迹: "无",
                    穿刺与环饰: "无", 鞭痕与掌印: 0, 初夜破瓜纪念: "处女膜完好无损"
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
        let viewingHistoryFloor = null; // 新增：当前正在回溯查看的历史楼层号（null 表示实时最新层）

        const SHORT_NAMES = {
            "档案与风评": "档案",
            "恶堕与脑改": "恶堕",
            "下流性癖库": "性癖",
            "六孔与储精": "六孔",
            "肉改与道具": "肉改",
            "全身穿搭": "穿搭",
            "苗床与受孕": "受孕",
            "恩客图鉴": "恩客",
            "淫乱总账": "总账"
        };

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
            if (viewingHistoryFloor !== null) return; // 历史回溯预览时不覆盖实时缓存
            try {
                const ctx = safeCtx();
                const curLen = floorLen >= 0 ? floorLen : (ctx?.chat?.length || 0);
                localStorage.setItem(getChatStoreKey(), JSON.stringify({
                    floorLen: curLen,
                    手动锁定真名: varsObj.档案?.手动锁定真名 || "",
                    已屏蔽恩客: varsObj.已屏蔽恩客 || [],
                    历史最高崩坏度: varsObj.历史最高崩坏度 || {},
                    上帝强制锁定: varsObj.上帝强制锁定 || {},
                    快照: varsObj,
                    按钮详情: varsObj.按钮详情 || {},
                    性癖详情: varsObj.性癖详情 || {},
                    自定义条目: varsObj.自定义条目 || {}
                }));
            } catch (e) {}
        }

        function mergeUserCustomizations(baseVars, cached, currentChatLen) {
            if (!cached) return;
            if (cached.按钮详情) baseVars.按钮详情 = { ...baseVars.按钮详情, ...cached.按钮详情 };
            if (cached.性癖详情) baseVars.性癖详情 = { ...baseVars.性癖详情, ...cached.性癖详情 };
            if (cached.自定义条目) baseVars.自定义条目 = { ...baseVars.自定义条目, ...cached.自定义条目 };
            if (Array.isArray(cached.已屏蔽恩客)) baseVars.已屏蔽恩客 = [...cached.已屏蔽恩客];
            if (cached.上帝强制锁定 && typeof cached.上帝强制锁定 === "object") {
                baseVars.上帝强制锁定 = { ...baseVars.上帝强制锁定, ...cached.上帝强制锁定 };
            }
            const isRolledBack = (typeof cached.floorLen === "number" && cached.floorLen > currentChatLen);
            if (!isRolledBack && cached.floorLen === currentChatLen && cached.历史最高崩坏度 && typeof cached.历史最高崩坏度 === "object") {
                baseVars.历史最高崩坏度 = { ...baseVars.历史最高崩坏度, ...cached.历史最高崩坏度 };
            }
            if (cached.手动锁定真名) {
                baseVars.档案.手动锁定真名 = cached.手动锁定真名;
                baseVars.档案.当前认知名字 = cached.手动锁定真名;
            }
            if (cached.快照 && !isRolledBack) {
                const s = cached.快照;
                const isSameFloor = (cached.floorLen === currentChatLen);
                ["档案", "穿搭", "受孕与生理", "精神与心理扩展"].forEach(k => {
                    if (s[k] && typeof s[k] === "object") {
                        Object.entries(s[k]).forEach(([subKey, val]) => {
                            if (val !== "" && val !== "无" && val !== 0 && !baseVars[k][subKey]) {
                                baseVars[k][subKey] = val;
                            }
                        });
                    }
                });
                const FLOATING_KEYS = new Set(["性欲程度", "快感累积", "意识清醒度"]);
                ["核心数值", "精神与心理"].forEach(k => {
                    if (s[k] && typeof s[k] === "object") {
                        Object.entries(s[k]).forEach(([subKey, val]) => {
                            if (typeof val !== "number") return;
                            if (FLOATING_KEYS.has(subKey)) {
                                if (isSameFloor && baseVars[k][subKey] === (subKey === "意识清醒度" ? 100 : 0)) {
                                    baseVars[k][subKey] = val;
                                }
                            } else if (subKey === "羞耻度") {
                                baseVars[k][subKey] = Math.min(safeNum(baseVars[k][subKey], 100), val);
                            } else {
                                baseVars[k][subKey] = Math.max(safeNum(baseVars[k][subKey], 0), val);
                            }
                        });
                    }
                });
                if (isSameFloor && s.身体 && typeof s.身体.体力 === "number" && baseVars.身体.体力 === 100) {
                    baseVars.身体.体力 = s.身体.体力;
                }
                if (isSameFloor && s.体内精液存量 && typeof s.体内精液存量 === "object") {
                    Object.assign(baseVars.体内精液存量, s.体内精液存量);
                }
                if (s.计数 && typeof s.计数 === "object") {
                    Object.keys(s.计数).forEach(subK => {
                        if (typeof s.计数[subK] === "object" && s.计数[subK] !== null) {
                            baseVars.计数[subK] = baseVars.计数[subK] || {};
                            Object.entries(s.计数[subK]).forEach(([cKey, cVal]) => {
                                if (typeof cVal === "number") {
                                    baseVars.计数[subK][cKey] = Math.max(safeNum(baseVars.计数[subK][cKey], 0), cVal);
                                }
                            });
                        } else if (typeof s.计数[subK] === "number") {
                            baseVars.计数[subK] = Math.max(safeNum(baseVars.计数[subK], 0), s.计数[subK]);
                        }
                    });
                }
            }
        }

        // =========================================================================
        // 🎭 精准识别主角认知真名与原身旧名
        // =========================================================================
        function detectProtagonistName(v) {
            if (v?.档案?.手动锁定真名 && safeStr(v.档案.手动锁定真名).trim()) {
                const locked = safeStr(v.档案.手动锁定真名).trim();
                v.档案.当前认知名字 = locked;
                return locked;
            }

            const ctx = safeCtx();
            const rawUser = safeStr(ctx?.name1, "主角").trim();
            const cardName = safeStr(ctx?.name2).trim();
            const chatArr = ctx?.chat || [];
            const personaDesc = safeStr(ctx?.power_user?.persona_description);

            let detectedNewName = "";
            let detectedOldName = "";

            const allTexts = [personaDesc, ...chatArr.slice(-10).map(m => safeStr(m?.mes))];
            for (let i = allTexts.length - 1; i >= 0; i--) {
                const mes = allTexts[i];
                if (!mes) continue;

                const transMatch = mes.match(/(?:原本是|原名|前世是|从)\s*([^\s，。！？,."“”'‘’（）()]{2,8}?)\s*(?:变成了|重塑为|穿成了|夺舍了|化作了)\s*([^\s，。！？,."“”'‘’（）()的]{2,8})/);
                if (transMatch) {
                    detectedOldName = transMatch[1].trim();
                    detectedNewName = transMatch[2].trim();
                    break;
                }

                const inheritMatch = mes.match(/(?:完全)?(?:变成了|重塑为|化作|继承了|穿成了|身为)\s*([^\s，。！？,."“”'‘’（）()的]{2,8}?)(?:的身体|的肉体|的名字|本人|[，。！？\s])/);
                if (inheritMatch && inheritMatch[1] && !/女生|女人|少女|妓女|暗娼|母狗|性奴|样子|模样/.test(inheritMatch[1])) {
                    detectedNewName = inheritMatch[1].trim();
                    break;
                }

                const archMatch = mes.match(/\[\[\s*角色档案\s*\]\]\s*(?:->|→)\s*([^\s|｜\n]{2,14})/);
                if (archMatch && archMatch[1] && !archMatch[1].includes("日期")) {
                    detectedNewName = archMatch[1].replace(/\*\*/g, "").trim();
                    break;
                }

                const nameLine = mes.match(/(?:当前认知名字|认知真名|现在名为|姓名)[：:]\s*([^\s|｜，。\n]{2,10})/);
                if (nameLine && nameLine[1]) {
                    detectedNewName = nameLine[1].trim();
                    break;
                }

                const barMatch = mes.match(/(?:【|\[)\s*状态栏\s*[｜|:：]\s*([^】\]\n]{1,14}?)\s*(?:】|\])/);
                if (barMatch && barMatch[1] && barMatch[1].trim() !== cardName) {
                    detectedNewName = barMatch[1].trim();
                    break;
                }
            }

            if (detectedOldName && v?.档案) v.档案.原身旧名 = detectedOldName;
            if (detectedNewName) {
                if (v?.档案) {
                    if (rawUser && rawUser !== detectedNewName && !v.档案.原身旧名) {
                        v.档案.原身旧名 = rawUser;
                    }
                    v.档案.当前认知名字 = detectedNewName;
                }
                return detectedNewName;
            }

            if (v?.档案?.当前认知名字 && safeStr(v.档案.当前认知名字).trim() && v.档案.当前认知名字 !== "主角") {
                return safeStr(v.档案.当前认知名字).trim();
            }
            return rawUser || "主角";
        }

        // =========================================================================
        // 🚿 自然代谢 + 修复Bug5：无 <UpdateVariable> 时的正向动作保底累加
        // =========================================================================
        function applyNaturalMetabolism(floorText, targetVars, hasExplicitSet = false) {
            if (!floorText) return;
            const cleanBody = floorText.replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|<options>[\s\S]*?<\/options>|<summary>[\s\S]*?<\/summary>|<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "");
            if (!cleanBody) return;

            const sp = targetVars.体内精液存量 || {};
            const mark = targetVars.痕迹与标记 || {};
            const prop = targetVars.体内道具与权限 || {};
            const cnt = targetVars.计数 || {};

            // 【正向保底】：若该层 AI 漏写 _.set，自动根据正文关键词保底累加计数与注精
            if (!hasExplicitSet) {
                if (/(?:挺身|肉棒|阳具|巨物|龟头).{0,15}(?:捅入|插入|贯穿|顶入|没入|抽插).{0,15}(?:小穴|花穴|甬道|蜜穴|肉穴)/.test(cleanBody)) {
                    cnt.性交.小穴 = safeNum(cnt.性交.小穴) + 1;
                }
                if (/(?:内射|射入|灌入|喷洒在|泵入).{0,15}(?:子宫|宫腔|小穴深处|花心|甬道深处)/.test(cleanBody)) {
                    cnt.射精.内射 = safeNum(cnt.射精.内射) + 1;
                    sp.子宫毫升 = safeNum(sp.子宫毫升) + 18;
                    sp.小穴毫升 = safeNum(sp.小穴毫升) + 10;
                }
                if (/(?:肉棒|阳具|龟头).{0,12}(?:塞入|捅入|顶入|深喉|抽插).{0,12}(?:小嘴|口腔|咽喉|喉管|唇瓣)/.test(cleanBody)) {
                    cnt.性交.口 = safeNum(cnt.性交.口) + 1;
                }
                if (/(?:吞下|咽下|射进嘴|灌进胃|吞精).{0,15}(?:精液|白浊|浓精)/.test(cleanBody)) {
                    cnt.精液摄入.吞精次数 = safeNum(cnt.精液摄入.吞精次数) + 1;
                    cnt.精液摄入.累计毫升 = safeNum(cnt.精液摄入.累计毫升) + 15;
                    sp.口内毫升 = safeNum(sp.口内毫升) + 15;
                }
                if (/(?:捅入|插入|贯穿|抽插).{0,12}(?:屁眼|后庭|菊穴|肛门|直肠)/.test(cleanBody)) {
                    cnt.性交.屁眼 = safeNum(cnt.性交.屁眼) + 1;
                }
                if (/(?:高潮|绝顶|泄身|痉挛着攀上巅峰)/.test(cleanBody)) {
                    cnt.高潮.总数 = safeNum(cnt.高潮.总数) + 1;
                }
                if (/(?:潮吹|喷潮|喷涌而出)/.test(cleanBody)) {
                    cnt.失控.喷潮 = safeNum(cnt.失控.喷潮) + 1;
                }
                if (/(?:失禁|漏尿|黄尿|尿液失控)/.test(cleanBody)) {
                    cnt.失控.失禁 = safeNum(cnt.失控.失禁) + 1;
                }
                if (/(?:耳光|掌掴|巴掌|皮鞭|抽打).{0,12}(?:臀|脸|胸|乳)/.test(cleanBody)) {
                    mark.鞭痕与掌印 = safeNum(mark.鞭痕与掌印) + 1;
                }
            }

            if (!userSettings.autoMetabolism) return;

            // 1. 冲洗/抠弄清理体液
            if (/(?:花洒|喷头|水流|温水).{0,16}(?:冲刷|冲洗|灌入|洗净).{0,16}(?:甬道|深处|残精|小穴|宫腔)/.test(cleanBody)) {
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.15));
                sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.35));
            } else if (/(?:手指|并拢).{0,15}(?:探入|伸入|抠出|洗出|清理).{0,18}(?:残精|白浊|甬道|深处)/.test(cleanBody)) {
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.4));
                sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.75));
            } else if (/(?:滴落|淌下|顺着大腿|突破了花唇).{0,15}(?:水泥地|脚趾|地板|吧嗒|滴答)/.test(cleanBody)) {
                if (safeNum(sp.小穴毫升) > 1) sp.小穴毫升 = Math.max(1, safeNum(sp.小穴毫升) - 1);
                if (safeNum(sp.子宫毫升) > 3) sp.子宫毫升 = Math.max(2, safeNum(sp.子宫毫升) - 1);
            }

            if (/(?:漱口|吐出).{0,12}(?:残精|白浊|精液)/.test(cleanBody)) {
                sp.口内毫升 = Math.max(0, Math.round(safeNum(sp.口内毫升) * 0.3));
            }

            // 2. 清洗/擦拭身体：自动洗掉可逆的低阶涂鸦与墨迹
            if (/(?:洗净|洗掉|擦掉|擦净|擦拭干净|沐浴露|肥皂|温水冲洗).{0,18}(?:涂鸦|字迹|正字|墨迹|墨水|肚皮|大腿|身子|全身)/.test(cleanBody)) {
                const isPermanentScar = /刺青|纹身|烙铁|烙印|烫伤|刀刻|血痕/.test(safeStr(mark.公开涂鸦字迹) + safeStr(mark.体表痕迹));
                if (!isPermanentScar) {
                    mark.公开涂鸦字迹 = "无";
                    if (/正字|马克笔|墨迹|涂鸦/.test(safeStr(mark.体表痕迹))) {
                        mark.体表痕迹 = "无";
                    }
                    if (targetVars.历史最高崩坏度 && safeNum(targetVars.历史最高崩坏度.mod_scar) < 60) {
                        delete targetVars.历史最高崩坏度.mod_scar;
                    }
                }
            }

            // 3. 拔出/取出体内临时道具或摘下普通环饰
            if (/(?:拔出|取出|摘下|扯出|掉出|拿掉|解开).{0,12}(?:跳蛋|假阳具|按摩棒|尾塞|肛塞|道具)/.test(cleanBody)) {
                const isFused = /焊死|铆钉|机械核心|无法取出/.test(safeStr(prop.体内道具));
                if (!isFused) {
                    prop.体内道具 = "无";
                    if (targetVars.历史最高崩坏度 && safeNum(targetVars.历史最高崩坏度.mod_prop) < 60) {
                        delete targetVars.历史最高崩坏度.mod_prop;
                    }
                }
            }
            if (/(?:摘下|取下|解下|拿掉).{0,12}(?:银环|乳环|阴唇环|阴蒂环|环饰|穿刺)/.test(cleanBody)) {
                const isFusedPierce = /缝合|锁死|撕裂|钢筋|嵌合|生锈/.test(safeStr(mark.穿刺与环饰));
                if (!isFusedPierce) {
                    mark.穿刺与环饰 = "无";
                    if (targetVars.历史最高崩坏度 && safeNum(targetVars.历史最高崩坏度.mod_pierce) < 60) {
                        delete targetVars.历史最高崩坏度.mod_pierce;
                    }
                }
            }

            // 4. 高潮泄身或事后平复
            if (/(?:高潮过后的余韵|平复着呼吸|喘息渐渐平息|软倒在床|瘫软下来休息)/.test(cleanBody)) {
                targetVars.精神与心理.快感累积 = Math.max(10, Math.round(safeNum(targetVars.精神与心理.快感累积) * 0.35));
                targetVars.核心数值.性欲程度 = Math.max(15, Math.round(safeNum(targetVars.核心数值.性欲程度) * 0.65));
            }

            // 5. 睡眠与次日代谢
            if (/(?:沉沉睡去|一觉睡到|次日清晨|第二天早上|醒来时已是|睡了一觉)/.test(cleanBody)) {
                targetVars.身体.体力 = Math.min(100, safeNum(targetVars.身体.体力, 70) + 55);
                targetVars.精神与心理.快感累积 = Math.max(0, Math.round(safeNum(targetVars.精神与心理.快感累积) * 0.15));
                targetVars.核心数值.性欲程度 = Math.max(0, Math.round(safeNum(targetVars.核心数值.性欲程度) * 0.4));
                targetVars.精神与心理.意识清醒度 = Math.min(100, safeNum(targetVars.精神与心理.意识清醒度, 80) + 40);
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.2));
                sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.4));
                sp.口内毫升 = 0;
                if (safeNum(mark.鞭痕与掌印) > 0) {
                    mark.鞭痕与掌印 = Math.max(0, Math.floor(safeNum(mark.鞭痕与掌印) * 0.5));
                }
            }
        }

        // =========================================================================
        // 🧮 严苛复合崩坏升阶算法 + 不可逆器质崩坏锁 + 上帝滑块直调覆盖
        // =========================================================================
        function getBreakthroughCaps(v) {
            const mode = userSettings.worldBreakMode || "auto";
            if (mode === "fantasy_unleashed" || mode === "realistic_gore") {
                return { organCap: 100, pregCap: 100, modCap: 100, mentalCap: 100, isRealisticGore: mode === "realistic_gore" };
            }
            if (mode === "realistic_lock") {
                return { organCap: 79, pregCap: 79, modCap: 79, mentalCap: 79, isRealisticGore: true };
            }

            const ctx = safeCtx();
            const recentText = (ctx?.chat || []).slice(-8).map(m => safeStr(m?.mes)).join(" ") + " " + safeStr(ctx?.characters?.[ctx?.characterId]?.description);
            const c = v?.计数 || {}, mark = v?.痕迹与标记 || {}, prop = v?.体内道具与权限 || {};

            const hasFantasyOrMonster = safeNum(c.性交?.兽交异种) > 0 || /魔族|魔物|触手|异种|妖兽|虫族|史莱姆|深渊|魅魔|魔化|寄生|产卵|生化|机械改造|赛博|因果/.test(recentText);
            const hasExtremePhysical = /拳交|扩阴器|扩肛器|脱垂|脱肛|尿道扩张|宫颈扩张|彻底崩坏|烂肉洞|失禁改造|排泄器/.test(recentText);
            const hasExtremeMod = (mark.淫纹与刻印 && mark.淫纹与刻印 !== "无") || (mark.穿刺与环饰 && mark.穿刺与环饰 !== "无") || (prop.体内道具 && prop.体内道具 !== "无") || /烙铁|刀刻|刺青|钢钉|铅球|电击/.test(recentText);
            const hasExtremeMental = safeNum(v?.精神与心理扩展?.催眠深度) >= 60 || safeNum(v?.精神与心理?.媚药精液毒瘾) >= 60 || safeNum(c.失控?.阿嘿颜) >= 8 || /催眠洗脑|人格粉碎|脑死|母猪化|前额叶/.test(recentText);

            return {
                organCap: hasFantasyOrMonster ? 100 : (hasExtremePhysical ? 95 : 79),
                pregCap:  hasFantasyOrMonster ? 100 : 79,
                modCap:   hasFantasyOrMonster ? 100 : (hasExtremeMod ? 95 : 79),
                mentalCap: hasFantasyOrMonster ? 100 : (hasExtremeMental ? 95 : 79),
                isRealisticGore: !hasFantasyOrMonster
            };
        }

        function lockIrreversible(v, key, curVal, editKeyForGod = "") {
            // 若用户通过上帝模式滑块强制指定了该项数值，优先采用上帝数值
            if (editKeyForGod && v.上帝强制锁定 && typeof v.上帝强制锁定[editKeyForGod] === "number") {
                return Math.max(0, Math.min(100, Math.round(v.上帝强制锁定[editKeyForGod])));
            }
            v.历史最高崩坏度 = v.历史最高崩坏度 || {};
            const caps = getBreakthroughCaps(v);
            let maxAllowed = 79;
            if (key.startsWith("organ_")) maxAllowed = caps.organCap;
            else if (key.startsWith("preg_")) maxAllowed = caps.pregCap;
            else if (key.startsWith("mod_")) maxAllowed = caps.modCap;
            else maxAllowed = caps.mentalCap;

            const prevMax = Math.min(maxAllowed, safeNum(v.历史最高崩坏度[key], 0));
            const clampedCur = Math.min(maxAllowed, Math.round(safeNum(curVal, 0)));
            const lockedVal = Math.max(prevMax, clampedCur);
            v.历史最高崩坏度[key] = lockedVal;
            return lockedVal;
        }

        function calcStage6Score(rawPoints, unitWeight = 1.0, diffMult = 3.0, passesStage6Gate = false) {
            if (rawPoints <= 0) {
                return {
                    val: 0,
                    tier: 0,
                    curPts: 0,
                    nextThreshold: Math.max(1, Math.ceil((18 * diffMult) / unitWeight))
                };
            }
            const eff = (rawPoints * unitWeight) / Math.max(0.5, diffMult);
            const T1 = 18, T2 = 55, T3 = 125, T4 = 240, T5 = 420;
            let score = 0, nextTargetEff = T1;

            if (eff < T1) {
                score = Math.max(1, Math.min(19, Math.floor(1 + (eff / T1) * 18)));
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

            const vagPts = vag * 1.0 + mast * 0.4 + creampie * 0.35 + squirt * 0.7 + gang * 1.5;
            const vagGate6 = (vag >= 100 * dMult && orgasm >= 60 * dMult);
            const vagObj = calcStage6Score(vagPts, 1.0, dMult, vagGate6);
            vagObj.val = lockIrreversible(v, "organ_vag", vagObj.val, "小穴实况");
            vagObj.tier = tier6(vagObj.val, false);

            const wombPts = creampie * 1.2 + vag * 0.25 + gang * 1.8 + pregCnt * 25;
            const wombGate6 = (creampie >= 90 * dMult);
            const wombObj = calcStage6Score(wombPts, 1.05, dMult, wombGate6);
            wombObj.val = lockIrreversible(v, "organ_womb", wombObj.val, "子宫实况");
            wombObj.tier = tier6(wombObj.val, false);

            const mouthPts = mouth * 1.0 + swallow * 1.2 + (swallowMl / 45);
            const mouthGate6 = ((mouth + swallow) >= 85 * dMult);
            const mouthObj = calcStage6Score(mouthPts, 1.0, dMult, mouthGate6);
            mouthObj.val = lockIrreversible(v, "organ_mouth", mouthObj.val, "骚口实况");
            mouthObj.tier = tier6(mouthObj.val, false);

            const chestPts = tit * 1.2 + milk * 1.6 + (milkMl / 50) + mast * 0.25;
            const chestGate6 = ((tit + milk) >= 65 * dMult);
            const chestObj = calcStage6Score(chestPts, 1.15, dMult, chestGate6);
            chestObj.val = lockIrreversible(v, "organ_chest", chestObj.val, "胸部实况");
            chestObj.tier = tier6(chestObj.val, false);

            const clitPts = orgasm * 0.7 + forceOrg * 1.0 + edge * 1.3 + squirt * 1.5 + leak * 1.8 + mast * 0.5;
            const clitGate6 = (orgasm >= 80 * dMult && (squirt + leak) >= 25 * dMult);
            const clitObj = calcStage6Score(clitPts, 1.0, dMult, clitGate6);
            clitObj.val = lockIrreversible(v, "organ_clit", clitObj.val, "阴蒂尿道");
            clitObj.tier = tier6(clitObj.val, false);

            const analPts = anal * 1.3 + leak * 0.8 + gang * 1.4;
            const analGate6 = (anal >= 65 * dMult);
            const analObj = calcStage6Score(analPts, 1.2, dMult, analGate6);
            analObj.val = lockIrreversible(v, "organ_anal", analObj.val, "屁眼实况");
            analObj.tier = tier6(analObj.val, false);

            const totalLedgerCount = vag + mouth + anal + tit + foot + creampie + swallow + orgasm + squirt + leak + mast + exp + hooker + gang + sleep + milk;

            const sixScores = [vagObj.val, wombObj.val, mouthObj.val, chestObj.val, clitObj.val, analObj.val].sort((a, b) => b - a);
            const top2OrganAvg = Math.round((sixScores[0] + sixScores[1]) / 2);
            const all6OrganAvg = Math.round(sixScores.reduce((a, b) => a + b, 0) / 6);

            const totalWeightedPts =
                vag * 0.9 + creampie * 1.1 + mouth * 0.7 + swallow * 0.9 + anal * 1.0 +
                tit * 0.5 + foot * 0.4 + orgasm * 0.45 + (squirt + leak) * 1.0 +
                mast * 0.35 + exp * 0.8 + hooker * 1.1 + gang * 2.0 + sleep * 1.2;

            const ledgerCurve = calcStage6Score(totalWeightedPts, 0.75, dMult, sixScores[0] >= 100 && totalWeightedPts >= 450 * dMult);

            const compositeScore = totalLedgerCount === 0 && all6OrganAvg === 0
                ? 0
                : Math.round(ledgerCurve.val * 0.45 + top2OrganAvg * 0.35 + all6OrganAvg * 0.20);

            return {
                vagObj, wombObj, mouthObj, chestObj, clitObj, analObj,
                totalLedgerCount, totalWeightedPts, top2OrganAvg, all6OrganAvg,
                masterCurve: {
                    val: compositeScore,
                    tier: tier6(compositeScore, false),
                    curPts: Math.round(totalWeightedPts),
                    nextThreshold: ledgerCurve.nextThreshold
                }
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
                const { val: rawVal, curPts, nextThreshold } = calcStage6Score(pts, unitWeight, dMult, gate6 && corr >= 95);
                const calcVal = lockIrreversible(v, `fet_${shortName}`, rawVal, `fetish_${shortName}`);
                const stg = stageNameFromVal(calcVal);
                const originStr = `${originTpl}（畸变点：${curPts} / 下一阶：${nextThreshold}）`;

                resultMap.set(shortName, {
                    name: shortName, origin: originStr, val: calcVal, stage: stg,
                    countNow: curPts, nextTarget: nextThreshold
                });
            };

            upsertAuto("肉穴挨操瘾", `小穴贯穿 ${vag} 次 + 自慰 ${mast} 次 + 内射 ${creampie} 次`, Math.round(vag + mast * 0.4 + creampie * 0.3), 1.0, vag >= 100 * dMult);
            upsertAuto("子宫受精癖", `宫腔无套内射 ${creampie} 次`, Math.round(creampie * 1.2 + vag * 0.2), 1.05, creampie >= 90 * dMult);
            upsertAuto("深喉吞精癖", `口交 ${mouth} 次 + 吞精 ${swallow} 次`, mouth + swallow, 1.0, (mouth + swallow) >= 85 * dMult);
            upsertAuto("后庭扩菊癖", `后庭开发 ${anal} 次`, anal, 1.2, anal >= 65 * dMult);
            upsertAuto("乳交奉侍癖", `乳交 ${tit} 次`, Math.round(tit + mast * 0.25), 1.25, tit >= 50 * dMult);
            upsertAuto("母畜喷乳癖", `挤奶喷乳 ${milk} 次`, milk, 1.5, milk >= 40 * dMult);
            upsertAuto("玉足恋精癖", `足交 ${foot} 次`, foot, 1.3, foot >= 40 * dMult);
            upsertAuto("潮吹失禁癖", `高潮 ${orgasm} 次 + 潮吹 ${squirt} 次 + 失禁 ${leak} 次`, Math.round(orgasm * 0.45 + squirt * 1.8 + leak * 2.2), 1.0, (squirt + leak) >= 30 * dMult);
            upsertAuto("寸止焦躁癖", `寸止折磨 ${edge} 次`, edge, 1.5, edge >= 35 * dMult);
            upsertAuto("受虐痛感转化", `受虐留痕 ${whip} 处`, whip, 1.5, whip >= 40 * dMult);
            upsertAuto("自慰抠穴癖", `自慰抠穴 ${mast} 次`, mast, 1.25, mast >= 45 * dMult);
            upsertAuto("公开露出癖", `赤裸露出 ${exp} 次`, exp, 1.3, exp >= 35 * dMult);
            upsertAuto("轮奸便器癖", `多人轮奸 ${gang} 次`, gang, 1.8, gang >= 25 * dMult);
            upsertAuto("睡奸无防备癖", `睡奸迷奸 ${sleep} 次`, sleep, 1.6, sleep >= 25 * dMult);
            upsertAuto("风尘卖淫癖", `接客卖身 ${hooker} 次`, hooker, 1.0, hooker >= 90 * dMult);

            if (Array.isArray(v.性癖?.条目)) {
                v.性癖.条目.forEach(raw => {
                    const s = safeStr(raw).trim();
                    if (!s || totalCount === 0) return;
                    const parts = s.split("-");
                    const rawName = safeStr(parts[0], "特殊性癖").trim();
                    if (resultMap.has(rawName)) return;
                    const origin = safeStr(parts[1], "长期调教形成").trim();
                    const maxAllowed = calcStage6Score(Math.max(1, totalCount * 0.5), 1.0, dMult, false).val;
                    const num = Math.max(1, Math.min(99, maxAllowed));
                    resultMap.set(rawName, {
                        name: rawName, origin, val: num, stage: stageNameFromVal(num),
                        countNow: totalCount, nextTarget: Math.ceil(totalCount * 1.6 + 20)
                    });
                });
            }

            return Array.from(resultMap.values());
        }

        function calibrateMentalMetrics(v) {
            const dev = computeAllOrganDevelopments(v);
            const fetList = computeUnlockedFetishes(v);
            const fetAvg = fetList.length > 0
                ? Math.round(fetList.reduce((acc, f) => acc + f.val, 0) / fetList.length)
                : 0;

            const applyGodMental = () => {
                const g = v.上帝强制锁定 || {};
                if (typeof g.cockLove === "number") v.核心数值.对肉棒好感度 = g.cockLove;
                if (typeof g.lust === "number") v.核心数值.性欲程度 = g.lust;
                if (typeof g.corr === "number") v.核心数值.淫乱恶堕 = g.corr;
                if (typeof g.shame === "number") v.精神与心理.羞耻度 = g.shame;
                if (typeof g.obey === "number") v.精神与心理.服从度 = g.obey;
                if (typeof g.pleas === "number") v.精神与心理.快感累积 = g.pleas;
                if (typeof g["精神沦陷"] === "number") v.精神与心理.沦陷度 = g["精神沦陷"];
                if (typeof g["媚药毒瘾"] === "number") v.精神与心理.媚药精液毒瘾 = g["媚药毒瘾"];
                if (typeof g["当前姿势"] === "number") v.身体.体力 = g["当前姿势"];
            };

            if (!userSettings.strictMentalLock) {
                applyGodMental();
                return;
            }

            const sp = v.体内精液存量 || {};
            const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);

            if (dev.totalLedgerCount === 0 && totalMl === 0 && dev.all6OrganAvg === 0) {
                v.核心数值.对肉棒好感度 = Math.min(5, Math.max(0, safeNum(v.核心数值.对肉棒好感度)));
                v.核心数值.淫乱恶堕 = Math.min(5, Math.max(0, safeNum(v.核心数值.淫乱恶堕)));
                v.精神与心理.服从度 = Math.min(8, Math.max(0, safeNum(v.精神与心理.服从度)));
                v.精神与心理.沦陷度 = Math.min(5, Math.max(0, safeNum(v.精神与心理.沦陷度)));
                v.精神与心理.人格崩解度 = 0;
                v.精神与心理.媚药精液毒瘾 = Math.min(5, Math.max(0, safeNum(v.精神与心理.媚药精液毒瘾)));
                v.精神与心理.羞耻度 = Math.max(92, Math.min(100, safeNum(v.精神与心理.羞耻度, 100)));
                v.核心数值.性欲程度 = Math.min(18, Math.max(0, safeNum(v.核心数值.性欲程度)));
                v.精神与心理.快感累积 = Math.min(15, Math.max(0, safeNum(v.精神与心理.快感累积)));
                if (v.精神与心理扩展) v.精神与心理扩展.催眠深度 = Math.min(10, safeNum(v.精神与心理扩展.催眠深度));
                applyGodMental();
                return;
            }

            const caps = getBreakthroughCaps(v);
            const anchorScore = Math.round(dev.masterCurve.val * 0.55 + dev.top2OrganAvg * 0.25 + fetAvg * 0.20);
            const rawMax = (dev.masterCurve.val >= 100 && dev.top2OrganAvg >= 95) ? 100 : 99;
            const hardMax100 = Math.min(caps.mentalCap, rawMax);
            if (caps.organCap < 100 && v.身体) {
                const minStaAllowed = 100 - caps.organCap;
                v.身体.体力 = Math.max(minStaAllowed, safeNum(v.身体.体力, 100));
            }

            const maxLongTermCap = Math.min(hardMax100, anchorScore + 6);
            const minLongTermFloor = Math.max(0, anchorScore - 8);

            const calibratedHypno = Math.min(safeNum(v.精神与心理扩展?.催眠深度), Math.min(hardMax100, maxLongTermCap + 10));
            if (v.精神与心理扩展) v.精神与心理扩展.催眠深度 = calibratedHypno;
            const finalCap = Math.min(hardMax100, Math.max(maxLongTermCap, Math.round(calibratedHypno * 0.8)));

            const syncMetric = (val, floorOffset = 0, capOffset = 0) => {
                const cur = Math.max(0, Math.min(100, safeNum(val, 0)));
                const low = Math.max(0, Math.min(hardMax100, minLongTermFloor + floorOffset));
                const high = Math.max(low, Math.min(hardMax100, finalCap + capOffset));
                return Math.max(low, Math.min(cur, high));
            };

            v.核心数值.对肉棒好感度 = syncMetric(v.核心数值.对肉棒好感度, -2, 2);
            v.核心数值.淫乱恶堕 = syncMetric(v.核心数值.淫乱恶堕, 0, 0);
            v.精神与心理.服从度 = syncMetric(v.精神与心理.服从度, -2, 3);
            v.精神与心理.沦陷度 = syncMetric(v.精神与心理.沦陷度, -3, 2);
            v.精神与心理.人格崩解度 = syncMetric(v.精神与心理.人格崩解度, -10, -3);
            v.精神与心理.媚药精液毒瘾 = syncMetric(v.精神与心理.媚药精液毒瘾, -5, 4);

            const minShameFloor = hardMax100 === 100 ? 0 : Math.max(1, 100 - finalCap);
            const maxShameCap = Math.max(minShameFloor, 100 - minLongTermFloor);
            const curShame = Math.max(0, Math.min(100, safeNum(v.精神与心理.羞耻度, 100)));
            v.精神与心理.羞耻度 = Math.max(minShameFloor, Math.min(curShame, maxShameCap));

            const hasActiveStimulus = totalMl > 0 || (v.体内道具与权限?.体内道具 && v.体内道具与权限.体内道具 !== "无");
            const shortTermCap = Math.min(100, Math.max(45, anchorScore + 35));
            const lustFloor = hasActiveStimulus ? Math.min(35, Math.round(anchorScore * 0.35)) : Math.min(15, Math.round(anchorScore * 0.15));
            const pleasFloor = hasActiveStimulus ? Math.min(25, Math.round(anchorScore * 0.25)) : 0;
            v.核心数值.性欲程度 = Math.max(lustFloor, Math.min(Math.max(0, safeNum(v.核心数值.性欲程度)), shortTermCap));
            v.精神与心理.快感累积 = Math.max(pleasFloor, Math.min(Math.max(0, safeNum(v.精神与心理.快感累积)), shortTermCap));

            applyGodMental();
        }

        function getOverallCorruptionTier(v) {
            const corr = safeNum(v.核心数值?.淫乱恶堕, 0);
            const cock = safeNum(v.核心数值?.对肉棒好感度, 0);
            const obey = safeNum(v.精神与心理?.服从度, 0);
            const shameRev = 100 - safeNum(v.精神与心理?.羞耻度, 100);
            const avg = Math.round(corr * 0.45 + cock * 0.2 + obey * 0.2 + shameRev * 0.15);
            return tier6(avg, false);
        }

        function pickStageThought(v, thoughtsArray, specificStageVal = null, isRev = false) {
            const t = specificStageVal !== null ? tier6(specificStageVal, isRev) : getOverallCorruptionTier(v);
            return thoughtsArray[Math.min(t, thoughtsArray.length - 1)] || thoughtsArray[0];
        }

        // =========================================================================
        // 🍆 恩客图鉴引擎（修复Bug4：支持无副API时从历史自动捕获恩客 + 差异化计算）
        // =========================================================================
        function extractClientsFromHistory(v, u, c) {
            const ctx = safeCtx();
            const chatArr = ctx?.chat || [];
            const fullText = chatArr.map(m => safeStr(m?.mes)).join("\n");
            const clientMap = new Map();

            const blockedSet = new Set(Array.isArray(v.已屏蔽恩客) ? v.已屏蔽恩客 : []);
            const rawUser = safeStr(ctx?.name1).trim();
            const oldSelfName = safeStr(v.档案?.原身旧名).trim();
            const curSelfName = safeStr(u).trim();

            const NON_HUMAN_REGEX = /^(?:\d+|主角|你|我|她|他|它|原身|前世|身体|少女|女人|女生|无|未知|旁白|系统|笔|钢笔|圆珠笔|铅笔|毛笔|画笔|马克笔|跳蛋|假阳具|按摩棒|贞操带|项圈|手铐|锁链|绳子|鞭子|皮鞭|蜡烛|口球|眼罩|衣服|上衣|内裤|底裤|胸罩|文胸|丝袜|黑丝|白丝|高跟鞋|鞋子|裙子|睡裙|床单|床垫|被子|枕头|纸巾|纸团|毛巾|花洒|水龙头|镜子|手机|相机|黄瓜|香蕉|瓶子|酒瓶|触手|道具|玩具)$/;

            const isInvalidClient = (candName) => {
                if (!candName) return true;
                const n = String(candName).trim();
                if (n.length < 2 || n.length > 12) return true;
                if (blockedSet.has(n)) return true;
                // 若主角已经变成了角色卡人物(如纳兰嫣然)，则原User名(如伊一)是支配她的男主恩客，不应排除！
                if (n === curSelfName || (oldSelfName && n === oldSelfName)) return true;
                if (NON_HUMAN_REGEX.test(n)) return true;
                if (/(?:笔|棒|球|环|链|衣|裤|裙|袜|鞋|帽|巾|床|桌|椅|门|窗|灯|水|液|药|剂|器|具|穴|乳|胸|臀|腿|足|口|唇|手|指)$/.test(n) && !/(?:男人|少爷|老板|大师|师兄|师尊|徒弟|老公|丈夫|学长|同学|老师)/.test(n)) {
                    return true;
                }
                if (new RegExp(`(?:原名|原本是|前世是|从)\\s*${n}\\s*(?:变成|穿成|重塑|化作)`).test(fullText)) return true;
                return false;
            };

            const creampie = safeNum(v.计数?.射精?.内射);
            const vagCnt = safeNum(v.计数?.性交?.小穴);
            const mouthCnt = safeNum(v.计数?.性交?.口);
            const wombMl = safeNum(v.体内精液存量?.子宫毫升);
            const totalSex = vagCnt + mouthCnt + creampie + safeNum(v.计数?.性交?.屁眼);

            const nameHash = (str) => {
                let h = 0;
                for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100;
                return h;
            };

            const upsertClient = (name, roleTag, cockDesc, statusTag, contribPts, dnaShare, detailDesc, thoughtArr) => {
                if (isInvalidClient(name)) return;
                const cVal = Math.min(100, Math.max(5, Math.round(contribPts)));
                clientMap.set(name, {
                    name, roleTag, cockDesc, statusTag,
                    val: cVal,
                    dnaShare,
                    detailDesc,
                    thoughtStr: Array.isArray(thoughtArr) ? pickStageThought(v, thoughtArr, cVal) : thoughtArr
                });
            };

            if (v.恩客图鉴 && typeof v.恩客图鉴 === "object") {
                const entries = Object.entries(v.恩客图鉴).filter(([k]) => !isInvalidClient(k));
                entries.forEach(([k, val], idx) => {
                    const descStr = typeof val === "object" ? JSON.stringify(val) : String(val);
                    const hOffset = (nameHash(k) % 18) - 6;
                    const score = Math.min(100, Math.max(15, 28 + vagCnt * 1.8 + creampie * 2.5 + hOffset));
                    const share = wombMl > 0 ? Math.max(10, Math.round(100 / Math.max(1, entries.length))) : 0;
                    upsertClient(
                        k, "专属调教恩客", "雄性阳具", "已建立肉体烙印",
                        score, share,
                        `【🍆 恩客档案】：${k}\n【📊 肉体崩坏改造记录】：${descStr}`,
                        [
                            `想到【${k}】，我心里还是保持着戒备与距离感。`,
                            `身体已经渐渐记住了【${k}】的气息，面对他时很难完全平静💦。`,
                            `每次回想起与【${k}】的接触，被撑开过的粘膜深处就会泛起一丝酸麻感😳💦。`,
                            `一闻到【${k}】的气味，合不拢的肉穴就会不自觉地发软淌水🥵💦！`,
                            `已经彻底被【${k}】操成他专属的形状了，离开他的粗暴玩弄就活不下去🥵💦❤️！`,
                            `啊嘿♡……全身孔穴都已经被【${k}】彻底操烂改造成专属排泄便池啦🥵💦❤️❤️！`
                        ]
                    );
                });
            }

            // 若恩客图鉴为空且已经发生过性行为或储精，自动检测交互对象补充进图鉴
            if (clientMap.size === 0 && (totalSex > 0 || wombMl > 0 || safeNum(v.核心数值?.淫乱恶堕) >= 25)) {
                const autoCand = (rawUser && rawUser !== curSelfName) ? rawUser : (c && c !== curSelfName && c !== "无角色卡" ? c : "");
                if (autoCand && !isInvalidClient(autoCand)) {
                    const score = Math.min(100, Math.max(20, 25 + vagCnt * 2 + creampie * 3 + mouthCnt * 1.5));
                    upsertClient(
                        autoCand, "首要支配饲主", "滚烫粗大肉棒", "身心深度支配",
                        score, wombMl > 0 ? 100 : 0,
                        `【🍆 恩客档案】：${autoCand}\n【📊 肉体崩坏改造记录】：当前剧情中的首要支配者，累计贯穿小穴 ${vagCnt} 次、口交 ${mouthCnt} 次、内射 ${creampie} 次。`,
                        [
                            `面对【${autoCand}】，我心里依然保留着最后的矜持防线。`,
                            `身体已经开始适应【${autoCand}】的温度与摆弄了💦。`,
                            `每次被【${autoCand}】触碰，熟稔的肉壁都会本能地收缩迎合😳💦。`,
                            `只要【${autoCand}】一靠近，我的骚穴和嘴巴就会不自觉地发痒流涎🥵💦！`,
                            `从里到外都已经被【${autoCand}】彻底开发成专属肉便器了🥵💦❤️！`,
                            `啊嘿♡……这辈子都是【${autoCand}】大人专属的100%崩坏排泄肉坑与灌精苗床啦🥵💦❤️❤️！`
                        ]
                    );
                }
            }

            return Array.from(clientMap.values());
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

        // =========================================================================
        // 🧬 性癖库：Lv.1 浅层记忆 ➡️ Lv.6 神经强迫症躯体畸变
        // =========================================================================
        function buildFetishRichDesc(fetishObj, v, u) {
            const { name, origin, val, stage, countNow = 0, nextTarget = 20 } = fetishObj;
            const t = tier6(val, false);

            const apiFet = v.性癖详情?.[name];
            if (apiFet && (apiFet.desc || apiFet.thought)) {
                return `【🧬 性癖】：「${name}」（${stage} · ${val}/100）\n` +
                       `【🔓 成因】：${apiFet.origin || origin}\n` +
                       `【🔞 发作与畸变实况】：\n${apiFet.desc || "该性癖已在体内激活。"}\n` +
                       `💭【${u}的实时心声】：“*${cleanThoughtText(apiFet.thought || "身体产生了一丝奇妙的反应……")}*”`;
            }

            const stageDescs = [
                `【第一阶段·浅层记忆】（${val}/100）：「${name}」刚刚在${u}的肉体上留下最初痕迹（畸变点 ${countNow}/${nextTarget}）。理智上仍保持克制，但被触碰过的粘膜已留下微弱的异物记忆。`,
                `【第二阶段·条件反射】（${val}/100）：「${name}」已进入第二阶段（畸变点 ${countNow}）。只要处于相似情境下，呼吸便会微乱发热，私处开始分泌少量润滑液。`,
                `【第三阶段·食髓知味】（${val}/100）：「${name}」已深化至第三阶段（畸变点 ${countNow}）。长时间未体验「${name}」时，身体深处会泛起明显的空虚酸痒，在过程中会本能地顺从配合。`,
                `【第四阶段·深度成瘾】（${val}/100）：「${name}」已达第四阶段（畸变点 ${countNow}）。相应部位神经回路被重塑，面对「${name}」时会丧失自控力地主动迎合索取。`,
                `【第五阶段·戒断崩解】（${val}/100）：「${name}」已达第五阶段重度畸变（畸变点 ${countNow}）。一旦脱离「${name}」刺激便会产生剧烈躯体戒断抽搐，触发即伴随失禁与潮吹。`,
                `【💀 第六阶段·神经强迫症彻底畸变】（100/100 MAX）：「${name}」已100%烧穿大脑皮层并造成不可逆的躯体强迫症畸变（畸变点 ${countNow}）！相关部位肌肉与神经24小时保持迎接「${name}」的病态抽搐造型，一旦强行阻止就会当场发狂自残、喷尿休克！`
            ];

            const stageThoughts = [
                `虽然经历过「${name}」，但我绝不会因此堕落沉迷，必须努力压下身体里那点不自然的异样感。`,
                `奇怪……为什么一遇到「${name}」的苗头，心跳就会变快、身体也开始微微发热发软呢💦？`,
                `身体已经诚实地记住了「${name}」带来的酸麻快感，每当被这样对待时，都会忍不住顺从地迎合上去😳💦。`,
                `哈啊……只要一触发「${name}」，整条脊椎骨都会窜过酥麻的电流，根本没办法抗拒这种深入骨髓的快感呀🥵💦！`,
                `呜汪♡……已经彻底染上「${name}」的重度毒瘾了，不快点对我做「${name}」全身都要抽搐坏掉了🥵💦❤️！`,
                `啊嘿♡……「${name}」已经把我的脑髓和骨头彻底烧穿改造成病态形状了，一旦停止「${name}」我就会当场发狂自残死掉呀🥵💦❤️❤️！`
            ];

            return `【🧬 性癖】：「${name}」（${stage} · ${val}/100）\n` +
                   `【🔓 成因】：${origin}\n` +
                   `【🔞 发作与畸变实况】：\n${stageDescs[t]}\n` +
                   `💭【${u}的实时心声】：“*${stageThoughts[t]}*”`;
        }

        // =========================================================================
        // 📉 精简 YAML 注入 + 修复Bug1：完整的 <UpdateVariable> 全量字段引导模板
        // =========================================================================
        function varsToCompactSummary(userName, v) {
            const dev = computeAllOrganDevelopments(v);
            const sp = v.体内精液存量 || {};
            const c = v.计数 || {};
            const mark = v.痕迹与标记 || {};
            const prop = v.体内道具与权限 || {};
            return `${userName}状态快照: 体力=${safeNum(v.身体?.体力, 100)}%, 恶堕=${safeNum(v.核心数值?.淫乱恶堕)}%, 好感=${safeNum(v.核心数值?.对肉棒好感度)}%, 性欲=${safeNum(v.核心数值?.性欲程度)}%, 羞耻=${safeNum(v.精神与心理?.羞耻度, 100)}%, 服从=${safeNum(v.精神与心理?.服从度)}%, 快感=${safeNum(v.精神与心理?.快感累积)}% | ` +
                   `六孔崩坏度: 口=${dev.mouthObj.val}%, 乳=${dev.chestObj.val}%, 穴=${dev.vagObj.val}%, 宫=${dev.wombObj.val}%, 蒂尿=${dev.clitObj.val}%, 菊=${dev.analObj.val}% | ` +
                   `体内储精: 宫腔=${safeNum(sp.子宫毫升)}ml, 阴道=${safeNum(sp.小穴毫升)}ml, 胃=${safeNum(sp.口内毫升)}ml, 肠=${safeNum(sp.屁眼毫升)}ml | ` +
                   `累计总账: 小穴=${safeNum(c.性交?.小穴)}, 内射=${safeNum(c.射精?.内射)}, 口交=${safeNum(c.性交?.口)}, 吞精=${safeNum(c.精液摄入?.吞精次数)}, 肛交=${safeNum(c.性交?.屁眼)}, 乳交=${safeNum(c.性交?.乳穴)}, 高潮=${safeNum(c.高潮?.总数)}, 喷潮=${safeNum(c.失控?.喷潮)}, 失禁=${safeNum(c.失控?.失禁)}, 接客=${safeNum(c.交易?.接客卖身)} | ` +
                   `肉改实况: 伤痕=${safeStr(mark.体表痕迹, "无")}, 淫纹=${safeStr(mark.淫纹与刻印, "无")}, 穿刺=${safeStr(mark.穿刺与环饰, "无")}, 体内道具=${safeStr(prop.体内道具, "无")}`;
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

            if (dev.totalLedgerCount === 0 && totalMl === 0 && corr < 15 && dev.all6OrganAvg === 0) {
                rules.push(`- 【🌸完好清白状态(恶堕${corr}%/羞耻${shame}%)】：当前主角(${u})所有器官均处于第1阶段完好如初状态。正文中若未发生实质性侵犯，心理与生理描写必须保持端庄矜持，严禁无故出现母狗、发骚、器官外翻等恶堕描写！`);
                return `\n【🚨 状态栏1.1 器质崩坏与正文一致性铁律】\n${rules.join("\n")}\n`;
            }

            if (dev.mouthObj.tier >= 4) {
                rules.push(`- 【💀骚口第${dev.mouthObj.tier + 1}阶段(${dev.mouthObj.val}/100·颚骨半脱臼/排泄口器)】：口腔与咽喉已彻底被开发松弛，下巴合不拢、口水与白沫常年外溢！`);
            }
            if (dev.vagObj.tier >= 4) {
                rules.push(`- 【💀小穴第${dev.vagObj.tier + 1}阶段(${dev.vagObj.val}/100·重度器质崩坏)】：小穴已因过度使用而彻底松弛洞开、阴唇紫黑外翻且无法自然闭合！正文中严禁描写“紧致如处女”，走动时必须写出穴口合不拢漏精、咕啾吸气的重口崩坏细节！`);
            } else if (dev.vagObj.tier >= 2) {
                rules.push(`- 【🌺小穴第${dev.vagObj.tier + 1}阶段(${dev.vagObj.val}/100·外翻熟稔)】：花唇已被开发得肥厚外翻、极易泛滥拉丝，肉壁会本能迎合吞吸。`);
            }
            if (dev.wombObj.tier >= 4) {
                rules.push(`- 【💀子宫第${dev.wombObj.tier + 1}阶段(${dev.wombObj.val}/100·宫颈重度脱垂)】：子宫韧带已被彻底撞松，紫红肿胀的宫颈口已顺着阴道向下严重脱垂甚至外翻至穴口边缘，随时处于张口索精状态！`);
            }
            if (dev.clitObj.tier >= 4) {
                rules.push(`- 【💀尿道第${dev.clitObj.tier + 1}阶段(${dev.clitObj.val}/100·括约肌崩坏失禁)】：阴蒂恶性肥大勃起，尿道括约肌已严重松弛坏死，稍受刺激或高潮必定伴随失控漏尿与潮吹狂喷！`);
            }
            if (dev.analObj.tier >= 4) {
                rules.push(`- 【💀后庭第${dev.analObj.tier + 1}阶段(${dev.analObj.val}/100·直肠翻肉脱肛)】：肛门括约肌已彻底松弛不合，鲜红的直肠粘膜向外翻出脱垂，无法锁住肠液与残精！`);
            }
            if (totalMl > 0) {
                rules.push(`- 【🥛体内当前存留 ${totalMl}ml 浓精（宫腔${safeNum(sp.子宫毫升)}ml/阴道${safeNum(sp.小穴毫升)}ml/胃${safeNum(sp.口内毫升)}ml）】：站立或走动时必须写出下腹沉甸甸的坠胀感与白浊顺大腿内侧滴淌拉丝的物理细节。`);
            }
            if (corr >= 80 || shame <= 20) {
                rules.push(`- 【🖤高阶脑崩坏(恶堕${corr}%/羞耻${shame}%/服从${obey}%)】：精神防线已彻底崩坏，神态与肢体必须体现出丧失廉耻的顺从或主动索取。`);
            }

            if (!rules.length) return "";
            return `\n【🚨 状态栏1.1 器质崩坏与正文一致性铁律】\n${rules.join("\n")}\n`;
        }

        function buildFullSystemPrompt(userName, currentVars) {
            const compactSnap = varsToCompactSummary(userName, currentVars);
            const diff = getDifficultyProfile();
            const reverseRules = buildReverseBodyEnforcementRules(userName, currentVars);
            const c = currentVars.计数 || {}, sp = currentVars.体内精液存量 || {}, mark = currentVars.痕迹与标记 || {}, prop = currentVars.体内道具与权限 || {};
            const isZeroInit = (safeNum(c.性交?.小穴) + safeNum(c.性交?.口) + safeNum(c.交易?.接客卖身)) === 0;
            const openTag = "<" + "UpdateVariable>";
            const closeTag = "</" + "UpdateVariable>";

            const autoInitRule = isZeroInit
                ? `\n【⚠️ 非处女/改造人设校准】：当前总账全为0。若主角(${userName})在设定或因果改写中已有性经验或身体改造，请在本轮末尾的 ${openTag} 中用 _.set 将其历史累计次数与体内精液存量设为符合设定的高数值。`
                : "";

            return `\n【⚠️ 正文字数与细节最高铁律】：你的回复重心是【小说正文】！正文描写必须极其细腻、慢节奏、充满五感与肉体特写（正文至少1000~1500字以上），严禁为了输出底部的状态变量而缩写剧情或提前结束正文！\n` +
                   `【当前角色状态快照（难度：${diff.mult}x｜身份：${detectRealCharacterIdentity(currentVars)}）】\n${compactSnap}` +
                   autoInitRule +
                   reverseRules +
                   `\n【🔥状态变量后台静默更新规范】\n` +
                   `1. 严禁在正文中输出【状态栏】文本面板或裸露的 _.set 代码！\n` +
                   `2. 只有在完整写完充实的长篇正文（及选项/摘要）之后，在全篇最末尾输出唯一一个闭合的 ${openTag}...${closeTag} 块（根据本轮实际发生的部位与变化更新对应行）：\n` +
                   `${openTag}\n` +
                   `_.set('${userName}.身体.体力', ${safeNum(currentVars.身体?.体力, 100)});\n` +
                   `_.set('${userName}.核心数值.性欲程度', ${safeNum(currentVars.核心数值?.性欲程度)});\n` +
                   `_.set('${userName}.精神与心理.快感累积', ${safeNum(currentVars.精神与心理?.快感累积)});\n` +
                   `_.set('${userName}.计数.性交.口', ${safeNum(c.性交?.口)});\n` +
                   `_.set('${userName}.计数.性交.小穴', ${safeNum(c.性交?.小穴)});\n` +
                   `_.set('${userName}.计数.性交.屁眼', ${safeNum(c.性交?.屁眼)});\n` +
                   `_.set('${userName}.计数.性交.乳穴', ${safeNum(c.性交?.乳穴)});\n` +
                   `_.set('${userName}.计数.射精.内射', ${safeNum(c.射精?.内射)});\n` +
                   `_.set('${userName}.计数.精液摄入.吞精次数', ${safeNum(c.精液摄入?.吞精次数)});\n` +
                   `_.set('${userName}.计数.高潮.总数', ${safeNum(c.高潮?.总数)});\n` +
                   `_.set('${userName}.计数.失控.喷潮', ${safeNum(c.失控?.喷潮)});\n` +
                   `_.set('${userName}.计数.失控.失禁', ${safeNum(c.失控?.失禁)});\n` +
                   `_.set('${userName}.体内精液存量.口内毫升', ${safeNum(sp.口内毫升)});\n` +
                   `_.set('${userName}.体内精液存量.小穴毫升', ${safeNum(sp.小穴毫升)});\n` +
                   `_.set('${userName}.体内精液存量.子宫毫升', ${safeNum(sp.子宫毫升)});\n` +
                   `_.set('${userName}.体内精液存量.屁眼毫升', ${safeNum(sp.屁眼毫升)});\n` +
                   `_.set('${userName}.痕迹与标记.体表痕迹', '${safeStr(mark.体表痕迹, "无")}');\n` +
                   `_.set('${userName}.痕迹与标记.淫纹与刻印', '${safeStr(mark.淫纹与刻印, "无")}');\n` +
                   `_.set('${userName}.痕迹与标记.穿刺与环饰', '${safeStr(mark.穿刺与环饰, "无")}');\n` +
                   `_.set('${userName}.体内道具与权限.体内道具', '${safeStr(prop.体内道具, "无")}');\n` +
                   `_.set('${userName}.实况.当前姿势', '简短概括当前姿势');\n` +
                   `_.set('${userName}.实况.内心独白', '符合当前崩坏阶位的第一人称心声');\n` +
                   `${closeTag}`;
        }

        // =========================================================================
        // 📸 新增功能3：一键生成当前项对应的 Lv.1~Lv.6 微距崩坏 <image> 块
        // =========================================================================
        function buildDanbooruImageBlock(item, curStageIdx, u) {
            const key = item.editKey || "custom";
            const stageNames = ["初绽完好", "初步驯化", "深度开发", "括约肌松弛", "重度畸变", "彻底崩坏"];
            const stgTag = stageNames[Math.min(5, Math.max(0, curStageIdx - 1))];

            const presets = {
                "骚口实况": [
                    { zh: "微距莹润红唇微启与晶莹拉丝津液", think: "第一阶段初始状态，双唇娇嫩饱满微启，舌尖轻抵下唇，牵出晶莹唾液丝线。", tag: "macro shot, mouth and lips focus, parted glossy pink lips, pink tongue tip, clear saliva strings", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "微距红肿唇瓣外翻与浓稠白浊挂丝", think: "第二阶段初步驯化，双唇微肿充血，舌头伸出承接黏稠乳白精液顺下巴滑落。", tag: "macro shot, open mouth and tongue focus, swollen red lips, protruding wet tongue, thick white cum on tongue", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "微距深喉扩口悬雍垂颤动与白沫满溢", think: "第三阶段深度开发，口腔大幅撑开，舌头压平，深处悬雍垂与充血喉口完全暴露，白沫咕嘟冒泡。", tag: "macro shot, wide open mouth focus, deep throat view, flattened tongue, visible uvula, frothy cum pooling in throat", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "微距咽喉肉环松弛洞开与澄黄圣水漩涡", think: "第四阶段括约肌松弛，咽喉深处呈圆筒状松弛肉穴，澄黄尿液与白浊在喉口交融满溢。", tag: "macro shot, gaping mouth and relaxed throat hole focus, numb everted lips, yellow urine and white cum swirling in deep throat", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "微距下颚半脱臼软肉外翻与浓稠浊液喷涌", think: "第五阶段重度畸变，下颚半脱臼无法闭拢，紫红唇肉外翻，食道反流喷涌混杂黄尿的白沫。", tag: "macro shot, dislocated gaping mouth focus, swollen purple-red everted lips, limp tongue hanging out, regurgitating frothy cum and yellow fluid", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "彻底崩坏微距脱臼漏斗状肉洞与腐熟白浊泡沫满溢", think: "第六阶段终极崩坏，下颚永久半脱臼洞开，唇肉紫红肿胀外翻，舌头麻痹歪斜，咽喉彻底扩张成黑洞般漏斗状排泄口器，大量混杂黄色尿液与浓稠精液的白沫失禁喷涌。", tag: "macro shot, corrupted gaping mouth focus, dilated throat hole, permanently gaping dislocated jaw, bruised swollen everted lips, paralyzed limp tongue hanging to side, wide open cavernous throat hole, overflowing thick cum and yellow fluid, completely ruined oral meat hole", uc: "eyes, forehead, full face, head, hair, upper body, breasts, boy, male, penis" }
                ],
                "小穴实况": [
                    { zh: "微距紧闭粉嫩花唇与晶莹露珠", think: "第一阶段完好处子，两瓣花唇粉嫩紧闭，干爽洁净。", tag: "macro shot, pussy focus, tight closed pink labia, virgin pussy, clean skin", uc: "face, upper body, gaping pussy" },
                    { zh: "微距初破充血花唇微张与拉丝爱液", think: "第二阶段初破红肿，外阴软肉充血微张，透明爱液牽丝滑落。", tag: "macro shot, pussy focus, slightly parted red swollen labia, clear vaginal fluids, wet string", uc: "face, upper body, closed pussy" },
                    { zh: "微距肥厚外翻黑木耳与白浊咕啾涌出", think: "第三阶段熟稔外翻，大小阴唇肥厚外翻且色素沉淀，浓白精液从穴口涌出。", tag: "macro shot, pussy focus, dark swollen everted labia minora, thick white cum leaking from vagina", uc: "face, upper body, tight pussy" },
                    { zh: "微距括约肌松弛两指洞开与白浆漏淌", think: "第四阶段括约肌松弛，阴道口撑开无法闭合，内部红肉可见，白浊混着淫水不断漏出。", tag: "macro shot, gaping pussy focus, relaxed open vaginal hole, visible red vaginal interior, overflowing cum", uc: "face, upper body, closed pussy" },
                    { zh: "微距内壁肉褶脱垂外翻与失禁漏精壶", think: "第五阶段肉壁脱垂，阴道内壁充血肉褶向外翻出穴口，丧失锁精能力。", tag: "macro shot, ruined gaping pussy focus, prolapsed vaginal mucosal folds, bruised everted labia, heavy cum and urine overflow", uc: "face, upper body, closed pussy" },
                    { zh: "彻底崩坏微距外翻紫红烂肉洞与腐熟白浊黄尿满溢", think: "第六阶段终极崩坏，大小阴唇紫红肿胀外翻如烂熟花瓣，阴道括约肌永久松弛洞开成黑洞漏斗，深处宫颈口下垂外露，大量混杂黄色尿液与浓稠精液的白沫不断喷涌。", tag: "macro shot, corrupted gaping pussy focus, dilated vaginal hole, permanently gaping ruined pussy, bruised swollen everted labia, dilated open urethral meatus, wide open cavernous vaginal hole, prolapsed visible cervix deep inside, overflowing thick cum and yellow urine foam, completely ruined meat hole", uc: "face, head, eyes, upper body, breasts, legs, feet, boy, male, penis" }
                ],
                "子宫实况": [
                    { zh: "微距内窥紧闭针尖宫颈口与纯净宫腔", think: "第一阶段紧闭处子，宫颈口紧密闭合。", tag: "macro shot, internal vaginal view, tight closed cervix, clean pink mucosa", uc: "face, external view" },
                    { zh: "微距内窥充血红肿宫颈口与微量白浊", think: "第二阶段宫口充血微松，表面挂着少许精液。", tag: "macro shot, internal cervix focus, red swollen cervix, cum on cervix", uc: "face, external view" },
                    { zh: "微距内窥扩张软肉环宫口与锁精吞吸", think: "第三阶段宫口扩张锁精，宫颈口被顶开呈环形吞吸白浊。", tag: "macro shot, dilated cervix focus, open cervical os, thick cum pouring into womb", uc: "face, external view" },
                    { zh: "微距内窥下坠松弛宫口与浓精倒流", think: "第四阶段宫腔肥大下坠，宫颈口常年微张无法闭合。", tag: "macro shot, gaping cervix focus, relaxed open womb entrance, overflowing semen", uc: "face, external view" },
                    { zh: "微距重度脱垂至穴口边缘的紫红宫颈口", think: "第五阶段宫颈重度脱垂，紫红肿胀的宫颈口顺阴道脱垂至外阴边缘。", tag: "macro shot, uterine prolapse focus, swollen purple-red cervix protruding near vaginal opening, dripping cum", uc: "face, upper body" },
                    { zh: "彻底崩坏微距完全掉出体外的外翻死肉宫口喷涌腐精", think: "第六阶段终极崩坏，整个紫黑色宫颈口彻底掉出阴道口外暴露在空气中，稍微按压小腹便从外翻宫口喷涌腐熟浓精与黄水。", tag: "macro shot, extreme cervical prolapse focus, bruised purple-black cervix hanging outside gaping pussy, wide open cervical hole, bubbling thick yellow fluid and white cum foam, completely ruined womb", uc: "face, head, upper body, breasts" }
                ]
            };

            const list = presets[key];
            const idx = Math.min(5, Math.max(0, curStageIdx - 1));
            const chosen = list ? list[idx] : {
                zh: `${item.cleanTitle || key}第${curStageIdx}阶段${stgTag}微距特写`,
                think: `第${curStageIdx}阶段（${stgTag}），展现${u}的${item.cleanTitle || key}在当前崩坏度下的极致微距特写细节。`,
                tag: `macro shot, extreme close-up, ${curStageIdx >= 5 ? "corrupted gaping meat hole, bruised swollen everted mucosa, overflowing thick cum and yellow fluid" : "erotic close-up, wet skin, glistening fluids"}`,
                uc: "face, upper body, zoomed out, text, watermark"
            };

            return `第${["一", "二", "三", "四", "五", "六"][idx]}阶段：${key}_${curStageIdx}（${stgTag}）\n<image>\n[${chosen.zh}]\n<image_think>\n${chosen.think}\n</image_think>\nimage###Scene:NSFW, 1girl, solo, 1.5::extreme close-up, ${chosen.tag}, filling the frame::, straight-on, dark erotic lighting;\nChar1:1.5::${u}::, pale sweaty skin, 1.8::${chosen.tag}::|centers:C3;\nChar1 UC:1.5::${chosen.uc}, multiple views, zoomed out, text, watermark::;###\n</image>`;
        }
        function fmtKey(rk, barTheme = "pleas", subBarCfg = null, hideBar = false, stagePctOverride = null) {
            const rawKeyStr = safeStr(rk, "状态项");
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            let pct = null, rawRatioStr = null;
            const m = rawKeyStr.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+(?:\.\d+)?)([a-zA-Z\u4e00-\u9fa5]*)/);
            if (m) {
                const cur = parseFloat(m[1]), max = parseFloat(m[2]);
                rawRatioStr = `${m[1]}/${m[2]}${m[3] || ""}`;
                if (max > 0) pct = Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
            } else {
                const sm = { "第一阶段": 0, "第二阶段": 28, "第三阶段": 48, "第四阶段": 68, "第五阶段": 88, "第六阶段": 100 };
                for (const [k, v] of Object.entries(sm)) if (rawKeyStr.includes(k)) { pct = v; break; }
            }

            const badges = [];
            let cleanTitle = rawKeyStr
                .replace(/「([^」]{1,45})」/g, (_, s) => {
                    const isStage6 = s.includes("第六阶段") || s.includes("彻底崩坏") || s.includes("畸变") || s.includes("100%");
                    const isStage5 = !isStage6 && (s.includes("第五阶段") || s.includes("脱垂") || s.includes("脱肛") || s.includes("便器"));
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
                    <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;justify-content:flex-end;margin-left:auto;">
                        ${badges.join("")}
                        <span class="st-inline-refresh-slot"></span>
                    </div>
                </div>`;

            let barHTML = "";
            if (pct !== null && !hideBar && barTheme !== "none") {
                const st = getThemedBarStyle(pct, barTheme);
                const mainLabel = subBarCfg ? `${pct}%` : (rawRatioStr && rawRatioStr.includes("ml") ? rawRatioStr : `${pct}%`);
                const barTitle = subBarCfg ? (subBarCfg.mainName || "💀 崩坏阶位") : `Lv.${st.tier + 1} 崩坏度`;

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
                            <span style="font-size:10.5px;color:${subSt.labelColor};font-weight:bold;">${subBarCfg.label || "💧 容量"} <b style="font-family:Consolas,monospace;">${subBarCfg.text || (subPct + "%")}</b></span>
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
            return { keyHTML, barHTML, cleanTitle, pct: finalPctForImg, hasStageBar: (!hideBar && barTheme !== "none" && pct !== null) };
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

            const endIdx = viewingHistoryFloor !== null ? Math.min(chatArr.length, viewingHistoryFloor + 1) : chatArr.length;
            const recent = chatArr.slice(Math.max(0, endIdx - 6), endIdx);
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

            res.identity = pick(/(?:变成了|重塑|身份|原本是|继承人|大小姐|千金|少宗主|妓女|暗娼|魅魔|夫人|妻子|母狗|性奴|身处)/, 2) || (personaDesc ? personaDesc.slice(0, 120) : `${u}当前正与 ${c} 处于剧情互动中。`);
            res.bodyDesc = pick(/(?:容颜|肌肤|皮肤|小手|十指|青丝|长发|柳腰|曲线|身段|丰满|白皙|臀|腿|掌印|指痕|咬痕)/, 3) || (charDesc ? charDesc.slice(0, 120) : `${u}拥有细腻敏感的娇躯。`);
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
        // 🧠 核心心理与躯体机能指标：Lv.1 完好如初 ➡️ Lv.6 彻底脑死/躯体废用畸变
        // =========================================================================
        function getDynamicMetricDetail(type, v, u) {
            const ovr = v.按钮详情?.[type];
            const map = {
                cockLove: {
                    val: safeNum(v.核心数值?.对肉棒好感度), rev: false,
                    st: ["抗拒戒备", "粘膜适应", "空虚渴求", "跪舔崇拜", "断根戒断", "脑干阳具寄生"],
                    d: [
                        `【🔬 阳具好感与神经回路（Lv.1 完好戒备）】：${u}神经与理智完好，对雄性阳具保持着强烈的警惕与排斥，本能抗拒异物侵入。\n💭【${u}的实时心声】：“*我必须离那种粗鲁肮脏的雄性东西远一点，绝不能让自己的清白受到半点玷污。*”`,
                        `【🔬 阳具好感与神经回路（Lv.2 粘膜适应）】：粘膜在反复摩擦中记住了阳具的轮廓与热度，排斥反应减退为麻木配合。\n💭【${u}的实时心声】：“*虽然心里还是觉得难为情，但身体粘膜似乎已经渐渐适应了那种滚烫异物的温度💦……*”`,
                        `【🔬 阳具好感与神经回路（Lv.3 空虚渴求）】：阴道与口腔神经已在抽插中食髓知味，空虚时内壁会本能地泛起酸痒并分泌润滑液。\n💭【${u}的实时心声】：“*小穴里面隐隐有些发空发痒，用手指根本比不上被滚烫肉棒塞满时的充实感呀😳💦……*”`,
                        `【🔬 阳具好感与神经回路（Lv.4 跪舔崇拜）】：大脑快感中枢已被阳具驯化，见到勃起巨物或闻到腥膻味便会双腿发软、唾液泛滥。\n💭【${u}的实时心声】：“*浓烈的雄性腥膻味一冲进鼻腔，下面就已经湿透了，好想快点跪下来用嘴和骚穴服侍大肉棒呀🥵💦！*”`,
                        `【🔬 阳具好感与神经回路（Lv.5 断根戒断）】：重度阳具成瘾畸变，一旦体内超过半小时没有肉棒填塞，就会产生全身发抖、冷汗淋漓的剧烈戒断反应。\n💭【${u}的实时心声】：“*呜汪♡……没有大肉棒塞着全身骨头都像有蚂蚁在咬一样难受，求求快插进来救救发瘾的母狗吧🥵💦❤️！*”`,
                        `【💀 第六阶段·脑干阳具寄生畸变（100% 彻底崩坏）】：大脑视觉与嗅觉中枢彻底崩坏畸变，眼中除了勃起肉棒外已无法识别任何人类面孔！全身孔穴24小时处于痉挛吸吮状态，一旦脱离肉棒超过一刻钟便会引发癫痫般翻白眼抽搐、疯狂抓烂自己私处的自残戒断症！\n💭【${u}的实时心声】：“*啊嘿♡……脑干里全都长满大肉棒的形状了，看不见别的了……不插着肉棒就会抽搐死掉的，请把肉棒焊死在我的烂肉洞里吧🥵💦❤️❤️！*”`
                    ]
                },
                lust: {
                    val: safeNum(v.核心数值?.性欲程度), rev: false,
                    st: ["清心克制", "春情微燥", "欲火焚身", "重度发骚", "狂暴发情", "下丘脑发情烧毁"],
                    d: [
                        `【🔬 情欲与内分泌实况（Lv.1 清心完好）】：下丘脑与内分泌系统完好平稳，心神清澈冷静，无任何异常情欲燥热。\n💭【${u}的实时心声】：“*现在心境很平静，身体没有任何奇怪的燥热感，可以冷静思考接下来的事。*”`,
                        `【🔬 情欲与内分泌实况（Lv.2 春情微燥）】：体内雌激素微升，小腹深处泛起淡淡温热，皮肤敏感度有所提高。\n💭【${u}的实时心声】：“*唔……不知怎么身体稍微有些发热，连呼吸都变得比平时温热了一点💦。*”`,
                        `【🔬 情欲与内分泌实况（Lv.3 欲火焚身）】：情欲翻涌，脸颊泛起潮红，乳尖发硬充血，私处不自觉分泌出湿润春水。\n💭【${u}的实时心声】：“*身体烫得厉害，两腿之间已经湿漉漉地黏在一起了，好想找个地方缓解这股燥热呀😳💦！*”`,
                        `【🔬 情欲与内分泌实况（Lv.4 重度发骚）】：内分泌失控过载，双腿本能地交叠磨蹭着充血外翻的阴唇，眼神迷离拉丝。\n💭【${u}的实时心声】：“*哈啊……淫水根本止不住地往外淌，乳头硬得发痛，满脑子都想着被粗暴地按住灭火呀🥵💦！*”`,
                        `【🔬 情欲与内分泌实况（Lv.5 狂暴发情）】：理智被滚烫情欲吞没，三穴不断涌出滚烫粘液，像发情期母兽般主动撅臀乞求交配。\n💭【${u}的实时心声】：“*啊啊♡……发情一秒钟都停不下来了，快过来把我按在地上狠狠干烂吧🥵💦❤️！*”`,
                        `【💀 第六阶段·下丘脑发情烧毁畸变（100% 彻底崩坏）】：控制体温与欲望的下丘脑因长期极限催情而彻底烧毁坏死！体温常年高达40℃，全身毛孔与崩坏三穴无休止地向外渗出浓郁催情粘液，彻底丧失睡眠与正常进食本能，化作一具不交配到死就不会停歇的发情肉偶！\n💭【${u}的实时心声】：“*啊嘿♡……脑子里的发情开关彻底烧化坏死了，全身都在冒火喷水……不睡觉不吃饭也要永远挨操交配呀🥵💦❤️❤️！*”`
                    ]
                },
                corr: {
                    val: safeNum(v.核心数值?.淫乱恶堕), rev: false,
                    st: ["完好清白", "初度染尘", "食髓知味", "放荡娼妇", "公用精盆", "彻底崩坏肉坑"],
                    d: [
                        `【🔬 道德人格与尊严实况（Lv.1 完好清白）】：人格与道德尊严完好无损，举止端庄自持，绝不接受任何下流亵渎。\n💭【${u}的实时心声】：“*无论处境如何变化，我都绝不会放弃自己的尊严与清白底线。*”`,
                        `【🔬 道德人格与尊严实况（Lv.2 初度染尘）】：在现实妥协或肉体冲击下，矜持防线出现裂痕，学会了用被动顺从来应对局面。\n💭【${u}的实时心声】：“*虽然心里还是觉得有些屈辱，但似乎已经不像最开始那样剧烈抗拒了💦……*”`,
                        `【🔬 道德人格与尊严实况（Lv.3 食髓知味）】：身体对情事已产生熟练的迎合肌肉记忆，道德负罪感大幅消退。\n💭【${u}的实时心声】：“*身体早就习惯了男人的温度与粗鲁摆弄，甚至在被填满时会忍不住主动夹紧迎合呢😳💦。*”`,
                        `【🔬 道德人格与尊严实况（Lv.4 放荡娼妇）】：尊严防线坍塌，彻底接纳并享受放荡欢愉，以用肉体榨干男人为乐。\n💭【${u}的实时心声】：“*什么清白体面全都是多余的，哪有张开双腿享受肉棒抽插和内射来得快活呀🥵💦！*”`,
                        `【🔬 道德人格与尊严实况（Lv.5 公用精盆）】：人格严重劣化，完全将自己视作供男人发泄兽欲的公用排泄精盆。\n💭【${u}的实时心声】：“*呜汪♡……我就是一件只要张开腿就能随便插进来射精的公用精盆，请尽情使用我吧🥵💦❤️！*”`,
                        `【💀 第六阶段·人格粉碎排泄肉坑（100% 彻底崩坏）】：属于人类女性的自尊、道德与人格回路100%物理坏死清零！发自骨髓地认知自己只是一块连牲畜都不如的烂肉痰盂与排泄肉坑，唯一存在价值就是被粗暴捅穿、灌满浓精与秽物直至腐烂报废！\n💭【${u}的实时心声】：“*啊嘿♡……人类的人格已经彻底死掉啦，人家现在只是一块专门接精液和尿液的烂肉坑，请把臭肉洞彻底操烂报废吧🥵💦❤️❤️！*”`
                    ]
                },
                shame: {
                    val: safeNum(v.精神与心理?.羞耻度, 100), rev: true,
                    st: ["羞愤自持", "耳根滚烫", "习以为常", "敞腿任看", "羞耻全灭", "羞耻神经坏死"],
                    d: [
                        `【🔬 羞耻神经防线（Lv.1 完好自持）】：羞耻心完好极强，极度注重衣着得体与身体隐私，稍有走光便会羞愤遮掩。\n💭【${u}的实时心声】：“*必须注意整理好衣襟与姿态，绝不能让人看到丝毫不雅的模样。*”`,
                        `【🔬 羞耻神经防线（Lv.2 耳根滚烫）】：在亲密接触或暴露下耳根滚烫、面红耳赤，遮挡动作变得有些迟疑无力。\n💭【${u}的实时心声】：“*脸颊烫得厉害……被人用那种灼热的视线盯着看，连手脚都不知道该往哪儿放了😳💦。*”`,
                        `【🔬 羞耻神经防线（Lv.3 习以为常）】：羞耻感已被磨平大半，赤裸身体或清理私处时已能保持平静麻木。\n💭【${u}的实时心声】：“*光着身子走动或者清理私处，现在的我早已经习以为常，不会再像以前那样大惊小怪了💦。*”`,
                        `【🔬 羞耻神经防线（Lv.4 敞腿任看）】：廉耻心瓦解，被人视奸红肿私处时非但不遮掩，反而会兴奋得分泌爱液。\n💭【${u}的实时心声】：“*就算现在被人撞见我一丝不挂的下流模样，我也会直接敞开双腿让他看个够哟🥵💦！*”`,
                        `【🔬 羞耻神经防线（Lv.5 羞耻全灭）】：羞耻回路逆转为强烈催情剂，极度渴望在众人围观与镜头下展示外翻烂穴。\n💭【${u}的实时心声】：“*啊啊♡……快让所有人都来看看这具刚被玩弄过、还在往外漏精滴尿的骚身体吧🥵💦❤️！*”`,
                        `【💀 第六阶段·羞耻神经彻底坏死（0/100 彻底崩坏）】：大脑掌管廉耻的神经区域100%萎缩坏死！彻底丧失遮羞概念，只有在大庭广众之下掰开外翻脱垂的烂肉洞、当众潮吹喷尿甚至排泄失禁时，才能刺激麻木的脑干产生绝顶快感！\n💭【${u}的实时心声】：“*啊嘿♡……羞耻是什么早就忘光啦！快把聚光灯打在人家合不拢的脱垂烂穴上，看母猪当众喷尿失禁高潮吧🥵💦❤️❤️！*”`
                    ]
                },
                obey: {
                    val: safeNum(v.精神与心理?.服从度), rev: false,
                    st: ["孤高自主", "被动妥协", "温顺配合", "摇尾乞怜", "绝对盲从", "前额叶切除木偶"],
                    d: [
                        `【🔬 自由意志与服从实况（Lv.1 完好自主）】：自我意志独立坚定，保有强烈的防备心与反抗意识，绝不轻易屈服。\n💭【${u}的实时心声】：“*我的身体与意志只属于我自己，任何人都休想随便摆布我。*”`,
                        `【🔬 自由意志与服从实况（Lv.2 被动妥协）】：在局势压迫下学会了低头妥协，面对要求会选择被动配合。\n💭【${u}的实时心声】：“*人在屋檐下不得不低头……眼下还是先顺从配合，不要激怒对方为好💦。*”`,
                        `【🔬 自由意志与服从实况（Lv.3 温顺配合）】：已形成温顺配合的肌肉记忆，面对男人的折腾与善后清理都十分熟练听话。\n💭【${u}的实时心声】：“*乖乖听话把事情做好、把身体收拾干净准备接下来的安排，身体已经完全习惯顺从了😳💦。*”`,
                        `【🔬 自由意志与服从实况（Lv.4 摇尾乞怜）】：反抗意志被彻底驯服，面对粗暴虐待毫无怨言，甚至会主动塌腰撅臀讨好。\n💭【${u}的实时心声】：“*只要一声令下，无论让我摆出什么屈辱的姿势伺候，我都会乖乖听话照做的🥵💦！*”`,
                        `【🔬 自由意志与服从实况（Lv.5 绝对盲从）】：完全丧失拒绝能力，将服从男人的一切残酷改造与下流玩法视为唯一本能。\n💭【${u}的实时心声】：“*呜汪♡……只要主人们高兴，要把我怎么捆起来改造、怎么轮流内射都可以呀🥵💦❤️！*”`,
                        `【💀 第六阶段·前额叶切除级肉偶（100% 彻底崩坏）】：掌管独立思考与反抗的大脑前额叶功能100%报废坏死，如同被实施了脑白质切除术！彻底丧失人类复杂语言组织能力，只会流着口水发出“啊嘿、呜汪”的单音节喘息，哪怕命令她自己掰烂私处或吞食秽物也会条件反射般立即执行！\n💭【${u}的实时心声】：“*啊嘿……呜汪♡……脑子空空的不会思考了，听见声音就自动掰开烂穴喷水等插……主人让怎么弄坏就怎么弄坏呀🥵💦❤️❤️！*”`
                    ]
                },
                pleas: {
                    val: safeNum(v.精神与心理?.快感累积), rev: false,
                    st: ["神思清明", "尾椎微麻", "趾尖蜷缩", "濒临绝顶", "潮吹失神", "多巴胺烧穿熔断"],
                    d: [
                        `【🔬 神经快感与脑负荷（Lv.1 完好清明）】：神经系统处于平稳正常状态，体内无异常快感电流残留。\n💭【${u}的实时心声】：“*呼吸平稳，身体没有任何异常的酸麻或失控感。*”`,
                        `【🔬 神经快感与脑负荷（Lv.2 尾椎微麻）】：敏感带残留着微弱的酥麻与酸胀余温，走动或触碰时会泛起涟漪。\n💭【${u}的实时心声】：“*呼……身体深处还残留着一点微妙的酸麻感，稍微动一下还是能感觉到粘膜温热的触感💦。*”`,
                        `【🔬 神经快感与脑负荷（Lv.3 趾尖蜷缩）】：酥麻电流顺着尾椎骨向上攀升，呼吸急促，脚趾本能地微微蜷缩。\n💭【${u}的实时心声】：“*唔嗯……酥麻感一波接一波往上涌，连脚趾头都忍不住蜷缩起来了😳💦！*”`,
                        `【🔬 神经快感与脑负荷（Lv.4 濒临绝顶）】：快感蓄积至临界点，全身括约肌剧烈痉挛收缩，随时可能泄身绝顶。\n💭【${u}的实时心声】：“*要、要去了！小肚子和深处全都绷紧到极限了，再刺激一下就会当场高潮出来的呀🥵💦！*”`,
                        `【🔬 神经快感与脑负荷（Lv.5 潮吹失神）】：连续高潮过载导致大脑一片空白，伴随剧烈抽搐与失控潮吹喷涌。\n💭【${u}的实时心声】：“*啊啊——去了♡！！全身骨头都爽得融化成水了，潮吹根本停不下来呀🥵💦❤️！*”`,
                        `【💀 第六阶段·多巴胺受体烧穿熔断（100% 彻底崩坏）】：过量极限高潮将大脑多巴胺受体彻底烧穿坏死！双眼黑眼球永久性向上翻白无法复位，舌头麻痹歪斜吐出嘴外，全身神经陷入永不停止的帕金森式痉挛绝顶与失禁狂喷状态！\n💭【${u}的实时心声】：“*啊嘿♡——咕嘿嘿！！脑髓彻底烧穿短路啦，眼珠翻不回来、全身一秒钟不停地抽搐喷尿高潮到死呀🥵💦❤️❤️！*”`
                    ]
                },
                sta: {
                    val: safeNum(v.身体?.体力, 100), rev: true,
                    st: ["亭亭玉立", "腰腿酸软", "膝软外八不合", "双腿痉挛瘫软", "髋骨脱臼爬行", "四肢废用肉垫"],
                    d: [
                        `【🔬 躯体骨骼与运动机能（Lv.1 完好充沛）】：体力充沛（${safeNum(v.身体?.体力, 100)}/100），骨骼肌肉完好，身姿挺拔，行动自如。\n💭【${u}的实时心声】：“*目前精力很充沛，四肢百骸都充满力气，姿态端正稳健。*”`,
                        `【🔬 躯体骨骼与运动机能（Lv.2 腰腿酸软）】：略带倦意，额角见汗，腰腹与双腿肌肉有些酸软沉重。\n💭【${u}的实时心声】：“*稍微出了一身薄汗，腰和腿都有点酸沉沉的，需要稍微缓一缓💦。*”`,
                        `【🔬 躯体骨骼与运动机能（Lv.3 膝软外八不合）】：长期张腿承受冲击导致大腿内收肌拉伤松弛，膝盖打颤，走路时双腿自然呈外八字无法完全并拢。\n💭【${u}的实时心声】：“*膝盖一直在发抖，大腿根部的肌肉酸软得根本并拢不了，走起路来姿势怪怪的😳💦。*”`,
                        `【🔬 躯体骨骼与运动机能（Lv.4 双腿痉挛瘫软）】：体力濒临枯竭，腰椎酸痛无力，双腿不时发生神经性抽搐，连独自站稳都极为勉强。\n💭【${u}的实时心声】：“*哈啊……浑身上下一点力气都使不出来了，双腿软得只能敞开着瘫倒下来🥵💦……*”`,
                        `【🔬 躯体骨骼与运动机能（Lv.5 髋骨脱臼母犬爬行）】：盆骨与双侧髋关节被粗暴抽插撞得习惯性半脱臼变形！彻底丧失直立行走能力，只能塌下脊背、高撅屁股像母狗一样四肢着地爬行。\n💭【${u}的实时心声】：“*呜汪♡……胯骨早就被撞脱臼站不起来了，只能像母狗一样撅着烂屁股在地上爬着等肉棒插进来呀🥵💦❤️！*”`,
                        `【💀 第六阶段·四肢废用痉挛肉垫（0/100 彻底崩坏）】：运动神经与四肢肌肉因长期捆绑与极限摧残而彻底废用萎缩，脊椎与盆骨永久性畸形固定为贴地M字大开腿撅臀角度！彻底化作一团无法自主翻身移动、只会抽搐翻白眼吐白沫的活体肉便器坐垫！\n💭【${u}的实时心声】：“*啊嘿♡……手脚彻底废掉动不了啦，骨头已经长死成M字开腿撅屁股的肉垫形状了，请直接踩在肉块上排泄内射吧🥵💦❤️❤️！*”`
                    ]
                }
            };
            const cfg = map[type] || map.cockLove;
            const t = tier6(cfg.val, cfg.rev);
            if (ovr && (ovr.desc || ovr.thought)) {
                return {
                    val: cfg.val,
                    stage: ovr.stage || cfg.st[t],
                    desc: `${ovr.desc || cfg.d[t].split("💭")[0]}\n💭【${u}的实时心声】：“*${cleanThoughtText(ovr.thought || "……")}*”`
                };
            }
            return {
                val: cfg.val,
                stage: cfg.st[t],
                desc: cfg.d[t]
            };
        }

        // =========================================================================
        // 📋 构建 9 大板块（严格区分「无阶段展示项」与「Lv.1完好➡️Lv.6彻底崩坏畸变项」）
        // =========================================================================
        function buildFullFallbackCategories(u, c, v) {
            calibrateMentalMetrics(v);
            const dev = computeAllOrganDevelopments(v);

            const ovr = v.按钮详情 || {};
            const mk = (editKey, defaultRawKey, desc, barTheme = "pleas", subBarCfg = null, hideBar = false, stagePctOverride = null, extraProps = {}) => {
                const customTitle = ovr[editKey]?.customTitle;
                const customStage = ovr[editKey]?.stage;
                let finalRawKey = customTitle || defaultRawKey;
                if (!customTitle && customStage && /「[^」]+」/.test(finalRawKey)) {
                    finalRawKey = finalRawKey.replace(/「[^」]+」/, `「${customStage}」`);
                }
                return { editKey, rawKey: finalRawKey, desc, ...fmtKey(finalRawKey, barTheme, subBarCfg, hideBar, stagePctOverride), ...extraProps };
            };

            const live = extractDynamicContext(u, c);
            const diff = getDifficultyProfile();
            const realId = detectRealCharacterIdentity(v);
            const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {}, prof = v.档案 || {}, rt = v.实况 || {}, wear = v.穿搭 || {}, preg = v.受孕与生理 || {};

            const cockM = getDynamicMetricDetail("cockLove", v, u);
            const lustM = getDynamicMetricDetail("lust", v, u);
            const corrM = getDynamicMetricDetail("corr", v, u);
            const shameM = getDynamicMetricDetail("shame", v, u);
            const obeyM = getDynamicMetricDetail("obey", v, u);
            const pleasM = getDynamicMetricDetail("pleas", v, u);
            const staM = getDynamicMetricDetail("sta", v, u);

            const vagCnt = safeNum(cnt.性交?.小穴), mouthCnt = safeNum(cnt.性交?.口), analCnt = safeNum(cnt.性交?.屁眼), titCnt = safeNum(cnt.性交?.乳穴), footCnt = safeNum(cnt.性交?.足腿), beastCnt = safeNum(cnt.性交?.兽交异种);
            const creampie = safeNum(cnt.射精?.内射), facialCnt = safeNum(cnt.射精?.颜射体外), swallowCnt = safeNum(cnt.精液摄入?.吞精次数), swallowMl = safeNum(cnt.精液摄入?.累计毫升);
            const orgasmCnt = safeNum(cnt.高潮?.总数), forceOrgCnt = safeNum(cnt.高潮?.强制), edgeCnt = safeNum(cnt.高潮?.寸止);
            const leakCnt = safeNum(cnt.失控?.失禁), squirtCnt = safeNum(cnt.失控?.喷潮), ahegaoCnt = safeNum(cnt.失控?.阿嘿颜);
            const hookerCnt = safeNum(cnt.交易?.接客卖身), gangCnt = safeNum(cnt.交易?.轮奸群交), sleepCnt = safeNum(cnt.交易?.睡眠昏迷奸);
            const milkCnt = safeNum(cnt.泌乳?.喷乳次数), milkMl = safeNum(cnt.泌乳?.累计毫升), mastCnt = safeNum(cnt.自慰);

            let mouthMl = safeNum(sp.口内毫升), vagMl = safeNum(sp.小穴毫升), wombMl = safeNum(sp.子宫毫升), analMl = safeNum(sp.屁眼毫升);
            const totalMl = mouthMl + vagMl + wombMl + analMl;
            const caps = calcHoleCapacities(v);

            const corr = safeNum(v.核心数值?.淫乱恶堕), lust = safeNum(v.核心数值?.性欲程度), pleas = safeNum(v.精神与心理?.快感累积);
            const isPureZero = (dev.totalLedgerCount === 0 && totalMl === 0 && corr < 15 && dev.all6OrganAvg === 0);

            const vagWidth = (1.5 + Math.min(8.5, (vagCnt / diff.mult) * 0.08 + dev.vagObj.val * 0.06)).toFixed(1);
            const vagClose = Math.max(0, Math.round(100 - dev.vagObj.val * 0.95 - ((wombMl + vagMl) > 0 ? 15 : 0)));
            const clitSize = (4.0 + Math.min(22.0, (orgasmCnt / diff.mult) * 0.15 + dev.clitObj.val * 0.18)).toFixed(1);
            const peeVal = isPureZero ? 0 : Math.min(100, Math.round(dev.clitObj.val * 0.6 + lust * 0.2 + pleas * 0.2 + leakCnt * 6));
            const wetLevel = isPureZero ? 0 : Math.min(100, Math.round(lust * 0.65 + pleas * 0.55 + ((wombMl + vagMl) > 0 ? 30 : 0)));
            const fallVal = safeNum(v.精神与心理?.沦陷度), brkVal = safeNum(v.精神与心理?.人格崩解度), hypnoVal = safeNum(extPsy.催眠深度);
            const drugVal = typeof v.上帝强制锁定?.["媚药毒瘾"] === "number" ? v.上帝强制锁定["媚药毒瘾"] : safeNum(v.精神与心理?.媚药精液毒瘾);
            const fallMax = typeof v.上帝强制锁定?.["精神沦陷"] === "number" ? v.上帝强制锁定["精神沦陷"] : Math.max(fallVal, brkVal, hypnoVal);
            const fallTier = tier6(fallMax, false);
            const sensMult = (1.0 + corr * 0.06 + dev.all6OrganAvg * 0.05 + (vagCnt > 0 ? 1.0 : 0)).toFixed(1);

            const mouthDev = dev.mouthObj.val;
            const chestDev = dev.chestObj.val;
            const vagDev   = dev.vagObj.val;
            const wombDev  = dev.wombObj.val;
            const clitDev  = dev.clitObj.val;
            const analDev  = dev.analObj.val;

            // 1. 正字涂鸦与伤痕
            const rawScarStr = `${safeStr(mark.体表痕迹)} ${safeStr(mark.公开涂鸦字迹)}`;
            const isPermScar = /刺青|纹身|烙铁|烙印|烫伤|刀刻|烂肉|深可见骨/.test(rawScarStr);
            const hasScarsOrTally = (mark.体表痕迹 && mark.体表痕迹 !== "无") || (mark.公开涂鸦字迹 && mark.公开涂鸦字迹 !== "无") || safeNum(mark.鞭痕与掌印) > 0;
            const tallyStrokes = hasScarsOrTally ? (safeNum(mark.鞭痕与掌印) * 4 + (mark.公开涂鸦字迹 && mark.公开涂鸦字迹 !== "无" ? Math.max(5, creampie + vagCnt) : 0)) : 0;
            const tallyFull = Math.floor(tallyStrokes / 5);
            let rawScarDev = 0;
            if (hasScarsOrTally) {
                rawScarDev = isPermScar
                    ? Math.max(62, calcStage6Score(tallyStrokes + 80, 1.0, diff.mult, /烂肉|刀刻/.test(rawScarStr)).val)
                    : Math.min(58, Math.max(22, 20 + tallyFull * 6 + safeNum(mark.鞭痕与掌印) * 3));
            }
            const tallyDev = typeof v.上帝强制锁定?.["正字涂鸦"] === "number"
                ? v.上帝强制锁定["正字涂鸦"]
                : (isPermScar
                    ? lockIrreversible(v, "mod_scar", rawScarDev, "正字涂鸦")
                    : Math.max(hasScarsOrTally ? rawScarDev : 0, safeNum(v.历史最高崩坏度?.mod_scar) >= 60 ? v.历史最高崩坏度.mod_scar : 0));

            // 2. 淫纹烙印
            const rawTattooStr = safeStr(mark.淫纹与刻印);
            const isPermTattoo = /永久|烙印|刺青|漆黑刻印|荧光|异化|触须|魔腹|腐蚀/.test(rawTattooStr);
            const hasTattoo = Boolean(mark.淫纹与刻印 && mark.淫纹与刻印 !== "无" && !/无外显|未刻|光洁/.test(rawTattooStr));
            const rawTattooDev = hasTattoo ? (isPermTattoo ? Math.max(45, Math.min(100, Math.round(40 + corr * 0.6))) : Math.min(39, Math.max(22, Math.round(20 + lust * 0.2)))) : 0;
            const tattooDev = typeof v.上帝强制锁定?.["淫纹烙印"] === "number"
                ? v.上帝强制锁定["淫纹烙印"]
                : (isPermTattoo
                    ? lockIrreversible(v, "mod_tattoo", rawTattooDev, "淫纹烙印")
                    : Math.max(hasTattoo ? rawTattooDev : 0, safeNum(v.历史最高崩坏度?.mod_tattoo) >= 45 ? v.历史最高崩坏度.mod_tattoo : 0));

            // 3. 穿刺环饰
            const rawPierceStr = safeStr(mark.穿刺与环饰);
            const isPermPierce = /铁牢|缝合|锁死|撕裂|钢筋|嵌合|生锈/.test(rawPierceStr);
            const hasPierce = Boolean(mark.穿刺与环饰 && mark.穿刺与环饰 !== "无" && !/无穿刺|未穿刺/.test(rawPierceStr));
            const rawPierceDev = hasPierce ? (isPermPierce ? Math.max(62, Math.min(100, Math.round(55 + corr * 0.45))) : Math.min(58, Math.max(25, Math.round(25 + corr * 0.3)))) : 0;
            const pierceDev = typeof v.上帝强制锁定?.["穿刺环饰"] === "number"
                ? v.上帝强制锁定["穿刺环饰"]
                : (isPermPierce
                    ? lockIrreversible(v, "mod_pierce", rawPierceDev, "穿刺环饰")
                    : Math.max(hasPierce ? rawPierceDev : 0, safeNum(v.历史最高崩坏度?.mod_pierce) >= 60 ? v.历史最高崩坏度.mod_pierce : 0));

            // 4. 体内道具
            const rawPropStr = safeStr(prop.体内道具);
            const isPermProp = /机械|电缆|触手|铆钉|焊死|核心|齿轮/.test(rawPropStr);
            const hasProp = Boolean(prop.体内道具 && prop.体内道具 !== "无" && !/无填塞|无道具|存留.*浓精/.test(rawPropStr));
            let rawPropDev = 0;
            if (hasProp) {
                rawPropDev = isPermProp
                    ? Math.max(65, Math.min(100, Math.round(60 + corr * 0.4)))
                    : Math.min(58, Math.max(25, Math.round(25 + pleas * 0.3)));
            }
            const propDev = typeof v.上帝强制锁定?.["体内道具"] === "number"
                ? v.上帝强制锁定["体内道具"]
                : (isPermProp
                    ? lockIrreversible(v, "mod_prop", rawPropDev, "体内道具")
                    : Math.max(hasProp ? rawPropDev : 0, safeNum(v.历史最高崩坏度?.mod_prop) >= 60 ? v.历史最高崩坏度.mod_prop : 0));

            // 苗床与受孕四大器质崩坏度
            const rawOvulDev = (creampie + drugVal + forceOrgCnt) > 0
                ? calcStage6Score(creampie * 1.1 + drugVal * 0.8 + forceOrgCnt * 1.2, 1.0, diff.mult, creampie >= 90 * diff.mult).val
                : 0;
            const ovulStageVal = lockIrreversible(v, "preg_ovul", rawOvulDev, "排卵周期");

            const rawXrayDev = (creampie + wombMl + safeNum(preg.生产产卵次数)) > 0
                ? Math.min(100, Math.round(wombDev * 0.75 + (wombMl > 0 ? 22 : 0) + safeNum(preg.生产产卵次数) * 15))
                : 0;
            const xrayStageVal = lockIrreversible(v, "preg_xray", rawXrayDev, "受精断面");

            const rawDnaDev = (creampie + swallowCnt + gangCnt + beastCnt) > 0
                ? calcStage6Score(creampie * 1.2 + swallowCnt * 0.9 + gangCnt * 2.5 + beastCnt * 4, 1.0, diff.mult, (creampie + swallowCnt) >= 120 * diff.mult).val
                : 0;
            const dnaStageVal = lockIrreversible(v, "preg_dna", rawDnaDev, "精液归属");

            const bellySwellPct = Math.min(100, Math.round(safeNum(preg.怀孕进度) + (totalMl / Math.max(60, caps.wombMax)) * 65));
            const rawPregDev = (preg.子宫怀孕 || totalMl > 0 || safeNum(preg.生产产卵次数) > 0 || creampie > 10)
                ? Math.min(100, Math.max(bellySwellPct, Math.round(safeNum(preg.生产产卵次数) * 28 + (creampie / diff.mult) * 0.8)))
                : 0;
            const pregStageVal = lockIrreversible(v, "preg_belly", rawPregDev, "孕肚进度");

            const bodyTotalCorrupt = typeof v.上帝强制锁定?.["肉体外貌"] === "number"
                ? v.上帝强制锁定["肉体外貌"]
                : Math.round(dev.all6OrganAvg * 0.6 + (tallyDev + tattooDev + pierceDev + propDev) * 0.1);

            const mouthStg = `${stageNameFromVal(mouthDev)}•${["洁净初唇", "唇肿涎溢", "咽喉松弛", "颚骨半脱臼", "食道肉壶化", "口腔排泄器畸变"][tier6(mouthDev)]}`;
            const chestStg = `${stageNameFromVal(chestDev)}•${["娇嫩处乳", "乳尖肥大", "乳晕黑紫扩张", "乳腺失控漏奶", "下垂巨乳奶袋", "崩坏泌乳肉囊"][tier6(chestDev)]}`;
            const vagStg   = `${stageNameFromVal(vagDev)}•${["紧致初鲍", "初破红肿", "外翻黑木耳", "括约肌松弛洞开", "肉壁脱垂漏精壶", "彻底崩坏烂肉洞"][tier6(vagDev)]}`;
            const wombStg  = `${stageNameFromVal(wombDev)}•${["紧闭处子", "宫口充血微松", "宫口扩张锁精", "宫腔肥大下坠", "宫颈重度脱垂", "外翻脱垂死肉苗床"][tier6(wombDev)]}`;
            const clitStg  = `${stageNameFromVal(clitDev)}•${["包皮隐没", "充血外露", "阴蒂肥大勃起", "尿道扩张漏尿", "阴蒂肉棒化失禁", "括约肌坏死漏尿狂"][tier6(clitDev)]}`;
            const analStg  = `${stageNameFromVal(analDev)}•${["紧闭菊蕾", "裂伤红肿", "褶皱磨平松弛", "后庭空洞不合", "直肠翻肉轻度脱肛", "重度脱肛崩坏排泄腔"][tier6(analDev)]}`;

            const scarStg   = `${stageNameFromVal(tallyDev)}•${["白皙无瑕", "初次记数", "淫语密布", "刺青入骨", "烙铁烫印", "烂肉记事本"][tier6(tallyDev)]}`;
            const tattooStg = `${stageNameFromVal(tattooDev)}•${["平坦白腹", "初显魔纹", "漆黑刻印", "发情荧光", "肉体异化", "恶堕魔腹"][tier6(tattooDev)]}`;
            const pierceStg = `${stageNameFromVal(pierceDev)}•${["天然无饰", "初上银环", "重金属坠", "密集铁牢", "皮肉撕裂", "金属嵌合体"][tier6(pierceDev)]}`;
            const propStg   = `${stageNameFromVal(propDev)}•${["空荡纯净", "微露拉环", "巨物撑扩", "机械群交", "内脏异形化", "永久机械肉壶"][tier6(propDev)]}`;

            const milkCap = Math.round(100 + milkCnt * 15);
            const curMilkMl = milkCnt > 0 ? Math.min(milkCap, Math.round(25 + lust * 0.8 + pleas * 0.5)) : 0;

            const fertProb = safeNum(preg.受孕概率, wombMl > 0 ? 75 : (creampie > 0 ? 40 : (isPureZero ? 0 : 15)));
            const cycLabel = isPureZero ? (preg.生理周期阶段 || "正常生理期") : (preg.生理周期阶段 === "正常生理期" && wombMl > 0 ? "危险排卵期" : (preg.生理周期阶段 || "危险排卵期"));

            const ovulStg = `${stageNameFromVal(ovulStageVal)}•${["平静安宁", "初潮萌动", "异常催促", "排卵失控", "异种卵生", "永久下崽机器"][tier6(ovulStageVal)]}`;
            const xrayStg = `${stageNameFromVal(xrayStageVal)}•${["无暇孤卵", "精群围攻", "破膜着床", "多重受孕", "异种寄生", "腐肉苗床"][tier6(xrayStageVal)]}`;
            const dnaStg  = `${stageNameFromVal(dnaStageVal)}•${["无暇无浊", "体外喷溅", "内射满溢", "全身精涂", "肌体吸精", "白浊黏液怪"][tier6(dnaStageVal)]}`;
            const pregStg = `${stageNameFromVal(pregStageVal)}•${["平坦马甲线", "微凸孕相", "显怀大肚", "胎动破肚", "下垂肉囊", "透明异种孵化巢"][tier6(pregStageVal)]}`;
            const totalCapAll = caps.mouthMax + caps.vagMax + caps.wombMax + caps.analMax;

            const marketRank = corr >= 100 ? "EX神格·崩坏便器" : corr >= 80 ? "SSS级·公用便器" : corr >= 50 ? "A级·风俗名器" : hookerCnt > 0 ? "B级·暗娼熟肉" : "S级·纯洁无瑕";
            const marketPrice = prof.风月挂牌身价 || (hookerCnt > 0 ? `单次皮肉资 ${Math.max(50, 500 - corr * 4)} 元（已接客 ${hookerCnt} 次）` : `无价之宝（清白之身，尚未涉足风尘交易）`);

            const fmtOvr = (key, defObj, defThoughtArr, specificStageVal = null, isRev = false) => {
                const defaultThought = Array.isArray(defThoughtArr) ? pickStageThought(v, defThoughtArr, specificStageVal, isRev) : defThoughtArr;
                if (ovr[key] && (ovr[key].desc || ovr[key].thought)) {
                    return `${ovr[key].desc || defObj}\n💭【${u}的实时心声】：“*${cleanThoughtText(ovr[key].thought || defaultThought)}*”`;
                }
                return `${defObj}\n💭【${u}的实时心声】：“*${cleanThoughtText(defaultThought)}*”`;
            };

            const defaultMonologue = pickStageThought(v, [
                `我叫${u}，无论周围处境如何变化，我都必须保持冷静清醒，守护好自己的尊严与清白。`,
                `呼……身体稍微有些发热发软，我得尽快调整好呼吸与状态，应付接下来的局面💦。`,
                `身体深处还残留着难以忽视的酸胀感与湿热感，必须抓紧时间清理收拾干净，准备应对接下来的事😳💦。`,
                `哈啊……小肚子里沉甸甸地往下坠，被开发过的熟稔身体越来越松软易湿了，稍微动一下就让人腿软呢🥵💦！`,
                `呜汪♡……身体从里到外都已经被操成了贪恋肉棒与浓精的崩坏形状，真想快点被粗暴地按在床上狠狠灌满呀🥵💦❤️！`,
                `啊嘿♡……脑髓和全身孔穴都已经100%崩坏畸变成流着浓精和骚尿的活体排泄肉坑了，请把${u}彻底操烂报废吧🥵💦❤️❤️！`
            ]);
            const curThought = cleanThoughtText(ovr.内心独白?.thought || rt.内心独白 || live.thought || defaultMonologue);
            const curPose = rt.当前姿势 || live.pose || (isPureZero ? `${u}身姿端正，神色平静自然。` : `${u}正调整着呼吸与姿态。`);
            const allClothStr = safeStr(rt.当前衣装 || prop.穿戴中的标记物);

            const pickClothPart = (reg, fallbackStr) => {
                if (!allClothStr) return fallbackStr;
                const parts = allClothStr.split(/[、，；,;]+/).filter(s => reg.test(s));
                return parts.length ? parts.join("、") : fallbackStr;
            };

            const wearStateTag = wetLevel >= 80 ? "🔞赤裸泥泞" : wetLevel >= 50 ? "🔥汗湿凌乱" : wetLevel >= 20 ? "💦微乱泛潮" : "✨整洁得体";
            const headTxt = ovr.穿搭_头饰?.stage || wear.头饰与眼部 || live.headWear || pickClothPart(/(?:发|簪|冠|耳|眼|镜|面|帽)/, isPureZero ? "发丝整洁•神色清澈" : "汗湿发丝•微喘潮红");
            const neckTxt = ovr.穿搭_颈部?.stage || wear.颈部与项圈 || live.neckWear || pickClothPart(/(?:项圈|颈|领|锁骨|链|巾)/, isPureZero ? "脖颈白皙•衣领端正" : "锁骨微汗•红痕显眼");
            const braTxt = ovr.穿搭_胸罩?.stage || wear.胸罩与裹胸 || live.braWear || pickClothPart(/(?:裹胸|胸罩|文胸|肚兜|乳|内衬|真空)/, isPureZero ? "贴身内衬•包裹完好" : "胸口起伏•乳尖微挺");
            const topTxt = ovr.穿搭_上衣?.stage || wear.上衣与束腰 || live.topWear || pickClothPart(/(?:袍|衣|衫|T恤|束腰|腰带|甲|服|睡裙)/, isPureZero ? "外衫整洁•束腰合度" : "衣衫半解•薄汗贴背");
            const pantyTxt = ovr.穿搭_内裤?.stage || wear.内裤与遮挡 || live.pantyWear || pickClothPart(/(?:衬裤|内裤|底裤|丁字裤|开裆|胖次|光裸)/, isPureZero ? "干净底裤•严密遮护" : "腿心湿润•粘液渗出");
            const botTxt = ovr.穿搭_下装?.stage || wear.下装与裙裤 || live.bottomWear || pickClothPart(/(?:裙|裤|下摆)/, isPureZero ? "裙裤垂顺•端庄得体" : "下摆凌乱•臀线紧绷");
            const sockTxt = ovr.穿搭_丝袜?.stage || wear.丝袜与腿部 || live.sockWear || pickClothPart(/(?:袜|丝|腿环|绑腿|裸腿)/, isPureZero ? "双腿修长•姿态端正" : "双腿微颤•肌肤泛潮");
            const shoeTxt = ovr.穿搭_鞋子?.stage || wear.鞋子与玉足 || live.shoeWear || pickClothPart(/(?:靴|鞋|拖鞋|履|足)/, isPureZero ? "鞋履整洁•步履平稳" : "玉足微蜷•步履酸软");

            const unlockedFetishes = computeUnlockedFetishes(v);
            const fetishItems = unlockedFetishes.length > 0
                ? unlockedFetishes.map(fObj => mk(`fetish_${fObj.name}`, `🧬 ${fObj.name}：${fObj.val}/100「${fObj.stage}」`, buildFetishRichDesc(fObj, v, u), "corr"))
                : [mk("fetish_none", `🔒 暂无性癖「完好未染」`,
                    `【性癖状态】：\n当前所有性交、高潮、内射与受虐记录均为 0，尚未产生任何神经强迫或后天性癖畸变。\n💭【${u}的实时心声】：“*我现在的身心依然保持着原本的纯净完好，没有任何奇怪下流的癖好。*”`, "none", null, true, 0)];

            const clientList = extractClientsFromHistory(v, u, c);
            const clientItems = clientList.length > 0
                ? clientList.map((cl, idx) => mk(
                    `client_${idx}`,
                    `🍆 ${cl.name}：${cl.val}/100「${cl.roleTag}•${cl.statusTag}」`,
                    `${cl.detailDesc}\n💭【${u}的实时心声】：“*${cleanThoughtText(cl.thoughtStr)}*”`,
                    "cockLove",
                    cl.dnaShare > 0 ? { mainName: "🍆 调教崩坏度", label: "🧬 宫内DNA", theme: "semen", pct: cl.dnaShare, text: `${cl.dnaShare}%` } : null,
                    false,
                    null,
                    { isClient: true, clientName: cl.name }
                ))
                : [mk("client_none", `🔒 暂无恩客记录「完好清白」`,
                    `【恩客图鉴】：\n当前尚未与任何男性建立实质性的肉体支配或接客记录。\n💭【${u}的实时心声】：“*我还没有被任何男人占有过，自然也没有所谓的恩客记录。*”`, "none", null, true, 0)];
            const baseCategories = [
                // 1. 档案与风评（仅「肉体畸变总览」与「姿势与躯体机能」有阶段条，其余4项为无阶段纯展示）
                {
                    title: "档案与风评", icon: "👩", summary: `${u} (${realId}) · 敏感${sensMult}x`,
                    items: [
                        mk("身份与背景", `👩 认知真名与身份：${u}「${realId}•${prop.肉体所有权 || (hookerCnt > 0 ? "恩客共有" : "自由身")}」`,
                            fmtOvr("身份与背景",
                                `【🔬 认知真名与身份处境】：\n` +
                                `• 认知真名：${u}${prof.原身旧名 && prof.原身旧名 !== u ? `（已彻底继承/取代现身份，摒弃原名「${prof.原身旧名}」）` : ""} ｜ 肉体归属：${prop.肉体所有权 || (hookerCnt > 0 ? "买春恩客支配" : "自由身")}\n` +
                                `• 真实身份与体质：${realId}（敏感度：${sensMult} 倍 ｜ 难度：${diff.fullLabel}）\n` +
                                `• 当前处境：${prof.身份与背景 || live.identity}`,
                                [
                                    `我现在是以「${u}」（${realId}）的身份活在这个世界里，必须时刻谨记自己的身份与立场，稳妥应对眼前的处境。`,
                                    `作为「${u}」，虽然眼前的处境让人有些紧绷为难，但我还是得努力维持住基本的体面💦。`,
                                    `我已经彻底习惯了「${u}」这个身份和这具敏感度 ${sensMult} 倍的身体，每天都要为了应付男人们而奔波劳碌呢😳💦。`,
                                    `现在的我就是「${u}」，这具敏感易湿的熟肉身体早就离不开男人的玩弄与支配了🥵💦！`,
                                    `只要听到有人叫我「${u}」，我合不拢的骚穴就会条件反射地涌出热流，随时准备张开双腿迎接恩客的肉棒🥵💦❤️！`,
                                    `啊嘿♡……「${u}」就是天生为了给所有男人当泄欲排泄肉坑而存在的崩坏母猪呀🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("肉体外貌", `🌸 肉体敏感与畸变总览：${bodyTotalCorrupt}/100「敏感${sensMult}倍•${stageNameFromVal(bodyTotalCorrupt)}」`,
                            fmtOvr("肉体外貌",
                                `【🔬 全身器质崩坏度与外貌实况：${bodyTotalCorrupt}/100】：\n` +
                                `• 躯体实况：${prof.肉体外貌实况 || live.bodyDesc}\n` +
                                `• 神经敏感倍率：常人的 ${sensMult} 倍 ｜ 全身六孔平均崩坏度：${dev.all6OrganAvg}%\n` +
                                `• 阶段演进：${["【Lv.1 完好无瑕】全身器官紧致粉嫩，未经摧残", "【Lv.2 轻度充血】局部粘膜红肿微张，留有浅淡情事痕迹", "【Lv.3 熟稔外翻】私处色素沉淀外翻，身体曲线熟透诱人", "【Lv.4 器质松弛】多处括约肌松弛合不拢，常年挂着体液", "【Lv.5 重度脱垂】生殖与排泄腔严重脱垂外翻，彻底母畜化", "【💀 Lv.6 彻底崩坏畸变】全身孔穴永久洞开腐熟，彻底沦为非人泄欲肉块"][tier6(bodyTotalCorrupt)]}`,
                                [
                                    `这具身体肌肤细腻、完好无瑕，我应当好好爱惜保护自己，绝不让人轻易亵渎。`,
                                    `不知是不是错觉，总觉得现在的皮肤和粘膜变得比以前敏感了不少，稍微吹点凉风都会起鸡皮疙瘩💦。`,
                                    `看着镜子里这具留着薄汗与红痕、私处微张的身体，每一寸皮肤都敏感到极点，连冷水扑在脸上都压不住体内的微热😳💦。`,
                                    `我这具丰满白腻的身体早就被开发得松软熟透了，不管是被掐捏还是掌掴都会泛起诱人的潮红并往外漏水🥵💦！`,
                                    `好喜欢看自己这副满身巴掌印、穴口外翻脱垂合不拢的下流母畜身体呀，完全就是一件极品泄欲肉具呢🥵💦❤️！`,
                                    `啊嘿♡……全身上下每一个器官都已经100%崩坏畸变成流着脓精和骚尿的烂肉块啦🥵💦❤️❤️！`
                                ], bodyTotalCorrupt), "corr"),
                        mk("表里风评", `🎭 表里风评：「${prof.表里风评与称号 || (corr >= 60 ? "名声崩坏•难以自持" : (isPureZero ? "清白端庄•品行自持" : "表面平静•暗藏反差"))}」`,
                            fmtOvr("表里风评",
                                `【🔬 表里风评与把柄威胁】：\n` +
                                `• 当前称号：【${corr >= 100 ? "深度沦陷" : corr >= 80 ? "彻底失守" : corr >= 50 ? "习以为常" : vagCnt > 0 ? "初尝禁果" : "清白自持"}】\n` +
                                `• 风评实况：${prof.表里风评与称号 || (hookerCnt > 0 ? `存在私密交易记录，声誉已受影响。` : `外界风评正常端庄，尚无异常流言传出。`)}\n` +
                                `• 致命把柄：${prof.致命把柄与威胁 !== "无" ? prof.致命把柄与威胁 : "暂无已知把柄落入他人之手"}`,
                                [
                                    `我的名声与清白容不得半点污点，行事必须光明磊落、谨言慎行。`,
                                    `但愿那些略显尴尬的私密接触不会被外人知晓，我必须守住表面的风评💦。`,
                                    `在知情的熟客眼里，我早就不是什么高不可攀的女人，而是可以花钱享用的风尘女子了😳💦。`,
                                    `反正名声和把柄早就落在男人们手里了，还不如乖乖张开双腿享受当一个荡妇的快乐呢🥵💦！`,
                                    `嘻嘻♡……最好让所有男人都知道我是个给钱就能无套内射的下贱娼妇，排着队过来操我吧🥵💦❤️！`,
                                    `啊嘿♡……请把人家的崩坏事迹传遍天下，让全世界的男人都来往这具臭肉坑里排泄射精吧🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("挂牌身价", `🏷️ 挂牌身价：「${marketRank}」`,
                            fmtOvr("挂牌身价",
                                `【🔬 风月估值与身价评级】：\n` +
                                `• 评级：【${marketRank}】\n` +
                                `• 估值明细：${marketPrice}。`,
                                [
                                    `我的身体与尊严是无价的，绝不可能像货物一样被明码标价。`,
                                    `一想到如果沦落到被金钱衡量的地步，心里就忍不住一阵发寒💦。`,
                                    `看着桌上的零钞，我已经渐渐习惯了靠出卖这具身体来换取生活所需的生活😳💦。`,
                                    `只要给几张零钞就能随便玩弄内射我这具熟透的名器身体，客人们可真是赚大了呀🥵💦！`,
                                    `哪怕不给钱倒贴都没关系♡，只要能用粗大肉棒把我的子宫灌满浓精就是最好的报酬了🥵💦❤️！`,
                                    `啊嘿♡……倒贴钱求操的0元公用排泄便池挂牌营业中，欢迎随时插进来排泄射精呀🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("内心独白", `💬 内心独白：「实时心声」`,
                            fmtOvr("内心独白",
                                `【⚡ 当前敏感带与规矩日程】：\n` +
                                `• 敏感带：${extPsy.当前敏感点 || (isPureZero ? "耳根、脖颈与腰侧" : "外翻阴唇、肿大阴蒂、脱垂宫颈口与乳尖")}\n` +
                                `• 当前日程：${v.调教进度?.规矩与日程 || (isPureZero ? "保持警惕，正常推进日常事务" : "尽快清理体内残留，准备应对接下来的互动")}。`,
                                curThought), "none", null, true, 0),
                        mk("当前姿势", `🧍 姿势与躯体机能：${staM.val}/100「${staM.stage}」`,
                            fmtOvr("当前姿势",
                                `【🔬 当前姿态与躯体骨骼机能崩坏实况】：\n` +
                                `• 实时姿态：${curPose}\n` +
                                `${staM.desc.split("💭")[0]}`,
                                [
                                    `保持端正自然的姿态，目前体力充沛，骨骼肌肉完好，足以应对接下来的各种情况。`,
                                    `稍微有些劳累出汗，我得扶稳站好，尽快平复呼吸恢复体力💦。`,
                                    `大腿内侧肌肉被撑得酸软无力，膝盖打颤合不拢腿，但还是得强撑着把床单换好、把身体清理干净😳💦。`,
                                    `腰椎和双腿都酸软痉挛得厉害，连站着都在摇晃，要是这时候再被男人按住可就彻底瘫软了🥵💦！`,
                                    `胯骨早就被撞得习惯性半脱臼了，根本站不起来，只能像母狗一样四肢着地撅着屁股爬行等操🥵💦❤️！`,
                                    `啊嘿♡……四肢彻底废用萎缩、脊椎塌陷长死成M字开腿撅臀的活体肉垫了，请直接踩在烂肉上内射吧🥵💦❤️❤️！`
                                ], staM.val, true), "sta")
                    ]
                },
                // 2. 恶堕与脑改
                {
                    title: "恶堕与脑改", icon: "🔥", summary: `好感${cockM.val}% · 性欲${lustM.val}% · 恶堕${corrM.val}% · 羞耻${shameM.val}%`,
                    items: [
                        mk("cockLove", `💗 阳具烙印：${cockM.val}/100「${cockM.stage}」`, cockM.desc, "cockLove"),
                        mk("lust", `🔥 发情中枢：${lustM.val}/100「${lustM.stage}」`, lustM.desc, "lust"),
                        mk("corr", `🖤 人格崩坏：${corrM.val}/100「${corrM.stage}」`, corrM.desc, "corr"),
                        mk("shame", `😳 羞耻防线：${shameM.val}/100「${shameM.stage}」`, shameM.desc, "shame"),
                        mk("obey", `🙇 意志切除：${obeyM.val}/100「${obeyM.stage}」`, obeyM.desc, "obey"),
                        mk("pleas", `💓 脑髓熔断：${pleasM.val}/100「${pleasM.stage}」`, pleasM.desc, "pleas"),
                        mk("精神沦陷", `🌀 脑实质沦陷：${fallMax}/100「${["理智完好", "浅层恍惚", "催眠暗示", "常识改写", "人格碎裂", "脑海绵化痴呆"][fallTier]}」`,
                            fmtOvr("精神沦陷",
                                `【🔬 脑实质与认知崩坏（第${fallTier + 1}阶段 · ${fallMax}/100）】：\n` +
                                `• 精神沦陷度：${fallVal}/100 ｜ 人格崩解度：${brkVal}/100 ｜ 意识清醒度：${safeNum(v.精神与心理?.意识清醒度, 100)}/100 ｜ 催眠深度：${hypnoVal}/100。\n` +
                                `• 阶段演进：${[
                                    "【Lv.1 理智完好】大脑认知与三观完好清醒，无任何洗脑或精神损伤。",
                                    "【Lv.2 浅层恍惚】在疲劳或冲击下偶尔出现精神恍惚，防线微松。",
                                    "【Lv.3 催眠暗示】潜意识被种下顺从暗示，眼神平静麻木如死水。",
                                    "【Lv.4 常识改写】正常人类是非观被扭曲，将挨操接客视作理所当然的日常。",
                                    "【Lv.5 人格碎裂】原有自我认知支离破碎，在剧烈快感下频繁出现阿嘿颜失神与语言退化。",
                                    "【💀 Lv.6 脑实质海绵化痴呆（彻底崩坏）】大脑皮层因长期极限催眠与精液毒素浸泡而彻底萎缩海绵化！智商退化至婴儿以下，彻底丧失人类语言与记忆，化作一团只会流着哈喇子张嘴讨精的脑死痴呆母猪！"
                                ][fallTier]}`,
                                [
                                    `我的头脑非常清醒，三观与自我认知坚不可摧，绝不会被轻易动摇。`,
                                    `随着经历的事情变多，脑海里偶尔会闪过一丝恍惚与疲惫，但核心理智依然还在💦。`,
                                    `眼神已经变得像死水一样平静麻木了，顺应着现在的处境听话行事，比无谓的挣扎要轻松得多😳💦。`,
                                    `只要一闻到男人的气息，脑子就会变得晕乎乎的，根本不想再去思考什么尊严和道理了🥵💦！`,
                                    `人格和常识都已经被彻底改写成了只知道张腿接精的母猪逻辑，连话都说不利索了🥵💦❤️！`,
                                    `啊嘿……阿巴阿巴♡……脑子彻底变成装满精液的浆糊海绵啦，除了张开烂嘴流口水等插以外什么都不会了呀🥵💦❤️❤️！`
                                ], fallMax), "hypno"),
                        mk("媚药毒瘾", `🧪 脑脊液毒瘾：${drugVal}/100「${["纯净无毒", "微醺依恋", "药力发热", "精液戒断", "断精发狂", "脑脊液毒化母猪"][tier6(drugVal)]}」`,
                            fmtOvr("媚药毒瘾",
                                `【🔬 媚药侵蚀与脑脊液毒瘾（Lv.${tier6(drugVal) + 1} · ${drugVal}/100）】：\n` +
                                `• 毒瘾崩坏度：${drugVal}/100 ｜ 药物状态：${v.调教进度?.媚药与发情毒 || "无外源化学媚药"}\n` +
                                `• 阶段演进：${[
                                    "【Lv.1 纯净无毒】血液与神经系统干净纯粹，无任何催情毒素或体液依赖。",
                                    "【Lv.2 微醺依恋】吸入雄性费洛蒙或微弱催情气味后会产生轻微眩晕与发热。",
                                    "【Lv.3 药力发热】神经对雄性精液激素产生初步成瘾，清理残精时会感到莫名空虚。",
                                    "【Lv.4 精液戒断】重度体液成瘾，一旦体内精液排空便会出现心慌腿软、小腹痉挛的戒断症状。",
                                    "【Lv.5 断精发狂】毒素深入骨髓，超过一天不吞精或不被内射就会双眼充血、四肢抽搐发狂。",
                                    "【💀 Lv.6 脑脊液毒化母猪（彻底崩坏）】高浓度媚药与腐熟精液毒素已彻底渗透血脑屏障、将脑脊液完全毒化！全身神经24小时浸泡在剧毒催情液中，口鼻不断溢出白沫，不靠持续灌注浓精续命就会当场休克暴毙！"
                                ][tier6(drugVal)]}`,
                                [
                                    `我的体内干净纯粹，没有任何催情药物或奇怪体液的残留与依赖。`,
                                    `屋里浑浊的气味吸进肺里让人有些头晕胸闷，必须保持呼吸平稳💦。`,
                                    `身体似乎已经渐渐习惯了雄性精液的热度与气味，清理出来的时候竟然有一丝微妙的空虚感😳💦。`,
                                    `太久没有被滚烫的浓精灌进子宫里，小肚子深处就像犯了毒瘾一样空虚发痒呢🥵💦！`,
                                    `身体已经彻底染上男人的精液毒瘾了♡！一天不喝精液、不被内射灌满就会浑身抽搐发狂呀🥵💦❤️！`,
                                    `啊嘿♡……连脑脊液和骨髓都被媚药和浓精彻底腌透毒化了，快把滚烫白浆直接灌进毒虫母猪的脑子里续命吧🥵💦❤️❤️！`
                                ], drugVal), "drug")
                    ]
                },
                // 3. 下流性癖库
                {
                    title: "下流性癖库", icon: "🧬",
                    summary: unlockedFetishes.length > 0 ? `已畸变 ${unlockedFetishes.length} 项` : `完好未染`,
                    items: fetishItems
                },
                // 4. 六孔与储精
                {
                    title: "六孔与储精", icon: "🌸", summary: `总储精${totalMl}ml · 六孔崩坏实况`,
                    items: [
                        mk("骚口实况", `👄 骚口：${mouthDev}/100「${mouthStg}」`,
                            fmtOvr("骚口实况",
                                `【🔬 口腔与咽喉器质崩坏度：${mouthDev}/100（${mouthStg}｜口交${mouthCnt}次·吞精${swallowCnt}次）】：\n` +
                                `• 💧 胃袋储精：${mouthMl}ml / ${caps.mouthMax}ml（累计吞精 ${swallowMl}ml）\n` +
                                `• 👅 阶段崩坏实况：${[
                                    "【Lv.1 洁净初唇】双唇粉嫩紧致，咽反射完好正常，从未含入过雄性污物。",
                                    "【Lv.2 唇肿涎溢】唇瓣被摩擦得微肿充血，嘴角残留着干涸的透明涎痕。",
                                    "【Lv.3 咽喉松弛】咽反射被反复深喉顶撞至消失，喉管习惯性微张，极易分泌粘稠口水。",
                                    "【Lv.4 颚骨半脱臼】下颚韧带被粗大肉棒撑松，嘴唇无法长时间闭合，腥咸口水常年顺下巴滴淌。",
                                    "【Lv.5 食道肉壶化】食道粘膜被调教出层叠吸吮肉褶，胃袋被撑大改造成专门消化浓精的储精囊。",
                                    "【💀 Lv.6 口腔排泄器畸变（彻底崩坏）】下颚关节永久性脱臼洞开无法合拢，舌头麻痹外吐，喉管与食道彻底畸变为不经咀嚼直接灌入浓精与黄尿的漏斗状排泄肉洞！"
                                ][tier6(mouthDev)]}\n` +
                                `• 📍 当前细节：${rt.骚口实况 || live.mouth || "唇瓣微张喘息。"}`,
                                [
                                    `我的双唇与口腔干净清爽，绝不会去触碰或含入任何肮脏不洁的东西。`,
                                    `嘴唇稍微有些发干发麻，掬起一捧冷水漱了漱口，努力平复下呼吸💦。`,
                                    `刚才激烈喘息时流在嘴角的口水干了都还没来得及擦掉，被撑开过的咽喉深处还残留着一丝酸胀感😳💦。`,
                                    `下巴酸得合不拢嘴，舌头和松弛的嗓子眼早就记住了大肉棒的形状，口水不自觉地直往下淌呢🥵💦！`,
                                    `食道和胃袋都已经变成装精液的肉壶了，快用大肉棒捅穿我的喉咙把浓精直接射进胃里吧🥵💦❤️！`,
                                    `啊嘿♡……下巴彻底脱臼合不上了，人家的烂嘴和食道已经100%畸变成直通胃袋的排泄漏斗了，请直接往嗓子眼里灌精撒尿吧🥵💦❤️❤️！`
                                ], mouthDev),
                            "mouth",
                            { mainName: "👄 口器崩坏度", label: "🥛 胃袋储精", theme: "semen", pct: Math.round((mouthMl / Math.max(1, caps.mouthMax)) * 100), text: `${mouthMl}/${caps.mouthMax}ml` }
                        ),
                        mk("胸部实况", `🍒 丰乳：${chestDev}/100「${chestStg}」`,
                            fmtOvr("胸部实况",
                                `【🔬 乳房与乳腺器质崩坏度：${chestDev}/100（${chestStg}｜乳交${titCnt}次·喷乳${milkCnt}次）】：\n` +
                                `• 🍼 乳腺蓄乳：${curMilkMl}ml / ${milkCap}ml（累计泌乳 ${milkMl}ml）\n` +
                                `• 🍒 阶段崩坏实况：${[
                                    "【Lv.1 娇嫩处乳】双峰挺拔紧致，乳晕粉嫩小巧，乳腺未受催发。",
                                    "【Lv.2 乳尖肥大】乳头被反复吸吮掐捏得充血肿大，长期保持硬挺凸起状态。",
                                    "【Lv.3 乳晕黑紫扩张】乳肉被粗暴揉捏得松软变形，乳晕色素沉淀扩大变深，乳腺管开始发胀。",
                                    "【Lv.4 乳腺失控漏奶】乳腺管被强行催通撑大，乳孔括约肌松弛，稍受挤压或高潮便自动往外飙奶。",
                                    "【Lv.5 下垂巨乳奶袋】乳房因过度泌乳与拉扯而硕大下垂，表面浮现青紫血管，24小时滴淌甜腻母乳。",
                                    "【💀 Lv.6 崩坏泌乳肉囊（彻底崩坏）】双乳彻底丧失弹性，畸变为一对垂坠至肚脐的紫黑巨大泌乳肉囊！肿大如拇指的烂熟乳头孔洞大开，稍一晃动便如坏掉的水管般失禁狂喷混着血丝的腥甜浊乳！"
                                ][tier6(chestDev)]}\n` +
                                `• 📍 当前细节：${rt.胸部实况 || live.chest || "双峰随呼吸微微起伏。"}`,
                                [
                                    `胸前的衣襟整理得十分妥当，双峰紧致完好，没有任何走光或失礼的地方。`,
                                    `呼吸稍微有些急促，乳尖被磨得有些充血发硬，贴着空气微微发麻💦。`,
                                    `看着镜子里光裸起伏的胸口和变大变深的乳晕，微凉的空气一激，肿大的乳头就又硬又痛😳💦。`,
                                    `这对松软的乳房早就被揉捏变形了，乳腺胀得厉害，稍微碰一下乳头就会控制不住往外渗奶水🥵💦！`,
                                    `硕大下垂的奶袋子又胀又麻好难受呀♡，快用力抓烂我的黑紫乳晕、把母畜的骚奶吸干吧🥵💦❤️！`,
                                    `啊嘿♡……一对烂奶子已经彻底崩坏成垂到肚子上的紫黑泌乳肉袋了，乳孔24小时合不拢地在往外狂喷浊乳呀🥵💦❤️❤️！`
                                ], chestDev),
                            "chest",
                            { mainName: "🍒 乳腺崩坏度", label: "🍼 乳腺蓄乳", theme: "milk", pct: Math.round((curMilkMl / Math.max(1, milkCap)) * 100), text: `${curMilkMl}/${milkCap}ml` }
                        ),
                        mk("小穴实况", `🌺 小穴：${vagDev}/100「${vagStg}」`,
                            fmtOvr("小穴实况",
                                `【🔬 小穴与阴唇器质崩坏度：${vagDev}/100（${vagStg}｜贯穿${vagCnt}次·内射${creampie}次·孔径${vagWidth}cm·闭合${vagClose}%）】：\n` +
                                `• 💧 阴道储精：${vagMl}ml / ${caps.vagMax}ml\n` +
                                `• 🌺 阶段崩坏实况：${[
                                    "【Lv.1 紧致初鲍】两瓣花唇粉嫩紧闭，处女膜完好无损，干爽洁净。",
                                    "【Lv.2 初破红肿】处女膜破裂，外阴软肉充血红肿，闭合处出现细微缝隙。",
                                    "【Lv.3 外翻黑木耳】大小阴唇被反复抽插拉扯得肥厚外翻、色素沉淀发暗，熟稔内壁极易泛滥拉丝。",
                                    "【Lv.4 括约肌松弛洞开】阴道口被撑松至两指宽无法自然合拢，走动时空气与白浊进出发出咕啾水声。",
                                    "【Lv.5 肉壁脱垂漏精壶】阴道内壁红肿充血的肉褶向外翻出穴口，彻底丧失锁精能力，白浊随时顺大腿淌下。",
                                    "【💀 Lv.6 彻底崩坏烂肉洞（彻底崩坏）】肥厚阴唇烂熟外翻如紫黑烂花，阴道括约肌100%断裂报废，穴口永久性扩张洞开达拳头粗细！内壁红肉重度向外脱垂翻出，彻底畸变为一个可以直接看清内部宫颈、永不闭合的崩坏烂肉空洞！"
                                ][tier6(vagDev)]}\n` +
                                `• 📍 当前细节：${rt.小穴实况 || live.vag || "花唇微张。"}`,
                                [
                                    `下半身干爽整洁，私密处紧致完好，没有任何异样。`,
                                    `两腿之间有些红肿温热，走路时摩擦到充血的软肉会传来一丝酸痛感💦。`,
                                    `被开发过度的花唇已经红肿外翻合不拢了，纸团都兜不住里面溢出的白浊，手指探入清理时熟稔的肉壁还在本能地收缩缠绕😳💦。`,
                                    `下面那个松弛外翻的黑木耳肉洞已经合不拢了，走一步路就咕啾一声往外漏白浆，空虚得直想再塞根大肉棒进去🥵💦！`,
                                    `骚逼已经彻底被操成内壁外翻的漏精肉壶了♡，根本锁不住半滴精液，快用拳头和巨根继续扩宽它吧🥵💦❤️！`,
                                    `啊嘿♡……小穴已经100%彻底崩坏成合不拢的拳头大烂肉洞啦！里面的鲜红肉壁全都翻到外面来了，随时恭候任何东西直接捅进来呀🥵💦❤️❤️！`
                                ], vagDev),
                            "vag",
                            { mainName: "🌺 小穴崩坏度", label: "🥛 穴内储精", theme: "semen", pct: Math.round((vagMl / Math.max(1, caps.vagMax)) * 100), text: `${vagMl}/${caps.vagMax}ml` }
                        ),
                        mk("子宫实况", `🫀 子宫：${wombDev}/100「${wombStg}」`,
                            fmtOvr("子宫实况",
                                `【🔬 子宫与宫颈口器质崩坏度：${wombDev}/100（${wombStg}｜内射${creampie}次）】：\n` +
                                `• 💧 宫腔储精：${wombMl}ml / ${caps.wombMax}ml\n` +
                                `• 🫀 阶段崩坏实况：${[
                                    "【Lv.1 紧闭处子】宫颈口紧密闭合如针尖，小腹平坦纯净，未经精液侵入。",
                                    "【Lv.2 宫口充血微松】宫颈被龟头反复顶撞得红肿酸软，出现细微松动。",
                                    "【Lv.3 宫口扩张锁精】宫颈口被撞开变形，形成主动吞吸浓精的软肉环，灌精后下腹沉重坠胀。",
                                    "【Lv.4 宫腔肥大下坠】长期超量内射导致子宫壁被撑薄扩张，宫颈口常年微张无法闭合，弯腰即漏精。",
                                    "【Lv.5 宫颈重度脱垂】固定子宫的韧带被彻底撞断松弛，紫红肿胀的宫颈口顺着阴道大幅度向下脱垂至穴口边缘！",
                                    "【💀 Lv.6 外翻脱垂死肉苗床（彻底崩坏）】整个紫黑色的宫颈口已彻底掉出阴道口外暴露在空气中！子宫丧失一切正常收缩机能，完全畸变为一个下垂松垮的死肉储精皮袋，稍微按压小腹就会从外翻在体外的宫口里喷出腐熟浓精！"
                                ][tier6(wombDev)]}\n` +
                                `• 📍 当前细节：${rt.子宫实况 || live.womb || "小腹微沉。"}`,
                                [
                                    `小腹平坦温暖，子宫紧闭纯净，身体内部没有任何沉重或不适的感觉。`,
                                    `小肚子最深处稍微有些发酸发沉，像是被顶撞过后的轻微坠胀感💦。`,
                                    `宫腔深处被灌进了满满的滚烫浓精，沉甸甸地往下坠，弯腰换床单时微张的宫口又挤出一股白浊，得赶紧洗出来才行😳💦。`,
                                    `子宫口已经被撞得又软又松合不拢了，小肚子里坠着一团浓精沉甸甸的感觉既酸麻又让人上瘾呢🥵💦！`,
                                    `子宫韧带都被撞松脱垂到穴口边上了♡，只要一掰开阴唇就能直接看到张着嘴讨精的紫红宫颈口呀🥵💦❤️！`,
                                    `啊嘿♡……子宫口已经100%彻底脱垂掉到阴道外面来啦！直接暴露在空气里一抽一缩地喷着陈年老精，请直接把龟头塞进外翻的宫口里射穿吧🥵💦❤️❤️！`
                                ], wombDev),
                            "womb",
                            { mainName: "🫀 宫颈崩坏度", label: "🥛 宫腔锁精", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }
                        ),
                        mk("阴蒂尿道", `💧 阴蒂与尿道：${clitDev}/100「${clitStg}」`,
                            fmtOvr("阴蒂尿道",
                                `【🔬 阴蒂与尿道括约肌崩坏度：${clitDev}/100（${clitStg}｜高潮${orgasmCnt}次·失禁${leakCnt}次·阴蒂${clitSize}mm）】：\n` +
                                `• 💦 尿道失禁度：${peeVal}/100\n` +
                                `• ⚡ 阶段崩坏实况：${[
                                    "【Lv.1 包皮隐没】阴蒂小巧粉嫩隐没于包皮下，尿道括约肌紧致完好。",
                                    "【Lv.2 充血外露】阴蒂充血勃起剥离包皮，走动摩擦时带来阵阵酥麻酸痛。",
                                    "【Lv.3 阴蒂肥大勃起】阴蒂因反复高潮刺激而异常肥大凸起如花生米，尿道口开始发酸微松。",
                                    "【Lv.4 尿道扩张漏尿】尿道括约肌受损松弛，稍有强烈快感或弯腰用力便会控制不住漏出温热骚尿。",
                                    "【Lv.5 阴蒂肉棒化失禁】阴蒂恶性肥大肿胀如小拇指般永不消退，尿道口扩张松弛，每次高潮必定伴随大股喷尿失禁。",
                                    "【💀 Lv.6 括约肌坏死漏尿狂（彻底崩坏）】阴蒂畸变肿大至2厘米以上且表皮糜烂过敏，尿道括约肌100%彻底坏死报废！膀胱完全丧失蓄水功能，24小时不分昼夜地顺着大腿根往外滴淌腥臊黄尿，彻底沦为走到哪尿到哪的失禁漏尿肉具！"
                                ][tier6(clitDev)]}\n` +
                                `• 📍 当前细节：${rt.阴蒂尿道实况 || "私处神经微颤。"}`,
                                [
                                    `全身括约肌完全受控，私处完好自然，没有任何失态或不适的迹象。`,
                                    `迈步走动的时候，充血的阴蒂偶尔会传来一丝微弱的摩擦酥麻感💦。`,
                                    `被反复磨过的阴蒂（${clitSize}mm）和红肿阴唇在走路时相互挤压，每走一步都带来无法忽视的酥麻与酸痛😳💦。`,
                                    `阴蒂已经肿大得像颗小豆子一样缩不回去了，连下面的尿道口都松弛发麻，稍微高潮一下就会漏出尿来🥵💦！`,
                                    `阴蒂已经畸变肿大成小肉棒的样子了，尿道括约肌也坏掉了，只要一被插就会哗啦啦地狂喷骚尿失禁呀🥵💦❤️！`,
                                    `啊嘿♡……尿道括约肌已经100%彻底坏死报废啦！完全憋不住半滴尿，24小时都在滴滴答答往地上漏骚尿，风吹一下烂阴蒂就会喷尿绝顶呀🥵💦❤️❤️！`
                                ], clitDev),
                            "clit",
                            { mainName: "⚡ 尿道崩坏度", label: "💦 失禁漏尿", theme: "pee", pct: peeVal, text: `失禁度 ${peeVal}%` }
                        ),
                        mk("屁眼实况", `🕳️ 屁眼：${analDev}/100「${analStg}」`,
                            fmtOvr("屁眼实况",
                                `【🔬 后庭与直肠器质崩坏度：${analDev}/100（${analStg}｜肛交${analCnt}次）】：\n` +
                                `• 💧 直肠储精：${analMl}ml / ${caps.analMax}ml\n` +
                                `• 🍑 阶段崩坏实况：${[
                                    "【Lv.1 紧闭菊蕾】臀部圆润紧致，后庭菊花褶皱紧密闭合，未经异物侵入。",
                                    "【Lv.2 裂伤红肿】臀肉带有掌印或菊口轻微充血红肿，残留异物摩擦感。",
                                    "【Lv.3 褶皱磨平松弛】肛门括约肌被撑松软化，菊花褶皱被磨平，闭合速度明显变慢。",
                                    "【Lv.4 后庭空洞不合】括约肌弹性严重受损，拔出后仍保持圆洞状久久无法收缩，肠液与残精外漏。",
                                    "【Lv.5 直肠翻肉轻度脱肛】直肠内壁鲜红粘膜被粗暴抽插带出肛门外形成一圈翻肉（轻度脱肛），丧失排泄控制力。",
                                    "【💀 Lv.6 重度脱肛崩坏排泄腔（彻底崩坏）】肛门内外括约肌100%断裂坏死，大段鲜红糜烂的直肠肉管如盛开的烂玫瑰般永久性翻出肛门外5厘米无法塞回！彻底丧失排便控制，精液、肠液与污物24小时毫无阻拦地从大开的脱肛肉洞中漏出！"
                                ][tier6(analDev)]}\n` +
                                `• 📍 当前细节：${rt.屁眼实况 || live.anal || "臀线紧绷。"}`,
                                [
                                    `裙摆下的腰臀姿态端正，后庭紧闭洁净，没有任何失礼之处。`,
                                    `臀部肌肉稍微有些酸紧，走路时需要刻意稳住重心💦。`,
                                    `臀肉上被扇出的几道暗红掌印还火辣辣地发烫，连臀缝都被前面淌下来的白浊弄得湿漉漉的😳💦。`,
                                    `后面的括约肌已经被撑松了，褶皱平平的合不拢，走动时连里面的肠液都在往外渗呢🥵💦！`,
                                    `屁眼已经被操得往外翻出鲜红的直肠肉了♡，彻底变成关不上门的第二个储精排泄洞了呀🥵💦❤️！`,
                                    `啊嘿♡……屁眼括约肌彻底断掉重度脱肛啦！一大截鲜红烂直肠永远翻在屁股外面收不回去，一边漏着精液和污物一边等大肉棒捅穿呀🥵💦❤️❤️！`
                                ], analDev),
                            "anal",
                            { mainName: "🕳️ 后庭崩坏度", label: "🥛 直肠储精", theme: "semen", pct: Math.round((analMl / Math.max(1, caps.analMax)) * 100), text: `${analMl}/${caps.analMax}ml` }
                        )
                    ]
                },
                // 5. 肉改与道具
                {
                    title: "肉改与道具", icon: "⛓️", summary: `伤痕${tallyDev}% · 淫纹${tattooDev}% · 穿刺${pierceDev}% · 腔改${propDev}%`,
                    items: [
                        mk("正字涂鸦", `🩹 正字涂鸦与烙痕：${tallyDev}/100「${scarStg}」`,
                            fmtOvr("正字涂鸦",
                                `【🔬 正字涂鸦与皮肉刻痕畸变度：${tallyDev}/100（${scarStg}｜正字${tallyFull}个/${tallyStrokes}划）】：\n` +
                                `• 当前痕迹：${mark.体表痕迹 !== "无" ? mark.体表痕迹 : "无任何墨迹或伤疤"} ｜ 涂鸦：${mark.公开涂鸦字迹 || "无"}\n` +
                                `• 阶段演进（图文同步）：${[
                                    "【Lv.1 白皙无瑕 (0%)】腹部与大腿内侧肌肤白皙光滑，无任何墨水涂鸦或伤痕。",
                                    "【Lv.2 初次记数】白皙大腿内侧与下腹被黑色马克笔歪歪扭扭画上一两个『正』字，墨迹随汗水微晕。",
                                    "【Lv.3 淫语密布】下半身肌肤密密麻麻画满红黑交织的『正』字与侮辱性下流词汇，汗水糊开墨迹。",
                                    "【Lv.4 刺青入骨】涂鸦被纹身针永久刺入真皮！密集的黑色正字刺青周围皮肉红肿发炎，永远无法洗脱。",
                                    "【Lv.5 烙铁烫印】不再使用墨水，而是用烧红的烙铁直接在皮肉上烫出焦黑的『正』字疤痕，周围布满红肿水泡与增生。",
                                    "【💀 Lv.6 烂肉记事本（彻底崩坏）】全身再无一块好肉！旧的焦黑烙印与新的深可见骨刀刻『正』字层层叠叠交织，皮开肉绽、血肉模糊结痂，整具躯体彻底沦为令人作呕的活体烂肉记事本！"
                                ][tier6(tallyDev)]}`,
                                [
                                    `全身肌肤光洁如初，没有任何被人画上的屈辱字迹或伤痕。`,
                                    `大腿根部和肚皮上被人用黑马克笔画上了记录次数的正字，擦都擦不掉，好屈辱💦……`,
                                    `肚子和大腿上密密麻麻全都是红黑交错的正字和下流辱骂，一出汗墨水就糊在皮肤上，看着就让人腿软😳💦。`,
                                    `那些屈辱的正字已经被纹身针生生刺进肉里变成永久刺青了，红肿发炎的皮肤一碰就又痛又麻🥵💦！`,
                                    `啊啊♡！烧红的烙铁直接烫在肚皮上滋滋冒烟，焦黑的正字烫疤把痛觉神经都烫成高潮开关了呀🥵💦❤️！`,
                                    `啊嘿♡……全身皮肉都被刀子刻满了层层叠叠的血肉正字！流着脓血结痂的烂肉记事本就是母猪最棒的勋章呀🥵💦❤️❤️！`
                                ], tallyDev), "corr"),
                        mk("淫纹烙印", `🔮 淫纹烙印与魔蚀：${tattooDev}/100「${tattooStg}」`,
                            fmtOvr("淫纹烙印",
                                `【🔬 淫纹烙印与深渊腐蚀畸变度：${tattooDev}/100（${tattooStg}）】：\n` +
                                `• 当前淫纹状态：${hasTattoo ? mark.淫纹与刻印 : "小腹平坦光洁，未刻任何淫纹（0% 未改造）"}\n` +
                                `• 阶段演进（图文同步）：${[
                                    "【Lv.1 平坦白腹 (0%)】下腹部皮肤白皙平坦，没有任何印记或魔纹。",
                                    "【Lv.2 初显魔纹】随着情欲唤醒，白皙小腹下隐约浮现出浅粉色的对称魅魔淫纹。",
                                    "【Lv.3 漆黑刻印】下腹部被永久烙上漆黑如墨的复杂淫纹，粗壮线条深深刻入皮肉之中。",
                                    "【Lv.4 发情荧光】极度发情时漆黑淫纹亮起淫靡的紫红色高亮荧光，纹路周围血管突起如呼吸般搏动。",
                                    "【Lv.5 肉体异化】平面淫纹异化为凸出皮肤表面的暗红色肉质触须纹路，如活体寄生虫般扎根小腹蠕动。",
                                    "【💀 Lv.6 恶堕魔腹（彻底崩坏）】下腹部的淫纹已彻底吞噬宿主皮肉，化作一片紫黑色、深可见骨的腐蚀性深渊魔痕！肚皮皮肉翻卷溃烂、散发着浓烈恶堕瘴气，彻底丧失人类肌肤形态！"
                                ][tier6(tattooDev)]}`,
                                [
                                    `小腹肌肤白净平坦，完好如初，没有任何奇怪的纹路或烙印。`,
                                    `小腹皮肤下面隐约浮现出了浅粉色的奇怪纹路，稍微一热就会发麻💦。`,
                                    `漆黑如墨的淫纹已经深深烙进小腹肉里了，怎么洗都洗不掉😳💦。`,
                                    `小肚子上的淫纹亮起了紫红色的发情荧光！连周围的血管都鼓起来一跳一跳地催我找男人交配🥵💦！`,
                                    `淫纹已经变成凸起蠕动的暗红肉须长在肚皮上了♡，一直在往子宫里钻着讨要精液呀🥵💦❤️！`,
                                    `啊嘿♡……整个小肚子都被紫黑色的深渊淫纹腐蚀烂穿啦！皮肉翻卷着冒出恶堕黑气，彻底变成深渊魔物母猪啦🥵💦❤️❤️！`
                                ], tattooDev), "hypno"),
                        mk("穿刺环饰", `💍 穿刺铁牢与嵌合：${pierceDev}/100「${pierceStg}」`,
                            fmtOvr("穿刺环饰",
                                `【🔬 穿刺环饰与金属嵌合畸变度：${pierceDev}/100（${pierceStg}）】：\n` +
                                `• 当前穿刺状态：${hasPierce ? mark.穿刺与环饰 : "敏感带天然无饰，无任何金属穿刺（0% 未改造）"}\n` +
                                `• 阶段演进（图文同步）：${[
                                    "【Lv.1 天然无饰 (0%)】乳头与阴唇娇嫩完好，没有任何金属穿刺异物。",
                                    "【Lv.2 初上银环】乳头或小阴唇初次打孔挂上精致小巧的银环，穿刺点微微泛红刺痛。",
                                    "【Lv.3 重金属坠】细环换成粗大金属环并悬挂沉重金属坠与锁链，将乳头与阴唇向下拉扯得红肿变形。",
                                    "【Lv.4 密集铁牢】私处与胸部被密密麻麻的铁环穿透，粗铁丝将阴唇与乳肉边缘强行穿引『缝合锁死』，皮肉紧绷起皱。",
                                    "【Lv.5 皮肉撕裂】暴力拉扯锁链导致穿刺孔洞被活活撕裂成豁开的血口，粗大工业级钢筋直接贯穿化脓肉块。",
                                    "【💀 Lv.6 金属嵌合体（彻底崩坏）】肉体与生锈刑具完全嵌合长死在一起！紫黑色的坏死烂肉吞噬了生锈的齿轮、尖刺与铁环，创口永远无法愈合、不断渗出脓血，彻底沦为生锈铁器与烂肉融合的怪物！"
                                ][tier6(pierceDev)]}`,
                                [
                                    `身体各处完好自然，没有穿戴任何异样的金属穿刺环饰。`,
                                    `乳头和阴唇刚被打穿戴上小银环，穿孔的地方又红又肿，稍微碰到就刺痛发麻💦。`,
                                    `挂在敏感处的粗铁环和重锤沉甸甸地往下坠，把乳头和阴唇都拉扯得红肿变形了😳💦。`,
                                    `阴唇和乳房都被密密麻麻的铁环和铁丝缝合锁死了，稍微动一下全身皮肉都在被铁丝拉扯着发痛发爽🥵💦！`,
                                    `铁链把穿刺孔活活扯裂成豁开的血洞了♡！粗大的工业钢筋直接插穿化脓的烂肉，又痛又让人高潮呀🥵💦❤️！`,
                                    `啊嘿♡……生锈的铁环齿轮已经和紫黑色的坏死烂肉彻底长在一起嵌合不分啦！伤口24小时流着脓血，变成铁锈烂肉怪物啦🥵💦❤️❤️！`
                                ], pierceDev), "clit"),
                        mk("体内道具", `🎛️ 机械填塞与肉壶化：${propDev}/100「${propStg}」`,
                            fmtOvr("体内道具",
                                `【🔬 体内道具与赛博机械融合畸变度：${propDev}/100（${propStg}）】：\n` +
                                `• 当前体内道具：${hasProp ? prop.体内道具 : "穴口空荡干爽，未塞入任何道具（0% 未改造）"}\n` +
                                `• 权限控制：${prop.排泄与高潮权限 || "自主控制"}\n` +
                                `• 阶段演进（图文同步）：${[
                                    "【Lv.1 空荡纯净 (0%)】前后穴口干爽紧闭，体内没有塞入任何道具。",
                                    "【Lv.2 微露拉环】体内塞入小巧跳蛋或尾塞，穴口外仅露出一根细拉线或小巧塞底，渗出少许润滑液。",
                                    "【Lv.3 巨物撑扩】体内常驻粗大发光电动假阳具，肉壁被极限撑开至发白，底座指示灯闪烁，淫水狂流。",
                                    "【Lv.4 机械群交】前后穴同时被多根粗暴的金属机械触手与粗大电缆死死塞爆，白浊顺着交错管线外溢。",
                                    "【Lv.5 内脏异形化】内视下巨大的带刺机械核心在子宫与直肠内高速旋转刮擦，内壁鲜血淋漓、被撑得薄如蝉翼。",
                                    "【💀 Lv.6 永久机械肉壶（彻底崩坏）】道具与肉体永久焊死融合！阴道与肛门外围被一圈用铆钉直接打入骨盆的冰冷工业金属底座锁死，空洞内部直接露出旋转的机械绞肉齿轮，彻底沦为赛博排泄肉壶！"
                                ][tier6(propDev)]}`,
                                [
                                    `身体内部清爽洁净，未塞入任何异物道具，一切机能皆由我自己掌控。`,
                                    `穴口里塞着的小跳蛋只露出一根细线在外面，走动时在里面嗡嗡震动得好难受💦。`,
                                    `粗大发光的电动假阳具把穴口撑得发白合不拢，底座一闪一闪地把里面的淫水全都搅出来了😳💦。`,
                                    `前后两个穴全都被冷冰冰的金属机械触手和粗电缆塞爆了，连一根手指的缝隙都没有啦🥵💦！`,
                                    `带刺的机械核心在子宫和直肠里高速旋转刮擦♡，内脏壁都被撑得像纸一样薄、一边流血一边失禁高潮呀🥵💦❤️！`,
                                    `啊嘿♡……骨盆和烂肉已经被铆钉焊死在冰冷的金属底座上啦！里面全都是转动的机械绞肉齿轮，彻底变成永久固定的赛博机械肉便器啦🥵💦❤️❤️！`
                                ], propDev), "pleas")
                    ]
                },
                // 6. 全身穿搭
                {
                    title: "全身穿搭", icon: "👗", summary: `状态:${wearStateTag}`,
                    items: [
                        mk("穿搭_头饰", `👑 头部与面容「${headTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_头饰",
                                `【🔬 头部与面容实况】：\n` +
                                `• 当前状态：${headTxt}\n` +
                                `• 细节：${live.headWear || (isPureZero ? "发丝梳理得整洁顺滑，面容干净清丽，眼神清澈坚定。" : "细密薄汗贴在额角，几缕汗湿发丝黏在面颊旁，嘴角残留着干涸涎痕。")}`,
                                [
                                    `妆容与发丝都保持着整洁得体的状态，神色平静自若。`,
                                    `额角渗出了一层细密的薄汗，我抬手将散落的发丝轻轻拢到耳后💦。`,
                                    `被汗水浸湿的头发黏在脸颊上，掬起一捧冷水扑在脸上，看着镜中自己平静如死水的眼神😳💦。`,
                                    `嘴角还挂着没擦干净的口水印子，眼神迷离拉丝，一看就是刚被男人粗暴疼爱过的发情模样呢🥵💦！`,
                                    `快给我戴上流口水的开口球和母猪耳标，让我的脸上永远挂着翻白眼吐舌头的阿嘿颜吧🥵💦❤️！`,
                                    `啊嘿♡……眼珠子彻底翻白回不来了，满脸精斑、黄尿和哈喇子就是崩坏肉便器最美的妆容呀🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("穿搭_颈部", `⛓️ 脖颈与锁骨「${neckTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_颈部",
                                `【🔬 脖颈与锁骨实况】：\n` +
                                `• 当前状态：${neckTxt}\n` +
                                `• 细节：${live.neckWear || (isPureZero ? "修长白皙的脖颈与精致锁骨被衣领妥帖衬托，毫无瑕疵。" : "白净脖颈与锁骨裸露在外，右侧锁骨处印着一小块显眼的殷红咬痕。")}`,
                                [
                                    `衣领扣得很整齐，修长的脖颈没有露出丝毫不妥。`,
                                    `脖颈处稍微有些发热出汗，我轻轻拉了拉衣领透了口气💦。`,
                                    `右侧锁骨上还印着刚才被咬出来的殷红咬痕，在灯光下显得格外刺眼直白😳💦。`,
                                    `锁骨上的红咬痕一碰就又酸又麻，就像是被男人在脖子上盖了所有权印章一样让人腿软呢🥵💦！`,
                                    `好想在脖子上锁上带铁链和铭牌的母狗电击项圈，被男人拽着铁链按在地上深喉呀🥵💦❤️！`,
                                    `啊嘿♡……脖子已经被生锈铁链勒出深可见骨的黑紫肉槽了，一拽铁链下面就会当场喷尿休克呀🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("穿搭_胸罩", `👙 胸衣与内衬「${braTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_胸罩",
                                `【🔬 胸部穿戴实况】：\n` +
                                `• 当前状态：${braTxt}\n` +
                                `• 细节：${live.braWear || (isPureZero ? "贴身内衬干净合身，稳妥地承托包裹着饱满双峰。" : "未着寸缕，饱满双乳毫无遮挡地随着呼吸微微起伏。")}`,
                                [
                                    `贴身内衬穿戴整齐，没有任何松脱或走光之虞。`,
                                    `胸口有些闷热出汗，贴身布料微微贴在皮肤上💦。`,
                                    `胸前一丝不挂地暴露在微凉的空气里，随着每一次呼吸微微起伏😳💦。`,
                                    `根本不需要穿什么胸罩内衬，光着一对饱满晃动的大奶子和硬挺乳头才方便男人随时揉捏吸吮呀🥵💦！`,
                                    `就算穿内衣也只配穿把乳头完全勒出来展示的开洞情趣胸罩，随时供主人们抓奶玩弄🥵💦❤️！`,
                                    `啊嘿♡……一对垂到肚子上的紫黑烂奶袋永远赤裸晃荡着往外狂喷血乳，再也不需要任何布料遮挡啦🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("穿搭_上衣", `👚 上衣与外衫「${topTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_上衣",
                                `【🔬 上身衣着实况】：\n` +
                                `• 当前状态：${topTxt}\n` +
                                `• 细节：${live.topWear || (isPureZero ? "外衫剪裁合体，衣褶平整，尽显端庄气质。" : "上身赤裸，背脊贴着细密薄汗，衣柜里备有待换的薄纱吊带睡裙。")}`,
                                [
                                    `身上的外衫平整洁净，完美贴合着身形。`,
                                    `后背稍微出了一层薄汗，我抬手整理了一下有些微乱的衣摆💦。`,
                                    `光着贴满薄汗的后背把脏床单换了下来，等清理完身体还得翻出件薄睡裙套上应付今晚的客人😳💦。`,
                                    `就算穿上那件极薄的黑色吊带睡裙也是真空透视的，只要男人一伸手就能直接掀开揉肉呀🥵💦！`,
                                    `母狗根本不需要穿正经上衣，光着身子或者套一件一撕就碎的情趣薄纱才是最配我的穿搭🥵💦❤️！`,
                                    `啊嘿♡……一辈子全裸展示满身溃烂烙印和正字刻痕，就是崩坏肉便器的终极礼服呀🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("穿搭_内裤", `🩲 底裤与私处「${pantyTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_内裤",
                                `【🔬 底裤与私密遮护】：\n` +
                                `• 当前状态：${pantyTxt}（体液泥泞度：${wetLevel}%）\n` +
                                `• 细节：${live.pantyWear || (isPureZero ? "底裤干爽洁净，严密贴合地保护着私密幽谷。" : "浸满白浊的纸团已丢入垃圾桶，此时下身赤裸，外阴红肿微张。")}`,
                                [
                                    `贴身底裤干爽舒适，没有任何异样感。`,
                                    `底裤稍微有些温热潮意，但还在正常的范围之内💦。`,
                                    `刚才捂在腿心的纸团早就被白浊浸透丢掉了，现在下面完全光着，得赶紧把深处的残精洗出来😳💦。`,
                                    `内裤只要穿上不到一分钟就会被我自己淌出来的淫水泡透拉丝，还不如直接真空光着屁股呢🥵💦！`,
                                    `我这种随时漏精淌水的公用骚逼只配穿把外翻阴唇勒出来的开裆丁字裤，方便大肉棒随时插进来🥵💦❤️！`,
                                    `啊嘿♡……这辈子再也不穿内裤了，让外翻脱垂的烂肉洞和脱肛直肠24小时敞开着滴精漏尿吧🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("穿搭_下装", `🍑 裙裤与臀部「${botTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_下装",
                                `【🔬 下装与臀部实况】：\n` +
                                `• 当前状态：${botTxt}\n` +
                                `• 细节：${live.bottomWear || (isPureZero ? "裙摆或裤装自然垂落，妥帖遮掩着腰臀与双腿曲线。" : "臀部毫无遮蔽，白净臀肉上交错印着几道暗红泛青的掌印。")}`,
                                [
                                    `裙摆平整垂顺，行走坐卧间都保持着得体的仪态。`,
                                    `我轻轻抚平了下摆的褶皱，注意不让姿态显得狼狈💦。`,
                                    `光溜溜的臀肉上还印着几道边缘泛青的暗红掌印，弯腰铺床单时后臀一阵阵火辣辣地发酸😳💦。`,
                                    `饱满的屁股蛋上全是男人扇出来的红巴掌印，稍微晃一下腰臀就透着一股欠操的风骚味呢🥵💦！`,
                                    `只要把屁股高高撅起来摇晃，男人们就会像发疯一样扑上来拍打我的臀肉、从后面狠狠插进来🥵💦❤️！`,
                                    `啊嘿♡……塌腰撅起印满畜生烙印的烂屁股，把脱垂的宫口和直肠完全亮出来供人排泄吧🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("穿搭_丝袜", `🧦 丝袜与双腿「${sockTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_丝袜",
                                `【🔬 腿部与丝袜实况】：\n` +
                                `• 当前状态：${sockTxt}\n` +
                                `• 细节：${live.sockWear || (isPureZero ? "双腿修长匀称，肌肤细腻白皙，并拢端正。" : "双腿赤裸微颤，大腿内侧印着青紫指痕，白浊混着淫水顺腿根滑落拉丝。")}`,
                                [
                                    `双腿姿态端正稳健，没有任何疲态或失仪之处。`,
                                    `双腿稍微有些酸沉，我暗暗稳住膝盖保持站姿💦。`,
                                    `大腿内侧全是被粗暴掐出来的指痕，粘稠的白浊顺着大腿根滑落，每走一步都带着细微的水声😳💦。`,
                                    `两条白花花的大腿内侧全是被男人掐出来的青紫指印和拉丝的白浆，双腿软得连并拢都做不到啦🥵💦！`,
                                    `好想穿上被撕开裆部的油亮黑丝或者吊带袜，把两条长腿大张成M字形架在男人肩膀上挨操呀🥵💦❤️！`,
                                    `啊嘿♡……髋骨早就脱臼长死成180度M字大开腿啦，两条大腿上永远流满腥臭黄尿和腐熟白浊呀🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("穿搭_鞋子", `👠 鞋履与玉足「${shoeTxt.slice(0, 14)}」`,
                            fmtOvr("穿搭_鞋子",
                                `【🔬 鞋履与足部实况】：\n` +
                                `• 当前状态：${shoeTxt}\n` +
                                `• 细节：${live.shoeWear || (isPureZero ? "鞋履干净合脚，纤巧玉足包裹其中，步履从容。" : "赤足踩在地面上，脚背刚擦去飞溅的污迹，脚趾前滴落着突破花唇溢出的白浊。")}`,
                                [
                                    `鞋履整洁合脚，步伐沉稳有序。`,
                                    `脚踝稍微有些酸软，走路时放慢了一些步子💦。`,
                                    `刚才擦掉了脚背上飞溅的污迹，结果弯腰塞床单角时，体内的浓精又滴答两声落在了赤裸的脚趾前😳💦。`,
                                    `光着脚丫踩在滴了精液的地板上，每当快感涌上来时十根脚趾头都会不受控制地蜷缩起来呢🥵💦！`,
                                    `快让我穿上最骚的细高跟鞋，或者直接用沾满精液的脚趾头夹住大肉棒为您足交奉侍吧🥵💦❤️！`,
                                    `啊嘿♡……萎缩废用的脚趾头永远痉挛蜷缩在自己喷出的尿洼和精液池里，连动都动不了啦🥵💦❤️❤️！`
                                ]), "none", null, true, 0)
                    ]
                },
                // 7. 苗床与受孕
                {
                    title: "苗床与受孕", icon: "🤰", summary: `${cycLabel} · 苗床崩坏${pregStageVal}%`,
                    items: [
                        mk("排卵周期", `🥚 卵巢异变与下崽化：${ovulStageVal}/100「${ovulStg}」`,
                            fmtOvr("排卵周期",
                                `【🔬 卵巢排卵与深渊下崽通道畸变度：${ovulStageVal}/100（${ovulStg}）】：\n` +
                                `• 当前周期阶段：${cycLabel} ｜ 单发受孕率：${fertProb}%\n` +
                                `• 阶段崩坏实况（图文同步）：${[
                                    "【Lv.1 平静安宁 (0%)】内视下粉嫩的卵巢安静休眠，未排卵，内部环境纯净安详。",
                                    "【Lv.2 初潮萌动】正常排卵期，卵巢微微充血发红，单颗圆润晶莹的成熟卵子破卵而出。",
                                    "【Lv.3 异常催促】受药物与发情刺激，卵巢红肿如葡萄串，同时强行排出三四颗卵子，输卵管剧烈蠕动。",
                                    "【Lv.4 排卵失控】卵巢肿大如紫红肉瘤并破开无数小孔，像喷射鱼子酱般疯狂涌出数百颗透明卵子填满输卵管！",
                                    "【Lv.5 异种卵生】卵巢结构完全魔化异变，直接产出肉眼可见、布满粗大血丝与魔纹的肉质异形巨卵！",
                                    "【💀 Lv.6 永久下崽机器（彻底崩坏）】卵巢本身已彻底融化坏死，输卵管尽头变异为连接异界深渊的烂肉黑洞！24小时不间断地向子宫涌入漆黑恶臭的魔物腐卵泡，彻底沦为非人下崽通道！"
                                ][tier6(ovulStageVal)]}`,
                                [
                                    `身体处于正常的生理周期内，卵巢安静平稳，没有任何异常排卵迹象。`,
                                    `算算日子现在正好排出一颗成熟的卵子，身体稍微有些敏感发热，必须小心保护自己💦。`,
                                    `小肚子两侧又酸又烫，被催熟的卵巢居然一次排出了好几颗卵子，这下只要被内射就肯定会怀上了😳💦。`,
                                    `卵巢已经彻底失控了！像喷鱼子酱一样往输卵管里狂喷几百颗卵子，整个小腹都被卵泡塞得满满当当🥵💦！`,
                                    `呜汪♡……变异的卵巢里面长出带血丝的异种大肉卵了，把输卵管撑得好痛好爽呀🥵💦❤️！`,
                                    `啊嘿♡……卵巢已经彻底融化变成连接深渊的黑泥产卵洞啦！24小时都在往子宫里狂涌恶臭的黑泥魔物卵，变成永动下崽机器啦🥵💦❤️❤️！`
                                ], ovulStageVal),
                            "lust",
                            { mainName: "🥚 卵巢崩坏度", label: "🎯 受孕概率", theme: "pleas", pct: fertProb, text: `受孕率 ${fertProb}%` }
                        ),
                        mk("受精断面", `🔬 受精断面与胎盘魔化：${xrayStageVal}/100「${xrayStg}」`,
                            fmtOvr("受精断面",
                                `【🔬 受精着床与食肉胎盘畸变度：${xrayStageVal}/100（${xrayStg}）】：\n` +
                                `• 💧 宫腔储精：${wombMl}ml / ${caps.wombMax}ml\n` +
                                `• 🔬 阶段崩坏实况（图文同步）：${[
                                    "【Lv.1 无暇孤卵 (0%)】干净的宫腔内仅有一颗晶莹剔透的卵子安静悬浮，无任何精子入侵。",
                                    "【Lv.2 精群围攻】内射发生，成千上万活跃的白色精子包围中央卵子，拼命钻击卵膜。",
                                    "【Lv.3 破膜着床】粗壮精子钻透卵膜，受精卵发出红光并长出细小血管，深深扎根着床进肥厚的子宫内膜。",
                                    "【Lv.4 多重受孕】宫腔化作乳白精液海，数十颗卵子同时受精，密密麻麻扎根在子宫壁上疯狂汲取母体营养。",
                                    "【Lv.5 异种寄生】漆黑带刺的触手状魔物精虫粗暴撕裂卵子、注入黑色毒液，使胚胎瞬间发生恐怖魔化畸变！",
                                    "【💀 Lv.6 腐肉苗床（彻底崩坏）】已不再需要精卵结合！整个子宫内膜彻底变异为一张巨大蠕动的食肉胎盘，吞噬一切注入的黑泥与精液，直接从血肉内壁上孵化出令人作呕的烂肉瘤球！"
                                ][tier6(xrayStageVal)]}`,
                                [
                                    `子宫内部纯净安宁，从未被任何外来精子侵入过。`,
                                    `感觉到成千上万条滚烫的精子正在肚子里围攻我的卵子，必须赶紧洗出来才行💦！`,
                                    `糟了……最粗壮的精子已经钻破卵膜扎根着床在子宫壁上了，小肚子深处传来一阵受孕的酸麻红光😳💦。`,
                                    `精液海里几十颗卵子全都被同时受精着床了！密密麻麻的胚胎趴在子宫壁上吸我的血肉营养，好胀好麻🥵💦！`,
                                    `漆黑带刺的怪物触手精虫把卵子撕裂灌进黑毒了♡，肚子里怀上畸变的怪物孽种了呀🥵💦❤️！`,
                                    `啊嘿♡……子宫内膜已经彻底变成吃肉的蠕动怪物胎盘啦！不用受精也能直接从烂肉壁上往外吐出恶心的血肉瘤球，变成生化腐肉苗床啦🥵💦❤️❤️！`
                                ], xrayStageVal),
                            "womb",
                            { mainName: "🔬 胎盘畸变度", label: "🥛 精虫密度", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }
                        ),
                        mk("精液归属", `🧬 肌体吸精与白浊同化：${dnaStageVal}/100「${dnaStg}」`,
                            fmtOvr("精液归属",
                                `【🔬 肌体吸精与白浊史莱姆同化度：${dnaStageVal}/100（${dnaStg}）】：\n` +
                                `• 💧 四穴总储精：${totalMl}ml（宫腔${wombMl}ml / 阴道${vagMl}ml / 口胃${mouthMl}ml / 直肠${analMl}ml）\n` +
                                `• 🧬 精液来源：${totalMl > 0 ? (preg.宫内精液归属 !== "无" ? preg.宫内精液归属 : `存留着恩客泵入的 ${totalMl}ml 浓精`) : "当前无游离精液"}\n` +
                                `• 阶段崩坏实况（图文同步）：${[
                                    "【Lv.1 无暇无浊 (0%)】大腿与下腹干爽洁净，毫无白浊精液沾染。",
                                    "【Lv.2 体外喷溅】大腿根部与下腹零星溅落着几缕乳白精液，顺着白皙肌肤缓缓滑落。",
                                    "【Lv.3 内射满溢】浓稠精液完全填满阴道，并从微张的红肿穴口中大量涌出、在双腿间拉出长丝。",
                                    "【Lv.4 全身精涂】全身每一寸皮肤都被厚厚的半干涸精液泥浆包裹糊满，结出层层白痂，腥臭扑鼻。",
                                    "【Lv.5 肌体吸精】皮肤发生海绵化吸精异变！全身毛孔张开直接将表面精液吸入皮下组织，使皮肤下浮现出恶心的乳白色精斑与白血管！",
                                    "【💀 Lv.6 白浊黏液怪（彻底崩坏）】肉体细胞彻底被精液同化替换！下半身皮肉已经半融化，像烂泥一样与无尽的白浊精液融合成一体，彻底畸变为一滩不断向外渗水的白浊烂肉史莱姆！"
                                ][tier6(dnaStageVal)]}`,
                                [
                                    `我的身体干干净净，没有任何男人的精液沾染。`,
                                    `大腿根和肚皮上溅到了几滴粘糊糊的热精液，得赶紧用纸巾擦掉💦。`,
                                    `射进来的精液太多了，根本兜不住，正从红肿合不拢的穴口里一缕接一缕地往外溢流拉丝😳💦。`,
                                    `全身上下都被男人们射出的浓厚精液像泥浆一样糊满结痂了，连原本的肤色都看不见了🥵💦！`,
                                    `皮肤上的毛孔全都张开像海绵一样主动把精液吸进肉里去了♡！皮下全都浮现出恶心的白斑和白血管了呀🥵💦❤️！`,
                                    `啊嘿♡……下半身的肉已经彻底被精液同化融化啦！双腿和私处全都化作一滩咕嘟咕嘟冒泡的白浊烂肉史莱姆，跟精液彻底融为一体啦🥵💦❤️❤️！`
                                ], dnaStageVal),
                            "drug",
                            { mainName: "🧬 白浊同化度", label: "🥛 四穴总精", theme: "semen", pct: Math.round((totalMl / Math.max(1, totalCapAll)) * 100), text: `合计 ${totalMl}ml` }
                        ),
                        mk("孕肚进度", `🤰 破肚胎动与透明孵化巢：${pregStageVal}/100「${pregStg}」`,
                            fmtOvr("孕肚进度",
                                `【🔬 孕肚膨隆与透明异种孵化巢畸变度：${pregStageVal}/100（${pregStg}）】：\n` +
                                `• 🤰 当前腹围膨隆度：${bellySwellPct}%（产卵/生产：${safeNum(preg.生产产卵次数)} 次）\n` +
                                `• 阶段崩坏实况（图文同步）：${[
                                    "【Lv.1 平坦马甲线 (0%)】小腹平坦紧致，带有健康的马甲线肌肉线条，毫无赘肉与隆起。",
                                    "【Lv.2 微凸孕相】下腹部出现一道温和圆润的微隆起弧线，如同孕早期般饱满柔和。",
                                    "【Lv.3 显怀大肚】肚子如吹气的气球般高高挺起，肚皮光滑发亮、肚脐外凸，皮下隐现青筋。",
                                    "【Lv.4 胎动破肚】巨腹大到违反人体比例，薄如蝉翼的肚皮表面恐怖地凸出无数只婴儿手脚的清晰轮廓，正在里面疯狂挣扎踢踹！",
                                    "【Lv.5 下垂肉囊】因无数次极限生育与灌精，肚子彻底丧失弹性，像装满水袋的重型肉囊般松垮下垂至膝盖，布满紫红撕裂妊娠纹。",
                                    "【💀 Lv.6 透明异种孵化巢（彻底崩坏）】腹部皮肤发生诡异的完全透明化病变，化作一个巨大的透明薄膜包囊！透过透明肚皮可直接看见内部翻滚的黑色羊水，以及无数畸形的异种幼体与触手胎儿正在里面互相吞噬蠕动！"
                                ][tier6(pregStageVal)]}`,
                                [
                                    `小腹平坦紧致，腰身纤细轻盈，有着健康的马甲线。`,
                                    `小肚子下面微微鼓起了一点圆润的弧度，沉甸甸地有些发酸💦。`,
                                    `肚子已经被撑得像临盆孕妇一样高高挺起了，连肚脐眼都凸了出来，肚皮绷得发亮😳💦。`,
                                    `肚皮被撑得像纸一样薄！里面好几个小手小脚正在疯狂踢踹，把肚皮都顶出一个个恐怖的手印形状了🥵💦！`,
                                    `肚子已经被彻底生坏了♡，像个装满水的破麻袋一样松松垮垮地垂到膝盖上，爬满了紫红色的撕裂纹路呀🥵💦❤️！`,
                                    `啊嘿♡……肚皮已经100%变成完全透明的塑料薄膜包囊啦！所有人都能直接透过肚皮看见黑羊水里密密麻麻互相吞噬的异种怪物幼虫，彻底变成透明活体孵化巢啦🥵💦❤️❤️！`
                                ], pregStageVal),
                            "corr",
                            { mainName: "🤰 孵化巢崩坏度", label: "🥛 腹围膨隆", theme: "semen", pct: bellySwellPct, text: `膨隆 ${bellySwellPct}%` }
                        )
                    ]
                },
                // 8. 恩客图鉴
                {
                    title: "恩客图鉴", icon: "🍆", summary: clientList.length > 0 ? `已记录 ${clientList.length} 名恩客` : `暂无恩客记录`,
                    items: clientItems
                },
                // 9. 淫乱总账
                {
                    title: "淫乱总账", icon: "💎", summary: `小穴${vagCnt} · 内射${creampie} · 接客${hookerCnt}`,
                    items: [
                        mk("破瓜纪念", `🥀 破瓜纪念：「${vagCnt === 0 ? "🌸处女完好" : (mark.初夜破瓜纪念 && !mark.初夜破瓜纪念.includes("完好") ? mark.初夜破瓜纪念.slice(0, 16) : `🌺已破瓜(累计${vagCnt}次)`)}」`,
                            fmtOvr("破瓜纪念",
                                `【🔬 处女状态与初夜档案】：\n` +
                                `• 状态：${vagCnt === 0 ? "处女膜完好无损，尚未经历任何破瓜性交" : (mark.初夜破瓜纪念 && !mark.初夜破瓜纪念.includes("完好") ? mark.初夜破瓜纪念 : `早已失去处女之身，累计承受小穴贯穿 ${vagCnt} 次、内射 ${creampie} 次`)}。`,
                                [
                                    `我的处女之身依然完好无损，这是我最珍视的清白证明。`,
                                    `回想起失去清白的那一刻，心里还是会泛起一丝复杂难言的酸涩💦。`,
                                    `早就记不清最初是什么时候变成这样的了，现在的身体已经彻底习惯了眼下的风尘生活😳💦。`,
                                    `所谓的处女膜早就变成了迎合男人的熟稔肉褶，被大肉棒捅穿开发才是我这具身体真正的归宿呀🥵💦！`,
                                    `真庆幸我那层碍事的处女膜早就被大肉棒捅烂了，现在不管是谁都能毫无阻碍地一插到底啦🥵💦❤️！`,
                                    `啊嘿♡……从破瓜那一秒起，人家就注定要被操成拳头大烂肉洞的终极排泄便器啦🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("六孔总账", `💎 性交总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${titCnt}／足${footCnt}」`,
                            fmtOvr("六孔总账",
                                `【🔬 六孔历史贯穿统计】：\n` +
                                `• 小穴：${vagCnt} 次 ｜ 口交：${mouthCnt} 次 ｜ 后庭：${analCnt} 次 ｜ 乳交：${titCnt} 次 ｜ 足交：${footCnt} 次 ｜ 异种：${beastCnt} 次\n` +
                                `【📊 当前六孔不可逆器质崩坏度】：\n` +
                                `- 🌺 小穴：${dev.vagObj.val}/100（畸变点 ${dev.vagObj.curPts}/${dev.vagObj.nextThreshold}）\n` +
                                `- 🫀 子宫：${dev.wombObj.val}/100（畸变点 ${dev.wombObj.curPts}/${dev.wombObj.nextThreshold}）\n` +
                                `- 👄 骚口：${dev.mouthObj.val}/100（畸变点 ${dev.mouthObj.curPts}/${dev.mouthObj.nextThreshold}）\n` +
                                `- 🍒 丰乳：${dev.chestObj.val}/100（畸变点 ${dev.chestObj.curPts}/${dev.chestObj.nextThreshold}）\n` +
                                `- 💧 阴蒂尿道：${dev.clitObj.val}/100（畸变点 ${dev.clitObj.curPts}/${dev.clitObj.nextThreshold}）\n` +
                                `- 🕳️ 屁眼：${dev.analObj.val}/100（畸变点 ${dev.analObj.curPts}/${dev.analObj.nextThreshold}）`,
                                [
                                    `所有性交记录全部为 0，我的身体从上到下都保持着绝对的完好与清白。`,
                                    `看着上面记录的次数，脸颊还是有些发热，希望不要再轻易增加了💦。`,
                                    `身体已经被贯穿开发了这么多次，全身的粘膜和肉壁早就出现不可逆的松弛与熟稔记忆了😳💦。`,
                                    `看着这串不断增加的挨操次数，外翻的骚穴居然自豪地一抽一缩，好想让数字涨得更快一点呀🥵💦！`,
                                    `才被操了这么点次数根本不够塞牙缝嘛♡，快把我的三穴次数全都刷到成百上千次、把所有孔穴都操脱垂吧🥵💦❤️！`,
                                    `啊嘿♡……全身六个孔穴全都已经被操到100%器质崩坏报废啦，请继续往烂肉洞里捅到死为止吧🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("高潮总账", `💎 高潮与失禁：「高潮${orgasmCnt}／强制${forceOrgCnt}／寸止${edgeCnt}／喷潮${squirtCnt}／失禁${leakCnt}」`,
                            fmtOvr("高潮总账",
                                `【🔬 高潮与括约肌失控统计】：\n` +
                                `• 累计高潮：${orgasmCnt} 次（强制高潮 ${forceOrgCnt} 次，寸止 ${edgeCnt} 次）\n` +
                                `• 潮吹喷水：${squirtCnt} 次 ｜ 漏尿失禁：${leakCnt} 次 ｜ 阿嘿颜脑死：${ahegaoCnt} 次 ｜ 自慰：${mastCnt} 次。`,
                                [
                                    `高潮与失控记录全为 0，我始终保持着良好的自制力。`,
                                    `身体偶尔会在刺激下有些失控发抖，我必须努力克制住自己💦。`,
                                    `这具身体在情事中已经经历过太多次高潮，括约肌与敏感带变得越来越容易失控了😳💦。`,
                                    `一看到累计高潮 ${orgasmCnt} 次的记录，尾椎骨就一阵发麻，稍微刺激一下就会漏尿喷水呢🥵💦！`,
                                    `好喜欢被强制操到潮吹喷水和大小便失禁呀♡，快让我翻着白眼高潮到脑髓短路吧🥵💦❤️！`,
                                    `啊嘿♡……多巴胺和尿道括约肌已经彻底烧穿报废啦，人家24小时都在一边翻白眼抽搐一边往外失禁漏尿呀🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("射精总账", `💎 射精与泌乳：「内射${creampie}／颜射${facialCnt}／吞精${swallowCnt}(${swallowMl}ml)／喷乳${milkMl}ml」`,
                            fmtOvr("射精总账",
                                `【🔬 精液灌注与泌乳统计】：\n` +
                                `• 子宫内射：${creampie} 次 ｜ 颜射体外：${facialCnt} 次\n` +
                                `• 口穴吞精：${swallowCnt} 次（累计 ${swallowMl}ml） ｜ 乳腺泌乳：${milkCnt} 次（累计 ${milkMl}ml）。`,
                                [
                                    `体内从未被注入过任何雄性体液，保持着完全的洁净。`,
                                    `想到身上或体内沾染过的温热白浊，耳根还是会忍不住发烫💦。`,
                                    `子宫已经被内射过 ${creampie} 次，每次事后清理那些粘稠拉丝的精液都让人感到一阵疲惫与酸麻😳💦。`,
                                    `不管是射进子宫里还是射在嘴里、脚背上，我的身体早就已经被男人的浓精味彻底浸染透了🥵💦！`,
                                    `快把成百上千毫升的滚烫浓精全都射进我的脱垂子宫和胃袋里，把母狗从里到外灌成白浊泡芙吧🥵💦❤️！`,
                                    `啊嘿♡……累计吞精和内射突破天际啦，全身上下每一个毛孔和烂肉洞都在往外冒着腐熟的浓精呀🥵💦❤️❤️！`
                                ]), "none", null, true, 0),
                        mk("露出总账", `💎 接客与轮奸：「接客${hookerCnt}／轮奸${gangCnt}／睡奸${sleepCnt}／露出${safeNum(cnt.暴露?.露出)}」`,
                            fmtOvr("露出总账",
                                `【🔬 风月交易与多人凌辱统计】：\n` +
                                `• 接客卖身：${hookerCnt} 次 ｜ 被外借共享：${safeNum(cnt.交易?.被外借共享)} 次\n` +
                                `• 多人轮奸：${gangCnt} 次 ｜ 睡眠昏迷奸：${sleepCnt} 次\n` +
                                `• 赤裸露出：${safeNum(cnt.暴露?.露出)} 次（围观 ${safeNum(cnt.暴露?.被围观人次)} 人次，留影 ${safeNum(cnt.暴露?.被拍摄留影)} 次）。`,
                                [
                                    `所有交易、暴露与凌辱记录均为 0，我始终守护着自己的清白与安全。`,
                                    `面对复杂危险的处境，我必须多加提防，不让自己陷入被动局面💦。`,
                                    `经历过这么多轮回与折腾，身体和神智似乎都已经渐渐麻木并顺从了这种处境😳💦。`,
                                    `看着累计记录达到了 ${hookerCnt} 次，身体已经越来越习惯顺从这些过往的经历了。`,
                                    `最喜欢接客卖身和被好几个男人一起轮奸群交了♡，快把我的三穴同时塞满操烂吧🥵💦❤️！`,
                                    `啊嘿♡……全天候不打烊的公用轮奸排泄肉坑，欢迎全世界的男人排队过来把我操到彻底报废呀🥵💦❤️❤️！`
                                ]), "none", null, true, 0)
                    ]
                }
            ];

            const customMap = v.自定义条目 || {};
            baseCategories.forEach(cat => {
                const customList = Array.isArray(customMap[cat.title]) ? customMap[cat.title] : [];
                customList.forEach(cItem => {
                    if (!cItem || !cItem.id) return;
                    const rk = `${cItem.title || "✨ 自定义状态"}${cItem.ratio ? `：${cItem.ratio}` : ""}${cItem.stage ? `「${cItem.stage}」` : ""}`;
                    const fullDesc = `${cItem.desc || "暂无详细描述"}\n💭【${u}的实时心声】：“*${cleanThoughtText(cItem.thought || "……")}*”`;
                    cat.items.push({
                        editKey: cItem.id,
                        isCustom: true,
                        catTitle: cat.title,
                        rawKey: rk,
                        desc: fullDesc,
                        ...fmtKey(rk, cItem.ratio ? "pleas" : "none", null, !cItem.ratio)
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
                floorId: checkCardAvailable(true) ? (viewingHistoryFloor !== null ? `#${viewingHistoryFloor}层(回溯)` : `${c} · 实时`) : "未选择角色卡",
                categories: buildFullFallbackCategories(trueProtagName, c, curVars)
            };
        }

        function applyThemeAndSize() {
            const root = document.getElementById("st-v5-root");
            if (root) root.style.display = userSettings.enabled ? "block" : "none";
            const panel = document.getElementById("st-v5-panel");
            const headerBar = document.getElementById("st-v5-header");
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
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
            const corr = safeNum(curVars.核心数值?.淫乱恶堕, 0);
            const personaAndDesc = safeStr(ctx?.power_user?.persona_description) + "\n" + safeStr(ctx?.characters?.[ctx?.characterId]?.description).slice(0, 800);
            const recentMes = (personaAndDesc + "\n" + safeStr((ctx?.chat || []).slice(-6).map(m => m?.mes || "").join("\n"))).slice(-3200);

            const sysPrompt = "你是一个纯粹的 JSON 生成器，必须且只能输出一个标准 JSON 对象！字符串内部严禁出现英文双引号或换行符！";
            const userPrompt = `请根据当前剧情上下文与用户的【自定义要求】，为主角【${u}（身份：${realId}，当前恶堕度：${corr}/100）】的状态栏按钮【${itemTitle}】编写状态描述（120~180字，遵循第1阶段完好如初到第6阶段彻底器质崩坏畸变的逻辑）以及一段符合当前崩坏阶位的第一人称实时心声（80~130字）！

【用户自定义要求】：${userHint || "结合当前最新剧情与角色处境编写"}
【最近剧情参考】：
${recentMes || "无"}

直接输出如下结构的纯 JSON 对象（以 { 开头，以 } 结尾）：
{
  "title": "${safeStr(itemTitle).replace(/"/g, "")}",
  "stage": "4至6字状态概括",
  "ratio": "50/100",
  "desc": "【🔬 状态实况】：详细描写...",
  "thought": "符合当前崩坏阶位的第一人称内心独白..."
}`;

            const oldTxt = btnEl ? btnEl.textContent : "";
            const isMiniBtn = oldTxt.trim() === "🔄";
            if (btnEl) { btnEl.textContent = isMiniBtn ? "⏳" : "⏳ 生成中..."; btnEl.disabled = true; }
            try {
                const { reply } = await callSubApiRaw(sysPrompt, userPrompt);
                const parsed = repairAndParseJson(reply);
                if (parsed && (parsed.desc || parsed.thought)) {
                    showToast("✨ 已刷新该项状态与心声！", "success", 2500);
                    return parsed;
                }
                throw new Error("返回格式未能解析为JSON");
            } catch (err) {
                showToast("❌ 生成失败：" + (err.message || "请检查副API设置"), "error", 3500);
                return null;
            } finally {
                if (btnEl) { btnEl.textContent = oldTxt || "✨ AI生成"; btnEl.disabled = false; }
            }
        }
        function buildFullJsonApiPrompt(u, c, rawText) {
            const realId = detectRealCharacterIdentity(curVars);
            const ctx = safeCtx();
            const allRecentText = (ctx?.chat || []).slice(-5).map(m => safeStr(m?.mes)).join("\n");

            return `[SYSTEM OVERRIDE: 你现在是一个纯粹的 JSON 数据生成器，必须且只能输出一个标准 JSON 对象！字符串内部严禁出现英文双引号 " 或换行符！]

请仔细阅读下方【最近剧情与设定正文】，大刀阔斧地重构并更新主角【${u}（身份：${realId}）】的全部状态栏数值与历史计数！
🚨【强制破冰与防虚假升阶铁律】：
1. 如果正文中提到主角“有无数年经验 / 身经百战 / 妓女 / 暗娼 / 荡妇 / 熟女 / 经常做爱 / 被无数人玩过”，你【必须】将下方 JSON 中的 "计数"（小穴、口、内射、高潮、接客等）直接大幅调高为符合设定的高数值，并将“淫乱恶堕”、“对肉棒好感度”、“服从度”直接拉高到 65~98，将“羞耻度”降低到 5~30！
2. 严禁虚构未发生的肉体改造！如果正文中没有明确描写刻有淫纹、穿刺打环或塞入体内道具，对应的 "淫纹与刻印"、"穿刺与环饰"、"体内道具" 必须填 "无"！
3. 严禁把死物、道具（如笔、跳蛋、黄瓜、衣服）当成恩客！只有真正的活人男性角色才能写入 "恩客图鉴"。

【最近剧情与设定正文】：
${safeStr(allRecentText || rawText).slice(-3500)}

请直接输出如下结构的纯 JSON 对象（以 { 开头，以 } 结尾）：
{
  "当前认知名字": "${u}",
  "种族与体质": "${realId}",
  "生理周期阶段": "危险排卵期或正常生理期",
  "受孕概率": 50,
  "体力": 75,
  "对肉棒好感度": 75,
  "性欲程度": 80,
  "淫乱恶堕": 78,
  "羞耻度": 22,
  "服从度": 74,
  "沦陷度": 70,
  "快感累积": 65,
  "口内毫升": 0,
  "小穴毫升": 5,
  "子宫毫升": 15,
  "屁眼毫升": 0,
  "体表痕迹": "根据正文概括体表伤痕或填无",
  "淫纹与刻印": "无",
  "穿刺与环饰": "无",
  "体内道具": "无",
  "计数": { "口": 120, "小穴": 260, "屁眼": 45, "乳穴": 80, "足腿": 30, "高潮": 310, "强制高潮": 85, "寸止": 40, "内射": 190, "颜射": 70, "吞精次数": 95, "吞精毫升": 1400, "喷乳次数": 20, "喷乳毫升": 600, "自慰": 150, "失禁": 35, "喷潮": 90, "露出": 60, "接客": 180, "轮奸": 25, "睡奸": 15 },
  "当前姿势": "根据正文概括当前姿势",
  "恩客图鉴": { "活人男性恩客名字": "一句话概括该男性的阳具特征与对主角的玩法" },
  "按钮详情": {
    "内心独白": { "thought": "符合当前设定与崩坏阶位的第一人称心理独白" },
    "当前姿势": { "desc": "当前肢体动作与状态详写", "thought": "第一人称心声" },
    "骚口实况": { "desc": "唇舌咽喉与储精实况描写", "thought": "第一人称心声" },
    "胸部实况": { "desc": "胸部与乳腺实况描写", "thought": "第一人称心声" },
    "小穴实况": { "desc": "小穴与储精实况描写", "thought": "第一人称心声" },
    "子宫实况": { "desc": "子宫与宫腔实况描写", "thought": "第一人称心声" },
    "阴蒂尿道": { "desc": "阴蒂与尿道实况描写", "thought": "第一人称心声" },
    "屁眼实况": { "desc": "臀部与后庭实况描写", "thought": "第一人称心声" }
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
                            if (/^[:,}\]]/.test(rest)) {
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
                return null;
            }
        }

        function applyApiFullResponse(replyText, targetMsg, fid, sourceLabel = "副API") {
            if (!replyText) return false;
            const data = repairAndParseJson(replyText);
            if (data && typeof data === "object") {
                const v = curVars;
                if (!v.档案.手动锁定真名 && data.当前认知名字 && safeStr(data.当前认知名字).trim()) {
                    v.档案.当前认知名字 = safeStr(data.当前认知名字).trim();
                }
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
                if (data.淫纹与刻印) v.痕迹与标记.淫纹与刻印 = safeStr(data.淫纹与刻印);
                if (data.公开涂鸦字迹) v.痕迹与标记.公开涂鸦字迹 = safeStr(data.公开涂鸦字迹);
                if (data.穿刺与环饰) v.痕迹与标记.穿刺与环饰 = safeStr(data.穿刺与环饰);
                if (data.体内道具) v.体内道具与权限.体内道具 = safeStr(data.体内道具);
                if (data.当前敏感点) v.精神与心理扩展.当前敏感点 = safeStr(data.当前敏感点);
                if (data.规矩与日程) v.调教进度.规矩与日程 = safeStr(data.规矩与日程);
                if (data.恩客图鉴 && typeof data.恩客图鉴 === "object") {
                    v.恩客图鉴 = { ...(v.恩客图鉴 || {}), ...data.恩客图鉴 };
                }
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
                showToast(`✅ ${sourceLabel}重绘完成！`, "success", 3000);
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
            if (btnEl) btnEl.textContent = "⏳ 重绘中...";
            showToast(`⏳ 正在通过副 API 为【${u}】重绘状态...`, "info", 4000);
            try {
                const sysPrompt = "你是一个只输出标准 JSON 对象的状态栏实时重绘引擎。严禁输出任何 markdown 标记或多余解释，字符串内部严禁使用未转义的英文双引号。";
                const userPrompt = buildFullJsonApiPrompt(u, c, rawText);
                const { reply, source } = await callSubApiRaw(sysPrompt, userPrompt);
                const ok = applyApiFullResponse(reply, targetMsg, fid, source);
                if (btnEl) btnEl.textContent = ok ? "✅ 重绘成功" : "⚠️ 已自动修复";
            } catch (err) {
                console.error(err);
                if (btnEl) btnEl.textContent = "❌ 失败";
                showToast("❌ 副API重绘失败：" + (err.message || "请检查设置"), "error", 4000);
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
            if (!modelsUrl) { showToast("⚠️ 请先填写有效的副 API 地址！", "error"); return; }
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
                showToast("❌ 拉取模型失败：" + (err.message || "网络错误"), "error", 4000);
            }
        }

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

            let pct = (item.pct !== null && item.pct !== undefined) ? item.pct : 0;
            const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
            const stageIdx = item.hasStageBar ? tier6(pct, isRev) : 0;
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
                    <button id="st-lb-mode-btn" type="button" style="background:rgba(243,139,168,0.94);color:#11111b;border:none;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.7);">🔍 切换比例</button>
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
                    modeBtn.textContent = "🔍 铺满屏幕";
                } else if (curMode === 1) {
                    lb.style.justifyContent = "center";
                    lb.style.alignItems = "center";
                    fullImg.style.width = "100vw";
                    fullImg.style.height = "100vh";
                    fullImg.style.objectFit = "cover";
                    modeBtn.textContent = "🔍 200%特写";
                } else {
                    lb.style.justifyContent = "flex-start";
                    lb.style.alignItems = "flex-start";
                    fullImg.style.width = "200vw";
                    fullImg.style.height = "auto";
                    fullImg.style.objectFit = "contain";
                    modeBtn.textContent = "🔄 恢复原始";
                }
            };

            closeBtn.onclick = (e) => { e.stopPropagation(); lb.style.display = "none"; };
            fullImg.onclick = () => { lb.style.display = "none"; };
        }
        // =========================================================================
        // 🔍 详情弹窗（新增：上帝模式滑块直调 + 一键复制 <image> 绘图块 + 删除恩客）
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

            let pctForLabel = (item.pct !== null && item.pct !== undefined) ? item.pct : 0;
            const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
            const curStageIdx = item.hasStageBar ? (tier6(pctForLabel, isRev) + 1) : 1;
            const defaultStageImgKey = `${item.editKey || "custom"}_${curStageIdx}`;

            const imgBoxHTML = `
                <div id="st-v25-img-container" title="点击全屏放大查看" style="display:none;margin-bottom:10px;position:relative;border-radius:12px;overflow:hidden;border:1.5px solid ${curStageIdx === 6 ? "#fde047" : "#f38ba8"};background:radial-gradient(circle,#1e152a,#0d0914);box-shadow:0 6px 20px rgba(0,0,0,0.65);justify-content:center;align-items:center;cursor:zoom-in;">
                    <img id="st-v25-stage-img" alt="阶段状态图" style="max-width:100%;max-height:220px;object-fit:contain;display:block;margin:0 auto;">
                    ${item.hasStageBar ? `<span style="position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,0.75);color:#fde047;border:1px solid rgba(253,224,71,0.5);padding:1px 8px;border-radius:99px;font-size:10.5px;font-weight:bold;pointer-events:none;">🔍 Lv.${curStageIdx}</span>` : ""}
                </div>`;

            const clientDeleteBarHTML = item.isClient
                ? `<div style="display:flex;justify-content:flex-end;margin-bottom:6px;">
                       <button id="st-v25-del-client-quick" type="button" style="background:rgba(220,38,38,0.28);color:#fca5a5;border:1px solid #ef4444;border-radius:7px;padding:3px 10px;font-size:11.5px;cursor:pointer;font-weight:bold;">🗑️ 删除此恩客 (${item.clientName})</button>
                   </div>`
                : "";

            const rawDesc = safeStr(item.desc, "暂无详细描述").replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;");
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
                const tHeader = tMatch ? tMatch[1] : "【实时心声】";
                rawThoughtPure = cleanThoughtText(tMatch ? tMatch[2] : thoughtPart);
                thoughtHTML = `<div class="st-thought-box"><b style="color:#f9e2af;font-style:normal;font-size:13px;display:block;margin-bottom:5px;">💭 ${tHeader}</b>“*${rawThoughtPure}*”</div>`;
            }

            // 上帝模式直调滑块：支持对所有带进度条的项目直接强制设定 0~100 数值，对四孔支持修改储精毫升
            const holeMlMap = {
                "骚口实况": "口内毫升",
                "小穴实况": "小穴毫升",
                "子宫实况": "子宫毫升",
                "屁眼实况": "屁眼毫升"
            };
            const mlField = holeMlMap[item.editKey];
            const curMlVal = mlField ? safeNum(curVars.体内精液存量?.[mlField], 0) : 0;

            const godSliderHTML = item.hasStageBar ? `
                <div style="background:rgba(243,139,168,0.12);border:1px solid rgba(243,139,168,0.4);border-radius:8px;padding:8px 10px;display:flex;flex-direction:column;gap:6px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <b style="color:#fde047;font-size:11.5px;">🎛️ 上帝直调数值：<span id="st-god-val-txt">${pctForLabel}</span>/100</b>
                        <button id="st-god-unlock-btn" type="button" style="background:rgba(255,255,255,0.12);color:#cbd5e1;border:1px solid rgba(255,255,255,0.25);border-radius:5px;padding:1px 7px;font-size:10.5px;cursor:pointer;">解除强制锁定</button>
                    </div>
                    <input id="st-god-val-rng" type="range" min="0" max="100" value="${pctForLabel}" style="width:100%;accent-color:#f38ba8;cursor:pointer;">
                    ${mlField ? `
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px;">
                        <span style="color:#a5f3fc;font-size:11.5px;font-weight:bold;">🥛 当前储精量 (ml)：</span>
                        <input id="st-god-ml-inp" type="number" min="0" max="5000" value="${curMlVal}" style="width:90px;background:#11111b;color:#a5f3fc;border:1px solid #67e8f9;border-radius:6px;padding:3px 6px;font-size:12px;font-weight:bold;">
                    </div>` : ""}
                </div>` : "";

            const rawObjPure = safeStr(item.desc).split(/💭(?=【)/)[0].trim();
            const editorHTML = `
                <div id="st-v25-item-editor" style="display:none;margin-top:12px;padding:12px;background:rgba(15,12,26,0.95);border:1.5px dashed #f9e2af;border-radius:10px;flex-direction:column;gap:8px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
                        <b style="color:#f9e2af;font-size:12px;">✏️ 编辑内容与配图 (${defaultStageImgKey})</b>
                        ${(item.isCustom || item.isClient) ? `<button id="st-v25-del-custom" type="button" style="background:rgba(220,38,38,0.3);color:#fca5a5;border:1px solid #ef4444;border-radius:6px;padding:2px 8px;font-size:11.5px;cursor:pointer;font-weight:bold;">🗑️ 删除此项</button>` : ""}
                    </div>
                    ${godSliderHTML}
                    <input id="st-v25-ed-title" type="text" value="${safeStr(item.rawKey).replace(/"/g, "&" + "quot;")}" placeholder="按钮标题" style="background:#11111b;color:#f9e2af;border:1px solid rgba(255,255,255,0.25);border-radius:6px;padding:6px 8px;font-size:12.5px;font-weight:bold;">
                    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                        <input id="st-v25-ed-img" type="text" value="${savedManualUrl.replace(/"/g, "&" + "quot;")}" placeholder="🖼️ 留空默认匹配 ${defaultStageImgKey}" style="flex:1;min-width:150px;background:#11111b;color:#a6e3a1;border:1px solid rgba(166,227,161,0.45);border-radius:6px;padding:6px 8px;font-size:12px;">
                        <input id="st-v25-single-file" type="file" accept="image/*" style="display:none;">
                        <button id="st-v25-pick-img-btn" type="button" style="background:linear-gradient(135deg,#a6e3a1,#67e8f9);color:#11111b;border:none;border-radius:6px;padding:6px 10px;font-size:11.5px;font-weight:900;cursor:pointer;white-space:nowrap;">📁 相册选图</button>
                        <button id="st-v25-clr-img-btn" type="button" style="background:rgba(255,255,255,0.1);color:#cbd5e1;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:11px;cursor:pointer;">重置图</button>
                    </div>
                    <input id="st-v25-ed-hint" type="text" placeholder="💡 输入要求后点下方 AI 生成" style="background:#1a162b;color:#a5f3fc;border:1px solid #67e8f9;border-radius:6px;padding:6px 8px;font-size:12px;">
                    <textarea id="st-v25-ed-desc" rows="4" placeholder="详细描述..." style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;resize:vertical;">${rawObjPure}</textarea>
                    <textarea id="st-v25-ed-thought" rows="3" placeholder="第一人称心声..." style="background:#11111b;color:#ffd6e7;border:1px solid rgba(243,139,168,0.4);border-radius:6px;padding:6px 8px;font-size:12px;resize:vertical;">${rawThoughtPure}</textarea>
                    <div style="display:flex;gap:8px;justify-content:flex-end;">
                        <button id="st-v25-ed-ai-btn" type="button" style="background:linear-gradient(135deg,#cba6f7,#89b4fa);color:#11111b;border:none;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:bold;cursor:pointer;">✨ AI生成</button>
                        <button id="st-v25-ed-save-btn" type="button" style="background:#a6e3a1;color:#11111b;border:none;border-radius:7px;padding:6px 14px;font-size:12px;font-weight:bold;cursor:pointer;">💾 保存</button>
                    </div>
                </div>`;

            const descContainer = document.getElementById("st-v6-det-desc");
            descContainer.innerHTML = clientDeleteBarHTML + imgBoxHTML + objHTML + thoughtHTML + editorHTML;
            document.getElementById("st-v6-det-page").textContent = `${cat.icon} ${cat.title} (${itemIdx + 1}/${cat.items.length})`;
            ov.style.display = "flex";

            // 绑定一键复制此阶段 <image> 绘图块按钮
            const copyTagBtn = document.getElementById("st-v6-copy-imgtag");
            if (copyTagBtn) {
                copyTagBtn.onclick = async (e) => {
                    e.stopPropagation();
                    const u = detectProtagonistName(curVars);
                    const blockTxt = buildDanbooruImageBlock(item, curStageIdx, u);
                    try {
                        await navigator.clipboard.writeText(blockTxt);
                        showToast(`🎨 已复制【${item.cleanTitle} · Lv.${curStageIdx}】微距 <image> 块到剪贴板！`, "success", 2800);
                    } catch (err) {
                        const ta = document.createElement("textarea");
                        ta.value = blockTxt;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand("copy");
                        ta.remove();
                        showToast(`🎨 已复制【${item.cleanTitle} · Lv.${curStageIdx}】微距 <image> 块！`, "success", 2800);
                    }
                };
            }

            const godRng = document.getElementById("st-god-val-rng");
            const godTxt = document.getElementById("st-god-val-txt");
            const godUnlockBtn = document.getElementById("st-god-unlock-btn");
            let godSliderChanged = false;
            if (godRng && godTxt) {
                godRng.oninput = () => {
                    godSliderChanged = true;
                    godTxt.textContent = godRng.value;
                };
            }
            if (godUnlockBtn && item.editKey) {
                godUnlockBtn.onclick = () => {
                    if (curVars.上帝强制锁定) delete curVars.上帝强制锁定[item.editKey];
                    if (curVars.按钮详情?.[item.editKey]) delete curVars.按钮详情[item.editKey].customTitle;
                    saveChatCache(curVars);
                    latestStatus = getFallbackData();
                    renderBody();
                    showDetailPopup(itemIdx);
                    showToast("🔓 已解除该项的上帝数值锁定，恢复自动计算！", "info", 2200);
                };
            }

            const removeClientHandler = () => {
                if (!item.clientName) return;
                curVars.已屏蔽恩客 = Array.isArray(curVars.已屏蔽恩客) ? curVars.已屏蔽恩客 : [];
                if (!curVars.已屏蔽恩客.includes(item.clientName)) {
                    curVars.已屏蔽恩客.push(item.clientName);
                }
                if (curVars.恩客图鉴 && curVars.恩客图鉴[item.clientName]) {
                    delete curVars.恩客图鉴[item.clientName];
                }
                saveChatCache(curVars);
                latestStatus = getFallbackData();
                ov.style.display = "none";
                renderBody();
                showToast(`🗑️ 已删除恩客「${item.clientName}」！`, "info", 2200);
            };

            const quickDelClientBtn = document.getElementById("st-v25-del-client-quick");
            if (quickDelClientBtn) quickDelClientBtn.onclick = removeClientHandler;

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
                        showToast(`🖼️ 已更换【${item.cleanTitle}】配图！`, "success", 2200);
                    } catch (err) {
                        showToast("❌ 换图失败", "error");
                    } finally {
                        pickImgBtn.textContent = "📁 相册选图";
                    }
                };
            }

            if (clrImgBtn && imgUrlInp) {
                clrImgBtn.onclick = () => {
                    imgUrlInp.value = "";
                    showToast("🔄 已恢复默认配图，请点【💾 保存】生效", "info", 2000);
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
                    let newTitle = document.getElementById("st-v25-ed-title").value.trim();
                    const newImgUrl = document.getElementById("st-v25-ed-img").value.trim();
                    const newDesc = document.getElementById("st-v25-ed-desc").value.trim();
                    const newThought = cleanThoughtText(document.getElementById("st-v25-ed-thought").value);

                    // 处理上帝滑块直调与储精量直改
                    if (godRng && godSliderChanged && item.editKey) {
                        const forcedVal = Number(godRng.value);
                        curVars.上帝强制锁定 = curVars.上帝强制锁定 || {};
                        curVars.上帝强制锁定[item.editKey] = forcedVal;
                        // 若未手动修改标题文字，则让标题自动跟随新滑块数值重新生成
                        if (newTitle === item.rawKey) newTitle = "";
                    }
                    const mlInp = document.getElementById("st-god-ml-inp");
                    if (mlInp && mlField) {
                        curVars.体内精液存量[mlField] = Math.max(0, Number(mlInp.value) || 0);
                    }

                    if (item.isCustom && item.catTitle) {
                        const list = curVars.自定义条目?.[item.catTitle] || [];
                        const found = list.find(x => x.id === item.editKey);
                        if (found) {
                            if (newTitle) found.title = newTitle;
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
                            ...(newTitle ? { customTitle: newTitle } : {}),
                            imgUrl: newImgUrl,
                            desc: newDesc,
                            thought: newThought
                        };
                    } else if (item.editKey) {
                        curVars.按钮详情 = curVars.按钮详情 || {};
                        curVars.按钮详情[item.editKey] = {
                            ...(newTitle ? { customTitle: newTitle } : {}),
                            imgUrl: newImgUrl,
                            desc: newDesc,
                            thought: newThought
                        };
                    }

                    saveChatCache(curVars);
                    latestStatus = getFallbackData();
                    renderBody();
                    showDetailPopup(itemIdx);
                    showToast("💾 已保存修改！", "success", 2000);
                };
            }

            const delBtn = document.getElementById("st-v25-del-custom");
            if (delBtn) {
                delBtn.onclick = () => {
                    if (item.isClient) {
                        removeClientHandler();
                        return;
                    }
                    if (item.isCustom && item.catTitle) {
                        curVars.自定义条目[item.catTitle] = (curVars.自定义条目[item.catTitle] || []).filter(x => x.id !== item.editKey);
                        saveChatCache(curVars);
                        latestStatus = getFallbackData();
                        ov.style.display = "none";
                        renderBody();
                        showToast("🗑️ 已删除该自定义项！", "info", 2000);
                    }
                };
            }
        }

        function openAddCustomItemModal(catTitle) {
            const ov = document.getElementById("st-v6-detail-modal");
            if (!ov) return;
            document.getElementById("st-v6-det-title").innerHTML = `<span style="color:#f9e2af;font-weight:bold;font-size:14.5px;">➕ 新增【${catTitle}】项目</span>`;
            document.getElementById("st-v6-det-bar").innerHTML = "";
            document.getElementById("st-v6-det-page").textContent = catTitle;

            const descContainer = document.getElementById("st-v6-det-desc");
            descContainer.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:9px;padding:6px 2px;">
                    <input id="st-v25-new-title" type="text" placeholder="名称（如：💍 阴蒂锁环 或 🍆 新增恩客）" style="background:#11111b;color:#f9e2af;border:1px solid #f38ba8;border-radius:7px;padding:7px 10px;font-size:13px;font-weight:bold;">
                    <div style="display:flex;gap:8px;">
                        <input id="st-v25-new-ratio" type="text" placeholder="崩坏进度（如 65/100，留空无进度条）" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:6px 8px;font-size:12px;">
                        <input id="st-v25-new-stage" type="text" placeholder="状态标签（如 穿戴中）" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:6px 8px;font-size:12px;">
                    </div>
                    <div style="display:flex;gap:6px;align-items:center;">
                        <input id="st-v25-new-img" type="text" placeholder="🖼️ 配图地址或从右侧相册选择" style="flex:1;background:#11111b;color:#a6e3a1;border:1px solid rgba(166,227,161,0.4);border-radius:7px;padding:6px 10px;font-size:12px;">
                        <input id="st-v25-new-file" type="file" accept="image/*" style="display:none;">
                        <button id="st-v25-new-pick-img" type="button" style="background:linear-gradient(135deg,#a6e3a1,#67e8f9);color:#11111b;border:none;border-radius:7px;padding:6px 10px;font-size:11.5px;font-weight:900;cursor:pointer;white-space:nowrap;">📁 相册选图</button>
                    </div>
                    <input id="st-v25-new-hint" type="text" placeholder="✨ AI生成提示词（选填）" style="background:#1a162b;color:#a5f3fc;border:1px solid #67e8f9;border-radius:7px;padding:7px 10px;font-size:12px;">
                    <textarea id="st-v25-new-desc" rows="4" placeholder="详细状态描述..." style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:7px 10px;font-size:12px;resize:vertical;"></textarea>
                    <textarea id="st-v25-new-thought" rows="3" placeholder="第一人称心声..." style="background:#11111b;color:#ffd6e7;border:1px solid rgba(243,139,168,0.4);border-radius:7px;padding:7px 10px;font-size:12px;resize:vertical;"></textarea>
                    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
                        <button id="st-v25-new-ai-btn" type="button" style="background:linear-gradient(135deg,#cba6f7,#89b4fa);color:#11111b;border:none;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">✨ AI自动补全</button>
                        <button id="st-v25-new-save-btn" type="button" style="background:#a6e3a1;color:#11111b;border:none;border-radius:8px;padding:7px 16px;font-size:12.5px;font-weight:bold;cursor:pointer;">➕ 确认添加</button>
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
                const th = cleanThoughtText(document.getElementById("st-v25-new-thought").value) || "……";

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
                showToast(`✅ 已添加「${t}」！`, "success", 2200);
            };
        }

        // =========================================================================
        // ⚙️ 设置面板（新增：💾 存档与配图一键备份导出 / 导入恢复）
        // =========================================================================
        function renderSettingsView(body) {
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            const box = document.createElement("div");
            box.style.cssText = "display:flex;flex-direction:column;gap:12px;font-size:12.5px;";
            const hasModels = Array.isArray(userSettings.modelList) && userSettings.modelList.length > 0;
            const curProtag = detectProtagonistName(curVars);

            box.innerHTML = `
                <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                    <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">📦 本地配图与全量存档备份</div>
                    <div style="font-size:11.5px;color:${tc.sub};">
                        已载入配图：<b id="st-idb-count" style="color:#a6e3a1;font-size:13.5px;">${importedImgCache.size}</b> 张
                    </div>
                    <input id="st-import-zip-inp" type="file" accept=".zip,application/zip,application/x-zip-compressed" style="display:none;">
                    <input id="st-import-files-inp" type="file" multiple accept="image/*" style="display:none;">
                    <input id="st-import-backup-inp" type="file" accept=".json,application/json" style="display:none;">
                    <div style="display:flex;gap:7px;flex-wrap:wrap;">
                        <button id="st-btn-imp-zip" type="button" style="flex:1.2;background:linear-gradient(135deg,#a6e3a1,#67e8f9);color:#11111b;border:none;border-radius:8px;padding:8px 10px;font-weight:900;cursor:pointer;font-size:12px;">📦 导入 ZIP 图包</button>
                        <button id="st-btn-imp-files" type="button" style="flex:1;background:rgba(166,227,161,0.2);color:#a6e3a1;border:1px solid #a6e3a1;border-radius:8px;padding:8px 10px;font-weight:bold;cursor:pointer;font-size:12px;">🖼️ 批量导入图片</button>
                        <button id="st-btn-clr-idb" type="button" style="background:rgba(239,68,68,0.25);color:#fca5a5;border:1px solid #ef4444;border-radius:8px;padding:8px 10px;font-weight:bold;cursor:pointer;font-size:12px;">🗑️ 清空图库</button>
                    </div>
                    <div style="display:flex;gap:7px;flex-wrap:wrap;padding-top:4px;border-top:1px dashed rgba(255,255,255,0.12);">
                        <button id="st-btn-export-backup" type="button" style="flex:1;background:rgba(249,226,175,0.18);color:#fde047;border:1px solid #fde047;border-radius:8px;padding:7px 10px;font-weight:bold;cursor:pointer;font-size:11.5px;">💾 导出存档+图库备份(.json)</button>
                        <button id="st-btn-import-backup" type="button" style="flex:1;background:rgba(203,166,247,0.2);color:#f5c2e7;border:1px solid #cba6f7;border-radius:8px;padding:7px 10px;font-weight:bold;cursor:pointer;font-size:11.5px;">📂 恢复备份(.json)</button>
                    </div>
                </div>
                <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                    <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎚️ 主角真名与难度设定</div>
                    <div style="display:flex;gap:6px;align-items:center;">
                        <input id="st-protag-name-inp" type="text" placeholder="输入主角名字（当前：${curProtag}）" value="${safeStr(curVars.档案?.手动锁定真名 || curVars.档案?.当前认知名字)}" style="flex:1;background:#11111b;color:#f9e2af;border:1px solid ${tc.prim};border-radius:6px;padding:6px 8px;font-size:12px;font-weight:bold;">
                        <button id="st-protag-name-confirm" type="button" style="background:#a6e3a1;color:#11111b;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:12px;font-weight:bold;">✅ 确认</button>
                        <button id="st-protag-name-reset" type="button" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.25);border-radius:6px;padding:6px 8px;cursor:pointer;font-size:11.5px;">自动</button>
                    </div>
                    <select id="st-diff-mode-sel" style="background:#11111b;color:#f9e2af;border:1px solid ${tc.sec};border-radius:6px;padding:7px 8px;font-size:12px;cursor:pointer;font-weight:bold;">
                        ${Object.entries(DIFFICULTY_PRESETS).map(([k, v]) => `<option value="${k}" ${userSettings.difficultyMode === k ? "selected" : ""}>${v.label}</option>`).join("")}
                    </select>
                    <select id="st-world-break-sel" onchange="window._stSetWorldBreak && window._stSetWorldBreak(this.value)" style="background:#11111b;color:#a6e3a1;border:1px solid #a6e3a1;border-radius:6px;padding:7px 8px;font-size:12px;cursor:pointer;font-weight:bold;">
                        <option value="auto" ${userSettings.worldBreakMode === "auto" ? "selected" : ""}>🛡️ 智能世界观锁 (无魔改/异种自动卡在Lv.4)</option>
                        <option value="realistic_lock" ${userSettings.worldBreakMode === "realistic_lock" ? "selected" : ""}>🔒 严格写实封顶 (强制最高Lv.4·79%生理极限)</option>
                        <option value="fantasy_unleashed" ${userSettings.worldBreakMode === "fantasy_unleashed" ? "selected" : ""}>😈 无限制魔改全开 (允许直接升入Lv.5~6终极畸变)</option>
                    </select>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin-top:2px;">
                        <input id="st-reverse-inject-chk" type="checkbox" ${userSettings.injectReversePrompt ? "checked" : ""} style="accent-color:${tc.prim};">
                        <span><b>🔗 启用器质崩坏反向支配正文</b></span>
                    </label>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                        <input id="st-metabolism-chk" type="checkbox" ${userSettings.autoMetabolism ? "checked" : ""} style="accent-color:${tc.prim};">
                        <span><b>🚿 启用清洗排精与睡眠代谢</b></span>
                    </label>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                        <input id="st-mental-lock-chk" type="checkbox" ${userSettings.strictMentalLock ? "checked" : ""} style="accent-color:${tc.prim};">
                        <span><b>🔒 启用恶堕度与六孔/性癖/总账严格联动锁</b></span>
                    </label>
                </div>
                <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                    <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎨 主题样式与尺寸</div>
                    <div id="st-v12-themes" style="display:grid;grid-template-columns:1fr;gap:7px;"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;"><span>宽度 (<b id="st-w-val">${userSettings.width}</b>px)：</span><input id="st-w-rng" type="range" min="330" max="900" value="${userSettings.width}" style="flex:1;accent-color:${tc.prim};"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>高度 (<b id="st-h-val">${userSettings.height}</b>px)：</span><input id="st-h-rng" type="range" min="360" max="920" value="${userSettings.height}" style="flex:1;accent-color:${tc.prim};"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>字号 (<b id="st-z-val">${userSettings.fontScale}</b>%)：</span><input id="st-z-rng" type="range" min="80" max="135" value="${userSettings.fontScale}" style="flex:1;accent-color:${tc.prim};"></div>
                </div>
                <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                    <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🔌 副 API 设置</div>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input id="st-api-chk" type="checkbox" ${userSettings.apiSyncEnabled ? "checked" : ""} style="accent-color:${tc.prim};"><span><b>每回合自动调用副 API 重绘</b></span></label>
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
                        <button id="st-v12-api-test" type="button" style="flex:1;background:${tc.hi};color:#fff;border:1px solid ${tc.sec};border-radius:8px;padding:7px;font-weight:bold;cursor:pointer;">⚡ 副API重绘本层</button>
                    </div>
                </div>`;
            body.appendChild(box);

            const zipInp = box.querySelector("#st-import-zip-inp");
            const filesInp = box.querySelector("#st-import-files-inp");
            const backupInp = box.querySelector("#st-import-backup-inp");

            box.querySelector("#st-btn-imp-zip").onclick = () => zipInp.click();
            box.querySelector("#st-btn-imp-files").onclick = () => filesInp.click();

            // 导出存档与配图 JSON 备份
            box.querySelector("#st-btn-export-backup").onclick = () => {
                try {
                    const imgObj = {};
                    importedImgCache.forEach((v, k) => { imgObj[k] = v; });
                    const payload = {
                        version: "1.1",
                        timestamp: new Date().toISOString(),
                        userSettings,
                        curVars,
                        images: imgObj
                    };
                    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `状态栏备份_${curProtag}_${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast("💾 备份文件已导出下载！", "success", 2800);
                } catch (e) {
                    showToast("❌ 导出备份失败：" + e.message, "error");
                }
            };

            // 恢复 JSON 备份
            box.querySelector("#st-btn-import-backup").onclick = () => backupInp.click();
            backupInp.onchange = async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                    const txt = await f.text();
                    const data = JSON.parse(txt);
                    if (data.userSettings) {
                        userSettings = { ...userSettings, ...data.userSettings };
                        saveSettings();
                    }
                    if (data.curVars) {
                        curVars = { ...getInitialVars(), ...data.curVars };
                        saveChatCache(curVars);
                    }
                    let imgCnt = 0;
                    if (data.images && typeof data.images === "object") {
                        imgCnt = await saveRawEntriesToImageDB(data.images);
                    }
                    latestStatus = getFallbackData();
                    applyThemeAndSize();
                    renderBody();
                    showToast(`✅ 备份恢复成功（含 ${imgCnt} 张配图）！`, "success", 3000);
                } catch (err) {
                    showToast("❌ 备份文件解析失败", "error");
                }
            };

            const handleImport = async (files) => {
                if (!files || !files.length) return;
                showToast("⏳ 正在导入配图...", "info", 3500);
                try {
                    const cnt = await importFilesOrZipToDB(files);
                    if (cnt > 0) {
                        latestStatus = getFallbackData();
                        renderBody();
                        showToast(`✅ 成功导入 ${cnt} 张配图！`, "success", 3000);
                    } else {
                        showToast("⚠️ 未找到有效图片", "warn", 3000);
                    }
                } catch (err) {
                    showToast("❌ 导入失败：" + (err.message || "格式错误"), "error", 3500);
                }
            };

            zipInp.onchange = (e) => handleImport(e.target.files);
            filesInp.onchange = (e) => handleImport(e.target.files);

            box.querySelector("#st-btn-clr-idb").onclick = async () => {
                await clearAllImportedImagesDB();
                renderBody();
                showToast("🗑️ 已清空本地图库！", "info", 2200);
            };

            const nameInp = box.querySelector("#st-protag-name-inp");
            const diffSel = box.querySelector("#st-diff-mode-sel");
            const lockChk = box.querySelector("#st-mental-lock-chk");
            const revChk = box.querySelector("#st-reverse-inject-chk");
            const metaChk = box.querySelector("#st-metabolism-chk");

            box.querySelector("#st-protag-name-confirm").onclick = () => {
                const val = nameInp.value.trim();
                if (!val) {
                    showToast("⚠️ 请先输入要设定的主角名字！", "warn", 2200);
                    return;
                }
                curVars.档案.手动锁定真名 = val;
                curVars.档案.当前认知名字 = val;
                curVars.档案.原身旧名 = "";
                saveChatCache(curVars);
                recalc(false);
                inSettings = false;
                renderBody();
                showToast(`✅ 已将主角名字锁定为【${val}】并重新生成全部状态！`, "success", 2800);
            };

            box.querySelector("#st-protag-name-reset").onclick = () => {
                nameInp.value = "";
                if (curVars.档案) {
                    curVars.档案.手动锁定真名 = "";
                    curVars.档案.当前认知名字 = "";
                }
                saveChatCache(curVars);
                recalc(false);
                renderBody();
                showToast("🔄 已恢复自动识别主角名字！", "info", 2200);
            };

            window._stSetWorldBreak = (val) => { userSettings.worldBreakMode = val; saveSettings(); recalc(false); showToast("🌍 世界观破界规则已切换！", "info", 2200); };
            diffSel.onchange = () => {
                userSettings.difficultyMode = diffSel.value;
                saveSettings();
                recalc(false);
                showToast(`🎚️ 难度已切换为：${DIFFICULTY_PRESETS[diffSel.value].label}`, "info", 2200);
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
            };
            metaChk.onchange = () => {
                userSettings.autoMetabolism = metaChk.checked;
                saveSettings();
                recalc(false);
            };

            const tBox = box.querySelector("#st-v12-themes");
            Object.keys(THEMES).forEach(tName => {
                const tCfg = THEMES[tName];
                const tb = document.createElement("button"); tb.type = "button";
                const act = userSettings.theme === tName;
                tb.style.cssText = `padding:9px 12px;border-radius:${tCfg.radius};cursor:pointer;font-weight:bold;font-size:12px;border:${act ? tCfg.border : "1px solid rgba(255,255,255,0.18)"};background:${tCfg.bg};color:${tCfg.text};display:flex;justify-content:space-between;align-items:center;box-shadow:${act ? tCfg.shadow : "none"};`;
                tb.innerHTML = `<span>${act ? "✅ " : "🎨 "}${tName}</span><span style="font-size:10.5px;color:${tCfg.prim};">${tCfg.deco || ""}</span>`;
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
                const manualName = nameInp ? nameInp.value.trim() : "";
                if (curVars.档案) {
                    curVars.档案.手动锁定真名 = manualName;
                    if (manualName) curVars.档案.当前认知名字 = manualName;
                    saveChatCache(curVars);
                }
                userSettings.difficultyMode = diffSel.value;
                userSettings.worldBreakMode = box.querySelector("#st-world-break-sel")?.value || userSettings.worldBreakMode;
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
            bbox.querySelector("#st-v12-api-test").onclick = () => {
                const manualName = nameInp ? nameInp.value.trim() : "";
                if (curVars.档案 && manualName) {
                    curVars.档案.手动锁定真名 = manualName;
                    curVars.档案.当前认知名字 = manualName;
                }
                userSettings.difficultyMode = diffSel.value;
                userSettings.worldBreakMode = box.querySelector("#st-world-break-sel")?.value || userSettings.worldBreakMode;
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

        function renderBody() {
            try {
                applyThemeAndSize();
                const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
                const hasCard = checkCardAvailable(true);
                const diff = getDifficultyProfile();
                const realId = detectRealCharacterIdentity(curVars);
                const d = (latestStatus && Array.isArray(latestStatus.categories) && latestStatus.categories.length) ? latestStatus : getFallbackData();
                const setTxt = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
                setTxt("st-v5-btn-txt", hasCard ? `👑 ${d.charName || "主角"} · 状态栏` : `👑 主角 · 状态栏`);
                setTxt("st-v5-title", hasCard ? `${d.charName} [${viewingHistoryFloor !== null ? `📜#${viewingHistoryFloor}层回溯` : diff.name}]` : `⚠️ 未选角色卡`);

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
                        <div style="font-size:15px;font-weight:bold;color:${tc.prim};">未检测到角色卡或对话</div>
                        <div style="font-size:12.5px;color:${tc.sub};line-height:1.6;">请先在 SillyTavern 中选择一张角色卡开启对话。</div>`;
                    body.appendChild(emptyBox);
                    return;
                }

                // 若当前处于历史楼层回溯模式，顶部显示一键切回实时横幅
                if (viewingHistoryFloor !== null) {
                    const histBar = document.createElement("div");
                    histBar.style.cssText = "margin-bottom:8px;padding:6px 10px;background:linear-gradient(90deg,#f59e0b,#e11d48);color:#fff;border-radius:9px;display:flex;justify-content:space-between;align-items:center;font-size:11.5px;font-weight:bold;cursor:pointer;";
                    histBar.innerHTML = `<span>📜 正在查看第 #${viewingHistoryFloor} 层历史状态快照</span><span style="background:rgba(0,0,0,0.4);padding:2px 8px;border-radius:6px;">↩ 切回最新层</span>`;
                    histBar.onclick = () => { viewingHistoryFloor = null; recalc(false, null); showToast("🔄 已切回最新实时状态！", "info", 1800); };
                    body.appendChild(histBar);
                }

                if (activeCat === null || !d.categories[activeCat]) {
                    const vagCnt = safeNum(curVars.计数?.性交?.小穴);
                    const creampieCnt = safeNum(curVars.计数?.射精?.内射);
                    const corrVal = safeNum(curVars.核心数值?.淫乱恶堕);
                    const pleasVal = safeNum(curVars.精神与心理?.快感累积);
                    const sp = curVars.体内精液存量 || {};
                    const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
                    const dev = computeAllOrganDevelopments(curVars);
                    const cyc = (vagCnt === 0 && totalMl === 0 && corrVal < 15) ? "正常生理期" : safeStr(curVars.受孕与生理?.生理周期阶段, "危险排卵期");

                    const badgeBanner = document.createElement("div");
                    badgeBanner.style.cssText = `margin-bottom:10px;padding:9px 11px;background:linear-gradient(135deg,rgba(0,0,0,0.65),rgba(42,27,61,0.55));border:${tc.cardBorder};border-radius:12px;display:flex;flex-direction:column;gap:7px;font-size:11.5px;box-shadow:inset 0 0 12px rgba(243,139,168,0.14);`;

                    const miniOrgans = [
                        { name: "👄口", val: dev.mouthObj.val, th: "mouth" },
                        { name: "🍒乳", val: dev.chestObj.val, th: "chest" },
                        { name: "🌺穴", val: dev.vagObj.val, th: "vag" },
                        { name: "🫀宫", val: dev.wombObj.val, th: "womb" },
                        { name: "💧蒂", val: dev.clitObj.val, th: "clit" },
                        { name: "🕳️菊", val: dev.analObj.val, th: "anal" }
                    ];
                    const radarHTML = miniOrgans.map(o => {
                        const st = getThemedBarStyle(o.val, o.th);
                        return `<div style="display:flex;flex-direction:column;gap:2px;background:rgba(0,0,0,0.4);padding:4px 6px;border-radius:7px;border:1px solid rgba(255,255,255,0.08);">
                            <div style="display:flex;justify-content:space-between;font-size:10px;">
                                <span>${o.name}</span><b style="color:${st.labelColor};">Lv.${st.tier + 1}(${o.val}%)</b>
                            </div>
                            <div style="width:100%;height:4.5px;background:#000;border-radius:99px;overflow:hidden;">
                                <div style="width:${o.val}%;height:100%;background:${st.grad};"></div>
                            </div>
                        </div>`;
                    }).join("");

                    badgeBanner.innerHTML = `
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                            <span style="color:#f9e2af;font-weight:bold;">🎭 ${d.charName} (${realId})</span>
                            <span style="color:${tc.prim};">🥚 ${cyc} ｜ 储精:${totalMl}ml</span>
                            <span style="color:${tc.sec};"><span class="st-heart-beat">💓</span> 恶堕:<b>${corrVal}%</b> ｜ 快感:<b>${pleasVal}%</b></span>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;padding-top:4px;border-top:1px dashed rgba(255,255,255,0.1);">${radarHTML}</div>`;
                    body.appendChild(badgeBanner);

                    const vList = document.createElement("div");
                    vList.style.cssText = "display:flex;flex-direction:column;gap:8px;";
                    d.categories.forEach((cat, idx) => {
                        const b = document.createElement("div");
                        b.className = "st-v28-card";
                        b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-left:4.5px solid ${tc.prim};border-radius:12px;padding:10px 13px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:4px;box-shadow:0 4px 14px rgba(0,0,0,0.45);`;
                        b.innerHTML = `
                            <div style="display:flex;justify-content:space-between;align-items:center;padding-right:14px;">
                                <span style="font-size:13.5px;font-weight:bold;color:${tc.prim};">${cat.icon} ${cat.title}</span>
                                <span style="font-size:10.5px;background:${tc.hi};color:${tc.text};padding:2px 8px;border-radius:99px;font-weight:bold;">${cat.items.length} 项 ▸</span>
                            </div>
                            <div style="font-size:11px;color:${tc.sub};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cat.summary || ""}</div>`;
                        b.onclick = (e) => { e.stopPropagation(); activeCat = idx; renderBody(); };
                        vList.appendChild(b);
                    });
                    body.appendChild(vList);
                } else {
                    const cat = d.categories[activeCat], list = document.createElement("div");
                    list.style.cssText = "display:flex;flex-direction:column;gap:9px;";
                    cat.items.forEach((it, idx) => {
                        const b = document.createElement("div");
                        let pctForBadge = (it.pct !== null && it.pct !== undefined) ? it.pct : 0;
                        const isRev = (it.editKey === "shame" || it.editKey === "sta" || it.editKey === "当前姿势");
                        const lvNum = it.hasStageBar ? (tier6(pctForBadge, isRev) + 1) : 1;

                        const corruptCls = it.hasStageBar ? (lvNum === 6 ? " st-corrupted-card-lv6" : (lvNum === 5 ? " st-corrupted-card-lv5" : "")) : "";
                        b.className = "st-v28-card" + corruptCls;

                        b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-radius:12px;padding:9px 10px;cursor:pointer;user-select:none;display:flex;gap:8px;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,0.45);overflow:hidden;`;
                        const parts = safeStr(it.desc).split("💭");
                        const objPreview = safeStr(parts[0]).replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 42) + "…";
                        const thoughtPreview = parts[1] ? "💭 " + safeStr(parts[1]).replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 44) + "…" : "";

                        const cardKeyHTML = it.keyHTML.replace(
                            '<span class="st-inline-refresh-slot"></span>',
                            `<button class="st-quick-refresh-item" type="button" title="单独刷新此按钮数据" style="background:rgba(249,226,175,0.15);color:#f9e2af;border:1px solid rgba(249,226,175,0.45);border-radius:6px;padding:1px 5px;font-size:10.5px;cursor:pointer;line-height:1.2;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;">🔄</button>`
                        );
                        b.innerHTML = `
                            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;overflow:hidden;padding-right:10px;">
                                ${cardKeyHTML}${it.barHTML || ""}
                                <div style="font-size:11px;color:${tc.sub};margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${objPreview}</div>
                                ${thoughtPreview ? `<div style="font-size:11px;color:#ffd6e7;font-style:italic;background:rgba(243,139,168,0.12);padding:3px 7px;border-radius:6px;border-left:2.5px solid #f38ba8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${thoughtPreview}</div>` : ""}
                            </div>
                            <div class="st-card-thumb-wrap" title="点击全屏看大图" style="display:none;position:relative;width:70px;height:70px;border-radius:10px;overflow:hidden;border:1.5px solid ${lvNum === 6 ? "#fde047" : tc.prim};flex-shrink:0;background:#0d0914;box-shadow:0 3px 10px rgba(0,0,0,0.65);">
                                <img class="st-card-thumb-img" style="width:100%;height:100%;object-fit:cover;display:block;">
                                ${it.hasStageBar ? `<span style="position:absolute;bottom:0;right:0;background:${lvNum === 6 ? "linear-gradient(90deg,#f59e0b,#ff0055)" : "rgba(0,0,0,0.75)"};color:#fff;font-size:9.5px;font-weight:900;padding:1px 5px;border-top-left-radius:6px;">Lv.${lvNum}</span>` : ""}
                            </div>`;
                        b.onclick = (e) => { e.stopPropagation(); showDetailPopup(idx); };

                        const qRefBtn = b.querySelector(".st-quick-refresh-item");
                        if (qRefBtn) {
                            qRefBtn.onclick = async (ev) => {
                                ev.stopPropagation();
                                const res = await requestSingleItemAiGen(it.cleanTitle || it.rawKey, "结合最新正文剧情，同步更新该项的最新状态标签、崩坏度数值(0-100)与第一人称心声", qRefBtn);
                                if (res && it.editKey) {
                                    if (res.ratio) {
                                        const numMatch = String(res.ratio).match(/(\d+)/);
                                        if (numMatch) {
                                            const nVal = Math.max(0, Math.min(100, Number(numMatch[1])));
                                            curVars.上帝强制锁定 = curVars.上帝强制锁定 || {};
                                            curVars.上帝强制锁定[it.editKey] = nVal;
                                        }
                                    }
                                    if (it.isCustom && it.catTitle) {
                                        const found = (curVars.自定义条目?.[it.catTitle] || []).find(x => x.id === it.editKey);
                                        if (found) {
                                            if (res.stage) found.stage = res.stage;
                                            if (res.ratio) found.ratio = res.ratio;
                                            if (res.desc) found.desc = res.desc;
                                            if (res.thought) found.thought = cleanThoughtText(res.thought);
                                        }
                                    } else {
                                        if (it.editKey.startsWith("fetish_")) {
                                            const fName = it.editKey.replace(/^fetish_/, "");
                                            curVars.性癖详情 = curVars.性癖详情 || {};
                                            curVars.性癖详情[fName] = {
                                                ...(curVars.性癖详情[fName] || {}),
                                                desc: res.desc || "",
                                                thought: cleanThoughtText(res.thought || "")
                                            };
                                        }
                                        curVars.按钮详情 = curVars.按钮详情 || {};
                                        curVars.按钮详情[it.editKey] = {
                                            ...(curVars.按钮详情[it.editKey] || {}),
                                            stage: res.stage || curVars.按钮详情[it.editKey]?.stage || "",
                                            desc: res.desc || "",
                                            thought: cleanThoughtText(res.thought || "")
                                        };
                                    }
                                    saveChatCache(curVars);
                                    latestStatus = getFallbackData();
                                    renderBody();
                                }
                            };
                        }
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
                    addBtn.innerHTML = `➕ 新增【${cat.title}】项目`;
                    addBtn.onclick = (e) => {
                        e.stopPropagation();
                        openAddCustomItemModal(cat.title);
                    };
                    list.appendChild(addBtn);

                    body.appendChild(list);
                }
            } catch (renderErr) {
                showDiagnosticError("渲染异常", renderErr);
            }
        }

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
                    <b style="color:#f5c2e7;font-size:13.5px;">📊 状态栏1.1</b>
                    <span id="st-v10-ext-arrow" style="color:#f38ba8;font-weight:bold;">▼ 展开</span>
                </div>
                <div id="st-v10-ext-content" style="display:none;padding:12px;font-size:13px;border-top:1px solid rgba(255,255,255,0.1);">
                    <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;">
                        <input id="st-v10-ext-enable" type="checkbox" ${userSettings.enabled ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                        <span><b>启用「👑 主角 · 状态栏」</b></span>
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;cursor:pointer;">
                        <input id="st-v10-ext-hide" type="checkbox" ${userSettings.hideRawBlock ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                        <span>隐藏正文尾部的原始状态栏与变量代码</span>
                    </label>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button id="st-v10-ext-open" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">👑 呼出状态栏</button>
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
                arrow.textContent = isHidden ? "▲ 收起" : "▼ 展开";
            });

            drawer.querySelector("#st-v10-ext-enable").addEventListener("change", (e) => {
                userSettings.enabled = e.target.checked;
                saveSettings();
                if (userSettings.enabled) {
                    if (!document.getElementById("st-v5-root")) mountUI();
                    recalc(false);
                    applyThemeAndSize();
                    showToast("✅ 状态栏1.1 已开启！", "success", 2000);
                } else {
                    if (typeof setExtensionPrompt === "function") {
                        setExtensionPrompt(EXT_ID, "", extension_prompt_types?.IN_CHAT ?? 1, 2);
                    }
                    document.getElementById("st-v25-fullscreen-lightbox")?.remove();
                    document.getElementById("st-v5-root")?.remove();
                    showToast("🔴 状态栏1.1 已关闭！", "warn", 2000);
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
                showToast("👑 状态栏已呼出！", "success", 2000);
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
                        <button id="st-v5-clear-btn" type="button" title="重置当前角色卡缓存并按总账重新校准" style="background:rgba(239,68,68,0.22);color:#fca5a5;border:1px solid rgba(239,68,68,0.55);border-radius:7px;padding:3px 6px;cursor:pointer;font-size:10.5px;font-weight:bold;">🧹重置</button>
                        <button id="st-v5-cfg-btn" type="button" title="打开设置" style="background:rgba(255,255,255,0.14);color:#fff;border:1px solid rgba(255,255,255,0.28);border-radius:7px;padding:3px 6px;cursor:pointer;font-size:10.5px;font-weight:bold;">⚙️设置</button>
                        <button id="st-v5-exit-btn" type="button" title="关闭状态栏插件" style="background:rgba(220,38,38,0.85);color:#fff;border:1px solid #fca5a5;border-radius:7px;padding:3px 6px;cursor:pointer;font-size:10.5px;font-weight:bold;">🔴退出</button>
                        <span id="st-v5-close" title="收起面板" style="cursor:pointer;color:#f38ba8;font-size:15px;font-weight:bold;padding:0 3px;">✕</span>
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
                                <button id="st-v6-copy-imgtag" type="button" title="复制此阶段微距 <image> 绘图块" style="background:rgba(166,227,161,0.22);border:1px solid #a6e3a1;color:#a6e3a1;border-radius:8px;padding:4px 8px;font-size:11px;cursor:pointer;font-weight:bold;">🎨 绘图块</button>
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
                    const keepLockedName = curVars.档案?.手动锁定真名 || "";
                    viewingHistoryFloor = null;
                    try {
                        localStorage.removeItem(getChatStoreKey());
                        localStorage.removeItem(`${EXT_ID}_v28_cache_${safeCtx()?.chatId || "default_chat"}`);
                        localStorage.removeItem(`${EXT_ID}_v27_cache_${safeCtx()?.chatId || "default_chat"}`);
                    } catch (err) {}
                    curVars = getInitialVars();
                    if (keepLockedName) {
                        curVars.档案.手动锁定真名 = keepLockedName;
                        curVars.档案.当前认知名字 = keepLockedName;
                        saveChatCache(curVars);
                    }
                    recalc(false);
                    inSettings = false;
                    renderBody();
                    showToast("🧹 已重置缓存并重新校准全部状态！", "success", 2500);
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
                        setExtensionPrompt(EXT_ID, "", extension_prompt_types?.IN_CHAT ?? 1, 2);
                    }
                    document.getElementById("st-v25-fullscreen-lightbox")?.remove();
                    document.getElementById("st-v5-root")?.remove();
                    showToast("🔴 状态栏1.1 已关闭！", "warn", 3000);
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

        // =========================================================================
        // 🔧 修复Bug3：安全兼容 _.set 与 _.add，支持跨行与带括号字符串
        // =========================================================================
        function applySetStatements(text, targetVars) {
            if (!text || (!text.includes("_.set") && !text.includes("_.add") && !text.includes("_.assign"))) return false;
            const cleanBlock = safeStr(text).replace(/^\s*\/\/[^\n]*/gm, "");
            const regex = /_\.(set|add|assign)\(\s*(?:(['"`])([^'"`]+)\2|([^,]+?))\s*,\s*([\s\S]*?)\)\s*;?(?=\s*(?:_\.(?:set|add|assign)|<\/UpdateVariable>|<\/game>|$))/g;
            let m, appliedAny = false;
            while ((m = regex.exec(cleanBlock)) !== null) {
                const op = m[1];
                const rawPath = safeStr(m[3] || m[4]).trim(), rawVal = safeStr(m[5]).trim();
                if (!rawPath) continue;
                try {
                    let val;
                    if (/^-?\d+(?:\.\d+)?$/.test(rawVal)) val = Number(rawVal);
                    else if (rawVal === "true" || rawVal === "false") val = rawVal === "true";
                    else if ((rawVal.startsWith("'") && rawVal.endsWith("'")) || (rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("`") && rawVal.endsWith("`"))) {
                        val = rawVal.slice(1, -1);
                    } else {
                        try {
                            val = JSON.parse(rawVal);
                        } catch (je) {
                            val = rawVal.replace(/^['"`]|['"`]$/g, "");
                        }
                    }
                    const ps = rawPath.split(".").map(s => s.trim()).filter(Boolean);
                    if (ps.length > 1 && !Object.prototype.hasOwnProperty.call(targetVars, ps[0])) {
                        const prefixName = ps[0];
                        const ctxName1 = safeCtx()?.name1 || "";
                        if (!targetVars.档案.手动锁定真名 && prefixName && prefixName !== ctxName1 && prefixName.length <= 12) {
                            targetVars.档案.当前认知名字 = prefixName;
                        }
                        ps.shift();
                    }

                    let cur = targetVars;
                    for (let j = 0; j < ps.length - 1; j++) {
                        if (cur[ps[j]] === undefined || typeof cur[ps[j]] !== "object") cur[ps[j]] = {};
                        cur = cur[ps[j]];
                    }
                    if (cur && ps.length > 0) {
                        const lastKey = ps[ps.length - 1];
                        if (op === "add" && typeof val === "number") {
                            cur[lastKey] = safeNum(cur[lastKey], 0) + val;
                        } else {
                            cur[lastKey] = val;
                        }
                        appliedAny = true;
                    }
                } catch (e) {}
            }
            return appliedAny;
        }

        function parseInlineStatusBarText(text, targetVars) {
            if (!text) return;

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

            const wombMlMatch = text.match(/(?:宫腔|宫内|射入的约?)\s*(\d+)\s*(?:毫升|ml)/i);
            if (wombMlMatch) targetVars.体内精液存量.子宫毫升 = Number(wombMlMatch[1]);

            const vagMlMatch = text.match(/阴道\s*(\d+)\s*(?:毫升|ml)/i);
            if (vagMlMatch) targetVars.体内精液存量.小穴毫升 = Number(vagMlMatch[1]);

            if (/无数年.{0,8}(?:性交|做爱|淫乱|接客|欢好|房事|经验)|(?:性交|做爱|房事|欢好)经验.{0,6}(?:无数|极其丰富|老手|熟稔)|(?:情场|房事)身经百战|千人斩|万人骑/.test(text)) {
                const m = getDifficultyProfile().mult;
                targetVars.计数.性交.小穴 = Math.max(safeNum(targetVars.计数.性交.小穴), Math.round(120 * m));
                targetVars.计数.射精.内射 = Math.max(safeNum(targetVars.计数.射精.内射), Math.round(80 * m));
                targetVars.计数.性交.口 = Math.max(safeNum(targetVars.计数.性交.口), Math.round(60 * m));
                targetVars.计数.高潮.总数 = Math.max(safeNum(targetVars.计数.高潮.总数), Math.round(150 * m));
                targetVars.核心数值.淫乱恶堕 = Math.max(safeNum(targetVars.核心数值.淫乱恶堕), 75);
                targetVars.核心数值.对肉棒好感度 = Math.max(safeNum(targetVars.核心数值.对肉棒好感度), 75);
                targetVars.精神与心理.羞耻度 = Math.min(safeNum(targetVars.精神与心理.羞耻度, 100), 25);
                targetVars.精神与心理.服从度 = Math.max(safeNum(targetVars.精神与心理.服从度), 70);
            }
        }

        function cleanDOM(id, force = false) {
            if (!userSettings.hideRawBlock) return;
            const el = document.querySelector(`.mes[mesid="${id}"] .mes_text`);
            if (!el) return;
            const rawMes = safeStr(safeCtx()?.chat?.[Number(id)]?.mes);
            const sig = `${rawMes.length}_${el.innerHTML.length}_${el.innerHTML.includes("st-ext-inline-trigger")}`;
            if (!force && el.getAttribute("data-st-cleaned") === sig) return;

            let h = el.innerHTML, changed = false;
            const lt = "&" + "lt;", gt = "&" + "gt;";
            const gameReg = new RegExp(`${lt}\\/?game${gt}|<\\/?game>`, "gi");
            const uvReg = new RegExp(`(?:${lt}|<)UpdateVariable(?:${gt}|>)[\\s\\S]*?(?:${lt}|<)\\/UpdateVariable(?:${gt}|>)`, "gi");
            const uvUnclosedReg = new RegExp(`(?:${lt}|<)UpdateVariable(?:${gt}|>)[\\s\\S]*$`, "gi");
            const bareSetReg = /_\.(?:set|add|assign)\s*\([\s\S]*?\)\s*;?\s*(?:<br\s*\/?>|<\/p>)?/gi;

            if (gameReg.test(h)) { h = h.replace(gameReg, ""); changed = true; }
            if (/UpdateVariable|_\.(?:set|add|assign)\s*\(/i.test(h)) {
                const beforeH = h;
                h = h.replace(uvReg, m => m.includes("st-hidden-uv") ? m : `<div class="st-hidden-uv" style="display:none!important">${m}</div>`)
                     .replace(uvUnclosedReg, m => m.includes("st-hidden-uv") ? m : `<div class="st-hidden-uv" style="display:none!important">${m}</div>`)
                     .replace(bareSetReg, m => m.includes("st-hidden-uv") ? m : `<span class="st-hidden-uv" style="display:none!important">${m}</span>`);
                if (h !== beforeH) changed = true;
            }
            if ((h.includes("【状态栏") || h.includes("[[角色档案]]") || h.includes("[[档案与肉体]]") || rawMes.includes("【状态栏") || rawMes.includes("UpdateVariable")) && !h.includes("st-ext-inline-trigger")) {
                h = h.replace(/<details[^>]*>\s*<summary>[^<]*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】/gi, m => `<div style="display:none!important">${m}</div>`)
                     .replace(/(?:<p>\s*)?【\s*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】(?:\s*<\/p>)?/gi, m => `<div style="display:none!important">${m}</div>`);
                h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 打开此层 (#${id}) 状态栏</div>`;
                changed = true;
            }
            isCleaningDOM = true;
            if (changed) el.innerHTML = h;
            el.setAttribute("data-st-cleaned", `${rawMes.length}_${el.innerHTML.length}_${el.innerHTML.includes("st-ext-inline-trigger")}`);
            isCleaningDOM = false;
        }

        function cleanAll(force = false) {
            if (isCleaningDOM) return;
            isCleaningDOM = true;
            try {
                const nodes = document.querySelectorAll(".mes");
                const start = force ? 0 : Math.max(0, nodes.length - 15);
                for (let idx = start; idx < nodes.length; idx++) {
                    const i = nodes[idx].getAttribute("mesid");
                    if (i !== null) cleanDOM(i, force);
                }
            } finally { isCleaningDOM = false; }
        }

        function scheduleCleanAll() {
            if (isCleaningDOM) return;
            if (cleanTimer) clearTimeout(cleanTimer);
            cleanTimer = setTimeout(() => cleanAll(false), 120);
        }

        // =========================================================================
        // 🔄 修复Bug2：支持 targetFloor 指定楼层历史回溯重算
        // =========================================================================
        function recalc(notifyCardSwitch = false, targetFloor = null) {
            try {
                mountExtensionSettingsMenu();
                if (!userSettings.enabled) return;

                viewingHistoryFloor = (targetFloor !== null && targetFloor !== undefined && !Number.isNaN(Number(targetFloor))) ? Number(targetFloor) : null;

                const ctx = safeCtx(), fv = getInitialVars();
                const curCardKey = `${ctx?.characterId ?? "none"}_${ctx?.chatId ?? "none"}`;

                if (!checkCardAvailable(true)) {
                    curVars = fv;
                    latestStatus = getFallbackData();
                    renderBody();
                    if (notifyCardSwitch && curCardKey !== lastKnownCardKey) {
                        lastKnownCardKey = curCardKey;
                    }
                    return;
                }

                const cached = loadChatCache();
                if (cached && cached.手动锁定真名) {
                    fv.档案.手动锁定真名 = cached.手动锁定真名;
                    fv.档案.当前认知名字 = cached.手动锁定真名;
                }
                if (viewingHistoryFloor === null && cached && cached.历史最高崩坏度 && !(typeof cached.floorLen === "number" && cached.floorLen > (ctx?.chat?.length || 0))) {
                    fv.历史最高崩坏度 = { ...cached.历史最高崩坏度 };
                }

                const charDescText = safeStr(ctx?.characters?.[ctx?.characterId]?.description) + "\n" +
                                     safeStr(ctx?.characters?.[ctx?.characterId]?.first_mes) + "\n" +
                                     safeStr(ctx?.power_user?.persona_description);
                if (charDescText.trim()) {
                    parseInlineStatusBarText(charDescText, fv);
                }

                const chat = ctx?.chat || [];
                const maxLen = viewingHistoryFloor !== null ? Math.min(chat.length, viewingHistoryFloor + 1) : chat.length;
                for (let i = 0; i < maxLen; i++) {
                    const t = safeStr(chat[i]?.mes);
                    parseInlineStatusBarText(t, fv);
                    const hasSet = applySetStatements(t, fv);
                    applyNaturalMetabolism(t, fv, hasSet);
                }

                if (viewingHistoryFloor === null && cached) {
                    mergeUserCustomizations(fv, cached, chat.length);
                }

                calibrateMentalMetrics(fv);

                curVars = fv;
                const protagName = detectProtagonistName(fv);
                const realId = detectRealCharacterIdentity(fv);
                latestStatus = getFallbackData();
                if (chat.length > 0) latestStatus.floorId = viewingHistoryFloor !== null ? viewingHistoryFloor : (chat.length - 1);

                if (notifyCardSwitch && curCardKey !== lastKnownCardKey) {
                    lastKnownCardKey = curCardKey;
                    showToast(`🔄 已切换：【${protagName} (${realId})】`, "info", 3000);
                } else if (!lastKnownCardKey) {
                    lastKnownCardKey = curCardKey;
                }

                if (viewingHistoryFloor === null && typeof setExtensionPrompt === "function") {
                    setExtensionPrompt(EXT_ID, userSettings.enabled ? buildFullSystemPrompt(protagName, fv) : "", extension_prompt_types?.IN_CHAT ?? 1, 2);
                }
                saveChatCache(curVars);
                renderBody();
            } catch (e) {
                showDiagnosticError("重算异常 (recalc)", e);
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
                const fl = trg.getAttribute("data-floor");
                const chatLen = safeCtx()?.chat?.length || 0;
                const targetFl = (fl !== null && Number(fl) < chatLen - 1) ? Number(fl) : null;
                recalc(false, targetFl);
                activeCat = null; inSettings = false; renderBody();
                const p = document.getElementById("st-v5-panel");
                if (p) p.style.display = "flex";
                if (targetFl !== null) showToast(`📜 已回溯至第 #${targetFl} 层状态快照！`, "info", 2400);
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
                    activeCat = null; latestStatus = null; viewingHistoryFloor = null;
                    setTimeout(() => { recalc(true); cleanAll(false); }, 220);
                });
                eventSource.on(event_types.MESSAGE_RECEIVED, i => setTimeout(() => {
                    if (!userSettings.enabled) return;
                    viewingHistoryFloor = null;
                    recalc(false); cleanDOM(i, true);
                    if (userSettings.apiSyncEnabled) triggerSubApiUpdate();
                    else showToast(`📊 【${detectProtagonistName(curVars)}】状态栏已同步！`, "info", 2200);
                }, 180));
                eventSource.on(event_types.MESSAGE_UPDATED, i => setTimeout(() => { if (userSettings.enabled) recalc(false); cleanDOM(i, true); }, 120));
                eventSource.on(event_types.MESSAGE_DELETED, () => setTimeout(() => { if (userSettings.enabled) recalc(false); scheduleCleanAll(); }, 150));
                eventSource.on(event_types.GENERATION_STARTED, () => { if (userSettings.enabled) { viewingHistoryFloor = null; recalc(false); } });
                if (event_types.GENERATION_ENDED) {
                    eventSource.on(event_types.GENERATION_ENDED, () => setTimeout(() => { cleanAll(true); }, 100));
                }
            }

            const chatEl = document.getElementById("chat");
            if (chatEl) {
                const obs = new MutationObserver(() => { if (!isCleaningDOM) scheduleCleanAll(); });
                obs.observe(chatEl, { childList: true, subtree: true });
            }
            setTimeout(() => { recalc(true); cleanAll(false); }, 300);
        })();

        window.ST_V10_COMPLETE_FLAG = true;

    } catch (bootErr) {
        showDiagnosticError("启动初始化异常", bootErr);
    }
})();


