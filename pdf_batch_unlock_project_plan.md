# PDF 批次移除密碼工具：GitHub Pages 純前端專案規格

> 用途：提供 VS Code 內的 AI Coding 外掛作為專案需求、架構與實作準則。  
> 目標：建立一個可部署至 GitHub Pages 的純前端 PDF 批次解密工具。所有 PDF 必須只在使用者瀏覽器本機處理，不上傳到任何伺服器。

---

## 1. 專案目標

建立一個靜態網站，使用者可以：

1. 一次選擇或拖曳多個 PDF。
2. 所有 PDF 使用同一組已知密碼。
3. 在瀏覽器中使用 QPDF WebAssembly 解密 PDF。
4. 自動依檔案大小選擇處理模式：
   - 小檔案 / 總量較小：批次處理後打包 ZIP 一次下載。
   - 大檔案 / 總量較大：低記憶體模式，逐個解密、逐個下載或提供逐檔下載按鈕。
5. 顯示每個檔案的狀態、錯誤與進度。
6. 不使用後端、不使用資料庫、不上傳檔案。
7. 可直接部署至 GitHub Pages。

---

## 2. 核心技術選型

### 必要技術

- HTML5
- CSS3
- JavaScript ES Modules
- WebAssembly
- QPDF WASM
- JSZip（僅用於小檔批次 ZIP 模式）

### 建議套件

優先評估以下其中一種 QPDF WASM 整合方式：

1. `@neslinesli93/qpdf-wasm`
   - QPDF 編譯為 WebAssembly，可在瀏覽器使用。
   - GitHub：`neslinesli93/qpdf-wasm`

2. 若原套件的 browser integration 不方便，可評估：
   - `qpdf-wasm-esm`
   - 或自行包裝 qpdf-wasm 的 Emscripten FS / Uint8Array I/O。

不要使用 `pdf-lib` 作為 PDF 密碼解密核心。

QPDF CLI 的核心操作概念：

```bash
qpdf --password="PASSWORD" --decrypt input.pdf output.pdf
```

實際 WASM API 依選用的 wrapper 調整，不要假設 Node.js 實體檔案系統存在。

---

## 3. 部署限制

專案必須可以部署到 GitHub Pages，因此：

- 不可依賴 Node.js runtime。
- 不可依賴 PHP、Python、Java、Go 後端。
- 不可依賴 server-side API。
- build 階段可以使用 npm / Vite。
- build 後必須輸出純靜態檔案。
- `.wasm` 資源必須能由 GitHub Pages 正常載入。
- 所有路徑需相容 GitHub Pages 子目錄部署，例如：

```text
https://username.github.io/pdf-unlocker/
```

若使用 Vite，必須正確設定 `base`。

---

## 4. 隱私與安全原則

此工具的重要特性是「完全本機處理」。

必須遵守：

- PDF 不可上傳至任何遠端伺服器。
- 密碼不可傳送至任何遠端伺服器。
- 不可將 PDF 或密碼存入 LocalStorage、IndexedDB、Cookie 或 analytics。
- 不應加入會讀取使用者檔案資訊的第三方分析服務。
- QPDF WASM、JSZip 等依賴建議固定版本並隨專案一起部署，不依賴未知 CDN。

UI 顯示：

> 所有 PDF 均在您的瀏覽器本機處理，不會上傳至任何伺服器。

---

## 5. 使用者流程

```text
進入網站
  ↓
拖曳 / 選擇多個 PDF
  ↓
JavaScript 只讀取 File metadata
  ↓
取得：
- file.name
- file.size
- file.type
  ↓
計算：
- PDF 數量
- 總大小
- 最大單檔大小
  ↓
使用者輸入共同密碼
  ↓
自動判定處理模式
  ├─ Batch ZIP Mode
  └─ Low Memory Mode
  ↓
逐檔呼叫 QPDF WASM
  ↓
顯示每個檔案狀態
  ↓
下載結果
```

---

## 6. 處理模式設計

### 模式 A：Batch ZIP Mode

適合檔案總量較小的情況。

流程：

```text
PDF 1
→ 解密
→ 將輸出加入 ZIP
→ 清除 QPDF WASM input/output

PDF 2
→ 解密
→ 將輸出加入 ZIP
→ 清除 QPDF WASM input/output

...

全部完成
→ 產生 ZIP
→ 一次下載
```

