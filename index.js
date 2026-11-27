let _poolFilterSpecies = "ALL";
        function openReusablePoolManagerModal(filterPart = "ALL", filterSpecies = _poolFilterSpecies) {
            _poolFilterSpecies = filterSpecies;
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

            // 统计图池中存在的物种分类（人类、女鬼、魅魔、美女蛇等）
            const getItemPrimarySp = (x) => getPrimarySpeciesCategoryId(x?.fullDna || x?.dna || x?.skinDna || "", x?.speciesSig || "");
            const speciesCounts = {};
            pool.forEach(x => {
                if (!x) return;
                const spId = getItemPrimarySp(x);
                speciesCounts[spId] = (speciesCounts[spId] || 0) + 1;
            });

            const shownList = pool.filter(x => {
                if (!x) return false;
                if (filterPart !== "ALL" && x.editKey !== filterPart) return false;
                if (filterSpecies !== "ALL" && getItemPrimarySp(x) !== filterSpecies) return false;
                return true;
            });

            const cardsHtml = shownList.length ? shownList.map((item) => {
                const realIdx = pool.indexOf(item);
                const imgSrc = item.diskPath || queryImportedImage(item.dbKey) || item.dbKey;
                const spId = getItemPrimarySp(item);
                const spLabel = SPECIES_ID_TO_CN_BADGE[spId] || "👩普通人类";
                const fullTraitCn = summarizeDnaTagsToChinese(item.fullDna || item.dna || item.skinDna || "", "", item.speciesSig || "");
                const spColor = spId === "human" ? "#38bdf8" : (spId === "undead_ghost" ? "#c084fc" : (spId === "succubus_demon" ? "#f472b6" : "#fde047"));

                return `
                    <div style="background:rgba(20,10,35,0.95);border:1.5px solid ${item.isUniversalOrgan ? '#10b981' : spColor};border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:4px;position:relative;">
                        <span style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.85);color:${spColor};padding:1px 6px;border-radius:99px;font-size:9.5px;font-weight:bold;border:1px solid ${spColor};">
                            ${spLabel} · Lv.${item.stageNum}阶
                        </span>
                        <button type="button" class="st-pm-del" data-idx="${realIdx}" title="从图池彻底删除" style="position:absolute;top:8px;right:8px;background:#e11d48;color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:11px;font-weight:bold;cursor:pointer;">✕</button>
                        <div style="width:100%;height:96px;background:#07030d;border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                            <img src="${imgSrc}" class="st-pm-zoom" style="max-width:100%;max-height:94px;object-fit:contain;cursor:zoom-in;">
                        </div>
                        <div style="font-size:11px;font-weight:bold;color:#fde047;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">📌 ${item.editKey} (第${item.stageNum}阶 · ${item.charName || "通用"})</div>
                        <div style="font-size:9.5px;color:#a6e3a1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${fullTraitCn}">🧬 ${fullTraitCn}</div>
                        <div style="font-size:9px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.wearSig || ''}">👗 ${item.isUniversalOrgan ? "🌸局部器官(同肤质/同数量通用)" : (item.wearSig || "不限穿搭")}</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px;">
                            <button type="button" class="st-pm-edit" data-idx="${realIdx}" style="background:rgba(139,92,246,0.3);color:#ddd6fe;border:1px solid #8b5cf6;border-radius:5px;padding:3px;font-size:10px;font-weight:bold;cursor:pointer;">✏️ 改特征/阶位</button>
                            <button type="button" class="st-pm-toggle-uni" data-idx="${realIdx}" style="background:rgba(16,185,129,0.25);color:#a7f3d0;border:1px solid #10b981;border-radius:5px;padding:3px;font-size:10px;cursor:pointer;">${item.isUniversalOrgan ? "切为外貌锁" : "切为局部通用"}</button>
                        </div>
                    </div>
                `;
            }).join("") : `<div style="grid-column:1/-1;text-align:center;padding:32px 12px;color:#94a3b8;font-size:12px;">🗂️ 当前筛选条件下暂无图片！可切换上方【物种分类】或【部位】查看。</div>`;

            modal.innerHTML = `
                <div style="background:linear-gradient(160deg,#1e1030,#090410);border:2px solid #67e8f9;border-radius:16px;padding:14px;width:94vw;max-width:540px;max-height:88vh;display:flex;flex-direction:column;color:#fff;box-shadow:0 20px 60px #000;">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:8px;margin-bottom:8px;">
                        <div>
                            <div style="font-size:14px;font-weight:bold;color:#67e8f9;">🗂️ 永久动态复用图池管理中心 (共 ${pool.length} 张 · 当前显示 ${shownList.length} 张)</div>
                            <div style="font-size:10.5px;color:#cbd5e1;">支持按【👩普通人类 / 👻鬼怪·女鬼 / 😈魅魔】等物种分类管理与一键还原旧图特征</div>
                        </div>
                        <button id="st-pm-close" type="button" style="background:#ff003c;color:#fff;border:none;border-radius:8px;padding:4px 10px;font-weight:bold;cursor:pointer;">✕</button>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
                        <select id="st-pm-filter-species" style="background:#111;color:#a6e3a1;border:1px solid #10b981;border-radius:6px;padding:4px 8px;font-size:11.5px;font-weight:bold;">
                            <option value="ALL">🧬 物种分类：全部物种 (${pool.length}张)</option>
                            ${Object.entries(SPECIES_ID_TO_CN_BADGE).map(([spId, badge]) => {
                                const cnt = speciesCounts[spId] || 0;
                                if (cnt === 0 && spId !== "human" && spId !== "undead_ghost" && spId !== "succubus_demon") return "";
                                return `<option value="${spId}" ${filterSpecies === spId ? "selected" : ""}>${badge} (${cnt}张)</option>`;
                            }).join("")}
                        </select>
                        <select id="st-pm-filter" style="background:#111;color:#fde047;border:1px solid #67e8f9;border-radius:6px;padding:4px 8px;font-size:11.5px;">
                            <option value="ALL">📌 部位筛选：全部部位 (${pool.length}张)</option>
                            ${partKeys.map(k => `<option value="${k}" ${filterPart === k ? "selected" : ""}>📌 ${k} (${pool.filter(x => x.editKey === k).length}张)</option>`).join("")}
                        </select>
                    </div>
                    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">
                        <button type="button" id="st-pm-undo-4eyes" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:6px;padding:5px 9px;font-size:11px;font-weight:bold;cursor:pointer;">🚑 抢救还原被误绑4眼/4奶的旧图特征</button>
                        <button type="button" id="st-pm-batch-set-species" style="background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;border:none;border-radius:6px;padding:5px 9px;font-size:11px;font-weight:bold;cursor:pointer;">🏷️ 批量设置物种(人类/女鬼/魅魔)</button>
                        <button type="button" id="st-pm-rescue-traits" style="background:linear-gradient(135deg,#ec4899,#8b5cf6);color:#fff;border:none;border-radius:6px;padding:5px 9px;font-size:11px;font-weight:bold;cursor:pointer;">🔧 仅将本局新图归位为当前主角</button>
                        <button type="button" id="st-pm-dedup-clean" style="background:linear-gradient(135deg,#fde047,#f59e0b);color:#111;border:none;border-radius:6px;padding:5px 9px;font-size:11px;font-weight:bold;cursor:pointer;">🧹 去重</button>
                        ${pool.length ? `<button type="button" id="st-pm-clear-all" style="background:rgba(225,29,72,0.25);color:#fda4af;border:1px solid #e11d48;border-radius:6px;padding:5px 8px;font-size:11px;cursor:pointer;">🗑️ 清空筛选(${shownList.length})</button>` : ""}
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(142px,1fr));gap:8px;overflow-y:auto;max-height:60vh;padding-right:2px;">${cardsHtml}</div>
                </div>
            `;
            modal.style.display = "flex";

            modal.querySelector("#st-pm-close").onclick = () => { modal.style.display = "none"; renderBody(); };
            modal.querySelector("#st-pm-filter").onchange = (e) => openReusablePoolManagerModal(e.target.value, _poolFilterSpecies);
            modal.querySelector("#st-pm-filter-species").onchange = (e) => openReusablePoolManagerModal(filterPart, e.target.value);

            // 🚑 按钮 1：一键把刚才被误刷成 4只眼/4个奶/双穴 的所有历史老图片还原回原本的特征！
            modal.querySelector("#st-pm-undo-4eyes").onclick = () => {
                const cnt = restoreCorruptedPoolImagesFromHistory();
                openReusablePoolManagerModal(filterPart, _poolFilterSpecies);
                showToast(`🚑 抢救完成！已将 ${cnt} 张被误绑4眼/4乳的旧图片还原回原本的角色与【👩普通人类/女鬼/魅魔】特征！`, "success", 4200);
            };

            // 🏷️ 按钮 2：批量把当前筛选出的图片设为指定物种（如：👩普通人类 / 👻女鬼 / 😈魅魔），并自动清除误绑的多眼多乳词！
            modal.querySelector("#st-pm-batch-set-species").onclick = () => {
                const choice = prompt(
                    `🏷️ 请选择要将当前筛选的 ${shownList.length} 张图片批量设为哪个物种分类（输入序号 1~7）：\n` +
                    `1 = 👩 普通人类（同时清除误绑的4眼/4奶/双穴/女鬼标签）\n` +
                    `2 = 👻 鬼怪/女鬼（普通双目女鬼，清除4眼/4奶/双穴）\n` +
                    `3 = 👻 鬼怪/女鬼 + 👁️4只眼 + 🍒4个奶 + 🌺2个小穴（当前蛛音形态）\n` +
                    `4 = 😈 魅魔(角/尾)\n` +
                    `5 = 🐍 美女蛇(蛇尾)\n` +
                    `6 = 🫧 史莱姆/流体\n` +
                    `7 = 🐙 触手异形形态`,
                    "1"
                );
                if (!choice) return;
                const cNum = choice.trim();
                const spTagMap = {
                    "1": { spSig: "human", extra: "" },
                    "2": { spSig: "undead_ghost", extra: "ghost girl, supernatural apparition, pale cold skin" },
                    "3": { spSig: "undead_ghost", extra: "ghost girl, supernatural apparition, pale cold skin, (four eyes, two pairs of eyes on face:1.5), (four breasts:1.1), (double pussy:1.35)" },
                    "4": { spSig: "succubus_demon", extra: "succubus, demon horns, heart-shaped succubus tail" },
                    "5": { spSig: "lamia_snaketail", extra: "lamia, snake girl, long coiled snake tail instead of legs, glistening snake scales" },
                    "6": { spSig: "slime_fluid", extra: "slime girl, translucent gelatinous body, dripping slime skin" },
                    "7": { spSig: "tentacle_morph", extra: "monster girl, cecaelia, writhing tentacles instead of legs, suction cups" }
                };
                const cfg = spTagMap[cNum];
                if (!cfg) { showToast("⚠️ 无效的序号！请输入 1~7", "warn"); return; }

                shownList.forEach(p => {
                    let base = safeStr(p.fullDna || p.dna || "black hair, long hair, pale white skin")
                        .replace(/,?\s*(?:\(?\d*(?:\.\d+)?::)?(?:four eyes|two pairs of eyes on face|extra eyes on face|three eyes|four breasts|two pairs of breasts|4 breasts|six breasts|double pussy|two vaginas|multiple pussies[^,]*|ghost girl|supernatural apparition|pale cold skin|eerie dark mist aura|succubus|demon horns|heart-shaped succubus tail|lamia|snake girl|long coiled snake tail[^,]*|slime girl|translucent gelatinous[^,]*|multiple glowing eerie eyes[^,]*|sticky pink spider web threads[^,]*)(?:::\d*(?:\.\d+)?\)?)?/gi, "")
                        .replace(/,\s*,+/g, ", ")
                        .replace(/^[\s,]+|[\s,]+$/g, "")
                        .trim();
                    if (!base) base = "black hair, long hair, pale white skin";
                    p.fullDna = (cfg.extra ? `${base}, ${cfg.extra}` : base).slice(0, 260);
                    p.dna = getHeadOnlyDnaTags(p.fullDna).slice(0, 80);
                    p.skinDna = getSkinOnlyDnaTags(p.fullDna).slice(0, 220);
                    p.speciesSig = getSpeciesSignatureFromDna(p.fullDna);
                });
                saveSettings();
                latestStatus = getFallbackData();
                openReusablePoolManagerModal(filterPart, _poolFilterSpecies);
                showToast(`✅ 已将当前筛选的 ${shownList.length} 张图片批量更新物种分类！`, "success", 3200);
            };

            // 🔧 按钮 3：安全版归位（只归位当前这局聊天真正生成的图，绝不误伤其他聊天的老图！）
            modal.querySelector("#st-pm-rescue-traits").onclick = () => {
                const curU = detectProtagonistName(curVars);
                const curDna = getLockedAppearanceTags(curU, curVars);
                const cnt = rescueAndRebindPoolImagesToCurrentProtag(curU, curDna, true);
                latestStatus = getFallbackData();
                openReusablePoolManagerModal(filterPart, _poolFilterSpecies);
                showToast(`🔧 已安全将属于本局聊天的 ${cnt} 张图片归位为【${summarizeDnaTagsToChinese(curDna)}】（其他历史聊天的旧图完好保留）！`, "success", 3800);
            };

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

                openReusablePoolManagerModal(filterPart, _poolFilterSpecies);
                showToast(`🧹 清理完成！已合并去除 ${removedDup} 张重复图，并从数据库清除 ${purgedDbCnt} 个无用幽灵缓存！`, "success", 3800);
            };
            modal.onclick = (e) => { if (e.target === modal) { modal.style.display = "none"; renderBody(); } };
