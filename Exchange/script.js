const currencies = [
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

async function loadRates() {
  const table = document.getElementById("ratesTable");
  const updated = document.getElementById("updatedTime");

  table.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await response.json();

    table.innerHTML = "";

    currencies.forEach(currency => {
      const rate = data.rates[currency.code];

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${currency.name}</td>
        <td>${currency.code}</td>
        <td>${rate}</td>
      `;
      table.appendChild(row);
    });

    updated.textContent = "Last Updated: " + data.time_last_update_utc;

  } catch (error) {
    table.innerHTML = "<tr><td colspan='3'>Error loading rates</td></tr>";
    updated.textContent = "";
  }
}

// Load on page start
loadRates();

// Optional: Auto refresh every 10 minutes
setInterval(loadRates, 600000);
