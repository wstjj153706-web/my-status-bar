// == 状态栏 1.0 · 终极圆满完全体 (全按钮描述直译生图版 · 精准外貌识图 · 8大重口恶堕机制 · 手机电脑双端自适应) ==
(function () {
    "use strict";
    const DIAG_ID = "st-v10-diag-radar";
    window.ST_V10_COMPLETE_FLAG = false;
    window.ST_V20_COMPLETE_FLAG = false;

    function showDiagnosticError(title, errObj, extraHint = "") {
        console.error(`[状态栏1.0] ${title}:`, errObj);
        let box = document.getElementById(DIAG_ID);
        if (!box) {
            box = document.createElement("div");
            box.id = DIAG_ID;
            box.style.cssText = "position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:2147483647;width:92vw;max-width:540px;background:linear-gradient(145deg,#450a0a,#1a0005);border:2px solid #ff4d6d;border-radius:14px;padding:12px 16px;color:#ffe5ec;font-family:Consolas,'Microsoft YaHei',monospace;font-size:12.5px;box-shadow:0 12px 40px rgba(255,0,60,0.85);line-height:1.55;word-break:break-all;";
            document.body?.appendChild(box);
        }
        const errMsg = errObj ? (errObj.message || String(errObj)) : "未知错误";
        const stackStr = errObj?.stack ? String(errObj.stack) : "";
        const lineMatch = stackStr.match(/:(\d+):(\d+)/);
        const locInfo = lineMatch ? `第 ${lineMatch[1]} 行，第 ${lineMatch[2]} 列` : "请检查代码是否完整复制";

        box.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,77,109,0.5);padding:0 0 6px 0;margin-bottom:8px;">
                <b style="color:#ffccd5;font-size:14px;">🚨 状态栏 1.0 异常提示</b>
                <button onclick="this.parentElement.parentElement.style.display='none'" style="background:#ff003c;color:#fff;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-weight:bold;">✕</button>
            </div>
            <div><b style="color:#fde047;">模块</b>：${title}</div>
            <div><b style="color:#fde047;">原因</b>：<span style="color:#fca5a5;">${errMsg}</span></div>
            <div><b style="color:#fde047;">位置</b>：<span style="color:#67e8f9;">${locInfo}</span></div>
            ${extraHint ? `<div style="margin-top:4px;color:#a6e3a1;">💡 ${extraHint}</div>` : ""}
        `;
        box.style.display = "block";
    }

    window.addEventListener("error", function (ev) {
        if (ev && (String(ev.filename || "").includes("status-bar") || String(ev.message || "").includes("st-v"))) {
            showDiagnosticError("运行时异常", ev.error || ev.message);
        }
    });

    try {
        const EXT_ID = "my-status-bar";
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

        const HAS_ORIGINAL_DEFAULT_IMG = new Set([
            "当前姿势", "肉体外貌", "cockLove", "lust", "corr", "shame", "obey", "pleas",
            "精神沦陷", "媚药毒瘾", "骚口实况", "胸部实况", "小穴实况", "子宫实况", "阴蒂尿道", "屁眼实况",
            "正字涂鸦", "淫纹烙印", "穿刺环饰", "体内道具", "排卵周期", "受精断面", "精液归属", "孕肚进度",
            "穿搭_头饰", "穿搭_颈部", "穿搭_胸罩", "穿搭_上衣", "穿搭_内裤", "穿搭_下装", "穿搭_丝袜", "穿搭_鞋子"
        ]);

        // =========================================================================
        // 👗 一键换装预设衣柜 & 🔞 8大殿堂级重口恶堕玩法预设库
        // =========================================================================
        const WARDROBE_PRESETS = [
            {
                id: "pure", name: "🌸 端庄原装", durability: 100,
                wear: { 头饰与眼部: "发丝整洁•发饰端庄", 颈部与项圈: "雪颈白皙•衣领齐整", 胸罩与裹胸: "贴身丝质内衬•包裹完好", 上衣与束腰: "外衫整洁•束腰合度", 内裤与遮挡: "干净纯白底裤•严密遮护", 下装与裙裤: "裙摆垂顺•端庄得体", 丝袜与腿部: "修长素腿•并拢端正", 鞋子与玉足: "精致鞋履•步履平稳" }
            },
            {
                id: "lingerie", name: "💦 湿透薄纱睡裙", durability: 65,
                wear: { 头饰与眼部: "汗湿青丝黏颊•眼神迷离", 颈部与项圈: "锁骨裸露•印有浅红吻痕", 胸罩与裹胸: "真空未穿胸衣•乳尖凸起", 上衣与束腰: "半透明蕾丝薄纱吊带睡裙", 内裤与遮挡: "被爱液浸透半透明的蕾丝丁字裤", 下装与裙裤: "睡裙下摆掀起至腰际", 丝袜与腿部: "蕾丝边白色吊带长筒袜", 鞋子与玉足: "赤足踩地•脚趾微蜷" }
            },
            {
                id: "torn_jk", name: "✂️ 撕裂黑丝制服", durability: 25,
                wear: { 头饰与眼部: "发乱如麻•眼角泛泪潮红", 颈部与项圈: "领结扯散•脖颈布满吮痕", 胸罩与裹胸: "胸罩被暴力推至乳肉上方•双峰弹露", 上衣与束腰: "纽扣崩飞的湿透白衬衫", 内裤与遮挡: "被扯到一边大腿根的湿烂底裤", 下装与裙裤: "被撩起弄脏的百褶短裙", 丝袜与腿部: "裆部与大腿被撕开大洞的连裤黑丝", 鞋子与玉足: "只剩一只皮鞋•白浊滴落脚背" }
            },
            {
                id: "rbq_collar", name: "⛓️ 项圈乳环母畜装", durability: 5,
                wear: { 头饰与眼部: "粉红流涎开口环•母猪耳标", 颈部与项圈: "刻有『专用肉便器』铭牌的皮革锁链项圈", 胸罩与裹胸: "全裸爆乳•乳头穿戴银色铃铛乳环", 上衣与束腰: "赤裸上身•小腹画满正字涂鸦", 内裤与遮挡: "皮革贞操带框架（前后穴完全镂空暴露）", 下装与裙裤: "无下装•臀肉印满红巴掌印", 丝袜与腿部: "大腿绑着粉红腿环•顺腿根滴淌白浊", 鞋子与玉足: "四肢着地赤足跪爬" }
            },
            {
                id: "tentacle", name: "🐙 触手活体苗床衣", durability: 0,
                wear: { 头饰与眼部: "粘液缠绕发丝•阿嘿颜翻白眼", 颈部与项圈: "蠕动肉质触手缠绕脖颈", 胸罩与裹胸: "吸盘触手死死吸住双乳榨奶", 上衣与束腰: "半透明催情史莱姆粘液包裹躯干", 内裤与遮挡: "粗大产卵触手堵死前后肉洞", 下装与裙裤: "透明隆起巨肚毫无遮挡", 丝袜与腿部: "粘液藤蔓将双腿固定成M字大开", 鞋子与玉足: "脚踝被触手悬空吊起" }
            }
        ];

        const OBJECTIFICATION_TIERS = [
            { id: "free", label: "🌸 自由身", desc: "保留完整人类尊严与自主行动权。", promptRule: "" },
            { id: "pet", label: "⛓️ 私属契约性奴", desc: "签署绝对服从契约，肉体与高潮权限完全归属饲主支配。", promptRule: "已沦为私属契约性奴，面对支配者必须保持温顺跪姿与讨好敬语。" },
            { id: "whore", label: "🏷️ 挂牌营业娼妇", desc: "明码标价对外挂牌营业，随时准备张开双腿迎接恩客内射。", promptRule: "身为挂牌营业的风俗娼妇，习惯性向男性展示肉体并招揽内射生意。" },
            { id: "cow", label: "🐄 乳牛榨奶家畜", desc: "被剥夺直立行走资格，四肢着地爬行，24小时挂奶器榨乳供精。", promptRule: "已被彻底家畜化为『榨乳母牛』，严禁直立行走，只能四肢着地爬行并随时泌乳供人吸吮。" },
            { id: "wallhole", label: "🕳️ 墙洞固定公用便器", desc: "腰部卡在墙壁隔板中，下半身与肉洞暴露在外供路人免费轮奸排泄。", promptRule: "当前正被固定为『公用肉便器墙洞』，下半身毫无防备地暴露在外，任由任何人随时插入内射与灌尿。" },
            { id: "furniture", label: "🪑 活体肉垫/排泄痰盂", desc: "彻底剥夺人类身份，作为脚凳、坐垫与活体排泄痰盂供人随意踩踏灌精。", promptRule: "已被彻底物化为『活体肉垫家具与排泄痰盂』，四肢固定成M字开腿，主动张嘴与肉洞承接一切体液排泄。" }
        ];

        const PARASITE_TYPES = [
            { type: "无寄生", icon: "✨", desc: "体内洁净，无异种寄生生物。" },
            { type: "催情粉红史莱姆", icon: "🫧", desc: "寄生于阴道与宫腔内壁，吞噬精液并反哺百倍快感，不断分泌拉丝粉红催情粘液。" },
            { type: "深渊吸盘触手幼体", icon: "🐙", desc: "扎根子宫深处，细小触须24小时蠕动吸吮宫颈口与G点，令宿主时刻处于微高潮痉挛。" },
            { type: "产卵魔虫母巢", icon: "🐛", desc: "在宫腔与直肠筑巢，每回合自动产下膨胀透明肉卵撑大腹围，走路偶发排卵失禁。" }
        ];

        const HYPNO_PRESET_LIBRARY = [
            "🔔 听觉钢印：听到打响指声 -> 双腿立刻发软夹紧，括约肌松弛分泌大量爱液",
            "🤰 触觉钢印：被抚摸或按压小腹 -> 子宫口条件反射张开，主动挺腰索求无套内射",
            "👁️ 视觉钢印：与男性对视超过3秒 -> 自动掀起裙摆掰开小穴展示泥泞度并报出内射次数",
            "🧠 常识改写：深信『吞咽雄性精液是唯一补充体力的方式，真空不穿内裤是基本礼仪』",
            "🗣️ 语言钢印：每句话句尾必须带上淫荡喘息与母猪敬语(♡)，无法说出任何拒绝词汇"
        ];

        const BODY_WRITING_STAMPS = [
            "【小腹：内射专用·¥0免费】",
            "【大腿根：正正正正·公用精盆】",
            "【双乳：极品榨奶袋·用力揉】",
            "【臀瓣：后庭全开·欢迎无套】",
            "【锁骨：专属母狗·已盖章】",
            "【额头：脑死发情母猪】"
        ];

        const ORGAN_STAGE_SHAPES = {
            "骚口实况": [
                "双唇紧闭呈娇嫩粉樱色，唇珠饱满水润，小巧的粉舌安静缩在齿列内，咽喉紧窄洁净，连一丝异味或多余唾液都没有。",
                "两片唇瓣被粗暴摩擦得微微充血红肿、泛着湿亮水光，粉嫩舌尖因频繁舔舐而略微发麻外吐，嘴角挂着一缕晶莹粘稠的拉丝唾液。",
                "双唇常年微张合不拢，口腔粘膜熟稔地分泌着大量润滑涎水，舌根已被调教得自然下压平铺成迎接肉棒的肉垫形状，咽喉括约肌明显松弛，深喉时不再干呕。",
                "唇瓣被撑得外翻红肿，两侧腮肉凹陷成贴合阳具的吸盘状，下颚关节呈现习惯性半脱臼酸软；喉管深处被顶撞扩张成宽敞的吞精通道，呼吸间自带咕噜噜的浓精痰音。",
                "嘴巴彻底沦为合不拢的深喉榨精肉壶！肥厚外翻的嘴唇24小时挂着拉丝白浊与口水，软嫩淫舌无力垂在唇外一抽一跳，食道内壁布满蠕动吮吸的肉褶。",
                "【💀100%器质崩坏】上下颚骨彻底脱臼定型为24小时大张的圆形接精漏斗！咽喉与食道完全畸变成毫无阻力的直通肉管，稍一低头胃袋里发酵的浓稠精液与黄水就会顺着烂嘴角哗哗反流喷涌！"
            ],
            "胸部实况": [
                "双峰挺拔紧致，肌肤白腻如凝脂，顶端两颗小巧玲珑的浅粉色乳蕾娇嫩内敛，乳晕极小且干净清爽，未被任何外力揉搓变形。",
                "饱满乳肉上泛着诱人的桃红潮晕，两颗粉红乳头因反复捻弄吮吸而充血挺立、硬如红豆，稍微隔着衣服摩擦就会带来一阵酥麻刺痛。",
                "乳晕在高频揉捏下明显扩大并染上一层熟透的暗粉紫泽，乳头肿大了一圈且敏感得随时勃起，乳腺深处开始发热发胀，挤压乳肉时乳孔会渗出晶莹的甜腻初乳。",
                "双乳被开发得愈发硕大丰满、沉甸甸地晃动，乳皮下隐约可见青紫色的泌乳静脉；粗大的乳头孔洞已被撑开，无需触碰也会随着呼吸一滴滴往外漏出温热乳汁。",
                "彻底堕落为一对沉重下垂的硕大母畜奶袋！紫黑色的宽大乳晕中央顶着两颗拇指粗的肥大乳头，乳腺管完全失控，走路或挨操晃动时便会像花洒一样往外狂飙浓稠淫乳。",
                "【💀100%器质崩坏】双乳彻底畸变成膨胀到极限的巨型紫黑泌乳肉囊！前端乳孔被扩成随时洞开的小肉洞，24小时不受控制地喷溅着混杂催情素与白浊的发情浓奶，把整个胸腹淋得泥泞不堪！"
            ],
            "小穴实况": [
                "两片娇嫩粉润的大阴唇严丝合缝地紧闭成完美的一线天，将内里小巧的浅粉花瓣彻底遮护，穴口紧致得连一根小指都难以探入，处子粘膜干爽纯洁。",
                "原本紧闭的粉嫩花唇已被撑开一道湿润缝隙，小阴唇边缘因反复抽插摩擦而充血红肿、微微向外翻卷，晶莹粘稠的透明爱液正顺着微微张合的穴口拉出长长的淫丝。",
                "两片小阴唇在无数次贯穿下已彻底肥厚外翻、颜色加深成靡丽的紫红色（俗称外翻黑木耳）；阴道内壁的肉褶被粗大肉棒重塑成了死死吸附龟头的形状，哪怕空置时穴口也会一抽一吸地流淌骚水。",
                "阴道括约肌因过度撑扩而重度松弛失守，两片肥厚紫红的阴唇彻底向左右大敞合不拢！直接暴露出里面鲜红湿烂、正呼哧呼哧吸气漏气的宽敞肉洞，浓稠的乳白残精混着淫水像关不紧的水龙头一样顺着大腿根往下淌。",
                "小穴已彻底沦为肉壁脱垂外翻的漏精肉壶！原本藏在里面的层层深红肉壁与吸盘褶皱直接翻卷垂挂在穴口外侧，随便蹲下或走一步路，肚子里发酵的白浊浓浆就会伴随着噗啾的放屁水声大股大股倾泻一地。",
                "【💀100%器质崩坏】小穴括约肌100%断裂报废，彻底畸变成一个拳头大小、永远无法闭合的紫黑烂肉坑！深红色的糜烂内壁与下垂宫颈口完全翻在外面，24小时咕嘟咕嘟往外冒着浓精白沫与腥臭骚水！"
            ],
            "子宫实况": [
                "小腹平坦紧致，深藏在阴道最尽头的处子子宫颈口细小如针尖、紧紧闭合锁死，宫腔内部温暖纯净，是绝对不曾被任何外来体液玷污的生命圣地。",
                "原本紧闭的子宫颈口在粗暴顶撞下充血软化，微微裂开一道贪婪的细缝；宫腔内壁在滚烫浓精的冲刷下阵阵酸麻抽搐，小腹深处泛起挥之不去的微热坠胀感。",
                "子宫颈已被彻底开发成主动张合的『锁精小嘴』！每当龟头抵住花心时，软熟的宫口便会本能地大张并死死吸住马眼，将射入的浓精尽数锁在被撑大的宫腔内温热发酵。",
                "长期超量灌精导致整个子宫腔体肥大扩张、沉甸甸地向下坠落；小腹肉眼可见地像塞了水球一样圆润鼓起，稍微按压肚皮，松弛的宫颈口就会咕嘟一声往外反流溢出一股粘稠白浆。",
                "【重度宫颈脱垂】原本深藏体内的肥厚子宫颈口，因韧带彻底拉伤松弛，已经顺着松垮的阴道一路重度下垂、直接掉到了距离外阴穴口不到两指深的地方！像一张烂熟的海葵大嘴一样在门口一缩一放地讨要肉棒直接插进宫腔。",
                "【💀100%器质崩坏】重度子宫脱垂外翻！整个紫红色的肥大子宫颈口已经彻底掉出体外、悬挂在两腿之间敞开的烂穴口外面！宫腔被撑成毫无弹性的巨型储精皮囊，24小时张着大嘴锁死并腐化每一滴射入的浓精！"
            ],
            "阴蒂尿道": [
                "娇小敏锐的粉嫩阴蒂安静地隐没在薄薄的包皮保护之下，下方的尿道口细小紧闭，括约肌控制力完好，绝不会发生任何失态的漏尿反应。",
                "阴蒂在高频爱抚下已彻底充血挺立、直接从包皮中顶出头来，变成一颗饱满通红的小肉豆；下方的尿道口也跟着一阵阵发酸发麻，稍微碰一下阴蒂就会浑身过电颤抖。",
                "阴蒂已发生明显的器质性肥大勃起，肿大得像一颗熟透的红枣般突兀地顶在两腿之间，连走路时大腿内侧的轻微摩擦都会激起强烈的潮吹冲动，尿道括约肌开始出现松弛迹象。",
                "尿道口已被反复扩张调教得松弛微张，肿大充血的阴蒂神经与排尿中枢彻底粘连短路！只要快感稍一攀升或是小腹受压，松垮的尿道口就会不受控制地喷溅出混合着透明淫水的金黄热尿。",
                "阴蒂已畸变肥大成一根足有小拇指粗细、时刻勃起跳动的『雌性小肉棒』！下方的尿道口更是变成了合不拢的喷泉孔，每一次被视奸或抽插都会伴随大股大股刺鼻骚尿的狂喷失禁。",
                "【💀100%器质崩坏】尿道括约肌100%坏死报废！阴蒂肥大如龟头，下方的尿道口已被彻底扩成第二个可以插入手指与肉棒的敞开肉洞，24小时滴滴答答漏着骚黄尿液与潮吹白沫，彻底沦为漏尿失禁母猪！"
            ],
            "屁眼实况": [
                "臀瓣饱满紧翘，夹在股沟深处的菊穴紧闭成一朵干净小巧的浅粉蕾丝菊花，密布着紧致的放射状细密褶皱，括约肌收缩有力，严密守卫着后庭禁区。",
                "紧窄的菊蕾在异物强行侵入后呈现出明显的充血红肿与细微撕裂感，两瓣白腻臀肉上印着火辣辣的红掌印，肛口粘膜泛着湿滑的肠液与润滑油光泽。",
                "原本紧致的菊花褶皱已被粗暴磨平大半，外括约肌变得松软顺从；即使异物拔出后，红肿的肛口也难以立刻闭合，而是保持着微微张合透气的状态，把排泄的酸胀感完全转化为了快感。",
                "后庭内外括约肌均已重度松弛失效，屁眼被撑成了一个黑乎乎、合不拢的圆洞！不仅能直接窥见里面鲜红湿热的直肠内壁，走动时灌入直肠深处的浓稠精液与肠液更是噗嗤噗嗤地往外漏。",
                "【轻度脱肛翻肉】直肠末端的鲜红粘膜因频繁粗暴抽插而彻底失去支撑，顺着大敞的肛门向外翻卷出一圈肥厚靡丽的『脱肛红肉玫瑰』，沾满白浊泡沫的肠肉在空气中一抽一颤。",
                "【💀100%器质崩坏】重度脱肛崩坏！肛门括约肌彻底断裂，长达数寸的深红色直肠肉管直接从屁眼里脱垂翻出体外，形成一个合不拢的喇叭状排泄肉腔，浊黄肠液与腐败残精24小时顺着外翻的肠管哗哗流淌！"
            ],
            "正字涂鸦": [
                "全身肌肤白皙细腻、光洁如玉，从锁骨、胸乳到平坦小腹与修长双腿，没有任何掌印、鞭痕或下流的墨水涂鸦字迹。",
                "白腻的大腿根与小腹皮肤上印着几道清晰的鲜红巴掌印与指痕，旁边被用粗头黑马克笔画上了屈辱的『正』字记号，汗水一浸便显得格外刺眼。",
                "胸口、肚皮与臀瓣上密密麻麻写满了记录内射与接客次数的『正』字涂鸦，以及『肉便器』『内射专用』等下流淫语，红肿的鞭痕与黑字交错在一起。",
                "体表的正字与羞辱涂鸦已被刺青针深深刺入真皮层，化作永远洗不掉的永久性母畜价目表与正字纹身，每一道疤痕都成了轻轻一摸就发情的敏感带。",
                "全身皮肤布满了滚烫烙铁烫出的『公用精盆』焦黑烙印与凸起肉疤，大腿与肚皮上的正字多得早已叠成一片黑紫色的受虐图腾。",
                "【💀100%器质崩坏】全身表皮已彻底沦为刀刻火烙的烂肉记事本！每一寸皮肉都刻满了深入骨髓的淫贱番号与流脓正字烙痕，痛觉神经100%畸变为绝顶高潮开关！"
            ],
            "淫纹烙印": [
                "下腹皮肤平坦白净、温润光滑，肚脐下方没有任何魔力刻印或催情纹路。",
                "平坦的小腹皮肤下隐约浮现出一道浅粉色的心形微光纹路，每当动情发热时纹路便会微微发烫。",
                "下腹正中央已烙印上一道清晰的紫黑色魅魔淫纹，纹路如同活物般随着子宫的收缩一明一暗地搏动，不断向宫腔输送催情热流。",
                "小腹上的立体淫纹全面盛开并亮起刺眼的妖异紫红荧光，两侧延伸出的荆棘状纹路直接连接至大腿根与阴蒂，将每一次抽插的快感强行放大十倍。",
                "淫纹已发生肉体异化，原本平面的发光纹路凸起成一条条在肚皮下蠕动搏动的粉红肉须血管，只要按压淫纹就会瞬间触发强制子宫高潮与失禁。",
                "【💀100%器质崩坏】整个下腹已被深渊级立体魔蚀淫纹彻底吞噬改造！肚皮化作散发浓烈催情毒雾的紫黑发光魔腹，24小时强制抽取宿主理智转化为无休止的发情淫水！"
            ],
            "穿刺环饰": [
                "乳尖、肚脐与私处花唇均保持着天然纯净的无饰状态，未被任何金属穿刺针洞穿。",
                "充血的乳头与肚脐上刚刚被穿入纤细的纯银小环，创口周围还带着一圈娇嫩的红肿，走路时银环晃动摩擦带来阵阵尖锐的酸麻。",
                "双乳乳头、肥大阴蒂与两侧小阴唇均被穿上了挂着小巧铃铛与坠链的重金属银环，每走一步路腿间与胸口就会发出叮当脆响并拉扯敏感软肉。",
                "全身敏感带已被密密麻麻的金属乳环、阴唇锁扣与长链连成一体，沉重的金属坠子将乳头与外翻阴唇坠得长长变形，一扯锁链便会当场泄身。",
                "粗大的生锈铁环与带刺钢钉直接贯穿了肿烂的乳肉、尿道唇瓣与臀肉，皮肉被沉重的铁索撕裂拉长，金属与流淌白浊的粘膜彻底嵌合。",
                "【💀100%器质崩坏】全身九孔与乳肉已被永久性重型金属拘束铁牢焊死嵌合！无数钢环与扩张铁架直接长进烂肉里，将前后肉洞24小时强行扯开成最大化受精姿态！"
            ],
            "体内道具": [
                "阴道、子宫与后庭内部空荡洁净，没有任何异物或震动玩具塞入。",
                "湿润的蜜穴内塞着一枚嗡嗡低鸣的粉红无线跳蛋，细细的粉色拉绳垂在两片合拢的花唇外侧随着呼吸微微颤动。",
                "前后双穴同时被粗大的仿真硅胶假阳具与震动拉珠死死塞满撑开，强劲的高频震动隔着肚皮都能听见嗡鸣，令双腿酸软得根本站不直。",
                "体内被塞入了直通子宫颈的巨型充气扩张棒与自动抽插榨精机，粗大的硅胶柱体将穴口撑到极限发白，电击贴片不断刺激着内壁括约肌。",
                "活体肉触手或重型多头机械阳具彻底填满了从口腔、小穴到直肠的每一寸腔道，连肚皮都被里面疯狂搅动旋转的粗大异物顶出清晰的凸起轮廓。",
                "【💀100%器质崩坏】内脏与生殖腔已同体内的永久型带刺产卵核心/机械活塞融为一体！24小时全功率高速旋转扩穴并灌注催情营养液，彻底化作半机械活体肉壶！"
            ],
            "排卵周期": [
                "内视下粉嫩的卵巢安静休眠于安全期，没有任何发情迹象，内部环境纯净安详。",
                "进入正常排卵期，卵巢表面微微充血发红，一颗圆润晶莹的成熟卵子刚刚破卵而出滑入输卵管。",
                "受催情素与高潮刺激，双侧卵巢红肿如葡萄串，同时强行排出三四颗发光的亢奋卵子，输卵管剧烈蠕动索精。",
                "排卵机能彻底失控！卵巢肿大如紫红肉瘤并破开无数小孔，像喷射鱼子酱一样无休止地疯狂涌出数百颗卵子填满输卵管！",
                "生殖系统发生异种化变异，卵巢排出的不再是普通卵细胞，而是肉眼可见、布满血丝与魔纹的肉质异形巨卵！",
                "【💀100%器质崩坏】卵巢已彻底融化变异为连接深渊的产卵肉洞，24小时不间断地向子宫涌入漆黑恶臭的魔物腐卵泡，沦为永久下崽通道！"
            ],
            "受精断面": [
                "干净纯粹的宫腔内部仅有一颗晶莹剔透的卵子安静悬浮，没有任何外来精子入侵。",
                "无套内射发生，成千上万活跃的白色精子游动着包围了中央卵子，正拼命钻击卵子外膜。",
                "最粗壮的精子成功钻透卵膜融合，受精卵内部发出受孕红光并长出细小血管，深深扎根着床进肥厚的子宫内膜中。",
                "宫腔内充斥着浓稠乳白的精液海，数十颗卵子同时被受精，密密麻麻扎根在子宫壁上疯狂汲取母体营养。",
                "漆黑带刺的触手状异种精虫粗暴撕裂卵子注入变异毒液，使胚胎瞬间发生恐怖的魔化畸变。",
                "【💀100%器质崩坏】整个子宫内膜已彻底变异为一张巨大蠕动的食肉深渊胎盘，吞噬一切注入的白浊与黑泥，直接从血肉壁上孵化出烂肉瘤球！"
            ],
            "精液归属": [
                "大腿根与下腹干爽洁净，肌肤白皙清透，毫无任何白浊精液沾染。",
                "初次承受射精，大腿根部和肚皮上零星溅落着几缕乳白色的精液，顺着白皙肌肤缓缓滑落。",
                "被狠狠内射灌满后，过量的浓稠精液正从合不拢的红肿穴口中大量涌出，在双腿间拉出长长的淫靡白丝。",
                "浑身每一寸皮肤都被厚厚的半干涸精液泥浆包裹糊满，结出层层白痂，散发着强烈的石楠花腥臭。",
                "皮肤发生海绵化吸精异变！表面毛孔张开直接将附着的精液吸入皮下组织，使肌肤下浮现出乳白色精斑与发光白脉。",
                "【💀100%器质崩坏】下半身细胞彻底被精液同化替换！皮肉半融化与无尽白浊融合为一滩咕嘟冒泡向外渗水的白浊烂肉史莱姆！"
            ],
            "孕肚进度": [
                "小腹平坦紧致，腰身纤细轻盈，有着健康的马甲线线条，毫无赘肉与隆起。",
                "平坦的小腹下方出现了一道温和圆润的微凸弧线，被灌入的精液或早期孕相撑得微微发酸。",
                "肚子已经像吹气的气球一样高高挺起，肚皮被撑得光滑发亮、肚脐外凸，皮下隐约可见青筋。",
                "巨腹大到违反人体比例，薄如蝉翼的肚皮表面恐怖地凸出无数只小手小脚或触手的清晰轮廓，正在里面疯狂挣扎踢踹！",
                "因无数次极限灌精与生育，肚子彻底丧失弹性，像装满水袋的重型肉囊般松垮下垂至大腿根，布满紫红撕裂妊娠纹。",
                "【💀100%器质崩坏】腹部皮肤发生完全透明化病变！化作一个巨大的透明薄膜包囊，可直接看见内部翻滚的浓精黑水与蠕动的异种幼体！"
            ]
        };

        // =========================================================================
        // 📦 千图极限抗压引擎
        // =========================================================================
        const IDB_NAME = "st_status_bar_v27_img_db";
        const IDB_STORE = "images_dataurl";
        const IDB_META_STORE = "pool_meta_store";
        const LRU_MAX_BYTES_ITEMS = 600;
        const importedImgCache = new Map();
        const dbKeyIndexSet = new Set();
        const deadPhysicalUrlSet = new Set();

        function normalizeImgKey(rawName) {
            if (!rawName) return "";
            let s = String(rawName).split(/[\\/]/).pop().trim();
            s = s.replace(/\.(?:png|webp|gif|jpg|jpeg|avif|bmp)$/i, "").trim();
            s = s.replace(/[-_\s]*([1-6])$/, "_$1");
            return s.toLowerCase();
        }

        function isProtectedOriginalDefaultKey(normKey) {
            const k = String(normKey || "").toLowerCase();
            if (!k || k.includes("isolated") || k.includes("cache") || k.startsWith("global_pin_") || k.startsWith("fav_img_") || k.startsWith("cg_snap_") || k.startsWith("pool_")) return false;
            const baseName = k.replace(/[-_\s]*[1-6]$/, "");
            return Array.from(HAS_ORIGINAL_DEFAULT_IMG).some(std => std.toLowerCase() === baseName);
        }

        function extractStageNumFromKey(keyStr) {
            const s = String(keyStr || "").toLowerCase();
            if (!s) return 0;
            const mPool = s.match(/(?:pool|isolated|pin)[^_]*_[^_]+_([1-6])(?:_|$)/);
            if (mPool) return parseInt(mPool[1], 10);
            const mEnd = s.match(/_([1-6])(?:_m\d+|\.[a-z]+)?$/);
            if (mEnd) return parseInt(mEnd[1], 10);
            return 0;
        }

        function setLruImg(normKey, dataUrl) {
            if (!normKey || !dataUrl) return;
            if (importedImgCache.has(normKey)) importedImgCache.delete(normKey);
            importedImgCache.set(normKey, dataUrl);
            if (importedImgCache.size > LRU_MAX_BYTES_ITEMS) {
                for (const oldestKey of importedImgCache.keys()) {
                    if (!isProtectedOriginalDefaultKey(oldestKey)) {
                        importedImgCache.delete(oldestKey);
                        break;
                    }
                }
            }
            dbKeyIndexSet.add(normKey);
        }

        let _sharedDbPromise = null;
        const _pendingDbFetches = new Set();

        function openImageDB() {
            if (_sharedDbPromise) return _sharedDbPromise;
            _sharedDbPromise = new Promise((resolve, reject) => {
                if (!window.indexedDB) {
                    _sharedDbPromise = null;
                    return reject(new Error("不支持IndexedDB"));
                }
                const req = indexedDB.open(IDB_NAME, 2);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
                    if (!db.objectStoreNames.contains(IDB_META_STORE)) db.createObjectStore(IDB_META_STORE);
                };
                req.onsuccess = (e) => {
                    const db = e.target.result;
                    db.onclose = () => { _sharedDbPromise = null; };
                    db.onversionchange = () => { db.close(); _sharedDbPromise = null; };
                    resolve(db);
                };
                req.onerror = (e) => {
                    _sharedDbPromise = null;
                    reject(e.target.error);
                };
            });
            return _sharedDbPromise;
        }

        async function fetchImageAsyncFromDB(rawKey) {
            const nk = normalizeImgKey(rawKey);
            if (!nk || !dbKeyIndexSet.has(nk)) return "";
            if (importedImgCache.has(nk)) return importedImgCache.get(nk);
            if (_pendingDbFetches.has(nk)) return "";
            _pendingDbFetches.add(nk);
            try {
                const db = await openImageDB();
                const tx = db.transaction(IDB_STORE, "readonly");
                const req = tx.objectStore(IDB_STORE).get(nk);
                return await new Promise(res => {
                    req.onsuccess = () => {
                        _pendingDbFetches.delete(nk);
                        const val = req.result;
                        if (typeof val === "string" && (val.startsWith("data:") || val.startsWith("http") || val.startsWith("/"))) {
                            setLruImg(nk, val);
                            res(val);
                        } else {
                            dbKeyIndexSet.delete(nk);
                            res("");
                        }
                    };
                    req.onerror = () => {
                        _pendingDbFetches.delete(nk);
                        res("");
                    };
                });
            } catch (e) {
                _pendingDbFetches.delete(nk);
                return "";
            }
        }

        function queryImportedImage(rawKey) {
            if (!rawKey) return "";
            const s = String(rawKey);
            if (s.startsWith("data:") || s.startsWith("http") || s.startsWith("blob:") || s.startsWith("/")) return s;
            const nk = normalizeImgKey(s);
            if (importedImgCache.has(nk)) {
                const v = importedImgCache.get(nk);
                importedImgCache.delete(nk);
                importedImgCache.set(nk, v);
                return v;
            }
            if (dbKeyIndexSet.has(nk)) {
                fetchImageAsyncFromDB(nk).catch(() => {});
            }
            return "";
        }

        function calcImageDBSizeMB() {
            let totalBytes = 0;
            importedImgCache.forEach(val => { if (typeof val === "string") totalBytes += val.length; });
            return (totalBytes / (1024 * 1024)).toFixed(2);
        }

        async function rawSaveDataUrlToDB(customKey, dUrl) {
            if (!dUrl) return null;
            const normKey = normalizeImgKey(customKey);
            const db = await openImageDB();
            const tx = db.transaction(IDB_STORE, "readwrite");
            tx.objectStore(IDB_STORE).put(dUrl, normKey);
            setLruImg(normKey, dUrl);
            return new Promise((resolve, reject) => {
                tx.oncomplete = () => resolve({ normKey, dUrl });
                tx.onerror = (e) => reject(e.target.error);
            });
        }

        let isGeneratingImageBusy = false;
        let isBatchGeneratingAll = false;

        async function saveSingleImageToDB(customKey, fileObj) {
            const dUrl = await blobToDataUrl(fileObj, fileObj.name || "img.webp");
            if (!dUrl) throw new Error("图片转码失败");
            return rawSaveDataUrlToDB(customKey, dUrl);
        }

        async function loadAllImportedImagesToMemory() {
            try {
                const db = await openImageDB();
                const tx = db.transaction(IDB_STORE, "readonly");
                const store = tx.objectStore(IDB_STORE);
                const keysReq = store.getAllKeys();
                const keys = await new Promise(res => {
                    keysReq.onsuccess = () => res(keysReq.result || []);
                    keysReq.onerror = () => res([]);
                });
                dbKeyIndexSet.clear();
                const warmKeys = [];
                keys.forEach(rawK => {
                    const nk = normalizeImgKey(rawK);
                    if (!nk) return;
                    dbKeyIndexSet.add(nk);
                    if (isProtectedOriginalDefaultKey(nk) || warmKeys.length < LRU_MAX_BYTES_ITEMS) {
                        warmKeys.push(nk);
                    }
                });
                await Promise.all(warmKeys.slice(0, LRU_MAX_BYTES_ITEMS).map(k => fetchImageAsyncFromDB(k)));
                return dbKeyIndexSet.size;
            } catch (e) { return 0; }
        }

        function blobToDataUrl(blob, fileName = "") {
            return new Promise((resolve) => {
                if (/\.gif$/i.test(fileName) || blob.type === "image/gif" || blob.size < 220 * 1024) {
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
                        const maxDim = 640;
                        let w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
                        if (w > maxDim || h > maxDim) {
                            if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
                            else { w = Math.round(w * (maxDim / h)); h = maxDim; }
                        }
                        const cvs = document.createElement("canvas");
                        cvs.width = w; cvs.height = h;
                        cvs.getContext("2d").drawImage(img, 0, 0, w, h);
                        resolve(cvs.toDataURL("image/webp", 0.82));
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
            if (eocdPos === -1) throw new Error("无效的 ZIP 文件");
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
                if (!(flags & 0x0800) && fileName.includes("\uFFFD") && gbkDecoder) fileName = gbkDecoder.decode(nameBytes);
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
                        if (key && dUrl) itemsToSave.push({ key, dUrl, rawFileName: zItem.name });
                    }
                } else if (/\.(?:png|webp|gif|jpg|jpeg|avif|bmp)$/i.test(f.name) || f.type.startsWith("image/")) {
                    const dUrl = await blobToDataUrl(f, f.name);
                    const key = normalizeImgKey(f.name);
                    if (key && dUrl) itemsToSave.push({ key, dUrl, rawFileName: f.name });
                }
            }
            if (!itemsToSave.length) return 0;
            const db = await openImageDB();
            const tx = db.transaction(IDB_STORE, "readwrite");
            const store = tx.objectStore(IDB_STORE);
            itemsToSave.forEach(({ key, dUrl }) => {
                store.put(dUrl, key);
                setLruImg(key, dUrl);
            });
            await new Promise((resolve, reject) => {
                tx.oncomplete = () => resolve(itemsToSave.length);
                tx.onerror = (e) => reject(e.target.error);
            });

            const uName = detectProtagonistName(curVars) || "角色";
            for (const item of itemsToSave) {
                const base = String(item.rawFileName || "").replace(/\.(?:png|webp|gif|jpg|jpeg|avif|bmp)$/i, "").trim();
                const matchPart = base.match(/^(.+?)[-_\s]+([1-6])(?:[-_\s]+(.+))?$/);
                if (matchPart) {
                    const partKey = matchPart[1].trim();
                    const stgNum = parseInt(matchPart[2], 10);
                    const extraTag = (matchPart[3] || "").trim();
                    if (extraTag || stgNum > 1 || !HAS_ORIGINAL_DEFAULT_IMG.has(partKey)) {
                        await registerImageToReusablePool(partKey, stgNum, item.dUrl, uName, { customWearSig: extraTag });
                    }
                }
            }
            return itemsToSave.length;
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
            } catch (e) {}
            return {};
        }

        function queueSilentChangeForNextTurn(changeDesc) {
            if (!changeDesc) return;
            curVars.待同步场外变动 = Array.isArray(curVars.待同步场外变动) ? curVars.待同步场外变动 : [];
            if (!curVars.待同步场外变动.includes(changeDesc)) {
                curVars.待同步场外变动.push(changeDesc);
                if (curVars.待同步场外变动.length > 12) curVars.待同步场外变动.shift();
            }
        }

        function dispatchDirectorActionToChat(actionNarrative) {
            if (!actionNarrative) return;
            queueSilentChangeForNextTurn(actionNarrative.replace(/^\*|\*$/g, ""));
            saveChatCache(curVars);

            if (!userSettings.directorSendToChat) return;
            try {
                const ta = document.getElementById("send_textarea");
                if (!ta) return;
                const curVal = String(ta.value || "").trim();
                ta.value = curVal ? `${curVal}\n${actionNarrative}` : actionNarrative;
                ta.dispatchEvent(new Event("input", { bubbles: true }));
            } catch (e) {}
        }

        let audioCtx = null;
        function playSynthSound(type = "squelch") {
            if (!userSettings.enabled || !userSettings.soundEnabled) return;
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === "suspended") audioCtx.resume();
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.onended = () => {
                    try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                };
                if (type === "squelch") {
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(190, now);
                    osc.frequency.exponentialRampToValueAtTime(520, now + 0.09);
                    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
                    gain.gain.setValueAtTime(0.14, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
                    osc.start(now); osc.stop(now + 0.2);
                } else if (type === "spurt") {
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(340, now);
                    osc.frequency.exponentialRampToValueAtTime(720, now + 0.12);
                    osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);
                    gain.gain.setValueAtTime(0.18, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.29);
                    osc.start(now); osc.stop(now + 0.3);
                }
            } catch (e) {}
        }

        const undoHistoryStack = [];
        function pushUndoSnapshot(varsObj) {
            try {
                if (varsObj && typeof varsObj === "object") {
                    varsObj.玩法扩展状态 = {
                        hypnoTriggers: Array.isArray(userSettings.hypnoTriggers) ? [...userSettings.hypnoTriggers] : [],
                        parasiteState: userSettings.parasiteState ? { ...userSettings.parasiteState } : { type: "无寄生", lv: 0, eggCount: 0 },
                        objectificationId: userSettings.objectificationId || "free",
                        edgingLockActive: Boolean(userSettings.edgingLockActive),
                        clothDurability: safeNum(userSettings.clothDurability, 100)
                    };
                }
                const snapStr = JSON.stringify(varsObj);
                if (undoHistoryStack.length > 0 && undoHistoryStack[undoHistoryStack.length - 1] === snapStr) return;
                undoHistoryStack.push(snapStr);
                if (undoHistoryStack.length > 5) undoHistoryStack.shift();
            } catch (e) {}
        }

        function performUndoAction() {
            if (!undoHistoryStack.length) {
                showToast("⚠️ 当前没有可撤回的上一步操作！", "warn", 2200);
                return;
            }
            try {
                const prevStr = undoHistoryStack.pop();
                curVars = normalizeVarsStructure(JSON.parse(prevStr));
                _organDevCache = { sig: "", res: null };
                _appearMemoCache = { sig: "", res: null };
                if (curVars.玩法扩展状态) {
                    const ext = curVars.玩法扩展状态;
                    userSettings.hypnoTriggers = Array.isArray(ext.hypnoTriggers) ? [...ext.hypnoTriggers] : [];
                    userSettings.parasiteState = ext.parasiteState ? { ...ext.parasiteState } : { type: "无寄生", lv: 0, eggCount: 0 };
                    userSettings.objectificationId = ext.objectificationId || "free";
                    userSettings.edgingLockActive = Boolean(ext.edgingLockActive);
                    userSettings.clothDurability = safeNum(ext.clothDurability, 100);
                    saveSettings();
                }
                curVars.手动精液调整楼层 = safeCtx()?.chat?.length || 0;
                saveChatCache(curVars);
                latestStatus = getFallbackData();
                renderBody();
                showToast("↩️ 已成功撤回上一步状态与调教修改！", "success", 2400);
            } catch (e) {}
        }

        function computeOdorAndExposureMetrics(v, dev) {
            const sp = v.体内精液存量 || {}, c = v.计数 || {}, mark = v.痕迹与标记 || {};
            const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
            const leakCnt = safeNum(c.失控?.失禁), squirtCnt = safeNum(c.失控?.喷潮), creampie = safeNum(c.射精?.内射);
            const expCnt = safeNum(c.暴露?.露出), watchCnt = safeNum(c.暴露?.被围观人次), photoCnt = safeNum(c.暴露?.被拍摄留影), hookerCnt = safeNum(c.交易?.接客卖身);
            const corr = safeNum(v.核心数值?.淫乱恶堕);

            const rawOdor = Math.round(
                Math.min(45, totalMl * 0.35) +
                Math.min(25, leakCnt * 3 + squirtCnt * 1.5) +
                Math.min(20, creampie * 0.4) +
                (corr >= 60 ? 15 : 0)
            );
            const odorPct = Math.max(0, Math.min(100, rawOdor));
            const odorLabels = ["🌸幽雅体香", "💦微汗雌香", "🥵浓烈情欲香", "🥛石楠花精腥", "💦骚尿白浊腌入味", "☣️十米催情母畜恶臭"];
            const odorStg = odorLabels[tier6(odorPct, false)];

            const hasGraffiti = (mark.公开涂鸦字迹 && mark.公开涂鸦字迹 !== "无") || (mark.体表痕迹 && /正字|肉便器|免费|内射/.test(mark.体表痕迹));
            const rawSocial = Math.round(
                expCnt * 8 + watchCnt * 2.5 + photoCnt * 12 + hookerCnt * 4 +
                (hasGraffiti ? 22 : 0) +
                ((100 - safeNum(userSettings.clothDurability, 100)) * 0.35) +
                (totalMl >= 40 ? 18 : 0)
            );
            const socialPct = Math.max(0, Math.min(100, rawSocial));
            const socialLabels = ["🛡️声誉完好", "👀私下窃语", "📸把柄留影流传", "📡暗网视频疯传", "🚨熟人视奸认出", "💀全城公用便器社死"];
            const socialStg = socialLabels[tier6(socialPct, false)];

            return { odorPct, odorStg, socialPct, socialStg };
        }

        function computeActiveBuffs(v, dev = null) {
            if (!dev) dev = computeAllOrganDevelopments(v);
            const buffs = [];
            const sp = v.体内精液存量 || {};
            const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
            const sta = safeNum(v.身体?.体力, 100);
            const pleas = safeNum(v.精神与心理?.快感累积);
            const lust = safeNum(v.核心数值?.性欲程度);
            const drug = safeNum(v.精神与心理?.媚药精液毒瘾);
            const propStr = safeStr(v.体内道具与权限?.体内道具, "无");
            const mark = v.痕迹与标记 || {};
            const c = v.计数 || {};
            const dryTurns = safeNum(v.断精回合数, 0);
            const { odorPct, odorStg, socialPct, socialStg } = computeOdorAndExposureMetrics(v, dev);

            const pushBuff = (icon, name, color, bg, badge, origin, effect, thought) => {
                buffs.push({ icon, name, color, bg, border: color + "66", badge, origin, effect, thought });
            };

            if (userSettings.edgingLockActive) {
                pushBuff("🔒", `寸止地狱锁(卡99%)`, "#fbbf24", "rgba(245,158,11,0.35)", `已寸止 ${safeNum(c.高潮?.寸止)}次`,
                    "开启了【🔒寸止地狱锁】，快感被强行卡死在 99% 临界点无法泄身！",
                    "无论受到多么剧烈的抽插与玩弄都差最后一丝无法高潮，理智在极度焦躁中濒临崩溃，一旦解锁将触发十连绝顶失禁！",
                    "求求你让我去吧……明明已经到99%了却怎么都去不了，脑子和子宫都要憋疯了呜呜🥵💦！！");
            }
            if (totalMl > 0) {
                pushBuff("🥛", `体内蓄精 ${totalMl}ml`, "#f8fafc", "rgba(255,255,255,0.18)", `总计 ${totalMl}ml`,
                    `由子宫(${safeNum(sp.子宫毫升)}ml)、小穴(${safeNum(sp.小穴毫升)}ml)、胃袋(${safeNum(sp.口内毫升)}ml)、后庭(${safeNum(sp.屁眼毫升)}ml)注入累积。`,
                    "下腹产生明显坠胀感，站立或走动时白浊会顺着腿根滴落，大幅提高暴露风险与持续发情度。",
                    `小肚子里沉甸甸地晃荡着${totalMl}ml滚烫精液，每走一步都怕当众漏出来💦……`);
            }
            if (odorPct >= 30) {
                pushBuff("👃", `${odorStg}(${odorPct}%)`, "#f472b6", "rgba(236,72,153,0.26)", `气味浓度 ${odorPct}%`,
                    `体内囤积白浊(${totalMl}ml)与失禁尿液(${safeNum(c.失控?.失禁)}次)发酵散发的浓郁体味。`,
                    "走过之处留下一股混合着石楠花精腥、甜腻雌香与骚尿味的气息，极易引起周围男性勃起与视奸。",
                    "身上全是浓得洗不掉的精液腥味和骚味……只要靠近别人肯定会被立刻闻出来的😳💦！");
            }
            if (socialPct >= 30) {
                pushBuff("📡", `${socialStg}(${socialPct}%)`, "#38bdf8", "rgba(14,165,233,0.26)", `社死度 ${socialPct}%`,
                    `累计露出 ${safeNum(c.暴露?.露出)} 次、被围观 ${safeNum(c.暴露?.被围观人次)} 人次、被拍摄留影 ${safeNum(c.暴露?.被拍摄留影)} 次。`,
                    "把柄照片或放荡风评已在外流传，路人NPC认出她的概率大幅上升，随时可能遭受当众视奸或要挟。",
                    "那些羞人的照片和风评已经传开了……大家都用那种看肉便器的眼神盯着我看🥵💦……");
            }
            if (userSettings.parasiteState?.lv > 0 && userSettings.parasiteState?.type !== "无寄生") {
                const p = userSettings.parasiteState;
                pushBuff("🐙", `${p.type}(Lv.${p.lv})`, "#c084fc", "rgba(168,85,247,0.32)", `怀卵 ${safeNum(p.eggCount)}颗`,
                    `体内已寄生【${p.type}】，当前处于第 ${p.lv} 阶段活性状态。`,
                    "寄生体在腔道内24小时蠕动吸吮敏感点并分泌催情粘液，持续消耗体力并推高快感与腹围。",
                    `肚子里寄生的【${p.type}】一直在蠕动吸我的花心，连虫卵都把小肚子撑鼓起来了🥵💦❤️！`);
            }
            if (dryTurns >= 3 && (drug >= 30 || safeNum(v.核心数值?.淫乱恶堕) >= 45)) {
                pushBuff("⏳", `断精戒断(${dryTurns}轮)`, "#f43f5e", "rgba(225,29,72,0.35)", "急需灌精",
                    `已连续 ${dryTurns} 轮对话未获得新的精液灌注，体内精液毒瘾与空虚感全面爆发！`,
                    "全身燥热发抖、双腿发软，理智大幅下降，会不顾廉耻地主动贴近索求内射或吞精。",
                    `已经整整 ${dryTurns} 轮没有吃到滚烫的精液了……子宫空虚得快要发疯了，求求快灌满我吧🥵💦❤️！`);
            }
            if (v.本轮失控事件) {
                pushBuff("🎲", v.本轮失控事件, "#fde047", "rgba(234,179,8,0.32)", "生理失控检定失败",
                    "由于体内储精过多或括约肌重度松弛，在本轮日常行动中暗骰检定失败触发当众出丑！",
                    "强制在本轮正文中表现出夹不住白浊滴落或当众漏尿失禁的羞耻细节。",
                    "糟了……明明拼命夹紧双腿了，还是没忍住当场漏出来了😳💦！！");
            }
            if (pleas >= 80 && !userSettings.edgingLockActive) {
                pushBuff("⚡", "濒临绝顶痉挛", "#fde047", "rgba(234,179,8,0.28)", `快感 ${pleas}%`,
                    `当前快感累积已达 ${pleas}%，逼近神经承受临界点。`,
                    "全身肌肉绷紧颤抖、脚趾蜷缩，任何轻微触碰或言语刺激都会立刻触发绝顶潮吹。",
                    "别再碰那里了……只要再刺激一下马上就要高潮喷出来了🥵💦！");
            }
            if (lust >= 70) {
                pushBuff("🔥", "重度发情潮红", "#fda4af", "rgba(225,29,72,0.32)", `性欲 ${lust}%`,
                    `体内情欲值高达 ${lust}%，荷尔蒙严重失衡。`,
                    "脸颊耳根绯红滚烫，呼吸急促湿热，私处自发分泌大量润滑粘液。",
                    "身体烫得厉害，两腿之间湿得一塌糊涂，根本静不下心思考了🥵……");
            }
            if (sta <= 25) {
                pushBuff("🫠", "脱力瘫软", "#fca5a5", "rgba(185,28,28,0.32)", `体力 ${sta}%`,
                    `经历高强度高潮(${safeNum(c.高潮?.总数)}次)或连续折腾，体力彻底透支。`,
                    "双腿酸软无力并拢，失去反抗与站立能力，只能瘫软在原地任由摆布。",
                    "连动一根手指头的力气都没有了……只能这样敞着腿大口喘气💦……");
            }
            if (propStr && propStr !== "无") {
                pushBuff("🎛️", `道具:${propStr.slice(0, 7)}`, "#c4b5fd", "rgba(124,58,237,0.28)", "体内填塞中",
                    `当前体内或体表正穿戴着道具：【${propStr}】。`,
                    "持续不断对敏感粘膜施加物理撑扩与震动刺激，令快感与性欲无法自然消退。",
                    `里面塞着【${propStr}】一直在摩擦震动，根本没办法保持冷静呀😳💦！`);
            }
            if (mark.淫纹与刻印 && mark.淫纹与刻印 !== "无") {
                pushBuff("🔮", "淫纹激活", "#e879f9", "rgba(162,28,175,0.28)", "刻印生效中",
                    `下腹或体表刻有：【${mark.淫纹与刻印}】。`,
                    "淫纹吸收体液与快感后散发微光，成倍放大子宫与私处的神经敏感度。",
                    "小肚子上的纹路在发烫发亮，把每一丝触感都放大了好几倍🥵💦！");
            }
            if (!buffs.length) {
                pushBuff("✨", "身心状态清爽", "#a6e3a1", "rgba(34,197,94,0.2)", "状态完好",
                    "当前体内无残留精液，体力充沛，理智与衣装整洁完好。",
                    "行动自如，能够保持端庄得体的日常姿态与清醒思考。",
                    "现在身体很清爽，一定要好好保持住这份冷静与体面。");
            }
            return buffs;
        }

        let prevSnapshotForDelta = null;
        function computeAndShowDeltaToast(v) {
            if (!userSettings.enabled) return;
            const cur = {
                corr: safeNum(v.核心数值?.淫乱恶堕),
                lust: safeNum(v.核心数值?.性欲程度),
                shame: safeNum(v.精神与心理?.羞耻度, 100),
                sta: safeNum(v.身体?.体力, 100),
                ml: safeNum(v.体内精液存量?.口内毫升) + safeNum(v.体内精液存量?.小穴毫升) + safeNum(v.体内精液存量?.子宫毫升) + safeNum(v.体内精液存量?.屁眼毫升),
                org: safeNum(v.计数?.高潮?.总数)
            };
            if (!prevSnapshotForDelta) { prevSnapshotForDelta = cur; return; }
            const diffs = [];
            if (cur.corr !== prevSnapshotForDelta.corr) diffs.push(`🖤恶堕 ${cur.corr > prevSnapshotForDelta.corr ? "+" : ""}${cur.corr - prevSnapshotForDelta.corr}`);
            if (cur.lust !== prevSnapshotForDelta.lust) diffs.push(`🔥性欲 ${cur.lust > prevSnapshotForDelta.lust ? "+" : ""}${cur.lust - prevSnapshotForDelta.lust}`);
            if (cur.shame !== prevSnapshotForDelta.shame) diffs.push(`😳羞耻 ${cur.shame > prevSnapshotForDelta.shame ? "+" : ""}${cur.shame - prevSnapshotForDelta.shame}`);
            if (cur.sta !== prevSnapshotForDelta.sta) diffs.push(`⚡体力 ${cur.sta > prevSnapshotForDelta.sta ? "+" : ""}${cur.sta - prevSnapshotForDelta.sta}`);
            if (cur.ml !== prevSnapshotForDelta.ml) diffs.push(`💦蓄精 ${cur.ml > prevSnapshotForDelta.ml ? "+" : ""}${cur.ml - prevSnapshotForDelta.ml}ml`);
            if (cur.org > prevSnapshotForDelta.org) diffs.push(`💗高潮 +${cur.org - prevSnapshotForDelta.org}`);
            prevSnapshotForDelta = cur;
            if (diffs.length) showToast(diffs.slice(0, 4).join("  |  "), "info", 3000);
        }

        const RUIN_PERSONA_MODES = {
            evolution: { id: "evolution", label: "🌱 崩坏进化树", short: "进化树", desc: "随恶堕度与器质崩坏度自然从矜持递进至彻底母畜化" },
            despair:   { id: "despair",   label: "💧 彻底绝望型", short: "绝望型", desc: "理智防线崩溃，面对任何对待都只会绝望哭泣、求饶与失禁哀鸣" },
            addicted:  { id: "addicted",  label: "🥵 沉沦变态型", short: "沉沦型", desc: "大脑被快感彻底融化，主动掰开肉洞乞求更粗暴的灌精与改造" },
            contrast:  { id: "contrast",  label: "🎭 日常反差型", short: "反差型", desc: "支持切换【表面端庄伪装态】与【私下漏液母畜态】" }
        };

        function generateLiveASMRQuote(v, u) {
            if (userSettings.edgingLockActive) {
                return `“唔嗯嗯——♡ 为什么偏偏卡在 99% 不让${u}去呀……阴蒂和子宫口都在抽搐发疯了，求求您赐予高潮吧~🥵💦”`;
            }
            const mode = userSettings.personaMode || "evolution";
            const corr = safeNum(v?.核心数值?.淫乱恶堕, 0);
            const customQuotes = userSettings.customAsmrQuotes || {};
            if (customQuotes[mode] && safeStr(customQuotes[mode]).trim()) {
                return safeStr(customQuotes[mode]).replace(/{user}/g, u);
            }
            if (mode === "despair") {
                if (corr < 35) return `“呜……不要再看那里了……求求你放过${u}吧，身体真的会坏掉的……💦”`;
                if (corr < 75) return `“啊嗯……合不拢了……浓精和尿一直在往外漏……${u}已经没法做回普通人了呜呜……🥵💧”`;
                return `“坏掉了……从嘴巴到子宫全都变成漏斗肉洞了……不管被灌进多少都会乖乖吞下去的，别再弄坏我了……♡💦”`;
            }
            if (mode === "addicted") {
                if (corr < 35) return `“哈啊……♡ 好奇怪，明明那么羞人，小穴深处却一直在自己吸紧发抖呢……♡”`;
                if (corr < 75) return `“不够……还要更多♡ 快把宫颈口彻底撞穿吧，把滚烫浓精满满地灌进${u}的肉便器子宫里呀~🥵❤️”`;
                return `“咿呀啊——♡ 脑子全融化在精液里了♡ 请随时随地使用${u}这副彻底松弛外翻的母畜肉洞吧~♡💦”`;
            }
            if (mode === "contrast") {
                if (!userSettings.contrastInnerActive) {
                    return `【🎭表面伪装态】“……有什么事吗？我只是普通地在整理仪容而已……（双腿死死夹紧，生怕裙底塞满精液的肿胀蜜穴滴落白浊被发现💦）”`;
                } else {
                    return `【🥵私下母畜态】“哈啊♡ 终于不用装正经了……快看呀，刚才在外面一直憋着没敢漏出来的骚水和白浊，已经把底裤彻底泡烂啦~♡🥵”`;
                }
            }
            if (corr < 15) return `“呼吸平稳，${u}现在的身心完好如初，必须时刻保持端庄与警惕。”`;
            if (corr < 45) return `“唔……身体稍微有些发烫发软，粘膜深处还残留着让人脸红的酥麻余温呢……💦”`;
            if (corr < 80) return `“哈啊……♡ 子宫口已经被开发成只属于肉棒的形状了，不被灌满浓精的话就静不下心来呀……🥵♡”`;
            return `“啊嘿嘿……♡ 全身的六孔都已经100%改造成专用排泄受精肉坑了……今天也要把${u}灌成鼓鼓的精液泡芙哦~♡💦”`;
        }

        const THEMES = {
            "魅魔粉": {
                cls: "st-theme-succubus",
                bg: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26 38 C26 38 14 28 14 19 C14 14 19 11 26 17 C33 11 38 14 38 19 C38 28 26 38 26 38 Z' fill='none' stroke='rgba(243,139,168,0.09)' stroke-width='1.5'/%3E%3C/svg%3E"), radial-gradient(circle at 85% 12%, rgba(243,139,168,0.34), transparent 48%), linear-gradient(165deg, #27153b 0%, #140b22 68%, #090510 100%)`,
                border: "2px solid #f472b6", radius: "22px", shadow: "0 18px 56px rgba(244,114,182,0.48), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 0 28px rgba(243,139,168,0.18)",
                prim: "#f472b6", sec: "#c084fc", text: "#fdf2f8", sub: "#d8b4fe",
                card: "linear-gradient(145deg, rgba(58,28,84,0.82), rgba(22,12,38,0.92))",
                cardBorder: "1px solid rgba(244,114,182,0.45)", hi: "rgba(244,114,182,0.28)",
                headerBg: "linear-gradient(90deg, rgba(244,114,182,0.32), rgba(192,132,252,0.16))"
            },
            "暗黑血浆": {
                cls: "st-theme-blood",
                bg: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L40 20 M20 0 L20 40 M10 10 L30 30 M30 10 L10 30' stroke='rgba(255,30,66,0.08)' stroke-width='1'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 0%, rgba(220,38,38,0.42), transparent 60%), linear-gradient(170deg, #210309 0%, #0b0103 100%)`,
                border: "2.5px double #ff1e42", radius: "10px", shadow: "0 20px 62px rgba(255,0,43,0.72), inset 0 0 36px rgba(153,27,27,0.6)",
                prim: "#ff2a4b", sec: "#fca5a5", text: "#ffe4e6", sub: "#e295a2",
                card: "linear-gradient(160deg, rgba(56,6,15,0.94), rgba(18,2,5,0.98))",
                cardBorder: "1px solid rgba(255,42,75,0.68)", hi: "rgba(255,42,75,0.36)",
                headerBg: "linear-gradient(90deg, rgba(153,27,27,0.65), rgba(35,4,9,0.88))"
            },
            "白浊深渊": {
                cls: "st-theme-semen",
                bg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='18' cy='18' r='6' fill='rgba(255,255,255,0.07)'/%3E%3Ccircle cx='46' cy='38' r='9' fill='rgba(165,243,252,0.06)'/%3E%3C/svg%3E"), radial-gradient(ellipse at top, rgba(255,255,255,0.28), transparent 55%), linear-gradient(175deg, #0f172a 0%, #1e1b4b 58%, #090d16 100%)`,
                border: "2px solid #a5f3fc", radius: "24px", shadow: "0 18px 54px rgba(165,243,252,0.42), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 28px rgba(255,255,255,0.2)",
                prim: "#67e8f9", sec: "#e0e7ff", text: "#f8fafc", sub: "#cbd5e1",
                card: "linear-gradient(150deg, rgba(30,41,59,0.88), rgba(15,23,42,0.95))",
                cardBorder: "1.5px dashed rgba(165,243,252,0.55)", hi: "rgba(103,232,249,0.28)",
                headerBg: "linear-gradient(90deg, rgba(255,255,255,0.22), rgba(103,232,249,0.2))"
            },
            "赛博调教": {
                cls: "st-theme-cyber",
                bg: `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 18 L36 18 M18 0 L18 36' stroke='rgba(0,245,212,0.09)' stroke-width='1'/%3E%3Crect x='15' y='15' width='6' height='6' fill='none' stroke='rgba(241,91,181,0.14)'/%3E%3C/svg%3E"), linear-gradient(160deg, #020617 0%, #0b162c 100%)`,
                border: "2px solid #00f5d4", radius: "8px", shadow: "0 0 42px rgba(0,245,212,0.58), inset 0 0 24px rgba(241,91,181,0.34)",
                prim: "#00f5d4", sec: "#f15bb5", text: "#e0fbfc", sub: "#90e0ef",
                card: "linear-gradient(135deg, rgba(10,25,47,0.95), rgba(2,12,27,0.98))",
                cardBorder: "1px solid #00f5d4", hi: "rgba(241,91,181,0.36)",
                headerBg: "linear-gradient(90deg, rgba(0,245,212,0.28), rgba(241,91,181,0.28))"
            },
            "鎏金娼馆": {
                cls: "st-theme-brothel",
                bg: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 4 L44 24 L24 44 L4 24 Z' fill='none' stroke='rgba(251,191,36,0.09)' stroke-width='1.2'/%3E%3Ccircle cx='24' cy='24' r='5' fill='none' stroke='rgba(251,191,36,0.09)'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 8%, rgba(251,191,36,0.28), transparent 55%), linear-gradient(165deg, #2b170c 0%, #120804 100%)`,
                border: "2.5px ridge #fbbf24", radius: "16px", shadow: "0 20px 58px rgba(245,158,11,0.48), inset 0 0 28px rgba(251,191,36,0.2)",
                prim: "#fde047", sec: "#fb923c", text: "#fef3c7", sub: "#dfc4a0",
                card: "linear-gradient(155deg, rgba(54,31,16,0.94), rgba(24,12,6,0.98))",
                cardBorder: "1.5px ridge rgba(251,191,36,0.62)", hi: "rgba(251,191,36,0.3)",
                headerBg: "linear-gradient(90deg, rgba(217,119,6,0.42), rgba(69,26,3,0.74))"
            },
            "圣洁琉璃": {
                cls: "st-theme-emerald",
                bg: `radial-gradient(circle at 85% 10%, rgba(52,211,153,0.28), transparent 48%), radial-gradient(circle at 15% 90%, rgba(251,191,36,0.18), transparent 50%), linear-gradient(165deg, #06281f 0%, #031410 68%, #010907 100%)`,
                border: "2px solid #34d399", radius: "20px", shadow: "0 18px 54px rgba(16,185,129,0.42), inset 0 1px 0 rgba(253,224,71,0.28)",
                prim: "#34d399", sec: "#fde047", text: "#ecfdf5", sub: "#a7f3d0",
                card: "linear-gradient(145deg, rgba(10,50,38,0.86), rgba(4,22,17,0.95))",
                cardBorder: "1px solid rgba(52,211,153,0.48)", hi: "rgba(52,211,153,0.26)",
                headerBg: "linear-gradient(90deg, rgba(16,185,129,0.32), rgba(251,191,36,0.18))"
            }
        };

        function injectCustomStyles() {
            if (document.getElementById("st-v10-custom-css")) return;
            const style = document.createElement("style");
            style.id = "st-v10-custom-css";
            style.textContent = `
                UpdateVariable, updatevariable, .st-hidden-uv {
                    display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important;
                }
                @keyframes stPulseGlow {
                    0%, 100% { box-shadow: 0 0 8px rgba(255, 0, 60, 0.75), inset 0 0 4px rgba(255, 255, 255, 0.35); }
                    50% { box-shadow: 0 0 18px rgba(255, 0, 60, 1), 0 0 26px rgba(136, 19, 55, 0.9), inset 0 0 8px rgba(255, 255, 255, 0.65); }
                }
                @keyframes stStage6GodGlow {
                    0%, 100% { box-shadow: 0 0 10px #f59e0b, 0 0 20px #ff0055, inset 0 0 8px #fde047; border-color: #fde047 !important; }
                    50% { box-shadow: 0 0 22px #ff0055, 0 0 36px #7e22ce, inset 0 0 14px #ffffff; border-color: #ff758f !important; }
                }
                @keyframes stCorruptCardPulse {
                    0%, 100% { border-color: #ff0055 !important; box-shadow: 0 0 14px rgba(255, 0, 85, 0.55), inset 0 0 18px rgba(153, 27, 27, 0.45) !important; }
                    50% { border-color: #fde047 !important; box-shadow: 0 0 24px rgba(255, 0, 85, 0.9), inset 0 0 28px rgba(220, 38, 38, 0.75) !important; }
                }
                @keyframes stBarShimmer {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                @keyframes stHeartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.14); }
                }
                @keyframes stOrganSqueeze {
                    0% { transform: scale(1); }
                    40% { transform: scale(0.86, 1.12); }
                    75% { transform: scale(1.06, 0.94); }
                    100% { transform: scale(1); }
                }
                .st-organ-squeeze-anim { animation: stOrganSqueeze 0.42s ease-in-out; transform-origin: center; }

                .st-v28-card {
                    transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s ease, border-color 0.18s ease, filter 0.18s ease !important;
                    position: relative; box-sizing: border-box;
                    backdrop-filter: blur(8px);
                }
                .st-v28-card:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.07);
                    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.65), 0 0 14px rgba(244, 114, 182, 0.28) !important;
                }
                .st-bar-fill {
                    background-size: 200% 100% !important;
                    animation: stBarShimmer 3.2s linear infinite;
                    font-variant-numeric: tabular-nums;
                }
                .st-corrupted-card-lv5 {
                    background-image: radial-gradient(circle at 92% 15%, rgba(225, 29, 72, 0.28), transparent 48%), linear-gradient(155deg, rgba(69, 10, 20, 0.92), rgba(24, 6, 14, 0.96)) !important;
                    border-left: 4.5px solid #ff0055 !important;
                    box-shadow: 0 6px 20px rgba(225, 29, 72, 0.4), inset 0 0 15px rgba(225, 29, 72, 0.22) !important;
                }
                .st-corrupted-card-lv6 {
                    background-image: url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0 Q10 18 8 28 Q6 36 12 44 M28 0 Q32 14 26 26 Q22 36 30 44' fill='none' stroke='rgba(255,0,85,0.14)' stroke-width='2'/%3E%3C/svg%3E"), radial-gradient(circle at 85% 20%, rgba(255, 0, 85, 0.38), transparent 55%), linear-gradient(160deg, rgba(76, 5, 25, 0.96), rgba(15, 2, 8, 0.99)) !important;
                    animation: stCorruptCardPulse 2.2s infinite ease-in-out !important;
                }
                .st-lite-mode, .st-lite-mode * {
                    animation: none !important; backdrop-filter: none !important; transition: none !important;
                }
                .st-theme-succubus .st-v28-card { border-radius: 15px !important; box-shadow: 0 6px 18px rgba(18, 8, 30, 0.58), inset 0 1px 0 rgba(255, 255, 255, 0.14) !important; }
                .st-theme-succubus .st-v28-card::after { content: "❦"; position: absolute; top: 5px; right: 9px; font-size: 11px; color: rgba(244, 114, 182, 0.28); pointer-events: none; }
                .st-theme-blood .st-v28-card { border-left: 4.5px solid #ff003c !important; border-right: 2px solid #7f1d1d !important; border-radius: 6px !important; }
                .st-theme-semen .st-v28-card { border-radius: 18px !important; border-top: 2px solid rgba(255, 255, 255, 0.55) !important; }
                .st-theme-cyber .st-v28-card { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); border-left: 4px solid #f15bb5 !important; border-right: 2px solid #00f5d4 !important; border-radius: 0 !important; }
                .st-theme-brothel .st-v28-card { border: 2px ridge rgba(251, 191, 36, 0.72) !important; border-radius: 12px !important; }
                .st-theme-emerald .st-v28-card { border-radius: 15px !important; border-left: 3.5px solid #34d399 !important; }

                .st-pill-btn {
                    display: inline-flex; align-items: center; justify-content: center; gap: 4px;
                    padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 700;
                    cursor: pointer; border: 1px solid rgba(255,255,255,0.2);
                    background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05));
                    color: #f8fafc; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    backdrop-filter: blur(6px); transition: all 0.15s ease; white-space: nowrap;
                }
                .st-pill-btn:hover { background: rgba(255,255,255,0.22); transform: translateY(-1px); border-color: rgba(244,114,182,0.6); }
                .st-pill-btn:active { transform: translateY(0px) scale(0.97); }

                .st-cfg-section {
                    background: linear-gradient(155deg, rgba(24, 12, 38, 0.72), rgba(10, 5, 18, 0.85));
                    border: 1px solid rgba(244, 114, 182, 0.28);
                    border-radius: 13px; padding: 10px 12px;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08);
                }

                .st-horiz-scroll-strip {
                    display: flex; flex-wrap: nowrap; gap: 5px; align-items: center;
                    overflow-x: auto; overflow-y: hidden; padding-bottom: 2px;
                    scrollbar-width: none; -ms-overflow-style: none;
                }
                .st-horiz-scroll-strip::-webkit-scrollbar { display: none; }

                .st-compact-card { padding: 7px 10px !important; gap: 6px !important; }
                .st-compact-card .st-card-preview, .st-compact-card .st-card-thumb-wrap { display: none !important; }
                .st-tag-pressable {
                    cursor: pointer !important; user-select: none !important; -webkit-user-select: none !important;
                    transition: transform 0.12s ease, filter 0.12s ease, box-shadow 0.15s ease !important;
                }
                .st-tag-pressable:active, .st-tag-pressable:hover {
                    transform: scale(1.05) !important; filter: brightness(1.15) !important;
                    box-shadow: 0 0 10px rgba(244,114,182,0.5) !important;
                }
                #st-tag-popover {
                    position: fixed; z-index: 2147483647; max-width: 340px; width: 90vw;
                    background: linear-gradient(155deg, rgba(28, 12, 42, 0.98), rgba(10, 5, 20, 0.99));
                    border: 1.5px solid #f472b6; border-radius: 14px; padding: 13px 15px;
                    color: #fdf2f8; font-size: 12px; line-height: 1.68;
                    box-shadow: 0 18px 46px rgba(0,0,0,0.92), 0 0 24px rgba(244,114,182,0.35);
                    backdrop-filter: blur(14px); display: none; pointer-events: auto;
                }
                .st-stage5-badge { animation: stPulseGlow 1.8s infinite ease-in-out; }
                .st-stage6-badge { animation: stStage6GodGlow 1.3s infinite ease-in-out; background: linear-gradient(135deg, #fbbf24 0%, #ff0055 50%, #2e1065 100%) !important; color: #fff !important; text-shadow: 0 1px 4px #000; }
                .st-emo-pill { display: inline-flex; align-items: center; padding: 1px 6px; border-radius: 99px; font-size: 10px; font-weight: bold; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; line-height: 1.35; }
                .st-emo-stage6 { display: inline-flex; align-items: center; padding: 1px 7px; border-radius: 99px; font-size: 10px; font-weight: 900; white-space: nowrap; background: linear-gradient(90deg, #f59e0b, #ff0055, #3b0764); color: #fff !important; border: 1px solid #fde047; box-shadow: 0 0 10px rgba(255, 0, 85, 0.85); }
                .st-heart-beat { display: inline-block; animation: stHeartbeat 1.3s infinite ease-in-out; }

                #st-v5-layout-wrap { display: flex; flex: 1; min-height: 0; overflow: hidden; flex-direction: row; }
                #st-v5-tabs {
                    width: 62px; padding: 8px 5px; display: flex; flex-direction: column; gap: 6px;
                    overflow-y: auto; border-right: 1px solid rgba(255,255,255,0.1);
                    background: linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.18)); flex-shrink: 0;
                }
                #st-v5-body { flex: 1; padding: 10px 12px; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }

                @media (max-width: 560px) {
                    #st-v5-panel {
                        left: 2vw !important; top: 3.5vh !important;
                        width: 96vw !important; height: 89vh !important;
                        max-height: 89vh !important; max-width: 96vw !important;
                    }
                    #st-v5-header {
                        padding: 6px 8px !important;
                        gap: 4px !important;
                        flex-wrap: wrap !important;
                    }
                    #st-v5-title {
                        font-size: 12px !important;
                        max-width: 38vw !important;
                        flex: 1 1 auto !important;
                    }
                    #st-v5-header button {
                        padding: 3px 6px !important;
                        font-size: 10px !important;
                    }
                    #st-hdr-close {
                        padding: 4px 9px !important;
                        font-size: 12px !important;
                        background: #ff003c !important;
                        border: 1px solid #ffe4e6 !important;
                        box-shadow: 0 0 8px rgba(255,0,60,0.8) !important;
                        flex-shrink: 0 !important;
                    }
                    #st-v5-layout-wrap { flex-direction: column-reverse !important; }
                    #st-v5-tabs {
                        width: 100% !important; height: auto !important;
                        flex-direction: row !important; overflow-x: auto !important; overflow-y: hidden !important;
                        border-right: none !important; border-top: 1px solid rgba(255,255,255,0.15) !important;
                        padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px)) 8px !important;
                        gap: 6px !important; background: rgba(8,4,16,0.92) !important;
                    }
                    #st-v5-tabs .st-tab-btn { min-width: 54px !important; flex-shrink: 0 !important; padding: 5px 6px !important; }
                    #st-v5-body { padding: 8px 9px !important; }
                    .st-card-thumb-wrap { width: 62px !important; height: 62px !important; }
                }
                #st-v5-body::-webkit-scrollbar, #st-v5-tabs::-webkit-scrollbar { width: 4px; height: 3px; }
                #st-v5-body::-webkit-scrollbar-thumb, #st-v5-tabs::-webkit-scrollbar-thumb { background: rgba(243, 139, 168, 0.45); border-radius: 99px; }
            `;
            document.head.appendChild(style);
        }

        function showToast(msg, type = "success", duration = 3000) {
            if (!userSettings.enabled) return;
            try { if (window.toastr && typeof window.toastr[type] === "function") window.toastr[type](msg, "📊 状态栏 1.0"); } catch (e) {}
            let box = document.getElementById("st-v10-toast");
            if (!box) {
                box = document.createElement("div"); box.id = "st-v10-toast";
                box.style.cssText = "position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;padding:9px 20px;border-radius:99px;font-family:'Microsoft YaHei',sans-serif;font-size:12.5px;font-weight:bold;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,0.85);transition:all 0.25s ease;pointer-events:none;display:none;align-items:center;gap:8px;backdrop-filter:blur(10px);max-width:92vw;text-align:center;";
                document.body.appendChild(box);
            }
            const colors = {
                success: "linear-gradient(135deg, rgba(22,163,74,0.96), rgba(21,128,61,0.96))",
                info: "linear-gradient(135deg, rgba(244,114,182,0.96), rgba(168,85,247,0.96))",
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

        const DIFFICULTY_PRESETS = {
            "easy":   { label: "🌸 轻度催情 (1x)", mult: 1.0,  short: "1x轻度" },
            "normal": { label: "🌙 标准黄油 (3x)", mult: 3.0,  short: "3x标准" },
            "hard":   { label: "🔥 硬核慢热 (8x)", mult: 8.0,  short: "8x硬核" },
            "hell":   { label: "💀 地狱调教 (20x)", mult: 20.0, short: "20x地狱" },
            "abyss":  { label: "👑 深渊神格 (50x)", mult: 50.0, short: "50x深渊" }
        };

        let userSettings = {
            enabled: true, hideRawBlock: true, theme: "魅魔粉", difficultyMode: "normal",
            worldBreakMode: "auto", personaMode: "evolution", contrastInnerActive: false,
            mobileLiteMode: false, compactCards: false, soundEnabled: false,
            showXrayOnHome: true, compactPromptMode: true, autoDockEdge: true,
            zhjAutoCapture: true, zhjSendMode: "auto_send",
            customExtraPrompt: "", customAsmrQuotes: {},
            strictMentalLock: true, injectReversePrompt: true, autoMetabolism: true,
            width: 540, height: 700, fontScale: 100,
            apiUrl: "", apiKey: "", apiModel: "", modelList: [], autoCallApiOnNewMsg: false,
            customTargetName: "", lockedAppearanceTags: "",
            autoGenOnMajorChange: false, autoGenEveryChange: false, autoGenCooldownSec: 30,
            autoGenItemMap: { "小穴实况": true, "子宫实况": true, "骚口实况": true, "胸部实况": true, "当前姿势": true, "身份与背景": true },
            installedPatches: [], pinnedItems: {}, cgGallery: [],
            favoriteGallery: [], globalPinnedStageImgs: {}, reusableImgPool: [], poolRandomEnabled: true,
            hypnoTriggers: [],
            parasiteState: { type: "无寄生", lv: 0, eggCount: 0 },
            objectificationId: "free", edgingLockActive: false,
            clothDurability: 100, directorSendToChat: false
        };

        function loadSettings() {
            try {
                const s = JSON.parse(localStorage.getItem(EXT_ID + "_v20_cfg") || localStorage.getItem(EXT_ID + "_v10_cfg") || "{}");
                userSettings = { ...userSettings, ...s };
                userSettings.width = Math.max(330, Math.min(920, safeNum(userSettings.width, 540)));
                userSettings.height = Math.max(360, Math.min(920, safeNum(userSettings.height, 700)));
                userSettings.fontScale = Math.max(80, Math.min(135, safeNum(userSettings.fontScale, 100)));
                if (!THEMES[userSettings.theme]) userSettings.theme = "魅魔粉";
                if (!DIFFICULTY_PRESETS[userSettings.difficultyMode]) userSettings.difficultyMode = "normal";
                if (!RUIN_PERSONA_MODES[userSettings.personaMode]) userSettings.personaMode = "evolution";
                userSettings.favoriteGallery = Array.isArray(userSettings.favoriteGallery) ? userSettings.favoriteGallery : [];
                userSettings.reusableImgPool = Array.isArray(userSettings.reusableImgPool) ? userSettings.reusableImgPool : [];
                if (typeof userSettings.poolRandomEnabled !== "boolean") userSettings.poolRandomEnabled = true;
                userSettings.globalPinnedStageImgs = userSettings.globalPinnedStageImgs || {};
                userSettings.hypnoTriggers = Array.isArray(userSettings.hypnoTriggers) ? userSettings.hypnoTriggers : [];
                userSettings.parasiteState = (userSettings.parasiteState && typeof userSettings.parasiteState === "object") ? userSettings.parasiteState : { type: "无寄生", lv: 0, eggCount: 0 };
                if (typeof userSettings.btnX !== "number") userSettings.btnX = Math.max(12, window.innerWidth - 68);
                if (typeof userSettings.btnY !== "number") userSettings.btnY = Math.max(80, Math.round(window.innerHeight * 0.2));
                if (typeof userSettings.panelX !== "number") userSettings.panelX = Math.max(8, Math.round((window.innerWidth - Math.min(window.innerWidth - 16, 540)) / 2));
                if (typeof userSettings.panelY !== "number") userSettings.panelY = 42;
            } catch (e) {}
        }

        function saveSettings() {
            try {
                const slimSettings = {
                    ...userSettings,
                    cgGallery: []
                };
                if (Array.isArray(slimSettings.reusableImgPool) && slimSettings.reusableImgPool.length > 1200) {
                    slimSettings.reusableImgPool = slimSettings.reusableImgPool.slice(0, 1200);
                }
                localStorage.setItem(EXT_ID + "_v20_cfg", JSON.stringify(slimSettings));
            } catch (e) {
                console.warn("[状态栏1.0] 设置写入超限保护:", e);
            }
        }

        function getDifficultyProfile() {
            const p = DIFFICULTY_PRESETS[userSettings.difficultyMode] || DIFFICULTY_PRESETS["normal"];
            return { mode: userSettings.difficultyMode, name: p.short, fullLabel: p.label, mult: p.mult };
        }

        function tier6(val, rev = false) {
            const n = Math.max(0, Math.min(100, Math.round(safeNum(val, 0))));
            const v = rev ? (100 - n) : n;
            if (v >= 100) return 5;
            if (v >= 80)  return 4;
            if (v >= 60)  return 3;
            if (v >= 40)  return 2;
            if (v >= 20)  return 1;
            return 0;
        }

        function stageNameFromVal(val, rev = false) {
            return ["第一阶段", "第二阶段", "第三阶段", "第四阶段", "第五阶段", "第六阶段·极"][tier6(val, rev)];
        }

        const EXCLUSIVE_SPECTRA = {
            cockLove: { grads: ["linear-gradient(90deg,#93c5fd,#cbd5e1)","linear-gradient(90deg,#fbcfe8,#f472b6)","linear-gradient(90deg,#f472b6,#e879f9)","linear-gradient(90deg,#c084fc,#9333ea)","linear-gradient(90deg,#e11d48,#881337)","linear-gradient(90deg,#fbbf24 0%,#ff0055 50%,#3b0764 100%)"], cols: ["#bfdbfe","#fbcfe8","#f5d0fe","#e9d5ff","#fda4af","#fde047"], emos: ["(˘•ω•˘)🛡️戒备排斥","(￣_￣)🍆粘膜适应","(⁄•⁄ω⁄•⁄)💓空虚渴求","(º﹃º )👅跪舔崇拜","(♡°▽°♡)🐶断根戒断","♛(🤪🍆💀)脑干阳具寄生"] },
            lust:     { grads: ["linear-gradient(90deg,#a7f3d0,#bae6fd)","linear-gradient(90deg,#fde68a,#fdba74)","linear-gradient(90deg,#fb923c,#f43f5e)","linear-gradient(90deg,#f43f5e,#dc2626)","linear-gradient(90deg,#dc2626,#7f1d1d)","linear-gradient(90deg,#fff 0%,#ff003c 45%,#450a0a 100%)"], cols: ["#a7f3d0","#fde68a","#fdba74","#fda4af","#f87171","#fef08a"], emos: ["( -_-)❄️清心克制","(｡•́︿•̀｡)🌡️春情微燥","(⸝⸝＞◡＜⸝⸝)🔥欲火焚身","(🥵💦)🌋重度发骚","(🤪🔥)♨️狂暴发情","💥(🥵❤️‍🔥💀)下丘脑烧毁"] },
            corr:     { grads: ["linear-gradient(90deg,#fff,#cbd5e1)","linear-gradient(90deg,#e2e8f0,#c084fc)","linear-gradient(90deg,#c084fc,#7e22ce)","linear-gradient(90deg,#9333ea,#be123c)","linear-gradient(90deg,#be123c,#3b0764,#09000b)","linear-gradient(90deg,#fde047 0%,#9333ea 45%,#020005 100%)"], cols: ["#f8fafc","#e9d5ff","#d8b4fe","#f0abfc","#fda4af","#fde047"], emos: ["(｡•̀ᴗ-)✨完好清白","( ´•̥×•̥`)🌫️初度染尘","(¬‿¬ )🍷食髓知味","(淫▽淫)👠放荡娼妇","(🤪🖤⛓️)🐷公用精盆","💀(👁️‍🗨️🖤🔞)彻底崩坏肉坑"] },
            shame:    { grads: ["linear-gradient(90deg,#ffe4e6,#fb7185,#e11d48)","linear-gradient(90deg,#fbcfe8,#ec4899)","linear-gradient(90deg,#e9d5ff,#a855f7)","linear-gradient(90deg,#a855f7,#be123c)","linear-gradient(90deg,#be123c,#1f000d)","linear-gradient(90deg,#00f5d4 0%,#ff0055 50%,#09000b 100%)"], cols: ["#fecdd3","#fbcfe8","#e9d5ff","#fda4af","#fb7185","#67e8f9"], emos: ["(⁄>⁄ω⁄<⁄)🍅羞愤自持","(🫣💦)耳根滚烫","( ˙-˙ )😐习以为常","(😏👙)敞腿任看","(🤪🐾)羞耻全灭","📸(🤪✌️💀)羞耻神经坏死"] },
            obey:     { grads: ["linear-gradient(90deg,#94a3b8,#cbd5e1)","linear-gradient(90deg,#93c5fd,#c4b5fd)","linear-gradient(90deg,#f9a8d4,#c084fc)","linear-gradient(90deg,#fbbf24,#d97706)","linear-gradient(90deg,#e11d48,#4c0519)","linear-gradient(90deg,#fde047 0%,#d97706 45%,#1c1917 100%)"], cols: ["#cbd5e1","#bfdbfe","#fbcfe8","#fde68a","#fda4af","#fde047"], emos: ["( `^´ )⚔️孤高自主","(´-ω-`)💧被动妥协","( ´•̥ω•̥`)🙇温顺配合","(▽・ω・▽)🐾摇尾乞怜","(⛓️🐶💦)绝对盲从","👑(🧎‍♀️👅💀)前额叶切除木偶"] },
            pleas:    { grads: ["linear-gradient(90deg,#f1f5f9,#fbcfe8)","linear-gradient(90deg,#f9a8d4,#ec4899)","linear-gradient(90deg,#e879f9,#a855f7)","linear-gradient(90deg,#ff0a54,#9333ea)","linear-gradient(90deg,#ff003c,#4a0018)","linear-gradient(90deg,#fff 0%,#ff0055 45%,#3b0764 100%)"], cols: ["#f8fafc","#fbcfe8","#f5d0fe","#fda4af","#ff4d6d","#fff"], emos: ["( ˘ω˘ )💤神思清明","(😳⚡)尾椎微麻","(🥺💓)趾尖蜷缩","(🥵⚡💦)濒临绝顶","(🤪⛲)潮吹失神","⚡(翻白眼👅💀)多巴胺烧穿熔断"] },
            hypno:    { grads: ["linear-gradient(90deg,#7dd3fc,#bae6fd)","linear-gradient(90deg,#818cf8,#c084fc)","linear-gradient(90deg,#a855f7,#ec4899)","linear-gradient(90deg,#ec4899,#7e22ce)","linear-gradient(90deg,#7e22ce,#1e1b4b)","linear-gradient(90deg,#ff007f 0%,#7e22ce 50%,#05000a 100%)"], cols: ["#bae6fd","#c7d2fe","#f5d0fe","#fbcfe8","#d8b4fe","#ff758f"], emos: ["(・_・)🧠理智完好","(°_° )🌀浅层恍惚","(＠_＠;)💫催眠暗示","(♡_♡)🎀常识改写","(🤤💭)人格碎裂","💖(👁️♡👁️💀)脑实质海绵化痴呆"] },
            drug:     { grads: ["linear-gradient(90deg,#86efac,#bbf7d0)","linear-gradient(90deg,#bef264,#facc15)","linear-gradient(90deg,#a3e635,#c084fc)","linear-gradient(90deg,#e879f9,#be123c)","linear-gradient(90deg,#9333ea,#3b0764)","linear-gradient(90deg,#a3e635 0%,#ff0055 50%,#1a0014 100%)"], cols: ["#bbf7d0","#fef08a","#d9f99d","#f5d0fe","#e9d5ff","#bef264"], emos: ["(🌱)纯净无毒","(😳🍷)微醺依恋","(🥵🧪)药力发热","(🤤💉)精液戒断","(🤪🧪💦)断精发狂","☣️(🤪💉💀)脑脊液毒化母猪"] },
            mouth:    { grads: ["linear-gradient(90deg,#fecdd3,#fda4af)","linear-gradient(90deg,#fda4af,#fb7185)","linear-gradient(90deg,#fb7185,#e11d48)","linear-gradient(90deg,#e11d48,#9d174d)","linear-gradient(90deg,#fff,#e11d48,#4c0519)","linear-gradient(90deg,#fde047 0%,#e11d48 50%,#1f000d 100%)"], cols: ["#ffe4e6","#fecdd3","#fda4af","#f472b6","#fda4af","#fde047"], emos: ["💋洁净初唇","👅唇肿涎溢","😮‍💨咽喉松弛","🤤颚骨半脱臼","🤪食道肉壶化","💀口腔排泄器畸变"] },
            chest:    { grads: ["linear-gradient(90deg,#fff1f2,#fbcfe8)","linear-gradient(90deg,#fbcfe8,#f472b6)","linear-gradient(90deg,#f472b6,#db2777)","linear-gradient(90deg,#fef3c7,#f472b6,#be185d)","linear-gradient(90deg,#fff,#ec4899,#831843)","linear-gradient(90deg,#fffbeb 0%,#ff0055 50%,#3b0764 100%)"], cols: ["#fce7f3","#fbcfe8","#f9a8d4","#fef3c7","#fbcfe8","#fde047"], emos: ["🌸娇嫩处乳","🍒乳尖肥大","🥵乳晕黑紫扩张","🍼乳腺失控漏奶","🐄下垂巨乳奶袋","💀崩坏泌乳肉囊"] },
            vag:      { grads: ["linear-gradient(90deg,#ffe4e6,#f9a8d4)","linear-gradient(90deg,#f9a8d4,#ec4899)","linear-gradient(90deg,#ec4899,#e11d48)","linear-gradient(90deg,#e11d48,#9d174d)","linear-gradient(90deg,#ff003c,#500724)","linear-gradient(90deg,#fde047 0%,#ff003c 48%,#1a000c 100%)"], cols: ["#ffe4e6","#fbcfe8","#fda4af","#f472b6","#ff4d6d","#fde047"], emos: ["🌸紧致初鲍","💧初破红肿","🌺外翻黑木耳","🥵括约肌松弛洞开","🤪肉壁脱垂漏精壶","💀彻底崩坏烂肉洞"] },
            womb:     { grads: ["linear-gradient(90deg,#fce7f3,#f0abfc)","linear-gradient(90deg,#f0abfc,#d946ef)","linear-gradient(90deg,#d946ef,#be185d)","linear-gradient(90deg,#be185d,#881337)","linear-gradient(90deg,#fff,#be123c,#3b0764)","linear-gradient(90deg,#fde047 0%,#d946ef 45%,#2e1065 100%)"], cols: ["#f5d0fe","#f0abfc","#e879f9","#fda4af","#ffccd5","#fde047"], emos: ["🤍紧闭处子","🥺宫口充血微松","🫀宫口扩张锁精","🥵宫腔肥大下坠","🤪宫颈重度脱垂","💀外翻脱垂死肉苗床"] },
            clit:     { grads: ["linear-gradient(90deg,#fef9c3,#fbcfe8)","linear-gradient(90deg,#fde047,#f472b6)","linear-gradient(90deg,#facc15,#ec4899)","linear-gradient(90deg,#f59e0b,#e11d48)","linear-gradient(90deg,#ff003c,#7e22ce)","linear-gradient(90deg,#fef08a 0%,#00f5d4 45%,#be123c 100%)"], cols: ["#fef9c3","#fde68a","#fbcfe8","#fdba74","#fda4af","#67e8f9"], emos: ["🌱包皮隐没","😳充血外露","⚡阴蒂肥大勃起","🥵尿道扩张漏尿","⛲阴蒂肉棒化失禁","💀括约肌坏死漏尿狂"] },
            anal:     { grads: ["linear-gradient(90deg,#fed7aa,#fda4af)","linear-gradient(90deg,#fda4af,#e11d48)","linear-gradient(90deg,#e11d48,#9f1239)","linear-gradient(90deg,#9f1239,#6b21a8)","linear-gradient(90deg,#7e22ce,#3b0764)","linear-gradient(90deg,#fb923c 0%,#be123c 50%,#1a0014 100%)"], cols: ["#fed7aa","#fda4af","#fb7185","#e9d5ff","#d8b4fe","#fdba74"], emos: ["💮紧闭菊蕾","😣裂伤红肿","😮‍💨褶皱磨平松弛","🕳️后庭空洞不合","🥛直肠翻肉轻度脱肛","💀重度脱肛崩坏排泄腔"] },
            pee:      { grads: ["linear-gradient(90deg,#fff,#fef9c3)","linear-gradient(90deg,#fef08a,#facc15)","linear-gradient(90deg,#facc15,#f59e0b)","linear-gradient(90deg,#ea580c,#e11d48)","linear-gradient(90deg,#e11d48,#881337)","linear-gradient(90deg,#fde047 0%,#ff003c 50%,#1a0008 100%)"], cols: ["#fef9c3","#fde047","#fdba74","#fda4af","#ff4d6d","#fde047"], emos: ["🤍尿道紧闭","😳小腹微酸","😣夹腿憋尿","🥵濒临漏尿","💦括约肌崩解","⛲24h失禁滴尿"] },
            semen:    { grads: ["linear-gradient(90deg,#64748b,#94a3b8)","linear-gradient(90deg,#e2e8f0,#fff)","linear-gradient(90deg,#fff,#fbcfe8,#f472b6)","linear-gradient(90deg,#fff,#ec4899,#be123c)","linear-gradient(90deg,#fff,#ff0a54,#3b0764)","linear-gradient(90deg,#fff 0%,#fde047 35%,#ff0055 100%)"], cols: ["#cbd5e1","#fff","#fbcfe8","#fda4af","#ffccd5","#fde047"], emos: ["🤍无残留","🥛微量挂壁","🤤白浊咕啾","🥵灌满外溢","🫃精盆撑满","💥灌爆撑裂苗床"] },
            milk:     { grads: ["linear-gradient(90deg,#64748b,#94a3b8)","linear-gradient(90deg,#fffbeb,#fef3c7)","linear-gradient(90deg,#fef3c7,#fde68a)","linear-gradient(90deg,#fde68a,#f9a8d4)","linear-gradient(90deg,#fffbeb,#fb7185,#be123c)","linear-gradient(90deg,#fff 0%,#fde047 45%,#ec4899 100%)"], cols: ["#cbd5e1","#fef3c7","#fde68a","#fbcfe8","#fecdd3","#fde047"], emos: ["🌸未泌乳","🍼乳腺微胀","🥺乳尖渗奶","🥵涨奶酸痛","🐄双乳狂喷","🌊失禁浊乳喷泉"] },
            sta:      { grads: ["linear-gradient(90deg,#bbf7d0,#4ade80,#16a34a)","linear-gradient(90deg,#fef08a,#facc15)","linear-gradient(90deg,#fed7aa,#fb923c)","linear-gradient(90deg,#fda4af,#e11d48)","linear-gradient(90deg,#dc2626,#450a0a)","linear-gradient(90deg,#450a0a 0%,#090000 100%)"], cols: ["#86efac","#fde047","#fdba74","#fda4af","#f87171","#fca5a5"], emos: ["✨亭亭玉立","😮‍💨腰腿酸软","🥵膝软外八不合","🫠双腿痉挛瘫软","😵‍💫髋骨脱臼爬行","💀四肢废用肉垫"] },
            expose:   { grads: ["linear-gradient(90deg,#bae6fd,#38bdf8)","linear-gradient(90deg,#fde68a,#f59e0b)","linear-gradient(90deg,#fdba74,#f43f5e)","linear-gradient(90deg,#e879f9,#9333ea)","linear-gradient(90deg,#ff0055,#4c0519)","linear-gradient(90deg,#fde047 0%,#ff0055 50%,#09000b 100%)"], cols: ["#7dd3fc","#fde047","#fda4af","#f0abfc","#fb7185","#fde047"], emos: ["🛡️声誉完好","👀私下窃语","📸把柄留影流传","📡暗网视频疯传","🚨熟人视奸认出","💀全城公用便器社死"] }
        };

        function getThemedBarStyle(pct, barTheme = "pleas") {
            if (barTheme === "none") return { grad: "linear-gradient(90deg,#f472b6,#a855f7)", glow: "none", labelColor: "#fbcfe8", emo: "", tier: 0 };
            const p = Math.max(0, Math.min(100, Math.round(safeNum(pct, 0))));
            const isRev = (barTheme === "shame" || barTheme === "sta");
            let t = tier6(p, isRev);
            if (barTheme === "semen" || barTheme === "milk") {
                if (p === 0) t = 0; else if (p < 30) t = 1; else if (p < 60) t = 2; else if (p < 85) t = 3; else if (p < 100) t = 4; else t = 5;
            }
            const spec = EXCLUSIVE_SPECTRA[barTheme] || EXCLUSIVE_SPECTRA.pleas;
            const grad = spec.grads[t] || spec.grads[0], col = spec.cols[t] || "#f9e2af", rawEmo = spec.emos[t] || "";
            const isMax = (t === 5);
            const glow = isMax ? "0 0 14px #ff0055,0 0 22px #fde047,inset 0 0 6px #fff" : (t >= 3 ? `0 0 10px ${col}88` : `0 0 5px ${col}44`);
            const emo = isMax ? `<span class="st-emo-stage6">${rawEmo}</span>` : `<span class="st-emo-pill" style="color:${col};border:1px solid ${col}55;background:rgba(0,0,0,0.45);">${rawEmo}</span>`;
            return { grad, glow, labelColor: col, emo, tier: t };
        }

        function cleanThoughtText(str) {
            return safeStr(str).replace(/【(?:生理层|心理层|欲望层)】/g, "").replace(/\s*｜\s*/g, "").replace(/^[\s"“'‘*]+|[\s"”'’*]+$/g, "").replace(/\*\*/g, "").trim();
        }

        function checkCardAvailable(silent = false) {
            const ctx = safeCtx();
            const hasChar = ctx?.characterId !== undefined && ctx?.characterId !== null && ctx?.name2;
            const hasGroup = Boolean(ctx?.groupId);
            const hasChat = Array.isArray(ctx?.chat) && ctx.chat.length > 0;
            if (!hasChar && !hasGroup && !hasChat) {
                if (!silent) showToast("⚠️ 当前未开启任何角色对话或群聊记录为空！", "warn", 3500);
                return false;
            }
            return true;
        }

        function getInitialVars() {
            return {
                档案: { 手动锁定真名: "", 当前认知名字: "", 锁定外貌DNA: "", 原身旧名: "", 种族与体质: "", 身份与背景: "", 肉体外貌实况: "", 表里风评与称号: "", 致命把柄与威胁: "无", 风月挂牌身价: "", 当前处境: "" },
                核心数值: { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 },
                精神与心理: { 羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0, 意识清醒度: 100, 人格崩解度: 0, 媚药精液毒瘾: 0, 语言退化阿嘿颜: 0 },
                身体: { 体力: 100, 敏感度倍率: 1.0 },
                性癖: { 条目: [] }, 恩客图鉴: {}, 已屏蔽恩客: [], 历史最高崩坏度: {}, 上帝强制锁定: {},
                专属相册: [], 断精回合数: 0, 本轮失控事件: "",
                实况: { 内心独白: "", 当前姿势: "", 当前衣装: "", 骚口实况: "", 胸部实况: "", 小穴实况: "", 子宫实况: "", 阴蒂尿道实况: "", 屁眼实况: "" },
                穿搭: { 头饰与眼部: "", 颈部与项圈: "", 胸罩与裹胸: "", 上衣与束腰: "", 内裤与遮挡: "", 下装与裙裤: "", 丝袜与腿部: "", 鞋子与玉足: "" },
                计数: { 性交: { 口: 0, 小穴: 0, 屁眼: 0, 乳穴: 0, 足腿: 0, 兽交异种: 0 }, 高潮: { 总数: 0, 强制: 0, 公开场合: 0, 寸止: 0 }, 射精: { 内射: 0, 颜射体外: 0 }, 精液摄入: { 吞精次数: 0, 累计毫升: 0 }, 泌乳: { 喷乳次数: 0, 累计毫升: 0 }, 自慰: 0, 失控: { 失禁: 0, 喷潮: 0, 阿嘿颜: 0 }, 暴露: { 露出: 0, 被围观人次: 0, 被拍摄留影: 0 }, 交易: { 接客卖身: 0, 被外借共享: 0, 轮奸群交: 0, 睡眠昏迷奸: 0 } },
                受孕与生理: { 子宫怀孕: 0, 怀孕进度: 0, 受孕概率: 0, 生理周期阶段: "正常生理期", 卵子状态: "未排卵", 宫内精液归属: "无", 生产产卵次数: 0 },
                体内精液存量: { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 },
                痕迹与标记: { 体表痕迹: "无", 淫纹与刻印: "无", 公开涂鸦字迹: "无", 穿刺与环饰: "无", 鞭痕与掌印: 0, 初夜破瓜纪念: "处女膜完好无损" },
                体内道具与权限: { 体内道具: "无", 束缚状态: "无", 穿戴中的标记物: "", 肉体所有权: "自由身", 排泄与高潮权限: "自主控制", 常识改写状态: "无" },
                调教进度: { 规矩与日程: "", 条件反射触发词: "无", 媚药与发情毒: "无" },
                精神与心理扩展: { 当前敏感点: "", 催眠深度: 0 },
                按钮详情: {}, 性癖详情: {}, 自定义条目: {}
            };
        }

        function normalizeVarsStructure(v) {
            if (!v || typeof v !== "object") return v;
            v.计数 = (v.计数 && typeof v.计数 === "object") ? v.计数 : {};
            if (typeof v.计数.高潮 !== "object" || v.计数.高潮 === null) {
                const n = Number(v.计数.高潮) || 0;
                v.计数.高潮 = { 总数: n, 强制: 0, 公开场合: 0, 寸止: 0 };
            }
            if (typeof v.计数.失控 !== "object" || v.计数.失控 === null) {
                const n = Number(v.计数.失控) || 0;
                v.计数.失控 = { 失禁: n, 喷潮: 0, 阿嘿颜: 0 };
            }
            if (typeof v.计数.失禁 === "number") {
                v.计数.失控.失禁 = Math.max(safeNum(v.计数.失控.失禁, 0), v.计数.失禁);
                delete v.计数.失禁;
            }
            if (typeof v.计数.喷潮 === "number") {
                v.计数.失控.喷潮 = Math.max(safeNum(v.计数.失控.喷潮, 0), v.计数.喷潮);
                delete v.计数.喷潮;
            }
            if (typeof v.计数.性交 !== "object" || v.计数.性交 === null) {
                v.计数.性交 = { 口: 0, 小穴: Number(v.计数.性交) || 0,屁眼: 0, 乳穴: 0, 足腿: 0, 兽交异种: 0 };
            }
            if (typeof v.计数.射精 !== "object" || v.计数.射精 === null) {
                v.计数.射精 = { 内射: Number(v.计数.射精) || 0, 颜射体外: 0 };
            }
            if (typeof v.计数.精液摄入 !== "object" || v.计数.精液摄入 === null) {
                v.计数.精液摄入 = { 吞精次数: Number(v.计数.精液摄入) || 0, 累计毫升: 0 };
            }
            if (typeof v.计数.泌乳 !== "object" || v.计数.泌乳 === null) {
                v.计数.泌乳 = { 喷乳次数: Number(v.计数.泌乳) || 0, 累计毫升: 0 };
            }
            if (typeof v.计数.暴露 !== "object" || v.计数.暴露 === null) {
                v.计数.暴露 = { 露出: Number(v.计数.暴露) || 0, 被围观人次: 0, 被拍摄留影: 0 };
            }
            if (typeof v.计数.交易 !== "object" || v.计数.交易 === null) {
                v.计数.交易 = { 接客卖身: Number(v.计数.交易) || 0, 被外借共享: 0, 轮奸群交: 0, 睡眠昏迷奸: 0 };
            }
            v.体内精液存量 = (v.体内精液存量 && typeof v.体内精液存量 === "object") ? v.体内精液存量 : { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 };
            v.核心数值 = (v.核心数值 && typeof v.核心数值 === "object") ? v.核心数值 : { 对肉棒好感度: 0, 性欲程度: 0, 淫乱恶堕: 0 };
            v.精神与心理 = (v.精神与心理 && typeof v.精神与心理 === "object") ? v.精神与心理 : { 羞耻度: 100, 服从度: 0, 沦陷度: 0, 快感累积: 0, 意识清醒度: 100, 人格崩解度: 0, 媚药精液毒瘾: 0, 语言退化阿嘿颜: 0 };
            v.身体 = (v.身体 && typeof v.身体 === "object") ? v.身体 : { 体力: 100, 敏感度倍率: 1.0 };
            v.实况 = (v.实况 && typeof v.实况 === "object") ? v.实况 : {};
            v.穿搭 = (v.穿搭 && typeof v.穿搭 === "object") ? v.穿搭 : {};
            v.档案 = (v.档案 && typeof v.档案 === "object") ? v.档案 : {};
            v.痕迹与标记 = (v.痕迹与标记 && typeof v.痕迹与标记 === "object") ? v.痕迹与标记 : { 体表痕迹: "无", 淫纹与刻印: "无", 公开涂鸦字迹: "无", 穿刺与环饰: "无", 鞭痕与掌印: 0, 初夜破瓜纪念: "处女膜完好无损" };
            v.体内道具与权限 = (v.体内道具与权限 && typeof v.体内道具与权限 === "object") ? v.体内道具与权限 : { 体内道具: "无", 束缚状态: "无", 穿戴中的标记物: "", 肉体所有权: "自由身", 排泄与高潮权限: "自主控制", 常识改写状态: "无" };
            v.专属相册 = Array.isArray(v.专属相册) ? v.专属相册 : [];
            return v;
        }

        let curVars = getInitialVars(), latestStatus = null, activeCat = null, viewingHistoryFloor = null;
        let isPanelOpen = false, isSettingsOpen = false;
        const SHORT_NAMES = { "档案与风评": "档案", "恶堕与脑改": "恶堕", "下流性癖库": "性癖", "六孔与储精": "六孔", "肉改与道具": "肉改", "全身穿搭": "穿搭", "苗床与受孕": "受孕", "恩客图鉴": "恩客", "淫乱总账": "总账" };

        function getChatStoreKey() {
            const ctx = safeCtx();
            const cid = safeStr(ctx?.chatId || ctx?.chat_metadata?.chat_id_hash || ctx?.chat_metadata?.main_chat || "no_cid").trim();
            const chId = safeStr(ctx?.groupId || ctx?.characterId || ctx?.name2 || "no_char").trim();
            const firstDate = safeStr(ctx?.chat?.[0]?.send_date || ctx?.chat?.[1]?.send_date || "").replace(/[^0-9]/g, "");
            const firstMesHash = safeStr(ctx?.chat?.[0]?.mes).slice(0, 24).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "");
            return `${EXT_ID}_v22_isolated_${chId}_${cid}_${firstDate}_${firstMesHash}`;
        }

        function loadChatCache() {
            try {
                const key = getChatStoreKey();
                const raw = localStorage.getItem(key);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                const curLen = safeCtx()?.chat?.length || 0;
                if (curLen <= 1 && typeof parsed?.floorLen === "number" && parsed.floorLen > 1) {
                    localStorage.removeItem(key);
                    return null;
                }
                if (parsed && parsed.快照) normalizeVarsStructure(parsed.快照);
                return parsed;
            } catch (e) { return null; }
        }

        function sanitizeBase64FromBtnDetails(btnDetails) {
            if (!btnDetails || typeof btnDetails !== "object") return {};
            const cleaned = {};
            for (const [k, obj] of Object.entries(btnDetails)) {
                if (!obj || typeof obj !== "object") continue;
                const copy = { ...obj };
                const realStgNow = Math.max(1, getRealStageByKey(k, curVars) || 3);
                if (typeof copy.imgUrl === "string" && copy.imgUrl.startsWith("data:")) {
                    const fallbackKey = getProtagScopedImgKey(k, realStgNow);
                    rawSaveDataUrlToDB(fallbackKey, copy.imgUrl).catch(() => {});
                    copy.imgUrl = normalizeImgKey(fallbackKey);
                }
                if (typeof copy.forceLatestImg === "string" && copy.forceLatestImg.startsWith("data:")) {
                    const fallbackKey = getProtagScopedImgKey(k, realStgNow);
                    rawSaveDataUrlToDB(fallbackKey, copy.forceLatestImg).catch(() => {});
                    copy.forceLatestImg = normalizeImgKey(fallbackKey);
                }
                if (copy.stageImgs && typeof copy.stageImgs === "object") {
                    const stgCopy = {};
                    for (const [sIdx, sVal] of Object.entries(copy.stageImgs)) {
                        if (typeof sVal === "string" && sVal.startsWith("data:")) {
                            const sKey = getProtagScopedImgKey(k, sIdx);
                            rawSaveDataUrlToDB(sKey, sVal).catch(() => {});
                            stgCopy[sIdx] = normalizeImgKey(sKey);
                        } else {
                            stgCopy[sIdx] = sVal;
                        }
                    }
                    copy.stageImgs = stgCopy;
                }
                if (copy.stageImgList && typeof copy.stageImgList === "object") {
                    const listCopy = {};
                    for (const [sIdx, arr] of Object.entries(copy.stageImgList)) {
                        if (!Array.isArray(arr)) continue;
                        listCopy[sIdx] = arr.map((sVal, i) => {
                            if (typeof sVal === "string" && sVal.startsWith("data:")) {
                                const sKey = `${getProtagScopedImgKey(k, sIdx)}_m${i}`;
                                rawSaveDataUrlToDB(sKey, sVal).catch(() => {});
                                return normalizeImgKey(sKey);
                            }
                            return sVal;
                        });
                    }
                    copy.stageImgList = listCopy;
                }
                cleaned[k] = copy;
            }
            return cleaned;
        }

        function saveChatCache(varsObj, floorLen = -1) {
            if (viewingHistoryFloor !== null) return;
            try {
                normalizeVarsStructure(varsObj);
                const curLen = floorLen >= 0 ? floorLen : (safeCtx()?.chat?.length || 0);
                const slimAlbum = (Array.isArray(varsObj.专属相册) ? varsObj.专属相册 : []).map(item => ({
                    ...item,
                    src: (item.dbKey && String(item.src || "").startsWith("data:")) ? "" : item.src
                }));
                const slimBtnDetails = sanitizeBase64FromBtnDetails(varsObj.按钮详情);

                varsObj.玩法扩展状态 = {
                    hypnoTriggers: Array.isArray(userSettings.hypnoTriggers) ? [...userSettings.hypnoTriggers] : [],
                    parasiteState: userSettings.parasiteState ? { ...userSettings.parasiteState } : { type: "无寄生", lv: 0, eggCount: 0 },
                    objectificationId: userSettings.objectificationId || "free",
                    edgingLockActive: Boolean(userSettings.edgingLockActive),
                    clothDurability: safeNum(userSettings.clothDurability, 100)
                };

                const slimRoleSlots = {};
                if (varsObj.角色独立槽位 && typeof varsObj.角色独立槽位 === "object") {
                    for (const [rName, rSlot] of Object.entries(varsObj.角色独立槽位)) {
                        if (!rSlot || typeof rSlot !== "object") continue;
                        slimRoleSlots[rName] = {
                            ...rSlot,
                            按钮详情: sanitizeBase64FromBtnDetails(rSlot.按钮详情)
                        };
                    }
                }

                const slimSnapshot = { ...varsObj, 专属相册: slimAlbum, 按钮详情: slimBtnDetails, 角色独立槽位: slimRoleSlots };

                const latestMesRaw = safeStr(safeCtx()?.chat?.[Math.max(0, curLen - 1)]?.mes);
                const curFloorHash = `${curLen}_${latestMesRaw.length}_${latestMesRaw.slice(0, 32)}_${latestMesRaw.slice(-32)}`;
                localStorage.setItem(getChatStoreKey(), JSON.stringify({
                    floorLen: curLen,
                    lastFloorHash: curFloorHash,
                    手动锁定真名: varsObj.档案?.手动锁定真名 || "",
                    锁定外貌DNA: varsObj.档案?.锁定外貌DNA || "",
                    专属相册: slimAlbum,
                    已屏蔽恩客: varsObj.已屏蔽恩客 || [],
                    历史最高崩坏度: varsObj.历史最高崩坏度 || {},
                    上帝强制锁定: varsObj.上帝强制锁定 || {},
                    角色独立槽位: slimRoleSlots,
                    玩法扩展状态: varsObj.玩法扩展状态,
                    快照: slimSnapshot,
                    按钮详情: slimBtnDetails,
                    性癖详情: varsObj.性癖详情 || {},
                    自定义条目: varsObj.自定义条目 || {}
                }));
            } catch (e) {
                console.warn("[状态栏1.0] 缓存空间接近上限，正在自动清理最旧的非活跃聊天快照...", e);
                try {
                    const currentKey = getChatStoreKey();
                    const allIsoKeys = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const k = localStorage.key(i);
                        if (k && k.startsWith(`${EXT_ID}_v22_isolated_`) && k !== currentKey) {
                            allIsoKeys.push(k);
                        }
                    }
                    allIsoKeys.slice(0, Math.max(5, Math.ceil(allIsoKeys.length * 0.35))).forEach(k => localStorage.removeItem(k));
                } catch (e2) {}
            }
        }

        function detectRealCharacterIdentity(v) {
            const diff = getDifficultyProfile();
            if (v?.档案?.种族与体质 && safeStr(v.档案.种族与体质).trim() && !/精灵之躯|修真者|魅魔之躯|普通人类/.test(v.档案.种族与体质)) {
                return safeStr(v.档案.种族与体质).trim();
            }
            return `难度${diff.mult}x`;
        }

        const INVALID_ROLE_NAME_REGEX = /^(?:主角|玩家|角色|女主|男主|她|他|我|你|它|user|char|system|无|未知|未知.*|.*未知.*|路人.*|系统|旁白|主持人|DM|模拟器|游戏|状态栏|道具|武器|物品|法宝|玩具|跳蛋|假阳具|震动棒|项圈|锁链|衣服|内裤|胸罩|丝袜|高跟鞋|触手|史莱姆|.*档案|当前.*|状态.*|环境.*)$/i;
        function isValidCharacterName(nameStr) {
            const n = safeStr(nameStr).trim();
            if (!n || n.length < 1 || n.length > 12) return false;
            if (INVALID_ROLE_NAME_REGEX.test(n)) return false;
            if (/(?:未知|道具|物品|系统|状态栏|档案|图鉴|总账|实况|数值|计数器|模式|测试|变量|目标|身份)$/.test(n)) return false;
            return true;
        }

        function detectProtagonistName(v) {
            const ctx = safeCtx(), chat = ctx?.chat || [];
            const charCardName = safeStr(ctx?.name2).trim();
            const userPersonaName = safeStr(ctx?.name1).trim();
            const deletedSet = new Set(Array.isArray(v?.已删除角色列表) ? v.已删除角色列表 : []);

            const lockedName = safeStr(v?.档案?.手动锁定真名).trim();
            if (lockedName && isValidCharacterName(lockedName) && !deletedSet.has(lockedName)) {
                if (v && v.档案) v.档案.当前认知名字 = lockedName;
                return lockedName;
            } else if (lockedName && (!isValidCharacterName(lockedName) || deletedSet.has(lockedName))) {
                if (v && v.档案) v.档案.手动锁定真名 = "";
            }

            const knownRoots = new Set(["档案", "身体", "核心数值", "精神与心理", "受孕与生理", "计数", "体内精液存量", "痕迹与标记", "体内道具与权限", "实况", "穿搭", "调教进度", "精神与心理扩展"]);
            for (let i = chat.length - 1; i >= Math.max(0, chat.length - 5); i--) {
                const matches = [...safeStr(chat[i]?.mes).matchAll(/_\.(?:set|add)\s*\(\s*['"`]([^.'"`]+)\./g)];
                for (const m of matches) {
                    const cand = safeStr(m[1]).trim();
                    if (cand && !knownRoots.has(cand) && isValidCharacterName(cand) && !deletedSet.has(cand)) {
                        if (v?.档案) v.档案.当前认知名字 = cand;
                        return cand;
                    }
                }
            }
            const isDmCard = /系统|旁白|主持人|DM|模拟器|游戏|世界|剧场|笔/i.test(charCardName);
            const cogName = (isValidCharacterName(v?.档案?.当前认知名字) && !deletedSet.has(v?.档案?.当前认知名字)) ? v.档案.当前认知名字 : "";
            const validCardName = (!isDmCard && isValidCharacterName(charCardName) && !deletedSet.has(charCardName)) ? charCardName : "";
            const validUserName = (isValidCharacterName(userPersonaName) && !deletedSet.has(userPersonaName)) ? userPersonaName : "";
            return safeStr(cogName || validCardName || validUserName || userPersonaName || charCardName || "主角").trim();
        }

        function applyNaturalMetabolism(floorText, targetVars, hasExplicitSet = false, isLatestFloor = false, floorIdx = 0) {
            if (!floorText) return;
            normalizeVarsStructure(targetVars);
            if (floorIdx === 0 && !hasExplicitSet) return;

            const cleanBody = floorText
                .replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|<options>[\s\S]*?<\/options>|<summary>[\s\S]*?<\/summary>|<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "")
                .replace(/###\s*【[^】]*】[\s\S]*?(?=---|###|<\/game>|$)/g, "")
                .replace(/【[^】]*(?:档案|设定|面板|资料|图鉴|记录)[^】]*】[\s\S]*?(?=\n\n|---|###|<\/game>|$)/g, "")
                .replace(/(?:写下|写道|书写|落笔|改写为|设定为)[：:\s]*[“"「『][\s\S]*?[”"」』]/g, "")
                .replace(/<item_[^>]+>[\s\S]*?<\/item_[^>]+>/gi, "");
            if (!cleanBody) return;

            const sp = targetVars.体内精液存量 || {}, mark = targetVars.痕迹与标记 || {}, cnt = targetVars.计数 || {};
            let gotFreshSemen = false;
            const curProtag = safeStr(targetVars?.档案?.手动锁定真名 || targetVars?.档案?.当前认知名字 || detectProtagonistName(targetVars)).trim();

            const inheritDirtyRegex = new RegExp(`(?:${curProtag}|我|自己|主角)[^。！？；\\n]{0,35}(?:变成|化作|化为|重塑为|改写为|成为了)[^。！？；\\n]{0,25}(?:妓女|娼妇|肉便器|荡妇|母狗|母猪|魅魔|淫妇|熟女|人妻)[\\s\\S]{0,80}?(?:继承|保留|拥有|带着|刻满|熟知)[^。！？；\\n]{0,25}(?:原身|原本|过往|所有|全部|无数次|千人)[^。！？；\\n]{0,20}(?:性交|淫乱|接客|挨操|调教|开发|内射|记忆|经验|履历|身体)`);
            const pureNewFemaleRegex = new RegExp(`(?:${curProtag}|我|自己|主角)[^。！？；\\n]{0,25}(?:变成|化作|化为|重塑为|改写为|性转成|变成了)(?:了|一个|一名|一只|一具)?[^。！？；\\n]{0,18}(?:女|少女|女孩|萝莉|女人|女生|魅魔|美女蛇|仙子|大小姐|千金|公主|修女|巫女|女鬼)`);
            const backToMaleRegex = new RegExp(`(?:${curProtag}|我|自己|主角)[^。！？；\\n]{0,20}(?:恢复原状|变回男|恢复男儿身|变回普通男大学生|恢复了男性躯体)`);

            if (backToMaleRegex.test(cleanBody)) {
                targetVars.档案 = targetVars.档案 || {};
                targetVars.档案.当前性别 = "male";
            } else if (inheritDirtyRegex.test(cleanBody)) {
                targetVars.档案 = targetVars.档案 || {};
                targetVars.档案.当前性别 = "female";
                if (!hasExplicitSet) {
                    const dMult = Math.max(1, Math.round(getDifficultyProfile().mult));
                    cnt.性交.小穴 = Math.max(safeNum(cnt.性交.小穴), 25 * dMult);
                    cnt.射精.内射 = Math.max(safeNum(cnt.射精.内射), 20 * dMult);
                    cnt.性交.口 = Math.max(safeNum(cnt.性交.口), 15 * dMult);
                    cnt.精液摄入.吞精次数 = Math.max(safeNum(cnt.精液摄入.吞精次数), 12 * dMult);
                    cnt.精液摄入.累计毫升 = Math.max(safeNum(cnt.精液摄入.累计毫升), 180 * dMult);
                    cnt.高潮.总数 = Math.max(safeNum(cnt.高潮.总数), 30 * dMult);
                    cnt.交易.接客卖身 = Math.max(safeNum(cnt.交易.接客卖身), 20 * dMult);
                    targetVars.核心数值.淫乱恶堕 = Math.max(safeNum(targetVars.核心数值.淫乱恶堕), 65);
                    targetVars.核心数值.对肉棒好感度 = Math.max(safeNum(targetVars.核心数值.对肉棒好感度), 65);
                    targetVars.核心数值.性欲程度 = Math.max(safeNum(targetVars.核心数值.性欲程度), 70);
                    targetVars.精神与心理.羞耻度 = Math.min(safeNum(targetVars.精神与心理.羞耻度, 100), 30);
                    targetVars.精神与心理.服从度 = Math.max(safeNum(targetVars.精神与心理.服从度), 60);
                }
            } else if (pureNewFemaleRegex.test(cleanBody)) {
                const wasMaleBefore = (targetVars.档案?.当前性别 === "male");
                targetVars.档案 = targetVars.档案 || {};
                targetVars.档案.当前性别 = "female";
                if (wasMaleBefore && !hasExplicitSet) {
                    targetVars.历史最高崩坏度 = {};
                }
            }

            const isCurrentlyMale = (detectProtagonistGender(curProtag, targetVars) === "male");

            const otherRoleNames = Object.keys(targetVars?.角色独立槽位 || {}).filter(n => n && n.length >= 2 && n !== curProtag);
            const actionOnlyBody = cleanBody
                .replace(/\*[^*\n]+\*/g, "")
                .replace(/[“"「『][^”"」』\n]{0,160}[”"」』]/g, "")
                .replace(/(?:没有|并未|未曾|未能|没能|差点|险些|忍住不|忍住没|不要|别|休想|不许|禁止|拒绝|免谈|想要|渴望|幻想|脑补|梦到|梦里|如果|要是|假装|仿佛|如同|像|好似|准备|打算|将要|累计性交|历史档案|常驻储精|剧情高潮|气氛高潮|情绪高潮|推向高潮|掀起高潮)[^。！？；\n]{0,35}/g, "")
                .split(/[。！？；\n\r]+/)
                .filter(sent => {
                    const s = sent.trim();
                    if (!s) return false;
                    if (/(?:女鬼|厉鬼|怨灵|那名少女|那个女人|女孩|她)/.test(s) && (!curProtag || !s.includes(curProtag))) return false;
                    if (otherRoleNames.length && otherRoleNames.some(oName => s.includes(oName)) && (!curProtag || !s.includes(curProtag))) return false;
                    return (curProtag && s.includes(curProtag)) || /(?:将我|把我|按住我|进入我|插进我|射进我|我的小穴|我的子宫|我的身体|我的嘴|我的后庭)/.test(s);
                })
                .join("。");

            if (!actionOnlyBody) return;

            const rawUvBlock = (floorText.match(/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/i) || [""])[0];
            const hasSetField = (fieldKey) => hasExplicitSet && rawUvBlock.includes(fieldKey);

            if (!isCurrentlyMale) {
                if (!hasSetField("计数.性交.小穴") && /(?:挺身|肉棒|阳具|巨物|龟头|阴茎).{0,15}(?:捅入|插入|贯穿|顶入|没入|抽插|操进).{0,15}(?:小穴|花穴|甬道|蜜穴|肉穴|阴道|子宫)/.test(actionOnlyBody)) cnt.性交.小穴 = safeNum(cnt.性交.小穴) + 1;
                if (!hasSetField("计数.射精.内射") && !hasSetField("子宫毫升") && /(?:内射|射入|灌入|喷洒在|泵入|轰击在|射进).{0,15}(?:子宫|宫腔|小穴深处|花心|甬道深处)/.test(actionOnlyBody)) { cnt.射精.内射 = safeNum(cnt.射精.内射) + 1; sp.子宫毫升 = safeNum(sp.子宫毫升) + 18; sp.小穴毫升 = safeNum(sp.小穴毫升) + 10; gotFreshSemen = true; }
                if (!hasSetField("喷潮") && /(?:潮吹喷涌|喷潮|淫水喷涌而出|潮吹失神)/.test(actionOnlyBody)) cnt.失控.喷潮 = safeNum(cnt.失控.喷潮) + 1;
            }
            if (!hasSetField("计数.性交.口") && /(?:肉棒|阳具|龟头|阴茎).{0,12}(?:塞入|捅入|顶入|深喉|抽插|捅进).{0,12}(?:小嘴|口腔|咽喉|喉管|唇瓣)/.test(actionOnlyBody)) cnt.性交.口 = safeNum(cnt.性交.口) + 1;
            if (!hasSetField("吞精次数") && !hasSetField("口内毫升") && /(?:吞下|咽下|射进嘴|灌进胃|吞精|喝下).{0,15}(?:精液|白浊|浓精)/.test(actionOnlyBody)) { cnt.精液摄入.吞精次数 = safeNum(cnt.精液摄入.吞精次数) + 1; cnt.精液摄入.累计毫升 = safeNum(cnt.精液摄入.累计毫升) + 15; sp.口内毫升 = safeNum(sp.口内毫升) + 15; gotFreshSemen = true; }
            if (!hasSetField("计数.性交.屁眼") && /(?:肉棒|阳具|龟头|阴茎|假阳具|触手).{0,12}(?:捅入|插入|贯穿|抽插|顶入).{0,12}(?:屁眼|后庭|菊穴|肛门|直肠)/.test(actionOnlyBody)) cnt.性交.屁眼 = safeNum(cnt.性交.屁眼) + 1;
            if (!hasSetField("计数.高潮") && /(?:达到高潮|攀上高潮|绝顶高潮|高潮泄身|痉挛着攀上巅峰|全身痉挛着高潮)/.test(actionOnlyBody)) {
                if (userSettings.edgingLockActive) {
                    cnt.高潮.寸止 = safeNum(cnt.高潮.寸止) + 1;
                    targetVars.精神与心理.快感累积 = 99;
                } else {
                    cnt.高潮.总数 = safeNum(cnt.高潮.总数) + 1;
                }
            }
            if (!hasSetField("失禁") && /(?:小便失禁|羞耻地漏尿|黄尿喷涌|尿液失控|失禁漏尿)/.test(actionOnlyBody)) cnt.失控.失禁 = safeNum(cnt.失控.失禁) + 1;
            if (!hasSetField("鞭痕与掌印") && /(?:耳光|掌掴|巴掌|皮鞭|抽打).{0,12}(?:臀|脸|胸|乳)/.test(actionOnlyBody)) mark.鞭痕与掌印 = safeNum(mark.鞭痕与掌印) + 1;
            if (!hasSetField("身体.体力") && /(?:绝顶高潮|猛烈抽插|粗暴贯穿|轮奸|皮鞭抽打|高潮脱力|被操得瘫软)/.test(actionOnlyBody)) {
                const drop = /(?:轮奸|高潮脱力|被操得瘫软|潮吹|失禁)/.test(actionOnlyBody) ? 12 : 6;
                targetVars.身体.体力 = Math.max(0, safeNum(targetVars.身体.体力, 100) - drop);
            }
            if (/(?:内射|吞精|浓精射入|白浊灌入)/.test(actionOnlyBody)) gotFreshSemen = true;
            if (!hasSetField("媚药精液毒瘾") && /(?:灌下|喂下|喝下|注射|涂抹|吸入).{0,10}(?:媚药|春药|催情药|发情毒|淫药)/.test(actionOnlyBody)) targetVars.精神与心理.媚药精液毒瘾 = Math.min(100, safeNum(targetVars.精神与心理.媚药精液毒瘾) + 20);
            if (!hasSetField("淫纹与刻印") && targetVars.痕迹与标记.淫纹与刻印 === "无" && /(?:小腹|下腹|肚脐).{0,15}(?:浮现|烙印|刻上|亮起).{0,12}淫纹/.test(actionOnlyBody)) targetVars.痕迹与标记.淫纹与刻印 = "下腹发光催情淫纹";
            if (!hasSetField("体内道具") && targetVars.体内道具与权限.体内道具 === "无" && /(?:塞入|塞进|顶入|埋入).{0,12}(?:跳蛋|假阳具|震动棒|按摩棒|拉珠|肛塞)/.test(actionOnlyBody)) targetVars.体内道具与权限.体内道具 = "高频震动跳蛋与扩穴玩具";
            if (gotFreshSemen) targetVars.断精回合数 = 0;
            else targetVars.断精回合数 = safeNum(targetVars.断精回合数, 0) + 1;

            targetVars.本轮失控事件 = "";
            if (isLatestFloor) {
                const totalSemen = safeNum(sp.子宫毫升) + safeNum(sp.小穴毫升) + safeNum(sp.屁眼毫升);
                const deterministicRoll = ((cleanBody.length * 37 + floorIdx * 73) % 100);
                if (totalSemen >= 80 && deterministicRoll < 38) {
                    targetVars.本轮失控事件 = "当众漏精滴落";
                } else if (safeNum(cnt.失控?.失禁) >= 6 && deterministicRoll < 28) {
                    targetVars.本轮失控事件 = "括约肌失守漏尿";
                }
            }

            if (typeof targetVars.上次清洗楼层 === "number" && floorIdx < targetVars.上次清洗楼层) {
                sp.口内毫升 = 0; sp.小穴毫升 = 0; sp.子宫毫升 = 0; sp.屁眼毫升 = 0;
            }
            if (!userSettings.autoMetabolism) return;
            if (/(?:花洒|喷头|水流|温水).{0,16}(?:冲刷|冲洗|灌入|洗净).{0,16}(?:甬道|深处|残精|小穴|宫腔)/.test(actionOnlyBody)) {
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.15)); sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.35));
            } else if (/(?:手指|并拢).{0,15}(?:探入|伸入|抠出|洗出|清理).{0,18}(?:残精|白浊|甬道|深处)/.test(actionOnlyBody)) {
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.4)); sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.75));
            }
            if (/(?:漱口|吐出).{0,12}(?:残精|白浊|精液)/.test(actionOnlyBody)) sp.口内毫升 = Math.max(0, Math.round(safeNum(sp.口内毫升) * 0.3));
            if (/(?:沉沉睡去|一觉睡到|次日清晨|第二天早上|醒来时已是|睡了一觉)/.test(actionOnlyBody)) {
                targetVars.身体.体力 = Math.min(100, safeNum(targetVars.身体.体力, 70) + 55);
                targetVars.精神与心理.快感累积 = userSettings.edgingLockActive ? 99 : Math.max(0, Math.round(safeNum(targetVars.精神与心理.快感累积) * 0.15));
                targetVars.核心数值.性欲程度 = Math.max(0, Math.round(safeNum(targetVars.核心数值.性欲程度) * 0.4));
                targetVars.精神与心理.意识清醒度 = Math.min(100, safeNum(targetVars.精神与心理.意识清醒度, 80) + 40);
                sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.2)); sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.4)); sp.口内毫升 = 0;
            }
        }

        function getBreakthroughCaps(v) {
            const mode = userSettings.worldBreakMode || "auto";
            if (mode === "fantasy_unleashed" || mode === "realistic_gore") {
                return { organCap: 100, pregCap: 100, modCap: 100, mentalCap: 100, isRealisticGore: mode === "realistic_gore" };
            }
            if (mode === "realistic_lock") {
                return { organCap: 79, pregCap: 79, modCap: 79, mentalCap: 79, isRealisticGore: true };
            }
            const ctx = safeCtx();
            const recentText = (ctx?.chat || []).slice(-6).map(m => safeStr(m?.mes)).join(" ");
            const c = v?.计数 || {}, mark = v?.痕迹与标记 || {}, prop = v?.体内道具与权限 || {};
            const curSp = getSpeciesSignatureFromDna(v?.档案?.锁定外貌DNA || "");
            const hasFantasyOrMonster = (curSp && curSp !== "human") || safeNum(c.性交?.兽交异种) > 0 || (userSettings.parasiteState?.lv > 0) || /触手贯穿|异种交配|魔物肉棒|虫族产卵|史莱姆寄生|深渊魔物|机械改造肉壶/.test(recentText);
            const hasExtremePhysical = /拳交|扩阴器|扩肛器|宫颈脱垂|直肠脱肛|尿道扩张|宫颈扩张|彻底崩坏|烂肉洞|失禁改造|排泄器/.test(recentText);
            const hasExtremeMod = (mark.淫纹与刻印 && mark.淫纹与刻印 !== "无") || (mark.穿刺与环饰 && mark.穿刺与环饰 !== "无") || (prop.体内道具 && prop.体内道具 !== "无") || /烙铁|刀刻|刺青|钢钉|铅球|电击/.test(recentText);
            const hasExtremeMental = safeNum(v?.精神与心理扩展?.催眠深度) >= 60 || safeNum(v?.精神与心理?.媚药精液毒瘾) >= 60 || safeNum(c.失控?.阿嘿颜) >= 8 || /催眠洗脑|人格粉碎|脑死|母猪化|前额叶/.test(recentText);
            return {
                organCap: hasFantasyOrMonster ? 100 : (hasExtremePhysical ? 95 : 79),
                pregCap:  hasFantasyOrMonster ? 100 : 79,
                modCap:   hasFantasyOrMonster ? 100 : (hasExtremeMod ? 95 : 79),
                mentalCap: hasFantasyOrMonster ? 100 : (hasExtremeMental ? 95 : 79),
                isRealisticGore: !hasFantasyOrMonster
            };
        }

        function lockIrreversible(v, key, curVal, editKeyForGod = "") {
            const isRev = (editKeyForGod === "shame" || editKeyForGod === "sta" || editKeyForGod === "当前姿势" || key.includes("shame") || key.includes("sta"));
            if (editKeyForGod && v.上帝强制锁定 && typeof v.上帝强制锁定[editKeyForGod] === "number") {
                return Math.max(0, Math.min(100, Math.round(v.上帝强制锁定[editKeyForGod])));
            }
            v.历史最高崩坏度 = v.历史最高崩坏度 || {};
            const caps = getBreakthroughCaps(v);
            let maxAllowed = 79;
            if (key.startsWith("organ_")) maxAllowed = caps.organCap;
            else if (key.startsWith("preg_")) maxAllowed = caps.pregCap;
            else if (key.startsWith("mod_")) maxAllowed = caps.modCap;
            else maxAllowed = caps.mentalCap;

            if (isRev) {
                const minAllowed = 100 - maxAllowed;
                const prevMin = (typeof v.历史最高崩坏度[key] === "number") ? Math.max(minAllowed, v.历史最高崩坏度[key]) : 100;
                const clampedCur = Math.max(minAllowed, Math.min(100, Math.round(safeNum(curVal, 100))));
                const lockedVal = Math.min(prevMin, clampedCur);
                if (viewingHistoryFloor === null) v.历史最高崩坏度[key] = lockedVal;
                return lockedVal;
            } else {
                const prevMax = Math.min(maxAllowed, safeNum(v.历史最高崩坏度[key], 0));
                const clampedCur = Math.min(maxAllowed, Math.round(safeNum(curVal, 0)));
                const lockedVal = Math.max(prevMax, clampedCur);
                if (viewingHistoryFloor === null) v.历史最高崩坏度[key] = lockedVal;
                return lockedVal;
            }
        }

        function calcStage6Score(rawPoints, unitWeight = 1.0, diffMult = 3.0, passesStage6Gate = false) {
            if (rawPoints <= 0) {
                return { val: 0, tier: 0, curPts: 0, nextThreshold: Math.max(1, Math.ceil((18 * diffMult) / unitWeight)) };
            }
            const eff = (rawPoints * unitWeight) / Math.max(0.5, diffMult);
            const T1 = 18, T2 = 55, T3 = 125, T4 = 240, T5 = 420;
            let score = 0, nextTargetEff = T1;
            if (eff < T1) { score = Math.max(1, Math.min(19, Math.floor(1 + (eff / T1) * 18))); nextTargetEff = T1; }
            else if (eff < T2) { score = Math.min(39, Math.floor(20 + ((eff - T1) / (T2 - T1)) * 19)); nextTargetEff = T2; }
            else if (eff < T3) { score = Math.min(59, Math.floor(40 + ((eff - T2) / (T3 - T2)) * 19)); nextTargetEff = T3; }
            else if (eff < T4) { score = Math.min(79, Math.floor(60 + ((eff - T3) / (T4 - T3)) * 19)); nextTargetEff = T4; }
            else if (eff < T5) { score = Math.min(99, Math.floor(80 + ((eff - T4) / (T5 - T4)) * 19)); nextTargetEff = T5; }
            else { score = passesStage6Gate ? 100 : 99; nextTargetEff = T5; }
            const realNext = Math.max(Math.ceil(rawPoints) + 1, Math.ceil((nextTargetEff * diffMult) / unitWeight));
            return { val: score, tier: tier6(score, false), curPts: Math.round(rawPoints), nextThreshold: realNext };
        }

        let _organDevCache = { sig: "", res: null };
        function computeAllOrganDevelopments(v) {
            normalizeVarsStructure(v);
            const c = v.计数 || {}, dMult = Math.max(0.5, getDifficultyProfile().mult);
            const cacheSig = `${dMult}_${viewingHistoryFloor}_${JSON.stringify(c)}_${JSON.stringify(v.上帝强制锁定 || {})}_${v.痕迹与标记?.鞭痕与掌印}_${v.受孕与生理?.生产产卵次数}_${v.受孕与生理?.子宫怀孕}`;
            if (_organDevCache.sig === cacheSig && _organDevCache.res) return _organDevCache.res;
            const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼), tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), beast = safeNum(c.性交?.兽交异种);
            const creampie = safeNum(c.射精?.内射), facial = safeNum(c.射精?.颜射体外), swallow = safeNum(c.精液摄入?.吞精次数), swallowMl = safeNum(c.精液摄入?.累计毫升);
            const orgasm = safeNum(c.高潮?.总数), forceOrg = safeNum(c.高潮?.强制), edge = safeNum(c.高潮?.寸止);
            const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁), mast = safeNum(c.自慰), exp = safeNum(c.暴露?.露出);
            const hooker = safeNum(c.交易?.接客卖身), gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
            const milk = safeNum(c.泌乳?.喷乳次数), milkMl = safeNum(c.泌乳?.累计毫升), whip = safeNum(v.痕迹与标记?.鞭痕与掌印);
            const pregCnt = safeNum(v.受孕与生理?.生产产卵次数) + (v.受孕与生理?.子宫怀孕 ? 1 : 0);

            const makeObj = (pts, w, g6, lockKey, godKey) => {
                const o = calcStage6Score(pts, w, dMult, g6);
                o.val = lockIrreversible(v, lockKey, o.val, godKey);
                o.tier = tier6(o.val, false);
                return o;
            };
            const vagObj   = makeObj(vag + mast * 0.4 + creampie * 0.35 + squirt * 0.7 + gang * 1.5, 1.0, vag >= 100 * dMult && orgasm >= 60 * dMult, "organ_vag", "小穴实况");
            const wombObj  = makeObj(creampie * 1.2 + vag * 0.25 + gang * 1.8 + pregCnt * 25, 1.05, creampie >= 90 * dMult, "organ_womb", "子宫实况");
            const mouthObj = makeObj(mouth + swallow * 1.2 + swallowMl / 45, 1.0, (mouth + swallow) >= 85 * dMult, "organ_mouth", "骚口实况");
            const chestObj = makeObj(tit * 1.2 + milk * 1.6 + milkMl / 50 + mast * 0.25, 1.15, (tit + milk) >= 65 * dMult, "organ_chest", "胸部实况");
            const clitObj  = makeObj(orgasm * 0.7 + forceOrg + edge * 1.3 + squirt * 1.5 + leak * 1.8 + mast * 0.5, 1.0, orgasm >= 80 * dMult && (squirt + leak) >= 25 * dMult, "organ_clit", "阴蒂尿道");
            const analObj  = makeObj(anal * 1.3 + leak * 0.8 + gang * 1.4, 1.2, anal >= 65 * dMult, "organ_anal", "屁眼实况");

            const totalLedgerCount = vag + mouth + anal + tit + foot + beast + creampie + facial + swallow + orgasm + edge + squirt + leak + mast + exp + hooker + gang + sleep + milk + whip;
            const sixScores = [vagObj.val, wombObj.val, mouthObj.val, chestObj.val, clitObj.val, analObj.val].sort((a, b) => b - a);
            const top2OrganAvg = Math.round((sixScores[0] + sixScores[1]) / 2);
            const all6OrganAvg = Math.round(sixScores.reduce((a, b) => a + b, 0) / 6);
            const totalWeightedPts = vag * 0.9 + creampie * 1.1 + mouth * 0.7 + swallow * 0.9 + anal + tit * 0.5 + foot * 0.4 + orgasm * 0.45 + (squirt + leak) + mast * 0.35 + exp * 0.8 + hooker * 1.1 + gang * 2.0 + sleep * 1.2 + beast * 2.0 + whip * 0.6;
            const ledgerCurve = calcStage6Score(totalWeightedPts, 0.75, dMult, sixScores[0] >= 100 && totalWeightedPts >= 450 * dMult);
            const compositeScore = (totalLedgerCount === 0 && all6OrganAvg === 0) ? 0 : Math.round(ledgerCurve.val * 0.45 + top2OrganAvg * 0.35 + all6OrganAvg * 0.20);

            const finalRes = { vagObj, wombObj, mouthObj, chestObj, clitObj, analObj, totalLedgerCount, totalWeightedPts, top2OrganAvg, all6OrganAvg, masterCurve: { val: compositeScore, tier: tier6(compositeScore, false), curPts: Math.round(totalWeightedPts), nextThreshold: ledgerCurve.nextThreshold } };
            _organDevCache = { sig: cacheSig, res: finalRes };
            return finalRes;
        }

        function computeUnlockedFetishes(v) {
            const c = v.计数 || {}, dMult = getDifficultyProfile().mult;
            const vag = safeNum(c.性交?.小穴), mouth = safeNum(c.性交?.口), anal = safeNum(c.性交?.屁眼);
            const tit = safeNum(c.性交?.乳穴), foot = safeNum(c.性交?.足腿), creampie = safeNum(c.射精?.内射);
            const swallow = safeNum(c.精液摄入?.吞精次数), orgasm = safeNum(c.高潮?.总数);
            const squirt = safeNum(c.失控?.喷潮), leak = safeNum(c.失控?.失禁), mast = safeNum(c.自慰);
            const exp = safeNum(c.暴露?.露出), hooker = safeNum(c.交易?.接客卖身);
            const milk = safeNum(c.泌乳?.喷乳次数), gang = safeNum(c.交易?.轮奸群交), sleep = safeNum(c.交易?.睡眠昏迷奸);
            const edge = safeNum(c.高潮?.寸止), whip = safeNum(v.痕迹与标记?.鞭痕与掌印), corr = safeNum(v.核心数值?.淫乱恶堕);
            const totalCount = vag + mouth + anal + tit + foot + creampie + swallow + orgasm + squirt + leak + mast + exp + hooker + milk + gang + sleep + whip + edge;
            const resultMap = new Map();

            const upsertAuto = (shortName, originTpl, pts, unitWeight = 1.0, gate6 = false) => {
                if (pts <= 0) return;
                const { val: rawVal, curPts, nextThreshold } = calcStage6Score(pts, unitWeight, dMult, gate6 && corr >= 95);
                const calcVal = lockIrreversible(v, `fet_${shortName}`, rawVal, `fetish_${shortName}`);
                resultMap.set(shortName, { name: shortName, origin: `${originTpl}（畸变点：${curPts} / 下一阶：${nextThreshold}）`, val: calcVal, stage: stageNameFromVal(calcVal), countNow: curPts, nextTarget: nextThreshold });
            };

            upsertAuto("肉穴挨操瘾", `小穴贯穿 ${vag} 次 + 自慰 ${mast} 次 + 内射 ${creampie} 次`, Math.round(vag + mast * 0.4 + creampie * 0.3), 1.0, vag >= 100 * dMult);
            upsertAuto("子宫受精癖", `宫腔无套内射 ${creampie} 次`, Math.round(creampie * 1.2 + vag * 0.2), 1.05, creampie >= 90 * dMult);
            upsertAuto("深喉吞精癖", `口交 ${mouth} 次 + 吞精 ${swallow} 次`, mouth + swallow, 1.0, (mouth + swallow) >= 85 * dMult);
            upsertAuto("后庭扩菊癖", `后庭开发 ${anal} 次`, anal, 1.2, anal >= 65 * dMult);
            upsertAuto("乳交奉侍癖", `乳交 ${tit} 次`, Math.round(tit + mast * 0.25), 1.25, tit >= 50 * dMult);
            upsertAuto("母畜喷乳癖", `挤奶喷乳 ${milk} 次`, milk, 1.5, milk >= 40 * dMult);
            upsertAuto("玉足恋精癖", `足交 ${foot} 次`, foot, 1.3, foot >= 40 * dMult);
            upsertAuto("潮吹失禁癖", `高潮 ${orgasm} 次 + 潮吹 ${squirt} 次 + 失禁 ${leak} 次`, Math.round(orgasm * 0.45 + squirt * 1.8 + leak * 2.2), 1.0, (squirt + leak) >= 30 * dMult);
            upsertAuto("寸止焦躁癖", `寸止折磨 ${edge} 次`, edge, 1.5, edge >= 35 * dMult);
            upsertAuto("受虐痛感转化", `受虐留痕 ${whip} 处`, whip, 1.5, whip >= 40 * dMult);
            upsertAuto("自慰抠穴癖", `自慰抠穴 ${mast} 次`, mast, 1.25, mast >= 45 * dMult);
            upsertAuto("公开露出癖", `赤裸露出 ${exp} 次`, exp, 1.3, exp >= 35 * dMult);
            upsertAuto("轮奸便器癖", `多人轮奸 ${gang} 次`, gang, 1.8, gang >= 25 * dMult);
            upsertAuto("睡奸无防备癖", `睡奸迷奸 ${sleep} 次`, sleep, 1.6, sleep >= 25 * dMult);
            upsertAuto("风尘卖淫癖", `接客卖身 ${hooker} 次`, hooker, 1.0, hooker >= 90 * dMult);

            if (Array.isArray(v.性癖?.条目)) {
                v.性癖.条目.forEach(raw => {
                    const s = safeStr(raw).trim();
                    if (!s || totalCount === 0) return;
                    const parts = s.split("-");
                    const rawName = safeStr(parts[0], "特殊性癖").trim();
                    if (resultMap.has(rawName)) return;
                    const origin = safeStr(parts[1], "长期调教形成").trim();
                    const num = Math.max(1, Math.min(99, calcStage6Score(Math.max(1, totalCount * 0.5), 1.0, dMult, false).val));
                    resultMap.set(rawName, { name: rawName, origin, val: num, stage: stageNameFromVal(num), countNow: totalCount, nextTarget: Math.ceil(totalCount * 1.6 + 20) });
                });
            }
            return Array.from(resultMap.values());
        }

        function calibrateMentalMetrics(v) {
            const dev = computeAllOrganDevelopments(v);
            const fetList = computeUnlockedFetishes(v);
            const fetAvg = fetList.length > 0 ? Math.round(fetList.reduce((acc, f) => acc + f.val, 0) / fetList.length) : 0;

            const applyGodMental = () => {
                const g = v.上帝强制锁定 || {};
                if (typeof g.cockLove === "number") v.核心数值.对肉棒好感度 = g.cockLove;
                if (typeof g.lust === "number") v.核心数值.性欲程度 = g.lust;
                if (typeof g.corr === "number") v.核心数值.淫乱恶堕 = g.corr;
                if (typeof g.shame === "number") v.精神与心理.羞耻度 = g.shame;
                if (typeof g.obey === "number") v.精神与心理.服从度 = g.obey;
                if (typeof g.pleas === "number") v.精神与心理.快感累积 = g.pleas;
                if (typeof g["精神沦陷"] === "number") v.精神与心理.沦陷度 = g["精神沦陷"];
                if (typeof g["媚药毒瘾"] === "number") v.精神与心理.媚药精液毒瘾 = g["媚药毒瘾"];
                if (typeof g["当前姿势"] === "number") v.身体.体力 = g["当前姿势"];
                if (userSettings.edgingLockActive) v.精神与心理.快感累积 = 99;
            };
            if (!userSettings.strictMentalLock) { applyGodMental(); return; }

            const sp = v.体内精液存量 || {};
            const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
            const mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {};

            const hasBodyMod = (mark.公开涂鸦字迹 && mark.公开涂鸦字迹 !== "无") ||
                               (mark.体表痕迹 && mark.体表痕迹 !== "无") ||
                               (mark.淫纹与刻印 && mark.淫纹与刻印 !== "无") ||
                               (mark.穿刺与环饰 && mark.穿刺与环饰 !== "无") ||
                               (prop.体内道具 && prop.体内道具 !== "无");
            const hasHypnoOrGodLock = safeNum(v.精神与心理扩展?.催眠深度) >= 15 ||
                                      (Array.isArray(userSettings.hypnoTriggers) && userSettings.hypnoTriggers.length > 1) ||
                                      (v.上帝强制锁定 && Object.keys(v.上帝强制锁定).length > 0);
            const hasPlayModActive = hasBodyMod || hasHypnoOrGodLock ||
                                     safeNum(userSettings.clothDurability, 100) < 75 ||
                                     (userSettings.objectificationId && userSettings.objectificationId !== "free") ||
                                     userSettings.edgingLockActive ||
                                     safeNum(userSettings.parasiteState?.lv) > 0;

            if (dev.totalLedgerCount === 0 && totalMl === 0 && dev.all6OrganAvg === 0 && !hasPlayModActive) {
                v.核心数值.对肉棒好感度 = Math.min(5, Math.max(0, safeNum(v.核心数值.对肉棒好感度)));
                v.核心数值.淫乱恶堕 = Math.min(5, Math.max(0, safeNum(v.核心数值.淫乱恶堕)));
                v.精神与心理.服从度 = Math.min(8, Math.max(0, safeNum(v.精神与心理.服从度)));
                v.精神与心理.沦陷度 = Math.min(5, Math.max(0, safeNum(v.精神与心理.沦陷度)));
                v.精神与心理.人格崩解度 = 0;
                v.精神与心理.媚药精液毒瘾 = Math.min(5, Math.max(0, safeNum(v.精神与心理.媚药精液毒瘾)));
                v.精神与心理.羞耻度 = Math.max(92, Math.min(100, safeNum(v.精神与心理.羞耻度, 100)));
                v.核心数值.性欲程度 = Math.min(18, Math.max(0, safeNum(v.核心数值.性欲程度)));
                v.精神与心理.快感累积 = Math.min(15, Math.max(0, safeNum(v.精神与心理.快感累积)));
                if (v.精神与心理扩展) v.精神与心理扩展.催眠深度 = Math.min(10, safeNum(v.精神与心理扩展.催眠深度));
                applyGodMental();
                return;
            }

            const caps = getBreakthroughCaps(v);
            const playModBonus = (hasBodyMod ? 18 : 0) +
                                 (userSettings.objectificationId && userSettings.objectificationId !== "free" ? 35 : 0) +
                                 (safeNum(userSettings.parasiteState?.lv) * 12) +
                                 Math.round((100 - safeNum(userSettings.clothDurability, 100)) * 0.25);
            const rawAnchor = Math.round(dev.masterCurve.val * 0.55 + dev.top2OrganAvg * 0.25 + fetAvg * 0.20);
            const anchorScore = Math.min(100, Math.max(rawAnchor, playModBonus));

            const rawMax = (dev.masterCurve.val >= 100 && dev.top2OrganAvg >= 95) ? 100 : 99;
            const hardMax100 = Math.min(caps.mentalCap, rawMax);
            const maxLongTermCap = Math.min(hardMax100, anchorScore + 12);
            const minLongTermFloor = Math.max(0, anchorScore - 8);
            const calibratedHypno = Math.min(safeNum(v.精神与心理扩展?.催眠深度), Math.min(hardMax100, maxLongTermCap + 25));
            if (v.精神与心理扩展) v.精神与心理扩展.催眠深度 = calibratedHypno;
            const finalCap = Math.min(hardMax100, Math.max(maxLongTermCap, Math.round(calibratedHypno * 0.85)));

            const syncMetric = (val, floorOffset = 0, capOffset = 0) => {
                const cur = Math.max(0, Math.min(100, safeNum(val, 0)));
                const low = Math.max(0, Math.min(hardMax100, minLongTermFloor + floorOffset));
                const high = Math.max(low, Math.min(hardMax100, finalCap + capOffset));
                return Math.max(low, Math.min(cur, high));
            };
            v.核心数值.对肉棒好感度 = syncMetric(v.核心数值.对肉棒好感度, -2, 2);
            v.核心数值.淫乱恶堕 = syncMetric(v.核心数值.淫乱恶堕, 0, 0);
            v.精神与心理.服从度 = syncMetric(v.精神与心理.服从度, -2, 3);
            v.精神与心理.沦陷度 = syncMetric(v.精神与心理.沦陷度, -3, 2);
            v.精神与心理.人格崩解度 = syncMetric(v.精神与心理.人格崩解度, -10, -3);
            v.精神与心理.媚药精液毒瘾 = syncMetric(v.精神与心理.媚药精液毒瘾, -5, 4);

            const minShameFloor = hardMax100 === 100 ? 0 : Math.max(1, 100 - finalCap);
            const maxShameCap = Math.max(minShameFloor, 100 - minLongTermFloor);
            v.精神与心理.羞耻度 = Math.max(minShameFloor, Math.min(Math.max(0, Math.min(100, safeNum(v.精神与心理.羞耻度, 100))), maxShameCap));

            const hasActiveStimulus = totalMl > 0 || hasBodyMod || (userSettings.parasiteState?.lv > 0) || safeNum(v.断精回合数) >= 3;
            const shortTermCap = Math.min(100, Math.max(45, anchorScore + 35));
            const lustFloor = hasActiveStimulus ? Math.min(45, Math.round(anchorScore * 0.45)) : Math.min(15, Math.round(anchorScore * 0.15));
            const pleasFloor = hasActiveStimulus ? Math.min(25, Math.round(anchorScore * 0.25)) : 0;
            v.核心数值.性欲程度 = Math.max(lustFloor, Math.min(Math.max(0, safeNum(v.核心数值.性欲程度)), shortTermCap));
            v.精神与心理.快感累积 = Math.max(pleasFloor, Math.min(Math.max(0, safeNum(v.精神与心理.快感累积)), shortTermCap));
            applyGodMental();
        }

        function getOverallCorruptionTier(v) {
            const corr = safeNum(v.核心数值?.淫乱恶堕, 0), cock = safeNum(v.核心数值?.对肉棒好感度, 0), obey = safeNum(v.精神与心理?.服从度, 0), shameRev = 100 - safeNum(v.精神与心理?.羞耻度, 100);
            return tier6(Math.round(corr * 0.45 + cock * 0.2 + obey * 0.2 + shameRev * 0.15), false);
        }

        function pickStageThought(v, thoughtsArray, specificStageVal = null, isRev = false) {
            const mode = userSettings.personaMode || "evolution";
            const t = specificStageVal !== null ? tier6(specificStageVal, isRev) : getOverallCorruptionTier(v);
            const baseThought = thoughtsArray[Math.min(t, thoughtsArray.length - 1)] || thoughtsArray[0];
            if (mode === "despair") return t === 0 ? baseThought : `呜呜……不要再折腾我了……${baseThought.replace(/啊嘿♡|嘻嘻♡|好喜欢/g, "好可怕呜呜")} 求求你放过我吧😭💦……`;
            if (mode === "addicted") return thoughtsArray[Math.min(thoughtsArray.length - 1, Math.max(t + 2, 4))] || baseThought;
            if (mode === "contrast") {
                return !userSettings.contrastInnerActive
                    ? `（表面强装端庄冷静，死死咬紧嘴唇不露声色）……${thoughtsArray[Math.min(1, thoughtsArray.length - 1)]}`
                    : `（私下彻底卸下伪装，眼神迷离拉丝♡）${thoughtsArray[Math.min(thoughtsArray.length - 1, Math.max(t + 2, 4))]}`;
            }
            return baseThought;
        }

        function calcHoleCapacities(v) {
            const c = v.计数 || {}, corr = safeNum(v.核心数值?.淫乱恶堕);
            const mouthCnt = safeNum(c.性交?.口) + safeNum(c.精液摄入?.吞精次数), vagCnt = safeNum(c.性交?.小穴), creampie = safeNum(c.射精?.内射), analCnt = safeNum(c.性交?.屁眼);
            return {
                mouthMax: Math.min(1800, Math.round(45 + mouthCnt * 3.5 + corr * 1.5)),
                vagMax:   Math.min(1200, Math.round(25 + vagCnt * 3.0 + corr * 1.0)),
                wombMax:  Math.min(2000, Math.round(20 + creampie * 5.0 + vagCnt * 1.5 + corr * 1.8)),
                analMax:  Math.min(1800, Math.round(35 + analCnt * 4.5 + corr * 1.5))
            };
        }

        function buildFetishRichDesc(fetishObj, v, u) {
            const { name, origin, val, stage, countNow = 0, nextTarget = 20 } = fetishObj;
            const t = tier6(val, false);
            const apiFet = v.性癖详情?.[name];
            if (apiFet && (apiFet.desc || apiFet.thought)) {
                return `【🧬 性癖】：「${name}」（${stage} · ${val}/100）\n【🔓 成因】：${apiFet.origin || origin}\n【🔞 发作与畸变实况】：\n${apiFet.desc || "该性癖已在体内激活。"}\n💭【${u}的实时心声】：“*${cleanThoughtText(apiFet.thought || "身体产生了一丝奇妙的反应……")}*”`;
            }
            const stageDescs = [
                `【第一阶段·浅层记忆】（${val}/100）：「${name}」刚刚在${u}的肉体上留下最初痕迹（畸变点 ${countNow}/${nextTarget}）。理智上仍保持克制，但被触碰过的粘膜已留下微弱的异物记忆与条件反射般的酥麻感。`,
                `【第二阶段·条件反射】（${val}/100）：「${name}」已进入第二阶段（畸变点 ${countNow}）。只要处于相似情境下，呼吸便会微乱发热，乳尖充血发硬，私处开始不受控地分泌少量透明润滑液。`,
                `【第三阶段·食髓知味】（${val}/100）：「${name}」已深化至第三阶段（畸变点 ${countNow}）。长时间未体验「${name}」时，小腹与肉穴深处会泛起明显的空虚酸痒，在过程中括约肌会本能地顺从收缩配合。`,
                `【第四阶段·深度成瘾】（${val}/100）：「${name}」已达第四阶段（畸变点 ${countNow}）。相应部位神经回路被彻底重塑，面对「${name}」时会丧失自控力地主动迎合索取、敞开双腿流淌淫水。`,
                `【第五阶段·戒断崩解】（${val}/100）：「${name}」已达第五阶段重度畸变（畸变点 ${countNow}）。一旦脱离「${name}」刺激便会产生剧烈躯体戒断抽搐，触发即伴随高潮失禁与大量潮吹喷水。`,
                `【💀 第六阶段·神经强迫症彻底畸变】（100/100 MAX）：「${name}」已100%烧穿大脑皮层并造成不可逆的躯体强迫症畸变（畸变点 ${countNow}）！相关部位肌肉与神经24小时保持迎接「${name}」的病态外翻抽搐造型，一旦强行阻止就会当场发狂自残、喷尿休克！`
            ];
            const stageThoughts = [
                `虽然经历过「${name}」，但我绝不会因此堕落沉迷，必须努力压下身体里那点不自然的异样感。`,
                `奇怪……为什么一遇到「${name}」的苗头，心跳就会变快、身体也开始微微发热发软呢💦？`,
                `身体已经诚实地记住了「${name}」带来的酸麻快感，每当被这样对待时，都会忍不住顺从地迎合上去😳💦。`,
                `哈啊……只要一触发「${name}」，整条脊椎骨都会窜过酥麻的电流，根本没办法抗拒这种深入骨髓的快感呀🥵💦！`,
                `呜汪♡……已经彻底染上「${name}」的重度毒瘾了，不快点对我做「${name}」全身都要抽搐坏掉了🥵💦❤️！`,
                `啊嘿♡……「${name}」已经把我的脑髓和骨头彻底烧穿改造成病态形状了，一旦停止「${name}」我就会当场发狂自残死掉呀🥵💦❤️❤️！`
            ];
            return `【🧬 性癖】：「${name}」（${stage} · ${val}/100）\n【🔓 成因】：${origin}\n【🔞 发作与畸变实况】：\n${stageDescs[t]}\n💭【${u}的实时心声】：“*${pickStageThought(v, stageThoughts, val)}*”`;
        }

        function mergeUserCustomizations(baseVars, cached, currentChatLen) {
            if (!cached) return;
            normalizeVarsStructure(baseVars);
            if (cached.按钮详情) baseVars.按钮详情 = { ...baseVars.按钮详情, ...cached.按钮详情 };
            if (cached.性癖详情) baseVars.性癖详情 = { ...baseVars.性癖详情, ...cached.性癖详情 };
            if (cached.自定义条目) baseVars.自定义条目 = { ...baseVars.自定义条目, ...cached.自定义条目 };
            if (Array.isArray(cached.已屏蔽恩客)) baseVars.已屏蔽恩客 = [...cached.已屏蔽恩客];
            if (Array.isArray(cached.快照?.已删除角色列表)) baseVars.已删除角色列表 = [...cached.快照.已删除角色列表];
            if (Array.isArray(cached.专属相册)) baseVars.专属相册 = [...cached.专属相册];
            if (cached.快照?.档案?.手动锁死外貌Flag && cached.锁定外貌DNA) {
                baseVars.档案 = baseVars.档案 || {};
                baseVars.档案.手动锁死外貌Flag = true;
                baseVars.档案.锁定外貌DNA = cached.锁定外貌DNA;
            }
            if (cached.上帝强制锁定 && typeof cached.上帝强制锁定 === "object") {
                baseVars.上帝强制锁定 = { ...baseVars.上帝强制锁定, ...cached.上帝强制锁定 };
            }
            if (cached.角色独立槽位 && typeof cached.角色独立槽位 === "object") {
                baseVars.角色独立槽位 = baseVars.角色独立槽位 || {};
                Object.keys(baseVars.角色独立槽位).forEach(k => { if (!isValidCharacterName(k)) delete baseVars.角色独立槽位[k]; });
                for (const [rName, cachedSlot] of Object.entries(cached.角色独立槽位)) {
                    if (!isValidCharacterName(rName)) continue;
                    if (!cachedSlot || typeof cachedSlot !== "object") continue;
                    if (!baseVars.角色独立槽位[rName]) {
                        baseVars.角色独立槽位[rName] = JSON.parse(JSON.stringify(cachedSlot));
                    } else {
                        const freshSlot = baseVars.角色独立槽位[rName];
                        freshSlot.按钮详情 = { ...(cachedSlot.按钮详情 || {}), ...(freshSlot.按钮详情 || {}) };
                        freshSlot.上帝强制锁定 = { ...(cachedSlot.上帝强制锁定 || {}), ...(freshSlot.上帝强制锁定 || {}) };
                        freshSlot.历史最高崩坏度 = { ...(cachedSlot.历史最高崩坏度 || {}), ...(freshSlot.历史最高崩坏度 || {}) };
                        if (cachedSlot.锁定外貌DNA && !freshSlot.档案?.锁定外貌DNA) {
                            freshSlot.档案 = freshSlot.档案 || {};
                            freshSlot.档案.锁定外貌DNA = cachedSlot.锁定外貌DNA;
                        }
                    }
                }
            }

            const extState = cached.玩法扩展状态 || cached.快照?.玩法扩展状态;
            if (extState && typeof extState === "object") {
                userSettings.hypnoTriggers = Array.isArray(extState.hypnoTriggers) ? [...extState.hypnoTriggers] : [];
                userSettings.parasiteState = extState.parasiteState ? { ...extState.parasiteState } : { type: "无寄生", lv: 0, eggCount: 0 };
                userSettings.objectificationId = extState.objectificationId || "free";
                userSettings.edgingLockActive = Boolean(extState.edgingLockActive);
                userSettings.clothDurability = safeNum(extState.clothDurability, 100);
            } else {
                userSettings.hypnoTriggers = [];
                userSettings.parasiteState = { type: "无寄生", lv: 0, eggCount: 0 };
                userSettings.objectificationId = "free";
                userSettings.edgingLockActive = false;
                userSettings.clothDurability = 100;
            }

            const isRolledBack = (typeof cached.floorLen === "number" && cached.floorLen > currentChatLen);
            const isRecentActiveChat = !isRolledBack;

            if (isRecentActiveChat && cached.历史最高崩坏度 && typeof cached.历史最高崩坏度 === "object") {
                baseVars.历史最高崩坏度 = { ...baseVars.历史最高崩坏度, ...cached.历史最高崩坏度 };
            }
            if (cached.手动锁定真名) {
                baseVars.档案.手动锁定真名 = cached.手动锁定真名;
                baseVars.档案.当前认知名字 = cached.手动锁定真名;
            }
            if (cached.快照 && !isRolledBack) {
                const s = normalizeVarsStructure(cached.快照);
                if (typeof s.手动总账基准楼层 === "number") baseVars.手动总账基准楼层 = s.手动总账基准楼层;
                if (s.手动总账基准快照) baseVars.手动总账基准快照 = JSON.parse(JSON.stringify(s.手动总账基准快照));
                if (typeof s.手动精液基准楼层 === "number") baseVars.手动精液基准楼层 = s.手动精液基准楼层;
                if (s.手动精液基准快照) baseVars.手动精液基准快照 = JSON.parse(JSON.stringify(s.手动精液基准快照));

                ["档案", "穿搭", "受孕与生理", "精神与心理扩展", "痕迹与标记", "体内道具与权限", "实况"].forEach(k => {
                    if (s[k] && typeof s[k] === "object") {
                        baseVars[k] = baseVars[k] || {};
                        Object.entries(s[k]).forEach(([subKey, val]) => {
                            if (k === "档案" && (subKey === "锁定外貌DNA" || subKey === "当前提取形象摘要") && !s.档案?.手动锁死外貌Flag) {
                                return;
                            }
                            if (val !== "" && val !== "无" && val !== 0 && (!baseVars[k][subKey] || baseVars[k][subKey] === "无" || isRecentActiveChat)) {
                                baseVars[k][subKey] = val;
                            }
                        });
                    }
                });
                const FLOATING_KEYS = new Set(["性欲程度", "快感累积", "意识清醒度"]);
                ["核心数值", "精神与心理"].forEach(k => {
                    if (s[k] && typeof s[k] === "object") {
                        Object.entries(s[k]).forEach(([subKey, val]) => {
                            if (typeof val !== "number") return;
                            if (FLOATING_KEYS.has(subKey)) {
                                if (isRecentActiveChat && baseVars[k][subKey] === (subKey === "意识清醒度" ? 100 : 0)) {
                                    baseVars[k][subKey] = val;
                                }
                            } else if (subKey === "羞耻度") {
                                baseVars[k][subKey] = Math.min(safeNum(baseVars[k][subKey], 100), val);
                            } else {
                                baseVars[k][subKey] = Math.max(safeNum(baseVars[k][subKey], 0), val);
                            }
                        });
                    }
                });
                if (isRecentActiveChat && s.身体 && typeof s.身体.体力 === "number") {
                    baseVars.身体.体力 = Math.min(safeNum(baseVars.身体.体力, 100), s.身体.体力);
                }
                if (isRecentActiveChat && !s.已手动清空精液 && s.体内精液存量 && typeof s.体内精液存量 === "object") {
                    const hasManualSemenBase = (typeof s.手动精液基准楼层 === "number" && s.手动精液基准楼层 <= currentChatLen);
                    const isSameFloorManual = (s.手动精液调整楼层 === currentChatLen);
                    ["口内毫升", "小穴毫升", "子宫毫升", "屁眼毫升"].forEach(mlK => {
                        if (isSameFloorManual) {
                            baseVars.体内精液存量[mlK] = safeNum(s.体内精液存量[mlK], 0);
                        } else if (!hasManualSemenBase) {
                            baseVars.体内精液存量[mlK] = Math.max(safeNum(baseVars.体内精液存量[mlK], 0), safeNum(s.体内精液存量[mlK], 0));
                        }
                    });
                }
                const hasManualLedgerBase = (typeof s.手动总账基准楼层 === "number" && s.手动总账基准楼层 <= currentChatLen);
                if (s.计数 && typeof s.计数 === "object" && !hasManualLedgerBase) {
                    Object.keys(s.计数).forEach(subK => {
                        if (typeof s.计数[subK] === "object" && s.计数[subK] !== null) {
                            if (typeof baseVars.计数[subK] !== "object" || baseVars.计数[subK] === null) baseVars.计数[subK] = {};
                            Object.entries(s.计数[subK]).forEach(([cKey, cVal]) => {
                                if (typeof cVal === "number") baseVars.计数[subK][cKey] = Math.max(safeNum(baseVars.计数[subK][cKey], 0), cVal);
                            });
                        } else if (typeof s.计数[subK] === "number" && typeof baseVars.计数[subK] === "number") {
                            baseVars.计数[subK] = Math.max(safeNum(baseVars.计数[subK], 0), s.计数[subK]);
                        }
                    });
                }
            }
            normalizeVarsStructure(baseVars);
        }

        function extractClientsFromHistory(v, u, c) {
            const ctx = safeCtx(), fullText = (ctx?.chat || []).map(m => safeStr(m?.mes)).join("\n");
            const recentText = (ctx?.chat || []).slice(-6).map(m => safeStr(m?.mes)).join("\n");
            const clientMap = new Map(), blockedSet = new Set(Array.isArray(v.已屏蔽恩客) ? v.已屏蔽恩客 : []);
            const rawUser = safeStr(ctx?.name1).trim(), oldSelfName = safeStr(v.档案?.原身旧名).trim(), curSelfName = safeStr(u).trim();

            const autoOldNames = new Set([rawUser, oldSelfName, curSelfName, "主角", "玩家"].filter(Boolean));
            const transMatches = [
                ...fullText.matchAll(/([^\s，。！？、“”"'\(\)（）]{2,6})(?:就是|变成了|变成|化作|重塑为)\s*([^\s，。！？、“”"'\(\)（）]{2,8})/g),
                ...fullText.matchAll(/(?:男大学生|原身|原本是)\s*([^\s，。！？、“”"'\(\)（）]{2,6})/g)
            ];
            transMatches.forEach(m => { if (m[1]) autoOldNames.add(m[1].trim()); });

            const NON_HUMAN_REGEX = /^(?:\d+|主角|你|我|她|他|它|原身|前世|身体|少女|女人|女生|男生们|无|未知|旁白|系统|主持人|DM|道具|物品|武器|跳蛋|假阳具|按摩棒|贞操带|项圈|手铐|锁链|绳子|鞭子|皮鞭|蜡烛|口球|眼罩|衣服|上衣|内裤|底裤|胸罩|文胸|丝袜|黑丝|白丝|高跟鞋|鞋子|裙子|睡裙|床单|床垫|被子|枕头|纸巾|纸团|毛巾|花洒|水龙头|镜子|手机|相机|黄瓜|香蕉|瓶子|酒瓶|触手|玩具)$/;
            const isInvalidClient = (candName) => {
                if (!candName) return true;
                const n = String(candName).trim();
                if (n.length < 2 || n.length > 12 || blockedSet.has(n) || autoOldNames.has(n) || NON_HUMAN_REGEX.test(n)) return true;
                for (const bad of autoOldNames) {
                    if (bad && (n === bad || n.includes(bad))) return true;
                }
                if (/(?:笔|棒|球|环|链|衣|裤|裙|袜|鞋|帽|巾|床|桌|椅|门|窗|灯|水|液|药|剂|器|具|穴|乳|胸|臀|腿|足|口|唇|手|指|系统|之神|档案)$/.test(n) && !/(?:男人|少爷|老板|大师|师兄|师尊|徒弟|老公|丈夫|学长|同学|老师|男生|大叔|青年|粉丝|死忠粉)/.test(n)) return true;
                return false;
            };

            if (v.恩客图鉴 && typeof v.恩客图鉴 === "object") {
                Object.keys(v.恩客图鉴).forEach(k => {
                    if (isInvalidClient(k)) delete v.恩客图鉴[k];
                });
            }

            const creampie = safeNum(v.计数?.射精?.内射), vagCnt = safeNum(v.计数?.性交?.小穴), mouthCnt = safeNum(v.计数?.性交?.口), wombMl = safeNum(v.体内精液存量?.子宫毫升);
            const totalSex = vagCnt + mouthCnt + creampie + safeNum(v.计数?.性交?.屁眼);
            const corr = safeNum(v.核心数值?.淫乱恶堕);
            const nameHash = (str) => { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100; return h; };
            const upsertClient = (name, roleTag, cockDesc, statusTag, contribPts, dnaShare, detailDesc, thoughtArr) => {
                if (isInvalidClient(name)) return;
                const cVal = Math.min(100, Math.max(5, Math.round(contribPts)));
                clientMap.set(name, { name, roleTag, cockDesc, statusTag, val: cVal, dnaShare, detailDesc, thoughtStr: Array.isArray(thoughtArr) ? pickStageThought(v, thoughtArr, cVal) : thoughtArr });
            };

            if (v.恩客图鉴 && typeof v.恩客图鉴 === "object") {
                const entries = Object.entries(v.恩客图鉴).filter(([k]) => !isInvalidClient(k));
                entries.forEach(([k, val]) => {
                    const descStr = typeof val === "object" ? JSON.stringify(val) : String(val);
                    const score = Math.min(100, Math.max(15, 28 + vagCnt * 1.8 + creampie * 2.5 + ((nameHash(k) % 18) - 6)));
                    const share = wombMl > 0 ? Math.max(10, Math.round(100 / Math.max(1, entries.length))) : 0;
                    upsertClient(k, "专属调教恩客", "雄性阳具", "已建立肉体烙印", score, share, `【🍆 恩客档案】：${k}\n【📊 肉体崩坏改造记录】：${descStr}`,
                        [`想到【${k}】，我心里还是保持着戒备与距离感。`,`身体已经渐渐记住了【${k}】的气息，面对他时很难完全平静💦。`,`每次回想起与【${k}】的接触，被撑开过的粘膜深处就会泛起一丝酸麻感😳💦。`,`一闻到【${k}】的气味，合不拢的肉穴就会不自觉地发软淌水🥵💦！`,`已经彻底被【${k}】操成他专属的形状了，离开他的粗暴玩弄就活不下去🥵💦❤️！`,`啊嘿♡……全身孔穴都已经被【${k}】彻底操烂改造成专属排泄便池啦🥵💦❤️❤️！`]);
                });
            }

            if (clientMap.size === 0 && (totalSex > 0 || wombMl > 0)) {
                const sexSents = recentText.split(/[。！？；\n\r]+/).filter(s => /(?:肉棒|阳具|龟头|阴茎|插入|捅入|抽插|内射|深喉|口交|侵犯|按在身下|挺腰)/.test(s)).join("\n");
                const npcRegex = /(体育系男生|黑皮体育生|金发黄毛|猥琐大叔|中年大叔|肥猪老板|教导主任|流浪汉|死忠粉|狂热粉丝|学长|室友)/g;
                const foundNpcs = [...new Set([...sexSents.matchAll(npcRegex)].map(m => m[1]))].filter(n => !isInvalidClient(n));
                foundNpcs.slice(0, 3).forEach((npcName, idx) => {
                    const score = Math.min(100, Math.max(25, 45 + corr * 0.4 - idx * 10));
                    const share = wombMl > 0 ? Math.round(100 / foundNpcs.slice(0, 3).length) : 0;
                    upsertClient(npcName, "猎食/交合对象", "滚烫粗大肉棒", "肉体交合中", score, share,
                        `【🍆 恩客档案】：${npcName}\n【📊 肉体互动实况】：近期正文中正在与${u}发生亲密肉体接触或灌精的雄性目标。`,
                        [`面对【${npcName}】，我心里依然保留着最后的矜持防线。`,`身体已经开始适应【${npcName}】的温度与摆弄了💦。`,`每次被【${npcName}】触碰，熟稔的肉壁都会本能地收缩迎合😳💦。`,`只要【${npcName}】一靠近，我的骚穴和嘴巴就会不自觉地发痒流涎🥵💦！`,`从里到外都已经被【${npcName}】的大肉棒彻底勾起发情本能了🥵💦❤️！`,`啊嘿♡……快让【${npcName}】把人家的精盆肚子彻底灌满吧🥵💦❤️❤️！`]);
                });
            }
            return Array.from(clientMap.values());
        }

        const customTopWidgets = [];
        const customDirectorButtons = [];
        const customPromptRules = [];

        function varsToCompactSummary(userName, v) {
            const dev = computeAllOrganDevelopments(v), sp = v.体内精液存量 || {}, c = v.计数 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {};
            const { odorPct, socialPct } = computeOdorAndExposureMetrics(v, dev);
            const pMode = RUIN_PERSONA_MODES[userSettings.personaMode || "evolution"]?.label || "进化树";
            return `${userName}[模式:${pMode}]: 体力=${safeNum(v.身体?.体力, 100)}%, 恶堕=${safeNum(v.核心数值?.淫乱恶堕)}%, 好感=${safeNum(v.核心数值?.对肉棒好感度)}%, 性欲=${safeNum(v.核心数值?.性欲程度)}%, 羞耻=${safeNum(v.精神与心理?.羞耻度, 100)}%, 服从=${safeNum(v.精神与心理?.服从度)}%, 快感=${safeNum(v.精神与心理?.快感累积)}% | ` +
                   `六孔崩坏: 口=${dev.mouthObj.val}%(Lv.${dev.mouthObj.tier+1}), 乳=${dev.chestObj.val}%(Lv.${dev.chestObj.tier+1}), 穴=${dev.vagObj.val}%(Lv.${dev.vagObj.tier+1}), 宫=${dev.wombObj.val}%(Lv.${dev.wombObj.tier+1}), 蒂尿=${dev.clitObj.val}%(Lv.${dev.clitObj.tier+1}), 菊=${dev.analObj.val}%(Lv.${dev.analObj.tier+1}) | ` +
                   `储精: 宫=${safeNum(sp.子宫毫升)}ml, 穴=${safeNum(sp.小穴毫升)}ml, 胃=${safeNum(sp.口内毫升)}ml, 肠=${safeNum(sp.屁眼毫升)}ml | 气味=${odorPct}%, 社死=${socialPct}% | ` +
                   `总账: 穴=${safeNum(c.性交?.小穴)}, 内射=${safeNum(c.射精?.内射)}, 口=${safeNum(c.性交?.口)}, 菊=${safeNum(c.性交?.屁眼)}, 高潮=${safeNum(c.高潮?.总数)}, 失禁=${safeNum(c.失控?.失禁)} | ` +
                   `标记: 痕=${safeStr(mark.体表痕迹, "无")}, 纹=${safeStr(mark.淫纹与刻印, "无")}, 具=${safeStr(prop.体内道具, "无")}, 归属=${safeStr(prop.肉体所有权, "自由身")}`;
        }

        function buildReverseBodyEnforcementRules(u, v) {
            if (!userSettings.injectReversePrompt) return "";
            const dev = computeAllOrganDevelopments(v), sp = v.体内精液存量 || {}, totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
            const { odorPct, odorStg, socialPct, socialStg } = computeOdorAndExposureMetrics(v, dev);
            const corr = safeNum(v.核心数值?.淫乱恶堕), mode = userSettings.personaMode || "evolution", rules = [];
            if (mode === "despair") rules.push(`- 【💧彻底绝望型人格】：正文中${u}面对侵犯都处于绝望哭泣、求饶与失禁哀鸣状态！`);
            else if (mode === "addicted") rules.push(`- 【🥵沉沦变态型人格】：正文中${u}会主动掰开肉洞乞求更粗暴的灌精与改造！`);
            else if (mode === "contrast") rules.push(userSettings.contrastInnerActive ? `- 【🎭私下母畜态】：${u}完全卸下伪装，极度饥渴下流！` : `- 【🎭表面伪装态】：${u}表面强装端庄，裙底实则湿透漏精暗颤！`);

            const curDnaTags = getLockedAppearanceTags(u, v);
            const curSpeciesSig = getSpeciesSignatureFromDna(curDnaTags);
            if (curSpeciesSig && curSpeciesSig !== "human") {
                rules.push(`- 【🧬当前种族与躯体形态铁律(${v.档案?.当前提取形象摘要 || curSpeciesSig})】：当前${u}的躯体形态特征为「${v.档案?.当前提取形象摘要 || curDnaTags}」，正文中一切肢体动作、交合姿势、衣装穿戴与体液流淌描写必须100%契合该形态的解剖结构（如无腿蛇尾/触手/史莱姆流体/特殊器官），严禁写出与该形态冲突的普通人类肢体描写！`);
            }

            const objTier = OBJECTIFICATION_TIERS.find(t => t.id === userSettings.objectificationId);
            if (objTier && objTier.promptRule) {
                rules.push(`- 【🪑肉体物化生态位(${objTier.label})】：${u}${objTier.promptRule}`);
            }

            if (userSettings.edgingLockActive) {
                rules.push(`- 【🔒寸止地狱锁生效中(快感卡死99%)】：无论${u}在本轮受到多么强烈的抽插、玩弄或刺激，快感都死死卡在99%临界点无法真正泄身高潮！必须细致描写她全身痉挛、小腹抽搐、哭喊乞求赐予高潮的焦躁寸止反应！`);
            }

            if (dev.totalLedgerCount === 0 && totalMl === 0 && corr < 15 && dev.all6OrganAvg === 0 && mode === "evolution") {
                rules.push(`- 【🌸完好清白状态(Lv.1)】：当前${u}六孔紧闭完好，若无实质侵犯须保持端庄矜持。`);
            } else {
                if (dev.vagObj.tier >= 1) rules.push(`- 【🌺小穴Lv.${dev.vagObj.tier + 1}(${dev.vagObj.val}%)】：${ORGAN_STAGE_SHAPES["小穴实况"][dev.vagObj.tier]}（正文中描写私处时必须严格符合此阶段形态，${dev.vagObj.tier >= 3 ? "严禁写紧致如处女！" : ""}）`);
                if (dev.wombObj.tier >= 1) rules.push(`- 【🫀子宫Lv.${dev.wombObj.tier + 1}(${dev.wombObj.val}%)】：${ORGAN_STAGE_SHAPES["子宫实况"][dev.wombObj.tier]}`);
                if (dev.mouthObj.tier >= 2) rules.push(`- 【👄骚口Lv.${dev.mouthObj.tier + 1}(${dev.mouthObj.val}%)】：${ORGAN_STAGE_SHAPES["骚口实况"][dev.mouthObj.tier]}`);
                if (dev.chestObj.tier >= 2) rules.push(`- 【🍒丰乳Lv.${dev.chestObj.tier + 1}(${dev.chestObj.val}%)】：${ORGAN_STAGE_SHAPES["胸部实况"][dev.chestObj.tier]}`);
                if (dev.clitObj.tier >= 2) rules.push(`- 【💧阴蒂尿道Lv.${dev.clitObj.tier + 1}(${dev.clitObj.val}%)】：${ORGAN_STAGE_SHAPES["阴蒂尿道"][dev.clitObj.tier]}`);
                if (dev.analObj.tier >= 2) rules.push(`- 【🕳️后庭Lv.${dev.analObj.tier + 1}(${dev.analObj.val}%)】：${ORGAN_STAGE_SHAPES["屁眼实况"][dev.analObj.tier]}`);
                if (totalMl > 0) rules.push(`- 【🥛体内储精${totalMl}ml（宫腔${safeNum(sp.子宫毫升)}ml/小穴${safeNum(sp.小穴毫升)}ml/胃袋${safeNum(sp.口内毫升)}ml/直肠${safeNum(sp.屁眼毫升)}ml）】：正文中走动、站立或说话时须写出下腹沉甸甸坠胀晃荡与白浊顺大腿根滴淌的细节！`);
            }
            if (odorPct >= 35) {
                rules.push(`- 【👃体液腌入味气味(${odorStg}·${odorPct}%)】：${u}身上散发着浓烈的精液石楠腥味与发情雌香，周围男性靠近时会立刻闻到并产生强烈反应！`);
            }
            if (socialPct >= 35) {
                rules.push(`- 【📡社死曝光度(${socialStg}·${socialPct}%)】：${u}的不雅把柄或淫名已在外流传，周围路人或熟人看她的眼神充满视奸、轻蔑与占有欲！`);
            }
            if (safeNum(v.断精回合数) >= 3 && (safeNum(v.精神与心理?.媚药精液毒瘾) >= 30 || corr >= 45)) {
                rules.push(`- 【⏳断精戒断发作(已断精${v.断精回合数}轮)】：当前${u}体内精液戒断症剧烈发作，全身燥热颤抖，在正文中会不自觉摩擦双腿并主动索求雄性精液！`);
            }
            if (v.本轮失控事件) {
                rules.push(`- 【🎲本轮突发肉体失控(${v.本轮失控事件})】：正文中必须自然穿插描写${u}在行动或说话中途突然夹不住而发生【${v.本轮失控事件}】的羞耻场面！`);
            }
            if (safeNum(userSettings.clothDurability, 100) <= 45) {
                rules.push(`- 【👗衣装破损度(${100 - safeNum(userSettings.clothDurability, 100)}%)】：当前${u}衣物严重撕裂走光，行动间春光外泄！`);
            }
            if (userSettings.parasiteState?.lv > 0 && userSettings.parasiteState?.type !== "无寄生") {
                rules.push(`- 【🦠异种寄生(${userSettings.parasiteState.type} Lv.${userSettings.parasiteState.lv})】：体内寄生生物正在蠕动分泌催情粘液（怀卵数：${userSettings.parasiteState.eggCount}）！`);
            }
            if (Array.isArray(userSettings.hypnoTriggers) && userSettings.hypnoTriggers.length > 0) {
                rules.push(`- 【🔔催眠条件反射钢印】：${userSettings.hypnoTriggers.join("；")}（一旦正文中出现触发条件，身体必须无视理智强制执行反应！）`);
            }
            if (v.本轮后台静默指令) {
                rules.push(`- 【⚡后台静默状态变更（严禁在正文中复读指令字面，直接自然融入剧情描写）】：${v.本轮后台静默指令}`);
            }
            customPromptRules.forEach(fn => { try { const r = fn(u, v); if (r) rules.push(`- ${r}`); } catch (e) {} });
            if (userSettings.customExtraPrompt && safeStr(userSettings.customExtraPrompt).trim()) {
                rules.push(`- 【🛠️自定义铁律】：${safeStr(userSettings.customExtraPrompt).trim().replace(/{user}/g, u)}`);
            }
            if (Array.isArray(v.待同步场外变动) && v.待同步场外变动.length > 0) {
                rules.unshift(`- 【⚡本轮玩家在状态栏触发的即时调教与数值变动（最高优先级！必须在本轮正文中立刻、直观地描写出来！）】：\n  👉 ${v.待同步场外变动.join("；\n  👉 ")}`);
            }
            return rules.length ? `\n【🚨状态栏1.0各阶段生理与剧情强制同步铁律】\n${rules.join("\n")}\n` : "";
        }

        function buildFullSystemPrompt(userName, currentVars) {
            const compactSnap = varsToCompactSummary(userName, currentVars), reverseRules = buildReverseBodyEnforcementRules(userName, currentVars);
            const c = currentVars.计数 || {}, sp = currentVars.体内精液存量 || {}, openTag = "<UpdateVariable>", closeTag = "</UpdateVariable>";
            if (userSettings.compactPromptMode) {
                return `\n[系统后台只读状态参考（⚠️严禁在正文或回复中复读、输出此状态快照文本！）: ${compactSnap}]${reverseRules}\n[后台变量静默更新指令：请在小说正文最末尾（</game>或</options>之后）仅输出唯一闭合的 ${openTag}...${closeTag} 代码块来更新有变化的项，严禁输出【状态快照】四个字！]：\n${openTag}\n_.set('${userName}.身体.体力', ${safeNum(currentVars.身体?.体力, 100)});\n_.set('${userName}.核心数值.性欲程度', ${safeNum(currentVars.核心数值?.性欲程度)});\n_.set('${userName}.精神与心理.快感累积', ${safeNum(currentVars.精神与心理?.快感累积)});\n_.set('${userName}.计数.性交.小穴', ${safeNum(c.性交?.小穴)});\n_.set('${userName}.计数.射精.内射', ${safeNum(c.射精?.内射)});\n_.set('${userName}.计数.高潮.总数', ${safeNum(c.高潮?.总数)});\n_.set('${userName}.计数.失控.失禁', ${safeNum(c.失控?.失禁)});\n_.set('${userName}.体内精液存量.子宫毫升', ${safeNum(sp.子宫毫升)});\n_.set('${userName}.实况.当前姿势', '简短姿势');\n_.set('${userName}.实况.内心独白', '第一人称心声');\n${closeTag}`;
            }
            const diff = getDifficultyProfile(), mark = currentVars.痕迹与标记 || {}, prop = currentVars.体内道具与权限 || {};
            return `\n[系统后台只读状态参考（⚠️严禁在回复中输出此快照文本！难度：${diff.mult}x｜身份：${detectRealCharacterIdentity(currentVars)}）: ${compactSnap}]${reverseRules}\n[🔥状态变量后台静默更新规范：全篇最末尾仅输出唯一闭合的 ${openTag}...${closeTag}，严禁输出【状态快照】文本！]：\n${openTag}\n_.set('${userName}.身体.体力', ${safeNum(currentVars.身体?.体力, 100)});\n_.set('${userName}.核心数值.性欲程度', ${safeNum(currentVars.核心数值?.性欲程度)});\n_.set('${userName}.精神与心理.快感累积', ${safeNum(currentVars.精神与心理?.快感累积)});\n_.set('${userName}.计数.性交.口', ${safeNum(c.性交?.口)});\n_.set('${userName}.计数.性交.小穴', ${safeNum(c.性交?.小穴)});\n_.set('${userName}.计数.性交.屁眼', ${safeNum(c.性交?.屁眼)});\n_.set('${userName}.计数.射精.内射', ${safeNum(c.射精?.内射)});\n_.set('${userName}.计数.精液摄入.吞精次数', ${safeNum(c.精液摄入?.吞精次数)});\n_.set('${userName}.计数.高潮.总数', ${safeNum(c.高潮?.总数)});\n_.set('${userName}.计数.失控.喷潮', ${safeNum(c.失控?.喷潮)});\n_.set('${userName}.计数.失控.失禁', ${safeNum(c.失控?.失禁)});\n_.set('${userName}.体内精液存量.口内毫升', ${safeNum(sp.口内毫升)});\n_.set('${userName}.体内精液存量.小穴毫升', ${safeNum(sp.小穴毫升)});\n_.set('${userName}.体内精液存量.子宫毫升', ${safeNum(sp.子宫毫升)});\n_.set('${userName}.体内精液存量.屁眼毫升', ${safeNum(sp.屁眼毫升)});\n_.set('${userName}.痕迹与标记.体表痕迹', '${safeStr(mark.体表痕迹, "无")}');\n_.set('${userName}.痕迹与标记.淫纹与刻印', '${safeStr(mark.淫纹与刻印, "无")}');\n_.set('${userName}.痕迹与标记.穿刺与环饰', '${safeStr(mark.穿刺与环饰, "无")}');\n_.set('${userName}.体内道具与权限.体内道具', '${safeStr(prop.体内道具, "无")}');\n_.set('${userName}.实况.当前姿势', '简短概括当前姿势');\n_.set('${userName}.实况.内心独白', '符合当前崩坏阶位的第一人称心声');\n${closeTag}`;
        }

        // =========================================================================
        // 🧬 开放式动态主要特征挖掘器 + 状态栏按钮描述优先识图引擎
        // =========================================================================
        const OPEN_MORPH_DICTIONARY = [
            { reg: /不可名状|克苏鲁|古神|旧日支配者|外神|深渊眷族|混沌肉块|蠕动肉山|肉瘤|千眼|多眼怪|眼球怪|黑泥怪|血肉畸变|eldritch|abomination|flesh mound|shoggoth/i, id: "eldritch_horror", cn: "👁️不可名状异形", en: "eldritch abomination, surreal horror monster morphology, writhing flesh mound, multiple glowing eyes on body, dark slime tendrils", lower: "nonhuman_eldritch", skin: "eldritch_flesh", isNonHumanForm: true },
            { reg: /史莱姆娘|粘液娘|流体娘|果冻状身躯|半透明果冻|融化成史莱姆|胶质躯体|变成.*?史莱姆|化作.*?史莱姆|slime girl|translucent gelatinous body|liquid body/i, id: "slime_fluid", cn: "🫧史莱姆/流体", en: "slime girl, monster girl, translucent gelatinous body, semi-transparent glowing slime flesh, dripping viscous fluid", lower: "nonhuman_slime", skin: "slime_gel", isNonHumanForm: false },
            { reg: /触手娘|触手怪|八爪鱼娘|章鱼娘|乌贼娘|下半身是.*?触手|双腿变成.*?触手|活体苗床母体|tentacle girl|octopus girl|cecaelia/i, id: "tentacle_morph", cn: "🐙触手异形形态", en: "monster girl, cecaelia, writhing tentacles instead of legs, suction cups, glistening biological mucus", lower: "nonhuman_tentacles", skin: "mucus_skin", isNonHumanForm: false },
            { reg: /美女蛇|蛇女|拉米亚|半人半蛇|蛇尾人身|人身蛇尾|下半身是.*?蛇尾|长长的蛇尾|盘起蛇尾|粗壮蛇躯|变成.*?蛇|lamia|snake tail|snake girl|naga/i, id: "lamia_snaketail", cn: "🐍美女蛇(蛇尾)", en: "lamia, snake girl, monster girl, long thick coiled snake tail instead of legs, glistening snake scales on lower body, slit pupils", lower: "nonhuman_snaketail", skin: "snake_scales", isNonHumanForm: false },
            { reg: /美人鱼|人鱼娘|海妖|塞壬|下半身是.*?鱼尾|长出鱼尾|鲛人|mermaid|siren|fish tail/i, id: "mermaid_fishtail", cn: "🧜‍♀️美人鱼(鱼尾)", en: "mermaid, monster girl, long shimmering fish tail instead of legs, iridescent fish scales, aquatic tail fins", lower: "nonhuman_fishtail", skin: "fish_scales", isNonHumanForm: false },
            { reg: /蜘蛛娘|络新妇|下半身是.*?蛛腹|虫族女皇|虫娘|虫母|虫后|昆虫娘|螳螂娘|蜂后|蝎女|arachne|spider girl|insect girl/i, id: "insect_arachne", cn: "🕷️虫族/蜘蛛娘", en: "arachne, insectoid monster girl, giant spider abdomen lower body, multiple chitinous arthropod legs, glossy exoskeleton", lower: "nonhuman_arachne", skin: "chitin_carapace", isNonHumanForm: false },
            { reg: /机械娘|机娘|赛博改造人|机械义体|机械骨架|球形关节人偶|人偶娘|硅胶娃娃之躯|充气娃娃之躯|cyborg girl|android girl|mechanical doll|ball-jointed doll/i, id: "cyber_doll", cn: "🤖机械/关节人偶", en: "cyborg doll girl, exposed mechanical joints, ball-jointed doll seams on body, glowing cybernetic circuits, synthetic glossy skin", lower: "human_mech", skin: "cyber_doll_skin", isNonHumanForm: false },
            { reg: /花妖|树精|植物娘|藤蔓娘|食人花娘|alraune|plant girl|dryad/i, id: "plant_alraune", cn: "🌺花妖/藤蔓娘", en: "alraune, plant monster girl, lower body nestled in giant blooming flower petals and writhing vine tendrils", lower: "nonhuman_plant", skin: "petal_skin", isNonHumanForm: false },
            { reg: /哈比|鸟娘|鹰身女妖|羽翼手臂|鸟爪双足|harpy|bird girl/i, id: "harpy_bird", cn: "🦅哈比鸟娘", en: "harpy, bird monster girl, feathered wings, bird talons instead of feet, tail feathers", lower: "nonhuman_talons", skin: "feathered_skin", isNonHumanForm: false },
            { reg: /半人马|人马娘|下半身是马身|centaur/i, id: "centaur_horse", cn: "🐎半人马娘", en: "centaur, monster girl, equine horse lower body, four horse legs, horse tail", lower: "nonhuman_centaur", skin: "human", isNonHumanForm: false },
            { reg: /鬼怪|女鬼|厉鬼|恶鬼|怨灵|幽灵|凶灵|水鬼|艳鬼|画皮鬼|吸精鬼|吞精鬼|淫丝鬼|吸髓鬼|溺水鬼|吊死鬼|无头鬼|青鬼|赤鬼|般若|罗刹|(?:变成|化作|身为|一只|一具)[\u4e00-\u9fa5]{1,6}鬼|诡异女鬼|半透明灵体|僵尸娘|丧尸娘|骷髅娘|亡灵娘|ghost girl|undead girl|zombie girl|yurei|oni girl/i, id: "undead_ghost", cn: "👻鬼怪/女鬼", en: "ghost girl, supernatural apparition, pale cold skin, eerie dark mist aura", lower: "human_legs", skin: "undead_pale", isNonHumanForm: false },
            { reg: /变成.*?母猪|化作.*?母猪|一头母猪|家畜母猪|长出猪鼻|长出猪蹄|pig morph|actual pig|swine morph/i, id: "livestock_pig", cn: "🐷母猪/家畜形态", en: "anthropomorphic pig girl, pig ears, pig snout, curly pig tail, cloven hooves, plump pinkish livestock body", lower: "nonhuman_hooves", skin: "human", isNonHumanForm: false },
            { reg: /魅魔之躯|变成.*?魅魔|化作.*?魅魔|身为魅魔|种族.*?魅魔|桃心尾|恶魔尾|魅魔角|长出魔角|魅魔翼|恶魔娘|魔族少女|succubus|demon girl|demon horns|succubus tail/i, id: "succubus_demon", cn: "😈魅魔(角/尾)", en: "succubus, demon horns, heart-shaped succubus tail, small bat wings", lower: "human_legs_tail", skin: "human", isNonHumanForm: false },
            { reg: /龙娘|龙女|长出龙角|拖着龙尾|dragon girl|dragon horns|dragon tail/i, id: "dragongirl", cn: "🐉龙娘(角/龙尾)", en: "dragon girl, dragon horns, thick scaly dragon tail, subtle dragon scales", lower: "human_legs_tail", skin: "dragon_scales", isNonHumanForm: false },
            { reg: /猫娘|猫兽人|头顶长出猫耳|毛茸茸的猫耳|身后的猫尾|摇着猫尾|cat girl|cat ears|nekomimi/i, id: "catgirl", cn: "🐱猫娘", en: "cat ears, cat tail, kemonomimi_mode", lower: "human_legs_tail", skin: "human", isNonHumanForm: false },
            { reg: /狐娘|狐妖|九尾狐|狐耳娘|毛茸茸的狐耳|身后的狐尾|fox girl|fox ears|kitsune/i, id: "foxgirl", cn: "🦊狐娘", en: "fox ears, fluffy fox tail, kemonomimi_mode", lower: "human_legs_tail", skin: "human", isNonHumanForm: false },
            { reg: /狼娘|犬娘|狗耳娘|狼耳娘|长出狗耳|长出狼耳|摇着狗尾|wolf girl|dog girl|dog ears/i, id: "dogwolf_girl", cn: "🐺犬/狼娘", en: "dog ears, wolf tail, kemonomimi_mode", lower: "human_legs_tail", skin: "human", isNonHumanForm: false },
            { reg: /乳牛娘|牛娘|奶牛娘|长出牛角|牛耳娘|cow girl|cow horns|cow ears/i, id: "cowgirl", cn: "🐄乳牛娘", en: "cow girl, cow ears, small cow horns, cow tail", lower: "human_legs_tail", skin: "human", isNonHumanForm: false },
            { reg: /兔娘|兔耳娘|兔兽人|长出兔耳|一对长长的兔耳|毛茸茸的兔耳|毛茸茸的兔尾|rabbit girl|rabbit ears,.*tail/i, id: "bunnygirl", cn: "🐰兔耳娘", en: "rabbit ears, fluffy bunny tail", lower: "human_legs_tail", skin: "human", isNonHumanForm: false },
            { reg: /精灵族|半精灵|精灵公主|精灵少女|长长的尖耳|精灵尖耳|精灵耳|elf girl|pointy ears|elf ears/i, id: "elf", cn: "🧝‍♀️精灵耳", en: "pointy elf ears", lower: "human_legs", skin: "human", isNonHumanForm: false },
            { reg: /天使娘|堕天使|背后长出羽翼|头顶天使光环|angel girl|halo, feathered wings/i, id: "angel", cn: "👼天使翼", en: "halo, feathered wings", lower: "human_legs", skin: "human", isNonHumanForm: false }
        ];

        function stripFakeAccessoryAndMetaphorWords(rawText) {
            return safeStr(rawText)
                .replace(/魅魔(?:淫纹|纹路|刻印|烙印|粉|主题|立体淫纹|体质|般)/g, "催情刻印")
                .replace(/(?:兔耳|猫耳|狐耳|狼耳|狗耳|兽耳|恶魔角|牛角|精灵耳)(?:发箍|发带|发饰|发卡|头箍|头饰|蝴蝶结|连帽|卫衣|睡衣|兜帽|帽子|耳机|玩偶|抱枕|公仔|挂件|装饰|造型)/g, "")
                .replace(/兔女郎(?:装|服|制服|衣装|打扮|手办|海报|漫画|本子|写真|女仆)/g, "")
                .replace(/黑皮(?:鞋|靴|包|衣|裤|裙|带|沙发|座椅|笔记本|本子|书|箱|手套|夹克|大衣|体育生|男生|男人|壮汉|大叔|学长|小哥)/g, "")
                .replace(/(?:像|似|如同|仿佛|宛如|好似|活像|赛过|堪比)(?:一只|一头|一条|个)?[^，。！？；\n]{0,12}?(?:兔子|小白兔|小猫|猫咪|小狗|狐狸|魅魔|洋娃娃|人偶|精灵|天使|母猪|母狗|母牛)/g, "")
                .replace(/(?:喜欢看|爱看|书架上|桌子上|海报上|手办|动漫里|小说里|游戏里|屏幕里|电视里)[^。！？；\n]{0,28}/g, "")
                .replace(/(?:大叔|肥猪|老板|黄毛|混混|体育生|学长|壮汉|男人|男生|少年|老头|流浪汉|教导主任|室友|路人)[^，。！？；\n]{0,18}?(?:黑发|白发|银发|金发|黄发|红发|蓝发|紫发|绿发|棕发|短发|长发|黑皮|古铜色|小麦色|红瞳|金瞳|蓝瞳|绿瞳|黑瞳|眼镜|墨镜)/g, "");
        }

        function mineWildDynamicTraits(text) {
            let s = stripFakeAccessoryAndMetaphorWords(text);
            if (!s) return { wildCn: [], wildEn: [], wildIds: [] };

            // 🛡️ 核心修复：剥离状态栏默认文案里的“浅粉花瓣/花蕊/花蜜/菊花”等色情修辞，严禁把阴唇修辞误判成植物娘藤蔓！
            s = s.replace(/(?:浅粉|粉嫩|娇嫩|小巧|两片|内里|私处|阴唇|花唇|菊穴|后庭)[^，。！？；\n]{0,8}(?:花瓣|花蕊|花蜜|花冠|菊花)/g, "阴唇软肉");

            const humanResetReg = /(?:变回|恢复|化作|重新变成|伪装成|隐藏[^。！？；\n]{0,8}本相[^。！？；\n]{0,8}变成)(?:了|成)?[^。！？；\n]{0,12}(?:普通人|正常人|人类形态|人类少女|人类模样|人形|男大学生|普通少女|普通女孩|美少女)|(?:收起|收回|隐藏)(?:了)?(?:恶鬼|怪物|魔物)?(?:真身|本相|肉尾|鬼角|眼球)/gi;
            let lastResetMatch = null, mReset;
            while ((mReset = humanResetReg.exec(s)) !== null) {
                lastResetMatch = mReset;
            }
            if (lastResetMatch) {
                s = s.slice(lastResetMatch.index + lastResetMatch[0].length);
            }

            const wildCn = new Set(), wildEn = new Set(), wildIds = new Set();

            const microRules = [
                // 👁️ 面部四只眼睛 / 三只眼 / 多眼精准识别（专门投递给头部与全身）
                [/(?:四只眼|四眼|四目|两对眼睛|四颗眼|脸上.*四只眼|眼眶下.*副眼|four eyes|two pairs of eyes)/i, "👁️四只眼睛", "1.5::four eyes, two pairs of eyes on face, extra eyes on face::", "trait_foureyes"],
                [/(?:三只眼|三目|额头.*竖眼|眉心.*第三只眼|three eyes|third eye)/i, "👁️三只眼睛", "1.5::three eyes, third eye on forehead::", "trait_threeeyes"],
                // 🍒 乳房数量异化（★ 严禁同时写 two pairs / 4 breasts，只写唯一词 four breasts 彻底根治4奶变6奶！）
                [/(?:四个|四颗|两对|4个|四只|双排)[^。！？；\n]{0,10}(?:奶子|乳房|巨乳|胸乳|奶袋|乳)|四乳|four breasts/i, "🍒四乳", "1.45::four breasts::", "trait_fourbreasts"],
                [/(?:六个|六颗|八个|三对|四对|一排|两排|母猪般.*一排|多对|全身.*布满)[^。！？；\n]{0,12}(?:奶子|乳房|巨乳|奶袋|乳头)|多乳|six breasts/i, "🐄多乳母畜", "1.55::six breasts, rows of breasts::", "trait_multibreasts"],
                [/(?:三个|三颗|3个)[^。！？；\n]{0,8}(?:奶子|乳房|巨乳)|三乳|three breasts/i, "🍒三乳", "1.5::three breasts::", "trait_threebreasts"],
                // 🌺 小穴数量异化（★ 只写 double pussy, two vaginas，严禁堆砌 extra pussy / twin vulvas 根治双穴变四穴！）
                [/(?:全身|浑身|遍布|布满|到处都是|密密麻麻|无数)[^。！？；\n]{0,12}(?:小穴|肉穴|淫穴|蜜穴|肉洞|性交洞|阴道)|multiple pussies/i, "🕳️全身小穴", "1.8::multiple pussies all over body::", "trait_allbodypussy"],
                [/(?:三个|四个|五个|六个|一排|多个)[^。！？；\n]{0,10}(?:小穴|肉穴|淫穴|蜜穴|阴道)|multiple vaginas/i, "🌺多穴构造", "1.75::three vaginas, row of pussies::", "trait_multipussy"],
                [/两个[^。！？；\n]{0,10}(?:粉嫩.*)?小穴|上下两个[^。！？；\n]{0,10}穴|并排.*两个.*穴|双穴|两个阴道|double pussy|two vaginas/i, "🌺双穴构造", "1.6::double pussy, two vaginas::", "trait_doublepussy"],
                [/(?:肚子|小腹|肚皮|胸口|手心)[^。！？；\n]{0,8}(?:裂开|长出|张开)[^。！？；\n]{0,8}(?:嘴|大嘴|口器)|腹口|stomach mouth/i, "👄腹口", "1.75::stomach mouth, extra mouth on abdomen::", "trait_bellymouth"],
                [/(?:两个|两张|双|多张)[^。！？；\n]{0,8}(?:嘴|嘴巴|口器|骚口)|multiple mouths/i, "👄多口", "1.7::multiple mouths, two mouths::", "trait_multimouth"],
                // 🌺 植物娘/花妖：已彻底移除“花瓣/花蕊/花蜜”误触发词！必须明确是植物娘/花妖/树精/藤蔓缠身才触发！
                [/植物娘|花妖|树精|藤蔓娘|食人花娘|身躯由藤蔓|长出藤蔓|alraune|plant girl|dryad/i, "🌺植物娘藤蔓", "plant girl, alraune, writhing green vine tendrils on body", "trait_plant"],
                [/体表鳞片|蛇鳞|龙鳞|鱼鳞|长出鳞片|scales on skin/i, "鳞片", "glistening scales on skin", "trait_scales"],
                [/长出吸盘|触手吸盘|肉盘|吸盘褶皱|suction cups/i, "吸盘", "fleshy suction cups", "trait_suckers"],
                [/复眼|千眼|百目|眼球密布|恶鬼眼球|glowing eerie eyes|(?:后背|大腿|全身|皮下|肉缝)[^。！？；\n]{0,12}(?:眼球|眼珠)|multiple glowing eyes on body/i, "👁️躯体多眼", "multiple glowing eerie eyes on body", "trait_multieyes"],
                [/淫丝|蛛丝|纺丝孔|纺丝腺体|吐丝|spider web|web threads/i, "🕸️淫丝", "sticky pink spider web threads", "trait_web"],
                [/肉须|体表触须|长出触须|触手|fleshy tendrils/i, "触须", "writhing fleshy tendrils", "trait_tendrils"],
                [/粘液躯体|黏液肌|黑泥躯体|果冻躯体|胶质软肉|史莱姆|translucent slime skin/i, "🫧粘液胶质肌", "dripping slimy translucent skin, gelatinous body", "trait_slime"],
                [/半透明[^。！？；\n]{0,10}(?:肚皮|小腹|皮肤|躯体)|透过[^。！？；\n]{0,10}肚皮[^。！？；\n]{0,10}看见|translucent.*(?:abdomen|skin|body)|see-through abdomen/i, "🫧半透视躯体", "translucent skin, see-through abdomen showing internal womb", "trait_translucent"],
                [/虫族甲壳|外骨骼|昆虫甲壳|chitinous exoskeleton/i, "甲壳", "glossy chitinous exoskeleton", "trait_chitin"],
                [/骨刺|外露骨|脊椎.*骨裂|bone spikes/i, "骨刺", "protruding bone spikes", "trait_bones"],
                [/鬼角|赤角|额角|小肉角|魔角|龙角|牛角|羊角|鹿角|horns|oni horns|demon horns/i, "👹角饰", "horns, demon horns", "trait_onihorns"],
                [/鬼火|黑红色.*火|幽火|oni fire|ghost fire/i, "🔥鬼火", "floating eerie ghost fire, dark red flames", "trait_ghostfire"],
                [/利爪|漆黑.*爪|指甲暴涨|sharp black claws/i, "🐾利爪", "sharp black claws, long monster fingernails", "trait_claws"],
                [/尖牙|锯齿牙|三排.*牙|小虎牙|虎牙|嘴角.*撕裂|裂口|sharp fangs|rows of sharp teeth/i, "🦷尖牙", "sharp fangs, rows of sharp teeth", "trait_fangs"],
                [/长舌|猩红长舌|肉刺.*舌|三十公分.*舌|两条.*舌|extremely long.*tongue/i, "👅长舌", "extremely long red tongue", "trait_longtongue"],
                [/分叉舌|蛇信子|forked.*tongue/i, "分叉舌", "long forked snake tongue", "trait_forkedtongue"],
                [/肉尾|骨尾|倒刺.*尾|紫黑.*尾|桃心尾|恶魔尾|尾巴|long dark monster tail/i, "🦂异形尾", "long monster tail", "trait_monstertail"],
                [/浑身湿漉漉|溺水鬼|黑色咒水|dripping wet body/i, "💧湿透咒水", "dripping wet body, wet hair sticking to skin", "trait_wetghost"],
                [/竖瞳|蛇瞳|兽瞳|琥珀色的竖瞳|爱心瞳|slit pupils/i, "竖瞳", "slit pupils", "trait_slitpupils"],
                [/多臂|四条手臂|六条手臂|multiple arms|four arms/i, "多臂", "multiple arms, four arms", "trait_multiarms"],
                [/无四肢|人彘|肉柱|达摩形态|amputee|limbless/i, "无四肢肉偶", "limbless torso only", "trait_limbless"]
            ];
            microRules.forEach(([reg, cn, en, tid]) => {
                if (reg.test(s)) { wildCn.add(cn); wildEn.add(en); wildIds.add(tid); }
            });

            const customMorphMatches = [
                ...s.matchAll(/(?:变成|化作|化为|重塑为|改写为|形态是|本体是|身为|是一只|是一名)(?:了|一头|一只|一条|一具|一团|一个)?([\u4e00-\u9fa5]{2,7}?(?:怪|兽|虫|蛇|鱼|妖|魔|鬼|神|灵|偶|体|团|块|泥|花|树|猪|狗|牛|马|猫|狐|龙|蛛|娘|姬|便器|苗床))/g)
            ];
            customMorphMatches.forEach(m => {
                const w = safeStr(m[1]).replace(/^(?:了|的|是|档案里的|档案中)/, "").trim();
                if (w && w.length >= 2 && !/普通|少女|女人|女生|女孩|萝莉|人类|自己|模样|档案/.test(w)) {
                    wildCn.add(`🔮${w}`);
                }
            });

            return { wildCn: Array.from(wildCn), wildEn: Array.from(wildEn), wildIds: Array.from(wildIds) };
        }

        function detectProtagonistGender(u, v) {
            if (v?.档案?.当前性别 === "female" || v?.档案?.当前性别 === "futa" || v?.档案?.当前性别 === "male") {
                return v.档案.当前性别;
            }
            const lockedDna = safeStr(v?.档案?.锁定外貌DNA).toLowerCase();
            if (v?.档案?.手动锁死外貌Flag && lockedDna) {
                if (/\b(?:1boy|male|man|guy|shota)\b/.test(lockedDna) && !/\b(?:1girl|female)\b/.test(lockedDna)) return "male";
                if (/\b(?:futa|futanari|hermaphrodite)\b/.test(lockedDna)) return "futa";
                if (/\b(?:1girl|female|woman|loli|breasts|pussy)\b/.test(lockedDna)) return "female";
            }
            const ctx = safeCtx(), chatArr = ctx?.chat || [];
            const targetName = safeStr(u || detectProtagonistName(v) || "主角").trim();
            const charCardName = safeStr(ctx?.name2).trim();
            const isDmCard = /系统|旁白|主持人|DM|模拟器|游戏|世界|剧场|笔/i.test(charCardName);
            const isTargetTheCharCard = (!isDmCard && targetName && charCardName && (targetName === charCardName || charCardName.includes(targetName)));

            const personaDesc = safeStr(ctx?.power_user?.persona_description);
            const charDesc = safeStr(ctx?.characters?.[ctx?.characterId]?.description);
            const raceStr = `${safeStr(v?.档案?.种族与体质)} ${safeStr(v?.档案?.身份与背景)} ${safeStr(v?.档案?.肉体外貌实况)}`;

            if (isTargetTheCharCard && /(?:少女|女孩|萝莉|女人|女生|魅魔|女鬼|魔物娘|植物娘|花妖|虫娘|1girl|female|小穴|乳房|双峰|巨乳)/i.test(`${charDesc} ${raceStr} ${safeStr(chatArr[0]?.mes)}`)) {
                return "female";
            }

            let isInitiallyMale = /(?:男大学生|男生|少年|男人|男性|男孩|少爷|公子|师兄|1boy|male)/i.test(`${isTargetTheCharCard ? charDesc : personaDesc} ${raceStr} ${safeStr(chatArr[0]?.mes).slice(0, 400)}`);
            let curGender = isInitiallyMale ? "male" : "female";
            const maxScan = chatArr.length;
            const tfFemaleReg = new RegExp(`(?:${targetName}|我|自己|主角)[^。！？；\\n]{0,30}(?:变成|化作|化为|重塑为|改写为|性转成|变成了|长出了)[^。！？；\\n]{0,25}(?:女|少女|女孩|萝莉|女人|女生|魅魔|美女蛇|仙子|大小姐|千金|公主|妓女|娼妇|肉便器|母狗|母猪|双乳|乳房|奶子|小穴|子宫|鬼|魔物|植物娘|花妖|史莱姆|蜘蛛|触手)|肉棒和蛋蛋全都缩进去|两个粉嫩紧闭的小穴|四个奶|少女肌肤|萝莉喘息|洛丽塔蓬蓬裙`);
            const tfFutaReg = new RegExp(`(?:${targetName}|我|自己|主角)[^。！？；\\n]{0,25}(?:变成|化作|改写为)[^。！？；\\n]{0,15}(?:扶她|双性|阴阳人|既有小穴又有肉棒)`);
            const tfMaleReg = new RegExp(`(?:${targetName}|我|自己|主角)[^。！？；\\n]{0,20}(?:恢复原状|变回男|恢复男儿身|变回普通男大学生|恢复了男性躯体)`);

            for (let i = 0; i < maxScan; i++) {
                const cleanMes = safeStr(chatArr[i]?.mes)
                    .replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|<options>[\s\S]*?<\/options>/gi, "")
                    .replace(/###\s*【[^】]*】[\s\S]*?(?=---|###|<\/game>|$)/g, "");
                if (tfFutaReg.test(cleanMes)) curGender = "futa";
                else if (tfFemaleReg.test(cleanMes)) curGender = "female";
                else if (tfMaleReg.test(cleanMes)) curGender = "male";
            }

            if (curGender === "male" && (safeNum(v?.计数?.性交?.小穴) > 0 || safeNum(v?.计数?.射精?.内射) > 0 || safeNum(v?.体内精液存量?.子宫毫升) > 0)) {
                curGender = "female";
            }
            return curGender;
        }

        function resolveCurrentMorphedArchiveAndState(targetName, chatArr) {
            const regStageImg = /第[一二三四五六1-6]阶段：[^\n<]*\s*<image>[\s\S]*?<\/image>|<image>[\s\S]*?<\/image>|image###[\s\S]*?###/gi;
            const allRawChat = (chatArr || []).map(m => safeStr(m?.mes)
                .replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|<options>[\s\S]*?<\/options>|<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "")
                .replace(regStageImg, "")
            ).join("\n");

            const archiveBlocks = allRawChat.match(/(?:###|##|\*\*)?\s*【[^】\n]{2,40}】[\s\S]*?(?=\*\*\*|---|###|##\s*【|\n\s*【(?:档案|编号|鬼怪|角色)|<\/game>|$)/g) || [];

            const knownArchiveNames = [];
            archiveBlocks.forEach(blk => {
                const headerLine = (blk.match(/【([^】]+)】/) || ["", ""])[1];
                const qNames = [...headerLine.matchAll(/[“"「『]([^”"」』]+)[”"」』]/g)].map(m => m[1].trim());
                const titleParts = headerLine.replace(/档案[零一二三四五六七八九十\d]+[：:\s]*/g, "").split(/[·•｜|：:\s（）()]+/).map(s => s.replace(/伪装名|真名|姓名|名称|代号|[“"「』”]/g, "").trim()).filter(s => s.length >= 1 && s.length <= 10);
                [...qNames, ...titleParts].forEach(n => { if (n && !knownArchiveNames.includes(n)) knownArchiveNames.push(n); });
            });

            let morphedAliasName = "";
            let latestMorphPos = -1;

            knownArchiveNames.forEach(kName => {
                const esc = kName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const reg = new RegExp(`(?:我|自己|${targetName}|主角)[^。！？；\\n]{0,25}(?:变成了|变成|化作|重塑为|改写为|成为了)[^。！？；\\n]{0,25}?${esc}`, "g");
                let m;
                while ((m = reg.exec(allRawChat)) !== null) {
                    if (m.index >= latestMorphPos) {
                        latestMorphPos = m.index;
                        morphedAliasName = kName;
                    }
                }
            });

            const morphGenericReg = new RegExp(`(?:我|自己|${targetName}|主角)[^。！？；\\n]{0,12}(?:变成了|变成|化作|重塑为|改写为)(?:档案里的|档案中|那只|那个|一名|一只|一具)?(?:[\\u4e00-\\u9fa5]{2,8}鬼)?[“"「『]?([\\u4e00-\\u9fa5]{1,8})[”"」』]?`, "g");
            let mGen;
            while ((mGen = morphGenericReg.exec(allRawChat)) !== null) {
                if (morphedAliasName && Math.abs(mGen.index - latestMorphPos) <= 25) continue;
                const cand = safeStr(mGen[1]).replace(/^(?:档案里的|档案中|这个叫|那个叫|一只|一具|一名)/, "").trim();
                if (cand && !/^(?:普通人|正常人|人类|男大学生|美少女|普通少女|自己|这样|什么|档案)$/.test(cand) && mGen.index > latestMorphPos) {
                    latestMorphPos = mGen.index;
                    morphedAliasName = cand;
                }
            }

            const revealTrueFormReg = new RegExp(`(?:我|自己|${targetName}|${morphedAliasName || "主角"})[^。！？；\\n]{0,20}(?:显露|露出|解放|化为|展开|开启|恢复)(?:了)?[^。！？；\\n]{0,10}(?:恶鬼|怪物|魔物)?(?:真身|本相|本体|捕食状态|狂暴状态)|撕下(?:了)?(?:人类)?伪装`, "g");
            let mRev;
            while ((mRev = revealTrueFormReg.exec(allRawChat)) !== null) {
                if (mRev.index >= latestMorphPos) latestMorphPos = mRev.index;
            }

            const backToHumanReg = new RegExp(`(?:我|自己|${targetName}|${morphedAliasName || "主角"})[^。！？；\\n]{0,20}(?:变回|恢复|重新变成|化作|伪装成)(?:了|成)?[^。！？；\\n]{0,12}(?:普通人|正常人|人类|人形|男大学生|普通少女|普通女孩|美少女)|(?:隐藏|收起|收回)(?:了)?(?:恶鬼|怪物|魔物)?(?:真身|本相|肉尾|鬼角|眼球)`, "g");
            let latestHumanPos = -1, mHum;
            while ((mHum = backToHumanReg.exec(allRawChat)) !== null) {
                if (mHum.index >= latestHumanPos) latestHumanPos = mHum.index;
            }

            const isCurrentlyRevertedToHuman = (latestHumanPos > latestMorphPos);

            let matchedArchiveBlock = "";
            if (morphedAliasName) {
                for (const blk of archiveBlocks) {
                    const headerLine = (blk.match(/【([^】]+)】/) || ["", ""])[1];
                    if (headerLine.includes(morphedAliasName) || blk.slice(0, 160).includes(morphedAliasName)) {
                        matchedArchiveBlock = blk;
                        break;
                    }
                }
            } else if (archiveBlocks.length === 1) {
                matchedArchiveBlock = archiveBlocks[0];
            }

            let activeStateStartFloor = 0;
            (chatArr || []).forEach((m, fIdx) => {
                const cleanM = safeStr(m?.mes).replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|<options>[\s\S]*?<\/options>/gi, "").replace(regStageImg, "");
                if (fIdx > 0 && new RegExp(`(?:我|自己|${targetName}|主角)[^。！？；\\n]{0,20}(?:变成了|变成|化作|重塑为|改写为|变回|恢复)`).test(cleanM)) {
                    activeStateStartFloor = fIdx;
                }
            });

            return {
                morphedAliasName,
                matchedArchiveBlock,
                isCurrentlyRevertedToHuman,
                activeStateStartFloor,
                allRawChat
            };
        }

        function collectAllActiveButtonDescriptionsForAppearance(v) {
            if (!v || typeof v !== "object") return "";
            const chunks = [];
            if (v.档案) {
                if (v.档案.种族与体质) chunks.push(v.档案.种族与体质);
                if (v.档案.身份与背景) chunks.push(v.档案.身份与背景);
                if (v.档案.肉体外貌实况) chunks.push(v.档案.肉体外貌实况);
            }
            if (v.穿搭 && typeof v.穿搭 === "object") {
                Object.values(v.穿搭).forEach(val => { if (val) chunks.push(val); });
            }
            if (v.实况 && typeof v.实况 === "object") {
                ["当前姿势", "当前衣装", "骚口实况", "胸部实况", "小穴实况", "子宫实况", "屁眼实况"].forEach(k => {
                    if (v.实况[k]) chunks.push(v.实况[k]);
                });
            }
            if (v.按钮详情 && typeof v.按钮详情 === "object") {
                ["身份与背景", "肉体外貌", "当前姿势", "骚口实况", "胸部实况", "小穴实况", "子宫实况", "屁眼实况", "穿搭_头饰", "穿搭_胸罩", "穿搭_上衣", "穿搭_内裤", "穿搭_下装", "穿搭_丝袜", "穿搭_鞋子"].forEach(k => {
                    const b = v.按钮详情[k];
                    if (b) {
                        if (b.stage) chunks.push(b.stage);
                        if (b.desc) chunks.push(b.desc);
                    }
                });
            }
            return stripFakeAccessoryAndMetaphorWords(chunks.filter(Boolean).join(" \n "));
        }

        let _appearMemoCache = { sig: "", res: null };
        function extractTargetCurrentAppearance(u, v, customHint = "") {
            const ctx = safeCtx(), chatArr = ctx?.chat || [];
            const targetName = safeStr(u || detectProtagonistName(v) || "主角").trim();
            const curGender = detectProtagonistGender(targetName, v);
            const regStageImg = /第[一二三四五六1-6]阶段：[^\n<]*\s*<image>[\s\S]*?<\/image>|<image>[\s\S]*?<\/image>|image###[\s\S]*?###/gi;
            const cleanLastMes = safeStr(chatArr[chatArr.length - 1]?.mes).replace(regStageImg, "").trim();
            const allBtnDescSnap = collectAllActiveButtonDescriptionsForAppearance(v);
            const memoSig = `${targetName}_${curGender}_${chatArr.length}_${cleanLastMes.length}_${allBtnDescSnap.length}_${allBtnDescSnap.slice(0, 80)}_${allBtnDescSnap.slice(-80)}_${customHint}`;
            if (!customHint && _appearMemoCache.sig === memoSig && _appearMemoCache.res) {
                return _appearMemoCache.res;
            }
            const charCardName = safeStr(ctx?.name2).trim();
            const isDmCard = /系统|旁白|主持人|DM|模拟器|游戏|世界|剧场|笔/i.test(charCardName);
            const isTargetTheCharCard = (!isDmCard && targetName && charCardName && (targetName === charCardName || charCardName.includes(targetName)));

            const morphState = resolveCurrentMorphedArchiveAndState(targetName, chatArr);
            const { morphedAliasName, matchedArchiveBlock, isCurrentlyRevertedToHuman, activeStateStartFloor } = morphState;

            const relevantChunks = [];
            if (isTargetTheCharCard) {
                relevantChunks.push(stripFakeAccessoryAndMetaphorWords(safeStr(ctx?.characters?.[ctx?.characterId]?.description).slice(0, 1200)));
            } else if (activeStateStartFloor === 0 && !morphedAliasName && ctx?.power_user?.persona_description) {
                relevantChunks.push(stripFakeAccessoryAndMetaphorWords(safeStr(ctx?.power_user?.persona_description).slice(0, 600)));
            }

            const recentFloors = activeStateStartFloor > 0
                ? chatArr.slice(activeStateStartFloor)
                : chatArr.slice(Math.max(0, chatArr.length - 4));

            recentFloors.forEach((m) => {
                let raw = safeStr(m?.mes)
                    .replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|<options>[\s\S]*?<\/options>|<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "")
                    .replace(regStageImg, "")
                    .replace(/<item_[^>]+>[\s\S]*?<\/item_[^>]+>/gi, "")
                    .replace(/(?:###|##|\*\*)?\s*【[^】\n]{2,40}】[\s\S]*?(?=\*\*\*|---|###|##\s*【|\n\s*【(?:档案|编号|鬼怪|角色)|<\/game>|$)/g, "");
                if (!raw) return;
                const sents = raw.split(/[。！？；\n\r]+/);
                sents.forEach(s => {
                    const cleanS = stripFakeAccessoryAndMetaphorWords(s.trim());
                    if (!cleanS) return;
                    if (/四份档案|四个名字|白桃.*蛛音.*琥珀.*澪/.test(cleanS)) return;
                    if (curGender === "male" && /(?:她|女鬼|厉鬼|少女|女孩|萝莉|女人|妇人)/.test(cleanS)) return;
                    if (/^(?:大叔|肥猪|老板|黄毛|混混|体育生|学长|男人们|室友|摊主|醉汉)/.test(cleanS) && !cleanS.includes(targetName) && !cleanS.includes("我")) return;
                    relevantChunks.push(cleanS);
                });
            });

            if (matchedArchiveBlock) {
                let cleanArchive = stripFakeAccessoryAndMetaphorWords(matchedArchiveBlock);
                if (isCurrentlyRevertedToHuman) {
                    cleanArchive = cleanArchive.replace(/\*\s*\*\*恶鬼真身[\s\S]*?(?=\*\s*\*\*|$)/g, "");
                }
                relevantChunks.push(cleanArchive);
            }

            if (!isCurrentlyRevertedToHuman && allBtnDescSnap) {
                relevantChunks.push(allBtnDescSnap);
            }
            if (customHint) relevantChunks.push(customHint + " \n " + customHint);

            const fullText = relevantChunks.join(" \n ");

            const pickLatestMatch = (candidates, defaultVal) => {
                let bestVal = defaultVal;
                let latestPos = -1;
                for (const [regex, val] of candidates) {
                    const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
                    const globalReg = new RegExp(regex.source, flags);
                    let match;
                    while ((match = globalReg.exec(fullText)) !== null) {
                        if (match.index >= latestPos) {
                            latestPos = match.index;
                            bestVal = val;
                        }
                    }
                }
                return bestVal;
            };

            const hairColor = pickLatestMatch([
                [/黑发|乌发|黑长直|墨发|乌黑油亮|(?:乌黑|如墨|黑色)[^，。！？；\n]{0,8}?(?:头发|发丝|长发|短发|双马尾|马尾|卷发|青丝|秀发|刘海|发辫)|black hair/i, "black hair"],
                [/银发|白发|雪发|银白发|(?:银白|银色|雪白|纯白|白色)[^，。！？；\n]{0,8}?(?:头发|发丝|长发|短发|双马尾|马尾|姬发|青丝|秀发|刘海|发辫)|silver hair|white hair/i, "silver hair"],
                [/金发|黄发|亚麻发|(?:金色|金黄|浅金|亚麻色)[^，。！？；\n]{0,8}?(?:头发|发丝|长发|短发|双马尾|马尾|青丝|秀发|刘海|发辫)|blonde hair|golden hair/i, "blonde hair"],
                [/粉发|樱发|粉红发|(?:粉色|粉红|樱粉色)[^，。！？；\n]{0,8}?(?:头发|发丝|长发|短发|双马尾|马尾|青丝|秀发|刘海|发辫|藤蔓)|pink hair/i, "pink hair"],
                [/紫发|紫罗兰发|(?:紫色|深紫|浅紫)[^，。！？；\n]{0,8}?(?:头发|发丝|长发|短发|双马尾|马尾|青丝|秀发|刘海|发辫)|purple hair/i, "purple hair"],
                [/蓝发|冰蓝发|水蓝发|(?:蓝色|冰蓝|水蓝|湛蓝)[^，。！？；\n]{0,8}?(?:头发|发丝|长发|短发|双马尾|马尾|青丝|秀发|刘海|发辫)|blue hair/i, "blue hair"],
                [/红发|赤发|酒红发|火红发|火红色的短碎发|(?:红色|赤红|酒红|火红|绯红)[^，。！？；\n]{0,8}?(?:头发|发丝|长发|短发|碎发|双马尾|马尾|青丝|秀发|刘海|发辫)|red hair|crimson hair/i, "red hair"],
                [/棕发|栗发|褐发|茶色头发|栗色头发|(?:棕色|栗色|茶色|褐色)[^，。！？；\n]{0,8}?(?:头发|发丝|长发|短发|双马尾|马尾|青丝|秀发|刘海|发辫)|brown hair/i, "brown hair"],
                [/绿发|翠绿发|浅绿发|藤蔓长发|碧绿.*发|(?:绿色|翠绿|浅绿|墨绿|碧绿)[^，。！？；\n]{0,8}?(?:头发|发丝|长发|短发|双马尾|马尾|青丝|秀发|刘海|发辫|藤蔓)|green hair/i, "green hair"],
                [/灰发|灰白发|银灰发|grey hair|gray hair/i, "grey hair"]
            ], "black hair");

            const defaultHairStyle = (curGender === "male") ? "short hair" : "long hair, bangs";
            const hairStyle = pickLatestMatch([
                [/双马尾卷发|微卷双马尾|双马尾|twintails|twin tails/i, "twintails, drill hair"],
                [/侧马尾|side ponytail/i, "side ponytail"],
                [/单马尾|高马尾|马尾辫|ponytail/i, "ponytail"],
                [/姬发式|公主切|hime cut/i, "hime cut, long hair"],
                [/丸子头|包子头|双丸子头|发髻|盘发|hair bun|double bun/i, "hair bun"],
                [/麻花辫|双辫|羊角辫|发辫|braids|braid/i, "braids"],
                [/波波头|齐肩短发|利落短发|清爽短发|短碎发|短发|short hair|bob cut/i, "short hair"],
                [/大波浪|长卷发|微卷长发|卷发|wavy hair|curly hair/i, "long wavy hair, bangs"],
                [/黑长直|长直发|及腰长发|披肩长发|青丝如瀑|长发|long hair/i, "long hair, bangs"]
            ], defaultHairStyle);

            const eyeColor = pickLatestMatch([
                [/黑瞳|黑眸|漆黑眼眸|(?:漆黑|乌黑|深邃黑色)[^，。！？；\n]{0,5}?(?:眼眸|瞳孔|眸子|双眼|大眼睛)|black eyes/i, "black eyes"],
                [/红瞳|赤瞳|血瞳|猩红眼眸|(?:猩红|赤红|血红|红宝石般)[^，。！？；\n]{0,5}?(?:眼眸|瞳孔|眸子|双眼|竖瞳)|red eyes|crimson eyes/i, "red eyes"],
                [/金瞳|黄金瞳|琥珀瞳|琥珀色的竖瞳|(?:金色|金黄|琥珀色)[^，。！？；\n]{0,5}?(?:眼眸|瞳孔|眸子|双眼|竖瞳)|golden eyes|yellow eyes|amber eyes/i, "golden eyes"],
                [/紫瞳|紫眸|(?:紫色|紫罗兰|暗紫)[^，。！？；\n]{0,5}?(?:眼眸|瞳孔|眸子|双眼)|purple eyes|violet eyes/i, "purple eyes"],
                [/蓝瞳|蓝眸|冰蓝瞳|(?:蔚蓝|湛蓝|冰蓝|水蓝|蓝色)[^，。！？；\n]{0,5}?(?:眼眸|瞳孔|眸子|双眼)|blue eyes/i, "blue eyes"],
                [/绿瞳|碧瞳|碧眼|(?:翠绿|碧绿|墨绿|绿色)[^，。！？；\n]{0,5}?(?:眼眸|瞳孔|眸子|双眼|竖瞳)|green eyes/i, "green eyes"],
                [/粉瞳|粉眸|淡粉色.*眼|桃红眼眸|粉色眼眸|pink eyes/i, "pink eyes"],
                [/棕瞳|茶色眼眸|琥珀棕眸|浅棕眼眸|brown eyes/i, "brown eyes"],
                [/异色瞳|鸳鸯眼|阴阳眼|heterochromia/i, "heterochromia"]
            ], "black eyes");

            const wildTraits = (!isCurrentlyRevertedToHuman)
                ? mineWildDynamicTraits(fullText)
                : { wildCn: [], wildEn: [], wildIds: [] };

            const hasMultiBreasts = wildTraits.wildIds.some(id => /fourbreasts|multibreasts|threebreasts/.test(id));

            let bodyAndBreast = "1boy, male focus, flat male chest, slender young man";
            if (curGender !== "male") {
                const chestDevVal = safeNum(computeAllOrganDevelopments(v)?.chestObj?.val, 0);
                bodyAndBreast = pickLatestMatch([
                    [/超乳|爆乳|硕大双峰|丰满巨乳|沉重奶袋|巨型乳房|huge breasts|gigantic breasts/i, "huge breasts, voluptuous body, wide hips"],
                    [/巨乳|丰乳|丰满双峰|饱满双峰|饱满胸乳|饱满双乳|丰盈双峰|胸围丰满|前凸后翘|熟女身段|熟女胴体|large breasts|voluptuous/i, "large breasts, voluptuous body, slender waist, wide hips"],
                    [/142公分|138公分|135公分|140公分|哥特萝莉|娇小玲珑|小萝莉|合法萝莉|萝莉|小女孩|幼女|贫乳|平胸|微乳|小巧乳蕾|平坦胸口|娇小身躯|娇小身姿|幼态|petite|loli|flat chest|small breasts/i, "loli, petite, flat chest, small breasts, slender narrow waist, plump round butt"],
                    [/身材修长|身姿纤细|身段高挑|亭亭玉立|身姿苗条|身材匀称|少女身段|medium breasts|slender/i, "medium breasts, slender waist"]
                ], "medium breasts, slender waist");

                // ★ 关键修复：如果角色有四乳/多乳，彻底从基础体型里剥离任何 breasts / chest 词条，防止 four breasts + full/medium breasts 叠加变成 6 个奶！
                if (hasMultiBreasts) {
                    bodyAndBreast = bodyAndBreast.replace(/\b(?:flat chest|small breasts|medium breasts|large breasts|huge breasts|full breasts)\b\s*,?\s*/gi, "").trim();
                } else if (chestDevVal >= 80 && /small breasts|medium breasts/.test(bodyAndBreast)) {
                    bodyAndBreast = bodyAndBreast.replace(/small breasts|medium breasts/, "huge lactating breasts");
                } else if (chestDevVal >= 60 && /small breasts/.test(bodyAndBreast)) {
                    bodyAndBreast = bodyAndBreast.replace(/small breasts/, "large breasts");
                }
                if (curGender === "futa") bodyAndBreast += ", futanari";
            }

            const skinTone = pickLatestMatch([
                [/黑皮少女|黑皮萝莉|黑皮辣妹|黑皮肤|小麦色肌肤|小麦肤色|古铜色肌肤|褐色肌肤|dark skin|tan skin/i, "dark skin, glossy skin"],
                [/粉色肌肤|粉红肌肤|粉皮魅魔|pink skin/i, "pink skin, glossy skin"],
                [/冰蓝肌肤|蓝色皮肤|蓝皮|blue skin/i, "blue skin, glossy skin"],
                [/绿色皮肤|翠绿魔肤|绿皮|green skin/i, "green skin, glossy skin"],
                [/冷白皮|白皙|雪白肌肤|苍白肌肤|病态苍白|肤如凝脂|白腻肌肤|白嫩|pale white skin|fair skin/i, "pale white skin"]
            ], "pale white skin");

            const morphCandidates = [
                [/普通男大学生|普通人类|人类青年|人类少年|人类男性|人类之身|正常人类|恢复人形|变回人类|变成人类|收回.*真身|隐藏.*本相.*变成.*少女|收回蛇尾|化作双腿/i, null],
                ...OPEN_MORPH_DICTIONARY.map(item => [item.reg, item])
            ];
            let primaryMorph = isCurrentlyRevertedToHuman ? null : pickLatestMatch(morphCandidates, null);
            if (curGender === "male" && primaryMorph && /girl|女鬼|魅魔|娘|妖|姬/.test(`${primaryMorph.cn} ${primaryMorph.en}`)) {
                primaryMorph = null;
            }

            const extraEnTags = [];
            const cnTraitBadges = [];
            if (morphedAliasName) cnTraitBadges.push(`🎭${morphedAliasName}`);
            if (curGender === "male") cnTraitBadges.push("♂️男性");
            else if (curGender === "futa") cnTraitBadges.push("⚧️扶她双性");

            if (!isCurrentlyRevertedToHuman && primaryMorph && primaryMorph.id === "succubus_demon" && /鬼|怨灵|凶灵|幽灵|尸/.test(fullText) && !/魅魔角|桃心尾|长出魔角|身为魅魔/.test(fullText)) {
                primaryMorph = OPEN_MORPH_DICTIONARY.find(x => x.id === "undead_ghost") || null;
            }
            if (primaryMorph) {
                extraEnTags.push(primaryMorph.en);
                cnTraitBadges.push(primaryMorph.cn);
            }

            wildTraits.wildEn.forEach(t => { if (!extraEnTags.join(", ").includes(t)) extraEnTags.push(t); });
            wildTraits.wildCn.forEach(c => { if (!cnTraitBadges.join(" ").includes(c)) cnTraitBadges.push(c); });

            const latestOutfitExtra = pickLatestMatch([
                [/死库水|蓝色旧校服|school swimsuit|sukumizu/i, "sukumizu, school swimsuit, wet clothes"],
                [/露脐.*运动小背心|牛仔热裤|sports bra.*denim shorts/i, "cropped white sports tank top, tight denim micro shorts"],
                [/浅粉色连帽卫衣|粉色.*卫衣|超短百褶裙/i, "oversized light pink hoodie, mini pleated skirt"],
                [/哥特|黑蕾丝|洛丽塔|蓬蓬裙|gothic lolita/i, "gothic lolita, black lace frilly dress, white kneehighs"]
            ], "");
            if (curGender !== "male" && latestOutfitExtra) extraEnTags.push(latestOutfitExtra);

            if (/泪痣|眼角.*痣|mole under eye/i.test(fullText)) extraEnTags.push("mole under eye");

            const curHeadWear = safeStr(v?.穿搭?.头饰与眼部);
            const latestGlassesState = pickLatestMatch([
                [/不戴眼镜|摘下眼镜|没有眼镜|创可贴|死库水|粉色连帽卫衣|运动小背心/i, "none"],
                [/红框圆眼镜|红框眼镜/i, "red_round"],
                [/黑框.*眼镜.*滑落|眼镜.*掉在/i, "none"],
                [/戴着.*眼镜|架着.*眼镜/i, "normal"]
            ], /眼镜|glasses/i.test(curHeadWear) ? "normal" : "none");

            if (latestGlassesState === "red_round") {
                extraEnTags.push("red-framed round glasses, eyewear");
                cnTraitBadges.push("👓红框眼镜");
            } else if (latestGlassesState === "normal") {
                extraEnTags.push("glasses");
            }

            const enToCn = {
                "silver hair": "银白发", "blonde hair": "金发", "pink hair": "粉发", "purple hair": "紫发", "blue hair": "蓝发", "red hair": "红发", "green hair": "绿发", "brown hair": "棕发", "grey hair": "灰发", "black hair": "黑发",
                "twintails, drill hair": "双马尾卷发", "twintails": "双马尾", "side ponytail": "侧马尾", "ponytail": "单马尾", "braids": "麻花辫", "hair bun": "丸子头", "hime cut, long hair": "姬发式长发", "short hair": "短发", "long wavy hair, bangs": "长卷发", "long hair, bangs": "长直发",
                "black eyes": "黑瞳", "red eyes": "红瞳", "golden eyes": "金瞳", "purple eyes": "紫瞳", "blue eyes": "蓝瞳", "green eyes": "绿瞳", "pink eyes": "粉瞳", "heterochromia": "异色瞳", "brown eyes": "棕瞳",
                "pale white skin": "白皙肤色", "dark skin, glossy skin": "小麦/黑皮", "pink skin, glossy skin": "粉嫩魔肤", "blue skin, glossy skin": "冰蓝肤色", "green skin, glossy skin": "翠绿魔肤"
            };
            const bodyCnLabel = curGender === "male" ? "青年体魄" : (hasMultiBreasts ? "多乳形体" : (bodyAndBreast.includes("petite") ? "娇小萝莉" : (bodyAndBreast.includes("huge") ? "爆乳丰满" : (bodyAndBreast.includes("large") ? "巨乳丰满" : "少女匀称"))));
            const cnSummaryParts = [
                ...cnTraitBadges,
                enToCn[hairColor] || hairColor,
                enToCn[hairStyle] || hairStyle,
                enToCn[eyeColor] || eyeColor,
                bodyCnLabel,
                enToCn[skinTone] || skinTone
            ];

            const tags = [hairColor, hairStyle, eyeColor, bodyAndBreast, skinTone, ...extraEnTags].filter(Boolean).join(", ");
            const finalAppearObj = { tags, cnSummary: [...new Set(cnSummaryParts)].join(" · "), primaryMorph, gender: curGender, morphedAliasName };
            if (!customHint) _appearMemoCache = { sig: memoSig, res: finalAppearObj };
            return finalAppearObj;
        }

        function extractTargetCurrentAppearanceFromText(u, v, customHint = "") {
            return extractTargetCurrentAppearance(u, v, customHint).tags;
        }

        function summarizeDnaTagsToChinese(tagStr) {
            const s = safeStr(tagStr);
            if (!s) return "未提取";
            const sLow = s.toLowerCase();
            const parts = [];

            if (/\b(?:1boy|male focus|flat male chest)\b/i.test(sLow)) parts.push("♂️男性");
            else if (/\bfutanari\b/i.test(sLow)) parts.push("⚧️扶她双性");
            const isMultiEyeGhost = /spider web|multiple glowing eerie eyes/i.test(s);
            OPEN_MORPH_DICTIONARY.forEach(item => {
                if (item.id === "succubus_demon" && isMultiEyeGhost && !/demon horns|succubus tail/.test(sLow)) return;
                if ((item.reg.test(s) || sLow.includes(item.id) || (item.id === "undead_ghost" && /ghost girl|supernatural apparition/.test(sLow))) && !(/\b1boy\b/i.test(sLow) && /girl|女鬼|魅魔|娘/.test(item.cn))) {
                    parts.push(item.cn);
                }
            });
            const wild = mineWildDynamicTraits(s);
            wild.wildCn.forEach(c => { if (!parts.join(" ").includes(c)) parts.push(c); });

            if (/black hair/.test(sLow)) parts.push("黑发");
            else if (/silver hair|white hair/.test(sLow)) parts.push("银白发");
            else if (/blonde hair|golden hair/.test(sLow)) parts.push("金发");
            else if (/pink hair/.test(sLow)) parts.push("粉发");
            else if (/purple hair/.test(sLow)) parts.push("紫发");
            else if (/blue hair/.test(sLow)) parts.push("蓝发");
            else if (/red hair|crimson hair/.test(sLow)) parts.push("红发");
            else if (/green hair/.test(sLow)) parts.push("绿发");
            else if (/brown hair/.test(sLow)) parts.push("棕发");

            if (/twintails|twin tails/.test(sLow)) parts.push("双马尾");
            else if (/ponytail/.test(sLow)) parts.push("单马尾");
            else if (/hime cut/.test(sLow)) parts.push("姬发式");
            else if (/hair bun/.test(sLow)) parts.push("丸子头");
            else if (/braid/.test(sLow)) parts.push("麻花辫");
            else if (/short hair|bob cut/.test(sLow)) parts.push("短发");
            else if (/wavy hair|curly hair/.test(sLow)) parts.push("长卷发");
            else if (/long hair/.test(sLow)) parts.push("长直发");

            if (/black eyes/.test(sLow)) parts.push("黑瞳");
            else if (/red eyes|crimson eyes/.test(sLow)) parts.push("红瞳");
            else if (/golden eyes|yellow eyes|amber eyes/.test(sLow)) parts.push("金瞳");
            else if (/purple eyes|violet eyes/.test(sLow)) parts.push("紫瞳");
            else if (/blue eyes/.test(sLow)) parts.push("蓝瞳");
            else if (/green eyes/.test(sLow)) parts.push("绿瞳");
            else if (/pink eyes/.test(sLow)) parts.push("粉瞳");
            else if (/brown eyes/.test(sLow)) parts.push("棕瞳");

            if (/red-framed.*glasses/.test(sLow)) parts.push("👓红框眼镜");
            else if (/glasses/.test(sLow)) parts.push("👓眼镜");

            if (/four breasts|six breasts|three breasts|two pairs of breasts/.test(sLow)) parts.push("多乳形体");
            else if (/huge.*breasts|gigantic.*breasts/.test(sLow)) parts.push("爆乳丰满");
            else if (/large.*breasts|voluptuous/.test(sLow)) parts.push("巨乳丰满");
            else if (/petite|small breasts|flat chest|loli/.test(sLow)) parts.push("娇小萝莉");
            else parts.push("匀称体型");

            if (/dark skin|tan/.test(sLow)) parts.push("小麦/黑皮");
            else if (/pink skin/.test(sLow)) parts.push("粉嫩魔肤");
            else if (/blue skin/.test(sLow)) parts.push("冰蓝肤色");
            else if (/green skin/.test(sLow)) parts.push("翠绿魔肤");
            else parts.push("白皙肌肤");

            return [...new Set(parts)].join(" · ");
        }

        function getLockedAppearanceTags(u, v) {
            // ★ 自动清洗之前旧存档里误存的假植物娘藤蔓与会引发6乳/4穴的冗余叠加词！
            if (v?.档案?.锁定外貌DNA) {
                const rawChatCheck = safeStr(safeCtx()?.chat?.slice(-3).map(m => m?.mes).join(" "));
                if (!/植物娘|花妖|树精|藤蔓娘|食人花娘|alraune/i.test(rawChatCheck)) {
                    v.档案.锁定外貌DNA = v.档案.锁定外貌DNA
                        .replace(/,?\s*(?:plant girl|blooming flower petals on body|writhing green vine tendrils|glistening floral nectar|alraune|plant monster girl)/gi, "");
                }
                v.档案.锁定外貌DNA = v.档案.锁定外貌DNA
                    .replace(/,?\s*two pairs of breasts/gi, "")
                    .replace(/,?\s*4 breasts/gi, "")
                    .replace(/,?\s*4 nipples/gi, "")
                    .replace(/,?\s*two vertically stacked vaginas/gi, ", two vaginas")
                    .replace(/^[\s,]+|[\s,]+$/g, "");
            }
            if (v?.档案?.锁定外貌DNA && safeStr(v.档案.锁定外貌DNA).trim()) {
                if (v.档案.手动锁死外貌Flag || isGeneratingImageBusy) {
                    const locked = safeStr(v.档案.锁定外貌DNA).trim();
                    v.档案.当前提取形象摘要 = summarizeDnaTagsToChinese(locked);
                    return locked;
                }
            }
            const extracted = extractTargetCurrentAppearance(u, v);
            if (v && v.档案) {
                v.档案.锁定外貌DNA = extracted.tags;
                v.档案.当前提取形象摘要 = extracted.cnSummary;
            }
            userSettings.lockedAppearanceTags = extracted.tags;
            return extracted.tags;
        }

        // ★ 修复：getHeadOnlyDnaTags 完整保留 four eyes / three eyes / extra eyes 等面部多眼特征！
        function getHeadOnlyDnaTags(fullDna) {
            const parts = safeStr(fullDna).replace(/\d+(?:\.\d+)?::/g, "").replace(/::/g, "").split(",").map(s => s.trim()).filter(Boolean);
            const headParts = parts.filter(p => /hair|twintails|ponytail|braid|bangs|bun|hime cut|eyes|four eyes|three eyes|third eye|two pairs of eyes|pupil|mole under eye|glasses|ear|horn|halo|slime|translucent|eldritch|chitin|cyberborg|pale white skin|fair skin|pale skin|dark skin|pink skin|blue skin|green skin|pig snout|fangs|sharp teeth|long.*tongue/i.test(p) && !/breasts|pussy|vagina|waist|hips|petite|lolita|dress|skirt|thigh|stocking|instead of legs|on body/i.test(p));
            return headParts.length ? headParts.join(", ") : "black hair, long hair, pale white skin";
        }

        function getBodySizeAndBreastProfile(fullDna) {
            const s = safeStr(fullDna).toLowerCase();
            if (/petite|loli|flat chest|small breasts/.test(s)) {
                return {
                    tier: "loli_petite",
                    bodyTag: "petite loli body, slender narrow waist, delicate small hips, thin slender thighs",
                    breastByStage: [
                        "flat chest, tiny small breasts, small flat pink nipple buds, no cleavage",
                        "petite small breasts, puffy erect pink nipples, slight chest swelling",
                        "petite modest breasts, swollen dark-pink areola, erect nipples",
                        "swollen lactating petite breasts, distended small mammary, leaking milk droplets",
                        "heavily swollen lactating breasts on petite frame, dilated nipple holes squirting milk",
                        "corrupted hyper-swollen lactating udder breasts on petite body, gaping nipple holes gushing milk"
                    ],
                    braFocusTag: "petite flat chest in cute small bra, delicate innerwear cup close-up, no deep cleavage",
                    negBreast: "2.2::huge breasts, gigantic breasts, large breasts, deep cleavage, mature female, milf, wide hips, thick thighs::, "
                };
            }
            if (/huge.*breasts|gigantic.*breasts/.test(s)) {
                return {
                    tier: "huge_voluptuous",
                    bodyTag: "voluptuous body, curvy waist, wide plump hips, thick soft thighs",
                    breastByStage: [
                        "huge perky breasts, deep cleavage, small pink nipples",
                        "huge breasts, swollen erect pink nipples, wet sweat sheen",
                        "huge heavy breasts, wide dark areola, puffy nipples",
                        "huge lactating breasts, visible blue veins, squirting breast milk",
                        "gigantic sagging lactating udder breasts, dilated nipple holes dripping milk",
                        "corrupted gigantic udder breasts, gaping nipple holes gushing thick milk"
                    ],
                    braFocusTag: "huge breasts overflowing from tight bra cups, deep plump cleavage",
                    negBreast: "1.8::flat chest, small breasts, loli::, "
                };
            }
            if (/large.*breasts|voluptuous/.test(s)) {
                return {
                    tier: "large_curvy",
                    bodyTag: "curvy body, slender waist, plump hips, soft thighs",
                    breastByStage: [
                        "large perky breasts, soft cleavage, pink nipples",
                        "large breasts, swollen erect pink nipples, sweat sheen",
                        "large full breasts, dark wide areola, puffy erect nipples",
                        "large lactating breasts, squirting breast milk, blue veins",
                        "huge sagging lactating breasts, dilated nipple holes dripping milk",
                        "corrupted huge udder breasts, gaping nipple holes gushing thick milk"
                    ],
                    braFocusTag: "large breasts in fitted bra cups, soft cleavage focus",
                    negBreast: "1.8::flat chest, small breasts::, "
                };
            }
            return {
                tier: "medium_slender",
                bodyTag: "slender girl body, slender waist, neat hips, smooth thighs",
                breastByStage: [
                    "medium perky breasts, small pink nipples",
                    "medium breasts, swollen erect pink nipples, wet sweat sheen",
                    "medium full breasts, wide areola, puffy erect nipples",
                    "swollen lactating breasts, squirting breast milk",
                    "heavy sagging lactating breasts, dilated nipple holes dripping milk",
                    "corrupted udder breasts, gaping nipple holes gushing thick milk"
                ],
                braFocusTag: "medium breasts in neat bra cups, subtle cleavage",
                negBreast: ""
            };
        }

        function getSkinOnlyDnaTags(fullDna, includeBodyProportion = true) {
            const s = safeStr(fullDna).toLowerCase();
            let baseSkin = "pale white skin, soft glossy skin";
            if (/dark skin|tan/.test(s)) baseSkin = "dark skin, glossy skin";
            else if (/pink skin/.test(s)) baseSkin = "pink skin, glossy skin";
            else if (/blue skin/.test(s)) baseSkin = "blue skin, glossy skin";
            else if (/green skin/.test(s)) baseSkin = "green skin, glossy skin";

            const matExtras = [];
            if (includeBodyProportion) {
                const prof = getBodySizeAndBreastProfile(fullDna);
                matExtras.push(prof.tier === "loli_petite" ? "petite slender frame" : (prof.tier === "huge_voluptuous" || prof.tier === "large_curvy" ? "voluptuous curvy frame" : "slender frame"));
            }
            if (/ghost girl|supernatural apparition|yurei/.test(s)) matExtras.push("pale cold supernatural ghost skin, faint dark mist aura");
            if (/slime|translucent gelatinous/.test(s)) matExtras.push("translucent gelatinous slime body, semi-transparent glowing slime skin");
            if (/lamia|snake scales|snake tail|dragon/.test(s)) matExtras.push("glistening snake scales framing the skin edges");
            if (/mermaid|fish scales|fish tail/.test(s)) matExtras.push("iridescent shimmering fish scales on skin edges");
            if (/arachne|chitin|exoskeleton|insect/.test(s)) matExtras.push("glossy dark chitinous exoskeleton plates framing the soft flesh");
            if (/cyborg|mechanical joints|ball-jointed doll/.test(s)) matExtras.push("ball-jointed doll seams, exposed cybernetic mechanical joints");
            if (/eldritch|flesh mound|abomination/.test(s)) matExtras.push("eldritch writhing flesh tendrils, dark slime");
            if (/alraune/.test(s)) matExtras.push("creeping vine tendrils framing the skin");
            if (/dripping wet/.test(s)) matExtras.push("dripping wet cold skin, dark cursed water droplets");

            return [baseSkin, ...matExtras].join(", ");
        }

        function getSpeciesSignatureFromDna(dnaStr) {
            const s = safeStr(dnaStr).toLowerCase();
            if (!s) return "human";
            const sigs = new Set();

            const isMultiEyeGhost = /spider web|multiple glowing eerie eyes/.test(s);
            OPEN_MORPH_DICTIONARY.forEach(item => {
                if (item.id === "succubus_demon" && isMultiEyeGhost && !/demon horns|succubus tail/.test(s)) return;
                if (item.reg.test(s) || s.includes(item.id) || (item.id === "undead_ghost" && /ghost girl|supernatural apparition|yurei/.test(s))) {
                    sigs.add(item.id);
                }
            });
            const wild = mineWildDynamicTraits(s);
            wild.wildIds.forEach(id => {
                if (!id.startsWith("custom_")) sigs.add(id);
            });

            return sigs.size > 0 ? Array.from(sigs).sort().join("|") : "human";
        }

        // ★ 新增：五维图池之【部位级专属解剖指纹锁】，确保4眼/4乳/双穴绝不调用2眼/2乳/单穴的旧图！
        function getPartAnatomySignature(editKey, fullDnaStr, descText = "") {
            const key = String(editKey || "");
            const combined = `${safeStr(fullDnaStr)} ${safeStr(descText)}`.toLowerCase();
            const skin = /dark skin|tan/.test(combined) ? "dark" : (/pink skin/.test(combined) ? "pink" : (/blue skin/.test(combined) ? "blue" : "pale"));
            const bodyTier = /petite|loli|flat chest|small breasts/.test(combined) ? "loli" : (/huge|gigantic/.test(combined) ? "huge" : "normal");

            if (key === "胸部实况" || key === "穿搭_胸罩" || key === "穿搭_上衣" || key === "穿刺环饰") {
                const bCount = /four breasts|四个奶|四颗.*乳|四乳|两对.*乳/.test(combined) ? "4breasts"
                    : (/six breasts|六个奶|多乳/.test(combined) ? "6breasts"
                    : (/three breasts|三个奶|三乳/.test(combined) ? "3breasts" : "2breasts"));
                const web = /spider web|纺丝|淫丝/.test(combined) ? "web" : "noweb";
                return `chest_${skin}_${bodyTier}_${bCount}_${web}`;
            }
            if (key === "小穴实况" || key === "阴蒂尿道" || key === "穿搭_内裤" || key === "体内道具" || key === "破瓜纪念") {
                const vCount = /double pussy|two vaginas|两个.*小穴|两个.*穴|双穴/.test(combined) ? "2pussies"
                    : (/multiple pussies|three vaginas|全身.*小穴|多穴/.test(combined) ? "multipussies" : "1pussy");
                return `vag_${skin}_${vCount}`;
            }
            if (key === "穿搭_头饰" || key === "内心独白" || key === "骚口实况") {
                const eCount = /four eyes|two pairs of eyes|四只眼|四眼|四目|两对眼/.test(combined) ? "4eyes"
                    : (/three eyes|third eye|三只眼|三目/.test(combined) ? "3eyes" : "2eyes");
                const fangs = /sharp fangs|尖牙|虎牙|长舌/.test(combined) ? "fangs" : "nofangs";
                return `head_${skin}_${eCount}_${fangs}`;
            }
            return `gen_${skin}_${bodyTier}_${getSpeciesSignatureFromDna(combined)}`;
        }

        function getFullMorphFormSignature(dnaStr) {
            const s = safeStr(dnaStr).toLowerCase();
            const sp = getSpeciesSignatureFromDna(s);
            const hc = (s.match(/\b(?:silver|white|blonde|golden|black|pink|purple|blue|red|crimson|brown|green|grey)\s+hair\b/) || ["black hair"])[0];
            const sk = /dark skin|tan/.test(s) ? "dark" : (/pink skin/.test(s) ? "pink" : (/blue skin/.test(s) ? "blue" : "pale"));
            const bt = /1boy|male focus/.test(s) ? "male" : (/petite|loli|flat chest|small breasts/.test(s) ? "loli" : (/huge|gigantic/.test(s) ? "huge" : "normal"));
            return `${sp}__${hc.replace(/\s+/g, "_")}__${sk}__${bt}`;
        }

        async function aiLockAppearanceByChinese(chineseInput, isAutoExtractBtn = false) {
            const u = detectProtagonistName(curVars);
            const ctx = safeCtx();
            const rawInput = safeStr(chineseInput).trim();
            const isOldEnglishTagsOnly = /^[a-zA-Z0-9,\s_-]+$/.test(rawInput);

            if (isAutoExtractBtn && curVars.档案) {
                curVars.档案.手动锁死外貌Flag = false;
                curVars.档案.锁定外貌DNA = "";
            }
            _appearMemoCache = { sig: "", res: null };

            const userCustomHint = isAutoExtractBtn ? "" : (isOldEnglishTagsOnly ? "" : rawInput);
            const autoObj = extractTargetCurrentAppearance(u, curVars, userCustomHint);
            let finalTags = autoObj.tags;

            if (!isAutoExtractBtn && rawInput) {
                if (isOldEnglishTagsOnly) {
                    finalTags = rawInput;
                } else {
                    finalTags = extractTargetCurrentAppearance(u, curVars, rawInput + " " + rawInput).tags;
                }
            }

            if (userSettings.apiUrl && userSettings.apiKey && (isAutoExtractBtn || !isOldEnglishTagsOnly)) {
                try {
                    const btnDescContext = collectAllActiveButtonDescriptionsForAppearance(curVars).slice(-1400);
                    const recentChat = (ctx?.chat || []).slice(-2).map(m => safeStr(m?.mes)).join("\n").slice(-1000);
                    showToast(`🤖 正在结合状态栏按钮描述深度提炼【${u}】的外貌 Tag...`, "info", 3000);
                    const { reply } = await callSubApiRaw(
                        `Extract ONLY the target character 【${u}】's CURRENT physical appearance and species morphology into Danbooru English tags separated by commas.
CRITICAL RULES:
1. Prioritize the "Current Status Bar Button Descriptions" above everything else!
2. If she has 4 eyes, output "four eyes, two pairs of eyes on face". If she has 4 breasts, output ONLY "four breasts" (DO NOT output two pairs of breasts or 6 breasts). If she has 2 pussies, output ONLY "double pussy, two vaginas".
3. NEVER output "vines" or "flower petals" unless she is explicitly a plant monster girl (植物娘/花妖)!
4. Include hair color, hairstyle, eye color, body size, skin tone. Output ONLY comma-separated English tags.`,
                        `Target Character: ${u}\nUser Custom Hint: ${userCustomHint || "无"}\nCurrent Status Bar Button Descriptions:\n${btnDescContext}\nLatest Story Text:\n${recentChat}`
                    );
                    const clean = safeStr(reply).replace(/[\n\r"'`。！]/g, "").trim();
                    if (clean.length > 5) {
                        finalTags = `${clean}, ${autoObj.primaryMorph ? autoObj.primaryMorph.en : ""}`.replace(/,\s*,/g, ",").replace(/^,\s*|,\s*$/g, "");
                    }
                } catch (e) {}
            }

            const cnSum = summarizeDnaTagsToChinese(finalTags);
            curVars.档案 = curVars.档案 || {};
            curVars.档案.锁定外貌DNA = finalTags;
            curVars.档案.当前提取形象摘要 = cnSum;
            curVars.档案._dnaLockedAtFloor = safeCtx()?.chat?.length || 0;
            curVars.档案.手动锁死外貌Flag = !isAutoExtractBtn && Boolean(rawInput);
            userSettings.lockedAppearanceTags = finalTags;

            _dynCtxCache = { sig: "", res: null };
            _appearMemoCache = { sig: "", res: null };
            if (curVars.按钮详情 && typeof curVars.按钮详情 === "object") {
                Object.keys(curVars.按钮详情).forEach(k => {
                    if (userSettings.pinnedItems?.[k]) return;
                    delete curVars.按钮详情[k].desc;
                    delete curVars.按钮详情[k].thought;
                    if (!k.startsWith("穿搭_")) delete curVars.按钮详情[k].stage;
                });
            }

            saveChatCache(curVars);
            saveSettings();
            latestStatus = getFallbackData();
            renderBody();
            showToast(`✅ 【${u}】当前外貌特征已按按钮描述精准识别：${cnSum}`, "success", 3800);
            return finalTags;
        }

        function getProtagScopedImgKey(editKey, stageNum) {
            const u = detectProtagonistName(curVars) || "protag";
            const dnaNow = curVars?.档案?.锁定外貌DNA || "";
            const partAnatSig = getPartAnatomySignature(editKey, dnaNow, curVars?.按钮详情?.[editKey]?.desc || "").replace(/[^a-zA-Z0-9_]/g, "_");
            const chatKey = getChatStoreKey().replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_").slice(-20);
            return `${chatKey}_${u}_${partAnatSig}_${editKey}_${stageNum}`;
        }

        function getGlobalPinKey(editKey, stageNum) {
            return `global_pin_${editKey}_${stageNum}`;
        }

        // 🎨 终极精准版：全按钮描述 1:1 直译生图编译器（彻底根治 4奶变6奶、2穴变4穴、4眼变2眼、假藤蔓、跨部位污染）
        function translateAnyButtonDescToVisualTags(descText, partKey = "", fullCharDna = "") {
            const btnOnlyText = stripFakeAccessoryAndMetaphorWords(safeStr(descText))
                .replace(/💭【[^】]*实时心声】[：:\s]*[\s\S]*$/g, "")
                .replace(/📊\s*【[^】]*统计】[：:\s]*[^\n]*/g, "")
                .replace(/（畸变点：[^）]*）/g, "");
            const key = String(partKey || "");

            const posTags = [];
            const extraNegTags = [];
            const removeFromTemplateRegs = [];
            const removeFromNegRegs = [];
            let isMutatedAnatomy = false;

            const addMut = (tagStr, cleanTplReg = null, cleanNegReg = null, negBanStr = "") => {
                posTags.push(tagStr);
                isMutatedAnatomy = true;
                if (cleanTplReg) removeFromTemplateRegs.push(cleanTplReg);
                if (cleanNegReg) removeFromNegRegs.push(cleanNegReg);
                if (negBanStr) extraNegTags.push(negBanStr);
            };

            const isChestAllowed = (key === "胸部实况" || key === "穿搭_胸罩" || key === "穿搭_上衣" || key === "穿刺环饰" || key === "肉体外貌" || key === "当前姿势" || key === "身份与背景");
            const isVagAllowed   = (key === "小穴实况" || key === "阴蒂尿道" || key === "穿搭_内裤" || key === "体内道具" || key === "破瓜纪念" || key === "肉体外貌" || key === "当前姿势");
            const isHeadAllowed  = (key === "穿搭_头饰" || key === "内心独白" || key === "骚口实况" || key === "身份与背景" || key === "肉体外貌" || key === "当前姿势" || !UNIVERSAL_LOCAL_PARTS.has(key));
            const isBellyAllowed = (key === "子宫实况" || key === "排卵周期" || key === "受精断面" || key === "孕肚进度" || key === "精液归属" || key === "淫纹烙印" || key === "正字涂鸦");
            const isAnalAllowed  = (key === "屁眼实况" || key === "穿搭_下装");

            // 1. 👁️ 【四只眼睛 / 三只眼】—— 只要头部/面容或全身按钮描述里有四眼，立即注入最高权重 four eyes！
            if (isHeadAllowed && !/胸部实况|小穴实况|阴蒂尿道|屁眼实况|子宫实况|排卵周期|受精断面|孕肚进度|穿搭_颈部|穿搭_胸罩|穿搭_上衣|穿搭_内裤|穿搭_下装|穿搭_丝袜|穿搭_鞋子/.test(key)) {
                if (/(?:四只眼|四眼|四目|两对眼睛|四颗眼|眼眶下.*副眼|four eyes|two pairs of eyes)/i.test(`${btnOnlyText} ${fullCharDna}`)) {
                    addMut("1.55::four eyes, two pairs of eyes on face, extra eyes on face::",
                        null,
                        /bad anatomy|deformed|mutated|extra eyes/gi,
                        "six eyes, multiple eyes all over body");
                } else if (/(?:三只眼|三目|额头.*竖眼|眉心.*第三只眼|three eyes|third eye)/i.test(`${btnOnlyText} ${fullCharDna}`)) {
                    addMut("1.55::three eyes, third eye on forehead::", null, /bad anatomy|extra eyes/gi);
                }
            }

            // 2. 🍒 【四个奶 / 多乳】—— 严格只用单一词 four breasts，清洗一切普通 breasts 复数词，并在负面词强封杀 6 breasts / three pairs / udder！
            if (isChestAllowed) {
                if (/(?:四个|四颗|两对|4个|四只|双排)[^。！？；\n]{0,12}(?:奶|乳|胸|峰)|四乳|four breasts/i.test(btnOnlyText)) {
                    addMut("1.4::four breasts::",
                        /flat chest|tiny small breasts|small flat pink nipple buds|petite small breasts|petite modest breasts|medium perky breasts|medium breasts|medium full breasts|large perky breasts|large breasts|huge perky breasts|huge breasts|swollen lactating breasts|heavy sagging lactating breasts|corrupted udder breasts|plump breasts|full breasts|no cleavage|multiple breasts|extra breasts|two pairs of breasts|4 breasts/gi,
                        /huge breasts|gigantic breasts|large breasts|deep cleavage|bad anatomy|extra breasts|extra nipples/gi,
                        "2.2::six breasts, 6 breasts, five breasts, 5 breasts, three pairs of breasts, 3 rows of breasts, rows of breasts, udder, many breasts, 6 nipples, 3 breasts::");
                } else if (/(?:六个|六颗|八个|三对|四对|一排|两排|母猪般.*一排|多对)[^。！？；\n]{0,12}(?:奶|乳|胸)|多乳|six breasts/i.test(btnOnlyText)) {
                    addMut("1.5::six breasts, rows of breasts::",
                        /flat chest|tiny small breasts|small flat pink nipple buds|petite small breasts|no cleavage/gi,
                        /huge breasts|gigantic breasts|large breasts|deep cleavage|bad anatomy|extra breasts|extra nipples/gi);
                } else if (/(?:三个|三颗|3个)[^。！？；\n]{0,10}(?:奶|乳|胸)|三乳|three breasts/i.test(btnOnlyText)) {
                    addMut("1.45::three breasts::",
                        /flat chest|tiny small breasts|small flat pink nipple buds|no cleavage|multiple breasts|extra breasts/gi,
                        /huge breasts|gigantic breasts|large breasts|deep cleavage|bad anatomy/gi,
                        "2.2::four breasts, 4 breasts, six breasts, 6 breasts, two pairs of breasts::");
                }
                if (/狂飙.*乳|花洒.*喷|喷溅.*浓奶|飙射.*乳汁/i.test(btnOnlyText)) {
                    posTags.push("1.55::lactation, breast milk squirting from nipples::");
                } else if (/泌乳|喷乳|漏奶|渗出.*初乳|渗出.*乳汁|奶水|lactation/i.test(btnOnlyText) && !/未泌乳|安静未泌乳|蓄乳 0\//.test(btnOnlyText)) {
                    posTags.push("1.45::lactation, milk droplets on nipples::");
                }
                if (/纺丝腺|吐.*淫丝|粉红.*淫丝/i.test(btnOnlyText)) {
                    addMut("1.55::sticky pink spider web threads oozing from erect nipples::");
                }
            }

            // 3. 🌺 【两个小穴 / 双穴】—— 严格只用 double pussy, two vaginas，严禁 extra pussy / twin vulvas 避免裂变成三四个穴！
            if (isVagAllowed) {
                if (/(?:全身|浑身|遍布|布满|到处都是|密密麻麻|无数)[^。！？；\n]{0,12}(?:小穴|肉穴|淫穴|蜜穴|肉洞|阴道)|multiple pussies/i.test(btnOnlyText)) {
                    addMut("1.8::multiple pussies all over body::",
                        /tight closed pink labia|virgin slit/gi,
                        /bad anatomy/gi);
                } else if (/(?:三个|四个|五个|六个|一排|多个)[^。！？；\n]{0,10}(?:小穴|肉穴|淫穴|蜜穴|阴道)|multiple vaginas/i.test(btnOnlyText)) {
                    addMut("1.7::three vaginas::",
                        /tight closed pink labia|virgin slit/gi,
                        /bad anatomy/gi);
                } else if (/两个[^。！？；\n]{0,10}(?:粉嫩.*)?小穴|上下.*两个.*穴|并排.*两个.*穴|双穴|两个独立.*穴|double pussy|two vaginas/i.test(btnOnlyText)) {
                    addMut("1.55::double pussy, two vaginas::",
                        /tight closed pink labia|virgin slit|of pussy vulva only|extra pussy|twin vulvas|multiple pussies|multiple vaginas/gi,
                        /bad anatomy|extra digits/gi,
                        "2.2::three pussies, 3 pussies, 3 vaginas, four pussies, 4 pussies, 4 vaginas, many pussies, multiple pussies all over body, cluster of pussies, trypophobia::");
                }
                if (/白虎|半根阴毛都没有|连一根阴毛都没有|无毛|光洁外阴/i.test(btnOnlyText)) {
                    posTags.push("1.45::hairless pussy, smooth pudendum::");
                }
                if (/外翻黑木耳|紫红色.*外翻|肥厚外翻/i.test(btnOnlyText)) {
                    posTags.push("1.55::swollen dark-purple everted labia minora, spread labia::");
                } else if (/肉壁脱垂|漏精肉壶|翻卷垂挂在穴口外|拳头大小.*烂肉坑|合不拢的鲜红肉洞/i.test(btnOnlyText)) {
                    posTags.push("1.65::gaping open vaginal hole, everted red vaginal folds, heavy cum overflowing::");
                }
                if (/肉丝褶皱|吸精肉丝|吸盘.*内壁|上千颗.*肉芽/i.test(btnOnlyText)) {
                    addMut("1.55::writhing pink meat tendrils inside vaginal opening::");
                }
                if (/雌性小肉棒|阴蒂.*肥大如龟头|拇指粗.*阴蒂/i.test(btnOnlyText)) {
                    posTags.push("1.65::clitoris hypertrophy, huge swollen erect clitoris::");
                }
                if (/尿道口.*扩成.*肉洞|喷泉孔|狂喷失禁|飙射.*金黄热尿|失禁漏尿/i.test(btnOnlyText) && !/失禁 0 次|失禁度 0|绝不会.*漏尿/.test(btnOnlyText)) {
                    posTags.push("1.6::dilated urethral opening, squirting yellow urine stream::");
                }
            }

            // 4. 【子宫/受孕/孕肚】
            if (isBellyAllowed) {
                if (/透明薄膜包囊|完全透明化病变|透过.*肚皮.*看见/i.test(btnOnlyText)) {
                    addMut("1.75::translucent see-through abdomen skin showing internal womb::");
                } else if (/高高挺起|吹气的气球|显怀大肚/i.test(btnOnlyText)) {
                    posTags.push("1.6::heavily distended cum belly, bulging round abdomen::");
                }
                if (/(?:肚子|小腹|肚皮)[^。！？；\n]{0,8}(?:裂开|长出|张开)[^。！？；\n]{0,8}(?:嘴|大嘴|口器)|stomach mouth/i.test(btnOnlyText)) {
                    addMut("1.8::stomach mouth, vertical mouth on belly with tongue::", null, /bad anatomy/gi);
                }
            }

            // 5. 【屁眼/后庭】
            if (isAnalAllowed) {
                if (/重度脱肛|直肠肉管.*翻出体外|脱肛红肉玫瑰|轻度脱肛翻肉/i.test(btnOnlyText)) {
                    posTags.push("1.7::anal prolapse, everted red rectal rosebud mucosa protruding from gaping anus::");
                } else if (/黑乎乎、合不拢的圆洞|后庭.*松弛失守/i.test(btnOnlyText)) {
                    posTags.push("1.6::gaping open anal hole, visible red rectum interior::");
                }
            }

            // 6. 【嘴巴/舌头/牙齿】
            if (isHeadAllowed && !/胸部实况|小穴实况|阴蒂尿道|屁眼实况|子宫实况|排卵周期|受精断面|孕肚进度|穿搭_胸罩|穿搭_上衣|穿搭_内裤|穿搭_下装|穿搭_丝袜|穿搭_鞋子/.test(key)) {
                if (/(?:两个|两张|双|多张)[^。！？；\n]{0,8}(?:嘴|嘴巴|口器|骚口)|multiple mouths/i.test(btnOnlyText)) {
                    addMut("1.75::multiple mouths, two mouths::", null, /bad anatomy/gi);
                }
                if (/(?:两条|三根|多条|分叉)[^。！？；\n]{0,8}(?:舌|长舌|淫舌)|forked.*tongue|multiple tongues/i.test(btnOnlyText)) {
                    addMut("1.7::long forked tongue::");
                } else if (/三十公分.*舌|极长.*舌|肉刺.*舌|猩红长舌/i.test(btnOnlyText)) {
                    addMut("1.7::extremely long monster red tongue, barbed tongue::");
                }
                if (/三排.*尖牙|密密麻麻.*尖牙|裂口|撕裂到耳根|小虎牙|尖牙/i.test(btnOnlyText)) {
                    addMut("1.6::sharp fangs, monster teeth::");
                }
            }

            // 7. 【当前按钮自身的服饰/道具/姿势描述直译】
            const customWearRules = [
                [/灰色.*卫衣.*滑落|大得离谱.*卫衣/, "oversized grey hoodie slipping off narrow shoulders"],
                [/浅粉色连帽卫衣|粉色.*卫衣/, "oversized light pink hoodie"],
                [/哥特|黑蕾丝.*蓬蓬裙|洛丽塔/, "gothic lolita black lace frilly dress"],
                [/死库水|蓝色旧校服泳衣/, "sukumizu, school swimsuit, wet clothes"],
                [/露脐.*运动小背心/, "cropped white sports tank top"],
                [/牛仔热裤|牛仔短裤/, "tight denim micro shorts"],
                [/黑色蕾丝开裆内裤|开裆内裤|镂空内裤/, "black lace crotchless panties exposing wet vulva"],
                [/连内裤都不穿|无内裤|真空/, "no panties, bottomless"],
                [/贞操带/, "locked leather chastity belt"],
                [/撕开大洞.*黑丝|破洞黑丝/, "torn sheer black pantyhose with large ripped holes"],
                [/白丝|白色.*长筒袜|洁白及膝袜/, "white kneehigh stockings"],
                [/黑丝|黑色.*丝袜|连裤黑丝/, "sheer black thighhigh stockings"],
                [/赤足|光着.*脚|裸足/, "barefoot, delicate bare feet"],
                [/开口环|口球/, "ring gag in mouth, drooling saliva"],
                [/锁链项圈|皮革.*项圈|铭牌.*项圈/, "leather bondage collar with metal chain leash"],
                [/铃铛乳环|银色乳环|乳环/, "silver nipple rings with tiny dangling bells"],
                [/正字涂鸦|写满.*正字/, "black tally marks and lewd body writing on skin"],
                [/魅魔淫纹|紫红.*淫纹|心形.*淫纹/, "glowing purple-pink heart-shaped womb tattoo on lower abdomen"],
                [/无线跳蛋|粉红.*跳蛋/, "pink wireless vibrator egg inserted in pussy"],
                [/跪坐在.*地板|双膝.*跪倒|温顺跪姿/, "kneeling on floor"],
                [/四肢着地.*爬行|母狗.*跪爬/, "crawling on all fours"],
                [/M字大开|M字开腿|双腿大敞/, "M-legs spread wide open"]
            ];
            if (!UNIVERSAL_LOCAL_PARTS.has(key) || /穿刺|道具|涂鸦|淫纹/.test(key)) {
                customWearRules.forEach(([reg, enTag]) => {
                    if (reg.test(btnOnlyText)) posTags.push(`1.5::${enTag}::`);
                });
            }

            const customUserDesc = `${safeStr(curVars?.按钮详情?.[key]?.desc)} ${safeStr(curVars?.按钮详情?.[key]?.stage)}`;
            const customEnList = customUserDesc.match(/[a-zA-Z0-9_\s:()-]{4,}/g) || [];
            customEnList.forEach(enStr => {
                const trimEn = enStr.trim();
                if (trimEn.length >= 4 && !/^(?:http|data|webp|true|false|null|LV\.\d+|BPM|MAX)$/i.test(trimEn)) {
                    posTags.push(`1.6::${trimEn}::`);
                }
            });

            return {
                posBoostStr: [...new Set(posTags.filter(Boolean))].join(", "),
                extraNegStr: [...new Set(extraNegTags.filter(Boolean))].join(", "),
                removeFromTemplateRegs,
                removeFromNegRegs,
                isMutatedAnatomy
            };
        }

        function extractExtraSceneTagsFromButtonDesc(descText, partKey = "") {
            return translateAnyButtonDescToVisualTags(descText, partKey, "").posBoostStr;
        }
        function buildDanbooruImageBlock(item, curStageIdx, u) {
            const key = item.editKey || "custom";
            const stageNames = ["初绽完好", "初步驯化", "深度开发", "括约肌松弛", "重度畸变", "彻底崩坏"];
            const idx = Math.min(5, Math.max(0, curStageIdx - 1)), stgTag = stageNames[idx];
            const fullCharDna = getLockedAppearanceTags(u, curVars);
            const headOnlyDna = getHeadOnlyDnaTags(fullCharDna);
            const skinOnlyDna = getSkinOnlyDnaTags(fullCharDna, true);
            const bodyProf = getBodySizeAndBreastProfile(fullCharDna);
            const dur = safeNum(userSettings.clothDurability, 100);
            const dmgTag = dur <= 15 ? "shredded clothes scraps, " : dur <= 45 ? "torn clothes, " : "";
            const paraTag = userSettings.parasiteState?.lv > 0 ? ", glowing pink parasite tentacles, slime fluid" : "";

            const IMG_OPEN = "<" + "image>";
            const IMG_CLOSE = "</" + "image>";
            const THINK_OPEN = "<" + "image_think>";
            const THINK_CLOSE = "</" + "image_think>";
            const HASH_PREFIX = "image" + "###";
            const HASH_SUFFIX = "###";

            const ctx = safeCtx();
            const recentMes = safeStr((ctx?.chat || []).slice(-2).map(m => m?.mes || "").join(" "));
            const sp = curVars.体内精液存量 || {}, totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
            const cNowForImg = curVars.计数 || {};
            const totalSexCntNow = safeNum(cNowForImg.性交?.小穴) + safeNum(cNowForImg.性交?.口) + safeNum(cNowForImg.性交?.屁眼) + safeNum(cNowForImg.性交?.乳穴) + safeNum(cNowForImg.性交?.足腿) + safeNum(cNowForImg.射精?.内射) + safeNum(cNowForImg.精液摄入?.吞精次数);
            const isPureInitialClean = (idx === 0 && totalMl === 0 && totalSexCntNow === 0 && safeNum(curVars.核心数值?.淫乱恶堕) < 15);
            const cleanRecentMes = recentMes.slice(-450).replace(/(?:没有|并未|未曾|0次|零次|不许|禁止|拒绝|想要|幻想|脑补|梦到)[^。！？；\n]{0,25}/g, "");
            const contextStr = `${safeStr(curVars.实况?.当前姿势)} ${cleanRecentMes}`;

            const selfMorphExcludeClean = contextStr.replace(/(?:肉棒和蛋蛋|我的肉棒)[^。！？；\n]{0,20}(?:缩进|消失|融化|没了)|(?:需要|必须|靠|吞吐|没有)[^。！？；\n]{0,15}肉棒[^。！？；\n]{0,15}(?:插入|活命|活下去|填塞)/g, "");
            const hasActiveSexInScene = !isPureInitialClean && totalSexCntNow > 0 && /(?:肉棒|阳具|龟头|阴茎|巨物).{0,12}(?:正插在|捅入|抽插着|顶入|没入|贯穿|深喉)|(?:正在|狠狠|挺腰|按在身下).{0,8}(?:内射|口交|肛交|乳交|足交|抽插|侵犯|轮奸)/.test(selfMorphExcludeClean);

            // ★ 核心升级：直接把当前按钮的完整描述 (item.desc + 用户自定义描述) 直译成最高权重的画面 Tag！
            const dnaLow = fullCharDna.toLowerCase();
            const isMaleProtagNow = /\b(?:1boy|male focus|flat male chest)\b/.test(dnaLow) && !/\b(?:1girl|loli|breasts)\b/.test(dnaLow);
            const btnSpecificDesc = `${safeStr(item.rawKey)} ${safeStr(item.desc)} ${safeStr(curVars.按钮详情?.[key]?.desc)} ${safeStr(curVars.按钮详情?.[key]?.stage)}`;
            const btnVisual = translateAnyButtonDescToVisualTags(btnSpecificDesc, key, fullCharDna);
            const btnMutTagStr = btnVisual.posBoostStr ? ", " + btnVisual.posBoostStr : "";

            // 提取按钮描述中的纯客观视觉句，放入 <image_think> 强制指导智绘姬严格按按钮描述作画！
            const rawBtnVisualSummary = safeStr(item.desc).split("💭")[0].replace(/\s+/g, " ").slice(0, 260);

            const sanitizeTemplateByBtnDesc = (tplStr) => {
                let res = safeStr(tplStr);
                btnVisual.removeFromTemplateRegs.forEach(reg => { res = res.replace(reg, ""); });
                return res.replace(/,\s*,+/g, ", ").replace(/^,\s*|,\s*$/g, "");
            };
            const sanitizeNegByBtnDesc = (negStr) => {
                let res = safeStr(negStr);
                btnVisual.removeFromNegRegs.forEach(reg => { res = res.replace(reg, ""); });
                if (btnVisual.extraNegStr) res += ", " + btnVisual.extraNegStr;
                return res.replace(/,\s*,+/g, ", ").replace(/^,\s*|,\s*$/g, "");
            };

            const liveDynamicList = [];
            const isUpperOrHeadPart = (key === "骚口实况" || key === "穿搭_头饰" || key === "穿搭_颈部" || key === "内心独白");
            const isChestOrTopPart = (key === "胸部实况" || key === "穿搭_胸罩" || key === "穿搭_上衣");
            const mouthCumMl = safeNum(sp.口内毫升);
            const vagMl = safeNum(sp.小穴毫升);
            const wombMl = safeNum(sp.子宫毫升);
            const analMl = safeNum(sp.屁眼毫升);
            const lowerCumMl = vagMl + wombMl + analMl;
            const hasFacialOrMouthCum = (mouthCumMl > 0 || safeNum(curVars.计数?.射精?.颜射体外) > 0);

            if (idx >= 1 && !isUpperOrHeadPart && !isChestOrTopPart && /喷尿|失禁|漏尿/i.test(contextStr)) {
                liveDynamicList.push("peeing, urinary incontinence, yellow urine stream");
            }
            if (idx >= 1) {
                if (isUpperOrHeadPart) {
                    if (mouthCumMl >= 15) liveDynamicList.push("cum in mouth, thick white semen dripping from lips");
                } else if (isChestOrTopPart) {
                    if (hasFacialOrMouthCum && totalMl >= 30) liveDynamicList.push("cum on breasts, white semen droplets on chest");
                } else if (lowerCumMl >= 25 || totalMl >= 45) {
                    liveDynamicList.push("cum overflow, thick white semen dripping");
                }
            }
            const liveExtra = (liveDynamicList.length ? ", " + liveDynamicList.join(", ") : "") + btnMutTagStr;

            const faceExpr = [
                "calm expression, pure clear eyes, composed aura, slight blush",
                "shy expression, embarrassed blush, biting lower lip, watery eyes",
                "heavy breathing, misty eyes, needy blushing face, parted glossy lips",
                "aroused expression, heart-shaped pupils, drooling slightly, submissive gaze",
                "ahegao, rolled back eyes, tongue hanging out, heavy flush, saliva string",
                "extreme mind break ahegao, empty heart eyes, profuse drooling, corrupted lewd smile"
            ][idx];

            const vagSexBoost = hasActiveSexInScene && idx >= 1 ? ", huge erect penis pressing against or penetrating gaping pussy, stretching labia, glans visible" : "";
            const wombSexBoost = hasActiveSexInScene && idx >= 1 ? ", huge penis glans pressing directly against open cervix mouth, ejaculating thick cum into womb" : "";
            const mouthSexBoost = hasActiveSexInScene && /口|舌|吞|喉/.test(contextStr) ? ", huge erect penis deepthroating inside open mouth, tongue wrapped around shaft" : "";

            const hasMouthCumNow = (mouthCumMl > 0 || safeNum(curVars.计数?.精液摄入?.吞精次数) > 0);
            const hasMilkNow = (safeNum(curVars.计数?.泌乳?.喷乳次数) > 0 || idx >= 3);
            const hasVagCumNow = ((vagMl + wombMl) > 0 || safeNum(curVars.计数?.射精?.内射) > 0);
            const hasAnalCumNow = (analMl > 0);

            const isLamiaOrMermaid = /lamia|snake tail|snake girl|naga|mermaid|fish tail/.test(dnaLow);
            const isArachneOrInsect = /arachne|spider|insectoid|chitin/.test(dnaLow);
            const isTentacleLower = /tentacle.*instead of|cecaelia|octopus girl|writhing tentacles/.test(dnaLow);
            const isSlimeMorph = /slime girl|translucent gelatinous/.test(dnaLow);
            const isPlantAlraune = /alraune|plant monster girl|flower petals/.test(dnaLow);
            const isEldritchNonHuman = /eldritch abomination|flesh mound|shoggoth/.test(dnaLow);
            const hasNonHumanLegs = isLamiaOrMermaid || isArachneOrInsect || isTentacleLower || isEldritchNonHuman || isPlantAlraune;
            const hasForkedTongue = /forked.*tongue|lamia|snake girl|naga|reptile/.test(dnaLow);

            const monsterLegNegBoost = hasNonHumanLegs ? "2.0::human legs, two legs, human feet, human ankles, shoes, high heels, boots::, " : "";
            const anatomyNegWord = (isEldritchNonHuman || isArachneOrInsect || isTentacleLower || btnVisual.isMutatedAnatomy) ? "" : "bad anatomy, ";
            const subjectTag = isMaleProtagNow ? "1boy, male focus" : (isEldritchNonHuman ? "1monster, eldritch abomination, monster morphology" : (hasNonHumanLegs || isSlimeMorph ? "1girl, monster girl" : "1girl"));

            const STRICT_HEADLESS_NEG = "2.4::head, face, eyes, mouth, nose, hair, bangs, twintails, ponytail, portrait, looking at viewer, head in frame, upper head::, ";

            const adaptPoseForMonster = (humanPoseStr) => {
                if (!hasNonHumanLegs && !isSlimeMorph) return humanPoseStr;
                let s = humanPoseStr;
                if (isLamiaOrMermaid) {
                    const tailWord = /mermaid|fish/.test(dnaLow) ? "long shimmering fish tail" : "long thick coiled snake tail";
                    s = s.replace(/1girl/g, "1girl, monster girl, lamia")
                         .replace(/M-legs spread wide|in M-legs posture|holding ankles in M-legs|legs spread wide in M-legs holding ankles/gi, `coiling ${tailWord} wide open, exposing monster reproductive slit between glistening scales`)
                         .replace(/wrapping legs around waist|holding girl's legs wide open/gi, `coiling ${tailWord} tightly around male's waist in mating embrace`)
                         .replace(/pressing against her thighs|rubbing thighs together/gi, `pressing against her smooth scaled lower body`)
                         .replace(/stepping on and rubbing huge erect penis with stockings-clad feet, toes curled/gi, `coiling slender snake tail tip around huge erect penis, rubbing shaft with smooth glistening scales`);
                } else if (isArachneOrInsect) {
                    s = s.replace(/1girl/g, "1girl, monster girl, arachne")
                         .replace(/M-legs spread wide|in M-legs posture|wrapping legs around waist/gi, "spreading multiple chitinous arthropod spider legs wide open, monster breeding posture");
                } else if (isPlantAlraune) {
                    s = s.replace(/1girl/g, "1girl, monster girl, alraune, plant girl")
                         .replace(/M-legs spread wide|in M-legs posture|wrapping legs around waist/gi, "spreading giant blooming flower petals and writhing green vine tendrils wide open, exposing floral nectar core");
                } else if (isTentacleLower || isEldritchNonHuman) {
                    s = s.replace(/1girl/g, subjectTag)
                         .replace(/M-legs spread wide|in M-legs posture|wrapping legs around waist/gi, "spreading writhing fleshy tentacles and suction cups wide open, wrapping tentacles around male");
                }
                return s;
            };

            const hasLongMonsterTongue = /extremely long red tongue/.test(dnaLow);
            const hasSharpFangs = /sharp fangs|sharp teeth/.test(dnaLow);
            const tongueTypeTag = hasForkedTongue ? "long forked snake tongue" : (hasLongMonsterTongue ? "extremely long monster red tongue" : "long pink tongue") + (hasSharpFangs ? ", sharp fangs, rows of sharp teeth" : "");

            const holePresets = {
                "骚口实况": {
                    dna: skinOnlyDna,
                    neg: "2.4::full body, upper body, eyes, forehead, eyebrows, hair, twintails, breasts, chest, shoulders, torso, lower body, legs, wide shot, portrait::",
                    tags: [
                        `extreme macro close-up of mouth, lips, tongue and chin only, cropped lower face below nose filling the entire frame, no eyes visible, parted glossy pink lips, ${tongueTypeTag} tip, clear saliva string${mouthSexBoost}`,
                        `extreme macro close-up of open mouth and wet tongue only, cropped lower face below nose filling the entire frame, no eyes visible, swollen red lips, protruding ${tongueTypeTag}, ${hasMouthCumNow ? "white cum on tongue" : "glistening clear saliva strings"}${mouthSexBoost}`,
                        `extreme macro close-up of wide open mouth and throat interior only, cropped lower face below nose filling the frame, no eyes visible, deep throat internal view, flattened ${tongueTypeTag}, visible uvula, ${hasMouthCumNow ? "frothy cum in throat" : "wet glossy throat mucosa and saliva"}${mouthSexBoost}`,
                        `extreme macro close-up of gaping mouth and ${tongueTypeTag} only, cropped lower face below nose filling the frame, no eyes visible, everted swollen lips, wet tongue hanging out, ${hasMouthCumNow ? "thick cum overflowing" : "profuse drooling saliva strings"}${mouthSexBoost}`,
                        `extreme macro close-up of dislocated gaping jaw and mouth only, cropped lower face below nose filling the frame, no eyes visible, swollen everted lips, ${tongueTypeTag} hanging out, messy saliva${hasMouthCumNow ? " and cum strings" : ""}${mouthSexBoost}`,
                        `extreme macro close-up of ruined gaping oral hole and throat only, cropped lower face below nose filling the frame, no eyes visible, dilated throat opening, overflowing thick white cum and foam${mouthSexBoost}`
                    ]
                },
                "胸部实况": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: sanitizeNegByBtnDesc(`${STRICT_HEADLESS_NEG}${bodyProf.negBreast}full body, lower body, abdomen, hips, legs, pussy, wide shot, zoomed out`),
                    tags: [
                        `extreme macro close-up of chest and breasts only, cropped headless chest filling the entire frame, out of frame head, ${skinOnlyDna}, ${bodyProf.breastByStage[0]}`,
                        `extreme macro close-up of nipples and chest only, cropped headless chest filling the entire frame, out of frame head, ${skinOnlyDna}, ${bodyProf.breastByStage[1]}, wet sweat sheen`,
                        `extreme macro close-up of chest and breasts only, cropped headless chest filling the entire frame, out of frame head, ${skinOnlyDna}, ${bodyProf.breastByStage[2]}, ${hasMilkNow ? "milk droplets leaking" : "glistening wet skin"}`,
                        `extreme macro close-up of lactating chest only, cropped headless chest filling the entire frame, out of frame head, ${skinOnlyDna}, ${bodyProf.breastByStage[3]}`,
                        `extreme macro close-up of lactating breasts only, cropped headless chest filling the entire frame, out of frame head, ${skinOnlyDna}, ${bodyProf.breastByStage[4]}`,
                        `extreme macro close-up of corrupted lactating breasts only, cropped headless chest filling the entire frame, out of frame head, ${skinOnlyDna}, ${bodyProf.breastByStage[5]}`
                    ]
                },
                "小穴实况": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: sanitizeNegByBtnDesc(`${STRICT_HEADLESS_NEG}full body, upper body, breasts, chest, abdomen, feet, shoes, wide shot, zoomed out, ${monsterLegNegBoost}`),
                    tags: [
                        `extreme macro close-up of pussy vulva only, crotch filling the entire frame, no torso, headless, ${skinOnlyDna}, tight closed pink labia, virgin slit`,
                        `extreme macro close-up of pussy vulva only, crotch filling the entire frame, no torso, headless, ${skinOnlyDna}, slightly parted red swollen labia, clear vaginal fluids, wet string${vagSexBoost}`,
                        `extreme macro close-up of pussy vulva only, crotch filling the entire frame, no torso, headless, ${skinOnlyDna}, dark purple swollen everted labia minora, ${hasVagCumNow ? "thick white cum leaking" : "glistening clear love juice dripping"}${vagSexBoost}`,
                        `extreme macro close-up of gaping pussy hole only, crotch filling the entire frame, no torso, headless, ${skinOnlyDna}, relaxed open vaginal hole, visible red interior folds, ${hasVagCumNow ? "overflowing cum" : "wet gaping vaginal interior"}${vagSexBoost}`,
                        `extreme macro close-up of ruined gaping pussy only, crotch filling the entire frame, no torso, headless, ${skinOnlyDna}, prolapsed vaginal folds, everted labia, heavy cum overflow${vagSexBoost}`,
                        `extreme macro close-up of corrupted gaping pussy hole only, crotch filling the entire frame, no torso, headless, ${skinOnlyDna}, permanently open vaginal hole, visible prolapsed cervix at entrance, bubbling cum${vagSexBoost}`
                    ]
                },
                "子宫实况": {
                    dna: "anatomical medical cutaway illustration",
                    neg: `${STRICT_HEADLESS_NEG}1girl, girl, woman, human body, full body, upper body, breasts, limbs, arms, legs, thighs, butt, clothes, skirt, wide shot, exterior view`,
                    tags: [
                        "extreme macro internal anatomical cross-section of womb and cervix only, medical cutaway diagram filling the entire frame, no exterior body, tight closed cervix, clean pink uterine cavity",
                        `extreme macro internal anatomical cross-section of womb and cervix only, medical cutaway diagram filling the entire frame, no exterior body, red swollen cervix, ${hasVagCumNow ? "white cum splashing against cervical os" : "twitching slightly open cervical os"}${wombSexBoost}`,
                        `extreme macro internal anatomical cross-section of womb only, medical cutaway diagram filling the entire frame, no exterior body, dilated open cervix, ${hasVagCumNow ? "thick white semen pouring into uterine cavity" : "swollen hyper-sensitive uterine cavity"}${wombSexBoost}`,
                        `extreme macro internal anatomical cross-section of distended womb only, medical cutaway diagram filling the entire frame, no exterior body, uterus filled to the brim with thick white cum${wombSexBoost}`,
                        `extreme macro internal anatomical cross-section of uterine prolapse only, medical cutaway diagram filling the entire frame, no exterior body, swollen purple-red cervix dropping down, gaping cervical mouth sucking cum${wombSexBoost}`,
                        `extreme macro internal anatomical cross-section of severe cervical prolapse only, medical cutaway diagram filling the entire frame, no exterior body, bruised swollen cervix hanging out, womb overflowing with bubbling cum${wombSexBoost}`
                    ]
                },
                "阴蒂尿道": {
                    dna: skinOnlyDna,
                    neg: `${STRICT_HEADLESS_NEG}full body, upper body, breasts, torso, legs, feet, wide shot, zoomed out, ${monsterLegNegBoost}`,
                    tags: [
                        `extreme macro close-up of clitoris and urethral opening only, micro crotch focus filling the entire frame, headless, ${skinOnlyDna}, small hooded pink clit, tight closed urethra`,
                        `extreme macro close-up of clitoris only, micro crotch focus filling the entire frame, headless, ${skinOnlyDna}, swollen erect red clitoris peeking out of hood, glistening wet skin`,
                        `extreme macro close-up of enlarged clitoris only, micro crotch focus filling the entire frame, headless, ${skinOnlyDna}, hyperthrobbing red clit, trembling urethral meatus`,
                        `extreme macro close-up of clitoris and dilated urethra only, micro crotch focus filling the entire frame, headless, ${skinOnlyDna}, gaping urethral hole squirting yellow urine stream and clear fluids`,
                        `extreme macro close-up of clitoris hypertrophy and gaping urethra only, micro crotch focus filling the entire frame, headless, ${skinOnlyDna}, dickgirl-like swollen clit, gushing female ejaculation and pee fountain`,
                        `extreme macro close-up of ruined gaping urethral hole and giant clitoris only, micro crotch focus filling the entire frame, headless, ${skinOnlyDna}, permanently open urethra leaking yellow urine and white foam`
                    ]
                },
                "屁眼实况": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: `${STRICT_HEADLESS_NEG}full body, upper body, breasts, torso, feet, wide shot, zoomed out, ${monsterLegNegBoost}`,
                    tags: [
                        `extreme macro close-up of anus and ass cheeks from behind only, rear butt focus filling the entire frame, headless, ${skinOnlyDna}, tight closed pink anal pucker`,
                        `extreme macro close-up of anus from behind only, rear butt focus filling the entire frame, headless, ${skinOnlyDna}, swollen red anal ring, red spank marks, wet lube`,
                        `extreme macro close-up of relaxed anus from behind only, rear butt focus filling the entire frame, headless, ${skinOnlyDna}, smoothed out anal folds, ${hasAnalCumNow ? "white cum leaking from slightly open asshole" : "slightly open glossy anal ring"}`,
                        `extreme macro close-up of gaping anus from behind only, rear butt focus filling the entire frame, no torso, headless, ${skinOnlyDna}, wide open anal hole, visible red rectum interior, ${hasAnalCumNow ? "overflowing cum" : "wet glistening rectal mucosa"}`,
                        `extreme macro close-up of anal prolapse from behind only, rear butt focus filling the entire frame, headless, ${skinOnlyDna}, everted red rectal mucosa rosebud ring, dripping thick cum`,
                        `extreme macro close-up of severe anal prolapse from behind only, rear butt focus filling the entire frame, headless, ${skinOnlyDna}, protruding red rectal tube hanging out, overflowing frothy cum`
                    ]
                }
            };

            if (holePresets[key]) {
                const cfg = holePresets[key];
                const tag = sanitizeTemplateByBtnDesc(cfg.tags[idx]);
                const cleanDna = sanitizeTemplateByBtnDesc(cfg.dna);
                return `第${idx + 1}阶段：${key}_${curStageIdx}（${stgTag}）\n${IMG_OPEN}\n[纯局部微距特写_${item.cleanTitle || key}]\n${THINK_OPEN}\nStrictly draw according to button description: ${rawBtnVisualSummary}. ONLY draw the extreme macro close-up of ${key}. DO NOT draw full body, head, face, hair, or limbs.\n${THINK_CLOSE}\n${HASH_PREFIX}Scene:NSFW, NO FULL BODY, headless, extreme macro close-up, ${cleanDna}${liveExtra}, 2.0::${tag}${paraTag}, filling the entire frame, macro photography::;\nChar1 UC:2.2::${cfg.neg}, multiple views, zoomed out, text, watermark, ${anatomyNegWord}::;${HASH_SUFFIX}\n${IMG_CLOSE}`;
            }

            const cnWearToEnTags = (cnStr, fallbackEn) => {
                const s = safeStr(cnStr).trim();
                if (!s) return fallbackEn;
                if (/^[a-zA-Z0-9,\s_-]+$/.test(s)) return s;
                const rules = [
                    [/发丝整洁|发饰端庄|妆容整洁|神色清澈/, "neat hair ribbon, elegant hair ornament, clean bangs"],
                    [/蝴蝶结|发带|缎带/, "hair ribbon, hair bow"],
                    [/发簪|步摇|古风发饰/, "traditional hairstick, ornate hairpin"],
                    [/发卡|发夹/, "hairclip, cute hair ornament"],
                    [/头纱|修女/, "nun veil, habit headdress"],
                    [/巫女/, "miko headdress, red hair ribbon"],
                    [/女仆|蕾丝头带/, "maid headdress, white lace headband"],
                    [/兔耳发箍|兔耳/, "fake bunny ears headband"],
                    [/猫耳发箍|猫耳/, "fake cat ears headband"],
                    [/皇冠|王冠|冕/, "tiara, small crown"],
                    [/红框圆眼镜|红框眼镜/, "red-framed round glasses, eyewear"],
                    [/眼镜|镜框/, "glasses, eyewear"],
                    [/眼罩|蒙眼/, "blindfold, black eye mask"],
                    [/开口环|口球|流涎/, "ring gag, ball gag, drooling saliva"],
                    [/耳标|母猪耳标/, "livestock plastic ear tag on ear"],
                    [/汗湿|黏颊|发乱如麻|凌乱/, "sweaty messy hair strands sticking to flushed cheeks"],
                    [/雪颈白皙|衣领齐整|衣领端正/, "clean fair slender neck, neat modest collar, defined collarbone"],
                    [/锁骨裸露|香肩/, "exposed delicate collarbone, bare shoulders"],
                    [/领结|领带/, "disheveled neck ribbon, school tie"],
                    [/蕾丝颈链|choker|颈带/, "black lace choker on neck"],
                    [/项链|吊坠|珍珠/, "delicate necklace pendant resting on collarbone"],
                    [/铃铛项圈|铜铃/, "collar with golden bell on neck"],
                    [/皮革锁链项圈|锁链项圈|铭牌|项圈/, "thick leather bondage collar with metal chain leash and inscribed metal tag"],
                    [/电击项圈/, "glowing electric shock collar on neck"],
                    [/吻痕|吮痕|咬痕|红痕/, "heavy red hickeys, love bites and teeth marks on neck and collarbone"],
                    [/贴身丝质内衬|包裹完好|穿戴整齐/, "white silk camisole innerwear and modest lace bra, neatly covered chest"],
                    [/蕾丝胸罩|蕾丝文胸|黑色胸罩/, "black lace bra, detailed bra cups"],
                    [/纯白胸罩|白色文胸|白色内衬/, "pure white cotton bra, innocent innerwear"],
                    [/粉色胸罩|粉色文胸/, "pink ribbon lace bra"],
                    [/运动内衣|裹胸|抹胸|运动小背心/, "tight sports bra, cropped tank top"],
                    [/肚兜/, "traditional silk dudou innerwear"],
                    [/比基尼|泳衣|死库水/, "school swimsuit, sukumizu"],
                    [/胸罩被暴力推至|推至乳肉上方|双峰弹露/, "displaced bra pushed up above breasts, exposed nipples popping out"],
                    [/开洞胸罩|镂空胸罩/, "cupless open-nipple bondage bra"],
                    [/真空未穿胸衣|未穿胸衣|乳尖凸起/, "no bra under thin translucent fabric, erect nipples clearly poking through"],
                    [/全裸爆乳|赤裸胸口/, "completely topless, unclad bare breasts"],
                    [/铃铛乳环|乳环|乳钉/, "silver nipple rings with tiny dangling bells piercing erect nipples"],
                    [/乳夹|乳头夹/, "metal nipple clamps pinching nipples"],
                    [/吸盘触手.*吸住双乳|榨奶/, "tentacle suction cups latched onto nipples milking breasts"],
                    [/外衫整洁|束腰合度|外衫洁净/, "neat fitted outer blouse, tailored corset waist belt, clean sleeves"],
                    [/水手服|JK|校服/, "pleated sailor uniform top, navy collar with white stripes"],
                    [/纽扣崩飞.*白衬衫|湿透白衬衫|白衬衫|衬衫/, "sweat-soaked translucent white dress shirt, popped buttons, open shirt front"],
                    [/半透明蕾丝薄纱吊带睡裙|薄纱|睡裙/, "see-through sheer lace strap nightgown dress, translucent negligee"],
                    [/哥特|黑蕾丝|洛丽塔|蓬蓬裙/, "gothic lolita black lace frilly dress with ribbons"],
                    [/卫衣|连帽衫/, "oversized hoodie top"],
                    [/毛衣|针织衫|开背毛衣/, "ribbed knit sweater"],
                    [/T恤|短袖|背心/, "tight fitted t-shirt top"],
                    [/女仆装/, "frilly maid apron blouse"],
                    [/修女服/, "dark nun habit robe top"],
                    [/巫女服/, "white kosode miko robe top"],
                    [/旗袍/, "silk cheongsam qipao top with cutout"],
                    [/汉服|古装|长袍|仙裙/, "flowing traditional hanfu outer robe with wide sleeves and waist sash"],
                    [/花瓣衣|藤蔓缠绕|树叶遮蔽/, "living flower petals and green vines wrapping body as natural clothing"],
                    [/赤裸上身|无上衣/, "topless torso, bare upper body skin, no shirt"],
                    [/史莱姆粘液包裹躯干/, "translucent glowing pink slime coating bare torso like liquid clothes"],
                    [/干净纯白底裤|纯白底裤|严密遮护|干净底裤/, "clean pure white cotton panties tightly covering crotch, modest fit"],
                    [/蕾丝内裤|黑色内裤|黑蕾丝底裤/, "black lace panties"],
                    [/粉色内裤|草莓胖次|条纹胖次/, "cute pink striped panties with small bow"],
                    [/丁字裤|半透明.*丁字裤|系带内裤/, "soaked translucent lace micro thong, g-string panties"],
                    [/被扯到一边|湿烂底裤/, "soaked panties pulled aside exposing wet vulva slit"],
                    [/开裆内裤|镂空内裤/, "crotchless lace panties exposing labia"],
                    [/贞操带/, "locked leather and metal chastity belt frame with crotchless opening"],
                    [/真空|未穿内裤|无内裤|连内裤都不穿|光裸/, "no panties, bottomless exposed bare crotch"],
                    [/产卵触手堵死/, "thick living ovipositor tentacles plugging pussy and anus"],
                    [/裙摆垂顺|端庄得体/, "neat pleated skirt hem hanging gracefully over hips"],
                    [/百褶短裙|百褶裙|短裙|超短裙/, "mini pleated skirt, microskirt"],
                    [/长裙|连衣裙摆|纱裙/, "flowing long skirt hem"],
                    [/蓬蓬裙|蛋糕裙/, "layered frilly petticoat skirt"],
                    [/包臀裙|一步裙|铅笔裙/, "tight pencil skirt hugging hips"],
                    [/睡裙下摆掀起|掀起至腰际|撩起/, "skirt hem lifted up to waist exposing hips and underwear"],
                    [/牛仔短裤|热裤|短裤/, "tight denim micro shorts"],
                    [/运动短裤|体操服|ブルマ/, "tight athletic bloomers shorts"],
                    [/长裤|牛仔裤|紧身裤|瑜伽裤/, "tight fitted pants hugging hips"],
                    [/无下装|毫无遮挡/, "bottomless lower waist, no skirt, no pants, bare butt cheeks"],
                    [/巴掌印/, "bright red handprint spank marks on bare ass cheeks"],
                    [/修长素腿|并拢端正|素腿|裸腿/, "bare smooth slender legs pressed neatly together, no stockings"],
                    [/白色吊带长筒袜|白丝|过膝白丝|洁白及膝袜|及膝袜/, "white kneehigh stockings, white thighhighs"],
                    [/撕开大洞的连裤黑丝|破洞黑丝/, "torn sheer black pantyhose with large ripped holes exposing thigh skin"],
                    [/黑丝|连裤黑丝|黑长袜/, "sheer black thighhigh stockings, black pantyhose"],
                    [/肉丝|肤色丝袜/, "nude sheer pantyhose"],
                    [/网袜|渔网袜/, "black fishnet stockings"],
                    [/条纹袜|长筒袜|泡泡袜/, "knee-high socks"],
                    [/腿环|绑腿带/, "pink leather thigh garter strap digging into soft thigh flesh"],
                    [/M字大开|粘液藤蔓.*固定/, "legs spread wide in M-shape bound by slimy vines"],
                    [/精致鞋履|步履平稳|皮鞋/, "classic Mary Jane dress shoes, neat ankles"],
                    [/只剩一只皮鞋/, "one Mary Jane shoe dangling off toes, one bare foot"],
                    [/高跟鞋|细高跟/, "glossy stiletto high heels"],
                    [/马丁靴|短靴|皮靴|长靴/, "laced leather ankle boots"],
                    [/运动鞋|球鞋|帆布鞋/, "clean casual sneakers"],
                    [/凉鞋|拖鞋/, "strappy sandals exposing toes"],
                    [/赤足|裸足|脚趾微蜷|赤足跪爬|赤着双腿|光着.*脚/, "barefoot, delicate bare feet, cute pink soles and curled toes"],
                    [/脚踝被触手悬空吊起/, "bare ankles bound and suspended in air by slimy tentacles"],
                    [/正字涂鸦/, "black tally marks body writing on skin"]
                ];
                const matched = [];
                rules.forEach(([reg, en]) => { if (reg.test(s)) matched.push(en); });
                return matched.length ? matched.join(", ") : fallbackEn;
            };

            // 直接同时读取穿搭签名与当前按钮自己的描述来转译服饰 Tag！
            const wearHeadTxt = cnWearToEnTags(`${getWearStyleSignature("穿搭_头饰", curVars)} ${key === "穿搭_头饰" ? btnSpecificDesc : ""}`, "neat hair ornament, clean bangs");
            const wearNeckTxt = cnWearToEnTags(`${getWearStyleSignature("穿搭_颈部", curVars)} ${key === "穿搭_颈部" ? btnSpecificDesc : ""}`, "clean fair slender neck, neat collar, delicate collarbone");
            const wearBraTxt  = cnWearToEnTags(`${getWearStyleSignature("穿搭_胸罩", curVars)} ${key === "穿搭_胸罩" ? btnSpecificDesc : ""}`, "white silk innerwear camisole, modest lace bra");
            const wearTopTxt  = cnWearToEnTags(`${getWearStyleSignature("穿搭_上衣", curVars)} ${key === "穿搭_上衣" ? btnSpecificDesc : ""}`, "neat fitted outer blouse shirt, tailored waist belt, sleeves");
            const wearPanTxt  = cnWearToEnTags(`${getWearStyleSignature("穿搭_内裤", curVars)} ${key === "穿搭_内裤" ? btnSpecificDesc : ""}`, "clean pure white cotton panties covering crotch");
            const wearBotTxt  = cnWearToEnTags(`${getWearStyleSignature("穿搭_下装", curVars)} ${key === "穿搭_下装" ? btnSpecificDesc : ""}`, "neat pleated skirt hem");
            const wearSocTxt  = cnWearToEnTags(`${getWearStyleSignature("穿搭_丝袜", curVars)} ${key === "穿搭_丝袜" ? btnSpecificDesc : ""}`, "bare smooth slender legs together");
            const wearShoTxt  = cnWearToEnTags(`${getWearStyleSignature("穿搭_鞋子", curVars)} ${key === "穿搭_鞋子" ? btnSpecificDesc : ""}`, "classic Mary Jane shoes");

            const hasSpermInWomb = (safeNum(sp.子宫毫升) > 0 || safeNum(curVars.计数?.射精?.内射) > 0);
            const cumOnLegsTag = (idx >= 3 || (idx >= 2 && lowerCumMl >= 30)) ? ", thick white cum dripping down inner thighs" : (idx >= 1 ? ", glistening sweat sheen" : ", clean smooth surface");
            const cumOnShoesTag = (idx >= 3 || (idx >= 2 && lowerCumMl >= 40)) ? ", white cum droplets dripping onto instep and toes" : (idx >= 1 ? ", toes curling slightly" : ", clean neat posture");
            const neckStageTag = idx >= 3 ? ", heavy red hickeys, bite marks and saliva on neck, collar" : (idx >= 1 ? ", light blush and faint kiss mark on collarbone" : ", clean fair neck and neat collar");

            let adaptiveBotTag = `extreme close-up of waist, hips, butt and skirt/pants from behind only, rear-side view cropped from lower waist to mid-thigh filling the frame, headless, no upper torso, no head, ${bodyProf.bodyTag}, (${wearBotTxt}), ${idx >= 2 ? "lifted or disheveled hem exposing plump ass cheeks and wet upper thighs" : "neat lower garment hem covering hips gracefully"}`;
            let adaptiveSockTag = `extreme close-up of thighs, knees and calves only, cropped lower legs shot from mid-thigh to ankle filling the frame, headless, no torso, no head, ${bodyProf.bodyTag}, (${wearSocTxt})${cumOnLegsTag}`;
            let adaptiveShoeTag = `extreme macro ground-level close-up of feet, ankles and footwear only, low angle foot focus filling the entire frame, headless, no torso, no hips, (${wearShoTxt})${cumOnShoesTag}`;
            let adaptiveSemenBellyTag = `extreme close-up of lower belly, pelvis and groin only, headless cropped lower abdomen focus, ${skinOnlyDna}, ${bodyProf.bodyTag}, ${idx === 0 && totalMl === 0 ? "clean dry skin on flat lower abdomen and groin, no semen" : "lower belly and groin covered in thick white semen, cum overflowing from gaping pussy"}`;

            if (isLamiaOrMermaid) {
                const tailType = /mermaid|fish/.test(dnaLow) ? "shimmering fish tail scales and aquatic waist transition" : "coiled glistening snake tail scales and human-to-snake waist transition";
                adaptiveBotTag = `extreme close-up of pelvis, hips and ${tailType} only, headless monster girl lower waist focus (${wearBotTxt}), no human legs${cumOnLegsTag}`;
                adaptiveSockTag = `extreme close-up of long thick coiled snake tail body and smooth ventral scales only, filling the frame, headless, no human legs, glistening serpentine scales${cumOnLegsTag}`;
                adaptiveShoeTag = `extreme macro close-up of slender coiled snake tail tip twitching only, tail tip focus filling the frame, headless, no human feet${cumOnShoesTag}`;
            } else if (isArachneOrInsect) {
                adaptiveBotTag = `extreme close-up of waist transition to giant glossy arachne spider abdomen and chitinous hip joints only, headless monster girl lower torso${cumOnLegsTag}`;
                adaptiveSockTag = `extreme close-up of multiple glossy chitinous spider arthropod legs and exoskeleton joints only, headless monster girl limbs${cumOnLegsTag}`;
                adaptiveShoeTag = `extreme macro close-up of sharp chitinous arthropod tarsus claw tips on ground only, headless, no human feet${cumOnShoesTag}`;
            } else if (isPlantAlraune) {
                adaptiveBotTag = `extreme close-up of waist nestled in giant blooming flower petals and writhing green vine tendrils only, headless plant monster girl lower torso${cumOnLegsTag}`;
                adaptiveSockTag = `extreme close-up of thighs wrapped in writhing green vine tendrils and blooming flower petals dripping floral nectar only, headless${cumOnLegsTag}`;
                adaptiveShoeTag = `extreme macro close-up of feet and ankles entwined by green vine tendrils and flower petals only, headless${cumOnShoesTag}`;
            } else if (isTentacleLower || isEldritchNonHuman) {
                adaptiveBotTag = `extreme close-up of lower torso merging into writhing fleshy tentacles and suction cups base only, headless eldritch monster lower body${cumOnLegsTag}`;
                adaptiveSockTag = `extreme close-up of thick writhing tentacles coiled together with glistening suction cups and mucus only, headless, no human legs${cumOnLegsTag}`;
                adaptiveShoeTag = `extreme macro close-up of curling tentacle tips dripping viscous slime only, headless, no human feet${cumOnShoesTag}`;
            } else if (isSlimeMorph) {
                adaptiveSockTag = `extreme close-up of translucent gelatinous slime thighs and melting liquid legs only, headless (${wearSocTxt})${cumOnLegsTag}`;
                adaptiveShoeTag = `extreme macro close-up of semi-transparent melting slime feet and puddle base only, headless (${wearShoTxt})${cumOnShoesTag}`;
            }

            const rawGrafTxt = `${safeStr(curVars.痕迹与标记?.体表痕迹)} ${safeStr(curVars.痕迹与标记?.公开涂鸦字迹)} ${btnSpecificDesc}`;
            let graffitiTargetArea = "lower abdomen and inner thighs";
            if (/双乳|胸/.test(rawGrafTxt) && !/小腹/.test(rawGrafTxt)) graffitiTargetArea = `chest and ${bodyProf.breastByStage[0]}`;
            else if (/臀/.test(rawGrafTxt) && !/小腹/.test(rawGrafTxt)) graffitiTargetArea = "plump ass cheeks from behind";

            const partCloseupPresets = {
                "穿搭_头饰": {
                    dna: headOnlyDna,
                    neg: "2.2::full body, upper body, breasts, cleavage, chest, shoulders, collarbone, torso, waist, lower body, legs, feet, wide shot, cowboy shot::",
                    tag: `extreme close-up of upper head, hair and face above chin only, angled top-front headshot focusing on hair and headdress filling the entire frame, no neck, no shoulders, no chest, ${headOnlyDna}, 1.6::(${wearHeadTxt})::, ${faceExpr}`
                },
                "穿搭_颈部": {
                    dna: skinOnlyDna,
                    neg: "2.4::full body, eyes, forehead, top of head, hair crown, breasts, nipples, lower torso, waist, lower body, legs, feet, wide shot::",
                    tag: `extreme macro close-up of slender neck, throat, jawline and collarbone only, cropped from chin to upper collarbone filling the frame, no eyes, no breasts, ${skinOnlyDna}, 1.6::(${wearNeckTxt})::${neckStageTag}`
                },
                "穿搭_胸罩": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: sanitizeNegByBtnDesc(`${STRICT_HEADLESS_NEG}${bodyProf.negBreast}2.2::outer coat, jacket, long sleeves, skirt, pants, full body, lower body, legs, feet, wide shot::`),
                    tag: `extreme macro close-up of intimate innerwear bra and chest only, headless cropped front chest focus from below collarbone to underbust filling the frame, outer shirt pulled open or absent to reveal innerwear, ${skinOnlyDna}, ${bodyProf.braFocusTag}, ${bodyProf.breastByStage[Math.min(2, idx)]}, 1.7::(${wearBraTxt})::, ${idx >= 2 ? "nipples poking through or exposed from displaced bra, wet sweat and love juice stains" : "intimate innerwear fabric texture, clean bra fit"}`
                },
                "穿搭_上衣": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: sanitizeNegByBtnDesc(`${STRICT_HEADLESS_NEG}${bodyProf.negBreast}2.2::full body, lower body, legs, knees, feet, shoes, wide shot::`),
                    tag: `cropped medium close-up of upper torso outerwear garment, sleeves and waist only, headless torso shot cropped from base of neck to waist belt filling the frame, showcasing outer clothing design, ${skinOnlyDna}, ${bodyProf.bodyTag}, ${bodyProf.breastByStage[0]}, 1.7::(${wearTopTxt})::, ${dmgTag}${idx >= 2 ? "disheveled sweat-soaked outer garment clinging to torso" : "neat well-fitted outer top garment and waist silhouette"}`
                },
                "穿搭_内裤": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: `${STRICT_HEADLESS_NEG}${monsterLegNegBoost}2.2::full body, upper body, breasts, chest, knees, calves, feet, shoes, wide shot::`,
                    tag: `extreme macro close-up of pelvis, groin mound and underwear crotch only, front-low angle crotch focus cropped from lower navel to upper inner thighs filling the frame, headless, ${skinOnlyDna}, ${bodyProf.bodyTag}, 1.7::(${wearPanTxt})::, ${idx >= 2 ? "soaked wet crotch stain, panties pulled aside, leaking glistening strings" : "tight underwear fabric covering mons pubis, subtle cameltoe crease, clean dry fabric"}`
                },
                "穿搭_下装": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: `${STRICT_HEADLESS_NEG}${monsterLegNegBoost}2.4::full body, upper body, breasts, chest, shoulders, calves, feet, shoes, wide shot::`,
                    tag: adaptiveBotTag
                },
                "穿搭_丝袜": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: `${STRICT_HEADLESS_NEG}${monsterLegNegBoost}2.4::full body, upper body, breasts, chest, waist, abdomen, wide shot::`,
                    tag: adaptiveSockTag
                },
                "穿搭_鞋子": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: `${STRICT_HEADLESS_NEG}${monsterLegNegBoost}2.4::full body, upper body, breasts, chest, torso, waist, hips, butt, crotch, wide shot::`,
                    tag: adaptiveShoeTag
                },
                "正字涂鸦": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: sanitizeNegByBtnDesc(`${STRICT_HEADLESS_NEG}${bodyProf.negBreast}full body, feet, shoes, wide shot`),
                    tag: `extreme macro close-up of ${graffitiTargetArea} skin only, headless cropped skin focus filling the frame, ${skinOnlyDna}, ${bodyProf.bodyTag}, ${idx === 0 ? "clean smooth unblemished skin, no writing, no marks" : "black marker tally marks (正) and lewd body writing calligraphy written on flushed skin, red slap handprints"}`
                },
                "淫纹烙印": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: `${STRICT_HEADLESS_NEG}full body, breasts, legs, feet, wide shot`,
                    tag: `extreme macro close-up of lower abdomen and navel only, headless cropped belly focus filling the frame, ${skinOnlyDna}, ${bodyProf.bodyTag}, ${idx === 0 ? "clean flat lower abdomen skin below navel, no tattoo" : "glowing purple-pink heart-shaped succubus womb tattoo on lower belly below navel"}`
                },
                "穿刺环饰": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: sanitizeNegByBtnDesc(`${STRICT_HEADLESS_NEG}${bodyProf.negBreast}full body, legs, feet, wide shot`),
                    tag: `extreme macro close-up of nipples and labia only, headless macro focus filling the frame, ${skinOnlyDna}, ${bodyProf.breastByStage[Math.min(1, idx)]}, ${idx === 0 ? "clean natural unpierced pink nipples, no metal rings" : "pierced nipples and pierced labia with silver rings, tiny bells and delicate metal chains glinting on wet flushed skin"}`
                },
                "体内道具": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: `${STRICT_HEADLESS_NEG}${monsterLegNegBoost}full body, upper body, breasts, feet, wide shot`,
                    tag: `extreme macro close-up of crotch and pussy entrance only, headless crotch focus filling the frame, ${skinOnlyDna}, ${idx === 0 ? "clean closed virgin slit, no toys" : "pink wireless vibrator egg cord and glossy dildo base protruding from dripping wet gaping pussy"}`
                },
                "排卵周期": {
                    dna: "anatomical medical cross-section diagram",
                    neg: `${STRICT_HEADLESS_NEG}1girl, girl, woman, human body, full body, breasts, torso, limbs, legs, thighs, clothes, exterior body, wide shot`,
                    tag: `extreme macro internal anatomical cross-section cutaway of ovaries and fallopian tubes only, medical organ diagram filling the entire frame, no exterior body, ${idx === 0 ? "resting pink ovary in safe period, clean fallopian tube" : (hasSpermInWomb ? "glowing pink mature ovum surrounded by dense white sperm" : "swollen hyper-ovulating ovary releasing multiple glowing pink ova into fallopian tube")}`
                },
                "受精断面": {
                    dna: "anatomical medical cross-section diagram",
                    neg: `${STRICT_HEADLESS_NEG}1girl, girl, woman, human body, full body, breasts, torso, limbs, legs, thighs, clothes, exterior body, wide shot`,
                    tag: `extreme macro internal anatomical cross-section cutaway of womb cavity and ovum only, medical organ diagram filling the entire frame, no exterior body, ${(idx === 0 || !hasSpermInWomb) ? "clean pure uterine cavity with a single glowing unfertilized ovum floating peacefully, no sperm" : "thick white cum filling uterine cavity, dense swarm of sperm penetrating glowing fertilized ovum"}`
                },
                "精液归属": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: `${STRICT_HEADLESS_NEG}${monsterLegNegBoost}full body, breasts, feet, wide shot`,
                    tag: adaptiveSemenBellyTag
                },
                "孕肚进度": {
                    dna: `${skinOnlyDna}, ${bodyProf.bodyTag}`,
                    neg: `${STRICT_HEADLESS_NEG}${monsterLegNegBoost}full body, breasts, feet, shoes, wide shot`,
                    tag: `extreme close-up of lower abdomen only, headless cropped belly filling the frame, ${skinOnlyDna}, ${bodyProf.bodyTag}, ${idx === 0 ? "flat toned slender waist and smooth lower abdomen" : (idx >= 4 ? "hands cradling heavily distended round belly, translucent belly skin showing cum and movement inside" : "hands cradling slightly swollen round cum-filled lower belly")}`
                }
            };

            if (partCloseupPresets[key]) {
                const pCfg = partCloseupPresets[key];
                const isHeadPart = (key === "穿搭_头饰");
                const cleanPartTag = sanitizeTemplateByBtnDesc(pCfg.tag);
                return `第${idx + 1}阶段：${key}_${curStageIdx}（${stgTag}）\n${IMG_OPEN}\n[纯局部特写_${item.cleanTitle || key}]\n${THINK_OPEN}\nStrictly draw according to button description: ${rawBtnVisualSummary}. ONLY draw the tightly cropped close-up of ${key}. ${isHeadPart ? "Focus on head and hair ornament only, NO torso or chest." : "STRICTLY HEADLESS! DO NOT draw head, face, eyes, or hair!"}\n${THINK_CLOSE}\n${HASH_PREFIX}Scene:NSFW, NO FULL BODY, ${isHeadPart ? "headshot only" : "headless, out of frame head"}, extreme close-up, ${pCfg.dna}${liveExtra}, 2.0::${cleanPartTag}${paraTag}, filling the entire frame::;\nChar1 UC:2.4::${pCfg.neg}, zoomed out, multiple views, lowres, ${anatomyNegWord}text, watermark::;${HASH_SUFFIX}\n${IMG_CLOSE}`;
            }

            if (key.startsWith("client_") || item.isClient) {
                const cName = safeStr(item.clientName || item.cleanTitle || "恩客");
                let maleDna = "1boy, muscular male, faceless male, huge veined erect penis";
                if (/体育|运动|篮球|学长|男生/.test(cName)) maleDna = "1boy, tall muscular college athlete boy, basketball jersey and shorts pulled down, sweaty toned body, huge thick veined erect penis";
                else if (/大叔|中年|老板|肥|主任/.test(cName)) maleDna = "1boy, ugly bastard, middle-aged man, rough hands, huge thick dark penis";
                else if (/粉丝|死忠|群|轮奸/.test(cName)) maleDna = "multiple boys, crowd of horny male fans surrounding her, multiple erect penises";
                else if (/黄毛|混混|不良/.test(cName)) maleDna = "1boy, blonde delinquent boy, muscular, huge erect penis";

                const rawSexActByStage = [
                    "hetero, male grabbing her waist, huge erect penis pressing against her thighs and wet entrance, teasing foreplay",
                    "hetero, vaginal penetration, male holding girl's legs wide open in M-legs posture, huge penis thrusting deep into wet pussy",
                    "hetero, intense mating press, male pinning her down, deep penetration, girl wrapping legs around waist, heavy sweating",
                    "hetero, rough sex, deep cervical penetration, x-ray cutaway showing huge glans kissing prolapsed cervix, internal ejaculation creampie",
                    "hetero, extreme breeding sex, full ahegao holding ankles in M-legs, distended cum-filled belly, thick white semen overflowing from gaping pussy around shaft",
                    "hetero, mindbreak meat toilet breeding, nonstop creampie, squirting pee and cum fountain while being roughly penetrated, rolled back heart eyes, long tongue out"
                ][idx];
                const sexActByStage = adaptPoseForMonster(rawSexActByStage);

                return `第${idx + 1}阶段：${key}_${curStageIdx}（${stgTag}）\n${IMG_OPEN}\n[${u}与恩客${cName}激烈交合实况]\n${THINK_OPEN}\nStrictly draw according to button description: ${rawBtnVisualSummary}. 必须同时画出${u}与男性恩客【${cName}】正在发生激烈肉体交合！\n${THINK_CLOSE}\n${HASH_PREFIX}Scene:NSFW, explicit sex, ${subjectTag}, ${maleDna}, ${dmgTag}1.8::${sexActByStage}::, 1.5::masterpiece, best quality, ${fullCharDna}, ${faceExpr}${liveExtra}::, detailed dark background;\nChar1:1.5::${u}, ${fullCharDna}, ${sexActByStage}, ${faceExpr}${paraTag}${liveExtra}::|centers:C3;\nChar1 UC:2.0::${sanitizeNegByBtnDesc(bodyProf.negBreast)}${monsterLegNegBoost}solo, 1girl only, no male, no penis, censorship, multiple views, lowres, ${anatomyNegWord}text, watermark::;${HASH_SUFFIX}\n${IMG_CLOSE}`;
            }

            if (key.startsWith("fetish_")) {
                const fetName = key.replace("fetish_", "");
                let fetScene = `${subjectTag}, solo, ${faceExpr}, masturbation, spreading pussy`;
                let isMultiPerson = false;

                if (/挨操|受精|内射/.test(fetName)) {
                    fetScene = `${subjectTag}, 1boy, hetero, explicit vaginal sex, mating press, M-legs spread wide, huge erect penis thrusting deep inside pussy, abundant creampie overflow, distended cum belly`;
                    isMultiPerson = true;
                } else if (/深喉|吞精|口/.test(fetName)) {
                    fetScene = `${subjectTag}, 1boy, hetero, oral sex, sloppy deepthroat blowjob, kneeling and swallowing huge erect penis to the base, ${tongueTypeTag} wrapped around shaft, throat bulge, cum in mouth and overflowing`;
                    isMultiPerson = true;
                } else if (/后庭|扩菊/.test(fetName)) {
                    fetScene = `${subjectTag}, 1boy, hetero, anal sex, doggystyle from behind, huge penis penetrating gaping anus, looking back with ahegao, cum dripping from both holes`;
                    isMultiPerson = true;
                } else if (/乳交/.test(fetName)) {
                    fetScene = `${subjectTag}, 1boy, hetero, paizuri, titfuck, pressing chest around huge erect penis, licking glans with ${tongueTypeTag}, cum splashing on face and chest`;
                    isMultiPerson = true;
                } else if (/足/.test(fetName)) {
                    fetScene = `${subjectTag}, 1boy, hetero, footjob, stepping on and rubbing huge erect penis with stockings-clad feet, toes curled covered in thick white cum`;
                    isMultiPerson = true;
                } else if (/轮奸|便器|卖淫/.test(fetName)) {
                    fetScene = `${subjectTag}, multiple boys, gangbang, double penetration, spitroast, surrounded by multiple huge erect penises, oral and vaginal penetration simultaneously, covered in cum`;
                    isMultiPerson = true;
                } else if (/睡奸/.test(fetName)) {
                    fetScene = `${subjectTag}, 1boy, sleep molestation, somnophilia, unconscious sleeping body being penetrated by huge penis, overflowing creampie`;
                    isMultiPerson = true;
                } else if (/潮吹|失禁/.test(fetName)) {
                    fetScene = `${subjectTag}, ${hasActiveSexInScene ? "1boy, hetero, vaginal sex, " : "solo, "}M-legs spread wide, violent female ejaculation squirting fountain and yellow pee stream simultaneously, soaking wet`;
                    isMultiPerson = hasActiveSexInScene;
                } else if (/喷乳/.test(fetName)) {
                    fetScene = `${subjectTag}, lactation, squeezing own swollen breasts, breast milk squirting out in arcs, wet milk stains`;
                } else if (/露出/.test(fetName)) {
                    fetScene = `${subjectTag}, public indecency, outdoor alleyway near vending machine at night, exposing dripping wet gaping pussy leaking cum and urine in public`;
                }
                fetScene = adaptPoseForMonster(fetScene);

                const ucExtra = isMultiPerson ? "solo, 1girl only, " : "";
                return `第${idx + 1}阶段：${key}_${curStageIdx}（${stgTag}）\n${IMG_OPEN}\n[${u}的性癖发作特写_${fetName}]\n${THINK_OPEN}\nStrictly draw according to button description: ${rawBtnVisualSummary}\n${THINK_CLOSE}\n${HASH_PREFIX}Scene:NSFW, ${dmgTag}1.8::${fetScene}::, 1.5::masterpiece, best quality, ${fullCharDna}, ${faceExpr}${liveExtra}::;\nChar1:1.5::${u}, ${fullCharDna}, ${fetScene}, ${faceExpr}${paraTag}${liveExtra}::|centers:C3;\nChar1 UC:1.8::${sanitizeNegByBtnDesc(bodyProf.negBreast)}${monsterLegNegBoost}${ucExtra}multiple views, lowres, ${anatomyNegWord}text, watermark::;${HASH_SUFFIX}\n${IMG_CLOSE}`;
            }

            const stageBodyProgression = [
                "neat posture, clean skin, composed demeanor",
                "slightly disheveled, light sweat on skin, shy posture",
                "sweaty glistening skin, trembling body, submissive posture, wet stains",
                "heavily aroused posture, open lower body, cum stains on skin, messy hair",
                "corrupted posture, M-legs spread wide, body writing tally marks, overflowing cum, drooling",
                "completely ruined meat toilet posture, extreme ahegao, double peace sign, gaping holes leaking cum and pee"
            ][idx];

            if ((key === "当前姿势" && hasActiveSexInScene) || key === "破瓜纪念" || key === "六孔总账") {
                const poseRaw = `${safeStr(curVars.实况?.当前姿势)} ${btnSpecificDesc}`;
                let sexPoseTag = `${subjectTag}, 1boy, hetero, explicit sex, lying down with legs spread wide in M-legs holding ankles, muscular male holding huge erect penis thrusting into her gaping pussy and prolapsed cervix, distended cum-filled belly`;
                if (/深喉|口|舌/.test(poseRaw)) sexPoseTag = `${subjectTag}, 1boy, hetero, deepthroat oral sex, ${tongueTypeTag} wrapped around huge erect penis, saliva and cum overflowing`;
                else if (/跪|趴|母畜|后入/.test(poseRaw)) sexPoseTag = `${subjectTag}, 1boy, hetero, doggystyle from behind, arched back, huge erect penis penetrating dripping gaping pussy`;
                sexPoseTag = adaptPoseForMonster(sexPoseTag);

                return `第${idx + 1}阶段：${key}_${curStageIdx}（${stgTag}）\n${IMG_OPEN}\n[${u}的实时交合姿势特写]\n${THINK_OPEN}\nStrictly draw according to button description: ${rawBtnVisualSummary}\n${THINK_CLOSE}\n${HASH_PREFIX}Scene:NSFW, explicit sex, ${subjectTag}, 1boy, ${dmgTag}1.8::${sexPoseTag}::, 1.5::masterpiece, best quality, ${fullCharDna}, ${faceExpr}${liveExtra}::, dark background;\nChar1:1.5::${u}, ${fullCharDna}, ${sexPoseTag}, ${faceExpr}${paraTag}${liveExtra}::|centers:C3;\nChar1 UC:2.0::${sanitizeNegByBtnDesc(bodyProf.negBreast)}${monsterLegNegBoost}solo, 1girl only, no male, multiple views, lowres, ${anatomyNegWord}text, watermark::;${HASH_SUFFIX}\n${IMG_CLOSE}`;
            }

            const poseByStage = [
                "standing gracefully, neat elegant daily posture, legs together, composed demeanor, fully clothed",
                "standing or sitting shyly, slightly tired posture, knees pressed together, light blush",
                "sitting on floor, weak trembling legs, knees slightly apart, catching breath, sweaty skin",
                "kneeling or sprawling weakly on floor, legs spread, exhausted panting posture",
                "submissive crawling posture on all fours, arched back, M-legs spread wide, trembling",
                "completely collapsed meat cushion posture, M-legs spread wide open, extreme exhaustion"
            ][idx];
            const bellyByStage = (idx === 0 && totalMl === 0) ? "flat toned waist, slender figure" : (idx >= 3 || totalMl >= 50 ? "distended cum belly" : "slender waist");
            const currentFullOutfitTag = `${wearTopTxt}, ${wearBotTxt}, ${wearSocTxt}, ${wearShoTxt}`;

            const nonHoleMap = {
                "身份与背景": `upper body portrait, face and upper chest focus, looking at viewer, (${wearHeadTxt}, ${wearTopTxt}), ${stageBodyProgression}, ${faceExpr}`,
                "肉体外貌":   `full body shot, showcasing full morphology and body proportions, ${bellyByStage}, detailed skin, (${ idx <= 1 ? currentFullOutfitTag : wearBraTxt + ", " + wearPanTxt }), ${stageBodyProgression}, ${faceExpr}`,
                "表里风评":   `medium shot, upper body in environment, expressive demeanor, (${wearTopTxt}), ${stageBodyProgression}, ${faceExpr}`,
                "挂牌身价":   `cowboy shot, ${idx === 0 ? "standing posture, composed aura, " + currentFullOutfitTag : "seductive posture displaying body like merchandise"}, ${stageBodyProgression}, ${faceExpr}`,
                "内心独白":   `extreme macro close-up of eyes, pupils and parted lips only, tight facial expression focus filling the frame, no torso, ${faceExpr}`,
                "当前姿势":   `full body shot, solo, no male, (${currentFullOutfitTag}), ${poseByStage}, ${stageBodyProgression}, ${faceExpr}`,
                "cockLove":   idx === 0 ? `upper body portrait, pure composed expression, keeping distance, (${wearTopTxt}), ${faceExpr}` : `1boy, upper body and face focus, kneeling and worshipping huge erect penis near face, kissing glans with ${tongueTypeTag}, ${faceExpr}`,
                "lust":       `upper body, ${idx === 0 ? "calm cool skin, composed breathing, " + wearTopTxt : "heavy blush, sweaty feverish skin, hot breath, rubbing thighs together"}, ${stageBodyProgression}, ${faceExpr}`,
                "corr":       `cowboy shot, ${idx === 0 ? "pure upright demeanor, clean clothes, " + currentFullOutfitTag : "dark seductive lighting, exposing glowing womb tattoo and dripping pussy"}, ${stageBodyProgression}, ${faceExpr}`,
                "shame":      `cowboy shot, ${idx === 0 ? "covering chest shyly, neat clothes, blushing, " + wearTopTxt : "blushing furiously, spreading labia with fingers in public, peeing and squirting"}, ${stageBodyProgression}, ${faceExpr}`,
                "obey":       `${idx === 0 ? "standing proudly, independent gaze, " + currentFullOutfitTag : "kneeling submissive posture, looking up at viewer begging"}, ${stageBodyProgression}, ${faceExpr}`,
                "pleas":      `cowboy shot, ${idx === 0 ? "calm breathing, peaceful expression, " + wearTopTxt : "trembling body, arched back in violent climax, squirting fountain"}, ${stageBodyProgression}, ${faceExpr}`,
                "精神沦陷":   `close-up face focus, ${idx === 0 ? "clear rational eyes, focused gaze" : `hypnotic glowing heart eyes, drooling saliva strings, ${tongueTypeTag} out`}, ${faceExpr}`,
                "媚药毒瘾":   `upper body, ${idx === 0 ? "healthy clean complexion, calm aura" : "flushed feverish skin, panting heavily, shivering from aphrodisiac withdrawal"}, ${stageBodyProgression}, ${faceExpr}`,
                "高潮总账":   `full body shot, convulsing in extreme climax, female ejaculation and pee puddle on floor, ${faceExpr}`,
                "射精总账":   `cowboy shot, bukkake, covered in thick white cum from face to distended belly, cum overflowing from mouth and pussy, ${faceExpr}`,
                "露出总账":   `full body shot, outdoor night alleyway by vending machine, exposing dripping wet gaping pussy, ${faceExpr}`
            };
            const chosenTag = sanitizeTemplateByBtnDesc(nonHoleMap[key] || `cowboy shot, ${stageBodyProgression}, ${faceExpr}`);
            const hasBoyInTag = chosenTag.includes("1boy");
            const soloOrDuo = hasBoyInTag ? `${subjectTag}, 1boy, hetero, monster sex` : `${subjectTag}, solo`;
            const ratingTag = (idx === 0 && !hasBoyInTag) ? "general, safe, fully clothed" : "NSFW";
            const noSexNegForStage1 = (!hasBoyInTag) ? "2.0::1boy, male, penis, sex, penetration, hetero, cum, semen, nude, naked, spread legs, M-legs::, " : "";
            const finalChosenTag = adaptPoseForMonster(chosenTag);
            const cleanFullDna = sanitizeTemplateByBtnDesc(fullCharDna);

            return `第${idx + 1}阶段：${key}_${curStageIdx}（${stgTag}）\n${IMG_OPEN}\n[${u}的${item.cleanTitle || key}第${curStageIdx}阶特写]\n${THINK_OPEN}\nStrictly draw according to button description: ${rawBtnVisualSummary}. 展现${u}的${item.cleanTitle || key}（第${curStageIdx}阶·${stgTag}）！\n${THINK_CLOSE}\n${HASH_PREFIX}Scene:${ratingTag}, ${soloOrDuo}, ${dmgTag}1.5::masterpiece, best quality, ${cleanFullDna}, ${finalChosenTag}${liveExtra}::, detailed background;\nChar1:1.5::${u}, ${cleanFullDna}::, ${finalChosenTag}${paraTag}${liveExtra}|centers:C3;\nChar1 UC:1.8::${sanitizeNegByBtnDesc(bodyProf.negBreast)}${noSexNegForStage1}${monsterLegNegBoost}${hasBoyInTag ? "solo, 1girl only, " : ""}multiple views, lowres, ${anatomyNegWord}text, watermark::;${HASH_SUFFIX}\n${IMG_CLOSE}`;
        }
        let xrayPlayMode = false;
        function buildEnhancedTopXRayCenter(v, dev, caps) {
            const sp = v.体内精液存量 || {};
            const wombMl = safeNum(sp.子宫毫升), vagMl = safeNum(sp.小穴毫升), analMl = safeNum(sp.屁眼毫升), mouthMl = safeNum(sp.口内毫升);
            const totalMl = wombMl + vagMl + analMl + mouthMl;
            const pleas = safeNum(v.精神与心理?.快感累积), lust = safeNum(v.核心数值?.性欲程度), sta = safeNum(v.身体?.体力, 100);
            const bpm = Math.min(195, Math.round(72 + pleas * 0.65 + lust * 0.45));
            const bodyTemp = (36.5 + (lust * 0.015) + (pleas * 0.012)).toFixed(1);
            const vagDia = (1.5 + dev.vagObj.val * 0.06).toFixed(1);
            const cervixDrop = Math.round((dev.wombObj.val / 100) * 18);
            const cervixGap = Math.round(2 + (dev.wombObj.val / 100) * 14);
            const wombRatio = Math.min(1, wombMl / Math.max(50, caps.wombMax));
            const rx = Math.round(24 + (dev.wombObj.val * 0.16) + wombRatio * 14), ry = Math.round(18 + (dev.wombObj.val * 0.12) + wombRatio * 12);
            const vagW = Math.round(7 + (dev.vagObj.val * 0.22)), analW = Math.round(5 + (dev.analObj.val * 0.18));
            const fertProb = safeNum(v.受孕与生理?.受孕概率, wombMl > 0 ? 75 : 15);
            const para = userSettings.parasiteState || { type: "无寄生", lv: 0, eggCount: 0 };
            const hasPara = para.lv > 0 && para.type !== "无寄生";

            return `
            <div id="st-top-xray-hub" style="margin-bottom:8px;background:linear-gradient(160deg,rgba(35,8,28,0.92),rgba(10,4,18,0.96));border:1.5px solid rgba(244,114,182,0.45);border-radius:13px;padding:8px 10px;box-shadow:0 8px 24px rgba(0,0,0,0.65);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="font-size:12px;font-weight:bold;color:#f9e2af;">🔬 全息 X-Ray 内窥</span>
                        <button type="button" id="st-xray-mode-toggle" style="background:${xrayPlayMode ? 'linear-gradient(135deg,#ec4899,#8b5cf6)' : 'rgba(255,255,255,0.1)'};color:${xrayPlayMode ? '#fff' : '#fde047'};border:1px solid #fde047;border-radius:99px;padding:1px 8px;font-size:10px;font-weight:bold;cursor:pointer;">${xrayPlayMode ? "👆 把玩模式:按压器官挤精/喷潮" : "🔍 详情模式(点此切把玩)"}</button>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:11px;font-family:Consolas,monospace;">
                        <span style="color:#fb7185;font-weight:bold;"><span class="st-heart-beat">💓</span> ${bpm} BPM</span>
                        <span style="color:#fde047;">🌡️ ${bodyTemp}℃</span>
                        <span style="color:#a5f3fc;">🥛 蓄精 ${totalMl}ml</span>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1.35fr 1fr;gap:8px;align-items:center;">
                    <svg id="st-xray-svg-canvas" viewBox="0 0 250 155" style="width:100%;max-height:145px;display:block;background:radial-gradient(circle at 50% 50%,rgba(95,15,52,0.6),rgba(8,4,15,0.95));border-radius:10px;border:1px solid rgba(243,139,168,0.3);">
                        <defs>
                            <radialGradient id="stWombGrad2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fb7185" stop-opacity="0.75"/><stop offset="100%" stop-color="#881337" stop-opacity="0.94"/></radialGradient>
                            <linearGradient id="stCumGrad2" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/><stop offset="100%" stop-color="#fde68a" stop-opacity="0.82"/></linearGradient>
                        </defs>
                        <path d="M52,6 Q42,78 58,149 L198,149 Q212,78 202,6 Z" fill="rgba(35,10,30,0.68)" stroke="#f472b6" stroke-width="1.2"/>
                        <g class="st-xray-hotspot" data-key="排卵周期" style="cursor:pointer;">
                            <path d="M58,48 Q92,35 125,${52 + cervixDrop} Q158,35 192,48" fill="none" stroke="#f472b6" stroke-width="2.5"/>
                            <circle cx="56" cy="49" r="${6 + Math.round(dev.wombObj.tier * 0.8)}" fill="#fb7185" stroke="#fff" stroke-width="1"/>
                            <circle cx="194" cy="49" r="${6 + Math.round(dev.wombObj.tier * 0.8)}" fill="#fb7185" stroke="#fff" stroke-width="1"/>
                        </g>
                        <g class="st-xray-hotspot" data-key="子宫实况" style="cursor:pointer;">
                            <ellipse cx="125" cy="${54 + cervixDrop}" rx="${rx}" ry="${ry}" fill="url(#stWombGrad2)" stroke="#fda4af" stroke-width="1.6"/>
                            ${wombRatio > 0 ? `<ellipse cx="125" cy="${54 + cervixDrop + ry * (1 - wombRatio) * 0.3}" rx="${Math.max(3, rx * 0.88 * wombRatio)}" ry="${Math.max(3, ry * 0.84 * wombRatio)}" fill="url(#stCumGrad2)"/>` : ""}
                            ${hasPara ? `<circle cx="118" cy="${50 + cervixDrop}" r="5" fill="#e879f9" stroke="#fff" stroke-width="0.8"/><circle cx="132" cy="${55 + cervixDrop}" r="4.5" fill="#c084fc" stroke="#fff" stroke-width="0.8"/><path d="M115,${56+cervixDrop} Q125,${44+cervixDrop} 135,${58+cervixDrop}" fill="none" stroke="#f0abfc" stroke-width="2"/>` : ""}
                            <rect x="${125 - cervixGap / 2}" y="${54 + cervixDrop + ry - 3}" width="${cervixGap}" height="10" fill="#be123c" rx="2"/>
                        </g>
                        <g class="st-xray-hotspot" data-key="小穴实况" style="cursor:pointer;">
                            <rect x="${125 - vagW / 2}" y="${62 + cervixDrop + ry}" width="${vagW}" height="${Math.max(25, 72 - cervixDrop)}" rx="${vagW / 2}" fill="#9f1239" stroke="#f472b6" stroke-width="1.3"/>
                            ${vagMl > 0 ? `<rect x="${125 - (vagW * 0.68) / 2}" y="${68 + cervixDrop + ry}" width="${vagW * 0.68}" height="${Math.min(55, 12 + vagMl * 0.25)}" rx="3" fill="url(#stCumGrad2)"/>` : ""}
                        </g>
                        <g class="st-xray-hotspot" data-key="屁眼实况" style="cursor:pointer;">
                            <rect x="${174 - analW / 2}" y="68" width="${analW}" height="72" rx="${analW / 2}" fill="#581c87" stroke="#c084fc" stroke-width="1.2"/>
                            ${analMl > 0 ? `<rect x="${174 - (analW * 0.68) / 2}" y="78" width="${analW * 0.68}" height="${Math.min(50, 10 + analMl * 0.25)}" rx="3" fill="url(#stCumGrad2)"/>` : ""}
                        </g>
                        <text x="10" y="20" fill="#f9e2af" font-size="9" font-weight="bold">🫀宫腔:${wombMl}ml</text>
                        <text x="10" y="33" fill="#fbcfe8" font-size="9">🌺小穴:${vagMl}ml</text>
                        <text x="10" y="46" fill="#d8b4fe" font-size="9">🕳️后庭:${analMl}ml</text>
                        <text x="10" y="59" fill="#fde68a" font-size="9">👄胃袋:${mouthMl}ml</text>
                        ${hasPara ? `<text x="10" y="72" fill="#e879f9" font-size="8.5" font-weight="bold">🐙怀卵:${safeNum(para.eggCount)}颗</text>` : ""}
                        <text x="10" y="144" fill="#67e8f9" font-size="8.5">下垂:${cervixDrop * 2}mm | 穴径:${vagDia}cm</text>
                    </svg>
                    <div style="display:flex;flex-direction:column;gap:4px;font-size:11px;">
                        <div class="st-xray-hotspot" data-key="骚口实况" style="cursor:pointer;background:rgba(0,0,0,0.4);border-left:2.5px solid #fda4af;padding:3px 6px;border-radius:5px;display:flex;justify-content:space-between;"><span>👄 骚口 Lv.${dev.mouthObj.tier + 1}</span><b style="color:#fda4af;">${dev.mouthObj.val}%</b></div>
                        <div class="st-xray-hotspot" data-key="胸部实况" style="cursor:pointer;background:rgba(0,0,0,0.4);border-left:2.5px solid #fbcfe8;padding:3px 6px;border-radius:5px;display:flex;justify-content:space-between;"><span>🍒 丰乳 Lv.${dev.chestObj.tier + 1}</span><b style="color:#fbcfe8;">${dev.chestObj.val}%</b></div>
                        <div class="st-xray-hotspot" data-key="小穴实况" style="cursor:pointer;background:rgba(0,0,0,0.4);border-left:2.5px solid #f472b6;padding:3px 6px;border-radius:5px;display:flex;justify-content:space-between;"><span>🌺 小穴 Lv.${dev.vagObj.tier + 1}</span><b style="color:#f472b6;">${dev.vagObj.val}%</b></div>
                        <div class="st-xray-hotspot" data-key="子宫实况" style="cursor:pointer;background:rgba(0,0,0,0.4);border-left:2.5px solid #e879f9;padding:3px 6px;border-radius:5px;display:flex;justify-content:space-between;"><span>🫀 子宫 Lv.${dev.wombObj.tier + 1}</span><b style="color:#e879f9;">${dev.wombObj.val}%</b></div>
                        <div class="st-xray-hotspot" data-key="阴蒂尿道" style="cursor:pointer;background:rgba(0,0,0,0.4);border-left:2.5px solid #fde047;padding:3px 6px;border-radius:5px;display:flex;justify-content:space-between;"><span>💧 蒂尿 Lv.${dev.clitObj.tier + 1}</span><b style="color:#fde047;">${dev.clitObj.val}%</b></div>
                        <div class="st-xray-hotspot" data-key="屁眼实况" style="cursor:pointer;background:rgba(0,0,0,0.4);border-left:2.5px solid #c084fc;padding:3px 6px;border-radius:5px;display:flex;justify-content:space-between;"><span>🕳️ 后庭 Lv.${dev.analObj.tier + 1}</span><b style="color:#c084fc;">${dev.analObj.val}%</b></div>
                        <div class="st-xray-hotspot" data-key="受精断面" style="cursor:pointer;background:rgba(244,114,182,0.15);border:1px dashed rgba(244,114,182,0.45);padding:3px 6px;border-radius:5px;display:flex;justify-content:space-between;color:#fef08a;"><span>🥚 受孕:${fertProb}%</span><b>体力:${sta}%</b></div>
                    </div>
                </div>
            </div>`;
        }

        function fmtKey(rk, barTheme = "pleas", subBarCfg = null, hideBar = false, stagePctOverride = null) {
            const rawKeyStr = safeStr(rk, "状态项"), tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            let pct = null, rawRatioStr = null;
            const m = rawKeyStr.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+(?:\.\d+)?)([a-zA-Z\u4e00-\u9fa5]*)/);
            if (m) {
                const cur = parseFloat(m[1]), max = parseFloat(m[2]);
                rawRatioStr = `${m[1]}/${m[2]}${m[3] || ""}`;
                if (max > 0) pct = Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
            } else {
                const sm = { "第一阶段": 0, "第二阶段": 28, "第三阶段": 48, "第四阶段": 68, "第五阶段": 88, "第六阶段": 100 };
                for (const [k, v] of Object.entries(sm)) if (rawKeyStr.includes(k)) { pct = v; break; }
            }
            const badges = [];
            let cleanTitle = rawKeyStr
                .replace(/「([^」]{1,45})」/g, (_, s) => {
                    const isStage6 = s.includes("第六阶段") || s.includes("彻底崩坏") || s.includes("畸变") || s.includes("100%");
                    const isStage5 = !isStage6 && (s.includes("第五阶段") || s.includes("脱垂") || s.includes("脱肛") || s.includes("便器"));
                    const cls = isStage6 ? "st-stage6-badge" : (isStage5 ? "st-stage5-badge" : "");
                    const bBg = isStage5 ? "linear-gradient(90deg,#ff003c,#2b0012)" : tc.hi;
                    badges.push(`<span class="${cls}" style="background:${bBg};border:1px solid ${tc.sec};color:#fff;padding:1px 6px;border-radius:6px;font-size:10.5px;font-weight:bold;white-space:nowrap;">${s}</span>`);
                    return "";
                })
                .replace(/[（(]([^）)]{1,45}?(?:阶段|\d+\s*[\/／]\s*\d+)[^）)]{0,25}?)[）)]/g, (_, s) => {
                    badges.push(`<span style="background:rgba(255,255,255,0.1);border:1px solid ${tc.prim};color:${tc.prim};padding:1px 6px;border-radius:6px;font-size:10.5px;white-space:nowrap;">${s}</span>`);
                    return "";
                })
                .replace(/[：:]\s*(\d+(?:\.\d+)?\s*[\/／]\s*\d+[a-zA-Z\u4e00-\u9fa5]*)\s*$/, (_, n) => {
                    if (!hideBar) badges.unshift(`<span style="background:rgba(249,226,175,0.15);border:1px solid rgba(249,226,175,0.42);color:#f9e2af;padding:1px 6px;border-radius:6px;font-size:11px;font-family:Consolas,monospace;font-weight:bold;white-space:nowrap;">${n}</span>`);
                    return "";
                })
                .replace(/[：:]\s*$/, "").trim();

            const keyHTML = `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;width:100%;"><span style="color:#f9e2af;font-weight:bold;font-size:13px;line-height:1.35;word-break:break-word;">${cleanTitle}</span><div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;justify-content:flex-end;margin-left:auto;">${badges.join("")}</div></div>`;
            let barHTML = "";
            if (pct !== null && !hideBar && barTheme !== "none") {
                const st = getThemedBarStyle(pct, barTheme);
                const mainLabel = subBarCfg ? `${pct}%` : (rawRatioStr && rawRatioStr.includes("ml") ? rawRatioStr : `${pct}%`);
                const barTitle = subBarCfg ? (subBarCfg.mainName || "💀 崩坏阶位") : `Lv.${st.tier + 1} 崩坏度`;
                barHTML = `<div style="display:flex;flex-direction:column;gap:5px;margin-top:4px;width:100%;background:rgba(0,0,0,0.36);padding:6px 8px;border-radius:9px;border:1px solid rgba(255,255,255,0.08);box-sizing:border-box;"><div style="display:flex;flex-direction:column;gap:3px;width:100%;"><div style="display:flex;justify-content:space-between;align-items:center;gap:4px;width:100%;flex-wrap:wrap;"><span style="font-size:10.5px;color:#f5c2e7;font-weight:bold;">${barTitle} <b style="color:${st.labelColor};font-family:Consolas,monospace;">${mainLabel}</b></span>${st.emo}</div><div style="width:100%;height:8px;background:rgba(0,0,0,0.82);border:1px solid rgba(255,255,255,0.15);border-radius:99px;overflow:hidden;padding:1px;box-sizing:border-box;"><div class="st-bar-fill" style="width:${pct}%;height:100%;background:${st.grad};border-radius:99px;box-shadow:${st.glow};transition:width 0.35s ease;"></div></div></div>`;
                if (subBarCfg) {
                    const subPct = Math.max(0, Math.min(100, safeNum(subBarCfg.pct, 0))), subSt = getThemedBarStyle(subPct, subBarCfg.theme || "semen");
                    barHTML += `<div style="display:flex;flex-direction:column;gap:3px;width:100%;padding-top:3px;border-top:1px dashed rgba(255,255,255,0.08);"><div style="display:flex;justify-content:space-between;align-items:center;gap:4px;width:100%;flex-wrap:wrap;"><span style="font-size:10.5px;color:${subSt.labelColor};font-weight:bold;">${subBarCfg.label || "💧 容量"} <b style="font-family:Consolas,monospace;">${subBarCfg.text || (subPct + "%")}</b></span>${subSt.emo}</div><div style="width:100%;height:6.5px;background:rgba(0,0,0,0.82);border:1px solid rgba(255,255,255,0.12);border-radius:99px;overflow:hidden;padding:1px;box-sizing:border-box;"><div class="st-bar-fill" style="width:${subPct}%;height:100%;background:${subSt.grad};border-radius:99px;box-shadow:${subSt.glow};transition:width 0.35s ease;"></div></div></div>`;
                }
                barHTML += `</div>`;
            }
            const finalPctForImg = stagePctOverride !== null ? stagePctOverride : pct;
            return { keyHTML, barHTML, cleanTitle, pct: finalPctForImg, hasStageBar: (!hideBar && barTheme !== "none" && pct !== null) };
        }

        let _dynCtxCache = { sig: "", res: null };
        // 🔍 全按钮实时正文状态提取器：自动从当前生效楼层与变身档案中，为所有按钮提取主角此刻在正文中的真实状态！
        function extractDynamicContext(u, v = curVars) {
            const ctx = safeCtx(), chatArr = ctx?.chat || [];
            const targetName = safeStr(u || detectProtagonistName(v) || "主角").trim();
            const lastMes = safeStr(chatArr[chatArr.length - 1]?.mes);
            const sig = `${targetName}_${chatArr.length}_${lastMes.length}_${safeStr(v?.档案?.锁定外貌DNA)}`;
            if (_dynCtxCache.sig === sig && _dynCtxCache.res) return _dynCtxCache.res;

            const morphState = resolveCurrentMorphedArchiveAndState(targetName, chatArr);
            const { morphedAliasName, matchedArchiveBlock, isCurrentlyRevertedToHuman } = morphState;

            let activeArchiveText = "";
            if (matchedArchiveBlock) {
                activeArchiveText = isCurrentlyRevertedToHuman
                    ? matchedArchiveBlock.replace(/\*\s*\*\*恶鬼真身[\s\S]*?(?=\*\s*\*\*|$)/g, "")
                    : matchedArchiveBlock;
            }

            const recentNarrative = chatArr.slice(-2).map(m => safeStr(m?.mes)
                .replace(/<think[\s\S]*?<\/think>|<options>[\s\S]*?<\/options>|<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "")
                .replace(/###\s*【[^】]*】[\s\S]*?(?=\*\*\*|---|###|<\/game>|$)/g, "")
            ).join("\n");

            const combinedActiveText = `${activeArchiveText}\n${recentNarrative}`;
            const sents = combinedActiveText.split(/[。！？；\n\r]+/).map(s => s.replace(/^\s*[\*\-•]+/, "").trim()).filter(s => s.length >= 4 && s.length <= 160);
            const recentSents = recentNarrative.split(/[。！？；\n\r]+/).map(s => s.replace(/^\s*[\*\-•]+/, "").trim()).filter(s => s.length >= 4 && s.length <= 140);

            const pickBestSent = (regex, preferRecent = true) => {
                const pool = preferRecent ? [...recentSents].reverse().concat([...sents].reverse()) : [...sents].reverse();
                for (const s of pool) {
                    if (/四份档案|四个名字|白桃.*蛛音.*琥珀.*澪/.test(s)) continue;
                    if (/^(?:室友|摊主|醉汉|混混|大叔|体育生|猎物)/.test(s) && !s.includes(targetName) && !s.includes("我")) continue;
                    if (regex.test(s)) return s;
                }
                return "";
            };

            const res = {
                morphedAlias: isCurrentlyRevertedToHuman ? `${morphedAliasName}(人类伪装态)` : morphedAliasName,
                isReverted: isCurrentlyRevertedToHuman,
                activeCombinedText: combinedActiveText,
                identity: pickBestSent(/(?:变成了|伪装成|混迹于|诞生于|男大学生|富家小千金|小萝莉|恶鬼|魔物)/),
                bodyDesc: pickBestSent(/(?:身高\d+公分|身形|皮肤|骨架|娇小玲珑|蜜桃臀|腰臀比例|半透明|小麦色肌肤)/),
                thought: (recentNarrative.match(/\*([^*\n]{4,120})\*/g) || []).pop()?.replace(/\*/g, "").trim() || "",
                pose: pickBestSent(/(?:跪坐在|跪倒在|坐在|趴在|躺在|站立|夹紧双腿|靠在|赤着双腿)/, true),
                mouth: pickBestSent(/(?:双唇|小嘴|嘴角|尖牙|虎牙|长舌|舌头|喉咙|嗓音|喘息|吞咽)/),
                chest: pickBestSent(/(?:胸部|双乳|乳房|乳头|乳尖|平胸|小巧|纺丝腺体|奶子|胸前)/),
                vag: pickBestSent(/(?:小穴|双穴|两个.*穴|阴唇|白虎|肉缝|会阴|阴道|穴口|穴肉|肉丝褶皱)/),
                womb: pickBestSent(/(?:子宫|宫口|吸精子宫|储精腔|精囊胃|小腹|肚皮)/),
                clit: pickBestSent(/(?:阴蒂|尿道|马眼|括约肌|失禁|潮吹)/),
                anal: pickBestSent(/(?:后庭|屁眼|菊穴|肛门|蜜桃臀|屁股|尾椎|肉尾)/),
                headWear: pickBestSent(/(?:双马尾|姬发式|长发|短发|刘海|红框圆眼镜|眼镜|发卡|创可贴|鬼角|小肉角)/),
                neckWear: pickBestSent(/(?:锁骨|脖颈|领口|项圈|颈链)/),
                braWear: pickBestSent(/(?:胸罩|内衣|小背心|死库水|胸衣|真空|乳头)/),
                topWear: pickBestSent(/(?:卫衣|洛丽塔|蓬蓬裙|运动小背心|校服外套|上衣|裙摆)/),
                pantyWear: pickBestSent(/(?:内裤|底裤|连内裤都不穿|裆部|胖次)/),
                bottomWear: pickBestSent(/(?:蓬蓬裙|百褶裙|牛仔热裤|运动裤|短裙|裙摆)/),
                sockWear: pickBestSent(/(?:及膝袜|白丝|黑丝|丝袜|小短腿|大腿)/),
                shoeWear: pickBestSent(/(?:赤着双腿|光着.*脚丫|赤足|皮鞋|运动鞋|双脚)/)
            };
            _dynCtxCache = { sig, res };
            return res;
        }

        function getDynamicMetricDetail(type, v, u) {
            const ovr = v.按钮详情?.[type];
            const map = {
                cockLove: { val: safeNum(v.核心数值?.对肉棒好感度), rev: false, st: ["抗拒戒备","粘膜适应","空虚渴求","跪舔崇拜","断根戒断","脑干阳具寄生"], d: [
                    `【🔬 阳具好感（Lv.1 完好戒备）】：${u}理智完好，对雄性阳具保持警惕与排斥，身体未产生任何迎合本能。\n💭【${u}的实时心声】：“*我必须保持距离，绝不能让自己的清白受到玷污。*”`,
                    `【🔬 阳具好感（Lv.2 粘膜适应）】：粘膜在摩擦中记住了阳具轮廓与滚烫热度，抗拒感逐渐软化为羞耻的顺从。\n💭【${u}的实时心声】：“*虽然还是觉得难为情，但身体粘膜似乎渐渐适应了那种滚烫温度💦……*”`,
                    `【🔬 阳具好感（Lv.3 空虚渴求）】：神经已在抽插中食髓知味，空虚时内壁泛起阵阵酸痒，渴望被粗大肉棒塞满。\n💭【${u}的实时心声】：“*里面隐隐有些发空发痒，好想念被塞满时的充实感呀😳💦……*”`,
                    `【🔬 阳具好感（Lv.4 跪舔崇拜）】：快感中枢已被彻底驯化，闻到浓烈雄性麝香便双腿发软、口腔分泌涎水。\n💭【${u}的实时心声】：“*浓烈的气息一冲进鼻腔下面就已经湿透了，好想快点跪下来服侍呀🥵💦！*”`,
                    `【🔬 阳具好感（Lv.5 断根戒断）】：重度阳具成瘾，一旦体内没有肉棒填塞便会引发全身燥热发抖的戒断反应。\n💭【${u}的实时心声】：“*呜汪♡……没有大肉棒塞着全身骨头都难受，求求快插进来吧🥵💦❤️！*”`,
                    `【💀 第六阶段·脑干阳具寄生（100% 彻底崩坏）】：视觉与嗅觉中枢彻底崩坏，眼中只有肉棒，将自身存在意义完全等同于肉棒套子！\n💭【${u}的实时心声】：“*啊嘿♡……脑干里全都长满大肉棒的形状了，请永远焊死在肉洞里吧🥵💦❤️❤️！*”`
                ]},
                lust: { val: safeNum(v.核心数值?.性欲程度), rev: false, st: ["清心克制","春情微燥","欲火焚身","重度发骚","狂暴发情","下丘脑烧毁"], d: [
                    `【🔬 情欲实况（Lv.1 清心完好）】：内分泌系统平稳，心神清澈冷静，肌肤温凉干爽。\n💭【${u}的实时心声】：“*现在心境很平静，没有任何奇怪的燥热感。*”`,
                    `【🔬 情欲实况（Lv.2 春情微燥）】：雌激素微升，小腹深处泛起淡淡温热，耳根微微发烫。\n💭【${u}的实时心声】：“*唔……不知怎么身体稍微有些发热💦。*”`,
                    `【🔬 情欲实况（Lv.3 欲火焚身）】：情欲翻涌，乳尖发硬挺立，私处自发分泌出湿润春水。\n💭【${u}的实时心声】：“*身体烫得厉害，两腿之间已经湿漉漉地黏在一起了😳💦！*”`,
                    `【🔬 情欲实况（Lv.4 重度发骚）】：全身皮肤泛起妖异潮红，双腿本能交叠磨蹭，眼神迷离拉丝。\n💭【${u}的实时心声】：“*哈啊……淫水根本止不住地往外淌，满脑子都想着被按住灭火呀🥵💦！*”`,
                    `【🔬 情欲实况（Lv.5 狂暴发情）】：理智被情欲吞没，三穴不断涌出滚烫粘液求配，散发浓烈催情体香。\n💭【${u}的实时心声】：“*啊啊♡……发情一秒钟都停不下来了，快把我按在地上狠狠干烂吧🥵💦❤️！*”`,
                    `【💀 第六阶段·下丘脑烧毁（100% 彻底崩坏）】：体温调节与性欲中枢彻底烧毁，化作24小时永不停歇的发情肉偶！\n💭【${u}的实时心声】：“*啊嘿♡……发情开关彻底烧化坏死了，不睡觉也要永远挨操交配呀🥵💦❤️❤️！*”`
                ]},
                corr: { val: safeNum(v.核心数值?.淫乱恶堕), rev: false, st: ["完好清白","初度染尘","食髓知味","放荡娼妇","公用精盆","彻底崩坏肉坑"], d: [
                    `【🔬 恶堕实况（Lv.1 完好清白）】：人格与道德尊严完好无损，举止端庄自持。\n💭【${u}的实时心声】：“*无论处境如何变化，我都绝不会放弃自己的尊严底线。*”`,
                    `【🔬 恶堕实况（Lv.2 初度染尘）】：矜持防线出现裂痕，在肉体快感面前学会了半推半就的被动顺从。\n💭【${u}的实时心声】：“*虽然心里有些屈辱，但似乎不像最开始那样剧烈抗拒了💦……*”`,
                    `【🔬 恶堕实况（Lv.3 食髓知味）】：对情事产生熟练肌肉记忆，道德负罪感消退，开始主动扭腰迎合。\n💭【${u}的实时心声】：“*身体早就习惯了男人的温度，甚至会忍不住主动夹紧迎合呢😳💦。*”`,
                    `【🔬 恶堕实况（Lv.4 放荡娼妇）】：尊严坍塌，彻底享受放荡欢愉，张嘴闭嘴皆是直白下流的挑逗。\n💭【${u}的实时心声】：“*什么清白体面全都是多余的，哪有张开双腿享受内射来得快活呀🥵💦！*”`,
                    `【🔬 恶堕实况（Lv.5 公用精盆）】：完全将自己视作随时供人内射泄欲的移动精盆与母畜玩物。\n💭【${u}的实时心声】：“*呜汪♡……我就是一件只要张开腿就能随便射精的公用精盆🥵💦❤️！*”`,
                    `【💀 第六阶段·排泄肉坑（100% 彻底崩坏）】：人类自尊回路100%坏死清零，彻底觉醒深渊母畜本能！\n💭【${u}的实时心声】：“*啊嘿♡……人类的人格已经彻底死掉啦，请把臭肉洞操烂报废吧🥵💦❤️❤️！*”`
                ]},
                shame: { val: safeNum(v.精神与心理?.羞耻度, 100), rev: true, st: ["羞愤自持","耳根滚烫","习以为常","敞腿任看","羞耻全灭","羞耻神经坏死"], d: [
                    `【🔬 羞耻防线（Lv.1 完好自持）】：羞耻心极强，注重衣着得体，稍有走光便会立刻捂紧遮挡。\n💭【${u}的实时心声】：“*必须注意整理好衣襟与姿态，绝不能让人看到不雅模样。*”`,
                    `【🔬 羞耻防线（Lv.2 耳根滚烫）】：暴露下耳根滚烫通红，遮挡动作变得软弱迟疑。\n💭【${u}的实时心声】：“*脸颊烫得厉害……被人盯着看连手脚都不知道往哪放了😳💦。*”`,
                    `【🔬 羞耻防线（Lv.3 习以为常）】：羞耻感磨平大半，赤裸展露身体或当面清理残精时已平静麻木。\n💭【${u}的实时心声】：“*光着身子走动或者清理私处，现在的我早已经习以为常了💦。*”`,
                    `【🔬 羞耻防线（Lv.4 敞腿任看）】：被人视奸私处时非但不躲，反而兴奋得阴蒂勃起、穴口淌水。\n💭【${u}的实时心声】：“*就算被人撞见一丝不挂的模样，我也会直接敞开双腿让他看个够哟🥵💦！*”`,
                    `【🔬 羞耻防线（Lv.5 羞耻全灭）】：羞耻逆转为强烈催情剂，极度渴望在公共场合掀裙掰穴展示泥泞私处。\n💭【${u}的实时心声】：“*啊啊♡……快让所有人都来看看这具还在漏精滴尿的骚身体吧🥵💦❤️！*”`,
                    `【💀 第六阶段·羞耻坏死（0/100 彻底崩坏）】：毫无人类廉耻，只有当众敞穴潮吹喷尿才能刺激绝顶高潮！\n💭【${u}的实时心声】：“*啊嘿♡……羞耻是什么早就忘光啦！看母猪当众喷尿失禁高潮吧🥵💦❤️❤️！*”`
                ]},
                obey: { val: safeNum(v.精神与心理?.服从度), rev: false, st: ["孤高自主","被动妥协","温顺配合","摇尾乞怜","绝对盲从","前额叶切除木偶"], d: [
                    `【🔬 服从实况（Lv.1 完好自主）】：自我意志独立坚定，拒绝任何无理摆布。\n💭【${u}的实时心声】：“*我的身体与意志只属于我自己，休想随便摆布我。*”`,
                    `【🔬 服从实况（Lv.2 被动妥协）】：在支配与快感下学会低头妥协，不再激烈挣扎。\n💭【${u}的实时心声】：“*人在屋檐下不得不低头……眼下还是先顺从配合吧💦。*”`,
                    `【🔬 服从实况（Lv.3 温顺配合）】：已形成温顺配合的肌肉记忆，听到指令便自然摆好姿势。\n💭【${u}的实时心声】：“*乖乖听话把身体收拾干净，身体已经完全习惯顺从了😳💦。*”`,
                    `【🔬 服从实况（Lv.4 摇尾乞怜）】：反抗意志被彻底驯服，主动四肢着地塌腰撅臀讨好雄性。\n💭【${u}的实时心声】：“*只要一声令下，无论让我摆出什么姿势伺候都会乖乖照做的🥵💦！*”`,
                    `【🔬 服从实况（Lv.5 绝对盲从）】：完全丧失拒绝能力，将雄性的命令奉为最高肉体铁律。\n💭【${u}的实时心声】：“*呜汪♡……只要主人们高兴，要把我怎么捆起来内射都可以呀🥵💦❤️！*”`,
                    `【💀 第六阶段·木偶化（100% 彻底崩坏）】：前额叶思考能力形同切除，只会条件反射执行任何下流指令！\n💭【${u}的实时心声】：“*啊嘿……呜汪♡……脑子空空的不会思考了，主人让怎么弄坏就怎么弄坏呀🥵💦❤️❤️！*”`
                ]},
                pleas: { val: safeNum(v.精神与心理?.快感累积), rev: false, st: ["神思清明","尾椎微麻","趾尖蜷缩","濒临绝顶","潮吹失神","多巴胺烧穿熔断"], d: [
                    `【🔬 快感负荷（Lv.1 完好清明）】：神经系统平稳正常，呼吸均匀。\n💭【${u}的实时心声】：“*呼吸平稳，身体没有任何异常的酸麻或失控感。*”`,
                    `【🔬 快感负荷（Lv.2 尾椎微麻）】：敏感带残留微弱酥麻余温，腰眼隐隐发软。\n💭【${u}的实时心声】：“*呼……身体深处还残留着一点微妙的酸麻感💦。*”`,
                    `【🔬 快感负荷（Lv.3 趾尖蜷缩）】：酥麻电流顺尾椎不断攀升，脚趾控制不住地蜷缩绷紧。\n💭【${u}的实时心声】：“*唔嗯……酥麻感一波接一波往上涌，脚趾都蜷缩起来了😳💦！*”`,
                    `【🔬 快感负荷（Lv.4 濒临绝顶）】：快感蓄积至临界点，全身肌肉绷紧颤抖，括约肌剧烈收缩。\n💭【${u}的实时心声】：“*要、要去了！再刺激一下就会当场高潮出来的呀🥵💦！*”`,
                    `【🔬 快感负荷（Lv.5 潮吹失神）】：连续高潮过载导致大脑空白翻白眼，下体失控狂喷潮吹热流。\n💭【${u}的实时心声】：“*啊啊——去了♡！！全身骨头都爽得融化成水了🥵💦❤️！*”`,
                    `【💀 第六阶段·多巴胺熔断（100% 彻底崩坏）】：神经突触彻底熔断，陷入永不停止的痉挛绝顶与漏尿潮吹！\n💭【${u}的实时心声】：“*啊嘿♡——脑髓彻底烧穿短路啦，一秒钟不停地抽搐喷尿高潮到死呀🥵💦❤️❤️！*”`
                ]},
                sta: { val: safeNum(v.身体?.体力, 100), rev: true, st: ["亭亭玉立","腰腿酸软","膝软外八不合","双腿痉挛瘫软","髋骨脱臼爬行","四肢废用肉垫"], d: [
                    `【🔬 躯体机能（Lv.1 完好充沛）】：体力充沛（${safeNum(v.身体?.体力, 100)}/100），身姿挺拔稳健。\n💭【${u}的实时心声】：“*目前精力很充沛，姿态端正稳健。*”`,
                    `【🔬 躯体机能（Lv.2 腰腿酸软）】：腰腹与双腿肌肉酸软沉重，呼吸略微急促。\n💭【${u}的实时心声】：“*稍微出了一身薄汗，腰和腿都有点酸沉沉的💦。*”`,
                    `【🔬 躯体机能（Lv.3 膝软外八不合）】：大腿内收肌拉伤松弛，双膝发软打颤，走路呈怪异外八字且夹不拢腿。\n💭【${u}的实时心声】：“*膝盖一直在发抖，大腿根部酸软得根本并拢不了😳💦。*”`,
                    `【🔬 躯体机能（Lv.4 双腿痉挛瘫软）】：体力濒临枯竭，双腿剧烈抽搐无法站稳，只能瘫软敞腿喘息。\n💭【${u}的实时心声】：“*哈啊……浑身一点力气都使不出来了，只能敞开腿瘫倒下来🥵💦……*”`,
                    `【🔬 躯体机能（Lv.5 髋骨脱臼爬行）】：完全丧失直立行走能力，只能四肢着地塌腰撅臀在地上爬行。\n💭【${u}的实时心声】：“*呜汪♡……胯骨被撞脱臼站不起来了，只能像母狗一样撅着屁股爬行呀🥵💦❤️！*”`,
                    `【💀 第六阶段·四肢废用肉垫（0/100 彻底崩坏）】：脊椎与髋骨长死成M字大开腿撅臀的活体肉垫姿态！\n💭【${u}的实时心声】：“*啊嘿♡……手脚彻底废掉啦，骨头长死成M字开腿的肉垫形状了🥵💦❤️❤️！*”`
                ]}
            };
            const cfg = map[type] || map.cockLove, t = tier6(cfg.val, cfg.rev);
            if (ovr && (ovr.desc || ovr.thought)) {
                return { val: cfg.val, stage: ovr.stage || cfg.st[t], desc: `${ovr.desc || cfg.d[t].split("💭")[0]}\n💭【${u}的实时心声】：“*${cleanThoughtText(ovr.thought || "……")}*”` };
            }
            const rawLines = cfg.d[t].split("💭"), objSection = rawLines[0];
            const pureThoughtsArr = cfg.d.map(itemStr => cleanThoughtText(itemStr.split("实时心声】：“")[1] || ""));
            return { val: cfg.val, stage: cfg.st[t], desc: `${objSection}💭【${u}的实时心声】：“*${pickStageThought(v, pureThoughtsArr, cfg.val, cfg.rev)}*”` };
        }

        // 🧬 通用语法级【按按钮部位精准过滤的：身体异化 & 实时描述 ➔ NAI/ComfyUI 英文Tag动态编译器】
        function compileButtonDescAndMutationToEnTags(textToScan, partKey = "") {
            const s = stripFakeAccessoryAndMetaphorWords(safeStr(textToScan));
            if (!s) return { enTags: [], cnNotes: [], isMutated: false };

            const key = String(partKey || "");
            const isHeadPart  = (key === "穿搭_头饰" || key === "内心独白" || key === "骚口实况");
            const isChestPart = (key === "胸部实况" || key === "穿搭_胸罩" || key === "穿搭_上衣" || key === "穿刺环饰");
            const isVagPart   = (key === "小穴实况" || key === "阴蒂尿道" || key === "体内道具" || key === "穿搭_内裤" || key === "破瓜纪念");
            const isWombBelly = (key === "子宫实况" || key === "排卵周期" || key === "受精断面" || key === "精液归属" || key === "孕肚进度" || key === "淫纹烙印" || key === "正字涂鸦");
            const isAnalRear  = (key === "屁眼实况" || key === "穿搭_下装");
            const isLegFoot   = (key === "穿搭_丝袜" || key === "穿搭_鞋子");
            const isFullBody  = (key === "肉体外貌" || key === "身份与背景" || key === "当前姿势");

            const enTags = new Set();
            const cnNotes = new Set();
            let isMutated = false;

            const comboRules = [
                // 👁️ 面部四只眼睛 / 三只眼（自动写入头部与面容、内心独白、骚口、全身外貌的详细描述里！）
                { scopes: ["head", "full"], reg: /(?:四只眼|四眼|四目|两对眼睛|四颗眼|眼眶下.*副眼|four eyes|two pairs of eyes)/i, en: "1.55::four eyes, two pairs of eyes on face::", cn: "精致的面容上长着四只眼睛（主眼眶下方并列着一对灵动妖异的副眼，两对眼眸同时眨动注视）" },
                { scopes: ["head", "full"], reg: /(?:三只眼|三目|额头.*竖眼|眉心.*第三只眼|three eyes|third eye)/i, en: "1.55::three eyes, third eye on forehead::", cn: "眉心额头中央裂开着第三只妖异的竖眼" },
                // 🌺 小穴异化
                { scopes: ["vag", "full"], reg: /(?:全身|浑身|遍布|布满|到处都是|密密麻麻|无数|十几个|几十个)[^。！？；\n]{0,12}(?:小穴|肉穴|淫穴|蜜穴|肉洞|性交洞|阴道)/i, en: "1.8::multiple pussies all over body::", cn: "全身皮肉布满无数饥渴开合的吸精小穴与肉洞" },
                { scopes: ["vag", "full"], reg: /(?:三个|四个|五个|六个|八个|一排|多个|好几个)[^。！？；\n]{0,10}(?:小穴|肉穴|淫穴|蜜穴|阴道)/i, en: "1.75::three vaginas::", cn: "下体并排长着多个湿滑收缩的异形小穴" },
                { scopes: ["vag", "full"], reg: /(?:两个|双|上下两个|并排两个)[^。！？；\n]{0,10}(?:粉嫩.*)?(?:小穴|肉穴|淫穴|蜜穴|阴道)|双穴/i, en: "1.55::double pussy, two vaginas::", cn: "会阴处严丝合缝地上下并排长着两个独立又在深处相连的粉嫩小穴" },
                { scopes: ["vag"], reg: /(?:两个|双|多个|一排)[^。！？；\n]{0,8}阴蒂/i, en: "1.7::double clitoris::", cn: "长着多颗充血勃起、时刻跳动索求摩擦的敏感阴蒂" },
                { scopes: ["vag", "womb"], reg: /肉丝褶皱|吸精肉丝|蜘蛛巢穴般.*肉丝|上千颗.*肉芽|环状吸盘|子宫口.*演化成.*嘴|第二张嘴/i, en: "1.6::fleshy suction cups and writhing meat tendrils inside vaginal walls::", cn: "穴道内壁密布会自动蠕动抽拉的吸精肉丝褶皱与吸盘" },
                // 🍒 乳房异化
                { scopes: ["chest", "full"], reg: /(?:四个|四颗|两对|4个|四只)[^。！？；\n]{0,10}(?:奶子|乳房|巨乳|胸乳|奶袋|乳头|奶)|四乳/i, en: "1.4::four breasts::", cn: "胸腹前上下并排长着四颗饱满晃动的乳房（两对双乳，共四个奶子）" },
                { scopes: ["chest", "full"], reg: /(?:六个|六颗|八个|三对|四对|一排|两排|母猪般.*一排|全身.*布满)[^。！？；\n]{0,12}(?:奶子|乳房|巨乳|奶袋|乳头)|多乳/i, en: "1.5::six breasts, rows of breasts::", cn: "从胸口到小腹像母畜一样排列着六颗丰满泌乳的乳房" },
                { scopes: ["chest", "full"], reg: /(?:三个|三颗|3个)[^。！？；\n]{0,8}(?:奶子|乳房|巨乳|奶)/i, en: "1.45::three breasts::", cn: "胸前并排长着三颗丰满的乳房" },
                { scopes: ["chest"], reg: /(?:肚脐|乳头)[^。！？；\n]{0,15}(?:吐丝|淫丝|纺丝孔|纺丝腺体)/i, en: "1.6::sticky pink spider web threads spraying from nipples::", cn: "娇嫩凸起的乳头内部演化出『纺丝腺体』，可向外喷吐粉红色催情淫丝" },
                // 👄 嘴巴/舌头/牙齿异化
                { scopes: ["head", "full"], reg: /(?:两个|两张|双|第二张|三个|多张)[^。！？；\n]{0,10}(?:嘴|嘴巴|口器|骚口|淫口)/i, en: "1.75::multiple mouths, two mouths::", cn: "长着多张随时流淌涎水、渴望吞咽肉棒的贪婪嘴巴" },
                { scopes: ["womb", "full"], reg: /(?:肚子|小腹|肚皮|胸口)[^。！？；\n]{0,8}(?:裂开|长出|张开)[^。！？；\n]{0,8}(?:嘴|大嘴|口器)/i, en: "1.8::stomach mouth, vertical mouth on belly with tongue::", cn: "肚皮上异位裂开一张布满软肉与长舌的吸精口器" },
                { scopes: ["head"], reg: /(?:两条|三根|多条|好几条|分叉)[^。！？；\n]{0,8}(?:舌头|长舌|淫舌|肉舌)/i, en: "1.7::long forked tongue::", cn: "口腔内伸出分叉或多条灵活纠缠的淫靡长舌" },
                { scopes: ["head"], reg: /嘴角.*撕裂|裂口|三排.*尖牙|密密麻麻.*尖牙|满嘴.*利齿|小虎牙/i, en: "1.6::sharp fangs, monster mouth::", cn: "齿列间长着锋利的恶鬼尖牙" },
                { scopes: ["head"], reg: /肉刺.*舌|三十公分.*舌|极长.*舌|倒刺.*舌/i, en: "1.7::extremely long monster red tongue, barbed tongue::", cn: "长达三十公分、布满温热肉刺的猩红长舌" },
                // 🕳️ 后庭与全身特征
                { scopes: ["anal", "full"], reg: /尾椎.*钻出.*肉尾|倒刺与吸盘.*肉尾|紫黑色肉尾/i, en: "1.7::long dark monster tail with barbs at tailbone::", cn: "尾椎骨处钻出一条长满倒刺与吸盘的紫黑色恶鬼肉尾" },
                { scopes: ["womb", "full"], reg: /半透明[^。！？；\n]{0,10}(?:肚皮|小腹|皮肤|身体|胶质软肉)|透过[^。！？；\n]{0,10}肚皮[^。！？；\n]{0,10}看见/i, en: "1.75::translucent skin, see-through abdomen::", cn: "皮肤呈半透明胶质软肉，可透过肚皮清晰看见内部蠕动的粉红子宫腔室" },
                { scopes: ["anal", "leg", "full"], reg: /(?:后背|大腿|全身|皮下|肉缝)[^。！？；\n]{0,15}(?:数十|几十|无数|密密麻麻|百目|多颗|裂开)[^。！？；\n]{0,12}(?:眼球|眼珠|眼睛|肉缝)/i, en: "1.7::multiple glowing eerie eyes embedded in purple-red skin seams::", cn: "后背与大腿皮肤裂开数十道紫红色细长肉缝，镶嵌着能转动的恶鬼眼球" }
            ];

            comboRules.forEach(rule => {
                if (!rule.reg.test(s)) return;
                const matchScope =
                    (isHeadPart  && rule.scopes.includes("head")) ||
                    (isChestPart && rule.scopes.includes("chest")) ||
                    (isVagPart   && rule.scopes.includes("vag")) ||
                    (isWombBelly && rule.scopes.includes("womb")) ||
                    (isAnalRear  && rule.scopes.includes("anal")) ||
                    (isLegFoot   && rule.scopes.includes("leg")) ||
                    (isFullBody  && rule.scopes.includes("full"));
                if (!matchScope) return;
                enTags.add(rule.en);
                cnNotes.add(rule.cn);
                isMutated = true;
            });

            return {
                enTags: Array.from(enTags),
                cnNotes: Array.from(cnNotes),
                isMutated
            };
        }
```

  2. 接着往下看，找到 **`buildFullJsonApiPrompt`**、**`applyApiFullResponse`** 和 **`triggerSubApiUpdate`** 这三个连在一起的函数（从 `function buildFullJsonApiPrompt(u, c, rawText)` 开始，到 `async function triggerSubApiUpdate(btnEl = null) { ... }` 结束），把它们完整替换为下面这段**【支持弹窗自由勾选重绘模块 / 一键全量 37+ 按钮详细描述与内心独白重绘】**的代码：

```javascript
        function buildFullJsonApiPrompt(u, c, rawText, selectedBtnKeys = null) {
            const diff = getDifficultyProfile(), allRecentText = (safeCtx()?.chat || []).slice(-5).map(m => safeStr(m?.mes)).join("\n");
            const v = curVars, cnt = v.计数 || {}, sp = v.体内精液存量 || {}, wear = v.穿搭 || {};
            const curGender = detectProtagonistGender(u, v);

            const ALL_BTN_SCHEMA = {
                "身份与背景": "当前身份、种族形态与处境详述",
                "肉体外貌": "全身发色瞳色、眼睛数量、乳房数量、小穴数量、身材肤质与敏感度详述",
                "表里风评": "外界风评、社死曝光度与把柄详述",
                "挂牌身价": "风月估值与肉体身价详述",
                "内心独白": "当前敏感带、催眠钢印与深层心理剖析",
                "当前姿势": "此刻在正文中的具体肢体动作、跪坐姿态与体力实况",
                "cockLove": "对雄性阳具的渴望度与粘膜适应详述",
                "lust": "体内情欲燥热、荷尔蒙与发情分泌详述",
                "corr": "人格道德堕落与母畜化心理详述",
                "shame": "羞耻防线剩余程度与暴露反应详述",
                "obey": "意志顺从度与对指令的服从反应详述",
                "pleas": "神经快感累积与高潮临界反应详述",
                "精神沦陷": "脑实质催眠深度、常识改写与理智沦陷详述",
                "媚药毒瘾": "媚药与精液荷尔蒙成瘾及戒断反应详述",
                "骚口实况": "双唇、牙齿（如尖牙）、舌头（如长舌）、咽喉深处与口腔唾液/精液详述",
                "胸部实况": "乳房数量（如四乳/双乳）、罩杯形状、乳头乳晕色泽与泌乳/纺丝详述",
                "小穴实况": "小穴数量（如上下双穴/单穴）、阴唇色泽开合、阴道内壁肉褶与爱液/残精详述",
                "子宫实况": "子宫颈口软化开合、宫腔构造与内部储精晃荡详述",
                "阴蒂尿道": "阴蒂充血勃起尺寸与尿道口松弛漏尿失禁详述",
                "屁眼实况": "臀瓣、菊穴褶皱开合、直肠内壁与尾椎肉尾详述",
                "正字涂鸦": "体表正字记号、巴掌印鞭痕与羞辱涂鸦字迹详述",
                "淫纹烙印": "下腹催情淫纹发光发热与回路连接详述",
                "穿刺环饰": "乳头、阴蒂或阴唇穿刺金属环饰详述",
                "体内道具": "穴内塞入的震动道具或异物撑扩详述",
                "穿搭_头饰": "发型发色、面部眼睛数量（如四只眼）、眼镜/头饰与面部潮红表情详述",
                "穿搭_颈部": "脖颈、锁骨、项圈颈链与吻痕咬痕详述",
                "穿搭_胸罩": "胸衣内衬款式、多乳包裹/勒肉状态与乳尖凸起详述",
                "穿搭_上衣": "外衫上衣款式（如滑落卫衣/洛丽塔裙上身）与汗湿走光详述",
                "穿搭_内裤": "底裤款式（如开裆内裤/真空未穿）与腿心泥泞拉丝详述",
                "穿搭_下装": "裙摆/短裤款式、臀部包裹与掀裙走光详述",
                "穿搭_丝袜": "大腿小腿形态（或蛇尾/蛛腿）、丝袜款式与白浊滴落详述",
                "穿搭_鞋子": "双足/脚趾蜷缩状态与鞋履/赤足详述",
                "排卵周期": "卵巢排卵活性、发情周期与受孕率详述",
                "受精断面": "宫腔内卵子与精子游动结合或空置饥渴断面详述",
                "精液归属": "全身与四穴内精液残留同化详述",
                "孕肚进度": "小腹平坦或储精微隆/半透明肚皮内视详述",
                "破瓜纪念": "处女膜完好或破瓜贯穿档案详述",
                "六孔总账": "全身各孔穴开发经验总评详述",
                "高潮总账": "高潮、潮吹与失禁体质总评详述",
                "射精总账": "内射、吞精与泌乳体质总评详述",
                "露出总账": "露出、接客与凌辱经历总评详述"
            };

            const keysToGen = (Array.isArray(selectedBtnKeys) && selectedBtnKeys.length > 0)
                ? selectedBtnKeys.filter(k => ALL_BTN_SCHEMA[k])
                : Object.keys(ALL_BTN_SCHEMA);

            const btnSchemaJsonLines = keysToGen.map(k =>
                `    "${k}": { "stage": "4~8字状态短标签", "desc": "【🔬 ${k}实时详述】：（必须结合正文实际外貌特征如四只眼/四个奶/两个小穴与当前剧情，写出极度直白、色情、具象的视觉外观与生理描写，供生图直接调用）", "thought": "${u}关于此部位的第一人称实时内心独白..." }`
            ).join(",\n");

            return `[SYSTEM OVERRIDE: 纯粹JSON生成器，严禁输出任何Markdown代码块外的解释文字]
请严格根据下方最新小说正文实际发生在监控目标【${u}（当前识别性别：${curGender === "male" ? "男性male" : (curGender === "futa" ? "扶她futa" : "女性female")}｜当前提取外貌特征：${v.档案?.当前提取形象摘要 || "自动识别"}）】身上的真实剧情，实事求是地更新状态栏数值、全身8项穿搭，以及所选全部按钮的详细描述（desc）与第一人称内心独白（thought）！

⚠️【最高铁律】：
1. 必须严格按正文中【${u}】的真实身体特征（如：几只眼睛、几个乳房、几个小穴、什么衣服、什么种族形态）来写每个按钮的 "desc"，因为生图引擎会直接读取你写的 "desc" 去画图！
2. 严禁把不属于该部位的器官写进局部按钮（例如：不要在【骚口实况】或【穿搭_鞋子】里提乳房或小穴；在【穿搭_头饰】里必须写明发色发型和面部眼睛数量特征；在【胸部实况】里写明乳房数量和大小；在【小穴实况】里写明小穴数量和外观）！
3. 每个按钮的 "thought" 必须是鲜活、直白、充满角色活人感与当下情绪的第一人称内心独白！

【最新小说正文参考】：
${safeStr(allRecentText || rawText).slice(-3600)}

请直接输出合法的纯JSON对象：
{
  "当前认知名字": "${u}",
  "当前性别": "${curGender}",
  "身份与背景": "${safeStr(v.档案?.身份与背景).replace(/"/g, "'")}",
  "肉体外貌实况": "${safeStr(v.档案?.肉体外貌实况).replace(/"/g, "'")}",
  "生理周期阶段": "${safeStr(v.受孕与生理?.生理周期阶段, "正常生理期")}",
  "受孕概率": ${safeNum(v.受孕与生理?.受孕概率)},
  "体力": ${safeNum(v.身体?.体力, 100)},
  "对肉棒好感度": ${safeNum(v.核心数值?.对肉棒好感度)},
  "性欲程度": ${safeNum(v.核心数值?.性欲程度)},
  "淫乱恶堕": ${safeNum(v.核心数值?.淫乱恶堕)},
  "羞耻度": ${safeNum(v.精神与心理?.羞耻度, 100)},
  "服从度": ${safeNum(v.精神与心理?.服从度)},
  "沦陷度": ${safeNum(v.精神与心理?.沦陷度)},
  "快感累积": ${safeNum(v.精神与心理?.快感累积)},
  "口内毫升": ${safeNum(sp.口内毫升)},
  "小穴毫升": ${safeNum(sp.小穴毫升)},
  "子宫毫升": ${safeNum(sp.子宫毫升)},
  "屁眼毫升": ${safeNum(sp.屁眼毫升)},
  "体表痕迹": "${safeStr(v.痕迹与标记?.体表痕迹, "无").replace(/"/g, "'")}",
  "淫纹与刻印": "${safeStr(v.痕迹与标记?.淫纹与刻印, "无").replace(/"/g, "'")}",
  "穿刺与环饰": "${safeStr(v.痕迹与标记?.穿刺与环饰, "无").replace(/"/g, "'")}",
  "体内道具": "${safeStr(v.体内道具与权限?.体内道具, "无").replace(/"/g, "'")}",
  "穿搭": {
    "头饰与眼部": "${safeStr(wear.头饰与眼部, "发丝整洁").replace(/"/g, "'")}",
    "颈部与项圈": "${safeStr(wear.颈部与项圈, "脖颈自然").replace(/"/g, "'")}",
    "胸罩与裹胸": "${safeStr(wear.胸罩与裹胸, "贴身内衬").replace(/"/g, "'")}",
    "上衣与束腰": "${safeStr(wear.上衣与束腰, "日常上衣").replace(/"/g, "'")}",
    "内裤与遮挡": "${safeStr(wear.内裤与遮挡, "干净底裤").replace(/"/g, "'")}",
    "下装与裙裤": "${safeStr(wear.下装与裙裤, "日常下装").replace(/"/g, "'")}",
    "丝袜与腿部": "${safeStr(wear.丝袜与腿部, "双腿自然").replace(/"/g, "'")}",
    "鞋子与玉足": "${safeStr(wear.鞋子与玉足, "日常鞋履").replace(/"/g, "'")}"
  },
  "计数": {
    "口": ${safeNum(cnt.性交?.口)},
    "小穴": ${safeNum(cnt.性交?.小穴)},
    "屁眼": ${safeNum(cnt.性交?.屁眼)},
    "乳穴": ${safeNum(cnt.性交?.乳穴)},
    "足腿": ${safeNum(cnt.性交?.足腿)},
    "高潮": ${safeNum(cnt.高潮?.总数)},
    "强制高潮": ${safeNum(cnt.高潮?.强制)},
    "寸止": ${safeNum(cnt.高潮?.寸止)},
    "内射": ${safeNum(cnt.射精?.内射)},
    "颜射": ${safeNum(cnt.射精?.颜射体外)},
    "吞精次数": ${safeNum(cnt.精液摄入?.吞精次数)},
    "吞精毫升": ${safeNum(cnt.精液摄入?.累计毫升)},
    "喷乳次数": ${safeNum(cnt.泌乳?.喷乳次数)},
    "喷乳毫升": ${safeNum(cnt.泌乳?.累计毫升)},
    "自慰": ${safeNum(cnt.自慰)},
    "失禁": ${safeNum(cnt.失控?.失禁)},
    "喷潮": ${safeNum(cnt.失控?.喷潮)},
    "露出": ${safeNum(cnt.暴露?.露出)},
    "接客": ${safeNum(cnt.交易?.接客卖身)},
    "轮奸": ${safeNum(cnt.交易?.轮奸群交)},
    "睡奸": ${safeNum(cnt.交易?.睡眠昏迷奸)}
  },
  "当前姿势": "${safeStr(v.实况?.当前姿势, "身姿自然").replace(/"/g, "'")}",
  "内心独白": "${safeStr(v.实况?.内心独白, "").replace(/"/g, "'")}",
  "恩客图鉴": {},
  "按钮详情": {
${btnSchemaJsonLines}
  }
}`;
        }

        function applyApiFullResponse(replyText, targetMsg, fid, sourceLabel = "一键API", onlyClearSelectedKeys = null) {
            const data = repairAndParseJson(replyText);
            if (!data || typeof data !== "object") return false;
            pushUndoSnapshot(curVars);
            const v = normalizeVarsStructure(curVars);

            if (!v.档案.手动锁定真名 && data.当前认知名字 && isValidCharacterName(data.当前认知名字)) {
                v.档案.当前认知名字 = safeStr(data.当前认知名字).trim();
            }
            if (data.当前性别 && ["male", "female", "futa"].includes(String(data.当前性别).toLowerCase())) {
                v.档案.当前性别 = String(data.当前性别).toLowerCase();
            }
            if (data.身份与背景) v.档案.身份与背景 = safeStr(data.身份与背景);
            if (data.肉体外貌实况) v.档案.肉体外貌实况 = safeStr(data.肉体外貌实况);
            if (data.生理周期阶段) v.受孕与生理.生理周期阶段 = safeStr(data.生理周期阶段);
            if (typeof data.受孕概率 === "number") v.受孕与生理.受孕概率 = data.受孕概率;

            if (data.穿搭 && typeof data.穿搭 === "object") {
                v.穿搭 = { ...(v.穿搭 || {}), ...data.穿搭 };
            }

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

            const newTotalCnt = safeNum(v.计数.性交.小穴) + safeNum(v.计数.性交.口) + safeNum(v.计数.性交.屁眼) + safeNum(v.计数.射精.内射) + safeNum(v.计数.高潮.总数);
            if (newTotalCnt === 0 && safeNum(v.核心数值.淫乱恶堕) < 15) {
                v.历史最高崩坏度 = {};
            }

            calibrateMentalMetrics(v);
            if (typeof data.口内毫升 === "number") v.体内精液存量.口内毫升 = data.口内毫升;
            if (typeof data.小穴毫升 === "number") v.体内精液存量.小穴毫升 = data.小穴毫升;
            if (typeof data.子宫毫升 === "number") v.体内精液存量.子宫毫升 = data.子宫毫升;
            if (typeof data.屁眼毫升 === "number") v.体内精液存量.屁眼毫升 = data.屁眼毫升;
            if (data.当前姿势) v.实况.当前姿势 = safeStr(data.当前姿势);
            if (data.内心独白) v.实况.内心独白 = safeStr(data.内心独白);
            if (data.体表痕迹) v.痕迹与标记.体表痕迹 = safeStr(data.体表痕迹);
            if (data.淫纹与刻印) v.痕迹与标记.淫纹与刻印 = safeStr(data.淫纹与刻印);
            if (data.穿刺与环饰) v.痕迹与标记.穿刺与环饰 = safeStr(data.穿刺与环饰);
            if (data.体内道具) v.体内道具与权限.体内道具 = safeStr(data.体内道具);
            if (data.恩客图鉴 && typeof data.恩客图鉴 === "object") {
                v.恩客图鉴 = { ...(v.恩客图鉴 || {}), ...data.恩客图鉴 };
            }

            v.按钮详情 = v.按钮详情 || {};
            const keysToClear = Array.isArray(onlyClearSelectedKeys) ? onlyClearSelectedKeys : Object.keys(v.按钮详情);
            keysToClear.forEach(k => {
                if (userSettings.pinnedItems?.[k] || !v.按钮详情[k]) return;
                delete v.按钮详情[k].desc;
                delete v.按钮详情[k].thought;
                delete v.按钮详情[k].stage;
            });

            let updatedBtnCount = 0;
            if (data.按钮详情 && typeof data.按钮详情 === "object") {
                const isMaleNow = (detectProtagonistGender(detectProtagonistName(v), v) === "male");
                const FEMALE_ONLY_SET = new Set(["小穴实况", "子宫实况", "阴蒂尿道", "排卵周期", "受精断面", "孕肚进度", "破瓜纪念"]);
                Object.keys(data.按钮详情).forEach(k => {
                    if (userSettings.pinnedItems?.[k]) return;
                    if (isMaleNow && FEMALE_ONLY_SET.has(k)) return;
                    const itemData = data.按钮详情[k];
                    if (!itemData || typeof itemData !== "object") return;
                    const prev = v.按钮详情[k] || {};
                    v.按钮详情[k] = {
                        ...prev,
                        stage: safeStr(itemData.stage || prev.stage),
                        desc: safeStr(itemData.desc || prev.desc),
                        thought: safeStr(itemData.thought || prev.thought),
                        imgUrl: prev.imgUrl,
                        stageImgs: prev.stageImgs,
                        stageImgList: prev.stageImgList,
                        forceLatestImg: prev.forceLatestImg
                    };
                    updatedBtnCount++;
                });
            }

            const curLenNow = safeCtx()?.chat?.length || 0;
            v.手动总账基准楼层 = curLenNow;
            v.手动总账基准快照 = JSON.parse(JSON.stringify(v.计数));
            v.手动精液基准楼层 = curLenNow;
            v.手动精液基准快照 = JSON.parse(JSON.stringify(v.体内精液存量));

            _organDevCache = { sig: "", res: null };
            _appearMemoCache = { sig: "", res: null };
            _dynCtxCache = { sig: "", res: null };
            // 同步根据最新重绘的按钮描述刷新一次外貌DNA
            if (!v.档案?.手动锁死外貌Flag) {
                v.档案.锁定外貌DNA = "";
                getLockedAppearanceTags(detectProtagonistName(v), v);
            }
            saveChatCache(v);
            latestStatus = getFallbackData();
            renderBody();
            showToast(`✅ ${sourceLabel}完成！已同步刷新 ${updatedBtnCount} 个按钮的详细描述、内心独白与外貌DNA！`, "success", 3500);
            return true;
        }

        // ★ 升级：点击「🤖重绘」时弹出像「🎨全生图」一样的自选/全选交互窗口（自动重绘模式则直接后台全量重绘）
        async function executeBatchApiRedraw(selectedKeys, btnEl = null) {
            const ctx = safeCtx(), chat = ctx?.chat || [], fid = chat.length - 1, targetMsg = chat[fid], rawText = safeStr(targetMsg?.mes);
            const u = detectProtagonistName(curVars), c = ctx?.name2 || "角色", oldTxt = btnEl ? btnEl.textContent : "";
            if (btnEl) btnEl.textContent = "⏳ 重绘中...";

            // 如果勾选的按钮超过 14 个，自动拆分为 2 批并发/顺序请求，防止大模型单次输出 Token 截断漏掉后面的按钮！
            const chunkSize = 14;
            const chunks = [];
            for (let i = 0; i < selectedKeys.length; i += chunkSize) {
                chunks.push(selectedKeys.slice(i, i + chunkSize));
            }

            showToast(`⏳ 正在为【${u}】重绘所选的 ${selectedKeys.length} 个按钮详情与内心独白...`, "info", 4000);
            try {
                let anyOk = false;
                for (let idx = 0; idx < chunks.length; idx++) {
                    const subKeys = chunks[idx];
                    if (chunks.length > 1) {
                        showToast(`⏳ 正在重绘第 ${idx + 1}/${chunks.length} 批按钮 (${subKeys.length}项)...`, "info", 3000);
                    }
                    const { reply, source } = await callSubApiRaw("只输出标准 JSON 对象，严禁截断。", buildFullJsonApiPrompt(u, c, rawText, subKeys));
                    const ok = applyApiFullResponse(reply, targetMsg, fid, `${source}(${idx + 1}/${chunks.length})`, subKeys);
                    if (ok) anyOk = true;
                }
                if (btnEl) btnEl.textContent = anyOk ? "✅ 重绘成功" : "⚠️ 已修复";
            } catch (err) {
                if (btnEl) btnEl.textContent = "❌ 失败";
                showToast("❌ 一键API重绘失败：" + (err.message || "请检查设置中的副API地址与Key"), "error", 3800);
            }
            if (btnEl && oldTxt) setTimeout(() => { btnEl.textContent = oldTxt; }, 2500);
        }

        async function triggerSubApiUpdate(btnEl = null, silentAutoAll = false) {
            if (!checkCardAvailable(false)) return;
            if (!latestStatus) latestStatus = getFallbackData();
            const cats = latestStatus.categories || [];
            const allValidKeys = [];
            cats.forEach(cat => (cat.items || []).forEach(it => {
                if (it.editKey && !it.editKey.endsWith("_none") && !it.isClient && !it.editKey.startsWith("fetish_")) {
                    allValidKeys.push(it.editKey);
                }
            }));

            // 如果是每回合自动调用副API，直接静默重绘核心按钮
            if (silentAutoAll || !btnEl) {
                return await executeBatchApiRedraw(allValidKeys, btnEl);
            }

            const u = detectProtagonistName(curVars);
            let picker = document.getElementById("st-api-redraw-picker-modal");
            if (!picker) {
                picker = document.createElement("div");
                picker.id = "st-api-redraw-picker-modal";
                picker.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.84);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:12px;";
                document.body.appendChild(picker);
            }

            const selectedKeys = new Set(allValidKeys);

            const renderApiPicker = () => {
                const oldScrollEl = picker.querySelector("#st-apipk-scroll");
                const savedTop = oldScrollEl ? oldScrollEl.scrollTop : 0;

                const groupsHtml = cats.map(cat => {
                    const validItems = (cat.items || []).filter(it => it.editKey && !it.editKey.endsWith("_none") && !it.isClient && !it.editKey.startsWith("fetish_"));
                    if (!validItems.length) return "";
                    return `
                        <div style="margin-bottom:9px;background:rgba(0,0,0,0.38);border:1px solid rgba(103,232,249,0.28);border-radius:10px;padding:8px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                <span style="font-size:12px;color:#fde047;font-weight:bold;">${cat.icon} ${cat.title}</span>
                                <button type="button" class="st-apipk-sel-cat" data-cat="${cat.title}" style="background:rgba(255,255,255,0.12);color:#67e8f9;border:1px solid #67e8f9;border-radius:6px;padding:1px 8px;font-size:10.5px;cursor:pointer;">全选/反选本组</button>
                            </div>
                            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;">
                                ${validItems.map(it => {
                                    const isSel = selectedKeys.has(it.editKey);
                                    const shortTitle = String(it.cleanTitle || it.editKey).split(/[：:「（(]/)[0].trim();
                                    return `<button type="button" class="st-apipk-item" data-key="${it.editKey}" style="background:${isSel ? 'linear-gradient(135deg,#06b6d4,#3b82f6)' : 'rgba(255,255,255,0.08)'};color:${isSel ? '#fff' : '#cbd5e1'};border:1.5px solid ${isSel ? '#fde047' : 'rgba(255,255,255,0.15)'};border-radius:8px;padding:6px 4px;font-size:11px;font-weight:${isSel ? 'bold' : 'normal'};cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${isSel ? "✅ " : ""}${shortTitle}</button>`;
                                }).join("")}
                            </div>
                        </div>
                    `;
                }).join("");

                picker.innerHTML = `
                    <div style="background:linear-gradient(160deg,#152238,#090d16);border:2px solid #67e8f9;border-radius:16px;padding:14px;width:94vw;max-width:480px;max-height:86vh;display:flex;flex-direction:column;color:#fff;box-shadow:0 20px 60px #000;">
                        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:8px;margin-bottom:8px;">
                            <div>
                                <div style="font-size:14px;font-weight:bold;color:#67e8f9;">🤖 选择需要 API 重绘详情与内心独白的按钮 (${u})</div>
                                <div style="font-size:10.5px;color:#cbd5e1;">重绘后将更新所选按钮的详细描述与心声，生图时直接按新描述生图！</div>
                            </div>
                            <button id="st-apipk-close" type="button" style="background:#ff003c;color:#fff;border:none;border-radius:8px;padding:4px 10px;font-weight:bold;cursor:pointer;">✕</button>
                        </div>
                        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">
                            <button type="button" id="st-apipk-all" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#fde047;border-color:#fde047;">🌟 全选全部按钮 (${allValidKeys.length}项)</button>
                            <button type="button" id="st-apipk-curcat" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#67e8f9;">📌 只选当前分类</button>
                            <button type="button" id="st-apipk-6holes" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#fda4af;">🌸 只选档案+六孔</button>
                            <button type="button" id="st-apipk-wear" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#a6e3a1;">👗 只选穿搭8项</button>
                            <button type="button" id="st-apipk-clear" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#94a3b8;">🧹 清空勾选</button>
                        </div>
                        <div id="st-apipk-scroll" style="flex:1;overflow-y:auto;padding-right:2px;">${groupsHtml}</div>
                        <div style="padding-top:10px;border-top:1px solid rgba(255,255,255,0.15);display:flex;justify-content:space-between;align-items:center;gap:8px;">
                            <span style="font-size:12px;color:#a6e3a1;font-weight:bold;">已选：<b style="color:#fde047;font-size:14px;">${selectedKeys.size}</b> 项</span>
                            <div style="display:flex;gap:6px;">
                                <button type="button" id="st-apipk-run-all-now" style="background:linear-gradient(135deg,#f59e0b,#ec4899);color:#fff;border:none;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:bold;cursor:pointer;">🔥 一键全部重绘</button>
                                <button type="button" id="st-apipk-run-sel" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">🚀 重绘勾选 (${selectedKeys.size}项)</button>
                            </div>
                        </div>
                    </div>
                `;
                const newScrollEl = picker.querySelector("#st-apipk-scroll");
                if (newScrollEl) newScrollEl.scrollTop = savedTop;

                picker.querySelector("#st-apipk-close").onclick = () => { picker.style.display = "none"; };
                picker.onclick = (e) => { if (e.target === picker) picker.style.display = "none"; };

                picker.querySelectorAll(".st-apipk-item").forEach(b => {
                    b.onclick = () => {
                        const k = b.getAttribute("data-key");
                        if (selectedKeys.has(k)) selectedKeys.delete(k); else selectedKeys.add(k);
                        renderApiPicker();
                    };
                });
                picker.querySelectorAll(".st-apipk-sel-cat").forEach(b => {
                    b.onclick = () => {
                        const cTitle = b.getAttribute("data-cat");
                        const targetCat = cats.find(c => c.title === cTitle);
                        if (!targetCat) return;
                        const keys = (targetCat.items || []).map(it => it.editKey).filter(k => k && !k.endsWith("_none") && !k.startsWith("client_") && !k.startsWith("fetish_"));
                        const allIn = keys.every(k => selectedKeys.has(k));
                        keys.forEach(k => { if (allIn) selectedKeys.delete(k); else selectedKeys.add(k); });
                        renderApiPicker();
                    };
                });
                picker.querySelector("#st-apipk-all").onclick = () => { allValidKeys.forEach(k => selectedKeys.add(k)); renderApiPicker(); };
                picker.querySelector("#st-apipk-curcat").onclick = () => {
                    selectedKeys.clear();
                    const curC = cats.find(c => c.title === activeCat) || cats[0];
                    (curC?.items || []).forEach(it => { if (allValidKeys.includes(it.editKey)) selectedKeys.add(it.editKey); });
                    renderApiPicker();
                };
                picker.querySelector("#st-apipk-6holes").onclick = () => {
                    selectedKeys.clear();
                    ["身份与背景", "肉体外貌", "当前姿势", "内心独白", "骚口实况", "胸部实况", "小穴实况", "子宫实况", "阴蒂尿道", "屁眼实况"].forEach(k => selectedKeys.add(k));
                    renderApiPicker();
                };
                picker.querySelector("#st-apipk-wear").onclick = () => {
                    selectedKeys.clear();
                    ["穿搭_头饰", "穿搭_颈部", "穿搭_胸罩", "穿搭_上衣", "穿搭_内裤", "穿搭_下装", "穿搭_丝袜", "穿搭_鞋子"].forEach(k => selectedKeys.add(k));
                    renderApiPicker();
                };
                picker.querySelector("#st-apipk-clear").onclick = () => { selectedKeys.clear(); renderApiPicker(); };

                picker.querySelector("#st-apipk-run-all-now").onclick = () => {
                    picker.style.display = "none";
                    executeBatchApiRedraw(allValidKeys, btnEl);
                };
                picker.querySelector("#st-apipk-run-sel").onclick = () => {
                    if (!selectedKeys.size) { showToast("⚠️ 请至少勾选 1 个要重绘的按钮！", "warn"); return; }
                    picker.style.display = "none";
                    executeBatchApiRedraw(Array.from(selectedKeys), btnEl);
                };
            };

            renderApiPicker();
            picker.style.display = "flex";
        }

        async function fetchModelList(btnEl, selectEl, inputEl) {
            const rawUrl = inputEl ? inputEl.value.trim() : userSettings.apiUrl, apiKey = document.getElementById("st-api-key")?.value.trim() || userSettings.apiKey;
            const { modelsUrl } = getNormalizedEndpoints(rawUrl);
            if (!modelsUrl) { showToast("⚠️ 请先填写有效的 API 地址！", "error"); return; }
            if (btnEl) btnEl.textContent = "⏳ 拉取中...";
            try {
                const headers = { "Accept": "application/json" };
                if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
                const res = await fetch(modelsUrl, { method: "GET", headers }), data = JSON.parse(await res.text());
                const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.models) ? data.models : []);
                const ids = list.map(m => typeof m === "string" ? m : (m?.id || m?.name || "")).filter(Boolean);
                if (!ids.length) throw new Error("未找到模型");
                userSettings.modelList = ids;
                if (!userSettings.apiModel || !ids.includes(userSettings.apiModel)) userSettings.apiModel = ids[0];
                saveSettings();
                if (selectEl) { selectEl.innerHTML = ids.map(id => `<option value="${id}" ${id === userSettings.apiModel ? "selected" : ""}>${id}</option>`).join(""); selectEl.style.display = "block"; }
                const modInput = document.getElementById("st-api-mod"); if (modInput) modInput.value = userSettings.apiModel;
                if (btnEl) btnEl.textContent = `✅ 已拉取(${ids.length})`;
            } catch (err) { if (btnEl) btnEl.textContent = "❌ 失败"; showToast("❌ 拉取失败：" + err.message, "error"); }
        }

        // =========================================================================
        // 💾 通用下载器 + ⭐ 永恒收藏夹 + 📸 本局抓拍双保险引擎
        // =========================================================================
        let pendingZhjTarget = null;
        const capturedZhjSrcSet = new Set();

        function getImgFingerprint(src) {
            const s = String(src || "").trim();
            if (s.length <= 160) return s;
            return s.slice(0, 64) + "_" + s.length + "_" + s.slice(-64);
        }

        async function downloadImageToDevice(imgSrc, suggestedName = "状态栏美图") {
            if (!imgSrc) { showToast("⚠️ 当前没有可下载的图片！", "warn", 2500); return; }
            const cleanFileName = String(suggestedName || "状态栏配图").replace(/[\\/:*?"<>|\s]+/g, "_");
            try {
                let finalHref = imgSrc, ext = "webp";
                if (imgSrc.startsWith("data:image/png")) ext = "png";
                else if (imgSrc.startsWith("data:image/jpeg") || imgSrc.startsWith("data:image/jpg")) ext = "jpg";
                else if (imgSrc.startsWith("data:image/gif")) ext = "gif";
                if (!imgSrc.startsWith("data:")) {
                    const resp = await fetch(imgSrc);
                    const blob = await resp.blob();
                    if (blob.type.includes("png")) ext = "png";
                    else if (blob.type.includes("jpeg") || blob.type.includes("jpg")) ext = "jpg";
                    else if (blob.type.includes("gif")) ext = "gif";
                    finalHref = URL.createObjectURL(blob);
                }
                const a = document.createElement("a");
                a.href = finalHref;
                a.download = `${cleanFileName}.${ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                if (finalHref !== imgSrc && finalHref.startsWith("blob:")) setTimeout(() => URL.revokeObjectURL(finalHref), 4000);
                showToast(`💾 图片【${cleanFileName}.${ext}】已开始下载保存！`, "success", 3000);
            } catch (err) {
                window.open(imgSrc, "_blank");
                showToast("📱 已为您打开原图，长按图片即可选择【保存到手机相册】！", "info", 3800);
            }
        }

        function isImageFavorited(imgSrc) {
            if (!imgSrc || !Array.isArray(userSettings.favoriteGallery)) return false;
            const fp = getImgFingerprint(imgSrc);
            return userSettings.favoriteGallery.some(f => f.fp === fp || f.src === imgSrc || queryImportedImage(f.dbKey) === imgSrc);
        }

        async function toggleFavoriteImage(imgSrc, meta = {}) {
            if (!imgSrc) { showToast("⚠️ 当前还没有可收藏的图片！", "warn", 2500); return false; }
            userSettings.favoriteGallery = Array.isArray(userSettings.favoriteGallery) ? userSettings.favoriteGallery : [];
            const fp = getImgFingerprint(imgSrc);
            const existIdx = userSettings.favoriteGallery.findIndex(f => f.fp === fp || f.src === imgSrc || f.dbKey === imgSrc);

            if (existIdx >= 0) {
                const removed = userSettings.favoriteGallery.splice(existIdx, 1)[0];
                if (removed?.dbKey) {
                    try {
                        const db = await openImageDB();
                        const tx = db.transaction(IDB_STORE, "readwrite");
                        tx.objectStore(IDB_STORE).delete(removed.dbKey);
                        importedImgCache.delete(removed.dbKey);
                    } catch (e) {}
                }
                saveSettings();
                showToast("🗑️ 已从【⭐永恒收藏夹】中移除该图片", "info", 2400);
                return false;
            } else {
                let dataUrlToSave = imgSrc;
                if (!dataUrlToSave.startsWith("data:")) {
                    try {
                        const resp = await fetch(imgSrc);
                        const blob = await resp.blob();
                        dataUrlToSave = await blobToDataUrl(blob, "fav.webp");
                    } catch (e) {}
                }
                const dbKey = normalizeImgKey(`fav_img_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
                await rawSaveDataUrlToDB(dbKey, dataUrlToSave).catch(() => {});
                const u = meta.charName || detectProtagonistName(curVars) || "角色";
                const editKey = meta.editKey || "当前姿势";
                const stageIdx = meta.stageIdx || getRealStageByKey(editKey, curVars) || 1;
                userSettings.favoriteGallery.unshift({
                    id: "fav_" + Date.now(),
                    dbKey,
                    fp: getImgFingerprint(dataUrlToSave),
                    src: dbKey,
                    charName: u,
                    title: meta.title || `${u} · ${editKey} (第${stageIdx}阶)`,
                    note: meta.note || "",
                    pinned: false,
                    editKey,
                    stageIdx,
                    corr: meta.corr ?? safeNum(curVars.核心数值?.淫乱恶堕, 0),
                    time: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
                    quote: meta.quote || generateLiveASMRQuote(curVars, u).slice(0, 46)
                });
                saveSettings();
                showToast("⭐ 已加入【永恒收藏夹】！即使删除聊天或清空配图也会永久保留！", "success", 3200);
                return true;
            }
        }

        // ✅ 升级版：支持第 4 参数 exactEditKey，且扩容至 120 张防止早期低阶图被误删！
        function recordToCgGallery(title, imgSrc, stageIdx = null, exactEditKey = null) {
            if (!imgSrc) return;
            const fp = getImgFingerprint(imgSrc);
            capturedZhjSrcSet.add(imgSrc);
            capturedZhjSrcSet.add(fp);

            curVars.专属相册 = Array.isArray(curVars.专属相册) ? curVars.专属相册 : [];
            const gal = curVars.专属相册;

            const cgDbKey = normalizeImgKey(`cg_snap_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
            if (imgSrc.startsWith("data:")) {
                rawSaveDataUrlToDB(cgDbKey, imgSrc).catch(() => {});
                importedImgCache.set(cgDbKey, imgSrc);
            }

            const u = detectProtagonistName(curVars) || "角色";
            const curFullDnaForGal = getLockedAppearanceTags(u, curVars);
            const corr = safeNum(curVars.核心数值?.淫乱恶堕, 0);
            const cleanTitle = String(title || "当前姿势").replace(/^[^a-zA-Z0-9\u4e00-\u9fa5]+/, "").trim();
            const finalEditKey = exactEditKey || cleanTitle;
            const realStg = stageIdx || getRealStageByKey(finalEditKey, curVars) || 1;

            const existIdx = gal.findIndex(g => g.fp === fp || g.src === imgSrc);
            if (existIdx >= 0) gal.splice(existIdx, 1);

            gal.unshift({
                id: "cg_" + Date.now(),
                dbKey: cgDbKey,
                fp,
                title: `${u} · ${cleanTitle}`,
                editKey: finalEditKey,
                stageIdx: realStg,
                speciesSig: getSpeciesSignatureFromDna(curFullDnaForGal),
                src: imgSrc.startsWith("data:") ? cgDbKey : imgSrc,
                corr,
                time: new Date().toLocaleTimeString(),
                quote: generateLiveASMRQuote(curVars, u).slice(0, 42)
            });

            if (gal.length > 120) gal.pop();
            userSettings.cgGallery = gal;
            saveSettings();
            saveChatCache(curVars);
        }

        function scanChatImagesForZhiHuiJi() {
            if (!userSettings.enabled || !userSettings.zhjAutoCapture || isGeneratingImageBusy || (Date.now() - lastImageGenFinishTime < 3000)) return;
            const chatEl = document.getElementById("chat");
            if (!chatEl) return;
            const recentMesList = Array.from(chatEl.querySelectorAll(".mes")).slice(-3);
            const imgs = [];
            recentMesList.forEach(m => imgs.push(...m.querySelectorAll(".mes_text img")));
            if (!imgs.length) return;
            const validImgs = Array.from(imgs).filter(img => {
                const src = img.getAttribute("src") || "";
                if (!src || src.includes("avatar") || src.includes("emoji") || src.includes("icon") || src.includes("loading") || src.includes("spinner")) return false;
                if (img.closest(".st-zhj-parasite-box")) return false;
                if (img.naturalWidth > 0 && img.naturalWidth < 90) return false;
                const fp = getImgFingerprint(src);
                return !capturedZhjSrcSet.has(src) && !capturedZhjSrcSet.has(fp);
            });
            if (!validImgs.length) return;
            const latestImg = validImgs[validImgs.length - 1];
            const src = latestImg.getAttribute("src") || latestImg.src;
            if (!src) return;
            capturedZhjSrcSet.add(src);
            capturedZhjSrcSet.add(getImgFingerprint(src));

            let targetKey = null, targetStageKey = null, targetStageIdx = 1, isCustom = false, catTitle = "";
            if (pendingZhjTarget && (Date.now() - pendingZhjTarget.ts < 180000)) {
                targetKey = pendingZhjTarget.editKey;
                targetStageKey = pendingZhjTarget.stageKey;
                targetStageIdx = pendingZhjTarget.stageIdx || 1;
                isCustom = pendingZhjTarget.isCustom;
                catTitle = pendingZhjTarget.catTitle;
                pendingZhjTarget = null;
            } else {
                const nearTxt = `${safeStr(latestImg.getAttribute("alt"))} ${safeStr(latestImg.getAttribute("title"))} ${safeStr(latestImg.previousSibling?.textContent).slice(-120)}`;
                if (!/纯局部|第[一二三四五六1-6]阶段：|特写_|实况/.test(nearTxt)) return;

                const matchMap = [
                    { k: "排卵周期", reg: /排卵周期|卵巢异变/i },
                    { k: "受精断面", reg: /受精断面/i },
                    { k: "精液归属", reg: /精液归属|白浊同化/i },
                    { k: "孕肚进度", reg: /孕肚进度|孕肚孵化巢/i },
                    { k: "穿搭_内裤", reg: /穿搭_内裤|底裤与私处/i },
                    { k: "穿搭_头饰", reg: /穿搭_头饰|头部与面容/i },
                    { k: "穿搭_颈部", reg: /穿搭_颈部|脖颈与锁骨/i },
                    { k: "穿搭_胸罩", reg: /穿搭_胸罩|胸衣与内衬/i },
                    { k: "穿搭_上衣", reg: /穿搭_上衣|上衣与外衫/i },
                    { k: "穿搭_下装", reg: /穿搭_下装|裙裤与臀部/i },
                    { k: "穿搭_丝袜", reg: /穿搭_丝袜|丝袜与双腿/i },
                    { k: "穿搭_鞋子", reg: /穿搭_鞋子|鞋履与玉足/i },
                    { k: "正字涂鸦", reg: /正字涂鸦/i },
                    { k: "淫纹烙印", reg: /淫纹烙印/i },
                    { k: "穿刺环饰", reg: /穿刺环饰/i },
                    { k: "体内道具", reg: /体内道具/i },
                    { k: "小穴实况", reg: /小穴实况|小穴/i },
                    { k: "子宫实况", reg: /子宫实况|子宫/i },
                    { k: "骚口实况", reg: /骚口实况|骚口/i },
                    { k: "胸部实况", reg: /胸部实况|丰乳/i },
                    { k: "屁眼实况", reg: /屁眼实况|屁眼/i },
                    { k: "阴蒂尿道", reg: /阴蒂尿道/i },
                    { k: "当前姿势", reg: /当前姿势|实时交合姿势/i }
                ];
                for (const m of matchMap) {
                    if (m.reg.test(nearTxt)) { targetKey = m.k; break; }
                }
                if (!targetKey) return;
                targetStageIdx = getRealStageByKey(targetKey, curVars);
                targetStageKey = getProtagScopedImgKey(targetKey, targetStageIdx);
            }

            if (targetKey) {
                const normKey = normalizeImgKey(targetStageKey);
                if (src.startsWith("data:")) {
                    rawSaveDataUrlToDB(normKey, src).catch(() => {});
                    importedImgCache.set(normKey, src);
                }
                const refVal = src.startsWith("data:") ? normKey : src;
                if (isCustom && catTitle) {
                    const found = (curVars.自定义条目?.[catTitle] || []).find(x => x.id === targetKey);
                    if (found) found.imgUrl = refVal;
                } else {
                    curVars.按钮详情 = curVars.按钮详情 || {};
                    const prev = curVars.按钮详情[targetKey] || {};
                    const prevList = Array.isArray(prev.stageImgList?.[targetStageIdx]) ? prev.stageImgList[targetStageIdx] : [];
                    curVars.按钮详情[targetKey] = {
                        ...prev,
                        imgUrl: refVal,
                        forceLatestImg: refVal,
                        stageImgs: { ...(prev.stageImgs || {}), [targetStageIdx]: refVal },
                        stageImgList: { ...(prev.stageImgList || {}), [targetStageIdx]: [refVal, ...prevList.filter(x => x !== refVal)] }
                    };
                }
                recordToCgGallery(targetKey, src, targetStageIdx, targetKey);
                const curLenNow = safeCtx()?.chat?.length || 0;
                if (!isGeneratingImageBusy && !(curVars._lastImgGenKey === targetKey && curVars._lastImgGenFloor === curLenNow)) {
                    registerImageToReusablePool(targetKey, targetStageIdx, src, detectProtagonistName(curVars)).catch(() => {});
                }
                saveChatCache(curVars);
                latestStatus = getFallbackData();
                renderBody();
                showToast(`🖼️ 已自动捕获新生成图片并挂载至【${targetKey} (第${targetStageIdx}阶)】！`, "success", 3000);
            }
        }

        function getInitialLv1ImageCandidates(editKey) {
            if (!editKey || !HAS_ORIGINAL_DEFAULT_IMG.has(editKey)) return [];
            const baseFolder = `${PLUGIN_BASE_PATH}/images`, cands = [];
            const fh = queryImportedImage(`${editKey}_1`) || (dbKeyIndexSet.has(normalizeImgKey(`${editKey}_1`)) ? `${editKey}_1` : "");
            if (fh) cands.push(fh);
            const hg = queryImportedImage(editKey) || (dbKeyIndexSet.has(normalizeImgKey(editKey)) ? editKey : "");
            if (hg && !cands.includes(hg)) cands.push(hg);
            cands.push(
                `${baseFolder}/${editKey}_1.webp`,
                `${baseFolder}/${editKey}_1.png`,
                `${baseFolder}/${editKey}_1.jpg`,
                `${baseFolder}/${editKey}.webp`,
                `${baseFolder}/${editKey}.png`
            );
            return [...new Set(cands)];
        }

        function findGalleryImgForItem(item, targetStageNum = null) {
            if (!item || !item.editKey) return "";
            const key = String(item.editKey).trim();
            const u = detectProtagonistName(curVars) || "角色";
            const curSpeciesSigNow = getSpeciesSignatureFromDna(getLockedAppearanceTags(u, curVars));

            const KEY_TO_WORDS = {
                "排卵周期": ["排卵周期", "卵巢异变", "卵巢"],
                "受精断面": ["受精断面", "宫腔受精"],
                "精液归属": ["精液归属", "白浊同化", "白浊"],
                "孕肚进度": ["孕肚进度", "孕肚孵化巢", "孕肚"],
                "正字涂鸦": ["正字涂鸦", "涂鸦与烙痕", "正字"],
                "淫纹烙印": ["淫纹烙印", "淫纹与魔蚀", "淫纹"],
                "穿刺环饰": ["穿刺环饰", "穿刺铁牢", "穿刺"],
                "体内道具": ["体内道具", "机械填塞"],
                "骚口实况": ["骚口实况", "骚口"],
                "胸部实况": ["胸部实况", "丰乳"],
                "小穴实况": ["小穴实况", "小穴"],
                "子宫实况": ["子宫实况", "子宫"],
                "阴蒂尿道": ["阴蒂尿道", "阴蒂与尿道", "阴蒂"],
                "屁眼实况": ["屁眼实况", "屁眼"],
                "穿搭_头饰": ["穿搭_头饰", "头部与面容", "头饰面容", "头饰"],
                "穿搭_颈部": ["穿搭_颈部", "脖颈与锁骨", "脖颈锁骨", "脖颈"],
                "穿搭_胸罩": ["穿搭_胸罩", "胸衣与内衬", "胸衣内衬", "胸衣"],
                "穿搭_上衣": ["穿搭_上衣", "上衣与外衫", "上衣外衫", "上衣"],
                "穿搭_内裤": ["穿搭_内裤", "底裤与私处", "底裤私处", "底裤"],
                "穿搭_下装": ["穿搭_下装", "裙裤与臀部", "裙裤臀部", "裙裤"],
                "穿搭_丝袜": ["穿搭_丝袜", "丝袜与双腿", "丝袜双腿", "丝袜"],
                "穿搭_鞋子": ["穿搭_鞋子", "鞋履与玉足", "鞋履玉足", "鞋履"],
                "身份与背景": ["身份与背景", "监控目标与身份", "监控身份"],
                "肉体外貌": ["肉体外貌", "肉体敏感与雌臭", "肉体敏感与畸变", "肉体敏感"],
                "表里风评": ["表里风评", "社死曝光", "社死风评"],
                "挂牌身价": ["挂牌身价"],
                "内心独白": ["内心独白"],
                "当前姿势": ["当前姿势", "姿势与躯体机能", "实时交合姿势"],
                "cockLove": ["cockLove", "阳具烙印"],
                "lust": ["lust", "发情中枢"],
                "corr": ["corr", "人格崩坏"],
                "shame": ["shame", "羞耻防线"],
                "obey": ["obey", "意志切除"],
                "pleas": ["pleas", "脑髓熔断"],
                "精神沦陷": ["精神沦陷", "脑实质沦陷"],
                "媚药毒瘾": ["媚药毒瘾", "脑脊液毒瘾"],
                "破瓜纪念": ["破瓜纪念"],
                "六孔总账": ["六孔总账", "性交总账"],
                "高潮总账": ["高潮总账", "高潮与失禁"],
                "射精总账": ["射精总账", "射精与泌乳"],
                "露出总账": ["露出总账", "接客与轮奸"]
            };

            const matchWords = KEY_TO_WORDS[key] ? [...KEY_TO_WORDS[key]] : [key];
            if (item.clientName) matchWords.push(item.clientName);
            if (key.startsWith("fetish_")) matchWords.push(key.replace("fetish_", ""));

            const uNoSpace = u.replace(/\s+/g, "");
            const currentChatAlbum = Array.isArray(curVars.专属相册) ? curVars.专属相册 : [];

            let fallbackLowStageSrc = "";

            for (const g of currentChatAlbum) {
                if (!g) continue;
                // ★ 物种形态隔离锁：如果相册里的这张图是在之前的其他物种形态下生成的（如百目鬼 vs 普通人类），绝不跨形态调用！
                if (g.speciesSig && g.speciesSig !== curSpeciesSigNow) continue;
                const cleanTitleNoSpace = String(g.title || "").replace(/\s+/g, "");
                if (cleanTitleNoSpace.includes("·") && !cleanTitleNoSpace.includes(uNoSpace)) continue;

                const gLabel = `${g.editKey || ""} ${g.title || ""} ${g.note || ""}`;
                const isExactKey = (g.editKey && g.editKey === key);
                const isWordHit = matchWords.some(w => w && gLabel.includes(w));
                if (isExactKey || isWordHit) {
                    const realSrc = g.diskPath || queryImportedImage(g.dbKey) || queryImportedImage(g.src) || g.src;
                    if (!realSrc || (!realSrc.startsWith("data:") && !realSrc.startsWith("http") && !realSrc.startsWith("blob:") && !realSrc.startsWith("/"))) continue;

                    const gStg = Number(g.stageIdx) || 0;
                    if (targetStageNum !== null) {
                        if (gStg === targetStageNum) return realSrc;
                        if (gStg === 0 && targetStageNum >= 3) return realSrc;
                        if (gStg > 0 && gStg < targetStageNum && !fallbackLowStageSrc) fallbackLowStageSrc = realSrc;
                    } else {
                        return realSrc;
                    }
                }
            }
            return fallbackLowStageSrc;
        }

        // =========================================================================
        // 🧬 终极版：四维图像DNA与阶位匹配引擎（根治跨档串味、新档冒精液图、阶位错标！）
        // =========================================================================

        // 🌸 第一层：纯微观解剖/局部器官（无脸、无头发、无衣服款式，任何角色达标对应阶位即可通用）
        const UNIVERSAL_LOCAL_PARTS = new Set([
            "骚口实况", "胸部实况", "小穴实况", "子宫实况", "阴蒂尿道", "屁眼实况",
            "排卵周期", "受精断面", "精液归属", "孕肚进度",
            "正字涂鸦", "淫纹烙印", "穿刺环饰", "体内道具"
        ]);

        // 👗 第二层子集：无头局部穿搭 7 项（生图时不含头发与脸，只需肤色+服装款式兼容+阶位一致即可复用）
        const HEADLESS_WEAR_PARTS = new Set([
            "穿搭_颈部", "穿搭_胸罩", "穿搭_上衣", "穿搭_内裤", "穿搭_下装", "穿搭_丝袜", "穿搭_鞋子"
        ]);    

        function getItemRealStageNum(item, v = curVars) {
            if (!item) return 1;
            const key = String(item.editKey || item || "");
            const isRev = (key === "shame" || key === "sta" || key === "当前姿势");

            if (key && v?.上帝强制锁定 && typeof v.上帝强制锁定[key] === "number") {
                return tier6(Number(v.上帝强制锁定[key]), isRev) + 1;
            }

            if (userSettings.personaMode === "contrast" && !userSettings.contrastInnerActive && safeNum(userSettings.clothDurability, 100) >= 70) {
                if (["穿搭_头饰", "穿搭_颈部", "穿搭_上衣", "穿搭_下装", "穿搭_鞋子"].includes(key)) {
                    return safeNum(v?.核心数值?.性欲程度, 0) >= 60 ? 2 : 1;
                }
            }

            const sp = v?.体内精液存量 || {};
            const mouthMl = safeNum(sp.口内毫升);
            const vagMl = safeNum(sp.小穴毫升);
            const wombMl = safeNum(sp.子宫毫升);
            const analMl = safeNum(sp.屁眼毫升);
            const lowerMl = vagMl + wombMl + analMl;
            const totalMl = mouthMl + lowerMl;

            const corr = safeNum(v?.核心数值?.淫乱恶堕, 0);
            const lust = safeNum(v?.核心数值?.性欲程度, 0);
            const pleas = safeNum(v?.精神与心理?.快感累积, 0);
            const durDrop = 100 - safeNum(userSettings.clothDurability, 100);
            const c = v?.计数 || {};
            const facialCnt = safeNum(c.射精?.颜射体外);
            const totalSexActs = safeNum(c.性交?.小穴) + safeNum(c.性交?.口) + safeNum(c.性交?.屁眼) + safeNum(c.性交?.乳穴) + safeNum(c.性交?.足腿) + safeNum(c.性交?.兽交异种) + safeNum(c.射精?.内射) + safeNum(c.精液摄入?.吞精次数) + safeNum(c.失控?.失禁) + safeNum(c.失控?.喷潮);

            const calcFloorByMl = (mlVal, actCnt, includeDur = false) => {
                const effDur = includeDur ? durDrop : 0;
                if (mlVal >= 100 || corr >= 60 || effDur >= 60) return 4;
                if (mlVal >= 30  || corr >= 40 || effDur >= 35) return 3;
                if (mlVal > 0    || corr >= 20 || effDur >= 15 || actCnt > 0) return 2;
                return 1;
            };

            const STRICT_OWN_PCT_KEYS = new Set([
                "正字涂鸦", "淫纹烙印", "穿刺环饰", "体内道具",
                "骚口实况", "胸部实况", "小穴实况", "子宫实况", "阴蒂尿道", "屁眼实况",
                "排卵周期", "受精断面", "精液归属", "孕肚进度",
                "cockLove", "lust", "corr", "shame", "obey", "pleas", "精神沦陷", "媚药毒瘾",
                "表里风评", "肉体外貌", "当前姿势"
            ]);

            if (typeof item === "object" && item.pct !== null && item.pct !== undefined && !Number.isNaN(Number(item.pct))) {
                const baseStg = tier6(Number(item.pct), isRev) + 1;
                if (STRICT_OWN_PCT_KEYS.has(key) || key.startsWith("fetish_") || key.startsWith("client_")) {
                    return baseStg;
                }
            }

            if (totalMl === 0 && totalSexActs === 0 && corr < 15 && durDrop <= 15) {
                return 1;
            }

            let partDirtyFloor = 1;
            if (key === "穿搭_头饰" || key === "穿搭_颈部" || key === "内心独白") {
                partDirtyFloor = calcFloorByMl(mouthMl, safeNum(c.精液摄入?.吞精次数) + safeNum(c.性交?.口) + facialCnt, false);
            } else if (key === "穿搭_胸罩" || key === "穿搭_上衣") {
                partDirtyFloor = calcFloorByMl(0, safeNum(c.性交?.乳穴) + safeNum(c.泌乳?.喷乳次数) + facialCnt, true);
            } else if (key === "穿搭_内裤" || key === "穿搭_下装" || key === "穿搭_丝袜" || key === "穿搭_鞋子") {
                partDirtyFloor = calcFloorByMl(lowerMl, safeNum(c.射精?.内射) + safeNum(c.失控?.失禁), true);
            } else {
                partDirtyFloor = calcFloorByMl(totalMl, totalSexActs, true);
            }

            if (typeof item === "object" && item.pct !== null && item.pct !== undefined && !Number.isNaN(Number(item.pct))) {
                const baseStg = tier6(Number(item.pct), isRev) + 1;
                if (key.startsWith("穿搭_")) {
                    if (key === "穿搭_头饰" || key === "穿搭_颈部") {
                        const headScore = Math.max(corr, mouthMl >= 50 ? 68 : (mouthMl > 0 ? 38 : 0), facialCnt > 0 ? 45 : 0, Math.round(lust * 0.5));
                        return Math.max(tier6(headScore, false) + 1, partDirtyFloor);
                    }
                    if (key === "穿搭_胸罩" || key === "穿搭_上衣") {
                        const topScore = Math.max(corr, durDrop, facialCnt > 0 ? 45 : 0, safeNum(c.泌乳?.喷乳次数) > 0 ? 48 : 0, Math.round(lust * 0.5));
                        return Math.max(tier6(topScore, false) + 1, partDirtyFloor);
                    }
                    const lowerScore = Math.max(corr, durDrop, lowerMl >= 100 ? 78 : (lowerMl >= 30 ? 52 : (lowerMl > 0 ? 32 : 0)), Math.round(lust * 0.6));
                    return Math.max(tier6(lowerScore, false) + 1, partDirtyFloor);
                }
                return Math.max(baseStg, partDirtyFloor);
            }

            if (key === "穿搭_头饰" || key === "穿搭_颈部") {
                const headScore = Math.max(corr, mouthMl >= 50 ? 68 : (mouthMl > 0 ? 38 : 0), facialCnt > 0 ? 45 : 0, Math.round(lust * 0.5));
                return Math.max(tier6(headScore, false) + 1, partDirtyFloor);
            }
            if (key === "穿搭_胸罩" || key === "穿搭_上衣") {
                const topScore = Math.max(corr, durDrop, facialCnt > 0 ? 45 : 0, safeNum(c.泌乳?.喷乳次数) > 0 ? 48 : 0, Math.round(lust * 0.5));
                return Math.max(tier6(topScore, false) + 1, partDirtyFloor);
            }
            if (key.startsWith("穿搭_")) {
                const lowerScore = Math.max(corr, durDrop, lowerMl >= 100 ? 78 : (lowerMl >= 30 ? 52 : (lowerMl > 0 ? 32 : 0)), Math.round(lust * 0.6), Math.round(pleas * 0.5));
                return Math.max(tier6(lowerScore, false) + 1, partDirtyFloor);
            }
            return Math.max(tier6(corr, false) + 1, partDirtyFloor);
        }

        function getRealStageByKey(editKeyOrTitle, v = curVars) {
            if (!editKeyOrTitle) return 1;
            const q = String(editKeyOrTitle).trim();
            if (v?.上帝强制锁定 && typeof v.上帝强制锁定[q] === "number") {
                const isRev = (q === "shame" || q === "sta" || q === "当前姿势");
                return tier6(Number(v.上帝强制锁定[q]), isRev) + 1;
            }
            if (latestStatus && Array.isArray(latestStatus.categories)) {
                for (const cat of latestStatus.categories) {
                    const hit = (cat.items || []).find(it => it.editKey === q || it.cleanTitle === q || String(it.cleanTitle || "").includes(q));
                    if (hit) return getItemRealStageNum(hit, v);
                }
            }
            return getItemRealStageNum({ editKey: q }, v);
        }

        // 提取当前穿搭部位的款式特征词
        function getWearStyleSignature(editKey, v = curVars) {
            const key = String(editKey || "");
            const u = detectProtagonistName(v);
            if (key === "体内道具") return safeStr(v?.体内道具与权限?.体内道具 || v?.按钮详情?.[key]?.stage).trim().slice(0, 80);
            if (key === "穿刺环饰") return safeStr(v?.痕迹与标记?.穿刺与环饰 || v?.按钮详情?.[key]?.stage).trim().slice(0, 80);
            if (key === "淫纹烙印") return safeStr(v?.痕迹与标记?.淫纹与刻印 || v?.按钮详情?.[key]?.stage).trim().slice(0, 80);
            if (key === "孕肚进度" || key === "子宫实况") return safeStr(userSettings.parasiteState?.type !== "无寄生" ? userSettings.parasiteState?.type : "").trim().slice(0, 80);
            if (!key.startsWith("穿搭_")) return "";

            const live = extractDynamicContext(u);
            const allClothStr = safeStr(v?.实况?.当前衣装 || v?.体内道具与权限?.穿戴中的标记物);
            const pickClothPart = (reg) => {
                if (!allClothStr) return "";
                return allClothStr.split(/[、，；,;]+/).filter(s => reg.test(s)).join("、");
            };
            const defaultPureWear = WARDROBE_PRESETS[0]?.wear || {};

            const map = {
                "穿搭_头饰": v?.按钮详情?.[key]?.stage || v?.穿搭?.头饰与眼部 || live.headWear || pickClothPart(/(?:发|簪|冠|耳|眼|镜|面|帽)/) || defaultPureWear.头饰与眼部,
                "穿搭_颈部": v?.按钮详情?.[key]?.stage || v?.穿搭?.颈部与项圈 || live.neckWear || pickClothPart(/(?:项圈|颈|领|锁骨|链|巾)/) || defaultPureWear.颈部与项圈,
                "穿搭_胸罩": v?.按钮详情?.[key]?.stage || v?.穿搭?.胸罩与裹胸 || live.braWear  || pickClothPart(/(?:裹胸|胸罩|文胸|肚兜|乳|内衬|真空)/) || defaultPureWear.胸罩与裹胸,
                "穿搭_上衣": v?.按钮详情?.[key]?.stage || v?.穿搭?.上衣与束腰 || live.topWear  || pickClothPart(/(?:袍|衣|衫|T恤|束腰|腰带|甲|服|睡裙)/) || defaultPureWear.上衣与束腰,
                "穿搭_内裤": v?.按钮详情?.[key]?.stage || v?.穿搭?.内裤与遮挡 || live.pantyWear|| pickClothPart(/(?:衬裤|内裤|底裤|丁字裤|开裆|胖次|光裸|真空)/) || defaultPureWear.内裤与遮挡,
                "穿搭_下装": v?.按钮详情?.[key]?.stage || v?.穿搭?.下装与裙裤 || live.bottomWear||pickClothPart(/(?:裙|裤|下摆)/) || defaultPureWear.下装与裙裤,
                "穿搭_丝袜": v?.按钮详情?.[key]?.stage || v?.穿搭?.丝袜与腿部 || live.sockWear || pickClothPart(/(?:袜|丝|腿环|绑腿|裸腿)/) || defaultPureWear.丝袜与腿部,
                "穿搭_鞋子": v?.按钮详情?.[key]?.stage || v?.穿搭?.鞋子与玉足 || live.shoeWear || pickClothPart(/(?:靴|鞋|拖鞋|履|足)/) || defaultPureWear.鞋子与玉足
            };
            const rawSig = safeStr(map[key]).trim();
            return rawSig.slice(0, 80);
        }
        function getAllAssignablePartGroups() {
            const groups = [
                { group: "🌸 六孔与储精", list: [["骚口实况","👄 骚口"],["胸部实况","🍒 丰乳"],["小穴实况","🌺 小穴"],["子宫实况","🫀 子宫"],["阴蒂尿道","💧 阴蒂尿道"],["屁眼实况","🕳️ 屁眼"]] },
                { group: "🤰 苗床与受孕", list: [["排卵周期","🥚 卵巢异变"],["受精断面","🔬 受精断面"],["精液归属","🧬 白浊同化"],["孕肚进度","🤰 孕肚孵化巢"]] },
                { group: "⛓️ 肉改与道具", list: [["正字涂鸦","🩹 正字涂鸦"],["淫纹烙印","🔮 淫纹烙印"],["穿刺环饰","💍 穿刺环饰"],["体内道具","🎛️ 体内道具"]] },
                { group: "👩 档案与恶堕", list: [["身份与背景","👩 监控身份"],["肉体外貌","🌸 肉体外貌"],["当前姿势","🧍 当前姿势"],["表里风评","🎭 社死风评"],["挂牌身价","🏷️ 挂牌身价"],["内心独白","💬 内心独白"],["cockLove","💗 阳具烙印"],["lust","🔥 发情中枢"],["corr","🖤 人格崩坏"],["shame","😳 羞耻防线"],["obey","🙇 意志切除"],["pleas","💓 脑髓熔断"],["精神沦陷","🌀 脑实质沦陷"],["媚药毒瘾","🧪 脑脊液毒瘾"]] },
                { group: "👗 全身穿搭", list: [["穿搭_头饰","👑 头饰面容"],["穿搭_颈部","⛓️ 脖颈锁骨"],["穿搭_胸罩","👙 胸衣内衬"],["穿搭_上衣","👚 上衣外衫"],["穿搭_内裤","🩲 底裤私处"],["穿搭_下装","🍑 裙裤臀部"],["穿搭_丝袜","🧦 丝袜双腿"],["穿搭_鞋子","👠 鞋履玉足"]] },
                { group: "💎 淫乱总账", list: [["破瓜纪念","🥀 破瓜纪念"],["六孔总账","💎 性交总账"],["高潮总账","💎 高潮失禁"],["射精总账","💎 射精泌乳"],["露出总账","💎 接客轮奸"]] }
            ];
            if (!latestStatus) latestStatus = getFallbackData();
            const fetCat = (latestStatus.categories || []).find(c => c.title === "下流性癖库");
            const validFets = (fetCat?.items || []).filter(it => it.editKey && !it.editKey.endsWith("_none"));
            if (validFets.length) {
                groups.push({
                    group: "🧬 下流性癖库",
                    list: validFets.map(it => [it.editKey, "🧬 " + it.editKey.replace("fetish_", "")])
                });
            }
            const cliCat = (latestStatus.categories || []).find(c => c.title === "恩客图鉴");
            const validClis = (cliCat?.items || []).filter(it => it.editKey && !it.editKey.endsWith("_none"));
            if (validClis.length) {
                groups.push({
                    group: "🍆 恩客图鉴",
                    list: validClis.map(it => [it.editKey, "🍆 " + (it.clientName || it.editKey.replace("client_", ""))])
                });
            }
            return groups;
        }

        function getClientTypeArchetype(clientName) {
            const s = safeStr(clientName).trim();
            if (!s) return "general";
            if (/体育|运动|篮球|学长|男生|青年|室友/.test(s)) return "athlete_youth";
            if (/大叔|中年|老板|肥|主任|流浪汉/.test(s)) return "bastard_uncle";
            if (/粉丝|死忠|群|轮奸|众人/.test(s)) return "gang_crowd";
            if (/黄毛|混混|不良/.test(s)) return "delinquent";
            if (/触手|魔物|异种|兽|鬼怪/.test(s)) return "monster";
            return s;
        }

        function isWearStyleCompatible(savedSig, currentSig) {
            if (!savedSig || !currentSig) return true;
            const conflictPairs = [
                [/黑丝|黑色丝袜|黑色吊带|连裤黑丝|黑蕾丝袜|black.*stocking|black.*thighhigh|black.*pantyhose/i, /白丝|纯白|白色丝袜|白色吊带|过膝白丝|素腿|裸腿|肉丝|white.*stocking|white.*thighhigh|bare.*leg/i],
                [/网袜|渔网|fishnet/i, /白丝|纯白|素腿|裸腿|white.*thighhigh|bare.*leg/i],
                [/素腿|裸腿|修长素腿|光腿|bare.*leg|no.*stocking/i, /黑丝|白丝|丝袜|吊带袜|网袜|长筒袜|过膝袜|stocking|thighhigh|pantyhose|fishnet/i],
                [/水手服|JK|制服|白衬衫|百褶|sailor|school.*uniform|white.*shirt/i, /哥特|修女|巫女|古装|汉服|旗袍|睡裙|薄纱|触手|史莱姆|泳装|死库水|兔女郎|gothic|nun|miko|nightgown|tentacle|slime|swimsuit/i],
                [/哥特|黑蕾丝|gothic|black.*lace/i, /水手服|白衬衫|纯白睡裙|运动背心|古装|汉服|运动服|sailor|white.*shirt|sport/i],
                [/睡裙|薄纱吊带|nightgown|negligee/i, /水手服|制服|白衬衫|马丁靴|外套|皮衣|sailor|uniform/i],
                [/泳装|比基尼|死库水|swimsuit|bikini/i, /水手服|哥特|毛衣|衬衫|睡裙|古装/i],
                [/真空未穿|全裸爆乳|无上衣|赤裸上身|吸盘触手|topless|no.*bra|nipples.*exposed/i, /贴身丝质内衬|包裹完好|外衫整洁|穿戴整齐|严密遮护/i],
                [/乳环|铃铛乳环|乳夹|nipple.*pierc|nipple.*ring/i, /贴身丝质内衬|包裹完好|天然无饰/i],
                [/真空|未穿|无内裤|光裸|镂空|贞操带|开裆|no.*panti|bottomless|chastity/i, /纯白底裤|严密遮护|包裹完好|干净底裤|clean.*panti/i],
                [/丁字裤|蕾丝丁字裤|系带|thong|g-string/i, /纯白底裤|严密遮护|贞操带|平角裤/i],
                [/短裤|牛仔裤|长裤|热裤|运动裤|瑜伽裤|shorts|jeans|pants/i, /短裙|长裙|百褶裙|蓬蓬裙|睡裙|裙摆|skirt|dress/i],
                [/无下装|毫无遮挡|全裸|bottomless|nude/i, /裙摆垂顺|端庄得体|长裙|长裤|短裤/i],
                [/运动鞋|球鞋|篮球鞋|帆布鞋|sneaker|sport.*shoe/i, /高跟鞋|马丁靴|皮鞋|赤足|裸足|凉鞋|拖鞋|high.*heel|boots|barefoot/i],
                [/高跟鞋|细高跟|high.*heel|stiletto/i, /马丁靴|运动鞋|球鞋|赤足|裸足|拖鞋|boots|sneaker|barefoot/i],
                [/马丁靴|绑带靴|长靴|皮靴|boots/i, /高跟鞋|运动鞋|球鞋|赤足|裸足|凉鞋|high.*heel|sneaker|barefoot/i],
                [/赤足|裸足|赤足跪爬|悬空吊起|光脚|barefoot|no.*shoes/i, /高跟鞋|马丁靴|皮鞋|运动鞋|球鞋|精致鞋履|靴|shoes|boots|heels/i],
                [/开口环|口球|耳标|眼罩|阿嘿颜|gag|blindfold/i, /发丝整洁|发饰端庄|神色清澈/i],
                [/锁链项圈|肉便器铭牌|触手缠绕|电击项圈|collar|leash/i, /衣领齐整|衣领端正|雪颈白皙/i],
                [/撕裂|撕开|崩飞|湿烂|白浊|爱液|巴掌印|正字|触手|粘液|泡烂|精液|淫水|漏尿|失禁|torn|cum|semen/i, /整洁|齐整|完好|端庄|干净|垂顺|平稳|clean|neat/i],
                [/跳蛋|vibrator|egg/i, /触手|机械|假阳具|扩张器|拳|tentacle|dildo|machine/i],
                [/假阳具|硅胶|拉珠|dildo|beads/i, /触手|史莱姆|魔虫|tentacle|slime/i],
                [/史莱姆|slime/i, /魔虫|虫卵|机械|insect|machine/i]
            ];
            for (const [regA, regB] of conflictPairs) {
                if ((regA.test(savedSig) && regB.test(currentSig)) || (regB.test(savedSig) && regA.test(currentSig))) {
                    return false;
                }
            }
            return true;
        }

        function isAppearanceDnaSimilar(savedDna, currentDna, strictMode = false, savedFullDna = "", curFullDna = "") {
            if (!savedDna || !currentDna) return false;
            const sLow = (savedFullDna || savedDna).toLowerCase(), cLow = (curFullDna || currentDna).toLowerCase();

            const sSpecies = getSpeciesSignatureFromDna(sLow);
            const cSpecies = getSpeciesSignatureFromDna(cLow);

            // 1. 人类与非人鬼怪/魔物之间严格隔离（变回人类时绝不调用鬼怪图，变成鬼怪时绝不调用普通人类图！）
            if ((sSpecies === "human") !== (cSpecies === "human")) return false;

            // 2. 如果两边都是非人鬼怪/魔物：采用【核心物种家族 + 关键解剖特征相似度】匹配！
            // 这样下次开新档玩“相似的鬼怪”（比如同为多眼鬼、或同为鬼角鬼、或同为女鬼）时，即使细微Tag不完全一样，也能100%命中复用图池！
            if (sSpecies !== "human" && cSpecies !== "human") {
                const sTokens = sSpecies.split("|");
                const cTokens = cSpecies.split("|");
                // 严禁把下半身完全不同的魔物混用（如蛇尾、鱼尾、蛛腹、人马、触手下半身必须严格对应）
                const majorLowerTypes = ["lamia_snaketail", "mermaid_fishtail", "insect_arachne", "tentacle_morph", "centaur_horse", "eldritch_horror", "slime_fluid"];
                for (const lt of majorLowerTypes) {
                    if (sTokens.includes(lt) !== cTokens.includes(lt)) return false;
                }
                // 只要共享同一个主物种家族（如都是 undead_ghost 女鬼、或都是 succubus_demon 魅魔）或共享核心异形特征（如都是 trait_multieyes 多眼、trait_onihorns 鬼角），即视为同类相似鬼怪！
                const hasSharedMorphFamily = sTokens.some(t => cTokens.includes(t));
                if (!hasSharedMorphFamily) return false;
                // 如果当前是特殊异形女鬼（如多眼/半透/鬼角），优先匹配同样带有该特殊视觉特征的鬼怪图
                const keyVisualSubTypes = ["trait_multieyes", "trait_onihorns", "trait_translucent"];
                for (const vt of keyVisualSubTypes) {
                    if (sTokens.includes(vt) !== cTokens.includes(vt)) return false;
                }
            }

            // 3. 体型萝莉/御姐锁：小萝莉鬼怪只调用小萝莉鬼怪的图，巨乳御姐鬼怪只调用御姐的图
            const isSavedLoli = /petite|loli|flat chest|small breasts/.test(sLow);
            const isCurLoli = /petite|loli|flat chest|small breasts/.test(cLow);
            if (isSavedLoli !== isCurLoli) return false;

            // 4. 肤色锁：白皮与黑皮严格区分
            if (/dark skin|tan/.test(sLow) !== /dark skin|tan/.test(cLow)) return false;

            if (sLow === cLow) return true;

            // 5. 发色匹配
            const hairColors = ["silver hair", "white hair", "blonde hair", "black hair", "pink hair", "purple hair", "blue hair", "red hair", "brown hair", "green hair", "grey hair"];
            let sameColor = false;
            for (const hc of hairColors) {
                if (sLow.includes(hc) && cLow.includes(hc)) { sameColor = true; break; }
            }
            if (!sameColor) return false;
            if (!strictMode) return true;

            // 6. 发型匹配（对于同类特殊鬼怪放宽卷发/直发细节，只要同为双马尾/长发/短发大类即可复用）
            const getHairGroup = (str) => {
                if (/twintails|twin tails/.test(str)) return "twintails";
                if (/ponytail/.test(str)) return "ponytail";
                if (/short hair|bob cut/.test(str)) return "short";
                if (/hair bun/.test(str)) return "bun";
                if (/braid/.test(str)) return "braid";
                return "long";
            };
            if (getHairGroup(sLow) !== getHairGroup(cLow)) return false;

            return true;
        }

        async function saveDataUrlToLocalDiskFolder(dataUrl, customFileName) {
            if (!dataUrl || !dataUrl.startsWith("data:")) return "";
            try {
                const ctx = safeCtx();
                let headers = { "Content-Type": "application/json" };
                if (typeof ctx?.getRequestHeaders === "function") {
                    headers = { ...headers, ...ctx.getRequestHeaders() };
                } else if (typeof window.getRequestHeaders === "function") {
                    headers = { ...headers, ...window.getRequestHeaders() };
                }

                const base64Data = dataUrl.split(",")[1];
                if (!base64Data) return "";
                const extMatch = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
                const format = (extMatch && extMatch[1]) ? extMatch[1].replace("jpeg", "jpg") : "webp";

                const CN_TO_EN = {
                    "骚口实况": "mouth", "胸部实况": "chest", "小穴实况": "vagina", "子宫实况": "womb", "阴蒂尿道": "clit", "屁眼实况": "anal",
                    "排卵周期": "ovary", "受精断面": "fert", "精液归属": "semen", "孕肚进度": "belly",
                    "正字涂鸦": "scar", "淫纹烙印": "tattoo", "穿刺环饰": "pierce", "体内道具": "prop",
                    "身份与背景": "identity", "肉体外貌": "body", "当前姿势": "pose", "表里风评": "rep", "挂牌身价": "price", "内心独白": "mind",
                    "精神沦陷": "hypno", "媚药毒瘾": "drug", "破瓜纪念": "virgin", "六孔总账": "ledger_sex", "高潮总账": "ledger_org", "射精总账": "ledger_cum", "露出总账": "ledger_exp",
                    "穿搭_头饰": "wear_head", "穿搭_颈部": "wear_neck", "穿搭_胸罩": "wear_bra", "穿搭_上衣": "wear_top",
                    "穿搭_内裤": "wear_panty", "穿搭_下装": "wear_bottom", "穿搭_丝袜": "wear_sock", "穿搭_鞋子": "wear_shoe"
                };
                let safeName = String(customFileName || `img_${Date.now()}`);
                for (const [cn, en] of Object.entries(CN_TO_EN)) {
                    safeName = safeName.replace(new RegExp(cn, "g"), en);
                }
                safeName = safeName.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");

                const res = await fetch("/api/images/upload", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        image: base64Data,
                        format: format,
                        ch_name: "status_bar_pool",
                        filename: safeName
                    })
                });
                if (!res.ok) return "";
                const data = await res.json();
                let diskUrl = safeStr(data?.path).trim();
                if (diskUrl && !diskUrl.startsWith("/") && !diskUrl.startsWith("http")) {
                    diskUrl = "/" + diskUrl;
                }
                return diskUrl;
            } catch (e) {
                return "";
            }
        }

        async function registerImageToReusablePool(editKey, stageNum, dataUrl, charName, extraMeta = {}) {
            if (!editKey || !dataUrl) return "";
            userSettings.reusableImgPool = Array.isArray(userSettings.reusableImgPool) ? userSettings.reusableImgPool : [];
            userSettings.poolRandomEnabled = (userSettings.poolRandomEnabled !== false);

            const INHERENTLY_NSFW_KEYS = new Set(["破瓜纪念", "六孔总账", "高潮总账", "射精总账", "露出总账", "cockLove"]);
            const wearSig = safeStr(extraMeta.customWearSig || getWearStyleSignature(editKey, curVars)).trim().slice(0, 80);
            const hasDirtyWearWords = /撕裂|撕开|崩飞|湿烂|白浊|爱液|淫水|真空|未穿|赤裸|乳环|贞操带|触手|粘液|精液|漏尿|失禁|内射|深喉|肉棒|流精|外翻|脱垂|脱肛|阿嘿颜|ahegao|torn|cum|semen|creampie|sex|penis|nsfw/i.test(wearSig);

            const sp = curVars?.体内精液存量 || {};
            const mouthMl = safeNum(sp.口内毫升);
            const vagWombMl = safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升);
            const analMl = safeNum(sp.屁眼毫升);
            const lowerMl = vagWombMl + analMl;
            const totalMl = mouthMl + lowerMl;
            const refCorr = typeof extraMeta.corr === "number" ? extraMeta.corr : safeNum(curVars?.核心数值?.淫乱恶堕, 0);
            const durDrop = 100 - safeNum(userSettings.clothDurability, 100);
            const c = curVars?.计数 || {};
            const totalSexActs = safeNum(c.性交?.小穴) + safeNum(c.性交?.口) + safeNum(c.性交?.屁眼) + safeNum(c.性交?.乳穴) + safeNum(c.性交?.足腿) + safeNum(c.性交?.兽交异种) + safeNum(c.射精?.内射) + safeNum(c.精液摄入?.吞精次数) + safeNum(c.失控?.失禁) + safeNum(c.失控?.喷潮);

            let partRelevantMl = totalMl;
            if (editKey === "骚口实况" || editKey === "穿搭_头饰" || editKey === "穿搭_颈部" || editKey === "内心独白") {
                partRelevantMl = mouthMl;
            } else if (editKey === "胸部实况" || editKey === "穿搭_胸罩" || editKey === "穿搭_上衣") {
                partRelevantMl = safeNum(c.射精?.颜射体外) > 0 ? mouthMl : 0;
            } else if (editKey === "屁眼实况") {
                partRelevantMl = analMl;
            } else if (editKey === "小穴实况" || editKey === "子宫实况" || editKey.startsWith("穿搭_")) {
                partRelevantMl = lowerMl;
            }

            let realStg = Number(stageNum) || 0;
            if (realStg < 1) {
                realStg = getRealStageByKey(editKey, curVars) || 1;
            }

            const hasCumInThisPic = Boolean(
                extraMeta.hasCum !== undefined ? extraMeta.hasCum :
                (realStg >= 2 && (partRelevantMl > 0 || totalMl > 0 || hasDirtyWearWords || editKey === "射精总账" || editKey === "精液归属"))
            );

            const isDuoSexPic = Boolean(
                extraMeta.isDuoSex !== undefined ? extraMeta.isDuoSex :
                (INHERENTLY_NSFW_KEYS.has(editKey) || String(editKey).startsWith("client_"))
            );

            const isPureClean = Boolean(
                realStg === 1 &&
                !INHERENTLY_NSFW_KEYS.has(editKey) &&
                !String(editKey).startsWith("client_") &&
                !String(editKey).startsWith("fetish_") &&
                !hasCumInThisPic &&
                !isDuoSexPic &&
                !hasDirtyWearWords &&
                !extraMeta.forceDirty
            );

            const actualContent = queryImportedImage(dataUrl) || dataUrl;
            const fp = getImgFingerprint(actualContent);
            const rawFp = getImgFingerprint(dataUrl);
            const normIn = normalizeImgKey(dataUrl);

            // ✅ 双重指纹+内容彻底查重：哪怕一张存了Base64、一张存了Key，也绝不重复入池！
            const existItem = userSettings.reusableImgPool.find(x => {
                if (!x || x.editKey !== editKey) return false;
                if (x.fp === fp || x.fp === rawFp || x.dbKey === dataUrl || x.diskPath === dataUrl || normalizeImgKey(x.dbKey) === normIn) return true;
                const xContent = queryImportedImage(x.dbKey) || x.diskPath || x.dbKey;
                return xContent && getImgFingerprint(xContent) === fp;
            });
            if (existItem) {
                if (existItem.stageNum === 1 && realStg > 1) existItem.stageNum = realStg;
                if (!isPureClean) existItem.isPureClean = false;
                if (hasCumInThisPic) existItem.hasCum = true;
                if (isDuoSexPic) existItem.isDuoSex = true;
                if (wearSig && !existItem.wearSig) existItem.wearSig = wearSig;
                saveSettings();
                return existItem.diskPath || existItem.dbKey;
            }

            const fileBaseName = `pool_${editKey}_${realStg}_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`;
            const poolDbKey = normalizeImgKey(fileBaseName);

            let diskPath = dataUrl.startsWith("/") ? dataUrl : "";
            if (dataUrl.startsWith("data:")) {
                diskPath = await saveDataUrlToLocalDiskFolder(dataUrl, fileBaseName);
                await rawSaveDataUrlToDB(poolDbKey, diskPath || dataUrl).catch(() => {});
                importedImgCache.set(poolDbKey, diskPath || dataUrl);
            }

            const fullDna = getLockedAppearanceTags(charName, curVars);
            const headDna = getHeadOnlyDnaTags(fullDna).slice(0, 80);
            const skinDna = getSkinOnlyDnaTags(fullDna).slice(0, 220);
            const speciesSig = getSpeciesSignatureFromDna(fullDna);
            const clientArch = extraMeta.clientName ? getClientTypeArchetype(extraMeta.clientName) : "";

            const finalRefKey = diskPath || (dataUrl.startsWith("data:") ? poolDbKey : dataUrl);

            userSettings.reusableImgPool.unshift({
                id: "pool_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                dbKey: finalRefKey,
                diskPath: diskPath || "",
                fp,
                editKey,
                stageNum: realStg,
                isPureClean: isPureClean,
                hasCum: hasCumInThisPic,
                isDuoSex: isDuoSexPic,
                isUniversalOrgan: UNIVERSAL_LOCAL_PARTS.has(editKey),
                charName: (charName || "未知").slice(0, 24),
                dna: headDna,
                fullDna: fullDna.slice(0, 260),
                skinDna: skinDna,
                speciesSig: speciesSig,
                wearSig: wearSig,
                clientArch: clientArch,
                time: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, 5)
            });

            if (userSettings.reusableImgPool.length > 1200) {
                userSettings.reusableImgPool.length = 1200;
            }
            saveSettings();
            return finalRefKey;
        }
        const partRandomOffsetMap = {};
        let sessionRandomSeed = Math.floor(Math.random() * 10000);

        function getStageImageCandidates(item) {
            if (!item || !item.editKey) return [];
            const stageNum = getItemRealStageNum(item, curVars);
            const baseFolder = `${PLUGIN_BASE_PATH}/images`, candidates = [];
            const btnRec = curVars.按钮详情?.[item.editKey] || {};
            const stageMap = btnRec.stageImgs || {};
            const stageListMap = btnRec.stageImgList || {};

            const pushValid = (src) => {
                if (!src) return;
                const s = String(src).trim();
                if (!s || deadPhysicalUrlSet.has(s)) return;
                const hit = queryImportedImage(s);
                if (hit && !candidates.includes(hit)) { candidates.push(hit); return; }
                const nk = normalizeImgKey(s);
                if ((s.startsWith("data:") || s.startsWith("http") || s.startsWith("blob:") || s.startsWith("/") || dbKeyIndexSet.has(nk)) && !candidates.includes(s)) {
                    candidates.push(s);
                }
            };

            const spNow = curVars.体内精液存量 || {};
            const mouthMlNow = safeNum(spNow.口内毫升);
            const lowerMlNow = safeNum(spNow.小穴毫升) + safeNum(spNow.子宫毫升) + safeNum(spNow.屁眼毫升);
            const totalMlNow = mouthMlNow + lowerMlNow;
            const cNow = curVars.计数 || {};
            const totalSexNow = safeNum(cNow.性交?.小穴) + safeNum(cNow.性交?.口) + safeNum(cNow.性交?.屁眼) + safeNum(cNow.性交?.乳穴) + safeNum(cNow.性交?.足腿) + safeNum(cNow.射精?.内射) + safeNum(cNow.精液摄入?.吞精次数);

            const isVirginCleanChat = (
                totalMlNow === 0 &&
                totalSexNow === 0 &&
                safeNum(curVars.核心数值?.淫乱恶堕) < 15 &&
                safeNum(userSettings.clothDurability, 100) >= 85
            );

            const isUpperKey = (item.editKey === "骚口实况" || item.editKey === "穿搭_头饰" || item.editKey === "穿搭_颈部" || item.editKey === "内心独白");
            const isPartCurrentlyCumFree = isUpperKey ? (mouthMlNow === 0) : (totalMlNow === 0);

            const ctx = safeCtx();
            const recentMes = safeStr((ctx?.chat || []).slice(-2).map(m => m?.mes || "").join(" "));
            const contextStr = `${safeStr(curVars.实况?.当前姿势)} ${recentMes.slice(-400)}`;
            const hasActiveSexNow = /(?:肉棒|阳具|龟头|阴茎|巨物|插进|捅入|抽插|内射|深喉|口交|肛交|乳交|足交|侵犯|挺腰撞击)/.test(contextStr);

            const u = detectProtagonistName(curVars);
            const curFullDna = getLockedAppearanceTags(u, curVars);
            const curHeadDna = getHeadOnlyDnaTags(curFullDna);
            const curSkinDna = getSkinOnlyDnaTags(curFullDna);
            const curSpeciesSig = getSpeciesSignatureFromDna(curFullDna);
            const curWearSig = getWearStyleSignature(item.editKey, curVars);
            const isWearPart = String(item.editKey).startsWith("穿搭_") || ["体内道具", "穿刺环饰", "淫纹烙印", "孕肚进度"].includes(item.editKey);
            const isClientItem = Boolean(item.isClient || String(item.editKey).startsWith("client_"));
            const curClientArch = isClientItem ? getClientTypeArchetype(item.clientName || item.cleanTitle) : "";
            const isUniversalOrgan = UNIVERSAL_LOCAL_PARTS.has(item.editKey);
            const isHeadlessWear = HEADLESS_WEAR_PARTS.has(item.editKey);

            const currentChatImgs = [];
            const poolList = Array.isArray(userSettings.reusableImgPool) ? userSettings.reusableImgPool : [];

            const isLocalImgWearCompatible = (srcKey) => Boolean(srcKey);

            const pushCurrentChat = (src) => {
                if (!src) return;
                const s = String(src).trim();
                if (!s || deadPhysicalUrlSet.has(s)) return;
                const hit = queryImportedImage(s);
                if (hit && !currentChatImgs.includes(hit)) { currentChatImgs.push(hit); return; }
                const nk = normalizeImgKey(s);
                if ((s.startsWith("data:") || s.startsWith("http") || s.startsWith("blob:") || s.startsWith("/") || dbKeyIndexSet.has(nk)) && !currentChatImgs.includes(s)) {
                    currentChatImgs.push(s);
                }
            };

            // 1. 最高优先级：本局当前物种形态下绑定的配图
            if (btnRec.forceLatestImg) pushCurrentChat(btnRec.forceLatestImg);
            if (Array.isArray(stageListMap[stageNum])) {
                stageListMap[stageNum].forEach(s => pushCurrentChat(s));
            }
            if (stageMap[stageNum]) pushCurrentChat(stageMap[stageNum]);
            if (btnRec.imgUrl) pushCurrentChat(btnRec.imgUrl);

            const scopedKeyNow = normalizeImgKey(getProtagScopedImgKey(item.editKey, stageNum));
            const scopedHit = queryImportedImage(scopedKeyNow) || (dbKeyIndexSet.has(scopedKeyNow) ? scopedKeyNow : "");
            if (scopedHit) pushCurrentChat(scopedHit);

            const uNoSpace = (u || "角色").replace(/\s+/g, "");
            (curVars.专属相册 || []).forEach(g => {
                if (!g) return;
                const cleanTitleNoSpace = String(g.title || "").replace(/\s+/g, "");
                if (cleanTitleNoSpace.includes("·") && !cleanTitleNoSpace.includes(uNoSpace)) return;
                if (g.speciesSig && g.speciesSig !== curSpeciesSig) return;
                if (g.editKey === item.editKey && Number(g.stageIdx) === stageNum) {
                    pushCurrentChat(g.diskPath || g.dbKey || g.src);
                }
            });
            const galleryStageHit = findGalleryImgForItem(item, stageNum);
            if (galleryStageHit) pushCurrentChat(galleryStageHit);

            // 2. 如果本局在当前阶没有图，但本局在【同一物种形态下】的其他阶生成过该部位的图，才拿来兜底
            if (currentChatImgs.length === 0) {
                for (let s = 6; s >= 1; s--) {
                    if (s === stageNum) continue;
                    if (Array.isArray(stageListMap[s])) stageListMap[s].forEach(x => pushCurrentChat(x));
                    if (stageMap[s]) pushCurrentChat(stageMap[s]);
                    const otherScopedKey = normalizeImgKey(getProtagScopedImgKey(item.editKey, s));
                    const otherScoped = queryImportedImage(otherScopedKey) || (dbKeyIndexSet.has(otherScopedKey) ? otherScopedKey : "");
                    if (otherScoped) pushCurrentChat(otherScoped);
                }
                (curVars.专属相册 || []).forEach(g => {
                    if (g && g.editKey === item.editKey && (!g.speciesSig || g.speciesSig === curSpeciesSig)) {
                        pushCurrentChat(g.diskPath || g.dbKey || g.src);
                    }
                });
            }
            if (item.isCustom && btnRec.imgUrl) pushCurrentChat(btnRec.imgUrl);

            const crossChatRandomPool = [];
            const pushRandomPool = (src) => {
                if (!src) return;
                const s = String(src).trim();
                if (!s || deadPhysicalUrlSet.has(s)) return;
                const hit = queryImportedImage(s);
                if (hit && !crossChatRandomPool.includes(hit)) { crossChatRandomPool.push(hit); return; }
                const nk = normalizeImgKey(s);
                if ((s.startsWith("data:") || s.startsWith("http") || s.startsWith("blob:") || s.startsWith("/") || dbKeyIndexSet.has(nk)) && !crossChatRandomPool.includes(s)) {
                    crossChatRandomPool.push(s);
                }
            };

            const extractSkinMatSig = (sDna) => {
                const low = safeStr(sDna).toLowerCase();
                const m = [low.split(",")[0].trim() || "pale white skin"];
                if (/four breasts|4 breasts|two pairs of breasts/.test(low)) m.push("four_breasts_organ");
                else if (/multiple breasts|six breasts|rows of breasts/.test(low)) m.push("multi_breasts_organ");
                else if (/three breasts|3 breasts/.test(low)) m.push("three_breasts_organ");
                if (/multiple pussies|covered in vaginas|multiple vaginas/.test(low)) m.push("multi_pussy_organ");
                else if (/double pussy|two vertically stacked/.test(low)) m.push("double_pussy_organ");
                if (/stomach mouth|extra mouth|multiple mouths/.test(low)) m.push("extra_mouth_organ");
                if (/ghost skin|supernatural|yurei/.test(low)) m.push("undead_ghost_skin");
                if (/snake scales/.test(low)) m.push("snake_scales");
                if (/fish scales/.test(low)) m.push("fish_scales");
                if (/slime/.test(low)) m.push("slime_gel");
                if (/chitin|exoskeleton/.test(low)) m.push("chitin");
                if (/doll seams|mechanical joints/.test(low)) m.push("cyber_doll");
                if (/eldritch/.test(low)) m.push("eldritch_flesh");
                if (/flower petals|plant girl|vine/.test(low)) m.push("plant_petal");
                if (/glowing eerie eyes/.test(low)) m.push("eerie_eyes_skin");
                if (/spider web/.test(low)) m.push("spider_web_skin");
                if (/translucent/.test(low)) m.push("translucent_ghost_skin");
                if (/dripping wet/.test(low)) m.push("wet_ghost_skin");
                return m.join("|");
            };

            for (const pItem of poolList) {
                if (!pItem || !pItem.editKey) continue;
                const pIsClient = String(pItem.editKey).startsWith("client_");
                if (!isClientItem && pItem.editKey !== item.editKey) continue;
                if (isClientItem && !pIsClient) continue;

                const pStage = Number(pItem.stageNum) || 1;
                if (pStage !== stageNum) continue;

                if (isVirginCleanChat) {
                    if (pItem.isPureClean !== true || pItem.hasCum === true || pItem.isDuoSex === true) continue;
                    if (/撕裂|湿烂|白浊|爱液|淫水|真空|赤裸|精液|漏尿|失禁|torn|cum|semen/i.test(pItem.wearSig || "")) continue;
                }
                if (isPartCurrentlyCumFree) {
                    if (pItem.hasCum === true || pItem.isDuoSex === true || /白浊|精液|内射|颜射|射精|潮吹|失禁|漏尿|肉棒|cum|semen|creampie|sex|penis/i.test(pItem.wearSig || "")) continue;
                }
                if (item.editKey === "当前姿势" && !hasActiveSexNow && pItem.isDuoSex === true) continue;

                const pSpeciesSig = pItem.speciesSig || getSpeciesSignatureFromDna(pItem.fullDna || pItem.dna || pItem.skinDna || "");
                const isPureInternalCutaway = (item.editKey === "子宫实况" || item.editKey === "排卵周期" || item.editKey === "受精断面");
                const isLowerOrTailSensitivePart = ["穿搭_下装", "穿搭_丝袜", "穿搭_鞋子", "穿搭_内裤", "屁眼实况", "精液归属"].includes(item.editKey);
                const NON_HUMAN_LOWER_REG = /lamia_snaketail|mermaid_fishtail|insect_arachne|tentacle_morph|plant_alraune|centaur_horse|harpy_bird|livestock_pig|trait_limbless/;
                const TAIL_SPECIES_REG = /succubus_demon|catgirl|foxgirl|dogwolf_girl|cowgirl|bunnygirl|dragongirl|lamia_snaketail|mermaid_fishtail|trait_monstertail/;
                const hasNonHumanLowerNow = NON_HUMAN_LOWER_REG.test(curSpeciesSig);
                const hasNonHumanLowerSaved = NON_HUMAN_LOWER_REG.test(pSpeciesSig);
                const hasTailNow = TAIL_SPECIES_REG.test(curSpeciesSig);
                const hasTailSaved = TAIL_SPECIES_REG.test(pSpeciesSig);

                if (isLowerOrTailSensitivePart) {
                    if (hasNonHumanLowerNow !== hasNonHumanLowerSaved) continue;
                    if (hasNonHumanLowerNow && curSpeciesSig !== pSpeciesSig) continue;
                    if ((item.editKey === "穿搭_下装" || item.editKey === "屁眼实况") && hasTailNow !== hasTailSaved) continue;
                }

                const pEffectiveSkin = pItem.skinDna || getSkinOnlyDnaTags(pItem.fullDna || pItem.dna || "");
                if (isPureInternalCutaway && pItem.isUniversalOrgan !== false) {
                    pushRandomPool(pItem.diskPath || pItem.dbKey);
                } else if (isUniversalOrgan && pItem.isUniversalOrgan !== false) {
                    const skinMatMatch = (!pEffectiveSkin || extractSkinMatSig(pEffectiveSkin) === extractSkinMatSig(curSkinDna));
                    const isBreastRelated = (item.editKey === "胸部实况" || item.editKey === "穿刺环饰");
                    const breastSizeMatch = !isBreastRelated || !pItem.fullDna || (/petite|loli|flat chest|small breasts/i.test(pItem.fullDna) === /petite|loli|flat chest|small breasts/i.test(curFullDna));
                    const styleOk = isWearPart ? isWearStyleCompatible(pItem.wearSig, curWearSig) : true;
                    const curPartAnat = getPartAnatomySignature(item.editKey, curFullDna, item.desc);
                    const savedPartAnat = getPartAnatomySignature(item.editKey, pItem.fullDna || pItem.skinDna || "", pItem.wearSig || "");
                    const partAnatOk = (curPartAnat === savedPartAnat);
                    if (skinMatMatch && breastSizeMatch && styleOk && partAnatOk) pushRandomPool(pItem.diskPath || pItem.dbKey);
                } else if (isHeadlessWear) {
                    const skinOk = (!pEffectiveSkin || extractSkinMatSig(pEffectiveSkin) === extractSkinMatSig(curSkinDna));
                    const bodyTierOk = !pItem.fullDna || (/petite|loli|flat chest|small breasts/i.test(pItem.fullDna) === /petite|loli|flat chest|small breasts/i.test(curFullDna));
                    const styleOk = isWearStyleCompatible(pItem.wearSig, curWearSig);
                    if (skinOk && bodyTierOk && styleOk) {
                        pushRandomPool(pItem.diskPath || pItem.dbKey);
                    }
                } else if (item.editKey === "穿搭_头饰") {
                    const sameLook = isAppearanceDnaSimilar(pItem.dna, curHeadDna, true, pItem.fullDna, curFullDna);
                    const styleOk = isWearStyleCompatible(pItem.wearSig, curWearSig);
                    if (sameLook && styleOk) {
                        pushRandomPool(pItem.diskPath || pItem.dbKey);
                    }
                } else if (isClientItem) {
                    const sameLook = isAppearanceDnaSimilar(pItem.dna, curHeadDna, true, pItem.fullDna, curFullDna);
                    const sameClientType = Boolean(pItem.clientArch && curClientArch && pItem.clientArch === curClientArch);
                    if (sameLook && (sameClientType || (pItem.charName === u && pItem.editKey === item.editKey))) {
                        pushRandomPool(pItem.diskPath || pItem.dbKey);
                    }
                } else {
                    const sameLook = isAppearanceDnaSimilar(pItem.dna, curHeadDna, true, pItem.fullDna, curFullDna);
                    if (sameLook) {
                        pushRandomPool(pItem.diskPath || pItem.dbKey);
                    }
                }
            }

            if (HAS_ORIGINAL_DEFAULT_IMG.has(item.editKey)) {
                const defKeyStg = normalizeImgKey(`${item.editKey}_${stageNum}`);
                const defKeyBase = normalizeImgKey(item.editKey);
                const exactDbDefault = queryImportedImage(defKeyStg) || (dbKeyIndexSet.has(defKeyStg) ? defKeyStg : "") || (stageNum === 1 ? (queryImportedImage(defKeyBase) || (dbKeyIndexSet.has(defKeyBase) ? defKeyBase : "")) : "");
                if (exactDbDefault) {
                    pushRandomPool(exactDbDefault);
                }
            }

            const manualOff = partRandomOffsetMap[item.editKey] || 0;
            const allCombined = [...new Set([...currentChatImgs, ...crossChatRandomPool])];
            const chatLen = safeCtx()?.chat?.length || 1;
            const justGeneratedThisFloor = (curVars._lastImgGenKey === item.editKey && curVars._lastImgGenFloor === chatLen);

            if (manualOff > 0 && allCombined.length > 1) {
                const pickIdx = manualOff % allCombined.length;
                pushValid(allCombined[pickIdx]);
                allCombined.forEach(s => pushValid(s));
            } else if (justGeneratedThisFloor && currentChatImgs.length > 0) {
                currentChatImgs.forEach(s => pushValid(s));
                crossChatRandomPool.forEach(s => pushValid(s));
            } else if (currentChatImgs.length > 0) {
                if (currentChatImgs.length > 1 && userSettings.poolRandomEnabled !== false) {
                    const pickLocal = (sessionRandomSeed + chatLen) % currentChatImgs.length;
                    pushValid(currentChatImgs[pickLocal]);
                }
                currentChatImgs.forEach(s => pushValid(s));
                crossChatRandomPool.forEach(s => pushValid(s));
            } else if (crossChatRandomPool.length > 1 && userSettings.poolRandomEnabled !== false) {
                let keyHash = 0;
                for (let i = 0; i < item.editKey.length; i++) keyHash = (keyHash * 31 + item.editKey.charCodeAt(i)) % 997;
                const randIdx = (sessionRandomSeed + chatLen * 7 + keyHash) % crossChatRandomPool.length;
                pushValid(crossChatRandomPool[randIdx]);
                crossChatRandomPool.forEach(s => pushValid(s));
            } else {
                allCombined.forEach(s => pushValid(s));
            }

            if (HAS_ORIGINAL_DEFAULT_IMG.has(item.editKey)) {
                pushValid(`${item.editKey}_${stageNum}`);
                candidates.push(
                    `${baseFolder}/${item.editKey}_${stageNum}.webp`,
                    `${baseFolder}/${item.editKey}_${stageNum}.png`,
                    `${baseFolder}/${item.editKey}_${stageNum}.jpg`
                );
            }
            for (let s = stageNum; s >= 1; s--) {
                const pKey = getGlobalPinKey(item.editKey, s);
                if (userSettings.globalPinnedStageImgs?.[pKey]) pushValid(pKey);
                if (stageMap[s] && isLocalImgWearCompatible(stageMap[s], s === stageNum)) pushValid(stageMap[s]);
                const scopedKeyS = getProtagScopedImgKey(item.editKey, s);
                if (isLocalImgWearCompatible(scopedKeyS, s === stageNum)) pushValid(scopedKeyS);
            }
            if (HAS_ORIGINAL_DEFAULT_IMG.has(item.editKey)) {
                for (let s = stageNum - 1; s >= 1; s--) {
                    pushValid(`${item.editKey}_${s}`);
                    candidates.push(
                        `${baseFolder}/${item.editKey}_${s}.webp`,
                        `${baseFolder}/${item.editKey}_${s}.png`,
                        `${baseFolder}/${item.editKey}_${s}.jpg`
                    );
                }
                candidates.push(
                    `${baseFolder}/${item.editKey}.webp`,
                    `${baseFolder}/${item.editKey}.png`,
                    `${baseFolder}/${item.editKey}.jpg`
                );
            }
            return [...new Set(candidates)];
        }


        async function clearCurrentProtagImages() {
            const u = detectProtagonistName(curVars) || "主角";
            if (!confirm(`🧹 确定要清理【${u}】在本局生成的所有图片并恢复默认初始底图吗？（注：⭐永恒收藏夹、永久图池、原始ZIP底图与其他旧聊天的图均100%保留！）`)) return;
            const prefix = normalizeImgKey(`${getChatStoreKey().replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_").slice(-32)}_${u}_`);
            const snapKeysToDelete = new Set((curVars.专属相册 || []).map(g => normalizeImgKey(g?.dbKey || g?.src)).filter(k => k && k.startsWith("cg_snap_")));
            try {
                const db = await openImageDB();
                const tx = db.transaction(IDB_STORE, "readwrite"), store = tx.objectStore(IDB_STORE);
                const allKnownKeys = new Set([...importedImgCache.keys(), ...dbKeyIndexSet]);
                for (const k of allKnownKeys) {
                    if (k.startsWith(prefix) || snapKeysToDelete.has(k)) {
                        store.delete(k);
                        importedImgCache.delete(k);
                        dbKeyIndexSet.delete(k);
                    }
                }
            } catch (e) {}
            if (curVars.按钮详情) {
                Object.keys(curVars.按钮详情).forEach(k => {
                    delete curVars.按钮详情[k].imgUrl;
                    delete curVars.按钮详情[k].stageImgs;
                    delete curVars.按钮详情[k].stageImgList;
                    delete curVars.按钮详情[k].forceLatestImg;
                });
            }
            Object.keys(partRandomOffsetMap).forEach(k => delete partRandomOffsetMap[k]);
            capturedZhjSrcSet.clear();
            curVars.专属相册 = [];
            userSettings.cgGallery = [];
            saveSettings();
            saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
            showToast(`🧹 已清理【${u}】的本局配图，已恢复显示默认初始底图！`, "success", 3000);
        }

        function openTrueFullscreenImage(imgSrc) {
            if (!imgSrc) return;
            let lb = document.getElementById("st-v25-fullscreen-lightbox");
            if (!lb) {
                lb = document.createElement("div"); lb.id = "st-v25-fullscreen-lightbox";
                lb.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;background:rgba(5,2,12,0.92);backdrop-filter:blur(8px);display:none;flex-direction:column;justify-content:center;align-items:center;overflow:hidden;user-select:none;";
                document.body.appendChild(lb);
            }
            const u = detectProtagonistName(curVars) || "角色";
            const isFav = isImageFavorited(imgSrc);
            let curScale = 1.0;

            lb.innerHTML = `
                <div style="position:fixed;top:14px;right:14px;z-index:2147483647;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
                    <button id="st-lb-zoom-out" type="button" title="缩小" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);border-radius:99px;padding:6px 12px;font-size:12.5px;font-weight:bold;cursor:pointer;">➖ 缩小</button>
                    <button id="st-lb-zoom-reset" type="button" title="重置大小" style="background:rgba(255,255,255,0.15);color:#fde047;border:1px solid #fde047;border-radius:99px;padding:6px 12px;font-size:12.5px;font-weight:bold;cursor:pointer;">100%</button>
                    <button id="st-lb-zoom-in" type="button" title="放大" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);border-radius:99px;padding:6px 12px;font-size:12.5px;font-weight:bold;cursor:pointer;">➕ 放大</button>
                    <button id="st-lb-fav-btn" type="button" style="background:${isFav ? 'linear-gradient(135deg,#fde047,#f59e0b)' : 'rgba(255,255,255,0.18)'};color:${isFav ? '#111' : '#fde047'};border:1.5px solid #fde047;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">${isFav ? "🌟 已收藏" : "⭐ 收藏此图"}</button>
                    <button id="st-lb-dl-btn" type="button" style="background:linear-gradient(135deg,#10b981,#06b6d4);color:#fff;border:none;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.6);">💾 保存到相册</button>
                    <button id="st-lb-close-btn" type="button" style="background:#ff003c;color:#fff;border:1.5px solid #ffe4e6;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">关闭 ✕</button>
                </div>
                <div id="st-lb-img-container" style="width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;overflow:auto;padding:20px;box-sizing:border-box;">
                    <img id="st-lb-full-img" src="${imgSrc}" style="max-width:min(92vw, 760px);max-height:86vh;width:auto;height:auto;object-fit:contain;display:block;border-radius:12px;box-shadow:0 16px 50px rgba(0,0,0,0.9), 0 0 0 1.5px rgba(244,114,182,0.45);transition:transform 0.15s ease;cursor:zoom-out;">
                </div>
            `;
            lb.style.display = "flex";

            const fullImg = lb.querySelector("#st-lb-full-img");
            const resetBtn = lb.querySelector("#st-lb-zoom-reset");
            const applyZoom = (newScale) => {
                curScale = Math.max(0.4, Math.min(3.5, Number(newScale.toFixed(2))));
                fullImg.style.transform = `scale(${curScale})`;
                resetBtn.textContent = `${Math.round(curScale * 100)}%`;
            };

            lb.querySelector("#st-lb-zoom-in").onclick = (e) => { e.stopPropagation(); applyZoom(curScale + 0.25); };
            lb.querySelector("#st-lb-zoom-out").onclick = (e) => { e.stopPropagation(); applyZoom(curScale - 0.25); };
            resetBtn.onclick = (e) => { e.stopPropagation(); applyZoom(1.0); };
            lb.onwheel = (e) => {
                e.preventDefault();
                applyZoom(curScale + (e.deltaY < 0 ? 0.15 : -0.15));
            };

            const favBtn = lb.querySelector("#st-lb-fav-btn");
            favBtn.onclick = async (e) => {
                e.stopPropagation();
                const nowFav = await toggleFavoriteImage(imgSrc, { charName: u, title: `${u} · 收藏大图` });
                favBtn.textContent = nowFav ? "🌟 已收藏" : "⭐ 收藏此图";
                favBtn.style.background = nowFav ? "linear-gradient(135deg,#fde047,#f59e0b)" : "rgba(255,255,255,0.18)";
                favBtn.style.color = nowFav ? "#111" : "#fde047";
            };
            lb.querySelector("#st-lb-dl-btn").onclick = (e) => {
                e.stopPropagation();
                downloadImageToDevice(imgSrc, `${u}_状态栏大图_${Date.now()}`);
            };
            lb.querySelector("#st-lb-close-btn").onclick = (e) => { e.stopPropagation(); lb.style.display = "none"; };
            lb.querySelector("#st-lb-img-container").onclick = (e) => {
                if (e.target === fullImg && curScale !== 1.0) { applyZoom(1.0); return; }
                lb.style.display = "none";
            };
        }

        function generateAndDownloadPoster(v, dev, u) {
            try {
                const cvs = document.createElement("canvas");
                cvs.width = 720;
                cvs.height = 980;
                const ctx = cvs.getContext("2d");

                const bgGrad = ctx.createLinearGradient(0, 0, 0, 980);
                bgGrad.addColorStop(0, "#1c0926");
                bgGrad.addColorStop(0.5, "#0d0414");
                bgGrad.addColorStop(1, "#050108");
                ctx.fillStyle = bgGrad;
                ctx.fillRect(0, 0, 720, 980);

                ctx.strokeStyle = "#fde047";
                ctx.lineWidth = 4;
                ctx.strokeRect(18, 18, 684, 944);
                ctx.strokeStyle = "rgba(244, 114, 182, 0.55)";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(26, 26, 668, 928);

                ctx.fillStyle = "#fde047";
                ctx.font = "bold 30px 'Microsoft YaHei', sans-serif";
                ctx.fillText(`📜 角色肉体与恶堕器质鉴定报告书`, 46, 76);

                ctx.fillStyle = "#f472b6";
                ctx.font = "bold 22px 'Microsoft YaHei', sans-serif";
                const objTierObj = OBJECTIFICATION_TIERS.find(t => t.id === userSettings.objectificationId) || OBJECTIFICATION_TIERS[0];
                ctx.fillText(`🎯 鉴定对象：${u} （${objTierObj.label}）`, 46, 122);

                const sp = v.体内精液存量 || {}, c = v.计数 || {};
                const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
                ctx.fillStyle = "#e2e8f0";
                ctx.font = "17px 'Microsoft YaHei', sans-serif";
                ctx.fillText(`🖤 淫乱恶堕度：${safeNum(v.核心数值?.淫乱恶堕)}%   ｜   😳 羞耻防线：${safeNum(v.精神与心理?.羞耻度, 100)}%   ｜   🙇 服从度：${safeNum(v.精神与心理?.服从度)}%`, 46, 162);
                ctx.fillText(`🥛 四穴总储精：${totalMl} ml （子宫 ${safeNum(sp.子宫毫升)}ml / 小穴 ${safeNum(sp.小穴毫升)}ml / 胃袋 ${safeNum(sp.口内毫升)}ml / 直肠 ${safeNum(sp.屁眼毫升)}ml）`, 46, 194);
                ctx.fillText(`💎 累计总账：小穴贯穿 ${safeNum(c.性交?.小穴)}次 ｜ 无套内射 ${safeNum(c.射精?.内射)}次 ｜ 绝顶高潮 ${safeNum(c.高潮?.总数)}次 ｜ 失禁 ${safeNum(c.失控?.失禁)}次`, 46, 226);

                ctx.fillStyle = "#fde047";
                ctx.font = "bold 21px 'Microsoft YaHei', sans-serif";
                ctx.fillText(`🌸 六孔不可逆器质崩坏度遥测：`, 46, 278);

                const organs = [
                    { name: "👄 骚口与咽喉崩坏度", val: dev.mouthObj.val, col: "#fb7185" },
                    { name: "🍒 乳房与乳腺崩坏度", val: dev.chestObj.val, col: "#f472b6" },
                    { name: "🌺 小穴与括约肌崩坏", val: dev.vagObj.val, col: "#e11d48" },
                    { name: "🫀 子宫与宫颈口脱垂", val: dev.wombObj.val, col: "#d946ef" },
                    { name: "💧 阴蒂与尿道失禁度", val: dev.clitObj.val, col: "#facc15" },
                    { name: "🕳️ 后庭与直肠外翻度", val: dev.analObj.val, col: "#a855f7" }
                ];

                organs.forEach((o, i) => {
                    const y = 315 + i * 64;
                    ctx.fillStyle = "#fdf2f8";
                    ctx.font = "bold 17px 'Microsoft YaHei', sans-serif";
                    ctx.fillText(`${o.name}：${o.val}/100 （${stageNameFromVal(o.val)}）`, 46, y);
                    ctx.fillStyle = "rgba(255,255,255,0.12)";
                    ctx.fillRect(46, y + 10, 628, 18);
                    ctx.fillStyle = o.col;
                    ctx.fillRect(46, y + 10, Math.round(6.28 * o.val), 18);
                });

                ctx.fillStyle = "#fde047";
                ctx.font = "bold 20px 'Microsoft YaHei', sans-serif";
                ctx.fillText(`🎧 实时内心独白采样：`, 46, 735);

                const quote = generateLiveASMRQuote(v, u);
                ctx.fillStyle = "#fbcfe8";
                ctx.font = "italic 17px 'Microsoft YaHei', sans-serif";
                const words = quote.split("");
                let line = "", ly = 772;
                for (let i = 0; i < words.length; i++) {
                    line += words[i];
                    if (ctx.measureText(line).width > 610) {
                        ctx.fillText(line, 46, ly);
                        line = "";
                        ly += 28;
                    }
                }
                if (line) ctx.fillText(line, 46, ly);

                ctx.fillStyle = "#94a3b8";
                ctx.font = "14px Consolas, 'Microsoft YaHei', sans-serif";
                ctx.fillText(`鉴定时间：${new Date().toLocaleString()}   ｜   状态栏 1.0 全息内窥鉴定中心出品`, 46, 932);

                const dUrl = cvs.toDataURL("image/png");
                downloadImageToDevice(dUrl, `${u}_恶堕器质鉴定报告书_${Date.now()}`);
            } catch (e) {
                showToast("❌ 海报生成失败：" + e.message, "error");
            }
        }

        let lastImageGenFinishTime = 0;
        const autoGenQueue = [];
        let prevRecordedTiersForAutoGen = {};

        // 把 NAI 的 1.8::tag:: 转换为 ComfyUI 认识的 (tag:1.3) 圆括号权重
        function naiWeightToComfyWeight(str) {
            if (!str) return "";
            let res = String(str);
            for (let pass = 0; pass < 3; pass++) {
                res = res.replace(/(\d+(?:\.\d+)?)::([^:]+?)::/g, (_, w, content) => {
                    const c = content.trim().replace(/^,+|,+$/g, "").trim();
                    if (!c) return "";
                    const numW = parseFloat(w) || 1.0;
                    const safeW = numW > 1.45 ? Number((1.25 + (numW - 1.45) * 0.15).toFixed(2)) : numW;
                    return safeW === 1 ? c : `(${c}:${safeW})`;
                });
            }
            return res.replace(/\d+(?:\.\d+)?::/g, "").replace(/::/g, "");
        }

        // 🧬 专门提取鬼怪、百目蛛音、魅魔、美女蛇、史莱姆、克苏鲁不可名状等一切非人魔物特征
        function extractMonsterAndSpeciesBoost(fullCharDna) {
            const s = safeStr(fullCharDna);
            const sLow = s.toLowerCase();
            const monsterFullTags = [];
            const monsterLocalSkinTags = [];
            const isSpiderGhost = /glowing eerie eyes|multiple glowing eyes|百目|蛛音|spider web/i.test(s);

            OPEN_MORPH_DICTIONARY.forEach(item => {
                if (item.id === "succubus_demon" && isSpiderGhost && !/demon horns|succubus tail/.test(sLow)) return;
                if (item.reg.test(s) || sLow.includes(item.id) || (item.id === "undead_ghost" && /ghost girl|supernatural apparition/.test(sLow))) {
                    monsterFullTags.push(item.en);
                }
            });

            if (isSpiderGhost) {
                monsterFullTags.push("supernatural ghost girl, multiple glowing eerie eyes embedded in purple-red skin seams on back and thighs, pink sticky spider web threads");
                monsterLocalSkinTags.push("glowing eerie eyes embedded in skin seams, sticky pink spider web threads");
            }
            if (/oni horns|red demon horns|赤角/i.test(s)) {
                monsterFullTags.push("oni girl, red oni horns, sharp fangs, glowing golden markings on skin");
                monsterLocalSkinTags.push("glowing golden oni markings on hot skin");
            }
            if (/ghost girl|yurei|supernatural apparition|translucent/i.test(s)) {
                monsterFullTags.push("ghost girl, supernatural apparition, eerie dark mist aura, pale cold skin");
                monsterLocalSkinTags.push("pale cold supernatural ghost skin");
            }
            if (/slime|translucent gelatinous/i.test(sLow)) {
                monsterLocalSkinTags.push("translucent gelatinous slime flesh, dripping viscous slime fluid");
            }
            if (/lamia|snake tail|snake scales/i.test(sLow)) {
                monsterLocalSkinTags.push("glistening snake scales on skin edges");
            }
            if (/arachne|chitin|exoskeleton/i.test(sLow)) {
                monsterLocalSkinTags.push("glossy dark chitinous arthropod exoskeleton plates");
            }
            if (/eldritch|abomination|flesh mound/i.test(sLow)) {
                monsterLocalSkinTags.push("eldritch writhing flesh tendrils, multiple glowing eyes on flesh, dark slime");
            }
            if (/cyborg|ball-jointed doll|mechanical joints/i.test(sLow)) {
                monsterLocalSkinTags.push("ball-jointed doll seams, mechanical joints");
            }

            const wild = mineWildDynamicTraits(s);
            wild.wildEn.forEach(w => {
                monsterFullTags.push(w);
                monsterLocalSkinTags.push(w);
            });

            return {
                fullMonsterStr: [...new Set(monsterFullTags)].join(", "),
                localMonsterStr: [...new Set(monsterLocalSkinTags)].join(", ")
            };
        }

        // 🌐 全通用【按钮中文描述 ➔ Danbooru 英文绘画 Tag】自由词根组合编译器（不绑死任何特定角色，按钮写什么就画什么！）
        function compileButtonDescriptionDirectToImageTags(item, fullCharDna, realStageIdx = 1) {
            if (!item) return { directPosBoost: "", extraNegStr: "", hasAnatomyMutation: false, hasMultiBreastsInBtn: false };
            const key = String(item.editKey || "");
            const fullDesc = `${safeStr(item.rawKey)} ${safeStr(item.desc)} ${safeStr(curVars?.按钮详情?.[key]?.desc)} ${safeStr(curVars?.按钮详情?.[key]?.stage)}`;
            const visualObj = translateAnyButtonDescToVisualTags(fullDesc, key, fullCharDna);
            const comfyPosBoost = naiWeightToComfyWeight(visualObj.posBoostStr);
            const hasMultiBreastsInBtn = /four breasts|six breasts|three breasts|4 breasts|two pairs of breasts/i.test(`${comfyPosBoost} ${fullCharDna}`);

            return {
                directPosBoost: comfyPosBoost,
                extraNegStr: visualObj.extraNegStr || "",
                hasAnatomyMutation: visualObj.isMutatedAnatomy || Boolean(comfyPosBoost),
                hasMultiBreastsInBtn
            };
        }

        function optimizeTagsForComfyUI(rawPos, rawNeg, itemKey, fullCharDna, realStageIdx = 1, itemObj = null) {
            const key = String(itemKey || "");
            const stgIdx = Math.min(5, Math.max(0, (Number(realStageIdx) || 1) - 1));
            const headDna = getHeadOnlyDnaTags(fullCharDna);
            const skinDna = getSkinOnlyDnaTags(fullCharDna, false);
            const bodyProf = getBodySizeAndBreastProfile(fullCharDna);
            const { fullMonsterStr, localMonsterStr } = extractMonsterAndSpeciesBoost(fullCharDna);

            const { directPosBoost, extraNegStr, hasAnatomyMutation, hasMultiBreastsInBtn } = compileButtonDescriptionDirectToImageTags(itemObj || { editKey: key }, fullCharDna, realStageIdx);
            const hasDoublePussyInBtn = /double pussy|two vaginas/i.test(directPosBoost);
            const hasFourEyesInBtn = /four eyes|two pairs of eyes/i.test(`${directPosBoost} ${fullCharDna}`);

            const outfitEdgeHint = /gothic lolita|black lace/i.test(fullCharDna) ? "black lace frills trim" : "";
            const stockingEdgeHint = /white kneehighs|white.*stocking/i.test(fullCharDna) ? "white stockings edge" : (/black.*stocking|black.*thighhigh|black.*pantyhose/i.test(fullCharDna) ? "black stockings edge" : "");
            const localSkinTags = [skinDna, localMonsterStr].filter(Boolean).join(", ");

            let cleanPos = rawPos
                .replace(/\bredraw_\d+_\d+\s*,?\s*/gi, "")
                .replace(/extreme macro close-up of [^,]+only|extreme macro internal anatomical cross-section[^,]+only|extreme close-up of [^,]+only|cropped [^,]+filling the (?:entire )?frame|filling the entire frame|cropped lower face below nose|cropped headless chest|micro crotch focus|rear butt focus|medical cutaway diagram|headshot only|crotch filling the entire frame|low angle foot focus|headless cropped [^,]+focus/gi, "")
                .replace(/\b(?:no full body|no exterior body|no torso|no head|no eyes|no eyes visible|no neck|no shoulders|no chest|no breasts|no human legs|no human feet|no semen|no sperm|no penis|no male|no cleavage|no panties|no shirt|no skirt|no pants|no stockings|no shoes|no writing|no marks|no tattoo|no metal rings|no toys|out of frame head|out of frame)\b\s*,?/gi, "")
                .replace(/\b(?:masterpiece|best quality|ultra-detailed|NSFW|general|safe)\b\s*,?/gi, "")
                .replace(/,\s*,+/g, ", ")
                .replace(/^,\s*|,\s*$/g, "")
                .trim();

            // 🛡️ 物理级跨部位隔离墙：非胸部按钮一律删光所有 breasts 词条；非小穴按钮一律删光所有 pussy 词条！
            if (!["胸部实况", "穿搭_胸罩", "穿搭_上衣", "穿刺环饰", "肉体外貌", "当前姿势", "身份与背景"].includes(key)) {
                cleanPos = cleanPos.replace(/\b(?:four breasts|two pairs of breasts|4 breasts|six breasts|three breasts|multiple breasts|extra breasts|huge breasts|large breasts|medium breasts|small breasts|flat chest|plump breasts|full breasts|breasts|nipples|areola|cleavage|lactation)\b\s*,?/gi, "");
            }
            if (!["小穴实况", "阴蒂尿道", "穿搭_内裤", "体内道具", "破瓜纪念", "肉体外貌", "当前姿势"].includes(key)) {
                cleanPos = cleanPos.replace(/\b(?:double pussy|extra pussy|two vaginas|multiple pussies|multiple vaginas|two vertically stacked vaginas|twin vulvas|pussy|vulva|labia|vagina|clitoris)\b\s*,?/gi, "");
            }

            // ★ 根治“4奶变6奶”：一旦存在多乳，把 cleanPos 里所有残留的 breasts / nipples 全部清零，只由 cameraFocusTag 输出唯一一次 (four breasts:1.4)！
            if (hasMultiBreastsInBtn) {
                cleanPos = cleanPos.replace(/\b(?:four breasts|two pairs of breasts|4 breasts|six breasts|three breasts|multiple breasts|extra breasts|flat chest|tiny small breasts|small flat pink nipple buds|petite small breasts|medium perky breasts|medium breasts|large breasts|huge breasts|plump breasts|full breasts|breasts|no cleavage)\b\s*,?/gi, "");
            }
            // ★ 根治“2穴变4穴”：一旦存在双穴，把 cleanPos 里所有残留的 pussy / vagina / labia / slit 全部清零，只由 cameraFocusTag 输出唯一一次 (double pussy, two vaginas:1.5)！
            if (hasDoublePussyInBtn) {
                cleanPos = cleanPos.replace(/\b(?:double pussy|extra pussy|two vaginas|twin vulvas|multiple pussies|multiple vaginas|tight closed pink labia|virgin slit|tightly closed pink virgin pussy slit|pussy|vulva|vagina)\b\s*,?/gi, "");
            }

            const stripFullBodyTriggers = (str) => str
                .replace(/\b(?:1girl|1boy|solo|petite loli body|voluptuous body|curvy body|slender girl body|petite slender frame|voluptuous curvy frame|slender frame|slender narrow waist|curvy waist|slender waist|wide plump hips|delicate small hips|plump hips|neat hips|plump round butt|thin slender thighs|thick soft thighs|soft thighs|smooth thighs|cowboy shot|full body shot|upper body portrait|medium shot|wide shot|detailed background|dark background|outdoor[^\s,]*|alleyway[^\s,]*|vending machine[^\s,]*)\b\s*,?/gi, "")
                .replace(/,\s*,+/g, ", ")
                .replace(/^,\s*|,\s*$/g, "")
                .trim();

            let cameraFocusTag = "";
            let extraNegBoost = "2girls, multiple girls, multiple views, multiple panels, split screen, picture in picture, inset, comic, 4koma, manga panel, grid, clone, duplicate, scenery, city, buildings, architecture, crowd, ";

            if (key === "骚口实况") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                cameraFocusTag = `(extreme close-up, macro photography, mouth focus, lips focus:1.6), ${directPosBoost ? directPosBoost + ", " : ""}(parted lips, tongue, saliva, lower face chin only:1.5), (${localSkinTags}:1.3)`;
                extraNegBoost += "(full body, upper body, torso, eyes, forehead, hair, twintails, breasts, chest, nipples, four breasts, pussy, vagina, shoulders, arms, legs, background, scenery:1.95), ";
            } else if (key === "胸部实况" || key === "穿搭_胸罩") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                // ★ 当有四乳时，绝不再叠加 plump breasts，直接只用 directPosBoost 里的 (four breasts:1.4) + (pink nipples, areola:1.3)！
                const breastCoreTag = hasMultiBreastsInBtn
                    ? `${directPosBoost}, (pink nipples, areola:1.25)`
                    : `${directPosBoost ? directPosBoost + ", " : ""}(${bodyProf.breastByStage[stgIdx] || bodyProf.breastByStage[0]}:1.4)`;
                cameraFocusTag = `(extreme close-up, macro photography, chest focus:1.6), ${breastCoreTag}, (cropped chest filling frame:1.45), (${localSkinTags}${outfitEdgeHint ? ", " + outfitEdgeHint : ""}:1.3)`;
                extraNegBoost += "(head, face, eyes, mouth, hair, twintails, glasses, full body, lower body, hips, thighs, legs, pussy, vagina, vulva, double pussy, ass, background:1.95), ";
            } else if (key === "小穴实况" || key === "阴蒂尿道" || key === "体内道具" || key === "穿搭_内裤") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                // ★ 当有双穴时，只输出唯一一次 (double pussy, two vaginas:1.55)，绝不重复叠加！
                const pussyCoreTag = hasDoublePussyInBtn
                    ? `${directPosBoost}, (close-up between legs:1.45)`
                    : `(vulva, labia, mons pubis, close-up between legs:1.6)${directPosBoost ? ", " + directPosBoost : ""}`;
                cameraFocusTag = `(extreme close-up, macro photography, crotch focus:1.65), ${pussyCoreTag}, (${localSkinTags}${stockingEdgeHint ? ", " + stockingEdgeHint : ""}:1.3)`;
                extraNegBoost += "(head, face, eyes, mouth, hair, twintails, glasses, breasts, chest, nipples, four breasts, multiple breasts, torso, upper body, full body, knees, calves, ankles, feet, shoes, standing, background, city, buildings:1.95), ";
            } else if (key === "屁眼实况") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                cameraFocusTag = `(extreme close-up, macro photography, anus focus, ass focus:1.65), ${directPosBoost ? directPosBoost + ", " : ""}(anal pucker, spread butt cheeks, rear close-up:1.6), (${localSkinTags}:1.3)`;
                extraNegBoost += "(head, face, eyes, mouth, hair, twintails, glasses, breasts, chest, nipples, four breasts, pussy, vagina, double pussy, upper body, torso, full body, knees, calves, feet, shoes, background, scenery:1.95), ";
            } else if (key === "子宫实况" || key === "排卵周期" || key === "受精断面") {
                cleanPos = stripFullBodyTriggers(cleanPos)
                    .replace(/\b(?:cross-section|cutaway|x-ray|medical|diagram|anatomical)\b\s*,?/gi, "")
                    .replace(/,\s*,+/g, ", ").trim();
                const spNow = curVars?.体内精液存量 || {};
                const hasSpermNow = (stgIdx >= 1 && (safeNum(spNow.子宫毫升) > 0 || safeNum(curVars?.计数?.射精?.内射) > 0));
                if (key === "排卵周期") {
                    const ovaryState = hasSpermNow
                        ? "glowing pink ovary and fallopian tube, mature ovum surrounded by white fluid"
                        : "biological glowing pink ovary organ and fallopian tube, glowing pink ovum cell, pure biological cellular macro photography";
                    cameraFocusTag = `(no humans, single macro view, biological microscopic photography, internal organ illustration:1.65), (${ovaryState}:1.55), (dark biological background, centered single organ:1.4)`;
                } else {
                    const wombState = hasSpermNow
                        ? "pink uterine cavity organ filled with white fluid, dilated cervical canal"
                        : "pure pink uterine cavity organ, tight closed cervical canal, single glowing ovum cell inside";
                    cameraFocusTag = `(no humans, single macro view, anatomical organ illustration, biological macro photography:1.65), (${wombState}:1.55), (centered single organ, simple dark background:1.4)`;
                }
                extraNegBoost += "(1girl, 1boy, girl, boy, human body, torso, thighs, legs, hips, ass, breasts, nipples, four breasts, pussy, vulva, double pussy, face, head, hair, sex, vaginal penetration, insertion, multiple views, multiple panels, inset, cross-section inset, x-ray inset, 3koma, 2koma, comic, border, frame:1.95), " + (hasSpermNow ? "(penis, male, testicles, fingers:1.85), " : "(penis, phallus, glans, testicles, male, cum, semen, ejaculation, internal cumshot, sex, penetration:1.95), ");
            } else if (key === "淫纹烙印" || key === "孕肚进度" || key === "精液归属" || key === "正字涂鸦") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                cameraFocusTag = `(extreme close-up, macro photography, belly focus, lower abdomen focus:1.65), ${directPosBoost ? directPosBoost + ", " : ""}(navel, stomach skin close-up:1.55), (${localSkinTags}:1.35)`;
                extraNegBoost += "(head, face, eyes, mouth, hair, twintails, glasses, full body, breasts, chest, nipples, four breasts, knees, calves, feet, shoes, background, scenery:1.95), ";
            } else if (key === "穿搭_头饰" || key === "内心独白") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                cameraFocusTag = `(solo, 1girl, single character:1.5), (extreme close-up, portrait, headshot, face focus, eyes and hair focus:1.6), ${directPosBoost ? directPosBoost + ", " : ""}(${headDna}:1.45)`;
                extraNegBoost += "(full body, cowboy shot, upper body, torso, breasts, chest, nipples, four breasts, cleavage, waist, hips, legs, crotch, pussy, double pussy:1.95), ";
            } else if (key === "穿搭_颈部") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                cameraFocusTag = `(extreme close-up, macro photography, neck focus, collarbone focus:1.65), (throat, jawline, choker, collar:1.55), (${localSkinTags}:1.35)`;
                extraNegBoost += "(full body, lower body, legs, eyes, forehead, top of head, breasts, nipples, four breasts, pussy, double pussy, waist, hips, background:1.95), ";
            } else if (key === "穿搭_上衣") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                const topBreastPart = hasMultiBreastsInBtn ? "" : `, ${bodyProf.breastByStage[0]}`;
                cameraFocusTag = `(close-up, upper torso focus, shirt focus, topwear focus:1.6), ${directPosBoost ? directPosBoost + ", " : ""}(${localSkinTags}${topBreastPart}:1.4)`;
                extraNegBoost += "(head, face, eyes, mouth, hair, glasses, full body, hips, butt, crotch, pussy, double pussy, thighs, legs, knees, feet, shoes:1.95), ";
            } else if (key === "穿搭_下装") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                cameraFocusTag = `(close-up, hips focus, skirt focus, lower waist focus:1.6), ${directPosBoost ? directPosBoost + ", " : ""}(pelvis, upper thighs:1.5), (${localSkinTags}${stockingEdgeHint ? ", " + stockingEdgeHint : ""}:1.35)`;
                extraNegBoost += "(head, face, eyes, hair, glasses, upper body, breasts, chest, nipples, four breasts, shoulders, arms, knees, calves, feet, shoes:1.95), ";
            } else if (key === "穿搭_丝袜") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                cameraFocusTag = `(close-up, legs focus, thighs and knees focus, stockings focus:1.6), ${directPosBoost ? directPosBoost + ", " : ""}(thighhighs, kneehighs, calves:1.5), (${localSkinTags}:1.35)`;
                extraNegBoost += "(head, face, eyes, hair, glasses, upper body, torso, breasts, chest, nipples, four breasts, pussy, vulva, double pussy, abdomen, waist:1.95), ";
            } else if (key === "穿搭_鞋子") {
                cleanPos = stripFullBodyTriggers(cleanPos);
                cameraFocusTag = `(extreme close-up, macro photography, feet focus, shoes focus:1.65), (footwear, ankles, toes, ground level close-up:1.55), (${localSkinTags}${stockingEdgeHint ? ", " + stockingEdgeHint : ""}:1.3)`;
                extraNegBoost += "(head, face, eyes, hair, glasses, upper body, breasts, chest, nipples, four breasts, torso, waist, hips, butt, crotch, pussy, vulva, double pussy, thighs:1.95), ";
            } else {
                const isTrueDuoSex = /\b(?:1boy|multiple boys|hetero|gangbang)\b/i.test(cleanPos) && stgIdx >= 1 && (key.startsWith("client_") || key.startsWith("fetish_") || key === "破瓜纪念" || key === "六孔总账" || key === "当前姿势" || key === "cockLove");
                fullCharDna.split(",").forEach(dnaPart => {
                    const dp = dnaPart.trim();
                    if (dp && dp.length > 3) {
                        cleanPos = cleanPos.replace(new RegExp(dp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*,?", "gi"), "");
                    }
                });
                cleanPos = cleanPos.replace(/\b(?:1girl|solo)\b\s*,?/gi, "").replace(/,\s*,+/g, ", ").trim();

                const charCountLock = isTrueDuoSex
                    ? `(single view, 1girl, 1boy, hetero:1.45)`
                    : `(single view, solo, 1girl, single character:1.55)`;
                if (!isTrueDuoSex) {
                    extraNegBoost += "(2girls, multiple girls, 1boy, male, penis, multiple people, crowd, clone, split screen:1.8), ";
                }
                const fullDnaWithMonster = [fullCharDna, fullMonsterStr].filter(Boolean).join(", ");
                cameraFocusTag = `${charCountLock}, (${fullDnaWithMonster}:1.45), ${directPosBoost ? directPosBoost + ", " : ""}(${bodyProf.bodyTag}:1.35)`;
            }

            // 严禁 cameraFocusTag 和后面再重复拼接同一段 directPosBoost！
            const finalComfyPos = `masterpiece, best quality, ultra-detailed, highres, ${cameraFocusTag}, ${cleanPos}`
                .replace(/,\s*,+/g, ", ")
                .replace(/^,\s*|,\s*$/g, "")
                .trim();

            const cleanExtraNeg = naiWeightToComfyWeight(extraNegStr);
            let finalComfyNeg = `lowres, worst quality, bad quality, bad hands, text, watermark, signature, ${extraNegBoost}${cleanExtraNeg ? cleanExtraNeg + ", " : ""}${rawNeg}`
                .replace(/,\s*,+/g, ", ")
                .trim();
            if (hasAnatomyMutation || hasDoublePussyInBtn || hasMultiBreastsInBtn || hasFourEyesInBtn) {
                finalComfyNeg = finalComfyNeg.replace(/\b(?:bad anatomy|extra digits|deformed|mutated)\s*,?\s*/gi, "");
            }
            if (hasMultiBreastsInBtn) {
                finalComfyNeg = finalComfyNeg.replace(/\b(?:huge breasts|gigantic breasts|large breasts|deep cleavage|extra breasts|extra nipples)\s*,?\s*/gi, "");
            }

            return { finalComfyPos, finalComfyNeg };
        }

        function parsePromptFromImageBlock(blockTxt, itemKey = "", u = "", realStageIdx = 1, itemObj = null) {
            const hashReg = new RegExp("image" + "###([\\s\\S]*?)###", "i");
            const sceneMatch = blockTxt.match(hashReg);
            const rawPrompt = sceneMatch ? sceneMatch[1] : blockTxt;

            const ucMatch = rawPrompt.match(/(?:Char1\s*)?UC:([^;]+);?/i);
            const rawNegContent = ucMatch ? ucMatch[1].trim() : "lowres, text, watermark, full body";
            const negPrompt = rawNegContent.replace(/\d+(?:\.\d+)?::/g, "").replace(/::/g, "").replace(/[;\n\r]+/g, ", ").trim();
            const comfyWeightedNeg = naiWeightToComfyWeight(rawNegContent).replace(/[;\n\r]+/g, ", ").trim();

            let posSection = rawPrompt.replace(/(?:Char1\s*)?UC:[^;]+;?/gi, "").replace(/\|centers:[A-Z0-9]+/gi, "");
            const sMatch = posSection.match(/Scene:([^;]+);?/i);
            let mergedRawPos = sMatch ? sMatch[1] : posSection;

            const comfyWeightedPos = naiWeightToComfyWeight(mergedRawPos)
                .replace(/Scene:|Char1:|centers:[A-Z0-9]+|\|/gi, "")
                .replace(/[;\n\r]+/g, ", ")
                .replace(/,\s*,+/g, ", ")
                .trim();

            const posPrompt = comfyWeightedPos.replace(/\(([^()]+?):\d+(?:\.\d+)?\)/g, "$1").trim();
            const fullCharDna = getLockedAppearanceTags(u || detectProtagonistName(curVars), curVars);
            const { finalComfyPos, finalComfyNeg } = optimizeTagsForComfyUI(comfyWeightedPos, comfyWeightedNeg, itemKey, fullCharDna, realStageIdx, itemObj);

            return {
                posPrompt,
                negPrompt,
                finalComfyPos,
                finalComfyNeg,
                rawInner: sceneMatch ? sceneMatch[1].trim() : blockTxt
            };
        }

        // 模拟真人鼠标完整点击（触发 pointerdown -> mousedown -> mouseup -> click）
        function simulateRealHumanClick(el) {
            if (!el) return;
            try {
                ["pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach(evtType => {
                    el.dispatchEvent(new MouseEvent(evtType, { bubbles: true, cancelable: true, view: window }));
                });
                if (typeof el.click === "function") el.click();
            } catch (e) {}
        }

        // 自动扫描并点击智绘姬在正文里生成的生图按钮
        function autoClickZhjTriggerInMes(lastMesTextEl, oldNodesSnapshot) {
            if (!lastMesTextEl) return 0;
            let clicked = 0;
            const customSel = safeStr(userSettings.zhjCustomSelector).trim();
            if (customSel) {
                try {
                    lastMesTextEl.querySelectorAll(customSel).forEach(el => {
                        if (!el.getAttribute("data-st-autoclicked")) {
                            el.setAttribute("data-st-autoclicked", "1");
                            simulateRealHumanClick(el);
                            clicked++;
                        }
                    });
                } catch (e) {}
            }
            const allNow = Array.from(lastMesTextEl.querySelectorAll("*"));
            for (const node of allNow) {
                if (oldNodesSnapshot && oldNodesSnapshot.has(node)) continue;
                if (node.getAttribute("data-st-autoclicked")) continue;
                const tag = node.tagName.toLowerCase();
                const cls = String(node.className || "").toLowerCase();
                const txt = String(node.textContent || "").trim();
                const title = String(node.getAttribute("title") || node.getAttribute("aria-label") || "").trim();
                const curStyle = window.getComputedStyle(node).cursor;

                const isTrigger =
                    tag === "button" || tag === "a" || tag === "i" || tag === "svg" ||
                    curStyle === "pointer" || node.onclick != null ||
                    /zhj|nai|comfy|sd|img|image|gen|draw|pic|paint|btn|button|trigger|placeholder/i.test(cls) ||
                    /生图|生成|画图|绘制|点击|重试|加载|image###|Generate|Draw/i.test(txt + " " + title);

                if (isTrigger) {
                    node.setAttribute("data-st-autoclicked", "1");
                    simulateRealHumanClick(node);
                    clicked++;
                }
            }
            return clicked;
        }

        // 录制玩家点击的智绘姬生图按钮特征
        window.__stRecordZhjButton = function(btnEl) {
            showToast("🎯 请现在去聊天正文里，手动点一下那个【智绘姬生图按钮】！状态栏将永久记住它！", "info", 6000);
            if (btnEl) btnEl.textContent = "⏳ 请去正文点一下生图按钮...";
            const handler = (ev) => {
                const target = ev.target;
                if (!target || target.closest("#st-v5-root, #st-v5-panel, #st-v5-modal")) return;
                document.removeEventListener("click", handler, true);
                let sel = target.tagName.toLowerCase();
                if (target.id) sel += "#" + target.id;
                else if (target.className && typeof target.className === "string") {
                    const firstCls = target.className.trim().split(/\s+/).filter(c => !c.startsWith("st-"))[0];
                    if (firstCls) sel += "." + firstCls;
                }
                userSettings.zhjCustomSelector = sel;
                saveSettings();
                if (isSettingsOpen) renderBody();
                showToast(`✅ 已成功记住生图按钮特征：【${sel}】！以后点生图会自动替你秒点它！`, "success", 4500);
            };
            setTimeout(() => document.addEventListener("click", handler, true), 120);
        };

        let _genBusyLockTimestamp = 0;
        async function silentBackgroundGenerateImage(item, curStageIdx, u, btnEl = null) {
            if (isGeneratingImageBusy) {
                if (Date.now() - _genBusyLockTimestamp > 95000) {
                    console.warn("[状态栏1.0] 检测到上一张生图超时未响应，自动解锁！");
                    isGeneratingImageBusy = false;
                } else {
                    showToast("⏳ 当前已有图片正在后台绘制中，请稍候...", "warn", 2500);
                    return false;
                }
            }
            isGeneratingImageBusy = true;
            _genBusyLockTimestamp = Date.now();

            const realStageIdx = curStageIdx || getItemRealStageNum(item, curVars);
            const uniqueRedrawSeed = `redraw_${Date.now().toString().slice(-5)}_${Math.floor(Math.random() * 900 + 100)}`;
            const rawBlockTxt = buildDanbooruImageBlock(item, realStageIdx, u);
            const scenePrefixReg = new RegExp("image" + "###Scene:", "i");
            const naiBlockTxt = rawBlockTxt
                .replace(/\[([^\]]+)\]/, `[$1_${uniqueRedrawSeed}]`)
                .replace(scenePrefixReg, "image" + "###Scene:" + uniqueRedrawSeed + ", ");

            const { posPrompt, negPrompt, finalComfyPos, finalComfyNeg, rawInner } = parsePromptFromImageBlock(naiBlockTxt, item.editKey, u, realStageIdx, item);

            // 根据用户在设置中选择的模式，决定注入给智绘姬的生图块格式：
            // 1. "comfy_tag" (ComfyUI <image>包裹精调模式 —— 你的环境实测成功且自带外貌锁+局部特写优化！)
            // 2. "comfy_scene_uc" (ComfyUI 带 UC 负面词精调模式 —— 进一步强化局部特写防画脸！)
            // 3. "nai_original" (NovelAI 以前的原版模式 —— 100% 保持原汁原味！)
            const zhjMode = userSettings.zhjBackendMode || "comfy_tag";
            const IMG_OPEN = "<" + "image>";
            const IMG_CLOSE = "</" + "image>";

            let blockTxt = naiBlockTxt;
            if (zhjMode === "comfy_tag") {
                blockTxt = `${IMG_OPEN}\nimage###${finalComfyPos}###\n${IMG_CLOSE}`;
            } else if (zhjMode === "comfy_scene_uc") {
                blockTxt = `${IMG_OPEN}\nimage###Scene:${finalComfyPos};\nChar1 UC:${finalComfyNeg};###\n${IMG_CLOSE}`;
            } else if (zhjMode === "comfy_hash_only") {
                blockTxt = `image###${finalComfyPos}###`;
            }

            const scopedStageKey = getProtagScopedImgKey(item.editKey || "custom", realStageIdx);
            const normScopedKey = normalizeImgKey(scopedStageKey);
            const oldBtnTxt = btnEl ? btnEl.textContent : "";
            if (btnEl) { btnEl.textContent = "⏳ 重绘中..."; btnEl.disabled = true; }
            showToast(`🎨 正在为【${u}】绘制【${item.cleanTitle || item.editKey} (第${realStageIdx}阶)】...`, "info", 4000);

            const prevBtnImg = curVars.按钮详情?.[item.editKey]?.forceLatestImg || curVars.按钮详情?.[item.editKey]?.imgUrl || "";
            const lockedChatKeyAtStart = getChatStoreKey();
            const lockedCharNameAtStart = u;

            const saveAndMountImg = async (imgSrc) => {
                if (!imgSrc) return false;
                capturedZhjSrcSet.add(imgSrc);
                capturedZhjSrcSet.add(getImgFingerprint(imgSrc));

                let finalSrc = imgSrc;
                if (!finalSrc.startsWith("data:") && !finalSrc.startsWith("http") && !finalSrc.startsWith("blob:") && !finalSrc.startsWith("/")) {
                    finalSrc = `data:image/png;base64,${finalSrc}`;
                }
                if (finalSrc.startsWith("blob:") || finalSrc.startsWith("http") || finalSrc.startsWith("/")) {
                    try {
                        const resp = await fetch(finalSrc, { cache: "no-store" });
                        const blob = await resp.blob();
                        finalSrc = await blobToDataUrl(blob, `gen_${Date.now()}.webp`);
                    } catch (e) {}
                }
                capturedZhjSrcSet.add(finalSrc);
                capturedZhjSrcSet.add(getImgFingerprint(finalSrc));

                if (finalSrc.startsWith("data:")) {
                    await rawSaveDataUrlToDB(normScopedKey, finalSrc).catch(() => {});
                    importedImgCache.set(normScopedKey, finalSrc);
                }
                const lightRef = finalSrc.startsWith("data:") ? normScopedKey : finalSrc;
                const poolRefKey = await registerImageToReusablePool(item.editKey, realStageIdx, finalSrc, lockedCharNameAtStart, { clientName: item.clientName });
                const effectiveRef = poolRefKey || lightRef;

                const curNowChar = detectProtagonistName(curVars);
                if (getChatStoreKey() !== lockedChatKeyAtStart || curNowChar !== lockedCharNameAtStart) {
                    if (getChatStoreKey() === lockedChatKeyAtStart && curVars.角色独立槽位?.[lockedCharNameAtStart]) {
                        const slot = curVars.角色独立槽位[lockedCharNameAtStart];
                        slot.按钮详情 = slot.按钮详情 || {};
                        const pObj = slot.按钮详情[item.editKey] || {};
                        const pList = Array.isArray(pObj.stageImgList?.[realStageIdx]) ? pObj.stageImgList[realStageIdx] : [];
                        slot.按钮详情[item.editKey] = {
                            ...pObj,
                            imgUrl: effectiveRef,
                            forceLatestImg: effectiveRef,
                            stageImgs: { ...(pObj.stageImgs || {}), [realStageIdx]: effectiveRef },
                            stageImgList: { ...(pObj.stageImgList || {}), [realStageIdx]: [effectiveRef, ...pList.filter(x => x !== effectiveRef)] }
                        };
                        saveChatCache(curVars);
                    }
                    showToast(`✅ 【${lockedCharNameAtStart} · ${item.cleanTitle || item.editKey}】后台生图已完成并存入该角色独立档案与图池！`, "success", 3000);
                    return true;
                }

                partRandomOffsetMap[item.editKey] = 0;

                if (item.isCustom && item.catTitle) {
                    const found = (curVars.自定义条目?.[item.catTitle] || []).find(x => x.id === item.editKey);
                    if (found) found.imgUrl = effectiveRef;
                }
                curVars.按钮详情 = curVars.按钮详情 || {};
                const prevObj = curVars.按钮详情[item.editKey] || {};
                const stageImgs = { ...(prevObj.stageImgs || {}), [realStageIdx]: effectiveRef };
                const prevList = Array.isArray(prevObj.stageImgList?.[realStageIdx]) ? prevObj.stageImgList[realStageIdx] : [];
                const nextList = [effectiveRef, ...prevList.filter(x => x !== effectiveRef)];
                const stageImgList = { ...(prevObj.stageImgList || {}), [realStageIdx]: nextList };
                curVars.按钮详情[item.editKey] = {
                    ...prevObj,
                    imgUrl: effectiveRef,
                    forceLatestImg: effectiveRef,
                    stageImgs,
                    stageImgList,
                    lastUpdateTs: Date.now()
                };

                curVars._lastImgGenKey = item.editKey;
                curVars._lastImgGenFloor = safeCtx()?.chat?.length || 0;
                recordToCgGallery(item.cleanTitle || item.editKey, finalSrc, realStageIdx, item.editKey);
                saveChatCache(curVars);
                latestStatus = getFallbackData();
                renderBody();

                const modalImg = document.getElementById("st-det-stage-img");
                const modalAfterImg = document.getElementById("st-det-cmp-after");
                const modalPh = document.getElementById("st-det-img-placeholder");
                const edImgInp = document.getElementById("st-ed-img");
                if (modalImg) {
                    modalImg.style.display = "none";
                    modalImg.removeAttribute("src");
                    setTimeout(() => {
                        modalImg.src = finalSrc;
                        modalImg.style.display = "block";
                    }, 40);
                }
                if (modalAfterImg) modalAfterImg.src = finalSrc;
                if (modalPh) modalPh.style.display = "none";
                if (edImgInp) edImgInp.value = effectiveRef;

                lastImageGenFinishTime = Date.now();
                showToast(`✅ 【${item.cleanTitle || item.editKey} (第${realStageIdx}阶)】生图成功，已挂载并收入永久图池！`, "success", 3200);
                return true;
            };

            const regStageImgTag = new RegExp("第[一二三四五六1-6]阶段：[^\\n<]*\\s*<" + "image>[\\s\\S]*?</" + "image>", "gi");
            const regPureImgTag = new RegExp("<" + "image>[\\s\\S]*?</" + "image>", "gi");
            const regHashBlock = new RegExp("image" + "###[\\s\\S]*?###", "gi");

            let domObserver = null;
            let origMesRaw = null;
            let origHtmlRaw = null;
            let lastIdx = -1;
            let lastMesTextEl = null;

            try {
                const customFnName = safeStr(userSettings.zhihuijiGlobalFn).trim();
                const candFns = [customFnName, "zhihuijiGenerate", "generateZhihuijiImage", "stZhihuijiGenerate"].filter(Boolean);
                for (const fnName of candFns) {
                    if (typeof window[fnName] === "function") {
                        const res = await window[fnName](zhjMode === "nai_original" ? rawInner : finalComfyPos, blockTxt, { silent: true, prompt: finalComfyPos, negative_prompt: finalComfyNeg, seed: Date.now() });
                        if (typeof res === "string" && res.length > 16) return await saveAndMountImg(res);
                        else if (res && (res.url || res.data || res.base64 || res.image)) return await saveAndMountImg(res.url || res.data || res.base64 || res.image);
                    }
                }

                const ctx = safeCtx(), chatArr = ctx?.chat || [];
                lastIdx = chatArr.length - 1;
                const allMesEls = document.querySelectorAll("#chat .mes");
                const lastMesEl = allMesEls.length ? allMesEls[allMesEls.length - 1] : null;
                lastMesTextEl = lastMesEl ? lastMesEl.querySelector(".mes_text") : null;

                if (lastMesTextEl && lastIdx >= 0 && chatArr[lastIdx]) {
                    lastMesTextEl.querySelectorAll(".st-zhj-parasite-box, .st-zhj-hidden-node").forEach(el => { try { el.remove(); } catch (e) {} });

                    pendingZhjTarget = { editKey: item.editKey, stageKey: scopedStageKey, stageIdx: realStageIdx, title: item.cleanTitle || item.editKey, isCustom: item.isCustom, catTitle: item.catTitle, ts: Date.now() };

                    origMesRaw = String(chatArr[lastIdx].mes || "");
                    origHtmlRaw = lastMesTextEl.innerHTML;

                    const oldNodesSnapshot = new Set(Array.from(lastMesTextEl.querySelectorAll("*")));
                    const existingSrcs = new Set();
                    const existingFps = new Set();
                    document.querySelectorAll("#chat .mes img").forEach(img => {
                        const s = img.getAttribute("src") || img.src || "";
                        if (s) {
                            existingSrcs.add(s);
                            existingFps.add(getImgFingerprint(s));
                        }
                    });
                    if (prevBtnImg) {
                        existingSrcs.add(prevBtnImg);
                        existingFps.add(getImgFingerprint(prevBtnImg));
                    }

                    // 1. 真实写入当前楼层末尾，让智绘姬 100% 识别
                    const cleanOrig = origMesRaw
                        .replace(regStageImgTag, "")
                        .replace(regPureImgTag, "")
                        .replace(regHashBlock, "");
                    chatArr[lastIdx].mes = cleanOrig + "\n\n" + blockTxt;

                    const updBlockFn = ctx?.updateMessageBlock || window.updateMessageBlock;
                    if (typeof updBlockFn === "function") {
                        try {
                            updBlockFn(lastIdx, chatArr[lastIdx], { rerenderMessage: true });
                        } catch (e) {}
                    } else {
                        let parasite = document.createElement("div");
                        parasite.className = "st-zhj-parasite-box";
                        const fmtFn = ctx?.messageFormatting || window.messageFormatting;
                        parasite.innerHTML = (typeof fmtFn === "function") ? (fmtFn(blockTxt, chatArr[lastIdx].name || "", false, false, lastIdx) || blockTxt) : blockTxt;
                        lastMesTextEl.appendChild(parasite);
                    }

                    // 2. 发射酒馆渲染事件唤醒智绘姬
                    if (ctx?.eventSource && ctx?.event_types) {
                        [ctx.event_types.CHARACTER_MESSAGE_RENDERED, ctx.event_types.MESSAGE_UPDATED, ctx.event_types.MESSAGE_EDITED, ctx.event_types.MESSAGE_RECEIVED].filter(Boolean).forEach(ev => {
                            try { ctx.eventSource.emit(ev, Math.max(0, lastIdx)); } catch (e) {}
                        });
                    }

                    // 3. 自动连点智绘姬在正文里生成的生图按钮
                    setTimeout(() => autoClickZhjTriggerInMes(lastMesTextEl, oldNodesSnapshot), 200);
                    setTimeout(() => autoClickZhjTriggerInMes(lastMesTextEl, oldNodesSnapshot), 650);
                    setTimeout(() => autoClickZhjTriggerInMes(lastMesTextEl, oldNodesSnapshot), 1300);

                    // 4. 轮询等待真正的新图片生成完成（旧图哪怕 DOM 节点重建也绝不抓取！）
                    const capturedSrc = await new Promise((resolve) => {
                        let ticks = 0;
                        const timer = setInterval(() => {
                            ticks++;
                            if (ticks <= 14) {
                                autoClickZhjTriggerInMes(lastMesTextEl, oldNodesSnapshot);
                            }
                            const imgs = Array.from(lastMesEl.querySelectorAll("img"));
                            for (const im of imgs) {
                                const s = im.getAttribute("src") || im.src || "";
                                if (!s || s.includes("loading") || s.includes("spinner") || s.includes("avatar") || im.closest(".avatar")) continue;
                                const fp = getImgFingerprint(s);
                                // ★ 核心防旧图锁：只要这张图的 URL 或指纹在生图前就已经存在，或者已经被抓过，直接跳过！
                                if (existingSrcs.has(s) || existingFps.has(fp) || capturedZhjSrcSet.has(s) || capturedZhjSrcSet.has(fp)) continue;

                                const isReadyData = s.startsWith("data:image/") || s.startsWith("blob:");
                                if (!isReadyData && im.complete === false && im.naturalWidth === 0 && ticks < 150) continue;
                                if (im.naturalWidth > 0 && im.naturalWidth < 64 && im.naturalHeight < 64) continue;

                                capturedZhjSrcSet.add(s);
                                capturedZhjSrcSet.add(fp);

                                clearInterval(timer);
                                resolve(s);
                                return;
                            }
                            if (ticks >= 180) { clearInterval(timer); resolve(""); }
                        }, 500);
                    });

                    if (domObserver) { domObserver.disconnect(); domObserver = null; }
                    if (lastIdx >= 0 && chatArr[lastIdx] && origMesRaw !== null) {
                        chatArr[lastIdx].mes = origMesRaw;
                        if (typeof updBlockFn === "function") {
                            try { updBlockFn(lastIdx, chatArr[lastIdx], { rerenderMessage: true }); } catch (e) {}
                        } else if (origHtmlRaw !== null && lastMesTextEl) {
                            lastMesTextEl.innerHTML = origHtmlRaw;
                        }
                    }
                    scrubRawBlocksFromChatDOM(true);

                    if (capturedSrc) {
                        pendingZhjTarget = null;
                        return await saveAndMountImg(capturedSrc);
                    }
                }
                showToast("⚠️ 等待生图超时！可在【⚙️设置 -> 二、AI外貌锁定与自动生图】中点击【🎯录制生图按钮】或切换生图格式。", "warn", 4200);
                return false;
            } catch (err) {
                showToast("❌ 后台生图出错：" + (err.message || "未知错误"), "error", 3500);
                return false;
            } finally {
                if (domObserver) { try { domObserver.disconnect(); } catch (e) {} }
                const ctx = safeCtx(), chatArr = ctx?.chat || [];
                if (lastIdx >= 0 && chatArr[lastIdx] && origMesRaw !== null) {
                    chatArr[lastIdx].mes = origMesRaw;
                    const updBlockFn = ctx?.updateMessageBlock || window.updateMessageBlock;
                    if (typeof updBlockFn === "function") {
                        try { updBlockFn(lastIdx, chatArr[lastIdx], { rerenderMessage: true }); } catch (e) {}
                    }
                }
                if (lastMesTextEl) {
                    lastMesTextEl.querySelectorAll(".st-zhj-parasite-box, .st-zhj-hidden-node").forEach(el => { try { el.remove(); } catch (e) {} });
                }
                isGeneratingImageBusy = false;
                scrubRawBlocksFromChatDOM(true);
                if (btnEl && !isBatchGeneratingAll) {
                    btnEl.textContent = oldBtnTxt || "🎨 生图";
                    btnEl.disabled = false;
                }
            }
        }

        async function triggerBatchGenerateAllImages(btnEl) {
            if (isBatchGeneratingAll) {
                isBatchGeneratingAll = false;
                showToast("🛑 已请求停止批量生图，当前这张图完成后即停！", "warn", 3000);
                if (btnEl) btnEl.textContent = "🎨 一键全生图";
                return;
            }
            if (!latestStatus) latestStatus = getFallbackData();
            const u = detectProtagonistName(curVars);
            const cats = latestStatus.categories || [];

            let picker = document.getElementById("st-batch-gen-picker-modal");
            if (!picker) {
                picker = document.createElement("div");
                picker.id = "st-batch-gen-picker-modal";
                picker.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.82);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:12px;";
                document.body.appendChild(picker);
            }

            const selectedKeys = new Set();
            const curCatObj = cats.find(c => c.title === activeCat) || cats[0];
            (curCatObj?.items || []).forEach(it => {
                if (it.editKey && !it.editKey.endsWith("_none")) selectedKeys.add(it.editKey);
            });

            const renderPickerHTML = () => {
                const oldScrollEl = picker.querySelector("#st-bg-scroll-body");
                const savedScrollTop = oldScrollEl ? oldScrollEl.scrollTop : 0;

                const groupsHtml = cats.map(cat => {
                    const validItems = (cat.items || []).filter(it => it.editKey && !it.editKey.endsWith("_none"));
                    if (!validItems.length) return "";
                    return `
                        <div style="margin-bottom:10px;background:rgba(0,0,0,0.35);border:1px solid rgba(244,114,182,0.25);border-radius:10px;padding:8px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                <span style="font-size:12px;color:#fde047;font-weight:bold;">${cat.icon} ${cat.title}</span>
                                <button type="button" class="st-bg-sel-cat" data-cat="${cat.title}" style="background:rgba(255,255,255,0.12);color:#67e8f9;border:1px solid #67e8f9;border-radius:6px;padding:1px 8px;font-size:10.5px;cursor:pointer;">全选/反选本组</button>
                            </div>
                            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;">
                                ${validItems.map(it => {
                                    const isSel = selectedKeys.has(it.editKey);
                                    const stg = getItemRealStageNum(it, curVars);
                                    const shortTitle = String(it.cleanTitle || it.editKey).split(/[：:「（(]/)[0].trim();
                                    return `<button type="button" class="st-bg-item-btn" data-key="${it.editKey}" style="background:${isSel ? 'linear-gradient(135deg,#ec4899,#8b5cf6)' : 'rgba(255,255,255,0.08)'};color:${isSel ? '#fff' : '#cbd5e1'};border:1.5px solid ${isSel ? '#fde047' : 'rgba(255,255,255,0.15)'};border-radius:8px;padding:6px 4px;font-size:11px;font-weight:${isSel ? 'bold' : 'normal'};cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;">
                                        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${isSel ? "✅ " : ""}${shortTitle}</span>
                                        <span style="font-size:9.5px;color:${isSel ? '#fde047' : '#94a3b8'};">第 ${stg} 阶</span>
                                    </button>`;
                                }).join("")}
                            </div>
                        </div>
                    `;
                }).join("");

                picker.innerHTML = `
                    <div style="background:linear-gradient(160deg,#27153b,#0d0618);border:2px solid #f472b6;border-radius:16px;padding:14px;width:94vw;max-width:480px;max-height:86vh;display:flex;flex-direction:column;color:#fff;box-shadow:0 20px 60px #000;">
                        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:8px;margin-bottom:8px;">
                            <div>
                                <div style="font-size:14px;font-weight:bold;color:#fde047;">🎨 点选需要生图的部位 (${u})</div>
                                <div style="font-size:10.5px;color:#fbcfe8;">点按下方按钮自由勾选，生成后自动按真实阶位存入永久图池</div>
                            </div>
                            <button id="st-bg-close" type="button" style="background:#ff003c;color:#fff;border:none;border-radius:8px;padding:4px 10px;font-weight:bold;cursor:pointer;">✕</button>
                        </div>
                        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">
                            <button type="button" id="st-bg-quick-6holes" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#fda4af;">🌸 只选六孔</button>
                            <button type="button" id="st-bg-quick-preg" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#f0abfc;">🤰 只选受孕4项</button>
                            <button type="button" id="st-bg-quick-wear" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#67e8f9;">👗 只选穿搭8项</button>
                            <button type="button" id="st-bg-quick-all" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#fde047;">🌟 全选所有</button>
                            <button type="button" id="st-bg-quick-clear" class="st-pill-btn" style="padding:3px 8px;font-size:10.5px;color:#94a3b8;">🧹 清空勾选</button>
                        </div>
                        <div id="st-bg-scroll-body" style="flex:1;overflow-y:auto;padding-right:2px;">${groupsHtml}</div>
                        <div style="padding-top:10px;border-top:1px solid rgba(255,255,255,0.15);display:flex;justify-content:space-between;align-items:center;gap:8px;">
                            <span style="font-size:12px;color:#a6e3a1;font-weight:bold;">已勾选：<b style="color:#fde047;font-size:14px;">${selectedKeys.size}</b> 个部位</span>
                            <button type="button" id="st-bg-start-btn" style="background:linear-gradient(135deg,#f59e0b,#ec4899);color:#fff;border:none;border-radius:10px;padding:8px 18px;font-size:13px;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(236,72,153,0.5);">🚀 立即依次生成 (${selectedKeys.size}项)</button>
                        </div>
                    </div>
                `;

                const newScrollEl = picker.querySelector("#st-bg-scroll-body");
                if (newScrollEl) newScrollEl.scrollTop = savedScrollTop;

                picker.querySelector("#st-bg-close").onclick = () => { picker.style.display = "none"; };
                picker.onclick = (e) => { if (e.target === picker) picker.style.display = "none"; };

                picker.querySelectorAll(".st-bg-item-btn").forEach(b => {
                    b.onclick = () => {
                        const k = b.getAttribute("data-key");
                        if (selectedKeys.has(k)) selectedKeys.delete(k);
                        else selectedKeys.add(k);
                        renderPickerHTML();
                    };
                });

                picker.querySelectorAll(".st-bg-sel-cat").forEach(b => {
                    b.onclick = () => {
                        const cTitle = b.getAttribute("data-cat");
                        const targetCat = cats.find(c => c.title === cTitle);
                        if (!targetCat) return;
                        const keys = (targetCat.items || []).map(it => it.editKey).filter(k => k && !k.endsWith("_none"));
                        const allIn = keys.every(k => selectedKeys.has(k));
                        keys.forEach(k => { if (allIn) selectedKeys.delete(k); else selectedKeys.add(k); });
                        renderPickerHTML();
                    };
                });

                picker.querySelector("#st-bg-quick-6holes").onclick = () => {
                    selectedKeys.clear();
                    ["骚口实况", "胸部实况", "小穴实况", "子宫实况", "阴蒂尿道", "屁眼实况"].forEach(k => selectedKeys.add(k));
                    renderPickerHTML();
                };
                picker.querySelector("#st-bg-quick-preg").onclick = () => {
                    selectedKeys.clear();
                    ["排卵周期", "受精断面", "精液归属", "孕肚进度"].forEach(k => selectedKeys.add(k));
                    renderPickerHTML();
                };
                picker.querySelector("#st-bg-quick-wear").onclick = () => {
                    selectedKeys.clear();
                    ["穿搭_头饰", "穿搭_颈部", "穿搭_胸罩", "穿搭_上衣", "穿搭_内裤", "穿搭_下装", "穿搭_丝袜", "穿搭_鞋子"].forEach(k => selectedKeys.add(k));
                    renderPickerHTML();
                };
                picker.querySelector("#st-bg-quick-all").onclick = () => {
                    cats.forEach(c => (c.items || []).forEach(it => {
                        if (it.editKey && !it.editKey.endsWith("_none")) selectedKeys.add(it.editKey);
                    }));
                    renderPickerHTML();
                };
                picker.querySelector("#st-bg-quick-clear").onclick = () => {
                    selectedKeys.clear();
                    renderPickerHTML();
                };

                picker.querySelector("#st-bg-start-btn").onclick = async () => {
                    if (!selectedKeys.size) {
                        showToast("⚠️ 请至少点选 1 个需要生图的部位！", "warn", 2200);
                        return;
                    }
                    picker.style.display = "none";
                    const targetItems = [];
                    cats.forEach(c => (c.items || []).forEach(it => {
                        if (it.editKey && selectedKeys.has(it.editKey)) targetItems.push(it);
                    }));

                    isBatchGeneratingAll = true;
                    let successCnt = 0;
                    for (let i = 0; i < targetItems.length; i++) {
                        if (!isBatchGeneratingAll) break;
                        const item = targetItems[i];
                        const curStageIdx = getItemRealStageNum(item, curVars);

                        const liveBtn = document.getElementById("st-main-batch-gen-all");
                        if (liveBtn) liveBtn.textContent = `🛑 停止 (${i + 1}/${targetItems.length})`;

                        const ok = await silentBackgroundGenerateImage(item, curStageIdx, u, null);
                        if (ok) successCnt++;
                        await new Promise(r => setTimeout(r, 1200));
                    }
                    isBatchGeneratingAll = false;
                    const liveBtn = document.getElementById("st-main-batch-gen-all");
                    if (liveBtn) liveBtn.textContent = "🎨 一键全生图";
                    showToast(`🎉 点选批量生图完成！已生成 ${successCnt}/${targetItems.length} 张图并存入永久复用图池！`, "success", 4000);
                };
            };

            renderPickerHTML();
            picker.style.display = "flex";
        }

        function checkAndQueueMajorChangeAutoGen(categories, u) {
            if (!userSettings.autoGenOnMajorChange || viewingHistoryFloor !== null) return;
            const allItems = [];
            (categories || []).forEach(c => (c.items || []).forEach(it => allItems.push(it)));
            const curTierSnap = {};
            allItems.forEach(item => {
                if (!item.editKey) return;
                curTierSnap[item.editKey] = getItemRealStageNum(item, curVars);
            });
            if (Object.keys(prevRecordedTiersForAutoGen).length === 0) { prevRecordedTiersForAutoGen = curTierSnap; return; }
            allItems.forEach(item => {
                const k = item.editKey;
                if (!k || !userSettings.autoGenItemMap?.[k]) return;
                const newStg = curTierSnap[k] || 1, oldStg = prevRecordedTiersForAutoGen[k] || 1;
                if (newStg !== oldStg) {
                    const scopedKey = getProtagScopedImgKey(k, newStg);
                    const alreadyHasStageImg = Boolean(curVars.按钮详情?.[k]?.stageImgs?.[newStg] || queryImportedImage(scopedKey));
                    if (!alreadyHasStageImg && !autoGenQueue.some(q => q.editKey === k && q.stageIdx === newStg)) {
                        autoGenQueue.push({ item, stageIdx: newStg, u, editKey: k });
                    }
                }
            });
            prevRecordedTiersForAutoGen = curTierSnap;
            processAutoGenQueue();
        }

        async function processAutoGenQueue() {
            if (!userSettings.autoGenOnMajorChange || isGeneratingImageBusy || !autoGenQueue.length) return;
            const cooldownMs = Math.max(5, safeNum(userSettings.autoGenCooldownSec, 30)) * 1000;
            const elapsed = Date.now() - lastImageGenFinishTime;
            if (elapsed < cooldownMs) { setTimeout(processAutoGenQueue, cooldownMs - elapsed + 500); return; }
            const task = autoGenQueue.shift();
            if (!task) return;
            await silentBackgroundGenerateImage(task.item, task.stageIdx, task.u, null);
            if (autoGenQueue.length > 0) setTimeout(processAutoGenQueue, cooldownMs);
        }

        function bindCardThumbnailElement(thumbWrapEl, item) {
            if (!thumbWrapEl) return;
            const candidates = getStageImageCandidates(item);
            if (!candidates.length) { thumbWrapEl.style.display = "none"; return; }
            const imgEl = thumbWrapEl.querySelector("img");
            let idx = 0;
            const tryNext = async () => {
                if (idx >= candidates.length) { thumbWrapEl.style.display = "none"; return; }
                const ref = candidates[idx++];
                if (ref.startsWith("data:") || ref.startsWith("http") || ref.startsWith("blob:") || ref.startsWith("/")) {
                    imgEl.onerror = () => {
                        if (ref.startsWith("/")) deadPhysicalUrlSet.add(ref);
                        tryNext();
                    };
                    imgEl.onload = () => { thumbWrapEl.style.display = "flex"; };
                    imgEl.src = ref;
                } else {
                    const dataUrl = await fetchImageAsyncFromDB(ref);
                    if (dataUrl) {
                        imgEl.onerror = tryNext;
                        imgEl.onload = () => { thumbWrapEl.style.display = "flex"; };
                        imgEl.src = dataUrl;
                    } else {
                        tryNext();
                    }
                }
            };
            thumbWrapEl.onclick = (e) => { e.stopPropagation(); openTrueFullscreenImage(imgEl.src); };
            tryNext();
        }

        let __stPopoverCloseCooldown = 0;

        function showTagDetailPopover(title, badgeText, originText, effectText, thoughtHint) {
            if (Date.now() - __stPopoverCloseCooldown < 400) return;

            let mask = document.getElementById("st-tag-popover-mask");
            if (!mask) {
                mask = document.createElement("div");
                mask.id = "st-tag-popover-mask";
                mask.style.cssText = "position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,0.52);backdrop-filter:blur(2px);display:none;align-items:center;justify-content:center;padding:14px;touch-action:none;";
                document.body.appendChild(mask);
            }

            let pop = document.getElementById("st-tag-popover");
            if (!pop) {
                pop = document.createElement("div");
                pop.id = "st-tag-popover";
                document.body.appendChild(pop);
            }
            if (pop.parentElement !== mask) mask.appendChild(pop);
            pop.style.cssText = "position:relative;z-index:2147483647;max-width:340px;width:88vw;background:linear-gradient(155deg, rgba(28, 12, 42, 0.98), rgba(10, 5, 20, 0.99));border:1.5px solid #f472b6;border-radius:14px;padding:13px 15px;color:#fdf2f8;font-size:12px;line-height:1.68;box-shadow:0 18px 46px rgba(0,0,0,0.92), 0 0 24px rgba(244,114,182,0.35);pointer-events:auto;display:block;";

            const closeAllSafely = (ev) => {
                if (ev) {
                    ev.stopPropagation();
                    ev.stopImmediatePropagation();
                    ev.preventDefault();
                }
                __stPopoverCloseCooldown = Date.now();
                pop.style.display = "none";
                setTimeout(() => {
                    mask.style.display = "none";
                }, 120);
            };

            pop.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;border-bottom:1px solid rgba(244,114,182,0.35);padding-bottom:7px;margin-bottom:8px;">
                    <span style="font-size:13px;font-weight:bold;color:#fde047;flex:1;word-break:break-word;">${title}</span>
                    <span style="background:rgba(244,114,182,0.25);border:1px solid #f472b6;color:#fff;padding:1px 8px;border-radius:99px;font-size:10.5px;font-weight:bold;white-space:nowrap;">${badgeText}</span>
                    <button id="st-tag-pop-close" type="button" title="关闭窗口" style="background:#ff003c;color:#fff;border:1.5px solid #ffe4e6;border-radius:8px;padding:4px 11px;font-size:13px;font-weight:bold;cursor:pointer;line-height:1;flex-shrink:0;box-shadow:0 2px 8px rgba(255,0,60,0.6);">✕</button>
                </div>
                <div style="margin-bottom:6px;"><b style="color:#f472b6;">🔍 状态成因：</b><span style="color:#e2e8f0;">${originText}</span></div>
                <div style="margin-bottom:6px;"><b style="color:#67e8f9;">⚡ 躯体与剧情影响：</b><span style="color:#cbd5e1;">${effectText}</span></div>
                <div style="background:rgba(244,114,182,0.12);border-left:2.5px solid #f472b6;padding:6px 9px;border-radius:0 6px 6px 0;font-style:italic;color:#ffd6e4;font-size:11.5px;">💭 “${thoughtHint}”</div>
            `;

            mask.style.display = "flex";

            const closeBtn = pop.querySelector("#st-tag-pop-close");
            if (closeBtn) {
                closeBtn.onclick = closeAllSafely;
            }
            mask.onclick = (ev) => {
                if (ev.target === mask) closeAllSafely(ev);
            };
        }

        function bindLongPressOrClickTag(el, detailData) {
            if (!el) return;
            el.classList.add("st-tag-pressable");
            let timer = null;
            const trigger = (e) => {
                e.stopPropagation();
                playSynthSound("squelch");
                showTagDetailPopover(detailData.title, detailData.badge, detailData.origin, detailData.effect, detailData.thought);
            };
            el.onpointerdown = (e) => { timer = setTimeout(() => trigger(e), 240); };
            el.onpointerup = () => clearTimeout(timer);
            el.onpointerleave = () => clearTimeout(timer);
            el.onclick = trigger;
        }

        function showDetailPopup(item) {
            const modal = document.getElementById("st-v5-modal");
            if (!modal) return;
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"], u = detectProtagonistName(curVars);
            const parts = safeStr(item.desc).split("💭"), objText = safeStr(parts[0]).trim();
            const thoughtText = parts[1] ? cleanThoughtText(parts[1].replace(/【.*?实时心声】：/g, "").replace(/[“”"]/g, "").trim()) : "……";
            const customRec = item.isCustom ? curVars.自定义条目?.[item.catTitle]?.find(x => x.id === item.editKey) : null;
            const overrideRec = customRec || curVars.按钮详情?.[item.editKey] || {};
            const candidates = getStageImageCandidates(item);
            const initLv1Cands = getInitialLv1ImageCandidates(item.editKey);
            const curPct = (item.pct !== null && item.pct !== undefined) ? item.pct : 0;
            const curStageIdx = getItemRealStageNum(item, curVars);
            const lockedVal = typeof curVars.上帝强制锁定?.[item.editKey] === "number" ? curVars.上帝强制锁定[item.editKey] : null;
            const isAutoGenChecked = Boolean(userSettings.autoGenItemMap?.[item.editKey]);
            const isPinned = Boolean(userSettings.pinnedItems?.[item.editKey]);
            const pinKey = getGlobalPinKey(item.editKey, curStageIdx);

            const box = modal.querySelector(".st-modal-box");
            box.style.background = tc.bg; box.style.border = tc.border; box.style.color = tc.text;
            const curCatForNav = (latestStatus?.categories || []).find(c => (c.items || []).some(it => it.editKey === item.editKey));
            const siblingItems = curCatForNav?.items || [];
            const curSiblingIdx = siblingItems.findIndex(it => it.editKey === item.editKey);

            box.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.12);">
                    <div style="font-size:14.5px;font-weight:bold;color:#f9e2af;word-break:break-word;flex:1;">${item.cleanTitle || item.rawKey}</div>
                    ${siblingItems.length > 1 ? `
                    <div style="display:flex;gap:4px;flex-shrink:0;">
                        <button id="st-det-prev-item" type="button" title="切换上一项" style="background:rgba(255,255,255,0.12);color:#fde047;border:1px solid rgba(253,224,71,0.4);border-radius:7px;padding:3px 8px;font-size:11px;font-weight:bold;cursor:pointer;">◀</button>
                        <button id="st-det-next-item" type="button" title="切换下一项" style="background:rgba(255,255,255,0.12);color:#fde047;border:1px solid rgba(253,224,71,0.4);border-radius:7px;padding:3px 8px;font-size:11px;font-weight:bold;cursor:pointer;">▶</button>
                    </div>` : ""}
                    <button id="st-det-close" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:8px;padding:4px 10px;font-size:12px;cursor:pointer;flex-shrink:0;">✕</button>
                </div>
                ${item.barHTML || ""}
                <div id="st-det-img-wrap" style="margin-top:10px;display:flex;flex-direction:column;gap:6px;background:rgba(0,0,0,0.32);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;flex-wrap:wrap;">
                        <span style="font-size:11.5px;color:${tc.prim};font-weight:bold;">🖼️ 第 ${curStageIdx} 阶局部特写</span>
                        <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">
                            ${initLv1Cands.length ? `<button id="st-det-compare-btn" type="button" style="background:rgba(168,85,247,0.22);color:#e9d5ff;border:1px solid #c084fc;border-radius:6px;padding:3px 7px;font-size:10.5px;font-weight:bold;cursor:pointer;">⚖️ 堕落前后对比</button>` : ""}
                            <button id="st-det-switch-pool-btn" type="button" title="在永久图池同阶图与初始底图之间随机切换" style="background:rgba(16,185,129,0.22);color:#6ee7b7;border:1px solid #10b981;border-radius:6px;padding:3px 7px;font-size:10.5px;font-weight:bold;cursor:pointer;">🎲 换图(${candidates.length})</button>
                            <button id="st-det-fav-img-btn" type="button" style="background:rgba(255,255,255,0.12);color:#fde047;border:1px solid #fde047;border-radius:6px;padding:3px 7px;font-size:10.5px;font-weight:bold;cursor:pointer;">⭐ 收藏</button>                           
                            <button id="st-det-dl-img-btn" type="button" style="background:linear-gradient(135deg,#10b981,#06b6d4);color:#fff;border:none;border-radius:6px;padding:3px 7px;font-size:10.5px;font-weight:bold;cursor:pointer;">💾 下载</button>
                            <button id="st-det-global-img-pin" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid #f472b6;border-radius:6px;padding:3px 7px;font-size:10.5px;font-weight:bold;cursor:pointer;">🌐 全局</button>
                            <button id="st-det-zhj-gen" type="button" style="background:linear-gradient(135deg,#f59e0b,#ec4899);color:#fff;border:none;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:bold;cursor:pointer;">🎨 生图</button>
                        </div>
                    </div>
                    <img id="st-det-stage-img" style="display:none;width:100%;max-height:240px;object-fit:contain;border-radius:8px;cursor:zoom-in;background:#0a0612;" alt="部位实况">
                    <div id="st-det-compare-view" style="display:none;grid-template-columns:1fr 1fr;gap:8px;background:#090410;padding:6px;border-radius:8px;border:1px dashed #c084fc;">
                        <div style="display:flex;flex-direction:column;gap:4px;align-items:center;">
                            <span style="font-size:10.5px;color:#a6e3a1;font-weight:bold;">🌸 初见完好态 (Lv.1)</span>
                            <img id="st-det-cmp-before" style="width:100%;height:145px;object-fit:cover;border-radius:6px;border:1px solid #a6e3a1;cursor:zoom-in;">
                        </div>
                        <div style="display:flex;flex-direction:column;gap:4px;align-items:center;">
                            <span style="font-size:10.5px;color:#ff4d6d;font-weight:bold;">💀 现今恶堕态 (Lv.${curStageIdx})</span>
                            <img id="st-det-cmp-after" style="width:100%;height:145px;object-fit:cover;border-radius:6px;border:1px solid #ff4d6d;cursor:zoom-in;">
                        </div>
                    </div>
                    <div id="st-det-img-placeholder" style="font-size:11.5px;color:#a6adc8;padding:12px 8px;text-align:center;border:1px dashed rgba(255,255,255,0.15);border-radius:8px;">暂无第 ${curStageIdx} 阶配图，点击右上角「🎨 生图」将在后台直接生成该部位微距特写图。</div>
                </div>
                <div style="margin-top:10px;background:linear-gradient(160deg,rgba(15,8,26,0.68),rgba(5,2,12,0.82));border-radius:11px;padding:12px 14px;border:1px solid rgba(255,255,255,0.1);border-left:3.5px solid #c084fc;line-height:1.8;font-size:12.5px;white-space:pre-wrap;word-break:break-word;">${objText}</div>
                <div style="margin-top:10px;background:linear-gradient(145deg,rgba(244,114,182,0.16),rgba(168,85,247,0.1));border:1px solid rgba(244,114,182,0.42);border-left:4px solid ${tc.prim};border-radius:12px;padding:12px 14px;font-size:12.6px;line-height:1.85;color:#ffe4e6;">
                    <div style="font-weight:bold;font-size:11.5px;color:${tc.prim};margin-bottom:4px;">💭 ${u} 的深层内心独白：</div>
                    <div>“*${thoughtText}*”</div>
                </div>
                <div style="margin-top:12px;">
                    <button id="st-toggle-edit-drawer" type="button" style="width:100%;background:linear-gradient(135deg,rgba(244,114,182,0.2),rgba(192,132,252,0.2));border:1px solid rgba(244,114,182,0.45);color:#fde047;border-radius:9px;padding:8px 12px;font-size:12.5px;font-weight:bold;cursor:pointer;">✏️ 修改 / 调教此项（展开编辑与滑块面板）</button>
                </div>
                <div id="st-det-edit-drawer" style="display:none;margin-top:10px;background:rgba(0,0,0,0.42);border:1px dashed rgba(255,255,255,0.18);border-radius:10px;padding:10px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
                        <div style="display:flex;gap:5px;flex-wrap:wrap;">
                            <button id="st-det-local-up" type="button" style="background:rgba(166,227,161,0.2);color:#a6e3a1;border:1px solid #a6e3a1;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">📂 本地传图</button>
                            <input id="st-det-local-file" type="file" accept="image/*" style="display:none;">
                            <button id="st-det-copy-tag" type="button" style="background:rgba(255,255,255,0.1);color:#f9e2af;border:1px solid rgba(249,226,175,0.4);border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">📋 复制生图Tag</button>
                            <button id="st-det-pin-btn" type="button" style="background:${isPinned ? '#f59e0b' : 'rgba(255,255,255,0.12)'};color:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">${isPinned ? "📌 已锁防改" : "📌 锁定文案"}</button>
                        </div>
                        <button id="st-det-ai-btn" type="button" style="background:rgba(203,166,247,0.2);color:#cba6f7;border:1px solid #cba6f7;border-radius:6px;padding:3px 9px;font-size:11px;cursor:pointer;">✨ AI重写文案</button>
                    </div>
                    <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:#fde047;cursor:pointer;background:rgba(251,191,36,0.1);padding:4px 8px;border-radius:6px;margin-bottom:8px;">
                        <input id="st-det-autogen-chk" type="checkbox" ${isAutoGenChecked ? "checked" : ""}>
                        <span>⚡ 将此项加入【自动生图监控列表】</span>
                    </label>
                    ${(!String(item.editKey).endsWith("_none")) ? `
                    <div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);border-radius:8px;padding:7px 10px;margin-bottom:8px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:#fde047;font-weight:bold;">
                            <span>👑 强制锁定数值/阶位：<b id="st-god-val-label">${lockedVal !== null ? lockedVal + "% (第" + (tier6(lockedVal, item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势") + 1) + "阶·已锁定)" : curPct + "% (第" + curStageIdx + "阶·自动)"}</b></span>
                            <button id="st-god-unlock" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:5px;padding:1px 7px;font-size:10.5px;cursor:pointer;">解除锁定</button>
                        </div>
                        <input id="st-god-slider" type="range" min="0" max="100" value="${lockedVal !== null ? lockedVal : curPct}" style="width:100%;margin-top:5px;cursor:pointer;">
                    </div>` : ""}
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
                        <input id="st-ed-stage" value="${safeStr(overrideRec.stage).replace(/"/g, "&quot;")}" placeholder="自定义阶位标签" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:12px;">
                        <input id="st-ed-img" value="${safeStr(overrideRec.imgUrl).replace(/"/g, "&quot;")}" placeholder="绑定图片名/URL" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:12px;">
                    </div>
                    <textarea id="st-ed-desc" rows="3" style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;margin-bottom:6px;">${safeStr(overrideRec.desc || objText)}</textarea>
                    <textarea id="st-ed-thought" rows="3" style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;margin-bottom:8px;">${safeStr(overrideRec.thought || thoughtText)}</textarea>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
                        ${item.isClient ? `<button id="st-det-block-client" type="button" style="background:rgba(243,139,168,0.2);color:#ff85a1;border:1px solid #ff4d6d;border-radius:6px;padding:5px 10px;font-size:11.5px;cursor:pointer;margin-right:auto;">🚫 屏蔽此恩客</button>` : ""}
                        ${item.isCustom ? `<button id="st-det-del-custom" type="button" style="background:rgba(243,139,168,0.2);color:#ff85a1;border:1px solid #ff4d6d;border-radius:6px;padding:5px 10px;font-size:11.5px;cursor:pointer;margin-right:auto;">🗑️ 删除自定义</button>` : ""}
                        <button id="st-det-reset" type="button" style="background:rgba(255,255,255,0.1);color:#cdd6f4;border:none;border-radius:6px;padding:5px 10px;font-size:11.5px;cursor:pointer;">↩️ 恢复默认</button>
                        <button id="st-det-save" type="button" style="background:${tc.prim};color:#11111b;border:none;border-radius:6px;padding:5px 14px;font-size:11.5px;font-weight:bold;cursor:pointer;">💾 保存修改</button>
                    </div>
                </div>`;
            modal.style.display = "flex";

            const editDrawer = box.querySelector("#st-det-edit-drawer");
            const toggleDrawerBtn = box.querySelector("#st-toggle-edit-drawer");
            toggleDrawerBtn.onclick = () => {
                const show = editDrawer.style.display === "none";
                editDrawer.style.display = show ? "block" : "none";
                toggleDrawerBtn.textContent = show ? "🔼 收起编辑与调教面板" : "✏️ 修改 / 调教此项（展开编辑与滑块面板）";
            };

            const imgEl = box.querySelector("#st-det-stage-img"), phEl = box.querySelector("#st-det-img-placeholder");
            let candIdx = 0;
            const tryNextImg = async () => {
                if (candIdx >= candidates.length) { imgEl.style.display = "none"; phEl.style.display = "block"; return; }
                const ref = candidates[candIdx++];
                if (ref.startsWith("data:") || ref.startsWith("http") || ref.startsWith("blob:") || ref.startsWith("/")) {
                    imgEl.onerror = () => {
                        if (ref.startsWith("/")) deadPhysicalUrlSet.add(ref);
                        tryNextImg();
                    };
                    imgEl.onload = () => { imgEl.style.display = "block"; phEl.style.display = "none"; updateFavBtnUI(); };
                    imgEl.src = ref;
                } else {
                    const dataUrl = await fetchImageAsyncFromDB(ref);
                    if (dataUrl) {
                        imgEl.onerror = tryNextImg;
                        imgEl.onload = () => { imgEl.style.display = "block"; phEl.style.display = "none"; updateFavBtnUI(); };
                        imgEl.src = dataUrl;
                    } else {
                        tryNextImg();
                    }
                }
            };
            imgEl.onclick = () => openTrueFullscreenImage(imgEl.src);
            if (candidates.length > 0) tryNextImg();

            const cmpBtn = box.querySelector("#st-det-compare-btn"), cmpView = box.querySelector("#st-det-compare-view");
            if (cmpBtn && cmpView) {
                cmpBtn.onclick = () => {
                    const isShowingCmp = cmpView.style.display === "grid";
                    if (isShowingCmp) {
                        cmpView.style.display = "none";
                        if (imgEl.src) imgEl.style.display = "block";
                        cmpBtn.textContent = "⚖️ 堕落前后对比";
                    } else {
                        const beforeImg = box.querySelector("#st-det-cmp-before"), afterImg = box.querySelector("#st-det-cmp-after");
                        let bIdx = 0;
                        const tryBefore = async () => {
                            if (bIdx >= initLv1Cands.length) return;
                            const ref = initLv1Cands[bIdx++];
                            if (ref.startsWith("data:") || ref.startsWith("http") || ref.startsWith("blob:") || ref.startsWith("/")) {
                                beforeImg.onerror = tryBefore;
                                beforeImg.src = ref;
                            } else {
                                const dUrl = await fetchImageAsyncFromDB(ref);
                                if (dUrl) { beforeImg.onerror = tryBefore; beforeImg.src = dUrl; }
                                else tryBefore();
                            }
                        };
                        tryBefore();
                        afterImg.src = imgEl.src || initLv1Cands[0] || "";
                        beforeImg.onclick = () => openTrueFullscreenImage(beforeImg.src);
                        afterImg.onclick = () => openTrueFullscreenImage(afterImg.src);
                        imgEl.style.display = "none";
                        phEl.style.display = "none";
                        cmpView.style.display = "grid";
                        cmpBtn.textContent = "🖼️ 返回单图";
                    }
                };
            }

            const favBtn = box.querySelector("#st-det-fav-img-btn");
            function updateFavBtnUI() {
                if (!favBtn) return;
                const currentSrc = imgEl?.getAttribute("src") || imgEl?.src || "";
                const isFav = Boolean(currentSrc && imgEl?.style.display !== "none" && isImageFavorited(currentSrc));
                favBtn.style.background = isFav ? "linear-gradient(135deg,#fde047,#f59e0b)" : "rgba(255,255,255,0.12)";
                favBtn.style.color = isFav ? "#111" : "#fde047";
                favBtn.textContent = isFav ? "🌟 已收藏" : "⭐ 收藏";
            }
            favBtn.onclick = async () => {
                const currentSrc = imgEl?.getAttribute("src") || imgEl?.src || "";
                if (!currentSrc || imgEl?.style.display === "none") { showToast("⚠️ 当前还没有可收藏的图片！", "warn", 2500); return; }
                await toggleFavoriteImage(currentSrc, { charName: u, editKey: item.editKey, stageIdx: curStageIdx, title: `${u} · ${item.cleanTitle || item.editKey} (第${curStageIdx}阶)` });
                updateFavBtnUI();
            };
            const swPoolBtn = box.querySelector("#st-det-switch-pool-btn");
            if (swPoolBtn) {
                swPoolBtn.onclick = () => {
                    if (candidates.length <= 1) {
                        showToast(`💡 当前【${item.cleanTitle || item.editKey}】第 ${curStageIdx} 阶仅有 ${candidates.length} 张可用图，点击右侧【🎨 生图】即可生成更多同阶美图加入轮播池！`, "warn", 3200);
                        return;
                    }
                    partRandomOffsetMap[item.editKey] = (partRandomOffsetMap[item.editKey] || 0) + 1;
                    userSettings.poolRandomEnabled = true;
                    saveSettings();
                    const newCands = getStageImageCandidates(item);
                    candidates.length = 0;
                    newCands.forEach(c => candidates.push(c));
                    candIdx = 0;
                    tryNextImg();
                    renderBody();
                    const curPickNum = (partRandomOffsetMap[item.editKey] % candidates.length) + 1;
                    showToast(`🎲 已切换【${item.cleanTitle || item.editKey}】第 ${curStageIdx} 阶配图 (${curPickNum}/${candidates.length})！`, "info", 1800);
                };
            }

            box.querySelector("#st-det-dl-img-btn").onclick = () => {
                const currentSrc = imgEl?.getAttribute("src") || imgEl?.src || "";
                if (!currentSrc || imgEl?.style.display === "none") { showToast("⚠️ 当前还没有可下载的图片！", "warn", 2500); return; }
                downloadImageToDevice(currentSrc, `${u}_${item.editKey}_第${curStageIdx}阶`);
            };

            const gPinBtn = box.querySelector("#st-det-global-img-pin");
            const updateGPinUI = () => {
                const isPinnedGlobal = Boolean(userSettings.globalPinnedStageImgs?.[pinKey]);
                gPinBtn.style.background = isPinnedGlobal ? "linear-gradient(135deg,#ec4899,#8b5cf6)" : "rgba(255,255,255,0.12)";
                gPinBtn.textContent = isPinnedGlobal ? "🌐 全局中(关)" : "🌐 全局";
            };
            updateGPinUI();
            gPinBtn.onclick = async () => {
                userSettings.globalPinnedStageImgs = userSettings.globalPinnedStageImgs || {};
                if (userSettings.globalPinnedStageImgs[pinKey]) {
                    delete userSettings.globalPinnedStageImgs[pinKey];
                    saveSettings(); updateGPinUI(); latestStatus = getFallbackData(); renderBody(); showDetailPopup(item);
                    showToast(`🔄 已关闭全局替换，恢复显示初始底图！`, "info", 2800);
                } else {
                    const currentSrc = imgEl?.getAttribute("src") || imgEl?.src || "";
                    if (!currentSrc || imgEl?.style.display === "none") { showToast("⚠️ 当前还没有可设为全局的图片！", "warn", 2500); return; }
                    let dUrl = currentSrc;
                    if (!dUrl.startsWith("data:")) {
                        try { const r = await fetch(currentSrc); dUrl = await blobToDataUrl(await r.blob(), "gpin.webp"); } catch (e) {}
                    }
                    await rawSaveDataUrlToDB(pinKey, dUrl).catch(() => {});
                    userSettings.globalPinnedStageImgs[pinKey] = true;
                    saveSettings(); updateGPinUI(); latestStatus = getFallbackData(); renderBody();
                    showToast(`🌐 已设为【全局默认显示】！随时再次点击即可关闭回到初始图！`, "success", 3200);
                }
            };

            const pinBtn = box.querySelector("#st-det-pin-btn");
            if (pinBtn) {
                pinBtn.onclick = () => {
                    userSettings.pinnedItems = userSettings.pinnedItems || {};
                    userSettings.pinnedItems[item.editKey] = !userSettings.pinnedItems[item.editKey];
                    saveSettings();
                    pinBtn.textContent = userSettings.pinnedItems[item.editKey] ? "📌 已锁防改" : "📌 锁定文案";
                    pinBtn.style.background = userSettings.pinnedItems[item.editKey] ? "#f59e0b" : "rgba(255,255,255,0.12)";
                };
            }

            const autoGenChk = box.querySelector("#st-det-autogen-chk");
            if (autoGenChk) {
                autoGenChk.onchange = () => {
                    userSettings.autoGenItemMap = userSettings.autoGenItemMap || {};
                    userSettings.autoGenItemMap[item.editKey] = autoGenChk.checked;
                    saveSettings();
                };
            }

            const godSlider = box.querySelector("#st-god-slider"), godLabel = box.querySelector("#st-god-val-label");
            let tempGodVal = lockedVal;
            if (godSlider) {
                const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
                godSlider.oninput = () => {
                    tempGodVal = parseInt(godSlider.value, 10);
                    const previewStg = tier6(tempGodVal, isRev) + 1;
                    if (godLabel) godLabel.textContent = `${tempGodVal}% (第${previewStg}阶·待保存)`;
                };
                box.querySelector("#st-god-unlock").onclick = () => {
                    tempGodVal = null;
                    if (curVars.上帝强制锁定) delete curVars.上帝强制锁定[item.editKey];
                    if (godLabel) godLabel.textContent = `${curPct}% (已解除锁定)`;
                    saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                };
            }

            const upBtn = box.querySelector("#st-det-local-up"), fileInp = box.querySelector("#st-det-local-file");
            if (upBtn && fileInp) {
                upBtn.onclick = () => fileInp.click();
                fileInp.onchange = async (e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    const scopedKey = getProtagScopedImgKey(item.editKey, curStageIdx);
                    const res = await saveSingleImageToDB(scopedKey, f);
                    if (res?.dUrl) {
                        const poolRefKey = await registerImageToReusablePool(item.editKey, curStageIdx, res.dUrl, u, { clientName: item.clientName });
                        const effectiveRef = poolRefKey || res.normKey;
                        partRandomOffsetMap[item.editKey] = 0;
                        curVars.按钮详情 = curVars.按钮详情 || {};
                        const prev = curVars.按钮详情[item.editKey] || {};
                        const prevList = Array.isArray(prev.stageImgList?.[curStageIdx]) ? prev.stageImgList[curStageIdx] : [];
                        curVars.按钮详情[item.editKey] = {
                            ...prev,
                            imgUrl: effectiveRef,
                            forceLatestImg: effectiveRef,
                            stageImgs: { ...(prev.stageImgs || {}), [curStageIdx]: effectiveRef },
                            stageImgList: { ...(prev.stageImgList || {}), [curStageIdx]: [effectiveRef, ...prevList.filter(x => x !== effectiveRef)] }
                        };
                        recordToCgGallery(item.cleanTitle || item.editKey, res.dUrl, curStageIdx, item.editKey);
                        saveChatCache(curVars);
                        imgEl.src = res.dUrl; imgEl.style.display = "block"; phEl.style.display = "none";
                        box.querySelector("#st-ed-img").value = effectiveRef;
                        latestStatus = getFallbackData(); renderBody();
                        showToast(`✅ 已成功上传并绑定【${item.cleanTitle} (第${curStageIdx}阶)】配图！`, "success");
                    }
                };
            }

            box.querySelector("#st-det-close").onclick = () => { modal.style.display = "none"; };
            const prevItBtn = box.querySelector("#st-det-prev-item"), nextItBtn = box.querySelector("#st-det-next-item");
            if (prevItBtn && siblingItems.length > 1) {
                prevItBtn.onclick = () => showDetailPopup(siblingItems[(curSiblingIdx - 1 + siblingItems.length) % siblingItems.length]);
            }
            if (nextItBtn && siblingItems.length > 1) {
                nextItBtn.onclick = () => showDetailPopup(siblingItems[(curSiblingIdx + 1) % siblingItems.length]);
            }
            box.querySelector("#st-det-copy-tag").onclick = async () => {
                const block = buildDanbooruImageBlock(item, curStageIdx, u);
                try { await navigator.clipboard.writeText(block); showToast("📋 已复制局部特写生图 Tag！", "success"); } catch (e) {}
            };
            box.querySelector("#st-det-zhj-gen").onclick = (e) => { silentBackgroundGenerateImage(item, curStageIdx, u, e.target); };
            box.querySelector("#st-det-ai-btn").onclick = async (e) => {
                const hint = prompt("输入希望 AI 侧重描写的方向（可留空）：", "");
                if (hint === null) return;
                const res = await requestSingleItemAiGen(item.cleanTitle || item.rawKey, hint, e.target);
                if (res) {
                    if (res.stage) box.querySelector("#st-ed-stage").value = res.stage;
                    if (res.desc) box.querySelector("#st-ed-desc").value = res.desc;
                    if (res.thought) box.querySelector("#st-ed-thought").value = res.thought;
                }
            };
            const blkBtn = box.querySelector("#st-det-block-client");
            if (blkBtn) {
                blkBtn.onclick = () => {
                    pushUndoSnapshot(curVars);
                    curVars.已屏蔽恩客 = curVars.已屏蔽恩客 || [];
                    if (item.clientName && !curVars.已屏蔽恩客.includes(item.clientName)) curVars.已屏蔽恩客.push(item.clientName);
                    saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                };
            }
            const delCustBtn = box.querySelector("#st-det-del-custom");
            if (delCustBtn) {
                delCustBtn.onclick = () => {
                    pushUndoSnapshot(curVars);
                    if (curVars.自定义条目?.[item.catTitle]) {
                        curVars.自定义条目[item.catTitle] = curVars.自定义条目[item.catTitle].filter(x => x.id !== item.editKey);
                    }
                    saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                };
            }
            box.querySelector("#st-det-save").onclick = () => {
                if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                pushUndoSnapshot(curVars);
                const stg = box.querySelector("#st-ed-stage").value.trim(), im = box.querySelector("#st-ed-img").value.trim();
                const dsc = box.querySelector("#st-ed-desc").value.trim(), tht = box.querySelector("#st-ed-thought").value.trim();
                const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
                let targetStgForImg = curStageIdx;

                if (tempGodVal !== null && !isNaN(tempGodVal)) {
                    curVars.上帝强制锁定 = curVars.上帝强制锁定 || {};
                    curVars.上帝强制锁定[item.editKey] = tempGodVal;
                    targetStgForImg = tier6(tempGodVal, isRev) + 1;
                    queueSilentChangeForNextTurn(`【${item.cleanTitle || item.editKey}】的数值已被直接改写锁定为 ${tempGodVal}/100（${stageNameFromVal(tempGodVal, isRev)}），正文必须立刻按照该最新阶段状态描写${u}的肉体与反应`);
                }
                if (stg && stg !== overrideRec.stage) {
                    queueSilentChangeForNextTurn(`【${item.cleanTitle || item.editKey}】的状态变为「${stg}」`);
                }
                if (item.isCustom && customRec) {
                    if (stg) customRec.stage = stg;
                    if (tempGodVal !== null && !isNaN(tempGodVal)) customRec.ratio = `${tempGodVal}/100`;
                    customRec.imgUrl = im; customRec.desc = dsc; customRec.thought = tht;
                }
                curVars.按钮详情 = curVars.按钮详情 || {};
                const prev = curVars.按钮详情[item.editKey] || {};
                const nextStageImgs = { ...(prev.stageImgs || {}) };
                const nextStageList = { ...(prev.stageImgList || {}) };
                if (im && im !== prev.imgUrl) {
                    nextStageImgs[targetStgForImg] = im;
                    const oldArr = Array.isArray(nextStageList[targetStgForImg]) ? nextStageList[targetStgForImg] : [];
                    nextStageList[targetStgForImg] = [im, ...oldArr.filter(x => x !== im)];
                    partRandomOffsetMap[item.editKey] = 0;
                }
                curVars.按钮详情[item.editKey] = {
                    ...prev,
                    stage: stg,
                    imgUrl: im || prev.imgUrl,
                    forceLatestImg: im || prev.forceLatestImg,
                    stageImgs: nextStageImgs,
                    stageImgList: nextStageList,
                    desc: dsc,
                    thought: tht
                };
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                showToast("💾 已保存修改并自动同步至下一轮AI正文！", "success");
                checkAndQueueMajorChangeAutoGen(latestStatus.categories, u);
            };
            box.querySelector("#st-det-reset").onclick = () => {
                pushUndoSnapshot(curVars);
                if (curVars.按钮详情?.[item.editKey]) delete curVars.按钮详情[item.editKey];
                if (curVars.上帝强制锁定?.[item.editKey] !== undefined) delete curVars.上帝强制锁定[item.editKey];
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                showToast("↩️ 已恢复默认", "info");
            };
        }

        function openAddCustomItemModal(catTitle) {
            const modal = document.getElementById("st-v5-modal"); if (!modal) return;
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"], box = modal.querySelector(".st-modal-box");
            const defaultPct = safeNum(curVars.核心数值?.淫乱恶堕, 0);
            box.style.background = tc.bg; box.style.border = tc.border; box.style.color = tc.text;
            box.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.12);">
                    <div style="font-size:14px;font-weight:bold;color:#f9e2af;">➕ 在【${catTitle}】新增自定义条目</div>
                    <button id="st-add-close" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:8px;padding:3px 9px;cursor:pointer;">✕</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">
                    <input id="st-new-title" placeholder="条目名称（如：🎀 魅魔桃心尾敏感度）" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;">
                    <input id="st-new-stage" placeholder="状态标签（如：尾尖发情缠绕）" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;">
                    <div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);border-radius:6px;padding:6px 8px;">
                        <div style="font-size:11px;color:#fde047;font-weight:bold;display:flex;justify-content:space-between;">
                            <span>📊 初始开发/崩坏度百分比：</span>
                            <b id="st-new-pct-lbl">${defaultPct}% (第${tier6(defaultPct, false) + 1}阶)</b>
                        </div>
                        <input id="st-new-pct" type="range" min="0" max="100" value="${defaultPct}" style="width:100%;margin-top:4px;cursor:pointer;">
                    </div>
                    <textarea id="st-new-desc" rows="3" placeholder="详细实况描写..." style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;"></textarea>
                    <textarea id="st-new-thought" rows="2" placeholder="第一人称心声..." style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;"></textarea>
                    <button id="st-new-submit" type="button" style="background:${tc.prim};color:#11111b;border:none;border-radius:8px;padding:8px;font-size:12.5px;font-weight:bold;cursor:pointer;">✅ 确认添加</button>
                </div>`;
            modal.style.display = "flex";
            const pctSlider = box.querySelector("#st-new-pct"), pctLbl = box.querySelector("#st-new-pct-lbl");
            pctSlider.oninput = () => {
                const v = parseInt(pctSlider.value, 10);
                pctLbl.textContent = `${v}% (第${tier6(v, false) + 1}阶)`;
            };
            box.querySelector("#st-add-close").onclick = () => { modal.style.display = "none"; };
            box.querySelector("#st-new-submit").onclick = () => {
                const title = box.querySelector("#st-new-title").value.trim(); if (!title) return;
                const pctVal = parseInt(pctSlider.value, 10) || 0;
                const stgTxt = box.querySelector("#st-new-stage").value.trim() || stageNameFromVal(pctVal);
                pushUndoSnapshot(curVars);
                curVars.自定义条目 = curVars.自定义条目 || {};
                curVars.自定义条目[catTitle] = curVars.自定义条目[catTitle] || [];
                curVars.自定义条目[catTitle].push({
                    id: "cust_" + Date.now(),
                    title,
                    ratio: `${pctVal}/100`,
                    stage: stgTxt,
                    desc: box.querySelector("#st-new-desc").value.trim(),
                    thought: box.querySelector("#st-new-thought").value.trim()
                });
                queueSilentChangeForNextTurn(`新增了自定义监控状态【${title}（${pctVal}% · ${stgTxt}）】：${box.querySelector("#st-new-desc").value.trim()}`);
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                showToast(`✅ 已添加【${title}】并同步至下一轮正文！`, "success");
            };
        }

        let currentGalleryTab = "chat";
        let favFilterChar = "ALL";
        let favFilterPart = "ALL";

        function openCgGalleryModal(defaultTab = null) {
            const modal = document.getElementById("st-v5-modal");
            if (!modal) return;
            if (defaultTab) currentGalleryTab = defaultTab;
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            const box = modal.querySelector(".st-modal-box");
            box.style.background = tc.bg; box.style.border = tc.border; box.style.color = tc.text;

            const curU = detectProtagonistName(curVars) || "角色";
            // ✅ 终极修复：严禁从全局 userSettings.cgGallery 往新聊天里复制旧档图片！彻底杜绝同名角色开新局时把上一局满是精液的相册带过来！
            if (!Array.isArray(curVars.专属相册)) {
                curVars.专属相册 = [];
            }
            userSettings.favoriteGallery = Array.isArray(userSettings.favoriteGallery) ? userSettings.favoriteGallery : [];
            userSettings.favoriteGallery.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

            const chatGal = curVars.专属相册;
            const favGal = userSettings.favoriteGallery;
            const isFavTab = (currentGalleryTab === "fav");

            const charSet = new Set(favGal.map(f => f.charName || (f.title || "").split("·")[0]?.trim()).filter(Boolean));
            const partSet = new Set(favGal.map(f => f.editKey).filter(Boolean));

            const filteredList = isFavTab ? favGal.filter(f => {
                const cName = f.charName || (f.title || "").split("·")[0]?.trim() || "";
                if (favFilterChar !== "ALL" && cName !== favFilterChar) return false;
                if (favFilterPart !== "ALL" && f.editKey !== favFilterPart) return false;
                return true;
            }) : chatGal;

            const filterBarHtml = isFavTab && favGal.length > 0 ? `
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:8px;padding:6px 8px;background:rgba(0,0,0,0.35);border-radius:8px;font-size:11px;align-items:center;">
                    <span style="color:#fde047;font-weight:bold;">🔍 筛选:</span>
                    <select id="st-fav-flt-char" style="background:#111;color:#fff;border:1px solid #f472b6;border-radius:5px;padding:2px 5px;font-size:11px;">
                        <option value="ALL">全部角色 (${favGal.length})</option>
                        ${Array.from(charSet).map(c => `<option value="${c}" ${favFilterChar === c ? "selected" : ""}>👩 ${c}</option>`).join("")}
                    </select>
                    <select id="st-fav-flt-part" style="background:#111;color:#fff;border:1px solid #c084fc;border-radius:5px;padding:2px 5px;font-size:11px;">
                        <option value="ALL">全部部位</option>
                        ${Array.from(partSet).map(p => `<option value="${p}" ${favFilterPart === p ? "selected" : ""}>🌸 ${p}</option>`).join("")}
                    </select>
                    <button id="st-fav-export-btn" type="button" style="margin-left:auto;background:rgba(166,227,161,0.2);color:#a6e3a1;border:1px solid #a6e3a1;border-radius:5px;padding:2px 7px;font-size:10.5px;cursor:pointer;">📤 备份收藏库</button>
                    <button id="st-fav-import-btn" type="button" style="background:rgba(103,232,249,0.2);color:#67e8f9;border:1px solid #67e8f9;border-radius:5px;padding:2px 7px;font-size:10.5px;cursor:pointer;">📥 恢复</button>
                    <input id="st-fav-import-file" type="file" accept=".json" style="display:none;">
                </div>
            ` : "";

            const cardsHtml = filteredList.length ? filteredList.map((g, idx) => {
                const realIdx = isFavTab ? favGal.indexOf(g) : idx;
                const realSrc = (g.dbKey && queryImportedImage(g.dbKey)) ? queryImportedImage(g.dbKey) : (queryImportedImage(g.src) || g.src);
                const favFlag = isImageFavorited(realSrc);
                return `
                <div style="background:rgba(0,0,0,0.55);border:1.5px solid ${g.pinned ? '#fde047' : (isFavTab ? '#f472b6' : tc.prim)};border-radius:10px;padding:5px;display:flex;flex-direction:column;gap:4px;position:relative;min-width:0;overflow:hidden;box-sizing:border-box;">
                    <div style="position:absolute;top:7px;right:7px;display:flex;gap:3px;z-index:2;">
                        ${isFavTab ? `<button type="button" class="st-cg-pin-top" data-idx="${realIdx}" title="置顶/取消置顶" style="background:${g.pinned ? '#fde047' : 'rgba(0,0,0,0.78)'};color:${g.pinned ? '#111' : '#fff'};border:1px solid #fde047;border-radius:50%;width:20px;height:20px;font-size:9.5px;cursor:pointer;padding:0;line-height:1;">🔝</button>` : ""}
                        ${!isFavTab ? `<button type="button" class="st-cg-fav-btn" data-idx="${realIdx}" title="收藏到永恒收藏夹" style="background:${favFlag ? '#fde047' : 'rgba(0,0,0,0.78)'};color:${favFlag ? '#111' : '#fde047'};border:1px solid #fde047;border-radius:50%;width:20px;height:20px;font-size:10px;cursor:pointer;padding:0;line-height:1;">⭐</button>` : ""}
                        <button type="button" class="st-cg-dl-btn" data-idx="${realIdx}" title="下载保存" style="background:rgba(16,185,129,0.9);color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:9.5px;cursor:pointer;padding:0;line-height:1;">💾</button>
                        <button type="button" class="st-cg-del-btn" data-idx="${realIdx}" title="删除" style="background:rgba(225,29,72,0.9);color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:9.5px;cursor:pointer;padding:0;line-height:1;">✕</button>
                    </div>
                    <div style="width:100% !important;height:90px !important;max-height:90px !important;background:#07030d;border-radius:6px;overflow:hidden !important;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.08);">
                        <img src="${realSrc}" class="st-cg-zoom" style="max-width:100% !important;max-height:88px !important;width:auto !important;height:auto !important;object-fit:contain !important;display:block;cursor:zoom-in;">
                    </div>
                    <div class="st-cg-edit-note" data-idx="${realIdx}" title="点击修改标题/备注" style="font-size:10.5px;font-weight:bold;color:#f9e2af;display:flex;justify-content:space-between;align-items:center;gap:4px;cursor:pointer;min-width:0;">
                        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;">${g.pinned ? "📌" : ""}${g.note || g.title || "抓拍美图"}</span>
                        <span style="color:#fb7185;flex-shrink:0;font-size:10px;">Lv.${g.stageIdx || 1}</span>
                    </div>
                    <button type="button" class="st-cg-apply-btn" data-idx="${realIdx}" style="background:rgba(244,114,182,0.2);border:1px solid rgba(244,114,182,0.5);color:#fbcfe8;border-radius:5px;padding:2px 4px;font-size:10px;font-weight:bold;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">📌 设为部位配图</button>
                </div>`;
            }).join("") : `<div style="grid-column:1/-1;text-align:center;padding:28px 12px;color:#a6adc8;font-size:12px;">${isFavTab ? "⭐ 您的【永恒收藏夹】暂无符合条件的美图！<br><br>在【📸 本局抓拍】或任意按钮详情里点「⭐」，即可将神图永久珍藏在此处！" : "📸 当前聊天暂无抓拍记录。只要点击任何部位的「🎨 生图」，生成的所有图片都会自动收录到这里！"}</div>`;

            box.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.15);flex-wrap:wrap;gap:6px;">
                    <div style="display:flex;gap:6px;align-items:center;">
                        <button id="st-tab-chat-gal" type="button" style="background:${!isFavTab ? tc.prim : 'rgba(255,255,255,0.1)'};color:${!isFavTab ? '#111' : '#fff'};border:none;border-radius:8px;padding:4px 9px;font-size:11.5px;font-weight:bold;cursor:pointer;">📸 本局抓拍 (${chatGal.length})</button>
                        <button id="st-tab-fav-gal" type="button" style="background:${isFavTab ? 'linear-gradient(135deg,#fde047,#f59e0b)' : 'rgba(255,255,255,0.1)'};color:${isFavTab ? '#111' : '#fde047'};border:1px solid #fde047;border-radius:8px;padding:4px 9px;font-size:11.5px;font-weight:bold;cursor:pointer;">⭐ 永恒收藏夹 (${favGal.length})</button>
                    </div>
                    <div style="display:flex;gap:5px;align-items:center;">
                        ${(!isFavTab && chatGal.length) ? `<button id="st-cg-clear-all" type="button" style="background:rgba(225,29,72,0.25);color:#fda4af;border:1px solid #e11d48;border-radius:6px;padding:3px 8px;font-size:10.5px;cursor:pointer;">🗑️ 清空本局</button>` : ""}
                        <button id="st-cg-close" type="button" style="background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:7px;padding:3px 9px;cursor:pointer;">✕</button>
                    </div>
                </div>
                ${filterBarHtml}
                <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(125px, 1fr));gap:7px;margin-top:8px;max-height:58vh;overflow-y:auto;padding-right:2px;">${cardsHtml}</div>
            `;
            modal.style.display = "flex";

            box.querySelector("#st-tab-chat-gal").onclick = () => openCgGalleryModal("chat");
            box.querySelector("#st-tab-fav-gal").onclick = () => openCgGalleryModal("fav");
            box.querySelector("#st-cg-close").onclick = () => { modal.style.display = "none"; };
            box.querySelectorAll(".st-cg-zoom").forEach(async (im) => {
                im.onclick = () => openTrueFullscreenImage(im.src);
                const rawAttr = im.getAttribute("src") || "";
                if (rawAttr && !rawAttr.startsWith("data:") && !rawAttr.startsWith("http") && !rawAttr.startsWith("blob:") && !rawAttr.startsWith("/")) {
                    const dUrl = await fetchImageAsyncFromDB(rawAttr);
                    if (dUrl) im.src = dUrl;
                }
            });

            const fltChar = box.querySelector("#st-fav-flt-char"), fltPart = box.querySelector("#st-fav-flt-part");
            if (fltChar) fltChar.onchange = (e) => { favFilterChar = e.target.value; openCgGalleryModal("fav"); };
            if (fltPart) fltPart.onchange = (e) => { favFilterPart = e.target.value; openCgGalleryModal("fav"); };

            const resolveGalItemSrcAsync = async (it) => {
                if (!it) return "";
                const cand = it.diskPath || queryImportedImage(it.dbKey) || queryImportedImage(it.src) || "";
                if (cand && (cand.startsWith("data:") || cand.startsWith("http") || cand.startsWith("blob:") || cand.startsWith("/"))) return cand;
                if (it.dbKey) {
                    const fromDb = await fetchImageAsyncFromDB(it.dbKey);
                    if (fromDb) return fromDb;
                }
                if (it.src) {
                    if (it.src.startsWith("data:") || it.src.startsWith("http") || it.src.startsWith("blob:") || it.src.startsWith("/")) return it.src;
                    const fromDb2 = await fetchImageAsyncFromDB(it.src);
                    if (fromDb2) return fromDb2;
                }
                return it.src || "";
            };

            const expFavBtn = box.querySelector("#st-fav-export-btn"), impFavBtn = box.querySelector("#st-fav-import-btn"), impFavFile = box.querySelector("#st-fav-import-file");
            if (expFavBtn) {
                expFavBtn.onclick = async () => {
                    const exportFavs = [];
                    for (const f of favGal) {
                        const realData = await resolveGalItemSrcAsync(f);
                        exportFavs.push({ ...f, src: realData });
                    }
                    const pack = { version: "1.0_fav_backup", favoriteGallery: exportFavs, installedPatches: userSettings.installedPatches || [] };
                    const blob = new Blob([JSON.stringify(pack)], { type: "application/json" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `状态栏永恒收藏夹与补丁全量备份_${Date.now()}.json`;
                    a.click();
                    showToast("📤 已导出【永恒收藏夹+已装补丁】全量备份包！", "success");
                };
            }
            if (impFavBtn && impFavFile) {
                impFavBtn.onclick = () => impFavFile.click();
                impFavFile.onchange = async (e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    try {
                        const data = JSON.parse(await f.text());
                        if (Array.isArray(data.favoriteGallery)) {
                            for (const item of data.favoriteGallery) {
                                if (item.dbKey && item.src && item.src.startsWith("data:")) {
                                    await rawSaveDataUrlToDB(item.dbKey, item.src).catch(() => {});
                                    item.src = item.dbKey;
                                }
                                if (!userSettings.favoriteGallery.some(x => x.fp === item.fp)) userSettings.favoriteGallery.push(item);
                            }
                        }
                        if (Array.isArray(data.installedPatches) && data.installedPatches.length) {
                            userSettings.installedPatches = data.installedPatches;
                            executeStoredPatches();
                        }
                        saveSettings();
                        openCgGalleryModal("fav");
                        showToast("✅ 成功恢复收藏夹图库与补丁备份！", "success");
                    } catch (err) { showToast("❌ 备份文件解析失败", "error"); }
                };
            }

            box.querySelectorAll(".st-cg-pin-top").forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    if (favGal[idx]) { favGal[idx].pinned = !favGal[idx].pinned; saveSettings(); openCgGalleryModal("fav"); }
                };
            });

            box.querySelectorAll(".st-cg-edit-note").forEach(el => {
                el.onclick = (e) => {
                    e.stopPropagation();
                    const idx = parseInt(el.getAttribute("data-idx"), 10);
                    const target = isFavTab ? favGal[idx] : chatGal[idx];
                    if (!target) return;
                    const newNote = prompt("✏️ 请输入这张图片的自定义标题/备注：", target.note || target.title || "");
                    if (newNote === null) return;
                    target.note = newNote.trim();
                    target.title = newNote.trim() || target.title;
                    if (isFavTab) saveSettings(); else saveChatCache(curVars);
                    openCgGalleryModal(currentGalleryTab);
                };
            });

            box.querySelectorAll(".st-cg-fav-btn").forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    const item = chatGal[idx];
                    if (!item) return;
                    const realSrc = await resolveGalItemSrcAsync(item);
                    await toggleFavoriteImage(realSrc, { title: item.title, editKey: item.editKey, stageIdx: item.stageIdx || 1, corr: item.corr, quote: item.quote });
                    openCgGalleryModal("chat");
                };
            });

            box.querySelectorAll(".st-cg-dl-btn").forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    const item = isFavTab ? favGal[idx] : chatGal[idx];
                    if (!item) return;
                    const realSrc = await resolveGalItemSrcAsync(item);
                    downloadImageToDevice(realSrc, item.note || item.title || `收藏美图_${idx + 1}`);
                };
            });

            box.querySelectorAll(".st-cg-del-btn").forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    if (isFavTab) {
                        const target = favGal[idx];
                        if (!confirm(`🗑️ 确定要从【⭐永恒收藏夹】中彻底删除「${target?.title || "这张图片"}」吗？`)) return;
                        const removed = favGal.splice(idx, 1)[0];
                        if (removed?.dbKey) {
                            const nk = normalizeImgKey(removed.dbKey);
                            try {
                                const db = await openImageDB();
                                const tx = db.transaction(IDB_STORE, "readwrite");
                                tx.objectStore(IDB_STORE).delete(removed.dbKey);
                                if (nk) tx.objectStore(IDB_STORE).delete(nk);
                                importedImgCache.delete(removed.dbKey);
                                if (nk) { importedImgCache.delete(nk); dbKeyIndexSet.delete(nk); }
                            } catch (err) {}
                        }
                        saveSettings();
                        openCgGalleryModal("fav");
                    } else {
                        chatGal.splice(idx, 1);
                        userSettings.cgGallery = chatGal;
                        saveSettings();
                        saveChatCache(curVars);
                        openCgGalleryModal("chat");
                    }
                };
            });

            box.querySelectorAll(".st-cg-apply-btn").forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    const favItem = isFavTab ? favGal[idx] : chatGal[idx];
                    if (!favItem) return;
                    const realSrc = await resolveGalItemSrcAsync(favItem);

                    const PART_GROUPS = getAllAssignablePartGroups();

                    let picker = document.getElementById("st-part-picker-overlay");
                    if (!picker) {
                        picker = document.createElement("div");
                        picker.id = "st-part-picker-overlay";
                        picker.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.82);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:12px;";
                        document.body.appendChild(picker);
                    }

                    picker.innerHTML = `
                        <div style="background:linear-gradient(160deg,#27153b,#0d0618);border:2px solid #fde047;border-radius:14px;padding:12px;width:92vw;max-width:440px;max-height:82vh;overflow-y:auto;color:#fff;box-shadow:0 16px 48px #000;">
                            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:8px;margin-bottom:8px;">
                                <b style="color:#fde047;font-size:13.5px;">📌 点选要将这张图挂载到哪个按钮：</b>
                                <button id="st-pk-close" type="button" style="background:#ff003c;color:#fff;border:none;border-radius:6px;padding:2px 9px;font-weight:bold;cursor:pointer;">✕</button>
                            </div>
                            ${PART_GROUPS.map(g => `
                                <div style="margin-bottom:8px;">
                                    <div style="font-size:11px;color:#f472b6;font-weight:bold;margin-bottom:4px;">${g.group}</div>
                                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;">
                                        ${g.list.map(([k, label]) => `<button type="button" class="st-pk-item-btn" data-k="${k}" data-label="${label}" style="background:${favItem.editKey === k ? 'linear-gradient(135deg,#fde047,#f59e0b)' : 'rgba(255,255,255,0.1)'};color:${favItem.editKey === k ? '#111' : '#fff'};border:1px solid rgba(244,114,182,0.4);border-radius:7px;padding:5px 4px;font-size:11px;font-weight:bold;cursor:pointer;">${label}</button>`).join("")}
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    `;
                    picker.style.display = "flex";
                    picker.querySelector("#st-pk-close").onclick = () => { picker.style.display = "none"; };
                    picker.onclick = (ev) => { if (ev.target === picker) picker.style.display = "none"; };

                    picker.querySelectorAll(".st-pk-item-btn").forEach(pBtn => {
                        pBtn.onclick = async () => {
                            const k = pBtn.getAttribute("data-k");
                            const label = pBtn.getAttribute("data-label");
                            const u = detectProtagonistName(curVars) || "角色";
                            const curActiveStg = getRealStageByKey(k, curVars);
                            const imgInherentStg = (Number(favItem.stageIdx) > 1) ? Number(favItem.stageIdx) : (safeNum(favItem.corr) >= 20 ? (tier6(safeNum(favItem.corr), false) + 1) : curActiveStg);
                            const scopedKey = normalizeImgKey(getProtagScopedImgKey(k, curActiveStg));

                            if (realSrc && realSrc.startsWith("data:")) {
                                await rawSaveDataUrlToDB(scopedKey, realSrc).catch(() => {});
                                importedImgCache.set(scopedKey, realSrc);
                            }
                            let refVal = (realSrc && realSrc.startsWith("data:")) ? scopedKey : (favItem.dbKey || favItem.src);

                            favItem.editKey = k;
                            favItem.stageIdx = imgInherentStg;
                            favItem.title = `${u} · ${label}`;
                            favItem.note = `${u} · ${label}`;

                            if (realSrc && (realSrc.startsWith("data:") || realSrc.startsWith("/"))) {
                                const poolRef = await registerImageToReusablePool(k, imgInherentStg, realSrc, u, { corr: favItem.corr, forceDirty: imgInherentStg > 1 });
                                if (poolRef) refVal = poolRef;
                            }

                            partRandomOffsetMap[k] = 0;
                            curVars.按钮详情 = curVars.按钮详情 || {};
                            const prev = curVars.按钮详情[k] || {};
                            const prevList = Array.isArray(prev.stageImgList?.[curActiveStg]) ? prev.stageImgList[curActiveStg] : [];
                            curVars.按钮详情[k] = {
                                ...prev,
                                imgUrl: refVal,
                                forceLatestImg: refVal,
                                stageImgs: { ...(prev.stageImgs || {}), [curActiveStg]: refVal },
                                stageImgList: { ...(prev.stageImgList || {}), [curActiveStg]: [refVal, ...prevList.filter(x => x !== refVal)] }
                            };

                            userSettings.cgGallery = curVars.专属相册;
                            saveSettings();
                            saveChatCache(curVars);
                            latestStatus = getFallbackData();
                            renderBody();
                            picker.style.display = "none";
                            openCgGalleryModal(currentGalleryTab);
                            showToast(`✅ 已成功将此图绑定至【${label} (第${curActiveStg}阶)】按钮！`, "success", 2600);
                        };
                    });
                };
            });

            const clrAllBtn = box.querySelector("#st-cg-clear-all");
            if (clrAllBtn) {
                clrAllBtn.onclick = () => {
                    if (!confirm("确定要清空当前聊天的抓拍记录吗？（注：⭐永恒收藏夹与永久图池里的图片不受影响）")) return;
                    curVars.专属相册 = [];
                    userSettings.cgGallery = [];
                    saveSettings();
                    saveChatCache(curVars);
                    openCgGalleryModal("chat");
                };
            }
        }

        // =========================================================================
        // 🧩 热插拔补丁引擎 API + ⚙️ 全局设置中心 + 🏛️ 主界面渲染 + 🚀 启动闭合
        // =========================================================================
        let currentExecutingPatchIdx = -1;

        window.ST_PatchAPI = {
            version: "1.0",
            getVars: () => curVars,
            getSettings: () => userSettings,
            save: () => { pushUndoSnapshot(curVars); saveSettings(); saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); },
            toast: showToast,
            addTopWidget: (id, renderFn) => {
                const idx = customTopWidgets.findIndex(w => w.id === id);
                if (idx >= 0) {
                    customTopWidgets[idx].renderFn = renderFn;
                    customTopWidgets[idx].patchIdx = currentExecutingPatchIdx;
                } else {
                    customTopWidgets.push({ id, renderFn, patchIdx: currentExecutingPatchIdx });
                }
            },
            addDirectorButton: (label, onClickFn) => { customDirectorButtons.push({ label, onClickFn, patchIdx: currentExecutingPatchIdx }); },
            addPromptRule: (ruleFn) => { customPromptRules.push(ruleFn); }
        };

        function executeStoredPatches() {
            customTopWidgets.length = 0;
            customDirectorButtons.length = 0;
            customPromptRules.length = 0;
            (userSettings.installedPatches || []).forEach((p, idx) => {
                if (!p || p.disabled || !p.code) return;
                try {
                    currentExecutingPatchIdx = idx;
                    const fn = new Function("API", p.code);
                    fn(window.ST_PatchAPI);
                } catch (err) {
                    console.error(`[状态栏1.0] 补丁 #${idx + 1} (${p.name || "未命名"}) 执行异常:`, err);
                } finally {
                    currentExecutingPatchIdx = -1;
                }
            });
        }

        function buildPromptInjection(userName, currentVars) {
            return buildFullSystemPrompt(userName, currentVars);
        }

        function promptSwitchTargetCharacter(directTargetName = null) {
            const oldName = detectProtagonistName(curVars);
            if (typeof directTargetName === "string") {
                return executeSwitchTargetCharacter(oldName, directTargetName.trim());
            }
            const ctx = safeCtx();
            const charCardName = safeStr(ctx?.name2).trim();
            const userPersonaName = safeStr(ctx?.name1).trim();

            let modal = document.getElementById("st-role-switch-modal");
            if (!modal) {
                modal = document.createElement("div");
                modal.id = "st-role-switch-modal";
                modal.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.82);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:14px;";
                document.body.appendChild(modal);
            }

            const renderRoleModalContent = () => {
                const curActiveName = detectProtagonistName(curVars);
                curVars.已删除角色列表 = Array.isArray(curVars.已删除角色列表) ? curVars.已删除角色列表 : [];
                const deletedSet = new Set(curVars.已删除角色列表);

                if (curVars.角色独立槽位 && typeof curVars.角色独立槽位 === "object") {
                    Object.keys(curVars.角色独立槽位).forEach(k => {
                        if (!isValidCharacterName(k) || deletedSet.has(k)) delete curVars.角色独立槽位[k];
                    });
                }
                const savedRoles = Object.keys(curVars.角色独立槽位 || {}).filter(n => !deletedSet.has(n));
                const baseRoles = [curActiveName, charCardName, userPersonaName].filter(n => isValidCharacterName(n) && !deletedSet.has(n));
                const quickCandidates = [...new Set([...baseRoles, ...savedRoles])];

                modal.innerHTML = `
                    <div style="background:linear-gradient(160deg,#27153b,#0d0618);border:2px solid #67e8f9;border-radius:15px;padding:14px;width:92vw;max-width:420px;color:#fff;box-shadow:0 18px 50px #000;">
                        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:8px;margin-bottom:10px;">
                            <b style="color:#fde047;font-size:13.5px;">🎯 切换与管理监控角色 (可随时删除)</b>
                            <button id="st-rsm-close" type="button" style="background:#ff003c;color:#fff;border:none;border-radius:6px;padding:2px 9px;cursor:pointer;font-weight:bold;">✕</button>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:4px;flex-wrap:wrap;">
                            <span style="font-size:11px;color:#cbd5e1;">⚡ 点击名字切换，点右侧 <b style="color:#ff4d6d;">✕</b> 即可彻底删除该人物槽：</span>
                            ${quickCandidates.length > 1 ? `<button id="st-rsm-clear-slots" type="button" style="background:rgba(225,29,72,0.28);color:#fda4af;border:1px solid #e11d48;border-radius:6px;padding:2px 7px;font-size:10px;cursor:pointer;white-space:nowrap;">🧹 仅保留当前角色</button>` : ""}
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
                            ${quickCandidates.map(rName => {
                                const isCur = (rName === curActiveName);
                                return `<div style="display:inline-flex;align-items:center;background:${isCur ? 'linear-gradient(135deg,#ec4899,#8b5cf6)' : 'rgba(255,255,255,0.1)'};border:1px solid ${isCur ? '#fde047' : 'rgba(103,232,249,0.4)'};border-radius:99px;overflow:hidden;">
                                    <button type="button" class="st-rsm-pick" data-name="${rName}" style="background:transparent;border:none;color:#fff;padding:5px 10px;font-size:11.5px;font-weight:bold;cursor:pointer;">${isCur ? "🟢 " : "👩 "}${rName}</button>
                                    <button type="button" class="st-rsm-del-role" data-name="${rName}" title="彻底删除人物槽【${rName}】" style="background:rgba(225,29,72,0.85);color:#fff;border:none;border-left:1px solid rgba(255,255,255,0.25);padding:5px 8px;font-size:10.5px;font-weight:bold;cursor:pointer;">✕</button>
                                </div>`;
                            }).join("")}
                            <button type="button" class="st-rsm-pick st-pill-btn" data-name="" style="padding:5px 10px;font-size:11px;color:#a6e3a1;border-color:#a6e3a1;">🔄 恢复自动识别</button>
                        </div>
                        <div style="font-size:11px;color:#fbcfe8;margin-bottom:5px;">✍️ 或输入正文中新登场的角色真名（手动输入可解除该名字的删除屏蔽）：</div>
                        <div style="display:flex;gap:6px;">
                            <input id="st-rsm-inp" value="${curActiveName}" placeholder="输入角色真名..." style="flex:1;background:#111;color:#fde047;border:1px solid #f472b6;border-radius:7px;padding:6px 9px;font-size:12px;">
                            <button id="st-rsm-confirm" type="button" style="background:linear-gradient(135deg,#10b981,#06b6d4);color:#fff;border:none;border-radius:7px;padding:6px 14px;font-size:12px;font-weight:bold;cursor:pointer;">✅ 切换</button>
                        </div>
                    </div>
                `;

                modal.querySelector("#st-rsm-close").onclick = () => { modal.style.display = "none"; };
                modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

                modal.querySelectorAll(".st-rsm-pick").forEach(b => {
                    b.onclick = () => {
                        const target = b.getAttribute("data-name") || "";
                        if (!target) {
                            curVars.已删除角色列表 = [];
                        }
                        modal.style.display = "none";
                        executeSwitchTargetCharacter(curActiveName, target, false);
                    };
                });

                modal.querySelectorAll(".st-rsm-del-role").forEach(b => {
                    b.onclick = (e) => {
                        e.stopPropagation();
                        const delName = b.getAttribute("data-name");
                        if (!delName) return;

                        curVars.已删除角色列表 = Array.isArray(curVars.已删除角色列表) ? curVars.已删除角色列表 : [];
                        if (!curVars.已删除角色列表.includes(delName)) {
                            curVars.已删除角色列表.push(delName);
                        }
                        if (curVars.角色独立槽位 && curVars.角色独立槽位[delName]) {
                            delete curVars.角色独立槽位[delName];
                        }

                        // 如果删除的恰好是当前正在监控的角色，自动切换到剩余候选人中的第一个（不把已删角色重新存回槽位！）
                        if (delName === curActiveName) {
                            const remaining = quickCandidates.filter(n => n !== delName);
                            const nextRole = remaining[0] || userPersonaName || charCardName || "主角";
                            curVars.已删除角色列表 = curVars.已删除角色列表.filter(n => n !== nextRole);
                            executeSwitchTargetCharacter(delName, nextRole, true);
                        } else {
                            saveChatCache(curVars);
                            latestStatus = getFallbackData();
                            renderBody();
                        }
                        showToast(`🗑️ 已彻底删除人物槽【${delName}】！`, "info", 2200);
                        renderRoleModalContent();
                    };
                });

                const clrSlotsBtn = modal.querySelector("#st-rsm-clear-slots");
                if (clrSlotsBtn) {
                    clrSlotsBtn.onclick = () => {
                        curVars.已删除角色列表 = Array.isArray(curVars.已删除角色列表) ? curVars.已删除角色列表 : [];
                        quickCandidates.forEach(n => {
                            if (n !== curActiveName && !curVars.已删除角色列表.includes(n)) {
                                curVars.已删除角色列表.push(n);
                            }
                        });
                        curVars.角色独立槽位 = {};
                        saveChatCache(curVars);
                        showToast(`🧹 已清空所有多余角色槽位，仅保留【${curActiveName}】！`, "success", 2200);
                        renderRoleModalContent();
                        latestStatus = getFallbackData();
                        renderBody();
                    };
                }

                modal.querySelector("#st-rsm-confirm").onclick = () => {
                    const v = modal.querySelector("#st-rsm-inp").value.trim();
                    if (v && Array.isArray(curVars.已删除角色列表)) {
                        curVars.已删除角色列表 = curVars.已删除角色列表.filter(n => n !== v);
                    }
                    modal.style.display = "none";
                    executeSwitchTargetCharacter(curActiveName, v, false);
                };
            };

            renderRoleModalContent();
            modal.style.display = "flex";
        }

        function executeSwitchTargetCharacter(oldName, trimmed, skipSaveOldSlot = false) {
            pushUndoSnapshot(curVars);
            curVars.档案 = curVars.档案 || {};
            curVars.角色独立槽位 = curVars.角色独立槽位 || {};
            curVars.已删除角色列表 = Array.isArray(curVars.已删除角色列表) ? curVars.已删除角色列表 : [];

            // 1. 只有在非删除切换（skipSaveOldSlot === false）且旧角色不在删除黑名单里时，才把旧角色打包存入独立槽位！
            if (oldName && !skipSaveOldSlot && !curVars.已删除角色列表.includes(oldName)) {
                curVars.角色独立槽位[oldName] = {
                    角色创世楼层: typeof curVars.角色创世楼层 === "number" ? curVars.角色创世楼层 : 0,
                    上次清洗楼层: typeof curVars.上次清洗楼层 === "number" ? curVars.上次清洗楼层 : -1,
                    已手动清空精液: Boolean(curVars.已手动清空精液),
                    手动总账基准楼层: typeof curVars.手动总账基准楼层 === "number" ? curVars.手动总账基准楼层 : undefined,
                    手动总账基准快照: curVars.手动总账基准快照 ? JSON.parse(JSON.stringify(curVars.手动总账基准快照)) : undefined,
                    手动精液基准楼层: typeof curVars.手动精液基准楼层 === "number" ? curVars.手动精液基准楼层 : undefined,
                    手动精液基准快照: curVars.手动精液基准快照 ? JSON.parse(JSON.stringify(curVars.手动精液基准快照)) : undefined,
                    档案: JSON.parse(JSON.stringify(curVars.档案 || {})),
                    核心数值: JSON.parse(JSON.stringify(curVars.核心数值 || {})),
                    精神与心理: JSON.parse(JSON.stringify(curVars.精神与心理 || {})),
                    精神与心理扩展: JSON.parse(JSON.stringify(curVars.精神与心理扩展 || {})),
                    身体: JSON.parse(JSON.stringify(curVars.身体 || {})),
                    计数: JSON.parse(JSON.stringify(curVars.计数 || {})),
                    体内精液存量: JSON.parse(JSON.stringify(curVars.体内精液存量 || {})),
                    受孕与生理: JSON.parse(JSON.stringify(curVars.受孕与生理 || {})),
                    痕迹与标记: JSON.parse(JSON.stringify(curVars.痕迹与标记 || {})),
                    体内道具与权限: JSON.parse(JSON.stringify(curVars.体内道具与权限 || {})),
                    实况: JSON.parse(JSON.stringify(curVars.实况 || {})),
                    穿搭: JSON.parse(JSON.stringify(curVars.穿搭 || {})),
                    性癖: JSON.parse(JSON.stringify(curVars.性癖 || {})),
                    按钮详情: sanitizeBase64FromBtnDetails(curVars.按钮详情 || {}),
                    上帝强制锁定: JSON.parse(JSON.stringify(curVars.上帝强制锁定 || {})),
                    历史最高崩坏度: JSON.parse(JSON.stringify(curVars.历史最高崩坏度 || {})),
                    恩客图鉴: JSON.parse(JSON.stringify(curVars.恩客图鉴 || {})),
                    已屏蔽恩客: [...(curVars.已屏蔽恩客 || [])],
                    锁定外貌DNA: curVars.档案.锁定外貌DNA || "",
                    玩法扩展状态: {
                        hypnoTriggers: Array.isArray(userSettings.hypnoTriggers) ? [...userSettings.hypnoTriggers] : [],
                        parasiteState: userSettings.parasiteState ? { ...userSettings.parasiteState } : { type: "无寄生", lv: 0, eggCount: 0 },
                        objectificationId: userSettings.objectificationId || "free",
                        edgingLockActive: Boolean(userSettings.edgingLockActive),
                        clothDurability: safeNum(userSettings.clothDurability, 100)
                    }
                };
            }

            let finalName = "";
            if (!trimmed) {
                userSettings.customTargetName = "";
                curVars.档案.手动锁定真名 = "";
                curVars.档案.当前认知名字 = "";
                finalName = detectProtagonistName(curVars);
            } else {
                const ctx = safeCtx();
                finalName = trimmed;
                if (trimmed.toLowerCase() === "char" || trimmed === "角色卡") finalName = safeStr(ctx?.name2, "角色").trim();
                else if (trimmed.toLowerCase() === "user" || trimmed === "主角") finalName = safeStr(ctx?.name1, "主角").trim();
                curVars.已删除角色列表 = curVars.已删除角色列表.filter(n => n !== finalName);
                userSettings.customTargetName = finalName;
                curVars.档案.手动锁定真名 = finalName;
                curVars.档案.当前认知名字 = finalName;
            }

            if (finalName && finalName !== oldName) {
                const targetSlot = curVars.角色独立槽位[finalName];
                const initV = getInitialVars();
                if (targetSlot) {
                    ["档案", "核心数值", "精神与心理", "精神与心理扩展", "身体", "计数", "体内精液存量", "受孕与生理", "痕迹与标记", "体内道具与权限", "实况", "穿搭", "性癖"].forEach(k => {
                        curVars[k] = targetSlot[k] ? JSON.parse(JSON.stringify(targetSlot[k])) : initV[k];
                    });
                    curVars.角色创世楼层 = typeof targetSlot.角色创世楼层 === "number" ? targetSlot.角色创世楼层 : 0;
                    curVars.上次清洗楼层 = typeof targetSlot.上次清洗楼层 === "number" ? targetSlot.上次清洗楼层 : -1;
                    curVars.已手动清空精液 = Boolean(targetSlot.已手动清空精液);
                    curVars.手动总账基准楼层 = targetSlot.手动总账基准楼层;
                    curVars.手动总账基准快照 = targetSlot.手动总账基准快照 ? JSON.parse(JSON.stringify(targetSlot.手动总账基准快照)) : undefined;
                    curVars.手动精液基准楼层 = targetSlot.手动精液基准楼层;
                    curVars.手动精液基准快照 = targetSlot.手动精液基准快照 ? JSON.parse(JSON.stringify(targetSlot.手动精液基准快照)) : undefined;
                    curVars.按钮详情 = targetSlot.按钮详情 ? JSON.parse(JSON.stringify(targetSlot.按钮详情)) : {};
                    curVars.上帝强制锁定 = targetSlot.上帝强制锁定 ? JSON.parse(JSON.stringify(targetSlot.上帝强制锁定)) : {};
                    curVars.历史最高崩坏度 = targetSlot.历史最高崩坏度 ? JSON.parse(JSON.stringify(targetSlot.历史最高崩坏度)) : {};
                    curVars.恩客图鉴 = targetSlot.恩客图鉴 ? JSON.parse(JSON.stringify(targetSlot.恩客图鉴)) : {};
                    curVars.已屏蔽恩客 = Array.isArray(targetSlot.已屏蔽恩客) ? [...targetSlot.已屏蔽恩客] : [];
                    curVars.档案.锁定外貌DNA = targetSlot.锁定外貌DNA || "";
                    if (targetSlot.玩法扩展状态) {
                        const ext = targetSlot.玩法扩展状态;
                        userSettings.hypnoTriggers = Array.isArray(ext.hypnoTriggers) ? [...ext.hypnoTriggers] : [];
                        userSettings.parasiteState = ext.parasiteState ? { ...ext.parasiteState } : { type: "无寄生", lv: 0, eggCount: 0 };
                        userSettings.objectificationId = ext.objectificationId || "free";
                        userSettings.edgingLockActive = Boolean(ext.edgingLockActive);
                        userSettings.clothDurability = safeNum(ext.clothDurability, 100);
                    }
                } else {
                    ["档案", "核心数值", "精神与心理", "精神与心理扩展", "身体", "计数", "体内精液存量", "受孕与生理", "痕迹与标记", "体内道具与权限", "实况", "穿搭", "性癖"].forEach(k => {
                        curVars[k] = JSON.parse(JSON.stringify(initV[k]));
                    });
                    curVars.角色创世楼层 = safeCtx()?.chat?.length || 0;
                    curVars.上次清洗楼层 = safeCtx()?.chat?.length || 0;
                    curVars.已手动清空精液 = false;
                    delete curVars.手动总账基准楼层;
                    delete curVars.手动总账基准快照;
                    delete curVars.手动精液基准楼层;
                    delete curVars.手动精液基准快照;
                    curVars.按钮详情 = {};
                    curVars.上帝强制锁定 = {};
                    curVars.历史最高崩坏度 = {};
                    curVars.恩客图鉴 = {};
                    curVars.已屏蔽恩客 = [];
                    curVars.档案.锁定外貌DNA = "";
                    userSettings.hypnoTriggers = [];
                    userSettings.parasiteState = { type: "无寄生", lv: 0, eggCount: 0 };
                    userSettings.objectificationId = "free";
                    userSettings.edgingLockActive = false;
                    userSettings.clothDurability = 100;
                }
                curVars.档案.手动锁定真名 = finalName;
                curVars.档案.当前认知名字 = finalName;
                _organDevCache = { sig: "", res: null };
                _appearMemoCache = { sig: "", res: null };
                userSettings.lockedAppearanceTags = curVars.档案.锁定外貌DNA || getLockedAppearanceTags(finalName, curVars);
                Object.keys(partRandomOffsetMap).forEach(k => delete partRandomOffsetMap[k]);
            }

            saveSettings();
            saveChatCache(curVars);
            latestStatus = getFallbackData();
            renderBody();
            if (!skipSaveOldSlot) {
                showToast(`🎯 监控目标已切换为：【${finalName}】（数据与创世楼层已100%独立隔离！）`, "success");
            }
        }
        
        function openReusablePoolManagerModal(filterPart = "ALL") {
            let modal = document.getElementById("st-pool-mgr-modal");
            if (!modal) {
                modal = document.createElement("div");
                modal.id = "st-pool-mgr-modal";
                modal.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.85);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:12px;";
                document.body.appendChild(modal);
            }

            userSettings.reusableImgPool = Array.isArray(userSettings.reusableImgPool) ? userSettings.reusableImgPool : [];
            const pool = userSettings.reusableImgPool;
            const partKeys = [...new Set(pool.map(x => x.editKey).filter(Boolean))];
            const shownList = filterPart === "ALL" ? pool : pool.filter(x => x.editKey === filterPart);

            const cardsHtml = shownList.length ? shownList.map((item) => {
                const realIdx = pool.indexOf(item);
                const imgSrc = item.diskPath || queryImportedImage(item.dbKey) || item.dbKey;
                return `
                    <div style="background:rgba(20,10,35,0.95);border:1.5px solid ${item.isUniversalOrgan ? '#10b981' : '#f472b6'};border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:4px;position:relative;">
                        <span style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.8);color:${item.isUniversalOrgan ? '#6ee7b7' : '#fbcfe8'};padding:1px 6px;border-radius:99px;font-size:9.5px;font-weight:bold;border:1px solid currentColor;">
                            ${item.isUniversalOrgan ? "🌸局部通用" : "👩外貌/款式匹配"} · Lv.${item.stageNum}阶
                        </span>
                        <button type="button" class="st-pm-del" data-idx="${realIdx}" title="从图池彻底删除" style="position:absolute;top:8px;right:8px;background:#e11d48;color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:11px;font-weight:bold;cursor:pointer;">✕</button>
                        <div style="width:100%;height:96px;background:#07030d;border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                            <img src="${imgSrc}" class="st-pm-zoom" style="max-width:100%;max-height:94px;object-fit:contain;cursor:zoom-in;">
                        </div>
                        <div style="font-size:11px;font-weight:bold;color:#fde047;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">📌 ${item.editKey} (第${item.stageNum}阶)</div>
                        <div style="font-size:9.5px;color:#a6e3a1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.fullDna || item.dna || ''}">🧬 ${summarizeDnaTagsToChinese(item.fullDna || item.dna || item.skinDna || "")}</div>
                        <div style="font-size:9px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.wearSig || ''}">👗 ${item.isUniversalOrgan ? "局部器官(同肤质通用)" : (item.wearSig || "不限穿搭")}</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px;">
                            <button type="button" class="st-pm-edit" data-idx="${realIdx}" style="background:rgba(139,92,246,0.3);color:#ddd6fe;border:1px solid #8b5cf6;border-radius:5px;padding:3px;font-size:10px;font-weight:bold;cursor:pointer;">✏️ 改部位/阶位</button>
                            <button type="button" class="st-pm-toggle-uni" data-idx="${realIdx}" style="background:rgba(16,185,129,0.25);color:#a7f3d0;border:1px solid #10b981;border-radius:5px;padding:3px;font-size:10px;cursor:pointer;">${item.isUniversalOrgan ? "切为外貌锁" : "切为全通用"}</button>
                        </div>
                    </div>
                `;
            }).join("") : `<div style="grid-column:1/-1;text-align:center;padding:32px 12px;color:#94a3b8;font-size:12px;">🗂️ 当前复用图池为空！<br><br>你可以点击设置里的「📥 将现有相册/缓存图全部收入永久图池」，或者直接去给任意部位点「🎨 生图」，生成的所有图片都会自动按部位和阶位沉淀到这里！</div>`;

            modal.innerHTML = `
                <div style="background:linear-gradient(160deg,#1e1030,#090410);border:2px solid #67e8f9;border-radius:16px;padding:14px;width:94vw;max-width:520px;max-height:86vh;display:flex;flex-direction:column;color:#fff;box-shadow:0 20px 60px #000;">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:8px;margin-bottom:8px;">
                        <div>
                            <div style="font-size:14px;font-weight:bold;color:#67e8f9;">🗂️ 永久动态复用图池管理中心 (共 ${pool.length} 张)</div>
                            <div style="font-size:10.5px;color:#cbd5e1;">位置：IndexedDB(${IDB_NAME}) · 等阶达标后自动与初始图随机轮播</div>
                        </div>
                        <button id="st-pm-close" type="button" style="background:#ff003c;color:#fff;border:none;border-radius:8px;padding:4px 10px;font-weight:bold;cursor:pointer;">✕</button>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
                        <select id="st-pm-filter" style="background:#111;color:#fde047;border:1px solid #67e8f9;border-radius:6px;padding:4px 8px;font-size:11.5px;">
                            <option value="ALL">🔍 筛选部位：全部部位 (${pool.length}张)</option>
                            ${partKeys.map(k => `<option value="${k}" ${filterPart === k ? "selected" : ""}>📌 ${k} (${pool.filter(x => x.editKey === k).length}张)</option>`).join("")}
                        </select>
                        <div style="display:flex;gap:5px;flex-wrap:wrap;">
                            <button type="button" id="st-pm-dedup-clean" style="background:linear-gradient(135deg,#fde047,#f59e0b);color:#111;border:none;border-radius:6px;padding:4px 9px;font-size:11px;font-weight:bold;cursor:pointer;">🧹 一键去重并清理幽灵缓存</button>
                            ${pool.length ? `<button type="button" id="st-pm-clear-all" style="background:rgba(225,29,72,0.25);color:#fda4af;border:1px solid #e11d48;border-radius:6px;padding:4px 9px;font-size:11px;cursor:pointer;">🗑️ 清空当前筛选(${shownList.length}张)</button>` : ""}
                        </div>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(138px,1fr));gap:8px;overflow-y:auto;max-height:62vh;padding-right:2px;">${cardsHtml}</div>
                </div>
            `;
            modal.style.display = "flex";

            modal.querySelector("#st-pm-close").onclick = () => { modal.style.display = "none"; renderBody(); };
            modal.querySelector("#st-pm-dedup-clean").onclick = async () => {
                const seenFpSet = new Set();
                const cleanPool = [];
                let removedDup = 0;

                for (const p of userSettings.reusableImgPool) {
                    if (!p || !p.editKey) continue;
                    let realData = queryImportedImage(p.dbKey) || p.diskPath || "";
                    if (!realData && p.dbKey) realData = await fetchImageAsyncFromDB(p.dbKey);
                    const contentFp = (realData && realData.startsWith("data:")) ? getImgFingerprint(realData) : (p.fp || p.dbKey);
                    const trueFp = `${p.editKey}_${contentFp}`;
                    if (seenFpSet.has(trueFp)) {
                        removedDup++;
                        continue;
                    }
                    seenFpSet.add(trueFp);
                    cleanPool.push(p);
                }
                userSettings.reusableImgPool = cleanPool;
                saveSettings();

                // 统计所有真正还在使用的有效 Key（保护默认初始图、收藏夹、图池、本局相册）
                const activeKeys = new Set();
                cleanPool.forEach(p => { if (p.dbKey) activeKeys.add(normalizeImgKey(p.dbKey)); });
                (userSettings.favoriteGallery || []).forEach(f => { if (f.dbKey) activeKeys.add(normalizeImgKey(f.dbKey)); });
                (curVars.专属相册 || []).forEach(g => { if (g.dbKey) activeKeys.add(normalizeImgKey(g.dbKey)); });
                Object.keys(userSettings.globalPinnedStageImgs || {}).forEach(k => activeKeys.add(normalizeImgKey(k)));

                let purgedDbCnt = 0;
                try {
                    const db = await openImageDB();
                    const tx = db.transaction(IDB_STORE, "readwrite");
                    const store = tx.objectStore(IDB_STORE);
                    const allKeysReq = store.getAllKeys();
                    const allDbKeys = await new Promise(r => { allKeysReq.onsuccess = () => r(allKeysReq.result || []); allKeysReq.onerror = () => r([]); });

                    for (const rawK of allDbKeys) {
                        const nk = normalizeImgKey(rawK);
                        if (isProtectedOriginalDefaultKey(nk) || activeKeys.has(nk)) continue;
                        store.delete(rawK);
                        importedImgCache.delete(nk);
                        dbKeyIndexSet.delete(nk);
                        purgedDbCnt++;
                    }
                } catch (e) {}

                openReusablePoolManagerModal(filterPart);
                showToast(`🧹 清理完成！已合并去除 ${removedDup} 张重复图，并从数据库清除 ${purgedDbCnt} 个无用幽灵缓存！`, "success", 3800);
            };
            modal.onclick = (e) => { if (e.target === modal) { modal.style.display = "none"; renderBody(); } };
            modal.querySelector("#st-pm-filter").onchange = (e) => openReusablePoolManagerModal(e.target.value);

            modal.querySelectorAll(".st-pm-zoom").forEach(async (im) => {
                im.onclick = () => openTrueFullscreenImage(im.src);
                const rawAttr = im.getAttribute("src") || "";
                if (rawAttr && !rawAttr.startsWith("data:") && !rawAttr.startsWith("http") && !rawAttr.startsWith("blob:") && !rawAttr.startsWith("/")) {
                    const dUrl = await fetchImageAsyncFromDB(rawAttr);
                    if (dUrl) im.src = dUrl;
                }
            });

            modal.querySelectorAll(".st-pm-edit").forEach(btn => {
                btn.onclick = () => {
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    const item = pool[idx];
                    if (!item) return;

                    const PART_GROUPS = getAllAssignablePartGroups();

                    let selKey = item.editKey || "小穴实况";
                    let selStg = Number(item.stageNum) || 1;
                    let selSpecies = item.speciesSig || getSpeciesSignatureFromDna(item.fullDna || item.dna || item.skinDna || "") || "human";

                    const curHeroineDna = getLockedAppearanceTags(detectProtagonistName(curVars), curVars);
                    const curHeroineSpSig = getSpeciesSignatureFromDna(curHeroineDna);

                    const SPECIES_OPTIONS = [
                        { id: "human", label: "👩 普通人类", tag: "" },
                        { id: "undead_ghost", label: "👻 鬼怪/女鬼", tag: "ghost girl, supernatural apparition, pale cold skin, eerie dark mist aura" },
                        { id: "lamia_snaketail", label: "🐍 美女蛇(蛇尾)", tag: "lamia, snake girl, long coiled snake tail instead of legs, glistening snake scales" },
                        { id: "succubus_demon", label: "😈 魅魔(角/尾)", tag: "succubus, demon horns, heart-shaped succubus tail" },
                        { id: "eldritch_horror", label: "👁️ 不可名状异形", tag: "eldritch abomination, monster girl, multiple glowing eyes, writhing flesh tendrils" },
                        { id: "tentacle_morph", label: "🐙 触手/母巢", tag: "tentacle monster girl, writhing tentacles, biological broodmother" },
                        { id: "slime_fluid", label: "🫧 史莱姆流体", tag: "slime girl, translucent gelatinous body, dripping slime skin" },
                        { id: "insect_arachne", label: "🕷️ 蜘蛛/虫族娘", tag: "arachne, insectoid lower body, glossy chitinous exoskeleton" },
                        { id: "cyber_doll", label: "🤖 机械/人偶", tag: "cyborg girl, mechanical joints, ball-jointed doll seams" },
                        { id: "catgirl", label: "🐱 猫/兽耳娘", tag: "cat ears, cat tail, kemonomimi_mode" },
                        { id: "foxgirl", label: "🦊 狐娘", tag: "fox ears, fluffy fox tail" },
                        { id: "elf", label: "🧝‍♀️ 精灵", tag: "pointy elf ears" },
                        { id: "mermaid_fishtail", label: "🧜‍♀️ 美人鱼", tag: "mermaid, fish tail instead of legs" }
                    ];

                    const applySpeciesToPoolItem = (targetItem, spId, customTraitText = "") => {
                        let baseDna = safeStr(targetItem.fullDna || targetItem.dna || "black hair, long hair, pale white skin");
                        SPECIES_OPTIONS.forEach(op => {
                            if (op.tag) {
                                op.tag.split(",").forEach(t => {
                                    const trimT = t.trim();
                                    if (trimT) baseDna = baseDna.replace(new RegExp(",?\\s*" + trimT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "");
                                });
                            }
                        });
                        baseDna = baseDna.replace(/^[\s,]+|[\s,]+$/g, "");
                        const spObj = SPECIES_OPTIONS.find(x => x.id === spId);
                        let mergedDna = spObj && spObj.tag ? `${baseDna}, ${spObj.tag}` : baseDna;
                        if (customTraitText) mergedDna += `, ${customTraitText}`;
                        targetItem.fullDna = mergedDna.slice(0, 220);
                        targetItem.speciesSig = getSpeciesSignatureFromDna(targetItem.fullDna);
                        targetItem.skinDna = getSkinOnlyDnaTags(targetItem.fullDna);
                    };

                    let ep = document.getElementById("st-pm-edit-submodal");
                    if (!ep) {
                        ep = document.createElement("div");
                        ep.id = "st-pm-edit-submodal";
                        ep.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:12px;";
                        document.body.appendChild(ep);
                    }

                    const renderEditSub = () => {
                        const curItemSummary = summarizeDnaTagsToChinese(item.fullDna || item.dna || "");
                        ep.innerHTML = `
                            <div style="background:linear-gradient(160deg,#27153b,#0d0618);border:2px solid #fde047;border-radius:14px;padding:12px;width:92vw;max-width:460px;max-height:86vh;overflow-y:auto;color:#fff;">
                                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:6px;margin-bottom:8px;">
                                    <b style="color:#fde047;font-size:13px;">✏️ 修改该图的阶位、主要特征与绑定部位：</b>
                                    <button id="st-pme-close" type="button" style="background:#ff003c;color:#fff;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;">✕</button>
                                </div>
                                <div style="margin-bottom:8px;background:rgba(0,0,0,0.4);padding:7px;border-radius:8px;border:1px solid rgba(103,232,249,0.4);">
                                    <div style="font-size:11.5px;color:#67e8f9;font-weight:bold;margin-bottom:5px;">⚡ 第一步：点选触发阶位（角色达到第几阶时调用此图）：</div>
                                    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:5px;">
                                        ${[1,2,3,4,5,6].map(n => `<button type="button" class="st-pme-stg" data-s="${n}" style="background:${selStg === n ? 'linear-gradient(135deg,#fde047,#f59e0b)' : 'rgba(255,255,255,0.1)'};color:${selStg === n ? '#111' : '#fff'};border:1px solid #fde047;border-radius:6px;padding:5px 0;font-size:11.5px;font-weight:bold;cursor:pointer;">第${n}阶</button>`).join("")}
                                    </div>
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0 4px 0;flex-wrap:wrap;gap:4px;">
                                        <span style="font-size:11.5px;color:#a6e3a1;font-weight:bold;">🧬 该图绑定的主要特征：<b style="color:#fde047;">${curItemSummary}</b></span>
                                        <button type="button" id="st-pme-sync-cur-heroine" style="background:linear-gradient(135deg,#f59e0b,#ec4899);color:#fff;border:none;border-radius:6px;padding:2px 7px;font-size:10px;font-weight:bold;cursor:pointer;">⚡ 一键同步为当前主角特征</button>
                                    </div>
                                    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;">
                                        ${SPECIES_OPTIONS.map(sp => {
                                            const isAct = (selSpecies === sp.id) || (sp.id !== "human" && selSpecies.includes(sp.id));
                                            return `<button type="button" class="st-pme-species" data-sp="${sp.id}" style="background:${isAct ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.08)'};color:#fff;border:1px solid ${isAct ? '#fde047' : 'rgba(255,255,255,0.2)'};border-radius:6px;padding:3px 6px;font-size:10px;font-weight:bold;cursor:pointer;">${isAct ? "✅ " : ""}${sp.label}</button>`;
                                        }).join("")}
                                    </div>
                                    <div style="display:flex;gap:5px;align-items:center;margin-top:4px;">
                                        <span style="font-size:10.5px;color:#67e8f9;white-space:nowrap;">🔮 自由特征/DNA:</span>
                                        <input id="st-pme-custom-dna" value="${safeStr(item.fullDna || item.dna).replace(/"/g, '&quot;')}" placeholder="可自由填写任意特征（如：千眼肉块 / 触手 / 蛇尾 / 黑发）" style="flex:1;background:#111;color:#fde047;border:1px solid #67e8f9;border-radius:5px;padding:3px 6px;font-size:10.5px;">
                                    </div>
                                    <div style="margin-top:5px;display:flex;gap:5px;align-items:center;">
                                        <span style="font-size:10.5px;color:#fbcfe8;white-space:nowrap;">👗 穿搭特征词:</span>
                                        <input id="st-pme-wearsig" value="${safeStr(item.wearSig).replace(/"/g, '&quot;')}" placeholder="如：黑丝 / 白丝 / 马丁靴（留空则不限款式）" style="flex:1;background:#111;color:#fff;border:1px solid #f472b6;border-radius:5px;padding:3px 6px;font-size:10.5px;">
                                    </div>
                                </div>
                                <div style="font-size:11.5px;color:#f472b6;font-weight:bold;margin-bottom:5px;">🌸 第二步：点选所属部位（点完即自动保存）：</div>
                                ${PART_GROUPS.map(g => `
                                    <div style="margin-bottom:7px;">
                                        <div style="font-size:10.5px;color:#cbd5e1;margin-bottom:3px;">${g.group}</div>
                                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;">
                                            ${g.list.map(([k, label]) => `<button type="button" class="st-pme-part" data-k="${k}" style="background:${selKey === k ? 'linear-gradient(135deg,#ec4899,#8b5cf6)' : 'rgba(255,255,255,0.08)'};color:#fff;border:1px solid ${selKey === k ? '#fde047' : 'rgba(244,114,182,0.35)'};border-radius:6px;padding:5px 3px;font-size:10.5px;font-weight:bold;cursor:pointer;">${label}</button>`).join("")}
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                        `;

                        const saveCustomInputs = () => {
                            const sigInp = ep.querySelector("#st-pme-wearsig");
                            const dnaInp = ep.querySelector("#st-pme-custom-dna");
                            if (sigInp) item.wearSig = sigInp.value.trim();
                            if (dnaInp && dnaInp.value.trim()) {
                                item.fullDna = dnaInp.value.trim();
                                item.dna = getHeadOnlyDnaTags(item.fullDna).slice(0, 80);
                                item.skinDna = getSkinOnlyDnaTags(item.fullDna).slice(0, 80);
                                item.speciesSig = getSpeciesSignatureFromDna(item.fullDna);
                                selSpecies = item.speciesSig;
                            }
                            saveSettings();
                        };

                        ep.querySelector("#st-pme-close").onclick = () => {
                            saveCustomInputs();
                            ep.style.display = "none";
                            openReusablePoolManagerModal(filterPart);
                        };
                        ep.querySelector("#st-pme-sync-cur-heroine").onclick = () => {
                            item.fullDna = curHeroineDna;
                            item.dna = getHeadOnlyDnaTags(curHeroineDna).slice(0, 80);
                            item.skinDna = getSkinOnlyDnaTags(curHeroineDna).slice(0, 80);
                            item.speciesSig = curHeroineSpSig;
                            selSpecies = curHeroineSpSig;
                            saveSettings();
                            latestStatus = getFallbackData();
                            renderEditSub();
                            openReusablePoolManagerModal(filterPart);
                            showToast(`⚡ 已将该图的全部外貌与种族特征同步为当前主角！`, "success", 2200);
                        };
                        ep.querySelectorAll(".st-pme-species").forEach(spBtn => {
                            spBtn.onclick = () => {
                                saveCustomInputs();
                                selSpecies = spBtn.getAttribute("data-sp");
                                applySpeciesToPoolItem(item, selSpecies);
                                saveSettings();
                                latestStatus = getFallbackData();
                                renderEditSub();
                                openReusablePoolManagerModal(filterPart);
                                showToast(`🧬 已将该图切换为【${spBtn.textContent.replace("✅ ", "")}】特征！`, "success", 2000);
                            };
                        });
                        ep.querySelectorAll(".st-pme-stg").forEach(sb => {
                            sb.onclick = () => {
                                saveCustomInputs();
                                selStg = parseInt(sb.getAttribute("data-s"), 10);
                                item.stageNum = selStg;
                                item.isPureClean = (selStg === 1);
                                if (selStg === 1 && item.wearSig) {
                                    item.wearSig = item.wearSig.replace(/撕裂|撕开|崩飞|湿烂|白浊|爱液|淫水|真空|未穿|赤裸|乳环|贞操带|触手|粘液|精液|漏尿|失禁|torn|cum|semen/gi, "").trim();
                                }
                                saveSettings();
                                renderEditSub();
                                openReusablePoolManagerModal(filterPart);
                            };
                        });
                        ep.querySelectorAll(".st-pme-part").forEach(pb => {
                            pb.onclick = () => {
                                saveCustomInputs();
                                selKey = pb.getAttribute("data-k");
                                item.editKey = selKey;
                                item.stageNum = selStg;
                                item.isPureClean = (selStg === 1);
                                if (selStg === 1 && item.wearSig) {
                                    item.wearSig = item.wearSig.replace(/撕裂|撕开|崩飞|湿烂|白浊|爱液|淫水|真空|未穿|赤裸|乳环|贞操带|触手|粘液|精液|漏尿|失禁|torn|cum|semen/gi, "").trim();
                                }
                                item.isUniversalOrgan = UNIVERSAL_LOCAL_PARTS.has(selKey);
                                saveSettings();
                                latestStatus = getFallbackData();
                                ep.style.display = "none";
                                openReusablePoolManagerModal(filterPart);
                                showToast(`✅ 已将该图设为【${selKey} · 第${selStg}阶】！`, "success", 2200);
                            };
                        });
                    };
                   
                    renderEditSub();
                    ep.style.display = "flex";
                };
            });

            modal.querySelectorAll(".st-pm-toggle-uni").forEach(btn => {
                btn.onclick = () => {
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    const item = pool[idx];
                    if (!item) return;
                    item.isUniversalOrgan = !item.isUniversalOrgan;
                    saveSettings();
                    openReusablePoolManagerModal(filterPart);
                    showToast(item.isUniversalOrgan ? "🌸 已设为【局部器官全角色通用】！" : "👩 已设为【仅外貌/款式匹配角色调用】！", "info");
                };
            });

            modal.querySelectorAll(".st-pm-del").forEach(btn => {
                btn.onclick = async () => {
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    const item = pool[idx];
                    if (!item) return;
                    const removed = pool.splice(idx, 1)[0];
                    if (removed?.dbKey) {
                        const normK = normalizeImgKey(removed.dbKey);
                        try {
                            const db = await openImageDB();
                            const tx = db.transaction(IDB_STORE, "readwrite");
                            const st = tx.objectStore(IDB_STORE);
                            st.delete(removed.dbKey);
                            if (normK) st.delete(normK);
                            importedImgCache.delete(removed.dbKey);
                            if (normK) importedImgCache.delete(normK);
                        } catch (e) {}
                    }
                    saveSettings();
                    latestStatus = getFallbackData();
                    openReusablePoolManagerModal(filterPart);
                    showToast("🗑️ 已从永久图池与本地数据库中彻底删除该图！", "info");
                };
            });

            const clrBtn = modal.querySelector("#st-pm-clear-all");
            if (clrBtn) {
                clrBtn.onclick = async () => {
                    if (!confirm(`确定要从永久复用图池中彻底删除当前显示的 ${shownList.length} 张图片吗？`)) return;
                    try {
                        const db = await openImageDB();
                        const tx = db.transaction(IDB_STORE, "readwrite");
                        const store = tx.objectStore(IDB_STORE);
                        shownList.forEach(x => {
                            if (x?.dbKey) {
                                const normK = normalizeImgKey(x.dbKey);
                                store.delete(x.dbKey);
                                if (normK) store.delete(normK);
                                importedImgCache.delete(x.dbKey);
                                if (normK) importedImgCache.delete(normK);
                            }
                        });
                    } catch (e) {}
                    if (filterPart === "ALL") userSettings.reusableImgPool = [];
                    else userSettings.reusableImgPool = pool.filter(x => x.editKey !== filterPart);
                    saveSettings();
                    latestStatus = getFallbackData();
                    openReusablePoolManagerModal("ALL");
                    showToast("🗑️ 已清空当前筛选的图池图片！", "info");
                };
            }
        }
        
        let editingPatchIdx = null;
        let expandedPatchIdxSet = new Set();

        function renderSettingsView(bodyEl) {
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"], u = detectProtagonistName(curVars);
            userSettings.lockedAppearanceTags = curVars.档案?.锁定外貌DNA || getLockedAppearanceTags(u, curVars);

            const themeOpts = Object.keys(THEMES).map(k => `<option value="${k}" ${userSettings.theme === k ? "selected" : ""}>${k}</option>`).join("");
            const modeOpts = Object.entries(RUIN_PERSONA_MODES).map(([k, v]) => `<option value="${k}" ${userSettings.personaMode === k ? "selected" : ""}>${v.label}</option>`).join("");
            const diffOpts = Object.entries(DIFFICULTY_PRESETS).map(([k, v]) => `<option value="${k}" ${userSettings.difficultyMode === k ? "selected" : ""}>${v.label}</option>`).join("");
            const autoGenModeVal = userSettings.autoGenEveryChange ? "every" : (userSettings.autoGenOnMajorChange ? "major" : "off");

            if (Array.isArray(userSettings.installedPatches)) {
                const beforeLen = userSettings.installedPatches.length;
                userSettings.installedPatches = userSettings.installedPatches.filter(p => !String(p?.code || "").includes("patch_manager_bar"));
                if (userSettings.installedPatches.length !== beforeLen) {
                    saveSettings();
                    executeStoredPatches();
                }
            }

            const patchList = userSettings.installedPatches || [];
            if (editingPatchIdx !== null && !patchList[editingPatchIdx]) editingPatchIdx = null;
            const editingPatchObj = editingPatchIdx !== null ? patchList[editingPatchIdx] : null;

            const extractPatchInfo = (p) => {
                const codeStr = String(p?.code || "");
                const tags = [];
                if (codeStr.includes("addTopWidget")) tags.push("🎛️ 专属交互面板");
                if (codeStr.includes("addDirectorButton")) {
                    const m = codeStr.match(/addDirectorButton\s*\(\s*['"`]([^'"`]+)['"`]/);
                    tags.push(m ? `🎮 导演台按钮「${m[1]}」` : "🎮 导演台按钮");
                }
                if (codeStr.includes("addPromptRule")) tags.push("🚨 AI正文强制铁律");
                const descMatch = codeStr.match(/\/\/\s*@desc:\s*([^\n\r]+)/i) || codeStr.match(/\/\/\s*==\s*([^=\n]+)\s*==/);
                const fullDesc = safeStr(p?.desc).trim() || (descMatch ? descMatch[1].trim() : "该补丁已接入状态栏底层 API，提供自定义扩展功能（点击右侧「✏️编辑」可随时补充或修改功能介绍）。");
                return { fullDesc, badge: tags.length ? tags.join(" + ") : "扩展脚本" };
            };

            const patchItemsHtml = patchList.length ? patchList.map((p, idx) => {
                const info = extractPatchInfo(p);
                const isEditingThis = (editingPatchIdx === idx);
                const isExpanded = expandedPatchIdxSet.has(idx);
                const myWidgets = customTopWidgets.filter(w => w.patchIdx === idx);
                const myWidgetsHtml = (!p.disabled && isExpanded && myWidgets.length)
                    ? myWidgets.map(w => { try { return w.renderFn(curVars, u) || ""; } catch (e) { return ""; } }).join("")
                    : "";

                return `
                <div style="background:${isEditingThis ? 'rgba(244,114,182,0.22)' : 'rgba(0,0,0,0.48)'};border:1.5px solid ${isEditingThis ? '#f472b6' : (p.disabled ? '#64748b' : '#fde047')};border-radius:9px;padding:7px 10px;margin-bottom:6px;">
                    <div class="st-patch-card-item" data-idx="${idx}" style="display:flex;justify-content:space-between;align-items:center;gap:8px;cursor:pointer;">
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:12px;color:${p.disabled ? '#94a3b8' : '#fde047'};font-weight:bold;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                                <span>🧩 ${p.name || ('扩展补丁 #' + (idx + 1))}</span>
                                <span style="font-size:10px;padding:1px 6px;border-radius:99px;background:rgba(103,232,249,0.18);color:#67e8f9;">${isExpanded ? "🔼 收起功能面板" : "🔽 点击展开功能与介绍"}</span>
                            </div>
                            <div style="font-size:10.5px;color:#cbd5e1;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">📝 ${info.fullDesc}</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;" onclick="event.stopPropagation();">
                            <label style="display:flex;align-items:center;gap:3px;font-size:11px;color:${p.disabled ? '#94a3b8' : '#86efac'};cursor:pointer;">
                                <input type="checkbox" class="st-patch-toggle-chk" data-idx="${idx}" ${p.disabled ? "" : "checked"}>
                                <span>${p.disabled ? "停用" : "启用"}</span>
                            </label>
                            <button type="button" class="st-patch-info-btn" data-idx="${idx}" style="background:rgba(244,114,182,0.25);color:#fbcfe8;border:1px solid #f472b6;border-radius:6px;padding:2px 6px;font-size:10.5px;cursor:pointer;">📖介绍</button>
                            <button type="button" class="st-patch-edit-btn" data-idx="${idx}" style="background:#8b5cf6;color:#fff;border:none;border-radius:6px;padding:2px 7px;font-size:11px;cursor:pointer;">✏️编辑</button>
                            <button type="button" class="st-patch-del-btn" data-idx="${idx}" style="background:#e11d48;color:#fff;border:none;border-radius:6px;padding:2px 7px;font-size:11px;cursor:pointer;">🗑️</button>
                        </div>
                    </div>
                    ${isExpanded ? `
                    <div style="margin-top:8px;padding-top:8px;border-top:1px dashed rgba(255,255,255,0.15);">
                        <div style="font-size:11px;color:#fde68a;background:rgba(251,191,36,0.08);padding:6px 8px;border-radius:6px;line-height:1.55;margin-bottom:6px;">
                            <b>📖 补丁功能详解</b>：${info.fullDesc}
                        </div>
                        ${p.disabled ? `<div style="font-size:11px;color:#94a3b8;text-align:center;padding:6px;">⚠️ 该补丁当前已停用，勾选右上角「启用」后即可在此处使用它的功能按钮。</div>` : (myWidgetsHtml || `<div style="font-size:11px;color:#a6e3a1;text-align:center;padding:4px;">✅ 该补丁的规则与导演台按钮已生效！</div>`)}
                    </div>` : ""}
                </div>`;
            }).join("") : `<div style="font-size:11.5px;color:#94a3b8;text-align:center;padding:8px;">当前暂未安装任何外挂扩展补丁</div>`;

            const dbSizeMB = calcImageDBSizeMB();

            bodyEl.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:8px;">
                        <div style="font-size:15px;font-weight:bold;color:#fde047;">⚙️ 状态栏 1.0 · 全局控制与设置中心</div>
                        <button id="st-cfg-back-btn" type="button" style="background:${tc.prim};color:#111;border:none;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:bold;cursor:pointer;">返回主面板 ✕</button>
                    </div>

                    <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(244,114,182,0.3);border-radius:11px;padding:10px;">
                        <div style="font-weight:bold;color:#f9e2af;margin-bottom:8px;font-size:12.5px;">🎨 一、界面美学与监控目标</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                            <div><div style="font-size:11px;color:#cbd5e1;margin-bottom:3px;">主题皮肤：</div><select id="st-cfg-theme" style="width:100%;background:#111;color:#fff;border:1px solid #f472b6;border-radius:6px;padding:5px;">${themeOpts}</select></div>
                            <div><div style="font-size:11px;color:#cbd5e1;margin-bottom:3px;">人格崩坏模式：</div><select id="st-cfg-pmode" style="width:100%;background:#111;color:#fff;border:1px solid #c084fc;border-radius:6px;padding:5px;">${modeOpts}</select></div>
                            <div><div style="font-size:11px;color:#cbd5e1;margin-bottom:3px;">调教难度倍率：</div><select id="st-cfg-diff" style="width:100%;background:#111;color:#fff;border:1px solid #fde047;border-radius:6px;padding:5px;">${diffOpts}</select></div>
                            <div><div style="font-size:11px;color:#cbd5e1;margin-bottom:3px;">字体缩放 (${userSettings.fontScale}%)：</div><input id="st-cfg-font" type="range" min="85" max="130" value="${userSettings.fontScale}" style="width:100%;"></div>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;">
                            <button type="button" id="st-cfg-switch-target" class="st-pill-btn" style="color:#fde047;">🎯 切换监控目标 (当前: ${u})</button>
                            <button type="button" id="st-cfg-toggle-xray" class="st-pill-btn">🔬 档案页X-Ray内窥: ${userSettings.showXrayOnHome ? "开启" : "关闭"}</button>
                            <button type="button" id="st-cfg-toggle-compact" class="st-pill-btn">📇 极简卡片模式: ${userSettings.compactCards ? "开启" : "关闭"}</button>
                            <button type="button" id="st-cfg-toggle-sound" class="st-pill-btn">🔊 交互水音: ${userSettings.soundEnabled ? "开启" : "关闭"}</button>
                            <button type="button" id="st-cfg-toggle-dock" class="st-pill-btn">🧲 悬浮球靠边缩藏: ${userSettings.autoDockEdge ? "开启" : "关闭"}</button>
                            <button type="button" id="st-cfg-toggle-dirchat" class="st-pill-btn" style="color:#a6e3a1;">💬 导演台指令同步写入输入框: ${userSettings.directorSendToChat ? "开启" : "关闭"}</button>
                        </div>
                    </div>

                    <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(103,232,249,0.3);border-radius:11px;padding:10px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:4px;">
                            <span style="font-weight:bold;color:#67e8f9;font-size:12.5px;">🖼️ 二、AI 外貌锁定与自动生图设置</span>
                            <span style="font-size:10.5px;color:#a6e3a1;">📊 本地图库缓存: ${importedImgCache.size}张 (约 ${dbSizeMB} MB)</span>
                        </div>
                        <div style="font-size:11px;color:#fbcfe8;background:rgba(244,114,182,0.12);border:1px dashed rgba(244,114,182,0.4);border-radius:6px;padding:5px 8px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
                            <span>🎯 <b>当前识别到的【${u}】形象</b>：<span id="st-cfg-dna-summary-txt" style="color:#fde047;">${summarizeDnaTagsToChinese(userSettings.lockedAppearanceTags || extractTargetCurrentAppearance(u, curVars).tags)}</span></span>
                            <span style="font-size:10px;color:${curVars.档案?.手动锁死外貌Flag ? '#fda4af' : '#a6e3a1'};">${curVars.档案?.手动锁死外貌Flag ? "🔒 已手动固定Tag (点下方【🎯提取当前形象】可恢复自动跟随剧情)" : "🔄 随最新剧情自动提取中"}</span>
                        </div>
                        <div style="display:flex;gap:5px;margin-bottom:8px;flex-wrap:wrap;">
                            <input id="st-cfg-dna-inp" value="${safeStr(userSettings.lockedAppearanceTags).replace(/"/g, "&quot;")}" placeholder="可输入自定义中文（如：黑发金瞳美女蛇 / 银发魅魔）或英文Tag" style="flex:1;min-width:160px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:11.5px;">
                            <button type="button" id="st-cfg-dna-auto-btn" title="解除手动锁定，立即从最新正文自动提取监控目标当前的种族、发色与形象" style="background:linear-gradient(135deg,#10b981,#06b6d4);color:#fff;border:none;border-radius:6px;padding:5px 10px;font-size:11.5px;font-weight:bold;cursor:pointer;white-space:nowrap;">🎯 提取当前形象</button>
                            <button type="button" id="st-cfg-dna-btn" title="按左侧输入框里填写的自定义中文或Tag锁死外貌" style="background:linear-gradient(135deg,#ec4899,#8b5cf6);color:#fff;border:none;border-radius:6px;padding:5px 9px;font-size:11px;font-weight:bold;cursor:pointer;white-space:nowrap;">🔒 锁定自定义</button>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;padding:6px 8px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.4);border-radius:8px;">
                            <div style="font-size:11.5px;color:#6ee7b7;font-weight:bold;">🎨 智绘姬生图后端格式：
                                <select id="st-cfg-zhj-backend" style="background:#111;color:#fde047;border:1px solid #10b981;border-radius:6px;padding:3px 6px;font-weight:bold;">
                                    <option value="comfy_tag" ${(userSettings.zhjBackendMode || "comfy_tag") === "comfy_tag" ? "selected" : ""}>🔥 ComfyUI 专属精调 (<image>包裹+外貌强锁+局部特写优化)</option>
                                    <option value="comfy_scene_uc" ${userSettings.zhjBackendMode === "comfy_scene_uc" ? "selected" : ""}>🛡️ ComfyUI 带负面词模式 (Scene+UC严防局部画全身)</option>
                                    <option value="comfy_hash_only" ${userSettings.zhjBackendMode === "comfy_hash_only" ? "selected" : ""}>⚡ ComfyUI 纯 image### 格式 (无<image>外壳)</option>
                                    <option value="nai_original" ${userSettings.zhjBackendMode === "nai_original" ? "selected" : ""}>🌸 NovelAI 原版格式 (100%原版 :: 权重与多角色分区)</option>
                                </select>
                            </div>
                            <button type="button" id="st-cfg-record-zhj-btn" class="st-pill-btn" style="background:linear-gradient(135deg,#f59e0b,#e11d48);color:#fff;border:none;">
                                🎯 录制生图按钮 ${userSettings.zhjCustomSelector ? `(已记:${userSettings.zhjCustomSelector})` : ""}
                            </button>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                            <div style="font-size:11.5px;color:#e2e8f0;">⚡ 自动生图触发模式：
                                <select id="st-cfg-autogen-mode" style="background:#111;color:#fde047;border:1px solid #fde047;border-radius:6px;padding:3px 6px;">
                                    <option value="off" ${autoGenModeVal === "off" ? "selected" : ""}>关闭自动生图</option>
                                    <option value="major" ${autoGenModeVal === "major" ? "selected" : ""}>仅跨阶位突破时生图</option>
                                    <option value="every" ${autoGenModeVal === "every" ? "selected" : ""}>🔥 随正文数值变化即生图</option>
                                </select>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button type="button" id="st-cfg-zip-up" class="st-pill-btn" style="color:#a6e3a1;">📦 导入图包/ZIP</button>
                                <input id="st-cfg-zip-file" type="file" multiple accept="image/*,.zip" style="display:none;">
                                <button type="button" id="st-cfg-clear-protag-img" class="st-pill-btn" style="color:#fca5a5;">🧹 清空本角配图</button>
                            </div>
                        </div>
                    </div>

                    <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(251,191,36,0.35);border-radius:11px;padding:10px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px;">
                            <span style="font-weight:bold;color:#fde047;font-size:12.5px;">🧩 三、热插拔扩展补丁中心 (已装 ${patchList.length} 个 · 点击补丁展开专属面板)</span>
                            ${patchList.length ? `<button type="button" id="st-cfg-clear-patches" style="background:rgba(225,29,72,0.25);color:#fda4af;border:1px solid #e11d48;border-radius:6px;padding:2px 8px;font-size:10.5px;cursor:pointer;">一键清空全部补丁</button>` : ""}
                        </div>
                        <div id="st-cfg-patch-list" style="margin-bottom:8px;">${patchItemsHtml}</div>
                        <div id="st-patch-editor-form" style="border-top:1px dashed rgba(255,255,255,0.18);padding-top:8px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
                                <span style="font-size:11.5px;color:${editingPatchObj ? '#f472b6' : '#fde68a'};font-weight:bold;">
                                    ${editingPatchObj ? `✏️ 正在修改补丁 #${editingPatchIdx + 1}：【${editingPatchObj.name}】` : `➕ 安装新扩展补丁包（安装后也可随时点 ✏️ 修改）：`}
                                </span>
                                ${editingPatchObj ? `<button type="button" id="st-cfg-cancel-edit-patch" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:5px;padding:2px 8px;font-size:10.5px;cursor:pointer;">取消修改 ✕</button>` : ""}
                            </div>
                            <input id="st-cfg-patch-name" value="${editingPatchObj ? safeStr(editingPatchObj.name).replace(/"/g, '&quot;') : ''}" placeholder="① 补丁名称（如：💞 多女主共轭调教切换台）" style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.18);border-radius:6px;padding:5px 8px;color:#fff;font-size:11.5px;margin-bottom:5px;">
                            <textarea id="st-cfg-patch-desc" rows="2" placeholder="② 补丁功能具体介绍（把补丁的功能效果粘贴到这里，点击补丁即可展开查看说明与操作面板！）" style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.5);border:1px solid rgba(244,114,182,0.35);border-radius:6px;padding:5px 8px;color:#fbcfe8;font-size:11.5px;margin-bottom:5px;">${editingPatchObj ? safeStr(editingPatchObj.desc) : ''}</textarea>
                            <textarea id="st-cfg-patch-code" rows="3" placeholder="③ 在此粘贴或修改补丁的 JS 代码..." style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.18);border-radius:6px;padding:6px 8px;color:#a6e3a1;font-family:Consolas,monospace;font-size:11px;margin-bottom:6px;">${editingPatchObj ? safeStr(editingPatchObj.code) : ''}</textarea>
                            <button type="button" id="st-cfg-install-patch" style="width:100%;background:${editingPatchObj ? 'linear-gradient(135deg,#ec4899,#8b5cf6)' : 'linear-gradient(135deg,#fde047,#f59e0b)'};color:${editingPatchObj ? '#fff' : '#111'};border:none;border-radius:7px;padding:6px;font-size:12px;font-weight:bold;cursor:pointer;">
                                ${editingPatchObj ? '💾 保存对此补丁的修改' : '⚡ 立即安装并激活补丁'}
                            </button>
                        </div>
                    </div>

                    <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(192,132,252,0.3);border-radius:11px;padding:10px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px;">
                            <span style="font-weight:bold;color:#d8b4fe;font-size:12.5px;">🤖 四、独立副 API 重绘配置（可选）</span>
                            <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:#fde047;cursor:pointer;">
                                <input id="st-api-auto-chk" type="checkbox" ${userSettings.autoCallApiOnNewMsg ? "checked" : ""}>
                                <span>每回合新消息自动调用副API重绘</span>
                            </label>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
                            <input id="st-api-url" value="${safeStr(userSettings.apiUrl)}" placeholder="API 反代地址 (如 https://.../v1)" style="background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:11.5px;">
                            <input id="st-api-key" type="password" value="${safeStr(userSettings.apiKey)}" placeholder="API Key (sk-...)" style="background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:11.5px;">
                        </div>
                        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                            <input id="st-api-mod" value="${safeStr(userSettings.apiModel)}" placeholder="模型名称 (如 gpt-4o-mini)" style="flex:1;min-width:120px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:11.5px;">
                            <button type="button" id="st-api-fetch-models" class="st-pill-btn">🔄 拉取模型</button>
                            <button type="button" id="st-api-save-btn" class="st-pill-btn" style="background:${tc.prim};color:#111;">💾 保存API</button>
                            <button type="button" id="st-api-redraw-now-btn" class="st-pill-btn" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff;border:none;">🤖 立即API重绘本层</button>
                        </div>
                        <select id="st-api-model-sel" style="display:none;width:100%;margin-top:6px;background:#111;color:#fff;border:1px solid #c084fc;border-radius:6px;padding:4px;"></select>
                    </div>

                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;padding-top:4px;">
                        <button type="button" id="st-cfg-export-json" class="st-pill-btn">📤 导出状态存档</button>
                        <button type="button" id="st-cfg-import-json" class="st-pill-btn">📥 导入状态存档</button>
                        <button type="button" id="st-cfg-reset-vars" class="st-pill-btn" style="color:#fda4af;border-color:#e11d48;">🔥 重置当前角色为清白初始态</button>
                        <button type="button" id="st-cfg-exit-plugin" class="st-pill-btn" style="background:#e11d48;color:#fff;border-color:#ff4d6d;">🔌 彻底关闭/退出状态栏</button>
                    </div>
                </div>
            `;

            bodyEl.querySelector("#st-cfg-back-btn").onclick = () => { editingPatchIdx = null; isSettingsOpen = false; renderBody(); };
            
            bodyEl.querySelector("#st-cfg-theme").onchange = (e) => { userSettings.theme = e.target.value; saveSettings(); applyThemeAndSize(); renderBody(); };
            bodyEl.querySelector("#st-cfg-pmode").onchange = (e) => { userSettings.personaMode = e.target.value; saveSettings(); renderBody(); };
            bodyEl.querySelector("#st-cfg-diff").onchange = (e) => { userSettings.difficultyMode = e.target.value; saveSettings(); latestStatus = getFallbackData(); renderBody(); };
            bodyEl.querySelector("#st-cfg-font").oninput = (e) => { userSettings.fontScale = parseInt(e.target.value, 10); saveSettings(); applyThemeAndSize(); };
            bodyEl.querySelector("#st-cfg-switch-target").onclick = () => promptSwitchTargetCharacter();
            bodyEl.querySelector("#st-cfg-toggle-xray").onclick = () => { userSettings.showXrayOnHome = !userSettings.showXrayOnHome; saveSettings(); renderBody(); };
            bodyEl.querySelector("#st-cfg-toggle-compact").onclick = () => { userSettings.compactCards = !userSettings.compactCards; saveSettings(); renderBody(); };
            bodyEl.querySelector("#st-cfg-toggle-sound").onclick = () => { userSettings.soundEnabled = !userSettings.soundEnabled; saveSettings(); renderBody(); };
            bodyEl.querySelector("#st-cfg-toggle-dock").onclick = () => { userSettings.autoDockEdge = !userSettings.autoDockEdge; saveSettings(); applyEdgeDockStyle(document.getElementById("st-v5-toggle")); renderBody(); };
            bodyEl.querySelector("#st-cfg-toggle-dirchat").onclick = () => { userSettings.directorSendToChat = !userSettings.directorSendToChat; saveSettings(); renderBody(); };

            const autoDnaBtn = bodyEl.querySelector("#st-cfg-dna-auto-btn");
            if (autoDnaBtn) {
                autoDnaBtn.onclick = async () => {
                    const tags = await aiLockAppearanceByChinese("", true);
                    const inp = bodyEl.querySelector("#st-cfg-dna-inp");
                    if (inp) inp.value = tags;
                };
            }
            bodyEl.querySelector("#st-cfg-dna-btn").onclick = async () => {
                const val = bodyEl.querySelector("#st-cfg-dna-inp").value.trim();
                const tags = await aiLockAppearanceByChinese(val, false);
                bodyEl.querySelector("#st-cfg-dna-inp").value = tags;
            };
            const zhjBackendSel = bodyEl.querySelector("#st-cfg-zhj-backend");
            if (zhjBackendSel) {
                zhjBackendSel.onchange = (e) => {
                    userSettings.zhjBackendMode = e.target.value;
                    saveSettings();
                    showToast("✅ 已切换智绘姬生图后端格式！", "success");
                };
            }
            const recZhjBtn = bodyEl.querySelector("#st-cfg-record-zhj-btn");
            if (recZhjBtn) {
                recZhjBtn.onclick = (e) => window.__stRecordZhjButton && window.__stRecordZhjButton(e.target);
            }
            bodyEl.querySelector("#st-cfg-autogen-mode").onchange = (e) => {
                const m = e.target.value;
                userSettings.autoGenEveryChange = (m === "every");
                userSettings.autoGenOnMajorChange = (m === "major" || m === "every");
                saveSettings();
                showToast("✅ 已更新自动生图触发模式！", "success");
            };
            const zipBtn = bodyEl.querySelector("#st-cfg-zip-up"), zipInp = bodyEl.querySelector("#st-cfg-zip-file");
            zipBtn.onclick = () => zipInp.click();
            zipInp.onchange = async (e) => {
                const n = await importFilesOrZipToDB(e.target.files);
                showToast(`✅ 成功导入 ${n} 张图片并自动识别归入永久图池！`, "success");
                latestStatus = getFallbackData(); renderBody();
            };
            bodyEl.querySelector("#st-cfg-clear-protag-img").onclick = () => clearCurrentProtagImages();

            (function mountPoolManagerInSettings() {
                const clearBtn = bodyEl.querySelector("#st-cfg-clear-protag-img");
                const parentCard = clearBtn ? clearBtn.closest("div[style*='border-radius:11px']") : null;
                if (!parentCard) return;

                userSettings.reusableImgPool = Array.isArray(userSettings.reusableImgPool) ? userSettings.reusableImgPool : [];
                const pool = userSettings.reusableImgPool;
                const isRandOn = (userSettings.poolRandomEnabled !== false);

                const mgrDiv = document.createElement("div");
                mgrDiv.style.cssText = "margin-top:10px;padding-top:10px;border-top:1px dashed rgba(103,232,249,0.4);display:flex;flex-direction:column;gap:8px;";
                mgrDiv.innerHTML = `
                    <div style="background:rgba(0,0,0,0.45);border-left:3px solid #67e8f9;padding:7px 10px;border-radius:6px;font-size:11px;line-height:1.6;color:#e2e8f0;">
                        <div><b style="color:#fde047;">📁 默认初始图包物理路径</b>：<code style="color:#67e8f9;">${PLUGIN_BASE_PATH}/images/</code> （如 <code style="color:#a6e3a1;">小穴实况_1.webp ~ _6.webp</code>）</div>
                        <div><b style="color:#fde047;">💾 永久动态生图池数据库</b>：浏览器本地 <code style="color:#f472b6;">IndexedDB (${IDB_NAME})</code>，已存 <b style="color:#a6e3a1;">${pool.length}</b> 张跨档复用生图（重装插件或新建聊天均永久保留！）</div>
                        <div style="color:#fbcfe8;font-size:10.5px;">💡 <b>四大层级智能复用</b>：①六孔/受孕/局部肉改在达标对应阶位时全角色通用；②无头局部穿搭在18组款式无冲突且达标阶位时通用；③露脸/全身图在外貌DNA一致且达标阶位时自动调用！</div>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                        <label style="display:flex;align-items:center;gap:5px;font-size:11.5px;color:#fde047;font-weight:bold;cursor:pointer;">
                            <input type="checkbox" id="st-cfg-pool-rand-chk" ${isRandOn ? "checked" : ""}>
                            <span>🎲 启用「等阶达标后：永久图池生图 + 初始底图」随机多样性混播</span>
                        </label>
                        <div style="display:flex;gap:5px;">
                            <button type="button" id="st-cfg-sync-all-to-pool" class="st-pill-btn" style="color:#67e8f9;border-color:#67e8f9;">📥 将现有相册/缓存图全部收入永久图池</button>
                            <button type="button" id="st-cfg-open-pool-mgr" class="st-pill-btn" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff;border:none;">🗂️ 打开图池修改/删除管理器 (${pool.length}张)</button>
                        </div>
                    </div>
                `;
                parentCard.appendChild(mgrDiv);

                mgrDiv.querySelector("#st-cfg-pool-rand-chk").onchange = (e) => {
                    userSettings.poolRandomEnabled = e.target.checked;
                    saveSettings();
                    latestStatus = getFallbackData();
                    showToast(userSettings.poolRandomEnabled ? "🎲 已开启同阶位【生图+初始图】随机多样性调用！" : "🔒 已关闭随机混播，固定优先显示最新生图", "info");
                };

                mgrDiv.querySelector("#st-cfg-sync-all-to-pool").onclick = async () => {
                    let addCnt = 0;
                    const uName = detectProtagonistName(curVars) || "角色";
                    const curChatPrefix = normalizeImgKey(`${getChatStoreKey().replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_").slice(-32)}_${uName}_`);
                    if (!latestStatus) latestStatus = getFallbackData();

                    const curStageMap = {};
                    (latestStatus.categories || []).forEach(cat => {
                        (cat.items || []).forEach(it => {
                            if (!it.editKey) return;
                            curStageMap[it.editKey] = getItemRealStageNum(it, curVars);
                        });
                    });

                    const allGal = [...(curVars.专属相册 || []), ...(userSettings.favoriteGallery || [])];
                    for (const g of allGal) {
                        if (!g || !g.editKey) continue;
                        let realSrc = queryImportedImage(g.dbKey) || queryImportedImage(g.src) || "";
                        if (!realSrc && (g.dbKey || g.src)) {
                            realSrc = await fetchImageAsyncFromDB(g.dbKey || g.src);
                        }
                        if (!realSrc) realSrc = g.src || "";
                        if (realSrc && (realSrc.startsWith("data:") || realSrc.startsWith("/"))) {
                            const stg = (Number(g.stageIdx) > 1) ? Number(g.stageIdx) : (safeNum(g.corr) >= 20 ? (tier6(safeNum(g.corr), false) + 1) : (curStageMap[g.editKey] || 3));
                            const beforeLen = userSettings.reusableImgPool.length;
                            await registerImageToReusablePool(g.editKey, stg, realSrc, g.charName || uName, { corr: g.corr, forceDirty: stg > 1 });
                            if (userSettings.reusableImgPool.length > beforeLen) addCnt++;
                        }
                    }
                    for (const [dbKey, dUrl] of importedImgCache.entries()) {
                        if (!dUrl || isProtectedOriginalDefaultKey(dbKey) || dbKey.startsWith("pool_")) continue;
                        for (const pk of HAS_ORIGINAL_DEFAULT_IMG) {
                            const pkLow = pk.toLowerCase();
                            if (dbKey.includes(`_${pkLow}_`) || (dbKey.endsWith(`_${pkLow}`) && dbKey !== pkLow)) {
                                const m = dbKey.match(/_([1-6])$/);
                                const isFromCurChat = dbKey.startsWith(curChatPrefix);
                                let stg = m ? parseInt(m[1], 10) : (isFromCurChat ? (curStageMap[pk] || 3) : 4);
                                if (!isFromCurChat && stg === 1) stg = 3;
                                const beforeLen = userSettings.reusableImgPool.length;
                                await registerImageToReusablePool(pk, stg, dUrl, uName, { forceDirty: stg > 1 });
                                if (userSettings.reusableImgPool.length > beforeLen) addCnt++;
                                break;
                            }
                        }
                    }
                    saveSettings();
                    renderSettingsView(bodyEl);
                    showToast(`📥 成功将 ${addCnt} 张生图按安全阶位录入【永久动态复用图池】！`, "success", 3000);
                };

                mgrDiv.querySelector("#st-cfg-open-pool-mgr").onclick = () => openReusablePoolManagerModal();

                const diskBtn = document.createElement("button");
                diskBtn.type = "button";
                diskBtn.className = "st-pill-btn";
                diskBtn.style.cssText = "background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;margin-top:4px;";
                diskBtn.textContent = "💾 一键将图池图片写入酒馆本地物理文件夹 (释放浏览器内存)";
                diskBtn.onclick = async () => {
                    const poolList = userSettings.reusableImgPool || [];
                    if (!poolList.length) {
                        showToast("⚠️ 当前图池为空，请先点「📥 将现有相册/缓存图全部收入永久图池」！", "warn");
                        return;
                    }
                    diskBtn.disabled = true;
                    let savedDiskCnt = 0;
                    for (let i = 0; i < poolList.length; i++) {
                        const p = poolList[i];
                        if (!p || (p.diskPath && p.diskPath.startsWith("/"))) continue;
                        let rawSrc = queryImportedImage(p.dbKey) || "";
                        if (!rawSrc && p.dbKey) rawSrc = await fetchImageAsyncFromDB(p.dbKey);
                        if (!rawSrc) rawSrc = p.dbKey || "";
                        if (rawSrc && rawSrc.startsWith("data:")) {
                            diskBtn.textContent = `⏳ 正在写入本地文件夹 (${i + 1}/${poolList.length})...`;
                            const fName = `pool_${p.editKey}_${p.stageNum || 1}_${Date.now()}_${i}`;
                            const diskUrl = await saveDataUrlToLocalDiskFolder(rawSrc, fName);
                            if (diskUrl) {
                                const oldNormKey = normalizeImgKey(p.dbKey);
                                try {
                                    const db = await openImageDB();
                                    const tx = db.transaction(IDB_STORE, "readwrite");
                                    if (oldNormKey) {
                                        tx.objectStore(IDB_STORE).put(diskUrl, oldNormKey);
                                        importedImgCache.set(oldNormKey, diskUrl);
                                    }
                                } catch (e) {}
                                p.diskPath = diskUrl;
                                p.dbKey = diskUrl;
                                savedDiskCnt++;
                            }
                        }
                    }
                    saveSettings();
                    diskBtn.disabled = false;
                    renderSettingsView(bodyEl);
                    if (savedDiskCnt > 0) {
                        showToast(`🎉 成功将 ${savedDiskCnt} 张图片直接写入酒馆本地文件夹：/user/images/status_bar_pool/ ！浏览器内存已大幅释放！`, "success", 4200);
                    } else {
                        showToast("ℹ️ 所有图池图片均已在本地文件夹中，或当前环境不支持写盘API。", "info", 3000);
                    }
                };
                mgrDiv.appendChild(diskBtn);
            })();

            bodyEl.querySelectorAll(".st-patch-card-item").forEach(cardEl => {
                cardEl.onclick = () => {
                    const idx = parseInt(cardEl.getAttribute("data-idx"), 10);
                    if (expandedPatchIdxSet.has(idx)) expandedPatchIdxSet.delete(idx);
                    else expandedPatchIdxSet.add(idx);
                    renderBody();
                };
            });

            bodyEl.querySelectorAll(".st-patch-info-btn").forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    const p = userSettings.installedPatches?.[idx];
                    if (!p) return;
                    const info = extractPatchInfo(p);
                    showTagDetailPopover(
                        `🧩 ${p.name || ('扩展补丁 #' + (idx + 1))}`,
                        p.disabled ? "⏸️ 已停用" : "🟢 运行中",
                        `挂载模块：${info.badge}`,
                        info.fullDesc,
                        "直接点击该补丁卡片即可在它下方展开它的专属功能控制按钮！"
                    );
                };
            });

            bodyEl.querySelectorAll(".st-patch-edit-btn").forEach(btn => {
                btn.onclick = () => {
                    editingPatchIdx = parseInt(btn.getAttribute("data-idx"), 10);
                    renderBody();
                    const formEl = document.getElementById("st-patch-editor-form");
                    if (formEl) formEl.scrollIntoView({ behavior: "smooth", block: "center" });
                    showToast("✏️ 已载入补丁信息，可在下方修改名称、介绍或代码！", "info", 2400);
                };
            });

            const cancelEditBtn = bodyEl.querySelector("#st-cfg-cancel-edit-patch");
            if (cancelEditBtn) cancelEditBtn.onclick = () => { editingPatchIdx = null; renderBody(); };

            bodyEl.querySelectorAll(".st-patch-toggle-chk").forEach(chk => {
                chk.onchange = () => {
                    const idx = parseInt(chk.getAttribute("data-idx"), 10);
                    if (userSettings.installedPatches?.[idx]) {
                        userSettings.installedPatches[idx].disabled = !chk.checked;
                        saveSettings(); executeStoredPatches(); renderBody();
                    }
                };
            });
            bodyEl.querySelectorAll(".st-patch-del-btn").forEach(btn => {
                btn.onclick = () => {
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    if (editingPatchIdx === idx) editingPatchIdx = null;
                    expandedPatchIdxSet.delete(idx);
                    userSettings.installedPatches.splice(idx, 1);
                    saveSettings(); executeStoredPatches(); renderBody();
                    showToast("🗑️ 已卸载该扩展补丁", "info");
                };
            });
            const clrPatchesBtn = bodyEl.querySelector("#st-cfg-clear-patches");
            if (clrPatchesBtn) {
                clrPatchesBtn.onclick = () => {
                    if (!confirm("确定要清空全部已安装的扩展补丁吗？")) return;
                    editingPatchIdx = null;
                    expandedPatchIdxSet.clear();
                    userSettings.installedPatches = [];
                    saveSettings(); executeStoredPatches(); renderBody();
                };
            }
            bodyEl.querySelector("#st-cfg-install-patch").onclick = () => {
                const code = bodyEl.querySelector("#st-cfg-patch-code").value.trim();
                if (!code) { showToast("⚠️ 请先粘贴补丁 JS 代码！", "warn"); return; }
                const name = bodyEl.querySelector("#st-cfg-patch-name").value.trim() || (`扩展补丁 #${(userSettings.installedPatches?.length || 0) + 1}`);
                const desc = bodyEl.querySelector("#st-cfg-patch-desc").value.trim();
                userSettings.installedPatches = userSettings.installedPatches || [];

                if (editingPatchIdx !== null && userSettings.installedPatches[editingPatchIdx]) {
                    userSettings.installedPatches[editingPatchIdx].name = name;
                    userSettings.installedPatches[editingPatchIdx].desc = desc;
                    userSettings.installedPatches[editingPatchIdx].code = code;
                    expandedPatchIdxSet.add(editingPatchIdx);
                    editingPatchIdx = null;
                    saveSettings(); executeStoredPatches(); renderBody();
                    showToast(`💾 补丁【${name}】修改已保存并展开！`, "success");
                } else {
                    const newIdx = userSettings.installedPatches.length;
                    userSettings.installedPatches.push({ name, desc, code, disabled: false, ts: Date.now() });
                    expandedPatchIdxSet.add(newIdx);
                    saveSettings(); executeStoredPatches(); renderBody();
                    showToast(`✅ 补丁【${name}】安装成功并已在下方展开功能面板！`, "success");
                }
            };

            const urlInp = bodyEl.querySelector("#st-api-url"), keyInp = bodyEl.querySelector("#st-api-key"), modInp = bodyEl.querySelector("#st-api-mod"), modSel = bodyEl.querySelector("#st-api-model-sel"), autoApiChk = bodyEl.querySelector("#st-api-auto-chk");
            if (autoApiChk) autoApiChk.onchange = () => { userSettings.autoCallApiOnNewMsg = autoApiChk.checked; saveSettings(); };
            bodyEl.querySelector("#st-api-fetch-models").onclick = (e) => fetchModelList(e.target, modSel, urlInp);
            modSel.onchange = () => { modInp.value = modSel.value; };
            bodyEl.querySelector("#st-api-save-btn").onclick = () => {
                userSettings.apiUrl = urlInp.value.trim();
                userSettings.apiKey = keyInp.value.trim();
                userSettings.apiModel = modInp.value.trim();
                if (autoApiChk) userSettings.autoCallApiOnNewMsg = autoApiChk.checked;
                saveSettings();
                showToast("💾 已保存副 API 配置！", "success");
            };
            bodyEl.querySelector("#st-api-redraw-now-btn").onclick = (e) => {
                userSettings.apiUrl = urlInp.value.trim();
                userSettings.apiKey = keyInp.value.trim();
                userSettings.apiModel = modInp.value.trim();
                saveSettings();
                triggerSubApiUpdate(e.target);
            };

            bodyEl.querySelector("#st-cfg-export-json").onclick = () => {
                const blob = new Blob([JSON.stringify(curVars, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `status_1.0_${u}_${Date.now()}.json`;
                a.click();
            };
            bodyEl.querySelector("#st-cfg-import-json").onclick = () => {
                let fileInp = document.getElementById("st-cfg-import-json-file");
                if (!fileInp) {
                    fileInp = document.createElement("input");
                    fileInp.id = "st-cfg-import-json-file";
                    fileInp.type = "file";
                    fileInp.accept = ".json,application/json";
                    fileInp.style.display = "none";
                    document.body.appendChild(fileInp);
                }
                fileInp.onchange = async (ev) => {
                    const f = ev.target.files?.[0];
                    if (!f) return;
                    try {
                        const raw = await f.text();
                        const parsed = repairAndParseJson(raw);
                        if (!parsed) throw new Error("JSON 格式无效");
                        pushUndoSnapshot(curVars);
                        curVars = normalizeVarsStructure({ ...getInitialVars(), ...parsed });
                        _organDevCache = { sig: "", res: null };
                        _appearMemoCache = { sig: "", res: null };
                        saveChatCache(curVars);
                        latestStatus = getFallbackData();
                        isSettingsOpen = false;
                        renderBody();
                        showToast("✅ 状态存档文件导入成功！", "success");
                    } catch (err) {
                        showToast("❌ 状态存档导入失败：" + err.message, "error");
                    }
                    fileInp.value = "";
                };
                fileInp.click();
            };
            bodyEl.querySelector("#st-cfg-reset-vars").onclick = async () => {
                if (!confirm(`确定要将【${u}】的所有状态数值与本局动态配图重置为 100% 清白初始状态吗？（注：永久复用图池与收藏夹不受影响）`)) return;
                viewingHistoryFloor = null;
                pushUndoSnapshot(curVars);
                const prefix = normalizeImgKey(`${getChatStoreKey().replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_").slice(-32)}_${u}_`);
                try {
                    const db = await openImageDB();
                    const tx = db.transaction(IDB_STORE, "readwrite"), store = tx.objectStore(IDB_STORE);
                    const allKnownKeys = new Set([...importedImgCache.keys(), ...dbKeyIndexSet]);
                    for (const k of allKnownKeys) {
                        if (k.startsWith(prefix)) {
                            store.delete(k);
                            importedImgCache.delete(k);
                            dbKeyIndexSet.delete(k);
                        }
                    }
                } catch (e) {}
                Object.keys(partRandomOffsetMap).forEach(k => delete partRandomOffsetMap[k]);
                curVars = getInitialVars();
                curVars.上次清洗楼层 = safeCtx()?.chat?.length || 0;
                userSettings.edgingLockActive = false;
                userSettings.objectificationId = "free";
                userSettings.parasiteState = { type: "无寄生", lv: 0, eggCount: 0 };
                userSettings.clothDurability = 100;
                userSettings.hypnoTriggers = [];
                saveSettings();
                saveChatCache(curVars); latestStatus = getFallbackData(); isSettingsOpen = false; renderBody();
                showToast("🌸 已将数值、穿搭与本局配图全部重置为 100% 初始清白态！", "success");
            };
            bodyEl.querySelector("#st-cfg-exit-plugin").onclick = () => {
                setPluginEnabledState(false);
            };

            // 💎 设置中心四大板块高定美颜与点击折叠手风琴化（放在 mountPoolManagerInSettings 之后执行，确保图池管理区也完美受控折叠！）
            userSettings.collapsedCfgSections = userSettings.collapsedCfgSections || {};
            Array.from(bodyEl.querySelectorAll("div[style*='border-radius:11px']")).forEach((secDiv, sIdx) => {
                secDiv.classList.add("st-cfg-section");
                const headerEl = secDiv.firstElementChild;
                if (!headerEl) return;
                headerEl.style.cursor = "pointer";
                headerEl.style.userSelect = "none";
                headerEl.title = "点击折叠 / 展开此设置板块";
                const secKey = "sec_" + sIdx;
                const toggleHint = document.createElement("span");
                toggleHint.style.cssText = "font-size:10px;color:#fde047;background:rgba(253,224,71,0.14);border:1px solid rgba(253,224,71,0.35);padding:1px 7px;border-radius:99px;margin-left:auto;flex-shrink:0;";
                const applyCollapseState = () => {
                    const isCol = Boolean(userSettings.collapsedCfgSections[secKey]);
                    toggleHint.textContent = isCol ? "🔽 展开" : "🔼 收起";
                    Array.from(secDiv.children).forEach((ch, cIdx) => {
                        if (cIdx > 0) ch.style.display = isCol ? "none" : "";
                    });
                    headerEl.style.marginBottom = isCol ? "0px" : "8px";
                };
                if (headerEl.style.display !== "flex") {
                    headerEl.style.display = "flex";
                    headerEl.style.justifyContent = "space-between";
                    headerEl.style.alignItems = "center";
                }
                headerEl.appendChild(toggleHint);
                applyCollapseState();
                headerEl.onclick = (ev) => {
                    if (ev.target.closest("input, label, button, select")) return;
                    userSettings.collapsedCfgSections[secKey] = !userSettings.collapsedCfgSections[secKey];
                    saveSettings();
                    applyCollapseState();
                };
            });
        }

        function setPluginEnabledState(enableFlag) {
            userSettings.enabled = Boolean(enableFlag);
            saveSettings();
            const root = document.getElementById("st-v5-root");
            const panel = document.getElementById("st-v5-panel");
            const modal = document.getElementById("st-v5-modal");
            const pop = document.getElementById("st-tag-popover");
            const toastBox = document.getElementById("st-v10-toast");
            const extChk = document.getElementById("st-ext-menu-enable-chk");
            if (extChk) extChk.checked = userSettings.enabled;

            if (!userSettings.enabled) {
                isPanelOpen = false;
                if (panel) panel.style.display = "none";
                if (root) root.style.display = "none";
                if (modal) modal.style.display = "none";
                if (pop) pop.style.display = "none";
                if (toastBox) toastBox.style.display = "none";
            } else {
                if (root) root.style.display = "block";
                applyThemeAndSize();
                syncFromLatestChat(null);
                showToast("💗 状态栏 1.0 已重新开启！", "success", 2200);
            }
        }

        function mountExtensionMenuSwitch() {
            if (document.getElementById("st-ext-settings-drawer")) return;
            const container = document.getElementById("extensions_settings") || document.getElementById("extensions_settings2");
            if (!container) { setTimeout(mountExtensionMenuSwitch, 1500); return; }
            const wrap = document.createElement("div");
            wrap.id = "st-ext-settings-drawer";
            wrap.className = "inline-drawer";
            wrap.innerHTML = `
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>📊 状态栏 1.0 (全息内窥终极版)</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content" style="padding:8px 10px;display:flex;flex-direction:column;gap:8px;">
                    <label class="checkbox_label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                        <input id="st-ext-menu-enable-chk" type="checkbox" ${userSettings.enabled ? "checked" : ""}>
                        <span>🟢 启用状态栏 1.0（关闭后完全退出，停止一切界面显示、提示与后台更新）</span>
                    </label>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button id="st-ext-menu-open-btn" class="menu_button" type="button" style="width:auto;padding:4px 12px;">💗 立即开启并呼出状态栏</button>
                        <button id="st-ext-menu-reset-pos-btn" class="menu_button" type="button" style="width:auto;padding:4px 12px;">🎯 找回悬浮球位置</button>
                    </div>
                </div>
            `;
            container.appendChild(wrap);
            const chk = wrap.querySelector("#st-ext-menu-enable-chk");
            chk.onchange = () => setPluginEnabledState(chk.checked);
            wrap.querySelector("#st-ext-menu-open-btn").onclick = () => {
                if (!userSettings.enabled) setPluginEnabledState(true);
                const panel = document.getElementById("st-v5-panel");
                isPanelOpen = true;
                if (panel) panel.style.display = "flex";
                syncFromLatestChat(viewingHistoryFloor);
            };
            wrap.querySelector("#st-ext-menu-reset-pos-btn").onclick = () => {
                if (!userSettings.enabled) setPluginEnabledState(true);
                userSettings.btnX = Math.max(12, window.innerWidth - 68);
                userSettings.btnY = Math.max(80, Math.round(window.innerHeight * 0.25));
                saveSettings();
                const tb = document.getElementById("st-v5-toggle");
                if (tb) { tb.style.left = userSettings.btnX + "px"; tb.style.top = userSettings.btnY + "px"; tb.style.transform = "translateX(0px)"; tb.style.opacity = "1"; }
                showToast("🎯 悬浮球已复位到屏幕右侧！", "success");
            };
        }

        let isDirectorOpen = false;

        function renderBody() {
            const bodyEl = document.getElementById("st-v5-body"), tabsEl = document.getElementById("st-v5-tabs"), titleEl = document.getElementById("st-v5-title");
            if (!bodyEl || !tabsEl) return;
            if (!latestStatus) latestStatus = getFallbackData();
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"], u = detectProtagonistName(curVars);

            if (titleEl) titleEl.innerHTML = `✨ 状态栏 1.0 · <span style="color:#fde047;">${u}</span> <span style="font-size:11px;color:${tc.sub};font-weight:normal;">(${latestStatus.floorId})</span>`;

            if (isSettingsOpen) {
                tabsEl.style.display = "none";
                renderSettingsView(bodyEl);
                return;
            }
            tabsEl.style.display = "flex";

            const cats = latestStatus.categories || [];
            if (!activeCat || !cats.some(c => c.title === activeCat)) activeCat = cats[0]?.title || "档案与风评";

            tabsEl.innerHTML = cats.map(c => {
                const act = (c.title === activeCat);
                return `<button type="button" class="st-tab-btn" data-cat="${c.title}" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:7px 4px;border-radius:10px;border:${act ? '1.5px solid ' + tc.prim : '1px solid transparent'};background:${act ? tc.hi : 'transparent'};color:${act ? '#fff' : tc.sub};cursor:pointer;font-size:11px;font-weight:${act ? 'bold' : 'normal'};transition:all 0.15s ease;"><span style="font-size:16px;">${c.icon}</span><span>${SHORT_NAMES[c.title] || c.title.slice(0, 2)}</span></button>`;
            }).join("");
            tabsEl.querySelectorAll(".st-tab-btn").forEach(b => {
                b.onclick = () => { activeCat = b.getAttribute("data-cat"); renderBody(); };
            });

            const dev = computeAllOrganDevelopments(curVars), caps = calcHoleCapacities(curVars), sp = curVars.体内精液存量 || {}, c = curVars.计数 || {}, mark = curVars.痕迹与标记 || {};
            const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
            const buffs = computeActiveBuffs(curVars, dev);

            const painLv = Math.min(3, Math.floor((safeNum(mark.鞭痕与掌印) + safeNum(c.交易?.轮奸群交) * 2) / 4));
            const pleasLv = Math.min(3, Math.floor((safeNum(c.高潮?.总数) + safeNum(c.失控?.喷潮) * 2) / 5));
            const shameLv = Math.min(3, Math.floor((100 - safeNum(curVars.精神与心理?.羞耻度, 100)) / 30));
            const obeyLv = Math.min(3, Math.floor(safeNum(curVars.精神与心理?.服从度) / 30));
            const lewdLv = Math.min(3, Math.floor(safeNum(curVars.核心数值?.淫乱恶堕) / 30));
            const exposeRisk = Math.min(100, Math.round((totalMl > 0 ? 35 : 0) + ((userSettings.clothDurability || 100) < 60 ? 35 : 0) + (dev.vagObj.val >= 60 ? 30 : 0)));

            const asmrQuote = generateLiveASMRQuote(curVars, u);
            const curCatObj = cats.find(x => x.title === activeCat) || cats[0];
            const showXrayHere = userSettings.showXrayOnHome && (activeCat === "档案与风评");

            const wardrobeBarHtml = (activeCat === "全身穿搭") ? `
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;padding:6px 8px;background:rgba(244,114,182,0.12);border:1px dashed rgba(244,114,182,0.45);border-radius:10px;align-items:center;">
                    <span style="font-size:10.5px;color:#fde047;font-weight:bold;">👗 一键换装:</span>
                    ${WARDROBE_PRESETS.map((wp, idx) => `<button type="button" class="st-wardrobe-preset-btn st-pill-btn" data-widx="${idx}" style="padding:2px 8px;font-size:10.5px;">${wp.name}</button>`).join("")}
                </div>
            ` : "";

            const hypnoAndEdgingBarHtml = (activeCat === "恶堕与脑改") ? `
                <div style="margin-bottom:8px;padding:7px 9px;background:rgba(168,85,247,0.12);border:1px dashed rgba(192,132,252,0.45);border-radius:10px;display:flex;flex-direction:column;gap:6px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
                        <span style="font-size:11px;color:#fde047;font-weight:bold;">🔔 催眠条件反射钢印 & 🔒 寸止地狱锁</span>
                        <div style="display:flex;gap:4px;flex-wrap:wrap;">
                            <button type="button" id="st-edging-lock-btn" class="st-pill-btn" style="padding:2px 8px;font-size:10.5px;background:${userSettings.edgingLockActive ? 'linear-gradient(135deg,#f59e0b,#e11d48)' : 'rgba(255,255,255,0.1)'};color:${userSettings.edgingLockActive ? '#fff' : '#fde047'};border-color:#fde047;">${userSettings.edgingLockActive ? "🔒 寸止锁开启中(卡99%)" : "🔓 开启寸止锁"}</button>
                            ${userSettings.edgingLockActive ? `<button type="button" id="st-edging-burst-btn" class="st-pill-btn" style="padding:2px 8px;font-size:10.5px;background:linear-gradient(135deg,#ec4899,#7e22ce);color:#fff;border:none;">💥 引爆连环绝顶</button>` : ""}
                            <button type="button" id="st-hypno-add-btn" class="st-pill-btn" style="padding:2px 7px;font-size:10px;">➕ 刻入新钢印</button>
                        </div>
                    </div>
                    <div style="display:flex;gap:4px;flex-wrap:wrap;">
                        ${HYPNO_PRESET_LIBRARY.map((ht, idx) => {
                            const active = (userSettings.hypnoTriggers || []).includes(ht);
                            return `<button type="button" class="st-hypno-preset-pill st-pill-btn" data-hidx="${idx}" style="padding:2px 7px;font-size:10px;background:${active ? 'rgba(236,72,153,0.35)' : 'rgba(0,0,0,0.4)'};border-color:${active ? '#f472b6' : 'rgba(255,255,255,0.15)'};color:${active ? '#fff' : '#cbd5e1'};">${active ? "✅ " : ""}${ht.split("：")[0]}</button>`;
                        }).join("")}
                    </div>
                </div>
            ` : "";

            const bodyModStampBarHtml = (activeCat === "肉改与道具") ? `
                <div style="margin-bottom:8px;padding:7px 9px;background:rgba(225,29,72,0.12);border:1px dashed rgba(251,113,133,0.45);border-radius:10px;display:flex;flex-direction:column;gap:6px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                        <span style="font-size:11px;color:#fde047;font-weight:bold;">🪑 物化形态阶级:</span>
                        <select id="st-obj-tier-sel" style="background:#111;color:#fbcfe8;border:1px solid #f472b6;border-radius:6px;padding:2px 6px;font-size:11px;font-weight:bold;">
                            ${OBJECTIFICATION_TIERS.map(t => `<option value="${t.id}" ${userSettings.objectificationId === t.id ? "selected" : ""}>${t.label}</option>`).join("")}
                        </select>
                        <button type="button" id="st-custom-graffiti-btn" class="st-pill-btn" style="padding:2px 7px;font-size:10px;margin-left:auto;">✍️ 自定义涂鸦</button>
                    </div>
                    <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">
                        <span style="font-size:10px;color:#fda4af;">✍️ 盖羞辱印章:</span>
                        ${BODY_WRITING_STAMPS.map((st, idx) => `<button type="button" class="st-stamp-pill st-pill-btn" data-sidx="${idx}" style="padding:1.5px 6px;font-size:10px;">${st}</button>`).join("")}
                    </div>
                </div>
            ` : "";

            const parasiteBarHtml = (activeCat === "苗床与受孕") ? `
                <div style="margin-bottom:8px;padding:7px 9px;background:rgba(192,132,252,0.12);border:1px dashed rgba(216,180,254,0.45);border-radius:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                    <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                        <span style="font-size:11px;color:#fde047;font-weight:bold;">🐙 异种寄生舱:</span>
                        <select id="st-para-type-sel" style="background:#111;color:#e9d5ff;border:1px solid #c084fc;border-radius:6px;padding:2px 6px;font-size:11px;">
                            ${PARASITE_TYPES.map(p => `<option value="${p.type}" ${userSettings.parasiteState?.type === p.type ? "selected" : ""}>${p.icon} ${p.type}</option>`).join("")}
                        </select>
                    </div>
                    <div style="display:flex;gap:4px;align-items:center;">
                        <button type="button" id="st-para-breed-btn" class="st-pill-btn" style="padding:2px 8px;font-size:10.5px;color:#f0abfc;">🥚 催熟产卵(+3颗)</button>
                        <button type="button" id="st-para-expel-btn" class="st-pill-btn" style="padding:2px 8px;font-size:10.5px;color:#fde047;">💦 挤压排卵高潮</button>
                    </div>
                </div>
            ` : "";

            const curDnaSummary = curVars.档案?.当前提取形象摘要 || summarizeDnaTagsToChinese(getLockedAppearanceTags(u, curVars));
            const historyBannerHtml = viewingHistoryFloor !== null ? `
                <div style="margin-bottom:8px;background:linear-gradient(90deg,rgba(245,158,11,0.32),rgba(225,29,72,0.32));border:1.5px solid #fde047;border-radius:10px;padding:6px 10px;display:flex;justify-content:space-between;align-items:center;gap:6px;box-shadow:0 0 14px rgba(245,158,11,0.4);">
                    <span style="font-size:11.5px;color:#fef08a;font-weight:bold;">🕰️ 正在回溯第 #${viewingHistoryFloor} 层历史状态 (只读预览)</span>
                    <button type="button" id="st-banner-back-now" style="background:#fde047;color:#111;border:none;border-radius:6px;padding:2px 9px;font-size:11px;font-weight:bold;cursor:pointer;">⚡ 返回实时层</button>
                </div>` : "";
            bodyEl.innerHTML = `
                ${historyBannerHtml}
                <!-- 👑 顶部角色形态与语音一体化高定胶囊舱 -->
                <div style="margin-bottom:8px;background:linear-gradient(145deg,rgba(32,14,48,0.88),rgba(12,6,22,0.94));border:1px solid rgba(244,114,182,0.42);border-radius:12px;padding:7px 10px;box-shadow:0 6px 18px rgba(0,0,0,0.45);">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:${userSettings.collapseTopHud ? '0px' : '5px'};">
                        <div style="display:flex;align-items:center;gap:5px;min-width:0;flex:1;">
                            <span id="st-top-dna-quick-pill" style="cursor:pointer;font-size:11px;background:rgba(253,224,71,0.16);border:1px solid rgba(253,224,71,0.45);color:#fde047;padding:1px 7px;border-radius:99px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="点击立即从最新正文刷新提取外貌特征（当前：${curDnaSummary}）">🧬 ${curDnaSummary}</span>
                            <button id="st-top-quick-switch-role" type="button" title="点击快速切换本局监控角色" style="background:rgba(103,232,249,0.16);border:1px solid rgba(103,232,249,0.45);color:#67e8f9;padding:1px 6px;border-radius:99px;font-size:10px;font-weight:bold;cursor:pointer;flex-shrink:0;">🎯切角</button>
                        </div>
                        <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
                            ${userSettings.personaMode === "contrast" ? `<button id="st-toggle-contrast-btn" type="button" style="background:#ec4899;color:#fff;border:none;border-radius:6px;padding:1.5px 7px;font-size:10px;font-weight:bold;cursor:pointer;">🎭切表/里</button>` : ""}
                            <button id="st-toggle-top-hud-btn" type="button" title="折叠或展开顶部语音、Buff栏与X-Ray内窥图，留出最大空间看卡片" style="background:rgba(255,255,255,0.1);color:#cbd5e1;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:1.5px 7px;font-size:10px;cursor:pointer;">${userSettings.collapseTopHud ? "🔽 展开顶栏" : "🔼 精简顶栏"}</button>
                        </div>
                    </div>
                    ${!userSettings.collapseTopHud ? `
                    <div id="st-asmr-voice-bar" title="点击朗读语音心声" style="cursor:pointer;background:linear-gradient(90deg,rgba(244,114,182,0.16),rgba(192,132,252,0.1));border-left:3px solid ${tc.prim};border-radius:6px;padding:5px 8px;display:flex;align-items:center;gap:7px;font-size:11.3px;color:#ffe4e6;">
                        <span style="font-size:14px;">🎧</span>
                        <div style="flex:1;line-height:1.42;font-style:italic;">${asmrQuote}</div>
                    </div>` : ""}
                </div>

                ${(activeCat === "档案与风评" && !userSettings.collapseTopHud) ? `
                <div style="background:rgba(12,6,22,0.62);border:1px solid rgba(255,255,255,0.1);border-radius:11px;padding:6px 9px;margin-bottom:8px;display:flex;flex-direction:column;gap:5px;">
                    <div class="st-buff-strip" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
                        <span style="font-size:9.5px;color:#94a3b8;margin-right:2px;">⚡状态:</span>
                        ${buffs.map((b, idx) => `<span class="st-buff-pill" data-bidx="${idx}" style="background:${b.bg};border:1px solid ${b.border};color:${b.color};padding:1.5px 7px;border-radius:99px;font-size:10px;font-weight:bold;">${b.icon} ${b.name}</span>`).join("")}
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding-top:4px;border-top:1px dashed rgba(255,255,255,0.08);">
                        <span class="st-era-pill" data-k="pain" style="background:rgba(225,29,72,0.22);border:1px solid #fb7185;color:#fecdd3;padding:1px 6px;border-radius:99px;font-size:9.8px;">💮苦痛Lv.${painLv}</span>
                        <span class="st-era-pill" data-k="pleas" style="background:rgba(236,72,153,0.25);border:1px solid #f472b6;color:#fbcfe8;padding:1px 6px;border-radius:99px;font-size:9.8px;">💗快乐Lv.${pleasLv}</span>
                        <span class="st-era-pill" data-k="shame" style="background:rgba(168,85,247,0.25);border:1px solid #c084fc;color:#e9d5ff;padding:1px 6px;border-radius:99px;font-size:9.8px;">😳屈辱Lv.${shameLv}</span>
                        <span class="st-era-pill" data-k="obey" style="background:rgba(234,179,8,0.22);border:1px solid #facc15;color:#fef08a;padding:1px 6px;border-radius:99px;font-size:9.8px;">🙇顺从Lv.${obeyLv}</span>
                        <span class="st-era-pill" data-k="lewd" style="background:rgba(147,51,234,0.28);border:1px solid #e879f9;color:#f5d0fe;padding:1px 6px;border-radius:99px;font-size:9.8px;">🖤淫乱Lv.${lewdLv}</span>
                        <span class="st-era-pill" data-k="expose" style="background:rgba(239,68,68,0.25);border:1px solid #f87171;color:#fca5a5;padding:1px 7px;border-radius:99px;font-size:9.8px;margin-left:auto;font-weight:bold;">👀暴露${exposeRisk}%</span>
                    </div>
                </div>` : ""}

                <!-- 🛠️ 分类标题与多功能工具台一体化条 -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;gap:6px;flex-wrap:wrap;background:rgba(0,0,0,0.28);padding:5px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);">
                    <div style="font-size:12.5px;font-weight:bold;color:#fde047;display:flex;align-items:center;gap:4px;">
                        <span>${curCatObj?.icon || "✨"} ${curCatObj?.title || ""}</span>
                        <span style="font-size:10.5px;color:${tc.sub};font-weight:normal;">(${curCatObj?.summary || ""})</span>
                    </div>
                    <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">
                        <button type="button" id="st-main-poster-btn" class="st-pill-btn" style="padding:2px 7px;font-size:10px;color:#fbcfe8;">📜鉴定</button>
                        <button type="button" id="st-main-api-redraw" class="st-pill-btn" style="padding:2px 7px;font-size:10px;background:rgba(103,232,249,0.18);border-color:#67e8f9;color:#67e8f9;">🤖重绘</button>
                        <button type="button" id="st-main-batch-gen-all" class="st-pill-btn" style="padding:2px 8px;font-size:10px;background:linear-gradient(135deg,rgba(245,158,11,0.32),rgba(236,72,153,0.32));border-color:#f472b6;color:#fde047;">${isBatchGeneratingAll ? "🛑停止" : "🎨全生图"}</button>
                        <button type="button" id="st-toggle-director" class="st-pill-btn" style="padding:2px 7px;font-size:10px;color:#fde047;">🎮导演${isDirectorOpen ? "▲" : "▼"}</button>
                        <button type="button" id="st-add-custom-btn" class="st-pill-btn" style="padding:2px 7px;font-size:10px;">➕</button>
                    </div>
                </div>

                <div id="st-director-drawer" style="display:${isDirectorOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:5px;background:rgba(0,0,0,0.48);border:1px dashed rgba(251,191,36,0.45);border-radius:10px;padding:7px 9px;margin-bottom:8px;">
                    <button type="button" class="st-dir-act st-pill-btn" data-act="creampie">💦 灌满宫腔(+25ml)</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="orgasm">⚡ 强制绝顶潮吹</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="edging">${userSettings.edgingLockActive ? "💥 解锁引爆寸止" : "🔒 开启寸止锁"}</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="aphrodisiac" style="color:#e879f9;">🧪 喂食强效媚药</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="toy" style="color:#c084fc;">🎛️ 塞入高频跳蛋</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="tattoo" style="color:#f472b6;">🔮 烙印催情淫纹</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="tear">👗 撕裂衣装(-30%)</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="expose">📸 当众露出留影</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="edit_ledger" style="color:#fde047;border-color:#fde047;">🔢 自由改总账/储精</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="clean" style="color:#a6e3a1;">🛁 温水清洗排精</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="preview_prompt" style="color:#67e8f9;border-color:#67e8f9;">👁️ 预览AI同步铁律</button>
                </div>

                ${wardrobeBarHtml}
                ${hypnoAndEdgingBarHtml}
                ${bodyModStampBarHtml}
                ${parasiteBarHtml}
                ${(showXrayHere && !userSettings.collapseTopHud) ? buildEnhancedTopXRayCenter(curVars, dev, caps) : ""}

                <div id="st-cards-container" style="display:${userSettings.wideGridCards ? 'grid' : 'flex'};${userSettings.wideGridCards ? 'grid-template-columns:repeat(auto-fill,minmax(235px,1fr));' : 'flex-direction:column;'}gap:8px;"></div>
            `;

            const backNowBannerBtn = bodyEl.querySelector("#st-banner-back-now");
            if (backNowBannerBtn) {
                backNowBannerBtn.onclick = () => syncFromLatestChat(null);
            }
            const topDnaQuickPill = bodyEl.querySelector("#st-top-dna-quick-pill");
            if (topDnaQuickPill) {
                topDnaQuickPill.onclick = () => {
                    _appearMemoCache = { sig: "", res: null };
                    aiLockAppearanceByChinese("", true);
                };
            }
            const topSwitchRoleBtn = bodyEl.querySelector("#st-top-quick-switch-role");
            if (topSwitchRoleBtn) {
                topSwitchRoleBtn.onclick = () => promptSwitchTargetCharacter();
            }
            const topHudToggleBtn = bodyEl.querySelector("#st-toggle-top-hud-btn");
            if (topHudToggleBtn) {
                topHudToggleBtn.onclick = () => {
                    userSettings.collapseTopHud = !userSettings.collapseTopHud;
                    saveSettings();
                    renderBody();
                };
            }
            const contrastToggleBtn = bodyEl.querySelector("#st-toggle-contrast-btn");
            if (contrastToggleBtn) {
                contrastToggleBtn.onclick = () => {
                    userSettings.contrastInnerActive = !userSettings.contrastInnerActive;
                    saveSettings();
                    latestStatus = getFallbackData();
                    renderBody();
                };
            }

            const voiceBar = bodyEl.querySelector("#st-asmr-voice-bar");
            if (voiceBar) {
                voiceBar.onclick = () => {
                    try {
                        if (window.speechSynthesis) {
                            if (window.speechSynthesis.speaking) {
                                window.speechSynthesis.cancel();
                                showToast("🔇 已停止语音朗读", "info", 1500);
                                return;
                            }
                            window.speechSynthesis.cancel();
                            const utter = new SpeechSynthesisUtterance(asmrQuote.replace(/[【】“”"♡💦🥵❤️💧]/g, ""));
                            utter.lang = "zh-CN";
                            const isLoliVoice = /娇小|贫乳|萝莉|petite|loli|small breasts/i.test(curDnaSummary);
                            const isMatureVoice = /爆乳|巨乳|熟女|美女蛇|huge|large/i.test(curDnaSummary);
                            const curCorr = safeNum(curVars.核心数值?.淫乱恶堕, 0);
                            utter.pitch = isLoliVoice ? 1.48 : (isMatureVoice ? 1.02 : 1.25);
                            utter.rate = curCorr >= 60 ? 0.86 : 0.96;
                            window.speechSynthesis.speak(utter);
                            showToast(`🎧 正在以【${isLoliVoice ? "娇嫩萝莉声线" : (isMatureVoice ? "微醺御姐声线" : "清甜少女声线")}】朗读实时心声...`, "info", 2400);
                        }
                    } catch (err) {}
                };
            }

            bodyEl.querySelectorAll(".st-buff-pill").forEach(el => {
                const b = buffs[parseInt(el.getAttribute("data-bidx"), 10)];
                if (b) bindLongPressOrClickTag(el, { title: `${b.icon} ${b.name}`, badge: b.badge, origin: b.origin, effect: b.effect, thought: b.thought });
            });

            const eraMeta = {
                pain:   { title: `💮 苦痛刻印 Lv.${painLv}`, badge: `Lv.${painLv} / 3`, origin: `累计承受鞭痕掌印 ${safeNum(mark.鞭痕与掌印)} 处、粗暴轮奸 ${safeNum(c.交易?.轮奸群交)} 次。`, effect: "痛觉神经与快感中枢交织，受到拍打或粗暴对待时会分泌肾上腺素与润滑液。", thought: "被打过的地方火辣辣地发烫，可是深处却跟着一起缩紧了💦……" },
                pleas:  { title: `💗 快乐刻印 Lv.${pleasLv}`, badge: `Lv.${pleasLv} / 3`, origin: `累计绝顶高潮 ${safeNum(c.高潮?.总数)} 次、潮吹 ${safeNum(c.失控?.喷潮)} 次。`, effect: "大脑皮层已被高浓度多巴胺冲刷重塑，高潮阈值大幅降低，极易连续绝顶。", thought: "只要回想起攀上巅峰时脑子一片空白的感觉，腿心就又开始发麻了😳💦！" },
                shame:  { title: `😳 屈辱刻印 Lv.${shameLv}`, badge: `Lv.${shameLv} / 3`, origin: `羞耻度跌至 ${safeNum(curVars.精神与心理?.羞耻度, 100)}%，累计失禁 ${safeNum(c.失控?.失禁)} 次。`, effect: "在羞耻姿势、失禁或暴露情境下，屈辱感会自动转化为强烈的催情兴奋。", thought: "明明是这么丢人现眼的姿态，为什么身体却反而兴奋得发抖呢🥵💦……" },
                obey:   { title: `🙇 顺从刻印 Lv.${obeyLv}`, badge: `Lv.${obeyLv} / 3`, origin: `当前服从度为 ${safeNum(curVars.精神与心理?.服从度)}%，在支配下逐步妥协。`, effect: "面对命令语气或肢体摆布时，肌肉会产生顺从配合的本能，难以有效反抗。", thought: "身体已经比脑子先一步学会乖乖听话摆好姿势了💦……" },
                lewd:   { title: `🖤 淫乱刻印 Lv.${lewdLv}`, badge: `Lv.${lewdLv} / 3`, origin: `当前淫乱恶堕度为 ${safeNum(curVars.核心数值?.淫乱恶堕)}%，内射 ${safeNum(c.射精?.内射)} 次。`, effect: "空虚时会自动产生索求与发情冲动，在情事中表现得更加主动粘人。", thought: "里面空落落的……好想被滚烫的东西满满地塞住呀🥵💦！" },
                expose: { title: `👀 社会暴露风险雷达 (${exposeRisk}%)`, badge: exposeRisk >= 50 ? "🚨 极易穿帮" : "⚠️ 存在异样", origin: `综合体内蓄精(${totalMl}ml)、衣装完好度(${userSettings.clothDurability || 100}%)与穴口闭合度计算。`, effect: "当暴露风险高于 35% 时，周围人极易从怪异走姿、衣衫湿痕或体味中察觉异样！", thought: "要是现在被人靠近看到我双腿发抖、里面还灌着精液的样子，绝对会彻底社死的😳💦！！" }
            };
            bodyEl.querySelectorAll(".st-era-pill").forEach(pill => {
                const k = pill.getAttribute("data-k");
                if (eraMeta[k]) bindLongPressOrClickTag(pill, eraMeta[k]);
            });

            const edgBtn = bodyEl.querySelector("#st-edging-lock-btn");
            if (edgBtn) {
                edgBtn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    pushUndoSnapshot(curVars);
                    userSettings.edgingLockActive = !userSettings.edgingLockActive;
                    if (userSettings.edgingLockActive) {
                        curVars.精神与心理.快感累积 = 99;
                        curVars.计数.高潮.寸止 = safeNum(curVars.计数.高潮.寸止) + 1;
                        dispatchDirectorActionToChat(`*${u}被施加了寸止地狱锁，无论受到多么剧烈的玩弄与抽插，快感都死死卡在99%临界点无法高潮，全身痉挛哭喊求饶*`);
                        showToast("🔒 已开启【寸止地狱锁】！快感锁死 99%（下一轮正文将自动实现）！", "warn", 2800);
                    } else {
                        dispatchDirectorActionToChat(`*${u}身上的寸止地狱锁已解除，恢复了正常高潮泄身能力*`);
                        showToast("🔓 已解除寸止锁（下一轮正文将自动实现）！", "info", 2000);
                    }
                    saveSettings(); saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                };
            }
            const burstBtn = bodyEl.querySelector("#st-edging-burst-btn");
            if (burstBtn) {
                burstBtn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    pushUndoSnapshot(curVars);
                    playSynthSound("spurt");
                    userSettings.edgingLockActive = false;
                    const bonus = Math.max(3, Math.min(10, safeNum(curVars.计数?.高潮?.寸止, 1) + 2));
                    curVars.计数.高潮.总数 = safeNum(curVars.计数.高潮.总数) + bonus;
                    curVars.计数.高潮.强制 = safeNum(curVars.计数.高潮.强制) + bonus;
                    curVars.计数.失控.喷潮 = safeNum(curVars.计数.失控.喷潮) + 2;
                    curVars.计数.失控.失禁 = safeNum(curVars.计数.失控.失禁) + 1;
                    curVars.精神与心理.快感累积 = 100;
                    curVars.身体.体力 = Math.max(0, safeNum(curVars.身体.体力, 100) - 35);
                    saveSettings(); saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                    dispatchDirectorActionToChat(`*解开了${u}积攒已久的寸止禁制，令其当场爆发连续 ${bonus} 次剧烈的强制潮吹绝顶与失禁崩溃*`);
                    showToast(`💥 寸止禁制引爆！【${u}】瞬间爆发 ${bonus} 连发绝顶（下一轮正文将自动实现）！`, "error", 3500);
                };
            }
            bodyEl.querySelectorAll(".st-hypno-preset-pill").forEach(btn => {
                btn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    const ht = HYPNO_PRESET_LIBRARY[parseInt(btn.getAttribute("data-hidx"), 10)];
                    if (!ht) return;
                    pushUndoSnapshot(curVars);
                    userSettings.hypnoTriggers = Array.isArray(userSettings.hypnoTriggers) ? userSettings.hypnoTriggers : [];
                    const idx = userSettings.hypnoTriggers.indexOf(ht);
                    if (idx >= 0) {
                        userSettings.hypnoTriggers.splice(idx, 1);
                        dispatchDirectorActionToChat(`*解除了${u}脑海中的催眠钢印「${ht}」*`);
                        showToast(`🔓 已移除催眠钢印（下一轮正文将自动同步）`, "info", 2200);
                    } else {
                        userSettings.hypnoTriggers.push(ht);
                        curVars.精神与心理扩展.催眠深度 = Math.min(100, safeNum(curVars.精神与心理扩展?.催眠深度) + 18);
                        curVars.精神与心理.沦陷度 = Math.min(100, safeNum(curVars.精神与心理?.沦陷度) + 12);
                        dispatchDirectorActionToChat(`*向${u}的潜意识深处刻入了新的绝对催眠钢印：「${ht}」，并在本轮立即触发验证该条件反射反应*`);
                        showToast(`🔔 已刻入催眠钢印（下一轮正文将自动触发实现）！`, "success", 2600);
                    }
                    saveSettings(); saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                };
            });
            const addHypnoBtn = bodyEl.querySelector("#st-hypno-add-btn");
            if (addHypnoBtn) {
                addHypnoBtn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    const inp = prompt("🔔 请输入要刻入脑海的【催眠条件反射或常识改写铁律】（格式如：当听到XXX时 -> 身体立刻XXX）：", "");
                    if (!inp || !inp.trim()) return;
                    pushUndoSnapshot(curVars);
                    userSettings.hypnoTriggers = Array.isArray(userSettings.hypnoTriggers) ? userSettings.hypnoTriggers : [];
                    userSettings.hypnoTriggers.push(inp.trim());
                    curVars.精神与心理扩展.催眠深度 = Math.min(100, safeNum(curVars.精神与心理扩展?.催眠深度) + 20);
                    curVars.精神与心理.沦陷度 = Math.min(100, safeNum(curVars.精神与心理?.沦陷度) + 15);
                    dispatchDirectorActionToChat(`*向${u}的脑海刻入了全新催眠常识改写钢印：「${inp.trim()}」，并在本轮正文中立即生效体现*`);
                    saveSettings(); saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                    showToast("🔔 新催眠条件反射钢印已刻入（下一轮正文将自动实现）！", "success");
                };
            }

            const objTierSel = bodyEl.querySelector("#st-obj-tier-sel");
            if (objTierSel) {
                objTierSel.onchange = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    pushUndoSnapshot(curVars);
                    userSettings.objectificationId = objTierSel.value;
                    const found = OBJECTIFICATION_TIERS.find(t => t.id === objTierSel.value);
                    if (found) {
                        curVars.体内道具与权限.肉体所有权 = found.label;
                        if (objTierSel.value !== "free") {
                            curVars.核心数值.淫乱恶堕 = Math.max(safeNum(curVars.核心数值.淫乱恶堕), 35);
                            curVars.精神与心理.服从度 = Math.max(safeNum(curVars.精神与心理.服从度), 45);
                        }
                        dispatchDirectorActionToChat(`*${u}的肉体所有权与物化阶级已被强制改造切换为【${found.label}】（${found.desc}），本轮正文必须立即体现该身份与姿态变化*`);
                    }
                    saveSettings(); saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                    showToast(`🪑 已切换物化阶级为【${found?.label}】（下一轮正文将自动实现）！`, "info");
                };
            }
            bodyEl.querySelectorAll(".st-stamp-pill").forEach(btn => {
                btn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    const stamp = BODY_WRITING_STAMPS[parseInt(btn.getAttribute("data-sidx"), 10)];
                    if (!stamp) return;
                    pushUndoSnapshot(curVars);
                    const curTxt = safeStr(curVars.痕迹与标记.公开涂鸦字迹, "无");
                    curVars.痕迹与标记.公开涂鸦字迹 = (curTxt === "无" || !curTxt) ? stamp : (curTxt.includes(stamp) ? curTxt : `${curTxt} ${stamp}`);
                    curVars.痕迹与标记.体表痕迹 = curVars.痕迹与标记.公开涂鸦字迹;
                    curVars.痕迹与标记.鞭痕与掌印 = safeNum(curVars.痕迹与标记.鞭痕与掌印) + 1;
                    curVars.精神与心理.羞耻度 = Math.max(0, safeNum(curVars.精神与心理.羞耻度, 100) - 10);
                    saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                    dispatchDirectorActionToChat(`*在${u}的皮肉上重重盖下${stamp}的羞辱字迹印章，令其身体因屈辱与敏感而剧烈颤抖*`);
                    showToast(`✍️ 已盖下羞辱涂鸦：${stamp}（下一轮正文将自动实现）`, "warn");
                };
            });
            const custGrafBtn = bodyEl.querySelector("#st-custom-graffiti-btn");
            if (custGrafBtn) {
                custGrafBtn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    const inp = prompt("✍️ 请输入要写在角色身上的羞辱字迹与部位（如：【小腹：公用精盆】）：", curVars.痕迹与标记?.公开涂鸦字迹 !== "无" ? curVars.痕迹与标记?.公开涂鸦字迹 : "【小腹：正正正·内射专用】");
                    if (inp === null) return;
                    pushUndoSnapshot(curVars);
                    curVars.痕迹与标记.公开涂鸦字迹 = inp.trim() || "无";
                    curVars.痕迹与标记.体表痕迹 = curVars.痕迹与标记.公开涂鸦字迹;
                    if (curVars.痕迹与标记.公开涂鸦字迹 !== "无") {
                        curVars.痕迹与标记.鞭痕与掌印 = Math.max(1, safeNum(curVars.痕迹与标记.鞭痕与掌印));
                    }
                    dispatchDirectorActionToChat(`*在${u}的皮肤上写下了「${curVars.痕迹与标记.公开涂鸦字迹}」的醒目羞辱涂鸦字迹*`);
                    saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                    showToast("✍️ 已更新体表涂鸦字迹（下一轮正文将自动实现）！", "success");
                };
            }

            const paraSel = bodyEl.querySelector("#st-para-type-sel");
            if (paraSel) {
                paraSel.onchange = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    pushUndoSnapshot(curVars);
                    const val = paraSel.value;
                    userSettings.parasiteState = userSettings.parasiteState || { type: "无寄生", lv: 0, eggCount: 0 };
                    userSettings.parasiteState.type = val;
                    userSettings.parasiteState.lv = (val === "无寄生") ? 0 : Math.max(1, safeNum(userSettings.parasiteState.lv, 2));
                    const pObj = PARASITE_TYPES.find(p => p.type === val);
                    dispatchDirectorActionToChat(val === "无寄生" ? `*${u}体内的异种寄生生物已被清除排出*` : `*${u}的生殖腔与小腹内被植入了异种生物【${val}】（${pObj?.desc || "不断蠕动分泌催情粘液"}），本轮正文必须立即描写异物在体内蠕动吸吮的生理反应*`);
                    saveSettings(); saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                    showToast(`🐙 体内寄生已切换为【${val}】（下一轮正文将自动实现）`, "info");
                };
            }
            const breedBtn = bodyEl.querySelector("#st-para-breed-btn");
            if (breedBtn) {
                breedBtn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    pushUndoSnapshot(curVars);
                    userSettings.parasiteState = userSettings.parasiteState || { type: "产卵魔虫母巢", lv: 2, eggCount: 0 };
                    if (userSettings.parasiteState.type === "无寄生") userSettings.parasiteState.type = "产卵魔虫母巢";
                    userSettings.parasiteState.lv = Math.min(6, safeNum(userSettings.parasiteState.lv, 1) + 1);
                    userSettings.parasiteState.eggCount = safeNum(userSettings.parasiteState.eggCount) + 3;
                    curVars.受孕与生理.怀孕进度 = Math.min(100, safeNum(curVars.受孕与生理.怀孕进度) + 18);
                    dispatchDirectorActionToChat(`*${u}体内的【${userSettings.parasiteState.type}】突然催熟并产下 3 颗膨胀的异种肉卵（当前体内共怀卵 ${userSettings.parasiteState.eggCount} 颗），将小腹撑得明显鼓起并引发阵阵痉挛*`);
                    saveSettings(); saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                    showToast(`🥚 体内【${userSettings.parasiteState.type}】产卵 3 颗（下一轮正文将自动实现）！`, "warn");
                };
            }
            const expelBtn = bodyEl.querySelector("#st-para-expel-btn");
            if (expelBtn) {
                expelBtn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    pushUndoSnapshot(curVars);
                    playSynthSound("spurt");
                    const eggs = safeNum(userSettings.parasiteState?.eggCount, 0);
                    if (userSettings.parasiteState) userSettings.parasiteState.eggCount = 0;
                    curVars.受孕与生理.生产产卵次数 = safeNum(curVars.受孕与生理.生产产卵次数) + 1;
                    curVars.受孕与生理.怀孕进度 = 0;
                    curVars.计数.高潮.总数 = safeNum(curVars.计数.高潮.总数) + 1;
                    curVars.计数.失控.喷潮 = safeNum(curVars.计数.失控.喷潮) + 1;
                    saveSettings(); saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                    dispatchDirectorActionToChat(`*用力按压${u}鼓胀的小腹，令其伴随着剧烈的潮吹痉挛从松弛的穴口噗啾噗啾地排出了体内的 ${eggs || 1} 颗异种肉卵与大量浓稠白浊*`);
                    showToast(`💦 已强制排空 ${eggs || 1} 颗肉卵引发产卵绝顶（下一轮正文将自动实现）！`, "error", 3200);
                };
            }

            const xrayModeBtn = bodyEl.querySelector("#st-xray-mode-toggle");
            if (xrayModeBtn) {
                xrayModeBtn.onclick = () => {
                    xrayPlayMode = !xrayPlayMode;
                    renderBody();
                    showToast(xrayPlayMode ? "👆 已开启【X-Ray触控把玩模式】！现在点击器官将直接按压揉捏并自动同步到下一轮正文！" : "🔍 已切回【X-Ray详情查看模式】", "info", 2600);
                };
            }

            bodyEl.querySelectorAll(".st-xray-hotspot").forEach(hs => {
                hs.onclick = () => {
                    const targetKey = hs.getAttribute("data-key");
                    if (xrayPlayMode) {
                        if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                        pushUndoSnapshot(curVars);
                        playSynthSound("spurt");
                        hs.classList.remove("st-organ-squeeze-anim");
                        void hs.offsetWidth;
                        hs.classList.add("st-organ-squeeze-anim");

                        if (targetKey === "子宫实况" || targetKey === "受精断面" || targetKey === "排卵周期") {
                            if (safeNum(curVars.体内精液存量.子宫毫升) > 0) {
                                const squeezed = Math.min(curVars.体内精液存量.子宫毫升, 15);
                                curVars.体内精液存量.子宫毫升 -= squeezed;
                                curVars.体内精液存量.小穴毫升 = safeNum(curVars.体内精液存量.小穴毫升) + squeezed;
                                curVars.手动精液调整楼层 = safeCtx()?.chat?.length || 0;
                                dispatchDirectorActionToChat(`*隔着${u}微隆的小腹用力按压鼓胀的子宫，将宫腔内 ${squeezed}ml 浓稠滚烫的精液咕啾一声挤出宫颈口流入阴道*`);
                                showToast(`👆 按压子宫挤出 ${squeezed}ml 浓精（下一轮正文将自动实现）！`, "warn", 2800);
                            } else {
                                curVars.精神与心理.快感累积 = Math.min(userSettings.edgingLockActive ? 99 : 100, safeNum(curVars.精神与心理.快感累积) + 18);
                                dispatchDirectorActionToChat(`*隔着小腹用力揉按${u}敏感的宫腔与卵巢位置，令其小腹一阵酸麻抽搐、快感飙升*`);
                                showToast(`👆 揉按敏感宫腔与卵巢，快感+18%（下一轮正文将自动实现）！`, "info", 2400);
                            }
                        } else if (targetKey === "小穴实况") {
                            if (safeNum(curVars.体内精液存量.小穴毫升) > 0) {
                                const drip = Math.min(curVars.体内精液存量.小穴毫升, 12);
                                curVars.体内精液存量.小穴毫升 -= drip;
                                curVars.手动精液调整楼层 = safeCtx()?.chat?.length || 0;
                                dispatchDirectorActionToChat(`*掰开并抠弄${u}泥泞不堪的蜜穴，令穴内积存的 ${drip}ml 白浊混杂着淫水顺着大腿根哗啦淌落*`);
                                showToast(`👆 掰开蜜穴淌出 ${drip}ml 白浊（下一轮正文将自动实现）！`, "warn", 2600);
                            } else {
                                curVars.核心数值.性欲程度 = Math.min(100, safeNum(curVars.核心数值.性欲程度) + 15);
                                dispatchDirectorActionToChat(`*揉弄抽插${u}充血外翻的花唇与蜜穴内壁，搅得透明淫水咕啾泛滥拉丝*`);
                                showToast(`👆 玩弄充血花唇，性欲+15%（下一轮正文将自动实现）！`, "info", 2400);
                            }
                        } else if (targetKey === "阴蒂尿道") {
                            if (userSettings.edgingLockActive) {
                                curVars.计数.高潮.寸止 = safeNum(curVars.计数.高潮.寸止) + 1;
                                curVars.精神与心理.快感累积 = 99;
                                dispatchDirectorActionToChat(`*恶劣地弹击揉搓${u}充血肿大的阴蒂，令其快感死死卡在99%寸止痉挛并渗出羞耻的尿珠*`);
                                showToast(`🔒 弹击肿大阴蒂卡在99%寸止（下一轮正文将自动实现）！`, "warn", 2800);
                            } else {
                                curVars.计数.高潮.总数 = safeNum(curVars.计数.高潮.总数) + 1;
                                curVars.计数.失控.喷潮 = safeNum(curVars.计数.失控.喷潮) + 1;
                                curVars.计数.失控.失禁 = safeNum(curVars.计数.失控.失禁) + 1;
                                curVars.精神与心理.快感累积 = 100;
                                dispatchDirectorActionToChat(`*用力弹击揉搓${u}肿大的阴蒂与松弛的尿道口，令其当场全身过电般痉挛潮吹并失禁漏尿*`);
                                showToast(`⛲ 弹击阴蒂引发潮吹与失禁漏尿（下一轮正文将自动实现）！`, "error", 2800);
                            }
                        } else if (targetKey === "胸部实况") {
                            curVars.计数.泌乳.喷乳次数 = safeNum(curVars.计数.泌乳.喷乳次数) + 1;
                            curVars.计数.泌乳.累计毫升 = safeNum(curVars.计数.泌乳.累计毫升) + 25;
                            dispatchDirectorActionToChat(`*用力抓揉挤压${u}饱满发胀的双乳与挺立乳尖，令其乳孔当场飙射出 25ml 温热甜腻的乳汁*`);
                            showToast(`🍼 抓揉双峰飙射 25ml 乳汁（下一轮正文将自动实现）！`, "info", 2600);
                        } else if (targetKey === "骚口实况") {
                            curVars.精神与心理.快感累积 = Math.min(userSettings.edgingLockActive ? 99 : 100, safeNum(curVars.精神与心理.快感累积) + 15);
                            dispatchDirectorActionToChat(`*玩弄搅拌${u}湿热敏感的口腔与软舌，令其喉咙深处发出羞人的吞咽声并拉出晶莹涎丝*`);
                            showToast(`👄 玩弄口腔与软舌（下一轮正文将自动实现）！`, "info", 2400);
                        } else if (targetKey === "屁眼实况") {
                            curVars.精神与心理.快感累积 = Math.min(userSettings.edgingLockActive ? 99 : 100, safeNum(curVars.精神与心理.快感累积) + 15);
                            dispatchDirectorActionToChat(`*按压撑弄${u}敏感的后庭菊穴括约肌，令其臀肉紧绷战栗、肠液不受控制地渗出*`);
                            showToast(`🕳️ 玩弄后庭菊穴（下一轮正文将自动实现）！`, "info", 2400);
                        } else {
                            curVars.精神与心理.快感累积 = Math.min(userSettings.edgingLockActive ? 99 : 100, safeNum(curVars.精神与心理.快感累积) + 15);
                            dispatchDirectorActionToChat(`*深入玩弄了${u}的【${targetKey}】，令其身体剧烈战栗迎合*`);
                            showToast(`👆 玩弄【${targetKey}】（下一轮正文将自动实现）！`, "info", 2400);
                        }
                        saveChatCache(curVars);
                        latestStatus = getFallbackData();
                        setTimeout(() => renderBody(), 320);
                        return;
                    }
                    for (const cat of cats) {
                        const found = (cat.items || []).find(it => it.editKey === targetKey);
                        if (found) { playSynthSound("squelch"); showDetailPopup(found); break; }
                    }
                };
            });

            bodyEl.querySelectorAll(".st-wardrobe-preset-btn").forEach(btn => {
                btn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    const wp = WARDROBE_PRESETS[parseInt(btn.getAttribute("data-widx"), 10)];
                    if (!wp) return;
                    pushUndoSnapshot(curVars);
                    curVars.穿搭 = { ...curVars.穿搭, ...wp.wear };
                    userSettings.clothDurability = wp.durability;
                    if (curVars.按钮详情) {
                        Object.keys(curVars.按钮详情).forEach(k => {
                            if (k.startsWith("穿搭_")) {
                                delete curVars.按钮详情[k].stage;
                                delete curVars.按钮详情[k].forceLatestImg;
                                delete curVars.按钮详情[k].imgUrl;
                                partRandomOffsetMap[k] = 0;
                            }
                        });
                    }
                    saveSettings();
                    saveChatCache(curVars);
                    latestStatus = getFallbackData();
                    renderBody();
                    dispatchDirectorActionToChat(`*让${u}全身换上了【${wp.name}】（当前衣装完好度 ${wp.durability}%），本轮正文必须按这套新穿搭描写她的外貌与羞耻感*`);
                    showToast(`👗 已一键换装为：【${wp.name}】（已自动切换对应款式配图并同步下一轮正文）！`, "success", 2800);
                };
            });

            bodyEl.querySelector("#st-main-poster-btn").onclick = () => generateAndDownloadPoster(curVars, dev, u);
            bodyEl.querySelector("#st-main-api-redraw").onclick = (e) => triggerSubApiUpdate(e.target);
            bodyEl.querySelector("#st-main-batch-gen-all").onclick = (e) => triggerBatchGenerateAllImages(e.target);
            bodyEl.querySelector("#st-toggle-director").onclick = () => { isDirectorOpen = !isDirectorOpen; renderBody(); };
            bodyEl.querySelector("#st-add-custom-btn").onclick = () => openAddCustomItemModal(curCatObj.title);
            const dirDrawer = bodyEl.querySelector("#st-director-drawer");
            customDirectorButtons.forEach((b) => {
                const btn = document.createElement("button");
                btn.type = "button"; btn.className = "st-pill-btn"; btn.style.color = "#fde047";
                btn.textContent = b.label;
                btn.onclick = () => b.onClickFn(window.ST_PatchAPI);
                dirDrawer.appendChild(btn);
            });
            dirDrawer.querySelectorAll(".st-dir-act").forEach(btn => {
                btn.onclick = () => {
                    if (viewingHistoryFloor !== null) viewingHistoryFloor = null;
                    const act = btn.getAttribute("data-act");
                    pushUndoSnapshot(curVars);
                    normalizeVarsStructure(curVars);
                    if (act === "creampie") {
                        curVars.体内精液存量.子宫毫升 = safeNum(curVars.体内精液存量.子宫毫升) + 25;
                        curVars.计数.射精.内射 = safeNum(curVars.计数.射精.内射) + 1;
                        curVars.断精回合数 = 0;
                        curVars.已手动清空精液 = false;
                        curVars.手动精液调整楼层 = safeCtx()?.chat?.length || 0;
                        _organDevCache = { sig: "", res: null };
                        if (curVars.按钮详情) {
                            ["子宫实况", "小穴实况", "受精断面", "精液归属", "孕肚进度"].forEach(k => {
                                if (curVars.按钮详情[k]) {
                                    delete curVars.按钮详情[k].forceLatestImg;
                                    delete curVars.按钮详情[k].imgUrl;
                                }
                            });
                        }
                        dispatchDirectorActionToChat(`*${u}的宫腔被直接灌入了25ml滚烫浓稠的精液（当前宫腔储精共${curVars.体内精液存量.子宫毫升}ml），下腹沉甸甸地坠胀发热*`);
                        showToast("💦 已向宫腔注入 25ml 浓精（配图已刷新，下一轮正文将自动同步体现）！", "info");
                    } else if (act === "orgasm") {
                        curVars.精神与心理.快感累积 = userSettings.edgingLockActive ? 99 : 100;
                        if (userSettings.edgingLockActive) {
                            curVars.计数.高潮.寸止 = safeNum(curVars.计数.高潮.寸止) + 1;
                            dispatchDirectorActionToChat(`*${u}受到剧烈刺激逼近巅峰，但因寸止禁制死死卡在99%快感无法泄身，全身痉挛哭喊求饶*`);
                            showToast("🔒 寸止锁生效中！快感卡在 99%（已同步至下一轮正文）！", "warn");
                        } else {
                            curVars.计数.高潮.总数 = safeNum(curVars.计数.高潮.总数) + 1;
                            curVars.计数.失控.喷潮 = safeNum(curVars.计数.失控.喷潮) + 1;
                            curVars.身体.体力 = Math.max(0, safeNum(curVars.身体.体力, 100) - 20);
                            dispatchDirectorActionToChat(`*${u}的最敏感处受到强烈冲击，当场全身剧烈痉挛着喷涌出大量潮吹水柱攀上绝顶高潮*`);
                            showToast("⚡ 已触发强制绝顶潮吹（下一轮正文将自动同步体现）！", "warn");
                        }
                    } else if (act === "edging") {
                        userSettings.edgingLockActive = !userSettings.edgingLockActive;
                        if (userSettings.edgingLockActive) {
                            curVars.精神与心理.快感累积 = 99;
                            curVars.计数.高潮.寸止 = safeNum(curVars.计数.高潮.寸止) + 1;
                            dispatchDirectorActionToChat(`*${u}被施加了寸止地狱锁，快感被强行卡死在99%临界点无法高潮*`);
                            showToast("🔒 已开启【寸止地狱锁】（已同步至下一轮正文）！", "warn");
                        } else {
                            curVars.计数.高潮.总数 = safeNum(curVars.计数.高潮.总数) + 5;
                            curVars.计数.失控.喷潮 = safeNum(curVars.计数.失控.喷潮) + 2;
                            curVars.精神与心理.快感累积 = 100;
                            dispatchDirectorActionToChat(`*${u}的寸止禁制被瞬间解开，积蓄的快感如决堤般引爆五连发绝顶潮吹崩溃*`);
                            showToast("💥 寸止解锁引爆五连绝顶潮吹（已同步至下一轮正文）！", "error");
                        }
                        saveSettings();
                    } else if (act === "tear") {
                        userSettings.clothDurability = Math.max(0, safeNum(userSettings.clothDurability, 100) - 30);
                        saveSettings();
                        dispatchDirectorActionToChat(`*${u}身上的衣物被刺啦一声粗暴撕裂（当前衣装完好度仅剩${userSettings.clothDurability}%），大片雪腻肌肤与私密处暴露在空气中*`);
                        showToast(`👗 衣装撕裂受损！完好度：${userSettings.clothDurability}%（已同步至下一轮正文）`, "warn");
                    } else if (act === "expose") {
                        curVars.计数.暴露.露出 = safeNum(curVars.计数.暴露.露出) + 1;
                        curVars.计数.暴露.被围观人次 = safeNum(curVars.计数.暴露.被围观人次) + 5;
                        curVars.计数.暴露.被拍摄留影 = safeNum(curVars.计数.暴露.被拍摄留影) + 1;
                        curVars.精神与心理.羞耻度 = Math.max(0, safeNum(curVars.精神与心理.羞耻度, 100) - 12);
                        dispatchDirectorActionToChat(`*在周围视线的围观与快门声下，${u}羞耻地暴露着泥泞私处被拍下高清把柄照片*`);
                        showToast("📸 已触发当众露出与留影（已同步至下一轮正文）！", "error");
                    } else if (act === "clean") {
                        curVars.体内精液存量 = { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 };
                        curVars.已手动清空精液 = true;
                        curVars.上次清洗楼层 = safeCtx()?.chat?.length || 0;
                        curVars.手动精液调整楼层 = safeCtx()?.chat?.length || 0;
                        curVars.本轮失控事件 = "";
                        _organDevCache = { sig: "", res: null };
                        if (curVars.历史最高崩坏度) {
                            delete curVars.历史最高崩坏度.preg_dna;
                            if (!curVars.受孕与生理?.子宫怀孕) delete curVars.历史最高崩坏度.preg_belly;
                        }
                        if (curVars.按钮详情) {
                            Object.keys(curVars.按钮详情).forEach(k => {
                                delete curVars.按钮详情[k].forceLatestImg;
                                if (k.startsWith("穿搭_") || k === "精液归属" || k === "孕肚进度" || k === "子宫实况" || k === "小穴实况" || k === "受精断面") {
                                    delete curVars.按钮详情[k].imgUrl;
                                }
                            });
                        }
                        userSettings.clothDurability = 100;
                        saveSettings();
                        dispatchDirectorActionToChat(`*${u}用温水彻底冲洗干净了体内的残留白浊，并换上了干爽整洁的衣物*`);
                        showToast("🛁 已温水清洗全身并整理好衣装（配图已同步恢复清爽）！", "success");
                    } else if (act === "aphrodisiac") {
                        curVars.精神与心理.媚药精液毒瘾 = Math.min(100, safeNum(curVars.精神与心理.媚药精液毒瘾) + 30);
                        curVars.核心数值.性欲程度 = Math.min(100, safeNum(curVars.核心数值.性欲程度) + 35);
                        curVars.精神与心理.快感累积 = Math.min(userSettings.edgingLockActive ? 99 : 100, safeNum(curVars.精神与心理.快感累积) + 25);
                        curVars.调教进度.媚药与发情毒 = "高浓度催情媚药发作中";
                        dispatchDirectorActionToChat(`*给${u}喂下了高浓度强效催情媚药（当前毒瘾升至${curVars.精神与心理.媚药精液毒瘾}%），令其浑身肌肤滚烫泛红，私处不受控制地涌出大量透明淫水*`);
                        showToast("🧪 已喂食强效催情媚药！性欲与毒瘾大幅飙升！", "warn");
                    } else if (act === "toy") {
                        const hasToyNow = curVars.体内道具与权限.体内道具 && curVars.体内道具与权限.体内道具 !== "无";
                        if (hasToyNow) {
                            curVars.体内道具与权限.体内道具 = "无";
                            dispatchDirectorActionToChat(`*从${u}湿烂敏感的穴内拔出了还在嗡嗡震动的体内道具，带出一股粘稠拉丝的爱液*`);
                            showToast("🎛️ 已拔出体内震动道具！", "info");
                        } else {
                            curVars.体内道具与权限.体内道具 = "全功率高频震动无线跳蛋与扩穴假阳具";
                            curVars.精神与心理.快感累积 = Math.min(userSettings.edgingLockActive ? 99 : 100, safeNum(curVars.精神与心理.快感累积) + 22);
                            dispatchDirectorActionToChat(`*将一枚全功率高频震动的无线跳蛋与粗大仿真假阳具狠狠塞入${u}敏感的蜜穴深处死死抵住宫口，强烈的嗡鸣震得她双腿发软站立不稳*`);
                            showToast("🎛️ 已塞入高频震动跳蛋与假阳具（已同步至下一轮正文）！", "warn");
                        }
                    } else if (act === "tattoo") {
                        const hasTatNow = curVars.痕迹与标记.淫纹与刻印 && curVars.痕迹与标记.淫纹与刻印 !== "无";
                        if (hasTatNow) {
                            curVars.痕迹与标记.淫纹与刻印 = "无";
                            dispatchDirectorActionToChat(`*隐去了${u}下腹皮肤上的发光催情淫纹*`);
                            showToast("🔮 已隐去下腹淫纹", "info");
                        } else {
                            curVars.痕迹与标记.淫纹与刻印 = "下腹盛开的紫红发光魅魔立体淫纹";
                            curVars.核心数值.性欲程度 = Math.min(100, safeNum(curVars.核心数值.性欲程度) + 20);
                            dispatchDirectorActionToChat(`*在${u}平坦的小腹肚脐下方烙印上了一道妖异发光的紫红色魅魔催情淫纹，纹路随心跳一明一暗搏动，将子宫与私处的敏感度强行放大十倍*`);
                            showToast("🔮 已在小腹烙印发光催情淫纹（已同步至下一轮正文）！", "warn");
                        }
                    } else if (act === "edit_ledger") {
                        let lModal = document.getElementById("st-ledger-edit-modal");
                        if (!lModal) {
                            lModal = document.createElement("div");
                            lModal.id = "st-ledger-edit-modal";
                            lModal.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.84);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:12px;";
                            document.body.appendChild(lModal);
                        }
                        const cNow = curVars.计数 || {}, spNow = curVars.体内精液存量 || {};
                        const fields = [
                            ["vag", "🌺 小穴贯穿(次)", safeNum(cNow.性交?.小穴)],
                            ["creampie", "💦 无套内射(次)", safeNum(cNow.射精?.内射)],
                            ["mouth", "👄 深喉口交(次)", safeNum(cNow.性交?.口)],
                            ["swallow", "🥛 吞精次数(次)", safeNum(cNow.精液摄入?.吞精次数)],
                            ["anal", "🕳️ 后庭肛交(次)", safeNum(cNow.性交?.屁眼)],
                            ["tit", "🍒 乳交奉侍(次)", safeNum(cNow.性交?.乳穴)],
                            ["org", "⚡ 绝顶高潮(次)", safeNum(cNow.高潮?.总数)],
                            ["squirt", "⛲ 潮吹喷水(次)", safeNum(cNow.失控?.喷潮)],
                            ["leak", "💧 失禁漏尿(次)", safeNum(cNow.失控?.失禁)],
                            ["gang", "👥 多人轮奸(次)", safeNum(cNow.交易?.轮奸群交)],
                            ["wombMl", "🫀 宫腔储精(ml)", safeNum(spNow.子宫毫升)],
                            ["vagMl", "🌺 小穴储精(ml)", safeNum(spNow.小穴毫升)],
                            ["mouthMl", "👄 胃袋储精(ml)", safeNum(spNow.口内毫升)],
                            ["analMl", "🕳️ 直肠储精(ml)", safeNum(spNow.屁眼毫升)]
                        ];
                        lModal.innerHTML = `
                            <div style="background:linear-gradient(160deg,#27153b,#0d0618);border:2px solid #fde047;border-radius:15px;padding:14px;width:92vw;max-width:430px;max-height:86vh;overflow-y:auto;color:#fff;box-shadow:0 20px 60px #000;">
                                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:8px;margin-bottom:10px;">
                                    <b style="color:#fde047;font-size:13.5px;">🔢 自由手改【${u}】总账次数与四穴储精量</b>
                                    <button id="st-lem-close" type="button" style="background:#ff003c;color:#fff;border:none;border-radius:6px;padding:2px 9px;cursor:pointer;font-weight:bold;">✕</button>
                                </div>
                                <div style="font-size:10.5px;color:#fbcfe8;margin-bottom:8px;">💡 修改下方次数后，状态栏将自动重算六孔崩坏度、解锁对应下流性癖，并同步至下一轮 AI 正文（也可将被误判虚高的次数改回 0）：</div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:12px;">
                                    ${fields.map(([k, lbl, val]) => `
                                        <div style="background:rgba(0,0,0,0.45);border:1px solid rgba(244,114,182,0.3);border-radius:8px;padding:5px 8px;display:flex;justify-content:space-between;align-items:center;gap:4px;">
                                            <span style="font-size:11px;color:#e2e8f0;white-space:nowrap;">${lbl}</span>
                                            <input type="number" min="0" max="99999" class="st-lem-inp" data-k="${k}" value="${val}" style="width:62px;background:#111;color:#fde047;border:1px solid #fde047;border-radius:5px;padding:2px 5px;font-size:12px;font-weight:bold;text-align:right;">
                                        </div>
                                    `).join("")}
                                </div>
                                <div style="display:flex;justify-content:space-between;gap:8px;">
                                    <button type="button" id="st-lem-zero-all" style="background:rgba(225,29,72,0.25);color:#fda4af;border:1px solid #e11d48;border-radius:8px;padding:7px 10px;font-size:11.5px;cursor:pointer;">🧹 全部清零</button>
                                    <button type="button" id="st-lem-save" style="flex:1;background:linear-gradient(135deg,#fde047,#f59e0b);color:#111;border:none;border-radius:8px;padding:7px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">💾 保存并重算全身状态</button>
                                </div>
                            </div>
                        `;
                        lModal.style.display = "flex";
                        lModal.querySelector("#st-lem-close").onclick = () => { lModal.style.display = "none"; };
                        lModal.onclick = (e) => { if (e.target === lModal) lModal.style.display = "none"; };
                        lModal.querySelector("#st-lem-zero-all").onclick = () => {
                            lModal.querySelectorAll(".st-lem-inp").forEach(inp => { inp.value = "0"; });
                        };
                        lModal.querySelector("#st-lem-save").onclick = () => {
                            const vals = {};
                            lModal.querySelectorAll(".st-lem-inp").forEach(inp => {
                                vals[inp.getAttribute("data-k")] = Math.max(0, parseInt(inp.value, 10) || 0);
                            });
                            curVars.计数.性交.小穴 = vals.vag;
                            curVars.计数.射精.内射 = vals.creampie;
                            curVars.计数.性交.口 = vals.mouth;
                            curVars.计数.精液摄入.吞精次数 = vals.swallow;
                            curVars.计数.精液摄入.累计毫升 = vals.swallow * 15;
                            curVars.计数.性交.屁眼 = vals.anal;
                            curVars.计数.性交.乳穴 = vals.tit;
                            curVars.计数.高潮.总数 = vals.org;
                            curVars.计数.失控.喷潮 = vals.squirt;
                            curVars.计数.失控.失禁 = vals.leak;
                            curVars.计数.交易.轮奸群交 = vals.gang;
                            curVars.体内精液存量.子宫毫升 = vals.wombMl;
                            curVars.体内精液存量.小穴毫升 = vals.vagMl;
                            curVars.体内精液存量.口内毫升 = vals.mouthMl;
                            curVars.体内精液存量.屁眼毫升 = vals.analMl;

                            const curLenNow = safeCtx()?.chat?.length || 0;
                            const totalMlNew = vals.wombMl + vals.vagMl + vals.mouthMl + vals.analMl;
                            curVars.已手动清空精液 = (totalMlNew === 0);
                            curVars.手动精液调整楼层 = curLenNow;
                            curVars.手动精液基准楼层 = curLenNow;
                            curVars.手动精液基准快照 = JSON.parse(JSON.stringify(curVars.体内精液存量));
                            curVars.手动总账基准楼层 = curLenNow;
                            curVars.手动总账基准快照 = JSON.parse(JSON.stringify(curVars.计数));
                            // 清空旧的历史最高崩坏度锁，让新的总账次数立即重新演算真实的六孔崩坏度！
                            curVars.历史最高崩坏度 = {};
                            if (totalMlNew === 0) curVars.上次清洗楼层 = curLenNow;

                            _organDevCache = { sig: "", res: null };
                            saveChatCache(curVars);
                            latestStatus = getFallbackData();
                            renderBody();
                            lModal.style.display = "none";
                            queueSilentChangeForNextTurn(`【${u}】的肉体经验总账与体内储精量已更新为：小穴贯穿${vals.vag}次、内射${vals.creampie}次、口交${vals.mouth}次、后庭${vals.anal}次、高潮${vals.org}次，当前宫腔储精${vals.wombMl}ml、小穴储精${vals.vagMl}ml、胃袋${vals.mouthMl}ml、直肠${vals.analMl}ml`);
                            showToast("✅ 总账次数与四穴储精量已精准锁定（改大改小均永久生效），全身崩坏阶位已重新演算！", "success", 3200);
                        };
                        return;
                    } else if (act === "preview_prompt") {
                        const fullRules = buildFullSystemPrompt(u, curVars);
                        showTagDetailPopover(
                            `👁️ 实时注入给 AI 的后台同步铁律 (${u})`,
                            userSettings.compactPromptMode ? "精简高敏模式" : "全量完整模式",
                            `每当你在酒馆发送消息时，状态栏会在后台自动将下方铁律注入给 AI，强制 AI 的正文描写与当前六孔阶位、储精量及你的导演台操作 100% 同步。`,
                            fullRules.replace(/\n+/g, " ｜ ").slice(0, 680) + "...",
                            "所有在状态栏点击的调教按钮都已经加入最高优先级同步队列啦！"
                        );
                        try { navigator.clipboard.writeText(fullRules); showToast("📋 已弹出预览并将完整 AI 同步铁律复制到剪贴板！", "success", 2800); } catch (e) {}
                        return;
                    }
                    saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                };
            });

            const cardsWrap = bodyEl.querySelector("#st-cards-container");
            (curCatObj?.items || []).forEach(item => {
                const card = document.createElement("div");
                const realStg = getItemRealStageNum(item, curVars);
                const t = realStg - 1;
                const lvCls = t === 5 ? " st-corrupted-card-lv6" : (t === 4 ? " st-corrupted-card-lv5" : "");
                card.className = `st-v28-card${userSettings.compactCards ? " st-compact-card" : ""}${lvCls}`;
                card.style.cssText = `background:${tc.card};border:${tc.cardBorder};border-radius:14px;padding:10px 12px;cursor:pointer;display:flex;gap:10px;align-items:center;`;

                const parts = safeStr(item.desc).split("💭");
                const previewObj = safeStr(parts[0]).replace(/【.*?】：/g, "").replace(/\n+/g, " ").trim().slice(0, 62);
                const previewThought = parts[1] ? cleanThoughtText(parts[1].replace(/【.*?实时心声】：/g, "")).slice(0, 52) : "";

                card.innerHTML = `
                    <div class="st-card-thumb-wrap" style="display:none;width:68px;height:68px;flex-shrink:0;border-radius:10px;overflow:hidden;border:1.5px solid ${tc.prim};background:#090510;position:relative;">
                        <img style="width:100%;height:100%;object-fit:cover;display:block;" alt="thumb">
                    </div>
                    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;">
                        ${item.keyHTML}
                        ${item.barHTML || ""}
                        <div class="st-card-preview" style="font-size:11.5px;color:#cbd5e1;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${previewObj}</div>
                        ${previewThought ? `<div class="st-card-preview" style="font-size:11px;color:#fbcfe8;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">💭 “${previewThought}...”</div>` : ""}
                    </div>
                `;
                bindCardThumbnailElement(card.querySelector(".st-card-thumb-wrap"), item);

                const allTagSpans = Array.from(card.querySelectorAll("span")).filter(sp => {
                    const st = sp.getAttribute("style") || "";
                    const cls = sp.className || "";
                    return cls.includes("st-emo-") || cls.includes("st-stage") || st.includes("border-radius:6px") || st.includes("border-radius: 6px");
                });

                allTagSpans.forEach(tagEl => {
                    const tagTxt = tagEl.textContent.trim();
                    if (!tagTxt) return;
                    tagEl.classList.add("st-tag-pressable", "st-card-badge-stop");
                    tagEl.style.position = "relative";
                    tagEl.style.zIndex = "5";

                    const fullObjDesc = safeStr(parts[0]).replace(/【.*?】：/g, "").trim();
                    tagEl.onclick = (ev) => {
                        ev.stopPropagation();
                        ev.stopImmediatePropagation();
                        ev.preventDefault();
                        if (Date.now() - __stPopoverCloseCooldown < 600) return;
                        playSynthSound("squelch");
                        showTagDetailPopover(
                            `🏷️ ${item.cleanTitle || item.editKey} · 「${tagTxt}」`,
                            tagTxt,
                            `由【${item.cleanTitle || item.editKey}】当前累计开发次数、体液灌注量与器质崩坏度（第 ${realStg} 阶）实时演算生成的生理标签。`,
                            fullObjDesc || "该状态已在后台静默同步给 AI，正文中会自动体现对应的生理与外貌细节。",
                            previewThought || "身体深处正随着这个状态发生难以自控的变化💦……"
                        );
                    };
                });

                card.onclick = (e) => {
                    if (Date.now() - __stPopoverCloseCooldown < 600) return;
                    if (e.target.closest(".st-card-badge-stop, .st-tag-pressable, .st-card-thumb-wrap")) return;
                    playSynthSound("squelch");
                    showDetailPopup(item);
                };
                cardsWrap.appendChild(card);
            });
        }

        function scrubRawBlocksFromChatDOM(forceAll = false) {
            if (!userSettings.enabled || !userSettings.hideRawBlock) return;
            if (isGeneratingImageBusy && !forceAll) return;
            const allBlocks = document.querySelectorAll("#chat .mes_text");
            const mesBlocks = forceAll ? Array.from(allBlocks) : Array.from(allBlocks).slice(-5);
            const hashStr = "image" + "###";
            const imgTagOpen = "<" + "image>";
            const regStageBlockHtml = new RegExp("(?:<p>|<br\\\\s*/?>|\\\\n|\\\\s)*第[一二三四五六1-6]阶段：[^\\\\n<]*(?:<br\\\\s*/?>|\\\\n|\\\\s)*(?:(?:&lt;image&gt;|<" + "image>)[\\\\s\\\\S]*?(?:&lt;/image&gt;|</" + "image>))?(?:</p>)?", "gi");
            const regImgBlockHtml = new RegExp("(?:&lt;image&gt;|<" + "image>)[\\\\s\\\\S]*?(?:&lt;/image&gt;|</" + "image>)", "gi");
            const regHashHtml = new RegExp("image" + "###[\\\\s\\\\S]*?###", "gi");

            mesBlocks.forEach(el => {
                const rawHtml = el.innerHTML;
                if (!rawHtml) return;
                const sig = `${rawHtml.length}_${isGeneratingImageBusy}`;
                if (!forceAll && el.getAttribute("data-st-scrub-sig") === sig) return;

                if (rawHtml.includes("UpdateVariable") || rawHtml.includes("状态快照】") || rawHtml.includes("_.set(") || rawHtml.includes("_.add(") || rawHtml.includes("&lt;image&gt;") || rawHtml.includes(imgTagOpen) || rawHtml.includes(hashStr) || /第[一二三四五六1-6]阶段：/.test(rawHtml)) {
                    const parasites = isGeneratingImageBusy ? Array.from(el.querySelectorAll(".st-zhj-parasite-box, .st-zhj-hidden-node")) : [];
                    parasites.forEach(p => p.remove());

                    let curHtml = el.innerHTML;
                    let cleaned = curHtml
                        .replace(/【状态快照】[^\n<]*(?:<br\s*\/?>|\n)?/gi, "")
                        .replace(/\[系统后台只读状态参考[^\]]*\](?:<br\s*\/?>|\n)?/gi, "")
                        .replace(/&lt;UpdateVariable&gt;[\s\S]*?&lt;\/UpdateVariable&gt;/gi, "")
                        .replace(/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "")
                        .replace(/(?:<p>|<br\s*\/?>|\n|\s)*_\.(?:set|add)\s*\(\s*(?:['"`]|&quot;|&#39;)[\s\S]*?\)\s*;?(?:<\/p>|<br\s*\/?>|\n)?/gi, "")
                        .replace(regStageBlockHtml, "")
                        .replace(regImgBlockHtml, "")
                        .replace(regHashHtml, "")
                        .replace(/\[纯局部[^\]]*\]/gi, "");

                    if (cleaned !== curHtml) el.innerHTML = cleaned;
                    parasites.forEach(p => el.appendChild(p));
                }
                el.setAttribute("data-st-scrub-sig", `${el.innerHTML.length}_${isGeneratingImageBusy}`);
            });

            if (!isGeneratingImageBusy) {
                try {
                    const chatArr = safeCtx()?.chat || [];
                    const startIdx = forceAll ? 0 : Math.max(0, chatArr.length - 3);
                    const regRawStage = /\n*第[一二三四五六1-6]阶段：[^\n<]*\s*\x3cimage>[\s\S]*?\x3c\/image>/gi;
                    const regRawImg = /\n*\x3cimage>[\s\S]*?\x3c\/image>/gi;
                    for (let i = startIdx; i < chatArr.length; i++) {
                        const m = chatArr[i];
                        if (m && typeof m.mes === "string" && (/第[一二三四五六1-6]阶段：/.test(m.mes) || m.mes.includes(hashStr) || m.mes.includes(imgTagOpen))) {
                            m.mes = m.mes
                                .replace(regRawStage, "")
                                .replace(regRawImg, "")
                                .replace(regHashHtml, "");
                        }
                    }
                } catch (e) {}
            }
        }

        let savedLiveClothDurability = null;

        function syncFromLatestChat(forceFloor = null) {
            if (!userSettings.enabled) return;
            if (isGeneratingImageBusy && forceFloor === null) return;
            scrubRawBlocksFromChatDOM(false);
            const ctx = safeCtx(), chat = ctx?.chat || [];

            const prevViewingFloor = viewingHistoryFloor;
            viewingHistoryFloor = (forceFloor !== null && forceFloor !== undefined && !Number.isNaN(Number(forceFloor)))
                ? Math.max(0, Math.min(chat.length - 1, Number(forceFloor)))
                : null;

            const cached = loadChatCache();

            if (!cached && viewingHistoryFloor === null) {
                userSettings.hypnoTriggers = [];
                userSettings.parasiteState = { type: "无寄生", lv: 0, eggCount: 0 };
                userSettings.objectificationId = "free";
                userSettings.edgingLockActive = false;
                userSettings.clothDurability = 100;
            }

            if (!chat.length) {
                curVars = getInitialVars();
                if (cached) mergeUserCustomizations(curVars, cached, 0);
                latestStatus = getFallbackData();
                renderBody();
                return;
            }

            const freshVars = getInitialVars();

            if (cached) {
                const snap = cached.快照 || {};
                if (typeof snap.上次清洗楼层 === "number") {
                    freshVars.上次清洗楼层 = snap.上次清洗楼层;
                }
                if (typeof snap.角色创世楼层 === "number") {
                    freshVars.角色创世楼层 = snap.角色创世楼层;
                }
                if (typeof snap.手动总账基准楼层 === "number" && snap.手动总账基准快照) {
                    freshVars.手动总账基准楼层 = snap.手动总账基准楼层;
                    freshVars.手动总账基准快照 = JSON.parse(JSON.stringify(snap.手动总账基准快照));
                }
                if (typeof snap.手动精液基准楼层 === "number" && snap.手动精液基准快照) {
                    freshVars.手动精液基准楼层 = snap.手动精液基准楼层;
                    freshVars.手动精液基准快照 = JSON.parse(JSON.stringify(snap.手动精液基准快照));
                }
                if (snap.已手动清空精液) {
                    freshVars.已手动清空精液 = true;
                }
                if (Array.isArray(snap.已删除角色列表)) {
                    freshVars.已删除角色列表 = [...snap.已删除角色列表];
                }
                if (cached.角色独立槽位 && typeof cached.角色独立槽位 === "object") {
                    freshVars.角色独立槽位 = {};
                    Object.entries(cached.角色独立槽位).forEach(([rk, rv]) => {
                        if (isValidCharacterName(rk) && rv && typeof rv === "object") freshVars.角色独立槽位[rk] = JSON.parse(JSON.stringify(rv));
                    });
                }
                const extState = cached.玩法扩展状态 || snap.玩法扩展状态;
                if (viewingHistoryFloor === null && extState && typeof extState === "object") {
                    if (savedLiveClothDurability !== null) {
                        userSettings.clothDurability = savedLiveClothDurability;
                        savedLiveClothDurability = null;
                    }
                    userSettings.hypnoTriggers = Array.isArray(extState.hypnoTriggers) ? [...extState.hypnoTriggers] : [];
                    userSettings.parasiteState = extState.parasiteState ? { ...extState.parasiteState } : { type: "无寄生", lv: 0, eggCount: 0 };
                    userSettings.objectificationId = extState.objectificationId || "free";
                    userSettings.edgingLockActive = Boolean(extState.edgingLockActive);
                    userSettings.clothDurability = safeNum(extState.clothDurability, 100);
                }
                if (cached.手动锁定真名) {
                    freshVars.档案.手动锁定真名 = cached.手动锁定真名;
                    freshVars.档案.当前认知名字 = cached.手动锁定真名;
                }
                if (cached.快照?.档案?.手动锁死外貌Flag && cached.锁定外貌DNA) {
                    freshVars.档案.手动锁死外貌Flag = true;
                    freshVars.档案.锁定外貌DNA = cached.锁定外貌DNA;
                    freshVars.档案.当前提取形象摘要 = cached.快照.档案.当前提取形象摘要 || summarizeDnaTagsToChinese(cached.锁定外貌DNA);
                }
                const isFloorDeleted = (typeof cached.floorLen === "number" && cached.floorLen > chat.length);
                if (viewingHistoryFloor === null && cached.历史最高崩坏度 && !isFloorDeleted) {
                    freshVars.历史最高崩坏度 = { ...cached.历史最高崩坏度 };
                }
            }

            const maxLen = viewingHistoryFloor !== null ? Math.min(chat.length, viewingHistoryFloor + 1) : chat.length;
            const startScanFloor = (viewingHistoryFloor === null && typeof freshVars.角色创世楼层 === "number" && freshVars.角色创世楼层 <= maxLen)
                ? freshVars.角色创世楼层
                : 0;

            const ledgerBaseFloor = (viewingHistoryFloor === null && typeof freshVars.手动总账基准楼层 === "number" && freshVars.手动总账基准楼层 <= maxLen)
                ? freshVars.手动总账基准楼层 : -1;
            const semenBaseFloor = (viewingHistoryFloor === null && typeof freshVars.手动精液基准楼层 === "number" && freshVars.手动精液基准楼层 <= maxLen)
                ? freshVars.手动精液基准楼层 : -1;

            for (let i = startScanFloor; i < maxLen; i++) {
                // 当扫描到达玩家手改总账或手改精液的基准楼层时，直接重置为玩家手改的基准快照，后续新楼层在此基础上继续累加！
                if (i === ledgerBaseFloor && freshVars.手动总账基准快照) {
                    freshVars.计数 = JSON.parse(JSON.stringify(freshVars.手动总账基准快照));
                }
                if (i === semenBaseFloor && freshVars.手动精液基准快照) {
                    freshVars.体内精液存量 = JSON.parse(JSON.stringify(freshVars.手动精液基准快照));
                }
                const mesText = safeStr(chat[i]?.mes);
                if (!mesText) continue;
                const prevTotalMl = safeNum(freshVars.体内精液存量?.子宫毫升) + safeNum(freshVars.体内精液存量?.小穴毫升) + safeNum(freshVars.体内精液存量?.口内毫升) + safeNum(freshVars.体内精液存量?.屁眼毫升);
                const hasSet = parseSetCommands(mesText, freshVars);
                applyNaturalMetabolism(mesText, freshVars, hasSet, i === maxLen - 1, i);
                const afterTotalMl = safeNum(freshVars.体内精液存量?.子宫毫升) + safeNum(freshVars.体内精液存量?.小穴毫升) + safeNum(freshVars.体内精液存量?.口内毫升) + safeNum(freshVars.体内精液存量?.屁眼毫升);
                // 只有在严格晚于清洗楼层的新楼层（i >= 上次清洗楼层，而清洗时记录的是当时的 chat.length）真正新增了精液，才解除已清洗锁
                if (typeof freshVars.上次清洗楼层 === "number" && i >= freshVars.上次清洗楼层 && afterTotalMl > prevTotalMl) {
                    freshVars.已手动清空精液 = false;
                }
            }
            if (ledgerBaseFloor === maxLen && freshVars.手动总账基准快照) {
                freshVars.计数 = JSON.parse(JSON.stringify(freshVars.手动总账基准快照));
            }
            if (semenBaseFloor === maxLen && freshVars.手动精液基准快照) {
                freshVars.体内精液存量 = JSON.parse(JSON.stringify(freshVars.手动精液基准快照));
            }

            if (viewingHistoryFloor === null && cached) {
                const snap = cached.快照 || {};
                mergeUserCustomizations(freshVars, cached, chat.length);

                if (freshVars.已手动清空精液) {
                    freshVars.体内精液存量 = { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 };
                }
                if (Array.isArray(snap.待同步场外变动) && snap.待同步场外变动.length > 0) {
                    freshVars.待同步场外变动 = [...snap.待同步场外变动];
                }
            } else if (viewingHistoryFloor !== null) {
                if (prevViewingFloor === null) savedLiveClothDurability = userSettings.clothDurability;
                if (cached?.按钮详情) {
                    freshVars.按钮详情 = {};
                    for (const [bk, bObj] of Object.entries(cached.按钮详情)) {
                        if (!bObj || typeof bObj !== "object") continue;
                        freshVars.按钮详情[bk] = { ...bObj, forceLatestImg: "", imgUrl: "" };
                    }
                }
                if (Array.isArray(cached?.专属相册)) freshVars.专属相册 = [...cached.专属相册];
                calibrateMentalMetrics(freshVars);
                const histCorr = safeNum(freshVars.核心数值?.淫乱恶堕, 0);
                userSettings.clothDurability = histCorr < 15 ? 100 : Math.max(20, 100 - histCorr);
            }

            calibrateMentalMetrics(freshVars);
            curVars = normalizeVarsStructure(freshVars);

            // 🧬 物种形态突变自动感知锁：如果主角在中途变形（如从人类变成了美女蛇/触手怪/史莱姆），自动解除本局按钮上挂载的旧物种冲突视图！
            const uNow = detectProtagonistName(curVars);
            const latestDnaNow = getLockedAppearanceTags(uNow, curVars);
            const latestSpSigNow = getFullMorphFormSignature(latestDnaNow);
            const prevSpSig = cached?.快照?.档案?._lastSpeciesSig || "";
            if (curVars.档案) curVars.档案._lastSpeciesSig = latestSpSigNow;

            // ★ 当检测到主角在正文里发生了物种形态突变（含跨鬼怪变身、变植物娘、或变回普通人类），全自动清空旧形态的图片与旧文字描述缓存！
            if (prevSpSig && prevSpSig !== latestSpSigNow && viewingHistoryFloor === null) {
                _dynCtxCache = { sig: "", res: null };
                _appearMemoCache = { sig: "", res: null };
                if (curVars.按钮详情 && typeof curVars.按钮详情 === "object") {
                    Object.keys(curVars.按钮详情).forEach(k => {
                        delete curVars.按钮详情[k].forceLatestImg;
                        delete curVars.按钮详情[k].imgUrl;
                        delete curVars.按钮详情[k].stageImgs;
                        delete curVars.按钮详情[k].stageImgList;
                        if (!userSettings.pinnedItems?.[k]) {
                            delete curVars.按钮详情[k].desc;
                            delete curVars.按钮详情[k].thought;
                            delete curVars.按钮详情[k].stage;
                        }
                    });
                }
                const prefixToClear = normalizeImgKey(`${getChatStoreKey().replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_").slice(-32)}_${uNow}_`);
                for (const memK of Array.from(importedImgCache.keys())) {
                    if (memK.startsWith(prefixToClear)) {
                        importedImgCache.delete(memK);
                        dbKeyIndexSet.delete(memK);
                    }
                }
                Object.keys(partRandomOffsetMap).forEach(k => delete partRandomOffsetMap[k]);
                showToast(`🧬 检测到【${uNow}】形态已切换为「${curVars.档案?.当前提取形象摘要 || (latestSpSigNow === "human" ? "普通人类" : latestSpSigNow)}」，所有按钮描述与配图已自动同步！`, "info", 3200);
            }
           
            if (viewingHistoryFloor === null) {
                saveChatCache(curVars, chat.length);
                computeAndShowDeltaToast(curVars);
            }

            latestStatus = getFallbackData();
            renderBody();
            setTimeout(() => scrubRawBlocksFromChatDOM(false), 150);

            const u = detectProtagonistName(curVars);
            if (userSettings.autoGenEveryChange && forceFloor === null) {
                const allCandidates = [];
                (latestStatus.categories || []).forEach(cat => {
                    (cat.items || []).forEach(it => {
                        if (it.editKey && userSettings.autoGenItemMap?.[it.editKey]) allCandidates.push(it);
                    });
                });
                const chosenItem = (allCandidates.length ? allCandidates[(chat.length - 1) % allCandidates.length] : null) || latestStatus.categories?.[3]?.items?.[2] || latestStatus.categories?.[0]?.items?.[5];
                if (chosenItem) {
                    const realStageIdx = getItemRealStageNum(chosenItem, curVars);
                    silentBackgroundGenerateImage(chosenItem, realStageIdx, u, null);
                }
            } else {
                checkAndQueueMajorChangeAutoGen(latestStatus.categories, u);
            }
        }

        function applyEdgeDockStyle(btn) {
            if (!btn) return;
            const winW = window.innerWidth;
            const rect = btn.getBoundingClientRect();
            const curX = parseFloat(btn.style.left) || rect.left || 0;
            if (!userSettings.autoDockEdge) {
                btn.style.opacity = "1";
                btn.style.transform = "translateX(0px)";
                return;
            }
            const btnW = btn.offsetWidth || 48;
            if (curX <= 22) {
                userSettings.btnX = 0;
                btn.style.left = "0px";
                btn.style.transform = `translateX(-${Math.round(btnW * 0.52)}px)`;
                btn.style.opacity = "0.62";
            } else if (curX + btnW >= winW - 22) {
                userSettings.btnX = winW - btnW;
                btn.style.left = (winW - btnW) + "px";
                btn.style.transform = `translateX(${Math.round(btnW * 0.52)}px)`;
                btn.style.opacity = "0.62";
            } else {
                btn.style.transform = "translateX(0px)";
                btn.style.opacity = "1";
            }
        }

        function makeDraggable(handleEl, targetEl, onSavePos, isFloatingBall = false) {
            let startX = 0, startY = 0, initLeft = 0, initTop = 0, moved = false, dragging = false;
            handleEl.style.touchAction = "none";

            const onStart = (cx, cy, pointerId = null) => {
                dragging = true;
                moved = false;
                startX = cx; startY = cy;
                const rect = targetEl.getBoundingClientRect();
                initLeft = rect.left; initTop = rect.top;
                if (isFloatingBall) {
                    targetEl.style.transition = "none";
                    targetEl.style.transform = "translateX(0px)";
                    targetEl.style.opacity = "1";
                }
                if (pointerId !== null && handleEl.setPointerCapture) {
                    try { handleEl.setPointerCapture(pointerId); } catch (e) {}
                }
            };
            const onMove = (cx, cy) => {
                if (!dragging) return;
                const dx = cx - startX, dy = cy - startY;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
                if (!moved) return;
                const w = targetEl.offsetWidth || 48;
                const nx = Math.max(0, Math.min(window.innerWidth - w, initLeft + dx));
                const ny = Math.max(0, Math.min(window.innerHeight - 48, initTop + dy));
                targetEl.style.left = nx + "px";
                targetEl.style.top = ny + "px";
                onSavePos(nx, ny);
            };
            const onEnd = () => {
                if (!dragging) return;
                dragging = false;
                if (isFloatingBall) {
                    targetEl.style.transition = "transform 0.25s ease, opacity 0.25s ease, left 0.2s ease";
                    applyEdgeDockStyle(targetEl);
                }
                if (moved) saveSettings();
            };

            handleEl.addEventListener("pointerdown", (e) => {
                if (!isFloatingBall && e.target.closest("button, input, select, textarea")) return;
                onStart(e.clientX, e.clientY, e.pointerId);
            });
            window.addEventListener("pointermove", (e) => { if (dragging) onMove(e.clientX, e.clientY); });
            window.addEventListener("pointerup", onEnd);
            window.addEventListener("pointercancel", onEnd);

            handleEl.addEventListener("touchstart", (e) => {
                if (!isFloatingBall && e.target.closest("button, input, select, textarea")) return;
                if (e.touches[0]) onStart(e.touches[0].clientX, e.touches[0].clientY);
            }, { passive: true });
            handleEl.addEventListener("touchmove", (e) => {
                if (!dragging || !e.touches[0]) return;
                e.preventDefault();
                onMove(e.touches[0].clientX, e.touches[0].clientY);
            }, { passive: false });
            handleEl.addEventListener("touchend", onEnd);

            return () => moved;
        }

        function ensureUI() {
            if (document.getElementById("st-v5-root")) return;
            injectCustomStyles();
            const root = document.createElement("div");
            root.id = "st-v5-root";
            root.style.display = userSettings.enabled ? "block" : "none";
            root.innerHTML = `
                <button id="st-v5-toggle" type="button" title="打开状态栏 1.0" style="position:fixed;left:${userSettings.btnX}px;top:${userSettings.btnY}px;z-index:2147483640;width:48px;height:48px;border-radius:50%;border:2px solid #fff;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;touch-action:none;user-select:none;-webkit-user-select:none;">💗</button>
                <div id="st-v5-panel" style="position:fixed;left:${userSettings.panelX}px;top:${userSettings.panelY}px;z-index:2147483641;display:none;flex-direction:column;overflow:hidden;">
                    <div id="st-v5-header" style="padding:7px 10px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:5px;cursor:move;user-select:none;touch-action:none;border-bottom:1px solid rgba(255,255,255,0.14);box-sizing:border-box;width:100%;">
                        <div id="st-v5-title" style="font-weight:bold;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:110px;">✨ 状态栏 1.0</div>
                        <div style="display:flex;align-items:center;justify-content:flex-end;gap:3px;flex-wrap:wrap;max-width:100%;">
                            <button id="st-hdr-undo" type="button" title="撤回上一步状态修改" style="background:rgba(255,255,255,0.12);color:#a6e3a1;border:none;border-radius:6px;padding:3px 6px;font-size:10.5px;cursor:pointer;">↩️撤回</button>
                            <button id="st-hdr-prev" type="button" title="回溯上一层" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:6px;padding:3px 6px;font-size:10.5px;cursor:pointer;">◀</button>
                            <button id="st-hdr-now" type="button" title="回到实时最新层" style="background:rgba(255,255,255,0.12);color:#fde047;border:none;border-radius:6px;padding:3px 6px;font-size:10.5px;font-weight:bold;cursor:pointer;">实时</button>
                            <button id="st-hdr-cg" type="button" title="打开本局抓拍与永恒收藏夹" style="background:rgba(255,255,255,0.12);color:#fbcfe8;border:none;border-radius:6px;padding:3px 6px;font-size:10.5px;cursor:pointer;">📸相册</button>
                            <button id="st-hdr-grid" type="button" title="切换单列 / 双列并排宽屏画廊视图" style="background:rgba(255,255,255,0.12);color:#67e8f9;border:none;border-radius:6px;padding:3px 6px;font-size:10.5px;cursor:pointer;">🗖视图</button>
                            <button id="st-hdr-cfg" type="button" title="打开设置与补丁中心" style="background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:6px;padding:3px 6px;font-size:10.5px;cursor:pointer;">⚙️设置</button>
                            <button id="st-hdr-close" type="button" title="最小化收起" style="background:#ff003c;color:#fff;border:1.5px solid #ffe4e6;border-radius:7px;padding:3px 9px;font-size:12px;font-weight:bold;cursor:pointer;box-shadow:0 0 8px rgba(255,0,60,0.75);margin-left:2px;flex-shrink:0;">✕</button>
                        </div>
                    </div>
                    <div id="st-v5-layout-wrap">
                        <div id="st-v5-tabs"></div>
                        <div id="st-v5-body"></div>
                    </div>
                    <div id="st-v5-resizer" title="按住拖拽可自由调整状态栏窗口大小" style="position:absolute;right:0;bottom:0;width:18px;height:18px;cursor:nwse-resize;z-index:20;background:linear-gradient(135deg,transparent 50%,rgba(244,114,182,0.75) 50%);border-bottom-right-radius:12px;touch-action:none;"></div>
                </div>
                <div id="st-v5-modal" style="position:fixed;inset:0;z-index:2147483645;background:rgba(0,0,0,0.78);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:12px;">
                    <div class="st-modal-box" style="width:100%;max-width:480px;max-height:86vh;overflow-y:auto;border-radius:16px;padding:14px;box-sizing:border-box;"></div>
                </div>
            `;
            document.body.appendChild(root);
            applyThemeAndSize();

            const toggleBtn = document.getElementById("st-v5-toggle"), panel = document.getElementById("st-v5-panel"), header = document.getElementById("st-v5-header"), bodyArea = document.getElementById("st-v5-body");
            const wasBtnDragged = makeDraggable(toggleBtn, toggleBtn, (x, y) => { userSettings.btnX = x; userSettings.btnY = y; }, true);
            makeDraggable(header, panel, (x, y) => { userSettings.panelX = x; userSettings.panelY = y; }, false);
            applyEdgeDockStyle(toggleBtn);
            window.addEventListener("resize", () => applyEdgeDockStyle(toggleBtn));

            let swipeStartX = 0, swipeStartY = 0, swipeIgnoreFlag = false;
            bodyArea.addEventListener("touchstart", (e) => {
                if (e.target && e.target.closest("input, textarea, select, .st-horiz-scroll-strip, .st-buff-strip, #st-xray-svg-canvas")) {
                    swipeIgnoreFlag = true;
                    return;
                }
                swipeIgnoreFlag = false;
                if (e.touches[0]) { swipeStartX = e.touches[0].clientX; swipeStartY = e.touches[0].clientY; }
            }, { passive: true });
            bodyArea.addEventListener("touchend", (e) => {
                if (swipeIgnoreFlag || isSettingsOpen || !e.changedTouches[0]) return;
                const dx = e.changedTouches[0].clientX - swipeStartX;
                const dy = e.changedTouches[0].clientY - swipeStartY;
                if (Math.abs(dx) > 72 && Math.abs(dx) > Math.abs(dy) * 2.4) {
                    const cats = latestStatus?.categories || [];
                    if (!cats.length) return;
                    const curIdx = cats.findIndex(c => c.title === activeCat);
                    if (dx < 0 && curIdx < cats.length - 1) { activeCat = cats[curIdx + 1].title; renderBody(); }
                    else if (dx > 0 && curIdx > 0) { activeCat = cats[curIdx - 1].title; renderBody(); }
                }
            }, { passive: true });

            toggleBtn.onclick = () => {
                if (wasBtnDragged()) return;
                isPanelOpen = !isPanelOpen;
                panel.style.display = isPanelOpen ? "flex" : "none";
                if (!isPanelOpen) {
                    try { window.speechSynthesis?.cancel(); } catch (e) {}
                } else {
                    syncFromLatestChat(viewingHistoryFloor);
                }
            };
            document.getElementById("st-hdr-undo").onclick = () => performUndoAction();
            document.getElementById("st-hdr-close").onclick = () => {
                isPanelOpen = false;
                panel.style.display = "none";
                try { window.speechSynthesis?.cancel(); } catch (e) {}
            };
            document.getElementById("st-hdr-cfg").onclick = () => { isSettingsOpen = !isSettingsOpen; renderBody(); };
            const gridBtn = document.getElementById("st-hdr-grid");
            if (gridBtn) {
                gridBtn.onclick = () => {
                    userSettings.wideGridCards = !userSettings.wideGridCards;
                    if (userSettings.wideGridCards && userSettings.width < 640 && window.innerWidth > 680) {
                        userSettings.width = Math.min(window.innerWidth - 24, 720);
                        applyThemeAndSize();
                    }
                    saveSettings();
                    renderBody();
                    showToast(userSettings.wideGridCards ? "🗖 已切换为【双列并排宽屏画廊视图】！" : "📋 已切换回【标准单列详细视图】！", "info", 1800);
                };
            }
            const resizerEl = document.getElementById("st-v5-resizer");
            if (resizerEl && panel) {
                let isResizing = false, startW = 0, startH = 0, startRX = 0, startRY = 0;
                resizerEl.addEventListener("pointerdown", (e) => {
                    e.stopPropagation();
                    isResizing = true;
                    startRX = e.clientX; startRY = e.clientY;
                    const rect = panel.getBoundingClientRect();
                    startW = rect.width; startH = rect.height;
                    try { resizerEl.setPointerCapture(e.pointerId); } catch (err) {}
                });
                window.addEventListener("pointermove", (e) => {
                    if (!isResizing) return;
                    userSettings.width = Math.max(330, Math.min(window.innerWidth - 12, Math.round(startW + (e.clientX - startRX))));
                    userSettings.height = Math.max(360, Math.min(window.innerHeight - 24, Math.round(startH + (e.clientY - startRY))));
                    panel.style.width = userSettings.width + "px";
                    panel.style.height = userSettings.height + "px";
                });
                window.addEventListener("pointerup", () => {
                    if (isResizing) { isResizing = false; saveSettings(); }
                });
            }
            document.getElementById("st-hdr-cg").onclick = () => openCgGalleryModal("chat");
            document.getElementById("st-hdr-prev").onclick = () => {
                const len = safeCtx()?.chat?.length || 0;
                if (!len) return;
                const cur = viewingHistoryFloor !== null ? viewingHistoryFloor : (len - 1);
                syncFromLatestChat(Math.max(0, cur - 1));
            };
            document.getElementById("st-hdr-now").onclick = () => syncFromLatestChat(null);
            document.getElementById("st-v5-modal").onclick = (e) => {
                if (e.target.id === "st-v5-modal") e.target.style.display = "none";
            };
        }

        async function autoPurgePollutedDBKeys() {
            try {
                const db = await openImageDB();
                const tx = db.transaction(IDB_STORE, "readwrite");
                const store = tx.objectStore(IDB_STORE);
                for (const k of Array.from(importedImgCache.keys())) {
                    if (k.includes("isolated") || k.includes("cache") || k.includes("status_bar_pool") || k.startsWith("/") || k.startsWith("global_pin_") || k.startsWith("fav_img_") || k.startsWith("cg_snap_") || k.startsWith("pool_") || /_[1-6]$/.test(k)) continue;
                    if (!isProtectedOriginalDefaultKey(k)) {
                        store.delete(k);
                        importedImgCache.delete(k);
                    }
                }
            } catch (e) {}
        }

        loadSettings();
        if (Array.isArray(userSettings.installedPatches)) {
            userSettings.installedPatches = userSettings.installedPatches.filter(p => !String(p?.code || "").includes("patch_manager_bar"));
            saveSettings();
        }

        async function restorePartImagesFromGallery(showSuccessToast = false) {
            const u = detectProtagonistName(curVars) || "角色";
            const uNoSpace = u.replace(/\s+/g, "");
            // 🔑 核心升级1：同时匹配【聊天ID+角色名】与【纯聊天ID前缀】（哪怕旧聊天以前识别错了角色名，只要属于这个聊天窗口生成的图，100%全都能捞回来！）
            const rawChatHash = normalizeImgKey(getChatStoreKey().replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_").slice(-32));
            const curChatPrefix = normalizeImgKey(`${rawChatHash}_${u}_`);
            curVars.按钮详情 = curVars.按钮详情 || {};

            if (!latestStatus) latestStatus = getFallbackData();
            const realStageMap = {};
            const dynamicPartKeys = [];
            (latestStatus.categories || []).forEach(cat => {
                (cat.items || []).forEach(it => {
                    if (!it.editKey || it.editKey.endsWith("_none")) return;
                    realStageMap[it.editKey] = getItemRealStageNum(it, curVars);
                    dynamicPartKeys.push(it.editKey);
                });
            });

            const defaultImgFpSet = new Set();
            importedImgCache.forEach((dUrl, dbKey) => {
                if (!dUrl) return;
                if (isProtectedOriginalDefaultKey(dbKey)) {
                    defaultImgFpSet.add(getImgFingerprint(dUrl));
                }
            });

            const cachedChat = loadChatCache();
            const rawList = [
                ...(Array.isArray(curVars.专属相册) ? curVars.专属相册 : []),
                ...(Array.isArray(cachedChat?.专属相册) ? cachedChat.专属相册 : []),
                ...(Array.isArray(cachedChat?.快照?.专属相册) ? cachedChat.快照.专属相册 : [])
            ];

            const cleanAlbum = [];
            const seenFp = new Set();

            // 🔑 核心升级2：异步从 IndexedDB 硬盘数据库直接拉取未预热进内存的老图片，绝对不再因为不在前600张内存里就把旧聊天相册洗空！
            const resolveImgFromAnywhere = async (keyOrUrl) => {
                if (!keyOrUrl) return "";
                const s = String(keyOrUrl).trim();
                if (s.startsWith("data:") || s.startsWith("http") || s.startsWith("blob:") || s.startsWith("/")) return s;
                const hitMem = queryImportedImage(s);
                if (hitMem) return hitMem;
                const hitDb = await fetchImageAsyncFromDB(s);
                return hitDb || "";
            };

            for (const g of rawList) {
                if (!g) continue;
                const realSrc = g.diskPath || await resolveImgFromAnywhere(g.dbKey) || await resolveImgFromAnywhere(g.src);
                if (!realSrc) continue;
                const fp = g.fp || getImgFingerprint(realSrc);
                if (defaultImgFpSet.has(fp) || seenFp.has(fp)) continue;
                seenFp.add(fp);
                cleanAlbum.push({ ...g, src: g.dbKey || g.src, fp });
            }

            const KNOWN_PART_KEYS = [...new Set([
                "排卵周期", "受精断面", "精液归属", "孕肚进度",
                "正字涂鸦", "淫纹烙印", "穿刺环饰", "体内道具",
                "骚口实况", "胸部实况", "小穴实况", "子宫实况", "阴蒂尿道", "屁眼实况",
                "穿搭_头饰", "穿搭_颈部", "穿搭_胸罩", "穿搭_上衣", "穿搭_内裤", "穿搭_下装", "穿搭_丝袜", "穿搭_鞋子",
                "身份与背景", "肉体外貌", "表里风评", "挂牌身价", "内心独白", "当前姿势",
                "cockLove", "lust", "corr", "shame", "obey", "pleas", "精神沦陷", "媚药毒瘾",
                "破瓜纪念", "六孔总账", "高潮总账", "射精总账", "露出总账",
                ...dynamicPartKeys
            ])];

            const curChatStoreRaw = localStorage.getItem(getChatStoreKey()) || "";

            // 🔑 核心升级3：扫描 IndexedDB 的全量 Key 索引 dbKeyIndexSet（而不只是 600 张内存缓存），把属于本聊天（含曾被误标其他名字）的所有图片全部捞出！
            const allDbKeys = new Set([...importedImgCache.keys(), ...dbKeyIndexSet]);
            for (const dbKey of allDbKeys) {
                if (!dbKey || isProtectedOriginalDefaultKey(dbKey) || dbKey.startsWith("pool_")) continue;
                const belongsToThisChat = dbKey.startsWith(curChatPrefix) || (rawChatHash.length >= 12 && dbKey.startsWith(rawChatHash + "_"));
                const isReferencedSnap = dbKey.startsWith("cg_snap_") && curChatStoreRaw.includes(dbKey);
                if (!belongsToThisChat && !isReferencedSnap) continue;

                const dUrl = await resolveImgFromAnywhere(dbKey);
                if (!dUrl) continue;
                const fp = getImgFingerprint(dUrl);
                if (defaultImgFpSet.has(fp) || seenFp.has(fp)) continue;

                if (belongsToThisChat) {
                    let hitPartKey = null;
                    for (const pk of KNOWN_PART_KEYS) {
                        const pkLow = pk.toLowerCase();
                        if (dbKey.includes(`_${pkLow}_`) || (dbKey.endsWith(`_${pkLow}`) && dbKey !== pkLow)) {
                            hitPartKey = pk;
                            break;
                        }
                    }
                    if (hitPartKey) {
                        seenFp.add(fp);
                        const stgMatch = dbKey.match(/_([1-6])(?:_m\d+)?$/);
                        const stgNum = stgMatch ? parseInt(stgMatch[1], 10) : (realStageMap[hitPartKey] || 1);
                        cleanAlbum.push({
                            id: "cg_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                            dbKey: dbKey,
                            fp: fp,
                            title: `${u} · ${hitPartKey}`,
                            editKey: hitPartKey,
                            stageIdx: stgNum,
                            src: dbKey,
                            corr: safeNum(curVars.核心数值?.淫乱恶堕, 0),
                            time: "本局生图",
                            quote: "当前角色本局部位生图"
                        });
                    }
                } else if (isReferencedSnap) {
                    const favHit = (userSettings.favoriteGallery || []).find(f => f && (f.dbKey === dbKey || f.fp === fp));
                    const recoveredTitle = favHit?.title || `${u} · 本局抓拍`;
                    const recoveredEditKey = favHit?.editKey || "";
                    const recoveredStageIdx = favHit?.stageIdx || 0;

                    seenFp.add(fp);
                    cleanAlbum.push({
                        id: dbKey,
                        dbKey: dbKey,
                        fp: fp,
                        title: recoveredTitle,
                        editKey: recoveredEditKey,
                        stageIdx: recoveredStageIdx || (recoveredEditKey ? realStageMap[recoveredEditKey] : 3),
                        src: dbKey,
                        corr: safeNum(curVars.核心数值?.淫乱恶堕, 0),
                        time: "本局抓拍",
                        quote: "当前角色本局抓拍图"
                    });
                }
            }

            // 🔑 核心升级4：从当前聊天的按钮详情（stageImgs / stageImgList / imgUrl）以及永久复用图池（按同名主角匹配）反向找回遗失的相册图！
            for (const [bKey, bObj] of Object.entries(curVars.按钮详情 || {})) {
                if (!bObj || typeof bObj !== "object") continue;
                const collectRefs = [];
                if (bObj.stageImgs && typeof bObj.stageImgs === "object") {
                    Object.entries(bObj.stageImgs).forEach(([sIdx, ref]) => { if (ref) collectRefs.push({ ref, stg: parseInt(sIdx, 10) || 1 }); });
                }
                if (bObj.imgUrl) collectRefs.push({ ref: bObj.imgUrl, stg: realStageMap[bKey] || 1 });
                for (const { ref, stg } of collectRefs) {
                    const dUrl = await resolveImgFromAnywhere(ref);
                    if (!dUrl) continue;
                    const fp = getImgFingerprint(dUrl);
                    if (defaultImgFpSet.has(fp) || seenFp.has(fp)) continue;
                    seenFp.add(fp);
                    cleanAlbum.push({
                        id: "cg_btn_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                        dbKey: String(ref).startsWith("data:") ? "" : ref,
                        fp,
                        title: `${u} · ${bKey}`,
                        editKey: bKey,
                        stageIdx: stg,
                        src: ref,
                        corr: safeNum(curVars.核心数值?.淫乱恶堕, 0),
                        time: "按钮配图",
                        quote: "从按钮存档找回"
                    });
                }
            }

            // 🔑 核心升级4：严格区分【自动启动/切卡】与【玩家手动点🔄刷图】！
            // 自动运行时（showSuccessToast === false），绝不从全局图池往新聊天里塞图，绝不篡改任何总账数值与阶位！
            const chatLenNow = safeCtx()?.chat?.length || 0;
            if (showSuccessToast && chatLenNow > 1 && cleanAlbum.length === 0 && Array.isArray(userSettings.reusableImgPool)) {
                for (const p of userSettings.reusableImgPool) {
                    if (!p || !p.editKey) continue;
                    const pCharNoSpace = safeStr(p.charName).replace(/\s+/g, "");
                    const isSameCharName = (uNoSpace && pCharNoSpace && pCharNoSpace === uNoSpace);
                    const isOrphanUnknownPic = /^(?:未知.*|主角|角色|无)$/.test(pCharNoSpace);
                    const isReferencedInBtn = curChatStoreRaw.includes(p.dbKey) || (p.diskPath && curChatStoreRaw.includes(p.diskPath));
                    if (!isSameCharName && !isOrphanUnknownPic && !isReferencedInBtn) continue;
                    if (isOrphanUnknownPic && uNoSpace && isValidCharacterName(uNoSpace)) p.charName = u;

                    const refKey = p.diskPath || p.dbKey;
                    const dUrl = await resolveImgFromAnywhere(refKey);
                    if (!dUrl) continue;
                    const fp = p.fp || getImgFingerprint(dUrl);
                    if (defaultImgFpSet.has(fp) || seenFp.has(fp)) continue;
                    seenFp.add(fp);
                    cleanAlbum.push({
                        id: "cg_pool_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                        dbKey: refKey,
                        fp,
                        title: `${u} · ${p.editKey}`,
                        editKey: p.editKey,
                        stageIdx: Number(p.stageNum) || realStageMap[p.editKey] || 1,
                        src: refKey,
                        corr: safeNum(curVars.核心数值?.淫乱恶堕, 0),
                        time: p.time || "图池找回",
                        quote: "从永久图池找回的专属生图"
                    });
                }
            }

            curVars.专属相册 = cleanAlbum;
            userSettings.cgGallery = cleanAlbum;

            const EXACT_TITLE_RULES = [
                { key: "排卵周期", kw: ["排卵周期", "卵巢异变", "卵巢"] },
                { key: "受精断面", kw: ["受精断面"] },
                { key: "精液归属", kw: ["精液归属", "白浊同化", "白浊"] },
                { key: "孕肚进度", kw: ["孕肚进度", "孕肚孵化巢", "孕肚"] },
                { key: "正字涂鸦", kw: ["正字涂鸦", "涂鸦与烙痕", "正字"] },
                { key: "淫纹烙印", kw: ["淫纹烙印", "淫纹"] },
                { key: "穿刺环饰", kw: ["穿刺环饰", "穿刺铁牢", "穿刺"] },
                { key: "体内道具", kw: ["体内道具", "机械填塞"] },
                { key: "骚口实况", kw: ["骚口实况", "骚口"] },
                { key: "胸部实况", kw: ["胸部实况", "丰乳"] },
                { key: "小穴实况", kw: ["小穴实况", "小穴"] },
                { key: "子宫实况", kw: ["子宫实况", "子宫"] },
                { key: "阴蒂尿道", kw: ["阴蒂尿道", "阴蒂与尿道", "阴蒂"] },
                { key: "屁眼实况", kw: ["屁眼实况", "屁眼"] },
                { key: "穿搭_头饰", kw: ["穿搭_头饰", "头部与面容", "头饰面容", "头饰"] },
                { key: "穿搭_颈部", kw: ["穿搭_颈部", "脖颈与锁骨", "脖颈锁骨", "脖颈"] },
                { key: "穿搭_胸罩", kw: ["穿搭_胸罩", "胸衣与内衬", "胸衣内衬", "胸衣"] },
                { key: "穿搭_上衣", kw: ["穿搭_上衣", "上衣与外衫", "上衣外衫", "上衣"] },
                { key: "穿搭_内裤", kw: ["穿搭_内裤", "底裤与私处", "底裤私处", "底裤"] },
                { key: "穿搭_下装", kw: ["穿搭_下装", "裙裤与臀部", "裙裤臀部", "裙裤"] },
                { key: "穿搭_丝袜", kw: ["穿搭_丝袜", "丝袜与双腿", "丝袜双腿", "丝袜"] },
                { key: "穿搭_鞋子", kw: ["穿搭_鞋子", "鞋履与玉足", "鞋履玉足", "鞋履"] },
                { key: "身份与背景", kw: ["身份与背景", "监控目标与身份", "监控身份"] },
                { key: "肉体外貌", kw: ["肉体外貌", "肉体敏感"] },
                { key: "表里风评", kw: ["表里风评", "社死风评"] },
                { key: "挂牌身价", kw: ["挂牌身价"] },
                { key: "内心独白", kw: ["内心独白"] },
                { key: "当前姿势", kw: ["当前姿势", "姿势与躯体机能", "实时交合姿势"] },
                { key: "cockLove", kw: ["cockLove", "阳具烙印"] },
                { key: "lust", kw: ["lust", "发情中枢"] },
                { key: "corr", kw: ["corr", "人格崩坏"] },
                { key: "shame", kw: ["shame", "羞耻防线"] },
                { key: "obey", kw: ["obey", "意志切除"] },
                { key: "pleas", kw: ["pleas", "脑髓熔断"] },
                { key: "精神沦陷", kw: ["精神沦陷", "脑实质沦陷"] },
                { key: "媚药毒瘾", kw: ["媚药毒瘾", "脑脊液毒瘾"] },
                { key: "破瓜纪念", kw: ["破瓜纪念"] },
                { key: "六孔总账", kw: ["六孔总账", "性交总账"] },
                { key: "高潮总账", kw: ["高潮总账", "高潮与失禁"] },
                { key: "射精总账", kw: ["射精总账", "射精与泌乳"] },
                { key: "露出总账", kw: ["露出总账", "接客与轮奸"] }
            ];

            let matchedCount = 0;
            const maxImgStageByPart = {};
            let maxOverallImgStage = 1;

            const curSpSigForRestore = getSpeciesSignatureFromDna(getLockedAppearanceTags(u, curVars));
            for (let i = cleanAlbum.length - 1; i >= 0; i--) {
                const g = cleanAlbum[i];
                if (!g) continue;
                if (g.speciesSig && g.speciesSig !== curSpSigForRestore && !UNIVERSAL_LOCAL_PARTS.has(g.editKey)) continue;
                const refKeyOrUrl = g.diskPath || g.dbKey || g.src;
                if (!refKeyOrUrl) continue;

                let matchedKey = (g.editKey && (KNOWN_PART_KEYS.includes(g.editKey) || String(g.editKey).startsWith("fetish_") || String(g.editKey).startsWith("client_"))) ? g.editKey : null;
                if (!matchedKey) {
                    const labelStr = `${g.title || ""} ${g.note || ""}`;
                    for (const rule of EXACT_TITLE_RULES) {
                        if (rule.kw.some(w => w.length >= 2 && labelStr.includes(w))) {
                            matchedKey = rule.key;
                            break;
                        }
                    }
                    if (!matchedKey) {
                        for (const pk of dynamicPartKeys) {
                            const pureName = pk.replace(/^(?:fetish_|client_)/, "");
                            if (pureName.length >= 2 && labelStr.includes(pureName)) {
                                matchedKey = pk;
                                break;
                            }
                        }
                    }
                }
                if (matchedKey) {
                    let stgNum = Number(g.stageIdx) || extractStageNumFromKey(refKeyOrUrl) || realStageMap[matchedKey] || 1;
                    g.editKey = matchedKey;
                    g.stageIdx = stgNum;

                    if (stgNum > (maxImgStageByPart[matchedKey] || 1)) maxImgStageByPart[matchedKey] = stgNum;
                    if (stgNum > maxOverallImgStage) maxOverallImgStage = stgNum;

                    const prev = curVars.按钮详情[matchedKey] || {};
                    const nextStageImgs = { ...(prev.stageImgs || {}), [stgNum]: refKeyOrUrl };
                    const prevList = Array.isArray(prev.stageImgList?.[stgNum]) ? prev.stageImgList[stgNum] : [];
                    const nextList = [refKeyOrUrl, ...prevList.filter(x => x !== refKeyOrUrl)];
                    curVars.按钮详情[matchedKey] = {
                        ...prev,
                        imgUrl: refKeyOrUrl,
                        forceLatestImg: refKeyOrUrl,
                        stageImgs: nextStageImgs,
                        stageImgList: { ...(prev.stageImgList || {}), [stgNum]: nextList }
                    };
                    matchedCount++;
                }
            }

            // 🔑 核心升级5：只有当玩家手动点击顶部的「🔄刷图」按钮（showSuccessToast === true），且当前旧聊天的总账全为 0 但找回了高阶图时，才弹窗询问玩家是否需要按图片恢复历史总账！平时绝对不允许自动篡改总账与阶位！
            const curTotalLedger = computeAllOrganDevelopments(curVars).totalLedgerCount;
            if (showSuccessToast && chatLenNow > 1 && matchedCount > 0 && curTotalLedger === 0) {
                if (confirm(`📊 已为【${u}】找回 ${matchedCount} 张历史部位配图！\n检测到当前聊天的【总账次数与器官阶位】为 0，是否需要根据找回的图片自动恢复匹配的历史总账与按钮阶位？\n（注：如果当前是全新清白开局，请点“取消”保持 0 初始态）`)) {
                    normalizeVarsStructure(curVars);
                    curVars.角色创世楼层 = 0;
                    delete curVars.手动总账基准楼层;
                    delete curVars.手动总账基准快照;
                    delete curVars.手动精液基准楼层;
                    delete curVars.手动精液基准快照;
                    curVars.上次清洗楼层 = -1;
                    curVars.已手动清空精液 = false;

                    const effMaxStg = Math.max(maxOverallImgStage, 3);
                    curVars.历史最高崩坏度 = curVars.历史最高崩坏度 || {};
                    const stageToMinScore = [0, 0, 26, 46, 66, 86, 100];
                    const dMult = Math.max(1, getDifficultyProfile().mult);
                    const stageToMinCount = [0, 0, Math.ceil(6 * dMult), Math.ceil(18 * dMult), Math.ceil(40 * dMult), Math.ceil(78 * dMult), Math.ceil(140 * dMult)];
                    const ensureMin = (obj, k, minVal) => { if (safeNum(obj[k], 0) < minVal) obj[k] = minVal; };

                    const vagStg  = Math.max(maxImgStageByPart["小穴实况"] || 1, 3);
                    const wombStg = Math.max(maxImgStageByPart["子宫实况"] || 1, 3);
                    ensureMin(curVars.历史最高崩坏度, "organ_vag", stageToMinScore[vagStg]);
                    ensureMin(curVars.计数.性交, "小穴", stageToMinCount[vagStg]);
                    ensureMin(curVars.历史最高崩坏度, "organ_womb", stageToMinScore[wombStg]);
                    ensureMin(curVars.计数.射精, "内射", stageToMinCount[wombStg]);
                    curVars.体内精液存量.子宫毫升 = (wombStg - 1) * 25;
                    curVars.体内精液存量.小穴毫升 = (wombStg - 1) * 12;
                    ensureMin(curVars.计数.高潮, "总数", stageToMinCount[effMaxStg]);
                    ensureMin(curVars.核心数值, "淫乱恶堕", stageToMinScore[effMaxStg]);
                    ensureMin(curVars.核心数值, "对肉棒好感度", stageToMinScore[effMaxStg]);
                    _organDevCache = { sig: "", res: null };
                    calibrateMentalMetrics(curVars);
                }
            }

            saveSettings();
            saveChatCache(curVars);
            latestStatus = getFallbackData();
            renderBody();

            if (showSuccessToast) {
                showToast(`🔄 刷图完成！已为【${u}】同步挂载 ${matchedCount} 张本局专属配图！`, "success", 3200);
            }
        }

        function injectQuickRefreshImgBtn() {
            const cgBtn = document.getElementById("st-hdr-cg");
            if (!cgBtn || document.getElementById("st-hdr-refresh-img")) return;
            const refBtn = document.createElement("button");
            refBtn.id = "st-hdr-refresh-img";
            refBtn.type = "button";
            refBtn.title = "一键从数据库找回相册图片并同步到所有部位按钮";
            refBtn.style.cssText = "background:linear-gradient(135deg,#10b981,#06b6d4);color:#fff;border:none;border-radius:6px;padding:3px 7px;font-size:11px;font-weight:bold;cursor:pointer;";
            refBtn.textContent = "🔄刷图";
            refBtn.onclick = (e) => {
                e.stopPropagation();
                restorePartImagesFromGallery(true);
            };
            cgBtn.parentNode.insertBefore(refBtn, cgBtn);
        }

        loadAllImportedImagesToMemory().then(async () => {
            if (Array.isArray(userSettings.reusableImgPool)) {
                let fixedPoolCnt = 0;
                userSettings.reusableImgPool.forEach(p => {
                    if (!p || !p.editKey) return;
                    const isTrulyUniversal = UNIVERSAL_LOCAL_PARTS.has(p.editKey);
                    if (!isTrulyUniversal && p.isUniversalOrgan) {
                        p.isUniversalOrgan = false;
                        fixedPoolCnt++;
                    }
                    
                    if (/撕裂|湿烂|白浊|爱液|淫水|真空|赤裸|精液|漏尿|失禁|torn|cum|semen/i.test(p.wearSig || "")) {
                        p.isPureClean = false;
                        p.hasCum = true;
                        if (Number(p.stageNum) === 1) p.stageNum = 3;
                        fixedPoolCnt++;
                    } else if (Number(p.stageNum) === 1 && !String(p.editKey).startsWith("client_") && !String(p.editKey).startsWith("fetish_")) {
                        if (!p.isPureClean || p.hasCum || p.isDuoSex) {
                            p.isPureClean = true;
                            p.hasCum = false;
                            p.isDuoSex = false;
                            fixedPoolCnt++;
                        }
                    }
                });
                if (!userSettings.poolV6Cleanse) {
                    // 1. 清理之前因硬编码 _1 而被污染的本局 _1 槽位
                    try {
                        const db = await openImageDB();
                        const tx = db.transaction(IDB_STORE, "readwrite");
                        const store = tx.objectStore(IDB_STORE);
                        for (const k of Array.from(importedImgCache.keys())) {
                            if (k.includes("isolated") && k.endsWith("_1")) {
                                store.delete(k);
                                importedImgCache.delete(k);
                            }
                        }
                    } catch (e) {}
                    // 2. 自动解除旧版本误锁在第 1 阶（_1）上的全局固定图，防止新开聊天第 1 阶被全局锁污染
                    if (userSettings.globalPinnedStageImgs && typeof userSettings.globalPinnedStageImgs === "object") {
                        Object.keys(userSettings.globalPinnedStageImgs).forEach(pk => {
                            if (pk.endsWith("_1")) delete userSettings.globalPinnedStageImgs[pk];
                        });
                    }
                    userSettings.poolV6Cleanse = true;
                    fixedPoolCnt++;
                }
                if (fixedPoolCnt > 0) saveSettings();
            }

            autoPurgePollutedDBKeys();
            ensureUI();
            injectQuickRefreshImgBtn();
            mountExtensionMenuSwitch();
            executeStoredPatches();
            if (userSettings.enabled) {
                syncFromLatestChat(null);
                restorePartImagesFromGallery(false);
            }
        });

        let activeIsolatedKey = getChatStoreKey();
        let _lastTimerDomSig = "";
        if (window.__stZhjTimer) clearInterval(window.__stZhjTimer);
        window.__stZhjTimer = setInterval(() => {
            // 🔋 极致低消耗保护1：当手机锁屏、切到后台标签页或插件关闭时，0消耗直接休眠跳过！
            if (!userSettings.enabled || document.hidden) return;
            const nowKey = getChatStoreKey();
            if (nowKey !== activeIsolatedKey) {
                activeIsolatedKey = nowKey;
                _lastTimerDomSig = "";
                _organDevCache = { sig: "", res: null };
                _appearMemoCache = { sig: "", res: null };
                sessionRandomSeed = Math.floor(Math.random() * 10000);
                capturedZhjSrcSet.clear();
                curVars = getInitialVars();
                undoHistoryStack.length = 0;
                _dynCtxCache = { sig: "", res: null };
                userSettings.lockedAppearanceTags = "";
                viewingHistoryFloor = null;
                savedLiveClothDurability = null;
                prevSnapshotForDelta = null;
                prevRecordedTiersForAutoGen = {};
                const cached = loadChatCache();
                if (cached) mergeUserCustomizations(curVars, cached, safeCtx()?.chat?.length || 0);
                curVars.专属相册 = Array.isArray(curVars.专属相册) ? curVars.专属相册 : [];
                userSettings.cgGallery = curVars.专属相册;
                const curHeroine = detectProtagonistName(curVars);
                userSettings.lockedAppearanceTags = curVars.档案?.锁定外貌DNA || getLockedAppearanceTags(curHeroine, curVars);
                syncFromLatestChat(null);
                restorePartImagesFromGallery(false);
                return;
            }
            // 🔋 极致低消耗保护2：快速检查 #chat 最后一个消息节点的 HTML 长度与图片数量，如果毫无变化，直接 0 毫秒跳过 DOM 扫描！
            const chatEl = document.getElementById("chat");
            const lastMesEl = chatEl?.lastElementChild;
            const curDomSig = lastMesEl ? `${chatEl.childElementCount}_${lastMesEl.innerHTML.length}_${lastMesEl.querySelectorAll("img").length}_${isGeneratingImageBusy}` : "empty";
            if (curDomSig === _lastTimerDomSig) return;
            _lastTimerDomSig = curDomSig;

            scrubRawBlocksFromChatDOM(false);
            scanChatImagesForZhiHuiJi();
        }, 900);

        let lastMsgSyncTimestamp = 0;
        window.__stOnChatChanged = () => {
            sessionRandomSeed = Math.floor(Math.random() * 10000);
            _organDevCache = { sig: "", res: null };
            _appearMemoCache = { sig: "", res: null };
            _dynCtxCache = { sig: "", res: null };
            userSettings.lockedAppearanceTags = "";
            capturedZhjSrcSet.clear();
            autoGenQueue.length = 0;
            prevRecordedTiersForAutoGen = {};
            curVars = getInitialVars();
            userSettings.cgGallery = [];
            undoHistoryStack.length = 0;
            viewingHistoryFloor = null;
            savedLiveClothDurability = null;
            prevSnapshotForDelta = null;
            if (!userSettings.enabled) return;
            setTimeout(() => {
                syncFromLatestChat(null);
                restorePartImagesFromGallery(false);
            }, 280);
        };
        window.__stOnMessageReceived = () => {
            if (!userSettings.enabled) return;
            // 🛡️ 铁律护盾：后台生图期间以及生图刚结束的 3.5 秒内，严禁触发消息重扫，防止生图伪造的渲染事件把当前配图和等级洗掉！
            if (isGeneratingImageBusy || (Date.now() - lastImageGenFinishTime < 3500)) return;
            const now = Date.now();
            if (now - lastMsgSyncTimestamp < 1500) return;
            lastMsgSyncTimestamp = now;

            setTimeout(async () => {
                if (isGeneratingImageBusy || (Date.now() - lastImageGenFinishTime < 3500)) return;
                syncFromLatestChat(null);
                if (userSettings.autoCallApiOnNewMsg && userSettings.apiUrl && userSettings.apiKey) {
                    await triggerSubApiUpdate(null);
                }
                curVars.待同步场外变动 = [];
                delete curVars.本轮后台静默指令;
                saveChatCache(curVars);
            }, 350);
        };
        window.__stOnPromptReady = (evData) => {
            if (!userSettings.enabled) return;
            const u = detectProtagonistName(curVars);
            const inj = buildPromptInjection(u, curVars);
            if (evData && Array.isArray(evData.chat)) {
                const alreadyIn = evData.chat.some(m => String(m?.content || "").includes("[系统后台只读状态参考"));
                if (!alreadyIn) evData.chat.push({ role: "system", content: inj });
            }
        };

        const attachTavernEvents = () => {
            const ctx = safeCtx();
            if (!ctx?.eventSource || !ctx?.event_types) { setTimeout(attachTavernEvents, 1200); return; }
            if (window.__stEventsAttached) return;
            window.__stEventsAttached = true;

            if (ctx.event_types.CHAT_CHANGED) {
                ctx.eventSource.on(ctx.event_types.CHAT_CHANGED, () => window.__stOnChatChanged && window.__stOnChatChanged());
            }
            const evs = [ctx.event_types.CHARACTER_MESSAGE_RENDERED, ctx.event_types.MESSAGE_RECEIVED].filter(Boolean);
            evs.forEach(ev => {
                ctx.eventSource.on(ev, () => window.__stOnMessageReceived && window.__stOnMessageReceived());
            });
            if (ctx.event_types.CHAT_COMPLETION_PROMPT_READY) {
                ctx.eventSource.on(ctx.event_types.CHAT_COMPLETION_PROMPT_READY, (evData) => window.__stOnPromptReady && window.__stOnPromptReady(evData));
            }
        };
        attachTavernEvents();

        window.ST_V10_COMPLETE_FLAG = true;
        window.ST_V20_COMPLETE_FLAG = true;
        console.log("✅ [状态栏 1.0 · 终极完美修复版] 加载成功！");
    } catch (err) {
        showDiagnosticError("初始化崩溃", err, "请检查代码是否已完整首尾拼接！");
    }
})();
