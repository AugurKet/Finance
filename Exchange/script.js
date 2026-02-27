const currencies = [
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾", symbol: "RM" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "CNY", name: "Renminbi", flag: "🇨🇳", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", symbol: "$" },
  { code: "JPY", name: "Yen", flag: "🇯🇵", symbol: "¥" },
  { code: "VND", name: "Dong", flag: "🇻🇳", symbol: "₫" },
  { code: "IDR", name: "Rupiah", flag: "🇮🇩", symbol: "Rp" },
  { code: "INR", name: "Rupee", flag: "🇮🇳", symbol: "₹" },
  { code: "GBP", name: "Pound", flag: "🇬🇧", symbol: "£" },
  { code: "HKD", name: "HK Dollar", flag: "🇭🇰", symbol: "$" },
  { code: "TWD", name: "NT Dollar", flag: "🇹🇼", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "$" },
  { code: "THB", name: "Baht", flag: "🇹🇭", symbol: "฿" },
  { code: "PHP", name: "Peso", flag: "🇵🇭", symbol: "₱" }
];

let baseCurrency = "MYR";
let currentRates = {};

async function loadRates() {
  const table = document.getElementById("ratesTable");
  const updated = document.getElementById("updatedTime");

  const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
  const data = await res.json();

  currentRates = data.rates;
  renderTable();

  const utc = new Date(data.time_last_update_utc);
  updated.textContent =
    "Updated (GMT+8): " +
    utc.toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" });
}

function renderTable() {
  const table = document.getElementById("ratesTable");
  table.innerHTML = "";

  currencies.forEach(cur => {
    if (cur.code === baseCurrency) return;

    const rate = currentRates[cur.code];
    const trend = (Math.random() * 0.02 - 0.01).toFixed(4); // simulate 24h change
    const arrow = trend >= 0 ? "⬆️" : "⬇️";

    const spark = generateSparkline();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${cur.flag}</td>
      <td>${cur.name} (${cur.code})</td>
      <td>${cur.symbol} ${rate.toFixed(4)}</td>
      <td>${arrow} ${trend}</td>
      <td>${spark}</td>
    `;

    table.appendChild(row);
  });
}

function generateSparkline() {
  let points = [];
  for (let i = 0; i < 10; i++) {
    points.push(Math.floor(Math.random() * 20 + 5));
  }

  const max = Math.max(...points);

  return `
    <svg class="spark" viewBox="0 0 100 30">
      <polyline
        fill="none"
        stroke="blue"
        stroke-width="2"
        points="${points.map((p,i)=>`${i*10},${30-(p/max*25)}`).join(" ")}"
      />
    </svg>
  `;
}

function populateBaseDropdown() {
  const select = document.getElementById("baseSelect");
  currencies.forEach(cur => {
    const option = document.createElement("option");
    option.value = cur.code;
    option.textContent = cur.code;
    select.appendChild(option);
  });

  select.value = baseCurrency;

  select.addEventListener("change", e => {
    baseCurrency = e.target.value;
    loadRates();
  });
}

/* Dark Mode */
document.getElementById("darkToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

populateBaseDropdown();
loadRates();
setInterval(loadRates, 600000);

/* Register Service Worker */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
