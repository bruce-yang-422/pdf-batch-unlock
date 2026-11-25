import { legalTranslations } from './legal-translations.js';

// Self-name, switcher label, return link, update label, license page name.
const labels = {
  'zh-Hant': ['正體中文', '選擇語言', '返回 PDF 本機工具箱', '最後更新', '開源軟體授權'],
  'zh-Hans': ['简体中文', '选择语言', '返回 PDF 工具箱', '最后更新', '开源软件许可'],
  en: ['English', 'Choose language', 'Back to PDF Toolbox', 'Last updated', 'Open Source Licenses'],
  ja: ['日本語', '表示言語を選択', 'PDFツールボックスに戻る', '最終更新', 'オープンソースライセンス'],
  ko: ['한국어', '언어 선택', 'PDF 도구 모음으로 돌아가기', '최종 업데이트', '오픈 소스 라이선스'],
  es: ['Español', 'Elegir idioma', 'Volver a Herramientas PDF', 'Última actualización', 'Licencias de código abierto'],
  de: ['Deutsch', 'Sprache auswählen', 'Zurück zu den PDF-Werkzeugen', 'Zuletzt aktualisiert', 'Open-Source-Lizenzen'],
  fr: ['Français', 'Choisir la langue', 'Retour aux Outils PDF', 'Dernière mise à jour', 'Licences open source'],
  ru: ['Русский', 'Выбрать язык', 'К инструментам PDF', 'Последнее обновление', 'Лицензии открытого ПО'],
  'pt-BR': ['Português (Brasil)', 'Escolher idioma', 'Voltar para Ferramentas PDF', 'Última atualização', 'Licenças de código aberto'],
  th: ['ไทย', 'เลือกภาษา', 'กลับไปที่เครื่องมือ PDF', 'อัปเดตล่าสุด', 'สัญญาอนุญาตโอเพนซอร์ส'],
  vi: ['Tiếng Việt', 'Chọn ngôn ngữ', 'Quay lại Bộ công cụ PDF', 'Cập nhật lần cuối', 'Giấy phép mã nguồn mở'],
  id: ['Bahasa Indonesia', 'Pilih bahasa', 'Kembali ke Alat PDF', 'Terakhir diperbarui', 'Lisensi sumber terbuka'],
};

const licenseLocales = ['zh-Hant', 'en', 'ja'];
const licenseCopy = {
  en: {
    summary: 'The projects below provide the open-source software used by PDF Toolbox. Their respective rights holders retain copyright, and each project’s license applies.',
    headings: ['Third-party components', 'License notice'],
    paragraphs: [
      'Reads and renders PDF pages and thumbnails.', 'License: Apache License 2.0',
      'Creates, merges, splits, and edits PDFs.', 'License: MIT License',
      'Creates ZIP downloads in the browser.', 'License: MIT License or GPL-3.0-or-later. This site uses the MIT option.',
      'Removes and adds PDF passwords locally in the browser.', 'License: Apache License 2.0. QPDF also retains the legacy Artistic License 2.0 option described in its documentation.',
      'The software is provided as is under its respective licenses, without express or implied warranties. Versions may change as the site is updated. Read the distributed code alongside the upstream license documents.',
      'Third-party project names identify the software used and do not imply endorsement of this site by the authors or maintainers.',
    ],
    links: ['Source code', 'Full license text', 'Third-party notices'],
  },
  ja: {
    summary: 'PDFツールボックスが利用しているオープンソースソフトウェアの一覧です。著作権は各権利者に帰属し、各プロジェクトのライセンスが適用されます。',
    headings: ['主なサードパーティ製コンポーネント', 'ライセンスに関する注意事項'],
    paragraphs: [
      'PDFページの読み込み、表示、サムネイルの生成に使用しています。', 'ライセンス：Apache License 2.0',
      'PDFの作成、結合、分割、編集に使用しています。', 'ライセンス：MIT License',
      '複数のファイルをブラウザー内でZIPにまとめるために使用しています。', 'ライセンス：MIT License または GPL-3.0-or-later。本サイトでは MIT License を選択しています。',
      'ブラウザー内でPDFのパスワードを解除・設定するために使用しています。', 'ライセンス：Apache License 2.0。QPDFの文書に記載されている従来の Artistic License 2.0 も選択できます。',
      '各ソフトウェアは、それぞれのライセンスに従って現状のまま提供され、明示・黙示を問わず保証はありません。サイトの更新に伴いバージョンが変わることがあります。配布されているコードと開発元のライセンス文書を併せてご確認ください。',
      '第三者のプロジェクト名は、使用しているソフトウェアを示すために記載しています。開発者やメンテナーが本サイトを推奨していることを示すものではありません。',
    ],
    links: ['ソースコード', 'ライセンス全文', '第三者に関する通知'],
  },
};

const picker = document.querySelector('.legal-languages');
const page = picker.dataset.page;
const supported = page === 'licenses' ? licenseLocales : Object.keys(labels);
const article = document.querySelector('.legal-content');
const originalArticle = article.cloneNode(true);
const titleElement = document.querySelector('h1');
const summaryElement = document.querySelector('.summary');
const dateElement = document.querySelector('.updated');
const backLink = document.querySelector('.back-link');
const original = {
  title: titleElement.textContent,
  summary: summaryElement.textContent,
};
const footerLinks = [...document.querySelectorAll('.site-footer a')];

