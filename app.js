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

  const colleagueSelect = document.getElementById("colleague");
  const gemSelect = document.getElementById("gem-type");
  const message = document.getElementById("transfer-message");

  TEAM.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    colleagueSelect.appendChild(option);
  });

  GEM_TYPES.forEach((gem) => {
    const option = document.createElement("option");
    option.value = gem.id;
    option.textContent = gem.name;
    gemSelect.appendChild(option);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const colleague = colleagueSelect.value;
    const type = gemSelect.value;
    const comment = document.getElementById("comment").value.trim();

    if (!colleague || !type || !comment) {
      message.textContent = "Заповніть усі поля.";
      message.className = "message error";
      return;
    }

    const state = getState();
    state.sent.unshift({ to: colleague, type, comment, date: new Date().toISOString().split("T")[0] });
    saveState(state);

    message.textContent = "Гем успішно надіслано 🎉";
    message.className = "message success";
    form.reset();
  });
}

function renderShop() {
  const container = document.getElementById("shop-grid");
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

  loadProducts().then((products) => {
    container.innerHTML = "";
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product";

      card.innerHTML = `
        <img class="product-image" src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="badges"><span class="badge">${product.totalCost} гемів</span></div>
      `;

      container.appendChild(card);
    });
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
