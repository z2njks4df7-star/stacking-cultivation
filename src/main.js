// ============================================================
// 堆叠修仙 v20.0 - 主游戏逻辑
// ============================================================

import { REALMS, CARD_DEFS, ALL_CARD_TYPES, EQUIP_SETS, ENHANCE_RATES, ENHANCE_COSTS, RECIPES, BOSS_LIST, SECT_LIST, TASKS, GACHA_COST_SINGLE, GACHA_COST_TEN, GACHA_RATES } from './data.js';

// ============================================================
// 游戏状态
// ============================================================

var GS = {
  cultivation: 0,
  realmIndex: 0,
  day: 1,
  spiritStones: 50,
  attack: 10,
  defense: 5,
  cards: {},           // { cardId: count }
  equipped: {},        // { slot: cardId }
  achievements: [],    // [achievementId, ...]
  tasks: {},           // { taskId: { claimed: bool, progress: number } }
  dailyTasks: {},
  bossesDefeated: {},
  sectId: null,
  sectContribution: 0,
  totalSectContribution: 0,
  ascensionCount: 0,
  totalAscensions: 0,
  ascensionBonus: { attack: 0, defense: 0, cultivation: 1.0 },
  // 统计
  stats: { clicks: 0, bossesDefeated: 0, cardsGachaed: 0, cultivations: 0 },
  // Gacha保底
  gachaPitySSR: 0,
  gachaPitySR: 0,
  // Boss战斗
  bossBattle: null,
  bossTurn: 0,
  bossSkillUsed: 0,
  bossPlayerHP: 100,
  bossBossHP: 0,
  bossActive: false,
  // 探索
  exploring: false,
  exploreTimer: null,
  // 时间
  lastSave: Date.now(),
  lastOnline: Date.now(),
  gameStartTime: Date.now(),
};

var EQUIPMENT_SLOTS = ['weapon', 'armor', 'accessory'];

// DOM缓存
var $ = (id) => document.getElementById(id);
var cache = {};
function cacheEl(id) {
  if (!cache[id]) cache[id] = document.getElementById(id);
  return cache[id];
}

// ============================================================
// 初始化
// ============================================================

function init() {
  loadGame();
  updateUI();
  startGameLoop();
  setupDragDrop();
  updateAllPanels();
  log('[系统] 游戏加载完成！祝您修仙愉快~');
  // 离线收益
  processOfflineProgress();
}

// ============================================================
// 保存/加载
// ============================================================

function saveGame() {
  var saveData = {
    cultivation: GS.cultivation,
    realmIndex: GS.realmIndex,
    day: GS.day,
    spiritStones: GS.spiritStones,
    attack: GS.attack,
    defense: GS.defense,
    cards: GS.cards,
    equipped: GS.equipped,
    achievements: GS.achievements,
    tasks: GS.tasks,
    dailyTasks: GS.dailyTasks,
    bossesDefeated: GS.bossesDefeated,
    sectId: GS.sectId,
    sectContribution: GS.sectContribution,
    totalSectContribution: GS.totalSectContribution,
    ascensionCount: GS.ascensionCount,
    totalAscensions: GS.totalAscensions,
    stats: GS.stats,
    gachaPitySSR: GS.gachaPitySR,
    gachaPitySR: GS.gachaPitySR,
    gameStartTime: GS.gameStartTime,
    lastOnline: Date.now(),
  };
  try {
    localStorage.setItem('stackingCultivation_v20', JSON.stringify(saveData));
    GS.lastSave = Date.now();
    showToast('💾 游戏已保存', 'success');
  } catch(e) {
    log('[错误] 保存失败: ' + e.message);
  }
}

function loadGame() {
  try {
    var raw = localStorage.getItem('stackingCultivation_v20');
    if (!raw) {
      // 新游戏
      GS.cards = { cultivator: 1 };
      log('[系统] 新游戏开始！');
      return;
    }
    var data = JSON.parse(raw);
    Object.assign(GS, data);
    // 兼容旧版本
    if (!GS.ascensionBonus) GS.ascensionBonus = { attack: 0, defense: 0, cultivation: 1.0 };
    if (!GS.ascensionCount) GS.ascensionCount = 0;
    if (!GS.totalAscensions) GS.totalAscensions = 0;
    if (!GS.equipped) GS.equipped = {};
    if (!GS.gachaPitySSR) GS.gachaPitySSR = 0;
    if (!GS.gachaPitySR) GS.gachaPitySR = 0;
    if (!GS.stats) GS.stats = { clicks: 0, bossesDefeated: 0, cardsGachaed: 0, cultivations: 0 };
    log('[系统] 存档加载成功！');
    // 处理跨天任务
    handleDayChange();
  } catch(e) {
    log('[错误] 加载失败: ' + e.message);
    GS.cards = { cultivator: 1 };
  }
}

function processOfflineProgress() {
  var now = Date.now();
  var elapsed = (now - GS.lastOnline) / 1000; // 秒
  if (elapsed > 60) { // 超过1分钟才提示
    var offlineCultivation = Math.floor(elapsed * 0.5 * (1 + GS.realmIndex * 0.2) * GS.ascensionBonus.cultivation);
    if (offlineCultivation > 0) {
      GS.cultivation += offlineCultivation;
      showToast('🌙 离线收益: 修为 +' + offlineCultivation, 'success');
    }
  }
}

function handleDayChange() {
  var today = Math.floor((Date.now() - GS.gameStartTime) / 86400000) + 1;
  if (today > GS.day) {
    GS.day = today;
    // 重置每日任务
    GS.dailyTasks = {};
    log('[系统] 新的一天开始了！（第' + GS.day + '天）');
  }
}

// ============================================================
// 游戏循环
// ============================================================

function startGameLoop() {
  setInterval(gameLoop, 1000);
}

function gameLoop() {
  // 自动修炼
  var autoCultivationRate = 1 + GS.realmIndex * 0.5;
  autoCultivationRate *= GS.ascensionBonus.cultivation;
  GS.cultivation += autoCultivationRate;
  GS.stats.cultivations++;
  GS.cultivation = Math.floor(GS.cultivation);

  // 每日任务进度
  trackTask('dailyCultivation', 1);
  trackTask('dailyHerbsEaten', 0);
  trackTask('dailyPillsEaten', 0);

  // 突破检测
  checkBreakthrough();
  updateUI();

  // 自动保存
  if (Date.now() - GS.lastSave > 30000) {
    saveGame();
  }

  // 检测每日重置
  handleDayChange();
}

// ============================================================
// 境界突破
// ============================================================

function getRealmMaxCultivation() {
  var realm = REALMS[GS.realmIndex] || REALMS[REALMS.length - 1];
  return realm.maxCultivation * (1 + GS.ascensionCount * 0.5);
}

function checkBreakthrough() {
  var maxCult = getRealmMaxCultivation();
  if (GS.cultivation >= maxCult && GS.realmIndex < REALMS.length - 1) {
    doBreakthrough();
  }
}

