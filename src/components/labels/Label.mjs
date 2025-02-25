export const Label = new CjsComponent((data) => {
    const { text, type, name, value, placeholder } = data;

    return `
        <label>
            <p>${text}</p>
            <input type="${type}" name="${name}" value="${value}" placeholder="${placeholder}">
        </label>
    `;
});

Label.setDefaultData({
    text: "Example",
    type: "text",
    name: "example",
    value: "",
    placeholder: "Example"
});

Label.importStyle('./src/components/labels/_styles/Label.css');