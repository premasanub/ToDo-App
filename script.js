// (Clean CRUD + localStorage)


let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editId = null;

// CREATE + UPDATE
function handleSubmit() {
  const desc = document.getElementById("desc").value.trim();
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!desc || !amount) {
    alert("Please fill all fields");
    return;
  }

  if (editId) {
    transactions = transactions.map(item =>
      item.id === editId
        ? { ...item, desc, amount: +amount, type }
        : item
    );
    editId = null;
  } else {
    transactions.push({
      id: Date.now(),
      desc,
      amount: +amount,
      type
    });
  }

  saveToLocal();
  resetForm();
  render();
}

// READ
function render(filter = "all") {
  const list = document.getElementById("list");
  list.innerHTML = "";

  const filteredData = transactions.filter(item =>
    filter === "all" ? true : item.type === filter
  );

  filteredData.forEach(item => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
        <div>
          <p class="font-medium">${item.desc}</p>
          <p class="text-sm text-gray-500">₹${item.amount} • ${item.type}</p>
        </div>

        <div class="flex gap-2">
          <button onclick="editItem(${item.id})"
            class="bg-blue-500 text-white px-2 py-1 rounded">
            Edit
          </button>

          <button onclick="deleteItem(${item.id})"
            class="bg-red-500 text-white px-2 py-1 rounded">
            Delete
          </button>
        </div>
      </div>
    `;

    list.appendChild(li);
  });

  calculate();
}

// DELETE
function deleteItem(id) {
  transactions = transactions.filter(item => item.id !== id);
  saveToLocal();
  render();
}

// EDIT
function editItem(id) {
  const item = transactions.find(t => t.id === id);

  document.getElementById("desc").value = item.desc;
  document.getElementById("amount").value = item.amount;
  document.getElementById("type").value = item.type;

  editId = id;
}

// FILTER
function applyFilter() {
  const selected = document.querySelector('input[name="filter"]:checked').value;
  render(selected);
}

// CALCULATE
function calculate() {
  let income = 0;
  let expense = 0;

  transactions.forEach(item => {
    if (item.type === "income") income += item.amount;
    else expense += item.amount;
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;
}

// RESET
function resetForm() {
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("type").value = "income";
  editId = null;
}

// LOCAL STORAGE
function saveToLocal() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// INIT
render();