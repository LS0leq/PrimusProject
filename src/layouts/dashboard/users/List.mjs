import { EditButton } from "../../../components/buttons/EditButton.mjs";
import { DeleteButton } from "../../../components/buttons/DeleteButton.mjs";
import { IconButton } from "../../../components/buttons/IconButton.mjs";
import { Button } from "../../../components/buttons/Button.mjs";
import { UserRequests } from "../../../requests/channels/UserRequests.mjs";

const UserItem = new CjsComponent((data) => {
    const { id, username, email, role } = data;
    return `
        <div class="item list">
            <div class="info">
                <span class="id">ID: ${id}</span>
                <span class="name">${username}</span>
                <span class="email">${email}</span>
                <span class="role">${role}</span>
            </div>
            <div class="actions">
                ${EditButton.render({ click: () => handleEdit(id) })}
                ${DeleteButton.render({ click: () => handleDelete(id) })}
                ${IconButton.render({ icon: svg("dashboard/promote"), click: () => handlePromote(id) })}
                ${IconButton.render({ icon: svg("dashboard/demote"), click: () => handleDemote(id) })}
            </div>
        </div>
    `;
});

const Tr = new CjsComponent((data) => {
    const { id, firstname, lastname, email, role } = data;
    return `
        <tr>
            <td>${id}</td>
            <td>${firstname}</td>
            <td>${lastname}</td>
            <td>${email}</td>
            <td>${role}</td>
        </tr>
    `;
});

export const List = new CjsComponent(() => {
    const userRequests = new UserRequests();
    let userData = [];

    const loadUserData = async () => {
        userData = await userRequests.getUsers();
        renderUsers();
    };

    const renderUsers = () => {
        const userItemsHtml = strmap(userData, user => `
            <div id="user-${user.id}">
                ${UserItem.render(user)}
            </div>
        `);

        document.querySelector('.users').innerHTML = `
            <div class="users">
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>E-mail</th>
                        <th>Rola</th>
                    </tr>
                    ${userItemsHtml}
                </table>
            </div>
        `;
    };

    window.handleEdit = async (id) => {
        const user = userData.find(u => u.id === id);
        editingUser = { ...user };
        renderEditForm(editingUser, id);
    };

    window.handleDelete = async (id) => {
        const response = await userRequests.deleteUser(id);
        if (response) {
            CjsNotification.success("Użytkownik usunięty!");
            loadUserData(); // Refresh user data after deletion
        } else {
            CjsNotification.error("Nie udało się usunąć użytkownika.");
        }
    };

    window.handlePromote = async (id) => {
        const user = userData.find(u => u.id === id);
        if (user.role === 'User') {
            user.role = 'Admin';
            const response = await userRequests.updateUser(id, { role: 'Admin' });
            if (response) {
                CjsNotification.success("Użytkownik promowany na administratora.");
                loadUserData();
            }
        }
    };

    window.handleDemote = async (id) => {
        const user = userData.find(u => u.id === id);
        if (user.role === 'Admin') {
            user.role = 'User';
            const response = await userRequests.updateUser(id, { role: 'User' });
            if (response) {
                CjsNotification.success("Użytkownik zdegradowany do roli użytkownika.");
                loadUserData();
            }
        }
    };
    const renderEditForm = (user, id) => {
        const formHtml = `
            <div class="edit-form" id="edit-form-${id}">
                <h3>Edytuj użytkownika: ${user.username}</h3>
                <label for="username">Nazwa użytkownika:</label>
                <input type="text" id="username-${id}" value="${user.username}">
                <label for="email">Email:</label>
                <input type="email" id="email-${id}" value="${user.email}">
                <label for="role">Rola:</label>
                <input type="text" id="role-${id}" value="${user.role}">
                ${Button.render({ text: "Zapisz zmiany", click: () => saveChanges(id) })}
                ${IconButton.render({ icon: svg("dashboard/delete"), click: () => handleDelete(id) })}
                ${IconButton.render({ icon: svg("dashboard/promote"), click: () => handlePromote(id) })}
                ${IconButton.render({ icon: svg("dashboard/demote"), click: () => handleDemote(id) })}
            </div>
        `;
        const userBox = document.querySelector(`#user-${id}`);
        userBox.insertAdjacentHTML('beforeend', formHtml);
    };

    const saveChanges = async (id) => {
        const username = document.getElementById(`username-${id}`).value;
        const email = document.getElementById(`email-${id}`).value;
        const role = document.getElementById(`role-${id}`).value;
        const updatedUser = userData.find(u => u.id === id);
        updatedUser.username = username;
        updatedUser.email = email;
        updatedUser.role = role;

        const response = await userRequests.updateUser(id, updatedUser);

        if (response) {
            CjsNotification.success("Dane użytkownika zaktualizowane!");
            loadUserData();
        } else {
            CjsNotification.error("Nie udało się zapisać zmian.");
        }
    };

    loadUserData();

    return `
        <div class="users">
            <table>
                <tr>
                    <th>ID</th>
                    <th>Imię</th>
                    <th>Nazwisko</th>
                    <th>E-mail</th>
                    <th>Rola</th>
                </tr>
                ${strmap(userData, user => Tr.render(user))}
            </table>
        </div>
    `;
});

List.importStyle('./src/layouts/dashboard/users/_styles/List.css');
UserItem.importStyle('./src/layouts/dashboard/_styles/List.css');
