# Сборка Kurut Desktop (Windows x64)

## Требования

- **Windows 10/11**, **64-bit**
- **Node.js** 18+ (LTS рекомендуется)
- Интернет (первый раз скачается Electron)

## Команды

Откройте терминал в папке `desktop-app`:

```bash
npm install
```

### Установщик NSIS (рекомендуется)

Создаёт файл вида `dist/Kurut Desktop-1.0.0-win-x64-setup.exe`:

```bash
npm run dist
```

### Портативная версия (без установки)

```bash
npm run dist:portable
```

### Только распакованная папка (для отладки)

```bash
npm run dist:dir
```

или

```bash
npm run pack
```

Готовое приложение будет в `dist/win-unpacked/Kurut Desktop.exe`.

## Запуск без сборки

```bash
npm start
```

## Примечания

- Сборка **только x64** (настройка в `package.json` → `build.win.target`).
- **Подпись кода отключена** (`signAndEditExecutable: false` + `CSC_IDENTITY_AUTO_DISCOVERY=false`), чтобы на обычном Windows не падала распаковка `winCodeSign` (симлинки без режима разработчика). Для продакшена с подписью нужен сертификат и настройка `win.certificateFile` / переменных `CSC_*`.
- После ошибки с кэшем можно очистить папку: `%LOCALAPPDATA%\electron-builder\Cache\winCodeSign` и снова запустить `npm run dist`.
- Иконку установщика: положите `build/icon.ico` и в `package.json` в `build.win` добавьте `"icon": "build/icon.ico"`.

## Ошибка «Cannot create symbolic link» при сборке

Если всё же появляется — выполните `npm install` (нужен пакет `cross-env`) и снова `npm run dist`. Либо вручную:

```bash
set CSC_IDENTITY_AUTO_DISCOVERY=false
npm run dist
```

В PowerShell: `$env:CSC_IDENTITY_AUTO_DISCOVERY="false"; npm run dist`

Либо включите в Windows **Параметры → Для разработчиков → Режим разработчика** (разрешает симлинки без админа).

## Обновления клиента (настройки → «Обновления»)

Приложение запрашивает у бэкенда публичный эндпоинт **`GET /public/desktop/update`** (без токена), используя текущий **Base URL**.

На сервере (`kurut01/index.js`) ответ формируется из переменных окружения:

| Переменная | Назначение |
|------------|------------|
| `DESKTOP_LATEST_VERSION` | Актуальная версия (например `1.1.0`), сравнивается с версией из `package.json` / сборки Electron |
| `DESKTOP_DOWNLOAD_URL` | Ссылка на установщик или страницу загрузки (откроется в браузере) |
| `DESKTOP_RELEASE_NOTES` | Пункты списка изменений, разделитель — символ **`|`** |
| `DESKTOP_UPDATE_MESSAGE` | Короткий текст-подсказка в карточке (необязательно) |

После установки нового `.exe` пользователь может нажать **«Перезапустить приложение»** в настройках или закрыть Kurut Desktop и открыть снова.
