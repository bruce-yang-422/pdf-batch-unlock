const LOCALES = ['zh-Hant', 'en', 'ja', 'ko', 'es', 'de', 'fr', 'zh-Hans', 'ru', 'pt-BR', 'th', 'vi', 'id'];
const STORAGE_KEY = 'pdf-tool-language';

// Order: Traditional Chinese, English, Japanese, Korean, Spanish, German, French.
const rows = [
  ['語言', 'Language', '言語', '언어', 'Idioma', 'Sprache', 'Langue'],
  ['活動紀錄', 'Activity', 'アクティビティ', '활동 기록', 'Actividad', 'Aktivität', 'Activité'],
  ['選擇介面語言', 'Select interface language', '表示言語を選択', '인터페이스 언어 선택', 'Seleccionar idioma de la interfaz', 'Oberflächensprache wählen', "Choisir la langue de l’interface"],
  ['PDF 本機工具箱｜免上傳伺服器的免費 PDF 工具', 'Local PDF Toolbox | Free PDF tools with no server uploads', 'ローカル PDF ツールボックス｜サーバーへ送信しない無料 PDF ツール', '로컬 PDF 도구함 | 서버 업로드 없는 무료 PDF 도구', 'Herramientas PDF locales | Gratis y sin subir archivos al servidor', 'Lokale PDF-Werkzeugbox | Kostenlos und ohne Server-Upload', 'Boîte à outils PDF locale | Gratuite et sans envoi au serveur'],
  ['免費 PDF 本機工具箱：移除密碼、合併、拆分、轉檔、頁面管理、浮水印與頁碼。所有檔案只在瀏覽器處理，不需上傳伺服器。', 'Free PDF tools to remove passwords, merge, split, convert, manage pages and add watermarks. Files are processed in your browser, never uploaded to a server.', 'パスワード解除、結合、分割、変換、ページ管理、透かしに対応した無料 PDF ツール。ファイルはブラウザー内で処理され、サーバーへ送信されません。', '암호 제거, 병합, 분할, 변환, 페이지 관리와 워터마크를 위한 무료 PDF 도구입니다. 파일은 브라우저에서 처리되며 서버에 업로드되지 않습니다.', 'Herramientas PDF gratis para quitar contraseñas, combinar, dividir, convertir y añadir marcas de agua. Todo se procesa en tu navegador, sin subir archivos al servidor.', 'Kostenlose PDF-Werkzeuge zum Entsperren, Zusammenführen, Teilen, Konvertieren und für Wasserzeichen. Alles bleibt im Browser, ohne Upload auf einen Server.', 'Outils PDF gratuits pour déverrouiller, fusionner, diviser, convertir et ajouter des filigranes. Tout reste dans le navigateur, sans envoi vers un serveur.'],
  ['PDF 工具, PDF 本機處理, PDF 免上傳, PDF 合併, PDF 拆分, PDF 移除密碼, PDF 浮水印, PDF 轉 JPG', 'PDF tools, local PDF processing, no-upload PDF, merge PDF, split PDF, remove PDF password, PDF watermark, PDF to JPG', 'PDF ツール, ローカル PDF, アップロード不要 PDF, PDF 結合, PDF 分割, PDF パスワード解除, PDF 透かし, PDF JPG 変換', 'PDF 도구, 로컬 PDF 처리, 업로드 없는 PDF, PDF 병합, PDF 분할, PDF 암호 제거, PDF 워터마크, PDF JPG 변환', 'herramientas PDF, PDF local, PDF sin subir, combinar PDF, dividir PDF, quitar contraseña PDF, marca de agua PDF, PDF a JPG', 'PDF-Werkzeuge, PDF lokal, PDF ohne Upload, PDF zusammenführen, PDF teilen, PDF-Passwort entfernen, PDF-Wasserzeichen, PDF zu JPG', 'outils PDF, PDF local, PDF sans envoi, fusionner PDF, diviser PDF, supprimer mot de passe PDF, filigrane PDF, PDF vers JPG'],
  ['免費 PDF 本機工具箱：所有檔案只在瀏覽器處理，不需上傳伺服器。', 'Free local PDF toolbox: files stay in your browser and are never uploaded to a server.', '無料のローカル PDF ツール。ファイルはブラウザー内で処理され、サーバーへアップロードされません。', '무료 로컬 PDF 도구입니다. 파일은 브라우저에서 처리되며 서버에 업로드되지 않습니다.', 'Herramientas PDF locales y gratuitas: los archivos permanecen en tu navegador y nunca se suben a un servidor.', 'Kostenlose lokale PDF-Werkzeuge: Dateien bleiben im Browser und werden nie auf einen Server hochgeladen.', 'Boîte à outils PDF locale et gratuite : les fichiers restent dans le navigateur et ne sont jamais envoyés sur un serveur.'],
  ['請僅處理您本人擁有或已取得合法授權的文件。所有檔案均在您的瀏覽器本機處理，不會主動上傳至本站伺服器。', 'Only process documents you own or are legally authorized to use. All files are processed locally in your browser and are not actively uploaded to this site’s servers.', 'ご自身が所有する、または正当な許可を得た文書のみを処理してください。すべてのファイルはブラウザー内で処理され、本サイトのサーバーへ送信されません。', '본인이 소유하거나 합법적으로 사용 권한을 받은 문서만 처리하세요. 모든 파일은 브라우저에서 로컬로 처리되며 이 사이트의 서버로 업로드되지 않습니다.', 'Procesa únicamente documentos propios o para los que tengas autorización legal. Todos los archivos se procesan localmente en el navegador y no se cargan activamente en los servidores del sitio.', 'Verarbeiten Sie nur Dokumente, die Ihnen gehören oder für die Sie eine rechtmäßige Berechtigung haben. Alle Dateien werden lokal im Browser verarbeitet und nicht aktiv auf die Server dieser Website hochgeladen.', 'Traitez uniquement les documents qui vous appartiennent ou pour lesquels vous disposez d’une autorisation légale. Tous les fichiers sont traités localement dans le navigateur et ne sont pas envoyés activement aux serveurs du site.'],
  ['需要支援 JavaScript 與 WebAssembly 的現代瀏覽器', 'Requires a modern browser with JavaScript and WebAssembly support', 'JavaScript と WebAssembly に対応した最新ブラウザーが必要です', 'JavaScript 및 WebAssembly를 지원하는 최신 브라우저가 필요합니다', 'Requiere un navegador moderno compatible con JavaScript y WebAssembly', 'Erfordert einen modernen Browser mit JavaScript- und WebAssembly-Unterstützung', 'Nécessite un navigateur moderne compatible avec JavaScript et WebAssembly'],
  ['完全在瀏覽器本機處理 PDF 的多功能工具', 'A multifunction PDF toolkit that runs entirely in your browser', 'ブラウザー内だけで動作する多機能 PDF ツール', '브라우저에서만 작동하는 다기능 PDF 도구', 'Herramientas PDF multifunción que funcionan íntegramente en el navegador', 'Multifunktionale PDF-Werkzeuge, die vollständig im Browser laufen', 'Boîte à outils PDF multifonction exécutée entièrement dans le navigateur'],
  ['本機瀏覽器 PDF 工具', 'LOCAL BROWSER PDF TOOLS', 'ブラウザー内 PDF ツール', '브라우저 PDF 도구', 'HERRAMIENTAS PDF LOCALES', 'LOKALE BROWSER-PDF-WERKZEUGE', 'OUTILS PDF LOCAUX'],
  ['PDF 本機工具箱', 'Local PDF Toolbox', 'ローカル PDF ツールボックス', '로컬 PDF 도구함', 'Herramientas PDF locales', 'Lokale PDF-Werkzeugbox', 'Boîte à outils PDF locale'],
  ['✓ 100% 本機處理', '✓ 100% local processing', '✓ 100% ローカル処理', '✓ 100% 로컬 처리', '✓ Procesamiento 100% local', '✓ 100 % lokale Verarbeitung', '✓ Traitement 100 % local'],
  ['檔案不會上傳至任何伺服器', 'Files are never uploaded to any server', 'ファイルはサーバーへ送信されません', '파일은 어떤 서버에도 업로드되지 않습니다', 'Los archivos nunca se suben a ningún servidor', 'Dateien werden auf keinen Server hochgeladen', 'Les fichiers ne sont envoyés vers aucun serveur'],
  ['選擇工具', 'Choose a tool', 'ツールを選択', '도구 선택', 'Elegir herramienta', 'Werkzeug wählen', 'Choisir un outil'],
  ['PDF 工具', 'PDF tools', 'PDF ツール', 'PDF 도구', 'Herramientas PDF', 'PDF-Werkzeuge', 'Outils PDF'],

  ['移除密碼', 'Remove password', 'パスワード解除', '암호 제거', 'Quitar contraseña', 'Passwort entfernen', 'Supprimer le mot de passe'],
  ['加上密碼', 'Add password', 'パスワード設定', '암호 설정', 'Añadir contraseña', 'Passwort hinzufügen', 'Ajouter un mot de passe'],
  ['合併 PDF', 'Merge PDF', 'PDF 結合', 'PDF 병합', 'Combinar PDF', 'PDF zusammenführen', 'Fusionner des PDF'],
  ['拆分 PDF', 'Split PDF', 'PDF 分割', 'PDF 분할', 'Dividir PDF', 'PDF aufteilen', 'Diviser un PDF'],
  ['JPG 轉 PDF', 'JPG to PDF', 'JPG から PDF', 'JPG를 PDF로', 'JPG a PDF', 'JPG zu PDF', 'JPG vers PDF'],
  ['PDF 轉 JPG', 'PDF to JPG', 'PDF から JPG', 'PDF를 JPG로', 'PDF a JPG', 'PDF zu JPG', 'PDF vers JPG'],
  ['頁面管理', 'Page manager', 'ページ管理', '페이지 관리', 'Administrar páginas', 'Seiten verwalten', 'Gérer les pages'],
  ['浮水印／頁碼', 'Watermark / page numbers', '透かし／ページ番号', '워터마크 / 페이지 번호', 'Marca de agua / páginas', 'Wasserzeichen / Seitenzahlen', 'Filigrane / numéros de page'],
  ['移除 PDF 密碼', 'Remove PDF password', 'PDF パスワードを解除', 'PDF 암호 제거', 'Quitar contraseña del PDF', 'PDF-Passwort entfernen', 'Supprimer le mot de passe PDF'],
  ['為 PDF 加上密碼', 'Password-protect PDF', 'PDF にパスワードを設定', 'PDF 암호 설정', 'Proteger PDF con contraseña', 'PDF mit Passwort schützen', 'Protéger un PDF par mot de passe'],
  ['PDF 頁面管理器', 'PDF page manager', 'PDF ページ管理', 'PDF 페이지 관리자', 'Administrador de páginas PDF', 'PDF-Seitenverwaltung', 'Gestionnaire de pages PDF'],
  ['浮水印與頁碼', 'Watermark and page numbers', '透かしとページ番号', '워터마크 및 페이지 번호', 'Marca de agua y números de página', 'Wasserzeichen und Seitenzahlen', 'Filigrane et numéros de page'],

  ['加入多個使用相同密碼的 PDF；多檔結果會打包成 ZIP。', 'Add multiple PDFs that use the same password; multiple results are packed into a ZIP.', '同じパスワードの PDF を複数追加できます。結果は ZIP にまとめられます。', '같은 암호를 사용하는 여러 PDF를 추가하세요. 결과는 ZIP으로 묶입니다.', 'Añade varios PDF con la misma contraseña; los resultados se guardarán en un ZIP.', 'Fügen Sie mehrere PDFs mit demselben Passwort hinzu; die Ergebnisse werden als ZIP gepackt.', 'Ajoutez plusieurs PDF utilisant le même mot de passe ; les résultats seront regroupés dans un ZIP.'],
  ['為一個或多個未加密 PDF 設定相同的開啟密碼。', 'Set the same opening password on one or more unencrypted PDFs.', '1 つ以上の暗号化されていない PDF に同じ開封パスワードを設定します。', '하나 이상의 암호화되지 않은 PDF에 동일한 열기 암호를 설정합니다.', 'Establece la misma contraseña de apertura en uno o varios PDF sin cifrar.', 'Legt dasselbe Öffnungspasswort für eine oder mehrere unverschlüsselte PDF-Dateien fest.', 'Définit le même mot de passe d’ouverture pour un ou plusieurs PDF non chiffrés.'],
  ['依清單順序將兩個以上未加密 PDF 合併成一個檔案。', 'Merge two or more unencrypted PDFs in list order.', '暗号化されていない PDF を一覧順に 2 件以上結合します。', '암호화되지 않은 PDF 두 개 이상을 목록 순서대로 병합합니다.', 'Combina dos o más PDF sin cifrar en el orden de la lista.', 'Führt mindestens zwei unverschlüsselte PDFs in Listenreihenfolge zusammen.', 'Fusionne au moins deux PDF non chiffrés dans l’ordre de la liste.'],
  ['將一個未加密 PDF 的每一頁拆成獨立 PDF，並打包為 ZIP。', 'Split every page of one unencrypted PDF into separate PDFs and pack them into a ZIP.', '暗号化されていない PDF の各ページを個別の PDF に分割し、ZIP にまとめます。', '암호화되지 않은 PDF의 각 페이지를 개별 PDF로 분할해 ZIP으로 묶습니다.', 'Divide cada página de un PDF sin cifrar y las guarda en un ZIP.', 'Teilt jede Seite eines unverschlüsselten PDFs auf und packt sie in eine ZIP-Datei.', 'Sépare chaque page d’un PDF non chiffré et les regroupe dans un ZIP.'],
  ['將一張或多張 JPG 依清單順序轉成多頁 PDF。', 'Convert one or more JPG images into a multipage PDF in list order.', '1 枚以上の JPG を一覧順に複数ページ PDF へ変換します。', '하나 이상의 JPG를 목록 순서대로 여러 페이지 PDF로 변환합니다.', 'Convierte uno o varios JPG en un PDF de varias páginas.', 'Konvertiert ein oder mehrere JPGs in Listenreihenfolge in ein mehrseitiges PDF.', 'Convertit un ou plusieurs JPG en PDF multipage dans l’ordre de la liste.'],
  ['將一個未加密 PDF 的每一頁轉為 JPG，並打包為 ZIP。', 'Convert every page of one unencrypted PDF to JPG and pack them into a ZIP.', '暗号化されていない PDF の各ページを JPG に変換し、ZIP にまとめます。', '암호화되지 않은 PDF의 각 페이지를 JPG로 변환해 ZIP으로 묶습니다.', 'Convierte cada página de un PDF sin cifrar a JPG y las guarda en un ZIP.', 'Konvertiert jede Seite eines unverschlüsselten PDFs in JPG und packt sie als ZIP.', 'Convertit chaque page d’un PDF non chiffré en JPG et les regroupe dans un ZIP.'],
  ['預覽、排序、旋轉、刪除或擷取頁面，再輸出新的 PDF。', 'Preview, reorder, rotate, delete, or extract pages, then export a new PDF.', 'ページをプレビュー、並べ替え、回転、削除、抽出して新しい PDF を出力します。', '페이지를 미리 보고 정렬, 회전, 삭제 또는 추출한 뒤 새 PDF로 내보냅니다.', 'Previsualiza, ordena, gira, elimina o extrae páginas y exporta un PDF nuevo.', 'Seiten anzeigen, sortieren, drehen, löschen oder extrahieren und als neues PDF exportieren.', 'Prévisualisez, réordonnez, faites pivoter, supprimez ou extrayez des pages, puis exportez un nouveau PDF.'],
  ['加入文字浮水印、調整位置與角度，或自動加入頁碼。', 'Add a text or image watermark, adjust its position and angle, or add page numbers.', '文字または画像の透かしを追加し、位置や角度、ページ番号を設定します。', '텍스트 또는 이미지 워터마크를 추가하고 위치와 각도, 페이지 번호를 설정합니다.', 'Añade una marca de agua, ajusta la posición y el ángulo o agrega números de página.', 'Fügt Wasserzeichen hinzu, passt Position und Winkel an oder ergänzt Seitenzahlen.', 'Ajoutez un filigrane, ajustez sa position et son angle ou ajoutez des numéros de page.'],

  ['將加密 PDF 拖曳到這裡', 'Drop encrypted PDFs here', '暗号化 PDF をここにドロップ', '암호화된 PDF를 여기에 놓으세요', 'Suelta aquí los PDF cifrados', 'Verschlüsselte PDFs hier ablegen', 'Déposez les PDF chiffrés ici'],
  ['將要加密的 PDF 拖曳到這裡', 'Drop PDFs to protect here', '保護する PDF をここにドロップ', '보호할 PDF를 여기에 놓으세요', 'Suelta aquí los PDF que deseas proteger', 'Zu schützende PDFs hier ablegen', 'Déposez ici les PDF à protéger'],
  ['將要合併的 PDF 拖曳到這裡', 'Drop PDFs to merge here', '結合する PDF をここにドロップ', '병합할 PDF를 여기에 놓으세요', 'Suelta aquí los PDF que deseas combinar', 'Zu verbindende PDFs hier ablegen', 'Déposez ici les PDF à fusionner'],
  ['將一個 PDF 拖曳到這裡', 'Drop one PDF here', 'PDF を 1 件ここにドロップ', 'PDF 하나를 여기에 놓으세요', 'Suelta un PDF aquí', 'Eine PDF-Datei hier ablegen', 'Déposez un PDF ici'],
  ['將 JPG 拖曳到這裡', 'Drop JPG images here', 'JPG をここにドロップ', 'JPG를 여기에 놓으세요', 'Suelta aquí los JPG', 'JPGs hier ablegen', 'Déposez les JPG ici'],
  ['將 PDF 拖曳到這裡', 'Drop a PDF here', 'PDF をここにドロップ', 'PDF를 여기에 놓으세요', 'Suelta aquí un archivo PDF', 'PDF hier ablegen', 'Déposez ici un fichier PDF'],
  ['或點一下選擇多個 PDF', 'Or click to select multiple PDFs', 'クリックして複数の PDF を選択', '클릭하여 여러 PDF 선택', 'O haz clic para seleccionar varios PDF', 'Oder klicken, um mehrere PDFs auszuwählen', 'Ou cliquez pour sélectionner plusieurs PDF'],
  ['或點一下選擇多個檔案', 'Or click to select multiple files', 'クリックして複数ファイルを選択', '클릭하여 여러 파일 선택', 'O haz clic para seleccionar varios archivos', 'Oder klicken, um mehrere Dateien auszuwählen', 'Ou cliquez pour sélectionner plusieurs fichiers'],
  ['檔案會依加入順序合併', 'Files are merged in the order added', '追加した順に結合されます', '추가한 순서대로 병합됩니다', 'Los archivos se combinan en el orden añadido', 'Dateien werden in der hinzugefügten Reihenfolge verbunden', 'Les fichiers sont fusionnés dans l’ordre d’ajout'],
  ['每頁會輸出一個 PDF', 'Each page becomes one PDF', '各ページを 1 つの PDF として出力', '각 페이지가 하나의 PDF로 출력됩니다', 'Cada página se exporta como un PDF', 'Jede Seite wird als PDF ausgegeben', 'Chaque page devient un PDF'],
  ['支援多張 JPG／JPEG', 'Supports multiple JPG/JPEG images', '複数の JPG／JPEG に対応', '여러 JPG/JPEG 지원', 'Admite varios JPG/JPEG', 'Unterstützt mehrere JPG/JPEG-Dateien', 'Prend en charge plusieurs JPG/JPEG'],
  ['每頁會輸出一張 JPG', 'Each page becomes one JPG', '各ページを 1 枚の JPG として出力', '각 페이지가 하나의 JPG로 출력됩니다', 'Cada página se exporta como un JPG', 'Jede Seite wird als JPG ausgegeben', 'Chaque page devient un JPG'],
  ['載入後會建立頁面縮圖', 'Page thumbnails are created after loading', '読み込み後にページのサムネイルを作成', '로드 후 페이지 미리보기를 생성합니다', 'Se crearán miniaturas al cargar', 'Nach dem Laden werden Seitenvorschauen erstellt', 'Des miniatures seront créées après le chargement'],
  ['設定浮水印或頁碼後輸出新 PDF', 'Configure a watermark or page numbers, then export a new PDF', '透かしやページ番号を設定して新しい PDF を出力', '워터마크 또는 페이지 번호를 설정한 뒤 새 PDF로 출력합니다', 'Configura la marca de agua o numeración y exporta un PDF nuevo', 'Wasserzeichen oder Seitenzahlen einstellen und neues PDF exportieren', 'Configurez le filigrane ou les numéros de page puis exportez un nouveau PDF'],
  ['點一下選擇檔案', 'Click to choose files', 'クリックしてファイルを選択', '클릭하여 파일 선택', 'Haz clic para elegir archivos', 'Klicken, um Dateien auszuwählen', 'Cliquez pour choisir des fichiers'],
  ['從裝置中選擇要處理的檔案', 'Choose files to process from your device', '端末から処理するファイルを選択', '기기에서 처리할 파일을 선택하세요', 'Elige en tu dispositivo los archivos que deseas procesar', 'Zu verarbeitende Dateien vom Gerät auswählen', 'Choisissez sur votre appareil les fichiers à traiter'],

  ['全部移除密碼並下載', 'Remove all passwords and download', 'すべて解除してダウンロード', '모든 암호 제거 및 다운로드', 'Quitar todas las contraseñas y descargar', 'Alle Passwörter entfernen und herunterladen', 'Supprimer tous les mots de passe et télécharger'],
  ['加密並下載 PDF', 'Protect and download PDF', '保護して PDF をダウンロード', 'PDF 암호화 및 다운로드', 'Proteger y descargar PDF', 'PDF schützen und herunterladen', 'Protéger et télécharger le PDF'],
  ['合併並下載 PDF', 'Merge and download PDF', '結合して PDF をダウンロード', 'PDF 병합 및 다운로드', 'Combinar y descargar PDF', 'PDF verbinden und herunterladen', 'Fusionner et télécharger le PDF'],
  ['拆分並下載 ZIP', 'Split and download ZIP', '分割して ZIP をダウンロード', '분할 후 ZIP 다운로드', 'Dividir y descargar ZIP', 'Aufteilen und ZIP herunterladen', 'Diviser et télécharger le ZIP'],
  ['轉換並下載 PDF', 'Convert and download PDF', '変換して PDF をダウンロード', '변환 후 PDF 다운로드', 'Convertir y descargar PDF', 'Konvertieren und PDF herunterladen', 'Convertir et télécharger le PDF'],
  ['轉換並下載 ZIP', 'Convert and download ZIP', '変換して ZIP をダウンロード', '변환 후 ZIP 다운로드', 'Convertir y descargar ZIP', 'Konvertieren und ZIP herunterladen', 'Convertir et télécharger le ZIP'],
  ['套用頁面編排並下載', 'Apply page layout and download', 'ページ編集を適用してダウンロード', '페이지 편집 적용 및 다운로드', 'Aplicar cambios y descargar', 'Seitenanordnung anwenden und herunterladen', 'Appliquer la mise en page et télécharger'],
  ['套用並下載 PDF', 'Apply and download PDF', '適用して PDF をダウンロード', '적용 후 PDF 다운로드', 'Aplicar y descargar PDF', 'Anwenden und PDF herunterladen', 'Appliquer et télécharger le PDF'],

  ['PDF 密碼', 'PDF password', 'PDF パスワード', 'PDF 암호', 'Contraseña del PDF', 'PDF-Passwort', 'Mot de passe PDF'],
  ['輸入 PDF 密碼', 'Enter PDF password', 'PDF パスワードを入力', 'PDF 암호 입력', 'Introduce la contraseña del PDF', 'PDF-Passwort eingeben', 'Saisissez le mot de passe PDF'],
  ['新密碼', 'New password', '新しいパスワード', '새 암호', 'Nueva contraseña', 'Neues Passwort', 'Nouveau mot de passe'],
  ['輸入新的 PDF 開啟密碼', 'Enter a new PDF opening password', '新しい PDF 開封パスワードを入力', '새 PDF 열기 암호 입력', 'Introduce una nueva contraseña de apertura', 'Neues PDF-Öffnungspasswort eingeben', 'Saisissez un nouveau mot de passe d’ouverture'],
  ['再次輸入密碼', 'Confirm password', 'パスワードを再入力', '암호 확인', 'Confirmar contraseña', 'Passwort bestätigen', 'Confirmer le mot de passe'],
  ['再次輸入相同密碼', 'Enter the same password again', '同じパスワードを再入力', '동일한 암호를 다시 입력', 'Introduce de nuevo la misma contraseña', 'Dasselbe Passwort erneut eingeben', 'Saisissez à nouveau le même mot de passe'],
  ['使用 AES-256 加密；建議設定至少 8 個字元，請妥善保存密碼。', 'Uses AES-256 encryption. Use at least 8 characters and keep the password safe.', 'AES-256 で暗号化します。8 文字以上を推奨します。パスワードは安全に保管してください。', 'AES-256 암호화를 사용합니다. 8자 이상을 권장하며 암호를 안전하게 보관하세요.', 'Usa cifrado AES-256. Se recomiendan al menos 8 caracteres; guarda bien la contraseña.', 'Verwendet AES-256. Mindestens 8 Zeichen werden empfohlen; Passwort sicher aufbewahren.', 'Utilise le chiffrement AES-256. Au moins 8 caractères sont recommandés ; conservez bien le mot de passe.'],
  ['密碼設定方式', 'Password method', 'パスワード設定方法', '암호 설정 방식', 'Método de contraseña', 'Passwortmethode', 'Méthode de mot de passe'],
  ['自己設定密碼', 'Set my own password', '自分でパスワードを設定', '직접 암호 설정', 'Definir mi contraseña', 'Eigenes Passwort festlegen', 'Définir mon mot de passe'],
  ['系統產生密碼', 'Generate a password', 'パスワードを自動生成', '암호 자동 생성', 'Generar una contraseña', 'Passwort generieren', 'Générer un mot de passe'],
  ['密碼長度', 'Password length', 'パスワードの長さ', '암호 길이', 'Longitud de la contraseña', 'Passwortlänge', 'Longueur du mot de passe'],
  ['較弱', 'Weaker', '弱め', '약함', 'Más débil', 'Schwächer', 'Faible'],
  ['基本', 'Basic', '基本', '기본', 'Básica', 'Basis', 'Basique'],
  ['建議', 'Recommended', '推奨', '권장', 'Recomendada', 'Empfohlen', 'Recommandé'],
  ['很強', 'Very strong', '非常に強い', '매우 강함', 'Muy fuerte', 'Sehr stark', 'Très fort'],
  ['極強', 'Extremely strong', '極めて強い', '매우 강력함', 'Extremadamente fuerte', 'Extrem stark', 'Extrêmement fort'],
  ['8–12 字元安全性較低，建議使用 24 字元以上。', '8–12 characters provide lower security. Use 24 or more when possible.', '8～12 文字は安全性が低めです。24 文字以上を推奨します。', '8~12자는 보안 수준이 낮습니다. 24자 이상을 권장합니다.', 'Entre 8 y 12 caracteres ofrecen menor seguridad. Se recomiendan 24 o más.', '8–12 Zeichen bieten weniger Sicherheit. Empfohlen sind mindestens 24 Zeichen.', 'Entre 8 et 12 caractères offrent une sécurité moindre. Utilisez-en au moins 24.'],
  ['包含特殊符號', 'Include special characters', '記号を含める', '특수 문자 포함', 'Incluir caracteres especiales', 'Sonderzeichen einschließen', 'Inclure des caractères spéciaux'],
  ['系統產生的密碼', 'Generated password', '生成されたパスワード', '생성된 암호', 'Contraseña generada', 'Generiertes Passwort', 'Mot de passe généré'],
  ['複製密碼', 'Copy password', 'パスワードをコピー', '암호 복사', 'Copiar contraseña', 'Passwort kopieren', 'Copier le mot de passe'],
  ['重新產生密碼', 'Generate another password', '別のパスワードを生成', '새 암호 생성', 'Generar otra contraseña', 'Neues Passwort generieren', 'Générer un autre mot de passe'],
  ['下載時會同時提供加密檔案與密碼 TXT；畫面上的密碼會保留到離開此工具或重新整理頁面。', 'The protected file and a password TXT are downloaded separately. The password stays visible until you leave this tool or reload the page.', '保護済みファイルとパスワード TXT を別々にダウンロードします。パスワードはこのツールを離れるか再読み込みするまで表示されます。', '보호된 파일과 암호 TXT가 각각 다운로드됩니다. 암호는 이 도구를 나가거나 페이지를 새로 고칠 때까지 표시됩니다.', 'El archivo protegido y un TXT con la contraseña se descargan por separado. La contraseña seguirá visible hasta salir de esta herramienta o recargar la página.', 'Die geschützte Datei und eine Passwort-TXT werden separat heruntergeladen. Das Passwort bleibt sichtbar, bis Sie dieses Werkzeug verlassen oder die Seite neu laden.', 'Le fichier protégé et un TXT contenant le mot de passe sont téléchargés séparément. Le mot de passe reste affiché jusqu’à ce que vous quittiez cet outil ou rechargiez la page.'],
  ['密碼已複製到剪貼簿。', 'Password copied to the clipboard.', 'パスワードをクリップボードにコピーしました。', '암호를 클립보드에 복사했습니다.', 'Contraseña copiada al portapapeles.', 'Passwort in die Zwischenablage kopiert.', 'Mot de passe copié dans le presse-papiers.'],
  ['無法存取剪貼簿，請手動選取並複製密碼。', 'Clipboard access is unavailable. Select and copy the password manually.', 'クリップボードにアクセスできません。パスワードを選択して手動でコピーしてください。', '클립보드에 접근할 수 없습니다. 암호를 직접 선택하여 복사하세요.', 'No se puede acceder al portapapeles. Selecciona y copia la contraseña manualmente.', 'Kein Zugriff auf die Zwischenablage. Wählen und kopieren Sie das Passwort manuell.', 'Impossible d’accéder au presse-papiers. Sélectionnez et copiez le mot de passe manuellement.'],
  ['顯示', 'Show', '表示', '표시', 'Mostrar', 'Anzeigen', 'Afficher'],
  ['隱藏', 'Hide', '非表示', '숨기기', 'Ocultar', 'Ausblenden', 'Masquer'],
  ['JPG 輸出解析度', 'JPG output resolution', 'JPG 出力解像度', 'JPG 출력 해상도', 'Resolución de salida JPG', 'JPG-Ausgabeauflösung', 'Résolution de sortie JPG'],
  ['螢幕（96 DPI）', 'Screen (96 DPI)', '画面（96 DPI）', '화면 (96 DPI)', 'Pantalla (96 DPI)', 'Bildschirm (96 DPI)', 'Écran (96 DPI)'],
  ['清晰（150 DPI）', 'Clear (150 DPI)', '高精細（150 DPI）', '선명 (150 DPI)', 'Nítido (150 DPI)', 'Scharf (150 DPI)', 'Net (150 DPI)'],
  ['高畫質（300 DPI）', 'High quality (300 DPI)', '高画質（300 DPI）', '고화질 (300 DPI)', 'Alta calidad (300 DPI)', 'Hohe Qualität (300 DPI)', 'Haute qualité (300 DPI)'],
  ['浮水印類型', 'Watermark type', '透かしの種類', '워터마크 유형', 'Tipo de marca de agua', 'Wasserzeichentyp', 'Type de filigrane'],
  ['文字浮水印', 'Text watermark', '文字の透かし', '텍스트 워터마크', 'Marca de agua de texto', 'Textwasserzeichen', 'Filigrane texte'],
  ['圖片浮水印', 'Image watermark', '画像の透かし', '이미지 워터마크', 'Marca de agua de imagen', 'Bildwasserzeichen', 'Filigrane image'],
  ['浮水印文字', 'Watermark text', '透かし文字', '워터마크 텍스트', 'Texto de la marca de agua', 'Wasserzeichentext', 'Texte du filigrane'],
  ['例如：機密文件（可留空）', 'Example: Confidential (optional)', '例：機密文書（空欄可）', '예: 기밀 문서 (선택 사항)', 'Ejemplo: Confidencial (opcional)', 'Beispiel: Vertraulich (optional)', 'Exemple : Confidentiel (facultatif)'],
  ['浮水印圖片', 'Watermark image', '透かし画像', '워터마크 이미지', 'Imagen de marca de agua', 'Wasserzeichenbild', 'Image du filigrane'],
  ['選擇圖片', 'Choose image', '画像を選択', '이미지 선택', 'Elegir imagen', 'Bild auswählen', 'Choisir une image'],
  ['從裝置選擇一張 PNG、JPG 或 SVG', 'Choose one PNG, JPG, or SVG from your device', '端末から PNG、JPG、SVG を 1 枚選択', '기기에서 PNG, JPG 또는 SVG 하나를 선택하세요', 'Elige un PNG, JPG o SVG de tu dispositivo', 'PNG, JPG oder SVG vom Gerät auswählen', 'Choisissez un PNG, JPG ou SVG sur votre appareil'],
  ['支援 PNG、JPG、SVG，建議使用透明背景 PNG 或 SVG，最大 20 MB。', 'Supports PNG, JPG, and SVG. Transparent PNG or SVG is recommended. Maximum 20 MB.', 'PNG、JPG、SVG に対応。透明背景の PNG または SVG を推奨。最大 20 MB。', 'PNG, JPG, SVG를 지원합니다. 투명 배경 PNG 또는 SVG 권장. 최대 20MB.', 'Admite PNG, JPG y SVG. Se recomienda PNG o SVG transparente. Máximo 20 MB.', 'Unterstützt PNG, JPG und SVG. Transparente PNG- oder SVG-Dateien empfohlen. Maximal 20 MB.', 'PNG, JPG et SVG pris en charge. PNG ou SVG transparent recommandé. Maximum 20 Mo.'],
  ['文字字型', 'Text font', '文字フォント', '텍스트 글꼴', 'Fuente del texto', 'Textschrift', 'Police du texte'],
  ['系統黑體', 'System sans serif', 'システムゴシック', '시스템 고딕', 'Sans serif del sistema', 'System-Sans-Serif', 'Sans serif système'],
  ['繁中黑體', 'Traditional Chinese sans', '繁体字ゴシック', '번체 중국어 고딕', 'Sans para chino tradicional', 'Traditionell-chinesische Sans', 'Sans chinois traditionnel'],
  ['標楷體', 'BiauKai / Kai', '標楷体', '표해체', 'BiauKai / Kai', 'BiauKai / Kai', 'BiauKai / Kai'],
  ['明體', 'Serif', '明朝体', '명조체', 'Serif', 'Serifenschrift', 'Serif'],
  ['等寬字型', 'Monospace', '等幅フォント', '고정폭 글꼴', 'Monoespaciada', 'Nichtproportional', 'Chasse fixe'],
  ['浮水印版面', 'Watermark layout', '透かしレイアウト', '워터마크 배치', 'Diseño de marca de agua', 'Wasserzeichenlayout', 'Disposition du filigrane'],
  ['單一浮水印', 'Single watermark', '単一の透かし', '단일 워터마크', 'Una marca de agua', 'Einzelnes Wasserzeichen', 'Filigrane unique'],
  ['重複鋪滿頁面', 'Repeat across page', 'ページ全体に繰り返す', '페이지 전체에 반복', 'Repetir por toda la página', 'Über die Seite wiederholen', 'Répéter sur toute la page'],
  ['文字大小', 'Text size', '文字サイズ', '텍스트 크기', 'Tamaño del texto', 'Textgröße', 'Taille du texte'],
  ['縮放比例', 'Scale', '拡大率', '배율', 'Escala', 'Skalierung', 'Échelle'],
  ['透明度', 'Opacity', '不透明度', '불투명도', 'Opacidad', 'Deckkraft', 'Opacité'],
  ['位置', 'Position', '位置', '위치', 'Posición', 'Position', 'Position'],
  ['置中', 'Center', '中央', '가운데', 'Centro', 'Mitte', 'Centre'],
  ['左上', 'Top left', '左上', '왼쪽 위', 'Arriba izquierda', 'Oben links', 'En haut à gauche'],
  ['右上', 'Top right', '右上', '오른쪽 위', 'Arriba derecha', 'Oben rechts', 'En haut à droite'],
  ['左下', 'Bottom left', '左下', '왼쪽 아래', 'Abajo izquierda', 'Unten links', 'En bas à gauche'],
  ['右下', 'Bottom right', '右下', '오른쪽 아래', 'Abajo derecha', 'Unten rechts', 'En bas à droite'],
  ['旋轉角度', 'Rotation angle', '回転角度', '회전 각도', 'Ángulo de rotación', 'Drehwinkel', 'Angle de rotation'],
  ['自動在頁面下方加入頁碼', 'Automatically add page numbers at the bottom', 'ページ下部にページ番号を自動追加', '페이지 아래에 페이지 번호 자동 추가', 'Añadir números de página automáticamente', 'Seitenzahlen unten automatisch hinzufügen', 'Ajouter automatiquement les numéros de page en bas'],
  ['頁碼字型', 'Page number font', 'ページ番号フォント', '페이지 번호 글꼴', 'Fuente del número de página', 'Schrift der Seitenzahl', 'Police des numéros de page'],
  ['頁碼大小', 'Page number size', 'ページ番号サイズ', '페이지 번호 크기', 'Tamaño del número de página', 'Größe der Seitenzahl', 'Taille des numéros de page'],
  ['效果預覽', 'Effect preview', '効果プレビュー', '효과 미리보기', 'Vista previa del efecto', 'Effektvorschau', 'Aperçu du résultat'],
  ['尚未載入 PDF', 'No PDF loaded', 'PDF 未読み込み', 'PDF가 로드되지 않음', 'No se ha cargado ningún PDF', 'Kein PDF geladen', 'Aucun PDF chargé'],
  ['正在載入第 1 頁…', 'Loading page 1…', '1 ページ目を読み込み中…', '1페이지 로드 중…', 'Cargando la página 1…', 'Seite 1 wird geladen…', 'Chargement de la page 1…'],
  ['PDF 第 1 頁', 'PDF page 1', 'PDF 1 ページ目', 'PDF 1페이지', 'Página 1 del PDF', 'PDF-Seite 1', 'Page 1 du PDF'],
  ['PDF 第一頁預覽', 'Preview of PDF page 1', 'PDF 1 ページ目のプレビュー', 'PDF 1페이지 미리보기', 'Vista previa de la página 1 del PDF', 'Vorschau der ersten PDF-Seite', 'Aperçu de la première page du PDF'],
  ['浮水印與頁碼效果預覽', 'Watermark and page number preview', '透かしとページ番号のプレビュー', '워터마크 및 페이지 번호 미리보기', 'Vista previa de marca de agua y numeración', 'Vorschau für Wasserzeichen und Seitenzahlen', 'Aperçu du filigrane et des numéros de page'],
  ['加入 PDF 後會使用第一頁實際畫面預覽；輸出仍以原始 PDF 頁面尺寸計算。', 'After adding a PDF, its actual first page is used for preview; output is calculated from the original page size.', 'PDF 追加後は実際の 1 ページ目を表示します。出力は元のページサイズで計算されます。', 'PDF를 추가하면 실제 첫 페이지로 미리 봅니다. 출력은 원본 페이지 크기로 계산됩니다.', 'Al añadir un PDF se usa su primera página real; la salida se calcula con el tamaño original.', 'Nach dem Hinzufügen wird die echte erste Seite angezeigt; die Ausgabe basiert auf der Originalgröße.', 'Après ajout, la première page réelle est affichée ; la sortie utilise les dimensions d’origine.'],

  ['準備就緒', 'Ready', '準備完了', '준비 완료', 'Listo', 'Bereit', 'Prêt'],
  ['尚未加入檔案', 'No files added', 'ファイル未追加', '추가된 파일 없음', 'No se han añadido archivos', 'Keine Dateien hinzugefügt', 'Aucun fichier ajouté'],
  ['待處理檔案', 'Files to process', '処理待ちファイル', '처리할 파일', 'Archivos pendientes', 'Zu verarbeitende Dateien', 'Fichiers à traiter'],
  ['清除全部', 'Clear all', 'すべてクリア', '모두 지우기', 'Borrar todo', 'Alle löschen', 'Tout effacer'],
  ['處理歷程', 'Processing history', '処理履歴', '처리 기록', 'Historial de procesamiento', 'Verarbeitungsverlauf', 'Historique des traitements'],
  ['展開', 'Expand', '展開', '펼치기', 'Expandir', 'Aufklappen', 'Développer'],
  ['收合', 'Collapse', '折りたたむ', '접기', 'Contraer', 'Einklappen', 'Réduire'],
  ['全部釋放', 'Release all', 'すべて解放', '모두 해제', 'Liberar todo', 'Alle freigeben', 'Tout libérer'],
  ['檔案與處理歷程', 'Files and processing history', 'ファイルと処理履歴', '파일 및 처리 기록', 'Archivos e historial', 'Dateien und Verarbeitungsverlauf', 'Fichiers et historique'],
  ['本批次', 'CURRENT BATCH', '現在のバッチ', '현재 작업', 'LOTE ACTUAL', 'AKTUELLER STAPEL', 'LOT ACTUEL'],
  ['本次歷程', 'SESSION HISTORY', 'セッション履歴', '세션 기록', 'HISTORIAL DE SESIÓN', 'SITZUNGSVERLAUF', 'HISTORIQUE DE SESSION'],
  ['頁面工作區', 'PAGE WORKSPACE', 'ページ作業領域', '페이지 작업 영역', 'ÁREA DE PÁGINAS', 'SEITENARBEITSBEREICH', 'ESPACE DE PAGES'],
  ['尚未加入檔案，請從左側選擇或拖曳檔案。', 'No files added. Choose or drop files on the left.', 'ファイルがありません。左側で選択またはドロップしてください。', '추가된 파일이 없습니다. 왼쪽에서 선택하거나 놓으세요.', 'No hay archivos. Selecciona o suelta archivos a la izquierda.', 'Keine Dateien hinzugefügt. Links auswählen oder ablegen.', 'Aucun fichier ajouté. Choisissez ou déposez des fichiers à gauche.'],
  ['完成處理後，結果會顯示在這裡。', 'Completed results will appear here.', '処理結果はここに表示されます。', '완료된 결과가 여기에 표시됩니다.', 'Los resultados aparecerán aquí.', 'Fertige Ergebnisse werden hier angezeigt.', 'Les résultats terminés apparaîtront ici.'],
  ['等待中', 'Waiting', '待機中', '대기 중', 'En espera', 'Wartend', 'En attente'],
  ['處理中', 'Processing', '処理中', '처리 중', 'Procesando', 'Verarbeitung', 'Traitement'],
  ['完成', 'Complete', '完了', '완료', 'Completado', 'Abgeschlossen', 'Terminé'],
  ['失敗', 'Failed', '失敗', '실패', 'Error', 'Fehlgeschlagen', 'Échec'],
  ['移除', 'Remove', '削除', '제거', 'Quitar', 'Entfernen', 'Retirer'],

  ['頁面編排', 'Page layout', 'ページ編集', '페이지 편집', 'Organización de páginas', 'Seitenanordnung', 'Organisation des pages'],
  ['已選取 0 頁', '0 pages selected', '0 ページ選択', '0페이지 선택됨', '0 páginas seleccionadas', '0 Seiten ausgewählt', '0 page sélectionnée'],
  ['頁面操作', 'Page actions', 'ページ操作', '페이지 작업', 'Acciones de página', 'Seitenaktionen', 'Actions sur les pages'],
  ['全選／取消', 'Select all / none', 'すべて選択／解除', '전체 선택 / 해제', 'Seleccionar todo / ninguno', 'Alle / keine auswählen', 'Tout sélectionner / désélectionner'],
  ['向左旋轉', 'Rotate left', '左に回転', '왼쪽으로 회전', 'Girar a la izquierda', 'Nach links drehen', 'Rotation à gauche'],
  ['向右旋轉', 'Rotate right', '右に回転', '오른쪽으로 회전', 'Girar a la derecha', 'Nach rechts drehen', 'Rotation à droite'],
  ['刪除選取', 'Delete selected', '選択項目を削除', '선택 항목 삭제', 'Eliminar seleccionadas', 'Auswahl löschen', 'Supprimer la sélection'],
  ['擷取選取頁面', 'Extract selected pages', '選択ページを抽出', '선택 페이지 추출', 'Extraer páginas seleccionadas', 'Ausgewählte Seiten extrahieren', 'Extraire les pages sélectionnées'],
  ['點選頁面即可選取；滑鼠可直接拖曳排序，手機請長按卡片後拖動，也可使用左右箭頭。', 'Click a page to select it. Drag with a mouse to reorder; on mobile, press and hold a card, or use the arrow buttons.', 'ページをクリックして選択します。マウスでドラッグ、モバイルでは長押し、または矢印で並べ替えできます。', '페이지를 눌러 선택하세요. 마우스로 드래그하거나 모바일에서 길게 누르고 이동하거나 화살표를 사용하세요.', 'Haz clic para seleccionar. Arrastra con el ratón; en móvil mantén pulsada la tarjeta o usa las flechas.', 'Seite anklicken zum Auswählen. Mit der Maus ziehen; mobil lange drücken oder Pfeile verwenden.', 'Cliquez pour sélectionner. Faites glisser à la souris ; sur mobile, maintenez la carte ou utilisez les flèches.'],

  ['處理時發生錯誤', 'Processing error', '処理エラー', '처리 오류', 'Error de procesamiento', 'Verarbeitungsfehler', 'Erreur de traitement'],
  ['關閉錯誤提醒', 'Close error message', 'エラーを閉じる', '오류 메시지 닫기', 'Cerrar mensaje de error', 'Fehlermeldung schließen', 'Fermer le message d’erreur'],
  ['處理失敗。', 'Processing failed.', '処理に失敗しました。', '처리에 실패했습니다.', 'El procesamiento ha fallado.', 'Verarbeitung fehlgeschlagen.', 'Le traitement a échoué.'],
  ['PDF 處理失敗。', 'PDF processing failed.', 'PDF の処理に失敗しました。', 'PDF 처리에 실패했습니다.', 'Error al procesar el PDF.', 'PDF-Verarbeitung fehlgeschlagen.', 'Échec du traitement du PDF.'],
  ['無法載入 PDF 第一頁預覽。', 'Could not load the first-page PDF preview.', 'PDF 1 ページ目のプレビューを読み込めません。', 'PDF 첫 페이지 미리보기를 불러올 수 없습니다.', 'No se pudo cargar la vista previa de la primera página.', 'Vorschau der ersten PDF-Seite konnte nicht geladen werden.', 'Impossible de charger l’aperçu de la première page.'],
  ['無法建立圖片浮水印預覽。', 'Could not create the image-watermark preview.', '画像透かしのプレビューを作成できません。', '이미지 워터마크 미리보기를 만들 수 없습니다.', 'No se pudo crear la vista previa de la marca de agua.', 'Bildwasserzeichen-Vorschau konnte nicht erstellt werden.', 'Impossible de créer l’aperçu du filigrane image.'],
  ['浮水印圖片無法使用。', 'The watermark image cannot be used.', '透かし画像を使用できません。', '워터마크 이미지를 사용할 수 없습니다.', 'No se puede usar la imagen de marca de agua.', 'Das Wasserzeichenbild kann nicht verwendet werden.', 'L’image de filigrane ne peut pas être utilisée.'],
  ['圖片不可超過 20 MB。', 'The image must not exceed 20 MB.', '画像は 20 MB 以下にしてください。', '이미지는 20MB 이하여야 합니다.', 'La imagen no debe superar los 20 MB.', 'Das Bild darf höchstens 20 MB groß sein.', 'L’image ne doit pas dépasser 20 Mo.'],
  ['只支援 PNG、JPG 或 SVG。', 'Only PNG, JPG, or SVG is supported.', 'PNG、JPG、SVG のみ対応しています。', 'PNG, JPG 또는 SVG만 지원합니다.', 'Solo se admite PNG, JPG o SVG.', 'Nur PNG, JPG oder SVG wird unterstützt.', 'Seuls PNG, JPG et SVG sont pris en charge.'],
  ['可能原因：', 'Possible cause: ', '考えられる原因：', '가능한 원인: ', 'Posible causa: ', 'Mögliche Ursache: ', 'Cause possible : '],
  ['檔案會逐一處理；多檔結果會打包成單一 ZIP 下載。', 'Files are processed one by one; multiple results are downloaded as one ZIP.', 'ファイルは順番に処理され、複数の結果は 1 つの ZIP でダウンロードされます。', '파일은 하나씩 처리되며 여러 결과는 하나의 ZIP으로 다운로드됩니다.', 'Los archivos se procesan uno a uno; varios resultados se descargan en un ZIP.', 'Dateien werden einzeln verarbeitet; mehrere Ergebnisse werden als ZIP heruntergeladen.', 'Les fichiers sont traités un par un ; plusieurs résultats sont téléchargés dans un ZIP.'],
  ['加密 PDF 請先使用「移除密碼」。可拖曳檔案或使用箭頭調整合併順序。', 'Use Remove password first for encrypted PDFs. Drag files or use arrows to change merge order.', '暗号化 PDF は先に「パスワード解除」を使用してください。ドラッグまたは矢印で結合順を変更できます。', '암호화된 PDF는 먼저 암호 제거를 사용하세요. 드래그하거나 화살표로 병합 순서를 조정할 수 있습니다.', 'Para PDF cifrados usa primero Quitar contraseña. Arrastra o usa las flechas para ordenar.', 'Für verschlüsselte PDFs zuerst Passwort entfernen verwenden. Reihenfolge per Ziehen oder Pfeile ändern.', 'Pour les PDF chiffrés, utilisez d’abord Supprimer le mot de passe. Réordonnez par glisser ou avec les flèches.'],
  ['多頁輸出會打包成一個 ZIP，避免瀏覽器阻擋連續下載。', 'Multiple pages are packed into one ZIP to avoid blocked consecutive downloads.', '複数ページは ZIP にまとめ、連続ダウンロードのブロックを防ぎます。', '여러 페이지는 ZIP으로 묶어 연속 다운로드 차단을 방지합니다.', 'Las páginas se agrupan en un ZIP para evitar bloqueos de descargas consecutivas.', 'Mehrere Seiten werden als ZIP gepackt, damit Folgedownloads nicht blockiert werden.', 'Les pages sont regroupées dans un ZIP pour éviter le blocage des téléchargements successifs.'],
  ['每張圖片會成為一頁，頁面尺寸會配合原始圖片。', 'Each image becomes one page sized to the original image.', '各画像が 1 ページになり、ページサイズは元画像に合わせられます。', '각 이미지가 한 페이지가 되며 페이지 크기는 원본 이미지에 맞춰집니다.', 'Cada imagen será una página con el tamaño de la imagen original.', 'Jedes Bild wird eine Seite in der Größe des Originalbilds.', 'Chaque image devient une page aux dimensions de l’image d’origine.'],
  ['高解析度會使用較多記憶體；大型 PDF 建議使用標準或清晰模式。', 'High resolution uses more memory; use a lower setting for large PDFs.', '高解像度はメモリを多く使用します。大きな PDF では低い設定を推奨します。', '고해상도는 메모리를 더 사용합니다. 큰 PDF에는 낮은 설정을 권장합니다.', 'La alta resolución usa más memoria; usa un ajuste menor para PDF grandes.', 'Hohe Auflösung benötigt mehr Speicher; für große PDFs eine niedrigere Stufe wählen.', 'La haute résolution utilise plus de mémoire ; choisissez un réglage inférieur pour les gros PDF.'],
  ['縮圖及輸出均在瀏覽器本機建立；大型 PDF 可能需要較長時間。', 'Thumbnails and output are created locally; large PDFs may take longer.', 'サムネイルと出力はブラウザー内で作成されます。大きな PDF は時間がかかる場合があります。', '미리보기와 출력은 브라우저에서 생성되며 큰 PDF는 시간이 더 걸릴 수 있습니다.', 'Las miniaturas y la salida se crean localmente; los PDF grandes pueden tardar.', 'Vorschauen und Ausgabe werden lokal erstellt; große PDFs können länger dauern.', 'Les miniatures et la sortie sont créées localement ; les gros PDF peuvent prendre plus de temps.'],
  ['中文浮水印會使用瀏覽器字型繪製；所有處理均不會上傳。', 'Watermark text uses browser fonts; no processing data is uploaded.', '透かし文字はブラウザーのフォントで描画され、データは送信されません。', '워터마크 텍스트는 브라우저 글꼴로 그려지며 데이터는 업로드되지 않습니다.', 'El texto usa las fuentes del navegador; no se sube ningún dato.', 'Wasserzeichentext nutzt Browser-Schriften; keine Daten werden hochgeladen.', 'Le texte utilise les polices du navigateur ; aucune donnée n’est envoyée.'],
  ['正在準備處理檔案…', 'Preparing files…', 'ファイルを準備中…', '파일 준비 중…', 'Preparando archivos…', 'Dateien werden vorbereitet…', 'Préparation des fichiers…'],
  ['正在建立頁面縮圖…', 'Creating page thumbnails…', 'ページのサムネイルを作成中…', '페이지 미리보기 생성 중…', 'Creando miniaturas…', 'Seitenvorschauen werden erstellt…', 'Création des miniatures…'],
  ['正在將解鎖完成的 PDF 打包為 ZIP…', 'Packing unlocked PDFs into a ZIP…', '解除済み PDF を ZIP にまとめています…', '암호 해제된 PDF를 ZIP으로 묶는 중…', 'Comprimiendo los PDF desbloqueados en un ZIP…', 'Entsperrte PDFs werden als ZIP gepackt…', 'Création du ZIP des PDF déverrouillés…'],
  ['正在將加密完成的 PDF 打包為 ZIP…', 'Packing protected PDFs into a ZIP…', '保護済み PDF を ZIP にまとめています…', '암호화된 PDF를 ZIP으로 묶는 중…', 'Comprimiendo los PDF protegidos en un ZIP…', 'Geschützte PDFs werden als ZIP gepackt…', 'Création du ZIP des PDF protégés…'],
  ['使用 AES-256 在瀏覽器本機加密；多檔結果會打包成 ZIP。', 'Uses AES-256 encryption locally in your browser; multiple results are packed into a ZIP.', 'ブラウザー内で AES-256 暗号化します。複数の結果は ZIP にまとめられます。', '브라우저에서 AES-256으로 암호화하며 여러 결과는 ZIP으로 묶입니다.', 'Cifra con AES-256 localmente en el navegador; varios resultados se guardan en un ZIP.', 'Verschlüsselt lokal im Browser mit AES-256; mehrere Ergebnisse werden als ZIP gepackt.', 'Chiffre localement dans le navigateur avec AES-256 ; plusieurs résultats sont regroupés dans un ZIP.'],
  ['處理中…', 'Processing…', '処理中…', '처리 중…', 'Procesando…', 'Verarbeitung…', 'Traitement…'],
  ['請先加入檔案。', 'Add a file first.', '先にファイルを追加してください。', '먼저 파일을 추가하세요.', 'Añade primero un archivo.', 'Fügen Sie zuerst eine Datei hinzu.', 'Ajoutez d’abord un fichier.'],
  ['請輸入 PDF 密碼。', 'Enter the PDF password.', 'PDF パスワードを入力してください。', 'PDF 암호를 입력하세요.', 'Introduce la contraseña del PDF.', 'Geben Sie das PDF-Passwort ein.', 'Saisissez le mot de passe PDF.'],
  ['兩次輸入的密碼不一致。', 'The passwords do not match.', 'パスワードが一致しません。', '암호가 일치하지 않습니다.', 'Las contraseñas no coinciden.', 'Die Passwörter stimmen nicht überein.', 'Les mots de passe ne correspondent pas.'],
  ['確認兩個欄位完全相同後再試一次。', 'Make sure both fields are identical, then try again.', '2 つの入力欄が完全に同じことを確認して、もう一度お試しください。', '두 입력란이 완전히 같은지 확인한 후 다시 시도하세요.', 'Comprueba que ambos campos sean idénticos y vuelve a intentarlo.', 'Prüfen Sie, ob beide Felder identisch sind, und versuchen Sie es erneut.', 'Vérifiez que les deux champs sont identiques, puis réessayez.'],
  ['無法為 PDF 加上密碼。', 'Unable to password-protect the PDF.', 'PDF にパスワードを設定できません。', 'PDF에 암호를 설정할 수 없습니다.', 'No se pudo proteger el PDF con contraseña.', 'Die PDF konnte nicht mit einem Passwort geschützt werden.', 'Impossible de protéger le PDF par mot de passe.'],
  ['請輸入浮水印文字或勾選加入頁碼。', 'Enter watermark text or enable page numbers.', '透かし文字を入力するか、ページ番号を有効にしてください。', '워터마크 텍스트를 입력하거나 페이지 번호를 켜세요.', 'Introduce el texto de la marca de agua o activa los números de página.', 'Wasserzeichentext eingeben oder Seitenzahlen aktivieren.', 'Saisissez le texte du filigrane ou activez les numéros de page.'],
  ['請選擇浮水印圖片或勾選加入頁碼。', 'Choose a watermark image or enable page numbers.', '透かし画像を選択するか、ページ番号を有効にしてください。', '워터마크 이미지를 선택하거나 페이지 번호를 켜세요.', 'Elige una imagen de marca de agua o activa los números de página.', 'Wasserzeichenbild auswählen oder Seitenzahlen aktivieren.', 'Choisissez une image de filigrane ou activez les numéros de page.'],
  ['此工具一次只能處理一個檔案。', 'This tool can process only one file at a time.', 'このツールは一度に 1 ファイルだけ処理できます。', '이 도구는 한 번에 파일 하나만 처리할 수 있습니다.', 'Esta herramienta solo procesa un archivo a la vez.', 'Dieses Werkzeug verarbeitet nur eine Datei gleichzeitig.', 'Cet outil ne traite qu’un fichier à la fois.'],
  ['此 PDF 受密碼保護，請先使用「移除密碼」。', 'This PDF is password-protected. Use Remove password first.', 'この PDF はパスワード保護されています。先にパスワード解除を使用してください。', '이 PDF는 암호로 보호되어 있습니다. 먼저 암호 제거를 사용하세요.', 'Este PDF está protegido. Usa primero Quitar contraseña.', 'Dieses PDF ist passwortgeschützt. Zuerst Passwort entfernen verwenden.', 'Ce PDF est protégé. Utilisez d’abord Supprimer le mot de passe.'],
  ['此 PDF 沒有可編排的頁面。', 'This PDF has no pages to arrange.', 'この PDF には編集できるページがありません。', '이 PDF에는 편집할 페이지가 없습니다.', 'Este PDF no contiene páginas para organizar.', 'Dieses PDF enthält keine anzuordnenden Seiten.', 'Ce PDF ne contient aucune page à organiser.'],
  ['此 PDF 沒有可輸出的頁面。', 'This PDF has no pages to export.', 'この PDF には出力できるページがありません。', '이 PDF에는 출력할 페이지가 없습니다.', 'Este PDF no contiene páginas para exportar.', 'Dieses PDF enthält keine exportierbaren Seiten.', 'Ce PDF ne contient aucune page à exporter.'],
  ['頁面縮圖仍在載入，請稍候。', 'Page thumbnails are still loading. Please wait.', 'ページのサムネイルを読み込み中です。お待ちください。', '페이지 미리보기를 불러오는 중입니다. 잠시 기다려 주세요.', 'Las miniaturas aún se están cargando. Espera.', 'Seitenvorschauen werden noch geladen. Bitte warten.', 'Les miniatures sont encore en cours de chargement. Patientez.'],
  ['處理失敗，請確認檔案是否有效。', 'Processing failed. Check that the file is valid.', '処理に失敗しました。ファイルが有効か確認してください。', '처리에 실패했습니다. 파일이 유효한지 확인하세요.', 'Error de procesamiento. Comprueba que el archivo sea válido.', 'Verarbeitung fehlgeschlagen. Prüfen Sie die Datei.', 'Échec du traitement. Vérifiez que le fichier est valide.'],
  ['檔案格式無效或內容已損毀。', 'The file format is invalid or the content is corrupted.', 'ファイル形式が無効か、内容が破損しています。', '파일 형식이 잘못되었거나 내용이 손상되었습니다.', 'El formato no es válido o el archivo está dañado.', 'Das Dateiformat ist ungültig oder der Inhalt beschädigt.', 'Le format est invalide ou le contenu est endommagé.'],
  ['瀏覽器記憶體不足，請減少頁數或降低 JPG 清晰度。', 'The browser is low on memory. Reduce the page count or JPG resolution.', 'ブラウザーのメモリが不足しています。ページ数または JPG 解像度を下げてください。', '브라우저 메모리가 부족합니다. 페이지 수나 JPG 해상도를 낮추세요.', 'El navegador no tiene memoria suficiente. Reduce las páginas o la resolución JPG.', 'Zu wenig Browserspeicher. Seitenzahl oder JPG-Auflösung reduzieren.', 'Mémoire du navigateur insuffisante. Réduisez le nombre de pages ou la résolution JPG.'],
  ['已清除全部檔案。', 'All files cleared.', 'すべてのファイルをクリアしました。', '모든 파일을 지웠습니다.', 'Se borraron todos los archivos.', 'Alle Dateien wurden gelöscht.', 'Tous les fichiers ont été effacés.'],
  ['已清除歷程並釋放所有輸出資料。', 'History cleared and all output data released.', '履歴を消去し、すべての出力データを解放しました。', '기록과 모든 출력 데이터를 지웠습니다.', 'Se borró el historial y se liberaron todos los datos.', 'Verlauf gelöscht und alle Ausgabedaten freigegeben.', 'Historique effacé et toutes les données de sortie libérées.'],
  ['已更新 PDF 合併順序。', 'PDF merge order updated.', 'PDF の結合順を更新しました。', 'PDF 병합 순서를 업데이트했습니다.', 'Se actualizó el orden de combinación.', 'PDF-Reihenfolge wurde aktualisiert.', 'L’ordre de fusion des PDF a été mis à jour.'],
  ['釋放此結果', 'Release this result', 'この結果を解放', '이 결과 해제', 'Liberar este resultado', 'Dieses Ergebnis freigeben', 'Libérer ce résultat'],
  ['輸出資料已釋放，無法再次下載。', 'Output data was released and cannot be downloaded again.', '出力データは解放済みのため再ダウンロードできません。', '출력 데이터가 해제되어 다시 다운로드할 수 없습니다.', 'Los datos se liberaron y ya no se pueden descargar.', 'Ausgabedaten wurden freigegeben und können nicht erneut geladen werden.', 'Les données ont été libérées et ne peuvent plus être téléchargées.'],
  ['此筆沒有可下載的輸出。', 'This entry has no downloadable output.', 'この項目にはダウンロード可能な出力がありません。', '이 항목에는 다운로드할 출력이 없습니다.', 'Esta entrada no tiene resultados descargables.', 'Dieser Eintrag enthält keine herunterladbare Ausgabe.', 'Cette entrée ne contient aucune sortie téléchargeable.'],
  ['全部完成，已下載 1 個 PDF。', 'All complete. One PDF downloaded.', 'すべて完了し、PDF を 1 件ダウンロードしました。', '완료되었습니다. PDF 1개를 다운로드했습니다.', 'Todo listo. Se descargó un PDF.', 'Alles abgeschlossen. Ein PDF wurde heruntergeladen.', 'Tout est terminé. Un PDF a été téléchargé.'],
  ['成功檔案已打包下載。', 'Successful files were packed and downloaded.', '成功したファイルをまとめてダウンロードしました。', '성공한 파일을 묶어 다운로드했습니다.', 'Los archivos correctos se comprimieron y descargaron.', 'Erfolgreiche Dateien wurden gepackt und heruntergeladen.', 'Les fichiers réussis ont été regroupés et téléchargés.'],
];

