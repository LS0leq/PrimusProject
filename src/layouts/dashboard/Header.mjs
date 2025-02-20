
export const Header = new CjsComponent((data) => {
    const { title,text,user } = data;

    return `
        <div class="header">
            <p class="title">${title}</p>
            <h2>${text} ${user}</h2>
        </div>
    `;
});

Header.setDefaultData({ title: "Example title" ,text:"Witaj ponownie, ",user:"Admin"});
Header.importStyle('./src/layouts/dashboard/_styles/Header.css');