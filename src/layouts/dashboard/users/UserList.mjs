import { EditButton } from "../../../components/buttons/EditButton.mjs";
import { DeleteButton } from "../../../components/buttons/DeleteButton.mjs";
import {IconButton} from "../../../components/buttons/IconButton.mjs";
import {Button} from "../../../components/buttons/Button.mjs";

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
                ${IconButton.render({ icon: svg("dashboard/promote"),click: () => handlePromote(id) })}
                ${IconButton.render({ icon: svg("dashboard/demote"),click: () => handleDemote(id) })}
            </div>
        </div>
    `;
});

export const UserList = new CjsComponent(() => {
    let userData = JSON.parse(localStorage.getItem('users')) || generateUsers();

    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(userData));
    }

    let editingUser = null;

    window.handleEdit = (id) => {
        const user = userData.find(u => u.id === id);
        editingUser = { ...user };
        renderEditForm(editingUser, id);
    };

    window.handleDelete = (id) => {
        userData = userData.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(userData));
        location.reload();
    };

    window.handlePromote = (id) => {
        const user = userData.find(u => u.id === id);
        if (user.role === 'User') {
            user.role = 'Admin';
        }
        localStorage.setItem('users', JSON.stringify(userData));
        location.reload();
    };

    window.handleDemote = (id) => {
        const user = userData.find(u => u.id === id);
        if (user.role === 'Admin') {
            user.role = 'User';
        }
        localStorage.setItem('users', JSON.stringify(userData));
        location.reload();
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
            </div>
        `;
        const userBox = document.querySelector(`#user-${id}`);
        userBox.insertAdjacentHTML('beforeend', formHtml);
        document.getElementById(`saveChangesButton-${id}`).addEventListener('click', () => saveChanges(id));
    };

    const saveChanges = (id) => {
        const username = document.getElementById(`username-${id}`).value;
        const email = document.getElementById(`email-${id}`).value;
        const role = document.getElementById(`role-${id}`).value;
        const updatedUser = userData.find(u => u.id === id);
        updatedUser.username = username;
        updatedUser.email = email;
        updatedUser.role = role;
        localStorage.setItem('users', JSON.stringify(userData));
        location.reload();
    };

    function generateUsers() {
        let users = [];
        for (let i = 1; i <= 100; i++) {
            users.push({
                id: i,
                username: `User${i}`,
                email: `user${i}@example.com`,
                role: i % 2 === 0 ? 'Admin' : 'User',
            });
        }
        return users;
    }

    return `
    <div class="users">
        ${strmap(userData, user => `
        <div id="user-${user.id}">
            ${UserItem.render(user)}
        </div>
        `)}
    </div>
`;

});

UserList.importStyle('./src/layouts/dashboard/users/_styles/UserList.css');
UserItem.importStyle('./src/layouts/dashboard/_styles/List.css');