// Additional columns in the same order as rows: zh-Hans, ru, pt-BR, th, vi, id.
const additionalRows = [
  ["语言","Язык","Idioma","ภาษา","Ngôn ngữ","Bahasa"],
  ["活动记录","Журнал действий","Atividade","กิจกรรม","Hoạt động","Aktivitas"],
  ["选择界面语言","Выберите язык интерфейса","Escolher idioma da interface","เลือกภาษาของหน้าจอ","Chọn ngôn ngữ giao diện","Pilih bahasa antarmuka"],
  ["PDF 工具箱｜免费处理 PDF，无需上传","Инструменты PDF — бесплатно и без загрузки на сервер","Ferramentas PDF grátis, sem enviar arquivos","เครื่องมือ PDF ฟรี ไม่ต้องอัปโหลดไฟล์","Công cụ PDF miễn phí, không cần tải tệp lên","Alat PDF gratis tanpa unggah file"],
  ["免费移除 PDF 密码、合并、拆分、转换、管理页面和添加水印。所有文件均在浏览器中处理，无需上传。","Снимайте пароль, объединяйте, разделяйте и конвертируйте PDF, меняйте порядок страниц и добавляйте водяные знаки. Всё в браузере, без отправки файлов на сервер.","Remova senhas, junte, divida e converta PDFs, organize páginas e adicione marcas-d’água. Tudo no navegador, sem enviar arquivos.","ปลดรหัสผ่าน รวม แยก แปลง จัดหน้าหรือใส่ลายน้ำ PDF ได้ฟรี ทุกอย่างทำในเบราว์เซอร์โดยไม่ต้องอัปโหลด","Gỡ mật khẩu, gộp, tách, chuyển đổi, sắp xếp trang và thêm hình mờ cho PDF. Tệp được xử lý ngay trong trình duyệt, không cần tải lên.","Hapus kata sandi, gabungkan, pisah, konversi, atur halaman, dan tambahkan tanda air PDF. Semua diproses di browser tanpa unggah."],
  ["PDF 工具, PDF 本地处理, PDF 无需上传, 合并 PDF, 拆分 PDF, 移除 PDF 密码, PDF 水印, PDF 转 JPG","инструменты PDF, PDF без загрузки, объединить PDF, разделить PDF, снять пароль PDF, водяной знак PDF, PDF в JPG","ferramentas PDF, PDF sem upload, juntar PDF, dividir PDF, remover senha de PDF, marca-d’água, PDF para JPG","เครื่องมือ PDF, รวม PDF, แยก PDF, ปลดรหัส PDF, ลายน้ำ PDF, PDF เป็น JPG","công cụ PDF, gộp PDF, tách PDF, gỡ mật khẩu PDF, hình mờ PDF, PDF sang JPG","alat PDF, gabung PDF, pisah PDF, hapus kata sandi PDF, tanda air PDF, PDF ke JPG"],
  ["免费 PDF 工具，文件仅在浏览器中处理，无需上传。","Бесплатные инструменты PDF. Файлы остаются в браузере.","Ferramentas PDF grátis. Seus arquivos ficam no navegador.","เครื่องมือ PDF ฟรี ไฟล์อยู่ในเบราว์เซอร์ของคุณ","Công cụ PDF miễn phí. Tệp chỉ được xử lý trong trình duyệt.","Alat PDF gratis. File tetap di browser Anda."],
  ["请仅处理您拥有或已获合法授权的文档。文件在浏览器中处理，不会上传到本站服务器。","Обрабатывайте только свои документы или документы, на работу с которыми у вас есть разрешение. Файлы остаются в вашем браузере.","Use apenas documentos seus ou que você tenha autorização para processar. Os arquivos ficam no seu navegador.","โปรดใช้เฉพาะเอกสารของคุณหรือเอกสารที่ได้รับอนุญาต ไฟล์จะได้รับการประมวลผลในเบราว์เซอร์","Chỉ xử lý tài liệu của bạn hoặc tài liệu bạn được phép sử dụng. Tệp chỉ được xử lý trong trình duyệt.","Proses hanya dokumen milik Anda atau yang boleh Anda gunakan. File diproses di browser Anda."],
  ["需要支持 JavaScript 和 WebAssembly 的现代浏览器","Нужен современный браузер с поддержкой JavaScript и WebAssembly","Requer um navegador moderno com JavaScript e WebAssembly","ต้องใช้เบราว์เซอร์ที่รองรับ JavaScript และ WebAssembly","Cần trình duyệt hiện đại hỗ trợ JavaScript và WebAssembly","Perlu browser modern yang mendukung JavaScript dan WebAssembly"],
  ["在浏览器中本地处理 PDF 的多功能工具","Набор инструментов для работы с PDF прямо в браузере","Várias ferramentas para trabalhar com PDF no navegador","ชุดเครื่องมือจัดการ PDF ในเบราว์เซอร์","Bộ công cụ xử lý PDF ngay trong trình duyệt","Berbagai alat PDF yang bekerja langsung di browser"],
  ["浏览器本地 PDF 工具","Работа с PDF в браузере","PDF direto no navegador","จัดการ PDF ในเบราว์เซอร์","Xử lý PDF trong trình duyệt","Olah PDF di browser"],
  ["PDF 工具箱","Инструменты PDF","Ferramentas PDF","เครื่องมือ PDF","Bộ công cụ PDF","Alat PDF"],
  ["✓ 100% 本地处理","✓ Всё обрабатывается в браузере","✓ Processamento no navegador","✓ ประมวลผลในเครื่อง 100%","✓ Xử lý 100% trên thiết bị","✓ 100% diproses di perangkat"],
  ["文件不会上传到服务器","Файлы не отправляются на сервер","Seus arquivos não são enviados a servidores","ไม่มีการส่งไฟล์ขึ้นเซิร์ฟเวอร์","Tệp không được gửi lên máy chủ","File tidak dikirim ke server"],
  ["选择工具","Выберите инструмент","Escolha uma ferramenta","เลือกเครื่องมือ","Chọn công cụ","Pilih alat"],
  ["PDF 工具","Инструменты для PDF","Utilitários PDF","เครื่องมือสำหรับ PDF","Công cụ PDF","Alat untuk PDF"],
  ["移除密码","Снять пароль","Remover senha","เอารหัสผ่านออก","Gỡ mật khẩu","Hapus kata sandi"],
  ["添加密码","Задать пароль","Proteger com senha","ตั้งรหัสผ่าน","Đặt mật khẩu","Atur kata sandi"],
  ["合并 PDF","Объединить PDF","Juntar PDF","รวม PDF","Gộp PDF","Gabungkan PDF"],
  ["拆分 PDF","Разделить PDF","Dividir PDF","แยก PDF","Tách PDF","Pisah PDF"],
  ["JPG 转 PDF","JPG в PDF","JPG para PDF","JPG เป็น PDF","JPG sang PDF","JPG ke PDF"],
  ["PDF 转 JPG","PDF в JPG","PDF para JPG","PDF เป็น JPG","PDF sang JPG","PDF ke JPG"],
  ["管理页面","Управление страницами","Organizar páginas","จัดการหน้า","Sắp xếp trang","Atur halaman"],
  ["水印与页码","Водяной знак и номера страниц","Marca-d’água e numeração","ลายน้ำและเลขหน้า","Hình mờ và số trang","Tanda air dan nomor halaman"],
  ["移除 PDF 密码","Снять пароль с PDF","Remover senha do PDF","เอารหัสผ่าน PDF ออก","Gỡ mật khẩu PDF","Hapus kata sandi PDF"],
  ["为 PDF 设置密码","Защитить PDF паролем","Proteger PDF com senha","ตั้งรหัสผ่านให้ PDF","Đặt mật khẩu cho PDF","Lindungi PDF dengan kata sandi"],
  ["PDF 页面管理","Управление страницами PDF","Organizar páginas do PDF","จัดการหน้า PDF","Sắp xếp trang PDF","Atur halaman PDF"],
  ["添加水印与页码","Добавить водяной знак и номера страниц","Adicionar marca-d’água e números de página","เพิ่มลายน้ำและเลขหน้า","Thêm hình mờ và số trang","Tambahkan tanda air dan nomor halaman"],
  ["添加使用相同密码的 PDF。多个结果会打包成 ZIP。","Добавьте PDF с одинаковым паролем. Несколько результатов будут собраны в ZIP.","Adicione PDFs com a mesma senha. Vários resultados saem em um ZIP.","เพิ่ม PDF ที่ใช้รหัสผ่านเดียวกัน หากได้หลายไฟล์ ระบบจะรวมเป็น ZIP","Thêm các PDF dùng chung mật khẩu. Nhiều tệp kết quả sẽ được gom vào ZIP.","Tambahkan PDF dengan kata sandi yang sama. Beberapa hasil dikemas dalam satu ZIP."],
  ["为一个或多个未加密的 PDF 设置相同的打开密码。","Задайте один пароль на открытие для одного или нескольких PDF без шифрования.","Defina a mesma senha de abertura para um ou mais PDFs sem criptografia.","ตั้งรหัสผ่านสำหรับเปิดไฟล์ให้ PDF ที่ยังไม่ได้เข้ารหัสหนึ่งไฟล์ขึ้นไป","Đặt cùng một mật khẩu mở cho một hoặc nhiều PDF chưa mã hóa.","Atur kata sandi pembuka yang sama untuk satu atau beberapa PDF yang belum dienkripsi."],
  ["按列表顺序将至少两个未加密的 PDF 合并为一个文件。","Объедините два или более незашифрованных PDF в порядке списка.","Junte dois ou mais PDFs sem criptografia na ordem da lista.","รวม PDF ที่ไม่ได้เข้ารหัสอย่างน้อยสองไฟล์ตามลำดับในรายการ","Gộp ít nhất hai PDF chưa mã hóa theo thứ tự trong danh sách.","Gabungkan dua PDF atau lebih yang belum dienkripsi sesuai urutan daftar."],
  ["将未加密 PDF 的每一页拆成独立 PDF，再打包成 ZIP。","Разделите незашифрованный PDF на отдельные страницы и скачайте их в ZIP.","Separe cada página de um PDF sem criptografia em um arquivo e baixe tudo em ZIP.","แยกแต่ละหน้าของ PDF ที่ไม่เข้ารหัสเป็นไฟล์ PDF แล้วดาวน์โหลดเป็น ZIP","Tách từng trang của PDF chưa mã hóa thành tệp PDF riêng rồi tải xuống dưới dạng ZIP.","Pisahkan tiap halaman PDF yang belum dienkripsi menjadi PDF tersendiri, lalu unduh sebagai ZIP."],
  ["按列表顺序将 JPG 图片转换为一个 PDF。","Соберите изображения JPG в один PDF в порядке списка.","Converta imagens JPG em um PDF na ordem da lista.","แปลงภาพ JPG เป็น PDF ตามลำดับในรายการ","Chuyển ảnh JPG thành một tệp PDF theo thứ tự trong danh sách.","Ubah gambar JPG menjadi satu PDF sesuai urutan daftar."],
  ["将未加密 PDF 的每一页转成 JPG，再打包成 ZIP。","Преобразуйте каждую страницу незашифрованного PDF в JPG и скачайте ZIP.","Converta cada página de um PDF sem criptografia em JPG e baixe em ZIP.","แปลงทุกหน้าของ PDF ที่ไม่เข้ารหัสเป็น JPG แล้วดาวน์โหลดเป็น ZIP","Chuyển từng trang của PDF chưa mã hóa sang JPG rồi tải xuống dưới dạng ZIP.","Ubah setiap halaman PDF yang belum dienkripsi menjadi JPG, lalu unduh sebagai ZIP."],
  ["预览、排序、旋转、删除或提取页面，再导出新 PDF。","Просматривайте, переставляйте, поворачивайте, удаляйте или извлекайте страницы и сохраняйте новый PDF.","Visualize, reordene, gire, exclua ou extraia páginas e salve um novo PDF.","ดูตัวอย่าง จัดลำดับ หมุน ลบ หรือแยกหน้า แล้วบันทึกเป็น PDF ใหม่","Xem trước, sắp xếp, xoay, xóa hoặc trích xuất trang rồi lưu thành PDF mới.","Pratinjau, urutkan, putar, hapus, atau ekstrak halaman, lalu ekspor PDF baru."],
  ["添加文字或图片水印，调整位置和角度，也可添加页码。","Добавьте текстовый или графический водяной знак, настройте его положение и угол или пронумеруйте страницы.","Adicione uma marca-d’água de texto ou imagem, ajuste a posição e o ângulo ou numere as páginas.","ใส่ลายน้ำแบบข้อความหรือรูปภาพ ปรับตำแหน่งและมุม หรือเพิ่มเลขหน้า","Thêm hình mờ dạng chữ hoặc ảnh, chỉnh vị trí và góc xoay hoặc đánh số trang.","Tambahkan tanda air teks atau gambar, atur posisi dan sudut, atau beri nomor halaman."],
  ["将加密 PDF 拖到这里","Перетащите сюда защищённые PDF","Arraste os PDFs protegidos para cá","ลาก PDF ที่เข้ารหัสมาที่นี่","Kéo PDF đã mã hóa vào đây","Seret PDF terenkripsi ke sini"],
  ["将要加密的 PDF 拖到这里","Перетащите сюда PDF для защиты","Arraste os PDFs que quer proteger","ลาก PDF ที่ต้องการตั้งรหัสมาที่นี่","Kéo PDF cần đặt mật khẩu vào đây","Seret PDF yang ingin dilindungi ke sini"],
  ["将要合并的 PDF 拖到这里","Перетащите сюда PDF для объединения","Arraste os PDFs que quer juntar","ลาก PDF ที่ต้องการรวมมาที่นี่","Kéo PDF cần gộp vào đây","Seret PDF yang ingin digabungkan ke sini"],
  ["将一个 PDF 拖到这里","Перетащите сюда один PDF","Arraste um PDF para cá","ลาก PDF หนึ่งไฟล์มาที่นี่","Kéo một tệp PDF vào đây","Seret satu PDF ke sini"],
  ["将 JPG 图片拖到这里","Перетащите сюда изображения JPG","Arraste as imagens JPG para cá","ลากภาพ JPG มาที่นี่","Kéo ảnh JPG vào đây","Seret gambar JPG ke sini"],
  ["将 PDF 拖到这里","Перетащите PDF сюда","Arraste o PDF para cá","ลาก PDF มาที่นี่","Kéo tệp PDF vào đây","Seret PDF ke sini"],
  ["或点击选择多个 PDF","Или нажмите, чтобы выбрать несколько PDF","Ou clique para selecionar vários PDFs","หรือคลิกเพื่อเลือก PDF หลายไฟล์","Hoặc bấm để chọn nhiều PDF","Atau klik untuk memilih beberapa PDF"],
  ["或点击选择多个文件","Или нажмите, чтобы выбрать несколько файлов","Ou clique para selecionar vários arquivos","หรือคลิกเพื่อเลือกหลายไฟล์","Hoặc bấm để chọn nhiều tệp","Atau klik untuk memilih beberapa file"],
  ["文件按添加顺序合并","Файлы объединяются в порядке добавления","Os arquivos são juntados na ordem em que forem adicionados","ระบบจะรวมไฟล์ตามลำดับที่เพิ่ม","Tệp được gộp theo thứ tự thêm vào","File digabungkan sesuai urutan penambahan"],
  ["每页生成一个 PDF","Каждая страница станет отдельным PDF","Cada página vira um PDF","แต่ละหน้าจะเป็น PDF หนึ่งไฟล์","Mỗi trang tạo thành một PDF","Setiap halaman menjadi satu PDF"],
  ["支持多张 JPG/JPEG 图片","Можно выбрать несколько изображений JPG/JPEG","Aceita várias imagens JPG ou JPEG","รองรับภาพ JPG หรือ JPEG หลายภาพ","Hỗ trợ nhiều ảnh JPG hoặc JPEG","Mendukung beberapa gambar JPG atau JPEG"],
  ["每页生成一张 JPG","Каждая страница станет отдельным JPG","Cada página vira um JPG","แต่ละหน้าจะเป็น JPG หนึ่งภาพ","Mỗi trang tạo thành một ảnh JPG","Setiap halaman menjadi satu JPG"],
  ["加载后会生成页面缩略图","После загрузки появятся миниатюры страниц","As miniaturas aparecem após o carregamento","เมื่อโหลดแล้วจะแสดงภาพย่อของหน้า","Ảnh thu nhỏ sẽ hiện sau khi nạp tệp","Thumbnail halaman muncul setelah file dimuat"],
  ["设置水印或页码后导出新 PDF","Настройте водяной знак или номера страниц и сохраните новый PDF","Configure a marca-d’água ou a numeração e salve um novo PDF","ตั้งค่าลายน้ำหรือเลขหน้า แล้วบันทึก PDF ใหม่","Thiết lập hình mờ hoặc số trang rồi lưu PDF mới","Atur tanda air atau nomor halaman, lalu ekspor PDF baru"],
  ["点击选择文件","Нажмите, чтобы выбрать файлы","Clique para escolher arquivos","คลิกเพื่อเลือกไฟล์","Bấm để chọn tệp","Klik untuk memilih file"],
  ["从设备中选择要处理的文件","Выберите файлы на устройстве","Escolha os arquivos no seu dispositivo","เลือกไฟล์ที่ต้องการจากอุปกรณ์","Chọn tệp cần xử lý trên thiết bị","Pilih file dari perangkat Anda"],
  ["移除所有密码并下载","Снять пароли и скачать","Remover senhas e baixar","เอารหัสผ่านออกทั้งหมดแล้วดาวน์โหลด","Gỡ mọi mật khẩu và tải xuống","Hapus semua kata sandi dan unduh"],
  ["加密并下载 PDF","Защитить и скачать PDF","Proteger e baixar PDF","ตั้งรหัสผ่านและดาวน์โหลด PDF","Mã hóa và tải PDF xuống","Enkripsi dan unduh PDF"],
  ["合并并下载 PDF","Объединить и скачать PDF","Juntar e baixar PDF","รวมและดาวน์โหลด PDF","Gộp và tải PDF xuống","Gabungkan dan unduh PDF"],
  ["拆分并下载 ZIP","Разделить и скачать ZIP","Dividir e baixar ZIP","แยกและดาวน์โหลด ZIP","Tách và tải ZIP xuống","Pisahkan dan unduh ZIP"],
  ["转换并下载 PDF","Преобразовать и скачать PDF","Converter e baixar PDF","แปลงและดาวน์โหลด PDF","Chuyển đổi và tải PDF xuống","Konversi dan unduh PDF"],
  ["转换并下载 ZIP","Преобразовать и скачать ZIP","Converter e baixar ZIP","แปลงและดาวน์โหลด ZIP","Chuyển đổi và tải ZIP xuống","Konversi dan unduh ZIP"],
  ["应用页面调整并下载","Применить изменения и скачать","Aplicar alterações nas páginas e baixar","ใช้การจัดหน้าแล้วดาวน์โหลด","Áp dụng thay đổi trang và tải xuống","Terapkan perubahan halaman dan unduh"],
  ["应用并下载 PDF","Применить и скачать PDF","Aplicar e baixar PDF","นำไปใช้และดาวน์โหลด PDF","Áp dụng và tải PDF xuống","Terapkan dan unduh PDF"],
  ["PDF 密码","Пароль PDF","Senha do PDF","รหัสผ่าน PDF","Mật khẩu PDF","Kata sandi PDF"],
  ["输入 PDF 密码","Введите пароль PDF","Digite a senha do PDF","กรอกรหัสผ่าน PDF","Nhập mật khẩu PDF","Masukkan kata sandi PDF"],
  ["新密码","Новый пароль","Nova senha","รหัสผ่านใหม่","Mật khẩu mới","Kata sandi baru"],
  ["输入新的 PDF 打开密码","Введите новый пароль для открытия PDF","Digite a nova senha de abertura do PDF","กรอกรหัสผ่านใหม่สำหรับเปิด PDF","Nhập mật khẩu mới để mở PDF","Masukkan kata sandi baru untuk membuka PDF"],
  ["确认密码","Подтвердите пароль","Confirme a senha","ยืนยันรหัสผ่าน","Xác nhận mật khẩu","Konfirmasi kata sandi"],
  ["再次输入相同密码","Повторите пароль","Digite a mesma senha novamente","กรอกรหัสผ่านเดิมอีกครั้ง","Nhập lại cùng mật khẩu","Masukkan lagi kata sandi yang sama"],
  ["使用 AES-256 加密。建议至少输入 8 个字符，并妥善保管密码。","Шифрование AES-256. Используйте не менее 8 символов и храните пароль в надёжном месте.","Criptografia AES-256. Use pelo menos 8 caracteres e guarde a senha em local seguro.","เข้ารหัสด้วย AES-256 ใช้อย่างน้อย 8 อักขระและเก็บรหัสผ่านไว้ให้ปลอดภัย","Mã hóa AES-256. Dùng ít nhất 8 ký tự và cất mật khẩu ở nơi an toàn.","Enkripsi AES-256. Gunakan minimal 8 karakter dan simpan kata sandi dengan aman."],
  ["密码设置方式","Способ задания пароля","Como definir a senha","วิธีตั้งรหัสผ่าน","Cách đặt mật khẩu","Cara mengatur kata sandi"],
  ["自行设置密码","Задать свой пароль","Criar minha própria senha","ตั้งรหัสผ่านเอง","Tự đặt mật khẩu","Buat kata sandi sendiri"],
  ["自动生成密码","Сгенерировать пароль","Gerar uma senha","สร้างรหัสผ่านอัตโนมัติ","Tạo mật khẩu tự động","Buat kata sandi otomatis"],
  ["密码长度","Длина пароля","Tamanho da senha","ความยาวรหัสผ่าน","Độ dài mật khẩu","Panjang kata sandi"],
  ["较弱","Слабый","Fraca","อ่อน","Yếu","Lemah"],
  ["基本","Базовый","Básica","พื้นฐาน","Cơ bản","Dasar"],
  ["推荐","Рекомендуемый","Recomendada","แนะนำ","Khuyên dùng","Disarankan"],
  ["很强","Очень надёжный","Muito forte","แข็งแรงมาก","Rất mạnh","Sangat kuat"],
  ["极强","Максимальная стойкость","Máxima proteção","ความปลอดภัยสูงสุด","Mạnh nhất","Paling kuat"],
  ["8–12 个字符安全性较低，建议至少使用 24 个字符。","Пароль из 8–12 символов менее надёжен. Лучше использовать от 24 символов.","De 8 a 12 caracteres oferecem menos proteção. Prefira 24 ou mais.","รหัส 8–12 อักขระปลอดภัยน้อยกว่า แนะนำให้ใช้อย่างน้อย 24 อักขระ","Mật khẩu 8–12 ký tự kém an toàn hơn. Nên dùng ít nhất 24 ký tự.","Kata sandi 8–12 karakter kurang aman. Gunakan 24 karakter atau lebih."],
  ["包含特殊字符","Добавить спецсимволы","Incluir caracteres especiais","รวมอักขระพิเศษ","Dùng ký tự đặc biệt","Sertakan karakter khusus"],
  ["生成的密码","Сгенерированный пароль","Senha gerada","รหัสผ่านที่สร้างขึ้น","Mật khẩu đã tạo","Kata sandi yang dibuat"],
  ["复制密码","Скопировать пароль","Copiar senha","คัดลอกรหัสผ่าน","Sao chép mật khẩu","Salin kata sandi"],
  ["重新生成密码","Сгенерировать новый пароль","Gerar outra senha","สร้างรหัสผ่านใหม่","Tạo mật khẩu khác","Buat kata sandi lain"],
  ["加密文件与密码 TXT 会分别下载。离开此工具或刷新页面后，屏幕上将不再显示密码。","Защищённые файлы и TXT с паролем скачиваются отдельно. Пароль виден до смены инструмента или обновления страницы.","Os arquivos protegidos e o TXT com a senha são baixados separadamente. A senha fica visível até sair da ferramenta ou recarregar a página.","ไฟล์ที่เข้ารหัสกับ TXT ที่มีรหัสผ่านจะดาวน์โหลดแยกกัน รหัสจะแสดงจนกว่าจะออกจากเครื่องมือหรือโหลดหน้าใหม่","Tệp đã mã hóa và TXT chứa mật khẩu được tải riêng. Mật khẩu hiển thị đến khi bạn rời công cụ hoặc tải lại trang.","File terlindungi dan TXT berisi kata sandi diunduh terpisah. Kata sandi terlihat sampai Anda keluar dari alat atau memuat ulang halaman."],
  ["密码已复制到剪贴板。","Пароль скопирован в буфер обмена.","Senha copiada para a área de transferência.","คัดลอกรหัสผ่านไปยังคลิปบอร์ดแล้ว","Đã sao chép mật khẩu vào bộ nhớ tạm.","Kata sandi disalin ke papan klip."],
  ["无法访问剪贴板，请手动选中并复制密码。","Нет доступа к буферу обмена. Выделите пароль и скопируйте его вручную.","Não foi possível acessar a área de transferência. Selecione e copie a senha manualmente.","เข้าใช้คลิปบอร์ดไม่ได้ ให้เลือกรหัสผ่านแล้วคัดลอกเอง","Không truy cập được bộ nhớ tạm. Hãy chọn và sao chép mật khẩu thủ công.","Papan klip tidak dapat diakses. Pilih dan salin kata sandi secara manual."],
  ["显示","Показать","Mostrar","แสดง","Hiện","Tampilkan"],
  ["隐藏","Скрыть","Ocultar","ซ่อน","Ẩn","Sembunyikan"],
  ["JPG 输出分辨率","Разрешение JPG","Resolução do JPG","ความละเอียด JPG","Độ phân giải JPG","Resolusi JPG"],
  ["屏幕（96 DPI）","Для экрана (96 DPI)","Para tela (96 DPI)","สำหรับหน้าจอ (96 DPI)","Màn hình (96 DPI)","Layar (96 DPI)"],
  ["清晰（150 DPI）","Чёткое (150 DPI)","Boa qualidade (150 DPI)","คมชัด (150 DPI)","Rõ nét (150 DPI)","Tajam (150 DPI)"],
  ["高质量（300 DPI）","Высокое (300 DPI)","Alta qualidade (300 DPI)","คุณภาพสูง (300 DPI)","Chất lượng cao (300 DPI)","Kualitas tinggi (300 DPI)"],
  ["水印类型","Тип водяного знака","Tipo de marca-d’água","ประเภทลายน้ำ","Loại hình mờ","Jenis tanda air"],
  ["文字水印","Текстовый водяной знак","Marca-d’água de texto","ลายน้ำข้อความ","Hình mờ dạng chữ","Tanda air teks"],
  ["图片水印","Графический водяной знак","Marca-d’água de imagem","ลายน้ำรูปภาพ","Hình mờ dạng ảnh","Tanda air gambar"],
  ["水印文字","Текст водяного знака","Texto da marca-d’água","ข้อความลายน้ำ","Nội dung hình mờ","Teks tanda air"],
  ["例如：内部资料（选填）","Например: Конфиденциально (необязательно)","Ex.: Confidencial (opcional)","เช่น เอกสารลับ (ไม่บังคับ)","Ví dụ: Tài liệu mật (không bắt buộc)","Contoh: Rahasia (opsional)"],
  ["水印图片","Изображение для водяного знака","Imagem da marca-d’água","รูปภาพสำหรับทำลายน้ำ","Ảnh dùng làm hình mờ","Gambar tanda air"],
  ["选择图片","Выбрать изображение","Escolher imagem","เลือกรูปภาพ","Chọn ảnh","Pilih gambar"],
  ["从设备中选择一张 PNG、JPG 或 SVG 图片","Выберите один файл PNG, JPG или SVG на устройстве","Escolha um PNG, JPG ou SVG no seu dispositivo","เลือกภาพ PNG, JPG หรือ SVG จากอุปกรณ์","Chọn một ảnh PNG, JPG hoặc SVG trên thiết bị","Pilih satu PNG, JPG, atau SVG dari perangkat"],
  ["支持 PNG、JPG 和 SVG。推荐使用透明背景的 PNG 或 SVG，最大 20 MB。","Поддерживаются PNG, JPG и SVG до 20 МБ. Лучше выбрать PNG или SVG с прозрачным фоном.","Aceita PNG, JPG e SVG de até 20 MB. Para fundo transparente, prefira PNG ou SVG.","รองรับ PNG, JPG และ SVG ขนาดไม่เกิน 20 MB แนะนำ PNG หรือ SVG พื้นหลังโปร่งใส","Hỗ trợ PNG, JPG và SVG tối đa 20 MB. Nên dùng PNG hoặc SVG nền trong suốt.","Mendukung PNG, JPG, dan SVG hingga 20 MB. Sebaiknya gunakan PNG atau SVG berlatar transparan."],
  ["字体","Шрифт текста","Fonte do texto","แบบอักษรข้อความ","Phông chữ","Font teks"],
  ["系统无衬线字体","Системный шрифт без засечек","Fonte do sistema sem serifa","แบบอักษรระบบไม่มีเชิง","Phông hệ thống không chân","Font sistem tanpa kait"],
  ["繁体中文黑体","Традиционный китайский без засечек","Chinês tradicional sem serifa","แบบไม่มีเชิงสำหรับจีนตัวเต็ม","Chữ Hoa phồn thể không chân","Sans-serif Tionghoa Tradisional"],
  ["楷体","Китайский шрифт Кай","Kai (caligrafia chinesa)","แบบอักษรจีนไค","Chữ Khải","Kai (kaligrafi Tionghoa)"],
  ["明体","Шрифт с засечками","Com serifa","แบบมีเชิง","Phông có chân","Serif"],
  ["等宽字体","Моноширинный шрифт","Fonte monoespaçada","แบบอักษรความกว้างคงที่","Phông đơn cách","Font lebar tetap"],
  ["水印布局","Размещение водяного знака","Distribuição da marca-d’água","รูปแบบการวางลายน้ำ","Bố cục hình mờ","Tata letak tanda air"],
  ["单个水印","Один водяной знак","Marca-d’água única","ลายน้ำเดียว","Một hình mờ","Satu tanda air"],
  ["平铺整页","Повторить по всей странице","Repetir pela página","วางซ้ำทั่วหน้า","Lặp trên toàn trang","Ulangi di seluruh halaman"],
  ["字号","Размер текста","Tamanho do texto","ขนาดข้อความ","Cỡ chữ","Ukuran teks"],
  ["缩放比例","Масштаб","Escala","สัดส่วนย่อขยาย","Tỷ lệ","Skala"],
  ["不透明度","Непрозрачность","Opacidade","ความทึบ","Độ đậm","Opasitas"],
  ["位置","Положение","Posição","ตำแหน่ง","Vị trí","Posisi"],
  ["居中","По центру","Centro","กลางหน้า","Chính giữa","Tengah"],
  ["左上","Слева вверху","Superior esquerdo","บนซ้าย","Trên trái","Kiri atas"],
  ["右上","Справа вверху","Superior direito","บนขวา","Trên phải","Kanan atas"],
  ["左下","Слева внизу","Inferior esquerdo","ล่างซ้าย","Dưới trái","Kiri bawah"],
  ["右下","Справа внизу","Inferior direito","ล่างขวา","Dưới phải","Kanan bawah"],
  ["旋转角度","Угол поворота","Ângulo de rotação","มุมหมุน","Góc xoay","Sudut rotasi"],
  ["自动在页面底部添加页码","Нумеровать страницы внизу","Numerar as páginas no rodapé","ใส่เลขหน้าที่ด้านล่างโดยอัตโนมัติ","Tự động đánh số ở cuối trang","Tambahkan nomor di bagian bawah halaman secara otomatis"],
  ["页码字体","Шрифт номеров страниц","Fonte dos números de página","แบบอักษรเลขหน้า","Phông số trang","Font nomor halaman"],
  ["页码字号","Размер номеров страниц","Tamanho dos números de página","ขนาดเลขหน้า","Cỡ số trang","Ukuran nomor halaman"],
  ["效果预览","Предпросмотр","Prévia","ดูตัวอย่าง","Xem trước","Pratinjau"],
  ["尚未加载 PDF","PDF ещё не загружен","Nenhum PDF carregado","ยังไม่ได้โหลด PDF","Chưa nạp PDF","Belum ada PDF yang dimuat"],
  ["正在加载第 1 页…","Загружаем первую страницу…","Carregando a primeira página…","กำลังโหลดหน้าแรก…","Đang nạp trang đầu…","Memuat halaman pertama…"],
  ["PDF 第 1 页","Первая страница PDF","Primeira página do PDF","หน้าแรกของ PDF","Trang đầu của PDF","Halaman pertama PDF"],
  ["PDF 首页预览","Предпросмотр первой страницы PDF","Prévia da primeira página do PDF","ตัวอย่างหน้าแรกของ PDF","Xem trước trang đầu của PDF","Pratinjau halaman pertama PDF"],
  ["水印与页码预览","Предпросмотр водяного знака и номеров страниц","Prévia da marca-d’água e da numeração","ตัวอย่างลายน้ำและเลขหน้า","Xem trước hình mờ và số trang","Pratinjau tanda air dan nomor halaman"],
  ["添加 PDF 后可预览第一页。输出按原始页面尺寸生成。","После добавления PDF здесь появится первая страница. При сохранении используется исходный размер страниц.","A prévia mostra a primeira página do PDF. O arquivo final usa as dimensões originais das páginas.","เมื่อเพิ่ม PDF จะแสดงหน้าแรกให้ดู ไฟล์ผลลัพธ์จะใช้ขนาดหน้าเดิม","Bản xem trước hiển thị trang đầu. Tệp xuất giữ kích thước trang gốc.","Pratinjau menampilkan halaman pertama. Hasil memakai ukuran halaman asli."],
  ["准备就绪","Готово к работе","Tudo pronto","พร้อมใช้งาน","Sẵn sàng","Siap"],
  ["尚未添加文件","Файлы не добавлены","Nenhum arquivo adicionado","ยังไม่ได้เพิ่มไฟล์","Chưa thêm tệp","Belum ada file"],
  ["待处理文件","Файлы в очереди","Arquivos na fila","ไฟล์รอประมวลผล","Tệp chờ xử lý","File dalam antrean"],
  ["清空列表","Очистить список","Limpar lista","ล้างรายการ","Xóa danh sách","Kosongkan daftar"],
  ["处理记录","История обработки","Histórico de processamento","ประวัติการประมวลผล","Lịch sử xử lý","Riwayat pemrosesan"],
  ["展开","Развернуть","Expandir","ขยาย","Mở rộng","Perluas"],
  ["收起","Свернуть","Recolher","ย่อ","Thu gọn","Ciutkan"],
  ["清空记录","Очистить историю","Limpar histórico","ล้างประวัติ","Xóa lịch sử","Hapus riwayat"],
  ["文件和处理记录","Файлы и история обработки","Arquivos e histórico","ไฟล์และประวัติ","Tệp và lịch sử xử lý","File dan riwayat pemrosesan"],
  ["当前批次","Текущая очередь","Lote atual","ชุดปัจจุบัน","Lô hiện tại","Batch saat ini"],
  ["本次记录","История сеанса","Histórico da sessão","ประวัติรอบนี้","Lịch sử phiên này","Riwayat sesi"],
  ["页面工作区","Рабочая область страниц","Área de organização","พื้นที่จัดหน้า","Khu vực sắp xếp trang","Ruang kerja halaman"],
  ["尚未添加文件，请在左侧选择或拖入文件。","Файлы не добавлены. Выберите их или перетащите в область слева.","Nenhum arquivo adicionado. Selecione ou arraste os arquivos para o painel à esquerda.","ยังไม่มีไฟล์ ให้เลือกหรือลากไฟล์ไปยังช่องด้านซ้าย","Chưa có tệp. Chọn hoặc kéo tệp vào khung bên trái.","Belum ada file. Pilih atau seret file ke panel kiri."],
  ["处理结果会显示在这里。","Здесь появятся результаты обработки.","Os resultados aparecem aqui.","ผลลัพธ์จะแสดงที่นี่","Kết quả xử lý sẽ hiện ở đây.","Hasil pemrosesan akan muncul di sini."],
  ["等待中","В ожидании","Na fila","กำลังรอ","Đang chờ","Menunggu"],
  ["处理中","Обработка","Processando","กำลังประมวลผล","Đang xử lý","Sedang diproses"],
  ["已完成","Готово","Concluído","เสร็จแล้ว","Hoàn tất","Selesai"],
  ["失败","Ошибка","Falhou","ไม่สำเร็จ","Thất bại","Gagal"],
  ["移除","Убрать","Remover","นำออก","Bỏ khỏi danh sách","Hapus"],
  ["页面排列","Порядок страниц","Ordem das páginas","ลำดับหน้า","Thứ tự trang","Urutan halaman"],
  ["已选中 0 页","Выбрано страниц: 0","0 páginas selecionadas","เลือกแล้ว 0 หน้า","Đã chọn 0 trang","0 halaman dipilih"],
  ["页面操作","Действия со страницами","Ações nas páginas","คำสั่งจัดหน้า","Thao tác với trang","Tindakan halaman"],
  ["全选／取消全选","Выбрать всё / снять выбор","Selecionar tudo / desmarcar","เลือกทั้งหมด / ยกเลิกการเลือก","Chọn tất cả / bỏ chọn","Pilih semua / batalkan pilihan"],
  ["向左旋转","Повернуть влево","Girar à esquerda","หมุนซ้าย","Xoay trái","Putar ke kiri"],
  ["向右旋转","Повернуть вправо","Girar à direita","หมุนขวา","Xoay phải","Putar ke kanan"],
  ["删除选中页","Удалить выбранные","Excluir páginas selecionadas","ลบหน้าที่เลือก","Xóa trang đã chọn","Hapus halaman terpilih"],
  ["提取选中页","Извлечь выбранные страницы","Extrair páginas selecionadas","แยกหน้าที่เลือก","Trích xuất trang đã chọn","Ekstrak halaman terpilih"],
  ["点击页面即可选中。拖动可调整顺序，手机上可长按拖动，也可使用左右箭头。","Нажмите на страницу, чтобы выбрать её. Для сортировки перетаскивайте страницы, на телефоне сначала удерживайте карточку. Также можно использовать стрелки.","Clique na página para selecioná-la. Arraste para reordenar. No celular, toque e segure antes de arrastar. Você também pode usar as setas.","แตะเพื่อเลือกหน้า ลากเพื่อจัดลำดับ บนมือถือให้แตะค้างก่อนลาก หรือใช้ปุ่มลูกศร","Bấm vào trang để chọn. Kéo để đổi thứ tự. Trên điện thoại, nhấn giữ rồi kéo hoặc dùng nút mũi tên.","Klik halaman untuk memilih. Seret untuk mengurutkan. Di ponsel, tekan dan tahan sebelum menyeret, atau gunakan tombol panah."],
  ["处理出错","Ошибка обработки","Erro no processamento","เกิดข้อผิดพลาดในการประมวลผล","Lỗi xử lý","Kesalahan pemrosesan"],
  ["关闭错误提示","Закрыть сообщение об ошибке","Fechar aviso de erro","ปิดข้อความแจ้งข้อผิดพลาด","Đóng thông báo lỗi","Tutup pesan kesalahan"],
  ["处理失败。","Не удалось обработать файл.","Não foi possível processar.","ประมวลผลไม่สำเร็จ","Không xử lý được.","Pemrosesan gagal."],
  ["PDF 处理失败。","Не удалось обработать PDF.","Não foi possível processar o PDF.","ประมวลผล PDF ไม่สำเร็จ","Không xử lý được PDF.","PDF gagal diproses."],
  ["无法加载 PDF 首页预览。","Не удалось загрузить предпросмотр первой страницы PDF.","Não foi possível carregar a prévia da primeira página do PDF.","โหลดตัวอย่างหน้าแรกของ PDF ไม่ได้","Không tải được bản xem trước trang đầu của PDF.","Pratinjau halaman pertama PDF gagal dimuat."],
  ["无法生成图片水印预览。","Не удалось создать предпросмотр графического водяного знака.","Não foi possível gerar a prévia da marca-d’água de imagem.","สร้างตัวอย่างลายน้ำรูปภาพไม่ได้","Không tạo được bản xem trước hình mờ dạng ảnh.","Pratinjau tanda air gambar gagal dibuat."],
  ["无法使用该水印图片。","Это изображение нельзя использовать как водяной знак.","Não foi possível usar a imagem da marca-d’água.","ใช้รูปภาพนี้เป็นลายน้ำไม่ได้","Không dùng được ảnh này làm hình mờ.","Gambar ini tidak bisa digunakan sebagai tanda air."],
  ["图片不得超过 20 MB。","Размер изображения не должен превышать 20 МБ.","A imagem deve ter no máximo 20 MB.","รูปภาพต้องมีขนาดไม่เกิน 20 MB","Ảnh không được vượt quá 20 MB.","Ukuran gambar maksimal 20 MB."],
  ["仅支持 PNG、JPG 或 SVG。","Поддерживаются только PNG, JPG и SVG.","Use apenas PNG, JPG ou SVG.","รองรับเฉพาะ PNG, JPG หรือ SVG","Chỉ hỗ trợ PNG, JPG hoặc SVG.","Hanya PNG, JPG, atau SVG yang didukung."],
  ["可能原因：","Возможная причина: ","Possível causa: ","สาเหตุที่เป็นไปได้: ","Nguyên nhân có thể là: ","Kemungkinan penyebab: "],
  ["文件会逐个处理，多个结果会合并为一个 ZIP 下载。","Файлы обрабатываются по одному, несколько результатов скачиваются одним ZIP.","Os arquivos são processados um por vez. Vários resultados são baixados em um único ZIP.","ระบบประมวลผลทีละไฟล์และรวมหลายผลลัพธ์เป็น ZIP เดียว","Tệp được xử lý lần lượt. Nhiều kết quả được tải về trong một tệp ZIP.","File diproses satu per satu. Beberapa hasil diunduh sebagai satu ZIP."],
  ["请先移除加密 PDF 的密码。可拖动文件或用箭头调整合并顺序。","Сначала снимите пароль с защищённых PDF. Меняйте порядок файлов перетаскиванием или стрелками.","Remova a senha dos PDFs protegidos primeiro. Arraste os arquivos ou use as setas para mudar a ordem.","เอารหัสผ่าน PDF ออกก่อน จากนั้นลากไฟล์หรือใช้ลูกศรเพื่อจัดลำดับ","Gỡ mật khẩu PDF trước. Kéo tệp hoặc dùng nút mũi tên để đổi thứ tự gộp.","Hapus kata sandi PDF terlebih dahulu. Seret file atau gunakan panah untuk mengubah urutan."],
  ["多页结果会打包成 ZIP，以免浏览器拦截连续下载。","Несколько страниц собираются в ZIP, чтобы браузер не блокировал серию загрузок.","As páginas são reunidas em um ZIP para evitar o bloqueio de downloads sucessivos.","ระบบรวมหลายหน้าเป็น ZIP เพื่อไม่ให้เบราว์เซอร์บล็อกการดาวน์โหลดต่อเนื่อง","Nhiều trang được gom vào ZIP để trình duyệt không chặn tải xuống liên tiếp.","Beberapa halaman dikemas dalam ZIP agar browser tidak memblokir unduhan berturut-turut."],
  ["每张图片对应一页，页面尺寸与原图一致。","Каждое изображение станет отдельной страницей исходного размера.","Cada imagem vira uma página com as dimensões originais.","แต่ละภาพจะเป็นหนึ่งหน้าและใช้ขนาดตามภาพต้นฉบับ","Mỗi ảnh tạo thành một trang với kích thước gốc.","Setiap gambar menjadi satu halaman dengan ukuran asli."],
  ["高分辨率占用更多内存。大型 PDF 建议选择较低分辨率。","Высокое разрешение требует больше памяти. Для больших PDF выберите разрешение ниже.","Resoluções altas usam mais memória. Para PDFs grandes, escolha uma resolução menor.","ความละเอียดสูงใช้หน่วยความจำมากขึ้น สำหรับ PDF ขนาดใหญ่ให้เลือกความละเอียดต่ำลง","Độ phân giải cao tốn thêm bộ nhớ. Với PDF lớn, hãy chọn mức thấp hơn.","Resolusi tinggi memakai lebih banyak memori. Pilih resolusi yang lebih rendah untuk PDF besar."],
  ["缩略图和结果均在浏览器中生成，大型 PDF 可能需要更久。","Миниатюры и результаты создаются в браузере. Обработка больших PDF может занять больше времени.","O navegador gera as miniaturas e os resultados. PDFs grandes podem demorar mais.","เบราว์เซอร์สร้างภาพย่อและผลลัพธ์ในเครื่อง PDF ขนาดใหญ่อาจใช้เวลานานขึ้น","Trình duyệt tạo ảnh thu nhỏ và tệp kết quả. PDF lớn có thể mất nhiều thời gian hơn.","Thumbnail dan hasil dibuat di browser. PDF besar mungkin perlu waktu lebih lama."],
  ["文字水印使用浏览器字体绘制，整个过程无需上传文件。","Текст водяного знака использует шрифты браузера. Файлы не отправляются на сервер.","O texto da marca-d’água usa as fontes do navegador. Nenhum arquivo é enviado.","ลายน้ำข้อความใช้แบบอักษรของเบราว์เซอร์และไม่ต้องอัปโหลดไฟล์","Hình mờ dạng chữ dùng phông của trình duyệt. Không cần tải tệp lên.","Tanda air teks memakai font browser. File tidak perlu diunggah."],
  ["正在准备文件…","Подготавливаем файлы…","Preparando arquivos…","กำลังเตรียมไฟล์…","Đang chuẩn bị tệp…","Menyiapkan file…"],
  ["正在生成页面缩略图…","Создаём миниатюры страниц…","Gerando miniaturas das páginas…","กำลังสร้างภาพย่อ…","Đang tạo ảnh thu nhỏ…","Membuat thumbnail halaman…"],
  ["正在将已解锁的 PDF 打包为 ZIP…","Собираем PDF без паролей в ZIP…","Compactando PDFs desbloqueados em ZIP…","กำลังรวม PDF ที่ปลดรหัสแล้วเป็น ZIP…","Đang gom PDF đã gỡ mật khẩu vào ZIP…","Mengemas PDF yang sudah dibuka kuncinya ke dalam ZIP…"],
  ["正在将已加密的 PDF 打包为 ZIP…","Собираем защищённые PDF в ZIP…","Compactando PDFs protegidos em ZIP…","กำลังรวม PDF ที่ตั้งรหัสแล้วเป็น ZIP…","Đang gom PDF đã mã hóa vào ZIP…","Mengemas PDF terenkripsi ke dalam ZIP…"],
  ["在浏览器中使用 AES-256 加密，多个结果会打包成 ZIP。","Шифрование AES-256 в браузере. Несколько результатов будут собраны в ZIP.","Criptografia AES-256 no navegador. Vários resultados saem em um ZIP.","เข้ารหัส AES-256 ในเบราว์เซอร์ หากได้หลายไฟล์จะรวมเป็น ZIP","Mã hóa AES-256 trong trình duyệt. Nhiều kết quả được gom vào ZIP.","Enkripsi AES-256 di browser. Beberapa hasil dikemas dalam ZIP."],
  ["正在处理…","Обрабатываем…","Processando…","กำลังประมวลผล…","Đang xử lý…","Sedang memproses…"],
  ["请先添加文件。","Сначала добавьте файл.","Adicione um arquivo primeiro.","เพิ่มไฟล์ก่อน","Hãy thêm tệp trước.","Tambahkan file terlebih dahulu."],
  ["请输入 PDF 密码。","Введите пароль PDF.","Digite a senha do PDF.","กรอกรหัสผ่าน PDF","Hãy nhập mật khẩu PDF.","Masukkan kata sandi PDF."],
  ["两次输入的密码不一致。","Пароли не совпадают.","As senhas não coincidem.","รหัสผ่านไม่ตรงกัน","Hai mật khẩu không khớp.","Kedua kata sandi tidak cocok."],
  ["请确认两个输入框完全一致后重试。","Убедитесь, что оба поля заполнены одинаково, и повторите попытку.","Confira se os dois campos estão iguais e tente de novo.","ตรวจให้ทั้งสองช่องตรงกันแล้วลองใหม่","Kiểm tra hai ô nhập giống hệt nhau rồi thử lại.","Pastikan kedua kolom sama persis, lalu coba lagi."],
  ["无法为 PDF 设置密码。","Не удалось защитить PDF паролем.","Não foi possível proteger o PDF com senha.","ตั้งรหัสผ่านให้ PDF ไม่สำเร็จ","Không đặt được mật khẩu cho PDF.","PDF gagal dilindungi dengan kata sandi."],
  ["请输入水印文字或启用页码。","Введите текст водяного знака или включите нумерацию страниц.","Digite o texto da marca-d’água ou ative a numeração.","กรอกข้อความลายน้ำหรือเปิดใช้เลขหน้า","Nhập nội dung hình mờ hoặc bật số trang.","Masukkan teks tanda air atau aktifkan nomor halaman."],
  ["请选择水印图片或启用页码。","Выберите изображение водяного знака или включите нумерацию страниц.","Escolha uma imagem para a marca-d’água ou ative a numeração.","เลือกรูปภาพลายน้ำหรือเปิดใช้เลขหน้า","Chọn ảnh làm hình mờ hoặc bật số trang.","Pilih gambar tanda air atau aktifkan nomor halaman."],
  ["此工具一次只能处理一个文件。","Этот инструмент обрабатывает только один файл за раз.","Esta ferramenta processa um arquivo por vez.","เครื่องมือนี้ใช้ได้ครั้งละหนึ่งไฟล์","Công cụ này chỉ xử lý một tệp mỗi lần.","Alat ini memproses satu file per giliran."],
  ["此 PDF 受密码保护，请先移除密码。","Этот PDF защищён паролем. Сначала снимите пароль.","Este PDF está protegido. Remova a senha primeiro.","PDF นี้มีรหัสผ่าน ให้เอารหัสผ่านออกก่อน","PDF này có mật khẩu. Hãy gỡ mật khẩu trước.","PDF ini dilindungi kata sandi. Hapus kata sandinya terlebih dahulu."],
  ["此 PDF 没有可调整的页面。","В PDF нет страниц для перестановки.","Não há páginas para organizar neste PDF.","PDF นี้ไม่มีหน้าให้จัด","PDF này không có trang để sắp xếp.","Tidak ada halaman yang bisa diatur di PDF ini."],
  ["此 PDF 没有可导出的页面。","В PDF нет страниц для сохранения.","Não há páginas para exportar neste PDF.","PDF นี้ไม่มีหน้าให้ส่งออก","PDF này không có trang để xuất.","Tidak ada halaman yang bisa diekspor dari PDF ini."],
  ["正在加载缩略图，请稍候。","Дождитесь загрузки миниатюр.","Aguarde o carregamento das miniaturas.","กำลังโหลดภาพย่อ โปรดรอสักครู่","Ảnh thu nhỏ đang tải. Vui lòng đợi.","Thumbnail masih dimuat. Tunggu sebentar."],
  ["处理失败，请确认文件有效。","Не удалось обработать файл. Проверьте, что он открывается.","Não foi possível processar. Confira se o arquivo é válido.","ประมวลผลไม่สำเร็จ โปรดตรวจว่าไฟล์เปิดได้","Không xử lý được. Hãy kiểm tra tệp có mở được không.","Pemrosesan gagal. Pastikan file dapat dibuka."],
  ["文件格式无效或内容已损坏。","Неверный формат или повреждённый файл.","O formato é inválido ou o arquivo está corrompido.","รูปแบบไฟล์ไม่ถูกต้องหรือไฟล์เสียหาย","Định dạng không hợp lệ hoặc tệp bị hỏng.","Format tidak valid atau file rusak."],
  ["浏览器内存不足，请减少页数或降低 JPG 分辨率。","Браузеру не хватает памяти. Уменьшите число страниц или разрешение JPG.","O navegador está sem memória. Reduza o número de páginas ou a resolução do JPG.","หน่วยความจำไม่พอ ให้ลดจำนวนหน้าหรือความละเอียด JPG","Trình duyệt thiếu bộ nhớ. Giảm số trang hoặc độ phân giải JPG.","Memori browser tidak cukup. Kurangi jumlah halaman atau resolusi JPG."],
  ["已清空文件列表。","Список файлов очищен.","Lista de arquivos limpa.","ล้างรายการไฟล์แล้ว","Đã xóa danh sách tệp.","Daftar file sudah dikosongkan."],
  ["已清空记录并释放所有输出数据。","История и результаты удалены из памяти.","Histórico limpo e resultados removidos da memória.","ล้างประวัติและลบผลลัพธ์จากหน่วยความจำแล้ว","Đã xóa lịch sử và giải phóng toàn bộ kết quả.","Riwayat dan hasil sudah dihapus dari memori."],
  ["已更新 PDF 合并顺序。","Порядок объединения PDF изменён.","Ordem dos PDFs atualizada.","อัปเดตลำดับการรวม PDF แล้ว","Đã cập nhật thứ tự gộp PDF.","Urutan penggabungan PDF diperbarui."],
  ["清除此结果","Удалить результат из памяти","Remover este resultado","ล้างผลลัพธ์นี้","Xóa kết quả này","Hapus hasil ini"],
  ["结果已从内存清除，无法再次下载。","Результат удалён из памяти. Скачать его повторно нельзя.","Este resultado foi removido da memória e não pode ser baixado novamente.","ลบผลลัพธ์ออกจากหน่วยความจำแล้ว จึงดาวน์โหลดซ้ำไม่ได้","Kết quả đã được xóa khỏi bộ nhớ nên không thể tải lại.","Hasil sudah dihapus dari memori dan tidak bisa diunduh lagi."],
  ["此记录没有可下载的结果。","Для этой записи нет файла для скачивания.","Não há arquivo para baixar neste item.","รายการนี้ไม่มีไฟล์ให้ดาวน์โหลด","Mục này không có tệp để tải xuống.","Entri ini tidak memiliki file yang dapat diunduh."],
  ["处理完成，已下载 1 个 PDF。","Готово. Скачан один PDF.","Tudo pronto. Um PDF baixado.","เสร็จแล้ว ดาวน์โหลด PDF 1 ไฟล์","Đã xử lý xong và tải xuống 1 PDF.","Selesai. Satu PDF telah diunduh."],
  ["处理成功的文件已打包下载。","Обработанные файлы скачаны одним архивом.","Os arquivos processados com sucesso foram baixados em um ZIP.","ดาวน์โหลดไฟล์ที่ประมวลผลสำเร็จเป็น ZIP แล้ว","Các tệp xử lý thành công đã được tải về trong một ZIP.","File yang berhasil diproses telah diunduh dalam satu ZIP."],
];
rows.forEach((row, index) => row.push(...additionalRows[index]));

