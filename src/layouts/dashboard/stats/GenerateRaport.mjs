export const GenerateRaport = new CjsComponent((data) => {
    return `
        <div class="generate-raport">
            <div>
<!--                <label for="start-date">Od:</label>-->
                <input type="date" id="start-date" class="date-picker" />
            </div>
                <span> - </span>
            <div>
<!--                <label for="end-date">Do:</label>-->
                <input type="date" id="end-date" class="date-picker" />
            </div>
            
            <button>Generuj raport</button>
            
            
           
            
        </div>
    `;
});



GenerateRaport.importStyle('./src/layouts/dashboard/stats/_styles/GenerateRaport.css');


// ${Button.render({
//     text: "Generuj raport",
//     click: () => { console.log("Generowanie raportu..."); }
// })}