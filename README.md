# GemPulse (Internal Loyalty Platform Prototype)

Статичний веб-прототип платформи внутрішньої лояльності + мінімальний Python backend з SQLite.

## Швидкий запуск (frontend + API + DB)

З кореня проєкту:

```bash
python3 server.py
```

Відкрити в браузері:
- `http://localhost:4173/index.html`

## Що робить backend

- створює `data.sqlite3` (якщо нема);
- створює таблиці:
  - `users` (name, email, password)
  - `products` (name, description, total_cost, image_url)
- сідає seed-дані користувачів та товарів;
- надає API:
  - `POST /api/login` — валідація логіну/паролю по БД
  - `GET /api/products` — товари магазину з БД

## Демо креди

- `kateryna.d@company.com` / `demo123`
- `olia.k@company.com` / `demo123`
- `maksym.p@company.com` / `demo123`

> Для static-режиму логін у `index.html` працює через OTP API (`otp_send`), після чого користувач вводить OTP код і проходить валідацію на клієнті.

## Деплой на GitHub Pages (автоматично)

Workflow `.github/workflows/deploy-gh-pages.yml` тепер збирає React/Next.js (`next build` з `output: export`) і деплоїть папку `out` у GitHub Pages на push у `main`.


## Оновлення UI

- Оновлений premium-дизайн сторінки профілю з glass-стилем і покращеною ієрархією.

## Modern stack (React + Next.js + TypeScript)

Додав базовий migration scaffold на сучасний стек:
- Профіль уже перенесено на Next.js (App Router) у `app/profile/page.tsx` як перший крок міграції.
- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide icons

### Запуск нового frontend

```bash
npm install
npm run dev
```

Відкрити:
- `http://localhost:3000`

> Поточна версія на static HTML + `server.py` залишається в репозиторії для backward compatibility.


## GitHub Pages = React (Next static export)

- GitHub Pages публікує саме React/Next-версію (зі static export), а не legacy `index.html`.
- Для коректних шляхів на Pages у `next.config.mjs` увімкнено автоматичні `basePath/assetPrefix` у CI.
- Legacy static + `server.py` залишено для локального demo/backward compatibility.
