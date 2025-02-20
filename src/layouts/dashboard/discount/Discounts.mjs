const Discount = new CjsComponent((data, onEdit) => {
    const { code, uses, expiration, editIcon, deleteIcon, id } = data;

    return `
        <div class="discount-box">
            <div class="info">
                <p class="code">Kod rabatu: ${code}</p>
                <p class="uses">Użycia: ${uses}</p>
                <p class="expiration">Wygasa: ${expiration}</p>
            </div>
            <div class="actions">
                <img src="${editIcon}" alt="Edytuj" onclick="handleEdit(${id})">
                <img src="${deleteIcon}" alt="Usuń" onclick="handleDelete(${id})">
            </div>
        </div>
    `;
});

export const Discounts = new CjsComponent(() => {
    let discountData = JSON.parse(localStorage.getItem('discounts')) || [];
    let editingDiscount = null;

    window.handleEdit = (id) => {
        const discount = discountData.find(d => d.id === id);
        editingDiscount = { ...discount };
        renderEditForm(editingDiscount, id);
    };

    window.handleDelete = (id) => {
        discountData = discountData.filter(d => d.id !== id);
        localStorage.setItem('discounts', JSON.stringify(discountData));
        location.reload();
    };

    const renderEditForm = (discount, id) => {
        const formHtml = `
            <div class="edit-form" id="edit-form-${id}">
                <h3>Edytuj kod rabatowy: ${discount.code}</h3>
                <label for="code">Kod:</label>
                <input type="text" id="code-${id}" value="${discount.code}">
                <label for="uses">Użycia:</label>
                <input type="number" id="uses-${id}" value="${discount.uses}">
                <label for="expiration">Wygasa:</label>
                <input type="date" id="expiration-${id}" value="${discount.expiration}">
                <button id="saveChangesButton-${id}">Zapisz zmiany</button>
            </div>
        `;
        const discountBox = document.querySelector(`#discount-${id}`);
        discountBox.insertAdjacentHTML('beforeend', formHtml);
        document.getElementById(`saveChangesButton-${id}`).addEventListener('click', () => saveChanges(id));
    };

    const saveChanges = (id) => {
        const code = document.getElementById(`code-${id}`).value;
        const uses = document.getElementById(`uses-${id}`).value;
        const expiration = document.getElementById(`expiration-${id}`).value;
        const updatedDiscount = discountData.find(d => d.id === id);
        updatedDiscount.code = code;
        updatedDiscount.uses = uses;
        updatedDiscount.expiration = expiration;
        localStorage.setItem('discounts', JSON.stringify(discountData));
        location.reload();
    };

    const renderDiscounts = () => {
        return `
            <div class="discounts">
                ${discountData.map(discount => {
            return `
                        <div id="discount-${discount.id}">
                            ${Discount.render(discount, handleEdit)}
                        </div>
                    `;
        }).join('')}
                <button id="addDiscountButton" class="add-discount">Dodaj kod rabatowy</button>
            </div>
        `;
    };

    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'addDiscountButton') {
            renderAddDiscountForm();
        }
    });

    const renderAddDiscountForm = () => {
        const formHtml = `
            <div class="add-form">
                <h3>Dodaj nowy kod rabatowy</h3>
                <label for="newCode">Kod:</label>
                <input type="text" id="newCode">
                <label for="newUses">Użycia:</label>
                <input type="number" id="newUses">
                <label for="newExpiration">Wygasa:</label>
                <input type="date" id="newExpiration">
                <button id="saveNewDiscountButton">Zapisz nowy kod rabatowy</button>
            </div>
        `;
        document.querySelector('.discounts').insertAdjacentHTML('beforeend', formHtml);
        document.getElementById('saveNewDiscountButton').addEventListener('click', saveNewDiscount);
    };

    const saveNewDiscount = () => {
        const newCode = document.getElementById('newCode').value;
        const newUses = document.getElementById('newUses').value;
        const newExpiration = document.getElementById('newExpiration').value;
        const newId = Math.max(...discountData.map(d => d.id), 0) + 1;
        const newDiscount = { id: newId, code: newCode, uses: newUses, expiration: newExpiration, editIcon: './src/assets/svg/dashboard/edit.svg', deleteIcon: './src/assets/svg/dashboard/delete.svg' };
        discountData.push(newDiscount);
        localStorage.setItem('discounts', JSON.stringify(discountData));
        Search.set("/dashboard/discount");
        location.reload();
    };

    return renderDiscounts();
});

Discounts.importStyle('./src/layouts/dashboard/discount/_styles/Discounts.css');
