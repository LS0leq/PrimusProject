import { App } from "../../../requests/App.mjs";
import { EditButton } from "../../../components/buttons/EditButton.mjs";
import { DeleteButton } from "../../../components/buttons/DeleteButton.mjs";
import { IconButton } from "../../../components/buttons/IconButton.mjs";

export const List = new CjsComponent(() => {
    const users = App.users.syncUsers();

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
                            ${DeleteButton.render({ click: () => handleDeleteUser(user.id) })}
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
    const existingForm = document.getElementById(`edit-form-${userId}`);
    if (existingForm) {
        existingForm.remove();
        return;
    }

    const users = App.users.syncUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
        CjsNotification.error("Nie znaleziono użytkownika.");
        return;
    }

    const formHtml = `
        <tr id="edit-form-${userId}" class="edit-row">
            <td colspan="6">
                <form id="form-${userId}" class="edit-form">
                    <input type="text" name="first_name" value="${user.first_name}" placeholder="Imię" required />
                    <input type="text" name="last_name" value="${user.last_name}" placeholder="Nazwisko" required />
                    <input type="email" name="email" value="${user.email}" placeholder="E-mail" required />
                    
                    <button type="submit">Zapisz</button>
                    <button type="button" onclick="handleCancel(${userId})">Anuluj</button>
                </form>
            </td>
        </tr>
    `;

    document.getElementById(`user-${userId}`).insertAdjacentHTML("afterend", formHtml);

    document.getElementById(`form-${userId}`).addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updateData = Object.fromEntries(formData);

        try {
            const result = await App.users.updateUser(userId, updateData);
            if (result) {
                CjsNotification.success("Dane użytkownika zaktualizowane.");

                let updatedUsers = App.users.syncUsers().map(user =>
                    user.id === userId ? { ...user, ...updateData } : user
                );
                AppCache.set("users", updatedUsers);

                document.querySelector(`#user-${userId} td:nth-child(2)`).textContent = updateData.first_name;
                document.querySelector(`#user-${userId} td:nth-child(3)`).textContent = updateData.last_name;
                document.querySelector(`#user-${userId} td:nth-child(4)`).textContent = updateData.email;

                document.getElementById(`edit-form-${userId}`).remove();
            }
        } catch (error) {
            CjsNotification.error("Błąd podczas aktualizacji użytkownika.");
        }
    });
};

window.handleCancel = (userId) => {
    document.getElementById(`edit-form-${userId}`).remove();
};


window.handleDeleteUser = async (userId) => {

    const confirmDeleteUser = confirm("Czy na pewno chcesz usunąć tego użytkownika?");
    if (!confirmDeleteUser) return;

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
        const updateData = { role: "admin" };
        const result = await App.users.updateUser(userId, updateData);

        if (result) {
            CjsNotification.success("Użytkownik został awansowany do administratora.");
            // location.reload();
        }
    } catch (error) {
        CjsNotification.error("Błąd podczas aktualizacji roli użytkownika.");
    }
};


window.handleDemote = async (userId) => {
    try {
        const updateData = { role: "client" };
        const result = await App.users.updateUser(userId, updateData);

        if (result) {
            CjsNotification.success("Użytkownik został zdegradowany do klienta.");
            // location.reload();
        }
    } catch (error) {
        CjsNotification.error("Błąd podczas aktualizacji roli użytkownika.");
    }
};

List.importStyle('./src/layouts/dashboard/users/_styles/List.css');