function doBreakthrough() {
  var oldRealm = REALMS[GS.realmIndex];
  var oldMaxCult = getRealmMaxCultivation();
  GS.realmIndex++;
  GS.cultivation = 0;
  var newRealm = REALMS[GS.realmIndex];

  // 境界突破加成
  GS.attack += 5 + GS.realmIndex * 3 + GS.ascensionBonus.attack;
  GS.defense += 3 + GS.realmIndex * 2 + GS.ascensionBonus.defense;
  GS.spiritStones += 10 + GS.realmIndex * 5;

  log('[突破] ' + oldRealm.name + ' → ' + newRealm.name + '！攻击+' + (5 + GS.realmIndex * 3) + ', 防御+' + (3 + GS.realmIndex * 2));
  trackTask('realmIndex', GS.realmIndex);
  showBreakthroughEffect(oldRealm.name, newRealm.name);
}

// ============================================================
// 手动修炼（点击）
// ============================================================

function cultivate() {
  var baseCultivation = 1;
  // 境界加成
  baseCultivation *= (1 + GS.realmIndex * 0.2);
  // 飞升加成
  baseCultivation *= GS.ascensionBonus.cultivation;
  // 暴击
  var critChance = 0.1 + GS.realmIndex * 0.02;
  var isCrit = Math.random() < critChance;
  var amount = Math.floor(baseCultivation * (isCrit ? (2 + Math.random() * 3) : 1));

  GS.cultivation += amount;
  GS.stats.clicks++;

  // 显示效果
  showCultivationEffect(amount, isCrit);
  trackTask('firstCultivate', 1);
  checkBreakthrough();
  updateUI();
}

// 导出到 window 让 HTML onclick 可用
window.cultivate = cultivate;

// ============================================================
// 抽卡系统
// ============================================================

function openGachaPanel() {
  closeAllPanels();
  $('gacha-panel').classList.add('open');
  updateGachaPanel();
}

function closeGachaPanel() {
  $('gacha-panel').classList.remove('open');
}

function updateGachaPanel() {
  var ssrPct = Math.min(100, (GS.gachaPitySSR / 50) * 100);
  var srPct = Math.min(100, (GS.gachaPitySR / 10) * 100);
  $('gacha-pity-ssr').querySelector('span').textContent = GS.gachaPitySSR + '/50';
  $('gacha-pity-ssr-bar').querySelector('div').style.width = ssrPct + '%';
  $('gacha-pity-sr').querySelector('span').textContent = GS.gachaPitySR + '/10';
  $('gacha-pity-sr-bar').querySelector('div').style.width = srPct + '%';
}

function gacha() {
  if (GS.spiritStones < GACHA_COST_SINGLE) {
    showToast('灵石不足！', 'error');
    return;
  }
  GS.spiritStones -= GACHA_COST_SINGLE;
  var card = doGachaRoll();
  addCard(card, 1);
  GS.gachaPitySSR++;
  GS.gachaPitySR++;
  if (card.startsWith('pill')) GS.gachaPitySR = 0; // 丹药保底SR
  if (card.startsWith('herb') || card.startsWith('weapon') || card.startsWith('ore') || card.startsWith('tech') || card.startsWith('core') || card.startsWith('artifact') || card.startsWith('mat')) {
    if (CARD_DEFS[card] && CARD_DEFS[card].rarity === 'SSR') GS.gachaPitySSR = 0;
    if (CARD_DEFS[card] && CARD_DEFS[card].rarity === 'SR') GS.gachaPitySR = 0;
  }
  GS.stats.cardsGachaed++;
  showGachaResult([card]);
  updateUI();
  updateGachaPanel();
}

function gachaTen() {
  if (GS.spiritStones < GACHA_COST_TEN) {
    showToast('灵石不足！', 'error');
    return;
  }
  GS.spiritStones -= GACHA_COST_TEN;
  var results = [];
  for (var i = 0; i < 10; i++) {
    var card = doGachaRoll();
    addCard(card, 1);
    results.push(card);
    GS.gachaPitySSR++;
    GS.gachaPitySR++;
    if (card.startsWith('pill')) GS.gachaPitySR = 0;
    if (CARD_DEFS[card] && CARD_DEFS[card].rarity === 'SSR') GS.gachaPitySSR = 0;
    if (CARD_DEFS[card] && CARD_DEFS[card].rarity === 'SR') GS.gachaPitySR = 0;
  }
  GS.stats.cardsGachaed += 10;
  showGachaResult(results);
  updateUI();
  updateGachaPanel();
}

function doGachaRoll() {
  // 保底逻辑
  if (GS.gachaPitySSR >= 50) {
    var ssrCards = GACHA_RATES.SSR.cards;
    return ssrCards[Math.floor(Math.random() * ssrCards.length)];
  }
  if (GS.gachaPitySR >= 10) {
    var srCards = GACHA_RATES.SR.cards;
    return srCards[Math.floor(Math.random() * srCards.length)];
  }
  var rand = Math.random();
  var cumulative = 0;
  var categories = ['SSR', 'SR', 'R', 'N'];
  for (var i = 0; i < categories.length; i++) {
    cumulative += GACHA_RATES[categories[i]].rate;
    if (rand < cumulative) {
      var cards = GACHA_RATES[categories[i]].cards;
      return cards[Math.floor(Math.random() * cards.length)];
    }
  }
  return GACHA_RATES.N.cards[0];
}

function showGachaResult(cards) {
  var panel = $('gacha-result-panel');
  var html = '<div style="text-align:center;padding:20px"><h2 style="color:#ffd700;margin-bottom:16px">🎰 抽卡结果</h2>';
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var def = CARD_DEFS[card] || { icon: '?', title: card, rarity: 'N' };
    var color = { N: '#aaa', R: '#4fc3f7', SR: '#ffd700', SSR: '#ff6b6b' }[def.rarity] || '#fff';
    html += '<div style="margin:8px;padding:12px;background:rgba(255,255,255,0.05);border-radius:12px;border:1px solid ' + color + '">';
    html += '<span style="font-size:40px">' + def.icon + '</span>';
    html += '<div style="color:' + color + ';font-weight:bold;margin-top:4px">' + def.title + '</div>';
    html += '<div style="font-size:11px;color:#aaa">' + def.desc + '</div>';
    html += '</div>';
  }
  html += '<button onclick="closeGachaResult()" style="margin-top:20px;padding:12px 32px;background:linear-gradient(135deg,#4fc3f7,#4a90d9);border:none;border-radius:8px;color:#fff;font-size:14px">确定</button></div>';
  panel.innerHTML = html;
  panel.style.display = 'flex';
}

window.closeGachaResult = function() {
  $('gacha-result-panel').style.display = 'none';
};

function addCard(cardId, count) {
  GS.cards[cardId] = (GS.cards[cardId] || 0) + count;
}

window.openGachaPanel = openGachaPanel;
window.closeGachaPanel = closeGachaPanel;
window.gacha = gacha;
window.gachaTen = gachaTen;

// ============================================================
// Boss 系统
// ============================================================

