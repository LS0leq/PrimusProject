export const Card = new CjsComponent((data) => {
    const { title } = data;

    return `
        <div class="card">
            <p class="title">${title}</p>
        </div>
    `;
});

Card.setDefaultData({ title: "Example title"});

Card.importStyle('./src/layouts/dashboard/_styles/Card.css');
