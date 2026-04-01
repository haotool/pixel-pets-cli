<h1 align="center">Pixel Pets CLI</h1>

<p align="center">
  <strong>終端機寵物收集遊戲，召喚並收藏你的像素夥伴</strong>
</p>

<p align="center">
  <a href="../../README.md">English</a> |
  <strong>繁體中文</strong> |
  <a href="README_zh-CN.md">简体中文</a> |
  <a href="README_ja.md">日本語</a> |
  <a href="README_ko.md">한국어</a>
</p>

---

## 快速開始

```bash
# 直接執行
npx pixel-pets-cli

# 單抽
npx pixel-pets-cli pull

# 10 連抽，每一隻都會逐張揭示
npx pixel-pets-cli pull -n 10

# 使用固定 seed 的 50 連抽，可重現相同序列
npx pixel-pets-cli pull gallery-seed -n 50

# 100 連抽，仍會逐隻顯示完整卡片
npx pixel-pets-cli pull -n 100
```

---

## 安裝

```bash
npm install -g pixel-pets-cli

# 安裝後可直接使用
pixel-pets-cli pull
pixel-pets pull
ppets pull
```

---

## 指令

| 指令 | 說明 |
|------|------|
| `pull [seed]` | 單抽或使用固定 seed 召喚 |
| `pull -n <count>` | 多抽，逐隻顯示完整結果 |
| `pull <seed> -n <count>` | 使用可重現 seed 序列進行多抽 |
| `list` | 顯示收藏列表 |
| `show <name>` | 顯示完整寵物卡片 |
| `animate <name>` | 播放寵物動畫 |
| `stats` | 顯示收藏統計 |
| `rates` | 顯示抽卡機率 |
| `clear --confirm` | 清空收藏 |
| `help` | 顯示說明 |

---

## 抽卡機制

### 階層機率

| 階層 | 機率 | 基礎屬性 | 閃耀機率 |
|------|------|----------|----------|
| [B] 青銅 | 45% | 10 | 0.5% |
| [S] 白銀 | 30% | 20 | 0.8% |
| [G] 黃金 | 15% | 35 | 1.2% |
| [P] 白金 | 7% | 50 | 2.0% |
| [D] 鑽石 | 2.5% | 65 | 3.5% |
| [M] 神話 | 0.5% | 80 | 5.0% |

### 多抽流程

- 所有召喚都維持純機率，不支援指定階層保底或追階。
- `pull -n <count>` 會對每一隻寵物做獨立揭示，不只顯示總結。
- 每一隻 reveal 都會顯示完整卡片、屬性、精靈圖與 trait。
- 非互動式輸出環境會自動降級為可讀文字輸出。

---

## 功能特色

- **16 種原創生物**
- **6 階層稀有度系統**
- **閃耀變體與配件**
- **可重現 seed 召喚**
- **TTY 感知動畫與顯示降級**
- **本機收藏儲存**

---

## 技術細節

- 本機資料儲存在 `~/.pixel-pets/collection.json`
- 使用 `xorshift128+` 作為 PRNG
- 使用 `djb2` 將字串 seed 映射為可重現亂數狀態

---

## 授權

MIT License - 詳見 [LICENSE](../../LICENSE)
