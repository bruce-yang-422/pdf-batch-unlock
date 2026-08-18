export class QpdfError extends Error {
  constructor(message, { exitCode, stderr, cause } = {}) {
    super(message, { cause });
    this.name = 'QpdfError';
    this.exitCode = exitCode;
    this.stderr = stderr;
  }
}

export function getUserErrorMessage(error) {
  const details = `${error?.message ?? ''}\n${error?.stderr ?? ''}`.toLowerCase();

  if (/invalid password|incorrect password|password.*incorrect/.test(details)) {
    return '密碼錯誤，請確認後再試一次。';
  }

  if (/out of memory|memory access out of bounds|cannot enlarge memory|allocation failed/.test(details)) {
    return '瀏覽器記憶體不足，請關閉其他分頁或改用較小的 PDF。';
  }

  if (/not a pdf|damaged pdf|invalid pdf|can't find pdf header|unable to find trailer/.test(details)) {
    return '檔案不是有效的 PDF，或 PDF 已損毀。';
  }

  if (/failed to fetch|webassembly|wasm/.test(details)) {
    return '無法載入 PDF 處理元件，請重新整理頁面後再試。';
  }

  return '無法移除密碼。請確認密碼與 PDF 檔案是否正確。';
}
