const GEM_TYPES = [
  { id: "impact", name: "Impact", color: "#4f46e5" },
  { id: "teamwork", name: "Teamwork", color: "#0d9488" },
  { id: "innovation", name: "Innovation", color: "#f97316" },
  { id: "ownership", name: "Ownership", color: "#db2777" },
];

const TEAM = [
  "Оля К.",
  "Максим П.",
  "Ірина С.",
  "Андрій Т.",
  "Світлана Р.",
  "Дмитро Л.",
  "Наталя В.",
  "Євген М.",
  "Тарас Я.",
];

const DEFAULT_STATE = {
  user: {
    name: "Катерина Д.",
    email: "kateryna.d@company.com",
  },
  balance: {
    impact: 4,
    teamwork: 6,
    innovation: 3,
    ownership: 2,
  },
  sent: [
    { to: "Оля К.", type: "teamwork", comment: "Підхопила стендап", date: "2026-03-01" },
    { to: "Світлана Р.", type: "impact", comment: "Швидко закрила критичний баг", date: "2026-03-04" },
    { to: "Дмитро Л.", type: "innovation", comment: "Крута ідея для автоматизації тестів", date: "2026-03-05" },
    { to: "Тарас Я.", type: "ownership", comment: "Взяв на себе складний реліз", date: "2026-03-07" },
  ],
  received: [
    { from: "Максим П.", type: "impact", comment: "Крутий делівері фічі", date: "2026-03-02" },
    { from: "Ірина С.", type: "innovation", comment: "Супер ідея для UX", date: "2026-03-03" },
    { from: "Наталя В.", type: "teamwork", comment: "Дякую за допомогу з онбордингом", date: "2026-03-06" },
    { from: "Євген М.", type: "ownership", comment: "Виручила з інцидентом у проді", date: "2026-03-08" },
    { from: "Оля К.", type: "impact", comment: "Підтримала з важким демо", date: "2026-03-09" },
  ],
};

const PRODUCTS = [
  {
    name: "Футболка GemPulse",
    description: "Базова футболка з брендованим принтом",
    totalCost: 8,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Худі Team Hero",
    description: "Тепле худі для офісу та дому",
    totalCost: 12,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Сертифікат Rozetka",
    description: "Електронний сертифікат номіналом 1000 грн",
    totalCost: 10,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Квиток на конференцію",
    description: "Покриття квитка на профільний івент",
    totalCost: 14,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
  },
];

const API_BASE = "";

const SHOP_META = {
  "Футболка GemPulse": { category: "Swag", icon: "👕", tint: "swag", left: 15, title: "Company Swag Bundle" },
  "Худі Team Hero": { category: "Swag", icon: "🎁", tint: "shopping", left: 20, title: "Gift Card €25" },
  "Сертифікат Rozetka": { category: "Shopping", icon: "🛍️", tint: "shopping", left: 12, title: "Gift Card €25" },
  "Квиток на конференцію": { category: "Experience", icon: "🍽️", tint: "experience", left: 2, title: "Lunch with the CEO" },
};

const SHOP_CATEGORIES = ["All", "Shopping", "Time Off", "Swag", "Experience", "Learning", "Impact", "Wellness", "Productivity"];


function getState() {
  const raw = localStorage.getItem("gempulse_state");
  if (!raw) {
    localStorage.setItem("gempulse_state", JSON.stringify(DEFAULT_STATE));
    return structuredClone(DEFAULT_STATE);
  }
  return JSON.parse(raw);
}

function saveState(state) {
  localStorage.setItem("gempulse_state", JSON.stringify(state));
}

function guardAuth() {
  const loggedIn = localStorage.getItem("gempulse_auth") === "true";
  const isLoginPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

  if (!loggedIn && !isLoginPage) {
    window.location.href = "index.html";
  }

  if (loggedIn && isLoginPage) {
    window.location.href = "profile.html";
  }
}

function handleLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  let message = document.getElementById("login-message");
  if (!message) {
    message = document.createElement("p");
    message.id = "login-message";
    message.className = "message";
    form.appendChild(message);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        message.textContent = "Невірний email або пароль.";
        message.className = "message error";
        return;
      }

      const data = await response.json();
      const state = getState();
      state.user = data.user;
      saveState(state);

      localStorage.setItem("gempulse_auth", "true");
      window.location.href = "profile.html";
    } catch (_error) {
      message.textContent = "Не вдалося підключитися до API. Запусти server.py.";
      message.className = "message error";
    }
  });
}

