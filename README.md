# PDF 移除密碼（瀏覽器 POC）

這是 `pdf_batch_unlock_project_plan.md` 的瀏覽器版本。它可透過檔案選擇器或拖放加入多個 PDF，並使用同一組已知密碼逐檔移除加密；PDF 與密碼不會送往伺服器，也不會寫入瀏覽器儲存空間。

## 開發與建置

需求：Node.js 20.19+ 或 22.12+。

```bash
npm install
npm run dev
npm run build
npm run preview
npm run test:browser
```

`dist/` 是可部署至 GitHub Pages 的純靜態輸出。Vite 使用相對 `base`，因此可部署在任意 repository 子目錄。

瀏覽器 smoke test 需要 Windows 上預設位置的 Chrome（也可用 `CHROME_PATH` 指定）。測試會在 QPDF WASM 內建立加密 PDF，驗證錯誤密碼分類、正確密碼解密與輸出 PDF 完整性。

## POC 架構

- `@neslinesli93/qpdf-wasm@0.3.0` 提供 QPDF、Emscripten runtime 與虛擬檔案系統。
- Vite 將套件內的 `qpdf.wasm` 複製並加上內容雜湊，`locateFile` 使用建置後 URL 載入它；沒有使用 CDN。
- 選取的 `File` 只在送出表單後轉為 `Uint8Array`，寫入 WASM MEMFS。
- 執行參數等同 `qpdf --password=… --decrypt -- input.pdf output.pdf`。
- 輸出從 MEMFS 讀為新的 `Uint8Array`，再建立短期 Blob URL 下載。
- 無論成功或失敗，`finally` 都會刪除 MEMFS 的 input/output；Blob URL 下載後也會撤銷。
- stdout/stderr 由 Emscripten FS callback 擷取。完整 stderr 只送到開發者主控台，畫面顯示分類後的中文訊息。

## 範圍

目前包含多檔 queue、拖放、逐檔狀態與 sequential processing。尚未加入依檔案大小切換的 ZIP 模式與 Web Worker。
