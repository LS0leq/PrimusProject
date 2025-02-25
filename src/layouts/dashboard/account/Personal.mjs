import { Form } from "../../../components/forms/Form.mjs";
import { UserRequests } from "../../../requests/channels/UserRequests.mjs";

export const Personal = new CjsComponent(async (data) => {
    const userRequests = new UserRequests();
    const userData = await userRequests.getUserData();

    return Form.render({
        inputs: [
            { text: "Imię", placeholder: "Jan", value: userData.first_name || "", name: "first_name" },
            { text: "Nazwisko", placeholder: "Kowalski", value: userData.last_name || "", name: "last_name" },
            { text: "Data urodzenia", type: "date", value: userData.birth_date || "", name: "birth_date" }
        ],
        button: {
            text: "Aktualizuj",
            click: async (formData) => {
                const updateData = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    birth_date: formData.birth_date
                };

                const response = await userRequests.updateSelf(updateData);

                if (response) {
                    CjsNotification.success("Dane osobowe zaktualizowane!");
                } else {
                    CjsNotification.error("Nie udało się zaktualizować danych.");
                }
            }
        }
    });
});

Personal.importStyle('./src/layouts/dashboard/account/_styles/Personal.css');
