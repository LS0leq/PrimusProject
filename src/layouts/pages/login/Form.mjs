export const Form = new CjsComponent((data) => {


    return `
        <div class="login">
            <div class="image">
                <img src="${jpg(`forming`)}" alt="Login Image" />
            </div>

            <form>
                <h2>Admin Panel</h2>
                
                <label>
                    <p>Email</p>
                    <input type="text" name="username" placeholder="np. admin@admin.com" required>
                </label>
                
                <label>
                    <p>Hasło</p>
                    <input type="password" name="password" placeholder="np. zaq1@WSX" required>
                </label>
                
        
                <button class="submit"><img src="${svg(`login/login`)}" alt="Login Icon" /><p>Zaloguj się</p></button>
        
                <button class="language">
                    <img src="${svg(`login/england`)}" alt="English Flag" />
                </button>
            </form>
        </div>
    `;
});

Form.importStyle('./src/layouts/pages/login/_styles/Form.css');


setTimeout(function() {

    const changeLanguageBtn = document.querySelector('.language');
    const emailLabel = document.querySelector('form label:first-of-type p');
    const passwordLabel = document.querySelector('form label:nth-of-type(2) p');
    const emailInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const loginBtn = document.querySelector('.submit p');
    const languageFlag = changeLanguageBtn.querySelector('img');

    if (changeLanguageBtn  && emailLabel && passwordLabel && loginBtn && languageFlag && emailInput && passwordInput) {

        changeLanguageBtn.addEventListener('click', () => {
            if (languageFlag.src.includes('poland.svg')) {
                emailLabel.textContent = 'Wprowadź Email';
                passwordLabel.textContent = 'Wprowadź hasło';
                loginBtn.textContent = 'Zaloguj się';
                languageFlag.src = './src/assets/svg/dashboard/england.svg';
                languageFlag.alt = 'English Flag';
                emailInput.placeholder = 'np. admin@admin.com';
                passwordInput.placeholder = 'np. zaq1@WSX';
            } else {
                emailLabel.textContent = 'Enter Email';
                passwordLabel.textContent = 'Enter Password';
                loginBtn.textContent = 'Login';
                languageFlag.src = './src/assets/svg/dashboard/poland.svg';
                languageFlag.alt = 'Polish Flag';
                emailInput.placeholder = 'ex. admin@admin.com';
                passwordInput.placeholder = 'ex. zaq1@WSX';
            }
        });
    }
}, 500);
