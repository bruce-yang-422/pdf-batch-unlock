# PDF 本機工具箱

**正體中文** · [English](README.en.md) · [日本語](README.ja.md)

[![Website](https://img.shields.io/badge/website-pdf.stack--base.com-147d6f?style=flat-square)](https://pdf.stack-base.com/)
[![Latest release](https://img.shields.io/github/v/release/bruce-yang-422/pdf-batch-unlock?style=flat-square)](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/latest)
[![License](https://img.shields.io/github/license/bruce-yang-422/pdf-batch-unlock?style=flat-square)](LICENSE)
[![Local processing](https://img.shields.io/badge/processing-100%25%20local-0f766e?style=flat-square)](https://pdf.stack-base.com/privacy/)

免費、開源、免上傳的 PDF 工具箱。PDF、圖片與密碼只在瀏覽器內處理，不會傳送至本站伺服器。

**[開啟線上工具](https://pdf.stack-base.com/)** · **[下載 Chrome／Edge 擴充功能 v1.1.2](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/download/v1.1.2/pdf-toolbox-v1.1.2.zip)**

## 功能

- 移除 PDF 密碼，支援批次處理與 ZIP 下載
- 使用 AES-256 為 PDF 加上開啟密碼
- 合併 PDF，或將 PDF 逐頁拆分
- 重新排序、旋轉、刪除與擷取 PDF 頁面
- 將 2 或 4 個頁面合版至 A3、A4 或 A5，並提供版面建議與縮放警示
- 加入文字／圖片浮水印與頁碼，確認實際輸出後再下載
- PDF 轉 JPG，支援 96、150 與 300 DPI
- JPG／JPEG 合併轉為 PDF
- 支援 PWA 安裝、離線快取及 Chrome／Microsoft Edge 擴充功能
- 支援淺色、深色、跟隨系統主題及 13 種介面語言
- 響應式桌面介面與手機 App Bar／抽屜式導覽

## 隱私優先

- 沒有後端、帳號、資料庫、analytics 或廣告追蹤
- 文件與輸出結果只存在目前瀏覽器工作階段的記憶體中
- `localStorage` 只保存語言、外觀主題與 PWA 提示偏好
- Cache Storage 只保存應用程式資產，不保存使用者文件

請只處理您擁有或已獲授權的文件。更多資訊請參閱[隱私權政策](https://pdf.stack-base.com/privacy/)與[使用條款](https://pdf.stack-base.com/terms/)。

## 使用方式

1. 選擇需要的工具。
2. 拖入檔案，或點擊上傳區選取檔案。
3. 視需要調整檔案順序與處理選項。
4. 執行處理並檢查結果。
5. 下載 PDF、JPG 或 ZIP；支援預覽的工具可先確認實際輸出。

桌面版由頂部工具列切換功能。手機版由左上角 App Bar 開啟工具抽屜，外觀與語言位於抽屜的「偏好設定」。

> 合併、拆分及 PDF 轉 JPG 不直接支援加密 PDF。請先使用「移除密碼」，再處理解密後的副本。

## 使用選項

### 線上使用

直接開啟 <https://pdf.stack-base.com/>。處理過程不需要註冊或上傳檔案。

### 安裝 PWA

使用支援 PWA 的瀏覽器開啟網站，選擇「安裝 App」。安裝後可從桌面或主畫面啟動，已快取的應用程式資產可離線使用。

### 安裝瀏覽器擴充功能

1. 下載並解壓縮 [pdf-toolbox-v1.1.2.zip](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/download/v1.1.2/pdf-toolbox-v1.1.2.zip)。
2. Chrome 開啟 `chrome://extensions`；Edge 開啟 `edge://extensions`。
3. 開啟「開發人員模式」。
4. 選擇「載入未封裝」，再選取含有 `manifest.json` 的解壓縮資料夾。

瀏覽器官方安裝說明： [Google Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-tw#load-unpacked) · [Microsoft Edge](https://learn.microsoft.com/zh-tw/microsoft-edge/extensions/getting-started/extension-sideloading)

專案建置與封裝細節請見[瀏覽器擴充功能文件](browser-extension/README.md)。

## 本機執行

本專案是已建置完成的靜態網站，不需要安裝 npm 套件。

```bash
git clone https://github.com/bruce-yang-422/pdf-batch-unlock.git
cd pdf-batch-unlock
python -m http.server 8080
```

開啟 <http://localhost:8080/>。請勿直接使用 `file://` 開啟 `index.html`；Service Worker、Web Worker 與 WebAssembly 需要 HTTP 環境。

## 開發與建置

需求：Node.js 22，以及封裝 ZIP 時使用的 PowerShell 7。

```bash
# 重建未封裝的瀏覽器擴充功能
node browser-extension/build.mjs

# 檢查生成內容
git diff -- browser-extension/dist
```

```powershell
# 建立 browser-extension/release/pdf-toolbox-v<version>.zip
pwsh -File browser-extension/package.ps1
```

發行前請先更新 `browser-extension/manifest.json` 的版本號。`browser-extension/dist/` 是生成內容，請勿直接修改。

### 主要技術

| 技術 | 用途 |
| --- | --- |
| QPDF WebAssembly | 移除密碼與 AES-256 加密 |
| pdf-lib | 合併、拆分、頁面編排、浮水印及 JPG 轉 PDF |
| PDF.js | 頁面預覽、縮圖及 PDF 轉 JPG |
| JSZip | 封裝多檔處理結果 |
| Web Crypto API | 產生加密安全的隨機密碼 |
| Service Worker | PWA 與離線快取 |

主工具的介面補強與手機導覽位於 `assets/ui-polish.js` 與 `assets/ui-polish.css`；多頁合版位於 `assets/nup.js` 與 `assets/nup.css`；翻譯集中於 `assets/i18n.js`。網站可直接部署 repository 根目錄，不需要後端或 API key。

## 支援語言

正體中文、簡體中文、英文、日文、韓文、西班牙文、德文、法文、俄文、巴西葡萄牙文、泰文、越南文及印尼文。

可使用 `?lang=` 指定語言，例如 `?lang=zh-Hant` 或 `?lang=en`。

## 限制

大型 PDF、高解析度圖片或大量頁面可能受到裝置記憶體限制。300 DPI 轉圖、拆分與 ZIP 封裝尤其需要較多記憶體。

## 問題回報

請透過 [GitHub Issues](https://github.com/bruce-yang-422/pdf-batch-unlock/issues) 回報可重現的錯誤或提出功能建議，並附上瀏覽器版本、作業系統與操作步驟。請勿上傳含敏感資料的文件。

## 授權

本專案採用 [MIT License](LICENSE)。第三方元件依各自的授權條款提供，詳見[開源軟體授權](https://pdf.stack-base.com/licenses/)。
