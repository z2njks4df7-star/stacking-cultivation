// ============================================================
// 游戏数据 - 堆叠修仙 v20.0
// ============================================================

// 境界系统
export var REALMS = [
  { name: '练气期', maxCultivation: 100 },
  { name: '筑基期', maxCultivation: 300 },
  { name: '金丹期', maxCultivation: 800 },
  { name: '元婴期', maxCultivation: 2000 },
  { name: '化神期', maxCultivation: 5000 },
  { name: '渡劫期', maxCultivation: 10000 },
  { name: '大乘期', maxCultivation: 20000 },
  { name: '飞升期', maxCultivation: 50000 },
];

// 卡牌/物品定义
export var CARD_DEFS = {
  // 基础药材
  herb_gouqi: { icon: '🌿', title: '枸杞', type: 'herb', desc: '修炼材料', rarity: 'N', stackable: true },
  herb_jiucai: { icon: '🌱', title: '韭菜', type: 'herb', desc: '修炼材料', rarity: 'N', stackable: true },
  herb_renshen: { icon: '🌲', title: '人参', type: 'herb', desc: '修炼材料', rarity: 'R', stackable: true },
  herb_heshouwu: { icon: '🍃', title: '何首乌', type: 'herb', desc: '修炼材料', rarity: 'R', stackable: true },
  herb_lingzhi: { icon: '🍄', title: '灵芝', type: 'herb', desc: '修炼材料', rarity: 'SR', stackable: true },
  herb_tiancai: { icon: '🌳', title: '天材', type: 'herb', desc: '高级材料', rarity: 'SR', stackable: true },
  herb_xiancao: { icon: '✨', title: '仙草', type: 'herb', desc: '稀有材料', rarity: 'SSR', stackable: true },
  herb_longxue: { icon: '🔥', title: '龙血草', type: 'herb', desc: '传说材料', rarity: 'SSR', stackable: true },

  // 矿石
  ore_tiekuang: { icon: '�ite', title: '铁矿', type: 'ore', desc: '炼器材料', rarity: 'N', stackable: true },
  ore_xuantie: { icon: '�ite', title: '玄铁', type: 'ore', desc: '炼器材料', rarity: 'R', stackable: true },
  ore_jingjin: { icon: '💎', title: '精金', type: 'ore', desc: '高级材料', rarity: 'SR', stackable: true },
  ore_tianshi: { icon: '🌟', title: '天石', type: 'ore', desc: '稀有材料', rarity: 'SSR', stackable: true },

  // 武器
  weapon_tiejian: { icon: '🗡️', title: '铁剑', type: 'weapon', desc: '攻击+10', rarity: 'N', equipSlot: 'weapon', equipStats: { attack: 10 }, stackable: false },
  weapon_xuanjian: { icon: '⚔️', title: '玄铁剑', type: 'weapon', desc: '攻击+25', rarity: 'R', equipSlot: 'weapon', equipStats: { attack: 25 }, stackable: false },
  weapon_lingjian: { icon: '剑', title: '灵剑', type: 'weapon', desc: '攻击+40', rarity: 'SR', equipSlot: 'weapon', equipStats: { attack: 40 }, stackable: false },
  weapon_xianjian: { icon: '仙剑', title: '仙剑', type: 'weapon', desc: '攻击+80', rarity: 'SSR', equipSlot: 'weapon', equipStats: { attack: 80 }, stackable: false },
  weapon_shenjian: { icon: '⚡', title: '神剑', type: 'weapon', desc: '攻击+150', rarity: 'SSR', equipSlot: 'weapon', equipStats: { attack: 150 }, stackable: false },

  // 防具
  tech_cuyi: { icon: '👕', title: '粗衣', type: 'armor', desc: '防御+5', rarity: 'N', equipSlot: 'armor', equipStats: { defense: 5 }, stackable: false },
  tech_fapao: { icon: '法袍', title: '法袍', type: 'armor', desc: '防御+15', rarity: 'R', equipSlot: 'armor', equipStats: { defense: 15 }, stackable: false },
  tech_hujia: { icon: '🛡️', title: '护甲', type: 'armor', desc: '防御+25', rarity: 'R', equipSlot: 'armor', equipStats: { defense: 25 }, stackable: false },
  tech_xianjia: { icon: '甲', title: '仙甲', type: 'armor', desc: '防御+40', rarity: 'SR', equipSlot: 'armor', equipStats: { defense: 40 }, stackable: false },
  tech_longlin: { icon: '🐉', title: '龙鳞甲', type: 'armor', desc: '防御+60', rarity: 'SSR', equipSlot: 'armor', equipStats: { defense: 60 }, stackable: false },

  // 丹药
  pill: { icon: '💊', title: '丹药', type: 'pill', desc: '修为+100', rarity: 'R', stackable: true },
  pill_jingqi: { icon: '💊', title: '精气丹', type: 'pill', desc: '修为+150', rarity: 'R', stackable: true },
  pill_advanced: { icon: '💊', title: '高级丹药', type: 'pill', desc: '修为+300', rarity: 'SR', stackable: true },
  pill_jilian: { icon: '💊', title: '聚力丹', type: 'pill', desc: '修为+500', rarity: 'SR', stackable: true },
  pill_ultimate: { icon: '💊', title: '极致丹药', type: 'pill', desc: '修为+800', rarity: 'SSR', stackable: true },
  pill_dujie: { icon: '💊', title: '渡劫丹', type: 'pill', desc: '修为+500，渡劫+20%', rarity: 'SSR', stackable: true, special: 'dujieBonus+20' },
  pill_feisheng: { icon: '🌈', title: '飞升丹', type: 'pill', desc: '修为+2000', rarity: 'SSR', stackable: true },
  pill_feisheng2: { icon: '🌈', title: '飞升秘药', type: 'pill', desc: '修为+3000', rarity: 'SSR', stackable: true },

  // 妖丹
  core_yaodan1: { icon: '💎', title: '一阶妖丹', type: 'core', desc: '炼器材料', rarity: 'R', stackable: true },
  core_yaodan2: { icon: '💎', title: '二阶妖丹', type: 'core', desc: '高级材料', rarity: 'SR', stackable: true },
  core_yaodan3: { icon: '💎', title: '三阶妖丹', type: 'core', desc: '稀有材料', rarity: 'SSR', stackable: true },

  // 法器
  artifact: { icon: '🔮', title: '法器', type: 'artifact', desc: '修为+500', rarity: 'R', stackable: true },
  artifact_lingzhu: { icon: '🔮', title: '灵珠', type: 'artifact', desc: '修为+300', rarity: 'R', stackable: true },
  artifact_xianyu: { icon: '💠', title: '仙玉', type: 'artifact', desc: '修为+600', rarity: 'SR', stackable: true },
  artifact_shenyu: { icon: '💫', title: '神玉', type: 'artifact', desc: '修为+1000', rarity: 'SSR', stackable: true },

  // 工具
  special_danlu: { icon: '🔥', title: '丹炉', type: 'tool', desc: '炼丹基础', rarity: 'N', stackable: false },
  tool_lianqilu: { icon: '🔥', title: '炼器炉', type: 'tool', desc: '炼器基础', rarity: 'N', stackable: false },
  tool_gaojidanlu: { icon: '🔥', title: '高级丹炉', type: 'tool', desc: '高级炼丹', rarity: 'R', stackable: false },
  tool_gaojilianqilu: { icon: '🔥', title: '高级炼器炉', type: 'tool', desc: '高级炼器', rarity: 'R', stackable: false },
  tool_tianlu: { icon: '🔥', title: '天火炉', type: 'tool', desc: '稀有炼丹', rarity: 'SR', stackable: false },
  tool_shenlu: { icon: '🔥', title: '神炉', type: 'tool', desc: '传说炼丹', rarity: 'SSR', stackable: false },
  tool_juiling: { icon: '🏺', title: '聚灵鼎', type: 'tool', desc: '聚灵合成', rarity: 'SR', stackable: false },

  // 修仙者
  cultivator: { icon: '🧘', title: '修仙者', type: 'cultivator', desc: '点击修炼', rarity: 'N', stackable: false },

  // 特殊物品
  secret_map: { icon: '🗺️', title: '藏宝图', type: 'special', desc: '可合成钥匙', rarity: 'R', stackable: true },
  secret_key: { icon: '🔑', title: '秘境钥匙', type: 'special', desc: '开启秘境', rarity: 'R', stackable: true },
  secret_stone: { icon: '💠', title: '秘境石', type: 'special', desc: '修为+1000', rarity: 'SR', stackable: true },

  // 高级合成材料
  mat_lingshi: { icon: '💰', title: '灵石', type: 'mat', desc: '吸收+150修为', rarity: 'R', stackable: true },
  mat_lingshi_high: { icon: '💎', title: '高阶灵石', type: 'mat', desc: '吸收+400修为', rarity: 'SR', stackable: true },
  mat_longlin: { icon: '🐉', title: '龙鳞', type: 'mat', desc: '攻击+30', rarity: 'SR', stackable: true },
  mat_fengyu: { icon: '🦅', title: '凤羽', type: 'mat', desc: '防御+25', rarity: 'SR', stackable: true },
  tool_fumo: { icon: '印', title: '伏魔印', type: 'tool', desc: '攻击+50，渡劫+10%', rarity: 'SR', stackable: false },
  item_dujiefu: { icon: '符', title: '渡劫符', type: 'item', desc: '渡劫+15%', rarity: 'SR', stackable: true },
  item_yunqi: { icon: '☁️', title: '幸运符', type: 'item', desc: '探索奖励+50%', rarity: 'SR', stackable: true },
  item_xianlu: { icon: '💧', title: '仙露', type: 'item', desc: '修为+350', rarity: 'SR', stackable: true },
  weapon_dao: { icon: '刀', title: '灵刀', type: 'weapon', desc: '攻击+20', rarity: 'R', equipSlot: 'weapon', equipStats: { attack: 20 }, stackable: false },
  weapon_fadao: { icon: '刀', title: '法刀', type: 'weapon', desc: '攻击+55', rarity: 'SR', equipSlot: 'weapon', equipStats: { attack: 55 }, stackable: false },
  weapon_shendao: { icon: '⚡', title: '神刀', type: 'weapon', desc: '攻击+120', rarity: 'SSR', equipSlot: 'weapon', equipStats: { attack: 120 }, stackable: false },
  pill_huifang: { icon: '💊', title: '回方丹', type: 'pill', desc: '修为+400', rarity: 'SR', stackable: true },
  pill_jindan: { icon: '💊', title: '金丹', type: 'pill', desc: '修为+1500', rarity: 'SSR', stackable: true },
};