function handleLogout() {
  const button = document.getElementById("logout");
  if (!button) return;

  button.addEventListener("click", () => {
    localStorage.removeItem("gempulse_auth");
    window.location.href = "index.html";
  });
}

function renderProfile() {
  const profileName = document.getElementById("profile-name");
  const profileEmail = document.getElementById("profile-email");
  const profileInitials = document.getElementById("profile-initials");
  const gemsSection = document.getElementById("gems-section");
  const historyBody = document.getElementById("history-table-body");
  const receivedButton = document.getElementById("history-filter-received");
  const sentButton = document.getElementById("history-filter-sent");

  if (!profileName || !gemsSection || !historyBody || !receivedButton || !sentButton) return;

  const state = getState();
  const initials = state.user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  profileName.textContent = state.user.name;
  if (profileEmail) profileEmail.textContent = state.user.email;
  if (profileInitials) profileInitials.textContent = initials;

  const receivedGemItems = [
    { id: "impact", name: "Yellow", colorClass: "yellow", count: state.balance.impact },
    { id: "teamwork", name: "We Care", colorClass: "wecare", count: state.balance.teamwork },
    { id: "innovation", name: "Better Together", colorClass: "better", count: state.balance.innovation },
    { id: "ownership", name: "Gamechanger", colorClass: "gamechanger", count: state.balance.ownership },
  ];

  const transferGemItems = [
    { id: "managerial", name: "Managerial", colorClass: "managerial", count: null },
    { id: "transparent", name: "Transparent", colorClass: "transparent", count: null },
  ];

  function createGemIcon(colorClass) {
    return `
      <span class="gem-mini-icon gem-${colorClass}" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 3h10l4 5-9 13L3 8l4-5Z" fill="currentColor" fill-opacity="0.20" stroke="currentColor" stroke-width="1.4"/>
          <path d="M3 8h18M12 3v18M7 3l5 5 5-5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    `;
  }

  function createGemCard(item) {
    const count = item.count == null ? "—" : item.count;
    return `
      <article class="gem-mini-card" tabindex="0">
        <div class="gem-mini-content">
          <p class="gem-mini-name">${item.name}</p>
          <p class="gem-mini-count">${count}</p>
        </div>
        ${createGemIcon(item.colorClass)}
      </article>
    `;
  }

  function createGemsBlock(title, items, kind) {
    return `
      <section class="gems-block gems-block--${kind} card">
        <h3 class="gems-block-title">${title}</h3>
        <div class="gems-mini-grid">
          ${items.map((item) => createGemCard(item)).join("")}
        </div>
      </section>
    `;
  }

  gemsSection.innerHTML = `
    ${createGemsBlock("Мої геми", receivedGemItems, "received")}
    ${createGemsBlock("Доступні для Передачі", transferGemItems, "transfer")}
  `;

  const receivedHistory = state.received.map((entry) => ({
    date: entry.date,
    from: entry.from,
    to: state.user.name,
    typeId: entry.type,
    type: humanizeGem(entry.type),
    amount: 1,
    comment: entry.comment,
  }));

  const sentHistory = state.sent.map((entry) => ({
    date: entry.date,
    from: state.user.name,
    to: entry.to,
    typeId: entry.type,
    type: humanizeGem(entry.type),
    amount: 1,
    comment: entry.comment,
  }));

  function renderHistoryRows(rows) {
    historyBody.innerHTML = "";
    if (!rows.length) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = '<td colspan="6">Немає транзакцій для цього фільтра.</td>';
      historyBody.appendChild(emptyRow);
      return;
    }

    rows.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.date}</td>
        <td>${row.from}</td>
        <td>${row.to}</td>
        <td><span class="gem-pill ${row.typeId}">${row.type}</span></td>
        <td>${row.amount}</td>
        <td>${row.comment}</td>
      `;
      historyBody.appendChild(tr);
    });
  }

  function setActiveFilter(mode) {
    const isReceived = mode === "received";
    receivedButton.classList.toggle("active", isReceived);
    sentButton.classList.toggle("active", !isReceived);
    receivedButton.setAttribute("aria-selected", String(isReceived));
    sentButton.setAttribute("aria-selected", String(!isReceived));
    renderHistoryRows(isReceived ? receivedHistory : sentHistory);
  }

  receivedButton.addEventListener("click", () => setActiveFilter("received"));
  sentButton.addEventListener("click", () => setActiveFilter("sent"));

  setActiveFilter("received");
}


function humanizeGem(typeId) {
  return GEM_TYPES.find((g) => g.id === typeId)?.name || typeId;
}

function renderTransfer() {
  const form = document.getElementById("transfer-form");
  if (!form) return;

  const colleagueInput = document.getElementById("colleague-search");
  const colleagueHidden = document.getElementById("colleague");
  const colleagueList = document.getElementById("colleague-listbox");
  const gemTrigger = document.getElementById("gem-type-trigger");
  const gemHidden = document.getElementById("gem-type");
  const gemList = document.getElementById("gem-type-listbox");
  const message = document.getElementById("transfer-message");

  if (!colleagueInput || !colleagueHidden || !colleagueList || !gemTrigger || !gemHidden || !gemList || !message) return;

  const sortedTeam = [...TEAM].sort((a, b) => a.localeCompare(b, "uk"));
  const transferGemTypes = [
    { id: "impact", name: "Yellow", colorClass: "yellow" },
    { id: "teamwork", name: "We Care", colorClass: "wecare" },
    { id: "innovation", name: "Better Together", colorClass: "better" },
    { id: "ownership", name: "Gamechanger", colorClass: "gamechanger" },
  ];

  let colleagueOpen = false;
  let colleagueFiltered = sortedTeam;
  let colleagueIndex = -1;

  let gemOpen = false;
  let gemIndex = -1;

  function diamondIcon(colorClass) {
    return `
      <span class="gem-mini-icon gem-${colorClass}" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 3h10l4 5-9 13L3 8l4-5Z" fill="currentColor" fill-opacity="0.20" stroke="currentColor" stroke-width="1.4"/>
          <path d="M3 8h18M12 3v18M7 3l5 5 5-5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    `;
  }

  function openColleague() {
    colleagueOpen = true;
    colleagueInput.setAttribute("aria-expanded", "true");
    colleagueList.classList.add("open");
  }

  function closeColleague() {
    colleagueOpen = false;
    colleagueInput.setAttribute("aria-expanded", "false");
    colleagueList.classList.remove("open");
    colleagueInput.setAttribute("aria-activedescendant", "");
    colleagueIndex = -1;
  }

  function renderColleagues() {
    colleagueList.innerHTML = "";

    if (!colleagueFiltered.length) {
      const empty = document.createElement("li");
      empty.className = "combo-empty";
      empty.textContent = "Нічого не знайдено";
      colleagueList.appendChild(empty);
      return;
    }

    colleagueFiltered.forEach((name, index) => {
      const option = document.createElement("li");
      option.id = `colleague-option-${index}`;
      option.setAttribute("role", "option");
      option.className = "combo-option";
      option.setAttribute("aria-selected", String(name === colleagueHidden.value));
      option.textContent = name;

      option.addEventListener("mousedown", (event) => {
        event.preventDefault();
        colleagueHidden.value = name;
        colleagueInput.value = name;
        closeColleague();
      });

      colleagueList.appendChild(option);
    });
  }

  function filterColleagues(query) {
    const normalized = query.trim().toLowerCase();
    colleagueFiltered = sortedTeam.filter((name) => name.toLowerCase().includes(normalized));
    colleagueIndex = -1;
    renderColleagues();
  }

  function highlightColleague(index) {
    const options = [...colleagueList.querySelectorAll('.combo-option')];
    options.forEach((opt, i) => {
      opt.classList.toggle('highlighted', i === index);
      if (i === index) {
        colleagueInput.setAttribute("aria-activedescendant", opt.id);
      }
    });
  }

  colleagueInput.addEventListener("focus", () => {
    filterColleagues(colleagueInput.value);
    openColleague();
  });

  colleagueInput.addEventListener("input", () => {
    filterColleagues(colleagueInput.value);
    openColleague();
  });

  colleagueInput.addEventListener("keydown", (event) => {
    if (!colleagueOpen && ["ArrowDown", "ArrowUp"].includes(event.key)) {
      openColleague();
    }

    const max = colleagueFiltered.length - 1;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      colleagueIndex = Math.min(max, colleagueIndex + 1);
      highlightColleague(colleagueIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      colleagueIndex = Math.max(0, colleagueIndex - 1);
      highlightColleague(colleagueIndex);
    } else if (event.key === "Enter") {
      if (colleagueOpen && colleagueIndex >= 0 && colleagueFiltered[colleagueIndex]) {
        event.preventDefault();
        const selected = colleagueFiltered[colleagueIndex];
        colleagueHidden.value = selected;
        colleagueInput.value = selected;
        closeColleague();
      }
    } else if (event.key === "Escape") {
      closeColleague();
    }
  });

  function openGem() {
    gemOpen = true;
    gemTrigger.setAttribute("aria-expanded", "true");
    gemList.classList.add("open");
  }

  function closeGem() {
    gemOpen = false;
    gemTrigger.setAttribute("aria-expanded", "false");
    gemList.classList.remove("open");
    gemTrigger.setAttribute("aria-activedescendant", "");
    gemIndex = -1;
  }

  function renderGemList() {
    gemList.innerHTML = "";
    transferGemTypes.forEach((gem, index) => {
      const option = document.createElement("li");
      option.id = `gem-option-${index}`;
      option.setAttribute("role", "option");
      option.className = "combo-option gem-option";
      option.setAttribute("aria-selected", String(gem.id === gemHidden.value));
      option.innerHTML = `${diamondIcon(gem.colorClass)}<span>${gem.name}</span>`;

      option.addEventListener("mousedown", (event) => {
        event.preventDefault();
        gemHidden.value = gem.id;
        gemTrigger.innerHTML = `<span class="gem-option-selected">${diamondIcon(gem.colorClass)}<span>${gem.name}</span></span>`;
        closeGem();
      });

      gemList.appendChild(option);
    });
  }

  gemTrigger.addEventListener("click", () => {
    if (gemOpen) closeGem();
    else openGem();
  });

  gemTrigger.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (!gemOpen) {
        openGem();
        gemIndex = 0;
      } else if (event.key === "ArrowDown") {
        gemIndex = Math.min(transferGemTypes.length - 1, gemIndex + 1);
      } else if (event.key === "ArrowUp") {
        gemIndex = Math.max(0, gemIndex - 1);
      } else if ((event.key === "Enter" || event.key === " ") && gemIndex >= 0) {
        const gem = transferGemTypes[gemIndex];
        gemHidden.value = gem.id;
        gemTrigger.innerHTML = `<span class="gem-option-selected">${diamondIcon(gem.colorClass)}<span>${gem.name}</span></span>`;
        closeGem();
      }

      const options = [...gemList.querySelectorAll('.combo-option')];
      options.forEach((opt, i) => {
        opt.classList.toggle('highlighted', i === gemIndex);
        if (i === gemIndex) gemTrigger.setAttribute("aria-activedescendant", opt.id);
      });
    }

    if (event.key === "Escape") {
      closeGem();
    }
  });

  document.addEventListener("click", (event) => {
    if (!colleagueInput.closest("#colleague-combobox")?.contains(event.target)) {
      closeColleague();
    }

    if (!gemTrigger.closest("#gem-type-dropdown")?.contains(event.target)) {
      closeGem();
    }
  });

  function runGemsFallAnimation() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cta = document.querySelector(".transfer-cta");

    if (reducedMotion) {
      cta?.classList.add("pulse-success");
      setTimeout(() => cta?.classList.remove("pulse-success"), 500);
      return;
    }

    const layer = document.getElementById("gems-fall-layer");
    if (!layer) return;

    const gemsCount = 28;
    layer.innerHTML = "";

    for (let i = 0; i < gemsCount; i += 1) {
      const gem = document.createElement("span");
      const palette = ["yellow", "wecare", "better", "gamechanger"];
      const colorClass = palette[Math.floor(Math.random() * palette.length)];
      const drift = Math.round((Math.random() - 0.5) * 120);
      const duration = 1.5 + Math.random() * 1;
      const delay = Math.random() * 0.6;

      gem.className = `falling-gem gem-${colorClass}`;
      gem.style.left = `${Math.random() * 100}vw`;
      gem.style.setProperty("--drift", `${drift}px`);
      gem.style.animationDuration = `${duration}s`;
      gem.style.animationDelay = `${delay}s`;
      gem.innerHTML = diamondIcon(colorClass);
      layer.appendChild(gem);

      setTimeout(() => gem.remove(), (duration + delay) * 1000 + 100);
    }
  }

  filterColleagues("");
  renderGemList();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const colleague = colleagueHidden.value;
    const type = gemHidden.value;
    const comment = document.getElementById("comment").value.trim();

    if (!colleague || !type || !comment) {
      message.textContent = "Заповніть усі поля.";
      message.className = "message error transfer-message";
      return;
    }

    const state = getState();
    state.sent.unshift({ to: colleague, type, comment, date: new Date().toISOString().split("T")[0] });
    saveState(state);

    message.textContent = "Винагороду надіслано 🎉";
    message.className = "message success transfer-message";
    form.reset();
    gemHidden.value = "";
    colleagueHidden.value = "";
    gemTrigger.innerHTML = '<span class="combo-trigger-placeholder">Оберіть тип</span>';

    runGemsFallAnimation();
  });
}


