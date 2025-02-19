export const Income = new CjsComponent((data) => {
    setTimeout(() => {
        const canvas = document.getElementById('incomeChart');
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        const incomeData = {
            labels: [
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
                '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
            ],
            datasets: [{
                label: 'Średnia ilość użytkowników',
                backgroundColor: '#3A9D65',
                borderColor: '#3A9D65',
                borderWidth: 1,
                data: [0, 2, 1, 1, 0, 3, 3, 2, 4, 4, 3, 4, 4, 5, 8, 7, 9, 6, 7, 9, 4, 5, 3, 2],
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: incomeData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0
                        }
                    },
                    y: {
                        grid: { display: false },
                        beginAtZero: true
                    }
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
