# PDF 本機工具箱瀏覽器外掛

Google Chrome 和 Microsoft Edge 共用同一個 Manifest V3 外掛。點擊工具列圖示即可在獨立分頁開啟 PDF 工作區。

- `dist/` 是開發測試用的未封裝外掛。
- `release/` 存放依 manifest 版本命名的 ZIP，可用來提交 Chrome Web Store 或 Microsoft Edge Add-ons。

`dist/` 將工作區與法律頁的腳本、樣式集中在 `assets/`。三個法律頁共用 `legal.html`。瀏覽器管理頁的原生翻譯各自放在 `_locales/`，PDF worker 和 WebAssembly 則保留為可離線載入的資產。

## 本機安裝

1. Chrome 開啟 `chrome://extensions`，Edge 開啟 `edge://extensions`。
2. 開啟「開發人員模式」，按下「載入未封裝」。
3. 選取本專案的 `browser-extension/dist/` 目錄。
4. 從瀏覽器的擴充功能選單點擊「PDF 本機工具箱」。也可將圖示釘選到工具列。

PDF 移除／加入密碼、合併、拆分、頁面管理、浮水印及 PDF／JPG 轉檔均在瀏覽器中處理。外掛自帶 PDF.js worker 和 WebAssembly，可離線使用，無需授予網站存取權限。

- 「外觀」可選跟隨系統、淺色及深色。語言和外觀偏好會保存在本機。
- 工作區與法律頁沿用網站語言：工作區、隱私權政策、使用條款各 13 種，開源軟體授權 3 種。外掛管理頁與工具列的名稱依瀏覽器介面語言顯示。
- 隱私權政策包含外掛專用的本機儲存和離線使用說明。

## 同步主站改動

主站更新後，在專案根目錄使用 Node.js 22 執行下列指令，將工作區、PDF 引擎、翻譯及法律頁同步到 `dist/`，再到瀏覽器的外掛管理頁按「重新載入」。

```powershell
node browser-extension/build.mjs
```

要同步建置並更新 `release/` 的 ZIP，執行：

```powershell
pwsh -File browser-extension/package.ps1
```

外掛專用 UI 的原始檔是 `extension-ui.js`、`theme.js` 和 `theme.css`。請在 `manifest.json` 更新版本號，再重新封裝。
