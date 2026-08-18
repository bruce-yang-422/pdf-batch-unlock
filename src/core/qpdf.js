import createQpdfModule from '@neslinesli93/qpdf-wasm';
import qpdfWasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';

let instancePromise;
let stdoutBytes = [];
let stderrBytes = [];

function captureByte(target) {
  return (byte) => {
    if (byte !== null && byte !== undefined) target.push(byte);
  };
}

function decodeAndClear(target) {
  const text = new TextDecoder().decode(Uint8Array.from(target));
  target.length = 0;
  return text.trim();
}

export function clearQpdfOutput() {
  stdoutBytes.length = 0;
  stderrBytes.length = 0;
}

export function readQpdfOutput() {
  return {
    stdout: decodeAndClear(stdoutBytes),
    stderr: decodeAndClear(stderrBytes),
  };
}

export async function initQpdf() {
  if (!instancePromise) {
    instancePromise = createQpdfModule({
      locateFile: () => qpdfWasmUrl,
      noInitialRun: true,
      preRun: [
        (module) => {
          module.FS.init(
            null,
            captureByte(stdoutBytes),
            captureByte(stderrBytes),
          );
        },
      ],
    }).catch((error) => {
      instancePromise = undefined;
      throw error;
    });
  }

  return instancePromise;
}
