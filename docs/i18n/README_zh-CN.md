<h1 align="center">Pixel Pets CLI</h1>

<p align="center">
  <strong>终端宠物收集游戏，召唤并收藏你的像素伙伴</strong>
</p>

<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README_zh-TW.md">繁體中文</a> |
  <strong>简体中文</strong> |
  <a href="README_ja.md">日本語</a> |
  <a href="README_ko.md">한국어</a>
</p>

---

## 快速开始

```bash
# 直接运行
npx pixel-pets-cli

# 单抽
npx pixel-pets-cli pull

# 10 连抽，每一只都会逐张揭示
npx pixel-pets-cli pull -n 10

# 使用固定 seed 的 50 连抽，可复现相同序列
npx pixel-pets-cli pull gallery-seed -n 50

# 100 连抽，仍会逐只显示完整卡片
npx pixel-pets-cli pull -n 100
```

---

## 安装

```bash
npm install -g pixel-pets-cli

pixel-pets-cli pull
pixel-pets pull
ppets pull
```

---

## 命令

| 命令 | 说明 |
|------|------|
| `pull [seed]` | 单抽或使用固定 seed 召唤 |
| `pull -n <count>` | 多抽，逐只显示完整结果 |
| `pull <seed> -n <count>` | 使用可复现 seed 序列进行多抽 |
| `list` | 显示收藏列表 |
| `show <name>` | 显示完整宠物卡片 |
| `animate <name>` | 播放宠物动画 |
| `stats` | 显示收藏统计 |
| `rates` | 显示抽卡概率 |
| `clear --confirm` | 清空收藏 |
| `help` | 显示帮助 |

---

## 召唤机制

### 阶层概率

| 阶层 | 概率 | 基础属性 | 闪耀概率 |
|------|------|----------|----------|
| [B] 青铜 | 45% | 10 | 0.5% |
| [S] 白银 | 30% | 20 | 0.8% |
| [G] 黄金 | 15% | 35 | 1.2% |
| [P] 白金 | 7% | 50 | 2.0% |
| [D] 钻石 | 2.5% | 65 | 3.5% |
| [M] 神话 | 0.5% | 80 | 5.0% |

### 多抽流程

- 所有召唤都保持纯概率，不支持指定阶层保底或追阶。
- `pull -n <count>` 会对每一只宠物进行独立揭示，而不只是显示汇总。
- 每一次 reveal 都会显示完整卡片、属性、精灵图与 trait。
- 非交互式输出环境会自动降级为可读文本输出。

---

## 功能特色

- **16 种原创生物**
- **6 阶层稀有度系统**
- **闪耀变体与配件**
- **可复现 seed 召唤**
- **TTY 感知动画与显示降级**
- **本地收藏存储**

---

## 技术细节

- 本地数据存储在 `~/.pixel-pets/collection.json`
- 使用 `xorshift128+` 作为 PRNG
- 使用 `djb2` 将字符串 seed 映射为可复现随机状态

---

## 许可证

MIT License - 详见 [LICENSE](../../LICENSE)
