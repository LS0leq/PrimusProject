import { Form } from "../../../components/forms/Form.mjs";
import {App} from "../../../requests/App.mjs";

export const Address = new CjsComponent((data) => {
    const {country,city,postal_code,address_line1} = App.users.syncSelf();
    return Form.render({
        inputs: [
            {text: "Państwo",placeholder: "Polska",name: "country",value: country},
            {text: "Miasto",placeholder: "Gdańsk",name: "city",value: city},
            {text: "Kod pocztowy",placeholder: "12-123",name: "postal_code",value: postal_code},
            {text: "Adres",placeholder: "Przykładowa 12",name: "address_line1",value: address_line1}
        ],
        button: {
            text: "Aktualizuj",
            click: async (data) => {
               await App.users.updateSelf(data);
            }
        }
    });

});

Address.importStyle('./src/layouts/dashboard/account/_styles/Address.css');
