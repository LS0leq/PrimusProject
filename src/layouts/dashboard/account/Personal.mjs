import { Form } from "../../../components/forms/Form.mjs";
import {App} from "../../../requests/App.mjs";

export const Personal = new CjsComponent((data) => {
    const { first_name, last_name, date_of_birth  } = App.users.syncSelf();

    return Form.render({
        inputs: [
            { text: "Imię", placeholder: "Jan", value: first_name, name: "first_name" },
            { text: "Nazwisko", placeholder: "Kowalski", value: last_name, name: "last_name" },
            { text: "Data urodzenia", type: "date", value: date_of_birth, name: "date_of_birth" }
        ],
        button: {
            text: "Aktualizuj",
            click: async (data) => {
                await App.users.updateSelf(data);
            }
        }
    });
});

Personal.importStyle('./src/layouts/dashboard/account/_styles/Personal.css');
