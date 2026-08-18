export function unlockedFilename(filename) {
  const withoutExtension = filename.replace(/\.pdf$/i, '');
  const withoutSuffix = withoutExtension.replace(/-unlocked$/i, '');
  return `${withoutSuffix}-unlocked.pdf`;
}