// Keep tool names, actions and privacy copy idiomatic in the original locales.
const localizedCopy = {
  'PDF 本機工具箱': ['PDF 本機工具箱', 'PDF Toolbox', 'PDFツールボックス', 'PDF 도구 모음', 'Herramientas PDF', 'PDF-Werkzeuge', 'Outils PDF'],
  '本機瀏覽器 PDF 工具': ['在瀏覽器處理 PDF', 'PDF tools in your browser', 'ブラウザーで使えるPDFツール', '브라우저에서 쓰는 PDF 도구', 'Edita PDF desde el navegador', 'PDFs direkt im Browser bearbeiten', 'Modifiez vos PDF dans votre navigateur'],
  '加上密碼': ['加上密碼', 'Protect with password', 'パスワードを設定', '암호 설정', 'Proteger con contraseña', 'Mit Passwort schützen', 'Protéger par mot de passe'],
  '頁面管理': ['頁面管理', 'Organize pages', 'ページを整理', '페이지 정리', 'Organizar páginas', 'Seiten organisieren', 'Organiser les pages'],
  '全部釋放': ['清除歷程', 'Clear history', '履歴を消去', '기록 지우기', 'Borrar historial', 'Verlauf löschen', 'Effacer l’historique'],
  '釋放此結果': ['清除此結果', 'Remove this result', 'この結果を削除', '이 결과 지우기', 'Eliminar este resultado', 'Dieses Ergebnis entfernen', 'Supprimer ce résultat'],
  '請僅處理您本人擁有或已取得合法授權的文件。所有檔案均在您的瀏覽器本機處理，不會主動上傳至本站伺服器。': [
    '請只處理您擁有或已獲授權的文件。檔案會在您的瀏覽器中處理，不會上傳到本站伺服器。',
    'Only process documents you own or have permission to use. Your files stay in your browser.',
    'ご自身の文書、または使用許可を得た文書のみを処理してください。ファイルの処理はブラウザー内で行われます。',
    '본인 소유이거나 사용 허가를 받은 문서만 처리하세요. 파일은 브라우저 안에서만 처리됩니다.',
    'Usa solo documentos tuyos o que tengas permiso para tratar. Los archivos se procesan en tu navegador.',
    'Verarbeiten Sie nur eigene Dokumente oder Dokumente, für die Sie eine Berechtigung haben. Die Dateien bleiben in Ihrem Browser.',
    'Traitez uniquement les documents qui vous appartiennent ou que vous êtes autorisé à utiliser. Vos fichiers restent dans votre navigateur.',
  ],
};

