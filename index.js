// == 状态栏 2.0 ==
(function () {
    "use strict";
    const DIAG_ID = "st-v20-diag-radar";
    window.ST_V20_COMPLETE_FLAG = false;

    function showDiagnosticError(title, errObj, extraHint = "") {
        console.error(`[状态栏2.0] ${title}:`, errObj);
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
        const locInfo = lineMatch ? `第 ${lineMatch[1]} 行，第 ${lineMatch[2]} 列` : "请检查 Part1 与 Part2 是否完整拼接";

        box.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,77,109,0.5);padding:0 0 6px 0;margin-bottom:8px;">
                <b style="color:#ffccd5;font-size:14px;">🚨 状态栏2.0 异常提示</b>
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
        // 📦 IndexedDB 本地图片库（自动压缩至 640px WebP 防手机爆内存）
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
            if (String(rawKey).startsWith("data:") || String(rawKey).startsWith("http") || String(rawKey).startsWith("blob:")) return rawKey;
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

        async function saveDataUrlToDB(customKey, dUrl) {
            if (!dUrl) return null;
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

        async function saveSingleImageToDB(customKey, fileObj) {
            const dUrl = await blobToDataUrl(fileObj, fileObj.name || "img.webp");
            if (!dUrl) throw new Error("图片转码失败");
            return saveDataUrlToDB(customKey, dUrl);
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
                            if (typeof v === "string" && (v.startsWith("data:") || v.startsWith("http"))) {
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
                if (/\.gif$/i.test(fileName) || blob.type === "image/gif" || blob.size < 260 * 1024) {
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
                        const maxDim = 640;
                        let w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
                        if (w > maxDim || h > maxDim) {
                            if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
                            else { w = Math.round(w * (maxDim / h)); h = maxDim; }
                        }
                        const cvs = document.createElement("canvas");
                        cvs.width = w; cvs.height = h;
                        cvs.getContext("2d").drawImage(img, 0, 0, w, h);
                        resolve(cvs.toDataURL("image/webp", 0.82));
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
        // 🔊 原生 WebAudio 合成音效引擎
        // =========================================================================
        let audioCtx = null;
        function playSynthSound(type = "squelch") {
            if (!userSettings.soundEnabled) return;
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === "suspended") audioCtx.resume();
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                if (type === "squelch") {
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(190, now);
                    osc.frequency.exponentialRampToValueAtTime(520, now + 0.09);
                    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
                    osc.start(now); osc.stop(now + 0.2);
                } else if (type === "climax") {
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(280, now);
                    osc.frequency.exponentialRampToValueAtTime(680, now + 0.22);
                    osc.frequency.exponentialRampToValueAtTime(220, now + 0.45);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
                    osc.start(now); osc.stop(now + 0.47);
                }
            } catch (e) {}
        }

        // =========================================================================
        // 🏷️ 黄油级即时异常状态 Buff/Debuff 贴条引擎 + 变化飘字提示
        // =========================================================================
        function computeActiveBuffs(v, dev = null) {
            if (!dev) dev = computeAllOrganDevelopments(v);
            const buffs = [];
            const sp = v.体内精液存量 || {};
            const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
            const sta = safeNum(v.身体?.体力, 100);
            const pleas = safeNum(v.精神与心理?.快感累积);
            const lust = safeNum(v.核心数值?.性欲程度);
            const drug = safeNum(v.精神与心理?.媚药精液毒瘾);
            const propStr = safeStr(v.体内道具与权限?.体内道具, "无");
            const mark = v.痕迹与标记 || {};
            const pushBuff = (icon, name, color, bg, desc = "") => buffs.push({ icon, name, color, bg, border: color + "66", desc: desc || name, txt: `${icon} ${name}`, col: color });

            if (totalMl > 0) pushBuff("🥛", `体内蓄精 ${totalMl}ml`, "#f8fafc", "rgba(255,255,255,0.18)");
            if (safeNum(sp.子宫毫升) >= 35) pushBuff("🤰", "小腹微隆坠胀", "#fbcfe8", "rgba(236,72,153,0.28)");
            if (pleas >= 80) pushBuff("⚡", "濒临绝顶痉挛", "#fde047", "rgba(234,179,8,0.28)");
            if (lust >= 70) pushBuff("🔥", "重度发情潮红", "#fda4af", "rgba(225,29,72,0.32)");
            if (sta <= 25) pushBuff("🫠", "脱力瘫软", "#fca5a5", "rgba(185,28,28,0.32)");
            if (dev.chestObj.val >= 60) pushBuff("🍼", "胀奶渗乳中", "#fef3c7", "rgba(217,119,6,0.26)");
            if (dev.clitObj.val >= 60) pushBuff("💧", "尿道失禁警戒", "#fef08a", "rgba(202,138,4,0.26)");
            if (drug >= 40) pushBuff("☣️", "精液毒瘾发作", "#bef264", "rgba(101,163,13,0.26)");
            if (propStr && propStr !== "无") pushBuff("🎛️", `道具:${propStr.slice(0, 8)}`, "#c4b5fd", "rgba(124,58,237,0.28)");
            if (mark.淫纹与刻印 && mark.淫纹与刻印 !== "无") pushBuff("🔮", "淫纹激活", "#e879f9", "rgba(162,28,175,0.28)");
            if (!buffs.length) pushBuff("✨", "身心状态清爽", "#a6e3a1", "rgba(34,197,94,0.2)");
            return buffs;
        }

        let prevSnapshotForDelta = null;
        function computeAndShowDeltaToast(v, dev) {
            const cur = {
                corr: safeNum(v.核心数值?.淫乱恶堕),
                lust: safeNum(v.核心数值?.性欲程度),
                shame: safeNum(v.精神与心理?.羞耻度, 100),
                sta: safeNum(v.身体?.体力, 100),
                ml: safeNum(v.体内精液存量?.口内毫升) + safeNum(v.体内精液存量?.小穴毫升) + safeNum(v.体内精液存量?.子宫毫升) + safeNum(v.体内精液存量?.屁眼毫升),
                org: safeNum(v.计数?.高潮?.总数)
            };
            if (!prevSnapshotForDelta) {
                prevSnapshotForDelta = cur;
                return;
            }
            const diffs = [];
            if (cur.corr !== prevSnapshotForDelta.corr) diffs.push(`🖤恶堕 ${cur.corr > prevSnapshotForDelta.corr ? "+" : ""}${cur.corr - prevSnapshotForDelta.corr}`);
            if (cur.lust !== prevSnapshotForDelta.lust) diffs.push(`🔥性欲 ${cur.lust > prevSnapshotForDelta.lust ? "+" : ""}${cur.lust - prevSnapshotForDelta.lust}`);
            if (cur.shame !== prevSnapshotForDelta.shame) diffs.push(`😳羞耻 ${cur.shame > prevSnapshotForDelta.shame ? "+" : ""}${cur.shame - prevSnapshotForDelta.shame}`);
            if (cur.sta !== prevSnapshotForDelta.sta) diffs.push(`⚡体力 ${cur.sta > prevSnapshotForDelta.sta ? "+" : ""}${cur.sta - prevSnapshotForDelta.sta}`);
            if (cur.ml !== prevSnapshotForDelta.ml) diffs.push(`💦蓄精 ${cur.ml > prevSnapshotForDelta.ml ? "+" : ""}${cur.ml - prevSnapshotForDelta.ml}ml`);
            if (cur.org > prevSnapshotForDelta.org) diffs.push(`💗高潮 +${cur.org - prevSnapshotForDelta.org}`);
            prevSnapshotForDelta = cur;
            if (diffs.length) {
                showToast(diffs.slice(0, 4).join("  |  "), "info", 3200);
            }
        }

        // =========================================================================
        // 🎨 智绘姬双通道桥接器：自动捕获楼层图 + 一键呼叫智绘姬生图并回填
        // =========================================================================
        let pendingZhjTarget = null; // { editKey, stageKey, title, ts }
        const capturedZhjSrcSet = new Set();

        function sendPromptToZhiHuiJi(item, curStageIdx, u) {
            const blockTxt = buildDanbooruImageBlock(item, curStageIdx, u);
            const stageKey = `${item.editKey || "custom"}_${curStageIdx}`;
            pendingZhjTarget = { editKey: item.editKey, stageKey, title: item.cleanTitle || item.editKey, isCustom: item.isCustom, catTitle: item.catTitle, ts: Date.now() };

            const mode = userSettings.zhjSendMode || "auto_send";
            const ta = document.getElementById("send_textarea");
            if (mode === "fill_input" && ta) {
                ta.value = (ta.value ? ta.value + "\n" : "") + blockTxt;
                ta.dispatchEvent(new Event("input", { bubbles: true }));
                showToast(`🎨 已把【${item.cleanTitle}】绘图指令填入输入框，发送即可让智绘姬出图并自动回填！`, "info", 3400);
                return;
            }

            // 自动尝试通过酒馆输入框/指令发送给智绘姬或触发渲染
            if (ta) {
                const sendBtn = document.getElementById("send_but");
                // 先看智绘姬是否暴露了全局生成函数
                if (typeof window.zhihuijiGenerate === "function") {
                    window.zhihuijiGenerate(blockTxt);
                    showToast(`🎨 已直连智绘姬开始绘制【${item.cleanTitle}】！`, "info", 3000);
                    return;
                }
                ta.value = `请仅原样输出以下绘图块供智绘姬生图，不要多余废话：\n${blockTxt}`;
                ta.dispatchEvent(new Event("input", { bubbles: true }));
                if (sendBtn && !sendBtn.classList.contains("disabled")) {
                    sendBtn.click();
                    showToast(`🎨 已向酒馆发送智绘姬绘图指令，出图后将自动挂载到【${item.cleanTitle}】！`, "info", 3500);
                    return;
                }
            }
            // 兜底复制剪贴板
            navigator.clipboard?.writeText(blockTxt).catch(() => {});
            showToast(`🎨 未检测到发送按钮，已将绘图块复制剪贴板，发送后会自动捕获回填！`, "warn", 3200);
        }

        function scanChatImagesForZhiHuiJi() {
            if (!userSettings.zhjAutoCapture) return;
            const chatEl = document.getElementById("chat");
            if (!chatEl) return;

            const imgs = chatEl.querySelectorAll(".mes_text img");
            if (!imgs.length) return;

            const validImgs = Array.from(imgs).filter(img => {
                const src = img.getAttribute("src") || "";
                if (!src || src.includes("avatar") || src.includes("emoji") || src.includes("icon")) return false;
                if (img.naturalWidth > 0 && img.naturalWidth < 90) return false;
                return !capturedZhjSrcSet.has(src);
            });
            if (!validImgs.length) return;

            const latestImg = validImgs[validImgs.length - 1];
            const src = latestImg.getAttribute("src") || latestImg.src;
            if (!src) return;
            capturedZhjSrcSet.add(src);

            // 推断这张智绘姬生图属于哪个状态项
            let targetKey = null, targetStageKey = null, isCustom = false, catTitle = "";
            if (pendingZhjTarget && (Date.now() - pendingZhjTarget.ts < 180000)) {
                targetKey = pendingZhjTarget.editKey;
                targetStageKey = pendingZhjTarget.stageKey;
                isCustom = pendingZhjTarget.isCustom;
                catTitle = pendingZhjTarget.catTitle;
                pendingZhjTarget = null;
            } else {
                // 根据周围文本语义智能识别归属部位
                const mesBox = latestImg.closest(".mes_text");
                const txt = safeStr(mesBox?.textContent);
                const matchMap = [
                    { k: "小穴实况", reg: /小穴|花唇|pussy|vaginal|蜜穴/i },
                    { k: "子宫实况", reg: /子宫|宫颈|cervix|womb/i },
                    { k: "骚口实况", reg: /口交|深喉|mouth|tongue|throat/i },
                    { k: "胸部实况", reg: /乳房|乳头|breasts|nipple|泌乳/i },
                    { k: "屁眼实况", reg: /后庭|肛门|屁眼|anus|prolapse/i },
                    { k: "阴蒂尿道", reg: /阴蒂|尿道|clitoris|urethra/i },
                    { k: "当前姿势", reg: /姿势|跪趴|躺|体位|pose/i }
                ];
                for (const m of matchMap) {
                    if (m.reg.test(txt)) { targetKey = m.k; targetStageKey = `${m.k}_zhj`; break; }
                }
                if (!targetKey) { targetKey = "当前姿势"; targetStageKey = "当前姿势_zhj"; }
            }

            if (targetKey) {
                if (isCustom && catTitle) {
                    const found = (curVars.自定义条目?.[catTitle] || []).find(x => x.id === targetKey);
                    if (found) found.imgUrl = src;
                } else {
                    curVars.按钮详情 = curVars.按钮详情 || {};
                    curVars.按钮详情[targetKey] = { ...(curVars.按钮详情[targetKey] || {}), imgUrl: src };
                }
                if (src.startsWith("data:")) saveDataUrlToDB(targetStageKey, src).catch(() => {});
                saveChatCache(curVars);
                latestStatus = getFallbackData();
                renderBody();
                showToast(`🖼️ 已自动捕获智绘姬出图并挂载至【${targetKey}】！`, "success", 3000);
            }
        }

        // =========================================================================
        // 🎭 四大人格崩坏模式配置与动态 18+ ASMR 台词引擎
        // =========================================================================
        const RUIN_PERSONA_MODES = {
            evolution: { id: "evolution", label: "🌱 崩坏进化树", short: "进化树", desc: "随恶堕度与器质崩坏度自然从矜持递进至彻底母畜化" },
            despair:   { id: "despair",   label: "💧 彻底绝望型", short: "绝望型", desc: "理智防线崩溃，面对任何对待都只会绝望哭泣、求饶与失禁哀鸣" },
            addicted:  { id: "addicted",  label: "🥵 沉沦变态型", short: "沉沦型", desc: "大脑被快感彻底融化，主动掰开肉洞乞求更粗暴的灌精与改造" },
            contrast:  { id: "contrast",  label: "🎭 日常反差型", short: "反差型", desc: "支持一键切换【表面端庄伪装态】与【私下漏液母畜态】" }
        };

        function generateLiveASMRQuote(v, u) {
            const mode = userSettings.personaMode || "evolution";
            const corr = safeNum(v?.核心数值?.淫乱恶堕, 0);
            const customQuotes = userSettings.customAsmrQuotes || {};
            if (customQuotes[mode] && safeStr(customQuotes[mode]).trim()) {
                return safeStr(customQuotes[mode]).replace(/{user}/g, u);
            }
            if (mode === "despair") {
                if (corr < 35) return `“呜……不要再看那里了……求求你放过${u}吧，身体真的会坏掉的……💦”`;
                if (corr < 75) return `“啊嗯……合不拢了……浓精和尿一直在往外漏……${u}已经没法做回普通女孩子了呜呜……🥵💧”`;
                return `“坏掉了……从嘴巴到子宫全都变成漏斗肉洞了……不管被灌进多少都会乖乖吞下去的，别再弄坏我了……♡💦”`;
            }
            if (mode === "addicted") {
                if (corr < 35) return `“哈啊……♡ 好奇怪，明明那么羞人，小穴深处却一直在自己吸紧发抖呢……♡”`;
                if (corr < 75) return `“不够……还要更多♡ 快把宫颈口彻底撞穿吧，把滚烫浓精满满地灌进${u}的肉便器子宫里呀~🥵❤️”`;
                return `“咿呀啊——♡ 脑子全融化在精液里了♡ 请随时随地使用${u}这副彻底松弛外翻的母畜肉洞吧~♡💦”`;
            }
            if (mode === "contrast") {
                if (!userSettings.contrastInnerActive) {
                    return `【🎭表面伪装态】“……有什么事吗？我只是普通地在整理仪容而已……（双腿死死夹紧，生怕裙底塞满精液的肿胀蜜穴滴落白浊被发现💦）”`;
                } else {
                    return `【🥵私下母畜态】“哈啊♡ 终于不用装正经了……快看呀，刚才在外面一直憋着没敢漏出来的骚水和白浊，已经把底裤彻底泡烂啦~♡🥵”`;
                }
            }
            if (corr < 15) return `“呼吸平稳，${u}现在的身心完好如初，必须时刻保持端庄与警惕。”`;
            if (corr < 45) return `“唔……身体稍微有些发烫发软，粘膜深处还残留着让人脸红的酥麻余温呢……💦”`;
            if (corr < 80) return `“哈啊……♡ 子宫口已经被开发成只属于肉棒的形状了，不被灌满浓精的话就静不下心来呀……🥵♡”`;
            return `“啊嘿嘿……♡ 全身的六孔都已经100%改造成专用排泄受精肉坑了……今天也要把${u}灌成鼓鼓的精液泡芙哦~♡💦”`;
        }

        // =========================================================================
        // 🔬 动态可变形 X-Ray 体内透视断面 SVG 渲染器
        // =========================================================================
        function buildDynamicXRaySVG(v, dev, caps) {
            const sp = v.体内精液存量 || {};
            const wombMl = safeNum(sp.子宫毫升), vagMl = safeNum(sp.小穴毫升), analMl = safeNum(sp.屁眼毫升);
            const wombRatio = Math.min(1, wombMl / Math.max(50, caps.wombMax));
            const rx = Math.round(24 + (dev.wombObj.val * 0.16) + wombRatio * 14);
            const ry = Math.round(18 + (dev.wombObj.val * 0.12) + wombRatio * 12);
            const vagW = Math.round(7 + (dev.vagObj.val * 0.22));
            const analW = Math.round(5 + (dev.analObj.val * 0.18));
            const cervixDrop = Math.round((dev.wombObj.val / 100) * 18);
            const cervixGap = Math.round(2 + (dev.wombObj.val / 100) * 14);

            return `
            <svg viewBox="0 0 260 155" style="width:100%;max-height:145px;display:block;margin:0 auto;background:radial-gradient(circle at 50% 50%,rgba(80,12,45,0.65),rgba(10,5,18,0.92));border-radius:11px;border:1px solid rgba(243,139,168,0.35);">
                <defs>
                    <radialGradient id="stWombGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#fb7185" stop-opacity="0.7"/>
                        <stop offset="100%" stop-color="#881337" stop-opacity="0.92"/>
                    </radialGradient>
                    <linearGradient id="stCumGrad" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.96"/>
                        <stop offset="100%" stop-color="#fde68a" stop-opacity="0.8"/>
                    </linearGradient>
                </defs>
                <path d="M55,8 Q45,78 60,148 L200,148 Q215,78 205,8 Z" fill="rgba(35,10,30,0.65)" stroke="#f38ba8" stroke-width="1.2"/>
                <path d="M58,48 Q92,35 125,${52 + cervixDrop} Q158,35 192,48" fill="none" stroke="#f472b6" stroke-width="2.5"/>
                <circle cx="56" cy="49" r="${5 + Math.round(dev.wombObj.tier * 0.8)}" fill="#fb7185" stroke="#fff" stroke-width="0.8"/>
                <circle cx="194" cy="49" r="${5 + Math.round(dev.wombObj.tier * 0.8)}" fill="#fb7185" stroke="#fff" stroke-width="0.8"/>
                <ellipse cx="125" cy="${54 + cervixDrop}" rx="${rx}" ry="${ry}" fill="url(#stWombGrad)" stroke="#fda4af" stroke-width="1.5"/>
                ${wombRatio > 0 ? `<ellipse cx="125" cy="${54 + cervixDrop + ry * (1 - wombRatio) * 0.3}" rx="${Math.max(2, rx * 0.86 * wombRatio)}" ry="${Math.max(2, ry * 0.82 * wombRatio)}" fill="url(#stCumGrad)"/>` : ""}
                <rect x="${125 - cervixGap / 2}" y="${54 + cervixDrop + ry - 3}" width="${cervixGap}" height="10" fill="#be123c" rx="2"/>
                <rect x="${125 - vagW / 2}" y="${62 + cervixDrop + ry}" width="${vagW}" height="${Math.max(25, 72 - cervixDrop)}" rx="${vagW / 2}" fill="#9f1239" stroke="#f472b6" stroke-width="1.2"/>
                ${vagMl > 0 ? `<rect x="${125 - (vagW * 0.65) / 2}" y="${68 + cervixDrop + ry}" width="${vagW * 0.65}" height="${Math.min(55, 12 + vagMl * 0.25)}" rx="3" fill="url(#stCumGrad)"/>` : ""}
                <rect x="${172 - analW / 2}" y="68" width="${analW}" height="72" rx="${analW / 2}" fill="#581c87" stroke="#c084fc" stroke-width="1.1"/>
                ${analMl > 0 ? `<rect x="${172 - (analW * 0.65) / 2}" y="78" width="${analW * 0.65}" height="${Math.min(50, 10 + analMl * 0.25)}" rx="3" fill="url(#stCumGrad)"/>` : ""}
                <text x="14" y="22" fill="#f9e2af" font-size="9.5" font-weight="bold">🔬 X-Ray 实时内窥</text>
                <text x="14" y="36" fill="#fbcfe8" font-size="9">宫腔:${wombMl}ml</text>
                <text x="14" y="49" fill="#fbcfe8" font-size="9">小穴:${vagMl}ml</text>
                <text x="14" y="62" fill="#d8b4fe" font-size="9">后庭:${analMl}ml</text>
                <text x="14" y="142" fill="#fde047" font-size="9">宫颈下垂:${cervixDrop * 2}mm | 穴径:${(1.5 + dev.vagObj.val * 0.06).toFixed(1)}cm</text>
            </svg>`;
        }

        // =========================================================================
        // 🎨 五大高定旗舰皮肤（全面升级材质、玻璃高光、霓虹呼吸边与装饰纹理）
        // =========================================================================
        const THEMES = {
            "魅魔粉": {
                cls: "st-theme-succubus",
                bg: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26 38 C26 38 14 28 14 19 C14 14 19 11 26 17 C33 11 38 14 38 19 C38 28 26 38 26 38 Z' fill='none' stroke='rgba(243,139,168,0.09)' stroke-width='1.5'/%3E%3C/svg%3E"), radial-gradient(circle at 85% 12%, rgba(243,139,168,0.34), transparent 48%), linear-gradient(165deg, #27153b 0%, #140b22 68%, #090510 100%)`,
                border: "2px solid #f472b6", radius: "22px", shadow: "0 18px 56px rgba(244,114,182,0.48), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 0 28px rgba(243,139,168,0.18)",
                prim: "#f472b6", sec: "#c084fc", text: "#fdf2f8", sub: "#d8b4fe",
                card: "linear-gradient(145deg, rgba(58,28,84,0.82), rgba(22,12,38,0.92))",
                cardBorder: "1px solid rgba(244,114,182,0.45)", hi: "rgba(244,114,182,0.28)",
                headerBg: "linear-gradient(90deg, rgba(244,114,182,0.32), rgba(192,132,252,0.16))",
                deco: "❦ 魅魔桃心玻璃"
            },
            "暗黑血浆": {
                cls: "st-theme-blood",
                bg: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L40 20 M20 0 L20 40 M10 10 L30 30 M30 10 L10 30' stroke='rgba(255,30,66,0.08)' stroke-width='1'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 0%, rgba(220,38,38,0.42), transparent 60%), linear-gradient(170deg, #210309 0%, #0b0103 100%)`,
                border: "2.5px double #ff1e42", radius: "6px", shadow: "0 20px 62px rgba(255,0,43,0.72), inset 0 0 36px rgba(153,27,27,0.6)",
                prim: "#ff2a4b", sec: "#fca5a5", text: "#ffe4e6", sub: "#e295a2",
                card: "linear-gradient(160deg, rgba(56,6,15,0.94), rgba(18,2,5,0.98))",
                cardBorder: "1px solid rgba(255,42,75,0.68)", hi: "rgba(255,42,75,0.36)",
                headerBg: "linear-gradient(90deg, rgba(153,27,27,0.65), rgba(35,4,9,0.88))",
                deco: "🩸 哥特血契丝绒"
            },
            "白浊深渊": {
                cls: "st-theme-semen",
                bg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='18' cy='18' r='6' fill='rgba(255,255,255,0.07)'/%3E%3Ccircle cx='46' cy='38' r='9' fill='rgba(165,243,252,0.06)'/%3E%3C/svg%3E"), radial-gradient(ellipse at top, rgba(255,255,255,0.28), transparent 55%), linear-gradient(175deg, #0f172a 0%, #1e1b4b 58%, #090d16 100%)`,
                border: "2px solid #a5f3fc", radius: "26px", shadow: "0 18px 54px rgba(165,243,252,0.42), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 28px rgba(255,255,255,0.2)",
                prim: "#67e8f9", sec: "#e0e7ff", text: "#f8fafc", sub: "#cbd5e1",
                card: "linear-gradient(150deg, rgba(30,41,59,0.88), rgba(15,23,42,0.95))",
                cardBorder: "1.5px dashed rgba(165,243,252,0.55)", hi: "rgba(103,232,249,0.28)",
                headerBg: "linear-gradient(90deg, rgba(255,255,255,0.22), rgba(103,232,249,0.2))",
                deco: "🥛 浓白珠光流体"
            },
            "赛博调教": {
                cls: "st-theme-cyber",
                bg: `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 18 L36 18 M18 0 L18 36' stroke='rgba(0,245,212,0.09)' stroke-width='1'/%3E%3Crect x='15' y='15' width='6' height='6' fill='none' stroke='rgba(241,91,181,0.14)'/%3E%3C/svg%3E"), linear-gradient(160deg, #020617 0%, #0b162c 100%)`,
                border: "2px solid #00f5d4", radius: "4px", shadow: "0 0 42px rgba(0,245,212,0.58), inset 0 0 24px rgba(241,91,181,0.34)",
                prim: "#00f5d4", sec: "#f15bb5", text: "#e0fbfc", sub: "#90e0ef",
                card: "linear-gradient(135deg, rgba(10,25,47,0.95), rgba(2,12,27,0.98))",
                cardBorder: "1px solid #00f5d4", hi: "rgba(241,91,181,0.36)",
                headerBg: "linear-gradient(90deg, rgba(0,245,212,0.28), rgba(241,91,181,0.28))",
                deco: "⚡ 赛博全息终端"
            },
            "鎏金娼馆": {
                cls: "st-theme-brothel",
                bg: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 4 L44 24 L24 44 L4 24 Z' fill='none' stroke='rgba(251,191,36,0.09)' stroke-width='1.2'/%3E%3Ccircle cx='24' cy='24' r='5' fill='none' stroke='rgba(251,191,36,0.09)'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 8%, rgba(251,191,36,0.28), transparent 55%), linear-gradient(165deg, #2b170c 0%, #120804 100%)`,
                border: "2.5px ridge #fbbf24", radius: "16px", shadow: "0 20px 58px rgba(245,158,11,0.48), inset 0 0 28px rgba(251,191,36,0.2)",
                prim: "#fde047", sec: "#fb923c", text: "#fef3c7", sub: "#dfc4a0",
                card: "linear-gradient(155deg, rgba(54,31,16,0.94), rgba(24,12,6,0.98))",
                cardBorder: "1.5px ridge rgba(251,191,36,0.62)", hi: "rgba(251,191,36,0.3)",
                headerBg: "linear-gradient(90deg, rgba(217,119,6,0.42), rgba(69,26,3,0.74))",
                deco: "👑 巴洛克金菱纹"
            }
        };
        function injectCustomStyles() {
            if (document.getElementById("st-v20-custom-css")) return;
            const style = document.createElement("style");
            style.id = "st-v20-custom-css";
            style.textContent = `
                UpdateVariable, updatevariable, .st-hidden-uv {
                    display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important;
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
                @keyframes stBarShimmer {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
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
                .st-bar-fill {
                    background-size: 200% 100% !important;
                    animation: stBarShimmer 3.2s linear infinite;
                    font-variant-numeric: tabular-nums;
                }
                .st-corrupted-card-lv5 {
                    background-image: radial-gradient(circle at 92% 15%, rgba(225, 29, 72, 0.28), transparent 48%), linear-gradient(155deg, rgba(69, 10, 20, 0.92), rgba(24, 6, 14, 0.96)) !important;
                    border-left: 4.5px solid #ff0055 !important;
                    box-shadow: 0 6px 20px rgba(225, 29, 72, 0.4), inset 0 0 15px rgba(225, 29, 72, 0.22) !important;
                }
                .st-corrupted-card-lv6 {
                    background-image: url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0 Q10 18 8 28 Q6 36 12 44 M28 0 Q32 14 26 26 Q22 36 30 44' fill='none' stroke='rgba(255,0,85,0.14)' stroke-width='2'/%3E%3C/svg%3E"), radial-gradient(circle at 85% 20%, rgba(255, 0, 85, 0.38), transparent 55%), linear-gradient(160deg, rgba(76, 5, 25, 0.96), rgba(15, 2, 8, 0.99)) !important;
                    animation: stCorruptCardPulse 2.2s infinite ease-in-out !important;
                }
                .st-lite-mode, .st-lite-mode * {
                    animation: none !important; backdrop-filter: none !important; transition: none !important;
                }
                /* 高定皮肤卡片质感 */
                .st-theme-succubus .st-v28-card { border-radius: 16px !important; box-shadow: 0 8px 20px rgba(18, 8, 30, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.14) !important; }
                .st-theme-succubus .st-v28-card::after { content: "❦"; position: absolute; top: 5px; right: 9px; font-size: 11px; color: rgba(244, 114, 182, 0.32); pointer-events: none; }
                .st-theme-blood .st-v28-card { border-left: 4.5px solid #ff003c !important; border-right: 2px solid #7f1d1d !important; border-radius: 4px !important; box-shadow: 0 8px 22px rgba(0, 0, 0, 0.88), inset 0 1px 0 rgba(255, 77, 109, 0.35) !important; }
                .st-theme-blood .st-v28-card::after { content: "🩸"; position: absolute; top: 5px; right: 8px; font-size: 10px; opacity: 0.38; pointer-events: none; }
                .st-theme-semen .st-v28-card { border-radius: 20px !important; border-top: 2px solid rgba(255, 255, 255, 0.55) !important; box-shadow: 0 8px 24px rgba(9, 13, 22, 0.8), inset 0 4px 12px rgba(255, 255, 255, 0.15) !important; }
                .st-theme-cyber .st-v28-card { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); border-left: 4px solid #f15bb5 !important; border-right: 2px solid #00f5d4 !important; border-radius: 0 !important; box-shadow: 0 0 14px rgba(0, 245, 212, 0.25) !important; }
                .st-theme-brothel .st-v28-card { border: 2px ridge rgba(251, 191, 36, 0.72) !important; border-radius: 12px !important; box-shadow: 0 8px 22px rgba(0, 0, 0, 0.8), inset 0 0 16px rgba(251, 191, 36, 0.16) !important; }
                /* 漂亮收口的按钮组与紧凑模式 */
                .st-pill-btn {
                    display: inline-flex; align-items: center; justify-content: center; gap: 4px;
                    padding: 4px 9px; border-radius: 99px; font-size: 11px; font-weight: 700;
                    cursor: pointer; border: 1px solid rgba(255,255,255,0.22);
                    background: rgba(255,255,255,0.08); color: #f8fafc;
                    backdrop-filter: blur(6px); transition: all 0.15s ease; white-space: nowrap;
                }
                .st-pill-btn:hover { background: rgba(255,255,255,0.18); transform: translateY(-1px); }
                .st-compact-card { padding: 7px 10px !important; gap: 6px !important; }
                .st-compact-card .st-card-preview, .st-compact-card .st-card-thumb-wrap { display: none !important; }
                .st-buff-strip { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 7px; scrollbar-width: none; }
                .st-buff-strip::-webkit-scrollbar { display: none; }
                .st-buff-pill { font-size: 10.5px; font-weight: bold; padding: 2px 8px; border-radius: 99px; white-space: nowrap; border: 1px solid rgba(255,255,255,0.18); flex-shrink: 0; }
                .st-stage5-badge { animation: stPulseGlow 1.8s infinite ease-in-out; }
                .st-stage6-badge { animation: stStage6GodGlow 1.3s infinite ease-in-out; background: linear-gradient(135deg, #fbbf24 0%, #ff0055 50%, #2e1065 100%) !important; color: #fff !important; text-shadow: 0 1px 4px #000; }
                .st-emo-pill { display: inline-flex; align-items: center; padding: 1px 6px; border-radius: 99px; font-size: 10px; font-weight: bold; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; line-height: 1.35; }
                .st-emo-stage6 { display: inline-flex; align-items: center; padding: 1px 7px; border-radius: 99px; font-size: 10px; font-weight: 900; white-space: nowrap; background: linear-gradient(90deg, #f59e0b, #ff0055, #3b0764); color: #fff !important; border: 1px solid #fde047; box-shadow: 0 0 10px rgba(255, 0, 85, 0.85); }
                .st-heart-beat { display: inline-block; animation: stHeartbeat 1.3s infinite ease-in-out; }
                .st-sec-block { background: rgba(0, 0, 0, 0.42); border: 1px solid rgba(255, 255, 255, 0.09); border-left: 3.5px solid #cba6f7; border-radius: 9px; padding: 9px 12px; margin-bottom: 8px; line-height: 1.76; }
                .st-thought-box { margin-top: 12px; padding: 12px 14px; background: linear-gradient(145deg, rgba(243, 139, 168, 0.18), rgba(168, 85, 247, 0.12)); border: 1px solid rgba(243, 139, 168, 0.45); border-left: 4.5px solid #f38ba8; border-radius: 11px; color: #ffe0ec; font-style: italic; line-height: 1.85; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35), inset 0 0 14px rgba(243, 139, 168, 0.12); }
                @media (max-width: 520px) {
                    #st-v5-panel { max-height: 82vh !important; border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important; }
                    #st-v5-tabs { width: 52px !important; padding: 6px 4px !important; }
                    #st-v5-body { padding: 8px !important; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important; }
                    .st-card-thumb-wrap { width: 62px !important; height: 62px !important; }
                }
                #st-v5-body::-webkit-scrollbar, #st-v6-det-desc::-webkit-scrollbar, #st-v5-tabs::-webkit-scrollbar { width: 4px; }
                #st-v5-body::-webkit-scrollbar-thumb, #st-v6-det-desc::-webkit-scrollbar-thumb, #st-v5-tabs::-webkit-scrollbar-thumb { background: rgba(243, 139, 168, 0.45); border-radius: 99px; }
            `;
            document.head.appendChild(style);
        }

        function showToast(msg, type = "success", duration = 3000) {
            try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, "📊 状态栏2.0"); } catch (e) {}
            let box = document.getElementById("st-v20-toast");
            if (!box) {
                box = document.createElement("div"); box.id = "st-v20-toast";
                box.style.cssText = "position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;padding:9px 20px;border-radius:99px;font-family:'Microsoft YaHei',sans-serif;font-size:12.5px;font-weight:bold;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,0.85);transition:all 0.25s ease;pointer-events:none;display:none;align-items:center;gap:8px;backdrop-filter:blur(10px);max-width:92vw;text-align:center;";
                document.body.appendChild(box);
            }
            const colors = {
                success: "linear-gradient(135deg, rgba(22,163,74,0.96), rgba(21,128,61,0.96))",
                info: "linear-gradient(135deg, rgba(244,114,182,0.96), rgba(168,85,247,0.96))",
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
            enabled: true, hideRawBlock: true, theme: "魅魔粉", difficultyMode: "normal",
            worldBreakMode: "auto", personaMode: "evolution", contrastInnerActive: false,
            mobileLiteMode: false, compactCardMode: false, soundEnabled: false,
            showXrayOnHome: true, showQuickConsole: false, compactPromptMode: true,
            zhjAutoCapture: true, zhjSendMode: "auto_send",
            customExtraPrompt: "", customAsmrQuotes: {},
            strictMentalLock: true, injectReversePrompt: true, autoMetabolism: true,
            width: 540, height: 700, fontScale: 100,
            apiSyncEnabled: false, apiUrl: "", apiKey: "", apiModel: "", modelList: []
        };

        function loadSettings() {
            try {
                const s = JSON.parse(localStorage.getItem(EXT_ID + "_v20_cfg") || localStorage.getItem(EXT_ID + "_v10_cfg") || "{}");
                userSettings = { ...userSettings, ...s };
                userSettings.width = Math.max(330, Math.min(920, safeNum(userSettings.width, 540)));
                userSettings.height = Math.max(360, Math.min(920, safeNum(userSettings.height, 700)));
                userSettings.fontScale = Math.max(80, Math.min(135, safeNum(userSettings.fontScale, 100)));
                if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉";
                if (!DIFFICULTY_PRESETS[userSettings.difficultyMode]) userSettings.difficultyMode = "normal";
                if (!RUIN_PERSONA_MODES[userSettings.personaMode]) userSettings.personaMode = "evolution";
            } catch (e) {}
        }

        function saveSettings() {
            try { localStorage.setItem(EXT_ID + "_v20_cfg", JSON.stringify(userSettings)); } catch (e) {}
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
        // 🌈 崩坏畸变全光谱 + 工具函数（修复 totalLedgerCount 与正反向）
        // =========================================================================
        const EXCLUSIVE_SPECTRA = {
            cockLove: { grads: ["linear-gradient(90deg,#93c5fd,#cbd5e1)","linear-gradient(90deg,#fbcfe8,#f472b6)","linear-gradient(90deg,#f472b6,#e879f9)","linear-gradient(90deg,#c084fc,#9333ea)","linear-gradient(90deg,#e11d48,#881337)","linear-gradient(90deg,#fbbf24 0%,#ff0055 50%,#3b0764 100%)"], cols: ["#bfdbfe","#fbcfe8","#f5d0fe","#e9d5ff","#fda4af","#fde047"], emos: ["(˘•ω•˘)🛡️戒备排斥","(￣_￣)🍆粘膜适应","(⁄•⁄ω⁄•⁄)💓空虚渴求","(º﹃º )👅跪舔崇拜","(♡°▽°♡)🐶断根戒断","♛(🤪🍆💀)脑干阳具寄生"] },
            lust:     { grads: ["linear-gradient(90deg,#a7f3d0,#bae6fd)","linear-gradient(90deg,#fde68a,#fdba74)","linear-gradient(90deg,#fb923c,#f43f5e)","linear-gradient(90deg,#f43f5e,#dc2626)","linear-gradient(90deg,#dc2626,#7f1d1d)","linear-gradient(90deg,#fff 0%,#ff003c 45%,#450a0a 100%)"], cols: ["#a7f3d0","#fde68a","#fdba74","#fda4af","#f87171","#fef08a"], emos: ["( -_-)❄️清心克制","(｡•́︿•̀｡)🌡️春情微燥","(⸝⸝＞◡＜⸝⸝)🔥欲火焚身","(🥵💦)🌋重度发骚","(🤪🔥)♨️狂暴发情","💥(🥵❤️‍🔥💀)下丘脑烧毁"] },
            corr:     { grads: ["linear-gradient(90deg,#fff,#cbd5e1)","linear-gradient(90deg,#e2e8f0,#c084fc)","linear-gradient(90deg,#c084fc,#7e22ce)","linear-gradient(90deg,#9333ea,#be123c)","linear-gradient(90deg,#be123c,#3b0764,#09000b)","linear-gradient(90deg,#fde047 0%,#9333ea 45%,#020005 100%)"], cols: ["#f8fafc","#e9d5ff","#d8b4fe","#f0abfc","#fda4af","#fde047"], emos: ["(｡•̀ᴗ-)✨完好清白","( ´•̥×•̥`)🌫️初度染尘","(¬‿¬ )🍷食髓知味","(淫▽淫)👠放荡娼妇","(🤪🖤⛓️)🐷公用精盆","💀(👁️‍🗨️🖤🔞)彻底崩坏肉坑"] },
            shame:    { grads: ["linear-gradient(90deg,#ffe4e6,#fb7185,#e11d48)","linear-gradient(90deg,#fbcfe8,#ec4899)","linear-gradient(90deg,#e9d5ff,#a855f7)","linear-gradient(90deg,#a855f7,#be123c)","linear-gradient(90deg,#be123c,#1f000d)","linear-gradient(90deg,#00f5d4 0%,#ff0055 50%,#09000b 100%)"], cols: ["#fecdd3","#fbcfe8","#e9d5ff","#fda4af","#fb7185","#67e8f9"], emos: ["(⁄>⁄ω⁄<⁄)🍅羞愤自持","(🫣💦)耳根滚烫","( ˙-˙ )😐习以为常","(😏👙)敞腿任看","(🤪🐾)羞耻全灭","📸(🤪✌️💀)羞耻神经坏死"] },
            obey:     { grads: ["linear-gradient(90deg,#94a3b8,#cbd5e1)","linear-gradient(90deg,#93c5fd,#c4b5fd)","linear-gradient(90deg,#f9a8d4,#c084fc)","linear-gradient(90deg,#fbbf24,#d97706)","linear-gradient(90deg,#e11d48,#4c0519)","linear-gradient(90deg,#fde047 0%,#d97706 45%,#1c1917 100%)"], cols: ["#cbd5e1","#bfdbfe","#fbcfe8","#fde68a","#fda4af","#fde047"], emos: ["( `^´ )⚔️孤高自主","(´-ω-`)💧被动妥协","( ´•̥ω•̥`)🙇温顺配合","(▽・ω・▽)🐾摇尾乞怜","(⛓️🐶💦)绝对盲从","👑(🧎‍♀️👅💀)前额叶切除木偶"] },
            pleas:    { grads: ["linear-gradient(90deg,#f1f5f9,#fbcfe8)","linear-gradient(90deg,#f9a8d4,#ec4899)","linear-gradient(90deg,#e879f9,#a855f7)","linear-gradient(90deg,#ff0a54,#9333ea)","linear-gradient(90deg,#ff003c,#4a0018)","linear-gradient(90deg,#fff 0%,#ff0055 45%,#3b0764 100%)"], cols: ["#f8fafc","#fbcfe8","#f5d0fe","#fda4af","#ff4d6d","#fff"], emos: ["( ˘ω˘ )💤神思清明","(😳⚡)尾椎微麻","(🥺💓)趾尖蜷缩","(🥵⚡💦)濒临绝顶","(🤪⛲)潮吹失神","⚡(翻白眼👅💀)多巴胺烧穿熔断"] },
            hypno:    { grads: ["linear-gradient(90deg,#7dd3fc,#bae6fd)","linear-gradient(90deg,#818cf8,#c084fc)","linear-gradient(90deg,#a855f7,#ec4899)","linear-gradient(90deg,#ec4899,#7e22ce)","linear-gradient(90deg,#7e22ce,#1e1b4b)","linear-gradient(90deg,#ff007f 0%,#7e22ce 50%,#05000a 100%)"], cols: ["#bae6fd","#c7d2fe","#f5d0fe","#fbcfe8","#d8b4fe","#ff758f"], emos: ["(・_・)🧠理智完好","(°_° )🌀浅层恍惚","(＠_＠;)💫催眠暗示","(♡_♡)🎀常识改写","(🤤💭)人格碎裂","💖(👁️♡👁️💀)脑实质海绵化痴呆"] },
            drug:     { grads: ["linear-gradient(90deg,#86efac,#bbf7d0)","linear-gradient(90deg,#bef264,#facc15)","linear-gradient(90deg,#a3e635,#c084fc)","linear-gradient(90deg,#e879f9,#be123c)","linear-gradient(90deg,#9333ea,#3b0764)","linear-gradient(90deg,#a3e635 0%,#ff0055 50%,#1a0014 100%)"], cols: ["#bbf7d0","#fef08a","#d9f99d","#f5d0fe","#e9d5ff","#bef264"], emos: ["(🌱)纯净无毒","(😳🍷)微醺依恋","(🥵🧪)药力发热","(🤤💉)精液戒断","(🤪🧪💦)断精发狂","☣️(🤪💉💀)脑脊液毒化母猪"] },
            mouth:    { grads: ["linear-gradient(90deg,#fecdd3,#fda4af)","linear-gradient(90deg,#fda4af,#fb7185)","linear-gradient(90deg,#fb7185,#e11d48)","linear-gradient(90deg,#e11d48,#9d174d)","linear-gradient(90deg,#fff,#e11d48,#4c0519)","linear-gradient(90deg,#fde047 0%,#e11d48 50%,#1f000d 100%)"], cols: ["#ffe4e6","#fecdd3","#fda4af","#f472b6","#fda4af","#fde047"], emos: ["💋洁净初唇","👅唇肿涎溢","😮‍💨咽喉松弛","🤤颚骨半脱臼","🤪食道肉壶化","💀口腔排泄器畸变"] },
            chest:    { grads: ["linear-gradient(90deg,#fff1f2,#fbcfe8)","linear-gradient(90deg,#fbcfe8,#f472b6)","linear-gradient(90deg,#f472b6,#db2777)","linear-gradient(90deg,#fef3c7,#f472b6,#be185d)","linear-gradient(90deg,#fff,#ec4899,#831843)","linear-gradient(90deg,#fffbeb 0%,#ff0055 50%,#3b0764 100%)"], cols: ["#fce7f3","#fbcfe8","#f9a8d4","#fef3c7","#fbcfe8","#fde047"], emos: ["🌸娇嫩处乳","🍒乳尖肥大","🥵乳晕黑紫扩张","🍼乳腺失控漏奶","🐄下垂巨乳奶袋","💀崩坏泌乳肉囊"] },
            vag:      { grads: ["linear-gradient(90deg,#ffe4e6,#f9a8d4)","linear-gradient(90deg,#f9a8d4,#ec4899)","linear-gradient(90deg,#ec4899,#e11d48)","linear-gradient(90deg,#e11d48,#9d174d)","linear-gradient(90deg,#ff003c,#500724)","linear-gradient(90deg,#fde047 0%,#ff003c 48%,#1a000c 100%)"], cols: ["#ffe4e6","#fbcfe8","#fda4af","#f472b6","#ff4d6d","#fde047"], emos: ["🌸紧致初鲍","💧初破红肿","🌺外翻黑木耳","🥵括约肌松弛洞开","🤪肉壁脱垂漏精壶","💀彻底崩坏烂肉洞"] },
            womb:     { grads: ["linear-gradient(90deg,#fce7f3,#f0abfc)","linear-gradient(90deg,#f0abfc,#d946ef)","linear-gradient(90deg,#d946ef,#be185d)","linear-gradient(90deg,#be185d,#881337)","linear-gradient(90deg,#fff,#be123c,#3b0764)","linear-gradient(90deg,#fde047 0%,#d946ef 45%,#2e1065 100%)"], cols: ["#f5d0fe","#f0abfc","#e879f9","#fda4af","#ffccd5","#fde047"], emos: ["🤍紧闭处子","🥺宫口充血微松","🫀宫口扩张锁精","🥵宫腔肥大下坠","🤪宫颈重度脱垂","💀外翻脱垂死肉苗床"] },
            clit:     { grads: ["linear-gradient(90deg,#fef9c3,#fbcfe8)","linear-gradient(90deg,#fde047,#f472b6)","linear-gradient(90deg,#facc15,#ec4899)","linear-gradient(90deg,#f59e0b,#e11d48)","linear-gradient(90deg,#ff003c,#7e22ce)","linear-gradient(90deg,#fef08a 0%,#00f5d4 45%,#be123c 100%)"], cols: ["#fef9c3","#fde68a","#fbcfe8","#fdba74","#fda4af","#67e8f9"], emos: ["🌱包皮隐没","😳充血外露","⚡阴蒂肥大勃起","🥵尿道扩张漏尿","⛲阴蒂肉棒化失禁","💀括约肌坏死漏尿狂"] },
            anal:     { grads: ["linear-gradient(90deg,#fed7aa,#fda4af)","linear-gradient(90deg,#fda4af,#e11d48)","linear-gradient(90deg,#e11d48,#9f1239)","linear-gradient(90deg,#9f1239,#6b21a8)","linear-gradient(90deg,#7e22ce,#3b0764)","linear-gradient(90deg,#fb923c 0%,#be123c 50%,#1a0014 100%)"], cols: ["#fed7aa","#fda4af","#fb7185","#e9d5ff","#d8b4fe","#fdba74"], emos: ["💮紧闭菊蕾","😣裂伤红肿","😮‍💨褶皱磨平松弛","🕳️后庭空洞不合","🥛直肠翻肉轻度脱肛","💀重度脱肛崩坏排泄腔"] },
            pee:      { grads: ["linear-gradient(90deg,#fff,#fef9c3)","linear-gradient(90deg,#fef08a,#facc15)","linear-gradient(90deg,#facc15,#f59e0b)","linear-gradient(90deg,#ea580c,#e11d48)","linear-gradient(90deg,#e11d48,#881337)","linear-gradient(90deg,#fde047 0%,#ff003c 50%,#1a0008 100%)"], cols: ["#fef9c3","#fde047","#fdba74","#fda4af","#ff4d6d","#fde047"], emos: ["🤍尿道紧闭","😳小腹微酸","😣夹腿憋尿","🥵濒临漏尿","💦括约肌崩解","⛲24h失禁滴尿"] },
            semen:    { grads: ["linear-gradient(90deg,#64748b,#94a3b8)","linear-gradient(90deg,#e2e8f0,#fff)","linear-gradient(90deg,#fff,#fbcfe8,#f472b6)","linear-gradient(90deg,#fff,#ec4899,#be123c)","linear-gradient(90deg,#fff,#ff0a54,#3b0764)","linear-gradient(90deg,#fff 0%,#fde047 35%,#ff0055 100%)"], cols: ["#cbd5e1","#fff","#fbcfe8","#fda4af","#ffccd5","#fde047"], emos: ["🤍无残留","🥛微量挂壁","🤤白浊咕啾","🥵灌满外溢","🫃精盆撑满","💥灌爆撑裂苗床"] },
            milk:     { grads: ["linear-gradient(90deg,#64748b,#94a3b8)","linear-gradient(90deg,#fffbeb,#fef3c7)","linear-gradient(90deg,#fef3c7,#fde68a)","linear-gradient(90deg,#fde68a,#f9a8d4)","linear-gradient(90deg,#fffbeb,#fb7185,#be123c)","linear-gradient(90deg,#fff 0%,#fde047 45%,#ec4899 100%)"], cols: ["#cbd5e1","#fef3c7","#fde68a","#fbcfe8","#fecdd3","#fde047"], emos: ["🌸未泌乳","🍼乳腺微胀","🥺乳尖渗奶","🥵涨奶酸痛","🐄双乳狂喷","🌊失禁浊乳喷泉"] },
            sta:      { grads: ["linear-gradient(90deg,#bbf7d0,#4ade80,#16a34a)","linear-gradient(90deg,#fef08a,#facc15)","linear-gradient(90deg,#fed7aa,#fb923c)","linear-gradient(90deg,#fda4af,#e11d48)","linear-gradient(90deg,#dc2626,#450a0a)","linear-gradient(90deg,#450a0a 0%,#090000 100%)"], cols: ["#86efac","#fde047","#fdba74","#fda4af","#f87171","#fca5a5"], emos: ["✨亭亭玉立","😮‍💨腰腿酸软","🥵膝软外八不合","🫠双腿痉挛瘫软","😵‍💫髋骨脱臼爬行","💀四肢废用肉垫"] }
        };

        function getThemedBarStyle(pct, barTheme = "pleas") {
            if (barTheme === "none") return { grad: "linear-gradient(90deg,#f472b6,#a855f7)", glow: "none", labelColor: "#fbcfe8", emo: "", tier: 0 };
            const p = Math.max(0, Math.min(100, Math.round(safeNum(pct, 0))));
            const isRev = (barTheme === "shame" || barTheme === "sta");
            let t = tier6(p, isRev);
            if (barTheme === "semen" || barTheme === "milk") {
                if (p === 0) t = 0; else if (p < 30) t = 1; else if (p < 60) t = 2; else if (p < 85) t = 3; else if (p < 100) t = 4; else t = 5;
            }
            const spec = EXCLUSIVE_SPECTRA[barTheme] || EXCLUSIVE_SPECTRA.pleas;
            const grad = spec.grads[t] || spec.grads[0], col = spec.cols[t] || "#f9e2af", rawEmo = spec.emos[t] || "";
            const isMax = (t === 5);
            const glow = isMax ? "0 0 14px #ff0055,0 0 22px #fde047,inset 0 0 6px #fff" : (t >= 3 ? `0 0 10px ${col}88` : `0 0 5px ${col}44`);
            const emo = isMax ? `<span class="st-emo-stage6">${rawEmo}</span>` : `<span class="st-emo-pill" style="color:${col};border:1px solid ${col}55;background:rgba(0,0,0,0.45);">${rawEmo}</span>`;
            return { grad, glow, labelColor: col, emo, tier: t };
        }

        function cleanThoughtText(str) {
            return safeStr(str).replace(/【(?:生理层|心理层|欲望层)】/g, "").replace(/\s*｜\s*/g, "").replace(/^[\s"“'‘*]+|[\s"”'’*]+$/g, "").replace(/\*\*/g, "").trim();
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
                档案: { 手动锁定真名: "", 当前认知名字: "", 原身旧名: "", 种族与体质: "", 身份与背景: "", 肉体外貌实况: "", 表里风评与称号: "", 致命把柄与威胁: "无", 风月挂牌身价: "", 当前处境: "" },
                核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
                精神与心理: { 羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0, 意识清醒度: 100, 人格崩解度: 0, 媚药精液毒瘾: 0, 语言退化阿嘿颜: 0 },
                身体: { 体力: 100, 敏感度倍率: 1.0 },
                性癖: { 条目: [] }, 恩客图鉴: {}, 已屏蔽恩客: [], 历史最高崩坏度: {}, 上帝强制锁定: {},
                实况: { 内心独白: "", 当前姿势: "", 当前衣装: "", 骚口实况: "", 胸部实况: "", 小穴实况: "", 子宫实况: "", 阴蒂尿道实况: "", 屁眼实况: "" },
                穿搭: { 头饰与眼部: "", 颈部与项圈: "", 胸罩与裹胸: "", 上衣与束腰: "", 内裤与遮挡: "", 下装与裙裤: "", 丝袜与腿部: "", 鞋子与玉足: "" },
                计数: { 性交: { 口: 0, 小穴: 0, 屁眼: 0, 乳穴: 0, 足腿: 0, 兽交异种: 0 }, 高潮: { 总数: 0, 强制: 0, 公开场合: 0, 寸止: 0 }, 射精: { 内射: 0, 颜射体外: 0 }, 精液摄入: { 吞精次数: 0, 累计毫升: 0 }, 泌乳: { 喷乳次数: 0, 累计毫升: 0 }, 自慰: 0, 失控: { 失禁: 0, 喷潮: 0, 阿嘿颜: 0 }, 暴露: { 露出: 0, 被围观人次: 0, 被拍摄留影: 0 }, 交易: { 接客卖身: 0, 被外借共享: 0, 轮奸群交: 0, 睡眠昏迷奸: 0 } },
                受孕与生理: { 子宫怀孕: 0, 怀孕进度: 0, 受孕概率: 0, 生理周期阶段: "正常生理期", 卵子状态: "未排卵", 宫内精液归属: "无", 生产产卵次数: 0 },
                体内精液存量: { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
                痕迹与标记: { 体表痕迹: "无", 淫纹与刻印: "无", 公开涂鸦字迹: "无", 穿刺与环饰: "无", 鞭痕与掌印: 0, 初夜破瓜纪念: "处女膜完好无损" },
                体内道具与权限: { 体内道具: "无", 束缚状态: "无", 穿戴中的标记物: "", 肉体所有权: "自由身", 排泄与高潮权限: "自主控制", 常识改写状态: "无" },
                调教进度: { 规矩与日程: "", 条件反射触发词: "无", 媚药与发情毒: "无" },
                精神与心理扩展: { 当前敏感点: "", 催眠深度: 0 },
                按钮详情: {}, 性癖详情: {}, 自定义条目: {}
            };
        }

        let curVars = getInitialVars(), latestStatus = null, activeCat = null, curDetailIdx = 0, inSettings = false;
        let isCleaningDOM = false, cleanTimer = null, lastKnownCardKey = "", viewingHistoryFloor = null;
        const SHORT_NAMES = { "档案与风评": "档案", "恶堕与脑改": "恶堕", "下流性癖库": "性癖", "六孔与储精": "六孔", "肉改与道具": "肉改", "全身穿搭": "穿搭", "苗床与受孕": "受孕", "恩客图鉴": "恩客", "淫乱总账": "总账" };

        function getChatStoreKey() {
            const ctx = safeCtx();
            return `${EXT_ID}_v20_cache_${ctx?.chatId || ctx?.characterId || ctx?.name2 || "default_chat"}`;
        }
        function loadChatCache() {
            try {
                const cid = safeCtx()?.chatId || "default_chat";
                const raw = localStorage.getItem(getChatStoreKey()) || localStorage.getItem(`${EXT_ID}_v10_cache_${cid}`);
                return raw ? JSON.parse(raw) : null;
            } catch (e) { return null; }
        }
        function saveChatCache(varsObj, floorLen = -1) {
            if (viewingHistoryFloor !== null) return;
            try {
                const curLen = floorLen >= 0 ? floorLen : (safeCtx()?.chat?.length || 0);
                localStorage.setItem(getChatStoreKey(), JSON.stringify({
                    floorLen: curLen, 手动锁定真名: varsObj.档案?.手动锁定真名 || "", 已屏蔽恩客: varsObj.已屏蔽恩客 || [],
                    历史最高崩坏度: varsObj.历史最高崩坏度 || {}, 上帝强制锁定: varsObj.上帝强制锁定 || {},
                    快照: varsObj, 按钮详情: varsObj.按钮详情 || {}, 性癖详情: varsObj.性癖详情 || {}, 自定义条目: varsObj.自定义条目 || {}
                }));
            } catch (e) {}
        }

        function applyNaturalMetabolism(floorText, targetVars, hasExplicitSet = false) {
            if (!floorText) return;
            const cleanBody = floorText.replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|<options>[\s\S]*?<\/options>|<summary>[\s\S]*?<\/summary>|<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "");
            if (!cleanBody) return;
            const sp = targetVars.体内精液存量 || {}, mark = targetVars.痕迹与标记 || {}, prop = targetVars.体内道具与权限 || {}, cnt = targetVars.计数 || {};

            if (!hasExplicitSet) {
                if (/(?:挺身|肉棒|阳具|巨物|龟头).{0,15}(?:捅入|插入|贯穿|顶入|没入|抽插).{0,15}(?:小穴|花穴|甬道|蜜穴|肉穴)/.test(cleanBody)) cnt.性交.小穴 = safeNum(cnt.性交.小穴) + 1;
                if (/(?:内射|射入|灌入|喷洒在|泵入).{0,15}(?:子宫|宫腔|小穴深处|花心|甬道深处)/.test(cleanBody)) { cnt.射精.内射 = safeNum(cnt.射精.内射) + 1; sp.子宫毫升 = safeNum(sp.子宫毫升) + 18; sp.小穴毫升 = safeNum(sp.小穴毫升) + 10; }
                if (/(?:肉棒|阳具|龟头).{0,12}(?:塞入|捅入|顶入|深喉|抽插).{0,12}(?:小嘴|口腔|咽喉|喉管|唇瓣)/.test(cleanBody)) cnt.性交.口 = safeNum(cnt.性交.口) + 1;
                if (/(?:吞下|咽下|射进嘴|灌进胃|吞精).{0,15}(?:精液|白浊|浓精)/.test(cleanBody)) { cnt.精液摄入.吞精次数 = safeNum(cnt.精液摄入.吞精次数) + 1; cnt.精液摄入.累计毫升 = safeNum(cnt.精液摄入.累计毫升) + 15; sp.口内毫升 = safeNum(sp.口内毫升) + 15; }
                if (/(?:捅入|插入|贯穿|抽插).{0,12}(?:屁眼|后庭|菊穴|肛门|直肠)/.test(cleanBody)) cnt.性交.屁眼 = safeNum(cnt.性交.屁眼) + 1;
                if (/(?:高潮|绝顶|泄身|痉挛着攀上巅峰)/.test(cleanBody)) cnt.高潮.总数 = safeNum(cnt.高潮.总数) + 1;
                if (/(?:潮吹|喷潮|喷涌而出)/.test(cleanBody)) cnt.失控.喷潮 = safeNum(cnt.失控.喷潮) + 1;
                if (/(?:失禁|漏尿|黄尿|尿液失控)/.test(cleanBody)) cnt.失控.失禁 = safeNum(cnt.失控.失禁) + 1;
                if (/(?:耳光|掌掴|巴掌|皮鞭|抽打).{0,12}(?:臀|脸|胸|乳)/.test(cleanBody)) mark.鞭痕与掌印 = safeNum(mark.鞭痕与掌印) + 1;
                // 修复：高强度折腾自动扣减体力
                if (/(?:高潮|绝顶|痉挛|抽插|贯穿|轮奸|鞭打|束缚|跪趴|脱力|瘫软)/.test(cleanBody)) {
                    const drop = /(?:轮奸|痉挛|脱力|瘫软|潮吹|失禁)/.test(cleanBody) ? 12 : 6;
                    targetVars.身体.体力 = Math.max(0, safeNum(targetVars.身体.体力, 100) - drop);
                }
            }
            if (!userSettings.autoMetabolism) return;
            if (/(?:花洒|喷头|水流|温水).{0,16}(?:冲刷|冲洗|灌入|洗净).{0,16}(?:甬道|深处|残精|小穴|宫腔)/.test(cleanBody)) {
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.15)); sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.35));
            } else if (/(?:手指|并拢).{0,15}(?:探入|伸入|抠出|洗出|清理).{0,18}(?:残精|白浊|甬道|深处)/.test(cleanBody)) {
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.4)); sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.75));
            }
            if (/(?:漱口|吐出).{0,12}(?:残精|白浊|精液)/.test(cleanBody)) sp.口内毫升 = Math.max(0, Math.round(safeNum(sp.口内毫升) * 0.3));
            if (/(?:沉沉睡去|一觉睡到|次日清晨|第二天早上|醒来时已是|睡了一觉)/.test(cleanBody)) {
                targetVars.身体.体力 = Math.min(100, safeNum(targetVars.身体.体力, 70) + 55);
                targetVars.精神与心理.快感累积 = Math.max(0, Math.round(safeNum(targetVars.精神与心理.快感累积) * 0.15));
                targetVars.核心数值.性欲程度 = Math.max(0, Math.round(safeNum(targetVars.核心数值.性欲程度) * 0.4));
                targetVars.精神与心理.意识清醒度 = Math.min(100, safeNum(targetVars.精神与心理.意识清醒度, 80) + 40);
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.2)); sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.4)); sp.口内毫升 = 0;
            }
        }

        function computeAllOrganDevelopments(v) {
            const c = v.计数 || {}, dMult = Math.max(0.5, getDifficultyProfile().mult);
            const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼), tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), beast = safeNum(c.性交?.兽交异种);
            const creampie = safeNum(c.射精?.内射), facial = safeNum(c.射精?.颜射体外), swallow = safeNum(c.精液摄入?.吞精次数), swallowMl = safeNum(c.精液摄入?.累计毫升);
            const orgasm = safeNum(c.高潮?.总数), forceOrg = safeNum(c.高潮?.强制), edge = safeNum(c.高潮?.寸止);
            const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁), mast = safeNum(c.自慰), exp = safeNum(c.暴露?.露出);
            const hooker = safeNum(c.交易?.接客卖身), gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
            const milk = safeNum(c.泌乳?.喷乳次数), milkMl = safeNum(c.泌乳?.累计毫升), whip = safeNum(v.痕迹与标记?.鞭痕与掌印);
            const pregCnt = safeNum(v.受孕与生理?.生产产卵次数) + (v.受孕与生理?.子宫怀孕 ? 1 : 0);

            const makeObj = (pts, w, g6, lockKey, godKey) => {
                const o = calcStage6Score(pts, w, dMult, g6);
                o.val = lockIrreversible(v, lockKey, o.val, godKey);
                o.tier = tier6(o.val, false);
                return o;
            };
            const vagObj   = makeObj(vag + mast * 0.4 + creampie * 0.35 + squirt * 0.7 + gang * 1.5, 1.0, vag >= 100 * dMult && orgasm >= 60 * dMult, "organ_vag", "小穴实况");
            const wombObj  = makeObj(creampie * 1.2 + vag * 0.25 + gang * 1.8 + pregCnt * 25, 1.05, creampie >= 90 * dMult, "organ_womb", "子宫实况");
            const mouthObj = makeObj(mouth + swallow * 1.2 + swallowMl / 45, 1.0, (mouth + swallow) >= 85 * dMult, "organ_mouth", "骚口实况");
            const chestObj = makeObj(tit * 1.2 + milk * 1.6 + milkMl / 50 + mast * 0.25, 1.15, (tit + milk) >= 65 * dMult, "organ_chest", "胸部实况");
            const clitObj  = makeObj(orgasm * 0.7 + forceOrg + edge * 1.3 + squirt * 1.5 + leak * 1.8 + mast * 0.5, 1.0, orgasm >= 80 * dMult && (squirt + leak) >= 25 * dMult, "organ_clit", "阴蒂尿道");
            const analObj  = makeObj(anal * 1.3 + leak * 0.8 + gang * 1.4, 1.2, anal >= 65 * dMult, "organ_anal", "屁眼实况");

            // 修复：补齐 beast / facial / edge / whip 漏算
            const totalLedgerCount = vag + mouth + anal + tit + foot + beast + creampie + facial + swallow + orgasm + edge + squirt + leak + mast + exp + hooker + gang + sleep + milk + whip;
            const sixScores = [vagObj.val, wombObj.val, mouthObj.val, chestObj.val, clitObj.val, analObj.val].sort((a, b) => b - a);
            const top2OrganAvg = Math.round((sixScores[0] + sixScores[1]) / 2);
            const all6OrganAvg = Math.round(sixScores.reduce((a, b) => a + b, 0) / 6);
            const totalWeightedPts = vag * 0.9 + creampie * 1.1 + mouth * 0.7 + swallow * 0.9 + anal + tit * 0.5 + foot * 0.4 + orgasm * 0.45 + (squirt + leak) + mast * 0.35 + exp * 0.8 + hooker * 1.1 + gang * 2.0 + sleep * 1.2 + beast * 2.0 + whip * 0.6;
            const ledgerCurve = calcStage6Score(totalWeightedPts, 0.75, dMult, sixScores[0] >= 100 && totalWeightedPts >= 450 * dMult);
            const compositeScore = (totalLedgerCount === 0 && all6OrganAvg === 0) ? 0 : Math.round(ledgerCurve.val * 0.45 + top2OrganAvg * 0.35 + all6OrganAvg * 0.20);

            return { vagObj, wombObj, mouthObj, chestObj, clitObj, analObj, totalLedgerCount, totalWeightedPts, top2OrganAvg, all6OrganAvg, masterCurve: { val: compositeScore, tier: tier6(compositeScore, false), curPts: Math.round(totalWeightedPts), nextThreshold: ledgerCurve.nextThreshold } };
        }
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
                return { val: 0, tier: 0, curPts: 0, nextThreshold: Math.max(1, Math.ceil((18 * diffMult) / unitWeight)) };
            }
            const eff = (rawPoints * unitWeight) / Math.max(0.5, diffMult);
            const T1 = 18, T2 = 55, T3 = 125, T4 = 240, T5 = 420;
            let score = 0, nextTargetEff = T1;
            if (eff < T1) { score = Math.max(1, Math.min(19, Math.floor(1 + (eff / T1) * 18))); nextTargetEff = T1; }
            else if (eff < T2) { score = Math.min(39, Math.floor(20 + ((eff - T1) / (T2 - T1)) * 19)); nextTargetEff = T2; }
            else if (eff < T3) { score = Math.min(59, Math.floor(40 + ((eff - T2) / (T3 - T2)) * 19)); nextTargetEff = T3; }
            else if (eff < T4) { score = Math.min(79, Math.floor(60 + ((eff - T3) / (T4 - T3)) * 19)); nextTargetEff = T4; }
            else if (eff < T5) { score = Math.min(99, Math.floor(80 + ((eff - T4) / (T5 - T4)) * 19)); nextTargetEff = T5; }
            else { score = passesStage6Gate ? 100 : 99; nextTargetEff = T5; }
            const realNext = Math.max(Math.ceil(rawPoints) + 1, Math.ceil((nextTargetEff * diffMult) / unitWeight));
            return { val: score, tier: tier6(score, false), curPts: Math.round(rawPoints), nextThreshold: realNext };
        }

        function computeUnlockedFetishes(v) {
            const c = v.计数 || {}, dMult = getDifficultyProfile().mult;
            const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼);
            const tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), creampie = safeNum(c.射精?.内射);
            const swallow = safeNum(c.精液摄入?.吞精次数), orgasm = safeNum(c.高潮?.总数);
            const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁), mast = safeNum(c.自慰);
            const exp = safeNum(c.暴露?.露出), hooker = safeNum(c.交易?.接客卖身);
            const milk = safeNum(c.泌乳?.喷乳次数), gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
            const edge = safeNum(c.高潮?.寸止), whip = safeNum(v.痕迹与标记?.鞭痕与掌印), corr = safeNum(v.核心数值?.淫乱恶堕);
            const totalCount = vag + mouth + anal + tit + foot + creampie + swallow + orgasm + squirt + leak + mast + exp + hooker + milk + gang + sleep + whip + edge;
            const resultMap = new Map();

            const upsertAuto = (shortName, originTpl, pts, unitWeight = 1.0, gate6 = false) => {
                if (pts <= 0) return;
                const { val: rawVal, curPts, nextThreshold } = calcStage6Score(pts, unitWeight, dMult, gate6 && corr >= 95);
                const calcVal = lockIrreversible(v, `fet_${shortName}`, rawVal, `fetish_${shortName}`);
                resultMap.set(shortName, { name: shortName, origin: `${originTpl}（畸变点：${curPts} / 下一阶：${nextThreshold}）`, val: calcVal, stage: stageNameFromVal(calcVal), countNow: curPts, nextTarget: nextThreshold });
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
                    const num = Math.max(1, Math.min(99, calcStage6Score(Math.max(1, totalCount * 0.5), 1.0, dMult, false).val));
                    resultMap.set(rawName, { name: rawName, origin, val: num, stage: stageNameFromVal(num), countNow: totalCount, nextTarget: Math.ceil(totalCount * 1.6 + 20) });
                });
            }
            return Array.from(resultMap.values());
        }

        function calibrateMentalMetrics(v) {
            const dev = computeAllOrganDevelopments(v);
            const fetList = computeUnlockedFetishes(v);
            const fetAvg = fetList.length > 0 ? Math.round(fetList.reduce((acc, f) => acc + f.val, 0) / fetList.length) : 0;

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
            if (!userSettings.strictMentalLock) { applyGodMental(); return; }

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
            // 修复：不再用 organCap 锁死体力下限，允许剧情中真正脱力累晕至 0

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
            v.精神与心理.羞耻度 = Math.max(minShameFloor, Math.min(Math.max(0, Math.min(100, safeNum(v.精神与心理.羞耻度, 100))), maxShameCap));

            const hasActiveStimulus = totalMl > 0 || (v.体内道具与权限?.体内道具 && v.体内道具与权限.体内道具 !== "无");
            const shortTermCap = Math.min(100, Math.max(45, anchorScore + 35));
            const lustFloor = hasActiveStimulus ? Math.min(35, Math.round(anchorScore * 0.35)) : Math.min(15, Math.round(anchorScore * 0.15));
            const pleasFloor = hasActiveStimulus ? Math.min(25, Math.round(anchorScore * 0.25)) : 0;
            v.核心数值.性欲程度 = Math.max(lustFloor, Math.min(Math.max(0, safeNum(v.核心数值.性欲程度)), shortTermCap));
            v.精神与心理.快感累积 = Math.max(pleasFloor, Math.min(Math.max(0, safeNum(v.精神与心理.快感累积)), shortTermCap));
            applyGodMental();
        }

        function getOverallCorruptionTier(v) {
            const corr = safeNum(v.核心数值?.淫乱恶堕, 0), cock = safeNum(v.核心数值?.对肉棒好感度, 0), obey = safeNum(v.精神与心理?.服从度, 0), shameRev = 100 - safeNum(v.精神与心理?.羞耻度, 100);
            return tier6(Math.round(corr * 0.45 + cock * 0.2 + obey * 0.2 + shameRev * 0.15), false);
        }

        function pickStageThought(v, thoughtsArray, specificStageVal = null, isRev = false) {
            const mode = userSettings.personaMode || "evolution";
            const t = specificStageVal !== null ? tier6(specificStageVal, isRev) : getOverallCorruptionTier(v);
            const baseThought = thoughtsArray[Math.min(t, thoughtsArray.length - 1)] || thoughtsArray[0];
            if (mode === "despair") return t === 0 ? baseThought : `呜呜……不要再折腾我了……${baseThought.replace(/啊嘿♡|嘻嘻♡|好喜欢/g, "好可怕呜呜")} 求求你放过我吧😭💦……`;
            if (mode === "addicted") return thoughtsArray[Math.min(thoughtsArray.length - 1, Math.max(t + 2, 4))] || baseThought;
            if (mode === "contrast") {
                return !userSettings.contrastInnerActive
                    ? `（表面强装端庄冷静，死死咬紧嘴唇不露声色）……${thoughtsArray[Math.min(1, thoughtsArray.length - 1)]}`
                    : `（私下彻底卸下伪装，眼神迷离拉丝♡）${thoughtsArray[Math.min(thoughtsArray.length - 1, Math.max(t + 2, 4))]}`;
            }
            return baseThought;
        }

        function calcHoleCapacities(v) {
            const c = v.计数 || {}, corr = safeNum(v.核心数值?.淫乱恶堕);
            const mouthCnt = safeNum(c.性交?.口) + safeNum(c.精液摄入?.吞精次数), vagCnt = safeNum(c.性交?.小穴), creampie = safeNum(c.射精?.内射), analCnt = safeNum(c.性交?.屁眼);
            return {
                mouthMax: Math.min(1800, Math.round(45 + mouthCnt * 3.5 + corr * 1.5)),
                vagMax:   Math.min(1200, Math.round(25 + vagCnt * 3.0 + corr * 1.0)),
                wombMax:  Math.min(2000, Math.round(20 + creampie * 5.0 + vagCnt * 1.5 + corr * 1.8)),
                analMax:  Math.min(1800, Math.round(35 + analCnt * 4.5 + corr * 1.5))
            };
        }

        function buildFetishRichDesc(fetishObj, v, u) {
            const { name, origin, val, stage, countNow = 0, nextTarget = 20 } = fetishObj;
            const t = tier6(val, false);
            const apiFet = v.性癖详情?.[name];
            if (apiFet && (apiFet.desc || apiFet.thought)) {
                return `【🧬 性癖】：「${name}」（${stage} · ${val}/100）\n【🔓 成因】：${apiFet.origin || origin}\n【🔞 发作与畸变实况】：\n${apiFet.desc || "该性癖已在体内激活。"}\n💭【${u}的实时心声】：“*${cleanThoughtText(apiFet.thought || "身体产生了一丝奇妙的反应……")}*”`;
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
            return `【🧬 性癖】：「${name}」（${stage} · ${val}/100）\n【🔓 成因】：${origin}\n【🔞 发作与畸变实况】：\n${stageDescs[t]}\n💭【${u}的实时心声】：“*${pickStageThought(v, stageThoughts, val)}*”`;
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
                            if (val !== "" && val !== "无" && val !== 0 && !baseVars[k][subKey]) baseVars[k][subKey] = val;
                        });
                    }
                });
                const FLOATING_KEYS = new Set(["性欲程度", "快感累积", "意识清醒度"]);
                ["核心数值", "精神与心理"].forEach(k => {
                    if (s[k] && typeof s[k] === "object") {
                        Object.entries(s[k]).forEach(([subKey, val]) => {
                            if (typeof val !== "number") return;
                            if (FLOATING_KEYS.has(subKey)) {
                                if (isSameFloor && baseVars[k][subKey] === (subKey === "意识清醒度" ? 100 : 0)) baseVars[k][subKey] = val;
                            } else if (subKey === "羞耻度") {
                                baseVars[k][subKey] = Math.min(safeNum(baseVars[k][subKey], 100), val);
                            } else {
                                baseVars[k][subKey] = Math.max(safeNum(baseVars[k][subKey], 0), val);
                            }
                        });
                    }
                });
                if (isSameFloor && s.身体 && typeof s.身体.体力 === "number" && baseVars.身体.体力 === 100) baseVars.身体.体力 = s.身体.体力;
                if (isSameFloor && s.体内精液存量 && typeof s.体内精液存量 === "object") Object.assign(baseVars.体内精液存量, s.体内精液存量);
                if (s.计数 && typeof s.计数 === "object") {
                    Object.keys(s.计数).forEach(subK => {
                        if (typeof s.计数[subK] === "object" && s.计数[subK] !== null) {
                            baseVars.计数[subK] = baseVars.计数[subK] || {};
                            Object.entries(s.计数[subK]).forEach(([cKey, cVal]) => {
                                if (typeof cVal === "number") baseVars.计数[subK][cKey] = Math.max(safeNum(baseVars.计数[subK][cKey], 0), cVal);
                            });
                        } else if (typeof s.计数[subK] === "number") {
                            baseVars.计数[subK] = Math.max(safeNum(baseVars.计数[subK], 0), s.计数[subK]);
                        }
                    });
                }
            }
        }

        function detectProtagonistName(v) {
            if (v?.档案?.手动锁定真名 && safeStr(v.档案.手动锁定真名).trim()) {
                const locked = safeStr(v.档案.手动锁定真名).trim();
                v.档案.当前认知名字 = locked;
                return locked;
            }
            const ctx = safeCtx(), rawUser = safeStr(ctx?.name1, "主角").trim(), cardName = safeStr(ctx?.name2).trim();
            const chatArr = ctx?.chat || [], personaDesc = safeStr(ctx?.power_user?.persona_description);
            let detectedNewName = "", detectedOldName = "";
            const allTexts = [personaDesc, ...chatArr.slice(-10).map(m => safeStr(m?.mes))];
            for (let i = allTexts.length - 1; i >= 0; i--) {
                const mes = allTexts[i]; if (!mes) continue;
                const transMatch = mes.match(/(?:原本是|原名|前世是|从)\s*([^\s，。！？,."“”'‘’（）()]{2,8}?)\s*(?:变成了|重塑为|穿成了|夺舍了|化作了)\s*([^\s，。！？,."“”'‘’（）()的]{2,8})/);
                if (transMatch) { detectedOldName = transMatch[1].trim(); detectedNewName = transMatch[2].trim(); break; }
                const inheritMatch = mes.match(/(?:完全)?(?:变成了|重塑为|化作|继承了|穿成了|身为)\s*([^\s，。！？,."“”'‘’（）()的]{2,8}?)(?:的身体|的肉体|的名字|本人|[，。！？\s])/);
                if (inheritMatch && inheritMatch[1] && !/女生|女人|少女|妓女|暗娼|母狗|性奴|样子|模样/.test(inheritMatch[1])) { detectedNewName = inheritMatch[1].trim(); break; }
                const archMatch = mes.match(/\[\[\s*角色档案\s*\]\]\s*(?:->|→)\s*([^\s|｜\n]{2,14})/);
                if (archMatch && archMatch[1] && !archMatch[1].includes("日期")) { detectedNewName = archMatch[1].replace(/\*\*/g, "").trim(); break; }
                const nameLine = mes.match(/(?:当前认知名字|认知真名|现在名为|姓名)[：:]\s*([^\s|｜，。\n]{2,10})/);
                if (nameLine && nameLine[1]) { detectedNewName = nameLine[1].trim(); break; }
                const barMatch = mes.match(/(?:【|\[)\s*状态栏\s*[｜|:：]\s*([^】\]\n]{1,14}?)\s*(?:】|\])/);
                if (barMatch && barMatch[1] && barMatch[1].trim() !== cardName) { detectedNewName = barMatch[1].trim(); break; }
            }
            if (detectedOldName && v?.档案) v.档案.原身旧名 = detectedOldName;
            if (detectedNewName) {
                if (v?.档案) {
                    if (rawUser && rawUser !== detectedNewName && !v.档案.原身旧名) v.档案.原身旧名 = rawUser;
                    v.档案.当前认知名字 = detectedNewName;
                }
                return detectedNewName;
            }
            if (v?.档案?.当前认知名字 && safeStr(v.档案.当前认知名字).trim() && v.档案.当前认知名字 !== "主角") return safeStr(v.档案.当前认知名字).trim();
            return rawUser || "主角";
        }

        function extractClientsFromHistory(v, u, c) {
            const ctx = safeCtx(), fullText = (ctx?.chat || []).map(m => safeStr(m?.mes)).join("\n");
            const clientMap = new Map(), blockedSet = new Set(Array.isArray(v.已屏蔽恩客) ? v.已屏蔽恩客 : []);
            const rawUser = safeStr(ctx?.name1).trim(), oldSelfName = safeStr(v.档案?.原身旧名).trim(), curSelfName = safeStr(u).trim();
            const NON_HUMAN_REGEX = /^(?:\d+|主角|你|我|她|他|它|原身|前世|身体|少女|女人|女生|无|未知|旁白|系统|笔|钢笔|圆珠笔|铅笔|毛笔|画笔|马克笔|跳蛋|假阳具|按摩棒|贞操带|项圈|手铐|锁链|绳子|鞭子|皮鞭|蜡烛|口球|眼罩|衣服|上衣|内裤|底裤|胸罩|文胸|丝袜|黑丝|白丝|高跟鞋|鞋子|裙子|睡裙|床单|床垫|被子|枕头|纸巾|纸团|毛巾|花洒|水龙头|镜子|手机|相机|黄瓜|香蕉|瓶子|酒瓶|触手|道具|玩具)$/;
            const isInvalidClient = (candName) => {
                if (!candName) return true;
                const n = String(candName).trim();
                if (n.length < 2 || n.length > 12 || blockedSet.has(n) || n === curSelfName || (oldSelfName && n === oldSelfName) || NON_HUMAN_REGEX.test(n)) return true;
                if (/(?:笔|棒|球|环|链|衣|裤|裙|袜|鞋|帽|巾|床|桌|椅|门|窗|灯|水|液|药|剂|器|具|穴|乳|胸|臀|腿|足|口|唇|手|指)$/.test(n) && !/(?:男人|少爷|老板|大师|师兄|师尊|徒弟|老公|丈夫|学长|同学|老师)/.test(n)) return true;
                if (new RegExp(`(?:原名|原本是|前世是|从)\\s*${n}\\s*(?:变成|穿成|重塑|化作)`).test(fullText)) return true;
                return false;
            };
            const creampie = safeNum(v.计数?.射精?.内射), vagCnt = safeNum(v.计数?.性交?.小穴), mouthCnt = safeNum(v.计数?.性交?.口), wombMl = safeNum(v.体内精液存量?.子宫毫升);
            const totalSex = vagCnt + mouthCnt + creampie + safeNum(v.计数?.性交?.屁眼);
            const nameHash = (str) => { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100; return h; };
            const upsertClient = (name, roleTag, cockDesc, statusTag, contribPts, dnaShare, detailDesc, thoughtArr) => {
                if (isInvalidClient(name)) return;
                const cVal = Math.min(100, Math.max(5, Math.round(contribPts)));
                clientMap.set(name, { name, roleTag, cockDesc, statusTag, val: cVal, dnaShare, detailDesc, thoughtStr: Array.isArray(thoughtArr) ? pickStageThought(v, thoughtArr, cVal) : thoughtArr });
            };
            if (v.恩客图鉴 && typeof v.恩客图鉴 === "object") {
                const entries = Object.entries(v.恩客图鉴).filter(([k]) => !isInvalidClient(k));
                entries.forEach(([k, val]) => {
                    const descStr = typeof val === "object" ? JSON.stringify(val) : String(val);
                    const score = Math.min(100, Math.max(15, 28 + vagCnt * 1.8 + creampie * 2.5 + ((nameHash(k) % 18) - 6)));
                    const share = wombMl > 0 ? Math.max(10, Math.round(100 / Math.max(1, entries.length))) : 0;
                    upsertClient(k, "专属调教恩客", "雄性阳具", "已建立肉体烙印", score, share, `【🍆 恩客档案】：${k}\n【📊 肉体崩坏改造记录】：${descStr}`,
                        [`想到【${k}】，我心里还是保持着戒备与距离感。`,`身体已经渐渐记住了【${k}】的气息，面对他时很难完全平静💦。`,`每次回想起与【${k}】的接触，被撑开过的粘膜深处就会泛起一丝酸麻感😳💦。`,`一闻到【${k}】的气味，合不拢的肉穴就会不自觉地发软淌水🥵💦！`,`已经彻底被【${k}】操成他专属的形状了，离开他的粗暴玩弄就活不下去🥵💦❤️！`,`啊嘿♡……全身孔穴都已经被【${k}】彻底操烂改造成专属排泄便池啦🥵💦❤️❤️！`]);
                });
            }
            if (clientMap.size === 0 && (totalSex > 0 || wombMl > 0 || safeNum(v.核心数值?.淫乱恶堕) >= 25)) {
                const autoCand = (rawUser && rawUser !== curSelfName) ? rawUser : (c && c !== curSelfName && c !== "无角色卡" ? c : "");
                if (autoCand && !isInvalidClient(autoCand)) {
                    const score = Math.min(100, Math.max(20, 25 + vagCnt * 2 + creampie * 3 + mouthCnt * 1.5));
                    upsertClient(autoCand, "首要支配饲主", "滚烫粗大肉棒", "身心深度支配", score, wombMl > 0 ? 100 : 0,
                        `【🍆 恩客档案】：${autoCand}\n【📊 肉体崩坏改造记录】：当前剧情中的首要支配者，累计贯穿小穴 ${vagCnt} 次、口交 ${mouthCnt} 次、内射 ${creampie} 次。`,
                        [`面对【${autoCand}】，我心里依然保留着最后的矜持防线。`,`身体已经开始适应【${autoCand}】的温度与摆弄了💦。`,`每次被【${autoCand}】触碰，熟稔的肉壁都会本能地收缩迎合😳💦。`,`只要【${autoCand}】一靠近，我的骚穴和嘴巴就会不自觉地发痒流涎🥵💦！`,`从里到外都已经被【${autoCand}】彻底开发成专属肉便器了🥵💦❤️！`,`啊嘿♡……这辈子都是【${autoCand}】大人专属的100%崩坏排泄肉坑与灌精苗床啦🥵💦❤️❤️！`]);
                }
            }
            return Array.from(clientMap.values());
        }

        function varsToCompactSummary(userName, v) {
            const dev = computeAllOrganDevelopments(v), sp = v.体内精液存量 || {}, c = v.计数 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {};
            const pMode = RUIN_PERSONA_MODES[userSettings.personaMode || "evolution"]?.label || "进化树";
            return `${userName}[模式:${pMode}]: 体力=${safeNum(v.身体?.体力, 100)}%, 恶堕=${safeNum(v.核心数值?.淫乱恶堕)}%, 好感=${safeNum(v.核心数值?.对肉棒好感度)}%, 性欲=${safeNum(v.核心数值?.性欲程度)}%, 羞耻=${safeNum(v.精神与心理?.羞耻度, 100)}%, 服从=${safeNum(v.精神与心理?.服从度)}%, 快感=${safeNum(v.精神与心理?.快感累积)}% | ` +
                   `六孔崩坏: 口=${dev.mouthObj.val}%, 乳=${dev.chestObj.val}%, 穴=${dev.vagObj.val}%, 宫=${dev.wombObj.val}%, 蒂尿=${dev.clitObj.val}%, 菊=${dev.analObj.val}% | ` +
                   `储精: 宫=${safeNum(sp.子宫毫升)}ml, 穴=${safeNum(sp.小穴毫升)}ml, 胃=${safeNum(sp.口内毫升)}ml, 肠=${safeNum(sp.屁眼毫升)}ml | ` +
                   `总账: 穴=${safeNum(c.性交?.小穴)}, 内射=${safeNum(c.射精?.内射)}, 口=${safeNum(c.性交?.口)}, 菊=${safeNum(c.性交?.屁眼)}, 高潮=${safeNum(c.高潮?.总数)}, 失禁=${safeNum(c.失控?.失禁)} | ` +
                   `标记: 痕=${safeStr(mark.体表痕迹, "无")}, 纹=${safeStr(mark.淫纹与刻印, "无")}, 具=${safeStr(prop.体内道具, "无")}`;
        }

        function buildReverseBodyEnforcementRules(u, v) {
            if (!userSettings.injectReversePrompt) return "";
            const dev = computeAllOrganDevelopments(v), sp = v.体内精液存量 || {}, totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
            const corr = safeNum(v.核心数值?.淫乱恶堕), mode = userSettings.personaMode || "evolution", rules = [];
            if (mode === "despair") rules.push(`- 【💧彻底绝望型人格】：正文中${u}面对侵犯都处于绝望哭泣、求饶与失禁哀鸣状态！`);
            else if (mode === "addicted") rules.push(`- 【🥵沉沦变态型人格】：正文中${u}会主动掰开肉洞乞求更粗暴的灌精与改造！`);
            else if (mode === "contrast") rules.push(userSettings.contrastInnerActive ? `- 【🎭私下母畜态】：${u}完全卸下伪装，极度饥渴下流！` : `- 【🎭表面伪装态】：${u}表面强装端庄，裙底实则湿透漏精暗颤！`);

            if (dev.totalLedgerCount === 0 && totalMl === 0 && corr < 15 && dev.all6OrganAvg === 0 && mode === "evolution") {
                rules.push(`- 【🌸完好清白状态】：当前${u}器官完好，若无实质侵犯须保持端庄矜持。`);
            } else {
                if (dev.vagObj.tier >= 4) rules.push(`- 【💀小穴Lv.${dev.vagObj.tier + 1}】：穴口松弛外翻合不拢，走动时漏精吸气，严禁写紧致如处女！`);
                if (dev.wombObj.tier >= 4) rules.push(`- 【💀子宫Lv.${dev.wombObj.tier + 1}】：宫颈重度下垂外翻至穴口，随时张口索精！`);
                if (dev.clitObj.tier >= 4) rules.push(`- 【💀尿道Lv.${dev.clitObj.tier + 1}】：阴蒂肥大勃起，稍受刺激必伴随失禁漏尿与潮吹！`);
                if (dev.analObj.tier >= 4) rules.push(`- 【💀后庭Lv.${dev.analObj.tier + 1}】：肛门括约肌松弛不合、直肠粘膜外翻！`);
                if (totalMl > 0) rules.push(`- 【🥛体内储精${totalMl}ml】：走动或站立须写出下腹坠胀与白浊滴淌细节。`);
            }
            if (userSettings.customExtraPrompt && safeStr(userSettings.customExtraPrompt).trim()) {
                rules.push(`- 【🛠️自定义铁律】：${safeStr(userSettings.customExtraPrompt).trim().replace(/{user}/g, u)}`);
            }
            return rules.length ? `\n【🚨状态栏2.0一致性铁律】\n${rules.join("\n")}\n` : "";
        }

        function buildFullSystemPrompt(userName, currentVars) {
            const compactSnap = varsToCompactSummary(userName, currentVars), reverseRules = buildReverseBodyEnforcementRules(userName, currentVars);
            const c = currentVars.计数 || {}, sp = currentVars.体内精液存量 || {}, openTag = "<UpdateVariable>", closeTag = "</UpdateVariable>";
            if (userSettings.compactPromptMode) {
                return `\n【状态快照】${compactSnap}${reverseRules}\n【后台变量更新】正文最末尾仅输出有变化的项（放入 ${openTag}...${closeTag}）：\n${openTag}\n_.set('${userName}.身体.体力', ${safeNum(currentVars.身体?.体力, 100)});\n_.set('${userName}.核心数值.性欲程度', ${safeNum(currentVars.核心数值?.性欲程度)});\n_.set('${userName}.精神与心理.快感累积', ${safeNum(currentVars.精神与心理?.快感累积)});\n_.set('${userName}.计数.性交.小穴', ${safeNum(c.性交?.小穴)});\n_.set('${userName}.计数.射精.内射', ${safeNum(c.射精?.内射)});\n_.set('${userName}.体内精液存量.子宫毫升', ${safeNum(sp.子宫毫升)});\n_.set('${userName}.实况.当前姿势', '简短姿势');\n_.set('${userName}.实况.内心独白', '第一人称心声');\n${closeTag}`;
            }
            const diff = getDifficultyProfile(), mark = currentVars.痕迹与标记 || {}, prop = currentVars.体内道具与权限 || {};
            return `\n【⚠️ 正文字数与细节最高铁律】：重心是小说正文，严禁为输出变量而缩写正文！\n【当前角色状态快照（难度：${diff.mult}x｜身份：${detectRealCharacterIdentity(currentVars)}）】\n${compactSnap}${reverseRules}\n【🔥状态变量后台静默更新规范】全篇最末尾输出唯一闭合的 ${openTag}...${closeTag}：\n${openTag}\n_.set('${userName}.身体.体力', ${safeNum(currentVars.身体?.体力, 100)});\n_.set('${userName}.核心数值.性欲程度', ${safeNum(currentVars.核心数值?.性欲程度)});\n_.set('${userName}.精神与心理.快感累积', ${safeNum(currentVars.精神与心理?.快感累积)});\n_.set('${userName}.计数.性交.口', ${safeNum(c.性交?.口)});\n_.set('${userName}.计数.性交.小穴', ${safeNum(c.性交?.小穴)});\n_.set('${userName}.计数.性交.屁眼', ${safeNum(c.性交?.屁眼)});\n_.set('${userName}.计数.射精.内射', ${safeNum(c.射精?.内射)});\n_.set('${userName}.计数.精液摄入.吞精次数', ${safeNum(c.精液摄入?.吞精次数)});\n_.set('${userName}.计数.高潮.总数', ${safeNum(c.高潮?.总数)});\n_.set('${userName}.计数.失控.喷潮', ${safeNum(c.失控?.喷潮)});\n_.set('${userName}.计数.失控.失禁', ${safeNum(c.失控?.失禁)});\n_.set('${userName}.体内精液存量.口内毫升', ${safeNum(sp.口内毫升)});\n_.set('${userName}.体内精液存量.小穴毫升', ${safeNum(sp.小穴毫升)});\n_.set('${userName}.体内精液存量.子宫毫升', ${safeNum(sp.子宫毫升)});\n_.set('${userName}.体内精液存量.屁眼毫升', ${safeNum(sp.屁眼毫升)});\n_.set('${userName}.痕迹与标记.体表痕迹', '${safeStr(mark.体表痕迹, "无")}');\n_.set('${userName}.痕迹与标记.淫纹与刻印', '${safeStr(mark.淫纹与刻印, "无")}');\n_.set('${userName}.痕迹与标记.穿刺与环饰', '${safeStr(mark.穿刺与环饰, "无")}');\n_.set('${userName}.体内道具与权限.体内道具', '${safeStr(prop.体内道具, "无")}');\n_.set('${userName}.实况.当前姿势', '简短概括当前姿势');\n_.set('${userName}.实况.内心独白', '符合当前崩坏阶位的第一人称心声');\n${closeTag}`;
        }

        function buildDanbooruImageBlock(item, curStageIdx, u) {
            const key = item.editKey || "custom", stageNames = ["初绽完好", "初步驯化", "深度开发", "括约肌松弛", "重度畸变", "彻底崩坏"];
            const idx = Math.min(5, Math.max(0, curStageIdx - 1)), stgTag = stageNames[idx];
            const presets = {
                "骚口实况": [
                    { zh: "微距莹润红唇微启与晶莹拉丝津液", think: "第一阶段初始状态，双唇娇嫩饱满微启，舌尖轻抵下唇，牵出晶莹唾液丝线。", tag: "macro shot, mouth and lips focus, parted glossy pink lips, pink tongue tip, clear saliva strings", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "微距红肿唇瓣外翻与浓稠白浊挂丝", think: "第二阶段初步驯化，双唇微肿充血，舌头伸出承接黏稠乳白精液顺下巴滑落。", tag: "macro shot, open mouth and tongue focus, swollen red lips, protruding wet tongue, thick white cum on tongue", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "微距深喉扩口悬雍垂颤动与白沫满溢", think: "第三阶段深度开发，口腔大幅撑开，舌头压平，深处悬雍垂与充血喉口完全暴露，白沫咕嘟冒泡。", tag: "macro shot, wide open mouth focus, deep throat view, flattened tongue, visible uvula, frothy cum pooling in throat", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "微距咽喉肉环松弛洞开与澄黄圣水漩涡", think: "第四阶段括约肌松弛，咽喉深处呈圆筒状松弛肉穴，澄黄尿液与白浊在喉口交融满溢。", tag: "macro shot, gaping mouth and relaxed throat hole focus, numb everted lips, yellow urine and white cum swirling in deep throat", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "微距下颚半脱臼软肉外翻与浓稠浊液喷涌", think: "第五阶段重度畸变，下颚半脱臼无法闭拢，紫红唇肉外翻，食道反流喷涌混杂黄尿的白沫。", tag: "macro shot, dislocated gaping mouth focus, swollen purple-red everted lips, limp tongue hanging out, regurgitating frothy cum and yellow fluid", uc: "eyes, full face, upper body, closed mouth" },
                    { zh: "彻底崩坏微距脱臼漏斗状肉洞与腐熟白浊泡沫满溢", think: "第六阶段终极崩坏，下颚永久半脱臼洞开，咽喉扩张成漏斗状排泄口器，大量混杂黄色尿液与浓稠精液的白沫喷涌。", tag: "macro shot, corrupted gaping mouth focus, dilated throat hole, permanently gaping dislocated jaw, bruised swollen everted lips, paralyzed limp tongue hanging to side, overflowing thick cum and yellow fluid, completely ruined oral meat hole", uc: "eyes, forehead, full face, head, hair, upper body, breasts, boy, male, penis" }
                ],
                "小穴实况": [
                    { zh: "微距紧闭粉嫩花唇与晶莹露珠", think: "第一阶段完好处子，两瓣花唇粉嫩紧闭，干爽洁净。", tag: "macro shot, pussy focus, tight closed pink labia, virgin pussy, clean skin", uc: "face, upper body, gaping pussy" },
                    { zh: "微距初破充血花唇微张与拉丝爱液", think: "第二阶段初破红肿，外阴软肉充血微张，透明爱液牵丝滑落。", tag: "macro shot, pussy focus, slightly parted red swollen labia, clear vaginal fluids, wet string", uc: "face, upper body, closed pussy" },
                    { zh: "微距肥厚外翻黑木耳与白浊咕啾涌出", think: "第三阶段熟稔外翻，大小阴唇肥厚外翻且色素沉淀，浓白精液从穴口涌出。", tag: "macro shot, pussy focus, dark swollen everted labia minora, thick white cum leaking from vagina", uc: "face, upper body, tight pussy" },
                    { zh: "微距括约肌松弛两指洞开与白浆漏淌", think: "第四阶段括约肌松弛，阴道口撑开无法闭合，白浊混着淫水不断漏出。", tag: "macro shot, gaping pussy focus, relaxed open vaginal hole, visible red vaginal interior, overflowing cum", uc: "face, upper body, closed pussy" },
                    { zh: "微距内壁肉褶脱垂外翻与失禁漏精壶", think: "第五阶段肉壁脱垂，阴道内壁充血肉褶向外翻出穴口。", tag: "macro shot, ruined gaping pussy focus, prolapsed vaginal mucosal folds, bruised everted labia, heavy cum and urine overflow", uc: "face, upper body, closed pussy" },
                    { zh: "彻底崩坏微距外翻紫红烂肉洞与腐熟白浊黄尿满溢", think: "第六阶段终极崩坏，阴唇紫红肿胀外翻，穴口洞开且宫颈下垂外露，混杂黄尿与白沫不断喷涌。", tag: "macro shot, corrupted gaping pussy focus, dilated vaginal hole, permanently gaping ruined pussy, bruised swollen everted labia, prolapsed visible cervix deep inside, overflowing thick cum and yellow urine foam, completely ruined meat hole", uc: "face, head, eyes, upper body, breasts, legs, feet, boy, male, penis" }
                ],
                "子宫实况": [
                    { zh: "微距内窥紧闭针尖宫颈口与纯净宫腔", think: "第一阶段紧闭处子，宫颈口紧密闭合。", tag: "macro shot, internal vaginal view, tight closed cervix, clean pink mucosa", uc: "face, external view" },
                    { zh: "微距内窥充血红肿宫颈口与微量白浊", think: "第二阶段宫口充血微松，表面挂着少许精液。", tag: "macro shot, internal cervix focus, red swollen cervix, cum on cervix", uc: "face, external view" },
                    { zh: "微距内窥扩张软肉环宫口与锁精吞吸", think: "第三阶段宫口扩张锁精，宫颈口被顶开呈环形吞吸白浊。", tag: "macro shot, dilated cervix focus, open cervical os, thick cum pouring into womb", uc: "face, external view" },
                    { zh: "微距内窥下坠松弛宫口与浓精倒流", think: "第四阶段宫腔肥大下坠，宫颈口常年微张无法闭合。", tag: "macro shot, gaping cervix focus, relaxed open womb entrance, overflowing semen", uc: "face, external view" },
                    { zh: "微距重度脱垂至穴口边缘的紫红宫颈口", think: "第五阶段宫颈重度脱垂至外阴边缘。", tag: "macro shot, uterine prolapse focus, swollen purple-red cervix protruding near vaginal opening, dripping cum", uc: "face, upper body" },
                    { zh: "彻底崩坏微距完全掉出体外的外翻死肉宫口喷涌腐精", think: "第六阶段终极崩坏，紫黑色宫颈口彻底掉出体外，喷涌腐熟浓精与黄水。", tag: "macro shot, extreme cervical prolapse focus, bruised purple-black cervix hanging outside gaping pussy, wide open cervical hole, bubbling thick yellow fluid and white cum foam", uc: "face, head, upper body, breasts" }
                ],
                "胸部实况": [
                    { zh: "微距挺拔粉嫩处乳与小巧乳尖", think: "第一阶段娇嫩处乳，乳晕粉嫩紧致。", tag: "macro shot, breasts focus, perky breasts, small pink nipples, clean skin", uc: "face, lower body" },
                    { zh: "微距充血肿大乳头与晶莹涎液", think: "第二阶段乳尖肥大，乳头充血硬挺。", tag: "macro shot, nipple focus, swollen erect pink nipples, wet saliva on breasts", uc: "face, lower body" },
                    { zh: "微距黑紫扩张乳晕与渗奶乳孔", think: "第三阶段乳晕扩张色素沉淀，乳尖渗出乳滴。", tag: "macro shot, dark wide areola, puffy nipples, milk droplets leaking", uc: "face, lower body" },
                    { zh: "微距乳腺失控飙奶与青筋乳房", think: "第四阶段乳腺失控，两条奶柱喷涌而出。", tag: "macro shot, lactating breasts focus, squirting breast milk, visible veins on breasts", uc: "face, lower body" },
                    { zh: "微距硕大下垂巨乳奶袋与白浊混流", think: "第五阶段下垂巨乳奶袋，乳孔常年漏奶。", tag: "macro shot, huge sagging lactating breasts, dilated nipple holes, heavy milk and cum dripping", uc: "face, lower body" },
                    { zh: "彻底崩坏微距紫黑下垂泌乳肉囊与血乳狂喷", think: "第六阶段终极崩坏，紫黑泌乳肉囊乳孔大开狂喷浊乳。", tag: "macro shot, corrupted sagging udder breasts focus, bruised purple-black areola, gaping dilated nipple holes, gushing thick yellow milk and foam", uc: "face, head, lower body" }
                ],
                "阴蒂尿道": [
                    { zh: "微距隐没粉嫩阴蒂包皮与紧闭尿道", think: "第一阶段完好隐没。", tag: "macro shot, clitoris focus, small hooded pink clit, tight urethral opening", uc: "face, upper body" },
                    { zh: "微距充血外露红肿阴蒂", think: "第二阶段充血外露。", tag: "macro shot, swollen erect clitoris, glistening wet skin", uc: "face, upper body" },
                    { zh: "微距花生米大小肥大勃起阴蒂", think: "第三阶段阴蒂异常肥大勃起。", tag: "macro shot, enlarged hyper clitoris, throbbing red clit, wet fluids", uc: "face, upper body" },
                    { zh: "微距扩张尿道口与失控漏尿水柱", think: "第四阶段尿道松弛漏尿。", tag: "macro shot, dilated urethral meatus, leaking yellow urine stream, enlarged clit", uc: "face, upper body" },
                    { zh: "微距肉棒化畸变阴蒂与狂喷潮吹失禁", think: "第五阶段阴蒂肉棒化伴随失禁狂喷。", tag: "macro shot, dicklet clitoris hypertrophy, gaping urethra hole, gushing female ejaculation and urine", uc: "face, upper body" },
                    { zh: "彻底崩坏微距坏死洞开尿道肉坑与24h失禁黄尿冒泡", think: "第六阶段终极崩坏，阴蒂肿大糜烂，尿道括约肌坏死洞开，黄尿混杂白沫涌出。", tag: "macro shot, extreme clitoris hypertrophy, permanently gaping ruined urethral hole, overflowing yellow urine foam and cum", uc: "face, head, upper body" }
                ],
                "屁眼实况": [
                    { zh: "微距紧闭粉嫩菊蕾褶皱", think: "第一阶段紧闭完好。", tag: "macro shot, anus focus, tight closed pink anus, clean skin", uc: "face, upper body" },
                    { zh: "微距充血红肿菊口与掌印臀肉", think: "第二阶段红肿微张。", tag: "macro shot, swollen red anus, spanked red ass cheeks, wet lube", uc: "face, upper body" },
                    { zh: "微距褶皱磨平松弛后庭与白浊渗出", think: "第三阶段褶皱磨平松弛。", tag: "macro shot, relaxed smooth anal ring, cum leaking from anus", uc: "face, upper body" },
                    { zh: "微距圆洞状不合肛口与内壁红肉", think: "第四阶段后庭空洞不合。", tag: "macro shot, gaping anus focus, open anal hole, visible red rectum interior, overflowing cum", uc: "face, upper body" },
                    { zh: "微距直肠粘膜外翻轻度脱肛肉环", think: "第五阶段轻度脱肛翻肉。", tag: "macro shot, anal prolapse focus, everted red rectal mucosa ring, dripping thick cum", uc: "face, upper body" },
                    { zh: "彻底崩坏微距重度脱肛5厘米烂玫瑰肉管与浊液狂漏", think: "第六阶段终极崩坏，大段紫红糜烂直肠肉管永久翻出体外，白浊与黄水狂漏。", tag: "macro shot, extreme anal prolapse focus, long protruding bruised red rectal tube hanging outside, gaping ruined anal hole, overflowing frothy cum and yellow fluid", uc: "face, head, upper body" }
                ]
            };
            const chosen = (presets[key] && presets[key][idx]) || {
                zh: `${item.cleanTitle || key}第${curStageIdx}阶段${stgTag}微距特写`,
                think: `第${curStageIdx}阶段（${stgTag}），展现${u}的${item.cleanTitle || key}在当前崩坏度下的极致微距特写细节。`,
                tag: `macro shot, extreme close-up, ${curStageIdx >= 5 ? "corrupted gaping meat hole, bruised swollen everted mucosa, overflowing thick cum and yellow fluid" : "erotic close-up, wet skin, glistening fluids"}`,
                uc: "face, upper body, zoomed out, text, watermark"
            };
            return `第${["一","二","三","四","五","六"][idx]}阶段：${key}_${curStageIdx}（${stgTag}）\n<image>\n[${chosen.zh}]\n<image_think>\n${chosen.think}\n</image_think>\nimage###Scene:NSFW, 1girl, solo, 1.5::extreme close-up, ${chosen.tag}, filling the frame::, straight-on, dark erotic lighting;\nChar1:1.5::${u}::, pale sweaty skin, 1.8::${chosen.tag}::|centers:C3;\nChar1 UC:1.5::${chosen.uc}, multiple views, zoomed out, text, watermark::;###\n</image>`;
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
                    if (!hideBar) badges.unshift(`<span style="background:rgba(249,226,175,0.15);border:1px solid rgba(249,226,175,0.42);color:#f9e2af;padding:1px 6px;border-radius:6px;font-size:11px;font-family:Consolas,monospace;font-weight:bold;white-space:nowrap;">${n}</span>`);
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
                            <div class="st-bar-fill" style="width:${pct}%;height:100%;background:${st.grad};border-radius:99px;box-shadow:${st.glow};transition:width 0.35s ease;"></div>
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
                            <div class="st-bar-fill" style="width:${subPct}%;height:100%;background:${subSt.grad};border-radius:99px;box-shadow:${subSt.glow};transition:width 0.35s ease;"></div>
                        </div>
                    </div>`;
                }
                barHTML += `</div>`;
            }
            const finalPctForImg = stagePctOverride !== null ? stagePctOverride : pct;
            return { keyHTML, barHTML, cleanTitle, pct: finalPctForImg, hasStageBar: (!hideBar && barTheme !== "none" && pct !== null) };
        }

        function extractDynamicContext(u, c) {
            const ctx = safeCtx(), chatArr = ctx?.chat || [], charDesc = safeStr(ctx?.characters?.[ctx?.characterId]?.description), personaDesc = safeStr(ctx?.power_user?.persona_description);
            const res = { identity: "", bodyDesc: "", thought: "", pose: "", mouth: "", chest: "", vag: "", womb: "", anal: "", headWear: "", neckWear: "", braWear: "", topWear: "", pantyWear: "", bottomWear: "", sockWear: "", shoeWear: "" };
            const endIdx = viewingHistoryFloor !== null ? Math.min(chatArr.length, viewingHistoryFloor + 1) : chatArr.length;
            const recent = chatArr.slice(Math.max(0, endIdx - 6), endIdx), allSents = [];
            for (let i = recent.length - 1; i >= 0; i--) {
                const raw = safeStr(recent[i]?.mes).replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>/gi, "");
                if (!raw) continue;
                const cleanBody = raw.split(/【\s*状态栏|<UpdateVariable>|<options>/i)[0] || raw;
                if (!res.thought) {
                    const im = [...cleanBody.matchAll(/\*([^*\\n]{12,500})\*/g)].map(m => m[1].trim());
                    if (im.length) res.thought = im[im.length - 1];
                }
                allSents.push(...cleanBody.split(/[。！？；\n\r]+/).map(s => s.replace(/\*[^*]*\*/g, "").replace(/<\/?[a-z]+>/gi, "").trim()).filter(s => s.length > 4));
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

        function getDynamicMetricDetail(type, v, u) {
            const ovr = v.按钮详情?.[type];
            const map = {
                cockLove: { val: safeNum(v.核心数值?.对肉棒好感度), rev: false, st: ["抗拒戒备","粘膜适应","空虚渴求","跪舔崇拜","断根戒断","脑干阳具寄生"], d: [
                    `【🔬 阳具好感与神经回路（Lv.1 完好戒备）】：${u}神经与理智完好，对雄性阳具保持着强烈的警惕与排斥。\n💭【${u}的实时心声】：“*我必须离那种粗鲁肮脏的雄性东西远一点，绝不能让自己的清白受到半点玷污。*”`,
                    `【🔬 阳具好感与神经回路（Lv.2 粘膜适应）】：粘膜在反复摩擦中记住了阳具的轮廓与热度，排斥反应减退为麻木配合。\n💭【${u}的实时心声】：“*虽然心里还是觉得难为情，但身体粘膜似乎已经渐渐适应了那种滚烫异物的温度💦……*”`,
                    `【🔬 阳具好感与神经回路（Lv.3 空虚渴求）】：阴道与口腔神经已在抽插中食髓知味，空虚时内壁会本能泛起酸痒。\n💭【${u}的实时心声】：“*小穴里面隐隐有些发空发痒，用手指根本比不上被滚烫肉棒塞满时的充实感呀😳💦……*”`,
                    `【🔬 阳具好感与神经回路（Lv.4 跪舔崇拜）】：大脑快感中枢已被阳具驯化，闻到腥膻味便会双腿发软、唾液泛滥。\n💭【${u}的实时心声】：“*浓烈的雄性腥膻味一冲进鼻腔，下面就已经湿透了，好想快点跪下来用嘴和骚穴服侍大肉棒呀🥵💦！*”`,
                    `【🔬 阳具好感与神经回路（Lv.5 断根戒断）】：重度阳具成瘾畸变，脱离肉棒超过半小时即引发剧烈戒断发抖。\n💭【${u}的实时心声】：“*呜汪♡……没有大肉棒塞着全身骨头都像有蚂蚁在咬一样难受，求求快插进来救救发瘾的母狗吧🥵💦❤️！*”`,
                    `【💀 第六阶段·脑干阳具寄生畸变（100% 彻底崩坏）】：大脑视觉与嗅觉中枢彻底崩坏，眼中除了勃起肉棒外已无法识别任何人类面孔！脱离肉棒即刻引发翻白眼自残抽搐！\n💭【${u}的实时心声】：“*啊嘿♡……脑干里全都长满大肉棒的形状了，请把肉棒焊死在我的烂肉洞里吧🥵💦❤️❤️！*”`
                ]},
                lust: { val: safeNum(v.核心数值?.性欲程度), rev: false, st: ["清心克制","春情微燥","欲火焚身","重度发骚","狂暴发情","下丘脑发情烧毁"], d: [
                    `【🔬 情欲与内分泌实况（Lv.1 清心完好）】：下丘脑与内分泌系统完好平稳，心神清澈冷静。\n💭【${u}的实时心声】：“*现在心境很平静，身体没有任何奇怪的燥热感。*”`,
                    `【🔬 情欲与内分泌实况（Lv.2 春情微燥）】：体内雌激素微升，小腹深处泛起淡淡温热。\n💭【${u}的实时心声】：“*唔……不知怎么身体稍微有些发热，连呼吸都变得比平时温热了一点💦。*”`,
                    `【🔬 情欲与内分泌实况（Lv.3 欲火焚身）】：情欲翻涌，乳尖发硬充血，私处不自觉分泌出湿润春水。\n💭【${u}的实时心声】：“*身体烫得厉害，两腿之间已经湿漉漉地黏在一起了😳💦！*”`,
                    `【🔬 情欲与内分泌实况（Lv.4 重度发骚）】：内分泌过载，双腿本能交叠磨蹭外翻阴唇，眼神迷离拉丝。\n💭【${u}的实时心声】：“*哈啊……淫水根本止不住地往外淌，满脑子都想着被粗暴地按住灭火呀🥵💦！*”`,
                    `【🔬 情欲与内分泌实况（Lv.5 狂暴发情）】：理智被情欲吞没，三穴不断涌出滚烫粘液主动撅臀求配。\n💭【${u}的实时心声】：“*啊啊♡……发情一秒钟都停不下来了，快过来把我按在地上狠狠干烂吧🥵💦❤️！*”`,
                    `【💀 第六阶段·下丘脑发情烧毁畸变（100% 彻底崩坏）】：下丘脑因长期极限催情彻底烧毁坏死！体温常年40℃，化作不交配到死就不会停歇的发情肉偶！\n💭【${u}的实时心声】：“*啊嘿♡……脑子里的发情开关彻底烧化坏死了，不睡觉不吃饭也要永远挨操交配呀🥵💦❤️❤️！*”`
                ]},
                corr: { val: safeNum(v.核心数值?.淫乱恶堕), rev: false, st: ["完好清白","初度染尘","食髓知味","放荡娼妇","公用精盆","彻底崩坏肉坑"], d: [
                    `【🔬 道德人格与尊严实况（Lv.1 完好清白）】：人格与道德尊严完好无损，绝不接受任何下流亵渎。\n💭【${u}的实时心声】：“*无论处境如何变化，我都绝不会放弃自己的尊严与清白底线。*”`,
                    `【🔬 道德人格与尊严实况（Lv.2 初度染尘）】：矜持防线出现裂痕，学会了用被动顺从来应对局面。\n💭【${u}的实时心声】：“*虽然心里还是觉得有些屈辱，但似乎已经不像最开始那样剧烈抗拒了💦……*”`,
                    `【🔬 道德人格与尊严实况（Lv.3 食髓知味）】：身体对情事已产生熟练肌肉记忆，道德负罪感大幅消退。\n💭【${u}的实时心声】：“*身体早就习惯了男人的温度与粗鲁摆弄，甚至会忍不住主动夹紧迎合呢😳💦。*”`,
                    `【🔬 道德人格与尊严实况（Lv.4 放荡娼妇）】：尊严坍塌，彻底接纳并享受放荡欢愉，以用肉体榨干男人为乐。\n💭【${u}的实时心声】：“*什么清白体面全都是多余的，哪有张开双腿享受肉棒抽插和内射来得快活呀🥵💦！*”`,
                    `【🔬 道德人格与尊严实况（Lv.5 公用精盆）】：完全将自己视作供男人发泄兽欲的公用排泄精盆。\n💭【${u}的实时心声】：“*呜汪♡……我就是一件只要张开腿就能随便插进来射精的公用精盆，请尽情使用我吧🥵💦❤️！*”`,
                    `【💀 第六阶段·人格粉碎排泄肉坑（100% 彻底崩坏）】：人类自尊与人格回路100%坏死清零！只是一块接精液与秽物的烂肉痰盂！\n💭【${u}的实时心声】：“*啊嘿♡……人类的人格已经彻底死掉啦，请把臭肉洞彻底操烂报废吧🥵💦❤️❤️！*”`
                ]},
                shame: { val: safeNum(v.精神与心理?.羞耻度, 100), rev: true, st: ["羞愤自持","耳根滚烫","习以为常","敞腿任看","羞耻全灭","羞耻神经坏死"], d: [
                    `【🔬 羞耻神经防线（Lv.1 完好自持）】：羞耻心完好极强，极度注重衣着得体与身体隐私。\n💭【${u}的实时心声】：“*必须注意整理好衣襟与姿态，绝不能让人看到丝毫不雅的模样。*”`,
                    `【🔬 羞耻神经防线（Lv.2 耳根滚烫）】：在亲密接触或暴露下耳根滚烫，遮挡动作迟疑无力。\n💭【${u}的实时心声】：“*脸颊烫得厉害……被人用那种灼热的视线盯着看，连手脚都不知道该往哪儿放了😳💦。*”`,
                    `【🔬 羞耻神经防线（Lv.3 习以为常）】：羞耻感已被磨平大半，赤裸清理私处时已能保持平静麻木。\n💭【${u}的实时心声】：“*光着身子走动或者清理私处，现在的我早已经习以为常了💦。*”`,
                    `【🔬 羞耻神经防线（Lv.4 敞腿任看）】：廉耻心瓦解，被人视奸红肿私处时非但不遮掩反而兴奋分泌爱液。\n💭【${u}的实时心声】：“*就算现在被人撞见我一丝不挂的下流模样，我也会直接敞开双腿让他看个够哟🥵💦！*”`,
                    `【🔬 羞耻神经防线（Lv.5 羞耻全灭）】：羞耻回路逆转为强烈催情剂，渴望当众展示外翻烂穴。\n💭【${u}的实时心声】：“*啊啊♡……快让所有人都来看看这具刚被玩弄过、还在往外漏精滴尿的骚身体吧🥵💦❤️！*”`,
                    `【💀 第六阶段·羞耻神经彻底坏死（0/100 彻底崩坏）】：掌管廉耻的神经区域100%萎缩坏死！只有当众敞开烂穴潮吹喷尿才能刺激脑干产生高潮！\n💭【${u}的实时心声】：“*啊嘿♡……羞耻是什么早就忘光啦！看母猪当众喷尿失禁高潮吧🥵💦❤️❤️！*”`
                ]},
                obey: { val: safeNum(v.精神与心理?.服从度), rev: false, st: ["孤高自主","被动妥协","温顺配合","摇尾乞怜","绝对盲从","前额叶切除木偶"], d: [
                    `【🔬 自由意志与服从实况（Lv.1 完好自主）】：自我意志独立坚定，绝不轻易屈服。\n💭【${u}的实时心声】：“*我的身体与意志只属于我自己，任何人都休想随便摆布我。*”`,
                    `【🔬 自由意志与服从实况（Lv.2 被动妥协）】：在局势压迫下学会低头妥协，被动配合。\n💭【${u}的实时心声】：“*人在屋檐下不得不低头……眼下还是先顺从配合吧💦。*”`,
                    `【🔬 自由意志与服从实况（Lv.3 温顺配合）】：已形成温顺配合的肌肉记忆，面对折腾十分听话。\n💭【${u}的实时心声】：“*乖乖听话把身体收拾干净准备接下来的安排，身体已经完全习惯顺从了😳💦。*”`,
                    `【🔬 自由意志与服从实况（Lv.4 摇尾乞怜）】：反抗意志被彻底驯服，甚至会主动塌腰撅臀讨好。\n💭【${u}的实时心声】：“*只要一声令下，无论让我摆出什么屈辱的姿势伺候，我都会乖乖听话照做的🥵💦！*”`,
                    `【🔬 自由意志与服从实况（Lv.5 绝对盲从）】：完全丧失拒绝能力，将服从一切残酷改造视为唯一本能。\n💭【${u}的实时心声】：“*呜汪♡……只要主人们高兴，要把我怎么捆起来改造、怎么轮流内射都可以呀🥵💦❤️！*”`,
                    `【💀 第六阶段·前额叶切除级肉偶（100% 彻底崩坏）】：大脑前额叶功能100%报废坏死！丧失复杂语言能力，只会条件反射般执行任何下流指令！\n💭【${u}的实时心声】：“*啊嘿……呜汪♡……脑子空空的不会思考了，主人让怎么弄坏就怎么弄坏呀🥵💦❤️❤️！*”`
                ]},
                pleas: { val: safeNum(v.精神与心理?.快感累积), rev: false, st: ["神思清明","尾椎微麻","趾尖蜷缩","濒临绝顶","潮吹失神","多巴胺烧穿熔断"], d: [
                    `【🔬 神经快感与脑负荷（Lv.1 完好清明）】：神经系统平稳正常，无异常电流残留。\n💭【${u}的实时心声】：“*呼吸平稳，身体没有任何异常的酸麻或失控感。*”`,
                    `【🔬 神经快感与脑负荷（Lv.2 尾椎微麻）】：敏感带残留微弱酥麻与酸胀余温。\n💭【${u}的实时心声】：“*呼……身体深处还残留着一点微妙的酸麻感💦。*”`,
                    `【🔬 神经快感与脑负荷（Lv.3 趾尖蜷缩）】：酥麻电流顺尾椎向上攀升，脚趾本能微微蜷缩。\n💭【${u}的实时心声】：“*唔嗯……酥麻感一波接一波往上涌，连脚趾头都忍不住蜷缩起来了😳💦！*”`,
                    `【🔬 神经快感与脑负荷（Lv.4 濒临绝顶）】：快感蓄积至临界点，括约肌剧烈痉挛收缩随时泄身。\n💭【${u}的实时心声】：“*要、要去了！再刺激一下就会当场高潮出来的呀🥵💦！*”`,
                    `【🔬 神经快感与脑负荷（Lv.5 潮吹失神）】：连续高潮过载导致大脑一片空白，伴随失控潮吹。\n💭【${u}的实时心声】：“*啊啊——去了♡！！全身骨头都爽得融化成水了，潮吹根本停不下来呀🥵💦❤️！*”`,
                    `【💀 第六阶段·多巴胺受体烧穿熔断（100% 彻底崩坏）】：多巴胺受体彻底烧穿坏死！双眼翻白无法复位，陷入永不停止的帕金森式痉挛绝顶！\n💭【${u}的实时心声】：“*啊嘿♡——咕嘿嘿！！脑髓彻底烧穿短路啦，一秒钟不停地抽搐喷尿高潮到死呀🥵💦❤️❤️！*”`
                ]},
                sta: { val: safeNum(v.身体?.体力, 100), rev: true, st: ["亭亭玉立","腰腿酸软","膝软外八不合","双腿痉挛瘫软","髋骨脱臼爬行","四肢废用肉垫"], d: [
                    `【🔬 躯体骨骼与运动机能（Lv.1 完好充沛）】：体力充沛（${safeNum(v.身体?.体力, 100)}/100），身姿挺拔行动自如。\n💭【${u}的实时心声】：“*目前精力很充沛，四肢百骸都充满力气，姿态端正稳健。*”`,
                    `【🔬 躯体骨骼与运动机能（Lv.2 腰腿酸软）】：略带倦意，腰腹与双腿肌肉酸软沉重。\n💭【${u}的实时心声】：“*稍微出了一身薄汗，腰和腿都有点酸沉沉的💦。*”`,
                    `【🔬 躯体骨骼与运动机能（Lv.3 膝软外八不合）】：大腿内收肌拉伤松弛，走路呈外八字无法完全并拢。\n💭【${u}的实时心声】：“*膝盖一直在发抖，大腿根部的肌肉酸软得根本并拢不了😳💦。*”`,
                    `【🔬 躯体骨骼与运动机能（Lv.4 双腿痉挛瘫软）】：体力濒临枯竭，双腿发生神经性抽搐难以站稳。\n💭【${u}的实时心声】：“*哈啊……浑身上下一点力气都使不出来了，双腿软得只能敞开着瘫倒下来🥵💦……*”`,
                    `【🔬 躯体骨骼与运动机能（Lv.5 髋骨脱臼母犬爬行）】：髋关节习惯性半脱臼变形，彻底丧失直立行走能力，只能四肢着地爬行。\n💭【${u}的实时心声】：“*呜汪♡……胯骨早就被撞脱臼站不起来了，只能像母狗一样撅着烂屁股爬行等操呀🥵💦❤️！*”`,
                    `【💀 第六阶段·四肢废用痉挛肉垫（0/100 彻底崩坏）】：运动神经与四肢彻底废用萎缩，脊椎长死成M字大开腿撅臀肉垫！\n💭【${u}的实时心声】：“*啊嘿♡……手脚彻底废掉动不了啦，骨头已经长死成M字开腿撅屁股的肉垫形状了🥵💦❤️❤️！*”`
                ]}
            };
            const cfg = map[type] || map.cockLove, t = tier6(cfg.val, cfg.rev);
            if (ovr && (ovr.desc || ovr.thought)) {
                return { val: cfg.val, stage: ovr.stage || cfg.st[t], desc: `${ovr.desc || cfg.d[t].split("💭")[0]}\n💭【${u}的实时心声】：“*${cleanThoughtText(ovr.thought || "……")}*”` };
            }
            const rawLines = cfg.d[t].split("💭"), objSection = rawLines[0];
            const pureThoughtsArr = cfg.d.map(itemStr => cleanThoughtText(itemStr.split("实时心声】：“")[1] || ""));
            return { val: cfg.val, stage: cfg.st[t], desc: `${objSection}💭【${u}的实时心声】：“*${pickStageThought(v, pureThoughtsArr, cfg.val, cfg.rev)}*”` };
        }
        function buildFullFallbackCategories(u, c, v) {
            calibrateMentalMetrics(v);
            const dev = computeAllOrganDevelopments(v);
            const ovr = v.按钮详情 || {};
            const mk = (editKey, defaultRawKey, desc, barTheme = "pleas", subBarCfg = null, hideBar = false, stagePctOverride = null, extraProps = {}) => {
                const customTitle = ovr[editKey]?.customTitle, customStage = ovr[editKey]?.stage;
                let finalRawKey = customTitle || defaultRawKey;
                if (!customTitle && customStage && /「[^」]+」/.test(finalRawKey)) finalRawKey = finalRawKey.replace(/「[^」]+」/, `「${customStage}」`);
                return { editKey, rawKey: finalRawKey, desc, ...fmtKey(finalRawKey, barTheme, subBarCfg, hideBar, stagePctOverride), ...extraProps };
            };

            const live = extractDynamicContext(u, c), diff = getDifficultyProfile(), realId = detectRealCharacterIdentity(v);
            const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {}, prof = v.档案 || {}, rt = v.实况 || {}, wear = v.穿搭 || {}, preg = v.受孕与生理 || {};
            const cockM = getDynamicMetricDetail("cockLove", v, u), lustM = getDynamicMetricDetail("lust", v, u), corrM = getDynamicMetricDetail("corr", v, u);
            const shameM = getDynamicMetricDetail("shame", v, u), obeyM = getDynamicMetricDetail("obey", v, u), pleasM = getDynamicMetricDetail("pleas", v, u), staM = getDynamicMetricDetail("sta", v, u);

            const vagCnt = safeNum(cnt.性交?.小穴), mouthCnt = safeNum(cnt.性交?.口), analCnt = safeNum(cnt.性交?.屁眼), titCnt = safeNum(cnt.性交?.乳穴), footCnt = safeNum(cnt.性交?.足腿), beastCnt = safeNum(cnt.性交?.兽交异种);
            const creampie = safeNum(cnt.射精?.内射), facialCnt = safeNum(cnt.射精?.颜射体外), swallowCnt = safeNum(cnt.精液摄入?.吞精次数), swallowMl = safeNum(cnt.精液摄入?.累计毫升);
            const orgasmCnt = safeNum(cnt.高潮?.总数), forceOrgCnt = safeNum(cnt.高潮?.强制), edgeCnt = safeNum(cnt.高潮?.寸止);
            const leakCnt = safeNum(cnt.失控?.失禁), squirtCnt = safeNum(cnt.失控?.喷潮), ahegaoCnt = safeNum(cnt.失控?.阿嘿颜);
            const hookerCnt = safeNum(cnt.交易?.接客卖身), gangCnt = safeNum(cnt.交易?.轮奸群交), sleepCnt = safeNum(cnt.交易?.睡眠昏迷奸);
            const milkCnt = safeNum(cnt.泌乳?.喷乳次数), milkMl = safeNum(cnt.泌乳?.累计毫升), mastCnt = safeNum(cnt.自慰);

            let mouthMl = safeNum(sp.口内毫升), vagMl = safeNum(sp.小穴毫升), wombMl = safeNum(sp.子宫毫升), analMl = safeNum(sp.屁眼毫升);
            const totalMl = mouthMl + vagMl + wombMl + analMl, caps = calcHoleCapacities(v);
            const corr = safeNum(v.核心数值?.淫乱恶堕), lust = safeNum(v.核心数值?.性欲程度), pleas = safeNum(v.精神与心理?.快感累积);
            const isPureZero = (dev.totalLedgerCount === 0 && totalMl === 0 && corr < 15 && dev.all6OrganAvg === 0);

            const vagWidth = (1.5 + Math.min(8.5, (vagCnt / diff.mult) * 0.08 + dev.vagObj.val * 0.06)).toFixed(1);
            const vagClose = Math.max(0, Math.round(100 - dev.vagObj.val * 0.95 - ((wombMl + vagMl) > 0 ? 15 : 0)));
            const clitSize = (4.0 + Math.min(22.0, (orgasmCnt / diff.mult) * 0.15 + dev.clitObj.val * 0.18)).toFixed(1);
            const peeVal = isPureZero ? 0 : Math.min(100, Math.round(dev.clitObj.val * 0.6 + lust * 0.2 + pleas * 0.2 + leakCnt * 6));
            const wetLevel = isPureZero ? 0 : Math.min(100, Math.round(lust * 0.65 + pleas * 0.55 + ((wombMl + vagMl) > 0 ? 30 : 0)));
            const fallVal = safeNum(v.精神与心理?.沦陷度), brkVal = safeNum(v.精神与心理?.人格崩解度), hypnoVal = safeNum(extPsy.催眠深度), drugVal = safeNum(v.精神与心理?.媚药精液毒瘾);
            const fallMax = typeof v.上帝强制锁定?.["精神沦陷"] === "number" ? v.上帝强制锁定["精神沦陷"] : Math.max(fallVal, brkVal, hypnoVal);
            const fallTier = tier6(fallMax, false), sensMult = (1.0 + corr * 0.06 + dev.all6OrganAvg * 0.05 + (vagCnt > 0 ? 1.0 : 0)).toFixed(1);
            const mouthDev = dev.mouthObj.val, chestDev = dev.chestObj.val, vagDev = dev.vagObj.val, wombDev = dev.wombObj.val, clitDev = dev.clitObj.val, analDev = dev.analObj.val;

            const rawScarStr = `${safeStr(mark.体表痕迹)} ${safeStr(mark.公开涂鸦字迹)}`;
            const isPermScar = /刺青|纹身|烙铁|烙印|烫伤|刀刻|烂肉|深可见骨/.test(rawScarStr);
            const hasScarsOrTally = (mark.体表痕迹 && mark.体表痕迹 !== "无") || (mark.公开涂鸦字迹 && mark.公开涂鸦字迹 !== "无") || safeNum(mark.鞭痕与掌印) > 0;
            const tallyStrokes = hasScarsOrTally ? (safeNum(mark.鞭痕与掌印) * 4 + (mark.公开涂鸦字迹 && mark.公开涂鸦字迹 !== "无" ? Math.max(5, creampie + vagCnt) : 0)) : 0;
            const tallyFull = Math.floor(tallyStrokes / 5);
            let rawScarDev = 0;
            if (hasScarsOrTally) rawScarDev = isPermScar ? Math.max(62, calcStage6Score(tallyStrokes + 80, 1.0, diff.mult, /烂肉|刀刻/.test(rawScarStr)).val) : Math.min(58, Math.max(22, 20 + tallyFull * 6 + safeNum(mark.鞭痕与掌印) * 3));
            const tallyDev = typeof v.上帝强制锁定?.["正字涂鸦"] === "number" ? v.上帝强制锁定["正字涂鸦"] : (isPermScar ? lockIrreversible(v, "mod_scar", rawScarDev, "正字涂鸦") : Math.max(hasScarsOrTally ? rawScarDev : 0, safeNum(v.历史最高崩坏度?.mod_scar) >= 60 ? v.历史最高崩坏度.mod_scar : 0));

            const rawTattooStr = safeStr(mark.淫纹与刻印), isPermTattoo = /永久|烙印|刺青|漆黑刻印|荧光|异化|触须|魔腹|腐蚀/.test(rawTattooStr);
            const hasTattoo = Boolean(mark.淫纹与刻印 && mark.淫纹与刻印 !== "无" && !/无外显|未刻|光洁/.test(rawTattooStr));
            const rawTattooDev = hasTattoo ? (isPermTattoo ? Math.max(45, Math.min(100, Math.round(40 + corr * 0.6))) : Math.min(39, Math.max(22, Math.round(20 + lust * 0.2)))) : 0;
            const tattooDev = typeof v.上帝强制锁定?.["淫纹烙印"] === "number" ? v.上帝强制锁定["淫纹烙印"] : (isPermTattoo ? lockIrreversible(v, "mod_tattoo", rawTattooDev, "淫纹烙印") : Math.max(hasTattoo ? rawTattooDev : 0, safeNum(v.历史最高崩坏度?.mod_tattoo) >= 45 ? v.历史最高崩坏度.mod_tattoo : 0));

            const rawPierceStr = safeStr(mark.穿刺与环饰), isPermPierce = /铁牢|缝合|锁死|撕裂|钢筋|嵌合|生锈/.test(rawPierceStr);
            const hasPierce = Boolean(mark.穿刺与环饰 && mark.穿刺与环饰 !== "无" && !/无穿刺|未穿刺/.test(rawPierceStr));
            const rawPierceDev = hasPierce ? (isPermPierce ? Math.max(62, Math.min(100, Math.round(55 + corr * 0.45))) : Math.min(58, Math.max(25, Math.round(25 + corr * 0.3)))) : 0;
            const pierceDev = typeof v.上帝强制锁定?.["穿刺环饰"] === "number" ? v.上帝强制锁定["穿刺环饰"] : (isPermPierce ? lockIrreversible(v, "mod_pierce", rawPierceDev, "穿刺环饰") : Math.max(hasPierce ? rawPierceDev : 0, safeNum(v.历史最高崩坏度?.mod_pierce) >= 60 ? v.历史最高崩坏度.mod_pierce : 0));

            const rawPropStr = safeStr(prop.体内道具), isPermProp = /机械|电缆|触手|铆钉|焊死|核心|齿轮/.test(rawPropStr);
            const hasProp = Boolean(prop.体内道具 && prop.体内道具 !== "无" && !/无填塞|无道具|存留.*浓精/.test(rawPropStr));
            const rawPropDev = hasProp ? (isPermProp ? Math.max(65, Math.min(100, Math.round(60 + corr * 0.4))) : Math.min(58, Math.max(25, Math.round(25 + pleas * 0.3)))) : 0;
            const propDev = typeof v.上帝强制锁定?.["体内道具"] === "number" ? v.上帝强制锁定["体内道具"] : (isPermProp ? lockIrreversible(v, "mod_prop", rawPropDev, "体内道具") : Math.max(hasProp ? rawPropDev : 0, safeNum(v.历史最高崩坏度?.mod_prop) >= 60 ? v.历史最高崩坏度.mod_prop : 0));

            const ovulStageVal = lockIrreversible(v, "preg_ovul", (creampie + drugVal + forceOrgCnt) > 0 ? calcStage6Score(creampie * 1.1 + drugVal * 0.8 + forceOrgCnt * 1.2, 1.0, diff.mult, creampie >= 90 * diff.mult).val : 0, "排卵周期");
            const xrayStageVal = lockIrreversible(v, "preg_xray", (creampie + wombMl + safeNum(preg.生产产卵次数)) > 0 ? Math.min(100, Math.round(wombDev * 0.75 + (wombMl > 0 ? 22 : 0) + safeNum(preg.生产产卵次数) * 15)) : 0, "受精断面");
            const dnaStageVal = lockIrreversible(v, "preg_dna", (creampie + swallowCnt + gangCnt + beastCnt) > 0 ? calcStage6Score(creampie * 1.2 + swallowCnt * 0.9 + gangCnt * 2.5 + beastCnt * 4, 1.0, diff.mult, (creampie + swallowCnt) >= 120 * diff.mult).val : 0, "精液归属");
            const bellySwellPct = Math.min(100, Math.round(safeNum(preg.怀孕进度) + (totalMl / Math.max(60, caps.wombMax)) * 65));
            const pregStageVal = lockIrreversible(v, "preg_belly", (preg.子宫怀孕 || totalMl > 0 || safeNum(preg.生产产卵次数) > 0 || creampie > 10) ? Math.min(100, Math.max(bellySwellPct, Math.round(safeNum(preg.生产产卵次数) * 28 + (creampie / diff.mult) * 0.8))) : 0, "孕肚进度");
            const bodyTotalCorrupt = typeof v.上帝强制锁定?.["肉体外貌"] === "number" ? v.上帝强制锁定["肉体外貌"] : Math.round(dev.all6OrganAvg * 0.6 + (tallyDev + tattooDev + pierceDev + propDev) * 0.1);

            const mouthStg = `${stageNameFromVal(mouthDev)}•${["洁净初唇","唇肿涎溢","咽喉松弛","颚骨半脱臼","食道肉壶化","口腔排泄器畸变"][tier6(mouthDev)]}`;
            const chestStg = `${stageNameFromVal(chestDev)}•${["娇嫩处乳","乳尖肥大","乳晕黑紫扩张","乳腺失控漏奶","下垂巨乳奶袋","崩坏泌乳肉囊"][tier6(chestDev)]}`;
            const vagStg   = `${stageNameFromVal(vagDev)}•${["紧致初鲍","初破红肿","外翻黑木耳","括约肌松弛洞开","肉壁脱垂漏精壶","彻底崩坏烂肉洞"][tier6(vagDev)]}`;
            const wombStg  = `${stageNameFromVal(wombDev)}•${["紧闭处子","宫口充血微松","宫口扩张锁精","宫腔肥大下坠","宫颈重度脱垂","外翻脱垂死肉苗床"][tier6(wombDev)]}`;
            const clitStg  = `${stageNameFromVal(clitDev)}•${["包皮隐没","充血外露","阴蒂肥大勃起","尿道扩张漏尿","阴蒂肉棒化失禁","括约肌坏死漏尿狂"][tier6(clitDev)]}`;
            const analStg  = `${stageNameFromVal(analDev)}•${["紧闭菊蕾","裂伤红肿","褶皱磨平松弛","后庭空洞不合","直肠翻肉轻度脱肛","重度脱肛崩坏排泄腔"][tier6(analDev)]}`;
            const scarStg   = `${stageNameFromVal(tallyDev)}•${["白皙无瑕","初次记数","淫语密布","刺青入骨","烙铁烫印","烂肉记事本"][tier6(tallyDev)]}`;
            const tattooStg = `${stageNameFromVal(tattooDev)}•${["平坦白腹","初显魔纹","漆黑刻印","发情荧光","肉体异化","恶堕魔腹"][tier6(tattooDev)]}`;
            const pierceStg = `${stageNameFromVal(pierceDev)}•${["天然无饰","初上银环","重金属坠","密集铁牢","皮肉撕裂","金属嵌合体"][tier6(pierceDev)]}`;
            const propStg   = `${stageNameFromVal(propDev)}•${["空荡纯净","微露拉环","巨物撑扩","机械群交","内脏异形化","永久机械肉壶"][tier6(propDev)]}`;

            const milkCap = Math.round(100 + milkCnt * 15), curMilkMl = milkCnt > 0 ? Math.min(milkCap, Math.round(25 + lust * 0.8 + pleas * 0.5)) : 0;
            const fertProb = safeNum(preg.受孕概率, wombMl > 0 ? 75 : (creampie > 0 ? 40 : (isPureZero ? 0 : 15)));
            const cycLabel = isPureZero ? (preg.生理周期阶段 || "正常生理期") : (preg.生理周期阶段 === "正常生理期" && wombMl > 0 ? "危险排卵期" : (preg.生理周期阶段 || "危险排卵期"));
            const ovulStg = `${stageNameFromVal(ovulStageVal)}•${["平静安宁","初潮萌动","异常催促","排卵失控","异种卵生","永久下崽机器"][tier6(ovulStageVal)]}`;
            const xrayStg = `${stageNameFromVal(xrayStageVal)}•${["无暇孤卵","精群围攻","破膜着床","多重受孕","异种寄生","腐肉苗床"][tier6(xrayStageVal)]}`;
            const dnaStg  = `${stageNameFromVal(dnaStageVal)}•${["无暇无浊","体外喷溅","内射满溢","全身精涂","肌体吸精","白浊黏液怪"][tier6(dnaStageVal)]}`;
            const pregStg = `${stageNameFromVal(pregStageVal)}•${["平坦马甲线","微凸孕相","显怀大肚","胎动破肚","下垂肉囊","透明异种孵化巢"][tier6(pregStageVal)]}`;
            const totalCapAll = caps.mouthMax + caps.vagMax + caps.wombMax + caps.analMax;

            const marketRank = corr >= 100 ? "EX神格·崩坏便器" : corr >= 80 ? "SSS级·公用便器" : corr >= 50 ? "A级·风俗名器" : hookerCnt > 0 ? "B级·暗娼熟肉" : "S级·纯洁无瑕";
            const marketPrice = prof.风月挂牌身价 || (hookerCnt > 0 ? `单次皮肉资 ${Math.max(50, 500 - corr * 4)} 元（已接客 ${hookerCnt} 次）` : `无价之宝（清白之身，尚未涉足风尘交易）`);

            const fmtOvr = (key, defObj, defThoughtArr, specificStageVal = null, isRev = false) => {
                const defaultThought = Array.isArray(defThoughtArr) ? pickStageThought(v, defThoughtArr, specificStageVal, isRev) : defThoughtArr;
                if (ovr[key] && (ovr[key].desc || ovr[key].thought)) return `${ovr[key].desc || defObj}\n💭【${u}的实时心声】：“*${cleanThoughtText(ovr[key].thought || defaultThought)}*”`;
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
                : [mk("fetish_none", `🔒 暂无性癖「完好未染」`, `【性癖状态】：\n当前所有性交、高潮、内射与受虐记录均为 0。\n💭【${u}的实时心声】：“*我现在的身心依然保持着原本的纯净完好。*”`, "none", null, true, 0)];

            const clientList = extractClientsFromHistory(v, u, c);
            const clientItems = clientList.length > 0
                ? clientList.map((cl, idx) => mk(`client_${idx}`, `🍆 ${cl.name}：${cl.val}/100「${cl.roleTag}•${cl.statusTag}」`, `${cl.detailDesc}\n💭【${u}的实时心声】：“*${cleanThoughtText(cl.thoughtStr)}*”`, "cockLove", cl.dnaShare > 0 ? { mainName: "🍆 调教崩坏度", label: "🧬 宫内DNA", theme: "semen", pct: cl.dnaShare, text: `${cl.dnaShare}%` } : null, false, null, { isClient: true, clientName: cl.name }))
                : [mk("client_none", `🔒 暂无恩客记录「完好清白」`, `【恩客图鉴】：\n当前尚未与任何男性建立肉体支配记录。\n💭【${u}的实时心声】：“*我还没有被任何男人占有过。*”`, "none", null, true, 0)];

            const baseCategories = [
                {
                    title: "档案与风评", icon: "👩", summary: `${u} (${realId}) · 敏感${sensMult}x`,
                    items: [
                        mk("身份与背景", `👩 认知真名与身份：${u}「${realId}•${prop.肉体所有权 || (hookerCnt > 0 ? "恩客共有" : "自由身")}」`,
                            fmtOvr("身份与背景", `【🔬 认知真名与身份处境】：\n• 认知真名：${u}${prof.原身旧名 && prof.原身旧名 !== u ? `（已取代原名「${prof.原身旧名}」）` : ""} ｜ 肉体归属：${prop.肉体所有权 || (hookerCnt > 0 ? "买春恩客支配" : "自由身")}\n• 真实身份与体质：${realId}（敏感度：${sensMult} 倍 ｜ 难度：${diff.fullLabel}）\n• 当前处境：${prof.身份与背景 || live.identity}`,
                                [`我现在是以「${u}」（${realId}）的身份活在这个世界里，必须保持稳妥。`,`作为「${u}」，虽然眼前的处境让人有些紧绷为难，但我还是得努力维持体面💦。`,`我已经彻底习惯了「${u}」这个身份和这具敏感度 ${sensMult} 倍的身体😳💦。`,`现在的我就是「${u}」，这具敏感易湿的熟肉身体早就离不开男人的玩弄与支配了🥵💦！`,`只要听到有人叫我「${u}」，合不拢的骚穴就会条件反射涌出热流🥵💦❤️！`,`啊嘿♡……「${u}」就是天生为了给所有男人当泄欲排泄肉坑而存在的崩坏母猪呀🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("肉体外貌", `🌸 肉体敏感与畸变总览：${bodyTotalCorrupt}/100「敏感${sensMult}倍•${stageNameFromVal(bodyTotalCorrupt)}」`,
                            fmtOvr("肉体外貌", `【🔬 全身器质崩坏度与外貌实况：${bodyTotalCorrupt}/100】：\n• 躯体实况：${prof.肉体外貌实况 || live.bodyDesc}\n• 神经敏感倍率：常人的 ${sensMult} 倍 ｜ 六孔平均崩坏度：${dev.all6OrganAvg}%`,
                                [`这具身体肌肤细腻、完好无瑕，我应当好好爱惜保护自己。`,`不知是不是错觉，总觉得现在的皮肤和粘膜变得比以前敏感了不少💦。`,`看着镜子里留着薄汗与红痕、私处微张的身体，每一寸皮肤都敏感到极点😳💦。`,`我这具丰满白腻的身体早就被开发得松软熟透了🥵💦！`,`好喜欢看自己这副满身巴掌印、穴口外翻脱垂合不拢的下流母畜身体呀🥵💦❤️！`,`啊嘿♡……全身上下每一个器官都已经100%崩坏畸变成流着脓精和骚尿的烂肉块啦🥵💦❤️❤️！`], bodyTotalCorrupt), "corr"),
                        mk("表里风评", `🎭 表里风评：「${prof.表里风评与称号 || (corr >= 60 ? "名声崩坏•难以自持" : (isPureZero ? "清白端庄•品行自持" : "表面平静•暗藏反差"))}」`,
                            fmtOvr("表里风评", `【🔬 表里风评与把柄威胁】：\n• 当前称号：【${corr >= 100 ? "深度沦陷" : corr >= 80 ? "彻底失守" : corr >= 50 ? "习以为常" : vagCnt > 0 ? "初尝禁果" : "清白自持"}】\n• 风评实况：${prof.表里风评与称号 || (hookerCnt > 0 ? "存在私密交易记录，声誉已受影响。" : "外界风评正常端庄。")}\n• 致命把柄：${prof.致命把柄与威胁 !== "无" ? prof.致命把柄与威胁 : "暂无已知把柄"}`,
                                [`我的名声与清白容不得半点污点。`,`但愿那些略显尴尬的私密接触不会被外人知晓💦。`,`在知情的熟客眼里，我早就不是什么高不可攀的女人了😳💦。`,`反正名声和把柄早就落在男人们手里了，还不如享受当荡妇的快乐呢🥵💦！`,`嘻嘻♡……最好让所有男人都知道我是个给钱就能无套内射的下贱娼妇🥵💦❤️！`,`啊嘿♡……请把人家的崩坏事迹传遍天下吧🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("挂牌身价", `🏷️ 挂牌身价：「${marketRank}」`,
                            fmtOvr("挂牌身价", `【🔬 风月估值与身价评级】：\n• 评级：【${marketRank}】\n• 估值明细：${marketPrice}。`,
                                [`我的身体与尊严是无价的。`,`一想到如果沦落到被金钱衡量的地步，心里就一阵发寒💦。`,`我已经渐渐习惯了靠出卖这具身体来换取生活所需😳💦。`,`只要给几张零钞就能随便玩弄内射我这具名器身体🥵💦！`,`哪怕倒贴钱都行♡，只要能用粗大肉棒把子宫灌满浓精就是最好的报酬🥵💦❤️！`,`啊嘿♡……倒贴钱求操的0元公用排泄便池挂牌营业中呀🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("内心独白", `💬 内心独白：「实时心声」`,
                            fmtOvr("内心独白", `【⚡ 当前敏感带与规矩日程】：\n• 敏感带：${extPsy.当前敏感点 || (isPureZero ? "耳根、脖颈与腰侧" : "外翻阴唇、肿大阴蒂、脱垂宫颈口与乳尖")}\n• 当前日程：${v.调教进度?.规矩与日程 || (isPureZero ? "保持警惕，正常推进日常事务" : "尽快清理体内残留，准备应对接下来的互动")}。`, curThought), "none", null, true, 0),
                        mk("当前姿势", `🧍 姿势与躯体机能：${staM.val}/100「${staM.stage}」`,
                            fmtOvr("当前姿势", `【🔬 当前姿态与躯体骨骼机能崩坏实况】：\n• 实时姿态：${curPose}\n${staM.desc.split("💭")[0]}`,
                                [`保持端正自然的姿态，目前体力充沛。`,`稍微有些劳累出汗，我得扶稳站好💦。`,`大腿内侧肌肉被撑得酸软无力，膝盖打颤合不拢腿😳💦。`,`腰椎和双腿都酸软痉挛得厉害，连站着都在摇晃🥵💦！`,`胯骨早就被撞得习惯性半脱臼了，只能像母狗一样四肢着地爬行等操🥵💦❤️！`,`啊嘿♡……四肢彻底废用萎缩成M字开腿撅臀的活体肉垫了🥵💦❤️❤️！`], staM.val, true), "sta")
                    ]
                },
                {
                    title: "恶堕与脑改", icon: "🔥", summary: `好感${cockM.val}% · 性欲${lustM.val}% · 恶堕${corrM.val}% · 羞耻${shameM.val}%`,
                    items: [
                        mk("cockLove", `💗 阳具烙印：${cockM.val}/100「${cockM.stage}」`, cockM.desc, "cockLove"),
                        mk("lust", `🔥 发情中枢：${lustM.val}/100「${lustM.stage}」`, lustM.desc, "lust"),
                        mk("corr", `🖤 人格崩坏：${corrM.val}/100「${corrM.stage}」`, corrM.desc, "corr"),
                        mk("shame", `😳 羞耻防线：${shameM.val}/100「${shameM.stage}」`, shameM.desc, "shame"),
                        mk("obey", `🙇 意志切除：${obeyM.val}/100「${obeyM.stage}」`, obeyM.desc, "obey"),
                        mk("pleas", `💓 脑髓熔断：${pleasM.val}/100「${pleasM.stage}」`, pleasM.desc, "pleas"),
                        mk("精神沦陷", `🌀 脑实质沦陷：${fallMax}/100「${["理智完好","浅层恍惚","催眠暗示","常识改写","人格碎裂","脑海绵化痴呆"][fallTier]}」`,
                            fmtOvr("精神沦陷", `【🔬 脑实质与认知崩坏（第${fallTier + 1}阶段 · ${fallMax}/100）】：\n• 沦陷：${fallVal}/100 ｜ 崩解：${brkVal}/100 ｜ 清醒：${safeNum(v.精神与心理?.意识清醒度, 100)}/100 ｜ 催眠：${hypnoVal}/100`,
                                [`我的头脑非常清醒，三观坚不可摧。`,`脑海里偶尔会闪过一丝恍惚与疲惫💦。`,`眼神已经变得像死水一样平静麻木了😳💦。`,`只要一闻到男人的气息，脑子就会变得晕乎乎的🥵💦！`,`人格和常识都已经被彻底改写成了只知道张腿接精的母猪逻辑🥵💦❤️！`,`啊嘿……脑子彻底变成装满精液的浆糊海绵啦🥵💦❤️❤️！`], fallMax), "hypno"),
                        mk("媚药毒瘾", `🧪 脑脊液毒瘾：${drugVal}/100「${["纯净无毒","微醺依恋","药力发热","精液戒断","断精发狂","脑脊液毒化母猪"][tier6(drugVal)]}」`,
                            fmtOvr("媚药毒瘾", `【🔬 媚药侵蚀与脑脊液毒瘾（Lv.${tier6(drugVal) + 1} · ${drugVal}/100）】：\n• 药物状态：${v.调教进度?.媚药与发情毒 || "无外源化学媚药"}`,
                                [`体内干净纯粹，没有任何药物残留。`,`屋里浑浊的气味吸进肺里让人有些头晕胸闷💦。`,`身体似乎渐渐习惯了雄性精液的热度与气味😳💦。`,`太久没有被灌进子宫里，小肚子深处就像犯了毒瘾一样发痒呢🥵💦！`,`一天不喝精液、不被内射灌满就会浑身抽搐发狂呀🥵💦❤️！`,`啊嘿♡……连脑脊液都被媚药和浓精彻底毒化啦🥵💦❤️❤️！`], drugVal), "drug")
                    ]
                },
                { title: "下流性癖库", icon: "🧬", summary: unlockedFetishes.length > 0 ? `已畸变 ${unlockedFetishes.length} 项` : `完好未染`, items: fetishItems },
                {
                    title: "六孔与储精", icon: "🌸", summary: `总储精${totalMl}ml · 六孔崩坏实况`,
                    items: [
                        mk("骚口实况", `👄 骚口：${mouthDev}/100「${mouthStg}」`, fmtOvr("骚口实况", `【🔬 口腔崩坏度：${mouthDev}/100（${mouthStg}｜口交${mouthCnt}·吞精${swallowCnt}）】：\n• 💧 胃袋储精：${mouthMl}ml / ${caps.mouthMax}ml（累计吞精 ${swallowMl}ml）\n• 📍 当前细节：${rt.骚口实况 || live.mouth || "唇瓣微张喘息。"}`, [`双唇与口腔干净清爽。`,`嘴唇稍微有些发干发麻💦。`,`咽喉深处还残留着一丝酸胀感😳💦。`,`舌头和嗓子眼早就记住了大肉棒的形状🥵💦！`,`快用大肉棒捅穿我的喉咙直接射进胃里吧🥵💦❤️！`,`啊嘿♡……下巴彻底脱臼，直接往嗓子眼里灌精撒尿吧🥵💦❤️❤️！`], mouthDev), "mouth", { mainName: "👄 口器崩坏度", label: "🥛 胃袋储精", theme: "semen", pct: Math.round((mouthMl / Math.max(1, caps.mouthMax)) * 100), text: `${mouthMl}/${caps.mouthMax}ml` }),
                        mk("胸部实况", `🍒 丰乳：${chestDev}/100「${chestStg}」`, fmtOvr("胸部实况", `【🔬 乳房崩坏度：${chestDev}/100（${chestStg}｜乳交${titCnt}·喷乳${milkCnt}）】：\n• 🍼 乳腺蓄乳：${curMilkMl}ml / ${milkCap}ml（累计泌乳 ${milkMl}ml）\n• 📍 当前细节：${rt.胸部实况 || live.chest || "双峰随呼吸起伏。"}`, [`双峰紧致完好。`,`乳尖被磨得有些充血发硬💦。`,`肿大的乳头又硬又痛😳💦。`,`稍微碰一下乳头就会控制不住往外渗奶水🥵💦！`,`硕大下垂的奶袋子又胀又麻好难受呀♡🥵💦❤️！`,`啊嘿♡……一对烂奶子已经彻底崩坏成垂到肚子上的紫黑肉袋了🥵💦❤️❤️！`], chestDev), "chest", { mainName: "🍒 乳腺崩坏度", label: "🍼 乳腺蓄乳", theme: "milk", pct: Math.round((curMilkMl / Math.max(1, milkCap)) * 100), text: `${curMilkMl}/${milkCap}ml` }),
                        mk("小穴实况", `🌺 小穴：${vagDev}/100「${vagStg}」`, fmtOvr("小穴实况", `【🔬 小穴崩坏度：${vagDev}/100（${vagStg}｜贯穿${vagCnt}·内射${creampie}·孔径${vagWidth}cm·闭合${vagClose}%）】：\n• 💧 阴道储精：${vagMl}ml / ${caps.vagMax}ml\n• 📍 当前细节：${rt.小穴实况 || live.vag || "花唇微张。"}`, [`下半身干爽整洁，私密处紧致完好。`,`两腿之间有些红肿温热💦。`,`花唇已经红肿外翻合不拢了😳💦。`,`走一步路就咕啾一声往外漏白浆🥵💦！`,`骚逼已经彻底被操成内壁外翻的漏精肉壶了♡🥵💦❤️！`,`啊嘿♡……小穴已经100%彻底崩坏成合不拢的拳头大烂肉洞啦🥵💦❤️❤️！`], vagDev), "vag", { mainName: "🌺 小穴崩坏度", label: "🥛 穴内储精", theme: "semen", pct: Math.round((vagMl / Math.max(1, caps.vagMax)) * 100), text: `${vagMl}/${caps.vagMax}ml` }),
                        mk("子宫实况", `🫀 子宫：${wombDev}/100「${wombStg}」`, fmtOvr("子宫实况", `【🔬 子宫崩坏度：${wombDev}/100（${wombStg}｜内射${creampie}次）】：\n• 💧 宫腔储精：${wombMl}ml / ${caps.wombMax}ml\n• 📍 当前细节：${rt.子宫实况 || live.womb || "小腹微沉。"}`, [`小腹平坦温暖，子宫紧闭纯净。`,`小肚子最深处稍微有些发酸发沉💦。`,`宫腔深处被灌进了满满的滚烫浓精😳💦。`,`子宫口已经被撞得又软又松合不拢了🥵💦！`,`子宫韧带都被撞松脱垂到穴口边上了♡🥵💦❤️！`,`啊嘿♡……子宫口已经100%彻底脱垂掉到阴道外面来啦🥵💦❤️❤️！`], wombDev), "womb", { mainName: "🫀 宫颈崩坏度", label: "🥛 宫腔锁精", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }),
                        mk("阴蒂尿道", `💧 阴蒂与尿道：${clitDev}/100「${clitStg}」`, fmtOvr("阴蒂尿道", `【🔬 阴蒂与尿道崩坏度：${clitDev}/100（${clitStg}｜高潮${orgasmCnt}·失禁${leakCnt}·阴蒂${clitSize}mm）】：\n• 💦 尿道失禁度：${peeVal}/100\n• 📍 当前细节：${rt.阴蒂尿道实况 || "私处神经微颤。"}`, [`全身括约肌完全受控。`,`充血的阴蒂偶尔传来微弱摩擦酥麻感💦。`,`阴蒂（${clitSize}mm）每走一步都传来酸痛😳💦。`,`稍微高潮一下就会漏出尿来🥵💦！`,`阴蒂已经畸变肿大成小肉棒的样子了🥵💦❤️！`,`啊嘿♡……尿道括约肌已经100%彻底坏死报废啦🥵💦❤️❤️！`], clitDev), "clit", { mainName: "⚡ 尿道崩坏度", label: "💦 失禁漏尿", theme: "pee", pct: peeVal, text: `失禁度 ${peeVal}%` }),
                        mk("屁眼实况", `🕳️ 屁眼：${analDev}/100「${analStg}」`, fmtOvr("屁眼实况", `【🔬 后庭崩坏度：${analDev}/100（${analStg}｜肛交${analCnt}次）】：\n• 💧 直肠储精：${analMl}ml / ${caps.analMax}ml\n• 📍 当前细节：${rt.屁眼实况 || live.anal || "臀线紧绷。"}`, [`后庭紧闭洁净。`,`臀部肌肉稍微有些酸紧💦。`,`臀肉上的掌印还火辣辣地发烫😳💦。`,`后面的括约肌已经被撑松了🥵💦！`,`屁眼已经被操得往外翻出鲜红的直肠肉了♡🥵💦❤️！`,`啊嘿♡……屁眼括约肌彻底断掉重度脱肛啦🥵💦❤️❤️！`], analDev), "anal", { mainName: "🕳️ 后庭崩坏度", label: "🥛 直肠储精", theme: "semen", pct: Math.round((analMl / Math.max(1, caps.analMax)) * 100), text: `${analMl}/${caps.analMax}ml` })
                    ]
                },
                {
                    title: "肉改与道具", icon: "⛓️", summary: `伤痕${tallyDev}% · 淫纹${tattooDev}% · 穿刺${pierceDev}% · 腔改${propDev}%`,
                    items: [
                        mk("正字涂鸦", `🩹 正字涂鸦与烙痕：${tallyDev}/100「${scarStg}」`, fmtOvr("正字涂鸦", `【🔬 涂鸦与刻痕畸变度：${tallyDev}/100（${scarStg}｜正字${tallyFull}个）】：\n• 当前痕迹：${mark.体表痕迹 !== "无" ? mark.体表痕迹 : "无"} ｜ 涂鸦：${mark.公开涂鸦字迹 || "无"}`, [`全身肌肤光洁如初。`,`大腿根部画上了正字好屈辱💦……`,`密密麻麻全都是红黑交错的正字😳💦。`,`正字已经变成永久刺青了🥵💦！`,`焦黑的正字烫疤把痛觉神经都烫成高潮开关了🥵💦❤️！`,`啊嘿♡……全身皮肉都被刀子刻满了血肉正字🥵💦❤️❤️！`], tallyDev), "corr"),
                        mk("淫纹烙印", `🔮 淫纹烙印与魔蚀：${tattooDev}/100「${tattooStg}」`, fmtOvr("淫纹烙印", `【🔬 淫纹畸变度：${tattooDev}/100（${tattooStg}）】：\n• 当前状态：${hasTattoo ? mark.淫纹与刻印 : "小腹平坦光洁（0%）"}`, [`小腹肌肤白净平坦。`,`小腹下面隐约浮现出了浅粉色的奇怪纹路💦。`,`漆黑如墨的淫纹怎么洗都洗不掉😳💦。`,`小肚子上的淫纹亮起了紫红色的发情荧光🥵💦！`,`淫纹已经变成凸起蠕动的暗红肉须长在肚皮上了♡🥵💦❤️！`,`啊嘿♡……整个小肚子都被紫黑色的深渊淫纹腐蚀烂穿啦🥵💦❤️❤️！`], tattooDev), "hypno"),
                        mk("穿刺环饰", `💍 穿刺铁牢与嵌合：${pierceDev}/100「${pierceStg}」`, fmtOvr("穿刺环饰", `【🔬 穿刺环饰畸变度：${pierceDev}/100（${pierceStg}）】：\n• 当前状态：${hasPierce ? mark.穿刺与环饰 : "天然无饰（0%）"}`, [`身体各处完好自然。`,`刚被打穿戴上小银环又红又肿💦。`,`粗铁环和重锤把乳头和阴唇都拉扯得红肿变形了😳💦。`,`阴唇和乳房都被密密麻麻的铁环锁死了🥵💦！`,`粗大的工业钢筋直接插穿化脓的烂肉♡🥵💦❤️！`,`啊嘿♡……生锈的铁环齿轮已经和烂肉彻底长在一起啦🥵💦❤️❤️！`], pierceDev), "clit"),
                        mk("体内道具", `🎛️ 机械填塞与肉壶化：${propDev}/100「${propStg}」`, fmtOvr("体内道具", `【🔬 体内道具畸变度：${propDev}/100（${propStg}）】：\n• 当前道具：${hasProp ? prop.体内道具 : "空荡纯净（0%）"} ｜ 权限：${prop.排泄与高潮权限 || "自主控制"}`, [`身体内部清爽洁净。`,`塞着的小跳蛋嗡嗡震动得好难受💦。`,`发光电动假阳具把穴口撑得发白合不拢😳💦。`,`前后两个穴全都被冷冰冰的金属机械触手塞爆了🥵💦！`,`带刺的机械核心在子宫和直肠里高速旋转刮擦♡🥵💦❤️！`,`啊嘿♡……彻底变成永久固定的赛博机械肉便器啦🥵💦❤️❤️！`], propDev), "pleas")
                    ]
                },
                {
                    title: "全身穿搭", icon: "👗", summary: `状态:${wearStateTag}`,
                    items: [
                        mk("穿搭_头饰", `👑 头部与面容「${headTxt.slice(0, 14)}」`, fmtOvr("穿搭_头饰", `【🔬 头部实况】：${headTxt}\n• 细节：${live.headWear || "发丝整洁。"}`, [`妆容与发丝整洁得体。`,`额角渗出一层细密薄汗💦。`,`汗湿头发黏在脸颊上😳💦。`,`嘴角还挂着没擦干净的口水印子🥵💦！`,`快给我戴上流口水的开口球吧🥵💦❤️！`,`啊嘿♡……眼珠子彻底翻白回不来了🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_颈部", `⛓️ 脖颈与锁骨「${neckTxt.slice(0, 14)}」`, fmtOvr("穿搭_颈部", `【🔬 脖颈实况】：${neckTxt}\n• 细节：${live.neckWear || "脖颈白皙。"}`, [`衣领扣得很整齐。`,`脖颈稍微有些发热出汗💦。`,`右侧锁骨印着显眼的殷红咬痕😳💦。`,`锁骨红咬痕一碰就又酸又麻🥵💦！`,`好想戴上带铁链的母狗电击项圈呀🥵💦❤️！`,`啊嘿♡……脖子已经被生锈铁链勒出深槽了🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_胸罩", `👙 胸衣与内衬「${braTxt.slice(0, 14)}」`, fmtOvr("穿搭_胸罩", `【🔬 胸部穿戴】：${braTxt}\n• 细节：${live.braWear || "包裹完好。"}`, [`贴身内衬穿戴整齐。`,`贴身布料微微贴在皮肤上💦。`,`胸前暴露在微凉空气里😳💦。`,`光着大奶子才方便男人随时揉捏呀🥵💦！`,`只配穿把乳头勒出来的开洞情趣胸罩🥵💦❤️！`,`啊嘿♡……紫黑烂奶袋再也不需要遮挡啦🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_上衣", `👚 上衣与外衫「${topTxt.slice(0, 14)}」`, fmtOvr("穿搭_上衣", `【🔬 上身衣着】：${topTxt}\n• 细节：${live.topWear || "衣衫合体。"}`, [`身上的外衫平整洁净。`,`后背稍微出了一层薄汗💦。`,`光着后背把脏床单换了下来😳💦。`,`黑色吊带睡裙也是真空透视的🥵💦！`,`母狗只配穿一撕就碎的情趣薄纱🥵💦❤️！`,`啊嘿♡……全裸展示满身烙印就是终极礼服呀🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_内裤", `🩲 底裤与私处「${pantyTxt.slice(0, 14)}」`, fmtOvr("穿搭_内裤", `【🔬 底裤与遮护】：${pantyTxt}（泥泞度：${wetLevel}%）`, [`贴身底裤干爽舒适。`,`底裤稍微有些温热潮意💦。`,`下身赤裸外阴红肿微张😳💦。`,`内裤不到一分钟就会被淫水泡透🥵💦！`,`只配穿开裆丁字裤方便大肉棒随时插进来🥵💦❤️！`,`啊嘿♡……让烂肉洞24小时敞开着滴精漏尿吧🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_下装", `🍑 裙裤与臀部「${botTxt.slice(0, 14)}」`, fmtOvr("穿搭_下装", `【🔬 下装实况】：${botTxt}\n• 细节：${live.bottomWear || "垂顺得体。"}`, [`裙摆平整垂顺。`,`我轻轻抚平下摆褶皱💦。`,`光溜臀肉上印着暗红掌印😳💦。`,`屁股蛋上全是男人扇出来的红巴掌印🥵💦！`,`把屁股高高撅起来摇晃等插🥵💦❤️！`,`啊嘿♡……塌腰撅起印满烙印的烂屁股🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_丝袜", `🧦 丝袜与双腿「${sockTxt.slice(0, 14)}」`, fmtOvr("穿搭_丝袜", `【🔬 腿部实况】：${sockTxt}\n• 细节：${live.sockWear || "双腿端正。"}`, [`双腿姿态端正稳健。`,`双腿稍微有些酸沉💦。`,`大腿内侧全是被掐出来的指痕😳💦。`,`双腿软得连并拢都做不到啦🥵💦！`,`想穿上被撕开裆部的油亮黑丝架在肩上挨操🥵💦❤️！`,`啊嘿♡……髋骨脱臼长死成180度M字大开腿啦🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_鞋子", `👠 鞋履与玉足「${shoeTxt.slice(0, 14)}」`, fmtOvr("穿搭_鞋子", `【🔬 足部实况】：${shoeTxt}\n• 细节：${live.shoeWear || "鞋履整洁。"}`, [`鞋履整洁合脚。`,`脚踝稍微有些酸软💦。`,`脚趾前滴落着溢出的白浊😳💦。`,`高潮时十根脚趾都会蜷缩起来呢🥵💦！`,`想用沾满精液的脚趾头为您足交奉侍🥵💦❤️！`,`啊嘿♡……脚趾头永远痉挛蜷缩在精液池里🥵💦❤️❤️！`]), "none", null, true, 0)
                    ]
                },
                {
                    title: "苗床与受孕", icon: "🤰", summary: `${cycLabel} · 苗床崩坏${pregStageVal}%`,
                    items: [
                        mk("排卵周期", `🥚 卵巢异变与下崽化：${ovulStageVal}/100「${ovulStg}」`, fmtOvr("排卵周期", `【🔬 卵巢畸变度：${ovulStageVal}/100（${ovulStg}）】：\n• 周期：${cycLabel} ｜ 单发受孕率：${fertProb}%`, [`处于正常生理周期内。`,`正好排出一颗成熟卵子💦。`,`被催熟的卵巢一次排出了好几颗卵子😳💦。`,`卵巢像喷鱼子酱般狂喷几百颗卵子🥵💦！`,`长出带血丝的异种大肉卵了🥵💦❤️！`,`啊嘿♡……变成永动深渊下崽机器啦🥵💦❤️❤️！`], ovulStageVal), "lust", { mainName: "🥚 卵巢崩坏度", label: "🎯 受孕概率", theme: "pleas", pct: fertProb, text: `受孕率 ${fertProb}%` }),
                        mk("受精断面", `🔬 受精断面与胎盘魔化：${xrayStageVal}/100「${xrayStg}」`, fmtOvr("受精断面", `【🔬 胎盘畸变度：${xrayStageVal}/100（${xrayStg}）】：\n• 💧 宫腔储精：${wombMl}ml / ${caps.wombMax}ml`, [`子宫内部纯净安宁。`,`成千上万条精子正在围攻卵子💦！`,`最粗壮的精子已经钻破卵膜着床了😳💦。`,`几十颗卵子全都被同时受精着床了🥵💦！`,`漆黑触手精虫把卵子撕裂灌进黑毒了♡🥵💦❤️！`,`啊嘿♡……子宫内膜彻底变成吃肉的怪物胎盘啦🥵💦❤️❤️！`], xrayStageVal), "womb", { mainName: "🔬 胎盘畸变度", label: "🥛 精虫密度", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }),
                        mk("精液归属", `🧬 肌体吸精与白浊同化：${dnaStageVal}/100「${dnaStg}」`, fmtOvr("精液归属", `【🔬 白浊同化度：${dnaStageVal}/100（${dnaStg}）】：\n• 💧 四穴总储精：${totalMl}ml ｜ 来源：${totalMl > 0 ? (preg.宫内精液归属 !== "无" ? preg.宫内精液归属 : `存留 ${totalMl}ml 浓精`) : "无"}`, [`身体干干净净。`,`大腿根溅到了几滴热精液💦。`,`穴口里一缕接一缕地往外溢流拉丝😳💦。`,`全身被浓厚精液像泥浆一样糊满结痂了🥵💦！`,`毛孔张开像海绵一样把精液吸进肉里了♡🥵💦❤️！`,`啊嘿♡……下半身化作咕嘟冒泡的白浊烂肉史莱姆啦🥵💦❤️❤️！`], dnaStageVal), "drug", { mainName: "🧬 白浊同化度", label: "🥛 四穴总精", theme: "semen", pct: Math.round((totalMl / Math.max(1, totalCapAll)) * 100), text: `合计 ${totalMl}ml` }),
                        mk("孕肚进度", `🤰 破肚胎动与透明孵化巢：${pregStageVal}/100「${pregStg}」`, fmtOvr("孕肚进度", `【🔬 孵化巢畸变度：${pregStageVal}/100（${pregStg}）】：\n• 腹围膨隆度：${bellySwellPct}%（产卵/生产：${safeNum(preg.生产产卵次数)} 次）`, [`小腹平坦紧致。`,`小肚子微微鼓起一点弧度💦。`,`肚子像临盆孕妇一样高高挺起😳💦。`,`肚皮薄得像纸，里面小手脚在疯狂踢踹🥵💦！`,`肚子松垮垂到膝盖上爬满撕裂纹♡🥵💦❤️！`,`啊嘿♡……肚皮变成透明薄膜，里面翻滚着黑羊水和异种幼虫呀🥵💦❤️❤️！`], pregStageVal), "corr", { mainName: "🤰 孵化巢崩坏度", label: "🥛 腹围膨隆", theme: "semen", pct: bellySwellPct, text: `膨隆 ${bellySwellPct}%` })
                    ]
                },
                { title: "恩客图鉴", icon: "🍆", summary: clientList.length > 0 ? `已记录 ${clientList.length} 名恩客` : `暂无恩客记录`, items: clientItems },
                {
                    title: "淫乱总账", icon: "💎", summary: `小穴${vagCnt} · 内射${creampie} · 接客${hookerCnt}`,
                    items: [
                        mk("破瓜纪念", `🥀 破瓜纪念：「${vagCnt === 0 ? "🌸处女完好" : (mark.初夜破瓜纪念 && !mark.初夜破瓜纪念.includes("完好") ? mark.初夜破瓜纪念.slice(0, 16) : `🌺已破瓜(累计${vagCnt}次)`)}」`, fmtOvr("破瓜纪念", `【🔬 处女档案】：${vagCnt === 0 ? "处女膜完好无损" : (mark.初夜破瓜纪念 || `累计承受小穴贯穿 ${vagCnt} 次、内射 ${creampie} 次`)}。`, [`处女之身完好无损。`,`失去清白的那一刻有些酸涩💦。`,`早就习惯了眼下的生活😳💦。`,`被捅穿开发才是我这具身体的归宿🥵💦！`,`庆幸碍事的处女膜早就被捅烂啦🥵💦❤️！`,`啊嘿♡……注定要被操成拳头大烂肉洞的终极肉便器啦🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("六孔总账", `💎 性交总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${titCnt}／足${footCnt}」`, fmtOvr("六孔总账", `【🔬 六孔历史贯穿统计】：\n• 小穴：${vagCnt} ｜ 口交：${mouthCnt} ｜ 后庭：${analCnt} ｜ 乳交：${titCnt} ｜ 足交：${footCnt} ｜ 异种：${beastCnt}`, [`所有性交记录全为 0。`,`脸颊还是有些发热💦。`,`粘膜和肉壁早就出现不可逆松弛😳💦。`,`外翻骚穴自豪地一抽一缩，想让数字涨更快🥵💦！`,`快把三穴次数刷到成百上千次吧🥵💦❤️！`,`啊嘿♡……六个孔穴全都100%器质崩坏报废啦🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("高潮总账", `💎 高潮与失禁：「高潮${orgasmCnt}／强制${forceOrgCnt}／寸止${edgeCnt}／喷潮${squirtCnt}／失禁${leakCnt}」`, fmtOvr("高潮总账", `【🔬 高潮统计】：累计高潮 ${orgasmCnt}（强制 ${forceOrgCnt}，寸止 ${edgeCnt}），喷潮 ${squirtCnt}，失禁 ${leakCnt}，自慰 ${mastCnt}。`, [`高潮与失控记录全为 0。`,`偶尔在刺激下有些发抖💦。`,`括约肌变得越来越容易失控😳💦。`,`尾椎骨发麻，稍微刺激就漏尿喷水🥵💦！`,`最喜欢被强制操到潮吹失禁啦♡🥵💦❤️！`,`啊嘿♡……24小时都在一边翻白眼一边失禁漏尿呀🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("射精总账", `💎 射精与泌乳：「内射${creampie}／颜射${facialCnt}／吞精${swallowCnt}(${swallowMl}ml)／喷乳${milkMl}ml」`, fmtOvr("射精总账", `【🔬 射精与泌乳】：内射 ${creampie} ｜ 颜射 ${facialCnt} ｜ 吞精 ${swallowCnt}次(${swallowMl}ml) ｜ 泌乳 ${milkCnt}次(${milkMl}ml)。`, [`从未被注入过雄性体液。`,`耳根忍不住发烫💦。`,`事后清理让人疲惫酸麻😳💦。`,`早就被浓精味浸染透了🥵💦！`,`把母狗从里到外灌成白浊泡芙吧🥵💦❤️！`,`啊嘿♡……全身每一个毛孔都在往外冒浓精呀🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("露出总账", `💎 接客与轮奸：「接客${hookerCnt}／轮奸${gangCnt}／睡奸${sleepCnt}／露出${safeNum(cnt.暴露?.露出)}」`, fmtOvr("露出总账", `【🔬 交易与凌辱】：接客 ${hookerCnt} ｜ 外借 ${safeNum(cnt.交易?.被外借共享)} ｜ 轮奸 ${gangCnt} ｜ 睡奸 ${sleepCnt} ｜ 露出 ${safeNum(cnt.暴露?.露出)}。`, [`所有记录均为 0。`,`必须多加提防💦。`,`渐渐麻木并顺从这种处境😳💦。`,`已经习惯顺从这些过往了。`,`最喜欢接客和被好几个男人轮奸群交了♡🥵💦❤️！`,`啊嘿♡……全天候不打烊的公用排泄肉坑欢迎排队来操呀🥵💦❤️❤️！`]), "none", null, true, 0)
                    ]
                }
            ];

            const customMap = v.自定义条目 || {};
            baseCategories.forEach(cat => {
                const customList = Array.isArray(customMap[cat.title]) ? customMap[cat.title] : [];
                customList.forEach(cItem => {
                    if (!cItem || !cItem.id) return;
                    const rk = `${cItem.title || "✨ 自定义状态"}${cItem.ratio ? `：${cItem.ratio}` : ""}${cItem.stage ? `「${cItem.stage}」` : ""}`;
                    cat.items.push({ editKey: cItem.id, isCustom: true, catTitle: cat.title, rawKey: rk, desc: `${cItem.desc || "暂无详细描述"}\n💭【${u}的实时心声】：“*${cleanThoughtText(cItem.thought || "……")}*”`, ...fmtKey(rk, cItem.ratio ? "pleas" : "none", null, !cItem.ratio) });
                });
            });
            return baseCategories;
        }
        // =========================================================================
        // 🔧 状态栏 2.0 兼容性桥接与核心变量解析引擎补丁
        // =========================================================================
        const createDefaultVars = getInitialVars;
        const DIFFICULTY_PROFILES = DIFFICULTY_PRESETS;
        let isPanelOpen = false;
        let isSettingsOpen = false;
        const openCategorySet = new Set(["档案与风评", "恶堕与脑改", "六孔与储精"]);

        // 补齐默认悬浮球与面板坐标
        if (typeof userSettings.btnX !== "number") userSettings.btnX = Math.max(12, window.innerWidth - 68);
        if (typeof userSettings.btnY !== "number") userSettings.btnY = Math.max(80, Math.round(window.innerHeight * 0.2));
        if (typeof userSettings.panelX !== "number") userSettings.panelX = Math.max(8, Math.round((window.innerWidth - Math.min(window.innerWidth - 16, 540)) / 2));
        if (typeof userSettings.panelY !== "number") userSettings.panelY = 46;

        // 兼容图片缓存对象读取与写入
        const importedImageRegistry = new Proxy({}, {
            get(_, prop) { return importedImgCache.get(normalizeImgKey(prop)); },
            set(_, prop, val) { importedImgCache.set(normalizeImgKey(prop), val); return true; },
            ownKeys() { return Array.from(importedImgCache.keys()); },
            getOwnPropertyDescriptor() { return { enumerable: true, configurable: true }; }
        });
        async function idbPutImage(key, dataUrl) {
            return saveDataUrlToDB(key, dataUrl);
        }

        // 解析 _.set('路径', 值) 指令
        function setByPath(obj, pathArr, val) {
            let cur = obj;
            for (let i = 0; i < pathArr.length - 1; i++) {
                const k = pathArr[i];
                if (!k) continue;
                if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
                cur = cur[k];
            }
            const lastKey = pathArr[pathArr.length - 1];
            if (lastKey) cur[lastKey] = val;
        }

        function parseSetCommands(blockText, targetVars) {
            if (!blockText) return false;
            let hasSet = false;
            const reg = /_\.set\s*\(\s*(['"`])([^'"`]+)\1\s*,\s*([\s\S]*?)\)\s*;?/g;
            let m;
            while ((m = reg.exec(blockText)) !== null) {
                const rawPath = m[2].trim();
                let rawVal = m[3].trim();
                const parts = rawPath.split(".").map(s => s.trim()).filter(Boolean);
                if (parts.length > 1 && !(parts[0] in targetVars)) {
                    parts.shift(); // 自动剥离前面的角色名（如 '伊一.身体.体力' -> '身体.体力'）
                }
                if (!parts.length) continue;
                let parsedVal = rawVal;
                if (/^(?:true|false)$/i.test(rawVal)) parsedVal = rawVal.toLowerCase() === "true" ? 1 : 0;
                else if (/^-?\d+(?:\.\d+)?$/.test(rawVal)) parsedVal = Number(rawVal);
                else if ((rawVal.startsWith("'") && rawVal.endsWith("'")) || (rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("`") && rawVal.endsWith("`"))) {
                    parsedVal = rawVal.slice(1, -1);
                } else {
                    try { parsedVal = JSON.parse(rawVal); } catch (e) { parsedVal = rawVal.replace(/^['"`]|['"`]$/g, ""); }
                }
                setByPath(targetVars, parts, parsedVal);
                hasSet = true;
            }
            return hasSet;
        }

        function extractFromLegacyText(mesText, targetVars) {
            if (!mesText) return;
            const hasExplicit = /<UpdateVariable>[\s\S]*?<\/UpdateVariable>|_\.set\s*\(/i.test(mesText);
            applyNaturalMetabolism(mesText, targetVars, hasExplicit);
        }
        function getFallbackData() {
            const ctx = safeCtx(), trueProtagName = detectProtagonistName(curVars), c = ctx?.name2 || "无角色卡";
            return {
                charName: trueProtagName,
                floorId: checkCardAvailable(true) ? (viewingHistoryFloor !== null ? `#${viewingHistoryFloor}层(回溯)` : `${c} · 实时`) : "未选择角色卡",
                categories: buildFullFallbackCategories(trueProtagName, c, curVars)
            };
        }

        function applyThemeAndSize() {
            const root = document.getElementById("st-v5-root");
            if (root) root.style.display = userSettings.enabled ? "block" : "none";
            const panel = document.getElementById("st-v5-panel"), headerBar = document.getElementById("st-v5-header");
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            if (panel) {
                panel.className = (tc.cls || "st-theme-succubus") + (userSettings.mobileLiteMode ? " st-lite-mode" : "");
                panel.style.background = tc.bg;
                panel.style.border = tc.border;
                panel.style.borderRadius = tc.radius;
                panel.style.boxShadow = tc.shadow;
                panel.style.color = tc.text;
                panel.style.width = `${Math.min(window.innerWidth - 12, userSettings.width)}px`;
                panel.style.height = `${Math.min(window.innerHeight - 75, userSettings.height)}px`;
                panel.style.fontSize = `${Math.round(13.5 * (userSettings.fontScale / 100))}px`;
                panel.style.backdropFilter = userSettings.mobileLiteMode ? "none" : "blur(14px)";
            }
            if (headerBar && tc.headerBg) headerBar.style.background = tc.headerBg;
            const tb = document.getElementById("st-v5-toggle");
            if (tb) {
                tb.style.background = `linear-gradient(135deg, ${tc.prim}, ${tc.sec})`;
                tb.style.boxShadow = `0 6px 20px ${tc.hi}`;
            }
        }

        function getNormalizedEndpoints(rawUrl) {
            let u = safeStr(rawUrl).trim().replace(/\/+$/, "");
            if (!u) return { chatUrl: "", modelsUrl: "" };
            let base = u.replace(/\/chat\/completions$/i, "").replace(/\/models$/i, "").replace(/\/+$/, "");
            if (!/\/v\d+(?:beta)?$/i.test(base) && !base.includes("/v1")) base += "/v1";
            return { chatUrl: u.toLowerCase().endsWith("/chat/completions") ? u : `${base}/chat/completions`, modelsUrl: `${base}/models` };
        }

        function repairAndParseJson(rawText) {
            if (!rawText) return null;
            let s = safeStr(rawText).replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|```json|```/gi, "").trim();
            const firstBrace = s.indexOf("{"), lastBrace = s.lastIndexOf("}");
            if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
            let jsonCand = s.slice(firstBrace, lastBrace + 1);
            try { return JSON.parse(jsonCand); } catch (e1) {}
            let fixed = jsonCand.replace(/,\s*([}\]])/g, "$1").replace(/\r?\n/g, " ");
            try { return JSON.parse(fixed); } catch (e2) {}
            try {
                let out = "", inStr = false;
                for (let i = 0; i < fixed.length; i++) {
                    const ch = fixed[i];
                    if (ch === "\\" && i + 1 < fixed.length) { out += ch + fixed[i + 1]; i++; continue; }
                    if (ch === '"') {
                        if (!inStr) { inStr = true; out += ch; }
                        else {
                            const rest = fixed.slice(i + 1).trimStart();
                            if (/^[:,}\]]/.test(rest)) { inStr = false; out += ch; } else out += "”";
                        }
                    } else out += ch;
                }
                return JSON.parse(out);
            } catch (e3) { return null; }
        }

        async function callSubApiRaw(systemPrompt, userPrompt) {
            const { chatUrl } = getNormalizedEndpoints(userSettings.apiUrl);
            if (!chatUrl || !userSettings.apiKey) throw new Error("请先在 ⚙️设置 中填写副 API 地址和 Key！");
            const res = await fetch(chatUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userSettings.apiKey}` },
                body: JSON.stringify({ model: userSettings.apiModel || "gpt-4o-mini", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], temperature: 0.35, stream: false })
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
            const ctx = safeCtx(), u = detectProtagonistName(curVars), realId = detectRealCharacterIdentity(curVars), corr = safeNum(curVars.核心数值?.淫乱恶堕, 0);
            const personaAndDesc = safeStr(ctx?.power_user?.persona_description) + "\n" + safeStr(ctx?.characters?.[ctx?.characterId]?.description).slice(0, 800);
            const recentMes = (personaAndDesc + "\n" + safeStr((ctx?.chat || []).slice(-6).map(m => m?.mes || "").join("\n"))).slice(-3200);
            const sysPrompt = "你是一个纯粹的 JSON 生成器，必须且只能输出一个标准 JSON 对象！字符串内部严禁出现英文双引号或换行符！";
            const userPrompt = `请根据当前剧情与【自定义要求】，为主角【${u}（身份：${realId}，恶堕度：${corr}/100，人格模式：${userSettings.personaMode}）】的【${itemTitle}】编写状态描述（120~180字）和第一人称心声（80~130字）：\n【要求】：${userHint || "结合当前最新剧情"}\n【参考】：${recentMes || "无"}\n输出纯JSON：{"title":"${safeStr(itemTitle).replace(/"/g,"")}","stage":"4至6字概括","ratio":"50/100","desc":"【🔬 状态实况】：...","thought":"第一人称内心独白..."}`;
            const oldTxt = btnEl ? btnEl.textContent : "", isMiniBtn = oldTxt.trim() === "🔄";
            if (btnEl) { btnEl.textContent = isMiniBtn ? "⏳" : "⏳ 生成中..."; btnEl.disabled = true; }
            try {
                const { reply } = await callSubApiRaw(sysPrompt, userPrompt);
                const parsed = repairAndParseJson(reply);
                if (parsed && (parsed.desc || parsed.thought)) { showToast("✨ 已刷新该项状态与心声！", "success", 2400); return parsed; }
                throw new Error("返回格式未能解析为JSON");
            } catch (err) { showToast("❌ 生成失败：" + (err.message || "请检查副API设置"), "error", 3500); return null; }
            finally { if (btnEl) { btnEl.textContent = oldTxt || "✨ AI生成"; btnEl.disabled = false; } }
        }

        function buildFullJsonApiPrompt(u, c, rawText) {
            const realId = detectRealCharacterIdentity(curVars), allRecentText = (safeCtx()?.chat || []).slice(-5).map(m => safeStr(m?.mes)).join("\n");
            return `[SYSTEM OVERRIDE: 纯粹JSON生成器，严禁双引号或换行符]\n请阅读下方正文，重构更新主角【${u}（${realId}）】全部状态栏数值与历史计数：\n${safeStr(allRecentText || rawText).slice(-3500)}\n输出纯JSON：{"当前认知名字":"${u}","种族与体质":"${realId}","生理周期阶段":"危险排卵期或正常生理期","受孕概率":50,"体力":75,"对肉棒好感度":75,"性欲程度":80,"淫乱恶堕":78,"羞耻度":22,"服从度":74,"沦陷度":70,"快感累积":65,"口内毫升":0,"小穴毫升":5,"子宫毫升":15,"屁眼毫升":0,"体表痕迹":"无","淫纹与刻印":"无","穿刺与环饰":"无","体内道具":"无","计数":{"口":0,"小穴":0,"屁眼":0,"乳穴":0,"足腿":0,"高潮":0,"强制高潮":0,"寸止":0,"内射":0,"颜射":0,"吞精次数":0,"吞精毫升":0,"喷乳次数":0,"喷乳毫升":0,"自慰":0,"失禁":0,"喷潮":0,"露出":0,"接客":0,"轮奸":0,"睡奸":0},"当前姿势":"简短概括","恩客图鉴":{},"按钮详情":{}}`;
        }

        function applyApiFullResponse(replyText, targetMsg, fid, sourceLabel = "副API") {
            const data = repairAndParseJson(replyText);
            if (!data || typeof data !== "object") return false;
            const v = curVars;
            if (!v.档案.手动锁定真名 && data.当前认知名字) v.档案.当前认知名字 = safeStr(data.当前认知名字).trim();
            if (data.种族与体质) v.档案.种族与体质 = safeStr(data.种族与体质).trim();
            if (data.生理周期阶段) v.受孕与生理.生理周期阶段 = safeStr(data.生理周期阶段);
            if (typeof data.受孕概率 === "number") v.受孕与生理.受孕概率 = data.受孕概率;
            if (data.计数 && typeof data.计数 === "object") {
                const c = data.计数;
                if (typeof c.口 === "number") v.计数.性交.口 = c.口;
                if (typeof c.小穴 === "number") v.计数.性交.小穴 = c.小穴;
                if (typeof c.屁眼 === "number") v.计数.性交.屁眼 = c.屁眼;
                if (typeof c.乳穴 === "number") v.计数.性交.乳穴 = c.乳穴;
                if (typeof c.足腿 === "number") v.计数.性交.足腿 = c.足腿;
                if (typeof c.高潮 === "number") v.计数.高潮.总数 = c.高潮;
                if (typeof c.内射 === "number") v.计数.射精.内射 = c.内射;
                if (typeof c.吞精次数 === "number") v.计数.精液摄入.吞精次数 = c.吞精次数;
                if (typeof c.失禁 === "number") v.计数.失控.失禁 = c.失禁;
                if (typeof c.喷潮 === "number") v.计数.失控.喷潮 = c.喷潮;
                if (typeof c.接客 === "number") v.计数.交易.接客卖身 = c.接客;
            }
            if (typeof data.体力 === "number") v.身体.体力 = data.体力;
            if (typeof data.对肉棒好感度 === "number") v.核心数值.对肉棒好感度 = data.对肉棒好感度;
            if (typeof data.性欲程度 === "number") v.核心数值.性欲程度 = data.性欲程度;
            if (typeof data.淫乱恶堕 === "number") v.核心数值.淫乱恶堕 = data.淫乱恶堕;
            if (typeof data.羞耻度 === "number") v.精神与心理.羞耻度 = data.羞耻度;
            if (typeof data.服从度 === "number") v.精神与心理.服从度 = data.服从度;
            if (typeof data.沦陷度 === "number") v.精神与心理.沦陷度 = data.沦陷度;
            if (typeof data.快感累积 === "number") v.精神与心理.快感累积 = data.快感累积;
            calibrateMentalMetrics(v);
            if (typeof data.口内毫升 === "number") v.体内精液存量.口内毫升 = data.口内毫升;
            if (typeof data.小穴毫升 === "number") v.体内精液存量.小穴毫升 = data.小穴毫升;
            if (typeof data.子宫毫升 === "number") v.体内精液存量.子宫毫升 = data.子宫毫升;
            if (typeof data.屁眼毫升 === "number") v.体内精液存量.屁眼毫升 = data.屁眼毫升;
            if (data.当前姿势) v.实况.当前姿势 = safeStr(data.当前姿势);
            if (data.体表痕迹) v.痕迹与标记.体表痕迹 = safeStr(data.体表痕迹);
            if (data.淫纹与刻印) v.痕迹与标记.淫纹与刻印 = safeStr(data.淫纹与刻印);
            if (data.穿刺与环饰) v.痕迹与标记.穿刺与环饰 = safeStr(data.穿刺与环饰);
            if (data.体内道具) v.体内道具与权限.体内道具 = safeStr(data.体内道具);
            if (data.恩客图鉴 && typeof data.恩客图鉴 === "object") v.恩客图鉴 = { ...(v.恩客图鉴 || {}), ...data.恩客图鉴 };
            if (data.按钮详情 && typeof data.按钮详情 === "object") {
                Object.keys(data.按钮详情).forEach(k => {
                    const prev = v.按钮详情?.[k] || {};
                    v.按钮详情[k] = { ...data.按钮详情[k], ...(prev.customTitle ? { customTitle: prev.customTitle } : {}), ...(prev.imgUrl ? { imgUrl: prev.imgUrl } : {}) };
                });
            }
            saveChatCache(v); latestStatus = getFallbackData(); renderBody();
            showToast(`✅ ${sourceLabel}重绘完成！`, "success", 2800);
            return true;
        }

        async function triggerSubApiUpdate(btnEl = null) {
            if (!checkCardAvailable(false)) return;
            const ctx = safeCtx(), chat = ctx?.chat || [], fid = chat.length - 1, targetMsg = chat[fid], rawText = safeStr(targetMsg?.mes);
            const u = detectProtagonistName(curVars), c = ctx?.name2 || "角色", oldTxt = btnEl ? btnEl.textContent : "";
            if (btnEl) btnEl.textContent = "⏳ 重绘中...";
            showToast(`⏳ 正在通过副 API 为【${u}】重绘状态...`, "info", 3800);
            try {
                const { reply, source } = await callSubApiRaw("只输出标准 JSON 对象的状态栏实时重绘引擎。", buildFullJsonApiPrompt(u, c, rawText));
                const ok = applyApiFullResponse(reply, targetMsg, fid, source);
                if (btnEl) btnEl.textContent = ok ? "✅ 重绘成功" : "⚠️ 已自动修复";
            } catch (err) {
                if (btnEl) btnEl.textContent = "❌ 失败";
                showToast("❌ 副API重绘失败：" + (err.message || "请检查设置"), "error", 3800);
            }
            if (btnEl && oldTxt) setTimeout(() => { btnEl.textContent = oldTxt; }, 2500);
        }

        async function fetchModelList(btnEl, selectEl, inputEl) {
            const rawUrl = inputEl ? inputEl.value.trim() : userSettings.apiUrl, apiKey = document.getElementById("st-api-key")?.value.trim() || userSettings.apiKey;
            const { modelsUrl } = getNormalizedEndpoints(rawUrl);
            if (!modelsUrl) { showToast("⚠️ 请先填写有效的副 API 地址！", "error"); return; }
            if (btnEl) btnEl.textContent = "⏳ 拉取中...";
            try {
                const headers = { "Accept": "application/json" };
                if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
                const res = await fetch(modelsUrl, { method: "GET", headers }), data = JSON.parse(await res.text());
                const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.models) ? data.models : []);
                const ids = list.map(m => typeof m === "string" ? m : (m?.id || m?.name || "")).filter(Boolean);
                if (!ids.length) throw new Error("未找到可用模型");
                userSettings.modelList = ids;
                if (!userSettings.apiModel || !ids.includes(userSettings.apiModel)) userSettings.apiModel = ids[0];
                saveSettings();
                if (selectEl) { selectEl.innerHTML = ids.map(id => `<option value="${id}" ${id === userSettings.apiModel ? "selected" : ""}>${id}</option>`).join(""); selectEl.style.display = "block"; }
                const modInput = document.getElementById("st-api-mod"); if (modInput) modInput.value = userSettings.apiModel;
                if (btnEl) btnEl.textContent = `✅ 已拉取(${ids.length})`;
                showToast(`✅ 成功拉取 ${ids.length} 个模型！`, "success");
            } catch (err) { if (btnEl) btnEl.textContent = "❌ 失败"; showToast("❌ 拉取模型失败：" + (err.message || "网络错误"), "error", 3800); }
        }

        function getStageImageCandidates(item) {
            const manualUrl = safeStr(item.isCustom ? curVars.自定义条目?.[item.catTitle]?.find(x => x.id === item.editKey)?.imgUrl : curVars.按钮详情?.[item.editKey]?.imgUrl).trim();
            if (manualUrl) { const hitManual = queryImportedImage(manualUrl); return hitManual ? [hitManual, manualUrl] : [manualUrl]; }
            if (!item.editKey) return [];
            const pct = (item.pct !== null && item.pct !== undefined) ? item.pct : 0;
            const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
            const stageIdx = item.hasStageBar ? tier6(pct, isRev) : 0, stageNum = stageIdx + 1, baseFolder = `${PLUGIN_BASE_PATH}/images`, candidates = [];
            for (let s = stageNum; s >= 1; s--) { const fh = queryImportedImage(`${item.editKey}_${s}`); if (fh && !candidates.includes(fh)) candidates.push(fh); }
            const hg = queryImportedImage(item.editKey); if (hg && !candidates.includes(hg)) candidates.push(hg);
            const presetArr = DEFAULT_STAGE_IMAGES[item.editKey];
            if (Array.isArray(presetArr)) {
                for (let s = stageIdx; s >= 0; s--) {
                    const entry = safeStr(presetArr[s]).trim(); if (!entry) continue;
                    const hp = queryImportedImage(entry); if (hp && !candidates.includes(hp)) candidates.push(hp);
                    if (entry.startsWith("http") || entry.startsWith("data:") || entry.startsWith("/")) candidates.push(entry);
                    else if (/\.(?:webp|png|gif|jpg|jpeg)$/i.test(entry)) candidates.push(`${baseFolder}/${entry}`);
                    else candidates.push(`${baseFolder}/${entry}.webp`, `${baseFolder}/${entry}.png`, `${baseFolder}/${entry}.gif`, `${baseFolder}/${entry}.jpg`);
                }
            }
            candidates.push(`${baseFolder}/${item.editKey}_${stageNum}.webp`, `${baseFolder}/${item.editKey}_${stageNum}.png`, `${baseFolder}/${item.editKey}.webp`, `${baseFolder}/${item.editKey}.png`);
            return [...new Set(candidates)];
        }

        function openTrueFullscreenImage(imgSrc) {
            if (!imgSrc) return;
            let lb = document.getElementById("st-v25-fullscreen-lightbox");
            if (!lb) {
                lb = document.createElement("div"); lb.id = "st-v25-fullscreen-lightbox";
                lb.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;background:#000;display:none;flex-direction:column;justify-content:center;align-items:center;overflow:auto;touch-action:pan-x pan-y pinch-zoom;";
                document.body.appendChild(lb);
            }
            lb.innerHTML = `<div style="position:fixed;top:14px;right:14px;z-index:2147483647;display:flex;gap:8px;"><button id="st-lb-mode-btn" type="button" style="background:rgba(243,139,168,0.94);color:#11111b;border:none;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">🔍 切换比例</button><button id="st-lb-close-btn" type="button" style="background:rgba(20,16,32,0.88);color:#fff;border:1.5px solid #f38ba8;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">关闭 ✕</button></div><img id="st-lb-full-img" src="${imgSrc}" style="width:100vw;height:auto;object-fit:contain;display:block;margin:auto;">`;
            lb.style.display = "flex";
            const fullImg = lb.querySelector("#st-lb-full-img"), modeBtn = lb.querySelector("#st-lb-mode-btn");
            let curMode = 0;
            modeBtn.onclick = (e) => {
                e.stopPropagation(); curMode = (curMode + 1) % 3;
                if (curMode === 0) { fullImg.style.width = "100vw"; fullImg.style.height = "auto"; fullImg.style.objectFit = "contain"; modeBtn.textContent = "🔍 铺满屏幕"; }
                else if (curMode === 1) { fullImg.style.width = "100vw"; fullImg.style.height = "100vh"; fullImg.style.objectFit = "cover"; modeBtn.textContent = "🔍 200%特写"; }
                else { fullImg.style.width = "200vw"; fullImg.style.height = "auto"; modeBtn.textContent = "🔄 恢复原始"; }
            };
            lb.querySelector("#st-lb-close-btn").onclick = (e) => { e.stopPropagation(); lb.style.display = "none"; };
            fullImg.onclick = () => { lb.style.display = "none"; };
        }
        function showDetailPopup(item) {
            const modal = document.getElementById("st-v5-modal");
            if (!modal) return;
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            const u = detectProtagonistName(curVars);
            const parts = safeStr(item.desc).split("💭"), objText = safeStr(parts[0]).trim();
            const thoughtText = parts[1] ? cleanThoughtText(parts[1].replace(/【.*?实时心声】：/g, "").replace(/[“”"]/g, "").trim()) : "……";
            const customRec = item.isCustom ? curVars.自定义条目?.[item.catTitle]?.find(x => x.id === item.editKey) : null;
            const overrideRec = customRec || curVars.按钮详情?.[item.editKey] || {};
            const candidates = getStageImageCandidates(item);
            const curPct = (item.pct !== null && item.pct !== undefined) ? item.pct : 0;
            const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
            const curStageIdx = (item.hasStageBar ? tier6(curPct, isRev) : 0) + 1;

            const box = modal.querySelector(".st-modal-box");
            box.style.background = tc.bg;
            box.style.border = tc.border;
            box.style.color = tc.text;
            box.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.12);">
                    <div style="font-size:15px;font-weight:bold;color:#f9e2af;word-break:break-word;">${item.cleanTitle || item.rawKey}</div>
                    <button id="st-det-close" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:8px;padding:4px 10px;font-size:12px;cursor:pointer;">✕</button>
                </div>
                ${item.barHTML || ""}
                <div id="st-det-img-wrap" style="margin-top:10px;display:flex;flex-direction:column;gap:6px;background:rgba(0,0,0,0.32);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                        <span style="font-size:11.5px;color:${tc.prim};font-weight:bold;">🖼️ 部位实况配图（第 ${curStageIdx} 阶）</span>
                        <div style="display:flex;gap:5px;flex-wrap:wrap;">
                            <button id="st-det-zhj-gen" type="button" style="background:linear-gradient(135deg,#f59e0b,#ec4899);color:#fff;border:none;border-radius:6px;padding:3px 9px;font-size:11px;font-weight:bold;cursor:pointer;">🎨 智绘姬重绘</button>
                            <button id="st-det-copy-tag" type="button" style="background:rgba(255,255,255,0.1);color:#f9e2af;border:1px solid rgba(249,226,175,0.4);border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">📋 复制Tag</button>
                        </div>
                    </div>
                    <img id="st-det-stage-img" style="display:none;width:100%;max-height:240px;object-fit:contain;border-radius:8px;cursor:zoom-in;background:#0a0612;" alt="部位实况">
                    <div id="st-det-img-placeholder" style="font-size:11.5px;color:#a6adc8;padding:12px 8px;text-align:center;border:1px dashed rgba(255,255,255,0.15);border-radius:8px;">暂无本地或缓存实况图，可点击「🎨 智绘姬重绘」直接生成，或在下方填入图片链接/导入图片包。</div>
                </div>
                <div style="margin-top:10px;background:rgba(0,0,0,0.28);border-radius:10px;padding:10px;border:1px solid rgba(255,255,255,0.08);line-height:1.65;font-size:12.5px;white-space:pre-wrap;word-break:break-word;">${objText}</div>
                <div style="margin-top:8px;background:rgba(243,139,168,0.1);border-left:3px solid ${tc.prim};border-radius:0 8px 8px 0;padding:8px 10px;font-size:12.5px;line-height:1.6;color:#ffd6e4;">
                    <div style="font-weight:bold;font-size:11.5px;color:${tc.prim};margin-bottom:2px;">💭 ${u} 的实时心声：</div>
                    <div>“*${thoughtText}*”</div>
                </div>
                <div style="margin-top:12px;border-top:1px dashed rgba(255,255,255,0.12);padding-top:10px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:12px;font-weight:bold;color:#f9e2af;">✏️ 编辑 / 上帝覆写 / 副API微调</span>
                        <button id="st-det-ai-btn" type="button" style="background:rgba(203,166,247,0.2);color:#cba6f7;border:1px solid #cba6f7;border-radius:6px;padding:3px 9px;font-size:11px;cursor:pointer;">✨ 副API生成</button>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
                        <input id="st-ed-stage" value="${safeStr(overrideRec.stage).replace(/"/g, "&quot;")}" placeholder="阶位标签（如：彻底崩坏）" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:12px;">
                        <input id="st-ed-img" value="${safeStr(overrideRec.imgUrl).replace(/"/g, "&quot;")}" placeholder="绑定图片名/URL" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:12px;">
                    </div>
                    <textarea id="st-ed-desc" rows="3" placeholder="自定义详细实况描述..." style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;margin-bottom:6px;">${safeStr(overrideRec.desc || objText)}</textarea>
                    <textarea id="st-ed-thought" rows="2" placeholder="自定义第一人称心声..." style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;margin-bottom:8px;">${safeStr(overrideRec.thought || thoughtText)}</textarea>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
                        ${item.isClient ? `<button id="st-det-block-client" type="button" style="background:rgba(243,139,168,0.2);color:#ff85a1;border:1px solid #ff4d6d;border-radius:6px;padding:5px 10px;font-size:11.5px;cursor:pointer;margin-right:auto;">🚫 屏蔽此恩客</button>` : ""}
                        ${item.isCustom ? `<button id="st-det-del-custom" type="button" style="background:rgba(243,139,168,0.2);color:#ff85a1;border:1px solid #ff4d6d;border-radius:6px;padding:5px 10px;font-size:11.5px;cursor:pointer;margin-right:auto;">🗑️ 删除自定义</button>` : ""}
                        <button id="st-det-reset" type="button" style="background:rgba(255,255,255,0.1);color:#cdd6f4;border:none;border-radius:6px;padding:5px 10px;font-size:11.5px;cursor:pointer;">↩️ 恢复默认</button>
                        <button id="st-det-save" type="button" style="background:${tc.prim};color:#11111b;border:none;border-radius:6px;padding:5px 14px;font-size:11.5px;font-weight:bold;cursor:pointer;">💾 保存覆写</button>
                    </div>
                </div>
            `;
            modal.style.display = "flex";

            const imgEl = box.querySelector("#st-det-stage-img"), phEl = box.querySelector("#st-det-img-placeholder");
            let candIdx = 0;
            const tryNextImg = () => {
                if (candIdx >= candidates.length) { imgEl.style.display = "none"; phEl.style.display = "block"; return; }
                imgEl.src = candidates[candIdx++];
            };
            imgEl.onload = () => { imgEl.style.display = "block"; phEl.style.display = "none"; };
            imgEl.onerror = tryNextImg;
            imgEl.onclick = () => openTrueFullscreenImage(imgEl.src);
            if (candidates.length > 0) tryNextImg();

            box.querySelector("#st-det-close").onclick = () => { modal.style.display = "none"; };
            box.querySelector("#st-det-copy-tag").onclick = async () => {
                const block = buildDanbooruImageBlock(item, curStageIdx, u);
                try { await navigator.clipboard.writeText(block); showToast("📋 已复制智绘姬 <image> Tag 块！", "success"); }
                catch (e) { showToast("⚠️ 复制失败，请手动触发智绘姬生成", "error"); }
            };
            box.querySelector("#st-det-zhj-gen").onclick = () => {
                sendPromptToZhiHuiJi(item, curStageIdx, u);
            };
            box.querySelector("#st-det-ai-btn").onclick = async (e) => {
                const hint = prompt("输入希望副API侧重描写的方向（可留空直接按当前剧情生成）：", "");
                if (hint === null) return;
                const res = await requestSingleItemAiGen(item.cleanTitle || item.rawKey, hint, e.target);
                if (res) {
                    if (res.stage) box.querySelector("#st-ed-stage").value = res.stage;
                    if (res.desc) box.querySelector("#st-ed-desc").value = res.desc;
                    if (res.thought) box.querySelector("#st-ed-thought").value = res.thought;
                }
            };
            box.querySelector("#st-det-save").onclick = () => {
                const stg = box.querySelector("#st-ed-stage").value.trim(), im = box.querySelector("#st-ed-img").value.trim();
                const dsc = box.querySelector("#st-ed-desc").value.trim(), tht = box.querySelector("#st-ed-thought").value.trim();
                if (item.isCustom && customRec) {
                    if (stg) customRec.stage = stg;
                    customRec.imgUrl = im; customRec.desc = dsc; customRec.thought = tht;
                } else {
                    curVars.按钮详情[item.editKey] = { ...(curVars.按钮详情[item.editKey] || {}), stage: stg, imgUrl: im, desc: dsc, thought: tht };
                }
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                showToast("💾 已保存该条目覆写！", "success");
            };
            box.querySelector("#st-det-reset").onclick = () => {
                if (curVars.按钮详情?.[item.editKey]) delete curVars.按钮详情[item.editKey];
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                showToast("↩️ 已恢复系统动态计算描述", "info");
            };
            const blkBtn = box.querySelector("#st-det-block-client");
            if (blkBtn) blkBtn.onclick = () => {
                if (!curVars.已屏蔽恩客.includes(item.clientName)) curVars.已屏蔽恩客.push(item.clientName);
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                showToast(`🚫 已屏蔽恩客【${item.clientName}】`, "info");
            };
            const delBtn = box.querySelector("#st-det-del-custom");
            if (delBtn) delBtn.onclick = () => {
                curVars.自定义条目[item.catTitle] = (curVars.自定义条目[item.catTitle] || []).filter(x => x.id !== item.editKey);
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                showToast("🗑️ 已删除自定义条目", "info");
            };
        }

        function openAddCustomItemModal(catTitle) {
            const modal = document.getElementById("st-v5-modal");
            if (!modal) return;
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            const box = modal.querySelector(".st-modal-box");
            box.style.background = tc.bg; box.style.border = tc.border; box.style.color = tc.text;
            box.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.12);">
                    <div style="font-size:15px;font-weight:bold;color:#f9e2af;">➕ 新增自定义条目（${catTitle}）</div>
                    <button id="st-add-close" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:8px;padding:4px 10px;cursor:pointer;">✕</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">
                    <input id="st-add-title" placeholder="条目标题（如：✨ 特殊纹身烙印）" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:7px 9px;color:#fff;font-size:12.5px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                        <input id="st-add-stage" placeholder="阶段徽章（如：深度刻痕）" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;">
                        <input id="st-add-ratio" placeholder="进度比例（如：65/100，可留空）" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;">
                    </div>
                    <textarea id="st-add-desc" rows="3" placeholder="详细生理或心理状态描述..." style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:7px 9px;color:#fff;font-size:12px;"></textarea>
                    <textarea id="st-add-thought" rows="2" placeholder="第一人称实时心声..." style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:7px 9px;color:#fff;font-size:12px;"></textarea>
                    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:4px;">
                        <button id="st-add-ai" type="button" style="background:rgba(203,166,247,0.2);color:#cba6f7;border:1px solid #cba6f7;border-radius:6px;padding:6px 12px;font-size:12px;cursor:pointer;">✨ 副API生成</button>
                        <button id="st-add-save" type="button" style="background:${tc.prim};color:#11111b;border:none;border-radius:6px;padding:6px 16px;font-size:12px;font-weight:bold;cursor:pointer;">💾 添加条目</button>
                    </div>
                </div>`;
            modal.style.display = "flex";
            box.querySelector("#st-add-close").onclick = () => { modal.style.display = "none"; };
            box.querySelector("#st-add-ai").onclick = async (e) => {
                const t = box.querySelector("#st-add-title").value.trim() || "自定义状态";
                const res = await requestSingleItemAiGen(t, "请结合当前最新剧情创作", e.target);
                if (res) {
                    if (res.stage) box.querySelector("#st-add-stage").value = res.stage;
                    if (res.ratio) box.querySelector("#st-add-ratio").value = res.ratio;
                    if (res.desc) box.querySelector("#st-add-desc").value = res.desc;
                    if (res.thought) box.querySelector("#st-add-thought").value = res.thought;
                }
            };
            box.querySelector("#st-add-save").onclick = () => {
                const title = box.querySelector("#st-add-title").value.trim() || "✨ 自定义条目";
                curVars.自定义条目[catTitle] = curVars.自定义条目[catTitle] || [];
                curVars.自定义条目[catTitle].push({
                    id: "custom_" + Date.now(), title,
                    stage: box.querySelector("#st-add-stage").value.trim(),
                    ratio: box.querySelector("#st-add-ratio").value.trim(),
                    desc: box.querySelector("#st-add-desc").value.trim(),
                    thought: box.querySelector("#st-add-thought").value.trim()
                });
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                showToast("✅ 已新增自定义状态条目！", "success");
            };
        }

        function renderSettingsView(bodyEl) {
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            const themeOpts = Object.keys(THEMES).map(k => `<option value="${k}" ${userSettings.theme === k ? "selected" : ""}>${k}</option>`).join("");
            const modeOpts = Object.entries(RUIN_PERSONA_MODES).map(([k, v]) => `<option value="${k}" ${userSettings.personaMode === k ? "selected" : ""}>${v.label}</option>`).join("");
            const diffOpts = Object.entries(DIFFICULTY_PROFILES).map(([k, v]) => `<option value="${k}" ${userSettings.difficultyMode === k ? "selected" : ""}>${v.fullLabel}</option>`).join("");
            bodyEl.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:10px;padding:4px;">
                    <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px;">
                        <div style="font-weight:bold;color:${tc.prim};margin-bottom:8px;font-size:13px;">🎨 外观、排版与手机流畅优化</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">
                            <label>皮肤主题<select id="st-set-theme" style="width:100%;margin-top:3px;background:#1a1525;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:4px;">${themeOpts}</select></label>
                            <label>心声人格<select id="st-set-persona" style="width:100%;margin-top:3px;background:#1a1525;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:4px;">${modeOpts}</select></label>
                            <label>崩坏难度<select id="st-set-diff" style="width:100%;margin-top:3px;background:#1a1525;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:4px;">${diffOpts}</select></label>
                            <label>字体缩放(${userSettings.fontScale}%)<input id="st-set-fscale" type="range" min="80" max="130" value="${userSettings.fontScale}" style="width:100%;margin-top:6px;"></label>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;font-size:12px;">
                            <label style="display:flex;align-items:center;gap:4px;"><input id="st-set-compact" type="checkbox" ${userSettings.compactCards ? "checked" : ""}> 紧凑双列卡片</label>
                            <label style="display:flex;align-items:center;gap:4px;"><input id="st-set-lite" type="checkbox" ${userSettings.mobileLiteMode ? "checked" : ""}> 手机省电模式(关特效)</label>
                            <label style="display:flex;align-items:center;gap:4px;"><input id="st-set-revprompt" type="checkbox" ${userSettings.injectReversePrompt ? "checked" : ""}> 注入肉体铁律</label>
                            <label style="display:flex;align-items:center;gap:4px;"><input id="st-set-cmpprompt" type="checkbox" ${userSettings.compactPromptMode ? "checked" : ""}> 省Token提示词</label>
                        </div>
                    </div>
                    <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px;">
                        <div style="font-weight:bold;color:#f9e2af;margin-bottom:8px;font-size:13px;">🤖 副API 实时解析与重绘设置</div>
                        <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;">
                            <input id="st-api-url" value="${safeStr(userSettings.apiUrl)}" placeholder="API 地址（如 https://api.openai.com/v1）" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;">
                            <input id="st-api-key" type="password" value="${safeStr(userSettings.apiKey)}" placeholder="API Key (sk-...)" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;">
                            <div style="display:flex;gap:6px;">
                                <input id="st-api-mod" value="${safeStr(userSettings.apiModel)}" placeholder="模型名称" style="flex:1;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;">
                                <button id="st-fetch-models" type="button" style="background:rgba(137,180,250,0.2);color:#89b4fa;border:1px solid #89b4fa;border-radius:6px;padding:4px 10px;font-size:11.5px;cursor:pointer;">拉取模型</button>
                            </div>
                            <select id="st-model-sel" style="display:none;background:#1a1525;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px;"></select>
                            <label style="display:flex;align-items:center;gap:4px;"><input id="st-set-autoapi" type="checkbox" ${userSettings.autoCallApiOnNewMsg ? "checked" : ""}> 新消息自动触发副API重绘</label>
                        </div>
                    </div>
                    <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px;">
                        <div style="font-weight:bold;color:#f59e0b;margin-bottom:6px;font-size:13px;">🎨 智绘姬与本地图包管理（已缓存 ${Object.keys(importedImageRegistry).length} 张）</div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
                            <input id="st-zhj-fn" value="${safeStr(userSettings.zhihuijiGlobalFn)}" placeholder="智绘姬全局函数名(选填)" style="flex:1;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:12px;">
                            <button id="st-import-imgs-btn" type="button" style="background:rgba(166,227,161,0.2);color:#a6e3a1;border:1px solid #a6e3a1;border-radius:6px;padding:5px 10px;font-size:11.5px;cursor:pointer;">📁 批量导入图片</button>
                            <input id="st-import-imgs-input" type="file" multiple accept="image/*" style="display:none;">
                        </div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;">
                            <button id="st-lock-name-btn" type="button" style="background:rgba(249,226,175,0.15);color:#f9e2af;border:1px solid rgba(249,226,175,0.4);border-radius:6px;padding:5px 10px;font-size:11.5px;cursor:pointer;">🔒 锁定真名(${detectProtagonistName(curVars)})</button>
                            <button id="st-reset-vars-btn" type="button" style="background:rgba(243,139,168,0.2);color:#ff85a1;border:1px solid #ff4d6d;border-radius:6px;padding:5px 10px;font-size:11.5px;cursor:pointer;">🧹 重置本会话变量</button>
                        </div>
                    </div>
                    <button id="st-save-all-settings" type="button" style="background:linear-gradient(135deg,${tc.prim},${tc.sec});color:#11111b;border:none;border-radius:8px;padding:9px;font-size:13px;font-weight:bold;cursor:pointer;">💾 保存所有设置并返回面板</button>
                </div>`;

            const selEl = bodyEl.querySelector("#st-model-sel"), modEl = bodyEl.querySelector("#st-api-mod");
            bodyEl.querySelector("#st-fetch-models").onclick = (e) => fetchModelList(e.target, selEl, bodyEl.querySelector("#st-api-url"));
            selEl.onchange = () => { modEl.value = selEl.value; };
            bodyEl.querySelector("#st-import-imgs-btn").onclick = () => bodyEl.querySelector("#st-import-imgs-input").click();
            bodyEl.querySelector("#st-import-imgs-input").onchange = async (e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;
                let okCnt = 0;
                for (const f of files) {
                    const key = f.name.replace(/\.[^.]+$/, "").trim();
                    const dataUrl = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.onerror = () => r(""); fr.readAsDataURL(f); });
                    if (dataUrl) { importedImageRegistry[key] = dataUrl; await idbPutImage(key, dataUrl); okCnt++; }
                }
                showToast(`✅ 成功导入并持久化 ${okCnt} 张本地图片！`, "success");
            };
            bodyEl.querySelector("#st-lock-name-btn").onclick = () => {
                const n = prompt("输入要手动锁定的主角真名（留空则解除锁定）：", curVars.档案.手动锁定真名 || detectProtagonistName(curVars));
                if (n === null) return;
                curVars.档案.手动锁定真名 = n.trim();
                if (n.trim()) curVars.档案.当前认知名字 = n.trim();
                saveChatCache(curVars); latestStatus = getFallbackData(); showToast(n.trim() ? `🔒 已锁定真名：${n.trim()}` : "🔓 已解除真名锁定", "success");
            };
            bodyEl.querySelector("#st-reset-vars-btn").onclick = () => {
                if (!confirm("确定要清空当前对话的全部状态栏缓存数据并从头计算吗？")) return;
                curVars = createDefaultVars(); saveChatCache(curVars); latestStatus = getFallbackData();
                isSettingsOpen = false; renderBody(); showToast("🧹 已重置当前会话状态栏数据", "info");
            };
            bodyEl.querySelector("#st-save-all-settings").onclick = () => {
                userSettings.theme = bodyEl.querySelector("#st-set-theme").value;
                userSettings.personaMode = bodyEl.querySelector("#st-set-persona").value;
                userSettings.difficultyMode = bodyEl.querySelector("#st-set-diff").value;
                userSettings.fontScale = parseInt(bodyEl.querySelector("#st-set-fscale").value, 10) || 100;
                userSettings.compactCards = bodyEl.querySelector("#st-set-compact").checked;
                userSettings.mobileLiteMode = bodyEl.querySelector("#st-set-lite").checked;
                userSettings.injectReversePrompt = bodyEl.querySelector("#st-set-revprompt").checked;
                userSettings.compactPromptMode = bodyEl.querySelector("#st-set-cmpprompt").checked;
                userSettings.apiUrl = bodyEl.querySelector("#st-api-url").value.trim();
                userSettings.apiKey = bodyEl.querySelector("#st-api-key").value.trim();
                userSettings.apiModel = modEl.value.trim();
                userSettings.autoCallApiOnNewMsg = bodyEl.querySelector("#st-set-autoapi").checked;
                userSettings.zhihuijiGlobalFn = bodyEl.querySelector("#st-zhj-fn").value.trim();
                saveSettings(); applyThemeAndSize(); isSettingsOpen = false;
                latestStatus = getFallbackData(); renderBody();
                showToast("💾 设置已保存并应用！", "success");
            };
        }
        // 放在 renderSettingsView 内部：修复 ZIP 图包与 WebP 自动压缩导入
        // （把 renderSettingsView 里的 accept="image/*" 改成 accept="image/*,.zip"，并把 onchange 换成下面这样）：
        /*
            bodyEl.querySelector("#st-import-imgs-input").setAttribute("accept", "image/*,.zip");
            bodyEl.querySelector("#st-import-imgs-input").onchange = async (e) => {
                const files = e.target.files;
                if (!files || !files.length) return;
                showToast("⏳ 正在解压并转码 WebP 图包...", "info", 3000);
                try {
                    const cnt = await importFilesOrZipToDB(files);
                    showToast(`✅ 成功导入并压缩持久化 ${cnt} 张图片（含ZIP）！`, "success");
                    renderSettingsView(bodyEl);
                } catch (err) {
                    showToast("❌ 导入失败：" + (err.message || "文件格式有误"), "error");
                }
            };
        */

        function renderBody() {
            const bodyEl = document.getElementById("st-v5-body");
            if (!bodyEl) return;
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            const statusData = latestStatus || getFallbackData();
            const u = statusData.charName || detectProtagonistName(curVars);

            const titleEl = document.getElementById("st-v5-title-text");
            if (titleEl) titleEl.innerHTML = `<span style="color:${tc.prim};">👑 ${u}</span> <span style="font-size:11px;color:#a6adc8;font-weight:normal;">(${statusData.floorId})</span>`;

            if (isSettingsOpen) {
                renderSettingsView(bodyEl);
                return;
            }

            const dev = computeAllOrganDevelopments(curVars);
            const caps = calcHoleCapacities(curVars);
            const buffs = computeActiveBuffs(curVars, dev);

            // 1. 顶部黄油级 Buff 状态胶囊栏
            const buffBarHTML = buffs.length > 0 ? `
                <div class="st-buff-strip" style="display:flex;flex-wrap:wrap;gap:5px;padding:6px 8px;margin-bottom:8px;background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
                    ${buffs.map(b => `<span title="${safeStr(b.desc)}" style="background:${b.bg};border:1px solid ${b.border};color:${b.color};padding:2px 8px;border-radius:99px;font-size:10.5px;font-weight:bold;white-space:nowrap;">${b.icon} ${b.name}</span>`).join("")}
                </div>` : "";

            // 2. 动态 18+ ASMR 实时娇喘台词栏 + 音效触发
            const asmrQuote = generateLiveASMRQuote(curVars, u);
            const asmrBarHTML = `
                <div id="st-asmr-bar" title="点击播放水声/高潮合成音效" style="margin-bottom:8px;padding:7px 10px;background:linear-gradient(135deg,rgba(244,114,182,0.16),rgba(192,132,252,0.1));border-left:3.5px solid ${tc.prim};border-radius:0 9px 9px 0;font-size:11.5px;color:#ffe4e6;line-height:1.5;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:6px;">
                    <span style="font-style:italic;">🎧 ${asmrQuote}</span>
                    <span style="font-size:11px;opacity:0.75;flex-shrink:0;">${userSettings.soundEnabled ? "🔊" : "🔇"}</span>
                </div>`;

            // 3. 动态可折叠 X-Ray 体内透视断面图
            const xrayHTML = userSettings.showXrayOnHome ? `
                <div style="margin-bottom:8px;position:relative;">
                    ${buildDynamicXRaySVG(curVars, dev, caps)}
                </div>` : "";

            // 4. 快捷控制台工具栏（含反差切换、X-Ray开关、音效开关、单双列、副API重绘）
            const pMode = userSettings.personaMode || "evolution";
            const contrastToggleHTML = pMode === "contrast" ? `
                <button id="st-contrast-toggle" type="button" class="st-pill-btn" style="background:${userSettings.contrastInnerActive ? "linear-gradient(135deg,#ff0055,#7a003c)" : "rgba(255,255,255,0.12)"};border-color:${tc.prim};">
                    ${userSettings.contrastInnerActive ? "🎭 私下母畜态" : "🎭 表面端庄态"}
                </button>` : "";

            const toolbarHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:5px;padding:4px 2px 8px 2px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:8px;">
                    <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
                        <span style="font-size:11px;background:rgba(255,255,255,0.08);padding:2px 7px;border-radius:6px;color:#f9e2af;">${RUIN_PERSONA_MODES[pMode]?.short || "进化树"}</span>
                        ${contrastToggleHTML}
                        <button id="st-xray-toggle" type="button" class="st-pill-btn" title="显示/隐藏体内X-Ray断面图">🔬 透视:${userSettings.showXrayOnHome ? "开" : "关"}</button>
                    </div>
                    <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
                        <button id="st-compact-toggle" type="button" class="st-pill-btn" title="切换单列/双列紧凑排版">${userSettings.compactCards ? "📑 单列" : "⊞ 双列"}</button>
                        <button id="st-subapi-redraw" type="button" class="st-pill-btn" style="background:rgba(203,166,247,0.2);color:#cba6f7;border-color:rgba(203,166,247,0.45);">⚡ 副API重绘</button>
                    </div>
                </div>`;

            // 5. 九大分类与高定主题卡片渲染（支持 Lv5/Lv6 崩坏呼吸特效类名）
            const cats = statusData.categories || [];
            let catsHTML = "";
            cats.forEach((cat, cIdx) => {
                const isOpen = openCategorySet.has(cat.title);
                const gridCols = (userSettings.compactCards && cat.items.length > 1) ? "grid-template-columns:repeat(auto-fill,minmax(210px,1fr));" : "grid-template-columns:1fr;";
                const itemsHTML = cat.items.map((item, iIdx) => {
                    const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
                    const t = item.hasStageBar ? tier6(item.pct || 0, isRev) : 0;
                    const corruptCls = t === 5 ? "st-corrupted-card-lv6" : (t === 4 ? "st-corrupted-card-lv5" : "");
                    return `
                    <div class="st-item-card st-v28-card ${corruptCls}" data-cidx="${cIdx}" data-iidx="${iIdx}" style="background:${tc.card};border:${tc.cardBorder};border-radius:12px;padding:8px 10px;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;">
                        ${item.keyHTML}
                        ${item.barHTML || ""}
                    </div>`;
                }).join("");

                catsHTML += `
                    <div class="st-cat-section" style="margin-bottom:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">
                        <div class="st-cat-header" data-cat="${cat.title}" style="display:flex;justify-content:space-between;align-items:center;padding:8px 11px;cursor:pointer;background:rgba(0,0,0,0.28);user-select:none;">
                            <div style="display:flex;align-items:center;gap:6px;font-weight:bold;font-size:13px;color:${tc.prim};">
                                <span>${cat.icon}</span>
                                <span>${cat.title}</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:6px;">
                                <span style="font-size:11px;color:#a6adc8;max-width:165px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cat.summary || ""}</span>
                                <button class="st-cat-add-btn" data-cat="${cat.title}" type="button" title="在此分类新增自定义条目" style="background:rgba(255,255,255,0.1);color:#f9e2af;border:none;border-radius:5px;padding:1px 6px;font-size:11px;cursor:pointer;">＋</button>
                                <span style="font-size:11px;color:#cdd6f4;transform:rotate(${isOpen ? "90deg" : "0deg"});transition:transform 0.2s;">▶</span>
                            </div>
                        </div>
                        <div class="st-cat-body" style="display:${isOpen ? "grid" : "none"};${gridCols}gap:7px;padding:8px;">
                            ${itemsHTML}
                        </div>
                    </div>`;
            });

            bodyEl.innerHTML = buffBarHTML + asmrBarHTML + xrayHTML + toolbarHTML + catsHTML;

            // 绑定 ASMR 语音条点击切换音效并试听
            const asmrEl = bodyEl.querySelector("#st-asmr-bar");
            if (asmrEl) asmrEl.onclick = () => {
                userSettings.soundEnabled = !userSettings.soundEnabled;
                saveSettings();
                if (userSettings.soundEnabled) playSynthSound(safeNum(curVars.精神与心理?.快感累积) >= 75 ? "climax" : "squelch");
                renderBody();
            };
            const xrayBtn = bodyEl.querySelector("#st-xray-toggle");
            if (xrayBtn) xrayBtn.onclick = () => {
                userSettings.showXrayOnHome = !userSettings.showXrayOnHome;
                saveSettings(); renderBody();
            };
            const cBtn = bodyEl.querySelector("#st-contrast-toggle");
            if (cBtn) cBtn.onclick = () => {
                userSettings.contrastInnerActive = !userSettings.contrastInnerActive;
                saveSettings(); latestStatus = getFallbackData(); renderBody();
            };
            const cmpBtn = bodyEl.querySelector("#st-compact-toggle");
            if (cmpBtn) cmpBtn.onclick = () => {
                userSettings.compactCards = !userSettings.compactCards;
                saveSettings(); renderBody();
            };
            const apiBtn = bodyEl.querySelector("#st-subapi-redraw");
            if (apiBtn) apiBtn.onclick = (e) => triggerSubApiUpdate(e.target);

            bodyEl.querySelectorAll(".st-cat-header").forEach(h => {
                h.onclick = (e) => {
                    if (e.target.closest(".st-cat-add-btn")) return;
                    const title = h.getAttribute("data-cat");
                    if (openCategorySet.has(title)) openCategorySet.delete(title);
                    else openCategorySet.add(title);
                    renderBody();
                };
            });
            bodyEl.querySelectorAll(".st-cat-add-btn").forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    openAddCustomItemModal(btn.getAttribute("data-cat"));
                };
            });
            bodyEl.querySelectorAll(".st-item-card").forEach(card => {
                card.onclick = () => {
                    playSynthSound("squelch");
                    const cIdx = parseInt(card.getAttribute("data-cidx"), 10);
                    const iIdx = parseInt(card.getAttribute("data-iidx"), 10);
                    const item = cats[cIdx]?.items?.[iIdx];
                    if (item) showDetailPopup(item);
                };
            });
        }

        function cleanDOM() {
            try {
                document.querySelectorAll(".mes_text").forEach(el => {
                    const html = el.innerHTML;
                    if (/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/i.test(html)) {
                        el.innerHTML = html.replace(/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "");
                    }
                });
            } catch (e) {}
        }

        function scanHistory(forceUpToFloor = null) {
            if (!checkCardAvailable(true)) return;
            const ctx = safeCtx(), chatArr = ctx?.chat || [];
            const maxLen = forceUpToFloor !== null ? Math.min(chatArr.length, forceUpToFloor + 1) : chatArr.length;
            const freshVars = createDefaultVars();
            for (let i = 0; i < maxLen; i++) {
                const mes = safeStr(chatArr[i]?.mes);
                if (!mes) continue;
                extractFromLegacyText(mes, freshVars);
                const uvMatches = [...mes.matchAll(/<UpdateVariable>([\s\S]*?)<\/UpdateVariable>/gi)];
                uvMatches.forEach(m => parseSetCommands(m[1], freshVars));
                if (!uvMatches.length && /_\.set\s*\(/.test(mes)) parseSetCommands(mes, freshVars);
            }
            const cached = loadChatCache();
            mergeUserCustomizations(freshVars, cached, maxLen);
            calibrateMentalMetrics(freshVars);
            curVars = freshVars;
            if (forceUpToFloor === null) {
                saveChatCache(curVars);
                computeAndShowDeltaToast(curVars, computeAllOrganDevelopments(curVars));
            }
            latestStatus = getFallbackData();
            renderBody();
            cleanDOM();
        }

        function mountUI() {
            if (document.getElementById("st-v5-root")) {
                applyThemeAndSize();
                renderBody();
                return;
            }
            const root = document.createElement("div");
            root.id = "st-v5-root";
            root.innerHTML = `
                <button id="st-v5-toggle" type="button" title="打开/收起神域状态栏 2.0" style="position:fixed;left:${userSettings.btnX}px;top:${userSettings.btnY}px;z-index:2147483640;width:44px;height:44px;border-radius:50%;border:2px solid rgba(255,255,255,0.65);color:#fff;font-size:20px;display:flex;align-items:center;justify-content:center;cursor:grab;user-select:none;touch-action:none;">💗</button>
                <div id="st-v5-panel" style="position:fixed;left:${userSettings.panelX}px;top:${userSettings.panelY}px;z-index:2147483639;display:${isPanelOpen ? "flex" : "none"};flex-direction:column;overflow:hidden;">
                    <div id="st-v5-header" style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;cursor:move;user-select:none;touch-action:none;border-bottom:1px solid rgba(255,255,255,0.12);">
                        <div id="st-v5-title-text" style="font-weight:bold;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">状态栏 2.0</div>
                        <div style="display:flex;align-items:center;gap:6px;">
                            <button id="st-hdr-prev" type="button" title="回溯上一层" style="background:rgba(255,255,255,0.1);color:#fff;border:none;border-radius:6px;padding:3px 7px;font-size:11px;cursor:pointer;">◀</button>
                            <button id="st-hdr-live" type="button" title="回到最新实时层" style="background:rgba(255,255,255,0.1);color:#f9e2af;border:none;border-radius:6px;padding:3px 7px;font-size:11px;cursor:pointer;">实时</button>
                            <button id="st-hdr-settings" type="button" title="打开/关闭设置" style="background:rgba(255,255,255,0.1);color:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:12px;cursor:pointer;">⚙️</button>
                            <button id="st-hdr-close" type="button" title="最小化面板" style="background:rgba(243,139,168,0.25);color:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:12px;cursor:pointer;">✕</button>
                        </div>
                    </div>
                    <div id="st-v5-body" style="flex:1;overflow-y:auto;padding:10px;"></div>
                </div>
                <div id="st-v5-modal" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483645;background:rgba(0,0,0,0.68);display:none;justify-content:center;align-items:center;padding:12px;box-sizing:border-box;">
                    <div class="st-modal-box" style="width:100%;max-width:480px;max-height:86vh;overflow-y:auto;border-radius:14px;padding:14px;box-sizing:border-box;box-shadow:0 16px 48px rgba(0,0,0,0.85);"></div>
                </div>`;
            document.body.appendChild(root);

            const toggleBtn = document.getElementById("st-v5-toggle");
            const panelEl = document.getElementById("st-v5-panel");
            const headerEl = document.getElementById("st-v5-header");
            const modalEl = document.getElementById("st-v5-modal");

            modalEl.onclick = (e) => { if (e.target === modalEl) modalEl.style.display = "none"; };
            document.getElementById("st-hdr-close").onclick = () => { isPanelOpen = false; panelEl.style.display = "none"; };
            document.getElementById("st-hdr-settings").onclick = () => { isSettingsOpen = !isSettingsOpen; renderBody(); };
            document.getElementById("st-hdr-prev").onclick = () => {
                const chatLen = (safeCtx()?.chat || []).length;
                if (!chatLen) return;
                viewingHistoryFloor = viewingHistoryFloor === null ? Math.max(0, chatLen - 2) : Math.max(0, viewingHistoryFloor - 1);
                scanHistory(viewingHistoryFloor);
            };
            document.getElementById("st-hdr-live").onclick = () => {
                viewingHistoryFloor = null;
                scanHistory(null);
                showToast("⚡ 已同步至最新实时楼层", "info", 1800);
            };

            const bindDrag = (handleEl, targetEl, xKey, yKey, onClickCb) => {
                let dragging = false, moved = false, startX = 0, startY = 0, origX = 0, origY = 0;
                handleEl.onpointerdown = (e) => {
                    if (e.target.closest("button") && handleEl !== toggleBtn) return;
                    dragging = true; moved = false;
                    startX = e.clientX; startY = e.clientY;
                    origX = targetEl.offsetLeft; origY = targetEl.offsetTop;
                    handleEl.setPointerCapture(e.pointerId);
                };
                handleEl.onpointermove = (e) => {
                    if (!dragging) return;
                    const dx = e.clientX - startX, dy = e.clientY - startY;
                    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
                    const nx = Math.max(0, Math.min(window.innerWidth - 48, origX + dx));
                    const ny = Math.max(0, Math.min(window.innerHeight - 48, origY + dy));
                    targetEl.style.left = nx + "px"; targetEl.style.top = ny + "px";
                    userSettings[xKey] = nx; userSettings[yKey] = ny;
                };
                handleEl.onpointerup = (e) => {
                    if (!dragging) return;
                    dragging = false;
                    try { handleEl.releasePointerCapture(e.pointerId); } catch (err) {}
                    if (moved) saveSettings();
                    else if (onClickCb) onClickCb();
                };
            };

            bindDrag(toggleBtn, toggleBtn, "btnX", "btnY", () => {
                isPanelOpen = !isPanelOpen;
                panelEl.style.display = isPanelOpen ? "flex" : "none";
                if (isPanelOpen) renderBody();
            });
            bindDrag(headerEl, panelEl, "panelX", "panelY", null);

            applyThemeAndSize();
            renderBody();
        }

        function setupTavernHooks() {
            if (window.__ST_V20_HOOKS_BOUND__) return;
            window.__ST_V20_HOOKS_BOUND__ = true;
            const ctx = safeCtx();
            const ev = ctx?.eventSource, et = ctx?.event_types;
            if (ev && et) {
                if (et.CHAT_CHANGED) ev.on(et.CHAT_CHANGED, () => { viewingHistoryFloor = null; setTimeout(() => scanHistory(null), 200); });
                if (et.MESSAGE_RECEIVED) ev.on(et.MESSAGE_RECEIVED, () => {
                    viewingHistoryFloor = null;
                    setTimeout(() => {
                        scanHistory(null);
                        if (userSettings.autoCallApiOnNewMsg && userSettings.apiUrl && userSettings.apiKey) triggerSubApiUpdate();
                    }, 300);
                });
                if (et.MESSAGE_EDITED) ev.on(et.MESSAGE_EDITED, () => setTimeout(() => scanHistory(viewingHistoryFloor), 200));
                if (et.MESSAGE_DELETED) ev.on(et.MESSAGE_DELETED, () => setTimeout(() => scanHistory(null), 200));
                if (et.CHAT_COMPLETION_PROMPT_READY) {
                    ev.on(et.CHAT_COMPLETION_PROMPT_READY, (eventData) => {
                        try {
                            if (!userSettings.enabled || !checkCardAvailable(true)) return;
                            const u = detectProtagonistName(curVars);
                            const sysInject = buildFullSystemPrompt(u, curVars);
                            if (eventData && Array.isArray(eventData.chat)) {
                                eventData.chat.push({ role: "system", content: sysInject });
                            }
                        } catch (e) {}
                    });
                }
            }
        }

        loadSettings();
        injectCustomStyles();
        loadAllImportedImagesToMemory().then(() => { renderBody(); });
        mountUI();
        scanHistory(null);
        setupTavernHooks();
        setInterval(scanChatImagesForZhiHuiJi, 2500);
        window.ST_V20_COMPLETE_FLAG = true;
        window.ST_V10_COMPLETE_FLAG = true;
        console.log("✅ [状态栏 2.0 · 神域终极完全体] 初始化完成喵！");







