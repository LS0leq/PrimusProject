
const Li = new CjsComponent((data) => {
    const { icon, alt, text, search, active } = data;

    const click = (e) => {
        Search.set(search);

        Li.components.classList.addOnlyRemoveOthers("active", e.component);
    }

    return `
        <li ${onClick(click)} ${strif(active, `class="active"`)}>
            <img src="${icon}" alt="${alt}" /><p> ${text}</p>
        </li>
    `;
});

export const SideNav = new CjsComponent((data) => {
    
    return `
        <nav class="sideNav">
            <div>
                <img src="${jpg(`defaultLogo`)}" alt="Login Image" />
                <div class="UserName">Admin</div>
            </div>
            
           <div>
               <h2>Menu</h2>
               <ul>
                    ${Li.render({ icon: svg(`nav/stats`), alt: "stats", text: "Statystyki", search: "/dashboard/stats", active: true })}
                    ${Li.render({ icon: svg(`nav/products`), alt: "products", text: "Produkty", search: "/dashboard/products" })}
                    ${Li.render({ icon: svg(`nav/task`), alt: "task", text: "Zadania" })}
                    ${Li.render({ icon: svg(`nav/report`), alt: "report", text: "Raporty", search: "/dashboard/report" })}
                </ul>
           </div>
            
            <div>
               <h2>Konto</h2>
                <ul>
                    ${Li.render({ icon: svg(`nav/account`), alt: "account", text: "Konto" })}
                    ${Li.render({ icon: svg(`nav/message`), alt: "message", text: "Wiadomości" })}
                </ul>
            </div>
        </nav>
    `;
});

Li.setDefaultData({
    icon: "",
    alt: "",
    text: "",
    search: "",
    active: false
});

Li.importStyle('./src/layouts/pages/dashboard/_styles/SideNav.css');
SideNav.importStyle('./src/layouts/pages/dashboard/_styles/SideNav.css');