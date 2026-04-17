// wallet section elements
const $balanceDisplay = document.getElementById('balance-display');
const $moneyInput = document.getElementById('money-input');
const $moneyWarning = document.getElementById('money-warning');
const $btnReset = document.getElementById('system-reset');

// vending section elements
const $vendingSlot = document.getElementById('vending-slot');
const $statusText = document.getElementById('status-text');
const $btnAddToBag = document.getElementById('add-to-bag');
const $btnThrowAway = document.getElementById('throw-away');

// inventory section elements
const $inventoryList = document.getElementById('inventory-list');

// data displaying the money balance
let currentBalance = 5.00;
let selectedDrink = null; 
let inventory = [];
const drinks = ['Cola', 'Juice', 'Coffee', 'Energy'];

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

// render inventory (bag)
function renderInventory() {
    // reset before adding items
    $inventoryList.innerHTML = "";

    inventory.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "col-4 col-md-2 mb-4";
        
        div.innerHTML = `
            <div class="inventory-item py-4 rounded bg-white position-relative">
                <button class="delete-btn btn" data-index="${index}" style="position: absolute; top: -5px; right: 8px; width: 22px; height: 22px; font-size: 20px;">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="drink-graphic sm mx-auto">
                    <img src="images/${item.type}.JPG" alt="${item.type}" style="width: 100%; height: auto;">
                </div>
                <p class="d-block mt-2 fw-bold text-uppercase">${item.type}</p>
            </div>
        `;

        $inventoryList.appendChild(div);
    });

    // delete drinks from inventory
    document.querySelectorAll('.delete-btn').forEach($btn => {
        $btn.addEventListener('click', function() {
            const index = $btn.getAttribute('data-index');
            inventory.splice(index, 1); // remove from array
            saveInventory();
            renderInventory();
        });
    });
}

// buying drinks
document.querySelectorAll('.drink-btn').forEach($btn => {
    $btn.addEventListener('click', function() {
        const price = parseFloat($btn.getAttribute('data-price'));
        const insertedAmount = parseFloat($moneyInput.value);

        if (insertedAmount >= price) {
            currentBalance -= price;
            updateUI();
            $moneyWarning.classList.add('d-none');

            let type = $btn.getAttribute('data-name').toLowerCase();
            if (type === 'random drink') {
                type = drinks[Math.floor(Math.random() * drinks.length)];
            }

            // set current selection
            selectedDrink = { type: type };
            
            // show in vending slot
            $vendingSlot.innerHTML = `
            <div class="drink-graphic">
                <img src="images/${type}.JPG" alt="${type}" style="max-height: 100px;">
            </div>`;
            $statusText.innerText = `Dispensed: ${type}`;
            $btnAddToBag.disabled = false;
            $btnThrowAway.disabled = false;
        } else {
            $moneyWarning.classList.remove('d-none');
        }
    });
});

// adding drink to bag or throw away
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

// resets balance
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