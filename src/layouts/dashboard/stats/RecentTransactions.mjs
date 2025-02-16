const Transactions = new CjsComponent((data) => {
    const { icon, alt, text, value,date} = data;

    return `
        <div class="transaction">
            <img src="${icon}" alt="${alt}">
            <div>
                <p>
                    ${text}
                    <span>${date}</span
                </p>
                <p class="price">${value}</p>
            </div>
        </div>
    `;
});

export const RecentTransactions = new CjsComponent((data) => {

    return `
        <div class="recent-transactions">
            <div class="transactions">
                ${Transactions.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Jan Kowalski',date:'29 Feb', value: '+2000 zł'})}
                ${Transactions.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Jan Tesla',date:'31 Feb', value: '+19.2k zł'})}
                ${Transactions.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'John Deree',date:'32 Feb', value: '+21.1k zł'})}
            </div>    
        </div>
    `;
});

RecentTransactions.importStyle('./src/layouts/dashboard/stats/_styles/RecentTransactions.css');