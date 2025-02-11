export const Wrapper = new CjsComponent((data) => {
    
    return `
        <div class="wrapper">
            Report wrapper component works!
        </div>
    `;
});

Wrapper.importStyle('./src/layouts/dashboard/report/_styles/Wrapper.css');