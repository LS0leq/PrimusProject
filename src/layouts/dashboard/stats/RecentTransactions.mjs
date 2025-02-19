const Transaction = new CjsComponent((data) => {
    const { icon, alt, text, value,date} = data;

    return `
        <div class="transaction">
            <div class="box">
                <img src="${icon}" alt="${alt}">
                 <p>
                    ${text}
                    <span>${date}</span
                </p>
            </div>
            <p class="price">${value}</p>
        </div>
    `;
});

export const RecentTransactions = new CjsComponent((data) => {

    return `
        <div class="recent-transactions">
            <div class="transactions">
                ${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Jan Kowalski', date:'12 Jan', value: '+1,530 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Anna Nowak', date:'5 Feb', value: '+720 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Michael Smith', date:'23 Mar', value: '+9,800 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Elon Gates', date:'8 Apr', value: '+15,400 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Natalia Brown', date:'17 May', value: '+2,250 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'David White', date:'30 Jun', value: '+4,670 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Olivia Johnson', date:'11 Jul', value: '+6,900 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Lucas Martin', date:'22 Aug', value: '+980 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Emma Wilson', date:'3 Sep', value: '+3,210 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'John Deree', date:'14 Oct', value: '+11,200 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Sophia Lee', date:'27 Nov', value: '+5,400 zł'})}
${Transaction.render({icon: './src/assets/svg/dashboard/pfp.svg', alt: 'transaction', text: 'Chris Evans', date:'6 Dec', value: '+8,750 zł'})}

            </div>    
        </div>
    `;
});

Transaction.importStyle('./src/layouts/dashboard/stats/_styles/RecentTransactions.css');
RecentTransactions.importStyle('./src/layouts/dashboard/stats/_styles/RecentTransactions.css');