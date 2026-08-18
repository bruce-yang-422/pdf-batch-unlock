# PDF 本機工具箱

前台網址：<https://bruce-yang-422.github.io/pdf-batch-unlock/>

純前端的 PDF 多功能工具。所有 PDF、圖片與密碼只會在瀏覽器本機處理，不會上傳、儲存或傳送至任何伺服器。

介面支援電腦與手機瀏覽器。電腦版使用頁籤切換工具，手機版則使用下拉選單，檔案清單與操作按鈕也會依螢幕寬度自動調整。

電腦版採左右雙欄工作區：左側匯入與設定，右側顯示目前檔案及本次瀏覽器工作階段的處理歷程。歷程不保存檔案內容，重新整理頁面後即清除。

處理歷程可展開查看逐檔結果、輸出檔名與耗時，並可在重新整理前再次下載。輸出資料只暫存在記憶體，可逐筆或一次全部釋放。

## 功能

### 移除密碼

- 一次選擇或拖入多個使用相同密碼的 PDF
- 逐檔移除密碼；兩個以上檔案會將成功結果打包為單一 ZIP 下載
- 單一檔案失敗不會中止其他檔案

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

- 建立每頁縮圖，可拖曳或使用方向按鈕調整順序
- 可選取頁面後旋轉、刪除或擷取成獨立 PDF
- 套用目前頁面順序與旋轉角度後輸出新 PDF

### 浮水印與頁碼

- 加入文字浮水印並設定透明度、位置與旋轉角度
- 支援中文浮水印，使用瀏覽器本機字型繪製
- 可自動在每頁下方加入頁碼

## 使用方式

1. 從上方頁籤選擇工具；手機版請使用「選擇工具」下拉選單。
2. 將檔案拖入虛線框，或點擊框內選擇檔案。
3. 檢查檔案清單及所需選項。
4. 點擊處理按鈕並下載結果。

合併、拆分及 PDF 轉 JPG 不直接處理加密 PDF。請先使用「移除密碼」，再將解密後的 PDF 加入其他工具。

## 正式部署

Repository 只保留可直接部署的正式靜態網站：

```text
.gitignore
README.md
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
- JPG 轉 PDF 的 DPI 不會提升原始圖片畫質，因此不提供 DPI 設定。
- PDF 轉 JPG 的 DPI 會決定輸出像素尺寸；300 DPI 會使用較多記憶體與儲存空間。
- 大型 PDF、高解析度圖片或大量頁面可能受裝置記憶體限制，手機上尤其明顯。
- 拆分與 PDF 轉 JPG 會在完成後產生 ZIP，因此處理期間會占用額外記憶體。
- PDF 處理在瀏覽器執行，大型檔案可能讓介面短暫失去回應。
- 本 repository 的最新版只保留正式網站檔案，不包含開發工具與測試。若需修改或重新建置，可從 Git 歷史還原 source commit `5eb0190`。

## 隱私

本網站沒有後端、資料庫、檔案上傳 API、analytics 或追蹤程式。QPDF WebAssembly、PDF.js worker、JavaScript 與 CSS 均由同一個 GitHub Pages 網站提供。
