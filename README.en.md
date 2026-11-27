# PDF Toolbox

[繁體中文](README.md) · **English** · [日本語](README.ja.md)

[![Website](https://img.shields.io/badge/website-pdf.stack--base.com-147d6f?style=flat-square)](https://pdf.stack-base.com/)
[![Latest release](https://img.shields.io/github/v/release/bruce-yang-422/pdf-batch-unlock?style=flat-square)](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/latest)
[![License](https://img.shields.io/github/license/bruce-yang-422/pdf-batch-unlock?style=flat-square)](LICENSE)
[![Local processing](https://img.shields.io/badge/processing-100%25%20local-0f766e?style=flat-square)](https://pdf.stack-base.com/privacy/)

A free, open-source PDF toolbox that works without uploads. PDFs, images, and passwords are processed entirely in your browser and are never sent to this site's servers.

**[Open the web app](https://pdf.stack-base.com/?lang=en)** · **[Download the Chrome/Edge extension v1.1.2](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/download/v1.1.2/pdf-toolbox-v1.1.2.zip)**

## Features

- Remove PDF passwords in batches and download multiple results as a ZIP
- Protect PDFs with AES-256 open passwords
- Merge PDFs or split them into individual pages
- Reorder, rotate, delete, and extract PDF pages
- Place 2 or 4 pages on A3, A4, or A5 sheets with layout recommendations and scale warnings
- Add text/image watermarks and page numbers, then inspect the actual output before downloading
- Convert PDFs to JPG at 96, 150, or 300 DPI
- Combine JPG/JPEG images into a PDF
- Install as a PWA or a Chrome/Microsoft Edge extension
- Use light, dark, or system themes in 13 interface languages
- Responsive desktop UI and a mobile app bar with drawer navigation

## Privacy by design

- No backend, accounts, database, analytics, or advertising trackers
- Documents and generated output remain in memory for the current browser session
- `localStorage` stores only language, appearance, and PWA prompt preferences
- Cache Storage contains application assets only, never user documents

Only process documents you own or are authorized to use. See the [Privacy Policy](https://pdf.stack-base.com/privacy/?lang=en) and [Terms of Use](https://pdf.stack-base.com/terms/?lang=en) for details.

## How to use

1. Select a tool.
2. Drop files into the upload area or choose them from your device.
3. Adjust file order and processing options when needed.
4. Run the operation and review the result.
5. Download the PDF, JPG, or ZIP. Tools with preview support let you inspect the actual output first.

On desktop, switch tools from the top navigation. On mobile, open the tool drawer from the app bar; appearance and language controls are under **Preferences**.

> Merge, split, and PDF-to-JPG do not directly support encrypted PDFs. Remove the password first, then process the decrypted copy.

## Ways to use the toolbox

### Web app

Open <https://pdf.stack-base.com/?lang=en>. No registration or file upload is required.

### PWA

Open the site in a browser with PWA support and choose **Install app**. The installed app can launch from your desktop or home screen, and cached application assets remain available offline.

### Browser extension

1. Download and extract [pdf-toolbox-v1.1.2.zip](https://github.com/bruce-yang-422/pdf-batch-unlock/releases/download/v1.1.2/pdf-toolbox-v1.1.2.zip).
2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the extracted directory containing `manifest.json`.

Official installation guides: [Google Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) · [Microsoft Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading)

## Run locally

The repository contains a prebuilt static site. No npm install is required.

```bash
git clone https://github.com/bruce-yang-422/pdf-batch-unlock.git
cd pdf-batch-unlock
python -m http.server 8080
```

Open <http://localhost:8080/>. Do not open `index.html` directly with `file://`; Service Workers, Web Workers, and WebAssembly require an HTTP origin.

## Development and packaging

Requirements: Node.js 22 and PowerShell 7 for ZIP packaging.

```bash
# Rebuild the unpacked browser extension
node browser-extension/build.mjs

# Review generated files
git diff -- browser-extension/dist
```

```powershell
# Create browser-extension/release/pdf-toolbox-v<version>.zip
pwsh -File browser-extension/package.ps1
```

Update the version in `browser-extension/manifest.json` before a release. `browser-extension/dist/` is generated output and should not be edited directly.

### Core technologies

| Technology | Purpose |
| --- | --- |
| QPDF WebAssembly | Password removal and AES-256 encryption |
| pdf-lib | Merge, split, page layout, watermarking, and JPG-to-PDF |
| PDF.js | Page previews, thumbnails, and PDF-to-JPG |
| JSZip | Packaging multi-file results |
| Web Crypto API | Cryptographically secure password generation |
| Service Worker | PWA and offline caching |

UI enhancements and mobile navigation live in `assets/ui-polish.js` and `assets/ui-polish.css`; N-up layout is implemented in `assets/nup.js` and `assets/nup.css`; translations are maintained in `assets/i18n.js`. The repository root can be deployed directly without a backend or API key.

## Languages

Traditional Chinese, Simplified Chinese, English, Japanese, Korean, Spanish, German, French, Russian, Brazilian Portuguese, Thai, Vietnamese, and Indonesian.

Use `?lang=` to select a locale, for example `?lang=en` or `?lang=zh-Hant`.

## Limitations

Large PDFs, high-resolution images, and documents with many pages may exceed available device memory. Conversion at 300 DPI, splitting, and ZIP packaging are particularly memory intensive.

## Support

Use [GitHub Issues](https://github.com/bruce-yang-422/pdf-batch-unlock/issues) for reproducible bug reports and feature requests. Include your browser version, operating system, and reproduction steps. Do not upload documents containing sensitive information.

## License

This project is licensed under the [MIT License](LICENSE). Third-party components remain subject to their respective licenses; see [Open Source Licenses](https://pdf.stack-base.com/licenses/?lang=en).
