
/* =====================================
   ГОРНОЕ МЯСО — ADMIN.JS
===================================== */

const ADMIN_CONFIG = {
  password: 'CHANGE_THIS_PASSWORD',
  storageKey: 'gornoe_miaso_settings'
};

const defaultSettings = {
  phone: '79886060203',
  telegram: 'https://t.me/+79886060203',
  address: 'село Архыз, ул. Ленина, 35',
  open: 9,
  close: 21,
  products: [
    { e: '🥩', name: 'Говядина', price: '' },
    { e: '🐑', name: 'Баранина', price: '' },
    { e: '🍗', name: 'Курица', price: '' },
    { e: '🍢', name: 'Люля-кебаб', price: '' },
    { e: '🐟', name: 'Форель', price: '' },
    { e: '🔥', name: 'Уголь для мангала', price: '' }
  ]
};

function getSettings() {
  try {
    return {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem(ADMIN_CONFIG.storageKey))
    };
  } catch {
    return structuredClone(defaultSettings);
  }
}

function saveSettings(settings) {
  localStorage.setItem(
    ADMIN_CONFIG.storageKey,
    JSON.stringify(settings)
  );
}

let settings = getSettings();

function adminLogin() {
  const password = prompt('Введите пароль владельца');

  if (password !== ADMIN_CONFIG.password) {
    alert('Неверный пароль!');
    return;
  }

  document.getElementById('adminPanel').hidden = false;
  renderAdmin();
}

function adminLogout() {
  document.getElementById('adminPanel').hidden = true;
}

function renderAdmin() {
  const panel = document.getElementById('adminPanel');

  panel.innerHTML = `
    <h2>Панель владельца</h2>

    <h3>Контакты</h3>

    <label>Телефон</label>
    <input id="adminPhone" value="${escapeHTML(settings.phone)}">

    <label>Telegram</label>
    <input id="adminTelegram" value="${escapeHTML(settings.telegram)}">

    <label>Адрес</label>
    <input id="adminAddress" value="${escapeHTML(settings.address)}">

    <h3>Часы работы</h3>

    <label>Открытие</label>
    <input id="adminOpen" type="number" min="0" max="23" value="${settings.open}">

    <label>Закрытие</label>
    <input id="adminClose" type="number" min="0" max="23" value="${settings.close}">

    <h3>Товары</h3>

    <div id="adminProducts"></div>

    <button type="button" onclick="addProduct()">+ Добавить товар</button>

    <br><br>

    <button type="button" onclick="saveAdmin()">Сохранить изменения</button>

    <button type="button" onclick="adminLogout()">Выйти</button>
  `;

  renderProductsAdmin();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function renderProductsAdmin() {
  const container = document.getElementById('adminProducts');

  container.innerHTML = settings.products.map((product, index) => `
    <div class="admin-product">
      <input data-index="${index}" data-field="e"
        value="${escapeHTML(product.e)}" placeholder="Эмодзи">

      <input data-index="${index}" data-field="name"
        value="${escapeHTML(product.name)}" placeholder="Название">

      <input data-index="${index}" data-field="price"
        value="${escapeHTML(product.price)}" placeholder="Цена">

      <button type="button" onclick="deleteProduct(${index})">
        Удалить
      </button>
    </div>
  `).join('');
}

function addProduct() {
  settings.products.push({
    e: '🛒',
    name: 'Новый товар',
    price: ''
  });

  renderProductsAdmin();
}

function deleteProduct(index) {
  if (!confirm('Удалить товар?')) return;

  settings.products.splice(index, 1);
  renderProductsAdmin();
}

function saveAdmin() {
  document.querySelectorAll('#adminProducts [data-index]').forEach(input => {
    const index = Number(input.dataset.index);
    const field = input.dataset.field;

    settings.products[index][field] = input.value.trim();
  });

  settings.phone = document.getElementById('adminPhone').value.trim();
  settings.telegram = document.getElementById('adminTelegram').value.trim();
  settings.address = document.getElementById('adminAddress').value.trim();
  settings.open = Number(document.getElementById('adminOpen').value);
  settings.close = Number(document.getElementById('adminClose').value);

  saveSettings(settings);

  alert('Изменения сохранены!');
  
  if (typeof drawProducts === 'function') {
    drawProducts();
  }
}

window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.addProduct = addProduct;
window.deleteProduct = deleteProduct;
window.saveAdmin = saveAdmin;
