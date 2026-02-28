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

    if (value >= 0) {
        el.className = "positive";
    } else {
        el.className = "negative";
    }
}

async function fetchMetals() {
    try {
        const res = await fetch("https://api.metals.live/v1/spot");
        const data = await res.json();

        const prices = {};
        data.forEach(item => {
            const key = Object.keys(item)[0];
            prices[key] = item[key];
        });

        document.getElementById("gold").textContent =
            `$${prices.gold?.toFixed(2) || "-"}`;

        document.getElementById("silver").textContent =
            `$${prices.silver?.toFixed(2) || "-"}`;

        document.getElementById("oil").textContent =
            `$${prices.oil?.toFixed(2) || "-"}`;

    } catch (err) {
        console.error("Metals error:", err);
    }
}

function updateTime() {
    const now = new Date();
    document.getElementById("lastUpdated").textContent =
        now.toLocaleString();
}

async function fetchAll() {
    await fetchCrypto();
    await fetchMetals();
    updateTime();
}

fetchAll();
setInterval(fetchAll, 30000);
