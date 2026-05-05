let coiData = [];
let multiCiData = [];

// 1. Fetch JSON data on page load
Promise.all([
    fetch('coi.json').then(res => res.json()),
    fetch('multici.json').then(res => res.json())
]).then(([coi, multici]) => {
    coiData = coi;
    multiCiData = multici;
    const btn = document.getElementById('calcBtn');
    btn.textContent = "Calculate Projection";
    btn.disabled = false;
}).catch(err => {
    console.error("Error loading JSON files:", err);
    document.getElementById('calcBtn').textContent = "Error Loading Data";
});

// Helper function to look up rates from the JSON arrays
function getRate(data, age, gender, smoker) {
    const row = data.find(r => r.Age === age);
    if (!row) return 0;
    const key = `${gender} ${smoker === 'No' ? 'Non-Smoker' : 'Smoker'}`;
    return row[key] || 0;
}

// 2. Main Calculation Logic
document.getElementById('calcBtn').addEventListener('click', () => {
    const entryAge = parseInt(document.getElementById('entryAge').value);
    const gender = document.getElementById('gender').value;
    const smoker = document.getElementById('smoker').value;
    const faceAmount = parseFloat(document.getElementById('faceAmount').value);
    const premium = parseFloat(document.getElementById('premium').value);
    const multiCiAmount = parseFloat(document.getElementById('multiCiAmount').value);
    const roi = parseFloat(document.getElementById('roi').value) / 100;
    const payingTerm = parseInt(document.getElementById('payingTerm').value); // New variable
    
    // --- NEW VALIDATION LOGIC ---
    if ((payingTerm === 6 || payingTerm === 10) && faceAmount < 500000) {
        alert(`For a ${payingTerm}-year paying term, the minimum Face Amount is RM 500,000.`);
        return; // Stops the calculation
    }
    
    if (payingTerm === 20 && faceAmount < 750000) {
        alert("For a 20-year paying term, the minimum Face Amount is RM 750,000.");
        return; // Stops the calculation
    }
    // -----------------------------

    const tbody = document.querySelector('#projectionTable tbody');
    tbody.innerHTML = ''; // Clear previous results

    let accountValue = 0;
    let pastCoiDeductions = []; // Store COI deductions for Wellness calculation
    const adminCharge = 60;

    for (let year = 1; year <= (99 - entryAge + 1); year++) {
        let currentAge = entryAge + year - 1;
        let beginningValue = year === 1 ? 0 : accountValue * (1 + roi);

        // --- NEW PREMIUM PAYMENT LOGIC ---
        // Only inject premium if we are still within the paying term
        let isPayingTerm = year <= payingTerm;
        let currentPremium = isPayingTerm ? premium : 0;

        // Premium Allocation Logic
        let allocationRate = 1.0;
        if (year >= 1 && year <= 3) allocationRate = 0.60;
        else if (year >= 4 && year <= 6) allocationRate = 0.80;
        else if (year >= 7 && year <= 8) allocationRate = 0.95; 
        
        let nettPremium = currentPremium * allocationRate;
        // ---------------------------------

        // COI Calculation
        let rawCoiRate = getRate(coiData, currentAge, gender, smoker);
        let discountMultiplier = faceAmount >= 1000000 ? 0.8 : 1.0;
        let discountedCoiRate = rawCoiRate * discountMultiplier;
        
        let netAmountAtRisk = Math.max(0, faceAmount - beginningValue);
        let basicCoi = (netAmountAtRisk / 1000) * discountedCoiRate;
        
        // Track basic COI paid for the Wellness Bonus
        pastCoiDeductions.push(basicCoi);

        // Multi CI Calculation
        let multiCiRate = getRate(multiCiData, currentAge, gender, smoker);
        let multiCiCharge = (multiCiAmount / 1000) * multiCiRate;

        // Bonuses (Simplified placeholders - adjust to match exact Excel formula logic)
        let loyalty = 0;
        if ([85, 90, 95].includes(currentAge)) loyalty = faceAmount * 0.10;

        let wellness = 0;
        if (year === 10) wellness = 0.10 * pastCoiDeductions.slice(-10).reduce((a, b) => a + b, 0);
        if (year === 20) wellness = 0.20 * pastCoiDeductions.slice(-10).reduce((a, b) => a + b, 0);
        if (year === 30) wellness = 0.30 * pastCoiDeductions.slice(-10).reduce((a, b) => a + b, 0);

        let maturity = 0;
        if (currentAge === 70) maturity = faceAmount * 0.02;
        if (currentAge === 80) maturity = faceAmount * 0.05;
        if (currentAge === 99) maturity = faceAmount * 0.10;

        let totalBonuses = loyalty + wellness + maturity;

        // Final Account Value
        accountValue = beginningValue + nettPremium - basicCoi - multiCiCharge - adminCharge + totalBonuses;

        // Render Row
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align: center;">${year}</td>
            <td style="text-align: center;">${currentAge}</td>
            <td>${beginningValue.toFixed(2)}</td>
            <td>${nettPremium.toFixed(2)}</td>
            <td>${basicCoi.toFixed(2)}</td>
            <td>${multiCiCharge.toFixed(2)}</td>
            <td>${totalBonuses.toFixed(2)}</td>
            <td><strong>${accountValue.toFixed(2)}</strong></td>
        `;
        tbody.appendChild(tr);
    }
});
