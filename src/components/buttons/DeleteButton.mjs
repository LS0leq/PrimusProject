export const DeleteButton = new CjsComponent((data) => {
    const { click } = data;

    return `
        <button class="delete-button" ${onClick(click)}>
            <img src="/src/assets/svg/dashboard/delete.svg" alt="Edytuj">
        </button>
    `;
});

DeleteButton.setDefaultData({
    click: () => {}
});

DeleteButton.importStyle('./src/components/buttons/_styles/DeleteButton.css');