export var ALL_CARD_TYPES = Object.keys(CARD_DEFS);

// 装备槽位
export var EQUIP_SLOTS = ['weapon', 'armor', 'accessory'];

// 装备套装
export var EQUIP_SETS = {
  iron_wall: { name: '铁壁套装', pieces: 2, bonus: { defense: 20, desc: '防御+20' } },
  immortal: { name: '仙人套装', pieces: 2, bonus: { attack: 30, defense: 15, desc: '攻击+30 防御+15' } },
  dragon: { name: '龙威套装', pieces: 3, bonus: { attack: 50, defense: 30, critRate: 0.1, desc: '攻击+50 防御+30 暴击率+10%' } },
  phoenix: { name: '凤凰套装', pieces: 2, bonus: { attack: 40, hpRegen: 50, desc: '攻击+40 每回合回复50HP' } },
  thunder: { name: '雷神套装', pieces: 2, bonus: { attack: 60, critDmg: 0.3, desc: '攻击+60 暴击伤害+30%' } },
  celestial: { name: '天仙套装', pieces: 3, bonus: { attack: 80, defense: 40, dodge: 0.15, desc: '攻击+80 防御+40 闪避率+15%' } },
  shadow: { name: '暗影套装', pieces: 2, bonus: { critRate: 0.2, critDmg: 0.5, desc: '暴击率+20% 暴击伤害+50%' } },
  void_set: { name: '虚空套装', pieces: 2, bonus: { attack: 70, dodge: 0.25, desc: '攻击+70 闪避率+25%' }, special: '虚空闪避：闪避成功时30%概率反击' },
  bloodthirst: { name: '嗜血套装', pieces: 2, bonus: { attack: 50, lifesteal: 0.15, desc: '攻击+50 生命偷取+15%' }, special: '嗜血：攻击回复15%伤害值的HP' },
  frost: { name: '冰霜套装', pieces: 3, bonus: { defense: 60, slow: 0.2, desc: '防御+60 攻速减速+20%' }, special: '冰霜领域：Boss攻击速度降低20%' },
  divine: { name: '神圣套装', pieces: 3, bonus: { attack: 100, defense: 50, hpRegen: 100, desc: '攻击+100 防御+50 每回合回复100HP' }, special: '神圣庇护：受到致命伤害时20%概率保留1HP' },
};

