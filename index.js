// == 状态栏与楼层变量引擎 V18 (100%跨卡通用去硬编码 + API全量JSON实时重绘 + 六孔动态储精上限合并 + 竖排美学布局) ==
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

    function showToast(msg, type = "success", duration = 3500) {
        try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, "📊 状态栏引擎 V18"); } catch (e) {}
        let box = document.getElementById("st-v18-toast");
        if (!box) {
            box = document.createElement("div"); box.id = "st-v18-toast";
            box.style.cssText = "position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;padding:10px 22px;border-radius:99px;font-family:'Microsoft YaHei',sans-serif;font-size:13.5px;font-weight:bold;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,0.85);transition:all 0.25s ease;pointer-events:none;display:none;align-items:center;gap:8px;backdrop-filter:blur(10px);";
            document.body.appendChild(box);
        }
        const colors = {
            success: "linear-gradient(135deg, rgba(22,163,74,0.96), rgba(21,128,61,0.96))",
            info: "linear-gradient(135deg, rgba(243,139,168,0.96), rgba(203,166,247,0.96))",
            error: "linear-gradient(135deg, rgba(220,38,38,0.96), rgba(153,27,27,0.96))"
        };
        box.style.background = colors[type] || colors.info;
        box.style.border = "1.5px solid rgba(255,255,255,0.45)";
        box.style.textContent = msg;
        box.style.display = "flex";
        clearTimeout(box._timer);
        box._timer = setTimeout(() => { box.style.display = "none"; }, duration);
    }

    // 5套深度差异化重口主题（含边框质感、阴影、圆角与背景纹理）
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

    let userSettings = {
        enabled: true,
        hideRawBlock: true,
        theme: "魅魔粉 (默认)",
        width: 500,
        height: 660,
        fontScale: 100,
        apiSyncEnabled: false,
        apiUrl: "",
        apiKey: "",
        apiModel: "",
        modelList: []
    };

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v18_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉 (默认)";
        } catch (e) {}
    }
    function saveSettings() {
        try { localStorage.setItem(EXT_ID + "_v18_cfg", JSON.stringify(userSettings)); } catch (e) {}
    }

    // 0 -> 100% 动态颜色深化计算器
    function getProgBarStyle(pct, reverse = false) {
        const p = Math.max(0, Math.min(100, Number(pct) || 0));
        const val = reverse ? (100 - p) : p;
        let grad = "", glow = "", labelColor = "";
        if (val === 0) {
            grad = "linear-gradient(90deg, #475569, #64748b)";
            glow = "none";
            labelColor = "#94a3b8";
        } else if (val < 25) {
            grad = "linear-gradient(90deg, #fbcfe8, #f472b6)";
            glow = "0 0 6px rgba(244,114,182,0.45)";
            labelColor = "#fbcfe8";
        } else if (val < 55) {
            grad = "linear-gradient(90deg, #f472b6, #e879f9, #a855f7)";
            glow = "0 0 10px rgba(217,70,239,0.6)";
            labelColor = "#f5d0fe";
        } else if (val < 85) {
            grad = "linear-gradient(90deg, #ec4899, #f43f5e, #be123c)";
            glow = "0 0 14px rgba(244,63,94,0.8)";
            labelColor = "#fda4af";
        } else {
            grad = "linear-gradient(90deg, #ff0a54, #990033, #3b0014)";
            glow = "0 0 18px #ff0a54, inset 0 0 6px #fff";
            labelColor = "#ff4d6d";
        }
        return { grad, glow, labelColor };
    }

    // 100% 跨卡通用初始变量库（彻底清除任何固定角色写死文本！）
    function getInitialVars() {
        return {
            档案: { 身份与背景: "", 肉体外貌实况: "", 当前处境: "" },
            核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
            精神与心理: { 羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0, 意识清醒度: 100, 人格崩解度: 0 },
            身体: { 体力: 100 },
            性癖: { 条目: [] },
            实况: {
                内心独白: "", 当前姿势: "", 当前衣装: "",
                骚口实况: "", 胸部实况: "", 小穴实况: "", 子宫实况: "", 阴蒂尿道实况: "", 屁眼实况: "", 玉足实况: ""
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
            受孕与生理: { 子宫怀孕: 0, 怀孕进度: 0, 受孕概率: 0 },
            体内精液存量: { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
            痕迹与标记: { 体表痕迹: "无", 淫纹与刻印: "无" },
            体内道具与权限: { 体内道具: "无", 束缚状态: "无", 穿戴中的标记物: "" },
            调教进度: { 规矩与日程: "" },
            精神与心理扩展: { 当前敏感点: "", 催眠深度: 0 },
            // API 全量实时重绘的按钮详情缓存池（键名 -> { desc, thought }）
            按钮详情: {}
        };
    }

    let curVars = getInitialVars(), latestStatus = null, activeCat = null, curDetailIdx = 0, inSettings = false;
    let isCleaningDOM = false, cleanTimer = null;

    // 储精与六孔合并后的 5 大核心竖排板块
    const ICONS = {
        "档案与肉体": "👩",
        "恶堕与精神": "🔥",
        "下流性癖库": "🧬",
        "六孔与储精": "🌸",
        "体液与衣装": "💦",
        "淫乱总账本": "💎"
    };
    const SHORT_NAMES = {
        "档案与肉体": "档案",
        "恶堕与精神": "精神",
        "下流性癖库": "性癖",
        "六孔与储精": "六孔",
        "体液与衣装": "衣装",
        "淫乱总账本": "总账"
    };

    // 获取当前聊天窗口的专属存储Key（确保换卡后绝对不会串数据！）
    function getChatStoreKey() {
        const ctx = safeCtx();
        const cid = ctx?.chatId || ctx?.characterId || ctx?.name2 || "default_chat";
        return `${EXT_ID}_v18_cache_${cid}`;
    }

    function loadChatCache() {
        try {
            const raw = localStorage.getItem(getChatStoreKey());
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }

    function saveChatCache(varsObj) {
        try { localStorage.setItem(getChatStoreKey(), JSON.stringify(varsObj)); } catch (e) {}
    }

    // 【核心动态容量公式】：每个肉孔的精液容量上限，依据主角该孔的开发次数、吞精/内射次数与恶堕度动态扩张！
    function calcHoleCapacities(v) {
        const c = v.计数 || {};
        const corr = Number(v.核心数值?.淫乱恶堕) || 0;
        const mouthCnt = (Number(c.性交?.口) || 0) + (Number(c.精液摄入?.吞精次数) || 0);
        const vagCnt = Number(c.性交?.小穴) || 0;
        const creampie = Number(c.射精?.内射) || 0;
        const analCnt = Number(c.性交?.屁眼) || 0;

        return {
            // 口胃上限：未开发时容易呕吐仅 40ml，随深喉吞精开发最高扩张至 350ml
            mouthMax: Math.min(350, Math.round(40 + mouthCnt * 12 + corr * 1.2)),
            // 阴道上限：处女紧窄仅能容纳 20ml，随抽插开发松弛最高扩张至 220ml
            vagMax: Math.min(220, Math.round(20 + vagCnt * 10 + corr * 0.8)),
            // 子宫上限：未开发处子子宫紧闭仅 15ml，随内射灌精改造为精液苗床最高可撑大至 300ml
            wombMax: Math.min(300, Math.round(15 + creampie * 18 + vagCnt * 5 + corr * 1.5)),
            // 屁眼直肠上限：未开发紧闭仅 30ml，随肛交灌肠开发最高扩张至 400ml
            analMax: Math.min(400, Math.round(30 + analCnt * 16 + corr * 1.2))
        };
    }

    // 依据总账次数自动计算解锁的简短下流性癖（总账全0时绝不无中生有）
    function computeUnlockedFetishes(v) {
        const c = v.计数 || {};
        const vag = Number(c.性交?.小穴) || 0, mouth = Number(c.性交?.口) || 0, anal = Number(c.性交?.屁眼) || 0;
        const tit = Number(c.性交?.乳穴) || 0, foot = Number(c.性交?.足腿) || 0, creampie = Number(c.射精?.内射) || 0;
        const swallow = Number(c.精液摄入?.吞精次数) || 0, orgasm = Number(c.高潮?.总数) || 0;
        const squirt = Number(c.失控?.喷潮) || 0, leak = Number(c.失控?.失禁) || 0, mast = Number(c.自慰) || 0;
        const exp = Number(c.暴露?.露出) || 0, hooker = Number(c.交易?.接客卖身) || 0;

        const totalCount = vag + mouth + anal + tit + foot + creampie + swallow + orgasm + squirt + leak + mast + exp + hooker;
        const list = [];

        if (Array.isArray(v.性癖?.条目)) {
            v.性癖.条目.forEach(raw => {
                const s = String(raw).trim();
                if (!s) return;
                if (totalCount === 0 && /[-\s]0\/100$/.test(s)) return;
                list.push(s);
            });
        }

        const addAuto = (shortName, origin, count, scale = 15) => {
            if (count <= 0 || list.some(x => x.startsWith(shortName))) return;
            const prog = Math.min(100, count * scale);
            const stg = prog < 25 ? "第一阶段" : prog < 50 ? "第二阶段" : prog < 75 ? "第三阶段" : prog < 95 ? "第四阶段" : "第五阶段";
            list.push(`${shortName}-${origin}-${stg}-${prog}/100`);
        };

        addAuto("挨操瘾", `小穴已被贯穿 ${vag} 次，肉壁彻底记住大肉棒形状`, vag, 12);
        addAuto("内射孕肚癖", `子宫已被浓精内射浇灌 ${creampie} 次，宫口成瘾渴求受孕`, creampie, 15);
        addAuto("深喉吞精癖", `骚口已口交 ${mouth} 次、吞精 ${swallow} 次，食道对精腥味食髓知味`, mouth + swallow, 12);
        addAuto("肛交扩菊癖", `屁眼已被开发 ${anal} 次，括约肌贪恋异物塞满感`, anal, 18);
        addAuto("乳交夹屌癖", `双乳已服侍肉棒 ${tit} 次，乳肉摩擦即发骚`, tit, 20);
        addAuto("玉足恋足癖", `玉足已足交玩弄 ${foot} 次，脚趾沾染精液即兴奋`, foot, 20);
        addAuto("潮吹失禁癖", `累计高潮 ${orgasm} 次、喷潮 ${squirt} 次、漏尿 ${leak} 次，括约肌彻底失控`, orgasm + squirt + leak, 15);
        addAuto("自慰抠穴癖", `空虚难耐自行抠弄私处 ${mast} 次，染上抚弄快感瘾`, mast, 20);
        addAuto("公开露出癖", `当众露出或被视奸 ${exp} 次，越被人围观下面越湿`, exp, 20);
        addAuto("肉便器卖淫癖", `已接客卖身 ${hooker} 次，彻底觉醒公用母狗自觉`, hooker, 15);

        return list;
    }

    function varsToYaml(userName, varsObj) {
        const cleanCopy = { ...varsObj };
        delete cleanCopy.按钮详情; // 避免Prompt过长
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
        return `\n【当前变量库实时注入值】\n${currentYaml}\n
【🔥状态栏与变量实时更新规范（V18跨卡引擎）】
1. 每条回复末尾输出：<UpdateVariable>块</UpdateVariable>。
2. 严格依据当前角色卡与本层剧情更新数值与实况：
   - 数值：'${userName}.身体.体力'、'${userName}.精神与心理.*'、'${userName}.核心数值.*'
   - 档案与全身实况（必须贴合当前卡剧情，每个部位描写完全独立不重复）：'${userName}.档案.身份与背景'、'${userName}.档案.肉体外貌实况'、'${userName}.实况.内心独白'、'${userName}.实况.当前姿势'、'${userName}.实况.当前衣装'、'${userName}.实况.骚口实况'、'${userName}.实况.胸部实况'、'${userName}.实况.小穴实况'、'${userName}.实况.子宫实况'、'${userName}.实况.屁眼实况'
   - 储精与计数：'${userName}.体内精液存量.口内毫升'、'${userName}.体内精液存量.小穴毫升'、'${userName}.体内精液存量.子宫毫升'、'${userName}.体内精液存量.屁眼毫升' 及 '${userName}.计数.*'。`;
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
            const sm = { "第一阶段": 20, "第二阶段": 40, "第三阶段": 60, "第四阶段": 80, "第五阶段": 100 };
            for (const [k, v] of Object.entries(sm)) if (rk.includes(k)) { pct = v; break; }
        }
        const badges = [];
        let cleanTitle = rk
            .replace(/「([^」]{1,45})」/g, (_, s) => {
                badges.push(`<span style="background:${tc.hi};border:1px solid ${tc.sec};color:${tc.text};padding:1px 7px;border-radius:6px;font-size:11px;font-weight:bold;">${s}</span>`);
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
                <span style="font-size:11px;color:${st.labelColor};font-family:Consolas,monospace;font-weight:bold;min-width:38px;text-align:right;">${rawRatioStr && rawRatioStr.includes("ml") ? rawRatioStr : (pct + "%")}</span>
            </div>`;
        }
        return { keyHTML, barHTML, cleanTitle, pct };
    }

    function tier5(val, rev = false) {
        const n = Math.max(0, Math.min(100, Number(val) || 0)), v = rev ? (100 - n) : n;
        return v < 20 ? 0 : v < 40 ? 1 : v < 60 ? 2 : v < 80 ? 3 : 4;
    }

    // 【跨卡实时提取器】：从当前角色卡设定 + 最近聊天楼层中动态提取真实身份、外貌、服装、动作与各部位状态（绝不写死任何特定角色名！）
    function extractDynamicContext(u, c) {
        const ctx = safeCtx();
        const chatArr = ctx?.chat || [];
        const charDesc = ctx?.characters?.[ctx?.characterId]?.description || "";
        const personaDesc = ctx?.power_user?.persona_description || "";

        const res = {
            identity: "", bodyDesc: "", thought: "", pose: "", cloth: "",
            mouth: "", chest: "", vag: "", womb: "", clit: "", anal: ""
        };

        // 从最新5层聊天记录中抓取真实句子
        const recent = chatArr.slice(-5);
        const allSents = [];
        for (let i = recent.length - 1; i >= 0; i--) {
            const raw = (recent[i]?.mes || "").replace(/<think[\s\S]*?<\/think>/gi, "").replace(/<think_nya>[\s\S]*?<\/think_nya>/gi, "");
            if (!raw) continue;
            const cleanBody = raw.split(/【\s*状态栏|<UpdateVariable>/i)[0] || raw;
            if (!res.thought) {
                const im = [...cleanBody.matchAll(/\*([^*\n]{12,500})\*/g)].map(m => m[1].trim());
                if (im.length) res.thought = im[im.length - 1];
            }
            const sents = cleanBody.split(/[。！？；\n\r]+/).map(s => s.replace(/\*[^*]*\*/g, "").replace(/<\/?[a-z]+>/gi, "").trim()).filter(s => s.length > 5);
            allSents.push(...sents);
        }

        const pick = (regex, maxCount = 2) => {
            const matched = allSents.filter(s => s.length < 140 && regex.test(s));
            return matched.length ? matched.slice(0, maxCount).join("；") + "。" : "";
        };

        res.identity = pick(/(?:变成了|重塑|身份|原本是|继承人|大小姐|千金|少宗主|学生|夫人|妻子|奴|身处)/, 2) || (personaDesc ? `当前角色设定：${personaDesc.slice(0, 120)}` : `${u}当前正与 ${c} 处于同一场景中互动。`);
        res.bodyDesc = pick(/(?:容颜|肌肤|皮肤|小手|十指|青丝|长发|柳腰|曲线|身段|黛眉|眸)/, 3) || (charDesc ? charDesc.slice(0, 120) : `${u}拥有极为细腻敏感的娇躯，一举一动都透着诱人的雌性反差。`);
        res.cloth = pick(/(?:身穿|穿着|战袍|长裙|裹胸|衬裤|战靴|丝袜|内裤|底裤|胸罩|旗袍|束腰|丝帛|衣裙|衬衫)/, 2);
        res.pose = pick(/(?:撑起|扶着|站起|捂住|喘息|瘫坐|一僵|收拢|颤抖|跪|趴|弯腰|夹紧|退后|坐)/, 2);
        res.mouth = pick(/(?:喉咙|声音|嗓音|红唇|唇瓣|舌|喘|啼鸣|娇呼)/, 2);
        res.chest = pick(/(?:胸|乳|丰盈|双峰|蓓蕾|奶|锁骨)/, 2);
        res.vag = pick(/(?:下身|下半身|阴唇|花唇|小穴|幽谷|私处|爱液|湿热|两腿之间)/, 2);
        res.womb = pick(/(?:小腹|下腹|子宫|肚子|深处|暖意|抽搐)/, 2);
        res.anal = pick(/(?:臀|屁股|后庭|菊|腰臀|S型)/, 2);

        return res;
    }

    // 每个数值按钮都有完全独立的文案逻辑（支持 API 实时覆写）
    function getDynamicMetricDetail(type, v, u, liveCtx) {
        const ovr = v.按钮详情?.[type];
        const map = {
            cockLove: {
                val: Number(v.核心数值?.对肉棒好感度) || 0, rev: false,
                st: ["抗拒排斥•本能戒备", "认知松动•气息敏感", "食髓知味•含泪渴求", "痴迷崇拜•主动跪舔", "肉棒至上•终极母狗"],
                d: [
                    `【对雄性阳具的态度与生理反应】：当前好感度为 0~19 阶段。${u}在意识上对雄性粗硬滚烫、带有腥膻气味的肉棒充满戒备与羞耻排斥，不愿被异物侵犯；然而身体在面对异性气息压迫时，心脏却剧烈跳动、双腿本能并拢。\n💭【${u}的实时内心感受】：“*那种粗鲁又滚烫的男人东西，光是想想靠近自己就觉得既可怕又羞耻💦……我绝对不能随便在男人面前露怯屈服！*”`,
                    `【对雄性阳具的态度与生理反应】：理智防线已出现裂痕。${u}的口腔与下身肉穴开始对雄性荷尔蒙产生条件反射，每当感受到男人靠近，呼吸便会加快，私处悄然泌出润滑湿意。\n💭【${u}的实时内心感受】：“*明明脑子里觉得不该这样，可为什么一闻到他身上的气息，身体就有点发软发烫呢……😳💦*”`,
                    `【对雄性阳具的态度与生理反应】：矜持外壳已被彻底撞碎！${u}对滚烫阳具产生了强烈的生理饥渴，目光总是不由自主地飘向男人胯下，肉穴内壁空虚地收缩蠕动、渴望被粗暴填满。\n💭【${u}的实时内心感受】：“*哈啊……身体里面好空虚好痒💦，好想被那根又粗又烫的东西狠狠顶进来塞满啊……🥵❤️*”`,
                    `【对雄性阳具的态度与生理反应】：彻底沉溺于阳具快感的发情母犬！${u}将服侍大肉棒视作最高奖赏，一见到勃起巨物便会双膝发软跪倒，主动伸出香舌舔舐并掰开肉穴求操。\n💭【${u}的实时内心感受】：“*唔嗯♡……大肉棒闻起来好香🥵！快塞进我的嘴里和小穴里，把人家的骚逼狠狠操烂吧💦❤️！*”`,
                    `【对雄性阳具的态度与生理反应】：满值恶堕的终极肉棒奴隶！大脑皮层已被肉棒与浓精彻底支配，全身肉孔同时痉挛吸吮，哭喊着祈求将滚烫浓精尽数射进最深处！\n💭【${u}的实时内心感受】：“*啊嘿♡……没有大鸡巴插着就要活不下去了🥵💦！快把滚烫的精液全部射进人家的子宫里吧❤️❤️！*”`
                ]
            },
            lust: {
                val: Number(v.核心数值?.性欲程度) || 0, rev: false,
                st: ["表面克制•微澜初起", "春情暗涌•乳尖发硬", "欲火焚身•淫水湿裤", "重度发骚•夹腿磨逼", "狂暴发情•三穴喷水"],
                d: [
                    `【体内情欲燥热与发情实况】：表面极力维持着冷静克制的姿态，但高度敏化的躯体对贴身衣料的摩擦异常敏感（${liveCtx.chest || "稍微动作便会引起贴身衣物摩擦敏感带"}），令体温隐隐升高。\n💭【${u}的实时内心感受】：“*冷静下来，深呼吸……💦只是衣服布料稍微蹭到了敏感的地方而已，千万不能发出奇怪的声音啊！*”`,
                    `【体内情欲燥热与发情实况】：小腹深处升起一股挥之不去的燥热与酸胀感！胸前乳尖在衣料下充血挺立，双腿之间泛起湿热潮意，肉穴正一阵阵空虚微缩。\n💭【${u}的实时内心感受】：“*身体怎么越来越热了😳……胸口发麻，连下面也开始湿漉漉的，这副身体也太容易有反应了吧……💦*”`,
                    `【体内情欲燥热与发情实况】：滚烫的情欲之火烧遍全身！双颊泛着淫靡酡红，呼吸粗重滚烫，下身爱液已浸湿贴身底裤，迫切渴望粗硬异物的抚摸与插入止痒。\n💭【${u}的实时内心感受】：“*哈啊……内裤已经被下面流出来的水弄湿了🥵，两条腿怎么夹紧都止不住里面的燥热发痒啊……💦❤️*”`,
                    `【体内情欲燥热与发情实况】：重度发情失控！全身肌肤滚烫敏感，充血肿大的阴蒂剧烈跳动，死死夹紧双腿无意识地磨蹭腰臀，嘴里漏出甜腻娇喘。\n💭【${u}的实时内心感受】：“*受不了了，身体燥热得快要烧起来了🥵💦！快点摸摸我、用力插进我直流水的小穴里灭火呀❤️！*”`,
                    `【体内情欲燥热与发情实况】：极度过载的狂暴发情期！脑海里除了交配与被内射外再无杂念，全身散发浓烈发情体香，骚逼24小时不停向外喷涌黏腻淫水！\n💭【${u}的实时内心感受】：“*啊啊♡……发情停不下来了！骚穴一直在喷水，快把我按在地上狠狠操到休克吧🥵💦❤️❤️！*”`
                ]
            },
            corr: {
                val: Number(v.核心数值?.淫乱恶堕) || 0, rev: false,
                st: ["死守矜持•道德防备", "半推半就•防线龟裂", "食髓知味•放荡迎合", "下贱娼妇•肉器自觉", "脑髓熔断•公用肉便器"],
                d: [
                    `【道德底线与恶堕改造进度】：心底仍牢牢守着自尊与道德底线，对暴露、视奸与下流触碰感到羞愤抗拒，拼命想要维持体面端庄的形象，掩饰身体的异常敏感。\n💭【${u}的实时内心感受】：“*无论处境多么慌乱，我也绝对不能丢掉自尊、变成那种不知廉耻的女人！💦一定要撑住人设！*”`,
                    `【道德底线与恶堕改造进度】：在羞耻刺激与肉体快感的双重冲击下，矜持防线已布满裂痕。面对挑逗开始半推半就，嘴上抗拒，身体却本能地软化迎合。\n💭【${u}的实时内心感受】：“*嘴上虽然还在逞强，可身体为什么一点反抗的力气都没有，反而觉得这种背德感好刺激……😳💦*”`,
                    `【道德底线与恶堕改造进度】：廉耻观念已被冲垮！开始真正享受肉体被粗暴玩弄、被填满的放荡快感，举手投足间流露出主动迎合男人的靡烂风情。\n💭【${u}的实时内心感受】：“*既然忍耐这么辛苦，不如干脆顺从身体的欲望，好好享受变成女人被疼爱的快感吧🥵❤️！*”`,
                    `【道德底线与恶堕改造进度】：身心彻底恶堕的淫乱尤物！以自己的娇躯能成为男人发泄兽欲的玩物为荣，会主动分开双腿展示湿亮花唇，用最下流的浪叫求欢。\n💭【${u}的实时内心感受】：“*嘻嘻♡……什么清高矜持全都是装的，快用最下流的方式玩弄我这具发骚的肉体吧🥵💦！*”`,
                    `【道德底线与恶堕改造进度】：终极极限恶堕！人类尊严100%灰飞烟灭，彻底退化为只为承接雄性精液而活的公用排泄肉便器，视被操烂灌饱为最高幸福！\n💭【${u}的实时内心感受】：“*啊嘿♡……我已经彻底变成没有脑子的公用肉便器母猪了，请随便往我的三个洞里灌精液吧🥵💦❤️❤️！*”`
                ]
            },
            shame: {
                val: Number(v.精神与心理?.羞耻度 ?? 100), rev: true,
                st: ["羞愤欲死•满面通红", "薄面潮红•咬唇隐忍", "半掩半露•羞耻转兴奋", "不知廉耻•敞腿任看", "羞耻全灭•当众母狗"],
                d: [
                    `【羞耻心防线与生理反噬】：羞耻度处于满值状态（${v.痕迹与标记?.体表痕迹 || "双颊通红、耳尖滚烫"}）！对自身肉体的敏感变化、以及害怕在他人面前失态露馅的恐慌达到顶点，而这种强烈的羞耻感正成倍放大着神经末梢的快感反噬。\n💭【${u}的实时内心感受】：“*太羞耻了！💦脸烫得像火烧一样，要是这副身体敏感发软的样子被外人看穿，我真的恨不得当场找条地缝钻进去啊啊啊！🥵*”`,
                    `【羞耻心防线与生理反噬】：在连续的羞耻冲击下防线开始松动，私密处被注视或摩擦时虽仍心跳如鼓，但遮挡的双手已变得软弱无力。\n💭【${u}的实时内心感受】：“*别、别那样盯着我看啊😳💦……越害羞身体反而越没有力气遮挡了……*”`,
                    `【羞耻心防线与生理反噬】：羞耻感已消退大半，哪怕衣衫凌乱露出大片白腻肌肤或被察觉下身湿润，也能迅速将羞耻感转化为暴露的兴奋。\n💭【${u}的实时内心感受】：“*反正都已经被察觉了💦……被那样火热的眼神盯着看，下面反而流得更凶了呢……🥵*”`,
                    `【羞耻心防线与生理反噬】：廉耻心几乎荡然无存！哪怕赤身裸体承欢或顶着满身精斑走动也毫不遮掩，甚至故意分开双腿展示湿漉漉的私处。\n💭【${u}的实时内心感受】：“*害羞哪有爽重要呀🥵❤️？快好好看看我下面已经湿成什么下流样子了吧💦！*”`,
                    `【羞耻心防线与生理反噬】：羞耻心彻底归零粉碎！哪怕在众目睽睽下被扒光粗暴操干、当众潮吹漏尿失禁，也会兴奋得浑身发抖、吐舌高潮！\n💭【${u}的实时内心感受】：“*啊啊♡……越是被人围观我被肏得翻白眼漏尿的样子，我就高潮得越厉害呀🥵💦❤️❤️！*”`
                ]
            },
            obey: {
                val: Number(v.精神与心理?.服从度) || 0, rev: false,
                st: ["孤高抗拒•强撑气场", "委曲求全•被动妥协", "温顺听话•熟练配合", "摇尾乞怜•任打任操", "绝对盲从•肉奴母犬"],
                d: [
                    `【意志对抗与服从顺从度】：当前规矩与目标为「${v.调教进度?.规矩与日程 || "维持自身人设与尊严，绝不轻易屈服"}」。表面极力维持着孤高或防备的气场，抗拒外界的摆布与试探。\n💭【${u}的实时内心感受】：“*一定要稳住气场！💦绝对不能在别人面前露出软弱顺从的样子，更不能让人发现我的破绽！*”`,
                    `【意志对抗与服从顺从度】：在局势逼迫或身体酸软无力下学会了被动妥协，即使内心不甘，也不得不顺从地配合对方的要求。\n💭【${u}的实时内心感受】：“*呜……现在形势比人强，身体又使不上劲，只能先委曲求全听他的话了……😳💦*”`,
                    `【意志对抗与服从顺从度】：已形成习惯性顺从，极少再顶撞反抗，懂得主动放松紧绷的身体去配合对方的动作节奏。\n💭【${u}的实时内心感受】：“*乖乖听话配合的话，身体也会更舒服一点吧……❤️💦*”`,
                    `【意志对抗与服从顺从度】：彻底被驯服的摇尾母犬！对任何粗暴命令都奉若圣旨，主动跪爬奉承，挨罚时还会流着淫水哭喊求操。\n💭【${u}的实时内心感受】：“*汪呜♡……主人说什么我都会照做的🥵！请尽情命令、尽情责罚我吧💦❤️！*”`,
                    `【意志对抗与服从顺从度】：100%刻入骨髓的绝对奴性！完全放弃自主意志，哪怕是最残酷下流的指令也会条件反射般高翘肥臀全力执行！\n💭【${u}的实时内心感受】：“*我的身体和灵魂全都是主人的玩具♡🥵！请随便下达任何下流的命令来使用我吧💦❤️！*”`
                ]
            },
            pleas: {
                val: Number(v.精神与心理?.快感累积) || 0, rev: false,
                st: ["敏感初醒•微麻过电", "酥麻窜动•春水溢出", "快感攀升•趾尖蜷缩", "濒临绝顶•痉挛绷紧", "高潮过载•潮吹失神"],
                d: [
                    `【神经快感蓄积与敏感点实况】：当前核心敏感点为「${v.精神与心理扩展?.当前敏感点 || "胸前敏感蓓蕾与微微抽搐的小腹深处"}」。轻微的衣物摩擦或紧张刺激已在体内激起细微酥麻的电流，快感正处于初醒蓄积阶段。\n💭【${u}的实时内心感受】：“*呀……！为什么只是稍微动一下，那个敏感的地方就会像过电一样发麻啊❤️💦！*”`,
                    `【神经快感蓄积与敏感点实况】：酥麻滚烫的快感电流顺着脊椎窜向小腹与腿心！敏感带充血发烫，私处内壁在刺激下一缩一缩地溢出润滑爱液。\n💭【${u}的实时内心感受】：“*唔嗯……麻酥酥的快感越来越强了😳💦，腿根一直在发抖，快要站不稳了啦……🥵*”`,
                    `【神经快感蓄积与敏感点实况】：密集汹涌的快感浪潮不断拍打神经！每一次摩擦与触碰都令全身剧烈颤抖、脚趾紧紧蜷缩，爱液在腿心泥泞不堪。\n💭【${u}的实时内心感受】：“*啊啊、不行了，快感一波接一波冲上来，脚趾头都麻得蜷起来了🥵💦！*”`,
                    `【神经快感蓄积与敏感点实况】：快感已蓄积至决堤崩溃边缘！小腹与括约肌剧烈绷紧痉挛，如同通了高压电，只要再受一丝刺激就会引爆灭顶高潮。\n💭【${u}的实时内心感受】：“*要、要去了！小肚子里面绷得好紧，再碰一下真的要高潮炸开了啊啊🥵💦❤️！*”`,
                    `【神经快感蓄积与敏感点实况】：灭顶绝顶高潮连续过载爆发！狂暴的性快感烧穿大脑，双眼翻白、香舌吐出，滚烫潮吹与失禁液体从痉挛的穴口狂喷而出！\n💭【${u}的实时内心感受】：“*啊゛啊——去了去了♡！！脑子全炸开了，下面自己在狂喷水，太爽了要死掉了啊啊🥵💦❤️❤️！！*”`
                ]
            },
            sta: {
                val: Number(v.身体?.体力 ?? 100), rev: true,
                st: ["精力充沛•气息微促", "娇躯微软•香汗初沁", "香汗淋漓•双腿打颤", "濒临虚脱•瘫软无力", "彻底脱力•失神肉泥"],
                d: [
                    `【身体体力与肌肉耐受实况】：总体体力充沛（${Number(v.身体?.体力 ?? 100)}/100），仅因突如其来的身体重心变化、心理高度紧绷或轻微脱力而呼吸微促、膝盖发软，肌肤表面沁出微汗。\n💭【${u}的实时内心感受】：“*呼、呼……虽然体力还很足，但刚才那一通惊吓和身体异样感还是让我出了一层细汗，得赶紧稳住呼吸才行💦。*”`,
                    `【身体体力与肌肉耐受实况】：经历一番紧绷或折腾后，白腻肌肤沁出一层温热香汗，将贴身内衬浸得微湿，腰肢与双腿略微酸软发颤。\n💭【${u}的实时内心感受】：“*身上出汗了，贴身衣服黏在皮肤上好难受😳💦，腿也有点发酸使不上劲……*”`,
                    `【身体体力与肌肉耐受实况】：体力消耗过半，全身被黏腻香汗浸透，发丝凌乱黏在潮红脸颊与锁骨上，下身酸麻难以站稳。\n💭【${u}的实时内心感受】：“*呜……力气被抽走一大半了🥵💦，膝盖一直在打哆嗦，现在要是被人推一下肯定就倒了……*”`,
                    `【身体体力与肌肉耐受实况】：体力濒临枯竭！剧烈的感官冲击抽干了全身力气，双腿筛糠般打颤，只能软绵绵地瘫倒任由摆布。\n💭【${u}的实时内心感受】：“*哈啊……连抬起一根手指头的力气都没有了🥵，身体软得像水一样，根本反抗不了了……💦*”`,
                    `【身体体力与肌肉耐受实况】：全身彻底虚脱瘫软！像一滩烂泥般瘫在地上，意识模糊，唯有下身肉穴还在凭本能微微抽搐！\n💭【${u}的实时内心感受】：“*唔……已经彻底脱力休克了♡🥵……连眼皮都睁不开了……💦*”`
                ]
            }
        };
        const cfg = map[type] || map.cockLove;
        const t = tier5(cfg.val, cfg.rev);
        if (ovr && ovr.desc) {
            return {
                val: cfg.val,
                stage: ovr.stage || cfg.st[t],
                desc: `【当前数值：${cfg.val}/100 · 「${ovr.stage || cfg.st[t]}」】\n${ovr.desc}\n💭【${u}的实时内心感受】：“*${ovr.thought || "……"}*”`
            };
        }
        return {
            val: cfg.val,
            stage: cfg.st[t],
            desc: `【当前数值：${cfg.val}/100 · 第${t + 1}阶段「${cfg.st[t]}」】\n${cfg.d[t]}`
        };
    }

    function buildFetishRichDesc(rawItem, v, u) {
        const parts = String(rawItem).split("-");
        const name = (parts[0] || "未知癖").trim();
        const origin = (parts[1] || "身体被开发后形成").trim();
        const stage = (parts[2] || "第一阶段").trim();
        const valStr = (parts[3] || "20/100").trim();
        return `【性癖名称】：「${name}」（${stage} · ${valStr}）\n` +
               `【解锁成因】：${origin}\n` +
               `【🔞 发作实况】：由于【淫乱总账本】中的真实开发经历，这项「${name}」已彻底刻入${u}的身体条件反射中！一旦触发对应情境，理智根本无法压制肉体的发骚本能，呼吸瞬间粗重滚烫，敏感带充血硬挺，私处条件反射般涌出黏腻爱液渴求填满！\n` +
               `💭【${u}针对此性癖的羞耻心声】：“*呜哇……就因为身体被那样对待过，居然真的染上「${name}」这种下流毛病了💦！只要稍微回想一下，身体就自己发烫流水，再这样下去真的要彻底堕落了啊🥵❤️！*”`;
    }

    // 【V18 六大板块生成器】：储精与六孔合并 + 动态容量上限 + 每个按钮独立维度不重复 + 100%跨卡通用
    function buildFullFallbackCategories(u, c, v) {
        const mk = (rk, desc, revBar = false) => ({ rawKey: rk, desc, ...fmtKey(rk, revBar) });
        const live = extractDynamicContext(u, c);
        const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {}, prof = v.档案 || {}, rt = v.实况 || {}, ovr = v.按钮详情 || {};

        const cockM = getDynamicMetricDetail("cockLove", v, u, live);
        const lustM = getDynamicMetricDetail("lust", v, u, live);
        const corrM = getDynamicMetricDetail("corr", v, u, live);
        const shameM = getDynamicMetricDetail("shame", v, u, live);
        const obeyM = getDynamicMetricDetail("obey", v, u, live);
        const pleasM = getDynamicMetricDetail("pleas", v, u, live);
        const staM = getDynamicMetricDetail("sta", v, u, live);

        const vagCnt = Number(cnt.性交?.小穴) || 0, mouthCnt = Number(cnt.性交?.口) || 0, analCnt = Number(cnt.性交?.屁眼) || 0, titCnt = Number(cnt.性交?.乳穴) || 0, footCnt = Number(cnt.性交?.足腿) || 0;
        const creampie = Number(cnt.射精?.内射) || 0, swallowCnt = Number(cnt.精液摄入?.吞精次数) || 0, swallowMl = Number(cnt.精液摄入?.累计毫升) || 0, orgasmCnt = Number(cnt.高潮?.总数) || 0, leakCnt = Number(cnt.失控?.失禁) || 0, squirtCnt = Number(cnt.失控?.喷潮) || 0;

        // 四穴实时精液存量 & 依据主角自身开发度计算的动态容量上限！
        const mouthMl = Number(sp.口内毫升) || 0;
        const vagMl = Number(sp.小穴毫升) || 0;
        const wombMl = Number(sp.子宫毫升) || 0;
        const analMl = Number(sp.屁眼毫升) || 0;
        const totalMl = mouthMl + vagMl + wombMl + analMl;
        const caps = calcHoleCapacities(v);

        const corr = Number(v.核心数值?.淫乱恶堕) || 0, lust = Number(v.核心数值?.性欲程度) || 0, pleas = Number(v.精神与心理?.快感累积) || 0;
        const vagWidth = (1.5 + Math.min(3.8, vagCnt * 0.025)).toFixed(1);
        const vagClose = Math.max(15, Math.round(100 - vagCnt * 0.45 - ((wombMl + vagMl) > 0 ? 15 : 0)));
        const clitSize = (4.0 + Math.min(8.5, orgasmCnt * 0.06 + pleas * 0.03)).toFixed(1);
        const peeVal = Math.min(100, Math.round(15 + lust * 0.35 + pleas * 0.35 + leakCnt * 8));
        const wetLevel = Math.min(100, Math.round(12 + lust * 0.7 + pleas * 0.6 + (wombMl > 0 ? 25 : 0)));
        const fallVal = Number(v.精神与心理?.沦陷度) || 0, brkVal = Number(v.精神与心理?.人格崩解度) || 0;

        const fmtOvr = (key, defObj, defThought) => {
            if (ovr[key] && ovr[key].desc) {
                return `${ovr[key].desc}\n💭【${u}的实时内心感受】：“*${ovr[key].thought || defThought}*”`;
            }
            return `${defObj}\n💭【${u}的实时内心感受】：“*${defThought}*”`;
        };

        const curThought = ovr.内心独白?.thought || rt.内心独白 || live.thought || `我现在所处的状况也太让人心跳加速了吧……💦身体每一寸皮肤都敏感得不像话，千万要稳住不能露出破绽啊！🥵`;
        const curPose = rt.当前姿势 || live.pose || `${u}正处于当前场景中，努力稳住有些发软发颤的身形，呼吸微促。`;
        const curCloth = rt.当前衣装 || live.cloth || prop.穿戴中的标记物 || "当前贴身穿着的衣物与随身配饰";

        const unlockedFetishes = computeUnlockedFetishes(v);
        const fetishItems = unlockedFetishes.length > 0
            ? unlockedFetishes.map(s => {
                const parts = String(s).split("-");
                return mk(`🧬 ${parts[0] || s}：${parts[3] || "20/100"}「${parts[2] || "第一阶段"}」`, buildFetishRichDesc(s, v, u));
            })
            : [mk(`🔒 暂无性癖（纯洁白纸状态）：0/100「总账全0•未解锁」`,
                `【当前性癖解锁实况】：\n当前【淫乱总账本】中的所有性交、高潮、内射、吞精、自慰与露出次数全部为 0，因此尚未开启任何后天淫乱性癖！\n【自动开启规则】：当后续剧情中总账次数突破 0 时，将自动根据次数开启「挨操瘾」、「内射孕肚癖」、「深喉吞精癖」、「潮吹失禁癖」等简短下流性癖！\n💭【${u}的实时内心感受】：“*呼……还好我现在总账次数全都是 0，身体还是干干净净的纯洁状态，一个奇怪的下流性癖都还没有沾上💦！一定要守住底线啊！*”`)];

        return [
            // 1. 档案与肉体
            {
                title: "档案与肉体", icon: "👩", summary: `当前真实身份与外貌 · 体力${staM.val}% · 实时独白`,
                items: [
                    mk(`👩 身份背景与当前处境：${u}「${ovr.身份与背景?.stage || (corr >= 60 ? "深度沦陷" : "当前真实身份")}」`,
                        fmtOvr("身份与背景",
                            `【角色真实身份与当前处境（动态提取自本卡设定与正文）】：\n${prof.身份与背景 || live.identity}\n【当前场面与互动对象】：正与 ${c} 处于同一剧情场景中（当前日程/规矩：${v.调教进度?.规矩与日程 || "应对眼前的局面，掩饰自身异样"}）。`,
                            `这就是我现在真实所处的身份和处境啊💦……面对眼前的 ${c}，我可得小心应付，千万不能一步踏错陷入万劫不复的境地啊！🥵`)),
                    mk(`🌸 肉体外貌与体表痕迹：「${ovr.肉体外貌?.stage || (mark.体表痕迹 !== "无" ? mark.体表痕迹.slice(0, 14) : "真实外貌体态")}」`,
                        fmtOvr("肉体外貌",
                            `【全身外貌特征与体表痕迹实况（严格依据当前卡正文）】：\n${prof.肉体外貌实况 || live.bodyDesc}\n【当前体表痕迹与刻印】：体表痕迹：${mark.体表痕迹 || "无明显外伤痕迹"} ｜ 淫纹与刻印：${mark.淫纹与刻印 || "无"}。`,
                            `看着镜子里或者低头看到的这具身体，皮肤细腻敏感得让人心慌😳💦……稍微有点情绪波动就会在脸上和皮肤上留下一片羞红！`)),
                    mk(`💬 实时内心独白（最新心声）：「抓取自当前楼层独白」`,
                        `【第一人称实时内心独白】：\n“*${curThought}*”\n\n【当前身体核心敏感带】：\n${extPsy.当前敏感点 || "胸前蓓蕾与微微发酸抽搐的小腹深处"}。`),
                    mk(`🧍 当前姿势与肢体动作：「${curPose.slice(0, 18)}…」`,
                        fmtOvr("当前姿势",
                            `【当前身体姿态与动作定格】：\n${curPose}`,
                            `我现在这个姿势动作，要是落在有心人眼里，不知道会被脑补出多少羞人的画面呢……💦`)),
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
                    mk(`🧠 精神沦陷与崩解：${Math.max(fallVal, brkVal)}/100「沦陷${fallVal}%•崩解${brkVal}%•清醒${v.精神与心理?.意识清醒度 ?? 100}%」`,
                        fmtOvr("精神沦陷",
                            `【深层精神防线与催眠状态】：\n当前沦陷度：${fallVal}/100 ｜ 人格崩解度：${brkVal}/100 ｜ 意识清醒度：${v.精神与心理?.意识清醒度 ?? 100}/100 ｜ 催眠深度：${extPsy.催眠深度 || 0}/100。\n清醒的头脑正被迫全方位接收来自敏感肉体的每一丝羞耻与快感信号。`,
                            `脑子越清醒，身体传来的每一丝异样感就越清晰💦……千万不能让理智被身体的快感给吞噬掉啊！🥵`))
                ]
            },
            // 3. 下流性癖库
            {
                title: "下流性癖库", icon: "🧬",
                summary: unlockedFetishes.length > 0 ? `已随总账开启 ${unlockedFetishes.length} 项下流性癖` : `总账全0 · 暂无性癖`,
                items: fetishItems
            },
            // 4. 六孔与储精（彻底合并！每个孔有完全独立的解剖描写 + 依据主角开发度动态变化的储精容量上限进度条！）
            {
                title: "六孔与储精", icon: "🌸", summary: `总储精${totalMl}ml · 动态容量上限 · 六孔独立解剖`,
                items: [
                    mk(`👄 第一孔【骚口与胃袋】储精：${mouthMl}/${caps.mouthMax}ml「口交${mouthCnt}次•吞精${swallowCnt}次(${swallowMl}ml)」`,
                        fmtOvr("骚口实况",
                            `【口腔、香舌、咽喉解剖与胃袋储精实况】：\n当前口胃储精量：${mouthMl}ml / 当前动态上限 ${caps.mouthMax}ml（随深喉与吞精次数动态扩张）。\n${rt.骚口实况 || live.mouth || "唇瓣水润娇嫩，口腔内香舌粉嫩软滑，咽喉声带在紧张或受激时会溢出娇柔清冽的喘息啼鸣。"}\n${mouthMl > 0 ? `此时口腔与胃袋内正装满 ${mouthMl}ml 腥膻浓稠的雄性精液，唇齿舌根间弥漫着浓烈的精臭味！` : `当前口穴与胃袋内精液为 0ml，唇齿间仅有清甜津液，尚未被阳具射入白浊。`}`,
                            mouthMl > 0 ? `呕咕……嘴里和胃里全都是浓稠腥臭的精液，连呼吸都是男人的味道🥵💦！` : `我的嘴和嗓子现在还干干净净的，可不能随便发出奇怪的娇喘声让人起歹念啊💦！`)),
                    mk(`🍒 第二孔【丰乳与乳腺】开发：${ Math.min(100, titCnt * 15 + pleas * 2) }/100「乳交${titCnt}次•${pleas > 0 ? "蓓蕾充血发硬" : "软腻丰盈起伏"}」`,
                        fmtOvr("胸部实况",
                            `【双峰乳肉、乳晕与乳腺敏感解剖实况】：\n累计乳交夹击：${titCnt} 次。\n${rt.胸部实况 || live.chest || "胸前两团丰盈雪乳饱满软腻，随着呼吸与动作在空气中微微颠动，顶端两颗娇嫩蓓蕾对贴身衣物的摩擦敏感到极点，稍微刮蹭便会激起酥麻电流。"}`,
                            `胸前这两团软肉的存在感太强了❤️💦，尤其是最顶上的两颗小乳尖，稍微被布料蹭一下就会发麻发硬，太羞人了！`)),
                    mk(`🌺 第三孔【骚逼阴道腔】储精：${vagMl}/${caps.vagMax}ml「贯穿${vagCnt}次•孔径${vagWidth}cm•闭合${vagClose}%」`,
                        fmtOvr("小穴实况",
                            `【花唇、处女膜与阴道内壁解剖及储精实况】：\n当前阴道储精量：${vagMl}ml / 当前动态上限 ${caps.vagMax}ml（处女初始上限仅20ml，随贯穿次数动态扩张）。\n${rt.小穴实况 || live.vag || (vagCnt === 0 ? "未经人事的紧致处子幽谷，两瓣粉嫩花唇紧密贴合，处女膜完好无损，内壁层叠紧窄，仅因紧张羞耻而悄然泌出清亮春水。" : `已被贯穿开发 ${vagCnt} 次，花唇充血微张，肉壁柔嫩吸附。`)}\n${vagMl > 0 ? `此时阴道褶皱间正灌着 ${vagMl}ml 滚烫白浊，顺着腿根不断滴淌！` : `当前阴道腔内精液为 0ml。`}`,
                            vagMl > 0 ? `小穴里面被射满了滚烫的精液，走一步路都在往下漏水啊🥵💦！` : `两腿之间这条娇嫩紧窄的肉缝现在连手指头都没进去过，却因为紧张自己湿了，羞死人了啊😳💦！`)),
                    mk(`🫀 第四孔【子宫受孕腔】储精：${wombMl}/${caps.wombMax}ml「内射${creampie}次•受孕率${v.受孕与生理?.受孕概率 || (wombMl > 0 ? 35 : 0)}%」`,
                        fmtOvr("子宫实况",
                            `【子宫苗床、宫颈口解剖与宫腔储精实况】：\n当前子宫深腔储精量：${wombMl}ml / 当前动态上限 ${caps.wombMax}ml（未开发处子子宫上限仅15ml，随内射灌精动态撑大）。\n${rt.子宫实况 || live.womb || "深藏在下腹部最深处的子宫温暖而紧致，在外界刺激与荷尔蒙冲刷下，下腹深处泛起莫名的暖意与空虚酸软抽搐。"}\n${wombMl > 0 ? `此时 ${wombMl}ml 浓精已冲破宫口灌入子宫，将小腹撑得微隆坠胀！` : `当前子宫腔内精液为 0ml，尚处于纯洁未受精状态。`}`,
                            wombMl > 0 ? `子宫里面被灌得满满的，小肚子又沉又烫，真的要怀孕了啦🥵💦❤️！` : `小肚子最深处子宫的位置为什么会自己泛起暖意、还一抽一抽地发酸啊……💦🥵`)),
                    mk(`💧 第五孔【阴蒂与尿道口】失控度：${peeVal}/100「高潮${orgasmCnt}次•失禁${leakCnt}次•阴蒂${clitSize}mm」`,
                        fmtOvr("阴蒂尿道",
                            `【阴蒂肉珠充血度与尿道括约肌排泄控制实况】：\n当前阴蒂充血尺寸：${clitSize}mm ｜ 膀胱尿意与括约肌失控指数：${peeVal}/100（累计潮吹 ${squirtCnt} 次，漏尿失禁 ${leakCnt} 次）。\n${rt.阴蒂尿道实况 || "位于花唇顶端的阴蒂肉珠神经末梢高度集中，双腿并拢摩擦时便会传来直冲头顶的酸麻感；下方的细小尿道口在羞耻与快感双重刺激下括约肌阵阵发麻。"}`,
                            `两腿一夹紧就会磨到最上面那颗敏感得要命的小肉珠💦，连带着尿道口都一阵阵发酸发麻，千万别失控漏出来啊🥵！`)),
                    mk(`🕳️ 第六孔【屁眼直肠腔】储精：${analMl}/${caps.analMax}ml「肛交${analCnt}次•闭合度${Math.max(20, 100 - analCnt * 2)}%」`,
                        fmtOvr("屁眼实况",
                            `【饱满臀缝、后庭括约肌解剖与直肠储精实况】：\n当前后庭直肠储精量：${analMl}ml / 当前动态上限 ${caps.analMax}ml（未开发初始上限30ml，随肛交开发动态扩张）。\n${rt.屁眼实况 || live.anal || "饱满挺翘的臀缝深处，粉嫩菊蕾紧致闭合，括约肌肉褶干净无瑕，仅在身体紧绷喘息时微微收缩。"}\n${analMl > 0 ? `直肠内正灌着 ${analMl}ml 浓稠白浊，带来强烈的坠胀排泄感！` : `当前后庭内精液为 0ml。`}`,
                            analMl > 0 ? `连后面的屁眼都被灌进了这么多精液，肚子好胀好羞耻啊🥵💦！` : `腰臀的曲线被衬托得这么明显，连臀缝深处都因为紧张而绷紧了😳💦……`))
                ]
            },
            // 5. 体液与衣装
            {
                title: "体液与衣装", icon: "💦", summary: `爱液湿润${wetLevel}% · 贴身衣装与随身物`,
                items: [
                    mk(`💦 私处爱液分泌与体香：${wetLevel}/100「${wetLevel >= 50 ? "爱液泛滥湿透底裤" : "幽谷微潮•体香弥漫"}」`,
                        fmtOvr("爱液分泌",
                            `【雌穴爱液分泌量与体表气味实况】：\n当前私处湿润指数：${wetLevel}/100。\n敏感娇躯在紧张与摩擦刺激下，花唇内壁正自发分泌晶莹滑腻的爱液，混杂着身体散发的天然幽香与微汗热气。`,
                            `明明大脑里根本不想那样，可下面却还是自己分泌出滑腻腻的粘液沾湿了内衬，太不听话了啊💦🥵！`)),
                    mk(`👗 当前穿戴衣装与摩擦：「${curCloth.slice(0, 20)}…」`,
                        fmtOvr("当前衣装",
                            `【外装款式、贴身内衬摩擦与随身物品实况】：\n当前穿戴：${curCloth}。\n体内塞入道具：${prop.体内道具 || "无"} ｜ 束缚状态：${prop.束缚状态 || "无"}。\n贴身内衬随着每一次呼吸和动作不断在敏感乳尖与腿心花唇上摩擦。`,
                            `这身衣服贴在皮肤上又紧又滑，稍微动一下布料都在磨蹭最敏感的地方，简直像酷刑一样让人脸红心跳啊😳💦！`))
                ]
            },
            // 6. 淫乱总账本
            {
                title: "淫乱总账本", icon: "💎", summary: `小穴${vagCnt} · 口${mouthCnt} · 内射${creampie} · 高潮${orgasmCnt}`,
                items: [
                    mk(`💎 六孔性交破瓜总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${titCnt}／足${footCnt}」`,
                        `【各孔穴开发累计次数（决定性癖开启与储精上限扩张）】：\n骚逼贯穿：${vagCnt} 次 ｜ 骚口深喉：${mouthCnt} 次 ｜ 屁眼后庭：${analCnt} 次 ｜ 丰乳夹击：${titCnt} 次 ｜ 玉足摩擦：${footCnt} 次。\n💭【${u}的实时内心感受】：“*${(vagCnt + mouthCnt + analCnt) === 0 ? `目前所有性交次数全都是 0，身体还完完整整地守着纯洁清白💦！` : `身体已经被开发过这么多次，彻底记住那种被填满的滋味了呀🥵💦！`}*”`),
                    mk(`💎 高潮泄身与失禁总账：「高潮${orgasmCnt}次／喷潮${squirtCnt}次／失禁${leakCnt}次／自慰${cnt.自慰 || 0}次」`,
                        `【高潮与身体失控累计记录】：\n累计绝顶高潮：${orgasmCnt} 次 ｜ 潮吹喷水：${squirtCnt} 次 ｜ 羞耻漏尿失禁：${leakCnt} 次 ｜ 私下自慰：${cnt.自慰 || 0} 次。\n💭【${u}的实时内心感受】：“*这具身体的敏感度高得吓人，要是真被抓着弱点欺负，怕不是会丢脸地高潮出来啊💦🥵！*”`),
                    mk(`💎 射精承受与吞精总账：「内射${creampie}次／颜射${cnt.射精?.颜射体外 || 0}次／吞精${swallowCnt}次(${swallowMl}ml)」`,
                        `【雄性精液承受累计记录】：\n子宫内射：${creampie} 次 ｜ 颜射与体外射精：${cnt.射精?.颜射体外 || 0} 次 ｜ 口穴吞精：${swallowCnt} 次（累计吞咽 ${swallowMl}ml）。\n💭【${u}的实时内心感受】：“*${creampie + swallowCnt === 0 ? `到现在为止还没有让男人的脏东西射进身体里过，一定要守住底线😳💦！` : `身体已经被男人的浓精浇灌过这么多次了啊🥵💦……`}*”`),
                    mk(`💎 露出视奸与风月卖身：「露出${cnt.暴露?.露出 || 0}次／围观${cnt.暴露?.被围观人次 || 0}人／接客${cnt.交易?.接客卖身 || 0}次」`,
                        `【公开羞辱与风月交易累计记录】：\n当众露出：${cnt.暴露?.露出 || 0} 次 ｜ 被围观视奸：${cnt.暴露?.被围观人次 || 0} 人次 ｜ 接客卖身：${cnt.交易?.接客卖身 || 0} 次。\n💭【${u}的实时内心感受】：“*绝对不能沦落到在别人面前敞开身体露出的地步啊💦！*”`)
                ]
            }
        ];
    }

    function getFallbackData() {
        const ctx = safeCtx();
        const u = ctx?.name1 || "主角", c = ctx?.name2 || "当前角色";
        return {
            charName: u,
            floorId: `${c} · 实时`,
            categories: buildFullFallbackCategories(u, c, curVars)
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

    // 【核心升级】：API 全量 JSON 实时重绘提示词！要求模型根据当前角色卡设定与最新楼层，直接输出包含全部数值与16个按钮专属详情+心声的 JSON！
    function buildFullJsonApiPrompt(u, c, rawText) {
        const ctx = safeCtx();
        const charDesc = (ctx?.characters?.[ctx?.characterId]?.description || "").slice(0, 600);
        const personaDesc = (ctx?.power_user?.persona_description || "").slice(0, 400);

        return `你是SillyTavern状态栏全量实时重绘引擎(V18)。请严格根据下方【当前角色卡与主角设定】以及【最新故事楼层正文】，全面更新主角（${u}）的所有状态数值与每一个按钮的详细色情重口解剖描述及第一人称内心独白！
⚠️ 严禁套用任何与当前故事无关的其他角色设定！每个按钮的描述必须完全独立（口只写口舌声带、胸只写乳肉乳头、小穴只写花唇阴道、子宫只写宫口小腹），绝不能互相抄袭重复！

【当前角色卡与主角设定】：
主角名：${u} ｜ 互动角色：${c}
主角设定：${personaDesc || "见正文"}
角色卡背景：${charDesc || "见正文"}

【最新故事楼层正文】：
${rawText.slice(-3800)}

请输出且仅输出一个合法的 JSON 对象（不要用 markdown 代码块包裹，直接以 { 开头，以 } 结尾），结构严格如下：
{
  "体力": 95,
  "对肉棒好感度": 0, "性欲程度": 5, "淫乱恶堕": 0,
  "羞耻度": 100, "服从度": 0, "沦陷度": 0, "快感累积": 5, "意识清醒度": 100, "人格崩解度": 0,
  "口内毫升": 0, "小穴毫升": 0, "子宫毫升": 0, "屁眼毫升": 0,
  "计数": { "口": 0, "小穴": 0, "屁眼": 0, "乳穴": 0, "足腿": 0, "高潮": 0, "内射": 0, "吞精次数": 0, "吞精毫升": 0, "自慰": 0, "失禁": 0, "喷潮": 0, "露出": 0, "接客": 0 },
  "当前姿势": "一句话概括当前姿势",
  "当前衣装": "一句话概括当前穿戴衣装与贴身内衬",
  "体表痕迹": "面颊绯红、微汗等",
  "当前敏感点": "当前最敏感的部位",
  "规矩与日程": "当前心理目标或规矩",
  "按钮详情": {
    "身份与背景": { "stage": "4字状态概括", "desc": "100字以上：主角当前真实身份、背景与眼前处境详写", "thought": "60字以上带❤️💦🥵的第一人称实时心声" },
    "肉体外貌": { "stage": "4字外貌概括", "desc": "100字以上：严格依据正文的主角容颜、身材曲线与肌肤敏感度详写", "thought": "60字以上第一人称对自身肉体的羞耻或色情心声" },
    "内心独白": { "thought": "120字以上：主角当下最核心的第一人称带❤️💦🥵心理独白" },
    "当前姿势": { "desc": "80字以上：当前肢体动作、重心与身体曲线详写", "thought": "50字以上第一人称对当前姿势的羞耻心声" },
    "cockLove": { "stage": "4字阶段", "desc": "80字以上：对男性肉棒的真实生理与心理反应", "thought": "50字以上第一人称心声" },
    "lust": { "stage": "4字阶段", "desc": "80字以上：体内情欲燥热与发情反应", "thought": "50字以上第一人称心声" },
    "corr": { "stage": "4字阶段", "desc": "80字以上：道德矜持防线与恶堕进度", "thought": "50字以上第一人称心声" },
    "shame": { "stage": "4字阶段", "desc": "80字以上：羞耻脸红反应与快感反噬", "thought": "50字以上第一人称心声" },
    "obey": { "stage": "4字阶段", "desc": "80字以上：表面气场与内心顺从屈服度", "thought": "50字以上第一人称心声" },
    "pleas": { "stage": "4字阶段", "desc": "80字以上：敏感带过电酥麻与快感蓄积", "thought": "50字以上第一人称心声" },
    "骚口实况": { "desc": "90字以上：仅限唇瓣、香舌、津液、嗓音喘息与口胃储精的专属重口解剖描写", "thought": "50字以上针对嘴唇嗓音或口交的第一人称心声" },
    "胸部实况": { "desc": "90字以上：仅限双乳大小、乳肉颠簸、乳晕与乳头摩擦硬挺的专属重口解剖描写", "thought": "50字以上针对胸乳敏感的第一人称心声" },
    "小穴实况": { "desc": "90字以上：仅限两腿间花唇、处女膜/闭合度、阴道内壁蠕动与储精的专属重口解剖描写", "thought": "50字以上针对私处小穴的第一人称心声" },
    "子宫实况": { "desc": "90字以上：仅限小腹深处、子宫苗床、宫颈口抽搐与宫腔储精受孕的专属重口描写", "thought": "50字以上针对子宫小腹的第一人称心声" },
    "阴蒂尿道": { "desc": "90字以上：仅限阴蒂肉珠充血发麻、尿道口括约肌与排尿羞耻感的专属重口描写", "thought": "50字以上针对阴蒂与排尿羞耻的第一人称心声" },
    "屁眼实况": { "desc": "90字以上：仅限蜜桃臀缝、后庭菊穴收缩与直肠储精的专属重口描写", "thought": "50字以上针对臀部与后庭的第一人称心声" },
    "爱液分泌": { "desc": "80字以上：私处爱液分泌湿润度与全身幽香体味描写", "thought": "50字以上第一人称心声" },
    "当前衣装": { "desc": "80字以上：当前所穿外装、贴身内衬摩擦敏感带与随身物品详写", "thought": "50字以上第一人称心声" }
  }
}`;
    }

    // 解析 API 返回的 JSON 或 _.set 并立即全量刷新状态栏并持久化缓存
    function applyApiFullResponse(replyText, targetMsg, fid, sourceLabel = "API") {
        if (!replyText) return false;
        let cleaned = replyText.replace(/<think[\s\S]*?<\/think>/gi, "").replace(/```json|```/gi, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[0]);
                const v = curVars;
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
                    if (typeof c.吞精次数 === "number") v.计数.精液摄入.吞精次数 = c.吞精次数;
                    if (typeof c.吞精毫升 === "number") v.计数.精液摄入.累计毫升 = c.吞精毫升;
                    if (typeof c.自慰 === "number") v.计数.自慰 = c.自慰;
                    if (typeof c.失禁 === "number") v.计数.失控.失禁 = c.失禁;
                    if (typeof c.喷潮 === "number") v.计数.失控.喷潮 = c.喷潮;
                    if (typeof c.露出 === "number") v.计数.暴露.露出 = c.露出;
                    if (typeof c.接客 === "number") v.计数.交易.接客卖身 = c.接客;
                }

                if (data.当前姿势) v.实况.当前姿势 = data.当前姿势;
                if (data.当前衣装) v.实况.当前衣装 = data.当前衣装;
                if (data.体表痕迹) v.痕迹与标记.体表痕迹 = data.体表痕迹;
                if (data.当前敏感点) v.精神与心理扩展.当前敏感点 = data.当前敏感点;
                if (data.规矩与日程) v.调教进度.规矩与日程 = data.规矩与日程;

                if (data.按钮详情 && typeof data.按钮详情 === "object") {
                    v.按钮详情 = { ...v.按钮详情, ...data.按钮详情 };
                }

                saveChatCache(v);
                latestStatus = getFallbackData();
                renderBody();
                showToast(`✅ ${sourceLabel}全量重绘成功！已根据当前楼层实时改写全部按钮与心声！`, "success", 4000);
                return true;
            } catch (e) {
                console.warn("[V18 JSON Parse Fallback]:", e);
            }
        }
        if (cleaned.includes("_.set(")) {
            applySetStatements(cleaned, curVars);
            saveChatCache(curVars);
            latestStatus = getFallbackData();
            renderBody();
            showToast(`✅ ${sourceLabel}变量同步完成！`, "success", 3000);
            return true;
        }
        return false;
    }

    async function triggerMainApiForceUpdate(btnEl = null) {
        // 如果用户配置了副API，优先用副API高速并发直连，否则调用主API
        if (userSettings.apiUrl && userSettings.apiKey) {
            await triggerExternalApiUpdate(null, btnEl);
            return;
        }
        const ctx = safeCtx(), chat = ctx?.chat || [];
        if (!chat.length) { showToast("⚠️ 当前没有任何聊天记录可供刷新！", "error"); return; }
        const fid = chat.length - 1, targetMsg = chat[fid], rawText = targetMsg?.mes || "";
        const u = ctx?.name1 || "主角", c = ctx?.name2 || "角色";
        const oldTxt = btnEl ? btnEl.textContent : "";
        if (btnEl) btnEl.textContent = "⏳ 全量重绘中...";
        showToast("⏳ 正在调用主 API 结合当前卡与最新楼层全量重绘所有按钮内容...", "info", 6000);
        try {
            const prompt = buildFullJsonApiPrompt(u, c, rawText);
            let reply = "";
            const quietFn = generateQuietPrompt || ctx?.generateQuietPrompt || window.generateQuietPrompt;
            if (typeof quietFn === "function") {
                try { reply = await quietFn(prompt, false, false); } catch (e1) { reply = await quietFn({ quietPrompt: prompt }); }
            } else if (typeof window.TavernHelper?.generateRaw === "function") {
                reply = await window.TavernHelper.generateRaw({ ordered_prompts: [{ role: "user", content: prompt }] });
            } else {
                throw new Error("未检测到主API静默接口，请在 ⚙️设置 中配置副API！");
            }
            const ok = applyApiFullResponse(reply, targetMsg, fid, "主API");
            if (btnEl) btnEl.textContent = ok ? "✅ 重绘完成" : "⚠️ 格式异常";
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
        const { chatUrl } = getNormalizedEndpoints(userSettings.apiUrl);
        if (!chatUrl || !userSettings.apiKey) {
            if (manualFloorId !== null || statusBtn) showToast("⚠️ 请先在 ⚙️设置 中填写副 API 地址和 Key！", "error");
            return;
        }
        const ctx = safeCtx(), chat = ctx?.chat || [];
        if (!chat.length) return;
        const fid = manualFloorId !== null ? manualFloorId : (chat.length - 1);
        const targetMsg = chat[fid], rawText = targetMsg?.mes || "";
        if (!rawText) return;
        const btn = statusBtn || document.getElementById("st-v12-api-test"), oldTxt = btn ? btn.textContent : "";
        if (btn) btn.textContent = "⏳ 副API重绘中...";
        showToast("⏳ 正在通过副 API 实时重绘当前楼层全部状态与18个按钮详情...", "info", 4500);
        try {
            const u = ctx?.name1 || "主角", c = ctx?.name2 || "角色";
            const prompt = buildFullJsonApiPrompt(u, c, rawText);
            const res = await fetch(chatUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userSettings.apiKey}` },
                body: JSON.stringify({
                    model: userSettings.apiModel || "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "你是一个只输出合法 JSON 对象的色情重口状态栏实时重绘引擎。不要输出任何 markdown 标记或多余解释。" },
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
            if (btn) btn.textContent = ok ? "✅ 副API重绘成功" : "⚠️ 返回格式非JSON";
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
            .replace(/(💭【[^】]+】：)([\s\S]*)$/, `<div style="margin-top:10px;padding:10px 12px;background:rgba(243,139,168,0.15);border-left:3.5px solid #f38ba8;border-radius:8px;color:#ffd6e7;font-style:italic;line-height:1.75;"><b style="color:#f9e2af;font-style:normal;display:block;margin-bottom:4px;">$1</b>$2</div>`);
        document.getElementById("st-v6-det-desc").innerHTML = formattedDesc;
        document.getElementById("st-v6-det-page").textContent = `${cat.icon} ${cat.title} (${itemIdx + 1}/${cat.items.length})`;
        ov.style.display = "flex";
    }

    function renderSettingsView(body) {
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        const box = document.createElement("div");
        box.style.cssText = "display:flex;flex-direction:column;gap:12px;font-size:12.5px;";
        const hasModels = Array.isArray(userSettings.modelList) && userSettings.modelList.length > 0;
        box.innerHTML = `
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🔌 1. API 全量实时重绘设置（强烈推荐开启）</div>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input id="st-api-chk" type="checkbox" ${userSettings.apiSyncEnabled ? "checked" : ""} style="accent-color:${tc.prim};"><span><b>每回合结束后自动调用副 API 根据当前楼层全量改写所有按钮</b></span></label>
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
            userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
            userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
            userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
            userSettings.apiModel = modInp.value.trim();
            saveSettings(); inSettings = false; renderBody();
            showToast("💾 设置已保存！", "success", 2000);
        };
        box.querySelector("#st-v12-api-test").onclick = () => {
            userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
            userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
            userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
            userSettings.apiModel = modInp.value.trim();
            saveSettings(); triggerExternalApiUpdate();
        };
    }

    // 【核心视觉升级】：左侧竖排大类导航栏 + 右侧竖排卡片列表！
    function renderBody() {
        applyThemeAndSize();
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        const d = (latestStatus && latestStatus.categories?.length) ? latestStatus : getFallbackData();
        const setTxt = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
        setTxt("st-v5-btn-txt", `👑 ${d.charName || "主角"} · 状态栏`);
        setTxt("st-v5-title", `${d.charName || "主角"} (${typeof d.floorId === "number" ? "#" + d.floorId + "层" : d.floorId})`);

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

        // 首页大类总览：全部采用竖排全宽卡片（不再挤成两列！）
        if (activeCat === null || !d.categories[activeCat]) {
            const vagCnt = Number(curVars.计数?.性交?.小穴) || 0;
            const shameVal = Number(curVars.精神与心理?.羞耻度 ?? 100);
            const pleasVal = Number(curVars.精神与心理?.快感累积) || 0;
            const badgeBanner = document.createElement("div");
            badgeBanner.style.cssText = `margin-bottom:10px;padding:9px 12px;background:rgba(0,0,0,0.45);border:${tc.cardBorder};border-radius:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;font-size:12px;`;
            badgeBanner.innerHTML = `
                <span style="color:#f9e2af;font-weight:bold;">${vagCnt === 0 ? "🌸 处子未破瓜" : `🌺 已破瓜 (${vagCnt}次)`}</span>
                <span style="color:${tc.prim};">😳 羞耻: <b>${shameVal}%</b></span>
                <span style="color:${tc.sec};">💓 快感: <b>${pleasVal}%</b></span>`;
            body.appendChild(badgeBanner);

            const vList = document.createElement("div");
            vList.style.cssText = "display:flex;flex-direction:column;gap:9px;";
            d.categories.forEach((cat, idx) => {
                const b = document.createElement("div");
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
                b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-radius:12px;padding:11px 13px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 12px rgba(0,0,0,0.45);`;
                const parts = (it.desc || "").split("💭");
                const objPreview = parts[0].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 46) + "…";
                const thoughtPreview = parts[1] ? "💭 " + parts[1].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 42) + "…" : "";
                b.innerHTML = `${it.keyHTML}${it.barHTML || ""}
                    <div style="font-size:11.5px;color:${tc.sub};margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${objPreview}</div>
                    ${thoughtPreview ? `<div style="font-size:11.5px;color:#ffd6e7;font-style:italic;background:rgba(243,139,168,0.12);padding:4px 8px;border-radius:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${thoughtPreview}</div>` : ""}
                    <div style="display:flex;justify-content:flex-end;margin-top:2px;"><span style="color:${tc.prim};font-size:11px;font-weight:bold;">点开查看完整解剖与心声 ▸</span></div>`;
                b.onclick = (e) => { e.stopPropagation(); showDetailPopup(idx); };
                list.appendChild(b);
            });
            body.appendChild(list);
        }
    }

    function mountExtensionSettingsMenu() {
        const container = document.getElementById("extensions_settings") || document.getElementById("extensions_settings2");
        if (!container || document.getElementById("st-v18-ext-drawer")) return;
        document.getElementById("st-v17-ext-drawer")?.remove();
        document.getElementById("st-v16-ext-drawer")?.remove();

        const drawer = document.createElement("div");
        drawer.id = "st-v18-ext-drawer";
        drawer.style.cssText = "margin-bottom:8px;border:1px solid rgba(243,139,168,0.35);border-radius:8px;overflow:hidden;background:rgba(0,0,0,0.2);";
        drawer.innerHTML = `
            <div id="st-v18-ext-header" style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;cursor:pointer;user-select:none;background:rgba(243,139,168,0.12);">
                <b style="color:#f5c2e7;font-size:13.5px;">📊 终极重口状态栏引擎 V18 (跨卡全动态版)</b>
                <span id="st-v18-ext-arrow" style="color:#f38ba8;font-weight:bold;">▼ 展开设置</span>
            </div>
            <div id="st-v18-ext-content" style="display:none;padding:12px;font-size:13px;border-top:1px solid rgba(255,255,255,0.1);">
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;">
                    <input id="st-v18-ext-enable" type="checkbox" ${userSettings.enabled ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span><b>启用状态栏悬浮窗与后台变量注入</b>（取消勾选即可关闭隐藏）</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;cursor:pointer;">
                    <input id="st-v18-ext-hide" type="checkbox" ${userSettings.hideRawBlock ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span>自动折叠隐藏聊天正文尾部的原始【状态栏】与代码文本</span>
                </label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button id="st-v18-ext-open" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">👑 呼出状态栏面板</button>
                    <button id="st-v18-ext-sync" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">⚡ API全量重绘本层</button>
                </div>
            </div>`;
        container.appendChild(drawer);

        const header = drawer.querySelector("#st-v18-ext-header");
        const content = drawer.querySelector("#st-v18-ext-content");
        const arrow = drawer.querySelector("#st-v18-ext-arrow");

        header.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = content.style.display === "none";
            content.style.display = isHidden ? "block" : "none";
            arrow.textContent = isHidden ? "▲ 收起设置" : "▼ 展开设置";
        });

        drawer.querySelector("#st-v18-ext-enable").addEventListener("change", (e) => {
            userSettings.enabled = e.target.checked;
            saveSettings(); applyThemeAndSize();
            showToast(userSettings.enabled ? "✅ 状态栏插件已开启！" : "⏸️ 状态栏插件已隐藏关闭！", "info", 2000);
        });
        drawer.querySelector("#st-v18-ext-hide").addEventListener("change", (e) => {
            userSettings.hideRawBlock = e.target.checked;
            saveSettings(); cleanAll(true);
        });
        drawer.querySelector("#st-v18-ext-open").addEventListener("click", (e) => {
            e.stopPropagation();
            userSettings.enabled = true;
            const chk = document.getElementById("st-v18-ext-enable");
            if (chk) chk.checked = true;
            saveSettings(); applyThemeAndSize();
            const panel = document.getElementById("st-v5-panel");
            if (panel) { panel.style.display = "flex"; renderBody(); }
        });
        drawer.querySelector("#st-v18-ext-sync").addEventListener("click", (e) => {
            e.stopPropagation();
            triggerMainApiForceUpdate();
        });
    }

    function mountUI() {
        loadSettings();
        document.getElementById("st-v5-root")?.remove();
        const root = document.createElement("div");
        root.id = "st-v5-root";
        root.style.cssText = `position:fixed;top:65px;right:20px;z-index:2147483647;font-family:'Microsoft YaHei',sans-serif;display:${userSettings.enabled ? "block" : "none"};`;
        // 主体采用左右分栏：左侧为竖排大类导航栏 (#st-v5-tabs)，右侧为内容展示区 (#st-v5-body)
        root.innerHTML = `
        <div style="display:flex;justify-content:flex-end;align-items:center;">
            <button id="st-v5-toggle" type="button" style="background:linear-gradient(135deg,#f38ba8,#cba6f7);color:#11111b;border:none;font-weight:900;font-size:14px;padding:8px 18px;border-radius:99px;cursor:grab;user-select:none;touch-action:none;box-shadow:0 6px 20px rgba(243,139,168,0.6);">
                <span id="st-v5-btn-txt">👑 主角 · 状态栏</span>
            </button>
        </div>
        <div id="st-v5-panel" style="display:none;position:relative;margin-top:8px;width:${userSettings.width}px;height:${userSettings.height}px;min-width:340px;min-height:360px;max-width:96vw;max-height:88vh;background:linear-gradient(165deg,#181424,#1e192b);border:2px solid #f38ba8;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.92);color:#ede6f2;flex-direction:column;overflow:hidden;">
            <div id="st-v5-header" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.12);cursor:grab;user-select:none;touch-action:none;flex-shrink:0;gap:6px;">
                <b id="st-v5-title" style="color:#f5c2e7;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">主角档案</b>
                <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
                    <button id="st-v5-refresh-btn" type="button" title="调用API根据当前角色卡与最新楼层实时改写全部按钮描述与心声" style="background:rgba(166,227,161,0.22);color:#a6e3a1;border:1px solid rgba(166,227,161,0.55);border-radius:8px;padding:3px 9px;cursor:pointer;font-size:11.5px;font-weight:bold;">⚡ API全量重绘</button>
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
                if (ps.length > 1 && !Object.prototype.hasOwnProperty.call(targetVars, ps[0])) ps.shift();

                let cur = targetVars;
                for (let j = 0; j < ps.length - 1; j++) {
                    if (cur[ps[j]] === undefined || typeof cur[ps[j]] !== "object") cur[ps[j]] = {};
                    cur = cur[ps[j]];
                }
                if (cur && ps.length > 0) cur[ps[ps.length - 1]] = val;
            } catch (e) {}
        }
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

    function recalc() {
        try {
            mountExtensionSettingsMenu();
            const ctx = safeCtx(), fv = getInitialVars();
            // 读取当前角色卡专属缓存（换卡时因为 getChatStoreKey 改变，会自动切换为新卡的干净状态！）
            const cached = loadChatCache();
            if (cached && cached.按钮详情) fv.按钮详情 = cached.按钮详情;

            const chat = ctx?.chat || [];
            for (let i = 0; i < chat.length; i++) {
                const t = chat[i]?.mes || "";
                if (t.includes("_.set(")) applySetStatements(t, fv);
            }
            curVars = fv;
            latestStatus = getFallbackData();
            if (chat.length > 0) latestStatus.floorId = chat.length - 1;

            const u = ctx?.name1 || "主角";
            if (typeof setExtensionPrompt === "function") {
                setExtensionPrompt(EXT_ID, userSettings.enabled ? buildFullSystemPrompt(u, fv) : "", extension_prompt_types?.IN_CHAT ?? 1, 0);
            }
            renderBody();
        } catch (e) { console.error("[my-status-bar V18] recalc error:", e); renderBody(); }
    }

    mountUI();
    document.addEventListener("click", e => {
        const trg = e.target.closest(".st-ext-inline-trigger");
        if (trg) {
            recalc();
            activeCat = null; inSettings = false; renderBody();
            document.getElementById("st-v5-panel").style.display = "flex";
        }
    });

    if (eventSource && event_types) {
        eventSource.on(event_types.CHAT_CHANGED, () => {
            activeCat = null; latestStatus = null;
            setTimeout(() => { recalc(); cleanAll(false); }, 200);
        });
        eventSource.on(event_types.MESSAGE_RECEIVED, i => setTimeout(() => {
            recalc(); cleanDOM(i, true);
            if (userSettings.apiSyncEnabled) triggerExternalApiUpdate(i);
            else showToast("📊 状态栏已根据最新楼层同步！可点⚡API全量重绘", "info", 2500);
        }, 180));
        eventSource.on(event_types.MESSAGE_UPDATED, i => setTimeout(() => { recalc(); cleanDOM(i, true); }, 120));
        eventSource.on(event_types.MESSAGE_DELETED, () => setTimeout(() => { recalc(); scheduleCleanAll(); }, 150));
        eventSource.on(event_types.GENERATION_STARTED, () => recalc());
    }

    const chatEl = document.getElementById("chat");
    if (chatEl) {
        const obs = new MutationObserver(() => { if (!isCleaningDOM) scheduleCleanAll(); });
        obs.observe(chatEl, { childList: true, subtree: false });
    }
    setTimeout(() => { recalc(); cleanAll(false); }, 350);
})();