注意：

即使 Batch ZIP Mode，也不要同時平行解密所有 PDF。
仍然必須逐檔處理，只是將完成後的輸出保留給 ZIP。

---

### 模式 B：Low Memory Mode

適合：

- 任一 PDF 過大。
- PDF 總大小過大。
- 行動裝置。
- 瀏覽器可用記憶體較低。

流程：

```text
PDF 1
→ ArrayBuffer
→ WASM FS
→ QPDF 解密
→ Blob
→ 使用者下載
→ 立即清除 WASM FS
→ 釋放 JS reference

PDF 2
→ 重複
```

不可將所有已解密 PDF 同時保留在記憶體。

---

## 7. 模式自動判斷

第一版使用保守的固定門檻。

建議預設值：

```js
const MAX_SINGLE_FILE_FOR_ZIP = 100 * 1024 * 1024; // 100 MB
const MAX_TOTAL_SIZE_FOR_ZIP = 400 * 1024 * 1024;  // 400 MB
const MAX_FILES_FOR_ZIP = 30;
```

判斷：

```js
function chooseProcessingMode(files) {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const maxFileSize = Math.max(...files.map(file => file.size));

  const shouldUseLowMemory =
    maxFileSize >= MAX_SINGLE_FILE_FOR_ZIP ||
    totalSize >= MAX_TOTAL_SIZE_FOR_ZIP ||
    files.length > MAX_FILES_FOR_ZIP;

  return shouldUseLowMemory ? 'low-memory' : 'batch-zip';
}
```

### 可選進階判斷

若瀏覽器支援：

```js
navigator.deviceMemory
```

可以適度降低低 RAM 裝置的門檻，但不可依賴此 API，因為並非所有瀏覽器支援。

例如：

```js
function getThresholds() {
  const ram = navigator.deviceMemory;

  if (ram && ram <= 4) {
    return {
      maxSingle: 60 * 1024 * 1024,
      maxTotal: 250 * 1024 * 1024,
    };
  }

  return {
    maxSingle: 100 * 1024 * 1024,
    maxTotal: 400 * 1024 * 1024,
  };
}
```

---

## 8. 重要記憶體原則

### 禁止

不要：

```js
const buffers = await Promise.all(
  files.map(file => file.arrayBuffer())
);
```

也不要：

```js
await Promise.all(files.map(decryptPDF));
```

因為這會讓大量 PDF 同時進入 JavaScript / WebAssembly 記憶體。

### 必須

採用：

```js
for (const file of files) {
  await processOneFile(file);
}
```

每個檔案完成後，必須：

- `FS.unlink(inputPath)`
- `FS.unlink(outputPath)`
- 清空大型 Uint8Array reference
- 清空 Blob reference（不再需要時）
- `URL.revokeObjectURL(url)`

不要嘗試手動呼叫 GC；JavaScript 無法可靠要求瀏覽器立即 GC。

---

## 9. QPDF WASM I/O 架構

瀏覽器沒有一般本機檔案路徑，因此概念流程應為：

```text
File
 ↓
file.arrayBuffer()
 ↓
Uint8Array
 ↓
Emscripten virtual filesystem
 ↓
/input_xxx.pdf
 ↓
QPDF callMain(...)
 ↓
/output_xxx.pdf
 ↓
FS.readFile()
 ↓
Uint8Array
 ↓
Blob
 ↓
Download / ZIP
```

概念範例：

```js
async function decryptPdf(file, password, qpdf) {
  const id = crypto.randomUUID();
  const inputPath = `/input-${id}.pdf`;
  const outputPath = `/output-${id}.pdf`;

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());

    qpdf.FS.writeFile(inputPath, bytes);

    qpdf.callMain([
      `--password=${password}`,
      '--decrypt',
      inputPath,
      outputPath,
    ]);

    const output = qpdf.FS.readFile(outputPath);

    return new Uint8Array(output);
  } finally {
    try { qpdf.FS.unlink(inputPath); } catch {}
    try { qpdf.FS.unlink(outputPath); } catch {}
  }
}
```

注意：