// 强化加成表
export var ENHANCE_RATES = [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.55, 0.7, 0.9];
export var ENHANCE_COSTS = [0, 50, 120, 250, 500, 1000, 2000, 4000, 8000, 16000];

// 合成配方
export var RECIPES = [
  // 基础合成 - 药材 + 修仙者
  { ingredients: ['cultivator', 'herb_gouqi'], result: null, effect: 'cultivation+20', desc: '枸杞修炼，修为+20' },
  { ingredients: ['cultivator', 'herb_jiucai'], result: null, effect: 'cultivation+15', desc: '韭菜修炼，修为+15' },
  { ingredients: ['cultivator', 'herb_renshen'], result: null, effect: 'cultivation+50', desc: '人参修炼，修为+50' },
  { ingredients: ['cultivator', 'herb_heshouwu'], result: null, effect: 'cultivation+60', desc: '何首乌修炼，修为+60' },
  { ingredients: ['cultivator', 'herb_lingzhi'], result: null, effect: 'cultivation+80', desc: '灵芝修炼，修为+80' },
  { ingredients: ['cultivator', 'herb_tiancai'], result: null, effect: 'cultivation+120', desc: '天材修炼，修为+120' },
  { ingredients: ['cultivator', 'herb_xiancao'], result: null, effect: 'cultivation+200', desc: '仙草修炼，修为+200' },
  { ingredients: ['cultivator', 'herb_longxue'], result: null, effect: 'cultivation+300', desc: '龙血草修炼，修为+300' },

  // 炼丹 - 药材 + 丹炉
  { ingredients: ['herb_gouqi', 'special_danlu'], result: 'pill', effect: null, desc: '炼制丹药' },
  { ingredients: ['herb_renshen', 'special_danlu'], result: 'pill_jingqi', effect: null, desc: '炼制精气丹' },
  { ingredients: ['herb_heshouwu', 'special_danlu'], result: 'pill_advanced', effect: null, desc: '炼制高级丹药' },
  { ingredients: ['herb_lingzhi', 'tool_gaojidanlu'], result: 'pill_ultimate', effect: null, desc: '炼制极致丹药' },
  { ingredients: ['herb_tiancai', 'tool_gaojidanlu'], result: 'pill_jilian', effect: null, desc: '炼制聚力丹' },
  { ingredients: ['herb_xiancao', 'tool_tianlu'], result: 'pill_dujie', effect: null, desc: '炼制渡劫丹' },
  { ingredients: ['herb_longxue', 'tool_tianlu'], result: 'pill_feisheng', effect: null, desc: '炼制飞升丹' },
  { ingredients: ['core_yaodan1', 'special_danlu'], result: 'pill_advanced', effect: null, desc: '妖丹炼制高级丹药' },
  { ingredients: ['core_yaodan2', 'tool_gaojidanlu'], result: 'pill_ultimate', effect: null, desc: '炼制极致丹药' },
  { ingredients: ['core_yaodan3', 'tool_shenlu'], result: 'pill_feisheng', effect: null, desc: '炼制飞升丹' },

  // 丹药服用
  { ingredients: ['cultivator', 'pill'], result: null, effect: 'cultivation+100', desc: '服用丹药，修为+100' },
  { ingredients: ['cultivator', 'pill_jingqi'], result: null, effect: 'cultivation+150', desc: '服用精气丹，修为+150' },
  { ingredients: ['cultivator', 'pill_advanced'], result: null, effect: 'cultivation+300', desc: '服用高级丹药，修为+300' },
  { ingredients: ['cultivator', 'pill_jilian'], result: null, effect: 'cultivation+500', desc: '服用聚力丹，修为+500' },
  { ingredients: ['cultivator', 'pill_ultimate'], result: null, effect: 'cultivation+800', desc: '服用极致丹药，修为+800' },
  { ingredients: ['cultivator', 'pill_dujie'], result: null, effect: 'cultivation+500,dujieBonus+20', desc: '服用渡劫丹，修为+500，渡劫+20%' },
  { ingredients: ['cultivator', 'pill_feisheng'], result: null, effect: 'cultivation+2000', desc: '服用飞升丹，修为+2000' },
  { ingredients: ['cultivator', 'pill_feisheng2'], result: null, effect: 'cultivation+3000', desc: '服用飞升秘药，修为+3000' },

  // 炼器 - 矿石 + 炼器炉
  { ingredients: ['ore_tiekuang', 'tool_lianqilu'], result: 'weapon_tiejian', effect: null, desc: '炼制铁剑' },
  { ingredients: ['ore_xuantie', 'tool_lianqilu'], result: 'weapon_xuanjian', effect: null, desc: '炼制玄铁剑' },
  { ingredients: ['ore_jingjin', 'tool_lianqilu'], result: 'weapon_lingjian', effect: null, desc: '炼制灵剑' },
  { ingredients: ['ore_tianshi', 'tool_shenlu'], result: 'weapon_xianjian', effect: null, desc: '炼制仙剑' },
  { ingredients: ['ore_tianshi', 'core_yaodan3', 'tool_shenlu'], result: 'weapon_shenjian', effect: null, desc: '炼制神剑！' },
  { ingredients: ['ore_xuantie', 'tool_lianqilu'], result: 'tech_hujia', effect: null, desc: '炼制护甲' },
  { ingredients: ['ore_jingjin', 'tool_lianqilu'], result: 'tech_xianjia', effect: null, desc: '炼制仙甲' },
  { ingredients: ['ore_tianshi', 'tool_shenlu'], result: 'tech_longlin', effect: null, desc: '炼制龙鳞甲' },

  // 装备使用
  { ingredients: ['cultivator', 'tech_cuyi'], result: null, effect: 'defense+5', desc: '穿上粗衣，防御+5' },
  { ingredients: ['cultivator', 'tech_fapao'], result: null, effect: 'defense+15', desc: '穿上法袍，防御+15' },
  { ingredients: ['cultivator', 'tech_hujia'], result: null, effect: 'defense+25', desc: '穿上护甲，防御+25' },
  { ingredients: ['cultivator', 'tech_xianjia'], result: null, effect: 'defense+40', desc: '穿上仙甲，防御+40' },
  { ingredients: ['cultivator', 'tech_longlin'], result: null, effect: 'defense+60', desc: '穿上龙鳞甲，防御+60' },
  { ingredients: ['cultivator', 'weapon_tiejian'], result: null, effect: 'attack+10', desc: '装备铁剑，攻击+10' },
  { ingredients: ['cultivator', 'weapon_xuanjian'], result: null, effect: 'attack+25', desc: '装备玄铁剑，攻击+25' },
  { ingredients: ['cultivator', 'weapon_lingjian'], result: null, effect: 'attack+40', desc: '装备灵剑，攻击+40' },
  { ingredients: ['cultivator', 'weapon_xianjian'], result: null, effect: 'attack+80', desc: '装备仙剑，攻击+80' },
  { ingredients: ['cultivator', 'weapon_shenjian'], result: null, effect: 'attack+150', desc: '装备神剑，攻击+150' },

  // 法器使用
  { ingredients: ['cultivator', 'artifact'], result: null, effect: 'cultivation+500', desc: '使用法器，修为+500' },
  { ingredients: ['cultivator', 'artifact_lingzhu'], result: null, effect: 'cultivation+300', desc: '使用灵珠，修为+300' },
  { ingredients: ['cultivator', 'artifact_xianyu'], result: null, effect: 'cultivation+600', desc: '使用仙玉，修为+600' },
  { ingredients: ['cultivator', 'artifact_shenyu'], result: null, effect: 'cultivation+1000', desc: '使用神玉，修为+1000' },

  // 灵石使用
  { ingredients: ['cultivator', 'mat_lingshi'], result: null, effect: 'cultivation+150', desc: '吸收灵石，修为+150' },
  { ingredients: ['cultivator', 'mat_lingshi_high'], result: null, effect: 'cultivation+400', desc: '吸收高阶灵石，修为+400' },
  { ingredients: ['cultivator', 'mat_longlin'], result: null, effect: 'attack+30', desc: '吸收龙鳞，攻击+30' },
  { ingredients: ['cultivator', 'mat_fengyu'], result: null, effect: 'defense+25', desc: '吸收凤羽，防御+25' },

  // 高级合成
  { ingredients: ['secret_map', 'secret_map'], result: 'secret_key', effect: null, desc: '两张藏宝图合成秘境钥匙', special: true },
  { ingredients: ['cultivator', 'pill_huifang'], result: null, effect: 'cultivation+400', desc: '服用回方丹，修为+400' },
  { ingredients: ['cultivator', 'pill_jindan'], result: null, effect: 'cultivation+1500', desc: '服用金丹，修为+1500' },
  { ingredients: ['core_yaodan3', 'mat_lingshi_high'], result: 'tool_fumo', effect: null, desc: '炼制伏魔印', special: true },
  { ingredients: ['cultivator', 'tool_fumo'], result: null, effect: 'attack+50,dujieBonus+10', desc: '使用伏魔印，攻击+50，渡劫+10%' },
  { ingredients: ['cultivator', 'item_dujiefu'], result: null, effect: 'dujieBonus+15', desc: '使用渡劫符，渡劫+15%' },
  { ingredients: ['cultivator', 'item_xianlu'], result: null, effect: 'cultivation+350', desc: '服用仙露，修为+350' },
];

