<h1 align="center">Pixel Pets CLI</h1>

<p align="center">
  <strong>ターミナルで遊ぶペット収集ゲーム。ピクセルコンパニオンを召喚して集めよう。</strong>
</p>

<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README_zh-TW.md">繁體中文</a> |
  <a href="README_zh-CN.md">简体中文</a> |
  <strong>日本語</strong> |
  <a href="README_ko.md">한국어</a>
</p>

---

## クイックスタート

```bash
# すぐに実行
npx pixel-pets-cli

# 単発召喚
npx pixel-pets-cli pull

# 10連召喚。各ペットを順番に表示
npx pixel-pets-cli pull -n 10

# 固定 seed の 50 連召喚。同じ結果を再現可能
npx pixel-pets-cli pull gallery-seed -n 50

# 100 連召喚でも全て個別に表示
npx pixel-pets-cli pull -n 100
```

---

## インストール

```bash
npm install -g pixel-pets-cli

pixel-pets-cli pull
pixel-pets pull
ppets pull
```

---

## コマンド

| コマンド | 説明 |
|----------|------|
| `pull [seed]` | 単発召喚、または固定 seed で召喚 |
| `pull -n <count>` | 複数召喚。各ペットを完全表示 |
| `pull <seed> -n <count>` | 再現可能な seed シーケンスで複数召喚 |
| `list` | コレクション一覧 |
| `show <name>` | 詳細カード表示 |
| `animate <name>` | ペットのアニメーション表示 |
| `stats` | コレクション統計 |
| `rates` | 召喚確率表示 |
| `clear --confirm` | コレクション初期化 |
| `help` | ヘルプ表示 |

---

## 召喚仕様

### ティア確率

| ティア | 確率 | 基本属性 | スパークル確率 |
|--------|------|----------|----------------|
| [B] ブロンズ | 45% | 10 | 0.5% |
| [S] シルバー | 30% | 20 | 0.8% |
| [G] ゴールド | 15% | 35 | 1.2% |
| [P] プラチナ | 7% | 50 | 2.0% |
| [D] ダイヤモンド | 2.5% | 65 | 3.5% |
| [M] ミシック | 0.5% | 80 | 5.0% |

### 複数召喚の流れ

- すべての召喚は公開された確率に従い、ティア指定や追い召喚は行いません。
- `pull -n <count>` は集計だけで終わらず、各ペットを順番に reveal します。
- 少数バッチでは詳細カード、大きなバッチでは高速な gallery reveal を使いますが、全件表示は維持します。
- TTY ではリッチな演出、非対話環境では読みやすいテキスト出力に自動で切り替わります。

---

## 特徴

- **16種類のオリジナルクリーチャー**
- **6段階のレアリティ**
- **スパークル変種とアクセサリー**
- **再現可能な seed 召喚**
- **TTY 対応アニメーション**
- **ローカル保存**

---

## 技術メモ

- 保存先は `~/.pixel-pets/collection.json`
- PRNG は `xorshift128+`
- 文字列 seed は `djb2` で決定的な乱数状態へ変換

---

## ライセンス

MIT License - [LICENSE](../../LICENSE) を参照