- 上述只是架構範例。
- AI Coding Agent 必須依實際安裝的 QPDF WASM package API 修正初始化、FS 與 `callMain` 寫法。
- 不可直接假設某一套件 API 與範例完全一致。

---

## 10. 密碼處理

所有 PDF 共用一個密碼。

需求：

```html
<input
  type="password"
  id="password"
  autocomplete="off"
  placeholder="輸入 PDF 密碼"
>
```

UI 需提供：

- 顯示 / 隱藏密碼。
- 不將密碼寫入 URL。
- 不將密碼存入 storage。
- 處理完成後可清空密碼欄。

QPDF 密碼必須作為參數傳入。

需要正確處理：

- 空白。
- 非 ASCII 字元。
- 中文。
- 特殊符號。

不要自行 shell escape，因為 browser WASM `callMain()` 傳入的是 argument array，不是 shell command string。

---

## 11. 錯誤處理

每個 PDF 的錯誤必須獨立，不可因其中一個失敗導致全部停止。

狀態：

```ts
type FileStatus =
  | 'waiting'
  | 'processing'
  | 'success'
  | 'wrong-password'
  | 'invalid-pdf'
  | 'memory-error'
  | 'failed';
```

流程：

```js
for (const item of queue) {
  try {
    item.status = 'processing';

    const output = await decryptPdf(item.file, password);

    item.status = 'success';
  } catch (error) {
    item.status = classifyError(error);
  }
}
```

### UI 錯誤文字

例如：

```text
✓ invoice-01.pdf       完成
✕ invoice-02.pdf       密碼錯誤
✕ scan.pdf             無法讀取 PDF
✕ archive.pdf          記憶體不足，請改用低記憶體模式
○ invoice-05.pdf       等待中
```

如果 Batch ZIP Mode 過程出現記憶體錯誤：

1. 停止目前 ZIP 模式。
2. 清除暫存。
3. 提示使用者切換 Low Memory Mode。
4. 不自動重新解密大量已完成檔案，除非設計上有可靠方式。

---

## 12. 下載策略

### Batch ZIP Mode

使用 JSZip：

```js
const zip = new JSZip();

for (...) {
  const output = await decryptPdf(...);
  zip.file(outputName, output);
}

const zipBlob = await zip.generateAsync({
  type: 'blob',
  compression: 'STORE',
});
```

建議優先 `STORE`，因 PDF 本身通常已壓縮；再次 DEFLATE 可能增加 CPU / RAM，但壓縮收益有限。

ZIP 名稱：

```text
pdf-unlocked-YYYYMMDD-HHmm.zip
```

### Low Memory Mode

不要累積輸出。

建議兩種 UI：

#### 方案 1：逐檔產生下載按鈕

```text
✓ A.pdf  [下載]
✓ B.pdf  [下載]
```

但注意：如果 Blob 被保留，仍會占用記憶體。

因此真正低記憶體模式最好採：

#### 方案 2：完成一個立即要求下載

```text
處理 A.pdf
→ 下載
→ 釋放
→ 處理 B.pdf
```

瀏覽器可能限制網站自動連續下載多個檔案。
因此 UI 必須提示使用者可能需要允許「多個檔案下載」。

更穩定的方案：

```text
[處理並下載下一個]
```

每次由使用者手勢觸發下一檔。

---

## 13. 建議 UI

### Header

```text
PDF 批次移除密碼
```

副標：

```text
所有檔案均在您的瀏覽器本機處理，不會上傳至任何伺服器。
```

### Drop Zone

```text
┌────────────────────────────────────┐
│                                    │
│     將 PDF 拖曳到這裡              │
│                                    │
│       [ 選擇 PDF 檔案 ]            │
│                                    │
└────────────────────────────────────┘
```

支援：

- click file picker
- dragenter
- dragover
- drop
- multiple files
- `.pdf`

### Summary

```text
已選擇：14 個 PDF
總大小：327 MB
最大檔案：52 MB
模式：批次 ZIP
```

如果進入 Low Memory Mode：

```text
偵測到大型檔案
已自動切換為低記憶體模式。
PDF 將逐個處理，避免瀏覽器記憶體不足。
```

### File List

```text
檔案名稱                 大小       狀態
------------------------------------------------
invoice-01.pdf            21 MB      等待中
invoice-02.pdf            34 MB      等待中
scan-2026.pdf             118 MB     等待中
```

