const form = document.getElementById("form");
const list = document.getElementById("list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const monthlyReport = document.getElementById("monthlyReport");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

// ================= UPDATE UI =================

function updateUI() {

    list.innerHTML = "";

    let total = 0;
    let inc = 0;
    let exp = 0;

    transactions.forEach((t, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <strong>${t.text}</strong>
                <div class="meta">${t.category} • ${t.date}</div>
            </div>
            <div>
                ₹${t.amount}
                <button onclick="deleteTransaction(${index})">❌</button>
            </div>
        `;

        list.appendChild(li);

        total += t.amount;

        if (t.amount > 0) inc += t.amount;
        else exp += t.amount;
    });

    balance.innerText = total;
    income.innerText = inc;
    expense.innerText = Math.abs(exp);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateChart(inc, Math.abs(exp));
    generateMonthlyReport();
}

// ================= DELETE =================

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

// ================= ADD TRANSACTION =================

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const text = document.getElementById("text").value;
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    const today = new Date().toLocaleDateString();

    transactions.push({
        text,
        amount,
        category,
        date: today
    });

    updateUI();
    form.reset();
});

// ================= CHART =================

function updateChart(incomeValue, expenseValue) {

    const ctx = document.getElementById("myChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [incomeValue, expenseValue]
            }]
        }
    });
}

// ================= DARK MODE =================

const toggleBtn = document.getElementById("toggleMode");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        toggleBtn.classList.toggle("active");
    });
}

// ================= MONTHLY REPORT =================

function generateMonthlyReport() {

    let currentMonth = new Date().getMonth();
    let monthlyTotal = 0;

    transactions.forEach(t => {

        let txnDate = new Date(t.date);
        if (txnDate.getMonth() === currentMonth) {
            monthlyTotal += t.amount;
        }

    });

    monthlyReport.innerText = "This Month Balance: ₹ " + monthlyTotal;
}

// ================= PDF =================

function downloadPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Expense Report", 10, 10);

    let y = 20;

    transactions.forEach(t => {
        doc.text(`${t.text} (${t.category}) : ₹${t.amount}`, 10, y);
        y += 10;
    });

    doc.save("report.pdf");
}

// ================= INIT =================

updateUI();