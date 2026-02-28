async function fetchAll() {
    try {
        const symbols = [
            "BTC-USD",
            "ETH-USD",
            "GC=F",   // Gold Futures
            "SI=F",   // Silver Futures
            "CL=F"    // Oil Futures
        ];

        const url =
            "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" +
            symbols.join(",");

        const res = await fetch(url);
        const data = await res.json();

        const results = data.quoteResponse.result;

        results.forEach(item => {
            const price = item.regularMarketPrice?.toFixed(2);

            switch (item.symbol) {
                case "BTC-USD":
                    document.getElementById("btc").textContent =
                        `$${Number(price).toLocaleString()}`;
                    break;

                case "ETH-USD":
                    document.getElementById("eth").textContent =
                        `$${Number(price).toLocaleString()}`;
                    break;

                case "GC=F":
                    document.getElementById("gold").textContent =
                        `$${price}`;
                    break;

                case "SI=F":
                    document.getElementById("silver").textContent =
                        `$${price}`;
                    break;

                case "CL=F":
                    document.getElementById("oil").textContent =
                        `$${price}`;
                    break;
            }
        });

        updateTime();

    } catch (error) {
        console.error("Fetch error:", error);
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

    const formatted =
        new Intl.DateTimeFormat("en-GB", options).format(now);

    document.getElementById("lastUpdated").textContent =
        formatted + " (GMT+8)";
}

fetchAll();
setInterval(fetchAll, 30000);
