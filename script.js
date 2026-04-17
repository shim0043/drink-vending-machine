const $balanceDisplay = document.getElementById('balance-display');
const $moneyInput = document.getElementById('money-input');
const $moneyWarning = document.getElementById('money-warning');

const $vendingSlot = document.getElementById('vending-slot');
const $statusText = document.getElementById('status-text');
const $inventoryList = document.getElementById('inventory-list');

const $btnAddToBag = document.getElementById('add-to-bag');
const $btnThrowAway = document.getElementById('throw-away');
const $btnReset = document.getElementById('system-reset');

// data displaying the money balance
let currentBalance = 5.00;
let selectedDrink = null; 
let inventory = [];
const realDrinks = ['cola', 'juice', 'coffee', 'energy'];

// loads from local storage
const inventoryLS = JSON.parse(localStorage.getItem('inventory'));
if (inventoryLS) {
    inventory = inventoryLS;
}

// save to local storage
function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// updates ui
function updateUI() {
    $balanceDisplay.innerText = `$${currentBalance.toFixed(2)}`;
}

// render inventory
function renderInventory() {
    // reset before adding items
    $inventoryList.innerHTML = "";

    inventory.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "col text-center mb-3";
        
        div.innerHTML = `
            <div class="inventory-item p-3 border rounded bg-white shadow-sm position-relative">
                <div class="drink-graphic sm ${item.type} mx-auto"></div>
                <small class="d-block mt-2">${item.type}</small>
                <button class="btn btn-sm btn-outline-danger mt-2 delete-btn" data-index="${index}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        $inventoryList.appendChild(div);
    });

    // add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach($btn => {
        $btn.addEventListener('click', function() {
            const index = $btn.getAttribute('data-index');
            inventory.splice(index, 1); // remove from array
            saveInventory();
            renderInventory();
        });
    });
}

// buying drink
document.querySelectorAll('.drink-btn').forEach($btn => {
    $btn.addEventListener('click', function() {
        const price = parseFloat($btn.getAttribute('data-price'));
        const insertedAmount = parseFloat($moneyInput.value);

        if (insertedAmount >= price) {
            currentBalance -= price;
            updateUI();
            $moneyWarning.classList.add('d-none');
            $moneyInput.value = '';

            let type = $btn.getAttribute('data-name').toLowerCase();
            if (type === 'random drink') {
                type = realDrinks[Math.floor(Math.random() * realDrinks.length)];
            }

            // set current selection
            selectedDrink = { type: type };
            
            // show in vending slot
            $vendingSlot.innerHTML = `
            <div class="drink-graphic">
                <img src="images/${type}.JPG" alt="${type}" style="max-height: 100px;">
            </div>`;
            $statusText.innerText = `Dispensed: ${type}!`;
            $btnAddToBag.disabled = false;
            $btnThrowAway.disabled = false;
        } else {
            $moneyWarning.classList.remove('d-none');
        }
    });
});

// adding drink to bag
$btnAddToBag.addEventListener('click', function () {
    if (!selectedDrink) return;
    // adds to array list
    inventory.push(selectedDrink);

    saveInventory();
    renderInventory();

    // reset slot
    selectedDrink = null;
    $vendingSlot.innerHTML = '<span>Empty</span>';
    $btnAddToBag.disabled = true;
    $btnThrowAway.disabled = true;
});

$btnThrowAway.addEventListener('click', function() {
    selectedDrink = null;
    $vendingSlot.innerHTML = '<span>Empty</span>';
    $btnAddToBag.disabled = true;
    $btnThrowAway.disabled = true;
});

$btnReset.addEventListener('click', function () {
    currentBalance = 5.00;
    inventory = [];
    saveInventory();
    renderInventory();
    updateUI();
});

// initializing
updateUI();
renderInventory();