const localeIndex = new Map(LOCALES.map((locale, index) => [locale, index]));
const rowsByCanonical = new Map(rows.map((row) => [row[0], row]));
for (const [source, translations] of Object.entries(localizedCopy)) {
  rowsByCanonical.get(source).splice(1, translations.length - 1, ...translations.slice(1));
}
const canonicalByTranslation = new Map();
const BASE_URL = 'https://pdf.stack-base.com/';
const OPEN_GRAPH_LOCALES = {
  'zh-Hant': 'zh_TW',
  en: 'en_US',
  ja: 'ja_JP',
  ko: 'ko_KR',
  es: 'es_ES',
  de: 'de_DE',
  fr: 'fr_FR',
  'zh-Hans': 'zh_CN',
  ru: 'ru_RU',
  'pt-BR': 'pt_BR',
  th: 'th_TH',
  vi: 'vi_VN',
  id: 'id_ID',
};
for (const row of rows) {
  for (const value of row) canonicalByTranslation.set(value, row[0]);
}

function requestedLocale() {
  const requested = new URLSearchParams(location.search).get('lang');
  return LOCALES.includes(requested) ? requested : null;
}

function systemLocale() {
  for (const language of navigator.languages?.length ? navigator.languages : [navigator.language]) {
    const value = String(language || '').toLowerCase();
    if (/^zh-(hans|cn|sg|my)(-|$)/.test(value) || value === 'zh') return 'zh-Hans';
    if (value.startsWith('zh-')) return 'zh-Hant';
    if (/^pt(-|$)/.test(value)) return 'pt-BR';
    if (/^in(-|$)/.test(value)) return 'id';
    const match = LOCALES.find((locale) => locale.toLowerCase() === value || value.startsWith(`${locale.toLowerCase()}-`));
    if (match) return match;
  }
  return 'en';
}

function storedLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return LOCALES.includes(stored) ? stored : null;
  } catch {
    return null;
  }
}

let hasExplicitLocale = requestedLocale() !== null;
let currentLocale = requestedLocale() ?? storedLocale() ?? systemLocale();
const sourceByTextNode = new WeakMap();
const lastOutputByTextNode = new WeakMap();
const attributesByElement = new WeakMap();

function template(values, args) {
  const index = localeIndex.get(currentLocale) ?? 0;
  return values[index].replace(/\{(\d+)\}/g, (_, position) => args[Number(position)] ?? '');
}

function translateDynamic(text) {
  let match = text.match(/^已選取 (\d+) 頁$/);
  if (match) return template([
    '已選取 {0} 頁', '{0} pages selected', '{0} ページ選択', '{0}페이지 선택됨',
    '{0} páginas seleccionadas', '{0} Seiten ausgewählt', '{0} pages sélectionnées',
    '已选中 {0} 页', 'Выбрано страниц: {0}', 'Páginas selecionadas: {0}', 'เลือกแล้ว {0} หน้า', 'Đã chọn {0} trang', '{0} halaman dipilih',
  ], [match[1]]);
  match = text.match(/^第 (\d+) 頁$/);
  if (match) return template(['第 {0} 頁', 'Page {0}', '{0} ページ', '{0}페이지', 'Página {0}', 'Seite {0}', 'Page {0}', '第 {0} 页', 'Страница {0}', 'Página {0}', 'หน้า {0}', 'Trang {0}', 'Halaman {0}'], [match[1]]);
  match = text.match(/^已加入 (\d+) 個檔案，總大小 (.+)$/);
  if (match) return template([
    '已加入 {0} 個檔案，總大小 {1}', '{0} files added · {1}', '{0} 件追加 · {1}', '{0}개 추가 · {1}',
    '{0} archivos añadidos · {1}', '{0} Dateien hinzugefügt · {1}', '{0} fichiers ajoutés · {1}',
    '已添加 {0} 个文件，共 {1}', 'Добавлено файлов: {0} · {1}', 'Arquivos adicionados: {0} · {1}', 'เพิ่มแล้ว {0} ไฟล์ · {1}', 'Đã thêm {0} tệp · {1}', '{0} file ditambahkan · {1}',
  ], [match[1], match[2]]);
  match = text.match(/^已選擇：(.+)（(.+)）$/);
  if (match) return template([
    '已選擇：{0}（{1}）', 'Selected: {0} ({1})', '選択済み：{0}（{1}）', '선택됨: {0} ({1})',
    'Seleccionado: {0} ({1})', 'Ausgewählt: {0} ({1})', 'Sélectionné : {0} ({1})',
    '已选择：{0}（{1}）', 'Выбрано: {0} ({1})', 'Selecionado: {0} ({1})', 'เลือกแล้ว: {0} ({1})', 'Đã chọn: {0} ({1})', 'Dipilih: {0} ({1})',
  ], [match[1], match[2]]);
  match = text.match(/^完成，已下載 (.+)。$/);
  if (match) return template([
    '完成，已下載 {0}。', 'Complete. Downloaded {0}.', '完了。{0} をダウンロードしました。', '{0} 다운로드 완료.',
    'Completado. Se descargó {0}.', 'Abgeschlossen. {0} wurde heruntergeladen.', 'Terminé. {0} a été téléchargé.',
    '处理完成，已下载 {0}。', 'Готово. Файл {0} скачан.', 'Tudo pronto. {0} foi baixado.', 'เสร็จแล้ว ดาวน์โหลด {0} แล้ว', 'Đã tải xuống {0}.', 'Selesai. {0} telah diunduh.',
  ], [match[1]]);
  if (text.startsWith('可能原因：')) {
    return `${rowsByCanonical.get('可能原因：')[localeIndex.get(currentLocale)]}${translateText(text.slice(5))}`;
  }
  return null;
}