function openBossPanel() {
  closeAllPanels();
  var panel = $('boss-panel');
  panel.classList.add('open');
  var html = '';
  for (var i = 0; i < BOSS_LIST.length; i++) {
    var boss = BOSS_LIST[i];
    if (GS.realmIndex < boss.minRealm) continue;
    var defeated = GS.bossesDefeated[boss.id] || 0;
    html += '<div onclick="startBossBattle(\'' + boss.id + '\')" style="cursor:pointer;background:rgba(255,100,100,0.1);border:1px solid rgba(255,100,100,0.3);border-radius:12px;padding:14px;margin-bottom:10px">';
    html += '<div style="font-size:18px;font-weight:bold;color:#ff6b6b">' + boss.name + '</div>';
    html += '<div style="font-size:12px;color:#aaa;margin:4px 0">' + boss.desc + '</div>';
    html += '<div style="font-size:11px">HP: ' + boss.hp + ' | 攻击: ' + boss.attack + ' | 防御: ' + boss.defense + ' | 奖励: ' + boss.rewardCultivation + '修为</div>';
    html += '<div style="font-size:11px;color:#ffd700">已击杀: ' + defeated + '次</div>';
    html += '</div>';
  }
  $('boss-list').innerHTML = html || '<div style="text-align:center;color:#aaa;padding:20px">当前无Boss可挑战</div>';
}

function closeBossPanel() {
  $('boss-panel').classList.remove('open');
  GS.bossActive = false;
}

function startBossBattle(bossId) {
  var boss = BOSS_LIST.find(function(b) { return b.id === bossId; });
  if (!boss) return;
  var playerPower = calculatePlayerPower();
  if (playerPower < boss.attack * 0.3) {
    showToast('战力不足，建议战力: ' + Math.floor(boss.attack * 0.3), 'error');
    return;
  }
  GS.bossActive = true;
  GS.bossBattle = boss;
  GS.bossPlayerHP = 100 + GS.defense * 2;
  GS.bossBossHP = boss.hp;
  GS.bossTurn = 0;
  GS.bossSkillUsed = 0;

  $('boss-list').style.display = 'none';
  var area = $('boss-battle-area');
  area.style.display = 'block';
  $('boss-battle-name').textContent = boss.name + ' - ' + boss.desc;
  area.querySelector('button') && (area.querySelector('button').style.display = 'none');
  updateBossBattleUI();
  updateBossSkills();
}

function updateBossSkills() {
  var boss = GS.bossBattle;
  var skills = boss.skills || [];
  var html = '<div style="margin-top:10px;font-size:12px">你的技能:</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">';
  html += '<button onclick="bossAttack(0)" style="padding:8px 16px;background:rgba(79,195,247,0.2);border:1px solid rgba(79,195,247,0.4);border-radius:8px;color:#4fc3f7">普通攻击</button>';
  html += '<button onclick="bossAttack(1)" style="padding:8px 16px;background:rgba(255,215,0,0.2);border:1px solid rgba(255,215,0,0.4);border-radius:8px;color:#ffd700">全力一击（伤害x1.5）</button>';
  html += '<button onclick="bossHeal()" style="padding:8px 16px;background:rgba(76,175,80,0.2);border:1px solid rgba(76,175,80,0.4);border-radius:8px;color:#4caf50">治疗（+30%HP）</button>';
  html += '</div>';
  $('boss-skills-area').innerHTML = html;
}

function bossAttack(mode) {
  if (!GS.bossActive) return;
  var boss = GS.bossBattle;
  var playerPower = calculatePlayerPower();
  var baseDamage = playerPower * 0.4;
  if (mode === 1) baseDamage *= 1.5;
  var damage = Math.max(1, Math.floor(baseDamage - boss.defense * 0.3));
  GS.bossBossHP -= damage;
  var log = '你造成了 ' + damage + ' 伤害！';
  appendBossLog(log, '#4fc3f7');

  if (GS.bossBossHP <= 0) {
    bossVictory();
  } else {
    bossCounterAttack();
  }
}

function bossHeal() {
  if (!GS.bossActive) return;
  var heal = Math.floor(GS.bossPlayerHP * 0.3);
  GS.bossPlayerHP = Math.min(getMaxBossPlayerHP(), GS.bossPlayerHP + heal);
  appendBossLog('你回复了 ' + heal + ' HP！', '#4caf50');
  bossCounterAttack();
}

function bossCounterAttack() {
  var boss = GS.bossBattle;
  var damage = Math.max(1, Math.floor(boss.attack * (0.8 + Math.random() * 0.4) - GS.defense * 0.5));
  GS.bossPlayerHP -= damage;
  appendBossLog(boss.name + ' 反击造成了 ' + damage + ' 伤害！', '#ff6b6b');
  updateBossBattleUI();

  if (GS.bossPlayerHP <= 0) {
    bossDefeat();
  } else {
    GS.bossTurn++;
  }
}

function getMaxBossPlayerHP() {
  return 100 + GS.defense * 2;
}

function updateBossBattleUI() {
  var boss = GS.bossBattle;
  var hpPct = Math.max(0, (GS.bossBossHP / boss.hp) * 100);
  $('boss-hp-bar').style.width = hpPct + '%';
  $('boss-hp-text').textContent = 'Boss: ' + Math.max(0, Math.floor(GS.bossBossHP)) + ' / ' + boss.hp;
  $('boss-player-power').textContent = '你的HP: ' + Math.max(0, Math.floor(GS.bossPlayerHP)) + ' / ' + getMaxBossPlayerHP();
}

function appendBossLog(text, color) {
  var log = $('boss-log');
  log.innerHTML = '<div style="color:' + color + ';margin:4px 0;font-size:12px">' + text + '</div>' + (log.innerHTML || '');
  if (log.children.length > 20) log.removeChild(log.lastChild);
}

function bossVictory() {
  var boss = GS.bossBattle;
  GS.bossesDefeated[boss.id] = (GS.bossesDefeated[boss.id] || 0) + 1;
  GS.cultivation += boss.rewardCultivation;
  GS.stats.bossesDefeated++;
  GS.spiritStones += Math.floor(boss.rewardCultivation * 0.1);

  appendBossLog('🎉 恭喜！击败了 ' + boss.name + '！', '#ffd700');
  appendBossLog('获得: ' + boss.rewardCultivation + '修为', '#ffd700');

  $('boss-battle-area').style.display = 'none';
  var reward = $('boss-reward-area');
  reward.style.display = 'block';
  $('boss-reward-text').innerHTML = '🎉 击败 <b style="color:#ff6b6b">' + boss.name + '</b><br>获得修为: <b style="color:#ffd700">' + boss.rewardCultivation + '</b><br>灵石: <b style="color:#4fc3f7">+' + Math.floor(boss.rewardCultivation * 0.1) + '</b>';

  trackTask('realmIndex', GS.realmIndex);
  GS.bossActive = false;
}

function bossDefeat() {
  appendBossLog('💀 你被 ' + (GS.bossBattle && GS.bossBattle.name) + ' 击败了...', '#ff6b6b');
  GS.bossActive = false;
  showToast('Boss战失败，请提升战力后再来！', 'error');
  setTimeout(function() {
    $('boss-battle-area').style.display = 'none';
    $('boss-list').style.display = 'block';
    openBossPanel();
  }, 2000);
}

function closeAllPanels() {
  var panels = document.querySelectorAll('.panel');
  for (var i = 0; i < panels.length; i++) panels[i].classList.remove('open');
}

window.openBossPanel = openBossPanel;
window.closeBossPanel = closeBossPanel;
window.startBossBattle = startBossBattle;
window.bossAttack = bossAttack;
window.bossHeal = bossHeal;

// ============================================================
// 装备系统
// ============================================================

function openEquipPanel() {
  closeAllPanels();
  $('equip-panel').classList.add('open');
  updateEquipPanel();
}

function closeEquipPanel() {
  $('equip-panel').classList.remove('open');
}

