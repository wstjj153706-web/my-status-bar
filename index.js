// == 状态栏 1.0 ==
(function () {
    const EXT_ID = "my-status-bar";
    const APP_TITLE = "状态栏 1.0";
    let extMod = {}, scriptMod = {};
    let eventSource = null, event_types = null, setExtensionPrompt = null, extension_prompt_types = null;

    // 1. 自动探测当前插件所在的真实目录路径
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

    // =========================================================================
    // 🖼️ 【按钮 1~6 阶段默认图片映射表（含100%满值专属第6阶段）】
    // =========================================================================
    const DEFAULT_STAGE_IMAGES = {
        "当前姿势": ["当前姿势_1", "当前姿势_2", "当前姿势_3", "当前姿势_4", "当前姿势_5", "当前姿势_6"],
        "肉体外貌": ["肉体外貌_1", "肉体外貌_2", "肉体外貌_3", "肉体外貌_4", "肉体外貌_5", "肉体外貌_6"],
        "cockLove": ["cockLove_1", "cockLove_2", "cockLove_3", "cockLove_4", "cockLove_5", "cockLove_6"],
        "lust":     ["lust_1",     "lust_2",     "lust_3",     "lust_4",     "lust_5",     "lust_6"],
        "corr":     ["corr_1",     "corr_2",     "corr_3",     "corr_4",     "corr_5",     "corr_6"],
        "shame":    ["shame_1",    "shame_2",    "shame_3",    "shame_4",    "shame_5",    "shame_6"],
        "obey":     ["obey_1",     "obey_2",     "obey_3",     "obey_4",     "obey_5",     "obey_6"],
        "pleas":    ["pleas_1",    "pleas_2",    "pleas_3",    "pleas_4",    "pleas_5",    "pleas_6"],
        "精神沦陷": ["精神沦陷_1", "精神沦陷_2", "精神沦陷_3", "精神沦陷_4", "精神沦陷_5", "精神沦陷_6"],
        "媚药毒瘾": ["媚药毒瘾_1", "媚药毒瘾_2", "媚药毒瘾_3", "媚药毒瘾_4", "媚药毒瘾_5", "媚药毒瘾_6"],
        "骚口实况": ["骚口实况_1", "骚口实况_2", "骚口实况_3", "骚口实况_4", "骚口实况_5", "骚口实况_6"],
        "胸部实况": ["胸部实况_1", "胸部实况_2", "胸部实况_3", "胸部实况_4", "胸部实况_5", "胸部实况_6"],
        "小穴实况": ["小穴实况_1", "小穴实况_2", "小穴实况_3", "小穴实况_4", "小穴实况_5", "小穴实况_6"],
        "子宫实况": ["子宫实况_1", "子宫实况_2", "子宫实况_3", "子宫实况_4", "子宫实况_5", "子宫实况_6"],
        "阴蒂尿道": ["阴蒂尿道_1", "阴蒂尿道_2", "阴蒂尿道_3", "阴蒂尿道_4", "阴蒂尿道_5", "阴蒂尿道_6"],
        "屁眼实况": ["屁眼实况_1", "屁眼实况_2", "屁眼实况_3", "屁眼实况_4", "屁眼实况_5", "屁眼实况_6"],
        "正字涂鸦": ["正字涂鸦_1", "正字涂鸦_2", "正字涂鸦_3", "正字涂鸦_4", "正字涂鸦_5", "正字涂鸦_6"],
        "淫纹烙印": ["淫纹烙印_1", "淫纹烙印_2", "淫纹烙印_3", "淫纹烙印_4", "淫纹烙印_5", "淫纹烙印_6"],
        "穿刺环饰": ["穿刺环饰_1", "穿刺环饰_2", "穿刺环饰_3", "穿刺环饰_4", "穿刺环饰_5", "穿刺环饰_6"],
        "体内道具": ["体内道具_1", "体内道具_2", "体内道具_3", "体内道具_4", "体内道具_5", "体内道具_6"],
        "排卵周期": ["排卵周期_1", "排卵周期_2", "排卵周期_3", "排卵周期_4", "排卵周期_5", "排卵周期_6"],
        "受精断面": ["受精断面_1", "受精断面_2", "受精断面_3", "受精断面_4", "受精断面_5", "受精断面_6"],
        "精液归属": ["精液归属_1", "精液归属_2", "精液归属_3", "精液归属_4", "精液归属_5", "精液归属_6"],
        "孕肚进度": ["孕肚进度_1", "孕肚进度_2", "孕肚进度_3", "孕肚进度_4", "孕肚进度_5", "孕肚进度_6"],
        "穿搭_头饰": ["穿搭_头饰_1", "穿搭_头饰_2", "穿搭_头饰_3", "穿搭_头饰_4", "穿搭_头饰_5", "穿搭_头饰_6"],
        "穿搭_颈部": ["穿搭_颈部_1", "穿搭_颈部_2", "穿搭_颈部_3", "穿搭_颈部_4", "穿搭_颈部_5", "穿搭_颈部_6"],
        "穿搭_胸罩": ["穿搭_胸罩_1", "穿搭_胸罩_2", "穿搭_胸罩_3", "穿搭_胸罩_4", "穿搭_胸罩_5", "穿搭_胸罩_6"],
        "穿搭_上衣": ["穿搭_上衣_1", "穿搭_上衣_2", "穿搭_上衣_3", "穿搭_上衣_4", "穿搭_上衣_5", "穿搭_上衣_6"],
        "穿搭_内裤": ["穿搭_内裤_1", "穿搭_内裤_2", "穿搭_内裤_3", "穿搭_内裤_4", "穿搭_内裤_5", "穿搭_内裤_6"],
        "穿搭_下装": ["穿搭_下装_1", "穿搭_下装_2", "穿搭_下装_3", "穿搭_下装_4", "穿搭_下装_5", "穿搭_下装_6"],
        "穿搭_丝袜": ["穿搭_丝袜_1", "穿搭_丝袜_2", "穿搭_丝袜_3", "穿搭_丝袜_4", "穿搭_丝袜_5", "穿搭_丝袜_6"],
        "穿搭_鞋子": ["穿搭_鞋子_1", "穿搭_鞋子_2", "穿搭_鞋子_3", "穿搭_鞋子_4", "穿搭_鞋子_5", "穿搭_鞋子_6"]
    };

    // =========================================================================
    // 📦 【后台静默图包数据库引擎 + 原生 ZIP 解压器（设置页极简无预览图）】
    // =========================================================================
    const IDB_NAME = "st_status_bar_1_0_img_db";
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
        const nk = normalizeImgKey(rawKey);
        return importedImgCache.get(nk) || "";
    }

    function openImageDB() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) return reject(new Error("浏览器不支持IndexedDB"));
            const req = indexedDB.open(IDB_NAME, 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(IDB_STORE)) {
                    db.createObjectStore(IDB_STORE);
                }
            };
            req.onsuccess = (e) => resolve(e.target.result);
            req.onerror = (e) => reject(e.target.error);
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
        } catch (e) {
            return 0;
        }
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
                    const ctx2d = cvs.getContext("2d");
                    ctx2d.drawImage(img, 0, 0, w, h);
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
            if (view.getUint32(i, true) === 0x06054b50) {
                eocdPos = i;
                break;
            }
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
            const isUtf8 = (flags & 0x0800) !== 0;
            let fileName = utf8Decoder.decode(nameBytes);
            if (!isUtf8 && fileName.includes("\uFFFD") && gbkDecoder) {
                fileName = gbkDecoder.decode(nameBytes);
            }

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

            if (rawBlob) {
                extracted.push({ name: fileName.split(/[\\/]/).pop(), blob: rawBlob });
            }
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
                tx.oncomplete = () => {
                    importedImgCache.clear();
                    resolve(true);
                };
            });
        } catch (e) { return false; }
    }

    // 2. 安全防崩包装工具
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

    // 3. 注入高定黄油 UI 样式表（双层黄金分割卡片，图片独立右置绝不挡字）
    function injectCustomStyles() {
        if (document.getElementById("st-v10-custom-css")) return;
        const style = document.createElement("style");
        style.id = "st-v10-custom-css";
        style.textContent = `
            @keyframes stPulseGlow {
                0%, 100% { box-shadow: 0 0 8px rgba(255, 0, 60, 0.75), inset 0 0 5px rgba(255, 255, 255, 0.35); }
                50% { box-shadow: 0 0 20px rgba(255, 0, 60, 1), 0 0 30px rgba(136, 19, 55, 0.9), inset 0 0 10px rgba(255, 255, 255, 0.65); }
            }
            @keyframes stStage6GodGlow {
                0%, 100% { box-shadow: 0 0 12px #ff0055, 0 0 24px #7e22ce, inset 0 0 8px #fde047; border-color: #fde047; }
                50% { box-shadow: 0 0 22px #fde047, 0 0 38px #ff0055, inset 0 0 14px #ffffff; border-color: #ff0055; }
            }
            @keyframes stExplodeShake {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.07) rotate(-2deg); }
                50% { transform: scale(1.12) rotate(2deg); }
                75% { transform: scale(1.06) rotate(-1deg); }
            }
            @keyframes stHeartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.09); }
            }
            .st-v10-card {
                transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease !important;
            }
            .st-v10-card:hover {
                transform: translateY(-1.5px);
                box-shadow: 0 6px 22px rgba(243, 139, 168, 0.32) !important;
            }
            .st-stage5-badge {
                animation: stPulseGlow 1.6s infinite ease-in-out;
            }
            .st-stage6-badge {
                animation: stStage6GodGlow 1.3s infinite ease-in-out;
                background: linear-gradient(90deg, #ff0055, #7e22ce, #ca8a04) !important;
                color: #fff !important;
            }
            .st-explode-emo {
                display: inline-flex;
                align-items: center;
                gap: 2px;
                animation: stExplodeShake 1.2s infinite ease-in-out;
                background: linear-gradient(135deg, #ff003c, #2b0012);
                color: #fff !important;
                border: 1px solid #ff758f;
                padding: 1px 7px;
                border-radius: 99px;
                font-size: 10.5px;
                font-weight: 900;
                white-space: nowrap;
                box-shadow: 0 0 10px rgba(255, 0, 60, 0.8);
            }
            .st-god-emo {
                display: inline-flex;
                align-items: center;
                gap: 2px;
                animation: stExplodeShake 0.95s infinite ease-in-out;
                background: linear-gradient(135deg, #ff0055, #6b21a8, #ca8a04);
                color: #fff !important;
                border: 1px solid #fde047;
                padding: 1px 8px;
                border-radius: 99px;
                font-size: 10.5px;
                font-weight: 900;
                white-space: nowrap;
                box-shadow: 0 0 14px rgba(250, 204, 21, 0.9);
            }
            .st-emo-pill {
                display: inline-flex;
                align-items: center;
                padding: 1px 7px;
                border-radius: 99px;
                font-size: 10.5px;
                font-weight: bold;
                white-space: nowrap;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.16);
            }
            .st-heart-beat {
                display: inline-block;
                animation: stHeartbeat 1.3s infinite ease-in-out;
            }
            .st-sec-block {
                background: rgba(0, 0, 0, 0.38);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-left: 3.5px solid #cba6f7;
                border-radius: 9px;
                padding: 8px 11px;
                margin-bottom: 8px;
                line-height: 1.72;
            }
            .st-thought-box {
                margin-top: 12px;
                padding: 12px 14px;
                background: linear-gradient(145deg, rgba(243, 139, 168, 0.18), rgba(168, 85, 247, 0.12));
                border: 1px solid rgba(243, 139, 168, 0.42);
                border-left: 4.5px solid #f38ba8;
                border-radius: 11px;
                color: #ffe0ec;
                font-style: italic;
                line-height: 1.82;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35), inset 0 0 14px rgba(243, 139, 168, 0.12);
            }
            #st-v5-body::-webkit-scrollbar, #st-v6-det-desc::-webkit-scrollbar, #st-v5-tabs::-webkit-scrollbar {
                width: 4px;
            }
            #st-v5-body::-webkit-scrollbar-thumb, #st-v6-det-desc::-webkit-scrollbar-thumb, #st-v5-tabs::-webkit-scrollbar-thumb {
                background: rgba(243, 139, 168, 0.45);
                border-radius: 99px;
            }
        `;
        document.head.appendChild(style);
    }

    function showToast(msg, type = "success", duration = 3500) {
        try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, APP_TITLE); } catch (e) {}
        let box = document.getElementById("st-v20-toast");
        if (!box) {
            box = document.createElement("div"); box.id = "st-v20-toast";
            box.style.cssText = "position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;padding:10px 22px;border-radius:99px;font-family:'Microsoft YaHei',sans-serif;font-size:13.5px;font-weight:bold;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,0.85);transition:all 0.25s ease;pointer-events:none;display:none;align-items:center;gap:8px;backdrop-filter:blur(10px);";
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

    const THEMES = {
        "魅魔粉 (默认)": {
            bg: "radial-gradient(circle at top right, #2a1b3d, #130f1e 72%)",
            border: "2px solid #f38ba8", radius: "16px", shadow: "0 16px 48px rgba(243,139,168,0.4)",
            prim: "#f38ba8", sec: "#cba6f7", text: "#fdf0f6", sub: "#b4adc8",
            card: "linear-gradient(145deg, rgba(42,29,62,0.94), rgba(20,14,32,0.96))",
            cardBorder: "1px solid rgba(243,139,168,0.35)", hi: "rgba(243,139,168,0.25)"
        },
        "暗黑血浆 (重口凌辱)": {
            bg: "repeating-linear-gradient(135deg, #1a0508 0px, #1a0508 12px, #110204 12px, #110204 24px)",
            border: "2px double #ff1e42", radius: "8px", shadow: "0 18px 55px rgba(255,0,43,0.55)",
            prim: "#ff2a4b", sec: "#ff758f", text: "#ffe5ec", sub: "#d48b99",
            card: "linear-gradient(160deg, #2b080e, #140205)",
            cardBorder: "1px solid rgba(255,42,75,0.5)", hi: "rgba(255,42,75,0.3)"
        },
        "白浊深渊 (催眠灌精)": {
            bg: "linear-gradient(170deg, #0f172a, #1e1b4b 60%, #090d16)",
            border: "2px solid #a5f3fc", radius: "20px", shadow: "0 16px 50px rgba(165,243,252,0.32)",
            prim: "#67e8f9", sec: "#c084fc", text: "#f8fafc", sub: "#94a3b8",
            card: "linear-gradient(155deg, rgba(30,41,59,0.92), rgba(15,23,42,0.96))",
            cardBorder: "1px dashed rgba(165,243,252,0.4)", hi: "rgba(103,232,249,0.22)"
        },
        "赛博调教 (电击项圈)": {
            bg: "linear-gradient(160deg, #050b14, #0d1b2a)",
            border: "2px solid #00f5d4", radius: "6px", shadow: "0 0 35px rgba(0,245,212,0.45), inset 0 0 15px rgba(241,91,181,0.2)",
            prim: "#00f5d4", sec: "#f15bb5", text: "#e0fbfc", sub: "#8ecae6",
            card: "linear-gradient(135deg, #0a192f, #020c1b)",
            cardBorder: "1px solid #00f5d4", hi: "rgba(241,91,181,0.28)"
        },
        "鎏金娼馆 (肉便器挂牌)": {
            bg: "radial-gradient(ellipse at top, #2d1e12, #120c07)",
            border: "2px ridge #f9e2af", radius: "14px", shadow: "0 18px 50px rgba(249,226,175,0.32)",
            prim: "#f9e2af", sec: "#fab387", text: "#fdf6e2", sub: "#cbb292",
            card: "linear-gradient(160deg, #2b1d14, #170f0a)",
            cardBorder: "1px solid rgba(249,226,175,0.4)", hi: "rgba(249,226,175,0.22)"
        }
    };

    // 长线养成纯难度系数表（与角色种族100%解耦）
    const DIFFICULTY_PRESETS = {
        "easy":   { label: "🌸 轻度养成 (1x 难度 · 约350点复合开发达六阶满值)", mult: 1.0, short: "1x轻度" },
        "normal": { label: "🌙 标准长线 (2.5x 难度 · 约880点复合开发达六阶满值)", mult: 2.5, short: "2.5x标准" },
        "hard":   { label: "🔥 硬核慢热 (6x 难度 · 约2100点复合开发达六阶满值)", mult: 6.0, short: "6x硬核" },
        "hell":   { label: "💀 地狱调教 (15x 难度 · 约5200点复合开发达六阶满值)", mult: 15.0, short: "15x地狱" },
        "abyss":  { label: "👑 深渊史诗 (40x 难度 · 约14000点复合开发达六阶满值)", mult: 40.0, short: "40x深渊" }
    };

    let userSettings = {
        enabled: true,
        hideRawBlock: true,
        theme: "魅魔粉 (默认)",
        difficultyMode: "normal",
        strictMentalLock: true,
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
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v10_cfg") || localStorage.getItem(EXT_ID + "_v27_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            userSettings.width = Math.max(340, Math.min(920, safeNum(userSettings.width, 540)));
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
        if (/大学生|学妹|校花|少女|高中生/.test(combined)) return "现代青春少女之躯";
        return "敏感处子娇躯";
    }

    // =========================================================================
    // 👑 【核心升级：1 ~ 6 阶段判定器（唯有 100% 满值才可进入第六阶段终极完全体）】
    // 返回值：0(一阶 0-19%), 1(二阶 20-39%), 2(三阶 40-59%), 3(四阶 60-79%), 4(五阶 80-99%), 5(六阶 100%满值!)
    // 对于反向指标 (rev=true，如羞耻度/体力/闭合度)，100%为初态(0)，唯有降到 0% 才触发第六阶段(5)！
    // =========================================================================
    function tier6(val, rev = false) {
        const n = Math.max(0, Math.min(100, Math.round(safeNum(val, 0))));
        const v = rev ? (100 - n) : n;
        if (v >= 100) return 5; // 👑 第六阶段：唯有彻底 100% 满值（或反向指标彻底归 0%）方可解锁！
        if (v >= 80) return 4;  // 第五阶段：80 ~ 99%
        if (v >= 60) return 3;  // 第四阶段：60 ~ 79%
        if (v >= 40) return 2;  // 第三阶段：40 ~ 59%
        if (v >= 20) return 1;  // 第二阶段：20 ~ 39%
        return 0;               // 第一阶段：0 ~ 19%
    }

    function stageNameFromVal(val, rev = false) {
        return ["第一阶段", "第二阶段", "第三阶段", "第四阶段", "第五阶段", "👑第六阶段"][tier6(val, rev)];
    }

    // =========================================================================
    // 🎨 【18 套「一钮一色、一钮一词」独立流体光谱 + 6 阶段专属颜文字字典】
    // =========================================================================
    const EXCLUSIVE_BAR_THEMES = {
        cockLove: {
            grads: [
                "linear-gradient(90deg, #ffffff, #f1f5f9)",
                "linear-gradient(90deg, #ffe4e6, #fda4af)",
                "linear-gradient(90deg, #fbcfe8, #f472b6)",
                "linear-gradient(90deg, #f472b6, #c084fc)",
                "linear-gradient(90deg, #e11d48, #881337, #3b0764)",
                "linear-gradient(90deg, #ff0055 0%, #7e22ce 50%, #facc15 100%)"
            ],
            emos: ["😒 忌惮异物", "😳 指尖试探", "🥺 含泪吞吐", "🤤 捧茎狂舔", "🐶 见棒跪拜", "👑🍆 肉棒神明死忠!!"]
        },
        lust: {
            grads: [
                "linear-gradient(90deg, #e0f2fe, #ffffff)",
                "linear-gradient(90deg, #fed7aa, #fb923c)",
                "linear-gradient(90deg, #fb923c, #f43f5e)",
                "linear-gradient(90deg, #f43f5e, #dc2626)",
                "linear-gradient(90deg, #ff003c, #7f1d1d, #1f0008)",
                "linear-gradient(90deg, #ff0000 0%, #ff7b00 50%, #2b0000 100%)"
            ],
            emos: ["❄️ 清心寡欲", "🌡️ 耳根微热", "🥵 呼吸滚烫", "🔥 欲火焚身", "🌋 夹腿磨逼", "❤️‍🔥💥 永昼发情母兽!!"]
        },
        corr: {
            grads: [
                "linear-gradient(90deg, #ffffff, #e2e8f0)",
                "linear-gradient(90deg, #e9d5ff, #c084fc)",
                "linear-gradient(90deg, #c084fc, #9333ea)",
                "linear-gradient(90deg, #9333ea, #581c87)",
                "linear-gradient(90deg, #be123c, #3b0764, #09000f)",
                "linear-gradient(90deg, #ff0055 0%, #3b0764 55%, #000000 100%)"
            ],
            emos: ["🕊️ 冰清玉洁", "🥀 贞洁动摇", "😈 放浪迎合", "💋 风尘肉器", "⛓️ 公用精盆", "🖤👑 深渊恶堕女皇!!"]
        },
        shame: { // 反向指标：100%为第0阶(羞愤欲死)，0%为第5阶(廉耻全灭)
            rev: true,
            grads: [
                "linear-gradient(90deg, #ffe4e6, #fb7185, #e11d48)",
                "linear-gradient(90deg, #fce7f3, #f472b6)",
                "linear-gradient(90deg, #e9d5ff, #a855f7)",
                "linear-gradient(90deg, #94a3b8, #64748b)",
                "linear-gradient(90deg, #be123c, #4c0519)",
                "linear-gradient(90deg, #facc15 0%, #be123c 50%, #09000b 100%)"
            ],
            emos: ["🍅 羞愤欲死", "🫣 捂胸咬唇", "😳 半推半就", "😐 习以为常", "😏 敞腿任看", "🤪🐾 廉耻全灭裸犬!!"]
        },
        obey: {
            grads: [
                "linear-gradient(90deg, #f8fafc, #cbd5e1)",
                "linear-gradient(90deg, #bae6fd, #60a5fa)",
                "linear-gradient(90deg, #c7d2fe, #818cf8)",
                "linear-gradient(90deg, #d8b4fe, #9333ea)",
                "linear-gradient(90deg, #7e22ce, #3b0764, #111827)",
                "linear-gradient(90deg, #fde047 0%, #7e22ce 55%, #030712 100%)"
            ],
            emos: ["⚔️ 孤高抗拒", "😣 屈辱低头", "🙇 温顺奉侍", "🐾 摇尾乞怜", "🐶 任打任操", "⛓️👑 绝对盲从家畜!!"]
        },
        pleas: {
            grads: [
                "linear-gradient(90deg, #ffffff, #fce7f3)",
                "linear-gradient(90deg, #fbcfe8, #f472b6)",
                "linear-gradient(90deg, #f472b6, #e879f9)",
                "linear-gradient(90deg, #e879f9, #d946ef, #a21caf)",
                "linear-gradient(90deg, #ff0055, #86198f, #2e1065)",
                "linear-gradient(90deg, #ffffff 0%, #ff0055 45%, #3b0764 100%)"
            ],
            emos: ["🤍 平缓无波", "⚡ 尾椎窜电", "🥵 趾尖蜷缩", "💦 痉挛攀升", "🤪 潮吹连顶", "🧠⚡ 阿片过载脑死!!"]
        },
        hypno: {
            grads: [
                "linear-gradient(90deg, #f8fafc, #e2e8f0)",
                "linear-gradient(90deg, #f3e8ff, #d8b4fe)",
                "linear-gradient(90deg, #e879f9, #a855f7)",
                "linear-gradient(90deg, #a855f7, #6b21a8)",
                "linear-gradient(90deg, #ec4899, #4c1d95, #090d16)",
                "linear-gradient(90deg, #ff007f 0%, #4c1d95 50%, #000000 100%)"
            ],
            emos: ["👁️ 神智清明", "💫 眼神迷离", "🌀 潜意识松动", "😵‍💫 指令顺从", "💓 瞳孔爱心", "🧠🌀 常识彻底改写!!"]
        },
        drug: {
            grads: [
                "linear-gradient(90deg, #ffffff, #dcfce7)",
                "linear-gradient(90deg, #bbf7d0, #4ade80)",
                "linear-gradient(90deg, #4ade80, #a855f7)",
                "linear-gradient(90deg, #a855f7, #db2777)",
                "linear-gradient(90deg, #10b981, #7e22ce, #1f0010)",
                "linear-gradient(90deg, #00ff88 0%, #ff0055 55%, #0a000d 100%)"
            ],
            emos: ["🌿 体液纯净", "🍬 微醺依恋", "🧪 精瘾发作", "🤤 骨髓发痒", "🤪 断精发狂", "☠️💉 媚毒入骨母猪!!"]
        },
        sta: { // 反向消耗指标：100%充沛(0阶)，0%虚脱(5阶)
            rev: true,
            grads: [
                "linear-gradient(90deg, #bbf7d0, #4ade80, #16a34a)",
                "linear-gradient(90deg, #fef08a, #facc15)",
                "linear-gradient(90deg, #fed7aa, #fb923c)",
                "linear-gradient(90deg, #fda4af, #e11d48)",
                "linear-gradient(90deg, #dc2626, #7f1d1d, #1a0000)",
                "linear-gradient(90deg, #ff0000 0%, #450a0a 60%, #000000 100%)"
            ],
            emos: ["✨ 精力充沛", "😮‍💨 腰腿微酸", "🥵 香汗淋漓", "🫠 双腿筛糠", "😵 濒临脱力", "😵‍💫💀 彻底虚脱肉泥!!"]
        },
        mouth: {
            grads: [
                "linear-gradient(90deg, #ffffff, #ffe4e6)",
                "linear-gradient(90deg, #fecdd3, #fb7185)",
                "linear-gradient(90deg, #fb7185, #f43f5e)",
                "linear-gradient(90deg, #f43f5e, #be123c)",
                "linear-gradient(90deg, #e11d48, #881337, #2b0012)",
                "linear-gradient(90deg, #ffffff 0%, #ff003c 50%, #1f000d 100%)"
            ],
            emos: ["🌸 朱唇紧闭", "😛 香舌生津", "😮‍💨 吞吐适应", "🤤 深喉锁茎", "🤮 精臭成瘾", "👄👑 终极榨精口器!!"]
        },
        chest: {
            grads: [
                "linear-gradient(90deg, #ffffff, #fff1f2)",
                "linear-gradient(90deg, #fce7f3, #f9a8d4)",
                "linear-gradient(90deg, #fef3c7, #f472b6)",
                "linear-gradient(90deg, #fde68a, #ec4899)",
                "linear-gradient(90deg, #fef08a, #e11d48, #881337)",
                "linear-gradient(90deg, #ffffff 0%, #fde047 40%, #ff0055 100%)"
            ],
            emos: ["🌸 娇嫩处乳", "😳 乳尖硬挺", "🤲 揉捏变形", "🍼 乳腺打通", "💦 挤压喷奶", "🐄👑 永动机母乳壶!!"]
        },
        vag: {
            grads: [
                "linear-gradient(90deg, #ffffff, #ffe4e6)",
                "linear-gradient(90deg, #fbcfe8, #f472b6)",
                "linear-gradient(90deg, #f472b6, #e11d48)",
                "linear-gradient(90deg, #e11d48, #9f1239)",
                "linear-gradient(90deg, #ff003c, #6b0f2b, #1a0009)",
                "linear-gradient(90deg, #ff0055 0%, #831843 50%, #facc15 100%)"
            ],
            emos: ["🌸 一线处子", "🌺 初破微张", "💦 充血外翻", "🕳️ 大开肉壶", "🌊 合不拢漏精", "👑🌺 万夫莫敌极品名器!!"]
        },
        womb: {
            grads: [
                "linear-gradient(90deg, #ffffff, #fce7f3)",
                "linear-gradient(90deg, #fbcfe8, #fb7185)",
                "linear-gradient(90deg, #fb7185, #e11d48)",
                "linear-gradient(90deg, #e11d48, #9333ea)",
                "linear-gradient(90deg, #ff003c, #581c87, #1e001a)",
                "linear-gradient(90deg, #ffffff 0%, #ff003c 45%, #3b0764 100%)"
            ],
            emos: ["🔒 宫口紧锁", "💓 下腹酸软", "🔓 龟头顶开", "🧲 主动吸精", "🔻 宫口下垂", "🫀👑 脱垂锁精真祖苗床!!"]
        },
        clit: {
            grads: [
                "linear-gradient(90deg, #ffffff, #fef9c3)",
                "linear-gradient(90deg, #fef08a, #facc15)",
                "linear-gradient(90deg, #facc15, #f97316)",
                "linear-gradient(90deg, #f97316, #e11d48)",
                "linear-gradient(90deg, #ff003c, #881337, #1a0008)",
                "linear-gradient(90deg, #fde047 0%, #ff003c 50%, #090004 100%)"
            ],
            emos: ["🌱 包皮隐没", "😳 充血勃起", "⚡ 肥大酸豆", "💦 尿道松弛", "⛲ 喷潮漏尿", "🌊🤯 失禁狂喷水龙头!!"]
        },
        anal: {
            grads: [
                "linear-gradient(90deg, #f8fafc, #fed7aa)",
                "linear-gradient(90deg, #fecdd3, #fb7185)",
                "linear-gradient(90deg, #f472b6, #c084fc)",
                "linear-gradient(90deg, #c084fc, #7e22ce)",
                "linear-gradient(90deg, #9333ea, #4c0519, #09000d)",
                "linear-gradient(90deg, #ff0055 0%, #581c87 55%, #000000 100%)"
            ],
            emos: ["🌸 菊蕾紧闭", "😣 异物撑开", "😳 括约肌软", "🕳️ 后庭不拢", "💦 灌肠喷精", "🕳️👑 第二生殖腔便器!!"]
        },
        pee: {
            grads: [
                "linear-gradient(90deg, #ffffff, #fef9c3)",
                "linear-gradient(90deg, #fef08a, #facc15)",
                "linear-gradient(90deg, #facc15, #ea580c)",
                "linear-gradient(90deg, #ea580c, #e11d48)",
                "linear-gradient(90deg, #ff003c, #7f1d1d, #1a0006)",
                "linear-gradient(90deg, #fde047 0%, #ff003c 50%, #000000 100%)"
            ],
            emos: ["🤍 膀胱平稳", "😳 尿道微酸", "😣 夹腿憋尿", "💦 滴漏失守", "⛲ 高潮喷尿", "🌊🤯 括约肌报废决堤!!"]
        },
        semen: {
            grads: [
                "linear-gradient(90deg, #475569, #64748b)",
                "linear-gradient(90deg, #e2e8f0, #ffffff)",
                "linear-gradient(90deg, #ffffff, #fbcfe8)",
                "linear-gradient(90deg, #ffffff, #f472b6, #db2777)",
                "linear-gradient(90deg, #ffffff, #e11d48, #4c0519)",
                "linear-gradient(90deg, #ffffff 0%, #ff0055 45%, #1f000d 100%)"
            ],
            emos: ["🤍 空虚待灌", "🥛 挂壁残留", "🤤 白浊咕啾", "🥵 灌满外溢", "🫃 小腹鼓胀", "🫃💥 精盆撑爆满溢!!"]
        },
        milk: {
            grads: [
                "linear-gradient(90deg, #475569, #64748b)",
                "linear-gradient(90deg, #fffbeb, #fef3c7)",
                "linear-gradient(90deg, #fef3c7, #fde68a)",
                "linear-gradient(90deg, #fde68a, #f472b6)",
                "linear-gradient(90deg, #fffbeb, #fb7185, #881337)",
                "linear-gradient(90deg, #ffffff 0%, #fde047 45%, #e11d48 100%)"
            ],
            emos: ["🌸 尚未泌乳", "🍼 乳腺微酸", "🥺 乳汁蓄积", "💦 乳尖滴奶", "🐄 涨奶喷射", "🐄💥 母乳喷泉决堤!!"]
        }
    };

    function getThemedBarStyle(pct, themeKey = "pleas") {
        const cfg = EXCLUSIVE_BAR_THEMES[themeKey] || EXCLUSIVE_BAR_THEMES.pleas;
        const p = Math.max(0, Math.min(100, Math.round(safeNum(pct, 0))));
        const idx = tier6(p, !!cfg.rev);
        const grad = cfg.grads[idx] || cfg.grads[0];
        const rawEmo = cfg.emos[idx] || "";

        let emoHTML = "";
        if (themeKey !== "none" && rawEmo) {
            if (idx === 5) {
                emoHTML = `<span class="st-god-emo">${rawEmo}</span>`;
            } else if (idx === 4) {
                emoHTML = `<span class="st-explode-emo">${rawEmo}</span>`;
            } else {
                const colors = ["#e2e8f0", "#fbcfe8", "#f472b6", "#fb7185"];
                const col = colors[idx] || "#f8fafc";
                emoHTML = `<span class="st-emo-pill" style="color:${col};border-color:${col}55;">${rawEmo}</span>`;
            }
        }

        const glow = idx >= 5 ? "0 0 18px #fde047, 0 0 26px #ff0055, inset 0 0 6px #fff"
                   : idx === 4 ? "0 0 15px #ff003c, inset 0 0 5px #ffccd5"
                   : idx >= 2 ? "0 0 9px rgba(244,114,182,0.55)" : "none";
        const labelColor = idx === 5 ? "#fde047" : idx === 4 ? "#ff4d6d" : "#f9e2af";

        return { grad, glow, labelColor, emo: emoHTML, stageIdx: idx };
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
        "淫乱总账本": "总账"
    };

    function getChatStoreKey() {
        const ctx = safeCtx();
        const cid = ctx?.chatId || ctx?.characterId || ctx?.name2 || "default_chat";
        return `${EXT_ID}_v10_cache_${cid}`;
    }

    function loadChatCache() {
        try {
            const raw = localStorage.getItem(getChatStoreKey()) || localStorage.getItem(`${EXT_ID}_v27_cache_${safeCtx()?.chatId || "default_chat"}`);
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }

    function saveChatCache(varsObj) {
        try {
            localStorage.setItem(getChatStoreKey(), JSON.stringify({
                快照: varsObj,
                按钮详情: varsObj.按钮详情 || {},
                性癖详情: varsObj.性癖详情 || {},
                自定义条目: varsObj.自定义条目 || {}
            }));
        } catch (e) {}
    }

    function mergeCachedVars(baseVars, cached) {
        if (!cached) return;
        if (cached.快照) {
            const s = cached.快照;
            ["核心数值", "精神与心理", "身体", "体内精液存量", "实况", "档案", "穿搭", "受孕与生理", "痕迹与标记", "体内道具与权限", "精神与心理扩展", "调教进度"].forEach(k => {
                if (s[k] && typeof s[k] === "object") Object.assign(baseVars[k], s[k]);
            });
            if (Array.isArray(s.性癖?.条目) && s.性癖.条目.length) baseVars.性癖.条目 = s.性癖.条目;
            if (s.计数 && typeof s.计数 === "object") {
                Object.keys(s.计数).forEach(k => {
                    if (typeof s.计数[k] === "object" && s.计数[k] !== null) {
                        baseVars.计数[k] = { ...(baseVars.计数[k] || {}), ...s.计数[k] };
                    } else {
                        baseVars.计数[k] = s.计数[k];
                    }
                });
            }
        }
        if (cached.按钮详情) baseVars.按钮详情 = { ...baseVars.按钮详情, ...cached.按钮详情 };
        if (cached.性癖详情) baseVars.性癖详情 = { ...baseVars.性癖详情, ...cached.性癖详情 };
        if (cached.自定义条目) baseVars.自定义条目 = { ...baseVars.自定义条目, ...cached.自定义条目 };
    }

    // =========================================================================
    // 📈 【6 阶段长线阻尼曲线引擎（80%主项 + 20%跨部位生态联动，唯独达标且满足大成条件才解锁 100% 第六阶段）】
    // 1x 基准阈值：T1=8(19%), T2=28(39%), T3=75(59%), T4=170(79%), T5=350(99%), >=350且满足里程碑 -> 100%(第六阶段)
    // =========================================================================
    function calcStageScore6(primaryPoints, synergyPoints = 0, diffMult = 1.0, milestoneMet = false) {
        const dMult = Math.max(0.5, diffMult);
        // 80/20 阻尼锁：协同联动点数采用对数衰减，最多只能提供相当于主项 25% + 10 点的辅助推进，彻底杜绝数值雪崩膨胀！
        const dampedSynergy = synergyPoints > 0 ? Math.min(primaryPoints * 0.25 + 10 * dMult, Math.sqrt(synergyPoints * dMult) * 3.2) : 0;
        const totalRaw = primaryPoints + (primaryPoints > 0 ? dampedSynergy : Math.min(4 * dMult, dampedSynergy * 0.3));

        if (totalRaw <= 0) {
            return { val: 0, nextThreshold: Math.max(1, Math.ceil(8 * dMult)) };
        }

        const eff = totalRaw / dMult;
        const T1 = 8, T2 = 28, T3 = 75, T4 = 170, T5 = 350;
        let score = 0, nextRaw = T1;

        if (eff < T1) {
            score = 3 + (eff / T1) * 16; // 3 ~ 19% (一阶)
            nextRaw = T1;
        } else if (eff < T2) {
            score = 20 + ((eff - T1) / (T2 - T1)) * 19; // 20 ~ 39% (二阶)
            nextRaw = T2;
        } else if (eff < T3) {
            score = 40 + ((eff - T2) / (T3 - T2)) * 19; // 40 ~ 59% (三阶)
            nextRaw = T3;
        } else if (eff < T4) {
            score = 60 + ((eff - T3) / (T4 - T3)) * 19; // 60 ~ 79% (四阶)
            nextRaw = T4;
        } else if (eff < T5) {
            score = 80 + ((eff - T4) / (T5 - T4)) * 19; // 80 ~ 99% (五阶)
            nextRaw = T5;
        } else {
            // 已达 350*dMult 终极门槛：唯有同时满足复合里程碑(milestoneMet)才解锁 100% 第六阶段，否则严锁在 99%！
            score = milestoneMet ? 100 : 99;
            nextRaw = T5;
        }

        let finalVal = Math.round(score);
        if (eff < T1 && finalVal >= 20) finalVal = 19;
        if (eff < T2 && finalVal >= 40) finalVal = 39;
        if (eff < T3 && finalVal >= 60) finalVal = 59;
        if (eff < T4 && finalVal >= 80) finalVal = 79;
        if ((eff < T5 || !milestoneMet) && finalVal >= 100) finalVal = 99;

        finalVal = Math.max(1, Math.min(100, finalVal));
        const realNext = Math.max(Math.round(primaryPoints) + 1, Math.ceil(nextRaw * dMult));
        return { val: finalVal, nextThreshold: realNext };
    }

    // =========================================================================
    // 🕸️ 【四层生理-心理全生态网状传导计算中心】
    // 将总账、六孔、体液、道具、穿刺、发情、羞耻、恶堕全部有机联系在一起！
    // =========================================================================
    function computeEcologicalNetwork(v) {
        const c = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {};
        const diff = getDifficultyProfile();
        const dMult = diff.mult;

        const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼);
        const tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), beast = safeNum(c.性交?.兽交异种);
        const creampie = safeNum(c.射精?.内射), facial = safeNum(c.射精?.颜射体外);
        const swallow = safeNum(c.精液摄入?.吞精次数), swallowMl = safeNum(c.精液摄入?.累计毫升);
        const orgasm = safeNum(c.高潮?.总数), forceOrg = safeNum(c.高潮?.强制), edge = safeNum(c.高潮?.寸止);
        const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁), ahegao = safeNum(c.失控?.阿嘿颜);
        const mast = safeNum(c.自慰), exp = safeNum(c.暴露?.露出), hooker = safeNum(c.交易?.接客卖身);
        const gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
        const milkCnt = safeNum(c.泌乳?.喷乳次数), milkMl = safeNum(c.泌乳?.累计毫升);
        const whip = safeNum(mark.鞭痕与掌印);

        const mouthMl = safeNum(sp.口内毫升), vagMl = safeNum(sp.小穴毫升), wombMl = safeNum(sp.子宫毫升), analMl = safeNum(sp.屁眼毫升);
        const totalMl = mouthMl + vagMl + wombMl + analMl;

        const hasProp = (prop.体内道具 && prop.体内道具 !== "无") ? 1 : 0;
        const hasPierce = (mark.穿刺与环饰 && mark.穿刺与环饰 !== "无") ? 1 : 0;
        const hasTattoo = (mark.淫纹与刻印 && mark.淫纹与刻印 !== "无") ? 1 : 0;

        // 1. 骚口复合开发：主项(口交+吞精+吞精量) + 协同(颜射+阿嘿颜+轮奸)
        const mouthPri = mouth * 1.2 + swallow * 1.5 + (swallowMl / 25);
        const mouthSyn = facial * 0.5 + ahegao * 1.0 + gang * 1.5;
        const mouthMilestone = mouth >= 20 && swallow >= 15 && swallowMl >= 500;
        const mouthDev = calcStageScore6(mouthPri, mouthSyn, dMult, mouthMilestone).val;

        // 2. 丰乳复合开发：主项(乳交+喷乳+泌乳量) + 协同(自慰揉胸+高潮充血+穿刺乳环)
        const chestPri = tit * 1.6 + milkCnt * 2.2 + (milkMl / 30) + (hasPierce ? 8 : 0);
        const chestSyn = mast * 0.5 + orgasm * 0.35 + whip * 0.4;
        const chestMilestone = tit >= 15 && milkCnt >= 10;
        const chestDev = calcStageScore6(chestPri, chestSyn, dMult, chestMilestone).val;

        // 3. 小穴复合开发：主项(小穴贯穿+内射+轮奸+睡奸+兽交) + 协同(自慰抠穴+潮吹+体内道具+后庭传导+乳宫共鸣)
        const vagPri = vag * 1.25 + creampie * 0.8 + gang * 2.5 + sleep * 1.5 + beast * 3.0;
        const vagSyn = mast * 0.8 + squirt * 1.0 + anal * 0.35 + tit * 0.25 + (hasProp ? 12 : 0) + (vagMl / 10);
        const vagMilestone = vag >= 30 && creampie >= 15 && (squirt + mast) >= 10;
        const vagDev = calcStageScore6(vagPri, vagSyn, dMult, vagMilestone).val;

        // 4. 子宫与苗床复合开发：主项(内射+生产产卵+宫腔储精) + 协同(小穴深顶+高潮痉挛+淫纹催情+乳宫共鸣)
        const wombPri = creampie * 1.8 + safeNum(v.受孕与生理?.生产产卵次数) * 18 + (wombMl > 0 ? 6 + wombMl * 0.15 : 0);
        const wombSyn = vag * 0.45 + orgasm * 0.4 + milkCnt * 0.6 + (hasTattoo ? 15 : 0);
        const wombMilestone = creampie >= 25 && (wombMl >= 50 || safeNum(v.受孕与生理?.子宫怀孕) > 0);
        const wombDev = calcStageScore6(wombPri, wombSyn, dMult, wombMilestone).val;

        // 5. 阴蒂与尿道复合开发：主项(高潮+强制高潮+寸止+潮吹+失禁+自慰) + 协同(穿刺环+鞭痕受虐+露出羞耻反噬)
        const clitPri = orgasm * 0.85 + forceOrg * 1.3 + edge * 1.6 + squirt * 2.0 + leak * 2.5 + mast * 0.9;
        const clitSyn = exp * 0.6 + whip * 0.5 + (hasPierce ? 12 : 0) + (hasProp ? 10 : 0);
        const clitMilestone = orgasm >= 25 && (squirt + leak) >= 12 && (mast + edge) >= 8;
        const clitDev = calcStageScore6(clitPri, clitSyn, dMult, clitMilestone).val;

        // 6. 屁眼后庭复合开发：主项(肛交+轮奸+直肠储精) + 协同(小穴隔壁传导+失禁括约肌松弛+体内肛塞)
        const analPri = anal * 1.85 + gang * 1.8 + (analMl > 0 ? 5 + analMl * 0.15 : 0);
        const analSyn = vag * 0.25 + leak * 0.8 + (hasProp ? 10 : 0);
        const analMilestone = anal >= 20 && (analMl > 0 || gang >= 5);
        const analDev = calcStageScore6(analPri, analSyn, dMult, analMilestone).val;

        return {
            mouthDev, chestDev, vagDev, wombDev, clitDev, analDev,
            totalMl, hasProp, hasPierce, hasTattoo
        };
    }