function translateText(text) {
  const trimmed = text.trim();
  if (!trimmed) return text;
  const canonical = rowsByCanonical.has(trimmed) ? trimmed : canonicalByTranslation.get(trimmed) ?? trimmed;
  const row = rowsByCanonical.get(canonical);
  const index = localeIndex.get(currentLocale);
  const translated = localizedCopy[canonical]?.[index] ?? row?.[index] ?? translateDynamic(trimmed) ?? trimmed;
  const leading = text.match(/^\s*/)?.[0] ?? '';
  const trailing = text.match(/\s*$/)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

function shouldSkip(node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return !element || element.closest('[data-i18n-skip], script, style');
}

function translateTree(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  for (const node of textNodes) {
    if (shouldSkip(node)) continue;
    const current = node.nodeValue;
    if (lastOutputByTextNode.get(node) !== current) sourceByTextNode.set(node, current);
    const translated = translateText(sourceByTextNode.get(node) ?? current);
    if (translated !== node.nodeValue) node.nodeValue = translated;
    lastOutputByTextNode.set(node, translated);
  }

  const elements = root.querySelectorAll?.('[placeholder], [title], [aria-label], [alt]') ?? [];
  for (const element of elements) {
    if (shouldSkip(element)) continue;
    const entries = attributesByElement.get(element) ?? new Map();
    attributesByElement.set(element, entries);
    for (const attribute of ['placeholder', 'title', 'aria-label', 'alt']) {
      if (!element.hasAttribute(attribute)) {
        entries.delete(attribute);
        continue;
      }
      const current = element.getAttribute(attribute);
      const previous = entries.get(attribute);
      const source = previous?.translated === current ? previous.source : current;
      const translated = translateText(source);
      entries.set(attribute, { source, translated });
      if (translated !== current) element.setAttribute(attribute, translated);
    }
  }
}

function persistLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // The language still applies for this page when storage is unavailable.
  }
}

