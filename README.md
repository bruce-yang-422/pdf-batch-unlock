# PDF 本機工具箱

[![Website](https://img.shields.io/badge/Website-pdf.stack--base.com-147d6f?style=flat-square)](https://pdf.stack-base.com/)
[![GitHub Pages](https://img.shields.io/github/deployments/bruce-yang-422/pdf-batch-unlock/github-pages?label=GitHub%20Pages&style=flat-square)](https://bruce-yang-422.github.io/pdf-batch-unlock/)
[![License: MIT](https://img.shields.io/github/license/bruce-yang-422/pdf-batch-unlock?style=flat-square)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/bruce-yang-422/pdf-batch-unlock?style=flat-square)](https://github.com/bruce-yang-422/pdf-batch-unlock/commits/main/)
[![GitHub Stars](https://img.shields.io/github/stars/bruce-yang-422/pdf-batch-unlock?style=flat-square)](https://github.com/bruce-yang-422/pdf-batch-unlock/stargazers)
[![Browser Only](https://img.shields.io/badge/Processing-100%25%20Browser%20Only-0f766e?style=flat-square)](https://pdf.stack-base.com/privacy/)

前台網址：<https://bruce-yang-422.github.io/pdf-batch-unlock/>

正式網址：<https://pdf.stack-base.com/>

純前端的 PDF 多功能工具。所有 PDF、圖片與密碼只會在瀏覽器本機處理，應用程式不會主動將文件內容上傳、儲存或傳送至本站伺服器。

介面支援電腦與手機瀏覽器。電腦版使用頁籤切換工具，手機版則使用下拉選單；頁面管理工作區、檔案清單與主要操作按鈕也會依螢幕寬度自動調整。

介面提供正體中文、英文、日文、韓文、西班牙文、德文與法文。首次開啟會依瀏覽器系統語言自動選擇，使用者切換後會在此瀏覽器記住偏好。

各語言另有可被搜尋引擎辨識及分享的固定網址：`?lang=zh-Hant`、`?lang=en`、`?lang=ja`、`?lang=ko`、`?lang=es`、`?lang=de`、`?lang=fr`。頁面會同步更新標題、摘要、Open Graph、Twitter Card、canonical 與結構化資料，並以 `hreflang` 標示語言版本；SEO 文案均明確說明檔案只在瀏覽器本機處理、不需上傳伺服器。

電腦版採左右雙欄工作區：左側匯入與設定，右側顯示目前檔案及本次瀏覽器工作階段的活動紀錄。紀錄與輸出只暫存在目前分頁的記憶體，重新整理或關閉頁面後即清除。

活動紀錄預設展開，使用亮色終端機視窗呈現，可查看逐檔結果、輸出檔名與耗時，並可在重新整理前再次下載。使用者仍可手動收合，輸出資料也可逐筆或一次全部釋放。

## 功能

### 移除密碼

- 一次選擇或拖入多個使用相同密碼的 PDF
- 逐檔移除密碼；兩個以上檔案會將成功結果打包為單一 ZIP 下載
- 單一檔案失敗不會中止其他檔案
- 工具旁固定顯示合法使用提醒，請僅處理本人擁有或已取得合法授權的文件

### 加上密碼

- 為一個或多個未加密 PDF 設定相同的開啟密碼
- 可自行設定密碼，並再次輸入確認，避免因輸入錯誤而無法開啟輸出檔
- 也可由系統使用瀏覽器加密安全亂數產生密碼，長度可選 8–40 字元（每次增加 4 字元、預設及建議值為 24），並可決定是否包含特殊符號
- 選擇 8 或 12 字元時會顯示低安全性提醒
- 系統產生的密碼會顯示在畫面上，並提供重新產生與複製按鈕
- 使用 QPDF WebAssembly 在瀏覽器本機進行 AES-256 加密
- 單檔直接下載；多檔會將成功結果打包為 `protected-pdfs.zip`
- 使用系統產生密碼時，另行下載包含相同密碼與檔案清單的 TXT，並將加密結果與 TXT 都保留在本次處理歷程供再次下載

### 合併 PDF

- 依檔案加入順序合併兩個以上 PDF
- 可拖曳檔案，或使用上移／下移按鈕調整合併順序
- 輸出單一 `merged.pdf`

### 拆分 PDF

- 將 PDF 的每一頁拆成獨立 PDF
- 全部結果打包為 `原檔名-split.zip`

### JPG 轉 PDF

- 支援一張或多張 JPG／JPEG
- 每張圖片建立為一頁 PDF
- 保留原始圖片比例，不需要額外設定 DPI
- 輸出單一 `images.pdf`

### PDF 轉 JPG

- 將 PDF 每一頁渲染為 JPG
- 可選擇螢幕（96 DPI）、清晰（150 DPI）或高畫質（300 DPI）
- 全部圖片打包為 `原檔名-jpg.zip`

### PDF 頁面管理器

- 建立每頁縮圖；電腦可用滑鼠拖曳，手機可長按後用手指拖動，也可使用方向按鈕調整順序
- 可選取頁面後旋轉、刪除或擷取成獨立 PDF
- 套用目前頁面順序與旋轉角度後輸出新 PDF

### 浮水印與頁碼

- 加入文字浮水印並設定字型、文字大小、縮放比例、透明度、位置與旋轉角度
- 提供繁中黑體、標楷體（公文）、明體及等寬字型
- 可點擊選擇 PNG、JPG 或 SVG 作為圖片浮水印；SVG 會先移除外部內容並在本機轉成 PNG
- 浮水印可選擇單一顯示或重複鋪滿整個頁面
- 加入 PDF 後以第一頁實際畫面提供即時預覽，顯示浮水印版面、比例、透明度、角度與頁碼效果
- 支援中文浮水印，使用瀏覽器本機字型繪製
- 可自動在每頁下方加入頁碼，並選擇頁碼字型及大小

操作失敗時會顯示錯誤摘要、可能原因與建議處理方式；錯誤提醒會保留到使用者關閉或開始下一次處理。

## 使用方式

1. 從上方頁籤選擇工具；手機版請使用「選擇工具」下拉選單。
2. 電腦可將檔案拖入虛線框或點擊選擇；手機與平板使用點選方式從裝置選取檔案。
3. 檢查檔案清單及所需選項。
4. 點擊處理按鈕並下載結果。

合併、拆分及 PDF 轉 JPG 不直接處理加密 PDF。請先使用「移除密碼」，再將解密後的 PDF 加入其他工具。

## PWA 安裝與離線使用

- 支援的桌面及 Android 瀏覽器會在符合安裝條件時顯示「安裝 App」通知。
- iPhone 與 iPad 會提示透過瀏覽器分享選單的「加入主畫面」完成安裝。
- 選擇「稍後」只會在目前瀏覽階段隱藏通知。
- Service Worker 會快取應用程式介面、PDF.js worker 與 QPDF WebAssembly；安裝完成且至少成功載入一次後，主要 PDF 功能可離線使用。
- 使用者匯入的 PDF、圖片、密碼與輸出結果不會寫入 PWA 離線快取。

## 正式部署

Repository 只保留可直接部署的正式靜態網站：

```text
.gitignore
CNAME
LICENSE
README.md
index.html
robots.txt
sitemap.xml
manifest.webmanifest
sw.js
privacy/index.html
terms/index.html
licenses/index.html
assets/
├─ index-*.css
├─ index-*.js
├─ layout-*.css
├─ legal-pages.css
├─ i18n.js
├─ ui-polish.css
├─ ui-polish.js
├─ pwa.css
├─ pwa.js
├─ wasm/
│  ├─ jbig2.wasm
│  ├─ openjpeg.wasm
│  └─ qcms_bg.wasm
├─ pdf.worker.min-*.mjs
└─ qpdf-*.wasm
icon/
├─ favicon.ico
├─ apple-touch-icon.png
├─ pwa-192x192.png
└─ pwa-512x512.png
```

GitHub Pages 設定：

```text
Settings → Pages → Build and deployment
Source: Deploy from a branch
Branch: main / (root)
```

不需要 Node.js、npm、GitHub Actions、後端或 API key。`index.html` 會直接載入根目錄 `assets/` 中的正式檔案，網址不會導向 `/docs/`。

## 注意事項

- 移除密碼時，所有 PDF 必須使用相同密碼。
- JPG 轉 PDF 的 DPI 不會提升原始圖片畫質，因此不提供 DPI 設定。
- PDF 轉 JPG 的 DPI 會決定輸出像素尺寸；300 DPI 會使用較多記憶體與儲存空間。
- 大型 PDF、高解析度圖片或大量頁面可能受裝置記憶體限制，手機上尤其明顯。
- 拆分與 PDF 轉 JPG 會在完成後產生 ZIP，因此處理期間會占用額外記憶體。
- PDF 處理在瀏覽器執行，大型檔案可能讓介面短暫失去回應。
- 本 repository 的最新版只保留可直接部署的正式網站檔案，不包含開發工具與測試。

## 隱私

本網站沒有後端、資料庫、檔案上傳 API、analytics 或追蹤程式。QPDF WebAssembly、PDF.js worker、JavaScript 與 CSS 均由同一個 GitHub Pages 網站提供。網站會在 `localStorage` 儲存介面語言代碼、在 `sessionStorage` 暫存安裝通知狀態，並以 Cache Storage 保存 PWA 應用程式檔案；不會儲存使用者的 PDF、圖片、密碼或輸出內容。

網站 Footer 提供下列資訊頁面：

- [Privacy](https://pdf.stack-base.com/privacy)：本機文件處理、語言偏好與一般網站連線資料說明
- [Terms](https://pdf.stack-base.com/terms)：合法使用、文件與密碼責任、服務現況及責任限制
- [Open Source Licenses](https://pdf.stack-base.com/licenses)：PDF.js、pdf-lib、JSZip 與 QPDF 的第三方授權資訊

## 授權

本專案由 Bruce Yang 以 [MIT License](LICENSE) 授權。第三方元件仍依各自的授權條款提供，詳見 [Open Source Licenses](https://pdf.stack-base.com/licenses)。
