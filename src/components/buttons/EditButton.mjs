export const EditButton = new CjsComponent(({ click }) => {
    return `
        <button class="edit-button" ${onClick(click)}>
            <img src="/src/assets/svg/dashboard/edit.svg" alt="Edytuj">
        </button>
    `;
});

EditButton.setDefaultData({
    click: () => {}
});

EditButton.importStyle('./src/components/buttons/_styles/EditButton.css');
