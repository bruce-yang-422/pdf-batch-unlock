// Appearance label, system, light, dark, open source licenses.
const labels = {
  'zh-Hant': ['外觀', '跟隨系統', '淺色', '深色', '開源軟體授權'],
  'zh-Hans': ['外观', '跟随系统', '浅色', '深色', '开源软件许可'],
  en: ['Appearance', 'System', 'Light', 'Dark', 'Open Source Licenses'],
  ja: ['外観', 'システム設定に合わせる', 'ライト', 'ダーク', 'オープンソースライセンス'],
  ko: ['화면 테마', '시스템 설정', '라이트', '다크', '오픈 소스 라이선스'],
  es: ['Apariencia', 'Sistema', 'Claro', 'Oscuro', 'Licencias de código abierto'],
  de: ['Darstellung', 'Systemeinstellung', 'Hell', 'Dunkel', 'Open-Source-Lizenzen'],
  fr: ['Apparence', 'Système', 'Clair', 'Sombre', 'Licences open source'],
  ru: ['Оформление', 'Как в системе', 'Светлая', 'Тёмная', 'Лицензии открытого ПО'],
  'pt-BR': ['Aparência', 'Sistema', 'Claro', 'Escuro', 'Licenças de código aberto'],
  th: ['รูปแบบการแสดงผล', 'ตามระบบ', 'สว่าง', 'มืด', 'สัญญาอนุญาตโอเพนซอร์ส'],
  vi: ['Giao diện', 'Theo hệ thống', 'Sáng', 'Tối', 'Giấy phép mã nguồn mở'],
  id: ['Tampilan', 'Ikuti sistem', 'Terang', 'Gelap', 'Lisensi sumber terbuka'],
};

function localizeExtensionUi() {
  const locale = document.documentElement.lang;
  const [appearance, system, light, dark, licenses] = labels[locale] ?? labels.en;
  document.querySelector('#theme-label').textContent = appearance;
  const select = document.querySelector('#theme-select');
  select.options.namedItem('theme-system').textContent = system;
  select.options.namedItem('theme-light').textContent = light;
  select.options.namedItem('theme-dark').textContent = dark;

  const legal = legalTitles[locale];
  const titles = {
    privacy: legal?.[0] ?? '隱私權政策',
    terms: legal?.[1] ?? '使用條款',
    licenses,
  };
  for (const link of document.querySelectorAll('[data-legal-page]')) {
    link.textContent = titles[link.dataset.legalPage];
  }
}

globalThis.addEventListener('pdf-tool-language-change', localizeExtensionUi);
localizeExtensionUi();
