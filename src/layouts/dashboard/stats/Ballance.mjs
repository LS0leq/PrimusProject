export const Ballance = new CjsComponent((data) => {
    
    return `
        <div class="ballance">
            <p class="amount">24,912,145 zł</p>
            <div class="box">
                <img src="${svg(`dashboard/trendup`)}"/>
                <p>5.3%</p>
            </div>
<!--                <p> vs ostatni miesiąc </p>-->
        </div>
    `;
});

Ballance.importStyle('./src/layouts/dashboard/stats/_styles/Ballance.css');