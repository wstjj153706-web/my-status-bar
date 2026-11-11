// == 状态栏与楼层变量引擎 V16 (酒馆扩展开关 + 6大板块去重归档 + 0-100动态深化进度条 + 双层下流独白 + 模型后期自动补全) ==
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
        try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, "📊 状态栏引擎 V16"); } catch (e) {}
        let box = document.getElementById("st-v16-toast");
        if (!box) {
            box = document.createElement("div"); box.id = "st-v16-toast";
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

    // 5套深度差异化主题（不仅是颜色，还包含边框纹理、阴影风格、圆角与卡片质感）
    const THEMES = {
        "魅魔粉 (默认)": {
            bg: "radial-gradient(circle at top right, #2a1b3d, #161224 70%)",
            border: "2px solid #f38ba8", radius: "18px", shadow: "0 16px 48px rgba(243,139,168,0.35)",
            prim: "#f38ba8", sec: "#cba6f7", text: "#fdf0f6", sub: "#b4adc8",
            card: "linear-gradient(145deg, rgba(42,29,62,0.92), rgba(22,16,34,0.95))",
            cardBorder: "1px solid rgba(243,139,168,0.35)", hi: "rgba(243,139,168,0.25)"
        },
        "暗黑血浆 (重口凌辱)": {
            bg: "repeating-linear-gradient(135deg, #1a0508 0px, #1a0508 12px, #120204 12px, #120204 24px)",
            border: "2px double #ff1e42", radius: "8px", shadow: "0 18px 55px rgba(255,0,43,0.5)",
            prim: "#ff2a4b", sec: "#ff758f", text: "#ffe5ec", sub: "#d48b99",
            card: "linear-gradient(160deg, #2b080e, #140205)",
            cardBorder: "1px solid rgba(255,42,75,0.5)", hi: "rgba(255,42,75,0.3)"
        },
        "白浊深渊 (催眠灌精)": {
            bg: "linear-gradient(170deg, #0f172a, #1e1b4b 60%, #090d16)",
            border: "2px solid #a5f3fc", radius: "22px", shadow: "0 16px 50px rgba(165,243,252,0.3)",
            prim: "#67e8f9", sec: "#c084fc", text: "#f8fafc", sub: "#94a3b8",
            card: "linear-gradient(155deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))",
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
            border: "2px ridge #f9e2af", radius: "14px", shadow: "0 18px 50px rgba(249,226,175,0.3)",
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
        height: 640,
        fontScale: 100,
        apiSyncEnabled: false,
        apiUrl: "",
        apiKey: "",
        apiModel: "",
        modelList: []
    };

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v16_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉 (默认)";
        } catch (e) {}
    }
    function saveSettings() {
        try { localStorage.setItem(EXT_ID + "_v16_cfg", JSON.stringify(userSettings)); } catch (e) {}
    }

    // 0 -> 100% 动态颜色深化计算器（数值越高颜色越深邃淫靡，满100触发脉冲光晕）
    function getProgBarStyle(pct, reverse = false) {
        const p = Math.max(0, Math.min(100, Number(pct) || 0));
        const val = reverse ? (100 - p) : p;
        let grad = "", glow = "", labelColor = "";
        if (val < 25) {
            grad = "linear-gradient(90deg, #fbcfe8, #f472b6)";
            glow = "0 0 6px rgba(244,114,182,0.4)";
            labelColor = "#fbcfe8";
        } else if (val < 50) {
            grad = "linear-gradient(90deg, #f472b6, #e879f9, #c084fc)";
            glow = "0 0 10px rgba(232,121,249,0.55)";
            labelColor = "#f5d0fe";
        } else if (val < 80) {
            grad = "linear-gradient(90deg, #ec4899, #f43f5e, #be123c)";
            glow = "0 0 14px rgba(244,63,94,0.75)";
            labelColor = "#fda4af";
        } else {
            grad = "linear-gradient(90deg, #ff0a54, #990033, #4a001f)";
            glow = "0 0 18px #ff0a54, inset 0 0 6px #fff";
            labelColor = "#ff4d6d";
        }
        return { grad, glow, labelColor, isMax: val >= 95 };
    }

    // 初始变量库：直白下流的性癖命名 + 支持大模型后期动态覆写的 `按钮详情` 槽位
    function getInitialVars() {
        return {
            档案: {
                身份与背景: "",
                自我介绍: "",
                罩杯与三维: "36D／165cm（丰乳细腰蜜桃臀、极品白虎纯阴肉体）",
                社会风评: ""
            },
            核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
            精神与心理: { 羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0, 意识清醒度: 100, 人格崩解度: 0 },
            身体: { 体力: 100 },
            性癖: {
                条目: [
                    "嫌精拒屌却腿软流汁-嘴上嫌弃男人粗臭肉棒，闻到精腥味却本能夹腿泌出淫水-第一阶段-0/100",
                    "假正经骚浪反差婊-表面端着高冷仙子架子，衣料磨一下奶头就浑身发骚打颤-第一阶段-0/100",
                    "紧窄处女一线鲍怕被捅穿-未经人事的白虎嫩穴紧得连手指都难塞，既怕破处剧痛又空虚抽搐-第一阶段-0/100",
                    "越被视奸羞辱越喷水泄身-脸皮薄到极点，越是被男人盯着羞辱私处，骚穴越是止不住地痉挛漏水-第一阶段-0/100",
                    "傲娇嘴硬身体诚实迎合-嘴里骂着滚开摆出少宗主威严，腰臀却酸软无力根本推不开男人-第一阶段-0/100",
                    "灵魂死宅肉体发情母狗-脑子里还是普通男大学生的碎碎念，纯阴肉体却已开始本能渴求阳气滋润-第一阶段-0/100"
                ]
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
            体内精液存量: { 口内毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
            痕迹与标记: { 体表痕迹: "面颊绯红、耳尖羞红、裹胸下肌肤微汗", 淫纹与刻印: "无" },
            体内道具与权限: { 体内道具: "无", 束缚状态: "无", 穿戴中的标记物: "月白色镶银丝云纹束腰战袍裙、青白双色丝质裹胸、修身素色衬裤、精工麂皮小战靴；耗尽微光的现实修改笔已塞入长袍内袋" },
            调教进度: { 规矩与日程: "维持纳兰嫣然清冷高傲人设，掩饰冒牌身份" },
            精神与心理扩展: { 当前敏感点: "下腹部深处因紧张泛起莫名暖意与空虚抽搐感", 催眠深度: 0 },
            // 供后续大模型自由覆写各按钮详情与心声的专属字典
            按钮详情: {}
        };
    }

    let curVars = getInitialVars(), latestStatus = null, activeCat = null, curDetailIdx = 0, inSettings = false;
    let isCleaningDOM = false, cleanTimer = null;

    // 精简去重后的 6 大核心板块定义
    const ICONS = {
        "档案与肉体": "👩",
        "恶堕与精神": "🔥",
        "下流性癖库": "🧬",
        "六孔解剖台": "🌸",
        "体液与调教": "💦",
        "淫乱总账本": "💎"
    };
    const SHORT_NAMES = {
        "档案与肉体": "档案",
        "恶堕与精神": "精神",
        "下流性癖库": "性癖",
        "六孔解剖台": "六孔",
        "体液与调教": "体液",
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

    // 【关键规则注入】：命令后续大模型自动补全并覆写各个按钮的直白下流描写与主角内心感受
    function buildFullSystemPrompt(userName, currentVars) {
        const currentYaml = varsToYaml(userName, currentVars);
        return `\n【当前变量库实时注入值】\n${currentYaml}\n
【🔥状态栏与变量后期自动补全强制规范（V16引擎）】
1. 每条回复末尾按顺序输出：正文 -> 【状态栏｜${userName}】...【/状态栏】 -> <UpdateVariable>块</UpdateVariable>。
2. 状态栏已升级为6大无重复板块：[[档案与肉体]]、[[恶堕与精神]]、[[下流性癖库]]、[[六孔解剖台]]、[[体液与调教]]、[[淫乱总账本]]。
3. **按钮详情后期自动补全规则**：每个按钮的描述必须遵循「极度色情直白下流的肉体解剖/状态详写（100字以上） + 💭【${userName}的实时内心感受】（第一人称斜体带❤️💦🥵表情的羞耻或发情心声，60字以上）」双层格式（严禁在描述内部使用竖线 |）。
4. **性癖命名与演进规则**：在 <UpdateVariable> 中更新 '${userName}.性癖.条目' 时，性癖名称必须极度直白、粗俗、下流（例如“嫌精拒屌却腿软流汁”、“被视奸羞辱就喷水漏尿”），格式为“下流性癖名-直白成因-第X阶段-数值/100”。
5. 每回合在 <UpdateVariable> 中必须用 _.set 实时更新数值以及 '${userName}.实况.内心独白'、'${userName}.实况.当前姿势'、'${userName}.实况.当前衣装'、'${userName}.实况.小穴实况'、'${userName}.实况.胸部实况'！`;
    }

    // 格式化按钮标题与 0~100% 动态深化进度条
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
                <div style="flex:1;height:8px;background:rgba(0,0,0,0.55);border:1px solid rgba(255,255,255,0.12);border-radius:99px;overflow:hidden;padding:1px;">
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

    // 每个数值按钮自带：【直白下流客观生理描写】 + 【💭 主角第一人称实时感受与心声】
    function getDynamicMetricDetail(type, v, u) {
        const map = {
            cockLove: {
                val: Number(v.核心数值?.对肉棒好感度) || 0, rev: false,
                st: ["嫌精拒屌•夹腿发颤", "口嫌体直•食髓知味", "含泪渴屌•穴肉吸吮", "跪舔肉棒•母狗发骚", "肉棒至上•精液便器"],
                d: [
                    `【生理与肉体反应】：嘴上对男人那根布满狰狞青筋、散发着浓郁包皮垢与前列腺液腥膻味的粗硬大肉棒充满排斥与戒备，光是想象硕大紫红的龟头顶在自己粉嫩紧窄的处女穴口，${u}就会本能地死死夹紧大腿；然而这具刚重塑的极品纯阴娇躯却诚实得下流，尾椎骨深处竟顺着恐惧窜起一阵阵让人腿软的酥麻电流。\n💭【${u}的实时内心感受】：“*呜哇啊啊开什么玩笑！那种又粗又丑、还挂着腥臭粘液的男人肉棒要是捅进我现在这条窄得要命的小穴里，绝对会把我的肚子顶穿的吧？！💦可恶，明明脑子里恶心抗拒得要死，为什么一想到被大肉棒按在地上强奸，我的小腹深处反而一抽一抽地发烫发软啊……🥵*”`,
                    `【生理与肉体反应】：理智防线在男人的气息与摩擦下已经松动。${u}的骚口与下身嫩穴开始记住粗大阳具滚烫坚硬的触感，每当闻到雄性荷尔蒙腥味，喉咙便不自觉地吞咽口水，腿心两瓣粉嫩阴唇更是悄悄充血肿胀、泌出清亮拉丝的淫水。\n💭【${u}的实时内心感受】：“*不、不对劲……刚才只是稍微被男人的气息蹭到，我的下面怎么就已经湿成这样了？！😳明明我以前是个男大学生啊，为什么现在看到他胯下鼓起的那一大包，喉咙会突然这么干，连小穴里面都痒得像是有什么东西在咬一样……❤️*”`,
                    `【生理与肉体反应】：清高孤傲的伪装已被大肉棒彻底撞碎！${u}对粗长滚烫的阳具产生了如同烈性春药般的生理饥渴，眼神总是下流地黏在男人的裤裆鼓包上。只要被龟头抵住唇瓣或阴唇肉缝，腰肢便瞬间酸软塌陷，骚逼内壁层层叠叠的媚肉饥渴地收缩蠕动、迫切渴望被狠狠插到底。\n💭【${u}的实时内心感受】：“*哈啊……忍、忍不住了💦……好想被那根滚烫的大肉棒塞满……为什么我的身体会变得这么下贱啊，只要一看到师兄的下半身，我的骚逼就自己张开流出一大滩水，求求你快点插进来止住我里面的痒吧……🥵❤️*”`,
                    `【生理与肉体反应】：彻头彻尾沉溺于大肉棒的发情母狗！${u}已将用骚嘴和骚逼服侍雄性巨物当作最大的快乐。一看到勃起跳动的狰狞肉棒便双膝发软跪倒在地，毫无廉耻地伸出湿滑香舌从浓密卵袋一路舔到马眼，主动掰开湿淋淋的阴唇哀求粗暴抽插。\n💭【${u}的实时内心感受】：“*唔嗯♡……好香……大肉棒的腥臭味闻起来好棒啊🥵……什么少宗主、什么男大学生的尊严全都无所谓了，快把那根粗得吓人的大鸡巴塞进伊一的嘴里和小穴里，把人家的骚逼狠狠操烂吧💦❤️！*”`,
                    `【生理与肉体反应】：满值恶堕的终极肉棒奴隶！${u}的大脑已被大鸡巴与浓精彻底烧坏，哪怕只是闻到一丝精腥味都会翻白眼吐舌流涎，骚口、骚逼、屁眼三处肉孔同时疯狂痉挛吸吮，哭喊着求男人把滚烫浓精全部射进子宫最深处！\n💭【${u}的实时内心感受】：“*啊嘿♡……肉棒大人……伊一只是为了服侍大肉棒而存在的下贱肉套子呀🥵💦！没有大鸡巴插着子宫就要活不下去了，快把滚烫的臭精液全部射进人家的最深处，把伊一灌成大肚子母狗吧❤️❤️！*”`
                ]
            },
            lust: {
                val: Number(v.核心数值?.性欲程度) || 0, rev: false,
                st: ["假装清冷•奶头摩擦发硬", "春水暗涌•底裤湿透粘腻", "欲火焚身•夹腿磨逼止痒", "重度发骚•骚穴狂流淫水", "永动发情•三穴痉挛索操"],
                d: [
                    `【生理与肉体反应】：表面还死撑着纳兰嫣然清冷孤傲的架子，但初生的十八岁纯阴处子肉体对贴身衣料的摩擦敏感到极点！哪怕只是走路或急促喘气，丝质裹胸与衬裤擦过奶头和阴蒂时，都会在小腹深处激起一圈圈下流的酥麻热流。\n💭【${u}的实时内心感受】：“*救命……这具千金大小姐的身体到底是用什么做的啊？！💦明明我什么涩涩的事情都没想，只是裹胸的布料轻轻蹭了一下奶头，居然就有一股麻酥酥的电流直接窜到尾巴骨了！再这样动下去，下面真的要奇怪地湿掉了啦……🥵*”`,
                    `【生理与肉体反应】：小腹深处升起一股挥之不去的燥热与空虚酸胀！胸前两颗粉嫩乳头在裹胸下充血发硬、顶出两个羞人的小凸起，双腿之间更是泛起黏腻潮意，未经人事的紧窄肉穴正一缩一缩地空虚抽搐。\n💭【${u}的实时内心感受】：“*呜……奶头好硬好烫，衬裤贴在阴唇上湿漉漉的好难受😳……为什么小肚子里面一直空落落地发酸啊，好像有一只看不见的手在挠我的子宫口一样，好想伸手进去揉一揉……💦*”`,
                    `【生理与肉体反应】：滚烫的淫欲之火烧遍全身！${u}双颊酡红如醉，呼吸粗重滚烫，36D雪乳剧烈起伏。下身骚逼早已淫水泛滥成灾，透明拉丝的爱液彻底浸湿了底裤并顺着大腿根往下淌，急需粗硬异物狠狠插入止痒。\n💭【${u}的实时内心感受】：“*哈啊、哈啊……身体好热，小穴里的淫水已经把内裤完全弄湿了🥵……两条腿不管怎么夹紧摩擦都止不住里面的骚痒，谁来帮帮我，用什么粗硬的东西插进我湿淋淋的小穴里搅拌一下啊……💦❤️*”`,
                    `【生理与肉体反应】：重度发情失控！全身白腻肌肤一碰就颤，充血肿大的阴蒂肉珠暴突在外剧烈跳动。${u}像发情母犬般死死夹紧双腿磨蹭腰臀，嘴里漏出下流甜腻的哼唧，骚逼里淫水噗嗤噗嗤往外直冒。\n💭【${u}的实时内心感受】：“*呜嗯……受不了了，阴蒂又肿又麻，骚穴里面痒得快要发疯了🥵💦！别管什么礼义廉耻了，快点用大手狠狠抓烂我的奶子，把最粗的大肉棒捅进我直流水的骚逼里用力操我呀❤️！*”`,
                    `【生理与肉体反应】：24小时狂暴发情期！脑子里除了交配与被内射灌精外再无半点杂念，浑身滚烫出汗、散发着浓烈的雌性发情骚香。奶头硬如石子，红肿外翻的骚逼与屁眼不停向外喷涌黏腻淫水，连子宫口都主动向下脱垂索精！\n💭【${u}的实时内心感受】：“*啊啊♡……发情停不下来了！伊一的骚逼和屁眼全都在喷水，子宫口也张开等着吃精液了🥵💦！快点来十个男人把我按在地上轮流内射，不把这具发骚的母狗身体操到休克就绝对不准停下来呀❤️❤️！*”`
                ]
            },
            corr: {
                val: Number(v.核心数值?.淫乱恶堕) || 0, rev: false,
                st: ["死撑清高•肉体剧烈背叛", "半推半就•羞耻快感成瘾", "食髓知味•主动迎合求欢", "下贱娼妇•肉便器自觉", "脑髓熔断•公用排泄母畜"],
                d: [
                    `【生理与肉体反应】：意识里还保留着原本的道德底线与少宗主的高傲外壳，对下流的视奸、触碰与身体异变感到极度屈辱惊慌；然而这具纯阴肉体却在每一次羞耻刺激下成倍放大快感，让她的清冷伪装摇摇欲坠。\n💭【${u}的实时内心感受】：“*我可是堂堂男大学生、现在更是云岚宗高高在上的少宗主纳兰嫣然啊！💦绝不能在师兄面前露出那种像里番女主角一样发骚腿软的丢脸样子……可恶，但为什么身体越害怕露馅，下面反而越觉得刺激啊？！🥵*”`,
                    `【生理与肉体反应】：在接连的羞耻与快感冲击下，矜持防线已布满裂痕。面对男人的步步紧逼开始半推半就，嘴上还在微弱抗拒，滚烫湿软的身体却早已诚实地贴了上去。\n💭【${u}的实时内心感受】：“*嘴上虽然还在说着‘师兄请自重’，可我的腰为什么自己往他手掌心上凑过去了啊😳💦……这种明明该反抗却顺从地打开双腿的背德感，简直要把我的脑子给融化掉了……❤️*”`,
                    `【生理与肉体反应】：廉耻与贞操观彻底冲垮！她开始真正沉迷于女性肉体被粗暴揉捏、被大肉棒肆意填满的下流快感，举手投足间褪去清高，流露出主动勾引男人的淫荡风情。\n💭【${u}的实时内心感受】：“*原来变成女人被男人粗暴地玩弄身体……是这么爽到头皮发麻的事情吗🥵❤️？既然已经回不去了，那就干脆用这具倾国倾城的仙子肉体，去把男人们的精液全部榨干吧💦！*”`,
                    `【生理与肉体反应】：身心彻底恶堕的极品淫乱娼妇！她以自己的仙子娇躯能成为男人发泄兽欲的肉套子为荣，会主动分开白皙大腿展示红肿湿亮的花唇，用最下流的床话浪叫求操。\n💭【${u}的实时内心感受】：“*嘻嘻♡……看呀，平时高高在上的纳兰嫣然少宗主，现在正自己掰开流水的骚逼求男人肏呢🥵💦！快用最下流的方式玩弄我，把我的小穴和嘴全都当成你的专属飞机杯吧❤️！*”`,
                    `【生理与肉体反应】：终极极限恶堕！人类尊严100%灰飞烟灭，彻底退化为一具只为承接雄性精液与尿液而活的公用排泄肉便器。无论被如何当众羞辱、三穴齐开、失禁潮吹，她都会挂着痴呆阿片脸吐舌高潮！\n💭【${u}的实时内心感受】：“*呕咕、啊嘿♡……伊一已经彻底变成没有脑子的公用肉便器母猪了🥵💦！不管是谁的粗肉棒、不管是浓精还是骚尿，全都请往伊一合不拢的骚逼和喉咙里灌进来吧❤️❤️！*”`
                ]
            },
            shame: {
                val: Number(v.精神与心理?.羞耻度 ?? 100), rev: true,
                st: ["羞愤欲死•耳尖滚烫滴血", "薄面潮红•咬唇无力遮挡", "半掩半露•羞耻转为兴奋", "不知廉耻•掰穴展示淫水", "羞耻全灭•当众失禁母狗"],
                d: [
                    `【生理与肉体反应】：羞耻度处于100%满负荷紧绷状态！体内死宅男大学生的灵魂与这具胸大腰细、下身空荡湿热的绝色千金肉体产生剧烈冲突。哪怕只是感觉到乳肉颠簸、或是意识到自己连撒尿都必须脱裤子蹲下，都会羞耻得满脸通红、耳尖滴血，而这份极致的羞耻感正疯狂催化着肉体的敏感度！\n💭【${u}的实时内心感受】：“*呜哇啊啊要死要死要死了！💦胸前这两大团沉甸甸的奶子一直在晃，两腿之间光溜溜的一条缝还在往外冒热气，甚至连上厕所都要像女孩子一样蹲下来分开腿……要是被外面的柳翎师兄看到我现在满脸通红夹着腿发抖的样子，我真的不如当场一头撞死算了啊啊啊！🥵*”`,
                    `【生理与肉体反应】：在接连的身体羞耻冲击下，防线开始松动。虽然私密部位被注视或触碰时依然心跳如鼓、脸红发烫，但双手的遮挡已变得软弱无力。\n💭【${u}的实时内心感受】：“*别、别盯着我的胸口和腿根看啊😳💦……虽然害羞得快要晕过去了，可手却软绵绵的一点力气都使不上来，甚至被他火热的眼神盯着的时候，乳头反而更硬了……❤️*”`,
                    `【生理与肉体反应】：羞耻感已被磨灭大半！哪怕衣衫不整地露出大片雪白乳肉、或是当着男人的面流下大腿根的淫水，也能在微微脸红后迅速转化为暴露的快感。\n💭【${u}的实时内心感受】：“*反、反正都已经被看光了💦……与其遮遮掩掩，不如就让他好好看看我这具连自己都觉得色情得要命的身体吧，被盯着看下面反而流得更多了呢……🥵*”`,
                    `【生理与肉体反应】：廉耻心荡然无存！哪怕赤身裸体跪在男人胯下口交吞精、或是顶着一肚子精液走动任由白浊顺着腿根滴淌，她也毫不遮掩，甚至故意分开臀瓣展示湿漉漉的肉穴。\n💭【${u}的实时内心感受】：“*害羞是什么？能有被男人视奸骚逼、用大肉棒插到喷水爽吗🥵❤️？快看呀，我的小穴已经湿得一塌糊涂了，全都敞开给你看个够💦！*”`,
                    `【生理与肉体反应】：羞耻心彻底归零粉碎！哪怕在大庭广众之下被扒光衣服四脚朝天粗暴操干、当众潮吹漏尿失禁、浑身涂满浓精像母狗一样爬行，她也会兴奋得浑身发抖、吐舌高潮！\n💭【${u}的实时内心感受】：“*啊啊♡……越是被人围观我被肏得翻白眼漏尿的下贱样子，我的子宫就高潮得越厉害🥵💦！大家都来看呀，高贵的纳兰嫣然已经变成一条在大街上敞开骚逼喷水的母狗啦❤️❤️！*”`
                ]
            },
            obey: {
                val: Number(v.精神与心理?.服从度) || 0, rev: false,
                st: ["傲娇抗命•强撑少宗主威严", "委曲求全•双膝发软妥协", "温顺听话•主动分腿配合", "摇尾乞怜•任打任操母犬", "绝对盲从•刻入骨髓肉奴"],
                d: [
                    `【生理与肉体反应】：表面拼命摆出云岚宗少宗主孤高冷傲、不可侵犯的架子，试图用冷冽声线呵斥退敌；然而发软的膝盖与微微颤抖的娇躯却暴露了外强中干的底细。\n💭【${u}的实时内心感受】：“*稳住，一定要装出纳兰嫣然那种高高在上、看谁都像看垃圾一样的傲娇大小姐气场！💦绝对不能让门外的柳翎听出我声音在发虚……可恶，腿好软，扶着柱子的手别抖啊！🥵*”`,
                    `【生理与肉体反应】：在形势逼迫或肉体酸软无力的状态下学会了低头妥协，即使内心羞愤交加，也不得不顺从地按照男人的要求摆出羞耻姿势。\n💭【${u}的实时内心感受】：“*呜……把柄被抓住了，身体又软得根本逃不掉💦……算了，只要稍微听他的话乖乖把腰弯下去一点，应该就不会被发现冒牌货的身份了吧……😳*”`,
                    `【生理与肉体反应】：面对男人的命令已形成习惯性顺从，不再出言顶撞，懂得如何主动放松紧绷的大腿肌肉、乖巧地分开双腿配合对方的抚摸与插入。\n💭【${u}的实时内心感受】：“*既然反抗也只会让身体更难受，不如乖乖听主人的话把腿张开吧❤️……只要顺从地让他舒服了，他也会摸得我更爽的吧……💦*”`,
                    `【生理与肉体反应】：彻底被驯服的摇尾母狗！对男人的任何粗暴命令都奉若圣旨，不仅会主动跪爬上前用舌头舔净肉棒，挨打受罚时还会一边流着淫水一边哭喊谢恩求操。\n💭【${u}的实时内心感受】：“*汪呜♡……主人说什么伊一都会照做的🥵！请狠狠抽打伊一的肥屁股，只要主人开心，让我摆出什么下流姿势挨肏都可以呀💦❤️！*”`,
                    `【生理与肉体反应】：100%刻入骨髓的绝对奴性！已完全放弃自主意志，哪怕命令她自己掰开骚逼塞入异物、吞下所有浓精尿液、或彻夜高翘肥臀承欢，她都会条件反射般全力奉承！\n💭【${u}的实时内心感受】：“*伊一没有自己的思想，伊一的身体、骚穴和灵魂全都是主人的所有物♡🥵！请随便下达最残酷最下流的命令来使用这具肉奴吧💦❤️！*”`
                ]
            },
            pleas: {
                val: Number(v.精神与心理?.快感累积) || 0, rev: false,
                st: ["敏感初醒•乳尖小腹过电", "酥麻窜动•花唇泌水微张", "快感攀升•趾尖蜷缩浪喘", "濒临绝顶•宫口痉挛索精", "灭顶潮吹•翻白眼阿片失禁"],
                d: [
                    `【生理与肉体反应】：纯阴敏感神经刚刚被唤醒！丝质裹胸每一次擦过挺立的粉嫩乳头，或是紧张时小腹深处的紧缩，都会激起一缕缕细微酥麻的电流直窜后脑勺，令腿心泛起莫名的暖意与空虚抽搐。\n💭【${u}的实时内心感受】：“*呀……！刚才衣服磨过奶头的那一下，后脑勺居然像过电一样麻了半秒钟！❤️而且小肚子最深处为什么一直在酸酸地一抽一抽啊，这种陌生的女孩子快感也太可怕了吧……💦*”`,
                    `【生理与肉体反应】：酥麻滚烫的快感电流顺着尾椎骨一路窜向小腹与阴蒂！全身敏感带充血发烫，花唇内壁在刺激下一缩一缩地溢出了清亮润滑的淫水，双膝发软打颤。\n💭【${u}的实时内心感受】：“*唔嗯……好麻、好舒服😳💦……顺着脊椎骨往下窜的电流越来越强了，下面的花唇一直在自己吐水，连站都要站不稳了啦……🥵*”`,
                    `【生理与肉体反应】：密集汹涌的快感浪潮不断拍打着每一根神经！每一次摩擦、揉捏与顶撞都让${u}浑身剧烈颤抖、靴子里的粉嫩脚趾紧紧蜷缩，淫水在腿心被搅动得泥泞不堪。\n💭【${u}的实时内心感受】：“*啊啊、不行了，快感一波接一波地冲上来，脚趾头都麻得蜷缩起来了🥵💦！再继续摩擦那个敏感点的话，脑子真的要被爽坏掉了呀❤️！*”`,
                    `【生理与肉体反应】：快感已蓄积至决堤崩溃的边缘！小腹与阴道括约肌剧烈绷紧痉挛，充血肥大的阴蒂与敏感宫颈口如同通了高压电，只要再稍微刺激一下就会引爆灭顶高潮。\n💭【${u}的实时内心感受】：“*要、要去了！小肚子里面绷得好紧，有什么滚烫的东西要从骚穴最深处炸开了🥵💦！求求你快再用力顶一下，让我高潮吧❤️❤️！*”`,
                    `【生理与肉体反应】：灭顶绝顶高潮连续过载爆发！狂暴的性快感瞬间烧穿脑海，她双眼狂翻白眼、香舌无力吐出唇外，滚烫的潮吹淫水与失禁骚尿从大张痉挛的骚逼里狂喷而出！\n💭【${u}的实时内心感受】：“*啊゛啊゛啊——去了去了去了♡！！脑子一片空白全炸开了🥵💦！骚逼在自己狂喷水、连小便也一起失禁喷出来了，太爽了要死掉了啊啊啊❤️❤️！！*”`
                ]
            },
            sta: {
                val: Number(v.身体?.体力 ?? 100), rev: true,
                st: ["精力充沛•初变脱力微喘", "娇躯微软•香汗浸湿裹胸", "香汗淋漓•双腿筛糠打颤", "濒临虚脱•瘫软任人摆布", "彻底操烂•失神抽搐肉泥"],
                d: [
                    `【生理与肉体反应】：十八岁纯阴处子之躯总体精力充沛、云岚宗风属性斗气在经脉间自发流转；仅因刚刚经历肉体重塑与重心失衡而呼吸微促、膝盖发软，正扶着立柱极力稳住身形。\n💭【${u}的实时内心感受】：“*呼、呼……虽然这具身体里有一股轻飘飘的风属性斗气在转，但胸前这两大坨肉实在太沉了，重心完全不对劲，光是站稳就已经让我出一身细汗了啊……💦*”`,
                    `【生理与肉体反应】：经历一番紧张对峙或初步挑逗后，白腻如玉的肌肤表面沁出一层薄薄的温热香汗，将贴身丝质裹胸浸得半透明，纤细腰肢与修长双腿略微酸软发颤。\n💭【${u}的实时内心感受】：“*哈啊……身上出汗了，黏糊糊的丝绸裹胸贴在奶子上好色情😳💦……腿也有点使不上劲，千万别在这个时候被人推倒啊……*”`,
                    `【生理与肉体反应】：体力消耗过半，浑身被黏腻的香汗彻底浸透，如瀑青丝凌乱地黏在潮红滚烫的脸颊与锁骨上，下身酸麻发软难以站立。\n💭【${u}的实时内心感受】：“*呜……全身的力气都被刚才的刺激抽走一半了🥵💦，膝盖一直在打哆嗦，要是现在被男人抱住的话，连挣扎一下的力气都没有了……*”`,
                    `【生理与肉体反应】：体力濒临枯竭！剧烈的感官冲击或连续抽插抽干了全身力气，双腿筛糠般剧烈打颤，只能软绵绵地瘫倒在地上或榻上任由男人粗暴摆布。\n💭【${u}的实时内心感受】：“*哈啊、哈啊……一根手指头都动不了了🥵……身体像一滩融化的奶油一样软在地上，随便你要怎么掰开我的腿、怎么插我都反抗不了了……💦❤️*”`,
                    `【生理与肉体反应】：全身彻底虚脱瘫软！像一滩被操烂的春水般烂在地上，连抬动眼皮的力气都没有，唯有红肿外翻的骚逼与子宫还在凭着肌肉本能自动痉挛吸吮！\n💭【${u}的实时内心感受】：“*唔……已经彻底被玩坏、被操到虚脱休克了♡🥵……意识好远，只有下面的骚逼还在自己一缩一缩地咬着肉棒不放……💦*”`
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

    // 直白下流版性癖详情生成器（带主角第一人称心声）
    function buildFetishRichDesc(rawItem, v, u) {
        const parts = String(rawItem).split("-");
        const name = (parts[0] || "未知下流性癖").trim();
        const origin = (parts[1] || "纯阴敏感肉体与死宅灵魂反差形成").trim();
        const stage = (parts[2] || "第一阶段").trim();
        const valStr = (parts[3] || "0/100").trim();
        const corr = Number(v.核心数值?.淫乱恶堕) || 0;
        const shame = Number(v.精神与心理?.羞耻度 ?? 100);

        return `【性癖成因与当前进度】：${origin}（${stage} · ${valStr}）\n` +
               `【🔞 直白下流发作实况】：这项名为「${name}」的淫乱性癖已深深烙印在${u}的纯阴肉体本能之中（当前羞耻度${shame}% / 恶堕度${corr}%）！每当处于触发情境下，哪怕她嘴上还在用清冷孤傲的少宗主声线死撑体面，这具下流的身体却会立刻背叛大脑——双颊与耳尖滚烫充血，胸前36D雪乳顶端的粉嫩奶头自行发硬挺立，紧窄无毛的白虎处女穴深处更会不受控制地泛起一阵阵酸麻痉挛，甚至在强烈的羞耻与背德反噬下直接泌出滑腻拉丝的淫水湿透底裤！\n` +
               `💭【${u}针对此性癖的羞耻心声】：“*为什么偏偏会觉醒「${name}」这种像里番雌畜一样的下流体质啊？！💦明明我脑子里拼命告诉自己要冷静、要维持高冷人设，可身体一遇到这种刺激就自己发骚流水，再这样下去我迟早会变成离开男人肉棒就活不下去的真母狗的啊啊啊！🥵❤️*”`;
    }

    function extractLiveFromChat(chatArr) {
        const res = { thought: "", pose: "", cloth: "" };
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
                const f = sents.filter(s => s.length > 6 && s.length < 110 && /(?:战袍|长裙|裹胸|衬裤|战靴|丝袜|内裤|底裤|胸罩|旗袍|斗篷|束腰|丝帛|赤裸)/.test(s));
                if (f.length) res.cloth = f.slice(-2).join("；").trim();
            }
            if (!res.pose) {
                const f = sents.filter(s => s.length > 8 && s.length < 120 && /(?:撑起|扶着|站起|捂住|喘息|瘫坐|一僵|收拢膝盖|颤抖|跪|趴|弯腰|夹紧|立柱|铜镜)/.test(s));
                if (f.length) res.pose = f.slice(-2).join("，").trim() + "。";
            }
        }
        return res;
    }

    // 6大核心板块无重复生成器（每个按钮都极度详尽且包含主角第一人称心声）
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
        const wombMl = Number(sp.子宫毫升) || 0, mouthMl = Number(sp.口内毫升) || 0, analMl = Number(sp.屁眼毫升) || 0;
        const corr = Number(v.核心数值?.淫乱恶堕) || 0, lust = Number(v.核心数值?.性欲程度) || 0, pleas = Number(v.精神与心理?.快感累积) || 0;

        const vagWidth = (1.5 + Math.min(3.6, vagCnt * 0.02)).toFixed(1);
        const vagClose = Math.max(15, Math.round(100 - vagCnt * 0.4 - (wombMl > 0 ? 15 : 0)));
        const cervixDrop = Math.min(100, Math.round(creampie * 0.5 + (wombMl > 0 ? 20 : 0) + pleas * 0.15));
        const clitSize = (4.0 + Math.min(8.5, orgasmCnt * 0.06 + pleas * 0.03)).toFixed(1);
        const analClose = Math.max(20, Math.round(100 - analCnt * 0.5 - (analMl > 0 ? 15 : 0)));
        const peeVal = Math.min(100, Math.round(18 + lust * 0.35 + pleas * 0.35 + leakCnt * 8));
        const totalBellyMl = wombMl + mouthMl + analMl;
        const wetLevel = Math.min(100, Math.round(18 + lust * 0.7 + pleas * 0.6 + (wombMl > 0 ? 25 : 0)));
        const fallVal = Number(v.精神与心理?.沦陷度) || 0;
        const brkVal = Number(v.精神与心理?.人格崩解度) || 0;

        const curThought = rt.内心独白 || live.thought || `骗人的吧……这具身体到底怎么回事啊？！💦只是稍微动一下，丝质裹胸磨蹭到乳尖居然会起一身鸡皮疙瘩，连小腹深处都泛起一股莫名其妙的酸软湿热感……❤️门外柳翎师兄的声音传过来了！要是被他推门进来看到我双腿发软扶着柱子喘气的羞耻样子，会不会直接扑上来对我做那种里番里才会发生的过分事情啊？！🥵`;
        const curPose = rt.当前姿势 || live.pose || `${u}正慌乱地扶着青石立柱支撑发软的膝盖，双肩因紧张与羞耻而微微颤抖，两条修长白皙的大腿死死并拢内扣，试图压住腿心深处不断涌起的陌生酥麻潮热感，胸前36D饱满雪乳随着急促喘息在紧身裹胸下剧烈颠动。`;
        const curCloth = rt.当前衣装 || live.cloth || (prop.穿戴中的标记物 !== "无" ? prop.穿戴中的标记物 : "月白色镶银丝云纹束腰战袍裙、青白双色丝质裹胸、修身素色衬裤");

        return [
            // 1. 档案与肉体（合并原角色档案、身体情况、特殊状态姿势独白，彻底去重）
            {
                title: "档案与肉体", icon: "👩", summary: `36D纯阴娇躯 · 体力${staM.val}% · 实时独白`,
                items: [
                    mk(`👩 身份与肉体反差：${u}「${corr >= 60 ? "发情母畜少宗主" : "死宅灵魂•高冷仙子肉身"}」`,
                        btnOvr.身份与背景 || `【当前身份与肉体改造实况】：\n${prof.身份与背景 || `${u}原本是现代一名普通的二十岁死宅男大学生，因用神秘的“修改现实笔”写下愿望，肉体、骨骼与基因被彻底重塑为云岚宗少宗主、纳兰家族掌上明珠——纳兰嫣然！表面拥有倾国倾城、拒人于千里之外的孤高冷艳容颜，然而这具初生的十八岁纯阴处子肉体却敏感到一碰即颤，体内还装着那个自卑敏感、疯狂碎碎念的男大学生灵魂。`}\n💭【${u}的实时内心感受】：“*明明几分钟前我还是个在出租屋里抠脚熬夜的男大学生，怎么一眨眼就变成斗气大陆第一傲娇反派大小姐纳兰嫣然了啊？！💦这具皮肤白得透明、胸大腰细的极品女体到底是闹哪样，连呼吸一下都能闻到自己身上散发出来的幽兰体香，太犯规了吧！🥵*”`),
                    mk(`📏 极品三维与敏感躯壳：36D／165cm「雪乳肥臀•十倍敏化纯阴体」`,
                        btnOvr.三维肉体 || `【全身肉体解剖与敏化实况】：\n身高165cm，腰肢纤细得盈盈一握，胸前却顶着一对沉甸甸、饱满白腻的36D极品雪乳，臀部浑圆挺翘如熟透蜜桃，双腿修长笔直毫无一丝赘肉。由于是法则重塑的纯阴处子之躯，全身神经末梢的快感敏锐度是常人的十倍以上（当前体表痕迹：${mark.体表痕迹 || "面颊绯红、耳尖羞红、肌肤微汗"}），稍微被丝帛内衬刮蹭就会引起全身鸡皮疙瘩与下身湿润！\n💭【${u}的实时内心感受】：“*胸前这两团大肉球沉甸甸地坠着锁骨，稍微直起腰就会一颠一颠地晃荡😳💦……而且这副身体为什么连毛孔都看不见、嫩得像豆腐一样啊！要是被粗糙的大手抓一下奶子或者大腿内侧，我绝对会当场软倒在地上叫出声来的！❤️*”`),
                    mk(`💬 实时内心独白（最新心声）：「${corr >= 60 ? "母狗发骚索操心声" : "死宅灵魂羞耻崩坏碎碎念"}」`,
                        btnOvr.内心独白 || `【第一人称实时内心独白（自动抓取当前楼层最新心声）】：\n“*${curThought}*”\n\n【当前核心敏感点与规矩】：\n当前敏感带：${extPsy.当前敏感点 || "挺立乳尖与空虚抽搐的小腹深处"} ｜ 当前日程规矩：${v.调教进度?.规矩与日程 || "维持纳兰嫣然清冷高傲人设，掩饰冒牌身份"}。`),
                    mk(`🧍 当前姿势与娇躯定格：「${curPose.slice(0, 18)}…」`,
                        btnOvr.当前姿势 || `【当前身体姿态与动作解剖】：\n${curPose}\n💭【${u}的实时内心感受】：“*我现在这个扶着柱子、夹紧双腿大喘气的姿势，从铜镜里看过去简直就像刚被人欺负完、或者正在发情的里番女角色一样色情啊！💦不、不行，外面有人走过来了，快点把发软的膝盖站直啊！🥵*”`),
                    mk(`⚡ 体力与肉体耐受：${staM.val}/100「${staM.stage}」`, staM.desc, true)
                ]
            },
            // 2. 恶堕与精神（整合核心数值与精神心理，配备0-100动态深化进度条）
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
                        btnOvr.雌化沦陷 || `【灵魂雌化与精神防线实况】：\n当前沦陷度 ${fallVal}/100 ｜ 人格崩解度 ${brkVal}/100 ｜ 意识清醒度 ${v.精神与心理?.意识清醒度 ?? 100}/100 ｜ 催眠深度 ${extPsy.催眠深度 || 0}/100。\n虽然脑海深处还清楚记得自己原本是男大学生，但100%清醒的神智反而让这具女性肉体传来的每一丝乳尖酥麻、下体空虚与羞耻战栗都被清晰放大了十倍，正一点点将他的男性自尊冲刷同化为雌性本能！\n💭【${u}的实时内心感受】：“*最可怕的就是我现在脑子清醒得要命啊！💦正因为完全清醒，我才能清清楚楚地感觉到自己没有了男人的部位、取而代之的是一条正在发热发酸的敏感女穴……再这样被这具身体的雌性荷尔蒙冲刷下去，我连灵魂都会彻底变成女孩子的吧？！🥵*”`)
                ]
            },
            // 3. 下流性癖库（直白下流命名 + 成因 + 发作表现 + 主角羞耻心声）
            {
                title: "下流性癖库", icon: "🧬", summary: `已激活 ${(v.性癖?.条目 || []).length} 项直白下流性癖`,
                items: (v.性癖?.条目 || []).map(s => {
                    const parts = String(s).split("-");
                    const title = parts[0] || s;
                    const stg = parts[2] || "第一阶段";
                    const num = parts[3] || "0/100";
                    return mk(`🧬 ${title}：${num}「${stg}」`, buildFetishRichDesc(s, v, u));
                })
            },
            // 4. 六孔解剖台（全身色情重口部位解剖，每处都带主角第一人称下流感受）
            {
                title: "六孔解剖台", icon: "🌸", summary: `一线鲍孔径${vagWidth}cm · 闭合${vagClose}% · 六孔微距`,
                items: [
                    mk(`👄 骚口与软糯香舌：${mouthCnt}/100「口交${mouthCnt}次•${mouthCnt > 0 ? "唇肿含腥深喉" : "空谷幽兰娇喘啼鸣"}」`,
                        btnOvr.骚口实况 || `【第一孔·口腔、香舌与声带解剖实况】：\n薄薄的樱唇饱满水润，口腔内香舌粉嫩软滑，分泌着清甜津液。原本沙哑的青年嗓音已被彻底重塑为空谷幽兰般清冽、却又带着酥软尾音的女优声线，稍微受惊或触碰敏感带就会漏出娇柔啼鸣（累计口交 ${mouthCnt} 次，吞精 ${swallowMl}ml）。\n💭【${u}的实时内心感受】：“*连我自己开口说话的时候都被吓了一跳！💦为什么我的喉咙里会发出这种像里番女优一样又软又媚的‘呀、呜’声啊？！要是以后被人按着脑袋把那种粗臭的大肉棒塞进这张小嘴里深喉，我岂不是会发出更下流的吞咽声吗？！🥵*”`),
                    mk(`🍒 36D雪乳与充血奶头：${ Math.min(100, 20 + pleas * 2) }/100「丝帛磨蹭过电•蓓蕾硬挺发烫」`,
                        btnOvr.胸部实况 || `【第二孔·36D丰乳与敏感乳尖解剖实况】：\n${rt.胸部实况 || `胸前两团沉甸甸的36D雪白乳肉饱满圆润，随着呼吸在青白双色丝质裹胸下剧烈起伏颠动。顶端两颗未经人事的粉嫩乳头因被紧身丝帛轻轻摩擦，此刻已彻底充血挺立如熟透的红豆，乳腺深处泛起阵阵酸麻酥痒，一碰即如过电般直窜后脑勺！`}\n💭【${u}的实时内心感受】：“*救命……这两颗奶头怎么会敏感到这种地步啊？！❤️明明只是站起身的时候衣服布料轻轻蹭了一下，结果就像拿电击棒电了一下乳尖一样，酥麻感直接冲到头顶，连乳晕都涨得发烫了……💦*”`),
                    mk(`🌺 白虎处女骚逼：${100 - vagClose}/100「孔径${vagWidth}cm•闭合度${vagClose}%•春水初泌」`,
                        btnOvr.小穴实况 || `【第三孔·白虎花唇与处女阴道解剖实况】：\n${rt.小穴实况 || `紧致如初生花苞般从未经人事的极品白虎处女幽谷！两瓣粉嫩花唇毫无一丝杂毛与暗沉，饱满地紧紧贴合形成一道诱人的一线鲍（当前孔径仅 ${vagWidth}cm，闭合度高达 ${vagClose}%）。然而内里层层叠叠的娇嫩肉褶却在羞耻与紧张的刺激下悄悄充血蠕动，泌出一缕清亮滑腻的处子春水浸润了穴口！`}\n💭【${u}的实时内心感受】：“*原本长在两腿之间二十多年的家伙彻底没了，变成了一条空荡荡、却又紧得连空气都进不去的嫩肉缝……😳💦更要命的是，现在这条小穴里面居然自己在往外渗热乎乎的粘液，衬裤贴在花唇上湿湿滑滑的，羞耻得我快要原地爆炸了啊！🥵*”`),
                    mk(`🫀 纯阴处子子宫与宫口：${cervixDrop}/100「宫口下降${cervixDrop}%•空虚酸软抽搐」`,
                        btnOvr.子宫实况 || `【第四孔·纯阴子宫苗床与宫颈口解剖实况】：\n${rt.子宫实况 || `深藏在平坦小腹内部的纯阴处子子宫温暖而紧致（当前宫内储精 ${wombMl}ml，宫颈口敏感下降度 ${cervixDrop}%）。此刻受现实重塑后的雌性荷尔蒙与门外危机刺激，下腹部最深处的宫颈口正泛起一阵阵莫名的暖意与空虚抽搐感，仿佛在本能地战栗等待着粗硬阳具的破门而入！`}\n💭【${u}的实时内心感受】：“*小肚子最深处……那个叫做‘子宫’的地方是怎么回事啊？！💦为什么从刚才开始就一直暖洋洋、酸溜溜地一抽一抽，好像里面空了一块，正在饥渴地想要吸住什么滚烫的东西一样……太下流了，这具身体绝对有问题啊！🥵❤️*”`),
                    mk(`💧 充血阴蒂与尿道口：${peeVal}/100「阴蒂${clitSize}mm•尿道括约肌发麻」`,
                        btnOvr.阴蒂尿道 || `【第五孔·敏感阴蒂肉珠与尿道口解剖实况】：\n隐藏在粉嫩一线鲍顶端的阴蒂肉珠（当前充血尺寸 ${clitSize}mm）正随着剧烈心跳一跳一跳地发烫，双腿每次慌乱并拢都会挤压到这颗致命的快感开关；而在其下方的细小处女尿道口更是因“失去男性器官、必须蹲坐排尿”的强烈羞耻认知而括约肌阵阵发麻（当前尿意与失禁指数 ${peeVal}%）。\n💭【${u}的实时内心感受】：“*呜哇……两腿一夹紧就会蹭到最上面那颗又麻又痛的小肉豆，一蹭就浑身发软💦！而且一想到这具身体以后连尿尿都必须把裤子褪到膝盖、羞耻地蹲下来分开两瓣阴唇从那么小的口子里往外漏……我就羞耻得连尿道口都开始发麻了啊啊！🥵*”`),
                    mk(`🕳️ 粉嫩菊穴后庭：${100 - analClose}/100「闭合度${analClose}%•蜜桃臀缝紧缩」`,
                        btnOvr.屁眼实况 || `【第六孔·蜜桃臀缝与粉嫩后庭解剖实况】：\n${rt.屁眼实况 || `深藏在浑圆挺翘的蜜桃肥臀深处，未经任何异物侵入的菊蕾呈现出健康的淡樱粉色，细密的括约肌肉褶紧致闭合（闭合度 ${analClose}%，累计后庭开发 ${analCnt} 次）。但在下半身空荡荡的强烈羞耻反差刺激下，粉嫩菊口正随着急促呼吸紧张地一收一缩。`}\n💭【${u}的实时内心感受】：“*银丝束腰把腰勒得这么细，显得屁股又大又翘，稍微走一步路两瓣屁股肉都在磨蹭😳💦……连后面的小孔都在因为紧张一缩一缩的，千万不能让人看到这么丢脸的后背啊！*”`)
                ]
            },
            // 5. 体液与调教（合并排泄体液与服装道具，去除与六孔的重复，专注体液储量与贴身衣物摩擦）
            {
                title: "体液与调教", icon: "💦", summary: `爱液湿润${wetLevel}% · 储精${totalBellyMl}ml · 贴身丝帛摩擦`,
                items: [
                    mk(`💦 处子爱液与潮吹湿润度：${wetLevel}/100「${wetLevel >= 50 ? "淫水拉丝浸湿衬裤" : "幽谷微潮•花唇晶莹泌水"}」`,
                        btnOvr.爱液分泌 || `【雌穴淫水分泌与气味实况】：\n当前私处湿润分泌指数为 ${wetLevel}/100。由于纯阴之躯对外界刺激异常敏锐，哪怕头脑里还在惊慌失措，腿心深处的花唇却早已不受控制地分泌出晶莹滑腻的处子爱液，混杂着身体蒸腾出的清雅幽兰处子体香与微汗热气，在裙摆下形成一股致命的雌性催情香气！\n💭【${u}的实时内心感受】：“*不、不要再流了啊！💦明明我根本不想发骚，为什么两片阴唇中间还是湿乎乎、滑腻腻的，连素色衬裤的裆部都被浸湿了一小块……要是这股香味飘到门外被师兄闻到，那就全完了啊！🥵*”`),
                    mk(`🥛 三穴精液灌注总储量：${Math.min(100, Math.round(totalBellyMl / 2))}/100「总储精${totalBellyMl}ml (宫${wombMl}/胃${mouthMl}/肛${analMl})」`,
                        btnOvr.精液储量 || `【体内精液蓄积与排泄实况】：\n当前三穴内部共蓄积 ${totalBellyMl}ml 雄性精液（子宫腔 ${wombMl}ml ｜ 口胃 ${mouthMl}ml ｜ 后庭肠腔 ${analMl}ml）。${totalBellyMl > 0 ? `滚烫浓稠的白浊在体内不断刺激着娇嫩黏膜，小腹微隆晃动，随时可能顺着腿根淌出！` : `当前尚处于未被雄性精液污染的纯洁处子状态，体内流淌着纯净清澈的体液，但空虚抽搐的宫腔正处于极易受孕灌满的高危敏感期。`}\n💭【${u}的实时内心感受】：“*${totalBellyMl > 0 ? `呜呜……肚子里被灌进了这么多滚烫腥臭的男人精液，走一步路都在晃荡，真的要怀上小宝宝了啦🥵💦！` : `现在里面还是干干净净的处女之身……可一旦暴露身份或者压不住那些色狼，我这具极品身体绝对会被他们按住灌满滚烫精液的吧……😳💦`}*”`),
                    mk(`👗 贴身衣装与丝帛摩擦：「${curCloth.slice(0, 20)}…」`,
                        btnOvr.当前衣装 || `【外装包裹与贴身内衬摩擦实况】：\n${curCloth}。\n纤细柔韧的柳腰被银丝软甲束带勒得极紧，勾勒出惊心动魄的S型曲线；内里紧贴的青白双色丝质裹胸与修身衬裤随着她的每一次喘息和慌乱动作，不断在挺立的乳尖与微潮的花唇上刮蹭，宛如24小时贴身穿戴的催情刑具！\n💭【${u}的实时内心感受】：“*纳兰嫣然平时穿的衣服为什么里面这么薄、这么紧啊？！💦丝绸裹胸死死贴在奶头上，腰带又把腰勒得这么细，稍微吸口气胸口就绷得慌，每走一步布料都在磨蹭我最敏感的地方……🥵*”`),
                    mk(`🎛️ 体内道具与随身物：「${prop.体内道具 !== "无" ? prop.体内道具 : "修改现实笔已藏入内袋"}」`,
                        btnOvr.体内道具 || `【体内调教道具与随身关键物品】：\n体内塞入道具：${prop.体内道具 || "无"} ｜ 束缚状态：${prop.束缚状态 || "无"} ｜ 淫纹刻印：${mark.淫纹与刻印 || "无"} ｜ 随身物品：耗尽微光的罪魁祸首“修改现实笔”已被慌乱塞入长袍内袋贴身藏好。\n💭【${u}的实时内心感受】：“*那支把我害成这副绝色女体模样的破笔已经没光了……💦现在藏在胸口内袋里硬邦邦地隔着裹胸硌着我的乳肉，我到底该怎么靠这具娇弱敏感的身体在危机四伏的云岚宗活下去啊！🥵*”`)
                ]
            },
            // 6. 淫乱总账本（清晰直观的计数器与内心羞耻复盘）
            {
                title: "淫乱总账本", icon: "💎", summary: `小穴${vagCnt}次 · 口交${mouthCnt}次 · 高潮${orgasmCnt}次`,
                items: [
                    mk(`💎 六孔破处与性交总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${cnt.性交?.乳穴 || 0}」`,
                        `【各孔穴开发累计次数】：\n骚逼贯穿：${vagCnt} 次 ｜ 骚口深喉：${mouthCnt} 次 ｜ 屁眼后庭：${analCnt} 次 ｜ 丰乳夹击：${cnt.性交?.乳穴 || 0} 次 ｜ 玉足摩擦：${cnt.性交?.足腿 || 0} 次。\n💭【${u}的实时内心感受】：“*${vagCnt === 0 ? `目前所有次数都还是0，我好歹还守着这具十八岁极品处女之身的清白💦！但门外的师兄已经找上门来了，我真的能守住这具一碰就流水的身体不被破处吗……🥵` : `呜呜……这具身体已经被男人的大肉棒捅穿过这么多次了，早就记住被填满的滋味了呀🥵💦！`}*”`),
                    mk(`💎 绝顶高潮与身体失控：「高潮${orgasmCnt}次／潮吹${cnt.失控?.喷潮 || 0}次／漏尿${leakCnt}次」`,
                        `【高潮泄身与失禁记录】：\n累计绝顶高潮：${orgasmCnt} 次（强制高潮 ${cnt.高潮?.强制 || 0} 次、公开高潮 ${cnt.高潮?.公开场合 || 0} 次） ｜ 潮吹喷水：${cnt.失控?.喷潮 || 0} 次 ｜ 羞耻失禁漏尿：${leakCnt} 次 ｜ 私下自慰：${cnt.自慰 || 0} 次。\n💭【${u}的实时内心感受】：“*光是衣服磨蹭一下奶头就已经快感累积到3%了，要是真的被按住揉胸摸阴蒂，我这具羞极即泄的身体绝对会当场喷水高潮甚至失禁漏尿的吧？！💦太丢人了，绝对不能变成那样啊！🥵*”`),
                    mk(`💎 内射灌精与饮精记录：「内射${creampie}次／颜射${cnt.射精?.颜射体外 || 0}次／吞精${swallowMl}ml」`,
                        `【雄性精液承受总账】：\n子宫内射：${creampie} 次 ｜ 颜射与体外射精：${cnt.射精?.颜射体外 || 0} 次 ｜ 骚口吞精：${cnt.精液摄入?.吞精次数 || 0} 次（累计吞咽 ${swallowMl}ml）。\n💭【${u}的实时内心感受】：“*一想到男人们那滚烫浓稠、带着腥臭味的白浊精液随时可能射满我这具身体的嘴里和子宫里，我就既害怕又忍不住夹紧了双腿……😳💦*”`),
                    mk(`💎 公开露出与娼妓卖身：「露出${cnt.暴露?.露出 || 0}次／围观${cnt.暴露?.被围观人次 || 0}人／接客${cnt.交易?.接客卖身 || 0}次」`,
                        `【公开羞辱与风月接客总账】：\n当众露出：${cnt.暴露?.露出 || 0} 次 ｜ 围观视奸：${cnt.暴露?.被围观人次 || 0} 人次 ｜ 接客卖身：${cnt.交易?.接客卖身 || 0} 次 ｜ 今日KPI配额：${cnt.今日KPI?.已完成 || 0}/${cnt.今日KPI?.配额 || 2} 项。\n💭【${u}的实时内心感受】：“*堂堂云岚宗少宗主纳兰嫣然，要是被人扒光衣服当众露出、甚至当成妓女一样轮流接客的话，整个加玛帝国都要震动了吧……💦千万不能堕落到那种地步啊！🥵*”`)
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

    // 供主API/副API强刷时使用的后期自动补全指令
    function buildVarUpdatePrompt(u, rawText) {
        return `你是状态栏后台变量更新引擎(V16)。请阅读下方最新故事正文，结合当前变量JSON，输出且仅输出一个 <UpdateVariable>...</UpdateVariable> 块（内含若干行 _.set('${u}.路径', 新值); 语句），绝对不要输出任何其他解释文字！
【必须同步更新与后期自动补全的重点字段】：
1. 根据剧情更新 ${u}.身体.体力、${u}.精神与心理（羞耻度/服从度/沦陷度/快感累积/意识清醒度/人格崩解度）、${u}.核心数值（对肉棒好感度/性欲程度/淫乱恶堕）；
2. 必须更新 ${u}.档案.身份与背景、${u}.实况.内心独白（第一人称带❤️💦🥵表情的羞耻或发情独白，80字以上）、${u}.实况.当前姿势、${u}.实况.当前衣装、${u}.实况.胸部实况、${u}.实况.小穴实况、${u}.实况.子宫实况；
3. 【重要：按钮详情后期补全】请用 _.set('${u}.按钮详情.键名', '【生理与肉体反应】：...(直白下流描写)\\n💭【${u}的实时内心感受】：“*...(带❤️💦🥵的第一人称心声)*”') 动态覆写变化最大的按钮（可选键名：身份与背景、三维肉体、当前姿势、骚口实况、胸部实况、小穴实况、子宫实况、阴蒂尿道、屁眼实况、爱液分泌、当前衣装）；
4. 若触发新性癖或阶段变化，用极度直白下流的名字更新 ${u}.性癖.条目（格式：“直白下流名-成因-第X阶段-数值/100”）。

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
        showToast(`✅ ${sourceLabel}强刷成功！已自动补全 ${setCount} 项下流详情与独白`, "success", 3800);
        return setCount;
    }

    async function triggerMainApiForceUpdate(btnEl = null) {
        const ctx = safeCtx(), chat = ctx?.chat || [];
        if (!chat.length) { showToast("⚠️ 当前没有任何聊天记录可供刷新！", "error"); return; }
        const fid = chat.length - 1, targetMsg = chat[fid], rawText = targetMsg?.mes || "", u = ctx?.name1 || "伊一";
        const oldTxt = btnEl ? btnEl.textContent : "";
        if (btnEl) btnEl.textContent = "⏳ 补全中...";
        showToast("⏳ 正在调用主 API 强制校准并补全各按钮下流详情与第一人称心声...", "info", 5000);
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
        // 高亮渲染 💭【主角的实时内心感受】
        const formattedDesc = (item.desc || "暂无详细描述")
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/(💭【[^】]+】：)([\s\S]*)$/, `<div style="margin-top:10px;padding:10px 12px;background:rgba(243,139,168,0.14);border-left:3.5px solid #f38ba8;border-radius:8px;color:#ffd6e7;font-style:italic;line-height:1.75;"><b style="color:#f9e2af;font-style:normal;display:block;margin-bottom:4px;">$1</b>$2</div>`);
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
            const grid = document.createElement("div");
            grid.style.cssText = "display:grid;grid-template-columns:repeat(2,1fr);gap:10px;";
            d.categories.forEach((cat, idx) => {
                const b = document.createElement("div");
                b.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-left:4px solid ${tc.prim};border-radius:12px;padding:12px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:6px;box-shadow:0 4px 14px rgba(0,0,0,0.45);transition:transform 0.15s ease;`;
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
                const objPreview = parts[0].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 42) + "…";
                const thoughtPreview = parts[1] ? "💭 " + parts[1].replace(/【[^】]+】：?/g, "").replace(/\s+/g, " ").trim().slice(0, 38) + "…" : "";
                b.innerHTML = `${it.keyHTML}${it.barHTML || ""}
                    <div style="font-size:11.5px;color:${tc.sub};margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${objPreview}</div>
                    ${thoughtPreview ? `<div style="font-size:11.5px;color:#ffd6e7;font-style:italic;background:rgba(243,139,168,0.1);padding:3px 7px;border-radius:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${thoughtPreview}</div>` : ""}
                    <div style="display:flex;justify-content:flex-end;margin-top:2px;"><span style="color:${tc.prim};font-size:11px;font-weight:bold;">点开查看解剖详情与完整心声 ▸</span></div>`;
                b.onclick = (e) => { e.stopPropagation(); showDetailPopup(idx); };
                list.appendChild(b);
            });
            body.appendChild(list);
        }
    }

    // 【核心修复】：向 SillyTavern 顶部「扩展 (Extensions)」菜单注入标准折叠开关面板！
    function mountExtensionSettingsMenu() {
        const container = document.getElementById("extensions_settings") || document.getElementById("extensions_settings2");
        if (!container || document.getElementById("st-v16-ext-drawer")) return;
        const drawer = document.createElement("div");
        drawer.id = "st-v16-ext-drawer";
        drawer.className = "inline-drawer";
        drawer.innerHTML = `
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>📊 终极重口状态栏引擎 V16</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content" style="display:none;padding:10px;font-size:13px;">
                <label class="checkbox_label" style="display:flex;align-items:center;gap:8px;margin-bottom:8px;cursor:pointer;">
                    <input id="st-v16-ext-enable" type="checkbox" ${userSettings.enabled ? "checked" : ""}>
                    <span>启用屏幕悬浮状态栏与后台变量注入</span>
                </label>
                <label class="checkbox_label" style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;">
                    <input id="st-v16-ext-hide" type="checkbox" ${userSettings.hideRawBlock ? "checked" : ""}>
                    <span>自动折叠隐藏正文尾部的原始【状态栏】与代码文本</span>
                </label>
                <div style="display:flex;gap:8px;">
                    <button id="st-v16-ext-open" class="menu_button" type="button" style="width:auto;padding:4px 12px;">👑 呼出状态栏面板</button>
                    <button id="st-v16-ext-sync" class="menu_button" type="button" style="width:auto;padding:4px 12px;">🔄 立即重扫楼层</button>
                </div>
            </div>`;
        container.appendChild(drawer);

        const toggleHeader = drawer.querySelector(".inline-drawer-toggle");
        const contentBox = drawer.querySelector(".inline-drawer-content");
        toggleHeader.addEventListener("click", () => {
            contentBox.style.display = contentBox.style.display === "none" ? "block" : "none";
        });

        drawer.querySelector("#st-v16-ext-enable").addEventListener("change", (e) => {
            userSettings.enabled = e.target.checked;
            saveSettings(); applyThemeAndSize();
            showToast(userSettings.enabled ? "✅ 状态栏插件已开启！" : "⏸️ 状态栏插件已隐藏关闭！", "info", 2000);
        });
        drawer.querySelector("#st-v16-ext-hide").addEventListener("change", (e) => {
            userSettings.hideRawBlock = e.target.checked;
            saveSettings(); cleanAll(true);
        });
        drawer.querySelector("#st-v16-ext-open").addEventListener("click", () => {
            userSettings.enabled = true;
            const chk = document.getElementById("st-v16-ext-enable");
            if (chk) chk.checked = true;
            saveSettings(); applyThemeAndSize();
            const panel = document.getElementById("st-v5-panel");
            if (panel) { panel.style.display = "flex"; renderBody(); }
        });
        drawer.querySelector("#st-v16-ext-sync").addEventListener("click", () => {
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

    // 兼容旧版10分类名称并自动映射到新版6大无重复板块
    function mapToSixCategoryTitle(rawTitle) {
        const t = rawTitle.trim();
        if (ICONS[t]) return t;
        if (t.includes("档案") || t.includes("身体") || t.includes("特殊")) return "档案与肉体";
        if (t.includes("核心") || t.includes("精神") || t.includes("心理")) return "恶堕与精神";
        if (t.includes("性癖")) return "下流性癖库";
        if (t.includes("性器官") || t.includes("六孔")) return "六孔解剖台";
        if (t.includes("排泄") || t.includes("体液") || t.includes("服装") || t.includes("道具")) return "体液与调教";
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
            const exCat = map.get(fbCat.title);
            if (exCat && exCat.items.length > 0) {
                // 以6大板块标准按钮为骨架，如果模型输出了带💭心声的完整长文则优先采用，否则使用V16高细节双层模板
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
            h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 查看此层 (#${id}) 6大重口状态栏</div>`;
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
