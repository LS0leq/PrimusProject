export const Ballance = new CjsComponent((data) => {
    
    return `
        <div class="ballance">
            <h2>Balans Konta</h2>
            <div class="ballance-info">
                <p>24,912,145 zł</p>
                <span><img src="${svg(`dashboard/trendup`)}"/>5.3%</span>
                <p> vs ostatni miesiąc </p>
            </div>
        </div>
    `;
});

Ballance.importStyle('./src/layouts/dashboard/stats/_styles/Ballance.css');