function updateEquipPanel() {
  var html = '<div style="margin-bottom:16px">';
  html += '<div style="color:#a8edea;margin-bottom:8px">当前装备:</div>';
  for (var i = 0; i < EQUIPMENT_SLOTS.length; i++) {
    var slot = EQUIPMENT_SLOTS[i];
    var cardId = GS.equipped[slot];
    var def = cardId ? CARD_DEFS[cardId] : null;
    html += '<div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">';
    html += '<div>';
    html += '<span style="color:#888;font-size:12px">' + slot + '</span>';
    if (def) {
      html += '<div style="margin-top:2px">' + def.icon + ' ' + def.title + '</div>';
      var stats = def.equipStats || {};
      for (var k in stats) html += '<div style="font-size:11px;color:#ffd700">' + k + '+' + stats[k] + '</div>';
    } else {
      html += '<div style="color:#555">未装备</div>';
    }
    html += '</div>';
    if (def) {
      html += '<button onclick="unequipSlot(\'' + slot + '\')" style="padding:4px 12px;font-size:11px">卸下</button>';
    }
    html += '</div>';
  }
  html += '</div>';

  html += '<div style="color:#a8edea;margin-bottom:8px">可强化装备（合成界面中点击装备升级）:</div>';
  html += '<div style="font-size:12px;color:#aaa">在游戏主界面拖拽相同装备进行合成强化</div>';
  html += '<div style="margin-top:16px"><button onclick="closeEquipPanel()" style="width:100%">关闭</button></div>';
  $('equip-list').innerHTML = html;
}

function unequipSlot(slot) {
  if (GS.equipped[slot]) {
    var cardId = GS.equipped[slot];
    addCard(cardId, 1);
    delete GS.equipped[slot];
    recalculateStats();
    updateEquipPanel();
    updateUI();
    log('[装备] 卸下了 ' + (CARD_DEFS[cardId] && CARD_DEFS[cardId].title));
  }
}

function recalculateStats() {
  // 基础属性
  var baseAttack = 10;
  var baseDefense = 5;
  for (var i = 0; i < REALMS.length; i++) {
    if (i <= GS.realmIndex) {
      baseAttack += 5 + i * 3;
      baseDefense += 3 + i * 2;
    }
  }
  GS.attack = baseAttack + GS.ascensionBonus.attack;
  GS.defense = baseDefense + GS.ascensionBonus.defense;
  // 装备加成
  for (var slot in GS.equipped) {
    var cardId = GS.equipped[slot];
    var def = CARD_DEFS[cardId];
    if (def && def.equipStats) {
      GS.attack += def.equipStats.attack || 0;
      GS.defense += def.equipStats.defense || 0;
    }
  }
}

function calculatePlayerPower() {
  return GS.attack + GS.defense * 0.8;
}

window.openEquipPanel = openEquipPanel;
window.closeEquipPanel = closeEquipPanel;

// ============================================================
// 宗门系统
// ============================================================

function openSectPanel() {
  closeAllPanels();
  $('sect-panel').classList.add('open');
  updateSectPanel();
}

function closeSectPanel() {
  $('sect-panel').classList.remove('open');
}

function updateSectPanel() {
  if (GS.sectId) {
    $('sect-action-area').style.display = 'none';
    $('sect-info-area').style.display = 'block';
    var sect = SECT_LIST.find(function(s) { return s.id === GS.sectId; });
    if (sect) {
      $('sect-name-display').textContent = sect.name + ' (Lv.' + (sect.level || 1) + ')';
      $('sect-contribution-display').textContent = '贡献: ' + GS.sectContribution;
      $('sect-desc-display').textContent = sect.desc + ' | ' + sect.bonus;
      $('sect-members-display').textContent = '今日贡献: ' + GS.totalSectContribution;
    }
  } else {
    $('sect-action-area').style.display = 'block';
    $('sect-info-area').style.display = 'none';
    var html = '<div style="color:#a8edea;margin-bottom:10px;font-size:14px">选择宗门:</div>';
    for (var i = 0; i < SECT_LIST.length; i++) {
      var sect = SECT_LIST[i];
      var locked = GS.totalSectContribution < sect.needContribution ? '🔒 ' : '✅ ';
      html += '<div onclick="joinSect(\'' + sect.id + '\')" style="cursor:pointer;padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:8px">';
      html += locked + sect.name + ' - ' + sect.desc + ' | ' + sect.bonus;
      html += '<div style="font-size:11px;color:#ffd700">需要贡献: ' + sect.needContribution + ' (当前: ' + GS.totalSectContribution + ')</div>';
      html += '</div>';
    }
    $('sect-list').innerHTML = html;
  }
}

function joinSect(sectId) {
  var sect = SECT_LIST.find(function(s) { return s.id === sectId; });
  if (!sect) return;
  if (GS.totalSectContribution < sect.needContribution) {
    showToast('贡献不足，需要 ' + sect.needContribution + ' 贡献', 'error');
    return;
  }
  GS.sectId = sectId;
  updateSectPanel();
  showToast('已加入 ' + sect.name + '！', 'success');
}

function createSect() {
  var name = $('sect-name-input').value.trim();
  if (name.length < 2 || name.length > 6) {
    showToast('宗门名称需2-6字', 'error');
    return;
  }
  if (GS.cultivation < 100) {
    showToast('需要100修为来创建宗门', 'error');
    return;
  }
  GS.cultivation -= 100;
  // 简单处理：归入第一个宗门作为"创建成功"
  GS.sectId = SECT_LIST[0].id;
  updateSectPanel();
  showToast('宗门"' + name + '"创建成功！', 'success');
}

function leaveSect() {
  GS.sectId = null;
  GS.sectContribution = 0;
  updateSectPanel();
}

function buySectItem() {
  $('sect-info-area').style.display = 'none';
  $('sect-shop-area').style.display = 'block';
  $('sect-shop-items').innerHTML = '<div style="color:#ffd700;margin-bottom:10px">宗门商店</div><div style="font-size:12px;color:#aaa;padding:20px;text-align:center">贡献不足，商店未解锁</div><button onclick="closeSectShop()">返回</button>';
}

function closeSectShop() {
  $('sect-shop-area').style.display = 'none';
  $('sect-info-area').style.display = 'block';
}

function claimSectTask() {
  showToast('宗门任务功能开发中...', 'success');
}

window.openSectPanel = openSectPanel;
window.closeSectPanel = closeSectPanel;
window.joinSect = joinSect;
window.createSect = createSect;
window.leaveSect = leaveSect;
window.buySectItem = buySectItem;
window.closeSectShop = closeSectShop;
window.claimSectTask = claimSectTask;

// ============================================================
// 飞升系统
// ============================================================

function canAscend() {
  return GS.realmIndex === REALMS.length - 1 && GS.cultivation >= REALMS[REALMS.length - 1].maxCultivation;
}

function doAscension() {
  if (!canAscend()) return;
  GS.ascensionCount++;
  GS.totalAscensions++;
  GS.ascensionBonus.cultivation = 1.0 + GS.ascensionCount * 0.3;
  GS.ascensionBonus.attack = GS.ascensionCount * 8;
  GS.ascensionBonus.defense = GS.ascensionCount * 5;
  // 重置修为但保留境界
  GS.cultivation = 0;
  GS.realmIndex = 0; // 重置到练气期
  recalculateStats();
  log('[飞升] 第' + GS.ascensionCount + '次飞升！修炼加成 x' + GS.ascensionBonus.cultivation.toFixed(1));
  showToast('🌈 第' + GS.ascensionCount + '次飞升完成！修炼速度+' + Math.round((GS.ascensionBonus.cultivation - 1) * 100) + '%', 'success');
  updateUI();
}

