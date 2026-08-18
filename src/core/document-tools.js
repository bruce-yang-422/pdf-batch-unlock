import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function baseName(filename) {
  return filename.replace(/\.(pdf|jpe?g)$/i, '');
}

function numberedName(name, pageNumber, extension) {
  return `${baseName(name)}-${String(pageNumber).padStart(3, '0')}.${extension}`;
}

async function loadPdf(file) {
  return PDFDocument.load(await file.arrayBuffer());
}

export async function mergePdfs(files, onProgress = () => {}) {
  const output = await PDFDocument.create();

  for (let index = 0; index < files.length; index += 1) {
    const source = await loadPdf(files[index]);
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
    onProgress(index + 1, files.length, files[index].name);
  }

  return {
    bytes: await output.save(),
    filename: 'merged.pdf',
    type: 'application/pdf',
  };
}

export async function splitPdf(file, onProgress = () => {}) {
  const source = await loadPdf(file);
  const pageCount = source.getPageCount();
  const zip = new JSZip();

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const output = await PDFDocument.create();
    const [page] = await output.copyPages(source, [pageIndex]);
    output.addPage(page);
    zip.file(numberedName(file.name, pageIndex + 1, 'pdf'), await output.save());
    onProgress(pageIndex + 1, pageCount, `第 ${pageIndex + 1} 頁`);
  }

  return {
    blob: await zip.generateAsync({ type: 'blob', compression: 'STORE' }),
    filename: `${baseName(file.name)}-split.zip`,
  };
}

export async function jpgsToPdf(files, onProgress = () => {}) {
  const output = await PDFDocument.create();

  for (let index = 0; index < files.length; index += 1) {
    const image = await output.embedJpg(await files[index].arrayBuffer());
    const page = output.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    onProgress(index + 1, files.length, files[index].name);
  }

  return {
    bytes: await output.save(),
    filename: 'images.pdf',
    type: 'application/pdf',
  };
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('無法建立 JPG 圖片。'))),
      type,
      quality,
    );
  });
}

export async function pdfToJpg(file, { scale = 2, quality = 0.9 } = {}, onProgress = () => {}) {
  const loadingTask = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = await loadingTask.promise;
  const zip = new JSZip();

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: false });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: context, viewport }).promise;
      zip.file(numberedName(file.name, pageNumber, 'jpg'), await canvasToBlob(canvas, 'image/jpeg', quality));

      page.cleanup();
      canvas.width = 0;
      canvas.height = 0;
      onProgress(pageNumber, pdf.numPages, `第 ${pageNumber} 頁`);
    }
  } finally {
    await loadingTask.destroy();
  }

  return {
    blob: await zip.generateAsync({ type: 'blob', compression: 'STORE' }),
    filename: `${baseName(file.name)}-jpg.zip`,
  };
}
