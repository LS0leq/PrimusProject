export const Income = new CjsComponent((data) => {
    setTimeout(() => {
        const canvas = document.getElementById('incomeChart');
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
        gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
        gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)');
        gradientStroke.addColorStop(0, 'rgba(66,134,121,0)');

        const incomeData = {
            labels: [
                'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
                'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
            ],
            datasets: [{
                label: '',
                fill: true,
                backgroundColor: gradientStroke,
                borderColor: '#3A9D65',
                borderWidth: 2,
                pointBackgroundColor: '#3A9D65',
                pointBorderColor: 'rgba(255,255,255,0)',
                pointHoverBackgroundColor: '#00d6b4',
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: [5698, 6878, 5735, 5664, 6629, 6128, 6965, 6688, 6641, 5221, 6201, 6582, 6063, 5468, 6503, 6389, 6416, 6952, 7123, 6343, 6284, 6442, 6667, 6405],
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: incomeData,
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: false },
                    x: { grid: { display: false } },
                    y: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }, 100);

    return `
        <div class="income">
            <canvas id="incomeChart"></canvas>
        </div>
    `;
});

Income.importStyle('./src/layouts/dashboard/stats/_styles/Income.css');