function getAscensionCultivationBonus() { return GS.ascensionBonus.cultivation; }
function getAscensionAttackBonus() { return GS.ascensionBonus.attack; }
function getAscensionDefenseBonus() { return GS.ascensionBonus.defense; }

window.canAscend = canAscend;
window.doAscension = doAscension;

// ============================================================
// 探索系统
// ============================================================

function explore() {
  if (GS.exploring) {
    stopExplore();
    return;
  }
  GS.exploring = true;
  $('explore-btn').textContent = '⏸️ 停止';
  $('explore-btn').style.background = 'linear-gradient(135deg, rgba(255,100,100,0.3), rgba(255,80,80,0.3))';
  log('[探索] 开始探索...');
  GS.exploreTimer = setInterval(function() {
    var luck = Math.random();
    var reward;
    if (luck < 0.05) {
      reward = 'herb_xiancao';
    } else if (luck < 0.12) {
      reward = 'herb_tiancai';
    } else if (luck < 0.25) {
      var herbs = ['herb_lingzhi', 'herb_renshen', 'herb_heshouwu'];
      reward = herbs[Math.floor(Math.random() * herbs.length)];
    } else if (luck < 0.40) {
      var ores = ['ore_jingjin', 'ore_xuantie'];
      reward = ores[Math.floor(Math.random() * ores.length)];
    } else if (luck < 0.55) {
      reward = 'core_yaodan1';
    } else if (luck < 0.70) {
      reward = 'mat_lingshi';
    } else {
      var basics = ['herb_gouqi', 'herb_jiucai', 'cultivator', 'ore_tiekuang'];
      reward = basics[Math.floor(Math.random() * basics.length)];
    }
    addCard(reward, 1);
    var def = CARD_DEFS[reward];
    log('[探索] 发现: ' + (def && def.icon) + ' ' + (def && def.title) + '!');
    updateUI();
  }, 3000);
}

function stopExplore() {
  GS.exploring = false;
  if (GS.exploreTimer) {
    clearInterval(GS.exploreTimer);
    GS.exploreTimer = null;
  }
  $('explore-btn').textContent = '🌍 探索';
  $('explore-btn').style.background = '';
}

window.explore = explore;
window.stopExplore = stopExplore;

// ============================================================
// 成就系统
// ============================================================

function toggleAchievementPanel() {
  var panel = $('achievement-panel');
  if (panel.classList.contains('open')) {
    panel.classList.remove('open');
    return;
  }
  closeAllPanels();
  panel.classList.add('open');
  updateAchievementPanel();
}

function updateAchievementPanel() {
  var ACHIEVEMENTS = [
    { id: 'realm_1', name: '🏔️ 初入筑基', desc: '突破到筑基期', condition: function() { return GS.realmIndex >= 1; } },
    { id: 'realm_3', name: '💎 金丹大道', desc: '突破到金丹期', condition: function() { return GS.realmIndex >= 3; } },
    { id: 'realm_5', name: '🌟 元婴老怪', desc: '突破到元婴期', condition: function() { return GS.realmIndex >= 5; } },
    { id: 'boss_1', name: '⚔️ 初战告捷', desc: '击败第一个Boss', condition: function() { return GS.stats.bossesDefeated >= 1; } },
    { id: 'boss_5', name: '💀 斩妖除魔', desc: '击败5个Boss', condition: function() { return GS.stats.bossesDefeated >= 5; } },
    { id: 'gacha_10', name: '🎰 抽卡新手', desc: '抽卡10次', condition: function() { return GS.stats.cardsGachaed >= 10; } },
    { id: 'ascend_1', name: '🌈 初入仙途', desc: '完成第一次飞升', condition: function() { return GS.totalAscensions >= 1; } },
    { id: 'ascend_3', name: '☁️ 再登仙阶', desc: '完成3次飞升', condition: function() { return GS.totalAscensions >= 3; } },
    { id: 'ascend_10', name: '✨ 仙道永恒', desc: '完成10次飞升', condition: function() { return GS.totalAscensions >= 10; } },
  ];

  var html = '';
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var ach = ACHIEVEMENTS[i];
    var unlocked = GS.achievements.indexOf(ach.id) >= 0 || ach.condition();
    if (unlocked && GS.achievements.indexOf(ach.id) < 0) {
      GS.achievements.push(ach.id);
      log('[成就] 解锁: ' + ach.name + '！');
    }
    html += '<div style="padding:10px;background:' + (unlocked ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.04)') + ';border-radius:8px;margin-bottom:8px;border:1px solid ' + (unlocked ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)') + '">';
    html += '<div style="font-size:14px;font-weight:bold;color:' + (unlocked ? '#ffd700' : '#555') + '">' + ach.name + '</div>';
    html += '<div style="font-size:12px;color:' + (unlocked ? '#aaa' : '#444') + '">' + ach.desc + '</div>';
    html += '</div>';
  }
  html += '<button onclick="toggleAchievementPanel()" style="width:100%;margin-top:8px">关闭</button>';
  $('achievement-list').innerHTML = html;
}

window.toggleAchievementPanel = toggleAchievementPanel;

// ============================================================
// 任务系统
// ============================================================

function toggleTaskPanel() {
  var panel = $('task-panel');
  if (panel.classList.contains('open')) {
    panel.classList.remove('open');
    return;
  }
  closeAllPanels();
  panel.classList.add('open');
  updateTaskPanel();
}

function updateTaskPanel() {
  var mainHtml = '<div style="color:#a8edea;margin-bottom:10px;font-size:14px">主线任务</div>';
  var mainTasks = TASKS.main;
  for (var i = 0; i < mainTasks.length; i++) {
    var task = mainTasks[i];
    var state = GS.tasks[task.id];
    if (!state) { state = { claimed: false, progress: 0 }; GS.tasks[task.id] = state; }
    var completed = task.stat === 'realmIndex' ? (GS[task.stat] >= task.targetValue) : ((state.progress || 0) >= task.target);
    mainHtml += buildTaskHtml(task, completed, state);
  }
  $('main-tasks').innerHTML = mainHtml;

  var dailyHtml = '<div style="color:#a8edea;margin-bottom:10px;font-size:14px">每日任务</div>';
  var dailyTasks = TASKS.daily;
  for (var j = 0; j < dailyTasks.length; j++) {
    var dt = dailyTasks[j];
    var ds = GS.dailyTasks[dt.id];
    if (!ds) { ds = { claimed: false, progress: 0 }; GS.dailyTasks[dt.id] = ds; }
    var dcompleted = (ds.progress || 0) >= dt.target;
    dailyHtml += buildTaskHtml(dt, dcompleted, ds);
  }
  dailyHtml += '<button onclick="toggleTaskPanel()" style="width:100%;margin-top:8px">关闭</button>';
  $('daily-tasks').innerHTML = dailyHtml;
}

