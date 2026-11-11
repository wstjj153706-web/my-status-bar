
// == 状态栏与楼层变量引擎 V13 (防卡死优化 + 兼容无引号_.set + 智能API修复与模型拉取 + 强制刷新楼层版) ==
(async function () {
    const EXT_ID = "my-status-bar";

    // 安全导入酒馆核心模块（带多重兜底，绝不报错中断）
    let extMod = {}, scriptMod = {};
    try { extMod = await import("/scripts/extensions.js"); } catch (e) {}
    try { scriptMod = await import("/script.js"); } catch (e) {}
    const { eventSource, event_types, setExtensionPrompt, extension_prompt_types } = scriptMod;

    function safeCtx() {
        try {
            if (typeof window.SillyTavern?.getContext === "function") return window.SillyTavern.getContext() || {};
            if (typeof extMod.getContext === "function") return extMod.getContext() || {};
        } catch (e) {}
        return {};
    }

    // 5 套可切换主题样式
    const THEMES = {
        "魅魔粉 (默认)": { bg: "linear-gradient(165deg,#181424,#1e192b)", border: "#f38ba8", prim: "#f38ba8", sec: "#cba6f7", text: "#ede6f2", sub: "#a6adc8", card: "linear-gradient(160deg,#1c162b,#141020)", hi: "rgba(243,139,168,0.25)" },
        "暗黑血浆 (重口)": { bg: "linear-gradient(165deg,#1c070b,#100305)", border: "#ff4d6d", prim: "#ff4d6d", sec: "#ff8fa3", text: "#ffe5ec", sub: "#c98a96", card: "linear-gradient(160deg,#290a10,#170408)", hi: "rgba(255,77,109,0.28)" },
        "白浊深渊 (催眠)": { bg: "linear-gradient(165deg,#161b24,#0f131a)", border: "#89b4fa", prim: "#89b4fa", sec: "#b4befe", text: "#eef4ff", sub: "#94a3b8", card: "linear-gradient(160deg,#1e2533,#131822)", hi: "rgba(137,180,250,0.25)" },
        "赛博霓虹 (调教)": { bg: "linear-gradient(165deg,#0b1528,#070b16)", border: "#00f5d4", prim: "#00f5d4", sec: "#f15bb5", text: "#e0fbfc", sub: "#8ecae6", card: "linear-gradient(160deg,#10213d,#091326)", hi: "rgba(0,245,212,0.22)" },
        "鎏金娼馆 (风月)": { bg: "linear-gradient(165deg,#211814,#140e0b)", border: "#f9e2af", prim: "#f9e2af", sec: "#fab387", text: "#fdf6e2", sub: "#bfa888", card: "linear-gradient(160deg,#2c201a,#1a120e)", hi: "rgba(249,226,175,0.22)" }
    };

    let userSettings = {
        theme: "魅魔粉 (默认)",
        width: 470,
        height: 620,
        fontScale: 100,
        apiSyncEnabled: false,
        apiUrl: "https://api.openai.com/v1/chat/completions",
        apiKey: "",
        apiModel: "gpt-4o-mini",
        modelList: []
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

    // 智能规范化 API 地址（自动处理末尾斜杠、/v1、/chat/completions 与 /models 转换）
    function getNormalizedEndpoints(rawUrl) {
        let u = (rawUrl || "").trim().replace(/\/+$/, "");
        if (!u) return { chatUrl: "", modelsUrl: "" };
        let base = u
            .replace(/\/chat\/completions$/i, "")
            .replace(/\/models$/i, "")
            .replace(/\/+$/, "");
        if (!/\/v\d+(?:beta)?$/i.test(base) && !base.includes("/v1")) {
            base = base + "/v1";
        }
        return {
            chatUrl: u.toLowerCase().endsWith("/chat/completions") ? u : `${base}/chat/completions`,
            modelsUrl: `${base}/models`
        };
    }

    function getInitialVars() {
        return {
            核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
            精神与心理: { 羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0, 意识清醒度: 100, 人格崩解度: 0 },
            身体: { 体力: 100 },
            性癖: {
                条目: [
                    "见之欲呕-天生冷感，从未与男人亲近-第一阶段-0/100",
                    "清心寡欲-从小被管得严，没动过心思-第一阶段-0/100",
                    "初守清白-未经人事，连自己都不敢碰-第一阶段-0/100",
                    "羞极即泄-天生脸皮薄，从没在人前失过态-第一阶段-100/100",
                    "抗命顶撞-性子犟，从小不肯低头-第一阶段-0/100",
                    "心如止水-心是关着的，谁也没进来过-第一阶段-0/100",
                    "自我完整-心智清醒，知道自己是谁-第一阶段-0/100"
                ]
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
                    if (v.length === 0) out += `${pad}${k}: []\n`;
                    else {
                        out += `${pad}${k}:\n`;
                        for (const item of v) out += `${pad}  - ${item}\n`;
                    }
                } else if (v !== null && typeof v === "object") {
                    out += `${pad}${k}:\n` + serialize(v, indent + 2);
                } else {
                    out += `${pad}${k}: ${v}\n`;
                }
            }
            return out;
        }
        return `${userName}:\n` + serialize(varsObj, 2);
    }

    function buildFullSystemPrompt(userName, currentVars) {
        const currentYaml = varsToYaml(userName, currentVars);
        const isVirginTemplate = (currentVars?.性癖?.条目 || []).some(s => s.includes("初守清白") || s.includes("见之欲呕"));
        const autoInitRule = isVirginTemplate ? `
【⚠️ 最高优先级：旧卡/未初始化角色自动校准与重估指令！】
检测到上方注入的变量库目前仍处于默认的初始模板！请阅读当前对话上下文与主角（${userName}）的人设及当前剧情：
- 若当前是中途接入的旧卡，或者主角在设定中不是清白处女（如妓女、暗娼、花魁、性奴、熟女或已有剧情互动等），你绝不许照抄0值模板！
- 必须在本回合立即根据她的过往经历与最新剧情全量重估：核心数值、精神与心理、历史累计计数（接客卖身、小穴、口交、内射、吞精等）与性癖.条目，并在状态栏与末尾 <UpdateVariable> 中用 _.set('${userName}.路径', 新值); 一次性完整覆盖写回！` : "";

        return `
【当前变量库实时注入值】
${currentYaml}
${autoInitRule}

【状态栏与变量更新强制规范】
1. 每条回复末尾按顺序输出：正文 -> 【状态栏｜${userName}】...【/状态栏】 -> <UpdateVariable>块</UpdateVariable>。
2. 状态栏包含：[[角色档案]]、[[总性癖]]、[[核心数值]]、[[精神与心理]]、[[身体情况]]、[[服装与道具]]、[[性器官]]、[[排泄与体液]]、[[特殊状态]]、[[计数记录]]，每条格式为 -> 标题 | 极度色情重口详尽描写（严禁在描述内使用竖线 |）。
3. 严禁在 <UpdateVariable> 标签外输出任何 _.set 语句！`;
    }

    function fmtKey(rk) {
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        let pct = null;
        const m = rk.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+(?:\.\d+)?)/);
        if (m) {
            const cur = parseFloat(m[1]), max = parseFloat(m[2]);
            if (max > 0) pct = Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
        } else {
            const stageMap = { "第一阶段": 20, "第二阶段": 40, "第三阶段": 60, "第四阶段": 80, "第五阶段": 100 };
            for (const [k, v] of Object.entries(stageMap)) {
                if (rk.includes(k)) { pct = v; break; }
            }
        }

        const badges = [];
        let cleanTitle = rk;

        cleanTitle = cleanTitle.replace(/「([^」]{1,40})」/g, (_, s) => {
            badges.push(`<span style="background:${tc.hi};border:1px solid ${tc.sec};color:${tc.text};padding:1px 7px;border-radius:6px;font-size:11px;font-weight:bold;">${s}</span>`);
            return "";
        });
        cleanTitle = cleanTitle.replace(/[（(]([^）)]{1,45}?(?:阶段|\d+\s*[\/／]\s*\d+)[^）)]{0,25}?)[）)]/g, (_, s) => {
            badges.push(`<span style="background:rgba(255,255,255,0.1);border:1px solid ${tc.prim};color:${tc.prim};padding:1px 7px;border-radius:6px;font-size:11px;">${s}</span>`);
            return "";
        });
        cleanTitle = cleanTitle.replace(/[（(](\+\d+[^）)]{0,15})[）)]/g, (_, s) => {
            badges.push(`<span style="background:rgba(243,139,168,0.28);border:1px solid #f38ba8;color:#ffb3c6;padding:1px 6px;border-radius:5px;font-size:11px;font-weight:bold;">${s}</span>`);
            return "";
        });
        cleanTitle = cleanTitle.replace(/[（(](-\d+[^）)]{0,15})[）)]/g, (_, s) => {
            badges.push(`<span style="background:rgba(137,180,250,0.25);border:1px solid #89b4fa;color:#b4d0ff;padding:1px 6px;border-radius:5px;font-size:11px;font-weight:bold;">${s}</span>`);
            return "";
        });
        cleanTitle = cleanTitle.replace(/↑\s*解锁/g, () => {
            badges.push(`<span style="background:linear-gradient(90deg,#f38ba8,#fab387);color:#11111b;padding:1px 6px;border-radius:5px;font-size:11px;font-weight:900;">↑解锁</span>`);
            return "";
        });
        cleanTitle = cleanTitle.replace(/[：:]\s*(\d+(?:\.\d+)?\s*[\/／]\s*\d+[a-zA-Z\u4e00-\u9fa5]*)\s*$/, (_, numStr) => {
            badges.unshift(`<span style="background:rgba(249,226,175,0.16);border:1px solid rgba(249,226,175,0.45);color:#f9e2af;padding:1px 7px;border-radius:6px;font-size:11.5px;font-family:Consolas,monospace;font-weight:bold;">${numStr}</span>`);
            return "";
        });

        cleanTitle = cleanTitle.replace(/[：:]\s*$/, "").trim();

        const keyHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;width:100%;">
                <span style="color:#f9e2af;font-weight:bold;font-size:13.5px;line-height:1.4;word-break:break-word;">${cleanTitle}</span>
                ${badges.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-end;flex-shrink:0;max-width:58%;">${badges.join("")}</div>` : ""}
            </div>`;

        const barHTML = pct !== null ? `
            <div style="display:flex;align-items:center;gap:8px;margin-top:6px;width:100%;">
                <div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;">
                    <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${tc.prim},${tc.sec});border-radius:99px;box-shadow:0 0 8px ${tc.prim};"></div>
                </div>
                <span style="font-size:10.5px;color:${tc.prim};font-family:Consolas,monospace;min-width:30px;text-align:right;">${pct}%</span>
            </div>` : "";

        return { keyHTML, barHTML, cleanTitle, pct };
    }

    function tier5(val, reverse = false) {
        const n = Math.max(0, Math.min(100, Number(val) || 0));
        const v = reverse ? (100 - n) : n;
        if (v < 20) return 0;
        if (v < 40) return 1;
        if (v < 60) return 2;
        if (v < 80) return 3;
        return 4;
    }

    function getDynamicMetricDetail(type, v, u) {
        const c = v.计数 || {};
        const cockLove = Number(v.核心数值?.对肉棒好感度) || 0;
        const lust = Number(v.核心数值?.性欲程度) || 0;
        const corr = Number(v.核心数值?.淫乱恶堕) || 0;
        const shame = Number(v.精神与心理?.羞耻度 ?? 100);
        const obey = Number(v.精神与心理?.服从度) || 0;
        const fall = Number(v.精神与心理?.沦陷度) || 0;
        const pleas = Number(v.精神与心理?.快感累积) || 0;
        const awake = Number(v.精神与心理?.意识清醒度 ?? 100);
        const brk = Number(v.精神与心理?.人格崩解度) || 0;
        const sta = Number(v.身体?.体力 ?? 100);
        const vagCnt = Number(c.性交?.小穴) || 0, mouthCnt = Number(c.性交?.口) || 0;
        const creampie = Number(c.射精?.内射) || 0, swallowMl = Number(c.精液摄入?.累计毫升) || 0, hookerCnt = Number(c.交易?.接客卖身) || 0;

        switch (type) {
            case "cockLove": {
                const t = tier5(cockLove);
                const stages = ["厌恶排斥", "工具麻木•食髓知味", "含泪渴求•穴肉吸附", "痴迷崇拜•主动跪舔", "肉棒至上•终极母畜"];
                const descs = [
                    `【当前数值：${cockLove}/100 · 第一阶段「${stages[0]}」】\n${u}对男人的肉棒仍怀有强烈的戒备与生理不适，看到青筋暴起的粗大龟头靠近时会本能绷紧身体躲避。但当滚烫坚硬的柱身强行顶开肉壁时，神经却会在屈辱中传来阵阵不受控的战栗。`,
                    `【当前数值：${cockLove}/100 · 第二阶段「${stages[1]}」】\n在经历过${vagCnt + mouthCnt}次贯穿与摩擦后，虽然理智上仍把肉棒视为换取金钱生存的工具，但她的身体已被调教得彻底适应了粗硬形状。只要闻到浓郁的雄性麝香与精腥味，口腔便会分泌唾液，下身骚逼更是自动湿润泥泞。`,
                    `【当前数值：${cockLove}/100 · 第三阶段「${stages[2]}」】\n理智防线已被雄性肉棒彻底撞碎！${u}对粗长滚烫的阳具产生了如毒瘾般的生理渴望，目光总是不由自主黏在男人的胯下。只要被龟头抵住唇瓣或穴口，双腿就会软绵绵自动分开，喉咙与骚穴同时饥渴收缩吸吮。`,
                    `【当前数值：${cockLove}/100 · 第四阶段「${stages[3]}」】\n彻头彻尾的肉棒狂热母狗！在累计承受${vagCnt}次小穴抽插与${swallowMl}ml精液浇灌后，${u}已把服侍肉棒视作人生最高乐趣。一见到勃起的巨物就会双膝发软跪倒在地，主动伸出湿滑香舌从囊袋一路舔舐到马眼，眼眶含着淫泪摇晃肥臀哀求抽插。`,
                    `【当前数值：${cockLove}/100 · 第五阶段「${stages[4]}」】\n满值沦陷的终极肉棒奴隶！${u}的大脑已被肉棒彻底支配，哪怕只是闻到一丝包皮垢与精液的浓烈腥臭，都会瞳孔涣散、吐舌流涎，全身三处肉孔（骚口、骚逼、屁眼）同时疯狂痉挛吸吮。`
                ];
                return { val: cockLove, stage: stages[t], desc: descs[t] };
            }
            case "lust": {
                const t = tier5(lust);
                const stages = ["清心寡欲", "余韵温吞•春情暗涌", "欲火焚身•淫水拉丝", "重度发情•夹腿索操", "永动机式潮吹母畜"];
                const descs = [
                    `【当前数值：${lust}/100 · 第一阶段「${stages[0]}」】\n身体尚处于较为平静的状态，情欲未被完全挑起，仅有轻微的体温波动与呼吸起伏。`,
                    `【当前数值：${lust}/100 · 第二阶段「${stages[1]}」】\n小腹深处升起一股温吞的燥热酸胀，乳尖在衣料摩擦下充血挺立，大腿根部被分泌出的爱液沾湿，穴肉一阵阵空虚地微缩。`,
                    `【当前数值：${lust}/100 · 第三阶段「${stages[2]}」】\n浓郁的情欲之火烧遍全身！${u}的脸颊泛着淫靡潮红，呼吸粗重滚烫，下身骚逼早已淫水泛滥，迫切渴望粗硬异物的插入止痒。`,
                    `【当前数值：${lust}/100 · 第四阶段「${stages[3]}」】\n重度发情状态！全身每一寸皮肤都敏感得一碰即颤，肥大充血的阴蒂暴突在外剧烈跳动，嘴里漏出甜腻下流的哼唧声。`,
                    `【当前数值：${lust}/100 · 第五阶段「${stages[4]}」】\n极度过载的狂暴发情期！${u}脑子里除了交配与被内射外再无半点杂念，红肿外翻的骚穴24小时不停地向外喷涌黏腻淫水，子宫口一开一合向下脱垂索精！`
                ];
                return { val: lust, stage: stages[t], desc: descs[t] };
            }
            case "corr": {
                const t = tier5(corr);
                const stages = ["初守贞洁", "半推半就", "风尘浸染•放荡沉沦", "下贱娼妇•肉器自觉", "脑髓熔断公用肉便器"];
                const descs = [
                    `【当前数值：${corr}/100 · 第一阶段「${stages[0]}」】\n心底仍残存着对清白与自尊的执念，面对露骨的玩弄会感到屈辱难堪。`,
                    `【当前数值：${corr}/100 · 第二阶段「${stages[1]}」】\n身体在与男人的交欢中逐渐食髓知味，道德感开始松动，学会用破罐破摔的心态适应肉体交易。`,
                    `【当前数值：${corr}/100 · 第三阶段「${stages[2]}」】\n在累计接客${hookerCnt}次、被内射${creampie}次后，她已彻底习惯了被陌生男人随意玩弄内射，举手投足间尽是熟练暗娼的麻木与放浪。`,
                    `【当前数值：${corr}/100 · 第四阶段「${stages[3]}」】\n身心彻底恶堕的极品淫乱娼妇！她以自己的身体能成为男人们发泄兽欲的肉套子为荣，主动张开双腿展示被操得红肿外翻的骚逼。`,
                    `【当前数值：${corr}/100 · 第五阶段「${stages[4]}」】\n终极极限恶堕！${u}的人类尊严与矜持已100%灰飞烟灭，彻底退化为一具只为承接雄性精液而活的公用排泄肉便器！`
                ];
                return { val: corr, stage: stages[t], desc: descs[t] };
            }
            case "shame": {
                const t = tier5(shame, true);
                const stages = ["羞极即泄", "薄面微红", "习以为常•半掩半露", "不知廉耻•敞腿任看", "羞耻全灭•公开母畜"];
                const descs = [
                    `【当前数值：${shame}/100 · 第一阶段「${stages[0]}」】\n羞耻心尚高，私密部位被注视或触碰时会耳根通红、浑身紧绷。`,
                    `【当前数值：${shame}/100 · 第二阶段「${stages[1]}」】\n在多次肉体交欢后羞耻防线出现裂痕，虽仍会脸红心跳，但已不会拼死遮挡。`,
                    `【当前数值：${shame}/100 · 第三阶段「${stages[2]}」】\n羞耻感已被风尘磨灭大半！哪怕光裸着下身擦拭大腿根滴落的精液也毫无心理压力。`,
                    `【当前数值：${shame}/100 · 第四阶段「${stages[3]}」】\n廉耻心几乎荡然无存！哪怕赤身裸体跪在男人面前口交吞精、或是顶着一肚子精液走动也毫不遮掩。`,
                    `【当前数值：${shame}/100 · 第五阶段「${stages[4]}」】\n羞耻心彻底归零粉碎！在众目睽睽之下被扒光操干、当众潮吹失禁也会兴奋得浑身发抖、吐舌浪叫！`
                ];
                return { val: shame, stage: stages[t], desc: descs[t] };
            }
            case "obey": {
                const t = tier5(obey);
                const stages = ["抗命顶撞", "委曲求全", "温顺听话•熟练配合", "摇尾乞怜•任打任操", "绝对盲从•肉奴母狗"];
                const descs = [
                    `【当前数值：${obey}/100 · 第一阶段「${stages[0]}」】\n心底仍保留着反抗意识，面对过分的命令会咬唇抗拒。`,
                    `【当前数值：${obey}/100 · 第二阶段「${stages[1]}」】\n在肉体快感与生存压力下学会了低头妥协，开始按照男人的吩咐摆出羞人姿势。`,
                    `【当前数值：${obey}/100 · 第三阶段「${stages[2]}」】\n面对客人的粗鄙命令习惯性顺从，懂得如何主动分开双腿、配合男人的抽插节奏。`,
                    `【当前数值：${obey}/100 · 第四阶段「${stages[3]}」】\n彻底被驯服的摇尾母狗！对男人的任何粗暴命令都奉若圣旨，主动跪爬上前用舌头舔净男人的肉棒。`,
                    `【当前数值：${obey}/100 · 第五阶段「${stages[4]}」】\n100%刻入骨髓的绝对奴性！${u}已完全放弃自主意志，条件反射般高翘肥臀全力奉承！`
                ];
                return { val: obey, stage: stages[t], desc: descs[t] };
            }
            case "fall": {
                const t = tier5(fall);
                const stages = ["心如止水", "利益维系•肉体习惯", "食髓成瘾•空虚难耐", "重度戒断•渴精成狂", "彻底沉沦•离精失活"];
                const descs = [
                    `【当前数值：${fall}/100 · 第一阶段「${stages[0]}」】\n内心保持独立，尚未对男人的侵犯产生依赖。`,
                    `【当前数值：${fall}/100 · 第二阶段「${stages[1]}」】\n肉体和子宫已经开始对被粗大肉棒填满、被滚烫精液灌饱的坠胀感产生习惯。`,
                    `【当前数值：${fall}/100 · 第三阶段「${stages[2]}」】\n身心已深深陷落！只要稍微有一段时间没被男人的肉棒插弄，就会感到坐立难安、骚穴发痒空虚。`,
                    `【当前数值：${fall}/100 · 第四阶段「${stages[3]}」】\n重度肉体与精神成瘾！一旦子宫里的精液流空就会陷入戒断恐慌。`,
                    `【当前数值：${fall}/100 · 第五阶段「${stages[4]}」】\n万劫不复的终极沉沦！甘愿永远当一只每天被射满三穴的专属性奴！`
                ];
                return { val: fall, stage: stages[t], desc: descs[t] };
            }
            case "pleas": {
                const t = tier5(pleas);
                const stages = ["断瘾空虚•酸胀麻木", "微潮酥麻", "快感攀升", "濒临绝顶", "高潮过载•阿片失禁"];
                const descs = [
                    `【当前数值：${pleas}/100 · 第一阶段「${stages[0]}」】\n余韵回落或平静期，敏感神经正处于蓄势或微酸状态。`,
                    `【当前数值：${pleas}/100 · 第二阶段「${stages[1]}」】\n酥麻的电流顺着尾椎骨窜向小腹，敏感带被挑逗得充血发烫，穴口溢出了清亮淫水。`,
                    `【当前数值：${pleas}/100 · 第三阶段「${stages[2]}」】\n密集的快感浪潮不断拍打神经！每一次摩擦与顶撞都让${u}浑身颤抖、脚趾蜷缩。`,
                    `【当前数值：${pleas}/100 · 第四阶段「${stages[3]}」】\n快感已蓄积至决堤边缘！小腹肌肉剧烈绷紧痉挛，稍微再顶弄几下就会引爆灭顶高潮。`,
                    `【当前数值：${pleas}/100 · 第五阶段「${stages[4]}」】\n灭顶绝顶高潮连续过载爆发！双眼狂翻白眼、香舌无力吐出唇外，潮吹淫水狂喷而出！`
                ];
                return { val: pleas, stage: stages[t], desc: descs[t] };
            }
            case "awake": {
                const t = tier5(awake, true);
                const stages = ["神智清醒", "微醺迷离", "意乱情迷", "神魂颠倒", "脑髓熔断•阿片痴呆"];
                const descs = [
                    `【当前数值：${awake}/100 · 状态「${stages[0]}」】\n头脑清醒，清楚感知自己目前的处境与身体每一处敏感反馈。`,
                    `【当前数值：${awake}/100 · 状态「${stages[1]}」】\n在情欲与荷尔蒙熏蒸下眼神变得湿润迷离，注意力逐渐被火热触感夺走。`,
                    `【当前数值：${awake}/100 · 状态「${stages[2]}」】\n理智防线摇摇欲坠，眼神涣散失焦，嘴里只能发出断断续续的喘息。`,
                    `【当前数值：${awake}/100 · 状态「${stages[3]}」】\n神智几乎被汹涌的快感冲垮，脑海一片空白嗡鸣，嘴角挂着晶莹口水。`,
                    `【当前数值：${awake}/100 · 状态「${stages[4]}」】\n知性完全瓦解熔断！过载的快感将大脑阿片受体彻底烧穿，翻着白眼吐舌流涎！`
                ];
                return { val: awake, stage: stages[t], desc: descs[t] };
            }
            case "brk": {
                const t = tier5(brk);
                const stages = ["自我完整", "风尘异化•认命麻木", "自甘下贱•娼妓自觉", "母畜认同•肉便器化", "人格脑死•纯粹肉器"];
                const descs = [
                    `【当前数值：${brk}/100 · 第一阶段「${stages[0]}」】\n自我认知完整，尚未被彻底扭曲三观。`,
                    `【当前数值：${brk}/100 · 第二阶段「${stages[1]}」】\n自我认知逐渐动摇，开始适应这具敏感肉体带来的异样生存处境。`,
                    `【当前数值：${brk}/100 · 第三阶段「${stages[2]}」】\n自尊心大半瓦解，发自内心地接受被粗暴玩弄与支配的定位。`,
                    `【当前数值：${brk}/100 · 第四阶段「${stages[3]}」】\n人格重度崩解扭曲！将自己完完全全视作一条靠张腿承欢为生的发情母狗。`,
                    `【当前数值：${brk}/100 · 第五阶段「${stages[4]}」】\n原有高洁人格已永久脑死湮灭，化作以充当排泄便器为唯一生存意义的终极肉器！`
                ];
                return { val: brk, stage: stages[t], desc: descs[t] };
            }
            case "sta": {
                const t = tier5(sta, true);
                const stages = ["精力充沛", "微带倦意•腰腿酸软", "香汗淋漓•双腿打颤", "濒临虚脱•瘫软无力", "彻底脱力•任操肉泥"];
                const descs = [
                    `【当前数值：${sta}/100 · 状态「${stages[0]}」】\n体力充沛，紧致丰腴的肉体随时可承受长时间的剧烈交欢或活动。`,
                    `【当前数值：${sta}/100 · 状态「${stages[1]}」】\n双腿略微酸软发颤，呼吸间带着明显的温热倦意。`,
                    `【当前数值：${sta}/100 · 状态「${stages[2]}」】\n体力消耗过半，浑身被黏腻的香汗浸透，发丝凌乱黏在潮红脸颊上。`,
                    `【当前数值：${sta}/100 · 状态「${stages[3]}」】\n体力濒临枯竭！双腿筛糠般打颤，只能软绵绵地瘫坐任由摆布。`,
                    `【当前数值：${sta}/100 · 状态「${stages[4]}」】\n全身彻底虚脱瘫软！像一滩春水般烂在地上，连抬动手指的力气都没有。`
                ];
                return { val: sta, stage: stages[t], desc: descs[t] };
            }
        }
    }

    function buildFetishRichDesc(rawItem, v, u) {
        const parts = String(rawItem).split("-");
        const name = parts[0] || "未知性癖";
        const origin = parts[1] || "长期调教与肉体开发形成";
        const stage = parts[2] || "第二阶段";
        const valStr = parts[3] || "100/100";
        const corr = Number(v.核心数值?.淫乱恶堕) || 0;
        const vagCnt = Number(v.计数?.性交?.小穴) || 0;
        const hookerCnt = Number(v.计数?.交易?.接客卖身) || 0;

        if (name.includes("见之欲呕") || name.includes("初守清白") || name.includes("清心寡欲")) {
            return `【性癖成因】：${origin}（当前进度：${stage} · ${valStr}）\n【肉体与心理实况】：${u}表面尚存未经彻底摧毁的羞怯与抗拒，但在外力刺激与敏感肉体的反噬下，这层脆弱的清白外壳正在迅速龟裂。`;
        }
        return `【性癖成因】：${origin}（当前进度：${stage} · ${valStr}）\n【深度重口发作实况】：这项性癖已深深烙印在${u}的骨髓与神经反射之中！（当前恶堕度${corr}/100，累计接客${hookerCnt}次／贯穿${vagCnt}次）。每当处于触发情境下，她的呼吸会瞬间变得粗重滚烫，下身骚逼条件反射般涌出黏腻淫水！`;
    }

    // 安全提取衣物提示（避免回溯卡死）
    function extractSafeClothHint(text) {
        if (!text) return "";
        const sliceTxt = text.slice(-1500);
        const sentences = sliceTxt.split(/[，。！？；\n\r]+/);
        const kw = /(?:裙|衫|袍|衣|T恤|肚兜|旗袍|丝袜|胸罩|裹胸|内裤|底裤|亵裤|赤裸|光裸|一丝不挂|靴|鞋|拖鞋|高跟)/;
        const matched = [];
        for (let i = sentences.length - 1; i >= 0; i--) {
            const s = sentences[i].trim();
            if (s.length > 2 && s.length < 60 && kw.test(s)) {
                matched.unshift(s);
                if (matched.length >= 3) break;
            }
        }
        return matched.join("；");
    }

    function buildFullFallbackCategories(u, c, v, latestChatText = "") {
        const mk = (rk, desc) => ({ rawKey: rk, desc, ...fmtKey(rk) });
        const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {};
        const cockM = getDynamicMetricDetail("cockLove", v, u);
        const lustM = getDynamicMetricDetail("lust", v, u);
        const corrM = getDynamicMetricDetail("corr", v, u);
        const shameM = getDynamicMetricDetail("shame", v, u);
        const obeyM = getDynamicMetricDetail("obey", v, u);
        const fallM = getDynamicMetricDetail("fall", v, u);
        const pleasM = getDynamicMetricDetail("pleas", v, u);
        const awakeM = getDynamicMetricDetail("awake", v, u);
        const brkM = getDynamicMetricDetail("brk", v, u);
        const staM = getDynamicMetricDetail("sta", v, u);

        const vagCnt = Number(cnt.性交?.小穴) || 0, mouthCnt = Number(cnt.性交?.口) || 0, analCnt = Number(cnt.性交?.屁眼) || 0;
        const creampie = Number(cnt.射精?.内射) || 0, facial = Number(cnt.射精?.颜射体外) || 0;
        const swallowCnt = Number(cnt.精液摄入?.吞精次数) || 0, swallowMl = Number(cnt.精液摄入?.累计毫升) || 0;
        const hookerCnt = Number(cnt.交易?.接客卖身) || 0, orgasmCnt = Number(cnt.高潮?.总数) || 0;
        const leakCnt = Number(cnt.失控?.失禁) || 0, squirtCnt = Number(cnt.失控?.喷潮) || 0;
        const wombMl = Number(sp.子宫毫升) || 0, mouthMl = Number(sp.口内毫升) || 0, analMl = Number(sp.屁眼毫升) || 0;
        const corr = Number(v.核心数值?.淫乱恶堕) || 0, lust = Number(v.核心数值?.性欲程度) || 0;

        const vagWidth = (2.2 + Math.min(3.2, vagCnt * 0.015)).toFixed(1);
        const vagClose = Math.max(18, Math.round(100 - vagCnt * 0.35 - (wombMl > 0 ? 15 : 0)));
        const cervixDrop = Math.min(100, Math.round(creampie * 0.45 + (wombMl > 0 ? 20 : 0)));
        const clitSize = (4.5 + Math.min(8.5, orgasmCnt * 0.06)).toFixed(1);
        const analWidth = (1.5 + Math.min(3.0, analCnt * 0.025)).toFixed(1);
        const analClose = Math.max(20, Math.round(100 - analCnt * 0.5 - (analMl > 0 ? 15 : 0)));
        const peeVal = Math.min(100, Math.round(20 + lust * 0.35 + leakCnt * 8 + squirtCnt * 5));
        const pooVal = Math.min(100, Math.round(12 + analCnt * 2 + (analMl > 0 ? 35 : 0)));
        const totalBellyMl = wombMl + mouthMl + analMl;
        const wetLevel = Math.min(100, Math.round(25 + lust * 0.7 + (wombMl > 0 ? 25 : 0)));
        const slaveScore = Math.min(100, Math.round((corr + obeyM.val + fallM.val) / 3));

        const clothHint = extractSafeClothHint(latestChatText);

        return [
            {
                title: "角色档案", icon: "👩",
                summary: `${hookerCnt > 0 ? `接客${hookerCnt}次` : "实时档案"} · 恶堕${corr}%`,
                items: [
                    mk(`👩 姓名与身份：${u}「${hookerCnt > 50 ? "熟稔暗娼" : (hookerCnt > 0 ? "风尘妓女" : "待开发尤物")}」`, `【主角姓名】：${u} ｜ 当前互动角色：${c}。\n【肉体开发履历】：累计接客卖身 ${hookerCnt} 次，小穴承受贯穿 ${vagCnt} 次，子宫无套内射 ${creampie} 次，吞咽浓精 ${swallowMl}ml。`),
                    mk(`🗣️ 称呼与定位：「自称我 • 实时追踪中」`, `【角色实况】：全身从发丝到脚趾、从六孔形变到体液排泄均处于实时追踪状态。`),
                    mk(`📏 罩杯与三维比例：34C／163cm「丰乳细腰肥臀」`, `【体态反差实况】：骨架娇小纤细，腰肢窄软易折，胸前饱满白皙，臀部圆润肥美，极具视觉冲击力。`),
                    mk(`💰 身价与风评：「${corr >= 70 ? "公用肉便器" : "清纯与靡烂交织"}」`, `【当前风评】：随着剧情推进实时演化的社会评价与身体开发估值。`)
                ]
            },
            {
                title: "核心数值", icon: "🔥",
                summary: `好感${cockM.val} · 性欲${lustM.val} · 恶堕${corrM.val}`,
                items: [
                    mk(`💗 对肉棒的好感度：${cockM.val}/100「${cockM.stage}」`, cockM.desc),
                    mk(`🔥 性欲程度：${lustM.val}/100「${lustM.stage}」`, lustM.desc),
                    mk(`🖤 淫乱与恶堕程度：${corrM.val}/100「${corrM.stage}」`, corrM.desc),
                    mk(`⛓️ 母畜奴性与肉器化：${slaveScore}/100「${slaveScore >= 60 ? "雌畜觉醒•主动献穴" : "顺从敏感•待开发"}」`, `【当前综合肉器化进度：${slaveScore}/100】\n综合恶堕度、服从度与沦陷度得出的母畜改造指标。`)
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
                    mk(`🌀 催眠与常识改写：${extPsy.催眠深度 || 0}/100「${(extPsy.催眠深度 || 0) > 0 ? "潜指令生效中" : "未催眠•自然演化"}」`, `【深层精神控制实况】：当前催眠深度 ${extPsy.催眠深度 || 0} 层 ｜ 生效指令：${extPsy.当前指令 || "无"} ｜ 用药状态：${extPsy.用药状态 || "无"}。`)
                ]
            },
            {
                title: "总性癖", icon: "🧬",
                summary: `已养成 ${(v.性癖?.条目 || []).length} 项深度性癖`,
                items: (v.性癖?.条目 || []).map(s => {
                    const p = String(s).split("-");
                    const titleStr = `🧬 性癖•${p[0] || s}（${p[2] || "第一阶段"}，${p[3] || "0/100"}）`;
                    return mk(titleStr, buildFetishRichDesc(s, v, u));
                })
            },
            {
                title: "身体情况", icon: "🧍",
                summary: `从头到脚解剖实况 · 体力${staM.val}%`,
                items: [
                    mk(`⚡ 体力与脱力：${staM.val}/100「${staM.stage}」`, staM.desc),
                    mk(`💆‍♀️ 头发与头皮：「青丝微乱•香汗浸润」`, `【部位1·头部与发丝实况】：长发因紧张或剧烈活动而略显凌乱，几缕发丝贴在白皙的颈侧与锁骨凹陷处。`),
                    mk(`🥵 面容与骚浪表情：「${corr >= 50 ? "媚眼失神•潮红流涎" : "双颊酡红•羞愤交加"}」`, `【部位2·面部与神态实况】：双颊泛着明显的潮红与薄汗，眼神在羞耻与身体敏感刺激下微微闪烁（颜射累计${facial}次）。`),
                    mk(`👄 双唇与口腔舌尖：「樱唇饱满•微喘轻颤」`, `【部位3·唇舌与咽喉实况】：柔嫩饱满的唇瓣泛着水润光泽，呼吸间带着温热的气息。`),
                    mk(`🍒 胸膛与丰满奶子：「饱满挺翘•乳尖敏感」`, `【部位4·双乳与胸廓实况】：胸前饱满的丰腴随着呼吸剧烈起伏，两颗敏感的蓓蕾在衣料摩擦下微微发硬挺立。`),
                    mk(`🤰 小腹与精液肚：${totalBellyMl}/200ml「${totalBellyMl >= 60 ? "盛精微隆蛙肚" : (totalBellyMl > 0 ? "宫腔蓄精坠胀" : "平坦紧致")}」`, `【部位5·腰腹与盛精肚实况】：小腹内部当前蓄积着合计 ${totalBellyMl}ml 精液（子宫${wombMl}ml、胃袋${mouthMl}ml、直肠${analMl}ml）。`),
                    mk(`🍑 肥臀与大腿玉足：「双腿修长•敏感战栗」`, `【部位6·下肢与足部实况】：双腿修长笔直，因身体敏感或脱力而微微发软轻颤。`)
                ]
            },
            {
                title: "性器官", icon: "🌸",
                summary: `六孔形变 · 孔径${vagWidth}cm · 闭合${vagClose}%`,
                items: [
                    mk(`👄 骚口与深喉腔：口交${mouthCnt}次／吞精${swallowMl}ml「${mouthCnt > 0 ? "唇肿含腥•深喉记忆" : "清冽纯净•未经开发"}」`, `【第一孔·口喉实况】：累计承受 ${mouthCnt} 次口交，吞咽浓精 ${swallowCnt} 次（共 ${swallowMl}ml），当前口腔残留 ${mouthMl}ml。`),
                    mk(`🍒 骚乳与乳腺孔：泌乳${cnt.泌乳?.累计毫升 || 0}ml「乳尖红嫩敏化」`, `【第二孔·胸乳实况】：双乳丰满白皙，乳尖对外界摩擦极其敏锐（累计被吸饮 ${cnt.泌乳?.被吸饮 || 0} 次）。`),
                    mk(`🫀 子宫受孕苗床：内射${creampie}次／储精${wombMl}ml「脱垂度${cervixDrop}%」`, `【第三孔·子宫与宫颈实况】：累计已被内射浇灌 ${creampie} 次，当前子宫储精 ${wombMl}ml（受孕概率 ${v.受孕与生理?.受孕概率 || 0}%）。`),
                    mk(`🌺 骚逼前穴：贯穿${vagCnt}次／闭合度${vagClose}/100「极限孔径${vagWidth}cm」`, `【第四孔·阴道物理实况】：累计承受 ${vagCnt} 次抽插贯穿与 ${orgasmCnt} 次高潮，常态闭合度 ${vagClose}%。`),
                    mk(`💧 阴蒂与尿道口：高潮${orgasmCnt}次／尺寸${clitSize}mm「敏感肉珠」`, `【第五孔·阴蒂与尿道实况】：敏感肉珠尺寸 ${clitSize}mm（累计失禁${leakCnt}次／喷潮${squirtCnt}次）。`),
                    mk(`🕳️ 屁眼后庭：开发${analCnt}次／闭合度${analClose}/100「${analCnt > 0 ? `孔径${analWidth}cm` : "粉嫩紧闭"}」`, `【第六孔·后庭实况】：累计承受后庭贯穿 ${analCnt} 次，当前肠腔储精 ${analMl}ml，常态闭合度 ${analClose}%。`)
                ]
            },
            {
                title: "排泄与体液", icon: "🚽",
                summary: `三穴储精${totalBellyMl}ml · 尿意${peeVal}% · 便意${pooVal}%`,
                items: [
                    mk(`🥛 体内精液总储量：${totalBellyMl}/200ml「宫内${wombMl}ml•口胃${mouthMl}ml•后庭${analMl}ml」`, `【三穴精液总览】：当前体内共残留 ${totalBellyMl}ml 浓精（子宫${wombMl}ml、口胃${mouthMl}ml、后庭${analMl}ml）。`),
                    mk(`💦 淫水与潮吹分泌：${wetLevel}/100「湿润度实时监测」`, `【爱液分泌实况】：当前私处湿润分泌指数 ${wetLevel}/100。`),
                    mk(`🚰 膀胱尿意与失禁：${peeVal}/100「历史失禁${leakCnt}次」`, `【膀胱控制实况】：当前尿意值 ${peeVal}/100（累计失禁 ${leakCnt} 次、潮吹 ${squirtCnt} 次）。`),
                    mk(`💩 直肠便意与排泄：${pooVal}/100「括约肌状态正常」`, `【直肠控制实况】：当前直肠便意值 ${pooVal}/100。`)
                ]
            },
            {
                title: "服装与道具", icon: "👗",
                summary: `${clothHint ? "剧情衣装同步" : "当前穿戴实况"}`,
                items: [
                    mk(`👕 当前衣装穿戴：「${clothHint ? clothHint.slice(0, 26) : "贴身衣物穿戴中"}」`, `【外装与内衬实况】：${clothHint || "根据当前剧情场景实时同步角色穿戴与衣料摩擦状态。"}`),
                    mk(`🎀 道具或配饰：「${prop.体内道具 !== "无" || prop.束缚状态 !== "无" ? "调教道具穿戴中" : "无特殊束缚道具"}」`, `【随身道具实况】：体内道具：${prop.体内道具} ｜ 束缚状态：${prop.束缚状态} ｜ 穿刺环饰：${mark.穿刺与环饰}。`)
                ]
            },
            {
                title: "特殊状态", icon: "💬",
                summary: `内心独白与当前姿态实时定格`,
                items: [
                    mk(`💬 内心想法：「${corr >= 60 ? "沉沦渴求" : "羞耻慌乱•自我意识过剩"}」`, `【第一人称内心独白】：根据当前羞耻度（${shameM.val}/100）与恶堕度（${corr}/100）实时演化的角色内心活动。`),
                    mk(`😃 当前姿势：「根据最新楼层剧情定格」`, `【当前肢体定格】：身体正随剧情互动呈现出敏锐的防备或迎合姿态。`)
                ]
            },
            {
                title: "计数记录", icon: "💎",
                summary: `接客${hookerCnt} · 小穴${vagCnt} · 内射${creampie}`,
                items: buildCountItemsFromVars(v, mk)
            }
        ];
    }

    function buildCountItemsFromVars(v, mk) {
        const items = [];
        const c = v.计数 || {}, sp = v.体内精液存量 || {};
        const joinNonZero = (obj, unit = "") => Object.entries(obj || {}).filter(([, val]) => Number(val) > 0).map(([k, val]) => `${k}${val}${unit}`).join("／");

        const sexStr = joinNonZero(c.性交, "次");
        items.push(mk(`💎 性交次数：「${sexStr || "暂无记录 (全0)"}」`, `【各孔穴开发总账】：骚口深喉 ${c.性交?.口 || 0} 次 ｜ 骚逼贯穿 ${c.性交?.小穴 || 0} 次 ｜ 屁眼后庭 ${c.性交?.屁眼 || 0} 次 ｜ 乳交 ${c.性交?.乳穴 || 0} 次 ｜ 足腿摩擦 ${c.性交?.足腿 || 0} 次。`));

        if (Number(c.高潮?.总数) > 0) {
            items.push(mk(`💎 高潮：「共${c.高潮.总数}次」`, `【绝顶高潮记录】：累计高潮 ${c.高潮.总数} 次（强制 ${c.高潮.强制 || 0} 次）。`));
        }

        const ejStr = joinNonZero(c.射精, "次");
        if (ejStr) items.push(mk(`💎 内射与颜射：「${ejStr}」`, `【精液浇灌记录】：内射 ${c.射精?.内射 || 0} 次，颜射体外 ${c.射精?.颜射体外 || 0} 次，当前子宫储精 ${sp.子宫毫升 || 0}ml。`));

        if (Number(c.精液摄入?.吞精次数) > 0 || Number(c.精液摄入?.累计毫升) > 0) {
            items.push(mk(`💎 饮精与摄入：「吞精${c.精液摄入.吞精次数}次／${c.精液摄入.累计毫升}ml」`, `【口喉饮精记录】：累计吞精 ${c.精液摄入.吞精次数} 次、共 ${c.精液摄入.累计毫升}ml。`));
        }

        if (Number(c.自慰) > 0) items.push(mk(`💎 自慰：「累计${c.自慰}次」`, `【自渎记录】：累计自慰 ${c.自慰} 次。`));

        const tradeStr = joinNonZero(c.交易, "次");
        if (tradeStr) items.push(mk(`💎 接客与流转：「${tradeStr}」`, `【风月卖身总账】：累计接客卖身 ${c.交易?.接客卖身 || 0} 次，被外借共享 ${c.交易?.被外借共享 || 0} 次。`));

        const kpiDone = Number(c.今日KPI?.已完成) || 0, kpiMax = Number(c.今日KPI?.配额) || 2;
        items.push(mk(`📋 今日KPI配额：${kpiDone}/${kpiMax}项`, `【今日配额进度】：今日已完成 ${kpiDone} 单（目标 ${kpiMax} 单）。`));
        return items;
    }

    function getFallbackData(latestChatText = "") {
        const ctx = safeCtx(), u = ctx?.name1 || "伊一", c = ctx?.name2 || "当前角色", v = curVars;
        return {
            charName: u,
            floorId: `${c} · 实时`,
            categories: buildFullFallbackCategories(u, c, v, latestChatText)
        };
    }

    function applyThemeAndSize() {
        const panel = document.getElementById("st-v5-panel");
        const toggleBtn = document.getElementById("st-v5-toggle");
        const tc = THEMES[userSettings.theme] || THEMES["魅魔粉 (默认)"];
        if (panel) {
            panel.style.background = tc.bg;
            panel.style.borderColor = tc.border;
            panel.style.color = tc.text;
            panel.style.width = `${userSettings.width || 470}px`;
            panel.style.height = `${userSettings.height || 620}px`;
            panel.style.zoom = `${(userSettings.fontScale || 100) / 100}`;
        }
        if (toggleBtn) {
            toggleBtn.style.background = `linear-gradient(135deg, ${tc.prim}, ${tc.sec})`;
            toggleBtn.style.boxShadow = `0 6px 20px ${tc.hi}`;
        }
    }

    // 拉取模型列表功能（防 JSON 报错增强版）
    async function fetchModelList(btnEl, selectEl, inputEl) {
        const rawUrl = inputEl ? inputEl.value.trim() : userSettings.apiUrl;
        const apiKey = document.getElementById("st-api-key")?.value.trim() || userSettings.apiKey;
        const { modelsUrl } = getNormalizedEndpoints(rawUrl);
        if (!modelsUrl) {
            alert("请先填写有效的 API 地址 (URL)！");
            return;
        }
        if (btnEl) btnEl.textContent = "⏳ 拉取中...";
        try {
            const headers = { "Accept": "application/json" };
            if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
            const res = await fetch(modelsUrl, { method: "GET", headers });
            const rawText = await res.text();
            if (!rawText || !rawText.trim()) {
                throw new Error(`接口返回空内容 (HTTP ${res.status})，请检查 URL 是否正确`);
            }
            let data;
            try {
                data = JSON.parse(rawText);
            } catch (je) {
                throw new Error(`返回的不是 JSON 格式 (HTTP ${res.status}): ${rawText.slice(0, 80)}`);
            }
            if (!res.ok) {
                throw new Error(data?.error?.message || `HTTP ${res.status}`);
            }
            const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.models) ? data.models : []);
            const ids = list.map(m => typeof m === "string" ? m : (m?.id || m?.name || "")).filter(Boolean);
            if (!ids.length) {
                throw new Error("未在响应中找到可用模型列表");
            }
            userSettings.modelList = ids;
            if (!userSettings.apiModel || !ids.includes(userSettings.apiModel)) {
                userSettings.apiModel = ids[0];
            }
            saveSettings();
            if (selectEl) {
                selectEl.innerHTML = ids.map(id => `<option value="${id}" ${id === userSettings.apiModel ? "selected" : ""}>${id}</option>`).join("");
                selectEl.style.display = "block";
            }
            const modInput = document.getElementById("st-api-mod");
            if (modInput) modInput.value = userSettings.apiModel;
            if (btnEl) btnEl.textContent = `✅ 已拉取(${ids.length})`;
        } catch (err) {
            if (btnEl) btnEl.textContent = "❌ 拉取失败";
            alert("拉取模型失败：" + (err.message || "网络错误"));
        }
    }

    // 独立副 API 自动更新变量功能（彻底修复 Unexpected end of JSON input）
    async function triggerExternalApiUpdate(manualFloorId = null, statusBtn = null) {
        const { chatUrl } = getNormalizedEndpoints(userSettings.apiUrl);
        if (!chatUrl || !userSettings.apiKey) {
            if (manualFloorId !== null || statusBtn) alert("请先在 ⚙️设置 中填写副 API 地址 (URL) 和 API Key！");
            return;
        }
        const ctx = safeCtx(), chat = ctx?.chat || [];
        if (!chat.length) return;
        const fid = manualFloorId !== null ? manualFloorId : (chat.length - 1);
        const targetMsg = chat[fid];
        const rawText = targetMsg?.mes || "";
        if (!rawText) return;

        const btn = statusBtn || document.getElementById("st-v12-api-test");
        const oldTxt = btn ? btn.textContent : "";
        if (btn) btn.textContent = "⏳ 正在请求副API...";

        try {
            const u = ctx?.name1 || "伊一";
            const sysPrompt = `你是状态栏后台变量更新引擎。请根据最新故事正文，结合当前变量JSON，仅输出 <UpdateVariable>...</UpdateVariable> 块（内含若干行 _.set('${u}.路径', 新值); 语句），不要输出任何其他解释！\n当前变量：\n${JSON.stringify(curVars)}`;
            const res = await fetch(chatUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${userSettings.apiKey}`
                },
                body: JSON.stringify({
                    model: userSettings.apiModel || "gpt-4o-mini",
                    messages: [
                        { role: "system", content: sysPrompt },
                        { role: "user", content: `主角：${u}\n最新正文：\n${rawText.slice(-3200)}\n请输出 <UpdateVariable> 块：` }
                    ],
                    temperature: 0.2,
                    stream: false
                })
            });

            const resText = await res.text();
            if (!resText || !resText.trim()) {
                throw new Error(`接口返回了空响应 (HTTP ${res.status})，请检查API地址是否漏填 /v1/chat/completions 或模型名是否正确`);
            }

            let reply = "";
            // 兼容某些反代强制返回 SSE 流 (data: {...}) 的情况
            if (resText.trim().startsWith("data:")) {
                const lines = resText.split("\n");
                for (const line of lines) {
                    const trimmed = line.replace(/^data:\s*/, "").trim();
                    if (!trimmed || trimmed === "[DONE]") continue;
                    try {
                        const chunk = JSON.parse(trimmed);
                        reply += chunk?.choices?.[0]?.delta?.content || chunk?.choices?.[0]?.message?.content || "";
                    } catch (e) {}
                }
            } else {
                let data;
                try {
                    data = JSON.parse(resText);
                } catch (je) {
                    throw new Error(`非JSON响应 (HTTP ${res.status}): ${resText.slice(0, 90)}`);
                }
                if (!res.ok) {
                    throw new Error(data?.error?.message || `HTTP ${res.status}`);
                }
                reply = data?.choices?.[0]?.message?.content || "";
            }

            if (reply && reply.includes("_.set(")) {
                const cleanSet = reply.replace(/```[a-z]*|```/gi, "").replace(/<\/?UpdateVariable>/gi, "").trim();
                if (targetMsg) {
                    // 替换旧的 UpdateVariable 或追加新的
                    if (/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/i.test(targetMsg.mes)) {
                        targetMsg.mes = targetMsg.mes.replace(/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/i, `<UpdateVariable>\n${cleanSet}\n</UpdateVariable>`);
                    } else {
                        targetMsg.mes += `\n<UpdateVariable>\n${cleanSet}\n</UpdateVariable>`;
                    }
                }
                recalc(true);
                cleanDOM(fid, true);
                if (btn) btn.textContent = "✅ 副API同步成功！";
            } else {
                if (btn) btn.textContent = "⚠️ 未返回有效 _.set";
            }
        } catch (err) {
            console.error("[my-status-bar] API Error:", err);
            if (btn) btn.textContent = "❌ 失败: " + (err.message || "网络错误").slice(0, 28);
        }
        if (statusBtn && oldTxt) {
            setTimeout(() => { if (statusBtn) statusBtn.textContent = oldTxt; }, 2500);
        }
    }

    function showDetailPopup(itemIdx) {
        const d = (latestStatus && latestStatus.categories?.length) ? latestStatus : getFallbackData();
        const cat = activeCat !== null ? d.categories[activeCat] : null;
        if (!cat || !cat.items[itemIdx]) return;
        curDetailIdx = itemIdx;
        const item = cat.items[itemIdx];

        const ov = document.getElementById("st-v6-detail-modal");
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
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎨 1. 状态栏主题样式切换（5套皮肤）</div>
                <div id="st-v12-themes" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"></div>
            </div>
            <div style="background:${tc.card};border:1px solid ${tc.border};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">📐 2. 窗口尺寸与字号（也可直接拖动右下角◢缩放）</div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                    <span>窗口宽度 (<b id="st-w-val">${userSettings.width}</b>px)：</span>
                    <input id="st-w-rng" type="range" min="320" max="900" value="${userSettings.width}" style="flex:1;accent-color:${tc.prim};">
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                    <span>窗口高度 (<b id="st-h-val">${userSettings.height}</b>px)：</span>
                    <input id="st-h-rng" type="range" min="340" max="920" value="${userSettings.height}" style="flex:1;accent-color:${tc.prim};">
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                    <span>整体字号缩放 (<b id="st-z-val">${userSettings.fontScale}</b>%)：</span>
                    <input id="st-z-rng" type="range" min="80" max="135" value="${userSettings.fontScale}" style="flex:1;accent-color:${tc.prim};">
                </div>
            </div>
            <div style="background:${tc.card};border:1px solid ${tc.border};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🔌 3. 独立副 API 自动更新变量配置</div>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                    <input id="st-api-chk" type="checkbox" ${userSettings.apiSyncEnabled ? "checked" : ""} style="accent-color:${tc.prim};">
                    <span>启用每回合结束后自动调用副 API 更新状态栏变量</span>
                </label>
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
            const tb = document.createElement("button");
            tb.type = "button";
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
        bindRng("#st-w-rng", "#st-w-val", "width");
        bindRng("#st-h-rng", "#st-h-val", "height");
        bindRng("#st-z-rng", "#st-z-val", "fontScale");

        const modSel = box.querySelector("#st-api-mod-sel");
        const modInp = box.querySelector("#st-api-mod");
        const fetchBtn = box.querySelector("#st-v13-fetch-models");

        modSel.onchange = () => {
            modInp.value = modSel.value;
            userSettings.apiModel = modSel.value;
            saveSettings();
        };
        fetchBtn.onclick = () => {
            userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
            userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
            saveSettings();
            fetchModelList(fetchBtn, modSel, box.querySelector("#st-api-url"));
        };

        box.querySelector("#st-v12-api-save").onclick = () => {
            userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
            userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
            userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
            userSettings.apiModel = modInp.value.trim();
            saveSettings(); inSettings = false; renderBody();
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
            const homeBtn = document.createElement("button");
            homeBtn.type = "button";
            const isHome = activeCat === null && !inSettings;
            homeBtn.style.cssText = `flex-shrink:0;padding:4px 10px;border-radius:99px;font-size:11.5px;font-weight:bold;cursor:pointer;border:1px solid ${isHome ? tc.prim : "rgba(255,255,255,0.12)"};background:${isHome ? tc.prim : "rgba(255,255,255,0.06)"};color:${isHome ? "#11111b" : tc.text};`;
            homeBtn.textContent = "🏠总览";
            homeBtn.onclick = () => { inSettings = false; activeCat = null; renderBody(); };
            tabBar.appendChild(homeBtn);

            d.categories.forEach((cat, idx) => {
                const tb = document.createElement("button");
                tb.type = "button";
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

        if (inSettings) {
            renderSettingsView(body);
            return;
        }

        if (activeCat === null || !d.categories[activeCat]) {
            const grid = document.createElement("div");
            grid.style.cssText = "display:grid;grid-template-columns:repeat(2,1fr);gap:10px;";
            d.categories.forEach((cat, idx) => {
                const b = document.createElement("div");
                b.style.cssText = `background:${tc.card};border:1px solid rgba(255,255,255,0.14);border-left:3.5px solid ${tc.prim};border-radius:12px;padding:11px 12px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 12px rgba(0,0,0,0.4);`;
                const sumText = cat.summary || `共 ${cat.items.length} 项详细实况`;
                b.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:13.5px;font-weight:bold;color:${tc.prim};">${cat.icon} ${cat.title}</span>
                        <span style="font-size:10.5px;background:${tc.hi};color:${tc.text};padding:1px 6px;border-radius:99px;">${cat.items.length}项 ▸</span>
                    </div>
                    <div style="font-size:11px;color:${tc.sub};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sumText}</div>`;
                b.onclick = (e) => { e.stopPropagation(); activeCat = idx; renderBody(); };
                grid.appendChild(b);
            });
            body.appendChild(grid);
        } else {
            const cat = d.categories[activeCat];
            const list = document.createElement("div");
            list.style.cssText = "display:flex;flex-direction:column;gap:9px;";
            cat.items.forEach((it, idx) => {
                const b = document.createElement("div");
                b.style.cssText = `background:${tc.card};border:1px solid ${tc.border};border-radius:11px;padding:10px 12px;cursor:pointer;user-select:none;display:flex;flex-direction:column;gap:4px;box-shadow:0 3px 10px rgba(0,0,0,0.4);`;
                const preview = (it.desc || "").replace(/\s+/g, " ").slice(0, 44) + ((it.desc || "").length > 44 ? "…" : "");
                b.innerHTML = `
                    ${it.keyHTML}
                    ${it.barHTML || ""}
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:4px;padding-top:5px;border-top:1px dashed rgba(255,255,255,0.08);">
                        <span style="font-size:11.5px;color:${tc.sub};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${preview}</span>
                        <span style="color:${tc.prim};font-size:11px;font-weight:bold;white-space:nowrap;flex-shrink:0;">详情 ▸</span>
                    </div>`;
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
            <button id="st-v5-toggle" type="button" title="点击展开/收起，按住直接拖动位置" style="background:linear-gradient(135deg,#f38ba8,#cba6f7);color:#11111b;border:none;font-weight:900;font-size:14px;padding:8px 18px;border-radius:99px;cursor:grab;user-select:none;touch-action:none;box-shadow:0 6px 20px rgba(243,139,168,0.6);">
                <span id="st-v5-btn-txt">👑 主角 · 状态栏</span>
            </button>
        </div>
        <div id="st-v5-panel" style="display:none;position:relative;margin-top:8px;width:${userSettings.width}px;height:${userSettings.height}px;min-width:320px;min-height:340px;max-width:96vw;max-height:88vh;background:linear-gradient(165deg,#181424,#1e192b);border:2px solid #f38ba8;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.92);color:#ede6f2;flex-direction:column;overflow:hidden;">
            <div id="st-v5-header" title="按住标题栏可拖动窗口" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.12);cursor:grab;user-select:none;touch-action:none;flex-shrink:0;gap:6px;">
                <b id="st-v5-title" style="color:#f5c2e7;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">主角档案</b>
                <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
                    <button id="st-v5-refresh-btn" type="button" title="强制重新扫描所有楼层并刷新变量（若开启副API则同步请求更新）" style="background:rgba(166,227,161,0.2);color:#a6e3a1;border:1px solid rgba(166,227,161,0.5);border-radius:8px;padding:2px 8px;cursor:pointer;font-size:11.5px;font-weight:bold;">🔄 刷新楼层</button>
                    <button id="st-v5-cfg-btn" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.25);border-radius:8px;padding:2px 8px;cursor:pointer;font-size:11.5px;font-weight:bold;">⚙️ 设置</button>
                    <span id="st-v5-close" style="cursor:pointer;color:#f38ba8;font-size:16px;font-weight:bold;padding:0 4px;">✕</span>
                </div>
            </div>
            <div id="st-v5-tabs" style="display:flex;gap:5px;overflow-x:auto;padding:8px 12px;background:rgba(0,0,0,0.35);border-bottom:1px solid rgba(255,255,255,0.07);scrollbar-width:none;flex-shrink:0;"></div>
            <div id="st-v5-body" style="padding:12px 14px;overflow-y:auto;flex:1;"></div>
            <div id="st-v12-resize-r" title="左右拖动调节宽度" style="position:absolute;top:40px;right:0;width:7px;bottom:18px;cursor:ew-resize;z-index:40;"></div>
            <div id="st-v12-resize-b" title="上下拖动调节高度" style="position:absolute;left:0;right:18px;bottom:0;height:7px;cursor:ns-resize;z-index:40;"></div>
            <div id="st-v12-resize-rb" title="按住角落自由缩放窗口大小" style="position:absolute;right:0;bottom:0;width:20px;height:20px;cursor:nwse-resize;z-index:45;display:flex;align-items:flex-end;justify-content:flex-end;padding:3px;color:#f38ba8;font-size:11px;user-select:none;">◢</div>
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

        const panel = document.getElementById("st-v5-panel");
        const toggleBtn = document.getElementById("st-v5-toggle");
        const headerBar = document.getElementById("st-v5-header");

        function bindDirectDrag(handleEl, onClickCallback) {
            let isDown = false, moved = false, sx = 0, sy = 0, ir = 20, it = 65;
            handleEl.addEventListener("pointerdown", (e) => {
                if (e.target.closest("#st-v5-close") || e.target.closest("#st-v5-cfg-btn") || e.target.closest("#st-v5-refresh-btn")) return;
                isDown = true; moved = false; sx = e.clientX; sy = e.clientY;
                const rect = root.getBoundingClientRect();
                ir = window.innerWidth - rect.right; it = rect.top;
                handleEl.style.cursor = "grabbing";
                handleEl.setPointerCapture?.(e.pointerId);
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
                isDown = false;
                handleEl.style.cursor```javascript
 = "grab";
                handleEl.releasePointerCapture?.(e.pointerId);
                if (!moved && typeof onClickCallback === "function") onClickCallback();
            });
        }

        function bindResizeHandle(el, mode) {
            let resizing = false, sx = 0, sy = 0, sw = 0, sh = 0;
            el.addEventListener("pointerdown", (e) => {
                e.stopPropagation();
                resizing = true; sx = e.clientX; sy = e.clientY;
                sw = panel.offsetWidth; sh = panel.offsetHeight;
                el.setPointerCapture?.(e.pointerId);
            });
            el.addEventListener("pointermove", (e) => {
                if (!resizing) return;
                const dx = e.clientX - sx, dy = e.clientY - sy;
                if (mode === "r" || mode === "rb") {
                    userSettings.width = Math.max(320, Math.min(920, sw + dx));
                    panel.style.width = userSettings.width + "px";
                }
                if (mode === "b" || mode === "rb") {
                    userSettings.height = Math.max(340, Math.min(920, sh + dy));
                    panel.style.height = userSettings.height + "px";
                }
            });
            el.addEventListener("pointerup", (e) => {
                if (!resizing) return;
                resizing = false;
                el.releasePointerCapture?.(e.pointerId);
                saveSettings();
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

        // 顶栏「🔄 刷新楼层」按钮：强制全量扫描所有楼层 + 重新隐藏裸露标签 + 若开启副API则同步更新最新楼层
        const refreshBtn = document.getElementById("st-v5-refresh-btn");
        refreshBtn.onclick = async (e) => {
            e.stopPropagation();
            refreshBtn.textContent = "⏳ 扫描中...";
            // 清除已处理标记，强制重扫全楼层
            document.querySelectorAll(".mes_text[data-st-cleaned]").forEach(el => el.removeAttribute("data-st-cleaned"));
            recalc(true);
            cleanAll(true);
            if (userSettings.apiSyncEnabled && userSettings.apiUrl && userSettings.apiKey) {
                await triggerExternalApiUpdate(null, refreshBtn);
            } else {
                refreshBtn.textContent = "✅ 已刷新";
                setTimeout(() => { refreshBtn.textContent = "🔄 刷新楼层"; }, 1200);
            }
        };

        document.getElementById("st-v5-cfg-btn").onclick = () => { inSettings = !inSettings; renderBody(); };
        document.getElementById("st-v5-close").onclick = () => { panel.style.display = "none"; };
        document.getElementById("st-v6-det-close").onclick = () => { document.getElementById("st-v6-detail-modal").style.display = "none"; };
        document.getElementById("st-v6-detail-modal").onclick = (e) => {
            if (e.target.id === "st-v6-detail-modal") e.currentTarget.style.display = "none";
        };
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

    // 从单层文本中提取状态栏结构，并自动同步其中的数值（兼容旧格式与单行多字段格式）
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

            // 兼容一：单行内直接写 [[核心数值]] -> 对肉棒好感度: 0 | 性欲程度: 0 的紧凑格式
            const inlineCatMatch = l.match(/^(?:[#*\-\s]*)\[\[\s*(.+?)\s*\]\]\s*(?:->|→|-＞|＞)\s*(.+)$/);
            if (inlineCatMatch) {
                let title = inlineCatMatch[1].trim();
                if (title.includes("服装") || title.includes("着装")) title = "服装与道具";
                cur = { title, icon: ICONS[title] || "📁", items: [] };
                cats.push(cur);
                const rhs = inlineCatMatch[2].trim();
                const parts = rhs.split(/\s*[|｜]\s*/);
                if (parts.length >= 2 && !rhs.includes(":")) {
                    const rawKey = parts[0].replace(/\*\*/g, "").trim();
                    const desc = parts.slice(1).join(" ｜ ").trim();
                    lastItem = { rawKey, desc, ...fmtKey(rawKey) };
                    cur.items.push(lastItem);
                } else {
                    parts.forEach(p => {
                        const kv = p.trim();
                        if (!kv) return;
                        lastItem = { rawKey: kv, desc: kv, ...fmtKey(kv) };
                        cur.items.push(lastItem);
                    });
                }
                return;
            }

            // 兼容二：标准独立行 [[大类名]]
            const sm = l.match(/^(?:[#*\-\s]*)\[\[\s*(.+?)\s*\]\](?:[*]*)$/);
            if (sm) {
                let title = sm[1].trim();
                if (title.includes("服装") || title.includes("着装")) title = "服装与道具";
                cur = { title, icon: ICONS[title] || "📁", items: [] };
                cats.push(cur);
                lastItem = null;
                return;
            }

            // 兼容三：标准条目行 -> 标题 | 描述
            const im = l.match(/^(?:->|→|-＞|＞|[-•·])\s*([^|｜]+?)\s*[|｜]\s*(.+)$/);
            if (im && cur) {
                const rawKey = im[1].replace(/\*\*/g, "").trim();
                const desc = im[2].trim();
                lastItem = { rawKey, desc, ...fmtKey(rawKey) };
                cur.items.push(lastItem);
            } else if (lastItem && !l.startsWith("【") && !l.startsWith("_.set") && !l.startsWith("<")) {
                lastItem.desc += "\n" + l;
            }
        });

        // 从状态栏文本中自动提取数值同步到 curVars（无论是否有 /100 都能识别）
        if (cats.length) {
            cats.forEach(c => {
                c.items.forEach(it => {
                    const k = it.rawKey + " " + (it.desc || "");
                    const matchNum = (kw) => {
                        const reg = new RegExp(kw + "[^\\d\\n]{0,8}(\\d+)", "i");
                        const m = k.match(reg);
                        return m ? parseInt(m[1], 10) : null;
                    };
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

                    const mOral = k.match(/口\s*[：:]?\s*(\d+)/); if (mOral) curVars.计数.性交.口 = parseInt(mOral[1], 10);
                    const mVag = k.match(/小穴\s*[：:]?\s*(\d+)/); if (mVag) curVars.计数.性交.小穴 = parseInt(mVag[1], 10);
                    const mAnal = k.match(/屁眼\s*[：:]?\s*(\d+)/); if (mAnal) curVars.计数.性交.屁眼 = parseInt(mAnal[1], 10);
                    const mFoot = k.match(/足腿\s*[：:]?\s*(\d+)/); if (mFoot) curVars.计数.性交.足腿 = parseInt(mFoot[1], 10);
                    const mOrg = k.match(/高潮(?:总数)?\s*[：:]?\s*(\d+)/); if (mOrg) curVars.计数.高潮.总数 = parseInt(mOrg[1], 10);
                    const mIn = k.match(/内射\s*[：:]?\s*(\d+)/); if (mIn) { curVars.计数.射精.内射 = parseInt(mIn[1], 10); if (!curVars.体内精液存量.子宫毫升 && curVars.计数.射精.内射 > 0) curVars.体内精液存量.子宫毫升 = 15; }
                    const mOut = k.match(/颜射体外\s*[：:]?\s*(\d+)/); if (mOut) curVars.计数.射精.颜射体外 = parseInt(mOut[1], 10);
                    const mSw = k.match(/吞精\s*[：:]?\s*(\d+)/); if (mSw) curVars.计数.精液摄入.吞精次数 = parseInt(mSw[1], 10);
                    const mMl = k.match(/摄入\s*[：:]?\s*(\d+)\s*ml/i); if (mMl) curVars.计数.精液摄入.累计毫升 = parseInt(mMl[1], 10);
                    const mHk = k.match(/接客卖身\s*[：:]?\s*(\d+)/); if (mHk) curVars.计数.交易.接客卖身 = parseInt(mHk[1], 10);
                });
            });
            const fetishCat = cats.find(c => c.title === "总性癖");
            if (fetishCat && fetishCat.items.length) {
                curVars.性癖.条目 = fetishCat.items.map(it => {
                    const nmM = it.rawKey.match(/性癖[•·]([^（(]+)/);
                    const brM = it.rawKey.match(/[（(](.*?)[）)]/);
                    const name = nmM ? nmM[1].trim() : it.rawKey.slice(0, 10);
                    let origin = (it.desc || "").slice(0, 28), stage = "第一阶段", val = "100/100";
                    if (brM) {
                        const sp = brM[1].split(/[·,，]/);
                        if (sp[0]) origin = sp[0].trim();
                        if (sp[1]) stage = sp[1].trim();
                        if (sp[2]) val = sp[2].trim();
                    }
                    return `${name}-${origin}-${stage}-${val}`;
                });
            }
        }

        return cats.length ? { charName: cName, floorId: fid, categories: cats } : null;
    }

    // 兼容带引号与不带引号的 _.set(路径, 值) 解析器（无回溯卡死风险）
    function applySetStatements(text, targetVars) {
        if (!text || !text.includes("_.set")) return;
        const lines = text.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line.includes("_.set(")) continue;
            // 匹配 _.set('a.b.c', val) 或 _.set(a.b.c, val)
            const m = line.match(/_\.set\(\s*(?:(['"`])([^'"`]+)\1|([^,]+?))\s*,\s*(.+?)\)\s*;?\s*$/);
            if (!m) continue;
            const rawPath = (m[2] || m[3] || "").trim();
            const rawVal = (m[4] || "").trim();
            if (!rawPath) continue;
            try {
                let val;
                if (/^-?\d+(?:\.\d+)?$/.test(rawVal)) {
                    val = Number(rawVal);
                } else if (rawVal === "true" || rawVal === "false") {
                    val = rawVal === "true";
                } else {
                    val = Function(`"use strict";return (${rawVal});`)();
                }
                const ps = rawPath.split(".").map(s => s.trim()).filter(Boolean);
                // 如果首段是角色名（不在 targetVars 顶层键中），自动剥离首段
                if (ps.length > 1 && !Object.prototype.hasOwnProperty.call(targetVars, ps[0])) {
                    ps.shift();
                }
                let cur = targetVars;
                for (let j = 0; j < ps.length - 1; j++) {
                    if (cur[ps[j]] === undefined || typeof cur[ps[j]] !== "object") {
                        cur = null; break;
                    }
                    cur = cur[ps[j]];
                }
                if (cur && ps.length > 0 && Object.prototype.hasOwnProperty.call(cur, ps[ps.length - 1])) {
                    cur[ps[ps.length - 1]] = val;
                }
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
                if (fbCat.title === "计数记录" && exCat.items.length < fbCat.items.length) {
                    return fbCat;
                }
                const enrichedItems = exCat.items.map((it, idx) => {
                    const fbItem = fbCat.items[idx];
                    let finalDesc = it.desc || "";
                    if (fbItem && finalDesc.length < 55 && !finalDesc.includes(fbItem.desc.slice(0, 12))) {
                        finalDesc = finalDesc ? `${finalDesc}\n\n${fbItem.desc}` : fbItem.desc;
                    }
                    return { ...it, desc: finalDesc, ...fmtKey(it.rawKey) };
                });
                fbCat.items.forEach(fbIt => {
                    const keyWord = fbIt.rawKey.replace(/^[^\u4e00-\u9fa5]+/, "").slice(0, 2);
                    if (keyWord && !enrichedItems.some(x => x.rawKey.includes(keyWord))) {
                        enrichedItems.push(fbIt);
                    }
                });
                return { ...exCat, summary: fbCat.summary, items: enrichedItems };
            }
            return fbCat;
        });
        for (const restCat of map.values()) {
            if (restCat.items.length > 0) mergedCats.push(restCat);
        }
        return { charName: extracted.charName || fallback.charName, floorId: extracted.floorId, categories: mergedCats };
    }

    // 防死循环、防重入的 DOM 清理函数
    function cleanDOM(id, force = false) {
        const el = document.querySelector(`.mes[mesid="${id}"] .mes_text`);
        if (!el) return;
        const rawMes = safeCtx()?.chat?.[Number(id)]?.mes || "";
        const sig = `${rawMes.length}_${el.innerHTML.includes("st-ext-inline-trigger")}`;
        if (!force && el.getAttribute("data-st-cleaned") === sig) return;

        let h = el.innerHTML;
        let changed = false;

        if (/&lt;\/?game&gt;|<\/?game>/i.test(h)) {
            h = h.replace(/&lt;\/?game&gt;|<\/?game>/gi, "");
            changed = true;
        }
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
            // 只处理最后 25 个 DOM 节点，防止旧卡百层消息一次性重绘卡死
            const start = force ? 0 : Math.max(0, nodes.length - 25);
            for (let idx = start; idx < nodes.length; idx++) {
                const i = nodes[idx].getAttribute("mesid");
                if (i !== null) cleanDOM(i, force);
            }
        } finally {
            isCleaningDOM = false;
        }
    }

    function scheduleCleanAll() {
        if (isCleaningDOM) return;
        if (cleanTimer) clearTimeout(cleanTimer);
        cleanTimer = setTimeout(() => cleanAll(false), 180);
    }

    // 重新计算变量与状态栏（支持 forceAll 全楼层扫描与日常轻量扫描）
    function recalc(forceAll = false) {
        try {
            const ctx = safeCtx(), fv = getInitialVars();
            curVars = fv;
            const chat = ctx?.chat || [];
            let last = null, latestChatText = "";

            // 1. 先从头扫描所有轻量级的 _.set 语句（单行正则极快）
            for (let i = 0; i < chat.length; i++) {
                const t = chat[i]?.mes || "";
                if (t.includes("_.set(")) applySetStatements(t, fv);
            }

            // 2. 状态栏全文提取：平时只扫最近 25 层防卡死，点击「🔄刷新楼层」时扫全部楼层
            const scanStart = forceAll ? 0 : Math.max(0, chat.length - 25);
            for (let i = scanStart; i < chat.length; i++) {
                const t = chat[i]?.mes || "";
                if (t) latestChatText = t;
                const ex = extractText(t, i);
                if (ex) last = ex;
            }

            // 3. 若旧卡完全没有【状态栏】记录，则自动用当前角色名与最新楼层号初始化状态显示
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
