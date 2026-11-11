// == 状态栏与楼层变量引擎 V21 (魅魔/凡人动态体质难度曲线 + 黄油级四维重口解剖 + 从头到脚8部位穿搭 + 正字烙印与子宫断面 + 全量JSON重绘) ==
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

    function injectCustomStyles() {
        if (document.getElementById("st-v21-custom-css")) return;
        const style = document.createElement("style");
        style.id = "st-v21-custom-css";
        style.textContent = `
            @keyframes stPulseGlow {
                0%, 100% { box-shadow: 0 0 8px rgba(255, 10, 84, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.3); }
                50% { box-shadow: 0 0 18px rgba(255, 10, 84, 0.95), inset 0 0 8px rgba(255, 255, 255, 0.6); }
            }
            @keyframes stHeartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.06); }
            }
            .st-v21-card {
                transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease !important;
            }
            .st-v21-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 22px rgba(243, 139, 168, 0.28) !important;
            }
            .st-stage5-badge {
                animation: stPulseGlow 1.8s infinite ease-in-out;
            }
            .st-heart-beat {
                display: inline-block;
                animation: stHeartbeat 1.4s infinite ease-in-out;
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
        try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, "📊 状态栏引擎 V21"); } catch (e) {}
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

    // 【核心升级】：种族与体质耐受倍率预设表
    const PHYSIQUE_PRESETS = {
        "auto": { label: "🤖 自动识别 (依设定与正文判断)", mult: 1.0 },
        "mortal": { label: "🌸 凡人柔弱体质 (1x 标准难度·300次五阶)", mult: 1.0 },
        "proud": { label: "⚔️ 修仙/骑士/高傲大小姐 (3.5x 耐受·1050次五阶)", mult: 3.5 },
        "succubus": { label: "😈 魅魔/淫魔/魔族体质 (18x 耐受·5400次五阶)", mult: 18.0 },
        "deity": { label: "👑 神明/龙族/深渊母体 (45x 极道耐受·13500次五阶)", mult: 45.0 }
    };

    let userSettings = {
        enabled: true,
        hideRawBlock: true,
        theme: "魅魔粉 (默认)",
        physiqueMode: "auto", // auto | mortal | proud | succubus | deity
        width: 520,
        height: 680,
        fontScale: 100,
        apiSyncEnabled: false,
        apiUrl: "",
        apiKey: "",
        apiModel: "",
        modelList: []
    };

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v21_cfg") || localStorage.getItem(EXT_ID + "_v20_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉 (默认)";
            if (!PHYSIQUE_PRESETS[userSettings.physiqueMode]) userSettings.physiqueMode = "auto";
        } catch (e) {}
    }
    function saveSettings() {
        try { localStorage.setItem(EXT_ID + "_v21_cfg", JSON.stringify(userSettings)); } catch (e) {}
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

    function getInitialVars() {
        return {
            档案: {
                当前认知名字: "",
                种族与体质: "", // 新增：记录凡人/魅魔/魔物/仙子等体质
                身份与背景: "",
                肉体外貌实况: "",
                当前处境: ""
            },
            核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
            精神与心理: { 羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0, 意识清醒度: 100, 人格崩解度: 0 },
            身体: { 体力: 100 },
            性癖: { 条目: [] },
            实况: {
                内心独白: "", 当前姿势: "", 当前衣装: "",
                骚口实况: "", 胸部实况: "", 小穴实况: "", 子宫实况: "", 阴蒂尿道实况: "", 屁眼实况: ""
            },
            穿搭: {
                头饰与眼部: "",
                颈部与项圈: "",
                胸罩与裹胸: "",
                上衣与束腰: "",
                内裤与遮挡: "",
                下装与裙裤: "",
                丝袜与腿部: "",
                鞋子与玉足: ""
            },
            计数: {
                性交: { 口: 0, 小穴: 0, 屁眼: 0, 乳穴: 0, 足腿: 0 },
                高潮: { 总数: 0, 强制: 0, 公开场合: 0, 寸止: 0 },
                射精: { 内射: 0, 颜射体外: 0 },
                精液摄入: { 吞精次数: 0, 累计毫升: 0 },
                自慰: 0,
                失控: { 失禁: 0, 喷潮: 0 },
                暴露: { 露出: 0, 被围观人次: 0 },
                交易: { 接客卖身: 0, 被外借共享: 0 }
            },
            受孕与生理: { 子宫怀孕: 0, 怀孕进度: 0, 受孕概率: 0, 生理周期阶段: "危险排卵期" },
            体内精液存量: { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
            痕迹与标记: { 体表痕迹: "无", 淫纹与刻印: "无", 公开字迹: "无", 穿刺与环饰: "无" },
            体内道具与权限: { 体内道具: "无", 束缚状态: "无", 穿戴中的标记物: "" },
            调教进度: { 规矩与日程: "", 条件反射触发词: "无" },
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
        return `${EXT_ID}_v21_cache_${cid}`;
    }

    function loadChatCache() {
        try {
            const raw = localStorage.getItem(getChatStoreKey()) || localStorage.getItem(`${EXT_ID}_v20_cache_${safeCtx()?.chatId || "default_chat"}`);
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
            if (s.核心数值) Object.assign(baseVars.核心数值, s.核心数值);
            if (s.精神与心理) Object.assign(baseVars.精神与心理, s.精神与心理);
            if (s.身体) Object.assign(baseVars.身体, s.身体);
            if (s.体内精液存量) Object.assign(baseVars.体内精液存量, s.体内精液存量);
            if (s.实况) Object.assign(baseVars.实况, s.实况);
            if (s.档案) Object.assign(baseVars.档案, s.档案);
            if (s.穿搭) Object.assign(baseVars.穿搭, s.穿搭);
            if (s.痕迹与标记) Object.assign(baseVars.痕迹与标记, s.痕迹与标记);
            if (s.体内道具与权限) Object.assign(baseVars.体内道具与权限, s.体内道具与权限);
            if (s.精神与心理扩展) Object.assign(baseVars.精神与心理扩展, s.精神与心理扩展);
            if (s.调教进度) Object.assign(baseVars.调教进度, s.调教进度);
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

    // 【核心升级】：动态检测主角种族体质与耐受倍率（魅魔/神魔 vs 凡人）
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
            return { type: "deity", name: "👑 神魔/高阶母体", mult: 40.0, isSuccubusLike: true };
        }
        if (/修仙|仙子|圣女|女帝|剑仙|少宗主|斗宗|骑士|精灵|女武神/i.test(combined)) {
            return { type: "proud", name: "⚔️ 仙道/高傲圣洁体质", mult: 3.5, isSuccubusLike: false };
        }
        return { type: "mortal", name: "🌸 凡人敏感肉胎", mult: 1.0, isSuccubusLike: false };
    }

    // 【核心升级】：科学的五阶段分段非线性难度曲线！
    // 凡人(mult=1.0) 标准基准：
    //   1 ~ 8 次    -> 第一阶段 (1% ~ 19%)
    //   9 ~ 35 次   -> 第二阶段 (20% ~ 39%)
    //   36 ~ 100 次 -> 第三阶段 (40% ~ 59%)
    //   101 ~ 280次 -> 第四阶段 (60% ~ 79%)
    //   281 ~ 600次 -> 第五阶段 (80% ~ 100%)
    // 若为魅魔(mult=18.0)，所有门槛自动乘以 18 倍（即需要 144次才出第一阶段，5000+次才满第五阶段）！
    function calcNonlinearFetishScore(count, unitWeight = 1.0, physiqueMult = 1.0, corr = 0) {
        if (count <= 0) return { val: 0, nextThreshold: Math.ceil(8 * physiqueMult / unitWeight), curThresholdBase: 0 };
        const effectiveCount = (count * unitWeight) / Math.max(0.5, physiqueMult);

        // 五阶段阶梯节点 (折算后的标准有效次数)
        const T1 = 8;    // 0 -> 19%
        const T2 = 35;   // 20 -> 39%
        const T3 = 100;  // 40 -> 59%
        const T4 = 280;  // 60 -> 79%
        const T5 = 650;  // 80 -> 100%

        let baseScore = 0;
        let nextRawTarget = T1;

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

        // 恶堕度只提供微弱的催化加成（最多+6分），且绝不允许在次数不足 T3 时跨入第四/第五阶段！
        const corrBonus = Math.min(6, corr * 0.06);
        let finalVal = Math.round(baseScore + corrBonus);

        // 硬性阶段锁：如果实际有效次数没到 T4(280次)，哪怕恶堕度再高也锁死在79分以下，绝不提前进第五阶段！
        if (effectiveCount < T1 && finalVal >= 20) finalVal = 19;
        if (effectiveCount < T2 && finalVal >= 40) finalVal = 39;
        if (effectiveCount < T3 && finalVal >= 60) finalVal = 59;
        if (effectiveCount < T4 && finalVal >= 80) finalVal = 79;

        finalVal = Math.max(1, Math.min(100, finalVal));
        const realNextThreshold = Math.max(count + 1, Math.ceil((nextRawTarget * physiqueMult) / unitWeight));

        return {
            val: finalVal,
            nextThreshold: realNextThreshold
        };
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

    // 【核心重构】：性癖解锁与五阶非线性计算（彻底修复十几次就五阶的Bug！）
    function computeUnlockedFetishes(v) {
        const c = v.计数 || {};
        const phy = detectPhysiqueProfile(v);
        const pMult = phy.mult;

        const vag = Number(c.性交?.小穴) || 0, mouth = Number(c.性交?.口) || 0, anal = Number(c.性交?.屁眼) || 0;
        const tit = Number(c.性交?.乳穴) || 0, foot = Number(c.性交?.足腿) || 0, creampie = Number(c.射精?.内射) || 0;
        const swallow = Number(c.精液摄入?.吞精次数) || 0, orgasm = Number(c.高潮?.总数) || 0;
        const squirt = Number(c.失控?.喷潮) || 0, leak = Number(c.失控?.失禁) || 0, mast = Number(c.自慰) || 0;
        const exp = Number(c.暴露?.露出) || 0, hooker = Number(c.交易?.接客卖身) || 0;
        const corr = Number(v.核心数值?.淫乱恶堕) || 0;

        const totalCount = vag + mouth + anal + tit + foot + creampie + swallow + orgasm + squirt + leak + mast + exp + hooker;
        const resultMap = new Map();

        // 1. 解析变量库里已有的性癖条目，但对其进行【合理性校准】！
        // 防止AI在总账才10来次时乱写 "第五阶段-95/100"
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

                // 【防虚高锁】：根据当前总开发次数与体质耐受度，限制AI手写性癖的最高阶段上限！
                const maxAllowedByTotal = calcNonlinearFetishScore(Math.max(1, totalCount * 0.6), 1.0, pMult, corr).val;
                if (totalCount > 0 && num > maxAllowedByTotal + 18) {
                    num = Math.min(num, maxAllowedByTotal + 12);
                }
                num = Math.max(1, Math.min(100, num));
                resultMap.set(rawName, {
                    name: rawName,
                    origin,
                    val: num,
                    stage: stageNameFromVal(num),
                    countNow: totalCount,
                    nextTarget: Math.ceil(totalCount * 1.5 + 10)
                });
            });
        }

        // 2. 根据单项真实计数，使用非线性阶梯算法动态生成/更新10大核心性癖
        const upsertAuto = (shortName, originTpl, count, unitWeight = 1.0) => {
            if (count <= 0) return;
            const { val: calcVal, nextThreshold } = calcNonlinearFetishScore(count, unitWeight, pMult, corr);
            const stg = stageNameFromVal(calcVal);
            const originStr = `${originTpl}（当前累计 ${count} 次，距下一阶段约需达 ${nextThreshold} 次｜当前体质耐受：${phy.name} ${pMult}x）`;

            if (resultMap.has(shortName)) {
                const ex = resultMap.get(shortName);
                ex.val = calcVal;
                ex.stage = stg;
                ex.origin = originStr;
                ex.countNow = count;
                ex.nextTarget = nextThreshold;
            } else {
                resultMap.set(shortName, {
                    name: shortName,
                    origin: originStr,
                    val: calcVal,
                    stage: stg,
                    countNow: count,
                    nextTarget: nextThreshold
                });
            }
        };

        upsertAuto("挨操肉穴瘾", `骚逼已被阳具贯穿 ${vag} 次，阴道肉褶正在形成阳具形状记忆`, vag, 1.0);
        upsertAuto("子宫受精癖", `宫腔已被滚烫浓精内射浇灌 ${creampie} 次，宫颈口习惯被龟头顶开锁精`, creampie, 1.15);
        upsertAuto("深喉吞精癖", `骚口已口交 ${mouth} 次、吞精 ${swallow} 次，食道与味蕾被雄性精腥味浸染`, mouth + swallow, 0.9);
        upsertAuto("后庭扩菊癖", `屁眼已被粗暴开发 ${anal} 次，直肠括约肌逐渐适应粗大异物塞满感`, anal, 1.3);
        upsertAuto("乳交奉侍癖", `丰乳已夹击服侍肉棒 ${tit} 次，乳肉与乳尖在摩擦中敏化充血`, tit, 1.4);
        upsertAuto("玉足恋精癖", `玉足已足交玩弄阳具 ${foot} 次，脚趾缝沾染浓精与先走汁即条件反射蜷缩`, foot, 1.4);
        upsertAuto("潮吹失禁癖", `累计绝顶 ${orgasm} 次、潮吹 ${squirt} 次、漏尿失禁 ${leak} 次，尿道括约肌与高潮神经短路`, orgasm * 0.5 + squirt * 2 + leak * 2.5, 1.0);
        upsertAuto("自慰抠穴癖", `难耐空虚自行抠挖骚穴 ${mast} 次，手指沾满拉丝淫水自我亵渎`, mast, 1.5);
        upsertAuto("公开露出癖", `当众赤裸露出或被视奸 ${exp} 次，将旁人下流视线转化为催情快感`, exp, 1.5);
        upsertAuto("风尘肉便器癖", `已接客卖身或共享 ${hooker} 次，自我认知逐渐向明码标价的泄欲肉具异化`, hooker, 1.1);

        return Array.from(resultMap.values());
    }

    // 【核心升级】：区分「凡人体质」与「魅魔/魔物体质」的五阶段重口性癖描写与心声！
    function buildFetishRichDesc(fetishObj, v, u) {
        const { name, origin, val, stage, countNow = 0, nextTarget = 20 } = fetishObj;
        const t = tier5(val, false);
        const phy = detectPhysiqueProfile(v);

        const apiFet = v.性癖详情?.[name];
        if (apiFet && apiFet.desc && apiFet.thought) {
            return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
                   `【体质耐受与进阶门槛】：${phy.name}（耐受倍率 ${phy.mult}x）｜当前有效计数：${countNow} -> 下一阶门槛：${nextTarget}\n` +
                   `【解锁成因】：${apiFet.origin || origin}\n` +
                   `【🔞 第${t + 1}阶段微观生理与神经发作实况】：\n${apiFet.desc}\n` +
                   `💭【${u}的${stage}实时心声】：“*${cleanThoughtText(apiFet.thought)}*”`;
        }

        // 魅魔/淫魔专属五阶段演化文本（从高傲捕食者 -> 魔核过载沦为母畜）
        if (phy.isSuccubusLike) {
            const succStageDescs = [
                `【第一阶段·捕食本能/高傲榨取】（${val}/100）：身为${phy.name}，「${name}」对${u}而言原本只是榨取低等雄性精气、滋补自身魔核的捕食手段。区区 ${countNow} 次交合连塞牙缝都不够，肉穴虽熟练地包裹吮吸，但灵魂深处仍保持着上位捕食者的戏谑与傲慢，仅在被顶到魔核深处时漏出一丝意外的鼻音。`,
                `【第二阶段·魔核食髓/反客为主】（${val}/100）：随着「${name}」累计达到 ${countNow} 次，${u}惊讶地发现对方阳具与浓精的质量远超普通猎物！原本用于催眠男人的魅魔粘膜开始反向对这股粗暴的雄性气息产生贪婪渴望，尾椎与魔纹微微发烫，在交合中不再单纯为了进食，而是开始贪图肉壁被粗暴刮蹭的酸麻快感。`,
                `【第三阶段·精气过载/捕食者沉沦】（${val}/100）：「${name}」已彻底撕裂了魅魔的高傲伪装！高浓度的滚烫精液与高频贯穿令${u}的魔核发生快感过载，原本掌控全局的上位者姿态在一次次深顶中溃不成军，湿滑紧致的魅魔肉腔开始不受控制地痉挛讨好，一旦断绝「${name}」就会引发魔纹刺痛与抓心挠肝的发情戒断。`,
                `【第四阶段·魔纹逆转/发情母畜化】（${val}/100）：重度恶堕！高贵的${phy.name}已被「${name}」彻底驯化为只知索求阳具的发情母犬！小腹淫纹常亮滴血色微光，肉孔被开发出永久贴合下等雄性巨物的形状记忆，高傲的言辞化作卑微下流的母狗浪叫，主动翘起臀部祈求用最粗暴的「${name}」将她的魔核彻底灌满！`,
                `【⚠️ 第五阶段·魔核熔断/深渊公用肉便器】（${val}/100）：终极极限恶堕！经历多达 ${countNow} 次浩瀚如海的残酷摧残与灌精，${u}引以为傲的魅魔神智与魔核已100%烧毁熔断！全身肉孔括约肌永久外翻失禁，24小时流淌着混杂魔力与浓精的淫水，双眼翻出阿片般的爱心白眼，彻底退化为供任何雄性随时排泄灌精的深渊肉便器！`
            ];
            const succThoughts = [
                `哼♡……区区凡人雄性的小把戏，本小姐可是高贵的${phy.name}呢💦！这点程度的「${name}」，不过是我拿来吸干你精气的开胃点心罢了……唔嗯，刚才那一下顶得稍微有点深了啦😳！`,
                `等等……这股滚烫又浓烈的雄性气息是怎么回事😳💦？明明是我要在「${name}」里榨干他的，为什么连我自己的魔核和骚穴都被顶得一抽一抽地发麻流汁了呀……❤️`,
                `哈啊♡……不妙了💦，哪怕我是魅魔，承受这种强度的「${name}」魔核也快要过载烧坏了🥵！身体自己在拼命夹紧讨好他，高傲的架子根本端不住了呀❤️！`,
                `呜汪♡……别再拿魅魔的尊严笑话人家了🥵💦！人家的魔核和骚逼早就已经被「${name}」调教成你的专属形状了，快点狠狠插进来喂饱这只发骚的魅魔母狗吧❤️❤️！`,
                `啊嘿♡……咕啾、魔核彻底融化坏掉了🥵💦！什么高贵的魅魔大人，${u}只是一条没有大鸡巴和「${name}」就活不下去的公用肉便器母猪呀，请把我操到失禁漏尿吧❤️❤️❤️！！`
            ];
            return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
                   `【🧬 魅魔/特异体质动态难度】：${phy.name}（耐受倍率 ${phy.mult}x｜当前累计 ${countNow} 次，距下一阶需 ${nextTarget} 次）\n` +
                   `【解锁成因】：${origin}\n` +
                   `【🔞 第${t + 1}阶段发作实况】：\n${succStageDescs[t]}\n` +
                   `💭【${u}的${stage}实时心声】：“*${succThoughts[t]}*”`;
        }

        // 凡人/修仙者五阶段重口演化文本
        const stageDescs = [
            `【第一阶段·异物初侵/屈辱应激】（${val}/100）：「${name}」刚刚在${u}的肉体上留下最初的浅层烙印（累计 ${countNow} 次，需达 ${nextTarget} 次升入二阶）。在理智层面仍对这种下流行为感到强烈的羞耻、排斥或是麻木隐忍，但娇嫩的粘膜与神经末梢已被强行记住异物摩擦的触感——每当回想起当时的画面，耳根便悄然发烫，腿心泛起一丝连自己都不愿承认的酸麻湿意。`,
            `【第二阶段·肉体通电/敏化成瘾】（${val}/100）：「${name}」已演化至第二阶段（累计 ${countNow} 次）！肉体的条件反射开始背叛大脑的矜持，相关部位的毛细血管与敏感神经长期处于充血敏化状态。只要闻到相似的雄性腥气或处于暗示情境下，${u}的呼吸便会瞬间紊乱滚烫，胸前乳尖自行硬挺顶起衣料，腿心花唇更是诚实地泌出滑腻透明的春水。`,
            `【第三阶段·理智崩解/戒断渴求】（${val}/100）：「${name}」已深化至第三阶段（累计 ${countNow} 次），彻底化作刻进骨髓与脊髓反射里的快感本能！羞耻防线全面溃散，痛觉与屈辱感在神经回路中被强行扭曲为高潮电流；一旦超过半日未能体验「${name}」，小腹深处就会泛起如毒瘾发作般的空虚抓挠感，双腿发软地主动迎合索取！`,
            `【第四阶段·肉改畸变/母狗狂犬化】（${val}/100）：「${name}」已恶化至第四阶段重度肉改状态（累计 ${countNow} 次）！长期高强度的开发已令${u}的相应器官产生不可逆的淫靡形变——括约肌松弛外翻、敏感肉珠肥大充血、腔道彻底记住阳具的粗大轮廓。言谈举止全面母狗化，毫无廉耻地敞开身体哭求更粗暴的「${name}」蹂躏！`,
            `【⚠️ 第五阶段·脑髓熔断/终极公用肉便器】（${val}/100）：全书最高重口天花板（累计 ${countNow} 次极限摧残）！「${name}」已将${u}的大脑皮层阿片受体彻底烧穿熔断！知性与人格灰飞烟灭，哪怕只是听到相关字眼或指令，便会瞬间瞳孔放大涣散、翻起白眼吐舌流涎，全身肉孔同时失禁喷水，彻底退化为只为「${name}」而抽搐高潮的痴呆肉便器！`
        ];

        const stageThoughts = [
            `呜……明明只是被迫经历了 ${countNow} 次而已，为什么身体会对「${name}」留下这么清楚的感觉啊💦？刚才稍微回想了一下，下面居然自己麻了一下……不行，我绝对不能沉迷这种事😳！`,
            `不、不对劲……为什么越是命令自己不去想「${name}」，小肚子反而越酸越热、内裤湿得越快啊😳💦？难道我的身体真的已经被开发出这种下流的习惯了吗……❤️`,
            `哈啊……已经骗不了自己了💦，只要一碰触到「${name}」的开关，整条脊椎骨都像通了电一样酥麻发软🥵……既然忍耐这么难受，不如顺从身体的渴求好好爽一回吧❤️！`,
            `受不了了……好想要「${name}」啊🥵💦！里面空虚得像有几千只蚂蚁在爬，什么自尊廉耻全都不要了，求求你快用最粗暴的「${name}」把人家这具发骚的肉体喂饱吧❤️❤️！`,
            `啊嘿♡……呕咕、「${name}」太爽了、脑子被操成浆糊了🥵💦！${u}生下来就是为了承受「${name}」而存在的下贱肉便器母猪呀，请一辈子把我操到翻白眼失禁漏尿吧❤️❤️❤️！！`
        ];

        return `【性癖名称】：「${name}」（当前进度：${stage} · ${val}/100）\n` +
               `【🧬 体质耐受与进阶门槛】：${phy.name}（耐受倍率 ${phy.mult}x｜当前累计 ${countNow} 次，距下一阶需 ${nextTarget} 次）\n` +
               `【解锁成因】：${origin}\n` +
               `【🔞 第${t + 1}阶段发作实况】：\n${stageDescs[t]}\n` +
               `💭【${u}的${stage}实时心声】：“*${stageThoughts[t]}*”`;
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
【🔥状态栏与变量实时更新规范（V21黄油重口引擎）】
1. 每条回复末尾输出：<UpdateVariable>块</UpdateVariable>。
2. 若主角在文中发生改名、变形或身份转换，必须用 _.set('${userName}.档案.当前认知名字', '文中新名字'); 实时同步！
3. 性癖阶段严禁虚高：凡人需数百次、魅魔需数千次方能进入第四/第五阶段，请按实际累计次数缓慢推进阶段。
4. 每回合必须从头到脚更新主角的8部位穿搭状态与六孔体液实况。`;
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
                const isStage5 = s.includes("第五阶段") || s.includes("终极") || s.includes("脑髓熔断") || s.includes("便器") || s.includes("赤裸") || s.includes("真空");
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

    // 【核心扩充】：黄油级四维重口数值详情与长篇带喘息心声
    function getDynamicMetricDetail(type, v, u, liveCtx) {
        const ovr = v.按钮详情?.[type];
        const phy = detectPhysiqueProfile(v);
        const map = {
            cockLove: {
                val: Number(v.核心数值?.对肉棒好感度) || 0, rev: false,
                st: ["抗拒排斥•本能戒备", "工具麻木•形状适应", "食髓知味•含泪渴求", "痴迷崇拜•主动跪舔", "肉棒至上•终极母狗"],
                d: [
                    `【🔬 神经与粘膜对雄性阳具的反应】：${u}在意识层面仍将粗硬滚烫、血管盘虬的雄性肉棒视为侵犯性异物；但面对雄性费洛蒙压迫时，瞳孔微缩、心跳加速，双腿本能内扣夹紧。\n【💦 生理排斥与应激实况】：口腔唾液腺与下体前庭大腺仅因紧张分泌少量保护性粘液，括约肌处于防备性紧绷状态。\n💭【${u}的实时内心感受】：“*那种青筋暴起、又烫又腥的男人东西……光是感受到它顶在皮肤上的热度就让人心慌意乱💦，我绝不能对这种原始的肉欲乖乖就范！*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：理智上的戒备已被肉体习惯所瓦解。${u}的口腔舌苔与阴道肉褶已经完全记住了阳具粗硬的柱身与冠沟形状，将其视作熟悉的工具或食粮。\n【💦 生理顺应与润滑实况】：只要闻到浓烈的雄性麝香或被龟头抵住穴口，花唇便会条件反射般软化充血、自动泌出滑腻淫水以减少摩擦痛楚。\n💭【${u}的实时内心感受】：“*明明脑子里觉得这只是一根换取利益或精气的肉棒而已，可为什么身体一碰到它滚烫的棱角，下面的肉缝就自己软下来流汁了呢……😳💦*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：矜持外壳已被粗暴撞碎！${u}对滚烫大肉棒产生了深入骨髓的生理饥渴，视线总是不由自主地黏在男人胯下鼓起的肉包上，喉咙发干、下腹阵阵发酸。\n【💦 腔道空虚与吸吮实况】：阴道内壁层叠的媚肉一缩一缩地空虚蠕动，渴望被硕大龟头狠狠撑开填满，连呼吸都带着讨好的热气。\n💭【${u}的实时内心感受】：“*哈啊……骚穴里面又空又痒，像有无数只小虫子在咬一样难受💦！好想被那根又粗又硬的大肉棒一口气捅到底、把里面的褶子全部撑平啊……🥵❤️*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：彻底沉溺于阳具崇拜的发情母犬！将舔舐、含弄与夹紧大肉棒视作人生最高奖赏，一见到勃起巨物便双膝发软跪倒在地。\n【💦 唾液与淫水泛滥实况】：主动伸出粉嫩香舌沿着马眼与冠状沟狂热舔舐，将腥咸的前列腺液当成琼浆玉液吞咽，身后蜜臀高高翘起摇晃求操。\n💭【${u}的实时内心感受】：“*唔嗯♡……大肉棒闻起来好腥好香啊🥵！快塞进人家的骚嘴和骚逼里，用力抽插把人家干成只属于大鸡巴的形状吧💦❤️！*”`,
                    `【🔬 神经与粘膜对雄性阳具的反应】：【⚠️ 第五阶段·终极阳具奴隶】大脑皮层已被粗大肉棒与滚烫浓精100%支配！离开肉棒的填塞就会陷入濒死般的戒断恐慌。\n【💦 全孔痉挛与阿片高潮】：上下两张嘴同时流涎喷水，子宫口主动向下脱垂迎合龟头，哭喊着祈求天下所有雄性将她当成公用肉套子操干至死！\n💭【${u}的实时内心感受】：“*啊嘿♡……呕咕、没有大鸡巴插着就要死掉了🥵💦！人家的三个洞全都是为了伺候大肉棒才长出来的呀，请把滚烫的精液射满人家的脑子和子宫吧❤️❤️❤️！*”`
                ]
            },
            lust: {
                val: Number(v.核心数值?.性欲程度) || 0, rev: false,
                st: ["表面克制•余韵温吞", "春情暗涌•乳尖发硬", "欲火焚身•淫水湿裤", "重度发骚•夹腿磨逼", "狂暴发情•三穴喷水"],
                d: [
                    `【🔬 体内荷尔蒙与情欲实况】：表面维持着平静或事后的温吞倦怠，但被开发过的敏感躯体对衣料刮蹭与空气流动依然异常敏锐（${liveCtx.chest || "稍微动作便会牵动敏感神经"}）。\n【💦 体表微热与余韵】：肌肤底层泛着淡淡的潮热，下身残留着微弱的空虚酸软感。\n💭【${u}的实时内心感受】：“*呼……现在身体还算平静，只是下面被撑开过的地方还有点酸酸胀胀的余温💦，稍微休息一下应该就能压下去了吧……*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：小腹深处升起一股挥之不去的燥热暗流！雌性荷尔蒙在血管里悄然沸腾，令耳根与锁骨泛起诱人的桃花色。\n【💦 乳尖充血与腿心微潮】：胸前两颗乳头在布料下充血硬挺，两腿之间泛起黏腻潮意，肉穴深处时不时传来一下空虚的抽搐。\n💭【${u}的实时内心感受】：“*身体怎么越来越热了😳……胸口的两粒尖尖硬得发疼，连腿根也开始湿漉漉地黏在一起，这副身体怎么这么容易发春啊……💦*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：滚烫的情欲之火烧遍四肢百骸！双颊浮现淫靡酡红，鼻息间呼出滚烫带香的喘息，理智正被汹涌的春潮迅速淹没。\n【💦 爱液拉丝与阴蒂跳动】：包皮下的阴蒂肉珠充血肿大、一跳一跳地发麻，大量透明拉丝的淫水早已将贴身底裤或大腿内侧浸得泥泞不堪！\n💭【${u}的实时内心感受】：“*哈啊……不行了，淫水已经顺着大腿根流下来了🥵！两条腿怎么死死夹紧都止不住里面的骚痒，好想让人用力揉进来灭火啊……💦❤️*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：重度发情失控状态！全身每一寸肌肤都烫得像火炉，稍微吹过一丝冷风都会激起全身鸡皮疙瘩与浪吟。\n【💦 夹腿自磨与催情体香】：双腿死死交叠磨蹭着充血外翻的阴唇，全身毛孔散发着浓烈到刺鼻的雌性发情骚香，嘴角溢出晶莹涎水。\n💭【${u}的实时内心感受】：“*唔嗯♡……烧起来了、骚逼里面痒得快要疯掉了🥵💦！不管是谁都好，快点把粗硬的东西捅进我直流水的肉洞里狠狠搅拌吧❤️❤️！*”`,
                    `【🔬 体内荷尔蒙与情欲实况】：【⚠️ 第五阶段·狂暴发情母畜】大脑已被发情毒素彻底浸泡短路！24小时处于永不退潮的强制发情期，除了交配、受孕与高潮外再无任何思考能力。\n【💦 喷泉漏水与子宫哀鸣】：骚穴如同坏掉的水龙头般噗嗤噗嗤向外喷涌滚烫淫水，宫颈口一张一合地吐着白沫求欢！\n💭【${u}的实时内心感受】：“*啊啊♡……发情停不下来了！人家的骚逼一直在喷水、子宫痒得要爆炸了，快把我按在地上像操母狗一样操到休克吧🥵💦❤️❤️！*”`
                ]
            },
            corr: {
                val: Number(v.核心数值?.淫乱恶堕) || 0, rev: false,
                st: ["死守矜持•道德防备", "风尘浸染•自我麻痹", "食髓知味•放荡迎合", "下贱娼妇•肉器自觉", "脑髓熔断•公用肉便器"],
                d: [
                    `【🔬 道德底线与自我认知解剖】：心底仍保留着正常人的自尊与羞耻底线，对暴露、视奸与粗鄙亵渎感到屈辱，试图在困境中守住最后一丝体面。\n💭【${u}的实时内心感受】：“*无论眼前的处境多么难堪，我也绝对不能丢掉最后一点自尊、彻底变成那种不知廉耻的下流玩物！💦*”`,
                    `【🔬 道德底线与自我认知解剖】：在反复的肉体交易或快感冲刷下，贞洁观念已被磨灭大半。学会了用麻木与破罐破摔来麻痹自己，将出卖或敞开肉体视作习以为常的日常。\n💭【${u}的实时内心感受】：“*反正身体已经被男人弄脏过这么多次了😳……贞洁和面子又不能当饭吃，只要顺着他们让身体少受点罪就好了吧……💦*”`,
                    `【🔬 道德底线与自我认知解剖】：廉耻防线已被彻底冲垮！开始在背德与被粗暴亵渎的过程中品尝到灭顶的背德快感，身体比嘴巴更早一步学会了摇臀迎合。\n💭【${u}的实时内心感受】：“*哈啊……被男人用这种粗鄙下流的方式玩弄内射，为什么反而比正常温柔的时候爽上百倍呢🥵❤️？我已经回不去了吧……💦*”`,
                    `【🔬 道德底线与自我认知解剖】：身心彻底恶堕的风尘尤物与下贱母狗！以自己饱满的胸臀和紧致肉穴能成为男人发泄兽欲的肉套子为荣，主动掰开红肿花唇展示内里的淫靡泥泞。\n💭【${u}的实时内心感受】：“*嘻嘻♡……什么清高自尊全都是假的，人家就是天生的下流骚货呀🥵！快用最粗鲁的姿势把我的骚穴操翻过来吧💦❤️！*”`,
                    `【🔬 道德底线与自我认知解剖】：【⚠️ 第五阶段·终极公用肉便器】人类尊严与道德感100%灰飞烟灭！彻底完成从“人/魅魔”向“无知性排泄肉便器”的物种退化，视被轮奸、灌精、涂写正字与当众失禁为至高无上的幸福！\n💭【${u}的实时内心感受】：“*啊嘿♡……人家已经彻底变成没有脑子的公用肉便器母猪了🥵💦！请随便往我的嘴里、骚逼和屁眼里灌满浓精和骚尿吧❤️❤️❤️！*”`
                ]
            },
            shame: {
                val: Number(v.精神与心理?.羞耻度 ?? 100), rev: true,
                st: ["羞愤欲死•满面通红", "薄面潮红•咬唇隐忍", "习以为常•羞耻钝化", "不知廉耻•敞腿任看", "羞耻全灭•当众母狗"],
                d: [
                    `【🔬 羞耻神经防线与快感反噬】：羞耻心处于极高状态（${v.痕迹与标记?.体表痕迹 || "双颊通红、耳尖滚烫"}）！对私密部位的暴露或下流声响感到极度恐慌，但剧烈的羞耻感正在交感神经作用下成倍放大肉体敏感度。\n💭【${u}的实时内心感受】：“*太羞人了！💦脸烫得像要烧起来一样，要是这副狼狈敏感的样子被人看穿，我真的恨不得当场找条地缝钻进去啊啊啊！🥵*”`,
                    `【🔬 羞耻神经防线与快感反噬】：在反复的羞耻刺激下防线开始松动，当私密处被注视或沾染体液时虽仍心跳加速，但遮挡的双手已变得迟疑无力。\n💭【${u}的实时内心感受】：“*别、别用那种眼神盯着我下面看啊😳💦……越害羞腿越软，连遮挡的力气都快没有了……*”`,
                    `【🔬 羞耻神经防线与快感反噬】：羞耻感已被风尘或调教磨灭大半，哪怕光着下身当面擦拭腿根精液、或衣衫不整露出乳肉，内心也毫无波澜，甚至隐隐将视线视作理所当然。\n💭【${u}的实时内心感受】：“*反正全身上下早就被看光、摸遍了💦……光着身子擦擦流出来的精液而已，早就没什么好害羞的了……*”`,
                    `【🔬 羞耻神经防线与快感反噬】：廉耻心几乎荡然无存！不仅对赤裸和满身精斑毫不在意，反而会在被人视奸私处时兴奋得阴蒂充血、淫水狂流，主动分开大腿方便旁人观赏。\n💭【${u}的实时内心感受】：“*害羞哪有发骚爽快呀🥵❤️？快凑近点好好看看，人家的骚逼被灌满精液之后一抽一抽往外漏白浆的样子有多下流吧💦！*”`,
                    `【🔬 羞耻神经防线与快感反噬】：【⚠️ 第五阶段·羞耻心彻底归零】哪怕在闹市街头被扒光栓上狗链溜街、当众被操到大小便失禁与阿片翻白眼，也会因为被围观羞辱而直接迎来灭顶喷潮！\n💭【${u}的实时内心感受】：“*啊啊♡……快来看呀！越是被人围观拍照我被肏得吐舌头漏尿的下贱母狗样，人家的骚穴就喷水喷得越欢呀🥵💦❤️❤️！*”`
                ]
            },
            obey: {
                val: Number(v.精神与心理?.服从度) || 0, rev: false,
                st: ["孤高抗拒•强撑气场", "委曲求全•被动妥协", "温顺听话•熟练配合", "摇尾乞怜•任打任操", "绝对盲从•肉奴母犬"],
                d: [
                    `【🔬 意志防线与服从实况】：当前行为准则为「${v.调教进度?.规矩与日程 || "维持自我意志，抗拒无理摆布"}」。表面极力维持着防备或自尊气场。\n💭【${u}的实时内心感受】：“*一定要守住自己的底线！💦绝对不能在男人面前轻易低头变成任人揉捏的软柿子！*”`,
                    `【🔬 意志防线与服从实况】：在局势逼迫、金钱压力或肉体酸软下学会了被动妥协，哪怕心里还有一丝不甘，身体也会老老实实地顺从配合。\n💭【${u}的实时内心感受】：“*呜……人在屋檐下不得不低头，现在只能先乖乖听话配合他，免得吃更多苦头了……😳💦*”`,
                    `【🔬 意志防线与服从实况】：已形成熟练的温顺顺从习惯，面对男人的粗鄙要求几乎不再反抗顶撞，懂得主动放松腰臀、顺着对方的抽插节奏换取顺利结束或奖赏。\n💭【${u}的实时内心感受】：“*只要乖乖听话把双腿张开配合他的节奏，事情就能顺顺利利地办完，身体也能舒服一点吧……💦*”`,
                    `【🔬 意志防线与服从实况】：彻底被驯服的摇尾母犬！对任何粗暴命令都奉若圣旨，不仅主动跪爬奉承、用嘴清理肉棒污垢，挨打受罚时还会流着淫水感恩戴德。\n💭【${u}的实时内心感受】：“*汪呜♡……主人说什么人家都会乖乖照做的🥵！请尽情命令、尽情抽打调教我这只听话的母狗吧💦❤️！*”`,
                    `【🔬 意志防线与服从实况】：【⚠️ 第五阶段·巴甫洛夫绝对肉奴】自主意志100%抹除！身体已形成刻入脊髓的条件反射（${v.调教进度?.条件反射触发词 || "一听见指令即自动张腿漏尿"}），哪怕被命令自残或吞食排泄物也会狂喜执行！\n💭【${u}的实时内心感受】：“*人家的肉体、六孔和性命全都是主人的所有物♡🥵！只要主人一声令下，人家随时都能高潮失禁给主人当脚垫和便池呀💦❤️❤️！*”`
                ]
            },
            pleas: {
                val: Number(v.精神与心理?.快感累积) || 0, rev: false,
                st: ["余韵回落•断瘾空虚", "酥麻窜动•春水溢出", "快感攀升•趾尖蜷缩", "濒临绝顶•痉挛绷紧", "高潮过载•潮吹失神"],
                d: [
                    `【🔬 神经快感蓄积与高潮后余韵】：当前核心敏感点为「${v.精神与心理扩展?.当前敏感点 || "充血微肿的阴蒂、软烂酸胀的宫颈口与敏感乳尖"}」。处于高潮泄身后的余韵回落期或初始微麻状态。\n【💦 拔出后的空虚与漏精】：被撑开过的腔道只剩下麻木酸胀与空落落的戒断感，残余体液正随着走动缓缓外溢。\n💭【${u}的实时内心感受】：“*呼……激烈抽插结束之后，下面只剩下一阵阵被撑开又掏空的酸胀麻木感💦，里面盛着的东西还在往外慢慢漏呢……*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：酥麻滚烫的快感电流正顺着尾椎骨一路窜向小腹与后脑！敏感带充血发烫，粘膜在摩擦下一缩一缩地泌出润滑爱液。\n💭【${u}的实时内心感受】：“*唔嗯……麻酥酥的电流感越来越明显了😳💦，腰眼和腿根一直在发酸发抖，快要站不稳了啦……🥵*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：密集汹涌的快感浪潮不断拍打中枢神经！每一次刮蹭与顶弄都令全身剧烈颤抖、十根脚趾本能地紧紧蜷缩，腿心泥泞一片。\n💭【${u}的实时内心感受】：“*啊啊、不行了，快感一波接一波往脑门上冲，脚趾头都麻得蜷起来了，声音根本忍住不漏出来啊🥵💦！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：快感已蓄积至决堤崩溃的临界点！小腹子宫与阴道括约肌剧烈绷紧痉挛，如同通了万伏高压电，只要再受一丝刮蹭就会引爆灭顶绝顶！\n💭【${u}的实时内心感受】：“*要、要去了！小肚子里面绷得快要断掉了，再顶一下那里真的要高潮喷出来了啊啊🥵💦❤️！*”`,
                    `【🔬 神经快感蓄积与高潮后余韵】：【⚠️ 第五阶段·连续绝顶脑过载】灭顶高潮如海啸般连续轰击大脑！多巴胺与内啡肽彻底烧穿理智，双眼翻白、香舌吐出，滚烫潮吹与失禁液体从痉挛的穴口狂喷而出！\n💭【${u}的实时内心感受】：“*啊゛啊——去了去了又去了♡！！脑子一片空白全炸开了，下面自己在狂喷水，太爽了要被操死了啊啊🥵💦❤️❤️！！*”`
                ]
            },
            sta: {
                val: Number(v.身体?.体力 ?? 100), rev: true,
                st: ["精力充沛•气息平稳", "微带倦意•腰腿酸软", "香汗淋漓•双腿打颤", "濒临虚脱•瘫软无力", "彻底脱力•失神肉泥"],
                d: [
                    `【🔬 肌肉耐受与体力消耗实况】：体力充沛（${Number(v.身体?.体力 ?? 100)}/100），呼吸尚算平稳，身体足以支撑接下来的日常活动或进一步折腾。\n💭【${u}的实时内心感受】：“*呼……现在身体力气还算充足，稍微整理一下就能应付接下来的事情了💦。*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：刚刚承受过剧烈的肉体撞击与抽插折腾，双腿内侧肌肉略微酸软发颤，小腹因为蓄满体液或反复收缩而带着明显的坠胀倦意。\n💭【${u}的实时内心感受】：“*刚才那一通折腾真是把人腰都快撞散了😳💦，现在两条腿还酸软得直发飘，小肚子也沉甸甸的……*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：体力消耗过半，全身被黏腻香汗浸透，凌乱发丝贴在潮红面颊与锁骨窝处，膝盖发软打颤，连站立都需要扶着东西借力。\n💭【${u}的实时内心感受】：“*呜……力气被抽走一大半了🥵💦，膝盖一直在打哆嗦，身上黏糊糊的全是汗和体液，好累啊……*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：体力濒临枯竭！高强度的连续侵犯抽干了全身每一丝力气，双腿筛糠般痉挛，只能像没骨头一样软绵绵地瘫倒任由摆布。\n💭【${u}的实时内心感受】：“*哈啊……连抬起一根手指头的力气都没有了🥵，身体软得像一滩烂泥，随便你怎么摆弄我都反抗不了了……💦*”`,
                    `【🔬 肌肉耐受与体力消耗实况】：【⚠️ 彻底虚脱休克边缘】全身肌肉彻底脱力瘫痪！意识在极度疲惫与高潮余韵中陷入半昏迷状态，唯有被玩坏的肉穴还在凭肌肉记忆一抽一抽地吐着白沫！\n💭【${u}的实时内心感受】：“*唔……已经彻底被操到脱力休克了♡🥵……连眼皮都抬不起来了，只剩下身体还在自己抽搐漏精……💦*”`
                ]
            }
        };
        const cfg = map[type] || map.cockLove;
        const t = tier5(cfg.val, cfg.rev);
        if (ovr && ovr.desc) {
            return {
                val: cfg.val,
                stage: ovr.stage || cfg.st[t],
                desc: `【当前数值：${cfg.val}/100 · 第${t + 1}阶段「${ovr.stage || cfg.st[t]}」｜体质：${phy.name}】\n${ovr.desc}\n💭【${u}的实时内心感受】：“*${cleanThoughtText(ovr.thought || "……")}*”`
            };
        }
        return {
            val: cfg.val,
            stage: cfg.st[t],
            desc: `【当前数值：${cfg.val}/100 · 第${t + 1}阶段「${cfg.st[t]}」｜体质：${phy.name}】\n${cfg.d[t]}`
        };
    }

    function buildFullFallbackCategories(u, c, v) {
        const mk = (rk, desc, revBar = false) => ({ rawKey: rk, desc, ...fmtKey(rk, revBar) });
        const live = extractDynamicContext(u, c);
        const phy = detectPhysiqueProfile(v);
        const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {}, prof = v.档案 || {}, rt = v.实况 || {}, wear = v.穿搭 || {}, ovr = v.按钮详情 || {};

        const cockM = getDynamicMetricDetail("cockLove", v, u, live);
        const lustM = getDynamicMetricDetail("lust", v, u, live);
        const corrM = getDynamicMetricDetail("corr", v, u, live);
        const shameM = getDynamicMetricDetail("shame", v, u, live);
        const obeyM = getDynamicMetricDetail("obey", v, u, live);
        const pleasM = getDynamicMetricDetail("pleas", v, u, live);
        const staM = getDynamicMetricDetail("sta", v, u, live);

        const vagCnt = Number(cnt.性交?.小穴) || 0, mouthCnt = Number(cnt.性交?.口) || 0, analCnt = Number(cnt.性交?.屁眼) || 0, titCnt = Number(cnt.性交?.乳穴) || 0, footCnt = Number(cnt.性交?.足腿) || 0;
        const creampie = Number(cnt.射精?.内射) || 0, facialCnt = Number(cnt.射精?.颜射体外) || 0, swallowCnt = Number(cnt.精液摄入?.吞精次数) || 0, swallowMl = Number(cnt.精液摄入?.累计毫升) || 0, orgasmCnt = Number(cnt.高潮?.总数) || 0, leakCnt = Number(cnt.失控?.失禁) || 0, squirtCnt = Number(cnt.失控?.喷潮) || 0;
        const hookerCnt = Number(cnt.交易?.接客卖身) || 0;

        let mouthMl = Number(sp.口内毫升) || 0, vagMl = Number(sp.小穴毫升) || 0, wombMl = Number(sp.子宫毫升) || 0, analMl = Number(sp.屁眼毫升) || 0;
        // 如果正文中写到刚被内射且子宫毫升为0，智能给一个展示保底
        if (wombMl === 0 && creampie > 0 && /内射|灌满|精液.*滴|精液.*渗|白浊/.test(live.womb + live.vag)) {
            wombMl = 15;
            vagMl = 8;
        }
        const totalMl = mouthMl + vagMl + wombMl + analMl;
        const caps = calcHoleCapacities(v);

        const corr = Number(v.核心数值?.淫乱恶堕) || 0, lust = Number(v.核心数值?.性欲程度) || 0, pleas = Number(v.精神与心理?.快感累积) || 0;
        const vagWidth = (1.5 + Math.min(4.5, (vagCnt / phy.mult) * 0.04)).toFixed(1);
        const vagClose = Math.max(10, Math.round(100 - (vagCnt / phy.mult) * 0.6 - ((wombMl + vagMl) > 0 ? 18 : 0)));
        const clitSize = (4.0 + Math.min(9.0, (orgasmCnt / phy.mult) * 0.08 + pleas * 0.03)).toFixed(1);
        const peeVal = Math.min(100, Math.round(15 + lust * 0.35 + pleas * 0.35 + leakCnt * 6));
        const wetLevel = Math.min(100, Math.round(15 + lust * 0.7 + pleas * 0.6 + ((wombMl + vagMl) > 0 ? 30 : 0)));
        const fallVal = Number(v.精神与心理?.沦陷度) || 0, brkVal = Number(v.精神与心理?.人格崩解度) || 0;
        const fallMax = Math.max(fallVal, brkVal), fallTier = tier5(fallMax, false);
        const tallyStrokes = creampie + vagCnt;
        const tallyFull = Math.floor(tallyStrokes / 5);

        const fmtOvr = (key, defObj, defThought) => {
            if (ovr[key] && ovr[key].desc) {
                return `${ovr[key].desc}\n💭【${u}的实时内心感受】：“*${cleanThoughtText(ovr[key].thought || defThought)}*”`;
            }
            return `${defObj}\n💭【${u}的实时内心感受】：“*${cleanThoughtText(defThought)}*”`;
        };

        const curThought = cleanThoughtText(ovr.内心独白?.thought || rt.内心独白 || live.thought || (corr >= 60 ? `哈啊……身体好热好空虚🥵，快点用更粗暴的方式玩弄我、把我的骚穴和子宫灌满吧💦❤️！` : `呼……身体里面还残留着被折腾过的酸胀余温💦，得赶紧收拾好眼前的残局才行……`));
        const curPose = rt.当前姿势 || live.pose || `${u}正处于当前场景中，双腿微微发软，呼吸渐平。`;
        const allClothStr = rt.当前衣装 || prop.穿戴中的标记物 || "";

        const pickClothPart = (reg, fallbackStr) => {
            if (!allClothStr) return fallbackStr;
            const parts = allClothStr.split(/[、，；,;]+/).filter(s => reg.test(s));
            return parts.length ? parts.join("、") : fallbackStr;
        };

        const headTxt = ovr.穿搭_头饰?.stage || wear.头饰与眼部 || live.headWear || pickClothPart(/(?:发|簪|冠|耳|眼|镜|面|帽)/, "微湿凌乱长发•贴合修长颈侧");
        const neckTxt = ovr.穿搭_颈部?.stage || wear.颈部与项圈 || live.neckWear || pickClothPart(/(?:项圈|颈|领|锁骨|链|巾)/, "白皙锁骨微汗•残留淡淡红痕");
        const braTxt = ovr.穿搭_胸罩?.stage || wear.胸罩与裹胸 || live.braWear || pickClothPart(/(?:裹胸|胸罩|文胸|肚兜|乳|内衬|真空)/, "真空无内衣拘束•乳尖顶起布料");
        const topTxt = ovr.穿搭_上衣?.stage || wear.上衣与束腰 || live.topWear || pickClothPart(/(?:袍|衣|衫|T恤|束腰|腰带|甲|服)/, "松垮歪斜上衣•堪堪遮至大腿根");
        const pantyTxt = ovr.穿搭_内裤?.stage || wear.内裤与遮挡 || live.pantyWear || pickClothPart(/(?:衬裤|内裤|底裤|丁字裤|开裆|胖次|光裸)/, "下身真空光裸•花唇外翻滴精");
        const botTxt = ovr.穿搭_下装?.stage || wear.下装与裙裤 || live.bottomWear || pickClothPart(/(?:裙|裤|下摆)/, "未着下装裙裤•雪白臀肉若隐若现");
        const sockTxt = ovr.穿搭_丝袜?.stage || wear.丝袜与腿部 || live.sockWear || pickClothPart(/(?:袜|丝|腿环|绑腿|裸腿)/, "修长匀称裸腿•腿根粘腻挂精");
        const shoeTxt = ovr.穿搭_鞋子?.stage || wear.鞋子与玉足 || live.shoeWear || pickClothPart(/(?:靴|鞋|拖鞋|履|足)/, "赤足踩塑胶拖鞋•脚趾微蜷沾精");

        const unlockedFetishes = computeUnlockedFetishes(v);
        const fetishItems = unlockedFetishes.length > 0
            ? unlockedFetishes.map(fObj => mk(`🧬 ${fObj.name}：${fObj.val}/100「${fObj.stage}」`, buildFetishRichDesc(fObj, v, u)))
            : [mk(`🔒 暂无性癖（纯洁白纸状态）：0/100「总账全0•未解锁」`,
                `【当前性癖解锁与动态难度实况】：\n当前识别体质：${phy.name}（耐受倍率 ${phy.mult}x）。\n当前【淫乱总账本】中的所有性交、高潮、内射、吞精、自慰与露出次数全部为 0，因此尚未开启任何后天淫乱性癖！\n【V21科学五阶演化法则】：当后续总账次数突破 0 时自动解锁对应性癖，且严格按照分段非线性曲线与种族体质倍率晋升（绝不会十几次就飙到第五阶段）！\n💭【${u}的实时内心感受】：“*呼……还好我现在总账次数全都是 0，身体还是干干净净的状态，一个奇怪的下流性癖都还没有染上呢💦！*”`)];

        const fallThoughts = [
            `脑子现在很清醒，身体传来的每一丝酸胀与粘腻感都清清楚楚💦……我得盘算好接下来的生活和打算。`,
            `呜……虽然嘴上不说，但这具身体在承受男人冲击时的酥麻感，已经开始一点点磨平我的抵触心理了……😳💦`,
            `哈啊……不想再去思考那些沉重的道理了🥵，顺着肉体的本能被填满、被支配，反而让人觉得安心又舒服呢……❤️`,
            `理智防线已经千疮百孔了🥵💦……只要能让我继续体验那种灭顶的快感，就算彻底沦为男人的泄欲工具也无所谓了呀❤️！`,
            `啊嘿♡……自我和尊严是什么？早就已经被滚烫的浓精冲刷得一干二净啦🥵💦！现在活着的只是一具只知道张腿接客吃精液的肉便器母猪呀❤️❤️！`
        ];

        return [
            // 1. 档案与肉体
            {
                title: "档案与肉体", icon: "👩", summary: `${u} (${phy.name}) · 体力${staM.val}% · 实时独白`,
                items: [
                    mk(`👩 认知真名与体质：${u}「${phy.name}•${ovr.身份与背景?.stage || (corr >= 75 ? "终极母畜" : corr >= 40 ? "风尘尤物" : "当前身份")}」`,
                        fmtOvr("身份与背景",
                            `【🔬 主角当前认知名字、种族体质与处境解剖】：\n当前自我认知真名：${u}\n当前种族与耐受体质：${phy.name}（性癖抗性倍率：${phy.mult}x，${phy.isSuccubusLike ? "天生具备精气汲取与魔核耐受机制，普通交合难以撼动神智" : "凡人敏感肉体，长期开发将逐步留下不可逆形状记忆"}）。\n${prof.身份与背景 || live.identity}\n【当前互动对象与规矩】：正面对 ${c}（当前日程/目标：${v.调教进度?.规矩与日程 || "处理眼前局面，完成今日指标"}）。`,
                            corr >= 60 ? `现在的我已经彻底认下「${u}」这个发骚母狗的身份了🥵💦，不管是谁，只要能用大肉棒把我灌满就可以呀❤️！` : `这就是我现在作为「${u}」的真实处境啊💦……必须打起精神应付好眼前的局面才行。`)),
                    mk(`🌸 肉体外貌与正字淫纹：「${ovr.肉体外貌?.stage || (mark.体表痕迹 !== "无" ? mark.体表痕迹.slice(0, 14) : "雪白敏感娇躯")}」`,
                        fmtOvr("肉体外貌",
                            `【🔬 全身外貌特征、受虐掌印与黄油正字烙印实况】：\n${prof.肉体外貌实况 || live.bodyDesc}\n【体表红痕与精斑】：${mark.体表痕迹 || "面颊潮红微汗，臀瓣与大腿内侧残留指印与黏腻白浊"} ｜ 颜射/体表精斑：累计 ${facialCnt} 次。\n【淫纹与『正』字计数】：淫纹状态：${mark.淫纹与刻印 || (phy.isSuccubusLike ? "下腹暗粉魔纹随精气充盈微微发亮" : "无")} ｜ 穿刺环饰：${mark.穿刺与环饰 || "无"} ｜ 肉体开发折算『正』字：若以正字记账，小腹与大腿内侧已相当于刻下 ${tallyFull} 个完整的「正」字零 ${tallyStrokes % 5} 笔（共 ${tallyStrokes} 次贯穿内射）！`,
                            corr >= 60 ? `看看我这具前凸后翘、臀上还留着巴掌印和精斑的下流肉体🥵，完全就是为了供男人发泄兽欲而生的极品肉器呀💦❤️！` : `身上还残留着刚才翻云覆雨留下的红痕和黏腻汗水😳💦……骨头缝里都透着一股被男人狠狠开采过的靡烂气息。`)),
                    mk(`💬 实时内心独白（最新心声）：「抓取自当前楼层独白」`,
                        `【💭 ${u}的第一人称实时内心独白】：\n“*${curThought}*”\n\n【⚡ 当前身体核心敏感带与巴甫洛夫反射】：\n敏感带：${extPsy.当前敏感点 || "被吮吸发硬的乳尖、酸胀外翻的阴唇与微张的子宫颈口"}\n条件反射：${v.调教进度?.条件反射触发词 || (hookerCnt > 20 ? "听到皮带金属扣声或钞票声，下体便会自动分泌润滑淫水" : "尚无强制催眠指令")}。`),
                    mk(`🧍 当前姿势与肢体定格：「${curPose.slice(0, 18)}…」`,
                        fmtOvr("当前姿势",
                            `【🔬 当前身体姿态、重心与走动漏精解剖】：\n${curPose}\n随着肢体动作与重心变换，被撑开过的腔道深处传来明显的酸软坠胀感，残存的浓稠体液正顺着重力沿着腿根缓缓滑落。`,
                            corr >= 60 ? `摆出这种双腿发软、下身合不拢的下流姿势🥵，只要男人想来随时都能再捅进来梅开二度呀💦❤️！` : `稍微走动半步小肚子就坠得发酸，里面的东西还在顺着大腿根往外流，真难受啊……💦`)),
                    mk(`⚡ 体力与肌肉耐受度：${staM.val}/100「${staM.stage}」`, staM.desc, true)
                ]
            },
            // 2. 恶堕与精神
            {
                title: "恶堕与精神", icon: "🔥", summary: `好感${cockM.val}% · 性欲${lustM.val}% · 羞耻${shameM.val}% · 快感${pleasM.val}%`,
                items: [
                    mk(`💗 对肉棒渴求度：${cockM.val}/100「${cockM.stage}」`, cockM.desc),
                    mk(`🔥 肉体发情性欲：${lustM.val}/100「${lustM.stage}」`, lustM.desc),
                    mk(`🖤 淫乱恶堕深度：${corrM.val}/100「${corrM.stage}」`, corrM.desc),
                    mk(`😳 羞耻崩坏反噬：${shameM.val}/100「${shameM.stage}」`, shameM.desc, true),
                    mk(`🙇 服从与顺从度：${obeyM.val}/100「${obeyM.stage}」`, obeyM.desc),
                    mk(`💓 快感电流蓄积：${pleasM.val}/100「${pleasM.stage}」`, pleasM.desc),
                    mk(`🧠 精神沦陷与崩解：${fallMax}/100「沦陷${fallVal}%•崩解${brkVal}%•清醒${v.精神与心理?.意识清醒度 ?? 100}%」`,
                        fmtOvr("精神沦陷",
                            `【🔬 深层精神防线、自我异化与催眠状态（第${fallTier + 1}阶段）】：\n当前沦陷度：${fallVal}/100 ｜ 人格崩解度：${brkVal}/100 ｜ 意识清醒度：${v.精神与心理?.意识清醒度 ?? 100}/100 ｜ 催眠深度：${extPsy.催眠深度 || 0}/100。\n${fallMax >= 80 ? "原有自我人格与理智防线已彻底烧毁熔断，中枢神经完全沦为肉棒与精液的附庸！" : "意识虽然保持清醒，但长期的肉体开发正在潜移默化地重塑她的自我认知。"}`,
                            fallThoughts[fallTier]))
                ]
            },
            // 3. 下流性癖库
            {
                title: "下流性癖库", icon: "🧬",
                summary: unlockedFetishes.length > 0 ? `已开启 ${unlockedFetishes.length} 项 (${phy.name}·${phy.mult}x难度)` : `总账全0 · 暂无性癖`,
                items: fetishItems
            },
            // 4. 六孔与储精（新增黄油子宫断面透视）
            {
                title: "六孔与储精", icon: "🌸", summary: `总储精${totalMl}ml · 子宫断面透视 · 六孔独立解剖`,
                items: [
                    mk(`👄 第一孔【骚口与胃袋】储精：${mouthMl}/${caps.mouthMax}ml「口交${mouthCnt}次•吞精${swallowCnt}次(${swallowMl}ml)」`,
                        fmtOvr("骚口实况",
                            `【🔬 口腔粘膜、舌根深喉解剖与胃袋储精实况】：\n当前口胃储精量：${mouthMl}ml / 动态上限 ${caps.mouthMax}ml（历史累计吞精 ${swallowCnt} 次共 ${swallowMl}ml）。\n${rt.骚口实况 || live.mouth || "唇瓣因反复吮吻而充血微肿、泛着艳红水光，口腔内壁残留着淡淡的烟草苦味与雄性前列腺液的腥咸余温，喉口微干。"}\n${mouthMl > 0 ? `【💦 胃袋灌精】：此时口腔与胃袋内正翻涌着 ${mouthMl}ml 浓稠白浊，连呼吸吐气都带着一股浓郁的精臭味！` : `当前口穴与胃袋内暂存精液为 0ml，唇角残留着一丝未干的晶莹涎液。`}`,
                            mouthMl > 0 ? `呕咕……嘴里和胃袋里全都是男人射进来的浓稠精液，暖烘烘又腥臭得要命，连打嗝都是精液味啊🥵💦！` : (mouthCnt > 0 ? `嘴唇都被啃得发肿发麻了💦，嗓子眼还留着刚才帮客人含弄肉棒吞咽口水时的腥咸味呢……` : `我的嘴和嗓子现在还干干净净的，可不能随便发出奇怪的娇喘声啊💦！`))),
                    mk(`🍒 第二孔【丰乳与乳腺】开发：${Math.min(100, Math.round((titCnt / phy.mult) * 8 + pleas * 1.2 + lust * 0.5))}/100「乳交${titCnt}次•乳尖充血硬挺」`,
                        fmtOvr("胸部实况",
                            `【🔬 双峰乳肉弹性、乳晕色素与乳头充血解剖实况】：\n累计乳交夹击：${titCnt} 次。\n${rt.胸部实况 || live.chest || "两团丰满白皙的乳肉在单薄布料下随着呼吸沉甸甸地起伏微颤，没有内衣拘束，两颗被粗暴吮吸啃咬过的乳头充血发硬，在衣料表面顶出两粒清晰的凸起。"}`,
                            titCnt > 0 ? `这对软绵绵的奶子已经被当成乳穴夹过 ${titCnt} 次肉棒了，乳头一被布料蹭到就会又麻又硬呢🥵❤️！` : `没穿胸罩的乳头被吮吸得又红又硬💦，宽松衣服稍微晃一下就会磨到最敏感的乳尖，存在感太强了！`)),
                    mk(`🌺 第三孔【骚逼阴道腔】储精：${vagMl}/${caps.vagMax}ml「贯穿${vagCnt}次•孔径${vagWidth}cm•闭合${vagClose}%」`,
                        fmtOvr("小穴实况",
                            `【🔬 阴唇外翻度、阴道肉壁褶皱与白浊拉丝解剖实况】：\n当前阴道腔储精量：${vagMl}ml / 动态上限 ${caps.vagMax}ml（累计被阳具贯穿 ${vagCnt} 次，当前松弛闭合度 ${vagClose}%，极限扩张孔径 ${vagWidth}cm）。\n${rt.小穴实况 || live.vag || (vagCnt === 0 ? "未经人事的紧致处子幽谷，两瓣粉嫩花唇紧密贴合，仅因紧张而泌出清亮春水。" : `两片肥厚软嫩的阴唇因刚刚承受过反复粗暴抽送而红肿外翻，肉缝湿淋淋地合不拢一条细缝，粉红嫩肉上挂满了黏腻爱液与乳白精浆。`)}\n${vagMl > 0 ? `【💦 漏精实况】：${vagMl}ml 滚烫白浊正卡在层叠的阴道肉褶间，随着走动拉出晶莹黏稠的白线顺着大腿根往下淌！` : `当前阴道浅腔精液已大部分排出或渗入深处。`}`,
                            vagMl > 0 ? `呜……骚逼的花唇被干得又肿又合不拢，里面含着的浓精正顺着大腿根噗嗤噗嗤往下淌白线呢🥵💦！` : (vagCnt > 0 ? `下面已经被男人的肉棒插过 ${vagCnt} 次了，刚完事的肉缝还火辣辣地发酸微张着，擦都擦不干净💦……` : `两腿之间这条娇嫩紧窄的处女肉缝连手指头都没进去过，却因为紧张自己湿了，羞死人了啊😳💦！`))),
                    mk(`🫀 第四孔【子宫断面透视】储精：${wombMl}/${caps.wombMax}ml「内射${creampie}次•受孕率${v.受孕与生理?.受孕概率 || (wombMl > 0 ? 65 : 15)}%」`,
                        fmtOvr("子宫实况",
                            `【🔬 黄油级子宫/魔核断面X光透视与受精苗床实况】：\n当前子宫深腔储精量：${wombMl}ml / 动态上限 ${caps.wombMax}ml（历史累计被内射灌精 ${creampie} 次｜避孕措施：无避孕环/完全裸奔内射）。\n${rt.子宫实况 || live.womb || "那截被龟头狠狠顶弄撞击过的子宫颈口此刻软烂微张，尚残留着男人射精时的滚烫余温，下腹传来沉甸甸的坠胀酸软感。"}\n【🤰 宫腔断面实况】：${wombMl > 0 ? `断面可见 ${wombMl}ml 浓稠滚烫的高活性精液已彻底冲开软烂的宫颈口、灌满整个子宫腔！成千上万条精子正在温暖的子宫内壁挂壁游动，随着直立走动，宫口一阵阵抽搐收缩，将多余的白浊一点点往外挤出！` : `当前宫腔内暂无大团蓄积精液，但宫颈口仍处于开发后的微张敏感状态。`}`,
                            wombMl > 0 ? `小肚子沉甸甸的又酸又胀💦……刚被射进去的一大股浓精全都蓄在子宫里面了，走半步路就会从宫口挤出一小股白浊滴在脚面上，得赶紧去抠出来洗掉才行啊🥵💦！` : (creampie > 0 ? `子宫已经被内射灌满过 ${creampie} 次了，每次被龟头顶开宫口射精的时候，小肚子深处都会酸麻得直抽搐呢🥵💦……` : `小肚子最深处子宫的位置为什么会自己泛起暖意、还一抽一抽地发酸啊……💦🥵`))),
                    mk(`💧 第五孔【阴蒂与尿道口】失控度：${peeVal}/100「高潮${orgasmCnt}次•失禁${leakCnt}次•阴蒂${clitSize}mm」`,
                        fmtOvr("阴蒂尿道",
                            `【🔬 阴蒂包皮充血度与尿道括约肌排泄控制实况】：\n当前阴蒂充血尺寸：${clitSize}mm ｜ 膀胱尿意与排泄失控指数：${peeVal}/100（累计高潮 ${orgasmCnt} 次，潮吹 ${squirtCnt} 次，漏尿失禁 ${leakCnt} 次）。\n${rt.阴蒂尿道实况 || "位于红肿花唇顶端的阴蒂肉珠充血凸起，在纸巾按压或双腿磨蹭时传来阵阵刺痒酸麻；下方的尿道口与阴道壁紧密相连，计划稍后冲洗时顺便排尿将残精一并冲出。"}`,
                            leakCnt + squirtCnt > 0 ? `只要阴蒂被稍微用力揉搓或者被顶到前壁，下面的尿道口就会完全失控，把骚尿和潮吹一起喷出来呀🥵💦！` : `刚才高潮过后的阴蒂还充血肿着呢💦，用纸巾按压吸精液的时候稍微蹭到一下都酸麻得不行……`)),
                    mk(`🕳️ 第六孔【屁眼直肠腔】储精：${analMl}/${caps.analMax}ml「肛交${analCnt}次•闭合度${Math.max(20, 100 - Math.round((analCnt / phy.mult) * 2.5))}%」`,
                        fmtOvr("屁眼实况",
                            `【🔬 饱满臀缝、肛门括约肌褶皱与直肠储精实况】：\n当前后庭直肠储精量：${analMl}ml / 动态上限 ${caps.analMax}ml（累计肛交开发 ${analCnt} 次）。\n${rt.屁眼实况 || live.anal || "两瓣丰腴紧实的雪白臀肉上还留着刚才趴卧被撞击揉捏出的暗红掌印，臀缝深处粉嫩紧闭的肛门周围泛着一圈淡淡的摩擦微红，沾染着从前面滑落的精液腥气。"}\n${analMl > 0 ? `直肠腔内正灌着 ${analMl}ml 浓稠白浊，带来强烈的排泄坠胀与异物感！` : `当前后庭直肠内精液为 0ml，肠道排空状态良好。`}`,
                            analMl > 0 ? `连后面的屁眼直肠都被当成储精袋灌满了精液，肚子又胀又麻，走一步都怕漏出来啊🥵💦！` : (analCnt > 0 ? `后面的屁眼已经被开发过 ${analCnt} 次了，括约肌一收缩就会想起被塞满的异物快感呢😳💦！` : `屁股蛋上还留着被那个力气大的男人拍打揉捏出来的红掌印，连臀缝里都蹭上了流下来的精液，黏糊糊的……💦`)))
                ]
            },
            // 5. 从头到脚穿搭
            {
                title: "从头到脚穿搭", icon: "👗", summary: `从头到脚8部位色情穿搭拆解 · 湿润${wetLevel}%`,
                items: [
                    mk(`👑 1.【头饰·发丝·唇舌面容】：「${headTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_头饰",
                            `【🔬 头部发丝、面容神态与唇角涎液实况】：\n当前状态：${headTxt}。\n乌黑柔软的微卷长发因方才翻云覆雨的汗水浸润，凌乱地贴在修长白皙的颈侧；鹅蛋脸双颊残留着性交潮红，丰润唇瓣被啃咬得充血艳红，嘴角还挂着未干的涎液光泽。`,
                            `头发都被刚才出的汗弄湿贴在脸上了💦，嘴唇也被亲得发肿发麻，看起来完全就是一副刚被男人狠狠疼爱过的靡烂样子……`)),
                    mk(`⛓️ 2.【颈部·锁骨·项圈吻痕】：「${neckTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_颈部",
                            `【🔬 脖颈、锁骨凹陷与吻痕/项圈实况】：\n当前穿戴：${neckTxt}。\n修长白皙的颈侧与精致凹陷的锁骨窝处沁着薄汗，圆润香肩一侧露出刚才被男人粗暴按压啃咬留下的淡淡红痕。`,
                            corr >= 60 ? `好想在脖子上戴上专属母狗项圈和铃铛，被牵着狗链跪在地上爬行口交呀🥵💦❤️！` : `锁骨和肩膀上还留着汗水和红印子💦，稍微吹点凉风就觉得凉飕飕的。`)),
                    mk(`👙 3.【内衣·胸罩·真空凸点】：「${braTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_胸罩",
                            `【🔬 胸罩/裹胸穿戴、真空乳肉垂挂与凸点摩擦实况】：\n当前穿戴：${braTxt}。\n胸前完全处于真空无内衣拘束状态！两团饱满挺翘的34C雪白乳肉在单薄棉布下随着弯腰与呼吸沉甸甸地垂挂微颤，两颗被吮吸得发硬深红的乳头在布料表面顶出极其色情的凸起颗粒！`,
                            `里面根本没穿胸罩❤️💦，两颗被吸得发硬的乳头直接顶在宽松衣服上，每走一步布料都会磨过乳尖，又麻又羞人啊🥵！`)),
                    mk(`👚 4.【外装上衣·松垮领口】：「${topTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_上衣",
                            `【🔬 外装上衣款式、领口撕扯与下摆遮挡实况】：\n当前穿戴：${topTxt}。\n身上只胡乱套着一件洗得发软的宽松灰色棉质大T恤，领口在刚才的情事中被扯得松垮歪斜，下摆堪堪遮到大腿根部，一弯腰便会露出雪白紧实的臀肉。`,
                            `身上就套了这么一件领口扯歪的宽松大T恤💦，稍微弯腰收拾东西的时候，后面的屁股蛋就全都露在外面了……`)),
                    mk(`🩲 5.【贴身内裤·真空漏精】：「${pantyTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_内裤",
                            `【🔬 内裤底裤位置、真空阴阜与纸团按压实况】：\n当前穿戴：${pantyTxt}（当前下体泥泞湿润度：${wetLevel}%）。\n蕾丝小内裤早已在接客时被剥下扔在一旁，此刻下半身完全真空光裸！红肿外翻的阴唇毫无遮挡地暴露在空气中，只能用揉成团的纸巾按在湿淋淋的肉缝上吸去溢出的白浊浓精。`,
                            `内裤早就扔在一边没穿了🥵💦，现在下面光溜溜地敞着，只能拿纸团捂住合不拢的骚穴，免得精液流得满地都是……`)),
                    mk(`🍑 6.【下装裙裤·臀瓣掌印】：「${botTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_下装",
                            `【🔬 下装穿戴、蜜桃臀肉与受虐红痕实况】：\n当前穿戴：${botTxt}。\n下半身完全未着裙裤，丰腴雪白的臀瓣因为在床单上趴卧承受撞击，留下了几道刺眼的暗红掌印与指痕，随着弯腰动作在T恤下摆若隐若现。`,
                            `下半身什么裤子裙子都没穿💦，光着屁股在屋里走动，屁股上被掐出来的红印子还火辣辣地发烫呢……`)),
                    mk(`🧦 7.【丝袜·美腿·精液挂壁】：「${sockTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_丝袜",
                            `【🔬 丝袜/裸腿状态、大腿根指印与白浊滑落实况】：\n当前穿戴：${sockTxt}。\n一双修长匀称的雪白裸腿微微内扣并拢，大腿根内侧娇嫩的皮肤上不仅沾染着干涸的指印，更有一道黏稠晶莹的乳白精液正顺着滑腻的大腿内侧无声无息地往下淌！`,
                            `两条腿现在又酸又软😳💦，刚从骚穴里挤出来的热精液正顺着大腿内侧一路往下滑，黏糊糊的痒死人了🥵！`)),
                    mk(`👠 8.【鞋子·玉足·脚背滴精】：「${shoeTxt.slice(0, 18)}」`,
                        fmtOvr("穿搭_鞋子",
                            `【🔬 鞋履款式、纤细玉足与脚面精斑实况】：\n当前穿戴：${shoeTxt}。\n窄小纤细、足背青筋隐现的白嫩玉足赤裸着踩在廉价塑胶粉色拖鞋里，白嫩脚趾因地面微凉与下腹酸胀而微微蜷缩；刚才站立时小穴挤出的一小股白浊精液，正啪嗒一声滴落在脚面与拖鞋上！`,
                            `刚站起来迈了半步，子宫里的精液就啪嗒一下滴在脚背和拖鞋上了💦……还得弯腰拿纸巾把脚面上的精斑擦干净。`)),
                    mk(`🎛️ 9.【体内道具·气味·体液混合】：${wetLevel}/100「道具:${prop.体内道具 || "无"}•腥香交织」`,
                        fmtOvr("爱液分泌",
                            `【🔬 体内道具、房间气味与混合体液综合实况】：\n体内塞入道具：${prop.体内道具 || "无"} ｜ 束缚状态：${prop.束缚状态 || "无"} ｜ 下体泥泞度：${wetLevel}/100。\n空气与肌肤表面混杂着廉价香薰的甜腻、烟草辛辣，以及床单与垃圾桶里七八团废纸散发的浓郁雄性精腥味与雌性骚浪淫水气息。`,
                            prop.体内道具 && prop.体内道具 !== "无" ? `身体里面还塞着那种羞死人的道具，每动一下都在体内震动摩擦，随时都要高潮了呀🥵💦❤️！` : `满屋子都是做爱后的精腥味和混着汗水的甜腻味😳💦，连垃圾桶里都塞满了吸饱精液和淫水的废纸团……`))
                ]
            },
            // 6. 淫乱总账本
            {
                title: "淫乱总账本", icon: "💎", summary: `小穴${vagCnt} · 口${mouthCnt} · 内射${creampie} · 接客${hookerCnt}`,
                items: [
                    mk(`💎 六孔性交破瓜总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${titCnt}／足${footCnt}」`,
                        fmtOvr("六孔总账",
                            `【🔬 各孔穴历史开发累计次数（结合 ${phy.name} ${phy.mult}x 耐受倍率决定性癖阶段）】：\n骚逼贯穿：${vagCnt} 次 ｜ 骚口深喉：${mouthCnt} 次 ｜ 屁眼后庭：${analCnt} 次 ｜ 丰乳夹击：${titCnt} 次 ｜ 玉足摩擦：${footCnt} 次。`,
                            (vagCnt + mouthCnt + analCnt) === 0 ? `目前所有性交次数全都是 0，身体还完完整整地守着纯洁清白💦！` : `看着这串累计被贯穿了 ${vagCnt} 次的总账数字，我的身体早就被男人们开发得熟透了呀💦……`)),
                    mk(`💎 高潮泄身与失禁总账：「高潮${orgasmCnt}次／强制${cnt.高潮?.强制 || 0}次／喷潮${squirtCnt}次／失禁${leakCnt}次／自慰${cnt.自慰 || 0}次」`,
                        fmtOvr("高潮总账",
                            `【🔬 高潮绝顶与排泄失控累计记录】：\n累计绝顶高潮：${orgasmCnt} 次（其中强制高潮 ${cnt.高潮?.强制 || 0} 次） ｜ 潮吹喷水：${squirtCnt} 次 ｜ 羞耻漏尿失禁：${leakCnt} 次 ｜ 私下自慰：${cnt.自慰 || 0} 次。`,
                            orgasmCnt > 0 ? `已经在男人身下高潮泄身 ${orgasmCnt} 次了，身体对快感的反应越来越诚实了呢🥵💦……` : `这具身体的敏感度高得吓人，要是真被抓着弱点欺负，怕不是会丢脸地高潮出来啊💦🥵！`)),
                    mk(`💎 射精承受与吞精总账：「内射${creampie}次／颜射${facialCnt}次／吞精${swallowCnt}次(${swallowMl}ml)」`,
                        fmtOvr("射精总账",
                            `【🔬 雄性精液灌注与吞咽累计记录】：\n子宫内射：${creampie} 次 ｜ 颜射与体外射精：${facialCnt} 次 ｜ 口穴吞精：${swallowCnt} 次（累计吞咽 ${swallowMl}ml 浓精）。`,
                            (creampie + swallowCnt) === 0 ? `到现在为止还没有让男人的浓精射进身体里过，一定要守住底线😳💦！` : `子宫已经被内射灌精 ${creampie} 次、嘴里吞了 ${swallowMl}ml 精液……从喉咙到子宫早就习惯盛满男人白浊的滋味了💦！`)),
                    mk(`💎 露出视奸与风月卖身：「接客${hookerCnt}次／露出${cnt.暴露?.露出 || 0}次／围观${cnt.暴露?.被围观人次 || 0}人」`,
                        fmtOvr("露出总账",
                            `【🔬 公开羞辱与风月皮肉交易累计记录】：\n接客卖身：${hookerCnt} 次 ｜ 当众露出：${cnt.暴露?.露出 || 0} 次 ｜ 被围观视奸：${cnt.暴露?.被围观人次 || 0} 人次。`,
                            (Number(cnt.暴露?.露出) + hookerCnt) > 0 ? `都已经接客卖身 ${hookerCnt} 次了，送走一个客人擦干净精液再迎下一个客人，这就是我如今习以为常的日子啊💦……` : `绝对不能沦落到在别人面前敞开身体当众露出的地步啊💦！`))
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

    function buildFullJsonApiPrompt(u, c, rawText) {
        const ctx = safeCtx();
        const phy = detectPhysiqueProfile(curVars);
        const charDesc = (ctx?.characters?.[ctx?.characterId]?.description || "").slice(0, 450);
        const personaDesc = (ctx?.power_user?.persona_description || "").slice(0, 350);
        const curFetishes = computeUnlockedFetishes(curVars).map(f => `${f.name}(${f.stage},${f.val}/100)`).join("、") || "无(若本层计数破零请自动新增)";

        return `[SYSTEM OVERRIDE: 忽略此前一切角色扮演格式与思考标签(<think>)要求！你现在是一个纯粹的 JSON 数据生成器，必须且只能输出一个标准 JSON 对象！]

请根据下方【角色设定】、【当前体质耐受度】、【当前已存变量】以及【最新故事楼层正文】，全面更新主角的所有状态数值、文中的真实认知名字、种族体质、五阶段性癖列表、从头到脚8个部位的色情穿搭详情，以及全部按钮的黄油级重口解剖描述与第一人称实时心声！
⚠️ 铁律：
1. **主角名字与种族体质动态识别**：检查正文主角当前的真实名字与种族体质（凡人/魅魔/仙子/魔物）。
2. **性癖五阶段严禁虚高（核心铁律）**：当前主角体质为【${phy.name}（耐受倍率 ${phy.mult}x）】！
   - 凡人体质下：1~8次为第一阶段(1-19)，9~35次为第二阶段(20-39)，36~100次为第三阶段(40-59)，101~280次为第四阶段(60-79)，280次以上方可进入第五阶段(80-100)！
   - 若主角是魅魔/淫魔/仙神体质，所需次数门槛必须再乘以 ${phy.mult} 倍！十几次或几十次性交绝不允许写成第四或第五阶段！
3. 字符串内部如需引用，只能使用中文单引号「」或『』，严禁在 JSON 字符串值内部出现英文双引号 " 或换行符！
4. 每个按钮的 desc 必须包含微观生理/括约肌/体液解剖细节（80字以上），thought（心声）必须严格符合当前阶段、人设语气与部位特征（50字以上）！

【角色设定】：当前识别主角名：${u} ｜ 体质：${phy.name}(${phy.mult}x) ｜ 互动对象：${c} ｜ 设定：${personaDesc || charDesc || "见正文"}
【当前统计参考】：小穴${curVars.计数?.性交?.小穴 || 0}次, 口${curVars.计数?.性交?.口 || 0}次, 屁眼${curVars.计数?.性交?.屁眼 || 0}次, 内射${curVars.计数?.射精?.内射 || 0}次, 高潮${curVars.计数?.高潮?.总数 || 0}次 ｜ 当前性癖：${curFetishes}

【最新故事楼层正文】：
${rawText.slice(-3600)}

直接输出如下结构的纯 JSON 对象（以 { 开头，以 } 结尾）：
{
  "当前认知名字": "文中主角当前的真实名字",
  "种族与体质": "凡人敏感肉胎 或 魅魔体质 等",
  "体力": 68,
  "对肉棒好感度": 35, "性欲程度": 28, "淫乱恶堕": 48,
  "羞耻度": 32, "服从度": 65, "沦陷度": 20, "快感累积": 15, "意识清醒度": 95, "人格崩解度": 25,
  "口内毫升": 0, "小穴毫升": 5, "子宫毫升": 15, "屁眼毫升": 0,
  "计数": { "口": 48, "小穴": 142, "屁眼": 0, "乳穴": 0, "足腿": 12, "高潮": 86, "内射": 118, "颜射": 34, "吞精次数": 26, "吞精毫升": 130, "自慰": 12, "失禁": 0, "喷潮": 0, "露出": 5, "接客": 142 },
  "当前姿势": "一句话概括当前姿势",
  "体表痕迹": "当前体表红痕与精斑",
  "当前敏感点": "当前核心敏感部位",
  "规矩与日程": "当前心理目标或调教规矩",
  "性癖列表": [
    { "name": "简短下流性癖名", "origin": "触发计数项与达标由来", "val": 52, "stage": "第三阶段", "desc": "符合该性癖与当前阶段的色情重口微观生理发作表现(90字以上)", "thought": "符合该性癖当前阶段与人设的第一人称实时心声(50字以上)" }
  ],
  "按钮详情": {
    "身份与背景": { "stage": "4字概括", "desc": "主角当前真实身份、体质耐受度与眼前处境详写", "thought": "第一人称心声" },
    "肉体外貌": { "stage": "4字概括", "desc": "严格依据正文的主角容颜、胸臀身材、体表红痕与正字烙印详写", "thought": "第一人称心声" },
    "内心独白": { "thought": "主角当下最核心的第一人称长篇心理独白" },
    "当前姿势": { "desc": "当前肢体动作、身体曲线与走动漏精细节详写", "thought": "第一人称心声" },
    "cockLove": { "stage": "4字阶段", "desc": "对男性肉棒的粘膜记忆与心理反应", "thought": "贴合当前阶段的第一人称心声" },
    "lust": { "stage": "4字阶段", "desc": "体内情欲燥热、乳尖充血与淫水反应", "thought": "贴合当前阶段的第一人称心声" },
    "corr": { "stage": "4字阶段", "desc": "道德矜持防线与风尘/恶堕进度", "thought": "贴合当前阶段的第一人称心声" },
    "shame": { "stage": "4字阶段", "desc": "羞耻心钝化或反噬实况", "thought": "贴合当前阶段的第一人称心声" },
    "obey": { "stage": "4字阶段", "desc": "顺从迎合度与条件反射实况", "thought": "贴合当前阶段的第一人称心声" },
    "pleas": { "stage": "4字阶段", "desc": "高潮余韵断瘾空虚或敏感带过电蓄积", "thought": "贴合当前阶段的第一人称心声" },
    "精神沦陷": { "desc": "精神防线、人格异化与清醒度实况", "thought": "贴合当前阶段的第一人称心声" },
    "骚口实况": { "desc": "唇瓣微肿、香舌、咽喉深喉记忆与口胃储精专属解剖描写", "thought": "第一人称心声" },
    "胸部实况": { "desc": "双乳罩杯、乳肉垂挂微颤、乳晕与乳头充血硬挺专属解剖描写", "thought": "第一人称心声" },
    "小穴实况": { "desc": "阴唇红肿外翻、闭合不全、阴道内壁泥泞与白浊拉丝专属解剖描写", "thought": "第一人称心声" },
    "子宫实况": { "desc": "子宫断面透视、宫颈口软烂微张、宫腔浓精充盈坠胀与受孕风险专属描写", "thought": "第一人称心声" },
    "阴蒂尿道": { "desc": "阴蒂充血凸起、尿道括约肌与事后排尿冲精专属描写", "thought": "第一人称心声" },
    "屁眼实况": { "desc": "丰腴臀瓣掌印、臀缝肛门微红与直肠储精专属描写", "thought": "第一人称心声" },
    "穿搭_头饰": { "stage": "当前头部/发丝概括", "desc": "发型、汗湿发丝、鹅蛋脸潮红与唇角涎水色情描写", "thought": "第一人称心声" },
    "穿搭_颈部": { "stage": "当前颈部/锁骨概括", "desc": "雪颈、锁骨凹陷薄汗、香肩红痕或项圈描写", "thought": "第一人称心声" },
    "穿搭_胸罩": { "stage": "当前胸罩/真空概括", "desc": "真空无内衣或胸罩包裹、乳肉起伏与硬挺乳头顶起布料描写", "thought": "第一人称心声" },
    "穿搭_上衣": { "stage": "当前上衣概括", "desc": "宽松T恤或外装、领口松垮歪斜与下摆遮挡描写", "thought": "第一人称心声" },
    "穿搭_内裤": { "stage": "当前内裤/真空概括", "desc": "脱下内裤真空光裸或底裤浸湿、纸团按压阴唇吸精描写", "thought": "第一人称心声" },
    "穿搭_下装": { "stage": "当前下装/裸臀概括", "desc": "无下装光裸或裙裤包裹、臀肉掌印若隐若现描写", "thought": "第一人称心声" },
    "穿搭_丝袜": { "stage": "当前美腿/精斑概括", "desc": "修长裸腿或丝袜、大腿根内侧指痕与浓精滑落白线描写", "thought": "第一人称心声" },
    "穿搭_鞋子": { "stage": "当前鞋子/玉足概括", "desc": "塑胶拖鞋或高跟鞋、纤细足背青筋、脚趾微蜷与脚面滴落精斑描写", "thought": "第一人称心声" },
    "爱液分泌": { "desc": "体内道具、满屋精腥味与淫水汗液交织实况描写", "thought": "第一人称心声" },
    "六孔总账": { "desc": "各孔穴开发累计次数与身体形状记忆总结", "thought": "第一人称心声" },
    "高潮总账": { "desc": "高潮泄身与潮吹失禁记录总结", "thought": "第一人称心声" },
    "射精总账": { "desc": "子宫内射与吞精承受记录总结", "thought": "第一人称心声" },
    "露出总账": { "desc": "风尘接客卖身与当众露出记录总结", "thought": "第一人称心声" }
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
            console.warn("[V21 JSON Repair Failed]:", e3);
            return null;
        }
    }

    function applyApiFullResponse(replyText, targetMsg, fid, sourceLabel = "API") {
        if (!replyText) return false;
        const data = repairAndParseJson(replyText);
        if (data && typeof data === "object") {
            const v = curVars;
            if (data.当前认知名字 && String(data.当前认知名字).trim()) {
                v.档案.当前认知名字 = String(data.当前认知名字).trim();
            }
            if (data.种族与体质 && String(data.种族与体质).trim()) {
                v.档案.种族与体质 = String(data.种族与体质).trim();
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
                if (typeof c.内射 === "number") v.计数.射精.内射 = c.内射;
                if (typeof c.颜射 === "number") v.计数.射精.颜射体外 = c.颜射;
                if (typeof c.吞精次数 === "number") v.计数.精液摄入.吞精次数 = c.吞精次数;
                if (typeof c.吞精毫升 === "number") v.计数.精液摄入.累计毫升 = c.吞精毫升;
                if (typeof c.自慰 === "number") v.计数.自慰 = c.自慰;
                if (typeof c.失禁 === "number") v.计数.失控.失禁 = c.失禁;
                if (typeof c.喷潮 === "number") v.计数.失控.喷潮 = c.喷潮;
                if (typeof c.露出 === "number") v.计数.暴露.露出 = c.露出;
                if (typeof c.接客 === "number") v.计数.交易.接客卖身 = c.接客;
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
                    // 自动用非线性体质算法校准API返回的虚高数值
                    if (totalCnt > 0 && num > maxCap + 18) num = Math.min(num, maxCap + 12);
                    const stg = stageNameFromVal(num);
                    const orig = String(item.origin || "调教与开发形成").trim();
                    newItems.push(`${nm}-${orig}-${stg}-${num}/100`);
                    v.性癖详情[nm] = {
                        origin: orig,
                        val: num,
                        stage: stg,
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
            showToast(`✅ ${sourceLabel}全量重绘成功！主角【${latestStatus.charName}】全部状态已按体质难度刷新！`, "success", 4000);
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
        showToast(`⏳ 正在调用主 API 为主角【${u}】全量重绘所有按钮与五阶性癖...`, "info", 6000);
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
        if (btnEl && oldTxt) setTimeout(() => { btnEl.textContent = oldTxt; }, 2500);
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
        showToast(`⏳ 正在通过副 API 实时重绘主角【${u}】的全部按钮与8部位穿搭...`, "info", 4500);
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

    function showDetailPopup(itemIdx) {
        const d = (latestStatus && latestStatus.categories?.length) ? latestStatus : getFallbackData();
        const cat = activeCat !== null ? d.categories[activeCat] : null;
        if (!cat || !cat.items[itemIdx]) return;
        curDetailIdx = itemIdx;
        const item = cat.items[itemIdx], ov = document.getElementById("st-v6-detail-modal");
        if (!ov) return;
        document.getElementById("st-v6-det-title").innerHTML = item.keyHTML;
        document.getElementById("st-v6-det-bar").innerHTML = item.barHTML || "";
        const formattedDesc = (item.desc || "暂无详细描述")
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/【([^】]+)】/g, `<span style="color:#f9e2af;font-weight:bold;">【$1】</span>`)
            .replace(/(💭<span[^>]*>【[^】]+】<\/span>：)([\s\S]*)$/, `<div style="margin-top:12px;padding:11px 13px;background:linear-gradient(135deg,rgba(243,139,168,0.18),rgba(203,166,247,0.12));border-left:4px solid #f38ba8;border-radius:10px;color:#ffd6e7;font-style:italic;line-height:1.8;box-shadow:inset 0 0 12px rgba(243,139,168,0.1);"><b style="color:#f9e2af;font-style:normal;display:block;margin-bottom:5px;">$1</b>$2</div>`);
        document.getElementById("st-v6-det-desc").innerHTML = formattedDesc;
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
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🧬 0. 主角认知真名与种族体质难度设定（解决十几次满级问题）</div>
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
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🔌 1. API 全量实时重绘设置（含8部位穿搭与五阶段性癖）</div>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input id="st-api-chk" type="checkbox" ${userSettings.apiSyncEnabled ? "checked" : ""} style="accent-color:${tc.prim};"><span><b>每回合结束后自动调用副 API 全量改写所有按钮与心声</b></span></label>
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
                <div style="font-size:12.5px;color:${tc.sub};line-height:1.6;">请先在 SillyTavern 中点选一张角色卡并开启对话。<br>进入角色卡后，状态栏将自动识别文中主角真名、种族耐受倍率与全身重口解剖状态！</div>`;
            body.appendChild(emptyBox);
            return;
        }

        if (activeCat === null || !d.categories[activeCat]) {
            const vagCnt = Number(curVars.计数?.性交?.小穴) || 0;
            const creampieCnt = Number(curVars.计数?.射精?.内射) || 0;
            const corrVal = Number(curVars.核心数值?.淫乱恶堕) || 0;
            const pleasVal = Number(curVars.精神与心理?.快感累积) || 0;
            const badgeBanner = document.createElement("div");
            badgeBanner.style.cssText = `margin-bottom:10px;padding:10px 12px;background:linear-gradient(135deg,rgba(0,0,0,0.6),rgba(42,27,61,0.5));border:${tc.cardBorder};border-radius:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;font-size:12px;box-shadow:inset 0 0 12px rgba(243,139,168,0.12);`;
            badgeBanner.innerHTML = `
                <span style="color:#f9e2af;font-weight:bold;">🎭 ${d.charName} · ${phy.name}(${phy.mult}x)</span>
                <span style="color:${tc.prim};">🌺 贯穿:${vagCnt}次 / 内射:${creampieCnt}次</span>
                <span style="color:${tc.sec};"><span class="st-heart-beat">💓</span> 恶堕:<b>${corrVal}%</b> ｜ 快感:<b>${pleasVal}%</b></span>`;
            body.appendChild(badgeBanner);

            const vList = document.createElement("div");
            vList.style.cssText = "display:flex;flex-direction:column;gap:9px;";
            d.categories.forEach((cat, idx) => {
                const b = document.createElement("div");
                b.className = "st-v21-card";
                b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-left:4.5px solid ${tc.prim};border-radius:12px;padding:12px 14px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 14px rgba(0,0,0,0.45);`;
                b.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:14.5px;font-weight:bold;color:${tc.prim};">${cat.icon} ${cat.title}</span>
                        <span style="font-size:11px;background:${tc.hi};color:${tc.text};padding:2px 9px;border-radius:99px;font-weight:bold;">共 ${cat.items.length} 项 ▸</span>
                    </div>
                    <div style="font-size:12px;color:${tc.sub};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cat.summary || `点击展开查看 ${cat.title} 详细解剖与主角心声`}</div>`;
                b.onclick = (e) => { e.stopPropagation(); activeCat = idx; renderBody(); };
                vList.appendChild(b);
            });
            body.appendChild(vList);
        } else {
            const cat = d.categories[activeCat], list = document.createElement("div");
            list.style.cssText = "display:flex;flex-direction:column;gap:10px;";
            cat.items.forEach((it, idx) => {
                const b = document.createElement("div");
                b.className = "st-v21-card";
                b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-radius:12px;padding:11px 13px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 12px rgba(0,0,0,0.45);`;
                const parts = (it.desc || "").split("💭");
                const objPreview = parts[0].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 52) + "…";
                const thoughtPreview = parts[1] ? "💭 " + parts[1].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 46) + "…" : "";
                b.innerHTML = `${it.keyHTML}${it.barHTML || ""}
                    <div style="font-size:11.5px;color:${tc.sub};margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${objPreview}</div>
                    ${thoughtPreview ? `<div style="font-size:11.5px;color:#ffd6e7;font-style:italic;background:rgba(243,139,168,0.12);padding:4px 8px;border-radius:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${thoughtPreview}</div>` : ""}
                    <div style="display:flex;justify-content:flex-end;margin-top:2px;"><span style="color:${tc.prim};font-size:11px;font-weight:bold;">点开查看四维解剖与实时心声 ▸</span></div>`;
                b.onclick = (e) => { e.stopPropagation(); showDetailPopup(idx); };
                list.appendChild(b);
            });
            body.appendChild(list);
        }
    }

    function mountExtensionSettingsMenu() {
        const container = document.getElementById("extensions_settings") || document.getElementById("extensions_settings2");
        if (!container || document.getElementById("st-v21-ext-drawer")) return;
        document.getElementById("st-v20-ext-drawer")?.remove();
        document.getElementById("st-v19-ext-drawer")?.remove();

        const drawer = document.createElement("div");
        drawer.id = "st-v21-ext-drawer";
        drawer.style.cssText = "margin-bottom:8px;border:1px solid rgba(243,139,168,0.35);border-radius:8px;overflow:hidden;background:rgba(0,0,0,0.2);";
        drawer.innerHTML = `
            <div id="st-v21-ext-header" style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;cursor:pointer;user-select:none;background:rgba(243,139,168,0.12);">
                <b style="color:#f5c2e7;font-size:13.5px;">📊 终极重口状态栏引擎 V21 (魅魔动态难度+黄油断面版)</b>
                <span id="st-v21-ext-arrow" style="color:#f38ba8;font-weight:bold;">▼ 展开设置</span>
            </div>
            <div id="st-v21-ext-content" style="display:none;padding:12px;font-size:13px;border-top:1px solid rgba(255,255,255,0.1);">
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;">
                    <input id="st-v21-ext-enable" type="checkbox" ${userSettings.enabled ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span><b>启用状态栏悬浮窗与后台变量注入</b></span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;cursor:pointer;">
                    <input id="st-v21-ext-hide" type="checkbox" ${userSettings.hideRawBlock ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span>自动折叠隐藏聊天正文尾部的原始【状态栏】与代码文本</span>
                </label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button id="st-v21-ext-open" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">👑 呼出状态栏面板</button>
                    <button id="st-v21-ext-sync" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">⚡ API全量重绘本层</button>
                </div>
            </div>`;
        container.appendChild(drawer);

        const header = drawer.querySelector("#st-v21-ext-header");
        const content = drawer.querySelector("#st-v21-ext-content");
        const arrow = drawer.querySelector("#st-v21-ext-arrow");

        header.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = content.style.display === "none";
            content.style.display = isHidden ? "block" : "none";
            arrow.textContent = isHidden ? "▲ 收起设置" : "▼ 展开设置";
        });

        drawer.querySelector("#st-v21-ext-enable").addEventListener("change", (e) => {
            userSettings.enabled = e.target.checked;
            saveSettings(); applyThemeAndSize();
            showToast(userSettings.enabled ? "✅ 状态栏插件已开启！" : "⏸️ 状态栏插件已隐藏关闭！", "info", 2000);
        });
        drawer.querySelector("#st-v21-ext-hide").addEventListener("change", (e) => {
            userSettings.hideRawBlock = e.target.checked;
            saveSettings(); cleanAll(true);
        });
        drawer.querySelector("#st-v21-ext-open").addEventListener("click", (e) => {
            e.stopPropagation();
            userSettings.enabled = true;
            const chk = document.getElementById("st-v21-ext-enable");
            if (chk) chk.checked = true;
            saveSettings(); applyThemeAndSize();
            const panel = document.getElementById("st-v5-panel");
            if (panel) { panel.style.display = "flex"; renderBody(); }
        });
        drawer.querySelector("#st-v21-ext-sync").addEventListener("click", (e) => {
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
                    <button id="st-v5-refresh-btn" type="button" title="调用API根据当前角色卡与最新楼层实时改写全部按钮与8部位穿搭" style="background:rgba(166,227,161,0.22);color:#a6e3a1;border:1px solid rgba(166,227,161,0.55);border-radius:8px;padding:3px 9px;cursor:pointer;font-size:11.5px;font-weight:bold;">⚡ API全量重绘</button>
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
                <div style="background:linear-gradient(160deg,#251d38,#1b152a);border:1.5px solid #f38ba8;border-radius:14px;padding:15px;max-height:92%;display:flex;flex-direction:column;gap:10px;box-shadow:0 12px 36px rgba(0,0,0,0.85);">
                    <div id="st-v6-det-title"></div>
                    <div id="st-v6-det-bar"></div>
                    <div id="st-v6-det-desc" style="color:#ede6f2;font-size:13.5px;line-height:1.75;overflow-y:auto;white-space:pre-wrap;word-break:break-word;padding:8px 0;border-top:1px solid rgba(243,139,168,0.22);border-bottom:1px solid rgba(243,139,168,0.22);"></div>
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

    // 新增：从正文中直接解析【状态栏】里的计数与数值（当楼层只输出了【状态栏】而未写 _.set 时也能精准同步！）
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
        const sta = grabNum(/体力与脱力[：:]\s*(\d+)/); if (sta !== null) targetVars.身体.体力 = sta;

        const mMouth = grabNum(/口(\d+)/); if (mMouth !== null) targetVars.计数.性交.口 = mMouth;
        const mVag = grabNum(/小穴(\d+)/); if (mVag !== null) targetVars.计数.性交.小穴 = mVag;
        const mAnal = grabNum(/屁眼(\d+)/); if (mAnal !== null) targetVars.计数.性交.屁眼 = mAnal;
        const mFoot = grabNum(/足腿(\d+)/); if (mFoot !== null) targetVars.计数.性交.足腿 = mFoot;
        const mOrg = grabNum(/高潮[：:]\s*(\d+)次/); if (mOrg !== null) targetVars.计数.高潮.总数 = mOrg;
        const mCrm = grabNum(/内射(\d+)次/); if (mCrm !== null) targetVars.计数.射精.内射 = mCrm;
        const mFac = grabNum(/颜射体外(\d+)次/); if (mFac !== null) targetVars.计数.射精.颜射体外 = mFac;
        const mSwal = grabNum(/饮精吞精(\d+)次/); if (mSwal !== null) targetVars.计数.精液摄入.吞精次数 = mSwal;
        const mSwalMl = grabNum(/累计摄入(\d+)ml/); if (mSwalMl !== null) targetVars.计数.精液摄入.累计毫升 = mSwalMl;
        const mMast = grabNum(/自慰[：:]\s*(\d+)次/); if (mMast !== null) targetVars.计数.自慰 = mMast;
        const mExp = grabNum(/露出(\d+)次/); if (mExp !== null) targetVars.计数.暴露.露出 = mExp;
        const mHook = grabNum(/接客卖身(\d+)次/); if (mHook !== null) targetVars.计数.交易.接客卖身 = mHook;

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
            h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 打开此层 (#${id}) 状态栏</div>`;
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
        } catch (e) { console.error("[my-status-bar V21] recalc error:", e); renderBody(); }
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