function buildTaskHtml(task, completed, state) {
  var claimed = state.claimed;
  var progress = state.progress || 0;
  var html = '<div class="task-item' + (claimed ? ' completed' : '') + '">';
  html += '<div class="task-header">';
  html += '<span class="task-name">' + task.name + '</span>';
  if (claimed) {
    html += '<span class="task-status claimed">已领取</span>';
  } else if (completed) {
    html += '<span class="task-status" style="background:rgba(255,215,0,0.2);color:#ffd700">可领取</span>';
  } else {
    html += '<span class="task-status ongoing">进行中</span>';
  }
  html += '</div>';
  html += '<div class="task-desc">' + task.desc + '</div>';
  if (!claimed) {
    html += '<div class="task-progress">' + progress + ' / ' + task.target + '</div>';
    html += '<div class="task-progress-bar"><div class="task-progress-fill" style="width:' + Math.min(100, (progress / task.target) * 100) + '%"></div></div>';
    html += '<div class="task-reward">奖励: ' + task.rewardDesc + '</div>';
  }
  if (completed && !claimed) {
    html += '<button class="claim-btn" onclick="claimTask(\'' + task.id + '\')">领取奖励</button>';
  }
  html += '</div>';
  return html;
}

function claimTask(taskId) {
  var allTasks = TASKS.main.concat(TASKS.daily);
  var task = allTasks.find(function(t) { return t.id === taskId; });
  if (!task) return;
  var state = GS.tasks[taskId] || GS.dailyTasks[taskId];
  if (!state || state.claimed) return;

  // 发放奖励
  for (var k in task.reward) {
    if (k === 'cultivation') GS.cultivation += task.reward[k];
    if (k === 'spiritStones') GS.spiritStones += task.reward[k];
  }
  state.claimed = true;
  showToast('领取成功: ' + task.rewardDesc, 'success');
  updateTaskPanel();
  updateUI();
}

function trackTask(stat, value) {
  var allTasks = TASKS.main.concat(TASKS.daily);
  for (var i = 0; i < allTasks.length; i++) {
    var task = allTasks[i];
    if (task.stat !== stat) continue;
    var state = GS.tasks[task.id] || GS.dailyTasks[task.id];
    if (!state) continue;
    if (task.targetValue !== undefined) {
      state.progress = Math.max(state.progress || 0, GS[stat] || 0);
    } else {
      state.progress = Math.max(state.progress || 0, value);
    }
  }
}

window.toggleTaskPanel = toggleTaskPanel;
window.claimTask = claimTask;

// ============================================================
// 排行榜
// ============================================================

function toggleLeaderboard() {
  var panel = $('leaderboard-panel');
  if (panel.classList.contains('open')) {
    panel.classList.remove('open');
    return;
  }
  closeAllPanels();
  panel.classList.add('open');
  switchLeaderboard('power');
}

function switchLeaderboard(type) {
  var tabs = ['power', 'realm', 'day'];
  for (var i = 0; i < tabs.length; i++) {
    var btn = $('lb-tab-' + tabs[i]);
    btn.style.background = tabs[i] === type ? 'rgba(168,237,234,0.3)' : '';
    btn.style.color = tabs[i] === type ? '#a8edea' : '#888';
  }
  // 模拟排行榜（实际项目可用后端存储）
  var mockData = [
    { name: '剑修张三', power: 8500 + Math.floor(Math.random() * 1000), realm: 6, day: 42 },
    { name: '炼丹李四', power: 7200 + Math.floor(Math.random() * 500), realm: 5, day: 38 },
    { name: '你', power: Math.floor(calculatePlayerPower()), realm: GS.realmIndex, day: GS.day },
    { name: '散修王五', power: 5000 + Math.floor(Math.random() * 800), realm: 4, day: 28 },
    { name: '魔修赵六', power: 4000 + Math.floor(Math.random() * 600), realm: 4, day: 22 },
  ];
  mockData.sort(function(a, b) { return b[type === 'power' ? 'power' : (type === 'realm' ? 'realm' : 'day')] - a[type === 'power' ? 'power' : (type === 'realm' ? 'realm' : 'day')]; });

  var labels = { power: '战力', realm: '境界', day: '天数' };
  var html = '<div style="margin-bottom:16px">';
  for (var j = 0; j < mockData.length; j++) {
    var entry = mockData[j];
    var isYou = entry.name === '你';
    html += '<div style="padding:10px;background:' + (isYou ? 'rgba(168,237,234,0.15)' : 'rgba(255,255,255,0.04)') + ';border-radius:8px;margin-bottom:6px;border:1px solid ' + (isYou ? 'rgba(168,237,234,0.4)' : 'rgba(255,255,255,0.1)') + '">';
    html += '<div style="display:flex;justify-content:space-between">';
    html += '<span style="color:' + (isYou ? '#a8edea' : '#fff') + ';font-weight:bold">' + (j + 1) + '. ' + entry.name + (isYou ? ' (你)' : '') + '</span>';
    html += '<span style="color:#ffd700">' + labels[type] + ': ' + (type === 'power' ? entry.power : (type === 'realm' ? REALMS[entry.realm] && REALMS[entry.realm].name : entry.day + '天')) + '</span>';
    html += '</div></div>';
  }
  html += '</div><button onclick="toggleLeaderboard()" style="width:100%">关闭</button>';
  $('leaderboard-list').innerHTML = html;
}

window.toggleLeaderboard = toggleLeaderboard;
window.switchLeaderboard = switchLeaderboard;

// ============================================================
// UI 更新
// ============================================================

function updateUI() {
  var realm = REALMS[GS.realmIndex] || REALMS[REALMS.length - 1];
  var maxCult = getRealmMaxCultivation();
  var cultPct = Math.min(100, (GS.cultivation / maxCult) * 100);

  $('realm-value').textContent = realm.name + (GS.ascensionCount > 0 ? ' (飞升' + GS.ascensionCount + '重)' : '');
  $('cultivation-value').textContent = Math.floor(GS.cultivation) + ' / ' + maxCult;
  $('cultivation-bar').style.width = cultPct + '%';
  $('day-value').textContent = GS.day;
  $('spirit-stones-value').textContent = GS.spiritStones;
  $('attack-value').textContent = Math.floor(GS.attack);
  $('defense-value').textContent = Math.floor(GS.defense);

  // 飞升按钮
  var ascendBtn = $('ascend-btn');
  if (canAscend()) {
    ascendBtn.style.display = 'inline-block';
  } else {
    ascendBtn.style.display = 'none';
  }

  // 更新面板
  updateAllPanels();
}

function updateAllPanels() {
  // 仅更新已打开的面板
  if ($('task-panel').classList.contains('open')) updateTaskPanel();
  if ($('achievement-panel').classList.contains('open')) updateAchievementPanel();
  if ($('equip-panel').classList.contains('open')) updateEquipPanel();
}

// ============================================================
// 拖拽系统
// ============================================================

function setupDragDrop() {
  var container = $('game-container');
  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('touchstart', onTouchStart, { passive: false });
  container.addEventListener('click', onContainerClick);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchend', onTouchEnd);
  // 初始化卡片
  renderCards();
  // 定时同步
  setInterval(syncCardPositions, 1000);
}

var dragState = { dragging: false, card: null, startX: 0, startY: 0, offsetX: 0, offsetY: 0, originX: 0, originY: 0 };

