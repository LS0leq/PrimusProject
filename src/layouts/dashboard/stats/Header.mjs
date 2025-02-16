
export const Header = new CjsComponent((data) => {
    const { title } = data;

    return `
        <div class="header">
            <p class="title">${title}</p>
            <h2>Witaj ponownie, Admin!</h2>
        </div>
    `;
});

Header.setDefaultData({ title: "Example title" });

Header.importStyle('./src/layouts/dashboard/stats/_styles/Header.css');