// Boss列表
export var BOSS_LIST = [
  { id: 'boss_spirit', name: '🐗 灵兽', desc: '守护灵草的猛兽', hp: 600, attack: 25, defense: 8, rewardCultivation: 250, minRealm: 0,
    skills: [{ name: '虎啸', damage: 35 }, { name: '裂爪', damage: 55 }] },
  { id: 'boss_demon', name: '👹 域外天魔', desc: '侵入修仙界的恶魔', hp: 1500, attack: 60, defense: 20, rewardCultivation: 600, minRealm: 1,
    skills: [{ name: '魔焰', damage: 80 }, { name: '天魔爪', damage: 120 }] },
  { id: 'boss_dragon', name: '🐉 深海蛟龙', desc: '守护海底灵脉的蛟龙', hp: 4000, attack: 140, defense: 50, rewardCultivation: 1500, minRealm: 2,
    skills: [{ name: '龙息', damage: 180 }, { name: '水龙波', damage: 240 }, { name: '深渊吞噬', damage: 350 }] },
  { id: 'boss_phoenix', name: '🦅 不死凤凰', desc: '涅槃重生的神鸟', hp: 10000, attack: 350, defense: 100, rewardCultivation: 4000, minRealm: 3,
    skills: [{ name: '涅槃之火', damage: 400 }, { name: '凤凰冲击', damage: 520 }, { name: '浴火重生', heal: 600 }] },
  { id: 'boss_ancient', name: '👻 太古仙尊', desc: '远古时代的仙尊残魂', hp: 25000, attack: 900, defense: 250, rewardCultivation: 10000, minRealm: 4,
    phases: [{ atHP: 25000, name: '残魂初现' }, { atHP: 15000, name: '剑意凌云' }, { atHP: 8000, name: '仙尊真身' }, { atHP: 3000, name: '灭世一击' }],
    skills: [{ name: '仙术·剑雨', damage: 1000 }, { name: '仙术·毁灭', damage: 1800 }, { name: '万剑归宗', damage: 3000, phase: 2 }, { name: '仙尊降临', damage: 5000, phase: 3 }] },
  { id: 'boss_tianjie', name: '⚡ 天劫化身', desc: '天劫的实体化身', hp: 50000, attack: 2000, defense: 420, rewardCultivation: 22000, minRealm: 5,
    phases: [{ atHP: 50000, name: '劫云初聚' }, { atHP: 32000, name: '雷霆万钧' }, { atHP: 18000, name: '天怒人怨' }, { atHP: 8000, name: '毁灭天罚' }],
    skills: [{ name: '雷劫', damage: 2500 }, { name: '天罚', damage: 2800 }, { name: '九天玄雷', damage: 6000, phase: 2 }, { name: '灭世雷劫', damage: 9500, phase: 3 }] },
  { id: 'boss_dragon_true', name: '🐲 真龙', desc: '龙族至尊，万灵之祖', hp: 70000, attack: 2800, defense: 580, rewardCultivation: 35000, minRealm: 6,
    phases: [{ atHP: 70000, name: '龙威' }, { atHP: 50000, name: '怒火' }, { atHP: 30000, name: '龙魂觉醒' }, { atHP: 15000, name: '龙之终焉' }],
    skills: [{ name: '龙吟', damage: 1800 }, { name: '龙爪撕裂', damage: 2600 }, { name: '龙息', damage: 3500 }, { name: '万龙归宗', damage: 9000, phase: 3 }] },
];