function onContainerClick(e) {
  // 忽略拖拽后的点击
  if (dragState.dragging) return;
  var target = e.target.closest('.card');
  if (!target) return;
  var cardId = target.dataset.card;
  var def = CARD_DEFS[cardId];
  if (!def) return;

  // 点击修仙者 = 修炼
  if (cardId === 'cultivator') {
    cultivate();
    return;
  }

  // 服用丹药/灵石/法器
  if (def.type === 'pill' || def.type === 'artifact' || (def.type === 'mat' && def.icon === '💰')) {
    if (def.effect) {
      var parts = def.effect.split(',');
      for (var i = 0; i < parts.length; i++) {
        var kv = parts[i].split('+');
        if (kv.length === 2) {
          var k = kv[0].trim(), v = parseFloat(kv[1]);
          if (k === 'cultivation') GS.cultivation += v;
          if (k === 'attack') GS.attack += v;
          if (k === 'defense') GS.defense += v;
          if (k === 'dujieBonus') log('[道具] 渡劫加成 +' + v + '%');
        }
      }
      addCard(cardId, -1);
      if (def.type === 'pill') trackTask('dailyPillsEaten', 1);
      if (def.type === 'pill') trackTask('dailyHerbsEaten', 1);
      log('[使用] ' + def.icon + ' ' + def.title);
      updateUI();
      renderCards();
    }
    return;
  }

  // 其他物品显示详情
  showToast(def.icon + ' ' + def.title + ' — ' + def.desc);
}

function onMouseDown(e) {
  var card = e.target.closest('.card');
  if (!card) return;
  startDrag(card, e.clientX, e.clientY);
}

function onTouchStart(e) {
  var card = e.target.closest('.card');
  if (!card) return;
  var touch = e.touches[0];
  startDrag(card, touch.clientX, touch.clientY);
  e.preventDefault();
}

function startDrag(card, x, y) {
  var cardId = card.dataset.card;
  dragState.dragging = true;
  dragState.card = card;
  dragState.startX = x;
  dragState.startY = y;
  dragState.offsetX = x - card.offsetLeft;
  dragState.offsetY = y - card.offsetTop;
  dragState.originX = card.offsetLeft;
  dragState.originY = card.offsetTop;
  card.classList.add('dragging');
  card.style.zIndex = 1000;
  card.style.position = 'absolute';
  card.style.left = card.offsetLeft + 'px';
  card.style.top = card.offsetTop + 'px';
}

function onMouseMove(e) {
  if (!dragState.dragging) return;
  moveDrag(e.clientX, e.clientY);
}

function onTouchMove(e) {
  if (!dragState.dragging) return;
  var touch = e.touches[0];
  moveDrag(touch.clientX, touch.clientY);
  e.preventDefault();
}

function moveDrag(x, y) {
  var card = dragState.card;
  var nx = x - dragState.offsetX;
  var ny = y - dragState.offsetY;
  // 边界
  var container = $('game-container');
  var maxX = container.clientWidth - card.offsetWidth;
  var maxY = container.clientHeight - card.offsetHeight;
  nx = Math.max(0, Math.min(nx, maxX));
  ny = Math.max(0, Math.min(ny, maxY));
  card.style.left = nx + 'px';
  card.style.top = ny + 'px';
  // 高亮重叠卡片
  highlightMatchingCards(card);
}

function onMouseUp(e) {
  if (!dragState.dragging) return;
  endDrag();
}

function onTouchEnd(e) {
  if (!dragState.dragging) return;
  endDrag();
}

function endDrag() {
  var card = dragState.card;
  card.classList.remove('dragging');
  clearHighlights();

  // 检测合成
  var target = findOverlappingCard(card);
  if (target) {
    tryCombine(card.dataset.card, target.dataset.card, card, target);
  } else {
    // 放回原位
    card.style.position = 'absolute';
    card.style.left = card.offsetLeft + 'px';
    card.style.top = card.offsetTop + 'px';
  }

  dragState.dragging = false;
  dragState.card = null;
}

function highlightMatchingCards(draggedCard) {
  clearHighlights();
  var draggedId = draggedCard.dataset.card;
  var allCards = document.querySelectorAll('.card');
  for (var i = 0; i < allCards.length; i++) {
    if (allCards[i] === draggedCard) continue;
    if (isOverlapping(draggedCard, allCards[i])) {
      if (canMatch(draggedId, allCards[i].dataset.card)) {
        allCards[i].classList.add('highlight');
      }
    }
  }
}

function clearHighlights() {
  var highlighted = document.querySelectorAll('.highlight');
  for (var i = 0; i < highlighted.length; i++) highlighted[i].classList.remove('highlight');
}

function isOverlapping(a, b) {
  var ar = a.getBoundingClientRect();
  var br = b.getBoundingClientRect();
  return !(ar.right < br.left || ar.left > br.right || ar.bottom < br.top || ar.top > br.bottom);
}

function findOverlappingCard(draggedCard) {
  var allCards = document.querySelectorAll('.card');
  for (var i = 0; i < allCards.length; i++) {
    if (allCards[i] === draggedCard) continue;
    if (isOverlapping(draggedCard, allCards[i]) && canMatch(draggedCard.dataset.card, allCards[i].dataset.card)) {
      return allCards[i];
    }
  }
  return null;
}

function canMatch(a, b) {
  if (a === b) {
    var def = CARD_DEFS[a];
    return def && !def.equipSlot;
  }
  // 查找配方
  for (var i = 0; i < RECIPES.length; i++) {
    var r = RECIPES[i];
    if (r.special && ((r.ingredients[0] === a && r.ingredients[1] === b) || (r.ingredients[0] === b && r.ingredients[1] === a))) {
      return true;
    }
    if ((r.ingredients[0] === a && r.ingredients[1] === b) || (r.ingredients[0] === b && r.ingredients[1] === a)) {
      return true;
    }
  }
  return false;
}

function tryCombine(a, b, cardA, cardB) {
  var recipe = findRecipe(a, b);
  if (!recipe) {
    // 尝试装备
    tryEquip(a, b);
    return;
  }
  // 消耗材料
  addCard(a, -1);
  addCard(b, -1);
  GS.cards[a] === 0 && delete GS.cards[a];
  GS.cards[b] === 0 && delete GS.cards[b];

  if (recipe.result) {
    addCard(recipe.result, 1);
    var def = CARD_DEFS[recipe.result];
    showToast('✨ 合成成功: ' + (def && def.icon) + ' ' + (def && def.title) + '!');
    if (def && def.type === 'tool') trackTask('pillsMade', 1);
    if (def && def.type === 'herb') trackTask('herbsEaten', 1);
  } else if (recipe.effect) {
    // 直接效果
    var parts = recipe.effect.split(',');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('+');
      if (kv.length === 2) {
        var k = kv[0].trim(), v = parseFloat(kv[1]);
        if (k === 'cultivation') {
          GS.cultivation += v;
          showToast('📈 ' + v + '修为!');
        }
        if (k === 'attack') { GS.attack += v; showToast('⚔️ 攻击 +' + v); }
        if (k === 'defense') { GS.defense += v; showToast('🛡️ 防御 +' + v); }
        if (k === 'dujieBonus') log('[道具] 渡劫加成 +' + v + '%');
      }
    }
    if (recipe.effect.includes('cultivation')) trackTask('dailyHerbsEaten', 1);
  }
  log('[合成] ' + recipe.desc);
  renderCards();
  updateUI();
}

