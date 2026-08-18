import { QpdfError } from './errors.js';
import { clearQpdfOutput, initQpdf, readQpdfOutput } from './qpdf.js';

function makePath(kind) {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `/${kind}-${id}.pdf`;
}

function safeUnlink(fs, path) {
  try {
    fs.unlink(path);
  } catch {
    // The output is not created when qpdf rejects the input. Cleanup remains best-effort.
  }
}

export async function decryptPdf(file, password) {
  const qpdf = await initQpdf();
  const inputPath = makePath('input');
  const outputPath = makePath('output');
  let inputBytes;

  clearQpdfOutput();

  try {
    inputBytes = new Uint8Array(await file.arrayBuffer());
    qpdf.FS.writeFile(inputPath, inputBytes);

    const exitCode = qpdf.callMain([
      `--password=${password}`,
      '--decrypt',
      '--',
      inputPath,
      outputPath,
    ]);
    const output = readQpdfOutput();

    if (output.stderr) console.debug('[qpdf stderr]', output.stderr);

    let result;
    try {
      result = qpdf.FS.readFile(outputPath).slice();
    } catch (cause) {
      throw new QpdfError('QPDF did not create an output file.', {
        exitCode,
        stderr: output.stderr,
        cause,
      });
    }

    // QPDF exit code 3 means warnings; a valid output is still safe to return.
    if (exitCode !== 0 && exitCode !== 3) {
      throw new QpdfError(`QPDF exited with code ${exitCode}.`, {
        exitCode,
        stderr: output.stderr,
      });
    }

    return result;
  } catch (error) {
    if (error instanceof QpdfError) throw error;

    const output = readQpdfOutput();
    if (output.stderr) console.debug('[qpdf stderr]', output.stderr);
    throw new QpdfError(error?.message ?? 'QPDF failed.', {
      stderr: output.stderr,
      cause: error,
    });
  } finally {
    safeUnlink(qpdf.FS, inputPath);
    safeUnlink(qpdf.FS, outputPath);
    inputBytes = undefined;
  }
}
