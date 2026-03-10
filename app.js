const GEM_TYPES = [
  { id: "impact", name: "Impact", color: "#4f46e5" },
  { id: "teamwork", name: "Teamwork", color: "#0d9488" },
  { id: "innovation", name: "Innovation", color: "#f97316" },
  { id: "ownership", name: "Ownership", color: "#db2777" },
];

const TEAM = ["Оля К.", "Максим П.", "Ірина С.", "Андрій Т."];

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
  ],
  received: [
    { from: "Максим П.", type: "impact", comment: "Крутий делівері фічі", date: "2026-03-02" },
    { from: "Ірина С.", type: "innovation", comment: "Супер ідея для UX", date: "2026-03-03" },
  ],
};

const PRODUCTS = [
  { name: "Футболка GemPulse", description: "Базова футболка з брендованим принтом", cost: { teamwork: 6, impact: 2 } },
  { name: "Худі Team Hero", description: "Тепле худі для офісу та дому", cost: { impact: 5, ownership: 4 } },
  { name: "Сертифікат Rozetka", description: "Електронний сертифікат номіналом 1000 грн", cost: { innovation: 6, impact: 3 } },
  { name: "Квиток на конференцію", description: "Покриття квитка на профільний івент", cost: { ownership: 6, innovation: 4 } },
];

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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem("gempulse_auth", "true");
    getState();
    window.location.href = "profile.html";
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
  const statsGrid = document.getElementById("gem-stats-grid");
  const historyBody = document.getElementById("history-table-body");
  const receivedButton = document.getElementById("history-filter-received");
  const sentButton = document.getElementById("history-filter-sent");

  if (!profileName || !statsGrid || !historyBody || !receivedButton || !sentButton) return;

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

  const statConfig = [
    { key: "impact", title: "Золоті геми", icon: "⭐", caption: "Поточний баланс золотих гемів" },
    { key: "teamwork", title: "Срібні геми", icon: "🪙", caption: "Поточний баланс срібних гемів" },
    { key: "innovation", title: "Бронзові геми", icon: "🟠", caption: "Поточний баланс бронзових гемів" },
    { key: "ownership", title: "Діамантові геми", icon: "💎", caption: "Поточний баланс діамантових гемів" },
  ];

  statsGrid.innerHTML = "";
  statConfig.forEach((item) => {
    const value = state.balance[item.key] || 0;
    const card = document.createElement("article");
    card.className = "stat-card";
    card.innerHTML = `
      <div class="stat-top">
        <span>${item.title}</span>
        <span class="stat-icon">${item.icon}</span>
      </div>
      <p class="stat-value">${value}</p>
      <p class="stat-caption">${item.caption}</p>
    `;
    statsGrid.appendChild(card);
  });

  const receivedHistory = state.received.map((entry) => ({
    date: entry.date,
    from: entry.from,
    to: state.user.name,
    type: humanizeGem(entry.type),
    amount: 1,
    comment: entry.comment,
  }));

  const sentHistory = state.sent.map((entry) => ({
    date: entry.date,
    from: state.user.name,
    to: entry.to,
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
        <td>${row.type}</td>
        <td>${row.amount}</td>
        <td>${row.comment}</td>
      `;
      historyBody.appendChild(tr);
    });
  }

  function setActiveFilter(mode) {
    receivedButton.classList.toggle("active", mode === "received");
    sentButton.classList.toggle("active", mode === "sent");
    renderHistoryRows(mode === "received" ? receivedHistory : sentHistory);
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

  PRODUCTS.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product";

    const badges = Object.entries(product.cost)
      .map(([gem, count]) => `<span class="badge">${count} ${humanizeGem(gem)}</span>`)
      .join("");

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="badges">${badges}</div>
    `;

    container.appendChild(card);
  });
}

guardAuth();
handleLogin();
handleLogout();
renderProfile();
renderTransfer();
renderShop();
