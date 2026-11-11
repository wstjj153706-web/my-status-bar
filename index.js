// == 状态栏与楼层变量引擎 V14.5 (终极完整版：主API强刷 + 顶部弹窗提示 + 独白/档案实时抓取 + 极致色情重口详尽长文) ==
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

    // 屏幕顶部居中流光弹窗提示 Toast（主/副API更新成功、楼层同步、拉取模型均会醒目提示）
    function showToast(msg, type = "success", duration = 3500) {
        try {
            if (window.toastr && typeof window.toastr[type] === "function") {
                window.toastr[type](msg, "📊 状态栏引擎");
            }
        } catch (e) {}
        let box = document.getElementById("st-v14-toast");
        if (!box) {
            box = document.createElement("div");
            box.id = "st-v14-toast";
            box.style.cssText = "position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;padding:10px 22px;border-radius:99px;font-family:'Microsoft YaHei',sans-serif;font-size:13.5px;font-weight:bold;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,0.8);transition:all 0.25s ease;pointer-events:none;display:none;align-items:center;gap:8px;backdrop-filter:blur(10px);";
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

    const THEMES = {
        "魅魔粉 (默认)": { bg: "linear-gradient(165deg,#181424,#1e192b)", border: "#f38ba8", prim: "#f38ba8", sec: "#cba6f7", text: "#ede6f2", sub: "#a6adc8", card: "linear-gradient(160deg,#1c162b,#141020)", hi: "rgba(243,139,168,0.25)" },
        "暗黑血浆 (重口)": { bg: "linear-gradient(165deg,#1c070b,#100305)", border: "#ff4d6d", prim: "#ff4d6d", sec: "#ff8fa3", text: "#ffe5ec", sub: "#c98a96", card: "linear-gradient(160deg,#290a10,#170408)", hi: "rgba(255,77,109,0.28)" },
        "白浊深渊 (催眠)": { bg: "linear-gradient(165deg,#161b24,#0f131a)", border: "#89b4fa", prim: "#89b4fa", sec: "#b4befe", text: "#eef4ff", sub: "#94a3b8", card: "linear-gradient(160deg,#1e2533,#131822)", hi: "rgba(137,180,250,0.25)" },
        "赛博霓虹 (调教)": { bg: "linear-gradient(165deg,#0b1528,#070b16)", border: "#00f5d4", prim: "#00f5d4", sec: "#f15bb5", text: "#e0fbfc", sub: "#8ecae6", card: "linear-gradient(160deg,#10213d,#091326)", hi: "rgba(0,245,212,0.22)" },
        "鎏金娼馆 (风月)": { bg: "linear-gradient(165deg,#211814,#140e0b)", border: "#f9e2af", prim: "#f9e2af", sec: "#fab387", text: "#fdf6e2", sub: "#bfa888", card: "linear-gradient(160deg,#2c201a,#1a120e)", hi: "rgba(249,226,175,0.22)" }
    };

    let userSettings = {
        theme: "魅魔粉 (默认)", width: 470, height: 620, fontScale: 100,
        apiSyncEnabled: false, apiUrl: "https://api.openai.com/v1/chat/completions",
        apiKey: "", apiModel: "gpt-4o-mini", modelList: []
    };

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v12_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉 (默认)";
            if (!Array.isArray(userSettings.modelList)) userSettings.modelList = [];
        } catch (e) {}
    }
    function saveSettings() {
        try { localStorage.setItem(EXT_ID + "_v12_cfg", JSON.stringify(userSettings)); } catch (e) {}
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

    // 初始变量库（已将羞极即泄修复为第一阶段 0/100，并内置完整动态槽位）
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
                    "见之欲呕-天生冷感，从未与男人亲近，见到粗鄙阳具便本能紧绷排斥-第一阶段-0/100",
                    "清心寡欲-从小被管束极严或未谙男女情事，表面克制禁欲-第一阶段-0/100",
                    "初守清白-未经人事的纯洁处子之身，连自己触碰私处都会害羞发抖-第一阶段-0/100",
                    "羞极即泄-天生脸皮极薄，越是被羞辱注视或私处受磨蹭便越容易敏感泄身-第一阶段-0/100",
                    "抗命顶撞-骨子里带着孤高傲气，面对男人的摆布本能抗拒不肯低头-第一阶段-0/100",
                    "心如止水-心防紧锁，尚未对任何雄性的侵犯产生精神依赖-第一阶段-0/100",
                    "自我完整-神智清醒，清楚知晓自己的原本身份与当前荒唐处境-第一阶段-0/100"
                ]
            },
            实况: {
                内心独白: "",
                当前姿势: "",
                当前衣装: "",
                面容表情: "",
                胸部实况: "",
                小穴实况: "",
                子宫实况: "",
                屁眼实况: "",
                玉足实况: ""
            },
            计数: {
                性交: { 口: 0, 小穴: 0, 屁眼: 0, 乳穴: 0, 足腿: 0, 其他部位: 0, 兽交: 0 },
                高潮: { 总数: 0, 强制: 0, 公开场合: 0, 寸止: 0 },
                射精: { 内射: 0, 颜射体外: 0 },
                精液摄入: { 吞精次数: 0, 累计毫升: 0 },
                自慰: 0, 失控: { 失禁: 0, 喷潮: 0 },
                暴露: { 露出: 0, 被围观人次: 0, 被拍摄: 0 },
                交易: { 接客卖身: 0, 被外借共享: 0 },
                调教代价: { 挨罚: 0, 穿环打孔: 0, 项目完成: 0 },
                孕育: { 产卵次数: 0, 产卵枚数: 0, 受精枚数: 0 },
                泌乳: { 累计毫升: 0, 被吸饮: 0 },
                群交: { 轮奸: 0, 单次最多人数: 0 },
                无防备: { 睡眠中: 0, 昏迷中: 0 },
                今日KPI: { 已完成: 0, 配额: 2 }
            },
            受孕与生理: { 乳穴怀孕: 0, 子宫怀孕: 0, 怀孕进度: 0, 生产次数: 0, 生理周期阶段: 0, 基础体温: 36.5, 受孕概率: 0, 发情中: 0 },
            体内精液存量: { 口内毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
            痕迹与标记: { 鞭痕层数: 0, 体表痕迹: "无", 穿刺与环饰: "无", 淫纹与刻印: "无", 公开字迹: "无", 烙印与编号: "无" },
            体内道具与权限: { 体内道具: "无", 遥控与权限: "无", 束缚状态: "无", 穿戴中的标记物: "无" },
            调教进度: { 当前调教项目: "无", 当前项目阶段: 0, 规矩与日程: "无", 已解锁癖好: [], 奖惩积分: 0, 开发进度: 0 },
            精神与心理扩展: { 失禁与失控: "无", 当前敏感点: "无", 催眠深度: 0, 当前指令: "无", 条件反射触发词: "无", 用药状态: "无" },
            角色能力: { 天赋: "无", 技能: "无" },
            关系与权限: { 被谁拥有: "无", 行动说话与排泄权限: "无", 契约条款: "无", 展示与围观: "无" },
            恶堕进度: { 快感依赖: "无", 自我认同: "无" },
            本回合: { 新增计数: [], 跨档: [], 新解锁性癖: [] }
        };
    }

    let curVars = getInitialVars(), latestStatus = null, activeCat = null, curDetailIdx = 0, inSettings = false;
    let isCleaningDOM = false, cleanTimer = null;

    const ICONS = {
        "角色档案":"👩", "核心数值":"🔥", "精神与心理":"🧠", "总性癖":"🧬",
        "身体情况":"🧍", "性器官":"🌸", "排泄与体液":"🚽", "服装与道具":"👗",
        "特殊状态":"💬", "计数记录":"💎", "体液与气味":"🚽", "痕迹与标记":"💋",
        "体内道具与权限":"🎛️", "受孕与生理":"💊", "关系与权限":"🔗", "调教进度":"📖"
    };
    const SHORT_NAMES = {
        "角色档案":"档案", "核心数值":"核心", "精神与心理":"精神", "总性癖":"性癖",
        "身体情况":"躯体", "性器官":"六孔", "排泄与体液":"排泄", "服装与道具":"衣装",
        "特殊状态":"独白", "计数记录":"总账"
    };

    function varsToYaml(userName, varsObj) {
        function serialize(obj, indent = 2) {
            const pad = " ".repeat(indent);
            let out = "";
            for (const [k, v] of Object.entries(obj)) {
                if (Array.isArray(v)) {
                    if (!v.length) out += `${pad}${k}: []\n`;
                    else { out += `${pad}${k}:\n`; for (const item of v) out += `${pad}  - ${item}\n`; }
                } else if (v !== null && typeof v === "object") {
                    out += `${pad}${k}:\n` + serialize(v, indent + 2);
                } else out += `${pad}${k}: ${v}\n`;
            }
            return out;
        }
        return `${userName}:\n` + serialize(varsObj, 2);
    }

    function buildFullSystemPrompt(userName, currentVars) {
        const currentYaml = varsToYaml(userName, currentVars);
        const isVirgin = (currentVars?.性癖?.条目 || []).some(s => s.includes("初守清白") || s.includes("见之欲呕"));
        const autoRule = isVirgin ? `\n【⚠️ 初始状态自动校准指令】若主角（${userName}）在当前剧情中已被破处、沦为娼妓性奴、或已发生身体改造与剧情进展，请立即根据上下文全量重估所有数值、档案（身份与背景、自我介绍）、实况（内心独白、姿势、衣装）、历史计数与性癖，并在状态栏与末尾 <UpdateVariable> 中用 _.set('${userName}.路径', 新值); 完整写回覆盖！` : "";
        return `\n【当前变量库实时注入值】\n${currentYaml}${autoRule}\n\n【状态栏与变量更新强制规范】\n1. 每条回复末尾按顺序输出：正文 -> 【状态栏｜${userName}】...【/状态栏】 -> <UpdateVariable>块</UpdateVariable>。\n2. 状态栏包含：[[角色档案]]、[[总性癖]]、[[核心数值]]、[[精神与心理]]、[[身体情况]]、[[服装与道具]]、[[性器官]]、[[排泄与体液]]、[[特殊状态]]、[[计数记录]]，每条格式为 -> 标题 | 极度色情重口详尽描写（严禁在描述内使用竖线 |）。\n3. 在 <UpdateVariable> 中除更新数值外，每回合还必须用 _.set 更新：'${userName}.档案.身份与背景'、'${userName}.档案.自我介绍'、'${userName}.实况.内心独白'、'${userName}.实况.当前姿势'、'${userName}.实况.当前衣装'！`;
    }

    function fmtKey(rk) {
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
            .replace(/「([^」]{1,40})」/g, (_, s) => { badges.push(`<span style="background:${tc.hi};border:1px solid ${tc.sec};color:${tc.text};padding:1px 7px;border-radius:6px;font-size:11px;font-weight:bold;">${s}</span>`); return ""; })
            .replace(/[（(]([^）)]{1,45}?(?:阶段|\d+\s*[\/／]\s*\d+)[^）)]{0,25}?)[）)]/g, (_, s) => { badges.push(`<span style="background:rgba(255,255,255,0.1);border:1px solid ${tc.prim};color:${tc.prim};padding:1px 7px;border-radius:6px;font-size:11px;">${s}</span>`); return ""; })
            .replace(/[（(](\+\d+[^）)]{0,15})[）)]/g, (_, s) => { badges.push(`<span style="background:rgba(243,139,168,0.28);border:1px solid #f38ba8;color:#ffb3c6;padding:1px 6px;border-radius:5px;font-size:11px;font-weight:bold;">${s}</span>`); return ""; })
            .replace(/[（(](-\d+[^）)]{0,15})[）)]/g, (_, s) => { badges.push(`<span style="background:rgba(137,180,250,0.25);border:1px solid #89b4fa;color:#b4d0ff;padding:1px 6px;border-radius:5px;font-size:11px;font-weight:bold;">${s}</span>`); return ""; })
            .replace(/↑\s*解锁/g, () => { badges.push(`<span style="background:linear-gradient(90deg,#f38ba8,#fab387);color:#11111b;padding:1px 6px;border-radius:5px;font-size:11px;font-weight:900;">↑解锁</span>`); return ""; })
            .replace(/[：:]\s*(\d+(?:\.\d+)?\s*[\/／]\s*\d+[a-zA-Z\u4e00-\u9fa5]*)\s*$/, (_, n) => { badges.unshift(`<span style="background:rgba(249,226,175,0.16);border:1px solid rgba(249,226,175,0.45);color:#f9e2af;padding:1px 7px;border-radius:6px;font-size:11.5px;font-family:Consolas,monospace;font-weight:bold;">${n}</span>`); return ""; })
            .replace(/[：:]\s*$/, "").trim();

        const keyHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;width:100%;"><span style="color:#f9e2af;font-weight:bold;font-size:13.5px;line-height:1.4;word-break:break-word;">${cleanTitle}</span>${badges.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-end;flex-shrink:0;max-width:58%;">${badges.join("")}</div>` : ""}</div>`;
        const barHTML = pct !== null ? `<div style="display:flex;align-items:center;gap:8px;margin-top:6px;width:100%;"><div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${tc.prim},${tc.sec});border-radius:99px;box-shadow:0 0 8px ${tc.prim};"></div></div><span style="font-size:10.5px;color:${tc.prim};font-family:Consolas,monospace;min-width:30px;text-align:right;">${pct}%</span></div>` : "";
        return { keyHTML, barHTML, cleanTitle, pct };
    }

    function tier5(val, rev = false) {
        const n = Math.max(0, Math.min(100, Number(val) || 0)), v = rev ? (100 - n) : n;
        return v < 20 ? 0 : v < 40 ? 1 : v < 60 ? 2 : v < 80 ? 3 : 4;
    }

    // 10大重口分类详尽长文引擎（完美消除重复计数尾巴，只专注色情细节）
    function getDynamicMetricDetail(type, v, u) {
        const map = {
            cockLove: {
                val: Number(v.核心数值?.对肉棒好感度) || 0, rev: false,
                st: ["厌恶排斥•生理紧绷", "工具麻木•食髓知味", "含泪渴求•穴肉吸附", "痴迷崇拜•主动跪舔", "肉棒至上•终极母畜"],
                d: [
                    `对雄性粗硬滚烫的肉棒抱有强烈的戒备与羞耻抗拒，光是想象那根布满狰狞青筋与腥膻气息的硕大龟头抵在自己娇嫩紧窄的穴口或唇瓣上，${u}便会本能地夹紧双腿、浑身泛起细密的战栗鸡皮疙瘩；然而这具极品敏感躯体在抗拒的同时，尾椎神经却隐隐传来背德的酥麻感。`,
                    `理智防线在反复的挑逗与摩擦下已出现松动。${u}的口腔与下身肉穴已开始记住粗硬阳具的滚烫形状，每当闻到浓郁的雄性荷尔蒙与前列腺液腥味，咽喉便不自觉地分泌晶莹津液，大腿根部内侧的粉嫩花唇更是悄悄充血湿润、溢出清亮拉丝的淫水。`,
                    `清高矜持的心理防线已被滚烫肉棒彻底撞碎！${u}对粗长阳具产生了如同烈性春药般的生理饥渴，目光总是不由自主地黏在男人的胯下鼓包处。只要被硕大龟头抵住唇瓣或阴唇肉缝，腰肢便会瞬间酸软无力，骚逼内壁层层叠叠的软肉饥渴地收缩蠕动、渴望被狠狠捅穿填满。`,
                    `彻头彻尾沉溺于雄性阳具的狂热母狗！${u}已将用骚口和骚逼服侍大肉棒视作至高无上的快感来源。一见到勃起跳动的狰狞巨物便会双膝发软跪倒在地，毫无廉耻地伸出湿滑香舌从浓密囊袋一路舔舐到马眼，眼眶含着淫靡泪花主动摇晃肥臀哀求粗暴抽插。`,
                    `满值恶堕的终极肉棒奴隶！${u}的大脑皮层已被肉棒与浓精彻底支配，哪怕只是闻到一丝包皮垢与精液的浓烈腥臭，都会瞳孔涣散、吐舌流涎，全身骚口、骚逼、屁眼三处肉孔同时疯狂痉挛吸吮，哭喊着主动掰开红肿外翻的阴唇祈求将滚烫浓精尽数射进子宫最深处！`
                ]
            },
            lust: {
                val: Number(v.核心数值?.性欲程度) || 0, rev: false,
                st: ["清心寡欲•微澜初起", "春情暗涌•乳尖发硬", "欲火焚身•淫水拉丝", "重度发情•夹腿索操", "永动机式潮吹母畜"],
                d: [
                    `表面尚维持着清冷克制的姿态，但初生的纯阴娇躯对衣物布料的每一次摩擦都异常敏锐。哪怕只是微微走动或呼吸起伏，裹胸与底裤擦过娇嫩乳尖和阴蒂时，都会在小腹深处激起一圈圈难以启齿的酥麻热流。`,
                    `小腹深处升起一股挥之不去的温吞燥热与空虚酸胀感！胸前两颗娇嫩的乳头在贴身衣料摩擦下充血挺立、发硬发烫，双腿之间更是隐隐泛起湿热潮意，未经人事或刚受刺激的紧致肉穴正一阵阵空虚地微缩抽搐。`,
                    `浓郁滚烫的情欲之火烧遍全身每一根神经！${u}的双颊泛着淫靡酡红，呼吸变得粗重滚烫，丰满雪乳随着急促喘息剧烈起伏。下身骚逼早已淫水泛滥成灾，黏稠拉丝的透明爱液浸湿了底裤与大腿内侧，迫切渴望粗硬滚烫的异物狠狠插入止痒。`,
                    `重度发情失控状态！全身每一寸白腻肌肤都敏感得一碰即颤，充血肿大的阴蒂肉珠暴突在外剧烈跳动。${u}像一条处在发情期的雌兽般死死夹紧双腿、无意识地磨蹭扭动腰臀，嘴里漏出甜腻下流的娇喘哼唧，骚逼里淫水噗嗤噗嗤往外直冒。`,
                    `极度过载的狂暴发情期！${u}脑海里除了交配、被粗暴贯穿与内射灌精外再无半点杂念，浑身滚烫出汗、散发着浓烈刺鼻的雌性发情腥香。乳尖硬如石子，红肿外翻的骚穴与屁眼24小时不停向外喷涌黏腻淫水，软烂的子宫口更是一开一合向下脱垂索精！`
                ]
            },
            corr: {
                val: Number(v.核心数值?.淫乱恶堕) || 0, rev: false,
                st: ["初守贞洁•矜持孤傲", "半推半就•防线龟裂", "食髓知味•放荡沉沦", "下贱娼妇•肉器自觉", "脑髓熔断公用肉便器"],
                d: [
                    `心底仍带着高高在上的矜持自尊与道德底线，对下流露骨的视奸、触碰与身体异变感到极度屈辱难堪，极力想要维持体面端庄的形象，却掩盖不住肉体深处愈演愈烈的敏感反噬。`,
                    `在持续的羞耻刺激与肉体快感冲击下，道德与矜持防线已布满裂痕。面对露骨的挑逗与侵犯开始学会半推半就，嘴上虽然还在微弱抗拒，身体却早已诚实地迎合上去。`,
                    `廉耻与贞操观念已被彻底冲垮！她开始真正享受肉体被粗暴开发、被大肉棒肆意填满的放荡快感，举手投足间褪去了往日的清高，流露出熟练迎合男人的靡烂风情。`,
                    `身心彻底恶堕的极品淫乱尤物！她以自己的娇躯能成为男人发泄兽欲的肉套子为荣，会主动张开双腿展示被玩弄得红肿湿亮的花唇，用最污秽下流的床话浪叫求欢，渴望更粗暴的蹂躏与内射。`,
                    `终极极限恶堕！人类尊严与矜持已100%灰飞烟灭，彻底退化为一具只为承接雄性精液而活的公用排泄肉便器。无论被如何当众羞辱、灌满三穴、甚至失禁潮吹，她都会挂着痴呆融化的阿片脸吐舌流涎，视被操烂灌饱为至高无上的幸福！`
                ]
            },
            shame: {
                val: Number(v.精神与心理?.羞耻度 ?? 100), rev: true,
                st: ["羞极欲死•耳尖滴血", "薄面微红•咬唇隐忍", "习以为常•半掩半露", "不知廉耻•敞腿任看", "羞耻全灭•公开母畜"],
                d: [
                    `羞耻心处于满值绷紧状态！体内自卑敏感的灵魂与这具倾国倾城、极度敏感的肉体产生剧烈冲突。哪怕只是感觉到胸前沉甸甸的乳肉颠簸、或是下身空荡荡的阴户被布料磨蹭出湿意，都会羞耻得双颊涨红如血、耳尖发烫，恨不得当场找条地缝钻进去，而这种极致的羞耻感反而会成倍放大肉体的敏感快感！`,
                    `在接连不断的身体羞耻冲击下，防线开始出现松动。虽然私密部位被触碰或注视时依然会心跳如鼓、满脸通红，但双手的遮挡已变得软弱无力。`,
                    `羞耻感已被磨灭大半！哪怕衣衫不整地露出大片雪白乳肉、或是当着男人的面擦拭大腿根分泌的淫水与精斑，也能在微微脸红后迅速适应。`,
                    `廉耻心几乎荡然无存！哪怕赤身裸体跪在男人胯下口交吞精、或是顶着一肚子滚烫精液走动任由白浊顺着腿根往下淌，她也毫不遮掩，甚至故意分开臀瓣展示湿漉漉的肉穴。`,
                    `羞耻心彻底归零粉碎！哪怕在众目睽睽之下被扒光衣服四脚朝天粗暴操干、当众潮吹失禁、浑身涂满浓精像母狗一样爬行展示外翻的骚逼与屁眼，她也会兴奋得浑身发抖、吐舌高潮！`
                ]
            },
            obey: {
                val: Number(v.精神与心理?.服从度) || 0, rev: false,
                st: ["抗命顶撞•孤高戒备", "委曲求全•被动妥协", "温顺听话•熟练配合", "摇尾乞怜•任打任操", "绝对盲从•肉奴母狗"],
                d: [
                    `表面努力维持着孤高冷傲、不可侵犯的气场，心底对外界的压迫与试探充满警惕与抗拒，绝不肯轻易在男人面前低头认输。`,
                    `在形势逼迫或肉体酸软无力的状态下学会了低头妥协，即使内心羞愤交加，也不得不顺从地按照对方的要求摆出羞耻姿态。`,
                    `面对男人的命令已形成习惯性顺从，极少再出言顶撞，懂得如何主动放松紧绷的肌肉、分开双腿配合对方的玩弄节奏。`,
                    `彻底被驯服的摇尾母狗！对男人的任何粗暴命令都奉若圣旨，不仅会主动跪爬上前用舌头舔净肉棒，挨打受罚时还会一边流着淫水一边哭喊谢恩求操。`,
                    `100%刻入骨髓的绝对奴性！已完全放弃自主意志，哪怕命令她自己掰开骚逼含入异物、吞下所有浓精尿液、或摆出最下贱的母畜姿势彻夜承欢，她都会条件反射般高翘肥臀全力奉承！`
                ]
            },
            fall: {
                val: Number(v.精神与心理?.沦陷度) || 0, rev: false,
                st: ["心如止水•灵魂独立", "感官动摇•肉体习惯", "食髓成瘾•空虚难耐", "重度戒断•渴精成狂", "彻底沉沦•离精失活"],
                d: [
                    `内心尚保持着独立的清醒认知，尚未对任何男人的侵犯产生心理依恋，仍在努力适应并掌控这具过于敏感的新躯体。`,
                    `心理上虽仍在抵抗，但这具娇嫩敏感的肉体已经开始对强烈的感官刺激、以及被滚烫体温包裹充实的触感产生本能依恋。`,
                    `身心已深深陷落！只要稍微有一段时间没被粗暴抚摸或用大肉棒插弄填满，小腹深处就会感到坐立难安、骚穴发痒空虚得直淌水。`,
                    `重度肉体与精神双料成瘾！就像染上烈性毒瘾一样离不开男人的粗暴使用与精液喂养，一旦子宫里的精液流空就会陷入强烈的戒断恐慌。`,
                    `万劫不复的终极沉沦！离开男人的大肉棒与滚烫浓精她就根本活不下去，满心满眼只渴望永远当一只每天被射满三穴的专属性奴母畜！`
                ]
            },
            pleas: {
                val: Number(v.精神与心理?.快感累积) || 0, rev: false,
                st: ["敏感初醒•微酸空虚", "微潮酥麻•电流窜动", "快感攀升•汁水淋漓", "濒临绝顶•宫口痉挛", "高潮过载•阿片失禁"],
                d: [
                    `敏感神经刚刚被唤醒或正处于余韵回落期。丝质衣物每一次擦过挺立的乳尖，或是紧张时小腹深处的紧缩，都会激起一缕缕细微酥麻的电流直窜后脑勺，令下身泛起莫名的暖意与空虚抽搐。`,
                    `酥麻滚烫的快感电流顺着尾椎骨一路窜向小腹与腿心！全身敏感带充血发烫，花唇内壁在刺激下一缩一缩地溢出了清亮润滑的淫水，双膝开始发软打颤。`,
                    `密集汹涌的快感浪潮不断拍打着每一根神经！每一次摩擦、揉捏与顶撞都让${u}浑身剧烈颤抖、粉嫩脚趾紧紧蜷缩，淫水在腿心被搅动得泥泞不堪。`,
                    `快感已蓄积至决堤崩溃的边缘！小腹与阴道括约肌剧烈绷紧痉挛，充血肥大的阴蒂与敏感宫颈口如同通了高压电，只要再稍微刺激一下就会引爆灭顶高潮。`,
                    `灭顶绝顶高潮连续过载爆发！狂暴的性快感瞬间烧穿脑海，她双眼狂翻白眼、香舌无力吐出唇外，滚烫的潮吹淫水与失禁骚尿从大张痉挛的骚逼里狂喷而出！`
                ]
            },
            awake: {
                val: Number(v.精神与心理?.意识清醒度 ?? 100), rev: true,
                st: ["神智清醒•感官敏锐", "微醺迷离•春意上头", "意乱情迷•理智摇晃", "神魂颠倒•空白嗡鸣", "脑髓熔断•阿片痴呆"],
                d: [
                    `头脑保持着100%的清醒，正因如此，躯体传来的每一丝羞耻异样感——胸前沉甸甸的乳肉晃动、衣料磨蹭乳尖的酥麻、下身空荡荡的湿热感——都被毫无保留地放大了十倍，清晰得快要把神经烧断！`,
                    `在羞耻热浪与体内情欲的熏蒸下，眼神开始变得湿润迷离，呼吸微乱，原本紧绷的理智逐渐被肉体传来的酥麻快感夺走注意力。`,
                    `理智防线在密集的感官冲击下摇摇欲坠，秋水般的眼眸涣散失焦，嘴里只能发出断断续续、又软又腻的娇喘呜咽。`,
                    `神智几乎被汹涌的快感与荷尔蒙彻底冲垮，脑海里一片空白嗡鸣，眼珠半翻，嘴角挂着来不及吞咽的晶莹涎水。`,
                    `知性完全瓦解熔断！过载的快感将大脑阿片受体彻底烧穿，${u}翻着白眼吐舌流涎，彻底沦为只会发出“啊嘿、呜嗯♡”淫叫的本能肉块！`
                ]
            },
            brk: {
                val: Number(v.精神与心理?.人格崩解度) || 0, rev: false,
                st: ["自我完整•灵魂错位", "认知动摇•羞耻同化", "自甘下贱•雌化沉沦", "母畜认同•肉便器化", "人格脑死•纯粹肉器"],
                d: [
                    `自我意识依然完整，但内里原本身为普通男大学生的死宅灵魂，正与外面这具倾国倾城、娇嫩敏感的绝色千金肉体发生着剧烈的认知错位与羞耻碰撞，时刻处于害怕露馅的慌乱与自我意识过剩的碎碎念中。`,
                    `在持续的女性感官冲击与羞耻处境下，原有的男性或矜持自我认知开始动摇，潜意识里正一点点被这具渴望抚摸与插入的纯阴雌躯同化。`,
                    `自尊心与原有身份认知大半瓦解，开始发自内心地接受自己身为供男人玩弄、采撷的雌性尤物定位，不再抗拒用身体取悦异性。`,
                    `人格重度崩解扭曲！已彻底抛弃原有的高洁或正常人格，将自己完完全全视作一条靠张开双腿挨操、吞精承欢为生的下贱发情母狗。`,
                    `原有自我人格已永久脑死湮灭！如今活在这具淫熟肉体里的，只剩下一个以充当天下雄性公共排泄便器、孕育精液苗床为唯一生存意义的终极肉便器灵魂！`
                ]
            },
            sta: {
                val: Number(v.身体?.体力 ?? 100), rev: true,
                st: ["精力充沛•气息微乱", "娇躯微软•香汗初沁", "香汗淋漓•双腿打颤", "濒临虚脱•瘫软无力", "彻底脱力•任操肉泥"],
                d: [
                    `体力充沛，十八岁纯阴处子或巅峰娇躯充满柔韧活力，仅因突如其来的身体异变、重心失衡或心理紧张而呼吸微促、双膝微软，随时可承受长时间的剧烈折腾。`,
                    `经历一番紧绷或初步挑逗后，白腻肌肤表面沁出一层薄薄的温热香汗，纤细腰肢与修长双腿略微酸软发颤。`,
                    `体力消耗过半，浑身被黏腻的香汗彻底浸透，青丝凌乱地黏在潮红滚烫的脸颊与锁骨上，下身酸麻发软难以站稳。`,
                    `体力濒临枯竭！剧烈的感官冲击或连续抽插抽干了全身力气，双腿筛糠般剧烈打颤，只能软绵绵地瘫倒在榻上任由摆布。`,
                    `全身彻底虚脱瘫软！像一滩被操烂的春水般烂在地上，连抬动一根手指的力气都没有，唯有骚逼与子宫还在凭着肌肉本能自动痉挛收缩！`
                ]
            }
        };
        const cfg = map[type] || map.cockLove;
        const t = tier5(cfg.val, cfg.rev);
        return { val: cfg.val, stage: cfg.st[t], desc: `【当前数值：${cfg.val}/100 · 第${t + 1}阶段「${cfg.st[t]}」】\n${cfg.d[t]}` };
    }

    function buildFetishRichDesc(rawItem, v, u) {
        const parts = String(rawItem).split("-");
        const name = (parts[0] || "未知性癖").trim();
        const origin = (parts[1] || "特殊体质与心理反差形成").trim();
        const stage = (parts[2] || "第一阶段").trim();
        const valStr = (parts[3] || "0/100").trim();
        const corr = Number(v.核心数值?.淫乱恶堕) || 0;
        const shame = Number(v.精神与心理?.羞耻度 ?? 100);

        if (name.includes("羞极即泄")) {
            return `【性癖成因】：${origin}（当前进度：${stage} · ${valStr}）\n【色情重口发作实况】：${u}的羞耻神经与性快感回路死死缠绕在一起！越是处于担心身份暴露、被异性近距离注视、或是因下身空荡湿热而羞愤欲死的境地（当前羞耻度${shame}/100），她体内的纯阴敏感神经就会越发亢奋过载——耳尖与双颊滚烫如火，胸前软嫩乳肉下的蓓蕾自行充血硬挺，未经人事的紧窄骚穴深处更会不受控制地泛起一阵阵酸麻痉挛，甚至在强烈的羞耻反噬下直接泌出清亮淫水！`;
        }
        if (name.includes("见之欲呕") || name.includes("初守清白") || name.includes("清心寡欲") || name.includes("抗命顶撞") || name.includes("心如止水") || name.includes("自我完整")) {
            return `【性癖成因】：${origin}（当前进度：${stage} · ${valStr}）\n【肉体与心理反差实况】：${u}在意识层面仍拼命维持着清白孤傲或抗拒防备的姿态，然而这具敏感至极的极品纯阴肉体却是个彻头彻尾的“叛徒”。哪怕只是丝帛裹胸轻轻擦过挺立的乳尖、或是男人的气息隔门逼近，都会让这层脆弱的清冷外壳剧烈颤抖，一旦被强行突破防线，压抑已久的感官便会成倍反扑，将她迅速拖入食髓知味的淫乱深渊！`;
        }
        return `【性癖成因】：${origin}（当前进度：${stage} · ${valStr}）\n【深度重口发作实况】：这项性癖已深深烙印在${u}的骨髓与条件反射之中（当前恶堕度${corr}/100）！每当处于触发情境下，她根本无法靠理智控制自己的娇躯——呼吸会瞬间变得粗重滚烫，肥美乳尖充血发硬，下身骚逼更是条件反射般涌出大股黏腻拉丝的淫水，穴肉与宫颈口本能地贪婪蠕动收缩，主动迎合粗暴的玩弄与侵犯！`;
    }

    // 从最新聊天记录中实时提取：*斜体带emoji的内心独白*、当前动作姿势、当前衣着
    function extractLiveFromChat(chatArr, u, c) {
        const res = { thought: "", pose: "", cloth: "", face: "", chest: "", foot: "" };
        if (!Array.isArray(chatArr) || !chatArr.length) return res;

        const recent = chatArr.slice(-5);
        for (let i = recent.length - 1; i >= 0; i--) {
            const raw = (recent[i]?.mes || "").replace(/<think[\s\S]*?<\/think>/gi, "").replace(/<think_nya>[\s\S]*?<\/think_nya>/gi, "");
            if (!raw) continue;
            const cleanBody = raw.split(/【\s*状态栏|<UpdateVariable>/i)[0] || raw;

            // 抓取 *内心独白*（优先抓包含 emoji 或较长的斜体段落）
            if (!res.thought) {
                const italicMatches = [...cleanBody.matchAll(/\*([^*\n]{18,450})\*/g)].map(m => m[1].trim());
                if (italicMatches.length) res.thought = italicMatches[italicMatches.length - 1];
            }

            const sents = cleanBody.split(/[。！？；\n\r]+/).map(s => s.replace(/\*[^*]*\*/g, "").trim()).filter(Boolean);
            
            // 抓取衣着描写
            if (!res.cloth) {
                const kwCloth = /(?:战袍|长裙|裹胸|衬裤|战靴|丝袜|内裤|底裤|胸罩|T恤|旗袍|肚兜|斗篷|束腰|丝帛|赤裸|光裸)/;
                const found = sents.filter(s => s.length > 6 && s.length < 110 && kwCloth.test(s));
                if (found.length) res.cloth = found.slice(-2).join("；").trim();
            }

            // 抓取最新动作与姿态
            if (!res.pose) {
                const kwPose = /(?:撑起|扶着|站起|捂住|喘息|瘫坐|浑身一僵|收拢膝盖|颤抖|跪|趴|弯腰|夹紧|退后|立柱|铜镜)/;
                const found = sents.filter(s => s.length > 8 && s.length < 120 && kwPose.test(s));
                if (found.length) res.pose = found.slice(-2).join("，").trim() + "。";
            }
        }
        return res;
    }

    function buildFullFallbackCategories(u, c, v, latestChatText = "") {
        const mk = (rk, desc) => ({ rawKey: rk, desc, ...fmtKey(rk) });
        const ctx = safeCtx();
        const live = extractLiveFromChat(ctx?.chat || [], u, c);
        const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {};
        const prof = v.档案 || {}, rt = v.实况 || {};

        const cockM = getDynamicMetricDetail("cockLove", v, u), lustM = getDynamicMetricDetail("lust", v, u), corrM = getDynamicMetricDetail("corr", v, u);
        const shameM = getDynamicMetricDetail("shame", v, u), obeyM = getDynamicMetricDetail("obey", v, u), fallM = getDynamicMetricDetail("fall", v, u);
        const pleasM = getDynamicMetricDetail("pleas", v, u), awakeM = getDynamicMetricDetail("awake", v, u), brkM = getDynamicMetricDetail("brk", v, u), staM = getDynamicMetricDetail("sta", v, u);

        const vagCnt = Number(cnt.性交?.小穴) || 0, mouthCnt = Number(cnt.性交?.口) || 0, analCnt = Number(cnt.性交?.屁眼) || 0;
        const creampie = Number(cnt.射精?.内射) || 0, swallowMl = Number(cnt.精液摄入?.累计毫升) || 0;
        const hookerCnt = Number(cnt.交易?.接客卖身) || 0, orgasmCnt = Number(cnt.高潮?.总数) || 0, leakCnt = Number(cnt.失控?.失禁) || 0, squirtCnt = Number(cnt.失控?.喷潮) || 0;
        const wombMl = Number(sp.子宫毫升) || 0, mouthMl = Number(sp.口内毫升) || 0, analMl = Number(sp.屁眼毫升) || 0;
        const corr = Number(v.核心数值?.淫乱恶堕) || 0, lust = Number(v.核心数值?.性欲程度) || 0, pleas = Number(v.精神与心理?.快感累积) || 0;

        const vagWidth = (1.6 + Math.min(3.6, vagCnt * 0.02)).toFixed(1);
        const vagClose = Math.max(18, Math.round(100 - vagCnt * 0.4 - (wombMl > 0 ? 15 : 0)));
        const cervixDrop = Math.min(100, Math.round(creampie * 0.5 + (wombMl > 0 ? 20 : 0)));
        const clitSize = (4.0 + Math.min(8.5, orgasmCnt * 0.06 + pleas * 0.02)).toFixed(1);
        const analWidth = (1.5 + Math.min(3.0, analCnt * 0.025)).toFixed(1);
        const analClose = Math.max(20, Math.round(100 - analCnt * 0.5 - (analMl > 0 ? 15 : 0)));
        const peeVal = Math.min(100, Math.round(15 + lust * 0.35 + pleas * 0.3 + leakCnt * 8));
        const pooVal = Math.min(100, Math.round(10 + analCnt * 2 + (analMl > 0 ? 35 : 0)));
        const totalBellyMl = wombMl + mouthMl + analMl;
        const wetLevel = Math.min(100, Math.round(15 + lust * 0.7 + pleas * 0.5 + (wombMl > 0 ? 25 : 0)));
        const slaveScore = Math.min(100, Math.round((corr + obeyM.val + fallM.val) / 3));

        // 智能回退文本（优先使用通过 _.set 写入的实时变量，其次使用刚抓取的文本，最后使用默认模板）
        const bgDesc = prof.身份与背景 || `【当前身份与肉体背景】：${u}原本是现代一名普通的死宅男大学生，因使用神秘的“修改现实笔”写下愿望，肉体、基因与存在法则被彻底重塑为异界或当前故事中的绝色天之骄女（当前互动场景角色：${c}）。表面拥有倾国倾城、拒人于千里之外的孤高冷艳容颜与尊贵身份，然而这具初生的十八岁纯阴处子娇躯对外界刺激敏锐到了极点，稍微被丝质内衬摩擦乳尖或受到异性气息压迫，就会引发全身战栗、双腿发软与强烈的羞耻反噬。`;
        const selfIntro = prof.自我介绍 || (corr >= 50
            ? `【第一人称淫堕自我介绍】：“我是${u}……虽然表面上还顶着高贵冷艳的名头，但其实这具身体早就被调教得离不开快感了♡……只要想到被男人火热的视线盯着、被粗暴地揉捏奶子捅穿小穴，我的下面就会止不住地流淫水……请尽情使用${u}这具敏感下贱的肉体吧♡……”`
            : `【第一人称羞耻自我介绍】：“我、我叫${u}……明明不久前我还是个再普通不过的死宅男大学生，到底为什么会变成这种连皮肤毛孔都细腻得像瓷娃娃一样的绝色大小姐啊？！💦胸前这两团沉甸甸的软肉好重，稍微动一下裹胸布料磨蹭到乳头就会有一股电流窜到尾椎骨，连两腿之间原本习以为常的男性部位也彻底消失，变成了一条又紧又湿热的敏感肉缝……要是被门外的男人发现这具高冷仙子一样的娇躯里面装着一个惊慌失措的死宅灵魂，甚至被按在地上强行开发侵犯的话，我绝对会羞耻得当场高潮昏死过去的啊啊啊！🥵”`);
        
        const curThought = rt.内心独白 || live.thought || (corr >= 60
            ? `哈啊……好想要大肉棒……${u}的骚逼和子宫已经空虚得快要发疯了♡……只要闻到男人的气息，下面的淫水就噗嗤噗嗤往外冒，求求你快点推开门进来把${u}按在地上狠狠操烂吧♡！`
            : `骗人的吧……这具身体到底怎么回事啊？！💦只是稍微动一下，丝质裹胸磨蹭到乳尖居然会起一身鸡皮疙瘩，连小腹深处都泛起一股莫名其妙的酸软湿热感……❤️门外有人过来了！要是被听出我声音在发抖，或者被推门进来看到我双腿发软扶着柱子喘气的羞耻样子，会不会直接扑上来对我做那种里番里才会发生的过分事情啊？！🥵不行不行，绝对不能露馅，快把双腿夹紧一点，可恶，为什么越夹紧下面反而越觉得空虚发痒啊……💦`);

        const curPose = rt.当前姿势 || live.pose || (corr >= 60
            ? `${u}双腿酸软无力地跪趴在冰冷地面上，纤细腰肢深深下塌，丰满雪白的双臀高高翘起，主动用手指掰开泥泞外翻的阴唇展示给男人看，一边吐着粉舌喘息一边渴望地摇晃尻肉。`
            : `${u}正慌乱地扶着立柱支撑发软的娇躯，双肩因紧张与羞耻而微微颤抖，两条修长白皙的大腿死死并拢内扣，试图止住腿心深处不断传来的陌生的酥麻潮热感，胸前饱满的雪乳随着急促的喘息在紧身裹胸下剧烈起伏。`);

        const curCloth = rt.当前衣装 || live.cloth || (prop.穿戴中的标记物 !== "无" ? prop.穿戴中的标记物 : "月白束腰战袍裙、青白双色丝质裹胸");

        return [
            {
                title: "角色档案", icon: "👩",
                summary: `${corr >= 60 ? "深度沦陷母畜" : "敏感反差尤物"} · 恶堕${corr}%`,
                items: [
                    mk(`👩 身份与背景：${u}「${corr >= 60 ? "发情雌畜" : "清冷敏感躯壳"}」`, `【当前身份与背景实况】：\n${bgDesc}`),
                    mk(`🗣️ 第一人称自我介绍：「${corr >= 60 ? "下贱肉便器自白" : "羞耻慌乱的内心剖白"}」`, `【主角自我认知与独白自白】：\n${selfIntro}`),
                    mk(`📏 罩杯与三维肉体：${prof.罩杯与三维?.split("（")[0] || "36D／165cm"}「丰乳细腰蜜桃臀•极品纯阴」`, `【三维比例与肉体敏化实况】：\n${prof.罩杯与三维 || "身高165cm，腰肢纤细盈盈一握，胸前却顶着一对沉甸甸、饱满白腻的36D极品雪乳，臀部浑圆挺翘。由于是初生重塑或长期开发的纯阴娇躯，全身神经末梢敏感度是常人的十倍以上，稍微隔着布料磨蹭便会引起全身战栗与爱液分泌。"}`),
                    mk(`👁️ 外界风评与觊觎度：「${corr >= 70 ? "人尽可夫的泄欲母狗" : "令人血脉偾张的绝色禁脔"}」`, `【旁人看法与雄性觊觎实况】：\n${prof.社会风评 || `在旁人眼中，${u}拥有一张倾国倾城、拒人于千里之外的清冷绝美脸庞；然而当她因身体敏感而双颊潮红、呼吸急促、眼角含泪时，那种高岭之花濒临凌辱堕落的极致反差感，足以让任何靠近她的男人瞬间兽血沸腾，恨不得当场撕碎她的衣裙将她按在身下肆意贯穿内射！`}`)
                ]
            },
            {
                title: "核心数值", icon: "🔥",
                summary: `好感${cockM.val} · 性欲${lustM.val} · 恶堕${corrM.val}`,
                items: [
                    mk(`💗 对肉棒的好感度：${cockM.val}/100「${cockM.stage}」`, cockM.desc),
                    mk(`🔥 性欲程度：${lustM.val}/100「${lustM.stage}」`, lustM.desc),
                    mk(`🖤 淫乱与恶堕程度：${corrM.val}/100「${corrM.stage}」`, corrM.desc),
                    mk(`⛓️ 母畜奴性与肉器化：${slaveScore}/100「${slaveScore >= 60 ? "雌畜觉醒•主动献穴" : "矜持外皮•肉体诚实"}」`, `【综合肉器化进度：${slaveScore}/100】\n由淫乱恶堕度、服从度与沦陷度综合折算的深层母畜改造指标。${slaveScore >= 50 ? `当前${u}的肉体已经彻底背叛了理智，形成了迎合雄性侵犯的肌肉本能——哪怕嘴上还在抗拒，只要闻到雄性气息或被大手按住腰臀，双腿便会自动软绵绵地分开，腰肢下塌翘起肥臀，将红肿湿润的穴口主动送往肉棒前端！` : `当前${u}虽然在意识层面极力维持着人类的尊严与矜持，但高度敏化的纯阴肉体却诚实得可怕——面对外力触碰或衣料摩擦时，激增的羞耻感不仅无法阻止快感，反而会转化为强烈的背德刺激，一步步将她的身体推向渴望被粗暴支配的深渊。`}`)
                ]
            },
            {
                title: "精神与心理", icon: "🧠",
                summary: `羞耻${shameM.val} · 服从${obeyM.val} · 快感${pleasM.val}`,
                items: [
                    mk(`😳 羞耻度：${shameM.val}/100「${shameM.stage}」`, shameM.desc),
                    mk(`🙇 服从度：${obeyM.val}/100「${obeyM.stage}」`, obeyM.desc),
                    mk(`💘 沦陷度：${fallM.val}/100「${fallM.stage}」`, fallM.desc),
                    mk(`💓 快感累积：${pleasM.val}/100「${pleasM.stage}」`, pleasM.desc),
                    mk(`🌙 意识清醒度：${awakeM.val}/100「${awakeM.stage}」`, awakeM.desc),
                    mk(`🧠 人格崩解度：${brkM.val}/100「${brkM.stage}」`, brkM.desc),
                    mk(`🌀 催眠与常识改写：${extPsy.催眠深度 || 0}/100「${(extPsy.催眠深度 || 0) > 0 ? "潜指令生效中" : "感官冲击自然同化"}」`, `【深层精神控制与敏化实况】：\n当前催眠深度：${extPsy.催眠深度 || 0}/100 ｜ 当前敏感点：${extPsy.当前敏感点 || "乳尖蓓蕾、耳根、小腹深处与阴蒂"} ｜ 生效指令：${extPsy.当前指令 || "无"} ｜ 条件反射触发词：${extPsy.条件反射触发词 || "脚步声、门扉推开声、衣料摩擦"} ｜ 用药状态：${extPsy.用药状态 || "无"}。强烈的感官反差正不断冲刷着她的神经防线，将每一次羞耻战栗都转化为烙印在灵魂深处的快感记忆。`)
                ]
            },
            {
                title: "总性癖", icon: "🧬",
                summary: `已激活 ${(v.性癖?.条目 || []).length} 项深度重口性癖`,
                items: (v.性癖?.条目 || []).map(s => {
                    const p = String(s).split("-");
                    const titleStr = `🧬 性癖•${p[0] || s}（${p[2] || "第一阶段"}，${p[3] || "0/100"}）`;
                    return mk(titleStr, buildFetishRichDesc(s, v, u));
                })
            },
            {
                title: "身体情况", icon: "🧍",
                summary: `全身重口解剖实况 · 体力${staM.val}%`,
                items: [
                    mk(`⚡ 体力与脱力：${staM.val}/100「${staM.stage}」`, staM.desc),
                    mk(`🥵 面容与骚浪表情：「${rt.面容表情 ? rt.面容表情.slice(0, 18) : (corr >= 50 ? "媚眼如丝•吐舌流涎" : "双颊绯红•耳尖滴血")}」`, `【面部神态与体表痕迹实况】：\n${rt.面容表情 || `绝美倾城的脸庞此刻涨得通红，一直蔓延到精致的耳尖与修长雪颈（体表痕迹：${mark.体表痕迹 || "面颊绯红、肌肤微汗"}）。秋水般的眸子里泛着一层因紧张与羞耻刺激而浮现的潋滟水雾，薄薄的樱唇微微张开喘息，吐出带着幽兰体香的滚烫热气，一副既想维持孤高威严、却又被肉体敏感折磨得快要哭出来的诱人模样。`}`),
                    mk(`🍒 胸膛与丰满奶子：「${rt.胸部实况 ? rt.胸部实况.slice(0, 18) : "饱满挺翘•乳尖充血硬挺"}」`, `【双乳与乳尖敏化实况】：\n${rt.胸部实况 || `胸前两团沉甸甸的饱满雪乳随着急促呼吸剧烈起伏颠动，紧贴在肌肤上的丝质裹胸被撑得紧绷欲裂。那两颗未经人事的粉嫩乳头因刚才衣料的轻微摩擦，此刻已彻底充血挺立如两颗熟透的红豆，稍微一动便会擦过丝帛，激起一阵直窜后脑勺的酥麻电流！`}`),
                    mk(`🤰 小腹与精液肚：${totalBellyMl}/200ml「${totalBellyMl >= 60 ? "盛精微隆蛙肚•按压晃动" : (totalBellyMl > 0 ? "宫腔蓄精•沉甸坠胀" : "小腹酸软•空虚抽搐")}」`, `【腰腹与内腔饱胀实况】：\n纤细柔韧的柳腰盈盈一握，当前体内共蓄积着 ${totalBellyMl}ml 浓稠精液（子宫${wombMl}ml、胃袋${mouthMl}ml、后庭${analMl}ml）。${totalBellyMl > 0 ? `平坦白腻的小腹因灌满滚烫白浊而微微隆起弧度，走动间能清晰感觉到精浆在腹腔深处沉甸甸地晃动坠胀！` : `此时小腹深处因极度紧张与雌性荷尔蒙的冲刷，正泛起一股莫名的暖意与空虚酸软感，子宫与下腹肌肉不受控制地微微抽搐。`}`),
                    mk(`🦶 蜜臀与修长玉足：「${rt.玉足实况 ? rt.玉足实况.slice(0, 18) : "双腿发软内扣•玉足趾尖蜷缩"}」`, `【臀腿与玉足实况】：\n${rt.玉足实况 || `浑圆挺翘的蜜桃肥臀将裙摆撑出惊心动魄的弧度，一双修长笔直的雪白美腿此刻因重心失衡与害羞而软绵绵地并拢内扣；包裹在精致战靴与丝袜中的纤细玉足更是因身体的酥麻电流而本能地紧紧蜷缩起粉嫩脚趾，足心沁出一层薄薄的香汗。`}`)
                ]
            },
            {
                title: "性器官", icon: "🌸",
                summary: `六孔重口形变 · 孔径${vagWidth}cm · 闭合${vagClose}%`,
                items: [
                    mk(`👄 骚口与深喉腔：口交${mouthCnt}次／吞精${swallowMl}ml「${mouthCnt > 0 ? "唇肿含腥•深喉开发" : "樱唇软糯•娇啼微喘"}」`, `【第一孔·口腔与咽喉实况】：\n双唇娇嫩饱满，舌尖粉嫩湿滑，喉咙里溢出的声音清冽中带着酥软颤音。${mouthCnt > 0 ? `在经历过粗大肉棒的深喉顶撞与浓精浇灌后，口腔黏膜与咽喉深处已留下了深刻的异物形状记忆，呼吸间尽是淫靡气息。` : `虽尚未被雄性阳具强行顶入深喉，但急促喘息间分泌的清甜津液已浸润了整片唇瓣，一旦被粗硬巨物撬开贝齿，必会呈现出极致的包裹吸附感。`}`),
                    mk(`🍒 骚乳与乳腺孔：泌乳${cnt.泌乳?.累计毫升 || 0}ml「雪乳软腻•乳尖通电敏化」`, `【第二孔·胸乳与乳腺实况】：\n肌肤白皙晶莹得近乎透明，两团丰盈乳肉软腻弹滑，顶端的粉嫩蓓蕾敏感到了极点。哪怕只是隔着轻薄裹胸被空气或布料轻轻刮蹭，都会像通了高压电一般引起浑身寒毛倒竖、双腿发软，乳腺深处更是隐隐发胀发麻。`),
                    mk(`🫀 子宫受孕苗床：内射${creampie}次／储精${wombMl}ml「脱垂度${cervixDrop}%•${wombMl > 0 ? "宫腔盛精饱满" : "纯阴宫口微张渴求"}」`, `【第三孔·子宫与宫颈实况】：\n${rt.子宫实况 || (wombMl > 0 ? `子宫腔内正满满当当地盛着 ${wombMl}ml 滚烫浓稠的雄性精液（受孕概率 ${v.受孕与生理?.受孕概率 || 25}%），宫颈口被开发得软烂微张（脱垂度${cervixDrop}%），正一缩一缩地贪婪吮吸着精浆！` : `深藏在小腹内部的纯阴处子子宫温暖而紧致，此刻受外界危机与敏感体质的双重刺激，原本紧闭的娇嫩宫颈口竟泛起一阵阵莫名的酸软抽搐，仿佛在本能地恐惧又渴望着被粗长肉棒一举撞开、灌入滚烫浓精！`)}`),
                    mk(`🌺 骚逼前穴：贯穿${vagCnt}次／闭合度${vagClose}/100「孔径${vagWidth}cm•${vagCnt > 0 ? "花唇外翻泥泞漏精" : "极品处女一线鲍•春水初溢"}」`, `【第四孔·阴道与花唇物理实况】：\n${rt.小穴实况 || (vagCnt > 0 ? `前穴极限撑开孔径已达 ${vagWidth}cm，常态闭合度跌至 ${vagClose}%。两片粉嫩阴唇被反复摩擦得充血外翻，泥泞不堪的穴口根本合不拢，黏稠拉丝的淫水混着乳白精液正顺着肉缝不断往外溢流！` : `紧致如初生花苞般从未经人事的极品处女白虎幽谷！两瓣粉嫩花唇毫无杂毛与暗沉，饱满地紧紧贴合在一起形成一道诱人的一线鲍；然而此刻在极度羞耻与紧张的刺激下，层叠紧窄的处子内壁竟已悄然泌出一层清亮滑腻的春水，把贴身衬裤晕湿了一小块！`)}`),
                    mk(`💧 阴蒂与尿道口：高潮${orgasmCnt}次／尺寸${clitSize}mm「敏感肉珠充血微颤」`, `【第五孔·阴蒂与尿道括约肌实况】：\n隐藏在粉嫩花唇顶端的敏感阴蒂肉珠（当前尺寸 ${clitSize}mm）正随着急促的心跳微微充血跳动，双腿每次并拢摩擦都会刮过这颗致命的快乐开关，激起一阵令人头皮发麻的酸软尿意与快感电流。`),
                    mk(`🕳️ 屁眼后庭：开发${analCnt}次／闭合度${analClose}/100「${analCnt > 0 ? `孔径${analWidth}cm•括约肌松弛` : "粉嫩菊蕾紧闭•羞耻收缩"}」`, `【第六孔·后庭菊穴实况】：\n${rt.屁眼实况 || (analCnt > 0 ? `后庭括约肌已被开拓至孔径 ${analWidth}cm（闭合度${analClose}%），肠腔内残留着 ${analMl}ml 黏腻白浊，肉褶随着呼吸淫靡地一收一缩。` : `位于蜜桃臀缝深处的粉嫩菊穴紧致无瑕，浅浅的肉褶呈现出健康的樱粉色，未经任何异物侵入；但在下半身空荡荡的强烈羞耻感刺激下，后庭括约肌正随着呼吸紧张地一紧一缩。`)}`)
                ]
            },
            {
                title: "排泄与体液", icon: "🚽",
                summary: `储精${totalBellyMl}ml · 湿润${wetLevel}% · 尿意${peeVal}%`,
                items: [
                    mk(`🥛 体内精液总储量：${totalBellyMl}/200ml「宫内${wombMl}ml•口胃${mouthMl}ml•后庭${analMl}ml」`, `【三穴精液灌注与残留实况】：\n当前身体内部共蓄积 ${totalBellyMl}ml 雄性精液。${totalBellyMl > 0 ? `滚烫黏稠的白浊在体温烘烤下散发出浓郁的雄性石楠花腥膻味，不断刺激着黏膜内壁，随时可能顺着合不拢的穴口滑落滴淌！` : `当前三穴内部尚无外来精液残留，体内流淌着纯净清澈的处子体液，唯有愈发敏感的肉壁正在分泌滑腻的天然润滑液。`}`),
                    mk(`💦 淫水与潮吹分泌：${wetLevel}/100「${wetLevel >= 50 ? "春水泛滥•拉丝湿透底裤" : "幽谷微潮•花唇晶莹湿润"}」`, `【雌穴爱液分泌实况】：\n当前私处湿润分泌指数为 ${wetLevel}/100。由于纯阴之躯对外界刺激异常敏锐，哪怕头脑里羞愤欲死，腿心深处的花唇却早已不受控制地泌出晶莹粘稠的爱液，行走或并腿间带来一阵阵羞人至极的湿滑黏腻感。`),
                    mk(`🚰 膀胱尿意与失禁控制：${peeVal}/100「${peeVal >= 60 ? "括约肌酸软•濒临失禁" : "下腹酸麻•羞耻忍耐"}」`, `【膀胱压迫与排泄羞耻实况】：\n当前膀胱尿意指数 ${peeVal}/100。对于刚刚拥有或正处于高度敏感状态的女性躯体而言，失去男性器官后“连排尿都必须羞耻地褪下裤子蹲坐分开双腿”的认知冲击，正让她的尿道括约肌在紧张中阵阵发麻。`),
                    mk(`👃 全身幽兰体香与气味：「清雅幽兰处子体香混杂微汗热气」`, `【五感气味实况】：\n雪白娇嫩的肌肤表面正蒸腾着因剧烈心跳与紧张流汗而散发的温热气息，一股天然清雅、却又透着致命雌性诱惑的幽兰体香从衣领与裙摆间丝丝缕缕地飘散出来，足以令任何靠近的雄性瞬间呼吸粗重。`)
                ]
            },
            {
                title: "服装与道具", icon: "👗",
                summary: `${curCloth ? curCloth.slice(0, 16) : "贴身衣物"}`,
                items: [
                    mk(`👕 当前衣装与内衬穿戴：「${curCloth ? curCloth.slice(0, 22) : "月白束腰战袍裙•青白丝质裹胸"}」`, `【外装与贴身内衬摩擦实况】：\n${curCloth || "身穿月白色镶银丝云纹束腰战袍裙，纤细柳腰被银丝软甲束带勒得极紧，勾勒出惊心动魄的S型曲线；内里紧贴着轻薄柔软的青白双色丝质裹胸与修身素色衬裤。每一个细微动作都会让滑腻丝帛摩擦过胸前挺立的敏感乳尖与腿心娇嫩花唇，带来令人面红耳赤的酥麻感！"}`),
                    mk(`🎀 体内道具与随身标记：「${prop.体内道具 !== "无" || prop.束缚状态 !== "无" ? "调教道具生效中" : "无体内异物•随身道具携带"}」`, `【体内道具与规矩日程实况】：\n体内道具：${prop.体内道具 || "无"} ｜ 遥控权限：${prop.遥控与权限 || "无"} ｜ 束缚状态：${prop.束缚状态 || "无"} ｜ 穿刺与淫纹：${mark.穿刺与环饰 || "无"}／${mark.淫纹与刻印 || "无"} ｜ 当前规矩与日程：${v.调教进度?.规矩与日程 || "维持人设，掩饰身体异样与敏感失态"}。`)
                ]
            },
            {
                title: "特殊状态", icon: "💬",
                summary: `实时更新内心独白 · 当前肢体定格`,
                items: [
                    mk(`💬 内心想法（实时独白）：「${corr >= 60 ? "母畜发情渴求" : "死宅灵魂羞耻崩坏碎碎念"}」`, `【第一人称实时内心独白（已自动抓取最新楼层心声）】：\n“${curThought}”`),
                    mk(`😃 当前姿势与动作定格：「${curPose ? curPose.slice(0, 20) : "扶柱夹腿喘息•掩饰敏感战栗"}」`, `【当前身体姿态与动作实况】：\n${curPose}`),
                    mk(`🔔 当前核心敏感带：「${extPsy.当前敏感点 ? extPsy.当前敏感点.slice(0, 22) : "挺立乳尖与空虚小腹深处"}」`, `【神经敏化与条件反射实况】：\n${extPsy.当前敏感点 || "胸前被丝质裹胸紧贴摩擦的两颗娇嫩乳尖，以及因紧张而泛起莫名暖意与空虚抽搐感的下腹部深处"}。只要受到丝毫外界声音惊吓或视线注视，敏感带就会瞬间放大十倍快感电流！`)
                ]
            },
            {
                title: "计数记录", icon: "💎",
                summary: `接客${hookerCnt} · 小穴${vagCnt} · 内射${creampie}`,
                items: buildCountItemsFromVars(v, mk)
            }
        ];
    }

    function getFallbackData(latestChatText = "") {
        const ctx = safeCtx(), u = ctx?.name1 || "伊一", c = ctx?.name2 || "当前角色";
        return { charName: u, floorId: `${c} · 实时`, categories: buildFullFallbackCategories(u, c, curVars, latestChatText) };
    }

    function applyThemeAndSize() {
        const panel = document.getElementById("st-v5-panel"), toggleBtn = document.getElementById("st-v5-toggle");
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        if (panel) {
            panel.style.background = tc.bg; panel.style.borderColor = tc.border; panel.style.color = tc.text;
            panel.style.width = `${userSettings.width || 470}px`; panel.style.height = `${userSettings.height || 620}px`;
            panel.style.zoom = `${(userSettings.fontScale || 100) / 100}`;
        }
        if (toggleBtn) {
            toggleBtn.style.background = `linear-gradient(135deg, ${tc.prim}, ${tc.sec})`;
            toggleBtn.style.boxShadow = `0 6px 20px ${tc.hi}`;
        }
    }

    function buildVarUpdatePrompt(u, rawText) {
        return `你是状态栏后台变量更新引擎。请阅读下方最新故事正文，结合当前变量JSON，输出且仅输出一个 <UpdateVariable>...</UpdateVariable> 块（内含若干行 _.set('${u}.路径', 新值); 语句），绝对不要输出任何其他解释文字！
【必须同步更新的重点字段】：
1. 根据剧情更新 ${u}.身体.体力、${u}.精神与心理（羞耻度/服从度/沦陷度/快感累积/意识清醒度/人格崩解度）、${u}.核心数值（对肉棒好感度/性欲程度/淫乱恶堕）；
2. 必须更新 ${u}.档案.身份与背景（概括主角当前身份处境，80字以上）、${u}.档案.自我介绍（第一人称羞耻或堕落自我介绍，80字以上）；
3. 必须更新 ${u}.实况.内心独白（提取或编写主角当下第一人称带❤️💦🥵表情的心理独白，100字以上）、${u}.实况.当前姿势（详写当下身体姿态与动作，60字以上）、${u}.实况.当前衣装、${u}.实况.面容表情、${u}.实况.胸部实况、${u}.实况.小穴实况、${u}.精神与心理扩展.当前敏感点；
4. 若发生性行为或性癖变化，同步更新 ${u}.计数 与 ${u}.性癖.条目。

当前变量JSON：
${JSON.stringify(curVars)}

最新故事正文：
${rawText.slice(-3200)}

请立即输出 <UpdateVariable> 块：`;
    }

    function applyApiReplyToFloor(reply, targetMsg, fid, sourceLabel = "副API") {
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
        recalc(true);
        cleanDOM(fid, true);
        showToast(`✅ ${sourceLabel}变量更新成功！已同步 ${setCount} 项数值与独白实况`, "success", 3800);
        return setCount;
    }

    // 🔄 主API强刷：直接调用酒馆原生 generateQuietPrompt（支持一键更新独白、姿势、档案与数值）
    async function triggerMainApiForceUpdate(btnEl = null) {
        const ctx = safeCtx(), chat = ctx?.chat || [];
        if (!chat.length) { showToast("⚠️ 当前没有任何聊天记录可供刷新！", "error"); return; }
        const fid = chat.length - 1, targetMsg = chat[fid], rawText = targetMsg?.mes || "";
        const u = ctx?.name1 || "伊一", oldTxt = btnEl ? btnEl.textContent : "";
        if (btnEl) btnEl.textContent = "⏳ 主API强刷中...";
        showToast("⏳ 正在调用角色卡主 API 强制校准全部变量与独白...", "info", 5000);

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
            } else throw new Error("当前酒馆版本未暴露主API静默接口，请在⚙️设置中配置副API");

            const count = applyApiReplyToFloor(reply, targetMsg, fid, "主API");
            if (count > 0) {
                if (btnEl) btnEl.textContent = `✅ 已更新(${count}项)`;
            } else {
                recalc(true); cleanAll(true);
                if (btnEl) btnEl.textContent = "✅ 已扫描同步";
                showToast("✅ 已完成全楼层扫描与正文独白提取！（主API未返回额外_.set）", "info");
            }
        } catch (err) {
            console.error("[my-status-bar] Main API Force Update Error:", err);
            if (btnEl) btnEl.textContent = "❌ 强刷失败";
            showToast("❌ 主API强刷失败：" + (err.message || "请检查主API连接"), "error", 4500);
        }
        if (btnEl && oldTxt) setTimeout(() => { btnEl.textContent = "🔄 主API强刷"; }, 2500);
    }

    // 🔌 副API自动更新（带 Toast 弹窗提示）
    async function triggerExternalApiUpdate(manualFloorId = null, statusBtn = null) {
        const { chatUrl } = getNormalizedEndpoints(userSettings.apiUrl);
        if (!chatUrl || !userSettings.apiKey) {
            if (manualFloorId !== null || statusBtn) showToast("⚠️ 请先在 ⚙️设置 中填写副 API 地址 (URL) 和 API Key！", "error");
            return;
        }
        const ctx = safeCtx(), chat = ctx?.chat || [];
        if (!chat.length) return;
        const fid = manualFloorId !== null ? manualFloorId : (chat.length - 1);
        const targetMsg = chat[fid], rawText = targetMsg?.mes || "";
        if (!rawText) return;

        const btn = statusBtn || document.getElementById("st-v12-api-test"), oldTxt = btn ? btn.textContent : "";
        if (btn) btn.textContent = "⏳ 请求副API中...";
        showToast("⏳ 正在通过副 API 后台计算本层变量与独白...", "info", 3000);

        try {
            const u = ctx?.name1 || "伊一";
            const prompt = buildVarUpdatePrompt(u, rawText);
            const res = await fetch(chatUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${userSettings.apiKey}` },
                body: JSON.stringify({
                    model: userSettings.apiModel || "gpt-4o-mini",
                    messages: [{ role: "system", content: "你是一个只输出 <UpdateVariable>_.set(...);</UpdateVariable> 代码块的变量引擎。" }, { role: "user", content: prompt }],
                    temperature: 0.25, stream: false
                })
            });
            const resText = await res.text();
            if (!resText || !resText.trim()) throw new Error(`空响应 (HTTP ${res.status})，请检查URL或模型名`);
            let reply = "";
            if (resText.trim().startsWith("data:")) {
                for (const line of resText.split("\n")) {
                    const t = line.replace(/^data:\s*/, "").trim();
                    if (!t || t === "[DONE]") continue;
                    try { const ck = JSON.parse(t); reply += ck?.choices?.[0]?.delta?.content || ck?.choices?.[0]?.message?.content || ""; } catch (e) {}
                }
            } else {
                let data;
                try { data = JSON.parse(resText); } catch (e) { throw new Error(`非JSON响应 (HTTP ${res.status}): ${resText.slice(0, 70)}`); }
                if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
                reply = data?.choices?.[0]?.message?.content || "";
            }
            const count = applyApiReplyToFloor(reply, targetMsg, fid, "副API");
            if (count > 0) {
                if (btn) btn.textContent = `✅ 副API已同步(${count}项)！`;
            } else {
                if (btn) btn.textContent = "⚠️ 未返回有效 _.set";
                showToast("⚠️ 副API返回内容中未检测到有效的 _.set 语句", "error");
            }
        } catch (err) {
            if (btn) btn.textContent = "❌ " + (err.message || "请求失败").slice(0, 24);
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
        document.getElementById("st-v6-det-desc").textContent = item.desc || "暂无详细描述";
        document.getElementById("st-v6-det-page").textContent = `${cat.icon} ${cat.title} (${itemIdx + 1}/${cat.items.length})`;
        ov.style.display = "flex";
    }

    function renderSettingsView(body) {
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        const box = document.createElement("div");
        box.style.cssText = "display:flex;flex-direction:column;gap:12px;font-size:12.5px;";
        const hasModels = Array.isArray(userSettings.modelList) && userSettings.modelList.length > 0;
        box.innerHTML = `
            <div style="background:${tc.card};border:1px solid ${tc.border};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎨 1. 状态栏主题样式切换</div>
                <div id="st-v12-themes" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"></div>
            </div>
            <div style="background:${tc.card};border:1px solid ${tc.border};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">📐 2. 窗口尺寸与字号</div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>宽度 (<b id="st-w-val">${userSettings.width}</b>px)：</span><input id="st-w-rng" type="range" min="320" max="900" value="${userSettings.width}" style="flex:1;accent-color:${tc.prim};"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>高度 (<b id="st-h-val">${userSettings.height}</b>px)：</span><input id="st-h-rng" type="range" min="340" max="920" value="${userSettings.height}" style="flex:1;accent-color:${tc.prim};"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><span>字号 (<b id="st-z-val">${userSettings.fontScale}</b>%)：</span><input id="st-z-rng" type="range" min="80" max="135" value="${userSettings.fontScale}" style="flex:1;accent-color:${tc.prim};"></div>
            </div>
            <div style="background:${tc.card};border:1px solid ${tc.border};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🔌 3. 独立副 API 自动更新与模型拉取</div>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input id="st-api-chk" type="checkbox" ${userSettings.apiSyncEnabled ? "checked" : ""} style="accent-color:${tc.prim};"><span>启用每回合结束后自动调用副 API 更新变量（带弹窗提示）</span></label>
                <input id="st-api-url" type="text" placeholder="API 地址，如 https://api.openai.com/v1" value="${userSettings.apiUrl || ""}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                <input id="st-api-key" type="password" placeholder="API Key (sk-...)" value="${userSettings.apiKey || ""}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                <div style="display:flex;gap:6px;align-items:center;">
                    <input id="st-api-mod" type="text" placeholder="模型名称，可手动输入或点击右侧拉取" value="${userSettings.apiModel || ""}" style="flex:1;background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                    <button id="st-v13-fetch-models" type="button" style="background:rgba(203,166,247,0.25);color:#f5c2e7;border:1px solid ${tc.sec};border-radius:6px;padding:6px 10px;font-weight:bold;cursor:pointer;white-space:nowrap;font-size:12px;">📥 拉取模型</button>
                </div>
                <select id="st-api-mod-sel" style="display:${hasModels ? "block" : "none"};background:#11111b;color:#f9e2af;border:1px solid ${tc.prim};border-radius:6px;padding:6px 8px;font-size:12px;cursor:pointer;">
                    ${(userSettings.modelList || []).map(m => `<option value="${m}" ${m === userSettings.apiModel ? "selected" : ""}>${m}</option>`).join("")}
                </select>
                <div style="display:flex;gap:8px;margin-top:4px;">
                    <button id="st-v12-api-save" type="button" style="flex:1;background:${tc.prim};color:#11111b;border:none;border-radius:8px;padding:7px;font-weight:bold;cursor:pointer;">💾 保存设置并返回</button>
                    <button id="st-v12-api-test" type="button" style="flex:1;background:${tc.hi};color:#fff;border:1px solid ${tc.sec};border-radius:8px;padding:7px;font-weight:bold;cursor:pointer;">⚡ 立即用副API刷新本层</button>
                </div>
            </div>`;
        body.appendChild(box);

        const tBox = box.querySelector("#st-v12-themes");
        Object.keys(THEMES).forEach(tName => {
            const tb = document.createElement("button"); tb.type = "button";
            const act = userSettings.theme === tName;
            tb.style.cssText = `padding:7px 8px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:12px;border:1.5px solid ${act ? THEMES[tName].prim : "rgba(255,255,255,0.15)"};background:${THEMES[tName].bg};color:${THEMES[tName].text};`;
            tb.textContent = (act ? "✅ " : "🎨 ") + tName;
            tb.onclick = () => { userSettings.theme = tName; saveSettings(); applyThemeAndSize(); recalc(); };
            tBox.appendChild(tb);
        });

        const bindRng = (id, valId, key) => {
            const el = box.querySelector(id), vEl = box.querySelector(valId);
            el.oninput = () => { userSettings[key] = Number(el.value); vEl.textContent = el.value; applyThemeAndSize(); };
            el.onchange = saveSettings;
        };
        bindRng("#st-w-rng", "#st-w-val", "width"); bindRng("#st-h-rng", "#st-h-val", "height"); bindRng("#st-z-rng", "#st-z-val", "fontScale");

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
            showToast("💾 状态栏与副 API 设置已保存！", "success", 2000);
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
            homeBtn.textContent = "🏠总览";
            homeBtn.onclick = () => { inSettings = false; activeCat = null; renderBody(); };
            tabBar.appendChild(homeBtn);

            d.categories.forEach((cat, idx) => {
                const tb = document.createElement("button"); tb.type = "button";
                const isAct = !inSettings && activeCat === idx;
                tb.style.cssText = `flex-shrink:0;padding:4px 9px;border-radius:99px;font-size:11.5px;font-weight:bold;cursor:pointer;border:1px solid ${isAct ? tc.prim : "rgba(255,255,255,0.15)"};background:${isAct ? tc.hi : "rgba(0,0,0,0.35)"};color:${isAct ? tc.prim : tc.text};`;
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
                b.style.cssText = `background:${tc.card};border:1px solid rgba(255,255,255,0.14);border-left:3.5px solid ${tc.prim};border-radius:12px;padding:11px 12px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 12px rgba(0,0,0,0.4);`;
                b.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13.5px;font-weight:bold;color:${tc.prim};">${cat.icon} ${cat.title}</span><span style="font-size:10.5px;background:${tc.hi};color:${tc.text};padding:1px 6px;border-radius:99px;">${cat.items.length}项 ▸</span></div><div style="font-size:11px;color:${tc.sub};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${cat.summary || `共 ${cat.items.length} 项重口实况`}</div>`;
                b.onclick = (e) => { e.stopPropagation(); activeCat = idx; renderBody(); };
                grid.appendChild(b);
            });
            body.appendChild(grid);
        } else {
            const cat = d.categories[activeCat], list = document.createElement("div");
            list.style.cssText = "display:flex;flex-direction:column;gap:9px;";
            cat.items.forEach((it, idx) => {
                const b = document.createElement("div");
                b.style.cssText = `background:${tc.card};border:1px solid ${tc.border};border-radius:11px;padding:10px 12px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:4px;box-shadow:0 3px 10px rgba(0,0,0,0.4);`;
                const preview = (it.desc || "").replace(/\s+/g, " ").slice(0, 44) + ((it.desc || "").length > 44 ? "…" : "");
                b.innerHTML = `${it.keyHTML}${it.barHTML || ""}<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:4px;padding-top:5px;border-top:1px dashed rgba(255,255,255,0.08);"><span style="font-size:11.5px;color:${tc.sub};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${preview}</span><span style="color:${tc.prim};font-size:11px;font-weight:bold;white-space:nowrap;flex-shrink:0;">详情 ▸</span></div>`;
                b.onclick = (e) => { e.stopPropagation(); showDetailPopup(idx); };
                list.appendChild(b);
            });
            body.appendChild(list);
        }
    }

    function mountUI() {
        loadSettings();
        document.getElementById("st-v5-root")?.remove();
        const root = document.createElement("div");
        root.id = "st-v5-root";
        root.style.cssText = "position:fixed;top:65px;right:20px;z-index:2147483647;font-family:'Microsoft YaHei',sans-serif;";
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
                    <button id="st-v5-refresh-btn" type="button" title="直接调用角色卡主API强制重算本层全部数值、独白与档案" style="background:rgba(166,227,161,0.22);color:#a6e3a1;border:1px solid rgba(166,227,161,0.55);border-radius:8px;padding:2px 8px;cursor:pointer;font-size:11.5px;font-weight:bold;">🔄 主API强刷</button>
                    <button id="st-v5-cfg-btn" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.25);border-radius:8px;padding:2px 8px;cursor:pointer;font-size:11.5px;font-weight:bold;">⚙️ 设置</button>
                    <span id="st-v5-close" style="cursor:pointer;color:#f38ba8;font-size:16px;font-weight:bold;padding:0 4px;">✕</span>
                </div>
            </div>
            <div id="st-v5-tabs" style="display:flex;gap:5px;overflow-x:auto;padding:8px 12px;background:rgba(0,0,0,0.35);border-bottom:1px solid rgba(255,255,255,0.07);scrollbar-width:none;flex-shrink:0;"></div>
            <div id="st-v5-body" style="padding:12px 14px;overflow-y:auto;flex:1;"></div>
            <div id="st-v12-resize-r" style="position:absolute;top:40px;right:0;width:7px;bottom:18px;cursor:ew-resize;z-index:40;"></div>
            <div id="st-v12-resize-b" style="position:absolute;left:0;right:18px;bottom:0;height:7px;cursor:ns-resize;z-index:40;"></div>
            <div id="st-v12-resize-rb" style="position:absolute;right:0;bottom:0;width:20px;height:20px;cursor:nwse-resize;z-index:45;display:flex;align-items:flex-end;justify-content:flex-end;padding:3px;color:#f38ba8;font-size:11px;user-select:none;">◢</div>
            <div id="st-v6-detail-modal" style="display:none;position:absolute;inset:0;background:rgba(10,8,16,0.95);z-index:50;flex-direction:column;justify-content:center;padding:16px;">
                <div style="background:linear-gradient(160deg,#251d38,#1b152a);border:1.5px solid #f38ba8;border-radius:14px;padding:15px;max-height:92%;display:flex;flex-direction:column;gap:10px;box-shadow:0 12px 36px rgba(0,0,0,0.85);">
                    <div id="st-v6-det-title"></div>
                    <div id="st-v6-det-bar"></div>
                    <div id="st-v6-det-desc" style="color:#ede6f2;font-size:13.5px;line-height:1.7;overflow-y:auto;white-space:pre-wrap;word-break:break-word;padding:8px 0;border-top:1px solid rgba(243,139,168,0.22);border-bottom:1px solid rgba(243,139,168,0.22);"></div>
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

        const panel = document.getElementById("st-v5-panel"), toggleBtn = document.getElementById("st-v5-toggle"), headerBar = document.getElementById("st-v5-header");

        function bindDirectDrag(handleEl, onClickCallback) {
            let isDown = false, moved = false, sx = 0, sy = 0, ir = 20, it = 65;
            handleEl.addEventListener("pointerdown", (e) => {
                if (e.target.closest("#st-v5-close") || e.target.closest("#st-v5-cfg-btn") || e.target.closest("#st-v5-refresh-btn")) return;
                isDown = true; moved = false; sx = e.clientX; sy = e.clientY;
                const rect = root.getBoundingClientRect();
                ir = window.innerWidth - rect.right; it = rect.top;
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
        bindResizeHandle(document.getElementById("st-v12-resize-r"), "r"); bindResizeHandle(document.getElementById("st-v12-resize-b"), "b"); bindResizeHandle(document.getElementById("st-v12-resize-rb"), "rb");

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

    function extractText(txt, fid) {
        if (!txt || (!txt.includes("状态栏") && !txt.includes("[[角色档案]]") && !txt.includes("[[核心数值]]"))) return null;
        const nm = txt.match(/(?:【|\[)\s*状态栏\s*[｜|:：]\s*([^】\]\n]+?)\s*(?:】|\])/);
        const cName = nm ? nm[1].trim() : (safeCtx()?.name1 || "伊一");

        let bodyTxt = txt;
        const startMatch = txt.match(/(?:【|\[)\s*状态栏[^\n]*(?:】|\])|\[\[\s*角色档案\s*\]\]/);
        if (startMatch) {
            const startIdx = startMatch.index + (startMatch[0].includes("角色档案") ? 0 : startMatch[0].length);
            const rest = txt.slice(startIdx);
            const endMatch = rest.match(/(?:【|\[)\s*\/\s*状态栏\s*(?:】|\])|<UpdateVariable>|_\.set\(|<\/game>|<\/content>/i);
            bodyTxt = endMatch ? rest.slice(0, endMatch.index) : rest;
        }

        const cats = [];
        let cur = null, lastItem = null;
        bodyTxt.split("\n").forEach(r => {
            const l = r.trim().replace(/^(?:<[^>]+>|\*\*)+|(?:\*\*|<[^>]+>)+$/g, "").trim();
            if (!l) return;

            const inlineCat = l.match(/^(?:[#*\-\s]*)\[\[\s*(.+?)\s*\]\]\s*(?:->|→|-＞|＞)\s*(.+)$/);
            if (inlineCat) {
                let title = inlineCat[1].trim();
                if (title.includes("服装") || title.includes("着装")) title = "服装与道具";
                cur = { title, icon: ICONS[title] || "📁", items: [] };
                cats.push(cur);
                const rhs = inlineCat[2].trim(), parts = rhs.split(/\s*[|｜]\s*/);
                if (parts.length >= 2 && !rhs.includes(":")) {
                    const rawKey = parts[0].replace(/\*\*/g, "").trim(), desc = parts.slice(1).join(" ｜ ").trim();
                    lastItem = { rawKey, desc, ...fmtKey(rawKey) }; cur.items.push(lastItem);
                } else {
                    parts.forEach(p => { const kv = p.trim(); if (kv) { lastItem = { rawKey: kv, desc: kv, ...fmtKey(kv) }; cur.items.push(lastItem); } });
                }
                return;
            }

            const sm = l.match(/^(?:[#*\-\s]*)\[\[\s*(.+?)\s*\]\](?:[*]*)$/);
            if (sm) {
                let title = sm[1].trim();
                if (title.includes("服装") || title.includes("着装")) title = "服装与道具";
                cur = { title, icon: ICONS[title] || "📁", items: [] };
                cats.push(cur); lastItem = null; return;
            }

            const im = l.match(/^(?:->|→|-＞|＞|[-•·])\s*([^|｜]+?)\s*[|｜]\s*(.+)$/);
            if (im && cur) {
                const rawKey = im[1].replace(/\*\*/g, "").trim(), desc = im[2].trim();
                lastItem = { rawKey, desc, ...fmtKey(rawKey) }; cur.items.push(lastItem);
            } else if (lastItem && !l.startsWith("【") && !l.startsWith("_.set") && !l.startsWith("<")) {
                lastItem.desc += "\n" + l;
            }
        });

        if (cats.length) {
            cats.forEach(c => {
                c.items.forEach(it => {
                    const k = it.rawKey + " " + (it.desc || "");
                    const matchNum = (kw) => { const m = k.match(new RegExp(kw + "[^\\d\\n]{0,8}(\\d+)", "i")); return m ? parseInt(m[1], 10) : null; };
                    const vCock = matchNum("肉棒好感"); if (vCock !== null) curVars.核心数值.对肉棒好感度 = vCock;
                    const vLust = matchNum("性欲程度"); if (vLust !== null) curVars.核心数值.性欲程度 = vLust;
                    const vCorr = matchNum("(?:淫乱|恶堕)"); if (vCorr !== null) curVars.核心数值.淫乱恶堕 = vCorr;
                    const vShame = matchNum("羞耻度"); if (vShame !== null) curVars.精神与心理.羞耻度 = vShame;
                    const vObey = matchNum("服从度"); if (vObey !== null) curVars.精神与心理.服从度 = vObey;
                    const vFall = matchNum("沦陷度"); if (vFall !== null) curVars.精神与心理.沦陷度 = vFall;
                    const vPleas = matchNum("快感累积"); if (vPleas !== null) curVars.精神与心理.快感累积 = vPleas;
                    const vAwake = matchNum("清醒度"); if (vAwake !== null) curVars.精神与心理.意识清醒度 = vAwake;
                    const vBrk = matchNum("崩解度"); if (vBrk !== null) curVars.精神与心理.人格崩解度 = vBrk;
                    const vSta = matchNum("体力"); if (vSta !== null) curVars.身体.体力 = vSta;

                    if (c.title === "角色档案" && it.desc && it.desc.length > 15) {
                        if (it.rawKey.includes("姓名") || it.rawKey.includes("身份") || c.items.indexOf(it) === 0) curVars.档案.身份与背景 = it.desc;
                        else if (it.rawKey.includes("介绍") || it.rawKey.includes("自白")) curVars.档案.自我介绍 = it.desc;
                        else if (it.rawKey.includes("罩杯") || it.rawKey.includes("三维")) curVars.档案.罩杯与三维 = it.desc;
                        else if (it.rawKey.includes("风评") || it.rawKey.includes("觊觎")) curVars.档案.社会风评 = it.desc;
                    }
                    if (c.title === "特殊状态" && it.desc && it.desc.length > 10) {
                        if (it.rawKey.includes("内心") || it.rawKey.includes("独白") || it.rawKey.includes("想法")) curVars.实况.内心独白 = it.desc;
                        else if (it.rawKey.includes("姿势") || it.rawKey.includes("定格")) curVars.实况.当前姿势 = it.desc;
                    }
                    if (c.title === "服装与道具" && it.desc && it.desc.length > 8 && !curVars.实况.当前衣装) {
                        if (it.rawKey.includes("衣装") || it.rawKey.includes("穿戴")) curVars.实况.当前衣装 = it.desc;
                    }
                    if (c.title === "身体情况" && it.desc && it.desc.length > 10) {
                        if (it.rawKey.includes("面容") || it.rawKey.includes("表情")) curVars.实况.面容表情 = it.desc;
                        else if (it.rawKey.includes("胸膛") || it.rawKey.includes("奶子")) curVars.实况.胸部实况 = it.desc;
                        else if (it.rawKey.includes("玉足") || it.rawKey.includes("腿")) curVars.实况.玉足实况 = it.desc;
                    }
                    if (c.title === "性器官" && it.desc && it.desc.length > 10) {
                        if (it.rawKey.includes("骚逼") || it.rawKey.includes("前穴")) curVars.实况.小穴实况 = it.desc;
                        else if (it.rawKey.includes("子宫") || it.rawKey.includes("苗床")) curVars.实况.子宫实况 = it.desc;
                        else if (it.rawKey.includes("屁眼") || it.rawKey.includes("后庭")) curVars.实况.屁眼实况 = it.desc;
                    }

                    const mOral = k.match(/口\s*[：:]?\s*(\d+)/); if (mOral) curVars.计数.性交.口 = parseInt(mOral[1], 10);
                    const mVag = k.match(/小穴\s*[：:]?\s*(\d+)/); if (mVag) curVars.计数.性交.小穴 = parseInt(mVag[1], 10);
                    const mAnal = k.match(/屁眼\s*[：:]?\s*(\d+)/); if (mAnal) curVars.计数.性交.屁眼 = parseInt(mAnal[1], 10);
                    const mOrg = k.match(/高潮(?:总数)?\s*[：:]?\s*(\d+)/); if (mOrg) curVars.计数.高潮.总数 = parseInt(mOrg[1], 10);
                    const mIn = k.match(/内射\s*[：:]?\s*(\d+)/); if (mIn) { curVars.计数.射精.内射 = parseInt(mIn[1], 10); if (!curVars.体内精液存量.子宫毫升 && curVars.计数.射精.内射 > 0) curVars.体内精液存量.子宫毫升 = 15; }
                    const mSw = k.match(/吞精\s*[：:]?\s*(\d+)/); if (mSw) curVars.计数.精液摄入.吞精次数 = parseInt(mSw[1], 10);
                    const mHk = k.match(/接客卖身\s*[：:]?\s*(\d+)/); if (mHk) curVars.计数.交易.接客卖身 = parseInt(mHk[1], 10);
                });
            });
        }
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

                const leaf = ps[ps.length - 1] || "";
                if (leaf.includes("独白") || leaf.includes("内心想法")) { targetVars.实况.内心独白 = String(val); continue; }
                if (leaf.includes("姿势") || leaf.includes("动作")) { targetVars.实况.当前姿势 = String(val); continue; }
                if (leaf.includes("穿戴中的标记物") || leaf.includes("当前衣装") || leaf.includes("服装")) {
                    targetVars.实况.当前衣装 = String(val); targetVars.体内道具与权限.穿戴中的标记物 = String(val); continue;
                }
                if (leaf.includes("身份") || leaf.includes("背景")) { targetVars.档案.身份与背景 = String(val); continue; }
                if (leaf.includes("自我介绍")) { targetVars.档案.自我介绍 = String(val); continue; }

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
                map.delete(fbCat.title);
                if (fbCat.title === "计数记录" && exCat.items.length < fbCat.items.length) return fbCat;
                const enriched = exCat.items.map((it, idx) => {
                    const fbItem = fbCat.items[idx];
                    let finalDesc = it.desc || "";
                    if (fbItem && finalDesc.length < 80 && !finalDesc.includes(fbItem.desc.slice(0, 15))) {
                        finalDesc = finalDesc ? `${finalDesc}\n\n${fbItem.desc}` : fbItem.desc;
                    }
                    return { ...it, desc: finalDesc, ...fmtKey(it.rawKey) };
                });
                fbCat.items.forEach(fbIt => {
                    const kw = fbIt.rawKey.replace(/^[^\u4e00-\u9fa5]+/, "").slice(0, 2);
                    if (kw && !enriched.some(x => x.rawKey.includes(kw))) enriched.push(fbIt);
                });
                return { ...exCat, summary: fbCat.summary, items: enriched };
            }
            return fbCat;
        });
        for (const restCat of map.values()) if (restCat.items.length > 0) mergedCats.push(restCat);
        return { charName: extracted.charName || fallback.charName, floorId: extracted.floorId, categories: mergedCats };
    }

    function cleanDOM(id, force = false) {
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
        if ((h.includes("【状态栏") || h.includes("[[角色档案]]") || rawMes.includes("【状态栏")) && !h.includes("st-ext-inline-trigger")) {
            h = h.replace(/<details[^>]*>\s*<summary>[^<]*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】/gi, m => `<div style="display:none!important">${m}</div>`)
                 .replace(/(?:<p>\s*)?【\s*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】(?:\s*<\/p>)?/gi, m => `<div style="display:none!important">${m}</div>`)
                 .replace(/【\s*状态栏[\s\S]*$/gi, m => `<div style="display:none!important">${m}</div>`);
            h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 查看此层 (#${id}) 状态栏</div>`;
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
            const ctx = safeCtx(), fv = getInitialVars();
            curVars = fv;
            const chat = ctx?.chat || [];
            let last = null, latestChatText = "";
            for (let i = 0; i < chat.length; i++) {
                const t = chat[i]?.mes || "";
                if (t.includes("_.set(")) applySetStatements(t, fv);
            }
            const scanStart = forceAll ? 0 : Math.max(0, chat.length - 25);
            for (let i = scanStart; i < chat.length; i++) {
                const t = chat[i]?.mes || "";
                if (t) latestChatText = t;
                const ex = extractText(t, i);
                if (ex) last = ex;
            }
            const fallback = getFallbackData(latestChatText);
            if (!last && chat.length > 0) {
                fallback.charName = ctx?.name2 || ctx?.name1 || "主角";
                fallback.floorId = chat.length - 1;
            }
            latestStatus = mergeStatusWithVars(last, fallback);

            const u = ctx?.name1 || "伊一";
            if (typeof setExtensionPrompt === "function") {
                setExtensionPrompt(EXT_ID, buildFullSystemPrompt(u, fv), extension_prompt_types?.IN_CHAT ?? 1, 0);
            }
            renderBody();
        } catch (e) {
            console.error("[my-status-bar] recalc error:", e);
            renderBody();
        }
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
        eventSource.on(event_types.CHAT_CHANGED, () => {
            activeCat = null; latestStatus = null;
            setTimeout(() => { recalc(false); cleanAll(false); }, 220);
        });
        eventSource.on(event_types.MESSAGE_RECEIVED, i => setTimeout(() => {
            recalc(false); cleanDOM(i, true);
            showToast("📊 状态栏已同步最新楼层正文与独白！", "info", 2200);
            if (userSettings.apiSyncEnabled) triggerExternalApiUpdate(i);
        }, 150));
        eventSource.on(event_types.MESSAGE_UPDATED, i => setTimeout(() => { recalc(false); cleanDOM(i, true); }, 120));
        eventSource.on(event_types.MESSAGE_DELETED, () => setTimeout(() => { recalc(false); scheduleCleanAll(); }, 150));
        eventSource.on(event_types.GENERATION_STARTED, () => recalc(false));
    }

    const chatEl = document.getElementById("chat");
    if (chatEl) {
        const obs = new MutationObserver(() => {
            if (!isCleaningDOM) scheduleCleanAll();
        });
        obs.observe(chatEl, { childList: true, subtree: false });
    }

    setTimeout(() => { recalc(false); cleanAll(false); }, 350);
})();

            
