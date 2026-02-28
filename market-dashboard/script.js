const API_KEY = "MQ8P5LTD8Z3CEQTZ";

async function fetchCrypto(symbol, elementId) {
    try {
        const url =
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        const rate =
            data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];

        document.getElementById(elementId).textContent =
            `$${parseFloat(rate).toLocaleString()}`;
    } catch (err) {
        console.error("Crypto error:", err);
    }
}

async function fetchMetal(symbol, elementId) {
    try {
        const url =
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        const rate =
            data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];

        document.getElementById(elementId).textContent =
            `$${parseFloat(rate).toFixed(2)}`;
    } catch (err) {
        console.error("Metal error:", err);
    }
}

function updateTime() {
    const now = new Date();

    document.getElementById("lastUpdated").textContent =
        now.toLocaleString("en-GB", {
            timeZone: "Asia/Kuala_Lumpur",
            hour12: false
        }) + " (GMT+8)";
}

async function fetchAll() {
    await fetchCrypto("BTC", "btc");
    await fetchCrypto("ETH", "eth");

    await fetchMetal("XAU", "gold");   // Gold
    await fetchMetal("XAG", "silver"); // Silver

    // Oil temporarily disabled (Alpha free tier limitation)
    document.getElementById("oil").textContent = "N/A";

    updateTime();
}

fetchAll();
setInterval(fetchAll, 60000);
