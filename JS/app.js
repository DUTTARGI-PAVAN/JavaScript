const form = document.getElementById("form");
const list = document.getElementById("list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

function updateUI() {

    list.innerHTML = "";

    let total = 0;
    let inc = 0;
    let exp = 0;

    transactions.forEach((t, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            ${t.text} (${t.category}) : ₹${t.amount}
            <button onclick="deleteTransaction(${index})">X</button>
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
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const text = document.getElementById("text").value;
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    transactions.push({
        text,
        amount,
        category
    });

    updateUI();
    form.reset();
});

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
const toggleBtn = document.getElementById("toggleMode");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

updateUI();
