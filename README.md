# PDF 本機工具箱

[![Website](https://img.shields.io/badge/website-pdf.stack--base.com-147d6f?style=flat-square)](https://pdf.stack-base.com/)
[![License](https://img.shields.io/github/license/bruce-yang-422/pdf-batch-unlock?style=flat-square)](LICENSE)
[![Browser Only](https://img.shields.io/badge/processing-browser%20only-0f766e?style=flat-square)](https://pdf.stack-base.com/privacy/)

免費、開源、免上傳的 PDF 工具箱。所有 PDF、圖片與密碼都在瀏覽器本機處理，不會傳送至伺服器。

**線上使用：<https://pdf.stack-base.com/>**

## 功能特色

- 移除 PDF 密碼，支援批次處理與 ZIP 下載
- 使用 AES-256 為 PDF 加上開啟密碼
- 合併及逐頁拆分 PDF
- 將 2 或 4 個 PDF 頁面合版到一張 A3、A4 或 A5，支援裁切線與單頁重複
- 重新排序、旋轉、刪除或擷取 PDF 頁面
- 加入文字／圖片浮水印及頁碼
- PDF 轉 JPG，支援 96、150、300 DPI
- JPG／JPEG 合併轉為 PDF
- 支援 PWA 安裝與離線使用
- 提供 Chrome／Microsoft Edge Manifest V3 擴充功能
- 響應式介面與 13 種語言

## 快速開始

本專案是已建置完成的靜態網站，不需要安裝 npm 套件。下載或 clone repository 後，在專案根目錄啟動靜態伺服器：

```bash
git clone https://github.com/bruce-yang-422/pdf-batch-unlock.git
cd pdf-batch-unlock
python -m http.server 8080
```

開啟 <http://localhost:8080/>。

> 不建議直接以 `file://` 開啟 `index.html`，因為 Service Worker、Web Worker 與 WebAssembly 需要 HTTP 環境。

## 使用方式

1. 選擇需要的 PDF 工具。
2. 拖入檔案，或點擊上傳區選取檔案。
3. 視需要調整檔案順序與處理選項。
4. 執行處理並下載結果。

合併、拆分及 PDF 轉 JPG 不直接支援加密 PDF。請先使用「移除密碼」，再處理解密後的副本。

## 支援語言

正體中文、簡體中文、英文、日文、韓文、西班牙文、德文、法文、俄文、巴西葡萄牙文、泰文、越南文及印尼文。

可透過 `?lang=` 指定介面語言：

```text
https://pdf.stack-base.com/?lang=zh-Hant
https://pdf.stack-base.com/?lang=en
```

支援的語言代碼：`zh-Hant`、`zh-Hans`、`en`、`ja`、`ko`、`es`、`de`、`fr`、`ru`、`pt-BR`、`th`、`vi`、`id`。

## 瀏覽器擴充功能

下載並解壓縮 [Chrome／Edge 擴充功能 v1.0.0（ZIP）](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/download/v1.0.0/pdf-toolbox-v1.0.0.zip)，即可手動安裝。

1. Chrome 開啟 `chrome://extensions`；Edge 開啟 `edge://extensions`。
2. 開啟「開發人員模式」。
3. 選擇「載入未封裝」。
4. 選取解壓縮後含有 `manifest.json` 的資料夾。如果是從原始碼安裝，請選取本專案的 `browser-extension/dist/`。

主站資產更新後，使用 Node.js 22 重新建置擴充功能：

```bash
node browser-extension/build.mjs
```

建立商店上傳用 ZIP：

```powershell
pwsh -File browser-extension/package.ps1
```

ZIP 會輸出至 `browser-extension/release/pdf-toolbox-<version>.zip`。發行前請先更新 `browser-extension/manifest.json` 的版本號。完整說明請見 [browser-extension/README.md](browser-extension/README.md)。

## 技術棧

| 技術 | 用途 |
| --- | --- |
| QPDF WebAssembly | 移除密碼及 AES-256 加密 |
| pdf-lib | 合併、拆分、頁面編排、浮水印及 JPG 轉 PDF |
| PDF.js | 頁面預覽、縮圖及 PDF 轉 JPG |
| JSZip | 封裝多檔處理結果 |
| Web Crypto API | 產生加密安全的隨機密碼 |
| Service Worker | PWA 與離線快取 |

所有執行階段資產均由網站或擴充功能本身提供，不依賴後端服務或 API key。

## 專案結構

```text
.
├── index.html                 # 網站入口
├── assets/                    # JavaScript、CSS、PDF worker 與 WASM
├── icon/                      # 網站與 PWA 圖示
├── privacy/                   # 隱私權政策
├── terms/                     # 使用條款
├── licenses/                  # 第三方開源授權
├── manifest.webmanifest       # PWA manifest
├── sw.js                      # Service Worker
└── browser-extension/
    ├── manifest.json          # Manifest V3 設定
    ├── build.mjs              # 擴充功能建置腳本
    ├── package.ps1            # 發行封裝腳本
    ├── dist/                  # 生成的未封裝擴充功能
    └── README.md              # 擴充功能文件
```

`browser-extension/dist/` 是生成內容，請勿直接修改。網站工作區、翻譯或法律頁更新後，請重新執行 `build.mjs`。

### 多頁合版模組

多頁合版的介面與處理邏輯位於 `assets/nup.js` 與 `assets/nup.css`。由於目前 repository 僅保留主工具的建置後 bundle，這項功能以隔離模組掛接主介面，請勿直接修改 `assets/index-*.js`。`pdf-lib.min.js` 只會在使用者首次加入合版檔案時延遲載入，不影響其他工具的初始載入；擴充功能建置腳本會將模組與相依檔案一併封裝。

## 部署

網站可直接部署 repository 根目錄，不需要建置流程、後端或 API key。

GitHub Pages 設定：

```text
Settings → Pages → Build and deployment
Source: Deploy from a branch
Branch: main / (root)
```

自訂網域設定於 `CNAME`。部署時請確認 `sw.js` 的 `APP_SHELL` 與 `CACHE_NAME` 已配合正式資產檔名更新。

## 開發與驗證

本專案目前沒有自動化測試套件。提交變更前，建議：

```bash
# 重建擴充功能
node browser-extension/build.mjs

# 檢查生成內容
git diff -- browser-extension/dist

# 啟動本機網站進行功能測試
python -m http.server 8080
```

請手動驗證各 PDF 工具、語言切換、PWA 離線模式，以及 Chrome／Edge 未封裝擴充功能。

## 隱私與安全

- 沒有後端、資料庫、帳號系統、analytics 或追蹤程式。
- 文件、圖片與密碼只存在目前瀏覽器工作階段的記憶體中。
- `localStorage` 只保存語言及 PWA 提示偏好。
- `sessionStorage` 只保存當次瀏覽階段的 PWA 提示狀態。
- Cache Storage 只保存應用程式資產，不保存使用者文件或輸出結果。
- 活動紀錄與輸出檔在重新整理或關閉分頁後清除。

大型 PDF、高解析度圖片或大量頁面仍可能受到裝置記憶體限制；300 DPI 轉圖、拆分及 ZIP 封裝尤其需要較多記憶體。

更多資訊請參閱[隱私權政策](https://pdf.stack-base.com/privacy/)、[使用條款](https://pdf.stack-base.com/terms/)及[開源軟體授權](https://pdf.stack-base.com/licenses/)。

## 授權

本專案採用 [MIT License](LICENSE)。第三方元件仍依各自的授權條款提供。
