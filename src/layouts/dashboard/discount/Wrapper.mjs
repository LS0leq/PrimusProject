export const Wrapper = new CjsComponent((data) => {
    const { class:className } = data;
    return `
        <div class="${className}">
            
        </div>
    `;
});

Wrapper.setDefaultData({ title: "wrapper"});
Wrapper.importStyle('./src/layouts/dashboard/_styles/Wrapper.css');