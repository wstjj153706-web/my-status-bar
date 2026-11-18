        function applyNaturalMetabolism(floorText, targetVars, hasExplicitSet = false) {
            if (!floorText) return;
            normalizeVarsStructure(targetVars);
            const cleanBody = floorText.replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|<options>[\s\S]*?<\/options>|<summary>[\s\S]*?<\/summary>|<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "");
            if (!cleanBody) return;
            const sp = targetVars.体内精液存量 || {}, mark = targetVars.痕迹与标记 || {}, cnt = targetVars.计数 || {};
            let gotFreshSemen = false;
        if (!hasExplicitSet) {
            if (/(?:挺身|肉棒|阳具|巨物|龟头).{0,15}(?:捅入|插入|贯穿|顶入|没入|抽插).{0,15}(?:小穴|花穴|甬道|蜜穴|肉穴)/.test(cleanBody)) cnt.性交.小穴 = safeNum(cnt.性交.小穴) + 1;
            if (/(?:内射|射入|灌入|喷洒在|泵入).{0,15}(?:子宫|宫腔|小穴深处|花心|甬道深处)/.test(cleanBody)) { cnt.射精.内射 = safeNum(cnt.射精.内射) + 1; sp.子宫毫升 = safeNum(sp.子宫毫升) + 18; sp.小穴毫升 = safeNum(sp.小穴毫升) + 10; gotFreshSemen = true; }
            if (/(?:肉棒|阳具|龟头).{0,12}(?:塞入|捅入|顶入|深喉|抽插).{0,12}(?:小嘴|口腔|咽喉|喉管|唇瓣)/.test(cleanBody)) cnt.性交.口 = safeNum(cnt.性交.口) + 1;
            if (/(?:吞下|咽下|射进嘴|灌进胃|吞精).{0,15}(?:精液|白浊|浓精)/.test(cleanBody)) { cnt.精液摄入.吞精次数 = safeNum(cnt.精液摄入.吞精次数) + 1; cnt.精液摄入.累计毫升 = safeNum(cnt.精液摄入.累计毫升) + 15; sp.口内毫升 = safeNum(sp.口内毫升) + 15; gotFreshSemen = true; }
            if (/(?:捅入|插入|贯穿|抽插).{0,12}(?:屁眼|后庭|菊穴|肛门|直肠)/.test(cleanBody)) cnt.性交.屁眼 = safeNum(cnt.性交.屁眼) + 1;
            if (/(?:高潮|绝顶|泄身|痉挛着攀上巅峰)/.test(cleanBody)) cnt.高潮.总数 = safeNum(cnt.高潮.总数) + 1;
            if (/(?:潮吹|喷潮|喷涌而出)/.test(cleanBody)) cnt.失控.喷潮 = safeNum(cnt.失控.喷潮) + 1;
            if (/(?:失禁|漏尿|黄尿|尿液失控)/.test(cleanBody)) cnt.失控.失禁 = safeNum(cnt.失控.失禁) + 1;
            if (/(?:耳光|掌掴|巴掌|皮鞭|抽打).{0,12}(?:臀|脸|胸|乳)/.test(cleanBody)) mark.鞭痕与掌印 = safeNum(mark.鞭痕与掌印) + 1;
            if (/(?:高潮|绝顶|痉挛|抽插|贯穿|轮奸|鞭打|束缚|跪趴|脱力|瘫软)/.test(cleanBody)) {
                const drop = /(?:轮奸|痉挛|脱力|瘫软|潮吹|失禁)/.test(cleanBody) ? 12 : 6;
                targetVars.身体.体力 = Math.max(0, safeNum(targetVars.身体.体力, 100) - drop);
            }
        }
        if (/(?:内射|吞精|射入|白浊灌入)/.test(cleanBody)) gotFreshSemen = true;
        if (gotFreshSemen) targetVars.断精回合数 = 0;
        else targetVars.断精回合数 = safeNum(targetVars.断精回合数, 0) + 1;

        // 🎲 模块7：回合末生理失控暗骰检定器
        targetVars.本轮失控事件 = "";
        const totalSemen = safeNum(sp.子宫毫升) + safeNum(sp.小穴毫升) + safeNum(sp.屁眼毫升);
        const roll = Math.random() * 100;
        if (totalSemen >= 80 && roll < 38) {
            targetVars.本轮失控事件 = "当众漏精滴落";
            sp.小穴毫升 = Math.max(0, safeNum(sp.小穴毫升) - 8);
        } else if (safeNum(cnt.失控?.失禁) >= 6 && roll < 28) {
            targetVars.本轮失控事件 = "括约肌失守漏尿";
        }

        if (!userSettings.autoMetabolism) return;
        if (/(?:花洒|喷头|水流|温水).{0,16}(?:冲刷|冲洗|灌入|洗净).{0,16}(?:甬道|深处|残精|小穴|宫腔)/.test(cleanBody)) {
            sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.15)); sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.35));
        } else if (/(?:手指|并拢).{0,15}(?:探入|伸入|抠出|洗出|清理).{0,18}(?:残精|白浊|甬道|深处)/.test(cleanBody)) {
            sp.小穴毫升 = Math.max(0, Math.round(safeNum(sp.小穴毫升) * 0.4)); sp.子宫毫升 = Math.max(0, Math.round(safeNum(sp.子宫毫升) * 0.75));
        }
        if (/(?:漱口|吐出).{0,12}(?:残精|白浊|精液)/.test(cleanBody)) sp.口内毫升 = Math.max(0, Math.round(safeNum(sp.口内毫升) * 0.3));
        if (/(?:沉沉睡去|一觉睡到|次日清晨|第二天早上|醒来时已是|睡了一觉)/.test(cleanBody)) {
            targetVars.身体.体力 = Math.min(100, safeNum(targetVars.身体.体力, 70) + 55);
            targetVars.精神与心理.快感累积 = Math.max(0, Math.round(safeNum(targetVars.精神与心理.快感累积) * 0.15));
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
        const recentText = (ctx?.chat || []).slice(-8).map(m => safeStr(m?.mes)).join(" ") + " " + safeStr(ctx?.characters?.[ctx?.characterId]?.description);
        const c = v?.计数 || {}, mark = v?.痕迹与标记 || {}, prop = v?.体内道具与权限 || {};
        const hasFantasyOrMonster = safeNum(c.性交?.兽交异种) > 0 || (userSettings.parasiteState?.lv > 0) || /魔族|魔物|触手|异种|妖兽|虫族|史莱姆|深渊|魅魔|魔化|寄生|产卵|生化|机械改造|赛博|因果/.test(recentText);
        const hasExtremePhysical = /拳交|扩阴器|扩肛器|脱垂|脱肛|尿道扩张|宫颈扩张|彻底崩坏|烂肉洞|失禁改造|排泄器/.test(recentText);
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
        const prevMax = Math.min(maxAllowed, safeNum(v.历史最高崩坏度[key], 0));
        const clampedCur = Math.min(maxAllowed, Math.round(safeNum(curVal, 0)));
        const lockedVal = Math.max(prevMax, clampedCur);
        v.历史最高崩坏度[key] = lockedVal;
        return lockedVal;
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

    function computeAllOrganDevelopments(v) {
        normalizeVarsStructure(v);
        const c = v.计数 || {}, dMult = Math.max(0.5, getDifficultyProfile().mult);
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

        return { vagObj, wombObj, mouthObj, chestObj, clitObj, analObj, totalLedgerCount, totalWeightedPts, top2OrganAvg, all6OrganAvg, masterCurve: { val: compositeScore, tier: tier6(compositeScore, false), curPts: Math.round(totalWeightedPts), nextThreshold: ledgerCurve.nextThreshold } };
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
        };
        if (!userSettings.strictMentalLock) { applyGodMental(); return; }

        const sp = v.体内精液存量 || {};
        const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
        if (dev.totalLedgerCount === 0 && totalMl === 0 && dev.all6OrganAvg === 0) {
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
        const anchorScore = Math.round(dev.masterCurve.val * 0.55 + dev.top2OrganAvg * 0.25 + fetAvg * 0.20);
        const rawMax = (dev.masterCurve.val >= 100 && dev.top2OrganAvg >= 95) ? 100 : 99;
        const hardMax100 = Math.min(caps.mentalCap, rawMax);
        const maxLongTermCap = Math.min(hardMax100, anchorScore + 6);
        const minLongTermFloor = Math.max(0, anchorScore - 8);
        const calibratedHypno = Math.min(safeNum(v.精神与心理扩展?.催眠深度), Math.min(hardMax100, maxLongTermCap + 10));
        if (v.精神与心理扩展) v.精神与心理扩展.催眠深度 = calibratedHypno;
        const finalCap = Math.min(hardMax100, Math.max(maxLongTermCap, Math.round(calibratedHypno * 0.8)));

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

        const hasActiveStimulus = totalMl > 0 || (v.体内道具与权限?.体内道具 && v.体内道具与权限.体内道具 !== "无") || safeNum(v.断精回合数) >= 3;
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
            `【第一阶段·浅层记忆】（${val}/100）：「${name}」刚刚在${u}的肉体上留下最初痕迹（畸变点 ${countNow}/${nextTarget}）。理智上仍保持克制，但被触碰过的粘膜已留下微弱的异物记忆。`,
            `【第二阶段·条件反射】（${val}/100）：「${name}」已进入第二阶段（畸变点 ${countNow}）。只要处于相似情境下，呼吸便会微乱发热，私处开始分泌少量润滑液。`,
            `【第三阶段·食髓知味】（${val}/100）：「${name}」已深化至第三阶段（畸变点 ${countNow}）。长时间未体验「${name}」时，身体深处会泛起明显的空虚酸痒，在过程中会本能地顺从配合。`,
            `【第四阶段·深度成瘾】（${val}/100）：「${name}」已达第四阶段（畸变点 ${countNow}）。相应部位神经回路被重塑，面对「${name}」时会丧失自控力地主动迎合索取。`,
            `【第五阶段·戒断崩解】（${val}/100）：「${name}」已达第五阶段重度畸变（畸变点 ${countNow}）。一旦脱离「${name}」刺激便会产生剧烈躯体戒断抽搐，触发即伴随失禁与潮吹。`,
            `【💀 第六阶段·神经强迫症彻底畸变】（100/100 MAX）：「${name}」已100%烧穿大脑皮层并造成不可逆的躯体强迫症畸变（畸变点 ${countNow}）！相关部位肌肉与神经24小时保持迎接「${name}」的病态抽搐造型，一旦强行阻止就会当场发狂自残、喷尿休克！`
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
        if (Array.isArray(cached.专属相册)) baseVars.专属相册 = [...cached.专属相册];
        if (cached.锁定外貌DNA) {
            baseVars.档案 = baseVars.档案 || {};
            baseVars.档案.锁定外貌DNA = cached.锁定外貌DNA;
        }
        if (cached.上帝强制锁定 && typeof cached.上帝强制锁定 === "object") {
            baseVars.上帝强制锁定 = { ...baseVars.上帝强制锁定, ...cached.上帝强制锁定 };
        }
        const isRolledBack = (typeof cached.floorLen === "number" && cached.floorLen > currentChatLen);
        if (!isRolledBack && cached.floorLen === currentChatLen && cached.历史最高崩坏度 && typeof cached.历史最高崩坏度 === "object") {
            baseVars.历史最高崩坏度 = { ...baseVars.历史最高崩坏度, ...cached.历史最高崩坏度 };
        }
        if (cached.手动锁定真名) {
            baseVars.档案.手动锁定真名 = cached.手动锁定真名;
            baseVars.档案.当前认知名字 = cached.手动锁定真名;
        }
        if (cached.快照 && !isRolledBack) {
            const s = normalizeVarsStructure(cached.快照);
            const isSameFloor = (cached.floorLen === currentChatLen);
            ["档案", "穿搭", "受孕与生理", "精神与心理扩展", "痕迹与标记", "体内道具与权限", "实况"].forEach(k => {
                if (s[k] && typeof s[k] === "object") {
                    baseVars[k] = baseVars[k] || {};
                    Object.entries(s[k]).forEach(([subKey, val]) => {
                        if (val !== "" && val !== "无" && val !== 0 && (!baseVars[k][subKey] || baseVars[k][subKey] === "无" || isSameFloor)) {
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
                            if (isSameFloor) baseVars[k][subKey] = val;
                        } else if (subKey === "羞耻度") {
                            baseVars[k][subKey] = Math.min(safeNum(baseVars[k][subKey], 100), val);
                        } else {
                            baseVars[k][subKey] = Math.max(safeNum(baseVars[k][subKey], 0), val);
                        }
                    });
                }
            });
            if (isSameFloor && s.身体 && typeof s.身体.体力 === "number") baseVars.身体.体力 = s.身体.体力;
            if (isSameFloor && s.体内精液存量 && typeof s.体内精液存量 === "object") Object.assign(baseVars.体内精液存量, s.体内精液存量);
            if (s.计数 && typeof s.计数 === "object") {
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
        const clientMap = new Map(), blockedSet = new Set(Array.isArray(v.已屏蔽恩客) ? v.已屏蔽恩客 : []);
        const rawUser = safeStr(ctx?.name1).trim(), oldSelfName = safeStr(v.档案?.原身旧名).trim(), curSelfName = safeStr(u).trim();
        const NON_HUMAN_REGEX = /^(?:\d+|主角|你|我|她|他|它|原身|前世|身体|少女|女人|女生|无|未知|旁白|系统|笔|钢笔|圆珠笔|铅笔|毛笔|画笔|马克笔|跳蛋|假阳具|按摩棒|贞操带|项圈|手铐|锁链|绳子|鞭子|皮鞭|蜡烛|口球|眼罩|衣服|上衣|内裤|底裤|胸罩|文胸|丝袜|黑丝|白丝|高跟鞋|鞋子|裙子|睡裙|床单|床垫|被子|枕头|纸巾|纸团|毛巾|花洒|水龙头|镜子|手机|相机|黄瓜|香蕉|瓶子|酒瓶|触手|道具|玩具)$/;
        const isInvalidClient = (candName) => {
            if (!candName) return true;
            const n = String(candName).trim();
            if (n.length < 2 || n.length > 12 || blockedSet.has(n) || n === curSelfName || (oldSelfName && n === oldSelfName) || NON_HUMAN_REGEX.test(n)) return true;
            if (/(?:笔|棒|球|环|链|衣|裤|裙|袜|鞋|帽|巾|床|桌|椅|门|窗|灯|水|液|药|剂|器|具|穴|乳|胸|臀|腿|足|口|唇|手|指)$/.test(n) && !/(?:男人|少爷|老板|大师|师兄|师尊|徒弟|老公|丈夫|学长|同学|老师)/.test(n)) return true;
            if (new RegExp(`(?:原名|原本是|前世是|从)\\s*${n}\\s*(?:变成|穿成|重塑|化作)`).test(fullText)) return true;
            return false;
        };
        const creampie = safeNum(v.计数?.射精?.内射), vagCnt = safeNum(v.计数?.性交?.小穴), mouthCnt = safeNum(v.计数?.性交?.口), wombMl = safeNum(v.体内精液存量?.子宫毫升);
        const totalSex = vagCnt + mouthCnt + creampie + safeNum(v.计数?.性交?.屁眼);
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
        if (clientMap.size === 0 && (totalSex > 0 || wombMl > 0 || safeNum(v.核心数值?.淫乱恶堕) >= 25)) {
            const autoCand = (rawUser && rawUser !== curSelfName) ? rawUser : (c && c !== curSelfName && c !== "无角色卡" ? c : "");
            if (autoCand && !isInvalidClient(autoCand)) {
                const score = Math.min(100, Math.max(20, 25 + vagCnt * 2 + creampie * 3 + mouthCnt * 1.5));
                upsertClient(autoCand, "首要支配饲主", "滚烫粗大肉棒", "身心深度支配", score, wombMl > 0 ? 100 : 0,
                    `【🍆 恩客档案】：${autoCand}\n【📊 肉体崩坏改造记录】：当前剧情中的首要支配者，累计贯穿小穴 ${vagCnt} 次、口交 ${mouthCnt} 次、内射 ${creampie} 次。`,
                    [`面对【${autoCand}】，我心里依然保留着最后的矜持防线。`,`身体已经开始适应【${autoCand}】的温度与摆弄了💦。`,`每次被【${autoCand}】触碰，熟稔的肉壁都会本能地收缩迎合😳💦。`,`只要【${autoCand}】一靠近，我的骚穴和嘴巴就会不自觉地发痒流涎🥵💦！`,`从里到外都已经被【${autoCand}】彻底开发成专属肉便器了🥵💦❤️！`,`啊嘿♡……这辈子都是【${autoCand}】大人专属的100%崩坏排泄肉坑与灌精苗床啦🥵💦❤️❤️！`]);
            }
        }
        return Array.from(clientMap.values());
    }

    const customTopWidgets = [];
    const customDirectorButtons = [];
    const customPromptRules = [];

    function varsToCompactSummary(userName, v) {
        const dev = computeAllOrganDevelopments(v), sp = v.体内精液存量 || {}, c = v.计数 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {};
        const pMode = RUIN_PERSONA_MODES[userSettings.personaMode || "evolution"]?.label || "进化树";
        return `${userName}[模式:${pMode}]: 体力=${safeNum(v.身体?.体力, 100)}%, 恶堕=${safeNum(v.核心数值?.淫乱恶堕)}%, 好感=${safeNum(v.核心数值?.对肉棒好感度)}%, 性欲=${safeNum(v.核心数值?.性欲程度)}%, 羞耻=${safeNum(v.精神与心理?.羞耻度, 100)}%, 服从=${safeNum(v.精神与心理?.服从度)}%, 快感=${safeNum(v.精神与心理?.快感累积)}% | ` +
               `六孔崩坏: 口=${dev.mouthObj.val}%, 乳=${dev.chestObj.val}%, 穴=${dev.vagObj.val}%, 宫=${dev.wombObj.val}%, 蒂尿=${dev.clitObj.val}%, 菊=${dev.analObj.val}% | ` +
               `储精: 宫=${safeNum(sp.子宫毫升)}ml, 穴=${safeNum(sp.小穴毫升)}ml, 胃=${safeNum(sp.口内毫升)}ml, 肠=${safeNum(sp.屁眼毫升)}ml | ` +
               `总账: 穴=${safeNum(c.性交?.小穴)}, 内射=${safeNum(c.射精?.内射)}, 口=${safeNum(c.性交?.口)}, 菊=${safeNum(c.性交?.屁眼)}, 高潮=${safeNum(c.高潮?.总数)}, 失禁=${safeNum(c.失控?.失禁)} | ` +
               `标记: 痕=${safeStr(mark.体表痕迹, "无")}, 纹=${safeStr(mark.淫纹与刻印, "无")}, 具=${safeStr(prop.体内道具, "无")}`;
    }

    function buildReverseBodyEnforcementRules(u, v) {
        if (!userSettings.injectReversePrompt) return "";
        const dev = computeAllOrganDevelopments(v), sp = v.体内精液存量 || {}, totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
        const corr = safeNum(v.核心数值?.淫乱恶堕), mode = userSettings.personaMode || "evolution", rules = [];
        if (mode === "despair") rules.push(`- 【💧彻底绝望型人格】：正文中${u}面对侵犯都处于绝望哭泣、求饶与失禁哀鸣状态！`);
        else if (mode === "addicted") rules.push(`- 【🥵沉沦变态型人格】：正文中${u}会主动掰开肉洞乞求更粗暴的灌精与改造！`);
        else if (mode === "contrast") rules.push(userSettings.contrastInnerActive ? `- 【🎭私下母畜态】：${u}完全卸下伪装，极度饥渴下流！` : `- 【🎭表面伪装态】：${u}表面强装端庄，裙底实则湿透漏精暗颤！`);

        if (dev.totalLedgerCount === 0 && totalMl === 0 && corr < 15 && dev.all6OrganAvg === 0 && mode === "evolution") {
            rules.push(`- 【🌸完好清白状态】：当前${u}器官完好，若无实质侵犯须保持端庄矜持。`);
        } else {
            if (dev.vagObj.tier >= 4) rules.push(`- 【💀小穴Lv.${dev.vagObj.tier + 1}】：穴口松弛外翻合不拢，走动时漏精吸气，严禁写紧致如处女！`);
            if (dev.wombObj.tier >= 4) rules.push(`- 【💀子宫Lv.${dev.wombObj.tier + 1}】：宫颈重度下垂外翻至穴口，随时张口索精！`);
            if (dev.clitObj.tier >= 4) rules.push(`- 【💀尿道Lv.${dev.clitObj.tier + 1}】：阴蒂肥大勃起，稍受刺激必伴随失禁漏尿与潮吹！`);
            if (dev.analObj.tier >= 4) rules.push(`- 【💀后庭Lv.${dev.analObj.tier + 1}】：肛门括约肌松弛不合、直肠粘膜外翻！`);
            if (totalMl > 0) rules.push(`- 【🥛体内储精${totalMl}ml】：走动或站立须写出下腹坠胀与白浊滴淌细节。`);
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
        if (userSettings.parasiteState?.lv > 0) {
            rules.push(`- 【🦠异种寄生(${userSettings.parasiteState.type} Lv.${userSettings.parasiteState.lv})】：体内寄生生物正在蠕动分泌催情粘液（产卵数：${userSettings.parasiteState.eggCount}）！`);
        }
        if (Array.isArray(userSettings.hypnoTriggers) && userSettings.hypnoTriggers.length > 0) {
            rules.push(`- 【🔔催眠条件反射钢印】：${userSettings.hypnoTriggers.join("；")}（一旦正文中出现触发条件，身体必须无视理智强制执行反应！）`);
        }
        customPromptRules.forEach(fn => { try { const r = fn(u, v); if (r) rules.push(`- ${r}`); } catch (e) {} });
        if (userSettings.customExtraPrompt && safeStr(userSettings.customExtraPrompt).trim()) {
            rules.push(`- 【🛠️自定义铁律】：${safeStr(userSettings.customExtraPrompt).trim().replace(/{user}/g, u)}`);
        }
        return rules.length ? `\n【🚨状态栏1.0一致性铁律】\n${rules.join("\n")}\n` : "";
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

    function getLockedAppearanceTags(u, v) {
        if (v?.档案?.锁定外貌DNA && safeStr(v.档案.锁定外貌DNA).trim()) {
            return safeStr(v.档案.锁定外貌DNA).trim();
        }
        const ctx = safeCtx();
        const recentMes = (ctx?.chat || []).slice(0, 3).map(m => safeStr(m?.mes)).join(" ");
        const rawText = `${safeStr(v?.档案?.肉体外貌实况)} ${recentMes} ${safeStr(ctx?.characters?.[ctx?.characterId]?.description)}`;
        const tags = [];
        if (/白发|银发|雪发|silver hair|white hair/i.test(rawText)) tags.push("silver hair");
        else if (/金发|黄发|blonde/i.test(rawText)) tags.push("blonde hair");
        else if (/粉发|pink hair/i.test(rawText)) tags.push("pink hair");
        else if (/紫发|purple hair/i.test(rawText)) tags.push("purple hair");
        else if (/蓝发|blue hair/i.test(rawText)) tags.push("blue hair");
        else if (/红发|red hair/i.test(rawText)) tags.push("red hair");
        else if (/棕发|栗发|brown hair/i.test(rawText)) tags.push("brown hair");
        else tags.push("black hair");

        if (/双马尾|twintails/i.test(rawText)) tags.push("twintails");
        else if (/马尾|ponytail/i.test(rawText)) tags.push("ponytail");
        else if (/短发|short hair/i.test(rawText)) tags.push("short hair");
        else tags.push("long hair, bangs");

        if (/红瞳|赤瞳|red eyes/i.test(rawText)) tags.push("red eyes");
        else if (/金瞳|golden eyes/i.test(rawText)) tags.push("golden eyes");
        else if (/紫瞳|purple eyes/i.test(rawText)) tags.push("purple eyes");
        else if (/蓝瞳|blue eyes/i.test(rawText)) tags.push("blue eyes");

        if (/丰满|巨乳|爆乳/i.test(rawText)) tags.push("large breasts, voluptuous body");
        else if (/娇小|贫乳|平胸/i.test(rawText)) tags.push("petite, small breasts");
        else tags.push("medium breasts, slender waist");
        return tags.join(", ");
    }

    async function aiLockAppearanceByChinese(chineseInput) {
        const u = detectProtagonistName(curVars);
        const ctx = safeCtx();
        const recentChat = (ctx?.chat || []).slice(-3).map(m => safeStr(m?.mes)).join("\n").slice(0, 500);
        const rawSource = safeStr(chineseInput).trim() || `${safeStr(ctx?.characters?.[ctx?.characterId]?.description).slice(0, 500)}\n${recentChat}\n${safeStr(curVars.档案?.肉体外貌实况)}`;
        if (userSettings.apiUrl && userSettings.apiKey) {
            try {
                showToast(`🤖 正在通过 AI 为本局角色【${u}】提炼外貌 Tag...`, "info", 3000);
                const { reply } = await callSubApiRaw(
                    "Convert the character appearance into concise Danbooru English tags separated by commas. Output ONLY English tags.",
                    `Character: ${u}\nAppearance: ${rawSource}`
                );
                const clean = safeStr(reply).replace(/[\n\r"'`。！]/g, "").trim();
                if (clean.length > 3) {
                    curVars.档案 = curVars.档案 || {};
                    curVars.档案.锁定外貌DNA = clean;
                    userSettings.lockedAppearanceTags = clean;
                    saveChatCache(curVars);
                    saveSettings();
                    renderBody();
                    showToast(`✅ 已锁定本局【${u}】专属外貌：${clean}`, "success", 3800);
                    return clean;
                }
            } catch (e) {}
        }
        const dict = [
            [/白发|银发|雪发/, "silver hair"], [/金发|黄发/, "blonde hair"], [/黑发|黑长直|青丝/, "black hair"],
            [/粉发|樱发/, "pink hair"], [/紫发/, "purple hair"], [/蓝发|冰蓝/, "blue hair"], [/红发|赤发/, "red hair"], [/棕发|栗发/, "brown hair"],
            [/双马尾/, "twintails"], [/马尾/, "ponytail"], [/短发/, "short hair"], [/长发|及腰/, "long hair"], [/刘海/, "bangs"], [/丸子头|发髻/, "hair bun"],
            [/红瞳|赤瞳|红眼/, "red eyes"], [/金瞳|黄眼/, "golden eyes"], [/蓝瞳|蓝眼/, "blue eyes"], [/紫瞳|紫眼/, "purple eyes"], [/绿瞳/, "green eyes"],
            [/巨乳|爆乳|丰满|大奶/, "huge breasts, voluptuous body, wide hips"], [/贫乳|平胸|娇小|萝莉/, "petite, small breasts"],
            [/黑丝/, "black pantyhose"], [/白丝/, "white thighhighs"], [/网袜/, "fishnets"], [/眼镜/, "glasses"], [/泪痣/, "mole under eye"], [/猫耳|兽耳/, "cat ears"]
        ];
        const matched = [];
        dict.forEach(([reg, en]) => { if (reg.test(rawSource)) matched.push(en); });
        if (!matched.length) matched.push(getLockedAppearanceTags(u, curVars));
        const resTags = [...new Set(matched)].join(", ");
        curVars.档案 = curVars.档案 || {};
        curVars.档案.锁定外貌DNA = resTags;
        userSettings.lockedAppearanceTags = resTags;
        saveChatCache(curVars);
        saveSettings();
        renderBody();
        showToast(`✅ 已锁定本局【${u}】外貌：${resTags}`, "success", 3800);
        return resTags;
    }

    function getProtagScopedImgKey(editKey, stageNum) {
        const u = detectProtagonistName(curVars) || "protag";
        const chatKey = getChatStoreKey().replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_").slice(-32);
        return `${chatKey}_${u}_${editKey}_${stageNum}`;
    }

    function getGlobalPinKey(editKey, stageNum) {
        return `global_pin_${editKey}_${stageNum}`;
    }

    function buildDanbooruImageBlock(item, curStageIdx, u) {
        const key = item.editKey || "custom";
        const stageNames = ["初绽完好", "初步驯化", "深度开发", "括约肌松弛", "重度畸变", "彻底崩坏"];
        const idx = Math.min(5, Math.max(0, curStageIdx - 1)), stgTag = stageNames[idx];
        const charDnaTags = getLockedAppearanceTags(u, curVars);
        const dur = safeNum(userSettings.clothDurability, 100);
        const dmgTag = dur <= 15 ? "completely nude, shredded clothes scraps, " : dur <= 45 ? "heavily torn clothes, ripped pantyhose, exposed skin, " : dur <= 75 ? "disheveled clothes, messy collar, " : "";
        const paraTag = userSettings.parasiteState?.lv > 0 ? ", glowing pink parasite tentacles, slime fluid" : "";

        const sp = curVars.体内精液存量 || {}, totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
        const contextStr = `${safeStr(curVars.实况?.当前姿势)} ${safeStr(item.desc)} ${safeStr(curVars.痕迹与标记?.体表痕迹)} ${safeStr(curVars.痕迹与标记?.淫纹与刻印)}`;
        const liveDynamicList = [];
        if (/透明.*肚|半透明.*腹|孵化巢/i.test(contextStr) || userSettings.patchExtremeWomb?.glassBelly) liveDynamicList.push("translucent belly skin, visible womb cross-section, cum inside womb");
        if (/巨肚|临盆|怀卵|孕肚|1\d\dcm/i.test(contextStr) || safeNum(curVars.受孕与生理?.怀孕进度) >= 45 || userSettings.patchExtremeWomb?.rapidSwell) liveDynamicList.push("hyper pregnant, huge distended pregnant belly");
        if (/产卵|肉卵|生卵/i.test(contextStr) || userSettings.patchExtremeWomb?.endlessBirth) liveDynamicList.push("oviposition, laying glistening eggs");
        if (/双V|比出双V/i.test(contextStr) || userSettings.patchAhegaoBrain?.doublePeace) liveDynamicList.push("double peace sign, ahegao, tongue hanging out, rolled back eyes");
        if (/喷尿|失禁|漏尿/i.test(contextStr)) liveDynamicList.push("peeing, urinary incontinence, yellow urine stream");
        if (/M字|大开腿/i.test(contextStr)) liveDynamicList.push("m legs, spread legs wide");
        if (/四肢着地|爬行|跪趴/i.test(contextStr)) liveDynamicList.push("all fours, doggy style posture");
        if (totalMl >= 30) liveDynamicList.push("cum overflow, thick white semen dripping down thighs");
        const liveExtra = liveDynamicList.length ? ", " + liveDynamicList.join(", ") : "";

        const faceExpr = [
            "calm expression, pure clear eyes, composed aura, slight blush",
            "shy expression, embarrassed blush, biting lower lip, watery eyes",
            "heavy breathing, misty eyes, needy blushing face, parted glossy lips",
            "aroused expression, heart-shaped pupils, drooling slightly, submissive gaze",
            "ahegao, rolled back eyes, tongue hanging out, heavy flush, saliva string",
            "extreme mind break ahegao, empty heart eyes, profuse drooling, double peace sign, corrupted lewd smile"
        ][idx];

        const holePresets = {
            "骚口实况": [
                "close-up, mouth and lips focus, parted glossy pink lips, pink tongue tip, saliva string",
                "close-up, open mouth and tongue focus, swollen red lips, protruding wet tongue, white cum on tongue",
                "macro shot, wide open mouth focus, deep throat view, flattened tongue, visible uvula, frothy cum",
                "macro shot, gaping mouth and relaxed throat hole focus, everted lips, yellow fluid and cum in throat",
                "macro shot, dislocated gaping mouth focus, swollen everted lips, limp tongue hanging out, frothy cum",
                "macro shot, corrupted gaping mouth focus, dilated throat hole, overflowing thick cum, ruined oral hole"
            ],
            "小穴实况": [
                "macro shot, pussy focus, tight closed pink labia, virgin pussy, clean skin",
                "macro shot, pussy focus, slightly parted red swollen labia, clear vaginal fluids, wet string",
                "macro shot, pussy focus, dark swollen everted labia minora, thick white cum leaking",
                "macro shot, gaping pussy focus, relaxed open vaginal hole, visible red interior, overflowing cum",
                "macro shot, ruined gaping pussy focus, prolapsed vaginal folds, everted labia, heavy cum overflow",
                "macro shot, corrupted gaping pussy focus, permanently gaping ruined pussy, prolapsed visible cervix, overflowing cum"
            ],
            "子宫实况": [
                "macro shot, internal vaginal cross-section view, tight closed cervix, clean pink mucosa",
                "macro shot, internal cervix focus, red swollen cervix, cum on cervix",
                "macro shot, dilated cervix focus, open cervical os, thick cum pouring into womb",
                "macro shot, gaping cervix focus, relaxed open womb entrance, overflowing semen",
                "macro shot, uterine prolapse focus, swollen cervix protruding near vaginal opening, dripping cum",
                "macro shot, extreme cervical prolapse focus, bruised cervix hanging outside gaping pussy, bubbling cum"
            ],
            "胸部实况": [
                "close-up, breasts focus, perky breasts, small pink nipples, clean skin",
                "macro shot, nipple focus, swollen erect pink nipples, wet saliva on breasts",
                "macro shot, dark wide areola, puffy nipples, milk droplets leaking",
                "macro shot, lactating breasts focus, squirting breast milk, visible veins",
                "macro shot, huge sagging lactating breasts, dilated nipple holes, heavy milk and cum dripping",
                "macro shot, corrupted sagging udder breasts focus, gaping nipple holes, gushing thick milk"
            ],
            "阴蒂尿道": [
                "macro shot, clitoris focus, small hooded pink clit, tight urethral opening",
                "macro shot, swollen erect clitoris, glistening wet skin",
                "macro shot, enlarged hyper clitoris, throbbing red clit, wet fluids",
                "macro shot, dilated urethral meatus, leaking yellow stream, enlarged clit",
                "macro shot, clitoris hypertrophy, gaping urethra hole, gushing female ejaculation",
                "macro shot, extreme clitoris hypertrophy, permanently gaping urethral hole, overflowing foam"
            ],
            "屁眼实况": [
                "macro shot, anus focus, tight closed pink anus, clean skin",
                "macro shot, swollen red anus, spanked red ass cheeks, wet lube",
                "macro shot, relaxed smooth anal ring, cum leaking from anus",
                "macro shot, gaping anus focus, open anal hole, visible red rectum interior, overflowing cum",
                "macro shot, anal prolapse focus, everted red rectal mucosa ring, dripping thick cum",
                "macro shot, extreme anal prolapse focus, protruding red rectal tube, overflowing frothy cum"
            ]
        };

        if (holePresets[key]) {
            const tag = holePresets[key][idx];
            return `第${idx + 1}阶段：${key}_${curStageIdx}（${stgTag}）\n<image>\n[${item.cleanTitle || key}第${curStageIdx}阶特写]\n<image_think>\n展现${u}的${item.cleanTitle || key}第${curStageIdx}阶（${stgTag}）微距特写。\n</image_think>\nimage###Scene:NSFW, 1girl, solo, ${dmgTag}1.4::${charDnaTags}::, 1.5::extreme close-up, ${tag}${liveExtra}, filling the frame::, dark erotic lighting;\nChar1:1.5::${u}, ${charDnaTags}::, sweaty skin, 1.8::${tag}${paraTag}${liveExtra}::|centers:C3;\nChar1 UC:1.5::full body, zoomed out, multiple views, text, watermark::;###\n</image>`;
        }

        const stageBodyProgression = [
            "neat posture, clean skin, composed demeanor",
            "slightly disheveled, light sweat on skin, shy posture",
            "sweaty glistening skin, trembling thighs, submissive posture, wet stains",
            "heavily aroused posture, spread legs, cum stains on skin, messy hair",
            "corrupted posture, m legs spread wide, body writing tally marks, overflowing cum, drooling",
            "completely ruined meat toilet posture, extreme ahegao, double peace sign, gaping holes leaking cum and pee"
        ][idx];

        const nonHoleMap = {
            "身份与背景": `portrait, upper body, face focus, looking at viewer, ${stageBodyProgression}, ${faceExpr}`,
            "肉体外貌":   `full body shot, curves, detailed skin, ${stageBodyProgression}, ${faceExpr}`,
            "表里风评":   `upper body, medium shot, ${stageBodyProgression}, ${faceExpr}`,
            "挂牌身价":   `cowboy shot, alluring posture, ${stageBodyProgression}, ${faceExpr}`,
            "内心独白":   `close-up face portrait, expressive eyes, ${faceExpr}`,
            "当前姿势":   `full body shot, dynamic posture, ${stageBodyProgression}, ${faceExpr}`,
            "cockLove":   `upper body portrait, face focus, longing gaze, ${stageBodyProgression}, ${faceExpr}`,
            "lust":       `upper body, heavy blush, sweaty feverish skin, hot breath, ${stageBodyProgression}, ${faceExpr}`,
            "corr":       `cowboy shot, dark seductive lighting, ${stageBodyProgression}, ${faceExpr}`,
            "shame":      `cowboy shot, blushing furiously, ${stageBodyProgression}, ${faceExpr}`,
            "obey":       `kneeling full body, submissive posture, looking up at viewer, ${stageBodyProgression}, ${faceExpr}`,
            "pleas":      `cowboy shot, trembling, arched back, ${stageBodyProgression}, ${faceExpr}`,
            "精神沦陷":   `close-up face focus, hypnotic glowing eyes, ${faceExpr}`,
            "媚药毒瘾":   `upper body, flushed feverish skin, panting, ${stageBodyProgression}, ${faceExpr}`,
            "正字涂鸦":   `cowboy shot, body writing on skin, black tally marks on thigh and belly, ${stageBodyProgression}, ${faceExpr}`,
            "淫纹烙印":   `midriff and lower abdomen focus, glowing pink lewd womb tattoo on belly, ${stageBodyProgression}`,
            "穿刺环饰":   `torso close-up, nipple rings and clit piercing, silver chains glinting on skin, ${stageBodyProgression}`,
            "体内道具":   `cowboy shot, trembling thighs, pink vibrator cord hanging between legs, ${stageBodyProgression}, ${faceExpr}`,
            "穿搭_头饰":  `head and upper body focus, hairstyle, hair ornament, detailed face, ${faceExpr}`,
            "穿搭_颈部":  `neck and collarbone focus, choker or collar, slender neck, ${faceExpr}`,
            "穿搭_胸罩":  `upper body focus, brassiere or innerwear on chest, cleavage, ${stageBodyProgression}`,
            "穿搭_上衣":  `upper body and waist focus, top clothing, ${stageBodyProgression}, ${faceExpr}`,
            "穿搭_内裤":  `hips and panties focus, underwear fabric, thighs, ${stageBodyProgression}`,
            "穿搭_下装":  `lower body and waist focus, skirt or pants, hips, ${stageBodyProgression}`,
            "穿搭_丝袜":  `legs and stockings focus, thighhighs or pantyhose, slender thighs, ${stageBodyProgression}`,
            "穿搭_鞋子":  `feet and shoes focus, ankles and footwear, lower legs`,
            "排卵周期":   `cowboy shot, hand resting on lower abdomen, glowing womb aura, ${stageBodyProgression}, ${faceExpr}`,
            "受精断面":   `lower abdomen and torso focus, warm womb cross-section glow, ${stageBodyProgression}`,
            "精液归属":   `full body lying down, covered in thick white cum, afterglow, ${stageBodyProgression}, ${faceExpr}`,
            "孕肚进度":   `cowboy shot, cradling distended pregnant belly, ${idx >= 3 ? "hyper pregnant, huge belly, stretch marks, " : ""}${idx === 5 ? "translucent belly skin, visible eggs inside womb, " : ""}${faceExpr}`
        };
        const chosenTag = nonHoleMap[key] || `cowboy shot, solo, ${stageBodyProgression}, ${faceExpr}`;
        return `第${idx + 1}阶段：${key}_${curStageIdx}（${stgTag}）\n<image>\n[${u}的${item.cleanTitle || key}第${curStageIdx}阶特写]\n<image_think>\n展现${u}的${item.cleanTitle || key}（第${curStageIdx}阶·${stgTag}）。\n</image_think>\nimage###Scene:NSFW, 1girl, solo, ${dmgTag}1.5::masterpiece, best quality, ${charDnaTags}, ${chosenTag}${liveExtra}::, detailed background;\nChar1:1.5::${u}, ${charDnaTags}::, ${chosenTag}${paraTag}${liveExtra}|centers:C3;\nChar1 UC:1.5::multiple views, lowres, bad anatomy, text, watermark::;###\n</image>`;
    }

    // =========================================================================
    // 🔬 模块3：支持「👆手指直接按压把玩挤精/潮吹」的 X-Ray 全息内窥遥测中心
    // =========================================================================
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

    function extractDynamicContext(u) {
        const ctx = safeCtx(), chatArr = ctx?.chat || [], charDesc = safeStr(ctx?.characters?.[ctx?.characterId]?.description), personaDesc = safeStr(ctx?.power_user?.persona_description);
        const res = { identity: "", bodyDesc: "", thought: "", pose: "", mouth: "", chest: "", vag: "", womb: "", anal: "", headWear: "", neckWear: "", braWear: "", topWear: "", pantyWear: "", bottomWear: "", sockWear: "", shoeWear: "" };
        const endIdx = viewingHistoryFloor !== null ? Math.min(chatArr.length, viewingHistoryFloor + 1) : chatArr.length;
        const recent = chatArr.slice(Math.max(0, endIdx - 6), endIdx), allSents = [];
        for (let i = recent.length - 1; i >= 0; i--) {
            const raw = safeStr(recent[i]?.mes).replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>/gi, "");
            if (!raw) continue;
            const cleanBody = raw.split(/【\s*状态栏|<UpdateVariable>|<options>/i)[0] || raw;
            if (!res.thought) {
                const im = [...cleanBody.matchAll(/\*([^*\\n]{12,500})\*/g)].map(m => m[1].trim());
                if (im.length) res.thought = im[im.length - 1];
            }
            allSents.push(...cleanBody.split(/[。！？；\n\r]+/).map(s => s.replace(/\*[^*]*\*/g, "").replace(/<\/?[a-z]+>/gi, "").trim()).filter(s => s.length > 4));
        }
        const pick = (regex, maxCount = 2) => {
            const matched = allSents.filter(s => s.length < 150 && regex.test(s));
            return matched.length ? matched.slice(0, maxCount).join("；") + "。" : "";
        };
        res.identity = pick(/(?:身份|原本是|继承人|大小姐|千金|夫人|妻子|身处)/, 2) || (personaDesc ? personaDesc.slice(0, 120) : `${u}当前正处于剧情互动中。`);
        res.bodyDesc = pick(/(?:容颜|肌肤|皮肤|青丝|长发|柳腰|曲线|身段|丰满|白皙|臀|腿)/, 3) || (charDesc ? charDesc.slice(0, 120) : `${u}拥有细腻敏感的身躯。`);
        res.pose = pick(/(?:撑起|扶着|站起|捂住|喘息|瘫坐|跪|趴|弯腰|夹紧|躺)/, 2);
        res.mouth = pick(/(?:喉咙|声音|嗓音|红唇|唇瓣|舌|喘|吞咽|涎)/, 2);
        res.chest = pick(/(?:胸|乳|丰盈|双峰|蓓蕾|奶|锁骨)/, 2);
        res.vag = pick(/(?:下身|阴唇|花唇|小穴|私处|爱液|湿热|淫水|甬道)/, 2);
        res.womb = pick(/(?:小腹|下腹|子宫|宫颈|肚子|深处|内射|精液|白浊|坠胀)/, 2);
        res.anal = pick(/(?:臀|屁股|后庭|屁眼|菊|腰臀|掌印)/, 2);
        res.headWear = pick(/(?:青丝|长发|发丝|发簪|发带|眼罩|耳环|口球|头饰)/, 2);
        res.neckWear = pick(/(?:项圈|锁骨|雪颈|脖颈|项链|铃铛|锁链|衣领)/, 2);
        res.braWear = pick(/(?:裹胸|胸罩|文胸|乳夹|肚兜|内衬|真空|乳头)/, 2);
        res.topWear = pick(/(?:上衣|T恤|衬衫|外套|长袍|毛衣|束腰|衣襟|睡裙)/, 2);
        res.pantyWear = pick(/(?:内裤|底裤|衬裤|丁字裤|开裆|胖次|光裸)/, 2);
        res.bottomWear = pick(/(?:长裙|短裙|裙摆|百褶裙|裤子|短裤|热裤)/, 2);
        res.sockWear = pick(/(?:丝袜|黑丝|白丝|吊带袜|网袜|长袜|大腿|双腿)/, 2);
        res.shoeWear = pick(/(?:高跟鞋|皮鞋|拖鞋|凉鞋|鞋子|玉足|脚趾|赤足)/, 2);
        return res;
    }

    function getDynamicMetricDetail(type, v, u) {
        const ovr = v.按钮详情?.[type];
        const map = {
            cockLove: { val: safeNum(v.核心数值?.对肉棒好感度), rev: false, st: ["抗拒戒备","粘膜适应","空虚渴求","跪舔崇拜","断根戒断","脑干阳具寄生"], d: [
                `【🔬 阳具好感（Lv.1 完好戒备）】：${u}理智完好，对雄性阳具保持警惕与排斥。\n💭【${u}的实时心声】：“*我必须保持距离，绝不能让自己的清白受到玷污。*”`,
                `【🔬 阳具好感（Lv.2 粘膜适应）】：粘膜在摩擦中记住了阳具轮廓与热度。\n💭【${u}的实时心声】：“*虽然还是觉得难为情，但身体粘膜似乎渐渐适应了那种滚烫温度💦……*”`,
                `【🔬 阳具好感（Lv.3 空虚渴求）】：神经已在抽插中食髓知味，空虚时内壁泛起酸痒。\n💭【${u}的实时心声】：“*里面隐隐有些发空发痒，好想念被塞满时的充实感呀😳💦……*”`,
                `【🔬 阳具好感（Lv.4 跪舔崇拜）】：快感中枢已被驯化，闻到气息便双腿发软。\n💭【${u}的实时心声】：“*浓烈的气息一冲进鼻腔下面就已经湿透了，好想快点跪下来服侍呀🥵💦！*”`,
                `【🔬 阳具好感（Lv.5 断根戒断）】：重度阳具成瘾，脱离肉棒即引发戒断发抖。\n💭【${u}的实时心声】：“*呜汪♡……没有大肉棒塞着全身骨头都难受，求求快插进来吧🥵💦❤️！*”`,
                `【💀 第六阶段·脑干阳具寄生（100% 彻底崩坏）】：视觉与嗅觉中枢彻底崩坏，眼中只有肉棒！\n💭【${u}的实时心声】：“*啊嘿♡……脑干里全都长满大肉棒的形状了，请永远焊死在肉洞里吧🥵💦❤️❤️！*”`
            ]},
            lust: { val: safeNum(v.核心数值?.性欲程度), rev: false, st: ["清心克制","春情微燥","欲火焚身","重度发骚","狂暴发情","下丘脑烧毁"], d: [
                `【🔬 情欲实况（Lv.1 清心完好）】：内分泌系统平稳，心神清澈冷静。\n💭【${u}的实时心声】：“*现在心境很平静，没有任何奇怪的燥热感。*”`,
                `【🔬 情欲实况（Lv.2 春情微燥）】：雌激素微升，小腹深处泛起淡淡温热。\n💭【${u}的实时心声】：“*唔……不知怎么身体稍微有些发热💦。*”`,
                `【🔬 情欲实况（Lv.3 欲火焚身）】：情欲翻涌，乳尖发硬，私处分泌湿润春水。\n💭【${u}的实时心声】：“*身体烫得厉害，两腿之间已经湿漉漉地黏在一起了😳💦！*”`,
                `【🔬 情欲实况（Lv.4 重度发骚）】：双腿本能交叠磨蹭，眼神迷离拉丝。\n💭【${u}的实时心声】：“*哈啊……淫水根本止不住地往外淌，满脑子都想着被按住灭火呀🥵💦！*”`,
                `【🔬 情欲实况（Lv.5 狂暴发情）】：理智被情欲吞没，三穴不断涌出粘液求配。\n💭【${u}的实时心声】：“*啊啊♡……发情一秒钟都停不下来了，快把我按在地上狠狠干烂吧🥵💦❤️！*”`,
                `【💀 第六阶段·下丘脑烧毁（100% 彻底崩坏）】：下丘脑彻底烧毁，化作永不停歇的发情肉偶！\n💭【${u}的实时心声】：“*啊嘿♡……发情开关彻底烧化坏死了，不睡觉也要永远挨操交配呀🥵💦❤️❤️！*”`
            ]},
            corr: { val: safeNum(v.核心数值?.淫乱恶堕), rev: false, st: ["完好清白","初度染尘","食髓知味","放荡娼妇","公用精盆","彻底崩坏肉坑"], d: [
                `【🔬 恶堕实况（Lv.1 完好清白）】：人格与道德尊严完好无损。\n💭【${u}的实时心声】：“*无论处境如何变化，我都绝不会放弃自己的尊严底线。*”`,
                `【🔬 恶堕实况（Lv.2 初度染尘）】：矜持防线出现裂痕，被动顺从。\n💭【${u}的实时心声】：“*虽然心里有些屈辱，但似乎不像最开始那样剧烈抗拒了💦……*”`,
                `【🔬 恶堕实况（Lv.3 食髓知味）】：对情事产生熟练肌肉记忆，道德负罪感消退。\n💭【${u}的实时心声】：“*身体早就习惯了男人的温度，甚至会忍不住主动夹紧迎合呢😳💦。*”`,
                `【🔬 恶堕实况（Lv.4 放荡娼妇）】：尊严坍塌，彻底享受放荡欢愉。\n💭【${u}的实时心声】：“*什么清白体面全都是多余的，哪有张开双腿享受内射来得快活呀🥵💦！*”`,
                `【🔬 恶堕实况（Lv.5 公用精盆）】：完全将自己视作公用排泄精盆。\n💭【${u}的实时心声】：“*呜汪♡……我就是一件只要张开腿就能随便射精的公用精盆🥵💦❤️！*”`,
                `【💀 第六阶段·排泄肉坑（100% 彻底崩坏）】：自尊回路100%坏死清零！\n💭【${u}的实时心声】：“*啊嘿♡……人类的人格已经彻底死掉啦，请把臭肉洞操烂报废吧🥵💦❤️❤️！*”`
            ]},
            shame: { val: safeNum(v.精神与心理?.羞耻度, 100), rev: true, st: ["羞愤自持","耳根滚烫","习以为常","敞腿任看","羞耻全灭","羞耻神经坏死"], d: [
                `【🔬 羞耻防线（Lv.1 完好自持）】：羞耻心极强，注重衣着得体。\n💭【${u}的实时心声】：“*必须注意整理好衣襟与姿态，绝不能让人看到不雅模样。*”`,
                `【🔬 羞耻防线（Lv.2 耳根滚烫）】：暴露下耳根滚烫，遮挡动作迟疑。\n💭【${u}的实时心声】：“*脸颊烫得厉害……被人盯着看连手脚都不知道往哪放了😳💦。*”`,
                `【🔬 羞耻防线（Lv.3 习以为常）】：羞耻感磨平大半，赤裸时已平静麻木。\n💭【${u}的实时心声】：“*光着身子走动或者清理私处，现在的我早已经习以为常了💦。*”`,
                `【🔬 羞耻防线（Lv.4 敞腿任看）】：被人视奸私处时反而兴奋分泌爱液。\n💭【${u}的实时心声】：“*就算被人撞见一丝不挂的模样，我也会直接敞开双腿让他看个够哟🥵💦！*”`,
                `【🔬 羞耻防线（Lv.5 羞耻全灭）】：羞耻逆转为催情剂，渴望当众展示烂穴。\n💭【${u}的实时心声】：“*啊啊♡……快让所有人都来看看这具还在漏精滴尿的骚身体吧🥵💦❤️！*”`,
                `【💀 第六阶段·羞耻坏死（0/100 彻底崩坏）】：只有当众敞穴喷尿才能刺激高潮！\n💭【${u}的实时心声】：“*啊嘿♡……羞耻是什么早就忘光啦！看母猪当众喷尿失禁高潮吧🥵💦❤️❤️！*”`
            ]},
            obey: { val: safeNum(v.精神与心理?.服从度), rev: false, st: ["孤高自主","被动妥协","温顺配合","摇尾乞怜","绝对盲从","前额叶切除木偶"], d: [
                `【🔬 服从实况（Lv.1 完好自主）】：自我意志独立坚定。\n💭【${u}的实时心声】：“*我的身体与意志只属于我自己，休想随便摆布我。*”`,
                `【🔬 服从实况（Lv.2 被动妥协）】：在压迫下学会低头妥协。\n💭【${u}的实时心声】：“*人在屋檐下不得不低头……眼下还是先顺从配合吧💦。*”`,
                `【🔬 服从实况（Lv.3 温顺配合）】：已形成温顺配合的肌肉记忆。\n💭【${u}的实时心声】：“*乖乖听话把身体收拾干净，身体已经完全习惯顺从了😳💦。*”`,
                `【🔬 服从实况（Lv.4 摇尾乞怜）】：反抗意志被驯服，主动塌腰撅臀讨好。\n💭【${u}的实时心声】：“*只要一声令下，无论让我摆出什么姿势伺候都会乖乖照做的🥵💦！*”`,
                `【🔬 服从实况（Lv.5 绝对盲从）】：完全丧失拒绝能力。\n💭【${u}的实时心声】：“*呜汪♡……只要主人们高兴，要把我怎么捆起来内射都可以呀🥵💦❤️！*”`,
                `【💀 第六阶段·木偶化（100% 彻底崩坏）】：只会条件反射执行任何下流指令！\n💭【${u}的实时心声】：“*啊嘿……呜汪♡……脑子空空的不会思考了，主人让怎么弄坏就怎么弄坏呀🥵💦❤️❤️！*”`
            ]},
            pleas: { val: safeNum(v.精神与心理?.快感累积), rev: false, st: ["神思清明","尾椎微麻","趾尖蜷缩","濒临绝顶","潮吹失神","多巴胺烧穿熔断"], d: [
                `【🔬 快感负荷（Lv.1 完好清明）】：神经系统平稳正常。\n💭【${u}的实时心声】：“*呼吸平稳，身体没有任何异常的酸麻或失控感。*”`,
                `【🔬 快感负荷（Lv.2 尾椎微麻）】：敏感带残留微弱酥麻余温。\n💭【${u}的实时心声】：“*呼……身体深处还残留着一点微妙的酸麻感💦。*”`,
                `【🔬 快感负荷（Lv.3 趾尖蜷缩）】：酥麻电流顺尾椎攀升，脚趾蜷缩。\n💭【${u}的实时心声】：“*唔嗯……酥麻感一波接一波往上涌，脚趾都蜷缩起来了😳💦！*”`,
                `【🔬 快感负荷（Lv.4 濒临绝顶）】：快感蓄积至临界点，括约肌剧烈收缩。\n💭【${u}的实时心声】：“*要、要去了！再刺激一下就会当场高潮出来的呀🥵💦！*”`,
                `【🔬 快感负荷（Lv.5 潮吹失神）】：连续高潮过载导致大脑空白潮吹。\n💭【${u}的实时心声】：“*啊啊——去了♡！！全身骨头都爽得融化成水了🥵💦❤️！*”`,
                `【💀 第六阶段·多巴胺熔断（100% 彻底崩坏）】：陷入永不停止的痉挛绝顶！\n💭【${u}的实时心声】：“*啊嘿♡——脑髓彻底烧穿短路啦，一秒钟不停地抽搐喷尿高潮到死呀🥵💦❤️❤️！*”`
            ]},
            sta: { val: safeNum(v.身体?.体力, 100), rev: true, st: ["亭亭玉立","腰腿酸软","膝软外八不合","双腿痉挛瘫软","髋骨脱臼爬行","四肢废用肉垫"], d: [
                `【🔬 躯体机能（Lv.1 完好充沛）】：体力充沛（${safeNum(v.身体?.体力, 100)}/100），身姿挺拔。\n💭【${u}的实时心声】：“*目前精力很充沛，姿态端正稳健。*”`,
                `【🔬 躯体机能（Lv.2 腰腿酸软）】：腰腹与双腿肌肉酸软沉重。\n💭【${u}的实时心声】：“*稍微出了一身薄汗，腰和腿都有点酸沉沉的💦。*”`,
                `【🔬 躯体机能（Lv.3 膝软外八不合）】：大腿内收肌拉伤松弛，走路外八字。\n💭【${u}的实时心声】：“*膝盖一直在发抖，大腿根部酸软得根本并拢不了😳💦。*”`,
                `【🔬 躯体机能（Lv.4 双腿痉挛瘫软）】：体力濒临枯竭，双腿抽搐难以站稳。\n💭【${u}的实时心声】：“*哈啊……浑身一点力气都使不出来了，只能敞开腿瘫倒下来🥵💦……*”`,
                `【🔬 躯体机能（Lv.5 髋骨脱臼爬行）】：丧失直立行走能力，只能四肢着地爬行。\n💭【${u}的实时心声】：“*呜汪♡……胯骨被撞脱臼站不起来了，只能像母狗一样撅着屁股爬行呀🥵💦❤️！*”`,
                `【💀 第六阶段·四肢废用肉垫（0/100 彻底崩坏）】：脊椎长死成M字大开腿撅臀肉垫！\n💭【${u}的实时心声】：“*啊嘿♡……手脚彻底废掉啦，骨头长死成M字开腿的肉垫形状了🥵💦❤️❤️！*”`
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

    function enrichItemDescriptionAndThought(item, v, u) {
        const ovr = v.按钮详情?.[item.editKey];
        if (ovr && (ovr.desc || ovr.thought)) return item.desc;

        const parts = safeStr(item.desc).split("💭");
        const baseObj = safeStr(parts[0]).trim();
        const baseThought = parts[1] ? cleanThoughtText(parts[1].replace(/【.*?实时心声】：/g, "").replace(/[“”"]/g, "").trim()) : "";

        const dev = computeAllOrganDevelopments(v), sp = v.体内精液存量 || {}, c = v.计数 || {};
        const totalMl = safeNum(sp.口内毫升) + safeNum(sp.小穴毫升) + safeNum(sp.子宫毫升) + safeNum(sp.屁眼毫升);
        const sta = safeNum(v.身体?.体力, 100), corr = safeNum(v.核心数值?.淫乱恶堕);
        const sens = (1.0 + corr * 0.06 + dev.all6OrganAvg * 0.05 + (safeNum(c.性交?.小穴) > 0 ? 1.0 : 0)).toFixed(1);
        const key = item.editKey || "";
        const isRev = (key === "shame" || key === "sta" || key === "当前姿势");
        const pct = (item.pct !== null && item.pct !== undefined) ? item.pct : corr;
        const tier = tier6(pct, isRev);

        let extraPhysiology = "";
        if (["小穴实况", "子宫实况", "屁眼实况", "骚口实况", "胸部实况", "阴蒂尿道"].includes(key)) {
            const holeSens = [
                "粘膜紧致完好，表层温润洁净，稍有异物触碰便会本能地收缩抗拒",
                "表层粘膜充血泛红，神经末梢已被初步开发，摩擦时会泛起细密的酸麻电流",
                "肉壁褶皱已被反复撑开重塑，形成熟稔的迎合包裹记忆，空置时仍会微微战栗",
                "括约肌与内壁长期处于充血松弛状态，即使未被填塞也会微微张合、沁出湿热粘液",
                "重度器质畸变，肉口外翻难以完全闭合，稍一走动便会伴随体液滴漏与咕啾水声",
                "彻底沦为100%全天候洞开的受精排泄肉腔，神经回路已将一切粗暴贯穿100%转化为绝顶快感"
            ][tier];
            const fluidNote = totalMl > 0
                ? `当前体内更淤积着足足 ${totalMl}ml 滚烫浓精（宫腔 ${safeNum(sp.子宫毫升)}ml、小穴 ${safeNum(sp.小穴毫升)}ml、胃袋 ${safeNum(sp.口内毫升)}ml、后庭 ${safeNum(sp.屁眼毫升)}ml），沉甸甸地压迫着下腹内壁，每一次呼吸起伏都会顺着松弛的肉缝溢出一缕混杂着爱液的白浊泡沫。`
                : `当前腔内虽无明显残精淤积，但受常人 ${sens} 倍的神经敏感度影响，内壁依旧泛着一层晶莹湿润的体液光泽。`;
            extraPhysiology = `\n• 🔍 【微距粘膜与神经剖析】：${holeSens}。\n• 💧 【体液负荷与日常连锁】：${fluidNote}`;
        } else {
            const bodyStateNote = sta <= 25
                ? `此时${u}体力已彻底透支（${sta}%），全身肌肉酸软痉挛，连维持基本站立都极为勉强，只能任由汗水与体液浸透肌肤。`
                : `当前${u}体力剩余 ${sta}%，呼吸间胸口微微起伏，全身神经敏感倍率已达常人的 ${sens} 倍，衣装完好度为 ${safeNum(userSettings.clothDurability, 100)}%。`;
            const ledgerNote = `截至目前，身体已累计承受内射 ${safeNum(c.射精?.内射)} 次、绝顶高潮 ${safeNum(c.高潮?.总数)} 次、失禁漏尿 ${safeNum(c.失控?.失禁)} 次。`;
            extraPhysiology = `\n• 🩺 【躯体连锁体征】：${bodyStateNote}\n• 📜 【历史调教烙印】：${ledgerNote}`;
        }

        const specificThoughtMap = {
            "骚口实况": [
                "只要守住双唇紧闭，就绝不会发出任何羞人的声音。",
                "舌尖和喉咙深处还残留着异物顶入时的怪异酸麻感，连吞咽口水都觉得害羞💦……",
                "咽反射好像已经被彻底驯服了，只要张开嘴就会不自觉地分泌粘稠的唾液😳💦。",
                "嘴巴和嗓子眼好空虚……好想再含住滚烫硕大的肉棒深喉吞精呀🥵💦！",
                "下巴酸软得合不拢了，我的口腔和食道早就变成专门迎接射精的深喉肉壶了♡🥵💦！",
                "啊嘿嘿♡……漏斗骚嘴24小时大张着流口水，随时等大肉棒捅穿喉咙灌满胃袋呀🥵💦❤️❤️！"
            ],
            "胸部实况": [
                "胸前的衣襟必须整理妥当，绝不能让人看到丝毫起伏。",
                "乳尖被摩擦得充血发硬，隔着布料稍微蹭一下都会窜起一阵电流💦……",
                "乳晕好像变大变深了一点，双峰沉甸甸地发胀，好想被人用力揉捏把玩😳💦。",
                "奶子又热又胀，乳孔一直在往外渗出甜腻的乳汁，不快点被吸出来就太难受了🥵💦！",
                "这对硕大下垂的母畜奶袋就是为了夹住肉棒乳交、边挨操边喷奶而存在的呀♡🥵💦！",
                "啊嘿♡……紫黑大奶袋24小时失禁狂喷发情淫乳，请狠狠捏烂乳头榨干母牛吧🥵💦❤️❤️！"
            ],
            "小穴实况": [
                "双腿紧紧并拢着，私密处干爽完好，绝不容许外人触碰。",
                "花唇被磨得微微红肿发热，走路时两瓣软肉互相摩挲都会渗出湿意💦……",
                "里面的褶皱已经被撑开记住了肉棒的形状，稍微一夹腿就会听到羞人的水声😳💦。",
                "穴口已经被操得松软外翻合不拢了，里面的淫水混着残精一直在顺着大腿根往下淌🥵💦！",
                "骚穴内壁全都翻在外面一抽一吸地讨肉棒吃♡，没有巨物塞满就痒得要发疯了🥵💦❤️！",
                    "啊嘿♡……彻底崩坏的拳头大烂肉洞永远关不上门啦，随时欢迎任何粗大肉棒捅进来排泄内射呀🥵💦❤️❤️！"
                ],
                "子宫实况": [
                    "小腹平坦温暖，最深处的圣地完好无损。",
                    "小肚子最深处隐隐发酸，刚才被顶撞到的地方还在微微跳动💦……",
                    "子宫口好像变软变松了，每次被顶到花心时整个人都会失神软倒😳💦。",
                    "宫腔里灌满了滚烫的浓精，沉甸甸地往下坠，连子宫颈都在主动张合吞吸白浊🥵💦！",
                    "宫颈口已经重度下垂外翻到穴口边上了♡，只要一插进来就能直接顶进子宫里内射灌满呀🥵💦❤️！",
                    "啊嘿♡……外翻脱垂的死肉苗床24小时锁死每一滴浓精，快把子宫灌成透明破水的大肚泡芙吧🥵💦❤️❤️！"
                ],
                "阴蒂尿道": [
                    "私处神经平稳受控，没有任何失态的迹象。",
                    "充血的小豆豆露在包皮外面，稍微走动摩擦就会带来一阵酥麻酸软💦……",
                    "阴蒂肿大得合不拢腿，连下面的尿道口都跟着一阵阵发酸发麻，好怕忍不住漏出来😳💦。",
                    "尿道括约肌已经松弛失守了，只要稍微高潮或者按一下小肚子就会羞耻地漏尿失禁🥵💦！",
                    "肿大如小肉棒的阴蒂一碰就狂喷潮吹和黄尿♡，彻底变成边挨操边失禁的喷泉母狗了🥵💦❤️！",
                    "啊嘿♡……括约肌100%坏死报废啦！尿道已经被扩成第二个挨操肉洞，24小时滴滴答答漏着骚尿绝顶呀🥵💦❤️❤️！"
                ],
                "屁眼实况": [
                    "后庭紧闭洁净，那是绝对不可触碰的禁区。",
                    "臀肉上火辣辣的，后面的小孔被异物撑开过的地方还在隐隐作痛发麻💦……",
                    "肛门褶皱好像被磨平松弛了不少，居然连被插后面都能感觉到奇怪的快感了😳💦。",
                    "后庭括约肌被撑成了合不拢的小圆洞，走动时连里面的肠液和残精都锁不住了🥵💦！",
                    "鲜红的直肠粘膜已经翻出来变成脱肛肉玫瑰了♡，屁眼比前面的小穴还要渴望大肉棒粗暴抽插呀🥵💦❤️！",
                    "啊嘿♡……重度脱肛的喇叭状排泄腔彻底关不上啦，灌肠液和浓精正顺着外翻的红肉管哗哗往外漏呀🥵💦❤️❤️！"
                ]
            };

            let tailThought = "";
            if (specificThoughtMap[key]) {
                tailThought = specificThoughtMap[key][tier];
            } else if (key.startsWith("穿搭_")) {
                tailThought = [
                    "衣着穿戴得整整齐齐，礼仪无可挑剔。",
                    "衣服稍微有些凌乱贴身，得注意别走光了💦。",
                    "布料被汗水和体液沾湿贴在皮肤上，隐隐透出身体轮廓，好羞人😳💦。",
                    "穿成这样根本遮不住发烫的身体，稍微一动就会露出大片春光勾引男人视线🥵💦！",
                    "衣服早就变成凌乱破损的情趣装饰了♡，还不如直接剥光或者撕碎方便随时挨操呢🥵💦❤️！",
                    "啊嘿♡……母畜肉便器不需要任何遮羞布，全身赤裸滴着白浊展示烂肉洞才是最棒的礼服呀🥵💦❤️❤️！"
                ][tier];
            } else {
                tailThought = [
                    `目前【${item.cleanTitle || key}】依然保持在可控范围内，我必须守住这份理智。`,
                    `随着经历变多，【${item.cleanTitle || key}】带来的异样感越来越明显，身体有些不听使唤了💦。`,
                    `事到如今，【${item.cleanTitle || key}】已经彻底改变了我的习惯，连抗拒的念头都渐渐模糊了😳💦。`,
                    `只要一想到【${item.cleanTitle || key}】，尾椎骨就会窜起一阵酥麻，身体诚实地发软淌水🥵💦！`,
                    `呜汪♡……【${item.cleanTitle || key}】已经彻底刻进骨髓里了，请继续粗暴地改造我吧🥵💦❤️！`,
                    `啊嘿嘿♡……【${item.cleanTitle || key}】已经100%崩坏定型啦，脑子和身体全都变成只会高潮的形状了🥵💦❤️❤️！`
                ][tier];
            }

            return `${baseObj}${extraPhysiology}\n💭【${u}的实时心声】：“*${baseThought} ${tailThought}*”`;
        }

        function buildFullFallbackCategories(u, c, v) {
            calibrateMentalMetrics(v);
            const dev = computeAllOrganDevelopments(v), ovr = v.按钮详情 || {};
            const mk = (editKey, defaultRawKey, desc, barTheme = "pleas", subBarCfg = null, hideBar = false, stagePctOverride = null, extraProps = {}) => {
                const customTitle = ovr[editKey]?.customTitle, customStage = ovr[editKey]?.stage;
                let finalRawKey = customTitle || defaultRawKey;
                if (!customTitle && customStage && /「[^」]+」/.test(finalRawKey)) finalRawKey = finalRawKey.replace(/「[^」]+」/, `「${customStage}」`);
                const itemObj = { editKey, rawKey: finalRawKey, baseInitDesc: desc, desc, ...fmtKey(finalRawKey, barTheme, subBarCfg, hideBar, stagePctOverride), ...extraProps };
                itemObj.desc = enrichItemDescriptionAndThought(itemObj, v, u);
                return itemObj;
            };

            const live = extractDynamicContext(u), diff = getDifficultyProfile();
            const cnt = v.计数 || {}, sp = v.体内精液存量 || {}, mark = v.痕迹与标记 || {}, prop = v.体内道具与权限 || {}, extPsy = v.精神与心理扩展 || {}, prof = v.档案 || {}, rt = v.实况 || {}, wear = v.穿搭 || {}, preg = v.受孕与生理 || {};
            const cockM = getDynamicMetricDetail("cockLove", v, u), lustM = getDynamicMetricDetail("lust", v, u), corrM = getDynamicMetricDetail("corr", v, u);
            const shameM = getDynamicMetricDetail("shame", v, u), obeyM = getDynamicMetricDetail("obey", v, u), pleasM = getDynamicMetricDetail("pleas", v, u), staM = getDynamicMetricDetail("sta", v, u);

            const vagCnt = safeNum(cnt.性交?.小穴), mouthCnt = safeNum(cnt.性交?.口), analCnt = safeNum(cnt.性交?.屁眼), titCnt = safeNum(cnt.性交?.乳穴), footCnt = safeNum(cnt.性交?.足腿), beastCnt = safeNum(cnt.性交?.兽交异种);
            const creampie = safeNum(cnt.射精?.内射), facialCnt = safeNum(cnt.射精?.颜射体外), swallowCnt = safeNum(cnt.精液摄入?.吞精次数), swallowMl = safeNum(cnt.精液摄入?.累计毫升);
            const orgasmCnt = safeNum(cnt.高潮?.总数), forceOrgCnt = safeNum(cnt.高潮?.强制), edgeCnt = safeNum(cnt.高潮?.寸止);
            const leakCnt = safeNum(cnt.失控?.失禁), squirtCnt = safeNum(cnt.失控?.喷潮);
            const hookerCnt = safeNum(cnt.交易?.接客卖身), gangCnt = safeNum(cnt.交易?.轮奸群交), sleepCnt = safeNum(cnt.交易?.睡眠昏迷奸);
            const milkCnt = safeNum(cnt.泌乳?.喷乳次数), milkMl = safeNum(cnt.泌乳?.累计毫升), mastCnt = safeNum(cnt.自慰);

            let mouthMl = safeNum(sp.口内毫升), vagMl = safeNum(sp.小穴毫升), wombMl = safeNum(sp.子宫毫升), analMl = safeNum(sp.屁眼毫升);
            const totalMl = mouthMl + vagMl + wombMl + analMl, caps = calcHoleCapacities(v);
            const corr = safeNum(v.核心数值?.淫乱恶堕), lust = safeNum(v.核心数值?.性欲程度), pleas = safeNum(v.精神与心理?.快感累积);
            const isPureZero = (dev.totalLedgerCount === 0 && totalMl === 0 && corr < 15 && dev.all6OrganAvg === 0);

            const vagWidth = (1.5 + Math.min(8.5, (vagCnt / diff.mult) * 0.08 + dev.vagObj.val * 0.06)).toFixed(1);
            const clitSize = (4.0 + Math.min(22.0, (orgasmCnt / diff.mult) * 0.15 + dev.clitObj.val * 0.18)).toFixed(1);
            const peeVal = isPureZero ? 0 : Math.min(100, Math.round(dev.clitObj.val * 0.6 + lust * 0.2 + pleas * 0.2 + leakCnt * 6));
            const wetLevel = isPureZero ? 0 : Math.min(100, Math.round(lust * 0.65 + pleas * 0.55 + ((wombMl + vagMl) > 0 ? 30 : 0)));
            const fallVal = safeNum(v.精神与心理?.沦陷度), brkVal = safeNum(v.精神与心理?.人格崩解度), hypnoVal = safeNum(extPsy.催眠深度), drugVal = safeNum(v.精神与心理?.媚药精液毒瘾);
            const fallMax = typeof v.上帝强制锁定?.["精神沦陷"] === "number" ? v.上帝强制锁定["精神沦陷"] : Math.max(fallVal, brkVal, hypnoVal);
            const fallTier = tier6(fallMax, false), sensMult = (1.0 + corr * 0.06 + dev.all6OrganAvg * 0.05 + (vagCnt > 0 ? 1.0 : 0)).toFixed(1);
            const mouthDev = dev.mouthObj.val, chestDev = dev.chestObj.val, vagDev = dev.vagObj.val, wombDev = dev.wombObj.val, clitDev = dev.clitObj.val, analDev = dev.analObj.val;

            const rawScarStr = `${safeStr(mark.体表痕迹)} ${safeStr(mark.公开涂鸦字迹)}`, isPermScar = /刺青|纹身|烙铁|烙印|烫伤|刀刻|烂肉/.test(rawScarStr);
            const hasScarsOrTally = (mark.体表痕迹 && mark.体表痕迹 !== "无") || (mark.公开涂鸦字迹 && mark.公开涂鸦字迹 !== "无") || safeNum(mark.鞭痕与掌印) > 0;
            const tallyStrokes = hasScarsOrTally ? (safeNum(mark.鞭痕与掌印) * 4 + (mark.公开涂鸦字迹 && mark.公开涂鸦字迹 !== "无" ? Math.max(5, creampie + vagCnt) : 0)) : 0;
            const tallyFull = Math.floor(tallyStrokes / 5);
            let rawScarDev = hasScarsOrTally ? (isPermScar ? Math.max(62, calcStage6Score(tallyStrokes + 80, 1.0, diff.mult, /烂肉|刀刻/.test(rawScarStr)).val) : Math.min(58, Math.max(22, 20 + tallyFull * 6 + safeNum(mark.鞭痕与掌印) * 3))) : 0;
            const tallyDev = typeof v.上帝强制锁定?.["正字涂鸦"] === "number" ? v.上帝强制锁定["正字涂鸦"] : (isPermScar ? lockIrreversible(v, "mod_scar", rawScarDev, "正字涂鸦") : Math.max(hasScarsOrTally ? rawScarDev : 0, safeNum(v.历史最高崩坏度?.mod_scar) >= 60 ? v.历史最高崩坏度.mod_scar : 0));

            const rawTattooStr = safeStr(mark.淫纹与刻印), isPermTattoo = /永久|烙印|刺青|漆黑刻印|荧光|异化|触须|魔腹|腐蚀/.test(rawTattooStr);
            const hasTattoo = Boolean(mark.淫纹与刻印 && mark.淫纹与刻印 !== "无" && !/无外显|未刻|光洁/.test(rawTattooStr));
            const rawTattooDev = hasTattoo ? (isPermTattoo ? Math.max(45, Math.min(100, Math.round(40 + corr * 0.6))) : Math.min(39, Math.max(22, Math.round(20 + lust * 0.2)))) : 0;
            const tattooDev = typeof v.上帝强制锁定?.["淫纹烙印"] === "number" ? v.上帝强制锁定["淫纹烙印"] : (isPermTattoo ? lockIrreversible(v, "mod_tattoo", rawTattooDev, "淫纹烙印") : Math.max(hasTattoo ? rawTattooDev : 0, safeNum(v.历史最高崩坏度?.mod_tattoo) >= 45 ? v.历史最高崩坏度.mod_tattoo : 0));

            const rawPierceStr = safeStr(mark.穿刺与环饰), isPermPierce = /铁牢|缝合|锁死|撕裂|钢筋|嵌合|生锈/.test(rawPierceStr);
            const hasPierce = Boolean(mark.穿刺与环饰 && mark.穿刺与环饰 !== "无" && !/无穿刺|未穿刺/.test(rawPierceStr));
            const rawPierceDev = hasPierce ? (isPermPierce ? Math.max(62, Math.min(100, Math.round(55 + corr * 0.45))) : Math.min(58, Math.max(25, Math.round(25 + corr * 0.3)))) : 0;
            const pierceDev = typeof v.上帝强制锁定?.["穿刺环饰"] === "number" ? v.上帝强制锁定["穿刺环饰"] : (isPermPierce ? lockIrreversible(v, "mod_pierce", rawPierceDev, "穿刺环饰") : Math.max(hasPierce ? rawPierceDev : 0, safeNum(v.历史最高崩坏度?.mod_pierce) >= 60 ? v.历史最高崩坏度.mod_pierce : 0));

            const rawPropStr = safeStr(prop.体内道具), isPermProp = /机械|电缆|触手|铆钉|焊死|核心|齿轮/.test(rawPropStr);
            const hasProp = Boolean(prop.体内道具 && prop.体内道具 !== "无" && !/无填塞|无道具|存留.*浓精/.test(rawPropStr));
            const rawPropDev = hasProp ? (isPermProp ? Math.max(65, Math.min(100, Math.round(60 + corr * 0.4))) : Math.min(58, Math.max(25, Math.round(25 + pleas * 0.3)))) : 0;
            const propDev = typeof v.上帝强制锁定?.["体内道具"] === "number" ? v.上帝强制锁定["体内道具"] : (isPermProp ? lockIrreversible(v, "mod_prop", rawPropDev, "体内道具") : Math.max(hasProp ? rawPropDev : 0, safeNum(v.历史最高崩坏度?.mod_prop) >= 60 ? v.历史最高崩坏度.mod_prop : 0));

            const ovulStageVal = lockIrreversible(v, "preg_ovul", (creampie + drugVal + forceOrgCnt) > 0 ? calcStage6Score(creampie * 1.1 + drugVal * 0.8 + forceOrgCnt * 1.2, 1.0, diff.mult, creampie >= 90 * diff.mult).val : 0, "排卵周期");
            const xrayStageVal = lockIrreversible(v, "preg_xray", (creampie + wombMl + safeNum(preg.生产产卵次数)) > 0 ? Math.min(100, Math.round(wombDev * 0.75 + (wombMl > 0 ? 22 : 0) + safeNum(preg.生产产卵次数) * 15)) : 0, "受精断面");
            const dnaStageVal = lockIrreversible(v, "preg_dna", (creampie + swallowCnt + gangCnt + beastCnt) > 0 ? calcStage6Score(creampie * 1.2 + swallowCnt * 0.9 + gangCnt * 2.5 + beastCnt * 4, 1.0, diff.mult, (creampie + swallowCnt) >= 120 * diff.mult).val : 0, "精液归属");
            const bellySwellPct = Math.min(100, Math.round(safeNum(preg.怀孕进度) + (totalMl / Math.max(60, caps.wombMax)) * 65));
            const pregStageVal = lockIrreversible(v, "preg_belly", (preg.子宫怀孕 || totalMl > 0 || safeNum(preg.生产产卵次数) > 0 || creampie > 10) ? Math.min(100, Math.max(bellySwellPct, Math.round(safeNum(preg.生产产卵次数) * 28 + (creampie / diff.mult) * 0.8))) : 0, "孕肚进度");
            const bodyTotalCorrupt = typeof v.上帝强制锁定?.["肉体外貌"] === "number" ? v.上帝强制锁定["肉体外貌"] : Math.round(dev.all6OrganAvg * 0.6 + (tallyDev + tattooDev + pierceDev + propDev) * 0.1);

            const mouthStg = `${stageNameFromVal(mouthDev)}•${["洁净初唇","唇肿涎溢","咽喉松弛","颚骨半脱臼","食道肉壶化","口腔排泄器畸变"][tier6(mouthDev)]}`;
            const chestStg = `${stageNameFromVal(chestDev)}•${["娇嫩处乳","乳尖肥大","乳晕黑紫扩张","乳腺失控漏奶","下垂巨乳奶袋","崩坏泌乳肉囊"][tier6(chestDev)]}`;
            const vagStg   = `${stageNameFromVal(vagDev)}•${["紧致初鲍","初破红肿","外翻黑木耳","括约肌松弛洞开","肉壁脱垂漏精壶","彻底崩坏烂肉洞"][tier6(vagDev)]}`;
            const wombStg  = `${stageNameFromVal(wombDev)}•${["紧闭处子","宫口充血微松","宫口扩张锁精","宫腔肥大下坠","宫颈重度脱垂","外翻脱垂死肉苗床"][tier6(wombDev)]}`;
            const clitStg  = `${stageNameFromVal(clitDev)}•${["包皮隐没","充血外露","阴蒂肥大勃起","尿道扩张漏尿","阴蒂肉棒化失禁","括约肌坏死漏尿狂"][tier6(clitDev)]}`;
            const analStg  = `${stageNameFromVal(analDev)}•${["紧闭菊蕾","裂伤红肿","褶皱磨平松弛","后庭空洞不合","直肠翻肉轻度脱肛","重度脱肛崩坏排泄腔"][tier6(analDev)]}`;
            const scarStg   = `${stageNameFromVal(tallyDev)}•${["白皙无瑕","初次记数","淫语密布","刺青入骨","烙铁烫印","烂肉记事本"][tier6(tallyDev)]}`;
            const tattooStg = `${stageNameFromVal(tattooDev)}•${["平坦白腹","初显魔纹","漆黑刻印","发情荧光","肉体异化","恶堕魔腹"][tier6(tattooDev)]}`;
            const pierceStg = `${stageNameFromVal(pierceDev)}•${["天然无饰","初上银环","重金属坠","密集铁牢","皮肉撕裂","金属嵌合体"][tier6(pierceDev)]}`;
            const propStg   = `${stageNameFromVal(propDev)}•${["空荡纯净","微露拉环","巨物撑扩","机械群交","内脏异形化","永久机械肉壶"][tier6(propDev)]}`;

            const milkCap = Math.round(100 + milkCnt * 15), curMilkMl = milkCnt > 0 ? Math.min(milkCap, Math.round(25 + lust * 0.8 + pleas * 0.5)) : 0;
            const fertProb = safeNum(preg.受孕概率, wombMl > 0 ? 75 : (creampie > 0 ? 40 : (isPureZero ? 0 : 15)));
            const cycLabel = isPureZero ? (preg.生理周期阶段 || "正常生理期") : (preg.生理周期阶段 === "正常生理期" && wombMl > 0 ? "危险排卵期" : (preg.生理周期阶段 || "危险排卵期"));
            const ovulStg = `${stageNameFromVal(ovulStageVal)}•${["平静安宁","初潮萌动","异常催促","排卵失控","异种卵生","永久下崽机器"][tier6(ovulStageVal)]}`;
            const xrayStg = `${stageNameFromVal(xrayStageVal)}•${["无暇孤卵","精群围攻","破膜着床","多重受孕","异种寄生","腐肉苗床"][tier6(xrayStageVal)]}`;
            const dnaStg  = `${stageNameFromVal(dnaStageVal)}•${["无暇无浊","体外喷溅","内射满溢","全身精涂","肌体吸精","白浊黏液怪"][tier6(dnaStageVal)]}`;
            const pregStg = `${stageNameFromVal(pregStageVal)}•${["平坦马甲线","微凸孕相","显怀大肚","胎动破肚","下垂肉囊","透明异种孵化巢"][tier6(pregStageVal)]}`;
            const totalCapAll = caps.mouthMax + caps.vagMax + caps.wombMax + caps.analMax;

            const marketRank = corr >= 100 ? "EX神格·崩坏便器" : corr >= 80 ? "SSS级·公用便器" : corr >= 50 ? "A级·风俗名器" : hookerCnt > 0 ? "B级·暗娼熟肉" : "S级·纯洁无瑕";
            const marketPrice = prof.风月挂牌身价 || (hookerCnt > 0 ? `单次皮肉资 ${Math.max(50, 500 - corr * 4)} 元（已接客 ${hookerCnt} 次）` : `无价之宝（清白之身）`);

            const fmtOvr = (key, defObj, defThoughtArr, specificStageVal = null, isRev = false) => {
                const defaultThought = Array.isArray(defThoughtArr) ? pickStageThought(v, defThoughtArr, specificStageVal, isRev) : defThoughtArr;
                if (ovr[key] && (ovr[key].desc || ovr[key].thought)) return `${ovr[key].desc || defObj}\n💭【${u}的实时心声】：“*${cleanThoughtText(ovr[key].thought || defaultThought)}*”`;
                return `${defObj}\n💭【${u}的实时心声】：“*${cleanThoughtText(defaultThought)}*”`;
            };

            const defaultMonologue = pickStageThought(v, [
                `我是${u}，无论周围处境如何变化，我都必须保持冷静清醒。`,
                `呼……身体稍微有些发热发软，我得尽快调整好呼吸与状态💦。`,
                `身体深处还残留着难以忽视的酸胀感与湿热感😳💦。`,
                `哈啊……小肚子里沉甸甸地往下坠，身体越来越松软易湿了🥵💦！`,
                `呜汪♡……身体已经被操成了贪恋肉棒与浓精的形状🥵💦❤️！`,
                `啊嘿♡……全身孔穴都已经100%崩坏畸变成活体排泄肉坑了🥵💦❤️❤️！`
            ]);
            const curThought = cleanThoughtText(ovr.内心独白?.thought || rt.内心独白 || live.thought || defaultMonologue);
            const curPose = rt.当前姿势 || live.pose || (isPureZero ? `${u}身姿端正，神色平静自然。` : `${u}正调整着呼吸与姿态。`);
            const allClothStr = safeStr(rt.当前衣装 || prop.穿戴中的标记物);
            const pickClothPart = (reg, fallbackStr) => {
                if (!allClothStr) return fallbackStr;
                const parts = allClothStr.split(/[、，；,;]+/).filter(s => reg.test(s));
                return parts.length ? parts.join("、") : fallbackStr;
            };

            const wearStateTag = wetLevel >= 80 ? "🔞赤裸泥泞" : wetLevel >= 50 ? "🔥汗湿凌乱" : wetLevel >= 20 ? "💦微乱泛潮" : "✨整洁得体";
            const headTxt = ovr.穿搭_头饰?.stage || wear.头饰与眼部 || live.headWear || pickClothPart(/(?:发|簪|冠|耳|眼|镜|面|帽)/, isPureZero ? "发丝整洁•神色清澈" : "汗湿发丝•微喘潮红");
            const neckTxt = ovr.穿搭_颈部?.stage || wear.颈部与项圈 || live.neckWear || pickClothPart(/(?:项圈|颈|领|锁骨|链|巾)/, isPureZero ? "脖颈白皙•衣领端正" : "锁骨微汗•红痕显眼");
            const braTxt = ovr.穿搭_胸罩?.stage || wear.胸罩与裹胸 || live.braWear || pickClothPart(/(?:裹胸|胸罩|文胸|肚兜|乳|内衬|真空)/, isPureZero ? "贴身内衬•包裹完好" : "胸口起伏•乳尖微挺");
            const topTxt = ovr.穿搭_上衣?.stage || wear.上衣与束腰 || live.topWear || pickClothPart(/(?:袍|衣|衫|T恤|束腰|腰带|甲|服|睡裙)/, isPureZero ? "外衫整洁•束腰合度" : "衣衫半解•薄汗贴背");
            const pantyTxt = ovr.穿搭_内裤?.stage || wear.内裤与遮挡 || live.pantyWear || pickClothPart(/(?:衬裤|内裤|底裤|丁字裤|开裆|胖次|光裸)/, isPureZero ? "干净底裤•严密遮护" : "腿心湿润•粘液渗出");
            const botTxt = ovr.穿搭_下装?.stage || wear.下装与裙裤 || live.bottomWear || pickClothPart(/(?:裙|裤|下摆)/, isPureZero ? "裙裤垂顺•端庄得体" : "下摆凌乱•臀线紧绷");
            const sockTxt = ovr.穿搭_丝袜?.stage || wear.丝袜与腿部 || live.sockWear || pickClothPart(/(?:袜|丝|腿环|绑腿|裸腿)/, isPureZero ? "双腿修长•姿态端正" : "双腿微颤•肌肤泛潮");
            const shoeTxt = ovr.穿搭_鞋子?.stage || wear.鞋子与玉足 || live.shoeWear || pickClothPart(/(?:靴|鞋|拖鞋|履|足)/, isPureZero ? "鞋履整洁•步履平稳" : "玉足微蜷•步履酸软");

            const unlockedFetishes = computeUnlockedFetishes(v);
            const fetishItems = unlockedFetishes.length > 0
                ? unlockedFetishes.map(fObj => mk(`fetish_${fObj.name}`, `🧬 ${fObj.name}：${fObj.val}/100「${fObj.stage}」`, buildFetishRichDesc(fObj, v, u), "corr"))
                : [mk("fetish_none", `🔒 暂无性癖「完好未染」`, `【性癖状态】：当前所有性交、高潮、内射记录均为 0。\n💭【${u}的实时心声】：“*我现在的身心依然保持着原本的纯净完好。*”`, "none", null, true, 0)];

            const clientList = extractClientsFromHistory(v, u, c);
            const clientItems = clientList.length > 0
                ? clientList.map((cl, idx) => mk(`client_${idx}`, `🍆 ${cl.name}：${cl.val}/100「${cl.roleTag}•${cl.statusTag}」`, `${cl.detailDesc}\n💭【${u}的实时心声】：“*${cleanThoughtText(cl.thoughtStr)}*”`, "cockLove", cl.dnaShare > 0 ? { mainName: "🍆 调教崩坏度", label: "🧬 宫内DNA", theme: "semen", pct: cl.dnaShare, text: `${cl.dnaShare}%` } : null, false, null, { isClient: true, clientName: cl.name }))
                : [mk("client_none", `🔒 暂无恩客记录「完好清白」`, `【恩客图鉴】：当前尚未建立肉体支配记录。\n💭【${u}的实时心声】：“*我还没有被占有过。*”`, "none", null, true, 0)];

            const customIdentityNote = detectRealCharacterIdentity(v);

            const baseCategories = [
                {
                    title: "档案与风评", icon: "👩", summary: `${u} (${customIdentityNote}) · 敏感${sensMult}x`,
                    items: [
                        mk("身份与背景", `👩 监控目标与身份：${u}「${customIdentityNote}•${prop.肉体所有权 || (hookerCnt > 0 ? "恩客共有" : "自由身")}」`,
                            fmtOvr("身份与背景", `【🔬 当前状态栏绑定目标】：\n• 监控目标名字：${u} ｜ 肉体归属：${prop.肉体所有权 || (hookerCnt > 0 ? "恩客支配" : "自由身")}\n• 崩坏难度倍率：${diff.fullLabel}（敏感度：${sensMult} 倍）\n• 锁定外貌DNA：${getLockedAppearanceTags(u, v)}\n• 当前处境：${prof.身份与背景 || live.identity}`,
                                [`我现在是「${u}」，必须保持稳妥。`,`虽然眼前的处境让人有些紧绷为难，但我还是得努力维持体面💦。`,`我已经习惯了这具敏感度 ${sensMult} 倍的身体😳💦。`,`这具敏感易湿的熟肉身体早就离不开男人的玩弄与支配了🥵💦！`,`只要听到有人叫我「${u}」，合不拢的骚穴就会条件反射涌出热流🥵💦❤️！`,`啊嘿♡……「${u}」就是天生为了给所有男人当泄欲排泄肉坑而存在的呀🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("肉体外貌", `🌸 肉体敏感与畸变总览：${bodyTotalCorrupt}/100「敏感${sensMult}倍•${stageNameFromVal(bodyTotalCorrupt)}」`,
                            fmtOvr("肉体外貌", `【🔬 全身器质崩坏度与外貌实况：${bodyTotalCorrupt}/100】：\n• 躯体实况：${prof.肉体外貌实况 || live.bodyDesc}\n• 神经敏感倍率：常人的 ${sensMult} 倍 ｜ 六孔平均崩坏度：${dev.all6OrganAvg}%`,
                                [`这具身体肌肤细腻、完好无瑕。`,`总觉得现在的皮肤和粘膜变得比以前敏感了不少💦。`,`看着镜子里留着薄汗与红痕的身体，每一寸皮肤都敏感到极点😳💦。`,`我这具丰满白腻的身体早就被开发得松软熟透了🥵💦！`,`好喜欢看自己这副穴口外翻合不拢的下流母畜身体呀🥵💦❤️！`,`啊嘿♡……全身上下每一个器官都已经100%崩坏畸变啦🥵💦❤️❤️！`], bodyTotalCorrupt), "corr"),
                        mk("表里风评", `🎭 表里风评：「${prof.表里风评与称号 || (corr >= 60 ? "名声崩坏•难以自持" : (isPureZero ? "清白端庄•品行自持" : "表面平静•暗藏反差"))}」`,
                            fmtOvr("表里风评", `【🔬 表里风评与把柄威胁】：\n• 风评实况：${prof.表里风评与称号 || "外界风评正常端庄。"}\n• 致命把柄：${prof.致命把柄与威胁 !== "无" ? prof.致命把柄与威胁 : "暂无已知把柄"}`, [`我的名声与清白容不得半点污点。`,`但愿那些私密接触不会被外人知晓💦。`,`在知情的熟客眼里，我早就不是高不可攀的女人了😳💦。`,`还不如享受当荡妇的快乐呢🥵💦！`,`最好让所有男人都知道我是个下贱娼妇🥵💦❤️！`,`啊嘿♡……请把人家的崩坏事迹传遍天下吧🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("挂牌身价", `🏷️ 挂牌身价：「${marketRank}」`,
                            fmtOvr("挂牌身价", `【🔬 风月估值与身价评级】：【${marketRank}】｜${marketPrice}。`, [`我的身体与尊严是无价的。`,`一想到被金钱衡量心里就发寒💦。`,`已经渐渐习惯了靠身体换取所需😳💦。`,`只要给点零钞就能随便玩弄内射我🥵💦！`,`只要能把子宫灌满浓精就是最好的报酬🥵💦❤️！`,`啊嘿♡……倒贴钱求操的0元公用便池营业中呀🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("内心独白", `💬 内心独白：「实时心声」`,
                            fmtOvr("内心独白", `【⚡ 当前敏感带与日程】：${extPsy.当前敏感点 || (isPureZero ? "耳根、脖颈与腰侧" : "外翻阴唇、肿大阴蒂、宫颈口与乳尖")}`, curThought), "none", null, true, 0),
                        mk("当前姿势", `🧍 姿势与躯体机能：${staM.val}/100「${staM.stage}」`,
                            fmtOvr("当前姿势", `【🔬 当前姿态与躯体骨骼机能实况】：\n• 实时姿态：${curPose}\n${staM.desc.split("💭")[0]}`, [`保持端正自然的姿态，目前体力充沛。`,`稍微有些劳累出汗💦。`,`大腿内侧肌肉酸软无力，膝盖打颤😳💦。`,`腰椎和双腿都酸软痉挛得厉害🥵💦！`,`只能像母狗一样四肢着地爬行等操🥵💦❤️！`,`啊嘿♡……四肢彻底废用成M字开腿撅臀的活体肉垫了🥵💦❤️❤️！`], staM.val, true), "sta")
                    ]
                },
                {
                    title: "恶堕与脑改", icon: "🔥", summary: `好感${cockM.val}% · 性欲${lustM.val}% · 恶堕${corrM.val}% · 羞耻${shameM.val}%`,
                    items: [
                        mk("cockLove", `💗 阳具烙印：${cockM.val}/100「${cockM.stage}」`, cockM.desc, "cockLove"),
                        mk("lust", `🔥 发情中枢：${lustM.val}/100「${lustM.stage}」`, lustM.desc, "lust"),
                        mk("corr", `🖤 人格崩坏：${corrM.val}/100「${corrM.stage}」`, corrM.desc, "corr"),
                        mk("shame", `😳 羞耻防线：${shameM.val}/100「${shameM.stage}」`, shameM.desc, "shame"),
                        mk("obey", `🙇 意志切除：${obeyM.val}/100「${obeyM.stage}」`, obeyM.desc, "obey"),
                        mk("pleas", `💓 脑髓熔断：${pleasM.val}/100「${pleasM.stage}」`, pleasM.desc, "pleas"),
                        mk("精神沦陷", `🌀 脑实质沦陷：${fallMax}/100「${["理智完好","浅层恍惚","催眠暗示","常识改写","人格碎裂","脑海绵化痴呆"][fallTier]}」`,
                            fmtOvr("精神沦陷", `【🔬 脑实质与认知崩坏（第${fallTier + 1}阶段 · ${fallMax}/100）】：沦陷${fallVal}% ｜ 崩解${brkVal}% ｜ 催眠${hypnoVal}%`, [`我的头脑非常清醒。`,`脑海里偶尔闪过一丝恍惚💦。`,`眼神已经变得平静麻木了😳💦。`,`一闻到男人气息脑子就晕乎乎的🥵💦！`,`常识已经被改写成只知道张腿接精了🥵💦❤️！`,`啊嘿……脑子变成装满精液的浆糊海绵啦🥵💦❤️❤️！`], fallMax), "hypno"),
                        mk("媚药毒瘾", `🧪 脑脊液毒瘾：${drugVal}/100「${["纯净无毒","微醺依恋","药力发热","精液戒断","断精发狂","脑脊液毒化母猪"][tier6(drugVal)]}」`,
                            fmtOvr("媚药毒瘾", `【🔬 媚药侵蚀与毒瘾（Lv.${tier6(drugVal) + 1} · ${drugVal}/100）】：${v.调教进度?.媚药与发情毒 || "无外源化学媚药"}`, [`体内干净纯粹。`,`有些头晕胸闷💦。`,`习惯了雄性精液的热度😳💦。`,`小肚子深处像犯了毒瘾一样发痒🥵💦！`,`一天不喝精液不被内射就会抽搐发狂🥵💦❤️！`,`啊嘿♡……连脑脊液都被媚药和浓精毒化啦🥵💦❤️❤️！`], drugVal), "drug")
                    ]
                },
                { title: "下流性癖库", icon: "🧬", summary: unlockedFetishes.length > 0 ? `已畸变 ${unlockedFetishes.length} 项` : `完好未染`, items: fetishItems },
                {
                    title: "六孔与储精", icon: "🌸", summary: `总储精${totalMl}ml · 六孔崩坏实况`,
                    items: [
                        mk("骚口实况", `👄 骚口：${mouthDev}/100「${mouthStg}」`, fmtOvr("骚口实况", `【🔬 口腔崩坏度：${mouthDev}/100（口交${mouthCnt}·吞精${swallowCnt}）】：\n• 💧 胃袋储精：${mouthMl}ml / ${caps.mouthMax}ml\n• 📍 当前细节：${rt.骚口实况 || live.mouth || "唇瓣微张。"}`, [`双唇干净清爽。`,`嘴唇有些发麻💦。`,`咽喉深处残留酸胀感😳💦。`,`嗓子眼早就记住了肉棒形状🥵💦！`,`快捅穿喉咙直接射进胃里吧🥵💦❤️！`,`啊嘿♡……直接往嗓子眼里灌精撒尿吧🥵💦❤️❤️！`], mouthDev), "mouth", { mainName: "👄 口器崩坏度", label: "🥛 胃袋储精", theme: "semen", pct: Math.round((mouthMl / Math.max(1, caps.mouthMax)) * 100), text: `${mouthMl}/${caps.mouthMax}ml` }),
                        mk("胸部实况", `🍒 丰乳：${chestDev}/100「${chestStg}」`, fmtOvr("胸部实况", `【🔬 乳房崩坏度：${chestDev}/100（乳交${titCnt}·喷乳${milkCnt}）】：\n• 🍼 乳腺蓄乳：${curMilkMl}ml / ${milkCap}ml\n• 📍 当前细节：${rt.胸部实况 || live.chest || "双峰随呼吸起伏。"}`, [`双峰紧致完好。`,`乳尖有些充血发硬💦。`,`肿大的乳头又硬又痛😳💦。`,`稍微碰一下就会渗奶水🥵💦！`,`奶袋子又胀又麻好难受呀♡🥵💦❤️！`,`啊嘿♡……烂奶子已经崩坏成紫黑肉袋了🥵💦❤️❤️！`], chestDev), "chest", { mainName: "🍒 乳腺崩坏度", label: "🍼 乳腺蓄乳", theme: "milk", pct: Math.round((curMilkMl / Math.max(1, milkCap)) * 100), text: `${curMilkMl}/${milkCap}ml` }),
                        mk("小穴实况", `🌺 小穴：${vagDev}/100「${vagStg}」`, fmtOvr("小穴实况", `【🔬 小穴崩坏度：${vagDev}/100（贯穿${vagCnt}·内射${creampie}·孔径${vagWidth}cm）】：\n• 💧 阴道储精：${vagMl}ml / ${caps.vagMax}ml\n• 📍 当前细节：${rt.小穴实况 || live.vag || "花唇微张。"}`, [`私密处紧致完好。`,`两腿间有些红肿温热💦。`,`花唇红肿外翻合不拢了😳💦。`,`走一步路就往外漏白浆🥵💦！`,`骚逼已经被操成漏精肉壶了♡🥵💦❤️！`,`啊嘿♡……小穴已经100%崩坏成拳头大烂肉洞啦🥵💦❤️❤️！`], vagDev), "vag", { mainName: "🌺 小穴崩坏度", label: "🥛 穴内储精", theme: "semen", pct: Math.round((vagMl / Math.max(1, caps.vagMax)) * 100), text: `${vagMl}/${caps.vagMax}ml` }),
                        mk("子宫实况", `🫀 子宫：${wombDev}/100「${wombStg}」`, fmtOvr("子宫实况", `【🔬 子宫崩坏度：${wombDev}/100（内射${creampie}次）】：\n• 💧 宫腔储精：${wombMl}ml / ${caps.wombMax}ml\n• 📍 当前细节：${rt.子宫实况 || live.womb || "小腹微沉。"}`, [`子宫紧闭纯净。`,`小肚子深处有些发酸💦。`,`宫腔被灌进了滚烫浓精😳💦。`,`子宫口被撞得又软又松🥵💦！`,`子宫脱垂到穴口边上了♡🥵💦❤️！`,`啊嘿♡……子宫口已经100%脱垂掉到外面来啦🥵💦❤️❤️！`], wombDev), "womb", { mainName: "🫀 宫颈崩坏度", label: "🥛 宫腔锁精", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }),
                        mk("阴蒂尿道", `💧 阴蒂与尿道：${clitDev}/100「${clitStg}」`, fmtOvr("阴蒂尿道", `【🔬 阴蒂尿道崩坏度：${clitDev}/100（高潮${orgasmCnt}·失禁${leakCnt}·阴蒂${clitSize}mm）】：\n• 💦 尿道失禁度：${peeVal}/100`, [`括约肌完全受控。`,`充血阴蒂传来酥麻感💦。`,`每走一步都磨得酸痛😳💦。`,`稍微高潮就会漏出尿来🥵💦！`,`阴蒂已经肿大成小肉棒了🥵💦❤️！`,`啊嘿♡……尿道括约肌100%坏死报废啦🥵💦❤️❤️！`], clitDev), "clit", { mainName: "⚡ 尿道崩坏度", label: "💦 失禁漏尿", theme: "pee", pct: peeVal, text: `失禁度 ${peeVal}%` }),
                        mk("屁眼实况", `🕳️ 屁眼：${analDev}/100「${analStg}」`, fmtOvr("屁眼实况", `【🔬 后庭崩坏度：${analDev}/100（肛交${analCnt}次）】：\n• 💧 直肠储精：${analMl}ml / ${caps.analMax}ml\n• 📍 当前细节：${rt.屁眼实况 || live.anal || "臀线紧绷。"}`, [`后庭紧闭洁净。`,`臀部肌肉有些酸紧💦。`,`臀肉掌印火辣辣发烫😳💦。`,`后面括约肌已经被撑松了🥵💦！`,`屁眼往外翻出鲜红直肠肉了♡🥵💦❤️！`,`啊嘿♡……屁眼括约肌彻底断掉重度脱肛啦🥵💦❤️❤️！`], analDev), "anal", { mainName: "🕳️ 后庭崩坏度", label: "🥛 直肠储精", theme: "semen", pct: Math.round((analMl / Math.max(1, caps.analMax)) * 100), text: `${analMl}/${caps.analMax}ml` })
                    ]
                },
                {
                    title: "肉改与道具", icon: "⛓️", summary: `伤痕${tallyDev}% · 淫纹${tattooDev}% · 穿刺${pierceDev}% · 腔改${propDev}%`,
                    items: [
                        mk("正字涂鸦", `🩹 正字涂鸦与烙痕：${tallyDev}/100「${scarStg}」`, fmtOvr("正字涂鸦", `【🔬 涂鸦刻痕：${tallyDev}/100（正字${tallyFull}个）】：${mark.体表痕迹 !== "无" ? mark.体表痕迹 : "无"}`, [`肌肤光洁如初。`,`画上正字好屈辱💦。`,`密密麻麻全是正字😳💦。`,`变成永久刺青了🥵💦！`,`烫疤变成高潮开关了🥵💦❤️！`,`啊嘿♡……全身刻满血肉正字🥵💦❤️❤️！`], tallyDev), "corr"),
                        mk("淫纹烙印", `🔮 淫纹烙印与魔蚀：${tattooDev}/100「${tattooStg}」`, fmtOvr("淫纹烙印", `【🔬 淫纹畸变：${tattooDev}/100】：${hasTattoo ? mark.淫纹与刻印 : "平坦光洁（0%）"}`, [`小腹白净平坦。`,`浮现浅粉色纹路💦。`,`漆黑淫纹洗不掉😳💦。`,`亮起紫红发情荧光🥵💦！`,`变成蠕动肉须长在肚皮上了♡🥵💦❤️！`,`啊嘿♡……小肚子被深渊淫纹腐蚀烂穿啦🥵💦❤️❤️！`], tattooDev), "hypno"),
                        mk("穿刺环饰", `💍 穿刺铁牢与嵌合：${pierceDev}/100「${pierceStg}」`, fmtOvr("穿刺环饰", `【🔬 穿刺畸变：${pierceDev}/100】：${hasPierce ? mark.穿刺与环饰 : "天然无饰（0%）"}`, [`身体完好自然。`,`戴上小银环又红又肿💦。`,`重锤把乳头阴唇拉扯变形😳💦。`,`被密密麻麻铁环锁死了🥵💦！`,`钢筋插穿化脓烂肉♡🥵💦❤️！`,`啊嘿♡……铁环已经和烂肉长在一起啦🥵💦❤️❤️！`], pierceDev), "clit"),
                        mk("体内道具", `🎛️ 机械填塞与肉壶化：${propDev}/100「${propStg}」`, fmtOvr("体内道具", `【🔬 体内道具：${propDev}/100】：${hasProp ? prop.体内道具 : "空荡纯净（0%）"}`, [`内部清爽洁净。`,`跳蛋嗡嗡震动好难受💦。`,`假阳具把穴口撑得合不拢😳💦。`,`前后穴都被机械触手塞爆了🥵💦！`,`带刺核心高速旋转刮擦♡🥵💦❤️！`,`啊嘿♡……变成永久赛博机械肉便器啦🥵💦❤️❤️！`], propDev), "pleas")
                    ]
                },
                {
                    title: "全身穿搭", icon: "👗", summary: `状态:${wearStateTag} · 完好${safeNum(userSettings.clothDurability, 100)}%`,
                    items: [
                        mk("穿搭_头饰", `👑 头部与面容「${headTxt.slice(0, 14)}」`, fmtOvr("穿搭_头饰", `【🔬 头部实况】：${headTxt}`, [`妆容整洁。`,`渗出薄汗💦。`,`头发黏在脸颊😳💦。`,`嘴角挂着口水🥵💦！`,`想戴开口球🥵💦❤️！`,`啊嘿♡……眼珠彻底翻白了🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_颈部", `⛓️ 脖颈与锁骨「${neckTxt.slice(0, 14)}」`, fmtOvr("穿搭_颈部", `【🔬 脖颈实况】：${neckTxt}`, [`衣领整齐。`,`脖颈微热💦。`,`锁骨印着咬痕😳💦。`,`一碰又酸又麻🥵💦！`,`想戴电击项圈🥵💦❤️！`,`啊嘿♡……脖子被铁链勒出深槽了🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_胸罩", `👙 胸衣与内衬「${braTxt.slice(0, 14)}」`, fmtOvr("穿搭_胸罩", `【🔬 胸部穿戴】：${braTxt}`, [`穿戴整齐。`,`布料贴肤💦。`,`暴露在空气里😳💦。`,`光着奶子方便揉捏🥵💦！`,`只配穿开洞胸罩🥵💦❤️！`,`啊嘿♡……烂奶袋不需要遮挡啦🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_上衣", `👚 上衣与外衫「${topTxt.slice(0, 14)}」`, fmtOvr("穿搭_上衣", `【🔬 上身衣着】：${topTxt}`, [`外衫洁净。`,`后背薄汗💦。`,`光着后背😳💦。`,`真空透视🥵💦！`,`一撕就碎的薄纱🥵💦❤️！`,`啊嘿♡……全裸展示满身烙印🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_内裤", `🩲 底裤与私处「${pantyTxt.slice(0, 14)}」`, fmtOvr("穿搭_内裤", `【🔬 底裤与遮护】：${pantyTxt}（泥泞度：${wetLevel}%）`, [`底裤干爽。`,`有些潮意💦。`,`下身赤裸微张😳💦。`,`内裤被淫水泡透🥵💦！`,`只配穿开裆裤🥵💦❤️！`,`啊嘿♡……24小时敞开滴精漏尿吧🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_下装", `🍑 裙裤与臀部「${botTxt.slice(0, 14)}」`, fmtOvr("穿搭_下装", `【🔬 下装实况】：${botTxt}`, [`裙摆垂顺。`,`抚平褶皱💦。`,`臀肉印着掌印😳💦。`,`全是红巴掌印🥵💦！`,`高高撅起摇晃等插🥵💦❤️！`,`啊嘿♡……撅起印满烙印的烂屁股🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_丝袜", `🧦 丝袜与双腿「${sockTxt.slice(0, 14)}」`, fmtOvr("穿搭_丝袜", `【🔬 腿部实况】：${sockTxt}`, [`双腿端正。`,`有些酸沉💦。`,`大腿内侧全是掐痕😳💦。`,`软得并拢不了🥵💦！`,`撕开裆部黑丝架肩上挨操🥵💦❤️！`,`啊嘿♡……长死成180度M字大开腿啦🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("穿搭_鞋子", `👠 鞋履与玉足「${shoeTxt.slice(0, 14)}」`, fmtOvr("穿搭_鞋子", `【🔬 足部实况】：${shoeTxt}`, [`鞋履合脚。`,`脚踝酸软💦。`,`脚趾前滴落白浊😳💦。`,`高潮脚趾蜷缩🥵💦！`,`用沾满精液的脚趾足交🥵💦❤️！`,`啊嘿♡……脚趾永远痉挛蜷缩在精液池里🥵💦❤️❤️！`]), "none", null, true, 0)
                    ]
                },
                {
                    title: "苗床与受孕", icon: "🤰", summary: `${cycLabel} · 苗床崩坏${pregStageVal}%`,
                    items: [
                        mk("排卵周期", `🥚 卵巢异变：${ovulStageVal}/100「${ovulStg}」`, fmtOvr("排卵周期", `【🔬 卵巢畸变：${ovulStageVal}/100】：${cycLabel} ｜ 受孕率：${fertProb}%`, [`正常生理期。`,`排出成熟卵子💦。`,`一次排出好几颗卵子😳💦。`,`狂喷几百颗卵子🥵💦！`,`长出异种大肉卵了🥵💦❤️！`,`啊嘿♡……变成永动下崽机器啦🥵💦❤️❤️！`], ovulStageVal), "lust", { mainName: "🥚 卵巢崩坏度", label: "🎯 受孕概率", theme: "pleas", pct: fertProb, text: `受孕率 ${fertProb}%` }),
                        mk("受精断面", `🔬 受精断面：${xrayStageVal}/100「${xrayStg}」`, fmtOvr("受精断面", `【🔬 胎盘畸变：${xrayStageVal}/100】：宫腔储精 ${wombMl}ml / ${caps.wombMax}ml`, [`子宫纯净安宁。`,`精子正在围攻卵子💦！`,`钻破卵膜着床了😳💦。`,`几十颗卵子同时着床🥵💦！`,`触手精虫撕裂卵子♡🥵💦❤️！`,`啊嘿♡……变成怪物胎盘啦🥵💦❤️❤️！`], xrayStageVal), "womb", { mainName: "🔬 胎盘畸变度", label: "🥛 精虫密度", theme: "semen", pct: Math.round((wombMl / Math.max(1, caps.wombMax)) * 100), text: `${wombMl}/${caps.wombMax}ml` }),
                        mk("精液归属", `🧬 白浊同化：${dnaStageVal}/100「${dnaStg}」`, fmtOvr("精液归属", `【🔬 白浊同化：${dnaStageVal}/100】：四穴总储精 ${totalMl}ml`, [`身体干净。`,`溅到几滴精液💦。`,`穴口往外拉丝😳💦。`,`全身被精液糊满🥵💦！`,`毛孔把精液吸进肉里♡🥵💦❤️！`,`啊嘿♡……化作白浊史莱姆啦🥵💦❤️❤️！`], dnaStageVal), "drug", { mainName: "🧬 白浊同化度", label: "🥛 四穴总精", theme: "semen", pct: Math.round((totalMl / Math.max(1, totalCapAll)) * 100), text: `合计 ${totalMl}ml` }),
                        mk("孕肚进度", `🤰 孕肚孵化巢：${pregStageVal}/100「${pregStg}」`, fmtOvr("孕肚进度", `【🔬 孵化巢畸变：${pregStageVal}/100】：腹围膨隆 ${bellySwellPct}%`, [`小腹平坦。`,`微微鼓起💦。`,`高高挺起😳💦。`,`小手脚疯狂踢踹🥵💦！`,`垂到膝盖爬满撕裂纹♡🥵💦❤️！`,`啊嘿♡……肚皮变成透明薄膜孵化巢呀🥵💦❤️❤️！`], pregStageVal), "corr", { mainName: "🤰 孵化巢崩坏度", label: "🥛 腹围膨隆", theme: "semen", pct: bellySwellPct, text: `膨隆 ${bellySwellPct}%` })
                    ]
                },
                { title: "恩客图鉴", icon: "🍆", summary: clientList.length > 0 ? `已记录 ${clientList.length} 名恩客` : `暂无恩客记录`, items: clientItems },
                {
                    title: "淫乱总账", icon: "💎", summary: `小穴${vagCnt} · 内射${creampie} · 接客${hookerCnt}`,
                    items: [
                        mk("破瓜纪念", `🥀 破瓜纪念：「${vagCnt === 0 ? "🌸处女完好" : `🌺已破瓜(累计${vagCnt}次)`}」`, fmtOvr("破瓜纪念", `【🔬 处女档案】：${vagCnt === 0 ? "处女膜完好无损" : `累计承受小穴贯穿 ${vagCnt} 次、内射 ${creampie} 次`}。`, [`处女之身完好。`,`失去清白有些酸涩💦。`,`习惯了眼下生活😳💦。`,`被捅穿才是归宿🥵💦！`,`庆幸处女膜被捅烂啦🥵💦❤️！`,`啊嘿♡……终极肉便器啦🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("六孔总账", `💎 性交总账：「小穴${vagCnt}／口${mouthCnt}／菊${analCnt}／乳${titCnt}／足${footCnt}」`, fmtOvr("六孔总账", `【🔬 六孔统计】：小穴${vagCnt}｜口${mouthCnt}｜菊${analCnt}｜乳${titCnt}｜足${footCnt}`, [`记录全为0。`,`脸颊发热💦。`,`粘膜不可逆松弛😳💦。`,`想让数字涨更快🥵💦！`,`刷到成百上千次吧🥵💦❤️！`,`啊嘿♡……六孔全部崩坏报废啦🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("高潮总账", `💎 高潮与失禁：「高潮${orgasmCnt}／强制${forceOrgCnt}／寸止${edgeCnt}／喷潮${squirtCnt}／失禁${leakCnt}」`, fmtOvr("高潮总账", `【🔬 高潮统计】：高潮${orgasmCnt}，喷潮${squirtCnt}，失禁${leakCnt}，自慰${mastCnt}。`, [`记录全为0。`,`偶尔发抖💦。`,`括约肌容易失控😳💦。`,`稍微刺激就漏尿🥵💦！`,`最喜欢潮吹失禁啦♡🥵💦❤️！`,`啊嘿♡……24小时翻白眼失禁呀🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("射精总账", `💎 射精与泌乳：「内射${creampie}／颜射${facialCnt}／吞精${swallowCnt}(${swallowMl}ml)／喷乳${milkMl}ml」`, fmtOvr("射精总账", `【🔬 射精与泌乳】：内射${creampie}｜颜射${facialCnt}｜吞精${swallowCnt}次｜泌乳${milkCnt}次。`, [`未注入过体液。`,`耳根发烫💦。`,`清理让人酸麻😳💦。`,`被浓精味浸染透了🥵💦！`,`灌成白浊泡芙吧🥵💦❤️！`,`啊嘿♡……毛孔都在冒浓精呀🥵💦❤️❤️！`]), "none", null, true, 0),
                        mk("露出总账", `💎 接客与轮奸：「接客${hookerCnt}／轮奸${gangCnt}／睡奸${sleepCnt}／露出${safeNum(cnt.暴露?.露出)}」`, fmtOvr("露出总账", `【🔬 交易与凌辱】：接客${hookerCnt}｜轮奸${gangCnt}｜睡奸${sleepCnt}。`, [`记录均为0。`,`多加提防💦。`,`渐渐麻木顺从😳💦。`,`习惯这些过往了。`,`最喜欢被轮奸群交了♡🥵💦❤️！`,`啊嘿♡……公用排泄肉坑欢迎排队来操呀🥵💦❤️❤️！`]), "none", null, true, 0)
                    ]
                }
            ];

            const customMap = v.自定义条目 || {};
            baseCategories.forEach(cat => {
                const customList = Array.isArray(customMap[cat.title]) ? customMap[cat.title] : [];
                customList.forEach(cItem => {
                    if (!cItem || !cItem.id) return;
                    const rk = `${cItem.title || "✨ 自定义状态"}${cItem.ratio ? `：${cItem.ratio}` : ""}${cItem.stage ? `「${cItem.stage}」` : ""}`;
                    cat.items.push({ editKey: cItem.id, isCustom: true, catTitle: cat.title, rawKey: rk, desc: `${cItem.desc || "暂无详细描述"}\n💭【${u}的实时心声】：“*${cleanThoughtText(cItem.thought || "……")}*”`, ...fmtKey(rk, cItem.ratio ? "pleas" : "none", null, !cItem.ratio) });
                });
            });
            return baseCategories;
        }

        function setByPath(obj, pathInput, val) {
            if (!pathInput) return;
            const rawParts = Array.isArray(pathInput) ? pathInput : String(pathInput).split(".").map(s => s.trim()).filter(Boolean);
            const knownRoots = new Set(["档案", "身体", "核心数值", "精神与心理", "受孕与生理", "计数", "体内精液存量", "痕迹与标记", "体内道具与权限", "实况", "穿搭", "调教进度", "精神与心理扩展"]);
            let parts = (rawParts.length > 1 && !knownRoots.has(rawParts[0])) ? rawParts.slice(1) : rawParts;
            if (!parts.length) return;

            if (parts.length === 2 && parts[0] === "计数" && parts[1] === "高潮" && typeof val !== "object") parts = ["计数", "高潮", "总数"];
            else if (parts.length === 2 && parts[0] === "计数" && parts[1] === "失禁") parts = ["计数", "失控", "失禁"];
            else if (parts.length === 2 && parts[0] === "计数" && parts[1] === "喷潮") parts = ["计数", "失控", "喷潮"];
            else if (parts.length === 2 && parts[0] === "计数" && parts[1] === "内射") parts = ["计数", "射精", "内射"];
            else if (parts.length === 2 && parts[0] === "计数" && parts[1] === "小穴") parts = ["计数", "性交", "小穴"];
            else if (parts.length === 2 && parts[0] === "计数" && parts[1] === "口") parts = ["计数", "性交", "口"];
            else if (parts.length === 2 && parts[0] === "计数" && parts[1] === "屁眼") parts = ["计数", "性交", "屁眼"];

            let cur = obj;
            for (let i = 0; i < parts.length - 1; i++) {
                const k = parts[i];
                if (cur[k] === undefined || cur[k] === null || typeof cur[k] !== "object") cur[k] = {};
                cur = cur[k];
            }
            const lastKey = parts[parts.length - 1];
            if (cur[lastKey] && typeof cur[lastKey] === "object" && !Array.isArray(cur[lastKey]) && typeof val !== "object") {
                if ("总数" in cur[lastKey]) cur[lastKey].总数 = Number(val) || 0;
                else if ("失禁" in cur[lastKey]) cur[lastKey].失禁 = Number(val) || 0;
                else if ("内射" in cur[lastKey]) cur[lastKey].内射 = Number(val) || 0;
                else if ("小穴" in cur[lastKey]) cur[lastKey].小穴 = Number(val) || 0;
                return;
            }
            cur[lastKey] = val;
        }

        function parseSetCommands(blockText, targetVars) {
            if (!blockText) return false;
            normalizeVarsStructure(targetVars);
            let hasSet = false;
            const reg = /_\.(set|add)\s*\(\s*(['"`])([^'"`]+)\2\s*,\s*(['"`][\s\S]*?['"`]|-?\d+(?:\.\d+)?|true|false|\{[\s\S]*?\}|\[[\s\S]*?\])\s*\)\s*;?/gi;
            let m;
            while ((m = reg.exec(blockText)) !== null) {
                const rawPath = m[3].trim();
                let rawVal = m[4].trim();
                let parsedVal = rawVal;
                if (/^(?:true|false)$/i.test(rawVal)) parsedVal = rawVal.toLowerCase() === "true" ? 1 : 0;
                else if (/^-?\d+(?:\.\d+)?$/.test(rawVal)) parsedVal = Number(rawVal);
                else if ((rawVal.startsWith("'") && rawVal.endsWith("'")) || (rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("`") && rawVal.endsWith("`"))) parsedVal = rawVal.slice(1, -1);
                else { try { parsedVal = JSON.parse(rawVal); } catch (e) { parsedVal = rawVal.replace(/^['"`]|['"`]$/g, ""); } }
                setByPath(targetVars, rawPath, parsedVal);
                hasSet = true;
            }
            normalizeVarsStructure(targetVars);
            return hasSet;
        }

        function extractFromLegacyText(mesText, targetVars) {
            if (!mesText) return;
            const hasExplicit = /<UpdateVariable>[\s\S]*?<\/UpdateVariable>|_\.set\s*\(/i.test(mesText);
            applyNaturalMetabolism(mesText, targetVars, hasExplicit);
        }

        function getFallbackData() {
            const ctx = safeCtx(), trueProtagName = detectProtagonistName(curVars), c = ctx?.name2 || "无角色卡";
            return {
                charName: trueProtagName,
                floorId: checkCardAvailable(true) ? (viewingHistoryFloor !== null ? `#${viewingHistoryFloor}层(回溯)` : `${c} · 实时`) : "未选择角色卡",
                categories: buildFullFallbackCategories(trueProtagName, c, curVars)
            };
        }

        function applyThemeAndSize() {
            const root = document.getElementById("st-v5-root");
            if (root) root.style.display = userSettings.enabled ? "block" : "none";
            const panel = document.getElementById("st-v5-panel"), headerBar = document.getElementById("st-v5-header");
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            if (panel) {
                panel.className = (tc.cls || "st-theme-succubus") + (userSettings.mobileLiteMode ? " st-lite-mode" : "");
                panel.style.background = tc.bg; panel.style.border = tc.border; panel.style.borderRadius = tc.radius;
                panel.style.boxShadow = tc.shadow; panel.style.color = tc.text;
                panel.style.width = `${Math.min(window.innerWidth - 12, userSettings.width)}px`;
                panel.style.height = `${Math.min(window.innerHeight - 75, userSettings.height)}px`;
                panel.style.fontSize = `${Math.round(13.5 * (userSettings.fontScale / 100))}px`;
                panel.style.backdropFilter = userSettings.mobileLiteMode ? "none" : "blur(14px)";
            }
            if (headerBar && tc.headerBg) headerBar.style.background = tc.headerBg;
            const tb = document.getElementById("st-v5-toggle");
            if (tb) { tb.style.background = `linear-gradient(135deg, ${tc.prim}, ${tc.sec})`; tb.style.boxShadow = `0 6px 20px ${tc.hi}`; }
        }

        function getNormalizedEndpoints(rawUrl) {
            let u = safeStr(rawUrl).trim().replace(/\/+$/, "");
            if (!u) return { chatUrl: "", modelsUrl: "" };
            let base = u.replace(/\/chat\/completions$/i, "").replace(/\/models$/i, "").replace(/\/+$/, "");
            if (!/\/v\d+(?:beta)?$/i.test(base) && !base.includes("/v1")) base += "/v1";
            return { chatUrl: u.toLowerCase().endsWith("/chat/completions") ? u : `${base}/chat/completions`, modelsUrl: `${base}/models` };
        }

        function repairAndParseJson(rawText) {
            if (!rawText) return null;
            let s = safeStr(rawText).replace(/<think[\s\S]*?<\/think>|<think_nya>[\s\S]*?<\/think_nya>|```json|```/gi, "").trim();
            const firstBrace = s.indexOf("{"), lastBrace = s.lastIndexOf("}");
            if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
            let jsonCand = s.slice(firstBrace, lastBrace + 1);
            try { return JSON.parse(jsonCand); } catch (e1) {}
            let fixed = jsonCand.replace(/,\s*([}\]])/g, "$1").replace(/\r?\n/g, " ");
            try { return JSON.parse(fixed); } catch (e2) { return null; }
        }

        async function callSubApiRaw(systemPrompt, userPrompt) {
            const { chatUrl } = getNormalizedEndpoints(userSettings.apiUrl);
            if (!chatUrl || !userSettings.apiKey) throw new Error("请先在 ⚙️设置 中填写副 API 地址和 Key！");
            const res = await fetch(chatUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userSettings.apiKey}` },
                body: JSON.stringify({ model: userSettings.apiModel || "gpt-4o-mini", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], temperature: 0.35, stream: false })
            });
            const resText = await res.text();
            const data = JSON.parse(resText);
            if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
            return { reply: data?.choices?.[0]?.message?.content || "", source: "副API" };
        }

        async function requestSingleItemAiGen(itemTitle, userHint, btnEl) {
            const ctx = safeCtx(), u = detectProtagonistName(curVars), corr = safeNum(curVars.核心数值?.淫乱恶堕, 0);
            const recentMes = safeStr((ctx?.chat || []).slice(-6).map(m => m?.mes || "").join("\n")).slice(-2800);
            const sysPrompt = "你是一个纯粹的 JSON 生成器，只输出标准 JSON 对象！";
            const userPrompt = `请为主角【${u}（恶堕度：${corr}/100）】的【${itemTitle}】编写状态描述和第一人称心声：\n【要求】：${userHint || "结合最新剧情，描写细腻详实"}\n【参考】：${recentMes || "无"}\n输出纯JSON：{"title":"${safeStr(itemTitle).replace(/"/g,"")}","stage":"4至6字概括","ratio":"50/100","desc":"【🔬 状态实况】：...","thought":"第一人称心声..."}`;
            const oldTxt = btnEl ? btnEl.textContent : "";
            if (btnEl) { btnEl.textContent = "⏳ 生成中..."; btnEl.disabled = true; }
            try {
                const { reply } = await callSubApiRaw(sysPrompt, userPrompt);
                const parsed = repairAndParseJson(reply);
                if (parsed && (parsed.desc || parsed.thought)) { showToast("✨ 已通过 AI 刷新状态与心声！", "success", 2400); return parsed; }
                throw new Error("JSON解析失败");
            } catch (err) { showToast("❌ 生成失败：" + (err.message || "请检查副API"), "error", 3500); return null; }
            finally { if (btnEl) { btnEl.textContent = oldTxt || "✨ AI生成"; btnEl.disabled = false; } }
        }

        function buildFullJsonApiPrompt(u, c, rawText) {
            const diff = getDifficultyProfile(), allRecentText = (safeCtx()?.chat || []).slice(-5).map(m => safeStr(m?.mes)).join("\n");
            return `[SYSTEM OVERRIDE: 纯粹JSON生成器]\n请阅读下方正文，重构更新目标【${u}（难度：${diff.mult}x）】全部状态栏数值与计数：\n${safeStr(allRecentText || rawText).slice(-3200)}\n输出纯JSON：{"当前认知名字":"${u}","生理周期阶段":"危险排卵期或正常生理期","受孕概率":50,"体力":75,"对肉棒好感度":75,"性欲程度":80,"淫乱恶堕":78,"羞耻度":22,"服从度":74,"沦陷度":70,"快感累积":65,"口内毫升":0,"小穴毫升":5,"子宫毫升":15,"屁眼毫升":0,"体表痕迹":"无","淫纹与刻印":"无","穿刺与环饰":"无","体内道具":"无","计数":{"口":0,"小穴":0,"屁眼":0,"乳穴":0,"足腿":0,"高潮":0,"强制高潮":0,"寸止":0,"内射":0,"颜射":0,"吞精次数":0,"吞精毫升":0,"喷乳次数":0,"喷乳毫升":0,"自慰":0,"失禁":0,"喷潮":0,"露出":0,"接客":0,"轮奸":0,"睡奸":0},"当前姿势":"简短概括","恩客图鉴":{},"按钮详情":{}}`;
        }

        function applyApiFullResponse(replyText, targetMsg, fid, sourceLabel = "一键API") {
            const data = repairAndParseJson(replyText);
            if (!data || typeof data !== "object") return false;
            pushUndoSnapshot(curVars);
            const v = normalizeVarsStructure(curVars);
            if (data.生理周期阶段) v.受孕与生理.生理周期阶段 = safeStr(data.生理周期阶段);
            if (typeof data.受孕概率 === "number") v.受孕与生理.受孕概率 = data.受孕概率;
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
                if (typeof c.失禁 === "number") v.计数.失控.失禁 = c.失禁;
                if (typeof c.喷潮 === "number") v.计数.失控.喷潮 = c.喷潮;
                if (typeof c.接客 === "number") v.计数.交易.接客卖身 = c.接客;
            }
            if (typeof data.体力 === "number") v.身体.体力 = data.体力;
            if (typeof data.对肉棒好感度 === "number") v.核心数值.对肉棒好感度 = data.对肉棒好感度;
            if (typeof data.性欲程度 === "number") v.核心数值.性欲程度 = data.性欲程度;
            if (typeof data.淫乱恶堕 === "number") v.核心数值.淫乱恶堕 = data.淫乱恶堕;
            if (typeof data.羞耻度 === "number") v.精神与心理.羞耻度 = data.羞耻度;
            if (typeof data.服从度 === "number") v.精神与心理.服从度 = data.服从度;
            if (typeof data.沦陷度 === "number") v.精神与心理.沦陷度 = data.沦陷度;
            if (typeof data.快感累积 === "number") v.精神与心理.快感累积 = data.快感累积;
            calibrateMentalMetrics(v);
            if (typeof data.口内毫升 === "number") v.体内精液存量.口内毫升 = data.口内毫升;
            if (typeof data.小穴毫升 === "number") v.体内精液存量.小穴毫升 = data.小穴毫升;
            if (typeof data.子宫毫升 === "number") v.体内精液存量.子宫毫升 = data.子宫毫升;
            if (typeof data.屁眼毫升 === "number") v.体内精液存量.屁眼毫升 = data.屁眼毫升;
            if (data.当前姿势) v.实况.当前姿势 = safeStr(data.当前姿势);
            if (data.按钮详情 && typeof data.按钮详情 === "object") {
                Object.keys(data.按钮详情).forEach(k => {
                    if (userSettings.pinnedItems?.[k]) return;
                    const prev = v.按钮详情?.[k] || {};
                    v.按钮详情[k] = { ...prev, ...data.按钮详情[k], imgUrl: prev.imgUrl, stageImgs: prev.stageImgs, forceLatestImg: prev.forceLatestImg };
                });
            }
            saveChatCache(v); latestStatus = getFallbackData(); renderBody();
            showToast(`✅ ${sourceLabel}重绘完成！`, "success", 2800);
            return true;
        }

        async function triggerSubApiUpdate(btnEl = null) {
            if (!checkCardAvailable(false)) return;
            const ctx = safeCtx(), chat = ctx?.chat || [], fid = chat.length - 1, targetMsg = chat[fid], rawText = safeStr(targetMsg?.mes);
            const u = detectProtagonistName(curVars), c = ctx?.name2 || "角色", oldTxt = btnEl ? btnEl.textContent : "";
            if (btnEl) btnEl.textContent = "⏳ 重绘中...";
            showToast(`⏳ 正在为【${u}】执行一键API重绘...`, "info", 3500);
            try {
                const { reply, source } = await callSubApiRaw("只输出标准 JSON 对象。", buildFullJsonApiPrompt(u, c, rawText));
                const ok = applyApiFullResponse(reply, targetMsg, fid, source);
                if (btnEl) btnEl.textContent = ok ? "✅ 重绘成功" : "⚠️ 已修复";
            } catch (err) {
                if (btnEl) btnEl.textContent = "❌ 失败";
                showToast("❌ 一键API重绘失败：" + (err.message || "请检查设置"), "error", 3800);
            }
            if (btnEl && oldTxt) setTimeout(() => { btnEl.textContent = oldTxt; }, 2500);
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
        // 💾 通用下载器 + ⭐ 永恒收藏夹 + ⚖️ 初始底图获取器
        // =========================================================================
        let pendingZhjTarget = null;
        const capturedZhjSrcSet = new Set();
        let lastGalleryRecordTime = 0;

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
                const stageIdx = meta.stageIdx || 1;
                userSettings.favoriteGallery.unshift({
                    id: "fav_" + Date.now(),
                    dbKey,
                    fp: getImgFingerprint(dataUrlToSave),
                    src: dataUrlToSave,
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

        function recordToCgGallery(title, imgSrc) {
            if (!imgSrc) return;
            const fp = getImgFingerprint(imgSrc);
            capturedZhjSrcSet.add(imgSrc);
            capturedZhjSrcSet.add(fp);

            curVars.专属相册 = Array.isArray(curVars.专属相册) ? curVars.专属相册 : [];
            const gal = curVars.专属相册;
            const now = Date.now();
            if (gal.some(g => g.src === imgSrc || getImgFingerprint(g.src) === fp)) return;
            if (now - lastGalleryRecordTime < 2200 && gal.length > 0 && gal[0].title.endsWith(title)) {
                gal[0].src = imgSrc;
                saveChatCache(curVars);
                return;
            }
            lastGalleryRecordTime = now;
            const u = detectProtagonistName(curVars), corr = safeNum(curVars.核心数值?.淫乱恶堕, 0);
            gal.unshift({
                title: `${u} · ${title}`,
                editKey: title,
                src: imgSrc,
                corr,
                time: new Date().toLocaleTimeString(),
                quote: generateLiveASMRQuote(curVars, u).slice(0, 46)
            });
            if (gal.length > 36) gal.pop();
            userSettings.cgGallery = gal;
            saveChatCache(curVars);
        }

        function scanChatImagesForZhiHuiJi() {
            if (!userSettings.enabled || !userSettings.zhjAutoCapture || isGeneratingImageBusy) return;
            const chatEl = document.getElementById("chat");
            if (!chatEl) return;
            const imgs = chatEl.querySelectorAll(".mes_text img");
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

            let targetKey = null, targetStageKey = null, isCustom = false, catTitle = "";
            if (pendingZhjTarget && (Date.now() - pendingZhjTarget.ts < 180000)) {
                targetKey = pendingZhjTarget.editKey;
                targetStageKey = pendingZhjTarget.stageKey;
                isCustom = pendingZhjTarget.isCustom;
                catTitle = pendingZhjTarget.catTitle;
                pendingZhjTarget = null;
            } else {
                const mesBox = latestImg.closest(".mes_text");
                const txt = safeStr(mesBox?.textContent);
                const matchMap = [
                    { k: "小穴实况", reg: /小穴|花唇|pussy|vaginal|蜜穴/i },
                    { k: "子宫实况", reg: /子宫|宫颈|cervix|womb/i },
                    { k: "骚口实况", reg: /口交|深喉|mouth|tongue|throat/i },
                    { k: "胸部实况", reg: /乳房|乳头|breasts|nipple|泌乳/i },
                    { k: "屁眼实况", reg: /后庭|肛门|屁眼|anus|prolapse/i },
                    { k: "阴蒂尿道", reg: /阴蒂|尿道|clitoris|urethra/i },
                    { k: "当前姿势", reg: /姿势|跪趴|躺|体位|pose/i }
                ];
                for (const m of matchMap) {
                    if (m.reg.test(txt)) { targetKey = m.k; targetStageKey = getProtagScopedImgKey(m.k, 1); break; }
                }
                if (!targetKey) { targetKey = "当前姿势"; targetStageKey = getProtagScopedImgKey("当前姿势", 1); }
            }

            if (targetKey) {
                if (isCustom && catTitle) {
                    const found = (curVars.自定义条目?.[catTitle] || []).find(x => x.id === targetKey);
                    if (found) found.imgUrl = src;
                } else {
                    curVars.按钮详情 = curVars.按钮详情 || {};
                    curVars.按钮详情[targetKey] = { ...(curVars.按钮详情[targetKey] || {}), imgUrl: src, forceLatestImg: src };
                }
                if (src.startsWith("data:")) rawSaveDataUrlToDB(targetStageKey, src).catch(() => {});
                recordToCgGallery(targetKey, src);
                saveChatCache(curVars);
                latestStatus = getFallbackData();
                renderBody();
                showToast(`🖼️ 已自动捕获新生成图片并挂载至【${targetKey}】！`, "success", 3000);
            }
        }

        function getInitialLv1ImageCandidates(editKey) {
            if (!editKey || !HAS_ORIGINAL_DEFAULT_IMG.has(editKey)) return [];
            const baseFolder = `${PLUGIN_BASE_PATH}/images`, cands = [];
            const fh = queryImportedImage(`${editKey}_1`);
            if (fh) cands.push(fh);
            const hg = queryImportedImage(editKey);
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

        function getStageImageCandidates(item) {
            if (!item.editKey) return [];
            const pct = (item.pct !== null && item.pct !== undefined) ? item.pct : 0;
            const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
            const stageIdx = item.hasStageBar ? tier6(pct, isRev) : 0, stageNum = stageIdx + 1;
            const baseFolder = `${PLUGIN_BASE_PATH}/images`, candidates = [];
            const btnRec = curVars.按钮详情?.[item.editKey] || {};
            const stageMap = btnRec.stageImgs || {};

            const scopedKeyNow = getProtagScopedImgKey(item.editKey, stageNum);
            const hitScopedNow = queryImportedImage(scopedKeyNow);
            if (hitScopedNow) candidates.push(hitScopedNow);
            if (stageMap[stageNum] && !candidates.includes(stageMap[stageNum])) candidates.push(stageMap[stageNum]);
            if (btnRec.forceLatestImg && !candidates.includes(btnRec.forceLatestImg)) candidates.push(btnRec.forceLatestImg);

            const manualUrl = safeStr(item.isCustom ? curVars.自定义条目?.[item.catTitle]?.find(x => x.id === item.editKey)?.imgUrl : btnRec.imgUrl).trim();
            if (manualUrl) {
                const hitManual = queryImportedImage(manualUrl);
                if (hitManual && !candidates.includes(hitManual)) candidates.push(hitManual);
                if (!candidates.includes(manualUrl)) candidates.push(manualUrl);
            }

            for (let s = stageNum; s >= 1; s--) {
                const pKey = getGlobalPinKey(item.editKey, s);
                if (userSettings.globalPinnedStageImgs?.[pKey]) {
                    const hitPin = queryImportedImage(pKey);
                    if (hitPin && !candidates.includes(hitPin)) candidates.push(hitPin);
                }
            }

            for (let s = stageNum; s >= 1; s--) {
                const fScoped = queryImportedImage(getProtagScopedImgKey(item.editKey, s));
                if (fScoped && !candidates.includes(fScoped)) candidates.push(fScoped);
                if (stageMap[s] && !candidates.includes(stageMap[s])) candidates.push(stageMap[s]);
            }

            if (HAS_ORIGINAL_DEFAULT_IMG.has(item.editKey)) {
                for (let s = stageNum; s >= 1; s--) {
                    const fh = queryImportedImage(`${item.editKey}_${s}`);
                    if (fh && !candidates.includes(fh)) candidates.push(fh);
                }
                const hg = queryImportedImage(item.editKey);
                if (hg && !candidates.includes(hg)) candidates.push(hg);
                for (let s = stageNum; s >= 1; s--) {
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
            if (!confirm(`🧹 确定要清理【${u}】在本局生成的所有图片并恢复默认初始底图吗？（注：⭐永恒收藏夹、原始ZIP底图与其他旧聊天的图均100%保留！）`)) return;
            const prefix = normalizeImgKey(`${getChatStoreKey().replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_").slice(-32)}_${u}_`);
            try {
                const db = await openImageDB();
                const tx = db.transaction(IDB_STORE, "readwrite"), store = tx.objectStore(IDB_STORE);
                for (const k of Array.from(importedImgCache.keys())) {
                    if (k.startsWith(prefix)) { store.delete(k); importedImgCache.delete(k); }
                }
            } catch (e) {}
            if (curVars.按钮详情) {
                Object.keys(curVars.按钮详情).forEach(k => {
                    delete curVars.按钮详情[k].imgUrl;
                    delete curVars.按钮详情[k].stageImgs;
                    delete curVars.按钮详情[k].forceLatestImg;
                });
            }
            curVars.专属相册 = [];
            userSettings.cgGallery = [];
            saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
            showToast(`🧹 已清理【${u}】的本局配图，已恢复显示默认初始底图！`, "success", 3000);
        }

        function openTrueFullscreenImage(imgSrc) {
            if (!imgSrc) return;
            let lb = document.getElementById("st-v25-fullscreen-lightbox");
            if (!lb) {
                lb = document.createElement("div"); lb.id = "st-v25-fullscreen-lightbox";
                lb.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;background:#000;display:none;flex-direction:column;justify-content:center;align-items:center;overflow:auto;";
                document.body.appendChild(lb);
            }
            const u = detectProtagonistName(curVars) || "角色";
            const isFav = isImageFavorited(imgSrc);
            lb.innerHTML = `
                <div style="position:fixed;top:14px;right:14px;z-index:2147483647;display:flex;gap:8px;">
                    <button id="st-lb-fav-btn" type="button" style="background:${isFav ? 'linear-gradient(135deg,#fde047,#f59e0b)' : 'rgba(255,255,255,0.18)'};color:${isFav ? '#111' : '#fde047'};border:1.5px solid #fde047;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">${isFav ? "🌟 已收藏" : "⭐ 收藏此图"}</button>
                    <button id="st-lb-dl-btn" type="button" style="background:linear-gradient(135deg,#10b981,#06b6d4);color:#fff;border:none;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.6);">💾 保存到相册</button>
                    <button id="st-lb-close-btn" type="button" style="background:rgba(20,16,32,0.88);color:#fff;border:1.5px solid #f38ba8;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:bold;cursor:pointer;">关闭 ✕</button>
                </div>
                <img id="st-lb-full-img" src="${imgSrc}" style="width:100vw;height:auto;object-fit:contain;display:block;margin:auto;">
            `;
            lb.style.display = "flex";
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
            lb.querySelector("#st-lb-full-img").onclick = () => { lb.style.display = "none"; };
        }

        // =========================================================================
        // 📜 模块2：一键生成黑金《恶堕器质鉴定书》长图海报并下载
        // =========================================================================
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
                const idNote = detectRealCharacterIdentity(v);
                ctx.fillText(`🎯 鉴定对象：${u} （${idNote}）`, 46, 122);

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

        function parsePromptFromImageBlock(blockTxt) {
            const sceneMatch = blockTxt.match(/image###([\s\S]*?)###/i);
            const rawPrompt = sceneMatch ? sceneMatch[1] : blockTxt;
            const ucMatch = rawPrompt.match(/UC:([^;]+);/i);
            const negPrompt = ucMatch ? ucMatch[1].replace(/\d+(?:\.\d+)?::|::/g, "").trim() : "lowres, bad anatomy, text, watermark";
            const posPrompt = rawPrompt.replace(/Char1\s*UC:[^;]+;?/gi, "").replace(/Scene:|Char1:|centers:[A-Z0-9]+|\|/gi, ", ").replace(/\d+(?:\.\d+)?::|::/g, "").replace(/[;\n\r]+/g, ", ").trim();
            return { posPrompt, negPrompt, rawInner: sceneMatch ? sceneMatch[1].trim() : blockTxt };
        }

        async function silentBackgroundGenerateImage(item, curStageIdx, u, btnEl = null) {
            if (isGeneratingImageBusy) { showToast("⏳ 当前已有图片正在后台绘制中，请稍候...", "warn", 2500); return false; }
            isGeneratingImageBusy = true;
            const blockTxt = buildDanbooruImageBlock(item, curStageIdx, u);
            const { posPrompt, negPrompt, rawInner } = parsePromptFromImageBlock(blockTxt);
            const scopedStageKey = getProtagScopedImgKey(item.editKey || "custom", curStageIdx);
            const oldBtnTxt = btnEl ? btnEl.textContent : "";
            if (btnEl) { btnEl.textContent = "⏳ 生图中..."; btnEl.disabled = true; }
            showToast(`🎨 正在后台为【${u}】绘制并替换【${item.cleanTitle || item.editKey} (第${curStageIdx}阶)】...`, "info", 4000);

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
                        const resp = await fetch(finalSrc);
                        const blob = await resp.blob();
                        finalSrc = await blobToDataUrl(blob, "gen.webp");
                    } catch (e) {}
                }
                capturedZhjSrcSet.add(finalSrc);
                capturedZhjSrcSet.add(getImgFingerprint(finalSrc));

                if (finalSrc.startsWith("data:")) {
                    await rawSaveDataUrlToDB(scopedStageKey, finalSrc).catch(() => {});
                }
                if (item.isCustom && item.catTitle) {
                    const found = (curVars.自定义条目?.[item.catTitle] || []).find(x => x.id === item.editKey);
                    if (found) found.imgUrl = finalSrc;
                } else {
                    curVars.按钮详情 = curVars.按钮详情 || {};
                    const prevObj = curVars.按钮详情[item.editKey] || {};
                    const stageImgs = { ...(prevObj.stageImgs || {}), [curStageIdx]: finalSrc };
                    curVars.按钮详情[item.editKey] = { ...prevObj, imgUrl: finalSrc, forceLatestImg: finalSrc, stageImgs };
                }
                recordToCgGallery(item.cleanTitle || item.editKey, finalSrc);
                saveChatCache(curVars);
                latestStatus = getFallbackData();
                renderBody();

                const modalImg = document.getElementById("st-det-stage-img");
                const modalPh = document.getElementById("st-det-img-placeholder");
                const edImgInp = document.getElementById("st-ed-img");
                if (modalImg) { modalImg.src = finalSrc; modalImg.style.display = "block"; }
                if (modalPh) modalPh.style.display = "none";
                if (edImgInp) edImgInp.value = finalSrc;

                lastImageGenFinishTime = Date.now();
                showToast(`✅ 【${item.cleanTitle || item.editKey}】新图已生成并挂载！`, "success", 3200);
                return true;
            };

            let stealthStyle = document.getElementById("st-zhj-stealth-css");
            if (!stealthStyle) {
                stealthStyle = document.createElement("style"); stealthStyle.id = "st-zhj-stealth-css";
                document.head.appendChild(stealthStyle);
            }
            stealthStyle.textContent = `.st-zhj-parasite-box { position:fixed !important; left:-9999px !important; top:-9999px !important; width:1px !important; height:1px !important; opacity:0.001 !important; pointer-events:none !important; overflow:hidden !important; z-index:-9999 !important; }`;

            try {
                const customFnName = safeStr(userSettings.zhihuijiGlobalFn).trim();
                const candFns = [customFnName, "zhihuijiGenerate", "generateZhihuijiImage", "stZhihuijiGenerate"].filter(Boolean);
                for (const fnName of candFns) {
                    if (typeof window[fnName] === "function") {
                        const res = await window[fnName](rawInner, blockTxt, { silent: true, prompt: posPrompt, negative_prompt: negPrompt });
                        if (typeof res === "string" && res.length > 16) return await saveAndMountImg(res);
                        else if (res && (res.url || res.data || res.base64 || res.image)) return await saveAndMountImg(res.url || res.data || res.base64 || res.image);
                    }
                }

                const ctx = safeCtx(), chatArr = ctx?.chat || [], lastIdx = chatArr.length - 1;
                const allMesEls = document.querySelectorAll("#chat .mes");
                const lastMesEl = allMesEls.length ? allMesEls[allMesEls.length - 1] : null;
                const lastMesTextEl = lastMesEl ? lastMesEl.querySelector(".mes_text") : null;

                if (lastMesTextEl) {
                    pendingZhjTarget = { editKey: item.editKey, stageKey: scopedStageKey, stageIdx: curStageIdx, title: item.cleanTitle || item.editKey, isCustom: item.isCustom, catTitle: item.catTitle, ts: Date.now() };
                    const existingSrcs = new Set(Array.from(lastMesEl.querySelectorAll("img")).map(img => img.getAttribute("src") || img.src || ""));
                    const origMesRaw = (lastIdx >= 0 && chatArr[lastIdx]) ? String(chatArr[lastIdx].mes || "") : null;
                    if (lastIdx >= 0 && chatArr[lastIdx] && origMesRaw !== null) {
                        const cleanOrig = origMesRaw
                            .replace(/第[一二三四五六1-6]阶段：[^\n<]*\s*<image>[\s\S]*?<\/image>/gi, "")
                            .replace(/<image>[\s\S]*?<\/image>/gi, "")
                            .replace(/image###[\s\S]*?###/gi, "");
                        chatArr[lastIdx].mes = cleanOrig + "\n" + blockTxt;
                    }
                    let parasite = document.createElement("div");
                    parasite.className = "st-zhj-parasite-box";
                    parasite.innerHTML = `${blockTxt}\n<div>image###${rawInner}###</div>`;
                    lastMesTextEl.appendChild(parasite);

                    if (ctx?.eventSource && ctx?.event_types) {
                        [ctx.event_types.CHARACTER_MESSAGE_RENDERED, ctx.event_types.MESSAGE_UPDATED, ctx.event_types.USER_MESSAGE_RENDERED].filter(Boolean).forEach(ev => {
                            try { ctx.eventSource.emit(ev, Math.max(0, lastIdx)); } catch (e) {}
                        });
                    }

                    const capturedSrc = await new Promise((resolve) => {
                        let ticks = 0;
                        const timer = setInterval(() => {
                            ticks++;
                            const imgs = Array.from(lastMesEl.querySelectorAll("img"));
                            for (const im of imgs) {
                                const s = im.getAttribute("src") || im.src || "";
                                if (!s || existingSrcs.has(s) || s.includes("loading") || s.includes("spinner") || s.includes("avatar") || im.closest(".avatar")) continue;
                                capturedZhjSrcSet.add(s);
                                capturedZhjSrcSet.add(getImgFingerprint(s));
                                const wrapper = im.closest(".st-zhj-parasite-box") || im.closest("details") || im.parentElement;
                                if (wrapper && wrapper !== lastMesTextEl && wrapper !== lastMesEl) { wrapper.style.display = "none"; setTimeout(() => { try { wrapper.remove(); } catch (e) {} }, 200); }
                                else { im.style.display = "none"; setTimeout(() => { try { im.remove(); } catch (e) {} }, 200); }
                                clearInterval(timer); resolve(s); return;
                            }
                            if (ticks >= 120) { clearInterval(timer); resolve(""); }
                        }, 500);
                    });

                    try { parasite.remove(); } catch (e) {}
                    if (lastIdx >= 0 && chatArr[lastIdx] && origMesRaw !== null) chatArr[lastIdx].mes = origMesRaw;
                    scrubRawBlocksFromChatDOM();
                    if (capturedSrc) { pendingZhjTarget = null; return await saveAndMountImg(capturedSrc); }
                }
                showToast("⚠️ 等待生图超时！请确认生图扩展已开启自动生图。", "warn", 3800);
                return false;
            } catch (err) {
                showToast("❌ 后台生图出错：" + (err.message || "未知错误"), "error", 3500);
                return false;
            } finally {
                isGeneratingImageBusy = false;
                scrubRawBlocksFromChatDOM();
                if (btnEl) { btnEl.textContent = oldBtnTxt || "🎨 生图"; btnEl.disabled = false; }
            }
        }

        function checkAndQueueMajorChangeAutoGen(categories, u) {
            if (!userSettings.autoGenOnMajorChange || viewingHistoryFloor !== null) return;
            const allItems = [];
            (categories || []).forEach(c => (c.items || []).forEach(it => allItems.push(it)));
            const curTierSnap = {};
            allItems.forEach(item => {
                if (!item.editKey) return;
                const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
                curTierSnap[item.editKey] = (item.hasStageBar ? tier6(item.pct || 0, isRev) : 0) + 1;
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
            const tryNext = () => {
                if (idx >= candidates.length) { thumbWrapEl.style.display = "none"; return; }
                imgEl.src = candidates[idx++];
            };
            imgEl.onload = () => { thumbWrapEl.style.display = "flex"; };
            imgEl.onerror = tryNext;
            thumbWrapEl.onclick = (e) => { e.stopPropagation(); openTrueFullscreenImage(imgEl.src); };
            tryNext();
        }

        function showTagDetailPopover(title, badgeText, originText, effectText, thoughtHint) {
            let pop = document.getElementById("st-tag-popover");
            if (!pop) {
                pop = document.createElement("div");
                pop.id = "st-tag-popover";
                document.body.appendChild(pop);
                document.addEventListener("pointerdown", (ev) => {
                    if (pop.style.display === "block" && !pop.contains(ev.target) && !ev.target.closest(".st-tag-pressable")) {
                        pop.style.display = "none";
                    }
                });
            }
            pop.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(244,114,182,0.35);padding-bottom:6px;margin-bottom:8px;">
                    <span style="font-size:13.5px;font-weight:bold;color:#fde047;">${title}</span>
                    <span style="background:rgba(244,114,182,0.25);border:1px solid #f472b6;color:#fff;padding:1px 8px;border-radius:99px;font-size:10.5px;font-weight:bold;">${badgeText}</span>
                </div>
                <div style="margin-bottom:6px;"><b style="color:#f472b6;">🔍 状态成因：</b><span style="color:#e2e8f0;">${originText}</span></div>
                <div style="margin-bottom:6px;"><b style="color:#67e8f9;">⚡ 躯体与剧情影响：</b><span style="color:#cbd5e1;">${effectText}</span></div>
                <div style="background:rgba(244,114,182,0.12);border-left:2.5px solid #f472b6;padding:6px 9px;border-radius:0 6px 6px 0;font-style:italic;color:#ffd6e4;font-size:11.5px;">💭 “${thoughtHint}”</div>
                <div style="text-align:right;margin-top:6px;font-size:10px;color:#94a3b8;">（点击空白处关闭详情）</div>
            `;
            pop.style.left = "50%";
            pop.style.top = "50%";
            pop.style.transform = "translate(-50%, -50%)";
            pop.style.display = "block";
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

        // =========================================================================
        // ✏️ 模块1：支持【⚖️ 堕落前后双图同框对比】+【⭐收藏/💾下载/🌐全局】的详情弹窗
        // =========================================================================
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
            const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
            const curStageIdx = (item.hasStageBar ? tier6(curPct, isRev) : 0) + 1;
            const lockedVal = typeof curVars.上帝强制锁定?.[item.editKey] === "number" ? curVars.上帝强制锁定[item.editKey] : null;
            const isAutoGenChecked = Boolean(userSettings.autoGenItemMap?.[item.editKey]);
            const isPinned = Boolean(userSettings.pinnedItems?.[item.editKey]);
            const pinKey = getGlobalPinKey(item.editKey, curStageIdx);

            const box = modal.querySelector(".st-modal-box");
            box.style.background = tc.bg; box.style.border = tc.border; box.style.color = tc.text;
            box.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.12);">
                    <div style="font-size:15px;font-weight:bold;color:#f9e2af;word-break:break-word;">${item.cleanTitle || item.rawKey}</div>
                    <button id="st-det-close" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:8px;padding:4px 10px;font-size:12px;cursor:pointer;">✕</button>
                </div>
                ${item.barHTML || ""}
                <div id="st-det-img-wrap" style="margin-top:10px;display:flex;flex-direction:column;gap:6px;background:rgba(0,0,0,0.32);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;flex-wrap:wrap;">
                        <span style="font-size:11.5px;color:${tc.prim};font-weight:bold;">🖼️ 第 ${curStageIdx} 阶实况</span>
                        <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">
                            ${initLv1Cands.length ? `<button id="st-det-compare-btn" type="button" style="background:rgba(168,85,247,0.22);color:#e9d5ff;border:1px solid #c084fc;border-radius:6px;padding:3px 7px;font-size:10.5px;font-weight:bold;cursor:pointer;">⚖️ 堕落前后对比</button>` : ""}
                            <button id="st-det-fav-img-btn" type="button" style="background:rgba(255,255,255,0.12);color:#fde047;border:1px solid #fde047;border-radius:6px;padding:3px 7px;font-size:10.5px;font-weight:bold;cursor:pointer;">⭐ 收藏</button>
                            <button id="st-det-dl-img-btn" type="button" style="background:linear-gradient(135deg,#10b981,#06b6d4);color:#fff;border:none;border-radius:6px;padding:3px 7px;font-size:10.5px;font-weight:bold;cursor:pointer;">💾 下载</button>
                            <button id="st-det-global-img-pin" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid #f472b6;border-radius:6px;padding:3px 7px;font-size:10.5px;font-weight:bold;cursor:pointer;">🌐 全局</button>
                            <button id="st-det-zhj-gen" type="button" style="background:linear-gradient(135deg,#f59e0b,#ec4899);color:#fff;border:none;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:bold;cursor:pointer;">🎨 生图</button>
                        </div>
                    </div>
                    <!-- 单图视图 -->
                    <img id="st-det-stage-img" style="display:none;width:100%;max-height:240px;object-fit:contain;border-radius:8px;cursor:zoom-in;background:#0a0612;" alt="部位实况">
                    <!-- ⚖️ 堕落前后双图对比视图 -->
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
                    <div id="st-det-img-placeholder" style="font-size:11.5px;color:#a6adc8;padding:12px 8px;text-align:center;border:1px dashed rgba(255,255,255,0.15);border-radius:8px;">暂无第 ${curStageIdx} 阶配图，点击右上角「🎨 生图」将在后台生成并直接替换显示。</div>
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
                    ${item.hasStageBar ? `
                    <div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);border-radius:8px;padding:7px 10px;margin-bottom:8px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:#fde047;font-weight:bold;">
                            <span>👑 强制锁定数值：<b id="st-god-val-label">${lockedVal !== null ? lockedVal + "% (已锁定)" : curPct + "% (自动)"}</b></span>
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
            const tryNextImg = () => {
                if (candIdx >= candidates.length) { imgEl.style.display = "none"; phEl.style.display = "block"; return; }
                imgEl.src = candidates[candIdx++];
            };
            imgEl.onload = () => { imgEl.style.display = "block"; phEl.style.display = "none"; updateFavBtnUI(); };
            imgEl.onerror = tryNextImg;
            imgEl.onclick = () => openTrueFullscreenImage(imgEl.src);
            if (candidates.length > 0) tryNextImg();

            // ⚖️ 堕落前后双图同框对比绑定
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
                        const tryBefore = () => { if (bIdx < initLv1Cands.length) beforeImg.src = initLv1Cands[bIdx++]; };
                        beforeImg.onerror = tryBefore;
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

            // ⭐ 收藏、💾 下载、🌐 全局按钮绑定
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
                godSlider.oninput = () => {
                    tempGodVal = parseInt(godSlider.value, 10);
                    if (godLabel) godLabel.textContent = `${tempGodVal}% (待保存锁定)`;
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
                        curVars.按钮详情 = curVars.按钮详情 || {};
                        const prev = curVars.按钮详情[item.editKey] || {};
                        curVars.按钮详情[item.editKey] = { ...prev, imgUrl: res.dUrl, forceLatestImg: res.dUrl, stageImgs: { ...(prev.stageImgs || {}), [curStageIdx]: res.dUrl } };
                        recordToCgGallery(item.cleanTitle || item.editKey, res.dUrl);
                        saveChatCache(curVars);
                        imgEl.src = res.dUrl; imgEl.style.display = "block"; phEl.style.display = "none";
                        box.querySelector("#st-ed-img").value = res.dUrl;
                        latestStatus = getFallbackData(); renderBody();
                        showToast(`✅ 已成功替换【${item.cleanTitle}】配图！`, "success");
                    }
                };
            }

            box.querySelector("#st-det-close").onclick = () => { modal.style.display = "none"; };
            box.querySelector("#st-det-copy-tag").onclick = async () => {
                const block = buildDanbooruImageBlock(item, curStageIdx, u);
                try { await navigator.clipboard.writeText(block); showToast("📋 已复制生图 Tag！", "success"); } catch (e) {}
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
                pushUndoSnapshot(curVars);
                const stg = box.querySelector("#st-ed-stage").value.trim(), im = box.querySelector("#st-ed-img").value.trim();
                const dsc = box.querySelector("#st-ed-desc").value.trim(), tht = box.querySelector("#st-ed-thought").value.trim();
                if (tempGodVal !== null && !isNaN(tempGodVal)) {
                    curVars.上帝强制锁定 = curVars.上帝强制锁定 || {};
                    curVars.上帝强制锁定[item.editKey] = tempGodVal;
                }
                if (item.isCustom && customRec) {
                    if (stg) customRec.stage = stg;
                    customRec.imgUrl = im; customRec.desc = dsc; customRec.thought = tht;
                } else {
                    const prev = curVars.按钮详情?.[item.editKey] || {};
                    curVars.按钮详情[item.editKey] = { ...prev, stage: stg, imgUrl: im || prev.imgUrl, desc: dsc, thought: tht };
                }
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
                showToast("💾 已保存修改！", "success");
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
            box.style.background = tc.bg; box.style.border = tc.border; box.style.color = tc.text;
            box.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.12);"><div style="font-size:14px;font-weight:bold;color:#f9e2af;">➕ 在【${catTitle}】新增自定义条目</div><button id="st-add-close" type="button" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:8px;padding:3px 9px;cursor:pointer;">✕</button></div><div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;"><input id="st-new-title" placeholder="条目名称" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;"><input id="st-new-stage" placeholder="状态标签" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;"><textarea id="st-new-desc" rows="3" placeholder="详细实况描写..." style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;"></textarea><textarea id="st-new-thought" rows="2" placeholder="第一人称心声..." style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px 8px;color:#fff;font-size:12px;"></textarea><button id="st-new-submit" type="button" style="background:${tc.prim};color:#11111b;border:none;border-radius:8px;padding:8px;font-size:12.5px;font-weight:bold;cursor:pointer;">✅ 确认添加</button></div>`;
            modal.style.display = "flex";
            box.querySelector("#st-add-close").onclick = () => { modal.style.display = "none"; };
            box.querySelector("#st-new-submit").onclick = () => {
                const title = box.querySelector("#st-new-title").value.trim(); if (!title) return;
                pushUndoSnapshot(curVars);
                curVars.自定义条目 = curVars.自定义条目 || {};
                curVars.自定义条目[catTitle] = curVars.自定义条目[catTitle] || [];
                curVars.自定义条目[catTitle].push({ id: "cust_" + Date.now(), title, stage: box.querySelector("#st-new-stage").value.trim() || "新增", desc: box.querySelector("#st-new-desc").value.trim(), thought: box.querySelector("#st-new-thought").value.trim() });
                saveChatCache(curVars); latestStatus = getFallbackData(); renderBody(); modal.style.display = "none";
            };
        }

        // =========================================================================
        // 🎞️ 模块4/5/6：恶堕相册 & ⭐ 永恒收藏夹（支持角色/部位筛选、🔝置顶、✏️改备注、📤全量打包备份）
        // =========================================================================
        let currentGalleryTab = "fav";
        let favFilterChar = "ALL";
        let favFilterPart = "ALL";

        function openCgGalleryModal(defaultTab = null) {
            const modal = document.getElementById("st-v5-modal");
            if (!modal) return;
            if (defaultTab) currentGalleryTab = defaultTab;
            const tc = THEMES[userSettings.theme] || THEMES["魅魔粉"];
            const box = modal.querySelector(".st-modal-box");
            box.style.background = tc.bg; box.style.border = tc.border; box.style.color = tc.text;

            curVars.专属相册 = Array.isArray(curVars.专属相册) ? curVars.专属相册 : [];
            userSettings.favoriteGallery = Array.isArray(userSettings.favoriteGallery) ? userSettings.favoriteGallery : [];
            // 置顶排序
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
                const realSrc = (g.dbKey && queryImportedImage(g.dbKey)) ? queryImportedImage(g.dbKey) : g.src;
                const favFlag = isImageFavorited(realSrc);
                return `
                <div style="background:rgba(0,0,0,0.48);border:1.5px solid ${g.pinned ? '#fde047' : (isFavTab ? '#f472b6' : tc.prim)};border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:4px;position:relative;">
                    <div style="position:absolute;top:9px;right:9px;display:flex;gap:3px;z-index:2;">
                        ${isFavTab ? `<button type="button" class="st-cg-pin-top" data-idx="${realIdx}" title="置顶/取消置顶" style="background:${g.pinned ? '#fde047' : 'rgba(0,0,0,0.75)'};color:${g.pinned ? '#111' : '#fff'};border:1px solid #fde047;border-radius:50%;width:22px;height:22px;font-size:10px;cursor:pointer;">🔝</button>` : ""}
                        ${!isFavTab ? `<button type="button" class="st-cg-fav-btn" data-idx="${realIdx}" title="收藏到永恒收藏夹" style="background:${favFlag ? '#fde047' : 'rgba(0,0,0,0.75)'};color:${favFlag ? '#111' : '#fde047'};border:1px solid #fde047;border-radius:50%;width:22px;height:22px;font-size:11px;cursor:pointer;">⭐</button>` : ""}
                        <button type="button" class="st-cg-dl-btn" data-idx="${realIdx}" title="下载保存" style="background:rgba(16,185,129,0.9);color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:10px;cursor:pointer;">💾</button>
                        <button type="button" class="st-cg-del-btn" data-idx="${realIdx}" title="删除" style="background:rgba(225,29,72,0.9);color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:10px;cursor:pointer;">✕</button>
                    </div>
                    <img src="${realSrc}" class="st-cg-zoom" style="width:100%;height:130px;object-fit:cover;border-radius:7px;cursor:zoom-in;background:#090510;">
                    <div class="st-cg-edit-note" data-idx="${realIdx}" title="点击修改标题/备注" style="font-size:11px;font-weight:bold;color:#f9e2af;display:flex;justify-content:space-between;align-items:center;gap:4px;cursor:pointer;">
                        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${g.pinned ? "📌 " : ""}${g.note || g.title || "收藏美图"} ✏️</span>
                        <span style="color:#fb7185;flex-shrink:0;">${g.corr ?? 0}%</span>
                    </div>
                    <div style="font-size:10px;color:#ffd6e4;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${g.quote || ""}</div>
                    ${isFavTab ? `<button type="button" class="st-cg-apply-btn" data-idx="${realIdx}" style="margin-top:2px;background:rgba(244,114,182,0.22);border:1px solid #f472b6;color:#fbcfe8;border-radius:6px;padding:3px 6px;font-size:10.5px;font-weight:bold;cursor:pointer;">📌 设为当前聊天此部位配图</button>` : ""}
                </div>`;
            }).join("") : `<div style="grid-column:1/-1;text-align:center;padding:28px 12px;color:#a6adc8;font-size:12px;">${isFavTab ? "⭐ 您的【永恒收藏夹】暂无符合条件的美图！<br><br>在任意按钮详情里点「⭐ 收藏」，即可将神图永久珍藏在此处（删聊天也绝不丢失）！" : "📸 当前聊天暂无抓拍记录。只要使用「🎨 生图」就会自动收录。"}</div>`;

            box.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.15);flex-wrap:wrap;gap:6px;">
                    <div style="display:flex;gap:6px; align-items:center;">
                        <button id="st-tab-chat-gal" type="button" style="background:${!isFavTab ? tc.prim : 'rgba(255,255,255,0.1)'};color:${!isFavTab ? '#111' : '#fff'};border:none;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:bold;cursor:pointer;">📸 本局抓拍 (${chatGal.length})</button>
                        <button id="st-tab-fav-gal" type="button" style="background:${isFavTab ? 'linear-gradient(135deg,#fde047,#f59e0b)' : 'rgba(255,255,255,0.1)'};color:${isFavTab ? '#111' : '#fde047'};border:1px solid #fde047;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:bold;cursor:pointer;">⭐ 永恒收藏夹 (${favGal.length})</button>
                    </div>
                    <div style="display:flex;gap:5px;align-items:center;">
                        ${(!isFavTab && chatGal.length) ? `<button id="st-cg-clear-all" type="button" style="background:rgba(225,29,72,0.25);color:#fda4af;border:1px solid #e11d48;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">🗑️ 清空本局</button>` : ""}
                        <button id="st-cg-close" type="button" style="background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:7px;padding:3px 9px;cursor:pointer;">✕</button>
                    </div>
                </div>
                ${filterBarHtml}
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;max-height:64vh;overflow-y:auto;">${cardsHtml}</div>
            `;
            modal.style.display = "flex";

            box.querySelector("#st-tab-chat-gal").onclick = () => openCgGalleryModal("chat");
            box.querySelector("#st-tab-fav-gal").onclick = () => openCgGalleryModal("fav");
            box.querySelector("#st-cg-close").onclick = () => { modal.style.display = "none"; };
            box.querySelectorAll(".st-cg-zoom").forEach(im => { im.onclick = () => openTrueFullscreenImage(im.src); });

            const fltChar = box.querySelector("#st-fav-flt-char"), fltPart = box.querySelector("#st-fav-flt-part");
            if (fltChar) fltChar.onchange = (e) => { favFilterChar = e.target.value; openCgGalleryModal("fav"); };
            if (fltPart) fltPart.onchange = (e) => { favFilterPart = e.target.value; openCgGalleryModal("fav"); };

            // 📤 备份与恢复全部收藏图+补丁
            const expFavBtn = box.querySelector("#st-fav-export-btn"), impFavBtn = box.querySelector("#st-fav-import-btn"), impFavFile = box.querySelector("#st-fav-import-file");
            if (expFavBtn) {
                expFavBtn.onclick = () => {
                    const pack = { version: "1.0_fav_backup", favoriteGallery: favGal, installedPatches: userSettings.installedPatches || [] };
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
                                if (item.dbKey && item.src) await rawSaveDataUrlToDB(item.dbKey, item.src).catch(() => {});
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
                    await toggleFavoriteImage(item.src, { title: item.title, editKey: item.editKey, corr: item.corr, quote: item.quote });
                    openCgGalleryModal("chat");
                };
            });

            box.querySelectorAll(".st-cg-dl-btn").forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    const item = isFavTab ? favGal[idx] : chatGal[idx];
                    if (!item) return;
                    const realSrc = (item.dbKey && queryImportedImage(item.dbKey)) ? queryImportedImage(item.dbKey) : item.src;
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
                            try {
                                const db = await openImageDB();
                                const tx = db.transaction(IDB_STORE, "readwrite");
                                tx.objectStore(IDB_STORE).delete(removed.dbKey);
                                importedImgCache.delete(removed.dbKey);
                            } catch (err) {}
                        }
                        saveSettings();
                        openCgGalleryModal("fav");
                    } else {
                        chatGal.splice(idx, 1);
                        userSettings.cgGallery = chatGal;
                        saveChatCache(curVars);
                        openCgGalleryModal("chat");
                    }
                };
            });

            box.querySelectorAll(".st-cg-apply-btn").forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"), 10);
                    const favItem = favGal[idx];
                    if (!favItem) return;
                    const realSrc = (favItem.dbKey && queryImportedImage(favItem.dbKey)) ? queryImportedImage(favItem.dbKey) : favItem.src;
                    const targetEditKey = prompt("📌 请输入要将这张收藏图挂到当前聊天的哪个按钮上（默认自动填入原部位）：", favItem.editKey || "当前姿势");
                    if (!targetEditKey || !targetEditKey.trim()) return;
                    const k = targetEditKey.trim();
                    const stg = favItem.stageIdx || 1;
                    await rawSaveDataUrlToDB(getProtagScopedImgKey(k, stg), realSrc).catch(() => {});
                    curVars.按钮详情 = curVars.按钮详情 || {};
                    const prev = curVars.按钮详情[k] || {};
                    curVars.按钮详情[k] = { ...prev, imgUrl: realSrc, forceLatestImg: realSrc, stageImgs: { ...(prev.stageImgs || {}), [stg]: realSrc } };
                    saveChatCache(curVars);
                    latestStatus = getFallbackData();
                    renderBody();
                    showToast(`📌 已将此收藏图成功应用到本局的【${k}】！`, "success", 2800);
                };
            });

            const clrAllBtn = box.querySelector("#st-cg-clear-all");
            if (clrAllBtn) {
                clrAllBtn.onclick = () => {
                    if (!confirm("确定要清空当前聊天的抓拍记录吗？（注：⭐永恒收藏夹里的图片不受影响）")) return;
                    curVars.专属相册 = [];
                    userSettings.cgGallery = [];
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

        function promptSwitchTargetCharacter() {
            const cur = detectProtagonistName(curVars);
            const inp = prompt("🎯 请输入【本局聊天】要监控的目标角色名字（填 char 代表当前角色卡，填 user 代表玩家主角，或直接输入新人物姓名；留空点确定则自动识别）：", curVars.档案?.手动锁定真名 || cur);
            if (inp === null) return;
            const trimmed = inp.trim();
            pushUndoSnapshot(curVars);
            curVars.档案 = curVars.档案 || {};
            userSettings.customTargetName = "";
            if (!trimmed) {
                curVars.档案.手动锁定真名 = "";
                curVars.档案.当前认知名字 = "";
            } else {
                const ctx = safeCtx();
                let finalName = trimmed;
                if (trimmed.toLowerCase() === "char" || trimmed === "角色卡") finalName = safeStr(ctx?.name2, "角色").trim();
                else if (trimmed.toLowerCase() === "user" || trimmed === "主角") finalName = safeStr(ctx?.name1, "主角").trim();
                curVars.档案.手动锁定真名 = finalName;
                curVars.档案.当前认知名字 = finalName;
            }
            saveSettings();
            saveChatCache(curVars);
            latestStatus = getFallbackData();
            renderBody();
            showToast(`🎯 本局监控目标已切换为：【${detectProtagonistName(curVars)}】`, "success");
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

                    <!-- 分区 1：外观与监控目标 -->
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
                        </div>
                    </div>

                    <!-- 分区 2：AI 外貌锁定与生图引擎 -->
                    <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(103,232,249,0.3);border-radius:11px;padding:10px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:4px;">
                            <span style="font-weight:bold;color:#67e8f9;font-size:12.5px;">🖼️ 二、AI 外貌锁定与自动生图设置</span>
                            <span style="font-size:10.5px;color:#a6e3a1;">📊 本地图库缓存: ${importedImgCache.size}张 (约 ${dbSizeMB} MB)</span>
                        </div>
                        <div style="display:flex;gap:6px;margin-bottom:8px;">
                            <input id="st-cfg-dna-inp" value="${safeStr(userSettings.lockedAppearanceTags).replace(/"/g, "&quot;")}" placeholder="输入中文外貌描述或英文Tag（留空点右侧按钮将由AI自动提炼）" style="flex:1;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 8px;color:#fff;font-size:11.5px;">
                            <button type="button" id="st-cfg-dna-btn" style="background:linear-gradient(135deg,#ec4899,#8b5cf6);color:#fff;border:none;border-radius:6px;padding:5px 10px;font-size:11.5px;font-weight:bold;cursor:pointer;white-space:nowrap;">👩 AI锁外貌</button>
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

                    <!-- 分区 3：热插拔补丁管理中心 -->
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

                    <!-- 分区 4：副 API 一键重绘配置 -->
                    <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(192,132,252,0.3);border-radius:11px;padding:10px;">
                        <div style="font-weight:bold;color:#d8b4fe;margin-bottom:6px;font-size:12.5px;">🤖 四、独立副 API 重绘配置（可选）</div>
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

                    <!-- 分区 5：存档导入导出与重置 -->
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

            bodyEl.querySelector("#st-cfg-dna-btn").onclick = async () => {
                const val = bodyEl.querySelector("#st-cfg-dna-inp").value.trim();
                const tags = await aiLockAppearanceByChinese(val);
                bodyEl.querySelector("#st-cfg-dna-inp").value = tags;
            };
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
                showToast(`✅ 成功导入 ${n} 张本地图片至缓存库！`, "success");
                latestStatus = getFallbackData(); renderBody();
            };
            bodyEl.querySelector("#st-cfg-clear-protag-img").onclick = () => clearCurrentProtagImages();

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

            const urlInp = bodyEl.querySelector("#st-api-url"), keyInp = bodyEl.querySelector("#st-api-key"), modInp = bodyEl.querySelector("#st-api-mod"), modSel = bodyEl.querySelector("#st-api-model-sel");
            bodyEl.querySelector("#st-api-fetch-models").onclick = (e) => fetchModelList(e.target, modSel, urlInp);
            modSel.onchange = () => { modInp.value = modSel.value; };
            bodyEl.querySelector("#st-api-save-btn").onclick = () => {
                userSettings.apiUrl = urlInp.value.trim();
                userSettings.apiKey = keyInp.value.trim();
                userSettings.apiModel = modInp.value.trim();
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
                const raw = prompt("请粘贴导出的状态栏 JSON 数据：");
                if (!raw) return;
                const parsed = repairAndParseJson(raw);
                if (parsed) { pushUndoSnapshot(curVars); curVars = normalizeVarsStructure({ ...getInitialVars(), ...parsed }); saveChatCache(curVars); latestStatus = getFallbackData(); isSettingsOpen = false; renderBody(); showToast("✅ 状态存档导入成功！", "success"); }
            };
            bodyEl.querySelector("#st-cfg-reset-vars").onclick = () => {
                if (!confirm(`确定要将【${u}】的所有状态数值重置为 100% 清白初始状态吗？`)) return;
                pushUndoSnapshot(curVars);
                curVars = getInitialVars();
                saveChatCache(curVars); latestStatus = getFallbackData(); isSettingsOpen = false; renderBody();
                showToast("🌸 已重置为初始清白状态！", "success");
            };
            bodyEl.querySelector("#st-cfg-exit-plugin").onclick = () => {
                setPluginEnabledState(false);
            };
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

            // 👗 模块9：全身穿搭分类顶部专属的一键换装衣柜胶囊栏
            const wardrobeBarHtml = (activeCat === "全身穿搭") ? `
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;padding:6px 8px;background:rgba(244,114,182,0.12);border:1px dashed rgba(244,114,182,0.45);border-radius:10px;align-items:center;">
                    <span style="font-size:10.5px;color:#fde047;font-weight:bold;">👗 一键换装:</span>
                    ${WARDROBE_PRESETS.map((wp, idx) => `<button type="button" class="st-wardrobe-preset-btn st-pill-btn" data-widx="${idx}" style="padding:2px 8px;font-size:10.5px;">${wp.name}</button>`).join("")}
                </div>
            ` : "";

            bodyEl.innerHTML = `
                <!-- 实时互动语音心声条 -->
                <div id="st-asmr-voice-bar" title="点击朗读语音心声" style="cursor:pointer;margin-bottom:7px;background:linear-gradient(90deg,rgba(244,114,182,0.18),rgba(192,132,252,0.12));border:1px solid rgba(244,114,182,0.4);border-radius:10px;padding:6px 10px;display:flex;align-items:center;gap:8px;font-size:11.5px;color:#ffe4e6;">
                    <span style="font-size:15px;">🎧</span>
                    <div style="flex:1;line-height:1.45;font-style:italic;">${asmrQuote}</div>
                    ${userSettings.personaMode === "contrast" ? `<button id="st-toggle-contrast-btn" type="button" style="background:#ec4899;color:#fff;border:none;border-radius:6px;padding:2px 7px;font-size:10px;cursor:pointer;">切换表/里</button>` : ""}
                </div>

                <!-- 二级：可按住/点击查看百科详情的双层微章栏 -->
                <div style="background:rgba(12,6,22,0.55);border:1px solid rgba(255,255,255,0.1);border-radius:11px;padding:6px 9px;margin-bottom:8px;display:flex;flex-direction:column;gap:5px;">
                    <div class="st-buff-strip" style="display:flex;flex-wrap:wrap;gap:5px;align-items:center;">
                        <span style="font-size:10px;color:#94a3b8;margin-right:2px;">🔍长按/点标签看详情:</span>
                        ${buffs.map((b, idx) => `<span class="st-buff-pill" data-bidx="${idx}" style="background:${b.bg};border:1px solid ${b.border};color:${b.color};padding:2px 8px;border-radius:99px;font-size:10.5px;font-weight:bold;">${b.icon} ${b.name}</span>`).join("")}
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:5px;align-items:center;padding-top:4px;border-top:1px dashed rgba(255,255,255,0.08);">
                        <span class="st-era-pill" data-k="pain" style="background:rgba(225,29,72,0.22);border:1px solid #fb7185;color:#fecdd3;padding:1.5px 7px;border-radius:99px;font-size:10px;">💮苦痛Lv.${painLv}</span>
                        <span class="st-era-pill" data-k="pleas" style="background:rgba(236,72,153,0.25);border:1px solid #f472b6;color:#fbcfe8;padding:1.5px 7px;border-radius:99px;font-size:10px;">💗快乐Lv.${pleasLv}</span>
                        <span class="st-era-pill" data-k="shame" style="background:rgba(168,85,247,0.25);border:1px solid #c084fc;color:#e9d5ff;padding:1.5px 7px;border-radius:99px;font-size:10px;">😳屈辱Lv.${shameLv}</span>
                        <span class="st-era-pill" data-k="obey" style="background:rgba(234,179,8,0.22);border:1px solid #facc15;color:#fef08a;padding:1.5px 7px;border-radius:99px;font-size:10px;">🙇顺从Lv.${obeyLv}</span>
                        <span class="st-era-pill" data-k="lewd" style="background:rgba(147,51,234,0.28);border:1px solid #e879f9;color:#f5d0fe;padding:1.5px 7px;border-radius:99px;font-size:10px;">🖤淫乱Lv.${lewdLv}</span>
                        <span class="st-era-pill" data-k="expose" style="background:rgba(239,68,68,0.25);border:1px solid #f87171;color:#fca5a5;padding:1.5px 7px;border-radius:99px;font-size:10px;margin-left:auto;font-weight:bold;">👀暴露${exposeRisk}%</span>
                    </div>
                </div>

                <!-- 分类标题栏 + 外置【🤖 API重绘】+【📜 鉴定海报】+ 折叠导演台 -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;gap:6px;flex-wrap:wrap;">
                    <div style="font-size:13px;font-weight:bold;color:#fde047;">${curCatObj?.icon || "✨"} ${curCatObj?.title || ""} <span style="font-size:11px;color:${tc.sub};font-weight:normal;">(${curCatObj?.summary || ""})</span></div>
                    <div style="display:flex;gap:4px;flex-wrap:wrap;">
                        <button type="button" id="st-main-poster-btn" class="st-pill-btn" style="padding:2px 8px;font-size:10.5px;color:#fbcfe8;">📜 鉴定书</button>
                        <button type="button" id="st-main-api-redraw" class="st-pill-btn" style="padding:2px 8px;font-size:10.5px;background:rgba(103,232,249,0.18);border-color:#67e8f9;color:#67e8f9;">🤖 API重绘</button>
                        <button type="button" id="st-toggle-director" class="st-pill-btn" style="padding:2px 8px;font-size:10.5px;color:#fde047;">🎮 导演台 ${isDirectorOpen ? "▲" : "▼"}</button>
                        <button type="button" id="st-add-custom-btn" class="st-pill-btn" style="padding:2px 8px;font-size:10.5px;">➕ 新增</button>
                    </div>
                </div>

                <div id="st-director-drawer" style="display:${isDirectorOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:5px;background:rgba(0,0,0,0.42);border:1px dashed rgba(251,191,36,0.45);border-radius:10px;padding:7px 9px;margin-bottom:8px;">
                    <button type="button" class="st-dir-act st-pill-btn" data-act="creampie">💦 灌满宫腔(+25ml)</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="orgasm">⚡ 强制绝顶潮吹</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="tear">👗 撕裂衣装(-30%)</button>
                    <button type="button" class="st-dir-act st-pill-btn" data-act="clean">🛁 温水清洗排精</button>
                </div>

                ${wardrobeBarHtml}
                ${showXrayHere ? buildEnhancedTopXRayCenter(curVars, dev, caps) : ""}

                <!-- 三级：高呼吸感状态卡片列表 -->
                <div id="st-cards-container" style="display:flex;flex-direction:column;gap:8px;"></div>
            `;

            const voiceBar = bodyEl.querySelector("#st-asmr-voice-bar");
            if (voiceBar) {
                voiceBar.onclick = (e) => {
                    if (e.target.id === "st-toggle-contrast-btn") {
                        userSettings.contrastInnerActive = !userSettings.contrastInnerActive;
                        saveSettings(); renderBody(); return;
                    }
                    try {
                        if (window.speechSynthesis) {
                            window.speechSynthesis.cancel();
                            const utter = new SpeechSynthesisUtterance(asmrQuote.replace(/[【】“”"♡💦🥵❤️💧]/g, ""));
                            utter.lang = "zh-CN"; utter.pitch = 1.25; utter.rate = 0.95;
                            window.speechSynthesis.speak(utter);
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

            // 🔬 模块3：X-Ray 切换把玩模式 & 手指按压器官挤精/喷水交互
            const xrayModeBtn = bodyEl.querySelector("#st-xray-mode-toggle");
            if (xrayModeBtn) {
                xrayModeBtn.onclick = () => {
                    xrayPlayMode = !xrayPlayMode;
                    renderBody();
                    showToast(xrayPlayMode ? "👆 已开启【X-Ray触控把玩模式】！现在点击器官将直接按压揉捏挤出白浊/触发潮吹！" : "🔍 已切回【X-Ray详情查看模式】", "info", 2600);
                };
            }

            bodyEl.querySelectorAll(".st-xray-hotspot").forEach(hs => {
                hs.onclick = () => {
                    const targetKey = hs.getAttribute("data-key");
                    if (xrayPlayMode) {
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
                                showToast(`👆 用力按压了【${u}】鼓胀的子宫，一股 ${squeezed}ml 浓稠白浊咕啾一声顺着宫颈口被挤入小穴！`, "warn", 2800);
                            } else {
                                curVars.精神与心理.快感累积 = Math.min(100, safeNum(curVars.精神与心理.快感累积) + 18);
                                showToast(`👆 隔着小腹揉按了【${u}】敏感的宫腔与卵巢，酸麻电流直冲脑髓，快感+18%！`, "info", 2400);
                            }
                        } else if (targetKey === "小穴实况") {
                            if (safeNum(curVars.体内精液存量.小穴毫升) > 0) {
                                const drip = Math.min(curVars.体内精液存量.小穴毫升, 12);
                                curVars.体内精液存量.小穴毫升 -= drip;
                                showToast(`👆 掰开抽插了【${u}】泥泞的蜜穴，${drip}ml 混杂着淫水的白浊顺着腿根哗啦淌落！`, "warn", 2600);
                            } else {
                                curVars.核心数值.性欲程度 = Math.min(100, safeNum(curVars.核心数值.性欲程度) + 15);
                                showToast(`👆 玩弄了【${u}】充血的花唇，淫水咕啾泛滥，性欲+15%！`, "info", 2400);
                            }
                        } else if (targetKey === "阴蒂尿道") {
                            curVars.计数.高潮.总数 = safeNum(curVars.计数.高潮.总数) + 1;
                            curVars.计数.失控.喷潮 = safeNum(curVars.计数.失控.喷潮) + 1;
                            curVars.计数.失控.失禁 = safeNum(curVars.计数.失控.失禁) + 1;
                            curVars.精神与心理.快感累积 = 100;
                            showToast(`⛲ 弹击揉搓了【${u}】肿大的阴蒂与尿道口，当场引发痉挛潮吹与失禁漏尿！`, "error", 2800);
                        } else if (targetKey === "胸部实况") {
                            curVars.计数.泌乳.喷乳次数 = safeNum(curVars.计数.泌乳.喷乳次数) + 1;
                            curVars.计数.泌乳.累计毫升 = safeNum(curVars.计数.泌乳.累计毫升) + 25;
                            showToast(`🍼 用力抓揉了【${u}】饱满的双峰，乳尖飙射出 25ml 温热乳汁！`, "info", 2600);
                        } else {
                            curVars.精神与心理.快感累积 = Math.min(100, safeNum(curVars.精神与心理.快感累积) + 15);
                            showToast(`👆 深入玩弄了【${u}】的【${targetKey}】，身体剧烈战栗迎合！`, "info", 2400);
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

            // 👗 模块9：绑定一键换装衣柜按钮
            bodyEl.querySelectorAll(".st-wardrobe-preset-btn").forEach(btn => {
                btn.onclick = () => {
                    const wp = WARDROBE_PRESETS[parseInt(btn.getAttribute("data-widx"), 10)];
                    if (!wp) return;
                    pushUndoSnapshot(curVars);
                    curVars.穿搭 = { ...curVars.穿搭, ...wp.wear };
                    userSettings.clothDurability = wp.durability;
                    if (curVars.按钮详情) {
                        Object.keys(curVars.按钮详情).forEach(k => {
                            if (k.startsWith("穿搭_")) delete curVars.按钮详情[k].stage;
                        });
                    }
                    saveSettings();
                    saveChatCache(curVars);
                    latestStatus = getFallbackData();
                    renderBody();
                    showToast(`👗 已为【${u}】一键换装为：【${wp.name}】（衣装完好度 ${wp.durability}%）！`, "success", 2800);
                };
            });

            bodyEl.querySelector("#st-main-poster-btn").onclick = () => generateAndDownloadPoster(curVars, dev, u);
            bodyEl.querySelector("#st-main-api-redraw").onclick = (e) => triggerSubApiUpdate(e.target);
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
                    const act = btn.getAttribute("data-act");
                    pushUndoSnapshot(curVars);
                    normalizeVarsStructure(curVars);
                    if (act === "creampie") {
                        curVars.体内精液存量.子宫毫升 = safeNum(curVars.体内精液存量.子宫毫升) + 25;
                        curVars.计数.射精.内射 = safeNum(curVars.计数.射精.内射) + 1;
                        curVars.断精回合数 = 0;
                        showToast("💦 已向宫腔注入 25ml 滚烫浓精！", "info");
                    } else if (act === "orgasm") {
                        curVars.精神与心理.快感累积 = 100;
                        curVars.计数.高潮.总数 = safeNum(curVars.计数.高潮.总数) + 1;
                        curVars.计数.失控.喷潮 = safeNum(curVars.计数.失控.喷潮) + 1;
                        curVars.身体.体力 = Math.max(0, safeNum(curVars.身体.体力, 100) - 20);
                        showToast("⚡ 已触发强制绝顶潮吹！", "warn");
                    } else if (act === "tear") {
                        userSettings.clothDurability = Math.max(0, safeNum(userSettings.clothDurability, 100) - 30);
                        saveSettings();
                        showToast(`👗 衣装撕裂受损！当前完好度：${userSettings.clothDurability}%`, "warn");
                    } else if (act === "clean") {
                        curVars.体内精液存量 = { 口内毫升: 0, 小穴毫升: 0, 子宫毫升: 0, 屁眼毫升: 0 };
                        curVars.本轮失控事件 = "";
                        userSettings.clothDurability = 100; saveSettings();
                        showToast("🛁 已温水清洗全身并整理好衣装！", "success");
                    }
                    saveChatCache(curVars); latestStatus = getFallbackData(); renderBody();
                };
            });

            const cardsWrap = bodyEl.querySelector("#st-cards-container");
            (curCatObj?.items || []).forEach(item => {
                const card = document.createElement("div");
                const isRev = (item.editKey === "shame" || item.editKey === "sta" || item.editKey === "当前姿势");
                const t = item.hasStageBar ? tier6(item.pct || 0, isRev) : 0;
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
                card.onclick = () => { playSynthSound("squelch"); showDetailPopup(item); };
                cardsWrap.appendChild(card);
            });
        }

        function scrubRawBlocksFromChatDOM() {
            if (!userSettings.enabled || !userSettings.hideRawBlock) return;
            const mesBlocks = document.querySelectorAll("#chat .mes_text");
            mesBlocks.forEach(el => {
                const rawHtml = el.innerHTML;
                if (!rawHtml) return;
                if (rawHtml.includes("UpdateVariable") || rawHtml.includes("状态快照】") || rawHtml.includes("_.set(") || rawHtml.includes("_.add(") || (!isGeneratingImageBusy && (rawHtml.includes("&lt;image&gt;") || rawHtml.includes("<image>") || rawHtml.includes("image###")))) {
                    let cleaned = rawHtml
                        .replace(/【状态快照】[^\n<]*(?:<br\s*\/?>|\n)?/gi, "")
                        .replace(/\[系统后台只读状态参考[^\]]*\](?:<br\s*\/?>|\n)?/gi, "")
                        .replace(/&lt;UpdateVariable&gt;[\s\S]*?&lt;\/UpdateVariable&gt;/gi, "")
                        .replace(/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, "")
                        .replace(/(?:<p>|<br\s*\/?>|\n|\s)*_\.(?:set|add)\s*\(\s*(?:['"`]|&quot;|&#39;)[\s\S]*?\)\s*;?(?:<\/p>|<br\s*\/?>|\n)?/gi, "");
                    if (!isGeneratingImageBusy) {
                        cleaned = cleaned
                            .replace(/第[一二三四五六1-6]阶段：[^\n<]*(?:<br\s*\/?>|\n)*\s*(?:&lt;image&gt;|<image>)[\s\S]*?(?:&lt;\/image&gt;|<\/image>)/gi, "")
                            .replace(/(?:&lt;image&gt;|<image>)[\s\S]*?(?:&lt;\/image&gt;|<\/image>)/gi, "")
                            .replace(/image###[\s\S]*?###/gi, "");
                    }
                    if (cleaned !== rawHtml) el.innerHTML = cleaned;
                }
            });
        }

        function syncFromLatestChat(forceFloor = null) {
            if (!userSettings.enabled) return;
            normalizeVarsStructure(curVars);
            scrubRawBlocksFromChatDOM();
            const ctx = safeCtx(), chat = ctx?.chat || [];
            if (!chat.length) { curVars = getInitialVars(); latestStatus = getFallbackData(); renderBody(); return; }
            viewingHistoryFloor = forceFloor;
            if (forceFloor === null) {
                const cached = loadChatCache();
                if (cached) mergeUserCustomizations(curVars, cached, chat.length);
            }
            const targetIdx = forceFloor !== null ? Math.min(chat.length - 1, Math.max(0, forceFloor)) : (chat.length - 1);
            const mesText = safeStr(chat[targetIdx]?.mes);
            if (mesText) {
                const uvMatches = [...mesText.matchAll(/<UpdateVariable>([\s\S]*?)<\/UpdateVariable>/gi)];
                let hasSet = false;
                uvMatches.forEach(m => { if (parseSetCommands(m[1], curVars)) hasSet = true; });
                if (!hasSet) parseSetCommands(mesText, curVars);
                extractFromLegacyText(mesText, curVars);

                if (forceFloor === null && /【状态快照】|\[系统后台只读状态参考/.test(chat[targetIdx].mes)) {
                    chat[targetIdx].mes = chat[targetIdx].mes
                        .replace(/【状态快照】[^\n\r]*\r?\n?/g, "")
                        .replace(/\[系统后台只读状态参考[^\]]*\]\r?\n?/g, "")
                        .trim();
                }
            }
            normalizeVarsStructure(curVars);
            calibrateMentalMetrics(curVars);
            if (forceFloor === null) saveChatCache(curVars, chat.length);
            computeAndShowDeltaToast(curVars);
            latestStatus = getFallbackData();
            renderBody();
            setTimeout(scrubRawBlocksFromChatDOM, 150);
            const u = detectProtagonistName(curVars);
            if (userSettings.autoGenEveryChange && forceFloor === null) {
                const firstItem = latestStatus.categories?.[3]?.items?.[2] || latestStatus.categories?.[0]?.items?.[5];
                if (firstItem) silentBackgroundGenerateImage(firstItem, 1, u, null);
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
                    <div id="st-v5-header" style="padding:8px 12px;display:flex;justify-content:space-between;align-items:center;gap:6px;cursor:move;user-select:none;touch-action:none;border-bottom:1px solid rgba(255,255,255,0.14);">
                        <div id="st-v5-title" style="font-weight:bold;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">✨ 状态栏 1.0</div>
                        <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
                            <button id="st-hdr-undo" type="button" title="撤回上一步状态修改" style="background:rgba(255,255,255,0.12);color:#a6e3a1;border:none;border-radius:6px;padding:3px 7px;font-size:11px;cursor:pointer;">↩️撤回</button>
                            <button id="st-hdr-prev" type="button" title="回溯上一层" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:6px;padding:3px 7px;font-size:11px;cursor:pointer;">◀</button>
                            <button id="st-hdr-now" type="button" title="回到实时最新层" style="background:rgba(255,255,255,0.12);color:#fde047;border:none;border-radius:6px;padding:3px 7px;font-size:11px;font-weight:bold;cursor:pointer;">实时</button>
                            <button id="st-hdr-cg" type="button" title="打开相册与永恒收藏夹" style="background:rgba(255,255,255,0.12);color:#fbcfe8;border:none;border-radius:6px;padding:3px 7px;font-size:11px;cursor:pointer;">⭐收藏/相册</button>
                            <button id="st-hdr-cfg" type="button" title="打开设置与补丁中心" style="background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">⚙️设置</button>
                            <button id="st-hdr-close" type="button" title="最小化收起" style="background:rgba(225,29,72,0.35);color:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:bold;cursor:pointer;">✕</button>
                        </div>
                    </div>
                    <div style="display:flex;flex:1;min-height:0;overflow:hidden;">
                        <div id="st-v5-tabs" style="width:58px;padding:8px 5px;display:flex;flex-direction:column;gap:5px;overflow-y:auto;border-right:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.25);flex-shrink:0;"></div>
                        <div id="st-v5-body" style="flex:1;padding:10px;overflow-y:auto;"></div>
                    </div>
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

            // 📱 模块11：手机端在主界面卡片区左右滑动即可丝滑切换分类
            let swipeStartX = 0, swipeStartY = 0;
            bodyArea.addEventListener("touchstart", (e) => {
                if (e.touches[0]) { swipeStartX = e.touches[0].clientX; swipeStartY = e.touches[0].clientY; }
            }, { passive: true });
            bodyArea.addEventListener("touchend", (e) => {
                if (isSettingsOpen || !e.changedTouches[0]) return;
                const dx = e.changedTouches[0].clientX - swipeStartX;
                const dy = e.changedTouches[0].clientY - swipeStartY;
                if (Math.abs(dx) > 68 && Math.abs(dx) > Math.abs(dy) * 2.2) {
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
                if (isPanelOpen) syncFromLatestChat(viewingHistoryFloor);
            };
            document.getElementById("st-hdr-undo").onclick = () => performUndoAction();
            document.getElementById("st-hdr-close").onclick = () => { isPanelOpen = false; panel.style.display = "none"; };
            document.getElementById("st-hdr-cfg").onclick = () => { isSettingsOpen = !isSettingsOpen; renderBody(); };
            document.getElementById("st-hdr-cg").onclick = () => openCgGalleryModal("fav");
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
                    if (k.includes("isolated") || k.includes("cache") || k.startsWith("global_pin_") || k.startsWith("fav_img_")) continue;
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
        loadAllImportedImagesToMemory().then(() => {
            autoPurgePollutedDBKeys();
            ensureUI();
            mountExtensionMenuSwitch();
            executeStoredPatches();
            if (userSettings.enabled) syncFromLatestChat(null);
        });

        let activeIsolatedKey = getChatStoreKey();
        if (window.__stZhjTimer) clearInterval(window.__stZhjTimer);
        window.__stZhjTimer = setInterval(() => {
            if (!userSettings.enabled) return;
            const nowKey = getChatStoreKey();
            if (nowKey !== activeIsolatedKey) {
                activeIsolatedKey = nowKey;
                curVars = getInitialVars();
                undoHistoryStack.length = 0;
                userSettings.customTargetName = "";
                viewingHistoryFloor = null;
                prevSnapshotForDelta = null;
                prevRecordedTiersForAutoGen = {};
                const cached = loadChatCache();
                if (cached) mergeUserCustomizations(curVars, cached, safeCtx()?.chat?.length || 0);
                curVars.专属相册 = Array.isArray(curVars.专属相册) ? curVars.专属相册 : [];
                userSettings.cgGallery = curVars.专属相册;
                const curHeroine = detectProtagonistName(curVars);
                userSettings.lockedAppearanceTags = curVars.档案?.锁定外貌DNA || getLockedAppearanceTags(curHeroine, curVars);
                syncFromLatestChat(null);
            }
            scrubRawBlocksFromChatDOM();
            scanChatImagesForZhiHuiJi();
        }, 900);

        const attachTavernEvents = () => {
            const ctx = safeCtx();
            if (!ctx?.eventSource || !ctx?.event_types) { setTimeout(attachTavernEvents, 1200); return; }
            if (window.__stEventsAttached) return;
            window.__stEventsAttached = true;

            if (ctx.event_types.CHAT_CHANGED) {
                ctx.eventSource.on(ctx.event_types.CHAT_CHANGED, () => {
                    curVars = getInitialVars();
                    undoHistoryStack.length = 0;
                    viewingHistoryFloor = null;
                    prevSnapshotForDelta = null;
                    if (!userSettings.enabled) return;
                    setTimeout(() => syncFromLatestChat(null), 280);
                });
            }
            const evs = [ctx.event_types.CHARACTER_MESSAGE_RENDERED, ctx.event_types.MESSAGE_RECEIVED].filter(Boolean);
            evs.forEach(ev => {
                ctx.eventSource.on(ev, () => {
                    if (!userSettings.enabled) return;
                    setTimeout(() => syncFromLatestChat(null), 350);
                });
            });
            if (ctx.event_types.CHAT_COMPLETION_PROMPT_READY) {
                ctx.eventSource.on(ctx.event_types.CHAT_COMPLETION_PROMPT_READY, (evData) => {
                    if (!userSettings.enabled) return;
                    const u = detectProtagonistName(curVars);
                    const inj = buildPromptInjection(u, curVars);
                    if (evData && Array.isArray(evData.chat)) {
                        evData.chat.push({ role: "system", content: inj });
                    }
                });
            }
        };
        attachTavernEvents();

        window.ST_V10_COMPLETE_FLAG = true;
        window.ST_V20_COMPLETE_FLAG = true;
        console.log("✅ [状态栏 1.0 · 大一统终极完全体] 加载成功！");
    } catch (err) {
        showDiagnosticError("初始化崩溃", err, "请检查三段代码是否已完整首尾拼接！");
    }
})();
