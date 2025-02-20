export const SettingsForm = new CjsComponent(() => {
    return `
        <div class="container">

            <div class="section">
                <h3>Dane osobowe</h3>
                <div class="field">
                    <label for="username">Imię i nazwisko:</label>
                    <input type="text" id="username" name="username" value="Jan Kowalski" required>
                </div>
                <div class="field">
                    <label for="birthdate">Data urodzenia:</label>
                    <input type="date" id="birthdate" name="birthdate" value="1990-01-01" required>
                </div>
                <div class="field">
                    <label for="gender">Płeć:</label>
                    <select id="gender" name="gender">
                        <option value="Mężczyzna" selected>Mężczyzna</option>
                        <option value="Kobieta">Kobieta</option>
                    </select>
                </div>
            </div>

            <div class="section">
                <h3>Dane adresowe</h3>
                <div class="field">
                    <label for="address">Linia adresu:</label>
                    <input type="text" id="address" name="address" value="ul. Przykładowa 1" required>
                </div>
                <div class="field">
                    <label for="country">Państwo:</label>
                    <input type="text" id="country" name="country" value="Polska" required>
                </div>
                <div class="field">
                    <label for="postalcode">Kod pocztowy:</label>
                    <input type="text" id="postalcode" name="postalcode" value="00-001" required>
                </div>
            </div>

            <div class="section">
                <h3>Dane kontaktowe</h3>
                <div class="field">
                    <label for="phone">Telefon:</label>
                    <input type="tel" id="phone" name="phone" value="123456789" required>
                </div>
                <div class="field">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="jan.kowalski@example.com" required>
                </div>
            </div>

            <div class="section">
                <h3>Dane logowania</h3>
                <div class="field">
                    <label for="login-email">Email:</label>
                    <input type="email" id="login-email" name="login-email" value="jan.kowalski@example.com" required>
                </div>
               <div class="field">
                    <label for="password">Hasło:</label>
                    <input type="password" id="password" name="password" value="defaultpassword123" required>
                </div>
            </div>

            <div class="button-container">
                <button class="save-button" type="submit">Zapisz zmiany</button>
                <button class="cancel-button" type="button" onclick="window.location.reload();">Anuluj</button>
            </div>
        </div>
    `;
});

SettingsForm.importStyle('./src/layouts/dashboard/account/_styles/SettingsForm.css');
