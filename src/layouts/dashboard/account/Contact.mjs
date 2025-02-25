import { Form } from "../../../components/forms/Form.mjs";
import {UserRequests} from "../../../requests/channels/UserRequests.mjs";

export const Contact = new CjsComponent((data) => {
    const userRequests = new UserRequests();

    return Form.render({
        inputs: [
            { text: "Email", type: "email", placeholder: "kowalski@host.pl", value: "", name: "email" },
            { text: "Nr. telefonu", type: "tel", placeholder: "+48 123456789", value: "", name: "phone_number" }
        ],
        button: {
            text: "Aktualizuj",
            click: async (formData) => {
                const updateData = {
                    email: formData.email,
                    phone_number: formData.phone_number
                };

                const response = await userRequests.updateSelf(updateData);

                if (response) {
                    CjsNotification.success("Dane kontaktowe zaktualizowane!");
                } else {
                    CjsNotification.error("Nie udało się zaktualizować danych.");
                }
            }
        }
    });
});

Contact.importStyle('./src/layouts/dashboard/account/_styles/Contact.css');
