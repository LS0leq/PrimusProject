export const GenerateRaport = new CjsComponent((data) => {
    return `
        <div class="generate-raport">
            <div>
                <button data-range="day">Ostatni dzień</button>
                <button data-range="week">Ostatni tydzień</button>
                <button data-range="month">Ostatni miesiąc</button>
            </div>
            
            <div class="generate">
                <div>
                    <input type="date" id="start-date" class="date-picker" />
                </div>
                    <span> - </span>
                <div>
                    <input type="date" id="end-date" class="date-picker" />
                </div>
            
                <button>Generuj raport</button>
        </div>
        </div>
    `;
});

GenerateRaport.importStyle('./src/layouts/dashboard/report/_styles/GenerateRaport.css');

