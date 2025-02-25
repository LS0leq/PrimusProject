import {Button} from "../buttons/Button.mjs";

const Label = new CjsComponent((data) => {
    const { text, type, placeholder, value, name } = data;

    return `
        <label>
            <p>${text}</p>
            <input type="${type}" placeholder="${placeholder}" value="${value}" name="${name}">
        </label>
    `;
});

export const Form = new CjsComponent((data) => {
    const { inputs, button } = data;

    const click = createHandle((e) => {
        const data = Form.toForms(e.component)[0].serialize();

        button.click(data);
    });

    return `
        <form onsubmit="event.preventDefault();">
            ${strmap(inputs, e => Array.isArray(e) 
                ? `<div class="row">${strmap(e, e2 => Label.render(e2))}</div>` 
                : Label.render(e))
            }
            <button ripple ${onClick(click)}>${button.text}</button>
        </form>
    `;
});

Form.setDefaultData({
    inputs: [], // 1d or 2d array of labels
    button: {
        text: "Example",
        click: (data) => {}
    }
});

Label.setDefaultData({
    text: "Example",
    type: "text",
    placeholder: "Example",
    value: "",
    name: "example"
});

Label.importStyle('./src/components/forms/_styles/Form.css');
Form.importStyle('./src/components/forms/_styles/Form.css');