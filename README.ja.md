# PDF ローカルツールボックス

[繁體中文](README.md) · [English](README.en.md) · **日本語**

[![Website](https://img.shields.io/badge/website-pdf.stack--base.com-147d6f?style=flat-square)](https://pdf.stack-base.com/)
[![Latest release](https://img.shields.io/github/v/release/bruce-yang-422/pdf-batch-unlock?style=flat-square)](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/latest)
[![License](https://img.shields.io/github/license/bruce-yang-422/pdf-batch-unlock?style=flat-square)](LICENSE)
[![Local processing](https://img.shields.io/badge/processing-100%25%20local-0f766e?style=flat-square)](https://pdf.stack-base.com/privacy/)

アップロード不要で使える、無料・オープンソースの PDF ツールボックスです。PDF、画像、パスワードはすべてブラウザー内で処理され、このサイトのサーバーには送信されません。

**[Web アプリを開く](https://pdf.stack-base.com/?lang=ja)** · **[Chrome／Edge 拡張機能 v1.1.2 をダウンロード](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/download/v1.1.2/pdf-toolbox-v1.1.2.zip)**

## 機能

- PDF パスワードの一括解除と ZIP ダウンロード
- AES-256 による PDF 閲覧パスワードの設定
- PDF の結合とページ単位の分割
- PDF ページの並べ替え、回転、削除、抽出
- 2 ページまたは 4 ページを A3／A4／A5 用紙へ配置し、推奨レイアウトと縮小率の警告を表示
- 文字／画像の透かしとページ番号を追加し、実際の出力を確認してからダウンロード
- PDF を 96／150／300 DPI の JPG に変換
- JPG／JPEG 画像を 1 つの PDF に変換
- PWA および Chrome／Microsoft Edge 拡張機能としてインストール可能
- ライト／ダーク／システム設定に連動するテーマと 13 言語の UI
- デスクトップ向けレスポンシブ UI と、アプリバー／ドロワーを使ったモバイルナビゲーション

## プライバシーを重視した設計

- バックエンド、アカウント、データベース、アクセス解析、広告トラッカーはありません
- 文書と生成結果は現在のブラウザーセッションのメモリー内だけに保持されます
- `localStorage` に保存するのは言語、表示テーマ、PWA 案内の設定だけです
- Cache Storage に保存するのはアプリ資産だけで、ユーザーの文書は保存しません

所有している文書、または利用許可を得た文書のみを処理してください。詳しくは[プライバシーポリシー](https://pdf.stack-base.com/privacy/?lang=ja)と[利用規約](https://pdf.stack-base.com/terms/?lang=ja)をご覧ください。

## 使い方

1. 使用するツールを選びます。
2. ファイルをアップロード領域へドロップするか、端末から選択します。
3. 必要に応じてファイルの順序や処理設定を調整します。
4. 処理を実行して結果を確認します。
5. PDF、JPG、ZIP をダウンロードします。プレビュー対応ツールでは、実際の出力を先に確認できます。

デスクトップでは上部ナビゲーションからツールを切り替えます。モバイルではアプリバーからツールドロワーを開き、表示テーマと言語は「環境設定」で変更できます。

> 結合、分割、PDF から JPG への変換は、暗号化 PDF を直接処理できません。先にパスワードを解除し、復号したコピーを処理してください。

## 利用方法

### Web アプリ

<https://pdf.stack-base.com/?lang=ja> を開きます。登録やファイルのアップロードは必要ありません。

### PWA

PWA 対応ブラウザーでサイトを開き、「アプリをインストール」を選択します。デスクトップやホーム画面から起動でき、キャッシュ済みのアプリ資産はオフラインでも利用できます。

### ブラウザー拡張機能

1. [pdf-toolbox-v1.1.2.zip](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/download/v1.1.2/pdf-toolbox-v1.1.2.zip) をダウンロードして展開します。
2. Chrome では `chrome://extensions`、Edge では `edge://extensions` を開きます。
3. 「デベロッパー モード」を有効にします。
4. 「パッケージ化されていない拡張機能を読み込む」を選び、`manifest.json` が入った展開先フォルダーを指定します。

詳しくは[ブラウザー拡張機能のドキュメント](browser-extension/README.md)をご覧ください。

## ローカルで実行する

このリポジトリにはビルド済みの静的サイトが含まれているため、npm パッケージのインストールは不要です。

```bash
git clone https://github.com/bruce-yang-422/pdf-batch-unlock.git
cd pdf-batch-unlock
python -m http.server 8080
```

<http://localhost:8080/> を開きます。`index.html` を `file://` で直接開かないでください。Service Worker、Web Worker、WebAssembly には HTTP 環境が必要です。

## 開発とパッケージ作成

必要な環境：Node.js 22。ZIP の作成には PowerShell 7 も使用します。

```bash
# 未パッケージのブラウザー拡張機能を再ビルド
node browser-extension/build.mjs

# 生成ファイルを確認
git diff -- browser-extension/dist
```

```powershell
# browser-extension/release/pdf-toolbox-v<version>.zip を作成
pwsh -File browser-extension/package.ps1
```

リリース前に `browser-extension/manifest.json` のバージョンを更新してください。`browser-extension/dist/` は生成物のため、直接編集しないでください。

### 主な技術

| 技術 | 用途 |
| --- | --- |
| QPDF WebAssembly | パスワード解除と AES-256 暗号化 |
| pdf-lib | 結合、分割、ページ配置、透かし、JPG から PDF への変換 |
| PDF.js | ページプレビュー、サムネイル、PDF から JPG への変換 |
| JSZip | 複数ファイルの ZIP 作成 |
| Web Crypto API | 暗号学的に安全なランダムパスワード生成 |
| Service Worker | PWA とオフラインキャッシュ |

UI の補強とモバイルナビゲーションは `assets/ui-polish.js` と `assets/ui-polish.css`、複数ページ配置は `assets/nup.js` と `assets/nup.css`、翻訳は `assets/i18n.js` で管理しています。リポジトリのルートをそのままデプロイでき、バックエンドや API キーは不要です。

## 対応言語

繁体字中国語、簡体字中国語、英語、日本語、韓国語、スペイン語、ドイツ語、フランス語、ロシア語、ブラジルポルトガル語、タイ語、ベトナム語、インドネシア語。

`?lang=` で言語を指定できます。例：`?lang=ja`、`?lang=en`。

## 制限事項

大容量 PDF、高解像度画像、ページ数の多い文書は、端末のメモリー上限に達する場合があります。特に 300 DPI 変換、分割、ZIP 作成は多くのメモリーを使用します。

## サポート

再現可能な不具合や機能要望は [GitHub Issues](https://github.com/bruce-yang-422/pdf-batch-unlock/issues) へお寄せください。ブラウザーのバージョン、OS、再現手順を記載し、機密情報を含む文書はアップロードしないでください。

## ライセンス

本プロジェクトは [MIT License](LICENSE) の下で公開されています。サードパーティ製コンポーネントには各ライセンスが適用されます。詳しくは[オープンソースライセンス](https://pdf.stack-base.com/licenses/?lang=ja)をご覧ください。
