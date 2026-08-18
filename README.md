# PDF Batch Unlocker

前台網址：<https://bruce-yang-422.github.io/pdf-batch-unlock/>

純前端的 PDF 批次移除密碼工具。使用者可一次選擇或拖入多個 PDF，輸入共同密碼後，網站會在瀏覽器中逐檔解密並下載結果。

> PDF 與密碼只會在瀏覽器本機處理，不會上傳、儲存或傳送至任何伺服器。

## 功能

- 點擊選擇或拖放多個 PDF
- 所有檔案共用一組密碼
- 逐檔解密，避免同時載入所有檔案
- 顯示等待、處理中、完成及錯誤狀態
- 單一檔案失敗不會中止其他檔案
- 自動略過非 PDF 與重複檔案
- 支援中文檔名及特殊字元密碼
- 解密結果命名為 `原檔名-unlocked.pdf`

## 使用方式

1. 將 PDF 拖入頁面的虛線框，或點擊框內選擇多個檔案。
2. 輸入所有 PDF 共用的密碼。
3. 點擊「全部移除密碼並下載」。
4. 若瀏覽器詢問權限，請允許網站下載多個檔案。

## 正式部署

Repository 只保留已建置完成的靜態網站：

```text
index.html
assets/
├─ index-*.css
├─ index-*.js
└─ qpdf-*.wasm
```

GitHub Pages 設定：

```text
Settings → Pages → Build and deployment
Source: Deploy from a branch
Branch: main / (root)
```

不需要 Node.js、npm、GitHub Actions、後端或 API key。`index.html` 會直接載入根目錄 `assets/` 中的正式 CSS、JavaScript 與 QPDF WASM，網址不會導向 `/docs/`。

## 注意事項

- 所有 PDF 必須使用相同密碼。
- 瀏覽器可能要求允許連續下載多個檔案。
- 大型 PDF 可能受裝置記憶體限制。
- QPDF 在主執行緒執行，處理大型檔案時介面可能短暫失去回應。
- 本 repository 已移除開發原始碼、建置工具與測試；若需恢復開發，請從 Git 歷史中還原 commit `5a68162` 或更早版本。

## 隱私

本網站沒有後端、資料庫、檔案上傳 API、analytics 或追蹤程式。QPDF WebAssembly、JavaScript 與 CSS 均由同一個 GitHub Pages 網站提供。
