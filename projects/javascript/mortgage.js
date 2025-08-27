// --- GLOBAL UTILITIES ---
const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const currencyFormatterCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// --- TAB SWITCHING LOGIC ---
const tabContainer = document.getElementById('tabContainer');
tabContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
        const targetTab = e.target.dataset.tab;
        tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${targetTab}Content`);
        });
    }
});

// --- AFFORDABILITY CALCULATOR LOGIC ---
document.getElementById('calculateBtnAffordability').addEventListener('click', () => {
    const salary = parseFloat(document.getElementById('salary').value);
    const percentApplied = parseFloat(document.getElementById('percentApplied').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPayment').value);
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value);
    const monthlyHoaInsurance = parseFloat(document.getElementById('hoaInsurance').value);
    const resultsDiv = document.getElementById('resultsAffordability');
    const errorDiv = document.getElementById('errorAffordability');

    if (isNaN(salary) || isNaN(percentApplied) || isNaN(downPaymentPercent) || isNaN(annualInterestRate) || isNaN(monthlyHoaInsurance) || salary <= 0 || percentApplied <= 0 || downPaymentPercent < 0 || annualInterestRate <= 0 || monthlyHoaInsurance < 0) {
        errorDiv.querySelector('p').textContent = 'Please fill out all fields with valid, positive numbers.';
        errorDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        return;
    }
    errorDiv.classList.add('hidden');

    const desiredMonthlyPayment = (salary / 12) * (percentApplied / 100);
    const monthlyPI = desiredMonthlyPayment - monthlyHoaInsurance;

    if (monthlyPI <= 0) {
        errorDiv.querySelector('p').textContent = 'Your HOA and Insurance costs are higher than your desired monthly mortgage payment.';
        errorDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        return;
    }

    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const loanTermInMonths = 30 * 12;
    const numerator = monthlyPI;
    const denominator = (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermInMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermInMonths) - 1);
    const totalLoanAmount = (denominator > 0) ? (numerator / denominator) : (monthlyPI * loanTermInMonths);

    if (downPaymentPercent >= 100) {
        errorDiv.querySelector('p').textContent = 'Down payment percentage must be less than 100%.';
        errorDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        return;
    }
    const affordableHousePrice = totalLoanAmount / (1 - (downPaymentPercent / 100));
    const downPaymentAmount = affordableHousePrice * (downPaymentPercent / 100);

    document.getElementById('housePriceResult').textContent = currencyFormatter.format(affordableHousePrice);
    document.getElementById('downPaymentResult').textContent = `Based on a down payment of: ${currencyFormatter.format(downPaymentAmount)}`;
    document.getElementById('monthlyPaymentResult').textContent = currencyFormatter.format(desiredMonthlyPayment);
    resultsDiv.classList.remove('hidden');
});

// --- MORTGAGE PAYMENT CALCULATOR LOGIC ---
const homeValueInput = document.getElementById('homeValue');
const downPaymentPaymentInput = document.getElementById('downPaymentPayment');
const loanAmountInput = document.getElementById('loanAmount');
const calculateBtnPayment = document.getElementById('calculateBtnPayment');
const viewToggle = document.getElementById('viewToggle');
const toggleTableBtn = document.getElementById('toggleTableBtn');
const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const tableContainerWrapper = document.getElementById('tableContainerWrapper');
let amortizationChart = null;
let monthlyScheduleData = [];
let annualScheduleData = [];

function updateLoanAmount() {
    const homeValue = parseFloat(homeValueInput.value) || 0;
    const downPayment = parseFloat(downPaymentPaymentInput.value) || 0;
    loanAmountInput.value = (homeValue - downPayment).toFixed(0);
}
homeValueInput.addEventListener('input', updateLoanAmount);
downPaymentPaymentInput.addEventListener('input', updateLoanAmount);
document.getElementById('startDate').value = new Date().toISOString().substring(0, 7);
updateLoanAmount();

function populateAmortizationTable() {
    const isAnnualView = viewToggle.checked;
    const data = isAnnualView ? annualScheduleData : monthlyScheduleData;
    const tableHead = document.getElementById('amortizationTableHead');
    const tableBody = document.getElementById('amortizationTableBody');
    
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    let headRow = document.createElement('tr');
    const headers = isAnnualView 
        ? ['Year', 'Principal', 'Interest', 'Taxes & Fees', 'Ending Balance']
        : ['Year', 'Month', 'Principal', 'Interest', 'Taxes & Fees', 'Balance'];
    headers.forEach(headerText => {
        let th = document.createElement('th');
        th.scope = 'col';
        th.className = 'px-6 py-3';
        th.textContent = headerText;
        headRow.appendChild(th);
    });
    tableHead.appendChild(headRow);

    data.forEach(row => {
        let tr = document.createElement('tr');
        const rowData = isAnnualView
            ? [row.year, currencyFormatterCents.format(row.principal), currencyFormatterCents.format(row.interest), currencyFormatterCents.format(row.fees), currencyFormatterCents.format(row.balance)]
            : [row.year, row.month, currencyFormatterCents.format(row.principal), currencyFormatterCents.format(row.interest), currencyFormatterCents.format(row.fees), currencyFormatterCents.format(row.balance)];
        
        rowData.forEach(cellData => {
            let td = document.createElement('td');
            td.className = 'px-6 py-4';
            td.textContent = cellData;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function drawOrUpdateChart() {
    const isAnnualView = viewToggle.checked;
    const data = isAnnualView ? annualScheduleData : monthlyScheduleData;
    
    const monthlyLabel = document.getElementById('monthlyToggleLabel');
    const annualLabel = document.getElementById('annualToggleLabel');
    
    monthlyLabel.classList.toggle('text-indigo-600', !isAnnualView);
    monthlyLabel.classList.toggle('text-gray-500', isAnnualView);
    annualLabel.classList.toggle('text-indigo-600', isAnnualView);
    annualLabel.classList.toggle('text-gray-500', !isAnnualView);

    if (!amortizationChart) {
        const ctx = document.getElementById('amortizationChart').getContext('2d');
        amortizationChart = new Chart(ctx, {
            type: 'bar',
            options: { responsive: true, maintainAspectRatio: false, scales: { x: {}, yPayment: { type: 'linear', position: 'left', stacked: true, title: { display: true } }, yBalance: { type: 'linear', position: 'right', title: { display: true, text: 'Loan Balance ($)' }, grid: { drawOnChartArea: false } } }, plugins: { tooltip: { mode: 'index', intersect: false } } }
        });
    }
    
    amortizationChart.data.labels = data.map(row => isAnnualView ? row.year : row.date);
    amortizationChart.data.datasets = [
        { type: 'line', label: 'Remaining Balance', data: data.map(row => row.balance), borderColor: '#1e40af', backgroundColor: 'transparent', yAxisID: 'yBalance', tension: 0.1, pointRadius: isAnnualView ? 3 : 0 },
        { label: 'Principal', data: data.map(row => row.principal), backgroundColor: '#22c55e', yAxisID: 'yPayment' },
        { label: 'Interest', data: data.map(row => row.interest), backgroundColor: '#ef4444', yAxisID: 'yPayment' },
        { label: 'Taxes & Fees', data: data.map(row => row.fees), backgroundColor: '#f97316', yAxisID: 'yPayment' }
    ];
    
    amortizationChart.options.scales.x = isAnnualView 
        ? { type: 'category', stacked: true } 
        : { type: 'time', stacked: true, time: { unit: 'year', displayFormats: { year: 'yyyy-MM' } } };
    
    amortizationChart.options.scales.yPayment.title.text = isAnnualView ? 'Annual Payment ($)' : 'Monthly Payment ($)';
    
    amortizationChart.update();
    populateAmortizationTable();
}

viewToggle.addEventListener('change', drawOrUpdateChart);

toggleTableBtn.addEventListener('click', () => {
    const isHidden = tableContainerWrapper.classList.toggle('hidden');
    toggleTableBtn.textContent = isHidden ? 'Show Schedule' : 'Hide Schedule';
});

downloadCsvBtn.addEventListener('click', () => {
    const isAnnualView = viewToggle.checked;
    const data = isAnnualView ? annualScheduleData : monthlyScheduleData;
    const headers = isAnnualView 
        ? ['Year', 'Principal', 'Interest', 'Taxes & Fees', 'Ending Balance']
        : ['Year', 'Month', 'Principal', 'Interest', 'Taxes & Fees', 'Balance'];
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

    data.forEach(row => {
        const rowData = isAnnualView
            ? [row.year, row.principal.toFixed(2), row.interest.toFixed(2), row.fees.toFixed(2), row.balance.toFixed(2)]
            : [row.year, row.month, row.principal.toFixed(2), row.interest.toFixed(2), row.fees.toFixed(2), row.balance.toFixed(2)];
        csvContent += rowData.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `amortization_schedule_${isAnnualView ? 'annual' : 'monthly'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

calculateBtnPayment.addEventListener('click', () => {
    const loanAmount = parseFloat(loanAmountInput.value);
    const annualInterestRate = parseFloat(document.getElementById('interestRatePayment').value);
    const loanTermYears = parseInt(document.getElementById('loanTerm').value);
    const startDate = new Date(document.getElementById('startDate').value + '-02');
    const annualPropertyTax = parseFloat(document.getElementById('propertyTax').value) || 0;
    const annualInsurance = parseFloat(document.getElementById('insurance').value) || 0;
    const monthlyHOA = parseFloat(document.getElementById('monthlyHOA').value) || 0;
    const resultsDiv = document.getElementById('resultsPayment');
    const errorDiv = document.getElementById('errorPayment');

    if (isNaN(loanAmount) || isNaN(annualInterestRate) || isNaN(loanTermYears) || loanAmount <= 0 || annualInterestRate < 0 || loanTermYears <= 0) {
        errorDiv.querySelector('p').textContent = 'Please fill out Loan Amount, Interest Rate, and Loan Term with valid numbers.';
        errorDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        return;
    }
    errorDiv.classList.add('hidden');

    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const loanTermMonths = loanTermYears * 12;
    const monthlyFees = (annualPropertyTax / 12) + (annualInsurance / 12) + monthlyHOA;
    const monthlyPI = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    const totalMonthlyPayment = monthlyPI + monthlyFees;

    let balance = loanAmount;
    monthlyScheduleData = [];
    for (let i = 0; i < loanTermMonths; i++) {
        const interestPayment = balance * monthlyInterestRate;
        const principalPayment = monthlyPI - interestPayment;
        balance -= principalPayment;
        const currentDate = new Date(startDate);
        currentDate.setMonth(startDate.getMonth() + i);
        monthlyScheduleData.push({ year: currentDate.getFullYear(), month: currentDate.toLocaleString('default', { month: 'short' }), date: currentDate, principal: principalPayment, interest: interestPayment, fees: monthlyFees, balance: balance < 0 ? 0 : balance });
    }
    
    annualScheduleData = [];
    const years = [...new Set(monthlyScheduleData.map(item => item.year))];
    years.forEach(year => {
        const yearData = monthlyScheduleData.filter(row => row.year === year);
        annualScheduleData.push({
            year: year,
            principal: yearData.reduce((acc, row) => acc + row.principal, 0),
            interest: yearData.reduce((acc, row) => acc + row.interest, 0),
            fees: yearData.reduce((acc, row) => acc + row.fees, 0),
            balance: yearData[yearData.length - 1].balance
        });
    });

    document.getElementById('totalMonthlyPaymentResult').textContent = currencyFormatterCents.format(totalMonthlyPayment);
    
    tableContainerWrapper.classList.add('hidden');
    toggleTableBtn.textContent = 'Show Schedule';

    drawOrUpdateChart();
    resultsDiv.classList.remove('hidden');
});
