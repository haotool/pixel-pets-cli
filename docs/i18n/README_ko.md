<h1 align="center">Pixel Pets CLI</h1>

<p align="center">
  <strong>터미널에서 즐기는 펫 수집 게임. 픽셀 동반자를 소환하고 모아 보세요.</strong>
</p>

<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README_zh-TW.md">繁體中文</a> |
  <a href="README_zh-CN.md">简体中文</a> |
  <a href="README_ja.md">日本語</a> |
  <strong>한국어</strong>
</p>

---

## 빠른 시작

```bash
# 바로 실행
npx pixel-pets-cli

# 단일 소환
npx pixel-pets-cli pull

# 10연 소환, 각 펫을 순서대로 공개
npx pixel-pets-cli pull -n 10

# 고정 seed 기반 50연 소환, 동일 결과 재현 가능
npx pixel-pets-cli pull gallery-seed -n 50

# 100연 소환도 전부 개별 표시
npx pixel-pets-cli pull -n 100
```

---

## 설치

```bash
npm install -g pixel-pets-cli

pixel-pets-cli pull
pixel-pets pull
ppets pull
```

---

## 명령어

| 명령어 | 설명 |
|--------|------|
| `pull [seed]` | 단일 소환 또는 고정 seed 소환 |
| `pull -n <count>` | 다중 소환, 각 펫을 완전 표시 |
| `pull <seed> -n <count>` | 재현 가능한 seed 시퀀스로 다중 소환 |
| `list` | 컬렉션 목록 표시 |
| `show <name>` | 상세 카드 표시 |
| `animate <name>` | 펫 애니메이션 재생 |
| `stats` | 컬렉션 통계 표시 |
| `rates` | 소환 확률 표시 |
| `clear --confirm` | 컬렉션 초기화 |
| `help` | 도움말 표시 |

---

## 소환 규칙

### 티어 확률

| 티어 | 확률 | 기본 속성 | 스파클 확률 |
|------|------|-----------|-------------|
| [B] 브론즈 | 45% | 10 | 0.5% |
| [S] 실버 | 30% | 20 | 0.8% |
| [G] 골드 | 15% | 35 | 1.2% |
| [P] 플래티넘 | 7% | 50 | 2.0% |
| [D] 다이아몬드 | 2.5% | 65 | 3.5% |
| [M] 미식 | 0.5% | 80 | 5.0% |

### 다중 소환 흐름

- 모든 소환은 공개된 확률만 따르며, 특정 티어 지정이나 추격 소환은 없습니다.
- `pull -n <count>` 는 요약만 출력하지 않고 각 펫을 순차적으로 reveal 합니다.
- 소규모 배치는 상세 카드, 대규모 배치는 빠른 gallery reveal 을 사용하지만 전부 표시합니다.
- TTY 환경에서는 풍부한 애니메이션, 비대화형 환경에서는 읽기 쉬운 텍스트 출력으로 자동 전환됩니다.

---

## 특징

- **16종 오리지널 크리처**
- **6단계 희귀도 시스템**
- **스파클 변종과 액세서리**
- **재현 가능한 seed 소환**
- **TTY 인식 애니메이션**
- **로컬 컬렉션 저장**

---

## 기술 메모

- 저장 위치는 `~/.pixel-pets/collection.json`
- PRNG 는 `xorshift128+`
- 문자열 seed 는 `djb2` 로 결정적 난수 상태로 변환

---

## 라이선스

MIT License - [LICENSE](../../LICENSE) 참고
