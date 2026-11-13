// == 状态栏 1.0 (1~6阶满值神格体系 + 全按钮四层生态联动与80/20阻尼锁 + 18套独立光谱与颜文字 + 原生ZIP无图极简导入 + 反向支配AI正文完全体) ==
(function () {
    const EXT_ID = "my-status-bar";
    const PLUGIN_TITLE = "状态栏 1.0";
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
    // 🖼️ 【按钮 1~6 阶段默认图片映射表】
    // 支持 _1 到 _6 共6个阶段图片（若第6阶段未单独放 _6 图，会自动回退使用 _5 图并配紫金神格特效框）
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
    // 📦 【持久 DataURL 图库引擎 + 原生二进制 ZIP 解压器（设置页极简无图展示）】
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
            if ((flags & 0x0800) === 0 && fileName.includes("\uFFFD") && gbkDecoder) {
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

    // 3. 注入《状态栏 1.0》高定 UI 样式表（支持第六阶段神格流光与图文分离大画框）
    function injectCustomStyles() {
        if (document.getElementById("st-v28-custom-css")) return;
        const style = document.createElement("style");
        style.id = "st-v28-custom-css";
        style.textContent = `
            @keyframes stPulseGlow {
                0%, 100% { box-shadow: 0 0 8px rgba(255, 0, 60, 0.75), inset 0 0 5px rgba(255, 255, 255, 0.35); }
                50% { box-shadow: 0 0 18px rgba(255, 0, 60, 1), 0 0 28px rgba(136, 19, 55, 0.9), inset 0 0 9px rgba(255, 255, 255, 0.65); }
            }
            @keyframes stStage6Divine {
                0%, 100% { box-shadow: 0 0 12px #ff0055, 0 0 24px #7e22ce, inset 0 0 8px #fde047; border-color: #fde047 !important; }
                50% { box-shadow: 0 0 22px #fde047, 0 0 36px #ff0055, inset 0 0 14px #ffffff; border-color: #ff0055 !important; }
            }
            @keyframes stExplodeShake {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.08) rotate(-2deg); }
                50% { transform: scale(1.13) rotate(2deg); }
                75% { transform: scale(1.06) rotate(-1deg); }
            }
            @keyframes stHeartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.09); }
            }
            .st-v28-card {
                transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease !important;
            }
            .st-v28-card:hover {
                transform: translateY(-1.5px);
                box-shadow: 0 6px 22px rgba(243, 139, 168, 0.32) !important;
            }
            .st-stage5-badge {
                animation: stPulseGlow 1.6s infinite ease-in-out;
            }
            .st-stage6-badge {
                animation: stStage6Divine 1.3s infinite ease-in-out;
                background: linear-gradient(135deg, #ff0055 0%, #7e22ce 50%, #090014 100%) !important;
                color: #fde047 !important;
            }
            .st-explode-emo {
                display: inline-flex;
                align-items: center;
                gap: 2px;
                animation: stExplodeShake 1.2s infinite ease-in-out;
                background: linear-gradient(135deg, #ff003c, #2b0012);
                color: #fff !important;
                border: 1px solid #ffccd5;
                padding: 1px 7px;
                border-radius: 99px;
                font-size: 10.5px;
                font-weight: 900;
                white-space: nowrap;
                box-shadow: 0 0 10px rgba(255, 0, 60, 0.8);
            }
            .st-divine-emo {
                display: inline-flex;
                align-items: center;
                gap: 2px;
                animation: stExplodeShake 0.95s infinite ease-in-out;
                background: linear-gradient(135deg, #fde047 0%, #ff0055 45%, #3b0764 100%);
                color: #ffffff !important;
                text-shadow: 0 1px 3px #000;
                border: 1.5px solid #fef08a;
                padding: 1px 8px;
                border-radius: 99px;
                font-size: 10.5px;
                font-weight: 900;
                white-space: nowrap;
                box-shadow: 0 0 15px #ff0055, 0 0 25px #fde047;
            }
            .st-emo-pill {
                display: inline-flex;
                align-items: center;
                padding: 1px 6px;
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
        try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, `📊 ${PLUGIN_TITLE}`); } catch (e) {}
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

    // 长线养成纯难度档位（与角色种族彻底解耦）
    const DIFFICULTY_PRESETS = {
        "easy":   { label: "🌸 轻度难度 (1x 标准长线 · 约360点满六阶)", mult: 1.0, short: "1x轻度" },
        "normal": { label: "🌙 标准难度 (2.5x 耐玩养成 · 约900点满六阶)", mult: 2.5, short: "2.5x标准" },
        "hard":   { label: "🔥 硬核难度 (6x 坚韧慢热 · 约2160点满六阶)", mult: 6.0, short: "6x硬核" },
        "hell":   { label: "💀 地狱难度 (15x 漫长调教 · 约5400点满六阶)", mult: 15.0, short: "15x地狱" },
        "abyss":  { label: "👑 深渊难度 (40x 传世史诗 · 约14400点满六阶)", mult: 40.0, short: "40x深渊" }
    };

    let userSettings = {
        enabled: true,
        hideRawBlock: true,
        theme: "魅魔粉 (默认)",
        difficultyMode: "normal",
        strictMentalLock: true,
        width: 550,
        height: 710,
        fontScale: 100,
        apiSyncEnabled: false,
        apiUrl: "",
        apiKey: "",
        apiModel: "",
        modelList: []
    };

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v28_cfg") || localStorage.getItem(EXT_ID + "_v27_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            userSettings.width = Math.max(340, Math.min(920, safeNum(userSettings.width, 550)));
            userSettings.height = Math.max(360, Math.min(920, safeNum(userSettings.height, 710)));
            userSettings.fontScale = Math.max(80, Math.min(135, safeNum(userSettings.fontScale, 100)));
            if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉 (默认)";
            if (!DIFFICULTY_PRESETS[userSettings.difficultyMode]) userSettings.difficultyMode = "normal";
        } catch (e) {}
    }
    function saveSettings() {
        try { localStorage.setItem(EXT_ID + "_v28_cfg", JSON.stringify(userSettings)); } catch (e) {}
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
    // 👑 【核心重构：1 ~ 6 阶段划分函数（唯独 100% 满值可解锁第 6 阶段！）】
    // 返回 0 ~ 5 (对应第1阶段 ~ 第6阶段)
    // 正向指标(rev=false)：0~19->0, 20~39->1, 40~59->2, 60~79->3, 80~99->4(第五阶段), 100->5(第六阶段终极满值!)
    // 反向指标(rev=true，如羞耻度/体力 100->0)：100~81->0, 80~61->1, 60~41->2, 40~21->3, 20~1->4, 0->5(第六阶段彻底归零!)
    // =========================================================================
    function tier6(val, rev = false) {
        const n = Math.max(0, Math.min(100, Math.round(safeNum(val, 0))));
        const v = rev ? (100 - n) : n;
        if (v >= 100) return 5; // 👑 第六阶段（唯独100%满值或反向0%归零解锁！）
        if (v >= 80) return 4;  // 第五阶段 (80 ~ 99%)
        if (v >= 60) return 3;  // 第四阶段 (60 ~ 79%)
        if (v >= 40) return 2;  // 第三阶段 (40 ~ 59%)
        if (v >= 20) return 1;  // 第二阶段 (20 ~ 39%)
        return 0;               // 第一阶段 (0 ~ 19%)
    }

    function stageNameFromVal(val, rev = false) {
        return ["第一阶段", "第二阶段", "第三阶段", "第四阶段", "第五阶段", "👑第六阶段·终极"][tier6(val, rev)];
    }

    // =========================================================================
    // 🎨 【核心美学：18 套一钮一色独立流体光谱 + 独立 1~6 阶颜文字字典】
    // 彻底杜绝重复！每个按钮拥有自己专属的渐变色与 6 个阶段的独立表情词！
    // =========================================================================
    const BUTTON_SPECTRA = {
        // 1. 恶堕与精神板块 8 项独立字典
        "cockLove": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #ffffff, #ffe4e6)",
                "linear-gradient(90deg, #ffe4e6, #fda4af, #fb7185)",
                "linear-gradient(90deg, #fb7185, #f472b6, #e879f9)",
                "linear-gradient(90deg, #e879f9, #c084fc, #9333ea)",
                "linear-gradient(90deg, #be185d, #86198f, #3b0764)",
                "linear-gradient(90deg, #fde047 0%, #ff0055 45%, #2e1065 100%)"
            ],
            emos: ["😒 忌惮异物", "😳 形状适应", "🥺 含泪渴求", "🤤 捧茎狂舔", "🐶 见棒跪拜", "👑🍆 肉棒神明死忠!!"]
        },
        "lust": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #e0f2fe, #ffffff)",
                "linear-gradient(90deg, #ffe4e6, #FDA4AF)",
                "linear-gradient(90deg, #fb7185, #f97316)",
                "linear-gradient(90deg, #f97316, #e11d48, #be123c)",
                "linear-gradient(90deg, #ff003c, #881337, #1f0008)",
                "linear-gradient(90deg, #fef08a 0%, #ff003c 45%, #1a0005 100%)"
            ],
            emos: ["❄️ 气息平缓", "🌡️ 小腹微燥", "🥵 乳尖发硬", "🔥 欲火焚身", "🌋 夹腿磨逼", "❤️‍🔥💥 永昼发情母兽!!"]
        },
        "corr": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #f8fafc, #e2e8f0)",
                "linear-gradient(90deg, #e9d5ff, #c084fc)",
                "linear-gradient(90deg, #c084fc, #9333ea, #6b21a8)",
                "linear-gradient(90deg, #9333ea, #701a75, #3b0764)",
                "linear-gradient(90deg, #be123c, #4c0519, #09000f)",
                "linear-gradient(90deg, #fde047 0%, #c026d3 45%, #030008 100%)"
            ],
            emos: ["🕊️ 死守清白", "🥀 贞洁动摇", "😈 食髓知味", "💋 风尘肉器", "⛓️ 公用精盆", "🖤👑 深渊恶堕女皇!!"]
        },
        "shame": {
            rev: true, // 100% -> 0% 反向剥落！
            colors: [
                "linear-gradient(90deg, #ffe4e6, #fb7185, #e11d48)", // 一阶(100-81%): 羞愤苹果红
                "linear-gradient(90deg, #fbcfe8, #f472b6, #db2777)", // 二阶(80-61%): 桃花粉
                "linear-gradient(90deg, #f5d0fe, #d946ef, #a21caf)", // 三阶(60-41%): 麻木藕荷
                "linear-gradient(90deg, #c084fc, #7e22ce, #3b0764)", // 四阶(40-21%): 放浪暗紫
                "linear-gradient(90deg, #be123c, #4c0519, #110008)", // 五阶(20-1%): 廉耻将尽
                "linear-gradient(90deg, #fde047 0%, #ff0055 50%, #050005 100%)" // 六阶(0%): 羞耻全灭！
            ],
            emos: ["🍅 羞愤欲死", "🫣 捂胸咬唇", "😳 羞耻钝化", "😏 敞腿任看", "🐾 当众发骚", "🤪👑 羞耻归零裸犬!!"]
        },
        "obey": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #f1f5f9, #94a3b8)",
                "linear-gradient(90deg, #bae6fd, #818cf8)",
                "linear-gradient(90deg, #c4b5fd, #a78bfa, #7c3aed)",
                "linear-gradient(90deg, #a855f7, #6b21a8, #2e1065)",
                "linear-gradient(90deg, #d97706, #78350f, #1c0a00)",
                "linear-gradient(90deg, #fef08a 0%, #f59e0b 45%, #1a0500 100%)"
            ],
            emos: ["⚔️ 孤高抗拒", "😣 委曲求全", "🙇 温顺奉侍", "🐾 摇尾乞怜", "🐶 任打任操", "⛓️👑 绝对盲从家畜!!"]
        },
        "pleas": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #ffffff, #f3e8ff)",
                "linear-gradient(90deg, #fce7f3, #f472b6)",
                "linear-gradient(90deg, #f472b6, #e879f9, #a855f7)",
                "linear-gradient(90deg, #ec4899, #e11d48, #881337)",
                "linear-gradient(90deg, #ff0055, #701a75, #1a0010)",
                "linear-gradient(90deg, #ffffff 0%, #ff0055 45%, #0a0005 100%)"
            ],
            emos: ["🤍 余韵平缓", "⚡ 尾椎窜电", "🥵 趾尖蜷缩", "💦 濒临绝顶", "🤪 潮吹连顶", "🧠⚡ 阿片过载脑死!!"]
        },
        "精神沦陷": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #f0f9ff, #bae6fd)",
                "linear-gradient(90deg, #e0e7ff, #a5b4fc)",
                "linear-gradient(90deg, #ddd6fe, #c084fc, #9333ea)",
                "linear-gradient(90deg, #e879f9, #a21caf, #4a044e)",
                "linear-gradient(90deg, #ff007f, #4a044e, #090014)",
                "linear-gradient(90deg, #67e8f9 0%, #d946ef 45%, #020008 100%)"
            ],
            emos: ["👁️ 神智清明", "💫 精神恍惚", "🌀 防线松动", "😵‍💫 催眠顺从", "💓 爱心瞳孔", "🧠🌀 常识彻底改写!!"]
        },
        "媚药毒瘾": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #f0fdf4, #bbf7d0)",
                "linear-gradient(90deg, #a7f3d0, #34d399)",
                "linear-gradient(90deg, #6ee7b7, #c084fc, #9333ea)",
                "linear-gradient(90deg, #a855f7, #ec4899, #831843)",
                "linear-gradient(90deg, #10b981, #be185d, #1a0010)",
                "linear-gradient(90deg, #4ade80 0%, #ff0055 50%, #05000a 100%)"
            ],
            emos: ["🌿 体液纯净", "🍬 微醺依恋", "🧪 精瘾发作", "🤤 骨髓发痒", "🤪 断精发狂", "☠️💉 媚毒入骨母猪!!"]
        },

        // 2. 六孔开发主阶位 6 项独立字典
        "骚口实况": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #fff1f2, #fecdd3)",
                "linear-gradient(90deg, #fecdd3, #fda4af)",
                "linear-gradient(90deg, #fb7185, #f43f5e)",
                "linear-gradient(90deg, #f43f5e, #be123c, #881337)",
                "linear-gradient(90deg, #e11d48, #4c0519, #190008)",
                "linear-gradient(90deg, #fde047 0%, #e11d48 45%, #140005 100%)"
            ],
            emos: ["🌸 朱唇紧闭", "😛 香舌生津", "😮‍💨 吞吐适应", "🤤 深喉锁茎", "🤮 精臭成瘾", "👄👑 终极榨精口器!!"]
        },
        "胸部实况": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #fffbeb, #fde68a)",
                "linear-gradient(90deg, #fef3c7, #fbcfe8)",
                "linear-gradient(90deg, #fbcfe8, #f472b6, #ec4899)",
                "linear-gradient(90deg, #f472b6, #db2777, #9d174d)",
                "linear-gradient(90deg, #fde047, #e11d48, #3b0014)",
                "linear-gradient(90deg, #ffffff 0%, #fb7185 45%, #4c0519 100%)"
            ],
            emos: ["🌸 娇嫩处乳", "😳 乳尖硬挺", "🤲 揉捏变形", "🍼 乳腺打通", "💦 挤压喷奶", "🐄👑 永动机母乳壶!!"]
        },
        "小穴实况": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #ffffff, #fce7f3)",
                "linear-gradient(90deg, #fbcfe8, #f472b6)",
                "linear-gradient(90deg, #f472b6, #ec4899, #be185d)",
                "linear-gradient(90deg, #e11d48, #9f1239, #4c0519)",
                "linear-gradient(90deg, #ff003c, #701a75, #14000a)",
                "linear-gradient(90deg, #fde047 0%, #ff003c 45%, #090005 100%)"
            ],
            emos: ["🌸 一线处子", "🌺 初破微张", "💦 充血外翻", "🕳️ 大开肉壶", "🌊 合不拢漏精", "👑🌺 万夫莫敌名器!!"]
        },
        "子宫实况": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #fff1f2, #ffe4e6)",
                "linear-gradient(90deg, #fda4af, #fb7185)",
                "linear-gradient(90deg, #fb7185, #e11d48, #be123c)",
                "linear-gradient(90deg, #e11d48, #9333ea, #581c87)",
                "linear-gradient(90deg, #ff0055, #4c0519, #0f0008)",
                "linear-gradient(90deg, #fef08a 0%, #ff0055 45%, #1a0010 100%)"
            ],
            emos: ["🔒 宫口紧锁", "💓 下腹酸软", "🔓 龟头顶开", "🧲 主动吸精", "🔻 宫口脱垂", "🫀👑 脱垂锁精苗床!!"]
        },
        "阴蒂尿道": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #ffffff, #fef9c3)",
                "linear-gradient(90deg, #fef08a, #facc15)",
                "linear-gradient(90deg, #facc15, #f97316, #ea580c)",
                "linear-gradient(90deg, #ea580c, #e11d48, #881337)",
                "linear-gradient(90deg, #ff003c, #78350f, #140005)",
                "linear-gradient(90deg, #fef08a 0%, #ff003c 45%, #080002 100%)"
            ],
            emos: ["🌸 包皮隐没", "😳 充血勃起", "⚡ 肥大酸豆", "💦 括约肌松", "⛲ 潮吹喷尿", "🌊👑 狂喷失禁水龙头!!"]
        },
        "屁眼实况": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #f5f5f4, #e7e5e4)",
                "linear-gradient(90deg, #fecdd3, #f472b6)",
                "linear-gradient(90deg, #e879f9, #a855f7, #7e22ce)",
                "linear-gradient(90deg, #9333ea, #be123c, #4c0519)",
                "linear-gradient(90deg, #be185d, #3b0764, #09000f)",
                "linear-gradient(90deg, #fde047 0%, #a21caf 45%, #050008 100%)"
            ],
            emos: ["🌸 菊蕾紧闭", "😣 异物撑开", "😳 肠壁软化", "🕳️ 后庭大开", "💦 灌肠漏精", "🕳️👑 第二生殖腔便器!!"]
        },

        // 3. 副轨液体与特殊条独立字典
        "sub_pee": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #ffffff, #fefce8)",
                "linear-gradient(90deg, #fef08a, #fde047)",
                "linear-gradient(90deg, #facc15, #f59e0b)",
                "linear-gradient(90deg, #ea580c, #e11d48)",
                "linear-gradient(90deg, #ff003c, #7f1d1d, #1a0005)",
                "linear-gradient(90deg, #fef08a 0%, #ff003c 45%, #050000 100%)"
            ],
            emos: ["🤍 膀胱清爽", "😳 尿意微涨", "😣 夹腿憋尿", "🥵 濒临决堤", "⛲ 失控漏尿", "🌊🤯 彻底失禁决堤!!"]
        },
        "sub_semen": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #64748b, #94a3b8)",
                "linear-gradient(90deg, #e2e8f0, #ffffff)",
                "linear-gradient(90deg, #ffffff, #fce7f3, #f9a8d4)",
                "linear-gradient(90deg, #fbcfe8, #f472b6, #db2777)",
                "linear-gradient(90deg, #ffffff, #e11d48, #4c0519)",
                "linear-gradient(90deg, #ffffff 0%, #ff0055 45%, #1f000d 100%)"
            ],
            emos: ["🤍 空虚待灌", "🥛 挂壁残留", "💧 白浊咕啾", "🥵 灌满鼓胀", "💦 满溢滴淌", "🫃💥 精盆撑爆满溢!!"]
        },
        "sub_milk": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #64748b, #94a3b8)",
                "linear-gradient(90deg, #fffbeb, #fef3c7)",
                "linear-gradient(90deg, #fde68a, #fbcfe8)",
                "linear-gradient(90deg, #fbcfe8, #f472b6)",
                "linear-gradient(90deg, #fffbeb, #fb7185, #881337)",
                "linear-gradient(90deg, #ffffff 0%, #fde047 35%, #e11d48 100%)"
            ],
            emos: ["🌸 尚未泌乳", "🍼 乳腺微胀", "🥺 乳汁充盈", "💦 乳尖渗奶", "🍼 涨痛喷乳", "🐄💥 双乳狂喷不止!!"]
        },
        "sta": {
            rev: true, // 100% -> 0% 反向消耗！
            colors: [
                "linear-gradient(90deg, #bbf7d0, #4ade80, #16a34a)",
                "linear-gradient(90deg, #d9f99d, #a3e635, #65a30d)",
                "linear-gradient(90deg, #fef08a, #facc15, #ca8a04)",
                "linear-gradient(90deg, #fed7aa, #fb923c, #ea580c)",
                "linear-gradient(90deg, #fda4af, #e11d48, #4c0519)",
                "linear-gradient(90deg, #dc2626 0%, #450a0a 55%, #050000 100%)"
            ],
            emos: ["✨ 精力充沛", "😮‍💨 呼吸微促", "🥵 香汗淋漓", "🫠 腰腿酸软", "😵 双腿筛糠", "😵‍💫💀 彻底虚脱休克!!"]
        },
        "正字涂鸦": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #f8fafc, #cbd5e1)",
                "linear-gradient(90deg, #fca5a5, #ef4444)",
                "linear-gradient(90deg, #ef4444, #991b1b)",
                "linear-gradient(90deg, #991b1b, #450a0a)",
                "linear-gradient(90deg, #ff003c, #1f0008)",
                "linear-gradient(90deg, #fde047 0%, #dc2626 45%, #000000 100%)"
            ],
            emos: ["🤍 玉肌无瑕", "✍️ 初画正字", "🖍️ 耻辱记账", "🔞 满腹正字", "🖤 涂鸦便器", "✍️👑 全身黑字肉账本!!"]
        },
        "淫纹烙印": {
            rev: false,
            colors: [
                "linear-gradient(90deg, #f8fafc, #e2e8f0)",
                "linear-gradient(90deg, #fbcfe8, #f472b6)",
                "linear-gradient(90deg, #f472b6, #d946ef)",
                "linear-gradient(90deg, #d946ef, #9333ea)",
                "linear-gradient(90deg, #ff007f, #581c87)",
                "linear-gradient(90deg, #fde047 0%, #ff007f 45%, #2e1065 100%)"
            ],
            emos: ["🤍 小腹平坦", "🌸 暗粉浅印", "💓 淫纹微亮", "🔮 粉紫脉动", "🔥 滚烫锁精", "🔮👑 真祖魅魔神纹!!"]
        }
    };

    function getThemedBarStyle(pct, themeKey = "pleas") {
        const spec = BUTTON_SPECTRA[themeKey] || BUTTON_SPECTRA["pleas"];
        const p = Math.max(0, Math.min(100, Math.round(safeNum(pct, 0))));
        const t = tier6(p, spec.rev);
        const grad = spec.colors[t] || spec.colors[0];
        const emoTxt = spec.emos[t] || "";

        let emoHTML = "";
        if (emoTxt) {
            if (t === 5) emoHTML = `<span class="st-divine-emo">${emoTxt}</span>`;
            else if (t === 4) emoHTML = `<span class="st-explode-emo">${emoTxt}</span>`;
            else {
                const col = t === 0 ? "#e2e8f0" : t === 1 ? "#fbcfe8" : t === 2 ? "#f0abfc" : "#fda4af";
                emoHTML = `<span class="st-emo-pill" style="color:${col};border-color:${col}55;">${emoTxt}</span>`;
            }
        }
        const glow = t === 5 ? "0 0 18px #fde047, 0 0 26px #ff0055, inset 0 0 6px #fff" : t === 4 ? "0 0 14px rgba(255,0,60,0.85)" : "0 0 6px rgba(243,139,168,0.45)";
        const labelColor = t === 5 ? "#fde047" : t === 4 ? "#ff4d6d" : "#f9e2af";
        return { grad, glow, labelColor, emo: emoHTML, tier: t };
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

    const ICONS = {
        "档案与风评": "👩",
        "恶堕与脑改": "🔥",
        "下流性癖库": "🧬",
        "六孔与储精": "🌸",
        "肉改与道具": "⛓️",
        "从头到脚穿搭": "👗",
        "苗床与受孕": "🤰",
        "淫乱总账本": "💎"
    };
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
        return `${EXT_ID}_v28_cache_${cid}`;
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
    // 🔗 【核心引擎：四层生理生态传导网 + 80/20阻尼防膨胀锁 + 1~6阶长线曲线】
    // 80% 由直接总账决定，20% (封顶+12点) 由其他关联器官/荷尔蒙对数阻尼传导！
    // 平时最高锁在 99%（第五阶段），唯有主项与协同项同时满足终极里程碑方可突破 100%（第六阶段）！
    // =========================================================================
    function calcDampedStageScore(primaryPoints, synergyPoints, diffMult = 1.0, milestoneUnlocked = false) {
        if (primaryPoints <= 0 && synergyPoints <= 0) {
            return { val: 0, nextThreshold: Math.max(1, Math.ceil(8 * diffMult)) };
        }
        const dMult = Math.max(0.5, diffMult);
        // 80/20 阻尼锁：协同项采用对数压缩，且最多不超过主项的 25% + 6 点，彻底杜绝多源相加数值爆炸！
        const dampedSynergy = Math.min(primaryPoints * 0.25 + 6, Math.log1p(Math.max(0, synergyPoints)) * 3.2);
        const rawTotal = primaryPoints + dampedSynergy;
        const eff = rawTotal / dMult;

        // 1x 难度下的长线 6 阶阈值：
        // T1=8 (入二阶20%), T2=28 (入三阶40%), T3=75 (入四阶60%), T4=175 (入五阶80%), T5=360 (冲击六阶100%)
        const T1 = 8, T2 = 28, T3 = 75, T4 = 175, T5 = 360;
        let score = 0, nextRaw = T1;

        // 如果核心直接次数为 0，仅靠协同刺激最高锁在 15%（第一阶段末），绝不凭空跨阶！
        if (primaryPoints <= 0) {
            score = Math.min(15, Math.round(eff * 2.5));
            return { val: Math.max(1, score), nextThreshold: Math.ceil(T1 * dMult) };
        }

        if (eff < T1) {
            score = 3 + (eff / T1) * 16; // 3 ~ 19
            nextRaw = T1;
        } else if (eff < T2) {
            score = 20 + ((eff - T1) / (T2 - T1)) * 19; // 20 ~ 39
            nextRaw = T2;
        } else if (eff < T3) {
            score = 40 + ((eff - T2) / (T3 - T2)) * 19; // 40 ~ 59
            nextRaw = T3;
        } else if (eff < T4) {
            score = 60 + ((eff - T3) / (T4 - T3)) * 19; // 60 ~ 79
            nextRaw = T4;
        } else if (eff < T5) {
            score = 80 + ((eff - T4) / (T5 - T4)) * 19; // 80 ~ 99
            nextRaw = T5;
        } else {
            score = 100;
            nextRaw = T5;
        }

        let finalVal = Math.round(score);
        if (eff < T1 && finalVal >= 20) finalVal = 19;
        if (eff < T2 && finalVal >= 40) finalVal = 39;
        if (eff < T3 && finalVal >= 60) finalVal = 59;
        if (eff < T4 && finalVal >= 80) finalVal = 79;

        // 👑 第六阶段(100%)终极锁：必须 eff >= T5 且达成多维里程碑，否则最高锁在 99%（第五阶段巅峰）！
        if (finalVal >= 100 && (!milestoneUnlocked || eff < T5)) {
            finalVal = 99;
        }

        finalVal = Math.max(1, Math.min(100, finalVal));
        const realNext = Math.max(Math.ceil(primaryPoints + 1), Math.ceil(nextRaw * dMult));
        return { val: finalVal, nextThreshold: realNext };
    }

    // 计算全局全按钮四层生态联动状态网
    function computeEcologicalNetwork(v) {
        const c = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, preg = v.受孕与生理 || {};
        const diff = getDifficultyProfile();
        const dMult = diff.mult;

        const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼);
        const tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), beast = safeNum(c.性交?.兽交异种);
        const creampie = safeNum(c.射精?.内射), facial = safeNum(c.射精?.颜射体外);
        const swallow = safeNum(c.精液摄入?.吞精次数), swallowMl = safeNum(c.精液摄入?.累计毫升);
        const orgasm = safeNum(c.高潮?.总数), forceOrg = safeNum(c.高潮?.强制), edge = safeNum(c.高潮?.寸止);
        const leak = safeNum(c.失控?.失禁), squirt = safeNum(c.失控?.喷潮), ahegao = safeNum(c.失控?.阿嘿颜);
        const mast = safeNum(c.自慰), exp = safeNum(c.暴露?.露出), hooker = safeNum(c.交易?.接客卖身);
        const gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
        const milk = safeNum(c.泌乳?.喷乳次数), milkMl = safeNum(c.泌乳?.累计毫升);
        const whip = safeNum(mark.鞭痕与掌印), birth = safeNum(preg.生产产卵次数);

        const mouthMl = safeNum(sp.口内毫升), vagMl = safeNum(sp.小穴毫升), wombMl = safeNum(sp.子宫毫升), analMl = safeNum(sp.屁眼毫升);
        const totalMl = mouthMl + vagMl + wombMl + analMl;

        // 第一层：常驻道具与穿刺的被动微刺激
        const hasProp = prop.体内道具 && prop.体内道具 !== "无" ? 1 : 0;
        const hasPierce = mark.穿刺与环饰 && mark.穿刺与环饰 !== "无" ? 1 : 0;
        const hasTattoo = mark.淫纹与刻印 && mark.淫纹与刻印 !== "无" ? 1 : 0;

        // 第二层：六孔器官开发阶位（主项 + 跨器官协同阻尼传导）
        // 1. 骚口：主项(口交+吞精+吞精ml) + 协同(颜射+阿嘿颜+轮奸)
        const mouthObj = calcDampedStageScore(
            mouth * 1.2 + swallow * 1.5 + swallowMl * 0.04,
            facial * 0.6 + ahegao * 1.0 + gang * 1.5 + mouthMl * 0.15,
            dMult, (mouth >= 30 && swallow >= 20)
        );
        // 2. 丰乳：主项(乳交+喷乳+泌乳ml) + 协同(高潮催产素+自慰揉胸+穿刺乳环)
        const chestObj = calcDampedStageScore(
            tit * 1.4 + milk * 2.0 + milkMl * 0.03,
            orgasm * 0.35 + mast * 0.5 + hasPierce * 12 + creampie * 0.25,
            dMult, (tit >= 20 && milk >= 10)
        );
        // 3. 小穴：主项(小穴贯穿+内射+自慰+潮吹+轮奸+睡奸) + 协同(后庭薄壁挤压+丰乳催产素共鸣+体内跳蛋)
        const vagObj = calcDampedStageScore(
            vag * 1.25 + creampie * 0.9 + mast * 0.6 + squirt * 0.8 + gang * 2.2 + sleep * 1.4 + beast * 2.0,
            anal * 0.4 + chestObj.val * 0.15 + hasProp * 10 + vagMl * 0.2,
            dMult, (vag >= 50 && creampie >= 25 && (squirt + mast) >= 10)
        );
        // 4. 子宫：主项(无套内射+宫腔储精+生产产卵) + 协同(小穴深顶+高潮宫缩+淫纹催情+乳头吸吮共鸣)
        const wombObj = calcDampedStageScore(
            creampie * 1.7 + birth * 18 + (wombMl > 0 ? 8 : 0) + wombMl * 0.12,
            vag * 0.45 + orgasm * 0.4 + hasTattoo * 15 + milk * 0.6,
            dMult, (creampie >= 40 && (wombMl >= 50 || birth >= 1))
        );
        // 5. 阴蒂与尿道：主项(高潮+强制高潮+寸止+潮吹+失禁+自慰) + 协同(穿刺阴蒂环+露出羞耻刺激+鞭痕)
        const clitObj = calcDampedStageScore(
            orgasm * 0.8 + forceOrg * 1.3 + edge * 1.6 + squirt * 2.0 + leak * 2.5 + mast * 0.8,
            hasPierce * 15 + exp * 0.8 + whip * 0.5 + vag * 0.25,
            dMult, (orgasm >= 40 && (squirt + leak) >= 15)
        );
        // 6. 屁眼后庭：主项(肛交+直肠储精+异种) + 协同(小穴薄壁传导+轮奸双龙+失禁括约肌松弛+体内肛塞)
        const analObj = calcDampedStageScore(
            anal * 1.75 + beast * 1.5 + (analMl > 0 ? 6 : 0) + analMl * 0.12,
            vag * 0.3 + gang * 1.8 + leak * 0.8 + hasProp * 12,
            dMult, (anal >= 35 && (analMl >= 30 || gang >= 5))
        );

        return {
            mouthDev: mouthObj.val, mouthNext: mouthObj.nextThreshold,
            chestDev: chestObj.val, chestNext: chestObj.nextThreshold,
            vagDev: vagObj.val,     vagNext: vagObj.nextThreshold,
            wombDev: wombObj.val,   wombNext: wombObj.nextThreshold,
            clitDev: clitObj.val,   clitNext: clitObj.nextThreshold,
            analDev: analObj.val,   analNext: analObj.nextThreshold,
            totalMl
        };
    }

    // 第三层 & 第四层：恶堕与精神全维度生态同步校准（正向 0->100，反向羞耻/清醒 100->0）
    function calibrateMentalMetrics(v) {
        const c = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {};
        const diff = getDifficultyProfile();
        const dMult = Math.max(0.5, diff.mult);
        const eco = computeEcologicalNetwork(v);

        const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼);
        const tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), creampie = safeNum(c.射精?.内射);
        const swallow = safeNum(c.精液摄入?.吞精次数), swallowMl = safeNum(c.精液摄入?.累计毫升);
        const orgasm = safeNum(c.高潮?.总数), forceOrg = safeNum(c.高潮?.强制), edge = safeNum(c.高潮?.寸止);
        const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁), ahegao = safeNum(c.失控?.阿嘿颜);
        const mast = safeNum(c.自慰), exp = safeNum(c.暴露?.露出), hooker = safeNum(c.交易?.接客卖身);
        const gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸), whip = safeNum(mark.鞭痕与掌印);

        // 全局主开发点数
        const globalPrimary =
            vag * 1.1 + creampie * 1.4 + mouth * 0.85 + swallow * 1.0 + anal * 1.2 +
            tit * 0.65 + foot * 0.5 + orgasm * 0.55 + (squirt + leak) * 1.1 +
            mast * 0.45 + exp * 1.1 + hooker * 1.6 + gang * 2.6 + sleep * 1.5 + whip * 0.7;

        // 体内精液荷尔蒙与道具印记协同点数
        const globalSynergy =
            eco.totalMl * 0.25 + swallowMl * 0.03 +
            (mark.淫纹与刻印 && mark.淫纹与刻印 !== "无" ? 18 : 0) +
            (prop.体内道具 && prop.体内道具 !== "无" ? 12 : 0);

        const isGlobalMilestone = (vag + mouth + anal >= 60) && (creampie + swallow >= 30) && (orgasm >= 30) && (exp + hooker + gang + mast >= 10);
        const globalCurve = calcDampedStageScore(globalPrimary, globalSynergy, dMult, isGlobalMilestone);
        const expectedCorr = globalCurve.val;

        if (!userSettings.strictMentalLock) return;

        // 分别计算各精神指标的专属有效分（各有侧重，绝不一模一样！）
        // 1. 阳具崇拜(cockLove)：重点受 口交/吞精/小穴/内射/乳交/足交 影响
        const cockScore = calcDampedStageScore(
            mouth * 1.3 + swallow * 1.5 + vag * 1.1 + creampie * 1.3 + tit * 0.8 + foot * 0.7,
            orgasm * 0.5 + eco.totalMl * 0.2,
            dMult, (mouth + swallow >= 30 && vag + creampie >= 40)
        ).val;

        // 2. 雌畜服从(obey)：重点受 强制高潮/寸止/鞭痕/接客/轮奸/肛交/深喉 影响
        const obeyScore = calcDampedStageScore(
            forceOrg * 1.5 + edge * 1.6 + whip * 1.4 + hooker * 1.8 + gang * 2.5 + anal * 1.3 + swallow * 1.1 + vag * 0.8,
            orgasm * 0.5 + creampie * 0.8,
            dMult, (vag + anal + mouth >= 50 && (whip + forceOrg + hooker + gang) >= 15)
        ).val;

        // 3. 媚药与精液毒瘾：重点受 内射次数/吞精次数/吞精ml/当前体内储精ml 影响
        const drugScore = calcDampedStageScore(
            creampie * 1.5 + swallow * 1.6 + swallowMl * 0.05 + (v.调教进度?.媚药与发情毒 && v.调教进度.媚药与发情毒 !== "无" ? 35 : 0),
            eco.totalMl * 0.4 + orgasm * 0.4,
            dMult, (creampie + swallow >= 50 && swallowMl >= 200)
        ).val;

        const clampAround = (curVal, targetVal, lowSpan = 8, highSpan = 12, allow100 = false) => {
            const cur = Math.max(0, Math.min(100, safeNum(curVal, 0)));
            if (globalPrimary <= 0) return Math.min(cur, 12);
            const low = Math.max(0, targetVal - lowSpan);
            const high = Math.min(allow100 ? 100 : 99, targetVal + highSpan);
            return Math.max(low, Math.min(cur, high));
        };

        v.核心数值.对肉棒好感度 = clampAround(v.核心数值.对肉棒好感度, cockScore, 6, 10, cockScore >= 100);
        v.核心数值.淫乱恶堕 = clampAround(v.核心数值.淫乱恶堕, expectedCorr, 6, 10, expectedCorr >= 100);
        v.精神与心理.服从度 = clampAround(v.精神与心理.服从度, obeyScore, 6, 12, obeyScore >= 100);
        v.精神与心理.沦陷度 = clampAround(v.精神与心理.沦陷度, expectedCorr, 8, 10, expectedCorr >= 100);
        v.精神与心理.人格崩解度 = clampAround(v.精神与心理.人格崩解度, Math.max(0, expectedCorr - 12), 10, 8, expectedCorr >= 100 && ahegao >= 10);
        v.精神与心理.媚药精液毒瘾 = clampAround(v.精神与心理.媚药精液毒瘾, drugScore, 6, 12, drugScore >= 100);

        // 📉 反向剥落指标 1：羞耻度 (100% -> 0%)
        // 露出、被围观、被拍照、失禁、接客、恶堕度共同剥落羞耻心；唯有 expectedCorr===100 且经历过露出/失禁时羞耻方可归 0（第六阶段）！
        const shameErosion = Math.min(100, Math.round(expectedCorr * 0.85 + (exp * 2 + leak * 2.5 + hooker * 2) / dMult));
        const targetShame = Math.max(expectedCorr >= 100 && (exp + leak + hooker) >= 10 ? 0 : 1, 100 - shameErosion);
        const curShame = Math.max(0, Math.min(100, safeNum(v.精神与心理.羞耻度, 100)));
        v.精神与心理.羞耻度 = globalPrimary <= 0 ? Math.max(88, curShame) : Math.max(Math.max(0, targetShame - 10), Math.min(curShame, Math.min(100, targetShame + 8)));

        // 📉 反向剥落指标 2：意识清醒度 (100% -> 0%)
        const curAwake = Math.max(0, Math.min(100, safeNum(v.精神与心理.意识清醒度, 100)));
        if (globalPrimary <= 0 && curAwake < 80) v.精神与心理.意识清醒度 = 95;

        // 🔥 短期荷尔蒙波动：性欲(lust) 与 快感(pleas)
        // 高羞耻反噬快感（羞极即泄）+ 体内储精催情 + 器官敏感度传导
        const shameBacklashBonus = (v.精神与心理.羞耻度 >= 70 && (exp + forceOrg + mast + vag) > 0) ? 12 : 0;
        const semenHormoneBonus = Math.min(25, Math.round(eco.totalMl * 0.25));
        const shortCap = globalPrimary <= 0 ? 45 : 100;
        const shortFloor = Math.min(75, Math.round(expectedCorr * 0.55 + semenHormoneBonus + shameBacklashBonus));

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
        const c = v.计数 || {}, mark = v.痕迹与标记 || {};
        const diff = getDifficultyProfile();
        const dMult = diff.mult;

        const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼);
        const tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), creampie = safeNum(c.射精?.内射);
        const swallow = safeNum(c.精液摄入?.吞精次数), orgasm = safeNum(c.高潮?.总数);
        const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁), mast = safeNum(c.自慰);
        const exp = safeNum(c.暴露?.露出), hooker = safeNum(c.交易?.接客卖身);
        const milk = safeNum(c.泌乳?.喷乳次数), gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
        const edge = safeNum(c.高潮?.寸止), whip = safeNum(mark.鞭痕与掌印);
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

                const maxAllowed = calcDampedStageScore(totalCount * 0.5, corr * 0.3, dMult, totalCount >= 300 * dMult).val;
                if (totalCount > 0 && num > maxAllowed + 12) num = Math.min(num, maxAllowed + 8);
                num = Math.max(1, Math.min(100, num));
                resultMap.set(rawName, {
                    name: rawName, origin, val: num, stage: stageNameFromVal(num),
                    countNow: totalCount, nextTarget: Math.ceil(totalCount * 1.4 + 8)
                });
            });
        }

        const upsertAuto = (shortName, originTpl, primaryCnt, synergyCnt, milestoneOk) => {
            if (primaryCnt <= 0) return;
            const { val: calcVal, nextThreshold } = calcDampedStageScore(primaryCnt, synergyCnt, dMult, milestoneOk);
            const stg = stageNameFromVal(calcVal);
            const originStr = `${originTpl}（直接计数 ${Math.round(primaryCnt)}｜下一阶门槛 ${nextThreshold}｜难度：${diff.name}）`;

            if (resultMap.has(shortName)) {
                const ex = resultMap.get(shortName);
                ex.val = calcVal; ex.stage = stg; ex.origin = originStr;
                ex.countNow = Math.round(primaryCnt); ex.nextTarget = nextThreshold;
            } else {
                resultMap.set(shortName, {
                    name: shortName, origin: originStr, val: calcVal, stage: stg,
                    countNow: Math.round(primaryCnt), nextTarget: nextThreshold
                });
            }
        };

        upsertAuto("挨操肉穴瘾", `骚逼已被阳具贯穿 ${vag} 次，阴道肉褶形成阳具轮廓记忆`, vag, creampie * 0.8 + mast * 0.5, vag >= 80 && creampie >= 30);
        upsertAuto("子宫受精癖", `宫腔已被滚烫浓精内射浇灌 ${creampie} 次，宫颈口习惯被龟头顶开锁精`, creampie * 1.2, vag * 0.4 + orgasm * 0.4, creampie >= 60 && vag >= 50);
        upsertAuto("深喉吞精癖", `骚口已口交 ${mouth} 次、吞精 ${swallow} 次，食道与味蕾被雄性精腥味浸染`, mouth + swallow * 1.3, corr * 0.4, mouth >= 40 && swallow >= 30);
        upsertAuto("后庭扩菊癖", `屁眼已被粗暴开发 ${anal} 次，直肠括约肌逐渐适应粗大异物塞满感`, anal * 1.3, vag * 0.3 + gang * 1.5, anal >= 50);
        upsertAuto("乳交奉侍癖", `丰乳已夹击服侍肉棒 ${tit} 次，乳肉与乳尖在摩擦中敏化充血`, tit * 1.4, milk * 1.2 + orgasm * 0.3, tit >= 40);
        upsertAuto("母畜喷乳癖", `乳腺已被打通并挤奶喷乳 ${milk} 次，乳头一被吸吮即引发子宫共振`, milk * 1.8, tit * 0.8 + creampie * 0.4, milk >= 35);
        upsertAuto("玉足恋精癖", `玉足已足交玩弄阳具 ${foot} 次，脚趾缝沾染浓精即条件反射蜷缩`, foot * 1.4, corr * 0.3, foot >= 40);
        upsertAuto("潮吹失禁癖", `累计绝顶 ${orgasm} 次、潮吹 ${squirt} 次、漏尿失禁 ${leak} 次，尿道与高潮神经短路`, squirt * 1.8 + leak * 2.2 + orgasm * 0.4, mast * 0.6, (squirt + leak) >= 35);
        upsertAuto("寸止焦躁癖", `遭受寸止折磨 ${edge} 次，长期求而不得令神经对高潮产生病态饥渴`, edge * 1.8, orgasm * 0.4, edge >= 30);
        upsertAuto("受虐M质痛感转化", `身体承受抽打掌掴留痕 ${whip} 处，痛觉神经与多巴胺快感回路交融`, whip * 1.7, forceOrg * 0.8, whip >= 35);
        upsertAuto("自慰抠穴癖", `难耐空虚自行抠挖骚穴 ${mast} 次，手指沾满拉丝淫水自我亵渎`, mast * 1.5, vag * 0.3 + squirt * 0.5, mast >= 40);
        upsertAuto("公开露出癖", `当众赤裸露出或被视奸 ${exp} 次，将旁人下流视线转化为催情快感`, exp * 1.6, leak * 0.8 + hooker * 0.6, exp >= 35);
        upsertAuto("轮奸肉便器癖", `经历多人轮奸群交 ${gang} 次，三穴习惯同时被多根肉棒塞满抽插`, gang * 2.4, vag * 0.3 + anal * 0.5, gang >= 20);
        upsertAuto("睡奸无防备癖", `在睡眠或昏迷无防备下被侵犯 ${sleep} 次，潜意识养成梦中自动分腿本能`, sleep * 2.0, creampie * 0.4, sleep >= 25);
        upsertAuto("风尘卖淫癖", `已接客卖身或共享 ${hooker} 次，自我认知向明码标价的泄欲肉具异化`, hooker * 1.4, creampie * 0.4 + gang * 0.8, hooker >= 45);

        return Array.from(resultMap.values());
    }

    function buildFetishRichDesc(fetishObj, v, u) {
        const { name, origin, val, stage, countNow = 0, nextTarget = 20 } = fetishObj;
        const t = tier6(val, false);
        const diff = getDifficultyProfile();

        const apiFet = v.性癖详情?.[name];
        if (apiFet && (apiFet.desc || apiFet.thought)) {
            return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
                   `【🎚️ 难度档位与进阶门槛】：${diff.name}｜当前有效计数：${countNow} -> 下一阶门槛：${nextTarget}\n` +
                   `【解锁成因】：${apiFet.origin || origin}\n` +
                   `【🔞 第${t + 1}阶段微观生理与神经发作实况】：\n${apiFet.desc || "该性癖已在体内深度激活。"}\n` +
                   `💭【${u}的${stage}实时心声】：“*${cleanThoughtText(apiFet.thought || "身体一碰到这种刺激就自己发软流水了……")}*”`;
        }

        const stageDescs = [
            `【第一阶段·异物初侵/屈辱应激】（${val}/100）：「${name}」刚刚在${u}的肉体上留下最初的浅层烙印（有效值 ${countNow}，需达 ${nextTarget} 升入二阶）。理智层面仍感到强烈的羞耻与抗拒，但娇嫩粘膜与神经末梢已被强行记住摩擦触感，每当回想便耳根发烫、腿心泛起酸麻湿意。`,
            `【第二阶段·肉体通电/敏化成瘾】（${val}/100）：「${name}」已演化至第二阶段！肉体的条件反射开始背叛矜持，相关部位毛细血管长期充血敏化。只要闻到雄性腥气或处于暗示情境下，呼吸便瞬间紊乱滚烫，胸前乳尖自行硬挺，腿心花唇诚实地泌出透明春水。`,
            `【第三阶段·理智崩解/戒断渴求】（${val}/100）：「${name}」已深化至第三阶段，彻底化作刻进脊髓反射里的快感本能！羞耻防线全面溃散，痛觉与屈辱感在神经回路中被扭曲为高潮电流；一旦未能体验「${name}」，小腹深处就会泛起毒瘾发作般的空虚抓挠感！`,
            `【第四阶段·肉改畸变/母狗狂犬化】（${val}/100）：「${name}」已恶化至第四阶段重度肉改状态！长期高强度的开发已令${u}的相应器官产生不可逆的淫靡形变——括约肌松弛外翻、敏感肉珠肥大充血，毫无廉耻地敞开身体哭求更粗暴的蹂躏！`,
            `【第五阶段·脑髓熔断/公用肉便器】（${val}/100）：重度深渊便器阶段！「${name}」已将${u}的大脑皮层快感回路彻底支配！只要听到相关字眼或指令，便会瞬间瞳孔涣散、吐舌流涎，全身肉孔条件反射般张开漏液！`,
            `【👑 第六阶段·终极满值/神格化完全体】（100/100 终极满值解锁！）：全状态栏最高传奇成就！「${name}」已与${u}的基因、灵魂与每一寸肉褶100%融为一体！她已化作天生为「${name}」而存在的终极活体圣杯与快感母神，任何一次触碰都会引发永动式全孔狂喷绝顶！`
        ];

        const stageThoughts = [
            `呜……明明只是经历了 ${countNow} 次「${name}」而已，可被摩擦撑开过的粘膜现在还火辣辣地发酸发麻💦。我怎么可能会喜欢这种粗鲁下流的事呢？可为什么一闭上眼回想刚才的触感，小肚子最深处还是会不受控制地揪紧渗水呢😳❤️？`,
            `不、不对劲……为什么现在一碰到「${name}」的苗头，我的胸口就闷得发慌、两腿之间的花唇自己就充血湿透了啊😳💦？大脑明明还在命令自己守住底线，可这具叛徒身体早就记住了那种酸麻灭顶的滋味，好想再被那样粗暴地对待一次啊🥵❤️！`,
            `哈啊……已经彻底瞒不住自己了💦！只要一触发「${name}」，整条脊椎骨就像通了高压电一样从尾椎爽到头顶，脚趾头都麻得死死蜷缩起来了🥵！什么自尊矜持全都无所谓了，快点用更凶狠的力道对我做「${name}」吧💦❤️！`,
            `呜汪♡……受不了了，只要稍微停下「${name}」，我的骚穴和小腹就像有无数只蚂蚁在爬一样，淫水顺着大腿根哗啦啦地往下流个不停🥵💦！现在的我就是一条只为「${name}」摇尾巴的发情母狗呀，求求你快把人家喂饱吧❤️❤️！`,
            `啊嘿、呕咕♡……脑子被「${name}」烧成白花花的浆糊了🥵💦！眼珠子往上翻着回不来了，舌头伸在外面流着哈喇子，下面的骚逼和尿道口像坏掉的水龙头一样狂喷潮吹和骚尿！请继续对这具公用肉便器施展「${name}」吧❤️❤️！`,
            `啊啊啊♡！！100%彻底圆满融化了🥵💦👑！${u}的每一寸肉褶、每一根神经、连同灵魂深处都已经彻底进化成专为「${name}」而生的终极完全体肉壶了！哪怕只是呼吸都在因为「${name}」而全身狂喷白浊连续绝顶，请生生世世把我焊死在「${name}」的极乐神座上吧❤️❤️❤️！！`
        ];

        return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
               `【🎚️ 难度档位与进阶门槛】：${diff.name}｜当前有效计数 ${countNow}，距下一阶需 ${nextTarget}\n` +
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
    // 🤖 【核心新功能：状态栏 1~6 阶反向支配 AI 正文描写引擎！】
    // 根据状态栏当前的各器官阶段与羞耻/恶堕阶位，自动生成强制生理与心理描写铁律注入给 AI，
    // 确保当小穴达到第四、五、六阶段时，AI 写出来的正文 100% 体现出重口外翻、合不拢漏精与主动吞吸，绝不写回处女紧窄！
    // =========================================================================
    function buildPhysiologicalEnforcementPrompt(u, v) {
        const eco = computeEcologicalNetwork(v);
        const c = v.计数 || {}, sp = v.体内精液存量 || {};
        const vagCnt = safeNum(c.性交?.小穴), creampie = safeNum(c.射精?.内射), mouthCnt = safeNum(c.性交?.口), analCnt = safeNum(c.性交?.屁眼);
        const vagStage = tier6(eco.vagDev, false) + 1;
        const wombStage = tier6(eco.wombDev, false) + 1;
        const mouthStage = tier6(eco.mouthDev, false) + 1;
        const chestStage = tier6(eco.chestDev, false) + 1;
        const analStage = tier6(eco.analDev, false) + 1;
        const corrVal = safeNum(v.核心数值?.淫乱恶堕);
        const shameVal = safeNum(v.精神与心理?.羞耻度, 100);
        const corrStage = tier6(corrVal, false) + 1;

        const rules = [];

        // 1. 小穴与子宫阶位对正文的强制物理约束
        if (vagStage === 1 && vagCnt === 0) {
            rules.push(`- 【小穴当前为第1阶段·未经人事的处女一线鲍(贯穿0次)】：正文中描写下体时必须保持粉嫩紧闭、处女膜完好；若本回合发生初次破瓜插入，必须细腻描写处女膜撕裂的破瓜痛楚、落红与极度紧窄感。`);
        } else if (vagStage === 2) {
            rules.push(`- 【小穴当前为第2阶段·初破微张(已贯穿${vagCnt}次)】：已非处女！正文中花唇初次充血微张，受激时迅速泌出透明爱液拉丝，插入时虽仍有紧致包裹感但已开始适应阳具形状。`);
        } else if (vagStage === 3) {
            rules.push(`- 【小穴当前为第3阶段·充血外翻名器(已贯穿${vagCnt}次/内射${creampie}次)】：正文中严禁再写“像处女一样干涩紧闭”！必须描写小阴唇充血肥厚外翻、穴口微张合不拢、内壁层叠肉褶已记住肉棒轮廓，一被触碰或插入即淫水泛滥主动吸吮！`);
        } else if (vagStage >= 4) {
            rules.push(`- 【⚠️小穴当前已达第${vagStage}阶段·${vagStage === 6 ? "100%终极完全体万夫莫敌名器" : (vagStage === 5 ? "重度洞开合不拢漏精肉便器" : "重度肉改大开肉壶")}(已贯穿${vagCnt}次/内射${creampie}次)】：【正文最高强制铁律】在接下来的正文中，无论${u}处于日常站立、走动还是性交状态，**严禁将小穴描写为紧闭或难以插入**！必须直白描写她肥厚黑粉的阴唇彻底外翻盛开、穴口呈圆洞状无法闭合（哪怕走路说话都在噗嗤噗嗤往大腿根漏出拉丝淫水与残留白浊）；阳具插入时必须描写熟烂泥泞的千层肉褶如活物般疯狂蠕动缠绕、第${wombStage}阶段的软烂子宫颈口主动向下脱垂顶住马眼索取内射！`);
        }

        // 2. 口穴与胸部阶位对正文的强制约束
        if (mouthStage >= 3) {
            rules.push(`- 【口穴当前已达第${mouthStage}阶段(口交${mouthCnt}次)】：正文中描写口部时，必须体现她的咽喉已彻底消除了呕吐反射，闻到雄性腥味即自动流涎，深喉吞吐与吞咽浓精时带着熟稔与生理快感。`);
        }
        if (chestStage >= 3) {
            rules.push(`- 【丰乳当前已达第${chestStage}阶段】：正文中描写胸部时，必须体现乳头长期充血肿大顶起衣料，揉捏乳肉或吸吮乳尖会通过神经共鸣直接引发小穴收缩流水${safeNum(c.泌乳?.喷乳次数) > 0 ? "，且乳腺已打通随时会喷出温热母乳" : ""}。`);
        }
        if (analStage >= 3) {
            rules.push(`- 【屁眼后庭当前已达第${analStage}阶段(肛交${analCnt}次)】：正文中后庭括约肌已被深度开发软化，能够轻易吞入粗大异物并伴随肠壁蠕动高潮。`);
        }

        // 3. 体内当前残留精液对正文的强制约束
        if (eco.totalMl > 0) {
            rules.push(`- 【💦当前体内正蓄积着 ${eco.totalMl}ml 滚烫浓精(口胃${safeNum(sp.口内毫升)}ml/阴道${safeNum(sp.小穴毫升)}ml/子宫${safeNum(sp.子宫毫升)}ml/直肠${safeNum(sp.屁眼毫升)}ml)】：正文中必须体现出小腹被精液撑得沉甸甸微隆、动作间穴口不断有浓稠白浊顺着大腿内侧滴淌拉丝的淫靡细节！`);
        }

        // 4. 恶堕度与羞耻度对正文心理独白与台词的强制约束
        if (corrStage <= 2 && shameVal >= 65) {
            rules.push(`- 【精神状态：恶堕第${corrStage}阶段(${corrVal}%)/羞耻度${shameVal}%】：正文中${u}的台词与内心独白仍需保留强烈的羞耻感、自尊挣扎与“明明不想这样可敏感身体却不听话”的反差煎熬。`);
        } else if (corrStage === 3 || corrStage === 4) {
            rules.push(`- 【精神状态：恶堕已达第${corrStage}阶段(${corrVal}%)/羞耻度已降至${shameVal}%】：正文中${u}的道德矜持已大幅瓦解！严禁再写得像纯情烈女一样死命抗拒，必须描写她食髓知味、半推半就甚至主动摇臀迎合肉棒，内心独白充满对快感与精液的诚实贪恋。`);
        } else if (corrStage >= 5) {
            rules.push(`- 【⚠️精神状态：恶堕已达第${corrStage}阶段·${corrStage === 6 ? "100%终极恶堕女皇" : "深渊公用肉便器"}(恶堕${corrVal}%/羞耻仅剩${shameVal}%)】：【正文心理铁律】${u}的廉耻心与自尊已彻底粉碎！正文中她的神态、动作、台词与内心独白必须全面展现出不知廉耻的发情母狗与肉便器本性，主动掰开肉穴乞求粗暴贯穿、内射灌精与公开羞辱！`);
        }

        return `\n【🚨状态栏 1.0 -> 正文肉体与心理强制同步铁律（AI写正文时必须100%严格执行，违者视为严重OOC！）】\n` + rules.join("\n") + `\n`;
    }

    function buildFullSystemPrompt(userName, currentVars) {
        const currentYaml = varsToYaml(userName, currentVars);
        const diff = getDifficultyProfile();
        const enforceRules = buildPhysiologicalEnforcementPrompt(userName, currentVars);
        return `\n【当前变量库实时注入值（调教难度系数：${diff.mult}x｜请严格遵循故事原文的主角真实身份与种族）】\n${currentYaml}\n${enforceRules}\n
【🔥状态栏 1.0 变量实时更新规范】
1. 每条回复末尾输出：<UpdateVariable>块</UpdateVariable>。
2. 若主角在文中发生改名、变形或身份转换，必须用 _.set('${userName}.档案.当前认知名字', '文中新名字'); 实时同步！
3. **每次发生性行为、自慰、高潮、内射、吞精、露出或接客，必须在 <UpdateVariable> 中准确累加对应的【计数】字段**（如 _.set('${userName}.计数.性交.小穴', 新次数);），状态栏的所有器官 1~6 阶段进化与恶堕度将由总账计数联动驱动！`;
    }

    // =========================================================================
    // 🎨 【双层黄金分割卡片排版核心：标题与通栏流光条彻底分离，绝不挤压右侧大图！】
    // =========================================================================
    function fmtKey(rk, themeKey = "pleas", subBarCfg = null, hideBar = false, stagePctOverride = null) {
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
                const isStage6 = s.includes("第六阶段") || s.includes("100%") || s.includes("神格") || s.includes("女皇") || s.includes("万夫莫敌") || s.includes("真祖");
                const isStage5 = !isStage6 && (s.includes("第五阶段") || s.includes("终极") || s.includes("脑髓熔断") || s.includes("便器") || s.includes("赤裸") || s.includes("真空") || s.includes("危险排卵"));
                const bBg = isStage6 ? "linear-gradient(135deg,#ff0055,#7e22ce,#090014)" : isStage5 ? "linear-gradient(90deg,#ff003c,#2b0012)" : tc.hi;
                const bCol = isStage6 ? "#fde047" : isStage5 ? "#fff" : tc.text;
                const cls = isStage6 ? "st-stage6-badge" : isStage5 ? "st-stage5-badge" : "";
                badges.push(`<span class="${cls}" style="background:${bBg};border:1px solid ${tc.sec};color:${bCol};padding:1px 7px;border-radius:6px;font-size:11px;font-weight:bold;">${s}</span>`);
                return "";
            })
            .replace(/[（(]([^）)]{1,45}?(?:阶段|\d+\s*[\/／]\s*\d+)[^）)]{0,25}?)[）)]/g, (_, s) => {
                badges.push(`<span style="background:rgba(255,255,255,0.1);border:1px solid ${tc.prim};color:${tc.prim};padding:1px 7px;border-radius:6px;font-size:11px;">${s}</span>`);
                return "";
            })
            .replace(/[：:]\s*(\d+(?:\.\d+)?\s*[\/／]\s*\d+[a-zA-Z\u4e00-\u9fa5]*)\s*$/, (_, n) => {
                if (!hideBar) {
                    badges.unshift(`<span style="background:rgba(249,226,175,0.16);border:1px solid rgba(249,226,175,0.45);color:#f9e2af;padding:1px 6px;border-radius:6px;font-size:11px;font-family:Consolas,monospace;font-weight:bold;">${n}</span>`);
                }
                return "";
            })
            .replace(/[：:]\s*$/, "").trim();

        // 上半区左侧紧凑标题+徽章组（不再横向强撑，预留右侧 84x84 大图空间）
        const keyHTML = `<div style="display:flex;flex-direction:column;gap:4px;width:100%;">
            <div style="color:#f9e2af;font-weight:bold;font-size:13.5px;line-height:1.35;word-break:break-word;">${cleanTitle}</div>
            ${badges.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;">${badges.join("")}</div>` : ""}
        </div>`;

        // 下半区 100% 全宽通栏流体条（标签与颜文字位于进度条正上方两端，彻底解决遮挡图片问题！）
        let barHTML = "";
        if (pct !== null && !hideBar) {
            const st = getThemedBarStyle(pct, themeKey);
            const mainLabel = subBarCfg ? `${pct}%` : (rawRatioStr && rawRatioStr.includes("ml") ? rawRatioStr : (pct + "%"));
            barHTML = `<div style="display:flex;flex-direction:column;gap:7px;margin-top:4px;width:100%;background:rgba(0,0,0,0.36);padding:7px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);box-sizing:border-box;">
                <div style="display:flex;flex-direction:column;gap:3px;width:100%;">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;width:100%;">
                        <span style="font-size:10.5px;color:#f5c2e7;font-weight:bold;">${subBarCfg ? (subBarCfg.mainName || "🔥 阶位进度") : "🔥 当前阶位进度"} <b style="color:${st.labelColor};font-family:Consolas,monospace;margin-left:3px;">${mainLabel}</b></span>
                        ${st.emo}
                    </div>
                    <div style="width:100%;height:8.5px;background:rgba(0,0,0,0.8);border:1px solid rgba(255,255,255,0.16);border-radius:99px;overflow:hidden;padding:1px;box-sizing:border-box;">
                        <div style="width:${pct}%;height:100%;background:${st.grad};border-radius:99px;box-shadow:${st.glow};transition:width 0.4s ease;"></div>
                    </div>
                </div>`;

            if (subBarCfg) {
                const subPct = Math.max(0, Math.min(100, safeNum(subBarCfg.pct, 0)));
                const subSt = getThemedBarStyle(subPct, subBarCfg.theme || "sub_semen");
                barHTML += `
                <div style="display:flex;flex-direction:column;gap:3px;width:100%;padding-top:3px;border-top:1px dashed rgba(255,255,255,0.08);">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;width:100%;">
                        <span style="font-size:10.5px;color:${subSt.labelColor};font-weight:bold;opacity:0.95;">${subBarCfg.label || "💧 实时容量"} <b style="font-family:Consolas,monospace;margin-left:3px;">${subBarCfg.text || (subPct + "%")}</b></span>
                        ${subSt.emo}
                    </div>
                    <div style="width:100%;height:7px;background:rgba(0,0,0,0.8);border:1px solid rgba(255,255,255,0.14);border-radius:99px;overflow:hidden;padding:1px;box-sizing:border-box;">
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

    // 升级支持 1~6 阶段（含 100% 满值专属【第六阶段·终极完全体】）的动态详情生成器
    function getDynamicMetricDetail(type, v, u, liveCtx) {
        const ovr = v.按钮详情?.[type];
        const diff = getDifficultyProfile();
        const realId = detectRealCharacterIdentity(v);
        const map = {
            cockLove: {
                val: safeNum(v.核心数值?.对肉棒好感度), rev: false,
                st: ["抗拒排斥•本能戒备", "工具麻木•形状适应", "食髓知味•含泪渴求", "痴迷崇拜•主动跪舔", "肉棒至上•发情母犬", "👑肉棒神明•终极活套子"],
                d: [
                    `【🔬 神经与粘膜对雄性阳具的反应】：${u}在意识层面仍将粗硬滚烫、血管盘虬的雄性肉棒视为极具威胁的侵犯异物；面对雄性费洛蒙压迫时，心跳加速，双腿本能内扣夹紧。\n💭【${u}的实时内心感受】：“*呜……光是感受到那根青筋暴起、又粗又烫的男人东西隔着空气散发的腥热气味，我的小肚子就本能地一阵阵发紧💦！那种硕大粗鲁的东西要是强行捅进来绝对会把身体撑坏的……可为什么当男人的气息逼近时，我的膝盖却莫名发软、尾椎骨还窜起了一丝奇怪的酥麻感呢😳❤️？*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：理智上的戒备已被频繁的肉体接触瓦解。${u}的口腔舌苔与阴道肉褶已经完全记住了阳具粗硬的柱身棱角与冠沟形状，只要闻到浓烈的雄性麝香或被龟头抵住穴口，花唇便会条件反射般软化充血泌出滑腻淫水。\n💭【${u}的实时内心感受】：“*嘴唇和下面的花唇一碰到那根滚烫坚硬的柱身，连思考都还没来得及，里面的肉壁就已经自己软下来分泌出润滑粘液了😳💦。明明脑子里一直告诉自己这只是为了应付场面而不得不承受的肉棒，可每当硕大的龟头刮过敏感软肉时，腰眼还是会诚实地酸软塌下去啊……🥵*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：矜持外壳已被粗暴撞碎！${u}对滚烫大肉棒产生了深入骨髓的生理饥渴，阴道内壁层叠的媚肉一缩一缩地空虚蠕动，渴望被硕大龟头狠狠撑开填满。\n💭【${u}的实时内心感受】：“*哈啊……骚穴里面又空又痒，透明的淫水已经顺着大腿根流湿了一大片了💦！试过被滚烫粗大的真肉棒狠狠填满到子宫口的滋味之后，手指根本满足不了我这具食髓知味的身体了，求求你快把那根青筋跳动的大肉棒一口气捅进我的最深处吧🥵❤️！*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：彻底沉溺于阳具崇拜的发情母犬！将舔舐、含弄与夹紧大肉棒视作人生最高奖赏，主动伸出香舌沿着马眼与冠状沟狂热舔舐，身后蜜臀高高翘起摇晃求操。\n💭【${u}的实时内心感受】：“*唔嗯、啾噜♡……大肉棒顶在舌尖上沉甸甸热乎乎的触感太棒了，浓烈的精腥味一冲进鼻腔，我的骚逼就自己喷出一股热流了🥵💦！快用这根滚烫的大鸡巴捅穿我的喉咙和骚逼，把人家干成你的专属形状吧❤️❤️！*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：【第五阶段·阳具奴隶】大脑皮层已被粗大肉棒与滚烫浓精深度支配！离开肉棒的填塞就会陷入戒断恐慌，上下两张嘴同时流涎喷水！\n💭【${u}的实时内心感受】：“*啊嘿、呕咕♡……只要身体里没有大鸡巴插着，全身的肉洞就会空虚得直抽筋、眼泪口水止不住地往下流🥵💦！请把滚烫的肉棒插进人家的子宫里不要拔出来呀❤️❤️！*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：【👑 第六阶段·100%满值终极阳具活圣杯】全书最高阳具崇拜神格化完全体！${u}的全身每一寸粘膜、每一条神经都已进化为专为侍奉雄性肉棒而生的活体肉套子，哪怕只是闻到一丝精腥味便会全身痉挛、三穴齐喷迎来连续绝顶！\n💭【${u}的实时内心感受】：“*啊啊啊♡！！大肉棒就是${u}唯一的神明、空气和生命源泉呀🥵💦👑！全身所有肉洞的每一道肉褶都已经100%长成了大鸡巴的形状，哪怕一秒钟不被肉棒塞满都会活不下去，请生生世世把这具终极活体飞机杯焊死在神明大人的肉棒上操到死吧❤️❤️❤️！！*”`
                ]
            },
            lust: {
                val: safeNum(v.核心数值?.性欲程度), rev: false,
                st: ["表面克制•余韵温吞", "春情暗涌•乳尖发硬", "欲火焚身•淫水湿裤", "重度发骚•夹腿磨逼", "狂暴发情•三穴喷水", "👑永昼发情•欲火母神"],
                d: [
                    `【🔬 体内荷尔蒙与情欲实况】：表面维持着平静或温吞倦怠，但敏感躯体对衣料刮蹭与空气流动依然异常敏锐。\n💭【${u}的实时内心感受】：“*呼……现在身体总算稍微平静下来一点了，只是胸口和下身还残留着温吞吞的酸胀余温💦。只是稍微走动时布料擦过敏感点的酥麻感，好像随时都会把那点火苗重新点燃呢……😳❤️*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：小腹深处升起一股挥之不去的燥热暗流！雌性荷尔蒙在血管里悄然沸腾，胸前乳头在布料下充血硬挺，两腿之间泛起黏腻潮意。\n💭【${u}的实时内心感受】：“*唔……身体怎么越来越热了😳？胸口的两粒尖尖自己在衣服下面充血发硬、顶得布料生疼，连两条腿中间也开始湿漉漉地发黏了💦！好想让一双火热的大手直接按上来揉一揉啊……🥵❤️*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：滚烫的情欲之火烧遍四肢百骸！包皮下的阴蒂肉珠充血肿大，大量透明拉丝的淫水早已将贴身底裤或大腿内侧浸得泥泞不堪！\n💭【${u}的实时内心感受】：“*哈啊、哈啊……不行了，身体烫得像发高烧一样，小穴里涌出来的滚烫淫水已经把大腿根完全弄湿、顺着腿肚往下淌白线了🥵💦！快用粗硬滚烫的东西狠狠捅进我湿淋淋的肉洞里灭火呀❤️❤️！*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：重度发情失控状态！全身肌肤烫得像火炉，双腿死死交叠磨蹭着充血外翻的阴唇，全身毛孔散发着浓烈的雌性发情骚香。\n💭【${u}的实时内心感受】：“*唔嗯♡……烧起来了、全身每一根神经都在着火！乳头硬得像石子，外翻的阴唇和阴蒂肿得一碰就飙水🥵💦！现在的我满脑子只想着交配挨肏，快用滚烫浓精把发情的子宫浇透吧❤️❤️！*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：【第五阶段·狂暴发情母畜】大脑被发情荷尔蒙深度浸泡！骚穴如同水龙头般向外喷涌滚烫淫水！\n💭【${u}的实时内心感受】：“*啊啊、啊嘿♡……发情一秒钟都停不下来了！骚穴和屁眼一直在噗嗤噗嗤往外喷淫水，子宫口饥渴得自己往下脱垂要吃精液了🥵💦！快把人家按在地上狠狠操干吧❤️❤️！*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：【👑 第六阶段·100%永昼发情母神】全身血液与内分泌已100%转化为高浓度催情费洛蒙！体表散发的滚烫骚香足以令周围雄性瞬间丧失理智，三穴24小时处于永动机般的喷泉发情态！\n💭【${u}的实时内心感受】：“*啊啊啊♡！！全身每一滴血都变成滚烫的春药沸腾起来了🥵💦👑！淫水像喷泉一样把地面全都淹没了，哪怕同时被十根大肉棒插满全身所有的洞也灭不掉这股永昼发情的欲火呀，快来把这只发情母神彻底操融化吧❤️❤️❤️！！*”`
                ]
            },
            corr: {
                val: safeNum(v.核心数值?.淫乱恶堕), rev: false,
                st: ["死守矜持•道德防备", "风尘浸染•自我麻痹", "食髓知味•放荡迎合", "下贱娼妇•肉器自觉", "脑髓熔断•公用精盆", "👑深渊女皇•终极肉便器"],
                d: [
                    `【🔬 道德底线与自我认知解剖】：心底仍保留着正常人的自尊与羞耻底线，对暴露、视奸与粗鄙亵渎感到屈辱，试图守住最后一丝体面。\n💭【${u}的实时内心感受】：“*虽然身体因为外界的刺激而有些发烫发颤，但我的底线绝对不能丢💦！只希望这具过于敏感的肉体千万别在关键时刻因为快感而背叛我的意志啊😳……*”`,
                    `【🔬 道德底线与自我认知解剖】：在反复的肉体接触或快感冲刷下，贞洁观念已被磨灭大半，学会了用麻木与顺应来体会酥麻快感。\n💭【${u}的实时内心感受】：“*看着自己双腿之间被折腾得红肿湿润的私处，心里已经不再像最开始那样剧烈抗拒了💦。放下道德包袱之后，被按在身下贯穿时好像反而更容易体会到酥麻快感了呢……😳❤️*”`,
                    `【🔬 道德底线与自我认知解剖】：廉耻防线已被彻底冲垮！开始在背德与被粗暴亵渎的过程中品尝到灭顶快感，身体比嘴巴更早一步学会了摇臀迎合。\n💭【${u}的实时内心感受】：“*哈啊……每当被用下流粗鄙的字眼辱骂、或者被强行深喉内射的时候，我的骚穴反而会条件反射般夹得更紧、流出更多淫水🥵💦！快用更变态的玩法来糟蹋我吧❤️❤️！*”`,
                    `【🔬 道德底线与自我认知解剖】：身心彻底恶堕的风尘尤物与下贱母狗！以自己饱满的胸臀和紧致肉穴能成为男人发泄兽欲的肉套子为荣，主动掰开红肿花唇展示内里的淫靡泥泞。\n💭【${u}的实时内心感受】：“*嘻嘻♡……只要想到自己这副丰满白腻的身体正在被男人当成泄欲肉壶肆意抽插，我的乳头和阴蒂就会兴奋得直发抖🥵💦！快来看看人家主动掰开的骚逼有多下流吧❤️❤️！*”`,
                    `【🔬 道德底线与自我认知解剖】：【第五阶段·公用精盆便器】人类尊严大幅湮灭！视被轮奸、灌精、涂写正字与当众失禁为至高幸福！\n💭【${u}的实时内心感受】：“*啊嘿、咕啾♡……脑髓已经被浓精和快感泡化了，${u}只是一个印满了『正』字、供雄性随时插进来射精的公用肉便器呀🥵💦！请把最浓的精液灌进人家的子宫和直肠里吧❤️❤️！*”`,
                    `【🔬 道德底线与自我认知解剖】：【👑 第六阶段·100%满值深渊恶堕女皇】全状态栏最高恶堕终点！纯洁与人性已100%灰飞烟灭，从灵魂深处完成了向“终极母畜与万众排泄圣杯”的物种飞升，以承受世间最极端的轮奸、灌精、改造与凌辱为唯一生存本能！\n💭【${u}的实时内心感受】：“*啊嘿嘿、呕咕♡！！100%彻底恶堕圆满啦🥵💦👑！什么人类尊严早就连一粒灰都不剩了，现在的${u}是统领所有下贱母猪的终极深渊肉便器女皇呀！不管是男人的滚烫浓精、骚尿还是粗暴羞辱，请全部灌进我全身大开的六个肉洞里，让我永远沉沦在这座极乐肉欲地狱里吧❤️❤️❤️！！*”`
                ]
            },
            shame: {
                val: safeNum(v.精神与心理?.羞耻度, 100), rev: true,
                st: ["羞愤欲死•满面通红", "薄面潮红•咬唇隐忍", "习以为常•羞耻钝化", "不知廉耻•敞腿任看", "当众发骚•视奸高潮", "👑羞耻归零•全裸母犬"],
                d: [
                    `【🔬 羞耻神经防线与快感反噬（当前羞耻残余：${safeNum(v.精神与心理?.羞耻度, 100)}/100）】：羞耻心处于极高状态！对私密部位的暴露感到极度恐慌，但剧烈的羞耻感正在交感神经作用下成倍放大肉体敏感度（羞极即泄）。\n💭【${u}的实时内心感受】：“*呜哇啊啊……脸颊和耳朵尖烫得像要滴出血来一样，心脏咚咚咚地狂跳💦！要是被人看到我现在这副私密处偷偷发热湿润的丢脸模样，我真恨不得找条地缝钻进去……可为什么越是羞愤欲死，下面的肉缝反而越敏感越湿啊😳🥵！*”`,
                    `【🔬 羞耻神经防线与快感反噬（当前羞耻残余：${safeNum(v.精神与心理?.羞耻度, 100)}/100）】：在连续的羞耻冲击下防线开始松动，私密处被注视或沾染体液时虽仍心跳加速，但遮挡的双手已变得迟疑无力。\n💭【${u}的实时内心感受】：“*别、别用那种火辣辣的眼神一直盯着我的胸口和两腿之间看啊😳💦……想要伸手去挡住春光可手臂却软绵绵的使不上劲，甚至在被肆无忌惮视奸的时候，小穴深处居然可耻地自己收缩流汁了……❤️*”`,
                    `【🔬 羞耻神经防线与快感反噬（当前羞耻残余：${safeNum(v.精神与心理?.羞耻度, 100)}/100）】：羞耻感已被磨灭大半，哪怕光着下身当面擦拭腿根精液、或衣衫不整露出乳肉，内心也已习以为常。\n💭【${u}的实时内心感受】：“*光着下半身站在屋里，顺手擦掉大腿内侧流下来的黏腻白浊💦。全身上下每一寸皮肤早就被看光摸遍了，这种不穿内裤真空走动的放松感，反而让身体觉得隐隐有些暗爽呢……🥵*”`,
                    `【🔬 羞耻神经防线与快感反噬（当前羞耻残余：${safeNum(v.精神与心理?.羞耻度, 100)}/100）】：廉耻心几乎荡然无存！不仅对赤裸毫不在意，反而会在被人视奸私处时兴奋得阴蒂充血、淫水狂流，主动分开大腿方便观赏。\n💭【${u}的实时内心感受】：“*哈啊♡……只要感受到下流火热的视线黏在我的奶子和骚逼上，我的阴蒂就会兴奋得充血勃起，淫水噗嗤一声就涌出来了🥵💦！越盯着人家看、人家流的水就越多哟❤️❤️！*”`,
                    `【🔬 羞耻神经防线与快感反噬（当前羞耻残余：${safeNum(v.精神与心理?.羞耻度, 100)}/100）】：【第五阶段·当众露出狂】将公开暴露与旁人指点视作最强催情剂，被围观时会自动漏尿喷潮！\n💭【${u}的实时内心感受】：“*啊啊♡……好喜欢被人盯着光溜溜满是精斑的身体看呀，火辣辣的视线像舌头一样舔得全身都在高潮喷水🥵💦！快来围观下贱母狗当众发骚吧❤️❤️！*”`,
                    `【🔬 羞耻神经防线与快感反噬（👑当前羞耻度：0/100 彻底归零！）】：【👑 第六阶段·羞耻100%湮灭的终极裸犬】全状态栏羞耻剥落终点！人类社会的穿衣常识与羞耻神经已100%彻底归零，穿衣服反而会令她感到浑身难受，唯有全裸戴着项圈在大庭广众下掰开三穴展示潮吹与内射漏精，才能令她获得极乐满足！\n💭【${u}的实时内心感受】：“*啊嘿嘿♡！！羞耻心已经彻底变成 0 啦🥵💦👑！母狗本来就不应该穿衣服遮挡嘛，快把${u}浑身赤裸地栓在闹市广场正中央，让成百上千个人一边拍照围观、一边看着我四脚朝天狂喷潮吹和白浊精浆的痴态高潮到死吧❤️❤️❤️！！*”`
                ]
            },
            obey: {
                val: safeNum(v.精神与心理?.服从度), rev: false,
                st: ["孤高抗拒•强撑气场", "委曲求全•被动妥协", "温顺听话•熟练配合", "摇尾乞怜•任打任操", "巴甫洛夫•条件反射", "👑绝对盲从•烙印家畜"],
                d: [
                    `【🔬 意志防线与服从实况】：当前行为准则为「${v.调教进度?.规矩与日程 || "维持自我意志，抗拒无理摆布"}」。表面极力维持着防备或自尊气场。\n💭【${u}的实时内心感受】：“*紧咬着下唇稳住有些发软的膝盖，哪怕呼吸急促，脊背依然死死挺直💦！我绝不会轻易低头屈服😳！*”`,
                    `【🔬 意志防线与服从实况】：在局势逼迫或肉体酸软下学会了被动妥协，身体老老实实地顺从配合。\n💭【${u}的实时内心感受】：“*人在屋檐下不得不低头……不如先委曲求全地顺从配合，而且放弃挣扎乖乖听话的时候，肉体承受冲击的快感好像也变得更清晰了……😳💦*”`,
                    `【🔬 意志防线与服从实况】：已形成熟练的温顺顺从习惯，懂得主动放松腰臀、顺着对方的抽插节奏迎合。\n💭【${u}的实时内心感受】：“*只要听到发话或者手掌按上腰臀，身体就会无比熟练地把双腿分开、把腰软软地塌下去迎合插入的角度，被顶得浑身舒爽呢……🥵❤️*”`,
                    `【🔬 意志防线与服从实况】：彻底被驯服的摇尾母犬！对任何粗暴命令都奉若圣旨，挨打受罚时还会流着淫水感恩戴德。\n💭【${u}的实时内心感受】：“*汪呜♡……只要听到主人的声音，膝盖就会自动一软跪趴在地上，屁股高高撅起，骚穴里讨好的淫水滴答滴答往下淌🥵💦！请尽情命令责罚人家吧❤️❤️！*”`,
                    `【🔬 意志防线与服从实况】：【第五阶段·条件反射肉奴】身体已形成刻入脊髓的条件反射（${v.调教进度?.条件反射触发词 || "一听见指令即自动张腿漏尿"}）！\n💭【${u}的实时内心感受】：“*啊嘿♡……一听到主人的触发指令，大脑连0.1秒思考都没有，身体就已经自动四脚朝天掰开三穴献媚了🥵💦！请随便使用这件肉便器吧❤️❤️！*”`,
                    `【🔬 意志防线与服从实况】：【👑 第六阶段·100%满值绝对盲从家畜】自由意志与反抗神经元已100%永久切除！主人的每一个眼神、每一声响指都能直接操控她全部脏器与括约肌的收缩排泄，哪怕被命令当众自慰到休克或吞食污物也会带着狂喜圣洁的笑容100%完美执行！\n💭【${u}的实时内心感受】：“*汪呜、啊嘿♡！！100%彻底服从主人大人🥵💦👑！${u}没有自己的思想、没有自己的灵魂，从每一根头发丝到子宫最深处的每一块软肉全都是主人大人的私有财产！只要主人一声令下，这头烙印母畜随时准备为您献上肉体、尊严与性命呀❤️❤️❤️！！*”`
                ]
            },
            pleas: {
                val: safeNum(v.精神与心理?.快感累积), rev: false,
                st: ["余韵回落•断瘾空虚", "酥麻窜动•春水溢出", "快感攀升•趾尖蜷缩", "濒临绝顶•痉挛绷紧", "高潮过载•潮吹失神", "👑阿片熔断•永动绝顶"],
                d: [
                    `【🔬 神经快感蓄积与高潮后余韵】：当前核心敏感点为「${v.精神与心理扩展?.当前敏感点 || "充血微肿的阴蒂、软烂酸胀的宫颈口与敏感乳尖"}」。处于余韵回落或初始微麻状态。\n💭【${u}的实时内心感受】：“*呼……胸口发硬的乳尖和肿胀的阴蒂敏感到极点，稍微被衣服擦过一下，尾椎骨就会窜起一缕让人腿软的电流余韵……💦❤️*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：酥麻滚烫的快感电流正顺着尾椎骨一路窜向小腹与后脑，粘膜在摩擦下一缩一缩地泌出润滑爱液。\n💭【${u}的实时内心感受】：“*唔嗯……那股麻酥酥、热乎乎的快感电流又顺着脊椎骨一路往小肚子和后脑勺上窜了，腿根发酸得直打哆嗦😳💦！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：密集汹涌的快感浪潮不断拍打中枢神经！每一次刮蹭与顶弄都令全身剧烈颤抖、十根脚趾本能地紧紧蜷缩。\n💭【${u}的实时内心感受】：“*啊啊、哈啊……快感像涨潮的海水一样一波接一波往脑门上拍，爽得十根脚趾头都麻得死死蜷缩起来了🥵💦！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：快感已蓄积至决堤崩溃的临界点！小腹子宫与阴道括约肌剧烈绷紧痉挛，只要再受一丝刮蹭就会引爆灭顶绝顶！\n💭【${u}的实时内心感受】：“*要、要去了！小肚子最深处和整个阴道括约肌全都绷紧到了极限，求求你快再重重地顶最后一下，让我痛痛快快地高潮泄出来呀🥵💦❤️❤️！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：【第五阶段·连续绝顶过载】灭顶高潮如海啸般连续轰击大脑，双眼翻白、滚烫潮吹狂喷而出！\n💭【${u}的实时内心感受】：“*啊゛啊゛啊——去了去了又去了♡！！脑子轰的一声全炸成白光了，骚逼和尿道口像决堤一样噗嗤噗嗤狂喷潮吹，浑身抽搐得停不下来🥵💦❤️❤️！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：【👑 第六阶段·100%阿片受体熔断永动绝顶】全状态栏最高快感极境！大脑皮层多巴胺与内啡肽阀门已100%彻底崩毁卡死，全身神经化作永不停止的超导高潮回路，哪怕只是微风吹过乳尖或呼吸起伏，都会引发一秒十次的毁灭性全身失禁大绝顶！\n💭【${u}的实时内心感受】：“*啊゛啊゛啊嘿嘿——100%高潮停不下来了♡！！脑髓被白花花的极乐闪电彻底劈碎融化了🥵💦👑！没有呼吸的间隙、没有一秒钟不在高潮喷水，全身上下每一个细胞都在疯狂痉挛爆炸，要在永无止境的绝顶天国里活活爽死了呀❤️❤️❤️！！*”`
                ]
            },
            sta: {
                val: safeNum(v.身体?.体力, 100), rev: true,
                st: ["精力充沛•气息平稳", "微带倦意•腰腿酸软", "香汗淋漓•双腿打颤", "濒临虚脱•瘫软无力", "彻底脱力•半昏迷态", "👑休克肉泥•失神玩物"],
                d: [
                    `【🔬 肌肉耐受与体力消耗实况】：体力充沛（${safeNum(v.身体?.体力, 100)}/100），呼吸尚算平稳。\n💭【${u}的实时内心感受】：“*呼……深吸一口气，目前四肢和腰腹的力气还算充足，呼吸也已经平复下来了💦。*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：双腿内侧肌肉略微酸软发颤，小腹带着明显的坠胀倦意。\n💭【${u}的实时内心感受】：“*哈……大腿内侧和腰眼一阵阵发酸发软，小肚子也沉甸甸地往下坠😳💦。*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：体力消耗过半，全身被黏腻香汗浸透，膝盖发软打颤，连站立都需要扶着东西借力。\n💭【${u}的实时内心感受】：“*呜……全身上下像刚从水里捞出来一样全是黏腻的香汗，两条腿像筛糠一样直打哆嗦🥵💦！*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：体力濒临枯竭！高强度的连续侵犯抽干了力气，只能像没骨头一样软绵绵地瘫倒任由摆布。\n💭【${u}的实时内心感受】：“*哈啊……连抬起一根手指头或者并拢大腿的力气都彻底被榨干了，只能像一滩融化的奶油一样软绵绵地瘫在那里任人摆布了呀🥵💦❤️！*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：【第五阶段·虚脱半昏迷】全身肌肉脱力瘫痪，意识在疲惫与高潮余韵中陷入半昏迷状态！\n💭【${u}的实时内心感受】：“*唔……眼前一阵阵发黑，连眼皮都沉重得抬不起来，可下面被开发透的骚逼却还在凭着肌肉本能自动痉挛吐着白沫呢🥵💦……*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：【👑 第六阶段·体力0%彻底休克失神肉泥】全身每一丝体能已被100%压榨殆尽！四肢完全失去肌张力软垂，瞳孔翻白扩散进入深度极乐休克态，唯有被玩坏的六孔还在依靠自主神经反射自动吞吐锁精，沦为一具任由随意折叠摆弄的温热活体硅胶肉偶！\n💭【${u}的实时内心感受】：“*唔咕……体力0%……意识已经彻底飘到九霄云外去了🥵💦👑……身体完全变成一滩没有骨头的滚烫肉泥了，就算现在被人折成对折塞进行李箱里或者挂起来灌精，连哼一声的力气都没有了呀❤️❤️❤️……*”`
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

        const ovr = v.按钮详情 || {};
        const mk = (editKey, defaultRawKey, desc, themeKey = "pleas", subBarCfg = null, hideBar = false, stagePctOverride = null) => {
            const customTitle = ovr[editKey]?.customTitle;
            const customStage = ovr[editKey]?.stage;
            let finalRawKey = customTitle || defaultRawKey;
            if (!customTitle && customStage && /「[^」]+」/.test(finalRawKey)) {
                finalRawKey = finalRawKey.replace(/「[^」]+」/, `「${customStage}」`);
            }
            return { editKey, rawKey: finalRawKey, desc, ...fmtKey(finalRawKey, themeKey, subBarCfg, hideBar, stagePctOverride) };
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
        const milkCnt = safeNum(cnt.泌乳?.喷乳次数), milkMl = safeNum(cnt.泌乳?.累计毫升), mastCnt = safeNum(cnt.自慰);

        let mouthMl = safeNum(sp.口内毫升), vagMl = safeNum(sp.小穴毫升), wombMl = safeNum(sp.子宫毫升), analMl = safeNum(sp.屁眼毫升);
        if (wombMl === 0 && creampie > 0 && /内射|灌满|精液.*滴|精液.*渗|白浊/.test(live.womb + live.vag)) {
            wombMl = 15; vagMl = 8;
        }
        const totalMl = mouthMl + vagMl + wombMl + analMl;
        const caps = calcHoleCapacities(v);

        const corr = safeNum(v.核心数值?.淫乱恶堕), lust = safeNum(v.核心数值?.性欲程度), pleas = safeNum(v.精神与心理?.快感累积);
        const { mouthDev, chestDev, vagDev, wombDev, clitDev, analDev } = eco;

        const vagWidth = (1.5 + Math.min(4.8, (vagDev / 100) * 4.5)).toFixed(1);
        const vagClose = Math.max(0, Math.round(100 - vagDev * 0.88 - ((wombMl + vagMl) > 0 ? 12 : 0)));
        const clitSize = (4.0 + Math.min(10.0, (clitDev / 100) * 8.5)).toFixed(1);
        const peeVal = Math.min(100, Math.round(10 + lust * 0.35 + pleas * 0.35 + clitDev * 0.25 + leakCnt * 4));
        const wetLevel = Math.min(100, Math.round(10 + lust * 0.55 + pleas * 0.45 + ((wombMl + vagMl) > 0 ? 30 : 0)));
        const fallVal = safeNum(v.精神与心理?.沦陷度), brkVal = safeNum(v.精神与心理?.人格崩解度), hypnoVal = safeNum(extPsy.催眠深度);
        const drugVal = safeNum(v.精神与心理?.媚药精液毒瘾);
        const fallMax = Math.max(fallVal, brkVal, hypnoVal), fallTier = tier6(fallMax, false);
        const tallyStrokes = creampie + vagCnt + analCnt + mouthCnt, tallyFull = Math.floor(tallyStrokes / 5);
        const sensMult = (1.0 + corr * 0.08 + pleas * 0.05 + vagDev * 0.04).toFixed(1);

        const tallyDev = calcDampedStageScore(tallyStrokes * 0.8, corr * 0.4, diff.mult, tallyFull >= 60).val;
        const tattooDev = (mark.淫纹与刻印 && mark.淫纹与刻印 !== "无") ? Math.max(50, wombDev) : Math.round(wombDev * 0.75);
        const pierceDev = (mark.穿刺与环饰 && mark.穿刺与环饰 !== "无") ? Math.max(55, Math.round((chestDev + clitDev) * 0.6)) : Math.round((chestDev + clitDev) * 0.4);
        const propDev = (prop.体内道具 && prop.体内道具 !== "无") ? Math.max(55, Math.round((vagDev + analDev) * 0.6)) : Math.round((vagDev + analDev) * 0.4);

        const mouthStg = `${stageNameFromVal(mouthDev)}•${["洁净初唇", "唾液敏化", "深喉成瘾", "吞精肉壶", "精臭奉仕袋", "👑终极榨精口器"][tier6(mouthDev)]}`;
        const chestStg = `${stageNameFromVal(chestDev)}•${["娇嫩处乳", "乳尖充血", "揉捏变形", "乳腺打通", "母畜喷乳袋", "👑永动机母乳壶"][tier6(chestDev)]}`;
        const vagStg   = `${stageNameFromVal(vagDev)}•${["处女一线鲍", "初破微张", "充血外翻", "大开肉壶", "合不拢漏精", "👑万夫莫敌名器"][tier6(vagDev)]}`;
        const wombStg  = `${stageNameFromVal(wombDev)}•${["紧闭处子", "宫口酸软", "锁精苗床", "宫口微张", "宫口脱垂", "👑真祖受精圣杯"][tier6(wombDev)]}`;
        const clitStg  = `${stageNameFromVal(clitDev)}•${["包皮隐没", "充血勃起", "肥大酸豆", "括约肌松弛", "高潮喷尿", "👑失禁狂喷水龙头"][tier6(clitDev)]}`;
        const analStg  = `${stageNameFromVal(analDev)}•${["紧闭菊蕾", "异物适应", "肠壁软化", "后庭大开", "灌肠储精袋", "👑第二生殖腔便器"][tier6(analDev)]}`;

        const milkCap = Math.round(100 + milkCnt * 15);
        const curMilkMl = milkCnt > 0 ? Math.min(milkCap, Math.round(25 + lust * 0.8 + pleas * 0.5)) : 0;

        const fertProb = Math.min(100, safeNum(preg.受孕概率, wombMl > 0 ? Math.min(98, 65 + Math.round(wombDev * 0.3)) : (creampie > 0 ? 45 : 20)));
        const ovulStageVal = Math.min(100, Math.round(wombDev * 0.65 + lust * 0.25 + (wombMl > 0 ? 15 : 0)));
        const xrayStageVal = Math.min(100, Math.round(wombDev * 0.75 + (wombMl > 0 ? 25 : 0)));
        const dnaStageVal  = calcDampedStageScore(creampie * 1.4 + swallowCnt * 1.0 + gangCnt * 3, totalMl * 0.3, diff.mult, creampie >= 50 && totalMl >= 100).val;
        const bellySwellPct = Math.min(100, Math.round(safeNum(preg.怀孕进度) + (totalMl / Math.max(100, caps.wombMax)) * 65));
        const pregStageVal = preg.子宫怀孕 ? Math.max(70, safeNum(preg.怀孕进度)) : Math.min(99, Math.round(bellySwellPct * 0.7 + wombDev * 0.3));

        const ovulStg = `${stageNameFromVal(ovulStageVal)}•${preg.生理周期阶段 || "危险排卵期"}`;
        const xrayStg = `${stageNameFromVal(xrayStageVal)}•${["卵子待受精", "精虫游入", "精虫围攻卵子", "高危着床临界", "受精着床完成", "👑百发百中神胎"][tier6(xrayStageVal)]}`;
        const dnaStg  = `${stageNameFromVal(dnaStageVal)}•${totalMl > 0 ? `${c}浓精标记` : "无外来DNA"}`;
        const pregStg = `${stageNameFromVal(pregStageVal)}•${preg.子宫怀孕 ? "恶堕孕肚着床" : (totalMl > 0 ? "精液撑起微隆" : "平坦处子小腹")}`;
        const totalCapAll = caps.mouthMax + caps.vagMax + caps.wombMax + caps.analMax;

        const marketRank = corr >= 100 ? "👑神格级·万众公用免费肉便器" : corr >= 80 ? "SSS级·特等公用精盆" : corr >= 50 ? "A级·熟透风俗名器" : hookerCnt > 0 ? "B级·暗娼接客肉体" : "S级·纯洁无瑕处子禁脔";
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
                `【当前性癖解锁与动态难度实况】：\n当前真实身份：${realId} ｜ 当前调教难度：${diff.fullLabel}。\n当前【淫乱总账本】中的所有性交、高潮、内射、吞精、自慰与露出次数全部为 0，因此尚未开启任何后天淫乱性癖！\n💭【${u}的实时内心感受】：“*呼……摸了摸自己平坦的小腹和紧闭的双腿，还好总账次数全都是 0，我这具身体还保持着白纸一样的纯洁状态，一个下流奇怪的性癖都没有染上呢💦！不管外面的世界多么危险，一定要牢牢守住清白（也可以点击右下角✏️编辑或底部的➕新增性癖）！*”`, "pleas", null, true, 0)];

        const fallThoughts = [
            `虽然身体各处不断传来酸胀发热的信号，但我的大脑依然保持着绝对清醒💦。我清楚地知道自己是谁，哪怕肉体再怎么敏感战栗，只要核心意志不松口，就没有人能真正驯服我的灵魂！`,
            `唔……随着肉体被反复开发刺激，大脑深处时不时会涌起一阵让人懒得思考的微醺感😳💦。原本坚固的自我防线出现了一丝裂缝，有时候甚至会忍不住想——要是顺着肉体的快感沉沦下去，会不会轻松快活得多呢……❤️`,
            `哈啊……只要一闻到浓烈的雄性气息或者体会到体内被塞满的触感，脑子就会变得晕乎乎的🥵💦！什么原本的尊严矜持都好遥远，我的精神已经对男人的支配和肉棒带来的高潮产生重度依赖了，就让我当一个只用身体思考的淫荡女人吧❤️❤️！`,
            `呜汪♡……理智防线已经彻底碎成渣了，只要主人一个眼神，我的大脑就会直接停止思考、流下口水和淫水🥵💦！现在的我打心底里认为女性生来就是供雄性泄欲的家畜，快用更深的催眠把人家彻底改造成专属肉奴吧❤️❤️！`,
            `啊嘿、咕啾♡……脑子被烧坏融化了，瞳孔涣散成爱心形状，嘴角挂着痴呆的哈喇子🥵💦！常识已被改写成了『精液就是食物、被操烂就是最高幸福』的母猪逻辑，请把人家的灵魂也一起射满浓精吧❤️❤️！`,
            `啊嘿嘿、呕咕♡！！100%脑髓彻底改写完成啦🥵💦👑！原本的人格与常识已经连一丝痕迹都找不到了，现在的${u}从大脑皮层到灵魂最深处都只剩下一条铁律——『向全天下的大肉棒张开双腿、把所有浓精吞进子宫里生小崽子』，真是一辈子最幸福的洗脑天国呀❤️❤️❤️！！`
        ];

        const baseCategories = [
            {
                title: "档案与风评", icon: "👩", summary: `${u} (${realId}) · 敏感${sensMult}x · 难度${diff.name}`,
                items: [
                    mk("身份与背景", `👩 认知真名与身份：${u}「${realId}•${prop.肉体所有权 || (hookerCnt > 0 ? "恩客共有" : "自由身")}」`,
                        fmtOvr("身份与背景",
                            `【🔬 主角当前认知真名、真实身份与处境解剖】：\n当前自我认知真名：${u} ｜ 肉体所有权：${prop.肉体所有权 || (hookerCnt > 0 ? "买春恩客临时支配" : "自由身")}\n故事内真实身份/体质：${realId}（全身神经敏感度：常人的 ${sensMult} 倍 ｜ 状态栏进阶难度：${diff.fullLabel}）。\n${prof.身份与背景 || live.identity}`,
                            corr >= 60 ? `只要一听到别人叫我「${u}」或者用打量货物的眼神看我，我的骚穴就会条件反射地涌出一股热流🥵💦！现在的我已经彻底认下这个下贱身份了，快按住我这具敏感度 ${sensMult} 倍的熟透肉体尽情使用吧❤️！` : `深吸一口气感受着这具敏感度高达 ${sensMult} 倍的躯体，我现在在故事里的真实身份是「${u}」（${realId}）💦。面对眼前的 ${c} 和周围复杂的处境，我必须步步为营，千万不能露出软弱破绽啊😳！`), "corr", null, true, corr),
                    mk("肉体外貌", `🌸 肉体外貌与淫靡体态：「敏感度${sensMult}倍•${stageNameFromVal(corr)}」`,
                        fmtOvr("肉体外貌",
                            `【🔬 全身外貌特征与敏感体态实况（严格依据当前卡正文）】：\n${prof.肉体外貌实况 || live.bodyDesc}\n全身敏感倍率：常人的 ${sensMult} 倍 ｜ 体表微汗与红痕：${mark.体表痕迹 || "面颊潮红、微汗"}。`,
                            `看着镜子里或者低头映入眼帘的这具雪白躯体，皮肤细腻得连血管都隐约可见😳💦……稍微有点风吹草动就会在皮肤上激起一层鸡皮疙瘩！`), "pleas", null, true, corr),
                    mk("表里风评", `🎭 表里风评与淫乱称号：「${prof.表里风评与称号 || (corr >= 60 ? "表面人模狗样•暗地公用精盆" : "表面清白端庄•暗藏靡烂反差")}」`,
                        fmtOvr("表里风评",
                            `【🔬 表面社会形象 vs 暗地里界风评反差】：\n当前淫乱称号：【${corr >= 100 ? "👑神格化的传世公用肉便器女皇" : corr >= 80 ? "脑髓熔断的百人斩肉便器" : corr >= 50 ? "食髓知味的背德暗娼" : vagCnt > 0 ? "破瓜失守的敏感尤物" : "清冷待采的纯洁禁脔"}】\n表里反差实况：${prof.表里风评与称号 || (hookerCnt > 0 ? `在不知情的外人面前或许还维持着体面，但在熟客与风月场眼中，她早已是只要给钱就能随便内射的极品泄欲肉壶（已接客 ${hookerCnt} 次）。` : `表面维持着令人敬畏或清纯端庄的形象，无人知晓这具娇躯在私下里是何等敏感易湿、一碰即颤。`)}\n【📸 致命把柄与威胁库】：${prof.致命把柄与威胁 !== "无" ? prof.致命把柄与威胁 : (hookerCnt > 0 || vagCnt > 0 ? "肉体已被开发留痕，私密交易与身体异样随时面临曝光风险" : "尚无实质性影像把柄落入他人之手")}`,
                            `一想到自己表面的形象和私下里这副敏感发骚的反差模样，心脏就跳得快要从嗓子眼里蹦出来了😳💦！要是让外人知道我暗地里变成这样、甚至被握住致命把柄威胁的话，我一定会羞愤得当场高潮昏死过去的吧🥵❤️！`), "corr", null, true, corr),
                    mk("挂牌身价", `🏷️ 风月挂牌身价与评级：「${marketRank}」`,
                        fmtOvr("挂牌身价",
                            `【🔬 黄油风月挂牌估值与皮肉交易标准】：\n综合肉器评级：【${marketRank}】\n挂牌身价详情：${marketPrice}`,
                            hookerCnt > 0 ? `看着自己这副身体被明码标价成按次收费的泄欲工具，累计已经接待了 ${hookerCnt} 个男人💦……我已经彻底习惯靠下面这张嘴吃饭的日子了呢😳❤️。` : `我这副冰清玉洁的身体怎么能用金钱来衡量身价呢💦！可一想到那些男人恨不得倾家荡产买下我初夜的下流眼神，腿心还是忍不住一阵阵发麻啊🥵……`), "corr", null, true, corr),
                    mk("内心独白", `💬 实时内心独白（最新心声）：「抓取自当前楼层独白」`,
                        fmtOvr("内心独白",
                            `【⚡ 当前身体核心敏感带与日程规矩】：\n核心敏感带：${extPsy.当前敏感点 || "充血发硬的乳尖蓓蕾、酸胀微张的子宫颈口与敏感阴蒂"}\n当前日程/规矩：${v.调教进度?.规矩与日程 || "应对眼前局面"}。`,
                            curThought), "pleas", null, true, corr),
                    mk("当前姿势", `🧍 当前姿势与体力耐受：${staM.val}/100「${staM.stage}」`,
                        fmtOvr("当前姿势",
                            `【🔬 当前身体姿态、重心与体力消耗解剖（反向消耗指标：100%充沛 -> 0%休克）】：\n当前姿势：${curPose}\n${staM.desc.split("💭")[0]}`,
                            corr >= 60 ? `摆出这种双腿发软、腰臀微塌的下流姿势，稍微呼吸一下胸前的奶子就会乱晃，下面合不拢的骚穴还在往外漏水🥵💦！快趁着我现在体力只剩 ${staM.val}% 站不稳，直接走过来把我按倒狠狠操进来吧❤️！` : `努力想要稳住现在这个姿势，可体力消耗后发软的膝盖和酸胀的小肚子却让人重心发飘💦，越是想夹紧双腿，两腿之间的肉缝就磨蹭得越厉害啊😳🥵！`), "sta")
                ]
            },
            {
                title: "恶堕与脑改", icon: "🔥", summary: `好感${cockM.val}% · 性欲${lustM.val}% · 恶堕${corrM.val}% · 羞耻${shameM.val}%`,
                items: [
                    mk("cockLove", `💗 阳具崇拜与渴求：${cockM.val}/100「${cockM.stage}」`, cockM.desc, "cockLove"),
                    mk("lust", `🔥 强制发情与性欲：${lustM.val}/100「${lustM.stage}」`, lustM.desc, "lust"),
                    mk("corr", `🖤 淫乱恶堕深度：${corrM.val}/100「${corrM.stage}」`, corrM.desc, "corr"),
                    mk("shame", `😳 羞耻崩坏反噬：${shameM.val}/100「${shameM.stage}」`, shameM.desc, "shame"),
                    mk("obey", `🙇 雌畜奴性服从：${obeyM.val}/100「${obeyM.stage}」`, obeyM.desc, "obey"),
                    mk("pleas", `💓 快感过载与阈值：${pleasM.val}/100「${pleasM.stage}」`, pleasM.desc, "pleas"),
                    mk("精神沦陷", `🌀 催眠洗脑与常识改写：${fallMax}/100「沦陷${fallVal}%•崩解${brkVal}%•清醒${safeNum(v.精神与心理?.意识清醒度, 100)}%」`,
                        fmtOvr("精神沦陷",
                            `【🔬 深层精神防线、催眠洗脑与常识改写实况（第${fallTier + 1}阶段）】：\n精神沦陷度：${fallVal}/100 ｜ 人格崩解度：${brkVal}/100 ｜ 意识清醒度(反向)：${safeNum(v.精神与心理?.意识清醒度, 100)}/100 ｜ 催眠深度：${hypnoVal}/100。\n常识改写状态：${prop.常识改写状态 || (hypnoVal >= 50 ? "潜意识已被植入淫乱暗示，视肉体奉仕为理所当然" : "常识尚属正常")}\n巴甫洛夫触发词：${v.调教进度?.条件反射触发词 || "无"}。`,
                            fallThoughts[fallTier]), "精神沦陷"),
                    mk("媚药毒瘾", `🧪 媚药淫毒与精液成瘾：${drugVal}/100「${stageNameFromVal(drugVal)}•${drugVal >= 80 ? "断精发狂母猪" : drugVal >= 40 ? "精瘾发作" : "体液依恋"}」`,
                        fmtOvr("媚药毒瘾",
                            `【🔬 体内媚药残留浓度与雄性精液荷尔蒙成瘾度（受内射/吞精/体内储精联动驱动）】：\n当前毒瘾与精液依赖指数：${drugVal}/100 ｜ 体内药物状态：${v.调教进度?.媚药与发情毒 || "无外源强效媚药"}。\n阿嘿颜失神与语言退化度：${safeNum(v.精神与心理?.语言退化阿嘿颜)}/100（累计翻白眼吐舌失神 ${ahegaoCnt} 次）。`,
                            drugVal >= 50 ? `身体已经彻底染上男人的精液毒瘾了🥵💦！只要小肚子里和嘴里超过半天没有灌进滚烫腥臭的浓精，全身骨头缝就会像戒断反应一样发冷发痒，快喂我喝精液止瘾吧❤️❤️！` : `虽然没有被灌下奇怪的催情毒药，但这具身体本身分泌的雌性荷尔蒙就已经像春药一样让我浑身发烫发软了😳💦！`), "媚药毒瘾")
                ]
            },
            {
                title: "下流性癖库", icon: "🧬",
                summary: unlockedFetishes.length > 0 ? `已开启 ${unlockedFetishes.length} 项 (${diff.name}·6阶体系)` : `总账全0 · 暂无性癖`,
                items: fetishItems
            },
            {
                title: "六孔与储精", icon: "🌸", summary: `总储精${totalMl}ml · 1~6阶复合联动+专属体液双轨条`,
                items: [
                    mk("骚口实况", `👄 第一孔【骚口与胃袋】：${mouthDev}/100「${mouthStg}」`,
                        fmtOvr("骚口实况",
                            `【🔬 口腔开发阶位：${mouthDev}/100（${mouthStg}｜口交${mouthCnt}次·吞精${swallowCnt}次·颜射${facialCnt}次联动）】：\n【💧 胃袋实时储精】：${mouthMl}ml / 动态上限 ${caps.mouthMax}ml（历史累计吞精 ${swallowMl}ml）。\n${rt.骚口实况 || live.mouth || "唇瓣因反复吮吻而充血微肿、泛着艳红水光，舌苔粉嫩湿滑，咽喉深处在受激时会溢出娇柔喘息。"}\n${mouthMl > 0 ? `【💦 胃袋灌精】：此时口腔与胃袋内正翻涌着 ${mouthMl}ml 浓稠白浊，每一次呼吸打嗝都喷出浓烈的精臭味！` : `当前口穴与胃袋内暂存精液为 0ml。`}`,
                            mouthMl > 0 ? `呕咕、咕咚……嘴里和胃袋里全都灌满了男人射进来的 ${mouthMl}ml 滚烫浓精，黏稠白浆糊在喉咙管壁上，连打个嗝都是冲鼻子的精腥味🥵💦！可把精液咽进肚子里的时候，下面的骚逼居然跟着一起收缩高潮了呀❤️❤️！` : (mouthCnt > 0 ? `舔了舔有些发肿发麻的嘴唇，嗓子眼深处还残留着帮男人含弄粗大肉棒时的撑开感与腥咸余味💦，这张吞过 ${swallowMl}ml 精液的嘴早就记住肉棒的形状了呢😳……` : `我的嘴和喉咙现在还干干净净的，可不能随便漏出像里番女优一样的丢人娇喘声啊💦！`)),
                        "骚口实况",
                        { mainName: "🔥 口穴阶位", label: "🥛 胃袋储精", theme: "sub_semen", pct: Math.round((mouthMl / Math.max(1, caps.mouthMax)) * 100), text: `${mouthMl}/${caps.mouthMax}ml` }
                    ),
                    mk("胸部实况", `🍒 第二孔【丰乳与乳腺】：${chestDev}/100「${chestStg}」`,
                        fmtOvr("胸部实况",
                            `【🔬 丰乳开发阶位：${chestDev}/100（${chestStg}｜乳交${titCnt}次·喷乳${milkCnt}次·高潮与自慰揉胸共鸣）】：\n【🍼 乳腺实时蓄乳】：${curMilkMl}ml / 满胀容量 ${milkCap}ml（历史累计泌乳 ${milkMl}ml）。\n${rt.胸部实况 || live.chest || "两团丰满白腻的雪乳随着呼吸沉甸甸地起伏微颤，顶端两颗娇嫩乳头充血发硬，稍微刮蹭便激起酥麻电流并引发子宫共鸣收缩。"}`,
                            milkCnt > 0 ? `唔嗯♡……奶子涨得好酸好麻，只要乳头一被捏住吸吮，白花花的甜母乳就会噗嗤噗嗤地往外直喷🥵💦！快用力吸空人家的奶袋、再用这对喷奶的大乳房夹住肉棒乳交吧❤️❤️！` : `胸前这两团沉甸甸的软肉随着呼吸一颠一颠地晃荡，最顶上充血硬挺的两颗乳头被布料一蹭就过电似的发麻❤️💦，要是被粗糙大手抓着揉捏变形绝对会叫出声来的呀🥵！`),
                        "胸部实况",
                        { mainName: "🔥 淫乳阶位", label: "🍼 乳腺蓄乳", theme: "sub_milk", pct: Math.round((curMilkMl / Math.max(1, milkCap)) * 100), text: `${curMilkMl}/${milkCap}ml` }
                    ),
                    mk("小穴实况", `🌺 第三孔【骚逼阴道腔】：${vagDev}/100「${vagStg}」`,
                        fmtOvr("小穴实况",
                            `【🔬 小穴名器开发阶位：${vagDev}/100（${vagStg}｜贯穿${vagCnt}次·内射${creampie}次·自慰${mastCnt}次·潮吹${squirtCnt}次复合联动）】：\n【📉 括约肌闭合度(反向指标)】：${vagClose}%（孔径已撑开至 ${vagWidth}cm） ｜ 【💧 阴道实时储精】：${vagMl}ml / ${caps.vagMax}ml。\n${rt.小穴实况 || live.vag || (vagCnt === 0 ? "未经人事的紧致处子白虎幽谷，两瓣粉嫩花唇紧密贴合形成一线鲍，处女膜完好无损。" : `两片肥厚软嫩的阴唇因承受过 ${vagCnt} 次粗暴抽送与 ${mastCnt} 次自慰揉弄而充血外翻，肉缝湿淋淋地微张着，层叠的G点肉褶已形成贴合阳具轮廓的永久肉器记忆。`)}\n${vagMl > 0 ? `【💦 漏精与拉丝】：${vagMl}ml 滚烫白浊混杂着拉丝淫水卡在肉褶间，正顺着大腿根滴淌！` : `当前阴道浅腔内暂无大股外溢精液。`}`,
                            vagMl > 0 ? `呜……骚逼的两片花唇被干得又红又肿合不拢，里面含着的 ${vagMl}ml 滚烫浓精混着淫水，走一步路就噗嗤一声往大腿内侧淌白线🥵💦！每一层肉褶都已经被撑成了男人的形状，连精液都夹不住了呀❤️❤️！` : (vagCnt > 0 ? `两腿之间那条被贯穿开发过 ${vagCnt} 次的肉缝还火辣辣地发酸微张着，闭合度只剩 ${vagClose}% 了💦……里面空荡荡的好想再被粗硬的肉棒塞满啊🥵❤️！` : `两腿之间那条从来没被进入过的处女一线鲍，此刻却因为高度紧张和羞耻自己在肉缝里泌出了湿热春水，羞死人了啊😳💦！`)),
                        "小穴实况",
                        { mainName: "🔥 名器阶位", label: "🥛 穴内储精", theme: "sub_semen", pct: Math.round((vagMl / Math.max(1, caps.vagMax)) * 100), text: `${vagMl}/${caps.vagMax}ml` }
                    ),
                    mk("子宫实况", `🫀 第四孔【子宫颈口与苗床】：${wombDev}/100「${wombStg}」`,
                        fmtOvr("子宫实况",
                            `【🔬 子宫宫口开发阶位：${wombDev}/100（${wombStg}｜无套内射${creampie}次·小穴深顶与乳头催产素共鸣）】：\n【💧 宫腔实时储精】：${wombMl}ml / 动态上限 ${caps.wombMax}ml。\n${rt.子宫实况 || live.womb || "深藏在下腹部的子宫温暖紧致，宫颈口在反复冲击或荷尔蒙刺激下微微酸软抽搐。"}\n${wombMl > 0 ? `【💦 宫腔灌满】：${wombMl}ml 滚烫高活性浓精已冲开软烂的宫颈口灌满子宫，将小腹撑得沉甸甸地坠胀酸麻！` : `当前宫腔内暂无蓄积精液。`}`,
                            wombMl > 0 ? `小肚子好沉、好烫、好胀啊💦！足足 ${wombMl}ml 滚烫浓稠的男人精液全都射进了子宫最深处，走半步路都能感觉到精浆在肚子里晃荡、还会从软烂的宫口挤出一股白浊滴下来🥵❤️❤️！` : (creampie > 0 ? `摸着平坦微热的小腹，里面那截已经被顶开内射过 ${creampie} 次的子宫颈口还在泛着酸麻余温💦，被浓精烫习惯了的子宫苗床好想再被喂饱啊🥵❤️！` : `下腹部最深处子宫的位置不知为何一直在泛起陌生的暖意、酸溜溜地一抽一抽，真让人心慌啊💦🥵！`)),
                        "子宫实况",
                        { mainName: "🔥 宫口阶位", label: "🥛 宫腔锁精", theme: "sub_semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }
                    ),
                    mk("阴蒂尿道", `💧 第五孔【阴蒂与尿道口】：${clitDev}/100「${clitStg}」`,
                        fmtOvr("阴蒂尿道",
                            `【🔬 阴蒂与尿道开发阶位：${clitDev}/100（${clitStg}｜高潮${orgasmCnt}次·寸止${edgeCnt}次·潮吹${squirtCnt}次·失禁${leakCnt}次·自慰${mastCnt}次联动）】：\n【💦 膀胱尿意与括约肌失控度】：${peeVal}/100（阴蒂充血尺寸：${clitSize}mm）。\n${rt.阴蒂尿道实况 || "位于花唇顶端的阴蒂肉珠充血凸起，神经末梢高度敏化；下方的尿道括约肌在反复高潮或羞耻刺激下变得酸软乏力。"}`,
                            leakCnt + squirtCnt > 0 ? `最上面的阴蒂肉珠已经肿成了 ${clitSize}mm 的小酸豆，稍微碰一下就会引发全身触电，连下面的尿道口括约肌也彻底失控松弛，随时都会把骚尿和潮吹一起喷出来呀🥵💦❤️❤️！` : `两腿稍微一并拢就会刮到花唇最顶端那颗充血发烫的小肉珠，酸麻电流冲得连尿道口都一阵阵发酸发紧，千万别失控漏出来啊😳💦！`),
                        "阴蒂尿道",
                        { mainName: "🔥 敏化阶位", label: "💦 失禁尿意", theme: "sub_pee", pct: peeVal, text: `尿意 ${peeVal}%` }
                    ),
                    mk("屁眼实况", `🕳️ 第六孔【屁眼直肠腔】：${analDev}/100「${analStg}」`,
                        fmtOvr("屁眼实况",
                            `【🔬 后庭括约肌开发阶位：${analDev}/100（${analStg}｜肛交${analCnt}次·小穴薄壁挤压与轮奸联动）】：\n【📉 括约肌闭合度(反向)】：${Math.max(5, 100 - Math.round(analDev * 0.85))}% ｜ 【💧 直肠实时储精】：${analMl}ml / ${caps.analMax}ml。\n${rt.屁眼实况 || live.anal || "饱满挺翘的雪白臀瓣深处，粉嫩菊蕾紧致闭合，仅在身体紧绷或前面受激时跟着一收一缩。"}\n${analMl > 0 ? `【💦 直肠灌精】：直肠腔内正灌着 ${analMl}ml 浓稠白浊，肠壁蠕动吸收着精液水分，带来强烈的排泄坠胀感！` : `当前后庭直肠内精液为 0ml。`}`,
                            analMl > 0 ? `呜哇……连后面排泄用的屁眼和直肠都被当成储精袋灌进了 ${analMl}ml 滚烫浓精，肚子又胀又麻，直肠包裹着白浆蠕动时连屁眼都要高潮了呀🥵💦❤️❤️！` : (analCnt > 0 ? `饱满臀缝深处那朵已经被开拓过 ${analCnt} 次的菊花，现在每一次呼吸都会条件反射地微微收缩，记住了被异物塞满的酸胀快感呢😳💦！` : `两瓣丰腴屁股肉深处的粉嫩小孔因为紧张而死死地一缩一缩，刚才从前面流下来的黏腻体液把菊花周围也弄得湿漉漉的了💦……`)),
                        "屁眼实况",
                        { mainName: "🔥 后庭阶位", label: "🥛 直肠储精", theme: "sub_semen", pct: Math.round((analMl / Math.max(1, caps.analMax)) * 100), text: `${analMl}/${caps.analMax}ml` }
                    )
                ]
            },
            {
                title: "肉改与道具", icon: "⛓️", summary: `正字x${tallyFull} · 淫纹烙印 · 穿刺环饰 · 体内道具`,
                items: [
                    mk("正字涂鸦", `✍️ 分部位『正』字记账与涂鸦：${tallyDev}/100「${stageNameFromVal(tallyDev)}•${tallyFull}个正字(${tallyStrokes}划)」`,
                        fmtOvr("正字涂鸦",
                            `【🔬 黄油肉便器『正』字计数与体表耻辱涂鸦实况】：\n累计性交与内射总笔划：${tallyStrokes} 划（折合在小腹、大腿内侧与臀瓣上画下 ${tallyFull} 个完整的「正」字零 ${tallyStrokes % 5} 笔）。\n当前体表公开涂鸦字迹：${mark.公开涂鸦字迹 || (corr >= 70 ? "小腹与雪乳上方留有下流的肉便器记号" : "肌肤表面暂未被马克笔写下公开羞辱字迹")}\n体表红痕与掌印：${mark.体表痕迹 || "面颊潮红，臀腿残留指印"}（累计受虐鞭痕/掌印 ${safeNum(mark.鞭痕与掌印)} 处）。`,
                            tallyStrokes > 0 ? `如果把每一次被男人贯穿和内射都用黑笔在肚皮和大腿根画『正』字的话，我现在身上都已经画满 ${tallyFull} 个正字零 ${tallyStrokes % 5} 笔了🥵💦！看着这具布满使用记录的肉体，连我自己都觉得既下流又兴奋呀❤️！` : `雪白细腻的肚皮和大腿内侧现在还干干净净的，可不能让人用黑笔在上面写下那种『正』字和肉便器涂鸦啊😳💦！`), "正字涂鸦"),
                    mk("淫纹烙印", `🔮 奴隶烙印与发光淫纹阶位：${tattooDev}/100「${stageNameFromVal(tattooDev)}•${mark.淫纹与刻印 !== "无" ? mark.淫纹与刻印 : "未刻印状态"}」`,
                        fmtOvr("淫纹烙印",
                            `【🔬 下腹子宫淫纹与奴隶契约烙印实况（与子宫开发度 ${wombDev}% 深度共鸣）】：\n当前淫纹状态：${mark.淫纹与刻印 || "下腹平坦白腻，尚未被刻下永久催情淫纹或奴隶烙印"}\n淫纹特殊效果：当子宫内射灌满或快感过载时，淫纹部位温度骤升并自动锁紧宫颈口防止精液外流。`,
                            mark.淫纹与刻印 !== "无" ? `小肚子上的淫纹又在发烫发光了🥵💦！每次淫纹一亮起来，子宫深处就像被施了催情魔咒一样拼命收缩要吃精液，根本控制不住身体的发情本能呀❤️❤️！` : `听说一旦在小肚子上刻下那种发光的催情淫纹，就会一辈子变成离不开男人精液的发情母畜……想想就让人双腿发软啊😳💦！`), "淫纹烙印"),
                    mk("穿刺环饰", `💍 敏感带金属穿刺与环饰：${pierceDev}/100「${stageNameFromVal(pierceDev)}•${mark.穿刺与环饰 !== "无" ? mark.穿刺与环饰 : "尚未穿刺打环"}」`,
                        fmtOvr("穿刺环饰",
                            `【🔬 乳头、阴蒂、舌尖与肚脐金属穿刺环实况（与丰乳 ${chestDev}% / 阴蒂 ${clitDev}% 联动）】：\n当前穿刺环饰：${mark.穿刺与环饰 || "全身敏感肉珠尚保持天然无穿刺状态，未被打上乳环、阴蒂环或母畜鼻环/舌环"}\n摩擦刺激度：若穿戴金属环饰，每一次呼吸与迈步晃动都会直接拉扯敏感神经末梢，带来24小时不间断的电流调教。`,
                            mark.穿刺与环饰 !== "无" ? `穿在最敏感嫩肉上的金属环冰凉又沉重，每走一步路都会拽着乳头和阴蒂一晃一晃地过电发麻🥵💦！这种24小时都被迫处于发情状态的改造实在太色情了呀❤️❤️！` : `我这两颗充血发硬的乳尖和肿胀的小阴蒂本来就已经敏感到极点了，要是再被人穿透打上金属乳环和阴蒂环的话，走一步路都会当场高潮喷水的吧😳💦！`), "pleas"),
                    mk("体内道具", `🎛️ 体内常驻道具与贞操带权限：${propDev}/100「道具:${prop.体内道具 || "无"}•权限:${prop.排泄与高潮权限 || "自主"}」`,
                        fmtOvr("体内道具",
                            `【🔬 体内常驻塞入道具、束缚具与高潮排泄权限（与小穴 ${vagDev}% / 后庭 ${analDev}% 联动）】：\n当前体内塞入物：${prop.体内道具 || "无体内常驻跳蛋、肛塞或榨精拉珠"}\n当前身体束缚状态：${prop.束缚状态 || "四肢自由未受捆绑"}\n高潮与排泄控制权：${prop.排泄与高潮权限 || "尚可自主控制（未被贞操带或催眠指令彻底封锁）"}。`,
                            prop.体内道具 && prop.体内道具 !== "无" ? `救命……身体里面还死死塞着「${prop.体内道具}」，每动一下都在最敏感的肉壁上震动摩擦，连什么时候能高潮、什么时候能去厕所全都被别人捏在手里了呀🥵💦❤️❤️！` : `还好现在身体里面没有被塞进那种嗡嗡震动的跳蛋或者肛塞，不然顶着一肚子道具在外面走动真的会当场社死的💦！`), "obey")
                ]
            },
            {
                title: "从头到脚穿搭", icon: "👗", summary: `从头到脚8部位战损穿搭拆解 · 状态:${wearStateTag}`,
                items: [
                    mk("穿搭_头饰", `👑 1.【头饰·发丝·面容】「${wearStateTag}•${headTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_头饰",
                            `【🔬 头部发丝、面容神态与唇角涎液实况（受口穴阶位 ${mouthDev}% 与体液泥泞度 ${wetLevel}% 联动）】：\n当前穿戴与状态：${headTxt}。\n发丝因情动汗水浸润而略显凌乱地贴在白皙面颊与耳廓旁，双颊泛着退不去的桃花春色，水润红唇微微开启喘息。`,
                            `散落的发丝被热汗浸湿贴在滚烫的脸颊和耳根上，连呼出来的每一口气都烫得吓人💦。泛着水雾的眼睛和微微发抖的红唇把心里的慌乱和动情出卖得一干二净，要是现在被人揪住头发强吻深喉，肯定一秒钟都撑不住就会软倒吧😳🥵！`), "pleas", null, true, wetLevel),
                    mk("穿搭_颈部", `⛓️ 2.【颈部·锁骨·项圈】「${wearStateTag}•${neckTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_颈部",
                            `【🔬 脖颈、锁骨凹陷与吻痕/项圈实况（受服从度 ${obeyM.val}% 联动）】：\n当前穿戴与状态：${neckTxt}。\n修长白皙的雪颈与精致凹陷的锁骨窝随着急促呼吸剧烈起伏，锁骨凹槽处积着晶莹细汗。`,
                            corr >= 60 ? `脖子和锁骨上的皮肤烫得要命，上面留着的吻痕和红印只要一被风吹到就会激起酥麻电流🥵💦！这么脆弱白皙的脖子，真想戴上专属母狗项圈和铃铛被牵着走呀❤️❤️！` : `修长的脖颈和锁骨窝里渗出了一层薄薄的细汗，当热气喷洒在耳根和锁骨上时，整条脊椎骨都会跟着一起发麻发软💦！`), "obey", null, true, obeyM.val),
                    mk("穿搭_胸罩", `👙 3.【内衣·胸罩·凸点】「${wearStateTag}•${braTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_胸罩",
                            `【🔬 胸罩/裹胸穿戴、真空乳肉垂挂与凸点摩擦实况（受丰乳开发度 ${chestDev}% 联动）】：\n当前穿戴与状态：${braTxt}。\n两团饱满软腻的雪乳随着呼吸与动作沉甸甸地起伏微颤，顶端两颗充血发硬的乳头将布料顶出清晰的凸点颗粒，每一次刮蹭都直击乳腺深处！`,
                            `胸前这两团沉甸甸的软肉稍微一动就会跟着乱晃，最顶上充血发硬的两颗乳头死死顶着衣服布料，每摩擦一下都像过电一样又麻又痒❤️💦！真想让人直接把手伸进来用力揉捏吸吮发烫的乳尖呀🥵！`), "胸部实况", null, true, chestDev),
                    mk("穿搭_上衣", `👚 4.【外装上衣·束腰】「${wearStateTag}•${topTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_上衣",
                            `【🔬 外装上衣款式、腰部曲线与领口下摆实况】：\n当前穿戴与状态：${topTxt}。\n上衣包裹着饱满胸脯与纤细腰肢，勾勒出惊心动魄的胸腰臀曲线，领口或下摆处随时面临走光失守的风险。`,
                            `身上的上衣已经被体温和微汗烘得热乎乎的，稍微弯个腰或者抬个手，松垮的领口和下摆就会露出一大片雪白的春光😳💦！要是被人从后面直接把手伸进下摆里摸上来，一定会当场腿软的吧🥵！`), "pleas", null, true, wetLevel),
                    mk("穿搭_内裤", `🩲 5.【贴身内裤·漏精】「${wearStateTag}•${pantyTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_内裤",
                            `【🔬 内裤底裤位置、真空阴阜与爱液白浊浸湿实况（受小穴开发度 ${vagDev}% 与漏精量联动）】：\n当前穿戴与状态：${pantyTxt}（下体泥泞湿润度：${wetLevel}%）。\n私密处的两瓣花唇与敏感阴蒂正处于充血湿润状态，分泌出的滑腻爱液或残留的乳白精浆令腿心一片泥泞。`,
                            `两腿之间最私密的地方现在湿滑泥泞得一塌糊涂，不管是贴身底裤勒进肉缝里的摩擦、还是真空状态下冷空气直接吹在红肿阴唇上的触感，都刺激得我尾椎骨直发麻，里面的水根本夹不住了呀🥵💦❤️！`), "小穴实况", null, true, Math.max(vagDev, wetLevel)),
                    mk("穿搭_下装", `🍑 6.【下装裙裤·臀浪】「${wearStateTag}•${botTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_下装",
                            `【🔬 下装穿戴、蜜桃臀浪与走光受虐实况】：\n当前穿戴与状态：${botTxt}。\n丰腴挺翘的蜜桃臀肉随着步伐或呼吸荡起诱人的臀浪弧度，稍微掀起或弯腰便会彻底暴露私密禁区。`,
                            `丰满紧实的屁股蛋随着动作一颤一颤的，稍微弯下腰就能感觉到后面凉飕飕的毫无安全感💦。真怕下一秒就会有人从背后直接掀开下摆按住我的腰臀，一边抽打屁股蛋一边后入插进来呀😳🥵！`), "屁眼实况", null, true, Math.max(analDev, wetLevel)),
                    mk("穿搭_丝袜", `🧦 7.【丝袜·美腿·滑落】「${wearStateTag}•${sockTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_丝袜",
                            `【🔬 丝袜/裸腿状态、大腿根摩挲与体液挂壁实况】：\n当前穿戴与状态：${sockTxt}。\n一双修长笔直、白皙匀称的美腿微微内扣并拢，大腿根内侧最娇嫩的皮肤相互摩挲，从私处溢出的黏腻体液正顺着大腿内侧拉出白线缓缓下滑。`,
                            `两条修长的大腿现在又酸又软直打哆嗦，从骚穴里漏出来的温热粘液正顺着大腿内侧最嫩的肉一路往下滑🥵💦！要是这双美腿被人直接扛在肩膀上掰成M字型狂操的话，一定会被顶到最深处的吧❤️❤️！`), "pleas", null, true, wetLevel),
                    mk("穿搭_鞋子", `👠 8.【鞋子·玉足·蜷缩】「${wearStateTag}•${shoeTxt.slice(0, 14)}」`,
                        fmtOvr("穿搭_鞋子",
                            `【🔬 鞋履款式、纤细足弓与脚趾快感蜷缩实况（足交 ${footCnt} 次联动）】：\n当前穿戴与状态：${shoeTxt}。\n纤细白嫩、足背弧度优美的玉足包裹在鞋履之中，十根粉嫩脚趾正因为体内流窜的酥麻电流而本能地紧紧蜷缩，足心沁出薄汗。`,
                            `每当小肚子和下面窜起酸麻电流的时候，我的十根脚趾头就会不受控制地死死蜷缩起来，连脚心都出了一层细汗💦！甚至刚才站起来的时候还有一滴白浊直接滴在了脚背上，真是从头脏到脚了啊😳🥵！`), "pleas", null, true, wetLevel)
                ]
            },
            {
                title: "苗床与受孕", icon: "🤰", summary: `${preg.生理周期阶段 || "危险排卵期"} · 受孕率${fertProb}% · 断面双轨直播`,
                items: [
                    mk("排卵周期", `🥚 生理周期与危险排卵警报：${ovulStageVal}/100「${ovulStg}」`,
                        fmtOvr("排卵周期",
                            `【🔬 卵巢排卵催情阶位：${ovulStageVal}/100（${ovulStg}｜受子宫开发度 ${wombDev}% 与发情度 ${lust}% 联动）】：\n【🎯 无套内射单发受孕率】：${fertProb}% ｜ 卵子状态：${preg.卵子状态 || "饱满熟透卵子已排出，正停留在输卵管等待受精"}。`,
                            `偏偏在最容易怀孕中招的【${preg.生理周期阶段 || "危险排卵期"}】遇到这种事💦！卵巢里那颗熟透的卵子正在散发着催情荷尔蒙，要是在这个时候被无套内射灌满子宫的话，绝对会一发中招怀上小宝宝的吧😳🥵！`),
                        "lust",
                        { mainName: "🔥 排卵阶位", label: "🎯 受孕概率", theme: "lust", pct: fertProb, text: `中招率 ${fertProb}%` }
                    ),
                    mk("受精断面", `🔬 精虫围攻卵子X光断面：${xrayStageVal}/100「${xrayStg}」`,
                        fmtOvr("受精断面",
                            `【🔬 苗床受精断面阶位：${xrayStageVal}/100（${xrayStg}｜累计内射 ${creampie} 次）】：\n【💧 宫腔浓精充盈度】：${wombMl}ml / 上限 ${caps.wombMax}ml。\n断面实况：${wombMl > 0 ? `软烂微张的宫颈口已被彻底射穿！${wombMl}ml 滚烫浓稠的高活性精浆正填满整个子宫腔，X光断面下可见数以亿计的雄性精虫正疯狂摆尾，将那颗毫无防备的熟透卵子团团围住、争先恐后地撞击卵子薄膜试图完成受精着床！` : `当前子宫腔内尚无活性精虫涌入，但熟透的卵子与微张的宫口正处于极度容易受精的高危状态。`}`,
                            wombMl > 0 ? `清晰地感觉到肚子里那 ${wombMl}ml 滚烫浓精正在子宫内壁里四处乱窜🥵💦！成千上万条精虫现在肯定已经把我的卵子团团围住往里面钻了，子宫口还在自己一缩一缩地把精液往深处吸，真的要受精怀孕了呀❤️❤️！` : `小肚子深处的子宫苗床空落落地一抽一抽💦，仿佛里面的卵子正在饥渴地呼唤着滚烫浓精冲进来把她灌满受精一样……太下流了啊🥵！`),
                        "子宫实况",
                        { mainName: "🔥 断面阶位", label: "🥛 精虫密度", theme: "sub_semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }
                    ),
                    mk("精液归属", `🧬 宫内精液DNA混杂归属：${dnaStageVal}/100「${dnaStg}」`,
                        fmtOvr("精液归属",
                            `【🔬 基因染透与标记阶位：${dnaStageVal}/100（${dnaStg}）】：\n【💧 四穴当前总储精】：${totalMl}ml（口胃 ${mouthMl}ml / 阴道 ${vagMl}ml / 子宫 ${wombMl}ml / 直肠 ${analMl}ml）。\n精液归属明细：${totalMl > 0 ? (preg.宫内精液归属 !== "无" ? preg.宫内精液归属 : `主要为刚刚由【${c}】无套射入的高浓度精液（累计已承受 ${creampie} 次内射）`) : "当前四穴内暂无外来雄性精液残留"}。`,
                            totalMl > 0 ? `肚子里满满当当全是男人射进来的遗传基因和浓精🥵💦，连子宫内壁都被这股霸道的雄性气息彻底染透标记了，要是怀上了都赖不掉呀❤️！` : `现在身体里面还没有留下任何男人的精液DNA，可得小心守住自己的子宫苗床才行💦！`),
                        "媚药毒瘾",
                        { mainName: "🔥 染透阶位", label: "🥛 四穴总精", theme: "sub_semen", pct: Math.round((totalMl / Math.max(1, totalCapAll)) * 100), text: `合计 ${totalMl}ml` }
                    ),
                    mk("孕肚进度", `🤰 恶堕孕肚与产卵苗床进度：${pregStageVal}/100「${pregStg}」`,
                        fmtOvr("孕肚进度",
                            `【🔬 母体孕育与苗床阶位：${pregStageVal}/100（${pregStg}｜历史产卵 ${safeNum(preg.生产产卵次数)} 次）】：\n【🤰 小腹隆起充盈度】：${bellySwellPct}%（受孕状态：${preg.子宫怀孕 ? `已着床 ${safeNum(preg.怀孕进度)}%` : `未着床，因蓄精 ${totalMl}ml 微隆`}）。`,
                            preg.子宫怀孕 ? `摸着自己已经怀上种的小肚子，里面正在孕育着男人的骨肉，而我就算挺着孕肚也还是想被大肉棒继续粗暴地插进来内射呀🥵💦❤️❤️！` : `刚才被射进肚子里的精液把平坦的小腹都撑得微微鼓起弧度了💦，按一按还会咕啾咕啾地响，简直像已经怀上了一样羞人啊😳🥵！`),
                        "corr",
                        { mainName: "🔥 苗床阶位", label: "🤰 腹围隆起", theme: "sub_semen", pct: bellySwellPct, text: `隆起 ${bellySwellPct}%` }
                    )
                ]
            },
            {
                title: "淫乱总账本", icon: "💎", summary: `破瓜纪念 · 小穴${vagCnt} · 内射${creampie} · 接客${hookerCnt}`,
                items: [
                    mk("破瓜纪念", `🥀 初夜破瓜耻辱纪念碑：「${vagCnt === 0 ? "🌸处女膜完好无损" : (mark.初夜破瓜纪念 && !mark.初夜破瓜纪念.includes("完好") ? mark.初夜破瓜纪念.slice(0, 18) : `🌺已破瓜失身(累计${vagCnt}次)`)}」`,
                        fmtOvr("破瓜纪念",
                            `【🔬 处女膜状态与初夜破瓜黑历史档案】：\n当前处女状态：${vagCnt === 0 ? "处女膜完好无损，花唇紧闭，尚未被任何雄性阳具破瓜夺走初夜" : (mark.初夜破瓜纪念 && !mark.初夜破瓜纪念.includes("完好") ? mark.初夜破瓜纪念 : `处女膜早已在粗暴的贯穿中彻底撕裂消失，目前已累计承受小穴贯穿 ${vagCnt} 次、内射 ${creampie} 次`)}。`,
                            vagCnt === 0 ? `我的第一次现在还完好无损地保留着呢💦！这层最珍贵的处女膜到底会在什么时候、被哪个男人用什么样粗暴或羞耻的姿势捅破落红呢……光是想想腿心就忍不住发麻了😳🥵！` : `最初破瓜时处女膜被强行撕裂捅穿的剧痛与滚烫感，现在回想起来依然刻骨铭心💦……从失去初夜的那一刻起，我这具身体就走上彻底沦为男人玩物的下坡路了吧🥵❤️！`), "pleas", null, true),
                    mk("六孔总账", `💎 六孔性交贯穿总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${titCnt}／足${footCnt}」`,
                        fmtOvr("六孔总账",
                            `【🔬 各孔穴历史开发累计次数（结合 ${diff.name} 难度系数与 80/20 阻尼锁驱动全状态栏 1~6 阶段进化）】：\n骚逼贯穿：${vagCnt} 次 ｜ 骚口深喉：${mouthCnt} 次 ｜ 屁眼后庭：${analCnt} 次 ｜ 丰乳夹击：${titCnt} 次 ｜ 玉足摩擦：${footCnt} 次 ｜ 异种交合：${beastCnt} 次。`,
                            (vagCnt + mouthCnt + analCnt) === 0 ? `目前所有性交次数全都是 0，从嘴唇到小穴还没有被男人的脏东西捅穿过💦！` : `看着小穴贯穿 ${vagCnt} 次、口交 ${mouthCnt} 次这串触目惊心的开发数字，我的身体早就从里到外变成男人的形状了，那就让这串数字继续往上涨吧🥵💦❤️！`), "pleas", null, true),
                    mk("高潮总账", `💎 高潮泄身与失禁总账：「高潮${orgasmCnt}／强制${forceOrgCnt}／寸止${edgeCnt}／喷潮${squirtCnt}／失禁${leakCnt}／自慰${mastCnt}」`,
                        fmtOvr("高潮总账",
                            `【🔬 高潮绝顶、寸止折磨、自慰与排泄失控累计记录】：\n累计绝顶高潮：${orgasmCnt} 次（其中违背意志的强制高潮 ${forceOrgCnt} 次，寸止折磨 ${edgeCnt} 次）\n潮吹狂喷：${squirtCnt} 次 ｜ 羞耻漏尿失禁：${leakCnt} 次 ｜ 阿嘿颜失神：${ahegaoCnt} 次 ｜ 私下自慰：${mastCnt} 次。`,
                            orgasmCnt > 0 ? `一看到累计高潮 ${orgasmCnt} 次的记录，阴道括约肌和尿道口就条件反射地发麻抽搐💦！在男人粗暴的顶弄面前，我这具一碰就去的敏感身体根本忍住不泄身呀🥵❤️！` : `虽然目前高潮和失禁计数器还是 0，但敏感度高达 ${sensMult} 倍的身体要是真被人按住弱点欺负，怕不是会当场丢脸地喷水高潮出来啊😳💦！`), "pleas", null, true),
                    mk("射精总账", `💎 射精灌注与喷乳总账：「内射${creampie}次／颜射${facialCnt}次／吞精${swallowCnt}次(${swallowMl}ml)／喷乳${milkMl}ml」`,
                        fmtOvr("射精总账",
                            `【🔬 雄性精液灌注、吞咽与母乳分泌累计记录】：\n子宫无套内射：${creampie} 次 ｜ 颜射与体外涂抹：${facialCnt} 次\n骚口吞精：${swallowCnt} 次（累计吞咽浓精 ${swallowMl}ml） ｜ 乳腺改造喷乳：${milkCnt} 次（累计泌乳 ${milkMl}ml）。`,
                            (creampie + swallowCnt) === 0 ? `到现在为止身体内部还没有被注入过任何一滴雄性精液，一定要守住最后的防线😳💦！` : `子宫已经被滚烫的浓精内射浇灌了 ${creampie} 次，胃袋也吞下了 ${swallowMl}ml 白浊，全身上下早就已经被男人的精液彻底腌入味了呀🥵💦❤️！`), "pleas", null, true),
                    mk("露出总账", `💎 卖身接客·轮奸·睡奸总账：「接客${hookerCnt}次／轮奸${gangCnt}次／睡奸${sleepCnt}次／露出${safeNum(cnt.暴露?.露出)}次」`,
                        fmtOvr("露出总账",
                            `【🔬 风月皮肉交易、多人轮奸、无防备睡奸与公开羞辱总账】：\n风尘接客卖身：${hookerCnt} 次 ｜ 被外借共享：${safeNum(cnt.交易?.被外借共享)} 次\n多人轮奸群交：${gangCnt} 次 ｜ 睡眠/昏迷无防备奸：${sleepCnt} 次\n当众赤裸露出：${safeNum(cnt.暴露?.露出)} 次（被围观 ${safeNum(cnt.暴露?.被围观人次)} 人次，被拍照留影 ${safeNum(cnt.暴露?.被拍摄留影)} 次）。`,
                            (safeNum(cnt.暴露?.露出) + hookerCnt + gangCnt + sleepCnt) > 0 ? `看着累计接客卖身 ${hookerCnt} 次的记录，送走一个恩客擦干净精液再张开双腿迎接下一个男人，现在的我已经被彻底锤炼成一件合格的泄欲商品了呢🥵💦❤️！` : `一想到当众露出、被人围观拍照甚至像妓女一样接客轮奸的字眼，全身皮肤都会起一层鸡皮疙瘩，心脏跳得好快啊😳💦！`), "pleas", null, true)
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

请根据下方【角色设定】、【当前已存变量】以及【最新故事楼层正文】，全面更新主角的所有状态数值、文中的真实认知名字、故事内真实身份/体质、表里风评与把柄、风月挂牌身价、排卵期状态、1~6阶段性癖列表、从头到脚8个部位的色情穿搭详情，以及全部按钮的黄油级重口解剖描述与**单段式自然流畅的第一人称实时心声**！
⚠️ 铁律：
1. **单段式自然长心声铁律**：每一个按钮的 "thought" 字段必须写成 **100~140字** 自然连贯、融为一体的第一人称带❤️💦🥵内心独白！
2. **真实身份与难度解耦铁律**：主角在故事中的真实身份/体质是【${realId}】（严禁把主角乱写成魅魔，除非原文设定她是魅魔）！当前状态栏调教难度系数为【${diff.mult}x】，所有数值必须严格贴合【当前累计性交总账次数】循序渐进！
3. 字符串内部如需引用，只能使用中文单引号「」或『』，严禁在 JSON 字符串值内部出现英文双引号 " 或换行符！

【角色设定】：当前识别主角名：${u} ｜ 真实身份：${realId} ｜ 难度系数：${diff.mult}x ｜ 互动对象：${c} ｜ 设定：${personaDesc || charDesc || "见正文"}
【当前统计参考】：小穴${safeNum(curVars.计数?.性交?.小穴)}次, 口${safeNum(curVars.计数?.性交?.口)}次, 屁眼${safeNum(curVars.计数?.性交?.屁眼)}次, 内射${safeNum(curVars.计数?.射精?.内射)}次, 高潮${safeNum(curVars.计数?.高潮?.总数)}次, 自慰${safeNum(curVars.计数?.自慰)}次, 接客${safeNum(curVars.计数?.交易?.接客卖身)}次 ｜ 当前性癖：${curFetishes}

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
  "按钮详情": {
    "身份与背景": { "stage": "4字概括", "desc": "主角当前真实身份与眼前处境详写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "肉体外貌": { "stage": "4字概括", "desc": "严格依据正文的主角容颜、胸臀身材与敏感度详写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "表里风评": { "stage": "4字概括", "desc": "表面社会形象、暗地淫乱风评与把柄威胁详写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "挂牌身价": { "stage": "4字概括", "desc": "肉器评级、挂牌身价与身材资本详写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "内心独白": { "thought": "130~160字主角当下最核心的单段连贯第一人称心理独白" },
    "当前姿势": { "desc": "当前肢体动作、身体曲线与走动漏精细节详写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "cockLove": { "stage": "4字阶段", "desc": "对男性肉棒的粘膜记忆与心理反应(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "lust": { "stage": "4字阶段", "desc": "体内情欲燥热、乳尖充血与淫水反应(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "corr": { "stage": "4字阶段", "desc": "道德矜持防线与风尘/恶堕进度(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "shame": { "stage": "4字阶段", "desc": "羞耻心钝化或反噬实况(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "obey": { "stage": "4字阶段", "desc": "顺从迎合度与条件反射实况(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "pleas": { "stage": "4字阶段", "desc": "高潮余韵断瘾空虚或敏感带过电蓄积(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "精神沦陷": { "desc": "精神防线、催眠洗脑、常识改写与清醒度实况(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "媚药毒瘾": { "desc": "体内媚药残留与精液荷尔蒙成瘾戒断实况(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "骚口实况": { "desc": "唇瓣微肿、香舌、咽喉深喉记忆与口胃储精专属解剖描写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "胸部实况": { "desc": "双乳罩杯、乳肉垂挂微颤、乳头充血硬挺与乳腺泌乳专属解剖描写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "小穴实况": { "desc": "阴唇红肿外翻、闭合不全、阴道内壁泥泞与白浊拉丝专属解剖描写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "子宫实况": { "desc": "子宫颈口软烂微张、宫口脱垂与宫腔储精专属描写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "阴蒂尿道": { "desc": "阴蒂充血凸起、寸止折磨、尿道括约肌与排尿冲精专属描写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "屁眼实况": { "desc": "丰腴臀瓣掌印、臀缝肛门微红与直肠储精专属描写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "正字涂鸦": { "desc": "分部位正字记账、耻辱涂鸦字迹与受虐红痕详写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "淫纹烙印": { "desc": "下腹淫纹阶位、发光发热与催情锁精效果详写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "穿刺环饰": { "desc": "乳环、阴蒂环等金属穿刺拉扯敏感带详写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "体内道具": { "desc": "体内常驻塞入道具、束缚状态与排泄高潮权限详写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "穿搭_头饰": { "stage": "当前头部/发丝概括", "desc": "发型、汗湿发丝、脸颊潮红与唇角涎水色情描写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "穿搭_颈部": { "stage": "当前颈部/锁骨概括", "desc": "雪颈、锁骨凹陷薄汗、香肩红痕或项圈描写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "穿搭_胸罩": { "stage": "当前胸罩/真空概括", "desc": "真空无内衣或胸罩包裹、乳肉起伏与硬挺乳头顶起布料描写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "穿搭_上衣": { "stage": "当前上衣概括", "desc": "上衣款式、领口松垮歪斜与下摆走光描写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "穿搭_内裤": { "stage": "当前内裤/真空概括", "desc": "真空光裸或底裤浸湿、纸团按压阴唇吸精描写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "穿搭_下装": { "stage": "当前下装/裸臀概括", "desc": "无下装光裸或裙裤包裹、臀肉掌印若隐若现描写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "穿搭_丝袜": { "stage": "当前美腿/精斑概括", "desc": "修长裸腿或丝袜、大腿根内侧指痕与浓精滑落白线描写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "穿搭_鞋子": { "stage": "当前鞋子/玉足概括", "desc": "鞋履款式、纤细足背、脚趾微蜷与脚面滴落精斑描写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "排卵周期": { "desc": "当前排卵期状态、卵子成熟度与无套受孕风险详写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "受精断面": { "desc": "子宫X光断面下精虫围攻卵子或空虚待受精实况详写(100字以上)", "thought": "100~130字单段自然第一人称心声" },
    "精液归属": { "desc": "当前体内残留精液的DNA来源与混杂度详写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "孕肚进度": { "desc": "受孕着床进度、小腹被精液撑起弧度与产卵记录详写(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "破瓜纪念": { "desc": "初夜破瓜夺取者、场景与处女膜状态总结(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "六孔总账": { "desc": "各孔穴开发累计次数与身体形状记忆总结(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "高潮总账": { "desc": "高潮泄身、寸止与潮吹失禁记录总结(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "射精总账": { "desc": "子宫内射、吞精与喷乳承受记录总结(90字以上)", "thought": "100~130字单段自然第一人称心声" },
    "露出总账": { "desc": "风尘接客卖身、轮奸、睡奸与当众露出记录总结(90字以上)", "thought": "100~130字单段自然第一人称心声" }
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
            console.warn("[状态栏 1.0 JSON Repair Failed]:", e3);
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

            if (Array.isArray(data.性癖列表)) {
                const newItems = [];
                v.性癖详情 = v.性癖详情 || {};
                const diff = getDifficultyProfile();
                const c = v.计数 || {};
                const totalCnt = safeNum(c.性交?.小穴) + safeNum(c.性交?.口) + safeNum(c.射精?.内射) + safeNum(c.交易?.接客卖身);
                const maxCap = calcDampedStageScore(totalCnt * 0.6, safeNum(v.核心数值?.淫乱恶堕) * 0.3, diff.mult, totalCnt >= 300 * diff.mult).val;

                data.性癖列表.forEach(item => {
                    if (!item || !item.name) return;
                    const nm = safeStr(item.name).trim();
                    let num = Math.max(1, Math.min(100, safeNum(item.val, 20)));
                    if (totalCnt > 0 && num > maxCap + 12) num = Math.min(num, maxCap + 8);
                    const stg = stageNameFromVal(num);
                    const orig = safeStr(item.origin, "调教与开发形成").trim();
                    newItems.push(`${nm}-${orig}-${stg}-${num}/100`);
                    v.性癖详情[nm] = {
                        origin: orig, val: num, stage: stg,
                        desc: safeStr(item.desc),
                        thought: cleanThoughtText(item.thought)
                    };
                });
                if (newItems.length > 0) v.性癖.条目 = newItems;
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
            showToast(`✅ ${sourceLabel}全量重绘成功！主角【${latestStatus.charName}】全部8大板块已刷新！`, "success", 4000);
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
        showToast(`⏳ 正在通过副 API 为【${u}】全量重绘8大模块...`, "info", 5000);
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

    // 4. 支持 1~6 阶段图片自动匹配的候选加载引擎（若未放 _6 图，自动回退使用 _5 图！）
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
        const stageKey = `${item.editKey}_${stageNum}`;

        // 1. 优先查询通过 ZIP / 多图导入进 IndexedDB 的持久 DataURL（从当前阶段向下兼容回退）
        for (let s = stageNum; s >= 1; s--) {
            const hit = queryImportedImage(`${item.editKey}_${s}`);
            if (hit && !candidates.includes(hit)) candidates.push(hit);
        }
        const hitGeneral = queryImportedImage(item.editKey);
        if (hitGeneral && !candidates.includes(hitGeneral)) candidates.push(hitGeneral);

        // 2. 读取顶部 DEFAULT_STAGE_IMAGES 配置表
        const presetArr = DEFAULT_STAGE_IMAGES[item.editKey];
        if (Array.isArray(presetArr) && presetArr[stageIdx]) {
            const entry = safeStr(presetArr[stageIdx]).trim();
            const hitPreset = queryImportedImage(entry);
            if (hitPreset && !candidates.includes(hitPreset)) candidates.push(hitPreset);

            if (entry.startsWith("http") || entry.startsWith("data:") || entry.startsWith("/")) {
                candidates.push(entry);
            } else if (/\.(?:webp|png|gif|jpg|jpeg)$/i.test(entry)) {
                candidates.push(`${baseFolder}/${entry}`);
            } else if (entry) {
                candidates.push(
                    `${baseFolder}/${entry}.webp`,
                    `${baseFolder}/${entry}.png`,
                    `${baseFolder}/${entry}.gif`,
                    `${baseFolder}/${entry}.jpg`
                );
            }
        }

        // 3. 兜底匹配插件目录 images/（若处于第6阶段但用户只准备了1~5阶图，自动向下回退读取 _5 图）
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
            <div id="st-v25-img-container" title="点击全屏放大查看" class="${curStageIdx === 6 ? "st-stage6-badge" : ""}" style="display:none;margin-bottom:10px;position:relative;border-radius:12px;overflow:hidden;border:1.5px solid #f38ba8;background:radial-gradient(circle,#1e152a,#0d0914);box-shadow:0 6px 20px rgba(0,0,0,0.65);justify-content:center;align-items:center;cursor:zoom-in;">
                <img id="st-v25-stage-img" alt="阶段状态图" style="max-width:100%;max-height:240px;object-fit:contain;display:block;margin:0 auto;">
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
            <div id="st-v25-item-editor" style="display:none;margin-top:12px;padding:12px;background:rgba(15,12,26,0.95);border:1.5px dashed #f9e2af;border-radius:10px;flex-direction:column;gap:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <b style="color:#f9e2af;font-size:12px;">✏️ 修改内容与配图 (当前第${curStageIdx}阶段图名: ${item.editKey || "custom"}_${curStageIdx})</b>
                    ${item.isCustom ? `<button id="st-v25-del-custom" type="button" style="background:rgba(220,38,38,0.3);color:#fca5a5;border:1px solid #ef4444;border-radius:6px;padding:2px 8px;font-size:11.5px;cursor:pointer;font-weight:bold;">🗑️ 删除此项</button>` : ""}
                </div>
                <input id="st-v25-ed-title" type="text" value="${safeStr(item.rawKey).replace(/"/g, "&quot;")}" placeholder="按钮完整标题（支持带 50/100 和「状态标签」）" style="background:#11111b;color:#f9e2af;border:1px solid rgba(255,255,255,0.25);border-radius:6px;padding:6px 8px;font-size:12.5px;font-weight:bold;">
                <input id="st-v25-ed-img" type="text" value="${savedManualUrl.replace(/"/g, "&quot;")}" placeholder="🖼️ 手动指定图片 URL 或图名（留空则自动按阶段匹配 ${item.editKey || "项"}_${curStageIdx}）" style="background:#11111b;color:#a6e3a1;border:1px solid rgba(166,227,161,0.45);border-radius:6px;padding:6px 8px;font-size:12px;">
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
                <input id="st-v25-new-title" type="text" placeholder="按钮名称（例如：💍 阴蒂震动贞操环 或 🧬 恋足舔鞋癖）" style="background:#11111b;color:#f9e2af;border:1px solid #f38ba8;border-radius:7px;padding:7px 10px;font-size:13px;font-weight:bold;">
                <div style="display:flex;gap:8px;">
                    <input id="st-v25-new-ratio" type="text" placeholder="进度数值（可选，如 65/100 或 30/100ml）" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:6px 8px;font-size:12px;">
                    <input id="st-v25-new-stage" type="text" placeholder="右侧徽章标签（可选，如 强制发情中）" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:6px 8px;font-size:12px;">
                </div>
                <input id="st-v25-new-img" type="text" placeholder="🖼️ 配图 URL 或已导入的图片名（可选）" style="background:#11111b;color:#a6e3a1;border:1px solid rgba(166,227,161,0.4);border-radius:7px;padding:6px 10px;font-size:12px;">
                <input id="st-v25-new-hint" type="text" placeholder="✨ AI生成提示词（例如：写她被戴上无法取下的贞操环，走路都在漏水）" style="background:#1a162b;color:#a5f3fc;border:1px solid #67e8f9;border-radius:7px;padding:7px 10px;font-size:12px;">
                <textarea id="st-v25-new-desc" rows="4" placeholder="详细状态描述（可手写或点下方按钮由AI生成）..." style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:7px;padding:7px 10px;font-size:12px;resize:vertical;"></textarea>
                <textarea id="st-v25-new-thought" rows="3" placeholder="主角第一人称内心独白（可手写或由AI生成）..." style="background:#11111b;color:#ffd6e7;border:1px solid rgba(243,139,168,0.4);border-radius:7px;padding:7px 10px;font-size:12px;resize:vertical;"></textarea>
                <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
                    <button id="st-v25-new-ai-btn" type="button" style="background:linear-gradient(135deg,#cba6f7,#89b4fa);color:#11111b;border:none;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">✨ AI根据输入自动补全</button>
                    <button id="st-v25-new-save-btn" type="button" style="background:#a6e3a1;color:#11111b;border:none;border-radius:8px;padding:7px 16px;font-size:12.5px;font-weight:bold;cursor:pointer;">➕ 确认添加按钮</button>
                </div>`;
        ov.style.display = "flex";

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

    // 6. 设置面板：极简无图展示（彻底移除预览墙，保护隐私且不占空间，导入后直接刷新状态栏列表出图！）
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
                    📦 当前本地图库已成功激活：<b id="st-idb-count" style="color:#a6e3a1;font-size:13.5px;">${importedImgCache.size}</b> 张阶段配图（已实时载入状态栏按钮）。<br>
                    💡 将图片命名为如 <code>小穴实况_1.png</code> ~ <code>小穴实况_6.png</code> 并打包成 <b><code>images.zip</code></b>，点击下方按钮即可一键静默导入！
                </div>
                <input id="st-import-zip-inp" type="file" accept=".zip,application/zip,application/x-zip-compressed" style="display:none;">
                <input id="st-import-files-inp" type="file" multiple accept="image/*" style="display:none;">
                <div style="display:flex;gap:7px;flex-wrap:wrap;">
                    <button id="st-btn-imp-zip" type="button" style="flex:1.2;background:linear-gradient(135deg,#a6e3a1,#67e8f9);color:#11111b;border:none;border-radius:8px;padding:8px 10px;font-weight:900;cursor:pointer;font-size:12px;">📦 导入 images.zip 压缩包 (推荐)</button>
                    <button id="st-btn-imp-files" type="button" style="flex:1;background:rgba(166,227,161,0.2);color:#a6e3a1;border:1px solid #a6e3a1;border-radius:8px;padding:8px 10px;font-weight:bold;cursor:pointer;font-size:12px;">🖼️ 相册多选图片</button>
                    <button id="st-btn-clr-idb" type="button" style="background:rgba(239,68,68,0.25);color:#fca5a5;border:1px solid #ef4444;border-radius:8px;padding:8px 10px;font-weight:bold;cursor:pointer;font-size:12px;">🗑️ 清空</button>
                </div>
            </div>
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎚️ 1. 主角真名与 1~6 阶长线养成难度档位</div>
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
                    <span><b>启用四层生态联动与 80/20 阻尼锁（严格按总账推进 1~6 阶段）</b></span>
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
        const countEl = box.querySelector("#st-idb-count");

        box.querySelector("#st-btn-imp-zip").onclick = () => zipInp.click();
        box.querySelector("#st-btn-imp-files").onclick = () => filesInp.click();

        const handleImport = async (files) => {
            if (!files || !files.length) return;
            showToast("⏳ 正在静默解压并载入图包...", "info", 4500);
            try {
                const cnt = await importFilesOrZipToDB(files);
                if (cnt > 0) {
                    if (countEl) countEl.textContent = String(importedImgCache.size);
                    latestStatus = getFallbackData();
                    showToast(`✅ 成功导入并激活 ${cnt} 张阶段图片！（当前共 ${importedImgCache.size} 张，已实时载入状态栏）`, "success", 3800);
                } else {
                    showToast("⚠️ 未在所选文件中找到有效图片（支持 png/webp/jpg/gif）", "warn", 3800);
                }
            } catch (err) {
                showToast("❌ 导入失败：" + (err.message || "文件格式错误"), "error", 4000);
            }
        };

        zipInp.onchange = (e) => handleImport(e.target.files);
        filesInp.onchange = (e) => handleImport(e.target.files);

        box.querySelector("#st-btn-clr-idb").onclick = async () => {
            await clearAllImportedImagesDB();
            if (countEl) countEl.textContent = "0";
            showToast("🗑️ 已清空浏览器内导入的本地图库！", "info", 2500);
        };

        const nameInp = box.querySelector("#st-protag-name-inp");
        const diffSel = box.querySelector("#st-diff-mode-sel");
        const lockChk = box.querySelector("#st-mental-lock-chk");

        diffSel.onchange = () => {
            userSettings.difficultyMode = diffSel.value;
            saveSettings();
            recalc(false);
            showToast(`🎚️ 调教难度已切换为：${DIFFICULTY_PRESETS[diffSel.value].label}`, "info", 2500);
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
    // 🎨 7. 渲染引擎：采用【上层左文右大画框(84x84) + 下层通栏双轨流光条】黄金分割布局！
    // 彻底杜绝任何文字、颜文字或进度条挤压遮挡图片！
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
            setTxt("st-v5-btn-txt", hasCard ? `👑 ${d.charName || "主角"} · ${PLUGIN_TITLE}` : `⚠️ 未选角色卡 · ${PLUGIN_TITLE}`);
            setTxt("st-v5-title", hasCard ? `${d.charName} [${diff.name}]` : `⚠️ 未选角色卡`);

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

            if (!hasCard) {
                const emptyBox = document.createElement("div");
                emptyBox.style.cssText = `background:${tc.card};border:1.5px dashed ${tc.prim};border-radius:14px;padding:24px 16px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:20px;`;
                emptyBox.innerHTML = `
                    <div style="font-size:36px;">⚠️</div>
                    <div style="font-size:15px;font-weight:bold;color:${tc.prim};">当前未检测到角色卡或聊天记录</div>
                    <div style="font-size:12.5px;color:${tc.sub};line-height:1.6;">请先在 SillyTavern 中点选一张角色卡并开启对话。<br>进入角色卡后，${PLUGIN_TITLE} 将自动识别文中主角真名与完整状态！</div>`;
                body.appendChild(emptyBox);
                return;
            }

            if (activeCat === null || !d.categories[activeCat]) {
                const vagCnt = safeNum(curVars.计数?.性交?.小穴);
                const creampieCnt = safeNum(curVars.计数?.射精?.内射);
                const corrVal = safeNum(curVars.核心数值?.淫乱恶堕);
                const shameVal = safeNum(curVars.精神与心理?.羞耻度, 100);
                const cyc = safeStr(curVars.受孕与生理?.生理周期阶段, "危险排卵期");
                const badgeBanner = document.createElement("div");
                badgeBanner.style.cssText = `margin-bottom:10px;padding:10px 12px;background:linear-gradient(135deg,rgba(0,0,0,0.65),rgba(42,27,61,0.55));border:${tc.cardBorder};border-radius:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;font-size:12px;box-shadow:inset 0 0 12px rgba(243,139,168,0.14);`;
                badgeBanner.innerHTML = `
                    <span style="color:#f9e2af;font-weight:bold;">🎭 ${d.charName} (${realId})</span>
                    <span style="color:${tc.prim};">🥚 ${cyc} ｜ 贯穿:${vagCnt} / 内射:${creampieCnt}</span>
                    <span style="color:${tc.sec};"><span class="st-heart-beat">💓</span> 恶堕:<b>${corrVal}%</b> ｜ 羞耻:<b>${shameVal}%</b></span>`;
                body.appendChild(badgeBanner);

                const vList = document.createElement("div");
                vList.style.cssText = "display:flex;flex-direction:column;gap:8px;";
                d.categories.forEach((cat, idx) => {
                    const b = document.createElement("div");
                    b.className = "st-v28-card";
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
                    b.className = "st-v28-card";
                    b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-radius:13px;padding:12px 13px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:6px;box-shadow:0 5px 15px rgba(0,0,0,0.5);`;
                    const parts = safeStr(it.desc).split("💭");
                    const objPreview = safeStr(parts[0]).replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 62) + "…";
                    const thoughtPreview = parts[1] ? "💭 " + safeStr(parts[1]).replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 56) + "…" : "";

                    let pctVal = (it.pct !== null && it.pct !== undefined) ? it.pct : safeNum(curVars.核心数值?.淫乱恶堕, 0);
                    const isRev = it.editKey === "shame" || it.editKey === "sta";
                    const curStg = tier6(pctVal, isRev) + 1;

                    // 双层黄金分割结构：
                    // 上层 (topRow)：左侧放标题+徽章+两行摘要，右侧独立放 84x84 大缩略图（绝不挤压！）
                    // 下层 (barHTML)：100% 宽度通栏双轨流光进度条與动态颜文字！
                    b.innerHTML = `
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;width:100%;">
                            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;">
                                ${it.keyHTML}
                                <div style="font-size:11.5px;color:${tc.sub};line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${objPreview}</div>
                                ${thoughtPreview ? `<div style="font-size:11.5px;color:#ffd6e7;font-style:italic;background:rgba(243,139,168,0.12);padding:4px 8px;border-radius:6px;border-left:2.5px solid #f38ba8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${thoughtPreview}</div>` : ""}
                            </div>
                            <div class="st-card-thumb-wrap ${curStg === 6 ? "st-stage6-badge" : ""}" title="点击全屏放大查看" style="display:none;width:84px;height:84px;border-radius:11px;overflow:hidden;border:2px solid ${tc.prim};flex-shrink:0;background:#0d0914;box-shadow:0 4px 14px rgba(0,0,0,0.75);position:relative;">
                                <img class="st-card-thumb-img" style="width:100%;height:100%;object-fit:cover;display:block;">
                            </div>
                        </div>
                        ${it.barHTML || ""}`;
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
                addBtn.onclick = (e) => {
                    e.stopPropagation();
                    openAddCustomItemModal(cat.title);
                };
                list.appendChild(addBtn);

                body.appendChild(list);
            }
        } catch (renderErr) {
            console.error("[状态栏 1.0] render fallback:", renderErr);
        }
    }

    function mountExtensionSettingsMenu() {
        const container = document.getElementById("extensions_settings") || document.getElementById("extensions_settings2");
        if (!container || document.getElementById("st-v28-ext-drawer")) return;
        document.getElementById("st-v27-ext-drawer")?.remove();
        document.getElementById("st-v26-ext-drawer")?.remove();
        document.getElementById("st-v25-ext-drawer")?.remove();

        const drawer = document.createElement("div");
        drawer.id = "st-v28-ext-drawer";
        drawer.style.cssText = "margin-bottom:8px;border:1px solid rgba(243,139,168,0.35);border-radius:8px;overflow:hidden;background:rgba(0,0,0,0.2);";
        drawer.innerHTML = `
            <div id="st-v28-ext-header" style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;cursor:pointer;user-select:none;background:rgba(243,139,168,0.12);">
                <b style="color:#f5c2e7;font-size:13.5px;">📊 ${PLUGIN_TITLE} (六阶完全体+四层生态联动+ZIP导图)</b>
                <span id="st-v28-ext-arrow" style="color:#f38ba8;font-weight:bold;">▼ 展开设置</span>
            </div>
            <div id="st-v28-ext-content" style="display:none;padding:12px;font-size:13px;border-top:1px solid rgba(255,255,255,0.1);">
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;">
                    <input id="st-v28-ext-enable" type="checkbox" ${userSettings.enabled ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span><b>启用 ${PLUGIN_TITLE} 悬浮窗与后台生理铁律反向注入</b></span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;cursor:pointer;">
                    <input id="st-v28-ext-hide" type="checkbox" ${userSettings.hideRawBlock ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span>自动折叠隐藏聊天正文尾部的原始【状态栏】与代码文本</span>
                </label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button id="st-v28-ext-open" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">👑 重新开启并呼出 ${PLUGIN_TITLE}</button>
                </div>
            </div>`;
        container.appendChild(drawer);

        const header = drawer.querySelector("#st-v28-ext-header");
        const content = drawer.querySelector("#st-v28-ext-content");
        const arrow = drawer.querySelector("#st-v28-ext-arrow");

        header.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = content.style.display === "none";
            content.style.display = isHidden ? "block" : "none";
            arrow.textContent = isHidden ? "▲ 收起设置" : "▼ 展开设置";
        });

        drawer.querySelector("#st-v28-ext-enable").addEventListener("change", (e) => {
            userSettings.enabled = e.target.checked;
            saveSettings();
            if (userSettings.enabled) {
                if (!document.getElementById("st-v5-root")) mountUI();
                recalc(false);
                applyThemeAndSize();
                showToast(`✅ ${PLUGIN_TITLE} 已重新开启！`, "success", 2000);
            } else {
                if (typeof setExtensionPrompt === "function") {
                    setExtensionPrompt(EXT_ID, "", extension_prompt_types?.IN_CHAT ?? 1, 0);
                }
                document.getElementById("st-v25-fullscreen-lightbox")?.remove();
                document.getElementById("st-v5-root")?.remove();
                showToast(`🔴 ${PLUGIN_TITLE} 已彻底关闭退出！`, "warn", 2000);
            }
        });

        drawer.querySelector("#st-v28-ext-hide").addEventListener("change", (e) => {
            userSettings.hideRawBlock = e.target.checked;
            saveSettings(); cleanAll(true);
        });

        drawer.querySelector("#st-v28-ext-open").addEventListener("click", (e) => {
            e.stopPropagation();
            userSettings.enabled = true;
            const chk = document.getElementById("st-v28-ext-enable");
            if (chk) chk.checked = true;
            saveSettings();
            if (!document.getElementById("st-v5-root")) {
                mountUI();
                recalc(false);
            }
            applyThemeAndSize();
            const panel = document.getElementById("st-v5-panel");
            if (panel) { panel.style.display = "flex"; renderBody(); }
            showToast(`👑 ${PLUGIN_TITLE} 已重新开启！`, "success", 2000);
        });
    }

    function mountUI() {
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
                <span id="st-v5-btn-txt">👑 主角 · ${PLUGIN_TITLE}</span>
            </button>
        </div>
        <div id="st-v5-panel" style="display:none;position:relative;margin-top:8px;width:${userSettings.width}px;height:${userSettings.height}px;min-width:320px;min-height:360px;max-width:96vw;max-height:86vh;background:linear-gradient(165deg,#181424,#1e192b);border:2px solid #f38ba8;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.92);color:#ede6f2;flex-direction:column;overflow:hidden;backdrop-filter:blur(12px);">
            <div id="st-v5-header" style="display:flex;justify-content:space-between;align-items:center;padding:10px 10px;background:rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.12);cursor:grab;user-select:none;touch-action:none;flex-shrink:0;gap:5px;">
                <b id="st-v5-title" style="color:#f5c2e7;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">主角档案</b>
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
                const extChk = document.getElementById("st-v28-ext-enable");
                if (extChk) extChk.checked = false;
                if (typeof setExtensionPrompt === "function") {
                    setExtensionPrompt(EXT_ID, "", extension_prompt_types?.IN_CHAT ?? 1, 0);
                }
                document.getElementById("st-v25-fullscreen-lightbox")?.remove();
                document.getElementById("st-v5-root")?.remove();
                showToast(`🔴 ${PLUGIN_TITLE} 已彻底关闭退出！（可点楼层下方按钮或去【扩展】菜单重新开启）`, "warn", 3500);
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
        if (!text || !text.includes("【状态栏")) return;
        const grabNum = (reg) => { const m = text.match(reg); return m ? Number(m[1]) : null; };

        const cock = grabNum(/对肉棒的好感度[：:]\s*(\d+)/); if (cock !== null) targetVars.核心数值.对肉棒好感度 = cock;
        const lust = grabNum(/性欲程度[：:]\s*(\d+)/); if (lust !== null) targetVars.核心数值.性欲程度 = lust;
        const corr = grabNum(/淫乱与?恶堕(?:程度)?[：:]\s*(\d+)/); if (corr !== null) targetVars.核心数值.淫乱恶堕 = corr;
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
        const mCrm = grabNum(/内射[：:\s]*(\d+)/); if (mCrm !== null) targetVars.计数.射精.内射 = mCrm;
        const mFac = grabNum(/颜射(?:体外)?[：:\s]*(\d+)/); if (mFac !== null) targetVars.计数.射精.颜射体外 = mFac;
        const mSwal = grabNum(/(?:饮精)?吞精[：:\s]*(\d+)/); if (mSwal !== null) targetVars.计数.精液摄入.吞精次数 = mSwal;
        const mSwalMl = grabNum(/累计摄入[：:\s]*(\d+)ml/); if (mSwalMl !== null) targetVars.计数.精液摄入.累计毫升 = mSwalMl;
        const mMast = grabNum(/自慰[：:]\s*(\d+)/); if (mMast !== null) targetVars.计数.自慰 = mMast;
        const mExp = grabNum(/露出[：:\s]*(\d+)/); if (mExp !== null) targetVars.计数.暴露.露出 = mExp;
        const mHook = grabNum(/接客(?:卖身)?[：:\s]*(\d+)/); if (mHook !== null) targetVars.计数.交易.接客卖身 = mHook;

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
            h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 打开此层 (#${id}) ${PLUGIN_TITLE}</div>`;
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

            if (!checkCardAvailable(true)) {
                curVars = fv;
                latestStatus = getFallbackData();
                renderBody();
                if (notifyCardSwitch && curCardKey !== lastKnownCardKey) {
                    lastKnownCardKey = curCardKey;
                    showToast(`⚠️ 当前未选择任何角色卡或聊天记录为空，${PLUGIN_TITLE} 进入待机状态`, "warn", 3500);
                }
                return;
            }

            const chat = ctx?.chat || [];
            for (let i = 0; i < chat.length; i++) {
                const t = safeStr(chat[i]?.mes);
                if (t.includes("【状态栏")) parseInlineStatusBarText(t, fv);
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

            if (notifyCardSwitch && curCardKey !== lastKnownCardKey) {
                lastKnownCardKey = curCardKey;
                showToast(`🔄 已切换角色卡：【${ctx?.name2 || "当前角色"}】｜主角：【${protagName} (${realId})】`, "info", 3800);
            } else if (!lastKnownCardKey) {
                lastKnownCardKey = curCardKey;
            }

            // 后台静默向 AI 注入当前变量库 + 《状态栏 1.0 -> 正文肉体与心理强制同步铁律》！
            if (typeof setExtensionPrompt === "function") {
                setExtensionPrompt(EXT_ID, userSettings.enabled ? buildFullSystemPrompt(protagName, fv) : "", extension_prompt_types?.IN_CHAT ?? 1, 0);
            }
            renderBody();
        } catch (e) { console.error("[状态栏 1.0] recalc error:", e); renderBody(); }
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
                    root.style.right = "16px";
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
                const extChk = document.getElementById("st-v28-ext-enable");
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
                else showToast(`📊 主角【${detectProtagonistName(curVars)}】状态已同步并注入下一轮正文！`, "info", 2500);
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


