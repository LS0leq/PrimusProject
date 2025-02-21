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
        <div class="generate-raport">
            <div>
                <!-- <label for="start-date">Od:</label> -->
                <input type="date" id="start-date" class="date-picker" />
            </div>
            <span> - </span>
            <div>
                <!-- <label for="end-date">Do:</label> -->
                <input type="date" id="end-date" class="date-picker" />
            </div>
            
            <!-- Przycisk generowania raportu -->
            ${Button.render({
        text: "Generuj raport",
        click: generatePDF // Funkcja wywołana po kliknięciu
    })}
        </div>
    `;
});

GenerateRaport.importStyle('./src/layouts/dashboard/stats/_styles/GenerateRaport.css');
