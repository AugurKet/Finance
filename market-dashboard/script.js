async function fetchCrypto(fromSymbol, elementId) {
    try {
        const url =
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromSymbol}&to_currency=USD&apikey=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        console.log(fromSymbol, data); // <-- ADD THIS

        if (data["Realtime Currency Exchange Rate"]) {
            const rate =
                data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];

            document.getElementById(elementId).textContent =
                `$${parseFloat(rate).toLocaleString()}`;
        } else {
            document.getElementById(elementId).textContent = "Rate Limited";
        }

    } catch (err) {
        console.error("Crypto error:", err);
    }
}
