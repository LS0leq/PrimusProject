import { Button } from "../../../components/buttons/Button.mjs";
import { EditButton } from "../../../components/buttons/EditButton.mjs";
import { DeleteButton } from "../../../components/buttons/DeleteButton.mjs";
import {DiscountsRequests} from "../../../requests/channels/DiscountsRequests.mjs";

const discountsRequests = new DiscountsRequests();
let discountData = JSON.parse(localStorage.getItem("discounts")) || [];

const Discount = new CjsComponent((data) => {
    const { code, value, expiry_on, id } = data;
    return `
        <div class="discount-box list">
            <div class="info">
                <p class="code">Kod rabatu: ${code}</p>
                <p class="value">Wartość: ${value}%</p>
                <p class="expiration">Wygasa: ${expiry_on || "Brak daty ważności"}</p>
            </div>
            <div class="actions">
                ${EditButton.render({ click: () => handleEdit(id) })}
                ${DeleteButton.render({ click: () => handleDelete(id) })}
            </div>
        </div>
    `;
});

window.handleDelete = async (id) => {


    const confirmDelete = confirm("Czy na pewno chcesz usunąć ten kod rabatowy?");
    if (!confirmDelete) return;

    try {
        const result = await discountsRequests.delete(id);
        if (result) {
            discountData = discountData.filter(d => d.id !== id);
            localStorage.setItem("discounts", JSON.stringify(discountData));
            location.reload();
        }
    } catch (error) {
        CjsNotification.error("Błąd podczas usuwania zniżki");
    }
};


const renderAddDiscountForm = () => {
    const formHtml = `
        <div class="add-form">
            <h3>Dodaj nowy kod rabatowy</h3>
            <label for="newCode">Kod:</label>
            <input type="text" id="newCode">
            <label for="newValue">Wartość (0-100):</label>
            <input type="number" id="newValue" min="0" max="100">
            <label for="newExpiration">Wygasa:</label>
            <input type="datetime-local" id="newExpiration">
            ${Button.render({ text: "Zapisz nowy kod rabatowy", click: saveNewDiscount })}
        </div>
    `;
    document.querySelector(".discounts").insertAdjacentHTML("beforeend", formHtml);
};

const saveNewDiscount = async () => {
    const newCode = document.getElementById("newCode").value;
    const newValue = document.getElementById("newValue").value;
    const newExpiration = document.getElementById("newExpiration").value;

    if (!newCode || !newValue) {
        return CjsNotification.error("Kod i wartość muszą być wypełnione.");
    }

    try {
        const newDiscountData = {
            code: newCode,
            value: newValue,
            expiry_on: newExpiration,
        };

        const result = await discountsRequests.create(newDiscountData);
        if (result) {
            discountData.push(result);
            localStorage.setItem("discounts", JSON.stringify(discountData));
            location.reload();
        }
    } catch (error) {
        CjsNotification.error("Błąd podczas tworzenia zniżki.");
    }
};

const applyDiscount = async (discountId) => {
    const discount = discountData.find(d => d.id === discountId);
    if (!discount) return CjsNotification.error("Nie znaleziono zniżki.");

    const amount = prompt("Wprowadź kwotę do zastosowania zniżki:");

    if (!amount || amount <= 0) return CjsNotification.error("Wprowadź poprawną kwotę.");

    try {
        const result = await discountsRequests.apply({ amount: Number(amount), code: discount.code });
        if (result) {
            CjsNotification.success(`Zastosowano zniżkę! Oryginalna kwota: ${result.original_amount}, Kwota po zniżce: ${result.final_amount}`);
        }
    } catch (error) {
        CjsNotification.error("Błąd podczas stosowania zniżki.");
    }
};

export const Discounts = new CjsComponent(() => {
    return `
        <div class="discounts">
            ${strmap(discountData, discount => `
                <div id="discount-${discount.id}">
                    ${Discount.render(discount)}
                    ${Button.render({ text: "Zastosuj zniżkę", click: () => applyDiscount(discount.id), className: "apply-discount" })}
                </div>
            `)}
            ${Button.render({ text: "Dodaj kod rabatowy", click: renderAddDiscountForm, className: "add-discount" })}
        </div>
    `;
});

Discounts.importStyle("./src/layouts/dashboard/discount/_styles/Discounts.css");
Discount.importStyle("./src/layouts/dashboard/_styles/List.css");
