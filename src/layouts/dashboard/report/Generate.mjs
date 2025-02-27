import { Button } from "../../../components/buttons/Button.mjs";

export const Generate = new CjsComponent((data) => {
    const setLastDay = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedDate = yesterday.toISOString().split('T')[0];

        document.getElementById('start-date').value = formattedDate;
        document.getElementById('end-date').value = formattedDate;
    };

    const setLastWeek = () => {
        const today = new Date();
        const lastSunday = today.getDate() - today.getDay();
        const startOfLastWeek = new Date(today.setDate(lastSunday - 7));
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);

        const startFormatted = startOfLastWeek.toISOString().split('T')[0];
        const endFormatted = endOfLastWeek.toISOString().split('T')[0];

        document.getElementById('start-date').value = startFormatted;
        document.getElementById('end-date').value = endFormatted;
    };

    const setLastMonth = () => {
        const today = new Date();
        const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
        lastMonth.setDate(1);

        const startFormatted = lastMonth.toISOString().split('T')[0];

        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        const endFormatted = endOfLastMonth.toISOString().split('T')[0];

        document.getElementById('start-date').value = startFormatted;
        document.getElementById('end-date').value = endFormatted;
    };

    const generatePDF = () => {
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();

        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        doc.text(`Raport od ${startDate} do ${endDate}`, 10, 10);
        doc.text("Tutaj wstaw zawartość raportu.", 10, 20);

        doc.save('raport.pdf');
    };

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
                    click: generatePDF 
                })}
            </div>
        </div>
    `;

});

Generate.importStyle('./src/layouts/dashboard/report/_styles/Generate.css');
