# 数秘術診断アプリ

## セットアップ

```bash
cd numerology
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## PDF出力

診断結果画面の「↓ PDF 出力」ボタンをクリックするとダウンロードフォルダに保存されます。

## Vercelへのデプロイ

```bash
npm install -g vercel
vercel
```

## ファイル構成

```
numerology/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # レイアウト
│   │   ├── page.tsx         # メインUI
│   │   └── globals.css
│   └── lib/
│       ├── numerology.ts    # 計算ロジック・解説データ
│       └── generatePDF.ts   # PDF生成
├── package.json
├── next.config.js
└── tsconfig.json
```
