async function fetchCrypto() {
    try {
        const res = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await res.json();

        const btc = data.bitcoin.usd;
        const btcChange = data.bitcoin.usd_24h_change.toFixed(2);

        const eth = data.ethereum.usd;
        const ethChange = data.ethereum.usd_24h_change.toFixed(2);

        document.getElementById("btc").textContent = `$${btc.toLocaleString()}`;
        document.getElementById("eth").textContent = `$${eth.toLocaleString()}`;

        updateChange("btcChange", btcChange);
        updateChange("ethChange", ethChange);

    } catch (err) {
        console.error("Crypto error:", err);
    }
}

function updateChange(elementId, value) {
    const el = document.getElementById(elementId);
    el.textContent = `${value}% (24h)`;
    el.className = value >= 0 ? "positive" : "negative";
}

// 🔥 FIXED METALS + OIL
async function fetchMetals() {
    try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const targetUrl = encodeURIComponent("https://api.metals.live/v1/spot");

        const res = await fetch(proxyUrl + targetUrl);
        const data = await res.json();

        const prices = {};
        data.forEach(item => {
            const key = Object.keys(item)[0];
            prices[key] = item[key];
        });

        document.getElementById("gold").textContent =
            prices.gold ? `$${prices.gold.toFixed(2)}` : "N/A";

        document.getElementById("silver").textContent =
            prices.silver ? `$${prices.silver.toFixed(2)}` : "N/A";

        document.getElementById("oil").textContent =
            prices.oil ? `$${prices.oil.toFixed(2)}` : "N/A";

    } catch (err) {
        console.error("Metals error:", err);
    }
}

// 🔥 GMT+8 Timestamp (Malaysia Time)
function updateTime() {
    const now = new Date();

    const options = {
        timeZone: "Asia/Kuala_Lumpur",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    const formatted = new Intl.DateTimeFormat("en-MY", options).format(now);

    document.getElementById("lastUpdated").textContent =
        formatted + " (GMT+8)";
}

async function fetchAll() {
    await fetchCrypto();
    await fetchMetals();
    updateTime();
}

fetchAll();
setInterval(fetchAll, 30000);
