import { decryptPdf } from '../src/core/decrypt.js';
import { getUserErrorMessage } from '../src/core/errors.js';
import { clearQpdfOutput, initQpdf, readQpdfOutput } from '../src/core/qpdf.js';

const result = document.querySelector('#result');
const encoder = new TextEncoder();

function createMinimalPdf() {
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] >>\nendobj\n',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const object of objects) {
    offsets.push(encoder.encode(pdf).length);
    pdf += object;
  }
  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return encoder.encode(pdf);
}

try {
  const qpdf = await initQpdf();
  const plainPath = '/smoke-plain.pdf';
  const encryptedPath = '/smoke-encrypted.pdf';
  qpdf.FS.writeFile(plainPath, createMinimalPdf());
  clearQpdfOutput();
  const encryptExit = qpdf.callMain([
    plainPath,
    '--encrypt',
    'correct horse',
    'owner password',
    '256',
    '--',
    encryptedPath,
  ]);
  const encryptLog = readQpdfOutput();
  if (encryptExit !== 0) throw new Error(`Encryption failed (${encryptExit}): ${encryptLog.stderr}`);

  const encrypted = qpdf.FS.readFile(encryptedPath).slice();
  qpdf.FS.unlink(plainPath);
  qpdf.FS.unlink(encryptedPath);

  const file = new File([encrypted], 'smoke.pdf', { type: 'application/pdf' });
  try {
    await decryptPdf(file, 'wrong password');
    throw new Error('Wrong password unexpectedly succeeded');
  } catch (error) {
    if (!getUserErrorMessage(error).includes('密碼錯誤')) {
      throw new Error(`Wrong password was not classified correctly: ${error.stderr ?? error}`);
    }
  }

  const decrypted = await decryptPdf(file, 'correct horse');
  const header = new TextDecoder().decode(decrypted.subarray(0, 8));
  if (!header.startsWith('%PDF-')) throw new Error(`Unexpected output header: ${header}`);

  qpdf.FS.writeFile('/smoke-check.pdf', decrypted);
  clearQpdfOutput();
  const checkExit = qpdf.callMain(['--check', '/smoke-check.pdf']);
  const checkLog = readQpdfOutput();
  qpdf.FS.unlink('/smoke-check.pdf');
  if (checkExit !== 0) throw new Error(`Output validation failed (${checkExit}): ${checkLog.stderr}`);

  result.textContent = `PASS: decrypted ${encrypted.byteLength} bytes to ${decrypted.byteLength} bytes`;
} catch (error) {
  console.error(error);
  result.textContent = `FAIL: ${error.stack ?? error}`;
}