function preferredLocale() {
  const explicit = new URL(location.href).searchParams.get('lang');
  let stored;
  try {
    stored = localStorage.getItem('pdf-tool-language');
  } catch {
    // Browsers can disable local storage.
  }
  for (const candidate of [explicit, stored, ...(navigator.languages || [navigator.language])]) {
    const value = candidate?.toLowerCase();
    if (!value) continue;
    let match;
    if (value === 'zh' || value.startsWith('zh-')) {
      match = /^zh-(hant|tw|hk|mo)(-|$)/.test(value) ? 'zh-Hant' : 'zh-Hans';
      if (page === 'licenses') match = 'zh-Hant';
    } else if (/^pt(-|$)/.test(value)) {
      match = 'pt-BR';
    } else {
      match = supported.find((locale) => value === locale.toLowerCase() || value.startsWith(locale.toLowerCase() + '-'));
    }
    if (supported.includes(match)) return match;
    if (candidate === explicit && page === 'licenses') return 'en';
  }
  return page === 'licenses' && stored && Object.hasOwn(labels, stored) ? 'en' : 'zh-Hant';
}

function localizedHref(relative, locale) {
  const url = new URL(relative, location.href);
  url.searchParams.set('lang', locale);
  return url.href;
}

function licenseLocale(locale) {
  if (licenseLocales.includes(locale)) return locale;
  return locale === 'zh-Hans' ? 'zh-Hant' : 'en';
}

function renderLicense(locale) {
  const copy = licenseCopy[locale];
  const headings = article.querySelectorAll('h2');
  headings.forEach((heading, index) => { heading.textContent = copy.headings[index]; });
  let paragraphIndex = 0;
  for (const paragraph of article.querySelectorAll('p')) {
    if (!paragraph.querySelector('a')) paragraph.textContent = copy.paragraphs[paragraphIndex++];
  }
  for (const card of article.querySelectorAll('.license-card')) {
    card.querySelectorAll('a').forEach((link, index) => { link.textContent = copy.links[index]; });
  }
  return [labels[locale][4], copy.summary];
}

function renderPolicy(locale) {
  const rows = legalTranslations[locale];
  const start = page === 'privacy' ? 0 : 6;
  article.querySelectorAll('section').forEach((section, index) => {
    const [heading, text] = rows[start + index + 1];
    const headingElement = section.querySelector('h2');
    const paragraph = section.querySelector('p');
    headingElement.textContent = heading;
    paragraph.textContent = text;
    section.replaceChildren(headingElement, paragraph);
    if (page === 'terms' && index === 4) {
      const link = document.createElement('a');
      link.href = localizedHref('../licenses/', licenseLocale(locale));
      link.textContent = labels[locale][4];
      paragraph.append(' ', link);
    }
  });
  return rows[start];
}

function render(locale) {
  const [, languageLabel, backLabel, updatedLabel, licensesLabel] = labels[locale];
  document.documentElement.lang = locale;
  article.replaceChildren(...originalArticle.cloneNode(true).childNodes);
  const [title, summary] = locale === 'zh-Hant'
    ? [original.title, original.summary]
    : page === 'licenses' ? renderLicense(locale) : renderPolicy(locale);
  titleElement.textContent = title;
  summaryElement.textContent = summary;
  document.title = title;
  document.querySelector('meta[name="description"]').content = summary;
  backLink.textContent = '← ' + backLabel;
  backLink.href = localizedHref('../', locale);
  const date = new Date(dateElement.dateTime + 'T00:00:00Z');
  const formatted = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
  dateElement.textContent = updatedLabel + ' · ' + formatted;
  const footerTitles = locale === 'zh-Hant'
    ? ['隱私權政策', '使用條款', licensesLabel]
    : [legalTranslations[locale][0][0], legalTranslations[locale][6][0], licensesLabel];
  footerLinks.forEach((link, index) => {
    link.textContent = footerTitles[index];
    const targetLocale = index === 2 ? licenseLocale(locale) : locale;
    link.href = localizedHref('../' + ['privacy', 'terms', 'licenses'][index] + '/', targetLocale);
  });
  const originalLicenseLink = article.querySelector('[data-license-link]');
  if (originalLicenseLink) {
    originalLicenseLink.href = localizedHref('../licenses/', locale);
    originalLicenseLink.textContent = licensesLabel;
  }
  picker.setAttribute('aria-label', languageLabel);
  for (const link of picker.children) {
    if (link.lang === locale) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
}

for (const locale of supported) {
  const link = document.createElement('a');
  link.lang = locale;
  link.hreflang = locale;
  link.href = localizedHref(location.pathname, locale);
  link.textContent = labels[locale][0];
  link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.href !== link.href) history.pushState(null, '', link.href);
    render(locale);
  });
  picker.append(link);
}
window.addEventListener('popstate', () => render(preferredLocale()));
render(preferredLocale());
