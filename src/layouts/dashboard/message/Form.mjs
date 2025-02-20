export const Form = new CjsComponent((data) => {
    return `
        <form class="faq-form">
            <div class="section">
                <label for="title">Tytuł pytania:</label>
                <input type="text" class="title" name="question-title" placeholder="Wpisz tytuł pytania" required />
            </div>

            <div class="section">
                <label for="text">Odpowiedź:</label>
                <textarea class="answer-text" name="answer-text" placeholder="Wpisz odpowiedź" required></textarea>
            </div>

            <div class="actions">
                <button type="submit" class="submit-button">Zapisz</button>
            </div>
        </form>
    `;
});

Form.importStyle('./src/layouts/dashboard/message/_styles/Form.css');
