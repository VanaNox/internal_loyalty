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

> Для static-режиму без запущеного backend логін у `index.html` зараз працює з будь-якими введеними значеннями (спрощений demo flow).

## Деплой на GitHub Pages (автоматично)

Workflow `.github/workflows/deploy-gh-pages.yml` деплоїть тільки статичну частину на push у `main`.


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
