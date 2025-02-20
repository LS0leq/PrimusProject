export const FAQList = new CjsComponent((data) => {
    const questions = [
        {
            title: "Jak zmienić moje hasło?",
            answer: "Aby zmienić hasło, przejdź do ustawień konta i kliknij 'Zmień hasło'.",
            approvedAnswer: "Aby zmienić hasło, przejdź do ustawień konta i kliknij 'Zmień hasło'."
        },
        {
            title: "Jak zresetować swoje hasło?",
            answer: "Możesz zresetować swoje hasło, klikając w link 'Nie pamiętam hasła' na stronie logowania.",
            approvedAnswer: "Możesz zresetować swoje hasło, klikając w link 'Nie pamiętam hasła' na stronie logowania."
        },
        {
            title: "Gdzie mogę zmienić moje dane kontaktowe?",
            answer: "Dane kontaktowe można zmienić w sekcji ustawień konta.",
            approvedAnswer: "Dane kontaktowe można zmienić w sekcji ustawień konta."
        }
    ];

    return `
        <div class="faq-list">
            ${questions.map((question, index) => `
                <div class="item" data-index="${index}">
                    <div class="question">
                        <input type="text" class="title" value="${question.title}" />
                    </div>

                    <div class="-preview">
                        <h3>Odpowiedź zatwierdzona przez admina:</h3>
                        <p>${question.approvedAnswer}</p>
                    </div>

                    <div class="edit">
                        <textarea class="answer-text">${question.answer}</textarea>
                    </div>

                    <div class="actions">
                        <button class="save" onclick="saveFAQ(${index})">Zapisz</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
});

FAQList.importStyle('./src/layouts/dashboard/message/_styles/FAQList.css');
