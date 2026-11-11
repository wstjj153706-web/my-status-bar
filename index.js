// == 状态栏与楼层变量引擎 V17 (修复扩展菜单点击 + 严格贴合正文外貌 + 总账0次零性癖/短名下流性癖自动解锁 + 四穴独立储精进度条) ==
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
        try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, "📊 状态栏引擎 V17"); } catch (e) {}
        let box = document.getElementById("st-v17-toast");
        if (!box) {
            box = document.createElement("div"); box.id = "st-v17-toast";
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
        box.textContent = msg;
        box.style.display = "flex";
        clearTimeout(box._timer);
        box._timer = setTimeout(() => { box.style.display = "none"; }, duration);
    }

    // 5套深度差异化重口主题
    const THEMES = {
        "魅魔粉 (默认)": {
            bg: "radial-gradient(circle at top right, #2a1b3d, #141020 72%)",
            border: "2px solid #f38ba8", radius: "18px", shadow: "0 16px 48px rgba(243,139,168,0.38)",
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
            border: "2px solid #a5f3fc", radius: "22px", shadow: "0 16px 50px rgba(165,243,252,0.32)",
            prim: "#67e8f9", sec: "#c084fc", text: "#f8fafc", sub: "#94a3b8",
            card: "linear-gradient(155deg, rgba(30,41,59,0.92), rgba(15,23,42,0.96))",
            cardBorder: "1px dashed rgba(165,243,252,0.4)", hi: "rgba(103,232,249,0.22)"
        },
        "赛博调教 (电击项圈)": {
            bg: "linear-gradient(160deg, #050b14, #0d1b2a)",
            border: "2px solid #00f5d4", radius: "4px", shadow: "0 0 35px rgba(0,245,212,0.45), inset 0 0 15px rgba(241,91,181,0.2)",
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
        width: 480,
        height: 650,
        fontScale: 100,
        apiSyncEnabled: false,
        apiUrl: "",
        apiKey: "",
        apiModel: "",
        modelList: []
    };

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v17_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉 (默认)";
        } catch (e) {}
    }
    function saveSettings() {
        try { localStorage.setItem(EXT_ID + "_v17_cfg", JSON.stringify(userSettings)); } catch (e) {}
    }

    // 0 -> 100% 动态颜色深化计算器（数值越高颜色越深邃淫靡）
    function getProgBarStyle(pct, reverse = false) {
        const p = Math.max(0, Math.min(100, Number(pct) || 0));
        const val = reverse ? (100 - p) : p;
        let grad = "", glow = "", labelColor = "";
        if (val === 0) {
            grad = "linear-gradient(90deg, #64748b, #94a3b8)";
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

    // 初始变量库：
    // 1. 不再编造 36D/165cm，完全根据当前正文真实情况生成！
    // 2. 初始总账全为 0，因此 `性癖.条目` 默认为空数组 `[]`（根据总账次数动态解锁！）
    // 3. 精液存量拆分为 四穴独立存量（口胃、阴道、子宫、后庭）
    function getInitialVars() {
        return {
            档案: {
                身份与背景: "",
                自我介绍: "",
                肉体外貌实况: "",
                社会风评: ""
            },
            核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
            精神与心理: { 羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0, 意识清醒度: 100, 人格崩解度: 0 },
            身体: { 体力: 100 },
            性癖: {
                条目: [] // 总账全0时默认无性癖！一旦总账破零或模型写入，自动解锁简短下流性癖
            },
            实况: {
                内心独白: "", 当前姿势: "", 当前衣装: "", 面容表情: "",
                胸部实况: "", 小穴实况: "", 子宫实况: "", 屁眼实况: "", 玉足实况: ""
            },
            计数: {
                性交: { 口: 0, 小穴: 0, 屁眼: 0, 乳穴: 0, 足腿: 0, 其他部位: 0, 兽交: 0 },
                高潮: { 总数: 0, 强制: 0, 公开场合: 0, 寸止: 0 },
                射精: { 内射: 0, 颜射体外: 0 },
                精液摄入: { 吞精次数: 0, 累计毫升: 0 },
                自慰: 0,
                失控: { 失禁: 0, 喷潮: 0 },
                暴露: { 露出: 0, 被围观人次: 0, 被拍摄: 0 },
                交易: { 接客卖身: 0, 被外借共享: 0 },
                今日KPI: { 已完成: 0, 配额: 2 }
            },
            受孕与生理: { 子宫怀孕: 0, 怀孕进度: 0, 受孕概率: 0, 发情中: 0 },
            体内精液存量: { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
            痕迹与标记: { 体表痕迹: "面颊绯红、耳尖羞红、裹胸下肌肤微汗", 淫纹与刻印: "无" },
            体内道具与权限: {
                体内道具: "无", 束缚状态: "无",
                穿戴中的标记物: "月白色镶银丝云纹束腰战袍裙、青白双色丝质裹胸、修身素色衬裤、精工麂皮小战靴；耗尽微光的现实修改笔已塞入长袍内袋"
            },
            调教进度: { 规矩与日程: "维持纳兰嫣然清冷高傲人设，掩饰冒牌身份" },
            精神与心理扩展: { 当前敏感点: "下腹部深处因紧张泛起莫名暖意与空虚抽搐感", 催眠深度: 0 },
            按钮详情: {}
        };
    }

    let curVars = getInitialVars(), latestStatus = null, activeCat = null, curDetailIdx = 0, inSettings = false;
    let isCleaningDOM = false, cleanTimer = null;

    const ICONS = {
        "档案与肉体": "👩",
        "恶堕与精神": "🔥",
        "下流性癖库": "🧬",
        "六孔解剖台": "🌸",
        "储精与体液": "💦",
        "淫乱总账本": "💎"
    };
    const SHORT_NAMES = {
        "档案与肉体": "档案",
        "恶堕与精神": "精神",
        "下流性癖库": "性癖",
        "六孔解剖台": "六孔",
        "储精与体液": "储精",
        "淫乱总账本": "总账"
    };

    function varsToYaml(userName, varsObj) {
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
        return `${userName}:\n` + serialize(varsObj, 2);
    }

    // 【核心引擎】：依据总账次数自动计算解锁的简短下流性癖！
    // 规则：如果总账全为 0 且模型没有主动写入已生效性癖，则返回空数组（显示“无性癖·纯洁处子待开发”）
    function computeUnlockedFetishes(v) {
        const c = v.计数 || {};
        const vag = Number(c.性交?.小穴) || 0;
        const mouth = Number(c.性交?.口) || 0;
        const anal = Number(c.性交?.屁眼) || 0;
        const tit = Number(c.性交?.乳穴) || 0;
        const foot = Number(c.性交?.足腿) || 0;
        const creampie = Number(c.射精?.内射) || 0;
        const swallow = Number(c.精液摄入?.吞精次数) || 0;
        const orgasm = Number(c.高潮?.总数) || 0;
        const squirt = Number(c.失控?.喷潮) || 0;
        const leak = Number(c.失控?.失禁) || 0;
        const mast = Number(c.自慰) || 0;
        const exp = Number(c.暴露?.露出) || 0;
        const hooker = Number(c.交易?.接客卖身) || 0;

        const totalCount = vag + mouth + anal + tit + foot + creampie + swallow + orgasm + squirt + leak + mast + exp + hooker;
        const list = [];

        // 1. 先检查大模型是否通过 _.set 写入了自定义性癖（过滤掉旧版0/100的假初始项）
        if (Array.isArray(v.性癖?.条目)) {
            v.性癖.条目.forEach(raw => {
                const s = String(raw).trim();
                if (!s) return;
                // 如果总账为0且该条目进度是0/100，说明是未触发的占位符，直接忽略
                if (totalCount === 0 && /[-\s]0\/100$/.test(s)) return;
                list.push(s);
            });
        }

        // 2. 根据总账真实次数自动派生简短直白的下流性癖
        const addAuto = (shortName, origin, count, scale = 15) => {
            if (count <= 0) return;
            if (list.some(x => x.startsWith(shortName))) return;
            const prog = Math.min(100, count * scale);
            const stg = prog < 25 ? "第一阶段" : prog < 50 ? "第二阶段" : prog < 75 ? "第三阶段" : prog < 95 ? "第四阶段" : "第五阶段";
            list.push(`${shortName}-${origin}-${stg}-${prog}/100`);
        };

        addAuto("挨操瘾", `骚逼已被贯穿 ${vag} 次，阴道媚肉彻底记住大肉棒形状`, vag, 12);
        addAuto("内射孕肚癖", `子宫已被滚烫浓精内射浇灌 ${creampie} 次，宫口成瘾渴求受孕`, creampie, 15);
        addAuto("深喉吞精癖", `骚口已口交 ${mouth} 次、吞精 ${swallow} 次，喉咙对精腥味食髓知味`, mouth + swallow, 12);
        addAuto("肛交扩菊癖", `后庭菊穴已被粗暴开发 ${anal} 次，括约肌贪恋异物塞满感`, anal, 18);
        addAuto("乳交夹屌癖", `丰满雪乳已服侍肉棒 ${tit} 次，乳肉摩擦即高潮`, tit, 20);
        addAuto("玉足恋足癖", `修长玉足已足交玩弄 ${foot} 次，脚趾沾染精液即发骚`, foot, 20);
        addAuto("潮吹失禁癖", `累计高潮 ${orgasm} 次、喷潮 ${squirt} 次、漏尿 ${leak} 次，膀胱与骚穴括约肌彻底失控`, orgasm + squirt + leak, 15);
        addAuto("自慰抠穴癖", `空虚难耐自行抠弄骚穴 ${mast} 次，手指沾满淫水停不下来`, mast, 20);
        addAuto("公开露出癖", `当众赤裸露出或被视奸 ${exp} 次，越被人围观骚穴流得越欢`, exp, 20);
        addAuto("肉便器卖淫癖", `已沦为娼妓接客卖身 ${hooker} 次，彻底觉醒公用母狗自觉`, hooker, 15);

        return list;
    }

    function buildFullSystemPrompt(userName, currentVars) {
        const currentYaml = varsToYaml(userName, currentVars);
        return `\n【当前变量库实时注入值】\n${currentYaml}\n
【🔥状态栏与变量后期自动补全强制规范（V17引擎）】
1. 每条回复末尾按顺序输出：正文 -> 【状态栏｜${userName}】...【/状态栏】 -> <UpdateVariable>块</UpdateVariable>。
2. 状态栏分为6大板块：[[档案与肉体]]、[[恶堕与精神]]、[[下流性癖库]]、[[六孔解剖台]]、[[储精与体液]]、[[淫乱总账本]]。
3. **严格贴合正文原则**：外貌与衣装描述必须严格依据当前故事正文已出现的真实细节（绝不编造正文未提及的数字）。
4. **性癖与总账联动规则**：当所有性交/高潮/自慰/露出总账次数全为 0 时，主角无任何性癖！只有当发生相应色情事件、总账次数增加时，才解锁对应的简短下流性癖名（格式：“简短下流名-成因-第X阶段-数值/100”，名字限3~5字，如：榨精癖、吞精癖、内射癖、肛交癖、潮吹失禁癖、露出癖、肉便器癖）。
5. **四穴独立储精更新**：若发生射精，必须在 <UpdateVariable> 中分别更新 '${userName}.体内精液存量.口内毫升'、'${userName}.体内精液存量.小穴毫升'、'${userName}.体内精液存量.子宫毫升'、'${userName}.体内精液存量.屁眼毫升'。
6. **按钮双层详情自动补全**：每个按钮的描述遵循「极度色情直白下流的肉体解剖详写 + 💭【${userName}的实时内心感受】（第一人称带❤️💦🥵表情的羞耻或发情心声）」双层格式。`;
    }

    // 格式化按钮标题与 0~100%（或 0~150ml）动态深化进度条
    function fmtKey(rk, reverseBar = false) {
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        let pct = null;
        const m = rk.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+(?:\.\d+)?)/);
        if (m) {
            const cur = parseFloat(m[1]), max = parseFloat(m[2]);
            if (max > 0) pct = Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
        } else {
            const sm = { "第一阶段": 20, "第二阶段": 40, "第三阶段": 60, "第四阶段": 80, "第五阶段": 100 };
            for (const [k, v] of Object.entries(sm)) if (rk.includes(k)) { pct = v; break; }
        }
        const badges = [];
        let cleanTitle = rk
            .replace(/「([^」]{1,40})」/g, (_, s) => {
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
                <span style="font-size:11px;color:${st.labelColor};font-family:Consolas,monospace;font-weight:bold;min-width:34px;text-align:right;">${pct}%</span>
            </div>`;
        }
        return { keyHTML, barHTML, cleanTitle, pct };
    }

    function tier5(val, rev = false) {
        const n = Math.max(0, Math.min(100, Number(val) || 0)), v = rev ? (100 - n) : n;
        return v < 20 ? 0 : v < 40 ? 1 : v < 60 ? 2 : v < 80 ? 3 : 4;
    }

    // 数值按钮详情（客观下流解剖 + 💭主角第一人称心声）
    function getDynamicMetricDetail(type, v, u) {
        const map = {
            cockLove: {
                val: Number(v.核心数值?.对肉棒好感度) || 0, rev: false,
                st: ["嫌精拒屌•夹腿发颤", "口嫌体直•食髓知味", "含泪渴屌•穴肉吸吮", "跪舔肉棒•母狗发骚", "肉棒至上•精液便器"],
                d: [
                    `【生理与肉体反应】：意识里对男人那根布满狰狞青筋、散发着浓烈包皮垢与前列腺液腥膻味的粗硬大肉棒充满排斥与恐惧，光是想象硕大紫红的龟头顶在自己粉嫩紧窄的处女穴口，${u}就会本能地死死并拢双腿；然而这具刚重塑的极品纯阴娇躯却诚实得下流，尾椎骨深处竟顺着紧张感窜起一阵阵让人腿软的酥麻电流。\n💭【${u}的实时内心感受】：“*呜哇啊啊开什么玩笑！那种又粗又丑、还挂着腥臭粘液的男人肉棒要是捅进我现在这条窄得要命的小穴里，绝对会把我的肚子顶穿的吧？！💦可恶，明明脑子里抗拒得要死，为什么一想到被大肉棒按在地上强行顶进来，我的小腹深处反而一抽一抽地发烫发软啊……🥵*”`,
                    `【生理与肉体反应】：理智防线在男人的气息与摩擦下已经松动。${u}的骚口与下身嫩穴开始记住粗大阳具滚烫坚硬的触感，每当闻到雄性荷尔蒙腥味，喉咙便不自觉地吞咽口水，腿心两瓣粉嫩阴唇更是悄悄充血肿胀、泌出清亮拉丝的淫水。\n💭【${u}的实时内心感受】：“*不、不对劲……刚才只是稍微感受到男人的气息逼近，我的下面怎么就已经湿成这样了？！😳明明我以前是个男大学生啊，为什么现在一想到他胯下鼓起的那根东西，喉咙会突然这么干，连小穴里面都痒得像是有什么在咬一样……❤️*”`,
                    `【生理与肉体反应】：清高孤傲的伪装已被大肉棒彻底撞碎！${u}对粗长滚烫的阳具产生了如同烈性春药般的生理饥渴，眼神总是下流地黏在男人的裤裆鼓包上。只要被龟头抵住唇瓣或阴唇肉缝，腰肢便瞬间酸软塌陷，骚逼内壁层层叠叠的媚肉饥渴地收缩蠕动、迫切渴望被狠狠插到底。\n💭【${u}的实时内心感受】：“*哈啊……忍、忍不住了💦……好想被那根滚烫的大肉棒塞满……为什么我的身体会变得这么下贱啊，只要一看到男人的下半身，我的骚逼就自己张开流出一大滩水，求求你快点插进来止住我里面的痒吧……🥵❤️*”`,
                    `【生理与肉体反应】：彻头彻尾沉溺于大肉棒的发情母狗！${u}已将用骚嘴和骚逼服侍雄性巨物当作最大的快乐。一看到勃起跳动的狰狞肉棒便双膝发软跪倒在地，毫无廉耻地伸出湿滑香舌从浓密卵袋一路舔到马眼，主动掰开湿淋淋的阴唇哀求粗暴抽插。\n💭【${u}的实时内心感受】：“*唔嗯♡……好香……大肉棒的腥臭味闻起来好棒啊🥵……什么少宗主、什么男大学生的尊严全都无所谓了，快把那根粗得吓人的大鸡巴塞进伊一的嘴里和小穴里，把人家的骚逼狠狠操烂吧💦❤️！*”`,
                    `【生理与肉体反应】：满值恶堕的终极肉棒奴隶！${u}的大脑已被大鸡巴与浓精彻底烧坏，哪怕只是闻到一丝精腥味都会翻白眼吐舌流涎，骚口、骚逼、屁眼三处肉孔同时疯狂痉挛吸吮，哭喊着求男人把滚烫浓精全部射进子宫最深处！\n💭【${u}的实时内心感受】：“*啊嘿♡……肉棒大人……伊一只是为了服侍大肉棒而存在的下贱肉套子呀🥵💦！没有大鸡巴插着子宫就要活不下去了，快把滚烫的臭精液全部射进人家的最深处，把伊一灌成大肚子母狗吧❤️❤️！*”`
                ]
            },
            lust: {
                val: Number(v.核心数值?.性欲程度) || 0, rev: false,
                st: ["假装清冷•奶头摩擦发硬", "春水暗涌•底裤湿透粘腻", "欲火焚身•夹腿磨逼止痒", "重度发骚•骚穴狂流淫水", "永动发情•三穴痉挛索操"],
                d: [
                    `【生理与肉体反应】：表面还死撑着纳兰嫣然清冷孤傲的架子，但初生的十八岁纯阴处子肉体对贴身衣料的摩擦敏感到极点！哪怕只是试图站起身或急促喘气，丝质裹胸与衬裤擦过奶头和阴唇时，都会在小腹深处激起一圈圈下流的酥麻热流。\n💭【${u}的实时内心感受】：“*救命……这具千金大小姐的身体到底是用什么做的啊？！💦明明我什么涩涩的事情都没想，只是裹胸的丝帛轻轻蹭了一下奶头，居然就有一股麻酥酥的电流直接窜到后脑勺了！再这样动下去，下面真的要奇怪地湿掉了啦……🥵*”`,
                    `【生理与肉体反应】：小腹深处升起一股挥之不去的燥热与空虚酸胀！胸前两颗粉嫩乳头在裹胸下充血发硬、顶出两个羞人的小凸起，双腿之间更是泛起黏腻潮意，未经人事的紧窄肉穴正一缩一缩地空虚抽搐。\n💭【${u}的实时内心感受】：“*呜……奶头好硬好烫，衬裤贴在阴唇上湿漉漉的好难受😳……为什么小肚子里面一直空落落地发酸啊，好像有一只看不见的手在挠我的子宫口一样，好想伸手进去揉一揉……💦*”`,
                    `【生理与肉体反应】：滚烫的淫欲之火烧遍全身！${u}双颊酡红如醉，呼吸粗重滚烫，胸前丰盈雪乳剧烈起伏。下身骚逼早已淫水泛滥成灾，透明拉丝的爱液彻底浸湿了底裤并顺着大腿根往下淌，急需粗硬异物狠狠插入止痒。\n💭【${u}的实时内心感受】：“*哈啊、哈啊……身体好热，小穴里的淫水已经把衬裤完全弄湿了🥵……两条腿不管怎么夹紧摩擦都止不住里面的骚痒，谁来帮帮我，用什么粗硬的东西插进我湿淋淋的小穴里搅拌一下啊……💦❤️*”`,
                    `【生理与肉体反应】：重度发情失控！全身白腻肌肤一碰就颤，充血肿大的阴蒂肉珠暴突在外剧烈跳动。${u}像发情母犬般死死夹紧双腿磨蹭腰臀，嘴里漏出下流甜腻的哼唧，骚逼里淫水噗嗤噗嗤往外直冒。\n💭【${u}的实时内心感受】：“*呜嗯……受不了了，阴蒂又肿又麻，骚穴里面痒得快要发疯了🥵💦！别管什么礼义廉耻了，快点用大手狠狠抓烂我的奶子，把最粗的大肉棒捅进我直流水的骚逼里用力操我呀❤️！*”`,
                    `【生理与肉体反应】：24小时狂暴发情期！脑子里除了交配与被内射灌精外再无半点杂念，浑身滚烫出汗、散发着浓烈的雌性发情骚香。奶头硬如石子，红肿外翻的骚逼与屁眼不停向外喷涌黏腻淫水，连子宫口都主动向下脱垂索精！\n💭【${u}的实时内心感受】：“*啊啊♡……发情停不下来了！伊一的骚逼和屁眼全都在喷水，子宫口也张开等着吃精液了🥵💦！快点把我按在地上轮流内射，不把这具发骚的母狗身体操到休克就绝对不准停下来呀❤️❤️！*”`
                ]
            },
            corr: {
                val: Number(v.核心数值?.淫乱恶堕) || 0, rev: false,
                st: ["死撑清高•肉体剧烈背叛", "半推半就•羞耻快感成瘾", "食髓知味•主动迎合求欢", "下贱娼妇•肉便器自觉", "脑髓熔断•公用排泄母畜"],
                d: [
                    `【生理与肉体反应】：意识里还保留着原本的道德底线与少宗主的高傲外壳，对下流的视奸、触碰与身体异变感到极度屈辱惊慌；然而这具纯阴肉体却在每一次羞耻刺激下成倍放大快感，让她的清冷伪装摇摇欲坠。\n💭【${u}的实时内心感受】：“*我原本可是个普通男大学生、现在更是云岚宗高高在上的少宗主纳兰嫣然啊！💦绝不能在师兄面前露出那种像里番女主角一样发骚腿软的丢脸样子……可恶，但为什么身体越害怕露馅，下面反而越觉得刺激啊？！🥵*”`,
                    `【生理与肉体反应】：在接连的羞耻与快感冲击下，矜持防线已布满裂痕。面对男人的步步紧逼开始半推半就，嘴上还在微弱抗拒，滚烫湿软的身体却早已诚实地贴了上去。\n💭【${u}的实时内心感受】：“*嘴上虽然还在说着‘请自重’，可我的腰为什么自己往男人手掌心上凑过去了啊😳💦……这种明明该反抗却顺从地分腿的背德感，简直要把我的脑子给融化掉了……❤️*”`,
                    `【生理与肉体反应】：廉耻与贞操观彻底冲垮！她开始真正沉迷于女性肉体被粗暴揉捏、被大肉棒肆意填满的下流快感，举手投足间褪去清高，流露出主动勾引男人的淫荡风情。\n💭【${u}的实时内心感受】：“*原来变成女人被男人粗暴地玩弄身体……是这么爽到头皮发麻的事情吗🥵❤️？既然已经回不去了，那就干脆用这具倾国倾城的仙子肉体，去把男人们的精液全部榨干吧💦！*”`,
                    `【生理与肉体反应】：身心彻底恶堕的极品淫乱娼妇！她以自己的仙子娇躯能成为男人发泄兽欲的肉套子为荣，会主动分开白皙大腿展示红肿湿亮的花唇，用最下流的床话浪叫求操。\n💭【${u}的实时内心感受】：“*嘻嘻♡……看呀，平时高高在上的纳兰嫣然少宗主，现在正自己掰开流水的骚逼求男人肏呢🥵💦！快用最下流的方式玩弄我，把我的小穴和嘴全都当成你的专属飞机杯吧❤️！*”`,
                    `【生理与肉体反应】：终极极限恶堕！人类尊严100%灰飞烟灭，彻底退化为一具只为承接雄性精液与尿液而活的公用排泄肉便器。无论被如何当众羞辱、三穴齐开、失禁潮吹，她都会挂着痴呆阿片脸吐舌高潮！\n💭【${u}的实时内心感受】：“*呕咕、啊嘿♡……伊一已经彻底变成没有脑子的公用肉便器母猪了🥵💦！不管是谁的粗肉棒、不管是浓精还是骚尿，全都请往伊一合不拢的骚逼和喉咙里灌进来吧❤️❤️！*”`
                ]
            },
            shame: {
                val: Number(v.精神与心理?.羞耻度 ?? 100), rev: true,
                st: ["羞愤欲死•耳尖滚烫滴血", "薄面潮红•咬唇无力遮挡", "半掩半露•羞耻转为兴奋", "不知廉耻•掰穴展示淫水", "羞耻全灭•当众失禁母狗"],
                d: [
                    `【生理与肉体反应】：羞耻度处于100%满负荷紧绷状态！体内死宅男大学生的灵魂与这具胸前丰盈沉甸、下身空荡湿热的绝色千金肉体产生剧烈冲突。哪怕只是感觉到乳肉颠簸、或是意识到自己连排尿都必须蹲下，都会羞耻得满脸通红、耳尖滴血，而这份极致的羞耻感正疯狂催化着肉体的敏感度！\n💭【${u}的实时内心感受】：“*呜哇啊啊要死要死要死了！💦胸前这两团沉甸甸的软肉一直在晃，两腿之间原本二十多年习以为常的男性部位彻底没了，只剩下一条空荡荡还在冒热气的肉缝，连上厕所都要蹲下来……要是被门外的柳翎师兄看到我现在满脸通红扶着柱子发抖的样子，我真的要原地蒸发了啊啊啊！🥵*”`,
                    `【生理与肉体反应】：在接连的身体羞耻冲击下，防线开始松动。虽然私密部位被注视或触碰时依然心跳如鼓、脸红发烫，但双手的遮挡已变得软弱无力。\n💭【${u}的实时内心感受】：“*别、别盯着我的胸口和腿根看啊😳💦……虽然害羞得快要晕过去了，可手却软绵绵的一点力气都使不上来，甚至被火热的眼神盯着的时候，乳尖反而更麻更硬了……❤️*”`,
                    `【生理与肉体反应】：羞耻感已被磨灭大半！哪怕衣衫不整地露出大片雪白乳肉、或是当着男人的面流下大腿根的淫水，也能在微微脸红后迅速转化为暴露的快感。\n💭【${u}的实时内心感受】：“*反、反正都已经被看光了💦……与其遮遮掩掩，不如就让他好好看看我这具连自己都觉得色情得要命的身体吧，被盯着看下面反而流得更多了呢……🥵*”`,
                    `【生理与肉体反应】：廉耻心荡然无存！哪怕赤身裸体跪在男人胯下口交吞精、或是顶着一肚子精液走动任由白浊顺着腿根滴淌，她也毫不遮掩，甚至故意分开臀瓣展示湿漉漉的肉穴。\n💭【${u}的实时内心感受】：“*害羞是什么？能有被男人视奸骚逼、用大肉棒插到喷水爽吗🥵❤️？快看呀，我的小穴已经湿得一塌糊涂了，全都敞开给你看个够💦！*”`,
                    `【生理与肉体反应】：羞耻心彻底归零粉碎！哪怕在大庭广众之下被扒光衣服四脚朝天粗暴操干、当众潮吹漏尿失禁、浑身涂满浓精像母狗一样爬行，她也会兴奋得浑身发抖、吐舌高潮！\n💭【${u}的实时内心感受】：“*啊啊♡……越是被人围观我被肏得翻白眼漏尿的下贱样子，我的子宫就高潮得越厉害🥵💦！大家都来看呀，高贵的纳兰嫣然已经变成一条在大街上敞开骚逼喷水的母狗啦❤️❤️！*”`
                ]
            },
            obey: {
                val: Number(v.精神与心理?.服从度) || 0, rev: false,
                st: ["傲娇抗命•强撑少宗主威严", "委曲求全•双膝发软妥协", "温顺听话•主动分腿配合", "摇尾乞怜•任打任操母犬", "绝对盲从•刻入骨髓肉奴"],
                d: [
                    `【生理与肉体反应】：表面拼命想摆出云岚宗少宗主孤高冷傲、拒人于千里之外的架子；然而发软的膝盖、急促的喘息与微微颤抖的双肩却暴露了外强中干的底细。\n💭【${u}的实时内心感受】：“*稳住，一定要装出纳兰嫣然那种高高在上、清冷孤傲的继承人威严！💦绝对不能让门外的师兄柳翎发现里面装着一个死宅大学生的灵魂……可恶，膝盖好软，扶着青石立柱的手别抖啊！🥵*”`,
                    `【生理与肉体反应】：在形势逼迫或肉体酸软无力的状态下学会了低头妥协，即使内心羞愤交加，也不得不顺从地按照男人的要求摆出羞耻姿势。\n💭【${u}的实时内心感受】：“*呜……把柄被抓住了，身体又软得根本逃不掉💦……算了，只要稍微听他的话乖乖把腰弯下去一点，应该就不会被发现冒牌货的身份了吧……😳*”`,
                    `【生理与肉体反应】：面对男人的命令已形成习惯性顺从，不再出言顶撞，懂得如何主动放松紧绷的大腿肌肉、乖巧地分开双腿配合对方的抚摸与插入。\n💭【${u}的实时内心感受】：“*既然反抗也只会让身体更难受，不如乖乖听话把腿张开吧❤️……只要顺从地让他舒服了，他也会摸得我更爽的吧……💦*”`,
                    `【生理与肉体反应】：彻底被驯服的摇尾母狗！对男人的任何粗暴命令都奉若圣旨，不仅会主动跪爬上前用舌头舔净肉棒，挨打受罚时还会一边流着淫水一边哭喊谢恩求操。\n💭【${u}的实时内心感受】：“*汪呜♡……主人说什么伊一都会照做的🥵！请狠狠抽打伊一的屁股，只要主人开心，让我摆出什么下流姿势挨肏都可以呀💦❤️！*”`,
                    `【生理与肉体反应】：100%刻入骨髓的绝对奴性！已完全放弃自主意志，哪怕命令她自己掰开骚逼塞入异物、吞下所有浓精尿液、或彻夜高翘肥臀承欢，她都会条件反射般全力奉承！\n💭【${u}的实时内心感受】：“*伊一没有自己的思想，伊一的身体、骚穴和灵魂全都是主人的所有物♡🥵！请随便下达最残酷最下流的命令来使用这具肉奴吧💦❤️！*”`
                ]
            },
            pleas: {
                val: Number(v.精神与心理?.快感累积) || 0, rev: false,
                st: ["敏感初醒•乳尖小腹过电", "酥麻窜动•花唇泌水微张", "快感攀升•趾尖蜷缩浪喘", "濒临绝顶•宫口痉挛索精", "灭顶潮吹•翻白眼阿片失禁"],
                d: [
                    `【生理与肉体反应】：纯阴处子敏感神经刚刚被唤醒！薄软的丝质裹胸每一次擦过挺立的蓓蕾，或是紧张时小腹深处的紧缩，都会激起一缕缕细微酥麻的电流直窜后脑勺，令下腹部泛起莫名的暖意与空虚抽搐。\n💭【${u}的实时内心感受】：“*呀……！刚才站起身的时候，裹胸的丝帛磨过乳尖那一下，后脑勺居然像过电一样麻了半秒钟！❤️而且下腹部最深处为什么一直在酸酸地一抽一抽啊，这种陌生的女体敏感度也太可怕了吧……💦*”`,
                    `【生理与肉体反应】：酥麻滚烫的快感电流顺着尾椎骨一路窜向小腹与阴蒂！全身敏感带充血发烫，花唇内壁在刺激下一缩一缩地溢出了清亮润滑的淫水，双膝发软打颤。\n💭【${u}的实时内心感受】：“*唔嗯……好麻、好舒服😳💦……顺着脊椎骨往下窜的电流越来越强了，下面的花唇一直在自己吐水，连站都要站不稳了啦……🥵*”`,
                    `【生理与肉体反应】：密集汹涌的快感浪潮不断拍打着每一根神经！每一次摩擦、揉捏与顶撞都让${u}浑身剧烈颤抖、小战靴里的粉嫩脚趾紧紧蜷缩，淫水在腿心被搅动得泥泞不堪。\n💭【${u}的实时内心感受】：“*啊啊、不行了，快感一波接一波地冲上来，脚趾头都麻得蜷缩起来了🥵💦！再继续摩擦那个敏感点的话，脑子真的要被爽坏掉了呀❤️！*”`,
                    `【生理与肉体反应】：快感已蓄积至决堤崩溃的边缘！小腹与阴道括约肌剧烈绷紧痉挛，充血肥大的阴蒂与敏感宫颈口如同通了高压电，只要再稍微刺激一下就会引爆灭顶高潮。\n💭【${u}的实时内心感受】：“*要、要去了！小肚子里面绷得好紧，有什么滚烫的东西要从骚穴最深处炸开了🥵💦！求求你快再用力顶一下，让我高潮吧❤️❤️！*”`,
                    `【生理与肉体反应】：灭顶绝顶高潮连续过载爆发！狂暴的性快感瞬间烧穿脑海，她双眼狂翻白眼、香舌无力吐出唇外，滚烫的潮吹淫水与失禁骚尿从大张痉挛的骚逼里狂喷而出！\n💭【${u}的实时内心感受】：“*啊゛啊゛啊——去了去了去了♡！！脑子一片空白全炸开了🥵💦！骚逼在自己狂喷水、连小便也一起失禁喷出来了，太爽了要死掉了啊啊啊❤️❤️！！*”`
                ]
            },
            sta: {
                val: Number(v.身体?.体力 ?? 100), rev: true,
                st: ["精力充沛•初变脱力微喘", "娇躯微软•香汗浸湿裹胸", "香汗淋漓•双腿筛糠打颤", "濒临虚脱•瘫软任人摆布", "彻底操烂•失神抽搐肉泥"],
                d: [
                    `【生理与肉体反应】：十八岁纯阴处子之躯总体精力充沛、云岚宗风属性斗气在皮下经脉间自发流转；仅因刚刚经历肉体重塑与胸前丰盈带来的重心失衡而呼吸微促、膝盖发软，正扶着青石立柱极力稳住身形。\n💭【${u}的实时内心感受】：“*呼、呼……虽然皮下能看到一缕缕青色的风属性斗气在转，但这具身体的重心和男大学生完全不一样，胸口沉甸甸地往下坠，光是扶着柱子站稳就已经让我裹胸下出一层细汗了啊……💦*”`,
                    `【生理与肉体反应】：经历一番紧张对峙或初步挑逗后，白皙晶莹的肌肤表面沁出一层薄薄的温热香汗，将贴身丝质裹胸浸得微湿，纤细柳腰与修长双腿略微酸软发颤。\n💭【${u}的实时内心感受】：“*哈啊……身上出汗了，黏糊糊的丝质裹胸贴在胸口上好色情😳💦……腿也有点使不上劲，千万别在这个时候被人推门进来啊……*”`,
                    `【生理与肉体反应】：体力消耗过半，浑身被黏腻的香汗彻底浸透，如瀑青丝凌乱地黏在绯红未退的面颊与锁骨上，下身酸麻发软难以站立。\n💭【${u}的实时内心感受】：“*呜……全身的力气都被刚才的刺激抽走一半了🥵💦，膝盖一直在打哆嗦，要是现在被男人抱住的话，连挣扎一下的力气都没有了……*”`,
                    `【生理与肉体反应】：体力濒临枯竭！剧烈的感官冲击或连续抽插抽干了全身力气，双腿筛糠般剧烈打颤，只能软绵绵地瘫倒在汉白玉台阶上任由男人粗暴摆布。\n💭【${u}的实时内心感受】：“*哈啊、哈啊……一根手指头都动不了了🥵……身体像一滩融化的春水一样软在地上，随便你要怎么掰开我的腿、怎么插我都反抗不了了……💦❤️*”`,
                    `【生理与肉体反应】：全身彻底虚脱瘫软！像一滩被操烂的软泥般烂在地上，连抬动眼皮的力气都没有，唯有红肿外翻的骚逼与子宫还在凭着肌肉本能自动痉挛吸吮！\n💭【${u}的实时内心感受】：“*唔……已经彻底被玩坏、被操到虚脱休克了♡🥵……意识好远，只有下面的骚逼还在自己一缩一缩地咬着肉棒不放……💦*”`
                ]
            }
        };
        const cfg = map[type] || map.cockLove;
        const t = tier5(cfg.val, cfg.rev);
        const customOverride = v.按钮详情?.[type];
        return {
            val: cfg.val,
            stage: cfg.st[t],
            desc: customOverride ? String(customOverride) : `【当前数值：${cfg.val}/100 · 第${t + 1}阶段「${cfg.st[t]}」】\n${cfg.d[t]}`
        };
    }

    // 简短下流性癖详情生成器（带主角第一人称心声）
    function buildFetishRichDesc(rawItem, v, u) {
        const parts = String(rawItem).split("-");
        const name = (parts[0] || "未知癖").trim();
        const origin = (parts[1] || "纯阴肉体被开发后形成").trim();
        const stage = (parts[2] || "第一阶段").trim();
        const valStr = (parts[3] || "20/100").trim();
        const corr = Number(v.核心数值?.淫乱恶堕) || 0;

        return `【性癖名称】：「${name}」（当前进度：${stage} · ${valStr}）\n` +
               `【解锁成因】：${origin}\n` +
               `【🔞 直白下流发作实况】：由于身体已经历过真实的开发与铭刻，这项名为「${name}」的下流性癖已彻底扎根在${u}的脊髓条件反射之中（当前恶堕度 ${corr}%）！每当遇到相关刺激，理智根本无法压制肉体的本能发骚——呼吸瞬间变得粗重滚烫，胸前蓓蕾充血硬挺，腿心骚穴更会条件反射般一缩一缩地涌出黏腻淫水，迫切渴求更粗暴的填满与蹂躏！\n` +
               `💭【${u}针对此性癖的羞耻心声】：“*呜哇……就因为身体被那样对待过，居然真的染上「${name}」这种下流得没边的毛病了啊？！💦只要稍微一回想当时的感觉，我的小肚子和骚穴就自己一抽一抽地往外冒水，再这样下去真的要彻底变成离不开快感的母狗了啊啊啊！🥵❤️*”`;
    }

    // 从最近正文提取真实外貌、独白、动作、衣装（绝不编造正文没写的数字）
    function extractLiveFromChat(chatArr) {
        const res = { thought: "", pose: "", cloth: "", bodyDesc: "" };
        if (!Array.isArray(chatArr) || !chatArr.length) return res;
        const recent = chatArr.slice(-5);
        for (let i = recent.length - 1; i >= 0; i--) {
            const raw = (recent[i]?.mes || "").replace(/<think[\s\S]*?<\/think>/gi, "").replace(/<think_nya>[\s\S]*?<\/think_nya>/gi, "");
            if (!raw) continue;
            const cleanBody = raw.split(/【\s*状态栏|<UpdateVariable>/i)[0] || raw;
            if (!res.thought) {
                const im = [...cleanBody.matchAll(/\*([^*\n]{18,450})\*/g)].map(m => m[1].trim());
                if (im.length) res.thought = im[im.length - 1];
            }
            const sents = cleanBody.split(/[。！？；\n\r]+/).map(s => s.replace(/\*[^*]*\*/g, "").trim()).filter(Boolean);
            if (!res.cloth) {
                const f = sents.filter(s => s.length > 6 && s.length < 120 && /(?:战袍|长裙|裹胸|衬裤|战靴|束带|丝帛|衣|裙)/.test(s));
                if (f.length) res.cloth = f.slice(-2).join("；").trim();
            }
            if (!res.pose) {
                const f = sents.filter(s => s.length > 8 && s.length < 120 && /(?:撑起|扶着|站起|捂住|喘息|瘫坐|一僵|收拢膝盖|颤抖|立柱|铜镜)/.test(s));
                if (f.length) res.pose = f.slice(-2).join("，").trim() + "。";
            }
            if (!res.bodyDesc) {
                const f = sents.filter(s => s.length > 8 && s.length < 130 && /(?:肌肤|皮肤|小手|十指|丰盈|柳腰|S型曲线|青丝|黛眉|秋眸|红唇|容颜)/.test(s));
                if (f.length) res.bodyDesc = f.slice(0, 3).join("；").trim() + "。";
            }
        }
        return res;
    }

    // 6大核心板块生成器（严格贴合正文 + 总账0次零性癖 + 四穴独立储精进度条）
    function buildFullFallbackCategories(u, c, v) {
        const mk = (rk, desc, revBar = false) => ({ rawKey: rk, desc, ...fmtKey(rk, revBar) });
        const ctx = safeCtx(), live = extractLiveFromChat(ctx?.chat || []);
        const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {}, prof = v.档案 || {}, rt = v.实况 || {}, btnOvr = v.按钮详情 || {};

        const cockM = getDynamicMetricDetail("cockLove", v, u);
        const lustM = getDynamicMetricDetail("lust", v, u);
        const corrM = getDynamicMetricDetail("corr", v, u);
        const shameM = getDynamicMetricDetail("shame", v, u);
        const obeyM = getDynamicMetricDetail("obey", v, u);
        const pleasM = getDynamicMetricDetail("pleas", v, u);
        const staM = getDynamicMetricDetail("sta", v, u);

        const vagCnt = Number(cnt.性交?.小穴) || 0, mouthCnt = Number(cnt.性交?.口) || 0, analCnt = Number(cnt.性交?.屁眼) || 0, creampie = Number(cnt.射精?.内射) || 0, swallowMl = Number(cnt.精液摄入?.累计毫升) || 0, orgasmCnt = Number(cnt.高潮?.总数) || 0, leakCnt = Number(cnt.失控?.失禁) || 0;

        // 四穴独立精液储量（口胃、阴道、子宫、后庭）
        const mouthMl = Number(sp.口内毫升) || 0;
        const vagMl = Number(sp.小穴毫升) || 0;
        const wombMl = Number(sp.子宫毫升) || 0;
        const analMl = Number(sp.屁眼毫升) || 0;
        const totalBellyMl = mouthMl + vagMl + wombMl + analMl;

        const corr = Number(v.核心数值?.淫乱恶堕) || 0, lust = Number(v.核心数值?.性欲程度) || 0, pleas = Number(v.精神与心理?.快感累积) || 0;
        const vagWidth = (1.5 + Math.min(3.6, vagCnt * 0.02)).toFixed(1);
        const vagClose = Math.max(15, Math.round(100 - vagCnt * 0.4 - ((wombMl + vagMl) > 0 ? 15 : 0)));
        const cervixDrop = Math.min(100, Math.round(creampie * 0.5 + (wombMl > 0 ? 20 : 0) + pleas * 0.15));
        const clitSize = (4.0 + Math.min(8.5, orgasmCnt * 0.06 + pleas * 0.03)).toFixed(1);
        const analClose = Math.max(20, Math.round(100 - analCnt * 0.5 - (analMl > 0 ? 15 : 0)));
        const peeVal = Math.min(100, Math.round(15 + lust * 0.35 + pleas * 0.35 + leakCnt * 8));
        const wetLevel = Math.min(100, Math.round(15 + lust * 0.7 + pleas * 0.6 + (wombMl > 0 ? 25 : 0)));
        const fallVal = Number(v.精神与心理?.沦陷度) || 0;
        const brkVal = Number(v.精神与心理?.人格崩解度) || 0;

        const curThought = rt.内心独白 || live.thought || `骗人的吧……这具身体到底怎么回事啊？！💦只是稍微动一下，丝质裹胸磨蹭到乳尖居然会起一身鸡皮疙瘩，连小腹深处都泛起一股莫名其妙的酸软湿热感……❤️门外柳翎师兄的声音传过来了！要是被他推门进来看到我双腿发软扶着柱子喘气的羞耻样子，会不会被当成夺舍的邪魔或者直接发生里番剧情啊？！🥵`;
        const curPose = rt.当前姿势 || live.pose || `${u}正慌乱地收拢膝盖、扶着身旁的青石立柱支撑发软的膝盖，双肩因紧张与羞耻而微微颤抖，胸前两团沉甸甸的丰盈随着急促喘息在紧身裹胸下剧烈起伏。`;
        const curCloth = rt.当前衣装 || live.cloth || (prop.穿戴中的标记物 !== "无" ? prop.穿戴中的标记物 : "月白色镶银丝云纹束腰战袍裙、青白双色丝质裹胸、修身素色衬裤、精工麂皮小战靴");
        const realBodyDesc = prof.肉体外貌实况 || live.bodyDesc || "倾国倾城的冷傲绝俗容颜，黛眉如柳叶，秋眸若寒星，薄红唇紧抿，青丝如瀑垂落至腰际；十指纤细柔嫩泛着樱花色泽，肌肤白皙晶莹得近乎透明且看不见一丝毛孔，皮下流转着云岚宗风属性斗气；胸前两团丰盈沉甸甸，纤细柔韧的柳腰被银丝软甲束带勾勒出惊心动魄的完美S型曲线，散发着清雅幽兰体香。";

        // 计算当前解锁的性癖列表
        const unlockedFetishes = computeUnlockedFetishes(v);
        const fetishItems = unlockedFetishes.length > 0
            ? unlockedFetishes.map(s => {
                const parts = String(s).split("-");
                return mk(`🧬 ${parts[0] || s}：${parts[3] || "20/100"}「${parts[2] || "第一阶段"}」`, buildFetishRichDesc(s, v, u));
            })
            : [mk(`🔒 暂无性癖（纯洁处子待开发）：0/100「总账全0•白纸状态」`,
                `【当前性癖解锁实况】：\n由于当前【淫乱总账本】中的所有性交、高潮、内射、吞精、自慰与露出次数全部为 0，${u}这具刚刚重塑的十八岁纯阴处子之躯尚未染上任何后天淫乱性癖！\n【解锁条件说明】：一旦后续剧情中发生破处、口交吞精、内射灌精、高潮潮吹、自慰或当众露出等行为（即总账对应次数 > 0），系统将自动依据开发次数激活对应的简短下流性癖（如「榨精癖」、「吞精癖」、「内射孕肚癖」、「潮吹失禁癖」等）！\n💭【${u}的实时内心感受】：“*呼……还好还好，我现在从头到脚都还是干干净净、连手指头都没碰过那里的纯洁处女之身💦！什么奇奇怪怪的下流性癖一个都还没有沾上……但为什么这具身体本身就这么敏感啊，千万要守住清白别被开苞破戒了啊！🥵*”`)];

        return [
            // 1. 档案与肉体（严格依据当前正文真实外貌与处境生成，绝不编造数字）
            {
                title: "档案与肉体", icon: "👩", summary: `倾城纯阴处子 · 体力${staM.val}% · 实时独白`,
                items: [
                    mk(`👩 真实身份与处境：${u}「${corr >= 60 ? "发情母畜少宗主" : "死宅男魂•云岚宗少宗主躯壳"}」`,
                        btnOvr.身份与背景 || `【当前真实身份与背景实况】：\n${prof.身份与背景 || `${u}原本是一名二十岁、为早八点名和兼职工资苦苦挣扎的普通死宅男大学生；因握住桌上的“修改现实笔”写下【伊一完全变成了纳兰嫣然】，现实被彻底粉碎重组，灵魂与肉体变成了斗气大陆加玛帝国纳兰家族掌上明珠、云岚宗下一任宗主继承人——纳兰嫣然！目前正身处云岚宗大殿内，门外传来了大弟子柳翎奉古河长老与宗主之命送‘聚气散’丹药的敲门声。`}\n💭【${u}的实时内心感受】：“*明明五秒钟前我还在廉价出租屋里为早八近代史纲要犯愁，怎么一划下笔就变成退婚流的傲娇反派大小姐纳兰嫣然了啊？！💦而且一来就是柳翎师兄在门外敲门送药的修罗场，我根本不会演高冷大小姐，万一露馅被当成夺舍邪魔一掌拍死或者按在地上发生本子剧情怎么办啊！🥵*”`),
                    mk(`🌸 绝色容颜与纯阴躯体：「黛眉寒星•玉肌无瑕•完美S曲线」`,
                        btnOvr.肉体外貌 || `【当前真实肉体与外貌细节（严格依据正文提取）】：\n${realBodyDesc}\n当前体表痕迹：${mark.体表痕迹 || "面颊绯红、耳尖羞红、裹胸下肌肤微汗"}。\n💭【${u}的实时内心感受】：“*铜镜里照出来的这张脸也太绝美了吧，完全就是能让整个加玛帝国青年才俊发疯的孤高仙子啊！😳💦可是这皮肤细腻得连毛孔都看不见，胸前还坠着两团沉甸甸的软肉拉扯着锁骨，稍微动一下裹胸布料磨过敏感点就会起鸡皮疙瘩，这具身体根本就是个行动的催情炸弹吧！❤️*”`),
                    mk(`💬 实时内心独白（最新心声）：「${corr >= 60 ? "母狗发骚索操心声" : "死宅灵魂羞耻慌乱碎碎念"}」`,
                        btnOvr.内心独白 || `【第一人称实时内心独白（自动抓取当前楼层最新心声）】：\n“*${curThought}*”\n\n【当前核心敏感点与规矩】：\n当前敏感带：${extPsy.当前敏感点 || "下腹部深处因紧张泛起莫名暖意与空虚抽搐感"} ｜ 当前日程规矩：${v.调教进度?.规矩与日程 || "维持纳兰嫣然清冷高傲人设，掩饰冒牌身份"}。`),
                    mk(`🧍 当前姿势与娇躯定格：「${curPose.slice(0, 18)}…」`,
                        btnOvr.当前姿势 || `【当前身体姿态与动作实况】：\n${curPose}\n💭【${u}的实时内心感受】：“*我现在这个扶着青石立柱、双腿发软夹紧、捂着胸口大喘气的样子，完全把孤高少宗主的气场败光了啊！💦门外脚步声越来越近了，快把发抖的肩膀稳住啊！🥵*”`),
                    mk(`⚡ 体力与肉体耐受：${staM.val}/100「${staM.stage}」`, staM.desc, true)
                ]
            },
            // 2. 恶堕与精神（0-100动态颜色深化进度条）
            {
                title: "恶堕与精神", icon: "🔥", summary: `好感${cockM.val}% · 性欲${lustM.val}% · 羞耻${shameM.val}%`,
                items: [
                    mk(`💗 对肉棒渴求度：${cockM.val}/100「${cockM.stage}」`, cockM.desc),
                    mk(`🔥 肉体发情性欲：${lustM.val}/100「${lustM.stage}」`, lustM.desc),
                    mk(`🖤 淫乱恶堕深度：${corrM.val}/100「${corrM.stage}」`, corrM.desc),
                    mk(`😳 羞耻崩坏反噬：${shameM.val}/100「${shameM.stage}」`, shameM.desc, true),
                    mk(`🙇 雌畜顺从屈服：${obeyM.val}/100「${obeyM.stage}」`, obeyM.desc),
                    mk(`💓 快感电流蓄积：${pleasM.val}/100「${pleasM.stage}」`, pleasM.desc),
                    mk(`🧠 雌化沦陷与崩解：${Math.max(fallVal, brkVal)}/100「沦陷${fallVal}%•崩解${brkVal}%•清醒${v.精神与心理?.意识清醒度 ?? 100}%」`,
                        btnOvr.雌化沦陷 || `【灵魂雌化与精神防线实况】：\n当前沦陷度 ${fallVal}/100 ｜ 人格崩解度 ${brkVal}/100 ｜ 意识清醒度 ${v.精神与心理?.意识清醒度 ?? 100}/100。\n100%清醒的男大学生神智与这具极度敏感的十八岁纯阴女体正在剧烈磨合碰撞，每一丝乳尖摩擦的酥麻与下腹部的空虚抽搐都被清晰放大了十倍！\n💭【${u}的实时内心感受】：“*最要命的就是我现在脑子清醒得不得了啊！💦正因为完全清醒，我才能清清楚楚地体会到胸前沉甸甸的晃动和两腿之间空荡荡的羞耻感……再这样下去，我的灵魂真的要被这具女体彻底同化掉了！🥵*”`)
                ]
            },
            // 3. 下流性癖库（严格依据总账次数开启，总账全0时显示无性癖，开启后为简短直白下流名）
            {
                title: "下流性癖库", icon: "🧬",
                summary: unlockedFetishes.length > 0 ? `已随总账解锁 ${unlockedFetishes.length} 项下流性癖` : `总账全0 · 暂无性癖 (纯洁待开发)`,
                items: fetishItems
            },
            // 4. 六孔解剖台（全身色情重口部位微距解剖 + 主角第一人称下流感受）
            {
                title: "六孔解剖台", icon: "🌸", summary: `处女一线鲍 · 闭合${vagClose}% · 六孔微距解剖`,
                items: [
                    mk(`👄 檀口香舌与娇啼声带：${mouthCnt}/100「口交${mouthCnt}次•空谷幽兰娇软声线」`,
                        btnOvr.骚口实况 || `【第一孔·薄红樱唇、香舌与声带解剖实况】：\n薄薄的红唇水润娇嫩，此刻因紧张而紧紧抿起，内里香舌粉嫩湿滑；原本通宵打游戏后沙哑干涩的男大学生嗓音，已被彻底改造为宛若空谷幽兰般清冽、却又带着酥软颤音的动画女优声线，稍微受惊便会溢出娇柔啼鸣。\n💭【${u}的实时内心感受】：“*刚才从喉咙里溢出来的那声‘呜、呀’，真的是我自己发出来的吗？！💦又软又脆简直像里番配音女优一样！要是待会儿跟柳翎师兄说话时不小心漏出这种娇喘声，他绝对会兽性大发的吧！🥵*”`),
                    mk(`🍒 饱满雪乳与充血蓓蕾：${Math.min(100, 15 + pleas * 3)}/100「沉甸丰盈•丝帛磨蹭过电」`,
                        btnOvr.胸部实况 || `【第二孔·胸前丰盈与未经人事蓓蕾解剖实况】：\n${rt.胸部实况 || `胸前两团沉甸甸的丰盈乳肉雪白软腻，随着站起身的动作在空气中微微一颠，将月白色紧身战袍内衬与轻薄的青白双色丝质裹胸绷得极紧；顶端两颗未经人事的挺立蓓蕾被丝帛轻轻摩擦后，瞬间激起一阵直窜后脑勺的酥麻电流！`}\n💭【${u}的实时内心感受】：“*救命，胸口这两团沉甸甸的肉块好重，拉扯着锁骨的异物感快把我的神经烧断了！❤️而且乳尖上的两颗小蓓蕾怎么这么敏感啊，只是被裹胸布料蹭了一下就浑身起鸡皮疙瘩，害我差点叫出声来……💦*”`),
                    mk(`🌺 纯阴处女白虎花苞：${100 - vagClose}/100「闭合度${vagClose}%•孔径${vagWidth}cm•春水初泌」`,
                        btnOvr.小穴实况 || `【第三孔·无毛粉嫩花唇与处女幽谷解剖实况】：\n${rt.小穴实况 || `二十多年来习以为常的男性器官已彻底消失，取而代之的是紧致如初生花苞般从未经人事的极品处女幽谷！两瓣粉嫩阴唇无一丝杂毛与暗沉，紧密贴合形成一道诱人的一线鲍（闭合度 ${vagClose}%，处女膜完好无损）；然而在开篇剧烈的羞耻与紧张刺激下，层叠紧窄的粉嫩内壁已开始分泌清亮爱液！`}\n💭【${u}的实时内心感受】：“*下半身空荡荡的……原本长在那里的东西彻底没了，变成了一条窄窄的、还在自己分泌湿热粘液的肉缝！😳💦想到这具身体连上厕所都必须蹲下来，而且开裆或衬裤摩擦着分泌爱液的阴唇这么羞耻，我就恨不得当场晕过去啊！🥵*”`),
                    mk(`🫀 纯阴子宫与敏感宫口：${cervixDrop}/100「下腹暖意•空虚酸软抽搐」`,
                        btnOvr.子宫实况 || `【第四孔·纯阴处子子宫苗床与宫颈口解剖实况】：\n${rt.子宫实况 || `深藏在纤细柳腰与平坦小腹内部的纯阴处子子宫温暖而紧致。此刻受法则重塑与门外男性逼近的紧张刺激，下腹部深处正泛起一阵阵莫名的暖意与空虚抽搐感，娇嫩的宫颈口微微一缩一缩，仿佛在本能地战栗着。`}\n💭【${u}的实时内心感受】：“*下腹部最深处那个地方……为什么从刚才开始就一直泛起莫名其妙的暖意，还在空虚地一抽一抽啊？！💦这就是女人子宫的感觉吗？明明从来没有被任何东西进出过，为什么会自己觉得空虚发酸啊……🥵*”`),
                    mk(`💧 敏感阴蒂与处女尿道口：${peeVal}/100「阴蒂${clitSize}mm•蹲坐排尿羞耻发麻」`,
                        btnOvr.阴蒂尿道 || `【第五孔·敏感阴蒂肉珠与尿道括约肌解剖实况】：\n包藏在粉嫩花唇顶端的敏感阴蒂小肉珠（${clitSize}mm）在贴身素色衬裤的紧绷摩擦下微微充血发麻；下方的细小处女尿道口则因“失去男性器官后必须褪裤蹲下排尿”的强烈心理冲击而括约肌阵阵发紧（当前尿意与失禁指数 ${peeVal}%）。\n💭【${u}的实时内心感受】：“*慌乱收拢膝盖的时候，两腿中间最敏感的那颗小肉珠被衬裤磨得好麻💦……而且一想到以后连排尿都要像真正的女孩子一样蹲下来从下面漏出来，我就羞耻得连小肚子都发麻了啊！🥵*”`),
                    mk(`🕳️ 粉嫩后庭菊蕾：${100 - analClose}/100「闭合度${analClose}%•紧致无瑕」`,
                        btnOvr.屁眼实况 || `【第六孔·浑圆臀缝与粉嫩菊穴解剖实况】：\n${rt.屁眼实况 || `在银丝软甲束带勒出的惊心动魄S型曲线下方，饱满挺翘的臀缝深处藏着一枚未经任何异物侵犯的粉嫩菊蕾（闭合度 ${analClose}%）。浅浅的樱粉色肉褶干净无瑕，正随着她剧烈的喘息而微微收缩颤动。`}\n💭【${u}的实时内心感受】：“*这根银丝束腰把腰勒得这么细，显得下面的曲线弯得吓人😳💦……连后面的小孔都因为太紧张而一缩一缩的，这种前凸后翘的身体走在路上简直就是犯罪啊！*”`)
                ]
            },
            // 5. 储精与体液（四穴完全拆开！各自拥有独立的储精含量进度条 + 爱液 + 贴身衣装摩擦）
            {
                title: "储精与体液", icon: "💦", summary: `四穴独立储精(${totalBellyMl}ml) · 爱液${wetLevel}%`,
                items: [
                    mk(`👄 【口穴与胃袋】储精含量：${mouthMl}/100ml「${mouthMl > 0 ? `已吞精${mouthMl}ml•唇齿留腥` : "0ml•清甜处子津液"}」`,
                        btnOvr.口穴储精 || `【第一储精池·骚口口腔与胃袋精液含量实况】：\n当前口腔与胃袋内蓄积雄性精液：${mouthMl}ml / 满载100ml（历史累计吞精 ${cnt.精液摄入?.吞精次数 || 0} 次，共 ${swallowMl}ml）。\n${mouthMl > 0 ? `浓稠腥膻的白浊精液正挂在粉嫩舌苔与咽喉深处，胃袋里装满滚烫精浆，每一次打嗝或呼吸都散发着浓烈的石楠花精臭味！` : `当前口腔与胃袋内精液含量为 0ml，尚未被雄性肉棒射入浓精，唇齿间只有因紧张喘息而分泌的清甜处子津液与幽兰香气。`}\n💭【${u}的实时内心感受】：“*${mouthMl > 0 ? `呕咕……嘴里和胃里全都是男人射进来的腥臭浓精，连舌头根部都粘糊糊的，好下流啊🥵💦！` : `现在我的嘴里还是干干净净的……绝对不能沦落到跪在男人胯下张嘴接精液的地步啊！💦`}*”`),
                    mk(`🌺 【骚逼阴道腔】储精含量：${vagMl}/100ml「${vagMl > 0 ? `穴内灌精${vagMl}ml•白浊滴淌` : "0ml•处女春水润滑"}」`,
                        btnOvr.小穴储精 || `【第二储精池·处女阴道肉腔精液含量实况】：\n当前阴道肉腔内残留雄性精液：${vagMl}ml / 满载100ml（当前前穴贯穿 ${vagCnt} 次）。\n${vagMl > 0 ? `层层叠叠的阴道软肉间灌满了 ${vagMl}ml 滚烫黏稠的乳白精液，随着双腿移动发出噗嗤噗嗤的淫靡水声，正顺着合不拢的花唇肉缝往大腿内侧滴淌！` : `当前阴道腔内精液含量为 0ml，未经人事的紧窄处子肉壁间流淌着纯粹清澈的天然爱液，花唇紧闭守护着最深处的纯洁。`}\n💭【${u}的实时内心感受】：“*${vagMl > 0 ? `呜呜……小穴里面被射得满满当当的，黏糊糊的热精液顺着大腿根直往下流，根本夹不住啊🥵💦！` : `虽然还没有被男人的精液灌进来过，但小穴自己分泌的爱液已经把衬裤弄湿了，湿滑得让人心慌啊……😳💦`}*”`),
                    mk(`🫀 【子宫受孕腔】储精含量：${wombMl}/150ml「${wombMl > 0 ? `宫腔灌满${wombMl}ml•受孕率${v.受孕与生理?.受孕概率 || 35}%` : "0ml•纯阴空虚抽搐"}」`,
                        btnOvr.子宫储精 || `【第三储精池·纯阴子宫苗床精液含量实况】：\n当前子宫深腔内蓄积雄性浓精：${wombMl}ml / 极限容量150ml（累计被内射 ${creampie} 次，受孕概率 ${v.受孕与生理?.受孕概率 || 0}%）。\n${wombMl > 0 ? `滚烫高浓度的雄性精液已冲破宫颈口直灌入子宫最深处！${wombMl}ml 浓精将原本平坦的小腹撑起微隆的蛙肚弧度，亿万精子正在疯狂围攻纯阴卵子！` : `当前子宫腔内精液含量为 0ml，纯洁的处子子宫尚未被任何外来浓精污染，但下腹部深处正因紧张而泛起莫名的暖意与空虚抽搐。`}\n💭【${u}的实时内心感受】：“*${wombMl > 0 ? `肚子里好沉、好烫……子宫被射进了这么多精液，小肚子都鼓起来了，真的要怀孕变成大肚子母狗了啦🥵💦❤️！` : `这具身体可是极品纯阴之体，要是哪天真的被男人破处内射进子宫里，怕不是一发就会直接中招怀上小宝宝吧？！太恐怖了啊！💦🥵`}*”`),
                    mk(`🕳️ 【屁眼直肠腔】储精含量：${analMl}/120ml「${analMl > 0 ? `肛内灌精${analMl}ml•肠壁蠕动` : "0ml•粉嫩菊口紧闭"}」`,
                        btnOvr.屁眼储精 || `【第四储精池·后庭直肠腔精液含量实况】：\n当前后庭直肠内蓄积雄性精液：${analMl}ml / 满载120ml（累计后庭开发 ${analCnt} 次）。\n${analMl > 0 ? `滚烫的白浊精浆被深深射进直肠内部，达 ${analMl}ml 的精液带来强烈的坠胀排泄感，灼热的肠壁正本能地蠕动吸收着精液水分！` : `当前后庭肠腔内精液含量为 0ml，粉嫩紧致的菊蕾完好闭合，未受任何精液与异物灌注。`}\n💭【${u}的实时内心感受】：“*${analMl > 0 ? `连后面的屁眼都被当成精液袋子灌满了……肚子又胀又麻，走一步路都怕从后面漏出来啊🥵💦！` : `后面的小孔紧得很，绝对不能让任何人打那里奇奇怪怪的主意啊！😳`}*”`),
                    mk(`💦 处子爱液分泌与体香：${wetLevel}/100「幽兰体香•花唇泌水湿润」`,
                        btnOvr.爱液分泌 || `【雌穴爱液分泌与催情体香实况】：\n当前私处爱液湿润度：${wetLevel}/100。刚刚重塑的纯阴娇躯对外界刺激敏锐到了极点，衬裤下的阴唇已经开始分泌清澈滑腻的爱液，混杂着肌肤表面散发出的若有若无的清雅幽兰处子体香与微汗，形成令人血脉偾张的雌性气息！\n💭【${u}的实时内心感受】：“*明明我脑子里紧张得要命，为什么下面的阴唇却自己开始分泌爱液了啊？！💦湿湿热热的粘在素色衬裤上，这种不受大脑控制的生理反应太羞人了！🥵*”`),
                    mk(`👗 穿戴衣装与随身标记物：「${curCloth.slice(0, 20)}…」`,
                        btnOvr.当前衣装 || `【当前穿戴衣装与贴身摩擦实况】：\n${curCloth}。\n每一个细微动作都让青白双色丝质裹胸与修身衬裤紧贴摩擦着娇嫩的乳肉与微湿的花唇；而耗尽微光的罪魁祸首“现实修改笔”已塞入长袍内袋贴身藏好。\n💭【${u}的实时内心感受】：“*这身月白色的云纹束腰战袍裙好看是好看，可里面的丝质裹胸也太贴身了，稍微喘口气都在磨蹭乳尖💦……那根害惨我的破笔现在就在内袋里硌着胸口，我可得藏好了千万不能让人搜出来！🥵*”`)
                ]
            },
            // 6. 淫乱总账本（决定性癖开启的权威计数器）
            {
                title: "淫乱总账本", icon: "💎", summary: `小穴${vagCnt} · 口${mouthCnt} · 内射${creampie} · 高潮${orgasmCnt}`,
                items: [
                    mk(`💎 六孔性交破瓜总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${cnt.性交?.乳穴 || 0}／足${cnt.性交?.足腿 || 0}」`,
                        `【各孔穴开发累计次数（决定性癖自动开启）】：\n骚逼贯穿：${vagCnt} 次 ｜ 骚口深喉：${mouthCnt} 次 ｜ 屁眼后庭：${analCnt} 次 ｜ 丰乳夹击：${cnt.性交?.乳穴 || 0} 次 ｜ 玉足摩擦：${cnt.性交?.足腿 || 0} 次。\n💭【${u}的实时内心感受】：“*${(vagCnt + mouthCnt + analCnt) === 0 ? `目前所有性交次数全都是 0！我这具倾国倾城的十八岁处子之躯还完完整整地守着清白💦，所以一个下流性癖都还没有开启，一定要继续守住底线啊！` : `呜呜……次数已经不是0了，身体被开发过的记忆根本抹不掉，连下流性癖都被彻底撞开了呀🥵💦！`}*”`),
                    mk(`💎 高潮泄身与失禁总账：「高潮${orgasmCnt}次／喷潮${cnt.失控?.喷潮 || 0}次／失禁${leakCnt}次／自慰${cnt.自慰 || 0}次」`,
                        `【高潮与身体失控累计记录】：\n累计绝顶高潮：${orgasmCnt} 次 ｜ 潮吹喷水：${cnt.失控?.喷潮 || 0} 次 ｜ 羞耻漏尿失禁：${leakCnt} 次 ｜ 私下自慰：${cnt.自慰 || 0} 次。\n💭【${u}的实时内心感受】：“*光是衣服磨蹭一下乳尖快感就已经累积到 ${pleas}% 了，要是真的被谁按住揉捏那里，这具敏感过头的纯阴肉体怕不是会瞬间破功高潮啊……💦🥵*”`),
                    mk(`💎 射精承受与吞精总账：「内射${creampie}次／颜射${cnt.射精?.颜射体外 || 0}次／吞精${cnt.精液摄入?.吞精次数 || 0}次(${swallowMl}ml)」`,
                        `【雄性精液承受累计记录】：\n子宫内射：${creampie} 次 ｜ 颜射与体外射精：${cnt.射精?.颜射体外 || 0} 次 ｜ 口穴吞精：${cnt.精液摄入?.吞精次数 || 0} 次（累计吞咽 ${swallowMl}ml）。\n💭【${u}的实时内心感受】：“*我现在可是云岚宗少宗主，怎么能去承受男人的那种腥臭白浊啊😳💦……绝对要把这项记录永远保持在 0 次！*”`),
                    mk(`💎 露出视奸与娼妓卖身：「露出${cnt.暴露?.露出 || 0}次／围观${cnt.暴露?.被围观人次 || 0}人／接客${cnt.交易?.接客卖身 || 0}次」`,
                        `【公开羞辱与风月交易累计记录】：\n当众露出：${cnt.暴露?.露出 || 0} 次 ｜ 被围观视奸：${cnt.暴露?.被围观人次 || 0} 人次 ｜ 接客卖身：${cnt.交易?.接客卖身 || 0} 次。\n💭【${u}的实时内心感受】：“*要是堂堂纳兰家大小姐的身体被人看光甚至拿去接客，那我真的不用在斗气大陆混了，打死也不能让这种事发生啊！💦🥵*”`)
                ]
            }
        ];
    }

    function getFallbackData(latestChatText = "") {
        const ctx = safeCtx();
        return {
            charName: ctx?.name1 || "伊一",
            floorId: `${ctx?.name2 || "当前角色"} · 实时`,
            categories: buildFullFallbackCategories(ctx?.name1 || "伊一", ctx?.name2 || "当前角色", curVars, latestChatText)
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

    function buildVarUpdatePrompt(u, rawText) {
        return `你是状态栏后台变量更新引擎(V17)。请阅读下方最新故事正文，结合当前变量JSON，输出且仅输出一个 <UpdateVariable>...</UpdateVariable> 块（内含若干行 _.set('${u}.路径', 新值); 语句），绝对不要输出任何其他解释文字！
【必须同步更新与后期自动补全的重点字段】：
1. 根据正文真实剧情更新 ${u}.身体.体力、${u}.精神与心理（羞耻度/服从度/沦陷度/快感累积/意识清醒度/人格崩解度）、${u}.核心数值（对肉棒好感度/性欲程度/淫乱恶堕）；
2. 严格依据正文真实描写更新 ${u}.档案.身份与背景、${u}.档案.肉体外貌实况（严禁编造正文没写的数字）、${u}.实况.内心独白（第一人称带❤️💦🥵表情的独白）、${u}.实况.当前姿势、${u}.实况.当前衣装；
3. 若发生射精或性交，分别更新四穴储精（${u}.体内精液存量.口内毫升 / 小穴毫升 / 子宫毫升 / 屁眼毫升）及 ${u}.计数.*；
4. **性癖规则**：若计数总账全为0，保持 ${u}.性癖.条目 为 []；若总账次数 > 0，用简短直白下流的名字（3~5字，如“榨精癖”、“深喉吞精癖”、“内射孕肚癖”）更新 ${u}.性癖.条目（格式：“简短名-成因-第X阶段-数值/100”）；
5. 请用 _.set('${u}.按钮详情.键名', '【生理与肉体反应】：...(直白下流描写)\\n💭【${u}的实时内心感受】：“*...(带❤️💦🥵的第一人称心声)*”') 覆写本回合变化最大的按钮详情（可选键名：身份与背景、肉体外貌、当前姿势、骚口实况、胸部实况、小穴实况、子宫实况、口穴储精、小穴储精、子宫储精、屁眼储精、爱液分泌、当前衣装）。

当前变量JSON：
${JSON.stringify(curVars)}

最新故事正文：
${rawText.slice(-3500)}

请立即输出 <UpdateVariable> 块：`;
    }

    function applyApiReplyToFloor(reply, targetMsg, fid, sourceLabel = "API") {
        if (!reply || !reply.includes("_.set(")) return 0;
        const cleanSet = reply.replace(/```[a-z]*|```/gi, "").replace(/<\/?UpdateVariable>/gi, "").trim();
        const setCount = (cleanSet.match(/_\.set\s*\(/g) || []).length;
        if (targetMsg) {
            if (/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/i.test(targetMsg.mes)) {
                targetMsg.mes = targetMsg.mes.replace(/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/i, `<UpdateVariable>\n${cleanSet}\n</UpdateVariable>`);
            } else {
                targetMsg.mes += `\n<UpdateVariable>\n${cleanSet}\n</UpdateVariable>`;
            }
        }
        recalc(true); cleanDOM(fid, true);
        showToast(`✅ ${sourceLabel}强刷成功！已同步 ${setCount} 项实况与心声`, "success", 3800);
        return setCount;
    }

    async function triggerMainApiForceUpdate(btnEl = null) {
        const ctx = safeCtx(), chat = ctx?.chat || [];
        if (!chat.length) { showToast("⚠️ 当前没有任何聊天记录可供刷新！", "error"); return; }
        const fid = chat.length - 1, targetMsg = chat[fid], rawText = targetMsg?.mes || "", u = ctx?.name1 || "伊一";
        const oldTxt = btnEl ? btnEl.textContent : "";
        if (btnEl) btnEl.textContent = "⏳ 补全中...";
        showToast("⏳ 正在调用主 API 依据正文补全各按钮详情与第一人称心声...", "info", 5000);
        try {
            const prompt = buildVarUpdatePrompt(u, rawText);
            let reply = "";
            const quietFn = generateQuietPrompt || ctx?.generateQuietPrompt || window.generateQuietPrompt;
            if (typeof quietFn === "function") {
                try { reply = await quietFn(prompt, false, false); } catch (e1) { reply = await quietFn({ quietPrompt: prompt }); }
            } else if (typeof window.TavernHelper?.generateRaw === "function") {
                reply = await window.TavernHelper.generateRaw({ ordered_prompts: [{ role: "user", content: prompt }] });
            } else if (userSettings.apiUrl && userSettings.apiKey) {
                await triggerExternalApiUpdate(fid, btnEl); return;
            } else {
                throw new Error("当前酒馆未暴露静默接口，请配置副API");
            }
            const count = applyApiReplyToFloor(reply, targetMsg, fid, "主API");
            if (count > 0) { if (btnEl) btnEl.textContent = `✅ 已补全(${count}项)`; }
            else { recalc(true); cleanAll(true); if (btnEl) btnEl.textContent = "✅ 已扫描同步"; }
        } catch (err) {
            console.error(err);
            if (btnEl) btnEl.textContent = "❌ 强刷失败";
            showToast("❌ 主API强刷失败：" + (err.message || "请检查连接"), "error", 4500);
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
        if (btn) btn.textContent = "⏳ 副API补全中...";
        try {
            const u = ctx?.name1 || "伊一", prompt = buildVarUpdatePrompt(u, rawText);
            const res = await fetch(chatUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userSettings.apiKey}` },
                body: JSON.stringify({
                    model: userSettings.apiModel || "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "你是一个只输出 <UpdateVariable>_.set(...);</UpdateVariable> 代码块的变量与重口文本补全引擎。" },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.3, stream: false
                })
            });
            const data = await res.json();
            const reply = data?.choices?.[0]?.message?.content || "";
            const count = applyApiReplyToFloor(reply, targetMsg, fid, "副API");
            if (count > 0 && btn) btn.textContent = `✅ 副API同步(${count}项)`;
        } catch (err) {
            if (btn) btn.textContent = "❌ 失败";
            showToast("❌ 副API更新失败：" + (err.message || "网络错误"), "error", 4500);
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
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎨 1. 深度定制主题样式（含纹理与光效）</div>
                <div id="st-v12-themes" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"></div>
            </div>
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">📐 2. 窗口尺寸与字号缩放</div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>宽度 (<b id="st-w-val">${userSettings.width}</b>px)：</span><input id="st-w-rng" type="range" min="320" max="900" value="${userSettings.width}" style="flex:1;accent-color:${tc.prim};"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>高度 (<b id="st-h-val">${userSettings.height}</b>px)：</span><input id="st-h-rng" type="range" min="340" max="920" value="${userSettings.height}" style="flex:1;accent-color:${tc.prim};"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>字号 (<b id="st-z-val">${userSettings.fontScale}</b>%)：</span><input id="st-z-rng" type="range" min="80" max="135" value="${userSettings.fontScale}" style="flex:1;accent-color:${tc.prim};"></div>
            </div>
            <div style="background:${tc.card};border:${tc.cardBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🔌 3. 副 API 自动补全下流按钮详情</div>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input id="st-api-chk" type="checkbox" ${userSettings.apiSyncEnabled ? "checked" : ""} style="accent-color:${tc.prim};"><span>每回合结束后自动调用副 API 补全各按钮详情与心声</span></label>
                <input id="st-api-url" type="text" placeholder="API 地址，如 https://api.openai.com/v1" value="${userSettings.apiUrl || ""}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                <input id="st-api-key" type="password" placeholder="API Key (sk-...)" value="${userSettings.apiKey || ""}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                <div style="display:flex;gap:6px;align-items:center;">
                    <input id="st-api-mod" type="text" placeholder="模型名称" value="${userSettings.apiModel || ""}" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                    <button id="st-v13-fetch-models" type="button" style="background:rgba(203,166,247,0.25);color:#f5c2e7;border:1px solid ${tc.sec};border-radius:6px;padding:6px 10px;font-weight:bold;cursor:pointer;white-space:nowrap;font-size:12px;">📥 拉取模型</button>
                </div>
                <select id="st-api-mod-sel" style="display:${hasModels ? "block" : "none"};background:#11111b;color:#f9e2af;border:1px solid ${tc.prim};border-radius:6px;padding:6px 8px;font-size:12px;cursor:pointer;">
                    ${(userSettings.modelList || []).map(m => `<option value="${m}" ${m === userSettings.apiModel ? "selected" : ""}>${m}</option>`).join("")}
                </select>
                <div style="display:flex;gap:8px;margin-top:4px;">
                    <button id="st-v12-api-save" type="button" style="flex:1;background:${tc.prim};color:#11111b;border:none;border-radius:8px;padding:7px;font-weight:bold;cursor:pointer;">💾 保存设置并返回</button>
                    <button id="st-v12-api-test" type="button" style="flex:1;background:${tc.hi};color:#fff;border:1px solid ${tc.sec};border-radius:8px;padding:7px;font-weight:bold;cursor:pointer;">⚡ 副API立即补全本层</button>
                </div>
            </div>`;
        body.appendChild(box);

        const tBox = box.querySelector("#st-v12-themes");
        Object.keys(THEMES).forEach(tName => {
            const tb = document.createElement("button"); tb.type = "button";
            const act = userSettings.theme === tName;
            tb.style.cssText = `padding:8px;border-radius:${THEMES[tName].radius};cursor:pointer;font-weight:bold;font-size:12px;border:${act ? THEMES[tName].border : "1px solid rgba(255,255,255,0.15)"};background:${THEMES[tName].bg};color:${THEMES[tName].text};box-shadow:${act ? THEMES[tName].shadow : "none"};`;
            tb.textContent = (act ? "✅ " : "🎨 ") + tName;
            tb.onclick = () => { userSettings.theme = tName; saveSettings(); applyThemeAndSize(); recalc(); };
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
            showToast("💾 状态栏设置已保存！", "success", 2000);
        };
        box.querySelector("#st-v12-api-test").onclick = () => {
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
        const d = (latestStatus && latestStatus.categories?.length) ? latestStatus : getFallbackData();
        const setTxt = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
        setTxt("st-v5-btn-txt", `👑 ${d.charName || "主角"} · 状态栏`);
        setTxt("st-v5-title", `${d.charName || "主角"} (${typeof d.floorId === "number" ? "#" + d.floorId + "层" : d.floorId})`);

        const tabBar = document.getElementById("st-v5-tabs");
        if (tabBar) {
            tabBar.innerHTML = "";
            const homeBtn = document.createElement("button"); homeBtn.type = "button";
            const isHome = activeCat === null && !inSettings;
            homeBtn.style.cssText = `flex-shrink:0;padding:4px 10px;border-radius:99px;font-size:11.5px;font-weight:bold;cursor:pointer;border:1px solid ${isHome ? tc.prim : "rgba(255,255,255,0.12)"};background:${isHome ? tc.prim : "rgba(255,255,255,0.06)"};color:${isHome ? "#11111b" : tc.text};`;
            homeBtn.textContent = "🏠6大总览";
            homeBtn.onclick = () => { inSettings = false; activeCat = null; renderBody(); };
            tabBar.appendChild(homeBtn);

            d.categories.forEach((cat, idx) => {
                const tb = document.createElement("button"); tb.type = "button";
                const isAct = !inSettings && activeCat === idx;
                tb.style.cssText = `flex-shrink:0;padding:4px 10px;border-radius:99px;font-size:11.5px;font-weight:bold;cursor:pointer;border:1px solid ${isAct ? tc.prim : "rgba(255,255,255,0.15)"};background:${isAct ? tc.hi : "rgba(0,0,0,0.35)"};color:${isAct ? tc.prim : tc.text};`;
                tb.textContent = `${cat.icon}${SHORT_NAMES[cat.title] || cat.title.slice(0, 2)}`;
                tb.onclick = () => { inSettings = false; activeCat = idx; renderBody(); };
                tabBar.appendChild(tb);
            });
        }

        const body = document.getElementById("st-v5-body");
        if (!body) return;
        body.innerHTML = "";
        if (inSettings) { renderSettingsView(body); return; }

        if (activeCat === null || !d.categories[activeCat]) {
            // 顶部快速重口状态徽章栏
            const vagCnt = Number(curVars.计数?.性交?.小穴) || 0;
            const shameVal = Number(curVars.精神与心理?.羞耻度 ?? 100);
            const pleasVal = Number(curVars.精神与心理?.快感累积) || 0;
            const badgeBanner = document.createElement("div");
            badgeBanner.style.cssText = `margin-bottom:10px;padding:8px 12px;background:rgba(0,0,0,0.4);border:${tc.cardBorder};border-radius:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;font-size:11.5px;`;
            badgeBanner.innerHTML = `
                <span style="color:#f9e2af;font-weight:bold;">${vagCnt === 0 ? "🌸 极品纯阴处子 (未破瓜)" : `🌺 已破瓜开发 (${vagCnt}次)`}</span>
                <span style="color:${tc.prim};">😳 羞耻: <b>${shameVal}%</b></span>
                <span style="color:${tc.sec};">💓 快感: <b>${pleasVal}%</b></span>`;
            body.appendChild(badgeBanner);

            const grid = document.createElement("div");
            grid.style.cssText = "display:grid;grid-template-columns:repeat(2,1fr);gap:10px;";
            d.categories.forEach((cat, idx) => {
                const b = document.createElement("div");
                b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-left:4px solid ${tc.prim};border-radius:12px;padding:12px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:6px;box-shadow:0 4px 14px rgba(0,0,0,0.45);`;
                b.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:14px;font-weight:bold;color:${tc.prim};">${cat.icon} ${cat.title}</span><span style="font-size:10.5px;background:${tc.hi};color:${tc.text};padding:1px 7px;border-radius:99px;">${cat.items.length}项 ▸</span></div><div style="font-size:11.5px;color:${tc.sub};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${cat.summary || `共 ${cat.items.length} 项深度实况`}</div>`;
                b.onclick = (e) => { e.stopPropagation(); activeCat = idx; renderBody(); };
                grid.appendChild(b);
            });
            body.appendChild(grid);
        } else {
            const cat = d.categories[activeCat], list = document.createElement("div");
            list.style.cssText = "display:flex;flex-direction:column;gap:10px;";
            cat.items.forEach((it, idx) => {
                const b = document.createElement("div");
                b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-radius:12px;padding:11px 13px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 12px rgba(0,0,0,0.45);`;
                const parts = (it.desc || "").split("💭");
                const objPreview = parts[0].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 44) + "…";
                const thoughtPreview = parts[1] ? "💭 " + parts[1].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 40) + "…" : "";
                b.innerHTML = `${it.keyHTML}${it.barHTML || ""}
                    <div style="font-size:11.5px;color:${tc.sub};margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${objPreview}</div>
                    ${thoughtPreview ? `<div style="font-size:11.5px;color:#ffd6e7;font-style:italic;background:rgba(243,139,168,0.12);padding:4px 8px;border-radius:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${thoughtPreview}</div>` : ""}
                    <div style="display:flex;justify-content:flex-end;margin-top:2px;"><span style="color:${tc.prim};font-size:11px;font-weight:bold;">点开查看完整实况与心声 ▸</span></div>`;
                b.onclick = (e) => { e.stopPropagation(); showDetailPopup(idx); };
                list.appendChild(b);
            });
            body.appendChild(list);
        }
    }

    // 【核心修复】：不再使用与酒馆原生全局事件冲突的 `.inline-drawer-toggle` 类名，改为自定义受控折叠盒，点击 100% 稳定展开！
    function mountExtensionSettingsMenu() {
        const container = document.getElementById("extensions_settings") || document.getElementById("extensions_settings2");
        if (!container || document.getElementById("st-v17-ext-drawer")) return;
        document.getElementById("st-v16-ext-drawer")?.remove();

        const drawer = document.createElement("div");
        drawer.id = "st-v17-ext-drawer";
        drawer.style.cssText = "margin-bottom:8px;border:1px solid rgba(243,139,168,0.35);border-radius:8px;overflow:hidden;background:rgba(0,0,0,0.2);";
        drawer.innerHTML = `
            <div id="st-v17-ext-header" style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;cursor:pointer;user-select:none;background:rgba(243,139,168,0.12);">
                <b style="color:#f5c2e7;font-size:13.5px;">📊 终极重口状态栏引擎 V17</b>
                <span id="st-v17-ext-arrow" style="color:#f38ba8;font-weight:bold;transition:transform 0.2s;">▼ 展开设置</span>
            </div>
            <div id="st-v17-ext-content" style="display:none;padding:12px;font-size:13px;border-top:1px solid rgba(255,255,255,0.1);">
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;">
                    <input id="st-v17-ext-enable" type="checkbox" ${userSettings.enabled ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span><b>启用状态栏悬浮窗与后台变量注入</b>（取消勾选即可彻底关闭隐藏）</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;cursor:pointer;">
                    <input id="st-v17-ext-hide" type="checkbox" ${userSettings.hideRawBlock ? "checked" : ""} style="width:16px;height:16px;accent-color:#f38ba8;">
                    <span>自动折叠隐藏聊天正文尾部的原始【状态栏】与代码文本</span>
                </label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button id="st-v17-ext-open" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">👑 立即呼出状态栏面板</button>
                    <button id="st-v17-ext-sync" class="menu_button" type="button" style="width:auto;padding:5px 12px;cursor:pointer;">🔄 重新扫描全部楼层</button>
                </div>
            </div>`;
        container.appendChild(drawer);

        const header = drawer.querySelector("#st-v17-ext-header");
        const content = drawer.querySelector("#st-v17-ext-content");
        const arrow = drawer.querySelector("#st-v17-ext-arrow");

        header.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = content.style.display === "none";
            content.style.display = isHidden ? "block" : "none";
            arrow.textContent = isHidden ? "▲ 收起设置" : "▼ 展开设置";
        });

        drawer.querySelector("#st-v17-ext-enable").addEventListener("change", (e) => {
            userSettings.enabled = e.target.checked;
            saveSettings(); applyThemeAndSize();
            showToast(userSettings.enabled ? "✅ 状态栏插件已开启！" : "⏸️ 状态栏插件已隐藏关闭！", "info", 2000);
        });
        drawer.querySelector("#st-v17-ext-hide").addEventListener("change", (e) => {
            userSettings.hideRawBlock = e.target.checked;
            saveSettings(); cleanAll(true);
        });
        drawer.querySelector("#st-v17-ext-open").addEventListener("click", (e) => {
            e.stopPropagation();
            userSettings.enabled = true;
            const chk = document.getElementById("st-v17-ext-enable");
            if (chk) chk.checked = true;
            saveSettings(); applyThemeAndSize();
            const panel = document.getElementById("st-v5-panel");
            if (panel) { panel.style.display = "flex"; renderBody(); }
        });
        drawer.querySelector("#st-v17-ext-sync").addEventListener("click", (e) => {
            e.stopPropagation();
            recalc(true); cleanAll(true);
            showToast("✅ 已重新扫描全部楼层并同步状态栏！", "success", 2000);
        });
    }

    function mountUI() {
        loadSettings();
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
        <div id="st-v5-panel" style="display:none;position:relative;margin-top:8px;width:${userSettings.width}px;height:${userSettings.height}px;min-width:320px;min-height:340px;max-width:96vw;max-height:88vh;background:linear-gradient(165deg,#181424,#1e192b);border:2px solid #f38ba8;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.92);color:#ede6f2;flex-direction:column;overflow:hidden;">
            <div id="st-v5-header" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.12);cursor:grab;user-select:none;touch-action:none;flex-shrink:0;gap:6px;">
                <b id="st-v5-title" style="color:#f5c2e7;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">主角档案</b>
                <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
                    <button id="st-v5-refresh-btn" type="button" title="调用主API自动补全并覆写本层所有按钮的下流详情与心声" style="background:rgba(166,227,161,0.22);color:#a6e3a1;border:1px solid rgba(166,227,161,0.55);border-radius:8px;padding:2px 8px;cursor:pointer;font-size:11.5px;font-weight:bold;">🔄 补全详情</button>
                    <button id="st-v5-cfg-btn" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.25);border-radius:8px;padding:2px 8px;cursor:pointer;font-size:11.5px;font-weight:bold;">⚙️ 设置</button>
                    <span id="st-v5-close" style="cursor:pointer;color:#f38ba8;font-size:16px;font-weight:bold;padding:0 4px;">✕</span>
                </div>
            </div>
            <div id="st-v5-tabs" style="display:flex;gap:5px;overflow-x:auto;padding:8px 12px;background:rgba(0,0,0,0.35);border-bottom:1px solid rgba(255,255,255,0.07);scrollbar-width:none;flex-shrink:0;"></div>
            <div id="st-v5-body" style="padding:12px 14px;overflow-y:auto;flex:1;"></div>
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
                if (mode === "r" || mode === "rb") { userSettings.width = Math.max(320, Math.min(920, sw + dx)); panel.style.width = userSettings.width + "px"; }
                if (mode === "b" || mode === "rb") { userSettings.height = Math.max(340, Math.min(920, sh + dy)); panel.style.height = userSettings.height + "px"; }
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
            document.querySelectorAll(".mes_text[data-st-cleaned]").forEach(el => el.removeAttribute("data-st-cleaned"));
            recalc(true); cleanAll(true);
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

    function mapToSixCategoryTitle(rawTitle) {
        const t = rawTitle.trim();
        if (ICONS[t]) return t;
        if (t.includes("档案") || t.includes("身体") || t.includes("特殊")) return "档案与肉体";
        if (t.includes("核心") || t.includes("精神") || t.includes("心理")) return "恶堕与精神";
        if (t.includes("性癖")) return "下流性癖库";
        if (t.includes("性器官") || t.includes("六孔")) return "六孔解剖台";
        if (t.includes("排泄") || t.includes("体液") || t.includes("储精") || t.includes("服装") || t.includes("道具")) return "储精与体液";
        if (t.includes("计数")) return "淫乱总账本";
        return "档案与肉体";
    }

    function extractText(txt, fid) {
        if (!txt || (!txt.includes("状态栏") && !txt.includes("[[角色档案]]") && !txt.includes("[[档案与肉体]]"))) return null;
        const nm = txt.match(/(?:【|\[)\s*状态栏\s*[｜|:：]\s*([^】\]\n]+?)\s*(?:】|\])/);
        const cName = nm ? nm[1].trim() : (safeCtx()?.name1 || "伊一");
        let bodyTxt = txt;
        const startMatch = txt.match(/(?:【|\[)\s*状态栏[^\n]*(?:】|\])|\[\[\s*(?:角色档案|档案与肉体)\s*\]\]/);
        if (startMatch) {
            const startIdx = startMatch.index + (startMatch[0].includes("[[") ? 0 : startMatch[0].length);
            const rest = txt.slice(startIdx);
            const endMatch = rest.match(/(?:【|\[)\s*\/\s*状态栏\s*(?:】|\])|<UpdateVariable>|_\.set\(|<\/game>|<\/content>/i);
            bodyTxt = endMatch ? rest.slice(0, endMatch.index) : rest;
        }

        const catMap = new Map();
        const getOrMakeCat = (rawT) => {
            const mapped = mapToSixCategoryTitle(rawT);
            if (!catMap.has(mapped)) catMap.set(mapped, { title: mapped, icon: ICONS[mapped] || "📁", items: [] });
            return catMap.get(mapped);
        };

        let cur = null, lastItem = null;
        bodyTxt.split("\n").forEach(r => {
            const l = r.trim().replace(/^(?:<[^>]+>|\*\*)+|(?:\*\*|<[^>]+>)+$/g, "").trim();
            if (!l) return;
            const inlineCat = l.match(/^(?:[#*\-\s]*)\[\[\s*(.+?)\s*\]\]\s*(?:->|→|-＞|＞)\s*(.+)$/);
            if (inlineCat) {
                cur = getOrMakeCat(inlineCat[1]);
                const rhs = inlineCat[2].trim(), parts = rhs.split(/\s*[|｜]\s*/);
                if (parts.length >= 2 && !rhs.includes(":")) {
                    const rawKey = parts[0].replace(/\*\*/g, "").trim(), desc = parts.slice(1).join(" ｜ ").trim();
                    lastItem = { rawKey, desc, ...fmtKey(rawKey) }; cur.items.push(lastItem);
                }
                return;
            }
            const sm = l.match(/^(?:[#*\-\s]*)\[\[\s*(.+?)\s*\]\](?:[*]*)$/);
            if (sm) { cur = getOrMakeCat(sm[1]); lastItem = null; return; }
            const im = l.match(/^(?:->|→|-＞|＞|[-•·])\s*([^|｜]+?)\s*[|｜]\s*(.+)$/);
            if (im && cur) {
                const rawKey = im[1].replace(/\*\*/g, "").trim(), desc = im[2].trim();
                lastItem = { rawKey, desc, ...fmtKey(rawKey) }; cur.items.push(lastItem);
            } else if (lastItem && !l.startsWith("【") && !l.startsWith("_.set") && !l.startsWith("<")) {
                lastItem.desc += "\n" + l;
            }
        });
        const cats = Array.from(catMap.values()).filter(c => c.items.length > 0);
        return cats.length ? { charName: cName, floorId: fid, categories: cats } : null;
    }

    function applySetStatements(text, targetVars) {
        if (!text || !text.includes("_.set")) return;
        const lines = text.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line.includes("_.set(")) continue;
            const m = line.match(/_\.set\(\s*(?:(['"`])([^'"`]+)\1|([^,]+?))\s*,\s*(.+?)\)\s*;?\s*$/);
            if (!m) continue;
            const rawPath = (m[2] || m[3] || "").trim(), rawVal = (m[4] || "").trim();
            if (!rawPath) continue;
            try {
                let val;
                if (/^-?\d+(?:\.\d+)?$/.test(rawVal)) val = Number(rawVal);
                else if (rawVal === "true" || rawVal === "false") val = rawVal === "true";
                else val = Function(`"use strict";return (${rawVal});`)();
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

    function mergeStatusWithVars(extracted, fallback) {
        if (!extracted) return fallback;
        const map = new Map();
        extracted.categories.forEach(c => map.set(c.title, c));
        const mergedCats = fallback.categories.map(fbCat => {
            // 下流性癖库与储精与体液严格使用V17精细拆分结构
            if (fbCat.title === "下流性癖库" || fbCat.title === "储精与体液") return fbCat;
            const exCat = map.get(fbCat.title);
            if (exCat && exCat.items.length > 0) {
                const enriched = fbCat.items.map((fbItem, idx) => {
                    const exItem = exCat.items[idx];
                    if (exItem && exItem.desc && exItem.desc.length > 120 && exItem.desc.includes("💭")) {
                        return { ...exItem, ...fmtKey(exItem.rawKey) };
                    }
                    return fbItem;
                });
                return { ...fbCat, items: enriched };
            }
            return fbCat;
        });
        return { charName: extracted.charName || fallback.charName, floorId: extracted.floorId, categories: mergedCats };
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
            h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 查看此层 (#${id}) V17重口状态栏</div>`;
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

    function recalc(forceAll = false) {
        try {
            mountExtensionSettingsMenu();
            const ctx = safeCtx(), fv = getInitialVars(); curVars = fv;
            const chat = ctx?.chat || []; let last = null, latestChatText = "";
            for (let i = 0; i < chat.length; i++) { const t = chat[i]?.mes || ""; if (t.includes("_.set(")) applySetStatements(t, fv); }
            const scanStart = forceAll ? 0 : Math.max(0, chat.length - 25);
            for (let i = scanStart; i < chat.length; i++) {
                const t = chat[i]?.mes || ""; if (t) latestChatText = t;
                const ex = extractText(t, i); if (ex) last = ex;
            }
            const fallback = getFallbackData(latestChatText);
            if (!last && chat.length > 0) { fallback.charName = ctx?.name1 || "伊一"; fallback.floorId = chat.length - 1; }
            latestStatus = mergeStatusWithVars(last, fallback);

            const u = ctx?.name1 || "伊一";
            if (typeof setExtensionPrompt === "function") {
                setExtensionPrompt(EXT_ID, userSettings.enabled ? buildFullSystemPrompt(u, fv) : "", extension_prompt_types?.IN_CHAT ?? 1, 0);
            }
            renderBody();
        } catch (e) { console.error("[my-status-bar] recalc error:", e); renderBody(); }
    }

    mountUI();
    document.addEventListener("click", e => {
        const trg = e.target.closest(".st-ext-inline-trigger");
        if (trg) {
            const fid = Number(trg.getAttribute("data-floor")), rawMes = safeCtx()?.chat?.[fid]?.mes || "", ex = extractText(rawMes, fid);
            latestStatus = mergeStatusWithVars(ex, getFallbackData(rawMes));
            activeCat = null; inSettings = false; renderBody();
            document.getElementById("st-v5-panel").style.display = "flex";
        }
    });

    if (eventSource && event_types) {
        eventSource.on(event_types.CHAT_CHANGED, () => { activeCat = null; latestStatus = null; setTimeout(() => { recalc(false); cleanAll(false); }, 220); });
        eventSource.on(event_types.MESSAGE_RECEIVED, i => setTimeout(() => { recalc(false); cleanDOM(i, true); showToast("📊 状态栏已同步！", "info", 2000); if (userSettings.apiSyncEnabled) triggerExternalApiUpdate(i); }, 150));
        eventSource.on(event_types.MESSAGE_UPDATED, i => setTimeout(() => { recalc(false); cleanDOM(i, true); }, 120));
        eventSource.on(event_types.MESSAGE_DELETED, () => setTimeout(() => { recalc(false); scheduleCleanAll(); }, 150));
        eventSource.on(event_types.GENERATION_STARTED, () => recalc(false));
    }

    const chatEl = document.getElementById("chat");
    if (chatEl) {
        const obs = new MutationObserver(() => { if (!isCleaningDOM) scheduleCleanAll(); });
        obs.observe(chatEl, { childList: true, subtree: false });
    }
    setTimeout(() => { recalc(false); cleanAll(false); }, 350);
})();
