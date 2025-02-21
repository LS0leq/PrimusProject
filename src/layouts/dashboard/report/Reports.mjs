import { DeleteButton } from "../../../components/buttons/DeleteButton.mjs";

const Report = new CjsComponent((data) => {
    const { date, user, reportWeight, reportSize, id, onDelete } = data;

    return `
        <div class="report list" id="report-${id}">
            <div class="details">
                <p><strong>Data:</strong> ${date}</p>
                <p><strong>Użytkownik:</strong> ${user}</p>
                <p><strong>Waga raportu:</strong> ${reportWeight} KB</p>
                <p><strong>Rozmiar:</strong> ${reportSize}</p>
                <p><strong>Status:</strong> ${reportSize}</p>
            </div>
            <div class="actions">
                ${DeleteButton.render({ click: () => onDelete(id) })}
            </div>
        </div>
    `;
});

export const Reports = new CjsComponent(() => {
    const reportsData = localStorage.getItem('reports');
    let reports = JSON.parse(reportsData) || [];

    if (!reportsData || reports.length === 0) {
        const exampleReports = [
            { id: 1, date: '2025-02-18', user: 'Admin', reportWeight: '150', reportSize: '1.2 MB' },
            { id: 2, date: '2025-02-17', user: 'Anna Nowak', reportWeight: '250', reportSize: '1.5 MB' },
            { id: 3, date: '2025-02-16', user: 'Michael Smith', reportWeight: '100', reportSize: '800 KB' }
        ];
        localStorage.setItem('reports', JSON.stringify(exampleReports));
        reports = exampleReports;
    }

    window.handleDelete = (id) => {
        reports = reports.filter(report => report.id !== id);
        localStorage.setItem('reports', JSON.stringify(reports));
        renderReports();
    };

    const renderReports = () => {
        const reportsContainer = document.querySelector('.reports');
        if (reportsContainer) {
            reportsContainer.innerHTML = reports.map(report => {
                return `
                    <div id="report-${report.id}">
                        ${Report.render({ ...report, onDelete: handleDelete })}
                    </div>
                `;
            }).join('');
        }
    };

    setTimeout(() => {
        const reportsContainer = document.querySelector('.reports');
        if (reportsContainer) {
            renderReports();
        }
    }, 100);

    return `
        <div class="reports">
        </div>
    `;
});

Report.importStyle('./src/layouts/dashboard/report/_styles/Reports.css');
Report.importStyle('./src/layouts/dashboard/_styles/List.css');
Reports.importStyle('./src/layouts/dashboard/report/_styles/Reports.css');
