import { Button } from "../../../components/buttons/Button.mjs";

export const GenerateRaport = new CjsComponent((data) => {
    // Funkcja generująca raport PDF
    const generatePDF = () => {
        const { jsPDF } = window.jspdf; // Uzyskanie dostępu do jsPDF z globalnego obiektu window

        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        // Sprawdzenie, czy oba pola daty są wypełnione
        if (!startDate || !endDate) {
            alert("Proszę wypełnić oba pola daty.");
            return;
        }

        // Tworzenie instancji jsPDF
        const doc = new jsPDF();

        // Dodanie tekstu do PDF
        doc.text(`Raport od ${startDate} do ${endDate}`, 10, 10);
        doc.text("Tutaj możesz dodać zawartość raportu.", 10, 20); // Dodatkowa zawartość raportu

        // Możesz tutaj dodać więcej elementów do PDF (np. tabele, wykresy, obrazy)

        // Zapisanie pliku PDF
        doc.save('raport.pdf'); // Zapisanie jako 'raport.pdf'
    };

    return `
        <section>
            <div class="picker">
                <input type="date" id="start-date" class="date-picker" />
                <span> - </span>
                <input type="date" id="end-date" class="date-picker" />
            </div>
            
            <!-- Przycisk generowania raportu -->
            <div class="buttons">
            ${Button.render({
                text: "Generuj raport",
                click: generatePDF // Funkcja wywołana po kliknięciu
            })}
                    ${Button.render({
                text: "Wygeneruj z ostatniego tygodnia",
                click: generatePDF // Funkcja wywołana po kliknięciu
            })}
        </div>
        </section>
    `;
});

GenerateRaport.importStyle('./src/layouts/dashboard/stats/_styles/GenerateRaport.css');
