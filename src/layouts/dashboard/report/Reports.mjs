const Report = new CjsComponent((data) => {
    const { date, user, reportWeight, reportSize } = data;

    return `
        <div class="report">
            <div class="details">
                <p><strong>Data:</strong> ${date}</p>
                <p><strong>Użytkownik:</strong> ${user}</p>
                <p><strong>Waga raportu:</strong> ${reportWeight} KB</p>
                <p><strong>Rozmiar:</strong> ${reportSize}</p>
            </div>
            <button>Usuń raport</button>
        </div>
    `;
});

export const Reports = new CjsComponent((data) => {
    return `
        <div class="reports">
                ${Report.render({
        date: '2025-02-18',
        user: 'Admin',
        reportWeight: '150',
        reportSize: '1.2 MB'
    })}
                ${Report.render({
        date: '2025-02-17',
        user: 'Anna Nowak',
        reportWeight: '250',
        reportSize: '1.5 MB'
    })}
                ${Report.render({
        date: '2025-02-16',
        user: 'Michael Smith',
        reportWeight: '100',
        reportSize: '800 KB'
    })}
                ${Report.render({
        date: '2025-02-16',
        user: 'Michael Smith',
        reportWeight: '100',
        reportSize: '800 KB'
    })}
                ${Report.render({
        date: '2025-02-16',
        user: 'Michael Smith',
        reportWeight: '100',
        reportSize: '800 KB'
    })}
                ${Report.render({
        date: '2025-02-16',
        user: 'Michael Smith',
        reportWeight: '100',
        reportSize: '800 KB'
    })}
                ${Report.render({
        date: '2025-02-16',
        user: 'Michael Smith',
        reportWeight: '100',
        reportSize: '800 KB'
    })}
                ${Report.render({
        date: '2025-02-16',
        user: 'Michael Smith',
        reportWeight: '100',
        reportSize: '800 KB'
    })}
        </div>
    `;
});

Report.importStyle('./src/layouts/dashboard/report/_styles/Reports.css');
Reports.importStyle('./src/layouts/dashboard/report/_styles/Reports.css');
