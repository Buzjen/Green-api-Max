# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Веб-клиент MAX на GREEN-API (v3): только текстовые сообщения, без бэкенда, запросы идут прямо из браузера. Подробности про настройку инстанса, методы API и ограничения есть в `README.md`, ниже только то, что нужно для работы с кодом.

## Команды

```bash
npm run dev                  # http://localhost:5173
npm test                     # vitest run, все тесты
npx vitest run src/features/message/send   # тесты одного слайса или файла
npx vitest run -t 'повтор'   # тесты по имени
npm run lint                 # ESLint + steiger (границы FSD)
npm run format               # prettier (singleQuote, printWidth 80)
npm run build                # tsc -b && vite build → dist/
```

Перед коммитом прогоняйте `npx tsc -b`, `npm test` и `npm run lint`. Если меняете зависимости, обновляйте `package-lock.json`: CI использует `npm ci`, и при рассинхроне lock-файла падает. Lock-файл пишется npm 11.5+, и CI перед `npm ci` обновляет npm до этой версии: более старый npm требует в lock-файле optional peer-зависимости `@emnapi/*`, которые npm 11.5+ туда не пишет.

## Деплой

`.github/workflows/deploy.yml` на каждый пуш в `main` прогоняет тесты, собирает проект с `--base=/<имя репозитория>/` и публикует его в GitHub Pages (https://buzjen.github.io/Green-api-Max/). В `vite.config.ts` `base` не задан намеренно: тогда локальный dev работает из корня.

## Архитектура

Feature-Sliced Design (`app → pages → widgets → features → entities → shared`), алиас `@/` → `src/`. `steiger` проверяет границы слоёв и импорт только через публичный `index.ts` слайса. Правило `fsd/insignificant-slice` выключено: слайсы с одним потребителем оставлены намеренно.

- **Логика в effector-моделях** (`model/`), компоненты только читают сторы через `useUnit` и вызывают события. Модель экспортируется из слайса как namespace: `import * as chatModel from './model/chat'; export { chatModel }` → `chatModel.$activeChatId`.
- **Сущности (`session`, `chat`, `message`) не импортируют друг друга.** Связи между ними строятся в фичах через `sample`. У каждой сущности есть `reset` (его вызывает logout) и `restoreRequested`.
- **`shared/api/green-api` ничего не знает про effector** и принимает креды аргументом. В эффекты их подставляет `sessionModel.withCredentials(fx)`: он возвращает событие, которое вызывает эффект с текущими кредами, а без сессии ничего не делает.
- **Хранение:** `persist()` из `shared/lib/storage` пишет каждое обновление стора в `localStorage`. По `pickup` он отдаёт сохранённое значение событием, а сливает его с текущим состоянием вызывающий код. В `app/model/init.ts` `appStarted` восстанавливает чаты и сообщения до сессии: восстановленная сессия сразу запускает поллинг.
- **Цикл получения** (`features/notifications/receive`): старт по `sessionModel.sessionStarted`, а не из React-эффекта, иначе StrictMode запустит второй цикл. Шаги `ReceiveNotification → DeleteNotification` связаны цепочкой `sample`, поэтому в полёте всегда не больше одного запроса. Номер поколения (`$generation`) отсекает ответы и таймеры после выхода или перезахода. Уведомление удаляется из очереди всегда, даже нераспознанное. Отдельной проверки кредов при входе нет: её роль играет первый `ReceiveNotification`, а 400/401/403 вызывают `sessionFailed`.
- **`chatId` в MAX — внутренний числовой ID**, а не `7999…@c.us`. Чат создаётся по номеру через `CheckAccount`, а входящее сообщение от неизвестного собеседника создаёт чат само (`resolve-chat`: сначала поиск по `chatId`, потом по телефону).

## Тесты

Тесты моделей используют `fork` + `allSettled`, эффекты подменяются через `handlers`, а начальные значения сторов задаются через `values`. В тестах не должно быть настоящей сети. Креды-заглушка лежит в `testCredentials` из `@/shared/lib/testing`. Vitest запускается в окружении `node` без рендера компонентов, плагин Linaria при `VITEST` отключён.

## Код-стайл

- **Стили:** Linaria (`styled` из `@linaria/react`) в `*.styles.ts` рядом с компонентом. CSS Modules и обычный CSS не используются. Цвета и тени берутся из токенов `theme` (CSS-переменные), а не хардкодом. Варианты и состояния задаются data-атрибутами (`data-variant`, `data-active`).
- **Импорт темы:** `*.styles.ts` импортируют тему из `@/shared/ui/theme`, а не из barrel `@/shared/ui`. Иначе Linaria при сборке вычисляет React-компоненты, и сборка падает.
- **Разметка:** `div`/`span` плюс элементы с поведением (`button`, `form`, `input`, `textarea`, `label`, `a`, `details`). Структурных семантических тегов (`header`, `main`, `section`, `h1`, `p`…) и ARIA-атрибутов нет. У кнопок-иконок подсказка задаётся через `title`.
- **Константы:** регулярки и магические числа выносятся в константы `UPPER_CASE` в начале модуля, с JSDoc, если назначение неочевидно. Значения CSS внутри стилей константами не считаются.
- **Язык:** комментарии, тексты UI, названия тестов и сообщения коммитов пишутся на русском.