function renderShop() {
  const container = document.getElementById("shop-grid");
  const searchInput = document.getElementById("shop-search");
  const categoryContainer = document.getElementById("shop-categories");
  if (!container) return;

  async function loadProducts() {
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      if (!response.ok) throw new Error("Products load failed");
      return await response.json();
    } catch (_error) {
      return PRODUCTS;
    }
  }

  function getUserTotalGems() {
    const state = getState();
    return Object.values(state.balance).reduce((sum, value) => sum + (Number(value) || 0), 0);
  }

  let activeCategory = "All";
  let query = "";

  function renderCategories() {
    if (!categoryContainer) return;
    categoryContainer.innerHTML = "";

    SHOP_CATEGORIES.forEach((category) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `shop-chip ${activeCategory === category ? "active" : ""}`;
      btn.textContent = category;
      btn.addEventListener("click", () => {
        activeCategory = category;
        renderCategories();
        renderProducts();
      });
      categoryContainer.appendChild(btn);
    });
  }

  let productsCache = [];

  function renderProducts() {
    const totalGems = getUserTotalGems();
    const filtered = productsCache.filter((product) => {
      const searchOk = !query || product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      const categoryOk = activeCategory === "All" || product.category === activeCategory;
      return searchOk && categoryOk;
    });

    container.innerHTML = "";
    filtered.forEach((product) => {
      const needMore = Math.max(0, product.totalCost - totalGems);
      const card = document.createElement("article");
      card.className = "shop-card-premium";

      card.innerHTML = `
        <div class="shop-card-top tint-${product.tint}">
          <div class="shop-emoji">${product.icon}</div>
          <span class="shop-tag">${product.category}</span>
          <h3>${product.title || product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="shop-card-bottom">
          <div class="shop-row">
            <span class="shop-cost">💎 ${product.totalCost} gems</span>
            <span class="shop-left">${product.left ?? 0} left</span>
          </div>
          <button type="button" class="shop-disabled-cta" disabled>
            ${needMore > 0 ? `Need ${needMore} more gems` : "Available now"}
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      query = event.target.value.trim().toLowerCase();
      renderProducts();
    });
  }

  loadProducts().then((products) => {
    productsCache = products.map((product) => {
      const meta = SHOP_META[product.name] || {};
      return {
        ...product,
        title: meta.title || product.name,
        category: meta.category || "Shopping",
        icon: meta.icon || "🎁",
        tint: meta.tint || "shopping",
        left: meta.left ?? 8,
      };
    });

    renderCategories();
    renderProducts();
  });
}


function initScrollState() {
  const update = () => document.body.classList.toggle("scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

guardAuth();
handleLogin();
handleLogout();
renderProfile();
renderTransfer();
renderShop();
initScrollState();