提供：

- 移除單檔
- 清除全部

處理開始後應鎖定 queue，避免中途修改導致狀態錯亂。

---

## 14. 建議專案結構

若使用 Vite：

```text
pdf-batch-unlocker/
├─ public/
│  └─ wasm/
│     ├─ qpdf.wasm
│     └─ 其他 QPDF runtime assets
│
├─ src/
│  ├─ main.js
│  ├─ style.css
│  │
│  ├─ core/
│  │  ├─ qpdf.js
│  │  ├─ decrypt.js
│  │  ├─ processing-mode.js
│  │  ├─ download.js
│  │  └─ errors.js
│  │
│  ├─ ui/
│  │  ├─ dropzone.js
│  │  ├─ file-list.js
│  │  ├─ progress.js
│  │  └─ notifications.js
│  │
│  └─ utils/
│     ├─ format-size.js
│     └─ filename.js
│
├─ index.html
├─ package.json
├─ vite.config.js
├─ README.md
└─ PROJECT_PLAN.md
```

若專案非常小，也可先：

```text
index.html
style.css
app.js
qpdf.js
qpdf.wasm
```

但建議正式版本使用模組化結構。

---

## 15. JavaScript 模組職責

### `core/qpdf.js`

負責：

- 初始化 QPDF WASM。
- singleton module instance。
- WASM asset path。
- capture stdout / stderr。
- reset / cleanup。

API 建議：

```js
export async function initQpdf();
export function getQpdf();
```

### `core/decrypt.js`

```js
export async function decryptPdf(file, password);
```

只負責單一 PDF 解密。

不要把 ZIP、UI、下載邏輯混在此模組。

### `core/processing-mode.js`

```js
export function analyzeFiles(files);
export function chooseProcessingMode(files);
```

回傳：

```js
{
  fileCount,
  totalSize,
  maxFileSize,
  mode,
  reason,
}
```

### `core/download.js`

```js
export function downloadBlob(blob, filename);
export async function createZip(results);
```

### `core/errors.js`

QPDF stderr → 使用者可讀訊息。

```js
export function classifyQpdfError(error, stderr);
```

---

## 16. Queue 資料結構

```js
const queue = [
  {
    id: crypto.randomUUID(),
    file: File,
    name: 'a.pdf',
    size: 123456,
    status: 'waiting',
    progress: 0,
    error: null,
  },
];
```

不要在 queue 裡儲存原始 ArrayBuffer。

`File` 物件本身只代表 browser File handle / Blob reference，直到真正呼叫 `arrayBuffer()` 才會讀入記憶體。

---

## 17. Web Worker

第一版可不使用 Web Worker，但正式版本建議加入。

理由：QPDF WASM 是 CPU-heavy 工作，如果直接在 main thread 執行，UI 可能暫時卡住。

架構：

```text
Main Thread
  ↓
postMessage
  ↓
QPDF Worker
  ↓
WASM
  ↓
postMessage result
```

注意：

- ArrayBuffer 應使用 Transferable，避免額外複製。
- 不要同時啟動多個 QPDF worker 處理不同 PDF。
- 預設只維持 1 個 worker。

概念：

```js
worker.postMessage(
  { buffer, password, filename },
  [buffer]
);
```

---

## 18. GitHub Pages + Vite

`vite.config.js`：

```js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/pdf-batch-unlocker/',
});
```

如果 repository 名稱不同，必須同步修改。

部署可以使用 GitHub Actions：

```text
npm install
npm run build
publish dist/
```

或使用 GitHub Pages 官方 Actions workflow。

確保：

- `.wasm` 在 build 後路徑正確。
- MIME type 正確。
- 不使用 root absolute path `/xxx`，除非有正確 base handling。

---

## 19. GitHub Pages 相容性要求

至少測試：

- Chrome desktop
- Edge desktop
- Firefox desktop
- Safari desktop
- Chrome Android
- Safari iOS

注意：

- `navigator.deviceMemory` 不是跨瀏覽器標準保證功能。
- 多檔自動下載可能被瀏覽器阻擋。
- 行動裝置的記憶體限制通常更嚴格。

不應保證超大型 PDF 一定成功。

