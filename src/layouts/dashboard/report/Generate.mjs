import { Button } from "../../../components/buttons/Button.mjs";

export const Generate = new CjsComponent((data) => {
    // Funkcja ustawiająca daty na wczorajszy dzień
    const setLastDay = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);  // Ustawienie daty na dzień przed dzisiejszym (wczoraj)
        const formattedDate = yesterday.toISOString().split('T')[0]; // Formatowanie daty na 'YYYY-MM-DD'

        document.getElementById('start-date').value = formattedDate;
        document.getElementById('end-date').value = formattedDate;
    };

    // Funkcja ustawiająca daty na ostatni tydzień
    const setLastWeek = () => {
        const today = new Date();
        const lastSunday = today.getDate() - today.getDay(); // Pierwszy dzień tygodnia (niedziela)
        const startOfLastWeek = new Date(today.setDate(lastSunday - 7)); // Niedziela poprzedniego tygodnia
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Sobota poprzedniego tygodnia

        // Formatowanie daty na 'YYYY-MM-DD'
        const startFormatted = startOfLastWeek.toISOString().split('T')[0];
        const endFormatted = endOfLastWeek.toISOString().split('T')[0];

        document.getElementById('start-date').value = startFormatted;
        document.getElementById('end-date').value = endFormatted;
    };

    // Funkcja ustawiająca daty na ostatni miesiąc
    const setLastMonth = () => {
        const today = new Date();
        const lastMonth = new Date(today.setMonth(today.getMonth() - 1)); // Ustawienie daty na poprzedni miesiąc
        lastMonth.setDate(1); // Pierwszy dzień poprzedniego miesiąca

        const startFormatted = lastMonth.toISOString().split('T')[0];

        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Ostatni dzień poprzedniego miesiąca
        const endFormatted = endOfLastMonth.toISOString().split('T')[0];

        document.getElementById('start-date').value = startFormatted;
        document.getElementById('end-date').value = endFormatted;
    };

    // Funkcja generująca PDF
    const generatePDF = () => {
        const { jsPDF } = window.jspdf; // Uzyskanie dostępu do jsPDF z globalnego obiektu window

        const doc = new jsPDF();

        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        doc.text(`Raport od ${startDate} do ${endDate}`, 10, 10);
        doc.text("Tutaj wstaw zawartość raportu.", 10, 20); // Przykładowy tekst raportu

        doc.save('raport.pdf'); // Zapisanie PDF o nazwie "raport.pdf"
    };

    // HTML z przyciskami oraz formularzem
    return `
        <section class="report">
            <div class="buttons">
                ${Button.render({
                    text: "Ostatni dzień",
                    className: "range-button",
                    click: setLastDay // Funkcja setLastDay przypisuje się do eventu kliknięcia
                })}
                ${Button.render({
                    text: "Ostatni tydzień",
                    className: "range-button",
                    click: setLastWeek // Funkcja setLastWeek przypisuje się do eventu kliknięcia
                })}
                ${Button.render({
                    text: "Ostatni miesiąc",
                    className: "range-button",
                    click: setLastMonth // Funkcja setLastMonth przypisuje się do eventu kliknięcia
                })}
            </div>
            
            <div class="generate">
                <input type="date" id="start-date" class="date-picker" />
                <span> - </span>
                <input type="date" id="end-date" class="date-picker" />
            
                ${Button.render({
                    text: "Generuj raport",
                    className: "generate-button",
                    click: generatePDF // Funkcja generatePDF przypisuje się do eventu kliknięcia
                })}
            </div>
        </div>
    `;

});

Generate.importStyle('./src/layouts/dashboard/report/_styles/Generate.css');
