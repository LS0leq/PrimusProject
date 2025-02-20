export const QuestionList = new CjsComponent((data) => {
    const questions = [
        {
            title: "Jak zmienić swoje dane kontaktowe?",
            description: "Chciałbym wiedzieć, jak mogę zaktualizować swoje dane kontaktowe w systemie.",
        },
        {
            title: "Jak zresetować moje hasło?",
            description: "Nie pamiętam mojego hasła i chciałbym dowiedzieć się, jak mogę je zresetować.",
        },
        {
            title: "Gdzie mogę znaleźć dokumentację API?",
            description: "Potrzebuję dokumentacji API, aby zintegrować naszą aplikację z waszym systemem.",
        },
    ];

    return `
        <div class="question-list">
            ${questions.map((question, index) => `
                <div class="question-item" data-index="${index}">
                    <div class="question-title">
                        <strong>${question.title}</strong>
                    </div>
                    <div class="question-description">
                        <p>${question.description}</p>
                    </div>
                    <div class="actions">
                        <button class="approve-button" onclick="approveQuestion(${index})">Zatwierdź</button>
                        <button class="reject-button" onclick="rejectQuestion(${index})">Odrzuć</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
});

QuestionList.importStyle('./src/layouts/dashboard/message/_styles/QuestionList.css');