UI 應提示：

```text
若單一 PDF 非常大，瀏覽器可能因裝置記憶體限制而無法完成處理。
```

---

## 20. 檔案大小 UX 規則

建議：

| 狀況 | 行為 |
|---|---|
| < 100 MB / file，總量 < 400 MB | Batch ZIP |
| 任一 ≥ 100 MB | Low Memory |
| 總量 ≥ 400 MB | Low Memory |
| 行動低記憶體裝置 | Lower threshold |
| 單一 > 500 MB | 顯示警告 |
| 單一 > 1 GB | 強烈警告，不保證成功 |

這些數值是產品策略，不是 WebAssembly 的硬性物理界線。
必須以「保守安全門檻」描述，且未來可以設定成 config。

例如：

```js
export const PROCESSING_CONFIG = {
  zipMaxSingleFileBytes: 100 * 1024 ** 2,
  zipMaxTotalBytes: 400 * 1024 ** 2,
  largeFileWarningBytes: 500 * 1024 ** 2,
};
```

---

## 21. 檔名處理

原檔：

```text
invoice.pdf
```

輸出預設：

```text
invoice-unlocked.pdf
```

避免：

```text
invoice.pdf.pdf
invoice-unlocked-unlocked.pdf
```

重複檔名時應自動：

```text
invoice-unlocked.pdf
invoice-unlocked (2).pdf
invoice-unlocked (3).pdf
```

---

## 22. 不需要的功能

MVP 不實作：

- PDF 預覽。
- PDF 編輯。
- OCR。
- 合併 PDF。
- 拆分 PDF。
- PDF 壓縮。
- 雲端儲存。
- 登入。
- 使用者帳號。
- 後端。
- API key。
- Serverless Functions。

只專注：

```text
批次輸入 → 相同密碼 → 移除 PDF 密碼 → 下載
```

---

## 23. MVP 開發順序

### Phase 1：單檔 POC

完成：

- 選擇單一 PDF。
- 輸入密碼。
- QPDF WASM 初始化。
- 解密。
- 下載輸出。

必須先確認真正 browser-only 可行，再做 UI。

### Phase 2：多檔 Queue

完成：

- multiple input。
- drag and drop。
- queue。
- 共用密碼。
- sequential processing。

### Phase 3：模式判定

完成：

- total size。
- max file size。
- batch / low-memory 自動切換。

### Phase 4：ZIP

完成：

- JSZip。
- Batch ZIP Mode。
- ZIP progress。

### Phase 5：Low Memory UX

完成：

- 大檔逐檔處理。
- 逐檔下載。
- memory cleanup。
- 瀏覽器多檔下載提示。

### Phase 6：Worker

將 QPDF 移至 Web Worker，避免 UI freeze。

### Phase 7：GitHub Pages

完成：

- Vite build。
- GitHub Actions deployment。
- base URL。
- production WASM loading。

---

## 24. 驗收條件

### 功能驗收

- [ ] 可一次選 10 個以上 PDF。
- [ ] 可拖曳多個 PDF。
- [ ] 只需輸入一次共同密碼。
- [ ] 正確密碼可以解密 PDF。
- [ ] 解密後 PDF 再開啟不需要密碼。
- [ ] 單一密碼錯誤不會中止其他檔案。
- [ ] 自動依檔案大小切換處理模式。
- [ ] Batch Mode 可產生 ZIP。
- [ ] Low Memory Mode 不累積所有輸出。
- [ ] 每個 PDF 都有狀態。
- [ ] 支援中文檔名。
- [ ] 支援中文 / 特殊字元密碼。

### 隱私驗收

Chrome DevTools Network 中，在處理 PDF 時：

- [ ] 沒有 PDF upload request。
- [ ] 沒有 password request。
- [ ] 沒有呼叫自建 API。

### 記憶體驗收

測試：

```text
20 × 10 MB
10 × 50 MB
3 × 150 MB
1 × 500 MB
```

觀察：

- 不允許一次讀取所有檔案 ArrayBuffer。
- 大檔必須自動 Low Memory Mode。
- 每檔結束後 WASM FS 不保留 input/output。

---

## 25. AI Coding Agent 實作規則

AI 在修改此專案時必須遵守：

