# PDF 本機工具箱

前台網址：<https://bruce-yang-422.github.io/pdf-batch-unlock/>

純前端的 PDF 多功能工具。所有 PDF、圖片與密碼只會在瀏覽器本機處理，不會上傳、儲存或傳送至任何伺服器。

介面支援電腦與手機瀏覽器，會依螢幕寬度自動調整工具選單、檔案清單及操作按鈕。

## 功能

### 移除密碼

- 一次選擇或拖入多個使用相同密碼的 PDF
- 逐檔移除密碼並下載
- 單一檔案失敗不會中止其他檔案

### 合併 PDF

- 依檔案加入順序合併兩個以上 PDF
- 輸出單一 `merged.pdf`

### 拆分 PDF

- 將 PDF 的每一頁拆成獨立 PDF
- 全部結果打包為 `原檔名-split.zip`

### JPG 轉 PDF

- 支援一張或多張 JPG／JPEG
- 每張圖片建立為一頁 PDF
- 輸出單一 `images.pdf`

### PDF 轉 JPG

- 將 PDF 每一頁渲染為 JPG
- 可選擇 96、150 或 300 DPI 輸出解析度
- 全部圖片打包為 `原檔名-jpg.zip`

## 使用方式

1. 從上方選擇需要的工具。
2. 將檔案拖入虛線框，或點擊框內選擇檔案。
3. 檢查檔案清單及所需選項。
4. 點擊處理按鈕並下載結果。

合併、拆分及 PDF 轉 JPG 不直接處理加密 PDF。請先使用「移除密碼」，再將解密後的 PDF 加入其他工具。

## 正式部署

Repository 只保留可直接部署的正式靜態網站：

```text
index.html
assets/
├─ index-*.css
├─ index-*.js
├─ pdf.worker.min-*.mjs
└─ qpdf-*.wasm
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
- 大型 PDF、高解析度 JPG 或大量頁面可能受裝置記憶體限制。
- 拆分與 PDF 轉 JPG 會在完成後產生 ZIP，因此處理期間會占用額外記憶體。
- PDF 處理在瀏覽器執行，大型檔案可能讓介面短暫失去回應。
- 本 repository 不保留開發工具與測試。若需修改或重新建置，可從 Git 歷史還原 source commit `2f61deb`。

## 隱私

本網站沒有後端、資料庫、檔案上傳 API、analytics 或追蹤程式。QPDF WebAssembly、PDF.js worker、JavaScript 與 CSS 均由同一個 GitHub Pages 網站提供。
