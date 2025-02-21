import { Button } from "../../../components/buttons/Button.mjs";

export const SettingsForm = new CjsComponent(() => {
    // Odczytaj dane z localStorage
    const userData = {
        username: localStorage.getItem('username') || 'Jan Kowalski',
        birthdate: localStorage.getItem('birthdate') || '1990-01-01',
        gender: localStorage.getItem('gender') || 'Mężczyzna',
        address: localStorage.getItem('address') || 'ul. Przykładowa 1',
        country: localStorage.getItem('country') || 'Polska',
        postalcode: localStorage.getItem('postalcode') || '00-001',
        phone: localStorage.getItem('phone') || '123456789',
        email: localStorage.getItem('email') || 'jan.kowalski@example.com',
        loginEmail: localStorage.getItem('login-email') || 'jan.kowalski@example.com',
        password: localStorage.getItem('password') || 'defaultpassword123'
    };

    // Funkcja zapisująca dane do localStorage
    const saveData = () => {
        const formData = {
            username: document.getElementById('username').value,
            birthdate: document.getElementById('birthdate').value,
            gender: document.getElementById('gender').value,
            address: document.getElementById('address').value,
            country: document.getElementById('country').value,
            postalcode: document.getElementById('postalcode').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            loginEmail: document.getElementById('login-email').value,
            password: document.getElementById('password').value
        };

        Object.keys(formData).forEach(key => {
            localStorage.setItem(key, formData[key]);
        });
        location.reload();
        alert('Zmiany zapisane!');
    };

    return `
        <div class="container">

            <div class="section">
                <h3>Dane osobowe</h3>
                <div class="field">
                    <label for="username">Imię i nazwisko:</label>
                    <input type="text" id="username" name="username" value="${userData.username}" required>
                </div>
                <div class="field">
                    <label for="birthdate">Data urodzenia:</label>
                    <input type="date" id="birthdate" name="birthdate" value="${userData.birthdate}" required>
                </div>
                <div class="field">
                    <label for="gender">Płeć:</label>
                    <select id="gender" name="gender">
                        <option value="Mężczyzna" ${userData.gender === 'Mężczyzna' ? 'selected' : ''}>Mężczyzna</option>
                        <option value="Kobieta" ${userData.gender === 'Kobieta' ? 'selected' : ''}>Kobieta</option>
                    </select>
                </div>
            </div>

            <div class="section">
                <h3>Dane adresowe</h3>
                <div class="field">
                    <label for="address">Linia adresu:</label>
                    <input type="text" id="address" name="address" value="${userData.address}" required>
                </div>
                <div class="field">
                    <label for="country">Państwo:</label>
                    <input type="text" id="country" name="country" value="${userData.country}" required>
                </div>
                <div class="field">
                    <label for="postalcode">Kod pocztowy:</label>
                    <input type="text" id="postalcode" name="postalcode" value="${userData.postalcode}" required>
                </div>
            </div>

            <div class="section">
                <h3>Dane kontaktowe</h3>
                <div class="field">
                    <label for="phone">Telefon:</label>
                    <input type="tel" id="phone" name="phone" value="${userData.phone}" required>
                </div>
                <div class="field">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${userData.email}" required>
                </div>
            </div>

            <div class="section">
                <h3>Dane logowania</h3>
                <div class="field">
                    <label for="login-email">Email:</label>
                    <input type="email" id="login-email" name="login-email" value="${userData.loginEmail}" required>
                </div>
               <div class="field">
                    <label for="password">Hasło:</label>
                    <input type="password" id="password" name="password" value="${userData.password}" required>
                </div>
            </div>

            <div class="button-container">
                ${Button.render({text: "Zapisz zmiany", click: saveData})}
            </div>
        </div>
    `;
});

SettingsForm.importStyle('./src/layouts/dashboard/account/_styles/SettingsForm.css');
