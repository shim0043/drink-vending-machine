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