1. 不新增任何後端服務。
2. 不新增 PDF upload API。
3. 不把 PDF 傳到第三方服務。
4. 不把密碼寫入 storage。
5. 不平行處理多個大型 PDF。
6. 不一次 `arrayBuffer()` 所有 File。
7. 所有 QPDF input/output 必須在每檔處理後 cleanup。
8. 新增 dependency 前先說明用途。
9. 優先使用瀏覽器原生 API。
10. 保持 GitHub Pages 靜態部署相容。
11. 修改核心處理流程時，必須同時考慮 WASM 記憶體占用。
12. 不要自行假設 QPDF WASM package API；以目前實際安裝版本文件 / source 為準。
13. QPDF integration 必須先完成最小 POC 測試，再封裝 abstraction。
14. UI 錯誤訊息不得直接只顯示難懂的 WASM stack trace。
15. 保留原始 stderr 供 console debug，但 UI 顯示轉譯後訊息。

---

## 26. 建議先讓 AI 執行的第一個任務

請先不要一次完成整個網站。

第一個任務：

```text
請依 PROJECT_PLAN.md 建立最小可運行 POC。

要求：
1. 使用 Vite。
2. 整合 QPDF WASM。
3. 單一 PDF input。
4. 一個 password input。
5. 點擊按鈕後，在瀏覽器本機執行 QPDF --decrypt。
6. 成功後下載 unlocked PDF。
7. 不製作複雜 UI。
8. 不先加入 JSZip。
9. 不先加入 Web Worker。
10. 確認 npm run build 後可在靜態網站環境正常執行。

完成後請說明：
- 使用哪個 QPDF WASM package / fork / wrapper。
- WASM 如何載入。
- File 如何寫入 WASM FS。
- output 如何讀回。
- 如何捕捉 QPDF error。
- production build 是否可執行。
```

原因：QPDF WASM 的 browser I/O 是此專案最大技術風險，應先驗證，不應先投入完整 UI。

---

## 27. 第二個任務

POC 成功後：

```text
將單檔 POC 改為多檔 queue。

要求：
- input multiple
- drag/drop
- 相同密碼
- sequential processing only
- 不使用 Promise.all 解密 PDF
- 顯示 waiting / processing / success / failed
- 每檔完成立即 cleanup WASM FS
```

---

## 28. 第三個任務

```text
加入 processing mode 判定。

Batch ZIP Mode：
- max single < 100 MB
- total < 400 MB
- 逐檔解密
- JSZip 收集結果
- 最後下載一個 ZIP

Low Memory Mode：
- 任一 >= 100 MB
或 total >= 400 MB
- 逐檔解密與下載
- 不保留全部 decrypted PDF
```

所有 threshold 必須集中放在 config，不可散落 hardcode。

---

## 29. 最終產品核心原則

此專案最重要的不是「一次處理越多越好」，而是：

```text
Browser-only
Privacy-first
Sequential processing
Memory-aware
Graceful failure
GitHub Pages compatible
```

當「便利」與「記憶體安全」衝突時，優先記憶體安全。

當「自動下載」與「瀏覽器安全限制」衝突時，優先提供明確 UI 讓使用者手動觸發下一次下載。

---

## 30. 技術參考

AI Coding Agent 在整合前應查閱目前版本的官方 / 原始專案文件：

- QPDF 官方文件：QPDF command line / encryption / decrypt options
- QPDF 官方 GitHub：`qpdf/qpdf`
- qpdf-wasm：`neslinesli93/qpdf-wasm`
- Emscripten：Memory growth / file system / WebAssembly runtime settings
- JSZip：Browser API
- Vite：GitHub Pages deployment / base path

由於 qpdf-wasm 是第三方 WebAssembly build，API、runtime asset 與 browser integration 可能隨版本變更。實作時應以實際 lockfile 版本與 source code 為準，不要只依賴舊範例。

---

## 31. 完成定義

完成版本必須符合：

```text
使用者開啟 GitHub Pages
→ 選擇多個 PDF
→ 輸入共同密碼
→ 網站判斷大小
→ 小量走 ZIP
→ 大量走逐檔低記憶體流程
→ PDF 全程不離開本機瀏覽器
→ 使用者取得已移除密碼的 PDF
```