function findRecipe(a, b) {
  for (var i = 0; i < RECIPES.length; i++) {
    var r = RECIPES[i];
    if (r.ingredients.length === 2) {
      if ((r.ingredients[0] === a && r.ingredients[1] === b) || (r.ingredients[0] === b && r.ingredients[1] === a)) {
        return r;
      }
    }
  }
  return null;
}

function tryEquip(a, b) {
  var defA = CARD_DEFS[a];
  var defB = CARD_DEFS[b];
  var equipSlot = (defA && defA.equipSlot) ? defA.equipSlot : ((defB && defB.equipSlot) ? defB.equipSlot : null);
  var cardToEquip = (defA && defA.equipSlot) ? a : b;

  if (equipSlot) {
    // 装备到对应槽位
    var oldEquip = GS.equipped[equipSlot];
    GS.equipped[equipSlot] = cardToEquip;
    addCard(a, -1);
    addCard(b, -1);
    recalculateStats();
    renderCards();
    updateUI();
    showToast('⚔️ 装备了 ' + (defA && defA.equipSlot ? defA.title : defB && defB.title) + '!');
    log('[装备] 装备到 ' + equipSlot);
  } else {
    // 尝试使用
    tryUse(a);
    tryUse(b);
    renderCards();
  }
}

function tryUse(cardId) {
  var count = GS.cards[cardId] || 0;
  if (count <= 0) return;
  var def = CARD_DEFS[cardId];
  if (!def) return;

  if (def.type === 'pill' || def.type === 'artifact' || def.type === 'mat') {
    if (def.effect) {
      var parts = def.effect.split(',');
      for (var i = 0; i < parts.length; i++) {
        var kv = parts[i].split('+');
        if (kv.length === 2) {
          var k = kv[0].trim(), v = parseFloat(kv[1]);
          if (k === 'cultivation') GS.cultivation += v;
          if (k === 'attack') GS.attack += v;
          if (k === 'defense') GS.defense += v;
        }
      }
      addCard(cardId, -1);
      log('[使用] ' + def.icon + ' ' + def.title);
      trackTask('herbsEaten', 1);
    }
  }
}

// ============================================================
// 卡片渲染
// ============================================================

function renderCards() {
  var container = $('game-container');
  var existing = {};
  var existingCards = container.querySelectorAll('.card');
  for (var i = 0; i < existingCards.length; i++) {
    existing[existingCards[i].dataset.card] = { el: existingCards[i], x: parseInt(existingCards[i].style.left) || 0, y: parseInt(existingCards[i].style.top) || 0 };
  }

  var cardTypes = Object.keys(GS.cards);
  if (cardTypes.length === 0) {
    container.innerHTML = '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#555;font-size:16px">点击任意位置开始</div>';
    return;
  }

  // 按类型分组排列
  var placed = {};
  var typesOrdered = ['cultivator', 'herb_gouqi', 'herb_jiucai', 'herb_renshen', 'herb_heshouwu', 'herb_lingzhi', 'herb_tiancai', 'herb_xiancao', 'herb_longxue', 'pill', 'pill_jingqi', 'pill_advanced', 'pill_jilian', 'pill_ultimate', 'pill_dujie', 'pill_feisheng', 'pill_feisheng2', 'pill_huifang', 'pill_jindan', 'weapon_tiejian', 'weapon_xuanjian', 'weapon_lingjian', 'weapon_xianjian', 'weapon_shenjian', 'weapon_dao', 'weapon_fadao', 'weapon_shendao', 'tech_cuyi', 'tech_fapao', 'tech_hujia', 'tech_xianjia', 'tech_longlin', 'ore_tiekuang', 'ore_xuantie', 'ore_jingjin', 'ore_tianshi', 'core_yaodan1', 'core_yaodan2', 'core_yaodan3', 'artifact', 'artifact_lingzhu', 'artifact_xianyu', 'artifact_shenyu', 'special_danlu', 'tool_lianqilu', 'tool_gaojidanlu', 'tool_gaojilianqilu', 'tool_tianlu', 'tool_shenlu', 'tool_juiling', 'tool_fumo', 'secret_map', 'secret_key', 'secret_stone', 'mat_lingshi', 'mat_lingshi_high', 'mat_longlin', 'mat_fengyu', 'item_dujiefu', 'item_yunqi', 'item_xianlu'];

  for (var t = 0; t < typesOrdered.length; t++) {
    var cardId = typesOrdered[t];
    if (!GS.cards[cardId] || GS.cards[cardId] <= 0) continue;
    var count = GS.cards[cardId];
    var def = CARD_DEFS[cardId] || { icon: '?', title: cardId, rarity: 'N' };
    var isEquipped = false;
    for (var slot in GS.equipped) {
      if (GS.equipped[slot] === cardId) isEquipped = true;
    }
    if (isEquipped) continue;

    var key = cardId + '_' + count;
    var el, x, y;
    if (existing[cardId]) {
      el = existing[cardId].el;
      x = existing[cardId].x;
      y = existing[cardId].y;
    } else {
      el = document.createElement('div');
      el.className = 'card';
      el.dataset.card = cardId;
      el.dataset.rarity = def.rarity;
      container.appendChild(el);
      x = Math.random() * (container.clientWidth - 72);
      y = Math.random() * (container.clientHeight - 90);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    }

    el.innerHTML = '<span class="card-icon">' + def.icon + '</span><span class="card-title">' + def.title + '</span>';
    if (count > 1) el.innerHTML += '<span class="card-count">' + count + '</span>';
    placed[cardId] = true;
  }

  // 移除多余的卡片元素
  for (var ec in existing) {
    if (!placed[ec]) existing[ec].el.remove();
  }
}

function syncCardPositions() {
  if (!dragState.dragging) renderCards();
}

// ============================================================
// 特效
// ============================================================

function showCultivationEffect(amount, isCrit) {
  var el = document.createElement('div');
  el.className = 'cultivation-effect';
  el.textContent = '+' + amount + (isCrit ? ' ⚡' : '');
  el.style.left = (Math.random() * 60 + 20) + '%';
  el.style.top = (Math.random() * 40 + 30) + '%';
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 1000);
}

function showBreakthroughEffect(oldRealm, newRealm) {
  var el = document.createElement('div');
  el.className = 'breakthrough-effect';
  el.innerHTML = '<div class="breakthrough-text">境界突破！</div><div class="breakthrough-realm">' + newRealm + '</div>';
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 3000);
}

function showToast(text, type) {
  var el = document.createElement('div');
  el.className = 'save-toast' + (type ? ' ' + type : '');
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 2000);
}

function log(msg) {
  var el = $('debug-log');
  if (!el) return;
  var time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  el.innerHTML = '<div>[' + time + '] ' + msg + '</div>' + el.innerHTML;
  if (el.children.length > 30) el.removeChild(el.lastChild);
}

// ============================================================
// Debug
// ============================================================

window.debugGS = function() { console.log(GS); };
window.debugCards = function() { console.log(GS.cards); };
window.addCultivation = function(n) { GS.cultivation += n; updateUI(); };
window.maxStats = function() { GS.cultivation = getRealmMaxCultivation() + 1; updateUI(); };
window.resetGame = function() { if (confirm('确定重置？')) { localStorage.removeItem('stackingCultivation_v20'); location.reload(); } };

// ============================================================
// 启动
// ============================================================

init();
