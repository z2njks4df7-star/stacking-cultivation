# 堆叠修仙 - Claude Code 项目指南

## 项目概览

- **名称**：堆叠修仙 - HTML5 修仙主题卡牌游戏
- **技术栈**：Vite + 原生 JavaScript (ES Modules)
- **位置**：`/Users/a666/WorkBuddy/20260501173054/stacking-cultivation/`
- **在线地址**：https://z2njks4df7-star.github.io/stacking-cultivation/
- **构建产物**：~162KB JS (gzip ~46KB)

---

## 常用命令

```bash
npm run dev      # 开发服务器 localhost:5174
npm run build    # 生产构建 → dist/
npm run preview   # 预览构建产物
```

---

## 项目结构

```
src/
  main.js        # 主游戏逻辑 (~4200行)，包含所有游戏函数
  data.js        # 游戏数据（REALMS/RECIPES/CARD_DEFS/EQUIP_SETS/ACHIEVEMENTS 等）
  style.css      # 样式
index.html       # 入口 HTML
vite.config.js   # Vite 配置
dist/            # 构建产物（部署到 GitHub Pages）
```

---

## 关键文件说明

### main.js

**必须 export 的函数**（ES Module 规则，防止 Rollup tree-shaking 误删）：
- 所有 onclick 处理函数必须 export 并添加到 `window`
- `getActiveSetBonuses()` 必须 export（ACHIEVEMENTS 引用）
- 游戏数据变量不要用 `var xxx = ...`，要用 `export var xxx = ...`

**已导出到 window 的函数**（HTML onclick 可调用）：
- `gacha()`, `gachaTen()`, `toggleAutoCultivate()`
- `openBossPanel()`, `openSectPanel()`, `openEquipmentPanel()`
- `closeBossPanel()`, `closeSectPanel()`
- `canAscend()`, `doAscension()`, `useAscensionPoint()`
- 等 28+ 个函数

**重要变量**：
- `GameState` — 游戏状态对象（修为/境界/灵石/背包/装备/成就等）
- `UI_THROTTLE = 500` — updateUI 节流时间(ms)

### data.js

**导出的数据**（必须用 import 引用，不要直接用 var 定义）：
```js
import { REALMS, RECIPES, TASKS, BOSS_LIST, SECT_LIST,
         EQUIP_SLOTS, EQUIP_SETS, ENHANCE_COSTS,
         CARD_DEFS, ALL_CARD_TYPES, ACHIEVEMENTS }
  from './data.js';
```

**循环 import 注意**：
- data.js 顶部从 main.js 导入 `getActiveSetBonuses`
- main.js 从 data.js 导入所有数据
- ES module 循环导入在运行时有效，无需特殊处理

---

## 游戏系统

| 系统 | 核心文件位置 | 说明 |
|------|------------|------|
| 修炼循环 | main.js `cultivate()` | 主循环，每帧增加修为 |
| 境界突破 | main.js `tryBreakthrough()` | realmIndex 0-7 |
| 飞升系统 | main.js `doAscension()` | 渡劫期后可飞升，重置但保留加成 |
| 卡牌系统 | data.js `CARD_DEFS` | 79+ 类型，通过战斗/抽卡获取 |
| 装备系统 | data.js `EQUIP_SETS` | 10+ 套装，攻防加成 |
| 宗门系统 | main.js `sectWar()` | 加入宗门，参与宗门战 |
| Boss 战 | main.js `bossBattle()` | 定期出现，击败获灵石 |
| 抽卡系统 | main.js `gachaTen()` | 十连抽，概率保底 |
| 成就系统 | data.js `ACHIEVEMENTS` | 92 个成就，解锁奖励 |

---

## 开发注意事项

### ⚠️ Rollup Tree-Shaking Bug

Rollup 会误删"纯数据"变量定义（如 `var CARD_DEFS = {...}`），即使代码中有引用。

**解决**：所有游戏数据必须 `export var xxx = ...`，不要用普通 `var`。

### ⚠️ debugLog 概率过滤

`debugLog()` 函数（L1841）有 `if(performance.now()%10>0.5) return;`，约 90% 的调用被静默丢弃。

**调试时**：直接用 `console.log()` 而不是 `debugLog()`。

### ⚠️ ES Module Live Binding

`window.xxx = func` 覆盖全局引用对模块内部调用链无效。setInterval/setTimeout 引用的函数必须在源码中修改，不能运行时 patch。

### ⚠️ HTML onclick 和 ES Module

HTML `onclick="func()"` 只能调用 `window` 上的函数。ES Module 内部函数必须显式 `window.funcName = funcName`。

---

## GitHub Pages 部署

```bash
# 只推送构建产物，不暴露源码
cd dist
git init
git add .
git commit -m "Deploy"
gh repo create --push --public z2njks4df7-star/stacking-cultivation
# 然后在 GitHub 仓库设置中启用 Pages (main branch, root)
```

---

## 待办（按优先级）

| 优先级 | 内容 | 风险 |
|--------|------|------|
| P2 | 魔法数字提取 | 低收益 |
| P2 | JSDoc 补全 | 低风险，工程量大 |
| P2 | 新功能：随机事件/社交PK/赛季 | 需用户决策 |

---

## 已知状态

- ✅ 构建正常
- ✅ 飞升系统已实现并验证
- ✅ 0 个 debug panel 错误
- ✅ 文件拆分完成（main.js ~4200行）
- ✅ Dev server：localhost:5174
