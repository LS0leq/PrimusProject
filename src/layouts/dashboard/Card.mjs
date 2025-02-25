export const Card = new CjsComponent((data) => {
    const { title, style } = data;

    return `
        <div class="card" style="${style}">
            <p class="title">${title}</p>
        </div>
    `;
});

Card.setDefaultData({ title: "Example title", style: "" });

Card.importStyle('./src/layouts/dashboard/_styles/Card.css');
