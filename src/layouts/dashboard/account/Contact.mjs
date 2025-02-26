import { Form } from "../../../components/forms/Form.mjs";
import {App} from "../../../requests/App.mjs";

export const Contact = new CjsComponent((data) => {
    const { email,phone_number } = App.users.syncSelf();
    return Form.render({
        inputs: [
            { text: "Email", type: "email", placeholder: "kowalski@host.pl", value: email, name: "email" },
            { text: "Nr. telefonu", type: "tel", placeholder: "+48 123456789", value: phone_number, name: "phone_number" }
        ],
        button: {
            text: "Aktualizuj",
            click: async (data) => {
                await App.users.updateSelf(data);
            }
        }
    });
});

Contact.importStyle('./src/layouts/dashboard/account/_styles/Contact.css');
