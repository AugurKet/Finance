const currencyList = [
  { code: "EUR", name: "Euro" },
  { code: "CNY", name: "Chinese Renminbi" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "VND", name: "Vietnamese Dong" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "INR", name: "Indian Rupee" },
  { code: "GBP", name: "British Pound" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "TWD", name: "Taiwan Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "THB", name: "Thai Baht" },
  { code: "PHP", name: "Philippine Peso" }
];

let currentRates = {};

async function loadRates() {
  const table = document.getElementById("ratesTable");
  const updated = document.getElementById("updatedTime");

  table.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/MYR");
    const data = await response.json();

    currentRates = data.rates;
    renderTable(currencyList);

    updated.textContent = "Last Updated: " + data.time_last_update_utc;
    populateDropdown();

  } catch {
    table.innerHTML = "<tr><td colspan='3'>Error loading data</td></tr>";
  }
}

function renderTable(list) {
  const table = document.getElementById("ratesTable");
  table.innerHTML = "";

  list.forEach(currency => {
    const rate = currentRates[currency.code];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${currency.name}</td>
      <td>${currency.code}</td>
      <td>${rate}</td>
    `;
    table.appendChild(row);
  });
}

function sortAZ() {
  const sorted = [...currencyList].sort((a,b) => a.code.localeCompare(b.code));
  renderTable(sorted);
}

function sortHighLow() {
  const sorted = [...currencyList].sort((a,b) => 
    currentRates[b.code] - currentRates[a.code]
  );
  renderTable(sorted);
}

function populateDropdown() {
  const select = document.getElementById("currencySelect");
  select.innerHTML = "";
  currencyList.forEach(currency => {
    const option = document.createElement("option");
    option.value = currency.code;
    option.textContent = currency.code;
    select.appendChild(option);
  });
}

function convert() {
  const amount = document.getElementById("amount").value;
  const currency = document.getElementById("currencySelect").value;
  const rate = currentRates[currency];

  const result = amount * rate;
  document.getElementById("conversionResult")
    .textContent = `${amount} MYR = ${result.toFixed(4)} ${currency}`;
}

/* Dark Mode Toggle */
document.getElementById("darkToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

/* Auto Load */
loadRates();
setInterval(loadRates, 600000);
