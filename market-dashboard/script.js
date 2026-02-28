const API_KEY = "MQ8P5LTD8Z3CEQTZ";

async function fetchCrypto(fromSymbol, elementId) {
    try {
        const url =
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromSymbol}&to_currency=USD&apikey=${API_KEY}`;

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

async function fetchCommodity(symbol, elementId) {
    try {
        const url =
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        const price =
            data["Global Quote"]["05. price"];

        document.getElementById(elementId).textContent =
            `$${parseFloat(price).toFixed(2)}`;
    } catch (err) {
        console.error("Commodity error:", err);
    }
}

function updateTime() {
    const now = new Date();

    const options = {
        timeZone: "Asia/Kuala_Lumpur",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    };

    document.getElementById("lastUpdated").textContent =
        now.toLocaleString("en-GB", options) + " (GMT+8)";
}

async function fetchAll() {
    await fetchCrypto("BTC", "btc");
    await fetchCrypto("ETH", "eth");

    // Commodities (futures)
    await fetchCommodity("GC=F", "gold");
    await fetchCommodity("SI=F", "silver");
    await fetchCommodity("CL=F", "oil");

    updateTime();
}

fetchAll();
setInterval(fetchAll, 60000);
