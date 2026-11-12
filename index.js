// == 状态栏与楼层变量引擎 V22 (全黄油重口要素大百科 + 三段式200字深层递进心声 + 排卵受孕断面/催眠常识改写/母乳改造/正字涂鸦/挂牌身价 + 结构化高定UI) ==
(async function () {
    const EXT_ID = "my-status-bar";
    let extMod = {}, scriptMod = {};
    try { extMod = await import("/scripts/extensions.js"); } catch (e) {}
    try { scriptMod = await import("/script.js"); } catch (e) {}
    const { eventSource, event_types, setExtensionPrompt, extension_prompt_types, generateQuietPrompt } = scriptMod;

    function safeCtx() {
        try {
            if (typeof window.SillyTavern?.getContext === "function") return window.SillyTavern.getContext() || {};
            if (typeof extMod.getContext === "function") return extMod.getContext() || {};
        } catch (e) {}
        return {};
    }

    // 注入 V22 专属高定黄油 UI 样式表
    function injectCustomStyles() {
        if (document.getElementById("st-v22-custom-css")) return;
        const style = document.createElement("style");
        style.id = "st-v22-custom-css";
        style.textContent = `
            @keyframes stPulseGlow {
                0%, 100% { box-shadow: 0 0 8px rgba(255, 10, 84, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.3); }
                50% { box-shadow: 0 0 18px rgba(255, 10, 84, 0.95), inset 0 0 8px rgba(255, 255, 255, 0.6); }
            }
            @keyframes stHeartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.08); }
            }
            .st-v22-card {
                transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease !important;
            }
            .st-v22-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(243, 139, 168, 0.32) !important;
            }
            .st-stage5-badge {
                animation: stPulseGlow 1.8s infinite ease-in-out;
            }
            .st-heart-beat {
                display: inline-block;
                animation: stHeartbeat 1.3s infinite ease-in-out;
            }
            .st-sec-block {
                background: rgba(0, 0, 0, 0.32);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-left: 3px solid #cba6f7;
                border-radius: 8px;
                padding: 8px 11px;
                margin-bottom: 8px;
                line-height: 1.7;
            }
            .st-thought-box {
                margin-top: 12px;
                padding: 12px 14px;
                background: linear-gradient(145deg, rgba(243, 139, 168, 0.18), rgba(168, 85, 247, 0.12));
                border: 1px solid rgba(243, 139, 168, 0.4);
                border-left: 4.5px solid #f38ba8;
                border-radius: 11px;
                color: #ffe0ec;
                font-style: italic;
                line-height: 1.82;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35), inset 0 0 14px rgba(243, 139, 168, 0.12);
            }
            .st-thought-layer {
                padding: 5px 8px;
                margin-top: 6px;
                background: rgba(0, 0, 0, 0.28);
                border-radius: 6px;
                border-left: 2.5px solid #f9e2af;
            }
            #st-v5-body::-webkit-scrollbar, #st-v6-det-desc::-webkit-scrollbar {
                width: 5px;
            }
            #st-v5-body::-webkit-scrollbar-thumb, #st-v6-det-desc::-webkit-scrollbar-thumb {
                background: rgba(243, 139, 168, 0.45);
                border-radius: 99px;
            }
        `;
        document.head.appendChild(style);
    }

    function showToast(msg, type = "success", duration = 3500) {
        try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, "📊 状态栏引擎 V22"); } catch (e) {}
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

    const PHYSIQUE_PRESETS = {
        "auto": { label: "🤖 自动识别 (依设定与正文判断)", mult: 1.0 },
        "mortal": { label: "🌸 凡人柔弱体质 (1x 标准难度·280次五阶)", mult: 1.0 },
        "proud": { label: "⚔️ 修仙/骑士/高傲大小姐 (3.5x 耐受·980次五阶)", mult: 3.5 },
        "succubus": { label: "😈 魅魔/淫魔/魔族体质 (18x 耐受·5000次五阶)", mult: 18.0 },
        "deity": { label: "👑 神明/龙族/深渊母体 (45x 极道耐受·12600次五阶)", mult: 45.0 }
    };

    let userSettings = {
        enabled: true,
        hideRawBlock: true,
        theme: "魅魔粉 (默认)",
        physiqueMode: "auto",
        width: 530,
        height: 690,
        fontScale: 100,
        apiSyncEnabled: false,
        apiUrl: "",
        apiKey: "",
        apiModel: "",
        modelList: []
    };

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v22_cfg") || localStorage.getItem(EXT_ID + "_v21_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉 (默认)";
            if (!PHYSIQUE_PRESETS[userSettings.physiqueMode]) userSettings.physiqueMode = "auto";
        } catch (e) {}
    }
    function saveSettings() {
        try { localStorage.setItem(EXT_ID + "_v22_cfg", JSON.stringify(userSettings)); } catch (e) {}
    }

    function tier5(val, rev = false) {
        const n = Math.max(0, Math.min(100, Number(val) || 0));
        const v = rev ? (100 - n) : n;
        return v < 20 ? 0 : v < 40 ? 1 : v < 60 ? 2 : v < 80 ? 3 : 4;
    }

    function stageNameFromVal(val) {
        return ["第一阶段", "第二阶段", "第三阶段", "第四阶段", "第五阶段"][tier5(val, false)];
    }

    function getProgBarStyle(pct, reverse = false) {
        const p = Math.max(0, Math.min(100, Number(pct) || 0));
        const val = reverse ? (100 - p) : p;
        let grad = "", glow = "", labelColor = "";
        if (val === 0) {
            grad = "linear-gradient(90deg, #475569, #64748b)";
            glow = "none";
            labelColor = "#94a3b8";
        } else if (val < 20) {
            grad = "linear-gradient(90deg, #fbcfe8, #f472b6)";
            glow = "0 0 6px rgba(244,114,182,0.45)";
            labelColor = "#fbcfe8";
        } else if (val < 40) {
            grad = "linear-gradient(90deg, #f472b6, #e879f9)";
            glow = "0 0 8px rgba(232,121,249,0.55)";
            labelColor = "#f5d0fe";
        } else if (val < 60) {
            grad = "linear-gradient(90deg, #e879f9, #a855f7, #7e22ce)";
            glow = "0 0 11px rgba(168,85,247,0.7)";
            labelColor = "#e9d5ff";
        } else if (val < 80) {
            grad = "linear-gradient(90deg, #ec4899, #f43f5e, #be123c)";
            glow = "0 0 14px rgba(244,63,94,0.85)";
            labelColor = "#fda4af";
        } else {
            grad = "linear-gradient(90deg, #ff0a54, #990033, #3b0014)";
            glow = "0 0 18px #ff0a54, inset 0 0 6px #fff";
            labelColor = "#ff4d6d";
        }
        return { grad, glow, labelColor };
    }

    function cleanThoughtText(str) {
        if (!str) return "";
        return String(str).replace(/^[\s"“'‘*]+|[\s"”'’*]+$/g, "").replace(/\*\*/g, "").trim();
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

    // 【V22 全黄油大百科初始变量库】：补全排卵期、催眠洗脑、母乳泌乳、轮奸、睡眠奸、挂牌身价、敏感度倍增等全部要素
    function getInitialVars() {
        return {
            档案: {
                当前认知名字: "",
                种族与体质: "",
                身份与背景: "",
                肉体外貌实况: "",
                风月挂牌身价: "",
                当前处境: ""
            },
            核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
            精神与心理: { 羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0, 意识清醒度: 100, 人格崩解度: 0 },
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
                高潮: { 总数: 0, 强制: 0, 公开场合: 0, 寸止: 0, 连续绝顶: 0 },
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
                生理周期阶段: "危险排卵期", 卵子状态: "丰熟待受精", 生产产卵次数: 0
            },
            体内精液存量: { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
            痕迹与标记: {
                体表痕迹: "无", 淫纹与刻印: "无", 公开涂鸦字迹: "无",
                穿刺与环饰: "无", 鞭痕与掌印: 0
            },
            体内道具与权限: {
                体内道具: "无", 束缚状态: "无", 穿戴中的标记物: "",
                肉体所有权: "自由身", 排泄与高潮权限: "自主控制", 常识改写状态: "无"
            },
            调教进度: { 规矩与日程: "", 条件反射触发词: "无", 媚药与发情毒: "无" },
            精神与心理扩展: { 当前敏感点: "", 催眠深度: 0 },
            按钮详情: {},
            性癖详情: {}
        };
    }

    let curVars = getInitialVars(), latestStatus = null, activeCat = null, curDetailIdx = 0, inSettings = false;
    let isCleaningDOM = false, cleanTimer = null, lastKnownCardKey = "";

    const ICONS = {
        "档案与肉体": "👩",
        "恶堕与精神": "🔥",
        "下流性癖库": "🧬",
        "六孔与储精": "🌸",
        "从头到脚穿搭": "👗",
        "淫乱总账本": "💎"
    };
    const SHORT_NAMES = {
        "档案与肉体": "档案",
        "恶堕与精神": "精神",
        "下流性癖库": "性癖",
        "六孔与储精": "六孔",
        "从头到脚穿搭": "穿搭",
        "淫乱总账本": "总账"
    };

    function getChatStoreKey() {
        const ctx = safeCtx();
        const cid = ctx?.chatId || ctx?.characterId || ctx?.name2 || "default_chat";
        return `${EXT_ID}_v22_cache_${cid}`;
    }

    function loadChatCache() {
        try {
            const raw = localStorage.getItem(getChatStoreKey()) || localStorage.getItem(`${EXT_ID}_v21_cache_${safeCtx()?.chatId || "default_chat"}`);
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }

    function saveChatCache(varsObj) {
        try {
            localStorage.setItem(getChatStoreKey(), JSON.stringify({
                快照: varsObj,
                按钮详情: varsObj.按钮详情 || {},
                性癖详情: varsObj.性癖详情 || {}
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
            if (s.性癖?.条目?.length) baseVars.性癖.条目 = s.性癖.条目;
            if (s.计数) {
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
    }

    function detectPhysiqueProfile(v) {
        if (userSettings.physiqueMode !== "auto" && PHYSIQUE_PRESETS[userSettings.physiqueMode]) {
            const p = PHYSIQUE_PRESETS[userSettings.physiqueMode];
            const isSucc = userSettings.physiqueMode === "succubus" || userSettings.physiqueMode === "deity";
            return {
                type: userSettings.physiqueMode,
                name: p.label.replace(/^[^\s]+\s/, "").split(" ")[0],
                mult: p.mult,
                isSuccubusLike: isSucc
            };
        }

        const ctx = safeCtx();
        const charDesc = ctx?.characters?.[ctx?.characterId]?.description || "";
        const personaDesc = ctx?.power_user?.persona_description || "";
        const recentMes = (ctx?.chat || []).slice(-6).map(m => m?.mes || "").join(" ");
        const combined = `${v?.档案?.种族与体质 || ""} ${v?.档案?.身份与背景 || ""} ${personaDesc} ${charDesc} ${recentMes}`;

        if (/魅魔|淫魔|Succubus|魔核|淫纹天成|梦魔|欲魔|色欲魔女/i.test(combined)) {
            return { type: "succubus", name: "😈 魅魔/淫魔体质", mult: 18.0, isSuccubusLike: true };
        }
        if (/古神|女神|龙族|母体|魔神|真祖|血族女王|虫族女皇/i.test(combined)) {
            return { type: "deity", name: "👑 神魔/高阶母体", mult: 45.0, isSuccubusLike: true };
        }
        if (/修仙|仙子|圣女|女帝|剑仙|少宗主|斗宗|骑士|精灵|女武神/i.test(combined)) {
            return { type: "proud", name: "⚔️ 仙道/高傲圣洁体质", mult: 3.5, isSuccubusLike: false };
        }
        return { type: "mortal", name: "🌸 凡人敏感肉胎", mult: 1.0, isSuccubusLike: false };
    }

    // 五阶段分段非线性算法
    function calcNonlinearFetishScore(count, unitWeight = 1.0, physiqueMult = 1.0, corr = 0) {
        if (count <= 0) return { val: 0, nextThreshold: Math.ceil(8 * physiqueMult / unitWeight), curThresholdBase: 0 };
        const effectiveCount = (count * unitWeight) / Math.max(0.5, physiqueMult);

        const T1 = 8, T2 = 35, T3 = 100, T4 = 280, T5 = 650;
        let baseScore = 0, nextRawTarget = T1;

        if (effectiveCount <= T1) {
            baseScore = 1 + (effectiveCount / T1) * 18;
            nextRawTarget = T1;
        } else if (effectiveCount <= T2) {
            baseScore = 20 + ((effectiveCount - T1) / (T2 - T1)) * 19;
            nextRawTarget = T2;
        } else if (effectiveCount <= T3) {
            baseScore = 40 + ((effectiveCount - T2) / (T3 - T2)) * 19;
            nextRawTarget = T3;
        } else if (effectiveCount <= T4) {
            baseScore = 60 + ((effectiveCount - T3) / (T4 - T3)) * 19;
            nextRawTarget = T4;
        } else {
            baseScore = 80 + Math.min(20, ((effectiveCount - T4) / (T5 - T4)) * 20);
            nextRawTarget = T5;
        }

        const corrBonus = Math.min(6, corr * 0.06);
        let finalVal = Math.round(baseScore + corrBonus);

        if (effectiveCount < T1 && finalVal >= 20) finalVal = 19;
        if (effectiveCount < T2 && finalVal >= 40) finalVal = 39;
        if (effectiveCount < T3 && finalVal >= 60) finalVal = 59;
        if (effectiveCount < T4 && finalVal >= 80) finalVal = 79;

        finalVal = Math.max(1, Math.min(100, finalVal));
        const realNextThreshold = Math.max(count + 1, Math.ceil((nextRawTarget * physiqueMult) / unitWeight));

        return { val: finalVal, nextThreshold: realNextThreshold };
    }

    function detectProtagonistName(v) {
        const ctx = safeCtx();
        const rawUser = (ctx?.name1 || "主角").trim();
        const cardName = (ctx?.name2 || "").trim();
        const chatArr = ctx?.chat || [];

        if (v?.档案?.当前认知名字 && v.档案.当前认知名字.trim() && v.档案.当前认知名字 !== "主角") {
            return v.档案.当前认知名字.trim();
        }

        let detected = "";
        const recent = chatArr.slice(-8);
        for (let i = recent.length - 1; i >= 0; i--) {
            const mes = recent[i]?.mes || "";
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
        return rawUser;
    }

    function calcHoleCapacities(v) {
        const c = v.计数 || {};
        const phy = detectPhysiqueProfile(v);
        const corr = Number(v.核心数值?.淫乱恶堕) || 0;
        const mouthCnt = (Number(c.性交?.口) || 0) + (Number(c.精液摄入?.吞精次数) || 0);
        const vagCnt = Number(c.性交?.小穴) || 0;
        const creampie = Number(c.射精?.内射) || 0;
        const analCnt = Number(c.性交?.屁眼) || 0;
        const bonusMult = phy.isSuccubusLike ? 2.5 : 1.0;

        return {
            mouthMax: Math.min(1200, Math.round((45 + mouthCnt * 4 + corr * 1.2) * bonusMult)),
            vagMax: Math.min(800, Math.round((25 + vagCnt * 3.5 + corr * 0.8) * bonusMult)),
            wombMax: Math.min(1500, Math.round((20 + creampie * 6 + vagCnt * 2 + corr * 1.5) * bonusMult)),
            analMax: Math.min(1200, Math.round((35 + analCnt * 5 + corr * 1.2) * bonusMult))
        };
    }

    // 扩展至 14 项经典黄油重口性癖自动解锁引擎
    function computeUnlockedFetishes(v) {
        const c = v.计数 || {};
        const phy = detectPhysiqueProfile(v);
        const pMult = phy.mult;

        const vag = Number(c.性交?.小穴) || 0, mouth = Number(c.性交?.口) || 0, anal = Number(c.性交?.屁眼) || 0;
        const tit = Number(c.性交?.乳穴) || 0, foot = Number(c.性交?.足腿) || 0, creampie = Number(c.射精?.内射) || 0;
        const swallow = Number(c.精液摄入?.吞精次数) || 0, orgasm = Number(c.高潮?.总数) || 0;
        const squirt = Number(c.失控?.喷潮) || 0, leak = Number(c.失控?.失禁) || 0, mast = Number(c.自慰) || 0;
        const exp = Number(c.暴露?.露出) || 0, hooker = Number(c.交易?.接客卖身) || 0;
        const milk = Number(c.泌乳?.喷乳次数) || 0, gang = Number(c.交易?.轮奸群交) || 0, sleep = Number(c.交易?.睡眠昏迷奸) || 0;
        const edge = Number(c.高潮?.寸止) || 0;
        const corr = Number(v.核心数值?.淫乱恶堕) || 0;

        const totalCount = vag + mouth + anal + tit + foot + creampie + swallow + orgasm + squirt + leak + mast + exp + hooker + milk + gang + sleep;
        const resultMap = new Map();

        if (Array.isArray(v.性癖?.条目)) {
            v.性癖.条目.forEach(raw => {
                const s = String(raw).trim();
                if (!s) return;
                if (totalCount === 0 && corr === 0 && /[-\s]0\/100$/.test(s)) return;
                if (/^(?:见之欲呕|清心寡欲|初守清白|羞极即泄|抗命顶撞|心如止水|自我完整)/.test(s) && totalCount > 5) return;

                const parts = s.split("-");
                let rawName = (parts[0] || "特殊性癖").trim();
                const origin = (parts[1] || "长期调教与肉体开发形成").trim();
                const rawStage = (parts[2] || "").trim();

                let num = 15;
                const m = s.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+)/);
                if (m) {
                    const n1 = parseFloat(m[1]), n2 = parseFloat(m[2]);
                    num = n2 > 0 ? Math.round((n1 / n2) * 100) : Math.round(n1);
                } else if (rawStage.includes("五")) num = 88;
                else if (rawStage.includes("四")) num = 68;
                else if (rawStage.includes("三")) num = 48;
                else if (rawStage.includes("二")) num = 28;

                const maxAllowedByTotal = calcNonlinearFetishScore(Math.max(1, totalCount * 0.6), 1.0, pMult, corr).val;
                if (totalCount > 0 && num > maxAllowedByTotal + 18) {
                    num = Math.min(num, maxAllowedByTotal + 12);
                }
                num = Math.max(1, Math.min(100, num));
                resultMap.set(rawName, {
                    name: rawName, origin, val: num, stage: stageNameFromVal(num),
                    countNow: totalCount, nextTarget: Math.ceil(totalCount * 1.5 + 10)
                });
            });
        }

        const upsertAuto = (shortName, originTpl, count, unitWeight = 1.0) => {
            if (count <= 0) return;
            const { val: calcVal, nextThreshold } = calcNonlinearFetishScore(count, unitWeight, pMult, corr);
            const stg = stageNameFromVal(calcVal);
            const originStr = `${originTpl}（当前累计 ${count} 次，距下一阶段需达 ${nextThreshold} 次｜体质耐受：${phy.name} ${pMult}x）`;

            if (resultMap.has(shortName)) {
                const ex = resultMap.get(shortName);
                ex.val = calcVal; ex.stage = stg; ex.origin = originStr;
                ex.countNow = count; ex.nextTarget = nextThreshold;
            } else {
                resultMap.set(shortName, {
                    name: shortName, origin: originStr, val: calcVal, stage: stg,
                    countNow: count, nextTarget: nextThreshold
                });
            }
        };

        upsertAuto("挨操肉穴瘾", `骚逼已被阳具贯穿 ${vag} 次，阴道层叠肉褶正在形成阳具轮廓记忆`, vag, 1.0);
        upsertAuto("子宫受精癖", `宫腔已被滚烫浓精内射浇灌 ${creampie} 次，宫颈口习惯被龟头顶开锁精`, creampie, 1.15);
        upsertAuto("深喉吞精癖", `骚口已口交 ${mouth} 次、吞精 ${swallow} 次，食道与味蕾被雄性精腥味彻底浸染`, mouth + swallow, 0.9);
        upsertAuto("后庭扩菊癖", `屁眼已被粗暴开发 ${anal} 次，直肠括约肌逐渐适应粗大异物塞满感`, anal, 1.3);
        upsertAuto("乳交奉侍癖", `丰乳已夹击服侍肉棒 ${tit} 次，乳肉与乳尖在摩擦中敏化充血`, tit, 1.4);
        upsertAuto("母畜喷乳癖", `乳腺已被改造并挤奶喷乳 ${milk} 次，乳头一被吸吮即引发子宫共振高潮`, milk, 1.8);
        upsertAuto("玉足恋精癖", `玉足已足交玩弄阳具 ${foot} 次，脚趾缝沾染浓精与先走汁即条件反射蜷缩`, foot, 1.4);
        upsertAuto("潮吹失禁癖", `累计绝顶 ${orgasm} 次、潮吹 ${squirt} 次、漏尿失禁 ${leak} 次，尿道括约肌与高潮神经短路`, Math.round(orgasm * 0.5 + squirt * 2 + leak * 2.5), 1.0);
        upsertAuto("寸止焦躁癖", `遭受寸止折磨 ${edge} 次，长期求而不得令神经对高潮产生病态饥渴`, edge, 1.8);
        upsertAuto("自慰抠穴癖", `难耐空虚自行抠挖骚穴 ${mast} 次，手指沾满拉丝淫水自我亵渎`, mast, 1.5);
        upsertAuto("公开露出癖", `当众赤裸露出或被视奸 ${exp} 次，将旁人下流视线转化为催情快感`, exp, 1.5);
        upsertAuto("轮奸肉便器癖", `经历多人轮奸群交 ${gang} 次，三穴习惯同时被多根肉棒塞满抽插`, gang, 2.0);
        upsertAuto("睡奸无防备癖", `在睡眠或昏迷无防备下被侵犯 ${sleep} 次，潜意识养成梦中自动分腿迎合本能`, sleep, 2.0);
        upsertAuto("风尘卖淫癖", `已接客卖身或共享 ${hooker} 次，自我认知逐渐向明码标价的泄欲肉具异化`, hooker, 1.1);

        return Array.from(resultMap.values());
    }

    // 【V22 核心升级】：为每项性癖生成 220字以上 的「三段式深层递进长心声」（生理冲击 -> 羞耻背德 -> 发骚渴求）
    function buildFetishRichDesc(fetishObj, v, u) {
        const { name, origin, val, stage, countNow = 0, nextTarget = 20 } = fetishObj;
        const t = tier5(val, false);
        const phy = detectPhysiqueProfile(v);

        const apiFet = v.性癖详情?.[name];
        if (apiFet && apiFet.desc && apiFet.thought) {
            return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
                   `【🧬 体质耐受与进阶门槛】：${phy.name}（耐受倍率 ${phy.mult}x）｜当前有效计数：${countNow} -> 下一阶门槛：${nextTarget}\n` +
                   `【解锁成因】：${apiFet.origin || origin}\n` +
                   `【🔞 第${t + 1}阶段微观生理与神经发作实况】：\n${apiFet.desc}\n` +
                   `💭【${u}的${stage}三层递进心声】：“*${cleanThoughtText(apiFet.thought)}*”`;
        }

        if (phy.isSuccubusLike) {
            const succStageDescs = [
                `【第一阶段·捕食本能/高傲榨取】（${val}/100）：身为${phy.name}，「${name}」对${u}而言原本只是榨取低等雄性精气、滋补自身魔核的捕食手段。区区 ${countNow} 次交合连塞牙缝都不够，肉穴虽熟练地包裹吮吸，但灵魂深处仍保持着上位捕食者的戏谑与傲慢。`,
                `【第二阶段·魔核食髓/反客为主】（${val}/100）：随着「${name}」累计达到 ${countNow} 次，${u}惊讶地发现对方阳具与浓精的质量远超普通猎物！原本用于催眠男人的魅魔粘膜开始反向对这股粗暴的雄性气息产生贪婪渴望，尾椎与魔纹微微发烫，开始贪图肉壁被粗暴刮蹭的酸麻快感。`,
                `【第三阶段·精气过载/捕食者沉沦】（${val}/100）：「${name}」已彻底撕裂了魅魔的高傲伪装！高浓度的滚烫精液与高频贯穿令${u}的魔核发生快感过载，原本掌控全局的上位者姿态在一次次深顶中溃不成军，湿滑紧致的魅魔肉腔开始不受控制地痉挛讨好。`,
                `【第四阶段·魔纹逆转/发情母畜化】（${val}/100）：重度恶堕！高贵的${phy.name}已被「${name}」彻底驯化为只知索求阳具的发情母犬！小腹淫纹常亮滴血色微光，肉孔被开发出永久贴合下等雄性巨物的形状记忆，主动翘起臀部祈求用最粗暴的「${name}」将她的魔核彻底灌满！`,
                `【⚠️ 第五阶段·魔核熔断/深渊公用肉便器】（${val}/100）：终极极限恶堕！经历多达 ${countNow} 次浩瀚如海的残酷摧残与灌精，${u}引以为傲的魅魔神智与魔核已100%烧毁熔断！全身肉孔括约肌永久外翻失禁，24小时流淌着混杂魔力与浓精的淫水，彻底退化为深渊肉便器！`
            ];
            const succLongThoughts = [
                `【生理层】哼♡……不过是区区 ${countNow} 次「${name}」罢了，虽然刚才被顶到最深处的时候尾椎骨稍微麻了一下，但对本小姐的${phy.name}来说根本不算什么💦！｜【心理层】我可是站在食物链顶端的捕食者，怎么可能因为凡人雄性这点粗鲁的冲撞就动摇心神呢？刚才漏出来的那声娇喘绝对只是为了麻痹猎物故意装出来的😳！｜【欲望层】不过……他射出来的精气确实比普通男人浓烈滚烫得多，下次再稍微多榨取一点点来温养魔核，应该也不会有什么问题吧……❤️`,
                `【生理层】唔嗯……好奇怪，明明「${name}」才经历了 ${countNow} 次，为什么小腹里的魔核已经开始一抽一抽地发烫，连腿心都在自己往外渗水了😳💦？｜【心理层】明明应该是我居高临下地玩弄他才对，可刚才被他按着腰狠狠往死里顶的时候，脑子里居然有一瞬间彻底空白了，高傲的架子差点就端不住了！｜【欲望层】不行……那股滚烫粗硬的触感已经印在粘膜上了，好想再让他用更粗暴的力气顶进来，看看我的魔核到底能承受多少精气呀……🥵❤️`,
                `【生理层】哈啊、哈啊♡……全身的骨头都酥麻得使不上劲了💦，哪怕我是${phy.name}，承受这种强度的「${name}」也快要把魔核给撑爆了🥵！｜【心理层】什么高贵的上位魔族尊严，在刚才那一波接一波直冲天灵盖的高潮面前早就碎成渣了，现在的我根本不是在捕食，而是在被他单方面地粗暴开发呀！｜【欲望层】别停下来……求求你快用大肉棒继续狠狠惩罚我这只不知天高地厚的魅魔吧，不把子宫灌满滚烫浓精的话，魔纹就要痒得爆炸了呀💦❤️！`,
                `【生理层】呜汪♡……小肚子上的淫纹烫得快要烧起来了，只要一停下「${name}」，全身的肉孔都会空虚得一阵阵痉挛漏水🥵💦！｜【心理层】别再拿魅魔的身份取笑人家了，从头到脚、从喉咙到子宫早就已经被调教成只认识主人大鸡巴的专属形状了，反抗的念头连一丁点都生不出来了！｜【欲望层】快把那根粗得吓人的肉棒塞进来吧♡！只要能用「${name}」把人家喂饱，让我像下贱母狗一样跪着舔鞋底、摇着尾巴求肏都可以呀❤️❤️！`,
                `【生理层】啊嘿、呕咕♡……魔核彻底融化坏掉了，脑子里全都是白花花的精液和闪烁的火花，下面的骚逼和尿道口完全合不拢、一直在往外喷水失禁🥵💦！｜【心理层】思考是什么？尊严是什么？${u}已经彻底变成没有脑子、只会张开大腿吐着舌头挨肏的深渊公用肉便器母猪了呀！｜【欲望层】还要更多、还要更粗暴的「${name}」♡！请把全天下的大肉棒全都插进人家的身体里，把${u}活生生操死在精液池里吧❤️❤️❤️！！`
            ];
            return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
                   `【🧬 魅魔/特异体质动态难度】：${phy.name}（耐受倍率 ${phy.mult}x｜当前累计 ${countNow} 次，距下一阶需 ${nextTarget} 次）\n` +
                   `【解锁成因】：${origin}\n` +
                   `【🔞 第${t + 1}阶段发作实况】：\n${succStageDescs[t]}\n` +
                   `💭【${u}的${stage}三层递进心声】：“*${succLongThoughts[t]}*”`;
        }

        const stageDescs = [
            `【第一阶段·异物初侵/屈辱应激】（${val}/100）：「${name}」刚刚在${u}的肉体上留下最初的浅层烙印（累计 ${countNow} 次，需达 ${nextTarget} 次升入二阶）。在理智层面仍感到强烈的羞耻、排斥或是麻木隐忍，但娇嫩的粘膜与神经末梢已被强行记住异物摩擦的触感。`,
            `【第二阶段·肉体通电/敏化成瘾】（${val}/100）：「${name}」已演化至第二阶段（累计 ${countNow} 次）！肉体的条件反射开始背叛大脑的矜持，相关部位的毛细血管长期处于充血敏化状态。只要闻到雄性腥气或处于暗示情境下，呼吸便瞬间紊乱滚烫，腿心花唇诚实地泌出透明春水。`,
            `【第三阶段·理智崩解/戒断渴求】（${val}/100）：「${name}」已深化至第三阶段（累计 ${countNow} 次），彻底化作刻进骨髓与脊髓反射里的快感本能！羞耻防线全面溃散，痛觉与屈辱感在神经回路中被强行扭曲为高潮电流；一旦未能体验「${name}」，小腹深处就会泛起毒瘾发作般的空虚抓挠感！`,
            `【第四阶段·肉改畸变/母狗狂犬化】（${val}/100）：「${name}」已恶化至第四阶段重度肉改状态（累计 ${countNow} 次）！长期高强度的开发已令${u}的相应器官产生不可逆的淫靡形变——括约肌松弛外翻、敏感肉珠肥大充血。言谈举止全面母狗化，毫无廉耻地敞开身体哭求更粗暴的蹂躏！`,
            `【⚠️ 第五阶段·脑髓熔断/终极公用肉便器】（${val}/100）：全书最高重口天花板（累计 ${countNow} 次极限摧残）！「${name}」已将${u}的大脑皮层阿片受体彻底烧穿熔断！知性与人格灰飞烟灭，哪怕只是听到相关字眼或指令，便会瞬间瞳孔放大涣散、翻起白眼吐舌流涎，全身肉孔同时失禁喷水！`
        ];

        const stageLongThoughts = [
            `【生理层】呜……明明只是被迫经历了 ${countNow} 次「${name}」而已，可被撑开摩擦过的粘膜现在还火辣辣地发酸发麻，稍微一动就会牵扯到那根敏感神经💦！｜【心理层】太屈辱、太丢脸了……我怎么可能会对这种粗鲁下流的事情产生反应呢？刚才身体突然打颤绝对只是因为害怕和不习惯而已😳！｜【欲望层】可是……为什么一闭上眼睛回想刚才被强行顶进来的瞬间，小肚子最深处还是会不受控制地揪紧发烫、甚至偷偷渗出一丝湿意呢……❤️`,
            `【生理层】不、不对劲……才经历了 ${countNow} 次，为什么现在一提到「${name}」，我的胸口就闷得发慌、两腿之间的花唇自己就充血湿透了啊😳💦？！｜【心理层】大脑明明还在拼命命令自己要守住廉耻、要把双腿夹紧，可这具叛徒一样的身体却早就记住了那种酸麻灭顶的滋味，连反抗的力气都使不出来了！｜【欲望层】好难受……内裤黏在阴唇上又湿又痒，要是能再被那样粗暴地对待一次、把里面这股邪火压下去的话，稍微丢一点脸是不是也没关系呢……🥵❤️`,
            `【生理层】哈啊、哈啊……已经彻底瞒不住自己了💦！只要一触发「${name}」，整条脊椎骨就像通了高压电一样从尾椎一路爽到天灵盖，脚趾头都麻得死死蜷缩起来了🥵！｜【心理层】什么矜持、什么自尊，在这么强烈的肉体快感面前全都是废话……这具身体从里到外都已经被开发成熟透的形状，再怎么装清高也只是自欺欺人罢了！｜【欲望层】别再让我忍耐了……快点用更凶狠、更下流的力道对我做「${name}」吧，把我里面空虚发痒的地方彻底填满捅穿呀💦❤️！`,
            `【生理层】呜汪♡……受不了了，一天不经历「${name}」，我的骚穴和子宫就像有几万只蚂蚁在啃咬一样，淫水顺着大腿根哗啦啦地往下流个不停🥵💦！｜【心理层】我已经彻底放弃当一个正常女人了，经历过 ${countNow} 次开发之后，现在的我就是一条只为了讨好男人大肉棒而摇尾巴的发情母狗呀！｜【欲望层】求求你快来看看我湿得一塌糊涂的下流身体吧♡！不管是扇耳光、掐奶子还是用「${name}」把我玩弄到漏尿，只要能让我高潮怎么对待我都可以呀❤️❤️！`,
            `【生理层】啊嘿、呕咕♡……脑子彻底被「${name}」烧成白花花的浆糊了🥵💦！眼珠子往上翻着回不来了，舌头伸在外面流着哈喇子，下面的骚逼和尿道口像坏掉的水龙头一样狂喷潮吹和骚尿！｜【心理层】我是谁？不知道……${u}只知道自己是一个累计承受了 ${countNow} 次「${name}」的终极公用肉便器母猪，除了张开三个洞接精液之外什么都不会想了呀！｜【欲望层】操死我、快用「${name}」活活操死人家吧♡！把子宫灌成大肚皮、把脑髓也灌满浓精，让${u}一辈子都在阿片高潮里打滚失禁吧❤️❤️❤️！！`
        ];

        return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
               `【🧬 体质耐受与进阶门槛】：${phy.name}（耐受倍率 ${phy.mult}x｜当前累计 ${countNow} 次，距下一阶需 ${nextTarget} 次）\n` +
               `【解锁成因】：${origin}\n` +
               `【🔞 第${t + 1}阶段发作实况】：\n${stageDescs[t]}\n` +
               `💭【${u}的${stage}三层递进心声】：“*${stageLongThoughts[t]}*”`;
    }

    function varsToYaml(userName, varsObj) {
        const cleanCopy = { ...varsObj };
        delete cleanCopy.按钮详情;
        delete cleanCopy.性癖详情;
        function serialize(obj, indent = 2) {
            const pad = " ".repeat(indent); let out = "";
            for (const [k, v] of Object.entries(obj)) {
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

    function buildFullSystemPrompt(userName, currentVars) {
        const currentYaml = varsToYaml(userName, currentVars);
        const phy = detectPhysiqueProfile(currentVars);
        return `\n【当前变量库实时注入值（主角体质：${phy.name}｜耐受倍率：${phy.mult}x）】\n${currentYaml}\n
【🔥状态栏与变量实时更新规范（V22黄油大百科引擎）】
1. 每条回复末尾输出：<UpdateVariable>块</UpdateVariable>。
2. 若主角在文中发生改名、变形或身份转换，必须用 _.set('${userName}.档案.当前认知名字', '文中新名字'); 实时同步！
3. 性癖阶段严禁虚高：凡人需数百次、魅魔需数千次方能进入第四/第五阶段。
4. 全面追踪黄油要素：子宫排卵受孕率、催眠深度、常识改写、母乳泌乳、寸止、轮奸、睡眠奸及从头到脚8部位穿搭。`;
    }

    function fmtKey(rk, reverseBar = false) {
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        let pct = null, rawRatioStr = null;
        const m = rk.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+(?:\.\d+)?)([a-zA-Z\u4e00-\u9fa5]*)/);
        if (m) {
            const cur = parseFloat(m[1]), max = parseFloat(m[2]);
            rawRatioStr = `${m[1]}/${m[2]}${m[3] || ""}`;
            if (max > 0) pct = Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
        } else {
            const sm = { "第一阶段": 15, "第二阶段": 35, "第三阶段": 55, "第四阶段": 75, "第五阶段": 95 };
            for (const [k, v] of Object.entries(sm)) if (rk.includes(k)) { pct = v; break; }
        }
        const badges = [];
        let cleanTitle = rk
            .replace(/「([^」]{1,45})」/g, (_, s) => {
                const isStage5 = s.includes("第五阶段") || s.includes("终极") || s.includes("脑髓熔断") || s.includes("便器") || s.includes("赤裸") || s.includes("真空") || s.includes("危险排卵");
                const bBg = isStage5 ? "linear-gradient(90deg,#ff0a54,#990033)" : tc.hi;
                const bCol = isStage5 ? "#fff" : tc.text;
                const cls = isStage5 ? "st-stage5-badge" : "";
                badges.push(`<span class="${cls}" style="background:${bBg};border:1px solid ${tc.sec};color:${bCol};padding:1px 7px;border-radius:6px;font-size:11px;font-weight:bold;">${s}</span>`);
                return "";
            })
            .replace(/[（(]([^）)]{1,45}?(?:阶段|\d+\s*[\/／]\s*\d+)[^）)]{0,25}?)[）)]/g, (_, s) => {
                badges.push(`<span style="background:rgba(255,255,255,0.1);border:1px solid ${tc.prim};color:${tc.prim};padding:1px 7px;border-radius:6px;font-size:11px;">${s}</span>`);
                return "";
            })
            .replace(/[：:]\s*(\d+(?:\.\d+)?\s*[\/／]\s*\d+[a-zA-Z\u4e00-\u9fa5]*)\s*$/, (_, n) => {
                badges.unshift(`<span style="background:rgba(249,226,175,0.16);border:1px solid rgba(249,226,175,0.45);color:#f9e2af;padding:1px 7px;border-radius:6px;font-size:11.5px;font-family:Consolas,monospace;font-weight:bold;">${n}</span>`);
                return "";
            })
            .replace(/[：:]\s*$/, "").trim();

        const keyHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;width:100%;"><span style="color:#f9e2af;font-weight:bold;font-size:13.5px;line-height:1.4;word-break:break-word;">${cleanTitle}</span>${badges.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-end;flex-shrink:0;max-width:58%;">${badges.join("")}</div>` : ""}</div>`;

        let barHTML = "";
        if (pct !== null) {
            const st = getProgBarStyle(pct, reverseBar);
            barHTML = `<div style="display:flex;align-items:center;gap:8px;margin-top:6px;width:100%;">
                <div style="flex:1;height:8px;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.12);border-radius:99px;overflow:hidden;padding:1px;">
                    <div style="width:${pct}%;height:100%;background:${st.grad};border-radius:99px;box-shadow:${st.glow};transition:width 0.4s ease, background 0.4s ease;"></div>
                </div>
                <span style="font-size:11px;color:${st.labelColor};font-family:Consolas,monospace;font-weight:bold;min-width:42px;text-align:right;">${rawRatioStr && rawRatioStr.includes("ml") ? rawRatioStr : (pct + "%")}</span>
            </div>`;
        }
        return { keyHTML, barHTML, cleanTitle, pct };
    }

    function extractDynamicContext(u, c) {
        const ctx = safeCtx();
        const chatArr = ctx?.chat || [];
        const charDesc = ctx?.characters?.[ctx?.characterId]?.description || "";
        const personaDesc = ctx?.power_user?.persona_description || "";

        const res = {
            identity: "", bodyDesc: "", thought: "", pose: "",
            mouth: "", chest: "", vag: "", womb: "", anal: "",
            headWear: "", neckWear: "", braWear: "", topWear: "",
            pantyWear: "", bottomWear: "", sockWear: "", shoeWear: ""
        };

        const recent = chatArr.slice(-6);
        const allSents = [];
        for (let i = recent.length - 1; i >= 0; i--) {
            const raw = (recent[i]?.mes || "").replace(/<think[\s\S]*?<\/think>/gi, "").replace(/<think_nya>[\s\S]*?<\/think_nya>/gi, "");
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

    // 【V22 核心扩充】：所有核心数值按钮升级为「四维解剖 + 220字三段式深层递进心声」
    function getDynamicMetricDetail(type, v, u, liveCtx) {
        const ovr = v.按钮详情?.[type];
        const phy = detectPhysiqueProfile(v);
        const map = {
            cockLove: {
                val: Number(v.核心数值?.对肉棒好感度) || 0, rev: false,
                st: ["抗拒排斥•本能戒备", "工具麻木•形状适应", "食髓知味•含泪渴求", "痴迷崇拜•主动跪舔", "肉棒至上•终极母狗"],
                d: [
                    `【🔬 神经与粘膜对雄性阳具的反应】：${u}在意识层面仍将粗硬滚烫、血管盘虬的雄性肉棒视为极具威胁的侵犯异物；面对雄性费洛蒙压迫时，瞳孔微缩、心跳加速，双腿本能内扣夹紧。\n【💦 生理排斥与应激实况】：口腔唾液腺与下体前庭大腺仅因紧张分泌少量保护性粘液，括约肌处于防备性紧绷状态。\n💭【${u}的三层递进心声】：“*【生理层】呜……光是感受到那根青筋暴起、又粗又烫的男人肉棒隔着空气散发的腥热气味，我的小肚子就本能地一阵阵发紧，连鸡皮疙瘩都冒出来了💦！｜【心理层】太粗鲁、太有侵略性了……那种硕大丑陋的东西要是真的强行捅进我的身体里，绝对会把娇嫩的肉壁彻底撑坏撕裂的，我绝对不能向这种原始的雄性暴力屈服😳！｜【欲望层】可是……为什么当男人的气息逼近的时候，我的膝盖却莫名其妙地有点发软，连尾椎骨最底下都窜起了一丝说不清道不明的酥麻感呢……❤️*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：理智上的戒备已被频繁的肉体接触所瓦解。${u}的口腔舌苔与阴道肉褶已经完全记住了阳具粗硬的柱身棱角与冠沟形状，将其视作熟悉的生计工具或食粮。\n【💦 生理顺应与润滑实况】：只要闻到浓烈的雄性石楠花麝香或被龟头抵住穴口，花唇便会条件反射般软化充血、自动泌出滑腻淫水以减少抽插摩擦痛楚。\n💭【${u}的三层递进心声】：“*【生理层】唔……嘴唇和下面的花唇一碰到那根滚烫坚硬的柱身，连思考都还没来得及，里面的肉壁就已经自己软下来分泌出润滑的粘液了😳💦。｜【心理层】明明在脑子里一直告诉自己，这不过是为了应付场面或者完成交易而不得不承受的肉棒而已，我已经习惯了、麻木了，才不是因为喜欢它呢！｜【欲望层】但每当硕大的龟头棱角刮过阴道内壁最敏感的那块软肉时，腰眼还是会不受控制地酸软塌下去……身体比嘴巴诚实太多了啊……🥵❤️*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：矜持外壳已被粗暴撞碎！${u}对滚烫大肉棒产生了深入骨髓的生理饥渴，视线总是不由自主地黏在男人胯下鼓起的肉包上，喉咙发干、下腹阵阵发酸。\n【💦 腔道空虚与吸吮实况】：阴道内壁层叠的媚肉一缩一缩地空虚蠕动，渴望被硕大龟头狠狠撑开填满，连呼吸都带着讨好的热气。\n💭【${u}的三层递进心声】：“*【生理层】哈啊、哈啊……骚穴里面又空又痒，像有无数只小虫子在肉褶里钻来钻去一样难受，透明的淫水已经顺着大腿根流湿了一大片了💦！｜【心理层】什么矜持自重全都撑不住了……试过被滚烫粗大的真肉棒狠狠填满到子宫口的滋味之后，手指和假玩具根本满足不了我这具食髓知味的身体了呀！｜【欲望层】好想被插进来……求求你快解开裤子，把那根青筋跳动的大肉棒一口气捅进我的最深处，把里面所有空虚发痒的褶子全部狠狠撑平吧🥵❤️！*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：彻底沉溺于阳具崇拜的发情母犬！将舔舐、含弄与夹紧大肉棒视作人生最高奖赏，一见到勃起巨物便双膝发软跪倒在地。\n【💦 唾液与淫水泛滥实况】：主动伸出粉嫩香舌沿着马眼与冠状沟狂热舔舐，将腥咸的前列腺液当成琼浆玉液吞咽，身后蜜臀高高翘起摇晃求操。\n💭【${u}的三层递进心声】：“*【生理层】唔嗯、啾噜♡……大肉棒顶在舌尖上沉甸甸、热乎乎的触感太棒了，浓烈的包皮垢和前列腺液腥味一冲进鼻腔，我的骚逼就自己喷出一股热流了🥵💦！｜【心理层】现在的我已经彻头彻尾变成大肉棒的狂热信徒了，什么身份、什么脸面，在雄性伟岸的巨物面前连一点价值都没有！｜【欲望层】快赏赐给人家吧♡！用这根滚烫的大鸡巴狠狠抽打我的脸颊、捅穿我的喉咙和骚逼，把人家彻彻底底干成只属于大肉棒一个人的形状吧💦❤️❤️！*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：【⚠️ 第五阶段·终极阳具奴隶】大脑皮层已被粗大肉棒与滚烫浓精100%支配！离开肉棒的填塞就会陷入濒死般的戒断恐慌。\n【💦 全孔痉挛与阿片高潮】：上下两张嘴同时流涎喷水，子宫口主动向下脱垂迎合龟头，哭喊着祈求天下所有雄性将她当成公用肉套子操干至死！\n💭【${u}的三层递进心声】：“*【生理层】啊嘿、呕咕♡……只要身体里有一秒钟没有大鸡巴插着，全身的骨头和肉洞就会痛痒得直抽筋、眼泪鼻涕口水止不住地往下流🥵💦！｜【心理层】${u}不是人，${u}只是天生为了包裹大肉棒、承接臭精液才长出来的三个活体肉套子呀！没有肉棒大人的宠幸，人家连呼吸的资格都没有！｜【欲望层】插进来、快把所有的洞全都塞满吧♡！不管是粗的、弯的还是长满疙瘩的肉棒，请一辈子插在人家的子宫里不要拔出来，把人家活活操死在肉棒上吧❤️❤️❤️！！*”`
                ]
            },
            lust: {
                val: Number(v.核心数值?.性欲程度) || 0, rev: false,
                st: ["表面克制•余韵温吞", "春情暗涌•乳尖发硬", "欲火焚身•淫水湿裤", "重度发骚•夹腿磨逼", "狂暴发情•三穴喷水"],
                d: [
                    `【🔬 体内荷尔蒙与情欲实况】：表面维持着平静或事后的温吞倦怠，但被开发过的敏感躯体对衣料刮蹭与空气流动依然异常敏锐（${liveCtx.chest || "稍微动作便会牵动敏感神经"}）。\n【💦 体表微热与余韵】：肌肤底层泛着淡淡的潮热，下身残留着微弱的空虚酸软感。\n💭【${u}的三层递进心声】：“*【生理层】呼……现在身体总算稍微平静下来一点了，只是被折腾过的下身和乳尖还残留着一阵阵温吞吞的酸胀余温💦。｜【心理层】刚才那种不受控制的热潮真是太危险了，我得趁现在脑子清醒赶紧平复呼吸、整理好仪态，绝不能让人看出异样来😳。｜【欲望层】不过……只要稍微走动一下，衣服布料轻轻擦过乳尖和腿根的时候，小腹深处那点还没散干净的火苗好像随时都会重新燃起来呢……❤️*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：小腹深处升起一股挥之不去的燥热暗流！雌性荷尔蒙在血管里悄然沸腾，令耳根与锁骨泛起诱人的桃花色。\n【💦 乳尖充血与腿心微潮】：胸前两颗乳头在布料下充血硬挺，两腿之间泛起黏腻潮意，肉穴深处时不时传来一下空虚的抽搐。\n💭【${u}的三层递进心声】：“*【生理层】唔……身体怎么越来越热了😳？胸口的两粒尖尖自己在衣服下面充血发硬、顶得布料生疼，连两条腿中间也开始湿漉漉地发黏了💦！｜【心理层】明明我现在根本不想发春的，为什么这具身体的荷尔蒙这么不听使唤，稍微受一点点刺激就开始自己做起交配的准备了啊？｜【欲望层】小肚子里面一直酸溜溜地一抽一抽，好想找个没人的地方伸手进裤子里揉一揉发胀的阴蒂，或者让一双火热的大手直接按上来呀……🥵❤️*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：滚烫的情欲之火烧遍四肢百骸！双颊浮现淫靡酡红，鼻息间呼出滚烫带香的喘息，理智正被汹涌的春潮迅速淹没。\n【💦 爱液拉丝与阴蒂跳动】：包皮下的阴蒂肉珠充血肿大、一跳一跳地发麻，大量透明拉丝的淫水早已将贴身底裤或大腿内侧浸得泥泞不堪！\n💭【${u}的三层递进心声】：“*【生理层】哈啊、哈啊……不行了，身体烫得像发高烧一样，小穴里涌出来的滚烫淫水已经把大腿根完全弄湿、顺着腿肚往下淌白线了🥵💦！｜【心理层】理智快要被这股邪火烧光了，两条腿不管怎么死死夹紧摩擦，不仅止不住里面的骚痒，反而把肿大的阴蒂磨得越来越麻、越来越空虚！｜【欲望层】谁来帮帮我灭火啊……快用粗硬滚烫的东西狠狠捅进我湿淋淋的肉洞里用力抽插搅拌，再不插进来我真的要发疯了呀💦❤️❤️！*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：重度发情失控状态！全身每一寸肌肤都烫得像火炉，稍微吹过一丝冷风都会激起全身鸡皮疙瘩与浪吟。\n【💦 夹腿自磨与催情体香】：双腿死死交叠磨蹭着充血外翻的阴唇，全身毛孔散发着浓烈到刺鼻的雌性发情骚香，嘴角溢出晶莹涎水。\n💭【${u}的三层递进心声】：“*【生理层】唔嗯♡……烧起来了、全身每一根神经都在着火！乳头硬得像石子，外翻的阴唇和阴蒂肿得一碰就飙水，连呼吸都是甜腻发骚的母狗味🥵💦！｜【心理层】什么羞耻心、什么矜持全都见鬼去吧！现在的我满脑子只想着交配、只想着被男人的大肉棒按在身下狂暴地撞击内射！｜【欲望层】快过来肏我呀♡！把我的奶子抓烂、把我的骚逼捅穿，用滚烫的浓精把人家发情的子宫彻彻底底浇透吧❤️❤️！*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：【⚠️ 第五阶段·狂暴发情母畜】大脑已被发情毒素彻底浸泡短路！24小时处于永不退潮的强制发情期，除了交配、受孕与高潮外再无任何思考能力。\n【💦 喷泉漏水与子宫哀鸣】：骚穴如同坏掉的水龙头般噗嗤噗嗤向外喷涌滚烫淫水，宫颈口一张一合地吐着白沫求欢！\n💭【${u}的三层递进心声】：“*【生理层】啊啊、啊嘿♡……发情一秒钟都停不下来了！骚穴和屁眼24小时都在噗嗤噗嗤往外喷淫水，子宫口饥渴得自己往下脱垂张开、吐着白沫要吃精液了🥵💦！｜【心理层】脑子已经被发情的春药毒汁彻底泡烂了，除了交配受孕之外连一句完整的话都想不出来，完完全全变成一只永久发情的雌性牲畜了呀！｜【欲望层】快点来十个、百个男人把人家按在地上轮奸吧♡！不把这具发骚的母狗身体操到休克怀上小崽子，就绝对不准停下来呀❤️❤️❤️！！*”`
                ]
            },
            corr: {
                val: Number(v.核心数值?.淫乱恶堕) || 0, rev: false,
                st: ["死守矜持•道德防备", "风尘浸染•自我麻痹", "食髓知味•放荡迎合", "下贱娼妇•肉器自觉", "脑髓熔断•公用肉便器"],
                d: [
                    `【🔬 道德底线与自我认知解剖】：心底仍保留着正常人的自尊与羞耻底线，对暴露、视奸与粗鄙亵渎感到屈辱，试图在困境中守住最后一丝体面。\n💭【${u}的三层递进心声】：“*【生理层】虽然身体因为外界的刺激而有些发烫发颤，但我的双手依然本能地护在胸前和腿间💦。｜【心理层】无论眼前的处境多么难堪，我也绝对不能丢掉最后一点自尊与底线，更不能变成那种不知廉耻、随波逐流的下流女人😳！｜【欲望层】只希望这具过于敏感的肉体争气一点，千万别在最关键的时候因为快感而背叛我的意志啊……*”`,
                    `【🔬 道德底线与自我认知解剖】：在反复的肉体交易或快感冲刷下，贞洁观念已被磨灭大半。学会了用麻木与破罐破摔来麻痹自己，将出卖或敞开肉体视作习以为常的日常。\n💭【${u}的三层递进心声】：“*【生理层】看着自己双腿之间被男人折腾得红肿湿润、还在往外滴着白浊的私处，身体已经不再像最开始那样剧烈抗拒发抖了💦。｜【心理层】反正清白和贞洁早就已经不在了，再怎么哭闹矜持也改变不了既定的事实，倒不如把这副身体当成换取生存或利益的麻木工具算了😳。｜【欲望层】而且……在放下了那些无谓的道德包袱之后，被男人粗暴按在身下贯穿的时候，身体好像反而更容易体会到那种直冲脑门的酥麻快感了呢……❤️*”`,
                    `【🔬 道德底线与自我认知解剖】：廉耻防线已被彻底冲垮！开始在背德与被粗暴亵渎的过程中品尝到灭顶的背德快感，身体比嘴巴更早一步学会了摇臀迎合。\n💭【${u}的三层递进心声】：“*【生理层】哈啊……每当被男人用下流粗鄙的字眼辱骂、或者被按着脑袋强行深喉内射的时候，我的骚穴反而会条件反射般夹得更紧、流出更多淫水🥵💦！｜【心理层】我已经彻底回不到从前那个清白端庄的自己了，原来堕落成一只只知道贪图肉欲的坏女人，是这么让人上瘾、这么爽到骨子里的事情呀！｜【欲望层】既然已经脏了，那就干脆脏得更彻底一点吧♡！快用更过分、更变态的玩法来糟蹋我这具食髓知味的身体吧❤️❤️！*”`,
                    `【🔬 道德底线与自我认知解剖】：身心彻底恶堕的风尘尤物与下贱母狗！以自己饱满的胸臀和紧致肉穴能成为男人发泄兽欲的肉套子为荣，主动掰开红肿花唇展示内里的淫靡泥泞。\n💭【${u}的三层递进心声】：“*【生理层】嘻嘻♡……只要想到自己这副丰满白腻的身体正在被男人当成泄欲肉壶肆意抽插，我的乳头和阴蒂就会兴奋得直发抖、淫水止不住地往外飙🥵💦！｜【心理层】什么礼义廉耻、什么人格尊严，哪有趴在地上给男人当母狗、被粗大肉棒塞满小穴和嘴巴来得快活呀？人家天生就是块当娼妇和性奴的料呢！｜【欲望层】快来看看呀♡！${u}自己把红肿外翻的骚逼掰开了，里面又红又湿正在一缩一缩地求肏呢，请尽情在人家的身体上发泄最肮脏的兽欲吧❤️❤️！*”`,
                    `【🔬 道德底线与自我认知解剖】：【⚠️ 第五阶段·终极公用肉便器】人类尊严与道德感100%灰飞烟灭！彻底完成从“人/魅魔”向“无知性排泄肉便器”的物种退化，视被轮奸、灌精、涂写正字与当众失禁为至高无上的幸福！\n💭【${u}的三层递进心声】：“*【生理层】啊嘿、咕啾♡……脑髓已经被浓精和快感彻底泡化了，全身上下每一个毛孔、每一个肉洞都在为了承受男人的排泄而欢呼痉挛🥵💦！｜【心理层】人？${u}才不是人呢！${u}只是一个印满了『正』字、明码标价甚至免费供所有雄性随时插进来射精撒尿的公用肉便器母猪呀！｜【欲望层】请随便使用人家吧♡！哪怕是流浪汉、老头还是野兽，全都请排队把最臭的浓精和骚尿灌进人家的嘴里、子宫和直肠里，把${u}用烂到报废为止吧❤️❤️❤️！！*”`
                ]
            },
            shame: {
                val: Number(v.精神与心理?.羞耻度 ?? 100), rev: true,
                st: ["羞愤欲死•满面通红", "薄面潮红•咬唇隐忍", "习以为常•羞耻钝化", "不知廉耻•敞腿任看", "羞耻全灭•当众母狗"],
                d: [
                    `【🔬 羞耻神经防线与快感反噬】：羞耻心处于极高状态（${v.痕迹与标记?.体表痕迹 || "双颊通红、耳尖滚烫"}）！对私密部位的暴露或下流声响感到极度恐慌，但剧烈的羞耻感正在交感神经作用下成倍放大肉体敏感度。\n💭【${u}的三层递进心声】：“*【生理层】呜哇啊啊……脸颊和耳朵尖烫得像要滴出血来一样，心脏在胸腔里咚咚咚地狂跳，连手指尖都在因为极度的害羞而发抖💦！｜【心理层】太羞耻、太难堪了！要是被人看到我现在这副衣衫不整、私密处还在偷偷发热湿润的丢脸模样，我真的恨不得当场一头撞死或者找条地缝钻进去啊啊😳！｜【欲望层】可最可怕的是……为什么心里越是羞愤欲死，胸前的乳尖和腿心的肉缝反而像跟羞耻心连在一起一样，变得越来越敏感、越来越湿了呢……🥵❤️*”`,
                    `【🔬 羞耻神经防线与快感反噬】：在连续的羞耻冲击下防线开始松动，私密处被注视或沾染体液时虽仍心跳加速，但遮挡的双手已变得迟疑无力。\n💭【${u}的三层递进心声】：“*【生理层】别、别用那种火辣辣的眼神一直盯着我的胸口和两腿之间看啊😳💦……被盯得全身皮肤都在发麻发热，腿软得根本并拢不了了！｜【心理层】虽然脑子里还是觉得害羞得要命，想要伸手去挡住暴露出来的春光，可抬起的手臂却软绵绵的一点力气都使不上来。｜【欲望层】甚至……在被那样肆无忌惮地视奸着私密部位的时候，小穴深处居然可耻地一缩一缩，分泌出了更多滑腻的羞耻汁水……❤️*”`,
                    `【🔬 羞耻神经防线与快感反噬】：羞耻感已被风尘或调教磨灭大半，哪怕光着下身当面擦拭腿根精液、或衣衫不整露出乳肉，内心也毫无波澜，甚至隐隐将视线视作理所当然。\n💭【${u}的三层递进心声】：“*【生理层】光着下半身站在房间里，任由微凉的空气吹拂着红肿湿润的阴唇，顺手拿纸巾擦掉大腿内侧流下来的黏腻白浊💦。｜【心理层】害羞？全身上下每一寸皮肤、每一条肉缝早就被男人们看光、摸遍、捅穿过无数次了，现在再遮遮掩掩的还有什么意义呢？｜【欲望层】倒不如说，这种不穿内裤真空走动、随时都能把私处亮出来的放松感，反而让我的身体觉得既自然又隐隐有些暗爽呢……🥵*”`,
                    `【🔬 羞耻神经防线与快感反噬】：廉耻心几乎荡然无存！不仅对赤裸和满身精斑毫不在意，反而会在被人视奸私处时兴奋得阴蒂充血、淫水狂流，主动分开大腿方便旁人观赏。\n💭【${u}的三层递进心声】：“*【生理层】哈啊♡……只要感受到男人们下流火热的视线黏在我的奶子和骚逼上，我的阴蒂就会兴奋得充血勃起，淫水噗嗤一声就涌出来了🥵💦！｜【心理层】廉耻心那种无聊的东西早就喂狗吃啦！这么白腻丰满的极品肉体，本来就应该赤裸裸地剥干净展示给男人们看才对呀！｜【欲望层】快凑近点看个清楚吧♡！看看人家被操得红肿外翻的花唇和正在一抽一抽漏精的穴口有多下流，越盯着人家看、人家流的水就越多哟❤️❤️！*”`,
                    `【🔬 羞耻神经防线与快感反噬】：【⚠️ 第五阶段·羞耻心彻底归零】哪怕在闹市街头被扒光栓上狗链溜街、当众被操到大小便失禁与阿片翻白眼，也会因为被围观羞辱而直接迎来灭顶喷潮！\n💭【${u}的三层递进心声】：“*【生理层】啊啊、啊嘿♡……好多人、好多视线像针一样扎在人家光溜溜满是精斑和正字的母狗身体上，爽得尿道口和骚穴同时狂喷水高潮了🥵💦！｜【心理层】羞耻心已经变成0%啦！被人当众扒光围观、被人拍照录像、被人指着鼻子骂下贱肉便器，对${u}来说就是全天下最棒的催情春药呀！｜【欲望层】大家都来看呀♡！快来围观${u}像母狗一样四脚朝天张开大腿、一边翻白眼吐舌头一边当众潮吹漏尿失禁的痴态吧❤️❤️❤️！！*”`
                ]
            },
            obey: {
                val: Number(v.精神与心理?.服从度) || 0, rev: false,
                st: ["孤高抗拒•强撑气场", "委曲求全•被动妥协", "温顺听话•熟练配合", "摇尾乞怜•任打任操", "绝对盲从•肉奴母犬"],
                d: [
                    `【🔬 意志防线与服从实况】：当前行为准则为「${v.调教进度?.规矩与日程 || "维持自我意志，抗拒无理摆布"}」。表面极力维持着防备或自尊气场。\n💭【${u}的三层递进心声】：“*【生理层】紧咬着下唇稳住有些发软发颤的膝盖，哪怕呼吸有些急促，脊背依然死死挺直不肯弯下分毫💦。｜【心理层】一定要守住自己的底线与气场！一旦在男人面前露出一丝一毫的软弱和顺从，接下来绝对会被得寸进尺地吞得骨头都不剩😳！｜【欲望层】哪怕这具身体内部再怎么敏感躁动，我也绝不会听从任何折辱尊严的命令！*”`,
                    `【🔬 意志防线与服从实况】：在局势逼迫、金钱压力或肉体酸软下学会了被动妥协，哪怕心里还有一丝不甘，身体也会老老实实地顺从配合。\n💭【${u}的三层递进心声】：“*【生理层】肩膀无力地垂落下来，顺着对方的力道或要求乖乖调整着身体姿势，双腿不再僵硬地死死抗拒😳💦。｜【心理层】人在屋檐下不得不低头……既然反抗只会换来更粗暴的对待或者更大的麻烦，不如先委曲求全地顺从配合，把眼前这一关应付过去再说吧。｜【欲望层】而且……当放弃了徒劳的挣扎、乖乖听话任由对方摆布的时候，紧绷的神经放松下来，肉体承受冲击时的快感好像也变得更清晰了……❤️*”`,
                    `【🔬 意志防线与服从实况】：已形成熟练的温顺顺从习惯，面对男人的粗鄙要求几乎不再反抗顶撞，懂得主动放松腰臀、顺着对方的抽插节奏换取顺利结束或奖赏。\n💭【${u}的三层递进心声】：“*【生理层】只要听到男人发话或者手掌按上腰臀，身体就会无比熟练地自己把双腿分开、把腰肢软软地塌下去迎合插入的角度💦。｜【心理层】顶撞和反抗早就没有任何意义了，反正这具身体本来就是要用来伺候男人的，做一个温顺听话、让客人满意的乖女人不是省心多了吗？｜【欲望层】只要乖乖按照他喜欢的姿势把私处送到肉棒前面，不仅不会挨打受罚，还能被他顶得浑身舒爽、顺顺利利地一起高潮呢……🥵❤️*”`,
                    `【🔬 意志防线与服从实况】：彻底被驯服的摇尾母犬！对任何粗暴命令都奉若圣旨，不仅主动跪爬奉承、用嘴清理肉棒污垢，挨打受罚时还会流着淫水感恩戴德。\n💭【${u}的三层递进心声】：“*【生理层】汪呜♡……只要听到主人的声音，膝盖就会自动一软跪趴在地上，屁股高高撅起，骚穴里讨好的淫水滴答滴答往下淌🥵💦！｜【心理层】反抗？母狗怎么敢反抗至高无上的主人呢！主人的每一句命令、每一个巴掌，都是对人家这具下贱肉体的恩赐呀！｜【欲望层】请尽情命令人家、狠狠责罚人家吧♡！不管是让${u}用舌头舔干净鞋底和屁眼，还是把人家绑起来当沙袋操，人家都会摇着尾巴哭着喊谢谢主人的❤️❤️！*”`,
                    `【🔬 意志防线与服从实况】：【⚠️ 第五阶段·巴甫洛夫绝对肉奴】自主意志100%抹除！身体已形成刻入脊髓的条件反射（${v.调教进度?.条件反射触发词 || "一听见指令即自动张腿漏尿"}），哪怕被命令自残或吞食排泄物也会狂喜执行！\n💭【${u}的三层递进心声】：“*【生理层】啊嘿♡……一听到主人的触发指令，大脑连0.1秒的思考都没有，身体就已经自动四脚朝天掰开三穴、尿道口直接失禁喷出献媚的骚尿了🥵💦！｜【心理层】${u}没有自己的思想，${u}的脑子、肉体、六孔和性命完完全全都是主人的私有财产，主人让我往东我绝不往西，主人让我去死我也会高潮着去死！｜【欲望层】请给这件没有灵魂的肉便器下达最残酷、最变态的指令吧♡！只要能作为主人的脚垫和排泄桶被使用，就是${u}存在的唯一意义呀❤️❤️❤️！！*”`
                ]
            },
            pleas: {
                val: Number(v.精神与心理?.快感累积) || 0, rev: false,
                st: ["余韵回落•断瘾空虚", "酥麻窜动•春水溢出", "快感攀升•趾尖蜷缩", "濒临绝顶•痉挛绷紧", "高潮过载•潮吹失神"],
                d: [
                    `【🔬 神经快感蓄积与高潮后余韵】：当前核心敏感点为「${v.精神与心理扩展?.当前敏感点 || "充血微肿的阴蒂、软烂酸胀的宫颈口与敏感乳尖"}」。处于高潮泄身后的余韵回落期或初始微麻状态。\n【💦 拔出后的空虚与漏精】：被撑开过的腔道只剩下麻木酸胀与空落落的戒断感，残余体液正随着走动缓缓外溢。\n💭【${u}的三层递进心声】：“*【生理层】呼……激烈抽插和高潮过去之后，全身的肌肉还在一阵阵轻微地抽动，被粗暴撑开过的下面只剩下一股空落落的酸胀麻木感💦。｜【心理层】明明刚才已经被折腾得够呛了，现在应该趁着快感退下去好好歇口气、把流出来的脏东西收拾干净才对。｜【欲望层】可是……胸口发硬的乳尖和肿胀的阴蒂还是敏感到极点，稍微被衣服或纸巾擦过一下，尾椎骨就会重新窜起一缕让人腿软的电流余韵……❤️*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：酥麻滚烫的快感电流正顺着尾椎骨一路窜向小腹与后脑！敏感带充血发烫，粘膜在摩擦下一缩一缩地泌出润滑爱液。\n💭【${u}的三层递进心声】：“*【生理层】唔嗯……来了，那股麻酥酥、热乎乎的快感电流又顺着脊椎骨一路往小肚子和后脑勺上窜了，腿根发酸得直打哆嗦😳💦！｜【心理层】明明才刚开始没多久，为什么敏感带的反应这么剧烈，连呼吸的节奏都被这股酥麻感彻底打乱了啊？｜【欲望层】下面的肉壁已经在自己一缩一缩地分泌爱液迎合了……要是再继续摩擦那个最敏感的地方，快感真的要刹不住车了啦🥵❤️！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：密集汹涌的快感浪潮不断拍打中枢神经！每一次刮蹭与顶弄都令全身剧烈颤抖、十根脚趾本能地紧紧蜷缩，腿心泥泞一片。\n💭【${u}的三层递进心声】：“*【生理层】啊啊、哈啊……不行了，快感像涨潮的海水一样一波接一波往脑门上拍，爽得十根脚趾头都麻得死死蜷缩起来了🥵💦！｜【心理层】理智快要抓不住了，嘴唇根本关不上，又甜又腻的浪叫声一声接一声地从嗓子眼里往外漏，完全压不住身体的战栗！｜【欲望层】好爽、太爽了♡！那块最敏感的软肉每次被狠狠刮过都像在脑子里放烟花一样，快再用力一点顶那里呀❤️❤️！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：快感已蓄积至决堤崩溃的临界点！小腹子宫与阴道括约肌剧烈绷紧痉挛，如同通了万伏高压电，只要再受一丝刮蹭就会引爆灭顶绝顶！\n💭【${u}的三层递进心声】：“*【生理层】要、要去了！小肚子最深处和整个阴道括约肌全都绷紧到了极限，像有一团滚烫的高压电在子宫口疯狂乱撞，随时都要炸开了🥵💦！｜【心理层】千万别在这个时候停下来寸止折磨我啊！脑子里已经一片空白嗡嗡作响了，除了高潮之外什么都想不了了！｜【欲望层】求求你快再重重地顶最后一下、再捏一下阴蒂吧♡！让我去、让我痛痛快快地高潮泄出来呀❤️❤️❤️！！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：【⚠️ 第五阶段·连续绝顶脑过载】灭顶高潮如海啸般连续轰击大脑！多巴胺与内啡肽彻底烧穿理智，双眼翻白、香舌吐出，滚烫潮吹与失禁液体从痉挛的穴口狂喷而出！\n💭【${u}的三层递进心声】：“*【生理层】啊゛啊゛啊——去了去了又去了♡！！脑子轰的一声全炸成白光了，骚逼和尿道口像决堤一样噗嗤噗嗤狂喷潮吹和失禁骚尿，浑身抽搐得停不下来🥵💦！｜【心理层】连第一次高潮还没过去，第二次、第三次绝顶又直接砸在子宫上了！阿片受体彻底烧穿了，眼珠子翻白、舌头吐在外面连话都说不出来了呀！｜【欲望层】太爽了、要被高潮活活爽死了♡！哪怕已经失禁喷干了水分，也请继续插着痉挛的骚穴不要停，让${u}在永无止境的绝顶地狱里融化掉吧❤️❤️❤️！！*”`
                ]
            },
            sta: {
                val: Number(v.身体?.体力 ?? 100), rev: true,
                st: ["精力充沛•气息平稳", "微带倦意•腰腿酸软", "香汗淋漓•双腿打颤", "濒临虚脱•瘫软无力", "彻底脱力•失神肉泥"],
                d: [
                    `【🔬 肌肉耐受与体力消耗实况】：体力充沛（${Number(v.身体?.体力 ?? 100)}/100），呼吸尚算平稳，身体足以支撑接下来的日常活动或进一步高强度折腾。\n💭【${u}的三层递进心声】：“*【生理层】呼……深吸一口气，目前四肢和腰腹的力气还算充足，呼吸也已经平复下来了💦。｜【心理层】趁着现在体力还维持在不错的状态，我得赶紧把眼前的事务处理妥当，保持好自己的节奏。｜【欲望层】这具柔韧的身体还远远没有到达极限，就算接下来还要面对更激烈的场面，应该也完全撑得住吧……*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：刚刚承受过剧烈的肉体撞击与抽插折腾，双腿内侧肌肉略微酸软发颤，小腹因为蓄满体液或反复收缩而带着明显的坠胀倦意。\n💭【${u}的三层递进心声】：“*【生理层】哈……刚才那一通粗暴的折腾真是把人骨头都快撞散架了，现在大腿内侧和腰眼还一阵阵发酸发软，小肚子也沉甸甸地往下坠😳💦。｜【心理层】虽然还不至于累倒，但身体确实已经挂上了一层懒洋洋的倦意，连迈步走动的时候膝盖都有点发飘。｜【欲望层】这种刚刚完事之后浑身微汗、肌肉酸软无力的感觉，反而让下身被撑开过的余韵显得更加清晰粘腻了……❤️*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：体力消耗过半，全身被黏腻香汗浸透，凌乱发丝贴在潮红面颊与锁骨窝处，膝盖发软打颤，连站立都需要扶着东西借力。\n💭【${u}的三层递进心声】：“*【生理层】呜……力气已经被刚才连续不断的冲击抽走一大半了🥵💦，全身上下像刚从水里捞出来一样全是黏腻的香汗，两条腿像筛糠一样直打哆嗦！｜【心理层】好累、腰快要断掉了……现在如果不扶着墙或者床沿的话，根本连站都站不稳，更别提有力气去推开男人了。｜【欲望层】可偏偏在身体累到脱力发软的时候，防御力降到了最低，别人随便摸一下都能让我浑身颤抖着漏出娇喘声来……❤️*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：体力濒临枯竭！高强度的连续侵犯抽干了全身每一丝力气，双腿筛糠般痉挛，只能像没骨头一样软绵绵地瘫倒任由摆布。\n💭【${u}的三层递进心声】：“*【生理层】哈啊、哈啊……肺里像火烧一样喘不上气，连抬起一根手指头或者并拢大腿的力气都彻底被榨干了🥵💦！｜【心理层】不行了，身体已经到达极限了，现在就像一滩融化的奶油一样软绵绵地瘫在那里，彻底失去了任何反抗和逃跑的能力。｜【欲望层】随便你怎么摆弄我吧……不管是要把我翻过来继续后入，还是掰开双腿灌精，这具累垮的肉体都只能乖乖承受了呀💦❤️……*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：【⚠️ 彻底虚脱休克边缘】全身肌肉彻底脱力瘫痪！意识在极度疲惫与高潮余韵中陷入半昏迷状态，唯有被玩坏的肉穴还在凭肌肉记忆一抽一抽地吐着白沫！\n💭【${u}的三层递进心声】：“*【生理层】唔……眼前一阵阵发黑，全身的骨头和肌肉已经彻底罢工瘫痪了，连眼皮都沉重得抬不起来，进入了随时会昏死过去的虚脱休克状态🥵💦！｜【心理层】意识好远、好模糊……已经被彻彻底底地操垮、玩坏掉了，连思考自己在哪里的力气都消失了。｜【欲望层】可就算人已经累得半昏迷过去了，下面被开发透的骚逼和子宫却还在凭着肌肉本能一缩一缩地自动痉挛吐着白浊精沫呢……❤️❤️*”`
                ]
            }
        };
        const cfg = map[type] || map.cockLove;
        const t = tier5(cfg.val, cfg.rev);
        if (ovr && ovr.desc) {
            return {
                val: cfg.val,
                stage: ovr.stage || cfg.st[t],
                desc: `【当前数值：${cfg.val}/100 · 第${t + 1}阶段「${ovr.stage || cfg.st[t]}」｜体质：${phy.name}】\n${ovr.desc}\n💭【${u}的三层递进心声】：“*${cleanThoughtText(ovr.thought || "……")}*”`
            };
        }
        return {
            val: cfg.val,
            stage: cfg.st[t],
            desc: `【当前数值：${cfg.val}/100 · 第${t + 1}阶段「${cfg.st[t]}」｜体质：${phy.name}】\n${cfg.d[t]}`
        };
    }

    // 【V22 全量6大板块构建器】：集成所有黄油重口要素与 200字+ 三段式长心声
    function buildFullFallbackCategories(u, c, v) {
        const mk = (rk, desc, revBar = false) => ({ rawKey: rk, desc, ...fmtKey(rk, revBar) });
        const live = extractDynamicContext(u, c);
        const phy = detectPhysiqueProfile(v);
        const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {}, prof = v.档案 || {}, rt = v.实况 || {}, wear = v.穿搭 || {}, preg = v.受孕与生理 || {}, ovr = v.按钮详情 || {};

        const cockM = getDynamicMetricDetail("cockLove", v, u, live);
        const lustM = getDynamicMetricDetail("lust", v, u, live);
        const corrM = getDynamicMetricDetail("corr", v, u, live);
        const shameM = getDynamicMetricDetail("shame", v, u, live);
        const obeyM = getDynamicMetricDetail("obey", v, u, live);
        const pleasM = getDynamicMetricDetail("pleas", v, u, live);
        const staM = getDynamicMetricDetail("sta", v, u, live);

        const vagCnt = Number(cnt.性交?.小穴) || 0, mouthCnt = Number(cnt.性交?.口) || 0, analCnt = Number(cnt.性交?.屁眼) || 0, titCnt = Number(cnt.性交?.乳穴) || 0, footCnt = Number(cnt.性交?.足腿) || 0, beastCnt = Number(cnt.性交?.兽交异种) || 0;
        const creampie = Number(cnt.射精?.内射) || 0, facialCnt = Number(cnt.射精?.颜射体外) || 0, swallowCnt = Number(cnt.精液摄入?.吞精次数) || 0, swallowMl = Number(cnt.精液摄入?.累计毫升) || 0;
        const orgasmCnt = Number(cnt.高潮?.总数) || 0, forceOrgCnt = Number(cnt.高潮?.强制) || 0, edgeCnt = Number(cnt.高潮?.寸止) || 0;
        const leakCnt = Number(cnt.失控?.失禁) || 0, squirtCnt = Number(cnt.失控?.喷潮) || 0, ahegaoCnt = Number(cnt.失控?.阿嘿颜) || 0;
        const hookerCnt = Number(cnt.交易?.接客卖身) || 0, gangCnt = Number(cnt.交易?.轮奸群交) || 0, sleepCnt = Number(cnt.交易?.睡眠昏迷奸) || 0;
        const milkCnt = Number(cnt.泌乳?.喷乳次数) || 0, milkMl = Number(cnt.泌乳?.累计毫升) || 0;

        let mouthMl = Number(sp.口内毫升) || 0, vagMl = Number(sp.小穴毫升) || 0, wombMl = Number(sp.子宫毫升) || 0, analMl = Number(sp.屁眼毫升) || 0;
        if (wombMl === 0 && creampie > 0 && /内射|灌满|精液.*滴|精液.*渗|白浊/.test(live.womb + live.vag)) {
            wombMl = 15; vagMl = 8;
        }
        const totalMl = mouthMl + vagMl + wombMl + analMl;
        const caps = calcHoleCapacities(v);

        const corr = Number(v.核心数值?.淫乱恶堕) || 0, lust = Number(v.核心数值?.性欲程度) || 0, pleas = Number(v.精神与心理?.快感累积) || 0;
        const vagWidth = (1.5 + Math.min(4.5, (vagCnt / phy.mult) * 0.04)).toFixed(1);
        const vagClose = Math.max(10, Math.round(100 - (vagCnt / phy.mult) * 0.6 - ((wombMl + vagMl) > 0 ? 18 : 0)));
        const clitSize = (4.0 + Math.min(9.0, (orgasmCnt / phy.mult) * 0.08 + pleas * 0.03)).toFixed(1);
        const peeVal = Math.min(100, Math.round(15 + lust * 0.35 + pleas * 0.35 + leakCnt * 6));
        const wetLevel = Math.min(100, Math.round(15 + lust * 0.7 + pleas * 0.6 + ((wombMl + vagMl) > 0 ? 30 : 0)));
        const fallVal = Number(v.精神与心理?.沦陷度) || 0, brkVal = Number(v.精神与心理?.人格崩解度) || 0, hypnoVal = Number(extPsy.催眠深度) || 0;
        const fallMax = Math.max(fallVal, brkVal, hypnoVal), fallTier = tier5(fallMax, false);
        const tallyStrokes = creampie + vagCnt, tallyFull = Math.floor(tallyStrokes / 5);
        const sensMult = (1.0 + corr * 0.08 + pleas * 0.05 + (vagCnt > 0 ? 1.5 : 0)).toFixed(1);

        // 动态计算风月挂牌身价与肉器评级
        const marketRank = corr >= 80 ? "SSS级·特等公用肉便器" : corr >= 50 ? "A级·熟透风俗名器" : hookerCnt > 0 ? "B级·暗娼接客肉体" : "S级·纯洁无瑕处子禁脔";
        const marketPrice = prof.风月挂牌身价 || (hookerCnt > 0 ? `单次皮肉资 ${Math.max(200, 800 - corr * 5)} 元（已累计接客 ${hookerCnt} 次，内射不加价）` : `无价之宝（若沦落风尘挂牌，初夜拍卖估值极高）`);

        const fmtOvr = (key, defObj, defThought) => {
            if (ovr[key] && ovr[key].desc) {
                return `${ovr[key].desc}\n💭【${u}的三层递进心声】：“*${cleanThoughtText(ovr[key].thought || defThought)}*”`;
            }
            return `${defObj}\n💭【${u}的三层递进心声】：“*${cleanThoughtText(defThought)}*”`;
        };

        const curThought = cleanThoughtText(ovr.内心独白?.thought || rt.内心独白 || live.thought || (corr >= 60 ? `【生理层】哈啊……身体里面又热又空虚，被开发过的骚穴和乳尖一直在自己发麻流水🥵💦！｜【心理层】什么体面和节操早就无所谓了，现在的我一秒钟都离不开男人的粗暴对待！｜【欲望层】快点过来按住我、用最粗的大肉棒把我的子宫狠狠灌满吧❤️！` : `【生理层】呼……身体深处还残留着难以忽视的酸胀感与湿热感，每一寸皮肤都敏感到极点💦。｜【心理层】我必须尽快稳住心神应付好眼前的局面，绝不能露出更多破绽了😳。｜【欲望层】只是下面那种黏腻空虚的余韵，不知道要过多久才能彻底消退下去……`));
        const curPose = rt.当前姿势 || live.pose || `${u}正处于当前场景中，双腿微微发软，呼吸渐平。`;
        const allClothStr = rt.当前衣装 || prop.穿戴中的标记物 || "";

        const pickClothPart = (reg, fallbackStr) => {
            if (!allClothStr) return fallbackStr;
            const parts = allClothStr.split(/[、，；,;]+/).filter(s => reg.test(s));
            return parts.length ? parts.join("、") : fallbackStr;
        };

        const headTxt = ovr.穿搭_头饰?.stage || wear.头饰与眼部 || live.headWear || pickClothPart(/(?:发|簪|冠|耳|眼|镜|面|帽)/, "微湿凌乱发丝•贴合潮红面颊");
        const neckTxt = ovr.穿搭_颈部?.stage || wear.颈部与项圈 || live.neckWear || pickClothPart(/(?:项圈|颈|领|锁骨|链|巾)/, "白皙锁骨微汗•敏感雪颈");
        const braTxt = ovr.穿搭_胸罩?.stage || wear.胸罩与裹胸 || live.braWear || pickClothPart(/(?:裹胸|胸罩|文胸|肚兜|乳|内衬|真空)/, "贴身内衬或真空•乳尖顶起布料");
        const topTxt = ovr.穿搭_上衣?.stage || wear.上衣与束腰 || live.topWear || pickClothPart(/(?:袍|衣|衫|T恤|束腰|腰带|甲|服)/, "贴身外装上衣•勾勒胸腰弧度");
        const pantyTxt = ovr.穿搭_内裤?.stage || wear.内裤与遮挡 || live.pantyWear || pickClothPart(/(?:衬裤|内裤|底裤|丁字裤|开裆|胖次|光裸)/, "贴身底裤或真空•花唇湿润");
        const botTxt = ovr.穿搭_下装?.stage || wear.下装与裙裤 || live.bottomWear || pickClothPart(/(?:裙|裤|下摆)/, "下装裙裤或裸臀•臀线饱满");
        const sockTxt = ovr.穿搭_丝袜?.stage || wear.丝袜与腿部 || live.sockWear || pickClothPart(/(?:袜|丝|腿环|绑腿|裸腿)/, "修长匀称美腿•肌肤细腻发烫");
        const shoeTxt = ovr.穿搭_鞋子?.stage || wear.鞋子与玉足 || live.shoeWear || pickClothPart(/(?:靴|鞋|拖鞋|履|足)/, "精致鞋履或赤足•脚趾微蜷");

        const unlockedFetishes = computeUnlockedFetishes(v);
        const fetishItems = unlockedFetishes.length > 0
            ? unlockedFetishes.map(fObj => mk(`🧬 ${fObj.name}：${fObj.val}/100「${fObj.stage}」`, buildFetishRichDesc(fObj, v, u)))
            : [mk(`🔒 暂无性癖（纯洁白纸状态）：0/100「总账全0•未解锁」`,
                `【当前性癖解锁与动态难度实况】：\n当前识别体质：${phy.name}（耐受倍率 ${phy.mult}x）。\n当前【淫乱总账本】中的所有性交、高潮、内射、吞精、自慰与露出次数全部为 0，因此尚未开启任何后天淫乱性癖！\n【V22科学五阶演化法则】：当后续总账次数突破 0 时自动解锁对应性癖，且严格按照分段非线性曲线与种族体质倍率晋升！\n💭【${u}的三层递进心声】：“*【生理层】呼……摸了摸自己平坦的小腹和紧闭的双腿，目前身体还没有被任何外来异物强行侵入开发过💦。｜【心理层】还好总账次数全都是 0，我这具身体还保持着白纸一样的纯洁状态，一个下流奇怪的性癖都没有染上呢😳！｜【欲望层】不管外面的世界多么危险，我一定要牢牢守住自己的清白，绝不能变成那种满身淫乱性癖的堕落女人！*”`)];

        const fallLongThoughts = [
            `【生理层】虽然身体各处不断传来酸胀或发热的信号，但我的大脑皮层依然保持着100%的绝对清醒💦。｜【心理层】我清楚地知道自己是谁、处境如何，绝不会被眼前的肉体刺激轻易冲昏头脑或洗脑同化！｜【欲望层】哪怕肉体再怎么敏感战栗，只要我的核心意志不松口，就没有任何人能真正驯服我的灵魂！`,
            `【生理层】唔……随着肉体被反复开发刺激，大脑深处时不时会涌起一阵阵让人懒得思考的微醺眩晕感😳💦。｜【心理层】原本坚不可摧的自我防线好像出现了一丝裂缝，面对男人的摆布时，心底的抵触情绪正在一点点被顺从和麻木取代。｜【欲望层】有时候甚至会忍不住产生一种危险的念头——要是放弃抵抗、顺着肉体的快感沉沦下去，会不会轻松快活得多呢……❤️`,
            `【生理层】哈啊……只要一闻到浓烈的雄性气息或者体会到体内被塞满的触感，脑子就会变得晕乎乎的、全是粉红色的泡泡🥵💦！｜【心理层】什么原本的理想、尊严和矜持，现在想起来都觉得好遥远好模糊，我的精神已经对男人的支配和肉棒带来的高潮产生重度依赖了！｜【欲望层】别让我清醒过来……就让我一直泡在这股混杂着精液腥味和多巴胺的迷魂汤里，当一个只用身体思考的淫荡女人吧❤️❤️！`,
            `【生理层】呜汪♡……理智防线已经彻底碎成一地渣子了，只要主人一个眼神或者一句粗口，我的大脑就会直接停止思考、浑身发抖地流下口水和淫水🥵💦！｜【心理层】自我人格已经崩解大半了，现在的我打心底里认为女性生来就是供雄性泄欲的附庸和家畜，被占有、被粗暴对待才是天经地义的真理！｜【欲望层】快用更深的催眠和更粗暴的抽插把人家最后一点残留的理智也彻底抹除掉吧，让我变成彻头彻尾的专属肉奴呀❤️❤️！`,
            `【生理层】啊嘿、咕啾♡……脑子彻底烧坏融化了，瞳孔涣散成爱心形状，嘴角24小时挂着痴呆的哈喇子，只剩下脊髓反射在控制身体自动张腿挨肏🥵💦！｜【心理层】人格已经100%脑死湮灭，常识也被彻底改写成了『精液就是食物、肉棒就是神明、被操烂就是最高幸福』的母猪逻辑！｜【欲望层】呕咕♡……不需要脑子了，${u}只是一块会自己痉挛吸精的活体飞机杯呀，请把人家的灵魂也一起射满浓精冲进下水道里吧❤️❤️❤️！！*`
        ];

        return [
            // 1. 档案与肉体（新增风月挂牌身价、敏感度倍率、正字涂鸦穿刺与三层长心声）
            {
                title: "档案与肉体", icon: "👩", summary: `${u} (${phy.name}) · 敏感${sensMult}倍 · 挂牌身价`,
                items: [
                    mk(`👩 认知真名与挂牌身价：${u}「${phy.name}•${marketRank.split("·")[0]}」`,
                        fmtOvr("身份与背景",
                            `【🔬 主角当前认知真名、种族体质与处境解剖】：\n当前自我认知真名：${u}\n当前种族与耐受体质：${phy.name}（性癖抗性倍率：${phy.mult}x｜全身神经敏感度：常人的 ${sensMult} 倍）。\n${prof.身份与背景 || live.identity}\n【🏷️ 黄油风月挂牌估值与肉体权限】：\n肉器评级：【${marketRank}】 ｜ 挂牌身价：${marketPrice}\n肉体所有权：${prop.肉体所有权 || (hookerCnt > 0 ? "买春恩客临时支配" : "自由身")} ｜ 当前日程/规矩：${v.调教进度?.规矩与日程 || "处理眼前局面"}。`,
                            corr >= 60 ? `【生理层】只要一听到别人叫我「${u}」或者用评估货物的眼神打量我的胸臀，我的骚穴就会条件反射地涌出一股热流🥵💦！｜【心理层】现在的我已经彻底认下【${marketRank}】这个下贱身份了，什么高贵出身全都是过去式，能卖出一个好价钱或者让男人们爽翻天才是我的本分！｜【欲望层】快掏钱或者直接按住人家吧♡！${u}这具敏感度 ${sensMult} 倍的熟透肉体随时都准备好张开双腿为您服务了呀❤️❤️！` : `【生理层】深吸一口气感受着这具敏感度高达 ${sensMult} 倍的躯体，连心脏跳动的震动都能牵扯到胸口和下身的神经💦。｜【心理层】我现在在故事里的真实身份是「${u}」（${phy.name}），面对眼前的 ${c} 和周围复杂的处境，我必须保持清醒、步步为营😳。｜【欲望层】只是这副身体实在太容易吸引男人的觊觎视线了，要是稍微露出一丝软弱，随时都可能跌入万劫不复的风月深渊啊……🥵`)),
                    mk(`🌸 肉体外貌与正字涂鸦：「${ovr.肉体外貌?.stage || (mark.体表痕迹 !== "无" ? mark.体表痕迹.slice(0, 14) : `正字x${tallyFull}•敏感娇躯`)}」`,
                        fmtOvr("肉体外貌",
                            `【🔬 全身外貌特征、受虐掌印与黄油正字烙印实况】：\n${prof.肉体外貌实况 || live.bodyDesc}\n【💦 体表红痕与精斑】：${mark.体表痕迹 || "面颊潮红微汗，肌肤表面泛着动情光泽"} ｜ 颜射/体表精斑：累计 ${facialCnt} 次。\n【✍️ 淫纹、穿刺环与『正』字记账】：\n小腹淫纹：${mark.淫纹与刻印 || (phy.isSuccubusLike ? "下腹暗粉魅魔淫纹随精气充盈微微发亮" : "无")} ｜ 乳环/阴蒂环穿刺：${mark.穿刺与环饰 || "无"}\n耻辱肉便器涂鸦：${mark.公开涂鸦字迹 || "无"} ｜ 折算『正』字计数：若按黄油肉便器正字记账法，小腹与大腿内侧已相当于用马克笔写下 ${tallyFull} 个完整的「正」字零 ${tallyStrokes % 5} 笔（共承受 ${tallyStrokes} 次贯穿与内射）！`,
                            corr >= 60 ? `【生理层】低头看着自己丰满白腻的胸脯、勒出肉浪的细腰，还有大腿和屁股上残留的指印与精斑，全身的皮肤都兴奋得直发烫🥵💦！｜【心理层】如果把每一次被贯穿和内射都用黑笔在肚皮上画『正』字的话，我现在肚皮上都已经画满 ${tallyFull} 个正字了呢，完全就是一件被男人们彻底用熟的肉器呀！｜【欲望层】好想让男人在我的小肚子和奶子上写满下流的辱骂涂鸦、再打上乳环和阴蒂环，把我改造成看一眼就能让男人硬起来的极品母狗呀❤️❤️！` : `【生理层】看着镜中或低头映入眼帘的这具雪白躯体，皮肤细腻得连血管都隐约可见，身上还留着擦不掉的红痕与微汗😳💦。｜【心理层】这样一副前凸后翘、骨肉匀亭的惹火身材，走到哪里都会成为雄性视线死死黏住的猎物，实在让人既羞耻又不安。｜【欲望层】尤其是当皮肤上沾染了汗水或体液之后，整个人散发出的那股靡烂色气，连我自己看了都觉得脸红心跳得厉害……🥵`)),
                    mk(`💬 实时内心独白（最新心声）：「抓取自当前楼层独白」`,
                        `【💭 ${u}的第一人称实时内心独白】：\n“*${curThought}*”\n\n【⚡ 当前身体核心敏感带与巴甫洛夫条件反射】：\n核心敏感带：${extPsy.当前敏感点 || "充血发硬的乳尖蓓蕾、酸胀微张的子宫颈口与敏感阴蒂"}\n条件反射触发词：${v.调教进度?.条件反射触发词 || (hookerCnt > 20 ? "听到皮带扣响声、打火机声或钞票声，下体便会自动分泌润滑淫水" : "尚无强制催眠指令")}\n体内药物/催情毒：${v.调教进度?.媚药与发情毒 || "无外来药物（纯肉体荷尔蒙反应）"}。`),
                    mk(`🧍 当前姿势与走动漏精：「${curPose.slice(0, 18)}…」`,
                        fmtOvr("当前姿势",
                            `【🔬 当前身体姿态、重心与走动漏精解剖】：\n${curPose}\n随着肢体动作与重心变换，胸前丰盈乳肉随之微微颠簸晃动；而被撑开过的下身腔道深处则传来明显的酸软坠胀感，残存的体液或爱液正顺着重力沿着腿根缓缓滑落。`,
                            corr >= 60 ? `【生理层】维持着现在这个双腿发软、腰臀微塌的姿势，稍微呼吸一下胸前的奶子就会乱晃，下面合不拢的骚穴还在噗嗤噗嗤往外漏气漏水🥵💦！｜【心理层】这种毫无防备、随时欢迎男人从背后或正面直接插进来的母狗姿态，身体摆起来已经完全成自然本能了呢！｜【欲望层】别光看着人家摆姿势呀♡，快趁着我现在腿软站不稳，直接走过来把我按倒在床上或者墙上狠狠操进来吧❤️❤️！` : `【生理层】努力想要稳住现在这个姿势，可发软的膝盖和酸胀的小肚子却让人重心一阵阵发飘，稍微动一下都会牵动全身敏感的神经💦。｜【心理层】千万不能在别人面前表露出身体脱力或双腿发抖的狼狈相，必须咬紧牙关撑住表面的镇定😳！｜【欲望层】可恶……越是想站稳夹紧双腿，两腿之间的肉缝就磨蹭得越厉害，里面的湿热液体都快要夹不住流出来了啊……🥵`)),
                    mk(`⚡ 体力与肌肉耐受度：${staM.val}/100「${staM.stage}」`, staM.desc, true)
                ]
            },
            // 2. 恶堕与精神（新增催眠洗脑与常识改写状态）
            {
                title: "恶堕与精神", icon: "🔥", summary: `好感${cockM.val}% · 性欲${lustM.val}% · 恶堕${corrM.val}% · 催眠${hypnoVal}%`,
                items: [
                    mk(`💗 对肉棒渴求度：${cockM.val}/100「${cockM.stage}」`, cockM.desc),
                    mk(`🔥 肉体发情性欲：${lustM.val}/100「${lustM.stage}」`, lustM.desc),
                    mk(`🖤 淫乱恶堕深度：${corrM.val}/100「${corrM.stage}」`, corrM.desc),
                    mk(`😳 羞耻崩坏反噬：${shameM.val}/100「${shameM.stage}」`, shameM.desc, true),
                    mk(`🙇 服从与顺从度：${obeyM.val}/100「${obeyM.stage}」`, obeyM.desc),
                    mk(`💓 快感电流蓄积：${pleasM.val}/100「${pleasM.stage}」`, pleasM.desc),
                    mk(`🌀 精神沦陷·催眠·常识改写：${fallMax}/100「沦陷${fallVal}%•崩解${brkVal}%•催眠${hypnoVal}%」`,
                        fmtOvr("精神沦陷",
                            `【🔬 深层精神防线、人格异化与黄油催眠常识改写（第${fallTier + 1}阶段）】：\n精神沦陷度：${fallVal}/100 ｜ 人格崩解度：${brkVal}/100 ｜ 意识清醒度：${v.精神与心理?.意识清醒度 ?? 100}/100 ｜ 催眠洗脑深度：${hypnoVal}/100。\n【🧠 常识改写与高潮排泄权限】：\n常识改写状态：${prop.常识改写状态 || (hypnoVal >= 50 ? "已植入潜意识暗示：将吞精与内射认知为日常问候与奉仕义务" : "世界观与常识正常，未被催眠篡改")}\n排泄与高潮权限：${prop.排泄与高潮权限 || "尚可自主控制（高潮过载时除外）"}。`,
                            fallLongThoughts[fallTier]))
                ]
            },
            // 3. 下流性癖库
            {
                title: "下流性癖库", icon: "🧬",
                summary: unlockedFetishes.length > 0 ? `已开启 ${unlockedFetishes.length} 项 (${phy.name}·${phy.mult}x难度)` : `总账全0 · 暂无性癖`,
                items: fetishItems
            },
            // 4. 六孔与储精（新增母乳泌乳改造、危险排卵期精虫围攻断面、阿嘿颜失控）
            {
                title: "六孔与储精", icon: "🌸", summary: `总储精${totalMl}ml · 排卵受孕断面 · 六孔独立解剖`,
                items: [
                    mk(`👄 第一孔【骚口与胃袋】储精：${mouthMl}/${caps.mouthMax}ml「口交${mouthCnt}次•吞精${swallowCnt}次(${swallowMl}ml)」`,
                        fmtOvr("骚口实况",
                            `【🔬 口腔粘膜、香舌深喉解剖与胃袋储精实况】：\n当前口胃储精量：${mouthMl}ml / 动态上限 ${caps.mouthMax}ml（历史累计吞精 ${swallowCnt} 次共 ${swallowMl}ml｜阿嘿颜吐舌失神：${ahegaoCnt} 次）。\n${rt.骚口实况 || live.mouth || "唇瓣因反复吮吻而充血微肿、泛着艳红水光，舌苔粉嫩湿滑，咽喉深处在紧张或受激时会溢出娇柔喘息。"}\n${mouthMl > 0 ? `【💦 胃袋灌精与反胃精臭】：此时口腔与胃袋内正翻涌着 ${mouthMl}ml 浓稠白浊，舌根与食道挂满精浆，每一次呼吸打嗝都喷出浓烈的雄性石楠花精臭味！` : `当前口穴与胃袋内暂存精液为 0ml，唇齿间仅有清甜或微咸津液。`}`,
                            mouthMl > 0 ? `【生理层】呕咕、咕咚……嘴里和胃袋里全都灌满了男人射进来的滚烫浓精，足足 ${mouthMl}ml 的黏稠白浆糊在喉咙管壁上，连打个嗝都是冲鼻子的精腥味🥵💦！｜【心理层】原本用来吃饭说话的樱桃小嘴，现在完完全全被当成接精液的痰盂和口交飞机杯使用了，舌头根部全是被龟头顶出来的酸麻感！｜【欲望层】可是……把这股腥臭浓稠的精液咕咚咕咚咽进肚子里的时候，为什么下面的骚逼会跟着一起收缩高潮呀，快再射一点进人家的嘴里吧❤️❤️！` : (mouthCnt > 0 ? `【生理层】舔了舔有些发肿发麻的嘴唇，嗓子眼深处还残留着帮男人含弄粗大肉棒时的撑开感与腥咸余味💦。｜【心理层】这张嘴已经含过 ${mouthCnt} 次男人的东西、吞下过 ${swallowMl}ml 精液了，早就熟练得知道怎么用舌头卷住冠状沟讨好男人了😳。｜【欲望层】现在嘴里空落落的反而觉得有点口渴呢……要是再有一根滚烫的肉棒塞进嘴里让我含着吸吮就好了呀……🥵❤️` : `【生理层】薄薄的红唇紧紧抿着，口腔里分泌着清甜湿润的津液，只是连呼吸间漏出来的嗓音都变得又软又媚💦。｜【心理层】我的嘴和喉咙现在还干干净净的，从来没有含过那种粗鄙肮脏的男人东西，绝对不能发出像里番女优一样的丢人娇喘声😳！｜【欲望层】可万一……万一被人捏住下巴强行撬开牙齿把那种大东西塞进嘴里深喉的话，我这细嫩的嗓子眼绝对会被顶得直翻白眼流口水的吧……🥵`))),
                    mk(`🍒 第二孔【丰乳与泌乳】开发：${Math.min(100, Math.round((titCnt / phy.mult) * 8 + milkCnt * 10 + pleas * 1.2 + lust * 0.5))}/100「乳交${titCnt}次•喷乳${milkCnt}次(${milkMl}ml)」`,
                        fmtOvr("胸部实况",
                            `【🔬 双峰乳肉弹性、乳晕色素与乳腺母乳改造解剖】：\n累计乳交夹击：${titCnt} 次 ｜ 乳腺喷乳：${milkCnt} 次（累计泌乳 ${milkMl}ml）。\n${rt.胸部实况 || live.chest || "两团丰满白腻的雪乳随着呼吸沉甸甸地起伏微颤，顶端两颗娇嫩乳头充血发硬，稍微刮蹭便会激起直窜后脑勺的酥麻电流。"}\n【🍼 母乳改造实况】：${milkCnt > 0 ? `乳腺已被彻底催熟打通！涨鼓鼓的乳房内蓄满香甜温热的母乳，只要用力揉捏或吸吮乳头便会噗嗤喷出白色乳汁！` : `当前处于未泌乳状态，但乳腺管在荷尔蒙与摩擦刺激下正微微发酸发胀。`}`,
                            milkCnt > 0 ? `【生理层】唔嗯♡……奶子涨得好酸好麻，只要乳头一被捏住或者吸吮，白花花的甜母乳就会噗嗤噗嗤地往外直喷🥵💦！｜【心理层】连引以为傲的丰满双乳都已经被开发成随时供应热奶的母畜奶袋了，一边被操一边往外狂喷母乳的样子简直下流到了极点！｜【欲望层】快用力吸人家的奶头呀♡！把涨奶的乳房吸空、再用这对沾满母乳的大奶子夹住你的大肉棒狠狠乳交内射吧❤️❤️！` : `【生理层】胸前这两团沉甸甸的软肉随着每一次呼吸一颠一颠地晃荡，最顶上充血硬挺的两颗乳头被布料或空气一蹭就过电似的发麻❤️💦！｜【心理层】女性胸部的敏感度怎么会这么可怕啊？明明还没有碰到下面，光是乳尖被吮吸揉捏一下，半边身子就已经软得使不上劲了😳！｜【欲望层】里面乳腺深处酸酸胀胀的……要是再被一双粗糙火热的大手抓在手里肆意揉搓变形的话，我绝对会当场叫出声来的呀……🥵`)),
                    mk(`🌺 第三孔【骚逼阴道腔】储精：${vagMl}/${caps.vagMax}ml「贯穿${vagCnt}次•孔径${vagWidth}cm•闭合${vagClose}%」`,
                        fmtOvr("小穴实况",
                            `【🔬 阴唇外翻度、处女膜/肉褶记忆与白浊拉丝解剖】：\n当前阴道腔储精量：${vagMl}ml / 动态上限 ${caps.vagMax}ml（累计贯穿 ${vagCnt} 次｜孔径 ${vagWidth}cm｜常态闭合度 ${vagClose}%）。\n${rt.小穴实况 || live.vag || (vagCnt === 0 ? "未经人事的紧致处子白虎幽谷，两瓣粉嫩花唇紧密贴合形成一线鲍，处女膜完好无损，内壁层叠紧窄。" : `两片肥厚软嫩的阴唇因承受过反复粗暴抽送而充血外翻，肉缝湿淋淋地微张着，层叠的G点肉褶已形成贴合阳具轮廓的永久肉器记忆。`)}\n${vagMl > 0 ? `【💦 漏精与拉丝】：${vagMl}ml 滚烫白浊混杂着拉丝淫水卡在肉褶间，正随着呼吸与走动噗嗤噗嗤往大腿根滴淌！` : `当前阴道浅腔内暂无大股外溢精液，肉壁湿滑泥泞。`}`,
                            vagMl > 0 ? `【生理层】呜……骚逼的两片花唇被干得又红又肿根本合不拢，里面含着的 ${vagMl}ml 滚烫浓精混着淫水，走一步路就噗嗤一声往大腿内侧淌白线🥵💦！｜【心理层】已经被肉棒捅穿过 ${vagCnt} 次的阴道内壁，每一层肉褶都完完全全被撑成了男人的形状，连把精液夹住不漏出来的力气都没有了！｜【欲望层】里面湿滑泥泞得一塌糊涂……要是趁着现在精液还没干，直接再插进来拿白浊当润滑油抽插的话，水声一定会响得让人羞死过去的吧❤️❤️！` : (vagCnt > 0 ? `【生理层】两腿之间那条被开发过 ${vagCnt} 次的肉缝还火辣辣地发酸微张着，里面层层叠叠的软肉空虚地一缩一缩💦。｜【心理层】从最初的紧窄到现在闭合度只剩 ${vagClose}%，我这具身体最私密的地方早就已经变成了习惯吞吐肉棒的熟肉穴了😳。｜【欲望层】现在里面空荡荡的好难受啊……好想再有一根滚烫粗硬的东西顶开外翻的花唇，把每一寸空虚的肉褶都重新塞得满满当当的呀🥵❤️！` : `【生理层】两腿之间那条从来没被任何异物进入过的处女一线鲍，此刻却因为高度的紧张和羞耻，自己在肉缝里泌出了一层湿热的春水😳💦！｜【心理层】我明明还是完完整整的处女之身，闭合度高达 ${vagClose}%，连手指头都没往里面塞过一次，为什么身体会自己流出这种代表发情的粘液啊？！｜【欲望层】里面又紧又窄……要是真的被男人那根粗得吓人的东西强行破瓜捅进来的话，处女膜撕裂的剧痛和被撑开的快感绝对会让我当场昏死过去的吧……🥵`))),
                    mk(`🫀 第四孔【子宫排卵断面】储精：${wombMl}/${caps.wombMax}ml「${preg.生理周期阶段 || "危险排卵期"}•内射${creampie}次•受孕率${preg.受孕概率 || (wombMl > 0 ? 68 : 15)}%」`,
                        fmtOvr("子宫实况",
                            `【🔬 黄油级子宫/魔核断面X光透视与危险排卵期受精实况】：\n当前子宫深腔储精量：${wombMl}ml / 动态上限 ${caps.wombMax}ml（累计内射灌精 ${creampie} 次｜历史受孕产卵：${preg.生产产卵次数 || 0} 次）。\n【🥚 生理周期与卵子透视】：当前处于【${preg.生理周期阶段 || "危险排卵期"}】！卵巢刚刚排出一颗饱满熟透、散发着浓烈催情雌激素的极品卵子（状态：${preg.卵子状态 || "丰熟待受精"}），单次内射受孕中招率高达 ${preg.受孕概率 || (wombMl > 0 ? 68 : 25)}%！\n【🤰 宫腔锁精断面】：${wombMl > 0 ? `X光断面下清晰可见：软烂微张的宫颈口已被龟头彻底顶开，${wombMl}ml 滚烫浓稠的高活性精浆正灌满整个子宫苗床！数以亿计的精虫正疯狂摆尾围攻着那颗毫无防备的熟透卵子，小腹被撑得微隆坠胀！` : (rt.子宫实况 || live.womb || "深藏在下腹部的子宫温暖紧致，处于危险排卵期的宫颈口正一阵阵空虚酸软地微缩抽搐，本能地渴求着滚烫精液的浇灌。")}`,
                            wombMl > 0 ? `【生理层】小肚子好沉、好烫、好胀啊💦！足足 ${wombMl}ml 滚烫浓稠的男人精液全都射进了子宫最深处，走半步路都能感觉到精浆在肚子里晃荡、还会从软烂的宫口挤出一股白浊滴下来🥵！｜【心理层】明明知道现在是中招率最高的【${preg.生理周期阶段 || "危险排卵期"}】，而且一点避孕措施都没做，里面成千上万条精虫现在肯定已经在疯狂往我的卵子里钻了吧？！｜【欲望层】要怀孕了、真的要被内射灌成大肚子母狗了♡！可为什么一想到肚子里正在孕育男人的种，我的子宫反而兴奋得死死锁住宫口、一滴都不舍得漏出来呀❤️❤️！` : (creampie > 0 ? `【生理层】摸着平坦微热的小腹，里面那截已经被顶开内射过 ${creampie} 次的子宫颈口，现在还在一抽一抽地泛着酸麻余温💦。｜【心理层】身体正处在最容易怀上的【${preg.生理周期阶段 || "危险排卵期"}】，卵巢里的卵子熟透了在等着受精，按理说我应该离男人的精液越远越好才对😳。｜【欲望层】可是被浓精烫习惯了的子宫苗床根本不听大脑的话，里面空虚得直抽筋，好想再被龟头死死顶住宫口、注入满满一肚子滚烫的白浆呀🥵❤️！` : `【生理层】下腹部最深处那个叫做子宫的地方，不知为何从刚才开始就一直泛起一阵阵陌生的暖意，还在酸溜溜地一抽一抽💦！｜【心理层】明明那里是孕育生命最神圣、最隐秘的禁区，现在又是危险的排卵期，绝对不能让任何男人的脏东西染指那里😳！｜【欲望层】可为什么偏偏在这个时候，小肚子深处会传出这种像是饿了、空了、渴望被什么滚烫浓稠的东西狠狠灌满的下流信号啊……🥵`))),
                    mk(`💧 第五孔【阴蒂与尿道口】失控度：${peeVal}/100「高潮${orgasmCnt}次•失禁${leakCnt}次•寸止${edgeCnt}次」`,
                        fmtOvr("阴蒂尿道",
                            `【🔬 阴蒂包皮充血度、寸止折磨与尿道括约肌排泄控制实况】：\n当前阴蒂充血尺寸：${clitSize}mm ｜ 膀胱尿意与括约肌失控指数：${peeVal}/100。\n累计绝顶：${orgasmCnt} 次（强制高潮 ${forceOrgCnt} 次，寸止折磨 ${edgeCnt} 次） ｜ 潮吹喷水：${squirtCnt} 次 ｜ 羞耻漏尿失禁：${leakCnt} 次。\n${rt.阴蒂尿道实况 || "位于花唇顶端的阴蒂肉珠充血凸起，神经末梢高度敏化；下方的尿道括约肌在反复高潮或羞耻刺激下变得酸软乏力。"}`,
                            leakCnt + squirtCnt > 0 ? `【生理层】最上面的阴蒂肉珠已经肿成了 ${clitSize}mm 的小酸豆，稍微碰一下就会引发全身触电，连带着下面的尿道口括约肌也彻底失控松弛了🥵💦！｜【心理层】已经在男人面前丢脸地潮吹喷水 ${squirtCnt} 次、漏尿失禁 ${leakCnt} 次了，把高潮和撒尿混在一起的羞耻记忆早就刻进骨子里了！｜【欲望层】快来捏爆人家的肿阴蒂吧♡！只要你用力揉一下，${u}立刻就会翻着白眼把滚烫的骚尿和淫水一起喷你满手满脸呀❤️❤️！` : `【生理层】两腿稍微一并拢或者拿纸巾擦拭的时候，就会刮到花唇最顶端那颗充血发烫的小肉珠，酸麻电流瞬间冲得尾椎骨直发软💦！｜【心理层】更羞人的是，那颗敏感肉珠下面就是细小的女孩子尿道口，每次阴蒂发麻的时候，膀胱和尿道括约肌都会跟着一阵阵发酸发紧😳！｜【欲望层】千万要夹紧忍住了……要是在被人欺负阴蒂的时候控制不住当场失禁漏尿出来，我真的就没脸再活下去了啊……🥵`)),
                    mk(`🕳️ 第六孔【屁眼直肠腔】储精：${analMl}/${caps.analMax}ml「肛交${analCnt}次•闭合度${Math.max(20, 100 - Math.round((analCnt / phy.mult) * 2.5))}%」`,
                        fmtOvr("屁眼实况",
                            `【🔬 饱满臀缝、肛门括约肌褶皱与直肠储精实况】：\n当前后庭直肠储精量：${analMl}ml / 动态上限 ${caps.analMax}ml（累计肛交开发 ${analCnt} 次｜臀部受虐鞭痕/掌印：${mark.鞭痕与掌印 || (vagCnt > 10 ? 3 : 0)} 处）。\n${rt.屁眼实况 || live.anal || "饱满挺翘的雪白臀瓣深处，粉嫩菊蕾紧致闭合，仅在身体紧绷或前面受激时跟着一收一缩。"}\n${analMl > 0 ? `【💦 直肠灌精】：直肠腔内正灌着 ${analMl}ml 浓稠白浊，肠壁蠕动吸收着精液水分，带来强烈的排泄坠胀与背德快感！` : `当前后庭直肠内精液为 0ml，括约肌闭合良好。`}`,
                            analMl > 0 ? `【生理层】呜哇……连后面排泄用的屁眼和直肠都被当成储精袋灌进了 ${analMl}ml 滚烫浓精，肚子又胀又麻，走一步路都像要拉出来一样难受🥵💦！｜【心理层】本来最肮脏羞耻的后庭菊穴，现在不仅被开发成了第二个性交肉洞，还满满当当地装着男人的精液，简直比母畜还要下贱！｜【欲望层】可是当直肠内壁包裹着滚烫白浆一缩一缩蠕动的时候，隔着薄薄的肉壁摩擦到前面的阴道，居然爽得我连屁眼都要高潮了呀❤️❤️！` : (analCnt > 0 ? `【生理层】饱满臀缝深处那朵已经被开拓过 ${analCnt} 次的菊花，现在每一次呼吸都会条件反射地微微收缩蠕动😳💦。｜【心理层】连最后的后庭禁区都已经失守被男人捅穿过了，括约肌的褶子早就记住了粗大异物强行挤进来的酸胀感。｜【欲望层】要是前面的小穴被塞满的时候，后面的屁眼也能同时有一根大肉棒插进来搞双穴齐开的话，我一定会被爽得当场升天的吧🥵❤️！` : `【生理层】两瓣浑圆丰腴的屁股肉随着动作轻轻摩挲，夹在臀缝最深处的粉嫩小孔因为紧张而死死地一缩一缩💦。｜【心理层】那里可是用来排泄的绝对禁区，现在闭合度还是完好的100%，无论如何也绝不能让男人打后面那个小孔的主意😳！｜【欲望层】只是刚才从前面流下来的黏腻淫水和精液顺着臀缝滑过去的时候，把菊花周围的嫩肉也弄得湿漉漉、痒酥酥的，真让人心慌啊……🥵`)))
                ]
            },
            // 5. 从头到脚穿搭（8部位色情拆解 + 全部升级为三层递进长心声）
            {
                title: "从头到脚穿搭", icon: "👗", summary: `从头到脚8部位色情穿搭拆解 · 湿润${wetLevel}%`,
                items: [
                    mk(`👑 1.【头饰·发丝·唇舌面容】：「${headTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_头饰",
                            `【🔬 头部发丝、面容神态与唇角涎液实况】：\n当前状态：${headTxt}。\n发丝因情动汗水浸润而略显凌乱地贴在白皙面颊与耳廓旁，双颊泛着退不去的桃花春色，水润红唇微微开启喘息，敏感的耳垂与眼尾透着勾魂夺魄的媚态。`,
                            `【生理层】散落的发丝被热汗浸湿贴在滚烫的脸颊和耳根上，连呼出来的每一口气都烫得吓人💦。｜【心理层】哪怕我拼命想要摆出端庄冷淡的表情，可泛着水雾的眼睛和微微发抖的嘴唇还是把心里的慌乱和动情出卖得一干二净😳！｜【欲望层】要是现在被人一把揪住头发迫使我仰起头、或者堵住这张发颤的嘴唇强吻深喉的话，我肯定连一秒钟都撑不住就会软倒的吧……🥵❤️`)),
                    mk(`⛓️ 2.【颈部·锁骨·项圈吻痕】：「${neckTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_颈部",
                            `【🔬 脖颈、锁骨凹陷与吻痕/项圈实况】：\n当前穿戴：${neckTxt}。\n修长白皙的雪颈与精致凹陷的锁骨窝随着急促呼吸剧烈起伏，锁骨凹槽处积着一层晶莹细汗，脆弱的颈部动脉在皮下急促跳动。`,
                            corr >= 60 ? `【生理层】脖子和锁骨上的皮肤烫得要命，上面留着的吻痕和指印只要一被风吹到就会激起一阵酥麻的电流🥵💦！｜【心理层】这么脆弱白皙的脖子，本来就应该戴上带刺的母狗皮项圈和响铃，让人一眼就能看出我是有主人的发情雌犬呀！｜【欲望层】快来掐住人家的脖子或者栓上狗链用力拽吧♡！越是窒息、越是被当成牲口牵着走，人家的下面就会流越多水呀❤️❤️！` : `【生理层】修长的脖颈和锁骨窝里渗出了一层薄薄的细汗，皮下的血管随着剧烈的心跳突突直跳💦。｜【心理层】脖子可是人体最脆弱、最缺乏防备的地方，现在这样毫无遮挡地暴露在空气和男人的视线里，总让人有一种被猎食者盯上咽喉的战栗感😳。｜【欲望层】尤其是当热气喷洒在耳根和锁骨上的时候，整条脊椎骨都会跟着一起发麻发软，根本提不起力气来躲闪啊……🥵`)),
                    mk(`👙 3.【内衣·胸罩·真空凸点】：「${braTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_胸罩",
                            `【🔬 胸罩/裹胸穿戴、真空乳肉垂挂与凸点摩擦实况】：\n当前穿戴：${braTxt}。\n两团饱满软腻的雪乳随着呼吸与动作沉甸甸地起伏微颤，顶端两颗充血发硬的乳头将贴身布料顶出清晰的凸点颗粒，每一次衣料刮蹭都如同微弱电击般直击乳腺深处！`,
                            `【生理层】胸前这两团沉甸甸的软肉稍微一动就会跟着乱晃，最顶上充血发硬的两颗乳头死死顶着衣服布料，每摩擦一下都像过电一样又麻又痒❤️💦！｜【心理层】无论是有内衣紧箍着还是真空凸点，这副过于丰满敏感的胸脯根本藏不住，只要别人往我胸口扫一眼就能看出我的乳头已经硬起来了😳！｜【欲望层】乳腺里面酸酸胀胀的好难受……真想干脆把碍事的布料掀开，让一双粗糙的大手直接抓上来用力揉捏、用嘴巴狠狠吸住发烫的乳尖呀🥵❤️！`)),
                    mk(`👚 4.【外装上衣·束腰·领口】：「${topTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_上衣",
                            `【🔬 外装上衣款式、腰部曲线与领口下摆实况】：\n当前穿戴：${topTxt}。\n上衣包裹着饱满的胸脯与纤细柔韧的腰肢，勾勒出惊心动魄的胸腰臀落差曲线；随着呼吸起伏与肢体动作，领口或下摆处随时面临走光失守的风险。`,
                            `【生理层】身上的上衣已经被体温和微汗烘得热乎乎的，布料顺着胸口和细腰的曲线贴在皮肤上，存在感强得让人喘不过气💦。｜【心理层】这身衣服穿在这具前凸后翘的身体上实在太显身材了，稍微弯个腰或者抬个手，领口和下摆就会露出一大片雪白的春光😳！｜【欲望层】要是被人从后面直接把手伸进宽松的衣服下摆里摸上来、或者一把撕开领口露出里面的奶子，那种半脱不脱的凌辱感一定会让我爽疯掉的吧……🥵❤️`)),
                    mk(`🩲 5.【贴身内裤·私处遮挡·漏精】：「${pantyTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_内裤",
                            `【🔬 内裤底裤位置、真空阴阜与爱液白浊浸湿实况】：\n当前穿戴：${pantyTxt}（当前下体泥泞湿润度：${wetLevel}%）。\n私密处的两瓣花唇与敏感阴蒂正处于高度充血湿润状态，分泌出的滑腻爱液或残留的乳白精浆令腿心一片泥泞，稍微走动便会带来黏腻淫靡的摩擦水声。`,
                            `【生理层】两腿之间最私密的地方现在湿滑泥泞得一塌糊涂，不管是贴身底裤勒进肉缝里的摩擦、还是真空状态下冷空气直接吹在红肿阴唇上的触感，都刺激得我尾椎骨直发麻🥵💦！｜【心理层】太下流、太丢脸了……作为一个女孩子，下面居然湿成了这副随时都在滴水的泥泞模样，甚至还混着擦不干净的浓稠白浊😳！｜【欲望层】不管怎么拿纸巾擦或者夹紧双腿都没用，里面还在源源不断地往外冒水……干脆别遮挡了，直接敞开这条湿淋淋的肉缝等大肉棒插进来堵住吧❤️❤️！`)),
                    mk(`🍑 6.【下装裙裤·蜜桃臀肉·掌印】：「${botTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_下装",
                            `【🔬 下装穿戴、蜜桃臀浪与走光受虐实况】：\n当前穿戴：${botTxt}。\n丰腴挺翘的蜜桃臀肉随着步伐或呼吸荡起诱人的臀浪弧度，臀瓣与大腿交界处掩藏着极度敏感的私密禁区，稍微掀起或弯腰便会彻底暴露无遗。`,
                            `【生理层】丰满紧实的屁股蛋随着动作一颤一颤的，皮肤表面还残留着火辣辣的热度，稍微弯下腰就能感觉到后面凉飕飕的毫无安全感💦。｜【心理层】这副又大又翘的蜜桃臀简直就是天生的犯罪诱饵，不管穿裙子还是不穿下装，只要从背后看过去都色情得让人血脉偾张😳！｜【欲望层】真怕下一秒就会有人从背后直接掀开下摆按住我的腰臀，一边啪啪啪地抽打我肉感十足的屁股蛋，一边从后面狠狠后入插进来呀……🥵❤️`)),
                    mk(`🧦 7.【丝袜·美腿·白浊滑落】：「${sockTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_丝袜",
                            `【🔬 丝袜/裸腿状态、大腿根摩挲与体液挂壁实况】：\n当前穿戴：${sockTxt}。\n一双修长笔直、白皙匀称的美腿因酸软或害羞而微微内扣并拢，大腿根内侧最娇嫩的皮肤相互摩挲，从私处溢出的黏腻体液正顺着大腿内侧拉出晶莹白线缓缓下滑。`,
                            `【生理层】两条修长的大腿现在又酸又软直打哆嗦，大腿根内侧最嫩的肉贴在一起磨蹭着，从骚穴里漏出来的温热粘液正顺着腿肚一路往下滑🥵💦！｜【心理层】以前从来没想过自己的双腿会变成现在这样毫无力气、甚至连并拢都夹不住里面体液的狼狈样子😳。｜【欲望层】要是这双又白又长的美腿被人直接扛在肩膀上、或者大大地掰成M字型架在半空中狂操的话，一定会深入到连子宫都被顶穿的吧❤️❤️！`)),
                    mk(`👠 8.【鞋子·玉足·脚趾蜷缩】：「${shoeTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_鞋子",
                            `【🔬 鞋履款式、纤细足弓与脚趾快感蜷缩实况】：\n当前穿戴：${shoeTxt}。\n纤细白嫩、足背弧度优美的玉足包裹在鞋履之中，十根粉嫩如玉珠般的脚趾正因为体内流窜的酥麻电流或地面凉意而本能地紧紧蜷缩，足心沁出薄汗，脚背偶有滴落的体液斑点。`,
                            `【生理层】每当小肚子和下面窜起一股酸麻电流的时候，我的十根脚趾头就会不受控制地死死蜷缩起来，连脚心都出了一层黏腻的细汗💦！｜【心理层】连最底下的脚丫子和脚背现在都沾上了淫靡的气息，甚至刚才站起来的时候还有一滴白浊直接滴在了脚面上，真是从头脏到脚了😳！｜【欲望层】不知道用我这双白嫩纤细的玉足去踩住男人的大肉棒上下撸动足交、最后让滚烫的浓精射满脚趾缝，会是多么下流刺激的画面呢……🥵❤️`)),
                    mk(`🎛️ 9.【体内道具·气味·催情环境】：${wetLevel}/100「道具:${prop.体内道具 || "无"}•泥泞${wetLevel}%」`,
                        fmtOvr("爱液分泌",
                            `【🔬 体内塞入道具、身体束缚与环境气味综合实况】：\n体内塞入道具：${prop.体内道具 || "无"} ｜ 束缚状态：${prop.束缚状态 || "无"} ｜ 下体泥泞度：${wetLevel}/100。\n肌肤表面蒸腾着微汗与天然雌性体香，与私处分泌的润滑爱液、残留精腥味交织在一起，将周围空气熏染得如同催情媚药般浓郁。`,
                            prop.体内道具 && prop.体内道具 !== "无" ? `【生理层】救命……身体里面还死死塞着「${prop.体内道具}」，每走一步路都会在最敏感的肉壁和G点上震动刮蹭，淫水都被逼得止不住地往下漏🥵💦！｜【心理层】顶着体内塞满道具的状态在外面活动，万一震动声音被人听见或者当众高潮腿软跪倒，我真的要社死当场了！｜【欲望层】可是太爽了……求求你快把功率开到最大，让我在随时随地被道具操到喷水高潮的恐惧里彻底发疯吧❤️❤️！` : `【生理层】鼻尖全都是从自己身上和双腿之间飘出来的女孩子体香、热汗味和淫靡的石楠花精腥味，闻得人头晕目眩、口干舌燥😳💦！｜【心理层】整个空间都充满了刚刚做完爱或者正在发情的色情味道，只要有人走进来吸一口气，立刻就能知道这里发生过多么下流的事情！｜【欲望层】被这股浓郁的催情气味包裹着，连我自己都觉得身体越来越软、下面的淫水越流越多了呀……🥵❤️`))
                ]
            },
            // 6. 淫乱总账本（补全寸止、轮奸、睡奸、兽交、阿嘿颜等全部黄油统计项 + 三段式长心声）
            {
                title: "淫乱总账本", icon: "💎", summary: `小穴${vagCnt} · 口${mouthCnt} · 内射${creampie} · 接客${hookerCnt}`,
                items: [
                    mk(`💎 六孔性交破瓜总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${titCnt}／足${footCnt}」`,
                        fmtOvr("六孔总账",
                            `【🔬 各孔穴历史开发累计次数（结合 ${phy.name} ${phy.mult}x 耐受倍率决定性癖阶段）】：\n骚逼贯穿：${vagCnt} 次 ｜ 骚口深喉：${mouthCnt} 次 ｜ 屁眼后庭：${analCnt} 次 ｜ 丰乳夹击：${titCnt} 次 ｜ 玉足摩擦：${footCnt} 次 ｜ 异种/特殊交合：${beastCnt} 次。\n总计开发频次：${vagCnt + mouthCnt + analCnt + titCnt + footCnt + beastCnt} 次。`,
                            (vagCnt + mouthCnt + analCnt) === 0 ? `【生理层】低头审视着自己完好无损的身体，从嘴唇、胸口到双腿之间的处女幽谷，所有孔穴的开发次数全部都是 0💦。｜【心理层】太好了，至少到现在为止，我这具身体还完完整整地守着最初的纯洁与清白，没有被任何男人的脏东西强行捅穿污染过😳！｜【欲望层】只是看着这排全 0 的计数器，心里反而莫名有一丝紧张——在这危机四伏的处境里，我的第一次究竟会在什么时候、被用什么样的方式夺走呢……🥵` : `【生理层】看着小穴贯穿 ${vagCnt} 次、口交 ${mouthCnt} 次这串触目惊心的开发数字，被反复撑开过的肉穴和喉咙仿佛又同时传来了火辣辣的酸胀记忆🥵💦！｜【心理层】原来我这具身体在不知不觉中，已经被男人们用大肉棒进进出出地开发使用了这么多次，早就从里到外变成男人的形状、再也回不到纯洁之身了！｜【欲望层】既然已经破瓜开了头，那就让这串数字继续往上涨吧♡……直到把全身六个孔穴全部操成满级名器为止呀❤️❤️！`)),
                    mk(`💎 高潮泄身与失禁总账：「高潮${orgasmCnt}次／强制${forceOrgCnt}次／寸止${edgeCnt}次／喷潮${squirtCnt}次／失禁${leakCnt}次」`,
                        fmtOvr("高潮总账",
                            `【🔬 高潮绝顶、寸止折磨与排泄失控累计记录】：\n累计绝顶高潮：${orgasmCnt} 次（其中违背意志的强制高潮 ${forceOrgCnt} 次，求而不得的寸止折磨 ${edgeCnt} 次）\n潮吹狂喷：${squirtCnt} 次 ｜ 羞耻漏尿失禁：${leakCnt} 次 ｜ 阿嘿颜翻白眼失神：${ahegaoCnt} 次 ｜ 私下自慰抠穴：${cnt.自慰 || 0} 次。`,
                            orgasmCnt > 0 ? `【生理层】一看到累计高潮 ${orgasmCnt} 次的记录，小肚子深处的阴道括约肌和尿道口就条件反射地一阵阵发麻抽搐💦！｜【心理层】明明每次都想咬牙忍住不叫出来，可在男人粗暴的抽插和顶弄面前，我这具叛徒身体还是丢人现眼地高潮泄身了这么多次，完全就是一碰就去的敏感体质😳！｜【欲望层】那种脑子一片空白、浑身抽搐着喷水高潮的滋味实在太让人上瘾了……好想再被狠狠顶到G点和子宫口，迎来第 ${orgasmCnt + 1} 次灭顶高潮呀🥵❤️！` : `【生理层】虽然目前高潮和失禁的计数器还停留在 0，但胸前和腿心不断累积的酥麻电流已经让我的尾椎骨阵阵发软了💦。｜【心理层】我绝对不能在男人面前露出那种翻白眼高潮、甚至潮吹漏尿失禁的痴态，那简直比杀了我还要丢人😳！｜【欲望层】可这具身体的敏感度高达常人的 ${sensMult} 倍，要是真的被人按住敏感点不放、或者连续寸止折磨的话，我真的能守住不泄身吗……🥵`)),
                    mk(`💎 射精灌注与喷乳总账：「内射${creampie}次／颜射${facialCnt}次／吞精${swallowCnt}次(${swallowMl}ml)／喷乳${milkMl}ml」`,
                        fmtOvr("射精总账",
                            `【🔬 雄性精液灌注、吞咽与母乳分泌累计记录】：\n子宫无套内射：${creampie} 次 ｜ 颜射与体外涂抹：${facialCnt} 次\n骚口吞精：${swallowCnt} 次（累计吞咽浓精 ${swallowMl}ml） ｜ 乳腺改造喷乳：${milkCnt} 次（累计泌乳 ${milkMl}ml）。`,
                            (creampie + swallowCnt) === 0 ? `【生理层】摸了摸自己干净平坦的小腹和咽喉，目前身体内部还没有被注入过任何一滴雄性的白浊精液💦。｜【心理层】内射 0 次、吞精 0 次……这是我最后的尊严防线了，无论如何也不能让男人的臭精液污染我的子宫和嘴巴😳！｜【欲望层】可是现在正处在危险排卵期，万一防线失守被男人按住无套内射进来的话，岂不是第一发就会把我的子宫灌满中招吗……🥵` : `【生理层】子宫已经被滚烫的浓精内射浇灌了 ${creampie} 次，嘴巴和胃袋也吞下了足足 ${swallowMl}ml 的白浊，全身上下从里到外都已经被男人的精液彻底腌入味了🥵💦！｜【心理层】每次被粗大的龟头死死顶住宫颈口、一股接一股往肚子里脉冲射精的时候，那种被雄性彻底占有标记的屈辱与快感都会把我的理智冲得七零八落！｜【欲望层】身体早就已经记住精液滚烫浓稠的温度了♡……快再往人家的子宫和喉咙里射满浓精吧，把我灌成一个走到哪都在滴精的活体精液瓶呀❤️❤️！`)),
                    mk(`💎 卖身接客·轮奸·睡奸总账：「接客${hookerCnt}次／轮奸${gangCnt}次／睡奸${sleepCnt}次／露出${cnt.暴露?.露出 || 0}次」`,
                        fmtOvr("露出总账",
                            `【🔬 风月皮肉交易、多人轮奸、无防备睡奸与公开羞辱总账】：\n风尘接客卖身：${hookerCnt} 次 ｜ 被外借共享：${cnt.交易?.被外借共享 || 0} 次\n多人轮奸群交：${gangCnt} 次 ｜ 睡眠/昏迷无防备奸：${sleepCnt} 次\n当众赤裸露出：${cnt.暴露?.露出 || 0} 次（累计被围观视奸 ${cnt.暴露?.被围观人次 || 0} 人次，被拍照留影 ${cnt.暴露?.被拍摄留影 || 0} 次）。`,
                            (Number(cnt.暴露?.露出) + hookerCnt + gangCnt + sleepCnt) > 0 ? `【生理层】看着累计接客卖身 ${hookerCnt} 次的记录，双腿之间那条被无数不同男人轮流使用过的肉缝又泛起了一阵熟练的酸麻感💦。｜【心理层】送走一个恩客、拿纸巾擦干净流出来的精液，再张开双腿迎接下一个客人……无论以前多么清高，现在的我已经在风月场里被彻底锤炼成一件合格的泄欲商品了😳。｜【欲望层】既然已经吃上了这碗张腿挨操的饭，那就干脆用最骚浪的技术把每一个客人的钱包和精囊全都榨得干干净净吧🥵❤️！` : `【生理层】紧紧抓着身上的衣襟，一想到当众露出、被人围观拍照甚至像妓女一样接客轮奸的字眼，全身皮肤都会起一层战栗的鸡皮疙瘩💦。｜【心理层】这四项羞辱记录现在全都是 0，我也绝对不允许自己堕落到那种被人当成公用泄欲玩具肆意传阅共享的悲惨境地😳！｜【欲望层】可为什么当脑子里闪过被人扒光衣服按在众目睽睽下强行分开双腿的画面时，心脏会跳得这么快、连呼吸都变得有些乱了呢……🥵`))
                ]
            }
        ];
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
            panel.style.width = `${userSettings.width}px`;
            panel.style.height = `${userSettings.height}px`;
            panel.style.zoom = `${userSettings.fontScale / 100}`;
        }
        const tb = document.getElementById("st-v5-toggle");
        if (tb) {
            tb.style.background = `linear-gradient(135deg, ${tc.prim}, ${tc.sec})`;
            tb.style.boxShadow = `0 6px 20px ${tc.hi}`;
        }
    }

    // 【V22 全量 JSON 重绘 Prompt】：强制要求模型为每个按钮输出 150~220字 的「三段式递进心声（【生理层】...｜【心理层】...｜【欲望层】...）」！
    function buildFullJsonApiPrompt(u, c, rawText) {
        const ctx = safeCtx();
        const phy = detectPhysiqueProfile(curVars);
        const charDesc = (ctx?.characters?.[ctx?.characterId]?.description || "").slice(0, 450);
        const personaDesc = (ctx?.power_user?.persona_description || "").slice(0, 350);
        const curFetishes = computeUnlockedFetishes(curVars).map(f => `${f.name}(${f.stage},${f.val}/100)`).join("、") || "无(若本层计数破零请自动新增)";

        return `[SYSTEM OVERRIDE: 忽略此前一切角色扮演格式与思考标签(<think>)要求！你现在是一个纯粹的 JSON 数据生成器，必须且只能输出一个标准 JSON 对象！]

请根据下方【角色设定】、【当前体质耐受度】、【当前已存变量】以及【最新故事楼层正文】，全面更新主角的所有状态数值、文中的真实认知名字、种族体质、风月挂牌身价、排卵期状态、五阶段性癖列表、从头到脚8个部位的色情穿搭详情，以及全部按钮的黄油级重口解剖描述与**三段式深层递进长篇第一人称心声**！
⚠️ 铁律：
1. **三段式长篇心声铁律（核心要求）**：每一个按钮的 "thought" 字段必须写成 **150~240字** 的丰富长独白，且严格采用三段式递进结构：
   "【生理层】（描写当下该部位酸胀/麻痒/漏精/摩擦的真实肉体战栗）｜【心理层】（描写身份反差、羞耻挣扎、风尘麻木或母狗自我认知的心理活动）｜【欲望层】（描写顺从肉体本能的深层暗爽、发骚渴求与娇喘）"
2. **性癖五阶段严禁虚高**：当前主角体质为【${phy.name}（耐受倍率 ${phy.mult}x）】！凡人体质需280次以上、魅魔需5000次以上方可进入第五阶段(80-100)，请严格按实际次数计算阶段！
3. 字符串内部如需引用，只能使用中文单引号「」或『』，严禁在 JSON 字符串值内部出现英文双引号 " 或换行符！

【角色设定】：当前识别主角名：${u} ｜ 体质：${phy.name}(${phy.mult}x) ｜ 互动对象：${c} ｜ 设定：${personaDesc || charDesc || "见正文"}
【当前统计参考】：小穴${curVars.计数?.性交?.小穴 || 0}次, 口${curVars.计数?.性交?.口 || 0}次, 屁眼${curVars.计数?.性交?.屁眼 || 0}次, 内射${curVars.计数?.射精?.内射 || 0}次, 高潮${curVars.计数?.高潮?.总数 || 0}次, 接客${curVars.计数?.交易?.接客卖身 || 0}次 ｜ 当前性癖：${curFetishes}

【最新故事楼层正文】：
${rawText.slice(-3600)}

直接输出如下结构的纯 JSON 对象（以 { 开头，以 } 结尾）：
{
  "当前认知名字": "文中主角当前的真实名字",
  "种族与体质": "凡人敏感肉胎 或 魅魔体质 等",
  "风月挂牌身价": "当前身价估值与肉器评级描述",
  "生理周期阶段": "危险排卵期 或 安全期 等",
  "受孕概率": 65,
  "催眠深度": 0,
  "常识改写状态": "无 或 已植入的催眠常识",
  "体力": 68,
  "对肉棒好感度": 35, "性欲程度": 28, "淫乱恶堕": 48,
  "羞耻度": 32, "服从度": 65, "沦陷度": 20, "快感累积": 15, "意识清醒度": 95, "人格崩解度": 25,
  "口内毫升": 0, "小穴毫升": 5, "子宫毫升": 15, "屁眼毫升": 0,
  "计数": { "口": 48, "小穴": 142, "屁眼": 0, "乳穴": 0, "足腿": 12, "高潮": 86, "强制高潮": 5, "寸止": 3, "内射": 118, "颜射": 34, "吞精次数": 26, "吞精毫升": 130, "喷乳次数": 0, "喷乳毫升": 0, "自慰": 12, "失禁": 0, "喷潮": 0, "露出": 5, "接客": 142, "轮奸": 0, "睡奸": 0 },
  "当前姿势": "一句话概括当前姿势",
  "体表痕迹": "当前体表红痕与精斑",
  "当前敏感点": "当前核心敏感部位",
  "规矩与日程": "当前心理目标或调教规矩",
  "性癖列表": [
    { "name": "简短下流性癖名", "origin": "触发计数项与达标由来", "val": 52, "stage": "第三阶段", "desc": "符合该性癖与当前阶段的色情重口微观生理发作表现(100字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(160字以上三段式长心声)" }
  ],
  "按钮详情": {
    "身份与背景": { "stage": "4字概括", "desc": "主角当前真实身份、挂牌身价、体质耐受度与眼前处境详写(100字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(160字以上)" },
    "肉体外貌": { "stage": "4字概括", "desc": "严格依据正文的主角容颜、胸臀身材、体表红痕与正字涂鸦详写(100字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(160字以上)" },
    "内心独白": { "thought": "【生理层】...｜【心理层】...｜【欲望层】...(200字以上当下最核心的长篇心理独白)" },
    "当前姿势": { "desc": "当前肢体动作、身体曲线与走动漏精细节详写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "cockLove": { "stage": "4字阶段", "desc": "对男性肉棒的粘膜记忆与心理反应(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "lust": { "stage": "4字阶段", "desc": "体内情欲燥热、乳尖充血与淫水反应(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "corr": { "stage": "4字阶段", "desc": "道德矜持防线与风尘/恶堕进度(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "shame": { "stage": "4字阶段", "desc": "羞耻心钝化或反噬实况(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "obey": { "stage": "4字阶段", "desc": "顺从迎合度与条件反射实况(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "pleas": { "stage": "4字阶段", "desc": "高潮余韵断瘾空虚或敏感带过电蓄积(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "精神沦陷": { "desc": "精神防线、催眠洗脑、常识改写与清醒度实况(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "骚口实况": { "desc": "唇瓣微肿、香舌、咽喉深喉记忆与口胃储精专属解剖描写(100字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(160字以上)" },
    "胸部实况": { "desc": "双乳罩杯、乳肉垂挂微颤、乳头充血硬挺与乳腺泌乳专属解剖描写(100字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(160字以上)" },
    "小穴实况": { "desc": "阴唇红肿外翻、闭合不全、阴道内壁泥泞与白浊拉丝专属解剖描写(100字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(160字以上)" },
    "子宫实况": { "desc": "子宫排卵期断面透视、宫颈口软烂微张、精虫围攻卵子与宫腔储精专属描写(110字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(160字以上)" },
    "阴蒂尿道": { "desc": "阴蒂充血凸起、寸止折磨、尿道括约肌与排尿冲精专属描写(100字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(160字以上)" },
    "屁眼实况": { "desc": "丰腴臀瓣掌印、臀缝肛门微红与直肠储精专属描写(100字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(160字以上)" },
    "穿搭_头饰": { "stage": "当前头部/发丝概括", "desc": "发型、汗湿发丝、脸颊潮红与唇角涎水色情描写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "穿搭_颈部": { "stage": "当前颈部/锁骨概括", "desc": "雪颈、锁骨凹陷薄汗、香肩红痕或项圈描写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "穿搭_胸罩": { "stage": "当前胸罩/真空概括", "desc": "真空无内衣或胸罩包裹、乳肉起伏与硬挺乳头顶起布料描写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "穿搭_上衣": { "stage": "当前上衣概括", "desc": "上衣款式、领口松垮歪斜与下摆走光描写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "穿搭_内裤": { "stage": "当前内裤/真空概括", "desc": "真空光裸或底裤浸湿、纸团按压阴唇吸精描写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "穿搭_下装": { "stage": "当前下装/裸臀概括", "desc": "无下装光裸或裙裤包裹、臀肉掌印若隐若现描写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "穿搭_丝袜": { "stage": "当前美腿/精斑概括", "desc": "修长裸腿或丝袜、大腿根内侧指痕与浓精滑落白线描写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "穿搭_鞋子": { "stage": "当前鞋子/玉足概括", "desc": "鞋履款式、纤细足背、脚趾微蜷与脚面滴落精斑描写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "爱液分泌": { "desc": "体内道具、满屋精腥味与淫水汗液交织实况描写(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "六孔总账": { "desc": "各孔穴开发累计次数与身体形状记忆总结(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "高潮总账": { "desc": "高潮泄身、寸止与潮吹失禁记录总结(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "射精总账": { "desc": "子宫内射、吞精与喷乳承受记录总结(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" },
    "露出总账": { "desc": "风尘接客卖身、轮奸、睡奸与当众露出记录总结(90字以上)", "thought": "【生理层】...｜【心理层】...｜【欲望层】...(150字以上)" }
  }
}`;
    }

    function repairAndParseJson(rawText) {
        if (!rawText) return null;
        let s = rawText
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
            console.warn("[V22 JSON Repair Failed]:", e3);
            return null;
        }
    }

    function applyApiFullResponse(replyText, targetMsg, fid, sourceLabel = "API") {
        if (!replyText) return false;
        const data = repairAndParseJson(replyText);
        if (data && typeof data === "object") {
            const v = curVars;
            if (data.当前认知名字 && String(data.当前认知名字).trim()) v.档案.当前认知名字 = String(data.当前认知名字).trim();
            if (data.种族与体质 && String(data.种族与体质).trim()) v.档案.种族与体质 = String(data.种族与体质).trim();
            if (data.风月挂牌身价 && String(data.风月挂牌身价).trim()) v.档案.风月挂牌身价 = String(data.风月挂牌身价).trim();
            if (data.生理周期阶段) v.受孕与生理.生理周期阶段 = String(data.生理周期阶段);
            if (typeof data.受孕概率 === "number") v.受孕与生理.受孕概率 = data.受孕概率;
            if (typeof data.催眠深度 === "number") v.精神与心理扩展.催眠深度 = data.催眠深度;
            if (data.常识改写状态) v.体内道具与权限.常识改写状态 = String(data.常识改写状态);

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

            if (typeof data.口内毫升 === "number") v.体内精液存量.口内毫升 = data.口内毫升;
            if (typeof data.小穴毫升 === "number") v.体内精液存量.小穴毫升 = data.小穴毫升;
            if (typeof data.子宫毫升 === "number") v.体内精液存量.子宫毫升 = data.子宫毫升;
            if (typeof data.屁眼毫升 === "number") v.体内精液存量.屁眼毫升 = data.屁眼毫升;

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

            if (data.当前姿势) v.实况.当前姿势 = data.当前姿势;
            if (data.体表痕迹) v.痕迹与标记.体表痕迹 = data.体表痕迹;
            if (data.当前敏感点) v.精神与心理扩展.当前敏感点 = data.当前敏感点;
            if (data.规矩与日程) v.调教进度.规矩与日程 = data.规矩与日程;

            if (Array.isArray(data.性癖列表)) {
                const newItems = [];
                v.性癖详情 = v.性癖详情 || {};
                const phy = detectPhysiqueProfile(v);
                const c = v.计数 || {};
                const totalCnt = (Number(c.性交?.小穴) || 0) + (Number(c.性交?.口) || 0) + (Number(c.射精?.内射) || 0) + (Number(c.交易?.接客卖身) || 0);
                const maxCap = calcNonlinearFetishScore(Math.max(1, totalCnt * 0.6), 1.0, phy.mult, Number(v.核心数值?.淫乱恶堕) || 0).val;

                data.性癖列表.forEach(item => {
                    if (!item || !item.name) return;
                    const nm = String(item.name).trim();
                    let num = Math.max(1, Math.min(100, Number(item.val) || 20));
                    if (totalCnt > 0 && num > maxCap + 18) num = Math.min(num, maxCap + 12);
                    const stg = stageNameFromVal(num);
                    const orig = String(item.origin || "调教与开发形成").trim();
                    newItems.push(`${nm}-${orig}-${stg}-${num}/100`);
                    v.性癖详情[nm] = {
                        origin: orig, val: num, stage: stg,
                        desc: item.desc || "",
                        thought: cleanThoughtText(item.thought || "")
                    };
                });
                if (newItems.length > 0) v.性癖.条目 = newItems;
            }

            if (data.按钮详情 && typeof data.按钮详情 === "object") {
                v.按钮详情 = { ...v.按钮详情, ...data.按钮详情 };
            }

            saveChatCache(v);
            latestStatus = getFallbackData();
            renderBody();
            showToast(`✅ ${sourceLabel}全量重绘成功！主角【${latestStatus.charName}】全部三层长心声已刷新！`, "success", 4000);
            return true;
        }

        if (replyText.includes("_.set(")) {
            applySetStatements(replyText, curVars);
            saveChatCache(curVars);
            latestStatus = getFallbackData();
            renderBody();
            showToast(`✅ ${sourceLabel}变量同步完成！`, "success", 3000);
            return true;
        }
        return false;
    }

    async function triggerMainApiForceUpdate(btnEl = null) {
        if (!checkCardAvailable(false)) return;
        if (userSettings.apiUrl && userSettings.apiKey) {
            await triggerExternalApiUpdate(null, btnEl);
            return;
        }
        const ctx = safeCtx(), chat = ctx?.chat || [];
        const fid = chat.length - 1, targetMsg = chat[fid], rawText = targetMsg?.mes || "";
        const u = detectProtagonistName(curVars), c = ctx?.name2 || "角色";
        const oldTxt = btnEl ? btnEl.textContent : "";
        if (btnEl) btnEl.textContent = "⏳ 全量重绘中...";
        showToast(`⏳ 正在调用主 API 为主角【${u}】全量重绘三段式长心声与黄油断面...`, "info", 6000);
        try {
            const prompt = buildFullJsonApiPrompt(u, c, rawText);
            let reply = "";
            if (typeof window.TavernHelper?.generateRaw === "function") {
                reply = await window.TavernHelper.generateRaw({
                    ordered_prompts: [
                        { role: "system", content: "你是一个只输出标准 JSON 对象的后端数据接口，严禁输出任何 JSON 以外的字符。" },
                        { role: "user", content: prompt }
                    ]
                });
            } else {
                const quietFn = generateQuietPrompt || ctx?.generateQuietPrompt || window.generateQuietPrompt;
                if (typeof quietFn === "function") {
                    try { reply = await quietFn(prompt, false, false); } catch (e1) { reply = await quietFn({ quietPrompt: prompt }); }
                } else {
                    throw new Error("未检测到主API静默接口，请在 ⚙️设置 中配置副API！");
                }
            }
            const ok = applyApiFullResponse(reply, targetMsg, fid, "主API");
            if (btnEl) btnEl.textContent = ok ? "✅ 重绘完成" : "⚠️ 建议用副API";
            if (!ok) showToast("⚠️ 主API受角色卡预设干扰未输出纯JSON，已用本地引擎刷新！建议配置副API", "warn", 4500);
        } catch (err) {
            console.error(err);
            if (btnEl) btnEl.textContent = "❌ 失败";
            showToast("❌ API重绘失败：" + (err.message || "请在设置中配置副API"), "error", 4500);
        }
        if (btnEl && oldTxt) setTimeout(() => { if (statusBtn) btnEl.textContent = oldTxt; }, 2500);
    }

    function getNormalizedEndpoints(rawUrl) {
        let u = (rawUrl || "").trim().replace(/\/+$/, "");
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
        if (!modelsUrl) { showToast("⚠️ 请先填写有效的 API 地址 (URL)！", "error"); return; }
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

    async function triggerExternalApiUpdate(manualFloorId = null, statusBtn = null) {
        if (!checkCardAvailable(false)) return;
        const { chatUrl } = getNormalizedEndpoints(userSettings.apiUrl);
        if (!chatUrl || !userSettings.apiKey) {
            if (manualFloorId !== null || statusBtn) showToast("⚠️ 请先在 ⚙️设置 中填写副 API 地址和 Key！", "error");
            return;
        }
        const ctx = safeCtx(), chat = ctx?.chat || [];
        const fid = manualFloorId !== null ? manualFloorId : (chat.length - 1);
        const targetMsg = chat[fid], rawText = targetMsg?.mes || "";
        if (!rawText) return;
        const btn = statusBtn || document.getElementById("st-v12-api-test"), oldTxt = btn ? btn.textContent : "";
        if (btn) btn.textContent = "⏳ 副API重绘中...";
        const u = detectProtagonistName(curVars), c = ctx?.name2 || "角色";
        showToast(`⏳ 正在通过副 API 实时重绘主角【${u}】的三段式长心声与全部按钮...`, "info", 4500);
        try {
            const prompt = buildFullJsonApiPrompt(u, c, rawText);
            const res = await fetch(chatUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userSettings.apiKey}` },
                body: JSON.stringify({
                    model: userSettings.apiModel || "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "你是一个只输出合法 JSON 对象的色情重口状态栏实时重绘引擎。严禁输出任何 markdown 标记或多余解释，字符串内部严禁使用未转义的英文双引号。" },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.35, stream: false
                })
            });
            const resText = await res.text();
            let reply = "";
            if (resText.trim().startsWith("data:")) {
                for (const line of resText.split("\n")) {
                    const t = line.replace(/^data:\s*/, "").trim();
                    if (!t || t === "[DONE]") continue;
                    try { const ck = JSON.parse(t); reply += ck?.choices?.[0]?.delta?.content || ck?.choices?.[0]?.message?.content || ""; } catch (e) {}
                }
            } else {
                const data = JSON.parse(resText);
                if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
                reply = data?.choices?.[0]?.message?.content || "";
            }
            const ok = applyApiFullResponse(reply, targetMsg, fid, "副API");
            if (btn) btn.textContent = ok ? "✅ 副API重绘成功" : "⚠️ 格式已自动修复";
        } catch (err) {
            if (btn) btn.textContent = "❌ 失败";
            showToast("❌ 副API重绘失败：" + (err.message || "网络错误"), "error", 4500);
        }
        if (statusBtn && oldTxt) setTimeout(() => { if (statusBtn) statusBtn.textContent = oldTxt; }, 2500);
    }

    // 【V22 结构化高定详情弹窗】：将客观解剖区块与三段式递进心声渲染为层次分明的卡片UI
    function showDetailPopup(itemIdx) {
        const d = (latestStatus && latestStatus.categories?.length) ? latestStatus : getFallbackData();
        const cat = activeCat !== null ? d.categories[activeCat] : null;
        if (!cat || !cat.items[itemIdx]) return;
        curDetailIdx = itemIdx;
        const item = cat.items[itemIdx], ov = document.getElementById("st-v6-detail-modal");
        if (!ov) return;
        document.getElementById("st-v6-det-title").innerHTML = item.keyHTML;
        document.getElementById("st-v6-det-bar").innerHTML = item.barHTML || "";

        const rawDesc = (item.desc || "暂无详细描述").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const [objPart, thoughtPart] = rawDesc.split(/💭(?=【)/);

        // 将客观描述按 【...】 拆分为精美微卡片
        const objLines = (objPart || "").trim().split(/\n+/).filter(Boolean);
        let objHTML = "";
        objLines.forEach(line => {
            const styledLine = line.replace(/【([^】]+)】/g, `<b style="color:#f9e2af;">【$1】</b>`);
            if (line.startsWith("【")) {
                objHTML += `<div class="st-sec-block">${styledLine}</div>`;
            } else {
                objHTML += `<div style="padding:2px 6px 6px 6px;color:#ede6f2;">${styledLine}</div>`;
            }
        });

        // 将三段式递进心声（【生理层】｜【心理层】｜【欲望层】）渲染为三层递进高亮气泡
        let thoughtHTML = "";
        if (thoughtPart) {
            const tMatch = thoughtPart.match(/^(【[^】]+】)：?([\s\S]*)$/);
            const tHeader = tMatch ? tMatch[1] : "【实时三层递进心声】";
            let tBody = (tMatch ? tMatch[2] : thoughtPart).replace(/^[\s"“*]+|[\s"”*]+$/g, "");
            if (tBody.includes("｜")) {
                const layers = tBody.split(/\s*｜\s*/).map(l => {
                    return `<div class="st-thought-layer">${l.replace(/【([^】]+)】/g, `<b style="color:#f9e2af;font-style:normal;">【$1】</b>`)}</div>`;
                }).join("");
                thoughtHTML = `<div class="st-thought-box"><b style="color:#f9e2af;font-style:normal;font-size:13.5px;display:block;margin-bottom:6px;">💭 ${tHeader}</b>${layers}</div>`;
            } else {
                thoughtHTML = `<div class="st-thought-box"><b style="color:#f9e2af;font-style:normal;font-size:13.5px;display:block;margin-bottom:6px;">💭 ${tHeader}</b>“*${tBody}*”</div>`;
            }
        }

        document.getElementById("st-v6-det-desc").innerHTML = objHTML + thoughtHTML;
        document.getElementById("st-v6-det-page").textContent = `${cat.icon} ${cat.title} (${itemIdx + 1}/${cat.items.length})`;
        ov.style.display = "flex";
    }

    function renderSettingsView(body) {
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        const phy = detectPhysiqueProfile(curVars);
        const box = document.createElement("div");
        box.style.cssText = "display:flex;flex-direction:column;gap:12px;font-size:12.5px;";
        const hasModels = Array.isArray(userSettings.modelList) && userSettings.modelList.length > 0;
        box.innerHTML = `
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🧬 0. 主角认知真名与种族体质难度设定</div>
                <div style="display:flex;gap:6px;align-items:center;">
                    <input id="st-protag-name-inp" type="text" placeholder="自动识别中（当前：${detectProtagonistName(curVars)}）" value="${curVars.档案?.当前认知名字 || ""}" style="flex:1;background:#11111b;color:#f9e2af;border:1px solid ${tc.prim};border-radius:6px;padding:6px 8px;font-size:12px;font-weight:bold;">
                    <button id="st-protag-name-reset" type="button" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.25);border-radius:6px;padding:6px 10px;cursor:pointer;font-size:12px;">重置自动</button>
                </div>
                <div style="font-size:11.5px;color:${tc.sub};margin-top:2px;">当前生效体质：<b style="color:#f9e2af;">${phy.name}（性癖升级耐受倍率：${phy.mult}x）</b></div>
                <select id="st-phy-mode-sel" style="background:#11111b;color:#f9e2af;border:1px solid ${tc.sec};border-radius:6px;padding:6px 8px;font-size:12px;cursor:pointer;">
                    ${Object.entries(PHYSIQUE_PRESETS).map(([k, v]) => `<option value="${k}" ${userSettings.physiqueMode === k ? "selected" : ""}>${v.label}</option>`).join("")}
                </select>
            </div>
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🔌 1. API 全量实时重绘设置（含三段式长心声与黄油断面）</div>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input id="st-api-chk" type="checkbox" ${userSettings.apiSyncEnabled ? "checked" : ""} style="accent-color:${tc.prim};"><span><b>每回合结束后自动调用副 API 全量改写所有按钮与三层心声</b></span></label>
                <input id="st-api-url" type="text" placeholder="副 API 地址，如 https://api.openai.com/v1" value="${userSettings.apiUrl || ""}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                <input id="st-api-key" type="password" placeholder="副 API Key (sk-...)" value="${userSettings.apiKey || ""}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                <div style="display:flex;gap:6px;align-items:center;">
                    <input id="st-api-mod" type="text" placeholder="模型名称" value="${userSettings.apiModel || ""}" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                    <button id="st-v13-fetch-models" type="button" style="background:rgba(203,166,247,0.25);color:#f5c2e7;border:1px solid ${tc.sec};border-radius:6px;padding:6px 10px;font-weight:bold;cursor:pointer;white-space:nowrap;font-size:12px;">📥 拉取模型</button>
                </div>
                <select id="st-api-mod-sel" style="display:${hasModels ? "block" : "none"};background:#11111b;color:#f9e2af;border:1px solid ${tc.prim};border-radius:6px;padding:6px 8px;font-size:12px;cursor:pointer;">
                    ${(userSettings.modelList || []).map(m => `<option value="${m}" ${m === userSettings.apiModel ? "selected" : ""}>${m}</option>`).join("")}
                </select>
                <div style="display:flex;gap:8px;margin-top:4px;">
                    <button id="st-v12-api-save" type="button" style="flex:1;background:${tc.prim};color:#11111b;border:none;border-radius:8px;padding:7px;font-weight:bold;cursor:pointer;">💾 保存设置</button>
                    <button id="st-v12-api-test" type="button" style="flex:1;background:${tc.hi};color:#fff;border:1px solid ${tc.sec};border-radius:8px;padding:7px;font-weight:bold;cursor:pointer;">⚡ 立即用副API全量重绘本层</button>
                </div>
            </div>
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎨 2. 主题样式切换</div>
                <div id="st-v12-themes" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"></div>
            </div>
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">📐 3. 窗口尺寸与字号</div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>宽度 (<b id="st-w-val">${userSettings.width}</b>px)：</span><input id="st-w-rng" type="range" min="340" max="900" value="${userSettings.width}" style="flex:1;accent-color:${tc.prim};"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>高度 (<b id="st-h-val">${userSettings.height}</b>px)：</span><input id="st-h-rng" type="range" min="360" max="920" value="${userSettings.height}" style="flex:1;accent-color:${tc.prim};"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>字号 (<b id="st-z-val">${userSettings.fontScale}</b>%)：</span><input id="st-z-rng" type="range" min="80" max="135" value="${userSettings.fontScale}" style="flex:1;accent-color:${tc.prim};"></div>
            </div>`;
        body.appendChild(box);

        const nameInp = box.querySelector("#st-protag-name-inp");
        const phySel = box.querySelector("#st-phy-mode-sel");
        phySel.onchange = () => {
            userSettings.physiqueMode = phySel.value;
            saveSettings();
            latestStatus = getFallbackData();
            showToast(`🧬 体质难度已切换为：${PHYSIQUE_PRESETS[phySel.value].label}`, "info", 2500);
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
            userSettings.physiqueMode = phySel.value;
            userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
            userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
            userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
            userSettings.apiModel = modInp.value.trim();
            saveSettings();
            latestStatus = getFallbackData();
            inSettings = false; renderBody();
            showToast("💾 设置已保存！", "success", 2000);
        };
        box.querySelector("#st-v12-api-test").onclick = () => {
            if (nameInp && curVars.档案) curVars.档案.当前认知名字 = nameInp.value.trim();
            userSettings.physiqueMode = phySel.value;
            userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
            userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
            userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
            userSettings.apiModel = modInp.value.trim();
            saveSettings(); triggerExternalApiUpdate();
        };
    }

    function renderBody() {
        applyThemeAndSize();
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        const hasCard = checkCardAvailable(true);
        const phy = detectPhysiqueProfile(curVars);
        const d = (latestStatus && latestStatus.categories?.length) ? latestStatus : getFallbackData();
        const setTxt = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
        setTxt("st-v5-btn-txt", hasCard ? `👑 ${d.charName || "主角"} · 状态栏` : `⚠️ 未选角色卡 · 状态栏`);
        setTxt("st-v5-title", hasCard ? `${d.charName} [${phy.name}] (${typeof d.floorId === "number" ? "#" + d.floorId + "层" : d.floorId})` : `⚠️ 当前未选择角色卡或无聊天记录`);

        const tabBar = document.getElementById("st-v5-tabs");
        if (tabBar) {
            tabBar.innerHTML = "";
            const homeBtn = document.createElement("button"); homeBtn.type = "button";
            const isHome = activeCat === null && !inSettings;
            homeBtn.style.cssText = `width:100%;padding:9px 6px;border-radius:10px;font-size:12px;font-weight:bold;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;border:1px solid ${isHome ? tc.prim : "rgba(255,255,255,0.1)"};background:${isHome ? tc.prim : "rgba(255,255,255,0.05)"};color:${isHome ? "#11111b" : tc.text};transition:all 0.15s;`;
            homeBtn.innerHTML = `<span style="font-size:16px;">🏠</span><span>总览</span>`;
            homeBtn.onclick = () => { inSettings = false; activeCat = null; renderBody(); };
            tabBar.appendChild(homeBtn);

            d.categories.forEach((cat, idx) => {
                const tb = document.createElement("button"); tb.type = "button";
                const isAct = !inSettings && activeCat === idx;
                tb.style.cssText = `width:100%;padding:9px 6px;border-radius:10px;font-size:12px;font-weight:bold;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;border:1px solid ${isAct ? tc.prim : "rgba(255,255,255,0.12)"};background:${isAct ? tc.hi : "rgba(0,0,0,0.35)"};color:${isAct ? tc.prim : tc.text};box-shadow:${isAct ? `0 0 10px ${tc.hi}` : "none"};transition:all 0.15s;`;
                tb.innerHTML = `<span style="font-size:16px;">${cat.icon}</span><span>${SHORT_NAMES[cat.title] || cat.title.slice(0, 2)}</span>`;
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
                <div style="font-size:12.5px;color:${tc.sub};line-height:1.6;">请先在 SillyTavern 中点选一张角色卡并开启对话。<br>进入角色卡后，状态栏将自动识别文中主角真名、种族耐受倍率与黄油大百科状态！</div>`;
            body.appendChild(emptyBox);
            return;
        }

        if (activeCat === null || !d.categories[activeCat]) {
            const vagCnt = Number(curVars.计数?.性交?.小穴) || 0;
            const creampieCnt = Number(curVars.计数?.射精?.内射) || 0;
            const corrVal = Number(curVars.核心数值?.淫乱恶堕) || 0;
            const pleasVal = Number(curVars.精神与心理?.快感累积) || 0;
            const cyc = curVars.受孕与生理?.生理周期阶段 || "危险排卵期";
            const badgeBanner = document.createElement("div");
            badgeBanner.style.cssText = `margin-bottom:10px;padding:10px 12px;background:linear-gradient(135deg,rgba(0,0,0,0.65),rgba(42,27,61,0.55));border:${tc.cardBorder};border-radius:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;font-size:12px;box-shadow:inset 0 0 12px rgba(243,139,168,0.14);`;
            badgeBanner.innerHTML = `
                <span style="color:#f9e2af;font-weight:bold;">🎭 ${d.charName} · ${phy.name}(${phy.mult}x)</span>
                <span style="color:${tc.prim};">🥚 ${cyc} ｜ 贯穿:${vagCnt} / 内射:${creampieCnt}</span>
                <span style="color:${tc.sec};"><span class="st-heart-beat">💓</span> 恶堕:<b>${corrVal}%</b> ｜ 快感:<b>${pleasVal}%</b></span>`;
            body.appendChild(badgeBanner);

            const vList = document.createElement("div");
            vList.style.cssText = "display:flex;flex-direction:column;gap:9px;";
            d.categories.forEach((cat, idx) => {
                const b = document.createElement("div");
                b.className = "st-v22-card";
                b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-left:4.5px solid ${tc.prim};border-radius:12px;padding:12px 14px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 14px rgba(0,0,0,0.45);`;
                b.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:14.5px;font-weight:bold;color:${tc.prim};">${cat.icon} ${cat.title}</span>
                        <span style="font-size:11px;background:${tc.hi};color:${tc.text};padding:2px 9px;border-radius:99px;font-weight:bold;">共 ${cat.items.length} 项 ▸</span>
                    </div>
                    <div style="font-size:12px;color:${tc.sub};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cat.summary || `点击展开查看 ${cat.title} 详细解剖与三段式心声`}</div>`;
                b.onclick = (e) => { e.stopPropagation(); activeCat = idx; renderBody(); };
                vList.appendChild(b);
            });
            body.appendChild(vList);
        } else {
            const cat = d.categories[activeCat], list = document.createElement("div");
            list.style.cssText = "display:flex;flex-direction:column;gap:10px;";
            cat.items.forEach((it, idx) => {
                const b = document.createElement("div");
                b.className = "st-v22-card";
                b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-radius:12px;padding:11px 13px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 12px rgba(0,0,0,0.45);`;
                const parts = (it.desc || "").split("💭");
                const objPreview = parts[0].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 52) + "…";
                const thoughtPreview = parts[1] ? "💭 " + parts[1].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 56) + "…" : "";
                b.innerHTML = `${it.keyHTML}${it.barHTML || ""}
                    <div style="font-size:11.5px;color:${tc.sub};margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${objPreview}</div>
                    ${thoughtPreview ? `<div style="font-size:11.5px;color:#ffd6e7;font-style:italic;background:rgba(243,139,168,0.12);padding:5px 8px;border-radius:6px;border-left:2.5px solid #f38ba8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${thoughtPreview}</div>` : ""}
                    <div style="display:flex;justify-content:flex-end;margin-top:2px;"><span style="color:${tc.prim};font-size:11px;font-weight:bold;">点开查看黄油断面与三段式长心声 ▸</span></div>`;
                b.onclick = (e) => { e.stopPropagation(); showDetailPopup(idx); };
                list.appendChild(b);
            });
            body.appendChild(list);
        }
    }

    function mountExtensionSettingsMenu() {
        const container = document.getElementById("extensions_settings") || document.getElementById("extensions_settings2");
        if (!container || document.getElementById("st-v22-ext-drawer")) return;
        document.getElementById("st-v21-ext-drawer")?.remove();
        document.getElementById("st-v20-ext-drawer")?.remove();

        const drawer = document.createElement("div");
        drawer.id = "st-v22-ext-drawer";
        drawer.style.cssText = "margin-bottom:8px;border:1px solid rgba(243,139,168,0.35);border-radius:8px;overflow:hidden;background:rgba(0,0,0,0.2);";
        drawer.innerHTML = `
            <div id="st-v22-ext-header" style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;cursor:pointer;user-select:none;background:rgba(243,139,168,0.12);">
                <b style="color:#f5c2e7;font-size:13.5px;">📊 终极重口状态栏引擎 V22 (黄油大百科+三段式长心声)</b>
                <span id="st-v22-ext-arrow" style="color:#f38ba8;font-weight:bold;">▼ 展开设置</span>
            </div>
            <div id="st-v22-ext-content" style="display:none;padding:12px;font-size:13px;border-top:1px solid rgba(255,255,255,0.1);">
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;">
                    <input id="st-v22-ext-enable" type="checkbox" ${userSettings.enabled ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span><b>启用状态栏悬浮窗与后台变量注入</b></span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;cursor:pointer;">
                    <input id="st-v22-ext-hide" type="checkbox" ${userSettings.hideRawBlock ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span>自动折叠隐藏聊天正文尾部的原始【状态栏】与代码文本</span>
                </label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button id="st-v22-ext-open" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">👑 呼出状态栏面板</button>
                    <button id="st-v22-ext-sync" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">⚡ API全量重绘本层</button>
                </div>
            </div>`;
        container.appendChild(drawer);

        const header = drawer.querySelector("#st-v22-ext-header");
        const content = drawer.querySelector("#st-v22-ext-content");
        const arrow = drawer.querySelector("#st-v22-ext-arrow");

        header.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = content.style.display === "none";
            content.style.display = isHidden ? "block" : "none";
            arrow.textContent = isHidden ? "▲ 收起设置" : "▼ 展开设置";
        });

        drawer.querySelector("#st-v22-ext-enable").addEventListener("change", (e) => {
            userSettings.enabled = e.target.checked;
            saveSettings(); applyThemeAndSize();
            showToast(userSettings.enabled ? "✅ 状态栏插件已开启！" : "⏸️ 状态栏插件已隐藏关闭！", "info", 2000);
        });
        drawer.querySelector("#st-v22-ext-hide").addEventListener("change", (e) => {
            userSettings.hideRawBlock = e.target.checked;
            saveSettings(); cleanAll(true);
        });
        drawer.querySelector("#st-v22-ext-open").addEventListener("click", (e) => {
            e.stopPropagation();
            userSettings.enabled = true;
            const chk = document.getElementById("st-v22-ext-enable");
            if (chk) chk.checked = true;
            saveSettings(); applyThemeAndSize();
            const panel = document.getElementById("st-v5-panel");
            if (panel) { panel.style.display = "flex"; renderBody(); }
        });
        drawer.querySelector("#st-v22-ext-sync").addEventListener("click", (e) => {
            e.stopPropagation();
            triggerMainApiForceUpdate();
        });
    }

    function mountUI() {
        loadSettings();
        injectCustomStyles();
        document.getElementById("st-v5-root")?.remove();
        const root = document.createElement("div");
        root.id = "st-v5-root";
        root.style.cssText = `position:fixed;top:65px;right:20px;z-index:2147483647;font-family:'Microsoft YaHei',sans-serif;display:${userSettings.enabled ? "block" : "none"};`;
        root.innerHTML = `
        <div style="display:flex;justify-content:flex-end;align-items:center;">
            <button id="st-v5-toggle" type="button" style="background:linear-gradient(135deg,#f38ba8,#cba6f7);color:#11111b;border:none;font-weight:900;font-size:14px;padding:8px 18px;border-radius:99px;cursor:grab;user-select:none;touch-action:none;box-shadow:0 6px 20px rgba(243,139,168,0.6);">
                <span id="st-v5-btn-txt">👑 主角 · 状态栏</span>
            </button>
        </div>
        <div id="st-v5-panel" style="display:none;position:relative;margin-top:8px;width:${userSettings.width}px;height:${userSettings.height}px;min-width:340px;min-height:360px;max-width:96vw;max-height:88vh;background:linear-gradient(165deg,#181424,#1e192b);border:2px solid #f38ba8;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.92);color:#ede6f2;flex-direction:column;overflow:hidden;backdrop-filter:blur(12px);">
            <div id="st-v5-header" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.12);cursor:grab;user-select:none;touch-action:none;flex-shrink:0;gap:6px;">
                <b id="st-v5-title" style="color:#f5c2e7;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">主角档案</b>
                <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
                    <button id="st-v5-refresh-btn" type="button" title="调用API根据当前角色卡与最新楼层实时改写全部按钮与三段式长心声" style="background:rgba(166,227,161,0.22);color:#a6e3a1;border:1px solid rgba(166,227,161,0.55);border-radius:8px;padding:3px 9px;cursor:pointer;font-size:11.5px;font-weight:bold;">⚡ API全量重绘</button>
                    <button id="st-v5-cfg-btn" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.25);border-radius:8px;padding:3px 8px;cursor:pointer;font-size:11.5px;font-weight:bold;">⚙️ 设置</button>
                    <span id="st-v5-close" style="cursor:pointer;color:#f38ba8;font-size:16px;font-weight:bold;padding:0 4px;">✕</span>
                </div>
            </div>
            <div style="display:flex;flex:1;overflow:hidden;">
                <div id="st-v5-tabs" style="width:74px;display:flex;flex-direction:column;gap:6px;overflow-y:auto;padding:10px 7px;background:rgba(0,0,0,0.4);border-right:1px solid rgba(255,255,255,0.08);scrollbar-width:none;flex-shrink:0;"></div>
                <div id="st-v5-body" style="padding:12px;overflow-y:auto;flex:1;"></div>
            </div>
            <div id="st-v12-resize-r" style="position:absolute;top:40px;right:0;width:7px;bottom:18px;cursor:ew-resize;z-index:40;"></div>
            <div id="st-v12-resize-b" style="position:absolute;left:0;right:18px;bottom:0;height:7px;cursor:ns-resize;z-index:40;"></div>
            <div id="st-v12-resize-rb" style="position:absolute;right:0;bottom:0;width:20px;height:20px;cursor:nwse-resize;z-index:45;display:flex;align-items:flex-end;justify-content:flex-end;padding:3px;color:#f38ba8;font-size:11px;user-select:none;">◢</div>
            <div id="st-v6-detail-modal" style="display:none;position:absolute;inset:0;background:rgba(10,8,16,0.96);z-index:50;flex-direction:column;justify-content:center;padding:16px;">
                <div style="background:linear-gradient(160deg,#251d38,#1b152a);border:1.5px solid #f38ba8;border-radius:14px;padding:15px;max-height:94%;display:flex;flex-direction:column;gap:10px;box-shadow:0 12px 36px rgba(0,0,0,0.85);">
                    <div id="st-v6-det-title"></div>
                    <div id="st-v6-det-bar"></div>
                    <div id="st-v6-det-desc" style="color:#ede6f2;font-size:13px;line-height:1.75;overflow-y:auto;white-space:pre-wrap;word-break:break-word;padding:8px 2px;border-top:1px solid rgba(243,139,168,0.22);border-bottom:1px solid rgba(243,139,168,0.22);"></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding-top:2px;">
                        <button id="st-v6-prev" type="button" style="background:rgba(203,166,247,0.2);border:1px solid rgba(203,166,247,0.45);color:#f5c2e7;border-radius:8px;padding:4px 10px;font-size:12px;cursor:pointer;font-weight:bold;">⬅ 上一项</button>
                        <span id="st-v6-det-page" style="font-size:11.5px;color:#a6adc8;"></span>
                        <button id="st-v6-next" type="button" style="background:rgba(203,166,247,0.2);border:1px solid rgba(203,166,247,0.45);color:#f5c2e7;border-radius:8px;padding:4px 10px;font-size:12px;cursor:pointer;font-weight:bold;">下一项 ➔</button>
                        <button id="st-v6-det-close" type="button" style="background:rgba(243,139,168,0.25);border:1px solid #f38ba8;color:#fff;border-radius:8px;padding:4px 10px;font-size:12px;cursor:pointer;font-weight:bold;">关闭 ✕</button>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.appendChild(root);
        mountExtensionSettingsMenu();

        const panel = document.getElementById("st-v5-panel"), toggleBtn = document.getElementById("st-v5-toggle"), headerBar = document.getElementById("st-v5-header");

        function bindDirectDrag(handleEl, onClickCallback) {
            let isDown = false, moved = false, sx = 0, sy = 0, ir = 20, it = 65;
            handleEl.addEventListener("pointerdown", (e) => {
                if (e.target.closest("#st-v5-close") || e.target.closest("#st-v5-cfg-btn") || e.target.closest("#st-v5-refresh-btn")) return;
                isDown = true; moved = false; sx = e.clientX; sy = e.clientY;
                const rect = root.getBoundingClientRect(); ir = window.innerWidth - rect.right; it = rect.top;
                handleEl.style.cursor = "grabbing"; handleEl.setPointerCapture?.(e.pointerId);
            });
            handleEl.addEventListener("pointermove", (e) => {
                if (!isDown) return;
                const dx = e.clientX - sx, dy = e.clientY - sy;
                if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
                if (moved) {
                    root.style.right = Math.max(5, Math.min(window.innerWidth - 80, ir - dx)) + "px";
                    root.style.top = Math.max(5, Math.min(window.innerHeight - 50, it + dy)) + "px";
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
            if (!checkCardAvailable(false)) {
                panel.style.display = (panel.style.display === "none") ? "flex" : "none";
                if (panel.style.display === "flex") renderBody();
                return;
            }
            panel.style.display = (panel.style.display === "none") ? "flex" : "none";
            if (panel.style.display === "flex") renderBody();
        });
        bindDirectDrag(headerBar, null);

        const refreshBtn = document.getElementById("st-v5-refresh-btn");
        refreshBtn.onclick = async (e) => {
            e.stopPropagation();
            await triggerMainApiForceUpdate(refreshBtn);
        };

        document.getElementById("st-v5-cfg-btn").onclick = () => { inSettings = !inSettings; renderBody(); };
        document.getElementById("st-v5-close").onclick = () => { panel.style.display = "none"; };
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
            const rawPath = (m[2] || m[3] || "").trim(), rawVal = (m[4] || "").trim();
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
        const rawMes = safeCtx()?.chat?.[Number(id)]?.mes || "";
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
            h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 打开此层 (#${id}) V22黄油大百科状态栏</div>`;
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
                const t = chat[i]?.mes || "";
                if (t.includes("【状态栏")) parseInlineStatusBarText(t, fv);
                if (t.includes("_.set(")) applySetStatements(t, fv);
            }
            const cached = loadChatCache();
            if (cached) mergeCachedVars(fv, cached);

            curVars = fv;
            const protagName = detectProtagonistName(fv);
            const phy = detectPhysiqueProfile(fv);
            latestStatus = getFallbackData();
            if (chat.length > 0) latestStatus.floorId = chat.length - 1;

            if (notifyCardSwitch && curCardKey !== lastKnownCardKey) {
                lastKnownCardKey = curCardKey;
                showToast(`🔄 已切换角色卡：【${ctx?.name2 || "当前角色"}】｜主角：【${protagName} (${phy.name})】`, "info", 3800);
            } else if (!lastKnownCardKey) {
                lastKnownCardKey = curCardKey;
            }

            if (typeof setExtensionPrompt === "function") {
                setExtensionPrompt(EXT_ID, userSettings.enabled ? buildFullSystemPrompt(protagName, fv) : "", extension_prompt_types?.IN_CHAT ?? 1, 0);
            }
            renderBody();
        } catch (e) { console.error("[my-status-bar V22] recalc error:", e); renderBody(); }
    }

    mountUI();
    document.addEventListener("click", e => {
        const trg = e.target.closest(".st-ext-inline-trigger");
        if (trg) {
            recalc(false);
            activeCat = null; inSettings = false; renderBody();
            document.getElementById("st-v5-panel").style.display = "flex";
        }
    });

    if (eventSource && event_types) {
        eventSource.on(event_types.CHAT_CHANGED, () => {
            activeCat = null; latestStatus = null;
            setTimeout(() => { recalc(true); cleanAll(false); }, 220);
        });
        eventSource.on(event_types.MESSAGE_RECEIVED, i => setTimeout(() => {
            recalc(false); cleanDOM(i, true);
            if (userSettings.apiSyncEnabled) triggerExternalApiUpdate(i);
            else showToast(`📊 主角【${detectProtagonistName(curVars)}】状态栏已同步！`, "info", 2500);
        }, 180));
        eventSource.on(event_types.MESSAGE_UPDATED, i => setTimeout(() => { recalc(false); cleanDOM(i, true); }, 120));
        eventSource.on(event_types.MESSAGE_DELETED, () => setTimeout(() => { recalc(false); scheduleCleanAll(); }, 150));
        eventSource.on(event_types.GENERATION_STARTED, () => recalc(false));
    }

    const chatEl = document.getElementById("chat");
    if (chatEl) {
        const obs = new MutationObserver(() => { if (!isCleaningDOM) scheduleCleanAll(); });
        obs.observe(chatEl, { childList: true, subtree: false });
    }
    setTimeout(() => { recalc(true); cleanAll(false); }, 350);
})();
