# PDF Batch Unlocker

前台網址：<https://bruce-yang-422.github.io/pdf-batch-unlock/>

純前端的 PDF 批次移除密碼工具。使用者可一次選擇或拖入多個 PDF，輸入一次共同密碼後，網站會在瀏覽器中逐檔解密並下載結果。

> 所有 PDF 與密碼只會在使用者的瀏覽器本機處理，不會上傳至伺服器，也不會寫入 LocalStorage、IndexedDB、Cookie 或任何分析服務。

## 功能

- 支援點擊選擇及拖放多個 PDF
- 所有檔案共用一組已知密碼
- 僅使用一個 QPDF WebAssembly instance 逐檔處理
- 顯示等待、處理中、完成及錯誤狀態
- 單一檔案失敗不會中止其他檔案
- 可移除單一檔案或清除全部 queue
- 自動略過非 PDF 與重複檔案
- 支援中文檔名、空白及特殊字元密碼
- 解密結果命名為 `原檔名-unlocked.pdf`
- 可部署至 GitHub Pages，不需要後端或 API key

## 使用方式

1. 將一個或多個 PDF 拖入頁面上的虛線框，或點擊框內選擇檔案。
2. 檢查待處理檔案清單。
3. 輸入所有 PDF 共用的密碼。
4. 點擊「全部移除密碼並下載」。
5. 若瀏覽器詢問權限，請允許網站下載多個檔案。

檔案會依序處理，不會使用 `Promise.all()` 同時將所有 PDF 載入記憶體。大型 PDF 仍可能受到瀏覽器或裝置記憶體限制。

## 本機開發

需求：

- Node.js 20.19+ 或 22.12+
- npm

安裝固定版本依賴：

```bash
npm ci
```

啟動開發伺服器：

```bash
npm run dev
```

建立 production 靜態檔案：

```bash
npm run build
```

建置結果會輸出到 `dist/`。若要在本機預覽：

```bash
npm run preview
```

## 測試

```bash
npm run test:browser
```

瀏覽器 smoke test 會：

1. 啟動臨時 Vite server 及 headless Chrome。
2. 在 QPDF WASM 中建立一個加密 PDF。
3. 驗證錯誤密碼可正確分類。
4. 使用正確密碼解密同一個 PDF。
5. 使用 QPDF `--check` 驗證輸出完整性。

Windows 預設使用：

```text
C:\Program Files\Google\Chrome\Application\chrome.exe
```

其他 Chrome 安裝位置可透過 `CHROME_PATH` 指定。

## GitHub Pages 部署

專案包含 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)。推送至 `main` 後，GitHub Actions 會執行：

```text
npm ci
→ npm run build
→ 上傳 dist/
→ 部署至 GitHub Pages
```

第一次部署前，請在 GitHub repository 中開啟：

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

Vite 使用相對 `base`，因此 JavaScript、CSS 與 WASM 資源可在 GitHub Pages repository 子目錄下正確載入。

## 技術架構

- **Vite 7.3.6**：開發伺服器與純靜態 production build
- **`@neslinesli93/qpdf-wasm` 0.3.0**：瀏覽器內的 QPDF／Emscripten runtime
- **Emscripten MEMFS**：暫存每次處理的 PDF input/output
- **原生 File、Blob 與 Object URL API**：讀取檔案及下載結果

單一檔案處理流程：

```text
File
→ ArrayBuffer
→ Uint8Array
→ Emscripten MEMFS
→ qpdf --password=… --decrypt
→ Uint8Array
→ Blob
→ 下載
```

每個檔案無論成功或失敗，都會在 `finally` 中刪除 MEMFS input/output。下載完成後也會撤銷 Object URL。QPDF stderr 只輸出至開發者主控台，使用者介面顯示整理過的中文錯誤訊息。

WASM 由 Vite 打包為同站台的雜湊資產，不使用第三方 CDN。

## 專案結構

```text
├─ .github/workflows/       GitHub Pages deployment
├─ src/
│  ├─ core/                 QPDF 初始化、解密與錯誤分類
│  ├─ utils/                檔名與檔案大小工具
│  ├─ main.js               多檔 queue 及畫面互動
│  └─ style.css             介面樣式
├─ tests/                   瀏覽器整合測試
├─ index.html
├─ package.json
└─ vite.config.js
```

## 目前限制

- 所有 PDF 必須使用相同密碼。
- 瀏覽器可能封鎖連續自動下載，使用者需要允許多檔下載。
- 尚未加入小檔案 ZIP 打包模式。
- 尚未加入依檔案大小自動切換的低記憶體互動模式。
- QPDF 目前在主執行緒執行；處理大型檔案時介面可能短暫失去回應。
- 不保證超大型 PDF 能在所有行動裝置上成功處理。

後續規格與完整路線圖請參考 [`pdf_batch_unlock_project_plan.md`](pdf_batch_unlock_project_plan.md)。

## 隱私

本專案沒有後端、資料庫、檔案上傳 API、analytics 或追蹤程式。使用者可透過瀏覽器開發者工具的 Network 面板確認：處理 PDF 時不會送出 PDF 內容或密碼。
