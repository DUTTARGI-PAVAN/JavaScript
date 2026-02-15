const form = document.getElementById("form");
const list = document.getElementById("list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateUI() {

    list.innerHTML = "";

    let total = 0;
    let inc = 0;
    let exp = 0;

    transactions.forEach((t, index) => {

        const li = document.createElement("li");
        li.innerHTML = `
            ${t.text} : ₹${t.amount}
            <button onclick="deleteTransaction(${index})">X</button>
        `;

        list.appendChild(li);

        total += Number(t.amount);

        if (t.amount > 0) inc += Number(t.amount);
        else exp += Number(t.amount);

    });

    balance.innerText = total;
    income.innerText = inc;
    expense.innerText = Math.abs(exp);

    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const text = document.getElementById("text").value;
    const amount = document.getElementById("amount").value;

    transactions.push({
        text,
        amount: Number(amount)
    });

    updateUI();
    form.reset();
});

updateUI();
