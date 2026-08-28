// ==========================================
// TASK & EXPENSE TRACKER
// ==========================================


// Store all items
let items = [];


// Store the ID of the item currently being edited
let editId = null;


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const itemForm = document.getElementById("itemForm");

const itemName = document.getElementById("itemName");

const itemAmount = document.getElementById("itemAmount");

const itemType = document.getElementById("itemType");

const expenseCategory = document.getElementById("expenseCategory");

const submitBtn = document.getElementById("submitBtn");

const searchInput = document.getElementById("searchInput");

const filterType = document.getElementById("filterType");

const itemList = document.getElementById("itemList");

const totalItems = document.getElementById("totalItems");

const totalExpense = document.getElementById("totalExpense");


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

window.onload = () => {

    loadItems();

    displayItems();

};


// ==========================================
// ADD / EDIT ITEM
// ==========================================

itemForm.addEventListener("submit", (event) => {

    // Prevent page refresh
    event.preventDefault();


    // Get input values
    const name = itemName.value.trim();

    const amount = Number(itemAmount.value);

    const type = itemType.value;

    const category = expenseCategory.value;


    // Validate name
    if (name === "") {

        alert("Please enter a task or expense.");

        return;
    }


    // Validate amount
    if (isNaN(amount) || amount < 0) {

        alert("Please enter a valid amount.");

        return;
    }


    // ======================================
    // EDIT EXISTING ITEM
    // ======================================

    if (editId !== null) {

        const item = items.find((item) => item.id === editId);


        if (item) {

            item.name = name;

            item.amount = amount;

            item.type = type;

            item.category = category;

        }


        editId = null;

        submitBtn.innerText = "Add Item";

    }


    // ======================================
    // ADD NEW ITEM
    // ======================================

    else {

        const newItem = {

            id: Date.now(),

            name: name,

            amount: amount,

            type: type,

            category: category,

            completed: false

        };


        items.push(newItem);

    }


    // Save data
    saveItems();


    // Display items
    displayItems();


    // Clear form
    itemForm.reset();

});


// ==========================================
// DISPLAY ITEMS
// ==========================================

function displayItems() {

    const searchText =
        searchInput.value.toLowerCase();


    const selectedFilter =
        filterType.value;


    // Filter items based on search and filter
    const filteredItems = items.filter((item) => {

        const matchesSearch =
            item.name.toLowerCase().includes(searchText);


        let matchesFilter = true;


        if (selectedFilter === "task") {

            matchesFilter =
                item.type === "task";

        }


        else if (selectedFilter === "expense") {

            matchesFilter =
                item.type === "expense";

        }


        else if (selectedFilter === "completed") {

            matchesFilter =
                item.completed === true;

        }


        return matchesSearch && matchesFilter;

    });


    // Clear previous items
    itemList.innerHTML = "";


    // Show message if no items
    if (filteredItems.length === 0) {

        itemList.innerHTML =
            `<p class="empty-message">No items found.</p>`;

        updateSummary();

        return;

    }


    // Create item cards
    filteredItems.forEach((item) => {

        const itemDiv =
            document.createElement("div");


        itemDiv.classList.add("item");


        const completedClass =
            item.completed ? "completed" : "";


        // Show category only for expenses
        const categoryText =
            item.type === "expense"
                ? `Category: ${item.category}`
                : "Category: Task";


        itemDiv.innerHTML = `

            <div class="item-info">

                <h3 class="${completedClass}">
                    ${item.name}
                </h3>

                <p>
                    Type: ${item.type}
                </p>

                <p>
                    ${categoryText}
                </p>

                <p>
                    Amount: ₹${item.amount}
                </p>

            </div>


            <div class="item-actions">

                <button
                    class="complete-btn"
                    onclick="toggleComplete(${item.id})">

                    ${item.completed ? "Undo" : "Complete"}

                </button>


                <button
                    class="edit-btn"
                    onclick="editItem(${item.id})">

                    Edit

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteItem(${item.id})">

                    Delete

                </button>

            </div>

        `;


        itemList.appendChild(itemDiv);

    });


    updateSummary();

}


// ==========================================
// EDIT ITEM
// ==========================================

function editItem(id) {

    const item =
        items.find((item) => item.id === id);


    if (!item) {

        return;

    }


    // Put existing values into form
    itemName.value = item.name;

    itemAmount.value = item.amount;

    itemType.value = item.type;

    expenseCategory.value = item.category;


    // Store ID being edited
    editId = id;


    // Change button text
    submitBtn.innerText = "Update Item";


    // Move cursor to name input
    itemName.focus();

}


// ==========================================
// MARK COMPLETE / UNDO
// ==========================================

function toggleComplete(id) {

    const item =
        items.find((item) => item.id === id);


    if (item) {

        item.completed = !item.completed;

    }


    saveItems();

    displayItems();

}


// ==========================================
// DELETE ITEM
// ==========================================

function deleteItem(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this item?");


    if (!confirmDelete) {

        return;

    }


    items =
        items.filter((item) => item.id !== id);


    saveItems();

    displayItems();

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener("input", () => {

    displayItems();

});


// ==========================================
// FILTER
// ==========================================

filterType.addEventListener("change", () => {

    displayItems();

});


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    // Total number of items
    totalItems.innerText = items.length;


    // Calculate total expenses
    const expenseTotal = items

        .filter((item) => item.type === "expense")

        .reduce((total, item) => {

            return total + item.amount;

        }, 0);


    totalExpense.innerText =
        expenseTotal;

}


// ==========================================
// SAVE DATA
// ==========================================

function saveItems() {

    localStorage.setItem(

        "taskExpenseItems",

        JSON.stringify(items)

    );

}


// ==========================================
// LOAD DATA
// ==========================================

function loadItems() {

    const savedItems =
        localStorage.getItem("taskExpenseItems");


    if (savedItems) {

        items = JSON.parse(savedItems);

    }

}