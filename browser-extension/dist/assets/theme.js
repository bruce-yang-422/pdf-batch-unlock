(() => {
  const key = 'pdf-tool-theme';
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const themes = ['system', 'light', 'dark'];
  let preference = 'system';

  const applyTheme = () => {
    const dark = preference === 'dark' || (preference === 'system' && systemDark.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  };

  const readPreference = () => {
    try {
      const stored = localStorage.getItem(key);
      return themes.includes(stored) ? stored : 'system';
    } catch {
      return 'system';
    }
  };

  preference = readPreference();
  applyTheme();
  systemDark.addEventListener('change', applyTheme);

  document.addEventListener('DOMContentLoaded', () => {
    const select = document.querySelector('#theme-select');
    if (select) {
      select.value = preference;
      select.addEventListener('change', () => {
        if (!themes.includes(select.value)) return;
        preference = select.value;
        try {
          localStorage.setItem(key, preference);
        } catch {
          // Apply the theme for this tab even if storage is disabled.
        }
        applyTheme();
      });
    }
    window.addEventListener('storage', (event) => {
      if (event.key !== key && event.key !== null) return;
      preference = readPreference();
      if (select) select.value = preference;
      applyTheme();
    });
  });
})();
