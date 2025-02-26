import { App } from "../../../requests/App.mjs";
import { EditButton } from "../../../components/buttons/EditButton.mjs";
import { DeleteButton } from "../../../components/buttons/DeleteButton.mjs";
import { IconButton } from "../../../components/buttons/IconButton.mjs";

export const List = new CjsComponent(() => {
    const users = App.users.syncUsers();
    console.log(users)

    if (!users.length) {
        App.users.getUsers().then(() => CjsNotification.info("Załadowano użytkowników!"));
    }

    return `
        <div class="users">
            <table>
                <tr>
                    <th>ID</th>
                    <th>Imię</th>
                    <th>Nazwisko</th>
                    <th>E-mail</th>
                    <th>Rola</th>
                    <th>Akcja</th>
                </tr>
                ${users.map(user => `
                    <tr id="user-${user.id}">
                        <td>${user.id}</td>
                        <td>${user.first_name}</td>
                        <td>${user.last_name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            ${EditButton.render({ click: () => handleEdit(user.id) })}
                            ${DeleteButton.render({ click: () => handleDelete(user.id) })}
                            ${IconButton.render({ icon: svg("dashboard/promote"), click: () => handlePromote(user.id) })}
                            ${IconButton.render({ icon: svg("dashboard/demote"), click: () => handleDemote(user.id) })}
                        </td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
});

List.importStyle('./src/layouts/dashboard/users/_styles/List.css');

window.handleEdit = (userId) => {
    CjsNotification.info(`Edycja użytkownika ${userId}`);
};

window.handleDelete = async (userId) => {

    const confirmDelete = confirm("Czy na pewno chcesz usunąć tego użytkownika?");
    if (!confirmDelete) return;

    try {
        const result = await App.users.deleteUser(userId);
        if (result) {
            document.getElementById(`user-${userId}`).remove();
        }
    } catch (error) {

        CjsNotification.error("Błąd podczas usuwania użytkownika.");
    }
};

window.handlePromote = async (userId) => {
    try {
        const result = await App.users.promoteUser(userId);
        if (result) {
            CjsNotification.success("Użytkownik został awansowany.");
            location.reload();
        }
    } catch (error) {
        CjsNotification.error("Błąd podczas awansowania użytkownika.");
    }
};

window.handleDemote = async (userId) => {
    try {
        const result = await App.users.demoteUser(userId);
        if (result) {
            CjsNotification.success("Użytkownik został zdegradowany.");
            location.reload();
        }
    } catch (error) {
        CjsNotification.error("Błąd podczas degradacji użytkownika.");
    }
};

List.importStyle('./src/layouts/dashboard/users/_styles/List.css');
