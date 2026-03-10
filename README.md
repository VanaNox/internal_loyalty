# GemPulse (Internal Loyalty Platform Prototype)

Статичний веб-прототип платформи внутрішньої лояльності:
- логін;
- профіль з накопиченими гемами та історією;
- передача гемів;
- внутрішній магазин.

## Швидкий локальний запуск

З кореня проєкту:

```bash
python3 -m http.server 4173
```

Відкрити в браузері:
- `http://localhost:4173/index.html`

## Деплой на GitHub Pages (автоматично)

У репозиторій додано workflow `.github/workflows/deploy-gh-pages.yml`.
Після пушу в гілку `main` GitHub автоматично задеплоїть сайт на GitHub Pages.

### Що потрібно увімкнути один раз у GitHub
1. Відкрити **Settings → Pages**.
2. У полі **Source** обрати **GitHub Actions**.
3. Переконатися, що дефолтна гілка для релізу — `main`.

Після цього при кожному пуші в `main` буде новий деплой.

## Структура
- `index.html` — логін
- `profile.html` — профіль
- `transfer.html` — передача гемів
- `shop.html` — магазин
- `styles.css` — стилі
- `app.js` — клієнтська логіка (localStorage)
