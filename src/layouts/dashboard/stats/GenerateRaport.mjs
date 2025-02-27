import { Button } from "../../../components/buttons/Button.mjs";

export const GenerateRaport = new CjsComponent((data) => {
    const generatePDF = () => {
        const { jsPDF } = window.jspdf;

        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (!startDate || !endDate) {
            alert("Proszę wypełnić oba pola daty.");
            return;
        }

        const doc = new jsPDF();

        doc.text(`Raport od ${startDate} do ${endDate}`, 10, 10);
        doc.text("Tutaj możesz dodać zawartość raportu.", 10, 20);


        doc.save('raport.pdf');
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

    return `
        <section>
            <div class="picker">
                <input type="date" id="start-date" class="date-picker" />
                <span> - </span>
                <input type="date" id="end-date" class="date-picker" />
            </div>
            
            <div class="buttons">
            ${Button.render({
                text: "Generuj raport",
                click: generatePDF 
            })}
                    ${Button.render({
                text: "Wygeneruj z ostatniego tygodnia",
                click: setLastWeek 
            })}
        </div>
        </section>
    `;
});

GenerateRaport.importStyle('./src/layouts/dashboard/stats/_styles/GenerateRaport.css');
