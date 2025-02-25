import { Form } from "../../../components/forms/Form.mjs";
import {UserRequests} from "../../../requests/channels/UserRequests.mjs";

export const Address = new CjsComponent((data) => {
    const userRequests = new UserRequests();

    return Form.render({
        inputs: [
            { text: "Państwo", placeholder: "Polska", name: "country", value: "" },
            [
                { text: "Miasto", placeholder: "Gdańsk", name: "city", value: "" },
                { text: "Kod pocztowy", placeholder: "30-125", name: "postal_code", value: "" },
            ],
            { text: "Adres", placeholder: "ul. Przykładowa 14C / 4", name: "address_line1", value: "" }
        ],
        button: {
            text: "Aktualizuj",
            click: async (formData) => {
                const updateData = {
                    country: formData.country,
                    city: formData.city,
                    postal_code: formData.postal_code,
                    address_line1: formData.address_line1,
                };

                const response = await userRequests.updateSelf(updateData);

                if (response) {
                    CjsNotification.success("Adres zaktualizowany!");
                } else {
                    CjsNotification.error("Nie udało się zaktualizować adresu.");
                }
            }
        }
    });
});

Address.importStyle('./src/layouts/dashboard/account/_styles/Address.css');