// 宗门列表
export var SECT_LIST = [
  { id: 'sect_1', name: '🌊 碧波宗', desc: '以水利法术著称', level: 5, bonus: '修炼速度+10%', needContribution: 0 },
  { id: 'sect_2', name: '🔥 烈焰门', desc: '火系法术强悍', level: 4, bonus: '攻击力+15%', needContribution: 50 },
  { id: 'sect_3', name: '⚡ 雷霆阁', desc: '雷系法术一击必杀', level: 6, bonus: '暴击率+20%', needContribution: 100 },
  { id: 'sect_4', name: '🌿 百草谷', desc: '炼丹术冠绝天下', level: 3, bonus: '炼丹成功率+25%', needContribution: 30 },
  { id: 'sect_5', name: '⚔️ 剑道峰', desc: '剑修聚集地', level: 7, bonus: '剑法伤害+30%', needContribution: 200 },
];

// 任务系统
export var TASKS = {
  main: [
    { id: 'first_cultivate', name: '🌱 初入修仙', desc: '第一次点击修炼', target: 1, stat: 'firstCultivate', reward: { cultivation: 10 }, rewardDesc: '修为+10' },
    { id: 'eat_herbs', name: '🌿 灵草入门', desc: '服用3次药材', target: 3, stat: 'herbsEaten', reward: { cultivation: 50 }, rewardDesc: '修为+50' },
    { id: 'make_pill', name: '💊 丹道初探', desc: '炼制第一颗丹药', target: 1, stat: 'pillsMade', reward: { cultivation: 100 }, rewardDesc: '修为+100' },
    { id: 'breakthrough_1', name: '🏔️ 筑基之路', desc: '突破到筑基期', target: 1, stat: 'realmIndex', targetValue: 1, reward: { cultivation: 200 }, rewardDesc: '修为+200' },
    { id: 'breakthrough_2', name: '💎 金丹大道', desc: '突破到金丹期', target: 1, stat: 'realmIndex', targetValue: 2, reward: { cultivation: 500 }, rewardDesc: '修为+500' },
  ],
  daily: [
    { id: 'daily_cultivate', name: '🧘 每日修炼', desc: '修为达到50', target: 50, stat: 'dailyCultivation', reward: { cultivation: 30 }, rewardDesc: '修为+30' },
    { id: 'daily_herbs', name: '🌿 灵草采集', desc: '服用药材3次', target: 3, stat: 'dailyHerbsEaten', reward: { cultivation: 20 }, rewardDesc: '修为+20' },
    { id: 'daily_pill', name: '💊 丹药服用', desc: '服用丹药1颗', target: 1, stat: 'dailyPillsEaten', reward: { cultivation: 100 }, rewardDesc: '修为+100' },
  ]
};

// 抽卡配置
export var GACHA_COST_SINGLE = 100;
export var GACHA_COST_TEN = 900;

export var GACHA_RATES = {
  SSR: { rate: 0.02, cards: ['weapon_shenjian', 'pill_feisheng', 'artifact_shenyu', 'herb_xiancao', 'herb_longxue'] },
  SR: { rate: 0.10, cards: ['pill_advanced', 'herb_lingzhi', 'weapon_lingjian', 'artifact_xianyu', 'herb_tiancai', 'core_yaodan2'] },
  R: { rate: 0.38, cards: ['pill', 'herb_renshen', 'herb_heshouwu', 'weapon_xuanjian', 'pill_jingqi', 'core_yaodan1', 'ore_jingjin', 'secret_key'] },
  N: { rate: 0.50, cards: ['herb_gouqi', 'herb_jiucai', 'cultivator', 'weapon_tiejian', 'ore_tiekuang', 'tech_cuyi'] },
};