function setMetaContent(selector, content) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute('content', content);
}

function updateSeoMetadata() {
  const title = translateText('PDF 本機工具箱｜免上傳伺服器的免費 PDF 工具');
  const description = translateText('免費 PDF 本機工具箱：移除密碼、合併、拆分、轉檔、頁面管理、浮水印與頁碼。所有檔案只在瀏覽器處理，不需上傳伺服器。');
  const shortDescription = translateText('免費 PDF 本機工具箱：所有檔案只在瀏覽器處理，不需上傳伺服器。');
  const keywords = translateText('PDF 工具, PDF 本機處理, PDF 免上傳, PDF 合併, PDF 拆分, PDF 移除密碼, PDF 浮水印, PDF 轉 JPG');
  const canonicalUrl = hasExplicitLocale ? `${BASE_URL}?lang=${encodeURIComponent(currentLocale)}` : BASE_URL;

  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[name="keywords"]', keywords);
  setMetaContent('meta[name="application-name"]', translateText('PDF 本機工具箱'));
  setMetaContent('meta[property="og:site_name"]', translateText('PDF 本機工具箱'));
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[property="og:locale"]', OPEN_GRAPH_LOCALES[currentLocale]);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', shortDescription);

  for (const element of document.querySelectorAll('meta[property="og:locale:alternate"]')) element.remove();
  for (const locale of LOCALES) {
    if (locale === currentLocale) continue;
    const alternate = document.createElement('meta');
    alternate.setAttribute('property', 'og:locale:alternate');
    alternate.setAttribute('content', OPEN_GRAPH_LOCALES[locale]);
    document.head.append(alternate);
  }

  const canonical = document.querySelector('#canonical-link');
  if (canonical) canonical.href = canonicalUrl;

  const structuredData = document.querySelector('#structured-data');
  if (structuredData) {
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: translateText('PDF 本機工具箱'),
      url: canonicalUrl,
      description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: translateText('需要支援 JavaScript 與 WebAssembly 的現代瀏覽器'),
      isAccessibleForFree: true,
      inLanguage: LOCALES,
      featureList: [
        translateText('移除密碼'),
        translateText('加上密碼'),
        translateText('合併 PDF'),
        translateText('拆分 PDF'),
        translateText('頁面管理'),
        translateText('浮水印／頁碼'),
        translateText('PDF 轉 JPG'),
        translateText('JPG 轉 PDF'),
      ],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });
  }
}