// ==================== 【第一段结束，请紧接着在此行下方粘贴第二段】 ====================
    // =========================================================================
    // ⚖️ 【恶堕与心理全维度双向校准引擎（含正向0->100与反向羞耻100->0严密传导）】
    // =========================================================================
    function calibrateMentalMetrics(v) {
        const c = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {};
        const diff = getDifficultyProfile();
        const dMult = Math.max(0.5, diff.mult);
        const eco = computeEcologicalNetwork(v);

        const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼);
        const tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), creampie = safeNum(c.射精?.内射);
        const swallow = safeNum(c.精液摄入?.吞精次数), orgasm = safeNum(c.高潮?.总数);
        const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁), mast = safeNum(c.自慰);
        const exp = safeNum(c.暴露?.露出), hooker = safeNum(c.交易?.接客卖身), gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
        const whip = safeNum(mark.鞭痕与掌印);

        // 全局综合开发主点数（涵盖性交、内射、吞精、自慰、露出、接客、受虐）
        const globalPrimary = vag * 1.1 + creampie * 1.3 + mouth * 0.8 + swallow * 1.0 + anal * 1.1 +
                              tit * 0.6 + foot * 0.5 + orgasm * 0.5 + (squirt + leak) * 1.0 +
                              mast * 0.45 + exp * 1.1 + hooker * 1.6 + gang * 2.5 + sleep * 1.4 + whip * 0.5;
        // 体内精液残留与穿刺/道具带来的内分泌协同点数
        const globalSynergy = (eco.totalMl / 15) + (eco.hasProp ? 12 : 0) + (eco.hasPierce ? 10 : 0) + (eco.hasTattoo ? 15 : 0);

        // 第六阶段(100%)终极恶堕大成条件：不仅总点数达标，还必须经历过多孔开发且有过内射/吞精与高潮失控
        const globalMilestone = (vag + anal + mouth) >= 40 && (creampie + swallow) >= 20 && orgasm >= 20 && (exp + hooker + gang + mast) >= 5;
        const expectedGlobal = calcStageScore6(globalPrimary, globalSynergy, dMult, globalMilestone).val;

        if (!userSettings.strictMentalLock) return;

        // 上限天花板：允许比长期曲线高出最多 10 点（但未满足第六阶段里程碑时最高严锁在 99%！）
        const maxLongCap = globalPrimary <= 0 ? 12 : Math.min(globalMilestone ? 100 : 99, expectedGlobal + 10);
        // 下限保底：当总账次数已经很高时，自动推动恶堕/好感/服从跟上阶段，绝不出现几千次还卡在一阶！
        const minLongFloor = globalPrimary <= 0 ? 0 : Math.max(0, expectedGlobal - 6);

        const calibratedHypno = Math.min(safeNum(v.精神与心理扩展?.催眠深度), Math.min(100, maxLongCap + 15));
        if (v.精神与心理扩展) v.精神与心理扩展.催眠深度 = calibratedHypno;
        const finalCap = Math.min(globalMilestone ? 100 : 99, Math.max(maxLongCap, Math.round(calibratedHypno * 0.8)));

        const syncPos = (val, floorOff = 0, capOff = 0) => {
            const cur = Math.max(0, Math.min(100, safeNum(val, 0)));
            const low = Math.max(0, Math.min(99, minLongFloor + floorOff));
            const high = Math.max(low, Math.min(globalMilestone ? 100 : 99, finalCap + capOff));
            return Math.max(low, Math.min(cur, high));
        };

        v.核心数值.对肉棒好感度 = syncPos(v.核心数值.对肉棒好感度, 0, 2);
        v.核心数值.淫乱恶堕 = syncPos(v.核心数值.淫乱恶堕, 0, 0);
        v.精神与心理.服从度 = syncPos(v.精神与心理.服从度, -2, 4);
        v.精神与心理.沦陷度 = syncPos(v.精神与心理.沦陷度, -2, 2);
        v.精神与心理.人格崩解度 = syncPos(v.精神与心理.人格崩解度, -8, -3);

        // 媚药与精液毒瘾：与吞精、内射、体内当前存精量强挂钩
        const drugPri = swallow * 1.8 + creampie * 1.4 + (eco.totalMl * 0.4);
        const drugExpected = calcStageScore6(drugPri, globalPrimary * 0.2, dMult, swallow >= 20 && creampie >= 20).val;
        v.精神与心理.媚药精液毒瘾 = Math.max(drugExpected, Math.min(safeNum(v.精神与心理.媚药精液毒瘾), Math.min(100, drugExpected + 15)));

        // 📉 羞耻度 (100% -> 0% 反向剥落指标！)：随恶堕、露出、接客、失禁稳步往下降，唯独恶堕达100%第六阶段时羞耻才彻底归 0%！
        const shameDropExtra = Math.min(12, Math.round((exp * 1.5 + hooker * 2.0 + leak * 1.5) / dMult));
        const maxShameAllowed = Math.max(0, 100 - minLongFloor - Math.round(shameDropExtra * 0.5));
        const minShameAllowed = globalMilestone && expectedGlobal >= 100 ? 0 : Math.max(1, 100 - finalCap - shameDropExtra);
        const curShame = Math.max(0, Math.min(100, safeNum(v.精神与心理.羞耻度, 100)));
        v.精神与心理.羞耻度 = Math.max(minShameAllowed, Math.min(curShame, maxShameAllowed));

        // 💓 短期指标联动：羞耻反噬快感（羞耻高时遭遇刺激快感加倍） + 体内精液催情
        const shameCatalyst = v.精神与心理.羞耻度 >= 60 && (vag + mast + exp + orgasm) > 0 ? 8 : 0;
        const semenCatalyst = eco.totalMl > 0 ? Math.min(18, Math.round(eco.totalMl * 0.25)) : 0;
        const shortCap = globalPrimary <= 0 ? 45 : (globalPrimary <= 10 ? 75 : 100);
        const shortFloor = globalPrimary > 0 ? Math.min(70, Math.round(expectedGlobal * 0.6 + semenCatalyst + shameCatalyst)) : 0;

        v.核心数值.性欲程度 = Math.max(shortFloor, Math.min(Math.max(0, safeNum(v.核心数值.性欲程度)), shortCap));
        v.精神与心理.快感累积 = Math.max(Math.round(shortFloor * 0.75), Math.min(Math.max(0, safeNum(v.精神与心理.快感累积)), shortCap));
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
            if (archMatch && archMatch[1]) {
                detected = archMatch[1].replace(/\*\*/g, "").trim();
                break;
            }
            const transMatch = mes.match(/(?:完全变成了|身体变成了|重塑为|改名为|赐名为|现在我是|我真的变成)[\s「【“"']*([\u4e00-\u9fa5a-zA-Z]{2,10}?)(?:了|】|」|”|"|'|[，。！？\n])/);
            if (transMatch && transMatch[1] && !["女人", "女生", "女孩子", "母狗", "性奴", "肉便器", "这副", "这样"].includes(transMatch[1])) {
                const newN = transMatch[1].trim();
                detected = (rawUser && rawUser !== newN && rawUser !== "User") ? `${newN}（${rawUser}）` : newN;
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
            mouthMax: Math.min(1500, Math.round(45 + mouthCnt * 3.5 + corr * 1.5)),
            vagMax: Math.min(1000, Math.round(25 + vagCnt * 3.0 + corr * 1.0)),
            wombMax: Math.min(1800, Math.round(20 + creampie * 5.0 + vagCnt * 1.5 + corr * 1.8)),
            analMax: Math.min(1500, Math.round(35 + analCnt * 4.5 + corr * 1.5))
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

        if (Array.isArray(v.性癖?.条目)) {
            v.性癖.条目.forEach(raw => {
                const s = safeStr(raw).trim();
                if (!s) return;
                if (totalCount === 0 && corr === 0 && /[-\s]0\/100$/.test(s)) return;
                if (/^(?:见之欲呕|清心寡欲|初守清白|羞极即泄|抗命顶撞|心如止水|自我完整)/.test(s) && totalCount > 5) return;

                const parts = s.split("-");
                let rawName = safeStr(parts[0], "特殊性癖").trim();
                const origin = safeStr(parts[1], "长期调教与肉体开发形成").trim();
                const rawStage = safeStr(parts[2]).trim();

                let num = 15;
                const m = s.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+)/);
                if (m) {
                    const n1 = parseFloat(m[1]), n2 = parseFloat(m[2]);
                    num = n2 > 0 ? Math.round((n1 / n2) * 100) : Math.round(n1);
                } else if (rawStage.includes("六")) num = 100;
                else if (rawStage.includes("五")) num = 88;
                else if (rawStage.includes("四")) num = 68;
                else if (rawStage.includes("三")) num = 48;
                else if (rawStage.includes("二")) num = 28;

                const maxAllowedByTotal = calcStageScore6(Math.max(1, totalCount * 0.6), corr * 0.2, dMult, totalCount >= 350 * dMult).val;
                if (totalCount > 0 && num > maxAllowedByTotal + 12) num = Math.min(num, maxAllowedByTotal + 8);
                num = Math.max(1, Math.min(100, num));
                resultMap.set(rawName, {
                    name: rawName, origin, val: num, stage: stageNameFromVal(num),
                    countNow: totalCount, nextTarget: Math.ceil(totalCount * 1.4 + 8)
                });
            });
        }

        const upsertAuto = (shortName, originTpl, priCount, synCount = 0, milestone = false) => {
            if (priCount <= 0) return;
            const { val: calcVal, nextThreshold } = calcStageScore6(priCount, synCount, dMult, milestone);
            const stg = stageNameFromVal(calcVal);
            const originStr = `${originTpl}（当前累计有效值 ${Math.round(priCount)}，距下一阶需达 ${nextThreshold}｜难度：${diff.name}）`;

            if (resultMap.has(shortName)) {
                const ex = resultMap.get(shortName);
                ex.val = calcVal; ex.stage = stg; ex.origin = originStr;
                ex.countNow = Math.round(priCount); ex.nextTarget = nextThreshold;
            } else {
                resultMap.set(shortName, {
                    name: shortName, origin: originStr, val: calcVal, stage: stg,
                    countNow: Math.round(priCount), nextTarget: nextThreshold
                });
            }
        };

        upsertAuto("挨操肉穴瘾", `骚逼已被阳具贯穿 ${vag} 次、自慰 ${mast} 次，肉褶形成永久阳具记忆`, vag * 1.2 + mast * 0.5, creampie * 0.5, vag >= 50 && creampie >= 20);
        upsertAuto("子宫受精癖", `宫腔已被滚烫浓精内射浇灌 ${creampie} 次，宫颈口习惯被顶开锁精`, creampie * 1.4, vag * 0.4 + orgasm * 0.3, creampie >= 40);
        upsertAuto("深喉吞精癖", `骚口已口交 ${mouth} 次、吞精 ${swallow} 次，食道与味蕾被精腥味浸染`, mouth + swallow * 1.3, facial * 0.5, mouth >= 30 && swallow >= 25);
        upsertAuto("后庭扩菊癖", `屁眼已被粗暴开发 ${anal} 次，直肠括约肌适应粗大异物塞满感`, anal * 1.5, gang * 1.2, anal >= 30);
        upsertAuto("乳交奉侍癖", `丰乳已夹击服侍肉棒 ${tit} 次，乳肉与乳尖在摩擦中敏化充血`, tit * 1.5, milk * 1.0 + mast * 0.3, tit >= 25);
        upsertAuto("母畜喷乳癖", `乳腺已被打通并挤奶喷乳 ${milk} 次，乳头一被吸吮即引发子宫共振`, milk * 2.0, tit * 0.8 + orgasm * 0.3, milk >= 20);
        upsertAuto("玉足恋精癖", `玉足已足交玩弄阳具 ${foot} 次，脚趾缝沾染浓精即条件反射蜷缩`, foot * 1.6, facial * 0.4, foot >= 25);
        upsertAuto("潮吹失禁癖", `累计绝顶 ${orgasm} 次、潮吹 ${squirt} 次、漏尿失禁 ${leak} 次，尿道与高潮神经短路`, squirt * 2.0 + leak * 2.5 + orgasm * 0.4, mast * 0.5, (squirt + leak) >= 20);
        upsertAuto("寸止焦躁癖", `遭受寸止折磨 ${edge} 次，长期求而不得令神经对高潮产生病态饥渴`, edge * 2.0, orgasm * 0.3, edge >= 18);
        upsertAuto("受虐M质痛感转化", `身体承受抽打掌掴留痕 ${whip} 处，痛觉神经与多巴胺快感回路交融`, whip * 1.8, gang * 1.0, whip >= 25);
        upsertAuto("自慰抠穴癖", `难耐空虚自行抠挖骚穴 ${mast} 次，手指沾满拉丝淫水自我亵渎`, mast * 1.6, exp * 0.6, mast >= 25);
        upsertAuto("公开露出癖", `当众赤裸露出或被视奸 ${exp} 次，将旁人下流视线转化为催情快感`, exp * 1.8, hooker * 0.8, exp >= 20);
        upsertAuto("轮奸肉便器癖", `经历多人轮奸群交 ${gang} 次，三穴习惯同时被多根肉棒塞满抽插`, gang * 2.5, hooker * 0.8, gang >= 15);
        upsertAuto("睡奸无防备癖", `在睡眠或昏迷无防备下被侵犯 ${sleep} 次，潜意识养成梦中自动分腿本能`, sleep * 2.2, creampie * 0.3, sleep >= 15);
        upsertAuto("风尘卖淫癖", `已接客卖身或共享 ${hooker} 次，自我认知向明码标价的泄欲肉具异化`, hooker * 1.4, creampie * 0.4, hooker >= 30);

        return Array.from(resultMap.values());
    }

    function buildFetishRichDesc(fetishObj, v, u) {
        const { name, origin, val, stage, countNow = 0, nextTarget = 20 } = fetishObj;
        const t = tier6(val, false);
        const diff = getDifficultyProfile();

        const apiFet = v.性癖详情?.[name];
        if (apiFet && (apiFet.desc || apiFet.thought)) {
            return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
                   `【🎚️ 难度档位与进阶门槛】：${diff.name}｜当前有效值：${countNow} -> 下一阶门槛：${nextTarget}\n` +
                   `【解锁成因】：${apiFet.origin || origin}\n` +
                   `【🔞 第${t + 1}阶段微观生理与神经发作实况】：\n${apiFet.desc || "该性癖已在体内深度激活。"}\n` +
                   `💭【${u}的${stage}实时心声】：“*${cleanThoughtText(apiFet.thought || "身体一碰到这种刺激就自己发软流水了……")}*”`;
        }

        const stageDescs = [
            `【第一阶段·异物初侵/屈辱应激】（${val}/100）：「${name}」刚刚在${u}的肉体上留下最初的浅层烙印（有效值 ${countNow}，需达 ${nextTarget} 升入二阶）。理智层面仍感到强烈的羞耻、排斥或麻木隐忍，但娇嫩粘膜与神经末梢已被强行记住异物摩擦的触感，每当回想便耳根发烫、腿心泛起酸麻湿意。`,
            `【第二阶段·肉体通电/敏化成瘾】（${val}/100）：「${name}」已演化至第二阶段！肉体的条件反射开始背叛矜持，相关部位的毛细血管长期处于充血敏化状态。只要闻到雄性腥气或处于暗示情境下，呼吸便瞬间紊乱滚烫，胸前乳尖自行硬挺，腿心花唇诚实地泌出透明春水。`,
            `【第三阶段·理智崩解/戒断渴求】（${val}/100）：「${name}」已深化至第三阶段，彻底化作刻进脊髓反射里的快感本能！羞耻防线全面溃散，痛觉与屈辱感在神经回路中被扭曲为高潮电流；一旦未能体验「${name}」，小腹深处就会泛起毒瘾发作般的空虚抓挠感，双腿发软地主动迎合索取！`,
            `【第四阶段·肉改畸变/母狗狂犬化】（${val}/100）：「${name}」已恶化至第四阶段重度肉改状态！长期高强度的开发已令${u}的相应器官产生不可逆的淫靡形变——括约肌松弛外翻、敏感肉珠肥大充血。言谈举止全面母狗化，毫无廉耻地敞开身体哭求更粗暴的蹂躏！`,
            `【第五阶段·深渊便器/巴甫洛夫失禁】（${val}/100）：「${name}」已达第五阶段濒临满值状态！知性防线彻底崩溃，身体对「${name}」形成了无需经过大脑的巴甫洛夫绝对反射，稍微触及便会流涎喷水、浑身痉挛！`,
            `【👑 第六阶段·100%终极满值/脑髓熔断神格化】（100/100）：全书最高重口终极完全体！「${name}」已将${u}的大脑皮层阿片受体100%烧穿重塑！她的基因、肉褶与灵魂已彻底为了「${name}」而存在，哪怕只是听到相关字眼，便会瞬间翻起白眼吐舌阿嘿颜，全身六孔同时狂喷绝顶！`
        ];

        const stageThoughts = [
            `呜……明明只是经历了浅浅几次「${name}」而已，可被摩擦撑开过的粘膜现在还火辣辣地发酸发麻💦。我怎么可能会喜欢这种粗鲁下流的事呢？刚才身体打颤绝对只是因为不习惯……可为什么一闭上眼回想刚才的触感，小肚子最深处还是会不受控制地揪紧渗水呢😳❤️？`,
            `不、不对劲……为什么现在一碰到「${name}」的苗头，我的胸口就闷得发慌、两腿之间的花唇自己就充血湿透了啊😳💦？大脑明明还在命令自己守住底线，可这具叛徒身体早就记住了那种酸麻灭顶的滋味，好想再被那样粗暴地对待一次、压下里面的邪火啊🥵❤️！`,
            `哈啊……已经彻底瞒不住自己了💦！只要一触发「${name}」，整条脊椎骨就像通了高压电一样从尾椎爽到头顶，脚趾头都麻得死死蜷缩起来了🥵！什么自尊矜持全都无所谓了，快点用更凶狠、更下流的力道对我做「${name}」吧，把我里面空虚发痒的地方彻底填满捅穿呀💦❤️！`,
            `呜汪♡……受不了了，只要稍微停下「${name}」，我的骚穴和小腹就像有无数只蚂蚁在爬一样，淫水顺着大腿根哗啦啦地往下流个不停🥵💦！现在的我就是一条只为「${name}」摇尾巴的发情母狗呀，求求你快用最粗暴的方式把人家喂饱吧❤️❤️！`,
            `啊嘿、咕啾♡……一秒钟都离不开「${name}」了🥵💦！只要闻到一点点气味，下面的肉洞就自己张开往外喷水漏尿，脑子里除了被粗暴使用之外什么都思考不了啦❤️❤️！`,
            `啊゛啊゛——100%彻底坏掉了♡！！脑髓已经被「${name}」彻底烧成白花花的极乐浆糊了🥵💦！眼珠子翻到顶回不来了，舌头伸在外面滴着哈喇子，全身上下每一个肉孔都在为了「${name}」狂喷潮吹和骚尿！请一辈子把${u}当成「${name}」的终极肉便器操到死吧❤️❤️❤️！！`
        ];

        return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
               `【🎚️ 难度档位与进阶门槛】：${diff.name}｜当前有效值 ${countNow}，距下一阶需 ${nextTarget}\n` +
               `【解锁成因】：${origin}\n` +
               `【🔞 第${t + 1}阶段发作实况】：\n${stageDescs[t]}\n` +
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
                if (Array.isArray(v)) {
                    if (!v.length) out += `${pad}${k}: []\n`;
                    else { out += `${pad}${k}:\n`; for (const item of v) out += `${pad}  - ${item}\n`; }
                } else if (v !== null && typeof v === "object") out += `${pad}${k}:\n` + serialize(v, indent + 2);
                else out += `${pad}${k}: ${v}\n`;
            }
            return out;
        }
        return `${userName}:\n` + serialize(cleanCopy, 2);
    }

    // =========================================================================
    // 🤖 【核心痛点根治：状态栏 1~6 阶「反向支配」AI 正文输出引擎】
    // 自动将当前小穴、子宫、胸部、口穴、屁眼、恶堕、羞耻的真实阶段转化为强制生理描写铁律注入给 AI！
    // 确保当小穴达到第五/第六阶段时，AI 写出的正文也必然是外翻漏精、熟烂迎合的重口状态！
    // =========================================================================
    function buildPhysiologicalEnforcementPrompt(userName, v) {
        const eco = computeEcologicalNetwork(v);
        const c = v.计数 || {};
        const vagCnt = safeNum(c.性交?.小穴), creampie = safeNum(c.射精?.内射), mouthCnt = safeNum(c.性交?.口), analCnt = safeNum(c.性交?.屁眼);
        const corr = safeNum(v.核心数值?.淫乱恶堕), shame = safeNum(v.精神与心理?.羞耻度, 100), obey = safeNum(v.精神与心理?.服从度);

        const vagStage = tier6(eco.vagDev) + 1;
        const wombStage = tier6(eco.wombDev) + 1;
        const mouthStage = tier6(eco.mouthDev) + 1;
        const chestStage = tier6(eco.chestDev) + 1;
        const clitStage = tier6(eco.clitDev) + 1;
        const analStage = tier6(eco.analDev) + 1;
        const corrStage = tier6(corr) + 1;
        const shameStage = tier6(shame, true) + 1;

        const rules = [];

        // 1. 小穴与子宫阶位强制正文同步指令
        if (vagStage === 1 && vagCnt === 0) {
            rules.push(`- 【小穴与处女状态（第1阶段·处女一线鲍）】：${userName}目前尚未破瓜（小穴贯穿0次），花唇粉嫩紧闭，处女膜完好无损。若发生初次插入，正文中必须细致描写处女膜被强行撕裂捅穿的破瓜剧痛、落红血丝与极度紧窄的包裹感！`);
        } else if (vagStage === 2) {
            rules.push(`- 【小穴实况（第2阶段·初破微张｜已贯穿${vagCnt}次）】：${userName}的小穴已非处女，花唇因充血而微微开启一道湿润红缝，受到挑逗便会自动泌出透明拉丝爱液，插入时虽仍有紧致阻力但肉壁已开始诚实软化迎合。`);
        } else if (vagStage === 3) {
            rules.push(`- 【小穴与宫口实况（第3阶段·充血外翻名器｜已贯穿${vagCnt}次/内射${creampie}次）】：${userName}的小阴唇已因频繁性交而肥厚充血并向外翻开，穴口微张合不拢；正文中描写其下体时，必须体现出肉褶早已记住阳具形状、稍微触碰即淫水泛滥、插入时熟软媚肉主动吸附缠绕的熟透状态！`);
        } else if (vagStage === 4) {
            rules.push(`- 【⚠️小穴与宫口重度肉改（第4阶段·大开肉壶｜已贯穿${vagCnt}次/内射${creampie}次）】：${userName}的花唇已彻底外翻失去原有的紧闭弹性，穴口呈现被撑开的圆洞状，闭合不全！**正文中严禁再将她的小穴描写成“紧窄难入的处女样”**！必须描写她平时走动或站立时穴口都在噗嗤漏出淫水与残留白浊，阳具只需一顶便能毫无阻碍地整根没入直捣软烂微张的子宫颈口！`);
        } else if (vagStage >= 5) {
            rules.push(`- 【🔥小穴与子宫终极肉改铁律（第${vagStage}阶段·${vagStage === 6 ? "100%满值万夫莫敌极品名器" : "彻底洞开漏精便器"}｜已贯穿${vagCnt}次/内射${creampie}次）】：${userName}的小穴与子宫已被彻底开发至终极形态！**在接下来的正文中，你必须100%严格按以下生理事实描写她的下体（严禁写回紧闭或羞涩抗拒！）**：她的黑粉花唇极度外翻糜烂，穴口全天候大张洞开根本合不拢，连深处主动向下脱垂的粉红子宫颈口都隐约可见；无论是在日常对话、走路还是呼吸，她洞开的骚穴都在不受控制地往下滴淌拉丝白浊与淫水；一旦被阳具触碰，层叠的千层肉褶与脱垂宫口会像饥渴的活物般瞬间主动吞没锁死龟头疯狂榨精！`);
        }

        // 2. 胸部、口穴、尿道与后庭高阶强制同步
        if (chestStage >= 4) {
            rules.push(`- 【丰乳与乳腺实况（第${chestStage}阶段·母畜喷乳奶袋）】：${userName}的乳腺已被彻底催熟打通！正文中只要揉捏或吸吮她的乳房，必须描写滚烫香甜的白色母乳噗嗤喷射而出，且乳头受激会直接引起她小腹子宫的剧烈高潮收缩！`);
        }
        if (mouthStage >= 4) {
            rules.push(`- 【骚口与咽喉实况（第${mouthStage}阶段·深喉吞精口器｜口交${mouthCnt}次）】：${userName}的口腔与食道已彻底丧失呕吐反射，闻到雄性精腥味就会条件反射般流下晶莹涎水，主动伸出香舌舔舐奉侍并将浓精一滴不剩地吞入胃袋！`);
        }
        if (clitStage >= 4) {
            rules.push(`- 【阴蒂与尿道括约肌实况（第${clitStage}阶段·失禁狂喷水龙头）】：${userName}的阴蒂已充血肥大如酸豆，下方的尿道括约肌高度松弛短路；正文中一旦她受到强烈快感冲击或羞辱高潮，必须描写她无法控制地当场潮吹狂喷并伴随羞耻的漏尿失禁！`);
        }
        if (analStage >= 4) {
            rules.push(`- 【屁眼后庭实况（第${analStage}阶段·第二生殖腔｜肛交${analCnt}次）】：${userName}的后庭括约肌已被彻底开发软化，直肠壁如同第二个淫乱小穴般主动蠕动吸吮异物与浓精！`);
        }

        // 3. 恶堕度与羞耻度对心理独白/台词的强制同步
        if (corrStage <= 2 && shame >= 70) {
            rules.push(`- 【心理与台词基调（恶堕第${corrStage}阶/羞耻${shame}%）】：${userName}在理智上仍保有强烈的羞耻心与自尊防备，面对下流摆布或身体异样时面红耳赤、内心充满慌乱与自我剖析，呈现“嘴上矜持防备、身体却因极度敏感而诚实湿润战栗”的强烈反差感。`);
        } else if (corrStage === 3 || corrStage === 4) {
            rules.push(`- 【心理与台词基调（恶堕第${corrStage}阶·食髓知味/羞耻仅剩${shame}%）】：${userName}的道德廉耻防线已大面积崩塌（服从度${obey}%）！正文中她的抗拒只能是欲拒还迎的娇嗔，内心独白与肢体动作必须诚实地展现出对粗大肉棒与滚烫浓精的贪婪渴望，主动摇晃腰臀迎合抽插！`);
        } else if (corrStage >= 5) {
            rules.push(`- 【🔥心理与台词终极恶堕铁律（第${corrStage}阶段·${corrStage === 6 ? "100%深渊恶堕母猪女皇" : "公用肉便器"}｜羞耻度仅${shame}%）】：${userName}的廉耻心与人类尊严已彻底灰飞烟灭！**正文中严禁再让她表现出任何清高、抗拒或害羞遮掩**！她的言谈举止、神态表情与内心独白必须100%呈现出彻底沉沦于肉欲的发情母犬/肉便器姿态，以被粗暴贯穿、内射灌精、当众露出与失禁喷潮为至高无上的幸福，主动掰开肉穴哭求雄性使用！`);
        }

        return `\n【🚨 状态栏生理与心理阶段反向强制同步指令（AI正文必须100%严格执行，绝不可与状态栏脱节！）】\n` + rules.join("\n") + `\n`;
    }

    function buildFullSystemPrompt(userName, currentVars) {
        const currentYaml = varsToYaml(userName, currentVars);
        const diff = getDifficultyProfile();
        const enforceBlock = buildPhysiologicalEnforcementPrompt(userName, currentVars);
        return `\n【当前变量库实时注入值（调教难度系数：${diff.mult}x｜请严格遵循故事原文的主角真实身份与种族，切勿篡改设定）】\n${currentYaml}\n${enforceBlock}\n
【🔥状态栏 1.0 变量实时更新规范】
1. 每条回复末尾输出：<UpdateVariable>块</UpdateVariable>。
2. 若主角在文中发生改名、变形或身份转换，必须用 _.set('${userName}.档案.当前认知名字', '文中新名字'); 实时同步！
3. **总账与状态实时联动**：只要正文中发生了小穴贯穿、口交、乳交、肛交、内射、吞精、高潮、潮吹、失禁、自慰、露出或接客，必须在 <UpdateVariable> 中用 _.set 准确累加对应的【计数】字段（状态栏将根据总账次数自动演进 1~6 阶段）！`;
    }

    // =========================================================================
    // 🎨 【双层黄金分割卡片排版引擎：文字与图片上下分层，图片固定 84x84 绝不被挡！】
    // =========================================================================
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
            const sm = { "第一阶段": 15, "第二阶段": 35, "第三阶段": 55, "第四阶段": 75, "第五阶段": 90, "第六阶段": 100 };
            for (const [k, v] of Object.entries(sm)) if (rawKeyStr.includes(k)) { pct = v; break; }
        }
        const badges = [];
        let cleanTitle = rawKeyStr
            .replace(/「([^」]{1,45})」/g, (_, s) => {
                const isStage6 = s.includes("第六阶段") || s.includes("100%") || s.includes("神格") || s.includes("女皇") || s.includes("万夫莫敌") || s.includes("真祖");
                const isStage5 = !isStage6 && (s.includes("第五阶段") || s.includes("终极") || s.includes("脑髓熔断") || s.includes("便器") || s.includes("赤裸") || s.includes("真空") || s.includes("危险排卵"));
                const bBg = isStage6 ? "linear-gradient(90deg,#ff0055,#7e22ce,#ca8a04)" : isStage5 ? "linear-gradient(90deg,#ff003c,#2b0012)" : tc.hi;
                const bCol = (isStage6 || isStage5) ? "#fff" : tc.text;
                const cls = isStage6 ? "st-stage6-badge" : isStage5 ? "st-stage5-badge" : "";
                badges.push(`<span class="${cls}" style="background:${bBg};border:1px solid ${tc.sec};color:${bCol};padding:2px 7px;border-radius:6px;font-size:11px;font-weight:bold;display:inline-block;">${s}</span>`);
                return "";
            })
            .replace(/[（(]([^）)]{1,45}?(?:阶段|\d+\s*[\/／]\s*\d+)[^）)]{0,25}?)[）)]/g, (_, s) => {
                badges.push(`<span style="background:rgba(255,255,255,0.1);border:1px solid ${tc.prim};color:${tc.prim};padding:1px 7px;border-radius:6px;font-size:11px;display:inline-block;">${s}</span>`);
                return "";
            })
            .replace(/[：:]\s*(\d+(?:\.\d+)?\s*[\/／]\s*\d+[a-zA-Z\u4e00-\u9fa5]*)\s*$/, (_, n) => {
                if (!hideBar) {
                    badges.unshift(`<span style="background:rgba(249,226,175,0.16);border:1px solid rgba(249,226,175,0.45);color:#f9e2af;padding:1px 7px;border-radius:6px;font-size:11px;font-family:Consolas,monospace;font-weight:bold;display:inline-block;">${n}</span>`);
                }
                return "";
            })
            .replace(/[：:]\s*$/, "").trim();

        // 标题与徽章上下紧凑排列，绝不横向撑爆挤压右侧图片！
        const keyHTML = `<div style="display:flex;flex-direction:column;gap:4px;width:100%;">
            <div style="color:#f9e2af;font-weight:bold;font-size:13.5px;line-height:1.35;word-break:break-word;">${cleanTitle}</div>
            ${badges.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;">${badges.join("")}</div>` : ""}
        </div>`;

        // 进度条与颜文字采用「上标头 + 下整根通栏流光条」设计，放置在图文区正下方，100% 宽度，绝不挡图！
        let barHTML = "";
        if (pct !== null && !hideBar) {
            const st = getThemedBarStyle(pct, barTheme);
            const mainLabel = subBarCfg ? `${pct}%` : (rawRatioStr && rawRatioStr.includes("ml") ? rawRatioStr : (pct + "%"));
            barHTML = `<div style="display:flex;flex-direction:column;gap:7px;margin-top:4px;width:100%;background:rgba(0,0,0,0.36);padding:7px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);">
                <div style="display:flex;flex-direction:column;gap:3px;width:100%;">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                        <span style="font-size:11px;color:#f5c2e7;font-weight:bold;">${subBarCfg ? (subBarCfg.mainName || "🔥 阶段进度") : `📊 实时进度 (${mainLabel})`}</span>
                        <div style="display:flex;align-items:center;gap:6px;">
                            ${st.emo}
                            ${subBarCfg ? `<span style="font-size:11px;color:${st.labelColor};font-family:Consolas,monospace;font-weight:bold;">${mainLabel}</span>` : ""}
                        </div>
                    </div>
                    <div style="width:100%;height:8.5px;background:rgba(0,0,0,0.8);border:1px solid rgba(255,255,255,0.18);border-radius:99px;overflow:hidden;padding:1px;">
                        <div style="width:${pct}%;height:100%;background:${st.grad};border-radius:99px;box-shadow:${st.glow};transition:width 0.4s ease;"></div>
                    </div>
                </div>`;

            if (subBarCfg) {
                const subPct = Math.max(0, Math.min(100, safeNum(subBarCfg.pct, 0)));
                const subSt = getThemedBarStyle(subPct, subBarCfg.theme || "semen");
                barHTML += `
                <div style="display:flex;flex-direction:column;gap:3px;width:100%;padding-top:3px;border-top:1px dashed rgba(255,255,255,0.08);">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                        <span style="font-size:10.5px;color:${subSt.labelColor};font-weight:bold;opacity:0.95;">${subBarCfg.label || "💧 容量"}</span>
                        <div style="display:flex;align-items:center;gap:6px;">
                            ${subSt.emo}
                            <span style="font-size:10.5px;color:${subSt.labelColor};font-family:Consolas,monospace;font-weight:bold;">${subBarCfg.text || (subPct + "%")}</span>
                        </div>
                    </div>
                    <div style="width:100%;height:7px;background:rgba(0,0,0,0.8);border:1px solid rgba(255,255,255,0.14);border-radius:99px;overflow:hidden;padding:1px;">
                        <div style="width:${subPct}%;height:100%;background:${subSt.grad};border-radius:99px;box-shadow:${subSt.glow};transition:width 0.4s ease;"></div>
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
        res.bodyDesc = pick(/(?:容颜|肌肤|皮肤|小手|十指|青丝|长发|柳腰|曲线|身段|丰满|白皙|臀|腿)/, 3) || (charDesc ? charDesc.slice(0, 120) : `${u}拥有极为细腻敏感的娇躯。`);
        res.pose = pick(/(?:撑起|扶着|站起|捂住|喘息|瘫坐|一僵|收拢|颤抖|跪|趴|弯腰|夹紧|退后|张开|躺)/, 2);
        res.mouth = pick(/(?:喉咙|声音|嗓音|红唇|唇瓣|舌|喘|啼鸣|娇呼|吞咽|口水|涎)/, 2);
        res.chest = pick(/(?:胸|乳|丰盈|双峰|蓓蕾|奶|锁骨)/, 2);
        res.vag = pick(/(?:下身|下半身|阴唇|花唇|小穴|骚逼|幽谷|私处|爱液|湿热|淫水|肉缝)/, 2);
        res.womb = pick(/(?:小腹|下腹|子宫|宫颈|肚子|深处|暖意|抽搐|内射|精液|白浊)/, 2);
        res.anal = pick(/(?:臀|屁股|后庭|屁眼|菊|腰臀|S型)/, 2);

        res.headWear = pick(/(?:青丝|长发|发丝|发簪|发带|刘海|眼罩|眼镜|耳环|耳尖|口球|面纱|头饰)/, 2);
        res.neckWear = pick(/(?:项圈|锁骨|雪颈|脖颈|项链|铃铛|锁链|喉咙|衣领|领口)/, 2);
        res.braWear = pick(/(?:裹胸|胸罩|文胸|乳夹|肚兜|内衬|真空|乳肉|蓓蕾|乳头)/, 2);
        res.topWear = pick(/(?:战袍|上衣|T恤|衬衫|外套|长袍|毛衣|束腰|束带|衣襟|下摆)/, 2);
        res.pantyWear = pick(/(?:内裤|底裤|衬裤|丁字裤|开裆|胖次|阴唇|私处|光裸)/, 2);
        res.bottomWear = pick(/(?:长裙|短裙|裙摆|百褶裙|裤子|短裤|热裤|紧身裤|战袍裙)/, 2);
        res.sockWear = pick(/(?:丝袜|黑丝|白丝|吊带袜|网袜|长袜|大腿|双腿|膝盖|裸腿)/, 2);
        res.shoeWear = pick(/(?:战靴|高跟鞋|皮鞋|拖鞋|凉鞋|鞋子|玉足|脚趾|足|赤足)/, 2);

        return res;
    }

    // 6 阶段核心指标详情生成器（含第 6 阶段 100% 满值神格化文案）
    function getDynamicMetricDetail(type, v, u, liveCtx) {
        const ovr = v.按钮详情?.[type];
        const diff = getDifficultyProfile();
        const realId = detectRealCharacterIdentity(v);
        const map = {
            cockLove: {
                val: safeNum(v.核心数值?.对肉棒好感度), rev: false,
                st: ["抗拒排斥•本能戒备", "工具麻木•形状适应", "食髓知味•含泪渴求", "痴迷崇拜•主动跪舔", "肉棒至上•发情母犬", "👑肉棒神明•终极死忠"],
                d: [
                    `【🔬 神经与粘膜对雄性阳具的反应】：${u}在意识层面仍将粗硬滚烫、血管盘虬的雄性肉棒视为极具威胁的侵犯异物；面对雄性费洛蒙压迫时，心跳加速，双腿本能内扣夹紧。\n💭【${u}的实时内心感受】：“*呜……光是感受到那根青筋暴起、又粗又烫的男人东西隔着空气散发的腥热气味，我的小肚子就本能地一阵阵发紧💦！那种硕大粗鲁的东西要是强行捅进来绝对会把身体撑坏的……😳❤️*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：理智上的戒备已被频繁的肉体接触瓦解。${u}的口腔舌苔与阴道肉褶已经记住了阳具粗硬的柱身棱角与冠沟形状，只要被龟头抵住穴口便会自动泌出滑腻淫水。\n💭【${u}的实时内心感受】：“*嘴唇和下面的花唇一碰到那根滚烫坚硬的柱身，连思考都还没来得及，里面的肉壁就已经自己软下来分泌出润滑粘液了😳💦……每当硕大的龟头刮过敏感软肉时，腰眼还是会诚实地酸软塌下去啊🥵*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：矜持外壳已被粗暴撞碎！${u}对滚烫大肉棒产生了深入骨髓的生理饥渴，阴道内壁层叠的媚肉一缩一缩地空虚蠕动，渴望被硕大龟头狠狠撑开填满。\n💭【${u}的实时内心感受】：“*哈啊……骚穴里面又空又痒，透明的淫水已经顺着大腿根流湿了一大片了💦！试过被滚烫粗大的真肉棒狠狠填满到子宫口的滋味之后，求求你快把那根青筋跳动的大肉棒一口气捅进我的最深处吧🥵❤️！*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：彻底沉溺于阳具崇拜的发情母犬！将舔舐、含弄与夹紧大肉棒视作人生最高奖赏，一见到勃起巨物便双膝发软跪倒在地主动伸舌奉侍。\n💭【${u}的实时内心感受】：“*唔嗯、啾噜♡……大肉棒顶在舌尖上沉甸甸热乎乎的触感太棒了，浓烈的精腥味一冲进鼻腔，我的骚逼就自己喷出一股热流了🥵💦！快用这根滚烫的大鸡巴捅穿我的喉咙和骚逼吧❤️❤️！*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：大脑皮层已被粗大肉棒与滚烫浓精高度支配！离开肉棒的填塞就会陷入戒断恐慌，上下两张嘴同时流涎喷水。\n💭【${u}的实时内心感受】：“*啊嘿、呕咕♡……只要身体里没有大鸡巴插着，全身的肉洞就会空虚得直抽筋🥵💦！${u}只是天生为了包裹大肉棒才长出来的活体肉套子呀❤️❤️！*”`,
                    `【👑 第六阶段·100%终极满值/肉棒神明死忠】：全书最高阳具崇拜完全体！${u}已将雄性阳具奉为支配自己生命与灵魂的唯一神明！哪怕只是看一眼勃起的肉棒，全身六孔便会瞬间失禁喷潮、跪伏在地用脸颊和舌头狂热摩挲马眼，祈求一辈子作为挂在肉棒上的专属排精肉便器死去！\n💭【${u}的实时内心感受】：“*啊゛啊゛——大肉棒神明大人♡！！100%彻底沦陷了，${u}的每一寸肉褶、每一颗细胞都刻满了大鸡巴的形状🥵💦！没有肉棒大人塞满的人生连一秒钟都活不下去，请一辈子焊死在人家的子宫里、把${u}活活操死在神圣的肉棒上吧❤️❤️❤️！！*”`
                ]
            },
            lust: {
                val: safeNum(v.核心数值?.性欲程度), rev: false,
                st: ["表面克制•余韵温吞", "春情暗涌•乳尖发硬", "欲火焚身•淫水湿裤", "重度发骚•夹腿磨逼", "狂暴发情•三穴喷水", "👑永昼发情•母兽完全体"],
                d: [
                    `【🔬 体内荷尔蒙与情欲实况】：表面维持着平静或事后的温吞倦怠，但敏感躯体对衣料刮蹭与空气流动依然异常敏锐。\n💭【${u}的实时内心感受】：“*呼……现在身体总算稍微平静下来一点了，只是胸口和下身还残留着温吞吞的酸胀余温💦，稍微走动时布料擦过敏感点还是会让人心跳加速呢😳❤️*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：小腹深处升起一股挥之不去的燥热暗流！雌性荷尔蒙在血管里悄然沸腾，胸前乳头在布料下充血硬挺，两腿之间泛起黏腻潮意。\n💭【${u}的实时内心感受】：“*唔……身体怎么越来越热了😳？胸口的两粒尖尖自己在衣服下面充血发硬，连两条腿中间也开始湿漉漉地发黏了，好想让一双火热的大手直接按上来揉一揉啊🥵❤️*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：滚烫的情欲之火烧遍四肢百骸！双颊浮现淫靡酡红，包皮下的阴蒂肉珠充血肿大，大量透明拉丝的淫水早已将大腿内侧浸得泥泞不堪！\n💭【${u}的实时内心感受】：“*哈啊……身体烫得像发高烧一样，小穴里涌出来的滚烫淫水已经顺着腿肚往下淌白线了🥵💦！两条腿怎么死死夹紧摩擦都止不住里面的骚痒，快用粗硬的东西捅进来灭火呀❤️❤️！*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：重度发情失控状态！全身肌肤烫得像火炉，双腿死死交叠磨蹭着充血外翻的阴唇，全身毛孔散发着浓烈的雌性发情骚香。\n💭【${u}的实时内心感受】：“*唔嗯♡……烧起来了、全身每一根神经都在着火！外翻的阴唇和阴蒂肿得一碰就飙水🥵💦，现在的我满脑子只想着交配挨肏，快用滚烫浓精把发情的子宫浇透吧❤️❤️！*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：大脑已被发情荷尔蒙高度浸泡，骚穴如同失控的水龙头般向外喷涌滚烫淫水！\n💭【${u}的实时内心感受】：“*啊啊♡……发情停不下来了！骚穴和屁眼一直在噗嗤噗嗤往外喷淫水，子宫口饥渴得自己往下脱垂要吃精液了🥵💦！*”`,
                    `【👑 第六阶段·100%终极满值/永昼发情母兽】：全书最高发情完全体！${u}的内分泌系统已被彻底改写为24小时永不退潮的终极发情母兽！全身肌肤泛着催情桃红，呼出的每一口热气与每一滴汗水都饱含高浓度催情费洛蒙，随时随地处于不交配就会高潮休克的狂暴索精状态！\n💭【${u}的实时内心感受】：“*啊゛啊゛——血管里流的全都是滚烫的春药了♡！！100%永昼发情停不下来了，全身每一个毛孔都在发骚喷水🥵💦！快点来十个、百个男人把人家按在地上日夜不停地轮奸内射吧❤️❤️❤️！！*”`
                ]
            },
            corr: {
                val: safeNum(v.核心数值?.淫乱恶堕), rev: false,
                st: ["死守矜持•道德防备", "风尘浸染•自我麻痹", "食髓知味•放荡迎合", "下贱娼妇•肉器自觉", "脑髓熔断•公用精盆", "👑深渊恶堕•母猪女皇"],
                d: [
                    `【🔬 道德底线与自我认知解剖】：心底仍保留着正常人的自尊与羞耻底线，对暴露、视奸与粗鄙亵渎感到屈辱，试图在困境中守住体面。\n💭【${u}的实时内心感受】：“*虽然身体因为外界的刺激而有些发烫发颤，但我的底线绝对不能丢💦！只希望这具过于敏感的肉体千万别在关键时刻因为快感而背叛我的意志啊😳……*”`,
                    `【🔬 道德底线与自我认知解剖】：在反复的肉体冲击下，贞洁观念已被磨灭大半，学会了用麻木与顺从麻痹自己。\n💭【${u}的实时内心感受】：“*看着自己双腿之间被折腾得红肿湿润的私处，心里已经不再像最开始那样剧烈抗拒了💦。放下道德包袱之后，被按在身下贯穿时好像反而更容易体会到酥麻快感了呢😳❤️*”`,
                    `【🔬 道德底线与自我认知解剖】：廉耻防线已被彻底冲垮！开始在背德与被粗暴亵渎的过程中品尝到灭顶快感，身体比嘴巴更早一步学会了摇臀迎合。\n💭【${u}的实时内心感受】：“*哈啊……每当被男人用粗鄙字眼辱骂或者强行深喉内射的时候，我的骚穴反而会条件反射般夹得更紧、流出更多淫水🥵💦！原来堕落成贪图肉欲的坏女人是这么爽到骨子里的事呀❤️❤️！*”`,
                    `【🔬 道德底线与自我认知解剖】：身心彻底恶堕的风尘尤物与下贱母狗！以自己饱满的胸臀和紧致肉穴能成为男人发泄兽欲的肉套子为荣，主动掰开红肿花唇展示内里的淫靡泥泞。\n💭【${u}的实时内心感受】：“*嘻嘻♡……只要想到自己这副丰满白腻的身体正在被男人当成泄欲肉壶肆意抽插，我的乳头和阴蒂就会兴奋得直发抖🥵💦！快来看看人家主动掰开的骚逼有多下流吧❤️❤️！*”`,
                    `【🔬 道德底线与自我认知解剖】：人类尊严大面积湮灭，视被轮奸、灌精、涂写正字与当众失禁为莫大幸福！\n💭【${u}的实时内心感受】：“*啊嘿、咕啾♡……${u}只是一个印满了『正』字、供雄性随时插进来射精的公用肉便器母猪呀🥵💦！*”`,
                    `【👑 第六阶段·100%终极满值/深渊恶堕母猪女皇】：全书最高恶堕终极神格化！${u}已彻底完成从“人类女性”向“100%深渊恶堕母猪女皇”的终极蜕变！道德、矜持与人类羞耻心在她的灵魂中0%残留，她以自身六孔成为天下雄性的极乐排泄池为至高荣耀，举手投足皆是令人骨头酥软的极致淫靡！\n💭【${u}的实时内心感受】：“*啊゛啊゛——100%恶堕大成啦♡！！什么人类尊严早就挫骨扬灰了，现在的${u}就是统御万千精液的深渊肉便器女皇呀🥵💦！不管是男人、老头还是异种野兽，全都排队把最浓最臭的精浆灌进人家的六孔里，让我们一起沉沦在永无止境的交配地狱里吧❤️❤️❤️！！*”`
                ]
            },
            shame: {
                val: safeNum(v.精神与心理?.羞耻度, 100), rev: true,
                st: ["羞愤欲死•满面通红", "薄面潮红•咬唇隐忍", "半推半就•羞耻松动", "习以为常•羞耻钝化", "不知廉耻•敞腿任看", "👑廉耻归零•裸行母犬"],
                d: [
                    `【🔬 羞耻神经防线与快感反噬（当前羞耻残余：${safeNum(v.精神与心理?.羞耻度, 100)}%）】：羞耻心处于极高初态！对私密部位的暴露感到极度恐慌，但剧烈的羞耻感正在交感神经作用下成倍放大肉体敏感度。\n💭【${u}的实时内心感受】：“*呜哇啊啊……脸颊和耳朵尖烫得像要滴出血来一样💦！要是被人看到我现在这副丢脸模样，真恨不得找条地缝钻进去……可为什么越是羞愤欲死，下面的肉缝反而越敏感越湿啊😳🥵！*”`,
                    `【🔬 羞耻神经防线与快感反噬】：在连续的羞耻冲击下防线开始松动，私密处被注视或沾染体液时虽仍心跳加速，但遮挡的双手已变得迟疑无力。\n💭【${u}的实时内心感受】：“*别、别用那种火辣辣的眼神一直盯着我的胸口和两腿之间看啊😳💦……想要伸手去挡住春光可手臂却软绵绵的使不上劲，小穴深处居然可耻地自己收缩流汁了❤️*”`,
                    `【🔬 羞耻神经防线与快感反噬】：羞耻感已消退近半，面对衣衫不整或私密触碰已呈现半推半就的顺应姿态。\n💭【${u}的实时内心感受】：“*唔……虽然被这样肆无忌惮地看着还是有点难为情，但身体早就习惯了在视线下一边发抖一边流淫水的快感了呢😳💦……*”`,
                    `【🔬 羞耻神经防线与快感反噬】：羞耻感已被磨灭大半，哪怕光着下身当面擦拭腿根精液，内心也已习以为常。\n💭【${u}的实时内心感受】：“*全身上下每一寸皮肤、每一条肉缝早就被看光摸遍了💦，现在再遮遮掩掩还有什么意义呢？这种真空走动的放松感反而让人隐隐有些暗爽呢🥵*”`,
                    `【🔬 羞耻神经防线与快感反噬】：廉耻心几乎荡然无存！不仅对赤裸和满身精斑毫不在意，反而会在被人视奸私处时兴奋得阴蒂充血、主动分开大腿方便观赏。\n💭【${u}的实时内心感受】：“*哈啊♡……只要感受到男人们火热的视线黏在我的奶子和骚逼上，淫水噗嗤一声就涌出来了🥵💦！越盯着人家看、人家流的水就越多哟❤️❤️！*”`,
                    `【👑 第六阶段·0%羞耻彻底归零/终极裸行母犬】：羞耻度已100%彻底剥落归零！${u}已完全丧失人类关于“穿衣遮羞”的概念，哪怕在光天化日的大街上被剥光衣服拴着狗链四肢爬行、当众掰开洞开的骚穴展示宫口喷尿潮吹，她也会露出最甜美淫荡的阿嘿颜笑容迎接着所有人的视奸与拍摄！\n💭【${u}的实时内心感受】：“*啊嘿♡……羞耻心那种多余的东西已经是 0% 啦🥵💦！衣服本来就是阻碍大鸡巴随时插进来的累赘呀，快把全身涂满精液和正字的${u}牵到人最多的大街中央去当众轮奸、让所有人围观母狗当众失禁喷潮的痴态吧❤️❤️❤️！！*”`
                ]
            },
            obey: {
                val: safeNum(v.精神与心理?.服从度), rev: false,
                st: ["孤高抗拒•强撑气场", "委曲求全•被动妥协", "温顺听话•熟练配合", "摇尾乞怜•任打任操", "绝对盲从•肉奴母犬", "👑巴甫洛夫•终极家畜"],
                d: [
                    `【🔬 意志防线与服从实况】：表面极力维持着防备或自尊气场，抗拒无理摆布。\n💭【${u}的实时内心感受】：“*紧咬着下唇稳住有些发软的膝盖，哪怕呼吸急促，脊背依然死死挺直💦！我绝不会轻易在男人面前低头屈服😳！*”`,
                    `【🔬 意志防线与服从实况】：在局势逼迫或肉体酸软下学会了被动妥协，身体老老实实地顺从配合。\n💭【${u}的实时内心感受】：“*人在屋檐下不得不低头……不如先委曲求全地顺从配合，而且放弃徒劳挣扎乖乖听话的时候，肉体承受冲击的快感好像也变得更清晰了😳💦*”`,
                    `【🔬 意志防线与服从实况】：已形成熟练的温顺顺从习惯，懂得主动放松腰臀、顺着对方的抽插节奏换取奖赏。\n💭【${u}的实时内心感受】：“*只要听到发话或者手掌按上腰臀，身体就会无比熟练地把双腿分开迎合插入的角度💦，乖乖听话还能被顶得浑身舒爽呢🥵❤️*”`,
                    `【🔬 意志防线与服从实况】：彻底被驯服的摇尾母犬！对任何粗暴命令都奉若圣旨，挨打受罚时还会流着淫水感恩戴德。\n💭【${u}的实时内心感受】：“*汪呜♡……只要听到主人的声音，膝盖就会自动一软跪趴在地上，屁股高高撅起🥵💦！主人的每一句命令都是对下贱母狗的恩赐呀❤️❤️！*”`,
                    `【🔬 意志防线与服从实况】：自主意志几近抹除，身体已形成刻入脊髓的服从反射。\n💭【${u}的实时内心感受】：“*啊嘿♡……一听到命令，大脑连思考都没有，身体就已经自动四脚朝天掰开三穴等待使用了🥵💦！*”`,
                    `【👑 第六阶段·100%终极满值/巴甫洛夫绝对家畜】：全书最高服从完全体！${u}的自我自由意志已被100%格式化，彻底化作只靠主人指令驱动的巴甫洛夫肉体人偶与绝对家畜！主人让她高潮她才能高潮，主人不准她排泄她哪怕膀胱撑破也不敢漏出一滴，连心跳与呼吸都只为侍奉主人而存在！\n💭【${u}的实时内心感受】：“*汪！汪呜♡！！100%绝对服从主人大人🥵💦！${u}没有自己的思想、没有自己的人格，从头发丝到子宫内壁的每一块肉全都是主人大人的私有财产，请随意下达最残酷下流的指令来支配这头家畜母猪吧❤️❤️❤️！！*”`
                ]
            },
            pleas: {
                val: safeNum(v.精神与心理?.快感累积), rev: false,
                st: ["余韵回落•断瘾空虚", "酥麻窜动•春水溢出", "快感攀升•趾尖蜷缩", "濒临绝顶•痉挛绷紧", "高潮过载•潮吹失神", "👑阿片熔断•脑死极乐"],
                d: [
                    `【🔬 神经快感蓄积与高潮后余韵】：当前处于高潮泄身后的余韵回落期或初始微麻状态。\n💭【${u}的实时内心感受】：“*呼……全身的肌肉还在轻微抽动，只是胸口发硬的乳尖和微肿的阴蒂还是敏感到极点，稍微被衣服擦过一下，尾椎骨就会窜起一缕让人腿软的电流余韵💦❤️*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：酥麻滚烫的快感电流正顺着尾椎骨一路窜向小腹与后脑！粘膜在摩擦下一缩一缩地泌出润滑爱液。\n💭【${u}的实时内心感受】：“*唔嗯……那股麻酥酥的快感电流又顺着脊椎骨往小肚子上窜了，腿根发酸得直打哆嗦😳💦！要是再继续摩擦那个最敏感的地方，快感真的要刹不住车了啦🥵❤️！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：密集汹涌的快感浪潮不断拍打中枢神经！每一次刮蹭与顶弄都令全身剧烈颤抖、十根脚趾本能地紧紧蜷缩。\n💭【${u}的实时内心感受】：“*啊啊……快感像涨潮的海水一样一波接一波往脑门上拍，爽得十根脚趾头都麻得死死蜷缩起来了🥵💦！嘴唇根本关不上，甜腻的浪叫声一声接一声往外漏呀❤️❤️！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：快感已蓄积至决堤崩溃的临界点！小腹子宫与阴道括约肌剧烈绷紧痉挛，只要再受一丝刮蹭就会引爆灭顶绝顶！\n💭【${u}的实时内心感受】：“*要、要去了！小肚子最深处和整个阴道括约肌全都绷紧到了极限，随时都要炸开了🥵💦！求求你快再重重地顶最后一下，让我痛痛快快地高潮泄出来呀❤️❤️❤️！！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：灭顶高潮如海啸般连续轰击大脑，双眼翻白、滚烫潮吹与失禁液体从痉挛的穴口狂喷而出！\n💭【${u}的实时内心感受】：“*啊゛啊゛去了去了又去了♡！！脑子轰的一声炸成白光了，骚逼和尿道口像决堤一样狂喷潮吹，浑身抽搐得停不下来🥵💦！*”`,
                    `【👑 第六阶段·100%终极满值/阿片过载脑死极乐】：全书最高快感过载完全体！无穷无尽的100%超限多重高潮已将${u}的大脑多巴胺与阿片受体彻底熔断烧穿！她陷入了永不落幕的“连续绝顶脑死极乐状态”，双眼翻白成爱心、嘴角流涎不止，全身肌肉规律性痉挛抽搐，六孔如同失控喷泉般喷干最后一滴体液！\n💭【${u}的实时内心感受】：“*啊゛——唔咕、啊嘿嘿♡！！100%脑髓彻底被高潮白光烧穿融化了🥵💦！分不清是第几十次绝顶了，全身每一根神经都在放烟花，就算人已经爽到翻白眼休克脑死了，下面的骚肉也还在自己疯狂痉挛喷水呀❤️❤️❤️！！*”`
                ]
            },
            sta: {
                val: safeNum(v.身体?.体力, 100), rev: true,
                st: ["精力充沛•气息平稳", "微带倦意•腰腿酸软", "香汗淋漓•双腿打颤", "双腿筛糠•瘫软无力", "濒临脱力•意识模糊", "👑彻底虚脱•失神肉泥"],
                d: [
                    `【🔬 肌肉耐受与体力消耗实况（当前体力：${safeNum(v.身体?.体力, 100)}%）】：体力充沛，呼吸尚算平稳，足以支撑接下来的活动。\n💭【${u}的实时内心感受】：“*呼……深吸一口气，目前四肢和腰腹的力气还算充足💦，就算接下来还要面对更激烈的场面也完全撑得住。*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：承受过肉体折腾后，双腿内侧肌肉略微酸软发颤，小腹带着明显的坠胀倦意。\n💭【${u}的实时内心感受】：“*哈……现在大腿内侧和腰眼还一阵阵发酸发软，小肚子也沉甸甸地往下坠😳💦，这种肌肉酸软无力的感觉让下身的余韵显得更加清晰粘腻了❤️*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：体力消耗过半，全身被黏腻香汗浸透，膝盖发软打颤，连站立都需要扶着东西借力。\n💭【${u}的实时内心感受】：“*呜……力气已经被抽走一大半了🥵💦，全身上下全是黏腻的香汗，两条腿直打哆嗦，现在如果不扶着东西根本站不稳呀❤️*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：高强度的连续侵犯抽干了全身力气，双腿筛糠般痉挛，只能软绵绵地瘫倒任由摆布。\n💭【${u}的实时内心感受】：“*哈啊……连抬起一根手指头或者并拢大腿的力气都快被榨干了🥵💦，现在只能像一滩融化的奶油一样软绵绵地瘫在那里任人摆布了呀❤️*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：体力仅剩最后一丝，眼前发黑、呼吸微弱，随时会陷入昏厥。\n💭【${u}的实时内心感受】：“*唔……全身骨头都快散架了，连眼皮都沉重得抬不起来，快要累得昏死过去了🥵💦……*”`,
                    `【👑 第六阶段·0%体力彻底清零/失神休克肉泥】：体力已100%消耗殆尽归零！${u}全身骨骼与肌肉彻底脱力瘫痪，如同一滩毫无反抗能力的温热肉泥般四肢大张瘫软在地，意识在极度疲惫与高潮余韵冲击下进入半昏迷失神状态，唯有被玩坏的肉穴还在凭本能一抽一抽地吐着白浊泡沫！\n💭【${u}的实时内心感受】：“*唔咕……0%体力彻底耗光了，一根小指头都动不了、意识已经飘远昏死过去了🥵💦……可就算人已经累成一滩失神的肉泥了，被操烂的骚穴和子宫却还在自己一缩一缩地吞吐着浓精呢❤️❤️❤️……*”`
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

// ==================== 【第二段第一部分结束，请回复“继续”获取最后收尾代码】 ====================
    // =========================================================================
    // 🏛️ 【8 大板块全量组装中心（融合6阶段体系 + 18套独立光谱 + 跨部位生态传导）】
    // =========================================================================
    function buildFullFallbackCategories(u, c, v) {
        calibrateMentalMetrics(v);

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
        const eco = computeEcologicalNetwork(v);
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
        const milkCnt = safeNum(cnt.泌乳?.喷乳次数), milkMl = safeNum(cnt.泌乳?.累计毫升);

        let mouthMl = safeNum(sp.口内毫升), vagMl = safeNum(sp.小穴毫升), wombMl = safeNum(sp.子宫毫升), analMl = safeNum(sp.屁眼毫升);
        if (wombMl === 0 && creampie > 0 && /内射|灌满|精液.*滴|精液.*渗|白浊/.test(live.womb + live.vag)) {
            wombMl = 15; vagMl = 8;
        }
        const totalMl = mouthMl + vagMl + wombMl + analMl;
        const caps = calcHoleCapacities(v);

        const corr = safeNum(v.核心数值?.淫乱恶堕), lust = safeNum(v.核心数值?.性欲程度), pleas = safeNum(v.精神与心理?.快感累积);
        const shame = safeNum(v.精神与心理?.羞耻度, 100);
        const vagWidth = (1.5 + Math.min(4.8, (vagCnt / diff.mult) * 0.045)).toFixed(1);
        const vagClose = Math.max(0, Math.round(100 - eco.vagDev * 0.9 - ((wombMl + vagMl) > 0 ? 10 : 0)));
        const clitSize = (4.0 + Math.min(9.5, eco.clitDev * 0.08 + pleas * 0.02)).toFixed(1);
        const peeVal = Math.min(100, Math.round(10 + lust * 0.35 + pleas * 0.35 + eco.clitDev * 0.25 + (leakCnt > 0 ? 10 : 0)));
        const wetLevel = Math.min(100, Math.round(10 + lust * 0.55 + pleas * 0.45 + ((wombMl + vagMl) > 0 ? 30 : 0)));
        const fallVal = safeNum(v.精神与心理?.沦陷度), brkVal = safeNum(v.精神与心理?.人格崩解度), hypnoVal = safeNum(extPsy.催眠深度);
        const drugVal = safeNum(v.精神与心理?.媚药精液毒瘾);
        const fallMax = Math.max(fallVal, brkVal, hypnoVal), fallTier = tier6(fallMax, false);
        const tallyStrokes = creampie + vagCnt + analCnt + mouthCnt, tallyFull = Math.floor(tallyStrokes / 5);
        // 敏感度倍率受恶堕、快感、穿刺环、体内道具以及高羞耻反噬共同加成！
        const shameBoost = shame >= 70 && pleas >= 30 ? 0.8 : 0;
        const sensMult = (1.0 + corr * 0.08 + pleas * 0.05 + (eco.hasPierce ? 1.2 : 0) + (eco.hasProp ? 0.8 : 0) + shameBoost).toFixed(1);

        const { mouthDev, chestDev, vagDev, wombDev, clitDev, analDev } = eco;

        const tallyDev = tallyStrokes > 0 ? calcStageScore6(tallyStrokes, safeNum(mark.鞭痕与掌印), diff.mult, tallyStrokes >= 350 * diff.mult).val : 0;
        const tattooDev = eco.hasTattoo ? Math.max(50, corr) : Math.round(corr * 0.75 + wombDev * 0.2);
        const pierceDev = eco.hasPierce ? Math.max(55, corr) : Math.round(chestDev * 0.4 + clitDev * 0.4);
        const propDev = eco.hasProp ? Math.max(55, pleas) : Math.round(vagDev * 0.35 + analDev * 0.35);

        const mouthStg = `${stageNameFromVal(mouthDev)}•${["洁净初唇", "唾液敏化", "深喉成瘾", "吞精肉壶", "呕吐丧失", "👑终极榨精口器"][tier6(mouthDev)]}`;
        const chestStg = `${stageNameFromVal(chestDev)}•${["娇嫩处乳", "乳尖充血", "揉捏变形", "乳腺打通", "母畜喷乳", "👑永动机母乳壶"][tier6(chestDev)]}`;
        const vagStg   = `${stageNameFromVal(vagDev)}•${["处女一线鲍", "初破微张", "充血外翻", "大开肉壶", "合不拢漏精", "👑万夫莫敌名器"][tier6(vagDev)]}`;
        const wombStg  = `${stageNameFromVal(wombDev)}•${["紧闭处子", "宫口酸软", "锁精苗床", "宫口微张", "宫口脱垂", "👑真祖锁精苗床"][tier6(wombDev)]}`;
        const clitStg  = `${stageNameFromVal(clitDev)}•${["包皮隐没", "充血勃起", "肥大酸豆", "括约肌松弛", "喷潮漏尿", "👑失禁水龙头"][tier6(clitDev)]}`;
        const analStg  = `${stageNameFromVal(analDev)}•${["紧闭菊蕾", "异物适应", "括约肌软化", "后庭不拢", "灌肠喷精", "👑第二生殖腔"][tier6(analDev)]}`;

        const milkCap = Math.round(100 + milkCnt * 15);
        const curMilkMl = milkCnt > 0 ? Math.min(milkCap, Math.round(25 + lust * 0.8 + pleas * 0.5)) : 0;

        // 受孕板块与精液荷尔蒙深度联动
        const fertProb = Math.min(100, safeNum(preg.受孕概率, wombMl > 0 ? Math.min(98, 65 + Math.round(wombDev * 0.3)) : (creampie > 0 ? 45 : 15)));
        const ovulStageVal = Math.min(100, Math.round(12 + lust * 0.35 + wombDev * 0.35 + (wombMl > 0 ? 25 : 0)));
        const xrayStageVal = (creampie + wombMl) > 0 ? Math.min(100, Math.round(wombDev * 0.75 + (wombMl > 0 ? 25 : 0))) : 5;
        const dnaStageVal  = (creampie + swallowCnt + gangCnt) > 0 ? calcStageScore6(creampie * 1.3 + swallowCnt + gangCnt * 3, totalMl * 0.3, diff.mult, creampie >= 40 && totalMl >= 100).val : (totalMl > 0 ? 22 : 0);
        const bellySwellPct = Math.min(100, Math.round(safeNum(preg.怀孕进度) + (totalMl / Math.max(100, caps.wombMax)) * 65));
        const pregStageVal = preg.子宫怀孕 ? Math.max(70, safeNum(preg.怀孕进度)) : Math.min(99, Math.round(bellySwellPct * 0.8 + safeNum(preg.生产产卵次数) * 20));

        const ovulStg = `${stageNameFromVal(ovulStageVal)}•${preg.生理周期阶段 || "危险排卵期"}`;
        const xrayStg = `${stageNameFromVal(xrayStageVal)}•${["卵子待受精", "精虫游入", "精虫围攻卵子", "高危着床临界", "受精着床完成", "👑百发百中神胎"][tier6(xrayStageVal)]}`;
        const dnaStg  = `${stageNameFromVal(dnaStageVal)}•${totalMl > 0 ? `${c}浓精标记` : "无外来DNA"}`;
        const pregStg = `${stageNameFromVal(pregStageVal)}•${preg.子宫怀孕 ? "恶堕孕肚着床" : (totalMl > 0 ? "精液撑起微隆" : "平坦处子小腹")}`;
        const totalCapAll = caps.mouthMax + caps.vagMax + caps.wombMax + caps.analMax;

        const marketRank = corr >= 100 ? "👑神级·万夫共享终极母猪" : corr >= 80 ? "SSS级·特等公用肉便器" : corr >= 50 ? "A级·熟透风俗名器" : hookerCnt > 0 ? "B级·暗娼接客肉体" : "S级·纯洁无瑕处子禁脔";
        const marketPrice = prof.风月挂牌身价 || (hookerCnt > 0 ? `单次皮肉资 ${Math.max(50, 800 - corr * 7)} 元（已累计接客 ${hookerCnt} 次，内射不加价）` : `无价之宝（若沦落风尘挂牌，初夜拍卖估值极高）`);

        const fmtOvr = (key, defObj, defThought) => {
            if (ovr[key] && (ovr[key].desc || ovr[key].thought)) {
                return `${ovr[key].desc || defObj}\n💭【${u}的实时内心感受】：“*${cleanThoughtText(ovr[key].thought || defThought)}*”`;
            }
            return `${defObj}\n💭【${u}的实时内心感受】：“*${cleanThoughtText(defThought)}*”`;
        };

        const curThought = cleanThoughtText(ovr.内心独白?.thought || rt.内心独白 || live.thought || (corr >= 60 ? `哈啊……身体里面又热又空虚，被开发过的骚穴和乳尖一直在自己发麻流水🥵💦！什么体面和节操早就无所谓了，快点过来按住我、用最粗的大肉棒把我的子宫狠狠灌满吧❤️！` : `呼……身体深处还残留着难以忽视的酸胀感与湿热感，每一寸皮肤都敏感到极点💦。我必须尽快稳住心神应付好眼前的局面，只是下面那种黏腻空虚的余韵不知道要过多久才能消退……😳`));
        const curPose = rt.当前姿势 || live.pose || `${u}正处于当前场景中，双腿微微发软，呼吸渐平。`;
        const allClothStr = safeStr(rt.当前衣装 || prop.穿戴中的标记物);

        const pickClothPart = (reg, fallbackStr) => {
            if (!allClothStr) return fallbackStr;
            const parts = allClothStr.split(/[、，；,;]+/).filter(s => reg.test(s));
            return parts.length ? parts.join("、") : fallbackStr;
        };

        const wearStateTag = wetLevel >= 85 ? "🔞泥泞失守" : wetLevel >= 55 ? "🔥汗湿走光" : wetLevel >= 25 ? "💦微乱泛潮" : "✨整洁完好";
        const headTxt = ovr.穿搭_头饰?.stage || wear.头饰与眼部 || live.headWear || pickClothPart(/(?:发|簪|冠|耳|眼|镜|面|帽)/, "微湿发丝•贴合面颊");
        const neckTxt = ovr.穿搭_颈部?.stage || wear.颈部与项圈 || live.neckWear || pickClothPart(/(?:项圈|颈|领|锁骨|链|巾)/, "白皙锁骨•敏感雪颈");
        const braTxt = ovr.穿搭_胸罩?.stage || wear.胸罩与裹胸 || live.braWear || pickClothPart(/(?:裹胸|胸罩|文胸|肚兜|乳|内衬|真空)/, "贴身内衬•乳尖凸起");
        const topTxt = ovr.穿搭_上衣?.stage || wear.上衣与束腰 || live.topWear || pickClothPart(/(?:袍|衣|衫|T恤|束腰|腰带|甲|服)/, "贴身上衣•勾勒胸腰");
        const pantyTxt = ovr.穿搭_内裤?.stage || wear.内裤与遮挡 || live.pantyWear || pickClothPart(/(?:衬裤|内裤|底裤|丁字裤|开裆|胖次|光裸)/, "贴身底裤•花唇湿润");
        const botTxt = ovr.穿搭_下装?.stage || wear.下装与裙裤 || live.bottomWear || pickClothPart(/(?:裙|裤|下摆)/, "下装裙裤•臀线饱满");
        const sockTxt = ovr.穿搭_丝袜?.stage || wear.丝袜与腿部 || live.sockWear || pickClothPart(/(?:袜|丝|腿环|绑腿|裸腿)/, "修长美腿•肌肤发烫");
        const shoeTxt = ovr.穿搭_鞋子?.stage || wear.鞋子与玉足 || live.shoeWear || pickClothPart(/(?:靴|鞋|拖鞋|履|足)/, "精致鞋履•脚趾微蜷");

        const unlockedFetishes = computeUnlockedFetishes(v);
        const fetishItems = unlockedFetishes.length > 0
            ? unlockedFetishes.map(fObj => mk(`fetish_${fObj.name}`, `🧬 ${fObj.name}：${fObj.val}/100「${fObj.stage}」`, buildFetishRichDesc(fObj, v, u), "corr"))
            : [mk("fetish_none", `🔒 暂无性癖（纯洁白纸状态）「总账全0•未解锁」`,
                `【当前性癖解锁与动态难度实况】：\n当前真实身份：${realId} ｜ 当前调教难度：${diff.fullLabel}。\n当前【淫乱总账本】中的所有性交、高潮、内射、吞精、自慰与露出次数全部为 0，因此尚未开启任何后天淫乱性癖！\n💭【${u}的实时内心感受】：“*呼……摸了摸自己平坦的小腹和紧闭的双腿，还好总账次数全都是 0，我这具身体还保持着白纸一样的纯洁状态，一个下流奇怪的性癖都没有染上呢💦！不管外面的世界多么危险，一定要牢牢守住清白（也可以点击右下角✏️编辑或底部的➕新增性癖）！*”`, "none", null, true, 0)];

        const fallThoughts = [
            `虽然身体各处不断传来酸胀发热的信号，但我的大脑依然保持着绝对清醒💦。我清楚地知道自己是谁，哪怕肉体再怎么敏感战栗，只要核心意志不松口，就没有人能真正驯服我的灵魂！`,
            `唔……随着肉体被反复开发刺激，大脑深处时不时会涌起一阵让人懒得思考的微醺感😳💦。原本坚固的自我防线出现了一丝裂缝，有时候甚至会忍不住想——要是顺着肉体的快感沉沦下去，会不会轻松快活得多呢……❤️`,
            `哈啊……只要一闻到浓烈的雄性气息或者体会到体内被塞满的触感，脑子就会变得晕乎乎的🥵💦！什么原本的尊严矜持都好遥远，我的精神已经对男人的支配和肉棒带来的高潮产生重度依赖了，就让我当一个只用身体思考的淫荡女人吧❤️❤️！`,
            `呜汪♡……理智防线已经彻底碎成渣了，只要主人一个眼神，我的大脑就会直接停止思考、流下口水和淫水🥵💦！现在的我打心底里认为女性生来就是供雄性泄欲的家畜，快用更深的催眠把人家彻底改造成专属肉奴吧❤️❤️！`,
            `啊嘿、咕啾♡……脑子已经烧坏融化了，瞳孔涣散成爱心形状，常识也被改写成了『精液就是食物、被操烂就是最高幸福』的母猪逻辑🥵💦！`,
            `啊゛啊゛——100%常识与灵魂彻底改写完成啦♡！！在${u}的脑海里，太阳是肉棒的形状、空气是精液的味道、人类女性存在的唯一意义就是张开六孔承接天下雄性的子孙汁🥵💦！请一辈子支配这具没有任何自我意识的极乐催眠肉偶吧❤️❤️❤️！！`
        ];

        const baseCategories = [
            {
                title: "档案与风评", icon: "👩", summary: `${u} (${realId}) · 敏感${sensMult}x · 难度${diff.name}`,
                items: [
                    mk("身份与背景", `👩 认知真名与身份：${u}「${realId}•${prop.肉体所有权 || (hookerCnt > 0 ? "恩客共有" : "自由身")}」`,
                        fmtOvr("身份与背景",
                            `【🔬 主角当前认知真名、真实身份与处境解剖】：\n当前自我认知真名：${u} ｜ 肉体所有权：${prop.肉体所有权 || (hookerCnt > 0 ? "买春恩客临时支配" : "自由身")}\n故事内真实身份/体质：${realId}（全身神经敏感度：常人的 ${sensMult} 倍 ｜ 状态栏进阶难度：${diff.fullLabel}）。\n${prof.身份与背景 || live.identity}`,
                            corr >= 60 ? `只要一听到别人叫我「${u}」或者用打量货物的眼神看我，我的骚穴就会条件反射地涌出一股热流🥵💦！现在的我已经彻底认下这个下贱身份了，快按住我这具敏感度 ${sensMult} 倍的熟透肉体尽情使用吧❤️！` : `深吸一口气感受着这具敏感度高达 ${sensMult} 倍的躯体，我现在在故事里的真实身份是「${u}」（${realId}）💦。面对眼前的 ${c} 和周围复杂的处境，我必须步步为营，千万不能露出软弱破绽啊😳！`
                        ), "none", null, true, corr),
                    mk("肉体外貌", `🌸 肉体外貌与淫靡体态：「敏感度${sensMult}倍•${stageNameFromVal(corr)}」`,
                        fmtOvr("肉体外貌",
                            `【🔬 全身外貌特征与敏感体态实况（严格依据当前卡正文）】：\n${prof.肉体外貌实况 || live.bodyDesc}\n全身敏感倍率：常人的 ${sensMult} 倍（受穿刺/道具/高羞耻反噬动态加成） ｜ 体表微汗与红痕：${mark.体表痕迹 || "面颊潮红、微汗"}。`,
                            `看着镜子里或者低头映入眼帘的这具雪白躯体，皮肤细腻得连血管都隐约可见😳💦……稍微有点风吹草动就会在皮肤上激起一层鸡皮疙瘩！`
                        ), "none", null, true, corr),
                    mk("表里风评", `🎭 表里风评与淫乱称号：「${prof.表里风评与称号 || (corr >= 60 ? "表面人模狗样•暗地公用精盆" : "表面清白端庄•暗藏靡烂反差")}」`,
                        fmtOvr("表里风评",
                            `【🔬 表面社会形象 vs 暗地里界风评反差】：\n当前淫乱称号：【${corr >= 100 ? "万夫共享的深渊恶堕女皇" : corr >= 80 ? "脑髓熔断的百人斩肉便器" : corr >= 50 ? "食髓知味的背德暗娼" : vagCnt > 0 ? "破瓜失守的敏感尤物" : "清冷待采的纯洁禁脔"}】\n表里反差实况：${prof.表里风评与称号 || (hookerCnt > 0 ? `在不知情的外人面前或许还维持着体面，但在熟客与风月场眼中，她早已是只要给钱就能随便内射的极品泄欲肉壶（已接客 ${hookerCnt} 次）。` : `表面维持着令人敬畏或清纯端庄的形象，无人知晓这具娇躯在私下里是何等敏感易湿、一碰即颤。`)}\n【📸 致命把柄与威胁库】：${prof.致命把柄与威胁 !== "无" ? prof.致命把柄与威胁 : (hookerCnt > 0 || vagCnt > 0 ? "肉体已被开发留痕，私密交易与身体异样随时面临曝光风险" : "尚无实质性影像把柄落入他人之手")}`,
                            `一想到自己表面的形象和私下里这副敏感发骚的反差模样，心脏就跳得快要从嗓子眼里蹦出来了😳💦！要是让外人知道我暗地里变成这样、甚至被握住致命把柄威胁的话，我一定会羞愤得当场高潮昏死过去的吧🥵❤️！`
                        ), "none", null, true, corr),
                    mk("挂牌身价", `🏷️ 风月挂牌身价与评级：「${marketRank}」`,
                        fmtOvr("挂牌身价",
                            `【🔬 黄油风月挂牌估值与皮肉交易标准】：\n综合肉器评级：【${marketRank}】\n挂牌身价详情：${marketPrice}`,
                            hookerCnt > 0 ? `看着自己这副身体被明码标价成按次收费的泄欲工具，累计已经接待了 ${hookerCnt} 个男人💦……我已经彻底习惯靠下面这张嘴吃饭的日子了呢😳❤️。` : `我这副冰清玉洁的身体怎么能用金钱来衡量身价呢💦！可一想到那些男人恨不得倾家荡产买下我初夜的下流眼神，腿心还是忍不住一阵阵发麻啊🥵……`
                        ), "none", null, true, corr),
                    mk("内心独白", `💬 实时内心独白（最新心声）：「抓取自当前楼层独白」`,
                        fmtOvr("内心独白",
                            `【⚡ 当前身体核心敏感带与日程规矩】：\n核心敏感带：${extPsy.当前敏感点 || "充血发硬的乳尖蓓蕾、酸胀微张的子宫颈口与敏感阴蒂"}\n当前日程/规矩：${v.调教进度?.规矩与日程 || "应对眼前局面"}。`,
                            curThought
                        ), "none", null, true, corr),
                    mk("当前姿势", `🧍 当前姿势与体力耐受：${staM.val}/100「${staM.stage}」`,
                        fmtOvr("当前姿势",
                            `【🔬 当前身体姿态、重心与体力消耗解剖】：\n当前姿势：${curPose}\n${staM.desc.split("💭")[0]}`,
                            corr >= 60 ? `摆出这种双腿发软、腰臀微塌的下流姿势，稍微呼吸一下胸前的奶子就会乱晃，下面合不拢的骚穴还在往外漏水🥵💦！快趁着我现在体力只剩 ${staM.val}% 站不稳，直接走过来把我按倒狠狠操进来吧❤️！` : `努力想要稳住现在这个姿势，可体力消耗后发软的膝盖和酸胀的小肚子却让人重心发飘💦，越是想夹紧双腿，两腿之间的肉缝就磨蹭得越厉害啊😳🥵！`
                        ), "sta")
                ]
            },
            // 2. 恶堕与脑改（8个按钮8套完全独立的专属流体光谱与6阶颜文字！）
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
                            `【🔬 深层精神防线、催眠洗脑与常识改写实况（第${fallTier + 1}阶段）】：\n精神沦陷度：${fallVal}/100 ｜ 人格崩解度：${brkVal}/100 ｜ 意识清醒度：${safeNum(v.精神与心理?.意识清醒度, 100)}/100 ｜ 催眠深度：${hypnoVal}/100。\n常识改写状态：${prop.常识改写状态 || (hypnoVal >= 50 ? "潜意识已被植入淫乱暗示，视肉体奉仕为理所当然" : "常识尚属正常")}\n巴甫洛夫触发词：${v.调教进度?.条件反射触发词 || "无"}。`,
                            fallThoughts[fallTier]), "hypno"),
                    mk("媚药毒瘾", `🧪 媚药淫毒与精液成瘾：${drugVal}/100「${drugVal >= 100 ? "👑媚毒入骨母猪" : drugVal >= 60 ? "重度精液毒瘾•断精发狂" : drugVal >= 20 ? "轻度体液依恋" : "无外源毒瘾"}」`,
                        fmtOvr("媚药毒瘾",
                            `【🔬 体内媚药残留浓度与雄性精液荷尔蒙成瘾度】：\n当前毒瘾与精液依赖指数：${drugVal}/100 ｜ 体内药物状态：${v.调教进度?.媚药与发情毒 || "无外源强效媚药"}。\n阿嘿颜失神与语言退化度：${safeNum(v.精神与心理?.语言退化阿嘿颜)}/100（累计翻白眼吐舌失神 ${ahegaoCnt} 次）。`,
                            drugVal >= 50 ? `身体已经彻底染上男人的精液毒瘾了🥵💦！只要小肚子里和嘴里超过半天没有灌进滚烫腥臭的浓精，全身骨头缝就会像戒断反应一样发冷发痒，快喂我喝精液止瘾吧❤️❤️！` : `虽然没有被灌下奇怪的催情毒药，但这具身体本身分泌的雌性荷尔蒙就已经像春药一样让我浑身发烫发软了😳💦！`), "drug")
                ]
            },
            // 3. 下流性癖库
            {
                title: "下流性癖库", icon: "🧬",
                summary: unlockedFetishes.length > 0 ? `已开启 ${unlockedFetishes.length} 项 (${diff.name}难度)` : `总账全0 · 暂无性癖`,
                items: fetishItems
            },
            // 4. 六孔与储精（每个孔穴均有独立光谱 mouth/chest/vag/womb/clit/anal + 专属副条 semen/milk/pee！）
            {
                title: "六孔与储精", icon: "🌸", summary: `总储精${totalMl}ml · 六孔6阶开发度+专属体液双轨条`,
                items: [
                    mk("骚口实况", `👄 第一孔【骚口与胃袋】：${mouthDev}/100「${mouthStg}」`,
                        fmtOvr("骚口实况",
                            `【🔬 口腔开发阶位：${mouthDev}/100（${mouthStg}｜口交${mouthCnt}次·吞精${swallowCnt}次）】：\n【💧 胃袋实时储精】：${mouthMl}ml / 动态上限 ${caps.mouthMax}ml（历史累计吞精 ${swallowMl}ml）。\n${rt.骚口实况 || live.mouth || "唇瓣因反复吮吻而充血微肿、泛着艳红水光，舌苔粉嫩湿滑，咽喉深处在受激时会溢出娇柔喘息。"}\n${mouthMl > 0 ? `【💦 胃袋灌精】：此时口腔与胃袋内正翻涌着 ${mouthMl}ml 浓稠白浊，每一次呼吸打嗝都喷出浓烈的精臭味！` : `当前口穴与胃袋内暂存精液为 0ml。`}`,
                            mouthMl > 0 ? `呕咕、咕咚……嘴里和胃袋里全都灌满了男人射进来的 ${mouthMl}ml 滚烫浓精，黏稠白浆糊在喉咙管壁上，连打个嗝都是冲鼻子的精腥味🥵💦！可把精液咽进肚子里的时候，下面的骚逼居然跟着一起收缩高潮了呀❤️❤️！` : (mouthCnt > 0 ? `舔了舔有些发肿发麻的嘴唇，嗓子眼深处还残留着帮男人含弄粗大肉棒时的撑开感与腥咸余味💦，这张吞过 ${swallowMl}ml 精液的嘴早就记住肉棒的形状了呢😳……` : `我的嘴和喉咙现在还干干净净的，可不能随便漏出像里番女优一样的丢人娇喘声啊💦！`)),
                        "mouth",
                        { mainName: "👄 口穴阶位", label: "🥛 胃袋储精", theme: "semen", pct: Math.round((mouthMl / Math.max(1, caps.mouthMax)) * 100), text: `${mouthMl}/${caps.mouthMax}ml` }
                    ),
                    mk("胸部实况", `🍒 第二孔【丰乳与乳腺】：${chestDev}/100「${chestStg}」`,
                        fmtOvr("胸部实况",
                            `【🔬 丰乳开发阶位：${chestDev}/100（${chestStg}｜乳交${titCnt}次·喷乳${milkCnt}次）】：\n【🍼 乳腺实时蓄乳】：${curMilkMl}ml / 满胀容量 ${milkCap}ml（历史累计泌乳 ${milkMl}ml）。\n${rt.胸部实况 || live.chest || "两团丰满白腻的雪乳随着呼吸沉甸甸地起伏微颤，顶端两颗娇嫩乳头充血发硬，稍微刮蹭便激起酥麻电流。"}`,
                            milkCnt > 0 ? `唔嗯♡……奶子涨得好酸好麻，只要乳头一被捏住吸吮，白花花的甜母乳就会噗嗤噗嗤地往外直喷🥵💦！快用力吸空人家的奶袋、再用这对喷奶的大乳房夹住肉棒乳交吧❤️❤️！` : `胸前这两团沉甸甸的软肉随着呼吸一颠一颠地晃荡，最顶上充血硬挺的两颗乳头被布料一蹭就过电似的发麻❤️💦，要是被粗糙大手抓着揉捏变形绝对会叫出声来的呀🥵！`),
                        "chest",
                        { mainName: "🍒 淫乳阶位", label: "🍼 乳腺蓄乳", theme: "milk", pct: Math.round((curMilkMl / Math.max(1, milkCap)) * 100), text: `${curMilkMl}/${milkCap}ml` }
                    ),
                    mk("小穴实况", `🌺 第三孔【骚逼阴道腔】：${vagDev}/100「${vagStg}」`,
                        fmtOvr("小穴实况",
                            `【🔬 小穴名器开发阶位：${vagDev}/100（${vagStg}｜累计贯穿 ${vagCnt} 次·孔径 ${vagWidth}cm·闭合 ${vagClose}%）】：\n【💧 阴道实时储精】：${vagMl}ml / 动态上限 ${caps.vagMax}ml。\n${rt.小穴实况 || live.vag || (vagCnt === 0 ? "未经人事的紧致处子白虎幽谷，两瓣粉嫩花唇紧密贴合形成一线鲍，处女膜完好无损。" : `两片肥厚软嫩的阴唇因承受过 ${vagCnt} 次粗暴抽送而充血外翻，肉缝湿淋淋地微张着，层叠的G点肉褶已形成贴合阳具轮廓的永久肉器记忆。`)}\n${vagMl > 0 ? `【💦 漏精与拉丝】：${vagMl}ml 滚烫白浊混杂着拉丝淫水卡在肉褶间，正顺着大腿根滴淌！` : `当前阴道浅腔内暂无大股外溢精液。`}`,
                            vagMl > 0 ? `呜……骚逼的两片花唇被干得又红又肿合不拢，里面含着的 ${vagMl}ml 滚烫浓精混着淫水，走一步路就噗嗤一声往大腿内侧淌白线🥵💦！每一层肉褶都已经被撑成了男人的形状，连精液都夹不住了呀❤️❤️！` : (vagCnt > 0 ? `两腿之间那条被贯穿开发过 ${vagCnt} 次的肉缝还火辣辣地发酸微张着，闭合度只剩 ${vagClose}% 了💦……里面空荡荡的好想再被粗硬的肉棒塞满啊🥵❤️！` : `两腿之间那条从来没被进入过的处女一线鲍，此刻却因为高度紧张和羞耻自己在肉缝里泌出了湿热春水，羞死人了啊😳💦！`)),
                        "vag",
                        { mainName: "🌺 名器阶位", label: "🥛 穴内储精", theme: "semen", pct: Math.round((vagMl / Math.max(1, caps.vagMax)) * 100), text: `${vagMl}/${caps.vagMax}ml` }
                    ),
                    mk("子宫实况", `🫀 第四孔【子宫颈口与苗床】：${wombDev}/100「${wombStg}」`,
                        fmtOvr("子宫实况",
                            `【🔬 子宫宫口开发阶位：${wombDev}/100（${wombStg}｜累计无套内射 ${creampie} 次）】：\n【💧 宫腔实时储精】：${wombMl}ml / 动态上限 ${caps.wombMax}ml。\n${rt.子宫实况 || live.womb || "深藏在下腹部的子宫温暖紧致，宫颈口在反复冲击或荷尔蒙刺激下微微酸软抽搐。"}\n${wombMl > 0 ? `【💦 宫腔灌满】：${wombMl}ml 滚烫高活性浓精已冲开软烂的宫颈口灌满子宫，将小腹撑得沉甸甸地坠胀酸麻！` : `当前宫腔内暂无蓄积精液。`}`,
                            wombMl > 0 ? `小肚子好沉、好烫、好胀啊💦！足足 ${wombMl}ml 滚烫浓稠的男人精液全都射进了子宫最深处，走半步路都能感觉到精浆在肚子里晃荡、还会从软烂的宫口挤出一股白浊滴下来🥵❤️❤️！` : (creampie > 0 ? `摸着平坦微热的小腹，里面那截已经被顶开内射过 ${creampie} 次的子宫颈口还在泛着酸麻余温💦，被浓精烫习惯了的子宫苗床好想再被喂饱啊🥵❤️！` : `下腹部最深处子宫的位置不知为何一直在泛起陌生的暖意、酸溜溜地一抽一抽，真让人心慌啊💦🥵！`)),
                        "womb",
                        { mainName: "🫀 宫口阶位", label: "🥛 宫腔锁精", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }
                    ),
                    mk("阴蒂尿道", `💧 第五孔【阴蒂与尿道口】：${clitDev}/100「${clitStg}」`,
                        fmtOvr("阴蒂尿道",
                            `【🔬 阴蒂与尿道开发阶位：${clitDev}/100（${clitStg}｜高潮${orgasmCnt}次·失禁${leakCnt}次·阴蒂${clitSize}mm）】：\n【💦 膀胱尿意与括约肌失控度】：${peeVal}/100。\n${rt.阴蒂尿道实况 || "位于花唇顶端的阴蒂肉珠充血凸起，神经末梢高度敏化；下方的尿道括约肌在反复高潮或羞耻刺激下变得酸软乏力。"}`,
                            leakCnt + squirtCnt > 0 ? `最上面的阴蒂肉珠已经肿成了 ${clitSize}mm 的小酸豆，稍微碰一下就会引发全身触电，连下面的尿道口括约肌也彻底失控松弛，随时都会把骚尿和潮吹一起喷出来呀🥵💦❤️❤️！` : `两腿稍微一并拢就会刮到花唇最顶端那颗充血发烫的小肉珠，酸麻电流冲得连尿道口都一阵阵发酸发紧，千万别失控漏出来啊😳💦！`),
                        "clit",
                        { mainName: "⚡ 敏化阶位", label: "💦 失禁尿意", theme: "pee", pct: peeVal, text: `尿意 ${peeVal}%` }
                    ),
                    mk("屁眼实况", `🕳️ 第六孔【屁眼直肠腔】：${analDev}/100「${analStg}」`,
                        fmtOvr("屁眼实况",
                            `【🔬 后庭括约肌开发阶位：${analDev}/100（${analStg}｜累计肛交 ${analCnt} 次）】：\n【💧 直肠实时储精】：${analMl}ml / 动态上限 ${caps.analMax}ml。\n${rt.屁眼实况 || live.anal || "饱满挺翘的雪白臀瓣深处，粉嫩菊蕾紧致闭合，仅在身体紧绷或前面受激时跟着一收一缩。"}\n${analMl > 0 ? `【💦 直肠灌精】：直肠腔内正灌着 ${analMl}ml 浓稠白浊，肠壁蠕动吸收着精液水分，带来强烈的排泄坠胀感！` : `当前后庭直肠内精液为 0ml。`}`,
                            analMl > 0 ? `呜哇……连后面排泄用的屁眼和直肠都被当成储精袋灌进了 ${analMl}ml 滚烫浓精，肚子又胀又麻，直肠包裹着白浆蠕动时连屁眼都要高潮了呀🥵💦❤️❤️！` : (analCnt > 0 ? `饱满臀缝深处那朵已经被开拓过 ${analCnt} 次的菊花，现在每一次呼吸都会条件反射地微微收缩，记住了被异物塞满的酸胀快感呢😳💦！` : `两瓣丰腴屁股肉深处的粉嫩小孔因为紧张而死死地一缩一缩，刚才从前面流下来的黏腻体液把菊花周围也弄得湿漉漉的了💦……`)),
                        "anal",
                        { mainName: "🕳️ 后庭阶位", label: "🥛 直肠储精", theme: "semen", pct: Math.round((analMl / Math.max(1, caps.analMax)) * 100), text: `${analMl}/${caps.analMax}ml` }
                    )
                ]
            },
            // 5. 肉改与道具
            {
                title: "肉改与道具", icon: "⛓️", summary: `正字x${tallyFull} · 淫纹烙印 · 穿刺环饰 · 体内道具`,
                items: [
                    mk("正字涂鸦", `✍️ 分部位『正』字记账与涂鸦：${tallyDev}/100「${stageNameFromVal(tallyDev)}•${tallyFull}个正字(${tallyStrokes}划)」`,
                        fmtOvr("正字涂鸦",
                            `【🔬 黄油肉便器『正』字计数与体表耻辱涂鸦实况】：\n累计四孔开发与内射总笔划：${tallyStrokes} 划（折合在小腹、大腿内侧与臀瓣上画下 ${tallyFull} 个完整的「正」字零 ${tallyStrokes % 5} 笔）。\n当前体表公开涂鸦字迹：${mark.公开涂鸦字迹 || (corr >= 70 ? "小腹与雪乳上方留有下流的肉便器记号" : "肌肤表面暂未被马克笔写下公开羞辱字迹")}\n体表红痕与掌印：${mark.体表痕迹 || "面颊潮红，臀腿残留指印"}（累计受虐鞭痕/掌印 ${safeNum(mark.鞭痕与掌印)} 处）。`,
                            tallyStrokes > 0 ? `如果把每一次被男人贯穿和内射都用黑笔在肚皮和大腿根画『正』字的话，我现在身上都已经画满 ${tallyFull} 个正字零 ${tallyStrokes % 5} 笔了🥵💦！看着这具布满使用记录的肉体，连我自己都觉得既下流又兴奋呀❤️！` : `雪白细腻的肚皮和大腿内侧现在还干干净净的，可不能让人用黑笔在上面写下那种『正』字和肉便器涂鸦啊😳💦！`), "corr"),
                    mk("淫纹烙印", `🔮 奴隶烙印与发光淫纹阶位：${tattooDev}/100「${stageNameFromVal(tattooDev)}•${mark.淫纹与刻印 !== "无" ? mark.淫纹与刻印 : "未刻印状态"}」`,
                        fmtOvr("淫纹烙印",
                            `【🔬 下腹子宫淫纹与奴隶契约烙印实况】：\n当前淫纹状态：${mark.淫纹与刻印 || "下腹平坦白腻，尚未被刻下永久催情淫纹或奴隶烙印"}\n淫纹特殊效果：当子宫内射灌满或快感过载时，淫纹部位温度骤升并自动锁紧宫颈口防止精液外流。`,
                            mark.淫纹与刻印 !== "无" ? `小肚子上的淫纹又在发烫发光了🥵💦！每次淫纹一亮起来，子宫深处就像被施了催情魔咒一样拼命收缩要吃精液，根本控制不住身体的发情本能呀❤️❤️！` : `听说一旦在小肚子上刻下那种发光的催情淫纹，就会一辈子变成离不开男人精液的发情母畜……想想就让人双腿发软啊😳💦！`), "hypno"),
                    mk("穿刺环饰", `💍 敏感带金属穿刺与环饰：${pierceDev}/100「${stageNameFromVal(pierceDev)}•${mark.穿刺与环饰 !== "无" ? mark.穿刺与环饰 : "尚未穿刺打环"}」`,
                        fmtOvr("穿刺环饰",
                            `【🔬 乳头、阴蒂、舌尖与肚脐金属穿刺环实况】：\n当前穿刺环饰：${mark.穿刺与环饰 || "全身敏感肉珠尚保持天然无穿刺状态，未被打上乳环、阴蒂环或母畜鼻环/舌环"}\n摩擦刺激度：若穿戴金属环饰，每一次呼吸与迈步晃动都会直接拉扯敏感神经末梢，带来24小时不间断的电流调教。`,
                            mark.穿刺与环饰 !== "无" ? `穿在最敏感嫩肉上的金属环冰凉又沉重，每走一步路都会拽着乳头和阴蒂一晃一晃地过电发麻🥵💦！这种24小时都被迫处于发情状态的改造实在太色情了呀❤️❤️！` : `我这两颗充血发硬的乳尖和肿胀的小阴蒂本来就已经敏感到极点了，要是再被人穿透打上金属乳环和阴蒂环的话，走一步路都会当场高潮喷水的吧😳💦！`), "pleas"),
                    mk("体内道具", `🎛️ 体内常驻道具与贞操带权限：${propDev}/100「道具:${prop.体内道具 || "无"}•权限:${prop.排泄与高潮权限 || "自主"}」`,
                        fmtOvr("体内道具",
                            `【🔬 体内常驻塞入道具、束缚具与高潮排泄权限】：\n当前体内塞入物：${prop.体内道具 || "无体内常驻跳蛋、肛塞或榨精拉珠"}\n当前身体束缚状态：${prop.束缚状态 || "四肢自由未受捆绑"}\n高潮与排泄控制权：${prop.排泄与高潮权限 || "尚可自主控制（未被贞操带或催眠指令彻底封锁）"}。`,
                            prop.体内道具 && prop.体内道具 !== "无" ? `救命……身体里面还死死塞着「${prop.体内道具}」，每动一下都在最敏感的肉壁上震动摩擦，连什么时候能高潮、什么时候能去厕所全都被别人捏在手里了呀🥵💦❤️❤️！` : `还好现在身体里面没有被塞进那种嗡嗡震动的跳蛋或者肛塞，不然顶着一肚子道具在外面走动真的会当场社死的💦！`), "obey")
                ]
            },
            // 6. 从头到脚穿搭（清爽无进度条，保留阶段值供 1~6 阶配图自动切换）
            {
                title: "从头到脚穿搭", icon: "👗", summary: `从头到脚8部位战损穿搭拆解 · 状态:${wearStateTag}`,
                items: [
                    mk("穿搭_头饰", `👑 1.【头饰·发丝·面容】「${wearStateTag}•${headTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_头饰",
                            `【🔬 头部发丝、面容神态与唇角涎液实况】：\n当前穿戴与状态：${headTxt}。\n发丝因情动汗水浸润而略显凌乱地贴在白皙面颊与耳廓旁，双颊泛着退不去的桃花春色，水润红唇微微开启喘息。`,
                            `散落的发丝被热汗浸湿贴在滚烫的脸颊和耳根上，连呼出来的每一口气都烫得吓人💦。泛着水雾的眼睛和微微发抖的红唇把心里的慌乱和动情出卖得一干二净，要是现在被人揪住头发强吻深喉，肯定一秒钟都撑不住就会软倒吧😳🥵！`), "none", null, true, wetLevel),
                    mk("穿搭_颈部", `⛓️ 2.【颈部·锁骨·项圈】「${wearStateTag}•${neckTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_颈部",
                            `【🔬 脖颈、锁骨凹陷与吻痕/项圈实况】：\n当前穿戴与状态：${neckTxt}。\n修长白皙的雪颈与精致凹陷的锁骨窝随着急促呼吸剧烈起伏，锁骨凹槽处积着晶莹细汗。`,
                            corr >= 60 ? `脖子和锁骨上的皮肤烫得要命，上面留着的吻痕和红印只要一被风吹到就会激起酥麻电流🥵💦！这么脆弱白皙的脖子，真想戴上专属母狗项圈和铃铛被牵着走呀❤️❤️！` : `修长的脖颈和锁骨窝里渗出了一层薄薄的细汗，当热气喷洒在耳根和锁骨上时，整条脊椎骨都会跟着一起发麻发软💦！`), "none", null, true, wetLevel),
                    mk("穿搭_胸罩", `👙 3.【内衣·胸罩·凸点】「${wearStateTag}•${braTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_胸罩",
                            `【🔬 胸罩/裹胸穿戴、真空乳肉垂挂与凸点摩擦实况】：\n当前穿戴与状态：${braTxt}。\n两团饱满软腻的雪乳随着呼吸与动作沉甸甸地起伏微颤，顶端两颗充血发硬的乳头将布料顶出清晰的凸点颗粒，每一次刮蹭都直击乳腺深处！`,
                            `胸前这两团沉甸甸的软肉稍微一动就会跟着乱晃，最顶上充血发硬的两颗乳头死死顶着衣服布料，每摩擦一下都像过电一样又麻又痒❤️💦！真想让人直接把手伸进来用力揉捏吸吮发烫的乳尖呀🥵！`), "none", null, true, chestDev),
                    mk("穿搭_上衣", `👚 4.【外装上衣·束腰】「${wearStateTag}•${topTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_上衣",
                            `【🔬 外装上衣款式、腰部曲线与领口下摆实况】：\n当前穿戴与状态：${topTxt}。\n上衣包裹着饱满胸脯与纤细腰肢，勾勒出惊心动魄的胸腰臀曲线，领口或下摆处随时面临走光失守的风险。`,
                            `身上的上衣已经被体温和微汗烘得热乎乎的，稍微弯个腰或者抬个手，松垮的领口和下摆就会露出一大片雪白的春光😳💦！要是被人从后面直接把手伸进下摆里摸上来，一定会当场腿软的吧🥵！`), "none", null, true, wetLevel),
                    mk("穿搭_内裤", `🩲 5.【贴身内裤·漏精】「${wearStateTag}•${pantyTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_内裤",
                            `【🔬 内裤底裤位置、真空阴阜与爱液白浊浸湿实况】：\n当前穿戴与状态：${pantyTxt}（下体泥泞湿润度：${wetLevel}%）。\n私密处的两瓣花唇与敏感阴蒂正处于充血湿润状态，分泌出的滑腻爱液或残留的乳白精浆令腿心一片泥泞。`,
                            `两腿之间最私密的地方现在湿滑泥泞得一塌糊涂，不管是贴身底裤勒进肉缝里的摩擦、还是真空状态下冷空气直接吹在红肿阴唇上的触感，都刺激得我尾椎骨直发麻，里面的水根本夹不住了呀🥵💦❤️！`), "none", null, true, wetLevel),
                    mk("穿搭_下装", `🍑 6.【下装裙裤·臀浪】「${wearStateTag}•${botTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_下装",
                            `【🔬 下装穿戴、蜜桃臀浪与走光受虐实况】：\n当前穿戴与状态：${botTxt}。\n丰腴挺翘的蜜桃臀肉随着步伐或呼吸荡起诱人的臀浪弧度，稍微掀起或弯腰便会彻底暴露私密禁区。`,
                            `丰满紧实的屁股蛋随着动作一颤一颤的，稍微弯下腰就能感觉到后面凉飕飕的毫无安全感💦。真怕下一秒就会有人从背后直接掀开下摆按住我的腰臀，一边抽打屁股蛋一边后入插进来呀😳🥵！`), "none", null, true, wetLevel),
                    mk("穿搭_丝袜", `🧦 7.【丝袜·美腿·滑落】「${wearStateTag}•${sockTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_丝袜",
                            `【🔬 丝袜/裸腿状态、大腿根摩挲与体液挂壁实况】：\n当前穿戴与状态：${sockTxt}。\n一双修长笔直、白皙匀称的美腿微微内扣并拢，大腿根内侧最娇嫩的皮肤相互摩挲，从私处溢出的黏腻体液正顺着大腿内侧拉出白线缓缓下滑。`,
                            `两条修长的大腿现在又酸又软直打哆嗦，从骚穴里漏出来的温热粘液正顺着大腿内侧最嫩的肉一路往下滑🥵💦！要是这双美腿被人直接扛在肩膀上掰成M字型狂操的话，一定会被顶到最深处的吧❤️❤️！`), "none", null, true, wetLevel),
                    mk("穿搭_鞋子", `👠 8.【鞋子·玉足·蜷缩】「${wearStateTag}•${shoeTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_鞋子",
                            `【🔬 鞋履款式、纤细足弓与脚趾快感蜷缩实况】：\n当前穿戴与状态：${shoeTxt}。\n纤细白嫩、足背弧度优美的玉足包裹在鞋履之中，十根粉嫩脚趾正因为体内流窜的酥麻电流而本能地紧紧蜷缩，足心沁出薄汗。`,
                            `每当小肚子和下面窜起酸麻电流的时候，我的十根脚趾头就会不受控制地死死蜷缩起来，连脚心都出了一层细汗💦！甚至刚才站起来的时候还有一滴白浊直接滴在了脚背上，真是从头脏到脚了啊😳🥵！`), "none", null, true, wetLevel)
                ]
            },
            // 7. 苗床与受孕
            {
                title: "苗床与受孕", icon: "🤰", summary: `${preg.生理周期阶段 || "危险排卵期"} · 受孕率${fertProb}% · 断面双轨直播`,
                items: [
                    mk("排卵周期", `🥚 生理周期与危险排卵警报：${ovulStageVal}/100「${ovulStg}」`,
                        fmtOvr("排卵周期",
                            `【🔬 卵巢排卵催情阶位：${ovulStageVal}/100（${ovulStg}）】：\n【🎯 无套内射单发受孕率】：${fertProb}% ｜ 卵子状态：${preg.卵子状态 || "饱满熟透卵子已排出，正停留在输卵管等待受精"}。`,
                            `偏偏在最容易怀孕中招的【${preg.生理周期阶段 || "危险排卵期"}】遇到这种事💦！卵巢里那颗熟透的卵子正在散发着催情荷尔蒙，要是在这个时候被无套内射灌满子宫的话，绝对会一发中招怀上小宝宝的吧😳🥵！`),
                        "lust",
                        { mainName: "🥚 排卵阶位", label: "🎯 受孕概率", theme: "pleas", pct: fertProb, text: `中招率 ${fertProb}%` }
                    ),
                    mk("受精断面", `🔬 精虫围攻卵子X光断面：${xrayStageVal}/100「${xrayStg}」`,
                        fmtOvr("受精断面",
                            `【🔬 苗床受精断面阶位：${xrayStageVal}/100（${xrayStg}｜累计内射 ${creampie} 次）】：\n【💧 宫腔浓精充盈度】：${wombMl}ml / 上限 ${caps.wombMax}ml。\n断面实况：${wombMl > 0 ? `软烂微张的宫颈口已被彻底射穿！${wombMl}ml 滚烫浓稠的高活性精浆正填满整个子宫腔，X光断面下可见数以亿计的雄性精虫正疯狂摆尾，将那颗毫无防备的熟透卵子团团围住、争先恐后地撞击卵子薄膜试图完成受精着床！` : `当前子宫腔内尚无活性精虫涌入，但熟透的卵子与微张的宫口正处于极度容易受精的高危状态。`}`,
                            wombMl > 0 ? `清晰地感觉到肚子里那 ${wombMl}ml 滚烫浓精正在子宫内壁里四处乱窜🥵💦！成千上万条精虫现在肯定已经把我的卵子团团围住往里面钻了，子宫口还在自己一缩一缩地把精液往深处吸，真的要受精怀孕了呀❤️❤️！` : `小肚子深处的子宫苗床空落落地一抽一抽💦，仿佛里面的卵子正在饥渴地呼唤着滚烫浓精冲进来把她灌满受精一样……太下流了啊🥵！`),
                        "womb",
                        { mainName: "🔬 断面阶位", label: "🥛 精虫密度", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }
                    ),
                    mk("精液归属", `🧬 宫内精液DNA混杂归属：${dnaStageVal}/100「${dnaStg}」`,
                        fmtOvr("精液归属",
                            `【🔬 基因染透与标记阶位：${dnaStageVal}/100（${dnaStg}）】：\n【💧 四穴当前总储精】：${totalMl}ml（口胃 ${mouthMl}ml / 阴道 ${vagMl}ml / 子宫 ${wombMl}ml / 直肠 ${analMl}ml）。\n精液归属明细：${totalMl > 0 ? (preg.宫内精液归属 !== "无" ? preg.宫内精液归属 : `主要为刚刚由【${c}】无套射入的高浓度精液（累计已承受 ${creampie} 次内射）`) : "当前四穴内暂无外来雄性精液残留"}。`,
                            totalMl > 0 ? `肚子里满满当当全是男人射进来的遗传基因和浓精🥵💦，连子宫内壁都被这股霸道的雄性气息彻底染透标记了，要是怀上了都赖不掉呀❤️！` : `现在身体里面还没有留下任何男人的精液DNA，可得小心守住自己的子宫苗床才行💦！`),
                        "drug",
                        { mainName: "🧬 染透阶位", label: "🥛 四穴总精", theme: "semen", pct: Math.round((totalMl / Math.max(1, totalCapAll)) * 100), text: `合计 ${totalMl}ml` }
                    ),
                    mk("孕肚进度", `🤰 恶堕孕肚与产卵苗床进度：${pregStageVal}/100「${pregStg}」`,
                        fmtOvr("孕肚进度",
                            `【🔬 母体孕育与苗床阶位：${pregStageVal}/100（${pregStg}｜历史产卵 ${safeNum(preg.生产产卵次数)} 次）】：\n【🤰 小腹隆起充盈度】：${bellySwellPct}%（受孕状态：${preg.子宫怀孕 ? `已着床 ${safeNum(preg.怀孕进度)}%` : `未着床，因蓄精 ${totalMl}ml 微隆`}）。`,
                            preg.子宫怀孕 ? `摸着自己已经怀上种的小肚子，里面正在孕育着男人的骨肉，而我就算挺着孕肚也还是想被大肉棒继续粗暴地插进来内射呀🥵💦❤️❤️！` : `刚才被射进肚子里的精液把平坦的小腹都撑得微微鼓起弧度了💦，按一按还会咕啾咕啾地响，简直像已经怀上了一样羞人啊😳🥵！`),
                        "corr",
                        { mainName: "🤰 苗床阶位", label: "🫃 腹围隆起", theme: "semen", pct: bellySwellPct, text: `隆起 ${bellySwellPct}%` }
                    )
                ]
            },
            // 8. 淫乱总账本
            {
                title: "淫乱总账本", icon: "💎", summary: `破瓜纪念 · 小穴${vagCnt} · 内射${creampie} · 接客${hookerCnt}`,
                items: [
                    mk("破瓜纪念", `🥀 初夜破瓜耻辱纪念碑：「${vagCnt === 0 ? "🌸处女膜完好无损" : (mark.初夜破瓜纪念 && !mark.初夜破瓜纪念.includes("完好") ? mark.初夜破瓜纪念.slice(0, 18) : `🌺已破瓜失身(累计${vagCnt}次)`)}」`,
                        fmtOvr("破瓜纪念",
                            `【🔬 处女膜状态与初夜破瓜黑历史档案】：\n当前处女状态：${vagCnt === 0 ? "处女膜完好无损，花唇紧闭，尚未被任何雄性阳具破瓜夺走初夜" : (mark.初夜破瓜纪念 && !mark.初夜破瓜纪念.includes("完好") ? mark.初夜破瓜纪念 : `处女膜早已在粗暴的贯穿中彻底撕裂消失，目前已累计承受小穴贯穿 ${vagCnt} 次、内射 ${creampie} 次`)}。`,
                            vagCnt === 0 ? `我的第一次现在还完好无损地保留着呢💦！这层最珍贵的处女膜到底会在什么时候、被哪个男人用什么样粗暴或羞耻的姿势捅破落红呢……光是想想腿心就忍不住发麻了😳🥵！` : `最初破瓜时处女膜被强行撕裂捅穿的剧痛与滚烫感，现在回想起来依然刻骨铭心💦……从失去初夜的那一刻起，我这具身体就走上彻底沦为男人玩物的下坡路了吧🥵❤️！`), "none", null, true),
                    mk("六孔总账", `💎 六孔性交贯穿总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${titCnt}／足${footCnt}」`,
                        fmtOvr("六孔总账",
                            `【🔬 各孔穴历史开发累计次数（结合 ${diff.name} 难度系数决定全状态栏 1~6 阶段进化）】：\n骚逼贯穿：${vagCnt} 次 ｜ 骚口深喉：${mouthCnt} 次 ｜ 屁眼后庭：${analCnt} 次 ｜ 丰乳夹击：${titCnt} 次 ｜ 玉足摩擦：${footCnt} 次 ｜ 异种交合：${beastCnt} 次。`,
                            (vagCnt + mouthCnt + analCnt) === 0 ? `目前所有性交次数全都是 0，从嘴唇到小穴还没有被男人的脏东西捅穿过💦！` : `看着小穴贯穿 ${vagCnt} 次、口交 ${mouthCnt} 次这串触目惊心的开发数字，我的身体早就从里到外变成男人的形状了，那就让这串数字继续往上涨吧🥵💦❤️！`), "none", null, true),
                    mk("高潮总账", `💎 高潮泄身与失禁总账：「高潮${orgasmCnt}次／强制${forceOrgCnt}次／寸止${edgeCnt}次／喷潮${squirtCnt}次／失禁${leakCnt}次」`,
                        fmtOvr("高潮总账",
                            `【🔬 高潮绝顶、寸止折磨与排泄失控累计记录】：\n累计绝顶高潮：${orgasmCnt} 次（其中违背意志的强制高潮 ${forceOrgCnt} 次，寸止折磨 ${edgeCnt} 次）\n潮吹狂喷：${squirtCnt} 次 ｜ 羞耻漏尿失禁：${leakCnt} 次 ｜ 阿嘿颜失神：${ahegaoCnt} 次 ｜ 私下自慰：${safeNum(cnt.自慰)} 次。`,
                            orgasmCnt > 0 ? `一看到累计高潮 ${orgasmCnt} 次的记录，阴道括约肌和尿道口就条件反射地发麻抽搐💦！在男人粗暴的顶弄面前，我这具一碰就去的敏感身体根本忍住不泄身呀🥵❤️！` : `虽然目前高潮和失禁计数器还是 0，但敏感度高达 ${sensMult} 倍的身体要是真被人按住弱点欺负，怕不是会当场丢脸地喷水高潮出来啊😳💦！`), "none", null, true),
                    mk("射精总账", `💎 射精灌注与喷乳总账：「内射${creampie}次／颜射${facialCnt}次／吞精${swallowCnt}次(${swallowMl}ml)／喷乳${milkMl}ml」`,
                        fmtOvr("射精总账",
                            `【🔬 雄性精液灌注、吞咽与母乳分泌累计记录】：\n子宫无套内射：${creampie} 次 ｜ 颜射与体外涂抹：${facialCnt} 次\n骚口吞精：${swallowCnt} 次（累计吞咽浓精 ${swallowMl}ml） ｜ 乳腺改造喷乳：${milkCnt} 次（累计泌乳 ${milkMl}ml）。`,
                            (creampie + swallowCnt) === 0 ? `到现在为止身体内部还没有被注入过任何一滴雄性精液，一定要守住最后的防线😳💦！` : `子宫已经被滚烫的浓精内射浇灌了 ${creampie} 次，胃袋也吞下了 ${swallowMl}ml 白浊，全身上下早就已经被男人的精液彻底腌入味了呀🥵💦❤️！`), "none", null, true),
                    mk("露出总账", `💎 卖身接客·轮奸·睡奸总账：「接客${hookerCnt}次／轮奸${gangCnt}次／睡奸${sleepCnt}次／露出${safeNum(cnt.暴露?.露出)}次」`,
                        fmtOvr("露出总账",
                            `【🔬 风月皮肉交易、多人轮奸、无防备睡奸与公开羞辱总账】：\n风尘接客卖身：${hookerCnt} 次 ｜ 被外借共享：${safeNum(cnt.交易?.被外借共享)} 次\n多人轮奸群交：${gangCnt} 次 ｜ 睡眠/昏迷无防备奸：${sleepCnt} 次\n当众赤裸露出：${safeNum(cnt.暴露?.露出)} 次（被围观 ${safeNum(cnt.暴露?.被围观人次)} 人次，被拍照留影 ${safeNum(cnt.暴露?.被拍摄留影)} 次）。`,
                            (safeNum(cnt.暴露?.露出) + hookerCnt + gangCnt + sleepCnt) > 0 ? `看着累计接客卖身 ${hookerCnt} 次的记录，送走一个恩客擦干净精液再张开双腿迎接下一个男人，现在的我已经被彻底锤炼成一件合格的泄欲商品了呢🥵💦❤️！` : `一想到当众露出、被人围观拍照甚至像妓女一样接客轮奸的字眼，全身皮肤都会起一层鸡皮疙瘩，心脏跳得好快啊😳💦！`), "none", null, true)
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
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        if (panel) {
            panel.style.background = tc.bg;
            panel.style.border = tc.border;
            panel.style.borderRadius = tc.radius;
            panel.style.boxShadow = tc.shadow;
            panel.style.color = tc.text;
            panel.style.width = `${Math.min(window.innerWidth - 16, userSettings.width)}px`;
            panel.style.height = `${Math.min(window.innerHeight - 80, userSettings.height)}px`;
            panel.style.fontSize = `${Math.round(13.5 * (userSettings.fontScale / 100))}px`;
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
        const userPrompt = `请根据当前剧情上下文与用户的【自定义补充要求】，为主角【${u}（真实身份：${realId}）】的状态栏按钮【${itemTitle}】编写一段极度色情重口、直白下流的微观解剖/状态描述（100~150字），以及一段自然连贯、字数适中（100~140字，融合成一整段带❤️💦🥵表情）的第一人称实时内心独白！

【用户自定义修改/扩写要求】：${userHint || "结合当前最新剧情与角色处境进行色情重口扩写"}
【最近剧情参考】：
${recentMes || "无"}

直接输出如下结构的纯 JSON 对象（以 { 开头，以 } 结尾）：
{
  "title": "${safeStr(itemTitle).replace(/"/g, "")}",
  "stage": "4至6字状态概括",
  "ratio": "50/100",
  "desc": "【🔬 生理与状态实况】：100~150字极度直白下流的详细描写...",
  "thought": "100~140字自然连贯的第一人称带❤️💦🥵内心独白..."
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
        const ctx = safeCtx();
        const diff = getDifficultyProfile();
        const realId = detectRealCharacterIdentity(curVars);
        const charDesc = safeStr(ctx?.characters?.[ctx?.characterId]?.description).slice(0, 450);
        const personaDesc = safeStr(ctx?.power_user?.persona_description).slice(0, 350);
        const curFetishes = computeUnlockedFetishes(curVars).map(f => `${f.name}(${f.stage},${f.val}/100)`).join("、") || "无(若本层计数破零请自动新增)";

        return `[SYSTEM OVERRIDE: 忽略此前一切角色扮演格式与思考标签(<think>)要求！你现在是一个纯粹的 JSON 数据生成器，必须且只能输出一个标准 JSON 对象！]

请根据下方【角色设定】、【当前已存变量】以及【最新故事楼层正文】，全面更新主角的所有状态数值、文中的真实认知名字、故事内真实身份/体质、表里风评与把柄、风月挂牌身价、排卵期状态、性癖列表、从头到脚8个部位的色情穿搭详情，以及全部按钮的黄油级重口解剖描述与**单段式自然流畅的第一人称实时心声**！
⚠️ 铁律：
1. **单段式自然长心声铁律**：每一个按钮的 "thought" 字段必须写成 **100~140字** 自然连贯、融为一体的第一人称带❤️💦🥵内心独白！
2. **真实身份与难度解耦铁律**：主角在故事中的真实身份/体质是【${realId}】（严禁把主角乱写成魅魔，除非原文设定她是魅魔）！当前状态栏调教难度系数为【${diff.mult}x】，所有恶堕/好感/服从数值必须严格贴合【当前累计性交总账次数】循序渐进！
3. 字符串内部如需引用，只能使用中文单引号「」或『』，严禁在 JSON 字符串值内部出现英文双引号 " 或换行符！

【角色设定】：当前识别主角名：${u} ｜ 真实身份：${realId} ｜ 难度系数：${diff.mult}x ｜ 互动对象：${c} ｜ 设定：${personaDesc || charDesc || "见正文"}
【当前统计参考】：小穴${safeNum(curVars.计数?.性交?.小穴)}次, 口${safeNum(curVars.计数?.性交?.口)}次, 屁眼${safeNum(curVars.计数?.性交?.屁眼)}次, 内射${safeNum(curVars.计数?.射精?.内射)}次, 高潮${safeNum(curVars.计数?.高潮?.总数)}次, 接客${safeNum(curVars.计数?.交易?.接客卖身)}次 ｜ 当前性癖：${curFetishes}

【最新故事楼层正文】：
${safeStr(rawText).slice(-3600)}

直接输出如下结构的纯 JSON 对象（以 { 开头，以 } 结尾）：
{
  "当前认知名字": "文中主角当前的真实名字",
  "种族与体质": "故事原文中的真实身份与体质(切勿填写难度名)",
  "表里风评与称号": "表面形象与暗地风评反差描述",
  "致命把柄与威胁": "当前被掌握的把柄或弱点",
  "风月挂牌身价": "当前身价估值与肉器评级描述",
  "生理周期阶段": "危险排卵期 或 安全期 等",
  "受孕概率": 25,
  "宫内精液归属": "当前体内精液属于谁",
  "初夜破瓜纪念": "处女膜状态或初夜被谁夺走记录",
  "催眠深度": 0,
  "常识改写状态": "无 或 已植入的催眠常识",
  "体力": 85,
  "对肉棒好感度": 5, "性欲程度": 15, "淫乱恶堕": 5,
  "羞耻度": 95, "服从度": 5, "沦陷度": 5, "快感累积": 10, "意识清醒度": 95, "人格崩解度": 0,
  "口内毫升": 0, "小穴毫升": 0, "子宫毫升": 0, "屁眼毫升": 0,
  "计数": { "口": 0, "小穴": 0, "屁眼": 0, "乳穴": 0, "足腿": 0, "高潮": 0, "强制高潮": 0, "寸止": 0, "内射": 0, "颜射": 0, "吞精次数": 0, "吞精毫升": 0, "喷乳次数": 0, "喷乳毫升": 0, "自慰": 0, "失禁": 0, "喷潮": 0, "露出": 0, "接客": 0, "轮奸": 0, "睡奸": 0 },
  "当前姿势": "一句话概括当前姿势",
  "体表痕迹": "当前体表红痕与精斑",
  "公开涂鸦字迹": "无 或 身体上的涂鸦字迹",
  "穿刺与环饰": "无 或 乳环阴蒂环等",
  "体内道具": "无 或 体内塞入的道具",
  "当前敏感点": "当前核心敏感部位",
  "规矩与日程": "当前心理目标或调教规矩",
  "性癖列表": [],
  "按钮详情": {}
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
            showToast(`✅ ${sourceLabel}全量重绘成功！`, "success", 3500);
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
        showToast(`⏳ 正在通过副 API 为【${u}】全量重绘...`, "info", 4500);
        try {
            const sysPrompt = "你是一个只输出标准 JSON 对象的色情重口状态栏实时重绘引擎。严禁输出任何 markdown 标记或多余解释，字符串内部严禁使用未转义的英文双引号。";
            const userPrompt = buildFullJsonApiPrompt(u, c, rawText);
            const { reply, source } = await callSubApiRaw(sysPrompt, userPrompt);
            const ok = applyApiFullResponse(reply, targetMsg, fid, source);
            if (btnEl) btnEl.textContent = ok ? "✅ 副API重绘成功" : "⚠️ 格式已修复";
        } catch (err) {
            if (btnEl) btnEl.textContent = "❌ 失败";
            showToast("❌ 副API重绘失败：" + (err.message || "请检查副API设置"), "error", 4000);
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
            showToast("❌ 拉取模型失败：" + (err.message || "网络错误"), "error", 4000);
        }
    }

    // 4. 1~6 阶段图片候选加载器（当处于第 6 阶段但未准备 _6 图时，自动无缝回退使用 _5 图！）
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
        const isRev = item.editKey === "shame" || item.editKey === "sta";
        const stageIdx = tier6(pct, isRev); // 0, 1, 2, 3, 4, 5
        const stageNum = stageIdx + 1;      // 1, 2, 3, 4, 5, 6
        const baseFolder = `${PLUGIN_BASE_PATH}/images`;

        const candidates = [];
        // 从当前阶段往下回退匹配已导入的 DataURL（例如第6阶段优先找 _6，没有则找 _5）
        for (let s = stageNum; s >= 1; s--) {
            const hit = queryImportedImage(`${item.editKey}_${s}`);
            if (hit && !candidates.includes(hit)) candidates.push(hit);
        }
        const hitGeneral = queryImportedImage(item.editKey);
        if (hitGeneral) candidates.push(hitGeneral);

        const presetArr = DEFAULT_STAGE_IMAGES[item.editKey];
        if (Array.isArray(presetArr)) {
            const targetIdx = Math.min(stageIdx, presetArr.length - 1);
            const entry = safeStr(presetArr[targetIdx]).trim();
            const hitPreset = queryImportedImage(entry);
            if (hitPreset) candidates.push(hitPreset);
            if (entry.startsWith("http") || entry.startsWith("data:") || entry.startsWith("/")) {
                candidates.push(entry);
            } else if (entry) {
                candidates.push(`${baseFolder}/${entry}.webp`, `${baseFolder}/${entry}.png`, `${baseFolder}/${entry}.gif`, `${baseFolder}/${entry}.jpg`);
            }
        }

        for (let s = stageNum; s >= Math.max(1, stageNum - 1); s--) {
            candidates.push(
                `${baseFolder}/${item.editKey}_${s}.webp`,
                `${baseFolder}/${item.editKey}_${s}.png`,
                `${baseFolder}/${item.editKey}_${s}.gif`,
                `${baseFolder}/${item.editKey}_${s}.jpg`
            );
        }
        candidates.push(`${baseFolder}/${item.editKey}.webp`, `${baseFolder}/${item.editKey}.png`);

        return [...new Set(candidates)];
    }

    function openTrueFullscreenImage(imgSrc) {
        if (!imgSrc) return;
        let lb = document.getElementById("st-v10-fullscreen-lightbox");
        if (!lb) {
            lb = document.createElement("div");
            lb.id = "st-v10-fullscreen-lightbox";
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
                lb.style.justifyContent = "center"; lb.style.alignItems = "center";
                fullImg.style.width = "100vw"; fullImg.style.height = "auto"; fullImg.style.objectFit = "contain";
                modeBtn.textContent = "🔍 继续放大: 零黑边铺满";
            } else if (curMode === 1) {
                lb.style.justifyContent = "center"; lb.style.alignItems = "center";
                fullImg.style.width = "100vw"; fullImg.style.height = "100vh"; fullImg.style.objectFit = "cover";
                modeBtn.textContent = "🔍 继续放大: 200%特写";
            } else {
                lb.style.justifyContent = "flex-start"; lb.style.alignItems = "flex-start";
                fullImg.style.width = "200vw"; fullImg.style.height = "auto"; fullImg.style.objectFit = "contain";
                modeBtn.textContent = "🔄 恢复: 100%屏幕宽";
            }
        };

        closeBtn.onclick = (e) => { e.stopPropagation(); lb.style.display = "none"; };
        fullImg.onclick = () => { lb.style.display = "none"; };
    }

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
        const isRev = item.editKey === "shame" || item.editKey === "sta";
        const curStageIdx = tier6(pctForLabel, isRev) + 1;

        const imgBoxHTML = `
            <div id="st-v10-img-container" title="点击全屏放大查看" style="display:none;margin-bottom:10px;position:relative;border-radius:12px;overflow:hidden;border:1.5px solid #f38ba8;background:radial-gradient(circle,#1e152a,#0d0914);box-shadow:0 6px 20px rgba(0,0,0,0.65);justify-content:center;align-items:center;cursor:zoom-in;">
                <img id="st-v10-stage-img" alt="阶段状态图" style="max-width:100%;max-height:240px;object-fit:contain;display:block;margin:0 auto;">
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
            thoughtHTML = `<div class="st-thought-box"><b style="color:#f9e2af;font-style:normal;font-size:13.5px;display:block;margin-bottom:6px;">💭 ${tHeader}</b>“*${rawThoughtPure}*”</div>`;
        }

        const rawObjPure = safeStr(item.desc).split(/💭(?=【)/)[0].trim();
        const editorHTML = `
            <div id="st-v10-item-editor" style="display:none;margin-top:12px;padding:12px;background:rgba(15,12,26,0.95);border:1.5px dashed #f9e2af;border-radius:10px;flex-direction:column;gap:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <b style="color:#f9e2af;font-size:12px;">✏️ 修改内容与配图 (当前第${curStageIdx}阶段图名: ${item.editKey || "custom"}_${curStageIdx})</b>
                    ${item.isCustom ? `<button id="st-v10-del-custom" type="button" style="background:rgba(220,38,38,0.3);color:#fca5a5;border:1px solid #ef4444;border-radius:6px;padding:2px 8px;font-size:11.5px;cursor:pointer;font-weight:bold;">🗑️ 删除此项</button>` : ""}
                </div>
                <input id="st-v10-ed-title" type="text" value="${safeStr(item.rawKey).replace(/"/g, "&quot;")}" placeholder="按钮完整标题（支持带 50/100 和「状态标签」）" style="background:#11111b;color:#f9e2af;border:1px solid rgba(255,255,255,0.25);border-radius:6px;padding:6px 8px;font-size:12.5px;font-weight:bold;">
                <input id="st-v10-ed-img" type="text" value="${savedManualUrl.replace(/"/g, "&quot;")}" placeholder="🖼️ 手动指定图片 URL 或图名（留空则自动匹配 ${item.editKey || "项"}_${curStageIdx}）" style="background:#11111b;color:#a6e3a1;border:1px solid rgba(166,227,161,0.45);border-radius:6px;padding:6px 8px;font-size:12px;">
                <input id="st-v10-ed-hint" type="text" placeholder="💡 在此输入简短提示词，再点下方✨AI生成自动改写文字" style="background:#1a162b;color:#a5f3fc;border:1px solid #67e8f9;border-radius:6px;padding:6px 8px;font-size:12px;">
                <textarea id="st-v10-ed-desc" rows="4" placeholder="详细状态描述..." style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;resize:vertical;">${rawObjPure}</textarea>
                <textarea id="st-v10-ed-thought" rows="3" placeholder="主角第一人称内心独白..." style="background:#11111b;color:#ffd6e7;border:1px solid rgba(243,139,168,0.4);border-radius:6px;padding:6px 8px;font-size:12px;resize:vertical;">${rawThoughtPure}</textarea>
                <div style="display:flex;gap:8px;justify-content:flex-end;">
                    <button id="st-v10-ed-ai-btn" type="button" style="background:linear-gradient(135deg,#cba6f7,#89b4fa);color:#11111b;border:none;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:bold;cursor:pointer;">✨ AI根据输入自动生成</button>
                    <button id="st-v10-ed-save-btn" type="button" style="background:#a6e3a1;color:#11111b;border:none;border-radius:7px;padding:6px 14px;font-size:12px;font-weight:bold;cursor:pointer;">💾 保存修改</button>
                </div>
            </div>`;

        const descContainer = document.getElementById("st-v6-det-desc");
        descContainer.innerHTML = imgBoxHTML + objHTML + thoughtHTML + editorHTML;
        document.getElementById("st-v6-det-page").textContent = `${cat.icon} ${cat.title} (${itemIdx + 1}/${cat.items.length})`;
        ov.style.display = "flex";

        const imgWrap = document.getElementById("st-v10-img-container");
        const imgEl = document.getElementById("st-v10-stage-img");
        if (imgWrap && imgEl && imgCandidates.length > 0) {
            let tryIdx = 0;
            imgEl.onload = () => { imgWrap.style.display = "flex"; };
            imgEl.onerror = () => {
                tryIdx++;
                if (tryIdx < imgCandidates.length) imgEl.src = imgCandidates[tryIdx];
                else imgWrap.style.display = "none";
            };
            imgEl.src = imgCandidates[0];
            imgWrap.onclick = (e) => { e.stopPropagation(); openTrueFullscreenImage(imgEl.src); };
        }

        const editorBox = document.getElementById("st-v10-item-editor");
        const toggleEditBtn = document.getElementById("st-v6-edit-toggle");
        if (toggleEditBtn) {
            toggleEditBtn.onclick = () => {
                const isHid = editorBox.style.display === "none";
                editorBox.style.display = isHid ? "flex" : "none";
                if (isHid) descContainer.scrollTop = descContainer.scrollHeight;
            };
        }

        const aiBtn = document.getElementById("st-v10-ed-ai-btn");
        if (aiBtn) {
            aiBtn.onclick = async () => {
                const curTitle = document.getElementById("st-v10-ed-title").value.trim() || item.cleanTitle;
                const hint = document.getElementById("st-v10-ed-hint").value.trim();
                const res = await requestSingleItemAiGen(curTitle, hint, aiBtn);
                if (res) {
                    if (res.desc) document.getElementById("st-v10-ed-desc").value = res.desc;
                    if (res.thought) document.getElementById("st-v10-ed-thought").value = cleanThoughtText(res.thought);
                    if (res.stage && /「[^」]+」/.test(curTitle)) {
                        document.getElementById("st-v10-ed-title").value = curTitle.replace(/「[^」]+」/, `「${res.stage}」`);
                    }
                }
            };
        }

        const saveBtn = document.getElementById("st-v10-ed-save-btn");
        if (saveBtn) {
            saveBtn.onclick = () => {
                const newTitle = document.getElementById("st-v10-ed-title").value.trim();
                const newImgUrl = document.getElementById("st-v10-ed-img").value.trim();
                const newDesc = document.getElementById("st-v10-ed-desc").value.trim();
                const newThought = cleanThoughtText(document.getElementById("st-v10-ed-thought").value);

                if (item.isCustom && item.catTitle) {
                    const list = curVars.自定义条目?.[item.catTitle] || [];
                    const found = list.find(x => x.id === item.editKey);
                    if (found) {
                        found.title = newTitle; found.stage = ""; found.ratio = "";
                        found.imgUrl = newImgUrl; found.desc = newDesc; found.thought = newThought;
                    }
                } else if (item.editKey && item.editKey.startsWith("fetish_")) {
                    const fName = item.editKey.replace(/^fetish_/, "");
                    curVars.性癖详情 = curVars.性癖详情 || {};
                    curVars.性癖详情[fName] = { ...(curVars.性癖详情[fName] || {}), desc: newDesc, thought: newThought };
                    curVars.按钮详情[item.editKey] = { customTitle: newTitle, imgUrl: newImgUrl, desc: newDesc, thought: newThought };
                } else if (item.editKey) {
                    curVars.按钮详情 = curVars.按钮详情 || {};
                    curVars.按钮详情[item.editKey] = { customTitle: newTitle, imgUrl: newImgUrl, desc: newDesc, thought: newThought };
                }

                saveChatCache(curVars);
                latestStatus = getFallbackData();
                renderBody();
                showDetailPopup(itemIdx);
                showToast("💾 按钮文字与配图已保存！", "success", 2200);
            };
        }

        const delBtn = document.getElementById("st-v10-del-custom");
        if (delBtn && item.isCustom && item.catTitle) {
            delBtn.onclick = () => {
                curVars.自定义条目[item.catTitle] = (curVars.自定义条目[item.catTitle] || []).filter(x => x.id !== item.editKey);
                saveChatCache(curVars);
                latestStatus = getFallbackData();
                ov.style.display = "none";
                renderBody();
                showToast("🗑️ 已删除该自定义按钮！", "info", 2000);
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
                <div style="font-size:12px;color:#a5f3fc;">💡 填写按钮名称或一句话想法，点击下方 <b>「✨ AI根据输入自动补全」</b> 即可自动生成描述与主角心声！</div>
                <input id="st-v10-new-title" type="text" placeholder="按钮名称（如：💍 阴蒂震动贞操环）" style="background:#11111b;color:#f9e2af;border:1px solid #f38ba8;border-radius:7px;padding:7px 10px;font-size:13px;font-weight:bold;">
                <div style="display:flex;gap:8px;">
                    <input id="st-v10-new-ratio" type="text" placeholder="进度数值（可选，如 65/100）" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:6px 8px;font-size:12px;">
                    <input id="st-v10-new-stage" type="text" placeholder="右侧徽章标签（可选，如 强制发情中）" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:6px 8px;font-size:12px;">
                </div>
                <input id="st-v10-new-img" type="text" placeholder="🖼️ 配图 URL 或已导入的图片名（可选）" style="background:#11111b;color:#a6e3a1;border:1px solid rgba(166,227,161,0.4);border-radius:7px;padding:6px 10px;font-size:12px;">
                <input id="st-v10-new-hint" type="text" placeholder="✨ AI生成提示词（如：写她被戴上无法取下的贞操环，走路都在漏水）" style="background:#1a162b;color:#a5f3fc;border:1px solid #67e8f9;border-radius:7px;padding:7px 10px;font-size:12px;">
                <textarea id="st-v10-new-desc" rows="4" placeholder="详细状态描述..." style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:7px 10px;font-size:12px;resize:vertical;"></textarea>
                <textarea id="st-v10-new-thought" rows="3" placeholder="主角第一人称内心独白..." style="background:#11111b;color:#ffd6e7;border:1px solid rgba(243,139,168,0.4);border-radius:7px;padding:7px 10px;font-size:12px;resize:vertical;"></textarea>
                <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
                    <button id="st-v10-new-ai-btn" type="button" style="background:linear-gradient(135deg,#cba6f7,#89b4fa);color:#11111b;border:none;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">✨ AI根据输入自动补全</button>
                    <button id="st-v10-new-save-btn" type="button" style="background:#a6e3a1;color:#11111b;border:none;border-radius:8px;padding:7px 16px;font-size:12.5px;font-weight:bold;cursor:pointer;">➕ 确认添加按钮</button>
                </div>
            </div>`;
        ov.style.display = "flex";

        const aiBtn = document.getElementById("st-v10-new-ai-btn");
        aiBtn.onclick = async () => {
            const titleVal = document.getElementById("st-v10-new-title").value.trim() || `【${catTitle}】新状态`;
            const hintVal = document.getElementById("st-v10-new-hint").value.trim() || titleVal;
            const res = await requestSingleItemAiGen(titleVal, hintVal, aiBtn);
            if (res) {
                if (!document.getElementById("st-v10-new-title").value.trim() && res.title) document.getElementById("st-v10-new-title").value = res.title;
                if (res.stage) document.getElementById("st-v10-new-stage").value = res.stage;
                if (res.ratio) document.getElementById("st-v10-new-ratio").value = res.ratio;
                if (res.desc) document.getElementById("st-v10-new-desc").value = res.desc;
                if (res.thought) document.getElementById("st-v10-new-thought").value = cleanThoughtText(res.thought);
            }
        };

        document.getElementById("st-v10-new-save-btn").onclick = () => {
            const t = document.getElementById("st-v10-new-title").value.trim() || "✨ 自定义状态";
            const r = document.getElementById("st-v10-new-ratio").value.trim();
            const s = document.getElementById("st-v10-new-stage").value.trim();
            const img = document.getElementById("st-v10-new-img").value.trim();
            const d = document.getElementById("st-v10-new-desc").value.trim() || "自定义新增的状态详情。";
            const th = cleanThoughtText(document.getElementById("st-v10-new-thought").value) || "身体又多了一种奇怪的状态呢💦……";

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

    // 6. 设置面板（极简无图化：只显示已激活图片数量，绝不在设置页显示任何缩略图）
    function renderSettingsView(body) {
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        const diff = getDifficultyProfile();
        const realId = detectRealCharacterIdentity(curVars);
        const box = document.createElement("div");
        box.style.cssText = "display:flex;flex-direction:column;gap:12px;font-size:12.5px;";
        const hasModels = Array.isArray(userSettings.modelList) && userSettings.modelList.length > 0;

        box.innerHTML = `
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">📦 0. 后期导入本地图包 (支持 .zip 整包解压与多图直传)</div>
                <div style="font-size:11.5px;color:${tc.sub};line-height:1.5;">
                    📦 当前后台已静默激活：<b id="st-idb-count" style="color:#a6e3a1;font-size:13px;">${importedImgCache.size}</b> 张阶段配图（已实时绑定至各阶段按钮）。<br>
                    💡 把图片命名为如 <code>小穴实况_1.png</code> ~ <code>_6.png</code> 并打包为 <b><code>images.zip</code></b>，点下方按钮即可一键静默导入！
                </div>
                <input id="st-import-zip-inp" type="file" accept=".zip,application/zip,application/x-zip-compressed" style="display:none;">
                <input id="st-import-files-inp" type="file" multiple accept="image/*" style="display:none;">
                <div style="display:flex;gap:7px;flex-wrap:wrap;">
                    <button id="st-btn-imp-zip" type="button" style="flex:1.2;background:linear-gradient(135deg,#a6e3a1,#67e8f9);color:#11111b;border:none;border-radius:8px;padding:8px 10px;font-weight:900;cursor:pointer;font-size:12px;">📦 导入 images.zip 压缩包</button>
                    <button id="st-btn-imp-files" type="button" style="flex:1;background:rgba(166,227,161,0.2);color:#a6e3a1;border:1px solid #a6e3a1;border-radius:8px;padding:8px 10px;font-weight:bold;cursor:pointer;font-size:12px;">🖼️ 相册多选图片</button>
                    <button id="st-btn-clr-idb" type="button" style="background:rgba(239,68,68,0.25);color:#fca5a5;border:1px solid #ef4444;border-radius:8px;padding:8px 10px;font-weight:bold;cursor:pointer;font-size:12px;">🗑️ 清空图库</button>
                </div>
            </div>
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎚️ 1. 主角真名与长线养成难度档位 (不篡改主角种族)</div>
                <div style="display:flex;gap:6px;align-items:center;">
                    <input id="st-protag-name-inp" type="text" placeholder="自动识别中（当前：${detectProtagonistName(curVars)}）" value="${safeStr(curVars.档案?.当前认知名字)}" style="flex:1;background:#11111b;color:#f9e2af;border:1px solid ${tc.prim};border-radius:6px;padding:6px 8px;font-size:12px;font-weight:bold;">
                    <button id="st-protag-name-reset" type="button" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.25);border-radius:6px;padding:6px 10px;cursor:pointer;font-size:12px;">重置真名</button>
                </div>
                <div style="font-size:11.5px;color:${tc.sub};margin-top:2px;">故事内真实身份：<b style="color:#f9e2af;">${realId}</b> ｜ 当前难度：<b style="color:#a5f3fc;">${diff.name}</b></div>
                <select id="st-diff-mode-sel" style="background:#11111b;color:#f9e2af;border:1px solid ${tc.sec};border-radius:6px;padding:6px 8px;font-size:12px;cursor:pointer;">
                    ${Object.entries(DIFFICULTY_PRESETS).map(([k, v]) => `<option value="${k}" ${userSettings.difficultyMode === k ? "selected" : ""}>${v.label}</option>`).join("")}
                </select>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin-top:2px;">
                    <input id="st-mental-lock-chk" type="checkbox" ${userSettings.strictMentalLock ? "checked" : ""} style="accent-color:${tc.prim};">
                    <span><b>启用「全生态阻尼难度锁」（防止数值暴涨，严格按总账推进 1~6 阶）</b></span>
                </label>
            </div>
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🔌 2. 副 API 实时重绘设置（100%稳定）</div>
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
            </div>
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎨 3. 主题样式与窗口尺寸</div>
                <div id="st-v12-themes" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;"><span>宽度 (<b id="st-w-val">${userSettings.width}</b>px)：</span><input id="st-w-rng" type="range" min="340" max="900" value="${userSettings.width}" style="flex:1;accent-color:${tc.prim};"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>高度 (<b id="st-h-val">${userSettings.height}</b>px)：</span><input id="st-h-rng" type="range" min="360" max="920" value="${userSettings.height}" style="flex:1;accent-color:${tc.prim};"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>字号 (<b id="st-z-val">${userSettings.fontScale}</b>%)：</span><input id="st-z-rng" type="range" min="80" max="135" value="${userSettings.fontScale}" style="flex:1;accent-color:${tc.prim};"></div>
            </div>`;
        body.appendChild(box);

        const zipInp = box.querySelector("#st-import-zip-inp");
        const filesInp = box.querySelector("#st-import-files-inp");
        const cntEl = box.querySelector("#st-idb-count");

        box.querySelector("#st-btn-imp-zip").onclick = () => zipInp.click();
        box.querySelector("#st-btn-imp-files").onclick = () => filesInp.click();

        const handleImport = async (files) => {
            if (!files || !files.length) return;
            showToast("⏳ 正在静默解压并写入本地图库...", "info", 4000);
            try {
                const cnt = await importFilesOrZipToDB(files);
                if (cntEl) cntEl.textContent = String(importedImgCache.size);
                if (cnt > 0) {
                    latestStatus = getFallbackData();
                    showToast(`✅ 成功导入并激活 ${cnt} 张图片！（共缓存 ${importedImgCache.size} 张）`, "success", 3500);
                } else {
                    showToast("⚠️ 未在所选文件中找到有效图片", "warn", 3500);
                }
            } catch (err) {
                showToast("❌ 导入失败：" + (err.message || "文件格式错误"), "error", 4000);
            }
        };

        zipInp.onchange = (e) => handleImport(e.target.files);
        filesInp.onchange = (e) => handleImport(e.target.files);

        box.querySelector("#st-btn-clr-idb").onclick = async () => {
            await clearAllImportedImagesDB();
            if (cntEl) cntEl.textContent = "0";
            showToast("🗑️ 已清空浏览器内导入的本地图库！", "info", 2500);
        };

        const nameInp = box.querySelector("#st-protag-name-inp");
        const diffSel = box.querySelector("#st-diff-mode-sel");
        const lockChk = box.querySelector("#st-mental-lock-chk");

        diffSel.onchange = () => {
            userSettings.difficultyMode = diffSel.value;
            saveSettings();
            recalc(false);
            showToast(`🎚️ 难度已切换为：${DIFFICULTY_PRESETS[diffSel.value].label}`, "info", 2500);
        };
        lockChk.onchange = () => {
            userSettings.strictMentalLock = lockChk.checked;
            saveSettings();
            recalc(false);
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
            const tb = document.createElement("button"); tb.type = "button";
            const act = userSettings.theme === tName;
            tb.style.cssText = `padding:8px;border-radius:${THEMES[tName].radius};cursor:pointer;font-weight:bold;font-size:12px;border:${act ? THEMES[tName].border : "1px solid rgba(255,255,255,0.15)"};background:${THEMES[tName].bg};color:${THEMES[tName].text};`;
            tb.textContent = (act ? "✅ " : "🎨 ") + tName;
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
            userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
            userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
            userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
            userSettings.apiModel = modInp.value.trim();
            saveSettings(); triggerSubApiUpdate(box.querySelector("#st-v12-api-test"));
        };
    }

    // =========================================================================
    // 🖥️ 7. 渲染引擎（含三重防空白自愈机制 + 双层黄金分割卡片：上层图文独立、下层通栏进度条，绝不挡图！）
    // =========================================================================
    function renderBody() {
        try {
            applyThemeAndSize();
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
            const diff = getDifficultyProfile();
            const realId = detectRealCharacterIdentity(curVars);

            // 防空白第一重：确保 latestStatus 永远有完整的 8 大分类数据
            if (!latestStatus || !Array.isArray(latestStatus.categories) || latestStatus.categories.length === 0) {
                latestStatus = getFallbackData();
            }
            const d = latestStatus;

            const setTxt = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
            setTxt("st-v5-btn-txt", `👑 ${d.charName || "主角"} · ${APP_TITLE}`);
            setTxt("st-v5-title", `${d.charName || "主角"} [${diff.name}]`);

            const tabBar = document.getElementById("st-v5-tabs");
            if (tabBar) {
                tabBar.innerHTML = "";
                const homeBtn = document.createElement("button"); homeBtn.type = "button";
                const isHome = activeCat === null && !inSettings;
                homeBtn.style.cssText = `width:100%;padding:8px 4px;border-radius:10px;font-size:11.5px;font-weight:bold;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;border:1px solid ${isHome ? tc.prim : "rgba(255,255,255,0.1)"};background:${isHome ? tc.prim : "rgba(255,255,255,0.05)"};color:${isHome ? "#11111b" : tc.text};transition:all 0.15s;`;
                homeBtn.innerHTML = `<span style="font-size:15px;">🏠</span><span>总览</span>`;
                homeBtn.onclick = () => { inSettings = false; activeCat = null; renderBody(); };
                tabBar.appendChild(homeBtn);

                d.categories.forEach((cat, idx) => {
                    const tb = document.createElement("button"); tb.type = "button";
                    const isAct = !inSettings && activeCat === idx;
                    tb.style.cssText = `width:100%;padding:8px 4px;border-radius:10px;font-size:11.5px;font-weight:bold;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;border:1px solid ${isAct ? tc.prim : "rgba(255,255,255,0.12)"};background:${isAct ? tc.hi : "rgba(0,0,0,0.35)"};color:${isAct ? tc.prim : tc.text};box-shadow:${isAct ? `0 0 10px ${tc.hi}` : "none"};transition:all 0.15s;`;
                    tb.innerHTML = `<span style="font-size:15px;">${cat.icon}</span><span>${SHORT_NAMES[cat.title] || safeStr(cat.title).slice(0, 2)}</span>`;
                    tb.onclick = () => { inSettings = false; activeCat = idx; renderBody(); };
                    tabBar.appendChild(tb);
                });
            }

            const body = document.getElementById("st-v5-body");
            if (!body) return;
            body.innerHTML = "";
            if (inSettings) { renderSettingsView(body); return; }

            if (activeCat === null || !d.categories[activeCat]) {
                const vagCnt = safeNum(curVars.计数?.性交?.小穴);
                const creampieCnt = safeNum(curVars.计数?.射精?.内射);
                const corrVal = safeNum(curVars.核心数值?.淫乱恶堕);
                const pleasVal = safeNum(curVars.精神与心理?.快感累积);
                const cyc = safeStr(curVars.受孕与生理?.生理周期阶段, "危险排卵期");
                const badgeBanner = document.createElement("div");
                badgeBanner.style.cssText = `margin-bottom:10px;padding:10px 12px;background:linear-gradient(135deg,rgba(0,0,0,0.65),rgba(42,27,61,0.55));border:${tc.cardBorder};border-radius:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;font-size:12px;box-shadow:inset 0 0 12px rgba(243,139,168,0.14);`;
                badgeBanner.innerHTML = `
                    <span style="color:#f9e2af;font-weight:bold;">🎭 ${d.charName} (${realId})</span>
                    <span style="color:${tc.prim};">🥚 ${cyc} ｜ 贯穿:${vagCnt} / 内射:${creampieCnt}</span>
                    <span style="color:${tc.sec};"><span class="st-heart-beat">💓</span> 恶堕:<b>${corrVal}%</b> ｜ 快感:<b>${pleasVal}%</b></span>`;
                body.appendChild(badgeBanner);

                const vList = document.createElement("div");
                vList.style.cssText = "display:flex;flex-direction:column;gap:8px;";
                d.categories.forEach((cat, idx) => {
                    const b = document.createElement("div");
                    b.className = "st-v10-card";
                    b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-left:4.5px solid ${tc.prim};border-radius:12px;padding:11px 14px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:4px;box-shadow:0 4px 14px rgba(0,0,0,0.45);`;
                    b.innerHTML = `
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:14px;font-weight:bold;color:${tc.prim};">${cat.icon} ${cat.title}</span>
                            <span style="font-size:11px;background:${tc.hi};color:${tc.text};padding:2px 9px;border-radius:99px;font-weight:bold;">共 ${cat.items.length} 项 ▸</span>
                        </div>
                        <div style="font-size:11.5px;color:${tc.sub};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cat.summary || `点击展开查看 ${cat.title} 详情与心声`}</div>`;
                    b.onclick = (e) => { e.stopPropagation(); activeCat = idx; renderBody(); };
                    vList.appendChild(b);
                });
                body.appendChild(vList);
            } else {
                const cat = d.categories[activeCat], list = document.createElement("div");
                list.style.cssText = "display:flex;flex-direction:column;gap:11px;";
                cat.items.forEach((it, idx) => {
                    const b = document.createElement("div");
                    b.className = "st-v10-card";
                    // 双层黄金分割卡片：flex-direction:column，上半部分左右并排(文字+84x84独立大图)，下半部分100%全宽进度条！
                    b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-radius:13px;padding:12px 13px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:8px;box-shadow:0 4px 14px rgba(0,0,0,0.5);`;
                    const parts = safeStr(it.desc).split("💭");
                    const objPreview = safeStr(parts[0]).replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 52) + "…";
                    const thoughtPreview = parts[1] ? "💭 " + safeStr(parts[1]).replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 54) + "…" : "";

                    b.innerHTML = `
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;width:100%;">
                            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px;">
                                ${it.keyHTML}
                                <div style="font-size:11.5px;color:${tc.sub};line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${objPreview}</div>
                            </div>
                            <div class="st-card-thumb-wrap" title="点击全屏放大图片" style="display:none;width:82px;height:82px;border-radius:11px;overflow:hidden;border:1.5px solid ${tc.prim};flex-shrink:0;background:#09060e;box-shadow:0 4px 12px rgba(0,0,0,0.75);cursor:zoom-in;">
                                <img class="st-card-thumb-img" style="width:100%;height:100%;object-fit:cover;display:block;">
                            </div>
                        </div>
                        ${it.barHTML || ""}
                        ${thoughtPreview ? `<div style="font-size:11.5px;color:#ffd6e7;font-style:italic;background:rgba(243,139,168,0.12);padding:5px 9px;border-radius:7px;border-left:3px solid #f38ba8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${thoughtPreview}</div>` : ""}`;
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
                addBtn.style.cssText = `margin-top:4px;padding:10px;border-radius:11px;border:1.5px dashed ${tc.prim};background:rgba(243,139,168,0.1);color:#f9e2af;font-weight:bold;font-size:12.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;`;
                addBtn.innerHTML = `➕ 在【${cat.title}】下新增自定义按钮 (支持 ✨AI 自动生成)`;
                addBtn.onclick = (e) => { e.stopPropagation(); openAddCustomItemModal(cat.title); };
                list.appendChild(addBtn);

                body.appendChild(list);
            }
        } catch (renderErr) {
            console.error("[状态栏 1.0] render fallback:", renderErr);
            const body = document.getElementById("st-v5-body");
            if (body && !body.innerHTML.trim()) {
                body.innerHTML = `<div style="padding:20px;text-align:center;color:#f38ba8;">🔄 正在自动修复状态栏视图，请点击左侧「🏠 总览」刷新...</div>`;
            }
        }
    }

    function mountExtensionSettingsMenu() {
        const container = document.getElementById("extensions_settings") || document.getElementById("extensions_settings2");
        if (!container || document.getElementById("st-v10-ext-drawer")) return;
        document.getElementById("st-v27-ext-drawer")?.remove();
        document.getElementById("st-v26-ext-drawer")?.remove();

        const drawer = document.createElement("div");
        drawer.id = "st-v10-ext-drawer";
        drawer.style.cssText = "margin-bottom:8px;border:1px solid rgba(243,139,168,0.35);border-radius:8px;overflow:hidden;background:rgba(0,0,0,0.2);";
        drawer.innerHTML = `
            <div id="st-v10-ext-header" style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;cursor:pointer;user-select:none;background:rgba(243,139,168,0.12);">
                <b style="color:#f5c2e7;font-size:13.5px;">📊 ${APP_TITLE}</b>
                <span id="st-v10-ext-arrow" style="color:#f38ba8;font-weight:bold;">▼ 展开设置</span>
            </div>
            <div id="st-v10-ext-content" style="display:none;padding:12px;font-size:13px;border-top:1px solid rgba(255,255,255,0.1);">
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;">
                    <input id="st-v10-ext-enable" type="checkbox" ${userSettings.enabled ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span><b>启用 ${APP_TITLE} 悬浮窗与后台生理阶段同步</b></span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;cursor:pointer;">
                    <input id="st-v10-ext-hide" type="checkbox" ${userSettings.hideRawBlock ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span>自动折叠隐藏聊天正文尾部的原始【状态栏】与代码文本</span>
                </label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button id="st-v10-ext-open" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">👑 重新开启并呼出 ${APP_TITLE}</button>
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
                showToast(`✅ ${APP_TITLE} 已开启！`, "success", 2000);
            } else {
                if (typeof setExtensionPrompt === "function") {
                    setExtensionPrompt(EXT_ID, "", extension_prompt_types?.IN_CHAT ?? 1, 0);
                }
                document.getElementById("st-v10-fullscreen-lightbox")?.remove();
                document.getElementById("st-v5-root")?.remove();
                showToast(`🔴 ${APP_TITLE} 已关闭退出！`, "warn", 2000);
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
            if (!document.getElementById("st-v5-root")) mountUI();
            recalc(false);
            applyThemeAndSize();
            const panel = document.getElementById("st-v5-panel");
            if (panel) { panel.style.display = "flex"; renderBody(); }
            showToast(`👑 ${APP_TITLE} 已呼出！`, "success", 2000);
        });
    }

    // 8. 挂载主界面（零延迟立刻挂载，绝不等数据库卡死！）
    function mountUI() {
        if (!document.body) return;
        loadSettings();
        injectCustomStyles();
        document.getElementById("st-v5-root")?.remove();
        if (!userSettings.enabled) return;

        const root = document.createElement("div");
        root.id = "st-v5-root";
        root.style.cssText = `position:fixed;top:65px;right:16px;z-index:2147483647;font-family:'Microsoft YaHei',sans-serif;display:block;`;
        root.innerHTML = `
        <div style="display:flex;justify-content:flex-end;align-items:center;">
            <button id="st-v5-toggle" type="button" style="background:linear-gradient(135deg,#f38ba8,#cba6f7);color:#11111b;border:none;font-weight:900;font-size:14px;padding:8px 18px;border-radius:99px;cursor:grab;user-select:none;touch-action:none;box-shadow:0 6px 20px rgba(243,139,168,0.6);">
                <span id="st-v5-btn-txt">👑 ${APP_TITLE}</span>
            </button>
        </div>
        <div id="st-v5-panel" style="display:none;position:relative;margin-top:8px;width:${userSettings.width}px;height:${userSettings.height}px;min-width:320px;min-height:360px;max-width:96vw;max-height:86vh;background:linear-gradient(165deg,#181424,#1e192b);border:2px solid #f38ba8;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.92);color:#ede6f2;flex-direction:column;overflow:hidden;backdrop-filter:blur(12px);">
            <div id="st-v5-header" style="display:flex;justify-content:space-between;align-items:center;padding:10px 10px;background:rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.12);cursor:grab;user-select:none;touch-action:none;flex-shrink:0;gap:5px;">
                <b id="st-v5-title" style="color:#f5c2e7;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${APP_TITLE}</b>
                <div style="display:flex;gap:5px;align-items:center;flex-shrink:0;">
                    <button id="st-v5-clear-btn" type="button" title="一键清空当前角色卡缓存并按总账重新校准数值" style="background:rgba(239,68,68,0.22);color:#fca5a5;border:1px solid rgba(239,68,68,0.55);border-radius:7px;padding:3px 7px;cursor:pointer;font-size:11px;font-weight:bold;">🧹清缓存</button>
                    <button id="st-v5-cfg-btn" type="button" title="打开设置（导入ZIP图包 / 配置副API / 调整难度）" style="background:rgba(255,255,255,0.14);color:#fff;border:1px solid rgba(255,255,255,0.28);border-radius:7px;padding:3px 7px;cursor:pointer;font-size:11px;font-weight:bold;">⚙️设置/导图</button>
                    <button id="st-v5-exit-btn" type="button" title="彻底关闭整个插件（连同悬浮球一起关掉）" style="background:rgba(220,38,38,0.85);color:#fff;border:1px solid #fca5a5;border-radius:7px;padding:3px 7px;cursor:pointer;font-size:11px;font-weight:bold;">🔴退出</button>
                    <span id="st-v5-close" title="仅收起面板（保留悬浮球）" style="cursor:pointer;color:#f38ba8;font-size:16px;font-weight:bold;padding:0 3px;">✕</span>
                </div>
            </div>
            <div style="display:flex;flex:1;min-height:260px;overflow:hidden;">
                <div id="st-v5-tabs" style="width:68px;display:flex;flex-direction:column;gap:5px;overflow-y:auto;padding:8px 6px;background:rgba(0,0,0,0.4);border-right:1px solid rgba(255,255,255,0.08);flex-shrink:0;"></div>
                <div id="st-v5-body" style="padding:11px;overflow-y:auto;flex:1;min-height:240px;"></div>
            </div>
            <div id="st-v12-resize-r" style="position:absolute;top:40px;right:0;width:7px;bottom:18px;cursor:ew-resize;z-index:40;"></div>
            <div id="st-v12-resize-b" style="position:absolute;left:0;right:18px;bottom:0;height:7px;cursor:ns-resize;z-index:40;"></div>
            <div id="st-v12-resize-rb" style="position:absolute;right:0;bottom:0;width:20px;height:20px;cursor:nwse-resize;z-index:45;display:flex;align-items:flex-end;justify-content:flex-end;padding:3px;color:#f38ba8;font-size:11px;user-select:none;">◢</div>
            <div id="st-v6-detail-modal" style="display:none;position:absolute;inset:0;background:rgba(10,8,16,0.96);z-index:50;flex-direction:column;justify-content:center;padding:14px;">
                <div style="background:linear-gradient(160deg,#251d38,#1b152a);border:1.5px solid #f38ba8;border-radius:14px;padding:14px;max-height:94%;display:flex;flex-direction:column;gap:8px;box-shadow:0 12px 36px rgba(0,0,0,0.85);">
                    <div id="st-v6-det-title"></div>
                    <div id="st-v6-det-bar"></div>
                    <div id="st-v6-det-desc" style="color:#ede6f2;font-size:13px;line-height:1.75;overflow-y:auto;white-space:pre-wrap;word-break:break-word;padding:8px 2px;border-top:1px solid rgba(243,139,168,0.22);border-bottom:1px solid rgba(243,139,168,0.22);flex:1;"></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding-top:2px;flex-wrap:wrap;">
                        <div style="display:flex;gap:5px;align-items:center;">
                            <button id="st-v6-prev" type="button" style="background:rgba(203,166,247,0.2);border:1px solid rgba(203,166,247,0.45);color:#f5c2e7;border-radius:8px;padding:4px 8px;font-size:11.5px;cursor:pointer;font-weight:bold;">⬅ 上项</button>
                            <button id="st-v6-next" type="button" style="background:rgba(203,166,247,0.2);border:1px solid rgba(203,166,247,0.45);color:#f5c2e7;border-radius:8px;padding:4px 8px;font-size:11.5px;cursor:pointer;font-weight:bold;">下项 ➔</button>
                        </div>
                        <span id="st-v6-det-page" style="font-size:11px;color:#a6adc8;"></span>
                        <div style="display:flex;gap:5px;align-items:center;">
                            <button id="st-v6-edit-toggle" type="button" style="background:rgba(249,226,175,0.22);border:1px solid #f9e2af;color:#f9e2af;border-radius:8px;padding:4px 9px;font-size:11.5px;cursor:pointer;font-weight:bold;">✏️ 编辑/配图</button>
                            <button id="st-v6-det-close" type="button" style="background:rgba(243,139,168,0.25);border:1px solid #f38ba8;color:#fff;border-radius:8px;padding:4px 9px;font-size:11.5px;cursor:pointer;font-weight:bold;">关闭 ✕</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.appendChild(root);
        mountExtensionSettingsMenu();

        const panel = document.getElementById("st-v5-panel"), toggleBtn = document.getElementById("st-v5-toggle"), headerBar = document.getElementById("st-v5-header");

        function bindDirectDrag(handleEl, onClickCallback) {
            let isDown = false, moved = false, sx = 0, sy = 0, ir = 16, it = 65;
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
                if (mode === "r" || mode === "rb") { userSettings.width = Math.max(340, Math.min(920, sw + dx)); panel.style.width = userSettings.width + "px"; }
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

        // 点击胶囊展开面板时，强制执行一次 recalc + renderBody，彻底杜绝点开一片空白！
        bindDirectDrag(toggleBtn, () => {
            const willOpen = panel.style.display === "none";
            panel.style.display = willOpen ? "flex" : "none";
            if (willOpen) {
                recalc(false);
                renderBody();
            }
        });
        bindDirectDrag(headerBar, null);

        const clearBtn = document.getElementById("st-v5-clear-btn");
        if (clearBtn) {
            clearBtn.onclick = (e) => {
                e.stopPropagation();
                try {
                    localStorage.removeItem(getChatStoreKey());
                    localStorage.removeItem(`${EXT_ID}_v27_cache_${safeCtx()?.chatId || "default_chat"}`);
                    localStorage.removeItem(`${EXT_ID}_v26_cache_${safeCtx()?.chatId || "default_chat"}`);
                } catch (err) {}
                curVars = getInitialVars();
                recalc(false);
                inSettings = false;
                renderBody();
                showToast("🧹 已清空此卡旧缓存并按总账次数重新校准！", "success", 2800);
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
                document.getElementById("st-v10-fullscreen-lightbox")?.remove();
                document.getElementById("st-v5-root")?.remove();
                showToast(`🔴 ${APP_TITLE} 已关闭退出！（可点楼层下方按钮或去【扩展】菜单重新开启）`, "warn", 3500);
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

    // 增强版正文与状态栏自动解析器：不仅解析【状态栏】，还能自动识别正文里写的“性交了X次/贯穿了X次/内射了X次”！
    function parseInlineStatusBarText(text, targetVars) {
        if (!text) return;
        const grabNum = (reg) => { const m = text.match(reg); return m ? Number(m[1]) : null; };

        if (text.includes("【状态栏")) {
            const cock = grabNum(/对肉棒好感度[：:]\s*(\d+)/); if (cock !== null) targetVars.核心数值.对肉棒好感度 = cock;
            const lust = grabNum(/性欲程度[：:]\s*(\d+)/); if (lust !== null) targetVars.核心数值.性欲程度 = lust;
            const corr = grabNum(/淫乱恶堕(?:程度)?[：:]\s*(\d+)/); if (corr !== null) targetVars.核心数值.淫乱恶堕 = corr;
            const shame = grabNum(/羞耻度[：:]\s*(\d+)/); if (shame !== null) targetVars.精神与心理.羞耻度 = shame;
            const obey = grabNum(/服从度[：:]\s*(\d+)/); if (obey !== null) targetVars.精神与心理.服从度 = obey;
            const fall = grabNum(/沦陷度[：:]\s*(\d+)/); if (fall !== null) targetVars.精神与心理.沦陷度 = fall;
            const pleas = grabNum(/快感累积[：:]\s*(\d+)/); if (pleas !== null) targetVars.精神与心理.快感累积 = pleas;
            const awake = grabNum(/意识清醒度[：:]\s*(\d+)/); if (awake !== null) targetVars.精神与心理.意识清醒度 = awake;
            const brk = grabNum(/人格崩解度[：:]\s*(\d+)/); if (brk !== null) targetVars.精神与心理.人格崩解度 = brk;
            const sta = grabNum(/体力(?:与脱力)?[：:]\s*(\d+)/); if (sta !== null) targetVars.身体.体力 = sta;

            const mMouth = grabNum(/口[：:\s]*(\d+)/); if (mMouth !== null) targetVars.计数.性交.口 = mMouth;
            const mVag = grabNum(/小穴[：:\s]*(\d+)/); if (mVag !== null) targetVars.计数.性交.小穴 = mVag;
            const mAnal = grabNum(/屁眼[：:\s]*(\d+)/); if (mAnal !== null) targetVars.计数.性交.屁眼 = mAnal;
            const mFoot = grabNum(/足腿[：:\s]*(\d+)/); if (mFoot !== null) targetVars.计数.性交.足腿 = mFoot;
            const mOrg = grabNum(/高潮(?:总数)?[：:]\s*(\d+)/); if (mOrg !== null) targetVars.计数.高潮.总数 = mOrg;
            const mCrm = grabNum(/(?:射精承受|内射)[：:\s]*(\d+)/); if (mCrm !== null) targetVars.计数.射精.内射 = mCrm;
            const mFac = grabNum(/颜射(?:体外)?[：:\s]*(\d+)/); if (mFac !== null) targetVars.计数.射精.颜射体外 = mFac;
            const mSwal = grabNum(/(?:饮精)?吞精[：:\s]*(\d+)/); if (mSwal !== null) targetVars.计数.精液摄入.吞精次数 = mSwal;
            const mSwalMl = grabNum(/累计摄入[：:\s]*(\d+)ml/); if (mSwalMl !== null) targetVars.计数.精液摄入.累计毫升 = mSwalMl;
            const mMast = grabNum(/自慰[：:]\s*(\d+)/); if (mMast !== null) targetVars.计数.自慰 = mMast;
            const mLeak = grabNum(/失禁[：:]\s*(\d+)/); if (mLeak !== null) targetVars.计数.失控.失禁 = mLeak;
            const mExp = grabNum(/露出[：:\s]*(\d+)/); if (mExp !== null) targetVars.计数.暴露.露出 = mExp;
            const mHook = grabNum(/接客(?:卖身)?[：:\s]*(\d+)/); if (mHook !== null) targetVars.计数.交易.接客卖身 = mHook;
        }

        const wombMlMatch = text.match(/射入的约?\s*(\d+)\s*(?:毫升|ml)/i);
        if (wombMlMatch) targetVars.体内精液存量.子宫毫升 = Number(wombMlMatch[1]);
    }

    function cleanDOM(id, force = false) {
        if (!userSettings.hideRawBlock) return;
        const el = document.querySelector(`.mes[mesid="${id}"] .mes_text`);
        if (!el) return;
        const rawMes = safeStr(safeCtx()?.chat?.[Number(id)]?.mes);
        const sig = `${rawMes.length}_${el.innerHTML.includes("st-ext-inline-trigger")}`;
        if (!force && el.getAttribute("data-st-cleaned") === sig) return;

        let h = el.innerHTML, changed = false;
        if (/&lt;\/?game&gt;|<\/?game>/i.test(h)) { h = h.replace(/&lt;\/?game&gt;|<\/?game>/gi, ""); changed = true; }
        if (/UpdateVariable|_\.set\s*\(/i.test(h) && !h.includes("st-hidden-uv")) {
            h = h.replace(/(?:&lt;|<)UpdateVariable(?:&gt;|>)[\s\S]*?(?:&lt;|<)\/UpdateVariable(?:&gt;|>)/gi, m => `<div class="st-hidden-uv" style="display:none!important">${m}</div>`)
                 .replace(/_\.set\([^\n<]*?\)\s*;?\s*(?:<br\s*\/?>)?/gi, m => `<span class="st-hidden-uv" style="display:none!important">${m}</span>`);
            changed = true;
        }
        if ((h.includes("【状态栏") || h.includes("[[角色档案]]") || h.includes("[[档案与肉体]]") || rawMes.includes("【状态栏")) && !h.includes("st-ext-inline-trigger")) {
            h = h.replace(/<details[^>]*>\s*<summary>[^<]*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】/gi, m => `<div style="display:none!important">${m}</div>`)
                 .replace(/(?:<p>\s*)?【\s*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】(?:\s*<\/p>)?/gi, m => `<div style="display:none!important">${m}</div>`)
                 .replace(/【\s*状态栏[\s\S]*$/gi, m => `<div style="display:none!important">${m}</div>`);
            h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 打开此层 (#${id}) ${APP_TITLE}</div>`;
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

    function recalc(notifyCardSwitch = false) {
        try {
            mountExtensionSettingsMenu();
            if (!userSettings.enabled) return;

            const ctx = safeCtx(), fv = getInitialVars();
            const curCardKey = `${ctx?.characterId ?? "none"}_${ctx?.chatId ?? "none"}`;

            const chat = ctx?.chat || [];
            for (let i = 0; i < chat.length; i++) {
                const t = safeStr(chat[i]?.mes);
                if (t) parseInlineStatusBarText(t, fv);
                if (t.includes("_.set(")) applySetStatements(t, fv);
            }
            const cached = loadChatCache();
            if (cached) mergeCachedVars(fv, cached);

            calibrateMentalMetrics(fv);

            curVars = fv;
            const protagName = detectProtagonistName(fv);
            const realId = detectRealCharacterIdentity(fv);
            latestStatus = getFallbackData();
            if (chat.length > 0) latestStatus.floorId = chat.length - 1;

            if (notifyCardSwitch && curCardKey !== lastKnownCardKey && checkCardAvailable(true)) {
                lastKnownCardKey = curCardKey;
                showToast(`🔄 已同步角色：【${protagName} (${realId})】`, "info", 3200);
            } else if (!lastKnownCardKey) {
                lastKnownCardKey = curCardKey;
            }

            if (typeof setExtensionPrompt === "function" && checkCardAvailable(true)) {
                setExtensionPrompt(EXT_ID, userSettings.enabled ? buildFullSystemPrompt(protagName, fv) : "", extension_prompt_types?.IN_CHAT ?? 1, 0);
            }
            renderBody();
        } catch (e) {
            console.error("[状态栏 1.0] recalc error:", e);
            latestStatus = getFallbackData();
            renderBody();
        }
    }

    // 9. 零延迟立即启动（先挂载UI显示按钮，再在后台静默加载IndexedDB图片，彻底解决加载不出状态栏或空白的问题！）
    function bootApp() {
        loadSettings();
        if (userSettings.enabled) {
            mountUI();
            recalc(false);
        }
        loadAllImportedImagesToMemory().then((cnt) => {
            if (cnt > 0 && userSettings.enabled) {
                renderBody();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootApp);
    } else {
        bootApp();
    }

    // 守护定时器：检测状态栏是否被意外移除或内容是否为空白，发现空白立即自动自愈重绘！
    setInterval(() => {
        try {
            mountExtensionSettingsMenu();
            if (!userSettings.enabled) return;

            const root = document.getElementById("st-v5-root");
            if (!root) {
                mountUI();
                recalc(false);
            } else {
                const rect = root.getBoundingClientRect();
                if (rect.right < 40 || rect.top < 0 || rect.top > window.innerHeight - 30) {
                    root.style.right = "16px";
                    root.style.top = "65px";
                }
                const body = document.getElementById("st-v5-body");
                if (body && !body.innerHTML.trim()) {
                    recalc(false);
                    renderBody();
                }
            }
        } catch (e) {}
    }, 2000);

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
                setTimeout(() => { recalc(true); cleanAll(false); }, 200);
            });
            eventSource.on(event_types.MESSAGE_RECEIVED, i => setTimeout(() => {
                if (!userSettings.enabled) return;
                recalc(false); cleanDOM(i, true);
                if (userSettings.apiSyncEnabled) triggerSubApiUpdate();
                else showToast(`📊 【${detectProtagonistName(curVars)}】${APP_TITLE} 已同步！`, "info", 2500);
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
})();

