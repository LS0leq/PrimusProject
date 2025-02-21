export const IconButton = new CjsComponent((data) => {
    const { icon, click } = data;

    return `
        <button class="icon-button" ${onClick(click)}>
            <img src="${icon}" alt="Ikona">
        </button>
    `;
});

IconButton.setDefaultData({
    icon: "",
    click: () => {}
});

IconButton.importStyle('./src/components/buttons/_styles/IconButton.css');
