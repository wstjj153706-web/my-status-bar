// == 状态栏与楼层变量引擎 V12 (10大重口分类全覆盖 + 自由缩放 + 主题与副API设置 + 零残留隐藏终极版) ==
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
        apiModel: "gpt-4o-mini"
    };

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(EXT_ID + "_v12_cfg") || "{}");
            userSettings = { ...userSettings, ...s };
            if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉 (默认)";
        } catch (e) {}
    }
    function saveSettings() {
        try { localStorage.setItem(EXT_ID + "_v12_cfg", JSON.stringify(userSettings)); } catch (e) {}
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
【⚠️ 最高优先级：人设与处女模板冲突自动校准指令！】
检测到上方注入的变量库目前仍处于默认的「清白处女」初始模板！若主角（${userName}）在故事设定中不是清白处女（如妓女、暗娼、花魁、性奴、熟女等），你绝不许照抄0值模板，必须在本回合立即根据她的过往经历全量重估核心数值、精神与心理、历史累计计数（接客卖身、小穴、口交、内射、吞精等）与性癖.条目，并在状态栏与末尾 <UpdateVariable> 中用 _.set 一次性完整覆盖写回！` : "";

        return `
【当前变量库实时注入值】
${currentYaml}
${autoInitRule}

【状态栏与变量更新强制规范】
1. 每条回复末尾按顺序输出：正文 -> 【状态栏｜${userName}】...【/状态栏】 -> <UpdateVariable>块</UpdateVariable>。
2. 状态栏包含：[[角色档案]]、[[总性癖]]、[[核心数值]]、[[精神与心理]]、[[身体情况]]、[[服装与道具]]、[[性器官]]、[[排泄与体液]]、[[特殊状态]]、[[计数记录]]，每条格式为 -> 标题 | 极度色情重口详尽描写（严禁在描述内使用竖线 |）。
3. 严禁在 <UpdateVariable> 标签外输出任何 _.set 语句！`;
    }

    // 标题拆分为：左侧纯净标题 + 右侧胶囊徽章组 + 动态流光进度条
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

        cleanTitle = cleanTitle.replace(/「(.*?)」/g, (_, s) => {
            badges.push(`<span style="background:${tc.hi};border:1px solid ${tc.sec};color:${tc.text};padding:1px 7px;border-radius:6px;font-size:11px;font-weight:bold;">${s}</span>`);
            return "";
        });
        cleanTitle = cleanTitle.replace(/[（(]([^）)]*?(?:阶段|\d+\s*[\/／]\s*\d+)[^）)]*?)[）)]/g, (_, s) => {
            badges.push(`<span style="background:rgba(255,255,255,0.1);border:1px solid ${tc.prim};color:${tc.prim};padding:1px 7px;border-radius:6px;font-size:11px;">${s}</span>`);
            return "";
        });
        cleanTitle = cleanTitle.replace(/[（(](\+\d+[^）)]*)[）)]/g, (_, s) => {
            badges.push(`<span style="background:rgba(243,139,168,0.28);border:1px solid #f38ba8;color:#ffb3c6;padding:1px 6px;border-radius:5px;font-size:11px;font-weight:bold;">${s}</span>`);
            return "";
        });
        cleanTitle = cleanTitle.replace(/[（(](-\d+[^）)]*)[）)]/g, (_, s) => {
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

    // 五阶重口数值动态长文引擎
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
                    `【当前数值：${cockLove}/100 · 第五阶段「${stages[4]}」】\n满值沦陷的终极肉棒奴隶！${u}的大脑已被肉棒彻底支配，哪怕只是闻到一丝包皮垢与精液的浓烈腥臭，都会瞳孔涣散、吐舌流涎，全身三处肉孔（骚口、骚逼、屁眼）同时疯狂痉挛吸吮。她会毫无廉耻地用脸颊磨蹭粗硬柱身，主动掰开红肿外翻的阴唇祈求粗暴贯穿：“大肉棒就是${u}的命……求您捅穿这具下贱肉便器，把滚烫浓精全都射进子宫深处吧♡！”`
                ];
                return { val: cockLove, stage: stages[t], desc: descs[t] };
            }
            case "lust": {
                const t = tier5(lust);
                const stages = ["清心寡欲", "余韵温吞•春情暗涌", "欲火焚身•淫水拉丝", "重度发情•夹腿索操", "永动机式潮吹母畜"];
                const descs = [
                    `【当前数值：${lust}/100 · 第一阶段「${stages[0]}」】\n身体尚处于较为平静的状态，情欲未被完全挑起，仅有轻微的体温波动与呼吸起伏。`,
                    `【当前数值：${lust}/100 · 第二阶段「${stages[1]}」】\n小腹深处升起一股温吞的燥热酸胀，或正处于激烈性交射精后的余韵退潮期。乳尖在衣料摩擦下充血挺立，大腿根部被分泌出的爱液与残精沾湿，穴肉一阵阵空虚地微缩。`,
                    `【当前数值：${lust}/100 · 第三阶段「${stages[2]}」】\n浓郁的情欲之火烧遍全身！${u}的脸颊泛着淫靡潮红，呼吸粗重滚烫，肥美的奶子随着喘息剧烈起伏。下身骚逼早已淫水泛滥，黏稠拉丝的爱液顺着大腿内侧不断滑落，迫切渴望粗硬异物的插入止痒。`,
                    `【当前数值：${lust}/100 · 第四阶段「${stages[3]}」】\n重度发情状态！全身每一寸皮肤都敏感得一碰即颤，肥大充血的阴蒂暴突在外剧烈跳动。${u}像一条处在发情期的母狗般夹紧双腿、扭动腰臀，嘴里漏出甜腻下流的哼唧声，骚逼里淫水噗嗤噗嗤往外直冒。`,
                    `【当前数值：${lust}/100 · 第五阶段「${stages[4]}」】\n极度过载的狂暴发情期！${u}脑子里除了交配与被内射外再无半点杂念，浑身滚烫出汗，散发出浓烈刺鼻的雌性发情腥香。乳尖硬如石子，红肿外翻的骚穴与屁眼24小时不停地向外喷涌黄浊黏腻的淫水，子宫口更是一开一合地向下脱垂索精！`
                ];
                return { val: lust, stage: stages[t], desc: descs[t] };
            }
            case "corr": {
                const t = tier5(corr);
                const stages = ["初守贞洁", "半推半就", "风尘浸染•放荡沉沦", "下贱娼妇•肉器自觉", "脑髓熔断公用肉便器"];
                const descs = [
                    `【当前数值：${corr}/100 · 第一阶段「${stages[0]}」】\n心底仍残存着对清白与自尊的执念，面对露骨的玩弄会感到屈辱难堪。`,
                    `【当前数值：${corr}/100 · 第二阶段「${stages[1]}」】\n身体在与男人的交欢中逐渐食髓知味，道德感开始松动，学会用破罐破摔的心态适应肉体交易。`,
                    `【当前数值：${corr}/100 · 第三阶段「${stages[2]}」】\n在累计接客${hookerCnt}次、被内射${creampie}次后，她已彻底习惯了被陌生男人随意玩弄内射，早已不再将贞洁与羞耻视作不可逾越之物，举手投足间尽是熟练暗娼的麻木与放浪。`,
                    `【当前数值：${corr}/100 · 第四阶段「${stages[3]}」】\n身心彻底恶堕的极品淫乱娼妇！她以自己的身体能成为男人们发泄兽欲的肉套子为荣，主动张开双腿展示被操得红肿外翻的骚逼，用最污秽下流的床话浪叫求欢，渴望更粗暴的轮番蹂躏与灌精。`,
                    `【当前数值：${corr}/100 · 第五阶段「${stages[4]}」】\n终极极限恶堕！${u}的人类尊严与矜持已100%灰飞烟灭，彻底退化为一具只为承接雄性精液而活的公用排泄肉便器。无论被多少男人当众玩弄、灌满三穴、甚至失禁漏尿，她都会挂着痴呆融化的阿片脸吐舌流涎，视被操烂灌饱为至高无上的幸福！`
                ];
                return { val: corr, stage: stages[t], desc: descs[t] };
            }
            case "shame": {
                const t = tier5(shame, true);
                const stages = ["羞极即泄", "薄面微红", "习以为常•半掩半露", "不知廉耻•敞腿任看", "羞耻全灭•公开母畜"];
                const descs = [
                    `【当前数值：${shame}/100 · 第一阶段「${stages[0]}」】\n羞耻心尚高，私密部位被注视或触碰时会耳根通红、浑身紧绷。`,
                    `【当前数值：${shame}/100 · 第二阶段「${stages[1]}」】\n在多次肉体交欢后羞耻防线出现裂痕，虽仍会脸红心跳，但已不会拼死遮挡。`,
                    `【当前数值：${shame}/100 · 第三阶段「${stages[2]}」】\n羞耻感已被风尘磨灭大半！哪怕光裸着下身当着男人的面擦拭大腿根滴落的精液、或者敞着领口晃动奶子也毫无心理压力。`,
                    `【当前数值：${shame}/100 · 第四阶段「${stages[3]}」】\n廉耻心几乎荡然无存！哪怕赤身裸体跪在男人面前口交吞精、或是顶着一肚子精液走动任由白浊顺着大腿根滴落，她也毫不遮掩，甚至故意分开肥臀展示湿漉漉的肉穴。`,
                    `【当前数值：${shame}/100 · 第五阶段「${stages[4]}」】\n羞耻心彻底归零粉碎！哪怕在众目睽睽之下被扒光衣服四脚朝天操干、当众潮吹失禁、浑身涂满浓精像母狗一样爬行展示外翻的骚逼与屁眼，她也会兴奋得浑身发抖、吐舌浪叫！`
                ];
                return { val: shame, stage: stages[t], desc: descs[t] };
            }
            case "obey": {
                const t = tier5(obey);
                const stages = ["抗命顶撞", "委曲求全", "温顺听话•熟练配合", "摇尾乞怜•任打任操", "绝对盲从•肉奴母狗"];
                const descs = [
                    `【当前数值：${obey}/100 · 第一阶段「${stages[0]}」】\n心底仍保留着反抗意识，面对过分的命令会咬唇抗拒。`,
                    `【当前数值：${obey}/100 · 第二阶段「${stages[1]}」】\n在肉体快感与生存压力下学会了低头妥协，开始按照男人的吩咐摆出羞人姿势。`,
                    `【当前数值：${obey}/100 · 第三阶段「${stages[2]}」】\n面对客人的粗鄙命令习惯性顺从，极少顶撞，懂得如何主动分开双腿、配合男人的抽插节奏以让客人满意。`,
                    `【当前数值：${obey}/100 · 第四阶段「${stages[3]}」】\n彻底被驯服的摇尾母狗！对男人的任何粗暴命令都奉若圣旨，不仅会主动跪爬上前用舌头舔净男人的肉棒，挨打受罚时还会一边流着淫水一边哭喊求操。`,
                    `【当前数值：${obey}/100 · 第五阶段「${stages[4]}」】\n100%刻入骨髓的绝对奴性！${u}已完全放弃自主意志，哪怕命令她自己掰开骚逼含入异物、吞下所有浓精尿液、或摆出最下贱的母畜姿势彻夜接客，她都会条件反射般高翘肥臀全力奉承！`
                ];
                return { val: obey, stage: stages[t], desc: descs[t] };
            }
            case "fall": {
                const t = tier5(fall);
                const stages = ["心如止水", "利益维系•肉体习惯", "食髓成瘾•空虚难耐", "重度戒断•渴精成狂", "彻底沉沦•离精失活"];
                const descs = [
                    `【当前数值：${fall}/100 · 第一阶段「${stages[0]}」】\n内心保持独立，尚未对男人的侵犯产生依赖。`,
                    `【当前数值：${fall}/100 · 第二阶段「${stages[1]}」】\n心理上虽仍保持着金钱交易的清醒距离，但肉体和子宫已经开始对被粗大肉棒填满、被滚烫精液灌饱的坠胀感产生习惯。`,
                    `【当前数值：${fall}/100 · 第三阶段「${stages[2]}」】\n身心已深深陷落！只要稍微有一段时间没被男人的肉棒插弄，就会感到坐立难安、骚穴发痒空虚。`,
                    `【当前数值：${fall}/100 · 第四阶段「${stages[3]}」】\n重度肉体与精神成瘾！就像染上烈性毒瘾一样离不开男人的粗暴使用与精液喂养，一旦子宫里的精液流空就会陷入戒断恐慌。`,
                    `【当前数值：${fall}/100 · 第五阶段「${stages[4]}」】\n万劫不复的终极沉沦！离开男人的大肉棒与滚烫浓精她就根本活不下去，甘愿永远当一只每天被射满三穴的专属性奴！`
                ];
                return { val: fall, stage: stages[t], desc: descs[t] };
            }
            case "pleas": {
                const t = tier5(pleas);
                const stages = ["断瘾空虚•酸胀麻木", "微潮酥麻", "快感攀升", "濒临绝顶", "高潮过载•阿片失禁"];
                const descs = [
                    `【当前数值：${pleas}/100 · 第一阶段「${stages[0]}」】\n射精离体后的余韵回落与断瘾空虚期。下身只剩下被粗暴撑开后的麻木酸胀与空落感，挂在穴壁上的残余浓精正一股股向外滑落，穴肉一阵阵空虚地抽搐收缩。`,
                    `【当前数值：${pleas}/100 · 第二阶段「${stages[1]}」】\n酥麻的电流顺着尾椎骨窜向小腹，敏感带被挑逗得充血发烫，穴口一缩一缩地溢出了清亮淫水。`,
                    `【当前数值：${pleas}/100 · 第三阶段「${stages[2]}」】\n密集的快感浪潮不断拍打神经！每一次摩擦与顶撞都让${u}浑身颤抖、脚趾蜷缩，淫水在抽插间被捣出噗嗤噗嗤的白沫。`,
                    `【当前数值：${pleas}/100 · 第四阶段「${stages[3]}」】\n快感已蓄积至决堤边缘！小腹肌肉剧烈绷紧痉挛，肥大充血的阴蒂与宫颈口敏感得如同通了高压电，稍微再顶弄几下就会引爆灭顶高潮。`,
                    `【当前数值：${pleas}/100 · 第五阶段「${stages[4]}」】\n灭顶绝顶高潮连续过载爆发！狂暴的性快感瞬间烧穿脑海，她双眼狂翻白眼、香舌无力吐出唇外，滚烫的潮吹淫水与失禁骚尿混着浓稠白浊从大张的骚逼里狂喷而出！`
                ];
                return { val: pleas, stage: stages[t], desc: descs[t] };
            }
            case "awake": {
                const t = tier5(awake, true);
                const stages = ["神智清醒", "微醺迷离", "意乱情迷", "神魂颠倒", "脑髓熔断•阿片痴呆"];
                const descs = [
                    `【当前数值：${awake}/100 · 状态「${stages[0]}」】\n头脑清醒，清楚感知自己目前的处境、刚收或待收的嫖资房费、以及身体内被射满精液的黏腻坠胀感。`,
                    `【当前数值：${awake}/100 · 状态「${stages[1]}」】\n在情欲与雄性荷尔蒙熏蒸下眼神变得湿润迷离，注意力逐渐被下身传来的火热触感夺走。`,
                    `【当前数值：${awake}/100 · 状态「${stages[2]}」】\n理智防线在连续冲击下摇摇欲坠，眼神涣散失焦，嘴里只能发出断断续续的淫词浪语。`,
                    `【当前数值：${awake}/100 · 状态「${stages[3]}」】\n神智几乎被汹涌的高潮与浓烈精腥味冲垮，脑海一片空白嗡鸣，眼珠半翻，嘴角挂着晶莹口水。`,
                    `【当前数值：${awake}/100 · 状态「${stages[4]}」】\n知性完全瓦解熔断！过载的快感将大脑阿片受体彻底烧穿，${u}翻着白眼吐舌流涎，只能发出“啊嘿、呜嗯♡”的母畜呜咽声！`
                ];
                return { val: awake, stage: stages[t], desc: descs[t] };
            }
            case "brk": {
                const t = tier5(brk);
                const stages = ["自我完整", "风尘异化•认命麻木", "自甘下贱•娼妓自觉", "母畜认同•肉便器化", "人格脑死•纯粹肉器"];
                const descs = [
                    `【当前数值：${brk}/100 · 第一阶段「${stages[0]}」】\n自我认知完整，尚未被扭曲三观。`,
                    `【当前数值：${brk}/100 · 第二阶段「${stages[1]}」】\n自我认知已逐渐向“出卖肉体换取金钱的风尘妓女”倾斜，把张腿挨操、被内射后收拾残局当作再普通不过的日常工作。`,
                    `【当前数值：${brk}/100 · 第三阶段「${stages[2]}」】\n自尊心大半瓦解，发自内心地接受自己身为低贱妓女/性奴的定位，不再觉得被粗暴内射与玩弄有什么不对。`,
                    `【当前数值：${brk}/100 · 第四阶段「${stages[3]}」】\n人格重度崩解扭曲！已彻底抛弃正常女性的自我认知，将自己完完全全视作一条靠张腿挨操、吞精卖笑为生的发情母狗。`,
                    `【当前数值：${brk}/100 · 第五阶段「${stages[4]}」】\n原有高洁人格已永久脑死湮灭！如今活在这具淫熟肉体里的，只剩下一个以充当天下雄性公共排泄便器、孕育精液苗床为唯一生存意义的终极肉便器灵魂！`
                ];
                return { val: brk, stage: stages[t], desc: descs[t] };
            }
            case "sta": {
                const t = tier5(sta, true);
                const stages = ["精力充沛", "微带倦意•腰腿酸软", "香汗淋漓•双腿打颤", "濒临虚脱•瘫软无力", "彻底脱力•任操肉泥"];
                const descs = [
                    `【当前数值：${sta}/100 · 状态「${stages[0]}」】\n体力充沛，紧致丰腴的肉体随时可承受长时间的剧烈交欢。`,
                    `【当前数值：${sta}/100 · 状态「${stages[1]}」】\n刚承受完半小时以上的猛烈撞击与抽插，双腿略微酸软发颤，小腹更因为蓄满滚烫精液而带着明显的坠胀倦意。`,
                    `【当前数值：${sta}/100 · 状态「${stages[2]}」】\n体力消耗过半，浑身被黏腻的香汗浸透，发丝凌乱黏在潮红脸颊上，被操弄过的下身酸麻发软。`,
                    `【当前数值：${sta}/100 · 状态「${stages[3]}」】\n体力濒临枯竭！剧烈的抽插与高潮抽干了全身力气，双腿筛糠般打颤，只能软绵绵地瘫在床榻上任由肉棒进出。`,
                    `【当前数值：${sta}/100 · 状态「${stages[4]}」】\n全身彻底虚脱瘫软！像一滩被操烂的春水般烂在榻上，连抬动手指的力气都没有，唯有骚逼与子宫还在凭着肌肉本能自动收缩榨精！`
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
            return `【性癖成因】：${origin}（当前进度：${stage} · ${valStr}）\n【肉体与心理实况】：${u}表面尚存未经彻底摧毁的羞怯与抗拒，但在风月浸染与男人的强行开发下，这层脆弱的清白外壳正在迅速龟裂。当粗硬滚烫的肉棒强行顶开唇齿或撑开下身肉壁时，强烈的异物感混合着背德刺激，正一点点将她的生理防线改造成渴望被侵犯的淫乱体质。`;
        }
        return `【性癖成因】：${origin}（当前进度：${stage} · ${valStr}）\n【深度重口发作实况】：这项性癖已深深烙印在${u}的骨髓与神经反射之中！在经历累计${hookerCnt}次接客卖身与${vagCnt}次肉棒贯穿后，每当处于触发情境下，她根本无法靠理智控制自己的肉体——呼吸会瞬间变得粗重滚烫，肥美乳尖充血发硬，下身骚逼更是条件反射般涌出大股黏腻拉丝的淫水（当前恶堕度${corr}/100）。她的穴肉与宫颈口会本能地贪婪蠕动收缩，主动迎合男人的粗暴抽插与内射灌精！`;
    }

    // 生成完整的 10 大极致重口分类（50+ 项详细按钮）
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

        // 动态物理形变与体液数据计算
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

        const clothHint = (latestChatText.match(/([^，。！？\n]*?(?:裙|衫|袍|衣|T恤|肚兜|旗袍|丝袜|胸罩|内裤|底裤|亵裤|赤裸|光裸|一丝不挂|靴|鞋|拖鞋|高跟)[^，。！？\n]*)/g) || []).slice(-3).join("；");

        return [
            {
                title: "角色档案", icon: "👩",
                summary: `${hookerCnt > 0 ? `接客${hookerCnt}次` : "实时档案"} · 恶堕${corr}%`,
                items: [
                    mk(`👩 姓名与身份：${u}「${hookerCnt > 50 ? "熟稔暗娼" : (hookerCnt > 0 ? "风尘妓女" : "待开发尤物")}」`, `【主角姓名】：${u} ｜ 当前互动对象：${c}。\n【肉体开发履历】：累计已张开双腿接客卖身 ${hookerCnt} 次，小穴承受粗暴贯穿 ${vagCnt} 次，子宫被滚烫浓精无套内射 ${creampie} 次，喉咙吞咽浓精 ${swallowMl}ml。全身从发丝到脚趾、从六孔形变到体液排泄均处于实时追踪状态。`),
                    mk(`🗣️ 称呼与贱称：「自称我 • 被唤作骚货/便宜暗娼」`, `【称谓实况】：当面平淡自称“我”，称呼嫖客为“老板”或“先生”；但在熟客与街坊暗娼背地里的议论中，她早已被冠上“出租屋里的廉价泄欲骚货”、“给钱就能随便内射的方便肉套子”等下流贱称。`),
                    mk(`📏 罩杯与三维比例：34C／163cm「丰乳细腰肥臀」`, `【体态反差实况】：身高163cm，骨架娇小纤细，腰肢窄软易折，胸前却沉甸甸地挂着一对饱满白皙的34C软嫩雪乳，臀部更是圆润肥美、肉感极佳。趴在床单上被后入冲撞时，雪白臀浪层层翻滚，极具激发男人凌辱欲与内射欲的视觉冲击力。`),
                    mk(`💰 肉体标价与欢场风评：「${corr >= 70 ? "廉价公用肉便器" : "随叫随到便宜货"}」`, `【欢场肉体价目表】：口交吞精 50元／次 ｜ 无套中出内射 150~200元／次 ｜ 包夜任操 500元。\n【社会与恩客风评】：在熟客眼里，${u}是出了名脾气温顺、穴紧水多、任干任射从不多话的便宜暗娼。男人们只要花上一点小钱，就能把一周积攒的浓臭精液肆无忌惮地射满她的子宫深处。`)
                ]
            },
            {
                title: "核心数值", icon: "🔥",
                summary: `好感${cockM.val} · 性欲${lustM.val} · 恶堕${corrM.val}`,
                items: [
                    mk(`💗 对肉棒的好感度：${cockM.val}/100「${cockM.stage}」`, cockM.desc),
                    mk(`🔥 性欲程度：${lustM.val}/100「${lustM.stage}」`, lustM.desc),
                    mk(`🖤 淫乱与恶堕程度：${corrM.val}/100「${corrM.stage}」`, corrM.desc),
                    mk(`⛓️ 母畜奴性与肉器化：${slaveScore}/100「${slaveScore >= 60 ? "雌畜觉醒•主动献穴" : "顺从肉具•任人采撷"}」`, `【当前综合肉器化进度：${slaveScore}/100】\n综合恶堕度、服从度与沦陷度得出的母畜改造指标。经过 ${hookerCnt} 次卖身接客与 ${vagCnt} 次贯穿调教，她的身体早已形成了迎合雄性侵犯的肌肉本能——哪怕大脑尚未下达指令，双腿也会在男人靠近时自动分开，腰臀自然下塌翘起，将自己调整到最方便肉棒长驱直入的角度。`)
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
                    mk(`🌀 催眠与常识改写：${extPsy.催眠深度 || 0}/100「${(extPsy.催眠深度 || 0) > 0 ? "潜指令生效中" : "未催眠•风尘自然驯化"}」`, `【深层精神控制实况】：当前催眠深度 ${extPsy.催眠深度 || 0} 层 ｜ 生效指令：${extPsy.当前指令 || "无"} ｜ 条件反射触发词：${extPsy.条件反射触发词 || "皮带金属扣声、钞票声"} ｜ 用药状态：${extPsy.用药状态 || "无"}。即便未借助催眠药物，长期高强度的内射接客也在一点点将她的常识改写为“女人的子宫天生就是用来装客人精液的容器”。`)
                ]
            },
            {
                title: "总性癖", icon: "🧬",
                summary: `已养成 ${(v.性癖?.条目 || []).length} 项深度重口性癖`,
                items: (v.性癖?.条目 || []).map(s => {
                    const p = String(s).split("-");
                    const titleStr = `🧬 性癖•${p[0] || s}（${p[2] || "第二阶段"}，${p[3] || "100/100"}）`;
                    return mk(titleStr, buildFetishRichDesc(s, v, u));
                })
            },
            {
                title: "身体情况", icon: "🧍",
                summary: `从头到脚10部位解剖实况 · 体力${staM.val}%`,
                items: [
                    mk(`⚡ 体力与脱力：${staM.val}/100「${staM.stage}」`, staM.desc),
                    mk(`💆‍♀️ 头发与头皮：「乌黑微卷•汗湿凌乱贴颈」`, `【部位1·头部与发丝实况】：一头乌黑柔软的微卷长发因方才性交时被男人粗暴抓扯按头、以及剧烈翻云覆雨流出的香汗浸润，此刻有好几缕湿淋淋地贴在修长白皙的颈侧、耳廓与锁骨凹陷处，发丝间还萦绕着廉价香薰、烟草与雄性体液混杂的靡烂气味。`),
                    mk(`🥵 面容与骚浪表情：「${corr >= 50 ? "媚眼失神•潮红流涎" : "双颊潮红•眼底麻木倦怠"}」`, `【部位2·面部与神态实况】：鹅蛋脸型干净清秀，此刻双颊还残留着剧烈性交带来的酡红与薄汗；那双天生带点无辜下垂感的杏眼眼睫低垂，眼底透着一层被男人狠狠开采泄欲后的疲惫、麻木与靡烂颓丧感（颜射累计${facial}次），一眼看去便知是个刚在男人胯下承欢完的风尘尤物。`),
                    mk(`👄 双唇与口腔舌尖：「唇肉充血艳红•嘴角挂涎」`, `【部位3·唇舌与咽喉实况】：丰润饱满的两瓣唇肉因为刚刚承受过客人反复粗暴的吮吻、啃咬以及口交含弄，此刻泛着一层充血微肿的艳红水光，嘴角还残留着一点未干的晶莹涎液与前列腺液腥气，喉音更因之前的闷哼喘息而微微沙哑。`),
                    mk(`⛓️ 脖颈与锁骨香肩：「汗腻白皙•吻痕红印斑驳」`, `【部位4·颈部与肩锁实况】：修长白皙的脖颈与精致锁骨凹陷处盛着一层薄薄的香汗，圆润的肩头因上衣领口被扯得松垮歪斜而直接暴露在外，嫩白肌肤上印着几道男人粗重呼吸与啃咬吮吸留下的淡红吻痕。`),
                    mk(`🍒 胸膛与丰满奶子：「34C无罩真空•乳尖顶布凸起」`, `【部位5·双乳与胸廓实况】：胸前两团34C的饱满乳肉没有任何内衣拘束，在单薄宽松的棉布下随着每一次呼吸沉甸甸地垂挂微颤；两颗刚刚被客人啧啧吮吸玩弄得发硬深红的乳头，正将布料表面顶出两粒清晰淫靡的凸起。`),
                    mk(`🤰 小腹与精液肚：${totalBellyMl}/200ml「${totalBellyMl >= 60 ? "盛精微隆蛙肚•按压晃动" : (totalBellyMl > 0 ? "宫腔蓄精•沉甸坠胀" : "平坦白腻")}」`, `【部位6·腰腹与盛精肚实况】：纤细雪白的腰肢略微酸软，平坦的小腹内部此刻正蓄积着合计 ${totalBellyMl}ml 的浓稠精液（子宫${wombMl}ml、胃袋${mouthMl}ml、直肠${analMl}ml）。只要刚一站起身走动，小腹深处就会传来一阵沉甸甸的坠胀酸软感，用手按压肚脐下方还能感觉到滚烫精浆在宫腔内晃动并往外溢流！`),
                    mk(`🍑 肥臀与股沟：「臀肉雪白紧实•布满暗红掌印」`, `【部位7·臀部与尾椎实况】：两瓣丰腴紧实的雪白臀肉在衣摆下若隐若现，因为刚才趴卧或跪趴在床单上承受男人狂暴的撞击抽打与大力揉捏，滑腻的臀瓣表面留下了好几道刺眼的暗红巴掌印与指痕，臀缝股沟间更是被流淌的体液浸得湿滑泥泞。`),
                    mk(`👐 双手与纤细指尖：「指尖微干•攥纸捂穴擦精」`, `【部位8·上肢与双手实况】：修长白皙的手指指甲修剪得圆润干净，此刻一只手正扶着膝盖支撑发软的身体，另一只手熟练地抽取纸巾擦拭床单与脚背上的精斑，并将揉成团的纸巾紧紧按在自己湿漉漉合不拢的阴唇上吸去外溢的白浊。`),
                    mk(`🦵 大腿内侧与膝盖：「双腿内扣打颤•白浊拉丝淌腿」`, `【部位9·大腿与膝盖实况】：一双修长匀称的裸腿因半小时以上的猛烈抽插而微微发软内扣，膝盖因跪坐在泡沫地垫或床沿承欢而泛着淡淡粉红；大腿根部内侧皮肤雪白娇嫩，不仅沾染着干涸的指印，更有一道浓稠晶莹的乳白精液正顺着腿缝无声无息地往下淌。`),
                    mk(`🦶 玉足与粉嫩脚趾：「脚趾微蜷•脚背拖鞋滴落精斑」`, `【部位10·足部与脚趾实况】（足交累计${cnt.性交?.足腿 || 0}次）：脚型窄小纤细，足背青筋隐现，白嫩的脚趾在廉价塑胶拖鞋里微微蜷缩；刚才站起身走动时，骚穴深处被挤出的一小股白浊精液啪嗒一声正好滴落在脚面与拖鞋鞋面上，留下淫靡刺眼的白色污迹。`)
                ]
            },
            {
                title: "性器官", icon: "🌸",
                summary: `六孔重口形变 · 孔径${vagWidth}cm · 闭合${vagClose}%`,
                items: [
                    mk(`👄 骚口与深喉腔：口交${mouthCnt}次／吞精${swallowMl}ml「唇肿含腥•深喉记忆」`, `【第一孔·口喉开发实况】：累计已承受 ${mouthCnt} 次口交深喉，吞咽浓精 ${swallowCnt} 次（共 ${swallowMl}ml），当前口腔残留 ${mouthMl}ml。唇瓣微肿充血，口腔内壁带着烟草苦味与浓烈的雄性前列腺液腥膻，舌尖熟练地抿去唇角涎水，咽喉深处早已习惯了粗大龟头的顶撞。`),
                    mk(`🍒 骚乳与乳腺孔：泌乳${cnt.泌乳?.累计毫升 || 0}ml「34C浅褐乳晕•乳尖红硬敏化」`, `【第二孔·胸乳敏化实况】：34C丰满白皙的软乳手感极佳，乳晕呈淡淡的浅褐色，两颗乳头在客人粗暴的啃咬吮吸下充血红硬、敏感度暴增（累计被吸饮 ${cnt.泌乳?.被吸饮 || 0} 次）。哪怕只是隔着灰色棉T恤被空气擦过，乳尖都会传来一阵直达子宫的酥麻痒意。`),
                    mk(`🫀 子宫受孕苗床：内射${creampie}次／储精${wombMl}ml「脱垂度${cervixDrop}%•宫颈软烂微张」`, `【第三孔·子宫与宫颈实况】：无任何避孕环！累计已被滚烫浓精内射浇灌 ${creampie} 次，当前子宫深处正充盈饱满地盛着约 ${wombMl}ml 浓稠精液（受孕概率 ${v.受孕与生理?.受孕概率 || 15}%）。那截被粗长肉棒狠狠顶弄、撞得酸胀不堪的子宫颈口已被开发得软烂微张（脱垂度${cervixDrop}%），残留着男人射精时的滚烫余温，正随着直立走动阵阵抽搐，不断将白浊精液从宫口往外挤出！`),
                    mk(`🌺 骚逼前穴：贯穿${vagCnt}次／闭合度${vagClose}/100「极限孔径${vagWidth}cm•花唇外翻漏精」`, `【第四孔·阴道物理形变实况】：已累计承受 ${vagCnt} 次抽插贯穿与 ${orgasmCnt} 次高潮！长期接客让前穴极限撑开孔径达到 ${vagWidth}cm，常态闭合度跌至 ${vagClose}%。两片肥厚的阴唇被肉棒反复摩擦得红肿外翻，花心处彻底合不拢一条细缝，粉红色的嫩肉挂满了黏腻爱液与乳白色稠厚精浆，一颗颗浓精正顺着泥泞肉缝缓缓渗出滴淌！`),
                    mk(`💧 阴蒂与尿道口：高潮${orgasmCnt}次／尺寸${clitSize}mm「包皮褪开充血暴突•尿道敏化」`, `【第五孔·阴蒂与尿道实况】：在经历 ${orgasmCnt} 次高潮与粗暴摩擦后，阴蒂包皮已向后褪开，那颗敏感肉珠充血肿大至 ${clitSize}mm 凸起在外，用纸巾按压吸精时稍微碰到就会引起腰肢轻颤；紧挨着的尿道口括约肌也因阴道前壁频繁受撞而松弛敏化（累计失禁${leakCnt}次／喷潮${squirtCnt}次）。`),
                    mk(`🕳️ 屁眼后庭：开发${analCnt}次／闭合度${analClose}/100「${analCnt > 0 ? `孔径${analWidth}cm•括约肌松弛` : "粉嫩紧闭•沾染流淌精腥"}」`, `【第六孔·肛门与直肠括约肌实况】：累计承受后庭贯穿 ${analCnt} 次，当前肠腔储精 ${analMl}ml，常态闭合度 ${analClose}%。${analCnt > 0 ? `菊穴括约肌已被开拓至极限孔径 ${analWidth}cm，肉褶暗沉柔软，随着呼吸一收一缩。` : `粉嫩紧闭的肛门周围泛着一圈淡淡的摩擦微红，虽未经彻底开发捣烂，但紧致肉褶间已沾染了从骚逼顺着股沟流淌过来的黏稠精液与浓烈腥臊气。`}`)
                ]
            },
            {
                title: "排泄与体液", icon: "🚽",
                summary: `三穴储精${totalBellyMl}ml · 尿意${peeVal}% · 便意${pooVal}%`,
                items: [
                    mk(`🥛 体内精液总储量：${totalBellyMl}/200ml「宫内${wombMl}ml•口胃${mouthMl}ml•后庭${analMl}ml」`, `【三穴精液灌注与溢流总览】：当前体内共残留 ${totalBellyMl}ml 雄性浓精！其中子宫腔蓄积 ${wombMl}ml、口腔与胃袋吞咽残留 ${mouthMl}ml、直肠后穴残留 ${analMl}ml。滚烫黏稠的白浊在体温烘烤下散发出浓郁的石楠花精腥味，由于骚逼花唇红肿外翻合不拢，精浆正不断顺着大腿内侧往下挂线滴落，垃圾桶里已塞满了七八团吸饱精液的半透明废纸巾。`),
                    mk(`💦 淫水与潮吹分泌：${wetLevel}/100「穴道泥泞拉丝•床单大片水渍」`, `【雌穴爱液分泌实况】：长期接客养成的「熟练迎合」体质让她的巴氏腺极为发达，一被肉棒插入便能迅速分泌大量润滑淫水。此刻单人弹簧床的印花床单正中央已晕开了一大片深色的淫靡水渍，腿心肉缝更是湿淋淋、黏糊糊一片。`),
                    mk(`🚰 膀胱尿意与圣水失禁：${peeVal}/100「${peeVal >= 60 ? "括约肌酸软•濒临失禁漏尿" : "平稳蓄积•拟排尿冲刷残精"}」`, `【膀胱与排尿控制实况】：当前膀胱尿意值 ${peeVal}/100（历史累计失禁 ${leakCnt} 次、潮吹喷水 ${squirtCnt} 次）。刚被肉棒隔着阴道前壁顶撞了半小时，膀胱与尿道括约肌略微酸麻，她正盘算着等客人出门后立刻去逼仄的卫生间坐在马桶上排尿，顺便用力将灌进子宫深处的浓精一起排挤出来清洗干净。`),
                    mk(`💩 直肠便意与后庭排泄：${pooVal}/100「${analMl > 0 ? "肠腔灌精坠胀•急需排泄" : "肠道排空良好•括约肌正常"}」`, `【直肠压迫与控便实况】：当前直肠便意值 ${pooVal}/100。${analMl > 0 ? `后庭直肠内灌入的 ${analMl}ml 黏稠精液不断刺激肠壁黏膜，带来强烈的坠胀排泄感，必须时刻夹紧屁眼才不会当场漏出白浊。` : `肠道目前排空状态良好，无失禁风险，仅肛口外部皮肤沾有前穴滑落的精液湿意。`}`),
                    mk(`👃 全身淫靡气味分布：「甜腻香薰混杂浓烈雄性精腥与汗味」`, `【五感气味实况】：逼仄的房间与${u}的身体表面，正蒸腾着廉价香薰蜡烛的甜腻香精味、客人留下的辛辣烟草味、两具肉体剧烈摩擦翻云覆雨后的潮热汗味，以及从她合不拢的骚逼与垃圾桶废纸团里散发出的新鲜雄性麝香与浓烈精液腥臊味。`)
                ]
            },
            {
                title: "服装与道具", icon: "👗",
                summary: `${clothHint ? "剧情衣装同步" : "灰T恤半露"} · 下身光裸真空`,
                items: [
                    mk(`👕 上衣和下衣：「${clothHint || "宽松灰色棉质大T恤•下身完全光裸"}」`, `【外装穿戴实况】：身上只胡乱套着一件洗得发软的宽松灰色圆领棉质大T恤，领口在刚才的纠缠中被扯得松垮歪斜，露出一侧泛着淡淡红痕的圆润香肩；下摆仅勉强遮到大腿根部耻骨处，下半身未穿任何裤子或裙装，完全光裸在外。`),
                    mk(`🩲 内衣与底裤：「完全真空•蕾丝内裤剥落扔在沙发角」`, `【内衬与底裤实况】：全身上下没有穿戴任何内衣与底裤！胸前34C饱满乳肉在T恤下真空晃动，乳头顶出清晰凸点；那条贴身的蕾丝小内裤早在开门接客时就被客人一把剥下扔在沙发角落，导致此刻被内射灌满的骚逼没有任何布料兜挡，精液直接顺着腿根往地上滴。`),
                    mk(`🧦 腿部与鞋子：「裸腿赤足•踩着沾精粉色塑胶拖鞋」`, `【足腿着装实况】：修长白皙的双腿未穿丝袜，赤足踩在一双廉价的粉色塑胶拖鞋内；刚刚站起身时，从骚逼深处滑落的一股白浊浓精正好滴在拖鞋鞋面上，刚被她弯腰用纸巾擦去。`),
                    mk(`🎀 道具或配饰：「${prop.体内道具 !== "无" || prop.束缚状态 !== "无" ? "调教道具穿戴中" : "无束缚•避孕套袋与带精纸团散落"}」`, `【随身与环境道具实况】：体内道具：${prop.体内道具} ｜ 束缚状态：${prop.束缚状态} ｜ 穿刺环饰：${mark.穿刺与环饰}。床头与地面散落着拆封的避孕套包装袋、揣进兜里的塑料打火机，以及床边塞满七八团吸饱精液废纸巾的黑色垃圾桶。`)
                ]
            },
            {
                title: "特殊状态", icon: "💬",
                summary: `第一人称暗娼独白 · 捂穴防精滴落姿势`,
                items: [
                    mk(`💬 内心想法：「${corr >= 60 ? "母畜沉沦•渴求大肉棒再次灌满" : "风尘麻木•盘算抠精清洗与今晚王哥接客"}」`, corr >= 60
                        ? `【第一人称重口母狗独白】：“哈啊……好想要大肉棒……${u}的骚逼和子宫都已经被操成离不开男人精液的形状了♡……只要闻到肉棒的腥臭味，下面的淫水就止不住地往外流……求求客人们再用力一点操烂${u}的贱穴吧，把滚烫浓稠的精液全都射进子宫最深处，把${u}灌成大肚子肉便器才好呢♡……”`
                        : `【第一人称真实风尘独白】：“今天这单总算是完事了，这男人力气大得很，最后射精那几下差点把我腰都撞散了……小肚子现在酸胀得厉害，子宫里全是他射进来的滚烫精液，走一步就往下淌。等他在玄关系好皮带付完钱，我得赶紧去洗手间坐马桶上把里面的精液都抠出来洗干净，不然流在裤子里黏糊糊的又难受又容易得病，今晚隔壁王哥还说要带个朋友过来玩，还得赶紧换套干净床单……”`),
                    mk(`😃 当前姿势：「半弯腰扶膝夹腿•一手攥纸团紧捂漏精骚穴」`, `【当前淫靡肢体定格】：${u}正站在逼仄卧室的床沿边，半弯着酸软的腰肢，一只手扶着膝盖借力，两腿微微内扣夹紧，另一只手攥着浸满乳白精液的纸巾团，紧紧按压在自己红肿外翻、湿淋淋合不拢的阴户肉唇上，防止子宫深处的浓精继续往拖鞋上滴落。`),
                    mk(`🔔 敏感点与身体反射：「宫颈口酸胀敏化•闻烟味皮带声自动分泌淫水」`, `【身体条件反射实况】：当前最敏感部位为被龟头反复顶撞的「子宫颈口」与「充血外翻的阴唇内壁」。由于长期在出租屋接客，她的身体已对皮带金属扣咔嗒声、打火机声与浓烈雄性精腥味产生条件反射，听到便会下意识放松括约肌准备迎合。`)
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
        if (sexStr) items.push(mk(`💎 性交次数：「${sexStr}」`, `【各孔穴开发总账】：骚口深喉 ${c.性交?.口 || 0} 次 ｜ 骚逼贯穿 ${c.性交?.小穴 || 0} 次 ｜ 屁眼后庭 ${c.性交?.屁眼 || 0} 次 ｜ 乳交 ${c.性交?.乳穴 || 0} 次 ｜ 足腿摩擦 ${c.性交?.足腿 || 0} 次。每一次粗暴抽插都在肉壁上刻下了不可逆的形状记忆。`));

        if (Number(c.高潮?.总数) > 0) {
            const sub = [];
            if (c.高潮.强制 > 0) sub.push(`强制${c.高潮.强制}次`);
            if (c.高潮.公开场合 > 0) sub.push(`公开${c.高潮.公开场合}次`);
            if (c.高潮.寸止 > 0) sub.push(`寸止${c.高潮.寸止}次`);
            items.push(mk(`💎 高潮：「共${c.高潮.总数}次${sub.length ? "·" + sub.join("/") : ""}」`, `【绝顶高潮记录】：累计已被男人逼出 ${c.高潮.总数} 次高潮（其中强制高潮 ${c.高潮.强制 || 0} 次）。频繁的高潮电击让她的身体愈发敏化易感。`));
        }

        const ejStr = joinNonZero(c.射精, "次");
        if (ejStr) items.push(mk(`💎 内射与颜射：「${ejStr}」`, `【精液浇灌记录】：累计已被浓精直灌子宫内射 ${c.射精?.内射 || 0} 次，颜射与体外射精 ${c.射精?.颜射体外 || 0} 次。当前子宫内正盛着 ${sp.子宫毫升 || 0}ml 滚烫白浊。`));

        if (Number(c.精液摄入?.吞精次数) > 0 || Number(c.精液摄入?.累计毫升) > 0) {
            items.push(mk(`💎 饮精与摄入：「吞精${c.精液摄入.吞精次数}次／${c.精液摄入.累计毫升}ml」`, `【口喉饮精记录】：已累计吞咽浓精 ${c.精液摄入.吞精次数} 次、共计 ${c.精液摄入.累计毫升}ml（当前口内残留 ${sp.口内毫升 || 0}ml）。`));
        }

        if (Number(c.自慰) > 0) items.push(mk(`💎 自慰：「累计${c.自慰}次」`, `【空虚自渎记录】：已累计独自抠弄骚逼自慰 ${c.自慰} 次。`));

        const ctrlStr = joinNonZero(c.失控, "次");
        if (ctrlStr) items.push(mk(`💎 失控与排泄：「${ctrlStr}」`, `【潮吹与失禁记录】：累计发生潮吹喷水 ${c.失控?.喷潮 || 0} 次、漏尿失禁 ${c.失控?.失禁 || 0} 次。`));

        const expParts = [];
        if (c.暴露?.露出 > 0) expParts.push(`露出${c.暴露.露出}次`);
        if (c.暴露?.被围观人次 > 0) expParts.push(`被围观${c.暴露.被围观人次}人次`);
        if (c.暴露?.被拍摄 > 0) expParts.push(`被拍摄${c.暴露.被拍摄}次`);
        if (expParts.length) items.push(mk(`💎 暴露与围观：「${expParts.join("／")}」`, `【公开羞辱记录】：身体已累计当众露出 ${c.暴露?.露出 || 0} 次，被围观 ${c.暴露?.被围观人次 || 0} 人次。`));

        const tradeStr = joinNonZero(c.交易, "次");
        if (tradeStr) items.push(mk(`💎 接客与流转：「${tradeStr}」`, `【风月卖身总账】：作为出租屋暗娼，已累计张开双腿接客卖身 ${c.交易?.接客卖身 || 0} 次，被外借共享 ${c.交易?.被外借共享 || 0} 次。`));

        const punishParts = [];
        if (c.调教代价?.挨罚 > 0) punishParts.push(`挨罚${c.调教代价.挨罚}次`);
        if (c.调教代价?.穿环打孔 > 0) punishParts.push(`穿环${c.调教代价.穿环打孔}枚`);
        if (c.调教代价?.项目完成 > 0) punishParts.push(`完成${c.调教代价.项目完成}项`);
        if (punishParts.length) items.push(mk(`💎 调教代价：「${punishParts.join("／")}」`, `【受虐与改造账单】：累计挨罚 ${c.调教代价?.挨罚 || 0} 次，穿环 ${c.调教代价?.穿环打孔 || 0} 枚。`));

        if (Number(c.泌乳?.累计毫升) > 0 || Number(c.泌乳?.被吸饮) > 0) {
            items.push(mk(`💎 泌乳：「${c.泌乳.累计毫升}ml／被吸${c.泌乳.被吸饮}次」`, `【泌乳记录】：累计分泌乳汁 ${c.泌乳.累计毫升}ml，被吸饮 ${c.泌乳.被吸饮} 次。`));
        }

        if (Number(c.群交?.轮奸) > 0) {
            items.push(mk(`💎 群交与轮奸：「轮奸${c.群交.轮奸}次／最多${c.群交.单次最多人数}人」`, `【多人蹂躏记录】：累计经历 ${c.群交.轮奸} 场多人交欢。`));
        }

        const sleepStr = joinNonZero(c.无防备, "次");
        if (sleepStr) items.push(mk(`💎 无防备使用：「${sleepStr}」`, `【睡奸与昏迷使用】：睡眠中被使用 ${c.无防备?.睡眠中 || 0} 次，昏迷中被使用 ${c.无防备?.昏迷中 || 0} 次。`));

        const kpiDone = Number(c.今日KPI?.已完成) || 0, kpiMax = Number(c.今日KPI?.配额) || 2;
        items.push(mk(`📋 今日KPI配额：${kpiDone}/${kpiMax}项`, `【今日接客营业配额】：今日已完成接客配额 ${kpiDone} 单（每日目标 ${kpiMax} 单）。${kpiDone >= kpiMax ? "今日接客指标已全部完成，子宫已被彻底灌饱！" : "今日还差接客指标尚未完成，稍微清洗换完床单后还需继续张腿迎客！"}`));
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

    // 独立副 API 自动更新变量功能
    async function triggerExternalApiUpdate(manualFloorId = null) {
        if (!userSettings.apiUrl || !userSettings.apiKey) {
            if (manualFloorId !== null) alert("请先在设置中填写副 API 地址 (URL) 和 API Key！");
            return;
        }
        const ctx = safeCtx(), chat = ctx?.chat || [];
        if (!chat.length) return;
        const fid = manualFloorId !== null ? manualFloorId : (chat.length - 1);
        const targetMsg = chat[fid];
        const rawText = targetMsg?.mes || "";
        if (!rawText) return;

        const btn = document.getElementById("st-v12-api-test");
        if (btn) btn.textContent = "⏳ 正在请求副API分析更新...";

        try {
            const u = ctx?.name1 || "伊一";
            const sysPrompt = `你是状态栏后台变量更新引擎。请根据最新故事正文，结合当前变量JSON，仅输出 <UpdateVariable>...</UpdateVariable> 块（内含若干行 _.set('${u}.路径', 新值); 语句），不要输出任何其他解释！\n当前变量：\n${JSON.stringify(curVars)}`;
            const res = await fetch(userSettings.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userSettings.apiKey}` },
                body: JSON.stringify({
                    model: userSettings.apiModel || "gpt-4o-mini",
                    messages: [
                        { role: "system", content: sysPrompt },
                        { role: "user", content: `主角：${u}\n最新正文：\n${rawText.slice(0, 3500)}\n请输出 <UpdateVariable> 块：` }
                    ],
                    temperature: 0.2
                })
            });
            const data = await res.json();
            const reply = data?.choices?.[0]?.message?.content || "";
            if (reply.includes("_.set(")) {
                if (targetMsg && !targetMsg.mes.includes(reply.trim())) {
                    targetMsg.mes += `\n<UpdateVariable>\n${reply.replace(/<\/?UpdateVariable>/gi, "").trim()}\n</UpdateVariable>`;
                }
                recalc();
                cleanDOM(fid);
                if (btn) btn.textContent = "✅ 副API同步成功！";
            } else {
                if (btn) btn.textContent = "⚠️ 未返回有效 _.set";
            }
        } catch (err) {
            if (btn) btn.textContent = "❌ 请求失败: " + (err.message || "网络错误");
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
        box.innerHTML = `
            <div style="background:${tc.card};border:1px solid ${tc.border};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">🎨 1. 状态栏主题样式切换（5套皮肤）</div>
                <div id="st-v12-themes" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"></div>
            </div>
            <div style="background:${tc.card};border:1px solid ${tc.border};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;">
                <div style="font-weight:bold;color:${tc.prim};font-size:13.5px;">📐 2. 窗口尺寸与字号（也可直接用鼠标拉面板右/下边缘或右下角◢缩放）</div>
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
                <input id="st-api-url" type="text" placeholder="API 地址，如 https://api.openai.com/v1/chat/completions" value="${userSettings.apiUrl || ""}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                <input id="st-api-key" type="password" placeholder="API Key (sk-...)" value="${userSettings.apiKey || ""}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
                <input id="st-api-mod" type="text" placeholder="模型名称，如 gpt-4o-mini / deepseek-chat" value="${userSettings.apiModel || ""}" style="background:#11111b;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;font-size:12px;">
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

        box.querySelector("#st-v12-api-save").onclick = () => {
            userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
            userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
            userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
            userSettings.apiModel = box.querySelector("#st-api-mod").value.trim();
            saveSettings(); inSettings = false; renderBody();
        };
        box.querySelector("#st-v12-api-test").onclick = () => {
            userSettings.apiSyncEnabled = box.querySelector("#st-api-chk").checked;
            userSettings.apiUrl = box.querySelector("#st-api-url").value.trim();
            userSettings.apiKey = box.querySelector("#st-api-key").value.trim();
            userSettings.apiModel = box.querySelector("#st-api-mod").value.trim();
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
                const sumText = cat.summary || `共 ${cat.items.length} 项详细重口实况`;
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
            <div id="st-v5-header" title="按住标题栏可拖动窗口" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.12);cursor:grab;user-select:none;touch-action:none;flex-shrink:0;">
                <b id="st-v5-title" style="color:#f5c2e7;font-size:13.5px;">主角档案</b>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button id="st-v5-cfg-btn" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.25);border-radius:8px;padding:2px 9px;cursor:pointer;font-size:12px;font-weight:bold;">⚙️ 设置/主题</button>
                    <span id="st-v5-close" style="cursor:pointer;color:#f38ba8;font-size:16px;font-weight:bold;padding:0 5px;">✕</span>
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
                if (e.target.closest("#st-v5-close") || e.target.closest("#st-v5-cfg-btn")) return;
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
                handleEl.style.cursor = "grab";
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

    function extractText(txt, fid) {
        if (!txt || (!txt.includes("状态栏") && !txt.includes("[[角色档案]]"))) return null;
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
            const sm = l.match(/^(?:[#*\-\s]*)\[\[\s*(.+?)\s*\]\](?:[*]*)$/);
            if (sm) {
                let title = sm[1].trim();
                if (title.includes("服装") || title.includes("着装")) title = "服装与道具";
                cur = { title, icon: ICONS[title] || "📁", items: [] };
                cats.push(cur);
                lastItem = null;
                return;
            }
            const im = l.match(/^(?:->|→|-＞|＞|[-•·])\s*(.+?)\s*[|｜]\s*(.+)$/);
            if (im && cur) {
                const rawKey = im[1].replace(/\*\*/g, "").trim();
                const desc = im[2].trim();
                lastItem = { rawKey, desc, ...fmtKey(rawKey) };
                cur.items.push(lastItem);
            } else if (lastItem && !l.startsWith("【") && !l.startsWith("_.set") && !l.startsWith("<")) {
                lastItem.desc += "\n" + l;
            }
        });

        // 自动从 AI 写的状态栏文本中同步数值到变量库（即使某层楼没有 <UpdateVariable> 也能同步数值！）
        if (cats.length) {
            cats.forEach(c => {
                c.items.forEach(it => {
                    const k = it.rawKey;
                    const m100 = k.match(/(\d+)\s*\/\s*100/);
                    if (m100) {
                        const vNum = parseInt(m100[1], 10);
                        if (k.includes("肉棒")) curVars.核心数值.对肉棒好感度 = vNum;
                        else if (k.includes("性欲")) curVars.核心数值.性欲程度 = vNum;
                        else if (k.includes("淫乱") || k.includes("恶堕")) curVars.核心数值.淫乱恶堕 = vNum;
                        else if (k.includes("羞耻")) curVars.精神与心理.羞耻度 = vNum;
                        else if (k.includes("服从")) curVars.精神与心理.服从度 = vNum;
                        else if (k.includes("沦陷")) curVars.精神与心理.沦陷度 = vNum;
                        else if (k.includes("快感")) curVars.精神与心理.快感累积 = vNum;
                        else if (k.includes("清醒")) curVars.精神与心理.意识清醒度 = vNum;
                        else if (k.includes("崩解")) curVars.精神与心理.人格崩解度 = vNum;
                        else if (k.includes("体力")) curVars.身体.体力 = vNum;
                    }
                    const mOral = k.match(/口\s*(\d+)/); if (mOral) curVars.计数.性交.口 = parseInt(mOral[1], 10);
                    const mVag = k.match(/小穴\s*(\d+)/); if (mVag) curVars.计数.性交.小穴 = parseInt(mVag[1], 10);
                    const mFoot = k.match(/足腿\s*(\d+)/); if (mFoot) curVars.计数.性交.足腿 = parseInt(mFoot[1], 10);
                    const mOrg = k.match(/高潮[：:]\s*(\d+)/); if (mOrg) curVars.计数.高潮.总数 = parseInt(mOrg[1], 10);
                    const mIn = k.match(/内射\s*(\d+)/); if (mIn) { curVars.计数.射精.内射 = parseInt(mIn[1], 10); if (!curVars.体内精液存量.子宫毫升) curVars.体内精液存量.子宫毫升 = 15; }
                    const mOut = k.match(/颜射体外\s*(\d+)/); if (mOut) curVars.计数.射精.颜射体外 = parseInt(mOut[1], 10);
                    const mSw = k.match(/吞精\s*(\d+)/); if (mSw) curVars.计数.精液摄入.吞精次数 = parseInt(mSw[1], 10);
                    const mMl = k.match(/摄入\s*(\d+)\s*ml/i); if (mMl) curVars.计数.精液摄入.累计毫升 = parseInt(mMl[1], 10);
                    const mHk = k.match(/接客卖身\s*(\d+)/); if (mHk) curVars.计数.交易.接客卖身 = parseInt(mHk[1], 10);
                });
            });
            const fetishCat = cats.find(c => c.title === "总性癖");
            if (fetishCat && fetishCat.items.length) {
                curVars.性癖.条目 = fetishCat.items.map(it => {
                    const nmM = it.rawKey.match(/性癖[•·]([^（(]+)/);
                    const brM = it.rawKey.match(/[（(](.*?)[）)]/);
                    const name = nmM ? nmM[1].trim() : "熟练迎合";
                    let origin = it.desc.slice(0, 28), stage = "第二阶段", val = "142/200";
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

    function applySetStatements(text, targetVars) {
        const sReg = /_\.set\(\s*(['"`])(.*?)\1\s*,\s*([\s\S]*?)\)\s*(?:;|\n|$)/g;
        let sm;
        while ((sm = sReg.exec(text)) !== null) {
            try {
                const val = Function(`"use strict";return (${sm[3].trim()});`)();
                const ps = sm[2].trim().split(".");
                if (ps.length > 1) ps.shift();
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

    // 深度融合：保留 AI 当回合写的文本，并自动把 V12 新增的 10 大分类与 50+ 重口部位全部补齐！
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

    // 全方位彻底隐藏正文里的【状态栏】与 _.set（支持跨 <p> 段落与流式输出实时隐藏）
    function cleanDOM(id) {
        const el = document.querySelector(`.mes[mesid="${id}"] .mes_text`);
        if (!el) return;
        let h = el.innerHTML;
        let changed = false;

        if (/&lt;\/?game&gt;|<\/?game>/i.test(h)) {
            h = h.replace(/&lt;\/?game&gt;|<\/?game>/gi, "");
            changed = true;
        }
        if (/UpdateVariable|_\.set\s*\(/i.test(h) && !h.includes("st-hidden-uv")) {
            h = h.replace(/(?:&lt;|<)UpdateVariable(?:&gt;|>)[\s\S]*?(?:&lt;|<)\/UpdateVariable(?:&gt;|>)/gi, m => `<div class="st-hidden-uv" style="display:none!important">${m}</div>`)
                 .replace(/<p>\s*(?:_\.set\([\s\S]*?\)\s*;?\s*(?:<br\s*\/?>|\n)*)+<\/p>/gi, m => `<div class="st-hidden-uv" style="display:none!important">${m}</div>`)
                 .replace(/_\.set\(\s*['"`][\s\S]*?\)\s*;?\s*(?:<br\s*\/?>)?/gi, m => `<span class="st-hidden-uv" style="display:none!important">${m}</span>`);
            changed = true;
        }

        const rawMes = safeCtx()?.chat?.[Number(id)]?.mes || "";
        if ((h.includes("【状态栏") || h.includes("[[角色档案]]") || rawMes.includes("状态栏")) && !h.includes("st-ext-inline-trigger")) {
            h = h.replace(/<details[^>]*>\s*<summary>[^<]*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】/gi, m => `<div style="display:none!important">${m}</div>`)
                 .replace(/(?:<p>\s*)?【\s*状态栏[\s\S]*?【\s*\/\s*状态栏\s*】(?:\s*<\/p>)?/gi, m => `<div style="display:none!important">${m}</div>`)
                 .replace(/【\s*状态栏[\s\S]*$/gi, m => `<div style="display:none!important">${m}</div>`);
            h += `<div class="st-ext-inline-trigger" data-floor="${id}" style="display:inline-flex;margin-top:8px;padding:5px 14px;background:rgba(243,139,168,0.2);border:1px solid #f38ba8;border-radius:99px;color:#f5c2e7;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(243,139,168,0.25);">👑 查看此层 (#${id}) 状态栏</div>`;
            changed = true;
        }
        if (changed) el.innerHTML = h;
    }

    function cleanAll() {
        document.querySelectorAll(".mes").forEach(e => {
            const i = e.getAttribute("mesid");
            if (i !== null) cleanDOM(i);
        });
    }

    function recalc() {
        try {
            const ctx = safeCtx(), fv = getInitialVars();
            curVars = fv;
            let last = null, latestChatText = "";
            (ctx?.chat || []).forEach((m, i) => {
                const t = m?.mes || "";
                if (t) latestChatText = t;
                const ex = extractText(t, i);
                if (ex) last = ex;
                if (t.includes("_.set(")) applySetStatements(t, fv);
            });
            latestStatus = mergeStatusWithVars(last, getFallbackData(latestChatText));
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
        eventSource.on(event_types.CHAT_CHANGED, () => { activeCat = null; latestStatus = null; setTimeout(() => { recalc(); cleanAll(); }, 200); });
        eventSource.on(event_types.MESSAGE_RECEIVED, i => setTimeout(() => {
            recalc(); cleanDOM(i);
            if (userSettings.apiSyncEnabled) triggerExternalApiUpdate(i);
        }, 120));
        eventSource.on(event_types.MESSAGE_UPDATED, i => setTimeout(() => { recalc(); cleanDOM(i); }, 100));
        eventSource.on(event_types.MESSAGE_DELETED, () => setTimeout(() => { recalc(); cleanAll(); }, 100));
        eventSource.on(event_types.GENERATION_STARTED, recalc);
    }

    // 实时监控聊天区 DOM 变动，确保任何时候状态栏源码与 _.set 都不会裸露在正文里
    const chatEl = document.getElementById("chat");
    if (chatEl) {
        const obs = new MutationObserver(() => cleanAll());
        obs.observe(chatEl, { childList: true, subtree: true });
    }

    setTimeout(() => { recalc(); cleanAll(); }, 300);
})();