function applyLanguage(locale, { persist = false } = {}) {
  currentLocale = LOCALES.includes(locale) ? locale : 'en';
  if (persist) {
    const url = new URL(location.href);
    url.searchParams.set('lang', currentLocale);
    history.replaceState(null, '', url);
    hasExplicitLocale = true;
  }
  document.documentElement.lang = currentLocale;
  for (const link of document.querySelectorAll('[data-legal-page]')) {
    const locale = link.dataset.legalPage === 'licenses' && !['zh-Hant', 'en', 'ja'].includes(currentLocale)
      ? (currentLocale === 'zh-Hans' ? 'zh-Hant' : 'en')
      : currentLocale;
    link.href = './' + link.dataset.legalPage + '/?lang=' + encodeURIComponent(locale);
  }
  const languageSelect = document.querySelector('#language-select');
  languageSelect.value = currentLocale;
  languageSelect.setAttribute('aria-label', translateText('選擇介面語言'));
  updateSeoMetadata();
  translateTree(document.body);
  if (persist) persistLocale(currentLocale);
  globalThis.dispatchEvent(new CustomEvent('pdf-tool-language-change', { detail: { locale: currentLocale } }));
}

globalThis.pdfToolI18n = {
  get locale() { return currentLocale; },
  translate: translateText,
  setLanguage: (locale) => applyLanguage(locale, { persist: true }),
};

document.querySelector('#language-select').addEventListener('change', (event) => {
  applyLanguage(event.target.value, { persist: true });
});

let translationFrame = null;
const observer = new MutationObserver(() => {
  if (translationFrame !== null) return;
  translationFrame = requestAnimationFrame(() => {
    translationFrame = null;
    translateTree(document.body);
  });
});
observer.observe(document.body, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['placeholder', 'title', 'aria-label', 'alt'],
});

applyLanguage(currentLocale);
