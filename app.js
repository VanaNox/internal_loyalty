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
  const gemBalance = document.getElementById("gem-balance");
  const sentHistory = document.getElementById("sent-history");
  const receivedHistory = document.getElementById("received-history");
  if (!gemBalance || !sentHistory || !receivedHistory) return;

  const state = getState();

  GEM_TYPES.forEach((type) => {
    const card = document.createElement("div");
    card.className = "gem-card";
    card.style.background = type.color;
    card.innerHTML = `<h3>${type.name}</h3><p>${state.balance[type.id] || 0}</p>`;
    gemBalance.appendChild(card);
  });

  state.sent.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.to} • ${humanizeGem(entry.type)} — ${entry.comment}`;
    sentHistory.appendChild(li);
  });

  state.received.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.from} • ${humanizeGem(entry.type)} — ${entry.comment}`;
    receivedHistory.appendChild(li);
  });
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
